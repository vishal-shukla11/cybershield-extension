chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'fetch') {
    fetch(request.url, request.options)
      .then(response => response.json()) 
      .then(data => sendResponse({ data }))
      .catch(error => sendResponse({ error: error.toString() }));

    return true;
  }
});

const apiKey = 'VIRUSTOTAL_API_KEY';
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'submit-url') {
    const urlToScan = message.url;
    const headers = {
      'x-apikey': apiKey
    };
    fetch('https://www.virustotal.com/api/v3/urls', {
      method: 'POST',
      headers: headers,
      body: new URLSearchParams({
        url: urlToScan
      })
    })
      .then(response => response.json())
      .then(data => {
        if (data.data && data.data.id) {
          const analysisId = data.data.id;
          sendResponse({ analysisId: analysisId }); 
        } else {
          console.error('Failed to submit URL for scanning. Response:', data);
          sendResponse({ analysisId: null });
        }
      })
      .catch(error => {
        console.error('Error submitting URL for scanning:', error);
        sendResponse({ analysisId: null });
      });
    return true;
  }
});
