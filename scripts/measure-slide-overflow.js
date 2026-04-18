/**
 * measure-slide-overflow.js
 *
 * Diagnostic — prints per-slide vertical overflow against the 540px
 * print-page target. Never modifies state. Always exits 0.
 *
 * How it works:
 *   1. Build production bundle (same bundle the PDF exporter uses).
 *   2. Start Vite preview on a free port.
 *   3. Launch headless Chromium, viewport 960×540.
 *   4. Call page.emulateMedia({ media: 'print' }) so @media print rules apply.
 *   5. Navigate to /pitch?mode=export, wait for slide-shells, fonts, and the
 *      useExportMode body attribute.
 *   6. For each .slide-shell, measure the inner section's scrollHeight (the
 *      natural content height) and the slide-shell's clientHeight (the
 *      print-page frame). Overflow = content - frame.
 *   7. Emit a per-slide table and aggregate stats (max/avg/worst).
 *
 * Usage:  node scripts/measure-slide-overflow.js
 * Output: stdout table + JSON summary. No files written.
 *
 * Re-runnable on every future PR.
 */

import { chromium } from 'playwright';
import { execSync } from 'child_process';
import { preview as vitePreview } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const TARGET_HEIGHT = 540; // matches PDF page height (5.625in × 96dpi)
const VIEWPORT = { width: 960, height: 540 };

// Slide labels mirror the SLIDES array in PitchDeck.jsx. Kept local so this
// script does not import React source; if the deck is ever reordered the
// labels will drift and need to be re-synced here.
const SLIDE_LABELS = [
  'Cover', 'Problem', 'Solution', 'Product', 'Market', 'Traction',
  'Business Model', 'Financials', 'Competition', 'Go-To-Market',
  'Team', 'The Ask',
];

async function main() {
  console.log('[measure] Building production bundle...');
  execSync('npm run build', { cwd: ROOT, stdio: 'inherit' });

  console.log('[measure] Starting preview server...');
  const server = await vitePreview({ root: ROOT, preview: { port: 0 } });
  const address = server.httpServer.address();
  const port = typeof address === 'object' ? address.port : address;
  const baseUrl = `http://localhost:${port}`;
  console.log(`[measure] Preview at ${baseUrl}`);

  let browser;
  try {
    browser = await chromium.launch();
    const page = await browser.newPage();

    await page.setViewportSize(VIEWPORT);
    await page.emulateMedia({ media: 'print' });

    const exportUrl = `${baseUrl}/pitch?mode=export`;
    console.log(`[measure] Loading ${exportUrl} (print media emulated)`);
    await page.goto(exportUrl, { waitUntil: 'networkidle' });

    await page.waitForSelector('.slide-shell', { state: 'attached' });
    await page.waitForFunction(
      () => document.body.getAttribute('data-export-mode') === 'true',
      { timeout: 10_000 },
    );
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(300); // final paint buffer

    const frame = await page.evaluate((target) => {
      const shells = [...document.querySelectorAll('.slide-shell')];
      return shells.map((shell, i) => {
        const section = shell.firstElementChild;
        const contentHeight = section ? section.scrollHeight : 0;
        const frameHeight = shell.clientHeight;
        return {
          index: i,
          id: section?.id ?? '',
          frameHeight,
          contentHeight,
          overflow: Math.max(0, contentHeight - target),
          fits: contentHeight <= target,
        };
      });
    }, TARGET_HEIGHT);

    // Table output
    console.log('');
    console.log(`[measure] Target page height: ${TARGET_HEIGHT}px`);
    console.log(
      `  # | ${'slide'.padEnd(18)} | ${'id'.padEnd(12)} | frame |   content |  overflow | fits`,
    );
    console.log(`  --+${'-'.repeat(20)}+${'-'.repeat(14)}+-------+-----------+-----------+-----`);
    for (const row of frame) {
      const label = (SLIDE_LABELS[row.index] ?? '').padEnd(18);
      const id = row.id.padEnd(12);
      const idx = String(row.index + 1).padStart(2);
      const frameH = String(row.frameHeight).padStart(5);
      const contentH = String(row.contentHeight).padStart(9);
      const over = String(row.overflow).padStart(9);
      const fits = row.fits ? 'YES ' : 'NO  ';
      console.log(`  ${idx} | ${label} | ${id} | ${frameH} | ${contentH} | ${over} | ${fits}`);
    }

    const overflows = frame.map(r => r.overflow);
    const max = Math.max(...overflows);
    const avg = Math.round(overflows.reduce((a, b) => a + b, 0) / overflows.length);
    const worstIndex = overflows.indexOf(max);
    const worst = frame[worstIndex];
    const failingCount = frame.filter(r => !r.fits).length;

    console.log('');
    console.log('[measure] Summary');
    console.log(`  Slides over budget: ${failingCount} / ${frame.length}`);
    console.log(`  Max overflow:       ${max}px`);
    console.log(`  Avg overflow:       ${avg}px`);
    console.log(
      `  Worst slide:        #${worst.index + 1} ${SLIDE_LABELS[worst.index] ?? worst.id} ` +
      `(${worst.contentHeight}px content, ${max}px over)`,
    );

    // Machine-readable summary on the last line — simple JSON so CI can grep it later.
    console.log('');
    console.log('[measure] JSON: ' + JSON.stringify({
      target: TARGET_HEIGHT,
      slides: frame,
      max,
      avg,
      failingCount,
      worstIndex,
    }));

  } finally {
    if (browser) await browser.close();
    server.httpServer.close();
  }
}

main().catch(err => {
  // Diagnostic script — non-blocking. Log the error but still exit 0 so
  // this doesn't accidentally gate CI if the probe itself breaks.
  console.error('[measure] Non-fatal error:', err.message);
  process.exit(0);
});
