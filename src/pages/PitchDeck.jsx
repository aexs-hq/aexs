import { useEffect, useRef, useState } from 'react';

const SLIDES = [
  { id: 'cover',       label: 'Cover',          icon: '◆', accent: '#C8A84B' },
  { id: 'problem',     label: 'Problem',        icon: '⚠', accent: '#ef4444' },
  { id: 'solution',    label: 'Solution',       icon: '✦', accent: '#C8A84B' },
  { id: 'product',     label: 'Product',        icon: '⬡', accent: '#3b82f6' },
  { id: 'market',      label: 'Market',         icon: '◎', accent: '#a855f7' },
  { id: 'traction',    label: 'Traction',       icon: '▲', accent: '#22c55e' },
  { id: 'model',       label: 'Business Model', icon: '◈', accent: '#C8A84B' },
  { id: 'financials',  label: 'Financials',     icon: '↑', accent: '#22c55e' },
  { id: 'competition', label: 'Competition',    icon: '⊕', accent: '#f97316' },
  { id: 'gtm',         label: 'Go-To-Market',   icon: '→', accent: '#3b82f6' },
  { id: 'team',        label: 'Team',           icon: '◉', accent: '#C8A84B' },
  { id: 'ask',         label: 'The Ask',        icon: '★', accent: '#C8A84B' },
];

/* ─── Financials slide as its own component to manage bar-animation observer ─── */
function FinancialsSlide({ onRef }) {
  const [animated, setAnimated] = useState(false);
  const localRef = useRef(null);

  const setRef = (el) => {
    localRef.current = el;
    onRef(el);
  };

  useEffect(() => {
    const el = localRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setAnimated(true); },
      { threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const bars = [
    { label: 'Pre-Rev', arr: 0,    color: '#475569', pct: 2  },
    { label: 'Y1 H1',  arr: 0.8,  color: '#C8A84B', pct: 5  },
    { label: 'Y1',     arr: 2.6,  color: '#C8A84B', pct: 15 },
    { label: 'Y2',     arr: 9.2,  color: '#22c55e', pct: 45 },
    { label: 'Y3',     arr: 32.2, color: '#3b82f6', pct: 100 },
  ];

  return (
    <section ref={setRef} id="financials"
      className="min-h-screen flex flex-col justify-center px-16 py-20"
      style={{ backgroundColor: '#080C18', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>

      <p className="font-bold tracking-widest mb-4" style={{ fontSize: '9px', color: '#22c55e' }}>FINANCIAL PROJECTIONS</p>
      <h1 className="font-syne font-bold text-4xl text-white mb-3 tracking-tight slide-in">
        Path to $32.2M ARR in 36 Months
      </h1>
      <p className="text-slate-400 text-sm mb-12 max-w-xl leading-relaxed slide-in">
        Conservative model built on $24K average contract value, 22% close rate, and 130%+ net revenue retention.
      </p>

      <div className="flex gap-14 mb-10">
        {/* Bar chart */}
        <div className="flex-1 slide-in">
          <p className="font-bold tracking-widest text-slate-500 mb-6" style={{ fontSize: '9px' }}>ARR GROWTH TRAJECTORY ($M)</p>
          <div className="flex items-end gap-3" style={{ height: 220 }}>
            {bars.map(({ label, arr, color, pct }, i) => (
              <div key={label} className="flex-1 flex flex-col items-center gap-2">
                <p className="font-bold text-xs mb-1" style={{ color, fontFamily: 'Syne, sans-serif' }}>
                  {arr > 0 ? `$${arr}M` : '—'}
                </p>
                <div className="w-full overflow-hidden rounded-t" style={{ height: `${Math.max(pct * 1.9, 8)}px` }}>
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: color,
                      opacity: 0.88,
                      borderRadius: '4px 4px 0 0',
                      transformOrigin: 'bottom',
                      transform: animated ? 'scaleY(1)' : 'scaleY(0)',
                      transition: `transform 0.7s cubic-bezier(.4,0,.2,1) ${i * 0.12}s`,
                    }}
                  />
                </div>
                <p className="text-slate-500 text-[10px] text-center">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Key metrics */}
        <div className="w-56 flex-shrink-0 slide-in">
          {[
            { label: 'SEED ROUND',      value: '$1.5M',    color: '#C8A84B' },
            { label: 'Y1 ARR',          value: '$2.6M',    color: '#C8A84B' },
            { label: 'Y2 ARR',          value: '$9.2M',    color: '#22c55e' },
            { label: 'Y3 ARR',          value: '$32.2M',   color: '#3b82f6' },
            { label: 'BREAK-EVEN',      value: 'Month 12', color: '#22c55e' },
            { label: 'GROSS MARGIN',    value: '82%',      color: '#a855f7' },
            { label: 'Y3 VALUATION 8×', value: '$257M',    color: '#C8A84B' },
          ].map(({ label, value, color }) => (
            <div key={label} className="flex justify-between items-center py-2.5"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="font-bold tracking-widest text-slate-500" style={{ fontSize: '9px' }}>{label}</p>
              <p className="font-syne font-bold text-sm" style={{ color }}>{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom metrics strip */}
      <div className="grid grid-cols-4 gap-4 slide-in">
        {[
          { label: 'AVG CONTRACT',  value: '$24K',    color: '#C8A84B' },
          { label: 'CUSTOMERS Y3', value: '1,340+',  color: '#22c55e' },
          { label: 'PAYBACK',      value: '4 months', color: '#a855f7' },
          { label: 'NRR TARGET',   value: '130%+',   color: '#3b82f6' },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-lg p-4 text-center"
            style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <p className="font-bold tracking-widest text-slate-500 mb-2" style={{ fontSize: '9px' }}>{label}</p>
            <p className="font-syne font-bold text-xl" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Main component ─── */
export default function PitchDeck() {
  const [active, setActive] = useState(0);
  const sectionRefs = useRef([]);

  /* Sidebar auto-highlight as user scrolls */
  useEffect(() => {
    const observers = sectionRefs.current.map((el, i) => {
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(i); },
        { rootMargin: '-20% 0px -70% 0px' }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach(obs => obs?.disconnect());
  }, []);

  /* Slide-in reveal animation for .slide-in elements */
  useEffect(() => {
    const targets = document.querySelectorAll('.slide-in');
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1 }
    );
    targets.forEach(t => obs.observe(t));
    return () => obs.disconnect();
  }, []);

  const scrollTo = (i) => {
    sectionRefs.current[i]?.scrollIntoView({ behavior: 'smooth' });
    setActive(i);
  };

  const progress = ((active + 1) / SLIDES.length) * 100;

  return (
    <div style={{ backgroundColor: '#080C18', color: 'white', fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        .slide-in { opacity: 0; transform: translateY(18px); transition: opacity 0.4s ease-out, transform 0.4s ease-out; }
        .slide-in.visible { opacity: 1; transform: translateY(0); }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(200,168,75,0.3); border-radius: 2px; }
      `}</style>

      {/* ── TOP NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center px-6"
        style={{ height: '56px', backgroundColor: '#080C18', borderBottom: '1px solid rgba(200,168,75,0.18)' }}>

        {/* Wordmark */}
        <div className="flex items-baseline gap-2" style={{ width: '220px' }}>
          <span className="font-syne font-bold text-gold tracking-tight" style={{ fontSize: '18px' }}>AEXS</span>
          <span className="text-slate-400 font-bold tracking-widest" style={{ fontSize: '11px' }}>AI EXECUTIVE SUITE</span>
        </div>

        {/* Nav links */}
        <div className="flex-1 flex justify-center gap-10">
          {[
            { label: 'HOME',      href: '/',        active: false },
            { label: 'PITCH DECK', href: '/pitch',  active: true  },
            { label: 'ROADMAP',   href: '/roadmap', active: false },
          ].map(({ label, href, active: isActive }) => (
            <a key={label} href={href}
              className={`font-bold tracking-widest transition-colors ${
                isActive
                  ? 'text-gold border-b border-gold pb-px'
                  : 'text-slate-400 hover:text-white'
              }`}
              style={{ fontSize: '11px' }}>
              {label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="flex justify-end" style={{ width: '220px' }}>
          <a href="/deck.pdf" download="AEXS_InvestorDeck_2026.pdf"
            className="border border-gold text-gold font-bold tracking-widest transition-all hover:bg-gold hover:text-deck"
            style={{ padding: '6px 14px', fontSize: '10px' }}>
            REQUEST FULL DECK
          </a>
        </div>

        {/* Gold rule at very bottom of nav */}
        <div className="absolute bottom-0 left-0 right-0 h-px" style={{ backgroundColor: 'rgba(200,168,75,0.15)' }} />
      </nav>

      {/* ── LEFT SIDEBAR ── */}
      <aside className="fixed bottom-0 left-0 z-40 flex flex-col"
        style={{ top: '56px', width: '220px', backgroundColor: '#080C18', borderRight: '1px solid rgba(255,255,255,0.05)' }}>

        {/* Header */}
        <div className="px-4 pt-5 pb-3">
          <p className="font-bold tracking-widest text-gold" style={{ fontSize: '9px' }}>INVESTOR DECK</p>
          <div className="mt-2 h-px" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }} />
        </div>

        {/* Slide list */}
        <nav className="flex-1 overflow-y-auto">
          {SLIDES.map((slide, i) => (
            <button key={slide.id} onClick={() => scrollTo(i)}
              className="w-full flex items-center gap-3 text-left transition-all"
              style={{
                padding: '9px 16px',
                borderLeft: active === i ? `3px solid #C8A84B` : '3px solid transparent',
                backgroundColor: active === i ? 'rgba(100,116,139,0.18)' : 'transparent',
              }}
              onMouseEnter={e => {
                if (active !== i) {
                  e.currentTarget.style.borderLeftColor = 'rgba(200,168,75,0.5)';
                  e.currentTarget.style.backgroundColor = 'rgba(30,41,59,0.4)';
                }
              }}
              onMouseLeave={e => {
                if (active !== i) {
                  e.currentTarget.style.borderLeftColor = 'transparent';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}>
              <span style={{ color: slide.accent, fontSize: '12px', flexShrink: 0 }}>{slide.icon}</span>
              <span style={{
                fontSize: '12px',
                color: active === i ? 'white' : 'rgba(255,255,255,0.6)',
                fontWeight: active === i ? '600' : '400',
              }}>
                {slide.label}
              </span>
            </button>
          ))}
        </nav>

        {/* Footer: counter + progress bar */}
        <div className="px-4 pb-4 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <p className="text-slate-500 mb-2" style={{ fontSize: '10px' }}>{active + 1} / {SLIDES.length}</p>
          <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
            <div className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, backgroundColor: '#C8A84B' }} />
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main style={{ marginLeft: '220px', paddingTop: '56px' }}>

        {/* ── SLIDE 1: COVER ── */}
        <section ref={el => sectionRefs.current[0] = el} id="cover"
          className="min-h-screen flex items-center px-16 py-20"
          style={{ backgroundColor: '#080C18', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex w-full gap-16 items-center">

            {/* Left */}
            <div className="flex-1">
              <p className="font-bold tracking-widest mb-6" style={{ fontSize: '9px', color: '#C8A84B' }}>
                INVESTOR PRESENTATION · 2026
              </p>
              <h1 className="font-syne font-bold text-gold leading-none mb-4"
                style={{ fontSize: 'clamp(64px,9vw,96px)' }}>
                AEXS
              </h1>
              <p className="font-syne font-semibold text-white/80 mb-2" style={{ fontSize: '22px' }}>
                AI Executive Suite
              </p>
              <p className="text-slate-400 text-sm mb-8 max-w-sm leading-relaxed">
                The world's first AI-native command layer for enterprise leadership — unifying executive intelligence, regulatory compliance, and decision governance in a single platform.
              </p>
              <div className="flex gap-6 mb-8 items-center">
                <div>
                  <p className="font-syne font-bold text-gold" style={{ fontSize: '26px' }}>$1.5M</p>
                  <p className="text-slate-500 font-bold tracking-widest" style={{ fontSize: '9px' }}>SEED ROUND</p>
                </div>
                <div className="w-px h-10" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />
                <div>
                  <p className="font-syne font-bold text-white" style={{ fontSize: '26px' }}>$32.2M</p>
                  <p className="text-slate-500 font-bold tracking-widest" style={{ fontSize: '9px' }}>Y3 ARR TARGET</p>
                </div>
                <div className="w-px h-10" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />
                <div>
                  <p className="font-syne font-bold text-white" style={{ fontSize: '26px' }}>$8M</p>
                  <p className="text-slate-500 font-bold tracking-widest" style={{ fontSize: '9px' }}>VALUATION CAP</p>
                </div>
              </div>
              <p className="text-slate-500 font-bold tracking-widest" style={{ fontSize: '10px' }}>
                contact@aexs.ai · aexs.ai
              </p>
            </div>

            {/* Right: stacked layer cards */}
            <div className="flex-shrink-0" style={{ width: '380px' }}>
              <div className="flex flex-col gap-3 mb-4">
                {[
                  { n: '01', label: 'LAYER 01', title: 'AI Chief of Staff',    sub: 'Executive memory, briefings, follow-ups', accent: '#C8A84B' },
                  { n: '02', label: 'LAYER 02', title: 'AI Governance Engine', sub: 'EU AI Act, ISO 42001, board-ready reports', accent: '#3b82f6' },
                  { n: '03', label: 'LAYER 03', title: 'Decision Intelligence', sub: 'Data-grounded choices with full audit trail', accent: '#22c55e' },
                ].map(({ label, title, sub, accent }) => (
                  <div key={label} className="rounded-xl p-4 slide-in"
                    style={{ border: `1px solid ${accent}44`, backgroundColor: `${accent}08` }}>
                    <p className="font-bold tracking-widest mb-1" style={{ fontSize: '9px', color: accent }}>{label}</p>
                    <p className="font-syne font-semibold text-white text-sm">{title}</p>
                    <p className="text-slate-400 text-xs mt-1">{sub}</p>
                  </div>
                ))}
              </div>
              {/* Foundation bar */}
              <div className="rounded-xl py-3 px-4 text-center slide-in"
                style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.12), rgba(168,85,247,0.08))', border: '1px solid rgba(168,85,247,0.3)' }}>
                <p className="font-bold tracking-widest text-purple-400" style={{ fontSize: '9px' }}>
                  EXECUTIVE MEMORY GRAPH · UNIFIED INTELLIGENCE FOUNDATION
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── SLIDE 2: PROBLEM ── */}
        <section ref={el => sectionRefs.current[1] = el} id="problem"
          className="min-h-screen flex flex-col justify-center px-16 py-20"
          style={{ backgroundColor: '#080C18', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>

          <p className="font-bold tracking-widest mb-4" style={{ fontSize: '9px', color: '#ef4444' }}>THE PROBLEM</p>
          <h1 className="font-syne font-bold text-4xl text-white mb-3 tracking-tight slide-in">
            Leaders Are Flying Blind
          </h1>
          <p className="text-slate-400 text-sm mb-12 max-w-xl leading-relaxed slide-in">
            Modern executives face an impossible information burden with zero intelligent infrastructure to help.
          </p>

          {/* 2×2 stat grid */}
          <div className="grid grid-cols-2 gap-4 max-w-2xl mb-8">
            {[
              { stat: '73%',  color: '#ef4444', title: 'Executive Overload',      body: 'of C-suite leaders report critical information is missed weekly due to data volume.' },
              { stat: '$3T',  color: '#f97316', title: 'Annual Value Destroyed',  body: 'lost globally each year to poor executive decisions and misaligned strategic execution.' },
              { stat: '40+',  color: '#C8A84B', title: 'Regulatory Frameworks',  body: 'now mandate AI governance documentation — with no unified compliance tooling available.' },
              { stat: '12%',  color: '#3b82f6', title: 'AI Adoption Success',    body: 'of enterprise AI initiatives deliver measurable executive-level business value.' },
            ].map(({ stat, color, title, body }) => (
              <div key={stat} className="rounded-xl p-6 slide-in"
                style={{ backgroundColor: `${color}0d`, border: `1px solid ${color}33` }}>
                <p className="font-syne font-bold mb-2 leading-none" style={{ fontSize: '54px', color }}>
                  {stat}
                </p>
                <p className="text-white text-sm font-semibold mb-1">{title}</p>
                <p className="text-slate-400 text-xs leading-relaxed">{body}</p>
              </div>
            ))}
          </div>

          {/* EU AI Act alert bar */}
          <div className="max-w-2xl rounded-xl px-5 py-4 flex items-center gap-3 slide-in"
            style={{ backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.35)' }}>
            <span className="text-red-400 text-xl flex-shrink-0">⚠</span>
            <p className="text-red-300 text-sm font-semibold leading-relaxed">
              The EU AI Act is enforceable NOW — non-compliance carries fines up to 7% of global annual turnover.
            </p>
          </div>
        </section>

        {/* ── SLIDE 3: SOLUTION ── */}
        <section ref={el => sectionRefs.current[2] = el} id="solution"
          className="min-h-screen flex flex-col justify-center px-16 py-20"
          style={{ backgroundColor: '#080C18', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>

          <p className="font-bold tracking-widest mb-4" style={{ fontSize: '9px', color: '#C8A84B' }}>THE SOLUTION</p>
          <h1 className="font-syne font-bold text-4xl text-white mb-3 tracking-tight slide-in">
            One Platform. Total Executive Intelligence.
          </h1>
          <p className="text-slate-400 text-sm mb-10 max-w-xl leading-relaxed slide-in">
            AEXS is the AI-native command layer that unifies executive memory, regulatory compliance, and decision governance.
          </p>

          <div className="flex gap-4 mb-4">
            {[
              {
                layerLabel: 'LAYER 01', accent: '#C8A84B',
                title: 'AI Chief of Staff',
                bullets: [
                  'Persistent executive memory across all meetings',
                  'Automated daily briefings & priority surfacing',
                  'AI-generated follow-up tracking & accountability',
                  'Context-aware stakeholder relationship mapping',
                  'Real-time decision support with historical context',
                ],
                metric: '40% reduction', metricSub: 'in executive context-switching',
              },
              {
                layerLabel: 'LAYER 02', accent: '#ef4444',
                title: 'AI Governance Engine',
                bullets: [
                  'EU AI Act article-by-article compliance mapping',
                  'ISO 42001 automated audit documentation',
                  'Board-ready governance reports in one click',
                  'Real-time regulatory change monitoring & alerts',
                  'Risk scoring & remediation action tracking',
                ],
                metric: '90% faster', metricSub: 'regulatory audit preparation',
              },
              {
                layerLabel: 'LAYER 03', accent: '#3b82f6',
                title: 'Decision Intelligence',
                bullets: [
                  'Structured decision frameworks with data grounding',
                  'Full audit trail for every executive decision',
                  'Scenario modeling with risk/reward analysis',
                  'Cross-functional alignment tracking & approvals',
                  'Decision quality scoring and retrospective analysis',
                ],
                metric: '3× improvement', metricSub: 'in decision execution speed',
              },
            ].map(({ layerLabel, accent, title, bullets, metric, metricSub }) => (
              <div key={layerLabel}
                className="flex-1 rounded-xl p-6 flex flex-col slide-in"
                style={{ border: `1px solid ${accent}44`, backgroundColor: `${accent}06` }}>
                <div className="inline-flex px-2 py-1 rounded mb-4"
                  style={{ backgroundColor: `${accent}20`, width: 'fit-content' }}>
                  <p className="font-bold tracking-widest" style={{ fontSize: '9px', color: accent }}>{layerLabel}</p>
                </div>
                <h3 className="font-syne font-bold text-white text-lg mb-4">{title}</h3>
                <ul className="space-y-2 flex-1 mb-6">
                  {bullets.map(b => (
                    <li key={b} className="flex items-start gap-2 text-slate-300 text-xs leading-relaxed">
                      <span style={{ color: accent, marginTop: '2px', flexShrink: 0 }}>▸</span>{b}
                    </li>
                  ))}
                </ul>
                <div className="rounded-lg px-4 py-3 text-center"
                  style={{ backgroundColor: `${accent}12`, border: `1px solid ${accent}30` }}>
                  <p className="font-bold text-sm" style={{ color: accent }}>{metric}</p>
                  <p className="text-slate-400 text-xs">{metricSub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Foundation bar */}
          <div className="rounded-xl py-3 px-6 text-center slide-in"
            style={{ background: 'linear-gradient(90deg, rgba(124,58,237,0.1), rgba(168,85,247,0.07), rgba(124,58,237,0.1))', border: '1px solid rgba(168,85,247,0.25)' }}>
            <p className="font-bold tracking-widest text-purple-400" style={{ fontSize: '9px' }}>
              EXECUTIVE MEMORY GRAPH · UNIFIED INTELLIGENCE FOUNDATION · POWERS ALL THREE LAYERS
            </p>
          </div>
        </section>

        {/* ── SLIDE 4: PRODUCT ── */}
        <section ref={el => sectionRefs.current[3] = el} id="product"
          className="min-h-screen flex flex-col justify-center px-16 py-20"
          style={{ backgroundColor: '#080C18', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>

          <p className="font-bold tracking-widest mb-4" style={{ fontSize: '9px', color: '#3b82f6' }}>PRODUCT DEEP DIVE</p>
          <h1 className="font-syne font-bold text-4xl text-white mb-3 tracking-tight slide-in">
            Built for How Executives Actually Work
          </h1>
          <p className="text-slate-400 text-sm mb-10 max-w-xl leading-relaxed slide-in">
            Three deeply integrated modules that function as a unified executive operating system.
          </p>

          <div className="grid grid-cols-3 gap-6">
            {[
              {
                label: 'CHIEF OF STAFF', accent: '#C8A84B',
                features: ['Morning intelligence brief', 'Commitment tracking across 100+ items', 'Stakeholder relationship graph', 'Meeting pre-brief & follow-up automation', 'Priority conflict detection'],
                screen: ['Daily Brief · 6:45 AM', '"3 high-priority items require', 'your attention before the board', 'call at 10AM…"'],
              },
              {
                label: 'GOVERNANCE HUB', accent: '#ef4444',
                features: ['EU AI Act compliance dashboard', 'ISO 42001 gap analysis', 'Automated evidence collection', 'Board report generation in <5 min', 'Regulatory calendar & deadlines'],
                screen: ['Compliance Score: 94%', 'EU AI Act: Article 13', 'Transparency — ✓ Documented', 'Next review: 2026-06-01'],
              },
              {
                label: 'DECISION ENGINE', accent: '#3b82f6',
                features: ['Decision canvas with structured inputs', 'Stakeholder sign-off workflows', 'Historical decision pattern analysis', 'Risk scenario modeling', 'Outcome measurement & tracking'],
                screen: ['Decision #247: Vendor Select', 'Risk Score: Low · 87% confidence', 'Status: ✓ Board Approved', 'Outcome tracked: 30/60/90d'],
              },
            ].map(({ label, accent, features, screen }) => (
              <div key={label} className="rounded-xl p-5 flex flex-col slide-in"
                style={{ border: `1px solid ${accent}33`, backgroundColor: `${accent}08` }}>
                <p className="font-bold tracking-widest mb-3" style={{ fontSize: '9px', color: accent }}>{label}</p>
                <ul className="space-y-2 mb-4 flex-1">
                  {features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-slate-300 text-xs">
                      <span style={{ color: accent, flexShrink: 0 }}>▸</span>{f}
                    </li>
                  ))}
                </ul>
                <div className="rounded-lg p-3 font-mono text-xs leading-relaxed"
                  style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: `1px solid ${accent}22`, color: `${accent}cc` }}>
                  {screen.map((line, i) => <p key={i}>{line}</p>)}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── SLIDE 5: MARKET ── */}
        <section ref={el => sectionRefs.current[4] = el} id="market"
          className="min-h-screen flex flex-col justify-center px-16 py-20"
          style={{ backgroundColor: '#080C18', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>

          <p className="font-bold tracking-widest mb-4" style={{ fontSize: '9px', color: '#a855f7' }}>MARKET OPPORTUNITY</p>
          <h1 className="font-syne font-bold text-4xl text-white mb-3 tracking-tight slide-in">
            A Category That Doesn't Exist Yet
          </h1>
          <p className="text-slate-400 text-sm mb-12 max-w-xl leading-relaxed slide-in">
            AEXS sits at the intersection of three massive markets, with no direct competitor occupying this exact space.
          </p>

          <div className="flex items-center gap-16">
            {/* Concentric circles */}
            <div className="relative flex-shrink-0 slide-in" style={{ width: '340px', height: '340px' }}>
              {/* Outer — Executive Software */}
              <div className="absolute inset-0 rounded-full flex items-end justify-center pb-5"
                style={{ backgroundColor: 'rgba(124,58,237,0.1)', border: '2px solid rgba(124,58,237,0.4)' }}>
              </div>
              <p className="absolute font-bold tracking-wide text-purple-300" style={{ top: '14px', left: '50%', transform: 'translateX(-50%)', fontSize: '10px', whiteSpace: 'nowrap' }}>Executive Software</p>

              {/* Middle — AI SaaS */}
              <div className="absolute rounded-full"
                style={{ inset: '50px', backgroundColor: 'rgba(59,130,246,0.12)', border: '2px solid rgba(59,130,246,0.45)' }} />
              <p className="absolute font-bold tracking-wide text-blue-300" style={{ top: '68px', left: '50%', transform: 'translateX(-50%)', fontSize: '10px', whiteSpace: 'nowrap' }}>AI SaaS</p>

              {/* Inner — GRC */}
              <div className="absolute rounded-full"
                style={{ inset: '110px', backgroundColor: 'rgba(34,197,94,0.15)', border: '2px solid rgba(34,197,94,0.5)' }} />
              <p className="absolute font-bold tracking-wide text-green-300" style={{ top: '126px', left: '50%', transform: 'translateX(-50%)', fontSize: '10px', whiteSpace: 'nowrap' }}>GRC</p>

              {/* Center — AEXS */}
              <div className="absolute rounded-full flex items-center justify-center"
                style={{ inset: '152px', backgroundColor: 'rgba(200,168,75,0.25)', border: '2px solid #C8A84B' }}>
                <p className="font-syne font-bold text-gold text-xs">AEXS</p>
              </div>
            </div>

            {/* Legend */}
            <div className="flex-1 space-y-8 slide-in">
              {[
                { dot: '#7c3aed', label: 'TOTAL ADDRESSABLE MARKET', value: '$450B+', sub: 'Global enterprise executive software & AI-enabled productivity tooling' },
                { dot: '#3b82f6', label: 'SERVICEABLE ADDRESSABLE MARKET', value: '$28B', sub: 'Mid-to-large enterprise AI governance & executive intelligence platforms' },
                { dot: '#22c55e', label: 'SERVICEABLE OBTAINABLE MARKET', value: '$2.8B', sub: 'Early-mover capture across regulated industries in EU + North America' },
              ].map(({ dot, label, value, sub }) => (
                <div key={label}>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: dot }} />
                    <p className="font-bold tracking-widest" style={{ fontSize: '9px', color: dot }}>{label}</p>
                  </div>
                  <p className="font-syne font-bold text-white text-4xl mb-1">{value}</p>
                  <p className="text-slate-400 text-sm leading-relaxed">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SLIDE 6: TRACTION ── */}
        <section ref={el => sectionRefs.current[5] = el} id="traction"
          className="min-h-screen flex flex-col justify-center px-16 py-20"
          style={{ backgroundColor: '#080C18', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>

          <p className="font-bold tracking-widest mb-4" style={{ fontSize: '9px', color: '#22c55e' }}>TRACTION & VALIDATION</p>
          <h1 className="font-syne font-bold text-4xl text-white mb-3 tracking-tight slide-in">
            Early Signals. Real Demand.
          </h1>
          <p className="text-slate-400 text-sm mb-10 max-w-xl leading-relaxed slide-in">
            Pre-revenue, with concrete validation across product, market, and regulatory dimensions.
          </p>

          <div className="flex gap-10">
            {/* Validation proof cards */}
            <div className="flex-1 grid grid-cols-2 gap-4">
              {[
                { accent: '#22c55e', icon: '✓', label: 'PRODUCT VALIDATION',  title: 'MVP Complete',         body: 'All three product modules built and internally tested across real executive workflows.' },
                { accent: '#C8A84B', icon: '◆', label: 'MARKET VALIDATION',   title: 'Inbound Interest',     body: 'Direct outreach from 3 enterprise prospects following regulatory compliance announcements.' },
                { accent: '#3b82f6', icon: '⚖', label: 'REGULATORY TIMING',  title: 'EU AI Act Active',     body: 'Enforcement began August 2025 — creating immediate urgency for AEXS governance module.' },
                { accent: '#f97316', icon: '◉', label: 'FOUNDER ADVANTAGE',   title: 'Domain Authority',     body: 'Founder operates at the intersection of AI, governance & executive leadership — built for the buyer.' },
              ].map(({ accent, icon, label, title, body }) => (
                <div key={label} className="rounded-xl p-5 slide-in"
                  style={{ border: `1px solid ${accent}44`, backgroundColor: `${accent}08` }}>
                  <div className="flex items-center gap-2 mb-3">
                    <span style={{ color: accent, fontSize: '14px' }}>{icon}</span>
                    <p className="font-bold tracking-widest" style={{ fontSize: '9px', color: accent }}>{label}</p>
                  </div>
                  <p className="text-white font-semibold text-sm mb-2">{title}</p>
                  <p className="text-slate-400 text-xs leading-relaxed">{body}</p>
                </div>
              ))}
            </div>

            {/* Milestone timeline */}
            <div className="flex-shrink-0" style={{ width: '240px' }}>
              <p className="text-white font-bold tracking-widest mb-4" style={{ fontSize: '10px' }}>2026 MILESTONES</p>
              <div className="space-y-1">
                {[
                  { q: 'Q1 2026', label: 'Foundation',    items: ['MVP shipped', 'Deck published', 'Seed outreach'],        done: true  },
                  { q: 'Q2 2026', label: 'First Revenue', items: ['2 pilot customers', 'Seed close', 'Team hired'],         done: false },
                  { q: 'Q3 2026', label: 'Scale',         items: ['10 customers', '$500K ARR', 'GTM motion live'],          done: false },
                  { q: 'Q4 2026', label: 'Series A Prep', items: ['$2M ARR run-rate', 'EU certification', 'Series A prep'], done: false },
                ].map(({ q, label, items, done }, idx, arr) => (
                  <div key={q} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full flex-shrink-0 mt-0.5"
                        style={{ backgroundColor: done ? '#22c55e' : '#1e293b', border: done ? 'none' : '1px solid #334155' }} />
                      {idx < arr.length - 1 && (
                        <div className="w-px flex-1 mt-1" style={{ backgroundColor: '#1e293b', minHeight: '20px' }} />
                      )}
                    </div>
                    <div className="pb-4">
                      <p className="text-gold font-bold" style={{ fontSize: '10px' }}>{q}</p>
                      <p className="text-white font-semibold text-xs mb-1">{label}</p>
                      {items.map(item => (
                        <p key={item} className="text-slate-500" style={{ fontSize: '10px' }}>· {item}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── SLIDE 7: BUSINESS MODEL ── */}
        <section ref={el => sectionRefs.current[6] = el} id="model"
          className="min-h-screen flex flex-col justify-center px-16 py-20"
          style={{ backgroundColor: '#080C18', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>

          <p className="font-bold tracking-widest mb-4" style={{ fontSize: '9px', color: '#C8A84B' }}>BUSINESS MODEL</p>
          <h1 className="font-syne font-bold text-4xl text-white mb-3 tracking-tight slide-in">
            SaaS Recurring Revenue at Every Level
          </h1>
          <p className="text-slate-400 text-sm mb-10 max-w-xl leading-relaxed slide-in">
            Annual subscriptions with module-based expansion. High NRR design from day one.
          </p>

          <div className="flex gap-5 mb-8">
            {[
              {
                name: 'Starter',    price: '$499',   period: '/mo', accent: '#C8A84B', target: 'SMB & Scale-ups',
                modules: ['AI Chief of Staff', 'Basic decision logging', 'Standard compliance reports', 'Email support'],
                popular: false,
              },
              {
                name: 'Growth',     price: '$1,999', period: '/mo', accent: '#3b82f6', target: 'Mid-Market',
                modules: ['All Starter features', 'Full Governance Engine', 'Decision Intelligence Suite', 'API access + integrations', 'Priority support'],
                popular: true,
              },
              {
                name: 'Enterprise', price: '$8,500', period: '/mo', accent: '#a855f7', target: 'Large Enterprise',
                modules: ['All Growth features', 'Custom AI training on company data', 'Dedicated success manager', 'White-label options', 'Custom SLA & compliance'],
                popular: false,
              },
            ].map(({ name, price, period, accent, target, modules, popular }) => (
              <div key={name} className="flex-1 rounded-xl p-6 flex flex-col relative slide-in"
                style={{ border: `1px solid ${accent}44`, backgroundColor: `${accent}06` }}>
                {popular && (
                  <div className="absolute text-white font-bold"
                    style={{ top: '-11px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#3b82f6', padding: '3px 12px', borderRadius: '999px', fontSize: '9px', whiteSpace: 'nowrap', letterSpacing: '1px' }}>
                    MOST POPULAR
                  </div>
                )}
                <p className="font-bold tracking-widest mb-1" style={{ fontSize: '9px', color: accent }}>{name.toUpperCase()}</p>
                <p className="text-slate-400 text-xs mb-4">{target}</p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="font-syne font-bold text-white" style={{ fontSize: '36px' }}>{price}</span>
                  <span className="text-slate-400 text-sm">{period}</span>
                </div>
                <ul className="space-y-2.5 flex-1">
                  {modules.map(m => (
                    <li key={m} className="flex items-center gap-2 text-slate-300 text-xs">
                      <span style={{ color: accent }}>✓</span>{m}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Unit economics strip */}
          <div className="grid grid-cols-4 gap-4 slide-in">
            {[
              { label: 'GROSS MARGIN',   value: '82%',   color: '#22c55e' },
              { label: 'LTV/CAC RATIO',  value: '8.4×',  color: '#C8A84B' },
              { label: 'PAYBACK PERIOD', value: '4 mo',  color: '#3b82f6' },
              { label: 'NET RETENTION',  value: '118%+', color: '#a855f7' },
            ].map(({ label, value, color }) => (
              <div key={label} className="rounded-lg p-4 text-center"
                style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <p className="font-bold tracking-widest text-slate-500 mb-2" style={{ fontSize: '9px' }}>{label}</p>
                <p className="font-syne font-bold text-2xl" style={{ color }}>{value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── SLIDE 8: FINANCIALS ── */}
        <FinancialsSlide onRef={el => sectionRefs.current[7] = el} />

        {/* ── SLIDE 9: COMPETITION ── */}
        <section ref={el => sectionRefs.current[8] = el} id="competition"
          className="min-h-screen flex flex-col justify-center px-16 py-20"
          style={{ backgroundColor: '#080C18', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>

          <p className="font-bold tracking-widest mb-4" style={{ fontSize: '9px', color: '#f97316' }}>COMPETITIVE LANDSCAPE</p>
          <h1 className="font-syne font-bold text-4xl text-white mb-3 tracking-tight slide-in">
            No One Owns This Category. Yet.
          </h1>
          <p className="text-slate-400 text-sm mb-10 max-w-xl leading-relaxed slide-in">
            Existing tools solve pieces of the puzzle. AEXS is the only platform built end-to-end for the AI-era executive.
          </p>

          <div className="overflow-x-auto slide-in">
            <table className="w-full" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <th className="text-left pb-3 text-slate-500 font-bold tracking-widest pr-6" style={{ fontSize: '9px' }}>CAPABILITY</th>
                  {[
                    { name: 'AEXS',         gold: true  },
                    { name: 'Monday.com',   gold: false },
                    { name: 'OneTrust',     gold: false },
                    { name: 'Gartner',      gold: false },
                    { name: 'Notion AI',    gold: false },
                    { name: 'Salesforce AI',gold: false },
                  ].map(({ name, gold }) => (
                    <th key={name}
                      className="pb-3 text-center font-bold text-xs"
                      style={{ color: gold ? '#C8A84B' : '#94a3b8', backgroundColor: gold ? 'rgba(200,168,75,0.04)' : 'transparent' }}>
                      {name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['Executive Memory & Context',     true,  false, false, false, false, false],
                  ['AI Governance & EU AI Act',       true,  false, true,  true,  false, false],
                  ['Decision Intelligence Layer',     true,  false, false, true,  false, false],
                  ['Integrated Briefing Engine',      true,  false, false, false, false, false],
                  ['Founder-Led AI Training',         true,  false, false, false, true,  false],
                  ['Real-Time Compliance Alerts',     true,  false, true,  true,  false, false],
                  ['Executive-Native UX',             true,  false, false, false, false, false],
                ].map(([capability, ...vals]) => (
                  <tr key={capability}
                    className="transition-colors"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'; }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}>
                    <td className="py-3 text-slate-300 text-xs pr-6">{capability}</td>
                    {vals.map((v, i) => (
                      <td key={i} className="py-3 text-center"
                        style={{ backgroundColor: i === 0 ? 'rgba(200,168,75,0.05)' : 'transparent' }}>
                        {v
                          ? <span className="text-green-400 font-bold">✓</span>
                          : <span className="text-slate-700 text-sm">○</span>
                        }
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 rounded-xl p-5 slide-in"
            style={{ background: 'linear-gradient(135deg, rgba(200,168,75,0.06), rgba(200,168,75,0.02))', border: '1px solid rgba(200,168,75,0.28)' }}>
            <p className="text-gold font-semibold text-sm mb-1">The Verdict</p>
            <p className="text-slate-300 text-sm leading-relaxed">
              AEXS is the only platform combining executive memory, AI governance compliance, and decision intelligence in a single product. Every competitor solves at most one dimension — AEXS owns the intersection.
            </p>
          </div>
        </section>

        {/* ── SLIDE 10: GO-TO-MARKET ── */}
        <section ref={el => sectionRefs.current[9] = el} id="gtm"
          className="min-h-screen flex flex-col justify-center px-16 py-20"
          style={{ backgroundColor: '#080C18', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>

          <p className="font-bold tracking-widest mb-4" style={{ fontSize: '9px', color: '#3b82f6' }}>GO-TO-MARKET STRATEGY</p>
          <h1 className="font-syne font-bold text-4xl text-white mb-3 tracking-tight slide-in">Land. Expand. Dominate.</h1>
          <p className="text-slate-400 text-sm mb-10 max-w-xl leading-relaxed slide-in">
            A three-phase motion designed to convert regulatory urgency into category leadership.
          </p>

          <div className="flex gap-4 mb-8">
            {[
              {
                phase: 'PHASE 01', name: 'LAND',     accent: '#C8A84B', target: 'Months 1–6',   headline: 'Regulatory-Led Entry',
                channels: ['Direct outreach to compliance officers', 'EU AI Act urgency content marketing', 'Founder-led enterprise pilots', 'Regulatory consultant partnerships'],
                metric: '2–5 enterprise pilots',
              },
              {
                phase: 'PHASE 02', name: 'EXPAND',   accent: '#3b82f6', target: 'Months 7–18',  headline: 'Product-Led Growth',
                channels: ['Executive peer referrals', 'Board-level case studies & PR', 'Partner channel: Big 4, system integrators', 'Conference presence at GRC/AI events'],
                metric: '$2M ARR target',
              },
              {
                phase: 'PHASE 03', name: 'DOMINATE', accent: '#22c55e', target: 'Months 19–36', headline: 'Category Leadership',
                channels: ['Global enterprise sales motion', 'OEM/White-label licensing deals', 'Platform ecosystem & API economy', 'Series B for international expansion'],
                metric: '$32.2M ARR target',
              },
            ].map(({ phase, name, accent, target, headline, channels, metric }) => (
              <div key={phase} className="flex-1 rounded-xl p-6 flex flex-col slide-in"
                style={{ border: `1px solid ${accent}44`, backgroundColor: `${accent}06` }}>
                <p className="font-bold tracking-widest mb-1" style={{ fontSize: '9px', color: accent }}>{phase}</p>
                <p className="font-syne font-bold text-white text-xl mb-0.5">{name}</p>
                <p className="text-slate-500 text-xs mb-3">{target}</p>
                <p className="text-white text-sm font-semibold mb-4">{headline}</p>
                <ul className="space-y-2 flex-1 mb-4">
                  {channels.map(c => (
                    <li key={c} className="flex items-start gap-2 text-slate-300 text-xs">
                      <span style={{ color: accent, flexShrink: 0 }}>▸</span>{c}
                    </li>
                  ))}
                </ul>
                <div className="rounded-lg px-4 py-2 text-center"
                  style={{ backgroundColor: `${accent}12`, border: `1px solid ${accent}30` }}>
                  <p className="font-bold text-sm" style={{ color: accent }}>{metric}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Unit economics strip */}
          <div className="grid grid-cols-4 gap-4 slide-in">
            {[
              { label: 'AVG DEAL SIZE', value: '$24K',     color: '#C8A84B' },
              { label: 'SALES CYCLE',  value: '45 days',  color: '#3b82f6' },
              { label: 'TARGET ICP',   value: 'CxO / GC', color: '#22c55e' },
              { label: 'CLOSE RATE',   value: '22%',      color: '#a855f7' },
            ].map(({ label, value, color }) => (
              <div key={label} className="rounded-lg p-4 text-center"
                style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <p className="font-bold tracking-widest text-slate-500 mb-2" style={{ fontSize: '9px' }}>{label}</p>
                <p className="font-syne font-bold text-2xl" style={{ color }}>{value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── SLIDE 11: TEAM ── */}
        <section ref={el => sectionRefs.current[10] = el} id="team"
          className="min-h-screen flex flex-col justify-center px-16 py-20"
          style={{ backgroundColor: '#080C18', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>

          <p className="font-bold tracking-widest mb-4" style={{ fontSize: '9px', color: '#C8A84B' }}>THE TEAM</p>
          <h1 className="font-syne font-bold text-4xl text-white mb-3 tracking-tight slide-in">Built by the Buyer</h1>
          <p className="text-slate-400 text-sm mb-10 max-w-xl leading-relaxed slide-in">
            The founder IS the target customer — an executive who built the tool they needed. AI agents function as the founding team until human hires are funded.
          </p>

          <div className="flex gap-8">
            {/* Founder card */}
            <div className="rounded-xl p-8 flex-shrink-0 slide-in"
              style={{ width: '320px', border: '1px solid rgba(200,168,75,0.4)', backgroundColor: 'rgba(200,168,75,0.05)' }}>
              <div className="w-14 h-14 rounded-full mb-4 flex items-center justify-center font-syne font-bold text-xl"
                style={{ backgroundColor: 'rgba(200,168,75,0.15)', border: '2px solid #C8A84B', color: '#C8A84B' }}>
                Mc
              </div>
              <p className="font-bold tracking-widest text-gold mb-1" style={{ fontSize: '9px' }}>FOUNDER & CEO</p>
              <p className="font-syne font-bold text-white text-xl mb-4">Mc</p>
              <div className="space-y-2 mb-6">
                {[
                  'Executive leadership & AI strategy practitioner',
                  'Deep expertise in regulatory compliance & governance',
                  'Product architect for enterprise AI systems',
                  'Built AEXS to solve the problem he lived daily',
                ].map(item => (
                  <div key={item} className="flex items-start gap-2">
                    <span className="text-gold text-xs mt-0.5 flex-shrink-0">▸</span>
                    <p className="text-slate-300 text-xs leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-lg px-4 py-3"
                style={{ backgroundColor: 'rgba(200,168,75,0.1)', border: '1px solid rgba(200,168,75,0.25)' }}>
                <p className="text-gold font-semibold text-xs leading-relaxed">
                  "I built the tool I needed as an executive. Turns out, every executive needs it."
                </p>
              </div>
            </div>

            {/* Hire plan */}
            <div className="flex-1 slide-in">
              <p className="text-white font-bold tracking-widest mb-5" style={{ fontSize: '10px' }}>AI TEAM + SEED HIRE PLAN</p>

              {/* AI agents */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { name: 'AI Chief of Staff',    role: 'Executive workflow, briefings & context', accent: '#C8A84B' },
                  { name: 'AI Governance Agent',  role: 'Regulatory monitoring & compliance',      accent: '#ef4444' },
                  { name: 'AI Decision Agent',    role: 'Scenario modeling & audit trails',        accent: '#3b82f6' },
                ].map(({ name, role, accent }) => (
                  <div key={name} className="rounded-xl p-4"
                    style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: `1px solid ${accent}33` }}>
                    <div className="w-8 h-8 rounded-full mb-3 flex items-center justify-center"
                      style={{ backgroundColor: `${accent}18`, border: `1px solid ${accent}44` }}>
                      <span style={{ color: accent, fontSize: '11px' }}>◉</span>
                    </div>
                    <p className="text-white font-semibold text-xs mb-1">{name}</p>
                    <p className="text-slate-500" style={{ fontSize: '10px' }}>{role}</p>
                  </div>
                ))}
              </div>

              {/* Hire roadmap */}
              <p className="text-white font-bold tracking-widest mb-3" style={{ fontSize: '10px' }}>SEED HIRE PLAN</p>
              <div className="space-y-2">
                {[
                  { role: 'Head of Sales / GTM',      timeline: 'Month 1', priority: 'Critical', accent: '#ef4444' },
                  { role: 'Senior Full-Stack Engineer', timeline: 'Month 2', priority: 'High',    accent: '#f97316' },
                  { role: 'Customer Success Lead',      timeline: 'Month 3', priority: 'High',    accent: '#C8A84B' },
                  { role: 'Marketing / Brand Lead',     timeline: 'Month 4', priority: 'Medium',  accent: '#3b82f6' },
                ].map(({ role, timeline, priority, accent }) => (
                  <div key={role} className="flex items-center gap-4 py-2.5 px-4 rounded-lg"
                    style={{ backgroundColor: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: accent }} />
                    <p className="text-white text-xs flex-1">{role}</p>
                    <p className="text-slate-500 text-xs">{timeline}</p>
                    <span className="text-xs px-2 py-0.5 rounded font-semibold"
                      style={{ backgroundColor: `${accent}18`, color: accent, border: `1px solid ${accent}30` }}>
                      {priority}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── SLIDE 12: THE ASK ── */}
        <section ref={el => sectionRefs.current[11] = el} id="ask"
          className="min-h-screen flex flex-col justify-center px-16 py-20"
          style={{ backgroundColor: '#080C18' }}>

          <p className="font-bold tracking-widest mb-4" style={{ fontSize: '9px', color: '#C8A84B' }}>THE ASK</p>
          <h1 className="font-syne font-bold text-4xl text-white mb-3 tracking-tight slide-in">
            Raising $1.5M Seed Round
          </h1>
          <p className="text-slate-400 text-sm mb-10 max-w-xl leading-relaxed slide-in">
            SAFE note at $8M cap. 18-month runway to Series A metrics and category leadership.
          </p>

          <div className="flex gap-12 mb-10">
            {/* Fund allocation */}
            <div className="flex-1 slide-in">
              <p className="text-white font-bold tracking-widest mb-4" style={{ fontSize: '10px' }}>FUND ALLOCATION — $1.5M</p>
              <div className="space-y-3 mb-6">
                {[
                  { label: 'Sales & GTM Hiring',    pct: 40, accent: '#C8A84B', amount: '$600K' },
                  { label: 'Product Engineering',   pct: 30, accent: '#3b82f6', amount: '$450K' },
                  { label: 'Marketing & Brand',     pct: 15, accent: '#22c55e', amount: '$225K' },
                  { label: 'Operations & Legal',    pct: 15, accent: '#a855f7', amount: '$225K' },
                ].map(({ label, pct, accent, amount }) => (
                  <div key={label}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-slate-300">{label}</span>
                      <span className="text-slate-400">{amount} · {pct}%</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: accent }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Round details */}
              <div className="space-y-0">
                {[
                  { label: 'Instrument',     value: 'SAFE Note'  },
                  { label: 'Valuation Cap',  value: '$8M'        },
                  { label: 'Round Size',     value: '$1.5M'      },
                  { label: 'Min Ticket',     value: '$25K'       },
                  { label: 'Target Close',   value: 'Q2 2026'    },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between py-2.5"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span className="text-slate-400 text-xs">{label}</span>
                    <span className="text-white text-xs font-bold">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* This Round Unlocks */}
            <div className="flex-1 slide-in">
              <p className="text-white font-bold tracking-widest mb-4" style={{ fontSize: '10px' }}>THIS ROUND UNLOCKS</p>
              <div className="space-y-3">
                {[
                  { n: '01', title: 'First Enterprise Customers', body: '2–5 paying pilot customers generating early ARR and product signal', accent: '#C8A84B' },
                  { n: '02', title: 'GTM Team in Market',         body: 'Sales lead hired and closing within 90 days of fund close',           accent: '#3b82f6' },
                  { n: '03', title: 'Series A Foundation',        body: '$2M ARR run-rate, compliance certification, and board-ready metrics by Q4 2026', accent: '#22c55e' },
                  { n: '04', title: 'Category Ownership',         body: 'First-mover positioning in the AI Executive Suite category before incumbents react', accent: '#a855f7' },
                ].map(({ n, title, body, accent }) => (
                  <div key={n} className="flex gap-4 p-4 rounded-xl"
                    style={{ backgroundColor: `${accent}07`, border: `1px solid ${accent}22` }}>
                    <p className="font-syne font-bold leading-none flex-shrink-0" style={{ fontSize: '24px', color: accent }}>{n}</p>
                    <div>
                      <p className="text-white font-semibold text-sm mb-1">{title}</p>
                      <p className="text-slate-400 text-xs leading-relaxed">{body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Gold CTA bar */}
          <div className="rounded-xl py-5 px-8 flex items-center justify-between slide-in"
            style={{ background: 'linear-gradient(135deg, rgba(200,168,75,0.12), rgba(200,168,75,0.06))', border: '1px solid rgba(200,168,75,0.45)' }}>
            <div>
              <p className="font-syne font-bold text-white text-xl mb-1">
                Ready to lead the executive AI category?
              </p>
              <p className="text-slate-400 text-sm">
                Join AEXS at the ground floor of a defining enterprise AI platform.
              </p>
            </div>
            <a href="/deck.pdf" download="AEXS_InvestorDeck_2026.pdf"
              className="flex-shrink-0 ml-8 font-bold tracking-widest transition-all hover:bg-gold hover:text-deck"
              style={{ padding: '12px 24px', border: '1px solid #C8A84B', color: '#C8A84B', fontSize: '11px' }}>
              DOWNLOAD DECK →
            </a>
          </div>
        </section>

      </main>
    </div>
  );
}
