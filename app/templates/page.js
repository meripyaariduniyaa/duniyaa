import Link from 'next/link';
import { templates } from '@/lib/templates';

const siteName = 'Lovely Crafts';
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lovelycrafts.in';

export const metadata = {
  title: 'Personalized Digital Gift Templates & Interactive Cards',
  description: 'Explore our full library of interactive digital gift templates: romantic apologies, birthday surprises, love letters, proposals, wedding save-the-dates, and festive cards.',
  alternates: {
    canonical: '/templates',
  },
  openGraph: {
    title: 'Personalized Digital Gift Templates & Interactive Cards | Lovely Crafts',
    description: 'Explore our full library of interactive digital gift templates: romantic apologies, birthday surprises, love letters, proposals, wedding save-the-dates, and festive cards.',
    url: `${baseUrl}/templates`,
    type: 'website',
  },
};

export default function TemplatesPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Lovely Crafts Digital Templates',
    description: 'Interactive personalized note and gift templates',
    url: `${baseUrl}/templates`,
    numberOfItems: templates.length,
    itemListElement: templates.map((t, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: t.title,
      description: t.description,
      url: `${baseUrl}/templates/${t.id}`,
    })),
  };

  const breadcrumbsLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Templates',
        item: `${baseUrl}/templates`,
      },
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
