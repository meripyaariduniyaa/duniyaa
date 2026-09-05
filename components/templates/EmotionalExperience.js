'use client';

import { useMemo, useState, useEffect, useRef } from 'react';
import Link from 'next/link';

function ShareButton() {
  const [copied, setCopied] = useState(false);
  const share = async () => {
    const payload = { title: 'A LovelyCrafts experience', url: window.location.href };
    try {
      if (navigator.share) await navigator.share(payload);
      else {
        await navigator.clipboard.writeText(payload.url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {}
  };
  return <button className="btn-primary" onClick={share}>{copied ? '✓ Link copied' : '📤 Share this moment'}</button>;
}

function Photo({ src, alt }) {
  return src ? (
    <div style={{ position: 'relative', margin: '0 auto 1.5rem', maxWidth: '420px' }}>
      <img
        src={src}
        alt={alt || 'A shared memory'}
        style={{ width: '100%', maxHeight: 320, objectFit: 'cover', borderRadius: 20, boxShadow: '0 20px 45px rgba(0,0,0,.15)', border: '4px solid #ffffff' }}
      />
    </div>
  ) : null;
}

// -------------------------------------------------------------
// MINI GAME 1: Catch the Floating Golden Hearts
// -------------------------------------------------------------
function HeartCatcherGame({ onComplete, name }) {
  const [caught, setCaught] = useState([]);
  const [hearts] = useState([
    { id: 1, x: 20, y: 30, size: 36, speed: 2.2, label: 'Joy' },
    { id: 2, x: 75, y: 25, size: 42, speed: 2.8, label: 'Smiles' },
    { id: 3, x: 45, y: 60, size: 38, speed: 2.5, label: 'Laughter' },
    { id: 4, x: 15, y: 75, size: 40, speed: 3.1, label: 'Warmth' },
    { id: 5, x: 80, y: 70, size: 35, speed: 2.4, label: 'Love' },
  ]);

  const handleCatch = (id) => {
    if (caught.includes(id)) return;
    const next = [...caught, id];
    setCaught(next);
    if (next.length === hearts.length) {
      onComplete?.();
    }
  };

  const isCompleted = caught.length === hearts.length;

  return (
    <div style={{ padding: '1rem', background: '#fff1f2', borderRadius: '24px', border: '2px dashed #f43f5e', position: 'relative', overflow: 'hidden', minHeight: '320px', margin: '1.5rem 0' }}>
      <div style={{ marginBottom: '1rem' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#be185d', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          🎮 MINI GAME
        </span>
        <h3 style={{ fontSize: '1.25rem', color: '#881337', margin: '4px 0 2px', fontWeight: 700 }}>
          Catch 5 Love Sparks for {name}
        </h3>
        <p style={{ fontSize: '0.85rem', color: '#9d174d', margin: 0 }}>
          Tap each floating heart to collect them ({caught.length}/5 collected)
        </p>
      </div>

      <div style={{ position: 'relative', height: '200px', width: '100%' }}>
        {hearts.map((h) => {
          const isCaught = caught.includes(h.id);
          return (
            <button
              key={h.id}
              type="button"
              onClick={() => handleCatch(h.id)}
              disabled={isCaught}
              style={{
                position: 'absolute',
                left: `${h.x}%`,
                top: `${h.y}%`,
                transform: `translate(-50%, -50%) scale(${isCaught ? 0 : 1})`,
                fontSize: `${h.size}px`,
                background: 'none',
                border: 'none',
                cursor: isCaught ? 'default' : 'pointer',
                opacity: isCaught ? 0 : 1,
                transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
                animation: isCaught ? 'none' : `floatingHeart ${h.speed}s ease-in-out infinite alternate`,
                filter: 'drop-shadow(0 4px 10px rgba(244,63,94,0.3))'
              }}
              aria-label={`Catch love spark: ${h.label}`}
            >
              💖
            </button>
          );
        })}

        {isCompleted && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', animation: 'sorryStepFadeIn 0.4s ease' }}>
            <span style={{ fontSize: '3rem', animation: 'heartPulse 1s infinite' }}>🎉✨</span>
            <p style={{ fontSize: '1.1rem', fontWeight: 800, color: '#15803d', margin: '4px 0' }}>
              All 5 Love Sparks Collected!
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes floatingHeart {
          0% { transform: translate(-50%, -50%) translateY(0px) rotate(0deg); }
          100% { transform: translate(-50%, -50%) translateY(-14px) rotate(12deg); }
        }
      `}</style>
    </div>
  );
}

// -------------------------------------------------------------
// MINI GAME 2: Distance Hug Generator Meter
// -------------------------------------------------------------
function HugMeterGame({ onComplete, fromLoc, toLoc }) {
  const [charge, setCharge] = useState(0);

  const handleTap = () => {
    if (charge >= 100) return;
    const next = Math.min(100, charge + 20);
    setCharge(next);
    if (next >= 100) {
      onComplete?.();
    }
  };

  return (
    <div style={{ padding: '1.25rem', background: '#f5f3ff', borderRadius: '24px', border: '2px dashed #8b5cf6', margin: '1.5rem 0' }}>
      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#6d28d9', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        🎮 MINI GAME
      </span>
      <h3 style={{ fontSize: '1.25rem', color: '#4c1d95', margin: '4px 0', fontWeight: 700 }}>
        Bridge the Distance: {fromLoc} ➔ {toLoc}
      </h3>
      <p style={{ fontSize: '0.85rem', color: '#6d28d9', margin: '0 0 1rem' }}>
        Rapidly tap the button to charge the Warm Hug Meter to 100%!
      </p>

      {/* Progress Bar */}
      <div style={{ width: '100%', height: '24px', background: '#ede9fe', borderRadius: '999px', overflow: 'hidden', padding: '3px', border: '1px solid #c4b5fd', marginBottom: '1.25rem', position: 'relative' }}>
        <div
          style={{
            height: '100%',
            width: `${charge}%`,
            background: 'linear-gradient(90deg, #ec4899, #8b5cf6)',
            borderRadius: '999px',
            transition: 'width 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}
        />
        <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800, color: charge > 50 ? '#fff' : '#5b21b6' }}>
          {charge}% HUG CHARGED
        </span>
      </div>

      {charge < 100 ? (
        <button
          type="button"
          onClick={handleTap}
          className="btn-primary"
          style={{ padding: '0.8rem 1.8rem', background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', borderColor: '#8b5cf6', fontSize: '1rem' }}
        >
          🫂 Tap to Send a Hug (+20%)
        </button>
      ) : (
        <div style={{ animation: 'sorryStepFadeIn 0.4s ease' }}>
          <p style={{ fontSize: '1.1rem', fontWeight: 800, color: '#16a34a', margin: '4px 0' }}>
            💖 Super Warm Hug Delivered Across the Miles!
          </p>
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// MINI GAME 3: Kintsugi Golden Heart Mender
// -------------------------------------------------------------
function MendHeartGame({ onComplete }) {
  const [pieces, setPieces] = useState([]);

  const handlePiece = (idx) => {
    if (pieces.includes(idx)) return;
    const next = [...pieces, idx];
    setPieces(next);
    if (next.length === 3) {
      onComplete?.();
    }
  };

  const isMended = pieces.length === 3;

  return (
    <div style={{ padding: '1.25rem', background: '#fffbeb', borderRadius: '24px', border: '2px dashed #f59e0b', margin: '1.5rem 0' }}>
      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        🎮 MINI GAME
      </span>
      <h3 style={{ fontSize: '1.25rem', color: '#78350f', margin: '4px 0', fontWeight: 700 }}>
        Mend the Golden Heart ✨
      </h3>
      <p style={{ fontSize: '0.85rem', color: '#92400e', margin: '0 0 1rem' }}>
        Tap all 3 golden kintsugi seals to weld our bond stronger than before:
      </p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {['Piece #1: Deep Understanding', 'Piece #2: Genuine Promise', 'Piece #3: Forever Care'].map((label, idx) => {
          const isDone = pieces.includes(idx);
          return (
            <button
              key={idx}
              type="button"
              onClick={() => handlePiece(idx)}
              style={{
                padding: '10px 16px',
                borderRadius: '14px',
                border: '2px solid',
                borderColor: isDone ? '#10b981' : '#f59e0b',
                background: isDone ? '#dcfce7' : '#ffffff',
                color: isDone ? '#166534' : '#92400e',
                fontWeight: 700,
                fontSize: '12px',
                cursor: isDone ? 'default' : 'pointer',
                boxShadow: '0 4px 10px rgba(0,0,0,0.04)',
                transition: 'all 0.2s ease'
              }}
            >
              {isDone ? `✓ ${label}` : `✦ Weld ${label}`}
            </button>
          );
        })}
      </div>

      {isMended && (
        <div style={{ animation: 'sorryStepFadeIn 0.4s ease' }}>
          <p style={{ fontSize: '1.05rem', fontWeight: 800, color: '#15803d', margin: 0 }}>
            💛 Heart Mended with Golden Kintsugi &amp; Love!
          </p>
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// MAIN EMOTIONAL EXPERIENCE COMPONENT
// -------------------------------------------------------------
export default function EmotionalExperience({ note, isPreview = false }) {
  const [stage, setStage] = useState(0);
  const [opened, setOpened] = useState({});
  const [miniGameDone, setMiniGameDone] = useState(false);

  const d = note?.custom_details || {};
  const template = note?.template;
  const name = note?.recipient_name || 'you';
  const photos = Array.isArray(note?.image_urls) ? note.image_urls.filter(Boolean) : [];
  const scenes = useMemo(() => buildScenes(template, d, note?.custom_message, photos, name), [template, d, note?.custom_message, photos, name]);
  const scene = scenes[stage];

  useEffect(() => {
    setMiniGameDone(false);
  }, [stage]);

  if (!scene) return null;

  return (
    <section className="emotional-experience" style={{ borderRadius: 28, padding: 'clamp(1.5rem,5vw,3.5rem)', minHeight: 600, display: 'grid', placeItems: 'center', textAlign: 'center', overflow: 'hidden' }}>
      <div style={{ width: 'min(100%, 640px)' }}>
        
        {/* Progress Dots Indicator */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginBottom: '1.5rem' }}>
          {scenes.map((_, i) => (
            <span
              key={i}
              style={{
                width: stage === i ? '24px' : '8px',
                height: '8px',
                borderRadius: '999px',
                background: stage === i ? '#be185d' : 'rgba(190, 24, 93, 0.2)',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>

        {stage === 0 ? (
          <div style={{ animation: 'sorryStepFadeIn 0.5s ease' }}>
            <div style={{ fontSize: 52, marginBottom: '0.5rem' }}>{scene.icon || '💌'}</div>
            <p style={{ textTransform: 'uppercase', letterSpacing: '.18em', fontSize: 12, fontWeight: 700, color: 'var(--vibe-button, #be185d)', marginBottom: '0.5rem' }}>
              LovelyCrafts Experience
            </p>
            <h1 style={{ fontSize: 'clamp(2rem,8vw,3.3rem)', margin: '.25rem 0 1rem', color: 'var(--vibe-text, #1f2937)', fontWeight: 800 }}>
              {scene.title || `This was made for you, ${name}.`}
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--vibe-muted, #4b5563)', maxWidth: '480px', margin: '0 auto 2rem', lineHeight: 1.6 }}>
              {scene.subtitle || 'Ready for a journey made especially for you?'}
            </p>
            <button className="btn-primary" style={{ padding: '0.9rem 2.4rem', fontSize: '1.05rem' }} onClick={() => setStage(1)}>
              ✨ Begin Experience
            </button>
          </div>
        ) : (
          <div style={{ animation: 'sorryStepFadeIn 0.4s ease' }}>
            {scene.photo && <Photo src={scene.photo} alt="A shared memory" />}

            {/* MINI GAME SCENE HANDLERS */}
            {scene.type === 'game-hearts' && (
              <HeartCatcherGame name={name} onComplete={() => setMiniGameDone(true)} />
            )}

            {scene.type === 'game-hug-meter' && (
              <HugMeterGame fromLoc={d.from_location || 'Here'} toLoc={d.to_location || 'There'} onComplete={() => setMiniGameDone(true)} />
            )}

            {scene.type === 'game-mend-heart' && (
              <MendHeartGame onComplete={() => setMiniGameDone(true)} />
            )}

            {scene.type === 'envelopes' ? (
              <>
                <p style={{ textTransform: 'uppercase', letterSpacing: '.14em', fontSize: 12, fontWeight: 700, color: 'var(--vibe-button, #be185d)' }}>{scene.eyebrow}</p>
                <h2 style={{ fontSize: 'clamp(1.75rem,6vw,2.5rem)', margin: '0.35rem 0 1.25rem', color: 'var(--vibe-text, #111827)', fontWeight: 800 }}>{scene.title}</h2>
                <div style={{ display: 'grid', gap: 12, margin: '1.5rem 0' }}>
                  {scene.items.map((item, i) => (
                    <button
                      className="emotional-reveal-card"
                      key={i}
                      onClick={() => setOpened((x) => ({ ...x, [i]: !x[i] }))}
                      style={{ padding: '16px 20px', borderRadius: 16, border: '1.5px solid #fbcfe8', background: opened[i] ? '#fff1f2' : '#ffffff', textAlign: 'left', cursor: 'pointer', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}
                    >
                      <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#be185d', textTransform: 'uppercase', marginBottom: '4px' }}>
                        ✉️ Open when {item.title}
                      </div>
                      <div style={{ fontSize: '0.95rem', color: '#374151', fontStyle: opened[i] ? 'normal' : 'italic' }}>
                        {opened[i] ? item.message : 'Tap to unfold this letter…'}
                      </div>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                {scene.eyebrow && <p style={{ textTransform: 'uppercase', letterSpacing: '.14em', fontSize: 12, fontWeight: 700, color: 'var(--vibe-button, #be185d)', marginBottom: '0.4rem' }}>{scene.eyebrow}</p>}
                {scene.title && <h2 style={{ fontSize: 'clamp(1.65rem,6vw,2.6rem)', margin: '.25rem 0 1rem', color: 'var(--vibe-text, #111827)', fontWeight: 800, whiteSpace: 'pre-wrap', lineHeight: 1.25 }}>{scene.title}</h2>}
                {scene.body && <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.8, fontSize: '1.05rem', color: 'var(--vibe-muted, #374151)', margin: '0 auto 1.5rem', maxWidth: '540px' }}>{scene.body}</p>}
                {scene.cards && (
                  <div style={{ display: 'grid', gap: 12, marginTop: 20 }}>
                    {scene.cards.map((card, i) => {
                      const isRevealed = opened[`${stage}-${i}`];
                      return (
                        <button
                          className="emotional-reveal-card"
                          key={i}
                          onClick={() => setOpened((x) => ({ ...x, [`${stage}-${i}`]: !x[`${stage}-${i}`] }))}
                          style={{
                            padding: '16px 20px',
                            borderRadius: '16px',
                            border: '1.5px solid',
                            borderColor: isRevealed ? '#f43f5e' : '#fecdd3',
                            background: isRevealed ? '#fff1f2' : '#ffffff',
                            textAlign: 'left',
                            cursor: 'pointer',
                            boxShadow: isRevealed ? '0 8px 20px rgba(244, 63, 94, 0.12)' : '0 2px 8px rgba(0,0,0,0.03)',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#be185d', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                              #{i + 1}
                            </span>
                            <span style={{ fontSize: '0.75rem', color: isRevealed ? '#be185d' : '#9ca3af', fontWeight: 700 }}>
                              {isRevealed ? '✓ REVEALED' : 'TAP TO REVEAL'}
                            </span>
                          </div>
                          <p style={{ fontSize: '0.98rem', color: '#1f2937', margin: 0, fontWeight: isRevealed ? 600 : 400, fontStyle: isRevealed ? 'normal' : 'italic' }}>
                            {isRevealed ? card : 'Tap to reveal secret thought…'}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                )}
              </>
            )}

            <div style={{ marginTop: 32, display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
              {stage > 1 && (
                <button className="btn-secondary" onClick={() => setStage(stage - 1)} style={{ padding: '0.8rem 1.5rem' }}>
                  ← Back
                </button>
              )}
              {stage < scenes.length - 1 ? (
                <button
                  className="btn-primary"
                  onClick={() => setStage(stage + 1)}
                  style={{
                    padding: '0.8rem 2rem',
                    animation: (scene.type?.startsWith('game-') && miniGameDone) ? 'gentlePulse 1.5s infinite' : 'none'
                  }}
                >
                  Continue →
                </button>
              ) : (
                <>
                  <ShareButton />
                  <button className="emotional-secondary-action" onClick={() => { setStage(0); setOpened({}); }}>↻ Replay this moment</button>
                  <Link className="emotional-create-action" href="/templates">♥ Create your own</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function buildScenes(template, d, message, photos, name) {
  const fallbackMessage = message || 'You mean the absolute world to me. Thank you for being in my life.';
  const end = {
    eyebrow: 'Forever & Always',
    title: d.final_message || fallbackMessage,
    body: 'From someone who cherishes every second with you.',
    photo: photos.at(-1) || photos[0]
  };

  // 1. THINGS I NEVER SAID (6 Slides with Heart Catcher Mini Game)
  if (template === 'things-i-never-said') {
    return [
      { icon: '💌', title: `For ${name}`, subtitle: "I have held these words back for a long time. Today, I'm letting you in." },
      { eyebrow: 'A quiet hesitation', title: "I used to keep this inside.", body: "Sometimes life moves too fast to say what truly matters. So I wrote them down for you.", photo: photos[0] },
      { eyebrow: 'Words I held back', title: 'Tap each truth below', cards: (d.unsaid && d.unsaid.filter(Boolean).length > 0) ? d.unsaid : ['I admire your quiet strength more than you know.', 'I feel most at peace when I talk to you.', 'You changed my life without even trying.'] },
      { type: 'game-hearts' },
      { eyebrow: 'Do you remember this?', title: d.memory || 'A memory worth keeping forever.', body: 'Every detail of this moment is engraved in my heart.', photo: photos[1] || photos[0] },
      end
    ];
  }

  // 2. I MISS YOU (6 Slides with Distance Hug Meter Mini Game)
  if (template === 'i-miss-you') {
    const fromLoc = d.from_location || 'Here';
    const toLoc = d.to_location || 'There';
    return [
      { icon: '🫂', title: `Missing You, ${name}`, subtitle: `${fromLoc} ➔ ${toLoc}` },
      { eyebrow: `${fromLoc} ➔ ${toLoc}`, title: "Distance changes the map, not the feeling.", body: "No matter how many miles lie between us, you are the first thought in my morning and the last at night.", photo: photos[0] },
      { eyebrow: 'The little things', title: '5 things I miss the most', cards: (d.missed_things && d.missed_things.filter(Boolean).length > 0) ? d.missed_things : ['Your spontaneous laugh', 'Sharing random everyday moments with you', 'The comfort of having you right next to me', 'Our late-night chats that never end', 'Just knowing you are around'] },
      { type: 'game-hug-meter' },
      { eyebrow: 'My favourite memory', title: d.favorite_memory || 'The day we laughed until our stomachs hurt.', body: 'Distance is just a test to see how far love can travel.', photo: photos[1] || photos[0] },
      end
    ];
  }

  // 3. OPEN WHEN… (5 Slides)
  if (template === 'open-when') {
    const envelopes = (d.envelopes && d.envelopes.length > 0) ? d.envelopes : [
      { title: 'you need a smile 😊', message: 'Remember that you are loved beyond words and your smile brightens everything.' },
      { title: 'you miss me 🫂', message: 'Close your eyes and take a deep breath. I am always with you in spirit.' },
      { title: 'you feel alone 🌙', message: 'You never have to carry the world alone. I am just a call or a thought away.' },
      { title: 'you need courage 🦁', message: 'You are so much stronger than any temporary storm. I believe in you completely.' }
    ];
    return [
      { icon: '✉️', title: `Letters For ${name}`, subtitle: "These are not ordinary letters. They are for different versions of you." },
      { type: 'envelopes', eyebrow: "Your personal letter drawer", title: 'Open When…', items: envelopes },
      { type: 'game-hearts' },
      { eyebrow: 'A picture for the rainy days', title: 'A memory of warmth', body: 'Whenever you look at this, remember how bright our bond is.', photo: photos[0] },
      end
    ];
  }

  // 4. EMOTIONAL APOLOGY (6 Slides with Mend Heart Mini Game)
  if (template === 'emotional-apology') {
    return [
      { icon: '🥺', title: `A Sincere Note For ${name}`, subtitle: "I want to apologize from the deepest part of my heart." },
      { eyebrow: 'A sincere beginning', title: d.what_happened || "I know I hurt you, and I am truly sorry.", body: "I value you too much to ever pretend things are okay when I let you down.", photo: photos[0] },
      { eyebrow: 'What I regret', title: 'Please tap through these truths', cards: (d.regrets && d.regrets.filter(Boolean).length > 0) ? d.regrets : ['Letting my emotions get the better of me.', 'Making you feel unheard or upset.', 'Not realizing how deeply my actions affected you.'] },
      { type: 'game-mend-heart' },
      { eyebrow: 'What I promise for us', title: d.promise || 'I promise to listen with an open heart and do better.', body: 'Rebuilding your trust is my highest priority.', photo: photos[1] || photos[0] },
      end
    ];
  }

  // 5. YOU'RE MY PERSON (6 Slides with Heart Catcher Mini Game)
  if (template === 'youre-my-person') {
    return [
      { icon: '❤️', title: `For ${name}`, subtitle: "Everyone has that one person. You are mine." },
      { eyebrow: 'My comfort person', title: `Why you're my person, ${name}`, cards: (d.reasons && d.reasons.filter(Boolean).length > 0) ? d.reasons : ['You know me better than anyone else.', 'You make the ordinary moments feel extraordinary.', 'You are my safe space when life gets loud.', 'You make me laugh like nobody else can.', 'You accept me exactly as I am.'] },
      { type: 'game-hearts' },
      { eyebrow: 'Our little world', title: d.inside_joke || 'Nobody else would understand our jokes.', body: 'Our memories are my favorite place to visit.', photo: photos[0] },
      end
    ];
  }

  // 6. JUST BECAUSE (6 Slides with Heart Catcher Mini Game)
  return [
    { icon: '✨', title: `A Little Surprise, ${name}`, subtitle: "There is no special occasion. I just wanted to remind you." },
    { eyebrow: 'No reason needed', title: "Just because you are you.", body: d.small_detail || "I woke up today thinking about how grateful I am to have you in my corner.", photo: photos[0] },
    { type: 'game-hearts' },
    { eyebrow: 'The little things', title: 'Why you make the world brighter', cards: ['Your genuine kindness that touches everyone.', 'The way your presence instantly calms everything.', 'All the quiet, unnoticed things you do.'] },
    end
  ];
}
