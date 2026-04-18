# Release Readiness Checklist

Internal reference. Not for distribution.

---

## Purpose

Gate check before treating Phase 1 as complete and the demo as investor-ready.  
All items must be checked before sign-off.

---

## Repo and CI

- [ ] `npm run check` passes with 0 errors and 0 warnings
- [ ] CI pipeline (`.github/workflows/ci.yml`) exists and runs on push to `main`
- [ ] Pre-commit hook (`.githooks/pre-commit`) is in place and enforces docs sync
- [ ] No uncommitted changes on the release branch

## Documentation

- [ ] `docs/business-contradictions.md` — all contradictions resolved
- [ ] `docs/founder-decision-sheet.md` — all 7 decisions recorded and signed off
- [ ] `docs/post-approval-audit-status.md` — resolution verified
- [ ] `docs/02-phase-1/phase-1-completion-criteria.md` — criteria complete
- [ ] `docs/02-phase-1/investor-proof-pack-internal.md` — proof pack current
- [ ] `docs/02-phase-1/demo-completion-plan.md` — plan executed
- [ ] This checklist signed off

## Demo

- [ ] All four routes render correctly in production build
- [ ] Financial model reflects suite-tier structure, $1.5M seed, $32.2M Y3 ARR, Month 12 break-even
- [ ] Pitch deck slides complete and consistent with financial model
- [ ] Decision Support brand color `#9B6CD9` applied throughout
- [ ] Q1 2026 milestone confirmed; Q2 2026 status accurately shown as pending

## Business Model

- [ ] No open contradictions in `docs/business-contradictions.md`
- [ ] Suite-tier pricing consistent across pitch deck and financial model
- [ ] Y3 ARR headline ($32.2M) and valuation ($257M) confirmed by suite calc

## Internal Boundaries

- [ ] No internal workflow details exposed in any public-facing route or text
- [ ] `public/docs/` contains only content safe for investor viewing
- [ ] Internal docs under `docs/` are not accessible via any app route

## Pre-Presentation (Presenter Checklist)

The browser cannot suppress OS notifications or hide extension icons in
normal windowed mode. These items are the presenter's responsibility
before an investor demo begins.

- [ ] OS Do Not Disturb / Focus mode enabled
      macOS: Control Centre → Focus → Do Not Disturb
      Windows: Settings → System → Focus → Do not disturb
- [ ] Slack, email client, and calendar app quit (not just minimised)
- [ ] Use the dedicated "AEXS Demo" Chrome profile (no extensions, no
      bookmarks bar, notifications blocked site-wide). Create once:
      Chrome → Profile menu → Add → "AEXS Demo".
- [ ] Open `http://localhost:4173/pitch` (or `aexs.ai/pitch`)
- [ ] On the entry gate, click **Enter Fullscreen Presentation**
- [ ] Confirm: toolbar, extensions, and tab bar are hidden
- [ ] Walk through all 12 slides once before the investor joins
- [ ] Esc exits fullscreen (browser-enforced); press P to re-enter

---

## Final Sign-off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Founder | | | |
| Technical Lead | | | |
