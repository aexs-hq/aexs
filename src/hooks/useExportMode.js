import { useEffect } from 'react';

/**
 * Returns true when the current URL contains ?mode=export.
 * Also sets body[data-export-mode="true"] so CSS can catch any chrome
 * element that bypassed the JSX conditional (defense-in-depth for the
 * Playwright PDF export and browser Cmd+P).
 */
export function useExportMode() {
  const isExport =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('mode') === 'export';

  useEffect(() => {
    if (!isExport) return;
    document.body.setAttribute('data-export-mode', 'true');
    return () => document.body.removeAttribute('data-export-mode');
  }, [isExport]);

  return isExport;
}
