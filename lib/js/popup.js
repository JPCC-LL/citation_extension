/**
<<<<<<< HEAD
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

            var citationData = {
                author: getAuthor(metaTags),
                publisher: getPublisher(metaTags),
                websiteTitle: webURL,
                websiteURL: webTitle,
                articleTitle: getArticleTitle(metaTags),
                datePublished: getDatePosted(metaTags),
                accessDate: getAccessDate()
            };
            var box = document.getElementById('citation-text');
            var MLA = document.getElementById('MLA').addEventListener('click', function () {
                var MLACitation = function(citationData) {
                    var citation = citationData.author + ". ";
                    citation += "\"" + citationData.articleTitle + ".\" ";
                    citation += "\"" + citationData.articleTitle + ".\" ";
                    citation += citationData.websiteTitle + ". ";
                    citation += citationData.publisher + ", ";
                    citation += citationData.datePublished.day + ". " + citationData.datePublished.month + ". " +
                        citationData.datePublished.year + ". Web.";
                    citation += citationData.accessDate + ". ";
                    citation += "<" + citationData.websiteURL + ">.";
                    return citation;
                };
                box.innerHTML = MLACitation(citationData);
            });
            var APA = document.getElementById('APA').addEventListener('click', function () {
                var APACitation = function(citationData) {
                    var citation = citationData.author + ". ";
                    citation += "(" + citationData.datePublished + ").";
                    citation += citationData.articleTitle + ". ";
                    citation += "Retrieved from " + citationData.websiteURL;
                    return citation;
                };
                box.innerHTML = APACitation(citationData);
            });
            var Chicago = document.getElementById('Chicago').addEventListener('click', function () {
                var ChicagoCitation = function (citationData) {
                    var citation = citationData.author + ". ";
                    citation += "\"" + citationData.articleTitle + ".\"";
                    citation += citationData.websiteTitle + ". ";
                    citation += citationData.datePublished + ". ";
                    citation += citationData.accessDate + ". ";
                    citation += citationData.websiteURL + ".";
                    return citation;
                };
                box.innerHTML = ChicagoCitation(citationData);
            });
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
=======
 * Grabs the URL from the user's current tab
 * and puts the data .i.e the whole document
 * inside myWebDiv. 
 *
 **/
chrome.tabs.query(
	{currentWindow: true, active: true},
	function(tabs){
		//Grabs the User's current url
		var tab = tabs[0];
		var url = tab.url;
		$.ajax({ url: url, success: function(data)
			{
			//Puts the data from the url inside the div
			var myWebDiv = document.createElement('div');
			myWebDiv.innerHTML = data;

			//Put all meta tag names inside the metaTags 
			var metaTags = myWebDiv.getElementsByTagName('meta');

			//for( var index = 0; index < metaTags.length; index++){
		//		alert(metaTags[index].getAttribute("content"));
		//	}


			}
		});

	}
);


//Website title
function getWebTitle(metaTags){
	for( var i = 0; i < metaTags.length; i++){
		if(metaTags[i].getAttribute("property") == "og:site_name"){
			return metaTags[i].getAttribute("content");
		}
		if(metaTags[i].getAttribute("property") == "twitter:site"){
			return metaTags[i].getAttribute("content");
		}
	}
	return "";
}

//Publisher/sponsor
function getPub(metaTags){
	for( var i = 0; i < metaTags.length; i++){
		if(metaTags[i].getAttribute("property") == "article:publisher"){
			return metaTags[i].getAttribute("content");
		}
	}

	return "";
}


//Article Title
function getArticleTitle(metaTags){
	for( var i = 0; i < metaTags.length; i++){
		if(metaTags[i].getAttribute("property") == "og:title"){
			return metaTags[i].getAttribute("content");
		}
	}

	return "";
}

//Author
function getAuthor(metaTags){
	for( var i = 0; i < metaTags.length; i++){
		if(metaTags[i].getAttribute("name") == "author"){
			return metaTags[i].getAttribute("content");
		}
	}
	return "";
}



//Date posted *
function getDatePosted(metaTags){
	for( var i = 0; i < metaTags.length; i++){
		if(metaTags[i].getAttribute("property") == "article:published"){
			return metaTags[i].getAttribute("content");
		}
	}

	return "";
}

//Url (Personal Reference)
function getUrl(metaTags){
	for( var i = 0; i < metaTags.length; i++){
		if(metaTags[i].getAttribute("property") == "og:url"){
			return metaTags[i].getAttribute("content");
		}
	}

	return "";
}


//Date you accessed the material **
function accessDate(){
	var currentdate = new Date();
	var date;

	if((currentdate.getMonth()) == 0){
		date = "Jan.";
	}else if((currentdate.getMonth()) == 1){
		date = "Feb.";
	}else if((currentdate.getMonth()) == 2){
		date = "Mar.";
	}else if((currentdate.getMonth()) == 3){
		date = "Apr.";
	}else if((currentdate.getMonth()) == 4){
		date = "May";
	}else if((currentdate.getMonth()) == 5){
		date = "Jun.";
	}else if((currentdate.getMonth()) == 6){
		date = "Jul.";
	}else if((currentdate.getMonth()) == 7){
		date = "Aug.";
	}else if((currentdate.getMonth()) == 8){
		date = "Sept.";
	}else if((currentdate.getMonth()) == 9){
		date = "Oct.";
	}else if((currentdate.getMonth()) == 10){
		date = "Nov.";
	}else if((currentdate.getMonth()) == 11){
		date = "Dec.";
	}

	date = date + " " + currentdate.getDate() + ", " + currentdate.getFullYear();

	return date;
}

>>>>>>> 0b0b1b4f245ef7d34266f3842c4a7093fb424d35
