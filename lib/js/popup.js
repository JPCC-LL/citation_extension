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
//Website title
//Publisher/sponsor
//Article Title
//Author
//Date posted
//Url (Personal Reference)
//Date you accessed the material
