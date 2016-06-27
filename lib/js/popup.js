/*
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
 */
chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
    //Grabs the User's current url
    //Tab Documentation: https://developer.chrome.com/extensions/tabs#type-Tab
    var tab = tabs[0];
    var citationData = {webURL: tab.url, webTitle: tab.title, accessDate: getAccessDate(), accessDateString: ""};

    //Keeps track of which citation is selected
    var selectedCitation;

    //If the user clicks on the CiteRight header, it opens the Github page in a new tab
    var header = document.getElementById('header');
    header.addEventListener('click', function () {
        chrome.tabs.create({url: "https://github.com/JPCC-LL/citation_extension"});
    });

    //Reference to the text box that will display the citation
    var citationBox = document.getElementById('citation-text');

    //Reference to the 'Fill Missing' box
    var editButton = document.getElementById('edit');

    //Reference to the 'Missing' div section
    var missingSection = document.getElementById('missing-data');

    //JQuery Ajax Function
    //Parameters: Options:  1. URL- String containing the url
    //                      2. success- Function if request succeeds
    $.ajax({
        url: citationData.webURL, success: function (data) {
            //Puts the data from the url inside the div
            var myWebDiv = document.createElement('div');
            myWebDiv.innerHTML = data;
            //Put all meta tag names inside the metaTags
            var metaTags = myWebDiv.getElementsByTagName('meta');

            //Create an object of Data for the page that each of the citation styles can use
            citationData.author = getData(metaTags, "name", "author");
            citationData.publisher = getData(metaTags, "property", "article:publisher");
            citationData.articleTitle = getData(metaTags, "property", "og:title");
            citationData.datePublished = getData(metaTags, "property", "article:published");
            var MLA = document.getElementById('MLA');
            MLA.addEventListener('click', function () {
                selectedCitation = "MLA";
                //Use innerText instead of innerHTML to avoid issues with unicode
                //and '<', '>' making the url look like tags
                citationBox.innerText = MLACitation(citationData);
                editButton.disabled = false;
            });
            var APA = document.getElementById('APA');
            APA.addEventListener('click', function () {
                selectedCitation = "APA";
                citationBox.innerText = APACitation(citationData);
                editButton.disabled = false;
            });
            var Chicago = document.getElementById('Chicago');
            Chicago.addEventListener('click', function () {
                selectedCitation = "Chicago";
                citationBox.innerText = ChicagoCitation(citationData);
                editButton.disabled = false;
            });
        }, error: function () {
            citationBox.innerText = "Cannot generate citation for this page";
            editButton.disabled = true;
        }
    });
    var copyButton = document.getElementById('copy');
    copyButton.addEventListener('click', function () {
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
            copyDiv.innerText = text;
            copyDiv.unselectable = "off";
            copyDiv.focus();
            document.execCommand('SelectAll');
            document.execCommand("Copy", false, null);
            document.body.removeChild(copyDiv);
        };
        copyFunction(citationBox.textContent);
    });
    var saveButton = document.getElementById('save');
    saveButton.addEventListener('click', function () {
        //Outputs the information to the background javascript page
        chrome.extension.getBackgroundPage().console.log("Not yet implemented. Under Development.");
    });

    editButton.addEventListener('click', function () {
        missingSection.style.display = "block";
        var authorDiv = document.createElement('div');
        authorDiv.innerHTML = "Author <input type=text class='author'" +
            " style='width: 100%' value='" + citationData.author + "'>";
        missingSection.appendChild(authorDiv);
        var publisherDiv = document.createElement('div');
        publisherDiv.innerHTML = "Publisher <input type=text class='publisher'" +
            " style='width: 100%' value='" + citationData.publisher + "'>";
        missingSection.appendChild(publisherDiv);
        var articleTitleDiv = document.createElement('div');
        articleTitleDiv.innerHTML = "Article Title <input type=text class='article-title'" +
            " style='width: 100%' value='" + citationData.articleTitle + "'>";
        missingSection.appendChild(articleTitleDiv);
        var datePublishedDiv = document.createElement('div');
        datePublishedDiv.innerHTML = "Date Published <input type=text class='date-published'" +
            " style='width: 100%' value='" + citationData.datePublished + "'>";
        missingSection.appendChild(datePublishedDiv);
        var webTitleDiv = document.createElement('div');
        webTitleDiv.innerHTML = "Web Title <input type=text class='web-title'" +
            " style='width: 100%' value='" + citationData.webTitle + "'>";
        missingSection.appendChild(webTitleDiv);
        var buttonsDiv = document.createElement('div');
        buttonsDiv.innerHTML = "<button type=\"button\" class=\"btn btn-primary\">Submit</button>\n" +
            "<button type=\"button\" class=\"btn btn-primary\">Hide</button>";
        //Returns a list of button elements. The first is the 'submit' button
        var submitDiv = buttonsDiv.getElementsByTagName('button')[0];
        submitDiv.addEventListener('click', function () {
            //Source: http://stackoverflow.com/questions/7815374/get-element-inside-element-by-class-and-id-javascript
            citationData.author = authorDiv.getElementsByClassName('author')[0].value;
            citationData.publisher = publisherDiv.getElementsByClassName('publisher')[0].value;
            citationData.articleTitle = articleTitleDiv.getElementsByClassName('article-title')[0].value;
            citationData.datePublished = datePublishedDiv.getElementsByClassName('date-published')[0].value;
            citationData.webTitle = webTitleDiv.getElementsByClassName('web-title')[0].value;
            switch (selectedCitation) {
                case "MLA":
                    citationBox.innerText = MLACitation(citationData);
                    break;
                case "APA":
                    citationBox.innerText = APACitation(citationData);
                    break;
                case "Chicago":
                    citationBox.innerText = ChicagoCitation(citationData);
                    break;
            }
        });
        //The second is the 'hide' button
        var hideDiv = buttonsDiv.getElementsByTagName('button')[1];
        hideDiv.addEventListener('click', function () {
            //Removes the edit section by changing the sections HTML to nothing
            missingSection.innerHTML = "";
            missingSection.style.display = "none";
        });
        missingSection.appendChild(buttonsDiv);
    });
});

//Source: https://owl.english.purdue.edu/owl/resource/747/08/
function MLACitation(citationData) {
    citationData.accessDateString = citationData.accessDate.day + ". " +
        citationData.accessDate.month + " " +
        citationData.accessDate.year;
    var citation = "";
    if (citationData.author != undefined) {
        citation += citationData.author + ". ";
    }
    if (citationData.articleTitle != undefined) {
        citation += "\"" + citationData.articleTitle + ".\" ";
    }
    citation += citationData.webTitle + ". ";
    citation += citationData.publisher + ", ";
    if (citationData.datePublished == "n.d.") {
        citation += citationData.datePublished + " ";
    } else {
        citation += citationData.datePublished + ". ";
    }
    citation += citationData.accessDateString + ". Web. ";
    citation += "<" + citationData.webURL + ">.";
    return citation;
}

//Source: https://owl.english.purdue.edu/owl/resource/560/10/
function APACitation(citationData) {

    citationData.accessDateString = "";
    var citation = "";
    if (citationData.author != undefined) {
        citation += citationData.author + ". ";
    }
    if (citationData.datePublished != "n.d.") {
        citation += "(" + citationData.datePublished + "). ";
    }
    if (citationData.articleTitle != undefined) {
        citation += citationData.articleTitle + ". ";
    }
    citation += "Retrieved from " + citationData.webURL;
    return citation;
}

//Source: https://owl.english.purdue.edu/owl/resource/717/05/
function ChicagoCitation(citationData) {
    citationData.accessDateString = citationData.accessDate.month + " " +
        citationData.accessDate.day + ", " +
        citationData.accessDate.year;
    var citation = "";
    if (citationData.author != undefined) {
        citation += citationData.author + ", ";
    }
    if (citationData.articleTitle != undefined) {
        citation += "\"" + citationData.articleTitle + ",\"";
    }
    citation += citationData.webTitle + ", last modified ";
    citation += citationData.datePublished + ", ";
    citation += citationData.accessDateString + ". ";
    citation += citationData.webURL + ".";
    return citation;
}

/**
 * Generic data retrieving function for all of the meta tags
 *
 * @param metaTags Collection of meta tags
 * @param attribute Attribute where the information is found
 * @param query Search Query for the meta tag
 * @returns {*} The content associated with the search query
 *              n.p if there is no publisher
 *              n.d if there is no date published
 *              undefined if there is no author or title
 */
function getData(metaTags, attribute, query) {
    for (var i = 0; i < metaTags.length; i++) {
        if (metaTags[i].getAttribute(attribute) == query) {
            return metaTags[i].getAttribute("content");
        }
    }
    if (query == "article:publisher") {
        return "n.p.";
    } else if (query == "article:published") {
        return "n.d.";
    } else {
        return undefined;
    }
}

/**
 * Displays the current date in an object which stores the
 * day, month, and year as the object's property
 *
 * @returns {{}} Object of day, month, year properties
 */
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