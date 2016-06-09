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
		$.ajax({ url: url, success: function(data)
			{
			//Puts the data from the url inside the div
			var myWebDiv = document.createElement('div');
			myWebDiv.innerHTML = data;

			//Put all meta tag names inside the metaTags 
			var metaTags = myWebDiv.getElementsByTagName('meta');
<<<<<<< HEAD

			var citation = new Citation(metaTags);
			alert(getUrl(metaTags));

=======
			alert(getAuthor(metaTags));
			//for( var index = 0; index < metaTags.length; index++){
		//		alert(metaTags[index].getAttribute("content"));
		//	}

			var article = new Citation(metaTags);
			//alert(article.format);
>>>>>>> c1f4308188dc7bc91c58d069a486923d399e06b9
			}
		});

	}
);

<<<<<<< HEAD
=======
function Citation(metaTags){
	var webTitle = getWebTitle(metaTags);
	var publisher = getPub(metaTags);
	var articleTitle = getArticleTitle(metaTags);
	var author = getAuthor(metaTags);
	var date = getDatePosted(metaTags);
	var url = getUrl(metaTags);
	var dateAccessed = accessDate();

	alert(webTitle);
	alert(publisher);
	alert(articleTitle);
	alert(author);
	alert(date);
	alert(url);
	alert(dateAccessed);
}

>>>>>>> c1f4308188dc7bc91c58d069a486923d399e06b9
//Website title
function getWebTitle(metaTags){
	for( var i = 0; i < metaTags.length; i++){
		if(metaTags[i].getAttribute("property") == "og:site_name"){
<<<<<<< HEAD
=======
			return metaTags[i].getAttribute("content");
		}
		if(metaTags[i].getAttribute("property") == "twitter:site"){
>>>>>>> c1f4308188dc7bc91c58d069a486923d399e06b9
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
<<<<<<< HEAD

//Article Title
=======
//Article Title **
>>>>>>> c1f4308188dc7bc91c58d069a486923d399e06b9
function getArticleTitle(metaTags){
	for( var i = 0; i < metaTags.length; i++){
		if(metaTags[i].getAttribute("property") == "og:title"){
			return metaTags[i].getAttribute("content");
		}
	}

	return "";
}
<<<<<<< HEAD

//Author
=======
//Author **
>>>>>>> c1f4308188dc7bc91c58d069a486923d399e06b9
function getAuthor(metaTags){
	for( var i = 0; i < metaTags.length; i++){
		if(metaTags[i].getAttribute("name") == "author"){
			return metaTags[i].getAttribute("content");
		}
	}
	return "";
}
<<<<<<< HEAD

//Date posted
function getDatePosted(metaTags){
	for( var i = 0; i < metaTags.length; i++){
		if(metaTags[i].getAttribute("property") == "og:site_name"){
=======
//Date posted ** 
function getDatePosted(metaTags){
	for( var i = 0; i < metaTags.length; i++){
		if(metaTags[i].getAttribute("property") == "article:published"){
>>>>>>> c1f4308188dc7bc91c58d069a486923d399e06b9
			return metaTags[i].getAttribute("content");
		}
	}

	return "";
}
<<<<<<< HEAD

//Url (Personal Reference)
=======
//Url (Personal Reference) **
>>>>>>> c1f4308188dc7bc91c58d069a486923d399e06b9
function getUrl(metaTags){
	for( var i = 0; i < metaTags.length; i++){
		if(metaTags[i].getAttribute("property") == "og:url"){
			return metaTags[i].getAttribute("content");
		}
	}

	return "";
}
<<<<<<< HEAD

//Date you accessed the material
function accessDate(metaTags){
=======
//Date you accessed the material **
function accessDate(){
>>>>>>> c1f4308188dc7bc91c58d069a486923d399e06b9
	var currentdate = new Date();
	var date = (currentdate.getMonth() + 1) + "/" + currentdate.getDate() + "/" + currentdate.getFullYear();
	return date;
}

