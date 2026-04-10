import { useState } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis } from "recharts";
import { C } from '../constants/theme';

const slides = [
  { id: 0, label: "Cover", icon: "◆" },
  { id: 1, label: "Problem", icon: "!" },
  { id: 2, label: "Solution", icon: "✦" },
  { id: 3, label: "Product", icon: "⬡" },
  { id: 4, label: "Market", icon: "◎" },
  { id: 5, label: "Traction", icon: "↑" },
  { id: 6, label: "Business Model", icon: "$" },
  { id: 7, label: "Financials", icon: "∑" },
  { id: 8, label: "Competition", icon: "⊕" },
  { id: 9, label: "Go-To-Market", icon: "→" },
  { id: 10, label: "Team", icon: "◈" },
  { id: 11, label: "The Ask", icon: "★" },
];

function Tag({ children, color }) {
  return (
    <span style={{ display: "inline-block", padding: "3px 10px", background: `${color || C.gold}18`, border: `1px solid ${color || C.gold}44`, borderRadius: 2, fontSize: 9, color: color || C.gold, fontFamily: "monospace", letterSpacing: 2, textTransform: "uppercase" }}>
      {children}
    </span>
  );
}

function SectionLabel({ children }) {
  return <p style={{ fontSize: 9, letterSpacing: 4, color: C.muted, fontFamily: "monospace", textTransform: "uppercase", margin: "0 0 10px" }}>{children}</p>;
}

function Slide0() {
  return (
    <div style={{ minHeight: 520, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 40%, ${C.gold}11 0%, transparent 65%)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: 20, right: 20, width: 120, height: 120, borderRadius: "50%", border: `1px solid ${C.gold}22`, opacity: 0.4 }} />
      <div style={{ position: "absolute", bottom: 30, left: 20, width: 60, height: 60, borderRadius: "50%", border: `1px solid ${C.teal}33` }} />

      <Tag>Seed Round · 2026</Tag>
      <h1 style={{ fontSize: "clamp(32px,8vw,60px)", fontWeight: 300, letterSpacing: -2, margin: "20px 0 8px", fontFamily: "'Georgia', serif", lineHeight: 1.1 }}>
        AEXS
      </h1>
      <p style={{ fontSize: "clamp(14px,3vw,20px)", color: C.dim, fontStyle: "italic", margin: "0 0 24px", letterSpacing: 1 }}>
        AI Executive Suite
      </p>
      <div style={{ width: 48, height: 1, background: C.gold, margin: "0 auto 24px" }} />
      <p style={{ fontSize: 13, color: C.dim, maxWidth: 380, lineHeight: 1.8, margin: "0 0 32px" }}>
        The operating intelligence layer for the world's most ambitious executives — Chief of Staff, Governance, and Decision Support unified in one platform.
      </p>
      <div style={{ display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap" }}>
        {[["$32.2M", "Y3 ARR Target"], ["$257M", "Valuation (8x)"], ["Month 12", "Break-Even"]].map(([v, l]) => (
          <div key={l} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 22, color: C.gold, fontFamily: "monospace", fontWeight: 700 }}>{v}</div>
            <div style={{ fontSize: 9, color: C.muted, letterSpacing: 2, fontFamily: "monospace", textTransform: "uppercase" }}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Slide1() {
  const problems = [
    { icon: "🌊", title: "Executive Overload", stat: "73%", desc: "of C-suite leaders report decision fatigue daily. They're drowning in data with no synthesis layer." },
    { icon: "⚖️", title: "Regulatory Chaos", stat: "EU AI Act + 40+", desc: "national AI regulations now active. Most companies have zero compliance infrastructure." },
    { icon: "🔮", title: "Blind Decisions", stat: "$3T/yr", desc: "lost globally to poor executive decisions made without real-time competitive or market intelligence." },
    { icon: "🤖", title: "AI Adoption Gap", stat: "Only 12%", desc: "of Fortune 500 CEOs use AI tools daily in their core decision workflow. The gap is enormous." },
  ];
  return (
    <div>
      <SectionLabel>The Problem</SectionLabel>
      <h2 style={{ fontSize: "clamp(20px,5vw,32px)", fontWeight: 300, margin: "0 0 8px", lineHeight: 1.2 }}>
        Leaders are flying blind<br /><span style={{ color: C.gold }}>in an AI-powered world.</span>
      </h2>
      <p style={{ fontSize: 13, color: C.dim, margin: "0 0 28px", lineHeight: 1.7 }}>
        The tools executives rely on were built for a pre-AI era. No synthesis. No foresight. No compliance. Just noise.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {problems.map((p, i) => (
          <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 6, padding: "16px" }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{p.icon}</div>
            <div style={{ fontSize: 10, color: C.muted, fontFamily: "monospace", letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>{p.title}</div>
            <div style={{ fontSize: 20, color: "#C94C4C", fontFamily: "monospace", fontWeight: 700, marginBottom: 6 }}>{p.stat}</div>
            <p style={{ fontSize: 11, color: C.dim, margin: 0, lineHeight: 1.6 }}>{p.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Slide2() {
  return (
    <div>
      <SectionLabel>The Solution</SectionLabel>
      <h2 style={{ fontSize: "clamp(20px,5vw,32px)", fontWeight: 300, margin: "0 0 8px", lineHeight: 1.2 }}>
        One unified platform.<br /><span style={{ color: C.teal }}>Three layers of intelligence.</span>
      </h2>
      <p style={{ fontSize: 13, color: C.dim, margin: "0 0 24px", lineHeight: 1.7 }}>
        AEXS wraps AI around every executive function — from morning briefings to board compliance to strategic decisions.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {[
          { color: C.gold, emoji: "🧠", title: "AI Chief of Staff", sub: "Layer 1 · Operations", points: ["Daily executive briefings", "Meeting intelligence + action tracking", "Autonomous inbox triage", "Team performance dashboards"] },
          { color: C.blue, emoji: "⚖️", title: "AI Governance Engine", sub: "Layer 2 · Compliance", points: ["Automated EU AI Act compliance", "Bias detection + model auditing", "Real-time regulatory monitoring", "Board-ready certification reports"] },
          { color: C.purple, emoji: "📊", title: "Decision Intelligence", sub: "Layer 3 · Strategy", points: ["3-scenario decision modeling", "Live competitor intelligence", "Market signal aggregation", "Investment committee scoring"] },
        ].map((s, i) => (
          <div key={i} style={{ background: C.card, border: `1px solid ${s.color}33`, borderLeft: `3px solid ${s.color}`, borderRadius: 6, padding: "16px 20px", display: "flex", gap: 16, alignItems: "flex-start" }}>
            <div style={{ fontSize: 28, flexShrink: 0 }}>{s.emoji}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 4 }}>
                <div>
                  <div style={{ fontSize: 15, color: C.text, marginBottom: 2 }}>{s.title}</div>
                  <Tag color={s.color}>{s.sub}</Tag>
                </div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
                {s.points.map((p, j) => (
                  <span key={j} style={{ fontSize: 10, color: C.dim, background: "#13131a", border: `1px solid ${C.border}`, borderRadius: 3, padding: "3px 8px" }}>
                    ✓ {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Slide3() {
  const [active, setActive] = useState(0);
  const features = [
    {
      tab: "🧠 Chief of Staff", color: C.gold,
      screens: [
        { title: "Morning Brief", desc: "AI delivers a 90-second executive summary at 7AM every day — emails triaged, calendar conflicts resolved, top priorities ranked." },
        { title: "Meeting Intelligence", desc: "AI joins every meeting, transcribes, extracts action items, assigns owners, and follows up — automatically." },
        { title: "Executive Memory", desc: "Proprietary knowledge graph learns your communication style, key relationships, and decision history over time." },
      ]
    },
    {
      tab: "⚖️ Governance", color: C.blue,
      screens: [
        { title: "Risk Dashboard", desc: "Real-time compliance heatmap across all your AI systems, color-coded by regulatory risk level." },
        { title: "Bias Scanner", desc: "Automated fairness testing against protected attributes. Generates board-ready audit reports in 48 hours." },
        { title: "AI Certification", desc: "Official 'AEXS Certified' badge — a public, verifiable compliance credential that builds customer trust." },
      ]
    },
    {
      tab: "📊 Decision", color: C.purple,
      screens: [
        { title: "Scenario Engine", desc: "Any decision generates 3 scenarios — optimistic, base, pessimistic — with probability scores and risk factors." },
        { title: "Competitor Feed", desc: "Live monitoring: funding rounds, product launches, hiring signals, pricing changes. All in one feed." },
        { title: "Decision Tracker", desc: "Log decisions made on-platform. Measure actual outcomes at 30/60/90 days. Build your ROI proof." },
      ]
    },
  ];
  const f = features[active];
  return (
    <div>
      <SectionLabel>Product Deep Dive</SectionLabel>
      <h2 style={{ fontSize: "clamp(18px,4vw,28px)", fontWeight: 300, margin: "0 0 20px" }}>
        Built for how executives <span style={{ color: C.teal }}>actually work.</span>
      </h2>
      <div style={{ display: "flex", gap: 6, marginBottom: 20, overflowX: "auto" }}>
        {features.map((ft, i) => (
          <button key={i} onClick={() => setActive(i)} style={{
            flex: "0 0 auto", padding: "8px 14px", border: `1px solid ${active === i ? ft.color : C.border}`,
            background: active === i ? `${ft.color}18` : "transparent", color: active === i ? ft.color : C.muted,
            fontFamily: "monospace", fontSize: 10, cursor: "pointer", borderRadius: 4, letterSpacing: 1
          }}>{ft.tab}</button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        {f.screens.map((s, i) => (
          <div key={i} style={{ background: C.card, border: `1px solid ${f.color}33`, borderRadius: 6, padding: "16px" }}>
            <div style={{ width: "100%", height: 60, background: `linear-gradient(135deg, ${f.color}18 0%, ${C.dark} 100%)`, borderRadius: 4, marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: f.color, opacity: 0.6 }} />
            </div>
            <div style={{ fontSize: 12, color: C.text, marginBottom: 6 }}>{s.title}</div>
            <p style={{ fontSize: 10, color: C.dim, margin: 0, lineHeight: 1.6 }}>{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Slide4() {
  const pieData = [
    { name: "Enterprise SW", value: 180, color: C.gold },
    { name: "AI SaaS", value: 140, color: C.teal },
    { name: "GRC Software", value: 85, color: C.blue },
    { name: "Exec Tools", value: 45, color: C.purple },
  ];
  return (
    <div>
      <SectionLabel>Market Opportunity</SectionLabel>
      <h2 style={{ fontSize: "clamp(18px,4vw,28px)", fontWeight: 300, margin: "0 0 8px" }}>
        A <span style={{ color: C.gold }}>$450B+</span> addressable market<br />at the intersection of four categories.
      </h2>
      <p style={{ fontSize: 13, color: C.dim, margin: "0 0 24px", lineHeight: 1.7 }}>AEXS competes in — and bridges — enterprise software, AI SaaS, GRC, and executive productivity.</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "center" }}>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} dataKey="value" paddingAngle={3}>
              {pieData.map((e, i) => <Cell key={i} fill={e.color} opacity={0.85} />)}
            </Pie>
            <Tooltip formatter={(v) => `$${v}B`} contentStyle={{ background: C.card, border: `1px solid ${C.border}`, fontFamily: "monospace", fontSize: 10 }} />
          </PieChart>
        </ResponsiveContainer>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {pieData.map((d, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: C.card, border: `1px solid ${d.color}33`, borderRadius: 4 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: d.color }} />
                <span style={{ fontSize: 11, color: C.dim }}>{d.name}</span>
              </div>
              <span style={{ fontSize: 13, color: d.color, fontFamily: "monospace", fontWeight: 700 }}>${d.value}B</span>
            </div>
          ))}
          <div style={{ padding: "10px 12px", background: `${C.teal}11`, border: `1px solid ${C.teal}33`, borderRadius: 4 }}>
            <div style={{ fontSize: 9, color: C.muted, fontFamily: "monospace", letterSpacing: 2, marginBottom: 4 }}>OUR SERVICEABLE MARKET</div>
            <div style={{ fontSize: 18, color: C.teal, fontFamily: "monospace", fontWeight: 700 }}>$28B SAM</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Slide5() {
  const milestones = [
    { done: true, q: "Q1 2026", title: "Concept & Research", items: ["10 executive interviews", "Regulatory mapping complete", "Tech stack chosen"] },
    { done: false, q: "Q2 2026", title: "MVP Build", items: ["Chief of Staff MVP live", "20 beta users onboarded", "First $15K MRR"] },
    { done: false, q: "Q3 2026", title: "Beta → Paid", items: ["100 paying customers", "$80K MRR", "Governance module launch"] },
    { done: false, q: "Q4 2026", title: "Series A Raise", items: ["$1M ARR milestone", "Decision Suite launch", "Series A close"] },
  ];
  return (
    <div>
      <SectionLabel>Traction & Milestones</SectionLabel>
      <h2 style={{ fontSize: "clamp(18px,4vw,28px)", fontWeight: 300, margin: "0 0 8px" }}>
        Early signal is <span style={{ color: C.teal }}>exceptionally strong.</span>
      </h2>
      <p style={{ fontSize: 13, color: C.dim, margin: "0 0 24px", lineHeight: 1.7 }}>Built on direct insight from 10+ C-suite executives. Product-market fit validated before a line of code was written.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {milestones.map((m, i) => (
          <div key={i} style={{ display: "flex", gap: 16, paddingBottom: 20, position: "relative" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: m.done ? C.teal : C.card, border: `2px solid ${m.done ? C.teal : C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: m.done ? "#000" : C.muted, fontWeight: 700 }}>
                {m.done ? "✓" : "○"}
              </div>
              {i < milestones.length - 1 && <div style={{ width: 1, flex: 1, background: m.done ? `${C.teal}44` : C.border, minHeight: 20, marginTop: 4 }} />}
            </div>
            <div style={{ flex: 1, paddingBottom: 4 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8, flexWrap: "wrap" }}>
                <Tag color={m.done ? C.teal : C.muted}>{m.q}</Tag>
                <span style={{ fontSize: 13, color: m.done ? C.text : C.muted }}>{m.title}</span>
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {m.items.map((item, j) => (
                  <span key={j} style={{ fontSize: 10, color: C.dim, background: C.card, border: `1px solid ${C.border}`, borderRadius: 3, padding: "3px 8px" }}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Slide6() {
  const tiers = [
    { name: "Starter", price: "$499/mo", color: C.gold, target: "Solo executive", features: ["AI executive assistant", "Daily briefings", "Email + calendar", "5 meeting summaries/mo"] },
    { name: "Growth", price: "$1,999/mo", color: C.teal, target: "Leadership team (up to 5)", features: ["Full executive assistant", "Compliance & governance", "Unlimited meetings", "Priority scoring engine"], highlight: true },
    { name: "Enterprise", price: "$8,500/mo", color: C.purple, target: "Full C-suite + board", features: ["All 3 modules", "Decision intelligence", "White-glove onboarding", "Custom data feeds", "AI Compliance Cert"] },
  ];
  return (
    <div>
      <SectionLabel>Business Model</SectionLabel>
      <h2 style={{ fontSize: "clamp(18px,4vw,28px)", fontWeight: 300, margin: "0 0 8px" }}>
        SaaS subscription + <span style={{ color: C.gold }}>outcome-based upsells.</span>
      </h2>
      <p style={{ fontSize: 13, color: C.dim, margin: "0 0 20px", lineHeight: 1.7 }}>Three tiers designed to land small and expand. NRR target: 130%+.</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
        {tiers.map((t, i) => (
          <div key={i} style={{ background: t.highlight ? `${t.color}0d` : C.card, border: `1px solid ${t.color}${t.highlight ? "66" : "33"}`, borderRadius: 6, padding: "16px", position: "relative" }}>
            {t.highlight && <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", background: t.color, color: "#000", fontSize: 8, fontFamily: "monospace", letterSpacing: 2, padding: "3px 10px", borderRadius: 2, textTransform: "uppercase", fontWeight: 700 }}>Most Popular</div>}
            <div style={{ fontSize: 9, color: t.color, fontFamily: "monospace", letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>{t.name}</div>
            <div style={{ fontSize: 20, color: C.text, fontFamily: "monospace", fontWeight: 700, marginBottom: 4 }}>{t.price}</div>
            <div style={{ fontSize: 10, color: C.muted, marginBottom: 14, fontStyle: "italic" }}>{t.target}</div>
            {t.features.map((f, j) => (
              <div key={j} style={{ fontSize: 10, color: C.dim, padding: "5px 0", borderBottom: j < t.features.length - 1 ? `1px solid ${C.border}` : "none" }}>
                <span style={{ color: t.color }}>✓</span> {f}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        {[["One-time Audit", "$25K", "AI compliance certification"], ["Gov Reports", "$2.5K", "Per benchmark report"], ["White Label", "$15K+/mo", "For consulting firms"]].map(([l, v, d]) => (
          <div key={l} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 4, padding: "12px" }}>
            <div style={{ fontSize: 9, color: C.muted, fontFamily: "monospace", letterSpacing: 2, marginBottom: 4 }}>{l}</div>
            <div style={{ fontSize: 16, color: C.gold, fontFamily: "monospace", fontWeight: 700 }}>{v}</div>
            <div style={{ fontSize: 10, color: C.muted, marginTop: 3 }}>{d}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Slide7() {
  const data = [
    { year: "Y1", ARR: 2.6, Burn: 1.8 },
    { year: "Y2", ARR: 9.2, Burn: 3.8 },
    { year: "Y3", ARR: 32.2, Burn: 6.0 },
  ];
  const metrics = [
    { label: "Seed Round", value: "$1.5M", color: C.gold },
    { label: "Break-Even", value: "Month 12", color: C.blue },
    { label: "Y3 ARR", value: "$32.2M", color: C.purple },
    { label: "Y3 Valuation (8x)", value: "$257M", color: C.gold },
    { label: "Gross Margin Y3", value: "73%", color: C.teal },
  ];
  return (
    <div>
      <SectionLabel>Financial Projections</SectionLabel>
      <h2 style={{ fontSize: "clamp(18px,4vw,28px)", fontWeight: 300, margin: "0 0 8px" }}>
        Path to <span style={{ color: C.gold }}>$32.2M ARR</span> in 36 months.
      </h2>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
        {metrics.map((m, i) => (
          <div key={i} style={{ background: C.card, border: `1px solid ${m.color}33`, borderRadius: 4, padding: "10px 14px", flex: "1 1 100px" }}>
            <div style={{ fontSize: 9, color: C.muted, fontFamily: "monospace", letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>{m.label}</div>
            <div style={{ fontSize: 16, color: m.color, fontFamily: "monospace", fontWeight: 700 }}>{m.value}</div>
          </div>
        ))}
      </div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 6, padding: "16px" }}>
        <p style={{ fontSize: 9, color: C.muted, fontFamily: "monospace", letterSpacing: 2, margin: "0 0 12px", textTransform: "uppercase" }}>ARR vs Cumulative Burn ($M)</p>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={data} barGap={4}>
            <XAxis dataKey="year" tick={{ fill: C.muted, fontSize: 10, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: C.muted, fontSize: 10, fontFamily: "monospace" }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}M`} />
            <Tooltip contentStyle={{ background: C.card, border: `1px solid ${C.border}`, fontFamily: "monospace", fontSize: 10 }} formatter={v => `$${v}M`} />
            <Bar dataKey="ARR" fill={C.teal} radius={[3, 3, 0, 0]} opacity={0.85} />
            <Bar dataKey="Burn" fill={C.muted} radius={[3, 3, 0, 0]} opacity={0.5} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function Slide8() {
  const competitors = [
    { name: "AEXS", cos: true, gov: true, dss: true, unified: true, aiNative: true, color: C.teal },
    { name: "Monday.com", cos: true, gov: false, dss: false, unified: false, aiNative: false, color: C.muted },
    { name: "OneTrust", cos: false, gov: true, dss: false, unified: false, aiNative: false, color: C.muted },
    { name: "Gartner", cos: false, gov: false, dss: true, unified: false, aiNative: false, color: C.muted },
    { name: "Notion AI", cos: true, gov: false, dss: false, unified: false, aiNative: true, color: C.muted },
  ];
  const cols = ["Chief of Staff", "Governance", "Decision Intel", "Unified Suite", "AI-Native"];
  const keys = ["cos", "gov", "dss", "unified", "aiNative"];
  return (
    <div>
      <SectionLabel>Competitive Landscape</SectionLabel>
      <h2 style={{ fontSize: "clamp(18px,4vw,28px)", fontWeight: 300, margin: "0 0 8px" }}>
        No one owns the <span style={{ color: C.teal }}>full executive stack.</span>
      </h2>
      <p style={{ fontSize: 13, color: C.dim, margin: "0 0 20px", lineHeight: 1.7 }}>Point solutions exist for each function. AEXS is the only unified AI-native executive intelligence platform.</p>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "monospace" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
              <th style={{ textAlign: "left", padding: "8px 12px", fontSize: 9, color: C.muted, letterSpacing: 2, textTransform: "uppercase", fontWeight: 400 }}>Platform</th>
              {cols.map(c => <th key={c} style={{ padding: "8px 8px", fontSize: 9, color: C.muted, letterSpacing: 1, textTransform: "uppercase", fontWeight: 400, textAlign: "center" }}>{c}</th>)}
            </tr>
          </thead>
          <tbody>
            {competitors.map((co, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${C.border}`, background: co.name === "AEXS" ? `${C.teal}08` : "transparent" }}>
                <td style={{ padding: "12px 12px", fontSize: 13, color: co.color, fontWeight: co.name === "AEXS" ? 700 : 400 }}>
                  {co.name === "AEXS" && <span style={{ color: C.teal }}>★ </span>}{co.name}
                </td>
                {keys.map(k => (
                  <td key={k} style={{ textAlign: "center", padding: "12px 8px" }}>
                    {co[k]
                      ? <span style={{ color: co.name === "AEXS" ? C.teal : "#4CC97A88", fontSize: 14 }}>✓</span>
                      : <span style={{ color: "#C94C4C66", fontSize: 14 }}>✗</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
        {["Executive Memory Graph", "Cross-module AI reasoning", "Regulatory certification", "Outcome tracking"].map((m, i) => (
          <div key={i} style={{ padding: "6px 12px", background: `${C.teal}11`, border: `1px solid ${C.teal}33`, borderRadius: 3, fontSize: 10, color: C.teal }}>
            🔒 {m}
          </div>
        ))}
      </div>
    </div>
  );
}

function Slide9() {
  const phases = [
    { label: "Phase 1", title: "Land (0–6mo)", color: C.gold, channels: ["LinkedIn thought leadership", "CEO community seeding", "Warm network outreach", "ProductHunt launch"] },
    { label: "Phase 2", title: "Expand (6–18mo)", color: C.blue, channels: ["VC portfolio distribution", "Executive coach partners", "Content: 'CEO Brief' newsletter", "Conference sponsorships"] },
    { label: "Phase 3", title: "Dominate (18–36mo)", color: C.purple, channels: ["Big 4 white-label deals", "Government tender bids", "Global regulatory expansion", "Platform API marketplace"] },
  ];
  return (
    <div>
      <SectionLabel>Go-To-Market Strategy</SectionLabel>
      <h2 style={{ fontSize: "clamp(18px,4vw,28px)", fontWeight: 300, margin: "0 0 8px" }}>
        Land with one module.<br /><span style={{ color: C.gold }}>Expand across the suite.</span>
      </h2>
      <p style={{ fontSize: 13, color: C.dim, margin: "0 0 20px", lineHeight: 1.7 }}>Chief of Staff is the trojan horse. Once embedded, Governance and Decision Support become natural upsells with 130%+ NRR.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {phases.map((p, i) => (
          <div key={i} style={{ background: C.card, border: `1px solid ${p.color}33`, borderRadius: 6, padding: "16px 20px", display: "flex", gap: 16, alignItems: "flex-start" }}>
            <div style={{ flexShrink: 0, textAlign: "center" }}>
              <Tag color={p.color}>{p.label}</Tag>
              <div style={{ fontSize: 11, color: p.color, marginTop: 6 }}>{p.title}</div>
            </div>
            <div style={{ flex: 1, display: "flex", flexWrap: "wrap", gap: 6 }}>
              {p.channels.map((c, j) => (
                <span key={j} style={{ fontSize: 10, color: C.dim, background: "#13131a", border: `1px solid ${C.border}`, borderRadius: 3, padding: "4px 10px" }}>→ {c}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        {[["CAC Target", "$800", "via content + partners"], ["LTV Target", "$96K", "at 10yr enterprise"], ["LTV:CAC", "120x", "world-class ratio"]].map(([l, v, s]) => (
          <div key={l} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 4, padding: "12px", textAlign: "center" }}>
            <div style={{ fontSize: 9, color: C.muted, fontFamily: "monospace", letterSpacing: 2, marginBottom: 4, textTransform: "uppercase" }}>{l}</div>
            <div style={{ fontSize: 20, color: C.teal, fontFamily: "monospace", fontWeight: 700 }}>{v}</div>
            <div style={{ fontSize: 10, color: C.muted, marginTop: 3 }}>{s}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Slide10() {
  const team = [
    { name: "Mc", role: "CEO & Founder", bio: "Visionary executive leader. Deep expertise in AI-augmented leadership and organizational strategy. Product vision and GTM.", color: C.gold, initials: "MC" },
    { name: "AI Chief of Staff", role: "Operations Intelligence", bio: "Autonomous agent managing executive operations layer. Meeting intelligence, briefings, inbox, and team coordination.", color: C.blue, initials: "AI" },
    { name: "AI Governance Engine", role: "Compliance Intelligence", bio: "Regulatory monitoring, bias detection, and certification engine. EU AI Act, ISO 42001, and global frameworks.", color: C.purple, initials: "⚖" },
    { name: "AI Decision Agent", role: "Strategic Intelligence", bio: "Scenario modeling, competitor intelligence, and decision scoring. Real-time signal aggregation and pattern recognition.", color: C.teal, initials: "↗" },
  ];
  const advisors = ["Ex-Regulator (EU AI Act)", "Compliance Partner (Big 4)", "VC Advisor (AI-focused)", "Enterprise Sales Lead"];
  return (
    <div>
      <SectionLabel>Team</SectionLabel>
      <h2 style={{ fontSize: "clamp(18px,4vw,28px)", fontWeight: 300, margin: "0 0 8px" }}>
        Human vision.<br /><span style={{ color: C.gold }}>AI execution power.</span>
      </h2>
      <p style={{ fontSize: 13, color: C.dim, margin: "0 0 20px", lineHeight: 1.7 }}>AEXS is built on a radical premise: that AI agents are team members, not just tools.</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
        {team.map((t, i) => (
          <div key={i} style={{ background: C.card, border: `1px solid ${t.color}33`, borderLeft: `3px solid ${t.color}`, borderRadius: 6, padding: "16px", display: "flex", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: `${t.color}22`, border: `1px solid ${t.color}55`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: t.color, fontFamily: "monospace", fontWeight: 700, flexShrink: 0 }}>
              {t.initials}
            </div>
            <div>
              <div style={{ fontSize: 13, color: C.text, marginBottom: 2 }}>{t.name}</div>
              <div style={{ fontSize: 9, color: t.color, fontFamily: "monospace", letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>{t.role}</div>
              <p style={{ fontSize: 10, color: C.dim, margin: 0, lineHeight: 1.6 }}>{t.bio}</p>
            </div>
          </div>
        ))}
      </div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 6, padding: "14px 16px" }}>
        <div style={{ fontSize: 9, color: C.muted, fontFamily: "monospace", letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>Advisory Network (Building)</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {advisors.map((a, i) => (
            <span key={i} style={{ fontSize: 10, color: C.dim, background: "#13131a", border: `1px solid ${C.border}`, borderRadius: 3, padding: "4px 10px" }}>+ {a}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Slide11() {
  const use = [
    { label: "Product & Engineering", pct: 45, color: C.teal },
    { label: "Sales & Marketing", pct: 30, color: C.gold },
    { label: "Operations & Legal", pct: 15, color: C.blue },
    { label: "Reserve", pct: 10, color: C.muted },
  ];
  return (
    <div>
      <SectionLabel>The Ask</SectionLabel>
      <h2 style={{ fontSize: "clamp(20px,5vw,34px)", fontWeight: 300, margin: "0 0 8px", lineHeight: 1.2 }}>
        Raising <span style={{ color: C.gold }}>$1.5M Seed</span><br />to reach $1M ARR.
      </h2>
      <p style={{ fontSize: 13, color: C.dim, margin: "0 0 24px", lineHeight: 1.7 }}>Break-even at Month 12. 100 enterprise customers. Series A ready.</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        <div style={{ background: C.card, border: `1px solid ${C.gold}44`, borderRadius: 6, padding: "20px" }}>
          <div style={{ fontSize: 9, color: C.muted, fontFamily: "monospace", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Round Details</div>
          {[["Round", "Pre-Seed / Seed"], ["Amount", "$1.5M"], ["Instrument", "SAFE / Equity"], ["Valuation Cap", "$8M"], ["Min Ticket", "$25K"], ["Lead Investor", "Seeking"]].map(([l, v]) => (
            <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${C.border}`, fontSize: 11 }}>
              <span style={{ color: C.muted, fontFamily: "monospace" }}>{l}</span>
              <span style={{ color: l === "Amount" ? C.gold : C.text, fontWeight: l === "Amount" ? 700 : 400 }}>{v}</span>
            </div>
          ))}
        </div>

        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 6, padding: "20px" }}>
          <div style={{ fontSize: 9, color: C.muted, fontFamily: "monospace", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Use of Funds</div>
          {use.map((u, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 10, color: C.dim }}>{u.label}</span>
                <span style={{ fontSize: 10, color: u.color, fontFamily: "monospace" }}>{u.pct}%</span>
              </div>
              <div style={{ height: 4, background: C.border, borderRadius: 2 }}>
                <div style={{ width: `${u.pct}%`, height: "100%", background: u.color, borderRadius: 2 }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: `linear-gradient(135deg, ${C.gold}0d 0%, ${C.teal}08 100%)`, border: `1px solid ${C.gold}33`, borderRadius: 6, padding: "20px", textAlign: "center" }}>
        <p style={{ fontSize: 13, color: C.dim, margin: "0 0 12px", fontStyle: "italic", lineHeight: 1.7 }}>
          "We are not building another productivity tool. We are building the operating system for the AI-augmented executive."
        </p>
        <div style={{ fontSize: 11, color: C.gold, fontFamily: "monospace", letterSpacing: 2 }}>— Mc, Founder & CEO</div>
        <div style={{ marginTop: 16, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <div style={{ padding: "10px 20px", background: C.gold, color: "#000", borderRadius: 4, fontSize: 11, fontFamily: "monospace", fontWeight: 700, letterSpacing: 2, cursor: "pointer" }}>
            REQUEST DECK PDF →
          </div>
          <div style={{ padding: "10px 20px", background: "transparent", border: `1px solid ${C.gold}`, color: C.gold, borderRadius: 4, fontSize: 11, fontFamily: "monospace", letterSpacing: 2, cursor: "pointer" }}>
            SCHEDULE CALL
          </div>
        </div>
      </div>
    </div>
  );
}

const SLIDE_COMPONENTS = [Slide0, Slide1, Slide2, Slide3, Slide4, Slide5, Slide6, Slide7, Slide8, Slide9, Slide10, Slide11];

export default function App() {
  const [current, setCurrent] = useState(0);
  const SlideComp = SLIDE_COMPONENTS[current];

  return (
    <div style={{ minHeight: "100vh", background: C.dark, color: C.text, fontFamily: "'Georgia', 'Times New Roman', serif", display: "flex", flexDirection: "column" }}>

      {/* Top Nav */}
      <div style={{ background: "#0b0b0f", borderBottom: `1px solid ${C.border}`, padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
        <div>
          <span style={{ fontSize: 14, fontFamily: "monospace", color: C.gold, fontWeight: 700, letterSpacing: 2 }}>AEXS</span>
          <span style={{ fontSize: 10, color: C.muted, fontFamily: "monospace", marginLeft: 12, letterSpacing: 2 }}>AI EXECUTIVE SUITE · INVESTOR DECK</span>
        </div>
        <div style={{ fontSize: 10, color: C.muted, fontFamily: "monospace" }}>
          {current + 1} / {slides.length}
        </div>
      </div>

      {/* Slide Nav */}
      <div style={{ background: "#0b0b0f", borderBottom: `1px solid ${C.border}`, padding: "8px 20px", display: "flex", gap: 4, overflowX: "auto", flexShrink: 0 }}>
        {slides.map((s, i) => (
          <button key={i} onClick={() => setCurrent(i)} style={{
            flex: "0 0 auto", padding: "6px 10px", border: `1px solid ${current === i ? C.gold : "transparent"}`,
            background: current === i ? `${C.gold}18` : "transparent",
            color: current === i ? C.gold : C.muted, fontFamily: "monospace", fontSize: 9,
            cursor: "pointer", borderRadius: 3, letterSpacing: 1, whiteSpace: "nowrap",
            transition: "all 0.2s"
          }}>
            <span style={{ marginRight: 4 }}>{s.icon}</span>{s.label}
          </button>
        ))}
      </div>

      {/* Main Slide */}
      <div style={{ flex: 1, overflowY: "auto", padding: "24px 20px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <SlideComp />
        </div>
      </div>

      {/* Bottom Nav */}
      <div style={{ background: "#0b0b0f", borderTop: `1px solid ${C.border}`, padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
        <button onClick={() => setCurrent(Math.max(0, current - 1))} disabled={current === 0}
          style={{ padding: "8px 16px", background: "transparent", border: `1px solid ${current === 0 ? C.border : C.gold}`, color: current === 0 ? C.muted : C.gold, fontFamily: "monospace", fontSize: 10, cursor: current === 0 ? "default" : "pointer", borderRadius: 3, letterSpacing: 2 }}>
          ← PREV
        </button>

        <div style={{ display: "flex", gap: 4 }}>
          {slides.map((_, i) => (
            <div key={i} onClick={() => setCurrent(i)} style={{ width: current === i ? 16 : 6, height: 6, borderRadius: 3, background: current === i ? C.gold : C.border, cursor: "pointer", transition: "all 0.2s" }} />
          ))}
        </div>

        <button onClick={() => setCurrent(Math.min(slides.length - 1, current + 1))} disabled={current === slides.length - 1}
          style={{ padding: "8px 16px", background: current === slides.length - 1 ? "transparent" : C.gold, border: `1px solid ${C.gold}`, color: current === slides.length - 1 ? C.muted : "#000", fontFamily: "monospace", fontSize: 10, cursor: current === slides.length - 1 ? "default" : "pointer", borderRadius: 3, letterSpacing: 2, fontWeight: 700 }}>
          NEXT →
        </button>
      </div>
    </div>
  );
}
