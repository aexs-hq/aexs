/**
 * verify-theme-sync.js
 * Detects drift between tokens/design-tokens.json and src/constants/theme.js.
 *
 * tokens/design-tokens.json is authoritative.
 * theme.js is a temporary compatibility layer that must mirror token values
 * for any key that exists under the same name in both files.
 *
 * Exit codes:
 *   0 — all shared keys match (or no shared keys)
 *   1 — drift detected, or a required file is missing / unreadable
 *
 * Node built-ins only. Zero npm dependencies.
 * ESM module (package.json "type": "module").
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = resolve(__dirname, '..');

// ── BLOCK 1: Load token file ────────────────────────────────────────────────

const tokenPath = resolve(ROOT, 'tokens/design-tokens.json');
let tokens;
try {
  tokens = JSON.parse(readFileSync(tokenPath, 'utf8'));
} catch (err) {
  if (err.code === 'ENOENT') {
    console.error('[verify-theme-sync] FATAL: tokens/design-tokens.json not found');
    console.error('  Expected at:', tokenPath);
    console.error('  Create this file per the coherence program Phase 1A.');
  } else {
    console.error('[verify-theme-sync] FATAL: Failed to parse tokens/design-tokens.json');
    console.error(' ', err.message);
  }
  process.exit(1);
}

const tokenColors = tokens?.colors;
if (!tokenColors || typeof tokenColors !== 'object') {
  console.error('[verify-theme-sync] FATAL: tokens/design-tokens.json has no "colors" object');
  process.exit(1);
}

// ── BLOCK 2: Load theme.js color values ────────────────────────────────────
// theme.js uses ESM (export const C = {...}) — use dynamic import()
// If theme.js does not exist, migration is complete — exit cleanly.

const themeUrl = new URL('../src/constants/theme.js', import.meta.url);
let themeModule;
try {
  themeModule = await import(themeUrl.href);
} catch (err) {
  if (err.code === 'ERR_MODULE_NOT_FOUND' || err.code === 'ERR_LOAD_URL') {
    console.log('[verify-theme-sync] theme.js not found — migration complete. All consumers use CSS vars.');
    console.log('[verify-theme-sync] PASSED');
    process.exit(0);
  }
  console.error('[verify-theme-sync] FATAL: Failed to import src/constants/theme.js');
  console.error(' ', err.message);
  process.exit(1);
}

const themeColors = themeModule?.C;
if (!themeColors || typeof themeColors !== 'object') {
  console.error('[verify-theme-sync] FATAL: src/constants/theme.js does not export a "C" object');
  process.exit(1);
}

// ── BLOCK 3: Compute shared key intersection ────────────────────────────────

const tokenKeys = new Set(Object.keys(tokenColors));
const themeKeys = new Set(Object.keys(themeColors));
const sharedKeys = [...tokenKeys].filter(k => themeKeys.has(k));

if (sharedKeys.length === 0) {
  console.error('[verify-theme-sync] WARNING: No shared keys found between token file and theme.js.');
  console.error('  theme.js keys:   ', [...themeKeys].join(', '));
  console.error('  token file keys: ', [...tokenKeys].join(', '));
  console.error('  Check that key names are aligned between files.');
  process.exit(1);
}

console.log(`[verify-theme-sync] Checking ${sharedKeys.length} shared color keys: ${sharedKeys.join(', ')}`);

// ── BLOCK 4: Compare values ─────────────────────────────────────────────────

const mismatches = [];

for (const key of sharedKeys) {
  const tokenVal = String(tokenColors[key]).toLowerCase().trim();
  const themeVal = String(themeColors[key]).toLowerCase().trim();
  if (tokenVal !== themeVal) {
    mismatches.push({ key, tokenVal, themeVal });
  }
}

for (const { key, tokenVal, themeVal } of mismatches) {
  console.error('[verify-theme-sync] DRIFT DETECTED');
  console.error(`  key:     ${key}`);
  console.error(`  token:   ${tokenVal}  ← authoritative`);
  console.error(`  theme:   ${themeVal}  ← must be updated`);
  console.error(`  fix:     Update theme.js C.${key} to match tokens/design-tokens.json`);
}

// ── BLOCK 5: Consumer count ─────────────────────────────────────────────────

let consumerFiles = [];
try {
  const result = execSync(
    'grep -rl "from.*theme\\|require.*theme" src/ --include="*.jsx" --include="*.js" --include="*.ts" --include="*.tsx"',
    { cwd: ROOT, encoding: 'utf8' }
  );
  consumerFiles = result.trim().split('\n').filter(Boolean);
} catch (err) {
  // grep exits non-zero when no matches — treat as zero consumers
  if (err.stdout) {
    consumerFiles = err.stdout.trim().split('\n').filter(Boolean);
  }
}

console.log(`[verify-theme-sync] theme.js consumers remaining in src/: ${consumerFiles.length} file(s)`);
for (const f of consumerFiles) {
  console.log(`  ${f}`);
}
console.log('[verify-theme-sync] Deprecation target: 0. Remove theme.js when reached.');

// ── BLOCK 6: Exit ───────────────────────────────────────────────────────────

if (mismatches.length > 0) {
  console.error(`[verify-theme-sync] FAILED: ${mismatches.length} drift(s) detected`);
  console.error('  tokens/design-tokens.json is authoritative.');
  console.error('  No new values may be added to theme.js.');
  process.exit(1);
}

console.log('[verify-theme-sync] PASSED: theme.js is in sync with token file');
process.exit(0);
