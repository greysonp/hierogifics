console.log("inscriber.js loaded");

(function () {

	//retrieve page information
	var url = window.location.origin + window.location.pathname;
	url = url.substring(document.location.protocol.length + 2);
	//var pattern = /\//g;
	//url = url.replace(pattern, ".");

/*
	console.log(encodeURIComponent(url));
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
*/
        //Received valid input

/*
	$.get(
    //insert get url here
    "index.php",
    {   type: "GET",
    //List of parameters to pass to the DB
        data: {url: url,more query elements} ,
        dataType: "json",
        success: function(json) {
            data = json;
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert("Error: " + jqXHR.responseText);
            alert("Error: " + textStatus);
            alert("Error: " + errorThrown);
        }
    });

    */


	var json =  {
    url: "http://en.wikipedia.org/wiki/Magnetism", // url of the page
    gifs: [
        {
            id: '//upload.wikimedia.org/wikipedia/commons/thumb/9/93/Magnetic_quadrupole_moment.svg/240px-Magnetic_quadrupole_moment.svg.png',
            user_id: 0, // user who uploaded the gif
            gif_url: "http://24.media.tumblr.com/200bdf0364f5482e3afbfe03f51b6f9d/tumblr_mghlfuodK01rjf826o1_400.gif", // url of where the gif is located (giphy, etc)
            category: "party" // Happy, angry, sad, etc
        },
        {
            id: '//upload.wikimedia.org/wikipedia/commons/thumb/0/0d/VFPt_Solenoid_correct2.svg/190px-VFPt_Solenoid_correct2.svg.png',
            user_id: 1, // user who uploaded the gif
            gif_url: "http://24.media.tumblr.com/200bdf0364f5482e3afbfe03f51b6f9d/tumblr_mghlfuodK01rjf826o1_400.gif", // url of where the gif is located (giphy, etc)
            category: "party" // Happy, angry, sad, etc
        }
        ]
    //clues: [Replaced http://i.imgur.com/b3pgP1r.gif 
        //{} // seems like a good place for it. Will figure it out later
    //]
};

	var placeGIF = function(json) {
		console.log(json.gifs.length);
		for(var i = 0; i < json.gifs.length; i++) {
			//find element
			//var element = jQuery.parseHTML(json[i].id);
			console.log("JSON: " + json.gifs[i])
			
			console.log("SEARCH FOR: " + json.gifs[i].id);

			target = $("img[src='" + json.gifs[i].id + "']");
				//Means the element to hide things under was found

				console.log("MATCHING COUNT: " + target.length);

				if(target.length != 0){
					$(target).after("<img src='" + json.gifs[i].gif_url + "' class='hidden-hierogif'>");
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
	placeGIF(json);

})();










	/*
						$.get(
						    //delete get url here
						    "http://hierogifics.herokuapp.com/db/remove/gif/",
						    {   type: "GET",
						    //List of parameters to pass to the DB
						        data: {gif_id: data.gifs[i].gif_id more query elements} ,
						        dataType: "json",
						        success: function(json) {
						            //Dont have to do anything just deletes from the DB
						        },
						        error: function(jqXHR, textStatus, errorThrown) {
						        	//Displays an error if the value was not deleted
						            alert("Error: " + jqXHR.responseText);
						            alert("Error: " + textStatus);
						            alert("Error: " + errorThrown);
						        }
						    });

	*/
				
				/*
				else if(element[0].localName.localeCompare("a") == 0) {
					var href = element[0].href;
					if(element[0].href[0] === '/') {
						console.log("replacing");
						var re = new RegExp(window.location.origin, "g");
						element[0].href.replace(re, href);
					}

					target = $("a[href='" + element[0].href.substring(5) + "'][text='" + element[0].text + "']");
				}
				else if(element[0].localName.localeCompare("p") == 0) {
					target = $("p[innerHTML='" + element[0].innerHTML + "']");
				}
				if(!target) {
					continue;
				}
				console.log(target);*/

