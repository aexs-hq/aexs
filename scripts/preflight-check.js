/**
 * preflight-check.js
 *
 * Founder-facing release gate. Runs a series of numbered PF-* checks;
 * each is blocking (non-zero exit on failure). New checks are appended
 * as features ship. This initial version ships PF-13 only; earlier
 * PF-01..PF-12 slots are reserved for CI/docs/brand checks added later.
 *
 * Usage:   npm run preflight
 * Output:  one line per check, PASS / FAIL, exit 0 only if all pass.
 */

import { execSync } from 'child_process';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const results = [];

function run(id, label, cmd) {
  process.stdout.write(`[preflight] ${id} ${label} ... `);
  try {
    execSync(cmd, { cwd: ROOT, stdio: 'pipe' });
    console.log('PASS');
    results.push({ id, label, pass: true });
  } catch (err) {
    console.log('FAIL');
    console.error(err.stdout?.toString() ?? '');
    console.error(err.stderr?.toString() ?? '');
    results.push({ id, label, pass: false });
  }
}

// ── PF-13 — Content consistency (ADR-004) ────────────────────────────────
run('PF-13', 'Content consistency', 'node scripts/verify-content-consistency.js');

// ── SUMMARY ────────────────────────────────────────────────────────────────
const failed = results.filter(r => !r.pass);
console.log('');
console.log(`[preflight] Summary: ${results.length - failed.length} / ${results.length} passed`);

if (failed.length > 0) {
  console.error(`[preflight] FAILED checks: ${failed.map(f => f.id).join(', ')}`);
  process.exit(1);
}
console.log('[preflight] All checks passed.');
