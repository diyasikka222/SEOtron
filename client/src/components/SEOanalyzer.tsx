import React, { useState } from "react";
import { analyzeURL } from "../api";
import { BounceLoader } from "react-spinners"; // npm i react-spinners

export const SEOAnalyzer = () => {
  const [url, setURL] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!url) {
      alert("Please enter a URL");
      return;
    }

    setResult(null); // reset previous results
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
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto", fontFamily: "'Segoe UI', sans-serif" }}>
      {/* URL Input */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
        <input
          type="text"
          value={url}
          onChange={(e) => setURL(e.target.value)}
          placeholder="Enter website URL"
          style={{
            flex: 1,
            marginRight: "10px",
            padding: "10px 15px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "16px",
            outline: "none",
            color: "black"
          }}
        />
        <button
          onClick={handleAnalyze}
          disabled={loading}
          style={{
            padding: "10px 20px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#3182ce",
            color: "#fff",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </div>

      {/* Loading Animation */}
      {loading && (
        <div style={{ display: "flex", justifyContent: "center", marginTop: "30px" }}>
          <BounceLoader color="#3182ce" size={60} />
        </div>
      )}

      {/* Results */}
      {result && !loading && (
        <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "15px" }}>
          {/* ChatGPT-style bubble */}
          <div style={{
            backgroundColor: "#f1f3f6",
            padding: "20px",
            borderRadius: "15px",
            boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
            animation: "fadeIn 0.5s ease-in-out",
          }}>
            <p><strong>Title:</strong> {result.title}</p>
            <p><strong>Meta Description:</strong> {result.metaTags?.description || "N/A"}</p>
            <p><strong>Keywords:</strong> {result.keywords?.join(", ") || "N/A"}</p>
            <p><strong>Score:</strong> {result.score || "N/A"}</p>
          </div>

          {/* Links in separate bubble */}
          <div style={{
            backgroundColor: "#e8f0fe",
            padding: "20px",
            borderRadius: "15px",
            boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
            animation: "fadeIn 0.5s ease-in-out",
          }}>
            <h4>Internal Links:</h4>
            <ul>
              {result.links?.internal?.map((link: string, idx: number) => (
                <li key={idx}><a href={link} target="_blank">{link}</a></li>
              ))}
            </ul>

            <h4>External Links:</h4>
            <ul>
              {result.links?.external?.map((link: string, idx: number) => (
                <li key={idx}><a href={link} target="_blank">{link}</a></li>
              ))}
            </ul>

            <h4>Broken Links:</h4>
            <ul>
              {result.links?.broken?.map((link: string, idx: number) => (
                <li key={idx} style={{ color: "red" }}>{link}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Simple fade-in animation */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
};

