'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { doc, serverTimestamp, setDoc, getDoc } from 'firebase/firestore';
import { nanoid } from 'nanoid';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '@/lib/firebase';
import CloudinaryUpload from '@/components/CloudinaryUpload';
import VoiceNoteRecorder from '@/components/VoiceNoteRecorder';
import GoldBadge from '@/components/templates/common/GoldBadge';
import { AUDIO_PRESETS } from '@/lib/audioPresets';

const ACTIVE_TEMPLATES = [
  {
    id: 'proposal',
    title: 'The Perfect Proposal',
    badge: 'ring',
    category: 'Romantic Odyssey',
    accentColor: '#f43f5e',
    glowColor: 'rgba(244, 63, 94, 0.3)',
    description: '7-chapter cinematic proposal with royal envelope, compatibility quiz, and velvet ring box.',
    defaultAudio: 'romantic-piano',
    sampleMessage: 'From our late-night conversations to exploring new places together, every moment with you feels like home. Will you marry me and make me the happiest person in the universe?',
  },
  {
    id: 'birthday',
    title: 'Virtual Birthday Bash',
    badge: 'cake',
    category: 'VIP Celebration',
    accentColor: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.3)',
    description: '8-scene interactive theater with midnight countdown, golden sparklers, balloon pops, and fireworks.',
    defaultAudio: 'birthday-joy',
    sampleMessage: 'Wishing you a year filled with endless laughter, boundless happiness, unforgettable adventures, and every dream your heart has been holding. Happy Birthday!',
  },
  {
    id: 'anniversary',
    title: 'Anniversary Special',
    badge: 'toast',
    category: 'Love Museum',
    accentColor: '#fbbf24',
    glowColor: 'rgba(251, 191, 36, 0.3)',
    description: '7-chapter milestone timeline with live seconds ticker, 5 illuminated vow tablets, and champagne toast.',
    defaultAudio: 'romantic-piano',
    sampleMessage: 'Every single day by your side has been an adventure I never want to end. Thank you for filling our world with unconditional kindness, warmth, and laughter. Happy Anniversary!',
  },
  {
    id: 'i-miss-you',
    title: 'I Miss You',
    badge: 'compass',
    category: 'Celestial Odyssey',
    accentColor: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.3)',
    description: '7-chapter long-distance flight path with 5 Open When letters, lo-fi cassette, and virtual hug charger.',
    defaultAudio: 'lofi-sunset',
    sampleMessage: 'Even across all these miles and silent evenings, not a single day passes where you are not my first and last thought. Distance is only a test of how far love can travel.',
  },
  {
    id: 'emotional-apology',
    title: "I'm Sorry",
    badge: 'crane',
    category: 'Vulnerable Healing',
    accentColor: '#94a3b8',
    glowColor: 'rgba(148, 163, 184, 0.3)',
    description: '7-chapter sincere apology with rainy window reflection, accountability card, and 3D origami crane.',
    defaultAudio: 'sincere-acoustic',
    sampleMessage: 'I am deeply sorry for how I acted and the hurt I caused. You mean far too much to me for me to let my mistakes go unaddressed. I take full responsibility and promise to do better.',
  },
];

export default function CreatePage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a12', color: '#fff' }}>
          <div style={{ textAlign: 'center' }}>
            <div className="spinner" style={{ margin: '0 auto 1rem' }} />
            <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>Loading Creative Studio...</p>
          </div>
        </div>
      }
    >
      <CreatePageContent />
    </Suspense>
  );
}

function CreatePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateIdParam = searchParams.get('template');

  // Selected template
  const [selectedTemplateId, setSelectedTemplateId] = useState(
    ACTIVE_TEMPLATES.some((t) => t.id === templateIdParam) ? templateIdParam : 'proposal'
  );

  useEffect(() => {
    if (templateIdParam && ACTIVE_TEMPLATES.some((t) => t.id === templateIdParam)) {
      setSelectedTemplateId(templateIdParam);
    }
  }, [templateIdParam]);

  const activeTemplate = ACTIVE_TEMPLATES.find((t) => t.id === selectedTemplateId) || ACTIVE_TEMPLATES[0];

  // Form Fields
  const [recipientName, setRecipientName] = useState('');
  const [message, setMessage] = useState('');
  const [voiceNoteUrl, setVoiceNoteUrl] = useState('');
  const [images, setImages] = useState([]);
  const [audioPreset, setAudioPreset] = useState(activeTemplate.defaultAudio);

  // Template-Specific Details
  const [customDetails, setCustomDetails] = useState({
    // Proposal
    date_idea: '',
    special_memory: '',
    // Birthday
    nickname: '',
    gift_clue: '',
    // Anniversary
    years_together: '2',
    // I Miss You
    sender_city: '',
    recipient_city: '',
    distance_km: '',
    song_title: '',
    reunion_date: '',
    // Apology
    what_happened: '',
  });

  const updateDetail = (field, value) => {
    setCustomDetails((prev) => ({ ...prev, [field]: value }));
  };

  // Custom Slug state
  const [customSlug, setCustomSlug] = useState('');
  const [slugStatus, setSlugStatus] = useState(''); // '', 'checking', 'available', 'taken'

  // Submission state
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  // AI Assistant State
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiTone, setAiTone] = useState('romantic');
  const [aiKeywords, setAiKeywords] = useState('');
  const [aiBusy, setAiBusy] = useState(false);
  const [aiOptions, setAiOptions] = useState([]);
  const [aiError, setAiError] = useState('');

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

  const handleTemplateChange = (id) => {
    setSelectedTemplateId(id);
    const tmpl = ACTIVE_TEMPLATES.find((t) => t.id === id);
    if (tmpl) {
      setAudioPreset(tmpl.defaultAudio);
    }
  };

  const handleAutofillSample = () => {
    setMessage(activeTemplate.sampleMessage);
    if (!recipientName) {
      setRecipientName('My Special Someone');
    }
  };

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
        }),
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

  const getDeviceId = () => {
    let deviceId = typeof window !== 'undefined' ? localStorage.getItem('note_device_id') : null;
    if (!deviceId && typeof window !== 'undefined') {
      deviceId = nanoid(32);
      localStorage.setItem('note_device_id', deviceId);
    }
    return deviceId || 'anonymous_creator';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');

    try {
      if (!recipientName.trim()) {
        throw new Error('Please enter the recipient’s name.');
      }
      if (!message.trim()) {
        throw new Error('Please write a heartfelt message or use a preset.');
      }

      let docId;
      if (customSlug && customSlug.length >= 3) {
        if (slugStatus === 'taken') {
          throw new Error('This custom URL is already taken. Please pick another.');
        }
        docId = customSlug;
      } else {
        docId = nanoid(32);
      }

      const deviceId = getDeviceId();

      // Clean undefined fields to avoid Firestore error
      const cleanedDetails = { ...customDetails, audio_preset: audioPreset };
      Object.keys(cleanedDetails).forEach((key) => {
        if (cleanedDetails[key] === undefined || cleanedDetails[key] === '') {
          delete cleanedDetails[key];
        }
      });

      await setDoc(doc(db, 'notes', docId), {
        creator_uid: deviceId,
        recipient_name: recipientName.trim(),
        custom_message: message.trim(),
        voice_note_url: voiceNoteUrl || null,
        image_urls: images || [],
        custom_details: Object.keys(cleanedDetails).length > 0 ? cleanedDetails : null,
        is_paid: false,
        template: selectedTemplateId,
        custom_slug: customSlug || null,
        created_at: serverTimestamp(),
        expires_at: null,
      });

      if (typeof window !== 'undefined') {
        const createdIds = JSON.parse(localStorage.getItem('created_note_ids') || '[]');
        createdIds.push(docId);
        localStorage.setItem('created_note_ids', JSON.stringify(createdIds));
      }

      router.push(`/preview?id=${docId}`);
    } catch (err) {
      setError(err.message || 'Failed to create surprise. Please try again.');
      setBusy(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at 50% 0%, #151528 0%, #080810 100%)',
        color: '#f8fafc',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        paddingBottom: '6rem',
      }}
    >
      {/* ── TOP NAV BAR (BACK BUTTON & BRANDING) ── */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          background: 'rgba(8, 8, 16, 0.85)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '0.85rem 1.25rem',
        }}
      >
        <div
          style={{
            maxWidth: '1100px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Back to Home Button */}
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '50px',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#cbd5e1',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: 600,
              transition: 'all 0.2s ease',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            <span>Back to Home</span>
          </Link>

          {/* Studio Brand Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <GoldBadge name="sparkle" size={20} />
            <span style={{ fontWeight: 800, fontSize: '0.95rem', letterSpacing: '0.05em', color: '#fff' }}>
              LovelyCrafts Studio
            </span>
          </div>
        </div>
      </header>

      {/* ── MAIN CREATOR CONTENT ── */}
      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1rem' }}>
        {/* Headline */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span
            style={{
              display: 'inline-block',
              fontSize: '0.75rem',
              fontWeight: 800,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: activeTemplate.accentColor,
              background: activeTemplate.glowColor,
              padding: '6px 14px',
              borderRadius: '999px',
              marginBottom: '0.75rem',
            }}
          >
            {activeTemplate.category}
          </span>
          <h1
            style={{
              fontFamily: 'var(--font-dancing)',
              fontSize: 'clamp(2.2rem, 5.5vw, 3.4rem)',
              color: '#fff',
              margin: '0 0 0.5rem',
            }}
          >
            Craft an Unforgettable Surprise
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', maxWidth: '520px', margin: '0 auto' }}>
            Customize your 7-chapter cinematic movie with personal memories, photos, vows, and romantic interactions.
          </p>
        </div>

        {/* ── 1. SELECT CINEMATIC TEMPLATE TABS ── */}
        <section style={{ marginBottom: '2.5rem' }}>
          <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>
            1. Select Experience Template
          </label>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '0.75rem',
            }}
          >
            {ACTIVE_TEMPLATES.map((tmpl) => {
              const isSelected = tmpl.id === selectedTemplateId;
              return (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => handleTemplateChange(tmpl.id)}
                  style={{
                    background: isSelected ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                    border: isSelected ? `2px solid ${tmpl.accentColor}` : '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '18px',
                    padding: '1.25rem 0.75rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    boxShadow: isSelected ? `0 0 25px ${tmpl.glowColor}` : 'none',
                    transition: 'all 0.25s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  <GoldBadge name={tmpl.badge} size={32} />
                  <div style={{ color: isSelected ? '#fff' : '#94a3b8', fontWeight: isSelected ? 700 : 500, fontSize: '0.9rem', lineHeight: 1.2 }}>
                    {tmpl.title}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* ── FORM CONTAINER ── */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* ── 2. RECIPIENT & OCCASION SPECIFICS ── */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '24px',
              padding: '1.75rem',
            }}
          >
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', margin: '0 0 1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <GoldBadge name="sparkle" size={18} />
              Recipient & Journey Details
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Recipient Name */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.4rem' }}>
                  Recipient Name <span style={{ color: activeTemplate.accentColor }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex, Maya, Bestie"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    background: 'rgba(0, 0, 0, 0.3)',
                    color: '#fff',
                    fontSize: '1rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Template Specific Dynamic Inputs */}
              {selectedTemplateId === 'proposal' && (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.4rem' }}>
                      Special First Moment / Memory
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. That rainy café evening when our eyes first locked"
                      value={customDetails.special_memory}
                      onChange={(e) => updateDetail('special_memory', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        background: 'rgba(0, 0, 0, 0.3)',
                        color: '#fff',
                        fontSize: '0.95rem',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.4rem' }}>
                      Proposed Date Idea / Surprise (Revealed after YES!)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Private candle-light dinner on the rooftop"
                      value={customDetails.date_idea}
                      onChange={(e) => updateDetail('date_idea', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        background: 'rgba(0, 0, 0, 0.3)',
                        color: '#fff',
                        fontSize: '0.95rem',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </>
              )}

              {selectedTemplateId === 'birthday' && (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.4rem' }}>
                      Special Birthday Memory or Inside Joke
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. The hilarious road trip where we got lost for 4 hours"
                      value={customDetails.special_memory}
                      onChange={(e) => updateDetail('special_memory', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        background: 'rgba(0, 0, 0, 0.3)',
                        color: '#fff',
                        fontSize: '0.95rem',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.4rem' }}>
                      Secret Gift Clue / Surprise Plan
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Check your doorstep at 7:00 PM tonight!"
                      value={customDetails.gift_clue}
                      onChange={(e) => updateDetail('gift_clue', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        background: 'rgba(0, 0, 0, 0.3)',
                        color: '#fff',
                        fontSize: '0.95rem',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </>
              )}

              {selectedTemplateId === 'anniversary' && (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.4rem' }}>
                      Years / Milestones Together
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 2 Years, 500 Days, 10 Golden Years"
                      value={customDetails.years_together}
                      onChange={(e) => updateDetail('years_together', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        background: 'rgba(0, 0, 0, 0.3)',
                        color: '#fff',
                        fontSize: '0.95rem',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.4rem' }}>
                      Cherished Anniversary Memory
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Watching the sunrise from the mountain cabin"
                      value={customDetails.special_memory}
                      onChange={(e) => updateDetail('special_memory', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        background: 'rgba(0, 0, 0, 0.3)',
                        color: '#fff',
                        fontSize: '0.95rem',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </>
              )}

              {selectedTemplateId === 'i-miss-you' && (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.4rem' }}>
                        Your City (Origin)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. New York, Mumbai"
                        value={customDetails.sender_city}
                        onChange={(e) => updateDetail('sender_city', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          borderRadius: '12px',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          background: 'rgba(0, 0, 0, 0.3)',
                          color: '#fff',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.4rem' }}>
                        Their City (Destination)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. London, Tokyo"
                        value={customDetails.recipient_city}
                        onChange={(e) => updateDetail('recipient_city', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          borderRadius: '12px',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          background: 'rgba(0, 0, 0, 0.3)',
                          color: '#fff',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.4rem' }}>
                        Distance (in Kilometers)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 1,450"
                        value={customDetails.distance_km}
                        onChange={(e) => updateDetail('distance_km', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          borderRadius: '12px',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          background: 'rgba(0, 0, 0, 0.3)',
                          color: '#fff',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.4rem' }}>
                        Next Reunion Date
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. December 24th, Soon"
                        value={customDetails.reunion_date}
                        onChange={(e) => updateDetail('reunion_date', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          borderRadius: '12px',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          background: 'rgba(0, 0, 0, 0.3)',
                          color: '#fff',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                  </div>
                </>
              )}

              {selectedTemplateId === 'emotional-apology' && (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.4rem' }}>
                      What Happened (Honest Reflection)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. I let my frustration get the better of me and failed to listen to how you were feeling."
                      value={customDetails.what_happened}
                      onChange={(e) => updateDetail('what_happened', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        background: 'rgba(0, 0, 0, 0.3)',
                        color: '#fff',
                        fontSize: '0.95rem',
                        boxSizing: 'border-box',
                        resize: 'vertical',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.4rem' }}>
                      The Sacred Memory (Why our bond matters)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. The effortless laughter and trust we have always shared."
                      value={customDetails.special_memory}
                      onChange={(e) => updateDetail('special_memory', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        background: 'rgba(0, 0, 0, 0.3)',
                        color: '#fff',
                        fontSize: '0.95rem',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ── 3. HEARTFELT LETTER & AI ASSISTANT ── */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '24px',
              padding: '1.75rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <GoldBadge name="waxSeal" size={18} />
                Your Sincere Letter / Custom Message
              </h2>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={handleAutofillSample}
                  style={{
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '50px',
                    padding: '6px 14px',
                    color: '#cbd5e1',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Use Preset Message
                </button>

                <button
                  type="button"
                  onClick={() => setShowAiModal(true)}
                  style={{
                    background: 'linear-gradient(135deg, #a855f7, #6366f1)',
                    border: 'none',
                    borderRadius: '50px',
                    padding: '6px 14px',
                    color: '#fff',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <GoldBadge name="sparkle" size={12} />
                  AI Magic
                </button>
              </div>
            </div>

            <textarea
              rows={5}
              required
              placeholder="Write your personal letter here... This will be typewritten on authentic wax-sealed parchment in the cinematic finale."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: '14px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                background: 'rgba(0, 0, 0, 0.3)',
                color: '#fff',
                fontSize: '1rem',
                lineHeight: 1.6,
                boxSizing: 'border-box',
                resize: 'vertical',
              }}
            />
          </div>

          {/* ── 4. MEDIA & POLAROID MEMORIES ── */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '24px',
              padding: '1.75rem',
            }}
          >
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', margin: '0 0 1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <GoldBadge name="sparkle" size={18} />
              Memory Gallery & Voice Note
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.5rem' }}>
                  Upload Memory Photos (Displayed in 3D Draggable Polaroids)
                </label>
                <CloudinaryUpload
                  images={images}
                  setImages={setImages}
                  maxImages={6}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.5rem' }}>
                  Record a Personal Voice Note (Optional)
                </label>
                <VoiceNoteRecorder
                  audioUrl={voiceNoteUrl}
                  setAudioUrl={setVoiceNoteUrl}
                />
              </div>
            </div>
          </div>

          {/* ── 5. SOUNDTRACK & CUSTOM SHORT LINK ── */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '24px',
              padding: '1.75rem',
            }}
          >
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', margin: '0 0 1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <GoldBadge name="cassette" size={18} />
              Soundtrack & Memorable Custom URL
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Soundtrack Preset */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.5rem' }}>
                  Ambient Background Mood
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.5rem' }}>
                  {AUDIO_PRESETS.map((p) => {
                    const isSelected = audioPreset === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setAudioPreset(p.id)}
                        style={{
                          textAlign: 'left',
                          padding: '10px 14px',
                          borderRadius: '12px',
                          border: isSelected ? `2px solid ${activeTemplate.accentColor}` : '1px solid rgba(255, 255, 255, 0.1)',
                          background: isSelected ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.2)',
                          color: isSelected ? '#fff' : '#94a3b8',
                          fontSize: '0.85rem',
                          fontWeight: isSelected ? 700 : 400,
                          cursor: 'pointer',
                        }}
                      >
                        {p.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Slug */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.4rem' }}>
                  Custom Memorable Link (Optional)
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>lovelycrafts.in/p/</span>
                  <input
                    type="text"
                    placeholder="for-my-love"
                    value={customSlug}
                    onChange={(e) => setCustomSlug(sanitizeSlug(e.target.value))}
                    style={{
                      flex: 1,
                      padding: '10px 14px',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      background: 'rgba(0, 0, 0, 0.3)',
                      color: '#fff',
                      fontSize: '0.95rem',
                    }}
                  />
                </div>
                {slugStatus === 'checking' && <span style={{ color: '#38bdf8', fontSize: '0.78rem', marginTop: '4px', display: 'block' }}>Checking availability...</span>}
                {slugStatus === 'available' && <span style={{ color: '#4ade80', fontSize: '0.78rem', marginTop: '4px', display: 'block' }}>✓ Custom link is available!</span>}
                {slugStatus === 'taken' && <span style={{ color: '#f87171', fontSize: '0.78rem', marginTop: '4px', display: 'block' }}>✗ Custom link is already taken.</span>}
              </div>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                borderRadius: '14px',
                padding: '12px 16px',
                color: '#fca5a5',
                fontSize: '0.92rem',
              }}
            >
              {error}
            </div>
          )}

          {/* ── SUBMIT BUTTON ── */}
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: `0 0 35px ${activeTemplate.glowColor}` }}
              whileTap={{ scale: 0.96 }}
              type="submit"
              disabled={busy}
              style={{
                background: `linear-gradient(135deg, ${activeTemplate.accentColor}, #be123c)`,
                color: '#fff',
                padding: '18px 48px',
                borderRadius: '50px',
                border: 'none',
                fontSize: '1.15rem',
                fontWeight: 800,
                cursor: busy ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                width: '100%',
                maxWidth: '420px',
                justifyContent: 'center',
                opacity: busy ? 0.7 : 1,
              }}
            >
              <GoldBadge name="sparkle" size={20} />
              {busy ? 'Creating Cinematic Experience...' : 'Launch Cinematic Preview →'}
            </motion.button>
          </div>
        </form>

        {/* ── AI MAGIC MODAL ── */}
        <AnimatePresence>
          {showAiModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.75)',
                backdropFilter: 'blur(8px)',
                zIndex: 100,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem',
              }}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                style={{
                  background: '#131320',
                  border: '1px solid rgba(168, 85, 247, 0.4)',
                  borderRadius: '24px',
                  padding: '2rem',
                  maxWidth: '520px',
                  width: '100%',
                  boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h3 style={{ color: '#fff', fontSize: '1.25rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <GoldBadge name="sparkle" size={20} />
                    AI Message Craftsman
                  </h3>
                  <button
                    onClick={() => setShowAiModal(false)}
                    style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.5rem', cursor: 'pointer' }}
                  >
                    &times;
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 600 }}>Message Tone</label>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
                      {['romantic', 'heartfelt', 'poetic', 'playful', 'sincere'].map((tone) => (
                        <button
                          key={tone}
                          type="button"
                          onClick={() => setAiTone(tone)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '50px',
                            border: aiTone === tone ? '1px solid #a855f7' : '1px solid rgba(255, 255, 255, 0.1)',
                            background: aiTone === tone ? 'rgba(168, 85, 247, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                            color: aiTone === tone ? '#fff' : '#94a3b8',
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                          }}
                        >
                          {tone}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 600 }}>Key Memories / Keywords</label>
                    <input
                      type="text"
                      placeholder="e.g. late night chats, favorite song, forever partner"
                      value={aiKeywords}
                      onChange={(e) => setAiKeywords(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        background: 'rgba(0, 0, 0, 0.3)',
                        color: '#fff',
                        marginTop: '4px',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <button
                    type="button"
                    disabled={aiBusy}
                    onClick={generateAiMessages}
                    style={{
                      background: 'linear-gradient(135deg, #a855f7, #6366f1)',
                      color: '#fff',
                      padding: '12px',
                      borderRadius: '12px',
                      border: 'none',
                      fontWeight: 700,
                      cursor: aiBusy ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {aiBusy ? 'Crafting Heartfelt Options...' : 'Generate Messages'}
                  </button>

                  {aiError && <p style={{ color: '#f87171', fontSize: '0.85rem', margin: 0 }}>{aiError}</p>}

                  {aiOptions.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
                      {aiOptions.map((opt, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            setMessage(opt);
                            setShowAiModal(false);
                          }}
                          style={{
                            padding: '10px 12px',
                            borderRadius: '10px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            color: '#e2e8f0',
                            fontSize: '0.88rem',
                            lineHeight: 1.4,
                            cursor: 'pointer',
                          }}
                        >
                          {opt}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
