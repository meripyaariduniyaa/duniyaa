'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { nanoid } from 'nanoid';
import { db } from '@/lib/firebase';
import { useAuth } from '@/components/AuthProvider';
import CloudinaryUpload from '@/components/CloudinaryUpload';

export default function Home() {
  const router = useRouter(); const { user, login } = useAuth();
  const [recipientName, setRecipientName] = useState(''); const [message, setMessage] = useState(''); const [images, setImages] = useState([]); const [busy, setBusy] = useState(false); const [error, setError] = useState('');
  async function submit(event) {
    event.preventDefault(); setBusy(true); setError('');
    try {
      if (!recipientName.trim() || !message.trim()) throw new Error('Please add their name and your message.');
      let currentUser = user; if (!currentUser) { const result = await login(); currentUser = result.user; }
      const id = nanoid(32); await setDoc(doc(db, 'apologies', id), { creator_uid: currentUser.uid, recipient_name: recipientName.trim(), custom_message: message.trim(), image_urls: images, is_paid: false, created_at: serverTimestamp(), expires_at: null });
      router.push(`/preview?id=${id}`);
    } catch (e) { setError(e.message || 'Something went wrong.'); setBusy(false); }
  }
  return <main className="landing-shell"><nav className="topbar"><span className="logo">sorry, sincerely<span className="dot">.</span></span><span className="nav-note">A little space to say it right.</span></nav><section className="hero-grid"><div className="hero-copy"><p className="eyebrow">THE THINGS WE MEAN TO SAY</p><h1>Some apologies<br /><em>deserve more than a text.</em></h1><p className="hero-subtitle">Make a small, beautiful page for the person you want to reach. It disappears after 15 days — just enough time to be seen, and not kept forever.</p><div className="trust-row"><span>✦ Private by design</span><span>◷ Expires in 15 days</span></div></div><form className="letter-card" onSubmit={submit}><div className="card-tape" /><p className="card-kicker">A LETTER FOR SOMEONE SPECIAL</p><label>Their name<input value={recipientName} onChange={(e) => setRecipientName(e.target.value)} placeholder="e.g. Maya" maxLength={80} /></label><label>What do you want to say?<textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Start with the honest part…" rows={6} maxLength={1200} /></label><div className="upload-row"><CloudinaryUpload onUpload={(url) => setImages((current) => [...current, url])}/><span>{images.length ? `${images.length} photo${images.length > 1 ? 's' : ''} added` : 'Optional · up to 6 photos'}</span></div>{images.length > 0 && <div className="thumbs">{images.map((url) => <img key={url} src={url} alt="Uploaded memory" />)}</div>}{error && <p className="error-text">{error}</p>}<button className="primary-button full" disabled={busy}>{busy ? 'Saving your letter…' : 'Continue to preview  →'}</button><p className="fine-print">You’ll sign in with Google before saving. Payment is only needed when you’re ready to share.</p></form></section></main>;
}
