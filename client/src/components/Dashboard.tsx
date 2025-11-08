// DashboardDeep.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
    ResponsiveContainer, LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip,
    PieChart, Pie, Cell, CartesianGrid, Legend, BarChart, Bar
} from "recharts";
import { Activity, Sun, Moon, Lock, Unlock, FileText, DownloadCloud, RefreshCcw } from "lucide-react";
import { useLocation } from "react-router-dom";

/**
 * SEOtron — Deep Dashboard (inline styles, pro-lock logic included)
 *
 * - Full "View" modal with rich SEO Deep View (Overview, Checklist, Content, Technical, Pro)
 * - Checklist auto-populated per scan + persistent "mark fixed"
 * - Pro features are visible as blurred teasers with lock overlay (isProUser controls unlock)
 * - Export/print report, CSV export, AI summary generator
 * - Inline styles only, localStorage persistence
 *
 * Drop-in file. Replace or wire backend API calls where TODO comments exist.
 */

// -------------------- Types --------------------
type ScanPoint = { ts: string; score: number };
type Recommendation = { title: string; detail: string };
type Issue = { id: string; label: string; severity?: number; category?: string; fixed?: boolean };
type Site = {
    id: string;
    url: string;
    title?: string;
    lastAnalyzed?: string;
    latestScore?: number;
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
const setStore = (s: { sites: Site[] }) => localStorage.setItem(STORAGE_KEY, JSON.stringify(s));

// -------------------- Helpers --------------------
const uid = (n = 6) => Math.random().toString(36).slice(2, 2 + n);
const nowISO = () => new Date().toISOString();
const clamp = (v: number, a = 0, b = 100) => Math.max(a, Math.min(b, v));
const formatDate = (iso?: string) => (iso ? new Date(iso).toLocaleString() : "—");
const toCSV = (rows: Record<string, any>[]) => {
    if (!rows.length) return "";
    const keys = Object.keys(rows[0]);
    return [keys.join(","), ...rows.map(r => keys.map(k => JSON.stringify(r[k] ?? "")).join(","))].join("\n");
};

// -------------------- Fake analyzer (placeholder) --------------------
async function fakeAnalyze(url: string) {
    await new Promise(r => setTimeout(r, 600));
    const score = Math.round(25 + Math.random() * 70);
    const scan = { ts: new Date().toISOString(), score };
    const recs: Recommendation[] = [
        { title: "Optimize meta description", detail: "Add 150–160 char meta description with call-to-action." },
        { title: "Compress hero image", detail: "Use WebP/AVIF and lazy-load offscreen images." },
        { title: "Add H1 and structured headings", detail: "Ensure single H1 and clear H2/H3 hierarchy." },
    ];
    const issues: Issue[] = [
        { id: "meta", label: "Meta description missing", severity: 70, category: "On-page", fixed: false },
        { id: "images_alt", label: "Images missing alt text", severity: 45, category: "Accessibility", fixed: false },
        { id: "broken", label: "Broken links detected", severity: 60, category: "Technical", fixed: false },
    ];
    return { score, scan, recs, issues };
}

// -------------------- Small UI parts --------------------
const badge = (text: string) => ({
    padding: "6px 8px",
    borderRadius: 8,
    background: "rgba(255,255,255,0.04)",
    fontSize: 12,
    display: "inline-block",
    color: "white",
});

// modal
const Modal: React.FC<{ onClose: () => void; children?: React.ReactNode; wide?: boolean }> = ({ onClose, children, wide }) => (
    <div style={{
        position: "fixed", inset: 0, zIndex: 1200, display: "grid", placeItems: "center",
        background: "linear-gradient(rgba(2,6,23,0.6), rgba(2,6,23,0.85))", padding: 20
    }}>
        <div style={{
            width: wide ? "92vw" : "88vw", maxWidth: 1200, maxHeight: "92vh", overflow: "auto",
            borderRadius: 12, background: "linear-gradient(180deg, #0f1114, #0b0c0f)", padding: 18,
            boxShadow: "0 24px 80px rgba(0,0,0,0.7)", color: "#fff"
        }}>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button onClick={onClose} style={{
                    background: "transparent", border: "1px solid rgba(255,255,255,0.06)",
                    color: "#fff", padding: "8px 10px", borderRadius: 8, cursor: "pointer"
                }}>Close</button>
            </div>
            <div style={{ marginTop: 8 }}>{children}</div>
        </div>
    </div>
);

// locked pro teaser card
const LockedTeaser: React.FC<{ onUnlockClick?: () => void; title?: string; height?: string }> = ({ onUnlockClick, title, height }) => (
    <div style={{
        position: "relative",
        borderRadius: 12,
        overflow: "hidden",
        background: "linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.02))",
        border: "1px solid rgba(255,255,255,0.06)",
        padding: 14,
        minHeight: height ?? 120,
        filter: "blur(0px)"
    }}>
        <div style={{ filter: "blur(3px)", opacity: 0.55 }}>
            <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 6 }}>{title ?? "Pro feature preview"}</div>
            <div style={{ height: 60, background: "linear-gradient(90deg,#222,#333)", borderRadius: 8 }} />
            <div style={{ marginTop: 8, opacity: 0.9 }}>Full backlink profile, anchor distribution, and competitor gaps.</div>
        </div>
        <div style={{
            position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center"
        }}>
            <div style={{
                background: "rgba(0,0,0,0.5)", padding: 12, borderRadius: 10, display: "flex", gap: 8, alignItems: "center",
                border: "1px solid rgba(255,255,255,0.06)"
            }}>
                <Lock size={18} />
                <div style={{ fontWeight: 800 }}>Pro feature</div>
                <button onClick={onUnlockClick} style={{
                    marginLeft: 12, background: "linear-gradient(135deg,#7c3aed,#00c2ff)", border: "none", color: "#fff",
                    padding: "8px 10px", borderRadius: 8, cursor: "pointer"
                }}>Upgrade</button>
            </div>
        </div>
    </div>
);

// progress bar
const ProgressBar: React.FC<{ value: number; height?: number }> = ({ value, height = 10 }) => (
    <div style={{
        width: "100%", background: "rgba(255,255,255,0.06)", borderRadius: height, overflow: "hidden"
    }}>
        <div style={{
            height, width: `${clamp(value, 0, 100)}%`,
            background: value < 40 ? "#ef4444" : value < 75 ? "#f59e0b" : "#22c55e",
            transition: "width 500ms ease"
        }} />
    </div>
);

// -------------------- Main Component --------------------
export default function DashboardDeep() {
    // use onboarding state if provided
    const location = useLocation();
    const onboardingData = (location && (location as any).state) || undefined;

    // pro toggle - control unlock (replace with real auth / subscription check later)
    const [isProUser, setIsProUser] = useState<boolean>(false);

    // store
    const [state, setState] = useState<{ sites: Site[] }>(() => getStore());
    useEffect(() => setStore(state), [state]);

    // UI state
    const [addingUrl, setAddingUrl] = useState<string>("");
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [viewSite, setViewSite] = useState<Site | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [toast, setToast] = useState<string | null>(null);

    // global derived
    const globalTrend = useMemo(() => {
        const map = new Map<string, number[]>();
        state.sites.forEach(s => (s.scans ?? []).forEach(pt => {
            const day = pt.ts.slice(0, 10);
            if (!map.has(day)) map.set(day, []);
            map.get(day)!.push(pt.score);
        }));
        const arr = [...map.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([time, vals]) => ({ time, avg: Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) }));
        return arr;
    }, [state.sites]);

    useEffect(() => {
        // sample seed site for first run
        if (!state.sites.length) {
            const sample: Site = {
                id: uid(),
                url: "https://example.com",
                title: "example.com",
                lastAnalyzed: undefined,
                latestScore: undefined,
                scans: [],
                recommendations: [],
                issues: [],
                settings: { schedule: null, proEnabled: false },
            };
            setState({ sites: [sample] });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // -------------------- ONBOARDING INTEGRATION --------------------
    useEffect(() => {
        // If onboarding passed a website, inject it into dashboard and run initial analysis.
        try {
            if (onboardingData && onboardingData.website) {
                const url = onboardingData.website;
                // avoid duplicates
                if (!state.sites.find(s => s.url === url)) {
                    const newSite: Site = {
                        id: uid(),
                        url,
                        title: url.replace(/^https?:\/\//, ""),
                        lastAnalyzed: undefined,
                        latestScore: undefined,
                        scans: [],
                        recommendations: [],
                        issues: [],
                        settings: { schedule: null, proEnabled: false },
                    };
                    setState(prev => ({ sites: [newSite, ...prev.sites] }));
                    // run fake analyze and update
                    (async () => {
                        setLoadingId(newSite.id);
                        try {
                            const res = await fakeAnalyze(url);
                            setState(prev => ({
                                sites: prev.sites.map(s => s.id === newSite.id ? {
                                    ...s,
                                    lastAnalyzed: nowISO(),
                                    latestScore: res.score,
                                    scans: [...(s.scans ?? []), res.scan],
                                    recommendations: res.recs,
                                    issues: res.issues,
                                } : s)
                            }));
                            setToast("Onboarding site analyzed and added to dashboard");
                            setTimeout(() => setToast(null), 2500);
                        } catch (e) {
                            setToast("Onboarding analysis failed");
                            setTimeout(() => setToast(null), 2500);
                        } finally {
                            setLoadingId(null);
                        }
                    })();
                } else {
                    // If exists, optionally rescan/update
                    const existing = state.sites.find(s => s.url === url);
                    if (existing) {
                        (async () => {
                            setLoadingId(existing!.id);
                            try {
                                const res = await fakeAnalyze(url);
                                setState(prev => ({
                                    sites: prev.sites.map(s => s.id === existing!.id ? {
                                        ...s,
                                        lastAnalyzed: nowISO(),
                                        latestScore: res.score,
                                        scans: [...(s.scans ?? []), res.scan].slice(-60),
                                        recommendations: res.recs,
                                        issues: res.issues,
                                    } : s)
                                }));
                                setToast("Onboarding site re-scanned");
                                setTimeout(() => setToast(null), 2500);
                            } catch {
                                setToast("Onboarding re-scan failed");
                                setTimeout(() => setToast(null), 2500);
                            } finally {
                                setLoadingId(null);
                            }
                        })();
                    }
                }
            }
        } catch (err) {
            // swallow — nothing breaking
            console.error("Onboarding integration error:", err);
        }
        // we only want to run when onboardingData first arrives
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [onboardingData]);

    // -------------------- actions --------------------
    const addSite = async () => {
        const url = addingUrl.trim();
        if (!url) {
            notify("Enter a valid URL");
            return;
        }
        const s: Site = { id: uid(), url, title: url.replace(/^https?:\/\//, ""), scans: [], issues: [], recommendations: [], settings: { schedule: null, proEnabled: false } };
        setState(prev => ({ sites: [s, ...prev.sites] }));
        setAddingUrl("");
        notify("Site added — running initial scan...");
        setLoadingId(s.id);
        try {
            const res = await fakeAnalyze(url);
            setState(prev => ({
                sites: prev.sites.map(site => site.id === s.id ? {
                    ...site,
                    lastAnalyzed: nowISO(),
                    latestScore: res.score,
                    scans: [...(site.scans ?? []), res.scan],
                    recommendations: res.recs,
                    issues: res.issues,
                } : site)
            }));
            notify("Initial scan complete");
        } catch {
            notify("Scan failed");
        } finally {
            setLoadingId(null);
        }
    };

    const triggerRescan = async (site: Site) => {
        setLoadingId(site.id);
        try {
            const res = await fakeAnalyze(site.url);
            setState(prev => ({
                sites: prev.sites.map(s => s.id === site.id ? {
                    ...s,
                    lastAnalyzed: nowISO(),
                    latestScore: res.score,
                    scans: [...(s.scans ?? []), res.scan].slice(-60),
                    recommendations: res.recs,
                    issues: res.issues,
                } : s)
            }));
            notify("Re-scan done");
        } catch {
            notify("Re-scan failed");
        } finally {
            setLoadingId(null);
        }
    };

    const removeSite = (id: string) => {
        if (!confirm("Remove site from dashboard?")) return;
        setState(prev => ({ sites: prev.sites.filter(s => s.id !== id) }));
        notify("Site removed");
    };

    const openView = (site: Site) => {
        setViewSite(site);
        setShowModal(true);
    };

    const toggleIssueFixed = (siteId: string, issueId: string) => {
        setState(prev => ({
            sites: prev.sites.map(s => s.id === siteId ? { ...s, issues: (s.issues ?? []).map(i => i.id === issueId ? { ...i, fixed: !i.fixed } : i) } : s)
        }));
    };

    const addChecklistToDashboard = (siteId: string, issueIds: string[]) => {
        // mark issues as tracked in dashboard (no-op for now, we persist fixed statuses)
        notify("Checklist saved to dashboard");
    };

    const exportSiteCSV = (site: Site | undefined) => {
        const rows = (site ? (site.scans ?? []).map(x => ({ site: site.url, ts: x.ts, score: x.score })) : state.sites.flatMap(s => (s.scans ?? []).map(x => ({ site: s.url, ts: x.ts, score: x.score }))));
        const csv = toCSV(rows);
        const blob = new Blob([csv], { type: "text/csv" });
        const href = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = href;
        a.download = `seotron_export_${site ? site.title : "all"}.csv`;
        a.click();
        URL.revokeObjectURL(href);
    };

    const printReport = (site?: Site) => {
        const win = window.open("", "_blank");
        if (!win) return;
        const html = `
      <html><head><title>SEO Report - ${site?.url ?? "All Sites"}</title></head><body style="font-family: Arial; background:#fff; color:#000; padding:20px;">
        <h1>SEO Report - ${site?.url ?? "All Sites"}</h1>
        <pre>${JSON.stringify(site ?? state.sites, null, 2)}</pre>
      </body></html>`;
        win.document.write(html); win.document.close(); win.print();
    };

    const notify = (msg: string) => {
        setToast(msg); setTimeout(() => setToast(null), 2500);
    };

    const togglePro = () => {
        setIsProUser(p => !p);
        notify(isProUser ? "Pro unlocked disabled (dev toggle)" : "Pro unlocked (dev toggle)");
    };

    // AI Summary generator (condenses recommendations)
    const aiSummary = (site: Site) => {
        const recs = site.recommendations ?? [];
        if (!recs.length) return "No specific recommendations generated.";
        return recs.slice(0, 6).map((r, i) => `${i + 1}. ${r.title} — ${r.detail}`).join(" ");
    };

    // -------------------- render --------------------
    return (
        <div style={rootStyle}>
            <div style={bgStyle} aria-hidden />

            <div style={{ position: "relative", zIndex: 2, maxWidth: 1300, margin: "0 auto", padding: 28 }}>
                {/* header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                        <Activity color="#00c2ff" size={24} />
                        <div>
                            <div style={{ fontSize: 20, fontWeight: 900 }}>SEOtron Dashboard</div>
                            <div style={{ fontSize: 12, opacity: 0.8 }}>Deep site audits · checklist · Pro insights</div>
                        </div>
                    </div>

                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <button onClick={() => togglePro()} style={ghostBtn}>
                            {isProUser ? <Unlock /> : <Lock />} {isProUser ? "Pro: ON" : "Pro: OFF"}
                        </button>
                        <button onClick={() => exportSiteCSV(undefined)} style={ghostBtn}><DownloadCloud size={14} /> Export</button>
                    </div>
                </div>

                {/* controls */}
                <div style={{ display: "flex", gap: 10, marginTop: 18, alignItems: "center", flexWrap: "wrap" }}>
                    <input value={addingUrl} onChange={(e) => setAddingUrl(e.target.value)} placeholder="https://example.com" style={inputStyle} />
                    <button onClick={addSite} style={primaryBtn}>{loadingId ? "Adding..." : "Add & Scan"}</button>
                    <button onClick={() => { if (!state.sites.length) notify("No sites"); else { state.sites.forEach(s => delete (s as any).dummy); notify("Saved"); } }} style={ghostBtn}>Save</button>
                    <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
                        <div style={{ ...cardInline, minWidth: 220 }}>
                            <div style={{ fontSize: 12, opacity: 0.85 }}>Global Health</div>
                            <div style={{ fontWeight: 900, fontSize: 18 }}>{globalTrend.length ? `${globalTrend[globalTrend.length - 1].avg}/100` : "—"}</div>
                        </div>
                        <div style={{ ...cardInline, width: 140 }}>
                            <div style={{ fontSize: 12, opacity: 0.85 }}>Sites</div>
                            <div style={{ fontWeight: 900, fontSize: 18 }}>{state.sites.length}</div>
                        </div>
                    </div>
                </div>

                {/* main grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 18, marginTop: 22 }}>
                    {/* left: sites list */}
                    <div>
                        <div style={{ display: "grid", gap: 12 }}>
                            {state.sites.map(site => (
                                <div key={site.id} style={siteCardStyle}>
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <div>
                                            <div style={{ fontWeight: 800 }}>{site.title ?? site.url}</div>
                                            <div style={{ fontSize: 12, opacity: 0.8 }}>{site.url}</div>
                                        </div>
                                        <div style={{ textAlign: "right" }}>
                                            <div style={{ fontWeight: 900, fontSize: 20, color: scoreColor(site.latestScore ?? 0) }}>{site.latestScore ?? "—"}</div>
                                            <div style={{ fontSize: 12, opacity: 0.75 }}>{site.scans?.length ?? 0} scans</div>
                                        </div>
                                    </div>

                                    <div style={{ marginTop: 10, height: 64 }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={(site.scans ?? []).map(s => ({ t: s.ts.slice(0, 10), v: s.score }))}>
                                                <Line dataKey="v" stroke="#7c3aed" dot={false} strokeWidth={2} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>

                                    <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                                        <button onClick={() => openView(site)} style={viewBtn}>View</button>
                                        <button onClick={() => triggerRescan(site)} style={mutedBtn}><RefreshCcw size={14} /> Re-scan</button>
                                        <button onClick={() => exportSiteCSV(site)} style={ghostBtn}>CSV</button>
                                        <button onClick={() => removeSite(site.id)} style={dangerBtn}>Remove</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* right column: schedule, insights, pro teaser */}
                    <div style={{ display: "grid", gap: 12 }}>
                        <div style={cardHover}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div style={{ fontWeight: 900 }}>Scheduler</div>
                                <div style={{ fontSize: 12, opacity: 0.8 }}>{state.sites.filter(s => s.settings?.schedule).length} scheduled</div>
                            </div>
                            <div style={{ marginTop: 10 }}>
                                <div style={{ display: "flex", gap: 8 }}>
                                    <select style={selectStyle} defaultValue="">
                                        <option value="">Pick cadence</option>
                                        <option value="daily">Daily</option>
                                        <option value="weekly">Weekly</option>
                                        <option value="monthly">Monthly</option>
                                    </select>
                                    <button style={primaryBtn} onClick={() => notify("Scheduler placeholder: configure server-side")}>Apply</button>
                                </div>
                            </div>
                        </div>

                        <div style={cardHover}>
                            <div style={{ fontWeight: 900 }}>AI Summary</div>
                            <div style={{ marginTop: 8, opacity: 0.95, minHeight: 60 }}>
                                {state.sites.length ? aiSummary(state.sites[0]) : "No site data yet."}
                            </div>
                            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                                <button style={ghostBtn} onClick={() => notify("AI Summary exported")}>Export</button>
                                <button style={primaryBtn} onClick={() => notify("AI assistant (placeholder)")}>Ask AI</button>
                            </div>
                        </div>

                        <div style={cardHover}>
                            <div style={{ fontWeight: 900, marginBottom: 8 }}>Pro Insights Preview</div>
                            {!isProUser ? <LockedTeaser title="Backlink & Keyword Intelligence" onUnlockClick={() => notify("Open upgrade flow (placeholder)")} /> : (
                                <div>
                                    <div style={{ fontWeight: 800 }}>Backlink Domains</div>
                                    <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                                        <div style={{ ...smallStat }}>ref1.com<div style={{ fontWeight: 800 }}>120</div></div>
                                        <div style={{ ...smallStat }}>ref2.com<div style={{ fontWeight: 800 }}>60</div></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* global trend */}
                <div style={{ marginTop: 20 }}>
                    <div style={{ fontWeight: 900, marginBottom: 10 }}>Global SEO Health Trend</div>
                    <div style={{ height: 140 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={globalTrend}>
                                <XAxis dataKey="time" />
                                <YAxis domain={[0, 100]} />
                                <Tooltip />
                                <Area type="monotone" dataKey="avg" stroke="#7c3aed" fill="rgba(124,58,237,0.18)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* View modal (deep) */}
            {showModal && viewSite && (
                <Modal wide onClose={() => setShowModal(false)}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 18 }}>
                        {/* LEFT: main deep sections */}
                        <div style={{ display: "grid", gap: 12 }}>
                            {/* header */}
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div>
                                    <div style={{ fontSize: 20, fontWeight: 900 }}>{viewSite.title ?? viewSite.url}</div>
                                    <div style={{ fontSize: 12, opacity: 0.8 }}>Last scanned: {formatDate(viewSite.lastAnalyzed)}</div>
                                </div>
                                <div style={{ textAlign: "right" }}>
                                    <div style={{ fontSize: 26, fontWeight: 900, color: scoreColor(viewSite.latestScore ?? 0) }}>{viewSite.latestScore ?? "—"}</div>
                                    <div style={{ fontSize: 12, opacity: 0.8 }}>Score</div>
                                </div>
                            </div>

                            {/* Overview Panel */}
                            <div style={panel}>
                                <div style={{ display: "flex", gap: 14 }}>
                                    <div style={{ width: 220, height: 160 }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={(viewSite.scans ?? []).map(p => ({ t: p.ts.slice(0, 10), v: p.score }))}>
                                                <Tooltip />
                                                <XAxis dataKey="t" />
                                                <YAxis domain={[0, 100]} />
                                                <Line dataKey="v" stroke="#00c2ff" strokeWidth={2} dot={false} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: "grid", gap: 8 }}>
                                            <div style={{ fontWeight: 800 }}>Core Insights</div>
                                            <div style={{ display: "flex", gap: 8 }}>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontSize: 12, opacity: 0.8 }}>Performance (LCP)</div>
                                                    <div style={{ fontWeight: 800 }}>2.8s</div>
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontSize: 12, opacity: 0.8 }}>Accessibility</div>
                                                    <div style={{ fontWeight: 800 }}>72/100</div>
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontSize: 12, opacity: 0.8 }}>Mobile Friendly</div>
                                                    <div style={{ fontWeight: 800 }}>Yes</div>
                                                </div>
                                            </div>
                                            <div style={{ marginTop: 6 }}>
                                                <div style={{ fontSize: 12, opacity: 0.8 }}>Quick Notes</div>
                                                <div style={{ fontSize: 13 }}>{aiSummary(viewSite)}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Checklist (big) */}
                            <div style={panel}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <div style={{ fontWeight: 900 }}>Checklist — Tasks to improve SEO</div>
                                    <div style={{ display: "flex", gap: 8 }}>
                                        <button onClick={() => exportSiteCSV(viewSite)} style={ghostSmall}>Export CSV</button>
                                        <button onClick={() => printReport(viewSite)} style={ghostSmall}>Print</button>
                                    </div>
                                </div>

                                <div style={{ marginTop: 10 }}>
                                    <ChecklistBlock site={viewSite} onToggle={(issueId) => toggleIssueFixed(viewSite.id, issueId)} onSave={() => addChecklistToDashboard(viewSite.id, (viewSite.issues ?? []).filter(i => i.fixed).map(i => i.id))} />
                                </div>
                            </div>

                            {/* Content recommendations */}
                            <div style={panel}>
                                <div style={{ fontWeight: 900 }}>Content Recommendations</div>
                                <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
                                    {(viewSite.recommendations ?? []).map((r, i) => (
                                        <div key={i} style={{ padding: 12, borderRadius: 10, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                                            <div style={{ fontWeight: 800 }}>{r.title}</div>
                                            <div style={{ opacity: 0.9 }}>{r.detail}</div>
                                        </div>
                                    ))}
                                    {!viewSite.recommendations?.length && <div style={{ opacity: 0.8 }}>No recommendations found.</div>}
                                </div>
                            </div>

                            {/* Technical SEO */}
                            <div style={panel}>
                                <div style={{ fontWeight: 900 }}>Technical SEO</div>
                                <div style={{ marginTop: 10 }}>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                                        <div style={{ padding: 10, borderRadius: 8, background: "rgba(255,255,255,0.02)" }}>
                                            <div style={{ fontSize: 12, opacity: 0.8 }}>Robots</div>
                                            <div>allowed</div>
                                        </div>
                                        <div style={{ padding: 10, borderRadius: 8, background: "rgba(255,255,255,0.02)" }}>
                                            <div style={{ fontSize: 12, opacity: 0.8 }}>Sitemap</div>
                                            <div>present</div>
                                        </div>
                                        <div style={{ padding: 10, borderRadius: 8, background: "rgba(255,255,255,0.02)" }}>
                                            <div style={{ fontSize: 12, opacity: 0.8 }}>Canonical</div>
                                            <div>set</div>
                                        </div>
                                        <div style={{ padding: 10, borderRadius: 8, background: "rgba(255,255,255,0.02)" }}>
                                            <div style={{ fontSize: 12, opacity: 0.8 }}>Structured Data</div>
                                            <div>none</div>
                                        </div>
                                    </div>
                                    <div style={{ marginTop: 12 }}>
                                        <div style={{ fontWeight: 800 }}>Broken Links</div>
                                        <div style={{ marginTop: 6, maxHeight: 120, overflow: "auto" }}>
                                            {(viewSite.issues ?? []).filter(i => i.id === "broken" || i.id === "broken_links").length ? (viewSite.issues ?? []).filter(i => i.id === "broken" || i.id === "broken_links").map((b) => <div key={b.id} style={{ padding: 6 }}>{b.label}</div>) : <div style={{ opacity: 0.8 }}>No broken links reported</div>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: meta side panel */}
                        <div style={{ display: "grid", gap: 12 }}>
                            <div style={panel}>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <div style={{ fontWeight: 900 }}>Quick Score Breakdown</div>
                                    <div style={{ fontSize: 12, opacity: 0.8 }}>{formatDate(viewSite.lastAnalyzed)}</div>
                                </div>
                                <div style={{ marginTop: 12 }}>
                                    <div style={{ fontSize: 12, opacity: 0.85 }}>Overall Score</div>
                                    <div style={{ fontWeight: 900, fontSize: 28, color: scoreColor(viewSite.latestScore ?? 0) }}>{viewSite.latestScore ?? "—"}</div>
                                    <div style={{ marginTop: 8 }}><ProgressBar value={(viewSite.latestScore ?? 0)} /></div>
                                </div>
                            </div>

                            <div style={panel}>
                                <div style={{ fontWeight: 900 }}>Quick Actions</div>
                                <div style={{ display: "grid", gap: 8, marginTop: 10 }}>
                                    <button style={primaryBtn} onClick={() => triggerRescan(viewSite)}>Re-run scan</button>
                                    <button style={ghostBtn} onClick={() => exportSiteCSV(viewSite)}>Export CSV</button>
                                    <button style={ghostBtn} onClick={() => printReport(viewSite)}>Print report</button>
                                    <button style={ghostBtn} onClick={() => notify("Share link copied (placeholder)")}>Share</button>
                                </div>
                            </div>

                            {/* Pro locked teasers */}
                            <div>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                                    <div style={{ fontWeight: 900 }}>Pro Insights</div>
                                    <div style={{ fontSize: 12, opacity: 0.7 }}>{isProUser ? "Unlocked" : "Locked"}</div>
                                </div>

                                {!isProUser ? (
                                    <>
                                        <LockedTeaser title="Backlink Profile" onUnlockClick={() => notify("Upgrade flow placeholder")} />
                                        <div style={{ height: 12 }} />
                                        <LockedTeaser title="Keyword Rank Tracking" onUnlockClick={() => notify("Upgrade flow placeholder")} />
                                    </>
                                ) : (
                                    <>
                                        <div style={panelSmall}>
                                            <div style={{ fontWeight: 800 }}>Backlinks</div>
                                            <div style={{ marginTop: 8 }}>Top domains: ref1.com (120), ref2.com (60)</div>
                                        </div>
                                        <div style={panelSmall}>
                                            <div style={{ fontWeight: 800 }}>Keyword Trends</div>
                                            <div style={{ marginTop: 8 }}>example keyword ↑ 12 positions</div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </Modal>
            )}

            {/* toast */}
            {toast && <div style={toastStyle}>{toast}</div>}
        </div>
    );
}

// -------------------- ChecklistBlock component --------------------
function ChecklistBlock({ site, onToggle, onSave }: { site: Site; onToggle: (issueId: string) => void; onSave: () => void }) {
    // build a checklist from issues, plus synthetic tasks if not present
    const items: Issue[] = useMemo(() => {
        const base = site.issues ?? [];
        const synth: Issue[] = [
            { id: "title", label: "Title tag presence & length", severity: 50, category: "On-page", fixed: false },
            { id: "meta", label: "Meta description quality", severity: 60, category: "On-page", fixed: false },
            { id: "h1", label: "Heading (H1) usage", severity: 45, category: "Structure", fixed: false },
            { id: "alt", label: "Image alt text coverage", severity: 40, category: "Accessibility", fixed: false },
            { id: "content_depth", label: "Content depth (word count)", severity: 55, category: "Content", fixed: false },
            { id: "structured", label: "Structured data (schema)", severity: 35, category: "Technical", fixed: false },
        ];
        // merge: prefer real issues, then add synth ones not present
        const presentIds = new Set(base.map(b => b.id));
        const merged = [...base, ...synth.filter(s => !presentIds.has(s.id))];
        return merged;
    }, [site.issues]);

    const doneCount = items.filter(i => i.fixed).length;
    const scoreEstimate = Math.round((doneCount / items.length) * 100);

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontWeight: 800 }}>Progress</div>
                <div style={{ fontSize: 12, opacity: 0.8 }}>{doneCount}/{items.length} tasks</div>
            </div>
            <div style={{ marginTop: 8 }}><ProgressBar value={scoreEstimate} /></div>

            <div style={{ marginTop: 12, maxHeight: 300, overflow: "auto" }}>
                {items.map((it) => (
                    <div key={it.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px dashed rgba(255,255,255,0.03)" }}>
                        <div>
                            <div style={{ fontWeight: 700 }}>{it.label}</div>
                            <div style={{ fontSize: 12, opacity: 0.8 }}>{it.category} • Severity {it.severity ?? "—"}</div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ minWidth: 120 }}>
                                <div style={{ fontSize: 12, opacity: 0.8 }}>Impact</div>
                                <div style={{ fontWeight: 800 }}>{it.severity ?? 40}/100</div>
                            </div>
                            <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <input type="checkbox" checked={!!it.fixed} onChange={() => onToggle(it.id)} />
                                <span style={{ fontSize: 12 }}>Mark Fixed</span>
                            </label>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
                <button onClick={onSave} style={primarySmall}>Save checklist</button>
                <button onClick={() => alert("Export checklist (placeholder)")} style={ghostSmall}>Export</button>
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
    position: "fixed", inset: 0, zIndex: 0,
    background:
        "radial-gradient(55vw 55vw at 18% 78%, rgba(255,0,92,0.22), transparent 60%)," +
        "radial-gradient(45vw 45vw at 82% 22%, rgba(0,255,224,0.18), transparent 55%)," +
        "radial-gradient(70vw 70vw at 50% 45%, rgba(120,80,255,0.12), transparent 60%)",
    pointerEvents: "none"
};

const inputStyle: React.CSSProperties = {
    padding: "10px 12px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)",
    background: "rgba(255,255,255,0.02)", color: "#fff", minWidth: 320
};

const primaryBtn: React.CSSProperties = {
    background: "linear-gradient(135deg,#7c3aed,#00c2ff)", border: "none", padding: "10px 12px",
    borderRadius: 10, color: "#fff", fontWeight: 800, cursor: "pointer"
};

const ghostBtn: React.CSSProperties = {
    background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", padding: "8px 10px",
    borderRadius: 10, color: "#fff", cursor: "pointer"
};

const mutedBtn: React.CSSProperties = {
    background: "transparent", border: "1px solid rgba(255,255,255,0.04)", padding: "8px 10px",
    borderRadius: 8, color: "#fff", cursor: "pointer"
};

const dangerBtn: React.CSSProperties = {
    background: "#ef4444", border: "none", padding: "8px 10px", borderRadius: 8, color: "#fff", cursor: "pointer"
};

const cardInline: React.CSSProperties = {
    background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: 10
};

const siteCardStyle: React.CSSProperties = {
    background: "linear-gradient(135deg, rgba(255,255,255,0.02), rgba(255,255,255,0.03))",
    border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: 12, boxShadow: "0 10px 24px rgba(2,6,23,0.6)"
};

const cardHover: React.CSSProperties = {
    background: "linear-gradient(135deg, rgba(255,255,255,0.02), rgba(255,255,255,0.03))",
    border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: 12, boxShadow: "0 8px 20px rgba(0,0,0,0.5)"
};

const panel: React.CSSProperties = {
    background: "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))",
    border: "1px solid rgba(255,255,255,0.04)", padding: 12, borderRadius: 10
};

const panelSmall: React.CSSProperties = {
    background: "rgba(255,255,255,0.02)", padding: 10, borderRadius: 8, border: "1px solid rgba(255,255,255,0.04)"
};

const viewBtn: React.CSSProperties = {
    background: "linear-gradient(135deg,#00c2ff,#7c3aed)", border: "none", padding: "10px 12px", borderRadius: 8, color: "#fff", cursor: "pointer"
};

const toastStyle: React.CSSProperties = {
    position: "fixed", right: 20, bottom: 20, background: "linear-gradient(135deg,#7c3aed,#00c2ff)", padding: "10px 14px",
    borderRadius: 10, color: "#fff", zIndex: 999
};

const ghostSmall: React.CSSProperties = { ...ghostBtn, padding: "8px 10px", fontSize: 13 };
const primarySmall: React.CSSProperties = { ...primaryBtn, padding: "8px 10px", fontSize: 13 };
const selectStyle: React.CSSProperties = { padding: 8, borderRadius: 8, border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)", color: "#fff" };
const smallStat: React.CSSProperties = { background: "rgba(255,255,255,0.02)", padding: 10, borderRadius: 8, textAlign: "center" };

// -------------------- helpers used in styles --------------------
function scoreColor(s: number | undefined) {
    const v = s ?? 0;
    if (v < 40) return "#ef4444";
    if (v < 75) return "#f59e0b";
    return "#22c55e";
}
