import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Home', to: '/' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'Growth', to: '/growth' },
  { label: 'About', to: '/about' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-colors duration-200 ${
          scrolled
            ? 'bg-bg/85 backdrop-blur-md border-b border-border'
            : 'bg-bg border-b border-transparent'
        }`}
      >
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-8 px-5 sm:px-8 lg:px-12">
          {/* Left: Wordmark */}
          <Link
            to="/"
            className="font-display text-xl font-extrabold tracking-tight text-text whitespace-nowrap shrink-0 transition-opacity hover:opacity-80"
            aria-label="Nexamor Home"
          >
            Nexamor
          </Link>

          {/* Center: Desktop navigation links */}
          <nav
            aria-label="Primary navigation"
            className="hidden min-[900px]:flex items-center gap-8"
          >
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `group relative py-1 text-sm font-medium whitespace-nowrap shrink-0 transition-colors duration-200 ${
                    isActive ? 'text-text' : 'text-muted hover:text-text'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>{item.label}</span>
                    <span
                      aria-hidden="true"
                      className={`absolute inset-x-0 bottom-0 h-[1.5px] bg-text origin-left transition-transform duration-200 ease-out ${
                        isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                      }`}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Right: Compact mobile/desktop CTA & Mobile hamburger */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="group relative">
              <Link
                to="/start"
                onClick={() => setMobileMenuOpen(false)}
                aria-describedby="header-contact-tooltip"
                className="inline-flex min-h-[44px] min-[900px]:min-h-0 items-center justify-center rounded-button bg-btn-primary-bg px-4 min-[900px]:px-5 min-[900px]:py-2.5 text-[14px] font-medium text-btn-primary-text whitespace-nowrap shrink-0 hover:opacity-90"
              >
                Get in touch
              </Link>
              <span
                id="header-contact-tooltip"
                role="tooltip"
                className="pointer-events-none invisible hidden min-[900px]:block opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-150 motion-reduce:transition-none absolute right-0 top-full mt-2 whitespace-nowrap rounded-lg border border-border bg-text px-2.5 py-1 text-[12px] font-normal text-surface shadow-sm"
              >
                We reply within one business day.
              </span>
            </div>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              className="inline-flex h-11 w-11 items-center justify-center rounded-button text-text transition-colors hover:bg-surface-alt min-[900px]:hidden cursor-pointer"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile full-screen slide-down menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: '-100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '-100%' }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-30 flex flex-col justify-between bg-bg px-6 pt-24 pb-10 min-[900px]:hidden"
          >
            <nav aria-label="Mobile navigation" className="flex flex-col gap-2">
              {NAV_ITEMS.map((item, idx) => (
                <motion.div
                  key={item.to}
                  initial={{ opacity: 0, y: -12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + idx * 0.04, duration: 0.25 }}
                >
                  <NavLink
                    to={item.to}
                    end={item.to === '/'}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `inline-flex min-h-[48px] items-center font-display text-3xl font-bold tracking-tight transition-colors ${
                        isActive
                          ? 'text-text underline decoration-2 underline-offset-8'
                          : 'text-muted hover:text-text'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                </motion.div>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.25 }}
              className="pt-6 border-t border-border"
            >
              <Link
                to="/start"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full rounded-button bg-btn-primary-bg px-6 py-4 text-center text-base font-medium text-btn-primary-text hover:opacity-90"
              >
                Get in touch
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
