
import React, { useState } from 'react';
import axios from 'axios';
import './LandingPage.css';

const LandingPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setUploadStatus('');
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus('Please select a file first.');
      return;
    }

    setUploadStatus('Uploading...');

    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onload = async () => {
      try {
        const response = await axios.post('http://localhost:3001/upload', {
          file: reader.result,
          fileName: selectedFile.name,
          contentType: selectedFile.type,
          // You can also pass a folderId here if you want to override the default
          // folderId: 'YOUR_SPECIFIC_FOLDER_ID' 
        });

        if (response.data.status === 'success') {
          setUploadStatus(`File uploaded successfully! File ID: ${response.data.fileId}`);
        } else {
          setUploadStatus(`Upload failed: ${response.data.message}`);
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        setUploadStatus('Upload failed. See console for details.');
      }
    };
    reader.onerror = (error) => {
      console.error('Error reading file:', error);
      setUploadStatus('Error reading file.');
    };
  };

  return (
    <div className="landing-page">
      <div className="upload-container">
        <h2>Upload a File to Google Drive</h2>
        <input type="file" onChange={handleFileChange} />
        <button className="upload-button" onClick={handleUpload}>
          Upload to Google Drive
        </button>
        {uploadStatus && <p className="upload-status">{uploadStatus}</p>}
      </div>
    </div>
  );
};

export default LandingPage;
