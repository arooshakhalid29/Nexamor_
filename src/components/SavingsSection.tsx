import RevealOnScroll from './RevealOnScroll';

const SAVINGS_CARDS = [
  {
    value: '$500',
    label: 'Our flat price',
  },
  {
    value: '$1,500 to $5,000',
    label: 'Typical agency price',
  },
  {
    value: '$1,000 to $4,500',
    label: 'What you save',
  },
];

export default function SavingsSection() {
  return (
    <section
      id="savings"
      aria-labelledby="savings-heading"
      className="section-shell w-full bg-surface-alt px-5 sm:px-8 lg:px-12 border-t border-border"
    >
      <RevealOnScroll>
        <div className="section-container">
          <div className="max-w-2xl">
            <h2
              id="savings-heading"
              className="font-display text-3xl font-bold tracking-[-0.025em] leading-[1.12] text-text sm:text-4xl lg:text-[2.75rem]"
              style={{ textWrap: 'balance' }}
            >
              How much you save
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted">
              Websites like this typically cost $1,500 to $5,000 from an agency. With Nexamor
              it&apos;s $500, one time. That means you keep between $1,000 and $4,500.
            </p>
          </div>

          <div className="mt-10 sm:mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {SAVINGS_CARDS.map((card) => (
              <div
                key={card.label}
                className="flex flex-col rounded-card border border-border bg-surface p-7 sm:p-8 shadow-card"
              >
                <div className="font-display text-2xl sm:text-3xl lg:text-[2.125rem] font-extrabold tracking-[-0.03em] leading-tight tabular-nums text-text">
                  {card.value}
                </div>
                <div aria-hidden="true" className="my-5 h-[2px] w-7 bg-accent" />
                <p className="font-display text-base font-bold tracking-[-0.015em] text-text">
                  {card.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </RevealOnScroll>
    </section>
  );
}
