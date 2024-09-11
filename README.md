# Feeding Frenzy Call Anywhere Extension

## Overview

The Feeding Frenzy Call Anywhere Extension is a Chrome browser extension that detects phone numbers on web pages and adds a call button next to them. This extension integrates with the Feeding Frenzy CRM system, allowing users to easily manage leads and initiate calls directly from any webpage.

## Features

1. Automatic phone number detection on web pages
2. One-click calling functionality
3. Integration with Feeding Frenzy CRM for lead management
4. Customizable settings for VOIP phone number, base URL, and user ID

## Installation

1. Download the extension files
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the folder containing the extension files

## How to Use

1. After installation, you'll see the extension icon in your Chrome toolbar
2. Click the icon to open the extension popup
3. Configure your settings in the Settings section
4. Browse any webpage, and the extension will automatically detect phone numbers
5. Click the phone icon next to a detected number to initiate a call

## How It Works

1. The extension uses a content script (`content.js`) to scan web pages for phone numbers using a regular expression
2. When a phone number is detected, a call button is injected next to it
3. Clicking the call button sends a message to the background script (`background.js`)
4. The background script checks if the phone number exists in the CRM and creates a new lead if necessary
5. The extension then opens a new window to initiate the call using the Feeding Frenzy system

## Configuration

You can configure the following settings in the extension popup:

1. VOIP Phone Number: Your outbound caller ID
2. Base URL: The base URL for the Feeding Frenzy API
3. User ID: Your Feeding Frenzy user ID

You need to set these fields to match your VOIP Phone Number, Base URL, and User ID (Sales Representative ID)

## Click on the extension icon, then settings:
![image](https://github.com/user-attachments/assets/f77d4d84-eea9-465f-a676-c2ebb28fbfad)

## Update the fields, then save settings:
![image](https://github.com/user-attachments/assets/67b52df3-4e0d-43bf-8143-69e07dc7eda9)




## Known Issues and Limitations

1. The extension may not detect phone numbers in complex page layouts or dynamically loaded content
2. The extension doesn't handle international phone number formats comprehensively
3. There's no error handling for network issues or API failures in the popup UI

## Security Considerations

1. The extension requires permission to access all websites, which may raise privacy concerns
2. Sensitive information like the base URL and user ID are stored in Chrome's sync storage, which may not be suitable for all security requirements
3. The extension doesn't implement any authentication or authorization checks when making API calls

## Future Improvements

1. Implement proper Google Sign-In integration
2. Enhance phone number detection to cover more formats and edge cases
3. Add better error handling and user feedback mechanisms
4. Implement secure authentication for API calls
5. Add support for international phone numbers and formatting

## Contributing

Contributions to improve the extension are welcome. Please submit pull requests or open issues on the project repository.
