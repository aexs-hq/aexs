import { useEffect, useState } from 'react';
import { usePresentationMode } from '../hooks/usePresentationMode';

/**
 * Shown once on /pitch visit — offers to enter fullscreen so investors
 * see only slide content (no toolbars, no extension icons, no tabs).
 * Auto-dismisses after an 8s countdown if the presenter does nothing.
 */
export default function PresentationGate({ onDismiss }) {
  const { enterPresentation } = usePresentationMode();
  const [countdown, setCountdown] = useState(8);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onDismiss();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [onDismiss]);

  // Any scroll / wheel / touch dismisses the gate immediately — the
  // overlay must never block the deck from being read.
  useEffect(() => {
    const dismissOnce = () => onDismiss();
    const opts = { once: true, passive: true };
    window.addEventListener('wheel', dismissOnce, opts);
    window.addEventListener('touchmove', dismissOnce, opts);
    window.addEventListener('scroll', dismissOnce, opts);
    return () => {
      window.removeEventListener('wheel', dismissOnce);
      window.removeEventListener('touchmove', dismissOnce);
      window.removeEventListener('scroll', dismissOnce);
    };
  }, [onDismiss]);

  const handlePresent = async () => {
    await enterPresentation();
    onDismiss();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'color-mix(in srgb, var(--color-bg-pdf) 97%, transparent)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        // Scroll/click on the deck underneath passes through the backdrop.
        // Only the buttons below opt back in with pointer-events: auto.
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    >
      <div
        style={{
          fontSize: '14px',
          color: 'var(--color-gold)',
          letterSpacing: '0.3em',
          marginBottom: '48px',
          fontWeight: 700,
        }}
      >
        AEXS · AI EXECUTIVE SUITE
      </div>

      <div
        style={{
          fontSize: '22px',
          color: 'var(--color-white-1)',
          fontWeight: 700,
          marginBottom: '12px',
          textAlign: 'center',
        }}
      >
        Ready to present?
      </div>

      <div
        style={{
          fontSize: '14px',
          color: 'var(--color-white-3)',
          marginBottom: '40px',
          textAlign: 'center',
          maxWidth: '400px',
          lineHeight: 1.6,
        }}
      >
        Fullscreen mode hides browser toolbars and extension icons
        so investors see only the deck.
      </div>

      <button
        type="button"
        onClick={handlePresent}
        style={{
          background: 'var(--color-gold)',
          color: 'var(--color-bg)',
          border: 'none',
          padding: '16px 48px',
          fontSize: '15px',
          fontWeight: 700,
          borderRadius: '6px',
          cursor: 'pointer',
          marginBottom: '16px',
          letterSpacing: '0.05em',
          pointerEvents: 'auto',
        }}
      >
        ENTER FULLSCREEN PRESENTATION
      </button>

      <button
        type="button"
        onClick={onDismiss}
        style={{
          background: 'transparent',
          color: 'var(--color-white-4)',
          border: '1px solid var(--color-border-deck)',
          padding: '10px 24px',
          fontSize: '13px',
          borderRadius: '6px',
          cursor: 'pointer',
          pointerEvents: 'auto',
        }}
      >
        Skip — continue in browser ({countdown}s)
      </button>

      <div
        style={{
          position: 'absolute',
          bottom: '32px',
          fontSize: '11px',
          color: 'var(--color-white-4)',
          letterSpacing: '0.05em',
        }}
      >
        Press P at any time to enter fullscreen · Esc to exit
      </div>
    </div>
  );
}
