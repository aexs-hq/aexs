# AEXS PDF Export and Render Pipeline Strategy

**Date:** 2026-04-17
**Classification:** Internal — Engineering / Design Systems
**Scope:** Strategy and planning only. No source modifications in this document.
**Companion document:** `docs/02-phase-1/presentation-layout-audit.md`

---

## 1. Current Pipeline Analysis

### Two independent render targets

The AEXS presentation system currently operates two fully decoupled output surfaces with no shared infrastructure:

| Property | Browser (React) | PDF (Python/ReportLab) |
|----------|-----------------|------------------------|
| Entry point | `src/pages/PitchDeck.jsx` | `build_deck.py` |
| Canvas model | DOM / Flexbox / CSS Grid | ReportLab Canvas, bottom-left origin |
| Dimensions | `min-h-screen` per section (no fixed aspect ratio) | Fixed 960×540 points |
| Color definitions | Inline hex literals (12 values) | Python `HexColor()` constants (15 values) |
| Typography | Google Fonts CDN (Syne + Inter) | ReportLab built-in only (Helvetica-Bold, Helvetica) |
| Slide count | 12 sections | 17 slides |
| Shared token source | None | None |

### Color system divergence

Neither surface imports from `src/constants/theme.js`. The same logical color exists under three different hex values:

| Logical name | `theme.js` (`C.*`) | PitchDeck.jsx (inline) | `build_deck.py` (`GOLD`) |
|---|---|---|---|
| Brand gold | `#C9A84C` | `#C8A84B` | `#C8A84B` |
| Background dark | `#09090d` | `#080C18` | `#07090F` |
| Card surface | `#0e0e13` | (not named) | `#0F1628` |

The PDF and PitchDeck.jsx share `#C8A84B` for gold — they agree with each other but not with `theme.js`. `theme.js` is authoritative for the non-pitch surfaces (Home, Model, Roadmap). This is two separate color systems, not one.

### Slide count mismatch

The browser deck has 12 slides. The PDF has 17 slides. The additional 5 PDF slides include detailed product diagrams and appendix material appropriate for a leave-behind document but not for a live scrollable demo. These surfaces serve different purposes and a 1:1 content mapping is not architecturally required — but the core investor narrative (Cover → Problem → Solution → Market → Traction → Business Model → Financials → Competition → GTM → Team → Ask) must be visually consistent across both.

### Alignment system state

`build_deck.py` contains three layout helper functions that implement a shared optical-center formula. These are the only current form of systematic layout logic in either surface:

```python
def footer_bar(c, left_label, left_body, right_label, right_body, bar_y, bar_h, accent)
def two_line_bar(c, top_label, top_body, bot_label, bot_body, bar_y, bar_h, accent)
def stat_strip(c, stats, bar_y, bar_h, accent)
```

All three use the same optical center baseline formula:

```python
bar_mid    = bar_y + bar_h / 2
label_base = bar_mid - label_size * 0.33
body_base  = bar_mid - body_size  * 0.33
```

This formula positions text at the optical center of its container box — accounting for the fact that ReportLab's `drawString` positions the baseline, not the visual center. The `0.33` coefficient approximates the ratio of cap-height to font size for Helvetica. These helpers must not be replaced with raw `card_box + drawString` calls.

---

## 2. Export Path Recommendation

### Q4 Answer: Path D (Split Pipeline) with Path A token bridge

**Recommended path: D + A supplement.**

| Path | Description | Verdict |
|------|-------------|---------|
| A | Single source: generate PDF from same data that drives browser | Foundation only — not standalone |
| B | Playwright/headless HTML-to-PDF from browser routes | Correct long-term; not justified before Monday |
| C | Abandon Python PDF; browser-only presentation | Discards verified 17-slide leave-behind; not viable |
| **D** | **Maintain both as separate render targets; connect via shared token file** | **Recommended** |

### Rationale

Path B (Playwright HTML-to-PDF) is architecturally elegant — it would make `deck.pdf` a snapshot of the exact browser presentation. However, it introduces three dependencies that are not justified before Monday:

1. Playwright infrastructure (headless Chromium, CI integration)
2. Print CSS layer (`@media print`) for the browser deck — currently absent
3. Pixel-accurate scroll-to-single-page layout — PitchDeck currently uses `min-h-screen` per section with no fixed slide boundaries

Path D preserves the working Python PDF while adding a shared token bridge (see Section 3). It requires no structural changes to either surface, is reversible, and can be executed in a single focused session.

Path A (shared data source) is not a standalone path — it describes where the shared values *come from* (the token file), not how they get rendered. It is the data layer of Path D.

### When to revisit Path B

Path B becomes viable when:
- PitchDeck.jsx uses a fixed 960px-wide `SlideShell` with bounded 16:9 sections (see audit Section 7)
- A `@media print` stylesheet has been added with explicit page breaks
- CI has a Playwright step

This is a post-Monday architectural task.

---

## 3. Central Token Strategy for PDF Alignment

### Design token file: `tokens/design-tokens.json`

A single JSON file serves as the canonical source for all values shared between the browser and PDF surfaces. Both consumers read from this file rather than maintaining their own hard-coded constants.

**Proposed structure:**

```json
{
  "version": "1.0.0",
  "colors": {
    "bg":         "#080C18",
    "bg-alt":     "#0C1220",
    "card":       "#0F1628",
    "card-alt":   "#131C30",
    "border":     "#1A2640",
    "border-alt": "#243352",
    "gold":       "#C8A84B",
    "gold-light": "#E6C76C",
    "gold-dark":  "#8A6F2A",
    "blue":       "#3B82F6",
    "blue-light": "#60A5FA",
    "green":      "#10B981",
    "red":        "#EF4444",
    "purple":     "#8B5CF6",
    "white-1":    "#FFFFFF",
    "white-2":    "#E2E8F0",
    "white-3":    "#94A3B8",
    "white-4":    "#475569",
    "white-5":    "#1E293B"
  },
  "canvas": {
    "width":  960,
    "height": 540,
    "chrome-top-height":    3,
    "chrome-bottom-height": 28,
    "left-bar-width":       4
  },
  "type": {
    "size-display":    36,
    "size-headline":   24,
    "size-subhead":    18,
    "size-body":       11,
    "size-label":       9,
    "size-caption":     8
  },
  "spacing": {
    "slide-margin-x": 60,
    "slide-margin-y": 50,
    "card-padding":   16,
    "card-radius":     6,
    "col-gap":        16,
    "row-gap":        14
  }
}
```

### Consumption model

**Python (`build_deck.py`):**

```python
import json, os
from reportlab.lib.colors import HexColor

_TOKEN_PATH = os.path.join(os.path.dirname(__file__), "tokens", "design-tokens.json")
with open(_TOKEN_PATH) as f:
    _T = json.load(f)

def _c(name):
    return HexColor(_T["colors"][name])

# Replace current constants:
BG   = _c("bg")
GOLD = _c("gold")
BLUE = _c("blue")
W    = _T["canvas"]["width"]
H    = _T["canvas"]["height"]
```

**Browser (CSS custom properties in `src/index.css`):**

```css
/* Generated or manually kept in sync with tokens/design-tokens.json */
:root {
  --color-bg:         #080C18;
  --color-card:       #0F1628;
  --color-gold:       #C8A84B;
  --color-blue:       #3B82F6;
  --color-green:      #10B981;
  --color-purple:     #8B5CF6;

  --canvas-width:     960px;
  --canvas-height:    540px;

  --size-display:     36px;
  --size-headline:    24px;
  --size-body:        11px;
  --size-label:       9px;

  --spacing-margin-x: 60px;
  --spacing-margin-y: 50px;
  --card-radius:      6px;
}
```

**Tailwind (in `index.html` config block):**

```js
tailwind.config = {
  theme: { extend: {
    colors: {
      gold:  '#C8A84B',   // sourced from tokens/design-tokens.json colors.gold
      deck:  '#080C18',   // sourced from tokens/design-tokens.json colors.bg
    },
    fontFamily: {
      syne:  ['Syne',  'sans-serif'],
      inter: ['Inter', 'sans-serif'],
    }
  }}
}
```

### Token governance rule

When a color, dimension, or spacing value changes, the change happens in `tokens/design-tokens.json` first. The Python constants and CSS custom properties are updated to match. The Tailwind config block is updated last (it cannot be auto-generated from the token file in CDN mode).

---

## 4. Footer Bar / Alignment System for PDF

### Purpose

The three alignment helpers in `build_deck.py` exist to ensure text is vertically centered within horizontal bar containers — a requirement that ReportLab does not handle natively. Every slide that uses a colored band to hold label/value pairs must route through one of these helpers.

### `footer_bar()` — two-column bottom anchor

Used for: any slide footer with a left-side label/value pair and a right-side label/value pair.

```python
def footer_bar(c, left_label, left_body, right_label, right_body,
               bar_y, bar_h, accent,
               label_size=8, body_size=13):
    """
    Draws a full-width horizontal bar at (0, bar_y) of height bar_h.
    Left side: left_label (small caps) above left_body (large).
    Right side: right_label (small caps) above right_body (large).
    Both columns use optical center formula for vertical alignment.
    """
    bar_mid    = bar_y + bar_h / 2
    label_base = bar_mid - label_size * 0.33
    body_base  = bar_mid - body_size  * 0.33
    # ... implementation
```

**Critical:** `label_base` and `body_base` are calculated relative to the *same* `bar_mid`. The label sits above the body within that vertical zone; the formula produces the correct offset automatically without manual y-adjustment.

### `two_line_bar()` — stacked two-row bar

Used for: a bar that contains two vertically stacked label/value rows (top half = row 1, bottom half = row 2).

```python
def two_line_bar(c, top_label, top_body, bot_label, bot_body,
                 bar_y, bar_h, accent,
                 label_size=7, body_size=11):
    """
    Splits bar_h into two equal rows. Top row contains (top_label, top_body).
    Bottom row contains (bot_label, bot_body). Each row uses optical center
    formula independently.
    """
    row_h     = bar_h / 2
    top_mid   = bar_y + bar_h - row_h / 2          # upper row midpoint
    bot_mid   = bar_y + row_h / 2                  # lower row midpoint
    # Each row calculates its own label_base and body_base from its own mid
```

### `stat_strip()` — N-column equal-width strip

Used for: the KPI row on the Cover slide and any stat/metric summary bar with 3–5 equal columns.

```python
def stat_strip(c, stats, bar_y, bar_h, accent,
               label_size=7, body_size=14):
    """
    stats: list of (label, value) tuples. N columns, equal width.
    Each column centered horizontally within its slot.
    Each column uses optical center formula for vertical alignment.
    Vertical dividers drawn between columns.
    """
    col_w  = W / len(stats)
    bar_mid = bar_y + bar_h / 2
    label_base = bar_mid - label_size * 0.33
    body_base  = bar_mid - body_size  * 0.33
    for i, (label, value) in enumerate(stats):
        cx = i * col_w + col_w / 2
        # drawCentredString(cx, ...) for both label and value
```

### Optical center formula — reference

The formula used in all three helpers:

```
bar_mid    = bar_y + bar_h / 2
label_base = bar_mid - label_size * 0.33
body_base  = bar_mid - body_size  * 0.33
```

**What it does:** ReportLab's `drawString` and `drawCentredString` position the text baseline. The visual center of a character is approximately `font_size * 0.33` above the baseline (cap-height ÷ total font size ≈ 0.33 for Helvetica). Subtracting this from the geometric center of the bar produces text that reads as vertically centered.

**Do not bypass:** Any slide that uses `card_box + c.drawString(x, bar_y + bar_h/2, text)` directly will place the text baseline at the bar midpoint, which reads as visually low. Always use one of the three helpers above.

---

## 5. Browser-to-PDF Visual Parity Checklist

The following checklist defines the minimum conditions under which the browser deck and PDF deck are considered visually consistent for a Monday investor presentation. It is not a pixel-perfect requirement — the surfaces use different rendering engines and font stacks. It is a content and color consistency requirement.

### Section A — Content parity (must match exactly)

| Item | Browser source | PDF source | Status |
|------|---------------|------------|--------|
| Seed round | `$1.5M` | `$1.5M` | ✅ |
| Y3 ARR | `$32.2M` | `$32.2M` | ✅ (fixed this session) |
| Break-even | `Month 12` | `Month 12` | ✅ |
| Implied valuation | `$257M` | `$257M` | ✅ |
| Suite pricing tier 1 | `$499/mo` | `$499/mo` | ✅ Verified |
| Suite pricing tier 2 | `$1,999/mo` | `$1,999/mo` | ✅ Verified |
| Suite pricing tier 3 | `$8,500/mo` | `$8,500/mo` | ✅ Verified |
| SAFE cap | `$8M` | `$8M` | ✅ Verified |
| ARR at Mo 6 | `$0.8M` | `$0.8M` | ✅ |
| ARR at Y1 | `$2.6M` | `$2.6M` | ✅ |
| ARR at Y2 | `$9.2M` | `$9.2M` | ✅ |
| Q1 2026 status | "Foundation" (done: true) | "Q1 2026 — CONFIRMED" | ✅ Verified |

### Section B — Color parity (brand gold)

| Surface | Gold hex used | Status |
|---------|--------------|--------|
| PitchDeck.jsx | `#C8A84B` | Baseline |
| build_deck.py `GOLD` | `#C8A84B` | ✅ Matches |
| theme.js `C.gold` | Deleted | ✅ Resolved — theme.js removed, all surfaces use `var(--color-gold)` (#C8A84B) |

The one-digit divergence in `theme.js` (#C9A84C) has been resolved. `theme.js` was deleted as part of the Phase 4C migration. All non-pitch surfaces now consume `var(--color-gold)` from `src/index.css`, which derives from `tokens/design-tokens.json`.

### Section C — Structural consistency

| Item | Required | Current state |
|------|----------|--------------|
| Bottom chrome bar with "AEXS / CONFIDENTIAL" text | PDF only | ✅ Present in PDF |
| Slide counter | PDF only | ✅ Present in PDF |
| Request Full Deck / Download CTA | Browser only | ✅ Wired to `public/deck.pdf` |
| Financials chart direction (left→right = time) | Both | ✅ Both correct |
| "Pre-Rev → Mo 6 → Y1 → Y2 → Y3" labels | Both | ✅ Both use this sequence |

### Section D — Font stack parity (acknowledged divergence)

| Surface | Headline font | Body font |
|---------|--------------|-----------|
| Browser | Syne (Google Fonts) | Inter (Google Fonts) |
| PDF | Helvetica-Bold | Helvetica |

This divergence is **structural and accepted**. ReportLab does not support web font loading without a separate font registration step (using `reportlab.pdfbase.ttfonts.TTFont` and `registerFont()`). Font parity is a Phase 2 improvement, not a Monday requirement.

---

## 6. Recommended Implementation Sequence

The following sequence moves from zero shared infrastructure to a fully token-connected dual-surface system. **All 7 steps are complete as of 2026-04-18.**

### Step 1 — Create `tokens/design-tokens.json` ✅

Created `tokens/design-tokens.json` with colors, canvas, type, spacing, and alignment sections. Single source of truth for both surfaces.

### Step 2 — Update `build_deck.py` to read tokens ✅

All `HexColor()` constants, `_SZ_*` typography constants, and `OPTICAL_CENTER_COEFF` now read from `tokens/design-tokens.json`. Founder copy reads from `content/founder-bio.json`.

### Step 3 — Run `npm run check` ✅

Quality gate passes: ESLint clean, 20/20 Vitest, Vite build, docs-sync, verify-theme-sync.

### Step 4 — Add CSS custom properties to `src/index.css` ✅

`:root {}` block with 30+ CSS custom properties derived from `tokens/design-tokens.json`. Includes color, typography (clamp-scaled), spacing, and slide geometry vars. `theme.js` fully deprecated and deleted.

### Step 5 — Migrate PitchDeck.jsx inline hex values to CSS vars ✅

All inline hex literals replaced with `var(--color-*)` references. Hex-alpha patterns converted to `color-mix()`. Dynamic accent patterns use `ca()` helper. All 8 former `theme.js` consumers also migrated.

### Step 6 — Migrate Tailwind CDN to build-time install ✅

Installed `@tailwindcss/vite` (Tailwind v4). CDN `<script>` removed from `index.html`. `@theme inline` block in `src/index.css` provides custom color and font utilities. Tree-shaking enabled; offline-capable.

### Step 7 — Add SlideShell component and print CSS ✅

Created `src/components/SlideShell.jsx`. All 12 PitchDeck sections wrapped. `@media print` CSS in `src/index.css` enforces 960×540px with `page-break-after: always`. Path B (Playwright HTML-to-PDF) is now unblocked.

---

## 7. Risk Register

| ID | Risk | Likelihood | Impact | Mitigation |
|----|------|------------|--------|------------|
| R-01 | `tokens/design-tokens.json` path not found in `build_deck.py` | Low | High — PDF build fails | Use `os.path.join(os.path.dirname(__file__), ...)` for path resolution; add try/except with clear error message |
| R-02 | Token file gold value differs from Tailwind CDN config gold value | Medium | Low — visual-only, not investor-visible | Token governance rule: update Tailwind config block in `index.html` whenever token file changes |
| R-03 | ReportLab PDF produces black-on-black or missing text after token migration | Low | High — deck unusable | Run `python3 build_deck.py` and open output after any token change; color diff check before commit |
| R-04 | CDN Tailwind fails to load in offline demo environment | Medium | High — entire PitchDeck unstyled | Pre-load page in Chrome before going offline; long-term: migrate to build-time Tailwind (Step 6) |
| R-05 | `npm run check` fails after Step 2 due to docs-sync detecting `build_deck.py` change | Low | Low — easily fixed | `npm run sync-docs` before committing; the pre-commit hook will catch this automatically |
| R-06 | `stat_strip` / `footer_bar` / `two_line_bar` bypassed in new slides | Medium | Medium — misaligned text in PDF | Code review gate: no `c.drawString` calls inside bar containers without an alignment helper |
| R-07 | Font parity gap creates investor perception mismatch between browser deck and PDF | Low | Low — fonts differ but brand colors and content match | Acknowledge openly if asked; frame as a known tradeoff, not an error |
| R-08 | Playwright HTML-to-PDF attempted before SlideShell (Step 7) is in place | Medium | High — output is a scroll document, not slide-per-page | Enforce Step 7 as hard prerequisite before enabling Path B in CI |

---

## Summary

**Q4 Answer:** Path D (split pipeline) with Path A token bridge is the correct approach for the current state of the repository. Maintain both surfaces as separate render targets. Connect them via `tokens/design-tokens.json`. Do not attempt Path B (Playwright) until `SlideShell` and `@media print` CSS are in place.

**Before Monday:** Steps 1–3 only. Create token file, migrate `build_deck.py` constants, confirm `npm run check` passes.

**Post-Monday:** Steps 4–7 in sequence. Each step is independently testable and reversible.
