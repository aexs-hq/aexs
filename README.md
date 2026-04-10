# AEXS — AI Executive Suite

Interactive investor demo for three AI ventures: AI Chief of Staff, AI Governance as a Service, and Executive Decision Support.

## Status

**Demo-ready. All 7 business contradictions fully resolved (2026-04-10).**
Financial Model rebuilt as suite-tier architecture. Full record: `docs/founder-decision-sheet.md`.

## Running locally

```bash
npm install
npm run dev
```

App runs at `http://localhost:5173`.

## Building

```bash
npm run build
```

Output goes to `dist/`.

## Testing

Run the unit tests (20 tests, pure Node — no browser required):

```bash
npm run test
```

Run lint + tests + build in sequence (use before committing):

```bash
npm run check
```

Build currently passes with 0 errors and 0 warnings.

To preview the production build locally before a demo (serves `dist/` at `http://localhost:4173`):

```bash
npm run build
npm run preview
```

## Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Investor landing page with links to all three tools |
| `/pitch` | Pitch Deck | 12-slide interactive investor deck |
| `/roadmap` | Execution Roadmap | Phased build playbook for all three ventures |
| `/model` | Financial Model | Interactive 36-month projection with adjustable assumptions |

All routes are lazy-loaded. Navigating to `/pitch` or `/model` fetches the recharts bundle on first visit only.

## Stack

- React 19 + Vite 8
- react-router-dom 7 (client-side routing)
- recharts 3 (charts in Pitch Deck and Financial Model)
- No backend. All pages are static React components.

## Business decisions

All 7 founder decisions applied 2026-04-09:

| Decision | Resolution |
|----------|-----------|
| Seed capital | $1.5M (FinancialModel updated) |
| Pricing architecture | Suite tiers — RESOLVED (model rebuilt as single suite stream 2026-04-10) |
| CoS price points | Pitch Deck prices (FinancialModel updated) |
| Q2 2026 traction milestone | `done: false` — not yet verified |
| Q1 2026 traction milestone | `done: true` confirmed |
| Decision Support brand color | `C.purple` (#9B6CD9) everywhere |
| Y3 ARR headline | Revised to $32.2M (suite model verified); break-even Month 12; valuation $257M |

Full details: `docs/founder-decision-sheet.md` · `docs/business-contradictions.md`

## Project structure

```
src/
├── components/
│   ├── AppLayout.jsx   — outer dark shell + nav
│   ├── NavBar.jsx      — sticky top navigation
│   └── PageShell.jsx   — Suspense fallback + content wrapper
├── constants/
│   └── theme.js        — shared AEXS color palette
├── pages/
│   ├── Home.jsx        — investor landing page (/)
│   ├── PitchDeck.jsx   — 12-slide deck (/pitch)
│   ├── Roadmap.jsx     — execution playbook (/roadmap)
│   └── FinancialModel.jsx — 36-month model (/model)
└── utils/
    ├── format.js       — shared number formatters (fmtK, fmtM, fmtPct)
    ├── suiteCalc.js    — suite-tier model logic (suiteDefaults + calcSuite)
    └── suiteCalc.test.js — Vitest tests for calcSuite and formatters

docs/
├── business-contradictions.md    — original audit: 6 contradictions found, all resolved
├── founder-decision-sheet.md     — 7 founder decisions with sign-off record
└── post-approval-audit-status.md — resolution verification and suite-model output summary
```
