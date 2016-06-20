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
chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
		//Grabs the User's current url
        //Tab Documentation: https://developer.chrome.com/extensions/tabs#type-Tab
		var tab = tabs[0];      //What is the purpose of this?
		var url = tab.url;      //Get URL of tab displaying
        var title = tab.title   //Get Title of tab

        //JQuery Ajax Function
        //Parameters: Options:  1. URL- String containing the url
        //                      2. success- Function if request succeeds
		$.ajax({url: url, success: function(data) {
			//Puts the data from the url inside the div
			var myWebDiv = document.createElement('div');
			myWebDiv.innerHTML = data;

			//Put all meta tag names inside the metaTags 
			var metaTags = myWebDiv.getElementsByTagName('meta');

            var MLA = document.getElementById('MLA');
            MLA.addEventListener('click', function() {
                alert('MLA');
            });
            var APA = document.getElementById('APA');
            APA.addEventListener('click', function() {
                alert('APA');
            });
            var Chicago = document.getElementById('Chicago');
            Chicago.addEventListener('click', function() {
                alert('Chicago');
            });

			//for( var index = 0; index < metaTags.length; index++){
		    //		alert(metaTags[index].getAttribute("content"));
		    //	}
			}
		});
	}
);

//Website title
//Might not be needed as chrome.tabs offers a tab.title property
function getWebTitle(metaTags){
	for(var i = 0; i < metaTags.length; i++){
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
	for(var i = 0; i < metaTags.length; i++){
		if(metaTags[i].getAttribute("property") == "article:publisher"){
			return metaTags[i].getAttribute("content");
		}
	}
	return "";
}

//Article Title
function getArticleTitle(metaTags){
	for(var i = 0; i < metaTags.length; i++){
		if(metaTags[i].getAttribute("property") == "og:title"){
			return metaTags[i].getAttribute("content");
		}
	}
	return "";
}

//Author
function getAuthor(metaTags){
	for(var i = 0; i < metaTags.length; i++){
		if(metaTags[i].getAttribute("name") == "author"){
			return metaTags[i].getAttribute("content");
		}
	}
	return "";
}

//Date posted *
function getDatePosted(metaTags){
	for(var i = 0; i < metaTags.length; i++){
		if(metaTags[i].getAttribute("property") == "article:published"){
			return metaTags[i].getAttribute("content");
		}
	}
	return "";
}

//Url (Personal Reference)
function getUrl(metaTags){
	for(var i = 0; i < metaTags.length; i++){
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

