interface TrustSectionProps {
  onBookCall: () => void;
}

const STATS = [
  {
    value: '48 hours',
    label: 'From brief to live',
    description: 'You know the exact launch date before we start.',
  },
  {
    value: '$500',
    label: 'Flat price, agreed upfront',
    description: 'GST included. No surprise invoices or hidden extras.',
  },
  {
    value: '<1s',
    label: 'Loads fast on phones',
    description: 'Built mobile-first so visitors stay instead of leaving.',
  },
  {
    value: '100%',
    label: 'Yours to keep',
    description: 'You own the site, code, domain, and content.',
  },
];

export default function TrustSection({ onBookCall }: TrustSectionProps) {
  return (
    <section
      aria-labelledby="trust-section-heading"
      className="section-shell w-full bg-bg px-5 sm:px-8 lg:px-12 border-t border-border"
    >
      <div className="section-container">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow">Why businesses choose us</p>
            <h2
              id="trust-section-heading"
              className="mt-4 font-display text-3xl font-bold tracking-[-0.025em] leading-[1.1] text-text sm:text-4xl lg:text-[2.75rem]"
              style={{ textWrap: 'balance' }}
            >
              A website you don&apos;t have to chase, fix, or worry about.
            </h2>
          </div>

          <p className="max-w-sm text-sm leading-relaxed text-muted lg:text-right">
            Plain-English agreements, fixed local pricing, and every login handed to you at launch.
          </p>
        </div>

        {/* Hairline-divided 4-column architectural stat ledger */}
        <div className="mt-12 sm:mt-14 grid grid-cols-1 border-y border-border sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 lg:divide-x divide-border">
          {STATS.map((stat, idx) => (
            <div
              key={stat.label}
              className={`flex flex-col pt-5 pb-8 lg:pt-7 lg:pb-10 ${
                idx === 0
                  ? 'lg:pr-8'
                  : idx === STATS.length - 1
                    ? 'lg:pl-8'
                    : 'lg:px-8'
              } ${idx % 2 === 1 ? 'sm:pl-8 lg:pl-8' : 'sm:pr-8'}`}
            >
              <div className="font-display text-4xl sm:text-[2.75rem] font-extrabold tracking-[-0.04em] leading-none tabular-nums text-text">
                {stat.value}
              </div>
              <div
                aria-hidden="true"
                className="my-5 h-[2px] w-7 bg-accent"
              />
              <h3 className="font-display text-base font-bold tracking-[-0.015em] text-text">
                {stat.label}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {stat.description}
              </p>
            </div>
          ))}
        </div>

        {/* Revisions guarantee row */}
        <div className="mt-8 flex flex-col gap-6 rounded-card border border-border bg-surface p-7 sm:p-9 md:flex-row md:items-center md:justify-between lg:px-10 shadow-card">
          <div className="max-w-2xl">
            <h3 className="font-display text-xl sm:text-2xl font-bold tracking-[-0.02em] text-text">
              Unlimited revisions until you&apos;re happy.
            </h3>
            <p className="mt-1.5 text-base leading-relaxed text-muted">
              We keep refining every layout, word, and detail before launch. No extra charge, no awkward conversations.
            </p>
          </div>
          <button
            type="button"
            onClick={onBookCall}
            className="inline-flex w-full md:w-auto items-center justify-center rounded-button bg-btn-primary-bg px-6 py-3 text-sm font-medium text-btn-primary-text whitespace-nowrap shrink-0 transition-opacity hover:opacity-90 cursor-pointer"
          >
            Book a free call
          </button>
        </div>
      </div>
    </section>
  );
}
