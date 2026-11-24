import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  ChevronDown,
  Home,
  MessageSquare,
  Phone,
  Repeat,
  Scissors,
  ShieldCheck,
  ShoppingBag,
  Star,
  Stethoscope,
  UtensilsCrossed,
  Wrench,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import RevealOnScroll from '../components/RevealOnScroll';
import FinalCtaSection from '../components/FinalCtaSection';
import { scrollToContactSection } from '../utils/scrollToContact';

const NUMBERS_STRIP = [
  {
    value: '$2,000+',
    label: 'What a 10 to 20 page website typically costs from an agency. Included.',
  },
  { value: '$297', label: 'Per month. Everything included.' },
  { value: '$0', label: 'To set up. Cancel anytime.' },
  { value: '10 to 20', label: 'Pages, designed and written for you.' },
];

interface AudienceCard {
  icon: LucideIcon;
  title: string;
  detail?: string;
}

const WHO_ITS_FOR: AudienceCard[] = [
  {
    icon: Wrench,
    title: 'Tradies',
    detail: 'Electricians, plumbers, builders',
  },
  {
    icon: Stethoscope,
    title: 'Clinics and health',
    detail: 'Dental, physio, allied health',
  },
  {
    icon: Scissors,
    title: 'Salons and beauty',
  },
  {
    icon: UtensilsCrossed,
    title: 'Cafés and restaurants',
  },
  {
    icon: Home,
    title: 'Real estate and local services',
  },
  {
    icon: ShoppingBag,
    title: 'Shops and online stores',
  },
];

interface GrowthProItem {
  text: string;
  subNote?: string;
}

const GROWTH_PRO_GROUPS: { heading: string; items: GrowthProItem[] }[] = [
  {
    heading: 'YOUR WEBSITE',
    items: [
      {
        text: 'A professional 10 to 20 page website, built to get calls and enquiries',
        subNote:
          'Your website goes live in 7 business days for up to 15 pages. Bigger sites are timed on the call and put in writing.',
      },
      { text: 'Your own business phone number for calls and texts' },
    ],
  },
  {
    heading: 'NEVER MISS A CUSTOMER',
    items: [
      { text: 'Missed-call text reply, so you never lose a customer to voicemail' },
      { text: 'One inbox for texts, emails, Facebook, Instagram, and Google messages' },
      { text: 'Automatic follow-up on every enquiry until they book or say no' },
      { text: 'Review requests that help you collect more 5-star Google reviews' },
      { text: 'Ready-made messages to win repeat customers and referrals' },
      { text: 'Help showing up in local Google searches' },
    ],
  },
  {
    heading: 'LOOKED AFTER FOR YOU',
    items: [
      { text: 'Hosting, backups, security, and alerts if your website ever goes down' },
      { text: 'A simple monthly report: calls, texts, reviews, and enquiries' },
      { text: 'Month to month, cancel anytime' },
    ],
  },
];

const OWN_IT_GROUPS = [
  {
    heading: 'WHAT YOU GET',
    items: [
      { type: 'ownItLink' as const },
      { type: 'text' as const, text: 'From $500, live in 48 hours' },
      { type: 'text' as const, text: "Unlimited changes until you're happy" },
    ],
  },
  {
    heading: 'YOURS TO KEEP',
    items: [
      { type: 'text' as const, text: 'Every login and file handed over' },
      { type: 'text' as const, text: 'No monthly fee' },
      { type: 'text' as const, text: 'Your domain and hosting in your name' },
    ],
  },
  {
    heading: 'OPTIONAL EXTRAS',
    items: [
      { type: 'text' as const, text: 'Care plan from $49 a month' },
      { type: 'text' as const, text: 'Add the customer tools later if you want them' },
    ],
  },
];

const GET_STARTED_STEPS = [
  {
    number: '01',
    title: 'Tell us about your business',
    description: 'A short form and a free call, about 30 minutes.',
  },
  {
    number: '02',
    title: 'We build and set up',
    description: 'We build your website and connect your phone number, reviews, and inbox.',
  },
  {
    number: '03',
    title: 'You start getting customers',
    description:
      'Missed calls get a text, happy customers get asked for reviews, and you get a monthly report.',
  },
];

const PAYMENT_OPTIONS = [
  {
    title: 'Pay monthly: Growth Pro',
    price: '$297 a month',
    description:
      'A 10 to 20 page website plus customer tools for one monthly price. Billed monthly in advance, cancel anytime.',
    cta: 'Start with Growth Pro',
    actionType: 'contact' as const,
    note: 'I would like to start with Growth Pro ($297 a month).',
  },
  {
    title: 'Pay once: Starter or Showcase',
    price: 'From $500',
    description:
      'A website you own outright. We agree the scope and price in writing, then you pay at the start by card or bank transfer.',
    cta: 'See one-off websites',
    actionType: 'link' as const,
    to: '/pricing#website-plans',
  },
  {
    title: 'Pay in two parts: bigger builds',
    price: 'From $700',
    description:
      'Industry Specialist sites (from $1,500) and online store themes (from $700) can be split in two: half at the start, half at launch.',
    cta: 'See bigger builds',
    actionType: 'link' as const,
    to: '/pricing#larger-websites',
  },
];

interface FeatureRowItem {
  id: string;
  imageSrc: string;
  width: number;
  height: number;
  alt: string;
  eyebrow: string;
  heading: string;
  paragraph: string;
  bullets: { lead: string; detail: string }[];
}

const FEATURE_ROWS: FeatureRowItem[] = [
  {
    id: 'your-website',
    imageSrc: '/assets/growth/website-browsing.svg',
    width: 960,
    height: 707,
    alt: 'Person browsing a fast, clear business website on a screen',
    eyebrow: 'YOUR WEBSITE',
    heading: 'A website that turns visitors into calls.',
    paragraph:
      'Most customers look at your website on their phone, and decide in seconds. We make it fast, clear, and easy to call or message you with one tap.',
    bullets: [
      {
        lead: 'Built for phones.',
        detail: 'Quick to load, with a call button always in reach.',
      },
      {
        lead: 'Easy ways to reach you.',
        detail: 'Call, text, or fill in a form, and it all comes straight to you.',
      },
      {
        lead: 'Your best reviews on show.',
        detail: 'Good ratings sit where new customers land, so they trust you straight away.',
      },
    ],
  },
  {
    id: 'missed-calls',
    imageSrc: '/assets/growth/missed-call-reply.svg',
    width: 743,
    height: 743,
    alt: 'Person holding a phone after a call with an instant text reply',
    eyebrow: 'MISSED CALLS',
    heading: 'A missed call becomes a text, not a lost customer.',
    paragraph:
      "Up a ladder and can't answer? The moment a call goes unanswered, we send a friendly text, so the customer waits for you instead of calling someone else.",
    bullets: [
      {
        lead: 'Never lose a customer to voicemail.',
        detail: 'They get a reply within seconds.',
      },
      {
        lead: 'Works day and night.',
        detail: 'Weekends, after hours, and busy days are covered.',
      },
      {
        lead: 'Beat the competition.',
        detail: 'The first business to reply usually wins the job.',
      },
    ],
  },
  {
    id: 'reviews',
    imageSrc: '/assets/growth/customer-reviews.svg',
    width: 960,
    height: 629,
    alt: 'Person leaving star ratings and helpful customer feedback',
    eyebrow: 'REVIEWS',
    heading: 'More 5-star reviews, without the awkward asking.',
    paragraph:
      'After each job, customers get a polite message asking how it went. Happy customers are guided to leave a Google review. If someone is unhappy, you hear about it privately first, so you can fix it.',
    bullets: [
      {
        lead: 'More reviews, automatically.',
        detail: 'Every happy customer is asked at the right moment.',
      },
      {
        lead: 'Fix problems quietly.',
        detail: 'Unhappy feedback comes to you before it goes public.',
      },
      {
        lead: 'A better rating wins work.',
        detail: 'Higher ratings help you show up and get chosen.',
      },
    ],
  },
  {
    id: 'repeat-customers',
    imageSrc: '/assets/growth/repeat-customers.svg',
    width: 1053,
    height: 880,
    alt: 'Two people sharing messages and staying in touch with a business',
    eyebrow: 'REPEAT CUSTOMERS',
    heading: 'Bring past customers back with one click.',
    paragraph:
      'Your cheapest new job comes from someone who already knows and likes you. Send a ready-made message to past customers whenever work is quiet.',
    bullets: [
      {
        lead: 'Win repeat work.',
        detail: 'Send a seasonal reminder or special offer to your whole list.',
      },
      {
        lead: 'Get more referrals.',
        detail: 'Gentle messages ask happy customers to tell their friends.',
      },
      {
        lead: 'Fill the quiet weeks.',
        detail: 'Prepare offers in advance and send them in seconds.',
      },
    ],
  },
  {
    id: 'local-search',
    imageSrc: '/assets/growth/local-search.svg',
    width: 960,
    height: 746,
    alt: 'Person finding a local business on a map search',
    eyebrow: 'LOCAL SEARCH',
    heading: 'Show up when people nearby are searching.',
    paragraph:
      "We set up your website and your Google business listing so you appear when someone searches for your trade in your suburb or town, such as 'plumber near me'.",
    bullets: [
      {
        lead: 'Found when it matters.',
        detail: "We aim for the searches customers type when they're ready to hire.",
      },
      {
        lead: 'Real customers, not tyre-kickers.',
        detail: 'People searching for what you do are more likely to call.',
      },
      {
        lead: 'Get into the top map results.',
        detail: 'We push you toward the three-business map at the top of local results.',
      },
    ],
  },
];

interface BackgroundTool {
  icon: LucideIcon;
  title: string;
  description: string;
  hasLink?: boolean;
}

const BACKGROUND_TOOLS: BackgroundTool[] = [
  {
    icon: MessageSquare,
    title: 'One inbox for everything',
    description:
      'Texts, emails, and messages from Facebook, Instagram, and Google all land in one place, so no enquiry slips through.',
  },
  {
    icon: Repeat,
    title: 'Automatic follow-up',
    description:
      'New enquiries get an instant reply, then polite reminders over the next few days until they book or say no.',
  },
  {
    icon: Phone,
    title: 'Your own business number',
    description:
      'A separate number for calls and texts keeps work apart from your personal phone.',
  },
  {
    icon: ShieldCheck,
    title: 'Hosting, security, and monthly report',
    description:
      'Hosting, daily backups, security updates, and alerts if your website ever goes down are all included, plus a plain-English monthly summary of calls, texts, reviews, and enquiries.',
  },
  {
    icon: Zap,
    title: 'Custom automation',
    description:
      "Need something we don't cover? We can set up other time-saving tools for your business, like automatic booking confirmations or quote reminders.",
    hasLink: true,
  },
];

const ADVANCED_TIERS = [
  {
    label: 'Local',
    heading: 'Get found',
    sideNote: 'Show up on Google Maps and local results',
    description:
      'Own your local area on Google: the map results, your business listing, and your reviews.',
    features: [
      'Set up and improve your Google business listing',
      'Get your business details right across the web',
      'A plan to collect more reviews',
      'Targeting for your suburbs and towns',
      'A monthly report on how visible you are',
    ],
    note: 'I am interested in Growth Advanced — Local (Get found).',
  },
  {
    label: 'Rank',
    heading: 'Get ranked',
    sideNote: 'Climb higher in Google search',
    highlighted: true,
    description:
      'Everything in Local, plus ongoing work to move your website up for the searches your customers use.',
    features: [
      'Everything in Local',
      'A plan based on what customers and competitors search',
      'Improvements to your pages',
      'Fresh content each month',
      'Building trust with other websites',
      'A monthly report on rankings and visitors',
    ],
    note: 'I am interested in Growth Advanced — Rank (Get ranked).',
  },
  {
    label: 'Accelerate',
    heading: 'Get booked',
    sideNote: 'Paid ads run by a specialist',
    description:
      'Everything in Rank, plus paid ads on Google to bring in customers faster.',
    features: [
      'Everything in Rank',
      'Google search ad management',
      'Google Local Services ads (the ads with the Google Guaranteed badge) setup and management',
      'Pages built to turn ad clicks into enquiries',
      'Tracking which ads bring in calls',
      'A dedicated specialist and a check-in every two weeks',
      'Ad spend is paid to Google separately',
    ],
    note: 'I am interested in Growth Advanced — Accelerate (Get booked).',
  },
];

const GROWTH_FAQS = [
  {
    question: 'What do I get for $297 a month?',
    answer:
      'A professional 10 to 20 page website and a set of tools that help you win customers: texts for missed calls, review requests, follow-up on every enquiry, a single inbox, and help showing up in local searches. Hosting, security, and a monthly report are included. No setup fee. Your website goes live in 7 business days for up to 15 pages. Bigger sites are timed on the call and put in writing.',
  },
  {
    question: 'Do I own the website on Growth Pro?',
    hasOneOffLink: true,
    answer:
      'Growth Pro is a monthly service, so we run the website for you. If you want to own it outright, choose a one-off website instead. Starting from $500, you get the files, logins, and everything else.',
  },
  {
    question: 'Is there really no setup fee?',
    answer:
      'Right. You pay the monthly price and nothing else upfront. Ad spend, if you choose ads, is paid directly to Google.',
  },
  {
    question: 'Can I cancel?',
    answer:
      "Yes, any month. There's no lock-in, and we'll help you take your contacts and reviews with you.",
  },
  {
    question: 'What is Growth Advanced, and do I need it?',
    answer:
      "It's extra help from our team to get found on Google and run ads. Most businesses start with Growth Pro and add Advanced only when they're ready to grow faster.",
  },
  {
    question: 'How is this different from a one-off website?',
    answer:
      'A one-off website is yours to keep, and you manage it. Growth Pro is a service we run for you, with extra tools that help you win and keep customers.',
  },
];

export default function Growth() {
  const handleContactClick = (_note?: string) => {
    scrollToContactSection();
  };

  useEffect(() => {
    const prevTitle = document.title;
    const pageTitle = 'Growth Pro: Website + Customer Tools | Nexamor';
    const pageDescription =
      'A professional website for your Australian small business plus missed-call texts, review requests, and follow-up for $297/month, ready for 2027. No setup fee. Cancel anytime.';
    const origin = window.location.origin;
    const canonicalUrl = `${origin}/growth`;
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
              name: 'Growth',
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
          '@type': 'Service',
          '@id': `${canonicalUrl}#growth-pro`,
          name: 'Growth Pro',
          description:
            'A professional 10 to 20 page website plus tools that bring in and keep customers. Built, hosted, and looked after for you.',
          areaServed: 'Australia',
          offers: {
            '@type': 'Offer',
            price: '297',
            priceCurrency: 'AUD',
            priceSpecification: {
              '@type': 'UnitPriceSpecification',
              price: '297',
              priceCurrency: 'AUD',
              unitCode: 'MON',
              billingIncrement: 1,
            },
          },
        },
        {
          '@type': 'Service',
          '@id': `${canonicalUrl}#local`,
          name: 'Local',
          description:
            'Own your local area on Google: the map results, your business listing, and your reviews. Priced on request.',
        },
        {
          '@type': 'Service',
          '@id': `${canonicalUrl}#rank`,
          name: 'Rank',
          description:
            'Everything in Local, plus ongoing work to move your website up for the searches your customers use. Priced on request.',
        },
        {
          '@type': 'Service',
          '@id': `${canonicalUrl}#accelerate`,
          name: 'Accelerate',
          description:
            'Everything in Rank, plus paid ads on Google to bring in customers faster. Priced on request.',
        },
        {
          '@type': 'FAQPage',
          '@id': `${canonicalUrl}#faq`,
          mainEntity: GROWTH_FAQS.map((faq) => ({
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

    const existingScript = document.getElementById('growth-jsonld');
    if (existingScript) existingScript.remove();

    const script = document.createElement('script');
    script.id = 'growth-jsonld';
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
    <div className="bg-bg text-text [--text-muted:#54504A]">
      {/* 1. HERO */}
      <section
        id="hero"
        className="section-shell w-full bg-bg px-5 sm:px-8 lg:px-12"
      >
        <div className="section-container">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow">WEBSITE AND CUSTOMER TOOLS</p>
            <h1
              className="mt-4 font-display text-4xl font-bold tracking-[-0.02em] leading-[1.08] text-text sm:text-5xl lg:text-[3.25rem]"
              style={{ textWrap: 'balance' }}
            >
              A website that doesn&apos;t just sit there. It brings you customers.
            </h1>
            <p className="mt-5 text-base leading-relaxed text-muted sm:text-lg">
              We build you a professional 10 to 20 page website for your Australian small business,
              then add simple tools that answer missed calls, ask happy customers for reviews, and
              follow up with every enquiry. It all runs in the background while you work. One
              monthly price. No setup fee. Cancel anytime.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Growth Pro is your website plus customer tools. Growth Advanced is optional extra help
              with Google.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() =>
                  handleContactClick('I would like to start with Growth Pro ($297 a month).')
                }
                className="group inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-button bg-btn-primary-bg px-6 py-3.5 text-sm font-medium text-btn-primary-text whitespace-nowrap shrink-0 transition-opacity hover:opacity-90 cursor-pointer"
              >
                <span>Start with Growth Pro</span>
                <ArrowRight
                  aria-hidden="true"
                  strokeWidth={1.75}
                  className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5"
                />
              </button>

              <button
                type="button"
                onClick={() =>
                  handleContactClick('I would like to book a free 30-minute call about Growth Pro.')
                }
                className="inline-flex w-full sm:w-auto items-center justify-center rounded-button border border-border bg-surface px-6 py-3.5 text-sm font-medium text-text whitespace-nowrap shrink-0 transition-colors hover:border-text hover:bg-surface-alt cursor-pointer"
              >
                Book a free 30-minute call
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. QUICK ANSWER BOX */}
      <section
        id="quick-answer"
        aria-labelledby="quick-answer-heading"
        className="w-full bg-bg pb-14 sm:pb-20 px-5 sm:px-8 lg:px-12"
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
                Growth Pro is a professional 10 to 20 page website for your Australian small
                business (typically $2,000 or more elsewhere) plus a simple customer-getting system,
                for $297 a month. It replies to missed calls by text, asks happy customers for
                Google reviews, follows up with every enquiry, and helps you show up in local
                searches. There is no setup fee and you can cancel any month. Want to know
                who&apos;s behind it?{' '}
                <Link
                  to="/about"
                  className="font-medium text-text underline decoration-accent underline-offset-4 transition-colors hover:text-accent"
                >
                  Read about Danesh and Nexamor
                </Link>
                .
              </p>
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* 3. NUMBERS STRIP */}
      <section
        id="numbers"
        aria-label="Growth Pro key figures"
        className="w-full bg-bg pb-16 sm:pb-24 px-5 sm:px-8 lg:px-12"
      >
        <RevealOnScroll>
          <div className="section-container">
            <div className="grid grid-cols-2 gap-8 border-y border-border py-10 sm:py-12 lg:grid-cols-4">
              {NUMBERS_STRIP.map((stat) => (
                <div key={stat.label}>
                  <div className="font-display text-3xl font-extrabold tracking-[-0.03em] leading-none tabular-nums text-text sm:text-4xl">
                    {stat.value}
                  </div>
                  <div aria-hidden="true" className="my-4 h-[2px] w-8 bg-accent" />
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* 4. WHO IT'S FOR */}
      <section
        id="who-its-for"
        aria-labelledby="who-its-for-heading"
        className="section-shell w-full bg-bg px-5 sm:px-8 lg:px-12 border-t border-border"
      >
        <RevealOnScroll>
          <div className="section-container">
            <div className="mx-auto max-w-2xl text-center">
              <h2
                id="who-its-for-heading"
                className="font-display text-3xl font-bold tracking-[-0.02em] leading-[1.12] text-text sm:text-4xl"
                style={{ textWrap: 'balance' }}
              >
                Who Growth Pro is for
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted">
                Growth Pro suits small businesses that win work from phone calls and local searches.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {WHO_ITS_FOR.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="flex items-start gap-4 rounded-card border border-border bg-surface p-6 shadow-card"
                  >
                    <Icon
                      aria-hidden="true"
                      strokeWidth={1.75}
                      className="mt-0.5 h-5 w-5 shrink-0 text-accent"
                    />
                    <div>
                      <h3 className="font-display text-base font-bold tracking-[-0.01em] text-text">
                        {item.title}
                      </h3>
                      {item.detail && (
                        <p className="mt-1 text-sm leading-relaxed text-muted">{item.detail}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* 5. THE MAIN PLAN */}
      <section
        id="growth-pro"
        aria-labelledby="growth-pro-heading"
        className="section-shell w-full bg-surface-alt px-5 sm:px-8 lg:px-12 border-t border-border"
      >
        <RevealOnScroll>
          <div className="section-container">
            <div className="mx-auto max-w-2xl text-center">
              <h2
                id="growth-pro-heading"
                className="font-display text-3xl font-bold tracking-[-0.02em] leading-[1.12] text-text sm:text-4xl"
                style={{ textWrap: 'balance' }}
              >
                Growth Pro: your whole online presence, handled.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted">
                A professional website and a set of customer-getting tools, looked after for one
                flat monthly fee. Prefer to own your website outright? Choose a one-off build
                instead.
              </p>
            </div>

            <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-stretch">
              {/* Card 1: Highlighted Growth Pro */}
              <div className="plan-card-accent relative flex flex-col rounded-card border-[1.5px] border-accent bg-surface p-7 sm:p-9 shadow-highlight lg:col-span-7">
                <div>
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-display text-2xl font-bold tracking-[-0.02em] text-text">
                      Growth Pro
                    </h3>
                    <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-accent whitespace-nowrap">
                      Recommended
                    </span>
                  </div>
                  <p className="mt-3 text-base text-muted">
                    <strong className="font-display text-3xl font-extrabold tracking-[-0.03em] tabular-nums text-text sm:text-4xl">
                      $297
                    </strong>{' '}
                    a month, everything included, no setup fee.
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-text sm:text-base">
                    A professional 10 to 20 page website plus tools that bring in and keep
                    customers. Built, hosted, and looked after for you.
                  </p>
                </div>

                <div aria-hidden="true" className="my-6 h-px w-full bg-border" />

                <div className="space-y-6">
                  {GROWTH_PRO_GROUPS.map((group) => (
                    <div key={group.heading}>
                      <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-muted">
                        {group.heading}
                      </p>
                      <ul className="mt-3 space-y-3 text-sm leading-relaxed text-text">
                        {group.items.map((feature) => (
                          <li key={feature.text} className="flex items-start gap-2.5">
                            <Check
                              aria-hidden="true"
                              strokeWidth={1.75}
                              className="mt-1 h-4 w-4 shrink-0 text-accent"
                            />
                            <span>
                              {feature.text}
                              {feature.subNote && (
                                <span className="mt-1 block text-xs leading-relaxed text-muted">
                                  {feature.subNote}
                                </span>
                              )}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="mt-auto pt-8">
                  <button
                    type="button"
                    onClick={() =>
                      handleContactClick('I would like to start with Growth Pro ($297 a month).')
                    }
                    className="w-full rounded-button bg-btn-primary-bg px-6 py-3.5 text-sm font-medium text-btn-primary-text whitespace-nowrap transition-opacity hover:opacity-90 cursor-pointer"
                  >
                    Start with Growth Pro
                  </button>
                  <p className="mt-3 text-center text-[13px] text-muted">
                    Switch off any month. No awkward conversations.
                  </p>
                </div>
              </div>

              {/* Card 2: Rather own it? */}
              <div className="plan-card flex flex-col rounded-card border border-border bg-surface p-7 sm:p-9 shadow-card lg:col-span-5">
                <div>
                  <h3 className="font-display text-2xl font-bold tracking-[-0.02em] text-text">
                    Rather own it?
                  </h3>
                  <p className="mt-3 font-display text-2xl font-extrabold tracking-[-0.03em] tabular-nums text-text sm:text-3xl">
                    From $500, one-off
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
                    You own the website, domain, and hosting. No monthly fee.
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    <strong className="font-semibold text-text">Best for:</strong> businesses that
                    want to pay once and manage things themselves.
                  </p>
                </div>

                <div aria-hidden="true" className="my-6 h-px w-full bg-border" />

                <div className="space-y-6">
                  {OWN_IT_GROUPS.map((group) => (
                    <div key={group.heading}>
                      <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-muted">
                        {group.heading}
                      </p>
                      <ul className="mt-3 space-y-3 text-sm leading-relaxed text-text">
                        {group.items.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2.5">
                            <Check
                              aria-hidden="true"
                              strokeWidth={1.75}
                              className="mt-1 h-4 w-4 shrink-0 text-accent"
                            />
                            {feature.type === 'ownItLink' ? (
                              <span>
                                A{' '}
                                <Link
                                  to="/pricing#website-plans"
                                  className="underline decoration-accent underline-offset-4 transition-colors hover:text-accent"
                                >
                                  one-off website
                                </Link>{' '}
                                you own outright
                              </span>
                            ) : (
                              <span>{feature.text}</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="mt-auto pt-8">
                  <Link
                    to="/pricing#website-plans"
                    className="inline-flex w-full items-center justify-center rounded-button border border-border bg-transparent px-6 py-3.5 text-sm font-medium text-text whitespace-nowrap transition-colors hover:border-text hover:bg-surface-alt"
                  >
                    See one-off websites
                  </Link>
                </div>
              </div>
            </div>

            <p className="mx-auto mt-8 max-w-3xl text-center text-xs leading-relaxed text-muted sm:text-sm">
              Growth Pro is a service we run for you, like hiring a small marketing team. You
              don&apos;t need to learn any software. Prices include GST. Cancel any month and
              we&apos;ll help you take your contacts and reviews with you.
            </p>
            <p className="mx-auto mt-2 max-w-3xl text-center text-xs leading-relaxed text-muted sm:text-sm">
              Messages are only sent to people who have contacted you or agreed to hear from you.
            </p>
          </div>
        </RevealOnScroll>
      </section>

      {/* 6. HOW TO GET STARTED */}
      <section
        id="get-started"
        aria-labelledby="how-to-get-started-heading"
        className="section-shell w-full bg-bg px-5 sm:px-8 lg:px-12 border-t border-border"
      >
        <RevealOnScroll>
          <div className="section-container">
            <div className="max-w-2xl">
              <h2
                id="how-to-get-started-heading"
                className="font-display text-3xl font-bold tracking-[-0.02em] leading-[1.12] text-text sm:text-4xl"
                style={{ textWrap: 'balance' }}
              >
                How to get started
              </h2>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
              {GET_STARTED_STEPS.map((step) => (
                <div
                  key={step.number}
                  className="flex flex-col rounded-card border border-border bg-surface p-7 sm:p-8 shadow-card"
                >
                  <span className="font-mono text-xs font-semibold tracking-[0.16em] text-accent tabular-nums">
                    {step.number}
                  </span>
                  <h3 className="mt-3 font-display text-lg font-bold tracking-[-0.02em] text-text">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* 5. PAYMENT OPTIONS */}
      <section
        id="payment-options"
        aria-labelledby="payment-options-heading"
        className="section-shell w-full bg-bg px-5 sm:px-8 lg:px-12 border-t border-border"
      >
        <RevealOnScroll>
          <div className="section-container">
            <div className="max-w-2xl">
              <h2
                id="payment-options-heading"
                className="font-display text-3xl font-bold tracking-[-0.02em] leading-[1.12] text-text sm:text-4xl"
                style={{ textWrap: 'balance' }}
              >
                Monthly or one-off? Your choice.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted">
                Growth Pro is monthly. If you&apos;d rather own your website outright, choose a
                one-off build.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
              {PAYMENT_OPTIONS.map((option) => (
                <div
                  key={option.title}
                  className="flex flex-col rounded-card border border-border bg-surface pt-5 px-7 pb-7 sm:pt-6 sm:px-8 sm:pb-8 shadow-card"
                >
                  <h3 className="font-display text-lg font-bold tracking-[-0.02em] text-text">
                    {option.title}
                  </h3>
                  <p className="mt-2 font-display text-2xl font-extrabold tracking-[-0.03em] tabular-nums text-text">
                    {option.price}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-muted">
                    {option.description}
                  </p>

                  <div className="mt-auto pt-7">
                    {option.actionType === 'contact' ? (
                      <button
                        type="button"
                        onClick={() => handleContactClick(option.note)}
                        className="group inline-flex items-center gap-2 text-sm font-semibold text-text link-underline hover:text-accent cursor-pointer"
                      >
                        <span>{option.cta}</span>
                        <ArrowRight
                          aria-hidden="true"
                          strokeWidth={1.75}
                          className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5"
                        />
                      </button>
                    ) : (
                      <Link
                        to={option.to}
                        className="group inline-flex items-center gap-2 text-sm font-semibold text-text link-underline hover:text-accent"
                      >
                        <span>{option.cta}</span>
                        <ArrowRight
                          aria-hidden="true"
                          strokeWidth={1.75}
                          className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5"
                        />
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* 6. FEATURE ROWS */}
      <section
        id="features"
        aria-label="Growth Pro features"
        className="section-shell w-full bg-surface-alt px-5 sm:px-8 lg:px-12 border-t border-border"
      >
        <div className="section-container space-y-20 sm:space-y-24 lg:space-y-28">
          {FEATURE_ROWS.map((row, index) => {
            const textFirstOnDesktop = index % 2 === 0;

            return (
              <RevealOnScroll key={row.id}>
                <div
                  id={row.id}
                  className="grid grid-cols-1 items-center gap-10 sm:gap-12 lg:grid-cols-2 lg:gap-16"
                >
                  {/* Illustration: always top on mobile; alternates left/right on desktop */}
                  <div
                    className={`order-1 flex justify-center ${
                      textFirstOnDesktop ? 'lg:order-2' : 'lg:order-1'
                    }`}
                  >
                    <img
                      src={row.imageSrc}
                      alt={row.alt}
                      width={row.width}
                      height={row.height}
                      loading="lazy"
                      className="block w-full max-w-[480px] h-auto mx-auto"
                    />
                  </div>

                  {/* Text */}
                  <div
                    className={`order-2 ${
                      textFirstOnDesktop ? 'lg:order-1' : 'lg:order-2'
                    }`}
                  >
                    <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-accent">
                      {row.eyebrow}
                    </p>
                    <h2
                      className="mt-4 font-display text-3xl font-bold tracking-[-0.02em] leading-[1.12] text-text sm:text-4xl"
                      style={{ textWrap: 'balance' }}
                    >
                      {row.heading}
                    </h2>
                    <p className="mt-5 text-base leading-relaxed text-muted">
                      {row.paragraph}
                    </p>

                    <ul className="mt-7 space-y-3.5 text-sm leading-relaxed sm:text-base">
                      {row.bullets.map((bullet) => (
                        <li key={bullet.lead} className="flex items-start gap-3">
                          <Star
                            aria-hidden="true"
                            strokeWidth={1.75}
                            className="mt-1 h-4 w-4 shrink-0 text-accent"
                          />
                          <span>
                            <strong className="font-semibold text-text">
                              {bullet.lead}
                            </strong>{' '}
                            <span className="text-muted">{bullet.detail}</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </RevealOnScroll>
            );
          })}
        </div>
      </section>

      {/* 7. EVERYTHING ELSE */}
      <section
        id="everything-else"
        aria-labelledby="everything-else-heading"
        className="section-shell w-full bg-bg px-5 sm:px-8 lg:px-12 border-t border-border"
      >
        <RevealOnScroll>
          <div className="section-container">
            <div className="max-w-2xl">
              <h2
                id="everything-else-heading"
                className="font-display text-3xl font-bold tracking-[-0.02em] leading-[1.12] text-text sm:text-4xl"
                style={{ textWrap: 'balance' }}
              >
                Plus everything else, running quietly in the background.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted">
                Not every part needs a demo. These just do their job every day so nothing slips.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-6">
              {BACKGROUND_TOOLS.map((tool, index) => {
                const Icon = tool.icon;

                return (
                  <div
                    key={tool.title}
                    className={`flex flex-col rounded-card border border-border bg-surface p-7 shadow-card ${
                      index < 3 ? 'lg:col-span-2' : 'lg:col-span-3'
                    }`}
                  >
                    <Icon
                      aria-hidden="true"
                      strokeWidth={1.75}
                      className="h-5 w-5 text-text"
                    />
                    <h3 className="mt-5 font-display text-lg font-bold tracking-[-0.02em] text-text">
                      {tool.title}
                    </h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-muted">
                      {tool.description}
                    </p>
                    {tool.hasLink && (
                      <div className="mt-auto pt-5">
                        <button
                          type="button"
                          onClick={() =>
                            handleContactClick(
                              'I would like to explore custom automation options for my business.'
                            )
                          }
                          className="group inline-flex items-center gap-2 text-sm font-semibold text-text link-underline hover:text-accent cursor-pointer"
                        >
                          <span>See automation options</span>
                          <ArrowRight
                            aria-hidden="true"
                            strokeWidth={1.75}
                            className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5"
                          />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* 8. GROWTH ADVANCED */}
      <section
        id="growth-advanced"
        aria-labelledby="growth-advanced-heading"
        className="section-shell w-full bg-surface-alt px-5 sm:px-8 lg:px-12 border-t border-border"
      >
        <RevealOnScroll>
          <div className="section-container">
            <div className="mx-auto max-w-2xl text-center">
              <h2
                id="growth-advanced-heading"
                className="font-display text-3xl font-bold tracking-[-0.02em] leading-[1.12] text-text sm:text-4xl"
                style={{ textWrap: 'balance' }}
              >
                Growth Advanced: more help when you&apos;re ready to grow.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted">
                Already on Growth Pro and want to go further? Add a Growth Advanced package and our
                team runs your Google search listing, local map presence, and ads for you. Pick
                the level that fits, and we price it to your goals on a short call.
              </p>
            </div>

            <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-stretch">
              {ADVANCED_TIERS.map((tier) => {
                const isHighlighted = Boolean(tier.highlighted);

                return (
                  <div
                    key={tier.label}
                    className={`relative flex flex-col rounded-card bg-surface p-7 sm:p-8 ${
                      isHighlighted
                        ? 'plan-card-accent border-[1.5px] border-accent shadow-highlight'
                        : 'plan-card border border-border shadow-card'
                    }`}
                  >
                    <div>
                      <div className="flex items-baseline justify-between gap-3">
                        <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                          {tier.label}
                        </p>
                        {isHighlighted && (
                          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-text whitespace-nowrap">
                            Recommended
                          </span>
                        )}
                      </div>

                      <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <h3 className="font-display text-2xl font-extrabold tracking-[-0.03em] text-text sm:text-3xl">
                          {tier.heading}
                        </h3>
                        <span className="text-xs text-muted">{tier.sideNote}</span>
                      </div>

                      <p className="mt-4 text-sm leading-relaxed text-muted">
                        {tier.description}
                      </p>
                    </div>

                    <div aria-hidden="true" className="my-6 h-px w-full bg-border" />

                    <ul className="space-y-3 text-sm leading-relaxed text-text">
                      {tier.features.map((feature) => (
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
                        onClick={() => handleContactClick(tier.note)}
                        className={`w-full rounded-button px-5 py-3 text-sm font-medium whitespace-nowrap transition-all duration-150 cursor-pointer ${
                          isHighlighted
                            ? 'bg-btn-primary-bg text-btn-primary-text hover:opacity-90'
                            : 'border border-border bg-transparent text-text hover:border-text hover:bg-surface-alt'
                        }`}
                      >
                        Book a call to scope it
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-relaxed text-muted sm:text-sm">
              Growth Advanced sits on top of Growth Pro. Pricing is agreed on a call, and you only
              pay for the level you choose. Ad spend is billed by Google separately.
            </p>
          </div>
        </RevealOnScroll>
      </section>

      {/* 9. FAQ */}
      <section
        id="faq"
        aria-labelledby="growth-faq-heading"
        className="section-shell w-full bg-bg px-5 sm:px-8 lg:px-12 border-t border-border"
      >
        <RevealOnScroll>
          <div className="mx-auto max-w-[760px]">
            <h2
              id="growth-faq-heading"
              className="font-display text-3xl font-bold tracking-[-0.02em] leading-[1.12] text-text sm:text-4xl"
            >
              Growth questions, answered simply.
            </h2>
            <p className="mt-3 text-[13.5px] text-muted">
              Can&apos;t find your question? Just call or email.
            </p>

            <div className="mt-10 divide-y divide-border border-y border-border">
              {GROWTH_FAQS.map((item, index) => (
                <details key={item.question} open={index === 0} className="group">
                  <summary className="flex w-full list-none items-center justify-between gap-6 py-5 sm:py-6 text-left text-base sm:text-lg font-semibold tracking-[-0.01em] text-text transition-colors hover:text-accent cursor-pointer [&::-webkit-details-marker]:hidden">
                    <span>{item.question}</span>
                    <ChevronDown
                      aria-hidden="true"
                      strokeWidth={1.75}
                      className="h-5 w-5 shrink-0 text-text transition-transform duration-200 group-open:rotate-180"
                    />
                  </summary>
                  <div className="pb-6 pr-8 text-sm sm:text-base leading-relaxed text-muted">
                    {item.hasOneOffLink ? (
                      <>
                        Growth Pro is a monthly service, so we run the website for you. If you want
                        to own it outright, choose a{' '}
                        <Link
                          to="/pricing#website-plans"
                          className="link-underline font-medium text-text hover:text-accent"
                        >
                          one-off website
                        </Link>{' '}
                        instead. Starting from $500, you get the files, logins, and everything else.
                      </>
                    ) : (
                      item.answer
                    )}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* 12. CONTACT */}
      <FinalCtaSection sectionBg="bg-surface-alt" />
    </div>
  );
}
