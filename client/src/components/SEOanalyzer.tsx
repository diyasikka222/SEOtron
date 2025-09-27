import { useState } from "react";
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

  const getKeywordsArray = () => {
    if (!result) return [];
    if (Array.isArray(result.keywords)) return result.keywords;
    if (typeof result.keywords === "string") return result.keywords.split(",").map(k => k.trim());
    return [];
  };

  const getAllLinks = () => {
    if (!result?.links) return [];
    const internal = Array.isArray(result.links.internal) ? result.links.internal : [];
    const external = Array.isArray(result.links.external) ? result.links.external : [];
    const broken = Array.isArray(result.links.broken) ? result.links.broken : [];
    return [...internal, ...external, ...broken];
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
        <div style={{ marginTop: "20px", padding: "15px", borderRadius: "5px", backgroundColor: "#f9f9f9", color: "#000" }}>
          <h3>Results:</h3>
          <p><strong>Title:</strong> {result.title || "N/A"}</p>
          <p><strong>Meta Description:</strong> {result.metaTags?.description || "N/A"}</p>
          <p><strong>Keywords:</strong> {getKeywordsArray().join(", ") || "N/A"}</p>
          <p><strong>Score:</strong> {result.score ?? "N/A"}</p>

          <p><strong>Links:</strong></p>
          <ul>
            {getAllLinks().map((link: string, index: number) => (
              <li key={index}>{link}</li>
            ))}
          </ul>

          <h4>Google Scores:</h4>
          <ul>
            <li>SEO Score: {result.google_scores?.seo_score ?? "N/A"}</li>
            <li>Performance: {result.google_scores?.performance_score ?? "N/A"}</li>
            <li>Best Practices: {result.google_scores?.best_practices ?? "N/A"}</li>
            <li>Accessibility: {result.google_scores?.accessibility ?? "N/A"}</li>
          </ul>
        </div>
      )}
    </div>
  );
};
