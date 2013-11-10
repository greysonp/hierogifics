// Create one test item for each context type.
var contexts = ["link","editable","image"];

// Create a context menu for an image
function kickoffContextMenu() {
    // Can always add the context menu to hide gifs
    chrome.contextMenus.create({
        "title": "Bury a gif here.",
        "contexts": ["image"],
        "onclick": onBuryClick
    });

    // These are the category-dependent menus
    chrome.storage.sync.get("categories", function(categoriesObj) {
        if (!categoriesObj || Object.keys(categoriesObj).length === 0) {
            initCategories(function(categoriesObj) {
                initContextMenu(categoriesObj.categories);
            });
        }
        else {
            initContextMenu(categoriesObj.categories);
        }
    });
}

function initContextMenu(categories) {
    var imageParent = chrome.contextMenus.create({"title": "Add image to category.", "contexts": ["image"]});
    for (var i = 0; i < categories.length; i++) {
        
        // Create all of the children for the image context menu (making sure to
        // exclude smart objects)
        if (categories[i].name.charAt(0) != '#') {
            (function(category){
                chrome.contextMenus.create({
                    "title": categories[i].name, 
                    "parentId": imageParent,
                    "contexts": ["image"], 
                    "onclick": function(info, tab) {
                        imageOnClick(info, tab, category);
                    }
                })    
            })(categories[i].name);
        }
    }
}

function imageOnClick(info, tab, category) {
    chrome.storage.sync.get("categories", function(categories) {
        if (!categories || Object.keys(categories).length == 0) {
            initCategories(function(defaults) {
                saveToStorage(info.srcUrl, category, defaults);
            });
        }
        else {
            saveToStorage(info.srcUrl, category, categories);
        }
    });
}

function onBuryClick(info, tab) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {"bury": info.srcUrl});
    });
}

function saveToStorage(url, category, categoriesObj) {
    var storedCategories = categoriesObj.categories;
    for (var i = 0; i < storedCategories.length; i++) {
        var c = storedCategories[i];
        if (c.name.toLowerCase() == category.toLowerCase()) {
            c.gifs.push({"animated": url, "use_count": 0});
            break;
        }
    }
    chrome.storage.sync.set(categoriesObj, function() {
        signalToolbeltRebuild();
    });

}

function initCategories(callback) {
    var categories = [{
       name: "happy",
       symbol: ":)",
       gifs: [{
            "animated": "http://media1.giphy.com/media/q6QHDGE3X4EWA/giphy.gif",
            "use_count": 0
        },
        {
            "animated": "http://media.giphy.com/media/dBu6VX8ZI9pSM/giphy.gif",
            "use_count": 0
        }]
    },
    {
       name: "sad",
       symbol: ":(",
       gifs: [{
            "animated": "http://media.giphy.com/media/XAcSy8eyMFpaU/giphy.gif",
            "use_count": 0
       },
       {
            "animated": "http://media.giphy.com/media/kB1IR4TzOoBnq/giphy.gif",
            "use_count": 0
       }]
    },
    {
        name: "mad",
        symbol: "D:<",
        gifs: [{
            "animated": "http://media2.giphy.com/media/vwu9UTwIwFr7G/giphy.gif",
            "use_count": 0
        },
        {
            "animated": "http://media1.giphy.com/media/zMe5y4Lfy52Sc/giphy.gif",
            "use_count": 0
        }]
    }];
    var obj = { "categories": categories };
    chrome.storage.sync.set({ "categories": categories }, function() { callback(obj); });
}


function signalToolbeltRebuild() {
    chrome.tabs.query({currentWindow: true}, function(tabs) {
        for (var i = 0; i < tabs.length; i++)
            chrome.tabs.sendMessage(tabs[i].id, {"refresh": true});
    });
}


chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
    if (request.refresh) {
        chrome.contextMenus.removeAll(function() {
            kickoffContextMenu();
            signalToolbeltRebuild();
        });
    }
});

// Do stuff
kickoffContextMenu();