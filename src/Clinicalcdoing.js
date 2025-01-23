import React, { useState } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";
// 1) Import ReactMarkdown
import ReactMarkdown from "react-markdown";
import "./App.css";

function App() {
    // ----------------------- Text Input State -----------------------
    const [medicalSummary, setMedicalSummary] = useState("");
    const [textThreshold, setTextThreshold] = useState(0.5);
    const [textPredictions, setTextPredictions] = useState([]);

    // ----------------------- PDF Upload State -----------------------
    const [pdfFile, setPdfFile] = useState(null);
    const [pdfThreshold, setPdfThreshold] = useState(0.5);
    const [pdfPredictionsV1, setPdfPredictionsV1] = useState([]);
    const [pdfPredictionsV2, setPdfPredictionsV2] = useState([]);
    const [extractedText, setExtractedText] = useState("");
    const [isUploading, setIsUploading] = useState(false);

    // ----------------------- Text Prediction -----------------------
    const handleTextPrediction = async () => {
        if (!medicalSummary.trim()) {
            alert("Please enter a medical summary.");
            return;
        }

        try {
            const response = await axios.post("http://127.0.0.1:5000/predict", {
                texts: [medicalSummary],
                threshold: parseFloat(textThreshold),
            });
            setTextPredictions(response.data.predictions[0] || []);
        } catch (error) {
            console.error("Error fetching text predictions:", error);
            alert("An error occurred while fetching predictions.");
        }
    };

    // ----------------------- PDF Upload -----------------------
    const handlePdfUpload = async () => {
        if (!pdfFile) {
            alert("Please select a PDF file to upload.");
            return;
        }

        const formData = new FormData();
        formData.append("file", pdfFile);

        setIsUploading(true);
        setExtractedText("");
        setPdfPredictionsV1([]);
        setPdfPredictionsV2([]);

        try {
            const response = await axios.post(
                "http://127.0.0.1:5000/upload_pdf",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            const data = response.data;
            setExtractedText(data.extracted_text || "");
            setPdfPredictionsV1(data.predictions_v1 || []);
            setPdfPredictionsV2(data.predictions_v2 || []);
        } catch (error) {
            console.error("Error uploading PDF:", error);
            alert("An error occurred while uploading the PDF.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="app-container">
            <Helmet>
                <title>Medical Coding - ICD-9 Predictor</title>
                <link
                    rel="icon"
                    type="image/png"
                    href="%PUBLIC_URL%/medical_favicon.png"
                />
            </Helmet>

            <h1 className="main-title">ICD-9 Code Prediction</h1>

            {/* -- Text Input Section -- */}
            <div className="section">
                <h2>Predict ICD-9 Codes from Text</h2>

                <div className="form-group">
                    <label htmlFor="medical-summary">Enter Medical Summary</label>
                    <textarea
                        id="medical-summary"
                        className="textarea"
                        placeholder="Enter clinical notes here..."
                        value={medicalSummary}
                        onChange={(e) => setMedicalSummary(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>Prediction Threshold: {textThreshold}</label>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={textThreshold}
                        onChange={(e) => setTextThreshold(e.target.value)}
                        className="slider"
                    />
                </div>

                <button className="predict-button" onClick={handleTextPrediction}>
                    Predict ICD-9 Codes
                </button>

                <h3 className="sub-title">Predicted ICD-9 Codes</h3>
                {textPredictions.length > 0 ? (
                    <ul className="predictions-list">
                        {textPredictions.map((code, index) => (
                            <li key={index}>{code}</li>
                        ))}
                    </ul>
                ) : (
                    <p>No predictions yet.</p>
                )}
            </div>

            <hr className="divider" />

            {/* -- PDF Upload Section -- */}
            <div className="section">
                <h2>Predict ICD-9 Codes from PDF</h2>

                <div className="form-group">
                    <label htmlFor="pdf-upload">Upload Clinical Notes PDF</label>
                    <input
                        type="file"
                        id="pdf-upload"
                        accept=".pdf"
                        onChange={(e) => setPdfFile(e.target.files[0])}
                        className="file-input"
                    />
                </div>

                <div className="form-group">
                    <label>Prediction Threshold: {pdfThreshold}</label>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={pdfThreshold}
                        onChange={(e) => setPdfThreshold(e.target.value)}
                        className="slider"
                    />
                </div>

                <button
                    className="predict-button"
                    onClick={handlePdfUpload}
                    disabled={isUploading}
                >
                    {isUploading ? "Uploading..." : "Predict ICD-9 Codes from PDF"}
                </button>

                {extractedText && (
                    <div className="extracted-text">
                        <h3 className="sub-title">Extracted Text from PDF</h3>
                        {/* 2) Render extracted PDF text as Markdown */}
                        <ReactMarkdown className="markdown-text">
                            {extractedText}
                        </ReactMarkdown>
                    </div>
                )}

                {pdfPredictionsV1.length > 0 && (
                    <div className="predictions-section">
                        <h3 className="sub-title">Predictions from Model V1</h3>
                        <ul className="predictions-list">
                            {pdfPredictionsV1.map((code, index) => (
                                <li key={index}>{code}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {pdfPredictionsV2.length > 0 && (
                    <div className="predictions-section">
                        <h3 className="sub-title">Predictions from Model V2</h3>
                        <ul className="predictions-list">
                            {pdfPredictionsV2.map((code, index) => (
                                <li key={index}>{code}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
