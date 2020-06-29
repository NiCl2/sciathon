// matching to MONGO database 
const API_URL = 'https://authentisci-api.herokuapp.com/api/v1/average?ad=';

function dbCheckUrls(url) {
  fetch(API_URL + url)
    .then(res => res.json())
    .then(data => {
        if (data.score < 5) {
            notify()
        }
    }).catch(err => {

    });

};
 
chrome.tabs.onActivated.addListener(function (activeInfo) {
    chrome.tabs.get(activeInfo.tabId, function (tab) {
        
        dbCheckUrls(tab.url);

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
