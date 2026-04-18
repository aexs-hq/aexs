# ADR-004: Content Consistency Enforcement

**Date:** 2026-04-18
**Status:** Accepted
**Deciders:** Mc

## Context

Before this decision, business values (dollar amounts, percentages, time
periods, pricing tiers) were hardcoded in every rendering surface: three
JSX files (`PitchDeck.jsx`, `FinancialModel.jsx`, `Home.jsx`) and one
Python file (`build_deck.py`). A measurement run on 2026-04-18 found
three reconciled drifts (`gross_margin 85↔82%`, `nrr 130+%↔120%`,
`cac_payback 4 months↔12 months`) plus several additional unreconciled
drifts in `build_deck.py` (`$28K` vs `$24K` avg deal, `75%+` vs `82%`
gross margin, multiple NRR variants, `8.4×` vs `2.3x` vs `5:1` LTV/CAC).

Divergence between surfaces is silent and compounds. A single investor
call can surface two different numbers from two different artefacts.

## Rule

Every business value — dollar amounts, percentages, time periods,
pricing tiers — in rendering code reads from
`content/pitch-data.json`. Hardcoded business values in JSX or Python
outside the allowlist are a **CI failure** (non-zero exit).

Scope of "rendering code":

- `src/**` (jsx, tsx, js, ts) — browser surfaces.
- `build_deck.py` — Python PDF pipeline.

Out of scope: CSS, design tokens (`tokens/design-tokens.json`), docs
(`docs/**`), tests, the content file itself (`content/pitch-data.json`).

## Enforcement

- `scripts/verify-content-consistency.js` runs in `npm run check`.
- Preflight check `PF-13` runs the same script during
  `npm run preflight`.
- Any hardcoded literal matching a canonical value in
  `pitch-data.json`, or one of the business-value regex patterns
  (`\$[0-9]`, `[0-9]+%`, `Month [0-9]`, `[0-9]+ months?`,
  `ARR|MRR|NRR|CAC|LTV` context), must either:
  1. Be replaced with a reference to `pitchData.*` / `_PITCH[*]`, or
  2. Appear in the script's allowlist with an inline justification.

## Exceptions

Allowlist entries live in `scripts/verify-content-consistency.js` as
regex + justification pairs. Every entry requires a one-line comment
explaining why the literal is legitimate (e.g. "Y3 valuation multiple
is derived, not canonical", or "18mo payback is a tactical ops metric
separate from contractual cac_payback"). Exceptions require founder
review.

## Founder Reconciliation Process

When drift is detected between `content/pitch-data.json` and rendering
code, migration pauses. Three reconciliation options, per value:

1. **JSON is canonical** — deck values update to match JSON. Code
   changes; deck output changes visibly.
2. **Deck is canonical** — JSON updates to match the code. JSON
   `meta.reconciliation_note` records the decision.
3. **Value-by-value** — explicit per-value choice, documented.

No silent resolution. Every reconciliation recorded in
`meta.reconciliation_note` in `content/pitch-data.json`.

## Change Process

Whenever a business value needs to change:

1. Edit `content/pitch-data.json` (single file).
2. `npm run check` — confirms no drift introduced.
3. `npm run export-deck` — regenerates the browser-surface PDF.
4. `python3 build_deck.py` — regenerates the Python-built PDF.
5. Commit the content change and the regenerated artefacts together
   (content + `public/deck.pdf` + `AEXS_MegaDeck_2026.pdf`).

A future business-value change is a one-file edit.

## Consequences

- **Pro:** single source of truth. Every surface reads the same numbers.
- **Pro:** CI gate catches accidental copy-paste of a stale value.
- **Pro:** founder review forced when drift shows up.
- **Con:** allowlist governance is now part of founder workload.
  A lazy allowlist (everything justified as "legacy") would defeat the
  rule.
- **Con:** values that are legitimately scenario-specific (e.g. $25K
  min investment ticket vs $24K avg deal) require explicit allowlist
  entries — the rule cannot distinguish "same concept, different value"
  from "different concept, different value" automatically.

## References

- `content/pitch-data.json` — source of truth, `meta.reconciliation_note`
- `scripts/verify-content-consistency.js` — enforcement
- `docs/03-inventory/deal-size-drift-note.md` — outstanding `$28K` /
  `$25K` drift awaiting founder action
