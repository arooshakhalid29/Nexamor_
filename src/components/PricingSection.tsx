import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import RevealOnScroll from './RevealOnScroll';

interface PricingSectionProps {
  onSelectPlan: (note: string) => void;
}

interface PricingPlan {
  id: string;
  name: string;
  prefix?: string;
  basePrice: number;
  forText: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
}

const PLANS: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    basePrice: 500,
    forText: 'New businesses that need to look credible fast.',
    features: [
      '5 pages',
      'Live in 48 hours',
      'Mobile friendly',
      'You own everything',
      'Unlimited revisions',
    ],
    cta: 'Get started',
  },
  {
    id: 'growth',
    name: 'Growth',
    prefix: 'from',
    basePrice: 700,
    forText: 'Brands that want to stand out from competitors.',
    features: [
      'Everything in Starter',
      'Animated or 3D design touches',
      'Custom look for your industry',
      'Up to 10 pages',
      'Priority support',
    ],
    cta: 'Get started',
    highlighted: true,
  },
  {
    id: 'online-store',
    name: 'Online Store',
    prefix: 'from',
    basePrice: 1500,
    forText: 'Businesses selling products online.',
    features: [
      'Custom store design',
      'Product and payment setup',
      'Up to 15 pages',
      'Unlimited revisions',
      'You own everything',
    ],
    cta: 'Talk to us',
  },
];

const LOGO_FEATURES = [
  '3 logo versions',
  'All file formats',
  'Colour and font choices',
  'Delivered within 48 hours',
  'You own the source files',
];

const CARE_FEATURES = [
  'Hosting included',
  'Daily backups',
  'Security updates',
  'Alerts if your website goes down',
  'First month free with every new website',
];

function formatAud(amount: number): string {
  return `$${amount.toLocaleString('en-AU')}`;
}

export default function PricingSection({ onSelectPlan }: PricingSectionProps) {
  const buildPlanNote = (plan: PricingPlan) => {
    const prefixText = plan.prefix ? `${plan.prefix} ` : '';
    return `I am interested in the ${plan.name} plan (${prefixText}${formatAud(plan.basePrice)}).`;
  };

  return (
    <section
      aria-labelledby="pricing-section-heading"
      className="section-shell w-full bg-surface-alt px-5 sm:px-8 lg:px-12 border-t border-border"
    >
      <RevealOnScroll>
        <div className="section-container">
          {/* Header */}
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Simple pricing</p>
            <h2
              id="pricing-section-heading"
              className="mt-4 font-display text-3xl font-bold tracking-[-0.025em] leading-[1.12] text-text sm:text-4xl lg:text-[2.75rem]"
              style={{ textWrap: 'balance' }}
            >
              One price. No surprises.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted">
              Pick a plan, we build it, you own it. No retainers, no hidden fees.
            </p>
          </div>

          {/* Main 3 plan cards */}
          <div className="mt-12 sm:mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-stretch">
            {PLANS.map((plan) => {
              const isHighlighted = Boolean(plan.highlighted);

              return (
                <div
                  key={plan.id}
                  className={`flex flex-col rounded-card bg-surface ${
                    isHighlighted
                      ? 'plan-card-accent border-[1.5px] border-accent p-8 sm:p-9 shadow-highlight'
                      : 'plan-card border border-border p-7 sm:p-8 shadow-card'
                  }`}
                >
                  <div>
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="font-display text-lg font-bold tracking-[-0.02em] text-text">
                        {plan.name}
                      </h3>
                      {isHighlighted && (
                        <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-accent whitespace-nowrap">
                          Most popular
                        </span>
                      )}
                    </div>

                    <div className="mt-4 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                      {plan.prefix && (
                        <span className="text-sm font-medium text-muted">
                          {plan.prefix}
                        </span>
                      )}
                      <span className="font-display text-4xl sm:text-[3rem] font-extrabold tracking-[-0.04em] leading-none tabular-nums text-text">
                        {formatAud(plan.basePrice)}
                      </span>
                    </div>

                    <p className="mt-4 text-sm leading-relaxed text-muted">
                      {plan.forText}
                    </p>
                  </div>

                  <div
                    aria-hidden="true"
                    className="my-6 h-px w-full bg-border"
                  />

                  <ul className="space-y-3 text-sm text-text">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5">
                        <Check
                          aria-hidden="true"
                          className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                        />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-8">
                    <button
                      type="button"
                      onClick={() => onSelectPlan(buildPlanNote(plan))}
                      className={`w-full rounded-button px-5 py-3 text-sm font-medium whitespace-nowrap transition-all duration-150 cursor-pointer ${
                        isHighlighted
                          ? 'bg-btn-primary-bg text-btn-primary-text hover:opacity-90'
                          : 'border border-border bg-transparent text-text hover:border-text hover:bg-surface-alt'
                      }`}
                    >
                      {plan.cta}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Optional extras eyebrow & two-column cards */}
          <p className="eyebrow mt-14 sm:mt-16 text-center">OPTIONAL EXTRAS</p>

          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 md:items-stretch lg:mx-auto lg:w-[calc((100%-3rem)*2/3+1.5rem)]">
            {/* Card 1: Logo design */}
            <div className="plan-card flex h-full flex-col rounded-card border border-border bg-surface p-7 sm:p-8 shadow-card">
              <div>
                <h3 className="font-display text-lg font-bold tracking-[-0.02em] text-text">
                  Logo design
                </h3>

                <div className="mt-4">
                  <span className="block font-display text-4xl sm:text-[3rem] font-extrabold tracking-[-0.04em] leading-none tabular-nums text-text">
                    $199
                  </span>
                  <p className="mt-1.5 text-sm text-muted">
                    one-off, GST included
                  </p>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-muted">
                  A logo, colours, and fonts that make your business look professional.
                </p>
              </div>

              <div aria-hidden="true" className="my-6 h-px w-full bg-border" />

              <ul className="space-y-3 text-sm text-text">
                {LOGO_FEATURES.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <Check
                      aria-hidden="true"
                      className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-8">
                <button
                  type="button"
                  onClick={() => onSelectPlan('I would like to add Logo design ($199, one-off).')}
                  className="block w-full rounded-button border border-border bg-transparent px-5 py-3 text-center text-sm font-medium text-text whitespace-nowrap hover:border-text hover:bg-surface-alt cursor-pointer"
                >
                  Add a logo
                </button>
              </div>
            </div>

            {/* Card 2: Care plan */}
            <div className="plan-card flex h-full flex-col rounded-card border border-border bg-surface p-7 sm:p-8 shadow-card">
              <div>
                <h3 className="font-display text-lg font-bold tracking-[-0.02em] text-text">
                  Care plan
                </h3>

                <div className="mt-4">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <span className="text-sm font-medium text-muted">from</span>
                    <span className="font-display text-4xl sm:text-[3rem] font-extrabold tracking-[-0.04em] leading-none tabular-nums text-text">
                      $49
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm text-muted">
                    a month, cancel any month
                  </p>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-muted">
                  Hosting, backups, and security looked after for you, so you never have to think about it.
                </p>
              </div>

              <div aria-hidden="true" className="my-6 h-px w-full bg-border" />

              <ul className="space-y-3 text-sm text-text">
                {CARE_FEATURES.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <Check
                      aria-hidden="true"
                      className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-8">
                <Link
                  to="/pricing#care-plans"
                  className="block w-full rounded-button border border-border bg-transparent px-5 py-3 text-center text-sm font-medium text-text whitespace-nowrap transition-all duration-150 hover:border-text hover:bg-surface-alt"
                >
                  See care plans
                </Link>
              </div>
            </div>
          </div>

          {/* Footer line */}
          <p className="mt-10 text-center text-sm text-muted">
            All prices are flat and one-off unless stated. Need a bigger site or an online store?{' '}
            <Link
              to="/pricing"
              className="link-underline font-medium text-text hover:text-accent"
            >
              See all plans
            </Link>
          </p>
        </div>
      </RevealOnScroll>
    </section>
  );
}
