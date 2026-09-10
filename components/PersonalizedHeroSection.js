'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { HeroPills } from '@/components/ShuffledTemplates';
import LiveActivityTicker from '@/components/LiveActivityTicker';
import PreviewDemoButton from '@/components/PreviewDemoButton';
import { getUserContext, getFallbackPersonalization } from '@/lib/personalization';

const ALL_BESTSELLERS = [
  {
    id: 'birthday',
    title: 'Virtual Birthday Bash',
    icon: '🎂🎈',
    badge: '🔥 #1 BESTSELLER',
    tagline: 'Interactive Cake & Party',
    desc: 'Blow out real candles, slice the cake, trigger confetti bursts, and play their favorite song.',
    rating: '4.9 ★ (Top Favorite)',
    gradient: 'linear-gradient(135deg, #fff1f2, #ffe4e6)',
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
    gradient: 'linear-gradient(135deg, #fdf2f8, #fce7f3)',
    borderColor: '#fbcfe8',
  },
  {
    id: 'surprise-reveal-box',
    title: 'Surprise Reveal Box',
    icon: '🎁✨',
    badge: '✨ VIRAL UNBOXING',
    tagline: '3D Tap-to-Unbox',
    desc: 'They tap to untie the ribbon, open the secret 3D gift box, and uncover heartfelt memories.',
    rating: '4.9 ★ (Viral Hit)',
    gradient: 'linear-gradient(135deg, #faf5ff, #f3e8ff)',
    borderColor: '#e9d5ff',
  },
  {
    id: 'things-i-never-said',
    title: 'Things I Never Said',
    icon: '💌🕊️',
    badge: '❤️ DEEP EMOTION',
    tagline: 'Heartfelt Wax-Sealed Letter',
    desc: 'For the words left unsaid. A vintage sealed envelope with background music & voice note.',
    rating: '4.9 ★ (Deep Emotional)',
    gradient: 'linear-gradient(135deg, #ecfdf5, #d1fae5)',
    borderColor: '#a7f3d0',
  },
];

export default function PersonalizedHeroSection() {
  const [personalization, setPersonalization] = useState(() => getFallbackPersonalization());

  useEffect(() => {
    const userContext = getUserContext();

    fetch('/api/ai/personalize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userContext }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.heroTitle) {
          setPersonalization(data);
        }
      })
      .catch((err) => {
        console.warn('AI Personalization fetch failed, using fallbacks:', err);
      });
  }, []);

  const featuredIds = personalization.featuredIds || ['birthday', 'proposal', 'surprise-reveal-box', 'things-i-never-said'];
  const spotlightItems = featuredIds
    .map((id) => ALL_BESTSELLERS.find((b) => b.id === id))
    .filter(Boolean);

  const displaySpotlights = spotlightItems.length ? spotlightItems : ALL_BESTSELLERS;

  return (
    <>
      {/* Top Hero Area with Activity Ticker */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.25rem' }}>
        <div style={{ textAlign: 'center' }}>
          <LiveActivityTicker />
        </div>

        {/* Hero Section */}
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
            }}
          >
            {personalization.heroTitle}
          </h1>

          <p
            className="hero-copy text-muted"
            style={{
              maxWidth: '640px',
              margin: '0 auto 1rem',
              fontSize: 'clamp(0.92rem, 2.2vw, 1.05rem)',
              lineHeight: 1.55,
            }}
          >
            {personalization.heroSubtitle}
          </p>

          {/* Quick Pill Navigation */}
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
              {personalization.ctaText || '✨ Craft a Surprise Now'}
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
        </section>
      </div>

      {/* Spotlight Best Sellers Section */}
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
          {displaySpotlights.map((item) => (
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
                    style={{ padding: '0.65rem', fontSize: '0.85rem', fontWeight: 800, textAlign: 'center', background: 'linear-gradient(135deg, #f43f5e, #be185d)' }}
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
    </>
  );
}
