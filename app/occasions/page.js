import Link from 'next/link';
import { JsonLd } from '@/components/seo/JsonLd';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://lovelycrafts.in';

export const metadata = {
  title: 'Digital Surprises by Occasion — LovelyCrafts',
  description: 'Find the perfect interactive digital surprise for Birthdays, Raksha Bandhan, Anniversaries, Apologies, and Valentine’s Day.',
  alternates: {
    canonical: '/occasions',
  },
  openGraph: {
    title: 'Digital Surprises by Occasion | LovelyCrafts',
    description: 'Find the perfect interactive digital surprise for Birthdays, Raksha Bandhan, Anniversaries, Apologies, and Valentine’s Day.',
    url: `${SITE_URL}/occasions`,
    type: 'website',
  },
};

const occasions = [
  {
    slug: 'birthday',
    title: 'Birthday Surprises',
    icon: '🎂',
    description: 'Bollywood red curtain reveals, cake candle blowing, party confetti, and customized birthday banners.',
    bestFor: 'Birthdays, Midnight Reveals, Milestone Years',
  },
  {
    slug: 'raksha-bandhan',
    title: 'Raksha Bandhan Gifts',
    icon: '🪢',
    description: 'Interactive Rakhi thread tying, diya glow meters, sibling photo timelines, and heartfelt messages.',
    bestFor: 'Brothers, Sisters, Sibling Bonds',
  },
  {
    slug: 'anniversary',
    title: 'Anniversary & Couple Gifts',
    icon: '💌',
    description: 'Vintage wax seal unsealing, romantic typewriter notes, floating rose petals, and memory frames.',
    bestFor: 'Anniversaries, Long-Distance Couples, Romantic Keepsakes',
  },
  {
    slug: 'apology',
    title: 'Apology & Making Up',
    icon: '🥺',
    description: '5-step interactive apology journey with cuteness gauges, 3 promise cards, and memory reels.',
    bestFor: 'Saying Sorry, Heartfelt Reconciliation, Sweet Gestures',
  },
  {
    slug: 'romantic',
    title: 'Romantic Love Confessions',
    icon: '🌹',
    description: 'Cinematic virtual rose blooming under candlelight with custom multi-petal animations.',
    bestFor: 'Proposals, Crushes, Pure Romance',
  },
  {
    slug: 'valentines-day',
    title: 'Valentine’s Day Proposals',
    icon: '💕',
    description: 'Playful dodger NO button proposal cards that explode into hearts upon YES.',
    bestFor: 'Valentine Proposals, Playful Dates',
  },
];

export default function OccasionsPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Occasions — LovelyCrafts Digital Surprises',
    description: 'Find interactive digital gift experiences grouped by special occasion.',
    url: `${SITE_URL}/occasions`,
  };

  return (
    <main className="shell">
      <JsonLd data={jsonLd} />

      <div className="main-content">
        <section className="hero-section text-center mt-8 mb-8">
          <div className="hero-sale-banner">🎁 Find Surprises by Occasion</div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)' }}>
            Celebrations Made <br />
            <span className="text-gradient cursive">Personal & Unforgettable</span>
          </h1>
          <p className="hero-copy text-muted" style={{ maxWidth: '680px', margin: '1rem auto' }}>
            Choose the search intent or milestone you are celebrating and discover customized interactive experiences.
          </p>
        </section>

        <section className="templates-section">
          <div className="templates-grid">
            {occasions.map((occ) => (
              <div key={occ.slug} className="template-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div className="template-icon">{occ.icon}</div>
                  <h2 style={{ fontSize: '1.4rem', margin: '0.5rem 0' }}>{occ.title}</h2>
                  <p className="template-desc">{occ.description}</p>
                  <p style={{ fontSize: '0.825rem', color: '#be185d', fontWeight: 600, marginTop: '0.75rem' }}>
                    Ideal for: {occ.bestFor}
                  </p>
                </div>

                <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                  <Link href={`/occasions/${occ.slug}`} className="btn-primary" style={{ display: 'inline-block', width: '100%', textAlign: 'center' }}>
                    Explore {occ.title} →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
