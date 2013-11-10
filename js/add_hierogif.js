console.log("add_hierogif.js");

(function() {
	//encode JSON to URI
	//http://hierogifics.herokuapp.com/db/create/json_encoded_page
	//$.get("http://hierogifics.herokuapp.com/db/create/" + encoded_JSON);
	$("img").click(function() {	
		var gif_url = window.prompt("Please enter the url of your gif to hide it under this image element: ");
		var userCat = window.prompt("Please categorize this gif");
		var userID = "cheese";
		var gifs_id = this.src;

		console.log("gif_url: " + gif_url);
		console.log("userCat: " + userCat);
		console.log("gifs_id: " + gifs_id);
		console.log("userID: " + userID);


		//retrieve page information
		var url = window.location.origin + window.location.pathname;
			//Gets the backslashes out
		//url = encodeURIComponent(url);

		console.log("url:" + url);

		$.get("http://hierogifics.herokuapp.com/db/create/" + encodeURIComponent(JSON.stringify({"url": url, "gifs": [{"id": gifs_id, "user_id": userID, "gif_url": gif_url, "category": userCat}]})), function(){
				console.log("MIKE TOTH WAS HERE");



		});
	});
})();