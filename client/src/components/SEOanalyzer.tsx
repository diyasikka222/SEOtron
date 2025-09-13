import React, { useState } from "react";
import { analyzeURL } from "../api"; // make sure this exists in api.ts

export const SEOAnalyzer = () => {
  const [url, setURL] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Check if user is logged in
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  const handleAnalyze = async () => {
    if (!url) {
      alert("Please enter a URL");
      return;
    }

    setLoading(true);
    try {
      const data = await analyzeURL(url);
      setResult(data);
    } catch (err) {
      console.error(err);
      alert("Error analyzing URL");
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login"; // redirect to login page
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>

      <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
        <input
          type="text"
          value={url}
          onChange={(e) => setURL(e.target.value)}
          placeholder="Enter website URL"
          style={{
            flex: 1,
            marginRight: "10px",
            padding: "8px",
            color: "#000",
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "16px",
          }}
        />
        <button
          onClick={handleAnalyze}
          disabled={loading}
          style={{
            padding: "8px 16px",
            backgroundColor: "#3182ce",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </div>

      {result && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            borderRadius: "5px",
            backgroundColor: "#f9f9f9",
            color: "#000",
          }}
        >
          <h3>Results:</h3>
          <p><strong>Title:</strong> {result.title}</p>
          <p><strong>Meta Description:</strong> {result.metaTags.description || "N/A"}</p>
          <p><strong>Keywords:</strong> {result.keywords.join(", ")}</p>
          <p><strong>Score:</strong> {result.score}</p>
          <p><strong>Links:</strong></p>
          <ul>
            {result.links.map((link: string, index: number) => (
              <li key={index}>{link}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
