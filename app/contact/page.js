import Link from 'next/link';
import { SITE_URL, SITE_NAME, CONTACT_EMAIL, INSTAGRAM_URL, X_URL } from '@/lib/seo';

export const metadata = {
  title: 'Contact Us — Customer Support & Help Desk | LovelyCrafts',
  description:
    'Need help with your digital surprise, payment, or custom link? Contact the LovelyCrafts support team via email or form. Fast 24-hour response time.',
  alternates: { canonical: `${SITE_URL}/contact` },
  openGraph: {
    title: 'Contact LovelyCrafts — Help & Support Desk',
    description: 'Get in touch with LovelyCrafts customer support for queries regarding digital gifts, Creator Club, or payment assistance.',
    url: `${SITE_URL}/contact`,
    type: 'website',
    siteName: SITE_NAME,
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary',
    site: '@lovelycraftsin',
    title: 'Contact Support | LovelyCrafts',
    description: 'Contact LovelyCrafts support desk for assistance with your digital surprises.',
  },
  robots: { index: true, follow: true },
};

export default function ContactPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact LovelyCrafts',
    url: `${SITE_URL}/contact`,
    description: 'Contact LovelyCrafts customer support team for inquiries, order assistance, or creator club partnerships.',
    mainEntity: {
      '@type': 'Organization',
      name: SITE_NAME,
      email: CONTACT_EMAIL,
      url: SITE_URL,
      contactPoint: {
        '@type': 'ContactPoint',
        email: CONTACT_EMAIL,
        contactType: 'customer support',
        availableLanguage: ['English', 'Hindi'],
      },
    },
  };

  return (
    <main className="shell" style={{ padding: '3.5rem 1rem 5rem', background: '#fafaf9', minHeight: '100vh' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div style={{ maxWidth: '820px', margin: '0 auto' }}>
        {/* Breadcrumb */}
        <nav style={{ marginBottom: '2rem', fontSize: '0.9rem', color: '#64748b' }}>
          <Link href="/" style={{ color: '#e11d48', textDecoration: 'none', fontWeight: 600 }}>Home</Link>
          {' / '}
          <span style={{ fontWeight: 600, color: '#0f172a' }}>Contact Us</span>
        </nav>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>💌</div>
          <h1 style={{ fontSize: 'clamp(2rem, 4.5vw, 3rem)', fontWeight: 900, color: '#0f172a', margin: '0 0 0.75rem' }}>
            We’re Here to Help
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#64748b', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
            Have a question about creating a surprise, unlocking a link, or joining the Creator Club? Send us a message and our team will get back to you within 24 hours.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          
          {/* Direct Channels Card */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              padding: '2rem',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.25rem' }}>
                💬 Direct Support Channels
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#ffe4e6', color: '#e11d48', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>
                    ✉️
                  </div>
                  <div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>Email Support Desk</h3>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 4px' }}>For order status, link recovery, and general queries:</p>
                    <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: '#e11d48', fontWeight: 700, fontSize: '0.92rem', textDecoration: 'none' }}>
                      {CONTACT_EMAIL}
                    </a>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#f0fdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>
                    ⚡
                  </div>
                  <div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>Response SLA</h3>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                      We reply to all inquiries Monday through Sunday within <strong>2 to 24 hours</strong>.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>
                    🌐
                  </div>
                  <div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>Social Media DMs</h3>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 8px' }}>Follow us or reach out on social media:</p>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" style={{ background: '#fdf2f8', color: '#be185d', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none' }}>
                        Instagram ↗
                      </a>
                      <a href={X_URL} target="_blank" rel="noopener noreferrer" style={{ background: '#f8fafc', color: '#0f172a', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none' }}>
                        X (Twitter) ↗
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '2rem', padding: '1rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9', fontSize: '0.85rem', color: '#64748b' }}>
              ℹ️ Looking for immediate answers regarding digital gifts or payments? Check our <Link href="/faq" style={{ color: '#e11d48', fontWeight: 700 }}>Frequently Asked Questions</Link>.
            </div>
          </div>

          {/* Contact Form Box */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              padding: '2rem',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
            }}
          >
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.25rem' }}>
              📩 Send Us a Message
            </h2>

            <form action={`mailto:${CONTACT_EMAIL}`} method="post" encType="text/plain" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Sharma"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.92rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Your Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. priya@example.com"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.92rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Subject *
                </label>
                <select
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.92rem',
                    outline: 'none',
                    background: '#fff',
                  }}
                >
                  <option value="General Inquiry">General Question / Feedback</option>
                  <option value="Link Assistance">Link / Gift Note Assistance</option>
                  <option value="Payment Issue">Payment or Refund Help</option>
                  <option value="Creator Club">Creator Club / Affiliate Inquiry</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Message *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="How can we help you?"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.92rem',
                    outline: 'none',
                    resize: 'vertical',
                  }}
                />
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{
                  padding: '0.85rem',
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  borderRadius: '10px',
                  marginTop: '0.5rem',
                  cursor: 'pointer',
                  width: '100%',
                }}
              >
                ✉️ Send Message
              </button>
            </form>
          </div>

        </div>

      </div>
    </main>
  );
}
