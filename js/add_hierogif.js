console.log("add_hierogif.js");

(function() {
	//encode JSON to URI
	//http://hierogifics.herokuapp.com/db/create/json_encoded_page
	//$.get("http://hierogifics.herokuapp.com/db/create/" + encoded_JSON);

	$("img").click(function() {
		console.log($(this).html);
	});
})();