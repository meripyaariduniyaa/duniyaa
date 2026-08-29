'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { nanoid } from 'nanoid';
import { db } from '@/lib/firebase';
import { templates } from '@/lib/templates';
import CloudinaryUpload from '@/components/CloudinaryUpload';
import VoiceNoteRecorder from '@/components/VoiceNoteRecorder';
import { AUDIO_PRESETS } from '@/lib/audioPresets';

const vibes = ['soft', 'romantic', 'playful', 'cinematic', 'deep'];
const fields = {
  sorry: [['promise_1','Promise #1 you will keep'],['promise_2','Promise #2 for the future'],['promise_3','Promise #3 for rebuilding trust']],
  birthday: [
    ['sender_name','Your Name (Sender) — Appears on sign-off'],
    ['balloon_word_1','Balloon Word #1 (e.g. You)'],
    ['balloon_word_2','Balloon Word #2 (e.g. are)'],
    ['balloon_word_3','Balloon Word #3 (e.g. so)'],
    ['balloon_word_4','Balloon Word #4 (e.g. special!)'],
    ['bouquet_msg_1','Bouquet Floating Note #1 (e.g. Forever yours 💕)'],
    ['bouquet_msg_2','Bouquet Floating Note #2 (e.g. My sunshine ☀️)'],
    ['bouquet_msg_3','Bouquet Floating Note #3 (e.g. Lucky to have you)'],
    ['age_milestone','Age or Milestone (e.g. Turning 25! • Sweet 16)']
  ],
  anniversary: [
    ['special_date','Your Anniversary / Special Date'],
    ['promise_1','Promise #1 (e.g. I promise to always choose you)'],
    ['promise_2','Promise #2 (e.g. I promise to be your safe place)'],
    ['promise_3','Promise #3 (e.g. I promise to make you laugh on hard days)'],
    ['promise_4','Promise #4 (e.g. I promise to grow with you)'],
    ['promise_5','Promise #5 (e.g. I promise to love you more each day)']
  ],
  'mothers-day': [
    ['mom_title','What you call her (Maa, Amma, Mom, Mumma)'],
    ['relation','Your Relation (e.g. Your loving daughter/son)'],
    ['secret_note','One Thing You Never Say Enough — Revealed in secret scene'],
    ['sticky_note_1','Sticky Note Memory #1 (e.g. Late night chats)'],
    ['sticky_note_2','Sticky Note Memory #2 (e.g. Your warm cooking)'],
    ['sticky_note_3','Sticky Note Memory #3 (e.g. Always believing in me)']
  ],
  proposal: [
    ['date_idea','Your Dream Date / Surprise Plan — Revealed when they click YES!']
  ],
  friendship: [
    ['sender_name','Your Name (Sender)'],
    ['years_known','Years You Have Known Each Other (e.g. 5 Years)'],
    ['one_liner','A One-Liner About Your Chaotic / Sweet Bond'],
    ['bond_traits','Bond Traits (e.g. Chaotic, Emotional, Ride-or-Die)']
  ],
  puzzle: [
    ['hidden_message','Hidden Secret Note — Unlocked and decoded when puzzle is solved']
  ],
  'wedding-invitation': [
    ['bride_name','Bride Name'],
    ['groom_name','Groom Name'],
    ['wedding_date','Wedding Date (e.g. 15th December 2026)'],
    ['venue','Wedding Venue & City'],
    ['venue_map_url','Google Maps Venue Link (Optional)'],
    ['event_1_name','Event 1 (e.g. Mehndi & Haldi)'],
    ['event_1_time','Event 1 Date & Time'],
    ['event_2_name','Event 2 (e.g. Sangeet & Cocktail)'],
    ['event_2_time','Event 2 Date & Time'],
    ['event_3_name','Event 3 (e.g. Sacred Vivah Ceremony)'],
    ['event_3_time','Event 3 Date & Time']
  ],
  'surprise-reveal-box': [
    ['hint_1','Layer 1 Hint / Sweet Clue'],
    ['hint_2','Layer 2 Hint / Teasing Clue'],
    ['hint_3','Layer 3 Hint / Final Clue'],
    ['final_surprise','Final Big Surprise Announcement (e.g. Pack your bags for Goa!)']
  ],
  'a-rose-for-someone-special': [
    ['dedication_line','Dedication Subtitle (e.g. For the one who makes my heart bloom 🌹)']
  ],
  rakshabandhan: [
    ['rakhi_promise_1','Sibling Promise #1'],
    ['rakhi_promise_2','Sibling Promise #2'],
    ['rakhi_promise_3','Sibling Promise #3'],
    ['unboxing_letter','Special Childhood Memory / Sibling Note']
  ],
  'fathers-day': [
    ['dad_title','What you call him (Papa, Dad, Appa, Baba, Pops)'],
    ['lesson_1','Life Lesson #1 he gave you'],
    ['lesson_2','Life Lesson #2 he gave you'],
    ['lesson_3','Life Lesson #3 he gave you'],
    ['hero_memory','A proud childhood or life memory with him'],
    ['unspoken_gratitude','One Thing You Rarely Say Out Loud to Him']
  ],
  'get-well-soon': [
    ['warm_wish','A comforting cheer-up wish'],
    ['dose_1','Prescription Dose #1 (e.g. 1000mg of Pure Warm Hugs)'],
    ['dose_2','Prescription Dose #2 (e.g. 500mg of Hot Chai & Zero Stress)'],
    ['dose_3','Prescription Dose #3 (e.g. Infinite Dose of Silly Memories)'],
    ['comfort_promise','Your Sweet Recovery Promise (e.g. Dinner on me when you are back!)']
  ],
};

function normalizeTemplate(id) { return ({ apology: 'sorry', 'birthday-surprise': 'birthday', 'love-letter': 'anniversary', 'letter-for-mom': 'mothers-day', 'letter-for-dad': 'fathers-day', 'warm-hug': 'get-well-soon', 'be-my-valentine': 'proposal' })[id] || id; }

export default function LegacyCreator({ templateId }) {
  const router = useRouter();
  const template = templates.find((item) => item.id === templateId) || templates[0];
  const fieldList = fields[normalizeTemplate(template.id)] || [];
  const [step, setStep] = useState(1);
  const [recipient, setRecipient] = useState('');
  const [birthdayRelation, setBirthdayRelation] = useState('');
  const [message, setMessage] = useState('');
  const [details, setDetails] = useState({});
  const [images, setImages] = useState([]);
  const [vibe, setVibe] = useState('soft');
  const [audioPreset, setAudioPreset] = useState(template.id === 'birthday' ? 'birthday-joy' : 'romantic-piano');
  const [enablePasscode, setEnablePasscode] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [secretQuestion, setSecretQuestion] = useState('');
  const [voiceNoteUrl, setVoiceNoteUrl] = useState('');
  const [aiContext, setAiContext] = useState('');
  const [busy, setBusy] = useState(false);
  const [aiBusy, setAiBusy] = useState(false);
  const [error, setError] = useState('');

  const update = (key, value) => setDetails((current) => ({ ...current, [key]: value }));
  
  const fill = async () => {
    setAiBusy(true); setError('');
    try {
      const res = await fetch('/api/ai-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: template.id,
          recipientName: recipient,
          tone: vibe === 'deep' ? 'sincere' : vibe,
          keywords: aiContext,
          relationship: template.id === 'birthday' ? (birthdayRelation || 'Friend') : (details.relation || ''),
          mode: 'fill_template'
        })
      });
      const raw = await res.text();
      let data;
      try { data = JSON.parse(raw); } catch { throw new Error(`AI service returned an invalid response (${res.status}). Please try again.`); }
      if (!res.ok) throw new Error(data.error || 'AI could not fill this template.');
      setDetails((current) => ({ ...current, ...(data.details || {}) }));
      if (!message && data.message) setMessage(data.message);
    } catch (e) {
      setError(e.message || 'AI could not fill this template.');
    } finally {
      setAiBusy(false);
    }
  };

  const advance = () => {
    setError('');
    if (step === 1 && !recipient.trim()) return setError('Add their name to continue.');
    if (step === 3 && !message.trim()) return setError('Write your message before continuing.');
    setStep((current) => current + 1);
  };

  const save = async () => {
    setBusy(true); setError('');
    try {
      let deviceId = localStorage.getItem('note_device_id');
      if (!deviceId) {
        deviceId = nanoid(32);
        localStorage.setItem('note_device_id', deviceId);
      }
      const id = nanoid(32);
      await setDoc(doc(db, 'notes', id), {
        creator_uid: deviceId,
        recipient_name: recipient.trim(),
        custom_message: message.trim(),
        voice_note_url: voiceNoteUrl || null,
        image_urls: images,
        shagun_qr_url: null,
        custom_details: {
          ...details,
          vibe,
          audio_preset: audioPreset,
          birthday_relation: template.id === 'birthday' ? (birthdayRelation || 'Friend') : undefined,
          passcode: enablePasscode && passcode.trim() ? passcode.trim() : null,
          secret_question: enablePasscode && secretQuestion.trim() ? secretQuestion.trim() : null,
        },
        is_paid: false,
        template: template.id,
        custom_slug: null,
        created_at: serverTimestamp(),
        expires_at: null
      });
      const ids = JSON.parse(localStorage.getItem('created_note_ids') || '[]');
      localStorage.setItem('created_note_ids', JSON.stringify([...ids, id]));
      router.push(`/preview?id=${id}`);
    } catch (e) {
      setError(e.message || 'Could not create this experience.');
      setBusy(false);
    }
  };

  return <main className="shell emotional-creator-shell"><div className="emotional-creator-wrap"><div className="emotional-creator-heading"><span>CLASSIC EXPERIENCE</span><h1>{template.icon} {template.title}</h1><p>Make the classic experience personal, then preview it before payment.</p></div><section className="glass-card emotional-creator-card"><div className="emotional-stepper">{[1,2,3,4].map((item) => <span key={item} className={step >= item ? 'is-active' : ''}>{item}</span>)}</div>
    {step === 1 && <><h2>Who is this for?</h2><div className="form-group"><label className="form-label">Their name</label><input className="form-input" value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="Maya, Mom, Bestie…" maxLength={80} /></div>{template.id === 'birthday' && (<div className="form-group"><label className="form-label">They are your…</label><div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.4rem' }}>{[{label:'Best Friend 🤗',value:'Best Friend'},{label:'Girlfriend 💖',value:'Girlfriend'},{label:'Boyfriend 💙',value:'Boyfriend'},{label:'Mom 🌸',value:'Mom'},{label:'Dad 👔',value:'Dad'},{label:'Brother 💪',value:'Brother'},{label:'Sister 💝',value:'Sister'},{label:'Husband 🥂',value:'Husband'},{label:'Wife 💍',value:'Wife'}].map(({label, value}) => (<button type="button" key={value} onClick={() => setBirthdayRelation(value)} style={{ padding: '0.5rem 0.9rem', borderRadius: '99px', border: '1.5px solid', borderColor: birthdayRelation === value ? '#be185d' : '#f3f4f6', background: birthdayRelation === value ? '#fff1f2' : '#fafafa', color: birthdayRelation === value ? '#be185d' : '#6b7280', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s' }}>{label}</button>))}</div></div>)}</>}
    {step === 2 && <><div className="ai-fill-card"><strong>✨ Fill this template with AI</strong><p>Give a few real details and AI will draft the available fields. You can edit everything.</p><textarea className="form-input" rows="3" value={aiContext} onChange={(e) => setAiContext(e.target.value)} placeholder="e.g. we met in college, she loves chai, 5 years of friendship…" /><button type="button" className="btn-secondary" disabled={aiBusy} onClick={fill}>{aiBusy ? 'Writing your experience…' : '✨ Fill template fields'}</button></div>{fieldList.length ? <div className="legacy-field-grid">{fieldList.map(([key,label]) => <div className="form-group" key={key}><label className="form-label">{label}</label><input className="form-input" type={key.includes('date') ? 'date' : 'text'} value={details[key] || ''} onChange={(e) => update(key, e.target.value)} maxLength={300} /></div>)}</div> : <p className="text-muted">This experience is ready for your personal message in the next step.</p>}</>}
    {step === 3 && <>
      <div className="form-group"><label className="form-label">What do you want to say?</label><textarea className="form-input" rows="5" value={message} onChange={(e) => setMessage(e.target.value)} maxLength={1500} placeholder="Write from the heart…" /></div>
      
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

      <div className="form-group"><label className="form-label">Choose your vibe</label><div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{vibes.map((item) => <button type="button" key={item} onClick={() => setVibe(item)} className={vibe === item ? 'legacy-vibe is-active' : 'legacy-vibe'}>{item}</button>)}</div></div>

      {/* Passcode Lock */}
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

      {/* Voice Note Recording */}
      <VoiceNoteRecorder
        onVoiceRecorded={(url) => setVoiceNoteUrl(url)}
        onVoiceRemoved={() => setVoiceNoteUrl('')}
        existingUrl={voiceNoteUrl}
      />

      <div className="form-group"><label className="form-label">Photos (optional, up to {template.photoRequirement?.max || 6})</label><CloudinaryUpload onUpload={(url) => setImages((current) => current.length < (template.photoRequirement?.max || 6) ? [...current, url] : current)} currentCount={images.length} maxPhotos={template.photoRequirement?.max || 6} /><div className="thumbs">{images.map((url, index) => <button type="button" key={url} onClick={() => setImages(images.filter((_, item) => item !== index))}><img src={url} alt="Selected memory" /></button>)}</div></div>
    </>}
    {step === 4 && <><h2>Ready for your private preview</h2><p className="text-muted">You will review the live experience with wax seal entrance, background music, and download options next.</p></>}
    {error && <p style={{ color: '#be123c', fontWeight: 700, marginTop: 16 }}>{error}</p>}
    <div className="emotional-creator-actions">{step > 1 && <button className="btn-secondary" onClick={() => setStep(step - 1)}>Back</button>}{step < 4 ? <button className="btn-primary" onClick={advance}>Continue</button> : <button className="btn-primary" disabled={busy} onClick={save}>{busy ? 'Creating…' : `Preview & payment · ₹${template.price}`}</button>}</div></section></div></main>;
}
