import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import RevealOnScroll from './RevealOnScroll';

export default function FounderNoteSection() {
  return (
    <section
      aria-labelledby="founder-note-heading"
      className="section-shell w-full bg-bg px-5 sm:px-8 lg:px-12 border-t border-border"
    >
      <RevealOnScroll>
        <div className="section-container">
          <div className="grid grid-cols-1 items-center gap-10 sm:gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Illustration on LEFT on desktop, TOP on mobile */}
            <div className="order-1 flex justify-center">
              <img
                src="/assets/aistudio/Gemini_Generated_Image_rp65ofrp65ofrp65__1__bdd71643.jpeg"
                alt="Illustration of Danesh, founder of Nexamor"
                referrerPolicy="no-referrer"
                className="block w-full max-w-[480px] h-auto mix-blend-multiply"
              />
            </div>

            {/* Text on RIGHT on desktop, BOTTOM on mobile */}
            <div className="order-2">
              <p className="eyebrow">Why we started this</p>
              <h2
                id="founder-note-heading"
                className="mt-4 font-display text-3xl font-bold tracking-[-0.025em] leading-[1.12] text-text sm:text-4xl lg:text-[2.5rem]"
                style={{ textWrap: 'balance' }}
              >
                Websites shouldn&apos;t be stressful, slow, or held by someone else.
              </h2>

              <p className="mt-5 text-base leading-relaxed text-muted">
                Too many business owners get burned. A freelancer disappears. An agency keeps the
                passwords. A site breaks and nobody can fix it. We built Nexamor to be the
                simple alternative: one clear price, a clear plan, and everything in your name.
                Want us to look after the site afterwards? We can. Don&apos;t want that?
                You&apos;ll never be chased, and your website keeps working.
              </p>

              <p className="mt-6 text-sm font-medium text-text">Danesh · Founder, Nexamor</p>

              <div className="mt-6">
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
        </div>
      </RevealOnScroll>
    </section>
  );
}
