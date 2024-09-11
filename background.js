chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "manageLeadByPhone") {
    manageLeadByPhone(request.phoneNumber)
      .then(lead => sendResponse({ success: true, lead }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Indicates that the response is asynchronous
  }
});

async function manageLeadByPhone(phoneNumber) {
  try {
    let lead = await searchLeadByPhone(phoneNumber);
    if (!lead) {
      console.log('No existing lead found. Inserting new lead.');
      await insertNewLead(phoneNumber);
      lead = await searchLeadByPhone(phoneNumber);
    }
    
    if (lead && lead.LeadID) {
      console.log('Lead found:', lead);
      return lead;
    } else {
      throw new Error('Failed to retrieve lead with a valid LeadID');
    }
  } catch (error) {
    console.error('Error in manageLeadByPhone:', error);
    throw error;
  }
}

async function searchLeadByPhone(phoneNumber) {
  const formattedPhone = phoneNumber.replace(/\D/g, '');
  const baseUrl = await getBaseUrl();
  const url = `${baseUrl}/JsonWs/FeedingFrenzy.Admin.Business.Leads.ashx`;
  console.log(`searchLeadByPhone: Using URL: ${url}`); // Log the URL being used
  const payload = {
    Method: "GetLeadsByPhone",
    Phone: formattedPhone
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'Accept': 'application/json'
    },
    body: new URLSearchParams({ json: JSON.stringify(payload) })
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  console.log('GetLeadsByPhone result:', data);

  if (data.Error) {
    throw new Error(`API error: ${data.Error}`);
  }

  const existingLeads = Array.isArray(data) ? data : [];
  return existingLeads.length > 0 ? existingLeads[0] : null;
}

async function insertNewLead(phoneNumber) {
  const baseUrl = await getBaseUrl();
  const userId = await getUserId();
  const url = `${baseUrl}/JsonWs/FeedingFrenzy.Admin.Business.Leads.ashx`;
  console.log(`insertNewLead: Using URL: ${url}`); // Log the URL being used
  const payload = {
    Method: "InsertLead",
    Phone: phoneNumber,
    FirstName: "",
    LastName: "",
    Email: "",
    Company: "",
    Address: "",
    City: "",
    State: "",
    ZipCode: "",
    SourceID: "1",
    Priority: "3",
    LeadStatusID: "1",
    OpportunitySize: "",
    SalesRepresentativeID: userId
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'Accept': 'application/json'
    },
    body: new URLSearchParams({ json: JSON.stringify(payload) })
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  console.log('InsertLead result:', data);

  if (data.Error) {
    throw new Error(`API error: ${data.Error}`);
  }

  return data;
}

async function getBaseUrl() {
  return new Promise((resolve) => {
    chrome.storage.sync.get('baseUrl', (data) => {
      console.log(`getBaseUrl: Retrieved baseUrl: ${data.baseUrl}`); // Log the retrieved base URL
      resolve(data.baseUrl || 'https://if.feedingfrenzy.ai');
    });
  });
}

async function getUserId() {
  return new Promise((resolve) => {
    chrome.storage.sync.get('userId', (data) => {
      resolve(data.userId || '4');
    });
  });
}
