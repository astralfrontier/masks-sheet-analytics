const fs = require("fs-extra");
const readline = require("readline");
const { google } = require("googleapis");

const SCOPES = ["https://www.googleapis.com/auth/drive.metadata.readonly"];
const CREDENTIALS_PATH = "credentials.json";
const TOKEN_PATH = "token.json";

const getAccessToken = oAuth2Client =>
  new Promise((resolve, reject) => {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES
    });
    console.log("Authorize this app by visiting this url:", authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.question("Enter the code from that page here: ", code => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) {
          reject(err);
        } else {
          fs.writeJsonSync(TOKEN_PATH, token);
          resolve(token);
        }
      });
    });
  });

(async () => {
  const credentials = await fs.readJson(CREDENTIALS_PATH);
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );
  let token;
  if (fs.existsSync(TOKEN_PATH)) {
    token = await fs.readJson(TOKEN_PATH);
  } else {
    token = await getAccessToken(oAuth2Client);
  }
  oAuth2Client.setCredentials(token);

  // Read files
  const drive = google.drive({ version: "v3", auth: oAuth2Client });
  const res = await drive.files.list({
    pageSize: 10,
    fields: "nextPageToken,files(id, name)"
  });
  console.log(res.data.files);
})().catch(console.error);
