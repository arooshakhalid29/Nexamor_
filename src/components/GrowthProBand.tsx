import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface GrowthProBandProps {
  onStartGrowthPro: () => void;
}

export default function GrowthProBand({ onStartGrowthPro }: GrowthProBandProps) {
  const prefersReducedMotion = Boolean(useReducedMotion());

  return (
    <section
      id="growth-pro"
      aria-labelledby="home-growth-pro-heading"
      className="section-shell w-full bg-text text-bg px-5 sm:px-8 lg:px-12"
    >
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={
          prefersReducedMotion
            ? { duration: 0 }
            : { duration: 0.55, ease: [0.16, 1, 0.3, 1] }
        }
        className="mx-auto max-w-[780px] text-center"
      >
        <p className="text-[12px] font-semibold uppercase tracking-[0.18em] leading-[1.4] text-bg/70">
          Website + customer tools
        </p>

        <h2
          id="home-growth-pro-heading"
          className="mt-4 font-display text-3xl font-bold tracking-[-0.02em] leading-[1.12] text-bg sm:text-4xl lg:text-[2.625rem]"
          style={{ textWrap: 'balance' }}
        >
          A professional website, plus tools that bring in customers.{' '}
          <span className="whitespace-nowrap tabular-nums text-accent">$297 a month.</span>
        </h2>

        <p className="mt-5 text-base leading-relaxed text-bg/85 sm:text-lg tracking-[0.01em]">
          Growth Pro gives you a professional 10 to 20 page website, then adds simple tools that
          reply to missed calls by text, ask happy customers for Google reviews, and follow up with
          every enquiry. Hosting and care are included, there&apos;s no setup fee, and you can
          cancel any month.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row sm:flex-wrap">
          <Link
            to="/growth"
            className="group inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-button bg-bg px-6 py-3.5 text-sm font-medium text-text whitespace-nowrap shrink-0 transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bg"
          >
            <span>See Growth Pro, $297/month</span>
            <ArrowRight
              aria-hidden="true"
              strokeWidth={1.75}
              className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5"
            />
          </Link>

          <button
            type="button"
            onClick={onStartGrowthPro}
            className="inline-flex w-full sm:w-auto items-center justify-center rounded-button border border-bg/35 bg-transparent px-6 py-3.5 text-sm font-medium text-bg whitespace-nowrap shrink-0 transition-colors hover:border-bg hover:bg-bg/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bg cursor-pointer"
          >
            Start with Growth Pro
          </button>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-bg/75">
          <span>
            Prefer to own your website outright?{' '}
            <Link
              to="/pricing#website-plans"
              className="font-medium text-bg underline decoration-accent underline-offset-4 transition-colors hover:text-accent"
            >
              One-off websites
            </Link>{' '}
            start at $500.
          </span>
          <span aria-hidden="true">·</span>
          <a
            href="tel:+61435758455"
            className="font-medium text-bg underline decoration-bg/35 underline-offset-4 transition-colors hover:text-accent hover:decoration-accent tabular-nums"
          >
            Call 0435 758 455
          </a>
        </div>
      </motion.div>
    </section>
  );
}
