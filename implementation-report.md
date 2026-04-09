# AEXS — Implementation Report
*Date: 2026-04-09*

---

## 1. Starting State

```
/home/mcai/workspace/aexs/
├── aexs-pitch-deck.jsx     ← 634 lines, root-level, no package scaffold
├── ai-startup-roadmap.jsx  ← 697 lines, root-level
├── financial-model.jsx     ← 373 lines, root-level
├── package.json            ← Vite + React scaffolded, missing recharts + react-router-dom
├── vite.config.js
├── src/App.jsx             ← Vite default boilerplate
├── src/main.jsx
├── src/index.css           ← 1126px constrained #root (would clip full-width pages)
└── node_modules/
```

Missing: `recharts`, `react-router-dom`, `src/pages/`, `src/constants/`, `src/utils/`, routing, nav.

---

## 2. Confirmation: Repo Exists

```
pwd → /home/mcai/workspace/aexs
ls  → confirmed (see starting state above)
```

---

## 3. Work Performed

### 3.1 Dependencies installed

```
npm install recharts react-router-dom
```

Added 44 packages. 0 vulnerabilities.

---

### 3.2 Files created

| File | Purpose |
|------|---------|
| `src/constants/theme.js` | Shared AEXS color palette (C.gold, C.blue, C.purple, C.teal, C.dark, C.card, C.border, C.muted, C.text, C.dim) |
| `src/utils/format.js` | Shared formatters: `fmtK` (raw dollars), `fmtM` (millions input), `fmtPct` (percentage) |
| `src/pages/PitchDeck.jsx` | Copied from `aexs-pitch-deck.jsx` + imports C and fmtM from shared modules |
| `src/pages/FinancialModel.jsx` | Copied from `financial-model.jsx` + imports C, fmtK, fmtPct; STARTUPS colors now reference C.* |
| `src/pages/Roadmap.jsx` | Copied from `ai-startup-roadmap.jsx` + imports C; 2 of 3 startup colors reference C.* (see flags below) |

---

### 3.3 Files modified

| File | Change |
|------|--------|
| `src/App.jsx` | Replaced Vite boilerplate with router shell + sticky nav (AEXS brand + 3 NavLinks) |
| `src/main.jsx` | Wrapped `<App />` in `<BrowserRouter>` |
| `vite.config.js` | Added `server: { historyApiFallback: true }` for direct URL navigation |
| `src/index.css` | Reset `#root` from `width: 1126px / text-align: center / border-inline` to `width: 100%` — was clipping full-width dark pages |
| `src/App.css` | Cleared Vite boilerplate classes (`.counter`, `.hero`, etc.) no longer referenced |
| `package.json` | Updated by npm install (recharts + react-router-dom added to dependencies) |

---

### 3.4 Files NOT touched

| File | Reason |
|------|--------|
| `aexs-pitch-deck.jsx` (root) | Original preserved untouched |
| `ai-startup-roadmap.jsx` (root) | Original preserved untouched |
| `financial-model.jsx` (root) | Original preserved untouched |
| All business data/content | Zero business content modified |

---

## 4. Routes Wired

| URL | Component |
|-----|-----------|
| `/` | Redirects to `/pitch` |
| `/pitch` | `src/pages/PitchDeck.jsx` |
| `/roadmap` | `src/pages/Roadmap.jsx` |
| `/model` | `src/pages/FinancialModel.jsx` |

---

## 5. Shared Extractions

### `src/constants/theme.js`
Replaces `const C = { ... }` previously defined inline in `aexs-pitch-deck.jsx`.
Used by: `PitchDeck.jsx` (full C object), `FinancialModel.jsx` (STARTUPS colors), `Roadmap.jsx` (2 startup colors), `App.jsx` (nav styles).

### `src/utils/format.js`
Consolidates:
- `fmtK()` — was defined locally in `financial-model.jsx` lines 17–21
- `fmtM()` — was defined locally in `aexs-pitch-deck.jsx` line 32
- `fmtPct()` — was defined locally in `financial-model.jsx` line 22

**These two functions have different input conventions** (documented in the file):
- `fmtK` takes raw dollar values: `fmtK(44000000)` → `"$44.0M"`
- `fmtM` takes values already in millions: `fmtM(44)` → `"$44M"`, `fmtM(1200)` → `"$1.2B"`
Both are preserved as-is. No behavior was changed.

---

## 6. Business Number Flags (NOT resolved — requires founder decision)

### Flag 1: Pricing contradiction
**Location:** `src/pages/FinancialModel.jsx` lines 18–20 (flagged with ⚠️ comment)

| Tier | FinancialModel.jsx | PitchDeck.jsx (Slide 6) |
|------|--------------------|------------------------|
| AI Chief of Staff — Starter | $299/mo | $499/mo |
| AI Chief of Staff — Growth | $799/mo | $1,999/mo |
| AI Chief of Staff — Enterprise | $3,500/mo | $8,500/mo |
| Decision Support — Solo | $499/mo | (not separately listed) |
| Decision Support — Team | $2,200/mo | (not separately listed) |

**Impact:** All 36-month financial projections (MRR, ARR, break-even) are calculated from the FinancialModel.jsx prices. If the pitch deck prices are the real target, the Y3 ARR of $44M cited in the pitch may not be reproducible in the financial model at current assumptions.

**Action required:** Founder to decide which price table is authoritative.

### Flag 2: Seed capital contradiction
**Location:** `src/pages/FinancialModel.jsx:calcMonthly()` (line ~37 in copied file)

| Source | Seed Capital |
|--------|-------------|
| FinancialModel.jsx (`cashBalance = 150000`) | $150,000 |
| PitchDeck.jsx Slide 11 ("The Ask") | $1,500,000 |

**Impact:** The model projects runway and break-even from $150K, not $1.5M. Break-even timing, cash-out risk, and valuation story all change significantly with the correct figure.

**Action required:** Founder to confirm seed amount. If $1.5M: change `cashBalance = 150000` → `cashBalance = 1500000` in `calcMonthly()` and re-check break-even month against "Month 19" claim in pitch.

### Flag 3: Decision Support brand color inconsistency
**Location:** `src/pages/Roadmap.jsx` line ~13 (flagged with ⚠️ comment)

| Source | Decision Support color |
|--------|----------------------|
| `Roadmap.jsx` | `#6B4CC9` (darker purple) |
| `PitchDeck.jsx` + `FinancialModel.jsx` | `#9B6CD9` (C.purple — lighter purple) |

**Action required:** Decide which purple is correct. If `C.purple` (#9B6CD9): change `color: "#6B4CC9"` in `Roadmap.jsx` data to `color: C.purple`.

---

## 7. Verification

### Build verification
```
cd /home/mcai/workspace/aexs
npm run build
```

**Result:** ✅ Build succeeded
```
✓ 586 modules transformed.
dist/assets/index-DB-dFyLq.css   1.64 kB │ gzip: 0.74 kB
dist/assets/index-Buk31pU4.js  679.97 kB │ gzip: 201.87 kB
✓ built in 492ms
```

**Note on chunk size warning:** The 679 kB bundle is expected — recharts alone is ~400 kB unminified. The warning is cosmetic at this stage. Mitigate later with `React.lazy()` + `Suspense` to code-split the three page components.

### Structural verification
```bash
grep -rn "^const C = {" src/          # → no output (CLEAN)
grep -rn "^function fmtK" src/        # → no output (CLEAN)
grep -rn "^function fmtPct" src/      # → no output (CLEAN)
grep -rn "^const fmtM" src/           # → no output (CLEAN)
ls src/pages/                          # PitchDeck.jsx  Roadmap.jsx  FinancialModel.jsx
ls src/constants/                      # theme.js
ls src/utils/                          # format.js
```

### Dev server
```
npm run dev
```
Expected: `http://localhost:5173` — opens `/pitch` (PitchDeck), navigate to `/roadmap` and `/model`. Direct URL load of `/model` works via `historyApiFallback`.

---

## 8. Final File Tree (relevant changes only)

```
src/
├── App.jsx              ← REPLACED: router shell + sticky nav
├── App.css              ← CLEARED: boilerplate removed
├── main.jsx             ← UPDATED: BrowserRouter added
├── index.css            ← UPDATED: #root constraints removed
├── constants/
│   └── theme.js         ← NEW: shared color palette
├── utils/
│   └── format.js        ← NEW: fmtK, fmtM, fmtPct
└── pages/
    ├── PitchDeck.jsx    ← NEW: from aexs-pitch-deck.jsx + theme/format imports
    ├── Roadmap.jsx      ← NEW: from ai-startup-roadmap.jsx + C import
    └── FinancialModel.jsx ← NEW: from financial-model.jsx + C/format imports
```

---

## 9. What Was Not Done (and why)

| Item | Reason not done |
|------|----------------|
| Resolve pricing contradiction | Business decision — requires founder sign-off |
| Resolve seed capital contradiction | Business decision — requires founder sign-off |
| Resolve Decision Support color | Design decision — requires founder sign-off |
| Code-split lazy loading | Post-MVP optimization, not needed to run |
| Tests | Out of scope for this task |
| Remove root-level `.jsx` files | Those are the originals — leave them until founder confirms pages are correct |
| Git commit | Not requested |
| Push | Explicitly prohibited |
