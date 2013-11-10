console.log("inscriber.js loaded");

(function () {
	//retrieve page information
	var url = window.location.origin + window.location.pathname;
	//url = url.substring(document.location.protocol.length + 2);
	//var pattern = /\//g;
	//url = url.replace(pattern, ".");


	console.log("url: " + encodeURIComponent(url));

	// "http://hierogifics.herokuapp.com/db/read/" + encodeURIComponent(url), function(data) {
	$.get("http://localhost:5000/db/read/" + encodeURIComponent(url), function(json) {
	    console.log(json);
	    if (!json.error){
	    	placeGIF(json);
	    }
	    else {
	    	console.log("No images on this page.");
	    }
    });


	var placeGIF = function(json) {
		console.log(json.length);
		for(var i = json.length - 1; i >= 0; i--) {
			//find element
			console.log("JSON: " + json[i])
			console.log("SEARCH FOR: " + json[i].id);
			var $target = $("img[src='" + json[i].id + "']");
			console.log("MATCHING COUNT: " + $target.length);

			//Means the element to hide things under was found
			if($target.length != 0) {
				// Add favicon indicating there's a gific here
				$('link[rel="shortcut icon"]').remove();
				$('head').append('<link href="http://www.clipartpal.com/_thumbs/pd/A_as_in_water.png" rel="shortcut icon" type="image/x-icon" />');

				// Add event to the target image
				// $target.css("position","absolute");
				$("body").append("<img src='" + json[i].gif_url + "' class='hidden-hierogif'>");

				(function(js){
					$target.on("mouseenter", function(e) {
						kickoffReveal(e, js.id, js.gif_url);
						$(this).off();
					});
				})(json[i]);
				json[i].id = null;
				json.splice(i, 1);
			}
		}
	};

	function kickoffReveal(e, targetId, buriedSrc) {
		// Get reference to buried image
		var $buried = $("img[src='" + buriedSrc + "']");

		// Darken background
		$buried.before("<div class='gifics-modal-blackout'></div>");
		var $blackout = $(".gifics-modal-blackout")

		// Add congrats text
		$score = $("<h1>YOU EARNED 150 POINTS!</h1>");
		$("body").append($score);
		$score.css("position", "fixed");
		$score.css("top", "50px");
		$score.css("width", "100%");
		$score.css("text-align", "center");
		$score.css("color", "white");
		$score.css("font-size", "72px");
		
		//Removes the image pulled out and the black background
		var _this = this;
		$blackout.click(function(){
			$(_this).off();
			$buried.fadeOut(250, function() { $buried.remove() });
			$blackout.fadeOut(250, function() {$buried.remove(); });
			$score.fadeOut(250, function() {$score.remove(); });
		});

		// Fade in the blackout
		$blackout.css("opacity", 0);

		$blackout.animate({"opacity": 0.85}, 250, function() {
			// Scale-in image
			var w = $buried.width();
			var h = $buried.height();
			$buried.removeClass("hidden-hierogif").addClass("revealed-hierogif");
			$buried.css("position", "fixed");
			$buried.css("width","0");
			$buried.css("height","0");
			$buried.css("left", window.innerWidth/2 + "px");
			$buried.css("top", window.innerHeight/2 + "px");

			$buried.animate({
				"height": h,
				"width": w,
				"left": window.innerWidth/2 - w/2,
				"top": window.innerHeight/2 - h/2
			}, 1000);
		});
		
	}			

})();


//That element was not found on this page
// else{
// 		 Was not time to implement properly, will delete from the DB by hand. This would be the required request
// 		$.get("http://hierogifics.herokuapp.com/db/remove/", {gif_id: json[i].gif_id}, function(data) {
//             json = JSON.parse(data);
//             if(json){
//                 console.log(json);
// 	        }
// 	        else{
//                 console.log("DID NOT GET DATA BACK CORRECTLY");
//             }
//         });
		
// }

