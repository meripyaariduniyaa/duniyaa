'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { doc, serverTimestamp, setDoc, getDoc } from 'firebase/firestore';
import { nanoid } from 'nanoid';
import { db } from '@/lib/firebase';
import { templates } from '@/lib/templates';
import CloudinaryUpload from '@/components/CloudinaryUpload';

export default function CreateNote() {
  return (
    <Suspense
      fallback={
        <main className="center-screen">
          <div className="spinner" />
          <p className="text-muted">Loading...</p>
        </main>
      }
    >
      <CreateNoteContent />
    </Suspense>
  );
}

function CreateNoteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateIdParam = searchParams.get('template');
  
  const [selectedTemplateId, setSelectedTemplateId] = useState(templateIdParam || 'memoryverse');

  useEffect(() => {
    if (templateIdParam) {
      setSelectedTemplateId(templateIdParam);
    }
  }, [templateIdParam]);

  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId) || templates[0];

  const [recipientName, setRecipientName] = useState('');
  const [message, setMessage] = useState('');
  const [images, setImages] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  // Custom slug state
  const [customSlug, setCustomSlug] = useState('');
  const [slugStatus, setSlugStatus] = useState(''); // '', 'checking', 'available', 'taken'

  // Get or generate a device ID for anonymous creation
  const getDeviceId = () => {
    let deviceId = localStorage.getItem('note_device_id');
    if (!deviceId) {
      deviceId = nanoid(32);
      localStorage.setItem('note_device_id', deviceId);
    }
    return deviceId;
  };

  // Sanitize slug: only lowercase letters, numbers, hyphens
  const sanitizeSlug = (val) => {
    return val
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 60);
  };

  // Debounced slug availability check
  const checkSlugAvailability = useCallback(async (slug) => {
    if (!slug || slug.length < 3) {
      setSlugStatus('');
      return;
    }
    setSlugStatus('checking');
    try {
      const snap = await getDoc(doc(db, 'apologies', slug));
      setSlugStatus(snap.exists() ? 'taken' : 'available');
    } catch {
      setSlugStatus('');
    }
  }, []);

  useEffect(() => {
    if (!customSlug || customSlug.length < 3) {
      setSlugStatus('');
      return;
    }
    const timeout = setTimeout(() => checkSlugAvailability(customSlug), 500);
    return () => clearTimeout(timeout);
  }, [customSlug, checkSlugAvailability]);

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    
    try {
      if (!recipientName.trim() || !message.trim()) {
        throw new Error('Please add their name and your message.');
      }

      // Determine document ID
      let docId;
      if (customSlug && customSlug.length >= 3) {
        // Check availability one final time
        const snap = await getDoc(doc(db, 'apologies', customSlug));
        if (snap.exists()) {
          throw new Error('That custom link is already taken. Please choose another.');
        }
        docId = customSlug;
      } else {
        docId = nanoid(32);
      }
      
      const deviceId = getDeviceId();
      
      await setDoc(doc(db, 'apologies', docId), {
        creator_uid: deviceId,
        recipient_name: recipientName.trim(),
        custom_message: message.trim(),
        image_urls: images,
        is_paid: false,
        template: selectedTemplateId || 'default',
        custom_slug: customSlug || null,
        created_at: serverTimestamp(),
        expires_at: null,
      });
      
      // Store created ID locally for quick access
      const createdIds = JSON.parse(localStorage.getItem('created_note_ids') || '[]');
      createdIds.push(docId);
      localStorage.setItem('created_note_ids', JSON.stringify(createdIds));
      
      router.push(`/preview?id=${docId}`);
    } catch (e) {
      setError(e.message || 'Something went wrong.');
      setBusy(false);
    }
  }

  return (
    <main className="shell">
      <div className="bg-glow bg-glow--top" aria-hidden="true" />

      <div className="main-content center-screen">
        <div className="glass-card" style={{ maxWidth: '600px', width: '100%' }}>
          <div className="text-center mb-8">
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{selectedTemplate?.icon || '✨'}</div>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{selectedTemplate?.title || 'Start writing'}</h1>
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>{selectedTemplate?.description}</p>
          </div>

          <form onSubmit={submit}>
            {/* Format Selection Dropdown */}
            <div className="form-group">
              <label className="form-label">Template Format</label>
              <select
                className="form-input"
                value={selectedTemplateId}
                onChange={(e) => setSelectedTemplateId(e.target.value)}
                style={{ cursor: 'pointer', appearance: 'auto' }}
              >
                {templates.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.icon} {t.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Custom Link */}
            <div className="form-group">
              <label className="form-label">Custom Link (Optional)</label>
              <div className="slug-input-wrapper">
                <span className="slug-prefix">noteretro.com/p/</span>
                <input
                  className="slug-input"
                  value={customSlug}
                  onChange={(e) => setCustomSlug(sanitizeSlug(e.target.value))}
                  placeholder="maya-birthday"
                  maxLength={60}
                />
              </div>
              {slugStatus === 'checking' && (
                <p className="slug-status slug-status--checking">Checking availability…</p>
              )}
              {slugStatus === 'available' && (
                <p className="slug-status slug-status--available">✓ This link is available!</p>
              )}
              {slugStatus === 'taken' && (
                <p className="slug-status slug-status--taken">✗ Already taken, try another.</p>
              )}
              {!slugStatus && customSlug.length > 0 && customSlug.length < 3 && (
                <p className="slug-status slug-status--checking">Min 3 characters</p>
              )}
            </div>

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

            <button className="btn-primary w-full mt-4" disabled={busy || slugStatus === 'taken'}>
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
