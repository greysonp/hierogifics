console.log("parser.js loaded");

//test json object
var data = {
   categories: [    {
       name: "happy",
       symbol: ":)",
       gifs: [{
            "animated": "http://media1.giphy.com/media/q6QHDGE3X4EWA/giphy.gif",
            "use_count": 5
        },
        {
            "animated": "http://media.giphy.com/media/dBu6VX8ZI9pSM/giphy.gif",
            "use_count": 2
        }]
    },
    {
       name: "sad",
       symbol: ":(",
       	gifs: [{
       		"animated": "http://media.giphy.com/media/XAcSy8eyMFpaU/giphy.gif",
       		"use_count": 1
       	},
       	{
       		"animated": "http://media.giphy.com/media/kB1IR4TzOoBnq/giphy.gif",
       		"use_count": 3
       	}]
    },
    {
    	name: "mad",
    	symbol: "D:<",
		gifs: [{
       		"animated": "http://media2.giphy.com/media/vwu9UTwIwFr7G/giphy.gif",
       		"use_count": 4
       	},
       	{
       		"animated": "http://media1.giphy.com/media/zMe5y4Lfy52Sc/giphy.gif",
       		"use_count": 1
       	}]
    }
   ]   
};

(function() {
	var inputHandler = function(event) {
		getValidTags(event.target);
	};

	$("input").add($("textarea")).on("input", null, null, inputHandler);
})();

// Double curly braces include GIFs in a textbox {{ }}
// {{label}} = add the default GIF in a stack. 
// {{#label}} = add the default GIF in the Smart Stack
// {{&label}} = adds a random GIF from the stack
// {{label#3}} = adds the third GIF in the stack (works with any number)

var getValidTags = function (field) {
	var text = field.value;
	var pattern = /{{([^{}\s]*?)}}/;

	var match = null;
	var count = 0;
	while((match = pattern.exec(text)) !== null && count < 10) {
		console.log("Match at index " + match.index);
		console.log("\tMatch: " + match[1]);

		//check match subpatterns
		// {{#label}}
		// {{&label}}
		// {{label#(N)}}
		var stackPattern = /#(.*)$/g;
		var randomPattern = /&(.*)$/g;
		var numPattern = /([^#].*)#([0-9]+)/g;
		var subMatch = null;
		var handledText = "";
		if(subMatch = numPattern.exec(match[1])) {
			console.log("num pattern: " + subMatch[1] + " number " + subMatch[2]);
			handledText = "[" + subMatch[1] + " number " + subMatch[2] + "]";
		}
		else if(subMatch = stackPattern.exec(match[1])) {
			console.log("stack pattern: " + subMatch[1]);
			handledText = "[Smart stack " + subMatch[1] + "]";
		}
		else if(subMatch = randomPattern.exec(match[1])) {
			console.log("random pattern: " + subMatch[1]);
			handledText = "[Random from " + subMatch[1] + "]";
		}
		else {
			//default label
			console.log("default match: " + match[1]);
			

			//move this into function
			var category = null;
			for(var i = 0; i < data.categories.length - 1; i++) {
				if(data.categories[i].name.localeCompare(match[1]) == 0) {
					category = data.categories[i];
					break;
				}
			}

			if(category)
				handledText = category.gifs[0].animated;
			else
				handledText = "[invalid category]";
		}

		text = text.replace("{{" + match[1] + "}}", handledText);
		console.log("remaining: " + text);
		//process match
		count++;
	}
	console.log("Matching complete");

	field.value = text;

	return text;
};