/*
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
    console.log(sendResponse);    
  });
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

function compareUrl(key, url){
    if (url.includes(key)) {
        return 1;
    } else {
        return 0;
    }
  }

function regCheckUrls(url, webData) {
    console.log(url);
    for (const key in webData.webData) {
        comp = compareUrl(key, url);
        if (comp === 1) {
            return key;
        }
    }
    return 0;
    
  };
 
chrome.tabs.onActivated.addListener(function (activeInfo) {
    chrome.tabs.get(activeInfo.tabId, function (tab) {
        console.log(tab.url);
        chrome.storage.local.get(['webData'], function (webData) {
            var addressMatch = regCheckUrls(tab.url, webData);
            if (addressMatch === 0) {
                
            } else {
                var entry = webData.webData[addressMatch];
                if (entry.score < 5) {
                    notify()
                }
                
            }

        });

    });
});

function notify() {
    chrome.notifications.create({
        type:     'basic',
        iconUrl:  'icon_128x128.png',
        title:    'Article information',
        message:  'This article has been scored poorly for scientific interpretation',
        priority: 0});
}
