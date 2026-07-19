import { getAdminDb } from '@/lib/firebase-admin';

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
      <main className="recipient-shell denied">
        <div className="bg-dots" style={{ position: 'absolute', inset: 0, opacity: 0.4, pointerEvents: 'none' }} aria-hidden="true" />
        <div className="recipient-paper">
          <span className="logo" style={{ justifyContent: 'center' }}>
            <span className="logo__icon">📝</span>
            Note<span className="logo__accent">Retro</span>
          </span>
          <p className="card-kicker" style={{ textAlign: 'center', marginTop: '30px' }}>THIS PAGE ISN’T AVAILABLE</p>
          <h1 style={{ textAlign: 'center' }}>It may have expired.</h1>
          <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '18px' }}>
            This private note is no longer available, or the link was not unlocked yet.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="recipient-shell">
      <div className="bg-dots" style={{ position: 'absolute', inset: 0, opacity: 0.4, pointerEvents: 'none' }} aria-hidden="true" />
      <div className="recipient-sparkles" aria-hidden="true">
        <span style={{ left: '15%', animationDelay: '0s', fontSize: '16px' }}>✦</span>
        <span style={{ left: '35%', animationDelay: '1.5s', fontSize: '24px' }}>♥</span>
        <span style={{ left: '55%', animationDelay: '3s', fontSize: '18px' }}>✦</span>
        <span style={{ left: '75%', animationDelay: '4.5s', fontSize: '20px' }}>♥</span>
        <span style={{ left: '90%', animationDelay: '6s', fontSize: '14px' }}>✦</span>
      </div>

      <div className="recipient-paper">
        <span className="logo">
          <span className="logo__icon" style={{ width: '32px', height: '32px', fontSize: '16px', borderRadius: '10px' }}>📝</span>
          Note<span className="logo__accent">Retro</span>
        </span>
        
        <p className="card-kicker">A NOTE FOR YOU</p>
        <h1>Dear {apology.recipient_name},</h1>
        
        <p className="recipient-message">{apology.custom_message}</p>
        
        {apology.image_urls?.length > 0 && (
          <div className="recipient-images">
            {apology.image_urls.map((url) => (
              <img key={url} src={url} alt="A shared memory" />
            ))}
          </div>
        )}
        
        <div className="recipient-signoff">
          With an open heart,<br />
          <em>someone who cares</em>
        </div>
        
        <p className="expiry-note">
          This little page is a moment in time. It disappears soon.
        </p>
      </div>
    </main>
  );
}
