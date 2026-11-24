import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BarChart2,
  Check,
  ChevronDown,
  FileEdit,
  KeyRound,
  Mail,
  Minus,
  Search,
  ShieldCheck,
  Smartphone,
  Zap,
} from 'lucide-react';
import RevealOnScroll from '../components/RevealOnScroll';
import ProcessSection from '../components/ProcessSection';
import NotIncludedSection from '../components/NotIncludedSection';
import FinalCtaSection from '../components/FinalCtaSection';
import { scrollToContactSection } from '../utils/scrollToContact';

const MAIN_PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: '$500',
    prefix: '',
    description:
      'A clean, professional 5-page website that gets your business online fast.',
    bestFor: 'new businesses, tradies, local services.',
    features: [
      '5 pages of your choice (for example Home, About, Services, Contact)',
      'Professional design made for your business',
      'Live in 48 hours',
      'Works perfectly on phones',
      'Easy to edit yourself, like a Word document',
      'Set up to be found on Google',
      'Contact form that goes straight to your email',
      'Simple visitor stats',
      'Secure from day one',
      'Unlimited changes until you’re happy',
      'You own everything',
    ],
    cta: 'Get started',
    note: 'I am interested in the Starter website plan ($500, one-off).',
  },
  {
    id: 'showcase',
    name: 'Showcase',
    price: '$700',
    prefix: 'from',
    highlighted: true,
    description:
      'Everything in Starter, plus eye-catching motion and 3D touches that make your brand stand out.',
    bestFor: 'brands that want to look premium.',
    features: [
      'Everything in Starter (except delivery time)',
      'Animated and 3D design touches',
      'Live in 7 business days',
      'Up to 5 pages (more available)',
    ],
    cta: 'Get started',
    note: 'I am interested in the Showcase website plan (from $700).',
  },
  {
    id: 'industry-specialist',
    name: 'Industry Specialist',
    price: '$1,500',
    prefix: 'from',
    description:
      'A website built around your industry, with the rules and features your customers expect.',
    bestFor: 'health clinics, real estate, hospitality, regulated businesses.',
    features: [
      'Everything in Starter (except delivery time)',
      'Design made for your industry',
      'Industry advertising and privacy rules built in',
      'Booking, enquiry, and map tools set up',
      'Live in 7 business days',
      'Up to 15 pages',
      'Optional case study about your business (you approve it first)',
    ],
    cta: 'Talk to us',
    note: 'I am interested in the Industry Specialist website plan (from $1,500).',
  },
];

const BIGGER_PLANS = [
  {
    name: 'Large site',
    prefix: 'from',
    price: '$2,500',
    pages: 'up to 30 pages',
    description: 'For businesses with lots of services, locations, or products.',
    bullets: [
      'Copywriting help included',
      'Old page addresses redirected so you keep your Google rankings',
      'Timeline agreed in writing',
      'Pay half at the start, half at launch',
    ],
    cta: 'Start your project',
    note: 'I am interested in a Large site (from $2,500, up to 30 pages).',
  },
  {
    name: 'Extra-large site',
    prefix: 'from',
    price: '$4,000',
    pages: 'up to 50 pages',
    description: 'For larger businesses that need room to grow.',
    bullets: [
      'Copywriting help included',
      'Old page addresses redirected so you keep your Google rankings',
      'Timeline agreed in writing',
      'Pay half at the start, half at launch',
    ],
    cta: 'Start your project',
    note: 'I am interested in an Extra-large site (from $4,000, up to 50 pages).',
  },
  {
    name: 'Custom project',
    prefix: '',
    price: 'Custom quote',
    pages: '',
    description:
      'Anything else, or something in between. We price it on a free call and put it in writing.',
    bullets: [
      'Priced on a free 30-minute call',
      'Fixed price in writing before work starts',
      'Quote valid for 2 weeks',
      'You own everything',
    ],
    cta: 'Get a custom quote',
    note: 'I would like a custom quote for my website project.',
  },
];

const ADD_ONS = [
  {
    name: 'Online store',
    prefix: 'from',
    price: '$700',
    description:
      'A custom-designed store for your products. Up to 10 pages, payments and shipping set up, built on your own store account so you own it.',
    noteText: 'Store platform fees are paid to the platform, not to us.',
    items: [
      'Custom store design',
      'Up to 10 pages',
      'Payment and shipping setup',
      'Unlimited changes until you’re happy',
    ],
    cta: 'Start your project',
    note: 'I would like to add an Online store (from $700).',
  },
  {
    name: 'Logo and brand pack',
    prefix: '',
    price: '$199',
    description:
      'A logo, colours, fonts, and a one-page brand guide, delivered within 48 hours of us receiving your brief.',
    items: [
      '3 logo versions',
      'All file formats',
      'Colour and font choices',
      'Social media profile pack',
      'Unlimited changes until you’re happy',
      'You own the source files',
    ],
    cta: 'Start your project',
    note: 'I would like to add the Logo and brand pack ($199).',
  },
];

const INCLUDED_ITEMS = [
  {
    icon: Smartphone,
    title: 'Made for phones',
    description:
      'Most of your customers will visit on a phone, so we design for that first.',
  },
  {
    icon: Zap,
    title: 'Loads fast',
    description: 'Quick pages keep visitors from leaving.',
  },
  {
    icon: FileEdit,
    title: 'Easy to edit',
    description: 'Change text and photos yourself, no special skills needed.',
  },
  {
    icon: Search,
    title: 'Found on Google',
    description:
      'We set up the page titles and descriptions search engines look for.',
  },
  {
    icon: Mail,
    title: 'Contact form with spam blocked',
    description: 'Enquiries land in your inbox, with spam blocked.',
  },
  {
    icon: BarChart2,
    title: 'See your visitors',
    description: 'Simple, privacy-friendly stats show what’s working.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure from day one',
    description: 'We lock it down before launch.',
  },
  {
    icon: KeyRound,
    title: 'Everything handed over',
    description:
      'Every login and file, explained in plain English at handover.',
  },
];

type CareCellValue = boolean | string;

const CARE_ROWS: {
  feature: string;
  basic: CareCellValue;
  plus: CareCellValue;
  specialist: CareCellValue;
}[] = [
  { feature: 'Hosting', basic: true, plus: true, specialist: true },
  { feature: 'Daily backups', basic: true, plus: true, specialist: true },
  { feature: 'Security updates', basic: true, plus: true, specialist: true },
  { feature: 'Uptime alerts', basic: true, plus: true, specialist: true },
  {
    feature: 'Monthly report in plain English',
    basic: true,
    plus: true,
    specialist: true,
  },
  {
    feature: 'Content updates included',
    basic: 'None',
    plus: '1 hour a month',
    specialist: '30 minutes a month',
  },
  {
    feature: 'Industry rule or store-platform monitoring',
    basic: false,
    plus: false,
    specialist: true,
  },
];

const PRICING_FAQS = [
  {
    question: 'How much does a website cost?',
    answer:
      'A 5-page website starts at $500, one time. Animated sites start at $700, industry-specific sites at $1,500, and larger sites at $2,500. Every price includes GST and is agreed in writing before we start.',
  },
  {
    question: 'Why is your starter price so low?',
    answer:
      'We use a proven process and modern tools, so a simple website doesn’t need weeks of work. We pass the saving on to you.',
  },
  {
    question: 'Are there any hidden fees or monthly costs?',
    answer:
      'No. The price you agree is the price you pay. Hosting is included at no extra cost. Care plans are optional and can be cancelled any month.',
  },
  {
    question: 'How long does it take?',
    answer:
      'Starter websites go live within 48 hours once we receive your short form, photos, and text. Showcase and Industry Specialist websites take 7 business days from your kickoff call. Larger sites are timed on the call and put in writing.',
  },
  {
    question: 'Do I own my website?',
    answer:
      'Yes. When we finish, you receive everything: the design, the files, and the logins. You can take it anywhere.',
  },
  {
    question: "Can I change things after it's live?",
    answer:
      'Yes. You can edit text and photos yourself, ask us to do it, or choose a care plan that includes monthly updates.',
  },
  {
    question: 'What do I need to provide?',
    answer:
      'A short brief, your logo if you have one, and any photos or text you want to use. If you don’t have text, we can help write it.',
  },
  {
    question: 'How does payment work?',
    answer:
      'You get the scope, price, and timeline in writing first. Starter and Showcase plans are paid at the start. Industry Specialist and bigger projects can be split: half at the start, half at launch.',
  },
  {
    question: 'Can I cancel the care plan?',
    answer:
      'Yes, any month, with 14 days’ notice. No exit fees, and your website keeps working.',
  },
];

function CareCell({ value }: { value: CareCellValue }) {
  if (typeof value === 'string') {
    return <span className="text-sm font-medium text-text">{value}</span>;
  }

  if (value) {
    return (
      <span className="inline-flex items-center justify-center text-accent">
        <Check aria-hidden="true" strokeWidth={1.75} className="h-4 w-4" />
        <span className="sr-only">Included</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center justify-center text-muted">
      <Minus aria-hidden="true" strokeWidth={1.75} className="h-4 w-4" />
      <span className="sr-only">Not included</span>
    </span>
  );
}

export default function Pricing() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  const handleContactClick = (_note?: string) => {
    scrollToContactSection();
  };

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => {
      setPrefersReducedMotion(mq.matches);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // SEO metadata & JSON-LD structured data for /pricing
  useEffect(() => {
    const prevTitle = document.title;
    const pageTitle = 'Website Pricing | From $500, Live in 48 Hours | Nexamor';
    const pageDescription =
      'Clear, flat website pricing in Australia. A professional 5-page site for $500, built in Australia with nothing outsourced, live in 48 hours, ready for 2027. You own everything.';
    const origin = window.location.origin;
    const canonicalUrl = `${origin}/pricing`;
    const ogImageUrl = `${origin}/assets/aistudio/Screenshot_2026-11-15_at_9.25.41_PM_ce07e15e.png`;

    document.title = pageTitle;

    const createdTags: HTMLElement[] = [];
    const restoredAttrs: { el: Element; attr: string; prev: string | null }[] = [];

    const setMeta = (
      selector: string,
      createTag: () => HTMLMetaElement | HTMLLinkElement,
      attr: string,
      value: string
    ) => {
      let el = document.head.querySelector(selector);
      if (!el) {
        el = createTag();
        document.head.appendChild(el);
        createdTags.push(el as HTMLElement);
      } else {
        restoredAttrs.push({ el, attr, prev: el.getAttribute(attr) });
      }
      el.setAttribute(attr, value);
    };

    const createMeta = (key: 'name' | 'property', keyVal: string) => {
      const m = document.createElement('meta');
      m.setAttribute(key, keyVal);
      return m;
    };

    setMeta(
      'meta[name="description"]',
      () => createMeta('name', 'description'),
      'content',
      pageDescription
    );
    setMeta(
      'link[rel="canonical"]',
      () => {
        const l = document.createElement('link');
        l.setAttribute('rel', 'canonical');
        return l;
      },
      'href',
      canonicalUrl
    );
    setMeta(
      'meta[property="og:title"]',
      () => createMeta('property', 'og:title'),
      'content',
      pageTitle
    );
    setMeta(
      'meta[property="og:description"]',
      () => createMeta('property', 'og:description'),
      'content',
      pageDescription
    );
    setMeta(
      'meta[property="og:url"]',
      () => createMeta('property', 'og:url'),
      'content',
      canonicalUrl
    );
    setMeta(
      'meta[property="og:image"]',
      () => createMeta('property', 'og:image'),
      'content',
      ogImageUrl
    );
    setMeta(
      'meta[name="twitter:title"]',
      () => createMeta('name', 'twitter:title'),
      'content',
      pageTitle
    );
    setMeta(
      'meta[name="twitter:description"]',
      () => createMeta('name', 'twitter:description'),
      'content',
      pageDescription
    );

    const jsonLdData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebPage',
          '@id': `${canonicalUrl}#webpage`,
          url: canonicalUrl,
          name: pageTitle,
          description: pageDescription,
          breadcrumb: { '@id': `${canonicalUrl}#breadcrumb` },
          mainEntity: { '@id': `${canonicalUrl}#faq` },
        },
        {
          '@type': 'BreadcrumbList',
          '@id': `${canonicalUrl}#breadcrumb`,
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: `${origin}/`,
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Pricing',
              item: canonicalUrl,
            },
          ],
        },
        {
          '@type': 'Organization',
          '@id': `${origin}/#organization`,
          name: 'Nexamor',
          url: origin,
          logo: ogImageUrl,
          telephone: '+61435758455',
          email: 'nexamor1@gmail.com',
          founder: {
            '@type': 'Person',
            name: 'Danesh',
          },
          address: {
            '@type': 'PostalAddress',
            addressCountry: 'AU',
          },
          areaServed: 'Australia',
        },
        {
          '@type': 'OfferCatalog',
          '@id': `${canonicalUrl}#catalog`,
          name: 'Website Pricing Plans',
          itemListElement: [
            {
              '@type': 'Offer',
              price: '500',
              priceCurrency: 'AUD',
              itemOffered: {
                '@type': 'Service',
                name: 'Starter',
                description:
                  'A clean, professional 5-page website that gets your business online fast.',
              },
            },
            {
              '@type': 'Offer',
              priceSpecification: {
                '@type': 'PriceSpecification',
                minPrice: '700',
                priceCurrency: 'AUD',
              },
              itemOffered: {
                '@type': 'Service',
                name: 'Showcase',
                description:
                  'Everything in Starter, plus eye-catching motion and 3D touches that make your brand stand out.',
              },
            },
            {
              '@type': 'Offer',
              priceSpecification: {
                '@type': 'PriceSpecification',
                minPrice: '1500',
                priceCurrency: 'AUD',
              },
              itemOffered: {
                '@type': 'Service',
                name: 'Industry Specialist',
                description:
                  'A website built around your industry, with the rules and features your customers expect.',
              },
            },
            {
              '@type': 'Offer',
              priceSpecification: {
                '@type': 'PriceSpecification',
                minPrice: '2500',
                priceCurrency: 'AUD',
              },
              itemOffered: {
                '@type': 'Service',
                name: 'Large site',
                description:
                  'For businesses with lots of services, locations, or products.',
              },
            },
            {
              '@type': 'Offer',
              priceSpecification: {
                '@type': 'PriceSpecification',
                minPrice: '4000',
                priceCurrency: 'AUD',
              },
              itemOffered: {
                '@type': 'Service',
                name: 'Extra-large site',
                description: 'For larger businesses that need room to grow.',
              },
            },
            {
              '@type': 'Offer',
              price: '199',
              priceCurrency: 'AUD',
              itemOffered: {
                '@type': 'Service',
                name: 'Logo and brand pack',
                description:
                  'A logo, colours, fonts, and a one-page brand guide, delivered within 48 hours of us receiving your brief.',
              },
            },
            {
              '@type': 'Offer',
              priceSpecification: {
                '@type': 'UnitPriceSpecification',
                minPrice: '49',
                priceCurrency: 'AUD',
                unitCode: 'MON',
                billingIncrement: 1,
              },
              itemOffered: {
                '@type': 'Service',
                name: 'Care plan',
                description:
                  'A website needs a little looking after: updates, backups, and security checks. Our care plans do it for you each month. Cancel any month with 14 days’ notice, with no exit fees. Your first month is free with every new website.',
              },
            },
          ],
        },
        {
          '@type': 'FAQPage',
          '@id': `${canonicalUrl}#faq`,
          mainEntity: PRICING_FAQS.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        },
      ],
    };

    const existingScript = document.getElementById('pricing-jsonld');
    if (existingScript) existingScript.remove();

    const script = document.createElement('script');
    script.id = 'pricing-jsonld';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(jsonLdData);
    document.head.appendChild(script);

    return () => {
      document.title = prevTitle;
      script.remove();
      createdTags.forEach((tag) => tag.remove());
      restoredAttrs.forEach(({ el, attr, prev }) => {
        if (prev === null) {
          el.removeAttribute(attr);
        } else {
          el.setAttribute(attr, prev);
        }
      });
    };
  }, []);

  return (
    <div className="bg-bg text-text">
      {/* 1. HERO */}
      <section
        id="hero"
        className="w-full bg-bg py-16 sm:py-24 lg:py-28 px-5 sm:px-8 lg:px-12"
      >
        <div className="section-container">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="text-left"
          >
            <p className="eyebrow">PRICING</p>
            <h1 className="mt-5 max-w-5xl font-display text-[2.5rem] font-extrabold tracking-[-0.04em] leading-[1.03] text-text sm:text-6xl lg:text-[4.5rem]">
              Websites usually <br className="hidden lg:inline" />
              cost $1,500 to $5,000. <br className="hidden lg:inline" />
              Ours is{' '}
              <span className="font-extrabold text-accent whitespace-nowrap">
                $500 flat.
              </span>
            </h1>
            <p className="mt-6 max-w-[640px] text-base leading-relaxed text-muted sm:text-lg">
              One flat price, GST included. No hidden extras, no monthly fees, no
              surprise bills. Live in 48 hours, and you own everything: the
              design, the files, and the logins.
            </p>

            <div className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() =>
                  handleContactClick('I am ready to start a website project.')
                }
                className="group inline-flex items-center justify-center gap-2 rounded-button bg-btn-primary-bg px-6 py-3.5 text-sm font-medium text-btn-primary-text whitespace-nowrap shrink-0 transition-opacity hover:opacity-90 cursor-pointer"
              >
                <span>Start your project</span>
                <ArrowRight
                  aria-hidden="true"
                  strokeWidth={1.75}
                  className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5"
                />
              </button>

              <a
                href="tel:+61435758455"
                className="inline-flex items-center justify-center rounded-button border border-border bg-surface px-6 py-3.5 text-sm font-medium text-text whitespace-nowrap shrink-0 transition-colors hover:border-text hover:bg-surface-alt"
              >
                Call 0435 758 455
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. QUICK ANSWER BOX */}
      <section
        id="quick-answer"
        aria-labelledby="quick-answer-heading"
        className="w-full bg-bg pb-16 sm:pb-24 px-5 sm:px-8 lg:px-12"
      >
        <RevealOnScroll>
          <div className="section-container">
            <div className="mx-auto max-w-3xl rounded-card border border-border bg-surface p-7 sm:p-9 shadow-card">
              <h2
                id="quick-answer-heading"
                className="font-display text-xl font-bold tracking-[-0.02em] text-text sm:text-2xl"
              >
                The short answer
              </h2>
              <p className="mt-3 text-base leading-relaxed text-muted">
                A professional 5-page website costs $500, one time, including GST.
                It goes live in 48 hours once we have your form, photos, and
                text, includes unlimited changes until you&apos;re happy, and
                everything is handed over to you. Animated sites start at $700
                and industry-specific sites at $1,500 (both take 7 business
                days), and larger sites start at $2,500. Ongoing care is
                optional from $49 a month.
              </p>
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* 3. MAIN PLANS */}
      <section
        id="website-plans"
        aria-labelledby="website-plans-heading"
        className="section-shell w-full bg-surface-alt px-5 sm:px-8 lg:px-12 border-t border-border"
      >
        <RevealOnScroll>
          <div className="section-container">
            <div className="mx-auto max-w-2xl text-center">
              <h2
                id="website-plans-heading"
                className="font-display text-3xl font-bold tracking-[-0.02em] leading-[1.12] text-text sm:text-4xl"
                style={{ textWrap: 'balance' }}
              >
                Choose your website plan
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted">
                Not sure which one? Start with Starter. You can upgrade later and
                keep everything you&apos;ve built.
              </p>
            </div>

            <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-stretch">
              {MAIN_PLANS.map((plan) => {
                const isHighlighted = Boolean(plan.highlighted);

                return (
                  <div
                    key={plan.id}
                    className={`relative flex flex-col rounded-card bg-surface p-7 sm:p-8 ${
                      isHighlighted
                        ? 'plan-card-accent border-[1.5px] border-accent shadow-highlight'
                        : 'plan-card border border-border shadow-card'
                    }`}
                  >
                    <div>
                      <div className="flex items-baseline justify-between gap-3">
                        <h3 className="font-display text-xl font-bold tracking-[-0.02em] text-text">
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
                        <span className="font-display text-4xl font-extrabold tracking-[-0.04em] leading-none tabular-nums text-text sm:text-[3rem]">
                          {plan.price}
                        </span>
                        {plan.id === 'starter' && (
                          <span className="text-[13.5px] font-normal text-muted">
                            GST included.
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-xs text-muted">
                        one-off, GST included
                      </p>

                      <p className="mt-4 text-sm leading-relaxed text-text">
                        {plan.description}
                      </p>
                      <p className="mt-3 text-sm leading-relaxed text-muted">
                        <strong className="font-semibold text-text">
                          Best for:
                        </strong>{' '}
                        {plan.bestFor}
                      </p>
                    </div>

                    <div
                      aria-hidden="true"
                      className="my-6 h-px w-full bg-border"
                    />

                    <ul className="space-y-3 text-sm leading-relaxed text-text">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2.5">
                          <Check
                            aria-hidden="true"
                            strokeWidth={1.75}
                            className="mt-1 h-4 w-4 shrink-0 text-accent"
                          />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-auto pt-8">
                      <button
                        type="button"
                        onClick={() => handleContactClick(plan.note)}
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

            <p className="mt-8 text-center text-[13.5px] text-muted">
              No jargon. No pressure. Just a real person to talk to.
            </p>
          </div>
        </RevealOnScroll>
      </section>

      {/* 4. BIGGER WEBSITES */}
      <section
        id="larger-websites"
        aria-labelledby="larger-websites-heading"
        className="section-shell w-full bg-bg px-5 sm:px-8 lg:px-12 border-t border-border"
      >
        <RevealOnScroll>
          <div className="section-container">
            <div className="mx-auto max-w-2xl text-center">
              <h2
                id="larger-websites-heading"
                className="font-display text-3xl font-bold tracking-[-0.02em] leading-[1.12] text-text sm:text-4xl"
                style={{ textWrap: 'balance' }}
              >
                Need a bigger website?
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted">
                More pages means a lower price per page. Every bigger plan
                includes everything in Industry Specialist.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
              {BIGGER_PLANS.map((plan) => (
                <div key={plan.name} className="flex flex-col">
                  <div className="plan-card flex flex-1 flex-col rounded-card border border-border bg-surface p-7 shadow-card">
                    <h3 className="font-display text-lg font-bold tracking-[-0.02em] text-text">
                      {plan.name}
                    </h3>

                    <div className="mt-3 flex items-baseline gap-1.5">
                      {plan.prefix && (
                        <span className="text-sm font-medium text-muted">
                          {plan.prefix}
                        </span>
                      )}
                      <span className="font-display text-3xl font-extrabold tracking-[-0.03em] leading-none tabular-nums text-text sm:text-4xl">
                        {plan.price}
                      </span>
                    </div>

                    {plan.pages && (
                      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-accent">
                        {plan.pages}
                      </p>
                    )}

                    <p className="mt-4 text-sm leading-relaxed text-muted">
                      {plan.description}
                    </p>

                    <div className="mt-auto pt-6">
                      <button
                        type="button"
                        onClick={() => handleContactClick(plan.note)}
                        className="w-full rounded-button border border-border bg-transparent px-5 py-2.5 text-sm font-medium text-text whitespace-nowrap transition-colors hover:border-text hover:bg-surface-alt cursor-pointer"
                      >
                        {plan.cta}
                      </button>
                    </div>
                  </div>

                  <ul className="mt-5 space-y-2 px-1 text-sm text-muted">
                    {plan.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-2.5">
                        <Check
                          aria-hidden="true"
                          strokeWidth={1.75}
                          className="mt-1 h-3.5 w-3.5 shrink-0 text-accent"
                        />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <p className="mt-10 text-center text-sm text-muted">
              Blog posts, privacy, and terms pages don&apos;t count towards your
              page total.
            </p>
          </div>
        </RevealOnScroll>
      </section>

      {/* 5. ADD-ONS */}
      <section
        id="extras"
        aria-labelledby="extras-heading"
        className="section-shell w-full bg-surface-alt px-5 sm:px-8 lg:px-12 border-t border-border"
      >
        <RevealOnScroll>
          <div className="section-container">
            <div className="max-w-2xl">
              <h2
                id="extras-heading"
                className="font-display text-3xl font-bold tracking-[-0.02em] leading-[1.12] text-text sm:text-4xl"
              >
                Add-ons
              </h2>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
              {ADD_ONS.map((addon) => (
                <div
                  key={addon.name}
                  className="plan-card flex flex-col rounded-card border border-border bg-surface p-7 sm:p-9 shadow-card"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-4">
                    <h3 className="font-display text-xl font-bold tracking-[-0.02em] text-text sm:text-2xl">
                      {addon.name}
                    </h3>
                    <div className="flex items-baseline gap-1.5">
                      {addon.prefix && (
                        <span className="text-sm font-medium text-muted">
                          {addon.prefix}
                        </span>
                      )}
                      <span className="font-display text-3xl font-extrabold tracking-[-0.03em] tabular-nums text-text">
                        {addon.price}
                      </span>
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
                    {addon.description}
                  </p>

                  {addon.noteText && (
                    <p className="mt-3 text-xs leading-relaxed text-muted">
                      {addon.noteText}
                    </p>
                  )}

                  <div
                    aria-hidden="true"
                    className="my-6 h-px w-full bg-border"
                  />

                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                    What you get
                  </p>
                  <ul className="mt-3 grid grid-cols-1 gap-2.5 text-sm text-text sm:grid-cols-2">
                    {addon.items.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <Check
                          aria-hidden="true"
                          strokeWidth={1.75}
                          className="mt-1 h-4 w-4 shrink-0 text-accent"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-8">
                    <button
                      type="button"
                      onClick={() => handleContactClick(addon.note)}
                      className="inline-flex w-full sm:w-auto items-center justify-center rounded-button border border-border bg-transparent px-6 py-3 text-sm font-medium text-text whitespace-nowrap transition-colors hover:border-text hover:bg-surface-alt cursor-pointer"
                    >
                      {addon.cta}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* 6. WHAT'S INCLUDED */}
      <section
        id="whats-included"
        aria-labelledby="whats-included-heading"
        className="section-shell w-full bg-bg px-5 sm:px-8 lg:px-12 border-t border-border"
      >
        <RevealOnScroll>
          <div className="section-container">
            <div className="max-w-2xl">
              <h2
                id="whats-included-heading"
                className="font-display text-3xl font-bold tracking-[-0.02em] leading-[1.12] text-text sm:text-4xl"
                style={{ textWrap: 'balance' }}
              >
                What&apos;s included in every website
              </h2>
              <p className="mt-3 text-base leading-relaxed text-muted">
                No hidden extras. These come standard.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-2">
              {INCLUDED_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-surface text-text shadow-card">
                      <Icon
                        aria-hidden="true"
                        strokeWidth={1.75}
                        className="h-4 w-4"
                      />
                    </div>
                    <div>
                      <h3 className="font-display text-base font-bold tracking-[-0.02em] text-text">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* 7. HOW YOUR 48 HOURS WORK */}
      <ProcessSection
        id="how-it-works"
        eyebrow=""
        heading="How your 48 hours work"
        subtext="Same four steps for every Starter website, so you always know what's next."
        showFooterLink={false}
      />

      {/* 8. CARE PLANS */}
      <section
        id="care-plans"
        aria-labelledby="care-plans-heading"
        className="section-shell w-full bg-bg px-5 sm:px-8 lg:px-12 border-t border-border"
      >
        <RevealOnScroll>
          <div className="section-container">
            <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-7">
                <h2
                  id="care-plans-heading"
                  className="font-display text-3xl font-bold tracking-[-0.02em] leading-[1.12] text-text sm:text-4xl"
                >
                  Optional care plans
                </h2>
                <p className="mt-4 text-base leading-relaxed text-muted">
                  A website needs a little looking after: updates, backups, and
                  security checks. Our care plans do it for you each month.
                  Cancel any month with 14 days&apos; notice, with no exit fees.
                  Your first month is free with every new website.
                </p>
              </div>

              <div className="flex justify-center lg:col-span-5 lg:justify-end">
                <img
                  src="/assets/pricing/care-plans.svg"
                  alt="Person looking after website updates, backups, and security checks"
                  width={800}
                  height={661}
                  loading="lazy"
                  className="block w-full max-w-[340px] h-auto"
                />
              </div>
            </div>

            <div className="mt-12 overflow-x-auto rounded-card border border-border bg-surface shadow-card">
              <table className="w-full min-w-[640px] border-collapse text-left">
                <caption className="sr-only">
                  Comparison of optional monthly care plans: Basic, Plus, and
                  Specialist
                </caption>
                <thead>
                  <tr className="border-b border-border">
                    <th
                      scope="col"
                      className="py-6 pl-6 pr-4 text-xs font-semibold uppercase tracking-[0.16em] text-muted w-[36%]"
                    >
                      What&apos;s included
                    </th>
                    <th scope="col" className="px-5 py-6 text-center align-bottom">
                      <span className="block font-display text-lg font-bold tracking-[-0.02em] text-text">
                        Basic
                      </span>
                      <span className="mt-1 block text-sm font-medium text-muted tabular-nums">
                        $49 a month
                      </span>
                    </th>
                    <th
                      scope="col"
                      className="bg-surface-alt px-5 py-6 text-center align-bottom border-x border-border"
                    >
                      <span className="mb-1.5 block font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">
                        Most popular
                      </span>
                      <span className="block font-display text-lg font-bold tracking-[-0.02em] text-text">
                        Plus
                      </span>
                      <span className="mt-1 block text-sm font-medium text-muted tabular-nums">
                        $99 a month
                      </span>
                    </th>
                    <th scope="col" className="px-5 py-6 text-center align-bottom">
                      <span className="block font-display text-lg font-bold tracking-[-0.02em] text-text">
                        Specialist
                      </span>
                      <span className="mt-1 block text-sm font-medium text-muted tabular-nums">
                        from $129 a month
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {CARE_ROWS.map((row) => (
                    <tr key={row.feature}>
                      <th
                        scope="row"
                        className="py-4 pl-6 pr-4 text-sm font-medium text-text"
                      >
                        {row.feature}
                      </th>
                      <td className="px-5 py-4 text-center">
                        <CareCell value={row.basic} />
                      </td>
                      <td className="bg-surface-alt/60 px-5 py-4 text-center border-x border-border">
                        <CareCell value={row.plus} />
                      </td>
                      <td className="px-5 py-4 text-center">
                        <CareCell value={row.specialist} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-4 text-sm text-muted">
              Selling online?{' '}
              <a
                href="#extras"
                className="font-medium text-text underline decoration-accent underline-offset-4 hover:text-accent"
              >
                See store costs
              </a>
              .
            </p>
          </div>
        </RevealOnScroll>
      </section>

      {/* 9. CUSTOM PROJECT BAND */}
      <section
        id="custom-project"
        aria-labelledby="custom-project-band-heading"
        className="section-shell w-full bg-surface-alt px-5 sm:px-8 lg:px-12 border-t border-border"
      >
        <RevealOnScroll>
          <div className="section-container">
            <div className="mx-auto max-w-2xl text-center">
              <div className="mb-8 flex justify-center">
                <img
                  src="/assets/pricing/custom-project.svg"
                  alt="Planning a custom website project together"
                  width={960}
                  height={424}
                  loading="lazy"
                  className="block w-full max-w-[380px] h-auto"
                />
              </div>

              <h2
                id="custom-project-band-heading"
                className="font-display text-3xl font-bold tracking-[-0.02em] leading-[1.12] text-text sm:text-4xl"
                style={{ textWrap: 'balance' }}
              >
                Something bigger or different?
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted">
                Tell us what you&apos;re trying to achieve and we&apos;ll come
                back with a clear, fixed quote. If we can&apos;t give a fixed
                price, we&apos;ll tell you why.
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() =>
                    handleContactClick(
                      'I would like to request a custom quote for a unique project.'
                    )
                  }
                  className="inline-flex w-full sm:w-auto items-center justify-center rounded-button bg-btn-primary-bg px-6 py-3.5 text-sm font-medium text-btn-primary-text whitespace-nowrap shrink-0 transition-opacity hover:opacity-90 cursor-pointer"
                >
                  Request a custom quote
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleContactClick(
                      'I would like to book a free call to discuss a custom website.'
                    )
                  }
                  className="inline-flex w-full sm:w-auto items-center justify-center rounded-button border border-border bg-surface px-6 py-3.5 text-sm font-medium text-text whitespace-nowrap shrink-0 transition-colors hover:border-text hover:bg-bg cursor-pointer"
                >
                  Book a free call
                </button>
              </div>

              <p className="mt-6 text-sm text-muted">
                <Link
                  to="/growth"
                  className="link-underline font-medium text-text hover:text-accent"
                >
                  Want customers, not just a website? See Growth Pro
                </Link>
              </p>
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* 10. WHAT THE $500 DOESN'T COVER */}
      <NotIncludedSection />

      {/* 11. FAQ */}
      <section
        id="faq"
        aria-labelledby="pricing-faq-heading"
        className="section-shell w-full bg-bg px-5 sm:px-8 lg:px-12 border-t border-border"
      >
        <RevealOnScroll>
          <div className="mx-auto max-w-[760px]">
            <h2
              id="pricing-faq-heading"
              className="font-display text-3xl font-bold tracking-[-0.02em] leading-[1.12] text-text sm:text-4xl"
            >
              Pricing questions, answered
            </h2>
            <p className="mt-3 text-[13.5px] text-muted">
              Can&apos;t find your question? Just call or email.
            </p>

            <div className="mt-10 divide-y divide-border border-y border-border">
              {PRICING_FAQS.map((item, index) => (
                <details
                  key={item.question}
                  open={index === 0}
                  className="group"
                >
                  <summary className="flex w-full list-none items-center justify-between gap-6 py-5 sm:py-6 text-left text-base sm:text-lg font-semibold tracking-[-0.01em] text-text transition-colors hover:text-accent cursor-pointer [&::-webkit-details-marker]:hidden">
                    <span>{item.question}</span>
                    <ChevronDown
                      aria-hidden="true"
                      strokeWidth={1.75}
                      className="h-5 w-5 shrink-0 text-text transition-transform duration-200 group-open:rotate-180"
                    />
                  </summary>
                  <p className="pb-6 pr-8 text-sm sm:text-base leading-relaxed text-muted">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* 11. CONTACT */}
      <FinalCtaSection sectionBg="bg-surface-alt" />
    </div>
  );
}
