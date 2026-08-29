import Link from 'next/link';
import { HeroPills, BentoGrid } from '@/components/ShuffledTemplates';
import EmotionFinder from '@/components/EmotionFinder';

import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from '@/lib/seo';

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
        {/* Hero Section */}
        <section className="hero-section text-center mt-2 mb-6" style={{ background: '#ffffff', borderRadius: 'clamp(20px, 5vw, 32px)', padding: 'clamp(1.75rem, 5vw, 3.25rem) clamp(1rem, 4vw, 2rem)', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 20px 40px rgba(0,0,0,0.03)' }}>
          <span style={{ fontSize: 'clamp(0.68rem, 1.8vw, 0.75rem)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent-primary)', background: '#fafaf9', padding: '0.3rem 0.85rem', borderRadius: '99px', border: '1px solid rgba(0,0,0,0.06)', display: 'inline-block', marginBottom: '1rem' }}>
            Personalized Digital Gifts for People You Love
          </span>

          <h1 style={{ fontSize: 'clamp(1.75rem, 6.5vw, 3.5rem)', lineHeight: 1.15, fontWeight: 700, color: '#1c1917', marginBottom: '1rem', letterSpacing: '-0.03em' }}>
            Craft unforgettable<br />
            <em className="cursive" style={{ fontSize: '1em', color: 'var(--accent-primary)' }}>interactive surprises.</em>
          </h1>

          <p className="hero-copy text-muted" style={{ maxWidth: '640px', margin: '0 auto 1.5rem', fontSize: 'clamp(0.9rem, 2.5vw, 1.05rem)', lineHeight: 1.6 }}>
            Go beyond standard greeting cards. Turn special moments, photos, and heartfelt messages into gamified digital experiences they open right on their phone.
          </p>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#fafaf9', border: '1px solid rgba(0,0,0,0.08)', padding: '0.35rem 0.95rem', borderRadius: '99px', fontSize: 'clamp(0.78rem, 2vw, 0.85rem)', color: '#1c1917', fontWeight: 600, marginBottom: '1.5rem' }}>
            <span>🎉 Special Offer:</span>
            <del style={{ color: 'var(--text-muted)', fontWeight: 400 }}>₹499</del>
            <span style={{ color: '#16a34a' }}>₹199 (60% OFF)</span>
          </div>

          {/* Quick Pill Navigation */}
          <HeroPills />

          <div className="hero-actions" style={{ marginTop: '1.25rem' }}>
            <Link href="/templates" className="btn-primary" style={{ padding: 'clamp(0.75rem, 2.5vw, 0.95rem) clamp(1.4rem, 4vw, 2.25rem)', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>
              ✨ Craft a Surprise Now
            </Link>
            <a href="#experiences" className="btn-secondary" style={{ padding: 'clamp(0.75rem, 2.5vw, 0.95rem) clamp(1.2rem, 3.5vw, 1.75rem)', fontSize: 'clamp(0.85rem, 2vw, 0.95rem)' }}>
              Explore Experiences ↓
            </a>
          </div>
        </section>

        <div id="feelings"><EmotionFinder /></div>

        {/* Bento Grid: Something for Every Moment */}
        <section className="bento-section" id="experiences">
          <div className="text-center" style={{ marginBottom: '2rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--accent-primary)' }}>
              OUR EXPERIENCES
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

        {/* How It Works Section */}
        <section className="how-it-works-section">
          <div className="text-center">
            <span style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--accent-primary)' }}>
              SIMPLE & FAST
            </span>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)', marginTop: '0.25rem', fontWeight: 600, color: '#1c1917' }}>
              How it works
            </h2>
          </div>

          <div className="how-it-works-grid">
            <div className="how-card">
              <div className="how-step-num">1</div>
              <h3 className="how-title">Pick an Experience</h3>
              <p className="how-desc">Select from Proposals, Puzzles, Birthday Bashes, Sorry Cards, or Mother&apos;s Day tributes.</p>
            </div>
            <div className="how-card">
              <div className="how-step-num">2</div>
              <h3 className="how-title">Add Your Personal Touch</h3>
              <p className="how-desc">Upload special photos, craft heartfelt letters, add secret notes, or pick promises.</p>
            </div>
            <div className="how-card">
              <div className="how-step-num">3</div>
              <h3 className="how-title">Send with Love</h3>
              <p className="how-desc">Share a private link directly via WhatsApp or SMS. Watch their reaction live!</p>
            </div>
          </div>
        </section>

        {/* Loved by Users Banner */}
        <section className="social-proof-banner">
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🥰 ❤️ 🥳</div>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 600, color: '#1c1917', marginBottom: '0.5rem' }}>
            Created with Love. Loved by You. ❤️
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '500px', margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
            Join thousands of people turning ordinary messages into unforgettable digital memories.
          </p>
          <Link href="/templates" className="btn-primary">
            ✨ Craft Your Surprise Note
          </Link>
        </section>
      </div>
    </main>
  );
}
