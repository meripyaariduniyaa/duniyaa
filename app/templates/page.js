import Link from 'next/link';
import { templates } from '@/lib/templates';
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from '@/lib/seo';


export const metadata = {
  title: 'Browse All Interactive Digital Gift Templates — 18 Experiences | LovelyCrafts',
  description: 'Explore 18+ personalized interactive digital gift experiences: birthday surprises, romantic proposals, anniversary cards, apology notes, Get Well Soon, Father\'s Day letter, Raksha Bandhan, wedding invitations, and more. Share any on WhatsApp in minutes — from ₹199.',
  keywords: [
    'interactive digital gift templates India',
    'personalized digital card templates',
    'birthday surprise templates India',
    'proposal website template',
    'anniversary digital card',
    'apology card online India',
    'get well soon digital card India',
    "father's day digital letter India",
    'Raksha Bandhan digital gift template',
    'wedding invitation link India',
    'i miss you digital card',
    'open when letters online',
    'friendship day digital card India',
    'interactive photo puzzle gift',
    'emotional digital experience India',
    'LovelyCrafts templates',
  ],
  alternates: { canonical: `${SITE_URL}/templates` },
  openGraph: {
    title: 'Browse 18+ Interactive Digital Gift Templates | LovelyCrafts',
    description: 'Birthday surprises, proposals, apologies, Get Well Soon, Father\'s Day, Raksha Bandhan, weddings & more — personalized interactive digital cards from ₹199.',
    url: `${SITE_URL}/templates`,
    type: 'website',
    siteName: SITE_NAME,
    locale: 'en_IN',
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: 'LovelyCrafts — 18+ Interactive Digital Gift Templates' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@lovelycraftsin',
    creator: '@lovelycraftsin',
    title: 'Browse 18+ Interactive Digital Gift Templates | LovelyCrafts',
    description: 'Birthday surprises, proposals, apologies, Get Well Soon, Father\'s Day & more from ₹199. Share on WhatsApp in minutes.',
    images: [DEFAULT_OG_IMAGE],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
};

export default function TemplatesPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'LovelyCrafts Digital Templates',
    description: 'Interactive personalized digital gift and greeting experiences',
    url: `${SITE_URL}/templates`,
    numberOfItems: templates.length,
    itemListElement: templates.map((t, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: t.title,
      description: t.description,
      url: `${SITE_URL}/templates/${t.id}`,
    })),
  };

  const breadcrumbsLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Templates', item: `${SITE_URL}/templates` },
    ],
  };

  return (
    <main className="shell">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsLd) }}
      />

      <div className="main-content">
        <section className="hero-section text-center mt-8 mb-8">
          <div className="hero-sale-banner">🎁 Explore All Interactive Templates</div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)' }}>
            Choose the Perfect <br />
            <span className="text-gradient cursive">Digital Gift Experience</span>
          </h1>
          <p className="hero-copy text-muted" style={{ maxWidth: '680px', margin: '1rem auto' }}>
            Turn your favorite memories, photos, and heartfelt words into stunning, interactive animated web cards for every special occasion.
          </p>
        </section>

        <section className="templates-section">
          <div className="templates-grid">
            {templates.map((t) => (
              <div key={t.id} className="template-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  {t.recommended && <div className="template-badge">⭐ Recommended</div>}
                  {t.isNew && <div className="template-badge template-badge--new" style={{ background: '#ec4899', color: '#fff' }}>✨ NEW</div>}
                  
                  <div className="template-icon">{t.icon}</div>
                  <h2 style={{ fontSize: '1.35rem', margin: '0.5rem 0' }}>{t.title}</h2>
                  <p className="template-desc">{t.description}</p>
                  
                  <div className="template-tags" style={{ marginTop: '0.75rem' }}>
                    {t.bestFor.map((tag) => (
                      <span key={tag} className="template-tag">{tag}</span>
                    ))}
                  </div>
                </div>

                <div className="template-meta" style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                  <span className="template-time">⏱ {t.time}</span>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <Link href={`/templates/${t.id}`} className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                      Learn Details ➔
                    </Link>
                    <Link href={`/create?template=${t.id}`} className="btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                      Create Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
