document.addEventListener("DOMContentLoaded", () => {
  const domainInput = document.getElementById("domainInput");
  const saveBtn = document.getElementById("saveBtn");
  const domainList = document.getElementById("domainList");
  const toggleEnable = document.getElementById("toggleEnable");

  // Only run if this script is on the correct page (like options.html)
  const isOptionsPage = domainInput && saveBtn && domainList && toggleEnable;
  if (!isOptionsPage) return;

  // The rest of your logic is now safe
  chrome.storage.sync.get(["enabled", "domains"], ({ enabled = true, domains = [] }) => {
    toggleEnable.checked = enabled;
    renderDomains(domains);
  });

  toggleEnable.addEventListener("change", () => {
    chrome.storage.sync.set({ enabled: toggleEnable.checked });
  });

  saveBtn.addEventListener("click", () => {
    const newDomain = domainInput.value.trim().toLowerCase();
    if (!newDomain) return;

    chrome.storage.sync.get("domains", ({ domains = [] }) => {
      if (!domains.includes(newDomain)) {
        const updated = [...domains, newDomain];
        chrome.storage.sync.set({ domains: updated }, () => {
          domainInput.value = "";
          renderDomains(updated);
        });
      } else {
        domainInput.value = "";
      }
    });
  });

  domainInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      saveBtn.click();
    }
  });

  function renderDomains(domains) {
    domainList.innerHTML = "";

    domains.forEach((domain) => {
      const li = document.createElement("li");
      li.textContent = domain;

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.className = "delete-btn";
      deleteBtn.addEventListener("click", () => {
        const updated = domains.filter((d) => d !== domain);
        chrome.storage.sync.set({ domains: updated }, () => {
          renderDomains(updated);
        });
      });

      li.appendChild(deleteBtn);
      domainList.appendChild(li);
    });
  }
});
