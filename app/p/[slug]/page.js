import { getAdminDb } from '@/lib/firebase-admin';
import Link from 'next/link';
import TemplateRenderer from '@/components/templates/TemplateRenderer';

export const dynamic = 'force-dynamic';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lovelycrafts.in';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const canonicalUrl = `${siteUrl}/p/${slug}`;
  let apology = null;

  try {
    const snap = await getAdminDb().collection('notes').doc(slug).get();
    if (snap.exists) apology = snap.data();
  } catch {}

  const expires = apology?.expires_at?.toDate?.() || (apology?.expires_at ? new Date(apology.expires_at) : null);
  const valid = apology?.is_paid === true && expires && expires.getTime() > Date.now();

  if (!valid || !apology) {
    return {
      title: 'Private note unavailable | Lovely Crafts',
      description: 'This note link has expired, is not yet unlocked, or is no longer available.',
      alternates: { canonical: canonicalUrl },
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const recipientName = apology.recipient_name || 'someone special';

  return {
    title: `A heartfelt note for ${recipientName} | Lovely Crafts`,
    description: `A private, beautiful note for ${recipientName}. Unlock the message and share it securely.`,
    alternates: { canonical: canonicalUrl },
    robots: {
      index: false,
      follow: false,
    },
    openGraph: {
      title: `A heartfelt note for ${recipientName}`,
      description: `A private, beautiful note for ${recipientName}.`,
      url: canonicalUrl,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `A heartfelt note for ${recipientName}`,
      description: `A private, beautiful note for ${recipientName}.`,
    },
  };
}

export default async function CustomLinkPage({ params }) {
  const { slug } = await params;
  let apology = null;

  try {
    const snap = await getAdminDb().collection('notes').doc(slug).get();
    if (snap.exists) apology = snap.data();
  } catch {}

  const expires = apology?.expires_at?.toDate?.() || (apology?.expires_at ? new Date(apology.expires_at) : null);
  const valid = apology?.is_paid === true && expires && expires.getTime() > Date.now();

  if (!valid || !apology) {
    return (
      <main className="shell center-screen" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="glass-card text-center" style={{ maxWidth: '500px', width: '100%', margin: '2rem auto' }}>
          <p className="text-muted" style={{ fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '1rem' }}>
            THIS PAGE ISN&apos;T AVAILABLE
          </p>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>It may have expired.</h1>
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
    id: slug,
    recipient_name: apology.recipient_name || '',
    custom_message: apology.custom_message || '',
    image_urls: Array.isArray(apology.image_urls) ? apology.image_urls : [],
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
