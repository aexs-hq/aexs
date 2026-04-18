import { useState, useMemo } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import pitchData from '../../content/pitch-data.json';
import { fmtK, fmtPct } from '../utils/format';
import { calcSuite, suiteDefaults } from '../utils/suiteCalc';

const SliderRow = ({ label, value, min, max, step, onChange, fmt }) => (
  <div style={{ marginBottom: 12 }}>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
      <span style={{ fontSize: 11, color: "#888", fontFamily: "monospace", letterSpacing: 1 }}>{label}</span>
      <span style={{ fontSize: 11, color: "#e8c97a", fontFamily: "monospace", fontWeight: 700 }}>{fmt ? fmt(value) : value}</span>
    </div>
    <input type="range" min={min} max={max} step={step} value={value}
      onChange={e => onChange(parseFloat(e.target.value))}
      style={{ width: "100%", accentColor: 'var(--color-teal)', height: 3, cursor: "pointer" }} />
  </div>
);

const KPI = ({ label, value, sub, color }) => (
  <div style={{ background: "#0e0e12", border: "1px solid #222", borderRadius: 4, padding: "14px 16px", flex: "1 1 120px" }}>
    <div style={{ fontSize: 10, color: "#555", fontFamily: "monospace", letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
    <div style={{ fontSize: 20, fontWeight: 700, color: color || "#e8e4dc", fontFamily: "monospace" }}>{value}</div>
    {sub && <div style={{ fontSize: 10, color: "#555", marginTop: 3 }}>{sub}</div>}
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#111115", border: "1px solid #2a2a2e", borderRadius: 4, padding: "10px 14px", fontSize: 11, fontFamily: "monospace" }}>
      <div style={{ color: "#888", marginBottom: 6 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || 'var(--color-teal)', marginBottom: 2 }}>
          {p.name}: {fmtK(p.value)}
        </div>
      ))}
    </div>
  );
};

export default function FinancialModel() {
  const [cfg, setCfg] = useState({ ...suiteDefaults });
  const [activeChart, setActiveChart] = useState("mrr");

  const months = useMemo(() => calcSuite(cfg), [cfg]);

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

  const yearlyData = [
    { year: "Year 1", ARR: y1arr / 1000 },
    { year: "Year 2", ARR: y2arr / 1000 },
    { year: "Year 3", ARR: y3arr / 1000 },
  ];

  const set = (key, val) => setCfg(p => ({ ...p, [key]: val }));

  return (
    <div style={{ color: "#e8e4dc", fontFamily: "'Georgia', serif" }}>

      {/* Header */}
      <div style={{ background: "#0d0d10", borderBottom: "1px solid #1e1e24", padding: "20px 20px 20px" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <p style={{ fontSize: 9, letterSpacing: 4, color: "#444", fontFamily: "monospace", textTransform: "uppercase", margin: "0 0 4px" }}>
            INTERACTIVE FINANCIAL MODEL · 36-MONTH PROJECTION
          </p>
          <h1 style={{ fontSize: "clamp(18px, 4vw, 28px)", fontWeight: 400, margin: "0 0 4px", letterSpacing: -0.5 }}>
            AEXS Suite — Financial Model
          </h1>
          <p style={{ fontSize: 11, color: "#555", fontFamily: "monospace", margin: 0 }}>
            Suite tiers: Starter {pitchData.product_pricing[0].price.split('/')[0]} · Growth {pitchData.product_pricing[1].price.split('/')[0]} · Enterprise {pitchData.product_pricing[2].price.split('/')[0]}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 780, margin: "0 auto", padding: "24px 20px" }}>

        {/* KPI Row */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 24 }}>
          <KPI label="Y1 ARR" value={fmtK(y1arr)} sub="End of Year 1" color={'var(--color-teal)'} />
          <KPI label="Y2 ARR" value={fmtK(y2arr)} sub="End of Year 2" color={'var(--color-teal)'} />
          <KPI label="Y3 ARR" value={fmtK(y3arr)} sub="End of Year 3" color={'var(--color-teal)'} />
          <KPI label="Break-Even" value={beMonth ? `Month ${beMonth.month}` : "36m+"} sub="First profitable month" color={beMonth ? "#4CC97A" : "#C94C4C"} />
          <KPI label="Y3 Margin" value={fmtPct(y3Margin)} sub="Gross margin" color={'var(--color-purple-ui)'} />
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
              <Tooltip content={<CustomTooltip />} formatter={v => fmtK(v * 1000)} />
              <Bar dataKey="ARR" fill={'var(--color-teal)'} radius={[3, 3, 0, 0]} opacity={0.85} />
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
                    padding: "4px 10px", border: `1px solid ${activeChart === k ? 'var(--color-teal)' : '#2a2a2e'}`,
                    background: activeChart === k ? 'color-mix(in srgb, var(--color-teal) 13%, transparent)' : 'transparent',
                    color: activeChart === k ? 'var(--color-teal)' : '#555',
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
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={0} stroke="#2a2a2e" strokeDasharray="4 4" />
              <Line type="monotone"
                dataKey={activeChart === "mrr" ? "MRR" : activeChart === "cashBalance" ? "Cash Balance" : activeChart === "netBurn" ? "Net Burn" : "Customers"}
                stroke={'var(--color-teal)'} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Assumptions Panel */}
        <div style={{ background: "#0d0d10", border: "1px solid #1e1e24", borderRadius: 6, padding: "20px", marginBottom: 20 }}>
          <p style={{ fontSize: 9, color: "#444", fontFamily: "monospace", letterSpacing: 3, textTransform: "uppercase", margin: "0 0 20px" }}>
            ⚙️ ADJUST ASSUMPTIONS — MODEL UPDATES LIVE
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }}>
            <SliderRow label="Starter Price ($/mo)" value={cfg.starter} min={199} max={999} step={50}
              onChange={v => set("starter", v)} fmt={v => `$${v}`} />
            <SliderRow label="Growth Price ($/mo)" value={cfg.growth} min={499} max={4999} step={100}
              onChange={v => set("growth", v)} fmt={v => `$${v}`} />
            <SliderRow label="Enterprise Price ($/mo)" value={cfg.enterprise} min={2000} max={20000} step={500}
              onChange={v => set("enterprise", v)} fmt={v => `$${v}`} />
            <SliderRow label="Enterprise Customer %" value={cfg.entPct} min={5} max={40} step={1}
              onChange={v => set("entPct", v)} fmt={v => `${v}%`} />
            <SliderRow label="Monthly Growth Rate" value={cfg.growthRate} min={3} max={30} step={1}
              onChange={v => set("growthRate", v)} fmt={v => `${v}%`} />
            <SliderRow label="Monthly Churn Rate" value={cfg.churn} min={0.5} max={10} step={0.5}
              onChange={v => set("churn", v)} fmt={v => `${v}%`} />
            <SliderRow label="COGS %" value={cfg.cogs} min={10} max={60} step={1}
              onChange={v => set("cogs", v)} fmt={v => `${v}%`} />
            <SliderRow label="Monthly Base Burn ($)" value={cfg.burnBase} min={50000} max={300000} step={5000}
              onChange={v => set("burnBase", v)} fmt={v => fmtK(v)} />
            <SliderRow label="Starting Customers" value={cfg.initCustomers} min={5} max={100} step={1}
              onChange={v => set("initCustomers", v)} />
          </div>
        </div>

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
                { label: "ARR", y1: y1arr, y2: y2arr, y3: y3arr, fmt: fmtK, bold: true, color: 'var(--color-teal)' },
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
        <div style={{ background: `linear-gradient(135deg, #0d0d10 0%, #111118 100%)`, border: '1px solid color-mix(in srgb, var(--color-teal) 20%, transparent)', borderLeft: '3px solid var(--color-teal)', borderRadius: 6, padding: "20px" }}>
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
                <div style={{ fontSize: 22, color: 'var(--color-teal)', fontWeight: 700, fontFamily: "monospace" }}>{fmtK(v.val)}</div>
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
