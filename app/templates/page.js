import Link from 'next/link';
import { templates } from '@/lib/templates';
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from '@/lib/seo';
import GoogleAd from '@/components/GoogleAd';
import TemplatesCatalog from '@/components/TemplatesCatalog';


export const metadata = {
  title: 'Browse Interactive Digital Gift Templates | LovelyCrafts',
  description: 'Explore personalized interactive digital gift experiences: birthday surprises, romantic proposals, anniversary celebrations, apology notes, and long-distance memory journeys. Share on WhatsApp in minutes — from ₹219.',
  keywords: [
    'interactive digital gift templates India',
    'personalized digital card templates',
    'birthday surprise templates India',
    'proposal website template',
    'anniversary digital card',
    'apology card online India',
    'i miss you digital card',
    'emotional digital experience India',
    'LovelyCrafts templates',
  ],
  alternates: { canonical: `${SITE_URL}/templates` },
  openGraph: {
    title: 'Browse Interactive Digital Gift Templates | LovelyCrafts',
    description: 'Birthday surprises, proposals, apologies, anniversaries & more — personalized interactive digital cards from ₹219.',
    url: `${SITE_URL}/templates`,
    type: 'website',
    siteName: SITE_NAME,
    locale: 'en_IN',
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: 'LovelyCrafts — Interactive Digital Gift Templates' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@lovelycraftsin',
    creator: '@lovelycraftsin',
    title: 'Browse Interactive Digital Gift Templates | LovelyCrafts',
    description: 'Birthday surprises, proposals, apologies, anniversaries & more from ₹219. Share on WhatsApp in minutes.',
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
          <div className="templates-proof-row" aria-label="What every experience includes">
            <span>📱 Opens on any phone</span>
            <span>🔗 Private shareable link</span>
            <span>✨ Live preview before you create</span>
          </div>
        </section>

        <section className="templates-section">
          <div className="templates-section-heading">
            <div>
              <span className="templates-section-label">Choose your moment</span>
              <h2>Something personal for every feeling</h2>
            </div>
            <p className="templates-subtitle">Each experience is made to be opened, tapped, and felt. Pick one, add your memories, then send the finished link.</p>
          </div>
          <TemplatesCatalog templates={templates} />
        </section>

        <section className="templates-how-it-works" aria-labelledby="how-your-gift-is-made">
          <div className="templates-section-heading templates-section-heading--centered">
            <div>
              <span className="templates-section-label">How it works</span>
              <h2 id="how-your-gift-is-made">Make something they can feel</h2>
            </div>
            <p className="templates-subtitle">No design skills or app download needed. Your words and memories become the experience.</p>
          </div>
          <div className="templates-process-grid">
            {[
              ['01', 'Pick an experience', 'Choose the feeling you want to send: celebration, romance, or a heartfelt second chance.', '🎁'],
              ['02', 'Add your magic', 'Tell us their name, add your photos, and write the words only you can say.', '💌'],
              ['03', 'Preview the moment', 'Open the live demo to see how the interactive story feels before you share it.', '👁️'],
              ['04', 'Share the private link', 'Send the finished experience on WhatsApp, Instagram, or wherever you talk.', '🔗'],
            ].map(([number, title, copy, icon]) => (
              <div key={number} className="templates-process-step">
                <div className="templates-process-topline"><span>{number}</span><b>{icon}</b></div>
                <h3>{title}</h3>
                <p>{copy}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="templates-faq" aria-labelledby="templates-faq-title">
          <div className="templates-section-heading templates-section-heading--centered">
            <div>
              <span className="templates-section-label">Before you create</span>
              <h2 id="templates-faq-title">Questions, answered</h2>
            </div>
            <p className="templates-subtitle">Everything you need to know before turning a feeling into a private digital surprise.</p>
          </div>
          <div className="templates-faq-list">
            <details>
              <summary>How will they open my experience?</summary>
              <p>You receive a private link after creating your note. Send it through WhatsApp, Instagram DM, SMS, or any app that supports links. They open it in their phone browser.</p>
            </details>
            <details>
              <summary>Can I add my own photos and message?</summary>
              <p>Yes. Each template asks for the details it needs, such as names, photos, dates, balloon messages, reasons, or a personal letter.</p>
            </details>
            <details>
              <summary>Can I see the experience before sharing it?</summary>
              <p>Yes. Use Live Demo on any template to open its interactive preview. Your final experience uses the same kind of recipient-facing interactions.</p>
            </details>
            <details>
              <summary>How long does it take to make?</summary>
              <p>Most templates take around three to four minutes to fill in. The time depends on how many photos and memories you choose to add.</p>
            </details>
          </div>
        </section>

        {/* Subtle Templates Page Ad Unit */}
        <GoogleAd slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_ID} className="templates-ad-banner" />
      </div>
    </main>
  );
}
