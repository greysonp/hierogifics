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

				if(target.length != 0){
					$('link[rel="shortcut icon"]').remove();
					$('head').append('<link href="http://www.clipartpal.com/_thumbs/pd/A_as_in_water.png" rel="shortcut icon" type="image/x-icon" />');
					$(target).after("<img src='" + json[i].gif_url + "' class='hidden-hierogif'>");
					$(target).mouseover(function() {
					$(this).next().removeClass("hidden-hierogif").addClass('revealed-hierogif');
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

