(function() {
	//encode JSON to URI
	//http://hierogifics.herokuapp.com/db/create/json_encoded_page
	//$.get("http://hierogifics.herokuapp.com/db/create/" + encoded_JSON);

	// Listening for right click action
	chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
		console.log("got a request");
        if (request.bury) {
        	console.log("got a bury request");
        	makeModal(request.bury);
   //      	var gif_url = window.prompt("Please enter the url of your gif to hide it under this image element: ");
			// var userCat = window.prompt("Please categorize this gif");
			
            
        }
    });

    function makeModal(imgUrl) {
    	$.get(chrome.extension.getURL("html/modal.html"), function(data) {
    		$(data).insertBefore("#js-toolbelt");
    		$(".gifics-modal").css("left", ($(window).width() - 300)/2);
    		$("#js-nm-button").click(clearModal);
    		$("#js-bury-button").click(function(e) {
    			 postGific(imgUrl, $("#js-buried-url").val());
    			 clearModal();
    		});
    	});
    }

    function clearModal() {
    	$(".gifics-modal").remove();
    	$(".gifics-modal-blackout").remove();
    }

    function postGific(e, targetId, buriedSrc) {
    	var userID = "cheese";

		console.log("gif_url: " + buriedSrc);
		console.log("gifs_id: " + targetId);
		console.log("userID: " + userID);

		//retrieve page information
		var url = window.location.origin + window.location.pathname;
		console.log("url:" + url);

		if(typeof gif_url !== "undefined" && gif_url !== null && typeof userCat !== "undefined" && typeof userCat !== "undefined")
		$.get("http://hierogifics.herokuapp.com/db/create/" + encodeURIComponent(JSON.stringify({"url": url, "gifs": [{"id": targetId, "user_id": userID, "gif_url": buriedSrc, "category": ""}]})), function(){
				console.log("MIKE TOTH WAS HERE");
		});
    }

})();