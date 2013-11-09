// Create one test item for each context type.
var contexts = ["link","editable","image"];

// Create a context menu for an image
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

function initContextMenu(categories) {
    var imageParent = chrome.contextMenus.create({"title": "Save Image in Category", "contexts": ["image"]});
    for (var i = 0; i < categories.length; i++) {
        
        // Create all of the children for the image context menu
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

function imageOnClick(info, tab, category) {
    console.log(category + " | " + info.srcUrl);
    chrome.storage.sync.get("categories", function(categories) {
        console.log(categories);
        if (!categories || Object.keys(categories).length == 0) {
            initCategories(function(defaults) {
                console.log(defaults);
                saveToStorage(info.srcUrl, category, defaults);
            });
        }
        else {
            saveToStorage(info.srcUrl, category, categories);
        }
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
    chrome.storage.sync.set(categoriesObj);

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