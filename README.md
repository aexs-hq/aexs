# AEXS — AI Executive Suite

Interactive investor demo for three AI ventures: AI Chief of Staff, AI Governance as a Service, and Executive Decision Support.

## Status

**Demo-ready. All 6 business contradictions fully resolved (2026-04-10).**
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

## CI

CI runs on every push and pull request to `main` via `.github/workflows/ci.yml`.

The single quality gate is:

```bash
npm run check
```

This runs lint, tests, build, and docs-sync verification in sequence.

## Generated docs

`public/docs/` is **generated output** — it is gitignored and never committed.
`docs/business-contradictions.md` is the source of truth.

The public copy is regenerated automatically before the server or build starts:

| Command | When the copy is regenerated |
|---------|------------------------------|
| `npm run dev` | `predev` → `sync-docs` fires before Vite starts |
| `npm run build` | `prebuild` → `sync-docs` fires before Vite builds |
| `npm run sync-docs` | Direct copy — use this standalone when needed |

To verify source and public copy match:

```bash
npm run check-docs-sync
```

Exits 0 silently when they match. Prints a diff and exits 1 when they differ.
Prints an actionable error and exits 1 if the public file does not exist yet.

`npm run check` runs this verification automatically after build.

**Fresh clone:** `public/docs/` will be absent after `git clone`.
Running `npm run dev` or `npm run build` creates it automatically.
To populate it without starting a server: `npm run sync-docs`.

**Pre-commit hook:** A versioned hook at `.githooks/pre-commit` runs `check-docs-sync`
before every commit. It is enabled automatically when you run `npm install` via the
`prepare` script (`git config core.hooksPath .githooks`). No manual step required.

If the hook does not fire after install, check that the file is executable:

```bash
chmod +x .githooks/pre-commit
```

Any commit where source and public copy diverge will be blocked with a clear error.

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

public/docs/                      — generated; gitignored; regenerated by sync-docs before every dev/build
```
