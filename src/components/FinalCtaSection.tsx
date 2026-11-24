import { Link } from 'react-router-dom';
import { ArrowRight, Phone } from 'lucide-react';
import RevealOnScroll from './RevealOnScroll';

interface FinalCtaSectionProps {
  sectionBg?: 'bg-bg' | 'bg-surface-alt';
}

export default function FinalCtaSection({ sectionBg = 'bg-bg' }: FinalCtaSectionProps) {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className={`section-shell scroll-mt-24 w-full ${sectionBg} px-5 sm:px-8 lg:px-12 border-t border-border`}
    >
      <RevealOnScroll>
        <div className="section-container">
          <div className="rounded-card border border-border bg-surface p-8 sm:p-12 lg:p-14 shadow-card">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
              {/* Left side: text */}
              <div className="max-w-xl">
                <h2
                  id="contact-heading"
                  tabIndex={-1}
                  className="font-display text-3xl font-bold tracking-[-0.025em] leading-[1.12] text-text sm:text-4xl focus:outline-none"
                  style={{ textWrap: 'balance' }}
                >
                  Ready to start?
                </h2>
                <p className="mt-4 text-base leading-relaxed text-muted">
                  Fill the brief in a minute and we&apos;ll reply same day, usually within 90
                  minutes. Prefer to talk first? Book a free 30-minute call or just give us a
                  ring.
                </p>
              </div>

              {/* Right side: three buttons */}
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:self-end lg:shrink-0 lg:items-end">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                  <Link
                    to="/start#brief"
                    className="group inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-button bg-btn-primary-bg px-6 py-3.5 text-sm font-medium text-btn-primary-text whitespace-nowrap transition-opacity hover:opacity-90"
                  >
                    <span>Start your project</span>
                    <ArrowRight
                      aria-hidden="true"
                      strokeWidth={1.75}
                      className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5"
                    />
                  </Link>

                  <Link
                    to="/start#call"
                    className="inline-flex w-full sm:w-auto items-center justify-center rounded-button border border-border bg-transparent px-6 py-3.5 text-sm font-medium text-text whitespace-nowrap transition-colors hover:border-text hover:bg-surface-alt"
                  >
                    Book a call
                  </Link>
                </div>

                <a
                  href="tel:0435758455"
                  className="inline-flex w-full sm:w-auto sm:self-end items-center justify-center gap-2 rounded-button border border-border bg-transparent px-6 py-3.5 text-sm font-medium text-text tabular-nums whitespace-nowrap transition-colors hover:border-text hover:bg-surface-alt"
                >
                  <Phone aria-hidden="true" strokeWidth={1.75} className="h-4 w-4" />
                  <span>Call 0435 758 455</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </RevealOnScroll>
    </section>
  );
}
