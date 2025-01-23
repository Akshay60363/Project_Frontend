import React, { useState } from "react";
import axios from "axios";
// 1) Optionally import ReactMarkdown if your codes might be more detailed
import ReactMarkdown from "react-markdown";
import "./App.css";

function App() {
    const [medicalSummary, setMedicalSummary] = useState("");
    const [threshold, setThreshold] = useState(0.5);
    const [predictions, setPredictions] = useState([]);

    const handlePrediction = async () => {
        if (!medicalSummary.trim()) {
            alert("Please enter a medical summary.");
            return;
        }

        try {
            const response = await axios.post("http://127.0.0.1:5000/icd9_predict", {
                clinical_text: medicalSummary,
                threshold: parseFloat(threshold),
            });

            setPredictions(response.data.predicted_codes || []);
        } catch (error) {
            console.error("Error fetching predictions:", error);
            alert("An error occurred while fetching predictions.");
        }
    };

    return (
        <div className="app-container">
            <h1 className="main-title">ICD-9 Code Prediction</h1>

            <div className="form-group">
                <label>Enter Medical Summary</label>
                <textarea
                    className="textarea"
                    placeholder="Enter clinical notes here..."
                    value={medicalSummary}
                    onChange={(e) => setMedicalSummary(e.target.value)}
                />
            </div>

            <div className="form-group">
                <label>Prediction Threshold: {threshold}</label>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={threshold}
                    onChange={(e) => setThreshold(e.target.value)}
                    className="slider"
                />
            </div>

            <button className="predict-button" onClick={handlePrediction}>
                Predict ICD-9 Codes
            </button>

            <h2 className="sub-title">Predicted ICD-9 Codes</h2>
            {predictions.length > 0 ? (
                <ul className="predictions-list">
                    {predictions.map((code, index) => (
                        // If these are just short codes, a <li> is fine.
                        // If you might have markdown text, you could do:
                        // <ReactMarkdown>{code}</ReactMarkdown>
                        <li key={index}>{code}</li>
                    ))}
                </ul>
            ) : (
                <p>No predictions yet.</p>
            )}
        </div>
    );
}

export default App;
