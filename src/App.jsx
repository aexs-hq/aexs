import { NavLink, Routes, Route, Navigate } from 'react-router-dom';
import PitchDeck from './pages/PitchDeck';
import Roadmap from './pages/Roadmap';
import FinancialModel from './pages/FinancialModel';
import { C } from './constants/theme';

const NAV_LINKS = [
  { to: '/pitch',   label: 'Pitch Deck'      },
  { to: '/roadmap', label: 'Roadmap'          },
  { to: '/model',   label: 'Financial Model'  },
];

export default function App() {
  return (
    <div style={{ background: C.dark, minHeight: '100vh' }}>
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        gap: 24,
        padding: '10px 20px',
        background: '#0b0b0f',
        borderBottom: `1px solid ${C.border}`,
        fontFamily: 'monospace',
        fontSize: 10,
        letterSpacing: 2,
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <span style={{ color: C.gold, fontWeight: 700, fontSize: 13, marginRight: 8 }}>
          AEXS
        </span>
        {NAV_LINKS.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            style={({ isActive }) => ({
              color: isActive ? C.gold : C.dim,
              textDecoration: 'none',
              textTransform: 'uppercase',
              borderBottom: isActive ? `1px solid ${C.gold}` : '1px solid transparent',
              paddingBottom: 2,
            })}
          >
            {label}
          </NavLink>
        ))}
      </nav>

      <Routes>
        <Route path="/"        element={<Navigate to="/pitch" replace />} />
        <Route path="/pitch"   element={<PitchDeck />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/model"   element={<FinancialModel />} />
      </Routes>
    </div>
  );
}
