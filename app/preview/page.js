'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/components/AuthProvider';
import PayButton from '@/components/PayButton';

export default function PreviewPage() {
  return (
    <Suspense
      fallback={
        <main className="center-screen">
          <div className="spinner" />
          <p>Preparing your private preview…</p>
        </main>
      }
    >
      <PreviewContent />
    </Suspense>
  );
}

function PreviewContent() {
  const params = useSearchParams();
  const id = params.get('id');
  const router = useRouter();
  const { user, loading } = useAuth();
  const [apology, setApology] = useState(null);
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    if (!id || !user) return;

    return onSnapshot(doc(db, 'apologies', id), (snap) => {
      if (snap.exists()) {
        setApology({ id: snap.id, ...snap.data() });
        setPaid(snap.data().is_paid);
      }
    });
  }, [id, user]);

  if (loading || !apology) {
    return (
      <main className="center-screen">
        <div className="spinner" />
        <p>Preparing your private preview…</p>
      </main>
    );
  }

  return (
    <main className="preview-shell shell">
      <div className="bg-dots" style={{ position: 'absolute', inset: 0, opacity: 0.4, pointerEvents: 'none' }} aria-hidden="true" />
      <div className="bg-blob bg-blob--pink" aria-hidden="true" style={{ top: '-10%', right: '10%', left: 'auto' }} />
      <div className="bg-blob bg-blob--amber" aria-hidden="true" style={{ bottom: '-10%', left: '-5%', top: 'auto' }} />

      <nav className="topbar">
        <div className="topbar-inner">
          <span className="logo">
            <span className="logo__icon">📝</span>
            Note<span className="logo__accent">Retro</span>
          </span>
          <div className="nav-links">
            <button className="nav-link" onClick={() => router.push('/')}>
              Start over
            </button>
          </div>
        </div>
      </nav>

      <div className="shell__content preview-layout">
        <div>
          <div className="preview-header">
            <p className="hero__eyebrow">✦ YOUR PRIVATE PREVIEW</p>
            <h1 className="hero__title">It feels like you.</h1>
            <p className="hero__subtitle">
              Take a look, then unlock a shareable link when it feels right.
            </p>
          </div>
          
          <div className="cartoon-card preview-card">
            <p className="preview-card__kicker">DEAR {apology.recipient_name?.toUpperCase()}</p>
            <p className="preview-message">{apology.custom_message}</p>
            {apology.image_urls?.length > 0 && (
              <div className="preview-images">
                {apology.image_urls.map((url) => (
                  <img key={url} src={url} alt="Memory" />
                ))}
              </div>
            )}
            <p className="preview-signature">— from someone who cares</p>
          </div>
        </div>

        <aside className="cartoon-card pay-card">
          {paid ? (
            <>
              <div className="success-icon">✓</div>
              <h2 className="pay-card__title">Your link is ready.</h2>
              <p className="pay-card__desc">
                Send this private link to {apology.recipient_name}. It will be available for 15 days.
              </p>
              <div className="link-box">
                {typeof window !== 'undefined'
                  ? `${window.location.origin}/sorry/${apology.id}`
                  : `/sorry/${apology.id}`}
              </div>
              <button
                className="btn-primary full"
                onClick={() => navigator.clipboard.writeText(`${window.location.origin}/sorry/${apology.id}`)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                Copy link
              </button>
            </>
          ) : (
            <>
              <p className="pay-card__kicker">READY TO SEND?</p>
              <h2 className="pay-card__title">Give it a little courage.</h2>
              <p className="pay-card__desc">
                Your page stays private until you pay. Once unlocked, you’ll get a link that expires safely in 15 days.
              </p>
              <PayButton apologyId={apology.id} onPaid={() => setPaid(true)} />
              <p className="fine-print" style={{ marginTop: '20px' }}>
                Secure payment via Razorpay · one-time payment
              </p>
            </>
          )}
        </aside>
      </div>
    </main>
  );
}
