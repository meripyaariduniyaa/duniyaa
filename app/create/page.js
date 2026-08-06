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
              {/* TEMPLATE REQUIREMENTS & PHOTO GUIDELINES BANNER */}
              {selectedTemplate && (
                <div
                  style={{
                    background: 'linear-gradient(135deg, rgba(254, 242, 242, 0.95), rgba(253, 230, 238, 0.95))',
                    border: '1.5px solid #f472b6',
                    borderRadius: '16px',
                    padding: '1.25rem',
                    marginBottom: '1.75rem',
                    boxShadow: '0 4px 14px rgba(216, 30, 91, 0.08)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>{selectedTemplate.icon}</span>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#881337', fontWeight: 800 }}>
                        Requirements for {selectedTemplate.title}
                      </h4>
                      <span style={{ fontSize: '0.75rem', color: '#be185d', fontWeight: 600 }}>
                        {selectedTemplate.time} completion • {selectedTemplate.photoRequirement?.recommended || 3} photos recommended
                      </span>
                    </div>
                  </div>

                  {/* Photo Requirement Tip */}
                  {selectedTemplate.photoRequirement && (
                    <div style={{ background: '#fff', padding: '0.65rem 0.9rem', borderRadius: '10px', borderLeft: '4px solid #ec4899', marginBottom: '0.75rem' }}>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: '#4c0519', fontWeight: 700 }}>
                        📸 <strong>Photo Recommendation:</strong> {selectedTemplate.photoRequirement.tip}
                      </p>
                    </div>
                  )}

                  {/* Key Details Checklist */}
                  {selectedTemplate.detailsNeeded && (
                    <div style={{ marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#9f1239', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Key Details to Include:
                      </span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.35rem' }}>
                        {selectedTemplate.detailsNeeded.map((detail, idx) => (
                          <span key={idx} style={{ background: '#ffe4e6', color: '#9f1239', padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700 }}>
                            ✓ {detail}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Pro Tip */}
                  {selectedTemplate.tips && (
                    <p style={{ margin: 0, marginTop: '0.5rem', fontSize: '0.78rem', color: '#881337', fontStyle: 'italic' }}>
                      💡 <strong>Creator Tip:</strong> {selectedTemplate.tips}
                    </p>
                  )}
                </div>
              )}

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

                {/* Template Specific Interactive Prompts */}
                {selectedTemplate?.prompts && selectedTemplate.prompts.length > 0 && (
                  <div style={{ marginTop: '0.85rem', background: 'rgba(255, 255, 255, 0.85)', padding: '0.75rem 0.9rem', borderRadius: '12px', border: '1px dashed #f472b6' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#be185d', display: 'block', marginBottom: '0.5rem' }}>
                      💡 Inspiration prompts for "{selectedTemplate.title}" (click to insert):
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      {selectedTemplate.prompts.map((promptText, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setMessage((prev) => (prev ? `${prev}\n\n${promptText}` : promptText))}
                          style={{
                            textAlign: 'left',
                            background: '#fff',
                            border: '1px solid #fbcfe8',
                            borderRadius: '8px',
                            padding: '0.45rem 0.75rem',
                            fontSize: '0.75rem',
                            color: '#881337',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          ✨ "+ {promptText}"
                        </button>
                      ))}
                    </div>
                  </div>
                )}
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
                    {images.length ? `${images.length} photo(s) added` : 'Up to 6 photos max'}
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
                <p className="text-muted" style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: '#15803d', fontWeight: 600 }}>
                  ✨ Custom links are 100% FREE! Included with your note.
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
