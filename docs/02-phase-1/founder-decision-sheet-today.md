# Founder Decision Sheet — 2026-04-13

Internal reference. Not for distribution.

## Purpose
Lock the highest-priority decisions for Phase 1 closeout so AEXS can move forward without drift.

## Date
2026-04-13

## Decision Owner
Founder / Human Approval Gate

---

## Decision 1 — Public / Private Boundary

### Approved
- `aexs` = internal product and source-of-truth repository
- `aexs-showcase` = sanitized investor/public narrative repository
- `aexs.ai` = public entry point only

### Rule
No internal workflow, internal structure, internal scripts, internal prompts, internal contradiction logs, or internal decision records may be exposed publicly unless explicitly rewritten into public-safe language.

### Status
- [x] Approved
- [ ] Needs Revision

---

## Decision 2 — Official Phase 1 Proof Statement

### Approved Statement
**AEXS Phase 1 demonstrates that governed AI-assisted product delivery can produce a stable, maintainable, functional, reliable, investor-ready product baseline.**

### Public-Safe Version
**AEXS is a working executive product baseline built through a disciplined, review-driven process designed for stability, maintainability, and controlled growth.**

### Supporting Figures (Investor Use — Verified)
The following figures are approved for use in investor conversations. Source: `docs/02-phase-1/investor-proof-pack-internal.md` and `docs/post-approval-audit-status.md`.

| Figure | Value |
|--------|-------|
| Seed capital | $1.5M |
| Pricing tiers | $499 / $1,999 / $8,500 per month |
| Break-even | Month 12 |
| Y3 ARR | $32.2M |
| Implied valuation | $257M (8× ARR) |
| Q1 2026 traction | Confirmed complete |
| Q2 2026 traction | In progress — not yet confirmed |

### Status
- [x] Approved
- [ ] Needs Revision

---

## Decision 3 — Public Contact Path

### Approved
- Public-facing email: `contact@aexs.ai`
- Founder/direct email: `mc@aexs.ai`

### Temporary Routing
Both may forward to the current private inbox until dedicated mail handling is finalized.

### Status
- [x] Approved
- [ ] Needs Revision

---

## Decision 4 — Investor Journey

### Approved Path
**aexs.ai → landing page → pitch overview → contact**

### Notes
- The public landing page should remain clean and limited.
- Investor-only material is not public-live by default.
- The first goal is to drive a clear, controlled conversation path.

### Status
- [x] Approved
- [ ] Needs Revision

---

## Decision 5 — Next Visible Milestone

### Approved
**Q2 2026 — MVP Build; then private investor/demo review cycle**

### Meaning
The next visible milestone after Phase 1 is not broad public expansion. It is completion of the Q2 2026 MVP milestone, followed by a controlled review cycle with selected investors, partners, or trusted external reviewers.

### Q2 2026 Items (shown as in-progress in the pitch deck)

| Item | Target | Current |
|------|--------|---------|
| AI Chief of Staff MVP live | Q2 2026 | Not yet verified |
| 20 beta users onboarded | Q2 2026 | Not yet verified |
| First $15K MRR | Q2 2026 | Not yet verified |

Founder must confirm all three before marking Q2 2026 `done: true` in `PitchDeck.jsx`.  
Cross-reference: `docs/02-phase-1/phase-1-closeout-memo.md` — §2 What Remains Open.

### Status
- [x] Approved
- [ ] Needs Revision

---

## Content Classification for Today

### Public-Live Now
- landing page copy
- homepage sections
- contact CTA
- high-level product positioning
- high-level trust/proof language

### Investor-Only
- investor one-pager
- demo walkthrough script
- investor FAQ
- selected proof statements

### Internal-Only
- contradiction logs
- founder decisions
- Phase 1 control docs
- release readiness docs
- internal workflow/governance details
- implementation details

### Status
- [x] Approved
- [ ] Needs Revision

---

## Deferred for Later
These are intentionally not part of today’s decision lock:

- `/proof` page
- contact form
- deeper showcase expansion
- additional route work
- further repo automation
- broader visual polish unless broken

---

## Immediate Actions After Approval
1. Replace the showcase CTA placeholder with the approved public email.
2. Complete the live walkthrough and sign-off in `aexs`.
3. Keep investor-only content out of the public surface.
4. Move into packaging, not more internal feature-building.

---

## Final Founder Confirmation

### Decision Summary
Today’s decisions lock:
- repo boundary
- Phase 1 proof statement
- public contact path
- investor journey
- next visible milestone
- content exposure classification

### Approval
- [x] Approved for execution
- [ ] Approved with revisions
- [ ] Hold

### Founder Name
____________________________

### Signature / Initials
____________________________

### Date
____________________________

### Notes
- 
- 
- 
