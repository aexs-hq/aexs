import { Link } from 'react-router-dom';
import { C } from '../constants/theme';
import PageShell from '../components/PageShell';

const SECTIONS = [
  {
    to: '/pitch',
    icon: '◆',
    label: 'Pitch Deck',
    tag: '12 Slides',
    description:
      'Investor-ready deck covering problem, solution, product, market sizing, traction, business model, financials, competition, go-to-market, team, and funding ask.',
    color: C.gold,
  },
  {
    to: '/roadmap',
    icon: '⬡',
    label: 'Execution Roadmap',
    tag: '3 Ventures · 36 Steps',
    description:
      'Phased build playbook for AI Chief of Staff, AI Governance as a Service, and Executive Decision Support — from entity setup through Series A prep.',
    color: C.blue,
  },
  {
    to: '/model',
    icon: '∑',
    label: 'Financial Model',
    tag: '36-Month Projection',
    description:
      'Interactive model with adjustable pricing, growth rate, churn, COGS, and burn assumptions. Outputs MRR, ARR, gross margin, and cash balance per month.',
    color: C.teal,
  },
];

export default function Home() {
  return (
    <PageShell>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 60 }}>
        <p style={{
          fontFamily: 'monospace',
          fontSize: 9,
          letterSpacing: 4,
          color: C.muted,
          textTransform: 'uppercase',
          margin: '0 0 20px',
        }}>
          Investor Demo · 2026
        </p>
        <h1 style={{
          fontFamily: "'Georgia', 'Times New Roman', serif",
          fontSize: 'clamp(36px, 7vw, 56px)',
          fontWeight: 300,
          letterSpacing: -1,
          color: C.text,
          margin: '0 0 12px',
          lineHeight: 1.1,
        }}>
          AEXS
        </h1>
        <p style={{
          fontFamily: "'Georgia', serif",
          fontStyle: 'italic',
          fontSize: 16,
          color: C.dim,
          margin: '0 0 24px',
          letterSpacing: 1,
        }}>
          AI Executive Suite
        </p>
        <div style={{ width: 40, height: 1, background: C.gold, margin: '0 auto 24px' }} />
        <p style={{
          fontSize: 14,
          color: C.dim,
          maxWidth: 480,
          margin: '0 auto',
          lineHeight: 1.8,
        }}>
          The operating intelligence layer for the world's most ambitious executives —
          Chief of Staff, Governance, and Decision Support unified in one platform.
        </p>
      </div>

      {/* Section cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: 20,
        marginBottom: 48,
      }}>
        {SECTIONS.map(({ to, icon, label, tag, description, color }) => (
          <Link
            key={to}
            to={to}
            style={{ textDecoration: 'none' }}
          >
            <div style={{
              background: C.card,
              border: `1px solid ${C.border}`,
              borderTop: `2px solid ${color}`,
              borderRadius: 4,
              padding: '24px 20px',
              cursor: 'pointer',
              transition: 'border-color 0.15s',
              height: '100%',
              boxSizing: 'border-box',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = color}
              onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span style={{ fontSize: 18, color }}>{icon}</span>
                <span style={{
                  fontFamily: 'monospace',
                  fontSize: 9,
                  letterSpacing: 3,
                  color,
                  textTransform: 'uppercase',
                }}>
                  {tag}
                </span>
              </div>
              <p style={{
                fontFamily: "'Georgia', serif",
                fontSize: 17,
                color: C.text,
                margin: '0 0 10px',
                fontWeight: 400,
              }}>
                {label}
              </p>
              <p style={{
                fontSize: 12,
                color: C.dim,
                lineHeight: 1.7,
                margin: 0,
              }}>
                {description}
              </p>
              <div style={{
                marginTop: 20,
                fontFamily: 'monospace',
                fontSize: 9,
                letterSpacing: 2,
                color,
                textTransform: 'uppercase',
              }}>
                Open →
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Disclaimer banner */}
      <div style={{
        border: `1px solid ${C.gold}33`,
        borderLeft: `3px solid ${C.gold}`,
        background: `${C.gold}08`,
        borderRadius: 3,
        padding: '14px 18px',
      }}>
        <p style={{
          fontFamily: 'monospace',
          fontSize: 9,
          letterSpacing: 3,
          color: C.gold,
          textTransform: 'uppercase',
          margin: '0 0 6px',
        }}>
          Review Required
        </p>
        <p style={{ fontSize: 12, color: C.dim, lineHeight: 1.7, margin: 0 }}>
          Several business assumptions in this demo — including pricing tiers, seed capital
          figure, and one brand color — contain unresolved contradictions between files.
          None have been changed. See{' '}
          <a
            href="/docs/business-contradictions.md"
            target="_blank"
            rel="noreferrer"
            style={{ color: C.gold, fontFamily: 'monospace', textDecoration: 'underline' }}
          >
            docs/business-contradictions.md
          </a>{' '}
          for a full accounting before sharing externally.
        </p>
      </div>
    </PageShell>
  );
}
