'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { nanoid } from 'nanoid';
import { db } from '@/lib/firebase';
import CloudinaryUpload from '@/components/CloudinaryUpload';
import Link from 'next/link';

export default function CreateNote() {
  const router = useRouter();
  const [recipientName, setRecipientName] = useState('');
  const [message, setMessage] = useState('');
  const [images, setImages] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  // Get or generate a device ID for anonymous creation
  const getDeviceId = () => {
    let deviceId = localStorage.getItem('note_device_id');
    if (!deviceId) {
      deviceId = nanoid(32);
      localStorage.setItem('note_device_id', deviceId);
    }
    return deviceId;
  };

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    
    try {
      if (!recipientName.trim() || !message.trim()) {
        throw new Error('Please add their name and your message.');
      }
      
      const deviceId = getDeviceId();
      const id = nanoid(32);
      
      await setDoc(doc(db, 'apologies', id), {
        creator_uid: deviceId, // Anonymous tracking
        recipient_name: recipientName.trim(),
        custom_message: message.trim(),
        image_urls: images,
        is_paid: false,
        created_at: serverTimestamp(),
        expires_at: null,
      });
      
      // Store created ID locally for quick access
      const createdIds = JSON.parse(localStorage.getItem('created_note_ids') || '[]');
      createdIds.push(id);
      localStorage.setItem('created_note_ids', JSON.stringify(createdIds));
      
      router.push(`/preview?id=${id}`);
    } catch (e) {
      setError(e.message || 'Something went wrong.');
      setBusy(false);
    }
  }

  return (
    <main className="shell">
      <div className="bg-glow bg-glow--top" aria-hidden="true" />
      
      <nav className="topbar">
        <Link href="/" className="logo" style={{ textDecoration: 'none' }}>
          Note<span>Retro</span>
        </Link>
        <div className="nav-links">
          <Link href="/" className="nav-link">Cancel</Link>
        </div>
      </nav>

      <div className="main-content center-screen">
        <div className="glass-card" style={{ maxWidth: '600px', width: '100%' }}>
          <div className="text-center mb-8">
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Start writing</h1>
            <p className="text-muted">A note for someone special.</p>
          </div>

          <form onSubmit={submit}>
            <div className="form-group">
              <label className="form-label">Their Name</label>
              <input
                className="form-input"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="e.g. Maya"
                maxLength={80}
              />
            </div>

            <div className="form-group">
              <label className="form-label">What do you want to say?</label>
              <textarea
                className="form-textarea"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Start with the honest part…"
                rows={6}
                maxLength={1200}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Add Memories (Optional)</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                <CloudinaryUpload onUpload={(url) => setImages((current) => [...current, url])} />
                <span className="text-muted" style={{ fontSize: '0.875rem' }}>
                  {images.length ? `${images.length} photo(s) added` : 'Up to 6 photos'}
                </span>
              </div>
              
              {images.length > 0 && (
                <div className="thumbs">
                  {images.map((url) => (
                    <img key={url} src={url} alt="Uploaded memory" />
                  ))}
                </div>
              )}
            </div>

            {error && <p style={{ color: 'red', marginTop: '1rem', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</p>}

            <button className="btn-primary w-full mt-4" disabled={busy}>
              {busy ? 'Saving your note…' : 'Continue to preview →'}
            </button>
            <p className="text-center text-muted" style={{ fontSize: '0.875rem', marginTop: '1.5rem' }}>
              No sign-in required to create.
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
