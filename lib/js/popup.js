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
			alert(getAuthor(metaTags));
			//for( var index = 0; index < metaTags.length; index++){
		//		alert(metaTags[index].getAttribute("content"));
		//	}

			var article = new Citation(metaTags);
			alert(article.author);


			}
		});

	}
);

function Citation(metaTags){
	var webtitle = getWebTitle(metaTags);
	var publisher = getPub(metaTags);
	var articletitle = getArticleTitle(metaTags);
	var author = getAuthor(metaTags);
	var date = getDatePosted(metaTags);
	var url = getUrl(metaTags);
	var dateAccessed = accessDate(metaTags);

	alert(author);
}

//Website title
function getWebTitle(metaTags){
	for( var i = 0; i < metaTags.length; i++){
		if(metaTags[i].getAttribute("property") == "og.site_name"){
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
		if(metaTags[i].getAttribute("property") == "og.title"){
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
//Date posted
function getDatePosted(metaTags){
	for( var i = 0; i < metaTags.length; i++){
		if(metaTags[i].getAttribute("property") == "og.site_name"){
			return metaTags[i].getAttribute("content");
		}
	}

	return "";
}
//Url (Personal Reference)
function getUrl(metaTags){
	for( var i = 0; i < metaTags.length; i++){
		if(metaTags[i].getAttribute("property") == "og.url"){
			return metaTags[i].getAttribute("content");
		}
	}

	return "";
}
//Date you accessed the material
function accessDate(metaTags){
	var currentdate = new Date();
	var date = (currentdate.getMonth() + 1) + "/" + currentdate.getDate() + "/" + currentdate.getFullYear();
	return date;
}

