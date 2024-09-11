document.getElementById('saveSettings').addEventListener('click', () => {
    const voipPhoneNumber = document.getElementById('voipPhoneNumber').value;
    const baseUrl = document.getElementById('baseUrl').value;
    const userId = document.getElementById('userId').value;

    chrome.storage.sync.set({
        voipPhoneNumber,
        baseUrl,
        userId
    }, () => {
        alert('Settings saved');
    });
});

document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.sync.get(['voipPhoneNumber', 'baseUrl', 'userId'], (data) => {
        if (data.voipPhoneNumber) document.getElementById('voipPhoneNumber').value = data.voipPhoneNumber;
        if (data.baseUrl) document.getElementById('baseUrl').value = data.baseUrl;
        if (data.userId) document.getElementById('userId').value = data.userId;
    });
});