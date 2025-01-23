import React, { useState } from 'react';
import axios from 'axios';
// 1) Import ReactMarkdown
import ReactMarkdown from 'react-markdown';
import "./App.css";

function MedicalAnalyzer() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState('');
  const [localIcd9Predictions, setLocalIcd9Predictions] = useState([]);
  const [geminiIcd9Codes, setGeminiIcd9Codes] = useState([]);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setUploadedFile(e.target.files[0]);
    // Reset
    setReport('');
    setLocalIcd9Predictions([]);
    setGeminiIcd9Codes([]);
    setError('');
  };

  const handleAnalyze = async () => {
    if (!uploadedFile) {
      setError('Please upload a medical image.');
      return;
    }

    const formData = new FormData();
    formData.append('file', uploadedFile);

    setLoading(true);
    setError('');
    setReport('');
    setLocalIcd9Predictions([]);
    setGeminiIcd9Codes([]);

    try {
      // 1. Send image to /upload_image
      const uploadResponse = await axios.post(
          'http://127.0.0.1:5000/upload_image',
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          }
      );

      const uploadData = uploadResponse.data;
      if (uploadData.report) {
        setReport(uploadData.report);
      } else {
        setReport('No report generated.');
      }

      // 2. ICD-9 from local model
      if (uploadData.icd9_predictions && Array.isArray(uploadData.icd9_predictions)) {
        const flattenedLocalIcd9 = uploadData.icd9_predictions.flat();
        setLocalIcd9Predictions(flattenedLocalIcd9);
      }

      // 3. ICD-9 from Gemini approach
      if (uploadData.report) {
        const geminiResponse = await axios.post(
            'http://127.0.0.1:5000/predict_icd9_new',
            { clinical_note: uploadData.report }
        );

        if (
            geminiResponse.data &&
            typeof geminiResponse.data.predictions === 'string'
        ) {
          const parsedGeminiCodes = geminiResponse.data.predictions
              .split(',')
              .map(code => code.trim())
              .filter(code => code.length > 0);
          setGeminiIcd9Codes(parsedGeminiCodes);
        }
      }
    } catch (err) {
      console.error('Error during analysis:', err);
      setError(
          err.response?.data?.error ||
          'An error occurred during analysis or ICD-9 prediction. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="app-container">
        <h1 className="main-title">X-ray Image Report & ICD-9 Code Generator</h1>

        <div className="form-group">
          <label>Upload X-ray</label>
          <input
              className="file-input"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
          />
        </div>

        <button
            className="predict-button"
            onClick={handleAnalyze}
            disabled={loading || !uploadedFile}
        >
          {loading ? 'Processing...' : 'Generate Report & Predict ICD-9 Codes'}
        </button>

        {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
        )}

        {/* ---------- Render the report as Markdown ---------- */}
        {report && (
            <div className="extracted-text">
              <h2 className="sub-title">Generated Report</h2>
              <ReactMarkdown className="markdown-text">
                {report}
              </ReactMarkdown>
            </div>
        )}

        {/* ---------- ICD-9 from local model ---------- */}
        {localIcd9Predictions.length > 0 && (
            <div className="predictions-section">
              <h3 className="sub-title">Predicted ICD-9 Codes (Local Model)</h3>
              <ul className="predictions-list">
                {localIcd9Predictions.map(([code, description], index) => (
                    <li key={index}>
                      <strong>{code}</strong>: {description}
                    </li>
                ))}
              </ul>
            </div>
        )}

        {/* ---------- Additional ICD-9 Codes ---------- */}
        {geminiIcd9Codes.length > 0 && (
            <div className="predictions-section">
              <h3 className="sub-title">Predicted ICD-9 Codes</h3>
              <ul className="predictions-list">
                {geminiIcd9Codes.map((code, index) => (
                    <li key={index}>{code}</li>
                ))}
              </ul>
            </div>
        )}

        {/* If no codes found at all */}
        {report &&
            localIcd9Predictions.length === 0 &&
            geminiIcd9Codes.length === 0 && (
                <div className="predictions-section">
                  <p>No ICD-9 codes were predicted from the analysis.</p>
                </div>
            )}
      </div>
  );
}

export default MedicalAnalyzer;
