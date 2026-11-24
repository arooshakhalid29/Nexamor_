import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import RevealOnScroll from './RevealOnScroll';

export default function DifferenceSection() {
  return (
    <section
      id="difference"
      aria-labelledby="difference-heading"
      className="section-shell scroll-mt-24 w-full bg-bg px-5 sm:px-8 lg:px-12 border-t border-border"
    >
      <RevealOnScroll>
        <div className="section-container">
          <div className="mx-auto max-w-[720px] text-center">
            <p className="eyebrow">WHY NEXAMOR</p>
            <h2
              id="difference-heading"
              className="mt-4 font-display text-3xl font-bold tracking-[-0.025em] leading-[1.12] text-text sm:text-4xl lg:text-[2.75rem]"
              style={{ textWrap: 'balance' }}
            >
              The Nexamor difference
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted sm:text-[17px]">
              Most small businesses are told a website takes weeks and costs thousands, and that
              every change costs extra. We do it differently. We build every website ourselves, here
              in Australia, with nothing outsourced. You pay one flat price, agreed in writing
              before we start, and your Starter website goes live in 48 hours. You talk to the
              person building it, you can ask for changes until you&apos;re happy, and when we
              finish, everything belongs to you.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-8">
              <Link
                to="/about#difference"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-text underline decoration-accent decoration-1 underline-offset-4 transition-colors hover:text-accent"
              >
                <span>Read more about it</span>
                <ArrowRight
                  aria-hidden="true"
                  className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5"
                />
              </Link>
              <Link
                to="/about#founder"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-text underline decoration-accent decoration-1 underline-offset-4 transition-colors hover:text-accent"
              >
                <span>Read the full story</span>
                <ArrowRight
                  aria-hidden="true"
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
