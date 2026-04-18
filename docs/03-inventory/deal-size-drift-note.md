# $24K vs $25K vs $28K Drift — Resolution Log

> Internal. Not for distribution.

## Canonical value

**`$24K`** — `content/pitch-data.json` as of 2026-04-18
(`unit_economics.avg_deal_size`).

All JSX and Python rendering code for "avg deal size" / "avg contract
value" reads from this field.

## Resolution status (closed 2026-04-18)

| File | Line(s) | Former literal | Status |
|------|---------|----------------|--------|
| `src/pages/PitchDeck.jsx` | 71, 127, 910 | avg_deal_size (`$24K`) | ✅ Migrated to `pitchData.unit_economics.avg_deal_size`. |
| `build_deck.py` | 1207, 1376 | `$28K` stat-strip avg deal | ✅ **Closed.** Replaced with `_PITCH['unit_economics']['avg_deal_size']`. Deck now renders `$24K` on both stat strips. |

## $25K — separate concepts, not drift

These `$25K` literals are intentionally different business values and
stay hardcoded, documented in ADR-004's allowlist policy:

| File | Line | Use | Justification |
|------|------|-----|---------------|
| `src/pages/PitchDeck.jsx` | 1052 | SAFE minimum ticket | Investment minimum, not avg deal size. Different concept. |
| `src/pages/Roadmap.jsx` | 211 | Compliance certification fee | One-off badge-program fee, not recurring contract. |

Inline allowlist entry in `scripts/verify-content-consistency.js` covers
both. Neither is duplicate of `avg_deal_size`.

## External document sweep

Out of repository scope — founder-only task. Any investor materials
still quoting `$25K` or `$28K` as avg deal size must be updated or
retired before the next investor send. Items to check:

- Previously-sent investor PDFs (outside this repository)
- Pitch email drafts in the founder's mailbox
- External docs (Notion, Google Drive)
- Older `AEXS_MegaDeck_2026.pdf` exports shared before 2026-04-18

Regenerating both PDFs in this repo after reconciliation produces
clean artefacts. No in-repo drift remains.

## Change log

- **2026-04-18 morning** — First documentation of the drift. Canonical
  set to `$24K`; JSX migrated; Python left with two `$28K` instances
  plus one `$32.17M` precision variant awaiting founder decision.
- **2026-04-18 afternoon — closed.** Founder reconciliation pass
  migrated all remaining Python instances to `_PITCH['unit_economics']
  ['avg_deal_size']`. `$32.17M` precision variant discarded in favour
  of canonical `$32.2M` display value. No in-repo drift remains.
