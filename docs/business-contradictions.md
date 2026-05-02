# AEXS — Business Contradictions
*Original audit: 2026-04-09. Post-approval audit: 2026-04-10. Suite rebuild: 2026-04-10.*

This file documents factual contradictions found between the source files in this repository.

## Resolution Status (suite-tier rebuild 2026-04-10)

| ID | Status | Summary |
|----|--------|---------|
| BC-001 | ✅ Resolved | Suite prices 499/1999/8500 in `suiteDefaults` in `src/utils/suiteCalc.js` |
| BC-002 | ✅ Resolved | `FinancialModel.jsx` rebuilt as single suite-tier revenue stream; `calcSuite()` replaces per-product logic |
| BC-003 | ✅ Resolved | Single `cashBalance = 1_500_000` in `calcSuite()`; no triple-counting |
| BC-004 | ✅ Resolved | `C.purple` used throughout including Roadmap.jsx |
| BC-005 | ✅ Resolved | Q2 2026 `done: false`; Q1 2026 `done: true` confirmed |
| BC-006 | ✅ Resolved | ARR revised to $32.2M (verified from suite model); pitch updated at all locations |

---

## BC-001 — AI Chief of Staff pricing: Financial Model vs Pitch Deck

**Files involved:**
- `src/utils/suiteCalc.js` — `suiteDefaults`, lines 10–12 *(FinancialModel.jsx rebuilt 2026-04-10; defaults[0] replaced by suiteDefaults)*
- `src/pages/PitchDeck.jsx` — Slide 6 pricing array, lines 279–281

**Values found:**

| Tier | suiteCalc.js `suiteDefaults` (lines 10–12) | PitchDeck.jsx Slide 6 (lines 279–281) |
|------|--------------------------------------------|---------------------------------------|
| Starter | `starter: 299` → **$299/mo** | `price: "$499/mo"` → **$499/mo** |
| Growth | `growth: 799` → **$799/mo** | `price: "$1,999/mo"` → **$1,999/mo** |
| Enterprise | `enterprise: 3500` → **$3,500/mo** | `price: "$8,500/mo"` → **$8,500/mo** |

**Difference:** Model prices are 40–58% lower than Pitch Deck prices across all tiers.

**Why it matters:**
All 36-month projections (MRR, ARR, gross margin, break-even) in the Financial Model flow from
these numbers. If Pitch Deck prices are the real target, the current model materially
understates revenue. The $44M Y3 ARR claim (BC-006) cannot be verified until this is resolved.

**Required decision:** Which price table is authoritative — the model or the pitch deck?

**Resolved at:** `src/utils/suiteCalc.js` lines 10–12 (`suiteDefaults`, prices 499/1999/8500)
and `src/pages/PitchDeck.jsx` lines 279–281 (suite tiers unchanged).

---

## BC-002 — Pricing model architecture: Suite tiers vs per-product tiers

**Files involved:**
- `src/pages/PitchDeck.jsx` — Slide 6, lines 279–281
- `src/utils/suiteCalc.js` — `suiteDefaults`, lines 10–12 *(FinancialModel.jsx rebuilt 2026-04-10; defaults[0–2] replaced by suiteDefaults)*

**Values found:**

The Pitch Deck describes **one unified suite** with three tier prices:
```
Starter   $499/mo  — "Solo executive" — Chief of Staff core only
Growth    $1,999/mo — "Leadership team (up to 5)" — CoS + Governance
Enterprise $8,500/mo — "Full C-suite + board" — All 3 modules
```

The Financial Model projects **three separate per-product revenue streams**:
```
AI Chief of Staff:      starter $299, growth $799, enterprise $3,500
AI Governance aaS:      audit $5,000/mo, monitor $1,500/mo, enterprise $8,000/mo
Executive Decision Sup: solo $499, team $2,200, enterprise $7,500
```

**The fundamental mismatch:** These are two incompatible revenue models.
- The pitch deck implies customers pay one suite price for all three modules.
- The financial model prices each product separately, allowing independent purchase.
- The model cannot be used to validate pitch deck revenue projections without first
  deciding which pricing architecture is the actual product strategy.

**Why it matters:**
An investor who reads Slide 6 (suite tiers) and then runs the Financial Model (per-product
pricing) will find they are projecting entirely different products at entirely different prices.
This is not a numerical error — it is an unresolved product-strategy question.

**Required decision:**
1. Is AEXS sold as a unified suite (one price, all modules) or as separate products?
2. If unified suite: the Financial Model needs to be rebuilt around suite-tier pricing.
3. If per-product: the Pitch Deck Slide 6 needs to replace the suite tiers with per-product prices.

**Resolved at:** `src/utils/suiteCalc.js` (single suite stream replaces per-product architecture)
and `src/pages/PitchDeck.jsx` lines 279–281 (suite tiers unchanged).

---

## BC-003 — Seed capital: Financial Model vs Pitch Deck

**Files involved:**
- `src/utils/suiteCalc.js` — `calcSuite()`, line 45 *(FinancialModel.jsx rebuilt 2026-04-10; calcMonthly() replaced by calcSuite())*
- `src/pages/PitchDeck.jsx` — Slide 11, lines 325, 508, 515

**Values found:**

| Source | Location | Value |
|--------|----------|-------|
| Financial Model projection start | `suiteCalc.js:45` | `cashBalance = 1_500_000` ($1,500,000) *(resolved: was $150,000 in calcMonthly())* |
| Pitch Deck KPI card | `PitchDeck.jsx:325` | `{ label: "Seed Round", value: "$1.5M" }` |
| Pitch Deck headline | `PitchDeck.jsx:508` | `"Raising $1.5M Seed"` |
| Pitch Deck round table | `PitchDeck.jsx:515` | `["Amount", "$1.5M"]` |

**Difference:** 10× — the model projects from $150K while the pitch asks for and displays $1.5M in three places.

**Why it matters:**
- Runway and break-even are directly computed from starting cash balance.
- The Pitch Deck previously claimed "Month 19 break-even" and "24 months runway" (former `PitchDeck.jsx:327–328, 512`; now updated to "Month 12" and "Break-even at Month 12").
- With $150K starting capital and burn rates of $40,000–$53,000/mo (`defaults[0–2]` `burnBase`
  fields), cash hits zero in approximately months 3–4. This directly contradicts the pitch
  narrative of 24 months runway.
- A technically literate investor who opens the Financial Model alongside the pitch will
  see the cash balance go negative almost immediately — a critical credibility failure.

**Required decision:** Is the raise $150K (bootstrap strategy) or $1.5M (seed round)?
- If $1.5M: change `cashBalance = 150000` → `cashBalance = 1500000` in `calcMonthly()`
  at `FinancialModel.jsx:29`, then verify break-even falls at or before Month 19.
- If $150K: the pitch deck ask, all three reference locations, and the runway/break-even
  claims must be updated to reflect a bootstrap approach.

**Resolved at:** `src/utils/suiteCalc.js` line 45 — `cashBalance = 1_500_000`; break-even Month 12.

---

## BC-004 — Decision Support brand color inconsistency

**Files involved:**
- `src/pages/Roadmap.jsx` — startup data object, line 274 *(was line 277; value changed to C.purple in D-006 resolution)*
- `src/constants/theme.js` — `C.purple`, line 6 *(was line 11 before comment cleanup)*
- `src/pages/FinancialModel.jsx` — `STARTUPS[2].color` *(STARTUPS array removed in 2026-04-10 rebuild; FinancialModel now uses C.teal throughout)*
- `src/pages/PitchDeck.jsx` — uses `C.purple` throughout

**Values found (at time of original audit 2026-04-09):**

| Source | File | Location | Value |
|--------|------|----------|-------|
| Roadmap (Executive Decision Support) | `Roadmap.jsx` | line 274 | `C.purple` → `#9B6CD9` *(was `"#6B4CC9"` at old line 277; resolved D-006)* |
| Shared theme | `theme.js` | line 6 | `C.purple = "#9B6CD9"` (lighter violet) |
| FinancialModel (Decision Support) | `FinancialModel.jsx` | — | *(STARTUPS removed in rebuild; FinancialModel uses C.teal)* |
| PitchDeck | `PitchDeck.jsx` | Enterprise tier, Slide 7 charts | `C.purple` → `#9B6CD9` |

**Why it matters:**
In a live demo, "Decision Support" renders with a darker, bluer purple in the Roadmap
and a lighter violet everywhere else. A sharp-eyed investor or design reviewer will notice
the brand element looks different across three screens of the same product.

**Severity:** Low — visual only, no financial impact.

**Required decision:** Choose one purple.
- To use `C.purple` (#9B6CD9): change `color: "#6B4CC9"` at `Roadmap.jsx:274` to `color: C.purple`.
- To use `#6B4CC9`: update `theme.js:6` and verify it does not clash with the dark
  Pitch Deck slide backgrounds.

**Resolved at:** `src/pages/Roadmap.jsx` line 274 — `color: C.purple` applied (D-006).

---

## BC-005 — Traction slide: two milestones marked "done" but unverified

**Files involved:**
- `src/pages/PitchDeck.jsx` — Slide 5 milestones array, lines 236–237

**Values found (at time of original audit 2026-04-09):**

```js
// PitchDeck.jsx lines 236–237
{ done: true, q: "Q1 2026", title: "Concept & Research",
  items: ["10 executive interviews", "Regulatory mapping complete", "Tech stack chosen"] },
{ done: false, q: "Q2 2026", title: "MVP Build",  // done: false applied per D-004
  items: ["Chief of Staff MVP live", "20 beta users onboarded", "First $15K MRR"] },
```

Both are rendered with a visual "completed" state in the pitch deck's milestone tracker.

**Why each is a risk:**

**Line 236 — Q1 2026 ("Concept & Research", `done: true`):**
Q1 2026 ended March 31. This milestone is plausible if founder actually conducted
10 executive interviews, completed regulatory mapping, and chose a tech stack.
However it is unverified. If any item was not done, the `done: true` flag is inaccurate.

**Line 237 — Q2 2026 ("MVP Build", `done: false` — resolved D-004):**
Q2 2026 began April 1. As of 2026-04-09 (9 days into Q2), the milestone claims:
- Chief of Staff MVP is live
- 20 beta users have been onboarded
- First $15K MRR has been achieved

Building an MVP, onboarding 20 paying beta users, and generating $15K in revenue within
9 calendar days is not credible unless all of this was completed before Q2 started.
Marking it `done: true` now will mislead investors reviewing the pitch.

**Why it matters:**
Displaying unearned traction as completed in an investor deck is a significant
credibility and legal risk. If the milestone has not been reached, `done: true`
needs to change to `done: false` before showing the deck externally.

**Required decisions:**
1. Q1 2026 (line 236): Confirm each of the 3 listed items was completed. If yes, keep
   `done: true`. If any item is incomplete, change to `done: false`.
2. Q2 2026 (line 237): Confirm all 3 items (MVP live, 20 beta users, $15K MRR) are
   verifiably true. If not all achieved, change to `done: false`.

**Resolved at:** `src/pages/PitchDeck.jsx` lines 236–237 — Q1 `done: true` (D-005); Q2 `done: false` (D-004).

---

## BC-006 — $44M Y3 ARR target: stated in pitch, not yet verified in model

**Files involved:**
- `src/pages/PitchDeck.jsx` — cover KPI, Slide 7 KPI card, Slide 7 heading
- `src/pages/FinancialModel.jsx` — Y3 ARR calculated dynamically from defaults

**Values found:**

The Pitch Deck originally stated $44M Y3 ARR in three places (now updated to $32.2M per D-007):
```
PitchDeck.jsx:51  — cover KPI: ["$32.2M", "Y3 ARR Target"]          (was $44M)
PitchDeck.jsx:327 — Slide 7 KPI card: { label: "Y3 ARR", value: "$32.2M" }  (was $44M, line 329)
PitchDeck.jsx:335 — Slide 7 heading: "Path to $32.2M ARR in 36 months."     (was $44M, line 337)
```

The suite model (`calcSuite()` in `src/utils/suiteCalc.js`) calculates Y3 ARR dynamically. **This
value has been verified at $32.17M ≈ $32.2M under the approved suite-tier assumptions.**

**Why it matters:**
This is not a contradiction in isolation — it is a validation dependency on BC-001, BC-002,
and BC-003. Once pricing architecture and seed capital are resolved, the model must be
run and its Combined Suite Y3 ARR verified against $44M. If the model does not reach
$44M under the agreed assumptions, either the assumptions need adjustment or the
$44M headline needs revision.

**Required action (after BC-001, BC-002, BC-003 are resolved):**
1. Run the Financial Model → Combined Suite view.
2. Read the Y3 ARR KPI output.
3. If output equals $44M ± acceptable rounding: no change needed to pitch.
4. If output differs materially: adjust growth rate / churn / pricing assumptions
   or revise the $44M headline across the three pitch locations listed above.

**Resolved at:** `src/pages/PitchDeck.jsx` lines 51, 327, 335 — revised to $32.2M (D-007, suite model verified).

---

## Summary

| ID | Topic | Severity | Blocking | Decision Owner |
|----|-------|----------|----------|----------------|
| BC-001 | CoS pricing (model vs pitch) | High | Yes — blocks BC-006 | Founder |
| BC-002 | Suite vs per-product pricing architecture | Critical | Yes — architectural | Founder |
| BC-003 | Seed capital ($150K vs $1.5M, 10×) | Critical | Yes — blocks BC-006 | Founder |
| BC-004 | Decision Support brand color | Low | No | Founder / Design |
| BC-005 | Two traction milestones marked done but unverified | High | Yes — external credibility | Founder |
| BC-006 | $44M Y3 ARR not verified in model | High | Blocked by BC-001/002/003 | Founder (after above) |

**Recommended resolution order: BC-003 → BC-002 → BC-001 → BC-005 → BC-006 → BC-004**

**All contradictions resolved 2026-04-09/2026-04-10. See resolution status table above for full detail.**
