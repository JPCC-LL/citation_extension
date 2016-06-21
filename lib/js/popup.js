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
    var webURL = tab.url;
    var webTitle = tab.title;

    //If the user clicks on the CiteRight header, it opens the Github page in a new tab
    var header = document.getElementById('header').addEventListener('click', function () {
        chrome.tabs.create({url: "https://github.com/JPCC-LL/citation_extension"});
    });

    var citationBox = document.getElementById('citation-text');

    //JQuery Ajax Function
    //Parameters: Options:  1. URL- String containing the url
    //                      2. success- Function if request succeeds
    $.ajax({
        url: webURL, success: function (data) {
            //Puts the data from the url inside the div
            var myWebDiv = document.createElement('div');
            myWebDiv.innerHTML = data;
            //Put all meta tag names inside the metaTags
            var metaTags = myWebDiv.getElementsByTagName('meta');

            //Create an object of Data for the page that each of the
            //citation styles can use
            var citationData = {
                author: getAuthor(metaTags),
                publisher: getPublisher(metaTags),
                websiteTitle: webTitle,
                websiteURL: webURL,
                articleTitle: getArticleTitle(metaTags),
                datePublished: getDatePosted(metaTags),
                accessDate: getAccessDate()
            };
            var MLA = document.getElementById('MLA').addEventListener('click', function () {
                var MLACitation = function (citationData) {
                    var citation = "";
                    if (citationData.author != undefined) {
                        citation += citationData.author + ". ";
                    }
                    if (citationData.articleTitle != undefined) {
                        citation += "\"" + citationData.articleTitle + ".\" ";
                    }
                    citation += citationData.websiteTitle + ". ";
                    citation += citationData.publisher + ", ";
                    citation += citationData.datePublished + ". ";
                    citation += citationData.accessDate.day + ". " +
                        citationData.accessDate.month + " " +
                        citationData.accessDate.year + ". Web.";
                    citation += "<" + citationData.websiteURL + ">.";
                    return citation;
                };
                citationBox.innerHTML = MLACitation(citationData);
            });
            var APA = document.getElementById('APA').addEventListener('click', function () {
                var APACitation = function (citationData) {
                    var citation = "";
                    if (citationData.author != undefined) {
                        citation += citationData.author + ". ";
                    }
                    citation += "(" + citationData.datePublished + ").";
                    if (citationData.articleTitle != undefined) {
                        citation += citationData.articleTitle + ". ";
                    }
                    citation += "Retrieved from " + citationData.websiteURL;
                    return citation;
                };
                citationBox.innerHTML = APACitation(citationData);
            });
            var Chicago = document.getElementById('Chicago').addEventListener('click', function () {
                var ChicagoCitation = function (citationData) {
                    var citation = "";
                    if (citationData.author != undefined) {
                        citation += citationData.author + ". ";
                    }
                    if (citationData.articleTitle != undefined) {
                        citation += "\"" + citationData.articleTitle + ".\"";
                    }
                    citation += citationData.websiteTitle + ". ";
                    citation += citationData.datePublished + ". ";
                    citation += citationData.accessDate.month + " " +
                        citationData.accessDate.day + ", " +
                        citationData.accessDate.year + ". ";
                    citation += citationData.websiteURL + ".";
                    return citation;
                };
                citationBox.innerHTML = ChicagoCitation(citationData);
            });
        }
    });
    var copyButton = document.getElementById('copy').addEventListener('click', function () {
        /*
         Idea for copy functionality source:
         1. http://www.pakzilla.com/2012/03/20/how-to-copy-to-clipboard-in-chrome-extension/ (Code)
         2. https://developer.chrome.com/extensions/declare_permissions (Permissions)
         3. https://stackoverflow.com/questions/6743912/get-the-pure-text-without-html-element-by-javascript
         (Retrieving the text from an element)
         */
        var copyFunction = function (text) {
            var copyDiv = document.createElement('div');
            copyDiv.contentEditable = true;
            document.body.appendChild(copyDiv);
            copyDiv.innerHTML = text;
            copyDiv.unselectable = "off";
            copyDiv.focus();
            document.execCommand('SelectAll');
            document.execCommand("Copy", false, null);
            document.body.removeChild(copyDiv);
        };
        copyFunction(citationBox.textContent);
    });
    var saveButton = document.getElementById('save').addEventListener('click', function () {
        chrome.extension.getBackgroundPage().console.log("Not yet implemented. Under Development.");
    });
});

//Publisher/sponsor
function getPublisher(metaTags) {
    for (var i = 0; i < metaTags.length; i++) {
        if (metaTags[i].getAttribute("property") == "article:publisher") {
            return metaTags[i].getAttribute("content");
        }
    }
    return "n.p.";
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
    return "n.d";
}

//Date you accessed the material **
function getAccessDate() {
    var currentDate = new Date();
    var date = {};
    var month;
    switch (currentDate.getMonth()) {
        case 0:
            month = "Jan.";
            break;
        case 1:
            month = "Feb.";
            break;
        case 2:
            month = "Mar.";
            break;
        case 3:
            month = "Apr.";
            break;
        case 4:
            month = "May.";
            break;
        case 5:
            month = "Jun.";
            break;
        case 6:
            month = "Jul.";
            break;
        case 7:
            month = "Aug.";
            break;
        case 8:
            month = "Sept.";
            break;
        case 9:
            month = "Oct.";
            break;
        case 10:
            month = "Nov.";
            break;
        case 11:
            month = "Dec.";
            break;
    }
    date.month = month;
    date.day = currentDate.getDate();
    date.year = currentDate.getFullYear();
    return date;
}
