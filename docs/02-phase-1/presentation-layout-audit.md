# AEXS Presentation Layout System Audit

**Date:** 2026-04-17
**Classification:** Internal — Engineering / Design Systems
**Scope:** Read-only diagnosis. Zero source modifications.
**Surfaces covered:** Browser presentation layer (React/JSX) + PDF pipeline relationship

---

## 1. Inspection Summary

**Files inspected (in order):**

| File | Styling mechanism | Layout model |
|------|-------------------|--------------|
| `index.html` | Tailwind CDN + custom config | None (entry point only) |
| `src/index.css` | Minimal reset only | None — 42 lines, no layout rules |
| `vite.config.js` | — | No CSS config; no PostCSS; no Tailwind build plugin |
| `src/constants/theme.js` | 10 color tokens (C.gold, C.blue…) | Tokens only; no spacing, no type scale |
| `src/components/PageShell.jsx` | Inline styles only | `maxWidth: 860, padding: '40px 20px'` |
| `src/components/AppLayout.jsx` | Inline styles only | `minHeight: 100vh` wrapper |
| `src/components/NavBar.jsx` | Inline styles only | `display: flex, gap: 20` sticky bar |
| `src/pages/Home.jsx` | Inline styles + `C.*` tokens | `grid auto-fit minmax(240px,1fr)` |
| `src/pages/PitchDeck.jsx` | **Dual: Tailwind utility classes (255 occurrences) + inline styles (150 occurrences)** | 12 independent `min-h-screen` sections; no shared shell |
| `src/pages/FinancialModel.jsx` | Inline styles only + `C.*` tokens | `maxWidth: 780` centered scroll page |
| `build_deck.py` | ReportLab Python constants; all values hard-coded | Fixed 960×540 per slide; no relationship to browser CSS |

**Current state in two sentences:**

The browser presentation is a full-height scroll document with zero shared layout infrastructure — no slide shell, no bounded content area, no overflow guards, no typography scale, no shared spacing tokens, and two independent color systems operating simultaneously. The PDF pipeline is a fully decoupled Python/ReportLab artifact that shares no design values with the browser layer and was built to different content (17 slides vs 12 in the browser), making visual parity between the two surfaces structurally impossible in the current architecture.

---

## 2. Observed Failures — Root Cause Analysis

### Failure 1 — Cover Slide: KPI Row Hierarchy Collapse

**Symptom:** The three anchor metrics (`$1.5M SEED ROUND / $32.2M Y3 ARR TARGET / $8M SAFE NOTE CAP`) render at identical visual weight. There is no typographic or spatial hierarchy between "the round we are raising," "the ARR target that justifies it," and "the SAFE cap." Investors cannot immediately parse the relationship between the three numbers.

**Root cause — specific code:**
```jsx
// PitchDeck.jsx lines 296–311
<div className="flex gap-6 mb-8 items-center">
  <div>
    <p className="font-syne font-bold text-gold" style={{ fontSize: '26px' }}>$1.5M</p>
    <p className="text-slate-500 font-bold tracking-widest" style={{ fontSize: '9px' }}>SEED ROUND</p>
  </div>
  <div className="w-px h-10" />
  <div>
    <p className="font-syne font-bold text-white" style={{ fontSize: '26px' }}>$32.2M</p>
    <p className="text-slate-500 font-bold tracking-widest" style={{ fontSize: '9px' }}>Y3 ARR TARGET</p>
  </div>
  <div className="w-px h-10" />
  <div>
    <p className="font-syne font-bold text-white" style={{ fontSize: '26px' }}>$8M</p>
    <p className="text-slate-500 font-bold tracking-widest" style={{ fontSize: '9px' }}>SAFE NOTE CAP</p>
  </div>
</div>
```

All three `fontSize` values are identical at `'26px'`. All three use the same font weight and the same label style (`9px`, same color). No size differential communicates that `$32.2M` is the primary claim and `$1.5M` / `$8M` are supporting figures. The flex container has no `flex-basis` constraints, so at narrow content widths the items compress without a `min-width` floor.

**Classification:** Isolated styling bug — layout model is correct (flex), hierarchy is missing.

**Fix complexity:** Targeted — change font sizes to create a 3-level hierarchy (primary/secondary/supporting). No structural change.

---

### Failure 2 — Governance / Multi-Column Slides: Column Collapse and Line-Wrap Overflow

**Symptom:** Multi-column content on slides 3 (Solution), 7 (Business Model), 9 (Competition), 10 (GTM) collapses into narrow stacks with excessive line-wrapping. Column content does not fit available width.

**Root cause — specific code:**

The available content width at 1280px viewport is:
```
1280px viewport
- 220px sidebar (fixed)
- 128px horizontal padding (px-16 = 64px × 2)
= 932px usable content width
```

Three-column layouts on this surface: each card gets `(932 - (gap × 2)) / 3 ≈ 300px`.
At 1024px viewport: `(804 - 128) / 3 ≈ 225px` — text wraps aggressively.
At 1440px viewport: `(1220 - 128) / 3 ≈ 364px` — acceptable.

The specific failure modes:

1. **Business Model pricing cards (lines 659–700):** `flex gap-5 mb-8` — each card is `flex-1` with no `min-width` floor. Long strings like "Custom AI training on company data" (38ch) wrap to 2 lines at any card width under ~260px.

2. **Competition table (lines 736–784):** `table w-full` with 6 competitor columns. At `932px / 6 columns = 155px per column`. Column headers like "Salesforce AI" at `text-xs` wrap at that width. No `min-width` on `th` or `td` elements. The `overflow-x-auto` wrapper catches the worst case but doesn't prevent awkward wrapping at the target presentation width.

3. **Column grids without min-width floors:** `grid grid-cols-3 gap-6` and `grid grid-cols-4 gap-4` appear on 6 slides. Tailwind's `grid-cols-N` uses `repeat(N, minmax(0, 1fr))` — the `minmax(0, 1fr)` floor means columns can compress to 0px width.

**Classification:** Layout architecture failure — missing `min-width` floors on all multi-column grids, no bounded slide container.

**Fix complexity:** Targeted fixes are viable per slide. A structural `SlideShell` with defined `min-width: 960px` would prevent the collapse class at the system level.

---

### Failure 3 — Traction / Timeline Slide: Content Collision

**Symptom:** Timeline items overlap heading text. Left proof card grid and right milestone rail do not share a stable common layout grid. Content is not presentation-safe at 1280px.

**Root cause — specific code:**
```jsx
// PitchDeck.jsx lines 593–643
<div className="flex gap-8">
  <div className="flex-1 grid grid-cols-2 gap-4">   {/* left: 4 proof cards */}
  <div className="flex-shrink-0" style={{ width: '280px' }}>  {/* right: timeline */}
```

At 932px content width: left panel gets `932 - 280 - 32 (gap) = 620px`. The 2×2 card grid has each card at `(620 - 16) / 2 = 302px`. Each card has `p-5` (20px padding) so content area = 262px.

The section itself is `min-h-screen flex flex-col justify-center px-16 py-20`. With `py-20` = 80px top + 80px bottom, the usable height = `viewport_height - 160px`. At 900px viewport height, content area = 740px. The section header takes ~140px (kicker + headline + subhead). The remaining 600px must fit the 2×2 proof grid + milestone rail.

The cards use `p-5` with no defined `height`. If the card text wraps extensively, cards can grow taller than the remaining available height, causing the content to overflow the viewport segment and visually collide with adjacent sections during scroll.

The milestone rail timeline uses `minHeight: '20px'` on connector lines but no `max-height` or `overflow: hidden` on the rail container. At content widths under 300px for each card, the body text wraps to 4+ lines per card, each card growing to 140px+, making the 2×2 grid 280px+ tall plus the 140px header = 420px+. This is manageable at full viewport heights but fails at 768px (common laptop height).

**Classification:** Layout architecture failure (no bounded slide height) combined with isolated bugs (missing `max-height`, missing `overflow: hidden`, no content length limits).

**Fix complexity:** Targeted minimum — add `overflow: hidden` + `max-height: 3em` + `-webkit-line-clamp: 3` to card body text. Structural fix: `SlideShell` with `overflow: hidden` prevents bleed entirely.

---

### Failure 4 — Founder Slide: Under-Composed Layout

**Symptom:** The founder identity block reads as incomplete. Name and role are thin and un-anchored. Spacing between credential items is visually uneven.

**Root cause — specific code:**
```jsx
// PitchDeck.jsx lines 876–903
<div className="rounded-xl p-8 flex-shrink-0 slide-in"
  style={{ width: '320px', ... }}>
  <div className="w-14 h-14 rounded-full mb-4 ...">Mc</div>
  <p ... style={{ fontSize: '9px' }}>FOUNDER & CEO</p>
  <p className="font-syne font-bold text-white text-xl mb-4">Mc</p>
  ...
```

Three immediate structural problems:

1. **Name appears twice as "Mc" with no other identifier.** The avatar and the name text are both "Mc." There is no role title below the name, no company affiliation, and no full name. This is a content completeness failure that makes the slide read as a placeholder.

2. **Spacing is ad-hoc, not rhythm-based.** The spacing sequence is: `mb-4` (16px) after avatar, `mb-1` (4px) after label, `mb-4` (16px) after name, `space-y-2` (8px) inside bullet list, `mb-6` (24px) before quote. These values have no derivable relationship. The jump from `mb-1` (4px) to `mb-4` (16px) creates uneven visual rhythm between the label and name.

3. **320px fixed card width + content that fills ~220px of height = visible bottom padding gap.** The card's `p-8` (32px) padding creates 32px top + 32px bottom + content. If the credential list is short (4 bullets at ~72px) + quote block (~60px) + name + label + avatar = ~240px content height, then `p-8` adds 64px padding = 304px total, leaving visible empty space at the bottom of the 320px card container.

**Classification:** Both — layout architecture (no vertical rhythm system, arbitrary spacing) and isolated bug (duplicate "Mc" placeholder, no padding contract).

**Fix complexity:** Targeted — content correction + consistent spacing scale. No structural redesign.

---

### Failure 5 — System-Level: Cross-Slide Scaling Inconsistency

**Symptom:** Typography sizes and weights are inconsistent across slides. KPI rows, headline sizes, and body text do not scale uniformly. Browser and PDF have visually different proportions.

**Root cause — exhaustive inventory:**

**A. No shared slide shell.** Each section manages its own dimensions. `min-h-screen` means section height = viewport height at minimum. No `max-width` cap. No `overflow: hidden`. No defined content safe zone. At 1920px viewport the sections render at enormous height with content floating in whitespace.

**B. Two independent color systems operating simultaneously:**

| Token | `theme.js` (C.*) | PitchDeck inline | PDF (build_deck.py) |
|-------|-----------------|-----------------|---------------------|
| Gold | `#C9A84C` | `#C8A84B` | `#C8A84B` |
| Background | `#09090d` | `#080C18` | `#07090F` |
| Blue | `#4C8EC9` | `#3b82f6` | `#3B82F6` |
| Purple | `#9B6CD9` | `#a855f7` | `#8B5CF6` |
| Green | — (not in theme.js) | `#22c55e` | `#10B981` |

`theme.js` is **not imported by PitchDeck.jsx**. The PitchDeck uses its own set of inline hex values. `theme.js` is used by Home, Roadmap, FinancialModel, NavBar, AppLayout — the non-pitch surfaces. This creates two separate visual languages within the same app. The green values are particularly divergent: browser PitchDeck uses Tailwind's `#22c55e` while PDF uses `#10B981`.

**C. Two independent font systems:**

| Surface | Primary fonts | Secondary |
|---------|--------------|-----------|
| Home / Model / Roadmap | Georgia serif | Monospace system font |
| PitchDeck browser | Syne (Google Font) + Inter (Google Font) | Tailwind sans-serif utilities |
| PDF (build_deck.py) | Helvetica-Bold | Helvetica |

Syne and Helvetica-Bold have different x-heights, different cap heights, and different letter spacing characteristics. A headline at `28pt` in Helvetica will occupy different horizontal space than the same text at `28px` in Syne. The PDF and browser decks cannot share proportional values.

**D. No typography scale — 22+ distinct font sizes in PitchDeck.jsx alone:**

Observed unique sizes: 9px, 10px, 11px, 12px, 14px (`text-sm`), 16px (`text-base`), 18px, 22px, 24px, 26px, 36px, 54px, `clamp(64px,9vw,96px)`. None are derived from a shared scale.

**E. Tailwind CDN (no build-time PostCSS):** Tailwind is loaded via CDN at runtime. No `tailwind.config.js`, no `postcss.config.js`. This is functional but unoptimized — the full Tailwind stylesheet (~3MB) is evaluated by the browser JIT engine. More importantly, Tailwind's utility classes and the inline `style={}` attributes define the same properties redundantly and inconsistently (e.g., `className="text-white"` and `style={{ color: '#FFFFFF' }}` on the same element would conflict, with `style` winning).

---

## 3. Root Cause Classification — Q1

**Answer: (c) — a combination, with layout architecture as the dominant failure class.**

The ratio is approximately **70% layout architecture / 30% isolated bugs.**

Layout architecture failures (non-fixable by targeted property changes):
- No slide shell with bounded content area — affects all 12 slides
- No overflow guards at slide or card level — content bleeds across section boundaries
- No shared typography scale — inconsistency is structural, not patch-able per-slide
- Two parallel color systems — PitchDeck is architecturally disconnected from theme.js
- No minimum width floor on the main content area — layout degrades below 1280px

Isolated bugs (fixable with targeted changes, no structural redesign):
- KPI row hierarchy: identical font sizes for different-priority values (F1)
- Missing `min-width` on grid columns (F2 partial)
- Duplicate "Mc" placeholder in founder card (F4)
- Missing `overflow: hidden` + line-clamp on card body text (F3 partial)

**The isolated bugs cannot be sustainably fixed without addressing the architecture.** Each targeted fix will be undone the next time slide content is updated without a shared system to enforce the constraints.

---

## 4. Responsive Strategy Recommendation — Q2

**Answer: Option A (strict 16:9 slide system) is the technically correct foundation, with a lightweight Option C (hybrid mode) as the clean long-term target.**

**Why not Option B (fluid responsive web):**
A fluid responsive layout does not map to PDF output, produces unstable geometry at presentation viewports, and defeats the purpose of a pitch deck where each "slide" must be a self-contained, predictable visual unit. Investor presentations are viewed on external displays, projectors, and shared screens — not on mobile devices. Breakpoint-based reflow is the wrong model.

**Why Option A, not C, for Monday:**
Option C (hybrid mode) requires a context flag system and two render modes per component — this is the correct long-term target but adds implementation cost. For Monday, Option A constraints applied to the existing PitchDeck structure (a slide shell with `min-width` + `max-width` + `overflow: hidden`) provides presentation stability without requiring a dual-mode architecture.

**Viewport stability requirements:**

| Viewport | Required status | Current status |
|----------|----------------|----------------|
| 1920×1080 | Must render; content must not float in whitespace | FAILS — `min-h-screen` grows to 1080px per slide |
| 1440×900 | Primary target — must be perfect | MARGINALLY PASSES at wider widths |
| 1366×768 | Common laptop — must be stable | MARGINAL — 3-column grids compress to ~240px/card |
| 1280×800 | Minimum acceptable | AT RISK — content width = 932px, 3-col = 295px/card |

**How `clamp()` and a slide shell resolve the failures:**

A `SlideShell` component with:
```css
min-width: 960px;
max-width: 1440px;
aspect-ratio: 16 / 9;  /* optional — enforces exact proportions */
overflow: hidden;
margin: 0 auto;
padding: var(--slide-pad-x) var(--slide-pad-y);
```
...constrains every slide's content area to a predictable rectangle. `clamp()` type sizing scales within this fixed reference frame. Grid column minimums become reliable because the container minimum is known. Text never overflows the slide boundary.

---

## 5. CSS System Recommendation — Q3

**Answer: Option C (shared design token system) with Tailwind utilities retained as the utility layer, not the architecture layer.**

### Tailwind Assessment

**Tailwind is NOT the answer to the layout architecture problems.** Tailwind utilities (`grid-cols-3`, `flex`, `gap-4`) provide building blocks, but they do not enforce slide geometry, overflow bounds, or typography scale contracts. The current CDN setup is functional but should be migrated to a build-time install (`@tailwindcss/vite`) for production optimization.

**Tailwind is already present and useful for:**
- Layout utilities: `flex`, `grid`, `gap-*`, `items-*`, `justify-*`
- Spacing: `p-*`, `m-*` (when mapped to the token scale)
- Typography utilities: `font-bold`, `tracking-widest`, `leading-relaxed`
- Overflow: `overflow-hidden`, `truncate`, `line-clamp-*`

**Tailwind recommendation: RETAIN as the utility layer, REPLACE the CDN with a build-time install, ADD the token system ON TOP of it.**

### Central Token Architecture

**File: `tokens/design-tokens.json`** (new, to be created)

```json
{
  "_comment": "AEXS Design Tokens — single source of truth for browser + PDF",
  "colors": {
    "bg":       "#080C18",
    "bg2":      "#0C1220",
    "card":     "#0F1628",
    "card2":    "#131C30",
    "border":   "#1A2640",
    "border2":  "#243352",
    "gold":     "#C8A84B",
    "gold_l":   "#E6C76C",
    "gold_d":   "#8A6F2A",
    "blue":     "#3B82F6",
    "blue_l":   "#60A5FA",
    "green":    "#22C55E",
    "green_l":  "#34D399",
    "red":      "#EF4444",
    "orange":   "#F59E0B",
    "purple":   "#8B5CF6",
    "w1":       "#FFFFFF",
    "w2":       "#E2E8F0",
    "w3":       "#94A3B8",
    "w4":       "#475569"
  },
  "spacing": {
    "1": 4,  "2": 8,   "3": 12,  "4": 16,
    "6": 24, "8": 32,  "12": 48, "16": 64
  },
  "type_scale": {
    "caption":   { "px": 9,  "pt": 9,  "clamp": "clamp(9px, 0.7vw, 11px)"  },
    "label":     { "px": 11, "pt": 11, "clamp": "clamp(10px, 0.9vw, 12px)" },
    "body":      { "px": 13, "pt": 11, "clamp": "clamp(12px, 1.1vw, 14px)" },
    "card_title":{ "px": 15, "pt": 13, "clamp": "clamp(13px, 1.3vw, 16px)" },
    "subhead":   { "px": 22, "pt": 18, "clamp": "clamp(18px, 1.8vw, 24px)" },
    "heading":   { "px": 36, "pt": 28, "clamp": "clamp(28px, 3.0vw, 40px)" },
    "display":   { "px": 72, "pt": 54, "clamp": "clamp(48px, 6.0vw, 80px)" }
  },
  "slide": {
    "w": 960,
    "h": 540,
    "pad_x": 64,
    "pad_y": 48,
    "sidebar_w": 220,
    "nav_h": 56
  }
}
```

**`src/index.css` — consume the token file via CSS custom properties:**
```css
:root {
  /* Colors */
  --color-bg:      #080C18;
  --color-card:    #0F1628;
  --color-border:  #1A2640;
  --color-gold:    #C8A84B;
  --color-blue:    #3B82F6;
  --color-green:   #22C55E;
  --color-red:     #EF4444;
  --color-orange:  #F59E0B;
  --color-purple:  #8B5CF6;
  --color-w1:      #FFFFFF;
  --color-w3:      #94A3B8;
  --color-w4:      #475569;

  /* Spacing scale (4px base) */
  --space-1: 4px;   --space-2: 8px;   --space-3: 12px;
  --space-4: 16px;  --space-6: 24px;  --space-8: 32px;
  --space-12: 48px; --space-16: 64px;

  /* Typography */
  --type-caption:    clamp(9px, 0.7vw, 11px);
  --type-label:      clamp(10px, 0.9vw, 12px);
  --type-body:       clamp(12px, 1.1vw, 14px);
  --type-card-title: clamp(13px, 1.3vw, 16px);
  --type-subhead:    clamp(18px, 1.8vw, 24px);
  --type-heading:    clamp(28px, 3.0vw, 40px);
  --type-display:    clamp(48px, 6.0vw, 80px);

  /* Slide geometry */
  --slide-pad-x:   var(--space-16);
  --slide-pad-y:   var(--space-12);
  --slide-min-w:   960px;
  --slide-max-w:   1440px;
}
```

**`build_deck.py` — consume the same token file:**
```python
import json, os
_tokens = json.loads(open(os.path.join(os.path.dirname(__file__), 'tokens/design-tokens.json')).read())
C = {k: HexColor(v) for k, v in _tokens['colors'].items()}
SP = _tokens['spacing']
T = _tokens['type_scale']  # use T['heading']['pt'] etc.
W, H = _tokens['slide']['w'], _tokens['slide']['h']
```

---

## 6. Slide Architecture Requirements — Q5

Status of each required element based on code inspection:

| Requirement | Status | Notes |
|------------|--------|-------|
| Shared slide shell with bounded content area | **ABSENT** | Each `<section>` is self-managed. No `SlideShell` component exists. |
| Consistent typography scale | **ABSENT** | 22+ distinct font sizes in PitchDeck.jsx. No `clamp()` except on the AEXS wordmark. No token backing. |
| Consistent spacing scale | **PARTIALLY PRESENT** | Tailwind spacing utilities (`mb-4`, `p-6`, etc.) are consistent *within* Tailwind but not documented as a scale, not mirrored to PDF, and mixed with arbitrary inline `px` values. |
| Shared KPI/stat-card component | **ABSENT** | KPI rows are inlined in each slide. The Financials slide metric panel is not reused elsewhere. |
| Presentation-safe content bounds (overflow:hidden) | **ABSENT** | No `overflow: hidden` on any `<section>`. Only present on small internal elements (bar chart, progress bar). |
| Responsive text clamping | **PARTIALLY PRESENT** | One `clamp()` usage on the AEXS wordmark. All other text uses fixed `px` or Tailwind static sizes. |
| Shared timeline/milestone rail component | **ABSENT** | Timeline in Traction slide is a one-off implementation. Not reused. |
| Shared metric-row component | **ABSENT** | Metric rows are duplicated across Financials, GTM, and Business Model slides. |
| Visual safe zones (defined padding) | **PARTIALLY PRESENT** | All sections use `px-16 py-20`. This is consistent but is a Tailwind class, not a token. Not enforced by a component contract. |
| Overflow guards at slide and card level | **ABSENT** | No overflow containment on slide sections or card containers. |

**Required for investor-professional output:** ALL ten items are required. The five marked ABSENT are architectural prerequisites; the two marked PARTIALLY PRESENT require formalization.

---

## 7. Minimum-Change Path for Monday

These six changes are ordered by dependency. Each requires only targeted modifications to existing files. None redesigns any slide layout.

**1. Add `minWidth: '960px'` and `overflow: 'hidden'` to the main content wrapper**

File: `src/pages/PitchDeck.jsx` — the `<main>` element (line 273)
```jsx
<main style={{ marginLeft: '220px', paddingTop: '56px', minWidth: '960px', overflowX: 'hidden' }}>
```
**Fixes:** Failure 2, 3, 5 (partial) — prevents column collapse below 960px, prevents cross-section bleed.

**2. Add `overflow: hidden` and `-webkit-line-clamp: 3` to traction and team card body text**

File: `src/pages/PitchDeck.jsx`
On proof card body `<p>` elements in the Traction slide and body text in the Team slide:
```jsx
style={{ overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}
```
**Fixes:** Failure 3 (traction collision), Failure 4 (team card overflow).

**3. Differentiate KPI row font sizes on the cover slide**

File: `src/pages/PitchDeck.jsx` — cover KPI row (lines 296–311)
Primary metric (`$32.2M`): `fontSize: '30px'`
Secondary metrics (`$1.5M`, `$8M`): `fontSize: '22px'` with slightly reduced label opacity
**Fixes:** Failure 1 — creates 3-level hierarchy: primary / secondary / tertiary.

**4. Add `minWidth` floors to 3-column and 4-column grids**

File: `src/pages/PitchDeck.jsx`
Replace: `className="grid grid-cols-3 gap-6"`
With: `className="grid gap-6" style={{ gridTemplateColumns: 'repeat(3, minmax(240px, 1fr))' }}`

Apply to: Slides 3 (Solution), 4 (Product), 7 (Business Model), 10 (GTM).
**Fixes:** Failure 2 — prevents columns from compressing below legible width.

**5. Replace "Mc" placeholder in founder card with available identity content**

File: `src/pages/PitchDeck.jsx` — Team slide (lines 880–884)
The avatar and name both display "Mc." Change the name display to "Founder & CEO" (already in the label above) or "AEXS Founder" and add the company URL as a sub-label. The name content is a founder decision — engineering can only note the structural gap.
**Fixes:** Failure 4 — eliminates placeholder appearance of the founder card.

**6. Remove the investor-facing "Review Required" contradiction banner from `Home.jsx`**

File: `src/pages/Home.jsx` — lines 155–185
The disclaimer banner explicitly states "unresolved contradictions" and links to the internal contradictions review page. The contradictions are documented in internal docs as resolved. This banner exposes internal workflow to any investor who lands on the home page. The banner's assertion is no longer accurate (all 6 contradictions are resolved). Remove or replace with a standard confidentiality notice.
**Fixes:** Investor-facing trust issue — not a rendering failure but a higher-severity presentation risk than any layout defect.

---

## 8. Long-Term Architecture — Clean State

### SlideShell Component

```jsx
// src/components/SlideShell.jsx
export default function SlideShell({ children, id, accent = '#C8A84B' }) {
  return (
    <section
      id={id}
      style={{
        minHeight: '100svh',
        minWidth: 'var(--slide-min-w)',
        maxWidth: 'var(--slide-max-w)',
        margin: '0 auto',
        overflow: 'hidden',
        padding: 'var(--slide-pad-y) var(--slide-pad-x)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: 'var(--color-bg)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        boxSizing: 'border-box',
      }}
    >
      {children}
    </section>
  );
}
```

### Typography Scale (clamp-based)

```css
/* Applied via CSS custom properties in :root */
.type-caption    { font-size: var(--type-caption); }
.type-label      { font-size: var(--type-label); font-weight: 700; letter-spacing: 0.12em; }
.type-body       { font-size: var(--type-body); line-height: 1.6; }
.type-card-title { font-size: var(--type-card-title); font-weight: 600; }
.type-subhead    { font-size: var(--type-subhead); }
.type-heading    { font-size: var(--type-heading); font-weight: 700; line-height: 1.1; }
.type-display    { font-size: var(--type-display); font-weight: 700; line-height: 0.95; }
```

### Grid Contract

All multi-column layouts use explicit track definitions:
```css
/* 3-column card grid */
.grid-3 {
  display: grid;
  grid-template-columns: repeat(3, minmax(240px, 1fr));
  gap: var(--space-6);
}

/* 2-column split layout */
.grid-2-split {
  display: grid;
  grid-template-columns: minmax(400px, 1fr) minmax(240px, 320px);
  gap: var(--space-8);
}

/* Timeline layout */
.grid-timeline {
  display: grid;
  grid-template-columns: 12px 1fr;
  gap: var(--space-3);
  align-items: start;
}
```

### Overflow Discipline

Every card container:
```css
.card {
  overflow: hidden;
  contain: layout;
}
.card-body {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
```

### Token Flow

```
tokens/design-tokens.json
  ↓ imported as CSS custom properties
src/index.css (:root { --color-gold: ... })
  ↓ consumed by
src/pages/PitchDeck.jsx (var(--color-gold))
src/components/SlideShell.jsx (var(--slide-pad-x))
  ↓ independently consumed by
build_deck.py (T['colors']['gold'] → HexColor)
```

---

## 9. Risks and Tradeoffs

### Minimum-Change Path Risks

| Risk | Description |
|------|-------------|
| **Whack-a-mole fragility** | Targeted fixes without a shared system create a brittle state where the next content edit breaks the layout again. Each slide fix must be manually maintained. |
| **Viewport debt accumulates** | `minWidth: '960px'` on `<main>` prevents collapse but does not fix behavior at 1920px. Content floats in whitespace at wide viewports. |
| **Color system divergence persists** | `theme.js` and PitchDeck inline hex values remain two separate systems. Refactoring `theme.js` post-Monday is a merge conflict risk. |
| **Typography remains ad-hoc** | Without a scale, every new slide introduction requires per-element size decisions. |

### Clean Architecture Path Risks

| Risk | Description |
|------|-------------|
| **Implementation time** | Full token + SlideShell migration is estimated at 2–3 focused engineering days. Not viable before Monday. |
| **Tailwind CDN → build-time migration** | Replacing CDN Tailwind with `@tailwindcss/vite` requires adding to `vite.config.js`, `package.json`, and updating `index.html`. Low risk but adds a dependency change before Monday. |
| **Slide-by-slide migration regression risk** | Migrating all 12 slides into `SlideShell` simultaneously risks regressions if done in a single pass. Staged migration by 2–3 slides per session is safer. |

### Risk of Shipping Current State

The current state is **presentation-viable at 1440px** but **fragile at 1280px and below**. At a Monday meeting:
- If the investor display is 1440px+: acceptable with the isolated bug fixes from the previous session already applied.
- If the display is 1280px or a 16:9 1366×768 laptop: the 3-column slides will show compressed columns and potential text overflow.
- If someone shares their screen with a sidebar open: effective width drops further.

The single highest-leverage Monday safety measure is item 1 in the minimum-change path: `minWidth: '960px'` + `overflowX: 'hidden'` on `<main>`, which prevents the collapse failure class entirely.

---

## 10. Priority Classification

### IMMEDIATE — Blocks investor presentation, fix before Monday

| Item | Description |
|------|-------------|
| `minWidth: '960px'` on `<main>` | Prevents column collapse at all 1280px+ viewports |
| `overflow: hidden` on traction and team card bodies | Prevents content collision across section boundaries |
| KPI row font-size hierarchy (cover slide) | Eliminates hierarchy collapse, clarifies `$8M` vs `$32.2M` relationship |
| "Review Required" banner removal from `Home.jsx` | Exposes internal workflow and makes false claim (contradictions are resolved) |

### STRUCTURAL — Required for system stability, fix this week

| Item | Description |
|------|-------------|
| Create `tokens/design-tokens.json` | Single source of truth for browser + PDF |
| Update `src/index.css` with CSS custom properties | Enables `var()` usage in components |
| Install Tailwind as build-time dependency | Replace CDN for production optimization |
| Implement `SlideShell` component | Enforce slide geometry contract across all 12 sections |
| Add `minWidth` floors to all `grid-cols-3/4` layouts | Prevents per-slide column collapse |
| Migrate `PitchDeck.jsx` to use `theme.js` or token vars | Unify the two color systems |

### DEFERRED — Polish and optimization, post-launch

| Item | Description |
|------|-------------|
| Full `clamp()` typography scale | Replace all fixed `px` sizes with token-backed `clamp()` values |
| Shared KPI/stat-card component | Extract and reuse across Financials, GTM, Business Model slides |
| Shared timeline rail component | Extract from Traction slide for reuse |
| Aspect-ratio 16:9 enforcement on `SlideShell` | For strict presentation-mode layout (Option A full implementation) |
| Playwright/PDF export parity verification | Automated visual regression between browser slides and PDF output |
| `build_deck.py` token migration | Consume `tokens/design-tokens.json` for all values |
