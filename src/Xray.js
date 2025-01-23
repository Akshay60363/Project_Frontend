import React, { useState } from "react";
import axios from "axios";
// 1) Import ReactMarkdown
import ReactMarkdown from "react-markdown";
import "./App.css";

const MedicalAnalyzer = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const [analysisResult, setAnalysisResult] = useState({
    analysis: "",
    icd9PredictionsAnalyze: [],
    geminiCodes: []
  });

  const handleFileChange = (e) => {
    setUploadedFile(e.target.files[0]);
  };

  const handleAnalyze = async () => {
    if (!uploadedFile) {
      alert("Please upload a medical image.");
      return;
    }

    const formData = new FormData();
    formData.append("file", uploadedFile);

    setLoading(true);

    try {
      // 1) Call /analyze
      const analyzeResponse = await axios.post(
          "http://127.0.0.1:5000/analyze",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
      );

      const { analysis, icd9_predictions } = analyzeResponse.data;

      setAnalysisResult({
        analysis: analysis || "",
        icd9PredictionsAnalyze: icd9_predictions || [],
        geminiCodes: []
      });

      // 2) Call /predict_icd9_new
      const geminiResponse = await axios.post(
          "http://127.0.0.1:5000/predict_icd9_new",
          { clinical_note: analysis }
      );

      let geminiCodesArray = [];
      if (
          geminiResponse.data &&
          typeof geminiResponse.data.predictions === "string"
      ) {
        geminiCodesArray = geminiResponse.data.predictions
            .split(",")
            .map((str) => str.trim())
            .filter(Boolean);
      }

      setAnalysisResult((prevState) => ({
        ...prevState,
        geminiCodes: geminiCodesArray
      }));
    } catch (error) {
      console.error("Error during analysis or ICD-9 prediction:", error);
      alert("An error occurred during analysis or ICD-9 prediction.");
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="app-container">
        <h1 className="main-title">Medical Image Analyzer</h1>

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
            disabled={loading}
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>

        {/* ------- Display the analysis text using ReactMarkdown ------- */}
        {analysisResult.analysis && (
            <div className="extracted-text">
              <h2 className="sub-title">Analysis</h2>
              {/*
            Renders the markdown in 'analysisResult.analysis'
            e.g., ###, **bold**, etc.
          */}
              <ReactMarkdown className="markdown-text">
                {analysisResult.analysis}
              </ReactMarkdown>
            </div>
        )}

        {/* ---------- ICD-9 Predictions (Longformer) ---------- */}
        {analysisResult.icd9PredictionsAnalyze?.length > 0 && (
            <div className="predictions-section">
              <h2 className="sub-title">ICD-9 Predictions (Longformer)</h2>
              {analysisResult.icd9PredictionsAnalyze.map((predictionList, idx) => (
                  <ul key={idx} className="predictions-list">
                    {predictionList.map(([code, desc], i) => (
                        <li key={i}>
                          <strong>{code}</strong> - {desc}
                        </li>
                    ))}
                  </ul>
              ))}
            </div>
        )}

        {/* ---------- Additional ICD-9 Predictions ---------- */}
        {analysisResult.geminiCodes && analysisResult.geminiCodes.length > 0 && (
            <div className="predictions-section">
              <h2 className="sub-title">ICD-9 Predictions</h2>
              <ul className="predictions-list">
                {analysisResult.geminiCodes.map((code, index) => (
                    <li key={index}>{code}</li>
                ))}
              </ul>
            </div>
        )}
      </div>
  );
};

export default MedicalAnalyzer;
