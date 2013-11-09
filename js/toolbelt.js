console.log("toolbelt.js loaded");

$.get(chrome.extension.getURL("html/toolbelt.html"), function(data) {
    $("body").append(data);
});

Mousetrap.bind("command+shift+up", function(e) {
    console.log("Hello");
    showBelt();
    return false;
});

Mousetrap.bind("command+shift+down", function(e) {
    console.log("Goodbye");
    hideBelt();
    return false;
});

function showBelt() {
    $("#js-toolbelt").animate({"bottom": "0"}, 250);
}

function hideBelt() {
    $("#js-toolbelt").animate({"bottom": "-150px"}, 250);
}