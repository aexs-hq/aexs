import NavBar from './NavBar';

/**
 * AppLayout — outer shell shared by all routes.
 * Renders the sticky NavBar and wraps content in the AEXS dark background.
 */
export default function AppLayout({ children }) {
  return (
    <div style={{ background: 'var(--color-dark)', minHeight: '100vh', color: 'var(--color-text)' }}>
      <NavBar />
      {children}
    </div>
  );
}
