/**
 * PageShell — two uses:
 *
 * 1. As a Suspense fallback while a lazy route chunk loads.
 *    Usage: <Suspense fallback={<PageShell loading />}>
 *
 * 2. As a content wrapper for pages that do not manage their own
 *    full-width layout (e.g. Home). Provides consistent padding.
 *    Usage: <PageShell><YourContent /></PageShell>
 */
export default function PageShell({ loading = false, children }) {
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 41px)',
        fontFamily: 'monospace',
        fontSize: 10,
        letterSpacing: 3,
        color: 'var(--color-muted)',
        textTransform: 'uppercase',
      }}>
        Loading…
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: 860,
      margin: '0 auto',
      padding: '40px 20px',
    }}>
      {children}
    </div>
  );
}
