# Contributing to AEXS

This repository is the internal source-of-truth for AEXS. Read `CLAUDE.md` at the repo root before contributing; this file summarises the rules that apply to human and AI contributors alike.

## Scope

- Work only inside this repository. Do not modify paths outside it.
- Do not push. Pushes to `main` trigger production Vercel deploys and require founder authorization.
- Only create commits when explicitly requested.

## Public / internal boundary

- Source under `src/`, static assets under `public/`, and the pitch deck artifacts are public and shipped to visitors.
- Everything under `docs/` is internal. Do not mirror, link, or reference internal docs from public surfaces.
- `public/docs/` exists only for generated, publication-safe mirrors. Treat it as untrusted output: it must never contain internal-only material.
- ADRs under `docs/decisions/` are the authoritative registry. Follow `docs/decisions/README.md`.

## Single source of truth

- Business facts (pricing, ARR, funding, traction): `content/pitch-data.json`.
- Contradiction registry: `docs/business-contradictions.md`.
- ADR registry: `docs/decisions/`.
- Do not change pricing, ARR, funding, traction, or founder decisions without an explicit request.

## Repo invariants (do not break)

- `sync-docs`, `check-docs-sync`, `predev`, `prebuild`, `check`, `prepare`, and `.githooks/pre-commit` must stay coherent. Any change to one requires coordinated changes across all.
- ADRs with `Status: Accepted` are repo-wide invariants. Code changes that contradict an Accepted ADR are rejected.
- Public-facing materials must not expose internal workflow, internal structure, internal scripts, or internal decision logs.

## Verification

Before submitting a change, run what the change requires — typically:

```
npm run check          # lint + test + build + docs-sync + theme-sync + content-consistency + ADR deps
npm run build
npm run sync-docs
.githooks/pre-commit
```

## Change hygiene

- Minimum clean change. No speculative refactors, no incidental cleanup.
- Preserve working behavior unless the task explicitly changes it.
- Do not add comments explaining what the code does; name things well instead. Only comment where the *why* is non-obvious.
- Keep commits reviewable and logically grouped. Do not bundle unrelated work.

## Reporting

For non-trivial tasks, return a short markdown report covering:

1. State Found
2. Changes Made
3. Verification Performed
4. Remaining Gaps
5. Next Recommended Tasks

## Security and privacy

- Do not commit secrets. `.env`, `.env.local`, and `.env.*.local` are gitignored; keep them that way.
- Do not embed internal links, internal filenames, or internal decision context in public-facing copy, meta tags, or OG descriptions.
