<div align="center">

# AEXS

**AI Executive Suite**

*Governance-first AI for regulated European enterprises*

[![stage](https://img.shields.io/badge/stage-pre--seed-C8A84B?style=flat-square&labelColor=080C18)](#status)
[![demo](https://img.shields.io/badge/demo-ready-22c55e?style=flat-square&labelColor=080C18)](#demo-routes)
[![ViennaUP](https://img.shields.io/badge/ViennaUP-2026-3B82F6?style=flat-square&labelColor=080C18)](#viennaup-2026-context)
[![built with](https://img.shields.io/badge/built_with-React_19_%2B_Vite_8-C8A84B?style=flat-square&labelColor=080C18)](#stack)

</div>

---

## Overview

AEXS is an AI Executive Suite for regulated European enterprises — governance first, decision support next.

This repository contains the interactive investor demo for AEXS, including a 12-slide pitch deck, an execution roadmap, a 36-month financial model, and the supporting documentation that keeps business assumptions consistent across every surface.

The repository supports investor, advisor, and design-partner conversations by making the AEXS pitch, roadmap, assumptions, and financial model inspectable in one place.

AEXS is currently pre-seed, FlexKap in formation in Lower Austria, and being prepared for design-partner validation around ViennaUP 2026 / Human × AI.

## Product framing

AEXS is being built around three planned modules:

1. **AI Chief of Staff** — executive workflow support, briefing, memory, and coordination.
2. **AI Governance as a Service** — audit trails, human-in-the-loop controls, evidence artifacts, and governance workflows designed against the EU AI Act and ISO/IEC 42001.
3. **Executive Decision Support** — structured decision logs, scenario comparison, and executive reasoning support.

The initial wedge is governance. Regulated enterprises want AI productivity, but adoption is often blocked by compliance, data protection, security, procurement, and auditability concerns. Governance comes first; decision support follows.

## ViennaUP 2026 context

This demo is being prepared as part of AEXS founder preparation for ViennaUP 2026 and the Human × AI Conference on 19 May 2026.

AEXS is approaching the week as a Lower Austria–based, FlexKap-in-formation venture, using it to:

- Validate the governance-first thesis with regulated-enterprise design partners.
- Engage with European investors and operators familiar with the EU AI Act, ISO/IEC 42001, and adjacent compliance regimes.
- Position AEXS as the AI Executive Suite for the regulated European mid-market.

This README, the demo, and the supporting docs are the canonical artifacts shared in those conversations.

## Demo routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Investor landing page with links to the AEXS demo surfaces |
| `/pitch` | Pitch Deck | 12-slide interactive investor deck |
| `/roadmap` | Execution Roadmap | Phased build playbook |
| `/model` | Financial Model | 36-month projection with adjustable assumptions |

All routes are lazy-loaded. The recharts bundle is only fetched when `/pitch` or `/model` is opened.

## Status

Demo-ready for investor, advisor, and design-partner review.

The financial model is built around a suite-tier architecture, and business-assumption corrections are tracked in `docs/business-contradictions.md`. Canonical business values are consolidated in `content/pitch-data.json` (ADR-004), and a pre-commit guard prevents the rendered JSX from drifting away from that file. Build, lint, and unit tests run green on every push and pull request via CI.

Stage: pre-seed, FlexKap in formation in Lower Austria, preparing for ViennaUP 2026 / Human × AI design-partner conversations.

## Public demo note

This repository contains a static investor demo. It does not contain production customer data, private credentials, or deployed backend services.

AEXS does not claim AI Act compliance, ISO/IEC 42001 certification, paying customers, or production deployment. The product is being designed against the EU AI Act and ISO/IEC 42001 as governance constraints.

Numbers shown in the pitch deck and financial model reflect the founder's working assumptions for AEXS at pre-seed. Treat them as a structured projection for discussion — they are not committed forecasts. The financial model is interactive: pricing, growth rate, churn, COGS, and burn assumptions can be adjusted in the browser to test sensitivity.

## Business assumptions and founder decisions

Canonical business values — round size, ARR figures, unit economics, and suite pricing — live in `content/pitch-data.json` and are referenced from every rendering surface. A pre-commit guard (`verify-content-consistency`) prevents the JSX from drifting away from this single source.

Headline assumptions, drawn from `content/pitch-data.json`:

| Item | Value |
|------|-------|
| Round | $1.5M SAFE, $8M cap |
| ARR Y1 / Y2 / Y3 | $2.6M / $9.2M / $32.2M |
| Break-even | Month 12 |
| Gross margin Y3 | ~73% |
| Net revenue retention | 120% |
| LTV / CAC | 5:1 |
| CAC payback | 12 months |
| Average deal size | $24K |
| Suite pricing | Starter $499/mo · Growth $1,999/mo · Enterprise $8,500/mo |

Resolved business-assumption corrections are recorded in `docs/business-contradictions.md`, the contradiction source of truth for this repository. The financial model is built around a suite-tier architecture.

---

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

To preview the production build locally before a demo (serves `dist/` at `http://localhost:4173`):

```bash
npm run build
npm run preview
```

## Testing

Run the unit tests (pure Node — no browser required):

```bash
npm run test
```

Run lint, tests, build, and docs-sync verification in sequence (use before committing):

```bash
npm run check
```

The build currently passes with 0 errors and 0 warnings.

## CI

CI runs on every push and pull request to `main` via `.github/workflows/ci.yml`.

The single quality gate is:

```bash
npm run check
```

This runs lint, tests, build, and docs-sync verification in sequence.

## Generated docs

`public/docs/` is **generated output** — it is gitignored and never committed. `docs/business-contradictions.md` is the source of truth.

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

Exits 0 silently when they match. Prints a diff and exits 1 when they differ. Prints an actionable error and exits 1 if the public file does not exist yet.

`npm run check` runs this verification automatically after build.

**Fresh clone:** `public/docs/` will be absent after `git clone`. Running `npm run dev` or `npm run build` creates it automatically. To populate it without starting a server: `npm run sync-docs`.

## Pre-commit hooks

A versioned hook at `.githooks/pre-commit` runs two guards before every commit:

1. `npm run check-docs-sync` — `docs/` and `public/docs/` stay aligned.
2. `npm run verify-content-consistency` — every canonical business value rendered in JSX or Python references `content/pitch-data.json` (ADR-004).

The hook is enabled automatically when you run `npm install`, via the `prepare` script (`git config core.hooksPath .githooks`). To install manually on a fresh clone:

```bash
npm run setup-hooks     # equivalent to: git config core.hooksPath .githooks
chmod +x .githooks/pre-commit
```

Any commit that breaks either guard is blocked with a clear error pointing at the offending file and line.

## Stack

- React 19 + Vite 8
- react-router-dom 7 (client-side routing)
- recharts 3 (charts in Pitch Deck and Financial Model)
- No backend. All pages are static React components served as a single-page app.

## Project structure

```
src/
├── components/
│   ├── AppLayout.jsx       — outer dark shell + nav
│   ├── NavBar.jsx          — sticky top navigation
│   └── PageShell.jsx       — Suspense fallback + content wrapper
├── constants/
│   └── theme.js            — shared AEXS color palette
├── pages/
│   ├── Home.jsx            — investor landing page (/)
│   ├── PitchDeck.jsx       — 12-slide deck (/pitch)
│   ├── Roadmap.jsx         — execution playbook (/roadmap)
│   └── FinancialModel.jsx  — 36-month model (/model)
└── utils/
    ├── format.js           — shared number formatters (fmtK, fmtM, fmtPct)
    ├── suiteCalc.js        — suite-tier model logic (suiteDefaults + calcSuite)
    └── suiteCalc.test.js   — Vitest tests for calcSuite and formatters

content/
└── pitch-data.json             — canonical business values (ADR-004)

docs/
├── business-contradictions.md  — contradiction source of truth
└── decisions/                  — architecture decision records (ADRs)

public/docs/                    — generated; gitignored; regenerated by sync-docs before every dev/build
```

---

<div align="center">
<sub>AEXS · pre-seed · Lower Austria · ViennaUP 2026 / Human × AI</sub>
</div>

