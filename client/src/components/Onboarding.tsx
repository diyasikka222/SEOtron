import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { X, Zap, ArrowRight, CheckCircle } from "lucide-react";
import { useLocation } from "react-router-dom";
// ✨ FIX: Path changed to be relative to the components folder
import Aurora from "./Aurora";
// ✨ 1. Import the new API function
// ✨ FIX: Path changed to go up one level
import { saveOnboardingData } from "../api";

// design tokens
const PRIMARY_COLOR = "#9333EA";
const BG_COLOR = "#111113";
const SUBTLE_WHITE = "rgba(255, 255, 255, 0.72)";

const glass = (alpha = 0.08, blur = "22px", borderAlpha = 0.14) => ({
  background: `rgba(255,255,255,${alpha})`,
  backdropFilter: `blur(${blur})`,
  WebkitBackdropFilter: `blur(${blur})`,
  border: `1px solid rgba(255,255,255,${borderAlpha})`,
  boxShadow: `0 8px 32px rgba(0,0,0,0.45)`,
});

// small helpers
const uid = (n = 6) =>
  Math.random()
    .toString(36)
    .slice(2, 2 + n);

// small chip component
const Chip = ({
  children,
  onRemove,
  color,
}: {
  children: React.ReactNode;
  onRemove?: () => void;
  color?: string;
}) => (
  <span
    style={{
      display: "inline-flex",
      gap: 8,
      alignItems: "center",
      padding: "6px 10px",
      borderRadius: 999,
      background: color ?? "rgba(255,255,255,0.04)",
      color: "#fff",
      fontSize: 13,
      margin: 6,
    }}
  >
    <span>{children}</span>
    {onRemove && (
      <X
        size={14}
        style={{ cursor: "pointer", opacity: 0.9 }}
        onClick={onRemove}
      />
    )}
  </span>
);

// storage key
const STORAGE_KEY = "seotron_user_setup";

export default function Onboarding() {
  const navigate = useNavigate();

  // step state
  const [step, setStep] = useState<number>(0);
  const totalSteps = 8;

  // messages during scans and finalization
  const [msg, setMsg] = useState("Initializing setup...");
  const [loadingFinal, setLoadingFinal] = useState(false);

  const [inputError, setInputError] = useState("");

  // ✨ 2. Add state for API errors during finalization
  const [apiError, setApiError] = useState("");

  // user-provided data
  const [website, setWebsite] = useState("");
  const [pages, setPages] = useState<string[]>([]);
  const [pageInput, setPageInput] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState("");
  const [description, setDescription] = useState("");
  const [goals, setGoals] = useState<string[]>([]);
  const [goalInput, setGoalInput] = useState("");
  const [competitors, setCompetitors] = useState<string[]>([]);
  const [competitorInput, setCompetitorInput] = useState("");

  // auto suggestions generated after scan (simple heuristics)
  const [pageRecommendations, setPageRecommendations] = useState<string[]>([]);
  const [keywordRecommendations, setKeywordRecommendations] = useState<
    string[]
  >([]);
  const [goalsRecommendations, setGoalsRecommendations] = useState<string[]>(
    [],
  );

  // persist helper
  const persist = useCallback(() => {
    const payload = {
      website,
      pages,
      keywords,
      description,
      goals,
      competitors,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [website, pages, keywords, description, goals, competitors]);

  useEffect(() => persist(), [persist]);

  // progress simple derived
  const progressPercent = Math.round(((step + 1) / totalSteps) * 100);

  // scan simulation
  const startScan = () => {
    // This check is now in the button's onClick
    setStep(2);
    setMsg("Connecting to your domain...");

    const msgs = [
      "Crawling structure (deep link analysis)...",
      "Detecting important pages & assets...",
      "Extracting headings & meta tags...",
      "Preparing recommendations...",
    ];

    let i = 0;
    const interval = setInterval(() => {
      setMsg(msgs[i % msgs.length]);
      i++;
    }, 1400);

    setTimeout(() => {
      clearInterval(interval);

      // fake discovered pages (derived from domain)
      const host = website.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
      const found = [
        "/",
        "/about",
        "/contact",
        "/products",
        "/blog",
        "/pricing",
      ].slice(0, 5);
      setPages(found);

      // heuristics for keywords: pick words from host and common SEO terms
      const hostParts = host.split(".").filter(Boolean).slice(0, 2).join(" ");
      const suggestedKeywords = [
        hostParts || "website",
        "services",
        "products",
        "blog",
      ]
        .map((w) => w.trim())
        .filter(Boolean)
        .slice(0, 5);
      setKeywordRecommendations(suggestedKeywords);

      // goals suggestions
      setGoalsRecommendations([
        "Increase organic traffic",
        "Improve on-page SEO",
        "Reduce load time",
        "Improve mobile UX",
      ]);

      // page-specific recommendations
      setPageRecommendations(found.map((p) => `Add structured meta to ${p}`));

      setStep(3); // go to review pages step
      setMsg("Scan complete — review detected pages.");
    }, 5500);
  };

  // add page with button
  const addPage = () => {
    const v = pageInput.trim();
    if (!v) return;
    if (!pages.includes(v)) {
      setPages((prev) => [...prev, v]);
    }
    setPageInput("");
  };

  // add keyword
  const addKeyword = () => {
    const v = keywordInput.trim();
    if (!v) return;
    if (!keywords.includes(v)) setKeywords((prev) => [...prev, v]);
    setKeywordInput("");
  };

  // add goal
  const addGoal = () => {
    const v = goalInput.trim();
    if (!v) return;
    if (!goals.includes(v)) setGoals((prev) => [...prev, v]);
    setGoalInput("");
  };

  // add competitor
  const addCompetitor = () => {
    const v = competitorInput.trim();
    if (!v) return;
    if (!competitors.includes(v)) setCompetitors((prev) => [...prev, v]);
    setCompetitorInput("");
  };

  // ✨ 3. MODIFIED finalize function to be async and call API
  const finalize = async () => {
    setLoadingFinal(true);
    setApiError(""); // Clear previous errors
    setMsg("Saving your setup...");

    const payload = {
      website,
      pages,
      keywords,
      description,
      goals,
      competitors,
      createdAt: new Date().toISOString(),
    };

    try {
      // ✨ 4. Call the new API function
      await saveOnboardingData(payload);

      // If API call is successful:
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload)); // Save final state
      setMsg("Finalizing...");

      // small animation then redirect
      setTimeout(() => {
        setLoadingFinal(false);
        navigate("/deepdashboard", {
          state: { ...payload }, // Pass data to dashboard
        });
      }, 1500); // Shortened delay as API call is the main "wait"
    } catch (err: any) {
      // ✨ 5. Handle errors if the API call fails
      console.error("Failed to save onboarding data:", err);
      setApiError(err.message || "Failed to save setup. Please try again.");
      setLoadingFinal(false); // Stop loading
    }
  };

  // small step content builder
  const StepHeader = ({
    title,
    subtitle,
  }: {
    title: string;
    subtitle?: string;
  }) => (
    <>
      <h2
        style={{
          fontSize: 28,
          color: PRIMARY_COLOR,
          margin: 0,
          fontWeight: 700,
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          style={{
            color: SUBTLE_WHITE,
            marginTop: 10,
            marginBottom: 24,
            lineHeight: 1.6,
          }}
        >
          {subtitle}
        </p>
      )}
    </>
  );

  // step components
  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "28px",
        background: BG_COLOR,
        fontFamily: "Inter, 'Segoe UI', system-ui",
        color: "#fff",
        overflow: "hidden",
      }}
    >
      {/* Aurora Background */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <Aurora
          colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
          blend={0.5}
          amplitude={1.0}
          speed={0.5}
        />
      </div>

      {/* soft gradient/lights */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          background: `radial-gradient(40vw 40vw at 10% 20%, rgba(147,51,234,0.10), transparent),
                       radial-gradient(30vw 30vw at 85% 80%, rgba(0,194,255,0.08), transparent)`,
          pointerEvents: "none",
        }}
      />

      {/* foreground card */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          maxWidth: 760,
          borderRadius: 18,
          padding: "34px 28px",
          ...glass(0.04, "24px", 0.08),
        }}
      >
        {/* segmented progress on top */}
        <div style={{ position: "relative", marginBottom: 18 }}>
          <div style={{ position: "absolute", left: 20, top: -18 }}>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>
              Step {step + 1} / {totalSteps}
            </div>
          </div>

          <div
            style={{
              height: 6,
              width: "100%",
              background: "rgba(255,255,255,0.06)",
              borderRadius: 6,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${progressPercent}%`,
                height: "100%",
                background: `linear-gradient(90deg, ${PRIMARY_COLOR}, #00c2ff)`,
                boxShadow: `0 0 14px ${PRIMARY_COLOR}55`,
                transition: "width 400ms ease",
              }}
            />
          </div>
        </div>

        {/* Skip button placed below progress bar so it won't overlap */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 12,
            marginBottom: 10,
          }}
        >
          <button
            onClick={() => {
              localStorage.removeItem(STORAGE_KEY);
              navigate("/deepdashboard"); // Changed from /dashboard
            }}
            style={{
              ...glass(0.06, "10px", 0.06),
              border: `1px solid rgba(255,255,255,0.04)`,
              padding: "8px 12px",
              borderRadius: 10,
              color: "#fff",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Skip Setup
          </button>
        </div>

        {/* step content */}
        <div
          style={{
            minHeight: 320,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <AnimatePresence mode="wait">
            {/* Step 0 - Welcome */}
            {step === 0 && (
              <motion.div
                key="s0"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{ width: "100%", textAlign: "center" }}
              >
                <StepHeader
                  title="Glad you decided to trust us."
                  subtitle="We'll set up your site with a quick scan and personalized recommendations. Shouldn't take long."
                />
                <div style={{ marginTop: 18 }}>
                  <button
                    onClick={() => setStep(1)}
                    style={{
                      ...glass(0.08, "10px", 0.08),
                      background: `linear-gradient(90deg, ${PRIMARY_COLOR}, #00c2ff)`,
                      color: "#fff",
                      border: "none",
                      padding: "12px 22px",
                      borderRadius: 12,
                      cursor: "pointer",
                      fontWeight: 700,
                      boxShadow: `0 8px 30px ${PRIMARY_COLOR}40`,
                    }}
                  >
                    Ready to Leap
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 1 - Enter website */}
            {step === 1 && (
              <motion.div
                key="s1"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                style={{ width: "100%", textAlign: "center" }}
              >
                <StepHeader
                  title="Type your main website address"
                  subtitle="We'll run a quick scan to detect pages, meta, and structure."
                />
                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 12,
                  }}
                >
                  <input
                    value={website}
                    onChange={(e) => {
                      setWebsite(e.target.value);
                      setInputError("");
                    }}
                    placeholder="https://example.com"
                    style={{
                      ...glass(0.08, "8px", 0.08),
                      padding: "12px 14px",
                      borderRadius: 12,
                      width: 420,
                      border: "1px solid rgba(255,255,255,0.06)",
                      color: "#fff",
                      outline: "none",
                      fontSize: 15,
                    }}
                  />
                  <button
                    onClick={() => {
                      if (website.trim()) {
                        setInputError("");
                        startScan();
                      } else {
                        setInputError("Please enter a website URL first!");
                      }
                    }}
                    style={{
                      background: `linear-gradient(90deg, ${PRIMARY_COLOR}, #00c2ff)`,
                      color: "#fff",
                      padding: "10px 14px",
                      borderRadius: 10,
                      border: "none",
                      cursor: "pointer",
                      fontWeight: 700,
                    }}
                  >
                    Analyze
                    <ArrowRight size={16} style={{ marginLeft: 8 }} />
                  </button>
                </div>

                <p
                  style={{
                    color: "#FF3232",
                    fontSize: 14,
                    marginTop: 10,
                    height: "16px",
                    lineHeight: "16px",
                  }}
                >
                  {inputError}
                </p>
              </motion.div>
            )}

            {/* Step 2 - Scanning (animated) */}
            {step === 2 && (
              <motion.div
                key="s2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ width: "100%", textAlign: "center" }}
              >
                <StepHeader title="Scanning your website..." subtitle={msg} />
                <div style={{ marginTop: 18 }}>
                  <div
                    style={{
                      height: 12,
                      width: 420,
                      background: "rgba(255,255,255,0.06)",
                      borderRadius: 8,
                      overflow: "hidden",
                      margin: "0 auto",
                    }}
                  >
                    <motion.div
                      initial={{ x: "-100%" }}
                      animate={{ x: "100%" }}
                      transition={{
                        duration: 6.5,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      style={{
                        height: "100%",
                        width: "30%",
                        background: `linear-gradient(90deg, transparent, ${PRIMARY_COLOR}, transparent)`,
                        boxShadow: `0 0 18px ${PRIMARY_COLOR}55`,
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3 - Detected pages (review + add) */}
            {step === 3 && (
              <motion.div
                key="s3"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                style={{ width: "100%", textAlign: "center" }}
              >
                <StepHeader
                  title="Scan Complete! Review your pages"
                  subtitle="We found these pages — remove or add as needed."
                />
                <div style={{ marginTop: 12 }}>
                  <div
                    style={{
                      maxWidth: 560,
                      margin: "0 auto",
                      marginBottom: 12,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "center",
                      }}
                    >
                      {pages.length ? (
                        pages.map((p) => (
                          <Chip
                            key={p}
                            onRemove={() => {
                              setPages((prev) => prev.filter((x) => x !== p));
                            }}
                            color="rgba(255,255,255,0.06)"
                          >
                            {p}
                          </Chip>
                        ))
                      ) : (
                        <div style={{ color: "rgba(255,255,255,0.6)" }}>
                          No pages detected yet
                        </div>
                      )}
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: 8,
                    }}
                  >
                    <input
                      value={pageInput}
                      onChange={(e) => setPageInput(e.target.value)}
                      placeholder="/careers or /pricing"
                      style={{
                        ...glass(0.08, "8px", 0.08),
                        padding: "10px 12px",
                        borderRadius: 10,
                        width: 340,
                        border: "1px solid rgba(255,255,255,0.05)",
                        color: "#fff",
                      }}
                    />
                    <button
                      onClick={addPage}
                      style={{
                        ...glass(0.08, "8px", 0.08),
                        padding: "10px 14px",
                        borderRadius: 10,
                        border: "none",
                        color: "#fff",
                        background: PRIMARY_COLOR,
                        cursor: "pointer",
                      }}
                    >
                      + Add
                    </button>
                  </div>

                  <div style={{ marginTop: 22 }}>
                    <button
                      onClick={() => setStep(4)}
                      style={{
                        background: `linear-gradient(90deg, ${PRIMARY_COLOR}, #00c2ff)`,
                        padding: "10px 20px",
                        borderRadius: 12,
                        border: "none",
                        color: "#fff",
                        cursor: "pointer",
                        fontWeight: 700,
                      }}
                    >
                      Confirm Pages
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4 - Keywords */}
            {step === 4 && (
              <motion.div
                key="s4"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                style={{ width: "100%", textAlign: "center" }}
              >
                <StepHeader
                  title="Target Keywords"
                  subtitle="Add keywords that best describe your site. We also suggest a few based on your scan."
                />
                <div style={{ maxWidth: 640, margin: "0 auto", marginTop: 12 }}>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "center",
                    }}
                  >
                    {keywords.map((k) => (
                      <Chip
                        key={k}
                        onRemove={() =>
                          setKeywords((prev) => prev.filter((x) => x !== k))
                        }
                      >
                        {k}
                      </Chip>
                    ))}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      justifyContent: "center",
                      marginTop: 12,
                    }}
                  >
                    <input
                      value={keywordInput}
                      onChange={(e) => setKeywordInput(e.target.value)}
                      placeholder="type a keyword and press Enter"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") addKeyword();
                      }}
                      style={{
                        ...glass(0.08, "8px", 0.08),
                        padding: "10px 12px",
                        borderRadius: 10,
                        width: 400,
                        color: "#fff",
                      }}
                    />
                    <button
                      onClick={addKeyword}
                      style={{
                        background: PRIMARY_COLOR,
                        color: "#fff",
                        padding: "10px 14px",
                        borderRadius: 10,
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      Add
                    </button>
                  </div>

                  <div
                    style={{
                      marginTop: 14,
                      display: "flex",
                      gap: 8,
                      justifyContent: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    {keywordRecommendations.map((k) => (
                      <button
                        key={k}
                        onClick={() => {
                          if (!keywords.includes(k))
                            setKeywords((prev) => [...prev, k]);
                        }}
                        style={{
                          padding: "8px 12px",
                          borderRadius: 999,
                          background: "rgba(255,255,255,0.03)",
                          color: "#fff",
                          border: "1px solid rgba(255,255,255,0.04)",
                          cursor: "pointer",
                        }}
                      >
                        {k}
                      </button>
                    ))}
                  </div>

                  <div style={{ marginTop: 22 }}>
                    <button
                      onClick={() => setStep(5)}
                      style={{
                        background: `linear-gradient(90deg, ${PRIMARY_COLOR}, #00c2ff)`,
                        color: "#fff",
                        padding: "10px 20px",
                        borderRadius: 12,
                        border: "none",
                        cursor: "pointer",
                        fontWeight: 700,
                      }}
                    >
                      Next: Description
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 5 - Business description */}
            {step === 5 && (
              <motion.div
                key="s5"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                style={{ width: "100%", textAlign: "center" }}
              >
                <StepHeader
                  title="Business Description"
                  subtitle="Write a short description that represents your business. We'll use it to tailor recommendations."
                />
                <div style={{ marginTop: 12 }}>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="We are a small business that..."
                    style={{
                      width: 640,
                      maxWidth: "100%",
                      minHeight: 140,
                      padding: 14,
                      borderRadius: 12,
                      resize: "vertical",
                      ...glass(0.06, "10px", 0.06),
                      border: "1px solid rgba(255,255,255,0.04)",
                      color: "#fff",
                      fontSize: 14,
                    }}
                  />
                </div>

                <div
                  style={{
                    marginTop: 14,
                    display: "flex",
                    gap: 8,
                    justifyContent: "center",
                  }}
                >
                  <button
                    onClick={() => {
                      if (!description.trim()) {
                        // provide quick auto fill from keywords
                        const auto = keywords.slice(0, 4).join(" ");
                        setDescription(
                          `We provide ${auto} and related services to help customers.`,
                        );
                      } else {
                        setStep(6);
                      }
                    }}
                    style={{
                      background: `linear-gradient(90deg, ${PRIMARY_COLOR}, #00c2ff)`,
                      color: "#fff",
                      padding: "10px 20px",
                      borderRadius: 12,
                      border: "none",
                      cursor: "pointer",
                      fontWeight: 700,
                    }}
                  >
                    {description.trim()
                      ? "Next: Goals"
                      : "Auto-fill description"}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 6 - Goals */}
            {step === 6 && (
              <motion.div
                key="s6"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                style={{ width: "100%", textAlign: "center" }}
              >
                <StepHeader
                  title="SEO Goals"
                  subtitle="What are your top objectives? Choose or add your goals."
                />
                <div style={{ marginTop: 10 }}>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "center",
                    }}
                  >
                    {goals.map((g) => (
                      <Chip
                        key={g}
                        onRemove={() =>
                          setGoals((prev) => prev.filter((x) => x !== g))
                        }
                      >
                        {g}
                      </Chip>
                    ))}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      justifyContent: "center",
                      marginTop: 12,
                    }}
                  >
                    <input
                      value={goalInput}
                      onChange={(e) => setGoalInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") addGoal();
                      }}
                      placeholder="Add a goal (e.g., increase organic traffic)"
                      style={{
                        ...glass(0.08, "8px", 0.08),
                        padding: "10px 12px",
                        borderRadius: 10,
                        width: 420,
                        color: "#fff",
                      }}
                    />
                    <button
                      onClick={addGoal}
                      style={{
                        background: PRIMARY_COLOR,
                        color: "#fff",
                        padding: "10px 14px",
                        borderRadius: 10,
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      Add
                    </button>
                  </div>

                  <div
                    style={{
                      marginTop: 14,
                      display: "flex",
                      gap: 8,
                      justifyContent: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    {goalsRecommendations.map((g) => (
                      <button
                        key={g}
                        onClick={() => {
                          if (!goals.includes(g))
                            setGoals((prev) => [...prev, g]);
                        }}
                        style={{
                          padding: "8px 12px",
                          borderRadius: 999,
                          background: "rgba(255,255,255,0.03)",
                          color: "#fff",
                          border: "1px solid rgba(255,255,255,0.04)",
                          cursor: "pointer",
                        }}
                      >
                        {g}
                      </button>
                    ))}
                  </div>

                  <div style={{ marginTop: 22 }}>
                    <button
                      onClick={() => setStep(7)}
                      style={{
                        background: `linear-gradient(90deg, ${PRIMARY_COLOR}, #00c2ff)`,
                        color: "#fff",
                        padding: "10px 20px",
                        borderRadius: 12,
                        border: "none",
                        cursor: "pointer",
                        fontWeight: 700,
                      }}
                    >
                      Next: Competitors
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 7 - Competitors */}
            {step === 7 && (
              <motion.div
                key="s7"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                style={{ width: "100%", textAlign: "center" }}
              >
                <StepHeader
                  title="Competitors"
                  subtitle="List direct competitors — we'll compare them when preparing recommendations."
                />
                <div style={{ marginTop: 12 }}>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "center",
                    }}
                  >
                    {competitors.map((c) => (
                      <Chip
                        key={c}
                        onRemove={() =>
                          setCompetitors((prev) => prev.filter((x) => x !== c))
                        }
                      >
                        {c}
                      </Chip>
                    ))}
                  </div>

                  <div
                    style={{
                      marginTop: 12,
                      display: "flex",
                      gap: 8,
                      justifyContent: "center",
                    }}
                  >
                    <input
                      value={competitorInput}
                      onChange={(e) => setCompetitorInput(e.target.value)}
                      placeholder="competitor.com"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") addCompetitor();
                      }}
                      style={{
                        ...glass(0.08, "8px", 0.08),
                        padding: "10px 12px",
                        borderRadius: 10,
                        width: 420,
                        color: "#fff",
                      }}
                    />
                    <button
                      onClick={addCompetitor}
                      style={{
                        background: PRIMARY_COLOR,
                        color: "#fff",
                        padding: "10px 14px",
                        borderRadius: 10,
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      Add
                    </button>
                  </div>

                  <div style={{ marginTop: 22 }}>
                    <button
                      onClick={finalize}
                      disabled={loadingFinal} // ✨ 6. Disable button while loading
                      style={{
                        background: `linear-gradient(90deg, ${PRIMARY_COLOR}, #00c2ff)`,
                        color: "#fff",
                        padding: "10px 20px",
                        borderRadius: 12,
                        border: "none",
                        cursor: "pointer",
                        fontWeight: 700,
                        opacity: loadingFinal ? 0.7 : 1, // ✨ 6. Visual feedback
                      }}
                    >
                      {loadingFinal ? "Saving..." : "Finalize Setup"}
                    </button>
                  </div>

                  {/* ✨ 7. Show API error if it fails */}
                  <p
                    style={{
                      color: "#FF3232",
                      fontSize: 14,
                      marginTop: 10,
                      height: "16px",
                      lineHeight: "16px",
                    }}
                  >
                    {apiError}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Final loading UI */}
            {loadingFinal && (
              <motion.div
                key="finalLoading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ width: "100%", textAlign: "center" }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 18,
                  }}
                >
                  <div
                    style={{
                      width: 84,
                      height: 84,
                      borderRadius: 48,
                      display: "grid",
                      placeItems: "center",
                      background: `conic-gradient(${PRIMARY_COLOR}, #00c2ff, ${PRIMARY_COLOR})`,
                      boxShadow: `0 8px 30px ${PRIMARY_COLOR}40`,
                    }}
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.6, repeat: Infinity }}
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: 999,
                        background: "rgba(0,0,0,0.25)",
                        display: "grid",
                        placeItems: "center",
                      }}
                    >
                      <CheckCircle size={36} color="#fff" />
                    </motion.div>
                  </div>
                  <h3
                    style={{ margin: 0, color: SUBTLE_WHITE, fontWeight: 700 }}
                  >
                    Almost there — setting things up
                  </h3>
                  <p style={{ margin: 0, color: "rgba(255,255,255,0.7)" }}>
                    {msg}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 100,
          width: "100%",
          textAlign: "center",
          zIndex: 2,
          color: "rgba(255,255,255,0.6)",
        }}
      >
        <div style={{ fontSize: 13, marginBottom: 6 }}>Summary</div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 18,
            flexWrap: "wrap",
          }}
        >
          <div style={{ color: "rgba(255,255,255,0.85)" }}>
            Website: <strong style={{ color: "#fff" }}>{website || "—"}</strong>
          </div>
          <div style={{ color: "rgba(255,255,255,0.85)" }}>
            Pages: <strong>{pages.length}</strong>
          </div>
          <div style={{ color: "rgba(255,255,255,0.85)" }}>
            Keywords: <strong>{keywords.length}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
