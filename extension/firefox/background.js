function storageWarnUrl(url) {
    browser.storage.local.get('scores_data', function(result){
       for (const ii in result['scores_data']) {
        if (url == result['scores_data'][ii].url && result['scores_data'][ii].score < 5) {
            console.log('Notification!')
            notify();
          return;
        }
       };
    });
};

browser.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    console.log('listener activated;')
    if (changeInfo.status == 'complete' && tab.active) {
        storageWarnUrl(tab.url);
    }
});

function notify() {
    browser.notifications.create({
        type:     'basic',
        iconUrl:  'images/authentisci_128x128.png',
        title:    'Article information',
        message:  'This article has been scored poorly for scientific interpretation',
        priority: 0});
}