import { useState, useMemo } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from "recharts";
import { C } from '../constants/theme';
import { fmtK, fmtPct } from '../utils/format';

// ⚠️ BUSINESS NUMBER FLAGS (do not resolve without founder sign-off):
// 1. Pricing below ($299/$799/$3,500 for CoS; $499/$2,200/$7,500 for DSS) differs from
//    aexs-pitch-deck.jsx Slide 6 ($499/$1,999/$8,500 flat rate).
//    These are used in all financial projections. Needs reconciliation.
// 2. Seed capital is hardcoded as $150,000 in calcMonthly() but the pitch deck asks $1.5M.
//    Break-even timing is directly affected. Needs reconciliation.

const STARTUPS = [
  { id: 0, name: "AI Chief of Staff", emoji: "🧠", color: C.gold,   short: "CoS" },
  { id: 1, name: "AI Governance aaS", emoji: "⚖️", color: C.blue,   short: "Gov" },
  { id: 2, name: "Decision Support",  emoji: "📊", color: C.purple, short: "DSS" },
  { id: 3, name: "Combined Suite",    emoji: "🏢", color: C.teal,   short: "All" },
];

const defaults = {
  0: { starter: 299, growth: 799, enterprise: 3500, starterPct: 50, growthPct: 35, entPct: 15, growthRate: 15, churn: 3, cogs: 25, initCustomers: 10, burnBase: 40000 },
  1: { audit: 5000, monitor: 1500, enterprise: 8000, auditPct: 40, monitorPct: 40, entPct: 20, growthRate: 12, churn: 2, cogs: 30, initCustomers: 5, burnBase: 48000 },
  2: { solo: 499, team: 2200, enterprise: 7500, soloPct: 40, teamPct: 40, entPct: 20, growthRate: 13, churn: 2.5, cogs: 28, initCustomers: 8, burnBase: 53000 },
};

function calcMonthly(cfg, sid) {
  const months = [];
  let customers = cfg.initCustomers;
  let cashBalance = 150000; // seed capital

  for (let m = 1; m <= 36; m++) {
    const newCust = Math.round(customers * (cfg.growthRate / 100));
    const churned = Math.round(customers * (cfg.churn / 100));
    customers = customers + newCust - churned;

    let mrr = 0;
    if (sid === 0) {
      const s = Math.round(customers * cfg.starterPct / 100);
      const g = Math.round(customers * cfg.growthPct / 100);
      const e = Math.round(customers * cfg.entPct / 100);
      mrr = s * cfg.starter + g * cfg.growth + e * cfg.enterprise;
    } else if (sid === 1) {
      const a = Math.round(customers * cfg.auditPct / 100) * (cfg.audit / 12);
      const mo = Math.round(customers * cfg.monitorPct / 100) * cfg.monitor;
      const e = Math.round(customers * cfg.entPct / 100) * cfg.enterprise;
      mrr = a + mo + e;
    } else {
      const s = Math.round(customers * cfg.soloPct / 100) * cfg.solo;
      const t = Math.round(customers * cfg.teamPct / 100) * cfg.team;
      const e = Math.round(customers * cfg.entPct / 100) * cfg.enterprise;
      mrr = s + t + e;
    }

    const cogs = mrr * cfg.cogs / 100;
    const grossProfit = mrr - cogs;
    const burn = cfg.burnBase * (1 + m * 0.01);
    const netBurn = grossProfit - burn;
    cashBalance += netBurn;

    months.push({
      month: m,
      label: m <= 12 ? `M${m}` : m <= 24 ? `Y2M${m - 12}` : `Y3M${m - 24}`,
      customers: Math.round(customers),
      mrr: Math.round(mrr),
      arr: Math.round(mrr * 12),
      grossProfit: Math.round(grossProfit),
      burn: Math.round(burn),
      netBurn: Math.round(netBurn),
      cashBalance: Math.round(cashBalance),
      grossMargin: mrr > 0 ? (grossProfit / mrr) * 100 : 0,
    });
  }
  return months;
}

function calcCombined(m0, m1, m2) {
  return m0.map((r, i) => ({
    ...r,
    mrr: r.mrr + m1[i].mrr + m2[i].mrr,
    arr: r.arr + m1[i].arr + m2[i].arr,
    grossProfit: r.grossProfit + m1[i].grossProfit + m2[i].grossProfit,
    burn: r.burn + m1[i].burn + m2[i].burn,
    netBurn: r.netBurn + m1[i].netBurn + m2[i].netBurn,
    cashBalance: r.cashBalance + m1[i].cashBalance + m2[i].cashBalance,
    customers: r.customers + m1[i].customers + m2[i].customers,
  }));
}

const SliderRow = ({ label, value, min, max, step, onChange, fmt }) => (
  <div style={{ marginBottom: 12 }}>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
      <span style={{ fontSize: 11, color: "#888", fontFamily: "monospace", letterSpacing: 1 }}>{label}</span>
      <span style={{ fontSize: 11, color: "#e8c97a", fontFamily: "monospace", fontWeight: 700 }}>{fmt ? fmt(value) : value}</span>
    </div>
    <input type="range" min={min} max={max} step={step} value={value}
      onChange={e => onChange(parseFloat(e.target.value))}
      style={{ width: "100%", accentColor: "#C9A84C", height: 3, cursor: "pointer" }} />
  </div>
);

const KPI = ({ label, value, sub, color }) => (
  <div style={{ background: "#0e0e12", border: "1px solid #222", borderRadius: 4, padding: "14px 16px", flex: "1 1 120px" }}>
    <div style={{ fontSize: 10, color: "#555", fontFamily: "monospace", letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
    <div style={{ fontSize: 20, fontWeight: 700, color: color || "#e8e4dc", fontFamily: "monospace" }}>{value}</div>
    {sub && <div style={{ fontSize: 10, color: "#555", marginTop: 3 }}>{sub}</div>}
  </div>
);

const CustomTooltip = ({ active, payload, label, color }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#111115", border: "1px solid #2a2a2e", borderRadius: 4, padding: "10px 14px", fontSize: 11, fontFamily: "monospace" }}>
      <div style={{ color: "#888", marginBottom: 6 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || color, marginBottom: 2 }}>
          {p.name}: {fmtK(p.value)}
        </div>
      ))}
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState(0);
  const [activeChart, setActiveChart] = useState("mrr");
  const [cfg, setCfg] = useState({ ...defaults[0] });
  const [cfgs, setCfgs] = useState({ 0: { ...defaults[0] }, 1: { ...defaults[1] }, 2: { ...defaults[2] } });

  const sid = activeTab < 3 ? activeTab : null;

  const m0 = useMemo(() => calcMonthly(cfgs[0], 0), [cfgs[0]]);
  const m1 = useMemo(() => calcMonthly(cfgs[1], 1), [cfgs[1]]);
  const m2 = useMemo(() => calcMonthly(cfgs[2], 2), [cfgs[2]]);
  const mAll = useMemo(() => calcCombined(m0, m1, m2), [m0, m1, m2]);

  const allMonths = [m0, m1, m2, mAll];
  const months = allMonths[activeTab];
  const activeCfg = activeTab < 3 ? cfgs[activeTab] : null;
  const startup = STARTUPS[activeTab];

  const y1 = months.filter(m => m.month <= 12);
  const y2 = months.filter(m => m.month > 12 && m.month <= 24);
  const y3 = months.filter(m => m.month > 24);
  const y1arr = y1[11]?.arr || 0;
  const y2arr = y2[11]?.arr || 0;
  const y3arr = y3[11]?.arr || 0;
  const beMonth = months.find(m => m.netBurn >= 0);
  const peakBurn = Math.min(...months.map(m => m.netBurn));
  const y3Margin = y3[11]?.grossMargin || 0;

  const chartData = months.filter((_, i) => i % 2 === 0).map(m => ({
    ...m,
    MRR: m.mrr,
    ARR: m.arr,
    "Gross Profit": m.grossProfit,
    "Cash Balance": m.cashBalance,
    "Net Burn": m.netBurn,
    Customers: m.customers,
  }));

  const updateCfg = (key, val) => {
    if (activeTab < 3) {
      const updated = { ...cfgs[activeTab], [key]: val };
      setCfgs(p => ({ ...p, [activeTab]: updated }));
    }
  };

  const yearlyData = [
    { year: "Year 1", ARR: y1arr / 1000, color: startup.color },
    { year: "Year 2", ARR: y2arr / 1000, color: startup.color },
    { year: "Year 3", ARR: y3arr / 1000, color: startup.color },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#09090c", color: "#e8e4dc", fontFamily: "'Georgia', serif", padding: 0 }}>

      {/* Header */}
      <div style={{ background: "#0d0d10", borderBottom: "1px solid #1e1e24", padding: "20px 20px 0" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <p style={{ fontSize: 9, letterSpacing: 4, color: "#444", fontFamily: "monospace", textTransform: "uppercase", margin: "0 0 4px" }}>
            INTERACTIVE FINANCIAL MODEL · 36-MONTH PROJECTION
          </p>
          <h1 style={{ fontSize: "clamp(18px, 4vw, 28px)", fontWeight: 400, margin: "0 0 20px", letterSpacing: -0.5 }}>
            AI Venture Suite — Financial Dashboard
          </h1>
          <div style={{ display: "flex", gap: 2, overflowX: "auto" }}>
            {STARTUPS.map((s, i) => (
              <button key={i} onClick={() => setActiveTab(i)}
                style={{
                  flex: "0 0 auto", padding: "10px 14px", border: "none", cursor: "pointer",
                  background: activeTab === i ? s.color : "transparent",
                  color: activeTab === i ? "#000" : "#666",
                  fontFamily: "monospace", fontSize: 10, fontWeight: activeTab === i ? 700 : 400,
                  letterSpacing: 1, textTransform: "uppercase", whiteSpace: "nowrap",
                  borderBottom: activeTab === i ? "none" : "1px solid #1e1e24",
                  transition: "all 0.2s"
                }}>
                {s.emoji} {s.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 780, margin: "0 auto", padding: "24px 20px" }}>

        {/* KPI Row */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 24 }}>
          <KPI label="Y1 ARR" value={fmtK(y1arr)} sub="End of Year 1" color={startup.color} />
          <KPI label="Y2 ARR" value={fmtK(y2arr)} sub="End of Year 2" color={startup.color} />
          <KPI label="Y3 ARR" value={fmtK(y3arr)} sub="End of Year 3" color={startup.color} />
          <KPI label="Break-Even" value={beMonth ? `Month ${beMonth.month}` : "36m+"} sub="First profitable month" color={beMonth ? "#4CC97A" : "#C94C4C"} />
          <KPI label="Y3 Margin" value={fmtPct(y3Margin)} sub="Gross margin" color="#9B6CD9" />
          <KPI label="Peak Burn" value={fmtK(Math.abs(peakBurn))} sub="Worst month deficit" color="#C94C4C" />
        </div>

        {/* ARR Bar Chart */}
        <div style={{ background: "#0d0d10", border: "1px solid #1e1e24", borderRadius: 6, padding: "20px", marginBottom: 20 }}>
          <p style={{ fontSize: 9, color: "#444", fontFamily: "monospace", letterSpacing: 3, textTransform: "uppercase", margin: "0 0 16px" }}>
            ANNUAL RECURRING REVENUE — YEAR OVER YEAR
          </p>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={yearlyData} barSize={40}>
              <XAxis dataKey="year" tick={{ fill: "#555", fontSize: 10, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#555", fontSize: 10, fontFamily: "monospace" }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}K`} />
              <Tooltip content={<CustomTooltip color={startup.color} />} formatter={v => fmtK(v * 1000)} />
              <Bar dataKey="ARR" fill={startup.color} radius={[3, 3, 0, 0]} opacity={0.85} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Chart Selector + Line Chart */}
        <div style={{ background: "#0d0d10", border: "1px solid #1e1e24", borderRadius: 6, padding: "20px", marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
            <p style={{ fontSize: 9, color: "#444", fontFamily: "monospace", letterSpacing: 3, textTransform: "uppercase", margin: 0 }}>
              36-MONTH TREND
            </p>
            <div style={{ display: "flex", gap: 6 }}>
              {[["mrr", "MRR"], ["cashBalance", "Cash"], ["netBurn", "Net Burn"], ["customers", "Customers"]].map(([k, l]) => (
                <button key={k} onClick={() => setActiveChart(k)}
                  style={{
                    padding: "4px 10px", border: `1px solid ${activeChart === k ? startup.color : "#2a2a2e"}`,
                    background: activeChart === k ? `${startup.color}22` : "transparent",
                    color: activeChart === k ? startup.color : "#555",
                    fontFamily: "monospace", fontSize: 9, cursor: "pointer", borderRadius: 3,
                    letterSpacing: 1, textTransform: "uppercase"
                  }}>{l}</button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={chartData}>
              <XAxis dataKey="label" tick={{ fill: "#444", fontSize: 9, fontFamily: "monospace" }} axisLine={false} tickLine={false} interval={5} />
              <YAxis tick={{ fill: "#444", fontSize: 9, fontFamily: "monospace" }} axisLine={false} tickLine={false}
                tickFormatter={v => activeChart === "customers" ? v : fmtK(v)} />
              <Tooltip content={<CustomTooltip color={startup.color} />} />
              <ReferenceLine y={0} stroke="#2a2a2e" strokeDasharray="4 4" />
              <Line type="monotone" dataKey={activeChart === "mrr" ? "MRR" : activeChart === "cashBalance" ? "Cash Balance" : activeChart === "netBurn" ? "Net Burn" : "Customers"}
                stroke={startup.color} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Assumptions Panel */}
        {activeTab < 3 && (
          <div style={{ background: "#0d0d10", border: "1px solid #1e1e24", borderRadius: 6, padding: "20px", marginBottom: 20 }}>
            <p style={{ fontSize: 9, color: "#444", fontFamily: "monospace", letterSpacing: 3, textTransform: "uppercase", margin: "0 0 20px" }}>
              ⚙️ ADJUST ASSUMPTIONS — MODEL UPDATES LIVE
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }}>

              {activeTab === 0 && <>
                <SliderRow label="Starter Price ($/mo)" value={cfgs[0].starter} min={99} max={599} step={10} onChange={v => updateCfg("starter", v)} fmt={v => `$${v}`} />
                <SliderRow label="Growth Price ($/mo)" value={cfgs[0].growth} min={299} max={1999} step={50} onChange={v => updateCfg("growth", v)} fmt={v => `$${v}`} />
                <SliderRow label="Enterprise Price ($/mo)" value={cfgs[0].enterprise} min={1000} max={10000} step={500} onChange={v => updateCfg("enterprise", v)} fmt={v => `$${v}`} />
                <SliderRow label="Enterprise Customer %" value={cfgs[0].entPct} min={5} max={40} step={1} onChange={v => updateCfg("entPct", v)} fmt={v => `${v}%`} />
              </>}

              {activeTab === 1 && <>
                <SliderRow label="Audit Fee ($)" value={cfgs[1].audit} min={1000} max={20000} step={500} onChange={v => updateCfg("audit", v)} fmt={v => `$${v}`} />
                <SliderRow label="Monitor Price ($/mo)" value={cfgs[1].monitor} min={500} max={5000} step={100} onChange={v => updateCfg("monitor", v)} fmt={v => `$${v}`} />
                <SliderRow label="Enterprise Price ($/mo)" value={cfgs[1].enterprise} min={2000} max={20000} step={500} onChange={v => updateCfg("enterprise", v)} fmt={v => `$${v}`} />
                <SliderRow label="Enterprise Customer %" value={cfgs[1].entPct} min={5} max={50} step={1} onChange={v => updateCfg("entPct", v)} fmt={v => `${v}%`} />
              </>}

              {activeTab === 2 && <>
                <SliderRow label="Solo Price ($/mo)" value={cfgs[2].solo} min={199} max={999} step={50} onChange={v => updateCfg("solo", v)} fmt={v => `$${v}`} />
                <SliderRow label="Team Price ($/mo)" value={cfgs[2].team} min={999} max={5000} step={100} onChange={v => updateCfg("team", v)} fmt={v => `$${v}`} />
                <SliderRow label="Enterprise Price ($/mo)" value={cfgs[2].enterprise} min={2000} max={15000} step={500} onChange={v => updateCfg("enterprise", v)} fmt={v => `$${v}`} />
                <SliderRow label="Enterprise Customer %" value={cfgs[2].entPct} min={5} max={40} step={1} onChange={v => updateCfg("entPct", v)} fmt={v => `${v}%`} />
              </>}

              <SliderRow label="Monthly Growth Rate" value={cfgs[activeTab].growthRate} min={3} max={30} step={1} onChange={v => updateCfg("growthRate", v)} fmt={v => `${v}%`} />
              <SliderRow label="Monthly Churn Rate" value={cfgs[activeTab].churn} min={0.5} max={10} step={0.5} onChange={v => updateCfg("churn", v)} fmt={v => `${v}%`} />
              <SliderRow label="COGS %" value={cfgs[activeTab].cogs} min={10} max={60} step={1} onChange={v => updateCfg("cogs", v)} fmt={v => `${v}%`} />
              <SliderRow label="Monthly Base Burn ($)" value={cfgs[activeTab].burnBase} min={10000} max={120000} step={1000} onChange={v => updateCfg("burnBase", v)} fmt={v => fmtK(v)} />
              <SliderRow label="Starting Customers" value={cfgs[activeTab].initCustomers} min={1} max={50} step={1} onChange={v => updateCfg("initCustomers", v)} />
            </div>
          </div>
        )}

        {/* P&L Summary Table */}
        <div style={{ background: "#0d0d10", border: "1px solid #1e1e24", borderRadius: 6, padding: "20px", marginBottom: 20, overflowX: "auto" }}>
          <p style={{ fontSize: 9, color: "#444", fontFamily: "monospace", letterSpacing: 3, textTransform: "uppercase", margin: "0 0 16px" }}>
            P&L SUMMARY — END OF YEAR
          </p>
          <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "monospace", fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #1e1e24" }}>
                {["Metric", "Year 1", "Year 2", "Year 3"].map(h => (
                  <th key={h} style={{ textAlign: h === "Metric" ? "left" : "right", padding: "8px 10px", color: "#555", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", fontWeight: 400 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { label: "Customers", y1: y1[11]?.customers, y2: y2[11]?.customers, y3: y3[11]?.customers, fmt: v => v?.toLocaleString() },
                { label: "MRR", y1: y1[11]?.mrr, y2: y2[11]?.mrr, y3: y3[11]?.mrr, fmt: fmtK },
                { label: "ARR", y1: y1arr, y2: y2arr, y3: y3arr, fmt: fmtK, bold: true, color: startup.color },
                { label: "Gross Profit", y1: y1[11]?.grossProfit, y2: y2[11]?.grossProfit, y3: y3[11]?.grossProfit, fmt: fmtK },
                { label: "Gross Margin", y1: y1[11]?.grossMargin, y2: y2[11]?.grossMargin, y3: y3[11]?.grossMargin, fmt: fmtPct },
                { label: "Monthly Burn", y1: y1[11]?.burn, y2: y2[11]?.burn, y3: y3[11]?.burn, fmt: v => `(${fmtK(v)})`, color: "#C94C4C" },
                { label: "Net Position", y1: y1[11]?.netBurn, y2: y2[11]?.netBurn, y3: y3[11]?.netBurn, fmt: fmtK, color: (v) => v >= 0 ? "#4CC97A" : "#C94C4C" },
                { label: "Cash Balance", y1: y1[11]?.cashBalance, y2: y2[11]?.cashBalance, y3: y3[11]?.cashBalance, fmt: fmtK, bold: true },
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #141418", background: i % 2 === 0 ? "transparent" : "#0a0a0e" }}>
                  <td style={{ padding: "10px 10px", color: "#888", fontSize: 11 }}>{row.label}</td>
                  {[row.y1, row.y2, row.y3].map((v, j) => {
                    const c = typeof row.color === "function" ? row.color(v) : row.color;
                    return (
                      <td key={j} style={{
                        textAlign: "right", padding: "10px 10px",
                        color: c || (row.bold ? "#e8e4dc" : "#aaa"),
                        fontWeight: row.bold ? 700 : 400,
                        fontSize: row.bold ? 13 : 11
                      }}>
                        {v !== undefined ? (row.fmt ? row.fmt(v) : v) : "—"}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Valuation Estimate */}
        <div style={{ background: `linear-gradient(135deg, #0d0d10 0%, #111118 100%)`, border: `1px solid ${startup.color}33`, borderLeft: `3px solid ${startup.color}`, borderRadius: 6, padding: "20px" }}>
          <p style={{ fontSize: 9, color: "#555", fontFamily: "monospace", letterSpacing: 3, textTransform: "uppercase", margin: "0 0 12px" }}>
            💰 VALUATION ESTIMATE AT YEAR 3
          </p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {[
              { label: "Conservative (5x ARR)", val: y3arr * 5 },
              { label: "Base Case (8x ARR)", val: y3arr * 8 },
              { label: "Optimistic (12x ARR)", val: y3arr * 12 },
            ].map((v, i) => (
              <div key={i} style={{ flex: "1 1 120px", textAlign: "center" }}>
                <div style={{ fontSize: 10, color: "#555", fontFamily: "monospace", marginBottom: 6 }}>{v.label}</div>
                <div style={{ fontSize: 22, color: startup.color, fontWeight: 700, fontFamily: "monospace" }}>{fmtK(v.val)}</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 10, color: "#444", marginTop: 14, fontStyle: "italic", borderTop: "1px solid #1e1e24", paddingTop: 12 }}>
            Valuations based on SaaS ARR multiples. Actual exit value depends on growth rate, churn, NRR, and market conditions. Not financial advice.
          </p>
        </div>

        <p style={{ textAlign: "center", fontSize: 9, color: "#2a2a2e", fontFamily: "monospace", letterSpacing: 2, marginTop: 28 }}>
          BUILT FOR MC · AI EXECUTIVE SUITE · FINANCIAL MODEL 2026–2029
        </p>
      </div>
    </div>
  );
}
