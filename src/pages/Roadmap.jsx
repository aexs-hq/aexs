import { useState } from "react";


const data = {
  startups: [
    {
      id: 1,
      emoji: "🧠",
      title: "AI Chief of Staff",
      subtitle: "The operating brain behind every CEO",
      color: 'var(--color-gold)',
      accent: "#1a1208",
      score: 43,
      phases: [
        {
          phase: "PHASE 1",
          title: "Foundation & MVP",
          duration: "Weeks 1–4",
          icon: "⚙️",
          steps: [
            {
              step: "Step 1",
              title: "System Foundation & Architecture",
              detail: "Establish the AEXS platform's architectural foundation: multi-tenant application core, per-tenant data isolation, authentication and access-token baseline, and the data layer that backs the executive memory engine. Vendor selection follows from the architectural decisions, not the other way around.",
              tasks: ["Application framework and rendering target", "Per-tenant data isolation model (row-level security)", "Authentication baseline with session and access-token boundary", "Persistent application data store and indexing strategy", "Vector index for executive memory and semantic recall"],
              cost: "$200/mo infrastructure",
              time: "1 week"
            },
            {
              step: "Step 2",
              title: "Core Integrations",
              detail: "Build OAuth connectors to Gmail, Google Calendar, Slack. These are your data sources for the AI's memory and context engine.",
              tasks: ["Gmail API OAuth flow", "Google Calendar read/write", "Slack workspace bot", "Notion API connector"],
              cost: "$0 (API tiers)",
              time: "2 weeks"
            },
            {
              step: "Step 3",
              title: "MVP Feature: Daily Briefing",
              detail: "Build the #1 hook feature: AI scans emails + calendar overnight and delivers a 5-bullet executive brief every morning at 7AM.",
              tasks: ["Email summarization prompt", "Calendar conflict detection", "Priority scoring algorithm", "Scheduled delivery (cron job)", "Mobile-friendly brief format"],
              cost: "$800/mo AI API",
              time: "2 weeks"
            }
          ]
        },
        {
          phase: "PHASE 2",
          title: "Beta Launch & Validation",
          duration: "Weeks 5–10",
          icon: "🚀",
          steps: [
            {
              step: "Step 4",
              title: "Beta Recruitment",
              detail: "Target 20–50 beta CEOs/founders. Offer free 60-day access in exchange for weekly feedback calls. Use LinkedIn + warm network.",
              tasks: ["Write outreach script", "Build waitlist landing page", "Set up Typeform feedback loop", "Schedule weekly calls (Calendly)", "Join CEO/founder Slack communities"],
              cost: "$500 (ads optional)",
              time: "1 week"
            },
            {
              step: "Step 5",
              title: "Meeting Intelligence Feature",
              detail: "Integrate with Zoom/Google Meet. AI joins meetings, transcribes, extracts action items, assigns owners, and follows up automatically.",
              tasks: ["Recall.ai or Otter.ai API integration", "Action item extraction prompt", "Slack/email follow-up automation", "Meeting summary dashboard"],
              cost: "$300/mo (transcription API)",
              time: "3 weeks"
            },
            {
              step: "Step 6",
              title: "Feedback Loop & Iteration",
              detail: "Run NPS surveys after each week. Identify top 3 pain points. Sprint-fix the highest-impact issues. Kill features nobody uses.",
              tasks: ["Weekly NPS via Typeform", "Feature usage analytics (Mixpanel)", "User interview recordings", "Prioritize backlog by retention impact"],
              cost: "$200/mo (tools)",
              time: "Ongoing"
            },
            {
              step: "Step 7",
              title: "Pricing Page & Payment",
              detail: "Launch Stripe billing. Set 3 tiers: Starter $299, Growth $799, Enterprise $3,500. Offer annual discount (2 months free).",
              tasks: ["Stripe subscription setup", "Pricing page design", "Free trial flow (14 days)", "Cancellation survey", "Invoice automation"],
              cost: "$0 (Stripe % of revenue)",
              time: "1 week"
            }
          ]
        },
        {
          phase: "PHASE 3",
          title: "Growth & Revenue",
          duration: "Months 3–6",
          icon: "📈",
          steps: [
            {
              step: "Step 8",
              title: "Content Marketing Engine",
              detail: "Publish 2x/week on LinkedIn. Topics: executive productivity, AI leadership, decision-making. Build email newsletter 'The CEO Brief'.",
              tasks: ["LinkedIn content calendar", "Newsletter via Beehiiv", "SEO blog (CEO productivity keywords)", "YouTube: 'AI CEO workflow' series", "Podcast guest appearances"],
              cost: "$1,000/mo (content creator)",
              time: "Ongoing"
            },
            {
              step: "Step 9",
              title: "Partnership Channel",
              detail: "Partner with executive coaches, VC firms, and leadership consultancies. They refer clients; you pay 20% recurring commission.",
              tasks: ["Identify 20 target partners", "Build partner portal", "Create co-branded materials", "Set up affiliate tracking (Rewardful)", "Launch partner newsletter"],
              cost: "$500 setup",
              time: "1 month"
            },
            {
              step: "Step 10",
              title: "AI Memory Graph (Differentiator)",
              detail: "Build proprietary 'executive knowledge graph' — AI learns your communication style, priorities, relationships, and decision history over time.",
              tasks: ["RAG architecture with Pinecone", "Executive persona modeling", "Relationship mapping (who matters most)", "Decision history tagging", "Style mimicry for draft emails"],
              cost: "$2,000 dev sprint",
              time: "3 weeks"
            },
            {
              step: "Step 11",
              title: "Series A Preparation",
              detail: "At $1M ARR, prepare fundraising materials. Target AI-focused VCs. Highlight retention rate, NPS, and expansion revenue.",
              tasks: ["Build data room (Notion)", "Financial model (3-year projection)", "Pitch deck (10 slides)", "Warm intro to 20 VCs", "Net Revenue Retention metric > 110%"],
              cost: "$5,000 (legal & deal prep)",
              time: "2 months"
            }
          ]
        }
      ]
    },
    {
      id: 2,
      emoji: "⚖️",
      title: "AI Governance Engine",
      subtitle: "AI compliance evidence, automated end-to-end",
      color: 'var(--color-blue-ui)',
      accent: "#080f1a",
      score: 42,
      phases: [
        {
          phase: "PHASE 1",
          title: "Product Governance & Review Setup",
          duration: "Weeks 1–4",
          icon: "📋",
          steps: [
            {
              step: "Step 1",
              title: "Regulatory Research Sprint",
              detail: "Deep-dive into EU AI Act, US AI Executive Orders, ISO 42001. Map out which regulations affect which industries. This becomes our product roadmap — input to the Governance Engine's mapping logic, not a commercial advisory offering.",
              tasks: ["Read EU AI Act full text", "Map risk classifications (unacceptable/high/limited)", "Research US NIST AI RMF framework", "Identify top 5 regulated industries", "Create compliance checklist matrix"],
              cost: "$0",
              time: "1 week"
            },
            {
              step: "Step 2",
              title: "External Governance Review (Internal Only)",
              detail: "Engage an external compliance reviewer under a fixed-scope contract to audit the AI Governance Engine itself — verify our regulatory mappings, risk-scoring logic, and evidence-collection outputs are correct. Scope is bounded to reviewing our own software and workflows; the reviewer does not interact with AEXS customers and AEXS does not resell their advice.",
              tasks: ["Identify reviewer with EU AI Act / ISO 42001 expertise (fixed-scope, non-equity)", "Scope: review regulatory mappings, risk-scoring logic, and evidence-collection outputs", "NDA + bounded engagement; no customer-facing role", "Apply findings as internal product corrections — not as a service to clients"],
              cost: "$2,000 (fixed-scope review)",
              time: "2 weeks"
            },
            {
              step: "Step 3",
              title: "Bias Detection Engine",
              detail: "Build core technical product: automated bias scanning tool for ML models. Input a model + dataset; output a fairness report.",
              tasks: ["Integrate Alibi Detect library", "SHAP explainability module", "Protected attribute testing", "Report PDF auto-generation", "Benchmark against known biased datasets"],
              cost: "$3,000 dev",
              time: "3 weeks"
            },
            {
              step: "Step 4",
              title: "Compliance Dashboard MVP",
              detail: "Build a dashboard that shows companies their AI risk score, flagged issues, remediation steps, and regulatory status in real time.",
              tasks: ["Risk scoring algorithm", "Color-coded compliance heatmap", "Remediation workflow automation and tracking", "Audit trail logging", "Export to PDF for board reports"],
              cost: "$5,000 dev",
              time: "3 weeks"
            }
          ]
        },
        {
          phase: "PHASE 2",
          title: "First Clients & Outreach",
          duration: "Weeks 5–12",
          icon: "🏛️",
          steps: [
            {
              step: "Step 5",
              title: "Target Fintech & HR AI Firms",
              detail: "These sectors face the most regulatory pressure. Build a hit list of 100 companies using AI in hiring, lending, or insurance.",
              tasks: ["Build prospect list (LinkedIn Sales Nav)", "Personalized cold email sequence", "Attend 2 compliance/fintech conferences", "Publish 'EU AI Act for Fintechs' guide", "Partner with fintech law firms"],
              cost: "$2,000 (events + tools)",
              time: "1 month"
            }
          ]
        },
        {
          phase: "PHASE 3",
          title: "Scale & Channel Partnerships",
          duration: "Months 4–12",
          icon: "🏦",
          steps: [
            {
              step: "Step 6",
              title: "ISO 42001 Alignment",
              detail: "Align AEXS's own product with ISO 42001 (AI Management Systems standard). Customers operating under ISO 42001 can ingest AEXS-generated evidence directly into their internal certification workflows. AEXS does not issue certifications and is not a certification body.",
              tasks: ["Map AEXS product features to ISO 42001 clauses", "Self-serve readiness export — customers run it on their own systems", "Document AEXS's own ISO 42001 alignment", "Publish technical alignment notes (engineering documentation)"],
              cost: "$5,000 (product governance review)",
              time: "2 months"
            },
            {
              step: "Step 7",
              title: "Embedded Channel Distribution",
              detail: "Package AEXS as embedded software for enterprise software partners — GRC platforms, ERP systems, compliance-tooling vendors. Partners distribute AEXS under their own brand or as an embedded module. AEXS supplies the platform; partners handle distribution. Software-to-software channel only.",
              tasks: ["Build embeddable / white-label deployment mode", "Theme-and-brand abstraction for partner branding", "Volume pricing for software resale", "Integration SDK for partner GRC and ERP platforms", "Partner technical onboarding and platform support"],
              cost: "$15,000 dev",
              time: "2 months"
            },
            {
              step: "Step 8",
              title: "Expand to Emerging Markets",
              detail: "Adapt AEXS for jurisdictions with active AI regulatory frameworks — Brazil (LGPD), Singapore (MAS AI rules), UAE (AI regulation 2024). Customers in these markets can run AEXS against their local regulatory taxonomy. Low platform competition, high software demand.",
              tasks: ["Add per-jurisdiction regulatory taxonomy modules to the platform", "Localize platform (language and regulatory mapping)", "Per-region software documentation and onboarding flows", "Virtual launch events for software-buyer audiences", "Technical media outreach (developer / IT press)"],
              cost: "$8,000 per market",
              time: "3 months per market"
            }
          ]
        }
      ]
    },
    {
      id: 3,
      emoji: "📊",
      title: "Decision Support",
      subtitle: "Structured decision logging with historical context",
      color: 'var(--color-purple-ui)',
      accent: "#0a0812",
      score: 40,
      phases: [
        {
          phase: "PHASE 1",
          title: "Intelligence Engine Build",
          duration: "Weeks 1–5",
          icon: "🔬",
          steps: [
            {
              step: "Step 1",
              title: "Define Decision Taxonomy",
              detail: "Map the 10 most common executive decisions: hiring, pricing, market entry, M&A, budget allocation, vendor selection, product roadmap, partnerships, firing, pivoting.",
              tasks: ["Interview 10 executives (free)", "Document decision frameworks used", "Map data inputs needed per decision type", "Identify blind spots in current process", "Create decision taxonomy document"],
              cost: "$0",
              time: "1 week"
            },
            {
              step: "Step 2",
              title: "Data Feed Architecture",
              detail: "Connect to real-world signal sources: news APIs, financial data, industry reports, social sentiment. This is what makes decisions 'live'.",
              tasks: ["NewsAPI / Aylien for news signals", "Alpha Vantage for market data", "Crunchbase API for competitor funding", "Google Trends for market signals", "Internal BI tool connectors (Tableau/Looker)"],
              cost: "$1,500/mo (data feeds)",
              time: "2 weeks"
            },
            {
              step: "Step 3",
              title: "Scenario Modeling Engine",
              detail: "For any decision, AI generates 3 scenarios: optimistic, realistic, pessimistic — with probability scores and key risk factors per scenario.",
              tasks: ["Monte Carlo simulation module", "Claude API for scenario narrative", "Risk factor extraction from news", "Probability calibration against historical outcomes", "Visual scenario comparison UI"],
              cost: "$6,000 dev",
              time: "3 weeks"
            },
            {
              step: "Step 4",
              title: "Executive Brief Generator",
              detail: "Core product output: a 1-page AI brief delivered before every major meeting or decision point. Digestible in 90 seconds.",
              tasks: ["Brief template design (1 page max)", "Key metric auto-pull", "Competitor snapshot section", "Risk flags highlighted in red", "Suggested next steps (non-binding) with confidence score — for user review"],
              cost: "$3,000 dev",
              time: "2 weeks"
            }
          ]
        },
        {
          phase: "PHASE 2",
          title: "Exclusive Beta & Positioning",
          duration: "Weeks 6–14",
          icon: "💎",
          steps: [
            {
              step: "Step 5",
              title: "Invite-Only Beta Strategy",
              detail: "Position as ultra-premium from day one. 'Invite only' creates scarcity and prestige. Target 10 anchor executives with impressive titles.",
              tasks: ["Design invite-only landing page", "Write personal outreach to 30 target CEOs", "Offer free 90-day pilot (no credit card)", "Require NDA for beta access", "Document every use case as case study"],
              cost: "$1,000 (design)",
              time: "2 weeks"
            },
            {
              step: "Step 6",
              title: "Decision Outcome Tracking",
              detail: "Build a feature that tracks decisions made using the platform and measures actual outcomes 30/60/90 days later. This data becomes your sales proof.",
              tasks: ["Decision log with timestamp", "Outcome check-in prompts (email)", "ROI calculator (time saved, revenue impact)", "Success rate dashboard", "Anonymized benchmark reporting"],
              cost: "$2,000 dev",
              time: "2 weeks"
            },
            {
              step: "Step 7",
              title: "Competitor Intelligence Module",
              detail: "Automatically monitors competitors: funding rounds, product launches, hiring signals, pricing changes, press coverage — all in one feed.",
              tasks: ["Crunchbase + LinkedIn alerts", "Press release monitoring (Google Alerts API)", "Job posting analysis (signals of strategic direction)", "Patent filing tracker", "Weekly competitor digest email"],
              cost: "$800/mo (APIs)",
              time: "3 weeks"
            },
            {
              step: "Step 8",
              title: "Mobile Executive App",
              detail: "C-suite executives live on their phones. Build a React Native app that delivers briefs, alerts, and scenario comparisons with one thumb.",
              tasks: ["React Native app scaffold", "Push notification for urgent signals", "Biometric auth (Face ID)", "Offline brief caching", "Apple Watch complication (key metric)"],
              cost: "$8,000 dev",
              time: "4 weeks"
            }
          ]
        },
        {
          phase: "PHASE 3",
          title: "Enterprise & Network Effects",
          duration: "Months 4–12",
          icon: "🌐",
          steps: [
            {
              step: "Step 9",
              title: "Board Meeting Intelligence",
              detail: "Expand from CEOs to boards. AI prepares board packs, synthesizes management reports, flags governance risks, and tracks board resolutions.",
              tasks: ["Board pack auto-generation", "Resolution tracking system", "Governance risk scoring", "Director briefing personalization", "Integration with board portals (Diligent, BoardPad)"],
              cost: "$12,000 dev",
              time: "2 months"
            },
            {
              step: "Step 10",
              title: "Investment Committee Product",
              detail: "Pivot module to serve VC/PE investment committees. AI scores deals, runs due diligence checklists, and compares to portfolio benchmarks.",
              tasks: ["Deal scoring rubric", "Due diligence checklist automation", "Portfolio benchmark comparison", "Exit scenario modeling", "Integration with DealCloud/Affinity CRM"],
              cost: "$10,000 dev",
              time: "6 weeks"
            },
            {
              step: "Step 11",
              title: "Benchmark Network",
              detail: "With 500+ executives on platform, anonymize and aggregate decision data to create industry benchmarks. 'CEOs in your sector take X weeks to make hiring decisions.'",
              tasks: ["Anonymization pipeline", "Industry classification tagging", "Benchmark report product ($2,500/report)", "Quarterly 'Executive Decision Index' report", "PR campaign around index launch"],
              cost: "$5,000 dev",
              time: "1 month"
            },
            {
              step: "Step 12",
              title: "Government & Policy Expansion",
              detail: "Ministers and senior officials face high-stakes decisions with limited data. Adapt platform for public sector: policy impact modeling, constituency data.",
              tasks: ["Public data source connectors", "Policy impact simulation module", "Constituency sentiment analysis", "Secure government-grade hosting (FedRAMP/IASME)", "Tender for pilot with 1 government department"],
              cost: "$20,000 (compliance + dev)",
              time: "3 months"
            }
          ]
        }
      ]
    }
  ]
};

export default function Roadmap() {
  const [activeStartup, setActiveStartup] = useState(0);
  const [activePhase, setActivePhase] = useState(0);
  const [activeStep, setActiveStep] = useState(null);

  const startup = data.startups[activeStartup];
  const phase = startup.phases[activePhase];

  return (
    <div style={{
      fontFamily: "'Georgia', 'Times New Roman', serif",
      color: "#e8e4dc",
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(180deg, #111114 0%, #0c0c0f 100%)",
        borderBottom: "1px solid #2a2a2e",
        padding: "24px 20px 0"
      }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={{ fontSize: 10, letterSpacing: 4, color: "#555", textTransform: "uppercase", fontFamily: "monospace", marginBottom: 8 }}>
            AI VENTURE IMPLEMENTATION GUIDE
          </p>
          <h1 style={{
            fontSize: "clamp(22px, 5vw, 34px)",
            fontWeight: 400,
            letterSpacing: -1,
            margin: "0 0 24px",
            lineHeight: 1.2
          }}>
            Step-by-Step Execution Playbook
          </h1>

          {/* Startup Tabs */}
          <div style={{ display: "flex", gap: 2, overflowX: "auto", paddingBottom: 0 }}>
            {data.startups.map((s, i) => (
              <button
                key={s.id}
                onClick={() => { setActiveStartup(i); setActivePhase(0); setActiveStep(null); }}
                style={{
                  flex: "0 0 auto",
                  padding: "12px 16px",
                  background: activeStartup === i ? s.color : "transparent",
                  color: activeStartup === i ? "#000" : "#888",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "monospace",
                  fontSize: 11,
                  fontWeight: activeStartup === i ? 700 : 400,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  transition: "all 0.2s",
                  borderBottom: activeStartup === i ? "none" : "1px solid #2a2a2e",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  whiteSpace: "nowrap"
                }}
              >
                <span>{s.emoji}</span>
                <span style={{ display: "none" }}>#{s.id} </span>
                {s.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "24px 20px" }}>

        {/* Startup Header */}
        <div style={{
          background: `linear-gradient(135deg, ${startup.accent} 0%, #111114 100%)`,
          border: `1px solid ${startup.color}33`,
          borderLeft: `3px solid ${startup.color}`,
          borderRadius: 4,
          padding: "20px 24px",
          marginBottom: 24
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <p style={{ fontSize: 10, letterSpacing: 3, color: startup.color, fontFamily: "monospace", margin: "0 0 6px", textTransform: "uppercase" }}>
                Module {startup.id} of 3
              </p>
              <h2 style={{ fontSize: 22, fontWeight: 400, margin: "0 0 4px" }}>{startup.emoji} {startup.title}</h2>
              <p style={{ fontSize: 13, color: "#888", margin: 0, fontStyle: "italic" }}>{startup.subtitle}</p>
            </div>
            <div style={{
              textAlign: "center",
              background: `${startup.color}22`,
              border: `1px solid ${startup.color}44`,
              borderRadius: 4,
              padding: "10px 16px",
              flexShrink: 0
            }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: startup.color }}>{startup.score}</div>
              <div style={{ fontSize: 9, color: "#666", letterSpacing: 2, fontFamily: "monospace", textTransform: "uppercase" }}>Score /50</div>
            </div>
          </div>
        </div>

        {/* Phase Selector */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
          {startup.phases.map((p, i) => (
            <button
              key={i}
              onClick={() => { setActivePhase(i); setActiveStep(null); }}
              style={{
                padding: "10px 16px",
                background: activePhase === i ? startup.color : "#18181c",
                color: activePhase === i ? "#000" : "#888",
                border: `1px solid ${activePhase === i ? startup.color : "#2a2a2e"}`,
                borderRadius: 4,
                cursor: "pointer",
                fontFamily: "monospace",
                fontSize: 10,
                letterSpacing: 1,
                fontWeight: activePhase === i ? 700 : 400,
                textTransform: "uppercase",
                transition: "all 0.2s"
              }}
            >
              <span>{p.icon} {p.phase}</span>
              <div style={{ fontSize: 9, opacity: 0.7, marginTop: 2 }}>{p.duration}</div>
            </button>
          ))}
        </div>

        {/* Phase Title */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 20,
          paddingBottom: 16,
          borderBottom: "1px solid #1e1e22"
        }}>
          <span style={{ fontSize: 24 }}>{phase.icon}</span>
          <div>
            <p style={{ fontSize: 10, letterSpacing: 3, color: "#555", fontFamily: "monospace", margin: 0, textTransform: "uppercase" }}>{phase.phase} · {phase.duration}</p>
            <h3 style={{ fontSize: 18, fontWeight: 400, margin: 0 }}>{phase.title}</h3>
          </div>
        </div>

        {/* Steps */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {phase.steps.map((s, i) => (
            <div key={i}>
              <button
                onClick={() => setActiveStep(activeStep === i ? null : i)}
                style={{
                  width: "100%",
                  background: activeStep === i ? "#18181c" : "#131316",
                  border: `1px solid ${activeStep === i ? startup.color + "66" : "#222226"}`,
                  borderRadius: 4,
                  padding: "16px 20px",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  gap: 16
                }}
              >
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: activeStep === i ? startup.color : "#222",
                  color: activeStep === i ? "#000" : startup.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  fontFamily: "monospace",
                  fontWeight: 700,
                  flexShrink: 0,
                  border: `1px solid ${startup.color}44`
                }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 10, color: "#555", fontFamily: "monospace", margin: "0 0 3px", letterSpacing: 2, textTransform: "uppercase" }}>{s.step}</p>
                  <p style={{ fontSize: 15, color: activeStep === i ? "#fff" : "#ccc", margin: 0 }}>{s.title}</p>
                </div>
                <div style={{
                  fontSize: 16,
                  color: startup.color,
                  transform: activeStep === i ? "rotate(90deg)" : "none",
                  transition: "transform 0.2s",
                  flexShrink: 0
                }}>›</div>
              </button>

              {/* Expanded Step */}
              {activeStep === i && (
                <div style={{
                  background: "#0e0e11",
                  border: `1px solid ${startup.color}33`,
                  borderTop: "none",
                  borderRadius: "0 0 4px 4px",
                  padding: "20px 24px"
                }}>
                  <p style={{ fontSize: 14, color: "#aaa", lineHeight: 1.7, margin: "0 0 20px", fontStyle: "italic" }}>
                    {s.detail}
                  </p>

                  {/* Tasks */}
                  <div style={{ marginBottom: 20 }}>
                    <p style={{ fontSize: 9, letterSpacing: 3, color: "#555", fontFamily: "monospace", margin: "0 0 10px", textTransform: "uppercase" }}>
                      ACTION TASKS
                    </p>
                    {s.tasks.map((t, j) => (
                      <div key={j} style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 10,
                        padding: "8px 0",
                        borderBottom: j < s.tasks.length - 1 ? "1px solid #1a1a1e" : "none"
                      }}>
                        <div style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: startup.color,
                          marginTop: 6,
                          flexShrink: 0
                        }} />
                        <span style={{ fontSize: 13, color: "#ccc", lineHeight: 1.5 }}>{t}</span>
                      </div>
                    ))}
                  </div>

                  {/* Meta */}
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    <div style={{
                      background: "#18181c",
                      border: "1px solid #2a2a2e",
                      borderRadius: 4,
                      padding: "8px 14px"
                    }}>
                      <p style={{ fontSize: 9, color: "#555", fontFamily: "monospace", margin: "0 0 3px", letterSpacing: 2, textTransform: "uppercase" }}>Est. Cost</p>
                      <p style={{ fontSize: 13, color: startup.color, margin: 0, fontFamily: "monospace" }}>{s.cost}</p>
                    </div>
                    <div style={{
                      background: "#18181c",
                      border: "1px solid #2a2a2e",
                      borderRadius: 4,
                      padding: "8px 14px"
                    }}>
                      <p style={{ fontSize: 9, color: "#555", fontFamily: "monospace", margin: "0 0 3px", letterSpacing: 2, textTransform: "uppercase" }}>Timeline</p>
                      <p style={{ fontSize: 13, color: "#ccc", margin: 0, fontFamily: "monospace" }}>{s.time}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Progress Indicator */}
        <div style={{
          marginTop: 32,
          padding: "16px 20px",
          background: "#0e0e11",
          border: "1px solid #1e1e22",
          borderRadius: 4
        }}>
          <p style={{ fontSize: 9, letterSpacing: 3, color: "#444", fontFamily: "monospace", margin: "0 0 10px", textTransform: "uppercase" }}>
            Overall Roadmap Progress
          </p>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {startup.phases.map((p, i) => (
              <div key={i} style={{ flex: 1 }}>
                <div style={{ fontSize: 9, color: i <= activePhase ? startup.color : "#444", fontFamily: "monospace", marginBottom: 4, textAlign: "center" }}>
                  {p.phase}
                </div>
                <div style={{
                  height: 3,
                  background: i < activePhase ? startup.color : i === activePhase ? `linear-gradient(90deg, ${startup.color}, ${startup.color}44)` : "#222",
                  borderRadius: 2
                }} />
              </div>
            ))}
          </div>
        </div>

        <p style={{ textAlign: "center", fontSize: 10, color: "#333", fontFamily: "monospace", letterSpacing: 2, marginTop: 32 }}>
          TAP EACH STEP TO EXPAND · BUILT FOR MC © 2026
        </p>
      </div>
    </div>
  );
}
