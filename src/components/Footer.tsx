import { Link } from 'react-router-dom';
import { Map as MapIcon } from 'lucide-react';

const SERVICE_LINKS = [
  { label: 'Starter website', to: '/pricing#website-plans' },
  { label: 'Showcase website', to: '/pricing#website-plans' },
  { label: 'Industry Specialist website', to: '/pricing#website-plans' },
  { label: 'Online store', to: '/pricing#extras' },
  { label: 'Logo design', to: '/pricing#extras' },
  { label: 'Care plans', to: '/pricing#care-plans' },
];

export default function Footer() {

  return (
    <footer className="w-full bg-surface border-t border-border py-16 sm:py-20 px-5 sm:px-8 lg:px-12">
      <div className="section-container">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-12">
          {/* Left Column */}
          <div className="lg:col-span-5">
            <Link
              to="/"
              className="inline-block font-display text-xl font-extrabold tracking-tight text-text whitespace-nowrap transition-opacity hover:opacity-80"
              aria-label="Nexamor Home"
            >
              Nexamor
            </Link>

            <p className="mt-3 flex items-center gap-2 text-sm text-muted">
              <MapIcon aria-hidden="true" strokeWidth={1.75} className="h-4 w-4 shrink-0 text-muted" />
              <span>Built in Australia, for people who run their own business.</span>
            </p>

            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
              Simple, fast websites for small businesses. Flat prices, unlimited revisions, and you
              own everything.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              <div>
                <p className="eyebrow">BASED IN</p>
                <p className="mt-1.5 text-sm text-text">Australia</p>
              </div>
              <div>
                <p className="eyebrow">EMAIL</p>
                <p className="mt-1.5 text-sm text-text">
                  <a
                    href="mailto:nexamor1@gmail.com"
                    className="link-underline text-text hover:text-accent"
                  >
                    nexamor1@gmail.com
                  </a>
                </p>
              </div>
              <div>
                <p className="eyebrow">PHONE</p>
                <p className="mt-1.5 text-sm text-text tabular-nums">
                  <a
                    href="tel:+61435758455"
                    className="link-underline text-text hover:text-accent"
                  >
                    0435 758 455
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Right Link Column 1: SERVICES */}
          <div className="lg:col-span-3">
            <h3 className="eyebrow">SERVICES</h3>
            <ul className="mt-4 space-y-3">
              {SERVICE_LINKS.map((service) => (
                <li key={service.label}>
                  <Link
                    to={service.to}
                    className="link-underline text-sm text-muted hover:text-text"
                  >
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Link Column 2: COMPANY */}
          <div className="lg:col-span-2">
            <h3 className="eyebrow">COMPANY</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  to="/pricing"
                  className="link-underline text-sm text-muted hover:text-text"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  to="/growth"
                  className="link-underline text-sm text-muted hover:text-text"
                >
                  Growth
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="link-underline text-sm text-muted hover:text-text"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/start"
                  className="link-underline text-sm text-muted hover:text-text"
                >
                  Start a project
                </Link>
              </li>
            </ul>
          </div>

          {/* Right Link Column 3: LEGAL */}
          <div className="lg:col-span-2">
            <h3 className="eyebrow">LEGAL</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  to="/privacy"
                  className="link-underline text-sm text-muted hover:text-text"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="link-underline text-sm text-muted hover:text-text"
                >
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col gap-3 border-t border-border pt-8 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; 2026 Nexamor. Made in Australia. Nothing outsourced.</p>
        </div>
      </div>
    </footer>
  );
}
