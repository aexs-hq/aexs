# AEXS — Founder Decision Sheet
*Prepared: 2026-04-09*

This document lists every unresolved business decision blocking demo readiness.
For each item: choose Option A or Option B, then pass the decision to the engineering agent.
**No code changes are made until you sign off here.**

Full technical details for each item are in `docs/business-contradictions.md`.

---

## Decision Table

| ID | Topic | Option A | Option B | Code impact if A | Code impact if B | Impact if unresolved |
|----|-------|----------|----------|-----------------|-----------------|----------------------|
| **D-001** | Seed capital amount | **$1.5M** (seed round as stated in pitch) | **$150K** (bootstrap) | Change `cashBalance = 150000` → `1500000` in `FinancialModel.jsx:29` | Update all 3 pitch references to $150K; remove "Seed Round" language | Model shows cash-out in month 3–4, directly contradicting pitch's "24 months runway" |
| **D-002** | Pricing architecture | **Suite tiers** (one price for all modules — $499/$1,999/$8,500 as in pitch Slide 6) | **Per-product pricing** (separate prices per product as in Financial Model) | Rebuild Financial Model with suite-tier revenue logic | Update Pitch Deck Slide 6 to show per-product prices | Model and pitch project incompatible revenue structures; cross-referencing destroys credibility |
| **D-003** | AI Chief of Staff price points | **Pitch Deck prices** ($499/$1,999/$8,500) | **Model prices** ($299/$799/$3,500) | Update `defaults[0]` in `FinancialModel.jsx:21` | Update pricing table in `PitchDeck.jsx` lines 280–282 | Financial projections understate or overstate revenue depending on which is real |
| **D-004** | Q2 2026 traction milestone status | **Mark done: false** (milestone not yet reached) | **Confirm done: true** (MVP live, 20 beta users, $15K MRR verified) | Change `done: true` → `done: false` at `PitchDeck.jsx:238` | No code change; add confirmatory evidence to internal records | Showing unverified completed traction to investors is a material misrepresentation risk |
| **D-005** | Q1 2026 traction milestone status | **Confirm done: true** (10 interviews, regulatory mapping, tech stack — all verified) | **Mark done: false** (one or more items not completed) | No code change | Change `done: true` → `done: false` at `PitchDeck.jsx:237` | Unverified claims in investor-facing materials |
| **D-006** | Decision Support brand color | **Use C.purple (#9B6CD9)** — matches Pitch Deck and Financial Model | **Use #6B4CC9** — currently in Roadmap only | Change `Roadmap.jsx:277` to `color: C.purple` | Update `theme.js:11` and verify all 3 pages visually | Visual inconsistency across demo screens (low financial risk) |
| **D-007** | $44M Y3 ARR headline | **Validate after D-001/D-002/D-003** — verify model output equals $44M | **Revise headline** — if model output differs materially, update pitch | No change if model confirms $44M | Update `PitchDeck.jsx` lines 52, 329, 337 | Unverified headline in investor pitch |

---

## Implementation Notes

### D-001 is the first action — it unblocks the most
With $150K seed capital and current burn rates ($40K–$53K/mo), the model shows
cash balance reaching zero in approximately months 3–4. This is the most visible
and damaging number for any investor who opens the Financial Model.
Change the seed capital before sharing the demo externally, even informally.

### D-002 must be decided before D-003
The pricing architecture decision (suite vs per-product) determines *which* price
comparison in D-003 is even meaningful. Resolving D-002 first avoids double work.

### D-003 follows D-002
Once you know whether you're pricing a suite or per-product, align the one
file that has the wrong model.

### D-004 is a credibility gate before any external sharing
The Q2 2026 "MVP done" flag is the highest-risk item for investor credibility.
If the MVP is not provably live with 20 users and $15K MRR as of today (2026-04-09),
change `done: false` immediately. This takes 30 seconds and eliminates significant risk.

### D-005 is lower risk but should be confirmed
Q1 2026 ended March 31. If you completed the 3 listed items (10 interviews,
regulatory mapping, tech stack selection), keep `done: true`. If not, change it.

### D-007 depends on all pricing decisions
Do not adjust the $44M headline until D-001, D-002, and D-003 are resolved.
After that, run the Financial Model Combined Suite view and read the Y3 ARR KPI.

---

## Recommended Decision Order

**Work through these in sequence. Each unlocks the next.**

```
1. D-004  ← Fastest fix. Eliminate credibility risk before any external sharing.
2. D-005  ← Verify or correct Q1 traction while you're in the traction slide.
3. D-001  ← Fix seed capital. Eliminates the most damaging model contradiction.
4. D-002  ← Choose pricing architecture (suite or per-product).
5. D-003  ← Align prices in the file that is wrong, based on D-002 decision.
6. D-007  ← Validate $44M ARR in the model after D-001 through D-003 are done.
7. D-006  ← Fix brand color. Low risk, cosmetic — do last.
```

---

## Sign-off Column

Add your initials and date when each decision is made.

| ID | Decision chosen | Initials | Date |
|----|----------------|----------|------|
| D-001 | Option A — $1.5M seed capital | — | 2026-04-09 |
| D-002 | Option A — Suite tiers (RESOLVED 2026-04-10: Financial Model rebuilt as single suite stream) | — | 2026-04-09 |
| D-003 | Option A — Pitch Deck prices (updated FinancialModel.jsx) | — | 2026-04-09 |
| D-004 | Option A — `done: false` (Q2 2026 MVP not yet verified) | — | 2026-04-09 |
| D-005 | Option A — `done: true` confirmed (Q1 2026 Concept & Research complete) | — | 2026-04-09 |
| D-006 | Option A — `C.purple` (#9B6CD9) used in Roadmap.jsx | — | 2026-04-09 |
| D-007 | Option B — Revised to verified model output ($32.4M ARR, Month 13, $259M val.) | — | 2026-04-09 |
