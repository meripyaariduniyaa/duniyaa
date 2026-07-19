import { getAdminDb } from '@/lib/firebase-admin';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function SorryPage({ params }) {
  const { token } = await params;
  let apology = null;

  try {
    const snap = await getAdminDb().collection('apologies').doc(token).get();
    if (snap.exists) apology = snap.data();
  } catch {}

  const expires = apology?.expires_at?.toDate?.() || (apology?.expires_at ? new Date(apology.expires_at) : null);
  const valid = apology?.is_paid === true && expires && expires.getTime() > Date.now();

  if (!valid) {
    return (
      <main className="shell">
        <div className="bg-glow bg-glow--top" aria-hidden="true" />
        
        <div className="main-content center-screen">
          <div className="glass-card text-center" style={{ maxWidth: '500px', width: '100%' }}>
            <div className="logo" style={{ justifyContent: 'center', marginBottom: '2rem' }}>
              Note<span>Retro</span>
            </div>
            
            <p className="text-muted" style={{ fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '1rem' }}>
              THIS PAGE ISN’T AVAILABLE
            </p>
            <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>It may have expired.</h1>
            <p className="text-muted" style={{ fontSize: '1.125rem' }}>
              This private note is no longer available, or the link was not unlocked yet.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="shell">
      <div className="bg-glow bg-glow--top" aria-hidden="true" />
      <div className="bg-glow bg-glow--bottom" aria-hidden="true" />

      <div className="main-content center-screen" style={{ padding: '4rem 2rem' }}>
        <div className="glass-card" style={{ maxWidth: '700px', width: '100%', padding: '4rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'var(--accent-gradient)' }}></div>
          
          <div className="logo" style={{ justifyContent: 'center', marginBottom: '3rem', opacity: 0.5 }}>
            Note<span>Retro</span>
          </div>

          <p className="text-muted" style={{ fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '1.5rem', textAlign: 'center' }}>
            A NOTE FOR YOU
          </p>
          
          <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center' }}>Dear {apology.recipient_name},</h1>
          
          <p style={{ fontSize: '1.125rem', whiteSpace: 'pre-wrap', lineHeight: 1.8, marginBottom: '2rem' }}>
            {apology.custom_message}
          </p>
          
          {apology.image_urls?.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '2rem', marginBottom: '3rem' }}>
              {apology.image_urls.map((url) => (
                <img key={url} src={url} alt="A shared memory" style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '12px', border: '1px solid var(--border-glass-strong)' }} />
              ))}
            </div>
          )}
          
          <div className="cursive" style={{ marginTop: '3rem', textAlign: 'center', fontSize: '2.5rem' }}>
            With an open heart,<br />
            someone who cares
          </div>
          
          <div style={{ borderTop: '1px solid var(--border-glass)', marginTop: '4rem', paddingTop: '2rem', textAlign: 'center' }}>
            <p className="text-muted" style={{ fontSize: '0.875rem' }}>
              This little page is a moment in time. It disappears soon.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
