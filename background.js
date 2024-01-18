const RELOAD_TO_LAST_VALID = 'reloadToLastValidUrl';
const LAST_VALID_URLS = 'lastValidUrls';

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === RELOAD_TO_LAST_VALID) {
    chrome.storage.local.get(LAST_VALID_URLS, function(result) {
      var urls = result[LAST_VALID_URLS];
      console.log(urls);
      if (urls && urls.length > 0) {
        // Use the most recent URL and update the storage
        var mostRecentUrl = urls[0];
        urls.shift(); // Remove the used URL
        chrome.storage.local.set({[LAST_VALID_URLS]: urls});
        chrome.tabs.update(sender.tab.id, {url: mostRecentUrl});
      }
    });
  }
});
