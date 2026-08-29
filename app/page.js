import Link from 'next/link';
import { HeroPills, BentoGrid } from '@/components/ShuffledTemplates';
import EmotionFinder from '@/components/EmotionFinder';
import LiveActivityTicker from '@/components/LiveActivityTicker';

import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from '@/lib/seo';

const SPOTLIGHT_BESTSELLERS = [
  {
    id: 'birthday',
    title: 'Virtual Birthday Bash',
    icon: '🎂🎈',
    badge: '🔥 #1 BESTSELLER',
    tagline: 'Interactive Cake & Party',
    desc: 'Blow out real candles, slice the cake, trigger confetti bursts, and play their favorite song.',
    price: '₹199',
    originalPrice: '₹499',
    rating: '4.9 ★ (Top Favorite)',
    gradient: 'linear-gradient(135deg, #fff1f2, #ffe4e6)',
    borderColor: '#fecdd3'
  },
  {
    id: 'proposal',
    title: 'The Perfect Proposal',
    icon: '💍💖',
    badge: '👑 COUPLES CHOICE',
    tagline: 'Gamified Love Proposal',
    desc: 'An emotional journey with cute promises, photo slideshow, and the unforgettable question.',
    price: '₹199',
    originalPrice: '₹499',
    rating: '5.0 ★ (Couples Favorite)',
    gradient: 'linear-gradient(135deg, #fdf2f8, #fce7f3)',
    borderColor: '#fbcfe8'
  },
  {
    id: 'surprise-reveal-box',
    title: 'Surprise Reveal Box',
    icon: '🎁✨',
    badge: '✨ VIRAL UNBOXING',
    tagline: '3D Tap-to-Unbox',
    desc: 'They tap to untie the ribbon, open the secret 3D gift box, and uncover heartfelt memories.',
    price: '₹199',
    originalPrice: '₹499',
    rating: '4.9 ★ (Viral Hit)',
    gradient: 'linear-gradient(135deg, #faf5ff, #f3e8ff)',
    borderColor: '#e9d5ff'
  },
  {
    id: 'things-i-never-said',
    title: 'Things I Never Said',
    icon: '💌🕊️',
    badge: '❤️ DEEP EMOTION',
    tagline: 'Heartfelt Wax-Sealed Letter',
    desc: 'For the words left unsaid. A vintage sealed envelope with background music & voice note.',
    price: '₹199',
    originalPrice: '₹499',
    rating: '4.9 ★ (Deep Emotional)',
    gradient: 'linear-gradient(135deg, #ecfdf5, #d1fae5)',
    borderColor: '#a7f3d0'
  }
];

const TESTIMONIALS = [
  {
    name: 'Rohan & Sanya',
    city: 'Mumbai',
    avatar: '👩‍❤️‍👨',
    template: 'The Perfect Proposal',
    quote: 'She literally cried happy tears when the song started playing and the ring box opened! Sharing it over WhatsApp was so effortless.',
    rating: '★★★★★'
  },
  {
    name: 'Aditi Varma',
    city: 'Bengaluru',
    avatar: '🎉',
    template: 'Virtual Birthday Bash',
    quote: 'My best friend lives in London and this made her feel right at home! She loved cutting the virtual cake and reading the photo notes.',
    rating: '★★★★★'
  },
  {
    name: 'Kabir & Tanya',
    city: 'Delhi',
    avatar: '💌',
    template: 'Things I Never Said',
    quote: 'Worth every rupee. The music and wax seal feel so premium. Way more meaningful than any random printed card you buy in a shop.',
    rating: '★★★★★'
  }
];

const FAQS = [
  {
    q: 'How will my recipient open the surprise?',
    a: 'Once you customize your surprise, you receive a private 1-click link to share on WhatsApp, Instagram DM, or SMS. They just tap the link to experience it instantly—no app download required!'
  },
  {
    q: 'Can I add my own photos and music?',
    a: 'Yes! You can upload your favorite photos, custom heartfelt letters, choose mood music from our library or upload your own song track.'
  },
  {
    q: 'Is the surprise secure and private?',
    a: 'Absolutely. Only people with your private link can view it. You can even lock it with a custom secret passcode or anniversary date.'
  },
  {
    q: 'How long does it take to create?',
    a: 'Less than 2 to 3 minutes! Choose a template, add your text & photos, and generate your live link immediately.'
  }
];

export const metadata = {
  title: 'LovelyCrafts — Interactive Digital Gifts & Personalized Surprises India',
  description: 'Create stunning interactive digital surprises in 3 minutes. Birthday cards, romantic proposals, apology notes, anniversary gifts, and 18+ emotional experiences — personalized with your photos & message. Starting at ₹199. Share instantly on WhatsApp.',
  keywords: [
    'personalized digital gift India',
    'interactive birthday card India',
    'send surprise on WhatsApp',
    'online proposal for girlfriend',
    'romantic anniversary gift online',
    'interactive apology card',
    'digital gift for long distance relationship',
    'get well soon digital card India',
    'fathers day digital gift',
    'letter to dad online India',
    'Raksha Bandhan digital surprise',
    'wedding invitation online India',
    'digital birthday surprise link',
    'emotional digital card India',
    'LovelyCrafts',
    'lovelycrafts.in',
  ],
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: 'LovelyCrafts — Interactive Digital Gifts & Personalized Surprises India',
    description: 'Create stunning interactive digital surprises in 3 minutes. Birthday cards, proposals, apology notes, anniversary gifts, and 18+ emotional experiences — starting at ₹199.',
    url: SITE_URL,
    locale: 'en_IN',
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: 'LovelyCrafts — Personalized Digital Surprises from ₹199' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@lovelycraftsin',
    creator: '@lovelycraftsin',
    title: 'LovelyCrafts — Interactive Digital Gifts & Surprises India',
    description: 'Birthday cards, proposals, apology notes & 18+ emotional digital experiences starting at ₹199. Share on WhatsApp in seconds.',
    images: [DEFAULT_OG_IMAGE],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
};

export default function Home() {
  return (
    <main className="shell">
      <div className="main-content">

        {/* Live Social Proof Activity Ticker */}
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <LiveActivityTicker />
        </div>

        {/* Hero Section */}
        <section className="hero-section text-center mt-1 mb-6" style={{ background: '#ffffff', borderRadius: 'clamp(20px, 5vw, 32px)', padding: 'clamp(1.75rem, 5vw, 3.25rem) clamp(1rem, 4vw, 2rem)', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 20px 40px rgba(0,0,0,0.03)' }}>
          
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#fff1f2', border: '1px solid #fecdd3', padding: '0.35rem 0.95rem', borderRadius: '99px', fontSize: 'clamp(0.72rem, 1.8vw, 0.8rem)', color: '#be185d', fontWeight: 800, marginBottom: '1rem' }}>
            <span>⭐ HIGHLY RATED DIGITAL GIFTS</span>
            <span>•</span>
            <span>Instant 1-Click WhatsApp Surprises</span>
          </div>

          <h1 style={{ fontSize: 'clamp(1.85rem, 6.5vw, 3.6rem)', lineHeight: 1.15, fontWeight: 800, color: '#1c1917', marginBottom: '1rem', letterSpacing: '-0.03em' }}>
            Craft unforgettable<br />
            <em className="cursive" style={{ fontSize: '1.05em', color: 'var(--accent-primary)' }}>interactive digital surprises.</em>
          </h1>

          <p className="hero-copy text-muted" style={{ maxWidth: '640px', margin: '0 auto 1.5rem', fontSize: 'clamp(0.92rem, 2.5vw, 1.08rem)', lineHeight: 1.6 }}>
            Say goodbye to boring text messages &amp; greeting cards. Turn special photos, heartfelt letters, and music into gamified digital moments they open right on their phone in seconds.
          </p>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#fdf2f8', border: '1px solid #fbcfe8', padding: '0.4rem 1.1rem', borderRadius: '99px', fontSize: 'clamp(0.8rem, 2vw, 0.9rem)', color: '#831843', fontWeight: 700, marginBottom: '1.5rem' }}>
            <span>🎉 Launch Pricing:</span>
            <del style={{ color: '#9ca3af', fontWeight: 400 }}>₹499</del>
            <span style={{ color: '#16a34a', fontWeight: 800 }}>₹199 only (60% OFF)</span>
          </div>

          {/* Quick Pill Navigation */}
          <HeroPills />

          <div className="hero-actions" style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
            <Link href="/templates" className="btn-primary" style={{ padding: 'clamp(0.8rem, 2.5vw, 1rem) clamp(1.6rem, 4vw, 2.4rem)', fontSize: 'clamp(0.95rem, 2vw, 1.05rem)', fontWeight: 800, boxShadow: '0 8px 24px rgba(244,63,94,0.3)' }}>
              ✨ Craft a Surprise Now (₹199)
            </Link>
            <a href="#bestsellers" className="btn-secondary" style={{ padding: 'clamp(0.8rem, 2.5vw, 1rem) clamp(1.3rem, 3.5vw, 1.8rem)', fontSize: 'clamp(0.9rem, 2vw, 0.98rem)', fontWeight: 700 }}>
              🔥 View Best Sellers ↓
            </a>
          </div>
        </section>

        {/* Spotlight Best Sellers Section */}
        <section id="bestsellers" style={{ marginBottom: '3.5rem' }}>
          <div className="text-center" style={{ marginBottom: '2rem' }}>
            <span style={{
              background: 'linear-gradient(135deg, #f43f5e, #be185d)',
              color: '#ffffff',
              fontSize: '0.75rem',
              fontWeight: 800,
              padding: '0.35rem 1rem',
              borderRadius: '999px',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              display: 'inline-block',
              boxShadow: '0 4px 14px rgba(244,63,94,0.2)'
            }}>
              🔥 MOST POPULAR EXPERIENCES
            </span>
            <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', marginTop: '0.6rem', fontWeight: 800, color: '#1c1917' }}>
              Trending Surprises Senders Love
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '600px', margin: '0.35rem auto 0', lineHeight: 1.5 }}>
              Choose a viral gamified template, add your personal memories, and send in 2 minutes.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {SPOTLIGHT_BESTSELLERS.map((item) => (
              <div
                key={item.id}
                style={{
                  background: '#ffffff',
                  border: `1.5px solid ${item.borderColor}`,
                  borderRadius: '24px',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.04)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#be185d', background: '#fff1f2', padding: '0.25rem 0.65rem', borderRadius: '999px', border: '1px solid #fecdd3' }}>
                      {item.badge}
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f59e0b' }}>
                      {item.rating}
                    </span>
                  </div>

                  <div style={{ fontSize: '2.8rem', marginBottom: '0.5rem' }}>{item.icon}</div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1f2937', margin: '0 0 0.25rem' }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#be185d', margin: '0 0 0.5rem' }}>
                    {item.tagline}
                  </p>
                  <p style={{ fontSize: '0.9rem', color: '#6b7280', lineHeight: 1.5, margin: '0 0 1.25rem' }}>
                    {item.desc}
                  </p>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '1.35rem', fontWeight: 900, color: '#16a34a' }}>{item.price}</span>
                    <del style={{ fontSize: '0.9rem', color: '#9ca3af' }}>{item.originalPrice}</del>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#e11d48', background: '#fff1f2', padding: '0.15rem 0.45rem', borderRadius: '6px' }}>60% OFF</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <Link
                      href={`/templates/${item.id}`}
                      className="btn-secondary"
                      style={{ padding: '0.65rem', fontSize: '0.85rem', fontWeight: 700, textAlign: 'center' }}
                    >
                      👁️ Preview
                    </Link>
                    <Link
                      href={`/create?template=${item.id}`}
                      className="btn-primary"
                      style={{ padding: '0.65rem', fontSize: '0.85rem', fontWeight: 800, textAlign: 'center', background: 'linear-gradient(135deg, #f43f5e, #be185d)' }}
                    >
                      ✨ Customize
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '1.75rem' }}>
            <Link href="/templates" className="btn-secondary" style={{ padding: '0.75rem 1.75rem', fontSize: '0.95rem', fontWeight: 700 }}>
              Browse All 18+ Interactive Templates →
            </Link>
          </div>
        </section>

        <div id="feelings"><EmotionFinder /></div>

        {/* Bento Grid: Something for Every Moment */}
        <section className="bento-section" id="experiences">
          <div className="text-center" style={{ marginBottom: '2rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--accent-primary)' }}>
              COMPLETE CATALOG
            </span>
            <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', marginTop: '0.35rem', fontWeight: 600, color: '#1c1917' }}>
              Something for every moment
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.35rem' }}>
              Choose a gamified interactive template and personalize it in 2 minutes.
            </p>
          </div>

          <BentoGrid />
        </section>

        {/* Why Choose LovelyCrafts Comparison Matrix */}
        <section style={{
          background: 'linear-gradient(180deg, #ffffff 0%, #fffbfb 100%)',
          borderRadius: '32px',
          padding: 'clamp(2rem, 5vw, 3.5rem) clamp(1rem, 4vw, 2.5rem)',
          border: '1px solid #fecdd3',
          boxShadow: '0 12px 36px rgba(190, 24, 93, 0.05)',
          marginBottom: '3.5rem'
        }}>
          <div className="text-center" style={{ marginBottom: '2rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#be185d' }}>
              THE SMARTER SURPRISE
            </span>
            <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#1c1917', marginTop: '0.35rem' }}>
              Why People Choose LovelyCrafts
            </h2>
            <p style={{ color: '#6b7280', fontSize: '0.95rem', maxWidth: '540px', margin: '0.35rem auto 0' }}>
              See why modern couples &amp; besties prefer interactive digital surprises over physical cards.
            </p>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '540px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #fecdd3' }}>
                  <th style={{ padding: '0.85rem 1rem', color: '#374151', fontSize: '0.9rem' }}>Feature</th>
                  <th style={{ padding: '0.85rem 1rem', color: '#9ca3af', fontSize: '0.85rem' }}>Paper Cards</th>
                  <th style={{ padding: '0.85rem 1rem', color: '#9ca3af', fontSize: '0.85rem' }}>Plain WhatsApp</th>
                  <th style={{ padding: '0.85rem 1rem', color: '#be185d', fontSize: '0.95rem', fontWeight: 800, background: '#fff1f2', borderRadius: '12px 12px 0 0' }}>
                    ❤️ LovelyCrafts
                  </th>
                </tr>
              </thead>
              <tbody style={{ fontSize: '0.88rem' }}>
                <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#1f2937' }}>Interactive Experience (Cake, Unboxing, Quiz)</td>
                  <td style={{ padding: '0.85rem 1rem', color: '#ef4444' }}>✕ No</td>
                  <td style={{ padding: '0.85rem 1rem', color: '#ef4444' }}>✕ No</td>
                  <td style={{ padding: '0.85rem 1rem', color: '#16a34a', fontWeight: 800, background: '#fff1f2' }}>✓ Full 3D Interactive</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#1f2937' }}>Background Music &amp; Voice Notes</td>
                  <td style={{ padding: '0.85rem 1rem', color: '#ef4444' }}>✕ No</td>
                  <td style={{ padding: '0.85rem 1rem', color: '#ef4444' }}>✕ No</td>
                  <td style={{ padding: '0.85rem 1rem', color: '#16a34a', fontWeight: 800, background: '#fff1f2' }}>✓ Custom Song Track</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#1f2937' }}>Photo Gallery &amp; Slideshow</td>
                  <td style={{ padding: '0.85rem 1rem', color: '#9ca3af' }}>Expensive print</td>
                  <td style={{ padding: '0.85rem 1rem', color: '#9ca3af' }}>Cluttered chat media</td>
                  <td style={{ padding: '0.85rem 1rem', color: '#16a34a', fontWeight: 800, background: '#fff1f2' }}>✓ Beautiful Polaroid Gallery</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#1f2937' }}>Delivery Time</td>
                  <td style={{ padding: '0.85rem 1rem', color: '#6b7280' }}>2 to 4 Days courier</td>
                  <td style={{ padding: '0.85rem 1rem', color: '#6b7280' }}>Instant (boring)</td>
                  <td style={{ padding: '0.85rem 1rem', color: '#16a34a', fontWeight: 800, background: '#fff1f2' }}>⚡ Instant (Under 2 mins)</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#1f2937' }}>Forever Keepsake Link</td>
                  <td style={{ padding: '0.85rem 1rem', color: '#ef4444' }}>Lost in drawer</td>
                  <td style={{ padding: '0.85rem 1rem', color: '#ef4444' }}>Lost in chat history</td>
                  <td style={{ padding: '0.85rem 1rem', color: '#16a34a', fontWeight: 800, background: '#fff1f2', borderRadius: '0 0 12px 12px' }}>
                    ✓ Accessible Anytime
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="how-it-works-section" style={{ marginBottom: '3.5rem' }}>
          <div className="text-center">
            <span style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--accent-primary)' }}>
              SIMPLE 3-STEP PROCESS
            </span>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)', marginTop: '0.25rem', fontWeight: 600, color: '#1c1917' }}>
              How it works
            </h2>
          </div>

          <div className="how-it-works-grid">
            <div className="how-card">
              <div className="how-step-num">1</div>
              <h3 className="how-title">Pick an Experience</h3>
              <p className="how-desc">Select from Proposals, Puzzles, Birthday Bashes, Sorry Cards, or Romantic Letters.</p>
            </div>
            <div className="how-card">
              <div className="how-step-num">2</div>
              <h3 className="how-title">Add Your Personal Touch</h3>
              <p className="how-desc">Upload special photos, craft heartfelt letters, add secret passcode, and choose music.</p>
            </div>
            <div className="how-card">
              <div className="how-step-num">3</div>
              <h3 className="how-title">Send with Love</h3>
              <p className="how-desc">Share a private link directly via WhatsApp or SMS. Watch their reaction live!</p>
            </div>
          </div>
        </section>

        {/* Real Customer Stories & Reviews */}
        <section style={{ marginBottom: '3.5rem' }}>
          <div className="text-center" style={{ marginBottom: '2rem' }}>
            <span style={{
              background: '#fef3c7',
              color: '#d97706',
              fontSize: '0.75rem',
              fontWeight: 800,
              padding: '0.3rem 0.9rem',
              borderRadius: '999px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              display: 'inline-block'
            }}>
              ⭐ REAL REVIEWS
            </span>
            <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#1c1917', marginTop: '0.5rem' }}>
              Loved Across India • Authentic Stories
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {TESTIMONIALS.map((t, idx) => (
              <div
                key={idx}
                style={{
                  background: '#ffffff',
                  border: '1px solid #fecdd3',
                  borderRadius: '20px',
                  padding: '1.5rem',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ color: '#f59e0b', fontSize: '1.1rem', marginBottom: '0.5rem' }}>{t.rating}</div>
                  <p style={{ fontSize: '0.92rem', color: '#374151', lineHeight: 1.6, fontStyle: 'italic', margin: '0 0 1rem' }}>
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderTop: '1px solid #f3f4f6', paddingTop: '0.75rem' }}>
                  <div style={{ fontSize: '1.8rem' }}>{t.avatar}</div>
                  <div>
                    <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#1f2937', margin: 0 }}>{t.name}</h4>
                    <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{t.city} • Used <em>{t.template}</em></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQs Section */}
        <section style={{
          background: '#ffffff',
          border: '1px solid rgba(0,0,0,0.06)',
          borderRadius: '28px',
          padding: 'clamp(2rem, 5vw, 3rem) clamp(1rem, 4vw, 2rem)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
          marginBottom: '3.5rem'
        }}>
          <div className="text-center" style={{ marginBottom: '2rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#be185d' }}>
              GOT QUESTIONS?
            </span>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)', fontWeight: 800, color: '#1c1917', marginTop: '0.35rem' }}>
              Frequently Asked Questions
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', maxWidth: '820px', margin: '0 auto' }}>
            {FAQS.map((faq, idx) => (
              <div key={idx} style={{ background: '#fafaf9', padding: '1.25rem', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1f2937', margin: '0 0 0.5rem' }}>
                  ❓ {faq.q}
                </h4>
                <p style={{ fontSize: '0.86rem', color: '#6b7280', margin: 0, lineHeight: 1.5 }}>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* High-Urgency Bottom Call-to-Action Banner */}
        <section style={{
          background: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 50%, #fdf2f8 100%)',
          border: '2px solid #f43f5e',
          borderRadius: '32px',
          padding: 'clamp(2rem, 5vw, 3.5rem) clamp(1rem, 4vw, 2rem)',
          textAlign: 'center',
          boxShadow: '0 16px 40px rgba(244,63,94,0.15)',
          marginBottom: '2rem'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>💝 ✨ 🚀</div>
          
          <h2 style={{ fontSize: 'clamp(1.75rem, 4.5vw, 2.75rem)', fontWeight: 900, color: '#881337', marginBottom: '0.5rem' }}>
            Ready to Make Someone Cry Happy Tears?
          </h2>
          
          <p style={{ color: '#9f1239', fontSize: '1.05rem', maxWidth: '580px', margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
            Create a private, interactive digital experience that will touch their heart and stay forever.
          </p>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#ffffff', border: '1px solid #fecdd3', padding: '0.45rem 1.2rem', borderRadius: '999px', fontWeight: 800, color: '#be185d', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            <span>🏷️ Use Code <strong>NEW2026</strong> for Extra Discount</span>
          </div>

          <div>
            <Link
              href="/templates"
              className="btn-primary"
              style={{
                padding: 'clamp(0.85rem, 2.5vw, 1.1rem) clamp(2rem, 5vw, 3rem)',
                fontSize: 'clamp(1rem, 2vw, 1.15rem)',
                fontWeight: 800,
                borderRadius: '999px',
                background: 'linear-gradient(135deg, #f43f5e, #be185d)',
                boxShadow: '0 8px 24px rgba(244,63,94,0.35)',
                display: 'inline-block'
              }}
            >
              ✨ Choose an Experience &amp; Start (₹199) →
            </Link>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.25rem', marginTop: '1.25rem', fontSize: '0.8rem', color: '#9f1239', fontWeight: 600, flexWrap: 'wrap' }}>
            <span>⚡ Ready in under 3 mins</span>
            <span>•</span>
            <span>📱 1-Click WhatsApp Share</span>
            <span>•</span>
            <span>🔒 100% Satisfaction Guarantee</span>
          </div>
        </section>

      </div>
    </main>
  );
}

