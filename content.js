// Regular expression to match phone numbers in common formats, excluding raw number strings like '1234567890'
const phoneRegex = /(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]\d{3}[-.\s]\d{4}/g;

// Set to track already processed elements to avoid duplicate buttons
let processedElements = new Set();

// Function to iterate over all visible text nodes on the page
function parseVisibleTextContent() {
    let textNodes = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
            return node.parentNode.offsetParent !== null ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
        }
    });

    let node;
    while ((node = walker.nextNode())) {
        textNodes.push(node);
    }
    return textNodes;
}

// Function to check if a phone number already has a button next to it
function phoneNumberAlreadyTagged(node, phoneNumber) {
    const nextSibling = node.nextSibling;
    return nextSibling && nextSibling.nodeName === "BUTTON" && nextSibling.title.includes(phoneNumber);
}

// Function to inject a button next to the detected phone number
function createPhoneButtonInline(phoneNumber, node) {
    if (!node || processedElements.has(node)) return;

    const span = document.createElement("span");
    span.style.position = "relative";
    span.style.display = "inline-block";
    node.parentNode.insertBefore(span, node);
    span.appendChild(node);

    const buttonWrapper = document.createElement("span");
    buttonWrapper.style.display = "inline-flex";
    buttonWrapper.style.alignItems = "center";
    buttonWrapper.style.position = "absolute";
    buttonWrapper.style.top = "50%";
    buttonWrapper.style.transform = "translateY(-50%)";
    buttonWrapper.style.left = "100%";
    buttonWrapper.style.marginLeft = "8px";
    buttonWrapper.style.zIndex = "9999";

    const svgButton = document.createElement("img");
    svgButton.src = chrome.runtime.getURL("icon.svg");
    svgButton.style.width = "24px";
    svgButton.style.height = "24px";
    svgButton.style.cursor = "pointer";
    svgButton.style.filter = "drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.3))";
    svgButton.style.transition = "filter 0.3s ease";

    svgButton.addEventListener("mouseover", () => {
        svgButton.style.filter = "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.5))";
    });

    svgButton.addEventListener("mouseout", () => {
        svgButton.style.filter = "drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.3))";
    });

    svgButton.title = `Call ${phoneNumber}`;
    span.appendChild(buttonWrapper);
    svgButton.addEventListener("click", async (event) => {
        event.preventDefault();
        event.stopPropagation();
        try {
            const response = await chrome.runtime.sendMessage({ action: "manageLeadByPhone", phoneNumber });
            if (response.success && response.lead && response.lead.LeadID) {
                chrome.storage.sync.get(['voipPhoneNumber', 'baseUrl', 'userId'], (data) => {
                    const voipPhoneNumber = data.voipPhoneNumber || "(689) 600-1779";
                    const baseUrl = data.baseUrl || "https://if.feedingfrenzy.ai";
                    const userId = data.userId || "4";
                    const url = `${baseUrl}/tw_call2.html?phone=${encodeURIComponent(phoneNumber)}&name=%20&record=true&CallerID=${encodeURIComponent(voipPhoneNumber)}&LeadID=${response.lead.LeadID}&SalesRepresentativeID=${userId}`;
                    window.open(url, '_blank', 'width=600,height=1000');
                });
            } else {
                console.error('Failed to get or create lead with a valid LeadID:', response.error);
                alert('Failed to process lead. Please try again.');
            }
        } catch (error) {
            console.error('Error processing lead:', error);
            alert('An error occurred while processing the lead. Please try again.');
        }
    });

    buttonWrapper.appendChild(svgButton);
    buttonWrapper.style.pointerEvents = "auto";

    span.appendChild(buttonWrapper);

    processedElements.add(node);
    console.log(`[PhoneDetection] Injected button for: ${phoneNumber}`);
}

// Main function to scan and tag phone numbers
function detectPhoneNumbers() {
    console.log("[PhoneDetection] Scanning for phone numbers...");
    const textNodes = parseVisibleTextContent();
    textNodes.forEach(node => {
        const matches = node.nodeValue.match(phoneRegex);
        if (matches) {
            matches.forEach(phoneNumber => {
                console.log(`[PhoneDetection] Detected phone number: ${phoneNumber}`);
                createPhoneButtonInline(phoneNumber.trim(), node);
            });
        }
    });
    console.log("[PhoneDetection] Phone number scan complete.");
}

// Initial scan on page load
detectPhoneNumbers();

// Mutation observer to detect dynamic DOM changes (e.g., when content loads via AJAX or user interaction)
const observer = new MutationObserver(mutations => {
    console.log("[PhoneDetection] DOM change detected, triggering re-scan...");
    detectPhoneNumbers();
});
observer.observe(document.body, { childList: true, subtree: true });
