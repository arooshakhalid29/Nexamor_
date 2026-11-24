import { useEffect, useRef, useState } from 'react';

interface ProcessSectionProps {
  onBookCall?: () => void;
  id?: string;
  eyebrow?: string;
  heading?: string;
  subtext?: string;
  showFooterLink?: boolean;
}

interface ProcessStep {
  number: string;
  title: string;
  description: string;
  day: string;
}

const STEPS: ProcessStep[] = [
  {
    number: '01',
    title: 'Tell us about your business',
    description:
      'A short form and a quick call. You tell us what you do and who you want to reach, and send your photos and text.',
    day: 'Hour 0',
  },
  {
    number: '02',
    title: 'We design and build',
    description:
      'We turn your brief into a real website. By the end of the first day, you can see it working on a private link.',
    day: 'Hours 1 to 24',
  },
  {
    number: '03',
    title: 'You review, we refine',
    description:
      'Send us all your changes in one go. We update them within hours, as many times as you like.',
    day: 'Hours 24 to 40',
  },
  {
    number: '04',
    title: 'Launch and handover',
    description:
      'Your website goes live and you get every login and file, plus a short video showing you how to edit it.',
    day: 'Hours 40 to 48',
  },
];

const STEP_THRESHOLDS = [0.02, 1 / 3, 2 / 3, 0.96];

export default function ProcessSection({
  onBookCall,
  id,
  eyebrow = 'OUR PROCESS',
  heading = '48 hours. Four steps. No guesswork.',
  subtext = "Four simple steps, from first chat to launch. You always know what's happening and what's next.",
  showFooterLink = true,
}: ProcessSectionProps) {
  const headingId = id ? `${id}-heading` : 'process-section-heading';
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  const [lineProgress, setLineProgress] = useState(() =>
    prefersReducedMotion ? 1 : 0
  );
  const [visibleSteps, setVisibleSteps] = useState<boolean[]>(() =>
    STEPS.map(() => prefersReducedMotion)
  );
  const [stepDelays, setStepDelays] = useState<number[]>(() =>
    STEPS.map(() => 0)
  );

  // Sync prefers-reduced-motion changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handleChange = () => {
      const reduced = mediaQuery.matches;
      setPrefersReducedMotion(reduced);
      if (reduced) {
        setLineProgress(1);
        setVisibleSteps(STEPS.map(() => true));
        setStepDelays(STEPS.map(() => 0));
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Scroll-driven accent line progress (plays forward once, never resets)
  useEffect(() => {
    if (prefersReducedMotion) return;

    let rafId = 0;

    const updateProgress = () => {
      rafId = 0;
      const el = timelineRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 800;

      // Start drawing as timeline enters lower viewport; finish as it reaches upper reading band
      const startY = vh * 0.85;
      const endY = Math.min(vh * 0.28, startY - Math.max(rect.height * 0.65, 220));
      const raw = (startY - rect.top) / (startY - endY);
      const clamped = Math.max(0, Math.min(1, raw));

      setLineProgress((prev) => (clamped > prev ? clamped : prev));
    };

    const onScrollOrResize = () => {
      if (!rafId) {
        rafId = window.requestAnimationFrame(updateProgress);
      }
    };

    updateProgress();
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, [prefersReducedMotion]);

  // One-time IntersectionObserver reveal per step with 120ms stagger
  useEffect(() => {
    if (prefersReducedMotion) return;
    if (typeof IntersectionObserver === 'undefined') {
      setVisibleSteps(STEPS.map(() => true));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const newlyVisibleIndices: number[] = [];
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idxAttr = entry.target.getAttribute('data-step-index');
            const idx = idxAttr ? Number(idxAttr) : -1;
            if (idx >= 0) {
              newlyVisibleIndices.push(idx);
              observer.unobserve(entry.target);
            }
          }
        });

        if (newlyVisibleIndices.length > 0) {
          newlyVisibleIndices.sort((a, b) => a - b);
          setStepDelays((prev) => {
            const next = [...prev];
            newlyVisibleIndices.forEach((stepIdx, batchOrder) => {
              next[stepIdx] = batchOrder * 120;
            });
            return next;
          });
          setVisibleSteps((prev) => {
            const next = [...prev];
            newlyVisibleIndices.forEach((idx) => {
              next[idx] = true;
            });
            return next;
          });
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    stepRefs.current.forEach((node) => {
      if (node) observer.observe(node);
    });

    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  const effectiveProgress = prefersReducedMotion ? 1 : lineProgress;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className="section-shell w-full bg-surface-alt px-5 sm:px-8 lg:px-12 border-t border-border"
    >
      <div className="section-container">
        {/* Left-aligned Header */}
        <div className="max-w-2xl text-left">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h2
            id={headingId}
            className={`${eyebrow ? 'mt-4 ' : ''}font-display text-3xl font-bold tracking-[-0.02em] leading-[1.12] text-text sm:text-4xl lg:text-[2.75rem]`}
          >
            {heading}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted">{subtext}</p>
        </div>

        {/* 4-step Timeline */}
        <div ref={timelineRef} className="relative mt-14 sm:mt-16">
          {/* Tablet horizontal progress track (2-col breakpoint: md to <lg) */}
          <div
            aria-hidden="true"
            className="hidden md:block lg:hidden mb-8 h-[1.5px] w-full bg-border overflow-hidden"
          >
            <div
              className="h-full w-full bg-accent origin-left"
              style={{ transform: `scaleX(${effectiveProgress})` }}
            />
          </div>

          {/* Mobile vertical connecting line along the left side (<md) */}
          <div
            aria-hidden="true"
            className="md:hidden absolute left-[19.25px] top-[20px] bottom-[44px] w-[1.5px] bg-border overflow-hidden"
          >
            <div
              className="h-full w-full bg-accent origin-top"
              style={{ transform: `scaleY(${effectiveProgress})` }}
            />
          </div>

          {/* Desktop horizontal connecting line across all 4 circle centers (lg+) */}
          <div
            aria-hidden="true"
            className="hidden lg:block absolute top-[20px] left-[20px] right-[calc((100%-60px)/4-20px)] h-[1.5px] bg-border overflow-hidden"
          >
            <div
              className="h-full w-full bg-accent origin-left"
              style={{ transform: `scaleX(${effectiveProgress})` }}
            />
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-x-10 md:gap-y-10 lg:grid-cols-4 lg:gap-5">
            {STEPS.map((step, index) => {
              const isVisible = prefersReducedMotion || visibleSteps[index];
              const isReached =
                prefersReducedMotion || effectiveProgress >= STEP_THRESHOLDS[index];

              return (
                <div
                  key={step.number}
                  ref={(el) => {
                    stepRefs.current[index] = el;
                  }}
                  data-step-index={index}
                  className="relative flex flex-row items-start gap-4 md:flex-col md:gap-0"
                  style={
                    prefersReducedMotion
                      ? undefined
                      : {
                          opacity: isVisible ? 1 : 0,
                          transform: isVisible ? 'translateY(0)' : 'translateY(16px)',
                          transitionProperty: 'opacity, transform',
                          transitionDuration: '480ms',
                          transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                          transitionDelay: `${stepDelays[index]}ms`,
                        }
                  }
                >
                  {/* Numbered Circle */}
                  <div
                    className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-button border font-mono text-xs font-semibold tabular-nums transition-colors duration-200 ${
                      isReached
                        ? 'border-btn-primary-bg bg-btn-primary-bg text-btn-primary-text'
                        : 'border-border bg-surface text-text'
                    }`}
                  >
                    {step.number}
                  </div>

                  {/* Step Content */}
                  <div className="pt-1 md:pt-5 flex flex-col">
                    <h3 className="font-display text-[15px] font-bold tracking-[-0.02em] leading-snug text-text">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-[13.5px] leading-relaxed text-muted">
                      {step.description}
                    </p>
                    <p className="mt-3 font-mono text-[11.5px] font-medium uppercase tracking-[0.14em] text-accent tabular-nums">
                      {step.day}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <p className="mt-10 text-sm leading-relaxed text-muted">
          The 48 hours start once we have your form, photos, and text. Showcase and Industry
          Specialist websites take 7 business days.
        </p>

        {/* Centered footer line */}
        {showFooterLink && onBookCall && (
          <p className="mt-12 sm:mt-14 text-center text-sm text-muted">
            Questions along the way? You&apos;ll always talk to a real person.{' '}
            <button
              type="button"
              onClick={onBookCall}
              className="font-medium text-text underline underline-offset-4 hover:text-accent cursor-pointer"
            >
              Book a free call
            </button>
            .
          </p>
        )}
      </div>
    </section>
  );
}
