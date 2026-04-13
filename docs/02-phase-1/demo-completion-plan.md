# Demo Completion Plan

Internal reference. Not for distribution.

---

## Objective

Confirm that the AEXS investor demo is end-to-end complete, stable, and ready to present without manual intervention.

---

## 1. Routes

| Route | Page | Verified |
|-------|------|----------|
| `/` | Home — investor landing | [ ] |
| `/pitch` | Pitch Deck — 12-slide deck | [ ] |
| `/roadmap` | Execution Roadmap | [ ] |
| `/model` | Financial Model — 36-month projection | [ ] |

Verification method: `npm run build && npm run preview`, then navigate each route manually.

---

## 2. Financial Model Checks

| Check | Expected | Verified |
|-------|----------|----------|
| Seed capital input | $1.5M | [ ] |
| Suite tier pricing visible | Yes | [ ] |
| Break-even month | Month 12 | [ ] |
| Y3 ARR headline | $32.2M | [ ] |
| Implied valuation | $257M | [ ] |
| Adjustable assumptions render correctly | Yes | [ ] |

---

## 3. Pitch Deck Checks

| Check | Verified |
|-------|----------|
| All 12 slides render without layout breaks | [ ] |
| Q1 2026 traction shown as confirmed | [ ] |
| Q2 2026 traction shown as pending | [ ] |
| CoS price points match FinancialModel | [ ] |
| Decision Support color `#9B6CD9` applied | [ ] |

---

## 4. Build and Quality Gate

| Step | Command | Pass |
|------|---------|------|
| Install dependencies | `npm ci` | [ ] |
| Full check | `npm run check` | [ ] |
| Preview production build | `npm run build && npm run preview` | [ ] |

---

## 5. Known Gaps

| Gap | Status |
|-----|--------|
| Q2 2026 traction not yet verified | Open — flagged in model |

---

## Completion Sign-off

Confirmed by: _________________________ Date: _____________
