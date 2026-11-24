import { Link } from 'react-router-dom';
import {
  Boxes,
  CalendarCheck,
  FilePlus2,
  Palette,
  ShieldCheck,
  ShoppingBag,
  type LucideIcon,
} from 'lucide-react';
import RevealOnScroll from './RevealOnScroll';

interface NotIncludedItem {
  icon: LucideIcon;
  lead: string;
  detail: string;
}

const NOT_INCLUDED_ITEMS: NotIncludedItem[] = [
  {
    icon: FilePlus2,
    lead: 'More than 5 pages.',
    detail: 'Extra pages are priced on a free call and agreed in writing first.',
  },
  {
    icon: Boxes,
    lead: 'Animation and 3D.',
    detail: 'Our Showcase website, from $700.',
  },
  {
    icon: CalendarCheck,
    lead: 'Industry rules and booking tools.',
    detail: 'Our Industry Specialist website, from $1,500.',
  },
  {
    icon: ShoppingBag,
    lead: 'An online store.',
    detail: 'From $700, built on your own store account.',
  },
  {
    icon: Palette,
    lead: 'A logo.',
    detail: '$199, delivered within 48 hours.',
  },
  {
    icon: ShieldCheck,
    lead: 'Ongoing care.',
    detail: "Optional, from $49 a month. Cancel any month with 14 days' notice.",
  },
];

export default function NotIncludedSection() {
  return (
    <section
      id="not-included"
      aria-labelledby="not-included-heading"
      className="section-shell w-full bg-bg px-5 sm:px-8 lg:px-12 border-t border-border"
    >
      <RevealOnScroll>
        <div className="section-container">
          <div className="max-w-2xl">
            <h2
              id="not-included-heading"
              className="font-display text-3xl font-bold tracking-[-0.02em] leading-[1.12] text-text sm:text-4xl"
              style={{ textWrap: 'balance' }}
            >
              What the $500 doesn&apos;t cover
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted">
              We keep the $500 price simple. Here&apos;s what costs extra, so there are no
              surprises.
            </p>
          </div>

          <div className="mt-10 rounded-card border border-border bg-surface p-7 sm:p-9 shadow-card">
            <ul className="grid grid-cols-1 gap-x-10 gap-y-6 md:grid-cols-2">
              {NOT_INCLUDED_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <li
                    key={item.lead}
                    className="flex items-start gap-3.5 text-sm leading-relaxed sm:text-base"
                  >
                    <Icon
                      aria-hidden="true"
                      strokeWidth={1.75}
                      className="mt-1 h-4 w-4 shrink-0 text-accent"
                    />
                    <span>
                      <strong className="font-semibold text-text">{item.lead}</strong>{' '}
                      <span className="text-muted">{item.detail}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          <p className="mt-6 text-sm text-muted">
            Everything else on this page is included in your $500.{' '}
            <Link
              to="#whats-included"
              className="link-underline font-medium text-text hover:text-accent"
            >
              See what&apos;s included
            </Link>
          </p>
        </div>
      </RevealOnScroll>
    </section>
  );
}
