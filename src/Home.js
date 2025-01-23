import React from "react";
import { Link } from "react-router-dom";
import "./App.css"; // We'll use App.css for styling

function Home() {
    return (
        <div className="Home">
            <h1 className="home-title">Medical Analysis Home</h1>
            <div className="options-container">
                <h2 className="options-heading">Select an Option:</h2>
                <ul className="options-list">
                    <li>
                        <Link to="/Xray" className="options-link">
                            X-ray 1 Analysis
                        </Link>
                    </li>
                    <li>
                        <Link to="/Xray2" className="options-link">
                            X-ray 2 Analysis
                        </Link>
                    </li>
                    <li>
                        <Link to="/Clinicalcdoing" className="options-link">
                            Top 50 ICD-9 Codes
                        </Link>
                    </li>
                    <li>
                        <Link to="/Clinicalcoding1000" className="options-link">
                            Top 1000 ICD-9 Codes
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default Home;
