# AEXS System State and Presentation Brief Report
## Monday Presentation Brief — Internal

**Date:** 2026-04-16  
**Prepared by:** Engineering review  
**Classification:** Internal only — not for distribution  
**Presentation:** Monday, 2026-04-21

---

## Presentation Objective

Demonstrate that AEXS is a credible, buildable, internally consistent product — with a verified financial story, a working interactive demo, a downloadable investor deck, and a founder who understands both the product and the numbers. The goal is not to close. The goal is to create enough confidence that the room wants to take the next step.

---

## What AEXS Is Today

AEXS is the AI-native command layer for enterprise leadership. It combines three integrated modules:

1. **AI Chief of Staff** — Executive memory, briefings, follow-up tracking, stakeholder mapping
2. **AI Governance Engine** — EU AI Act compliance, ISO 42001 documentation, board-ready audit reports
3. **Decision Intelligence** — Structured decision frameworks, scenario modeling, full audit trail

Sold as a unified suite with three pricing tiers: **$499 / $1,999 / $8,500 per month**.

The positioning: AEXS sits at the intersection of executive software, AI SaaS, and GRC — a category no incumbent currently owns.

---

## What Has Been Built

As of 2026-04-16, the following are built and verified:

### Product surfaces (all running in the same React SPA)

| Surface | What it shows |
|---------|---------------|
| **`/pitch` — Investor Deck** | Cinematic scrollable deck, 12 sections, fixed sidebar with progress bar, PDF download |
| **`/model` — Financial Model** | Interactive 36-month suite-tier projection with adjustable assumptions |
| **`/roadmap` — Execution Roadmap** | Phased build plan across all three venture layers |
| **`/` — Home** | Investor landing page linking to all three tools |

### Engineering foundation

| Item | State |
|------|-------|
| Suite financial model (`calcSuite`) | Verified by 20 unit tests |
| CI pipeline | GitHub Actions — runs on every push to `main` |
| Pre-commit quality gate | Blocks divergent docs before any commit |
| `npm run check` | 0 errors, 0 warnings — ESLint + Vitest + Vite build + docs-sync |
| Business contradictions | All 6 identified and fully resolved |
| Founder decisions | All 7 documented and applied to code |

### Investor PDF

A PDF investor deck is present in `public/deck.pdf` and wired to the "REQUEST FULL DECK" button in the top nav and the "DOWNLOAD DECK" button on The Ask slide. Clicking either button triggers a browser download.

---

## What Is Stable

The following are stable, consistent, and safe to demonstrate:

- All four routes render and navigate cleanly
- Financial figures are consistent between the pitch deck and the financial model
- Suite pricing ($499/$1,999/$8,500) appears identically in both the pitch and the model
- Seed round ($1.5M), Y3 ARR ($32.2M), break-even (Month 12), and implied valuation ($257M at 8×) are all derived from the same verified model
- Q1 2026 foundation milestone is confirmed and shown accurately
- Q2 2026 is shown as pending — not falsely claimed as done
- PDF download is functional

---

## Demo Order

Suggested flow for a 10–15 minute live demo:

**1. Open the home page (`/`)**
> "This is AEXS — the AI executive suite. Three integrated layers: Chief of Staff, Governance, and Decision Intelligence."

**2. Navigate to the Pitch Deck (`/pitch`)**
> Walk the sidebar. Scroll through Cover → Problem → Solution → Market.
> Pause on the Problem slide — point to the four stats: 73% exec overload, $3T lost, 40+ frameworks, 12% AI success rate.
> "These aren't projections — they are the market conditions creating the demand."

**3. Scroll to Business Model**
> "One suite. Three tiers. $499 to $8,500 per month. Land with compliance urgency, expand across the suite."

**4. Scroll to Financials**
> "This is our path: $1.5M seed, break-even Month 12, $32.2M Y3 ARR, $257M implied valuation."

**5. Click REQUEST FULL DECK**
> Demonstrate that the PDF downloads.

**6. Switch to the Financial Model (`/model`)**
> "Every number in the pitch deck is live in the model. You can move the assumptions."
> Show that suite pricing, seed capital, and ARR figures match what was just shown in the deck.

**7. Brief mention of Roadmap (`/roadmap`)**
> "The execution plan is phased across three ventures — this is how we get from here to $32.2M."

**8. Close on The Ask slide in the deck**
> "$1.5M SAFE note at $8M cap. This round funds GTM, engineering, and the first enterprise pilots."

---

## Core Proof Statement

> "Every number in this presentation is derived from a working financial model. The pitch deck and the model use the same suite pricing, the same seed capital, and the same growth assumptions. There are no numbers in the deck that cannot be traced to the model."

This is verifiable, accurate, and differentiating. Most early-stage decks present numbers with no live proof. AEXS has an interactive model to back every figure.

---

## What To Emphasize

- **The regulatory timing.** EU AI Act is enforceable now. This is not a future market — compliance urgency exists today.
- **The model discipline.** The pitch and model are consistent. All contradictions were found, documented, and resolved before this presentation.
- **The founder fit.** The founder is the target customer. The product was built to solve a problem the founder experienced directly.
- **The unified category position.** No incumbent owns all three layers simultaneously. AEXS is not competing with Monday.com or OneTrust — it is the layer above them.
- **The verified figures.** $32.2M Y3 ARR is not a guess. It is the output of a verified suite model at $499/$1,999/$8,500, with 8× ARR multiple and Month 12 break-even.

---

## What Not To Overclaim

| Do not say | Why |
|------------|-----|
| "The MVP is live" | Q2 2026 milestone (`done: false`) — not yet verified |
| "We have 20 beta users" | Not confirmed |
| "We have $15K MRR" | Not confirmed |
| "The product is live at [URL]" | Live deployment cannot be confirmed from repo — verify before making this claim |
| "Phase 1 is complete and signed off" | Engineering is done; founder sign-offs are still outstanding |
| "We close Series A in Q4 2026" | This is the plan; it is not a commitment |
| "The EU AI Act requires our product" | The Act creates demand — say "creates urgency" not "requires AEXS specifically" |

---

## Anticipated Questions

**"Can I see the numbers in detail?"**
> Open the Financial Model (`/model`). Walk through suite tiers, break-even, and Y3 ARR. The model is live and interactive.

**"Is the product live? Can I use it?"**
> Do not guess. If a live URL has been confirmed before Monday, say so. If not: "We are in the pilot preparation phase — the investor deck and model you're seeing are the current demo surfaces."

**"What does the competition look like?"**
> Navigate to the Competition slide in the deck. Walk the comparison matrix. The key message: every competitor solves one dimension. AEXS owns the intersection.

**"How do you get to $32.2M?"**
> Open the Financial Model. Show suite pricing, customer growth rate, and the break-even point. The numbers trace back to $499/$1,999/$8,500 per month at modeled conversion rates.

**"What's the EU AI Act exposure for companies?"**
> Non-compliance: fines up to 7% of global annual turnover. Article 13 (transparency) is in force now. Most companies have no tooling.

**"Why now?"**
> EU AI Act enforcement began August 2025. The compliance window has opened and the urgency is real. First-mover advantage in AI governance tooling goes to whoever gets to enterprise procurement first.

**"Who is on the team?"**
> The founder. AI agents handle the product layers until seed capital funds the first four hires: Head of Sales/GTM (Month 1), Senior Engineer (Month 2), Customer Success Lead (Month 3), Marketing Lead (Month 4).

**"What does the $1.5M buy?"**
> 40% Sales/GTM ($600K), 30% Engineering ($450K), 15% Marketing ($225K), 15% Operations/Legal ($225K). Walk the allocation bar on The Ask slide.

---

## Short Closing

AEXS enters Monday's presentation as:

- A working product demo across four routes
- A verified, internally consistent financial model
- A downloadable investor PDF
- A clean engineering foundation with CI, tests, and quality gates
- A founder-reviewed, contradiction-free business story

The story is tight. The numbers are clean. The demo is visually investor-grade.

The one thing that must be confirmed before the session opens: whether a live public URL exists to offer investors post-meeting access. Everything else is ready.
