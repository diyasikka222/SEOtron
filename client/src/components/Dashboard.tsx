import React, { useState, useMemo } from "react";
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, CartesianGrid, Legend
} from "recharts";
import { Activity, Sun, Moon } from "lucide-react";

type TimeseriesPoint = { time: string; value: number };
type PagePerformance = { page: string; loadTime: number };

type AnalyticsPayload = {
    overview: {
        sessions: number;
        users: number;
        bounceRate: number;
        conversions: number;
        avgSessionDuration: string;
        pageViews: number;
    };
    trafficSources: { name: string; value: number }[];
    sessionsTimeseries: TimeseriesPoint[];
    conversionTimeseries: TimeseriesPoint[];
    pagePerformance: PagePerformance[];
};

const analytics: AnalyticsPayload = {
    overview: {
        sessions: 12345,
        users: 6789,
        bounceRate: 42,
        conversions: 987,
        avgSessionDuration: "3m 45s",
        pageViews: 45678
    },
    trafficSources: [
        { name: "Direct", value: 4000 },
        { name: "Referral", value: 2000 },
        { name: "Organic", value: 3500 },
        { name: "Social", value: 1500 },
        { name: "Email", value: 1000 }
    ],
    sessionsTimeseries: [
        { time: "Oct 5", value: 800 },
        { time: "Oct 6", value: 900 },
        { time: "Oct 7", value: 750 },
        { time: "Oct 8", value: 880 },
        { time: "Oct 9", value: 820 },
        { time: "Oct 10", value: 920 },
        { time: "Oct 11", value: 990 },
    ],
    conversionTimeseries: [
        { time: "Oct 5", value: 50 },
        { time: "Oct 6", value: 65 },
        { time: "Oct 7", value: 40 },
        { time: "Oct 8", value: 70 },
        { time: "Oct 9", value: 55 },
        { time: "Oct 10", value: 80 },
        { time: "Oct 11", value: 90 },
    ],
    pagePerformance: [
        { page: "/home", loadTime: 1.2 },
        { page: "/about", loadTime: 1.8 },
        { page: "/contact", loadTime: 2.1 },
        { page: "/products", loadTime: 1.5 },
        { page: "/checkout", loadTime: 2.5 },
    ]
};

export default function Dashboard() {
    const [theme, setTheme] = useState<"light" | "dark">("dark");
    const trafficColors = useMemo(() => ["#60A5FA", "#34D399", "#FBBF24", "#F87171", "#A78BFA"], []);

    const containerStyle: React.CSSProperties = {
        fontFamily: "Arial, sans-serif",
        backgroundColor: theme === "dark" ? "#121212" : "#f5f5f5",
        color: theme === "dark" ? "#f5f5f5" : "#1f1f1f",
        minHeight: "100vh",
        padding: "20px"
    };

    const rowStyle: React.CSSProperties = { display: "flex", flexWrap: "wrap", gap: "15px", marginBottom: "20px" };
    const cardStyle = (flex?: string): React.CSSProperties => ({
        backgroundColor: theme === "dark" ? "#1f1f1f" : "#fff",
        padding: "15px",
        borderRadius: "15px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
        flex: flex || "1 1 250px",
        minHeight: "150px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
    });

    return (
        <div style={containerStyle}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Activity />
                    <h1 style={{ margin: 0 }}>Seotron — Analytics Dashboard</h1>
                </div>
                <button
                    onClick={() => setTheme(t => t === "dark" ? "light" : "dark")}
                    style={{
                        background: theme === "dark" ? "#333" : "#ddd",
                        border: "none",
                        padding: "10px",
                        borderRadius: "50%",
                        cursor: "pointer"
                    }}
                >
                    {theme === "dark" ? <Sun /> : <Moon />}
                </button>
            </div>

            {/* Overview Cards */}
            <div style={rowStyle}>
                {Object.entries(analytics.overview).map(([label, value]) => (
                    <div key={label} style={cardStyle("1 1 200px")}>
                        <div style={{ fontSize: "14px", fontWeight: "bold" }}>{label.replace(/([A-Z])/g, ' $1')}</div>
                        <div style={{ fontSize: "24px", marginTop: "5px" }}>{value}</div>
                        {/* Mini Line Chart */}
                        <div style={{ height: "40px", marginTop: "5px" }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={analytics.sessionsTimeseries}>
                                    <Line type="monotone" dataKey="value" stroke="#3B82F6" dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                ))}
            </div>

            {/* Top Charts Row */}
            <div style={rowStyle}>
                {/* Sessions & Conversions */}
                <div style={cardStyle("2 1 500px")}>
                    <h3>Sessions vs Conversions</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={analytics.sessionsTimeseries}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="time" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="value" name="Sessions" stroke="#3B82F6" dot={false} />
                            <Line
                                type="monotone"
                                dataKey={(d) => analytics.conversionTimeseries.find(c => c.time === d.time)?.value ?? 0}
                                name="Conversions"
                                stroke="#10B981"
                                strokeDasharray="5 5"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Traffic Sources */}
                <div style={cardStyle("1 1 300px")}>
                    <h3>Traffic Sources</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie
                                data={analytics.trafficSources}
                                dataKey="value"
                                nameKey="name"
                                outerRadius={80}
                                innerRadius={40}
                            >
                                {analytics.trafficSources.map((entry, idx) => (
                                    <Cell key={idx} fill={trafficColors[idx % trafficColors.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36}/>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Mini Info Cards Row */}
            <div style={rowStyle}>
                {/* Page Load Times */}
                <div style={cardStyle("1 1 220px")}>
                    <h4>Page Load Times</h4>
                    {analytics.pagePerformance.map((p, idx) => (
                        <div key={p.page} style={{ margin: "5px 0" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px" }}>
                                <span>{p.page}</span>
                                <span>{p.loadTime}s</span>
                            </div>
                            <div style={{ height: "6px", borderRadius: "3px", backgroundColor: "#555" }}>
                                <div style={{
                                    width: `${(p.loadTime / 3) * 100}%`,
                                    backgroundColor: "#FBBF24",
                                    height: "100%",
                                    borderRadius: "3px"
                                }}></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Conversions Today */}
                <div style={cardStyle("1 1 220px")}>
                    <h4>Conversions Today</h4>
                    <div style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "5px" }}>
                        {analytics.conversionTimeseries.slice(-1)[0].value}
                    </div>
                    <div style={{ height: "50px" }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={analytics.conversionTimeseries}>
                                <Line type="monotone" dataKey="value" stroke="#10B981" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Active Users */}
                <div style={cardStyle("1 1 220px")}>
                    <h4>Active Users</h4>
                    <div style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "5px" }}>{analytics.overview.users}</div>
                    <div style={{ height: "50px" }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={analytics.sessionsTimeseries}>
                                <Bar dataKey="value" fill="#F87171" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Traffic Source */}
                <div style={cardStyle("1 1 220px")}>
                    <h4>Top Traffic Source</h4>
                    <div style={{ fontSize: "18px", fontWeight: "600", marginBottom: "5px" }}>
                        {analytics.trafficSources.reduce((a, b) => (a.value > b.value ? a : b)).name}
                    </div>
                    <div style={{ height: "50px" }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={analytics.trafficSources}
                                    dataKey="value"
                                    nameKey="name"
                                    outerRadius={20}
                                    innerRadius={10}
                                >
                                    {analytics.trafficSources.map((entry, idx) => (
                                        <Cell key={idx} fill={trafficColors[idx % trafficColors.length]} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Page Views */}
                <div style={cardStyle("1 1 220px")}>
                    <h4>Page Views</h4>
                    <div style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "5px" }}>{analytics.overview.pageViews}</div>
                    <div style={{ height: "50px" }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={analytics.sessionsTimeseries}>
                                <Line type="monotone" dataKey="value" stroke="#60A5FA" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Additional Cards Row */}
            <div style={rowStyle}>
                {["Bounce Insights", "Session Duration Trend", "Weekly Users Growth", "Conversions Trend", "Revenue Estimation"].map(title => (
                    <div key={title} style={cardStyle("1 1 220px")}>
                        <h4>{title}</h4>
                        <div style={{ height: "60px" }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={analytics.sessionsTimeseries}>
                                    <Line type="monotone" dataKey="value" stroke={trafficColors[Math.floor(Math.random() * trafficColors.length)]} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        <div style={{ fontSize: "12px", marginTop: "5px" }}>Mini trend view</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
