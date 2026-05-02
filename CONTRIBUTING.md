# Contributing to AEXS

AEXS is the interactive investor demo for the AI Executive Suite — a 12-slide pitch deck, execution roadmap, and 36-month financial model, built with React 19 and Vite 8.

## Setup

```bash
npm install
npm run dev
```

The dev server runs at `http://localhost:5173`.

## Verification

Before submitting a change, run:

```bash
npm run check
```

This runs lint, tests, build, docs-sync, theme-sync, and content-consistency in sequence. CI runs the same gate on every push and pull request.

Component-level commands:

```bash
npm run build      # production build
npm run test       # vitest
npm run lint       # eslint
```

A pre-commit hook at `.githooks/pre-commit` runs `verify-content-consistency` on every commit. It is enabled automatically when you run `npm install`.

## Single source of truth

- Business facts (pricing, ARR, traction, suite tiers): `content/pitch-data.json`.
- Architecture decisions: `docs/decisions/`.

The `verify-content-consistency` guard prevents drift between `content/pitch-data.json` and the rendered JSX.

## Change hygiene

- Minimum clean change. No speculative refactors.
- Preserve working behavior unless the task explicitly changes it.
- Keep commits reviewable and logically grouped.

## Security

Do not commit secrets. `.env`, `.env.local`, and `.env.*.local` are gitignored — keep them that way.
