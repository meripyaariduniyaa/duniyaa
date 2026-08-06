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
      {/* Background decorations */}
      <div className="bg-glow bg-glow--top" aria-hidden="true" />
      <div className="bg-glow bg-glow--bottom" aria-hidden="true" />

      <div className="main-content">
        {/* Hero Section */}
        <section className="hero-section text-center mt-8 mb-8">
          <div className="hero-sale-banner">🎉 Launch celebration: 50% OFF everything — premium notes now ₹149</div>
          <h1>
            Some moments deserve <br/>
            <span className="text-gradient cursive">more than a text.</span>
          </h1>
          <p className="hero-copy text-muted">
            Create a beautiful, private space for the person you want to reach — photos, words, and memories.
            It disappears safely after 15 days, with secure sharing, animated templates, and easy mobile access.
          </p>

          <div className="hero-feature-list">
            <div className="hero-feature">
              <div className="hero-feature-icon">🔒</div>
              <div>
                <strong>Privacy first</strong>
                <p>Secure notes with no public indexing and one-time links for every message.</p>
              </div>
            </div>
            <div className="hero-feature">
              <div className="hero-feature-icon">⏳</div>
              <div>
                <strong>Auto-expire</strong>
                <p>Notes disappear after 15 days, so memories stay special and private.</p>
              </div>
            </div>
            <div className="hero-feature">
              <div className="hero-feature-icon">🎨</div>
              <div>
                <strong>Animated templates</strong>
                <p>Choose from beautiful, motion-ready cards designed to feel alive.</p>
              </div>
            </div>
            <div className="hero-feature">
              <div className="hero-feature-icon">📱</div>
              <div>
                <strong>Easy sharing</strong>
                <p>Send links instantly via WhatsApp, SMS, or email — no app needed.</p>
              </div>
            </div>
          </div>

          <div className="hero-actions">
            <Link href="/create" className="btn-primary">
              ✨ Create a Note
            </Link>
            <Link href="/profile" className="btn-secondary">
              View Profile
            </Link>
          </div>
        </section>

        {/* Templates Section */}
        <section className="templates-section" id="templates">
          <p className="templates-section-label">THE TEMPLATES</p>
          <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)' }}>A gift tuned for every kind of moment.</h2>
          <p className="templates-subtitle">
            Everything is now priced at ₹149, with a special launch offer of 50% off till 30 Sep 2026. Use coupon <strong>new2026</strong>.
          </p>

          <div className="templates-grid">
            {displayTemplates.map((t) => (
              <Link
                key={t.id}
                href={`/create?template=${t.id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className="template-card">
                  {t.recommended && (
                    <div className="template-badge">⭐ Recommended</div>
                  )}
                  {t.price && !t.recommended && (
                    <div className="template-badge template-badge--premium">
                      💎 Premium — ₹{t.price}
                    </div>
                  )}

                  <div className="template-icon">{t.icon}</div>
                  <h3>{t.title}</h3>
                  <p className="template-desc">{t.description}</p>

                  <div className="template-meta">
                    <div>
                      <span className="template-time">⏱ {t.time}</span>
                      <div className="template-tags">
                        {t.bestFor.map((tag) => (
                          <span key={tag} className="template-tag">{tag}</span>
                        ))}
                      </div>
                    </div>
                    <span className="template-cta">Make this gift →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
