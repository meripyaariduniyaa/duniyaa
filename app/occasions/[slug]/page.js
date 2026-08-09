import Link from 'next/link';
import { notFound } from 'next/navigation';
import { templates } from '@/lib/templates';
import { JsonLd } from '@/components/seo/JsonLd';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://lovelycrafts.in';

const occasionsData = {
  'birthday': {
    title: 'Interactive Birthday Surprise Website',
    seoTitle: 'Birthday Surprise Website — Digital Birthday Card & Party Reveal',
    description: 'Create an unforgettable interactive birthday surprise with custom candle blowing, party confetti, photo memory reel, and heartfelt birthday wishes.',
    icon: '🎂',
    matchedTemplateIds: ['birthday-surprise'],
    heading: 'Make Their Birthday Unforgettable 🎉',
    introText: 'Skip plain text messages and physical cards that get thrown away. Create a digital birthday experience complete with red curtain reveals, birthday banners, and candle blowing.',
    faqs: [
      { q: 'How long does it take to create a birthday surprise?', a: 'It takes less than 2–3 minutes to add their name, write a wish, upload photos, and generate your shareable link.' },
      { q: 'Can I send it at exactly 12:00 AM midnight?', a: 'Yes! Simply copy the private link and send it via WhatsApp or message right at midnight.' },
    ],
  },
  'raksha-bandhan': {
    title: 'Raksha Bandhan Digital Rakhi Surprise',
    seoTitle: 'Raksha Bandhan Surprise Website for Brother & Sister | LovelyCrafts',
    description: 'Create a memorable Raksha Bandhan surprise with virtual rakhi tying animations, interactive diya glow, sibling photo reels, and custom messages.',
    icon: '🪢',
    matchedTemplateIds: ['rakshabandhan'],
    heading: 'Celebrate Sibling Bonds Forever 🪢',
    introText: 'Send a heartfelt digital Rakhi to your brother or sister anywhere in the world. Features interactive Rakhi tying animations, diya lighting, and childhood memories.',
    faqs: [
      { q: 'Is this ideal for long-distance siblings?', a: 'Absolutely! If your sibling lives in another city or country, send this digital Rakhi link directly to their phone.' },
      { q: 'How many photos can I upload?', a: 'You can upload up to 15 childhood and memory photos for the timeline memory reel.' },
    ],
  },
  'anniversary': {
    title: 'Digital Anniversary Love Letter & Surprise',
    seoTitle: 'Anniversary Surprise Website — Personalized Digital Love Letter | LovelyCrafts',
    description: 'Surprise your partner with an interactive anniversary wax-sealed letter, drifting rose petals, glowing lanterns, and favorite memories.',
    icon: '💌',
    matchedTemplateIds: ['love-letter', 'a-rose-for-someone-special'],
    heading: 'Celebrate Your Special Date ❤️',
    introText: 'Whether it is your 1st anniversary or 10th year together, create a digital wax-sealed love letter with stationery designs, typewriter text, and music.',
    faqs: [
      { q: 'Can I add a custom anniversary date?', a: 'Yes! You can specify your special date to showcase inside the love letter.' },
    ],
  },
  'apology': {
    title: 'Interactive Apology & Say Sorry Website',
    seoTitle: 'Interactive Apology Website — Say Sorry in a Memorable Way | LovelyCrafts',
    description: 'Say sorry sincerely with a 5-step interactive apology experience: cuteness meter, 3 promise cards, photo memory reel, and self-typing message.',
    icon: '🥺',
    matchedTemplateIds: ['sorry'],
    heading: 'Say Sorry from the Bottom of Your Heart 🥺',
    introText: 'When words on WhatsApp aren’t enough to fix things, send a 5-step apology journey with 3 future promises, sincere words, and goofy memory cards.',
    faqs: [
      { q: 'How do the 3 promise cards work?', a: 'You write 3 genuine promises for the future. The recipient clicks each card interactive style to reveal your commitments.' },
    ],
  },
  'romantic': {
    title: 'Romantic Love Confession & Rose Bloom',
    seoTitle: 'Romantic Love Confession Website — Virtual Blooming Rose | LovelyCrafts',
    description: 'Confess your feelings or celebrate romance with a cinematic virtual rose blooming in candlelight with custom message animations.',
    icon: '🌹',
    matchedTemplateIds: ['a-rose-for-someone-special', 'love-letter'],
    heading: 'A Gift Tuned for Pure Romance 🌹',
    introText: 'Send a virtual rose that never withers. Accompanied by candlelight visuals, soft background music, and your words framed inside the bloom.',
    faqs: [
      { q: 'Will the link expire?', a: 'The link remains private and active for 15 days so your partner can revisit it anytime.' },
    ],
  },
  'valentines-day': {
    title: 'Playful Valentine Proposal Experience',
    seoTitle: 'Will You Be My Valentine Website — Interactive Proposal Card | LovelyCrafts',
    description: 'Ask them to be your Valentine with a playful dodging NO button card that unlocks a heart explosion and date plan when they click YES.',
    icon: '💕',
    matchedTemplateIds: ['be-my-valentine'],
    heading: 'Will You Be My Valentine? 💕',
    introText: 'Add laughter and excitement to your proposal with a card where the NO button comically dodges away, forcing them to click YES for a heart burst!',
    faqs: [
      { q: 'Can I add our date idea?', a: 'Yes! You can specify your dinner or surprise date plan to reveal as soon as they click YES.' },
    ],
  },
};

export async function generateStaticParams() {
  return Object.keys(occasionsData).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const occ = occasionsData[slug];

  if (!occ) {
    return { title: 'Occasion Not Found' };
  }

  const canonicalUrl = `${SITE_URL}/occasions/${slug}`;

  return {
    title: occ.seoTitle,
    description: occ.description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `${occ.seoTitle} | LovelyCrafts`,
      description: occ.description,
      url: canonicalUrl,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: occ.seoTitle,
      description: occ.description,
    },
  };
}

export default async function OccasionDetailPage({ params }) {
  const { slug } = await params;
  const occ = occasionsData[slug];

  if (!occ) {
    notFound();
  }

  const relatedTemplates = templates.filter((t) => occ.matchedTemplateIds.includes(t.id));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: occ.title,
    description: occ.description,
    url: `${SITE_URL}/occasions/${slug}`,
    publisher: {
      '@type': 'Organization',
      name: 'LovelyCrafts',
      url: SITE_URL,
    },
  };

  const breadcrumbsLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Occasions', item: `${SITE_URL}/occasions` },
      { '@type': 'ListItem', position: 3, name: occ.title, item: `${SITE_URL}/occasions/${slug}` },
    ],
  };

  return (
    <main className="shell">
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumbsLd} />

      <div className="main-content" style={{ maxWidth: '850px', margin: '0 auto' }}>
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: '#666' }}>
          <Link href="/" style={{ color: '#ec4899', textDecoration: 'none' }}>Home</Link>
          {' > '}
          <Link href="/occasions" style={{ color: '#ec4899', textDecoration: 'none' }}>Occasions</Link>
          {' > '}
          <span style={{ fontWeight: 600 }}>{occ.title}</span>
        </nav>

        {/* Hero */}
        <div style={{ background: '#fff', borderRadius: '1.5rem', padding: '2.5rem 2rem', boxShadow: '0 10px 30px rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>{occ.icon}</div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', marginBottom: '0.75rem', color: '#111' }}>
            {occ.heading}
          </h1>
          <p style={{ fontSize: '1.15rem', color: '#555', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            {occ.introText}
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="#recommended-templates" className="btn-primary" style={{ padding: '0.8rem 1.8rem', fontSize: '1.05rem' }}>
              ✨ Choose Experience
            </Link>
            <Link href="/occasions" className="btn-secondary" style={{ padding: '0.8rem 1.5rem', fontSize: '1rem' }}>
              ← All Occasions
            </Link>
          </div>
        </div>

        {/* Recommended Templates Grid */}
        <div id="recommended-templates" style={{ marginTop: '2.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#111' }}>Recommended Experiences for {occ.title}</h2>
          <div className="templates-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            {relatedTemplates.map((t) => (
              <div key={t.id} className="template-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div className="template-icon">{t.icon}</div>
                  <h3 style={{ fontSize: '1.25rem', margin: '0.5rem 0' }}>{t.title}</h3>
                  <p className="template-desc">{t.description}</p>
                </div>
                <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.5rem' }}>
                  <Link href={`/templates/${t.id}`} className="btn-secondary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}>
                    View Details
                  </Link>
                  <Link href={`/create?template=${t.id}`} className="btn-primary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}>
                    Create Now →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Frequently Asked Questions */}
        {occ.faqs && (
          <div style={{ background: '#fff', padding: '1.8rem', borderRadius: '1.25rem', border: '1px solid rgba(0,0,0,0.06)', marginTop: '2.5rem' }}>
            <h2 style={{ fontSize: '1.3rem', marginBottom: '1.25rem', color: '#111' }}>❓ Frequently Asked Questions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {occ.faqs.map((faq, i) => (
                <div key={i} style={{ borderBottom: i < occ.faqs.length - 1 ? '1px solid #f3f4f6' : 'none', paddingBottom: '0.75rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#9f1239', margin: '0 0 0.35rem 0' }}>Q: {faq.q}</h3>
                  <p style={{ margin: 0, fontSize: '0.95rem', color: '#4b5563', lineHeight: 1.5 }}>{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
