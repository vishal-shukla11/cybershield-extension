document.addEventListener("DOMContentLoaded", function () {
    const abuseInput = document.getElementById("abuseApiKey");
    const virusInput = document.getElementById("virusTotalApiKey");
    const saveButton = document.getElementById("saveBtn");

    chrome.storage.local.get(["abuseKey", "virusKey"], function (result) {
        if (result.abuseKey) abuseInput.value = result.abuseKey;
        if (result.virusKey) virusInput.value = result.virusKey;
    });

    saveButton.addEventListener("click", function () {
        const abuseKey = abuseInput.value;
        const virusKey = virusInput.value;

        chrome.storage.local.set({ abuseKey: abuseKey, virusKey: virusKey }, function () {
			console.log('API Keys Saved!');
        });
    });
});
