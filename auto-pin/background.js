chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.url && changeInfo.status === "complete") {
    chrome.storage.sync.get(["domains", "enabled"], (data) => {
      const domains = data.domains || [];
      const isEnabled = data.enabled ?? true;

      if (!isEnabled) return;

      const url = new URL(tab.url);
      if (domains.some(domain => url.hostname.includes(domain))) {
        chrome.tabs.update(tabId, { pinned: true });
      }
    });
  }
});
