(function() {
    // ======================================================
    // VARIABLES
    // ======================================================

    var selectedImage = "";


    // ======================================================
    // INITIALIZATION
    // ======================================================

    $.get(chrome.extension.getURL("html/toolbelt.html"), function(data) {
        $("body").append(data);
        kickoffToolbelt();        
    });

    function kickoffToolbelt() {
        chrome.storage.sync.get("categories", function(categoriesObj) {
            initToolbelt(categoriesObj.categories);
            initEvents();
        });
    }

    function initToolbelt(categories) {
        // Go through each category and generate the list and image nodes needed
        // for the toolbelt 
        for (var i = 0; i < categories.length; i++) {
            var name = categories[i].name;
            var gifs = categories[i].gifs;
            var li = document.createElement("li");
            var ol = document.createElement("ol");

            // If we have gifs in the category...
            for (var j = 0; j < gifs.length; j++) {
                var innerLi = document.createElement("li");
                var anchor = generateAnchorGif(gifs[j].animated);
                innerLi.appendChild(anchor);

                ol.appendChild(innerLi);
                if (j == gifs.length - 1) {
                    var anchor2 = generateAnchorGif(gifs[j].animated);
                    li.appendChild(anchor2);
                    var overlay = document.createElement("div");
                    overlay.setAttribute("class", "gifics-overlay");
                    li.appendChild(overlay);
                    var nameDiv = document.createElement("div");
                    nameDiv.setAttribute("class", "gifics-title");
                    nameDiv.innerText = name;
                    li.appendChild(nameDiv);
                }
            }
            // It it's an empty category (i.e. just added)
            if (gifs.length == 0) {
                var innerLi = document.createElement("li");
                var anchor = generateAnchorGif(chrome.extension.getURL("img/empty.jpg"));
                innerLi.appendChild(anchor);
                ol.appendChild(innerLi);
                var anchor2 = generateAnchorGif(chrome.extension.getURL("img/empty.jpg"));
                li.appendChild(anchor2);
                var overlay = document.createElement("div");
                overlay.setAttribute("class", "gifics-overlay");
                li.appendChild(overlay);
                var nameDiv = document.createElement("div");
                nameDiv.setAttribute("class", "gifics-title");
                nameDiv.innerText = name;
                li.appendChild(nameDiv);
            }
            li.appendChild(ol);
            $("#js-belt ol")[0].appendChild(li);
        }
        var addCategory = document.createElement("li");
        addCategory.setAttribute("class", "gifics-add-category");
        addCategory.innerText = "+";
        $("#js-belt ol")[0].appendChild(addCategory);

        $("#js-belt ol li ol").each(function(index){
            var height = Math.min($(this).children().length * 115 - 15, 400);
            $(this).css("height", height + "px");
        });
    }

    function initEvents() {
        $("#js-next-button").click(nextCategory);
        $("#js-belt ol li").mouseenter(setScrollToBottom);
        $("#js-belt ol li").mouseleave(setScrollToBottom);
        $("#js-belt ol li ol").css("-webkit-mask", "url(" + chrome.extension.getURL("img/toolbar_fade_mask.svg") + ")");
        $("#js-belt ol li ol").bind("mousewheel", function(e) {
            $(this).scrollTop($(this).scrollTop() - e.originalEvent.wheelDeltaY / 2);
            e.preventDefault();
        });
        $(".gifics-add-category").click(addCategory);
        $("#js-belt li a").click(function(e) { e.preventDefault(); });
    }


    // ======================================================
    // EVENTS
    // ======================================================

    Mousetrap.bind("command+shift+up", function(e) {
        showBelt();
        return false;
    });

    Mousetrap.bind("command+shift+down", function(e) {
        hideBelt();
        return false;
    });

    function setScrollToBottom() {
        var elem = $(this).find("ol");
        elem.scrollTop(elem.height());
    }

    function addCategory(e) {
        var name = prompt("What would you like to name your new category?");
        chrome.storage.sync.get("categories", function(categoriesObj) {
            var categories = categoriesObj.categories;
            categories.push({"name": name, "symbol": [], "gifs": []});
            chrome.storage.sync.set({ "categories": categories }, function() {
                $("#js-toolbelt ol").empty();
                kickoffToolbelt();
            });
        });
    }

    // ======================================================
    // HELPERS
    // ======================================================

    function showBelt() {
        $("#js-toolbelt").animate({"bottom": "0"}, 250);
    }

    function hideBelt() {
        $("#js-toolbelt").animate({"bottom": "-150px"}, 250);
    }

    function nextCategory() {
        $("#js-belt > ol").append($("#js-belt > ol li:first"));
    }

    function generateAnchorGif(src) {
        var anchor = document.createElement("a");
        anchor.style.backgroundImage = "url(" + src + ")";
        anchor.style.backgroundPosition = "center";
        anchor.style.backgroundSize = "auto 100px";
        anchor.href = src;
        return anchor;
    }

    function copyTextToClipboard(text) {
        
    }

})();