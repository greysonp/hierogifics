console.log("inscriber.js loaded");

(function () {

	//retrieve page information
	var url = window.location.origin + window.location.pathname;
	//url = url.substring(document.location.protocol.length + 2);
	//var pattern = /\//g;
	//url = url.replace(pattern, ".");


	console.log(url);
	$.get( //insert link
		"http://hierogifics.herokuapp.com/db/read/" + encodeURIComponent(url), function(data) {
        var json = JSON.parse(data);
	    if(json){
		    console.log(json);
		    placeGIF(json);
	    }
	    else{
		    console.log("DID NOT GET DATA BACK CORRECTLY");
	    }
    });


	var placeGIF = function(json) {
		console.log(json.length);
		for(var i = 0; i < json.length; i++) {
			//find element
			//var element = jQuery.parseHTML(json[i].id);
			console.log("JSON: " + json[i])
			
			console.log("SEARCH FOR: " + json[i].id);

			target = $("img[src='" + json[i].id + "']");
				//Means the element to hide things under was found

				console.log("MATCHING COUNT: " + target.length);
				console.log("HEIGHT:" + $(target).css("position") + "\n\nWIDTH: " + $(target).offset().top);
				if(target.length != 0){

					$(target).after("<img src='" + json[i].gif_url + "' class='hidden-hierogif'>");
					$(target).mouseover(function() {
						var w = $(this).next().width();
						var h = $(this).next().height();
						$(this).next().removeClass("hidden-hierogif").addClass('revealed-hierogif');
						$(this).next().css("position", "absolute");
						$(this).next().css("width","0px");
						$(this).next().css("height","0px");
						$(this).next().css("left", "'" + ($(window).width()/2 - $(this).next().width() / 2) + "px'");
						$(this).next().css("top", "'" + ($(window).height()/2 - $(this).next().height() / 2) + "px'");
						

						$(this).next().animate({
							height: h,
							width: w,

							//This will black out the screen and display a congrats message
							$(body).append("<div class ='blackOut'></div>");
							$(".blackOut").css("width", "100%");
							$(".blackOut").css("height", "100%");
							$(".blackOut").css("opacity", "75%");
							$(".blackOut").append("<h2>CONGRATS YOU EARNED 150 POINTS</h2>").css("color","yellow");


							//Removes the image pulled out and the black background
							$(".blackOut").onclick(function(){
								$("img[src='" + json[i].gif_url + "']").remove();
								$(".blackOut").remove();
							})
							//$(target).offset().top + "'",
							//left: "'" + $(target).offset().left + "'"
						}, 4000);
					});
				}
					//That element was not found on this page
				else{
						/* Was not time to implement properly, will delete from the DB by hand. This would be the required request
						$.get("http://hierogifics.herokuapp.com/db/remove/", {gif_id: json[i].gif_id}, function(data) {
	                        json = JSON.parse(data);
		                    if(json){
			                    console.log(json);
	            	        }
	            	        else{
			                    console.log("DID NOT GET DATA BACK CORRECTLY");
		                    }
	                    });
						*/
				}
		}
	};			

})();

