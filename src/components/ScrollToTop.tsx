import { useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import { focusContactHeading, getStickyHeaderOffset } from '../utils/scrollToContact';

function getDocumentTop(element: HTMLElement): number {
  let top = 0;
  let current: HTMLElement | null = element;
  while (current) {
    top += current.offsetTop;
    current = current.offsetParent as HTMLElement | null;
  }
  return top;
}

export default function ScrollToTop() {
  const location = useLocation();
  const navigationType = useNavigationType();

  const scrollPositionsRef = useRef<Map<string, number>>(new Map());
  const currentKeyRef = useRef<string>(location.key);
  const prevPathnameRef = useRef<string>(location.pathname);
  const prevSearchRef = useRef<string>(location.search);
  const isInitialMountRef = useRef<boolean>(true);

  // Disable browser's built-in scroll restoration and record scroll position per history key
  useEffect(() => {
    try {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
      }
    } catch {
      // Ignore if history.scrollRestoration is read-only
    }

    scrollPositionsRef.current.set(currentKeyRef.current, window.scrollY);

    const handleScroll = () => {
      scrollPositionsRef.current.set(currentKeyRef.current, window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useLayoutEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);

    const isSamePage =
      location.pathname === prevPathnameRef.current &&
      location.search === prevSearchRef.current;

    currentKeyRef.current = location.key;
    prevPathnameRef.current = location.pathname;
    prevSearchRef.current = location.search;

    // Initial load: only handle deep-link hash anchors cleanly
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      if (location.hash) {
        const targetId = decodeURIComponent(location.hash.slice(1));
        const rafId = window.requestAnimationFrame(() => {
          const target = document.getElementById(targetId);
          if (target) {
            const top = Math.max(0, getDocumentTop(target) - getStickyHeaderOffset());
            window.scrollTo({
              top,
              left: 0,
              behavior: prefersReducedMotion ? 'instant' : 'smooth',
            });
            if (targetId === 'contact') {
              focusContactHeading();
            }
          } else {
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
          }
        });
        return () => window.cancelAnimationFrame(rafId);
      }
      return;
    }

    // Browser back / forward: restore saved scroll position for this history entry
    if (navigationType === 'POP') {
      const savedY = scrollPositionsRef.current.get(location.key);
      if (savedY !== undefined) {
        window.scrollTo({ top: savedY, left: 0, behavior: 'instant' });
        const rafId = window.requestAnimationFrame(() => {
          window.scrollTo({ top: savedY, left: 0, behavior: 'instant' });
        });
        return () => window.cancelAnimationFrame(rafId);
      }
    }

    // Links with a section anchor (e.g. /pricing#website-plans, /about#our-story, /#contact)
    if (location.hash) {
      if (!isSamePage) {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }
      const targetId = decodeURIComponent(location.hash.slice(1));
      const rafId = window.requestAnimationFrame(() => {
        const target = document.getElementById(targetId);
        if (target) {
          const top = Math.max(0, getDocumentTop(target) - getStickyHeaderOffset());
          window.scrollTo({
            top,
            left: 0,
            behavior: prefersReducedMotion ? 'instant' : 'smooth',
          });
          if (targetId === 'contact') {
            focusContactHeading();
          }
        } else {
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        }
      });
      return () => window.cancelAnimationFrame(rafId);
    }

    // Clicking the logo or a link to the page already active: smooth scroll to top
    if (isSamePage && navigationType !== 'POP') {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: prefersReducedMotion ? 'instant' : 'smooth',
      });
      return;
    }

    // Standard route change: jump immediately to top before paint
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    scrollPositionsRef.current.set(location.key, 0);
  }, [location.key, location.pathname, location.search, location.hash, navigationType]);

  return null;
}
