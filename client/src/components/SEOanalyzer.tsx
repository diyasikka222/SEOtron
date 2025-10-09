// import React, { useState } from "react";
// import { analyzeURL } from "../api";
// import { BounceLoader } from "react-spinners"; // npm i react-spinners
//
// export const SEOAnalyzer = () => {
//   const [url, setURL] = useState("");
//   const [result, setResult] = useState<any>(null);
//   const [loading, setLoading] = useState(false);
//
//   const handleAnalyze = async () => {
//     if (!url) {
//       alert("Please enter a URL");
//       return;
//     }
//
//     setResult(null); // reset previous results
//     setLoading(true);
//
//     try {
//       const data = await analyzeURL(url);
//       setResult(data);
//     } catch (err) {
//       console.error(err);
//       alert("Error analyzing URL");
//     }
//
//     setLoading(false);
//   };
//
//   return (
//     <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto", fontFamily: "'Segoe UI', sans-serif" }}>
//       {/* URL Input */}
//       <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
//         <input
//           type="text"
//           value={url}
//           onChange={(e) => setURL(e.target.value)}
//           placeholder="Enter website URL"
//           style={{
//             flex: 1,
//             marginRight: "10px",
//             padding: "10px 15px",
//             borderRadius: "8px",
//             border: "1px solid #ccc",
//             fontSize: "16px",
//             outline: "none",
//             color: "black"
//           }}
//         />
//         <button
//           onClick={handleAnalyze}
//           disabled={loading}
//           style={{
//             padding: "10px 20px",
//             borderRadius: "8px",
//             border: "none",
//             backgroundColor: "#3182ce",
//             color: "#fff",
//             cursor: "pointer",
//             fontWeight: "bold",
//           }}
//         >
//           {loading ? "Analyzing..." : "Analyze"}
//         </button>
//       </div>
//
//       {/* Loading Animation */}
//       {loading && (
//         <div style={{ display: "flex", justifyContent: "center", marginTop: "30px" }}>
//           <BounceLoader color="#3182ce" size={60} />
//         </div>
//       )}
//
//       {/* Results */}
//       {result && !loading && (
//         <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "15px" }}>
//           {/* ChatGPT-style bubble */}
//           <div style={{
//             backgroundColor: "#f1f3f6",
//             padding: "20px",
//             borderRadius: "15px",
//             boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
//             animation: "fadeIn 0.5s ease-in-out",
//           }}>
//             <p><strong>Title:</strong> {result.title}</p>
//             <p><strong>Meta Description:</strong> {result.metaTags?.description || "N/A"}</p>
//             <p><strong>Keywords:</strong> {result.keywords?.join(", ") || "N/A"}</p>
//             <p><strong>Score:</strong> {result.score || "N/A"}</p>
//           </div>
//
//           {/* Links in separate bubble */}
//           <div style={{
//             backgroundColor: "#e8f0fe",
//             padding: "20px",
//             borderRadius: "15px",
//             boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
//             animation: "fadeIn 0.5s ease-in-out",
//           }}>
//             <h4>Internal Links:</h4>
//             <ul>
//               {result.links?.internal?.map((link: string, idx: number) => (
//                 <li key={idx}><a href={link} target="_blank">{link}</a></li>
//               ))}
//             </ul>
//
//             <h4>External Links:</h4>
//             <ul>
//               {result.links?.external?.map((link: string, idx: number) => (
//                 <li key={idx}><a href={link} target="_blank">{link}</a></li>
//               ))}
//             </ul>
//
//             <h4>Broken Links:</h4>
//             <ul>
//               {result.links?.broken?.map((link: string, idx: number) => (
//                 <li key={idx} style={{ color: "red" }}>{link}</li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       )}
//
//       {/* Simple fade-in animation */}
//       <style>
//         {`
//           @keyframes fadeIn {
//             from { opacity: 0; transform: translateY(10px); }
//             to { opacity: 1; transform: translateY(0); }
//           }
//         `}
//       </style>
//     </div>
//   );
// };
//


import React, { useState, useEffect } from "react";
import { analyzeURL } from "../api";
import { BounceLoader } from "react-spinners"; // npm i react-spinners

export const SEOAnalyzer = () => {
    const [url, setURL] = useState("");
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [displayedText, setDisplayedText] = useState<string>(""); // for typewriter effect
    const [isTyping, setIsTyping] = useState(false);

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

            // Simulate ChatGPT-style typewriter delay
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

    return (
        <div
            style={{
                padding: "20px",
                // maxWidth: "900px",
                margin: "0 auto",
                fontFamily: "'Segoe UI', sans-serif",
                color: "var(--text-color)",
                backgroundColor: "var(--bg-color)",
                position: "relative",
                minHeight: "100vh",
                overflow: "hidden",
            }}
        >
            {/* Subtle grid background */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage:
                        "linear-gradient(var(--grid-color) 1px, transparent 1px), linear-gradient(90deg, var(--grid-color) 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                    opacity: 0.15,
                    zIndex: 0,
                }}
            />

            {/* Content layer */}
            <div style={{ position: "relative", zIndex: 1 }}>
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
                            opacity: loading ? 0.8 : 1,
                            transition: "0.2s",
                        }}
                    >
                        {loading ? "Analyzing..." : "Analyze"}
                    </button>
                </div>

                {/* "Thinking..." animation */}
                {loading && (
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            marginTop: "40px",
                        }}
                    >
                        <div
                            style={{
                                width: "180px",
                                height: "80px",
                                borderRadius: "15px",
                                backgroundColor: "var(--bubble-bg)",
                                boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "18px",
                                fontWeight: 500,
                            }}
                        >
                            <div className="dots">
                                <span>.</span>
                                <span>.</span>
                                <span>.</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* ChatGPT-like typewriter result */}
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

                {/* Links after typewriter completes */}
                {result && !isTyping && !loading && (
                    <div
                        style={{
                            marginTop: "20px",
                            backgroundColor: "var(--bubble-bg-alt)",
                            padding: "20px",
                            borderRadius: "15px",
                            boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
                        }}
                    >
                        <h4>Internal Links:</h4>
                        <ul>
                            {result.links?.internal?.map((link: string, idx: number) => (
                                <li key={idx}>
                                    <a href={link} target="_blank" rel="noreferrer">
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>

                        <h4>External Links:</h4>
                        <ul>
                            {result.links?.external?.map((link: string, idx: number) => (
                                <li key={idx}>
                                    <a href={link} target="_blank" rel="noreferrer">
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>

                        <h4>Broken Links:</h4>
                        <ul>
                            {result.links?.broken?.map((link: string, idx: number) => (
                                <li key={idx} style={{ color: "red" }}>
                                    {link}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* Styles */}
            <style>
                {`
        :root {
          --bg-color: #f8fafc;
          --text-color: #1e1e1e;
          --bubble-bg: #f1f3f6;
          --bubble-bg-alt: #e8f0fe;
          --input-bg: #fff;
          --border-color: #ccc;
          --grid-color: rgba(0,0,0,0.1);
        }

        @media (prefers-color-scheme: dark) {
          :root {
            --bg-color: #0e1013;
            --text-color: #e4e4e4;
            --bubble-bg: #1c1f25;
            --bubble-bg-alt: #20252d;
            --input-bg: #181a1f;
            --border-color: #333;
            --grid-color: rgba(255,255,255,0.05);
          }
        }

        .dots span {
          animation: bounce 1.4s infinite;
          font-size: 30px;
          margin: 0 3px;
        }
        .dots span:nth-child(2) { animation-delay: 0.2s; }
        .dots span:nth-child(3) { animation-delay: 0.4s; }

        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.6; }
          40% { transform: translateY(-10px); opacity: 1; }
        }

        .cursor {
          display: inline-block;
          animation: blink 1s step-start infinite;
        }
        @keyframes blink {
          50% { opacity: 0; }
        }
      `}
            </style>
        </div>
    );
};
