'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import PayButton from '@/components/PayButton';
import Link from 'next/link';

export default function PreviewPage() {
  return (
    <Suspense
      fallback={
        <main className="center-screen">
          <div className="spinner" />
          <p className="text-muted">Preparing your private preview…</p>
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
  const [apology, setApology] = useState(null);
  const [paid, setPaid] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    return onSnapshot(doc(db, 'apologies', id), (snap) => {
      if (snap.exists()) {
        setApology({ id: snap.id, ...snap.data() });
        setPaid(snap.data().is_paid);
      }
      setLoading(false);
    });
  }, [id]);

  if (loading || !apology) {
    return (
      <main className="center-screen">
        <div className="spinner" />
        <p className="text-muted">Preparing your private preview…</p>
      </main>
    );
  }

  // Determine the share URL: use custom slug if available, fallback to ID
  const shareSlug = apology.custom_slug || apology.id;
  const getShareUrl = () => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/p/${shareSlug}`;
    }
    return `/p/${shareSlug}`;
  };

  return (
    <main className="shell">
      <div className="bg-glow bg-glow--top" aria-hidden="true" />
      <div className="bg-glow bg-glow--bottom" aria-hidden="true" />

      <div className="main-content" style={{ marginTop: '2rem' }}>
        <div className="grid-2">
          {/* Left Column: Preview */}
          <div>
            <div style={{ marginBottom: '2rem' }}>
              <p className="text-muted" style={{ fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>✦ YOUR PRIVATE PREVIEW</p>
              <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', marginTop: '0.5rem', marginBottom: '0.5rem' }}>It feels like you.</h1>
              <p className="text-muted" style={{ fontSize: '1rem' }}>
                Take a look, then unlock a shareable link when it feels right.
              </p>
            </div>
            
            <div className="glass-card" style={{ padding: '2rem', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'var(--gold-gradient)' }}></div>
              <p className="text-muted" style={{ fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>DEAR {apology.recipient_name}</p>
              
              <p style={{ fontSize: '1.05rem', whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
                {apology.custom_message}
              </p>
              
              {apology.image_urls?.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.75rem', marginTop: '2rem' }}>
                  {apology.image_urls.map((url) => (
                    <img key={url} src={url} alt="Memory" style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '12px', border: '3px solid #1a202c', boxShadow: '2px 2px 0px #1a202c' }} />
                  ))}
                </div>
              )}
              
              <p className="cursive" style={{ marginTop: '3rem', textAlign: 'left', fontSize: '2rem' }}>
                — from someone who cares
              </p>
            </div>
          </div>

          {/* Right Column: Payment & Link */}
          <div>
            <aside className="glass-card" style={{ position: 'sticky', top: '120px' }}>
              {paid ? (
                <div className="text-center">
                  <div style={{ width: '48px', height: '48px', background: '#22c55e', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', margin: '0 auto 1.5rem', border: '3px solid #1a202c', boxShadow: '2px 2px 0px #1a202c' }}>✓</div>
                  <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Your link is ready.</h2>
                  <p className="text-muted" style={{ marginBottom: '2rem' }}>
                    Send this private link to {apology.recipient_name}. It will expire safely in 15 days.
                  </p>
                  
                  <div style={{ background: '#f1f5f9', padding: '1rem', borderRadius: '12px', wordBreak: 'break-all', marginBottom: '1.5rem', border: '3px solid #1a202c', fontSize: '0.85rem', boxShadow: 'inset 2px 2px 0px rgba(0,0,0,0.05)' }}>
                    {getShareUrl()}
                  </div>
                  
                  <button
                    className="btn-primary w-full"
                    onClick={() => navigator.clipboard.writeText(getShareUrl())}
                  >
                    Copy secure link
                  </button>
                  <p className="text-muted" style={{ fontSize: '0.875rem', marginTop: '1.5rem' }}>
                    You can also view this later by going to your <Link href="/profile" style={{ textDecoration: 'underline' }}>Dashboard</Link>.
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-muted" style={{ fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>READY TO SEND?</p>
                  <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Give it a little courage.</h2>
                  <p className="text-muted" style={{ marginBottom: '2rem' }}>
                    Your page stays private until you unlock it. Once unlocked, you&apos;ll get a shareable link that expires safely in 15 days.
                  </p>
                  
                  <PayButton apologyId={apology.id} onPaid={() => setPaid(true)} />
                  
                  <div style={{ marginTop: '1.5rem', borderTop: '2px dashed #e2e8f0', paddingTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                    <span style={{ fontSize: '1.2rem' }}>🔒</span>
                    <span className="text-muted" style={{ fontSize: '0.875rem' }}>Secure payment via Razorpay</span>
                  </div>
                </>
              )}
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}
