var domainName = "";

var setCollapsibleEntries = function() {
	console.log("[setCollapsibleEntries]");
	var coll = document.getElementsByClassName("collapsible");
	var ix;

	for (ix = 0; ix < coll.length; ix++) {
			coll[ix].addEventListener("click", function () {
					this.classList.toggle("active");
					var content = this.nextElementSibling;
					if (content.style.maxHeight) {
							content.style.maxHeight = null;
					}
					else {
							content.style.maxHeight = content.scrollHeight + "px";
					}
			});
	}
}

chrome.runtime.sendMessage({
	url: window.location.href
  })

var getWebsiteInformation = function(){
	console.log("[getWebsiteURL]");
	chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
	    var url = tabs[0].url;
	    console.log("the URL is: " + url);

	    //parse URL here
	    // REGEX TO FIND DOMAIN NAME
	    var domain = url.match(/^[\w-]+:\/{2,}\[?([\w\.:-]+)\]?(?::[0-9]*)?/)[1];
			var pageheadings = tabs[0].title.split("-", 2);
			var pagetitle = pageheadings[0];
			// var pageauthor = "";
			// if (pageheadings.length > 1){
			// 	pageauthor = pageheadings[1].concat(" :");
			// }
			domainName = domain;

			console.log("the parsed URL is: " + domain);
			console.log("the TITLE is: " + pagetitle);

			document.getElementById("findTheTitle").innerHTML = pagetitle;
			// document.getElementById("findTheAuthor").innerHTML = pageheadings;
			document.getElementById("findTheDomain").innerHTML = domainName;

	    // getData();

	});
}

var getWebsiteTitle = function(){
	console.log("[getWebsiteTitle]");
	chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
		var pagetitle = tabs[0].title;
		console.log("the TITLE is: " + pagetitle);

		document.getElementById("findTheTitle").innerHTML = pagetitle;

		// $("#findTheDomain").html(domainName);
		// getData();

});
}

var init = function(){
	getWebsiteInformation();
	setCollapsibleEntries();
};

init();
