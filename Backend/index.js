
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = 3001;

// --- Configuration ---
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby5nv8HZiMm0VOyOr916h4WPwZQ7bjTNBa1KQNiYViH1nWfZk8IqawDjVW7bfzHH0lR/exec'; // <-- IMPORTANT: REPLACE WITH YOUR URL
const DEFAULT_FOLDER_ID = '1s0sLnQx6635vD8PT0XRa1jwzqDMPm5pr'; // <-- Optional: Set a default folder ID here

app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increase limit for larger files

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/upload', async (req, res) => {
  try {
    const { file, fileName, contentType, folderId } = req.body;

    if (!file || !fileName || !contentType) {
      return res.status(400).json({ status: 'error', message: 'Missing file data' });
    }

    const response = await axios.post(GOOGLE_SCRIPT_URL, {
      file,
      fileName,
      contentType,
      folderId: folderId || DEFAULT_FOLDER_ID // Use provided folderId or the default
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error uploading to Google Drive:', error);
    res.status(500).json({ status: 'error', message: 'Failed to upload to Google Drive' });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
