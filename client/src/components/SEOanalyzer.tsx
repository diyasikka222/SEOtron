import React, { useState } from "react";
import { analyzeURL } from "../api"; // make sure this exists in api.ts

export const SEOAnalyzer = () => {
  const [url, setURL] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

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

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2>SEO Analyzer</h2>

      <input
        type="text"
        value={url}
        onChange={(e) => setURL(e.target.value)}
        placeholder="Enter website URL"
        style={{
            width: "70%",
            marginRight: "10px",
            padding: "8px",
            color: "#000",             // black text
            backgroundColor: "#fff",   // white background
            border: "1px solid #ccc",  // border for visibility
            borderRadius: "4px",
            fontSize: "16px"
        }}
        />  

      <button onClick={handleAnalyze} disabled={loading}>
        {loading ? "Analyzing..." : "Analyze"}
      </button>

      {result && (
        <div style={{
            marginTop: "20px",
            padding: "15px",
            borderRadius: "5px",
            backgroundColor: "#f9f9f9",
            color: "#000"   // ensures text is visible
        }}>
          <h3>Results:</h3>
          <p><strong>Title:</strong> {result.title}</p>
          <p><strong>Meta Description:</strong> {result.metaTags.description}</p>
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
