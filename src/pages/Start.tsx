import { useEffect, useState, type FormEvent } from 'react';
import {
  AlertCircle,
  ArrowDown,
  ArrowRight,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  FileText,
  Loader2,
  Phone,
} from 'lucide-react';
import { getStickyHeaderOffset } from '../utils/scrollToContact';
import BookCallEmbed from '../components/BookCallEmbed';
import { APPS_SCRIPT_URL } from '../config/appsScript';

const WEBSITE_OPTIONS = [
  'Not sure yet, help me pick',
  'Starter website $500',
  'Growth website from $700',
  'Online store from $1,500',
  'Growth Pro $297 a month',
  'Logo design $199',
];

const NEXT_STEPS = [
  {
    step: 'Step 1',
    title: 'We listen',
    description:
      'By form, call or phone. Danesh reads it personally and replies same day, usually within 90 minutes.',
  },
  {
    step: 'Step 2',
    title: 'Fit check and flat price',
    description:
      'A confirmed scope, a launch date, and a price in writing. If your job needs more, we quote it plainly.',
  },
  {
    step: 'Step 3',
    title: 'Kickoff',
    description:
      'Once you approve, we send your short form. The 48-hour clock starts when we have your form, photos and text.',
  },
];

const START_FAQS = [
  {
    question: 'Does sending the brief commit me to anything?',
    answer:
      'No. The brief just lets us quote properly. You see a flat price first and decide from there.',
  },
  {
    question: 'What do I need to have ready?',
    answer:
      'Just a rough idea of what your business does. Photos and text can come later; the 48 hours start once we have them.',
  },
  {
    question: 'How fast can I actually launch?',
    answer:
      'A Starter website goes live in 48 hours from when we have your form, photos and text. Showcase and Industry Specialist websites take 7 business days.',
  },
  {
    question: "What if I'm not sure Nexamor is the right fit?",
    answer: "Book a free call. If we're not the right fit, we'll tell you honestly.",
  },
];

function scrollToSectionById(sectionId: string) {
  if (typeof document === 'undefined') return;
  const target = document.getElementById(sectionId);
  if (!target) return;

  const offset = getStickyHeaderOffset();
  const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - offset);
  const prefersReducedMotion = Boolean(
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  );

  window.scrollTo({
    top,
    left: 0,
    behavior: prefersReducedMotion ? 'instant' : 'smooth',
  });
}

export default function Start() {
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [websiteType, setWebsiteType] = useState(WEBSITE_OPTIONS[0]);
  const [details, setDetails] = useState('');
  const [briefHoneypot, setBriefHoneypot] = useState('');
  const [isSubmittingBrief, setIsSubmittingBrief] = useState(false);
  const [briefError, setBriefError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  useEffect(() => {
    const prevTitle = document.title;
    const pageTitle = 'Get in Touch | Start Your Website Project | Nexamor';
    const pageDescription =
      'Send a short project brief, book a free 30-minute call, or call 0435 758 455. Based in Australia, replying same day, usually within 90 minutes with a flat price in writing.';
    const origin = window.location.origin;
    const canonicalUrl = `${origin}/start`;

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

    return () => {
      document.title = prevTitle;
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

  const handleBriefSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmittingBrief) return;

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = details.trim();

    if (!trimmedName || trimmedName.length < 2) {
      setBriefError('Please enter your name.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setBriefError('Please enter a valid email address.');
      return;
    }
    if (!trimmedMessage) {
      setBriefError('Please tell us what you need.');
      return;
    }

    const endpoint = APPS_SCRIPT_URL.trim();
    if (!endpoint) {
      setBriefError(
        'Something went wrong. Email nexamor1@gmail.com or call 0435 758 455.'
      );
      return;
    }

    setIsSubmittingBrief(true);
    setBriefError('');

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'brief',
          name: trimmedName,
          businessName: businessName.trim(),
          email: trimmedEmail,
          phone: phone.trim(),
          websiteType,
          message: trimmedMessage,
          honeypot: briefHoneypot,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data?.ok) {
        setBriefError(
          data?.error ||
            'Something went wrong. Email nexamor1@gmail.com or call 0435 758 455.'
        );
        return;
      }

      setSubmitted(true);
    } catch {
      setBriefError(
        'Something went wrong. Email nexamor1@gmail.com or call 0435 758 455.'
      );
    } finally {
      setIsSubmittingBrief(false);
    }
  };

  return (
    <div className="bg-bg text-text">
      {/* 1. HERO (two columns) */}
      <section className="section-shell w-full bg-bg px-5 sm:px-8 lg:px-12">
        <div className="section-container">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-14">
            {/* Left column */}
            <div className="lg:col-span-6 xl:col-span-7">
              <p className="eyebrow">GET IN TOUCH</p>
              <h1
                className="mt-4 max-w-xl font-display text-4xl font-extrabold tracking-[-0.03em] leading-[1.06] text-text sm:text-5xl lg:text-[3.25rem]"
                style={{ textWrap: 'balance' }}
              >
                Tell us what you need. We reply same day.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-[17px]">
                Three ways in: send a short brief, book a free call, or pick up the phone. Every
                one reaches the person who builds your website, with a flat price back the same day,
                usually within 90 minutes.
              </p>

              <ul className="mt-7 max-w-xl space-y-3.5 text-sm leading-relaxed sm:text-[15px]">
                <li className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-text text-surface"
                  >
                    <Check className="h-3 w-3 stroke-[2.5]" />
                  </span>
                  <span className="text-muted">
                    <strong className="font-semibold text-text">Read personally by Danesh.</strong>{' '}
                    No call centre, no ticket system.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-text text-surface"
                  >
                    <Check className="h-3 w-3 stroke-[2.5]" />
                  </span>
                  <span className="text-muted">
                    <strong className="font-semibold text-text">A flat price in writing.</strong>{' '}
                    No hourly rates, no surprise invoices, GST included.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-text text-surface"
                  >
                    <Check className="h-3 w-3 stroke-[2.5]" />
                  </span>
                  <span className="text-muted">
                    <strong className="font-semibold text-text">
                      Reaching out commits you to nothing.
                    </strong>{' '}
                    You decide once you&apos;ve seen the price.
                  </span>
                </li>
              </ul>

              <blockquote className="mt-8 max-w-lg border-l border-border pl-4 text-sm italic leading-relaxed text-muted sm:text-[15px]">
                Websites like this typically cost $1,500 to $5,000 from an agency. With Nexamor, a
                Starter site is $500 and live in 48 hours.
              </blockquote>
            </div>

            {/* Right column */}
            <div className="lg:col-span-6 xl:col-span-5">
              <div className="rounded-card border border-border bg-surface p-6 sm:p-7 shadow-highlight">
                <div className="border-b border-border pb-4">
                  <div className="flex items-center gap-2 text-xs text-muted">
                    <span
                      aria-hidden="true"
                      className="inline-block h-2 w-2 shrink-0 rounded-full bg-emerald-500"
                    />
                    <span>Replying same day, usually within 90 minutes</span>
                  </div>
                  <h2
                    className="mt-1.5 font-display text-base font-bold tracking-[-0.015em] text-text sm:text-[17px]"
                    style={{ textWrap: 'balance' }}
                  >
                    Pick a path. All three reach the same person.
                  </h2>
                </div>

                <div className="mt-4 space-y-3.5">
                  {/* Path 1 */}
                  <div className="rounded-[10px] border border-border bg-bg/40 p-4 sm:p-5">
                    <div className="flex items-start gap-3.5">
                      <span
                        aria-hidden="true"
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-text"
                      >
                        <FileText className="h-4 w-4" />
                      </span>
                      <div>
                        <h3 className="font-display text-sm font-bold tracking-[-0.01em] text-text">
                          Send the brief
                        </h3>
                        <p className="mt-1 text-xs leading-relaxed text-muted sm:text-[13px]">
                          A one-minute form. Flat price back same day, usually within 90 minutes.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => scrollToSectionById('brief')}
                      className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-[8px] bg-btn-primary-bg px-4 py-2.5 text-xs font-semibold text-btn-primary-text transition-opacity hover:opacity-90 cursor-pointer sm:text-sm"
                    >
                      <span>Open the brief</span>
                      <ArrowDown aria-hidden="true" className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Path 2 */}
                  <div className="rounded-[10px] border border-border bg-bg/40 p-4 sm:p-5">
                    <div className="flex items-start gap-3.5">
                      <span
                        aria-hidden="true"
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-text"
                      >
                        <Calendar className="h-4 w-4" />
                      </span>
                      <div>
                        <h3 className="font-display text-sm font-bold tracking-[-0.01em] text-text">
                          Book a free call
                        </h3>
                        <p className="mt-1 text-xs leading-relaxed text-muted sm:text-[13px]">
                          No prep, no pitch, we cover scope, timeline and price.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => scrollToSectionById('call')}
                      className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-[8px] bg-btn-primary-bg px-4 py-2.5 text-xs font-semibold text-btn-primary-text transition-opacity hover:opacity-90 cursor-pointer sm:text-sm"
                    >
                      <span>Pick a time</span>
                      <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Path 3 */}
                  <div className="rounded-[10px] border border-border bg-bg/40 p-4 sm:p-5">
                    <div className="flex items-start gap-3.5">
                      <span
                        aria-hidden="true"
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-text"
                      >
                        <Phone className="h-4 w-4" />
                      </span>
                      <div>
                        <h3 className="font-display text-sm font-bold tracking-[-0.01em] text-text">
                          Call us directly
                        </h3>
                        <p className="mt-1 text-xs leading-relaxed text-muted sm:text-[13px]">
                          Skip every form and talk to the person building your site.
                        </p>
                      </div>
                    </div>
                    <a
                      href="tel:+61435758455"
                      className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-[8px] bg-btn-primary-bg px-4 py-2.5 text-xs font-semibold text-btn-primary-text tabular-nums transition-opacity hover:opacity-90 sm:text-sm"
                    >
                      <Phone aria-hidden="true" className="h-3.5 w-3.5" />
                      <span>Call 0435 758 455</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PROJECT BRIEF FORM SECTION */}
      <section
        id="brief"
        aria-labelledby="project-brief-heading"
        className="section-shell scroll-mt-24 w-full bg-surface-alt px-5 sm:px-8 lg:px-12 border-t border-border"
      >
        <div className="section-container">
          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
            {/* Left column */}
            <div className="lg:col-span-5">
              <h2
                id="project-brief-heading"
                className="font-display text-3xl font-bold tracking-[-0.025em] leading-[1.12] text-text sm:text-4xl"
                style={{ textWrap: 'balance' }}
              >
                The project brief
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted">
                About a minute. A rough idea is plenty. Send it straight through and we&apos;ll
                reply same day, usually within 90 minutes.
              </p>

              <div className="mt-8 space-y-5 border-t border-border pt-6">
                <div>
                  <p className="eyebrow">PHONE</p>
                  <p className="mt-1.5 text-sm text-text tabular-nums">
                    <a
                      href="tel:+61435758455"
                      className="link-underline font-medium text-text hover:text-accent"
                    >
                      0435 758 455
                    </a>
                  </p>
                </div>
                <div>
                  <p className="eyebrow">EMAIL</p>
                  <p className="mt-1.5 text-sm text-text">
                    <a
                      href="mailto:nexamor1@gmail.com"
                      className="link-underline font-medium text-text hover:text-accent"
                    >
                      nexamor1@gmail.com
                    </a>
                  </p>
                </div>
                <div>
                  <p className="eyebrow">BASED IN</p>
                  <p className="mt-1.5 text-sm text-text">Australia</p>
                </div>
              </div>
            </div>

            {/* Right column: form card */}
            <div className="lg:col-span-7">
              <div className="rounded-card border border-border bg-surface p-6 sm:p-10 shadow-card">
                {submitted ? (
                  <div className="space-y-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface-alt text-accent">
                      <CheckCircle2 aria-hidden="true" className="h-5 w-5" />
                    </div>
                    <h3 className="font-display text-xl font-bold tracking-tight text-text">
                      Thanks. We&apos;ve got your brief and will reply same day, usually within 90
                      minutes.
                    </h3>
                    <p className="text-sm leading-relaxed text-muted sm:text-base">
                      Need to add anything urgently? Email{' '}
                      <a
                        href="mailto:nexamor1@gmail.com"
                        className="link-underline font-medium text-text hover:text-accent"
                      >
                        nexamor1@gmail.com
                      </a>{' '}
                      or call{' '}
                      <a
                        href="tel:+61435758455"
                        className="link-underline font-medium text-text hover:text-accent tabular-nums"
                      >
                        0435 758 455
                      </a>
                      .
                    </p>
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSubmitted(false);
                          setBriefError('');
                          setDetails('');
                        }}
                        className="inline-flex items-center justify-center rounded-button border border-border bg-transparent px-6 py-3.5 text-sm font-medium text-text transition-colors hover:border-text hover:bg-surface-alt cursor-pointer"
                      >
                        Send another brief
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleBriefSubmit} noValidate className="space-y-4">
                    {/* Honeypot field for spam protection */}
                    <div className="sr-only" aria-hidden="true">
                      <label htmlFor="brief-website-url">Website</label>
                      <input
                        id="brief-website-url"
                        type="text"
                        tabIndex={-1}
                        autoComplete="off"
                        value={briefHoneypot}
                        onChange={(e) => setBriefHoneypot(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="brief-name"
                          className="mb-1.5 block text-xs font-medium text-text"
                        >
                          Your name <span className="text-muted">*</span>
                        </label>
                        <input
                          id="brief-name"
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Sarah Mitchell"
                          className="w-full rounded-button border border-border bg-bg px-4 py-2.5 text-sm text-text placeholder:text-muted/60 focus:border-text focus:outline-none"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="brief-business"
                          className="mb-1.5 block text-xs font-medium text-text"
                        >
                          Business name <span className="font-normal text-muted">(optional)</span>
                        </label>
                        <input
                          id="brief-business"
                          type="text"
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                          placeholder="Mitchell Plumbing & Gas"
                          className="w-full rounded-button border border-border bg-bg px-4 py-2.5 text-sm text-text placeholder:text-muted/60 focus:border-text focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="brief-email"
                          className="mb-1.5 block text-xs font-medium text-text"
                        >
                          Email <span className="text-muted">*</span>
                        </label>
                        <input
                          id="brief-email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="sarah@yourbusiness.com.au"
                          className="w-full rounded-button border border-border bg-bg px-4 py-2.5 text-sm text-text placeholder:text-muted/60 focus:border-text focus:outline-none"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="brief-phone"
                          className="mb-1.5 block text-xs font-medium text-text"
                        >
                          Phone <span className="font-normal text-muted">(optional)</span>
                        </label>
                        <input
                          id="brief-phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="04XX XXX XXX"
                          className="w-full rounded-button border border-border bg-bg px-4 py-2.5 text-sm text-text placeholder:text-muted/60 focus:border-text focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="brief-website-type"
                        className="mb-1.5 block text-xs font-medium text-text"
                      >
                        Which website are you after?
                      </label>
                      <select
                        id="brief-website-type"
                        value={websiteType}
                        onChange={(e) => setWebsiteType(e.target.value)}
                        className="w-full rounded-button border border-border bg-bg px-4 py-2.5 text-sm text-text focus:border-text focus:outline-none"
                      >
                        {WEBSITE_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      <p className="mt-1.5 text-xs text-muted">
                        Prices are flat and include GST. Pick &apos;Not sure&apos; and we&apos;ll
                        advise.
                      </p>
                    </div>

                    <div>
                      <label
                        htmlFor="brief-details"
                        className="mb-1.5 block text-xs font-medium text-text"
                      >
                        What do you need? <span className="text-muted">*</span>
                      </label>
                      <textarea
                        id="brief-details"
                        rows={4}
                        required
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        placeholder="Tell us what your business does and what you want your website to achieve."
                        className="w-full resize-none rounded-card border border-border bg-bg px-4 py-3 text-sm text-text placeholder:text-muted/60 focus:border-text focus:outline-none"
                      />
                    </div>

                    {briefError && (
                      <div
                        role="alert"
                        className="flex items-start gap-2 rounded-card border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-900"
                      >
                        <AlertCircle
                          aria-hidden="true"
                          className="mt-0.5 h-4 w-4 shrink-0 text-red-600"
                        />
                        <span>{briefError}</span>
                      </div>
                    )}

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmittingBrief}
                        className="group inline-flex w-full items-center justify-center gap-2 rounded-button bg-btn-primary-bg px-6 py-3.5 text-sm font-medium text-btn-primary-text transition-opacity hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer sm:w-auto"
                      >
                        {isSubmittingBrief ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                            <span>Sending brief...</span>
                          </>
                        ) : (
                          <>
                            <span>Get my flat price</span>
                            <ArrowRight
                              aria-hidden="true"
                              className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5"
                            />
                          </>
                        )}
                      </button>

                      <p className="mt-3 text-xs text-muted sm:text-[13px]">
                        Same-day reply, usually within 90 minutes. Or email{' '}
                        <a
                          href="mailto:nexamor1@gmail.com"
                          className="link-underline font-medium text-text hover:text-accent"
                        >
                          nexamor1@gmail.com
                        </a>
                        .
                      </p>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. BOOK A 30-MINUTE CALL SECTION */}
      <section
        id="call"
        aria-labelledby="book-a-call-heading"
        className="section-shell scroll-mt-24 w-full bg-bg px-5 sm:px-8 lg:px-12 border-t border-border"
      >
        <div className="section-container">
          <div className="max-w-2xl">
            <p className="eyebrow">PATH 2 · BOOK A TIME</p>
            <h2
              id="book-a-call-heading"
              className="mt-4 font-display text-3xl font-bold tracking-[-0.025em] leading-[1.12] text-text sm:text-4xl"
              style={{ textWrap: 'balance' }}
            >
              Book a 30-minute call
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted">
              Pick any open slot. Live availability seven days a week, 9 am to 6 pm AEST. Booking
              confirms instantly. You&apos;ll pick{' '}
              <strong className="font-semibold text-text">Google Meet</strong> or{' '}
              <strong className="font-semibold text-text">phone call</strong> on the form. Calls
              run thirty minutes; we keep them tight unless you&apos;d rather they didn&apos;t.
            </p>
          </div>

          <div className="mt-10 rounded-card border border-border bg-surface p-4 sm:p-8 lg:p-10 shadow-highlight">
            <BookCallEmbed />
          </div>
        </div>
      </section>

      {/* 4. WHAT HAPPENS AFTER YOU REACH OUT (3 columns, top border line) */}
      <section
        aria-labelledby="after-reach-out-heading"
        className="section-shell w-full bg-surface-alt px-5 sm:px-8 lg:px-12 border-t border-border"
      >
        <div className="section-container">
          <h2
            id="after-reach-out-heading"
            className="font-display text-3xl font-bold tracking-[-0.025em] leading-[1.12] text-text sm:text-4xl"
            style={{ textWrap: 'balance' }}
          >
            What happens after you reach out
          </h2>

          <div className="mt-10 sm:mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            {NEXT_STEPS.map((item) => (
              <div key={item.step} className="border-t border-border pt-6">
                <p className="eyebrow">{item.step}</p>
                <h3 className="mt-3 font-display text-xl font-bold tracking-[-0.02em] text-text">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted sm:text-base">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. BEFORE YOU START (FAQ accordion, first item open) */}
      <section
        aria-labelledby="before-you-start-heading"
        className="section-shell w-full bg-bg px-5 sm:px-8 lg:px-12 border-t border-border"
      >
        <div className="mx-auto max-w-[760px] text-left">
          <h2
            id="before-you-start-heading"
            className="font-display text-3xl font-bold tracking-[-0.02em] leading-[1.12] text-text sm:text-4xl"
          >
            Before you start
          </h2>

          <div className="mt-8 divide-y divide-border border-y border-border">
            {START_FAQS.map((item, index) => {
              const isOpen = openFaqIndex === index;
              const buttonId = `start-faq-button-${index}`;
              const panelId = `start-faq-panel-${index}`;

              return (
                <div key={item.question}>
                  <h3>
                    <button
                      type="button"
                      id={buttonId}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() =>
                        setOpenFaqIndex((prev) => (prev === index ? null : index))
                      }
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
      </section>
    </div>
  );
}
