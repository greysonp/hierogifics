$(document).ready(function(){
	var clue_data = "";
			var counter = 0;

	$.get("http://hierogifics.herokuapp.com/db/read/random/page", function(data) {
		clue_data = JSON.parse(data);
		

		$("#clue-button").click(function() {
			console.log("welp");

			// maybe strip number off the end of path
			// wrap url as a link
			if(counter < clue_data.length) {
				$("#clue-box").text("Clue: " + clue_data[counter].name + " " + clue_data[counter].text);
				counter++;
				if(counter == clue_data.length) {
					counter = 0;
				}
			}

		});
	});
});