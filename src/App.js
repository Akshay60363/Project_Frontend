// import React, { useState } from "react";
// import axios from "axios";
// import "./App.css";

// function App() {
//     const [inputText, setInputText] = useState("");
//     const [predictions, setPredictions] = useState([]);
//     const [threshold, setThreshold] = useState(0.5);

//     const handlePredict = async () => {
//         if (!inputText.trim()) {
//             alert("Please enter a medical summary.");
//             return;
//         }

//         try {
//             // Send POST request to Flask backend
//             const response = await axios.post("http://127.0.0.1:5000/predict", {
//                 texts: [inputText],
//                 threshold: threshold,
//             });
//             setPredictions(response.data.predictions[0]); // Extract predictions from response
//         } catch (error) {
//             console.error("Error fetching predictions:", error);
//             alert("An error occurred while fetching predictions.");
//         }
//     };

//     return (
//         <div className="App">
//             <header className="App-header">
//                 <h1>ICD-9 Code Prediction</h1>
//                 <textarea
//                     placeholder="Enter clinical notes here..."
//                     value={inputText}
//                     onChange={(e) => setInputText(e.target.value)}
//                 />
//                 <div>
//                     <label>Prediction Threshold: </label>
//                     <input
//                         type="number"
//                         step="0.01"
//                         min="0"
//                         max="1"
//                         value={threshold}
//                         onChange={(e) => setThreshold(parseFloat(e.target.value))}
//                     />
//                 </div>
//                 <button onClick={handlePredict}>Predict</button>
//                 <h2>Predicted ICD-9 Codes</h2>
//                 {predictions.length > 0 ? (
//                     <ul>
//                         {predictions.map((code, index) => (
//                             <li key={index}>{code}</li>
//                         ))}
//                     </ul>
//                 ) : (
//                     <p>No predictions yet.</p>
//                 )}
//             </header>
//         </div>
//     );
// }

// export default App;

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./Home";
import Xray1Page from "./Xray";
import Xray2Page from "./Xray2";
import ClinicalCoding50 from "./Clinicalcdoing";
import ClinicalCoding1000 from "./Clinicalcoding1000";

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/xray" element={<Xray1Page />} />
                    <Route path="/xray2" element={<Xray2Page />} />
                    <Route path="/Clinicalcdoing" element={<ClinicalCoding50 />} />
                    <Route path="/Clinicalcoding1000" element={<ClinicalCoding1000 />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
