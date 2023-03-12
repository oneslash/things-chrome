chrome.action.onClicked.addListener(function (activeTab) {
    const title = activeTab.title;
    const url = activeTab.url;

    var newURL = `things:///add?title=${title}&notes=Link: ${url}&show-quick-entry=true`;
    chrome.tabs.create({ url: newURL });
});
