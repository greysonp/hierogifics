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
        embedFonts();
        kickoffToolbelt();        
    });

    function kickoffToolbelt() {
        chrome.storage.sync.get("categories", function(categoriesObj) {
            initToolbelt(categoriesObj.categories);
        });
    }

    function initToolbelt(categories) {
        // Go through each category and generate the list and image nodes needed
        // for the toolbelt 
        var smarts = [];
        for (var i = 0; i < categories.length; i++) {
            var name = categories[i].name;
            if (name.charAt(0) == '#') {
                smarts.push({"name": name, "index": i});
                continue;
            }
            var gifs = categories[i].gifs;
            var li = document.createElement("li");
            var ol = document.createElement("ol");

            // If we have gifs in the category...
            for (var j = 0; j < gifs.length; j++) {
                var innerLi = document.createElement("li");
                innerLi.appendChild(generateAnchorGif(gifs[j].animated));
                ol.appendChild(innerLi);

                // If we're doing the last one, we need to add an overlay
                if (j == gifs.length - 1) {
                    li.appendChild(generateAnchorGif(gifs[j].animated));
                    li.appendChild(generateOverlay());
                    li.appendChild(generateNameDiv(name));
                }
            }
            // It it's an empty category (i.e. just added)
            if (gifs.length == 0) {
                var innerLi = document.createElement("li");                
                innerLi.appendChild(generateAnchorGif(chrome.extension.getURL("img/empty.jpg")));
                ol.appendChild(innerLi);
                li.appendChild(generateAnchorGif(chrome.extension.getURL("img/empty.jpg")));
                li.appendChild(generateOverlay());
                li.appendChild(generateNameDiv(name));
            }
            li.appendChild(ol);
            $("#js-belt ol")[0].appendChild(li);
        }
        // If we have no smart objects, we're done. Otherwise, we need to add them
        if (smarts.length == 0)
            finishToolbelt();
        else
            addSmartGifs(smarts);
    }

    function finishToolbelt() {
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
        initEvents();
    }

    function addSmartGifs(gifs) {
        getSmartGif(gifs, 0);
    }

    function getSmartGif(gifs, index) {
        if (index >= gifs.length) {
            finishToolbelt();
        }
        else {
            $.get("http://api.giphy.com/v1/gifs/search?q=" + gifs[index].name.substring(1) + "&api_key=dc6zaTOxFJmzC&limit=7", function(data) {
                var li = document.createElement("li");
                var ol = document.createElement("ol");
                var arr = data.data;
                for (var j = 0; j < arr.length; j++) {
                    var imgUrl = arr[j].images.fixed_height.url;
                    var innerLi = document.createElement("li");
                    innerLi.appendChild(generateAnchorGif(imgUrl));
                    ol.appendChild(innerLi);

                    // If we're doing the last one, we need to add an overlay
                    if (j == gifs.length - 1) {
                        li.appendChild(generateAnchorGif(imgUrl));
                        li.appendChild(generateOverlay());
                        li.appendChild(generateNameDiv(gifs[index].name));
                    }
                }
                li.appendChild(ol);
                $("#js-belt ol")[0].appendChild(li);
                getSmartGif(gifs, index + 1);
            });
        }
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

    function embedFonts() {
        embedFont("Raleway-Bold", "css/fonts/Raleway-Bold.ttf");
        embedFont("Raleway-ExtraBold", "css/fonts/Raleway-ExtraBold.ttf");
    };


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
                // resetBelt();
                chrome.runtime.sendMessage({ "refresh": true });
            });
        });
    }

    function promptToDeleteGif(e) {
        var category = $(this).parents("ol").parents("li").find(".gifics-title").text();
        var message = "Would you like to delete this gif?";
        if (category.charAt(0) == '#')
            message = "Would you like to delete this smart category?";
        var result = confirm(message);
        if (result) {
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

    function generateOverlay() {
        var overlay = document.createElement("div");
        overlay.setAttribute("class", "gifics-overlay");
        return overlay;
    }

    function generateNameDiv(name) {
        var nameDiv = document.createElement("div");
        nameDiv.setAttribute("class", "gifics-title");
        nameDiv.style.fontSize = 50 / Math.sqrt(name.length) + "px";
        nameDiv.innerText = name;
        return nameDiv;
    }

    function deleteGif(category, src) {
        chrome.storage.sync.get("categories", function(categoriesObj) {
            var categories = categoriesObj.categories;
            for (var i = 0; i < categories.length; i++) {
                var c = categories[i];
                // Find the category that matches
                if (c.name == category) {
                    // If you clicked the empty.jpg or it's a smart object, then just delete the 
                    // category and skidaddle
                    if (c.gifs.length == 0 || c.name.charAt(0) == '#') {
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
                chrome.runtime.sendMessage({ "refresh": true });
            });
        });
    }

    function embedFont(name, path) {
        var node = document.createElement("style");
        node.type = "text/css";
        var url = chrome.extension.getURL(path);
        node.textContent = "@font-face { font-family: '" + name + "'; src: url('" + url + "'); }";
        document.head.appendChild(node);
    };

})();