(function () {
  function sendFetchMessage(url, options) {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({ type: 'fetch', url, options }, (response) => {
        if (response && response.error) {
          reject(response.error);
        } else {
          resolve(response.data);
        }
      });
    });
  }

  function formatURL(url) {
    return url.length > 60 ? `${url.slice(0, 10)}...${url.slice(-10)}` : url;
  }

  function isValidURL(url) {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  }

async function fetchSitePermissions() {
  const permissionsToCheck = {
    'geolocation': 'This Website Can Access Your Location',
    'notifications': 'This Website Can Send Notifications',
    'camera': 'This Website Can Access Your Camera',
    'microphone': 'This Website Can Access Your Microphone',
    'clipboard-read': 'This Website Can Read Content From Clipboard',
    'clipboard-write': 'This Website Can Write Content To Clipboard',
    'persistent-storage': 'This Website Can Store Data Persistently On Your Device',
    'idle-detection': 'This Website Can Detect Your Inactivity'
  };

  let permissionsGranted = [];

  for (const [permission, description] of Object.entries(permissionsToCheck)) {
    try {
      const result = await navigator.permissions.query({ name: permission });
      if (result.state === 'granted') {
        permissionsGranted.push(`👉 ${description}`);
      }
    } catch (error) {
      console.warn(`Permission ${permission} not supported:`, error);
    }
  }

  return permissionsGranted.length > 0 
    ? permissionsGranted.join("<br>") 
    : "✅ No special permissions granted.";
}

  function fetchDomainIP(url) {
    const domain = new URL(url).hostname;
    const dnsUrl = `https://dns.google/resolve?name=${domain}&type=A`;

    return sendFetchMessage(dnsUrl, { method: 'GET' })
      .then(data => (data.Answer && data.Answer.length > 0 ? data.Answer[0].data : null))
      .catch(error => {
        console.error("IP resolution failed:", error);
        return null;
      });
  }

  function fetchAbuseIPDB(ip) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(['abuseKey'], function(result) {
        if (!result.abuseKey) {
          reject('AbuseIPDB API key not found. Please set it.');
          return;
        }

        const abuseUrl = `https://api.abuseipdb.com/api/v2/check?ipAddress=${ip}`;

        sendFetchMessage(abuseUrl, {
          method: "GET",
          headers: {
            "Key": result.abuseKey,
            "Accept": "application/json"
          }
        })
          .then(data => data.data)
          .then(data => resolve(data))
          .catch(error => {
            console.error("Error fetching AbuseIPDB data:", error);
            reject(error);
          });
      });
    });
  }

  function VirusTotalScan(currentURL) {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({ type: 'submit-url', url: currentURL }, function(response) {
        if (response && response.analysisId) {
          resolve(response.analysisId);
        } else {
          reject('Failed to get Analysis ID'); 
        }
      });
    });
  }

  function FetchVirusTotal(analysisId) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(['virusKey'], function(result) {
        if (!result.virusKey) {
          reject('VirusTotal API key not found. Please set it.');
          return;
        }

        const headers = { 'x-apikey': result.virusKey };

        sendFetchMessage(`https://www.virustotal.com/api/v3/analyses/${analysisId}`, {
          method: 'GET',
          headers: headers
        })
        .then(response => {
          const status = response.data?.attributes?.status;
          const stats = response.data?.attributes?.stats || {};

          if (status === 'completed') {
            resolve(stats);
          } else {
            resolve(null);
          }
        })
        .catch(error => {
          console.error("Error fetching scan status:", error);
          reject(error);
        });
      });
    });
  }

  function getRiskLevel(score) {
    if (score >= 90) return "🚨 High Risk!";
    if (score >= 70) return "⚠️ Risky!";
    if (score >= 50) return "🔶 Moderate Risk";
    if (score >= 30) return "🟡 Slight Risk";
    if (score >= 10) return "🟢 Low Risk";
    return "✅ Very Safe";
  }

  const overlay = document.createElement("div");
  overlay.classList.add("cyber-overlay");

  const style = document.createElement("style");
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap');

    .cyber-overlay {
      position: fixed;
      top: 10px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(15, 15, 15, 0.95);
      color: white;
      padding: 15px;
      width: 500px;
      z-index: 9999;
      font-family: 'Orbitron', sans-serif;
      font-size: 14px;
      border-radius: 10px;
      box-shadow: 0 0 15px rgba(0, 255, 255, 0.7);
      border: 1px solid cyan;
      text-align: left;
    }
    
    .cyber-overlay .close-btn {
      position: absolute;
      top: 5px;
      right: 10px;
      background: none;
      color: white;
      border: none;
      font-size: 16px;
      cursor: pointer;
    }

    .cyber-overlay .risk-score {
      font-weight: bold;
      font-size: 16px;
      color: cyan;
      text-shadow: 0 0 10px cyan;
    }
    
    .cyber-overlay div {
      margin: 5px 0;
    }
  `;

  document.head.appendChild(style);

  const closeButton = document.createElement("button");
  closeButton.innerText = "✖";
  closeButton.classList.add("close-btn");
  closeButton.addEventListener("click", () => overlay.remove());
  overlay.appendChild(closeButton);

  const currentURL = window.location.href;
  const formattedURL = formatURL(currentURL);

  if (isValidURL(currentURL)) {
    fetchDomainIP(currentURL)
      .then(ip => {
        if (ip) {
          const urlElem = document.createElement("div");
          urlElem.textContent = `🌍 URL: ${formattedURL}`;
          const ipElem = document.createElement("div");
          ipElem.textContent = `📌 IP: ${ip}`;
          overlay.appendChild(urlElem);
          overlay.appendChild(ipElem);
		  
		  fetchSitePermissions().then(permissions => {
            const permissionElem = document.createElement("div");
            permissionElem.innerHTML = `🔑 Permissions Granted:<br> ${permissions}`;
            overlay.appendChild(permissionElem);

            fetchAbuseIPDB(ip).then(abuseData => {
              if (abuseData) {
                const abuseScore = abuseData.abuseConfidenceScore;
                const abuseElem = document.createElement("div");
                abuseElem.innerHTML = `⚠️ Abuse Score: <span class="risk-score">${abuseScore}%</span> - ${getRiskLevel(abuseScore)}`;
                overlay.appendChild(abuseElem);
              }
            });

            chrome.storage.local.get(['virusKey'], function(result) {
              if (result.virusKey) {
                const scanStatusElem = document.createElement("div");
                scanStatusElem.textContent = "🛡️ Checking VirusTotal...";
                overlay.appendChild(scanStatusElem);
                
                VirusTotalScan(currentURL)
                  .then(analysisId => {
                    function checkScanStatus() {
                      FetchVirusTotal(analysisId)
                        .then(scanData => {
                          if (scanData) {
                            const { malicious, suspicious, harmless, undetected } = scanData;
                            const total = malicious + suspicious + harmless + undetected;
                            const score = ((malicious * 3 + suspicious * 2) / total) * 100;
                            scanStatusElem.innerHTML = `🛡️ VirusTotal Score: <span class="risk-score">${Math.round(score)}%</span> - ${getRiskLevel(score)}`;
                            clearInterval(statusInterval);
                          }
                        })
                        .catch(error => {
                          console.error("Error checking scan status:", error);
                        });
                    }		
                    const statusInterval = setInterval(checkScanStatus, 5000);
                  })
                  .catch(error => {
                    console.error("Error fetching VirusTotal scan:", error);
                  });
              }
            });
          });  
          document.body.appendChild(overlay);
        }
      })
      .catch(error => console.error("Error fetching domain IP:", error));
  } else {
    console.error("Invalid URL:", currentURL);
  }
})();
