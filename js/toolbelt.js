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

        // Add mask (we need to do it in js because we need the url)
        // But only add it if there's >= 4 items in the list
        $("#js-belt ol li ol").each(function() {
            if ($(this).children().length >= 4) {
                $(this).css("-webkit-mask", "url(" + chrome.extension.getURL("img/toolbar_fade_mask.svg") + ")");
            }
        });
    }

    function initEvents() {
        $("#js-next-button").click(nextCategory);
        $("#js-belt ol li").mouseenter(setScrollToBottom);
        $("#js-belt ol li").mouseleave(setScrollToBottom);
        $("#js-belt ol li ol").bind("mousewheel", function(e) {
            $(this).scrollTop($(this).scrollTop() - e.originalEvent.wheelDeltaY / 2);
            e.preventDefault();
        });
        $(".gifics-add-category").click(addCategory);
        $("#js-belt li a").click(function(e) { e.preventDefault(); });
        $("#js-belt li a").dblclick(promptToDeleteGif);
    }


    // ======================================================
    // EVENTS
    // ======================================================

    Mousetrap.bind(["command+shift+up", "control+shift+up"], function(e) {
        showBelt();
        return false;
    });

    Mousetrap.bind(["command+shift+down", "control+shift+down"], function(e) {
        hideBelt();
        return false;
    });

    function setScrollToBottom() {
        var elem = $(this).find("ol");
        var height = elem.height();
        elem.scrollTop(height);
        elem.css("opacity", 0);
        elem.animate({"opacity": 1}, 300);
    }

    function addCategory(e) {
        var name = prompt("What would you like to name your new category?");
        chrome.storage.sync.get("categories", function(categoriesObj) {
            var categories = categoriesObj.categories;
            categories.push({"name": name, "symbol": [], "gifs": []});
            chrome.storage.sync.set({ "categories": categories }, function() {
                resetBelt();
                chrome.runtime.sendMessage({ "refresh": true });
            });
        });
    }

    function promptToDeleteGif(e) {
        var result = confirm("Would you like to delete this gif?");
        if (result) {
            var category = $(this).parents("ol").parents("li").find(".gifics-title").text();
            var src = $(this).attr("href");
            deleteGif(category, src);
        }
    }

    chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
        if (request.refresh) {
            resetBelt();
        }
    });

    // ======================================================
    // HELPERS
    // ======================================================

    function showBelt() {
        $("#js-toolbelt").animate({"bottom": "0"}, 250);
    }

    function hideBelt() {
        $("#js-toolbelt").animate({"bottom": "-150px"}, 250);
    }

    function resetBelt() {
        $("#js-toolbelt ol").empty();
        kickoffToolbelt();
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

    function deleteGif(category, src) {
        chrome.storage.sync.get("categories", function(categoriesObj) {
            var categories = categoriesObj.categories;
            for (var i = 0; i < categories.length; i++) {
                var c = categories[i];
                // Find the category that matches
                if (c.name == category) {
                    // If you clicked the empty.jpg, then just delete the category and skidaddle
                    if (c.gifs.length == 0) {
                        categories.splice(i, 1);
                        break;
                    }
                    // Otherwise, go through all of the gifs and find the matching src
                    for (var j = 0; j < c.gifs.length; j++) {
                        if (c.gifs[j].animated == src) {
                            c.gifs.splice(j, 1);
                            // If you just deleted the last one, delete the category too
                            if (c.gifs.length == 0) {
                                categories.splice(i, 1);
                            }
                            break;
                        }
                    }
                    break;
                }
            }
            chrome.storage.sync.set({"categories": categories}, function() {
                 resetBelt();
            });
        });
    }

})();