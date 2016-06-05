/**
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
		$.ajax({ url: url, success: function(data){

			//Puts the data from the url inside the div
			var myWebDiv = document.createElement('div');
			myWebDiv.innerHTML = data;

			//Put all meta tag names inside the metaTags 
			var metaTags = myWebDiv.getElementsByTagName('meta');
			for( var index = 0; index < metaTags.length; index++){
				alert(metaTags[index].getAttribute("content"));
			}

			}
		});

	}
);

//Make a class for Citation
class Citation{
	constructor();
		var webtitle = getWebTitle();
		var publisher = getPub;
		var articletitle = getArticleTitle;
		var author = getAuthor;
		var date = getDatePosted();
		var url = getUrl();
		var dateAccessed = accessDate();
}
//Website title
function getWebTitle(){
	for( var i = 0; i < metaTags.length; i++){
		if(metaTags[i].getAttribute("property") == "og.site_name"){
			return metaTags[i].getAttribute("content");
		}
	}

	return "";
}
//Publisher/sponsor
function getPub(){
	for( var i = 0; i < metaTags.length; i++){
		if(metaTags[i].getAttribute("property") == "article:publisher"){
			return metaTags[i].getAttribute("content");
		}
	}

	return "";
}
//Article Title
function getArticleTitle(){
	for( var i = 0; i < metaTags.length; i++){
		if(metaTags[i].getAttribute("property") == "og.title"){
			return metaTags[i].getAttribute("content");
		}
	}

	return "";
}
//Author
function getAuthor(){
	for( var i = 0; i < metaTags.length; i++){
		if(metaTags[i].getAttribute("property") == "author"){
			return metaTags[i].getAttribute("content");
		}
	}

	return "";
}
//Date posted
function getDatePosted(){
	for( var i = 0; i < metaTags.length; i++){
		if(metaTags[i].getAttribute("property") == "og.site_name"){
			return metaTags[i].getAttribute("content");
		}
	}

	return "";
}
//Url (Personal Reference)
function getUrl(){
	for( var i = 0; i < metaTags.length; i++){
		if(metaTags[i].getAttribute("property") == "og.url"){
			return metaTags[i].getAttribute("content");
		}
	}

	return "";
}
//Date you accessed the material
function accessDate(){
	var currentdate = new Date();
	var date = (currentdate.getMonth() + 1) + "/" + currentdate.getDate() + "/" + currentdate.getFullYear();
	return date;
}
}