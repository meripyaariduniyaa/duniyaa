'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

function ShareButton() {
  const [copied, setCopied] = useState(false);
  const share = async () => {
    const payload = { title: 'A LovelyCrafts experience', url: window.location.href };
    try { if (navigator.share) await navigator.share(payload); else { await navigator.clipboard.writeText(payload.url); setCopied(true); } } catch {}
  };
  return <button className="btn-primary" onClick={share}>{copied ? 'Link copied' : 'Share this moment'}</button>;
}

function Photo({ src, alt }) { return src ? <img src={src} alt={alt} style={{ width: '100%', maxHeight: 300, objectFit: 'cover', borderRadius: 18, boxShadow: '0 18px 45px rgba(0,0,0,.18)' }} /> : null; }

export default function EmotionalExperience({ note }) {
  const [stage, setStage] = useState(0);
  const [opened, setOpened] = useState({});
  const d = note.custom_details || {};
  const template = note.template;
  const name = note.recipient_name || 'you';
  const photos = note.image_urls || [];
  const scenes = useMemo(() => buildScenes(template, d, note.custom_message, photos, name), [template, d, note.custom_message, photos, name]);
  const scene = scenes[stage];
  if (!scene) return null;
  return <section className="emotional-experience" style={{ borderRadius: 28, padding: 'clamp(1.5rem,5vw,3.5rem)', minHeight: 580, display: 'grid', placeItems: 'center', textAlign: 'center', overflow: 'hidden' }}>
    <div style={{ width: 'min(100%, 620px)' }}>
      {stage === 0 ? <><div style={{ fontSize: 48 }}>💌</div><p style={{ textTransform: 'uppercase', letterSpacing: '.14em', fontSize: 12, opacity: .75 }}>LovelyCrafts</p><h1 style={{ fontSize: 'clamp(2rem,8vw,3.5rem)', margin: '.25rem 0 1rem' }}>This was made for you, {name}.</h1><p style={{ fontSize: '1.1rem', opacity: .85 }}>Ready for a little moment?</p><button className="btn-primary" onClick={() => setStage(1)}>Open it</button></> : <>
        {scene.photo && <div style={{ marginBottom: '1.5rem' }}><Photo src={scene.photo} alt="A shared memory" /></div>}
        {scene.type === 'envelopes' ? <><p>{scene.eyebrow}</p><h2 style={{ fontSize: '2rem' }}>{scene.title}</h2><div style={{ display: 'grid', gap: 10, margin: '1.5rem 0' }}>{scene.items.map((item, i) => <button className="emotional-reveal-card" key={i} onClick={() => setOpened((x) => ({ ...x, [i]: !x[i] }))}>{opened[i] ? item.message : `✉️ Open when ${item.title}`}</button>)}</div></> : <><p style={{ textTransform: 'uppercase', letterSpacing: '.12em', fontSize: 12, opacity: .7 }}>{scene.eyebrow}</p><h2 style={{ fontSize: 'clamp(1.65rem,6vw,2.7rem)', margin: '.5rem 0 1rem', whiteSpace: 'pre-wrap' }}>{scene.title}</h2>{scene.body && <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.75, fontSize: '1.05rem' }}>{scene.body}</p>}{scene.cards && <div style={{ display: 'grid', gap: 10, marginTop: 20 }}>{scene.cards.map((card, i) => <button className="emotional-reveal-card" key={i} onClick={() => setOpened((x) => ({ ...x, [`${stage}-${i}`]: !x[`${stage}-${i}`] }))}>{opened[`${stage}-${i}`] ? card : 'Tap to reveal'}</button>)}</div>}</>}
        <div style={{ marginTop: 28, display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
          {stage < scenes.length - 1 ? <button className="btn-primary" onClick={() => setStage(stage + 1)}>Continue</button> : <>
            <ShareButton />
            <button className="emotional-secondary-action" onClick={() => { setStage(0); setOpened({}); }}>↻ Replay this moment</button>
            <Link className="emotional-create-action" href="/templates">♥ Create your own</Link>
          </>}
        </div>
      </>}
    </div>
  </section>;
}

function buildScenes(template, d, message, photos, name) {
  const end = { eyebrow: 'From someone who cares', title: d.final_message || message || 'You matter to me.', photo: photos.at(-1) };
  if (template === 'things-i-never-said') return [{ eyebrow: 'A little hesitation', title: "I've wanted to say this for a long time." }, { eyebrow: 'Things I never said', title: 'Tap each thought', cards: d.unsaid || [], photo: photos[0] }, { eyebrow: 'Do you remember this?', title: d.memory || 'A memory worth keeping.', photo: photos[1] }, end];
  if (template === 'i-miss-you') return [{ eyebrow: `${d.from_location || 'Here'} → ${d.to_location || 'There'}`, title: "Distance changes the map, not the feeling." }, { eyebrow: 'The little things', title: 'What I miss', cards: d.missed_things || [], photo: photos[0] }, { eyebrow: 'My favourite memory', title: d.favorite_memory || 'You are still part of my everyday life.', photo: photos[1] }, end];
  if (template === 'open-when') return [{ type: 'envelopes', eyebrow: "They're for different versions of you.", title: 'These are not ordinary letters.', items: d.envelopes || [] }, end];
  if (template === 'emotional-apology') return [{ eyebrow: 'A sincere beginning', title: d.what_happened || "I know I hurt you." }, { eyebrow: 'What I regret', title: 'Please tap through this.', cards: d.regrets || [] }, { eyebrow: 'What I promise', title: d.promise || 'I will do better.', photo: photos[0] }, { eyebrow: 'No pressure', title: 'Do you forgive me?', body: 'Whatever you need is okay. I will give you the time and space you deserve.' }, end];
  if (template === 'youre-my-person') return [{ eyebrow: 'Everyone has that one person.', title: 'You are mine.' }, { eyebrow: 'Five reasons', title: `Why you're my person, ${name}`, cards: d.reasons || [], photo: photos[0] }, { eyebrow: 'Our little world', title: d.inside_joke || 'Nobody else would understand this.', cards: d.memories || [], photo: photos[1] }, end];
  return [{ eyebrow: 'No occasion needed', title: "There's no special reason.", photo: photos[0] }, { eyebrow: 'Just because', title: `I wanted to remind you, ${name}…`, body: message || 'You are special to me.' }, end];
}
