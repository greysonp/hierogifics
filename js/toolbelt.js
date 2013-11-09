(function() {
    $.get(chrome.extension.getURL("html/toolbelt.html"), function(data) {
        $("body").append(data);
        $("#js-next-button").click(nextCategory);
    });

    Mousetrap.bind("command+shift+up", function(e) {
        showBelt();
        return false;
    });

    Mousetrap.bind("command+shift+down", function(e) {
        hideBelt();
        return false;
    });

    function showBelt() {
        $("#js-toolbelt").animate({"bottom": "0"}, 250);
    }

    function hideBelt() {
        $("#js-toolbelt").animate({"bottom": "-150px"}, 250);
    }

    function nextCategory() {
        console.log("hello");
        $("#js-belt ol").append($("#js-belt ol li:first"));
    }
})();