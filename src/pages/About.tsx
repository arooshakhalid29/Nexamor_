import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Building2,
  Check,
  FileText,
  KeyRound,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react';
import RevealOnScroll from '../components/RevealOnScroll';
import FinalCtaSection from '../components/FinalCtaSection';
import { scrollToContactSection } from '../utils/scrollToContact';

// Set these paths when illustrations are uploaded:
const ABOUT_FOUNDER_IMAGE: string | null =
  '/assets/aistudio/Gemini_Generated_Image_mkvt87mkvt87mkvt_12859a90.jpeg';
const ABOUT_TEAM_IMAGE: string | null = null;

const ABN_NUMBER = '';

const FOUNDER_FACTS = [
  {
    lead: 'Based in Australia.',
    detail: 'A real person you can call, with local invoices and local accountability.',
  },
  {
    lead: 'Written agreement first.',
    detail: "Your price, timeline, and what's included are agreed in writing before we start.",
  },
  {
    lead: 'You own everything.',
    detail:
      "Every login and file is handed over to you when we finish, and it's written into our agreement.",
  },
  {
    lead: '48-hour delivery.',
    detail:
      'Starter websites go live within 48 hours once we have your form, photos, and text. Showcase and Industry Specialist sites take 7 business days.',
  },
  {
    lead: 'Built for everyone.',
    detail:
      'We build sites that are easy to read and use on any phone or computer, including for people who use screen readers.',
  },
  {
    lead: 'Quick replies.',
    detail: 'If something needs fixing after launch, we respond fast and keep it simple.',
  },
];

interface StandardItem {
  icon: LucideIcon;
  label: string;
  detail: string;
  hidden?: boolean;
}

const STANDARDS: StandardItem[] = [
  {
    icon: Building2,
    label: `ABN ${ABN_NUMBER}`,
    detail: 'A registered Australian business.',
    hidden: !ABN_NUMBER,
  },
  {
    icon: FileText,
    label: 'Agreement in writing',
    detail: 'Price and timeline agreed upfront.',
  },
  {
    icon: KeyRound,
    label: '100% ownership',
    detail: 'Logins and files handed over.',
  },
  {
    icon: ShieldCheck,
    label: 'Secure from day one',
    detail: 'Every site launches with a secure connection.',
  },
];

const STORY_PROMISES = [
  {
    lead: 'One flat price.',
    detail:
      "You'll know the full cost before we start. No hourly meetings, no surprise invoices.",
  },
  {
    lead: '48 hours.',
    detail:
      "Starter websites go live within 48 hours once we receive your form, photos, and text (Showcase and Industry Specialist sites take 7 business days). If we run late on our side, we keep working at no extra cost until it's done.",
  },
  {
    lead: 'You keep everything.',
    detail:
      'When we finish, you get every login and file, explained in plain English. Nothing is kept in our name.',
  },
];

const VALUES = [
  {
    value: '48 hours',
    title: 'From brief to launch',
    description: 'Starter websites go live within 48 hours once we have your form, photos, and text.',
  },
  {
    value: '100%',
    title: 'Yours to keep',
    description: 'You own the website, files, and logins when we finish.',
  },
  {
    value: '1 price',
    title: 'Flat and agreed upfront',
    description: 'No surprise invoices and no hourly billing.',
  },
  {
    value: 'Unlimited',
    title: "Changes until you're happy",
    description: 'We keep refining until you love it.',
  },
];

const DIFFERENCE_ROWS = [
  {
    label: 'Price',
    nexamor: '$500 flat, agreed in writing',
    agency: 'Often $1,500 to $5,000',
  },
  {
    label: 'Time to go live',
    nexamor: '48 hours for our Starter website',
    agency: 'Often several weeks',
  },
  {
    label: 'Who builds it',
    nexamor: 'Designed and built by us, here in Australia',
    agency: 'Work is often passed to other teams or overseas',
  },
  {
    label: 'Who you talk to',
    nexamor: 'The person building your site',
    agency: 'Often an account manager or support team',
  },
  {
    label: 'Extra charges',
    nexamor: 'None. The price is agreed before we start.',
    agency: 'Charges for changes and extras are common',
  },
  {
    label: 'Ownership',
    nexamor: 'You own everything, with every login handed over',
    agency: 'Some keep control of your logins',
  },
  {
    label: 'Changes',
    nexamor: "Unlimited until you're happy",
    agency: 'Often charged per change',
  },
  {
    label: 'After launch',
    nexamor: 'Leave any time, with no exit fees',
    agency: 'Some charge to hand over your files',
  },
];

export default function About() {
  const visibleStandards = STANDARDS.filter((item) => !item.hidden);

  const handleContactClick = (_note?: string) => {
    scrollToContactSection();
  };

  useEffect(() => {
    const prevTitle = document.title;
    const pageTitle = 'About Nexamor | Web Design in Australia';
    const pageDescription =
      'Meet Danesh, a software engineer and the founder of Nexamor. Websites built in Australia with nothing outsourced, Starter live in 48 hours, unlimited changes. You own everything.';
    const origin = window.location.origin;
    const canonicalUrl = `${origin}/about`;
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
          '@type': 'AboutPage',
          '@id': `${canonicalUrl}#aboutpage`,
          url: canonicalUrl,
          name: pageTitle,
          description: pageDescription,
          breadcrumb: { '@id': `${canonicalUrl}#breadcrumb` },
          mainEntity: { '@id': `${origin}/#organization` },
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
              name: 'About',
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
          address: {
            '@type': 'PostalAddress',
            addressCountry: 'AU',
          },
          areaServed: 'Australia',
          founder: { '@id': `${canonicalUrl}#founder` },
          sameAs: [],
        },
        {
          '@type': 'Person',
          '@id': `${canonicalUrl}#founder`,
          name: 'Danesh',
          jobTitle: 'Founder',
          email: 'daneshinaus@gmail.com',
          telephone: '+61435758455',
          worksFor: { '@id': `${origin}/#organization` },
        },
      ],
    };

    const existingScript = document.getElementById('about-jsonld');
    if (existingScript) existingScript.remove();

    const script = document.createElement('script');
    script.id = 'about-jsonld';
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
      <section className="section-shell w-full bg-bg px-5 sm:px-8 lg:px-12">
        <div className="section-container">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow">ABOUT NEXAMOR</p>
            <h1
              className="mt-4 font-display text-4xl font-bold tracking-[-0.02em] leading-[1.08] text-text sm:text-5xl lg:text-[3.35rem]"
              style={{ textWrap: 'balance' }}
            >
              A simple website, built by
              <br />
              people who answer the phone.
            </h1>
            <p className="mt-5 text-base leading-relaxed text-muted sm:text-lg">
              We build clear, professional websites for small businesses at a fair flat price. You
              get unlimited changes until you&apos;re happy, and when it&apos;s done, everything
              belongs to you.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => handleContactClick('I am ready to start my website project.')}
                className="group inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-button bg-btn-primary-bg px-6 py-3.5 text-sm font-medium text-btn-primary-text whitespace-nowrap transition-opacity hover:opacity-90 cursor-pointer"
              >
                <span>Start your project</span>
                <ArrowRight
                  aria-hidden="true"
                  className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5"
                />
              </button>

              <Link
                to="/pricing"
                className="inline-flex w-full sm:w-auto items-center justify-center rounded-button border border-border bg-surface px-6 py-3.5 text-sm font-medium text-text whitespace-nowrap transition-colors hover:border-text hover:bg-surface-alt"
              >
                See pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* AT A GLANCE */}
      <section className="w-full bg-bg pb-16 sm:pb-24 px-5 sm:px-8 lg:px-12">
        <RevealOnScroll>
          <div className="section-container">
            <div className="mx-auto max-w-3xl rounded-card border border-border bg-surface p-7 sm:p-9 shadow-card">
              <h2 className="font-display text-xl font-bold tracking-[-0.02em] text-text sm:text-2xl">
                At a glance
              </h2>
              <p className="mt-3 text-base leading-relaxed text-muted">
                Nexamor is a web design business in Australia, founded by Danesh. We
                build professional websites for small businesses at flat prices, with Starter sites
                live in 48 hours (and Showcase or Industry Specialist sites in 7 business days),
                unlimited changes, and full ownership handed to you.
              </p>
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* 2. MEET THE FOUNDER */}
      <section
        id="founder"
        aria-labelledby="founder-heading"
        className="section-shell scroll-mt-24 w-full bg-surface-alt px-5 sm:px-8 lg:px-12 border-t border-border"
      >
        <RevealOnScroll>
          <div className="section-container">
            <div className="grid grid-cols-1 items-center gap-10 sm:gap-12 lg:grid-cols-2 lg:gap-16">
              {/* Illustration LEFT on desktop, TOP on mobile */}
              <div className="order-1 flex justify-center">
                {ABOUT_FOUNDER_IMAGE ? (
                  <img
                    src={ABOUT_FOUNDER_IMAGE}
                    alt="Illustration of Danesh, founder of Nexamor"
                    width={480}
                    height={600}
                    loading="lazy"
                    className="block w-full max-w-[480px] h-auto mix-blend-multiply"
                  />
                ) : (
                  <div
                    role="img"
                    aria-label="Illustration of Danesh, founder of Nexamor"
                    className="flex aspect-[4/5] w-full max-w-[440px] items-center justify-center rounded-card border border-border bg-surface px-6 text-center"
                  >
                    <span className="text-sm font-medium text-muted">about-founder</span>
                  </div>
                )}
              </div>

              {/* Text RIGHT on desktop, BOTTOM on mobile */}
              <div className="order-2">
                <p className="eyebrow">FOUNDER, NEXAMOR</p>
                <h2
                  id="founder-heading"
                  className="mt-3 font-display text-3xl font-bold tracking-[-0.02em] leading-[1.12] text-text sm:text-4xl"
                >
                  Danesh
                </h2>
                <p className="mt-5 text-base leading-relaxed text-muted">
                  Danesh started Nexamor to make getting a website simple for small businesses. The
                  idea is simple: a website should help your business, not hold it hostage. So
                  every website we build comes with one flat price, a clear timeline, and full
                  ownership handed to you.
                </p>
                <p className="mt-4 text-base leading-relaxed text-muted">
                  Working closely with Australian tradies, clinics, cafés, and local service
                  operators showed him how often small businesses are overcharged for simple sites
                  they can&apos;t even edit. Nexamor puts clear scope, speed, and full client
                  ownership back at the centre of every build.
                </p>

                <ul className="mt-7 space-y-3 text-sm leading-relaxed sm:text-base">
                  {FOUNDER_FACTS.map((fact) => (
                    <li key={fact.lead} className="flex items-start gap-3">
                      <Check
                        aria-hidden="true"
                        strokeWidth={1.75}
                        className="mt-1 h-4 w-4 shrink-0 text-accent"
                      />
                      <span>
                        <strong className="font-semibold text-text">{fact.lead}</strong>{' '}
                        <span className="text-muted">{fact.detail}</span>
                      </span>
                    </li>
                  ))}
                </ul>

                <div aria-hidden="true" className="my-7 h-px w-full bg-border" />

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <p className="eyebrow">EMAIL</p>
                    <p className="mt-1.5 text-sm font-medium text-text">
                      <a
                        href="mailto:daneshinaus@gmail.com"
                        className="transition-colors hover:text-accent underline decoration-border underline-offset-4 hover:decoration-accent"
                      >
                        daneshinaus@gmail.com
                      </a>
                    </p>
                  </div>
                  <div>
                    <p className="eyebrow">PHONE</p>
                    <p className="mt-1.5 text-sm font-medium text-text">
                      <a
                        href="tel:+61435758455"
                        className="transition-colors hover:text-accent underline decoration-border underline-offset-4 hover:decoration-accent"
                      >
                        0435 758 455
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* OUR STANDARDS STRIP */}
      <section
        id="standards"
        aria-label="Our standards"
        className="w-full bg-surface py-8 sm:py-10 px-5 sm:px-8 lg:px-12 border-t border-border"
      >
        <RevealOnScroll>
          <div className="section-container">
            <div
              className={`grid gap-6 sm:gap-8 ${
                visibleStandards.length === 4
                  ? 'grid-cols-2 lg:grid-cols-4'
                  : 'grid-cols-1 sm:grid-cols-3'
              }`}
            >
              {visibleStandards.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-start gap-3.5">
                    <Icon
                      aria-hidden="true"
                      strokeWidth={1.75}
                      className="mt-0.5 h-5 w-5 shrink-0 text-accent"
                    />
                    <div>
                      <p className="font-display text-sm font-bold tracking-[-0.01em] text-text sm:text-base">
                        {item.label}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-muted">{item.detail}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* 3. OUR STORY */}
      <section
        id="our-story"
        aria-labelledby="our-story-heading"
        className="section-shell w-full bg-bg px-5 sm:px-8 lg:px-12 border-t border-border"
      >
        <RevealOnScroll>
          <div className="mx-auto max-w-[680px] text-left">
            <h2
              id="our-story-heading"
              className="font-display text-3xl font-bold tracking-[-0.02em] leading-[1.12] text-text sm:text-4xl"
            >
              Why we started Nexamor
            </h2>

            <div className="my-8">
              <img
                src="/assets/aistudio/Gemini_Generated_Image_u6m96hu6m96hu6m9_4c0d25d6.jpeg"
                alt="Illustration of Danesh and colleagues talking in the studio"
                width={680}
                height={383}
                loading="lazy"
                className="block w-full h-auto mix-blend-multiply"
              />
            </div>

            <div className="mt-6 space-y-5 text-base leading-[1.7] text-muted sm:text-[17px]">
              <p>
                Many small business owners have the same story. They paid for a website, and then
                they got stuck. The person who built it disappeared. Changing a phone number cost
                extra. They didn&apos;t have the passwords, and nobody could tell them where the
                website lived.
              </p>
              <p className="font-semibold text-text">
                That isn&apos;t a website. That&apos;s being held hostage.
              </p>
            </div>

            <h3 className="mt-10 font-display text-xl font-bold tracking-[-0.02em] text-text sm:text-2xl">
              Our simple answer
            </h3>
            <p className="mt-3 text-base leading-[1.7] text-muted sm:text-[17px]">
              Nexamor is the straightforward alternative. Three promises, written into every
              agreement:
            </p>

            <ul className="mt-6 space-y-4">
              {STORY_PROMISES.map((promise) => (
                <li
                  key={promise.lead}
                  className="flex items-start gap-3 text-base leading-[1.7] sm:text-[17px]"
                >
                  <Check
                    aria-hidden="true"
                    className="mt-1.5 h-4 w-4 shrink-0 text-accent"
                  />
                  <div>
                    <strong className="font-semibold text-text">{promise.lead}</strong>{' '}
                    <span className="text-muted">{promise.detail}</span>
                  </div>
                </li>
              ))}
            </ul>

            <p className="mt-6 text-base leading-[1.7] text-muted sm:text-[17px]">
              That&apos;s it. We won&apos;t pressure you into a marketing plan or a long contract
              you don&apos;t need. Care plans are optional and run month to month, and you can
              cancel any month.
            </p>

            <h3 className="mt-10 font-display text-xl font-bold tracking-[-0.02em] text-text sm:text-2xl">
              What we won&apos;t do
            </h3>
            <p className="mt-3 text-base leading-[1.7] text-muted sm:text-[17px]">
              We won&apos;t take payment for a project we don&apos;t think we can deliver. We
              won&apos;t sell you a bigger plan than you need. We won&apos;t lock you into a long
              contract. And we will never hold your passwords back. If we&apos;re not the right
              fit, we&apos;ll tell you on the call and point you to someone who is.
            </p>

            <h3 className="mt-10 font-display text-xl font-bold tracking-[-0.02em] text-text sm:text-2xl">
              What to do next
            </h3>
            <p className="mt-3 text-base leading-[1.7] text-muted sm:text-[17px]">
              If this sounds like what you&apos;ve been looking for,{' '}
              <button
                type="button"
                onClick={() => handleContactClick('I am ready to start my website project.')}
                className="link-underline font-semibold text-text hover:text-accent cursor-pointer"
              >
                start your project
              </button>{' '}
              and fill in a short form, which takes about a minute. Or{' '}
              <button
                type="button"
                onClick={() => handleContactClick('I would like to book a free 30-minute call.')}
                className="link-underline font-semibold text-text hover:text-accent cursor-pointer"
              >
                book a free 30-minute call
              </button>
              . Either way, no pressure and no obligation.
            </p>

            <p className="mt-8 font-display text-base font-bold text-text">Danesh</p>
          </div>
        </RevealOnScroll>
      </section>

      {/* BUILT IN AUSTRALIA */}
      <section
        id="built-in-australia"
        aria-labelledby="built-in-australia-heading"
        className="section-shell w-full bg-surface-alt px-5 sm:px-8 lg:px-12 border-t border-border"
      >
        <RevealOnScroll>
          <div className="section-container">
            <div className="grid grid-cols-1 items-start gap-10 sm:gap-12 lg:grid-cols-12 lg:gap-14">
              <div className="lg:col-span-6">
                <h2
                  id="built-in-australia-heading"
                  className="font-display text-3xl font-bold tracking-[-0.02em] leading-[1.12] text-text sm:text-4xl"
                  style={{ textWrap: 'balance' }}
                >
                  Built in Australia, for Australian businesses
                </h2>
                <p className="mt-5 text-base leading-relaxed text-muted">
                  Nexamor is an Australian web business. Every website we make is designed and built
                  here, by us, with nothing outsourced. That means one person is responsible for
                  your project from start to finish.
                </p>

                <div className="mt-8 space-y-6">
                  <div>
                    <h3 className="font-display text-lg font-bold tracking-[-0.015em] text-text">
                      What &apos;nothing outsourced&apos; means
                    </h3>
                    <p className="mt-2 text-base leading-relaxed text-muted">
                      We don&apos;t hand your project to another agency, a freelancer, or an
                      overseas team. The design, the building, the setup, and the handover are all
                      done by us, so there&apos;s no game of pass-the-parcel and no one to chase.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-display text-lg font-bold tracking-[-0.015em] text-text">
                      Who we work with
                    </h3>
                    <p className="mt-2 text-base leading-relaxed text-muted">
                      We work with small businesses across Australia, from tradies and clinics to
                      salons, cafés, real estate agents, and online shops. Whether you&apos;re in
                      a capital city or a country town, you get the same service.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-display text-lg font-bold tracking-[-0.015em] text-text">
                      Local, in all the ways that matter
                    </h3>
                    <p className="mt-2 text-base leading-relaxed text-muted">
                      Your prices are in Australian dollars with GST included. You get a clear
                      written agreement before we start. And you can call or email us during
                      Australian business hours and talk to a real person.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-display text-lg font-bold tracking-[-0.015em] text-text">
                      Real people, real answers
                    </h3>
                    <p className="mt-2 text-base leading-relaxed text-muted">
                      You&apos;ll never be passed around or left waiting. If you have a question,
                      you talk to the person building your site. If something needs fixing after
                      launch, you tell us and we handle it.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-display text-lg font-bold tracking-[-0.015em] text-text">
                      Built for how customers choose in 2027
                    </h3>
                    <p className="mt-2 text-base leading-relaxed text-muted">
                      Most customers look at a business on their phone before they call, visit, or
                      buy. We build fast, clear, easy-to-use websites that help local businesses get
                      found and get chosen, now and in 2027.
                    </p>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm font-semibold">
                  <Link
                    to="/pricing"
                    className="link-underline inline-flex items-center gap-1.5 text-text hover:text-accent"
                  >
                    <span>See our flat website pricing</span>
                    <ArrowRight aria-hidden="true" className="h-4 w-4" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleContactClick()}
                    className="link-underline inline-flex items-center gap-1.5 text-text hover:text-accent cursor-pointer"
                  >
                    <span>Get in touch</span>
                  </button>
                </div>
              </div>

              <div className="flex justify-center lg:col-span-6 lg:justify-end lg:sticky lg:top-24">
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
        </RevealOnScroll>
      </section>

      {/* THE NEXAMOR DIFFERENCE */}
      <section
        id="difference"
        aria-labelledby="difference-heading"
        className="section-shell scroll-mt-24 w-full bg-bg px-5 sm:px-8 lg:px-12 border-t border-border"
      >
        <RevealOnScroll>
          <div className="section-container">
            <div className="mx-auto max-w-[680px] text-left">
              <h2
                id="difference-heading"
                className="font-display text-3xl font-bold tracking-[-0.02em] leading-[1.12] text-text sm:text-4xl"
              >
                The Nexamor difference
              </h2>

              <div className="mt-6 space-y-5 text-base leading-[1.7] text-muted sm:text-[17px]">
                <p>
                  Most small businesses are told a website takes weeks and costs thousands, and that
                  every change costs extra. We built Nexamor to work differently, so you always
                  know what you&apos;re getting before you start.
                </p>
                <p>
                  We design and build every website ourselves, here in Australia, with nothing
                  outsourced. You pay one flat price, agreed in writing, with no hourly billing and
                  no surprise charges. Our Starter website goes live in 48 hours, and you can ask
                  for changes until you&apos;re happy.
                </p>
                <p>
                  You talk to the person building your site, not a call centre or a ticket system.
                  When we finish, every login and file is handed over to you, and you&apos;re free
                  to leave any time with no exit fees.
                </p>
                <p className="text-muted">Here&apos;s how that compares, side by side.</p>
              </div>
            </div>

            <div className="mx-auto mt-10 max-w-[920px]">
              <div className="overflow-x-auto rounded-card border border-border bg-surface shadow-card">
                <table className="w-full min-w-[640px] border-collapse text-left">
                  <caption className="sr-only">
                    Nexamor compared with a typical agency
                  </caption>
                  <thead>
                    <tr className="border-b border-border">
                      <th
                        scope="col"
                        className="w-[24%] py-5 pl-6 pr-4 text-xs font-semibold uppercase tracking-[0.16em] text-muted"
                      >
                        <span className="sr-only">Area</span>
                      </th>
                      <th
                        scope="col"
                        className="w-[38%] border-x-[1.5px] border-t-[1.5px] border-accent bg-surface-alt px-6 py-5 font-display text-lg font-bold tracking-[-0.02em] text-text"
                      >
                        Nexamor
                      </th>
                      <th
                        scope="col"
                        className="w-[38%] px-6 py-5 font-display text-lg font-bold tracking-[-0.02em] text-muted"
                      >
                        A typical agency
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {DIFFERENCE_ROWS.map((row, index) => {
                      const isLast = index === DIFFERENCE_ROWS.length - 1;
                      return (
                        <tr key={row.label}>
                          <th
                            scope="row"
                            className="py-4 pl-6 pr-4 text-sm font-bold text-text align-top"
                          >
                            {row.label}
                          </th>
                          <td
                            className={`border-x-[1.5px] border-accent bg-surface-alt/60 px-6 py-4 text-sm leading-relaxed font-medium text-text align-top ${
                              isLast ? 'border-b-[1.5px]' : ''
                            }`}
                          >
                            {row.nexamor}
                          </td>
                          <td className="px-6 py-4 text-sm leading-relaxed text-muted align-top">
                            {row.agency}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <p className="mt-4 text-[13px] text-muted">
                Based on common agency practices. Not every agency works this way.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm font-semibold">
                <Link
                  to="/pricing"
                  className="link-underline inline-flex items-center gap-1.5 text-text hover:text-accent"
                >
                  <span>See our flat website pricing</span>
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
                <button
                  type="button"
                  onClick={() => handleContactClick()}
                  className="link-underline inline-flex items-center gap-1.5 text-text hover:text-accent cursor-pointer"
                >
                  <span>Get in touch</span>
                </button>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* 4. THE TEAM (only rendered when about-team is uploaded) */}
      {ABOUT_TEAM_IMAGE && (
        <section
          id="team"
          aria-labelledby="team-heading"
          className="section-shell w-full bg-surface-alt px-5 sm:px-8 lg:px-12 border-t border-border"
        >
          <RevealOnScroll>
            <div className="section-container text-center">
              <p className="eyebrow">THE TEAM</p>
              <h2
                id="team-heading"
                className="mt-4 font-display text-3xl font-bold tracking-[-0.02em] leading-[1.12] text-text sm:text-4xl"
              >
                The people behind your website
              </h2>
              <p className="mx-auto mt-4 max-w-[640px] text-base leading-relaxed text-muted">
                [One or two sentences about who works with Danesh and what each person does. Only
                include real team members.]
              </p>
              <div className="mt-10 flex justify-center">
                <img
                  src={ABOUT_TEAM_IMAGE}
                  alt="Illustration of the Nexamor team"
                  width={760}
                  height={428}
                  loading="lazy"
                  className="block w-full max-w-[760px] h-auto mix-blend-multiply"
                />
              </div>
            </div>
          </RevealOnScroll>
        </section>
      )}

      {/* 5. WHAT WE STAND FOR */}
      <section
        id="values"
        aria-labelledby="values-heading"
        className="section-shell w-full bg-surface-alt px-5 sm:px-8 lg:px-12 border-t border-border"
      >
        <RevealOnScroll>
          <div className="section-container">
            <div className="mx-auto max-w-2xl text-center">
              <h2
                id="values-heading"
                className="font-display text-3xl font-bold tracking-[-0.02em] leading-[1.12] text-text sm:text-4xl"
              >
                What you can count on
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted">
                Four simple promises we keep with every client.
              </p>
            </div>

            <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {VALUES.map((item) => (
                <div
                  key={item.title}
                  className="flex flex-col rounded-card border border-border bg-surface p-7 shadow-card sm:p-8"
                >
                  <div className="font-display text-3xl font-extrabold tracking-[-0.03em] leading-none tabular-nums text-text sm:text-4xl">
                    {item.value}
                  </div>
                  <div aria-hidden="true" className="my-5 h-[2px] w-8 bg-accent" />
                  <h3 className="font-display text-base font-bold tracking-[-0.02em] text-text">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* 6. CONTACT */}
      <FinalCtaSection sectionBg="bg-bg" />
    </div>
  );
}
