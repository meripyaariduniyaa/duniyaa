import { getAdminDb } from '@/lib/firebase-admin';
import Link from 'next/link';
import TemplateRenderer from '@/components/templates/TemplateRenderer';

export const dynamic = 'force-dynamic';

export default async function SorryPage({ params }) {
  const { token } = await params;
  let apology = null;

  try {
    const snap = await getAdminDb().collection('notes').doc(token).get();
    if (snap.exists) apology = snap.data();
  } catch {}

  const expires = apology?.expires_at?.toDate?.() || (apology?.expires_at ? new Date(apology.expires_at) : null);
  const valid = apology?.is_paid === true && expires && expires.getTime() > Date.now();

  if (!valid || !apology) {
    return (
      <main className="shell center-screen" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="glass-card text-center" style={{ maxWidth: '500px', width: '100%', margin: '2rem auto' }}>
          <p className="text-muted" style={{ fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '1rem' }}>
            THIS PAGE ISN’T AVAILABLE
          </p>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>It may have expired.</h1>
          <p className="text-muted" style={{ fontSize: '1rem' }}>
            This private note is no longer available, or the link was not unlocked yet.
          </p>
          <Link href="/" className="btn-secondary" style={{ marginTop: '2rem', display: 'inline-flex' }}>
            Go Home
          </Link>
        </div>
      </main>
    );
  }

  // Create a clean, plain serializable JavaScript object for the Client Component
  const serializableNote = {
    id: token,
    recipient_name: apology.recipient_name || '',
    custom_message: apology.custom_message || '',
    image_urls: Array.isArray(apology.image_urls) ? apology.image_urls : [],
    shagun_qr_url: apology.shagun_qr_url || null,
    custom_details: apology.custom_details || null,
    template: apology.template || 'default',
    custom_slug: apology.custom_slug || null,
    is_paid: apology.is_paid || false,
  };

  return (
    <main className="shell" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '750px', width: '100%' }}>
        <TemplateRenderer note={serializableNote} isPreview={false} />
      </div>
    </main>
  );
}
