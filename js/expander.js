//expander.js IIFE
(function () {

	console.log("expander.js loaded");
	
	$("head").append(""
		 + "<style type='text/css'>"
	 	 + ".hierogifics-expanded-gif {"
	 	 + "	display: block !important;"	
	 	 + "}"
	 	 + "</style>");

	$( "a[href$='.gif']" ).each(function( index ) {
		var anchor = $(this);
		if(anchor.text().localeCompare("") !== 0) {
  			anchor.after("<img src='" + anchor.attr("href") + "' class='hierogifics-expanded-gif'>");
  			//console.log("Replaced " + anchor.attr("href"));
  		}
	});

})();