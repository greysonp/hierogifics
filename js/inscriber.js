console.log("inscriber.js loaded");

(function () {

	//retrieve page information
	var url = window.location.origin + window.location.pathname;
	var data;

	var json = $.get( //insert link
		"http://hierogifics.herokuapp.com/db/read/" + url);
	//Received valid input
	if(json){
		data = json;
		alert(data);
	}
	else{
		alert("DID NOT GET DATA BACK CORRECTLY");
	}

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

/*
	var data =  {
    url: "http://en.wikipedia.org/wiki/Magnetism", // url of the page
    gifs: [
        {
            id: '<img alt="" src="//upload.wikimedia.org/wikipedia/commons/thumb/9/93/Magnetic_quadrupole_moment.svg/240px-Magnetic_quadrupole_moment.svg.png" width="240" height="238" class="thumbimage" srcset="//upload.wikimedia.org/wikipedia/commons/thumb/9/93/Magnetic_quadrupole_moment.svg/360px-Magnetic_quadrupole_moment.svg.png 1.5x, //upload.wikimedia.org/wikipedia/commons/thumb/9/93/Magnetic_quadrupole_moment.svg/480px-Magnetic_quadrupole_moment.svg.png 2x">', // unique ID for html element
            user_id: 0, // user who uploaded the gif
            gif_url: "http://24.media.tumblr.com/200bdf0364f5482e3afbfe03f51b6f9d/tumblr_mghlfuodK01rjf826o1_400.gif", // url of where the gif is located (giphy, etc)
            category: "party" // Happy, angry, sad, etc
        },
        {
            id: '<img alt="Solenoid" src="//upload.wikimedia.org/wikipedia/commons/thumb/0/0d/VFPt_Solenoid_correct2.svg/190px-VFPt_Solenoid_correct2.svg.png" width="190" height="78" srcset="//upload.wikimedia.org/wikipedia/commons/thumb/0/0d/VFPt_Solenoid_correct2.svg/285px-VFPt_Solenoid_correct2.svg.png 1.5x, //upload.wikimedia.org/wikipedia/commons/thumb/0/0d/VFPt_Solenoid_correct2.svg/380px-VFPt_Solenoid_correct2.svg.png 2x">', // unique ID for html element
            user_id: 1, // user who uploaded the gif
            gif_url: "http://24.media.tumblr.com/200bdf0364f5482e3afbfe03f51b6f9d/tumblr_mghlfuodK01rjf826o1_400.gif", // url of where the gif is located (giphy, etc)
            category: "party" // Happy, angry, sad, etc
        }
        ],
    clues: [
        {} // seems like a good place for it. Will figure it out later
    ]
};
*/
	var placeGIF = function() {
		for(var i = 0; i < data.gifs.length; i++) {
			//find element
			var element = jQuery.parseHTML(data.gifs[i].id);
			var target = null;
			if(element[0].localName.localeCompare("img") == 0) {
				target = $("img[src='" + element[0].src.substring(5) + "']");
				//Means the element to hide things under was found
				if(target.length != 0){
					$(target).after("<img src='" + data.gifs[i].gif_url + "' class='hidden-hierogif'>");
					$(target).mouseover(function() {
					$(this).next().removeClass("hidden-hierogif").addClass('revealed-hierogif');
				});
				}
				//That element was not found on this page
				else{
					$.get(
					    //delete get url here
					    "http://hierogifics.herokuapp.com/db/remove/",
					     {gif_id: data.gifs[i].gif_id});
				}

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
			}
		}
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

	};

	placeGIF();

})();
