'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { HeroPills, BentoGrid } from '@/components/ShuffledTemplates';
import EmotionFinder from '@/components/EmotionFinder';
import LiveActivityTicker from '@/components/LiveActivityTicker';
import GoogleAd from '@/components/GoogleAd';
import PreviewDemoButton from '@/components/PreviewDemoButton';
import FeaturedCreatorsSection from '@/components/FeaturedCreatorsSection';
import { getUserContext, trackUserSignal } from '@/lib/personalization';

// ─── Static data ────────────────────────────────────────────────────────────

const ALL_BESTSELLERS = [
  {
    id: 'birthday',
    title: 'Virtual Birthday Bash',
    icon: '🎂🎈',
    badge: '🔥 #1 BESTSELLER',
    tagline: 'Interactive Cake & Party',
    desc: 'Blow out real candles, slice the cake, trigger confetti bursts, and play their favorite song.',
    rating: '4.9 ★ (Top Favorite)',
    borderColor: '#fecdd3',
  },
  {
    id: 'proposal',
    title: 'The Perfect Proposal',
    icon: '💍💖',
    badge: '👑 COUPLES CHOICE',
    tagline: 'Gamified Love Proposal',
    desc: 'An emotional journey with cute promises, photo slideshow, and the unforgettable question.',
    rating: '5.0 ★ (Couples Favorite)',
    borderColor: '#fbcfe8',
  },
  {
    id: 'i-miss-you',
    title: 'I Miss You',
    icon: '🫂',
    badge: '💙 LONG DISTANCE',
    tagline: 'Emotional Distance Bridge',
    desc: 'Send a heartfelt message to someone you miss dearly, no matter the distance.',
    rating: '4.8 ★ (Long Distance)',
    borderColor: '#bfdbfe',
  },
  {
    id: 'anniversary',
    title: 'Anniversary Special',
    icon: '🥂✨',
    badge: '💕 COUPLES CLASSIC',
    tagline: 'Photo Memory Journey',
    desc: 'Fill a virtual love meter, seal a pinky promise, blow out a celebration candle, and read promises.',
    rating: '4.9 ★ (Anniversary Hit)',
    borderColor: '#fed7aa',
  },
  {
    id: 'emotional-apology',
    title: "I'm Sorry",
    icon: '🥺',
    badge: '💔 HEARTFELT APOLOGY',
    tagline: 'Sincere Reconciliation',
    desc: 'A sincere apology that gives them room to feel. Gentle, heartfelt, and beautifully designed.',
    rating: '4.7 ★ (Reconciliation)',
    borderColor: '#e9d5ff',
  },
];

const DEFAULT_FEATURED_IDS = ['birthday', 'proposal', 'anniversary', 'i-miss-you'];

const DEFAULT_HERO = {
  title: 'Craft unforgettable',
  titleEm: 'interactive digital surprises.',
  subtitle:
    'Say goodbye to boring text messages & greeting cards. Turn special photos, heartfelt letters, and music into gamified digital moments they open right on their phone in seconds.',
  ctaText: '✨ Craft a Surprise Now',
};

const TESTIMONIALS = [
  {
    name: 'Rohan & Sanya',
    city: 'Mumbai',
    avatar: '👩‍❤️‍👨',
    template: 'The Perfect Proposal',
    quote:
      'She literally cried happy tears when the song started playing and the ring box opened! Sharing it over WhatsApp was so effortless.',
    rating: '★★★★★',
  },
  {
    name: 'Aditi Varma',
    city: 'Bengaluru',
    avatar: '🎉',
    template: 'Virtual Birthday Bash',
    quote:
      'My best friend lives in London and this made her feel right at home! She loved cutting the virtual cake and reading the photo notes.',
    rating: '★★★★★',
  },
  {
    name: 'Kabir & Tanya',
    city: 'Delhi',
    avatar: '💌',
    template: 'Things I Never Said',
    quote:
      'Worth every rupee. The music and wax seal feel so premium. Way more meaningful than any random printed card you buy in a shop.',
    rating: '★★★★★',
  },
];

const FAQS = [
  {
    q: 'How will my recipient open the surprise?',
    a: 'Once you customize your surprise, you receive a private 1-click link to share on WhatsApp, Instagram DM, or SMS. They just tap the link to experience it instantly—no app download required!',
  },
  {
    q: 'Can I add my own photos, voice notes, and music?',
    a: 'Yes! You can upload your favorite photos directly from your camera or gallery, record a personal 30-second voice note, craft heartfelt letters, and select curated background music soundtracks.',
  },
  {
    q: 'Is the surprise secure and private?',
    a: 'Absolutely. Only people with your private link can view it. You can even lock it with a custom secret passcode or anniversary date.',
  },
  {
    q: 'How long does it take to create?',
    a: 'Less than 2 to 3 minutes! Choose a template, add your text & photos, and generate your live link immediately.',
  },
];

// ─── Helper ────────────────────────────────────────────────────────────────
function resolveBestsellers(featuredIds) {
  const ordered = [];
  for (const id of featuredIds) {
    const found = ALL_BESTSELLERS.find((b) => b.id === id);
    if (found) ordered.push(found);
  }
  for (const b of ALL_BESTSELLERS) {
    if (ordered.length >= 4) break;
    if (!ordered.find((o) => o.id === b.id)) ordered.push(b);
  }
  return ordered.slice(0, 4);
}

// ─── Component ──────────────────────────────────────────────────────────────
export default function PersonalizedHome() {
  const [hero, setHero] = useState(DEFAULT_HERO);
  const [bestsellers, setBestsellers] = useState(resolveBestsellers(DEFAULT_FEATURED_IDS));
  const [isPersonalized, setIsPersonalized] = useState(false);

  useEffect(() => {
    const ctx = getUserContext();
    trackUserSignal('visitCount', (ctx.visitCount || 0) + 1);
    trackUserSignal('referrer', document.referrer || 'direct');

    const controller = new AbortController();

    (async () => {
      try {
        const res = await fetch('/api/ai/personalize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userContext: ctx }),
          signal: controller.signal,
        });
        if (!res.ok) return;
        const data = await res.json();

        if (data?.heroTitle) {
          // Split so the first word becomes the plain line and the rest become the cursive italic
          const words = data.heroTitle.split(' ');
          const splitAt = Math.ceil(words.length / 2);
          setHero({
            title: words.slice(0, splitAt).join(' '),
            titleEm: words.slice(splitAt).join(' ') || data.heroTitle,
            subtitle: data.heroSubtitle || DEFAULT_HERO.subtitle,
            ctaText: data.ctaText || DEFAULT_HERO.ctaText,
          });
        }

        if (Array.isArray(data?.featuredIds) && data.featuredIds.length > 0) {
          setBestsellers(resolveBestsellers(data.featuredIds));
        }

        setIsPersonalized(true);
      } catch {
        // silent fallback to defaults
      }
    })();

    return () => controller.abort();
  }, []);

  return (
    <main className="shell">
      <div
        className="main-content"
        style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(2rem, 4.5vw, 3.5rem)', padding: '0 0 2.5rem' }}
      >
        {/* ── Ticker + Hero ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.25rem' }}>
          <div style={{ textAlign: 'center' }}>
            <LiveActivityTicker />
          </div>

          <section
            className="hero-section text-center"
            style={{
              background: '#ffffff',
              borderRadius: 'clamp(20px, 4vw, 28px)',
              padding: 'clamp(1.25rem, 3vw, 2rem) clamp(1rem, 3vw, 1.75rem)',
              border: '1px solid rgba(0,0,0,0.06)',
              boxShadow: '0 16px 36px rgba(0,0,0,0.03)',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: '#fff1f2',
                border: '1px solid #fecdd3',
                padding: '0.28rem 0.8rem',
                borderRadius: '99px',
                fontSize: 'clamp(0.7rem, 1.6vw, 0.76rem)',
                color: '#be185d',
                fontWeight: 800,
                marginBottom: '0.65rem',
              }}
            >
              <span>⭐ HIGHLY RATED DIGITAL GIFTS</span>
              <span>•</span>
              <span>Instant 1-Click WhatsApp Surprises</span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(1.8rem, 5.5vw, 3.2rem)',
                lineHeight: 1.15,
                fontWeight: 800,
                color: '#1c1917',
                margin: '0 auto 0.75rem',
                letterSpacing: '-0.03em',
                transition: 'opacity 0.3s ease',
              }}
            >
              {hero.title}
              <br />
              <em className="cursive" style={{ fontSize: '1.05em', color: 'var(--accent-primary)' }}>
                {hero.titleEm}
              </em>
            </h1>

            <p
              className="hero-copy text-muted"
              style={{
                maxWidth: '640px',
                margin: '0 auto 1rem',
                fontSize: 'clamp(0.92rem, 2.2vw, 1.05rem)',
                lineHeight: 1.55,
                transition: 'opacity 0.3s ease',
              }}
            >
              {hero.subtitle}
            </p>

            <HeroPills />

            <div
              className="hero-actions"
              style={{ marginTop: '1.15rem', display: 'flex', justifyContent: 'center', gap: '0.85rem', flexWrap: 'wrap' }}
            >
              <Link
                href="/templates"
                className="btn-primary"
                style={{
                  padding: 'clamp(0.75rem, 2.2vw, 0.95rem) clamp(1.5rem, 3.5vw, 2.2rem)',
                  fontSize: 'clamp(0.92rem, 1.8vw, 1.02rem)',
                  fontWeight: 800,
                  boxShadow: '0 8px 24px rgba(244,63,94,0.3)',
                }}
              >
                {hero.ctaText}
              </Link>
              <a
                href="#bestsellers"
                className="btn-secondary"
                style={{
                  padding: 'clamp(0.75rem, 2.2vw, 0.95rem) clamp(1.2rem, 3vw, 1.6rem)',
                  fontSize: 'clamp(0.88rem, 1.8vw, 0.95rem)',
                  fontWeight: 700,
                }}
              >
                🔥 View Best Sellers ↓
              </a>
            </div>

            {isPersonalized && (
              <p style={{ marginTop: '0.75rem', fontSize: '0.7rem', color: '#be185d', opacity: 0.6, fontStyle: 'italic' }}>
                ✨ Personalized for you
              </p>
            )}
          </section>
        </div>

        {/* ── Spotlight Best Sellers ── */}
        <section id="bestsellers">
          <div className="text-center" style={{ marginBottom: '2rem' }}>
            <span
              style={{
                background: 'linear-gradient(135deg, #f43f5e, #be185d)',
                color: '#ffffff',
                fontSize: '0.75rem',
                fontWeight: 800,
                padding: '0.35rem 1rem',
                borderRadius: '999px',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                display: 'inline-block',
                boxShadow: '0 4px 14px rgba(244,63,94,0.2)',
              }}
            >
              🔥 {isPersonalized ? 'PICKED FOR YOU' : 'MOST POPULAR EXPERIENCES'}
            </span>
            <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', marginTop: '0.6rem', fontWeight: 800, color: '#1c1917' }}>
              Trending Surprises Senders Love
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '600px', margin: '0.35rem auto 0', lineHeight: 1.5 }}>
              Choose a viral gamified template, add your personal memories, and send in 2 minutes.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {bestsellers.map((item) => (
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
                  overflow: 'hidden',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        color: '#be185d',
                        background: '#fff1f2',
                        padding: '0.25rem 0.65rem',
                        borderRadius: '999px',
                        border: '1px solid #fecdd3',
                      }}
                    >
                      {item.badge}
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f59e0b' }}>{item.rating}</span>
                  </div>
                  <div style={{ fontSize: '2.8rem', marginBottom: '0.5rem' }}>{item.icon}</div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1f2937', margin: '0 0 0.25rem' }}>{item.title}</h3>
                  <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#be185d', margin: '0 0 0.5rem' }}>{item.tagline}</p>
                  <p style={{ fontSize: '0.9rem', color: '#6b7280', lineHeight: 1.5, margin: '0 0 1.25rem' }}>{item.desc}</p>
                </div>
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <PreviewDemoButton
                      templateId={item.id}
                      className="btn-secondary"
                      style={{ padding: '0.65rem', fontSize: '0.85rem', fontWeight: 700, textAlign: 'center', width: '100%' }}
                    >
                      👁️ Preview
                    </PreviewDemoButton>
                    <Link
                      href={`/create?template=${item.id}`}
                      className="btn-primary"
                      style={{
                        padding: '0.65rem',
                        fontSize: '0.85rem',
                        fontWeight: 800,
                        textAlign: 'center',
                        background: 'linear-gradient(135deg, #f43f5e, #be185d)',
                      }}
                    >
                      ✨ Create Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '1.75rem' }}>
            <Link href="/templates" className="btn-secondary" style={{ padding: '0.75rem 1.75rem', fontSize: '0.95rem', fontWeight: 700 }}>
              Browse All Interactive Templates →
            </Link>
          </div>
        </section>

        {/* ── Emotion Finder ── */}
        <div id="feelings">
          <EmotionFinder />
        </div>

        {/* ── Bento Grid Catalog ── */}
        <section className="bento-section" id="experiences">
          <div className="text-center" style={{ marginBottom: '2rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--accent-primary)' }}>
              COMPLETE CATALOG
            </span>
            <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', marginTop: '0.35rem', fontWeight: 800, color: '#1c1917' }}>
              Something for Every Moment
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.35rem' }}>
              Choose a gamified interactive template and personalize it in 2 minutes.
            </p>
          </div>
          <BentoGrid />
        </section>

        {/* ── Featured Creators ── */}
        <div id="creators">
          <FeaturedCreatorsSection />
        </div>

        {/* ── Why LovelyCrafts Comparison Table ── */}
        <section
          style={{
            background: 'linear-gradient(180deg, #ffffff 0%, #fffbfb 100%)',
            borderRadius: '32px',
            padding: 'clamp(2rem, 5vw, 3.5rem) clamp(1rem, 4vw, 2.5rem)',
            border: '1px solid #fecdd3',
            boxShadow: '0 12px 36px rgba(190, 24, 93, 0.05)',
          }}
        >
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
                  <th
                    style={{
                      padding: '0.85rem 1rem',
                      color: '#be185d',
                      fontSize: '0.95rem',
                      fontWeight: 800,
                      background: '#fff1f2',
                      borderRadius: '12px 12px 0 0',
                    }}
                  >
                    ❤️ LovelyCrafts
                  </th>
                </tr>
              </thead>
              <tbody style={{ fontSize: '0.88rem' }}>
                {[
                  ['Interactive Experience (Cake, Unboxing, Quiz)', '✕ No', '✕ No', '✓ Full 3D Interactive', '#ef4444', '#ef4444', '#16a34a'],
                  ['Background Music & Voice Notes', '✕ No', '✕ No', '✓ Custom Song Track', '#ef4444', '#ef4444', '#16a34a'],
                  ['Photo Gallery & Slideshow', 'Expensive print', 'Cluttered chat media', '✓ Beautiful Polaroid Gallery', '#9ca3af', '#9ca3af', '#16a34a'],
                  ['Delivery Time', '2–4 Days courier', 'Instant (boring)', '⚡ Instant (Under 2 mins)', '#6b7280', '#6b7280', '#16a34a'],
                  ['Forever Keepsake Link', 'Lost in drawer', 'Lost in chat history', '✓ Accessible Anytime', '#ef4444', '#ef4444', '#16a34a'],
                ].map(([feat, c1, c2, c3, col1, col2, col3], i, arr) => (
                  <tr key={feat} style={{ borderBottom: i < arr.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#1f2937' }}>{feat}</td>
                    <td style={{ padding: '0.85rem 1rem', color: col1 }}>{c1}</td>
                    <td style={{ padding: '0.85rem 1rem', color: col2 }}>{c2}</td>
                    <td style={{ padding: '0.85rem 1rem', color: col3, fontWeight: 800, background: '#fff1f2' }}>{c3}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── How It Works ── */}
        <section className="how-it-works-section">
          <div className="text-center" style={{ marginBottom: '2rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--accent-primary)' }}>
              SIMPLE 3-STEP PROCESS
            </span>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)', marginTop: '0.25rem', fontWeight: 800, color: '#1c1917' }}>
              How It Works
            </h2>
          </div>
          <div className="how-it-works-grid">
            <div className="how-card">
              <div className="how-step-num">1</div>
              <h3 className="how-title">Pick an Experience</h3>
              <p className="how-desc">Select from Proposals, Birthday Bashes, Sorry Cards, or Romantic Letters.</p>
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

        {/* ── Real Customer Stories ── */}
        <section>
          <div className="text-center" style={{ marginBottom: '2rem' }}>
            <span
              style={{
                background: '#fef3c7',
                color: '#d97706',
                fontSize: '0.75rem',
                fontWeight: 800,
                padding: '0.3rem 0.9rem',
                borderRadius: '999px',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                display: 'inline-block',
              }}
            >
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
                  justifyContent: 'space-between',
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
                    <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                      {t.city} • Used <em>{t.template}</em>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FAQs ── */}
        <section
          style={{
            background: '#ffffff',
            border: '1px solid rgba(0,0,0,0.06)',
            borderRadius: '28px',
            padding: 'clamp(2rem, 5vw, 3rem) clamp(1rem, 4vw, 2rem)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
          }}
        >
          <div className="text-center" style={{ marginBottom: '2rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#be185d' }}>
              GOT QUESTIONS?
            </span>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)', fontWeight: 800, color: '#1c1917', marginTop: '0.35rem' }}>
              Frequently Asked Questions
            </h2>
          </div>
          <div
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', maxWidth: '820px', margin: '0 auto' }}
          >
            {FAQS.map((faq, idx) => (
              <div key={idx} style={{ background: '#fafaf9', padding: '1.25rem', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1f2937', margin: '0 0 0.5rem' }}>❓ {faq.q}</h4>
                <p style={{ fontSize: '0.86rem', color: '#6b7280', margin: 0, lineHeight: 1.5 }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Ad Unit ── */}
        <GoogleAd slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_ID} className="home-ad-banner" />

        {/* ── Bottom CTA ── */}
        <section
          style={{
            background: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 50%, #fdf2f8 100%)',
            border: '2px solid #f43f5e',
            borderRadius: '32px',
            padding: 'clamp(2rem, 5vw, 3.5rem) clamp(1rem, 4vw, 2rem)',
            textAlign: 'center',
            boxShadow: '0 16px 40px rgba(244,63,94,0.15)',
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>💝 ✨ 🚀</div>
          <h2 style={{ fontSize: 'clamp(1.75rem, 4.5vw, 2.75rem)', fontWeight: 900, color: '#881337', marginBottom: '0.5rem' }}>
            Ready to Make Someone Cry Happy Tears?
          </h2>
          <p style={{ color: '#9f1239', fontSize: '1.05rem', maxWidth: '580px', margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
            Create a private, interactive digital experience that will touch their heart and stay forever.
          </p>
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
                display: 'inline-block',
              }}
            >
              ✨ Choose an Experience &amp; Start →
            </Link>
          </div>
          <div
            style={{ display: 'flex', justifyContent: 'center', gap: '1.25rem', marginTop: '1.25rem', fontSize: '0.8rem', color: '#9f1239', fontWeight: 600, flexWrap: 'wrap' }}
          >
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
