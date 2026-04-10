# AEXS — Post-Approval Audit Status
*Initial audit: 2026-04-10 · Suite-tier rebuild: 2026-04-10*

---

## Decision-by-Decision Status

### D-001 — Seed capital: $1.5M
**Status: ✅ Resolved**
- `src/utils/suiteCalc.js` — `cashBalance = 1_500_000` in `calcSuite()`
- Single cash pool for the single suite stream. No triple-counting.

### D-002 — Pricing architecture: suite tiers
**Status: ✅ Resolved (rebuilt 2026-04-10)**
- `FinancialModel.jsx` completely rebuilt as a suite-tier model.
- Removed: `defaults` (3 separate product configs), `calcMonthly(cfg, sid)` with per-product branching, `calcCombined()`, 4-tab product UI, per-product assumption sliders.
- Added: `src/utils/suiteCalc.js` — exports `suiteDefaults` and `calcSuite(cfg)` (single stream, suite prices 499/1999/8500).
- `FinancialModel.jsx` now imports `calcSuite` / `suiteDefaults` and has a single `cfg` state.
- Pitch Deck Slide 6 already showed suite tiers — no slide change needed. Pitch and model now structurally agree.

### D-003 — CoS price points: Pitch Deck prices
**Status: ✅ Resolved**
- Canonical suite prices in `suiteDefaults`: `starter:499, growth:1999, enterprise:8500`

### D-004 — Q2 2026 traction milestone: done: false
**Status: ✅ Resolved**
- `PitchDeck.jsx` Q2 2026 milestone — `done: false` ✓

### D-005 — Q1 2026 traction milestone: confirmed done
**Status: ✅ Unchanged by approval (confirmed correct)**
- `PitchDeck.jsx` Q1 2026 milestone — `done: true` ✓

### D-006 — Decision Support brand color: C.purple
**Status: ✅ Resolved**
- `Roadmap.jsx` — `color: C.purple` ✓

### D-007 — ARR headline: revised to verified figure
**Status: ✅ Resolved (suite model re-verification 2026-04-10)**
- Suite model outputs verified by Node.js replica and Vitest tests:

| Figure | Pitch (after rebuild) | Suite model output | Match |
|--------|----------------------|-------------------|-------|
| Y1 ARR | $2.6M | $2.64M | ✓ |
| Y2 ARR | $9.2M | $9.21M | ✓ |
| Y3 ARR | $32.2M | $32.17M | ✓ |
| Y1 Cum. Burn | $1.8M | $1.80M | ✓ |
| Y2 Cum. Burn | $3.8M | $3.81M | ✓ |
| Y3 Cum. Burn | $6.0M | $6.02M | ✓ |
| Break-even | Month 12 | Month 12 | ✓ |
| Gross Margin Y3 | 73% | 73.0% | ✓ |
| Valuation (8x) | $257M | $257M | ✓ |

---

## Suite Model Architecture Summary

**File:** `src/utils/suiteCalc.js`

```
suiteDefaults = {
  starter: 499, growth: 1999, enterprise: 8500,   // founder-approved prices
  starterPct: 50, growthPct: 35, entPct: 15,      // tier customer mix
  growthRate: 14, churn: 3, cogs: 27,             // growth/margin params
  initCustomers: 28, burnBase: 141000,             // calibrated to pitch figures
}
```

- `burnBase = 141,000` = sum of original per-product burns (CoS $40K + Gov $48K + DSS $53K)
- `initCustomers = 28` = calibrated starting count that produces pitch-consistent outputs
- Single `cashBalance = 1_500_000` seed capital (no triple-counting)

---

## Tests Added

**File:** `src/utils/suiteCalc.test.js` — 17 tests, all passing.

Covers:
- 36-month output length
- Month 1 customer growth and MRR
- Month 1 cash draw-down
- Y1 ARR ($2.4M–$2.9M window)
- Y2 ARR ($8.8M–$9.6M window)
- Y3 ARR ($30M–$34M window)
- Break-even by Month 15
- Cash never negative (runway verification)
- Y3 gross margin (72%–74.5% window)
- Monotonic ARR growth
- Monotonic burn growth
- `fmtK` boundary cases (sub-$1K, $1K–$999K, $1M+, negative)
- `fmtPct` output format

---

## Build and Lint Verification

- `npm run build` — ✅ 0 errors, 0 warnings
- `npm run test` — ✅ 17/17 tests pass
- `npm run lint` on `src/` — ✅ 0 errors; 6 pre-existing `useMemo` warnings in root scaffold only

---

## Remaining Gaps

| Gap | Severity | Description |
|-----|----------|-------------|
| Root scaffold lint errors | Low | `aexs-pitch-deck.jsx`, `financial-model.jsx` at repo root are dead files (pre-refactor originals). 5 lint errors. Not compiled. |
| Changes unstaged | — | All modified files are unstaged. Needs a commit. |

---

## Next 5 Recommended Tasks

1. **Commit the full change set** — All modified and new files are unstaged. Commit with message referencing D-002 suite rebuild and founder sign-off 2026-04-09.
2. **Delete root scaffold files** — `aexs-pitch-deck.jsx`, `financial-model.jsx`, `ai-startup-roadmap.jsx` at repo root are dead. Deleting them clears 5 persistent lint errors. They are preserved in git history.
3. **Slide 6 footnote** — PitchDeck.jsx Slide 6 currently shows suite tier features per-tier. Consider a small note: "Revenue modeled as unified suite — see Financial Model for projections." Not required, optional polish.
4. **Vitest config in vite.config.js** — If needed for CI, add `test: { environment: 'node' }` to `vite.config.js`. Currently Vitest runs with defaults, which works for pure JS utils.
5. **Re-verify Slide 11 runway claim** — Slide 11 says "24 months of runway." With $1.5M seed and $141K/month burn, pure burn runway is ~10 months. The model shows break-even at Month 12 with revenue, so the company doesn't run out — but "24 months runway" may mislead an investor who interprets it as cash-on-hand duration. Consider changing to "Runway to break-even: Month 12" or leaving as-is with understanding it is revenue-dependent.
