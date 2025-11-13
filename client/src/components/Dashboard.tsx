import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import {
  Activity,
  Lock,
  Unlock,
  DownloadCloud,
  RefreshCcw,
  Share2,
  Zap,
  Check,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

/**
 * SEOtron — Deep Dashboard (enhanced with Plans, Scheduler, Actions, Logout)
 *
 * Added features:
 * - Plans modal (Free / Premium / Enterprise) — choosing plan toggles Pro flags
 * - Account-level Pro (isProUser) and per-site proEnabled flag
 * - Scheduler that auto-runs scans while page is open (daily/weekly/monthly)
 * - Actions modal for bulk operations (rescan all, export all, clear all)
 * - Logout button (clears localStorage "user" and navigates to /login)
 * - Pro features panel shows unlocked/locked states
 *
 * Replace your existing DashboardDeep.tsx with this file.
 */

// -------------------- Types --------------------
type ScanPoint = { ts: string; score: number };
type Recommendation = { title: string; detail: string };
type Issue = {
  id: string;
  label: string;
  severity?: number;
  category?: string;
  fixed?: boolean;
};
type Site = {
  id: string;
  url: string;
  title?: string;
  lastAnalyzed?: string | null;
  latestScore?: number | null;
  scans?: ScanPoint[];
  recommendations?: Recommendation[];
  issues?: Issue[];
  settings?: { schedule?: string | null; proEnabled?: boolean };
};

// -------------------- Storage --------------------
const STORAGE_KEY = "seotron_dashboard_v2";
const getStore = (): { sites: Site[] } => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { sites: [] };
    return JSON.parse(raw);
  } catch {
    return { sites: [] };
  }
};
const setStore = (s: { sites: Site[] }) =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s));

// -------------------- Helpers --------------------
const uid = (n = 6) =>
  Math.random()
    .toString(36)
    .slice(2, 2 + n);
const nowISO = () => new Date().toISOString();
const clamp = (v: number, a = 0, b = 100) => Math.max(a, Math.min(b, v));
const formatDate = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleString() : "—";
const toCSV = (rows: Record<string, any>[]) => {
  if (!rows.length) return "";
  const keys = Object.keys(rows[0]);
  return [
    keys.join(","),
    ...rows.map((r) => keys.map((k) => JSON.stringify(r[k] ?? "")).join(",")),
  ].join("\n");
};

// -------------------- Fake analyzer (placeholder) --------------------
async function fakeAnalyze(url: string) {
  try {
    await new Promise((r) => setTimeout(r, 450 + Math.random() * 400));
    const score = Math.round(30 + Math.random() * 65);
    const scan = { ts: new Date().toISOString(), score };
    const recs: Recommendation[] = [
      {
        title: "Optimize meta description",
        detail: "Add 150–160 char meta description with clear CTA.",
      },
      {
        title: "Compress hero image",
        detail: "Deliver WebP and lazy-load offscreen images.",
      },
      {
        title: "Add H1 and structured headings",
        detail: "Single H1, logical H2/H3 hierarchy.",
      },
    ];
    const issues: Issue[] = [
      {
        id: "meta",
        label: "Meta description missing",
        severity: 70,
        category: "On-page",
        fixed: false,
      },
      {
        id: "images_alt",
        label: "Images missing alt text",
        severity: 45,
        category: "Accessibility",
        fixed: false,
      },
      {
        id: "broken",
        label: "Broken links detected",
        severity: 60,
        category: "Technical",
        fixed: false,
      },
    ];
    return { score, scan, recs, issues };
  } catch (err) {
    // fallback
    return {
      score: 50,
      scan: { ts: new Date().toISOString(), score: 50 },
      recs: [],
      issues: [],
    };
  }
}

// -------------------- Small UI parts (LockedTeaser & Modal kept) --------------------
const badge = (text: string) => ({
  padding: "6px 8px",
  borderRadius: 8,
  background: "rgba(255,255,255,0.04)",
  fontSize: 12,
  display: "inline-block",
  color: "white",
});

const Modal: React.FC<{
  onClose: () => void;
  children?: React.ReactNode;
  wide?: boolean;
}> = ({ onClose, children, wide }) => (
  <div
    style={{
      position: "fixed",
      inset: 0,
      zIndex: 1200,
      display: "grid",
      placeItems: "center",
      background: "linear-gradient(rgba(2,6,23,0.6), rgba(2,6,23,0.85))",
      padding: 20,
    }}
  >
    <div
      style={{
        width: wide ? "95vw" : "92vw",
        maxWidth: 1200,
        maxHeight: "92vh",
        overflow: "auto",
        borderRadius: 12,
        background: "linear-gradient(180deg, #0f1114, #0b0c0f)",
        padding: 18,
        boxShadow: "0 24px 80px rgba(0,0,0,0.7)",
        color: "#fff",
      }}
    >
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={onClose}
          style={{
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.06)",
            color: "#fff",
            padding: "8px 10px",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          Close
        </button>
      </div>
      <div style={{ marginTop: 8 }}>{children}</div>
    </div>
  </div>
);

const LockedTeaser: React.FC<{
  onUnlockClick?: () => void;
  title?: string;
  height?: string;
}> = ({ onUnlockClick, title, height }) => (
  <div
    style={{
      position: "relative",
      borderRadius: 12,
      overflow: "hidden",
      background:
        "linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.02))",
      border: "1px solid rgba(255,255,255,0.06)",
      padding: 14,
      minHeight: height ?? 100,
    }}
  >
    <div style={{ filter: "blur(3px)", opacity: 0.55 }}>
      <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 6 }}>
        {title ?? "Pro preview"}
      </div>
      <div
        style={{
          height: 44,
          background: "linear-gradient(90deg,#222,#333)",
          borderRadius: 8,
        }}
      />
      <div style={{ marginTop: 8, opacity: 0.9 }}>
        Upgrade to unlock the full feature and history.
      </div>
    </div>
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "rgba(0,0,0,0.5)",
          padding: 12,
          borderRadius: 10,
          display: "flex",
          gap: 8,
          alignItems: "center",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <Lock size={18} />
        <div style={{ fontWeight: 800 }}>Pro feature</div>
        <button
          onClick={onUnlockClick}
          style={{
            marginLeft: 12,
            background: "linear-gradient(135deg,#7c3aed,#00c2ff)",
            border: "none",
            color: "#fff",
            padding: "8px 10px",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          Upgrade
        </button>
      </div>
    </div>
  </div>
);

// -------------------- Plans Modal (self-contained UI using your Pricing data) --------------------
type Plan = {
  title: string;
  popular: boolean;
  price: number;
  description: string;
  buttonText: string;
  benefits: string[];
};
const PLANS: Plan[] = [
  {
    title: "Free",
    popular: false,
    price: 0,
    description: "Perfect for individuals just starting out.",
    buttonText: "Get Started",
    benefits: [
      "1 Team member",
      "2 GB Storage",
      "Up to 4 pages",
      "Community support",
    ],
  },
  {
    title: "Premium",
    popular: true,
    price: 9,
    description: "Best for small teams who need more power.",
    buttonText: "Start Free Trial",
    benefits: [
      "5 Team members",
      "10 GB Storage",
      "Unlimited pages",
      "Priority support",
      "Advanced analytics",
    ],
  },
  {
    title: "Enterprise",
    popular: false,
    price: 29,
    description: "For larger teams needing full-scale solutions.",
    buttonText: "Contact Us",
    benefits: [
      "Unlimited Team members",
      "100 GB Storage",
      "Custom integrations",
      "Dedicated support",
      "Advanced security",
    ],
  },
];

function PlansModal({
  onClose,
  onChoosePlan,
  currentPlan,
}: {
  onClose: () => void;
  onChoosePlan: (planTitle: string) => void;
  currentPlan?: string | null;
}) {
  return (
    <div style={{ padding: 6 }}>
      <h2 style={{ fontSize: 20, fontWeight: 900 }}>Choose a plan</h2>
      <p style={{ opacity: 0.8 }}>
        Select a plan to unlock Pro features. (No payment integrated — toggles
        are applied.)
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: 12,
          marginTop: 12,
        }}
      >
        {PLANS.map((p) => (
          <div
            key={p.title}
            style={{
              borderRadius: 10,
              border: p.popular
                ? "2px solid #7c3aed"
                : "1px solid rgba(255,255,255,0.06)",
              padding: 12,
              background: p.popular
                ? "linear-gradient(90deg, rgba(124,58,237,0.06), rgba(0,194,255,0.04))"
                : "rgba(255,255,255,0.02)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ fontWeight: 800 }}>{p.title}</div>
              {p.popular && (
                <div style={{ fontSize: 12, color: "#7c3aed" }}>
                  Most popular
                </div>
              )}
            </div>
            <div style={{ marginTop: 8 }}>
              <div style={{ fontSize: 20, fontWeight: 900 }}>
                ${p.price}
                <span style={{ fontSize: 12, opacity: 0.8 }}> /month</span>
              </div>
              <div style={{ opacity: 0.85, marginTop: 6 }}>{p.description}</div>
            </div>
            <div style={{ marginTop: 10 }}>
              <button
                onClick={() => onChoosePlan(p.title)}
                style={{ ...primaryBtn, width: "100%" }}
              >
                {p.buttonText}
              </button>
            </div>
            <hr style={{ margin: "12px 0", opacity: 0.06 }} />
            <div style={{ display: "grid", gap: 6 }}>
              {p.benefits.map((b) => (
                <div
                  key={b}
                  style={{ display: "flex", gap: 8, alignItems: "center" }}
                >
                  <Check size={16} style={{ color: "#22c55e" }} />
                  <div>{b}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 8, fontSize: 12, opacity: 0.8 }}>
              {currentPlan === p.title ? "Current plan" : ""}
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12, textAlign: "right" }}>
        <button onClick={onClose} style={{ ...ghostBtn }}>
          Close
        </button>
      </div>
    </div>
  );
}

// -------------------- Actions Modal --------------------
function ActionsModal({
  onClose,
  onRescanAll,
  onExportAll,
  onClearAll,
  onSave,
}: {
  onClose: () => void;
  onRescanAll: () => void;
  onExportAll: () => void;
  onClearAll: () => void;
  onSave: () => void;
}) {
  return (
    <div style={{ padding: 8, minWidth: 360 }}>
      <h3 style={{ fontWeight: 900 }}>Actions</h3>
      <div style={{ display: "grid", gap: 8, marginTop: 8 }}>
        <button
          style={primaryBtn}
          onClick={() => {
            onRescanAll();
            onClose();
          }}
        >
          Re-scan All Sites
        </button>
        <button
          style={ghostBtn}
          onClick={() => {
            onExportAll();
            onClose();
          }}
        >
          Export All CSV
        </button>
        <button
          style={ghostBtn}
          onClick={() => {
            onSave();
            onClose();
          }}
        >
          Save Store
        </button>
        <button
          style={dangerBtn}
          onClick={() => {
            if (confirm("Clear all sites (local)?")) {
              onClearAll();
              onClose();
            }
          }}
        >
          Clear All Sites
        </button>
      </div>
      <div style={{ marginTop: 12, textAlign: "right" }}>
        <button style={ghostBtn} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

// -------------------- ExpandedSitePanel (inline deep view) --------------------
function ExpandedSitePanel({
  site,
  onClose,
  onToggleIssue,
  onRescan,
  onExport,
  onPrint,
  onSaveChecklist,
  onShare,
  onSetSchedule,
}: {
  site: Site;
  onClose: () => void;
  onToggleIssue: (id: string) => void;
  onRescan: () => void;
  onExport: () => void;
  onPrint: () => void;
  onSaveChecklist: () => void;
  onShare: () => void;
  onSetSchedule: (schedule: string | null) => void;
}) {
  const [schedule, setSchedule] = useState<string>(
    site.settings?.schedule ?? "",
  );
  useEffect(() => setSchedule(site.settings?.schedule ?? ""), [site.settings]);

  return (
    <div
      style={{
        borderRadius: 12,
        padding: 12,
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))",
        border: "1px solid rgba(255,255,255,0.04)",
        boxShadow: "0 12px 40px rgba(0,0,0,0.6)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div style={{ fontSize: 18, fontWeight: 900 }}>
            {site.title ?? site.url}
          </div>
          <div style={{ fontSize: 12, opacity: 0.8 }}>
            Last scanned: {formatDate(site.lastAnalyzed)}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button onClick={onRescan} style={mutedBtn}>
            <RefreshCcw size={14} /> Re-scan
          </button>
          <button onClick={onExport} style={ghostBtn}>
            <DownloadCloud size={14} /> Export CSV
          </button>
          <button onClick={onPrint} style={ghostBtn}>
            Print
          </button>
          <button onClick={onShare} style={ghostBtn}>
            <Share2 size={14} /> Share
          </button>
          <button onClick={onClose} style={ghostBtn}>
            Close
          </button>
        </div>
      </div>

      <div
        style={{
          marginTop: 12,
          display: "grid",
          gridTemplateColumns: "1fr 320px",
          gap: 12,
        }}
      >
        <div style={{ display: "grid", gap: 12 }}>
          <div style={panel}>
            <div style={{ display: "flex", gap: 14 }}>
              <div style={{ width: 260, height: 180 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={(site.scans ?? []).map((p) => ({
                      t: (p.ts ?? "").slice(0, 10),
                      v: p.score ?? 0,
                    }))}
                  >
                    <Tooltip />
                    <XAxis dataKey="t" />
                    <YAxis domain={[0, 100]} />
                    <Line
                      dataKey="v"
                      stroke="#00c2ff"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800 }}>Core Insights</div>
                <div style={{ marginTop: 8 }}>
                  {(site.recommendations ?? []).slice(0, 4).map((r, i) => (
                    <div key={i}>
                      <div style={{ fontWeight: 700 }}>{r.title}</div>
                      <div style={{ opacity: 0.9 }}>{r.detail}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div style={panel}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ fontWeight: 900 }}>
                Checklist — Tasks to improve SEO
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={onExport} style={ghostSmall}>
                  Export CSV
                </button>
                <button onClick={onPrint} style={ghostSmall}>
                  Print
                </button>
              </div>
            </div>
            <div style={{ marginTop: 10 }}>
              <ChecklistBlock
                site={site}
                onToggle={onToggleIssue}
                onSave={onSaveChecklist}
              />
            </div>
          </div>

          <div style={panel}>
            <div style={{ fontWeight: 900 }}>Content Recommendations</div>
            <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
              {(site.recommendations ?? []).map((r, i) => (
                <div
                  key={i}
                  style={{
                    padding: 12,
                    borderRadius: 10,
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.04)",
                  }}
                >
                  <div style={{ fontWeight: 800 }}>{r.title}</div>
                  <div style={{ opacity: 0.9 }}>{r.detail}</div>
                </div>
              ))}
              {!site.recommendations?.length && (
                <div style={{ opacity: 0.8 }}>No recommendations found.</div>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gap: 12 }}>
          <div style={panel}>
            <div style={{ fontWeight: 900 }}>Quick Score</div>
            <div
              style={{
                fontSize: 28,
                fontWeight: 900,
                color: scoreColor(site.latestScore ?? 0),
              }}
            >
              {site.latestScore ?? "—"}
            </div>
            <div style={{ marginTop: 8 }}>
              <ProgressBar value={site.latestScore ?? 0} />
            </div>
          </div>

          <div style={panel}>
            <div style={{ fontWeight: 900 }}>Quick Actions</div>
            <div style={{ display: "grid", gap: 8, marginTop: 10 }}>
              <button style={primaryBtn} onClick={onRescan}>
                Re-run scan
              </button>
              <button style={ghostBtn} onClick={onExport}>
                Export CSV
              </button>
              <button style={ghostBtn} onClick={onPrint}>
                Print report
              </button>
              <button style={ghostBtn} onClick={onShare}>
                Share
              </button>
            </div>

            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 12, opacity: 0.8 }}>Scheduler</div>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <select
                  style={selectStyle}
                  value={schedule ?? ""}
                  onChange={(e) => setSchedule(e.target.value)}
                >
                  <option value="">Disabled</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
                <button
                  style={primarySmall}
                  onClick={() => onSetSchedule(schedule || null)}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>

          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <div style={{ fontWeight: 900 }}>Pro Insights</div>
              <div style={{ fontSize: 12, opacity: 0.7 }}>
                {site.settings?.proEnabled ? "Unlocked" : "Locked"}
              </div>
            </div>

            {!site.settings?.proEnabled ? (
              <>
                <LockedTeaser
                  title="Backlink Profile"
                  onUnlockClick={() => alert("Upgrade flow: open Plans modal")}
                />
                <div style={{ height: 8 }} />
                <LockedTeaser
                  title="Keyword Rank Tracking"
                  onUnlockClick={() => alert("Upgrade flow: open Plans modal")}
                />
              </>
            ) : (
              <>
                <div style={panelSmall}>
                  <div style={{ fontWeight: 800 }}>Backlinks</div>
                  <div style={{ marginTop: 8 }}>
                    ref1.com (120), ref2.com (60)
                  </div>
                </div>
                <div style={{ height: 8 }} />
                <div style={panelSmall}>
                  <div style={{ fontWeight: 800 }}>Keyword Trends</div>
                  <div style={{ marginTop: 8 }}>
                    example keyword ↑ 12 positions
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------- Main Component --------------------
export default function DashboardDeep() {
  const location = useLocation();
  const onboardingData = (location && (location as any).state) || undefined;
  const navigate = useNavigate();

  // account-level pro
  const [isProUser, setIsProUser] = useState<boolean>(() => {
    const v = localStorage.getItem("account_is_pro");
    return v === "1";
  });

  // store
  const [state, setState] = useState<{ sites: Site[] }>(() => getStore());
  useEffect(() => setStore(state), [state]);

  // UI
  const [addingUrl, setAddingUrl] = useState<string>("");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);
  const [viewSite, setViewSite] = useState<Site | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // new modals
  const [showPlansModal, setShowPlansModal] = useState(false);
  const [showActionsModal, setShowActionsModal] = useState(false);

  const schedulerRef = useRef<number | null>(null);

  // helper to get site by id (fresh from state)
  const getSiteById = (id?: string) => state.sites.find((s) => s.id === id);

  // global trend
  const globalTrend = useMemo(() => {
    const map = new Map<string, number[]>();
    state.sites.forEach((s) =>
      (s.scans ?? []).forEach((pt) => {
        const day =
          (pt.ts ?? "").slice(0, 10) || new Date().toISOString().slice(0, 10);
        if (!map.has(day)) map.set(day, []);
        map.get(day)!.push(pt.score ?? 0);
      }),
    );
    return [...map.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([time, vals]) => ({
        time,
        avg: Math.round(vals.reduce((a, b) => a + b, 0) / (vals.length || 1)),
      }));
  }, [state.sites]);

  // seed sample site
  useEffect(() => {
    if (!state.sites.length) {
      const sample: Site = {
        id: uid(),
        url: "https://example.com",
        title: "example.com",
        lastAnalyzed: nowISO(),
        latestScore: 72,
        scans: [{ ts: nowISO(), score: 72 }],
        recommendations: [
          {
            title: "Initial sample rec",
            detail: "Seeded example recommendation.",
          },
        ],
        issues: [
          {
            id: "meta",
            label: "Meta description missing",
            severity: 70,
            category: "On-page",
            fixed: false,
          },
        ],
        settings: { schedule: null, proEnabled: false },
      };
      setState({ sites: [sample] });
      setSelectedSiteId(sample.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // default selected
  useEffect(() => {
    if (!selectedSiteId && state.sites.length)
      setSelectedSiteId(state.sites[0].id);
  }, [state.sites, selectedSiteId]);

  // onboarding integration
  useEffect(() => {
    (async () => {
      try {
        if (onboardingData && onboardingData.website) {
          const url = onboardingData.website;
          const existing = state.sites.find((s) => s.url === url);
          if (!existing) {
            const newSite: Site = {
              id: uid(),
              url,
              title: url.replace(/^https?:\/\//, ""),
              lastAnalyzed: null,
              latestScore: null,
              scans: [],
              recommendations: [],
              issues: [],
              settings: { schedule: null, proEnabled: false },
            };
            setState((prev) => ({ sites: [newSite, ...prev.sites] }));
            setSelectedSiteId(newSite.id);
            setLoadingId(newSite.id);
            try {
              const res = await fakeAnalyze(url);
              setState((prev) => ({
                sites: prev.sites.map((s) =>
                  s.id === newSite.id
                    ? {
                        ...s,
                        lastAnalyzed: nowISO(),
                        latestScore: res.score,
                        scans: [...(s.scans ?? []), res.scan],
                        recommendations: res.recs,
                        issues: res.issues,
                      }
                    : s,
                ),
              }));
              notify("Onboarding analyze complete");
            } catch {
              notify("Onboarding analyze failed — fallback used");
            } finally {
              setLoadingId(null);
            }
          } else {
            // rescan existing
            setLoadingId(existing.id);
            try {
              const res = await fakeAnalyze(url);
              setState((prev) => ({
                sites: prev.sites.map((s) =>
                  s.id === existing.id
                    ? {
                        ...s,
                        lastAnalyzed: nowISO(),
                        latestScore: res.score,
                        scans: [...(s.scans ?? []), res.scan].slice(-240),
                        recommendations: res.recs,
                        issues: res.issues,
                      }
                    : s,
                ),
              }));
              setSelectedSiteId(existing.id);
              notify("Onboarding re-scan complete");
            } catch {
              notify("Onboarding re-scan failed");
            } finally {
              setLoadingId(null);
            }
          }
        }
      } catch (err) {
        console.error("onboarding error", err);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onboardingData]);

  // -------------------- actions --------------------
  const addSite = async () => {
    try {
      const url = addingUrl.trim();
      if (!url) {
        notify("Enter a valid URL");
        return;
      }
      const s: Site = {
        id: uid(),
        url,
        title: url.replace(/^https?:\/\//, "") || url,
        scans: [],
        issues: [],
        recommendations: [],
        settings: { schedule: null, proEnabled: false },
      };
      setState((prev) => ({ sites: [s, ...prev.sites] }));
      setAddingUrl("");
      setSelectedSiteId(s.id);
      notify("Site added — initializing scan");
      setLoadingId(s.id);
      try {
        const res = await fakeAnalyze(url);
        setState((prev) => ({
          sites: prev.sites.map((site) =>
            site.id === s.id
              ? {
                  ...site,
                  lastAnalyzed: nowISO(),
                  latestScore: res.score,
                  scans: [...(site.scans ?? []), res.scan],
                  recommendations: res.recs,
                  issues: res.issues,
                }
              : site,
          ),
        }));
        notify("Initial scan complete");
      } catch {
        // fallback
        setState((prev) => ({
          sites: prev.sites.map((site) =>
            site.id === s.id
              ? {
                  ...site,
                  lastAnalyzed: nowISO(),
                  latestScore: 50,
                  scans: [...(site.scans ?? []), { ts: nowISO(), score: 50 }],
                  recommendations: [
                    {
                      title: "Fallback recommendation",
                      detail: "Scan failed — showing fallback",
                    },
                  ],
                  issues: [],
                }
              : site,
          ),
        }));
        notify("Scan failed — fallback data applied");
      } finally {
        setLoadingId(null);
      }
    } catch (err) {
      console.error("addSite error", err);
      notify("Failed to add site");
    }
  };

  const triggerRescan = async (site: Site) => {
    try {
      setLoadingId(site.id);
      const res = await fakeAnalyze(site.url);
      setState((prev) => ({
        sites: prev.sites.map((s) =>
          s.id === site.id
            ? {
                ...s,
                lastAnalyzed: nowISO(),
                latestScore: res.score,
                scans: [...(s.scans ?? []), res.scan].slice(-240),
                recommendations: res.recs,
                issues: res.issues,
              }
            : s,
        ),
      }));
      notify(`Re-scan done for ${site.title ?? site.url}`);
    } catch (err) {
      console.error("rescan error", err);
      notify("Re-scan failed");
    } finally {
      setLoadingId(null);
    }
  };

  const removeSite = (id: string) => {
    try {
      if (!confirm("Remove site from dashboard?")) return;
      setState((prev) => ({ sites: prev.sites.filter((s) => s.id !== id) }));
      notify("Site removed");
      if (selectedSiteId === id) {
        const next = state.sites.find((s) => s.id !== id);
        setSelectedSiteId(next ? next.id : null);
      }
    } catch (err) {
      console.error("removeSite", err);
      notify("Remove failed");
    }
  };

  const openView = (site: Site) => {
    setSelectedSiteId(site.id);
    setViewSite(site);
  };

  const closeInlineView = () => setSelectedSiteId(null);

  const toggleIssueFixed = (siteId: string, issueId: string) => {
    setState((prev) => ({
      sites: prev.sites.map((s) => {
        if (s.id !== siteId) return s;
        const issues = [...(s.issues ?? [])];
        const idx = issues.findIndex((i) => i.id === issueId);
        if (idx >= 0)
          issues[idx] = { ...issues[idx], fixed: !issues[idx].fixed };
        else
          issues.push({
            id: issueId,
            label: issueId,
            severity: 40,
            category: "General",
            fixed: true,
          });
        return { ...s, issues };
      }),
    }));
  };

  const addChecklistToDashboard = (siteId: string, issueIds: string[]) => {
    notify("Checklist saved to dashboard");
  };

  const exportSiteCSV = (site?: Site) => {
    try {
      const rows = site
        ? (site.scans ?? []).map((x) => ({
            site: site.url,
            ts: x.ts,
            score: x.score,
          }))
        : state.sites.flatMap((s) =>
            (s.scans ?? []).map((x) => ({
              site: s.url,
              ts: x.ts,
              score: x.score,
            })),
          );
      const csv = toCSV(rows);
      if (!csv) {
        notify("No scan data to export");
        return;
      }
      const blob = new Blob([csv], { type: "text/csv" });
      const href = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = href;
      a.download = `seotron_export_${site ? (site.title ?? site.url) : "all"}.csv`;
      a.click();
      URL.revokeObjectURL(href);
      notify("CSV exported");
    } catch (err) {
      console.error("export error", err);
      notify("Export failed");
    }
  };

  const printReport = (site?: Site) => {
    try {
      const win = window.open("", "_blank");
      if (!win) {
        notify("Unable to open print window (popup blocked)");
        return;
      }
      const html = `<html><head><title>SEO Report - ${site?.url ?? "All Sites"}</title></head><body style="font-family: Arial; padding:20px;"><h1>SEO Report - ${site?.url ?? "All Sites"}</h1><pre>${JSON.stringify(site ?? state.sites, null, 2)}</pre></body></html>`;
      win.document.write(html);
      win.document.close();
      win.print();
      notify("Print dialog opened");
    } catch (err) {
      console.error("print error", err);
      notify("Print failed");
    }
  };

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // per-site share
  const shareSite = async (site?: Site) => {
    try {
      if (!site) {
        notify("No site to share");
        return;
      }
      const text = site.url;
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        notify("Site URL copied to clipboard");
      } else {
        const ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
        notify("Site URL copied (fallback)");
      }
    } catch (err) {
      console.error("share error", err);
      notify("Share failed");
    }
  };

  // per-site schedule setter
  const setScheduleForSite = (siteId: string, schedule: string | null) => {
    setState((prev) => ({
      sites: prev.sites.map((s) =>
        s.id === siteId
          ? { ...s, settings: { ...(s.settings ?? {}), schedule } }
          : s,
      ),
    }));
    notify(
      schedule ? `Scheduler set to ${schedule}` : "Scheduler disabled for site",
    );
  };

  // -------------------- Plans & Pro logic --------------------
  const openPlans = () => setShowPlansModal(true);
  const closePlans = () => setShowPlansModal(false);

  const choosePlan = (planTitle: string) => {
    // apply account-level pro for Premium/Enterprise, and enable per-site pro for selected site if any
    if (planTitle === "Premium" || planTitle === "Enterprise") {
      setIsProUser(true);
      localStorage.setItem("account_is_pro", "1");
      if (selectedSiteId) {
        setState((prev) => ({
          sites: prev.sites.map((s) =>
            s.id === selectedSiteId
              ? { ...s, settings: { ...(s.settings ?? {}), proEnabled: true } }
              : s,
          ),
        }));
        notify(
          `${planTitle} selected — account & selected site upgraded (dev toggle)`,
        );
      } else {
        notify(`${planTitle} selected — account upgraded (dev toggle)`);
      }
    } else {
      // Free plan – remove account pro
      setIsProUser(false);
      localStorage.removeItem("account_is_pro");
      notify("Free plan selected");
    }
    setShowPlansModal(false);
  };

  // Pro on/off: show/hide features panel (we also set account level)
  const togglePro = () => {
    setIsProUser((p) => {
      const next = !p;
      if (next) localStorage.setItem("account_is_pro", "1");
      else localStorage.removeItem("account_is_pro");
      notify(
        next
          ? "Account-level Pro enabled (dev toggle)"
          : "Account-level Pro disabled (dev toggle)",
      );
      return next;
    });
  };

  // -------------------- Scheduler logic --------------------
  // scheduler runs every minute while dashboard is open and triggers scans for sites whose schedule is due
  useEffect(() => {
    // cleanup previous
    if (schedulerRef.current) {
      window.clearInterval(schedulerRef.current);
      schedulerRef.current = null;
    }
    // run check function immediately then every 60s
    const checkAndRun = async () => {
      const now = Date.now();
      for (const s of state.sites) {
        const sched = s.settings?.schedule;
        if (!sched) continue;
        const last = s.lastAnalyzed ? new Date(s.lastAnalyzed).getTime() : 0;
        let threshold = 0;
        if (sched === "daily") threshold = 24 * 60 * 60 * 1000;
        else if (sched === "weekly") threshold = 7 * 24 * 60 * 60 * 1000;
        else if (sched === "monthly") threshold = 30 * 24 * 60 * 60 * 1000;
        // if never scanned, or last older than threshold, trigger
        if (!s.lastAnalyzed || now - last >= threshold) {
          // run rescan but avoid overlapping by quick mark
          setLoadingId(s.id);
          try {
            const res = await fakeAnalyze(s.url);
            setState((prev) => ({
              sites: prev.sites.map((si) =>
                si.id === s.id
                  ? {
                      ...si,
                      lastAnalyzed: nowISO(),
                      latestScore: res.score,
                      scans: [...(si.scans ?? []), res.scan].slice(-240),
                      recommendations: res.recs,
                      issues: res.issues,
                    }
                  : si,
              ),
            }));
            notify(`Scheduled scan complete: ${s.title ?? s.url}`);
          } catch (err) {
            console.error("scheduled scan error", err);
            notify(`Scheduled scan failed: ${s.title ?? s.url}`);
          } finally {
            setLoadingId(null);
          }
        }
      }
    };
    // start interval
    checkAndRun();
    const id = window.setInterval(checkAndRun, 60 * 1000); // every minute
    schedulerRef.current = id;
    return () => {
      if (schedulerRef.current) {
        window.clearInterval(schedulerRef.current);
        schedulerRef.current = null;
      }
    };
  }, [state.sites]); // re-evaluate when sites change

  // -------------------- Actions modal handlers --------------------
  const openActions = () => setShowActionsModal(true);
  const closeActions = () => setShowActionsModal(false);
  const rescanAll = async () => {
    for (const s of state.sites) {
      await triggerRescan(s);
    }
    notify("Batch rescan finished");
  };
  const exportAll = () => exportSiteCSV(undefined);
  const clearAll = () => {
    setState({ sites: [] });
    setSelectedSiteId(null);
    notify("All sites cleared (local)");
  };
  const saveStore = () => {
    setStore(state);
    notify("Saved to localStorage");
  };

  // -------------------- Logout --------------------
  const logout = () => {
    if (!confirm("Log out?")) return;
    // ✨ FIX: Changed "user" to "token" to match your App.tsx
    localStorage.removeItem("token");
    localStorage.removeItem("account_is_pro");
    setIsProUser(false);
    navigate("/login");
  };

  // -------------------- AI Summary --------------------
  const aiSummary = (site?: Site) => {
    const recs = site?.recommendations ?? [];
    if (!recs.length) return "No specific recommendations generated.";
    return recs
      .slice(0, 6)
      .map((r, i) => `${i + 1}. ${r.title} — ${r.detail}`)
      .join(" ");
  };

  // -------------------- render --------------------
  return (
    <div
      style={{
        ...rootStyle,
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <div style={bgStyle} aria-hidden />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* header */}
        <div
          style={{
            padding: 18,
            borderBottom: "1px solid rgba(255,255,255,0.03)",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <Activity color="#00c2ff" size={24} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 20, fontWeight: 900 }}>
              SEOtron Dashboard — Deep
            </div>
            <div style={{ fontSize: 12, opacity: 0.8 }}>
              Full-screen · multi-site tabs · scheduler · pro features
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button onClick={togglePro} style={ghostBtn}>
              {isProUser ? <Unlock /> : <Lock />}{" "}
              {isProUser ? "Pro: ON" : "Pro: OFF"}
            </button>
            <button onClick={() => exportSiteCSV(undefined)} style={ghostBtn}>
              <DownloadCloud size={14} /> Export All
            </button>
            <button onClick={openActions} style={ghostBtn}>
              <Zap size={14} /> Actions
            </button>
            <button
              onClick={() => {
                setShowPlansModal(true);
              }}
              style={primaryBtn}
            >
              Upgrade
            </button>
            <button onClick={logout} style={ghostBtn}>
              Logout
            </button>
          </div>
        </div>

        {/* Main area */}
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          {/* left */}
          <div
            style={{ flex: 1, height: "100%", overflow: "auto", padding: 20 }}
          >
            {/* controls */}
            <div
              style={{
                display: "flex",
                gap: 12,
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <input
                value={addingUrl}
                onChange={(e) => setAddingUrl(e.target.value)}
                placeholder="https://example.com"
                style={inputStyle}
              />
              <button onClick={addSite} style={primaryBtn}>
                {loadingId ? "Working..." : "Add & Scan"}
              </button>
              <button
                onClick={() => {
                  setStore(state);
                  notify("Saved to localStorage");
                }}
                style={ghostBtn}
              >
                Save
              </button>
              <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                <div style={{ ...cardInline, minWidth: 160 }}>
                  <div style={{ fontSize: 12, opacity: 0.85 }}>
                    Global Health
                  </div>
                  <div style={{ fontWeight: 900, fontSize: 16 }}>
                    {globalTrend.length
                      ? `${globalTrend[globalTrend.length - 1].avg}/100`
                      : "—"}
                  </div>
                </div>
                <div style={{ ...cardInline, width: 120 }}>
                  <div style={{ fontSize: 12, opacity: 0.85 }}>Sites</div>
                  <div style={{ fontWeight: 900, fontSize: 16 }}>
                    {state.sites.length}
                  </div>
                </div>
              </div>
            </div>

            {/* tabs */}
            <div
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                marginBottom: 14,
                flexWrap: "wrap",
              }}
            >
              {state.sites.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedSiteId(s.id)}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 10,
                    border:
                      selectedSiteId === s.id
                        ? "1px solid rgba(124,58,237,0.9)"
                        : "1px solid rgba(255,255,255,0.06)",
                    background:
                      selectedSiteId === s.id
                        ? "linear-gradient(135deg,#7c3aed,#00c2ff)"
                        : "rgba(255,255,255,0.02)",
                    color: "#fff",
                    cursor: "pointer",
                    fontWeight: selectedSiteId === s.id ? 800 : 600,
                  }}
                >
                  {s.title ?? s.url}
                </button>
              ))}
              <div style={{ width: 8 }} />
              <div style={{ fontSize: 12, opacity: 0.7 }}>
                Click a site tab to view its expanded panel above the list
              </div>
            </div>

            {/* inline expanded panel */}
            <div style={{ marginBottom: 16 }}>
              {selectedSiteId &&
                (() => {
                  const s = getSiteById(selectedSiteId);
                  if (!s)
                    return (
                      <div
                        style={{
                          padding: 12,
                          borderRadius: 8,
                          background: "rgba(255,255,255,0.02)",
                        }}
                      >
                        Selected site not found
                      </div>
                    );
                  return (
                    <ExpandedSitePanel
                      site={s}
                      onClose={() => setSelectedSiteId(null)}
                      onToggleIssue={(i) => toggleIssueFixed(s.id, i)}
                      onRescan={() => triggerRescan(s)}
                      onExport={() => exportSiteCSV(s)}
                      onPrint={() => printReport(s)}
                      onSaveChecklist={() =>
                        addChecklistToDashboard(
                          s.id,
                          (s.issues ?? [])
                            .filter((i) => i.fixed)
                            .map((i) => i.id),
                        )
                      }
                      onShare={() => shareSite(s)}
                      onSetSchedule={(sch) => setScheduleForSite(s.id, sch)}
                    />
                  );
                })()}
            </div>

            {/* site list */}
            <div style={{ display: "grid", gap: 12 }}>
              {state.sites.map((site) => (
                <div key={site.id} style={siteCardStyle}>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <div>
                      <div style={{ fontWeight: 800 }}>
                        {site.title ?? site.url}
                      </div>
                      <div style={{ fontSize: 12, opacity: 0.8 }}>
                        {site.url}
                      </div>
                      <div style={{ fontSize: 11, opacity: 0.7 }}>
                        {site.settings?.schedule
                          ? `Schedule: ${site.settings.schedule}`
                          : "No schedule"}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div
                        style={{
                          fontWeight: 900,
                          fontSize: 20,
                          color: scoreColor(site.latestScore ?? 0),
                        }}
                      >
                        {site.latestScore ?? "—"}
                      </div>
                      <div style={{ fontSize: 12, opacity: 0.75 }}>
                        {(site.scans ?? []).length} scans
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: 10, height: 80 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={(site.scans ?? []).map((s) => ({
                          t: (s.ts ?? "").slice(0, 10),
                          v: s.score ?? 0,
                        }))}
                      >
                        <Tooltip />
                        <XAxis dataKey="t" hide />
                        <YAxis domain={[0, 100]} hide />
                        <Line
                          dataKey="v"
                          stroke="#7c3aed"
                          dot={false}
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                    <button onClick={() => openView(site)} style={viewBtn}>
                      Open
                    </button>
                    <button
                      onClick={() => triggerRescan(site)}
                      style={mutedBtn}
                    >
                      <RefreshCcw size={14} /> Re-scan
                    </button>
                    <button
                      onClick={() => exportSiteCSV(site)}
                      style={ghostBtn}
                    >
                      CSV
                    </button>
                    <button onClick={() => shareSite(site)} style={ghostBtn}>
                      <Share2 size={14} /> Share
                    </button>
                    <button
                      onClick={() => removeSite(site.id)}
                      style={dangerBtn}
                    >
                      Remove
                    </button>
                    <div
                      style={{
                        marginLeft: "auto",
                        display: "flex",
                        gap: 8,
                        alignItems: "center",
                      }}
                    >
                      <div style={{ fontSize: 12, opacity: 0.75 }}>Pro</div>
                      <button
                        onClick={() => {
                          setState((prev) => ({
                            sites: prev.sites.map((s) =>
                              s.id === site.id
                                ? {
                                    ...s,
                                    settings: {
                                      ...(s.settings ?? {}),
                                      proEnabled: !s.settings?.proEnabled,
                                    },
                                  }
                                : s,
                            ),
                          }));
                          notify(
                            site.settings?.proEnabled
                              ? "Site Pro disabled (dev toggle)"
                              : "Site Pro enabled (dev toggle)",
                          );
                        }}
                        style={ghostBtn}
                      >
                        {site.settings?.proEnabled ? "ON" : "OFF"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* right column */}
          <div
            style={{
              width: 380,
              height: "100%",
              overflow: "auto",
              padding: 20,
              borderLeft: "1px solid rgba(255,255,255,0.02)",
            }}
          >
            <div style={cardHover}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ fontWeight: 900 }}>Quick Global Trend</div>
                <div style={{ fontSize: 12, opacity: 0.8 }}>
                  {globalTrend.length} points
                </div>
              </div>
              <div style={{ height: 120, marginTop: 10 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={globalTrend}>
                    <XAxis dataKey="time" hide />
                    <YAxis domain={[0, 100]} hide />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="avg"
                      stroke="#7c3aed"
                      fill="rgba(124,58,237,0.18)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div style={{ height: 12 }} />

            <div style={cardHover}>
              <div style={{ fontWeight: 900 }}>AI Summary (selected)</div>
              <div style={{ marginTop: 8, minHeight: 80 }}>
                {selectedSiteId
                  ? aiSummary(getSiteById(selectedSiteId) ?? undefined)
                  : "Select a site tab to view AI summary."}
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <button
                  style={ghostBtn}
                  onClick={() =>
                    selectedSiteId
                      ? exportSiteCSV(getSiteById(selectedSiteId) ?? undefined)
                      : notify("Select a site")
                  }
                >
                  Export
                </button>
                <button
                  style={primaryBtn}
                  onClick={() => notify("Ask AI (placeholder)")}
                >
                  Ask AI
                </button>
              </div>
            </div>

            <div style={{ height: 12 }} />

            <div style={cardHover}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ fontWeight: 900 }}>Pro Features</div>
                <div style={{ fontSize: 12, opacity: 0.8 }}>
                  {isProUser ? "Account: Unlocked" : "Account: Locked"}
                </div>
              </div>
              <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
                {[
                  "Backlink Explorer",
                  "Keyword Rank Tracking",
                  "SERP Snapshot",
                  "Competitor Gap",
                  "PageSpeed Labs",
                  "AI Content Assist",
                ].map((f) => (
                  <div
                    key={f}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: 8,
                      borderRadius: 8,
                      background: "rgba(255,255,255,0.02)",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700 }}>{f}</div>
                      <div style={{ fontSize: 12, opacity: 0.75 }}>
                        Deep insights & history
                      </div>
                    </div>
                    {!isProUser ? (
                      <button
                        onClick={() => setShowPlansModal(true)}
                        style={ghostSmall}
                      >
                        Unlock
                      </button>
                    ) : (
                      <button
                        onClick={() => notify(`${f} opened (placeholder)`)}
                        style={primarySmall}
                      >
                        Open
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ height: 12 }} />

            <div style={cardHover}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ fontWeight: 900 }}>Quick Actions</div>
              </div>
              <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
                <button
                  style={primaryBtn}
                  onClick={() => {
                    (async () => {
                      for (const s of state.sites) await triggerRescan(s);
                      notify("Batch re-scan finished");
                    })();
                  }}
                >
                  Re-scan All
                </button>
                <button
                  style={ghostBtn}
                  onClick={() => {
                    setState({ sites: [] });
                    setSelectedSiteId(null);
                    notify("All sites cleared (local)");
                  }}
                >
                  Clear All
                </button>
                <button
                  style={ghostBtn}
                  onClick={() => notify("Open settings (placeholder)")}
                >
                  Settings
                </button>
              </div>
            </div>

            <div style={{ height: 12 }} />

            <div style={{ textAlign: "center", opacity: 0.7, fontSize: 12 }}>
              Tip: Click a site tab to view its expanded panel above. Scheduler
              runs while this page is open.
            </div>
          </div>
        </div>
      </div>

      {/* Plans modal */}
      {showPlansModal && (
        <Modal onClose={() => setShowPlansModal(false)} wide>
          <PlansModal
            onClose={() => setShowPlansModal(false)}
            onChoosePlan={choosePlan}
            currentPlan={isProUser ? "Premium/Enterprise" : "Free"}
          />
        </Modal>
      )}

      {/* Actions modal */}
      {showActionsModal && (
        <Modal onClose={closeActions}>
          <ActionsModal
            onClose={closeActions}
            onRescanAll={rescanAll}
            onExportAll={exportAll}
            onClearAll={clearAll}
            onSave={saveStore}
          />
        </Modal>
      )}

      {/* toast */}
      {toast && <div style={toastStyle}>{toast}</div>}
    </div>
  );
}

// -------------------- ChecklistBlock --------------------
function ChecklistBlock({
  site,
  onToggle,
  onSave,
}: {
  site: Site;
  onToggle: (issueId: string) => void;
  onSave: () => void;
}) {
  const items: Issue[] = useMemo(() => {
    const base = site.issues ?? [];
    const synth: Issue[] = [
      {
        id: "meta",
        label: "Meta description quality",
        severity: 60,
        category: "On-page",
        fixed: false,
      },
      {
        id: "title",
        label: "Title tag presence & length",
        severity: 50,
        category: "On-page",
        fixed: false,
      },
      {
        id: "content_depth",
        label: "Content depth (word count)",
        severity: 55,
        category: "Content",
        fixed: false,
      },
      {
        id: "h1",
        label: "Heading (H1) usage",
        severity: 45,
        category: "Structure",
        fixed: false,
      },
      {
        id: "alt",
        label: "Image alt text coverage",
        severity: 40,
        category: "Accessibility",
        fixed: false,
      },
      {
        id: "structured",
        label: "Structured data (schema)",
        severity: 35,
        category: "Technical",
        fixed: false,
      },
    ];
    const presentIds = new Set(base.map((b) => b.id));
    const merged = [...base, ...synth.filter((s) => !presentIds.has(s.id))];
    merged.sort((a, b) => (b.severity ?? 0) - (a.severity ?? 0));
    return merged;
  }, [site.issues]);

  const doneCount = items.filter((i) => i.fixed).length;
  const scoreEstimate = Math.round((doneCount / (items.length || 1)) * 100);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ fontWeight: 800 }}>Progress</div>
        <div style={{ fontSize: 12, opacity: 0.8 }}>
          {doneCount}/{items.length} tasks
        </div>
      </div>
      <div style={{ marginTop: 8 }}>
        <ProgressBar value={scoreEstimate} />
      </div>

      <div style={{ marginTop: 12, maxHeight: 300, overflow: "auto" }}>
        {items.map((it) => (
          <div
            key={it.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 0",
              borderBottom: "1px dashed rgba(255,255,255,0.03)",
            }}
          >
            <div>
              <div style={{ fontWeight: 700 }}>{it.label}</div>
              <div style={{ fontSize: 12, opacity: 0.8 }}>
                {it.category} • Severity {it.severity ?? "—"}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ minWidth: 120 }}>
                <div style={{ fontSize: 12, opacity: 0.8 }}>Impact</div>
                <div style={{ fontWeight: 800 }}>{it.severity ?? 40}/100</div>
              </div>
              <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  type="checkbox"
                  checked={!!it.fixed}
                  onChange={() => onToggle(it.id)}
                />
                <span style={{ fontSize: 12 }}>Mark Fixed</span>
              </label>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 8,
          marginTop: 12,
        }}
      >
        <button onClick={onSave} style={primarySmall}>
          Save checklist
        </button>
        <button
          onClick={() => alert("Export checklist (placeholder)")}
          style={ghostSmall}
        >
          Export
        </button>
      </div>
    </div>
  );
}

// -------------------- styles --------------------
const rootStyle: React.CSSProperties = {
  minHeight: "100vh",
  position: "relative",
  fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Arial",
  color: "#e6eef8",
  background: "#0b0c0f",
};

const bgStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 0,
  background:
    "radial-gradient(55vw 55vw at 18% 78%, rgba(255,0,92,0.22), transparent 60%)," +
    "radial-gradient(45vw 45vw at 82% 22%, rgba(0,255,224,0.18), transparent 55%)," +
    "radial-gradient(70vw 70vw at 50% 45%, rgba(120,80,255,0.12), transparent 60%)",
  pointerEvents: "none",
};

const inputStyle: React.CSSProperties = {
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,0.06)",
  background: "rgba(255,255,255,0.02)",
  color: "#fff",
  minWidth: 360,
  outline: "none",
};

const primaryBtn: React.CSSProperties = {
  background: "linear-gradient(135deg,#7c3aed,#00c2ff)",
  border: "none",
  padding: "10px 12px",
  borderRadius: 10,
  color: "#fff",
  fontWeight: 800,
  cursor: "pointer",
};

const ghostBtn: React.CSSProperties = {
  background: "rgba(255,255,255,0.02)",
  border: "1px solid rgba(255,255,255,0.06)",
  padding: "8px 10px",
  borderRadius: 10,
  color: "#fff",
  cursor: "pointer",
};

const mutedBtn: React.CSSProperties = {
  background: "transparent",
  border: "1px solid rgba(255,255,255,0.04)",
  padding: "8px 10px",
  borderRadius: 8,
  color: "#fff",
  cursor: "pointer",
};

const dangerBtn: React.CSSProperties = {
  background: "#ef4444",
  border: "none",
  padding: "8px 10px",
  borderRadius: 8,
  color: "#fff",
  cursor: "pointer",
};

const cardInline: React.CSSProperties = {
  background: "rgba(255,255,255,0.02)",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: 10,
  padding: 10,
};

const siteCardStyle: React.CSSProperties = {
  background:
    "linear-gradient(135deg, rgba(255,255,255,0.02), rgba(255,255,255,0.03))",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: 12,
  padding: 12,
  boxShadow: "0 10px 24px rgba(2,6,23,0.6)",
};

const cardHover: React.CSSProperties = {
  background:
    "linear-gradient(135deg, rgba(255,255,255,0.02), rgba(255,255,255,0.03))",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: 12,
  padding: 12,
  boxShadow: "0 8px 20px rgba(0,0,0,0.5)",
};

const panel: React.CSSProperties = {
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))",
  border: "1px solid rgba(255,255,255,0.04)",
  padding: 12,
  borderRadius: 10,
};

const panelSmall: React.CSSProperties = {
  background: "rgba(255,255,255,0.02)",
  padding: 10,
  borderRadius: 8,
  border: "1px solid rgba(255,255,255,0.04)",
};

const viewBtn: React.CSSProperties = {
  background: "linear-gradient(135deg,#00c2ff,#7c3aed)",
  border: "none",
  padding: "10px 12px",
  borderRadius: 8,
  color: "#fff",
  cursor: "pointer",
};

const toastStyle: React.CSSProperties = {
  position: "fixed",
  right: 20,
  bottom: 20,
  background: "linear-gradient(135deg,#7c3aed,#00c2ff)",
  padding: "10px 14px",
  borderRadius: 10,
  color: "#fff",
  zIndex: 999,
};

const ghostSmall: React.CSSProperties = {
  ...ghostBtn,
  padding: "8px 10px",
  fontSize: 13,
};
const primarySmall: React.CSSProperties = {
  ...primaryBtn,
  padding: "8px 10px",
  fontSize: 13,
};
const selectStyle: React.CSSProperties = {
  padding: 8,
  borderRadius: 8,
  border: "1px solid rgba(255,255,255,0.06)",
  background: "rgba(255,255,255,0.02)",
  color: "#fff",
};
const smallStat: React.CSSProperties = {
  background: "rgba(255,255,255,0.02)",
  padding: 10,
  borderRadius: 8,
  textAlign: "center",
};

// -------------------- helpers used in styles --------------------
function scoreColor(s: number | undefined | null) {
  const v = s ?? 0;
  if (v < 40) return "#ef4444";
  if (v < 75) return "#f59e0b";
  return "#22c55e";
}

const ProgressBar: React.FC<{ value: number; height?: number }> = ({
  value,
  height = 10,
}) => (
  <div
    style={{
      width: "100%",
      background: "rgba(255,255,255,0.06)",
      borderRadius: height,
      overflow: "hidden",
    }}
  >
    <div
      style={{
        height,
        width: `${clamp(value, 0, 100)}%`,
        background: value < 40 ? "#ef4444" : value < 75 ? "#f59e0b" : "#22c55e",
        transition: "width 500ms ease",
      }}
    />
  </div>
);
