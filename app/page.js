'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { nanoid } from 'nanoid';
import { db } from '@/lib/firebase';
import { useAuth } from '@/components/AuthProvider';
import CloudinaryUpload from '@/components/CloudinaryUpload';

export default function Home() {
  const router = useRouter();
  const { user, login } = useAuth();
  const [recipientName, setRecipientName] = useState('');
  const [message, setMessage] = useState('');
  const [images, setImages] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      if (!recipientName.trim() || !message.trim()) throw new Error('Please add their name and your message.');
      let currentUser = user;
      if (!currentUser) { const result = await login(); currentUser = result.user; }
      const id = nanoid(32);
      await setDoc(doc(db, 'apologies', id), {
        creator_uid: currentUser.uid,
        recipient_name: recipientName.trim(),
        custom_message: message.trim(),
        image_urls: images,
        is_paid: false,
        created_at: serverTimestamp(),
        expires_at: null,
      });
      router.push(`/preview?id=${id}`);
    } catch (e) {
      setError(e.message || 'Something went wrong.');
      setBusy(false);
    }
  }

  return (
    <main className="shell">
      {/* Background decorations */}
      <div className="bg-dots" style={{ position: 'absolute', inset: 0, opacity: 0.4, pointerEvents: 'none' }} aria-hidden="true" />
      <div className="bg-blob bg-blob--pink" aria-hidden="true" />
      <div className="bg-blob bg-blob--amber" aria-hidden="true" />
      <div className="bg-blob bg-blob--purple" aria-hidden="true" />

      {/* Topbar */}
      <nav className="topbar">
        <div className="topbar-inner">
          <span className="logo">
            <span className="logo__icon">📝</span>
            Note<span className="logo__accent">Retro</span>
          </span>
          <div className="nav-links">
            <span className="nav-link" style={{ color: 'var(--muted)', fontSize: '13px' }}>
              A little space to say it right.
            </span>
          </div>
        </div>
      </nav>

      <div className="shell__content">
        {/* ── Hero Section ── */}
        <section className="hero">
          <div className="hero__copy">
            <p className="hero__eyebrow">✦ THE THINGS WE MEAN TO SAY</p>
            <h1 className="hero__title">
              Some apologies<br />
              <em>deserve more than a text.</em>
            </h1>
            <p className="hero__subtitle">
              Make a small, beautiful page for the person you want to reach — photos, words, and memories.
              It disappears after 15 days.{' '}
              <strong>Sign in with Google to create · opens on any phone.</strong>
            </p>
            <div className="trust-chips">
              <span className="trust-chip">
                <svg className="trust-chip__icon" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/></svg>
                Private by design
              </span>
              <span className="trust-chip">
                <svg className="trust-chip__icon" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                Expires in 15 days
              </span>
              <span className="trust-chip">
                <svg className="trust-chip__icon" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/></svg>
                Opens on any phone
              </span>
            </div>
            <div className="hero__cta-row">
              <a href="#write" className="btn-primary">
                ✨ Write your letter
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </a>
            </div>
          </div>

          {/* Phone Mockup */}
          <div className="phone-mockup">
            {/* Floating badges */}
            <div className="floating-badge" style={{ position: 'absolute', top: '12%', left: '-20px', animationDuration: '7s', zIndex: 20 }}>
              <span className="floating-badge__icon" style={{ background: 'var(--secondary)' }}>🔒</span>
              100% Private
            </div>
            <div className="floating-badge" style={{ position: 'absolute', top: '12%', right: '-20px', animationDuration: '8s', animationDelay: '1.5s', zIndex: 20 }}>
              <span className="floating-badge__icon" style={{ background: '#16a34a' }}>✓</span>
              Expires safely
            </div>
            <div className="floating-badge" style={{ position: 'absolute', bottom: '15%', left: '-10px', animationDuration: '9s', animationDelay: '3s', zIndex: 20 }}>
              <span className="floating-badge__icon" style={{ background: 'var(--primary)' }}>📱</span>
              No app needed
            </div>

            <div className="phone-frame">
              <div className="phone-notch" />
              <div className="phone-sparkles" aria-hidden="true">
                <span style={{ left: '10%', animationDelay: '0s', fontSize: '12px' }}>✦</span>
                <span style={{ left: '30%', animationDelay: '1s', fontSize: '16px' }}>♥</span>
                <span style={{ left: '50%', animationDelay: '2s', fontSize: '20px' }}>✦</span>
                <span style={{ left: '70%', animationDelay: '2.8s', fontSize: '12px' }}>♥</span>
                <span style={{ left: '85%', animationDelay: '3.5s', fontSize: '16px' }}>✦</span>
              </div>
              <div className="phone-screen">
                <div className="phone-screen__icon">💌</div>
                <h2 className="phone-screen__title">A Note is Waiting for You</h2>
                <p className="phone-screen__sub">From someone who cares · Words & memories inside</p>
                <div className="phone-screen__btn">
                  Tap to Open ✨
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── How it Works ── */}
        <section className="steps-section">
          <p className="section-eyebrow">How it works</p>
          <h2 className="section-title">Three steps. About two minutes.</h2>
          <p className="section-subtitle">Write it, preview it, share the link. That's all there is to it.</p>
          <div className="steps-grid">
            <div className="cartoon-card step-card">
              <div className="step-card__icon">✍️</div>
              <h3 className="step-card__title">1. Write your letter</h3>
              <p className="step-card__desc">Add their name, write what you need to say, attach photos of your memories together.</p>
            </div>
            <div className="cartoon-card step-card">
              <div className="step-card__icon">👀</div>
              <h3 className="step-card__title">2. Preview it</h3>
              <p className="step-card__desc">See exactly what they'll see. Make sure it feels right before you send it out.</p>
            </div>
            <div className="cartoon-card step-card">
              <div className="step-card__icon">🔗</div>
              <h3 className="step-card__title">3. Share the link</h3>
              <p className="step-card__desc">Get a private link. Send it on WhatsApp, SMS, email — they tap, it opens.</p>
            </div>
          </div>
        </section>

        {/* ── Letter Form ── */}
        <section className="letter-section" id="write">
          <p className="section-eyebrow" style={{ textAlign: 'center' }}>Start writing</p>
          <h2 className="section-title" style={{ textAlign: 'center', maxWidth: '500px', margin: '0 auto 32px' }}>
            A letter for someone special.
          </h2>
          <form className="cartoon-card letter-form" onSubmit={submit}>
            <div className="letter-form__tape" />
            <p className="letter-form__kicker">YOUR PRIVATE LETTER</p>

            <label className="form-label">
              Their name
              <input
                className="form-input"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="e.g. Maya"
                maxLength={80}
              />
            </label>

            <label className="form-label">
              What do you want to say?
              <textarea
                className="form-textarea"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Start with the honest part…"
                rows={6}
                maxLength={1200}
              />
            </label>

            <div className="upload-row">
              <CloudinaryUpload onUpload={(url) => setImages((current) => [...current, url])} />
              <span>
                {images.length
                  ? `${images.length} photo${images.length > 1 ? 's' : ''} added`
                  : 'Optional · up to 6 photos'}
              </span>
            </div>

            {images.length > 0 && (
              <div className="thumbs">
                {images.map((url) => (
                  <img key={url} src={url} alt="Uploaded memory" />
                ))}
              </div>
            )}

            {error && <p className="error-text">{error}</p>}

            <button className="btn-primary full" disabled={busy} style={{ marginTop: '24px' }}>
              {busy ? 'Saving your letter…' : 'Continue to preview  →'}
            </button>

            <p className="fine-print">
              You'll sign in with Google before saving. Payment is only needed when you're ready to share.
            </p>
          </form>
        </section>
      </div>
    </main>
  );
}
