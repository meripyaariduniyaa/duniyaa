import { getAdminDb } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';
export default async function SorryPage({ params }) {
  const { token } = await params; let apology = null;
  try { const snap = await getAdminDb().collection('apologies').doc(token).get(); if (snap.exists) apology = snap.data(); } catch {}
  const expires = apology?.expires_at?.toDate?.() || (apology?.expires_at ? new Date(apology.expires_at) : null); const valid = apology?.is_paid === true && expires && expires.getTime() > Date.now();
  if (!valid) return <main className="recipient-shell denied"><div className="recipient-paper"><span className="logo">sorry, sincerely<span className="dot">.</span></span><p className="eyebrow">THIS PAGE ISN’T AVAILABLE</p><h1>It may have expired.</h1><p>This private apology is no longer available, or the link was not unlocked yet.</p></div></main>;
  return <main className="recipient-shell"><div className="recipient-paper"><span className="logo">sorry, sincerely<span className="dot">.</span></span><p className="card-kicker">A LETTER FOR YOU</p><h1>Dear {apology.recipient_name},</h1><p className="recipient-message">{apology.custom_message}</p>{apology.image_urls?.length > 0 && <div className="recipient-images">{apology.image_urls.map((url) => <img key={url} src={url} alt="A shared memory" />)}</div>}<div className="recipient-signoff">With an open heart,<br /><em>someone who means it</em></div><p className="expiry-note">This little page disappears soon.</p></div></main>;
}
