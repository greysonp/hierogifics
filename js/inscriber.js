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
					$(target).css("position","absolute");
					$(target).after("<img src='" + json[i].gif_url + "' class='hidden-hierogif'>");
					$(target).mouseover(function() {
						
						$(this).next().removeClass("hidden-hierogif").addClass('revealed-hierogif');
						$(this).next().css("position", "absolute");
						$(this).next().css("width","0px");
						$(this).next().css("height","0px");
						$(this).next().css("left", "'" + $(target).offset().left + "px'");
						$(this).next().css("top", "'" + $(target).offset().top + "px'");
						

						$(this).next().animate({
							height: $(target).css("height"),
							width: $(target).css("width"),
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

