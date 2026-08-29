'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { nanoid } from 'nanoid';
import { db } from '@/lib/firebase';
import { emotionalTemplates } from '@/lib/emotionalTemplates';
import CloudinaryUpload from '@/components/CloudinaryUpload';
import VoiceNoteRecorder from '@/components/VoiceNoteRecorder';
import { AUDIO_PRESETS } from '@/lib/audioPresets';

const relationships = ['Partner', 'Friend', 'Mom / Dad', 'Sibling', 'Someone special'];
const vibes = ['soft', 'romantic', 'playful', 'cinematic', 'deep'];
const labels = { 'just-because': 'What do you want to remind them?', 'things-i-never-said': 'Your final letter', 'i-miss-you': 'Your final message', 'open-when': 'Your closing message', 'emotional-apology': 'Your personal letter', 'youre-my-person': 'Your final message' };

function Lines({ title, values, onChange, min = 1, max = 5, placeholder }) {
  return <div className="form-group"><label className="form-label">{title}</label>{Array.from({ length: Math.max(min, values.length) }, (_, i) => <input key={i} className="form-input" value={values[i] || ''} maxLength={180} placeholder={placeholder ? `${placeholder} ${i + 1}` : `${title} ${i + 1}`} onChange={(e) => onChange([...values.slice(0, i), e.target.value, ...values.slice(i + 1)])} style={{ marginBottom: 8 }} />)}{values.length < max && <button type="button" className="btn-secondary" onClick={() => onChange([...values, ''])}>Add another</button>}</div>;
}

export default function EmotionalCreator({ templateId }) {
  const router = useRouter();
  const template = emotionalTemplates.find((item) => item.id === templateId) || emotionalTemplates[0];
  const [step, setStep] = useState(1);
  const [recipient, setRecipient] = useState('');
  const [relationship, setRelationship] = useState('Partner');
  const [vibe, setVibe] = useState('romantic');
  const [audioPreset, setAudioPreset] = useState('romantic-piano');
  const [enablePasscode, setEnablePasscode] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [secretQuestion, setSecretQuestion] = useState('');
  const [voiceNoteUrl, setVoiceNoteUrl] = useState('');
  const [message, setMessage] = useState('');
  const [details, setDetails] = useState({ unsaid: ['', '', ''], missed_things: ['', '', '', '', ''], envelopes: [{ title: 'you need a smile', message: '' }, { title: 'you miss me', message: '' }, { title: 'you feel alone', message: '' }, { title: 'you need courage', message: '' }], regrets: ['', '', ''], reasons: ['', '', '', '', ''], memories: ['', '', '', '', ''] });
  const [images, setImages] = useState([]);
  const [aiContext, setAiContext] = useState('');
  const [aiBusy, setAiBusy] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const update = (key, value) => setDetails((current) => ({ ...current, [key]: value }));
  const valid = recipient.trim() && message.trim();
  const personalizationComplete = () => {
    if (template.id === 'things-i-never-said') return details.unsaid.filter(Boolean).length >= 3 && Boolean(details.memory?.trim());
    if (template.id === 'i-miss-you') return Boolean(details.from_location?.trim() && details.to_location?.trim() && details.favorite_memory?.trim()) && details.missed_things.filter(Boolean).length === 5;
    if (template.id === 'open-when') return details.envelopes.length >= 4 && details.envelopes.every((item) => item.title?.trim() && item.message?.trim());
    if (template.id === 'emotional-apology') return Boolean(details.what_happened?.trim() && details.promise?.trim()) && details.regrets.filter(Boolean).length === 3;
    if (template.id === 'youre-my-person') return details.reasons.filter(Boolean).length === 5 && Boolean(details.inside_joke?.trim());
    return Boolean(details.small_detail?.trim());
  };
  const advance = () => {
    setError('');
    if (step === 1 && !recipient.trim()) { setError('Add their name to continue.'); return; }
    if (step === 2 && !personalizationComplete()) { setError('Complete all personalisation fields.'); return; }
    if (step === 3 && !message.trim()) { setError('Write your final message.'); return; }
    setStep((current) => current + 1);
  };
  const fillWithAi = async () => {
    if (!aiContext.trim()) { setError('Describe a few memories so AI can help draft this experience.'); return; }
    setAiBusy(true); setError('');
    try {
      const response = await fetch('/api/ai-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId: template.id, recipientName: recipient, aiContext, mode: 'emotional-template' }),
      });
      const raw = await response.text();
      let data = {};
      try { data = JSON.parse(raw); } catch { throw new Error(`AI service returned an invalid response (${response.status}). Please try again.`); }
      if (!response.ok) throw new Error(data.error || 'AI could not fill this experience.');
      setDetails((current) => ({ ...current, ...(data.details || {}) }));
      if (!message && data.message) setMessage(data.message);
    } catch (e) { setError(e.message || 'AI could not fill this experience.'); } finally { setAiBusy(false); }
  };
  const save = async () => {
    if (!valid) { setError('Add their name and your final message before continuing.'); return; }
    setBusy(true); setError('');
    try {
      const id = nanoid(32);
      let deviceId = localStorage.getItem('note_device_id');
      if (!deviceId) { deviceId = nanoid(32); localStorage.setItem('note_device_id', deviceId); }
      await setDoc(doc(db, 'notes', id), {
        creator_uid: deviceId,
        recipient_name: recipient.trim(),
        custom_message: message.trim(),
        voice_note_url: voiceNoteUrl || null,
        image_urls: images,
        shagun_qr_url: null,
        custom_details: {
          ...details,
          relationship,
          vibe,
          audio_preset: audioPreset,
          passcode: enablePasscode && passcode.trim() ? passcode.trim() : null,
          secret_question: enablePasscode && secretQuestion.trim() ? secretQuestion.trim() : null,
          experience_version: 2
        },
        is_paid: false,
        template: template.id,
        custom_slug: null,
        created_at: serverTimestamp(),
        expires_at: null
      });
      const ids = JSON.parse(localStorage.getItem('created_note_ids') || '[]'); localStorage.setItem('created_note_ids', JSON.stringify([...ids, id]));
      router.push(`/preview?id=${id}`);
    } catch (e) { setError(e.message || 'Could not create this experience.'); setBusy(false); }
  };
  const addPhoto = (url) => setImages((current) => current.length < template.photoLimit ? [...current, url] : current);

  return <main className="shell emotional-creator-shell"><div className="emotional-creator-wrap">
    <div className="emotional-creator-heading"><span>EMOTIONAL EXPERIENCE</span><h1>{template.icon} {template.title}</h1><p>Fill in the details, then see the complete experience and payment options on the next page.</p></div>
    <section className="glass-card emotional-creator-card"><div className="emotional-stepper">{[1,2,3,4].map((number) => <span key={number} className={step >= number ? 'is-active' : ''}>{number}</span>)}</div>
        {step === 1 && <><h2>Who is this for?</h2><div className="form-group"><label className="form-label">Their name</label><input className="form-input" value={recipient} onChange={(e) => setRecipient(e.target.value)} maxLength={80} placeholder="Maya, Mom, Bestie…" /></div><div className="form-group"><label className="form-label">Your relationship</label><select className="form-input" value={relationship} onChange={(e) => setRelationship(e.target.value)}>{relationships.map((item) => <option key={item}>{item}</option>)}</select></div></>}
        {step === 2 && <><div className="ai-fill-card"><strong>✨ Fill this experience with AI</strong><p>Share a few real details and we will draft every field. You can edit anything.</p><textarea className="form-input" rows="3" value={aiContext} onChange={(e) => setAiContext(e.target.value)} placeholder="e.g. we met at college, late-night chai, they are moving to Delhi…" /><button type="button" className="btn-secondary" disabled={aiBusy} onClick={fillWithAi}>{aiBusy ? 'Writing your experience…' : '✨ Fill all fields with AI'}</button></div><Personalization templateId={template.id} details={details} update={update} /></>}
        {step === 3 && <>
          <div className="form-group"><label className="form-label">{labels[template.id]}</label><textarea className="form-input" rows="4" value={message} onChange={(e) => setMessage(e.target.value)} maxLength={1500} placeholder="Write from the heart…" /></div>
          
          {/* Soundscape Selection */}
          <div className="form-group">
            <label className="form-label">🎵 Background Soundtrack</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 8 }}>
              {AUDIO_PRESETS.map((p) => (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => setAudioPreset(p.id)}
                  style={{
                    padding: '8px 10px',
                    borderRadius: 12,
                    border: '1.5px solid',
                    borderColor: audioPreset === p.id ? '#be185d' : '#f3f4f6',
                    background: audioPreset === p.id ? '#fff1f2' : '#fafaf9',
                    color: audioPreset === p.id ? '#be185d' : '#374151',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    textAlign: 'left'
                  }}
                >
                  <span>{p.icon}</span>
                  <span>{p.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Voice Note Recording */}
          <VoiceNoteRecorder
            onVoiceRecorded={(url) => setVoiceNoteUrl(url)}
            onVoiceRemoved={() => setVoiceNoteUrl('')}
            existingUrl={voiceNoteUrl}
          />

          <div className="form-group"><label className="form-label">Choose your vibe</label><div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>{vibes.map((item) => <button type="button" key={item} onClick={() => setVibe(item)} style={{ padding: '8px 12px', borderRadius: 99, border: '1px solid #f9a8d4', color: vibe === item ? '#fff' : '#9d174d', background: vibe === item ? '#be185d' : '#fff', cursor: 'pointer' }}>{item}</button>)}</div></div>

          {/* Optional Passcode Lock */}
          <div className="form-group" style={{ background: '#fdf2f8', padding: '14px', borderRadius: '14px', border: '1px solid #fbcfe8' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '13px', color: '#881337' }}>
              <input
                type="checkbox"
                checked={enablePasscode}
                onChange={(e) => setEnablePasscode(e.target.checked)}
              />
              🔒 Add Secret Passcode / Question Lock (Optional)
            </label>
            {enablePasscode && (
              <div style={{ marginTop: '10px', display: 'grid', gap: '8px' }}>
                <input
                  className="form-input"
                  placeholder="Secret Question (e.g., Where did we first meet?)"
                  value={secretQuestion}
                  maxLength={120}
                  onChange={(e) => setSecretQuestion(e.target.value)}
                />
                <input
                  className="form-input"
                  placeholder="Correct Passcode / Answer (e.g., Star Cafe or 1402)"
                  value={passcode}
                  maxLength={50}
                  onChange={(e) => setPasscode(e.target.value)}
                />
              </div>
            )}
          </div>

          <div className="form-group"><label className="form-label">Photos (optional, up to {template.photoLimit})</label><CloudinaryUpload onUpload={addPhoto} currentCount={images.length} maxPhotos={template.photoLimit} />{images.length > 0 && <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>{images.map((url, index) => <button type="button" key={url} onClick={() => setImages(images.filter((_, i) => i !== index))} style={{ border: 0, background: 'none', cursor: 'pointer' }}><img src={url} alt="Selected memory" style={{ width: 64, height: 64, borderRadius: 10, objectFit: 'cover' }} /></button>)}</div>}</div>
        </>}
        {error && <p style={{ color: '#be123c', fontWeight: 700, marginTop: 16 }}>{error}</p>}
        {step === 4 && <><h2>Ready for your private preview</h2><p className="text-muted">Your complete experience with Wax Seal entrance, background music, WhatsApp instant sender, and forever keepsake poster are ready on the next page.</p></>}
        <div className="emotional-creator-actions">{step > 1 && <button className="btn-secondary" onClick={() => { setError(''); setStep(step - 1); }}>Back</button>}{step < 4 ? <button className="btn-primary" onClick={advance}>Continue</button> : <button className="btn-primary" disabled={busy} onClick={save}>{busy ? 'Creating…' : `Preview & payment · ₹${template.price}`}</button>}</div>
      </section></div></main>;
}

function Personalization({ templateId, details, update }) {
  if (templateId === 'things-i-never-said') return <><Lines title="Things you never said" values={details.unsaid} onChange={(x) => update('unsaid', x)} min={3} max={7} placeholder="A truth you want them to know" /><div className="form-group"><label className="form-label">One personal memory</label><textarea className="form-input" value={details.memory || ''} onChange={(e) => update('memory', e.target.value)} /></div></>;
  if (templateId === 'i-miss-you') return <><div className="form-group"><label className="form-label">From location</label><input className="form-input" value={details.from_location || ''} onChange={(e) => update('from_location', e.target.value)} /></div><div className="form-group"><label className="form-label">To location</label><input className="form-input" value={details.to_location || ''} onChange={(e) => update('to_location', e.target.value)} /></div><Lines title="Five things you miss" values={details.missed_things} onChange={(x) => update('missed_things', x)} min={5} max={5} placeholder="I miss…" /><div className="form-group"><label className="form-label">Favourite memory</label><textarea className="form-input" value={details.favorite_memory || ''} onChange={(e) => update('favorite_memory', e.target.value)} /></div></>;
  if (templateId === 'open-when') return <><p className="text-muted">Create four to ten little letters.</p>{details.envelopes.map((item, i) => <div key={i} style={{ borderTop: '1px solid #fce7f3', paddingTop: 12, marginTop: 12 }}><input className="form-input" value={item.title} onChange={(e) => update('envelopes', details.envelopes.map((x, n) => n === i ? { ...x, title: e.target.value } : x))} placeholder="Open when…" /><textarea className="form-input" value={item.message} onChange={(e) => update('envelopes', details.envelopes.map((x, n) => n === i ? { ...x, message: e.target.value } : x))} placeholder="Your letter" style={{ marginTop: 8 }} /></div>)}{details.envelopes.length < 10 && <button type="button" className="btn-secondary" style={{ marginTop: 12 }} onClick={() => update('envelopes', [...details.envelopes, { title: '', message: '' }])}>Add envelope</button>}</>;
  if (templateId === 'emotional-apology') return <><div className="form-group"><label className="form-label">What happened?</label><textarea className="form-input" value={details.what_happened || ''} onChange={(e) => update('what_happened', e.target.value)} /></div><Lines title="Three things I regret" values={details.regrets} onChange={(x) => update('regrets', x)} min={3} max={3} placeholder="I regret…" /><div className="form-group"><label className="form-label">Your promise</label><textarea className="form-input" value={details.promise || ''} onChange={(e) => update('promise', e.target.value)} /></div></>;
  if (templateId === 'youre-my-person') return <><Lines title="Five reasons" values={details.reasons} onChange={(x) => update('reasons', x)} min={5} max={5} placeholder="You are…" /><Lines title="Your memories" values={details.memories} onChange={(x) => update('memories', x)} min={1} max={5} placeholder="A memory" /><div className="form-group"><label className="form-label">Inside joke</label><input className="form-input" value={details.inside_joke || ''} onChange={(e) => update('inside_joke', e.target.value)} /></div></>;
  return <div className="form-group"><label className="form-label">A small detail that will make them smile</label><textarea className="form-input" value={details.small_detail || ''} onChange={(e) => update('small_detail', e.target.value)} placeholder="An inside joke, a moment, or why they matter." /></div>;
}
