// Component inspired by github.com/zavalit/bayer-dithering-webgl-demo
import PixelBlast from "./PixelBlast"; // ✨ 1. IMPORTED
import React, { useMemo, useState } from "react";
import { analyzeURL } from "../api";
import { useNavigate } from "react-router-dom";
import { Properties } from "csstype"; // Import Properties for the CSS fix

type Rec = { title: string; detail: string };
type CheckItem = { id: string; label: string; score?: number; hint?: string };

// ✨ 2. ADDED LockIcon component for the teaser card
const LockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ color: "#B19EEF" }}
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

export const SEOAnalyzer = () => {
  const [url, setURL] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [displayedText, setDisplayedText] = useState<string>("");
  const [isTyping, setIsTyping] = useState(false);

  // FIX: Prefix unused setters and states with underscore
  const [_selectedChecks, _setSelectedChecks] = useState<
    Record<string, boolean>
  >({});
  const [_meetName, _setMeetName] = useState("");
  const [_meetEmail, _setMeetEmail] = useState("");
  const [_meetStart, _setMeetStart] = useState(""); // datetime-local

  const navigate = useNavigate();

  const isHeroLayout = !result && !loading;
  // We still need to account for the space the top bar takes
  const topBarHeight = 65;

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
  const clamp = (n: number, min: number, max: number) =>
    Math.max(min, Math.min(max, n));
  const safeNum = (n: any, d = 0) =>
    Number.isFinite(Number(n)) ? Number(n) : d;

  const scoreNumber = useMemo(() => {
    const s = Number(result?.score ?? 0);
    return clamp(Math.round(s), 0, 100);
  }, [result]);

  const scoreColor = (score: number) =>
    score < 40 ? "#ef4444" : score < 75 ? "#f59e0b" : "#22c55e";

  // Mouse move handler for spotlight cards
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  };

  // Accurate semi-circular gauge
  const Gauge: React.FC<{ value: number }> = ({ value }) => {
    const pct = clamp(value, 0, 100);
    const cx = 100,
      cy = 110,
      r = 90;
    const polar = (deg: number) => {
      const rad = (Math.PI / 180) * deg;
      return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
    };
    const start = -120,
      end = 120;
    const [x1, y1] = polar(start);
    const [x2, y2] = polar(end);
    const d = `M ${x1} ${y1} A ${r} ${r} 0 1 1 ${x2} ${y2}`;

    return (
      <svg width="100%" height="180" viewBox="0 0 220 160">
        <defs>
          <linearGradient id="gTrack" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(255,255,255,0.12)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.18)" />
          </linearGradient>
        </defs>
        <path
          d={d}
          stroke="url(#gTrack)"
          strokeWidth="16"
          fill="none"
          pathLength={100}
          strokeLinecap="round"
        />
        <path
          d={d}
          stroke={scoreColor(pct)}
          strokeWidth="16"
          fill="none"
          pathLength={100}
          strokeDasharray={`${pct} ${100 - pct}`}
          strokeLinecap="round"
        />
        {(() => {
          const angle = -120 + (240 * pct) / 100;
          const nx = cx + (r - 8) * Math.cos((Math.PI / 180) * angle);
          const ny = cy + (r - 8) * Math.sin((Math.PI / 180) * angle);
          return (
            <>
              <line
                x1={cx}
                y1={cy}
                x2={nx}
                y2={ny}
                stroke={scoreColor(pct)}
                strokeWidth="4"
              />
              <circle cx={cx} cy={cy} r="6" fill={scoreColor(pct)} />
            </>
          );
        })()}
        <text
          x="110"
          y="150"
          textAnchor="middle"
          fontSize="20"
          fill="#fff"
          style={{ fontWeight: 800 }}
        >
          {pct}/100
        </text>
      </svg>
    );
  };

  // Derive per-factor numeric scores
  const factorScores = useMemo(() => {
    if (!result) return [];
    const title = result?.title?.trim();
    const meta = result?.metaTags?.description?.trim();
    const h1Count = safeNum(result?.headingStructure?.h1, 0);
    const broken = Array.isArray(result?.links?.broken)
      ? result.links.broken
      : [];
    const internal = Array.isArray(result?.links?.internal)
      ? result.links.internal
      : [];
    const imagesMissingAlt = Array.isArray(result?.imagesMissingAlt)
      ? result.imagesMissingAlt
      : [];
    const wordCount = safeNum(result?.wordCount, 0);
    const lcp = safeNum(result?.performance?.lcp ?? result?.loadingTime, 0);

    const titleScore = title ? clamp((title.length / 60) * 100, 40, 100) : 10;
    const metaLen = meta ? meta.length : 0;
    const metaScore = meta
      ? clamp(((150 - Math.abs(150 - metaLen)) / 150) * 100, 30, 100)
      : 15;
    const h1Score = h1Count === 1 ? 100 : h1Count === 0 ? 25 : 50;
    const linksScore = clamp(
      100 - broken.length * 10 + Math.min(internal.length, 10) * 3,
      10,
      100,
    );
    const altScore =
      imagesMissingAlt.length === 0
        ? 100
        : clamp(100 - imagesMissingAlt.length * 4, 10, 95);
    const contentScore =
      wordCount >= 1200
        ? 100
        : wordCount >= 600
          ? 85
          : wordCount >= 300
            ? 65
            : 35;
    const perfScore = lcp
      ? lcp < 2500
        ? 95
        : lcp < 4000
          ? 70
          : lcp < 6000
            ? 45
            : 25
      : 60;

    return [
      {
        id: "title",
        label: "Title Tag",
        score: Math.round(titleScore),
        hint: title ? undefined : "Missing title",
      },
      {
        id: "meta",
        label: "Meta Description",
        score: Math.round(metaScore),
        hint: meta ? undefined : "Missing meta description",
      },
      {
        id: "h1",
        label: "H1 Usage",
        score: Math.round(h1Score),
        hint:
          h1Count === 0 ? "No H1" : h1Count > 1 ? "Multiple H1s" : undefined,
      },
      {
        id: "links",
        label: "Links Health",
        score: Math.round(linksScore),
        hint: broken.length ? `${broken.length} broken links` : undefined,
      },
      {
        id: "alt",
        label: "Image Alt Text",
        score: Math.round(altScore),
        hint: imagesMissingAlt.length
          ? `${imagesMissingAlt.length} images missing alt`
          : undefined,
      },
      {
        id: "content",
        label: "Content Depth",
        score: Math.round(contentScore),
        hint: `${wordCount} words`,
      },
      {
        id: "perf",
        label: "Performance (LCP)",
        score: Math.round(perfScore),
        hint: lcp ? `${Math.round(lcp / 100) / 10}s LCP` : "No LCP data",
      },
    ] as CheckItem[];
  }, [result]);

  // Dynamic AI recommendations
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
        detail:
          h1Count === 0
            ? "Add a single H1 that states the main topic."
            : "Use exactly one H1; demote extras to H2/H3.",
      });
    }
    // ... (other recommendations) ...

    // de-dupe by title
    const seen = new Set<string>();
    const uniq = recs.filter((r) =>
      seen.has(r.title) ? false : (seen.add(r.title), true),
    );

    // decide count by tier
    const want = scoreNumber >= 75 ? 4 : scoreNumber >= 40 ? 10 : 15;

    // Fillers
    const fillers: Rec[] = [
      {
        title: "Establish Topic Clusters",
        detail:
          "Create hub pages with supporting articles; interlink to signal expertise.",
      },
      {
        title: "Strengthen E-E-A-T Signals",
        detail:
          "Add bylines, author bios, sources, and credentials to key pages.",
      },
      // ... (other fillers) ...
    ];

    const out = [...uniq];
    for (let i = 0; i < fillers.length && out.length < want; i++) {
      if (!seen.has(fillers[i].title)) {
        out.push(fillers[i]);
      }
    }
    return out.slice(0, want);
  };

  const aiRecommendations = useMemo(generateAIRecommendations, [
    result,
    scoreNumber,
  ]);

  // Checklist items to fix
  const checklist = useMemo<CheckItem[]>(() => {
    return factorScores
      .filter((f) => (f.score ?? 0) < 70)
      .map((f) => ({
        ...f,
        label: `${f.label} — Score ${f.score}`,
      }));
  }, [factorScores]);

  // FIX: Renamed unused functions to start with underscore
  const _openCalendarMVP = () => {
    if (!_meetStart) {
      alert("Pick a start time.");
      return;
    }
    const start = new Date(_meetStart);
    const end = new Date(start.getTime() + 60 * 60 * 1000); // +1h
    const fmt = (d: Date) =>
      d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

    const params = new URLSearchParams({
      text: _meetName ? `SEO Consultation – ${_meetName}` : "SEO Consultation",
      details: `Requested by ${_meetEmail || "client"} about ${url || "your website"}.`,
      location: "Google Meet (add conferencing inside Calendar)",
      dates: `${fmt(start)}/${fmt(end)}`,
    });

    const href = `https://calendar.google.com/calendar/u/0/r/eventedit?${params.toString()}`;
    window.open(href, "_blank");
  };

  const _addSelectedToDashboard = () => {
    const chosen = checklist.filter((c) => _selectedChecks[c.id]);
    if (!chosen.length) {
      alert("Select at least one item.");
      return;
    }
    navigate("/dashboard", {
      state: {
        issues: chosen.map((c) => ({ id: c.id, label: c.label, hint: c.hint })),
      },
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
      {/* Hazy full-page gradient background */}
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

      {/* NEW: Top Bar (No Navbar styling) */}
      <div
        style={{
          position: "relative", // Not sticky
          zIndex: 20,
          display: "flex",
          alignItems: "center",
          padding: "16px 24px", // Padding for layout
          height: `${topBarHeight}px`,
          boxSizing: "border-box",
        }}
      >
        {/* Left side (Home button) */}
        <div style={{ flex: 1, display: "flex", justifyContent: "flex-start" }}>
          <button
            onClick={() => navigate("/")}
            className="sleek-button" // Use new sleek class
          >
            Home
          </button>
        </div>

        {/* Center (Title) - Plain White & Centered */}
        <div
          style={{
            flex: 1,
            textAlign: "center",
            fontSize: "2.5rem", // Slightly bigger
            fontWeight: 800,
            color: "#fff", // Plain white text
          }}
        >
          SEOtron
        </div>

        {/* Right side (Empty spacer) */}
        <div style={{ flex: 1 }} />
      </div>

      {/* Content container (This is the div from line 409) */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          padding: "28px 24px",
          maxWidth: 1400,
          margin: "0 auto",
        }}
      >
        {/* ✨ 3. MOVED PixelBlast to be the background of the *content container* */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0, // Background layer
            // Opacity persists but is more subtle on results page
            opacity: isHeroLayout ? 0.4 : 0.2,
            transition: "opacity 0.6s ease-in-out",
          }}
        >
          <PixelBlast
            variant="circle"
            pixelSize={6}
            color="#B19EEF"
            patternScale={3}
            patternDensity={1.2}
            pixelSizeJitter={0.5}
            enableRipples
            rippleSpeed={0.1}
            rippleThickness={0.8}
            rippleIntensityScale={0.5}
            liquid
            liquidStrength={0.1}
            liquidRadius={0.2}
            liquidWobbleSpeed={5}
            speed={0.1}
            edgeFade={0.25}
            transparent
          />
        </div>

        {/* SearchWrapper: Animation handler */}
        <div
          style={{
            // ✨ 4. Content (SearchWrapper) is z-10 to be ON TOP of PixelBlast
            position: "relative",
            zIndex: 1,
            // REMOVED overflow: hidden
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: isHeroLayout ? "center" : "flex-start",
            // Adjust minHeight to account for top bar AND page padding
            minHeight: isHeroLayout
              ? `calc(100vh - ${topBarHeight}px - 56px)`
              : "auto",
            width: "100%",
            transition:
              "min-height 0.6s ease-in-out, justify-content 0.6s ease-in-out",
          }}
        >
          {/* ✨ PixelBlast component was MOVED from here */}

          {/* Hero Title - animated */}
          <h2
            style={{
              position: "relative",
              zIndex: 1,
              fontSize: "2.5rem",
              fontWeight: 800,
              background: "linear-gradient(135deg, #ffffff, #b0b0b0)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textAlign: "center",
              maxWidth: "600px",
              lineHeight: 1.3,
              opacity: isHeroLayout ? 1 : 0,
              transform: isHeroLayout ? "translateY(0)" : "translateY(-10px)",
              height: isHeroLayout ? "auto" : "0px",
              marginBottom: isHeroLayout ? "24px" : "0px",
              overflow: "hidden",
              transition: "all 0.4s ease-in-out, height 0.6s ease-in-out",
            }}
          >
            Check you score right now!
          </h2>

          {/* Top controls */}
          <div
            style={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
              width: isHeroLayout ? "min(80vw, 700px)" : "100%",
              maxWidth: "1400px",
              justifyContent: "center",
              transition: "width 0.6s ease-in-out",
              paddingBottom: "40px", // ✨ Restored some padding
            }}
          >
            <input
              type="text"
              value={url}
              onChange={(e) => setURL(e.target.value)}
              placeholder="Enter the website URL here..."
              style={{
                flex: "1 1 480px",
                minWidth: 280,
                padding: "10px 16px",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(1,1,1,1)",
                color: "var(--text-color)",
                outline: "none",
              }}
            />
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="analyze-button" // Use dedicated class
            >
              {loading ? "Analyzing…" : "Analyze"}
            </button>
          </div>
        </div>

        {/* Inline Loading Spinner */}
        {loading && (
          <div
            style={{ display: "grid", placeItems: "center", padding: "40px 0" }}
          >
            <div className="loader" />
            <p style={{ marginTop: 12, opacity: 0.8 }}>Analyzing {url}...</p>
          </div>
        )}

        {/* ✨ 5. WRAPPED results in a z-10 div to stay on top of background */}
        <div style={{ position: "relative", zIndex: 1 }}>
          {!loading && result && (
            <div className="results-container">
              {/* Typewriter result */}
              {displayedText && (
                <div
                  style={{
                    marginTop: 18,
                    background: "rgba(0,0,0,0.35)",
                    padding: 20,
                    borderRadius: 16,
                    whiteSpace: "pre-wrap",
                    fontFamily:
                      "ui-monospace, SFMono-Regular, Menlo, monospace",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  {displayedText}
                  {isTyping && <span className="cursor">▋</span>}
                </div>
              )}

              {/* SCORE + SUMMARY */}
              {!isTyping && (
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
                      background:
                        "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.06))",
                      border: "1px solid rgba(255,255,255,0.10)",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 18,
                        fontWeight: 800,
                        marginBottom: 8,
                      }}
                    >
                      SEO Score
                    </div>
                    <Gauge value={scoreNumber} />
                    <div
                      style={{
                        fontSize: 14,
                        marginTop: -8,
                        color: scoreColor(scoreNumber),
                        fontWeight: 700,
                      }}
                    >
                      {scoreNumber < 40
                        ? "Poor"
                        : scoreNumber < 75
                          ? "Okay"
                          : "Good"}
                    </div>
                    <div style={{ opacity: 0.85, marginTop: 6 }}>
                      Scores reflect on-page signals and performance metrics.
                    </div>
                  </div>

                  <div
                    style={{
                      borderRadius: 18,
                      padding: 18,
                      background:
                        "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.06))",
                      border: "1px solid rgba(255,255,255,0.10)",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 18,
                        fontWeight: 800,
                        marginBottom: 12,
                      }}
                    >
                      What we evaluate
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(180px, 1fr))",
                        gap: 12,
                      }}
                    >
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
                          <div style={{ fontSize: 12, opacity: 0.8 }}>
                            {f.label}
                          </div>
                          <div
                            style={{
                              fontSize: 20,
                              fontWeight: 800,
                              color: scoreColor(f.score ?? 0),
                            }}
                          >
                            {f.score}
                          </div>
                          {f.hint && (
                            <div
                              style={{
                                fontSize: 12,
                                opacity: 0.7,
                                marginTop: 4,
                              }}
                            >
                              {f.hint}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* AI RECOMMENDATIONS - SPOTLIGHT */}
              {!isTyping && (
                <div
                  style={{
                    marginTop: 28,
                    borderRadius: 20,
                    padding: 22,
                    background:
                      "linear-gradient(120deg, rgba(255,255,255,0.06), rgba(255,255,255,0.08))",
                    border: "1px solid rgba(255,255,255,0.10)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <div
                    style={{ fontSize: 20, fontWeight: 800, marginBottom: 14 }}
                  >
                    AI-Generated Recommendations
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(260px, 1fr))",
                      gap: 16,
                    }}
                  >
                    {/* ✨ 6. Show first 3 recommendations */}
                    {aiRecommendations.slice(0, 3).map((rec, idx) => (
                      <div
                        key={idx}
                        className="card-spotlight"
                        onMouseMove={handleCardMouseMove}
                      >
                        <div
                          style={{
                            fontWeight: 800,
                            marginBottom: 8,
                            position: "relative",
                            zIndex: 2,
                          }}
                        >
                          {rec.title}
                        </div>
                        <div
                          style={{
                            opacity: 0.95,
                            position: "relative",
                            zIndex: 2,
                          }}
                        >
                          {rec.detail}
                        </div>
                      </div>
                    ))}

                    {/* ✨ 7. ADDED Teaser Card */}
                    <div
                      className="card-spotlight"
                      onMouseMove={handleCardMouseMove}
                      // FIX: Cast style to allow CSS variables
                      style={
                        {
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 16,
                          padding: "24px",
                          minHeight: "220px", // <--- FIX 1
                          backgroundColor: "rgba(17, 17, 17, 0.7)",
                          borderColor: "rgba(177, 158, 239, 0.3)",
                          // FIX 2: Removed --spotlight-color (it's handled by the CSS class)
                        } as React.CSSProperties
                      }
                    >
                      <LockIcon />
                      <h4
                        style={{
                          margin: 0,
                          fontSize: "1.1rem",
                          fontWeight: 700,
                          textAlign: "center",
                        }}
                      >
                        Unlock {Math.max(0, aiRecommendations.length - 3)} More
                        Recommendations
                      </h4>
                      <p
                        style={{
                          opacity: 0.8,
                          margin: 0,
                          fontSize: "0.9rem",
                          textAlign: "center",
                          maxWidth: 200,
                        }}
                      >
                        Sign up to get full access to all AI insights.
                      </p>
                      <button
                        onClick={() => navigate("/signup")}
                        className="analyze-button"
                        style={{
                          background:
                            "linear-gradient(135deg, #B19EEF, #a66cff)", // Purple gradient
                          width: "100%",
                        }}
                      >
                        Sign Up to Unlock
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Promotion Card */}
              {!isTyping && (
                <div
                  className="card-spotlight promotion-card"
                  onMouseMove={handleCardMouseMove}
                  style={{ marginTop: 28 }}
                >
                  <div style={{ position: "relative", zIndex: 2 }}>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: "1.5rem",
                        background: "linear-gradient(135deg, #00c2ff, #a66cff)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      Get the Full Power of SEOtron
                    </h3>
                    <p style={{ opacity: 0.9, maxWidth: 600 }}>
                      Sign up for free to save your projects, track score
                      changes over time, and unlock advanced competitor
                      insights.
                    </p>
                    <button
                      onClick={() => navigate("/signup")} // Example navigation
                      className="analyze-button"
                      style={{
                        background: "linear-gradient(135deg, #a66cff, #00c2ff)", // Branded gradient
                      }}
                    >
                      Join Now for Free
                    </button>
                  </div>
                </div>
              )}

              {/* DIAGNOSTICS + CHECKLIST + CONTACT */}
              {!isTyping && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1.1fr 0.9fr",
                    gap: 20,
                    marginTop: 24,
                  }}
                >
                  {/* Left: Diagnostics */}
                  <div style={{ display: "grid", gap: 16 }}>
                    {/* ... (Links, Performance, Content & Structure blocks) ... */}
                  </div>

                  {/* Right: Checklist + Agent */}
                  <div style={{ display: "grid", gap: 16 }}>
                    {/* ... (Checklist and Contact blocks) ... */}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        {/* FIX: This is the closing tag for the div at line 409 */}
      </div>

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

        .sleek-button {
            padding: 8px 18px;
            border-radius: 10px;
            border: 1px solid rgba(255,255,255,0.15);
            background: rgba(255,255,255,0.06);
            color: #fff;
            font-weight: 700;
            cursor: pointer;
            transition: background 0.3s ease, transform 0.2s ease;
        }
        .sleek-button:hover {
            background: rgba(255,255,255,0.1);
            transform: translateY(-1px);
        }

        .analyze-button {
            padding: 8px 20px;
            border-radius: 10px;
            border: none;
            background: linear-gradient(135deg, #6a82fb, #00c2ff);
            color: #fff;
            font-weight: 700;
            cursor: pointer;
            transition: background 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;
            box-shadow: 0 4px 12px rgba(0, 194, 255, 0.1);
        }

        .analyze-button:disabled {
            cursor: not-allowed;
            opacity: 0.7;
        }

        .analyze-button:hover:not(:disabled) {
            background: linear-gradient(135deg, #7a92ff, #00d2ff);
            box-shadow: 0 6px 16px rgba(0, 194, 255, 0.2);
            transform: translateY(-1px);
        }

        .analyze-button:active:not(:disabled) {
            transform: translateY(0px) scale(0.98);
            box-shadow: 0 2px 8px rgba(0, 194, 255, 0.15);
        }


        /* Spotlight Card CSS */
        .card-spotlight {
          position: relative;
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background-color: rgba(17, 17, 17, 0.5);
          padding: 16px;
          overflow: hidden;
          --mouse-x: 50%;
          --mouse-y: 50%;
          --spotlight-color: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(4px);
          transition: background-color 0.3s ease, border-color 0.3s ease;
        }

        .card-spotlight::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(
            circle 300px at var(--mouse-x) var(--mouse-y),
            var(--spotlight-color),
            transparent 80%
          );
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
          z-index: 1;
        }

        .card-spotlight:hover::before {
          opacity: 1;
        }

        .card-spotlight:hover {
            border-color: rgba(255, 255, 255, 0.2);
            background-color: rgba(17, 17, 17, 0.7);
        }

        /* Promotion Card Variant */
        .promotion-card {
            padding: 24px;
            --spotlight-color: rgba(0, 255, 224, 0.1);
            border-color: rgba(0, 255, 224, 0.2);
            background: linear-gradient(135deg, rgba(0, 255, 224, 0.02), rgba(115, 0, 255, 0.02));
        }
        .promotion-card:hover {
            border-color: rgba(0, 255, 224, 0.4);
        }
      `}
      </style>
      {/* FIX: This is the closing tag for the root component div */}
    </div>
  );
};

// ---------- small UI helpers ----------
// FIX: Prefixed unused const with _
const _fieldStyle: React.CSSProperties = {
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(0,0,0,0.35)",
  color: "#fff",
  outline: "none",
};

// FIX: Prefixed unused component with _
const _Metric: React.FC<{
  label: string;
  value?: number;
  valueMs?: number;
}> = ({ label, value, valueMs }) => {
  // ... (This component remains unchanged)
  // REMOVED the extra 'S' from this line
  const fmt = (v?: number) =>
    typeof v === "number" && Number.isFinite(v) ? v : "—";
  const msToSec = (ms?: number) =>
    typeof ms === "number" && Number.isFinite(ms)
      ? `${Math.round(ms / 100) / 10}s`
      : "—";
  const val = valueMs !== undefined ? msToSec(valueMs) : fmt(value);
  return (
    <div
      style={{
        border: "1px solid rgba(255,255,255,0.10)",
        borderRadius: 14,
        padding: "12px 14px",
        background: "rgba(0,0,0,0.35)",
      }}
    >
      <div style={{ fontSize: 12, opacity: 0.8 }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 800 }}>{val}</div>
    </div>
  );
};
