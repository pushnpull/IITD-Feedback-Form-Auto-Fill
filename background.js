chrome.action.onClicked.addListener((tab) => {
  if (!tab.url?.includes('eacademics.iitd.ac.in')) {
    console.log("Not on IITD site.");
    return;
  }

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['eacads.js']
  }).then(() => {
    console.log("Auto-fill script injected.");
  }).catch(err => {
    console.error("Injection failed:", err);
  });
});
