import Link from 'next/link';
import { SITE_URL, SITE_NAME, CONTACT_EMAIL } from '@/lib/seo';

export const metadata = {
  title: 'Frequently Asked Questions (FAQ) | LovelyCrafts',
  description:
    'Find answers to all your questions about creating digital surprises, photo privacy, custom background music, WhatsApp links, payments, and Creator Club.',
  alternates: { canonical: `${SITE_URL}/faq` },
  openGraph: {
    title: 'LovelyCrafts FAQ — Everything You Need to Know',
    description: 'Got questions about creating digital gifts, security, or sharing links? Read our detailed guide.',
    url: `${SITE_URL}/faq`,
    type: 'website',
    siteName: SITE_NAME,
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@lovelycraftsin',
    title: 'LovelyCrafts FAQ — Frequently Asked Questions',
    description: 'Find answers to all your questions about LovelyCrafts digital gifts and surprises.',
  },
  robots: { index: true, follow: true },
};

const FAQ_CATEGORIES = [
  {
    category: '🎁 Creating & Sharing Surprises',
    faqs: [
      {
        q: 'How does my recipient open the digital surprise?',
        a: 'Once you finish personalizing your chosen template, you receive a unique, private link. You can share this link on WhatsApp, Instagram DM, SMS, or email. Your recipient simply taps the link on their mobile device or desktop browser to open the experience.',
      },
      {
        q: 'Do recipients need to install any app to view their gift?',
        a: 'No! LovelyCrafts experiences run directly in any web browser (Safari, Chrome, Firefox, WhatsApp Browser). No apps, downloads, or logins are required for the recipient.',
      },
      {
        q: 'How long does it take to create a digital gift?',
        a: 'Most experience templates take only 2 to 3 minutes to fill out. You can upload photos, add a custom letter, choose background music, and set up a secret passcode in just a few taps.',
      },
      {
        q: 'Can I preview my surprise before sending it?',
        a: 'Yes! Every template features a "Live Demo" button where you can interact with the full experience before creating your personalized version.',
      },
    ],
  },
  {
    category: '🔒 Privacy, Security & Data',
    faqs: [
      {
        q: 'Is my digital surprise private?',
        a: 'Yes, 100%. Only people with your unique link can access your gift experience. Search engines like Google do not index recipient links.',
      },
      {
        q: 'Can I add a secret passcode or date lock?',
        a: 'Yes! Many of our templates allow you to add a custom passcode, anniversary date lock, or midnight countdown lock so your recipient can only open it at the exact moment you choose.',
      },
      {
        q: 'How long are created links accessible?',
        a: 'Created gift experiences remain accessible via their private link for 90 days, giving your recipient plenty of time to revisit and relive the memory.',
      },
    ],
  },
  {
    category: '💳 Payments & Refunds',
    faqs: [
      {
        q: 'What payment methods do you accept?',
        a: 'We process payments securely via Razorpay, supporting Google Pay, PhonePe, Paytm, UPI, all major Credit/Debit cards, and Net Banking.',
      },
      {
        q: 'What is your refund policy?',
        a: 'If you encounter any technical glitch or issues accessing your created link, our support team will resolve it or provide a full refund within 7 days. Check our Refund Policy for details.',
      },
    ],
  },
  {
    category: '👑 Creator Club & Affiliates',
    faqs: [
      {
        q: 'What is the LovelyCrafts Creator Club?',
        a: 'The Creator Club is our affiliate program for content creators, influencers, and digital marketers. Creators get a custom referral link/coupon and earn up to 18% commission on referred template unlocks.',
      },
      {
        q: 'How are creator payouts processed?',
        a: 'Payouts are disbursed weekly via direct UPI transfer or bank transfer once creator earnings meet the minimum payout threshold.',
      },
    ],
  },
];

export default function FAQPage() {
  const faqSchemaItems = FAQ_CATEGORIES.flatMap((cat) => cat.faqs).map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.a,
    },
  }));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqSchemaItems,
  };

  return (
    <main className="shell" style={{ padding: '3.5rem 1rem 5rem', background: '#fafaf9', minHeight: '100vh' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div style={{ maxWidth: '840px', margin: '0 auto' }}>
        {/* Breadcrumb */}
        <nav style={{ marginBottom: '2rem', fontSize: '0.9rem', color: '#64748b' }}>
          <Link href="/" style={{ color: '#e11d48', textDecoration: 'none', fontWeight: 600 }}>Home</Link>
          {' / '}
          <span style={{ fontWeight: 600, color: '#0f172a' }}>FAQ</span>
        </nav>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span
            style={{
              background: '#ffe4e6',
              color: '#e11d48',
              padding: '4px 14px',
              borderRadius: '999px',
              fontSize: '0.78rem',
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              display: 'inline-block',
              marginBottom: '0.75rem',
            }}
          >
            ❓ HELP &amp; KNOWLEDGE BASE
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 4.5vw, 3rem)', fontWeight: 900, color: '#0f172a', margin: '0 0 0.75rem' }}>
            Frequently Asked Questions
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#64748b', maxWidth: '620px', margin: '0 auto', lineHeight: 1.6 }}>
            Everything you need to know about creating, personalizing, and sharing interactive digital gift links on LovelyCrafts.
          </p>
        </div>

        {/* Categories */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {FAQ_CATEGORIES.map((cat, idx) => (
            <section
              key={idx}
              style={{
                background: '#ffffff',
                borderRadius: '20px',
                padding: '2rem',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
              }}
            >
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.25rem' }}>
                {cat.category}
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {cat.faqs.map((faq, fIdx) => (
                  <details
                    key={fIdx}
                    style={{
                      background: '#f8fafc',
                      borderRadius: '12px',
                      padding: '1rem 1.25rem',
                      border: '1px solid #f1f5f9',
                      cursor: 'pointer',
                    }}
                  >
                    <summary style={{ fontWeight: 700, fontSize: '0.98rem', color: '#1e293b', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>{faq.q}</span>
                      <span style={{ color: '#e11d48', fontSize: '1.2rem', marginLeft: '12px' }}>+</span>
                    </summary>
                    <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.6, margin: '0.75rem 0 0', borderTop: '1px solid #e2e8f0', paddingTop: '0.75rem' }}>
                      {faq.a}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Contact CTA Banner */}
        <div
          style={{
            marginTop: '3.5rem',
            background: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)',
            borderRadius: '20px',
            padding: '2.5rem 2rem',
            textAlign: 'center',
            border: '1.5px solid #fecdd3',
          }}
        >
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#881337', margin: '0 0 0.5rem' }}>
            Still have questions?
          </h2>
          <p style={{ fontSize: '0.95rem', color: '#9f1239', maxWidth: '500px', margin: '0 auto 1.5rem', lineHeight: 1.5 }}>
            Our customer support desk is ready to help you craft the perfect surprise link.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/contact" className="btn-primary" style={{ padding: '0.75rem 1.5rem', fontSize: '0.9rem', fontWeight: 800 }}>
              💬 Contact Support Desk
            </Link>
            <a href={`mailto:${CONTACT_EMAIL}`} className="btn-secondary" style={{ padding: '0.75rem 1.5rem', fontSize: '0.9rem', fontWeight: 700 }}>
              ✉️ Email Us Directly
            </a>
          </div>
        </div>

      </div>
    </main>
  );
}
