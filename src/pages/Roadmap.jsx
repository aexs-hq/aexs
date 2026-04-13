import { useState } from "react";
import { C } from '../constants/theme';


const data = {
  startups: [
    {
      id: 1,
      emoji: "🧠",
      title: "AI Chief of Staff",
      subtitle: "The operating brain behind every CEO",
      color: C.gold,
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
              title: "Legal & Entity Setup",
              detail: "Register LLC/Ltd. Secure domain (e.g. staffai.io). Set up business bank account. Draft founders agreement if co-founding.",
              tasks: ["Register business entity", "Open business bank account", "Secure domain + trademark check", "Set up accounting (QuickBooks/Xero)"],
              cost: "$500–$2,000",
              time: "3–5 days"
            },
            {
              step: "Step 2",
              title: "Tech Stack Scaffolding",
              detail: "Initialize Next.js app. Connect Claude API (Anthropic). Set up Postgres DB + Pinecone vector store. Configure auth via Clerk or Auth0.",
              tasks: ["Next.js + Tailwind setup", "Anthropic API key + billing", "Postgres via Supabase", "Pinecone vector DB account", "Auth0 / Clerk for login"],
              cost: "$200/mo infrastructure",
              time: "1 week"
            },
            {
              step: "Step 3",
              title: "Core Integrations",
              detail: "Build OAuth connectors to Gmail, Google Calendar, Slack. These are your data sources for the AI's memory and context engine.",
              tasks: ["Gmail API OAuth flow", "Google Calendar read/write", "Slack workspace bot", "Notion API connector"],
              cost: "$0 (API tiers)",
              time: "2 weeks"
            },
            {
              step: "Step 4",
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
              step: "Step 5",
              title: "Beta Recruitment",
              detail: "Target 20–50 beta CEOs/founders. Offer free 60-day access in exchange for weekly feedback calls. Use LinkedIn + warm network.",
              tasks: ["Write outreach script", "Build waitlist landing page", "Set up Typeform feedback loop", "Schedule weekly calls (Calendly)", "Join CEO/founder Slack communities"],
              cost: "$500 (ads optional)",
              time: "1 week"
            },
            {
              step: "Step 6",
              title: "Meeting Intelligence Feature",
              detail: "Integrate with Zoom/Google Meet. AI joins meetings, transcribes, extracts action items, assigns owners, and follows up automatically.",
              tasks: ["Recall.ai or Otter.ai API integration", "Action item extraction prompt", "Slack/email follow-up automation", "Meeting summary dashboard"],
              cost: "$300/mo (transcription API)",
              time: "3 weeks"
            },
            {
              step: "Step 7",
              title: "Feedback Loop & Iteration",
              detail: "Run NPS surveys after each week. Identify top 3 pain points. Sprint-fix the highest-impact issues. Kill features nobody uses.",
              tasks: ["Weekly NPS via Typeform", "Feature usage analytics (Mixpanel)", "User interview recordings", "Prioritize backlog by retention impact"],
              cost: "$200/mo (tools)",
              time: "Ongoing"
            },
            {
              step: "Step 8",
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
              step: "Step 9",
              title: "Content Marketing Engine",
              detail: "Publish 2x/week on LinkedIn. Topics: executive productivity, AI leadership, decision-making. Build email newsletter 'The CEO Brief'.",
              tasks: ["LinkedIn content calendar", "Newsletter via Beehiiv", "SEO blog (CEO productivity keywords)", "YouTube: 'AI CEO workflow' series", "Podcast guest appearances"],
              cost: "$1,000/mo (content creator)",
              time: "Ongoing"
            },
            {
              step: "Step 10",
              title: "Partnership Channel",
              detail: "Partner with executive coaches, VC firms, and leadership consultancies. They refer clients; you pay 20% recurring commission.",
              tasks: ["Identify 20 target partners", "Build partner portal", "Create co-branded materials", "Set up affiliate tracking (Rewardful)", "Launch partner newsletter"],
              cost: "$500 setup",
              time: "1 month"
            },
            {
              step: "Step 11",
              title: "AI Memory Graph (Differentiator)",
              detail: "Build proprietary 'executive knowledge graph' — AI learns your communication style, priorities, relationships, and decision history over time.",
              tasks: ["RAG architecture with Pinecone", "Executive persona modeling", "Relationship mapping (who matters most)", "Decision history tagging", "Style mimicry for draft emails"],
              cost: "$2,000 dev sprint",
              time: "3 weeks"
            },
            {
              step: "Step 12",
              title: "Series A Preparation",
              detail: "At $1M ARR, prepare fundraising materials. Target AI-focused VCs. Highlight retention rate, NPS, and expansion revenue.",
              tasks: ["Build data room (Notion)", "Financial model (3-year projection)", "Pitch deck (10 slides)", "Warm intro to 20 VCs", "Net Revenue Retention metric > 110%"],
              cost: "$5,000 (advisors/legal)",
              time: "2 months"
            }
          ]
        }
      ]
    },
    {
      id: 2,
      emoji: "⚖️",
      title: "AI Governance as a Service",
      subtitle: "Compliance is the new infrastructure",
      color: C.blue,
      accent: "#080f1a",
      score: 42,
      phases: [
        {
          phase: "PHASE 1",
          title: "Domain Expertise & Setup",
          duration: "Weeks 1–4",
          icon: "📋",
          steps: [
            {
              step: "Step 1",
              title: "Regulatory Research Sprint",
              detail: "Deep-dive into EU AI Act, US AI Executive Orders, ISO 42001. Map out which regulations affect which industries. This becomes your product roadmap.",
              tasks: ["Read EU AI Act full text", "Map risk classifications (unacceptable/high/limited)", "Research US NIST AI RMF framework", "Identify top 5 regulated industries", "Create compliance checklist matrix"],
              cost: "$0",
              time: "1 week"
            },
            {
              step: "Step 2",
              title: "Hire Compliance Advisor",
              detail: "Bring on a part-time legal/compliance expert as advisor (equity + small retainer). Their credibility becomes your credibility.",
              tasks: ["Identify ex-regulator or compliance lawyer", "Structure advisor agreement (0.5–1% equity)", "Define scope: review product, co-author reports", "Get introductions to their network"],
              cost: "$2,000/mo retainer",
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
              tasks: ["Risk scoring algorithm", "Color-coded compliance heatmap", "Remediation recommendation engine", "Audit trail logging", "Export to PDF for board reports"],
              cost: "$5,000 dev",
              time: "3 weeks"
            }
          ]
        },
        {
          phase: "PHASE 2",
          title: "First Clients & Certification",
          duration: "Weeks 5–12",
          icon: "🏛️",
          steps: [
            {
              step: "Step 5",
              title: "Free Audit as Lead Gen",
              detail: "Offer a free 'AI Risk Scan' for any company's existing AI system. Takes 48 hours. Delivers a 10-page report. Converts ~25% to paid.",
              tasks: ["Build self-serve scan intake form", "Automate report generation", "Sales follow-up sequence (3 emails)", "Case study from first 10 audits", "Post results on LinkedIn"],
              cost: "$500 (marketing)",
              time: "2 weeks"
            },
            {
              step: "Step 6",
              title: "Target Fintech & HR AI Firms",
              detail: "These sectors face the most regulatory pressure. Build a hit list of 100 companies using AI in hiring, lending, or insurance.",
              tasks: ["Build prospect list (LinkedIn Sales Nav)", "Personalized cold email sequence", "Attend 2 compliance/fintech conferences", "Publish 'EU AI Act for Fintechs' guide", "Partner with fintech law firms"],
              cost: "$2,000 (events + tools)",
              time: "1 month"
            },
            {
              step: "Step 7",
              title: "Certification Product",
              detail: "Launch 'AI Compliance Certified' badge program. Companies pay $25K for a full audit + certification that they can display publicly.",
              tasks: ["Design certification badge + criteria", "Build verification page (public lookup)", "Legal framework for certification claims", "Press release on first 5 certified companies", "Annual renewal model ($8K/yr)"],
              cost: "$3,000 (legal + design)",
              time: "1 month"
            },
            {
              step: "Step 8",
              title: "Monitoring Subscription Launch",
              detail: "After audit, offer ongoing monitoring: AI watches their models in production for drift, bias creep, and new regulatory changes.",
              tasks: ["Model monitoring via MLflow/Evidently", "Regulatory change alert system", "Monthly compliance score report", "Slack/email alert integration", "Tier pricing: $1,500–$8,000/mo"],
              cost: "$4,000 dev",
              time: "3 weeks"
            }
          ]
        },
        {
          phase: "PHASE 3",
          title: "Scale & Government Contracts",
          duration: "Months 4–12",
          icon: "🏦",
          steps: [
            {
              step: "Step 9",
              title: "ISO 42001 Alignment",
              detail: "Align your product with ISO 42001 (AI Management Systems standard). Become the easiest path to ISO certification. This is a massive moat.",
              tasks: ["Map product to ISO 42001 clauses", "Gap analysis tool for clients", "Pre-certification readiness score", "Partner with ISO certification bodies", "Publish alignment white paper"],
              cost: "$5,000 (consultant)",
              time: "2 months"
            },
            {
              step: "Step 10",
              title: "Government & Public Sector",
              detail: "Register as government vendor (SAM.gov in US, Find a Tender in UK). Bid on AI governance contracts. Average contract: $500K–$2M.",
              tasks: ["Register on procurement portals", "Get security clearance if needed", "Write capability statement", "Identify upcoming AI governance tenders", "Partner with a systems integrator (Deloitte, Accenture)"],
              cost: "$10,000 (legal + registration)",
              time: "3 months"
            },
            {
              step: "Step 11",
              title: "White Label for Big 4",
              detail: "Package your platform for Deloitte, PwC, KPMG, EY to resell to their enterprise clients. They do the sales; you collect platform fees.",
              tasks: ["Build white-label portal", "Remove your branding (theirs instead)", "Volume pricing negotiation", "Integration with their GRC tools", "Co-develop industry report"],
              cost: "$15,000 dev",
              time: "2 months"
            },
            {
              step: "Step 12",
              title: "Expand to Emerging Markets",
              detail: "Brazil (LGPD), Singapore (MAS AI rules), UAE (AI regulation 2024) all need compliance solutions. Low competition, high demand.",
              tasks: ["Regulatory research per market", "Local advisor partnerships", "Localize platform (language + law)", "Virtual launch events per region", "Media outreach to local tech press"],
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
      title: "Executive Decision Support",
      subtitle: "Data-driven leadership, amplified",
      color: C.purple,
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
              tasks: ["Brief template design (1 page max)", "Key metric auto-pull", "Competitor snapshot section", "Risk flags highlighted in red", "Recommended action with confidence score"],
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
                Startup {startup.id} of 3
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
