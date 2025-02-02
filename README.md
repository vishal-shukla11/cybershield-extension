
# CyberShield Chrome Extension

CyberShield is a Chrome extension designed to protect users from phishing websites and malicious content. It checks the safety of websites in real-time by analyzing the URL, IP reputation, and scanning for malicious activity using services like AbuseIPDB and VirusTotal. It provides a risk assessment overlay for informed browsing.

## Features

- Analyzes website URLs and provides risk assessment.
- Fetches domain IP and checks reputation via AbuseIPDB.
- Scans the URL with VirusTotal for potential threats.
- Real-time risk analysis with detailed overlays on the website.

## Code Structure

### 1. **content.js**

This is the core script that runs on every webpage the user visits. It:

- Fetches the current URL and analyzes its domain and IP.
- Queries AbuseIPDB for reputation data on the domain’s IP.
- Submits the URL to VirusTotal for scanning and retrieves the analysis status.
- Displays a floating overlay with the risk level and other threat intelligence.

### 2. **background.js**

Handles communication between the content script and the background service worker. It sends messages to APIs like VirusTotal and AbuseIPDB.

### 3. **manifest.json**

Defines the extension’s settings and permissions for Chrome. This file:

- Specifies which scripts to run on which pages.
- Configures permissions for accessing active tabs and using APIs.
- Loads the background service worker and content scripts.

### 4. **popup.html**

This is the popup interface that opens when the user clicks the extension icon. It provides information about CyberShield, including how it works and team details.

### 5. **CSS Styles**

Custom styles for the overlay and popup are written directly within the JavaScript files (`content.js` and `popup.html`). These styles make the user interface visually appealing and functional.

## Installation and Usage

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/samrat-sarkar/cybershield-extension.git
   cd cybershield-extension
   ```

2. **Install Dependencies:**

   For a typical Chrome extension, you don't need a `requirements.txt` as all dependencies are managed via CDNs. Just ensure you have the necessary Chrome permissions and API keys.

3. **Load the Extension into Chrome:**

   - Open Chrome and go to `chrome://extensions/`
   - Enable **Developer Mode** (top-right corner).
   - Click **Load Unpacked** and select the folder where you have the extension files.

4. **Use the Extension:**

   - Once installed, the extension icon will appear in the Chrome toolbar.
   - Click on the icon to view the popup with information about the extension.
   - Visit any website, and the extension will automatically analyze its safety and display the risk level in a floating overlay.

## APIs Used

- **AbuseIPDB**: Used to check the reputation of an IP address. Requires an API key.
- **VirusTotal**: Scans URLs for malicious content. Requires an API key.
- **Google DNS**: Resolves domain names to IP addresses.

### API Keys

You need API keys for both **AbuseIPDB** and **VirusTotal**. Replace the placeholder keys in the `content.js` and `background.js` files with your valid keys.

### AbuseIPDB API Key

```js
const apiKey = "ABUSEIPDB_API_KEY";
```

### VirusTotal API Key

```js
const apiKey = "VIRUSTOTAL_API_KEY";
```
