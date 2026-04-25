import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import PageShell from './components/PageShell';

// Route-level code splitting.
// Each page loads its own chunk on first navigation — recharts is only
// fetched when /pitch or /model is visited, not on initial load.
const Home            = lazy(() => import('./pages/Home'));
const PitchDeck       = lazy(() => import('./pages/PitchDeck'));
const Roadmap         = lazy(() => import('./pages/Roadmap'));
const FinancialModel  = lazy(() => import('./pages/FinancialModel'));
const NotFound        = lazy(() => import('./pages/NotFound'));

const fallback = <PageShell loading />;

export default function App() {
  return (
    <Suspense fallback={fallback}>
      <Routes>
        {/* PitchDeck owns its full-page layout (fixed nav + sidebar) */}
        <Route path="/pitch" element={<PitchDeck />} />
        {/* All other routes use the shared AppLayout */}
        <Route path="/*" element={
          <AppLayout>
            <Suspense fallback={fallback}>
              <Routes>
                <Route path="/"               element={<Home />} />
                <Route path="/roadmap"        element={<Roadmap />} />
                <Route path="/model"          element={<FinancialModel />} />
                <Route path="*"              element={<NotFound />} />
              </Routes>
            </Suspense>
          </AppLayout>
        } />
      </Routes>
    </Suspense>
  );
}
