/**
 * export-deck-pdf.js
 * Path B — Playwright HTML-to-PDF export.
 *
 * Builds the production bundle, starts a local preview server,
 * opens /pitch in headless Chromium with print media emulation,
 * and exports one 960x540 page per SlideShell to PDF.
 *
 * Usage:  node scripts/export-deck-pdf.js
 * Output: public/deck.pdf  (served at /deck.pdf by Vite)
 *
 * Prerequisites (all met):
 *   - SlideShell wraps every PitchDeck section
 *   - @media print CSS enforces 960x540 + page-break-after
 *   - Playwright + Chromium installed
 *
 * Node built-ins + playwright only. ESM module.
 */

import { chromium } from 'playwright';
import { execSync } from 'child_process';
import { preview as vitePreview } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const OUTPUT = resolve(ROOT, 'public/deck.pdf');

// Slide dimensions from tokens/design-tokens.json canvas
const SLIDE_W = 960;
const SLIDE_H = 540;

async function main() {
  // 1. Build production bundle
  console.log('[export-deck] Building production bundle...');
  execSync('npm run build', { cwd: ROOT, stdio: 'inherit' });

  // 2. Start preview server on a random free port
  console.log('[export-deck] Starting preview server...');
  const server = await vitePreview({
    root: ROOT,
    preview: { port: 0 },
  });
  const address = server.httpServer.address();
  const port = typeof address === 'object' ? address.port : address;
  const baseUrl = `http://localhost:${port}`;
  console.log(`[export-deck] Preview at ${baseUrl}`);

  let browser;
  try {
    // 3. Launch headless Chromium
    browser = await chromium.launch();
    const page = await browser.newPage();

    // Emulate print media so @media print rules apply
    await page.emulateMedia({ media: 'print' });

    // Set viewport to slide dimensions
    await page.setViewportSize({ width: SLIDE_W, height: SLIDE_H });

    // 4. Navigate to pitch deck
    console.log('[export-deck] Loading /pitch ...');
    await page.goto(`${baseUrl}/pitch`, { waitUntil: 'networkidle' });

    // Wait for all slide-shell elements to render
    await page.waitForSelector('.slide-shell', { state: 'attached' });

    // Small delay for fonts + images
    await page.waitForTimeout(1000);

    // 5. Export to PDF
    console.log(`[export-deck] Exporting ${OUTPUT} ...`);
    await page.pdf({
      path: OUTPUT,
      width: `${SLIDE_W}px`,
      height: `${SLIDE_H}px`,
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });

    // Count pages (rough check)
    const slideCount = await page.locator('.slide-shell').count();
    console.log(`[export-deck] Done — ${slideCount} slides exported to public/deck.pdf`);

  } finally {
    if (browser) await browser.close();
    server.httpServer.close();
  }
}

main().catch(err => {
  console.error('[export-deck] FATAL:', err.message);
  process.exit(1);
});
