$(document).ready(function() {
    // Navigation
    $('.dropdown-item').on('click', function() {
        const target = $(this).data('target');
        if (target) {
            $('.section').removeClass('active');
            $('#' + target).addClass('active');

            // Load settings when the settings section is shown
            if (target === 'settingsSection') {
                chrome.storage.sync.get(['voipPhoneNumber', 'baseUrl', 'userId'], (data) => {
                    $('#voipPhoneNumber').val(data.voipPhoneNumber || '(689) 600-1779');
                    $('#baseUrl').val(data.baseUrl || 'https://if.feedingfrenzy.ai');
                    $('#userId').val(data.userId || '4');
                });
            }
        }
    });

    $('#backToMenu').on('click', function() {
        $('.section').removeClass('active');
        $('#mainMenu').addClass('active');
    });

    // Save settings
    $('#saveSettings').on('click', function() {
        const voipPhoneNumber = $('#voipPhoneNumber').val();
        const baseUrl = $('#baseUrl').val();
        const userId = $('#userId').val();

        chrome.storage.sync.set({
            voipPhoneNumber,
            baseUrl,
            userId
        }, () => {
            alert('Settings saved');
        });
    });

    // Load settings on popup open
    chrome.storage.sync.get(['voipPhoneNumber', 'baseUrl', 'userId'], (data) => {
        $('#voipPhoneNumber').val(data.voipPhoneNumber || '(689) 600-1779');
        $('#baseUrl').val(data.baseUrl || 'https://if.feedingfrenzy.ai');
        $('#userId').val(data.userId || '4');
    });
});