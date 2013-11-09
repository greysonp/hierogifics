console.log("parser.js loaded");

(function() {

	var data;

	chrome.storage.sync.get("categories", function(categoriesObj) {
		initParser(categoriesObj);
    });

	var inputHandler = function(event) {
		getValidTags(event.target);
	};

	var getValidTags = function (field) {
	var text = field.value;
	var pattern = /{{([^{}\s]*?)}}/;

	var match = null;
	var count = 0;
	while((match = pattern.exec(text)) !== null) {
		//console.log("Match at index " + match.index);
		//console.log("\tMatch: " + match[1]);

		//check match subpatterns
		// {{#label}}
		// {{&label}}
		// {{label#(N)}}
		var giphy = false;
		var stackPattern = /#(.*)$/g;
		var randomPattern = /&(.*)$/g;
		var numPattern = /([^#].*)#([0-9]+)/g;
		var subMatch = null;
		var handledText = "";

		var label = match[1];
		var gifIndex = 0;

		if(subMatch = numPattern.exec(match[1])) {
			//console.log("num pattern: " + subMatch[1] + " number " + subMatch[2]);
			handledText = "[" + subMatch[1] + " number " + subMatch[2] + "]";
			label = subMatch[1];
			gifIndex = parseInt(subMatch[2]) - 1;
		}
		else if(subMatch = stackPattern.exec(match[1])) {
			//console.log("stack pattern: " + subMatch[1]);
			handledText = "[Smart stack " + subMatch[1] + "]";
			//giphy url with label
			var json = $.get("http://hierogifics.herokuapp.com/" + subMatch[1]);
			console.log(subMatch[1]);
			console.log(json);
			var index = Math.floor(Math.random()*json.data.length);
			handledText = json.data[index].url;
			giphy = true;

		}
		else if(subMatch = randomPattern.exec(match[1])) {
			//console.log("random pattern: " + subMatch[1]);
			handledText = "[Random from " + subMatch[1] + "]";
			label = subMatch[1];
			if(categoryIndexOf(label) !== -1)
				gifIndex = Math.floor(Math.random()*data.categories[categoryIndexOf(label)].gifs.length);
		}

		if(!giphy) {
			var index = -1;
			//console.log(label + "[" + gifIndex + "]");
			if((index = categoryIndexOf(label)) !== -1)
				handledText = data.categories[index].gifs[gifIndex%data.categories[index].gifs.length].animated;
			else
				handledText = "[invalid category]";
		}

		text = text.replace("{{" + match[1] + "}}", handledText);
		//console.log("remaining: " + text);
		//process match
	}
	//console.log("Matching complete");

	field.value = text;

	return text;
	};

	var categoryIndexOf = function(label) {
		for(var i = 0; i < data.categories.length; i++) {
			if(data.categories[i].name.localeCompare(label) === 0) return i;
		}
		return -1
	}

	var initParser = function(categoriesObj) {
		$("input").add($("textarea")).on("input", null, null, inputHandler);
		data = categoriesObj;
	}
})();

// Double curly braces include GIFs in a textbox {{ }}
// {{label}} = add the default GIF in a stack. 
// {{#label}} = add the default GIF in the Smart Stack
// {{&label}} = adds a random GIF from the stack
// {{label#3}} = adds the third GIF in the stack (works with any number)