/**
 * Grabs the URL from the user's current tab and puts the data.
 * i.e the whole document inside myWebDiv.
 *
 * Documentation: https://developer.chrome.com/extensions/tabs#method-query
 * Parameters:  1.  Object- QueryInfo
 *                  active- Whether the tabs are active in their windows
 *                  currentWindow (opt)- Whether the tabs are in current window
 *              2.  Function- Callback
 *                  function(array of Tab results) {...};
 *                  - Array of Tab
 **/
chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
    //Grabs the User's current url
    //Tab Documentation: https://developer.chrome.com/extensions/tabs#type-Tab
    var tab = tabs[0];

    //JQuery Ajax Function
    //Parameters: Options:  1. URL- String containing the url
    //                      2. success- Function if request succeeds
    $.ajax({
        url: url, success: function (data) {
            //Puts the data from the url inside the div
            var myWebDiv = document.createElement('div');
            myWebDiv.innerHTML = data;
            //Put all meta tag names inside the metaTags
            var metaTags = myWebDiv.getElementsByTagName('meta');

            var citationData = {
                author: getAuthor(metaTags),
                publisher: getPublisher(metaTags),
                websiteTitle: tab.title,
                websiteURL: tab.url,
                articleTitle: getArticleTitle(metaTags),
                datePublished: getDatePosted(metaTags),
                accessDate: getAccessDate()
            };
            var box = document.getElementById("citation-text");
            var MLA = document.getElementById('MLA').addEventListener('click', function () {
                var citation = citationData.author + ". ";
                 citation += "\"" + citationData.articleTitle + ".\" ";
                 citation += citationData.websiteTitle + ". ";
                 citation += citationData.publisher + ", ";
                 citation += citationData.datePublished + ". ";
                 citation += citationData.accessDate + ". ";
                 citation += "<" + citationData.websiteURL + ">.";
                box.innerHTML = "Hello";
            });
            var APA = document.getElementById('APA').addEventListener('click', function () {
                alert('APA');
            });
            var Chicago = document.getElementById('Chicago').addEventListener('click', function () {
                alert('Chicago');
            });
        }, error: function () {
            alert("Failure");
        }
    });
});

//Publisher/sponsor
function getPublisher(metaTags) {
    for (var i = 0; i < metaTags.length; i++) {
        if (metaTags[i].getAttribute("property") == "article:publisher") {
            return metaTags[i].getAttribute("content");
        }
    }
    return "n.p";
}

//Article Title
function getArticleTitle(metaTags) {
    for (var i = 0; i < metaTags.length; i++) {
        if (metaTags[i].getAttribute("property") == "og:title") {
            return metaTags[i].getAttribute("content");
        }
    }
    return undefined;
}

//Author
function getAuthor(metaTags) {
    for (var i = 0; i < metaTags.length; i++) {
        if (metaTags[i].getAttribute("name") == "author") {
            return metaTags[i].getAttribute("content");
        }
    }
    return undefined;
}

//Date posted *
function getDatePosted(metaTags) {
    for (var i = 0; i < metaTags.length; i++) {
        if (metaTags[i].getAttribute("property") == "article:published") {
            return metaTags[i].getAttribute("content");
        }
    }
    return "n.d.";
}

//Date you accessed the material **
function getAccessDate() {
    var currentDate = new Date();
    var date;

    switch (currentDate.getMonth()) {
        case 0:
            date = "Jan.";
            break;
        case 1:
            date = "Feb.";
            break;
        case 2:
            date = "Mar.";
            break;
        case 3:
            date = "Apr.";
            break;
        case 4:
            date = "May.";
            break;
        case 5:
            date = "Jun.";
            break;
        case 6:
            date = "Jul.";
            break;
        case 7:
            date = "Aug.";
            break;
        case 8:
            date = "Sept.";
            break;
        case 9:
            date = "Oct.";
            break;
        case 10:
            date = "Nov.";
            break;
        case 11:
            date = "Dec.";
            break;
    }
    return date + " " + currentDate.getDate() + ", " + currentDate.getFullYear();
}