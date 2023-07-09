// APP STRUCTURE
/* - app
    - index.js
    - package.json
    - package-lock.json
    - credentials.json
    - token.json
*/

// const { authorize, listLabels, sendReply, createMessage, generateReplyEmail } = require('./services/authorize');
const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const {authenticate} = require('@google-cloud/local-auth');
const {google} = require('googleapis');
const { error } = require('console');
const { create } = require('domain');
const cron = require('node-cron');


// Gmail API Quickstart 

// SCOPES   
const SCOPES = [
    'https://www.googleapis.com/auth/gmail.modify',
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/gmail.settings.basic'
];

// Token path for current working directory
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');


// load saved credentials if exist
async function loadSavedCredentialsIfExist() {
    try {
        const content = await fs.readFile(TOKEN_PATH);
        const credentials = JSON.parse(content);
        return google.auth.fromJSON(credentials);
    } catch (error) {
        return null;
    }   
}


// save credentials
async function saveCredentials(client) {
    const content = await fs.readFile(CREDENTIALS_PATH);
    const keys = JSON.parse(content);
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
        type: 'authorized user',
        client_id: key.client_id,
        client_secret: key.client_secret,
        rrefresh_token: client.credentials.refresh_token,
    });
    await fs.writeFile(TOKEN_PATH, payload);
}


// authorization
async function authorize() {
    let client = await loadSavedCredentialsIfExist();
    if(client) {
        return client;
    }
    client = await authenticate({
        scopes: SCOPES,
        keyfilePath: CREDENTIALS_PATH,
    });
    if(client.credentials) {
        await saveCredentials(client);
    }
    return client;
}


// function for labels listing
async function listLabels(auth) {
    const gmail = google.gmail({version: 'v1', auth});
    const res = await gmail.users.labels.list({
        userId: 'me',
    });
    console.log(res.data);
    const labels = res.data.labels;
    if(!labels || labels.length === 0) {
        console.log('No, labels found!');
        return;
    }
    console.log('labels:');
    labels.forEach((label) => {
        console.log(`- ${label.name}`);
    });
}

// check new Email
// Load client secrets from a local file
fs.readFile(CREDENTIALS_PATH, (err, content) => {
    if (err) {
      console.error('Error loading client secret file:', err);
      return;
    }
  
    // Authorize the client with the loaded credentials
    authorize(JSON.parse(content), checkNewEmails);
  });


// Send a reply to a specific email
async function sendReply(auth) {
    let client = await loadSavedCredentialsIfExist();
    const gmail = google.gmail({ version: 'v1', auth });
    const emailContent = generateReplyEmail(); // Generate the reply email content
  
    const request = {
      userId: 'me',
      resource: {
        raw: createMessage(emailContent),
        threadId: '1893abb4821283d2', // Replace with the thread ID of the email you want to reply to
      },
    };
  
    gmail.users.messages.send(request, (err, res) => {
      if (err) {
        console.error('The API returned an error:', err);
        return client;
      }
      console.log('Reply sent successfully!');
    });
  }

  // Helper function to create the message payload
function createMessage(emailContent) {
    const encodedEmail = Buffer.from(emailContent).toString('base64');
    return encodedEmail.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  
  // Helper function to generate the reply email content
  function generateReplyEmail() {
    const from = 'developer.mayurkukreja@gmail.com'; // Replace with the email address you want to reply from
    const to = 'kukrejamayur62@gmail.com'; // Replace with the email address you want to send the reply to
    const subject = 'Re: Hello Mayur, Testing Gmail API to generate reply'; // Replace with the subject of the email you are replying to
    const body = 'This is working, Wohoo! \n I am glad. Lets Implement more Features✅'; // Replace with the content of your reply email
  
    const emailContent = [
      `From: ${from}`,
      `To: ${to}`,
      `Subject: ${subject}`,
      '',
      `${body}`,
    ].join('\r\n');
  
    return emailContent;
  }

  
authorize().then(listLabels).catch(console.error);
cron.schedule('* * * * *', () => {
    authorize().sendReply().then(listLabels).catch(console.error);
});




