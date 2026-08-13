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
  const [shagunQrUrl, setShagunQrUrl] = useState('');
  const [customDetails, setCustomDetails] = useState({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  // Helper to update a single field in customDetails
  const updateDetail = (key, value) => {
    setCustomDetails((prev) => ({ ...prev, [key]: value }));
  };

  // Custom slug state
  const [customSlug, setCustomSlug] = useState('');
  const [slugStatus, setSlugStatus] = useState(''); // '', 'checking', 'available', 'taken'

  // Sample Preset Messages for quick autofill
  const sampleMessages = {
    'sorry': "I know I messed up and said things out of anger. I am truly sorry from the bottom of my heart. You mean everything to me, and I promise to do so much better for us. Please forgive me? 💕",
    'birthday': "Wishing you a year filled with endless laughter, boundless happiness, unforgettable adventures, and all your heart's desires. Happy Birthday! 🎉🎂",
    'anniversary': "I cherish every single moment with you. You bring warmth, beauty, and joy to my world. Thank you for being you and filling my life with endless happiness. Yours always ❤️",
    'mothers-day': "Thank you for every meal, every warm hug, every sacrifice, and endless support. You are the strongest, sweetest person in my life. Thank you for everything, Ma! 💐",
    'proposal': "You bring magic, smiles, and joy into my life every single day. I want to celebrate love with you today and always. Will you be my forever? 💕🌹",
    'wedding-invitation': "We cordially request the honor of your presence to celebrate love, laughter, and togetherness as we begin our sacred new journey together. 💒🪔",
    'surprise-reveal-box': "Behind every bow and ribbon lies a heart overflowing with love for you. Unbox each layer to discover your special surprise! 🎁✨",
    'a-rose-for-someone-special': "Like a rose that blooms under the moonlight, my feelings for you grow deeper with every passing moment. Dedicated to you with all my affection. 🌹✨",
    'rakshabandhan': "This rakhi ties more than just a thread — it binds my heart to yours, forever and always. I may not say it often, but I am endlessly proud of you and grateful to have you as my sibling. Happy Raksha Bandhan! 🪢💫"
  };

  // AI Magic Assistant State
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiTone, setAiTone] = useState('romantic');
  const [aiKeywords, setAiKeywords] = useState('');
  const [aiBusy, setAiBusy] = useState(false);
  const [aiOptions, setAiOptions] = useState([]);
  const [aiError, setAiError] = useState('');

  const generateAiMessages = async () => {
    setAiBusy(true);
    setAiError('');
    try {
      const res = await fetch('/api/ai-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: selectedTemplateId,
          recipientName: recipientName.trim(),
          tone: aiTone,
          keywords: aiKeywords.trim(),
          mode: 'generate',
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate AI options.');
      setAiOptions(data.options || []);
    } catch (e) {
      setAiError(e.message || 'Could not connect to AI service.');
    } finally {
      setAiBusy(false);
    }
  };

  const polishMessageWithAi = async () => {
    if (!message.trim()) return;
    setAiBusy(true);
    setAiError('');
    try {
      const res = await fetch('/api/ai-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: selectedTemplateId,
          recipientName: recipientName.trim(),
          tone: aiTone,
          keywords: aiKeywords.trim(),
          mode: 'enhance',
          currentMessage: message.trim()
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to polish message.');
      if (data.options && data.options[0]) {
        setMessage(data.options[0]);
      }
    } catch (e) {
      setAiError(e.message || 'Could not enhance message.');
    } finally {
      setAiBusy(false);
    }
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
        shagun_qr_url: shagunQrUrl.trim() || null,
        custom_details: Object.keys(customDetails).length > 0 ? customDetails : null,
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



        {/* 2. FORM ONLY (Preview removed per user request) */}
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {/* Input Form */}
          <div className="glass-card" style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '2px dashed rgba(216, 30, 91, 0.2)', paddingBottom: '0.75rem' }}>
              <h2 style={{ fontSize: '1.25rem', color: '#3b0f1b', margin: 0 }}>
                Personalize Your Message
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

              {/* Message with AI Assistant & Helper Actions */}
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <label className="form-label" style={{ margin: 0 }}>What do you want to say?</label>
                  <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => setShowAiModal((prev) => !prev)}
                      style={{
                        background: 'linear-gradient(135deg, #ec4899, #be185d)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '999px',
                        padding: '0.25rem 0.75rem',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(190, 24, 93, 0.25)'
                      }}
                    >
                      🤖 AI Writer {showAiModal ? '▲' : '▼'}
                    </button>

                    {message.trim() && (
                      <button
                        type="button"
                        onClick={polishMessageWithAi}
                        disabled={aiBusy}
                        style={{
                          background: '#fce7f3',
                          color: '#be185d',
                          border: '1px solid #f472b6',
                          borderRadius: '999px',
                          padding: '0.25rem 0.75rem',
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          cursor: 'pointer'
                        }}
                      >
                        🪄 Polish AI
                      </button>
                    )}

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
                      ✨ Sample
                    </button>
                  </div>
                </div>

                {/* AI MAGIC ASSISTANT CARD PANEL */}
                {showAiModal && (
                  <div
                    style={{
                      background: 'linear-gradient(135deg, #fff5f8, #fef2f2)',
                      border: '2px solid #f472b6',
                      borderRadius: '14px',
                      padding: '1rem',
                      marginBottom: '1rem',
                      boxShadow: '0 4px 16px rgba(216, 30, 91, 0.1)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#881337', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        ✨ AI Magic Message Generator
                      </span>
                      <span style={{ fontSize: '0.7rem', background: '#ffe4e6', color: '#be185d', padding: '0.15rem 0.5rem', borderRadius: '999px', fontWeight: 700 }}>
                        HuggingFace AI Powered
                      </span>
                    </div>

                    {/* Tone Selection */}
                    <div style={{ marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9f1239', display: 'block', marginBottom: '0.35rem' }}>
                        1. Pick Emotional Tone:
                      </span>
                      <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                        {[
                          { id: 'romantic', label: '💖 Romantic & Sweet' },
                          { id: 'funny', label: '😂 Funny & Playful' },
                          { id: 'sincere', label: '🥺 Deep & Sincere' },
                          { id: 'poetic', label: '🌹 Poetic & Soft' }
                        ].map((t) => (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => setAiTone(t.id)}
                            style={{
                              background: aiTone === t.id ? '#be185d' : '#fff',
                              color: aiTone === t.id ? '#fff' : '#881337',
                              border: '1px solid #f472b6',
                              borderRadius: '999px',
                              padding: '0.25rem 0.65rem',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            {t.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Keywords / Memories */}
                    <div style={{ marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9f1239', display: 'block', marginBottom: '0.35rem' }}>
                        2. Key Memories / Details (Optional):
                      </span>
                      <input
                        className="form-input"
                        value={aiKeywords}
                        onChange={(e) => setAiKeywords(e.target.value)}
                        placeholder="e.g. 2nd anniversary, late night pizza, stolen hoodies, coffee date"
                        style={{ fontSize: '0.8rem', padding: '0.45rem 0.75rem' }}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={generateAiMessages}
                      disabled={aiBusy}
                      style={{
                        width: '100%',
                        background: 'linear-gradient(135deg, #d81e5b, #be185d)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '0.5rem',
                        fontSize: '0.85rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        marginBottom: '0.75rem'
                      }}
                    >
                      {aiBusy ? '🤖 AI is writing message options…' : '✨ Generate 3 AI Messages'}
                    </button>

                    {aiError && <p style={{ color: '#e11d48', fontSize: '0.75rem', fontWeight: 700, margin: '0.35rem 0' }}>{aiError}</p>}

                    {/* AI Generated Options Cards */}
                    {aiOptions.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.75rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#be185d' }}>
                          Select an option to use:
                        </span>
                        {aiOptions.map((optText, idx) => (
                          <div
                            key={idx}
                            style={{
                              background: '#fff',
                              border: '1px solid #fbcfe8',
                              borderRadius: '10px',
                              padding: '0.75rem',
                              fontSize: '0.8rem',
                              color: '#3b0f1b',
                              lineHeight: 1.5,
                              boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                            }}
                          >
                            <p style={{ margin: 0, marginBottom: '0.5rem' }}>{optText}</p>
                            <button
                              type="button"
                              onClick={() => {
                                setMessage(optText);
                                setShowAiModal(false);
                              }}
                              style={{
                                background: '#fbcfe8',
                                color: '#be185d',
                                border: 'none',
                                borderRadius: '999px',
                                padding: '0.2rem 0.65rem',
                                fontSize: '0.7rem',
                                fontWeight: 800,
                                cursor: 'pointer'
                              }}
                            >
                              ✨ Use This Message
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <textarea
                  className="form-textarea"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your heartfelt message here or click AI Writer..."
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="form-label" style={{ margin: 0 }}>Add Cherished Memory Photos</label>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: images.length >= (selectedTemplate?.photoRequirement?.recommended || 3) ? '#15803d' : '#be185d',
                      background: images.length >= (selectedTemplate?.photoRequirement?.recommended || 3) ? '#dcfce7' : '#ffe4e6',
                      padding: '0.2rem 0.65rem',
                      borderRadius: '999px'
                    }}
                  >
                    📸 {images.length} / {selectedTemplate?.photoRequirement?.recommended || 3} recommended photos
                  </span>
                </div>
                <p className="text-muted" style={{ fontSize: '0.8rem', marginTop: '0.25rem', marginBottom: '0.5rem' }}>
                  {selectedTemplate?.photoRequirement?.tip || 'Upload photos to display in the animated cards and photo memory reel.'}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <CloudinaryUpload onUpload={(url) => setImages((current) => [...current, url])} />
                  <span className="text-muted" style={{ fontSize: '0.85rem' }}>
                    {images.length ? `${images.length} photo(s) added` : `Up to ${selectedTemplate?.photoRequirement?.max || 6} photos max`}
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

              {/* ── TEMPLATE-SPECIFIC EXTRA FIELDS ── */}

              {/* ───────────────────────────────────────────
                  SORRY / APOLOGY — 3 Promises
              ─────────────────────────────────────────── */}
              {(selectedTemplateId === 'sorry' || selectedTemplateId === 'apology') && (
                <div className="form-group" style={{ background: 'linear-gradient(135deg,#fff5f8,#fef2f2)', border: '2px dashed #f472b6', borderRadius: '16px', padding: '1.25rem' }}>
                  <label className="form-label" style={{ color: '#881337' }}>🤞 Your 3 Promises for the Future</label>
                  <p className="text-muted" style={{ fontSize: '0.8rem', marginBottom: '0.75rem' }}>These appear as interactive flip-reveal cards in the animation.</p>
                  {[1, 2, 3].map((i) => (
                    <input
                      key={i}
                      className="form-input"
                      value={customDetails[`promise_${i}`] || ''}
                      onChange={(e) => updateDetail(`promise_${i}`, e.target.value)}
                      placeholder={i === 1 ? 'e.g. I promise to listen more carefully' : i === 2 ? 'e.g. I will always be honest with you' : 'e.g. I will never take you for granted'}
                      maxLength={200}
                      style={{ marginBottom: '0.5rem' }}
                    />
                  ))}
                </div>
              )}

              {/* ───────────────────────────────────────────
                  BIRTHDAY — Sender name + balloon words + bouquet messages
              ─────────────────────────────────────────── */}
              {(selectedTemplateId === 'birthday' || selectedTemplateId === 'birthday-surprise') && (
                <div className="form-group" style={{ background: 'linear-gradient(135deg,#fff5fb,#fce7f3)', border: '2px dashed #ec4899', borderRadius: '16px', padding: '1.25rem' }}>
                  <label className="form-label" style={{ color: '#881337' }}>🎂 Birthday Experience Details</label>

                  <label className="form-label" style={{ fontSize: '0.82rem', marginTop: '0.75rem' }}>✍️ Your Name (Sender) — Appears on the letter sign-off</label>
                  <input
                    className="form-input"
                    value={customDetails.sender_name || ''}
                    onChange={(e) => updateDetail('sender_name', e.target.value)}
                    placeholder="e.g. Rohan, Your Secret Admirer"
                    maxLength={80}
                  />

                  <label className="form-label" style={{ fontSize: '0.82rem', marginTop: '0.75rem' }}>🎈 4 Balloon Words — Revealed one by one as they pop each balloon</label>
                  <p className="text-muted" style={{ fontSize: '0.75rem', marginBottom: '0.4rem' }}>Default: You · are · so · special!</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    {[1, 2, 3, 4].map(i => (
                      <input
                        key={i}
                        className="form-input"
                        value={customDetails[`balloon_word_${i}`] || ''}
                        onChange={(e) => updateDetail(`balloon_word_${i}`, e.target.value)}
                        placeholder={`Word ${i} e.g. ${['You', 'are', 'so', 'special!'][i - 1]}`}
                        maxLength={30}
                      />
                    ))}
                  </div>

                  <label className="form-label" style={{ fontSize: '0.82rem', marginTop: '0.75rem' }}>💐 6 Bouquet Messages — Float around the rose bouquet</label>
                  <p className="text-muted" style={{ fontSize: '0.75rem', marginBottom: '0.4rem' }}>Short sweet notes — keep them under 25 characters each.</p>
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <input
                      key={i}
                      className="form-input"
                      value={customDetails[`bouquet_msg_${i}`] || ''}
                      onChange={(e) => updateDetail(`bouquet_msg_${i}`, e.target.value)}
                      placeholder={['Forever yours 💕', 'My sunshine ☀️', 'Lucky to have you', 'Happy Birthday 🌸', 'My fav person', 'Sending all love ❤️'][i - 1]}
                      maxLength={40}
                      style={{ marginBottom: '0.4rem' }}
                    />
                  ))}

                  <label className="form-label" style={{ fontSize: '0.82rem', marginTop: '0.75rem' }}>🎁 Age / Milestone (Optional)</label>
                  <input
                    className="form-input"
                    value={customDetails.age_milestone || ''}
                    onChange={(e) => updateDetail('age_milestone', e.target.value)}
                    placeholder="e.g. Turning 25! • The Big 3-0 • Sweet 16"
                    maxLength={60}
                  />
                </div>
              )}

              {/* ───────────────────────────────────────────
                  ANNIVERSARY / LOVE LETTER — Special Date + 5 Promises
              ─────────────────────────────────────────── */}
              {(selectedTemplateId === 'anniversary' || selectedTemplateId === 'love-letter') && (
                <div className="form-group" style={{ background: 'linear-gradient(135deg,#fdf4ff,#fce7f3)', border: '2px dashed #c026d3', borderRadius: '16px', padding: '1.25rem' }}>
                  <label className="form-label" style={{ color: '#86198f' }}>💕 Anniversary Details</label>

                  <label className="form-label" style={{ fontSize: '0.82rem', marginTop: '0.75rem' }}>🗓️ Your Anniversary / Special Date</label>
                  <input
                    className="form-input"
                    type="date"
                    value={customDetails.special_date || ''}
                    onChange={(e) => updateDetail('special_date', e.target.value)}
                  />

                  <label className="form-label" style={{ fontSize: '0.82rem', marginTop: '0.75rem' }}>💌 5 Promises — Float as particles during the letter scene</label>
                  <p className="text-muted" style={{ fontSize: '0.75rem', marginBottom: '0.4rem' }}>Will also appear as a list after the love letter.</p>
                  {[1, 2, 3, 4, 5].map(i => (
                    <input
                      key={i}
                      className="form-input"
                      value={customDetails[`promise_${i}`] || ''}
                      onChange={(e) => updateDetail(`promise_${i}`, e.target.value)}
                      placeholder={['I promise to always choose you every day.', 'I promise to be your safe place, always.', 'I promise to make you smile on hard days.', 'I promise to grow with you, not apart.', 'I promise to love you more tomorrow than today.'][i - 1]}
                      maxLength={200}
                      style={{ marginBottom: '0.4rem' }}
                    />
                  ))}
                </div>
              )}

              {/* ───────────────────────────────────────────
                  LETTER FOR MOM / MOTHERS-DAY
              ─────────────────────────────────────────── */}
              {(selectedTemplateId === 'mothers-day' || selectedTemplateId === 'letter-for-mom') && (
                <div className="form-group" style={{ background: 'linear-gradient(135deg,#fff7ed,#fef3c7)', border: '2px dashed #f59e0b', borderRadius: '16px', padding: '1.25rem' }}>
                  <label className="form-label" style={{ color: '#92400e' }}>💐 Letter for Mom — Details</label>

                  <label className="form-label" style={{ fontSize: '0.82rem', marginTop: '0.75rem' }}>What do you call her?</label>
                  <input
                    className="form-input"
                    value={customDetails.mom_title || ''}
                    onChange={(e) => updateDetail('mom_title', e.target.value)}
                    placeholder="e.g. Maa, Amma, Ma, Mumma, Mom"
                    maxLength={40}
                  />

                  <label className="form-label" style={{ fontSize: '0.82rem', marginTop: '0.75rem' }}>Your Relation / Role (Optional)</label>
                  <input
                    className="form-input"
                    value={customDetails.relation || ''}
                    onChange={(e) => updateDetail('relation', e.target.value)}
                    placeholder="e.g. Your loving son, Your daughter"
                    maxLength={80}
                  />

                  <label className="form-label" style={{ fontSize: '0.82rem', marginTop: '0.75rem' }}>🤫 One Thing You Never Told Her — Revealed in the secret scene</label>
                  <textarea
                    className="form-textarea"
                    value={customDetails.secret_note || ''}
                    onChange={(e) => updateDetail('secret_note', e.target.value)}
                    placeholder="e.g. Ma, I never told you but your strength inspires me every single day..."
                    rows={3}
                    maxLength={400}
                  />

                  <label className="form-label" style={{ fontSize: '0.82rem', marginTop: '1rem' }}>📝 2-3 Sticky Note Memories — Shown as floating sticky notes</label>
                  {[1, 2, 3].map(i => (
                    <input
                      key={i}
                      className="form-input"
                      value={customDetails[`sticky_note_${i}`] || ''}
                      onChange={(e) => updateDetail(`sticky_note_${i}`, e.target.value)}
                      placeholder={`Memory #${i} — e.g. ${['Making cookies together 🍪', 'You stayed up when I was sick 🌡️', 'Your bedtime stories 📖'][i - 1]}`}
                      maxLength={150}
                      style={{ marginBottom: '0.5rem' }}
                    />
                  ))}
                </div>
              )}

              {/* ───────────────────────────────────────────
                  PROPOSAL / BE MY VALENTINE — Date idea
              ─────────────────────────────────────────── */}
              {(selectedTemplateId === 'proposal' || selectedTemplateId === 'be-my-valentine') && (
                <div className="form-group" style={{ background: 'linear-gradient(135deg,#fff0f6,#fce7f3)', border: '2px dashed #ec4899', borderRadius: '16px', padding: '1.25rem' }}>
                  <label className="form-label" style={{ color: '#9d174d' }}>💘 Proposal Details</label>

                  <label className="form-label" style={{ fontSize: '0.82rem', marginTop: '0.75rem' }}>🌹 Date Idea / Surprise Plan — Revealed when they click YES!</label>
                  <textarea
                    className="form-textarea"
                    value={customDetails.date_idea || ''}
                    onChange={(e) => updateDetail('date_idea', e.target.value)}
                    placeholder="e.g. Dinner at our favorite rooftop café + a walk under the stars ✨"
                    rows={3}
                    maxLength={400}
                  />
                </div>
              )}

              {/* ───────────────────────────────────────────
                  FRIENDSHIP DAY — Vibe, bond traits, one-liner, years
              ─────────────────────────────────────────── */}
              {selectedTemplateId === 'friendship' && (
                <div className="form-group" style={{ background: 'linear-gradient(135deg,#f0fdf4,#dcfce7)', border: '2px dashed #4ade80', borderRadius: '16px', padding: '1.25rem' }}>
                  <label className="form-label" style={{ color: '#14532d' }}>👯 Friendship Day Details</label>

                  <label className="form-label" style={{ fontSize: '0.82rem', marginTop: '0.75rem' }}>Your Name (Sender)</label>
                  <input
                    className="form-input"
                    value={customDetails.sender_name || ''}
                    onChange={(e) => updateDetail('sender_name', e.target.value)}
                    placeholder="e.g. Ankita, Your bestie forever"
                    maxLength={80}
                  />

                  <label className="form-label" style={{ fontSize: '0.82rem', marginTop: '0.75rem' }}>👯 Relationship Vibe</label>
                  <select className="form-input" value={customDetails.vibe || 'funny'} onChange={(e) => updateDetail('vibe', e.target.value)}>
                    <option value="funny">Funny & Chaotic 😂</option>
                    <option value="emotional">Emotional & Deep 🥺</option>
                    <option value="chill">Chill & Supportive 💆</option>
                  </select>

                  <label className="form-label" style={{ fontSize: '0.82rem', marginTop: '0.75rem' }}>⏳ Years Known</label>
                  <input
                    className="form-input"
                    value={customDetails.years_known || ''}
                    onChange={(e) => updateDetail('years_known', e.target.value)}
                    placeholder="e.g. 7 years, Since Class 6, Since 2017"
                    maxLength={40}
                  />

                  <label className="form-label" style={{ fontSize: '0.82rem', marginTop: '0.75rem' }}>💬 One-Liner that Describes You Two</label>
                  <input
                    className="form-input"
                    value={customDetails.one_liner || ''}
                    onChange={(e) => updateDetail('one_liner', e.target.value)}
                    placeholder="e.g. Partners in crime since forever 💖"
                    maxLength={100}
                  />

                  <label className="form-label" style={{ fontSize: '0.82rem', marginTop: '0.75rem' }}>🏷️ Bond Traits (comma-separated) — Used in word search game</label>
                  <input
                    className="form-input"
                    value={customDetails.bond_traits || ''}
                    onChange={(e) => updateDetail('bond_traits', e.target.value)}
                    placeholder="e.g. Loud, Always Eating, Secret Keepers, Late Night Calls"
                    maxLength={200}
                  />
                </div>
              )}

              {/* ───────────────────────────────────────────
                  PUZZLE — Hidden Message
              ─────────────────────────────────────────── */}
              {selectedTemplateId === 'puzzle' && (
                <div className="form-group" style={{ background: 'linear-gradient(135deg,#f0f9ff,#e0f2fe)', border: '2px dashed #38bdf8', borderRadius: '16px', padding: '1.25rem' }}>
                  <label className="form-label" style={{ color: '#0c4a6e' }}>🧩 Puzzle Details</label>

                  <label className="form-label" style={{ fontSize: '0.82rem', marginTop: '0.75rem' }}>🎉 Hidden Message — Revealed only after they solve the puzzle!</label>
                  <textarea
                    className="form-textarea"
                    value={customDetails.hidden_message || ''}
                    onChange={(e) => updateDetail('hidden_message', e.target.value)}
                    placeholder="e.g. Surprise! We're going to Paris! ✈️🗼"
                    rows={2}
                    maxLength={300}
                  />
                </div>
              )}

              {/* ───────────────────────────────────────────
                  WEDDING INVITATION — Full event details
              ─────────────────────────────────────────── */}
              {selectedTemplateId === 'wedding-invitation' && (
                <div className="form-group" style={{ background: 'linear-gradient(135deg,#fef2f2,#fff1f2)', border: '2px dashed #f472b6', borderRadius: '16px', padding: '1.25rem' }}>
                  <label className="form-label" style={{ color: '#881337' }}>💒 Wedding Event Details</label>

                  <label className="form-label" style={{ fontSize: '0.8rem', marginTop: '0.75rem' }}>Bride's Name</label>
                  <input className="form-input" value={customDetails.bride_name || ''} onChange={(e) => updateDetail('bride_name', e.target.value)} placeholder="e.g. Priya Sharma" maxLength={100} />

                  <label className="form-label" style={{ fontSize: '0.8rem', marginTop: '0.75rem' }}>Groom's Name</label>
                  <input className="form-input" value={customDetails.groom_name || ''} onChange={(e) => updateDetail('groom_name', e.target.value)} placeholder="e.g. Arjun Patel" maxLength={100} />

                  <label className="form-label" style={{ fontSize: '0.8rem', marginTop: '0.75rem' }}>Wedding Date</label>
                  <input className="form-input" type="date" value={customDetails.wedding_date || ''} onChange={(e) => updateDetail('wedding_date', e.target.value)} />

                  <label className="form-label" style={{ fontSize: '0.8rem', marginTop: '0.75rem' }}>Venue / Location</label>
                  <input className="form-input" value={customDetails.venue || ''} onChange={(e) => updateDetail('venue', e.target.value)} placeholder="e.g. The Grand Ballroom, Mumbai" maxLength={200} />

                  <label className="form-label" style={{ fontSize: '0.8rem', marginTop: '0.75rem' }}>Venue Map Link (Optional)</label>
                  <input className="form-input" value={customDetails.venue_map_url || ''} onChange={(e) => updateDetail('venue_map_url', e.target.value)} placeholder="e.g. https://maps.google.com/..." maxLength={500} />

                  <label className="form-label" style={{ fontSize: '0.8rem', marginTop: '1rem' }}>📋 Event Schedule — Add your Mehndi / Sangeet / Haldi / Vivah timings:</label>
                  {[
                    { key: 'event_mehndi', ph: 'Mehndi — e.g. 12 Feb, 4:00 PM at Home' },
                    { key: 'event_sangeet', ph: 'Sangeet — e.g. 13 Feb, 7:00 PM at Grand Hall' },
                    { key: 'event_haldi', ph: 'Haldi — e.g. 14 Feb, 10:00 AM' },
                    { key: 'event_wedding', ph: 'Wedding Ceremony — e.g. 14 Feb, 7:00 PM at Temple' },
                    { key: 'event_reception', ph: 'Reception — e.g. 15 Feb, 8:00 PM at Banquet Hall' },
                  ].map(({ key, ph }) => (
                    <input key={key} className="form-input" value={customDetails[key] || ''} onChange={(e) => updateDetail(key, e.target.value)} placeholder={ph} maxLength={200} style={{ marginBottom: '0.5rem' }} />
                  ))}
                </div>
              )}

              {/* ───────────────────────────────────────────
                  SURPRISE REVEAL BOX — 3 Hints + Final Surprise
              ─────────────────────────────────────────── */}
              {selectedTemplateId === 'surprise-reveal-box' && (
                <div className="form-group" style={{ background: 'linear-gradient(135deg,#fdf4ff,#fae8ff)', border: '2px dashed #a855f7', borderRadius: '16px', padding: '1.25rem' }}>
                  <label className="form-label" style={{ color: '#6b21a8' }}>🎁 Surprise Reveal Box Details</label>

                  <label className="form-label" style={{ fontSize: '0.82rem', marginTop: '0.75rem' }}>🎀 3-Layer Surprise Hints — Each hint is revealed as they untie a ribbon layer</label>
                  {[1, 2, 3].map((i) => (
                    <input
                      key={i}
                      className="form-input"
                      value={customDetails[`hint_${i}`] || ''}
                      onChange={(e) => updateDetail(`hint_${i}`, e.target.value)}
                      placeholder={i === 1 ? "Hint #1 — e.g. It's something sweet..." : i === 2 ? "Hint #2 — e.g. It's about us two..." : "Hint #3 — e.g. Open to see the big reveal!"}
                      maxLength={200}
                      style={{ marginBottom: '0.5rem' }}
                    />
                  ))}

                  <label className="form-label" style={{ fontSize: '0.82rem', marginTop: '0.5rem' }}>🎉 Final Big Surprise Announcement</label>
                  <textarea
                    className="form-textarea"
                    value={customDetails.final_surprise || ''}
                    onChange={(e) => updateDetail('final_surprise', e.target.value)}
                    placeholder="e.g. We're going to Goa next month! 🏖️✨"
                    rows={3}
                    maxLength={400}
                  />
                </div>
              )}

              {/* ───────────────────────────────────────────
                  A ROSE FOR SOMEONE SPECIAL — Dedication line
              ─────────────────────────────────────────── */}
              {selectedTemplateId === 'a-rose-for-someone-special' && (
                <div className="form-group" style={{ background: 'linear-gradient(135deg,#fff1f2,#ffe4e6)', border: '2px dashed #fb7185', borderRadius: '16px', padding: '1.25rem' }}>
                  <label className="form-label" style={{ color: '#9f1239' }}>🌹 Rose Details</label>

                  <label className="form-label" style={{ fontSize: '0.82rem', marginTop: '0.75rem' }}>✍️ Dedication Line — Appears at the center of the blooming rose</label>
                  <input
                    className="form-input"
                    value={customDetails.dedication_line || ''}
                    onChange={(e) => updateDetail('dedication_line', e.target.value)}
                    placeholder="e.g. For the love of my life — forever yours ❤️"
                    maxLength={200}
                  />
                </div>
              )}

              {/* ───────────────────────────────────────────
                  RAKSHABANDHAN — Promises, Unboxing Letter, Shagun QR
              ─────────────────────────────────────────── */}
              {selectedTemplateId === 'rakshabandhan' && (
                <>
                  <div className="form-group" style={{ background: 'linear-gradient(135deg,#fff7ed,#ffedd5)', border: '2px dashed #fb923c', borderRadius: '16px', padding: '1.25rem' }}>
                    <label className="form-label" style={{ color: '#7c2d12' }}>🪢 Raksha Bandhan Details</label>

                    <label className="form-label" style={{ fontSize: '0.82rem', marginTop: '0.75rem' }}>✨ 3 Promises — Revealed as each knot is tied in the ceremony</label>
                    {[1, 2, 3].map((i) => (
                      <input
                        key={i}
                        className="form-input"
                        value={customDetails[`rakhi_promise_${i}`] || ''}
                        onChange={(e) => updateDetail(`rakhi_promise_${i}`, e.target.value)}
                        placeholder={[
                          "Knot #1: e.g. I promise to always annoy you 😄",
                          "Knot #2: e.g. I promise to stand beside you through thick & thin ❤️",
                          "Knot #3: e.g. I promise to always pray for your happiness 🌟"
                        ][i - 1]}
                        maxLength={150}
                        style={{ marginBottom: '0.5rem' }}
                      />
                    ))}

                    <label className="form-label" style={{ fontSize: '0.82rem', marginTop: '1rem' }}>📜 Sister's Secret Unboxing Letter — Shown inside the gift box before the Shagun QR</label>
                    <textarea
                      className="form-textarea"
                      value={customDetails.unboxing_letter || ''}
                      onChange={(e) => updateDetail('unboxing_letter', e.target.value)}
                      placeholder="e.g. Dear Bhai, traditions are traditions 😄 so here's your chance to give your sister some Shagun! ❤️"
                      rows={3}
                      maxLength={500}
                    />
                  </div>

                  {/* Shagun QR — Raksha Bandhan only */}
                  <div className="form-group" style={{ background: 'linear-gradient(135deg,#fffbeb,#fef3c7)', border: '2px dashed #f59e0b', borderRadius: '16px', padding: '1.25rem' }}>
                    <label className="form-label" style={{ color: '#92400e', marginBottom: '0.25rem' }}>
                      🪢 Sister's Shagun QR Code (Optional but Recommended 😏)
                    </label>
                    <p className="text-muted" style={{ fontSize: '0.8rem', marginBottom: '0.75rem', color: '#b45309' }}>
                      Upload your UPI / PhonePe / GPay QR screenshot — it'll appear at the end with a playful money request message! 💸
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                      <CloudinaryUpload onUpload={(url) => setShagunQrUrl(url)} />
                      {shagunQrUrl ? (
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                          <img src={shagunQrUrl} alt="Shagun QR" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '10px', border: '3px solid #f59e0b' }} />
                          <button type="button" onClick={() => setShagunQrUrl('')} style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#e11d48', color: '#fff', border: 'none', borderRadius: '50%', width: '20px', height: '20px', fontSize: '0.7rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                        </div>
                      ) : (
                        <span className="text-muted" style={{ fontSize: '0.8rem', color: '#b45309' }}>No QR yet — upload your payment QR</span>
                      )}
                    </div>
                    <p style={{ fontSize: '0.72rem', color: '#d97706', marginTop: '0.5rem', fontStyle: 'italic' }}>
                      💡 Tip: Open PhonePe/GPay → "Receive Money" → screenshot the QR
                    </p>
                  </div>
                </>
              )}

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
                <p className="text-muted" style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: '#be185d' }}>
                  Custom links are ₹29 extra. 💡 <em>Note: Coupons apply to your total amount at checkout!</em>
                </p>
              </div>

              {error && <p style={{ color: '#e11d48', marginTop: '1rem', fontSize: '0.875rem', fontWeight: 700 }}>{error}</p>}

              <button className="btn-primary w-full mt-4" disabled={busy || slugStatus === 'taken'}>
                {busy ? 'Saving your note…' : 'Continue to preview & share link →'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
