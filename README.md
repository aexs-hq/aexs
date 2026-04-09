# AEXS — AI Executive Suite

Interactive investor demo for three AI ventures: AI Chief of Staff, AI Governance as a Service, and Executive Decision Support.

## Status

**Demo-ready locally. Not yet cleared for external sharing.**
Several business assumptions contain unresolved contradictions between files.
See `docs/business-contradictions.md` and `docs/founder-decision-sheet.md` before sharing.

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

Output goes to `dist/`. Build currently passes with 0 errors and 0 warnings.

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

## Known unresolved business contradictions

The following items require founder decisions before this demo is shared externally.
**Nothing has been changed in code pending those decisions.**

| ID | Topic | Severity |
|----|-------|----------|
| BC-001 | AI Chief of Staff pricing: model ($299/$799/$3,500) vs pitch ($499/$1,999/$8,500) | High |
| BC-002 | Pricing architecture: unified suite tiers vs per-product pricing | Critical |
| BC-003 | Seed capital: Financial Model uses $150K, Pitch Deck shows $1.5M | Critical |
| BC-004 | Decision Support brand color: `#6B4CC9` in Roadmap vs `#9B6CD9` everywhere else | Low |
| BC-005 | Two traction milestones marked "done" but not yet externally verified | High |
| BC-006 | $44M Y3 ARR headline not verified against Financial Model output | High |

Full details: `docs/business-contradictions.md`
Decision sheet for founder: `docs/founder-decision-sheet.md`

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
    └── format.js       — shared number formatters (fmtK, fmtM, fmtPct)

docs/
├── business-contradictions.md  — detailed contradiction analysis
└── founder-decision-sheet.md   — decision table for founder sign-off
```
