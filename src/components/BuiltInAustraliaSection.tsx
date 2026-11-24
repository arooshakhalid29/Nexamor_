import { Link } from 'react-router-dom';
import { ArrowRight, Compass, MapPin, Phone, Wrench, type LucideIcon } from 'lucide-react';
import RevealOnScroll from './RevealOnScroll';

interface AustraliaCard {
  icon: LucideIcon;
  title: string;
  description: string;
}

const AUSTRALIA_CARDS: AustraliaCard[] = [
  {
    icon: MapPin,
    title: 'Made in Australia',
    description:
      'Built here for Australian small businesses, with prices in AUD and GST included.',
  },
  {
    icon: Wrench,
    title: 'Nothing outsourced',
    description:
      'We build your website ourselves, from your first message to launch day.',
  },
  {
    icon: Phone,
    title: 'A real person to talk to',
    description:
      "Call or email any time and you'll reach the person building your site.",
  },
  {
    icon: Compass,
    title: 'Your business, understood',
    description:
      'We know how Australian customers search, shop, and choose a local business.',
  },
];

export default function BuiltInAustraliaSection() {
  return (
    <section
      id="australia"
      aria-labelledby="australia-heading"
      className="section-shell w-full bg-bg px-5 sm:px-8 lg:px-12 border-t border-border"
    >
      <RevealOnScroll>
        <div className="section-container">
          <div className="grid grid-cols-1 items-start gap-10 sm:gap-12 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-5">
              <p className="eyebrow">WHY NEXAMOR</p>
              <h2
                id="australia-heading"
                className="mt-4 font-display text-3xl font-bold tracking-[-0.025em] leading-[1.12] text-text sm:text-4xl lg:text-[2.5rem]"
                style={{ textWrap: 'balance' }}
              >
                Built in Australia, for Australian businesses.
              </h2>
              <p className="mt-5 text-base leading-relaxed text-muted">
                Nexamor is an Australian web business. We build every website ourselves, here in
                Australia, with nothing outsourced. When you work with us, you talk to a real
                person, not a call centre or a ticket system.
              </p>
            </div>

            <div className="lg:col-span-7">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {AUSTRALIA_CARDS.map((card) => {
                  const Icon = card.icon;
                  return (
                    <div
                      key={card.title}
                      className="flex flex-col rounded-card border border-border bg-surface p-6 sm:p-7 shadow-card"
                    >
                      <Icon
                        aria-hidden="true"
                        strokeWidth={1.75}
                        className="h-5 w-5 text-accent"
                      />
                      <h3 className="mt-4 font-display text-base font-bold tracking-[-0.015em] text-text">
                        {card.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted">
                        {card.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-7">
                <Link
                  to="/about#built-in-australia"
                  className="group inline-flex items-center gap-2 text-sm font-semibold text-text underline decoration-accent decoration-1 underline-offset-4 transition-colors hover:text-accent"
                >
                  <span>Read more about us</span>
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
