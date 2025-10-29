// // import React, { useState } from "react";
// // import { analyzeURL } from "../api";
// // import { useNavigate } from "react-router-dom";
// //
// // export const SEOAnalyzer = () => {
// //     const [url, setURL] = useState("");
// //     const [result, setResult] = useState<any>(null);
// //     const [loading, setLoading] = useState(false);
// //     const [displayedText, setDisplayedText] = useState<string>("");
// //     const [isTyping, setIsTyping] = useState(false);
// //     const navigate = useNavigate();
// //
// //     const handleAnalyze = async () => {
// //         if (!url) {
// //             alert("Please enter a URL");
// //             return;
// //         }
// //
// //         setResult(null);
// //         setDisplayedText("");
// //         setIsTyping(false);
// //         setLoading(true);
// //
// //         try {
// //             const data = await analyzeURL(url);
// //             setResult(data);
// //             setLoading(false);
// //
// //             const fullText = `
// // Title: ${data.title || "N/A"}
// // Meta Description: ${data.metaTags?.description || "N/A"}
// // Keywords: ${data.keywords?.join(", ") || "N/A"}
// // Score: ${data.score || "N/A"}
// // `;
// //             setIsTyping(true);
// //             let i = 0;
// //             const interval = setInterval(() => {
// //                 setDisplayedText(fullText.slice(0, i));
// //                 i++;
// //                 if (i > fullText.length) {
// //                     clearInterval(interval);
// //                     setIsTyping(false);
// //                 }
// //             }, 25);
// //         } catch (err) {
// //             console.error(err);
// //             alert("Error analyzing URL");
// //             setLoading(false);
// //         }
// //     };
// //
// //     const generateAIRecommendations = () => {
// //         if (!result) return [];
// //         const keywords = result.keywords || ["SEO", "Marketing", "Web", "Optimization"];
// //         const internalLinks = result.links?.internal || [];
// //         return [
// //             {
// //                 title: "Add Important Keywords",
// //                 detail: `Include relevant keywords like "${keywords[0]}" and "${keywords[1]}" in headings and meta tags.`,
// //             },
// //             {
// //                 title: "Improve Meta Description",
// //                 detail: `Your meta description is short or missing keywords. Rewrite it to summarize content in 150-160 characters.`,
// //             },
// //             {
// //                 title: "Fix Broken Links",
// //                 detail: `Detected broken links: ${result.links?.broken?.slice(0, 3).join(", ") || "None"}. Update or remove them.`,
// //             },
// //             {
// //                 title: "Add Alt Text",
// //                 detail: `Images on your site are missing alt text. Adding descriptive alt text helps accessibility and SEO.`,
// //             },
// //             {
// //                 title: "Content Expansion",
// //                 detail: `Consider expanding content for key pages like ${internalLinks[0] || "/home"} with detailed explanations and examples.`,
// //             },
// //             {
// //                 title: "Add Internal Links",
// //                 detail: `Link related content together. For example, link ${internalLinks[0] || "/home"} with ${internalLinks[1] || "/about"} for better crawling.`,
// //             },
// //             {
// //                 title: "External Linking",
// //                 detail: `Add authoritative external links to credible sites to improve trust and search engine understanding.`,
// //             },
// //             {
// //                 title: "Page Speed Optimization",
// //                 detail: `Optimize images, minify CSS/JS, and enable caching to reduce load times.`,
// //             },
// //         ];
// //     };
// //
// //     const aiRecommendations = generateAIRecommendations();
// //
// //     // Gradient sub-cards
// //     const gradientColors = [
// //         "linear-gradient(135deg, #5f4b8b, #8572a7)",
// //         "linear-gradient(135deg, #6a737d, #9aa0a6)",
// //         "linear-gradient(135deg, #3b6978, #204051)",
// //         "linear-gradient(135deg, #6b4226, #a6744f)",
// //         "linear-gradient(135deg, #5c4d7d, #8b7d9a)",
// //         "linear-gradient(135deg, #4b604d, #6b7a6b)",
// //         "linear-gradient(135deg, #7d5a50, #a6786f)",
// //         "linear-gradient(135deg, #5b4f72, #837395)",
// //     ];
// //
// //     return (
// //         <div
// //             style={{
// //                 padding: "20px",
// //                 margin: "0 auto",
// //                 fontFamily: "'Segoe UI', sans-serif",
// //                 color: "var(--text-color)",
// //                 backgroundColor: "var(--bg-color)",
// //                 minHeight: "100vh",
// //             }}
// //         >
// //             {/* URL Input */}
// //             <div style={{ display: "flex", alignItems: "center", marginBottom: "20px", gap: "10px" }}>
// //                 <input
// //                     type="text"
// //                     value={url}
// //                     onChange={(e) => setURL(e.target.value)}
// //                     placeholder="Enter website URL"
// //                     style={{
// //                         flex: 1,
// //                         padding: "10px 15px",
// //                         borderRadius: "8px",
// //                         border: "1px solid var(--border-color)",
// //                         fontSize: "16px",
// //                         outline: "none",
// //                         backgroundColor: "var(--input-bg)",
// //                         color: "var(--text-color)",
// //                     }}
// //                 />
// //                 <button
// //                     onClick={handleAnalyze}
// //                     disabled={loading}
// //                     style={{
// //                         padding: "10px 20px",
// //                         borderRadius: "8px",
// //                         border: "none",
// //                         backgroundColor: "#3182ce",
// //                         color: "#fff",
// //                         cursor: "pointer",
// //                         fontWeight: "bold",
// //                     }}
// //                 >
// //                     {loading ? "Analyzing..." : "Analyze"}
// //                 </button>
// //                 <button
// //                     onClick={() => navigate("/dashboard")}
// //                     style={{
// //                         padding: "10px 20px",
// //                         borderRadius: "8px",
// //                         border: "none",
// //                         backgroundColor: "#10b981",
// //                         color: "#fff",
// //                         cursor: "pointer",
// //                         fontWeight: "bold",
// //                     }}
// //                 >
// //                     Go to Dashboard
// //                 </button>
// //             </div>
// //
// //             {/* Typewriter result */}
// //             {displayedText && !loading && (
// //                 <div
// //                     style={{
// //                         marginTop: "20px",
// //                         backgroundColor: "var(--bubble-bg)",
// //                         padding: "20px",
// //                         borderRadius: "15px",
// //                         boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
// //                         whiteSpace: "pre-wrap",
// //                         fontFamily: "monospace",
// //                         lineHeight: "1.5",
// //                         borderLeft: "3px solid #3182ce",
// //                     }}
// //                 >
// //                     {displayedText}
// //                     {isTyping && <span className="cursor">▋</span>}
// //                 </div>
// //             )}
// //
// //             {/* Links + AI recommendations split */}
// //             {result && !isTyping && !loading && (
// //                 <div style={{ display: "flex", gap: "20px", marginTop: "30px", flexWrap: "wrap" }}>
// //                     {/* Left half: Links */}
// //                     <div style={{ flex: "1 1 45%", minWidth: "300px", display: "flex", flexDirection: "column", gap: "15px" }}>
// //                         <div style={{ borderRadius: "15px", padding: "20px", backgroundColor: "var(--bubble-bg-alt)", boxShadow: "0 4px 10px rgba(0,0,0,0.15)" }}>
// //                             <h4>Internal Links</h4>
// //                             <ul>
// //                                 {result.links?.internal?.map((link: string, idx: number) => (
// //                                     <li key={idx}><a href={link} target="_blank" rel="noreferrer">{link}</a></li>
// //                                 ))}
// //                             </ul>
// //                         </div>
// //                         <div style={{ borderRadius: "15px", padding: "20px", backgroundColor: "var(--bubble-bg-alt)", boxShadow: "0 4px 10px rgba(0,0,0,0.15)" }}>
// //                             <h4>External Links</h4>
// //                             <ul>
// //                                 {result.links?.external?.map((link: string, idx: number) => (
// //                                     <li key={idx}><a href={link} target="_blank" rel="noreferrer">{link}</a></li>
// //                                 ))}
// //                             </ul>
// //                         </div>
// //                         <div style={{ borderRadius: "15px", padding: "20px", backgroundColor: "var(--bubble-bg-alt)", boxShadow: "0 4px 10px rgba(0,0,0,0.15)" }}>
// //                             <h4>Broken Links</h4>
// //                             <ul>
// //                                 {result.links?.broken?.map((link: string, idx: number) => (
// //                                     <li key={idx} style={{ color: "red" }}>{link}</li>
// //                                 ))}
// //                             </ul>
// //                         </div>
// //                     </div>
// //
// //                     {/* Right half: AI Recommendations */}
// //                     <div
// //                         style={{
// //                             flex: "1 1 50%",
// //                             minWidth: "350px",
// //                             borderRadius: "20px",
// //                             padding: "25px",
// //                             background: "linear-gradient(135deg, #1e1f27, #2b2e36, #3a3d44, #1c1e24)",
// //                             backgroundSize: "300% 300%",
// //                             animation: "gradientBG 8s ease infinite",
// //                             color: "#fff",
// //                             boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
// //                             backdropFilter: "blur(12px)",
// //                             display: "flex",
// //                             flexDirection: "column",
// //                             gap: "18px",
// //                             border: "1px solid rgba(255,255,255,0.05)",
// //                         }}
// //                     >
// //                         <h3 style={{ marginBottom: "10px", textAlign: "center", fontSize: "22px", fontWeight: 700 }}>
// //                             SEO AI Recommendations
// //                         </h3>
// //
// //                         <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
// //                             {aiRecommendations.map((rec, idx) => (
// //                                 <div
// //                                     key={idx}
// //                                     style={{
// //                                         borderRadius: "16px",
// //                                         padding: "15px 18px",
// //                                         background: `linear-gradient(145deg,
// //                         rgba(${80 + idx * 5}, ${30 + idx * 10}, ${140 - idx * 5}, 0.9),
// //                         rgba(${150 - idx * 6}, ${60 + idx * 4}, ${200 - idx * 8}, 0.75)
// //                     )`,
// //                                         boxShadow: "0 2px 14px rgba(0,0,0,0.25)",
// //                                         transform: "translateY(20px)",
// //                                         opacity: 0,
// //                                         animation: `fadeInUp 0.7s ${idx * 0.2}s ease forwards`,
// //                                         backdropFilter: "blur(4px)",
// //                                         border: "1px solid rgba(255,255,255,0.08)",
// //                                         cursor: "pointer",
// //                                         transition: "transform 0.25s ease, box-shadow 0.25s ease",
// //                                     }}
// //                                     onMouseEnter={(e) => {
// //                                         e.currentTarget.style.transform = "scale(1.03)";
// //                                         e.currentTarget.style.boxShadow = "0 4px 18px rgba(0,0,0,0.35)";
// //                                     }}
// //                                     onMouseLeave={(e) => {
// //                                         e.currentTarget.style.transform = "scale(1)";
// //                                         e.currentTarget.style.boxShadow = "0 2px 14px rgba(0,0,0,0.25)";
// //                                     }}
// //                                 >
// //                                     <h4 style={{ marginBottom: "8px", fontSize: "16px", fontWeight: 600 }}>{rec.title}</h4>
// //                                     <p style={{ fontSize: "14px", lineHeight: 1.45, opacity: 0.95 }}>
// //                                         {rec.detail}
// //                                     </p>
// //                                     <div style={{ textAlign: "right", fontSize: "11px", opacity: 0.75 }}>
// //                                         AI Insight
// //                                     </div>
// //                                 </div>
// //                             ))}
// //                         </div>
// //                     </div>
// //
// //                 </div>
// //             )}
// //
// //             <style>
// //                 {`
// //           :root {
// //             --bg-color: #0e1013;
// //             --text-color: #e4e4e4;
// //             --bubble-bg: #1c1f25;
// //             --bubble-bg-alt: #20252d;
// //             --input-bg: #181a1f;
// //             --border-color: #333;
// //           }
// //
// //           .cursor {
// //             display: inline-block;
// //             animation: blink 1s step-start infinite;
// //           }
// //           @keyframes blink {
// //             50% { opacity: 0; }
// //           }
// //
// //           @keyframes gradientBG {
// //                 0% { background-position: 0% 50%; }
// //                 50% { background-position: 100% 50%; }
// //                 100% { background-position: 0% 50%; }
// //             }
// //
// //             @keyframes fadeInUp {
// //                 0% { opacity: 0; transform: translateY(20px); }
// //                 100% { opacity: 1; transform: translateY(0); }
// //             }
// //
// //         `}
// //             </style>
// //         </div>
// //     );
// // };
//
// import React, { useState } from "react";
// import { analyzeURL } from "../api";
// import { useNavigate } from "react-router-dom";
//
// export const SEOAnalyzer = () => {
//     const [url, setURL] = useState("");
//     const [result, setResult] = useState<any>(null);
//     const [loading, setLoading] = useState(false);
//     const [displayedText, setDisplayedText] = useState<string>("");
//     const [isTyping, setIsTyping] = useState(false);
//     const navigate = useNavigate();
//
//     const handleAnalyze = async () => {
//         if (!url) {
//             alert("Please enter a URL");
//             return;
//         }
//
//         setResult(null);
//         setDisplayedText("");
//         setIsTyping(false);
//         setLoading(true);
//
//         try {
//             const data = await analyzeURL(url);
//             setResult(data);
//             setLoading(false);
//
//             const fullText = `
// Title: ${data.title || "N/A"}
// Meta Description: ${data.metaTags?.description || "N/A"}
// Keywords: ${data.keywords?.join(", ") || "N/A"}
// Score: ${data.score || "N/A"}
// `;
//             setIsTyping(true);
//             let i = 0;
//             const interval = setInterval(() => {
//                 setDisplayedText(fullText.slice(0, i));
//                 i++;
//                 if (i > fullText.length) {
//                     clearInterval(interval);
//                     setIsTyping(false);
//                 }
//             }, 25);
//         } catch (err) {
//             console.error(err);
//             alert("Error analyzing URL");
//             setLoading(false);
//         }
//     };
//
//     const generateAIRecommendations = () => {
//         if (!result) return [];
//         const keywords = result.keywords || ["SEO", "Marketing", "Web", "Optimization"];
//         const internalLinks = result.links?.internal || [];
//         return [
//             {
//                 title: "Add Important Keywords",
//                 detail: `Include relevant keywords like "${keywords[0]}" and "${keywords[1]}" in headings and meta tags.`,
//             },
//             {
//                 title: "Improve Meta Description",
//                 detail: `Your meta description is short or missing keywords. Rewrite it to summarize content in 150-160 characters.`,
//             },
//             {
//                 title: "Fix Broken Links",
//                 detail: `Detected broken links: ${result.links?.broken?.slice(0, 3).join(", ") || "None"}. Update or remove them.`,
//             },
//             {
//                 title: "Add Alt Text",
//                 detail: `Images on your site are missing alt text. Adding descriptive alt text helps accessibility and SEO.`,
//             },
//             {
//                 title: "Content Expansion",
//                 detail: `Consider expanding content for key pages like ${internalLinks[0] || "/home"} with detailed explanations and examples.`,
//             },
//             {
//                 title: "Add Internal Links",
//                 detail: `Link related content together. For example, link ${internalLinks[0] || "/home"} with ${internalLinks[1] || "/about"} for better crawling.`,
//             },
//             {
//                 title: "External Linking",
//                 detail: `Add authoritative external links to credible sites to improve trust and search engine understanding.`,
//             },
//             {
//                 title: "Page Speed Optimization",
//                 detail: `Optimize images, minify CSS/JS, and enable caching to reduce load times.`,
//             },
//         ];
//     };
//
//     const aiRecommendations = generateAIRecommendations();
//
//     const gradientColors = [
//         "linear-gradient(135deg, #ff6a88, #ff99ac, #ffd6e0)",
//         "linear-gradient(135deg, #7f7fd5, #86a8e7, #91eae4)",
//         "linear-gradient(135deg, #ff9a9e, #fad0c4, #fad0c4)",
//         "linear-gradient(135deg, #667eea, #764ba2)",
//         "linear-gradient(135deg, #f83600, #f9d423)",
//         "linear-gradient(135deg, #11998e, #38ef7d)",
//         "linear-gradient(135deg, #fc5c7d, #6a82fb)",
//         "linear-gradient(135deg, #f7971e, #ffd200)",
//     ];
//
//     return (
//         <div
//             style={{
//                 padding: "20px",
//                 margin: "0 auto",
//                 fontFamily: "'Segoe UI', sans-serif",
//                 color: "var(--text-color)",
//                 backgroundColor: "var(--bg-color)",
//                 minHeight: "100vh",
//             }}
//         >
//             {/* URL Input */}
//             <div style={{ display: "flex", alignItems: "center", marginBottom: "20px", gap: "10px" }}>
//                 <input
//                     type="text"
//                     value={url}
//                     onChange={(e) => setURL(e.target.value)}
//                     placeholder="Enter website URL"
//                     style={{
//                         flex: 1,
//                         padding: "10px 15px",
//                         borderRadius: "8px",
//                         border: "1px solid var(--border-color)",
//                         fontSize: "16px",
//                         outline: "none",
//                         backgroundColor: "var(--input-bg)",
//                         color: "var(--text-color)",
//                     }}
//                 />
//                 <button
//                     onClick={handleAnalyze}
//                     disabled={loading}
//                     style={{
//                         padding: "10px 20px",
//                         borderRadius: "8px",
//                         border: "none",
//                         backgroundColor: "#3182ce",
//                         color: "#fff",
//                         cursor: "pointer",
//                         fontWeight: "bold",
//                     }}
//                 >
//                     {loading ? "Analyzing..." : "Analyze"}
//                 </button>
//                 <button
//                     onClick={() => navigate("/dashboard")}
//                     style={{
//                         padding: "10px 20px",
//                         borderRadius: "8px",
//                         border: "none",
//                         backgroundColor: "#10b981",
//                         color: "#fff",
//                         cursor: "pointer",
//                         fontWeight: "bold",
//                     }}
//                 >
//                     Go to Dashboard
//                 </button>
//             </div>
//
//             {/* Typewriter result */}
//             {displayedText && !loading && (
//                 <div
//                     style={{
//                         marginTop: "20px",
//                         backgroundColor: "var(--bubble-bg)",
//                         padding: "20px",
//                         borderRadius: "15px",
//                         whiteSpace: "pre-wrap",
//                         fontFamily: "monospace",
//                         borderLeft: "3px solid #3182ce",
//                     }}
//                 >
//                     {displayedText}
//                     {isTyping && <span className="cursor">▋</span>}
//                 </div>
//             )}
//
//             {/* ✅ AI Recommendation Section - ONLY STYLES UPDATED ✅ */}
//             {result && !isTyping && !loading && (
//                 <div
//                     style={{
//                         marginTop: "35px",
//                         padding: "25px",
//                         borderRadius: "20px",
//                         background: "linear-gradient(120deg, rgba(255,255,255,0.05), rgba(255,255,255,0.08))",
//                         backdropFilter: "blur(12px)",
//                         border: "1px solid rgba(255,255,255,0.06)",
//                         animation: "gradientBG 10s ease infinite",
//                     }}
//                 >
//                     <h3 style={{ textAlign: "center", fontSize: "24px", fontWeight: 700, color: "#fff", marginBottom: "20px" }}>
//                         ✨ AI-Generated SEO Recommendations
//                     </h3>
//
//                     <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
//                         {aiRecommendations.map((rec, idx) => (
//                             <div
//                                 key={idx}
//                                 style={{
//                                     padding: "18px",
//                                     borderRadius: "18px",
//                                     background: gradientColors[idx % gradientColors.length],
//                                     color: "#fff",
//                                     boxShadow: "0 3px 16px rgba(0,0,0,0.25)",
//                                     transform: "scale(1)",
//                                     opacity: 0,
//                                     transition: "all 0.28s ease",
//                                     animation: `fadeInUp 0.7s ${idx * 0.1}s ease forwards`,
//                                     cursor: "pointer",
//                                 }}
//                                 onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
//                                 onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
//                             >
//                                 <h4 style={{ marginBottom: "10px", fontSize: "17px", fontWeight: 700 }}>{rec.title}</h4>
//                                 <p style={{ fontSize: "14px", opacity: 0.95 }}>{rec.detail}</p>
//                                 <div style={{ marginTop: "8px", textAlign: "right", fontSize: "11px", opacity: 0.8 }}>
//                                     AI Insight 💡
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             )}
//
//             <style>
//                 {`
//                 :root {
//                     --bg-color: #0e1013;
//                     --text-color: #e4e4e4;
//                     --bubble-bg: #1c1f25;
//                     --input-bg: #181a1f;
//                     --border-color: #333;
//                 }
//                 .cursor {
//                     animation: blink 1s step-start infinite;
//                 }
//                 @keyframes blink {
//                     50% { opacity: 0; }
//                 }
//                 @keyframes fadeInUp {
//                     0% { opacity: 0; transform: translateY(25px); }
//                     100% { opacity: 1; transform: translateY(0); }
//                 }
//                 @keyframes gradientBG {
//                     0% { background-position: 0% 50%; }
//                     50% { background-position: 100% 50%; }
//                     100% { background-position: 0% 50%; }
//                 }
//                 `}
//             </style>
//         </div>
//     );
// };
import React, { useMemo, useState } from "react";
import { analyzeURL } from "../api";
import { useNavigate } from "react-router-dom";

type Rec = { title: string; detail: string };
type CheckItem = { id: string; label: string; score?: number; hint?: string };

export const SEOAnalyzer = () => {
    const [url, setURL] = useState("");
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [displayedText, setDisplayedText] = useState<string>("");
    const [isTyping, setIsTyping] = useState(false);
    const [selectedChecks, setSelectedChecks] = useState<Record<string, boolean>>({});
    const [meetName, setMeetName] = useState("");
    const [meetEmail, setMeetEmail] = useState("");
    const [meetStart, setMeetStart] = useState(""); // datetime-local
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

    // ---------- helpers ----------
    const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));
    const safeNum = (n: any, d = 0) => (Number.isFinite(Number(n)) ? Number(n) : d);

    const scoreNumber = useMemo(() => {
        const s = Number(result?.score ?? 0);
        return clamp(Math.round(s), 0, 100);
    }, [result]);

    const tier = scoreNumber < 40 ? "poor" : scoreNumber < 75 ? "ok" : "good";
    const scoreColor = (score: number) => (score < 40 ? "#ef4444" : score < 75 ? "#f59e0b" : "#22c55e");

    // Accurate semi-circular gauge using a single arc with strokeDasharray (pathLength=100)
    const Gauge: React.FC<{ value: number }> = ({ value }) => {
        const pct = clamp(value, 0, 100);
        const cx = 100, cy = 110, r = 90;
        // build arc from -120° to 120°
        const polar = (deg: number) => {
            const rad = (Math.PI / 180) * deg;
            return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
        };
        const start = -120, end = 120;
        const [x1, y1] = polar(start);
        const [x2, y2] = polar(end);
        const d = `M ${x1} ${y1} A ${r} ${r} 0 1 1 ${x2} ${y2}`; // 240° (large-arc-flag=1)

        return (
            <svg width="100%" height="180" viewBox="0 0 220 160">
                <defs>
                    <linearGradient id="gTrack" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="rgba(255,255,255,0.12)" />
                        <stop offset="100%" stopColor="rgba(255,255,255,0.18)" />
                    </linearGradient>
                </defs>
                <path d={d} stroke="url(#gTrack)" strokeWidth="16" fill="none" pathLength={100} strokeLinecap="round" />
                <path
                    d={d}
                    stroke={scoreColor(pct)}
                    strokeWidth="16"
                    fill="none"
                    pathLength={100}
                    strokeDasharray={`${pct} ${100 - pct}`}
                    strokeLinecap="round"
                />
                {/* needle */}
                {(() => {
                    const angle = -120 + (240 * pct) / 100;
                    const nx = cx + (r - 8) * Math.cos((Math.PI / 180) * angle);
                    const ny = cy + (r - 8) * Math.sin((Math.PI / 180) * angle);
                    return (
                        <>
                            <line x1={cx} y1={cy} x2={nx} y2={ny} stroke={scoreColor(pct)} strokeWidth="4" />
                            <circle cx={cx} cy={cy} r="6" fill={scoreColor(pct)} />
                        </>
                    );
                })()}
                <text x="110" y="150" textAnchor="middle" fontSize="20" fill="#fff" style={{ fontWeight: 800 }}>
                    {pct}/100
                </text>
            </svg>
        );
    };

    // Derive per-factor numeric scores (0–100) from available signals
    const factorScores = useMemo(() => {
        const title = result?.title?.trim();
        const meta = result?.metaTags?.description?.trim();
        const h1Count = safeNum(result?.headingStructure?.h1, 0);
        const broken = Array.isArray(result?.links?.broken) ? result.links.broken : [];
        const internal = Array.isArray(result?.links?.internal) ? result.links.internal : [];
        const imagesMissingAlt = Array.isArray(result?.imagesMissingAlt) ? result.imagesMissingAlt : [];
        const wordCount = safeNum(result?.wordCount, 0);
        const lcp = safeNum(result?.performance?.lcp ?? result?.loadingTime, 0);

        const titleScore = title ? clamp((title.length / 60) * 100, 40, 100) : 10;
        const metaLen = meta ? meta.length : 0;
        const metaScore = meta ? clamp((150 - Math.abs(150 - metaLen)) / 150 * 100, 30, 100) : 15;
        const h1Score = h1Count === 1 ? 100 : h1Count === 0 ? 25 : 50;
        const linksScore = clamp(100 - broken.length * 10 + Math.min(internal.length, 10) * 3, 10, 100);
        const altScore = imagesMissingAlt.length === 0 ? 100 : clamp(100 - imagesMissingAlt.length * 4, 10, 95);
        const contentScore = wordCount >= 1200 ? 100 : wordCount >= 600 ? 85 : wordCount >= 300 ? 65 : 35;
        const perfScore = lcp ? (lcp < 2500 ? 95 : lcp < 4000 ? 70 : lcp < 6000 ? 45 : 25) : 60;

        return [
            { id: "title", label: "Title Tag", score: Math.round(titleScore), hint: title ? undefined : "Missing title" },
            { id: "meta", label: "Meta Description", score: Math.round(metaScore), hint: meta ? undefined : "Missing meta description" },
            { id: "h1", label: "H1 Usage", score: Math.round(h1Score), hint: h1Count === 0 ? "No H1" : h1Count > 1 ? "Multiple H1s" : undefined },
            { id: "links", label: "Links Health", score: Math.round(linksScore), hint: broken.length ? `${broken.length} broken links` : undefined },
            { id: "alt", label: "Image Alt Text", score: Math.round(altScore), hint: imagesMissingAlt.length ? `${imagesMissingAlt.length} images missing alt` : undefined },
            { id: "content", label: "Content Depth", score: Math.round(contentScore), hint: `${wordCount} words` },
            { id: "perf", label: "Performance (LCP)", score: Math.round(perfScore), hint: lcp ? `${Math.round(lcp / 100) / 10}s LCP` : "No LCP data" },
        ] as CheckItem[];
    }, [result]);

    // Dynamic AI recommendations (non-repeating, count by tier)
    const generateAIRecommendations = (): Rec[] => {
        if (!result) return [];
        const recs: Rec[] = [];

        const title = result?.title?.trim();
        if (!title || title.length < 45 || title.length > 65) {
            recs.push({
                title: "Calibrate Title Length & Focus",
                detail: title
                    ? `Current length ${title.length} chars. Target ~55 chars and lead with a primary keyword + clear value proposition.`
                    : "No title found. Add a concise, keyword-focused title (~55 chars).",
            });
        }

        const meta = result?.metaTags?.description?.trim();
        if (!meta || meta.length < 120 || meta.length > 170) {
            recs.push({
                title: "Craft a Compelling Meta Description",
                detail: meta
                    ? `Meta length ${meta.length}. Aim for 150–160 chars, include primary & secondary keyword, and a strong reason to visit.`
                    : "Add a 150–160 char meta description summarizing the page with a clear outcome.",
            });
        }

        const h1Count = safeNum(result?.headingStructure?.h1, 0);
        if (h1Count !== 1) {
            recs.push({
                title: "Normalize Your H1 Structure",
                detail: h1Count === 0 ? "Add a single H1 that states the main topic." : "Use exactly one H1; demote extras to H2/H3.",
            });
        }

        const broken = Array.isArray(result?.links?.broken) ? result.links.broken : [];
        if (broken.length > 0) {
            recs.push({
                title: "Fix Broken Links",
                detail: `Start with: ${broken.slice(0, 3).join(", ")}${broken.length > 3 ? "…" : ""}.`,
            });
        }

        const internal = Array.isArray(result?.links?.internal) ? result.links.internal : [];
        if (internal.length < 8) {
            recs.push({
                title: "Increase Internal Link Density",
                detail: "Add contextual internal links from related pages to boost crawl flow and topical authority.",
            });
        }

        const imagesMissingAlt = Array.isArray(result?.imagesMissingAlt) ? result.imagesMissingAlt : [];
        if (imagesMissingAlt.length > 0) {
            recs.push({
                title: "Add Descriptive Alt Text",
                detail: `${imagesMissingAlt.length} images lack alt text. Use concise descriptions that reflect the image’s purpose.`,
            });
        }

        const wordCount = safeNum(result?.wordCount, 0);
        if (wordCount < 600) {
            recs.push({
                title: "Expand Content With Subtopics",
                detail: `Current depth: ${wordCount} words. Add sections answering related questions, examples, and comparisons.`,
            });
        }

        const lcp = safeNum(result?.performance?.lcp ?? result?.loadingTime, 0);
        if (lcp > 3000) {
            recs.push({
                title: "Optimize Above-the-Fold Speed",
                detail: `Reduce LCP (~${Math.round(lcp / 100) / 10}s) by compressing hero media, deferring non-critical JS, and preloading key assets.`,
            });
        }

        const keywords = Array.isArray(result?.keywords) ? result.keywords : [];
        if (keywords.length >= 2) {
            recs.push({
                title: "Align Headings & Intro With Target Terms",
                detail: `Integrate "${keywords[0]}" and "${keywords[1]}" naturally in H1/H2 and the opening paragraph.`,
            });
        }

        // de-dupe by title
        const seen = new Set<string>();
        const uniq = recs.filter((r) => (seen.has(r.title) ? false : (seen.add(r.title), true)));

        // decide count by tier
        const want =
            scoreNumber >= 75 ? 4 :
                scoreNumber >= 40 ? 10 :
                    15;

        // If we don't have enough, add generic but still distinct enhancements
        const fillers: Rec[] = [
            { title: "Establish Topic Clusters", detail: "Create hub pages with supporting articles; interlink to signal expertise." },
            { title: "Strengthen E-E-A-T Signals", detail: "Add bylines, author bios, sources, and credentials to key pages." },
            { title: "Improve Readability", detail: "Use shorter sentences, active voice, and scannable subheadings." },
            { title: "Enhance Media Semantics", detail: "Use descriptive filenames, width/height, and modern formats (WebP/AVIF)." },
            { title: "Add Structured Data", detail: "Implement relevant schema (Article, Product, FAQ) to qualify for rich results." },
            { title: "Refine Internal Anchor Text", detail: "Use specific anchors that describe the destination content." },
            { title: "Consolidate Overlapping Pages", detail: "Avoid keyword cannibalization; merge or differentiate similar pages." },
            { title: "Set Canonical & Robots Directives", detail: "Prevent duplicates and ensure indexability of important pages." },
            { title: "Build Topical Backlinks", detail: "Acquire links from relevant, authoritative sites to key pages." },
            { title: "Create a Content Update Cadence", detail: "Refresh aging posts and add new research/data quarterly." },
        ];

        const out = [...uniq];
        for (let i = 0; i < fillers.length && out.length < want; i++) out.push(fillers[i]);
        return out.slice(0, want);
    };

    const aiRecommendations = useMemo(generateAIRecommendations, [result, scoreNumber]);

    // Checklist items to fix (anything with score < 70 becomes actionable)
    const checklist = useMemo<CheckItem[]>(() => {
        return factorScores.filter((f) => (f.score ?? 0) < 70).map((f) => ({
            ...f,
            label: `${f.label} — Score ${f.score}`,
        }));
    }, [factorScores]);

    const gradientCards = [
        "linear-gradient(135deg, #f04e5e, #c86dd7, #6a8dff)",
        "linear-gradient(135deg, #ff6a88, #a66cff, #00c2ff)",
        "linear-gradient(135deg, #ff7a59, #ff4ecd, #3ddad7)",
        "linear-gradient(135deg, #ff4d4d, #8b5cf6, #22d3ee)",
        "linear-gradient(135deg, #ff8ba7, #7c3aed, #06b6d4)",
        "linear-gradient(135deg, #ff5f6d, #845ec2, #00c9a7)",
        "linear-gradient(135deg, #ff7096, #9a4dff, #00e0ff)",
        "linear-gradient(135deg, #ff9a9e, #a18cd1, #5ee7df)",
        "linear-gradient(135deg, #ff6f61, #d66efd, #32e0c4)",
        "linear-gradient(135deg, #ff847c, #6a82fb, #45caff)",
        "linear-gradient(135deg, #ff6f91, #845ec2, #00aeef)",
        "linear-gradient(135deg, #ff758c, #8e44ad, #16c79a)",
        "linear-gradient(135deg, #ff6e7f, #bfe9ff, #6a82fb)",
        "linear-gradient(135deg, #ff5858, #9f44d3, #2fd9c7)",
        "linear-gradient(135deg, #ff3d68, #a051f5, #00bcd4)",
    ];

    const openCalendarMVP = () => {
        if (!meetStart) {
            alert("Pick a start time.");
            return;
        }
        const start = new Date(meetStart);
        const end = new Date(start.getTime() + 60 * 60 * 1000); // +1h
        const fmt = (d: Date) =>
            d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"; // YYYYMMDDTHHMMSSZ

        const params = new URLSearchParams({
            text: meetName ? `SEO Consultation – ${meetName}` : "SEO Consultation",
            details: `Requested by ${meetEmail || "client"} about ${url || "your website"}.`,
            location: "Google Meet (add conferencing inside Calendar)",
            dates: `${fmt(start)}/${fmt(end)}`,
        });

        const href = `https://calendar.google.com/calendar/u/0/r/eventedit?${params.toString()}`;
        window.open(href, "_blank");
    };

    const addSelectedToDashboard = () => {
        const chosen = checklist.filter((c) => selectedChecks[c.id]);
        if (!chosen.length) {
            alert("Select at least one item.");
            return;
        }
        navigate("/dashboard", {
            state: { issues: chosen.map((c) => ({ id: c.id, label: c.label, hint: c.hint })) },
        });
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                width: "100%",
                color: "var(--text-color)",
                fontFamily: "'Inter', 'Segoe UI', sans-serif",
                position: "relative",
                overflowX: "hidden",
            }}
        >
            {/* Hazy full-page gradient background (inspired by your image) */}
            <div
                aria-hidden
                style={{
                    position: "fixed",
                    inset: 0,
                    background:
                        "radial-gradient(60vw 60vw at 20% 80%, rgba(255,0,92,0.35), transparent 60%)," +
                        "radial-gradient(50vw 50vw at 80% 20%, rgba(0,255,224,0.35), transparent 60%)," +
                        "radial-gradient(70vw 70vw at 50% 50%, rgba(115,0,255,0.25), transparent 60%)," +
                        "linear-gradient(180deg, #0e1013 0%, #0e1013 100%)",
                    filter: "blur(0px)",
                    zIndex: 0,
                }}
            />

            {/* Content container */}
            <div style={{ position: "relative", zIndex: 1, padding: "28px 24px", maxWidth: 1400, margin: "0 auto" }}>
                {/* Top controls */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                    <input
                        type="text"
                        value={url}
                        onChange={(e) => setURL(e.target.value)}
                        placeholder="Enter website URL"
                        style={{
                            flex: "1 1 480px",
                            minWidth: 280,
                            padding: "12px 16px",
                            borderRadius: 12,
                            border: "1px solid rgba(255,255,255,0.12)",
                            background: "rgba(0,0,0,0.35)",
                            color: "var(--text-color)",
                            outline: "none",
                        }}
                    />
                    <button
                        onClick={handleAnalyze}
                        disabled={loading}
                        style={{
                            padding: "12px 18px",
                            borderRadius: 12,
                            border: "none",
                            background: "linear-gradient(135deg, #6a82fb, #00c2ff)",
                            color: "#fff",
                            fontWeight: 700,
                            cursor: "pointer",
                        }}
                    >
                        {loading ? "Analyzing…" : "Analyze"}
                    </button>
                    <button
                        onClick={() => navigate("/dashboard")}
                        style={{
                            padding: "12px 18px",
                            borderRadius: 12,
                            border: "1px solid rgba(255,255,255,0.15)",
                            background: "rgba(255,255,255,0.06)",
                            color: "#fff",
                            fontWeight: 700,
                            cursor: "pointer",
                        }}
                    >
                        Dashboard
                    </button>
                </div>

                {/* Typewriter result */}
                {displayedText && !loading && (
                    <div
                        style={{
                            marginTop: 18,
                            background: "rgba(0,0,0,0.35)",
                            padding: 20,
                            borderRadius: 16,
                            whiteSpace: "pre-wrap",
                            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                            border: "1px solid rgba(255,255,255,0.08)",
                        }}
                    >
                        {displayedText}
                        {isTyping && <span className="cursor">▋</span>}
                    </div>
                )}

                {/* SCORE + SUMMARY */}
                {result && !isTyping && !loading && (
                    <div
                        style={{
                            marginTop: 24,
                            display: "grid",
                            gridTemplateColumns: "minmax(280px, 420px) 1fr",
                            gap: 20,
                            alignItems: "stretch",
                        }}
                    >
                        <div
                            style={{
                                borderRadius: 18,
                                padding: 18,
                                background: "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.06))",
                                border: "1px solid rgba(255,255,255,0.10)",
                                backdropFilter: "blur(10px)",
                            }}
                        >
                            <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>SEO Score</div>
                            <Gauge value={scoreNumber} />
                            <div style={{ fontSize: 14, marginTop: -8, color: scoreColor(scoreNumber), fontWeight: 700 }}>
                                {scoreNumber < 40 ? "Poor" : scoreNumber < 75 ? "Okay" : "Good"}
                            </div>
                            <div style={{ opacity: 0.85, marginTop: 6 }}>
                                Scores reflect on-page signals and performance metrics.
                            </div>
                        </div>

                        <div
                            style={{
                                borderRadius: 18,
                                padding: 18,
                                background: "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.06))",
                                border: "1px solid rgba(255,255,255,0.10)",
                                backdropFilter: "blur(10px)",
                            }}
                        >
                            <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>What we evaluate</div>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
                                {factorScores.map((f) => (
                                    <div
                                        key={f.id}
                                        style={{
                                            border: "1px solid rgba(255,255,255,0.10)",
                                            borderRadius: 14,
                                            padding: "12px 14px",
                                            background: "rgba(0,0,0,0.35)",
                                        }}
                                    >
                                        <div style={{ fontSize: 12, opacity: 0.8 }}>{f.label}</div>
                                        <div style={{ fontSize: 20, fontWeight: 800, color: scoreColor(f.score ?? 0) }}>{f.score}</div>
                                        {f.hint && <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>{f.hint}</div>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* AI RECOMMENDATIONS */}
                {result && !isTyping && !loading && (
                    <div
                        style={{
                            marginTop: 28,
                            borderRadius: 20,
                            padding: 22,
                            background: "linear-gradient(120deg, rgba(255,255,255,0.06), rgba(255,255,255,0.08))",
                            border: "1px solid rgba(255,255,255,0.10)",
                            backdropFilter: "blur(10px)",
                        }}
                    >
                        <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 14 }}>
                            AI-Generated Recommendations ({aiRecommendations.length})
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
                            {aiRecommendations.map((rec, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        padding: 16,
                                        borderRadius: 16,
                                        background: gradientCards[idx % gradientCards.length],
                                        color: "#fff",
                                        boxShadow: "0 6px 18px rgba(0,0,0,0.35)",
                                        border: "1px solid rgba(255,255,255,0.15)",
                                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
                                        transform: "translateY(0)",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = "translateY(-4px)";
                                        e.currentTarget.style.boxShadow = "0 10px 24px rgba(0,0,0,0.45)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = "translateY(0)";
                                        e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,0.35)";
                                    }}
                                >
                                    <div style={{ fontWeight: 800, marginBottom: 8 }}>{rec.title}</div>
                                    <div style={{ opacity: 0.95 }}>{rec.detail}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* DIAGNOSTICS + CHECKLIST + CONTACT */}
                {result && !isTyping && !loading && (
                    <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 20, marginTop: 24 }}>
                        {/* Left: Diagnostics */}
                        <div style={{ display: "grid", gap: 16 }}>
                            <div style={{ borderRadius: 16, padding: 18, background: "rgba(0,0,0,0.35)", border: "1px solid rgba(255,255,255,0.10)" }}>
                                <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 10 }}>Links</div>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
                                    <div>
                                        <div style={{ fontWeight: 700, marginBottom: 6 }}>Internal</div>
                                        <ul style={{ maxHeight: 160, overflow: "auto", paddingLeft: 16 }}>
                                            {result?.links?.internal?.map((link: string, i: number) => (
                                                <li key={i}><a href={link} target="_blank" rel="noreferrer">{link}</a></li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 700, marginBottom: 6 }}>External</div>
                                        <ul style={{ maxHeight: 160, overflow: "auto", paddingLeft: 16 }}>
                                            {result?.links?.external?.map((link: string, i: number) => (
                                                <li key={i}><a href={link} target="_blank" rel="noreferrer">{link}</a></li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 700, marginBottom: 6 }}>Broken</div>
                                        <ul style={{ maxHeight: 160, overflow: "auto", paddingLeft: 16 }}>
                                            {result?.links?.broken?.map((link: string, i: number) => (
                                                <li key={i} style={{ color: "#ef4444" }}>{link}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div style={{ borderRadius: 16, padding: 18, background: "rgba(0,0,0,0.35)", border: "1px solid rgba(255,255,255,0.10)" }}>
                                <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 10 }}>Performance</div>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
                                    <Metric label="LCP" valueMs={result?.performance?.lcp ?? result?.loadingTime} />
                                    <Metric label="FCP" valueMs={result?.performance?.fcp} />
                                    <Metric label="TTI" valueMs={result?.performance?.tti} />
                                    <Metric label="Requests" value={result?.performance?.requests} />
                                    <Metric label="Transfer (KB)" value={result?.performance?.transferKb} />
                                </div>
                            </div>

                            <div style={{ borderRadius: 16, padding: 18, background: "rgba(0,0,0,0.35)", border: "1px solid rgba(255,255,255,0.10)" }}>
                                <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 10 }}>Content & Structure</div>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
                                    <Metric label="Title Present" value={result?.title ? 100 : 0} />
                                    <Metric label="Meta Present" value={result?.metaTags?.description ? 100 : 0} />
                                    <Metric label="H1 Count" value={safeNum(result?.headingStructure?.h1, 0)} />
                                    <Metric label="Word Count" value={safeNum(result?.wordCount, 0)} />
                                    <Metric label="Images Missing Alt" value={Array.isArray(result?.imagesMissingAlt) ? result.imagesMissingAlt.length : 0} />
                                    <Metric label="Canonical Present" value={result?.canonical ? 100 : 0} />
                                    <Metric label="Mobile Friendly" value={result?.mobileFriendly === false ? 0 : 100} />
                                    <Metric label="Robots Allowed" value={result?.robotsAllowed === false ? 0 : 100} />
                                    <Metric label="Sitemap Present" value={result?.sitemap ? 100 : 0} />
                                    <Metric label="Structured Data" value={Array.isArray(result?.structuredData) && result.structuredData.length > 0 ? 100 : 0} />
                                </div>
                            </div>
                        </div>

                        {/* Right: Checklist + Agent */}
                        <div style={{ display: "grid", gap: 16 }}>
                            <div style={{ borderRadius: 16, padding: 18, background: "rgba(0,0,0,0.35)", border: "1px solid rgba(255,255,255,0.10)" }}>
                                <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>Checklist — Things to Fix</div>
                                {!checklist.length && <div style={{ opacity: 0.8 }}>Nothing critical. Consider the recommendations above.</div>}
                                {checklist.length > 0 && (
                                    <>
                                        <ul style={{ listStyle: "none", padding: 0, margin: 0, maxHeight: 220, overflow: "auto" }}>
                                            {checklist.map((c) => (
                                                <li key={c.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px dashed rgba(255,255,255,0.08)" }}>
                                                    <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                        <input
                                                            type="checkbox"
                                                            checked={!!selectedChecks[c.id]}
                                                            onChange={(e) =>
                                                                setSelectedChecks((s) => ({ ...s, [c.id]: e.target.checked }))
                                                            }
                                                        />
                                                        <span>{c.label}{c.hint ? ` — ${c.hint}` : ""}</span>
                                                    </label>
                                                </li>
                                            ))}
                                        </ul>
                                        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
                                            <button
                                                onClick={addSelectedToDashboard}
                                                style={{
                                                    padding: "10px 14px",
                                                    borderRadius: 12,
                                                    border: "none",
                                                    background: "linear-gradient(135deg, #7c3aed, #00c2ff)",
                                                    color: "#fff",
                                                    fontWeight: 800,
                                                    cursor: "pointer",
                                                }}
                                            >
                                                Add selected to dashboard
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div style={{
                                borderRadius: 16,
                                padding: 18,
                                background: "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.06))",
                                border: "1px solid rgba(255,255,255,0.10)",
                                backdropFilter: "blur(10px)"
                            }}>
                                <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 10 }}>Contact an Agent</div>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                                    <input
                                        type="text"
                                        placeholder="Your name"
                                        value={meetName}
                                        onChange={(e) => setMeetName(e.target.value)}
                                        style={fieldStyle}
                                    />
                                    <input
                                        type="email"
                                        placeholder="Your email"
                                        value={meetEmail}
                                        onChange={(e) => setMeetEmail(e.target.value)}
                                        style={fieldStyle}
                                    />
                                    <input
                                        type="datetime-local"
                                        value={meetStart}
                                        onChange={(e) => setMeetStart(e.target.value)}
                                        style={{ ...fieldStyle, gridColumn: "1 / -1" }}
                                    />
                                </div>
                                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
                                    <button
                                        onClick={openCalendarMVP}
                                        style={{
                                            padding: "10px 14px",
                                            borderRadius: 12,
                                            border: "none",
                                            background: "linear-gradient(135deg, #00c2ff, #6a82fb)",
                                            color: "#fff",
                                            fontWeight: 800,
                                            cursor: "pointer",
                                        }}
                                    >
                                        Schedule on Google Calendar
                                    </button>
                                </div>
                                <div style={{ fontSize: 12, opacity: 0.75, marginTop: 6 }}>
                                    MVP: opens a prefilled Calendar event. Add conferencing inside Calendar after opening.
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* LOADING OVERLAY (soft gradient blobs + spinner) */}
            {loading && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        backdropFilter: "blur(6px)",
                        display: "grid",
                        placeItems: "center",
                        zIndex: 10,
                    }}
                >
                    <div
                        aria-hidden
                        style={{
                            position: "absolute",
                            inset: 0,
                            background:
                                "radial-gradient(40vw 40vw at 30% 70%, rgba(255,0,92,0.30), transparent 60%)," +
                                "radial-gradient(35vw 35vw at 70% 30%, rgba(0,255,224,0.30), transparent 60%)," +
                                "radial-gradient(50vw 50vw at 50% 50%, rgba(115,0,255,0.20), transparent 60%)",
                            animation: "floatBlobs 12s ease-in-out infinite alternate",
                        }}
                    />
                    <div style={{ position: "relative" }}>
                        <div className="loader" />
                    </div>
                </div>
            )}

            <style>
                {`
          :root {
            --text-color: #eaeaf0;
          }
          .cursor { animation: blink 1s step-start infinite; }
          @keyframes blink { 50% { opacity: 0; } }

          .loader {
            width: 68px;
            height: 68px;
            border-radius: 50%;
            border: 4px solid rgba(255,255,255,0.15);
            border-top-color: #6a82fb;
            border-right-color: #00c2ff;
            animation: spin 0.9s linear infinite;
          }
          @keyframes spin { to { transform: rotate(360deg); } }

          @keyframes floatBlobs {
            0% { transform: translateY(0px) scale(1); }
            100% { transform: translateY(-10px) scale(1.02); }
          }
        `}
            </style>
        </div>
    );
};

// ---------- small UI helpers ----------
const fieldStyle: React.CSSProperties = {
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(0,0,0,0.35)",
    color: "#fff",
    outline: "none",
};

const Metric: React.FC<{ label: string; value?: number; valueMs?: number }> = ({ label, value, valueMs }) => {
    const fmt = (v?: number) => (typeof v === "number" && Number.isFinite(v) ? v : "—");
    const msToSec = (ms?: number) => (typeof ms === "number" && Number.isFinite(ms) ? `${Math.round(ms / 100) / 10}s` : "—");
    const val = valueMs !== undefined ? msToSec(valueMs) : fmt(value);
    return (
        <div style={{
            border: "1px solid rgba(255,255,255,0.10)",
            borderRadius: 14,
            padding: "12px 14px",
            background: "rgba(0,0,0,0.35)"
        }}>
            <div style={{ fontSize: 12, opacity: 0.8 }}>{label}</div>
            <div style={{ fontSize: 18, fontWeight: 800 }}>{val}</div>
        </div>
    );
};
