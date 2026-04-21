/**
 * export-deck-pdf.js
 * Path B — Playwright HTML-to-PDF export.
 *
 * Builds the production bundle, starts a local preview server,
 * opens /pitch?mode=export in headless Chromium, and exports
 * one 16:9 page per SlideShell to PDF.
 *
 * Usage:  node scripts/export-deck-pdf.js
 * Output: public/deck.pdf  (served at /deck.pdf by Vite)
 *
 * Two-layer chrome suppression:
 *   Layer 1: @media print CSS hides fixed nav + aside (fallback)
 *   Layer 2: ?mode=export prevents chrome from mounting in React
 *
 * Node built-ins + playwright + vite. ESM module.
 */

import { chromium } from 'playwright';
import { execSync } from 'child_process';
import { statSync, readFileSync } from 'fs';
import { preview as vitePreview } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const OUTPUT = resolve(ROOT, 'public/deck.pdf');
const SLIDE_COUNT_EXPECTED = 12;

// Canonical production origin. Relative anchor hrefs are rewritten to this
// before page.pdf() so Playwright does not bake the local preview port into
// embedded PDF link annotations (prior bug: /URI (http://localhost:45159/...)).
const CANONICAL_ORIGIN = 'https://aexs.ai';

async function main() {
  // 1. Build production bundle
  console.log('[export-deck] Building production bundle...');
  execSync('npm run build', { cwd: ROOT, stdio: 'inherit' });

  // 2. Start preview server
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

    // Viewport at 16:9 ratio for consistent rendering
    await page.setViewportSize({ width: 1440, height: 810 });

    // 4. Navigate with ?mode=export to suppress chrome
    const exportUrl = `${baseUrl}/pitch?mode=export`;
    console.log(`[export-deck] Loading ${exportUrl}`);
    await page.goto(exportUrl, { waitUntil: 'networkidle' });

    // Wait for slides to render
    await page.waitForSelector('.slide-shell', { state: 'attached' });

    // Wait for the useExportMode hook to mount the body attribute.
    // If this times out, the export-mode code path did not run and chrome
    // suppression is not guaranteed — fail fast rather than render a bad PDF.
    await page.waitForFunction(
      () => document.body.getAttribute('data-export-mode') === 'true',
      { timeout: 10000 },
    );
    console.log('[export-deck] Export mode confirmed active');

    // Wait for fonts
    await page.evaluate(() => document.fonts.ready);
    console.log('[export-deck] Fonts ready');

    // Final paint buffer
    await page.waitForTimeout(500);

    // 5. Assert: correct slide count
    const slideCount = await page.locator('.slide-shell').count();
    if (slideCount !== SLIDE_COUNT_EXPECTED) {
      throw new Error(`Expected ${SLIDE_COUNT_EXPECTED} slides, found ${slideCount}`);
    }
    console.log(`[export-deck] ${slideCount} slides verified`);

    // 6. Assert: chrome is not in DOM (Layer 2 check)
    const hasNav = await page.locator('nav.fixed.top-0').count();
    const hasAside = await page.locator('aside.fixed').count();
    if (hasNav > 0 || hasAside > 0) {
      throw new Error(`Chrome still in DOM: nav=${hasNav}, aside=${hasAside}. ?mode=export not working.`);
    }
    console.log('[export-deck] Chrome suppression verified (not in DOM)');

    // 7. Rewrite relative anchor hrefs to the canonical production origin.
    // Playwright's page.pdf() embeds each <a href> as a /URI annotation
    // resolved against the current page origin. Without this step, a
    // relative href like "/deck.pdf" becomes http://localhost:<port>/deck.pdf
    // inside the PDF — an unreachable link on any user's device. Absolute
    // URLs and in-page fragment links are left untouched.
    const rewrittenCount = await page.evaluate((origin) => {
      let n = 0;
      document.querySelectorAll('a[href]').forEach((a) => {
        const href = a.getAttribute('href');
        if (href && href.startsWith('/') && !href.startsWith('//')) {
          a.setAttribute('href', origin + href);
          n += 1;
        }
      });
      return n;
    }, CANONICAL_ORIGIN);
    console.log(`[export-deck] Rewrote ${rewrittenCount} relative href(s) to ${CANONICAL_ORIGIN}`);

    // 8. Emulate print media and export PDF
    await page.emulateMedia({ media: 'print' });
    await page.pdf({
      path: OUTPUT,
      width: '10in',
      height: '5.625in',
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      preferCSSPageSize: false,
    });

    // 9. Assert: output file exists and has content
    const stat = statSync(OUTPUT);
    if (stat.size < 50000) {
      throw new Error(`PDF too small (${stat.size} bytes) — possible blank render`);
    }

    // 10. Assert: no localhost URL leaked into embedded link annotations.
    // This catches any future regression where a new <a href="/..."> on a
    // slide slips past step 7 (e.g., if a hook misses an element or if a
    // third-party component injects its own anchors).
    const raw = readFileSync(OUTPUT).toString('latin1');
    if (raw.includes('http://localhost') || raw.includes('https://localhost')) {
      throw new Error('PDF contains an embedded localhost URL — href sanitization did not catch it');
    }

    console.log(`[export-deck] PDF exported: public/deck.pdf (${stat.size} bytes)`);
    console.log('[export-deck] COMPLETE');

  } finally {
    if (browser) await browser.close();
    server.httpServer.close();
  }
}

main().catch(err => {
  console.error('[export-deck] FATAL:', err.message);
  process.exit(1);
});
