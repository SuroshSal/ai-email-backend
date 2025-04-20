require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { authorizeUrl, handleOAuthCallback, sendSampleEmail } = require('./auth');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Route to start the OAuth process
app.get('/auth', (req, res) => {
  res.redirect(authorizeUrl);
});

// Google OAuth callback
app.get('/callback', async (req, res) => {
  try {
    await handleOAuthCallback(req, res);
  } catch (error) {
    console.error('OAuth callback error:', error);
    res.status(500).send('OAuth authentication failed.');
  }
});

// Send a test email (for verification)
app.get('/send-email', async (req, res) => {
  try {
    await sendSampleEmail();
    res.send('✅ Email sent successfully!');
  } catch (error) {
    console.error('Send email error:', error);
    res.status(500).send('❌ Failed to send email.');
  }
});

// Server
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
