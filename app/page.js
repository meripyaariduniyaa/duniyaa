'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import Link from 'next/link';
import { templates } from '@/lib/templates';

const shuffleArray = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();
  const [displayTemplates, setDisplayTemplates] = useState(templates);

  useEffect(() => {
    setDisplayTemplates(shuffleArray(templates));
  }, []);

  return (
    <main className="shell">
      <div className="main-content">
        {/* Hero Section */}
        <section className="hero-section text-center mt-4 mb-8" style={{ background: '#ffffff', borderRadius: '32px', padding: '3.5rem 1.5rem 3rem', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 20px 40px rgba(0,0,0,0.03)' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--accent-primary)', background: '#fafaf9', padding: '0.35rem 1rem', borderRadius: '99px', border: '1px solid rgba(0,0,0,0.06)', display: 'inline-block', marginBottom: '1.25rem' }}>
            Personalized Digital Gifts for People You Love
          </span>

          <h1 style={{ fontSize: 'clamp(2.2rem, 5.5vw, 3.75rem)', lineHeight: 1.15, fontWeight: 600, color: '#1c1917', marginBottom: '1.25rem', letterSpacing: '-0.03em' }}>
            Craft unforgettable<br />
            <em className="cursive" style={{ fontSize: '1em', color: 'var(--accent-primary)' }}>interactive surprises.</em>
          </h1>

          <p className="hero-copy text-muted" style={{ maxWidth: '640px', margin: '0 auto 1.75rem', fontSize: '1.05rem', lineHeight: 1.65 }}>
            Go beyond standard greeting cards. Turn special moments, photos, and heartfelt messages into gamified digital experiences they open right on their phone.
          </p>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#fafaf9', border: '1px solid rgba(0,0,0,0.08)', padding: '0.4rem 1.1rem', borderRadius: '99px', fontSize: '0.85rem', color: '#1c1917', fontWeight: 600, marginBottom: '1.75rem' }}>
            <span>🎉 Special Offer:</span>
            <del style={{ color: 'var(--text-muted)', fontWeight: 400 }}>₹499</del>
            <span style={{ color: '#16a34a' }}>₹149 (70% OFF)</span>
          </div>

          {/* Quick Pill Navigation */}
          <div className="hero-pills">
            {displayTemplates.slice(0, 7).map((t) => (
              <Link key={t.id} href={`/create?template=${t.id}`} className="hero-pill-item">
                <span>{t.icon}</span>
                <span>{t.title}</span>
              </Link>
            ))}
          </div>

          <div className="hero-actions" style={{ marginTop: '1rem' }}>
            <Link href="/templates" className="btn-primary" style={{ padding: '0.95rem 2.25rem', fontSize: '1rem' }}>
              ✨ Craft a Surprise Now
            </Link>
            <a href="#experiences" className="btn-secondary" style={{ padding: '0.95rem 1.75rem', fontSize: '0.95rem' }}>
              Explore Experiences ↓
            </a>
          </div>
        </section>

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

          <div className="bento-grid">
            {displayTemplates.map((t) => (
              <Link key={t.id} href={`/create?template=${t.id}`} className="bento-card">
                <div>
                  <div className="bento-card-header">
                    <span className="bento-emoji">{t.icon}</span>
                    <h3 className="bento-card-title">{t.title}</h3>
                  </div>
                  <p className="bento-card-desc">{t.description}</p>
                </div>

                <div className="bento-card-footer">
                  <div className="bento-price-tag">
                    <del>₹499</del>
                    <span>₹149</span>
                  </div>
                  <span className="bento-cta">
                    Create Now →
                  </span>
                </div>
              </Link>
            ))}
          </div>
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
