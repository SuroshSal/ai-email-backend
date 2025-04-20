const express = require("express");
const session = require("express-session");
const { google } = require("googleapis");
require("dotenv").config();

const app = express();

app.use(session({
  secret: 'secret-key', // Replace with secure value
  resave: false,
  saveUninitialized: true,
}));

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "https://ai-email-backend.onrender.com/oauth2callback"
);

app.get("/login", (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/gmail.readonly"]
  });
  res.redirect(url);
});

app.get("/oauth2callback", async (req, res) => {
  const { code } = req.query;
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  req.session.tokens = tokens;
  res.send("✅ Gmail authentication successful. You may close this tab.");
});

app.listen(3000, () => {
  console.log("OAuth server running on port 3000");
});
require('dotenv').config();
