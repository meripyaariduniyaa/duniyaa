import Link from 'next/link';
import { SITE_URL, SITE_NAME, CONTACT_EMAIL, INSTAGRAM_URL, X_URL } from '@/lib/seo';

export const metadata = {
  title: 'About Us — Personal Digital Surprises & Experience Platform | LovelyCrafts',
  description:
    'Learn about LovelyCrafts, India’s leading interactive digital gifting and surprise link platform. Read our story, mission, privacy standards, and team values.',
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: {
    title: 'About LovelyCrafts — Personalized Digital Gifts & Surprises India',
    description:
      'Discover how LovelyCrafts turns heartfelt emotions, memories, and photos into private, interactive digital surprises shared instantly on WhatsApp.',
    url: `${SITE_URL}/about`,
    type: 'website',
    siteName: SITE_NAME,
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@lovelycraftsin',
    title: 'About LovelyCrafts — Crafting Heartfelt Digital Surprises',
    description: 'Learn about LovelyCrafts, our mission, values, and how we help people express emotions digitally.',
  },
  robots: { index: true, follow: true },
};

export default function AboutPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About LovelyCrafts',
    url: `${SITE_URL}/about`,
    description:
      'LovelyCrafts is an Indian digital surprise and interactive gifting platform enabling users to send custom virtual birthday bashes, romantic proposals, apology cards, and memory scrapbooks.',
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/icon.png`,
      email: CONTACT_EMAIL,
    },
  };

  return (
    <main className="shell" style={{ padding: '3.5rem 1rem 5rem', background: '#fafaf9', minHeight: '100vh' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div style={{ maxWidth: '860px', margin: '0 auto' }}>
        {/* Breadcrumb */}
        <nav style={{ marginBottom: '2rem', fontSize: '0.9rem', color: '#64748b' }}>
          <Link href="/" style={{ color: '#e11d48', textDecoration: 'none', fontWeight: 600 }}>Home</Link>
          {' / '}
          <span style={{ fontWeight: 600, color: '#0f172a' }}>About Us</span>
        </nav>

        {/* Hero Banner */}
        <header
          style={{
            background: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 60%, #fff 100%)',
            borderRadius: '24px',
            padding: '3rem 2rem',
            border: '1px solid #fecdd3',
            textAlign: 'center',
            marginBottom: '3rem',
            boxShadow: '0 10px 30px rgba(225,29,72,0.06)',
          }}
        >
          <span
            style={{
              background: '#e11d48',
              color: '#fff',
              padding: '4px 14px',
              borderRadius: '999px',
              fontSize: '0.78rem',
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              display: 'inline-block',
              marginBottom: '1rem',
            }}
          >
            ✨ OUR STORY &amp; MISSION
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 4.5vw, 3rem)', fontWeight: 900, color: '#0f172a', margin: '0 0 1rem', lineHeight: 1.15 }}>
            Turning Heartfelt Feelings Into <br />
            <span style={{ color: '#e11d48' }}>Interactive Digital Surprises</span>
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#475569', maxWidth: '680px', margin: '0 auto', lineHeight: 1.6 }}>
            At LovelyCrafts, we believe that expressing love, gratitude, or a genuine apology should feel personal, memorable, and instant—no matter the physical distance between two people.
          </p>
        </header>

        {/* Main Content Body */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          
          {/* Section 1: Who We Are */}
          <section
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              padding: '2rem',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
            }}
          >
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>💡</span> Who We Are
            </h2>
            <p style={{ fontSize: '1rem', color: '#334155', lineHeight: 1.7, marginBottom: '1rem' }}>
              LovelyCrafts is an innovative digital experience studio based in India. We build interactive web-based surprises that replace static greeting cards and plain chat texts with rich, immersive web pages.
            </p>
            <p style={{ fontSize: '1rem', color: '#334155', lineHeight: 1.7, margin: 0 }}>
              Whether you want to send a midnight virtual birthday cake with real candle-blowing mechanics, a romantic proposal with custom photo polaroids and soft background melodies, or a gentle apology letter that gives space to heal, LovelyCrafts provides the creative canvas for your memories.
            </p>
          </section>

          {/* Section 2: Why We Created LovelyCrafts */}
          <section
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              padding: '2rem',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
            }}
          >
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>❤️</span> Why We Built LovelyCrafts
            </h2>
            <p style={{ fontSize: '1rem', color: '#334155', lineHeight: 1.7, marginBottom: '1rem' }}>
              In today’s fast-paced digital world, communication often gets reduced to quick emojis or forwarded images on WhatsApp. Physical greeting cards take days to deliver and often end up tucked away in a drawer.
            </p>
            <p style={{ fontSize: '1rem', color: '#334155', lineHeight: 1.7, margin: 0 }}>
              We asked a simple question: <em>What if a digital message could feel as tactile, romantic, and thoughtful as a handwritten letter or a secret treasure box?</em> LovelyCrafts was born out of this desire to blend technology with deep human emotion.
            </p>
          </section>

          {/* Section 3: Core Principles & Trust */}
          <section
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              padding: '2rem',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
            }}
          >
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>🛡️</span> Our Core Principles
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
              <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '14px', border: '1px solid #f1f5f9' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#e11d48', margin: '0 0 0.5rem' }}>🔒 100% Privacy</h3>
                <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                  Your photos, letters, and audio recordings are private. Only the person with your unguessable custom link can access the experience.
                </p>
              </div>

              <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '14px', border: '1px solid #f1f5f9' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#e11d48', margin: '0 0 0.5rem' }}>⚡ Instant Delivery</h3>
                <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                  No waiting for courier shipping. Create your surprise link in 2 minutes and share it instantly via WhatsApp, Instagram, or SMS.
                </p>
              </div>

              <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '14px', border: '1px solid #f1f5f9' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#e11d48', margin: '0 0 0.5rem' }}>🎵 Rich Multimedia</h3>
                <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                  Combine ambient audio tracks, polaroid galleries, interactive games, and secret passcodes into one seamless mobile experience.
                </p>
              </div>

              <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '14px', border: '1px solid #f1f5f9' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#e11d48', margin: '0 0 0.5rem' }}>👑 Creator Empowerment</h3>
                <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                  Through our Creator Club, independent designers and affiliate creators earn up to 18% commission sharing moments of joy.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: Contact & Office Desk */}
          <section
            style={{
              background: 'linear-gradient(135deg, #fff1f2 0%, #ffffff 100%)',
              borderRadius: '20px',
              padding: '2rem',
              border: '1.5px solid #fecdd3',
              boxShadow: '0 6px 20px rgba(225,29,72,0.04)',
            }}
          >
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#881337', marginBottom: '0.75rem' }}>
              📫 Get In Touch With Us
            </h2>
            <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              Have questions, feedback, or need help creating your custom surprise link? Our customer support desk is always ready to assist you.
            </p>

            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.92rem', color: '#0f172a' }}>
              <div>
                <strong>📧 Customer Support Email:</strong><br />
                <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: '#e11d48', textDecoration: 'none', fontWeight: 700 }}>
                  {CONTACT_EMAIL}
                </a>
              </div>

              <div>
                <strong>🌐 Social Profiles:</strong><br />
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" style={{ color: '#e11d48', textDecoration: 'none', fontWeight: 700, marginRight: '12px' }}>
                  Instagram ↗
                </a>
                <a href={X_URL} target="_blank" rel="noopener noreferrer" style={{ color: '#e11d48', textDecoration: 'none', fontWeight: 700 }}>
                  X (Twitter) ↗
                </a>
              </div>
            </div>
          </section>

        </div>

        {/* Footer Navigation Buttons */}
        <div style={{ marginTop: '3.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/templates" className="btn-primary" style={{ padding: '0.8rem 1.75rem', fontSize: '0.95rem', fontWeight: 800 }}>
            ✨ Explore Gift Templates
          </Link>
          <Link href="/contact" className="btn-secondary" style={{ padding: '0.8rem 1.75rem', fontSize: '0.95rem', fontWeight: 700 }}>
            💬 Contact Desk
          </Link>
          <Link href="/faq" className="btn-secondary" style={{ padding: '0.8rem 1.75rem', fontSize: '0.95rem', fontWeight: 700 }}>
            ❓ View FAQs
          </Link>
        </div>

      </div>
    </main>
  );
}
