import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Fullscreen presentation mode for investor demos.
 * Fullscreen hides browser toolbar, extension icons, tab bar, address bar.
 * OS notifications remain visible — presenter must enable Do Not Disturb.
 * Escape is browser-enforced; we sync state via the fullscreenchange event.
 */
export function usePresentationMode() {
  const [isPresenting, setIsPresenting] = useState(false);
  const cursorTimer = useRef(null);

  const enterPresentation = useCallback(async () => {
    try {
      await document.documentElement.requestFullscreen({ navigationUI: 'hide' });
      setIsPresenting(true);
    } catch (err) {
      // Fullscreen requires a user gesture — this is called from a button
      // click or keydown handler so it will always have one. If the browser
      // still denies (policy, iframe, etc), drop into the no-fullscreen
      // presenting state so the rest of the UX (cursor-hide, nav-lock) still
      // activates.
      console.warn('[presentation] Fullscreen request denied:', err.message);
      setIsPresenting(true);
    }
  }, []);

  const exitPresentation = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen();
    setIsPresenting(false);
  }, []);

  // Keep state in sync when the user presses Escape.
  useEffect(() => {
    const handleChange = () => {
      if (!document.fullscreenElement) setIsPresenting(false);
    };
    document.addEventListener('fullscreenchange', handleChange);
    return () => document.removeEventListener('fullscreenchange', handleChange);
  }, []);

  // P enters presentation mode from anywhere in the deck.
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key !== 'p' || isPresenting || e.metaKey || e.ctrlKey) return;
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      enterPresentation();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isPresenting, enterPresentation]);

  // Auto-hide cursor after 3s of inactivity while presenting.
  useEffect(() => {
    if (!isPresenting) {
      document.body.style.cursor = '';
      return;
    }
    const resetTimer = () => {
      document.body.style.cursor = 'default';
      clearTimeout(cursorTimer.current);
      cursorTimer.current = setTimeout(() => {
        document.body.style.cursor = 'none';
      }, 3000);
    };
    document.addEventListener('mousemove', resetTimer);
    resetTimer();
    return () => {
      document.removeEventListener('mousemove', resetTimer);
      clearTimeout(cursorTimer.current);
      document.body.style.cursor = '';
    };
  }, [isPresenting]);

  // Block reload / close / new-tab / address-bar shortcuts during demo.
  useEffect(() => {
    if (!isPresenting) return;
    const preventNav = (e) => {
      const k = e.key.toLowerCase();
      const blocked =
        (e.metaKey && ['r', 'w', 't', 'l'].includes(k)) ||
        (e.ctrlKey && ['r', 'w', 't', 'l'].includes(k)) ||
        e.key === 'F5';
      if (blocked) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    document.addEventListener('keydown', preventNav, true);
    return () => document.removeEventListener('keydown', preventNav, true);
  }, [isPresenting]);

  return { isPresenting, enterPresentation, exitPresentation };
}
