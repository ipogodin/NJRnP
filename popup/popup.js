const togglePluginIcon = document.getElementById('togglePluginIcon');
const pathToActivatePluginImg = "images/on.png";
const pathToDeactivatePluginImg = "images/off.png"

// Initial state check
chrome.storage.sync.get({ 'isPluginActive': true }, ({ isPluginActive }) => {
     togglePluginIcon.src = isPluginActive ? pathToActivatePluginImg : pathToDeactivatePluginImg;
});

//toggle the plugin state
togglePluginIcon.addEventListener('click', () => {
    chrome.storage.sync.get({ 'isPluginActive': true }, ({ isPluginActive }) => {
        const newState = !isPluginActive;
        togglePluginIcon.src = newState ? pathToActivatePluginImg : pathToDeactivatePluginImg;
        chrome.storage.sync.set({ 'isPluginActive': newState });

        // Inform content script about the plugin's state
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { isPluginActive: newState });
        });
    });
});

