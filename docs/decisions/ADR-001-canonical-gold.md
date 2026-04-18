# ADR-001: Canonical Brand Gold Value

**Date:** 2026-04-17
**Status:** Accepted
**Deciders:** Mc

## Context

Three independent color systems defined brand gold independently, each arriving
at a slightly different value:

| System | Value | Role |
|--------|-------|------|
| `theme.js` | `#C9A84C` | Non-pitch browser surfaces (8 consumer files) |
| `PitchDeck.jsx` | `#C8A84B` | Investor-facing browser deck |
| `build_deck.py` | `#C8A84B` | Investor-facing PDF deck |

The divergence between `theme.js` and the two investor-facing surfaces is one
LSB per channel (R: 201→200, B: 76→75). This is sub-perceptual (~0.4% luminance
difference) and not visible in any presentation context. However, it creates a
three-way inconsistency in the style system that would propagate into any
token-based architecture without explicit resolution.

## Decision

**Canonical brand gold is `#C8A84B`.**

**Rationale:** The two investor-facing surfaces (PitchDeck.jsx and build_deck.py)
independently agree on `#C8A84B`. These surfaces represent the primary brand
expression context — the deck investors interact with directly. The token file
takes its canonical values from investor-facing surfaces, not from the
compatibility layer. `theme.js` is a temporary compatibility layer that must
align to the token file, not the reverse.

## Consequences

- `tokens/design-tokens.json` → `colors.gold = "#C8A84B"`
- `theme.js` → `C.gold` changes from `#C9A84C` to `#C8A84B`
- 8 `theme.js` consumer files receive the corrected value via their existing
  `theme.js` import — no file-level changes required in those consumers
- `PitchDeck.jsx` already uses `#C8A84B` — no change required
- `build_deck.py` already uses `#C8A84B` — no change required
- Verify-theme-sync script detects any future drift between `theme.js` and the
  token file as a build failure

## Related divergences (Rule 2 documentation)

The following additional divergences were found between PitchDeck.jsx and
build_deck.py during Phase 1A inspection. These are documented here for
completeness. Unlike gold, they do not share the same token key name, so they
do not require a formal ADR to resolve for the initial token file:

| Concept | PitchDeck.jsx | build_deck.py | Resolution |
|---------|--------------|---------------|------------|
| Primary background | `#080C18` | `#07090F` | Token `bg = #080C18` (browser primary); `bg-pdf = #07090F` preserved separately |
| Green / traction | `#22c55e` | `#10B981` | Both preserved: `green = #22c55e`, `green-emerald = #10B981` |
| Orange | `#f97316` | `#F59E0B` | Both preserved: `orange = #f97316`, `orange-amber = #F59E0B` |
| Purple | `#a855f7` | `#8B5CF6` | Both preserved: `purple = #a855f7`, `purple-violet = #8B5CF6` |

## How to change this decision

1. Update `tokens/design-tokens.json` `colors.gold`
2. Run `npm run verify-theme-sync` — will detect `theme.js` drift immediately
3. Update `theme.js` `C.gold` to match the new token value
4. Rebuild PDF: `python3 build_deck.py`
5. Update this ADR status to `Superseded` and create ADR-002
