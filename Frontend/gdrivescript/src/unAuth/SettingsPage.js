
import React, { useState, useContext } from 'react';
import jsPDF from 'jspdf';
import axios from 'axios';
import './SettingsPage.css';
import { FileContext } from '../contexts/FileContext';

const SettingsPage = () => {
  const { selectedFile } = useContext(FileContext);
  const [copies, setCopies] = useState(1);
  const [pageRange, setPageRange] = useState('All');
  const [pageSize, setPageSize] = useState('A4');
  const [orientation, setOrientation] = useState('Portrait');
  const [colorMode, setColorMode] = useState('Monochrome');
  const [duplex, setDuplex] = useState('No');
  const [scale, setScale] = useState('NoScale');
  const [uploadStatus, setUploadStatus] = useState('');

  const uploadFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        try {
          const response = await axios.post('http://localhost:3001/upload', {
            file: reader.result,
            fileName: file.name,
            contentType: file.type,
          });
          resolve(response.data);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleConfirm = async () => {
    if (!selectedFile) {
      setUploadStatus('No file selected. Please go back and select a file.');
      return;
    }

    setUploadStatus('Uploading files...');

    const doc = new jsPDF();
    doc.text('PDF Settings', 10, 10);
    doc.text(`Copies: ${copies}`, 10, 20);
    doc.text(`Page Range: ${pageRange}`, 10, 30);
    doc.text(`Page Size: ${pageSize}`, 10, 40);
    doc.text(`Orientation: ${orientation}`, 10, 50);
    doc.text(`Color Mode: ${colorMode}`, 10, 60);
    doc.text(`Duplex: ${duplex}`, 10, 70);
    doc.text(`Scale: ${scale}`, 10, 80);

    const settingsPdfData = doc.output('blob');
    const settingsFile = new File([settingsPdfData], 'settings.pdf', { type: 'application/pdf' });

    try {
      const [originalFileUpload, settingsFileUpload] = await Promise.all([
        uploadFile(selectedFile),
        uploadFile(settingsFile),
      ]);

      let statusMessage = '';
      if (originalFileUpload.status === 'success') {
        statusMessage += `Original file uploaded successfully! File ID: ${originalFileUpload.fileId}\n`;
      } else {
        statusMessage += `Original file upload failed: ${originalFileUpload.message}\n`;
      }

      if (settingsFileUpload.status === 'success') {
        statusMessage += `Settings PDF uploaded successfully! File ID: ${settingsFileUpload.fileId}`;
      } else {
        statusMessage += `Settings PDF upload failed: ${settingsFileUpload.message}`;
      }

      setUploadStatus(statusMessage);
    } catch (error) {
      console.error('Error uploading files:', error);
      setUploadStatus('Upload failed. See console for details.');
    }
  };

  return (
    <div className="settings-page">
      <h2>PDF Settings</h2>
      {selectedFile && <p>Selected file: {selectedFile.name}</p>}
      <div className="setting-item">
        <label>Copies:</label>
        <button onClick={() => setCopies(c => Math.max(1, c - 1))}>-</button>
        <span>{copies}</span>
        <button onClick={() => setCopies(c => c + 1)}>+</button>
      </div>
      <div className="setting-item">
        <label>Page Range:</label>
        <input type="text" value={pageRange} onChange={e => setPageRange(e.target.value)} />
      </div>
      <div className="setting-item">
        <label>Page Size:</label>
        <select value={pageSize} onChange={e => setPageSize(e.target.value)}>
          <option value="A4">A4</option>
          <option value="A5">A5</option>
          <option value="A6">A6</option>
          <option value="Letter">Letter</option>
        </select>
      </div>
      <div className="setting-item">
        <label>Orientation:</label>
        <select value={orientation} onChange={e => setOrientation(e.target.value)}>
          <option value="Portrait">Portrait</option>
          <option value="Landscape">Landscape</option>
        </select>
      </div>
      <div className="setting-item">
        <label>Color Mode:</label>
        <select value={colorMode} onChange={e => setColorMode(e.target.value)}>
          <option value="Monochrome">Monochrome</option>
          <option value="Color">Color</option>
        </select>
      </div>
      <div className="setting-item">
        <label>Duplex:</label>
        <select value={duplex} onChange={e => setDuplex(e.target.value)}>
          <option value="No">No</option>
          <option value="Yes">Yes</option>
        </select>
      </div>
      <div className="setting-item">
        <label>Scale:</label>
        <select value={scale} onChange={e => setScale(e.target.value)}>
          <option value="NoScale">No Scale</option>
          <option value="Shrink">Shrink to Fit</option>
          <option value="Fit">Fit to Page</option>
        </select>
      </div>
      <button className="confirm-button" onClick={handleConfirm}>
        Confirm and Upload
      </button>
      {uploadStatus && <p className="upload-status">{uploadStatus}</p>}
    </div>
  );
};

export default SettingsPage;
