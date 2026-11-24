import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface LegalProps {
  title: string;
  summary: string;
}

const PRIVACY_SECTIONS = [
  {
    heading: '1. Information we collect',
    body: 'We only collect contact details and project notes that you choose to share when requesting a website quote, booking a call, or emailing us directly (such as your name, email address, phone number, and business brief).',
  },
  {
    heading: '2. How we use your details',
    body: 'Your information is used solely to scope, design, build, and support your website or Growth Pro service. We never sell, rent, or trade your contact details to third parties.',
  },
  {
    heading: '3. Website ownership & access',
    body: 'For one-off website builds, all logins, domain settings, and project files are registered in your name and handed over to you at launch.',
  },
  {
    heading: '4. Questions or removal requests',
    body: 'You can ask to view, update, or delete any personal details we hold at any time by emailing nexamor1@gmail.com or calling 0435 758 455.',
  },
];

const TERMS_SECTIONS = [
  {
    heading: '1. Written scope & flat pricing',
    body: 'Every project starts with a written summary covering the exact price (GST included), page count, and launch timeline. You never receive surprise hourly bills.',
  },
  {
    heading: '2. Delivery timeframes',
    body: 'Starter websites go live within 48 hours once we receive your completed brief, photos, and copy. Showcase and Industry Specialist websites take 7 business days from kickoff.',
  },
  {
    heading: '3. Unlimited pre-launch revisions',
    body: 'Before launch, we refine the layout, copy placement, and styling until you are happy with the result, at no additional cost.',
  },
  {
    heading: '4. Ownership & month-to-month services',
    body: 'On one-off builds, you own 100% of the finished website, files, and logins upon completion. Optional Care plans and Growth Pro run month-to-month with no lock-in contracts and can be cancelled anytime.',
  },
];

export default function Legal({ title, summary }: LegalProps) {
  const isPrivacy = title.toLowerCase().includes('privacy');
  const sections = isPrivacy ? PRIVACY_SECTIONS : TERMS_SECTIONS;

  return (
    <section className="section-shell w-full bg-bg px-5 sm:px-8 lg:px-12">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-2xl"
        >
          <p className="eyebrow">Plain-English Legal</p>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-[-0.025em] text-text sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
            {summary}
          </p>

          <div className="mt-12 divide-y divide-border border-y border-border">
            {sections.map((section) => (
              <div key={section.heading} className="py-6">
                <h2 className="font-display text-lg font-bold tracking-[-0.015em] text-text">
                  {section.heading}
                </h2>
                <p className="mt-2 text-sm sm:text-base leading-relaxed text-muted">
                  {section.body}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-muted">
            <Link
              to="/"
              className="font-medium text-text underline decoration-border underline-offset-4 hover:text-accent hover:decoration-accent"
            >
              Back to home
            </Link>
            <Link
              to={isPrivacy ? '/terms' : '/privacy'}
              className="underline decoration-border underline-offset-4 hover:text-text hover:decoration-accent"
            >
              {isPrivacy ? 'Read Terms of Service' : 'Read Privacy Policy'}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
