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

    //Keeps track of which citation is selected (String)
    var selectedCitation;

    //Keeps track of which type of article is current selected (String)
    var currentSelection = 'article';

    //Track is user has already clicked on 'edit' button
    var editSelected = false;

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
            //MLA Event Listener
            document.getElementById('MLA').addEventListener('click', function () {
                selectedCitation = "MLA";
                //Use innerText instead of innerHTML to avoid issues with unicode
                //and '<', '>' making the url look like tags
                citationBox.innerText = MLACitation(citationData, currentSelection);
                editButton.disabled = false;
            });
            //APA Event Listener
            document.getElementById('APA').addEventListener('click', function () {
                selectedCitation = "APA";
                citationBox.innerText = APACitation(citationData);
                editButton.disabled = false;
            });
            //Chicago Event Listener
            document.getElementById('Chicago').addEventListener('click', function () {
                selectedCitation = "Chicago";
                citationBox.innerText = ChicagoCitation(citationData);
                editButton.disabled = false;
            });
        }, error: function () {
            citationBox.innerText = "Cannot generate citation for this page";
            //Disables the 'edit' button so users won't see a bunch of missing data (undefined)
            editButton.disabled = true;
        }
    });

    //Register event listener for the copy button
    document.getElementById('copy').addEventListener('click', function () {
        /*
         Idea for copy functionality source:
         1. http://www.pakzilla.com/2012/03/20/how-to-copy-to-clipboard-in-chrome-extension/ (Code)
         2. https://developer.chrome.com/extensions/declare_permissions (Permissions)
         3. https://stackoverflow.com/questions/6743912/get-the-pure-text-without-html-element-by-javascript
         (Retrieving the text from an element)
         */
        var copyDiv = document.createElement('div');
        copyDiv.contentEditable = true;
        document.body.appendChild(copyDiv);
        copyDiv.innerText = citationBox.textContent;
        copyDiv.unselectable = "off";
        copyDiv.focus();
        document.execCommand('SelectAll');
        document.execCommand("Copy", false, null);
        document.body.removeChild(copyDiv);
    });

    editButton.addEventListener('click', function () {
        //If 'edit' button has already been selected, nothing happens
        if (editSelected) {
            return;
        }
        editSelected = true;

        //Displays the hidden section
        missingSection.style.display = "block";

        //Two simple helper functions to create the innerHtml in the hidden sections
        var generateRadioInnerHtml = function (value, text, selected) {
            if (selected) {
                return "<input type='radio' name='page' value='" + value + "' style='margin: 3px;' checked>" + text;
            } else {
                return "<input type='radio' name='page' value='" + value + "' style='margin: 3px;'>" + text;
            }
        };

        var generateEditInnerHtml = function (id, classValue, textValue) {
            return id + "<input type=text class='" + classValue +
                "' style='width: 100%' value='" + textValue + "'>";
        };

        //Div that displays a radio button group
        var articleSelectionDiv = document.createElement('div');
        articleSelectionDiv.innerHTML = generateRadioInnerHtml('article', 'Article', true) +
            generateRadioInnerHtml('image', 'Image', false) +
            generateRadioInnerHtml('email', 'E-mail', false) +
            generateRadioInnerHtml('tweet', 'Tweet', false) +
            generateRadioInnerHtml('video', 'Video', false);
        missingSection.appendChild(articleSelectionDiv);

        //Adds the divs to be displayed and edited
        var articleDiv = document.createElement('div');
        articleDiv.innerHTML = generateEditInnerHtml('Author', 'author', citationData.author) +
            generateEditInnerHtml('Publisher', 'publisher', citationData.publisher) +
            generateEditInnerHtml('Article Title', 'article-title', citationData.articleTitle) +
            generateEditInnerHtml('Web Title', 'web-title', citationData.webTitle) +
            generateEditInnerHtml('Date Published', 'date-published', citationData.datePublished);
        missingSection.appendChild(articleDiv);

        var imageDiv = document.createElement('div');
        imageDiv.innerHTML = generateEditInnerHtml('Artist', 'artist', citationData.artist) +
            generateEditInnerHtml('Work of Art', 'artwork', citationData.artwork) +
            generateEditInnerHtml('Location', 'location', citationData.location) +
            generateEditInnerHtml('Institution', 'institution', citationData.institution);

        var emailDiv = document.createElement('div');
        emailDiv.innerHTML = generateEditInnerHtml('Author', 'author', citationData.author) +
            generateEditInnerHtml('Subject', 'subject', citationData.subject) +
            generateEditInnerHtml('Receiver', 'receiver', citationData.receiver);

        var tweetDiv = document.createElement('div');
        tweetDiv.innerHTML = generateEditInnerHtml('Author', 'author', citationData.author) +
            generateEditInnerHtml('Username', 'username', citationData.twitterUsername) +
            generateEditInnerHtml('Tweet', 'tweet', citationData.tweet) +
            generateEditInnerHtml('Date-Time', 'date-time', citationData.datetime);

        var videoDiv = document.createElement('div');
        videoDiv.innerHTML = generateEditInnerHtml('Author', 'author', citationData.author) +
            generateEditInnerHtml('Video name', 'video-name', citationData.videoname) +
            generateEditInnerHtml('Media type', 'media-type', citationData.mediaType) +
            generateEditInnerHtml('Web Title', 'web-title', citationData.webTitle);
        generateEditInnerHtml('Date Published', 'date-published', citationData.datePublished);

        //Adds the two buttons (Submit, Hide) to the bottom of the missing section
        var buttonsDiv = document.createElement('div');
        buttonsDiv.innerHTML = "<button type=\"button\" class=\"btn btn-primary\">Submit</button>\n" +
            "<button type=\"button\" class=\"btn btn-primary\">Hide</button>";
        //Returns a list of button elements. The first is the 'submit' button
        var submitDiv = buttonsDiv.getElementsByTagName('button')[0];
        submitDiv.addEventListener('click', function () {
            //Source: http://stackoverflow.com/questions/7815374/get-element-inside-element-by-class-and-id-javascript
            //Inputs the user entered data into the citationData object
            var tagNameArray;
            switch (currentSelection) {
                case 'article':
                    tagNameArray = articleDiv.getElementsByTagName('input');
                    citationData.author = tagNameArray[0].value;
                    citationData.publisher = tagNameArray[1].value;
                    citationData.articleTitle = tagNameArray[2].value;
                    citationData.datePublished = tagNameArray[3].value;
                    citationData.webTitle = tagNameArray[4].value;
                    break;
                case 'image':
                    tagNameArray = imageDiv.getElementsByTagName('input');
                    citationData.artwork = tagNameArray[0].value;
                    citationData.location = tagNameArray[1].value;
                    citationData.institution = tagNameArray[2].value;
                    break;
                case 'email':
                    tagNameArray = emailDiv.getElementsByTagName('input');
                    citationData.subject = tagNameArray[0].value;
                    citationData.receiver = tagNameArray[1].value;
                    break;
                case 'tweet':
                    tagNameArray = tweetDiv.getElementsByTagName('input');
                    citationData.twitterUsername = tagNameArray[0].value;
                    citationData.tweet = tagNameArray[1].value;
                    citationData.datetime = tagNameArray[2].value;
                    break;
                case 'video':
                    tagNameArray = videoDiv.getElementsByTagName('input');
                    citationData.videoname = tagNameArray[0].value;
                    citationData.mediaType = tagNameArray[1].value;
                    citationData.webTitle = tagNameArray[2].value;
                    citationData.datePublished = tagNameArray[3].value;
                    break;
            }
            //Based on the citation selected, it displays which citation
            switch (selectedCitation) {
                case "MLA":
                    citationBox.innerText = MLACitation(citationData, currentSelection);
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
            editSelected = false;
        });
        missingSection.appendChild(buttonsDiv);

        //Creates an array of functions that act as the click event listener for the radio buttons
        var articleTypeFunctions = {};
        articleTypeFunctions.article = function () {
            if (currentSelection != 'article') {
                missingSection.innerHTML = "";
                missingSection.appendChild(articleSelectionDiv);
                missingSection.appendChild(articleDiv);
                missingSection.appendChild(buttonsDiv);
            }
            currentSelection = 'article';
        };
        articleTypeFunctions.image = function () {
            if (currentSelection != 'image') {
                missingSection.innerHTML = "";
                missingSection.appendChild(articleSelectionDiv);
                missingSection.appendChild(imageDiv);
                missingSection.appendChild(buttonsDiv);
            }
            currentSelection = 'image';
        };
        articleTypeFunctions.email = function () {
            if (currentSelection != 'email') {
                missingSection.innerHTML = "";
                missingSection.appendChild(articleSelectionDiv);
                missingSection.appendChild(emailDiv);
                missingSection.appendChild(buttonsDiv);
            }
            currentSelection = 'email';
        };
        articleTypeFunctions.tweet = function () {
            if (currentSelection != 'tweet') {
                missingSection.innerHTML = "";
                missingSection.appendChild(articleSelectionDiv);
                missingSection.appendChild(tweetDiv);
                missingSection.appendChild(buttonsDiv);
            }
            currentSelection = 'tweet';
        };
        articleTypeFunctions.video = function () {
            if (currentSelection != 'video') {
                missingSection.innerHTML = "";
                missingSection.appendChild(articleSelectionDiv);
                missingSection.appendChild(videoDiv);
                missingSection.appendChild(buttonsDiv);
            }
            currentSelection = 'video';
        };

        var radioButtons = articleSelectionDiv.getElementsByTagName('input');
        for (var i = 0; i < radioButtons.length; i++) {
            switch (i) {
                case 0:
                    radioButtons[i].addEventListener('click', articleTypeFunctions.article);
                    break;
                case 1:
                    radioButtons[i].addEventListener('click', articleTypeFunctions.image);
                    break;
                case 2:
                    radioButtons[i].addEventListener('click', articleTypeFunctions.email);
                    break;
                case 3:
                    radioButtons[i].addEventListener('click', articleTypeFunctions.tweet);
                    break;
                case 4:
                    radioButtons[i].addEventListener('click', articleTypeFunctions.video);
                    break;
            }
        }
    });
});

/**
 * Generates the MLA Citation based off of:
 * https://owl.english.purdue.edu/owl/resource/747/08/
 *
 * @param citationData Object of data related to generating citation
 * @param selectionStyle String of which article type
 * @returns {string} Citation generated
 */
function MLACitation(citationData, selectionStyle) {
    //Set the access date string because the accessDate property is an object
    citationData.accessDateString = citationData.accessDate.day + ". " +
        citationData.accessDate.month + " " +
        citationData.accessDate.year;
    var citation = "";
    switch (selectionStyle) {
        case "article":
            if (citationData.author != undefined) {
                citation += citationData.author + ". ";
            }
            if (citationData.articleTitle != undefined) {
                citation += "\"" + citationData.articleTitle + ".\" ";
            }
            citation += citationData.webTitle + ". ";
            if (citationData.publisher == undefined) {
                citation += "n.p., ";
            } else {
                citation += citationData.publisher + ", ";
            }
            if (citationData.datePublished == undefined) {
                citation += "n.d. ";
            } else {
                citation += citationData.datePublished + ". ";
            }
            citation += citationData.accessDateString + ". Web. ";
            citation += "<" + citationData.webURL + ">.";
            break;
        case "image":
            if (citationData.artist != undefined) {
                citation += citationData.artist + ". ";
            }
            if (citationData.artwork != undefined) {
                citation += citationData.artwork + ". ";
            }
            if (citationData.location != undefined) {
                citation += citationData.location + ". ";
            }
            citation += "Web. " + citationData.accessDateString + ".";
            break;
        case "email":
            if (citationData.author != undefined) {
                citation += citationData.author + ". ";
            }
            if (citationData.subject != undefined) {
                citation += "\"" + citationData.artist + ".\" ";
            }
            citation += "Message to ";
            if (citationData.receiver != undefined) {
                citation += citationData.receiver + ". ";
            }
            citation += citationData.accessDateString + ". E-mail.";
            break;
        case "tweet":
            if (citationData.author != undefined) {
                citation += citationData.author + " ";
            }
            if (citationData.twitterUsername != undefined) {
                citation += "(" + citationData.twitterUsername + "). ";
            }
            if (citationData.tweet != undefined) {
                citation += "\"" + citationData.tweet + ".\" ";
            }
            citation += citationData.accessDateString + ", Tweet.";
            break;
        case "video":
            if (citationData.author != undefined) {
                citation += citationData.author + ". ";
            }
            if (citationData.videoname != undefined) {
                citation += "\"" + citationData.videoname + "\". ";
            }
            if (citationData.mediaType != undefined) {
                citation += citationData.mediaType + ". ";
            }
            if (citationData.publisher != undefined) {
                citation += citationData.publisher + ", ";
            }
            if (citationData.datePublished != undefined) {
                citation += citationData.datePublished + ". ";
            }
            citation += "Web. " + citationData.accessDateString + ".";
            break;
    }
    return citation;
}

/**
 * Generates APA Citation based on:
 * https://owl.english.purdue.edu/owl/resource/560/10/
 *
 * @param citationData Object of data related to generating citation
 * @returns {string} Citation generated
 */
function APACitation(citationData) {
    citationData.accessDateString = "";
    var citation = "";
    if (citationData.author != undefined) {
        citation += citationData.author + ". ";
    }
    if (citationData.datePublished != undefined) {
        citation += "(" + citationData.datePublished + "). ";
    }
    if (citationData.articleTitle != undefined) {
        citation += citationData.articleTitle + ". ";
    }
    citation += "Retrieved from " + citationData.webURL;
    return citation;
}

/**
 * Generates Chicago Citation based on:
 * https://owl.english.purdue.edu/owl/resource/717/05/
 *
 * @param citationData Object of data related to generating citation
 * @returns {string} Citation generated
 */
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
 *              Otherwise, return undefined
 */
function getData(metaTags, attribute, query) {
    for (var i = 0; i < metaTags.length; i++) {
        if (metaTags[i].getAttribute(attribute) == query) {
            return metaTags[i].getAttribute("content");
        }
    }
    return undefined;
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
    switch (currentDate.getMonth()) {
        case 0:
            date.month = "Jan.";
            break;
        case 1:
            date.month = "Feb.";
            break;
        case 2:
            date.month = "Mar.";
            break;
        case 3:
            date.month = "Apr.";
            break;
        case 4:
            date.month = "May.";
            break;
        case 5:
            date.month = "Jun.";
            break;
        case 6:
            date.month = "Jul.";
            break;
        case 7:
            date.month = "Aug.";
            break;
        case 8:
            date.month = "Sept.";
            break;
        case 9:
            date.month = "Oct.";
            break;
        case 10:
            date.month = "Nov.";
            break;
        case 11:
            date.month = "Dec.";
            break;
    }
    //Puts the data into the date object that will be returned
    date.day = currentDate.getDate();
    date.year = currentDate.getFullYear();
    return date;
}