(function() {
    $.get(chrome.extension.getURL("html/toolbelt.html"), function(data) {
        $("body").append(data);
        $("#js-next-button").click(nextCategory);
        $("#js-belt ol li").mouseenter(setScrollToBottom);
        $("#js-belt ol li ol").css("-webkit-mask", "url(" + chrome.extension.getURL("img/toolbar_fade_mask.svg") + ")");
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

    function setScrollToBottom() {
        var elem = $(this).find("ol");
        elem.scrollTop(elem.height());
    }

})();