import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import RevealOnScroll from './RevealOnScroll';

export default function GoodToKnowSection() {
  return (
    <section
      id="good-to-know"
      aria-labelledby="good-to-know-heading"
      className="section-shell w-full bg-bg px-5 sm:px-8 lg:px-12 border-t border-border"
    >
      <RevealOnScroll>
        <div className="section-container">
          <div className="mx-auto max-w-3xl rounded-card border border-border bg-surface p-7 sm:p-9 shadow-card">
            <h2
              id="good-to-know-heading"
              className="font-display text-2xl font-bold tracking-[-0.02em] leading-[1.15] text-text sm:text-3xl"
              style={{ textWrap: 'balance' }}
            >
              Good to know before you start
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted">
              Your $500 Starter website has 5 pages. A few things cost extra: more pages,
              animation, an online store, a logo, and optional ongoing care. We list every one of
              them, with prices, on our pricing page.
            </p>
            <div className="mt-6">
              <Link
                to="/pricing#not-included"
                className="group link-underline inline-flex items-center gap-2 text-sm font-semibold text-text hover:text-accent"
              >
                <span>See exactly what costs extra</span>
                <ArrowRight
                  aria-hidden="true"
                  strokeWidth={1.75}
                  className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5"
                />
              </Link>
            </div>
          </div>
        </div>
      </RevealOnScroll>
    </section>
  );
}
