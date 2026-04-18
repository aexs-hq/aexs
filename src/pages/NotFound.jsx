import { Link } from 'react-router-dom';
import PageShell from '../components/PageShell';

const LINKS = [
  { to: '/',        label: 'Home'            },
  { to: '/pitch',   label: 'Pitch Deck'      },
  { to: '/roadmap', label: 'Roadmap'         },
  { to: '/model',   label: 'Financial Model' },
];

export default function NotFound() {
  return (
    <PageShell>
      <div style={{ textAlign: 'center', paddingTop: 40 }}>
        <p style={{
          fontFamily: 'monospace',
          fontSize: 9,
          letterSpacing: 4,
          color: 'var(--color-muted)',
          textTransform: 'uppercase',
          margin: '0 0 20px',
        }}>
          404 · Not Found
        </p>
        <h1 style={{
          fontFamily: "'Georgia', 'Times New Roman', serif",
          fontSize: 'clamp(32px, 7vw, 52px)',
          fontWeight: 300,
          letterSpacing: -1,
          color: 'var(--color-text)',
          margin: '0 0 12px',
          lineHeight: 1.1,
        }}>
          Page not found.
        </h1>
        <div style={{ width: 32, height: 1, background: 'var(--color-gold)', margin: '24px auto' }} />
        <p style={{ fontSize: 13, color: 'var(--color-dim)', lineHeight: 1.8, marginBottom: 40 }}>
          That route doesn't exist in this demo.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
          {LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              style={{
                fontFamily: 'monospace',
                fontSize: 10,
                letterSpacing: 2,
                textTransform: 'uppercase',
                color: 'var(--color-gold)',
                textDecoration: 'none',
                border: '1px solid color-mix(in srgb, var(--color-gold) 27%, transparent)',
                padding: '8px 16px',
                borderRadius: 3,
              }}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
