chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
    console.log(sendResponse);    
  });

// Now inject a script onto the page
/*chrome.tabs.executeScript(tab.id, {
    code: "chrome.extension.sendRequest({content: document.body.innerHTML}, function(response) { console.log('success'); });"
  }, function() { console.log('done'); });
*/

// Checking page title
/*
if (document.title.indexOf("Google") != -1) {
    //Creating Elements
    var btn = document.createElement("BUTTON")
    var t = document.createTextNode("CLICK ME");
    btn.appendChild(t);
    //Appending to DOM 
    document.body.appendChild(btn);
}
*/

(function readJSON(){
  chrome.runtime.getPackageDirectoryEntry(function(root) {
      root.getFile("data/ratings.json", {}, function(fileEntry) {
          fileEntry.file(function(file) {
              var reader = new FileReader();
              var flag = 0;
              reader.onloadend = function(e) {
                  var webData = JSON.parse(this.result);
                  chrome.storage.local.set({"webData": webData});
              };
              reader.readAsText(file);             

          });
      });
  });
})();


/*
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  chrome.storage.local.get(['webData'], function(webData){
  console.log(webData);

      var comp = 0;
      for (const key in webData.webData) {
          comp = compareUrl(key, request);
          if (comp === 1 ) {
              alert("Matched url");
              break;
          }
      };

      console.log(comp);

  })


})
*/