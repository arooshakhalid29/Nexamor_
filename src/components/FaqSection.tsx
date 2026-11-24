import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import RevealOnScroll from './RevealOnScroll';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "$500 sounds too cheap. What's the catch?",
    answer:
      "There isn't one. Modern tools mean a simple website no longer takes weeks of work, and we pass that saving on to you. You get a professionally designed 5-page site at a fair flat price, with no hidden fees.",
  },
  {
    question: 'Who owns my website?',
    answer:
      'You do. When we finish, we hand over everything: the design, the files, and the logins. Nothing is held back, and you can take it anywhere.',
  },
  {
    question: 'Can I update it myself without any tech skills?',
    answer:
      "Yes. You edit text and images the way you'd edit a Word document. We also record a short video showing you how.",
  },
  {
    question: 'What if I want changes after launch?',
    answer:
      "Unlimited revisions are included until you're happy. After launch, you can ask us for changes anytime or choose a care plan.",
  },
  {
    question: 'Can I cancel the care plan?',
    answer:
      'Yes, anytime. No contracts, no penalties. Your website keeps working either way.',
  },
  {
    question: 'Do you work with my type of business?',
    answer:
      "Almost certainly. We build for trades, clinics, restaurants, online stores, consultants, and more. If you're not sure, just ask.",
  },
  {
    question: 'Can you help me get customers, not just build the site?',
    answer:
      "Yes. We can set up your site so people find you on Google, and help with ads and social media when you're ready.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleIndex = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section
      aria-labelledby="faq-section-heading"
      className="section-shell w-full bg-surface-alt px-5 sm:px-8 lg:px-12 border-t border-border"
    >
      <RevealOnScroll>
        <div className="mx-auto max-w-[760px] text-left">
          <h2
            id="faq-section-heading"
            className="font-display text-3xl font-bold tracking-[-0.02em] leading-[1.12] text-text sm:text-4xl lg:text-[2.5rem]"
          >
            Questions we get asked a lot.
          </h2>
          <p className="mt-3 text-[13.5px] text-muted">
            Can&apos;t find your question? Just call or email.
          </p>

          <div className="mt-10 divide-y divide-border border-y border-border">
            {FAQ_ITEMS.map((item, index) => {
              const isOpen = openIndex === index;
              const buttonId = `faq-button-${index}`;
              const panelId = `faq-panel-${index}`;

              return (
                <div key={item.question}>
                  <h3>
                    <button
                      type="button"
                      id={buttonId}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => toggleIndex(index)}
                      className="flex w-full items-center justify-between gap-6 py-5 sm:py-6 text-left text-base sm:text-lg font-semibold tracking-[-0.01em] text-text transition-colors hover:text-accent cursor-pointer"
                    >
                      <span>{item.question}</span>
                      <ChevronDown
                        aria-hidden="true"
                        className={`h-5 w-5 shrink-0 text-muted transition-transform duration-200 ease-out ${
                          isOpen ? 'rotate-180 text-text' : 'rotate-0'
                        }`}
                      />
                    </button>
                  </h3>

                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out ${
                      isOpen
                        ? 'grid-rows-[1fr] opacity-100'
                        : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="pb-6 pr-8 text-sm sm:text-base leading-relaxed text-muted">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </RevealOnScroll>
    </section>
  );
}
