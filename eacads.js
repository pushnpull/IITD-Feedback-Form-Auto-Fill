//console.log("IITD Auto Fill.");

chrome.runtime.onMessage.addListener(gotMessage);

function gotMessage(message, sender, sendResponse){
    console.log(message.txt);
}  


function autoFillIITDFeedback() {
  console.log("Starting IITD Feedback Auto-Fill...");

  function fillRadios() {
    const radioMap = new Map();

    // Group by name
    document.querySelectorAll('input[type="radio"][name^="answerId"]').forEach(radio => {
      const name = radio.name;
      if (!radioMap.has(name)) radioMap.set(name, []);
      radioMap.get(name).push(radio);
    });

    radioMap.forEach((group, name) => {
      // DO NOT SORT — use DOM order (as seen on screen)
      // group.sort(...) ← REMOVE THIS

      // Get question text
      const questionDiv = group[0].closest('.form-group')?.previousElementSibling;
      const questionText = questionDiv ? questionDiv.textContent.trim().toLowerCase() : '';

      let targetIndex;

      if (questionText.includes('work load') || questionText.includes('workload')) {
        targetIndex = 0; // Just Right is FIRST in DOM
      } 
      else if (group.length === 3) {
        targetIndex = 0; // Yes
      }
      else if (group.length === 6) {
        targetIndex = 4; // Excellent (5th option, 0-indexed)
      }
      else {
        targetIndex = group.length - 2; // Second last (before No Opinion)
      }

      if (targetIndex >= 0 && targetIndex < group.length) {
        const radio = group[targetIndex];
        radio.checked = true;
        radio.dispatchEvent(new Event('change', { bubbles: true }));
        console.log(`Filled: "${questionText.slice(0, 50)}..." → ${radio.nextSibling?.textContent?.trim() || radio.value}`);
      }
    });
  }

  // Fill textareas
  document.querySelectorAll('textarea').forEach((ta, i) => {
    if (!ta.value.trim()) {
      const label = ta.previousElementSibling?.textContent.toLowerCase() || '';
      let text = "No opinion";
      if (label.includes('like most')) text = "The teaching style and clarity.";
      else if (label.includes('dislike most')) text = "Nothing specific.";
      else if (label.includes('suggestions') || label.includes('comments')) text = "Keep it up.";
      ta.value = text;
      ta.dispatchEvent(new Event('input', { bubbles: true }));
    }
  });

  fillRadios();
  console.log("Auto-fill complete!");
}

// MutationObserver + delay
const observer = new MutationObserver(autoFillIITDFeedback);
observer.observe(document.body, { childList: true, subtree: true });

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => setTimeout(autoFillIITDFeedback, 1500));
} else {
  setTimeout(autoFillIITDFeedback, 1500);
}
