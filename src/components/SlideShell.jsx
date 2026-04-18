/**
 * SlideShell — container for each PitchDeck slide.
 *
 * Browser: minimal wrapper (position: relative + overflow: hidden).
 * Print / Playwright: fixed 960×540px unit with page-break-after.
 * CSS rules live in src/index.css under .slide-shell.
 *
 * Prerequisite for Path B (Playwright HTML-to-PDF) per
 * docs/02-phase-1/pdf-render-strategy.md Step 7.
 */
export default function SlideShell({ children }) {
  return (
    <div className="slide-shell">
      {children}
    </div>
  );
}
