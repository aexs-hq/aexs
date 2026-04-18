import { NavLink } from 'react-router-dom';

const NAV_LINKS = [
  { to: '/',        label: 'Home'            },
  { to: '/pitch',   label: 'Pitch Deck'      },
  { to: '/roadmap', label: 'Roadmap'         },
  { to: '/model',   label: 'Financial Model' },
];

export default function NavBar() {
  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      gap: 20,
      padding: '10px 20px',
      background: '#0b0b0f',
      borderBottom: '1px solid var(--color-border-ui)',
      fontFamily: 'monospace',
      fontSize: 10,
      letterSpacing: 2,
      position: 'sticky',
      top: 0,
      zIndex: 100,
      overflowX: 'auto',
      scrollbarWidth: 'none',   /* Firefox */
    }}>
      <span style={{ color: 'var(--color-gold)', fontWeight: 700, fontSize: 13, marginRight: 8, letterSpacing: 3 }}>
        AEXS
      </span>
      {NAV_LINKS.map(({ to, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          style={({ isActive }) => ({
            color: isActive ? 'var(--color-gold)' : 'var(--color-dim)',
            textDecoration: 'none',
            textTransform: 'uppercase',
            borderBottom: isActive ? '1px solid var(--color-gold)' : '1px solid transparent',
            paddingBottom: 2,
          })}
        >
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
