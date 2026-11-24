export function getStickyHeaderOffset(): number {
  if (typeof document === 'undefined') return 80;
  const header = document.querySelector('header');
  const headerHeight = header ? header.getBoundingClientRect().height : 64;
  return headerHeight + 16;
}

export function focusContactHeading(): void {
  if (typeof document === 'undefined') return;
  const heading = document.getElementById('contact-heading');
  if (!heading) return;
  if (!heading.hasAttribute('tabindex')) {
    heading.setAttribute('tabindex', '-1');
  }
  heading.focus({ preventScroll: true });
}

export function scrollToContactSection(): boolean {
  if (typeof document === 'undefined') return false;
  const target = document.getElementById('contact');
  if (!target) return false;

  const offset = getStickyHeaderOffset();
  const top = Math.max(
    0,
    target.getBoundingClientRect().top + window.scrollY - offset
  );
  const prefersReducedMotion = Boolean(
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  );

  if (window.location.hash !== '#contact') {
    window.history.pushState(
      window.history.state,
      '',
      `${window.location.pathname}${window.location.search}#contact`
    );
  }

  window.scrollTo({
    top,
    left: 0,
    behavior: prefersReducedMotion ? 'instant' : 'smooth',
  });

  focusContactHeading();
  return true;
}
