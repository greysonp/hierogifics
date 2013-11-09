(function() {
    $.get(chrome.extension.getURL("html/toolbelt.html"), function(data) {
        $("body").append(data);

        chrome.storage.sync.get("categories", function(categoriesObj) {
            drawToolbelt(categoriesObj.categories);
            initEvents();
        });
    });

    function initEvents() {
        $("#js-next-button").click(nextCategory);
        $("#js-belt ol li").mouseenter(setScrollToBottom);
        $("#js-belt ol li").mouseleave(setScrollToBottom);
        $("#js-belt ol li ol").css("-webkit-mask", "url(" + chrome.extension.getURL("img/toolbar_fade_mask.svg") + ")");
        $("#js-belt ol li ol").bind("mousewheel", function(e) {
            $(this).scrollTop($(this).scrollTop() - e.originalEvent.wheelDeltaY / 2);
            e.preventDefault();
        });
    }

    function drawToolbelt(categories) {
        // Go through each category and generate the list and image nodes needed
        // for the toolbelt 
        for (var i = 0; i < categories.length; i++) {
            var name = categories[i].name;
            var gifs = categories[i].gifs;
            var li = document.createElement("li");
            var ol = document.createElement("ol");

            for (var j = 0; j < gifs.length; j++) {
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

        $("#js-belt ol li ol").each(function(index){
            var height = Math.min($(this).children().length * 115 - 15, 400);
            $(this).css("height", height + "px");
        });



    }

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