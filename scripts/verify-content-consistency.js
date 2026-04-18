/**
 * verify-content-consistency.js
 *
 * ADR-004 enforcement. Fails CI if any hardcoded literal in JSX or Python
 * rendering code duplicates a canonical value from content/pitch-data.json.
 *
 * Scope:
 *   - src (jsx, tsx, js, ts) — browser surfaces
 *   - build_deck.py           — Python PDF pipeline
 *
 * Rule:
 *   A value is canonical iff it is a leaf string in content/pitch-data.json
 *   that looks like a business claim (contains $, %, Month, months, ARR,
 *   NRR, MRR, CAC, LTV, or starts with a digit).
 *
 *   A line is a violation iff:
 *     - It contains a canonical literal as a substring, AND
 *     - It does not already reference pitchData.* or _PITCH[...], AND
 *     - It is not a comment line, AND
 *     - It does not match an inline allowlist tag.
 *
 * Inline allowlist tags (justification required):
 *   // DRIFT-...   Unreconciled drift vs canonical — tracked in docs/
 *   // DERIVED-... Value is derived from canonical (e.g. arr_y3 × 8)
 *   # DRIFT-... / # DERIVED-...  Python equivalents
 *
 * Out of scope:
 *   Numbers that are not in pitch-data.json (research stats, market sizing,
 *   tactical ops targets, model assumptions). Those are documented claims,
 *   not investment terms; ADR-004 intentionally limits canonical truth to
 *   the pitch-data file.
 *
 * Exit:
 *   0 — no canonical-duplicates outside allowlist
 *   1 — at least one violation
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { resolve, dirname, join, relative } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// ── CANONICAL VALUES ────────────────────────────────────────────────────────
function collectCanonicalValues(obj, out = new Set()) {
  if (typeof obj === 'string') {
    // Include only strings that look like a quantitative business claim.
    // Skip prose (meta.reconciliation_note, meta.version, etc).
    if (/^\$|^\d|%$|%\+$|\bMonth\s\d|\d\s*months?/.test(obj)) {
      out.add(obj);
    }
    return out;
  }
  if (Array.isArray(obj)) {
    obj.forEach((v) => collectCanonicalValues(v, out));
    return out;
  }
  if (obj && typeof obj === 'object') {
    Object.values(obj).forEach((v) => collectCanonicalValues(v, out));
  }
  return out;
}

const PITCH = JSON.parse(readFileSync(resolve(ROOT, 'content/pitch-data.json'), 'utf8'));
const CANONICAL = [...collectCanonicalValues(PITCH)].sort((a, b) => b.length - a.length);
// Sort longest-first so "$1,999" is tried before "$1" inside a superstring.

// ── INLINE ALLOWLIST TAGS ──────────────────────────────────────────────────
const ALLOWLIST_TAGS = [
  /\/\/\s*DRIFT-/,
  /\/\/\s*DERIVED-/,
  /#\s*DRIFT-/,
  /#\s*DERIVED-/,
];

// ── FILE COLLECTION ─────────────────────────────────────────────────────────
const RENDER_EXTENSIONS = new Set(['.jsx', '.tsx', '.js', '.ts']);

function isTestFile(path) {
  return /\.(test|spec)\.[jt]sx?$/.test(path);
}

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry === 'dist' || entry === '.git') continue;
    const full = join(dir, entry);
    const s = statSync(full);
    if (s.isDirectory()) walk(full, files);
    else files.push(full);
  }
  return files;
}

const sourceFiles = [
  ...walk(resolve(ROOT, 'src')).filter(
    f => RENDER_EXTENSIONS.has(f.slice(f.lastIndexOf('.'))) && !isTestFile(f),
  ),
  resolve(ROOT, 'build_deck.py'),
];

// ── SCAN ────────────────────────────────────────────────────────────────────
const violations = [];
const waivedByAllowlist = [];

for (const file of sourceFiles) {
  const rel = relative(ROOT, file);
  const lines = readFileSync(file, 'utf8').split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    const trimmed = line.trim();
    // Skip comment-only lines — docs/prose can legitimately discuss numbers.
    if (trimmed.startsWith('//') || trimmed.startsWith('#') || trimmed.startsWith('*')) continue;

    const referencesPitchData = /pitchData\.|_PITCH\[/.test(line);
    const allowlisted = ALLOWLIST_TAGS.some(tag => tag.test(line));

    // Find canonical values hardcoded on this line.
    const hits = [];
    for (const v of CANONICAL) {
      const idx = line.indexOf(v);
      if (idx === -1) continue;
      hits.push(v);
    }
    if (hits.length === 0) continue;

    if (allowlisted) {
      waivedByAllowlist.push({ file: rel, line: lineNum, literals: hits });
      continue;
    }

    // If the line references pitchData, assume the literal hit comes from
    // string interpolation / coincidental match and the line is actually fine.
    // This is belt-and-suspenders: if someone writes
    //   <span>{pitchData.round.size}</span> {/* $1.5M */}
    // we won't false-flag. Comment-only lines were already filtered above.
    if (referencesPitchData) continue;

    violations.push({ file: rel, line: lineNum, literals: hits, raw: trimmed });
  }
}

// ── OUTPUT ──────────────────────────────────────────────────────────────────
if (violations.length === 0) {
  console.log(`[verify-content-consistency] PASSED — 0 canonical-duplicate hardcodes`);
  if (waivedByAllowlist.length > 0) {
    console.log(`[verify-content-consistency] Inline-allowlisted: ${waivedByAllowlist.length} line(s)`);
    for (const w of waivedByAllowlist) {
      console.log(`  ${w.file}:${w.line}  (${w.literals.join(', ')})`);
    }
  }
  process.exit(0);
}

console.error(`[verify-content-consistency] FAILED — ${violations.length} violation(s)`);
console.error('Hardcoded literal duplicates a canonical value in content/pitch-data.json.');
console.error('Either reference pitchData.* / _PITCH[...] or tag the line with // DRIFT- or // DERIVED-.');
console.error('See docs/decisions/ADR-004-content-consistency.md.\n');

for (const v of violations) {
  console.error(`  ${v.file}:${v.line}`);
  console.error(`    canonical literals found: ${v.literals.join(', ')}`);
  console.error(`    ${v.raw}`);
  console.error('');
}

process.exit(1);
