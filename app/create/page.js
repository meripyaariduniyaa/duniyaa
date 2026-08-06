'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { doc, serverTimestamp, setDoc, getDoc } from 'firebase/firestore';
import { nanoid } from 'nanoid';
import { db } from '@/lib/firebase';
import { templates } from '@/lib/templates';
import CloudinaryUpload from '@/components/CloudinaryUpload';
import TemplateRenderer from '@/components/templates/TemplateRenderer';

export default function CreateNote() {
  return (
    <Suspense
      fallback={
        <main className="center-screen">
          <div className="spinner" />
          <p className="text-muted">Loading creator suite...</p>
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

  const [selectedTemplateId, setSelectedTemplateId] = useState(templateIdParam || 'sorry');
  const [showMobilePreview, setShowMobilePreview] = useState(false);

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

  // Sample Preset Messages for quick autofill
  const sampleMessages = {
    'sorry': "I know I messed up and said things out of anger. I am truly sorry from the bottom of my heart. You mean everything to me, and I promise to do so much better for us. Please forgive me? 💕",
    'birthday-surprise': "Wishing you a year filled with endless laughter, boundless happiness, unforgettable adventures, and all your heart's desires. Happy Birthday! 🎉🎂",
    'love-letter': "I cherish every single moment with you. You bring warmth, beauty, and joy to my world. Thank you for being you and filling my life with endless happiness. Yours always ❤️",
    'letter-for-mom': "Thank you for every meal, every warm hug, every sacrifice, and endless support. You are the strongest, sweetest person in my life. Thank you for everything, Ma! 💐",
    'be-my-valentine': "You bring magic, smiles, and joy into my life every single day. I want to celebrate love with you today and always. Will you be my Valentine? 💕🌹",
    'wedding-invitation': "We cordially request the honor of your presence to celebrate love, laughter, and togetherness as we begin our sacred new journey together. 💒🪔",
    'surprise-reveal-box': "Behind every bow and ribbon lies a heart overflowing with love for you. Unbox each layer to discover your special surprise! 🎁✨",
    'a-rose-for-someone-special': "Like a rose that blooms under the moonlight, my feelings for you grow deeper with every passing moment. Dedicated to you with all my affection. 🌹✨"
  };

  const handleAutofillSample = () => {
    const sample = sampleMessages[selectedTemplateId] || sampleMessages['sorry'];
    setMessage(sample);
    if (!recipientName) {
      setRecipientName('Special Someone');
    }
  };

  const getDeviceId = () => {
    let deviceId = localStorage.getItem('note_device_id');
    if (!deviceId) {
      deviceId = nanoid(32);
      localStorage.setItem('note_device_id', deviceId);
    }
    return deviceId;
  };

  const sanitizeSlug = (val) => {
    return val
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 60);
  };

  const checkSlugAvailability = useCallback(async (slug) => {
    if (!slug || slug.length < 3) {
      setSlugStatus('');
      return;
    }
    setSlugStatus('checking');
    try {
      const snap = await getDoc(doc(db, 'notes', slug));
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

      let docId;
      if (customSlug && customSlug.length >= 3) {
        const snap = await getDoc(doc(db, 'notes', customSlug));
        if (snap.exists()) {
          throw new Error('That custom link is already taken. Please choose another.');
        }
        docId = customSlug;
      } else {
        docId = nanoid(32);
      }

      const deviceId = getDeviceId();

      await setDoc(doc(db, 'notes', docId), {
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

      const createdIds = JSON.parse(localStorage.getItem('created_note_ids') || '[]');
      createdIds.push(docId);
      localStorage.setItem('created_note_ids', JSON.stringify(createdIds));

      router.push(`/preview?id=${docId}`);
    } catch (e) {
      setError(e.message || 'Something went wrong.');
      setBusy(false);
    }
  }

  // Draft note object for real-time live preview
  const draftNote = {
    recipient_name: recipientName.trim() || 'Maya',
    custom_message: message.trim() || sampleMessages[selectedTemplateId] || 'Your message will appear here in real-time...',
    image_urls: images,
    template: selectedTemplateId,
  };

  return (
    <main className="shell" style={{ padding: '2rem 1rem' }}>
      <div className="bg-glow bg-glow--top" aria-hidden="true" />
      <div className="bg-glow bg-glow--bottom" aria-hidden="true" />

      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        {/* Header */}
        <div className="text-center mb-8">
          <span style={{ background: '#fbcfe8', color: '#be185d', padding: '0.4rem 1.2rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            ✨ INTERACTIVE GREETING CREATOR
          </span>
          <h1 style={{ fontSize: 'clamp(1.75rem, 5vw, 2.75rem)', marginTop: '0.75rem', marginBottom: '0.5rem' }}>
            Craft a Cinematic Surprise
          </h1>
          <p className="text-muted" style={{ fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>
            Pick an emotion-driven format, write your heartfelt words, and preview the live animation experience in real-time.
          </p>
        </div>

        {/* 1. VISUAL TEMPLATE SELECTOR CAROUSEL / GRID */}
        <div style={{ marginBottom: '2.5rem' }}>
          <p style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#be185d', marginBottom: '1rem' }}>
            1. Select Greeting Template Format ({templates.length} Available):
          </p>
          <div className="template-selector-grid">
            {templates.map((t) => {
              const isSelected = selectedTemplateId === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTemplateId(t.id)}
                  className={`template-select-card ${isSelected ? 'selected' : ''}`}
                >
                  <div style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>{t.icon}</div>
                  <h3 style={{ fontSize: '1rem', color: '#3b0f1b', marginBottom: '0.35rem' }}>{t.title}</h3>
                  <p style={{ fontSize: '0.75rem', color: '#8e3249', lineHeight: 1.4, flex: 1, marginBottom: '0.75rem' }}>
                    {t.description}
                  </p>
                  <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                    {t.bestFor?.map((tag, idx) => (
                      <span key={idx} className="tag-chip">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. SPLIT SCREEN: FORM LEFT, LIVE INTERACTIVE PREVIEW RIGHT */}
        <div className="create-split-grid">
          {/* Left Column: Input Form */}
          <div className="glass-card" style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '2px dashed rgba(216, 30, 91, 0.2)', paddingBottom: '0.75rem' }}>
              <h2 style={{ fontSize: '1.25rem', color: '#3b0f1b', margin: 0 }}>
                2. Personalize Your Message
              </h2>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#d81e5b' }}>
                {selectedTemplate?.icon} {selectedTemplate?.title}
              </span>
            </div>

            <form onSubmit={submit}>
              {/* Their Name */}
              <div className="form-group">
                <label className="form-label">Their Name / Nickname</label>
                <input
                  className="form-input"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="e.g. Maya, Cutiepie, Mom, Rahul"
                  maxLength={80}
                  required
                />
              </div>

              {/* Message with Autofill Helper */}
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label className="form-label" style={{ margin: 0 }}>What do you want to say?</label>
                  <button
                    type="button"
                    onClick={handleAutofillSample}
                    style={{
                      background: '#fbcfe8',
                      color: '#be185d',
                      border: '1px solid #f472b6',
                      borderRadius: '999px',
                      padding: '0.25rem 0.75rem',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    ✨ Autofill Idea
                  </button>
                </div>
                <textarea
                  className="form-textarea"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your heartfelt message here..."
                  rows={6}
                  maxLength={1200}
                  required
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#8e3249', marginTop: '0.35rem' }}>
                  <span>Tip: Keep it genuine and personal.</span>
                  <span>{message.length} / 1200</span>
                </div>
              </div>

              {/* Photos */}
              <div className="form-group">
                <label className="form-label">Add Cherished Memory Photos (Optional)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                  <CloudinaryUpload onUpload={(url) => setImages((current) => [...current, url])} />
                  <span className="text-muted" style={{ fontSize: '0.85rem' }}>
                    {images.length ? `${images.length} photo(s) added` : 'Up to 6 photos'}
                  </span>
                </div>

                {images.length > 0 && (
                  <div className="thumbs" style={{ marginTop: '0.75rem' }}>
                    {images.map((url, idx) => (
                      <div key={url} style={{ position: 'relative' }}>
                        <img src={url} alt={`Uploaded ${idx + 1}`} />
                        <button
                          type="button"
                          onClick={() => setImages(images.filter((_, i) => i !== idx))}
                          style={{
                            position: 'absolute',
                            top: '-6px',
                            right: '-6px',
                            background: '#e11d48',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '50%',
                            width: '20px',
                            height: '20px',
                            fontSize: '0.7rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Custom Link */}
              <div className="form-group">
                <label className="form-label">Custom Share Link (Optional)</label>
                <div className="slug-input-wrapper">
                  <span className="slug-prefix">lovelycrafts.in/p/</span>
                  <input
                    className="slug-input"
                    value={customSlug}
                    onChange={(e) => setCustomSlug(sanitizeSlug(e.target.value))}
                    placeholder="e.g. maya-surprise"
                    maxLength={60}
                  />
                </div>
                {slugStatus === 'checking' && (
                  <p className="slug-status slug-status--checking">Checking link availability…</p>
                )}
                {slugStatus === 'available' && (
                  <p className="slug-status slug-status--available">✓ Link is available!</p>
                )}
                {slugStatus === 'taken' && (
                  <p className="slug-status slug-status--taken">✗ Link is already taken, try another.</p>
                )}
                <p className="text-muted" style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
                  Custom links cost ₹29 extra, charged only if entered.
                </p>
              </div>

              {error && <p style={{ color: '#e11d48', marginTop: '1rem', fontSize: '0.875rem', fontWeight: 700 }}>{error}</p>}

              <button className="btn-primary w-full mt-4" disabled={busy || slugStatus === 'taken'}>
                {busy ? 'Saving your note…' : 'Continue to preview & share link →'}
              </button>
            </form>
          </div>

          {/* Right Column: Live Interactive Preview */}
          <div className="live-preview-column">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <p style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#be185d', margin: 0 }}>
                👁️ Live Interactive Preview:
              </p>
              <span style={{ fontSize: '0.75rem', background: '#d81e5b', color: '#fff', padding: '0.2rem 0.6rem', borderRadius: '999px', fontWeight: 700 }}>
                Real-Time Render
              </span>
            </div>

            <div className="live-preview-wrapper-box">
              <TemplateRenderer note={draftNote} isPreview={true} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
