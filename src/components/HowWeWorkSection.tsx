import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';

interface HowWeWorkSectionProps {
  onSeeHowItWorks: () => void;
}

const ROW_ONE_POINTS = [
  {
    lead: 'Talk in plain English.',
    detail: 'You describe the business. We handle the rest.',
  },
  {
    lead: 'Clear updates.',
    detail: "You always know what's done and what's next.",
  },
  {
    lead: 'One person to talk to.',
    detail: 'No ticket systems, no passing you around.',
  },
];

const ROW_TWO_POINTS = [
  {
    lead: 'Your website, your name.',
    detail: 'Everything is set up under your ownership, not ours.',
  },
  {
    lead: 'Nothing held back.',
    detail: 'Design, content, and files are all handed over at launch.',
  },
  {
    lead: 'Leave anytime.',
    detail: 'No lock-in contracts and no penalties.',
  },
];

const ROW_THREE_POINTS = [
  {
    lead: 'Made in Australia.',
    detail: 'Built here for Australian small businesses, with prices in AUD and GST included.',
  },
  {
    lead: 'Nothing outsourced.',
    detail: 'We build your website ourselves, from your first message to launch day.',
  },
  {
    lead: 'A real person to talk to.',
    detail: "Call or email any time and you'll reach the person building your site.",
  },
  {
    lead: 'Your business, understood.',
    detail: 'We know how Australian customers search, shop, and choose a local business.',
  },
];

export default function HowWeWorkSection({ onSeeHowItWorks }: HowWeWorkSectionProps) {
  return (
    <section
      aria-labelledby="how-we-work-heading"
      className="section-shell w-full bg-bg px-5 sm:px-8 lg:px-12 border-t border-border"
    >
      <div className="section-container space-y-20 sm:space-y-24 lg:space-y-28">
        {/* Row 1: Text on LEFT, Illustration on RIGHT (Illustration on top on mobile) */}
        <div className="grid grid-cols-1 items-center gap-10 sm:gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="order-2 lg:order-1">
            <p className="eyebrow">01 · How we work</p>
            <h2
              id="how-we-work-heading"
              className="mt-4 font-display text-3xl font-bold tracking-[-0.025em] leading-[1.12] text-text sm:text-4xl lg:text-[2.5rem]"
              style={{ textWrap: 'balance' }}
            >
              You run the business. We handle the website.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted">
              You don&apos;t need to know anything about websites. Tell us what your business does
              and who your customers are, and we turn that into a site that works. No technical
              questions, no confusing jargon, no chasing us for updates.
            </p>

            <ul className="mt-7 space-y-3.5 text-sm leading-relaxed sm:text-base">
              {ROW_ONE_POINTS.map((item) => (
                <li key={item.lead} className="flex items-start gap-3">
                  <Check
                    aria-hidden="true"
                    className="mt-1 h-4 w-4 shrink-0 text-accent"
                  />
                  <span>
                    <strong className="font-semibold text-text">{item.lead}</strong>{' '}
                    <span className="text-muted">{item.detail}</span>
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <button
                type="button"
                onClick={onSeeHowItWorks}
                className="group inline-flex items-center gap-2 text-sm font-semibold text-text underline decoration-accent decoration-1 underline-offset-4 transition-colors hover:text-accent cursor-pointer"
              >
                <span>See how it works</span>
                <ArrowRight
                  aria-hidden="true"
                  className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5"
                />
              </button>
            </div>
          </div>

          <div className="order-1 flex justify-center lg:order-2">
            <img
              src="/assets/aistudio/Gemini_Generated_Image_36vdth36vdth36vd_28cf6d1a.jpeg"
              alt="Two people talking over coffee about a business"
              referrerPolicy="no-referrer"
              className="block w-full max-w-[520px] h-auto mix-blend-multiply"
            />
          </div>
        </div>

        {/* Row 2: Illustration on LEFT, Text on RIGHT (Illustration on top on mobile) */}
        <div className="grid grid-cols-1 items-center gap-10 sm:gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="order-1 flex justify-center">
            <img
              src="/assets/aistudio/Gemini_Generated_Image_u6m96hu6m96hu6m9_4c0d25d6.jpeg"
              alt="Three people planning a website on a whiteboard"
              referrerPolicy="no-referrer"
              className="block w-full max-w-[520px] h-auto mix-blend-multiply"
            />
          </div>

          <div className="order-2">
            <p className="eyebrow">02 · Yours to keep</p>
            <h2
              className="mt-4 font-display text-3xl font-bold tracking-[-0.025em] leading-[1.12] text-text sm:text-4xl lg:text-[2.5rem]"
              style={{ textWrap: 'balance' }}
            >
              Your website is yours. Full stop.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted">
              When we finish, everything is handed over to you. If you ever want to work with
              someone else, you can take it all with you. No fees to get it back, no waiting, no
              awkward conversations.
            </p>

            <ul className="mt-7 space-y-3.5 text-sm leading-relaxed sm:text-base">
              {ROW_TWO_POINTS.map((item) => (
                <li key={item.lead} className="flex items-start gap-3">
                  <Check
                    aria-hidden="true"
                    className="mt-1 h-4 w-4 shrink-0 text-accent"
                  />
                  <span>
                    <strong className="font-semibold text-text">{item.lead}</strong>{' '}
                    <span className="text-muted">{item.detail}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Row 3: Text on LEFT, Australia map illustration on RIGHT (Illustration on top on mobile) */}
        <div
          id="australia"
          aria-labelledby="australia-heading"
          className="scroll-mt-24 grid grid-cols-1 items-center gap-10 sm:gap-12 lg:grid-cols-2 lg:gap-16"
        >
          <div className="order-2 lg:order-1">
            <p className="eyebrow">03 · Built in Australia</p>
            <h2
              id="australia-heading"
              className="mt-4 font-display text-3xl font-bold tracking-[-0.025em] leading-[1.12] text-text sm:text-4xl lg:text-[2.5rem]"
              style={{ textWrap: 'balance' }}
            >
              Built in Australia, for Australian businesses.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted">
              Nexamor is an Australian web business. We build every website ourselves, here in
              Australia, with nothing outsourced. When you work with us, you talk to a real person,
              not a call centre or a ticket system.
            </p>

            <ul className="mt-7 space-y-3.5 text-sm leading-relaxed sm:text-base">
              {ROW_THREE_POINTS.map((item) => (
                <li key={item.lead} className="flex items-start gap-3">
                  <Check
                    aria-hidden="true"
                    className="mt-1 h-4 w-4 shrink-0 text-accent"
                  />
                  <span>
                    <strong className="font-semibold text-text">{item.lead}</strong>{' '}
                    <span className="text-muted">{item.detail}</span>
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-8">
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

          <div className="order-1 flex justify-center lg:order-2">
            <img
              src="/assets/aistudio/Gemini_Generated_Image_iwwiw2iwwiw2iwwi_da6b6fde.jpeg"
              alt="Map of Australia showing every state and territory"
              width={1200}
              height={896}
              loading="lazy"
              className="block w-full max-w-[480px] h-auto mix-blend-multiply"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
