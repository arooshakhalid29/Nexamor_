import { useEffect } from 'react';
import Hero from '../components/Hero';
import TrustSection from '../components/TrustSection';
import SavingsSection from '../components/SavingsSection';
import DifferenceSection from '../components/DifferenceSection';
import PricingSection from '../components/PricingSection';
import GrowthProBand from '../components/GrowthProBand';
import HowWeWorkSection from '../components/HowWeWorkSection';
import ProcessSection from '../components/ProcessSection';
import FounderNoteSection from '../components/FounderNoteSection';
import GoodToKnowSection from '../components/GoodToKnowSection';
import FaqSection from '../components/FaqSection';
import FinalCtaSection from '../components/FinalCtaSection';
import { scrollToContactSection } from '../utils/scrollToContact';

const HOME_TITLE = 'Web Design Australia 2027 | $500 Website in 48 Hours';
const HOME_DESCRIPTION =
  'A website that works as hard as you do. Professional 5-page websites for Australian small businesses, built in Australia with nothing outsourced. $500 flat, live in 48 hours.';

export default function Home() {

  useEffect(() => {
    const prevTitle = document.title;
    document.title = HOME_TITLE;

    const metaDesc = document.querySelector('meta[name="description"]');
    const prevDesc = metaDesc?.getAttribute('content') ?? null;
    if (metaDesc) metaDesc.setAttribute('content', HOME_DESCRIPTION);

    const ogTitle = document.querySelector('meta[property="og:title"]');
    const prevOgTitle = ogTitle?.getAttribute('content') ?? null;
    if (ogTitle) ogTitle.setAttribute('content', HOME_TITLE);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    const prevOgDesc = ogDesc?.getAttribute('content') ?? null;
    if (ogDesc) ogDesc.setAttribute('content', HOME_DESCRIPTION);

    return () => {
      document.title = prevTitle;
      if (metaDesc && prevDesc !== null) metaDesc.setAttribute('content', prevDesc);
      if (ogTitle && prevOgTitle !== null) ogTitle.setAttribute('content', prevOgTitle);
      if (ogDesc && prevOgDesc !== null) ogDesc.setAttribute('content', prevOgDesc);
    };
  }, []);

  useEffect(() => {
    const origin = window.location.origin;
    const jsonLdData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Service',
          '@id': `${origin}/#growth-pro`,
          name: 'Growth Pro',
          description:
            "Growth Pro gives you a professional 10 to 20 page website, then adds simple tools that reply to missed calls by text, ask happy customers for Google reviews, and follow up with every enquiry. Hosting and care are included, there's no setup fee, and you can cancel any month.",
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
          '@type': 'Offer',
          '@id': `${origin}/#logo-design`,
          price: '199',
          priceCurrency: 'AUD',
          itemOffered: {
            '@type': 'Service',
            name: 'Logo design',
            description:
              'A logo, colours, and fonts that make your business look professional. Delivered within 48 hours.',
          },
        },
        {
          '@type': 'Offer',
          '@id': `${origin}/#care-plan`,
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
              'Hosting, backups, and security looked after for you, so you never have to think about it.',
          },
        },
      ],
    };

    const existing = document.getElementById('home-jsonld');
    if (existing) existing.remove();

    const script = document.createElement('script');
    script.id = 'home-jsonld';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(jsonLdData);
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  const scrollToContact = () => {
    scrollToContactSection();
  };

  return (
    <>
      <Hero />
      <TrustSection onBookCall={() => scrollToContact()} />
      <PricingSection onSelectPlan={() => scrollToContact()} />
      <SavingsSection />
      <DifferenceSection />
      <GrowthProBand onStartGrowthPro={() => scrollToContact()} />
      <HowWeWorkSection onSeeHowItWorks={() => scrollToContact()} />
      <ProcessSection onBookCall={() => scrollToContact()} />
      <FounderNoteSection />
      <GoodToKnowSection />
      <FaqSection />
      <FinalCtaSection sectionBg="bg-bg" />
    </>
  );
}
