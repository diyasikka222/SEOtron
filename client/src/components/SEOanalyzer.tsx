import React, { useState } from "react";
import { analyzeURL } from "../api";
import { useNavigate } from "react-router-dom";

export const SEOAnalyzer = () => {
    const [url, setURL] = useState("");
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [displayedText, setDisplayedText] = useState<string>("");
    const [isTyping, setIsTyping] = useState(false);
    const navigate = useNavigate();

    const handleAnalyze = async () => {
        if (!url) {
            alert("Please enter a URL");
            return;
        }

        setResult(null);
        setDisplayedText("");
        setIsTyping(false);
        setLoading(true);

        try {
            const data = await analyzeURL(url);
            setResult(data);
            setLoading(false);

            const fullText = `
Title: ${data.title || "N/A"}
Meta Description: ${data.metaTags?.description || "N/A"}
Keywords: ${data.keywords?.join(", ") || "N/A"}
Score: ${data.score || "N/A"}
`;
            setIsTyping(true);
            let i = 0;
            const interval = setInterval(() => {
                setDisplayedText(fullText.slice(0, i));
                i++;
                if (i > fullText.length) {
                    clearInterval(interval);
                    setIsTyping(false);
                }
            }, 25);
        } catch (err) {
            console.error(err);
            alert("Error analyzing URL");
            setLoading(false);
        }
    };

    const generateAIRecommendations = () => {
        if (!result) return [];
        const keywords = result.keywords || ["SEO", "Marketing", "Web", "Optimization"];
        const internalLinks = result.links?.internal || [];
        return [
            {
                title: "Add Important Keywords",
                detail: `Include relevant keywords like "${keywords[0]}" and "${keywords[1]}" in headings and meta tags.`,
            },
            {
                title: "Improve Meta Description",
                detail: `Your meta description is short or missing keywords. Rewrite it to summarize content in 150-160 characters.`,
            },
            {
                title: "Fix Broken Links",
                detail: `Detected broken links: ${result.links?.broken?.slice(0, 3).join(", ") || "None"}. Update or remove them.`,
            },
            {
                title: "Add Alt Text",
                detail: `Images on your site are missing alt text. Adding descriptive alt text helps accessibility and SEO.`,
            },
            {
                title: "Content Expansion",
                detail: `Consider expanding content for key pages like ${internalLinks[0] || "/home"} with detailed explanations and examples.`,
            },
            {
                title: "Add Internal Links",
                detail: `Link related content together. For example, link ${internalLinks[0] || "/home"} with ${internalLinks[1] || "/about"} for better crawling.`,
            },
            {
                title: "External Linking",
                detail: `Add authoritative external links to credible sites to improve trust and search engine understanding.`,
            },
            {
                title: "Page Speed Optimization",
                detail: `Optimize images, minify CSS/JS, and enable caching to reduce load times.`,
            },
        ];
    };

    const aiRecommendations = generateAIRecommendations();

    // Gradient sub-cards
    const gradientColors = [
        "linear-gradient(135deg, #5f4b8b, #8572a7)",
        "linear-gradient(135deg, #6a737d, #9aa0a6)",
        "linear-gradient(135deg, #3b6978, #204051)",
        "linear-gradient(135deg, #6b4226, #a6744f)",
        "linear-gradient(135deg, #5c4d7d, #8b7d9a)",
        "linear-gradient(135deg, #4b604d, #6b7a6b)",
        "linear-gradient(135deg, #7d5a50, #a6786f)",
        "linear-gradient(135deg, #5b4f72, #837395)",
    ];

    return (
        <div
            style={{
                padding: "20px",
                margin: "0 auto",
                fontFamily: "'Segoe UI', sans-serif",
                color: "var(--text-color)",
                backgroundColor: "var(--bg-color)",
                minHeight: "100vh",
            }}
        >
            {/* URL Input */}
            <div style={{ display: "flex", alignItems: "center", marginBottom: "20px", gap: "10px" }}>
                <input
                    type="text"
                    value={url}
                    onChange={(e) => setURL(e.target.value)}
                    placeholder="Enter website URL"
                    style={{
                        flex: 1,
                        padding: "10px 15px",
                        borderRadius: "8px",
                        border: "1px solid var(--border-color)",
                        fontSize: "16px",
                        outline: "none",
                        backgroundColor: "var(--input-bg)",
                        color: "var(--text-color)",
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
                <button
                    onClick={() => navigate("/dashboard")}
                    style={{
                        padding: "10px 20px",
                        borderRadius: "8px",
                        border: "none",
                        backgroundColor: "#10b981",
                        color: "#fff",
                        cursor: "pointer",
                        fontWeight: "bold",
                    }}
                >
                    Go to Dashboard
                </button>
            </div>

            {/* Typewriter result */}
            {displayedText && !loading && (
                <div
                    style={{
                        marginTop: "20px",
                        backgroundColor: "var(--bubble-bg)",
                        padding: "20px",
                        borderRadius: "15px",
                        boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
                        whiteSpace: "pre-wrap",
                        fontFamily: "monospace",
                        lineHeight: "1.5",
                        borderLeft: "3px solid #3182ce",
                    }}
                >
                    {displayedText}
                    {isTyping && <span className="cursor">▋</span>}
                </div>
            )}

            {/* Links + AI recommendations split */}
            {result && !isTyping && !loading && (
                <div style={{ display: "flex", gap: "20px", marginTop: "30px", flexWrap: "wrap" }}>
                    {/* Left half: Links */}
                    <div style={{ flex: "1 1 45%", minWidth: "300px", display: "flex", flexDirection: "column", gap: "15px" }}>
                        <div style={{ borderRadius: "15px", padding: "20px", backgroundColor: "var(--bubble-bg-alt)", boxShadow: "0 4px 10px rgba(0,0,0,0.15)" }}>
                            <h4>Internal Links</h4>
                            <ul>
                                {result.links?.internal?.map((link: string, idx: number) => (
                                    <li key={idx}><a href={link} target="_blank" rel="noreferrer">{link}</a></li>
                                ))}
                            </ul>
                        </div>
                        <div style={{ borderRadius: "15px", padding: "20px", backgroundColor: "var(--bubble-bg-alt)", boxShadow: "0 4px 10px rgba(0,0,0,0.15)" }}>
                            <h4>External Links</h4>
                            <ul>
                                {result.links?.external?.map((link: string, idx: number) => (
                                    <li key={idx}><a href={link} target="_blank" rel="noreferrer">{link}</a></li>
                                ))}
                            </ul>
                        </div>
                        <div style={{ borderRadius: "15px", padding: "20px", backgroundColor: "var(--bubble-bg-alt)", boxShadow: "0 4px 10px rgba(0,0,0,0.15)" }}>
                            <h4>Broken Links</h4>
                            <ul>
                                {result.links?.broken?.map((link: string, idx: number) => (
                                    <li key={idx} style={{ color: "red" }}>{link}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Right half: AI Recommendations */}
                    <div
                        style={{
                            flex: "1 1 50%",
                            minWidth: "350px",
                            borderRadius: "20px",
                            padding: "20px",
                            background: "linear-gradient(-45deg, #2c2f36, #3a3d44, #2f3239, #404348)",
                            backgroundSize: "400% 400%",
                            animation: "gradientBG 15s ease infinite",
                            color: "#fff",
                            boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
                            display: "flex",
                            flexDirection: "column",
                            gap: "15px",
                        }}
                    >
                        <h3 style={{ marginBottom: "15px", textAlign: "center" }}>SEO AI Recommendations</h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                            {aiRecommendations.map((rec, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        borderRadius: "12px",
                                        background: gradientColors[idx % gradientColors.length],
                                        padding: "12px 15px",
                                        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                                        animation: `fadeInUp 0.6s ease forwards`,
                                        opacity: 0,
                                        transform: "translateY(15px)",
                                        animationDelay: `${idx * 0.15}s`,
                                        color: "#fff",
                                    }}
                                >
                                    <h4 style={{ marginBottom: "6px" }}>{rec.title}</h4>
                                    <p style={{ fontSize: "14px", lineHeight: 1.4 }}>{rec.detail}</p>
                                    <div style={{ textAlign: "right", fontSize: "12px", opacity: 0.8 }}>AI Insight</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <style>
                {`
          :root {
            --bg-color: #0e1013;
            --text-color: #e4e4e4;
            --bubble-bg: #1c1f25;
            --bubble-bg-alt: #20252d;
            --input-bg: #181a1f;
            --border-color: #333;
          }

          .cursor {
            display: inline-block;
            animation: blink 1s step-start infinite;
          }
          @keyframes blink {
            50% { opacity: 0; }
          }

          @keyframes fadeInUp {
            0% { opacity: 0; transform: translateY(15px); }
            100% { opacity: 1; transform: translateY(0); }
          }

          @keyframes gradientBG {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
            </style>
        </div>
    );
};
