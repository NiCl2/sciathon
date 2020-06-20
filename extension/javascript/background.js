chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
    console.log(sendResponse);    
  });

// Now inject a script onto the page
chrome.tabs.executeScript(tab.id, {
    code: "chrome.extension.sendRequest({content: document.body.innerHTML}, function(response) { console.log('success'); });"
  }, function() { console.log('done'); });


// Checking page title
if (document.title.indexOf("Google") != -1) {
    //Creating Elements
    var btn = document.createElement("BUTTON")
    var t = document.createTextNode("CLICK ME");
    btn.appendChild(t);
    //Appending to DOM 
    document.body.appendChild(btn);
}