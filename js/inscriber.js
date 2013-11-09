console.log("inscriber.js loaded");

(function () {

	//retrieve page information
	var url = window.location.origin + window.location.pathname;

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

	var placeGIF = function() {

		for(var i = 0; i < data.gifs.length; i++) {
			//find element
			var element = jQuery.parseHTML(data.gifs[i].id);
			var target = null;
			if(element[0].localName.localeCompare("img") == 0) {
				target = $("img[src='" + element[0].src.substring(5) + "']");
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
			$(target).after("<img src='" + data.gifs[i].gif_url + "' class='hidden-hierogif'>");
			$(target).mouseover(function() {
				$(this).next().removeClass("hidden-hierogif").addClass('revealed-hierogif');
				});
		}

	};

	var insertAfterElement = function(element) {
		element.after("<img src='" + data.gifs[i].gif_url + "' class='hidden-hierogif'>");
		element.mouseover(function() {
			$(this).next().removeClass("hidden-hierogif").addClass('revealed-hierogif');
			});
	}

	placeGIF();

})();