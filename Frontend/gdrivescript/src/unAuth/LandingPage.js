import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import PaperPopLogo from '../img/PaperPopLogo.png';
import Book from '../img/book.png';
import { FileContext } from '../contexts/FileContext';

const LandingPage = () => {
  const [uploadStatus, setUploadStatus] = useState('');
  const { setSelectedFile } = useContext(FileContext);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const allowedExtensions = /(\.doc|\.docx|\.pdf)$/i;
    if (!allowedExtensions.exec(file.name)) {
      setUploadStatus('Invalid file type. Please select a .doc, .docx, or .pdf file.');
      event.target.value = '';
      return;
    }

    setSelectedFile(file);
    navigate('/settings');
  };

  return (
    <div className="landing-page">
      {/* Logo */}
      <div className="logo">
        <img src={PaperPopLogo} alt="PaperPop Logo" />
      </div>

      {/* Upload Box */}
      <div className="upload-box">
        <img src={Book} alt="Books" />
        <p className="upload-text">Drop file here to start</p>
        <p className="support-text">Supports files (DOC, DOCX, PDF)</p>

        <input
          type="file"
          id="fileInput"
          style={{ display: 'none' }}
          onChange={handleFileChange}
          accept=".doc,.docx,.pdf"
        />
        <button
          className="choose-button"
          onClick={() => document.getElementById('fileInput').click()}
        >
          Choose file
        </button>

        <p className="private-text">🔒 Files stay private</p>
        {uploadStatus && <p className="upload-status">{uploadStatus}</p>}
      </div>

      {/* Footer */}
      <div className="footer">
        <a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a>
        <br />
        © 2025 PaperPOP. All rights reserved
      </div>
    </div>
  );
};

export default LandingPage;
