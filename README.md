# CyberShield Chrome Extension

CyberShield is a Chrome extension designed to protect users from phishing websites and malicious content. It checks the safety of websites in real-time by analyzing the URL, IP reputation, and scanning for malicious activity using services like AbuseIPDB and VirusTotal. It provides a risk assessment overlay for informed browsing.

## Features

- Analyzes website URLs and provides risk assessment.
- Fetches domain IP and checks reputation via AbuseIPDB.
- Scans the URL with VirusTotal for potential threats.
- Real-time risk analysis with detailed overlays on the website.
- Users enter their own API keys for customization.

## Installation and Usage

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/samrat-sarkar/cybershield-extension.git
   cd cybershield-extension
   ```

2. **Load the Extension into Chrome:**

   - Open Chrome and go to `chrome://extensions/`
   - Enable **Developer Mode** (top-right corner).
   - Click **Load Unpacked** and select the folder where you have the extension files.

3. **Enter API Keys:**

   - Click the extension icon in the Chrome toolbar.
   - Enter your **AbuseIPDB API Key** and **VirusTotal API Key** in the popup.
   - Click "Save API Keys" to store them.

4. **Use the Extension:**

   - Visit any website, and the extension will analyze its safety.
   - The risk level and threat intelligence will be displayed in a floating overlay.

## APIs Used

- **AbuseIPDB**: Used to check the reputation of an IP address.
- **VirusTotal**: Scans URLs for malicious content.
- **Google DNS**: Resolves domain names to IP addresses.

### API Key Storage

The API keys entered by the user are stored locally in Chrome using `chrome.storage.local`, ensuring user privacy.

## Screenshots

![Popup Interface](https://samrat-sarkar.github.io/cybershield-extension/screenshots/img1.png)
![Risk Analysis Overlay](https://samrat-sarkar.github.io/cybershield-extension/screenshots/img2.png)
![Extension in Action](https://samrat-sarkar.github.io/cybershield-extension/screenshots/img3.png)

---

Developed by **Samrat Sarkar and Vishal Shukla**  
Presented at **Hack IIT Kanpur Hackathon 2025**
