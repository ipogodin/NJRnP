const RELOAD_TO_LAST_VALID = 'reloadToLastValidUrl';
const TEN_SECONDS = 10000;
const LAST_VALID_URLS = 'lastValidUrls';
const MAX_URLS = 3;

let isPluginActive = true;

function checkForErrorAndSaveUrl() {
  if (!isPluginActive) return;

  const elements = document.querySelectorAll('span');
  const errorSpan = Array.from(elements).find(el => el.textContent.includes('Error Code'));
  if (errorSpan) {
    chrome.runtime.sendMessage({action: RELOAD_TO_LAST_VALID});
  } else {
    var url = window.location.href;
    console.log(url);
    chrome.storage.local.get(LAST_VALID_URLS, function(result) {
      var urls = result[LAST_VALID_URLS] || [];
      // Update LRU: Move current URL to the front, remove duplicates, trim to MAX_URLS
      urls = [url, ...urls.filter(u => u !== url)].slice(0, MAX_URLS);
      chrome.storage.local.set({[LAST_VALID_URLS]: urls});
    });
  }
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.hasOwnProperty('isPluginActive')) {
    isPluginActive = request.isPluginActive;
  }
});

setInterval(checkForErrorAndSaveUrl, TEN_SECONDS);
