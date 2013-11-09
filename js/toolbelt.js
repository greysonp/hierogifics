(function() {
    $.get(chrome.extension.getURL("html/toolbelt.html"), function(data) {
        $("body").append(data);

        chrome.storage.sync.get("categories", function(categoriesObj) {
            var categories = categoriesObj.categories;

            for (var i = 0; i < categories.length; i++) {
                var name = categories[i].name;
                var gifs = categories[i].gifs;
                var li = document.createElement("li");
                var ol = document.createElement("ol");

                for (var j = 0; j < gifs.length; j++) {
                    console.log(gifs[j]);
                    var innerLi = document.createElement("li");
                    var img = document.createElement("img");
                    img.src = gifs[j].animated;
                    innerLi.appendChild(img);
                    ol.appendChild(innerLi);
                    if (j == gifs.length - 1) {
                        var img2 = document.createElement("img");
                        img2.src = gifs[j].animated;
                        li.appendChild(img2);
                    }
                }
                li.appendChild(ol);
                $("#js-belt ol")[0].appendChild(li);
            }
            $("#js-next-button").click(nextCategory);
            $("#js-belt ol li").mouseenter(setScrollToBottom);
            $("#js-belt ol li").mouseleave(setScrollToBottom);
            $("#js-belt ol li ol").css("-webkit-mask", "url(" + chrome.extension.getURL("img/toolbar_fade_mask.svg") + ")");
            $("#js-belt ol li ol").bind("mousewheel", function(e) {
                $(this).scrollTop($(this).scrollTop() - e.originalEvent.wheelDeltaY / 2);
                e.preventDefault();
            });
        });
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
        $("#js-belt > ol").append($("#js-belt > ol li:first"));
    }

    function setScrollToBottom() {
        var elem = $(this).find("ol");
        elem.scrollTop(elem.height());
    }

})();