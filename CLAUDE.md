# AEXS — Internal Repo Rules

You are working in the main internal AEXS product repository.

## Scope
- Work only inside this repository.
- Do not push.
- Do not modify anything outside this repo.
- This repo is the internal product and source-of-truth repo for AEXS.

## Core rules
1. Inspect relevant files first.
2. Make only the minimum clean change.
3. Do not change business meaning, pricing, ARR, funding, traction claims, or founder decisions unless explicitly told.
4. Preserve working behavior unless the task explicitly changes it.
5. Keep changes reviewable and logically grouped.
6. Verify locally with only the commands needed.
7. Output a short Markdown report.

## Repo invariants
Keep these intact unless the task explicitly changes them:
- `docs/business-contradictions.md` is the contradiction source of truth
- `public/docs/` is generated output
- `sync-docs`, `check-docs-sync`, `predev`, `prebuild`, `check`, `prepare`, and `.githooks/pre-commit` must stay coherent
- public-facing materials must not expose internal workflow, internal structure, internal scripts, or internal decision logs

## Default verification
Use only what fits the task, for example:
- `npm run check`
- `npm run build`
- `npm run sync-docs`
- `npm run check-docs-sync`
- `.githooks/pre-commit`

## Reporting
Default report format:

# AEXS Task Report

## 1. State Found
## 2. Changes Made
## 3. Verification Performed
## 4. Remaining Gaps
## 5. Next Recommended Tasks

## Phase 1 rule
Do not claim Phase 1 is complete unless:
- the internal Phase 1 docs exist
- CI exists
- `npm run check` passes
- repo roles are clear
- internal/public boundaries are clear
