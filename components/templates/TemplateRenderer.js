'use client';

import React, { useState, useEffect, useRef } from 'react';
import BirthdayExperience from './BirthdayExperience';
import EmotionalExperience from './EmotionalExperience';

export default function TemplateRenderer({ note, isPreview = false }) {
  if (!note) return null;

  const templateId = note.template || 'default';
  const vibe = note?.custom_details?.vibe || 'soft';
  let experience;

  switch (templateId) {
    case 'just-because':
    case 'things-i-never-said':
    case 'i-miss-you':
    case 'open-when':
    case 'emotional-apology':
    case 'youre-my-person':
      experience = <EmotionalExperience note={note} isPreview={isPreview} />; break;
    case 'sorry':
    case 'apology':
      experience = <InteractiveApologyFlowTemplate note={note} isPreview={isPreview} />; break;
    case 'birthday':
    case 'birthday-surprise':
      experience = <BirthdayExperience note={note} isPreview={isPreview} />; break;
    case 'anniversary':
    case 'love-letter':
      experience = <LoveLetterTemplate note={note} isPreview={isPreview} />; break;
    case 'mothers-day':
    case 'letter-for-mom':
      experience = <LetterForMomTemplate note={note} isPreview={isPreview} />; break;
    case 'proposal':
    case 'be-my-valentine':
      experience = <BeMyValentineTemplate note={note} isPreview={isPreview} />; break;
    case 'puzzle':
      // Basic placeholder for now, ideally an interactive puzzle component
      experience = <PuzzleTemplate note={note} isPreview={isPreview} />; break;
    case 'friendship':
      // Basic placeholder for now, ideally a friendship experience component
      experience = <FriendshipTemplate note={note} isPreview={isPreview} />; break;
    case 'wedding-invitation':
      experience = <WeddingInvitationTemplate note={note} isPreview={isPreview} />; break;
    case 'surprise-reveal-box':
      experience = <SurpriseRevealBoxTemplate note={note} isPreview={isPreview} />; break;
    case 'a-rose-for-someone-special':
      experience = <RoseSpecialTemplate note={note} isPreview={isPreview} />; break;
    case 'rakshabandhan':
      experience = <RakshabandhanTemplate note={note} isPreview={isPreview} />; break;
    default:
      experience = <InteractiveApologyFlowTemplate note={note} isPreview={isPreview} />;
  }
  return <div className={`experience-vibe experience-vibe--${vibe}`}>
    {!isPreview && <ImmersiveAtmosphere vibe={vibe} />}
    {experience}
  </div>;
}

function ImmersiveAtmosphere({ vibe }) {
  const [celebrating, setCelebrating] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setCelebrating(false), 5200);
    return () => clearTimeout(timer);
  }, []);
  const symbols = vibe === 'playful' ? ['✦', '●', '✿', '★'] : vibe === 'deep' ? ['✦', '·', '✧', '⋆'] : ['♥', '✦', '✧', '❋'];
  return <div className="immersive-atmosphere" aria-hidden="true">
    <div className="immersive-vignette" />
    <div className="immersive-glow immersive-glow--one" />
    <div className="immersive-glow immersive-glow--two" />
    {Array.from({ length: 20 }, (_, index) => <span className="immersive-spark" key={index} style={{ '--spark-left': `${(index * 37) % 101}%`, '--spark-top': `${(index * 61) % 92}%`, '--spark-delay': `${(index % 7) * .45}s`, '--spark-size': `${8 + (index % 4) * 4}px` }}>{symbols[index % symbols.length]}</span>)}
    {celebrating && <div className="immersive-confetti">{Array.from({ length: 42 }, (_, index) => <i key={index} style={{ '--confetti-left': `${(index * 29) % 100}%`, '--confetti-delay': `${(index % 11) * .09}s`, '--confetti-rotate': `${(index * 47) % 360}deg`, '--confetti-color': ['#fb7185', '#fbbf24', '#a78bfa', '#38bdf8', '#f9a8d4'][index % 5] }} />)}</div>}
  </div>;
}

/* ==========================================================================
   CONFETTI CANNON PARTICLE COMPONENT
   ========================================================================== */
function ConfettiCannon({ active = false, duration = 3500, heartOnly = false }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (active) {
      const colors = ['#ff4b8b', '#ffd700', '#38bdf8', '#a855f7', '#34d399', '#ff758c', '#fb923c'];
      const shapes = heartOnly ? ['💖', '💕', '❤️', '🌸', '✨'] : ['🎉', '✨', '💖', '⭐', '🎈', '🍬'];
      const newParticles = Array.from({ length: 45 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        animDuration: 2 + Math.random() * 2,
        delay: Math.random() * 0.5,
        size: 14 + Math.random() * 16,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        rotate: Math.random() * 360,
      }));
      setParticles(newParticles);

      const timer = setTimeout(() => {
        setParticles([]);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [active, duration, heartOnly]);

  if (!particles.length) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' }}>
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            top: '-20px',
            left: `${p.left}%`,
            fontSize: `${p.size}px`,
            color: p.color,
            animation: `confettiFall ${p.animDuration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${p.delay}s forwards`,
            transform: `rotate(${p.rotate}deg)`,
          }}
        >
          {p.shape}
        </div>
      ))}
    </div>
  );
}

/* ==========================================================================
   1. INTERACTIVE ROMANTIC APOLOGY TEMPLATE (ID: sorry)
   ========================================================================== */
function InteractiveApologyFlowTemplate({ note, isPreview = false }) {
  const [step, setStep] = useState(1);
  const [vibe, setVibe] = useState('cute'); // 'cute', 'romantic', 'sincere'
  const [cutenessCount, setCutenessCount] = useState(0);
  const [revealedCards, setRevealedCards] = useState([false, false, false]);
  const [topIndex, setTopIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [forgiven, setForgiven] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Audio Music state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioRef = useRef(null);

  const recipient = note?.recipient_name || 'Cutie';
  const defaultApologyMessage = note?.custom_message || "I know I messed up and said things out of anger. I am truly sorry from the bottom of my heart. You mean everything to me, and I promise to do so much better for us. Please forgive me? 💕";

  const defaultPhotos = [
    { url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800&auto=format&fit=crop', caption: "I'm so sorry 🥺" },
    { url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=800&auto=format&fit=crop', caption: "Please forgive me 💕" },
    { url: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=800&auto=format&fit=crop', caption: "You mean the world 💖" }
  ];

  const photos = (note?.image_urls && note.image_urls.length > 0)
    ? note.image_urls.map((u, i) => ({
        url: u,
        caption: i === 0 ? "I'm so sorry 🥺" : i === 1 ? "Please forgive me 💕" : "Our sweet moment 💖"
      }))
    : defaultPhotos;

  const promiseList = [
    note?.custom_details?.promise_1 || "I promise to always listen and never let anger win.",
    note?.custom_details?.promise_2 || "I promise to give you extra hugs and make your smile my #1 priority.",
    note?.custom_details?.promise_3 || "I promise to cherish you every single day and never take you for granted."
  ];

  // Auto fill cuteness meter in Step 2
  useEffect(() => {
    let timer;
    if (step === 2) {
      setCutenessCount(20);
      timer = setInterval(() => {
        setCutenessCount((prev) => {
          if (prev >= 120) {
            clearInterval(timer);
            return 120;
          }
          return prev + 2;
        });
      }, 40);
    }
    return () => clearInterval(timer);
  }, [step]);

  // Typewriter effect in Step 5
  useEffect(() => {
    if (step === 5) {
      setTypedText('');
      let index = 0;
      const typeTimer = setInterval(() => {
        if (index < defaultApologyMessage.length) {
          setTypedText((prev) => prev + defaultApologyMessage.charAt(index));
          index++;
        } else {
          clearInterval(typeTimer);
        }
      }, 35);
      return () => clearInterval(typeTimer);
    }
  }, [step, defaultApologyMessage]);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.play().then(() => setIsPlayingAudio(true)).catch(() => {});
    }
  };

  const toggleRevealCard = (idx) => {
    setRevealedCards((prev) => {
      const next = [...prev];
      next[idx] = true;
      return next;
    });
  };

  const triggerForgive = () => {
    setForgiven(true);
    setShowConfetti(true);
  };

  return (
    <div className={`sorry-flow-container vibe-${vibe}`}>
      <ConfettiCannon active={showConfetti} heartOnly={true} />
      <div className="sorry-flow-sparkles" />

      {/* Floating Audio Toggle */}
      <button className="sorry-flow-music-toggle" onClick={toggleMusic}>
        {isPlayingAudio ? '🎵 Music: ON 🔊' : '🎵 Music: OFF 🔇'}
      </button>
      <audio
        ref={audioRef}
        loop
        src="https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-acoustic-guitar-113264.mp3"
      />

      {/* Step Progress Dots */}
      <div className="step-progress-dots">
        {[1, 2, 3, 4, 5].map((s) => (
          <span key={s} className={`dot ${step === s ? 'active' : step > s ? 'completed' : ''}`}>
            {s === 1 ? '👋' : s === 2 ? '❤️' : s === 3 ? '📜' : s === 4 ? '📸' : '💌'}
          </span>
        ))}
      </div>

      {/* STEP 1: Landing & Vibe Selector */}
      {step === 1 && (
        <div className="sorry-flow-step">
          <div className="sorry-flow-sticker">
            <span style={{ fontSize: '4.5rem' }}>🥺</span>
          </div>
          <h1 className="sorry-flow-title">Hey {recipient}, my love</h1>
          <p className="sorry-flow-subtitle">I built a 5-step interactive apology journey just for you.</p>

          <div className="vibe-selector-group">
            <p style={{ fontSize: '0.8rem', color: '#fbcfe8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Choose Apology Vibe:
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '0.5rem', flexWrap: 'wrap' }}>
              {[
                { id: 'cute', label: '😜 Cute & Playful' },
                { id: 'romantic', label: '🌹 Deep Romantic' },
                { id: 'sincere', label: '🕊️ Pure & Sincere' }
              ].map((v) => (
                <button
                  key={v.id}
                  className={`vibe-chip ${vibe === v.id ? 'active' : ''}`}
                  onClick={() => setVibe(v.id)}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          <button className="sorry-flow-btn-glowing" onClick={() => setStep(2)} style={{ marginTop: '1.5rem' }}>
            Start Apology Journey ➔
          </button>
        </div>
      )}

      {/* STEP 2: Cuteness & Sincerity Gauge */}
      {step === 2 && (
        <div className="sorry-flow-step">
          <h2 style={{ fontSize: '1.5rem', color: '#fbcfe8', fontWeight: 700 }}>
            Measuring Your Cuteness & My Sincerity 💖
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#ffd1dc', margin: '0.5rem 0 1rem' }}>
            Tap the heart gauge to boost sincerity meter!
          </p>

          <div className="heart-gauge-box" onClick={() => setCutenessCount((c) => Math.min(120, c + 15))}>
            <div className="heart-gauge-svg-wrapper">
              <svg viewBox="0 0 100 100" width="120" height="120">
                <path d="M50 88 C20 65 5 40 18 20 C30 5 45 15 50 25 C55 15 70 5 82 20 C95 40 80 65 50 88 Z" fill="rgba(255, 255, 255, 0.15)" stroke="#ff4b8b" strokeWidth="4" />
                <path
                  d="M50 88 C20 65 5 40 18 20 C30 5 45 15 50 25 C55 15 70 5 82 20 C95 40 80 65 50 88 Z"
                  fill="url(#heartGradient)"
                  style={{
                    clipPath: `polygon(0 ${100 - Math.min(100, cutenessCount)}%, 100% ${100 - Math.min(100, cutenessCount)}%, 100% 100%, 0 100%)`,
                    transition: 'clip-path 0.3s ease'
                  }}
                />
                <defs>
                  <linearGradient id="heartGradient" x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0%" stopColor="#ff4b8b" />
                    <stop offset="100%" stopColor="#ff758c" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="heart-gauge-percent">{cutenessCount}%</div>
            </div>

            {cutenessCount >= 100 && (
              <div className="cuteness-warning-badge pulse-anim">
                🚨 1000% SINCERE & OVERFLOWING WITH LOVE
              </div>
            )}
          </div>

          <button className="sorry-flow-btn-glowing" onClick={() => setStep(3)}>
            Unlock Promise Cards ➔
          </button>
        </div>
      )}

      {/* STEP 3: Tap-to-Reveal Promise Cards */}
      {step === 3 && (
        <div className="sorry-flow-step">
          <h2 style={{ fontSize: '1.5rem', color: '#fff', fontWeight: 700, marginBottom: '0.25rem' }}>
            My Promises to You 📜
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#fbcfe8', marginBottom: '1.25rem' }}>
            Tap each card to reveal my heartfelt vows
          </p>

          <div className="tap-cards-grid">
            {promiseList.map((text, idx) => (
              <button
                key={idx}
                className={`tap-card-btn ${revealedCards[idx] ? 'revealed' : ''}`}
                onClick={() => toggleRevealCard(idx)}
              >
                <div className="tap-card-icon">
                  {revealedCards[idx] ? '💖' : '🔒'}
                </div>
                <div className="tap-card-text">
                  {revealedCards[idx] ? text : `Tap to reveal Promise #${idx + 1}`}
                </div>
              </button>
            ))}
          </div>

          <button className="sorry-flow-btn-glowing" onClick={() => setStep(4)} style={{ marginTop: '1rem' }}>
            Swipe Our Memories ➔
          </button>
        </div>
      )}

      {/* STEP 4: Photo Memory Stack Reel */}
      {step === 4 && (
        <div className="sorry-flow-step">
          <h2 style={{ fontSize: '1.5rem', color: '#fff', fontWeight: 700, margin: 0 }}>
            Our Cherished Moments 📸
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#fbcfe8', margin: '0.25rem 0 1rem' }}>
            (Tap card stack to flip through memories)
          </p>

          <div className="polaroid-deck-container" onClick={() => setTopIndex((prev) => (prev + 1) % photos.length)}>
            {photos.map((item, idx) => {
              const offset = (idx - topIndex + photos.length) % photos.length;
              const isTop = offset === 0;
              const rotDeg = isTop ? 0 : offset % 2 === 0 ? 6 : -6;
              const scaleVal = 1 - offset * 0.05;
              const translateYVal = offset * 12;

              return (
                <div
                  key={idx}
                  className="polaroid-card"
                  style={{
                    zIndex: photos.length - offset,
                    transform: `translateY(${translateYVal}px) rotate(${rotDeg}deg) scale(${scaleVal})`,
                    opacity: offset > 2 ? 0 : 1,
                    pointerEvents: isTop ? 'auto' : 'none'
                  }}
                >
                  <img src={item.url} alt={`Memory ${idx + 1}`} />
                  <div className="polaroid-caption">{item.caption}</div>
                </div>
              );
            })}
          </div>

          <button className="sorry-flow-btn-glowing" onClick={() => setStep(5)} style={{ marginTop: '1.5rem' }}>
            Read Final Apology Note ➔
          </button>
        </div>
      )}

      {/* STEP 5: Self-Typing Typewriter Note */}
      {step === 5 && (
        <div className="sorry-flow-step">
          <div className="sorry-flow-sticker" style={{ width: '80px', height: '80px', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '3.5rem' }}>💌</span>
          </div>
          <h2 className="sorry-flow-title" style={{ fontSize: '1.8rem' }}>
            From My Heart To Yours ✨
          </h2>

          <div className="typewriter-card-box">
            <div className="typewriter-content">
              {typedText}
              <span className="blinking-cursor" />
            </div>
          </div>

          {!forgiven ? (
            <button
              className="sorry-flow-btn-glowing forgive-confetti-btn"
              onClick={triggerForgive}
              style={{ marginTop: '1.5rem' }}
            >
              Forgive Me 💕
            </button>
          ) : (
            <div style={{ animation: 'sorryStepFadeIn 0.5s ease-out', marginTop: '1.5rem' }}>
              <p style={{ fontSize: '1.5rem', color: '#34d399', fontWeight: 800, textShadow: '0 0 15px rgba(52, 211, 153, 0.8)' }}>
                Thank you so much baby! I love you! ❤️🥰
              </p>
              <p style={{ fontSize: '0.9rem', color: '#fbcfe8', marginTop: '0.5rem' }}>
                Forever & always yours. ✨
              </p>
            </div>
          )}
        </div>
      )}
      {forgiven && <ReplayAndMarketingFooter onReplay={() => { setStep(1); setForgiven(false); setShowConfetti(false); setVibe('cute'); }} isPreview={isPreview} />}
    </div>
  );
}

function LoveLetterTemplate({ note, isPreview = false }) {
  const [stage, setStage] = useState(1); // 1=love meter, 2=pinky promise, 3=candle, 4=letter
  const [loveMeter, setLoveMeter] = useState(0);
  const [pinkyLinked, setPinkyLinked] = useState(false);
  const [candleBlown, setCandleBlown] = useState(false);
  const [typedLines, setTypedLines] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  const recipient = note?.recipient_name || 'My Love';
  const customMsg = note?.custom_message || "I cherish every single moment with you. You bring warmth, beauty, and joy to my world. Thank you for being you and filling my life with endless happiness. Yours always ❤️";
  const specialDate = note?.custom_details?.special_date || '';

  const promises = [
    note?.custom_details?.promise_1 || "I promise to always choose you, every single day.",
    note?.custom_details?.promise_2 || "I promise to be your safe place, always.",
    note?.custom_details?.promise_3 || "I promise to make you smile even on your hardest days.",
    note?.custom_details?.promise_4 || "I promise to grow with you, not apart.",
    note?.custom_details?.promise_5 || "I promise to love you more tomorrow than today.",
  ];

  // Love meter — fill on click
  const boostMeter = () => {
    setLoveMeter(prev => {
      const next = Math.min(100, prev + 14);
      if (next >= 100) setTimeout(() => setStage(2), 500);
      return next;
    });
  };

  // Typewriter for stage 4
  useEffect(() => {
    if (stage === 4) {
      setTypedLines('');
      let i = 0;
      const t = setInterval(() => {
        if (i < customMsg.length) { setTypedLines(prev => prev + customMsg.charAt(i)); i++; }
        else clearInterval(t);
      }, 35);
      return () => clearInterval(t);
    }
  }, [stage, customMsg]);

  const stageLabels = ['', '❤️ Love Meter', '🤝 Pinky Promise', '🕯️ Anniversary Wish', '💌 Letter & Promises'];

  return (
    <div style={{ background: 'linear-gradient(135deg, #1a0020, #3b0f1b)', borderRadius: '24px', padding: '2rem 1.5rem', maxWidth: '600px', margin: '0 auto', textAlign: 'center', minHeight: '520px', color: '#fff', position: 'relative', overflow: 'hidden' }}>
      <ConfettiCannon active={showConfetti} heartOnly={true} duration={4000} />

      {/* Floating petals background */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {['🌸', '✨', '🌺', '💕'].map((p, i) => (
          <span key={i} style={{ position: 'absolute', fontSize: '1.2rem', opacity: 0.18, top: `${20 + i * 20}%`, left: `${10 + i * 22}%`, animation: `floatUp ${3 + i}s ease-in-out infinite alternate` }}>{p}</span>
        ))}
      </div>

      {/* Stage dots */}
      <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center', marginBottom: '0.75rem' }}>
        {[1, 2, 3, 4].map(s => (
          <span key={s} style={{ width: '10px', height: '10px', borderRadius: '50%', background: stage >= s ? '#ff4b8b' : 'rgba(255,255,255,0.2)', transition: 'all 0.3s ease' }} />
        ))}
      </div>
      <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#f9a8d4', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>{stageLabels[stage]}</p>

      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#f9a8d4', letterSpacing: '0.1em', textTransform: 'uppercase' }}>💕 ANNIVERSARY SPECIAL</span>
      <h1 style={{ fontSize: 'clamp(1.4rem, 4vw, 2rem)', margin: '0.4rem 0 0.25rem' }}>
        For You, {recipient} 🌹
      </h1>
      {specialDate && <p style={{ color: '#fda4af', fontSize: '0.85rem', marginBottom: '0.5rem' }}>🗓️ Since {specialDate}</p>}

      {/* STAGE 1: Love Meter */}
      {stage === 1 && (
        <div style={{ marginTop: '1.5rem' }}>
          <p style={{ color: '#fda4af', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Tap the heart to fill the Love Meter to 100%!
          </p>

          {/* SVG Heart Gauge */}
          <div style={{ position: 'relative', display: 'inline-block', cursor: 'pointer' }} onClick={boostMeter}>
            <svg viewBox="0 0 100 100" width="140" height="140">
              <defs>
                <linearGradient id="lvGrad" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor="#ff4b8b" />
                  <stop offset="100%" stopColor="#ff758c" />
                </linearGradient>
                <clipPath id="heartClip">
                  <path d="M50 88 C20 65 5 40 18 20 C30 5 45 15 50 25 C55 15 70 5 82 20 C95 40 80 65 50 88 Z" />
                </clipPath>
              </defs>
              {/* Empty heart */}
              <path d="M50 88 C20 65 5 40 18 20 C30 5 45 15 50 25 C55 15 70 5 82 20 C95 40 80 65 50 88 Z" fill="rgba(255,255,255,0.1)" stroke="#ff4b8b" strokeWidth="3" />
              {/* Filled portion */}
              <rect x="0" y={100 - loveMeter} width="100" height={loveMeter} clipPath="url(#heartClip)" fill="url(#lvGrad)" style={{ transition: 'y 0.4s ease, height 0.4s ease' }} />
              <text x="50" y="56" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="bold">{loveMeter}%</text>
            </svg>
          </div>

          <p style={{ color: '#fda4af', fontSize: '0.8rem', marginTop: '0.75rem' }}>
            {loveMeter < 50 ? 'Keep tapping! ❤️' : loveMeter < 100 ? 'Almost there! 💕' : '❤️ 100% Love! Proceeding...'}
          </p>
        </div>
      )}

      {/* STAGE 2: Pinky Promise */}
      {stage === 2 && (
        <div style={{ marginTop: '1.5rem' }}>
          <p style={{ color: '#fda4af', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Seal our bond with a Pinky Promise 🤝
          </p>

          <div
            onClick={() => { if (!pinkyLinked) { setPinkyLinked(true); setTimeout(() => setStage(3), 1200); } }}
            style={{ cursor: pinkyLinked ? 'default' : 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: pinkyLinked ? '0rem' : '2rem', transition: 'gap 0.8s ease', marginBottom: '1.5rem' }}
          >
            <span style={{ fontSize: '3.5rem', transform: 'scaleX(-1)', transition: 'all 0.6s ease' }}>🤙</span>
            <span style={{ fontSize: '3.5rem', transition: 'all 0.6s ease' }}>🤙</span>
          </div>

          {!pinkyLinked ? (
            <p style={{ color: '#fda4af', fontSize: '0.85rem' }}>Tap the pinkies to link them!</p>
          ) : (
            <div style={{ animation: 'sorryStepFadeIn 0.4s ease' }}>
              <p style={{ color: '#34d399', fontWeight: 800 }}>Pinky Promise Sealed! 🌟</p>
            </div>
          )}
        </div>
      )}

      {/* STAGE 3: Candle Blow */}
      {stage === 3 && (
        <div style={{ marginTop: '1.5rem' }}>
          <p style={{ color: '#fda4af', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Blow out our anniversary candle and make a wish 🕯️
          </p>
          <div style={{ fontSize: '5rem', cursor: candleBlown ? 'default' : 'pointer', transition: 'all 0.3s ease' }} onClick={() => { if (!candleBlown) { setCandleBlown(true); setShowConfetti(true); setTimeout(() => setStage(4), 1500); } }}>
            {candleBlown ? '🕯️' : '🔥'}
          </div>
          <p style={{ color: '#fda4af', marginTop: '0.75rem', fontSize: '0.85rem' }}>
            {candleBlown ? '✨ Wish made! Opening your letter...' : 'Tap to blow out the flame!'}
          </p>
        </div>
      )}

      {/* STAGE 4: Typewriter Letter + Floating Promises */}
      {stage === 4 && (
        <div style={{ marginTop: '1.5rem', animation: 'sorryStepFadeIn 0.5s ease' }}>
          {/* Floating promise particles */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
            {promises.map((p, i) => (
              <span key={i} style={{ position: 'absolute', fontSize: '0.65rem', color: '#fda4af', fontWeight: 700, opacity: 0.5, top: `${10 + i * 18}%`, left: `${5 + (i % 2) * 60}%`, animation: `floatUp ${3 + i * 0.4}s ease-in-out infinite alternate`, maxWidth: '100px', textAlign: 'center', lineHeight: 1.3 }}>
                💕 {p.slice(0, 30)}...
              </span>
            ))}
          </div>

          <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '20px', padding: '1.5rem', border: '1.5px solid rgba(255,75,139,0.3)', textAlign: 'left', marginBottom: '1.5rem', position: 'relative', zIndex: 2 }}>
            <h3 style={{ color: '#ff4b8b', fontSize: '1.2rem', margin: '0 0 0.75rem' }}>Dearest {recipient},</h3>
            <p style={{ fontSize: '1rem', lineHeight: 1.9, whiteSpace: 'pre-wrap', color: '#fde8ff' }}>
              {typedLines}
              <span style={{ borderRight: '2px solid #ff4b8b', marginLeft: '2px', animation: 'blink 1s step-end infinite' }} />
            </p>
          </div>

          {/* 5 Promises Reveal */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem', position: 'relative', zIndex: 2 }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#f9a8d4', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>💕 My 5 Promises to You:</p>
            {promises.map((p, i) => (
              <div key={i} style={{ background: 'rgba(255,75,139,0.12)', border: '1px solid rgba(255,75,139,0.3)', borderRadius: '10px', padding: '0.65rem 1rem', textAlign: 'left', animation: `sorryStepFadeIn 0.4s ease ${i * 0.15}s both` }}>
                <span style={{ fontWeight: 800, color: '#ff4b8b', marginRight: '0.4rem' }}>#{i + 1}</span>
                <span style={{ fontSize: '0.9rem', color: '#fde8ff' }}>{p}</span>
              </div>
            ))}
          </div>

          {note?.image_urls?.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem', position: 'relative', zIndex: 2 }}>
              {note.image_urls.map((url, i) => (
                <div key={i} style={{ borderRadius: '12px', overflow: 'hidden', border: '3px solid #ff4b8b', boxShadow: '0 4px 12px rgba(255,75,139,0.2)' }}>
                  <img src={url} alt="Anniversary Memory" style={{ width: '100%', height: '120px', objectFit: 'cover', display: 'block' }} />
                </div>
              ))}
            </div>
          )}

          <div style={{ fontFamily: 'cursive', fontSize: '1.8rem', color: '#ff4b8b', textAlign: 'right', position: 'relative', zIndex: 2 }}>
            Forever yours ❤️
          </div>
          <ReplayAndMarketingFooter onReplay={() => { setStage(1); setLoveMeter(0); setPinkyLinked(false); setCandleBlown(false); setShowConfetti(false); setTypedLines(''); }} isPreview={isPreview} />
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   4. A LETTER FOR MOM TEMPLATE (ID: letter-for-mom)
   ========================================================================== */
function LetterForMomTemplate({ note, isPreview = false }) {
  const [scene, setScene] = useState(1); // 1=greeting, 2=letter+sticky notes, 3=secret reveal
  const [typedLetter, setTypedLetter] = useState('');
  const [secretRevealed, setSecretRevealed] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [activeStickyNote, setActiveStickyNote] = useState(null);

  const recipient = note?.recipient_name || 'Mom';
  const customMsg = note?.custom_message || "Thank you for every meal, every warm cuddle, every sacrifice, and endless love. You are the strongest, sweetest person in my life.";
  const momTitle = note?.custom_details?.mom_title || 'Maa';
  const relation = note?.custom_details?.relation || 'Child';

  const stickyNotes = [
    note?.custom_details?.sticky_note_1 || 'Your cooking is home to me 🍲',
    note?.custom_details?.sticky_note_2 || 'Your hugs heal everything 🤗',
    note?.custom_details?.sticky_note_3 || 'Your strength inspires me daily 💪',
  ].filter(Boolean);

  // Typewriter for scene 2
  useEffect(() => {
    if (scene === 2) {
      setTypedLetter('');
      let i = 0;
      const t = setInterval(() => {
        if (i < customMsg.length) { setTypedLetter(prev => prev + customMsg.charAt(i)); i++; }
        else clearInterval(t);
      }, 38);
      return () => clearInterval(t);
    }
  }, [scene, customMsg]);

  return (
    <div style={{ background: 'linear-gradient(135deg, #fff0f6, #fce7f3)', borderRadius: '24px', padding: '2rem 1.5rem', maxWidth: '600px', margin: '0 auto', textAlign: 'center', minHeight: '520px', position: 'relative', overflow: 'hidden' }}>
      <ConfettiCannon active={showConfetti} heartOnly={true} duration={3500} />

      {/* Floral corners */}
      <div style={{ position: 'absolute', top: '12px', left: '12px', fontSize: '1.5rem', opacity: 0.4 }}>🌸</div>
      <div style={{ position: 'absolute', bottom: '12px', right: '12px', fontSize: '1.5rem', opacity: 0.4 }}>🌺</div>

      {/* Scene dots */}
      <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center', marginBottom: '1rem' }}>
        {[1, 2, 3].map(s => (
          <span key={s} style={{ width: '10px', height: '10px', borderRadius: '50%', background: scene >= s ? '#be185d' : '#fbcfe8', transition: 'all 0.3s ease' }} />
        ))}
      </div>

      <span style={{ background: '#fbcfe8', color: '#be185d', padding: '0.3rem 1rem', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        💐 A Tribute to the World&apos;s Best Mom
      </span>

      {/* SCENE 1: Greeting */}
      {scene === 1 && (
        <div style={{ marginTop: '1.5rem' }}>
          <div style={{ fontSize: '5rem', marginBottom: '0.5rem' }}>🌸</div>
          <h1 style={{ color: '#831843', fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', margin: '0 0 0.5rem' }}>
            Dear {momTitle}, {recipient} ❤️
          </h1>
          <p style={{ color: '#9f1239', fontSize: '0.95rem', marginBottom: '2rem', lineHeight: 1.6 }}>
            A heartfelt tribute from your {relation}, made with all the love in the world.
          </p>

          {note?.image_urls?.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {note.image_urls.map((url, i) => (
                <img key={i} src={url} alt="Mom memory" style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '12px', border: '3px solid #f472b6', boxShadow: '0 4px 10px rgba(244,114,182,0.2)' }} />
              ))}
            </div>
          )}

          <button
            onClick={() => setScene(2)}
            style={{ background: 'linear-gradient(135deg, #be185d, #881337)', color: '#fff', border: 'none', borderRadius: '999px', padding: '0.75rem 2rem', fontWeight: 800, fontSize: '1rem', cursor: 'pointer' }}
          >
            Open the Letter 💌
          </button>
        </div>
      )}

      {/* SCENE 2: Letter + Sticky Notes */}
      {scene === 2 && (
        <div style={{ marginTop: '1.5rem' }}>
          <h2 style={{ color: '#831843', fontSize: '1.35rem', margin: '0 0 1rem' }}>My Letter to You 📜</h2>

          {/* Letter card */}
          <div style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', border: '2px solid #f472b6', textAlign: 'left', marginBottom: '1.5rem', boxShadow: '0 4px 14px rgba(244,114,182,0.12)' }}>
            <h3 style={{ color: '#be185d', margin: '0 0 0.75rem' }}>Dearest {momTitle},</h3>
            <p style={{ fontSize: '1rem', lineHeight: 1.9, color: '#4c0519', whiteSpace: 'pre-wrap' }}>
              {typedLetter}
              <span style={{ borderRight: '2px solid #be185d', marginLeft: '2px', animation: 'blink 1s step-end infinite' }} />
            </p>
          </div>

          {/* Sticky Notes */}
          {stickyNotes.length > 0 && (
            <div>
              <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#be185d', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
                📝 My Cherished Memories of You:
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '1.5rem' }}>
                {stickyNotes.map((note_text, i) => (
                  <div
                    key={i}
                    onClick={() => setActiveStickyNote(activeStickyNote === i ? null : i)}
                    style={{
                      background: ['#fef08a', '#bbf7d0', '#bfdbfe'][i % 3],
                      padding: '0.75rem 1rem',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      color: '#3b0f1b',
                      cursor: 'pointer',
                      transform: activeStickyNote === i ? 'scale(1.08) rotate(0deg)' : `rotate(${[-2, 1, -1][i % 3]}deg)`,
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                      maxWidth: '160px',
                      lineHeight: 1.4,
                      animation: `sorryStepFadeIn 0.4s ease ${i * 0.15}s both`
                    }}
                  >
                    {note_text}
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={() => setScene(3)}
            style={{ background: 'linear-gradient(135deg, #be185d, #881337)', color: '#fff', border: 'none', borderRadius: '999px', padding: '0.75rem 2rem', fontWeight: 800, fontSize: '1rem', cursor: 'pointer' }}
          >
            One More Surprise 🌸
          </button>
        </div>
      )}

      {/* SCENE 3: Secret Bloom Reveal */}
      {scene === 3 && (
        <div style={{ marginTop: '1.5rem' }}>
          <h2 style={{ color: '#831843', fontSize: '1.35rem', margin: '0 0 0.75rem' }}>
            A Secret I Never Told You 🤫
          </h2>

          {!secretRevealed ? (
            <div>
              <div style={{ fontSize: '5rem', cursor: 'pointer', marginBottom: '1rem', animation: 'heartPulse 2s infinite' }} onClick={() => { setSecretRevealed(true); setShowConfetti(true); }}>
                🌸
              </div>
              <p style={{ color: '#9f1239', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Tap the flower to bloom the secret reveal...</p>
              <button
                onClick={() => { setSecretRevealed(true); setShowConfetti(true); }}
                style={{ background: 'linear-gradient(135deg, #be185d, #881337)', color: '#fff', border: 'none', borderRadius: '999px', padding: '0.75rem 2rem', fontWeight: 800, cursor: 'pointer' }}
              >
                🌸 Bloom the Secret
              </button>
            </div>
          ) : (
            <div style={{ animation: 'sorryStepFadeIn 0.5s ease' }}>
              {/* Blooming flower SVG */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                <svg viewBox="0 0 100 100" width="100" height="100">
                  <path d="M50 20 C40 5 20 20 35 35 C20 40 5 60 25 70 C30 85 50 90 50 75 C50 90 70 85 75 70 C95 60 80 40 65 35 C80 20 60 5 50 20 Z" fill="#f472b6" />
                  <circle cx="50" cy="50" r="14" fill="#ffd700" />
                  <text x="50" y="55" textAnchor="middle" fill="#fff" fontSize="12">💕</text>
                </svg>
              </div>

              <div style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', border: '2px dashed #f472b6', marginBottom: '1.5rem', boxShadow: '0 4px 14px rgba(244,114,182,0.12)' }}>
                <p style={{ fontSize: '1.15rem', color: '#be185d', fontWeight: 700, lineHeight: 1.7 }}>
                  &ldquo;{note?.custom_details?.secret_note || "You are my hero, Ma. No matter where I go, your love is my anchor. Thank you for being my everything!"}&rdquo; ❤️
                </p>
              </div>

              <div style={{ fontFamily: 'cursive', fontSize: '2rem', color: '#be185d' }}>
                Thank you, {momTitle}! ❤️
              </div>
              <ReplayAndMarketingFooter onReplay={() => { setScene(1); setTypedLetter(''); setSecretRevealed(false); setShowConfetti(false); setActiveStickyNote(null); }} isPreview={isPreview} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   5. WILL YOU BE MY VALENTINE TEMPLATE (ID: be-my-valentine)
   ========================================================================== */
function BeMyValentineTemplate({ note, isPreview = false }) {
  const [accepted, setAccepted] = useState(false);
  const [noPosition, setNoPosition] = useState({ top: '0px', left: '0px' });
  const [noCount, setNoCount] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  const recipient = note?.recipient_name || 'Cutie';
  const customMsg = note?.custom_message || "You bring magic and joy into my life. I want to celebrate love with you today and every day!";

  const noPhrases = [
    'No',
    'Are you sure?',
    'Think again!',
    'Wrong choice ;)',
    'Can\'t click me!',
    'Say YES! ❤️',
  ];

  const dodgeNoButton = () => {
    const randomTop = Math.floor(Math.random() * 80 - 40) + 'px';
    const randomLeft = Math.floor(Math.random() * 120 - 60) + 'px';
    setNoPosition({ top: randomTop, left: randomLeft });
    setNoCount((prev) => prev + 1);
  };

  const handleYes = () => {
    setAccepted(true);
    setShowConfetti(true);
  };

  return (
    <div style={{ background: '#ffffff', borderRadius: '24px', padding: '3rem 2rem', maxWidth: '520px', margin: '0 auto', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.06)' }}>
      <ConfettiCannon active={showConfetti} heartOnly={true} duration={5000} />

      <span style={{ color: '#e11d48', fontWeight: 600, fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
        Special Proposal
      </span>

      {!accepted ? (
        <div>
          <h1 style={{ color: '#1c1917', fontSize: 'clamp(1.6rem, 4vw, 2.25rem)', margin: '0.5rem 0 1rem', fontWeight: 600, letterSpacing: '-0.02em' }}>
            {recipient}, Will You Be My Valentine? 🌹
          </h1>
          <p style={{ color: '#78716c', fontSize: '0.95rem', marginBottom: '2rem', lineHeight: 1.6 }}>
            Please accept this message with all my warmth and affection.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', alignItems: 'center', position: 'relative', minHeight: '60px' }}>
            <button
              onClick={handleYes}
              style={{
                background: '#e11d48',
                color: '#ffffff',
                border: 'none',
                borderRadius: '99px',
                padding: '0.85rem 2rem',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 8px 20px rgba(225, 29, 72, 0.25)',
                transition: 'all 0.3s ease'
              }}
            >
              YES! Absolutely ❤️
            </button>

            <button
              style={{
                position: 'relative',
                top: noPosition.top,
                left: noPosition.left,
                background: '#fafaf9',
                color: '#78716c',
                border: '1px solid rgba(0,0,0,0.1)',
                borderRadius: '99px',
                padding: '0.85rem 1.5rem',
                fontSize: '0.9rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              onMouseEnter={dodgeNoButton}
              onClick={dodgeNoButton}
              onTouchStart={dodgeNoButton}
            >
              {noPhrases[noCount % noPhrases.length]}
            </button>
          </div>
        </div>
      ) : (
        <div style={{ animation: 'fadeIn 0.6s ease' }}>
          <h1 style={{ color: '#1c1917', fontSize: '2rem', margin: '0 0 1rem', fontWeight: 600 }}>
            Wonderful Choice ❤️
          </h1>
          <p style={{ color: '#78716c', fontSize: '1rem', marginBottom: '2rem' }}>
            You just made me the happiest person in the universe!
          </p>

          <div style={{ background: '#fafaf9', padding: '1.75rem', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.06)', textAlign: 'left', marginBottom: '1.5rem' }}>
            <h3 style={{ color: '#1c1917', fontSize: '1.1rem', marginBottom: '0.75rem', fontWeight: 600 }}>For {recipient}:</h3>
            <p style={{ fontSize: '1rem', lineHeight: 1.7, color: '#44403c', whiteSpace: 'pre-wrap', margin: 0 }}>
              {customMsg}
            </p>

            {note?.custom_details?.date_idea && (
              <div style={{ marginTop: '1.25rem', padding: '1rem', background: '#ffffff', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.06)' }}>
                <h4 style={{ color: '#e11d48', margin: '0 0 0.25rem 0', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Our Special Date Idea</h4>
                <p style={{ margin: 0, fontSize: '0.95rem', color: '#1c1917' }}>{note.custom_details.date_idea}</p>
              </div>
            )}

            {note.image_urls?.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', marginTop: '1.5rem' }}>
                {note.image_urls.map((url, i) => (
                  <img key={i} src={url} alt="Valentine Memory" style={{ width: '100%', height: '130px', objectFit: 'cover', borderRadius: '12px' }} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      {accepted && <ReplayAndMarketingFooter onReplay={() => { setAccepted(false); setNoCount(0); setShowConfetti(false); }} isPreview={isPreview} />}
    </div>
  );
}

/* ==========================================================================
   6. ROYAL WEDDING INVITATION TEMPLATE (ID: wedding-invitation)
   ========================================================================== */
function WeddingInvitationTemplate({ note, isPreview = false }) {
  const [rsvp, setRsvp] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ days: 14, hours: 8, mins: 45, secs: 12 });

  const recipient = note?.recipient_name || 'Esteemed Guest';
  const customMsg = note?.custom_message || "We request the honor of your presence to celebrate love, laughter, and togetherness as we begin our new journey.";

  // Real-time live countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 };
        if (prev.mins > 0) return { ...prev, mins: 59, secs: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, mins: 59, secs: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, mins: 59, secs: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="wedding-card">
      <div className="wedding-mandala-top">🪔</div>

      <div style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.2em', color: '#fbbf24', textTransform: 'uppercase' }}>
        💒 SHUBH VIVAH & SAVE THE DATE
      </div>
      <h1 style={{ color: '#fef3c7', fontSize: 'clamp(1.75rem, 5vw, 3rem)', margin: '0.75rem 0 0.5rem', fontFamily: 'Georgia, serif' }}>
        {note?.custom_details?.bride_name && note?.custom_details?.groom_name
          ? `${note.custom_details.bride_name} ❤️ ${note.custom_details.groom_name}`
          : `Wedding Invitation for ${recipient}`}
      </h1>
      <p style={{ color: '#fde68a', fontSize: '0.95rem', fontStyle: 'italic', maxWidth: '550px', margin: '0 auto 1.5rem' }}>
        {note?.custom_details?.wedding_date ? `Save the Date: ${note.custom_details.wedding_date}` : 'Together with their families, we cordially invite you to share in our sacred auspicious union.'}
        {note?.custom_details?.venue && <span style={{ display: 'block', marginTop: '0.35rem', color: '#fbbf24', fontWeight: 700 }}>📍 Venue: {note.custom_details.venue}</span>}
      </p>

      {/* Real-time Live Countdown Timer */}
      <div className="wedding-timer">
        <div className="timer-box"><div className="timer-num">{String(timeLeft.days).padStart(2, '0')}</div><div className="timer-label">Days</div></div>
        <div className="timer-box"><div className="timer-num">{String(timeLeft.hours).padStart(2, '0')}</div><div className="timer-label">Hours</div></div>
        <div className="timer-box"><div className="timer-num">{String(timeLeft.mins).padStart(2, '0')}</div><div className="timer-label">Mins</div></div>
        <div className="timer-box"><div className="timer-num">{String(timeLeft.secs).padStart(2, '0')}</div><div className="timer-label">Secs</div></div>
      </div>

      {/* Invitation Message Card */}
      <div style={{ background: 'rgba(255, 255, 255, 0.08)', border: '2px solid #fbbf24', padding: '2rem', borderRadius: '16px', margin: '2rem 0', textAlign: 'left' }}>
        <h3 style={{ color: '#fbbf24', fontSize: '1.2rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          ✨ Special Invitation Message
        </h3>
        <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: '#fff', whiteSpace: 'pre-wrap' }}>
          {customMsg}
        </p>

        {note.image_urls?.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', marginTop: '1.5rem' }}>
            {note.image_urls.map((url, i) => (
              <img key={i} src={url} alt="Save the date" style={{ width: '100%', height: '130px', objectFit: 'cover', borderRadius: '8px', border: '2px solid #fbbf24' }} />
            ))}
          </div>
        )}
      </div>

      {/* Schedule of Events Timeline */}
      <div className="wedding-events-timeline">
        <h3 style={{ color: '#fbbf24', fontSize: '1.25rem', marginBottom: '1rem', textTransform: 'uppercase' }}>
          📅 Schedule of Events (उत्सव प्रसंग)
        </h3>
        <div className="events-grid">
          <div className="event-card">
            <div className="event-icon">💛</div>
            <h4>Mehndi Ki Raat</h4>
            <p className="event-time">{note?.custom_details?.event_mehndi || '4:00 PM onwards'}</p>
          </div>
          <div className="event-card">
            <div className="event-icon">💃</div>
            <h4>Sangeet Sandhya</h4>
            <p className="event-time">{note?.custom_details?.event_sangeet || '7:30 PM onwards'}</p>
          </div>
          <div className="event-card">
            <div className="event-icon">🌻</div>
            <h4>Haldi Ceremony</h4>
            <p className="event-time">{note?.custom_details?.event_haldi || '10:00 AM onwards'}</p>
          </div>
          <div className="event-card">
            <div className="event-icon">🪔</div>
            <h4>Shubh Vivah</h4>
            <p className="event-time">{note?.custom_details?.event_wedding || '7:00 PM auspicious muhurat'}</p>
          </div>
          {note?.custom_details?.event_reception && (
            <div className="event-card">
              <div className="event-icon">🎉</div>
              <h4>Grand Reception</h4>
              <p className="event-time">{note.custom_details.event_reception}</p>
            </div>
          )}
        </div>
      </div>

      {/* Map Location Link Button */}
      <div style={{ margin: '1.5rem 0' }}>
        <a
          href={note?.custom_details?.venue_map_url || "https://maps.google.com"}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: '#fbbf24',
            color: '#4c0519',
            padding: '0.75rem 1.5rem',
            borderRadius: '999px',
            fontWeight: 800,
            fontSize: '0.95rem'
          }}
        >
          📍 Open Venue Location on Google Maps ➔
        </a>
      </div>

      {/* Interactive RSVP Form */}
      <div style={{ background: 'rgba(0, 0, 0, 0.4)', border: '1px solid #fbbf24', padding: '1.5rem', borderRadius: '16px', marginTop: '2rem' }}>
        <p style={{ fontSize: '0.9rem', color: '#fde68a', marginBottom: '1rem', fontWeight: 800, letterSpacing: '0.1em' }}>
          KINDLY RESPOND (RSVP)
        </p>

        {!rsvp ? (
          <div>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1rem' }}>
              <button onClick={() => setRsvp('attending')} style={{ background: '#fbbf24', color: '#4c0519', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '999px', fontWeight: 800, cursor: 'pointer' }}>
                ✨ Joyfully Attending
              </button>
              <button onClick={() => setRsvp('regrets')} style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid #fbbf24', padding: '0.75rem 1.5rem', borderRadius: '999px', fontWeight: 700, cursor: 'pointer' }}>
                ❤️ Sending Blessings From Afar
              </button>
            </div>
          </div>
        ) : (
          <div style={{ background: 'rgba(251, 191, 36, 0.2)', padding: '1rem', borderRadius: '12px', color: '#fbbf24', fontWeight: 700 }}>
            {rsvp === 'attending'
              ? '✓ Thank you! Your attendance has been recorded. We look forward to celebrating with you! ✨'
              : '✓ Thank you for sending your warm wishes and blessings ❤️'}
          </div>
        )}
      </div>
      {rsvp && <ReplayAndMarketingFooter onReplay={() => { setRsvp(null); }} isPreview={isPreview} />}
    </div>
  );
}

/* ==========================================================================
   7. SURPRISE REVEAL BOX TEMPLATE (ID: surprise-reveal-box)
   ========================================================================== */
function SurpriseRevealBoxTemplate({ note, isPreview = false }) {
  const [step, setStep] = useState(0); // 0: wrapped ribbon, 1: lid open, 2: surprise layer 1, 3: layer 2, 4: final reveal
  const [boxTheme, setBoxTheme] = useState('ruby'); // 'ruby', 'gold', 'purple'
  const [showConfetti, setShowConfetti] = useState(false);

  const recipient = note?.recipient_name || 'Special Someone';
  const customMsg = note?.custom_message || "Behind every bow and ribbon lies a heart full of love for you. Here is your special surprise!";

  const handleNextStep = () => {
    const nextStep = step + 1;
    setStep(nextStep);
    if (nextStep === 2 || nextStep === 4) {
      setShowConfetti(true);
    }
  };

  return (
    <div className={`surprise-box-container theme-${boxTheme}`}>
      <ConfettiCannon active={showConfetti} duration={3500} />

      <p style={{ color: '#d81e5b', fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
        🎁 MULTI-LAYER UNBOXING EXPERIENCE
      </p>
      <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', margin: '0.5rem 0 1rem' }}>
        Surprise Box for {recipient}
      </h1>

      {/* Gift Wrap Selector */}
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
        {[
          { id: 'ruby', label: '🎀 Ruby Velvet' },
          { id: 'gold', label: '👑 Royal Gold' },
          { id: 'purple', label: '✨ Sparkle Violet' }
        ].map((w) => (
          <button
            key={w.id}
            onClick={() => setBoxTheme(w.id)}
            style={{
              padding: '0.4rem 0.8rem',
              borderRadius: '999px',
              border: '2px solid #d81e5b',
              background: boxTheme === w.id ? '#d81e5b' : 'rgba(255,255,255,0.2)',
              color: boxTheme === w.id ? '#fff' : '#3b0f1b',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            {w.label}
          </button>
        ))}
      </div>

      {step < 2 ? (
        <div className="gift-box-wrapper">
          <div className={`gift-box-3d ${step === 1 ? 'lid-popped' : ''}`} onClick={handleNextStep}>
            <div className="gift-ribbon-v" />
            <div className="gift-ribbon-h" />
            <div className="gift-box-center-icon">
              {step === 0 ? '🎀' : '✨'}
            </div>
          </div>

          <p className="box-tap-hint">
            {step === 0 ? '👇 Tap the gift box to untie satin ribbon!' : '👇 Tap box lid to pop open with confetti!'}
          </p>
        </div>
      ) : (
        <div style={{ animation: 'fadeIn 0.5s ease' }}>
          {/* Layer Progress Dots */}
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <span className={`layer-badge ${step >= 2 ? 'active' : ''}`}>Layer 1: Note 📜</span>
            {note.image_urls?.length > 0 && <span className={`layer-badge ${step >= 3 ? 'active' : ''}`}>Layer 2: Memories 📸</span>}
            <span className={`layer-badge ${step >= 4 ? 'active' : ''}`}>Layer 3: Grand Reveal ✨</span>
          </div>

          {step === 2 && (
            <div className="surprise-layer-card">
              <div style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '0.5rem' }}>📜✨</div>
              <h2 style={{ color: '#d81e5b', fontSize: '1.5rem', textAlign: 'center', marginBottom: '1rem' }}>
                Personal Message for {recipient}
              </h2>
              {note?.custom_details?.hint_1 && (
                <p style={{ fontSize: '0.85rem', fontWeight: 800, color: '#be185d', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  💡 Hint #1: {note.custom_details.hint_1}
                </p>
              )}
              <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: '#3b0f1b', whiteSpace: 'pre-wrap' }}>
                {customMsg}
              </p>

              <button className="btn-primary w-full mt-4" onClick={handleNextStep}>
                Next Surprise Layer ➔
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="surprise-layer-card">
              <div style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '0.5rem' }}>📸💖</div>
              <h2 style={{ color: '#d81e5b', fontSize: '1.5rem', textAlign: 'center', marginBottom: '1rem' }}>
                Memory Gallery
              </h2>
              {note?.custom_details?.hint_2 && (
                <p style={{ fontSize: '0.85rem', fontWeight: 800, color: '#be185d', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                  💡 Hint #2: {note.custom_details.hint_2}
                </p>
              )}

              {note.image_urls?.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
                  {note.image_urls.map((url, i) => (
                    <img key={i} src={url} alt="Gift Memory" style={{ width: '100%', height: '130px', objectFit: 'cover', borderRadius: '12px', border: '3px solid #3b0f1b' }} />
                  ))}
                </div>
              ) : (
                <p style={{ textAlign: 'center', color: '#8e3249' }}>A treasure box full of unspoken affection.</p>
              )}

              <button className="btn-primary w-full mt-4" onClick={handleNextStep}>
                Final Surprise Reveal ➔
              </button>
            </div>
          )}

          {step >= 4 && (
            <div className="surprise-layer-card final-reveal-glow">
              <div style={{ fontSize: '4rem', textAlign: 'center', animation: 'heartPulse 1.5s infinite' }}>💖🎁🎉</div>
              <h2 style={{ color: '#d81e5b', fontSize: '1.8rem', textAlign: 'center', margin: '0.5rem 0' }}>
                {note?.custom_details?.final_surprise || "You Are My Greatest Surprise!"}
              </h2>
              {note?.custom_details?.hint_3 && (
                <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#be185d', fontWeight: 700, marginBottom: '0.5rem' }}>
                  ✨ {note.custom_details.hint_3}
                </p>
              )}
              <p style={{ textAlign: 'center', fontSize: '1rem', color: '#8e3249' }}>
                Every layer opened, forever sealed with infinite love. ❤️
              </p>
            </div>
          )}
        </div>
      )}
      {step >= 4 && <ReplayAndMarketingFooter onReplay={() => { setStep(0); setShowConfetti(false); }} isPreview={isPreview} />}
    </div>
  );
}

/* ==========================================================================
   8. CINEMATIC VIRTUAL ROSE BLOOM TEMPLATE (ID: a-rose-for-someone-special)
   ========================================================================== */
function RoseSpecialTemplate({ note, isPreview = false }) {
  const [bloomed, setBloomed] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const recipient = note?.recipient_name || 'Beloved';
  const customMsg = note?.custom_message || "Like a rose that blooms under the moonlight, my feelings for you grow deeper with every passing moment.";

  const handleBloom = () => {
    setBloomed(true);
    setShowConfetti(true);
  };

  return (
    <div className="rose-special-container">
      <ConfettiCannon active={showConfetti} heartOnly={true} duration={4000} />

      <div className="dark-candlelight-glow" />

      <div style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.2em', color: '#ff4d7f', textTransform: 'uppercase' }}>
        🌹 CINEMATIC VIRTUAL ROSE BLOOM
      </div>

      {/* Interactive Blooming Rose SVG */}
      <div className="blooming-rose-stage" onClick={handleBloom} title="Tap rose to bloom!">
        <div className={`rose-flower-graphic ${bloomed ? 'bloomed' : 'bud'}`}>
          <svg viewBox="0 0 100 100" width="140" height="140">
            {/* Outer Petals */}
            <path className="petal-outer p-left" d="M50 40 C30 20 10 40 30 65 C45 80 50 85 50 85 Z" fill="#b91c1c" />
            <path className="petal-outer p-right" d="M50 40 C70 20 90 40 70 65 C55 80 50 85 50 85 Z" fill="#dc2626" />
            {/* Inner Petals */}
            <path className="petal-inner p-center" d="M50 30 C38 15 25 35 40 55 C48 65 50 70 50 70 Z" fill="#ef4444" />
            <path className="petal-inner p-center2" d="M50 30 C62 15 75 35 60 55 C52 65 50 70 50 70 Z" fill="#f87171" />
            {/* Rose Core Heart */}
            <circle cx="50" cy="42" r="10" fill="#f43f5e" />
          </svg>
        </div>
      </div>

      <h1 style={{ color: '#fff', fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', margin: '1rem 0 0.5rem' }}>
        A Rose for {recipient}
      </h1>

      {!bloomed ? (
        <p className="tap-bloom-hint" onClick={handleBloom}>
          ✨ Tap the rosebud to make it bloom & reveal your dedicated message ✨
        </p>
      ) : (
        <div className="rose-message-card">
          <p style={{ fontSize: '0.8rem', color: '#fecdd3', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>
            🌹 Dedicated Message:
          </p>
          {note?.custom_details?.dedication_line && (
            <p style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fbbf24', fontStyle: 'italic', marginBottom: '1rem', borderBottom: '1px dashed rgba(251,191,36,0.3)', paddingBottom: '0.5rem' }}>
              ✨ &ldquo;{note.custom_details.dedication_line}&rdquo;
            </p>
          )}
          <p style={{ fontSize: '1.05rem', lineHeight: 1.9, color: '#ffe4e6', whiteSpace: 'pre-wrap' }}>
            {customMsg}
          </p>

          {note.image_urls?.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', marginTop: '1.5rem' }}>
              {note.image_urls.map((url, i) => (
                <img key={i} src={url} alt="Rose memory" style={{ width: '100%', height: '130px', objectFit: 'cover', borderRadius: '12px', border: '2px solid #e11d48' }} />
              ))}
            </div>
          )}
        </div>
      )}
      {bloomed && <ReplayAndMarketingFooter onReplay={() => { setBloomed(false); setShowConfetti(false); }} isPreview={isPreview} />}
    </div>
  );
}

/* ==========================================================================
   9. RAKSHA BANDHAN — A BOND FOREVER TEMPLATE (14-STAGE JOURNEY)
   ========================================================================== */
function RakshabandhanTemplate({ note, isPreview = false }) {
  const [stage, setStage] = useState(1);
  const [doorOpen, setDoorOpen] = useState(false);
  const [openedEnvelopes, setOpenedEnvelopes] = useState({});
  const [knotsTied, setKnotsTied] = useState(0);
  const [rakhiCeremonyDone, setRakhiCeremonyDone] = useState(false);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [unboxedLetter, setUnboxedLetter] = useState(false);
  const [shagunSent, setShagunSent] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [typedBlessing, setTypedBlessing] = useState('');
  const [showQrModal, setShowQrModal] = useState(false);

  const recipient = note?.recipient_name || 'Bhai';
  const customMsg = note?.custom_message ||
    'This rakhi ties more than just a thread — it binds my heart to yours, forever and always. I am endlessly proud of you and grateful to have you as my brother. Happy Raksha Bandhan! 🪢💫';

  // Dynamic Promises
  const promises = [
    note?.custom_details?.rakhi_promise_1 || 'I promise to always annoy you 😄',
    note?.custom_details?.rakhi_promise_2 || 'I promise to stand beside you through thick & thin ❤️',
    note?.custom_details?.rakhi_promise_3 || 'I promise to always pray for your happiness 🌟',
  ];

  // Dynamic Unboxing Letter
  const unboxingLetter = note?.custom_details?.unboxing_letter ||
    `Dear ${recipient},\n\nYou know I don't need gifts — your love is enough!\n\nBut... traditions are traditions 😄\n\nSo here's your chance to give your sister some Shagun! ❤️`;

  // Photos
  const defaultPhotos = [
    { url: 'https://images.unsplash.com/photo-1604881991720-f91add269bed?q=80&w=800&auto=format&fit=crop', year: '2012', note: 'Remember when you carried my bag? 🎒' },
    { url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=800&auto=format&fit=crop', year: '2016', note: 'Our biggest fight... lasted 15 mins! 😂' },
    { url: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=800&auto=format&fit=crop', year: '2020', note: 'Secretly buying chocolates for me 🍫' },
  ];

  const photos = (note?.image_urls && note.image_urls.length > 0)
    ? note.image_urls.map((u, i) => ({
        url: u,
        year: `${2015 + i}`,
        note: i === 0 ? 'Always protecting me 🧡' : i === 1 ? 'Growing up together 🌻' : 'Memories forever 🪢'
      }))
    : defaultPhotos;

  // Background Theme based on Stage
  const getThemeClass = () => {
    if (stage <= 4) return 'theme-morning';
    if (stage <= 9) return 'theme-sunset';
    return 'theme-night';
  };

  // Stage 9 Blessing Typewriter
  useEffect(() => {
    if (stage === 9) {
      setTypedBlessing('');
      const fullText = "Distance can never untie this thread... Time can never weaken our bond. You'll always have one person silently praying for you... Your sister ❤️";
      let idx = 0;
      const timer = setInterval(() => {
        if (idx < fullText.length) {
          setTypedBlessing((prev) => prev + fullText.charAt(idx));
          idx++;
        } else { clearInterval(timer); }
      }, 35);
      return () => clearInterval(timer);
    }
  }, [stage]);

  const handleDoorOpen = () => {
    setDoorOpen(true);
    setTimeout(() => setStage(4), 1200);
  };

  const handleTieKnot = () => {
    if (knotsTied < 3) {
      const next = knotsTied + 1;
      setKnotsTied(next);
      if (next === 3) {
        setShowConfetti(true);
      }
    }
  };

  const handlePerformCeremony = () => {
    setRakhiCeremonyDone(true);
    setShowConfetti(true);
  };

  const handleSendShagun = () => {
    setShagunSent(true);
    setShowConfetti(true);
    setStage(13);
  };

  return (
    <div className={`rakhi-journey-wrapper ${getThemeClass()}`}>
      <ConfettiCannon active={showConfetti} />

      {/* Firefly particles for night sky */}
      {stage >= 10 && (
        <div className="fireflies-container">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="firefly" style={{
              top: `${Math.random() * 90}%`,
              left: `${Math.random() * 90}%`,
              animationDelay: `${Math.random() * 3}s`
            }} />
          ))}
        </div>
      )}

      {/* Stage Tracker Dots */}
      <div className="step-progress-dots" style={{ marginBottom: '1rem' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#fde68a' }}>
          STAGE {stage} OF 14
        </span>
      </div>

      {/* ── STAGE 1: The Gift Arrives ── */}
      {stage === 1 && (
        <div className="text-center" style={{ padding: '2rem 1rem' }}>
          <div style={{ fontSize: '4.5rem', marginBottom: '1rem', animation: 'heartPulse 2s infinite' }}>🎁🪢</div>
          <span style={{ background: 'rgba(251,191,36,0.2)', color: '#fbbf24', padding: '0.4rem 1.2rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>
            SPECIAL SURPRISE FOR {recipient.toUpperCase()}
          </span>
          <h1 style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', color: '#fff', marginTop: '1rem', marginBottom: '0.75rem' }}>
            Someone tied a Rakhi for you ❤️
          </h1>
          <p style={{ color: '#fde68a', fontSize: '0.95rem', maxWidth: '480px', margin: '0 auto 2rem' }}>
            Even before you opened this link, a sister's blessing was waiting for you.
          </p>
          <button
            className="rakhi-btn-glowing"
            onClick={() => setStage(2)}
            style={{ fontSize: '1.1rem', padding: '0.85rem 2.2rem' }}
          >
            🪢 Open My Rakhi ➔
          </button>
        </div>
      )}

      {/* ── STAGE 2: Personal Welcome ── */}
      {stage === 2 && (
        <div className="text-center" style={{ padding: '2rem 1rem' }}>
          <span style={{ fontSize: '3rem' }}>🌸</span>
          <h2 style={{ fontSize: '2.2rem', color: '#fde68a', fontFamily: 'Georgia, serif', margin: '0.5rem 0' }}>
            Dear {recipient}...
          </h2>
          <p style={{ fontSize: '1.15rem', color: '#fff', lineHeight: 1.7, maxWidth: '500px', margin: '1.5rem auto 2.5rem' }}>
            "Before I tie this Rakhi, I want you to travel through our little world of memories."
          </p>
          <button className="rakhi-btn-glowing" onClick={() => setStage(3)}>
            Begin the Journey ➔
          </button>
        </div>
      )}

      {/* ── STAGE 3: Childhood Door ── */}
      {stage === 3 && (
        <div className="text-center" style={{ padding: '1.5rem 1rem' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#fde68a' }}>Childhood Door 🚪</h2>
          <p style={{ fontSize: '0.85rem', color: '#fed7aa', marginBottom: '1rem' }}>
            Every Rakhi begins with a memory. Tap to open our childhood door...
          </p>

          <div className={`rakhi-door-stage ${doorOpen ? 'open' : ''}`} onClick={handleDoorOpen}>
            <div className="rakhi-door-frame">
              <div className="rakhi-door-panel left" />
              <div className="rakhi-door-panel right" />
              <div style={{ textAlign: 'center', zIndex: 1 }}>
                <span style={{ fontSize: '2.5rem' }}>✨🌻</span>
                <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 800, color: '#78350f' }}>Opening Memories...</p>
              </div>
            </div>
          </div>

          {!doorOpen && (
            <button className="rakhi-btn-glowing" onClick={handleDoorOpen} style={{ marginTop: '1rem' }}>
              🚪 Open the Door ➔
            </button>
          )}
        </div>
      )}

      {/* ── STAGE 4: Memory Timeline ── */}
      {stage === 4 && (
        <div className="text-center" style={{ padding: '1rem' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#fde68a', margin: 0 }}>
            Our Memory Timeline 📸
          </h2>
          <p style={{ fontSize: '0.8rem', color: '#fed7aa', marginBottom: '1rem' }}>
            Swipe across to journey through our years together ({photos.length} memories)
          </p>

          <div className="rakhi-timeline-scroll">
            {photos.map((item, idx) => (
              <div key={idx} className="rakhi-memory-card">
                <span style={{ background: '#fbbf24', color: '#78350f', padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 800 }}>
                  {item.year}
                </span>
                <img src={item.url} alt={`Memory ${idx + 1}`} style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '12px', margin: '0.75rem 0', border: '2px solid #fbbf24' }} />
                <p style={{ fontSize: '0.85rem', color: '#fff', margin: 0, fontStyle: 'italic' }}>
                  {item.note}
                </p>
              </div>
            ))}
          </div>

          <button className="rakhi-btn-glowing" onClick={() => setStage(5)} style={{ marginTop: '1.5rem' }}>
            Things I'll Never Forget ➔
          </button>
        </div>
      )}

      {/* ── STAGE 5: Things I'll Never Forget ── */}
      {stage === 5 && (
        <div className="text-center" style={{ padding: '1.5rem 1rem' }}>
          <h2 style={{ fontSize: '1.6rem', color: '#fde68a', marginBottom: '1.5rem' }}>
            Things I'll Never Forget ❤️
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '420px', margin: '0 auto 2rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.15)', border: '2px solid #fbbf24', padding: '1.25rem', borderRadius: '16px' }}>
              <span style={{ fontSize: '1.8rem', display: 'block', marginBottom: '0.35rem' }}>🛡️</span>
              <p style={{ margin: 0, fontSize: '1rem', color: '#fff', fontWeight: 700 }}>You always protected me when things were tough.</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.15)', border: '2px solid #fbbf24', padding: '1.25rem', borderRadius: '16px' }}>
              <span style={{ fontSize: '1.8rem', display: 'block', marginBottom: '0.35rem' }}>🌟</span>
              <p style={{ margin: 0, fontSize: '1rem', color: '#fff', fontWeight: 700 }}>You always believed in me, even when I doubted myself.</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.15)', border: '2px solid #fbbf24', padding: '1.25rem', borderRadius: '16px' }}>
              <span style={{ fontSize: '1.8rem', display: 'block', marginBottom: '0.35rem' }}>💖</span>
              <p style={{ margin: 0, fontSize: '1rem', color: '#fff', fontWeight: 700 }}>Even when we fought, you never stopped caring.</p>
            </div>
          </div>
          <button className="rakhi-btn-glowing" onClick={() => setStage(6)}>
            Open Hidden Envelopes ➔
          </button>
        </div>
      )}

      {/* ── STAGE 6: Hidden Envelopes ── */}
      {stage === 6 && (
        <div className="text-center" style={{ padding: '1rem' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#fde68a' }}>Hidden Sister Messages 📩</h2>
          <p style={{ fontSize: '0.85rem', color: '#fed7aa', marginBottom: '1rem' }}>Tap each envelope to reveal sister secrets:</p>

          <div className="rakhi-envelope-grid">
            {[
              { id: 1, title: '📩 Note #1', text: 'Thank you for becoming my first superhero 🦸‍♂️' },
              { id: 2, title: '📩 Note #2', text: 'Thank you for never saying no when I needed you 💛' },
              { id: 3, title: '📩 Note #3', text: 'Thank you for treating me like your princess 👑' },
            ].map((env) => (
              <div
                key={env.id}
                className="rakhi-envelope-btn"
                onClick={() => setOpenedEnvelopes((prev) => ({ ...prev, [env.id]: true }))}
              >
                {openedEnvelopes[env.id] ? (
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#78350f', lineHeight: 1.4 }}>{env.text}</p>
                ) : (
                  <div>
                    <span style={{ fontSize: '2rem', display: 'block' }}>✉️</span>
                    <span>{env.title}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <button className="rakhi-btn-glowing" onClick={() => setStage(7)} style={{ marginTop: '2rem' }}>
            Tie Promise Bracelet ➔
          </button>
        </div>
      )}

      {/* ── STAGE 7: Promise Bracelet (Interactive Knot Tying) ── */}
      {stage === 7 && (
        <div className="text-center" style={{ padding: '1.5rem 1rem' }}>
          <h2 style={{ fontSize: '1.6rem', color: '#fde68a', margin: 0 }}>Promise Bracelet 🪢</h2>
          <p style={{ fontSize: '0.85rem', color: '#fed7aa', margin: '0.5rem 0 1.5rem' }}>
            Tap the button to tie each sacred knot and reveal sister promises ({knotsTied}/3)
          </p>

          <div style={{ background: 'rgba(0,0,0,0.3)', border: '2px solid #fbbf24', borderRadius: '20px', padding: '1.5rem', maxWidth: '440px', margin: '0 auto 1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              {[1, 2, 3].map((k) => (
                <div key={k} style={{
                  width: '50px', height: '50px', borderRadius: '50%',
                  background: knotsTied >= k ? '#fbbf24' : 'rgba(255,255,255,0.2)',
                  color: knotsTied >= k ? '#78350f' : '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.5rem', fontWeight: 800, transition: 'all 0.4s ease'
                }}>
                  {knotsTied >= k ? '🪢' : k}
                </div>
              ))}
            </div>

            <div style={{ minHeight: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {knotsTied === 0 && <p style={{ color: '#fed7aa', fontStyle: 'italic' }}>Tap below to tie the 1st promise knot...</p>}
              {knotsTied >= 1 && (
                <div style={{ color: '#fff', fontSize: '0.95rem' }}>
                  <p style={{ margin: 0, fontWeight: 700, color: '#fde68a' }}>✨ Promise #{knotsTied}:</p>
                  <p style={{ margin: '0.35rem 0 0', lineHeight: 1.5 }}>"{promises[knotsTied - 1]}"</p>
                </div>
              )}
            </div>
          </div>

          {knotsTied < 3 ? (
            <button className="rakhi-btn-glowing" onClick={handleTieKnot}>
              🪢 Tie Knot #{knotsTied + 1} ➔
            </button>
          ) : (
            <button className="rakhi-btn-glowing" onClick={() => setStage(8)}>
              Begin Virtual Rakhi Ceremony ➔
            </button>
          )}
        </div>
      )}

      {/* ── STAGE 8: Virtual Rakhi Ceremony (Core Ritual) ── */}
      {stage === 8 && (
        <div className="text-center" style={{ padding: '1.5rem 1rem' }}>
          <h2 style={{ fontSize: '1.6rem', color: '#fde68a', margin: 0 }}>Virtual Rakhi Ceremony 🌟</h2>
          <p style={{ fontSize: '0.85rem', color: '#fed7aa', margin: '0.5rem 0 1.5rem' }}>
            Tap the sacred thali to tie the Rakhi and receive Tilak & Blessings
          </p>

          <div style={{
            width: '220px', height: '220px', margin: '0 auto 1.5rem',
            borderRadius: '50%', background: 'radial-gradient(circle, #fde68a, #d97706)',
            border: '6px solid #fbbf24', boxShadow: '0 0 30px rgba(251,191,36,0.5)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer'
          }} onClick={handlePerformCeremony}>
            <div style={{ fontSize: '3.5rem', animation: rakhiCeremonyDone ? 'none' : 'heartPulse 1.5s infinite' }}>
              {rakhiCeremonyDone ? '🪔✨🪢' : '✋'}
            </div>
            <p style={{ color: '#78350f', fontWeight: 800, fontSize: '0.8rem', marginTop: '0.5rem', margin: 0 }}>
              {rakhiCeremonyDone ? 'RAKHI TIED!' : 'Tap to Place Wrist & Tie'}
            </p>
          </div>

          {rakhiCeremonyDone ? (
            <div>
              <p style={{ fontSize: '1.1rem', color: '#fde68a', fontWeight: 800, marginBottom: '1.5rem' }}>
                🎉 Happy Raksha Bandhan, {recipient}! ❤️
              </p>
              <button className="rakhi-btn-glowing" onClick={() => setStage(9)}>
                Read Sister's Blessing ➔
              </button>
            </div>
          ) : (
            <button className="rakhi-btn-glowing" onClick={handlePerformCeremony}>
              🪔 Perform Rakhi Ritual ➔
            </button>
          )}
        </div>
      )}

      {/* ── STAGE 9: Blessing Screen ── */}
      {stage === 9 && (
        <div className="text-center" style={{ padding: '2rem 1rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>✨🕊️✨</div>
          <h2 style={{ fontSize: '1.8rem', color: '#fde68a', fontFamily: 'Georgia, serif', marginBottom: '1.5rem' }}>
            Sister's Blessing
          </h2>

          <div style={{ background: 'rgba(0,0,0,0.35)', border: '2px solid #fbbf24', borderRadius: '20px', padding: '1.75rem 1.25rem', maxWidth: '480px', margin: '0 auto 2rem', minHeight: '130px', textAlign: 'left' }}>
            <p style={{ fontSize: '1.05rem', color: '#fff', lineHeight: 1.8, margin: 0, fontFamily: 'Georgia, serif' }}>
              {typedBlessing}
              <span className="blinking-cursor" />
            </p>
          </div>

          <button className="rakhi-btn-glowing" onClick={() => setStage(10)}>
            Take Brother Meter Quiz 😂 ➔
          </button>
        </div>
      )}

      {/* ── STAGE 10: Brother Meter Quiz ── */}
      {stage === 10 && (
        <div className="text-center" style={{ padding: '1.5rem 1rem' }}>
          <span style={{ fontSize: '3rem' }}>😎</span>
          <h2 style={{ fontSize: '1.6rem', color: '#fde68a', margin: '0.5rem 0' }}>The Brother Meter Quiz</h2>
          <p style={{ fontSize: '0.9rem', color: '#fed7aa', marginBottom: '1.5rem' }}>
            Quick question: Who's the absolute best brother in the whole wide world?
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '340px', margin: '0 auto 1.5rem' }}>
            {['😎 Me', '😎 Obviously Me', '😎 Still Me'].map((opt, idx) => (
              <button
                key={idx}
                className="rakhi-btn-glowing"
                onClick={() => setQuizAnswered(true)}
                style={{ background: 'linear-gradient(135deg, #fbbf24, #d97706)', color: '#451a03' }}
              >
                {opt}
              </button>
            ))}
          </div>

          {quizAnswered && (
            <div style={{ background: 'rgba(251,191,36,0.2)', padding: '1rem', borderRadius: '12px', border: '1px solid #fbbf24', marginBottom: '1.5rem' }}>
              <p style={{ margin: 0, color: '#fde68a', fontWeight: 800 }}>
                100% CORRECT ANSWER! 🎉 No arguments there! 😄
              </p>
            </div>
          )}

          <button className="rakhi-btn-glowing" onClick={() => setStage(11)}>
            Open Secret Gift Box 🎁 ➔
          </button>
        </div>
      )}

      {/* ── STAGE 11: Secret Gift Box ── */}
      {stage === 11 && (
        <div className="text-center" style={{ padding: '1.5rem 1rem' }}>
          <h2 style={{ fontSize: '1.6rem', color: '#fde68a' }}>One Last Secret Surprise... 🎁</h2>
          <p style={{ fontSize: '0.85rem', color: '#fed7aa', marginBottom: '1.5rem' }}>
            Tap the gift box to unbox sister's letter
          </p>

          {!unboxedLetter ? (
            <div
              style={{ fontSize: '5rem', cursor: 'pointer', animation: 'heartPulse 1.5s infinite', margin: '1rem 0' }}
              onClick={() => setUnboxedLetter(true)}
            >
              🎁
            </div>
          ) : (
            <div style={{ background: 'linear-gradient(135deg, #fffbeb, #fef3c7)', color: '#78350f', border: '3px solid #fbbf24', borderRadius: '20px', padding: '1.5rem', maxWidth: '460px', margin: '0 auto 1.5rem', textAlign: 'left' }}>
              <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '0.5rem' }}>📜</span>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'Georgia, serif' }}>
                {unboxingLetter}
              </p>
            </div>
          )}

          <button className="rakhi-btn-glowing" onClick={() => setStage(12)} style={{ marginTop: '1rem' }}>
            Enter Shagun Ritual ➔
          </button>
        </div>
      )}

      {/* ── STAGE 12: Shagun Ritual Thali ── */}
      {stage === 12 && (
        <div className="text-center" style={{ padding: '1rem' }}>
          <span style={{ background: '#fbbf24', color: '#78350f', padding: '0.3rem 1rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>
            TRADITIONAL SHAGUN RITUAL 💸
          </span>
          <h2 style={{ fontSize: '1.6rem', color: '#fde68a', margin: '0.75rem 0 0.35rem' }}>
            Sister's Shagun Thali 🪔
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#fed7aa', maxWidth: '440px', margin: '0 auto 1rem' }}>
            "The Rakhi is tied & blessings are shared. If you'd like to continue the tradition, send your Shagun with love."
          </p>

          <div
            className="shagun-thali-plate"
            onClick={() => note?.shagun_qr_url && setShowQrModal(true)}
            style={{ cursor: note?.shagun_qr_url ? 'pointer' : 'default' }}
          >
            {note?.shagun_qr_url ? (
              <div>
                <img
                  src={note.shagun_qr_url}
                  alt="Shagun UPI QR"
                  style={{ width: '135px', height: '135px', objectFit: 'cover', borderRadius: '12px', border: '3px solid #78350f', margin: '0 auto 0.35rem', background: '#fff' }}
                />
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#451a03', fontWeight: 800 }}>🔍 Tap to Enlarge QR 📱</p>
              </div>
            ) : (
              <div>
                <span style={{ fontSize: '3rem', display: 'block' }}>🪙🪔🌸</span>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#78350f', fontWeight: 800 }}>Sister's Blessing & Love 💛</p>
              </div>
            )}
          </div>

          {/* Full-Screen Zoomed QR Modal Popup */}
          {showQrModal && note?.shagun_qr_url && (
            <div style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 9999,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              padding: '1.5rem', backdropFilter: 'blur(8px)'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #fffbeb, #fef3c7)',
                padding: '1.75rem', borderRadius: '24px', border: '4px solid #fbbf24',
                textAlign: 'center', maxWidth: '320px', width: '100%', boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
              }}>
                <span style={{ background: '#f59e0b', color: '#fff', padding: '0.2rem 0.8rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>
                  📱 SCAN TO PAY SHAGUN
                </span>
                <h3 style={{ color: '#78350f', margin: '0.75rem 0 0.5rem', fontSize: '1.2rem' }}>UPI / GPay / PhonePe QR</h3>
                <img
                  src={note.shagun_qr_url}
                  alt="Zoomed Shagun QR"
                  style={{ width: '220px', height: '220px', objectFit: 'cover', borderRadius: '16px', border: '4px solid #78350f', margin: '0.5rem auto', background: '#fff' }}
                />
                <p style={{ fontSize: '0.8rem', color: '#92400e', margin: '0.5rem 0 1rem', fontStyle: 'italic' }}>
                  Scan with any UPI App or take a screenshot to import in Google Pay / PhonePe.
                </p>
                <button
                  className="rakhi-btn-glowing"
                  onClick={() => setShowQrModal(false)}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  ✕ Close QR Code
                </button>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '1.5rem' }}>
            {note?.shagun_qr_url && (
              <button className="rakhi-btn-glowing" onClick={() => setShowQrModal(true)} style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
                📱 Scan / Zoom QR
              </button>
            )}
            <button className="rakhi-btn-glowing" onClick={handleSendShagun}>
              ❤️ I've Sent It ➔
            </button>
            <button className="rakhi-btn-glowing" onClick={() => setStage(14)} style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid #fbbf24' }}>
              Skip to Final Message ➔
            </button>
          </div>
        </div>
      )}

      {/* ── STAGE 13: Celebration ── */}
      {stage === 13 && (
        <div className="text-center" style={{ padding: '2rem 1rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>🎉🎆✨</div>
          <h2 style={{ fontSize: '2rem', color: '#fbbf24', margin: '0 0 0.5rem' }}>
            Blessings Received! ❤️
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#fff', lineHeight: 1.7, maxWidth: '460px', margin: '0 auto 2rem' }}>
            Your love & blessings have reached your sister. May this sacred bond stay strong forever and ever.
          </p>
          <button className="rakhi-btn-glowing" onClick={() => setStage(14)}>
            View Final Memory Frame ➔
          </button>
        </div>
      )}

      {/* ── STAGE 14: Final Photo Frame & Starry Night ── */}
      {stage === 14 && (
        <div className="text-center" style={{ padding: '2rem 1rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🌌✨🪢</div>
          <h2 style={{ fontSize: '1.8rem', color: '#fde68a', fontFamily: 'Georgia, serif', margin: '0 0 0.5rem' }}>
            Forever & Always
          </h2>
          <p style={{ fontSize: '0.95rem', color: '#fed7aa', fontStyle: 'italic', maxWidth: '440px', margin: '0 auto 1.5rem' }}>
            "Some relationships are born. Some are chosen. But ours... is forever."
          </p>

          {photos.length > 0 && (
            <div style={{ width: '220px', height: '220px', margin: '0 auto 1.5rem', borderRadius: '20px', border: '4px solid #fbbf24', overflow: 'hidden', boxShadow: '0 0 30px rgba(251,191,36,0.4)' }}>
              <img src={photos[0].url} alt="Sibling Final Memory" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}

          <p style={{ fontSize: '1.1rem', color: '#fff', fontWeight: 800, margin: '0 0 0.25rem' }}>
            Happy Raksha Bandhan ❤️
          </p>
          <p style={{ fontSize: '0.9rem', color: '#fde68a', fontStyle: 'italic' }}>
            From Your Loving Sister
          </p>
        </div>
      )}

      {/* Conditional Replay Footer on Final Stage */}
      {stage >= 13 && (
        <ReplayAndMarketingFooter
          onReplay={() => {
            setStage(1);
            setDoorOpen(false);
            setOpenedEnvelopes({});
            setKnotsTied(0);
            setRakhiCeremonyDone(false);
            setQuizAnswered(false);
            setUnboxedLetter(false);
            setShagunSent(false);
            setShowConfetti(false);
          }}
          isPreview={isPreview}
        />
      )}
    </div>
  );
}

function ReplayAndMarketingFooter({ onReplay, isPreview = false }) {
  return (
    <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '2px dashed rgba(216, 30, 91, 0.25)', textAlign: 'center', width: '100%' }}>
      {/* 1. Replay Animation Button */}
      {onReplay && (
        <button
          type="button"
          onClick={onReplay}
          style={{
            background: 'linear-gradient(135deg, #fff1f2, #ffe4e6)',
            color: '#be185d',
            border: '2px solid #f472b6',
            borderRadius: '999px',
            padding: '0.6rem 1.4rem',
            fontSize: '0.85rem',
            fontWeight: 800,
            cursor: 'pointer',
            marginBottom: isPreview ? '0' : '1.75rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 4px 14px rgba(216, 30, 91, 0.15)',
            transition: 'transform 0.2s ease'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.04)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
        >
          🔄 Replay Surprise Animation
        </button>
      )}

      {/* 2. Retronote Marketing & Create CTA */}
      {!isPreview && (
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(255, 241, 242, 0.95), rgba(253, 230, 238, 0.95))',
            border: '2px solid #f472b6',
            borderRadius: '20px',
            padding: '1.5rem 1.25rem',
            maxWidth: '520px',
            margin: '0 auto',
            boxShadow: '0 8px 24px rgba(216, 30, 91, 0.12)',
            backdropFilter: 'blur(8px)'
          }}
        >
          <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.4rem', animation: 'heartPulse 2s infinite' }}>🎁✨</span>
          <h3 style={{ margin: '0 0 0.4rem 0', color: '#881337', fontSize: '1.15rem', fontWeight: 800 }}>
            Loved this surprise message?
          </h3>
          <p style={{ margin: '0 0 1.25rem 0', color: '#9f1239', fontSize: '0.875rem', lineHeight: 1.5 }}>
            Surprise your partner, best friend, or family with a custom interactive greeting card — complete with music, candles, rose blooms, & memory swiper!
          </p>
          <a
            href="/templates"
            style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #d81e5b, #be185d)',
              color: '#ffffff',
              padding: '0.75rem 1.6rem',
              borderRadius: '999px',
              fontWeight: 800,
              fontSize: '0.9rem',
              textDecoration: 'none',
              boxShadow: '0 4px 16px rgba(216, 30, 91, 0.35)',
              letterSpacing: '0.02em'
            }}
          >
            ✨ Craft a Surprise Note Now →
          </a>
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   PUZZLE REVEAL TEMPLATE (ID: puzzle)
   ========================================================================== */
function PuzzleTemplate({ note, isPreview = false }) {
  const recipient = note?.recipient_name || 'My Friend';
  const imageUrl = note?.image_urls?.[0] || 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800&auto=format&fit=crop';

  // 3x3 Grid of tiles (0 to 8)
  const initialTiles = [8, 0, 5, 1, 4, 7, 2, 6, 3];
  const [tiles, setTiles] = useState(initialTiles);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [solved, setSolved] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const checkSolved = (currentTiles) => {
    return currentTiles.every((val, idx) => val === idx);
  };

  const handleTileClick = (idx) => {
    if (solved) return;
    if (selectedIndex === null) {
      setSelectedIndex(idx);
    } else {
      const nextTiles = [...tiles];
      const temp = nextTiles[selectedIndex];
      nextTiles[selectedIndex] = nextTiles[idx];
      nextTiles[idx] = temp;
      setTiles(nextTiles);
      setSelectedIndex(null);

      if (checkSolved(nextTiles)) {
        setSolved(true);
        setShowConfetti(true);
      }
    }
  };

  const autoSolve = () => {
    setTiles([0, 1, 2, 3, 4, 5, 6, 7, 8]);
    setSolved(true);
    setShowConfetti(true);
  };

  return (
    <div className="puzzle-stage" style={{ textAlign: 'center', padding: '2.5rem 1.5rem', maxWidth: '540px', margin: '0 auto', background: '#ffffff', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.06)' }}>
      <ConfettiCannon active={showConfetti} duration={4000} />
      
      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-primary)', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
        Interactive Photo Puzzle
      </span>
      <h2 style={{ fontSize: '1.75rem', margin: '0 0 1.5rem', color: '#1c1917', fontWeight: 600, letterSpacing: '-0.02em' }}>
        A Secret for {recipient}
      </h2>

      {!solved ? (
        <div>
          <p style={{ fontSize: '0.9rem', color: '#78716c', marginBottom: '1.75rem', lineHeight: 1.6 }}>
            Tap any two tiles to swap their positions and reconstruct the memory.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '6px',
              maxWidth: '340px',
              margin: '0 auto 2rem',
              borderRadius: '16px',
              overflow: 'hidden',
              background: '#f5f5f4',
              padding: '6px',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.04)'
            }}
          >
            {tiles.map((tileVal, displayIdx) => {
              const row = Math.floor(tileVal / 3);
              const col = tileVal % 3;
              const isSelected = selectedIndex === displayIdx;

              return (
                <div
                  key={displayIdx}
                  onClick={() => handleTileClick(displayIdx)}
                  style={{
                    width: '100%',
                    aspectRatio: '1',
                    backgroundImage: `url(${imageUrl})`,
                    backgroundSize: '300% 300%',
                    backgroundPosition: `${col * 50}% ${row * 50}%`,
                    cursor: 'pointer',
                    borderRadius: '8px',
                    boxShadow: isSelected ? '0 0 0 3px #1c1917, 0 8px 16px rgba(0,0,0,0.12)' : '0 2px 4px rgba(0,0,0,0.05)',
                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                    transform: isSelected ? 'scale(0.96)' : 'scale(1)',
                    opacity: isSelected ? 0.9 : 1
                  }}
                />
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <button
              className="btn-secondary"
              onClick={autoSolve}
              style={{ fontSize: '0.85rem', padding: '0.6rem 1.25rem' }}
            >
              Auto Solve
            </button>
          </div>
        </div>
      ) : (
        <div style={{ animation: 'fadeIn 0.6s ease' }}>
          <div style={{ maxWidth: '340px', margin: '0 auto 1.5rem', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 12px 32px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.06)' }}>
            <img src={imageUrl} alt="Revealed memory" style={{ width: '100%', display: 'block' }} />
          </div>

          {note?.custom_details?.hidden_message && (
            <div style={{ background: '#fafaf9', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '14px', padding: '1.25rem', marginBottom: '1.5rem', textAlign: 'left' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#78716c', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.35rem' }}>Hidden Note Unlocked</span>
              <p style={{ fontSize: '1.05rem', fontWeight: 500, color: '#1c1917', margin: 0, fontStyle: 'italic' }}>
                &ldquo;{note.custom_details.hidden_message}&rdquo;
              </p>
            </div>
          )}

          <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.06)', marginBottom: '2rem', textAlign: 'left', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <h4 style={{ color: '#1c1917', margin: '0 0 0.5rem 0', fontWeight: 600 }}>Dear {recipient},</h4>
            <p style={{ fontSize: '1rem', lineHeight: 1.7, color: '#44403c', whiteSpace: 'pre-wrap' }}>
              {note?.custom_message || "You solved the puzzle! You mean the absolute world to me."}
            </p>
          </div>

          <ReplayAndMarketingFooter onReplay={() => { setTiles(initialTiles); setSolved(false); setSelectedIndex(null); setShowConfetti(false); }} isPreview={isPreview} />
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   FRIENDSHIP DAY TEMPLATE (ID: friendship)
   ========================================================================== */
function FriendshipTemplate({ note, isPreview = false }) {
  const [stage, setStage] = useState(1);
  const [swipeIdx, setSwipeIdx] = useState(0);
  const [swipeResults, setSwipeResults] = useState([]);
  const [curtainOpen, setCurtainOpen] = useState(false);
  const [wordSearchSolved, setWordSearchSolved] = useState(false);
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [contractSigned, setContractSigned] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const recipient = note?.recipient_name || 'Bestie';
  const senderName = note?.custom_details?.sender_name || 'Your Friend';
  const vibe = note?.custom_details?.vibe || 'funny';
  const yearsKnown = note?.custom_details?.years_known || '?';
  const oneLiner = note?.custom_details?.one_liner || 'Partners in all adventures!';
  const bondTraits = note?.custom_details?.bond_traits
    ? note.custom_details.bond_traits.split(',').map(t => t.trim()).filter(Boolean)
    : ['Loyal', 'Hilarious', 'Always There'];
  const message = note?.custom_message || `You are one of the rarest kind of friends in the world — someone who makes every moment feel like a celebration!`;
  const photoUrl = note?.image_urls?.[0] || null;

  // Memory swipe cards
  const memoryCards = [
    `That one inside joke only we understand 😂`,
    `2 AM random calls about literally nothing 📞`,
    `Being honest when it hurts — because you care 💬`,
    `Every trip, every plan, every chaotic adventure 🗺️`,
    `The silence that never felt awkward between us 🤝`,
  ];

  // Word search data — simple 6x6 grid embedding bond traits
  const wordSearchGrid = (() => {
    const size = 6;
    const grid = Array.from({ length: size }, () => Array(size).fill(''));
    const word = (bondTraits[0] || 'LOVE').toUpperCase().slice(0, 6);
    const row = 2;
    for (let i = 0; i < word.length && i < size; i++) grid[row][i] = word[i];
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let r = 0; r < size; r++)
      for (let c = 0; c < size; c++)
        if (!grid[r][c]) grid[r][c] = letters[Math.floor(Math.random() * letters.length)];
    return grid;
  })();

  const targetWord = (bondTraits[0] || 'LOVE').toUpperCase().slice(0, 6);
  const targetCells = Array.from({ length: targetWord.length }, (_, i) => `2-${i}`);

  const handleLetterClick = (key) => {
    if (wordSearchSolved) return;
    const next = selectedLetters.includes(key)
      ? selectedLetters.filter(k => k !== key)
      : [...selectedLetters, key];
    setSelectedLetters(next);
    const allSelected = targetCells.every(t => next.includes(t));
    if (allSelected) { setWordSearchSolved(true); }
  };

  const handleSwipe = (action) => {
    setSwipeResults(prev => [...prev, action]);
    if (swipeIdx < memoryCards.length - 1) {
      setSwipeIdx(prev => prev + 1);
    } else {
      setTimeout(() => setStage(3), 400);
    }
  };

  const stageLabel = ['', '🏛️ Museum of Us', '🃏 Memory Swipe', '🎭 Curtain Reveal', '🔍 Word Search', '📜 Friendship Contract'];

  return (
    <div style={{ background: 'linear-gradient(135deg, #fdf4ff, #fae8ff)', borderRadius: '24px', padding: '2rem 1.5rem', maxWidth: '600px', margin: '0 auto', textAlign: 'center', minHeight: '500px' }}>
      <ConfettiCannon active={showConfetti} duration={4000} />

      {/* Stage Progress */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {[1, 2, 3, 4, 5].map(s => (
          <span
            key={s}
            style={{
              width: '28px', height: '28px', borderRadius: '50%',
              background: stage === s ? '#c026d3' : stage > s ? '#a21caf' : '#e9d5ff',
              color: stage >= s ? '#fff' : '#7e22ce',
              fontWeight: 800, fontSize: '0.75rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.3s ease'
            }}
          >{s}</span>
        ))}
      </div>
      <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#a21caf', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>
        {stageLabel[stage]}
      </p>

      {/* STAGE 1: Museum of Us */}
      {stage === 1 && (
        <div>
          <h2 style={{ fontSize: '1.75rem', color: '#7e22ce', margin: '0 0 0.5rem' }}>
            Welcome to the Museum of Us 🏛️
          </h2>
          <p style={{ color: '#6d28d9', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            Dedicated to <strong>{recipient}</strong> — {yearsKnown} years of beautiful chaos ✨
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
            {[
              { emoji: '🎭', title: 'Vibe', desc: vibe.charAt(0).toUpperCase() + vibe.slice(1) + ' & Chaotic' },
              { emoji: '⏳', title: 'Est.', desc: `Since ${new Date().getFullYear() - Number(yearsKnown) || '?'}` },
              { emoji: '🏆', title: 'Status', desc: 'Best Friends' },
            ].map((item, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: '12px', padding: '1rem 0.5rem', border: '2px solid #e879f9', boxShadow: '0 2px 8px rgba(192,38,211,0.1)' }}>
                <div style={{ fontSize: '1.8rem' }}>{item.emoji}</div>
                <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#a21caf', textTransform: 'uppercase', marginTop: '0.25rem' }}>{item.title}</div>
                <div style={{ fontSize: '0.8rem', color: '#6d28d9', fontWeight: 700 }}>{item.desc}</div>
              </div>
            ))}
          </div>

          <div style={{ background: '#fff', borderRadius: '16px', padding: '1.25rem', border: '2px dashed #d946ef', marginBottom: '1.5rem', textAlign: 'left' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#a21caf', textTransform: 'uppercase', marginBottom: '0.4rem' }}>🖼️ Exhibit A: One-Liner About Us</p>
            <p style={{ fontSize: '1.1rem', color: '#4a044e', fontStyle: 'italic' }}>&ldquo;{oneLiner}&rdquo;</p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '1.5rem' }}>
            {bondTraits.map((t, i) => (
              <span key={i} style={{ background: '#d946ef', color: '#fff', padding: '0.35rem 0.9rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700 }}>#{t}</span>
            ))}
          </div>

          <button
            onClick={() => setStage(2)}
            style={{ background: 'linear-gradient(135deg, #c026d3, #a21caf)', color: '#fff', border: 'none', borderRadius: '999px', padding: '0.75rem 2rem', fontSize: '1rem', fontWeight: 800, cursor: 'pointer' }}
          >
            Swipe Our Memories →
          </button>
        </div>
      )}

      {/* STAGE 2: Memory Swipe Cards */}
      {stage === 2 && (
        <div>
          <h2 style={{ fontSize: '1.5rem', color: '#7e22ce', margin: '0 0 0.5rem' }}>Memory Cards 🃏</h2>
          <p style={{ color: '#a21caf', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            Card {swipeIdx + 1} of {memoryCards.length} — Keep or Delete?
          </p>

          {swipeIdx < memoryCards.length && (
            <div style={{ background: '#fff', borderRadius: '20px', padding: '2rem 1.5rem', border: '3px solid #e879f9', boxShadow: '0 8px 24px rgba(192,38,211,0.15)', marginBottom: '1.5rem', minHeight: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p style={{ fontSize: '1.1rem', color: '#4a044e', lineHeight: 1.6 }}>{memoryCards[swipeIdx]}</p>
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button
              onClick={() => handleSwipe('delete')}
              style={{ background: '#fee2e2', color: '#dc2626', border: '2px solid #dc2626', borderRadius: '999px', padding: '0.65rem 1.5rem', fontWeight: 800, cursor: 'pointer', fontSize: '0.95rem' }}
            >
              🗑️ Delete
            </button>
            <button
              onClick={() => handleSwipe('keep')}
              style={{ background: '#dcfce7', color: '#16a34a', border: '2px solid #16a34a', borderRadius: '999px', padding: '0.65rem 1.5rem', fontWeight: 800, cursor: 'pointer', fontSize: '0.95rem' }}
            >
              💚 Keep Forever
            </button>
          </div>

          {swipeResults.length > 0 && (
            <p style={{ fontSize: '0.75rem', color: '#a21caf', marginTop: '0.75rem' }}>
              {swipeResults.filter(r => r === 'keep').length} memories kept 💜
            </p>
          )}
        </div>
      )}

      {/* STAGE 3: Curtain Reveal */}
      {stage === 3 && (
        <div>
          <h2 style={{ fontSize: '1.5rem', color: '#7e22ce', margin: '0 0 0.5rem' }}>Big Reveal 🎭</h2>
          <p style={{ color: '#a21caf', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            {recipient}, your friend wanted you to see this...
          </p>

          <div
            style={{ position: 'relative', width: '240px', height: '240px', margin: '0 auto 1.5rem', cursor: 'pointer', borderRadius: '16px', overflow: 'hidden', border: '4px solid #c026d3' }}
            onClick={() => setCurtainOpen(true)}
          >
            {photoUrl ? (
              <img src={photoUrl} alt="Friend reveal" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #d946ef, #a21caf)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem' }}>
                💜
              </div>
            )}
            {!curtainOpen && (
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(135deg, #7e22ce, #c026d3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'transform 0.6s ease',
                transform: curtainOpen ? 'translateX(100%)' : 'translateX(0)',
              }}>
                <div style={{ color: '#fff', fontSize: '1rem', fontWeight: 800 }}>🎭 Tap to Reveal</div>
              </div>
            )}
          </div>

          {!curtainOpen ? (
            <button
              onClick={() => setCurtainOpen(true)}
              style={{ background: 'linear-gradient(135deg, #c026d3, #a21caf)', color: '#fff', border: 'none', borderRadius: '999px', padding: '0.75rem 2rem', fontWeight: 800, cursor: 'pointer' }}
            >
              🎭 Open the Curtain
            </button>
          ) : (
            <div style={{ animation: 'sorryStepFadeIn 0.5s ease' }}>
              <p style={{ color: '#7e22ce', fontWeight: 700, marginBottom: '1rem' }}>There they are! 💜</p>
              <button
                onClick={() => setStage(4)}
                style={{ background: 'linear-gradient(135deg, #c026d3, #a21caf)', color: '#fff', border: 'none', borderRadius: '999px', padding: '0.75rem 2rem', fontWeight: 800, cursor: 'pointer' }}
              >
                Solve the Word Puzzle →
              </button>
            </div>
          )}
        </div>
      )}

      {/* STAGE 4: Mini Word Search */}
      {stage === 4 && (
        <div>
          <h2 style={{ fontSize: '1.5rem', color: '#7e22ce', margin: '0 0 0.5rem' }}>Word Search 🔍</h2>
          <p style={{ color: '#a21caf', fontSize: '0.85rem', marginBottom: '1rem' }}>
            Find &quot;<strong>{targetWord}</strong>&quot; hidden in the grid!
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: `repeat(6, 40px)`, gap: '4px', margin: '0 auto 1.5rem', width: 'fit-content' }}>
            {wordSearchGrid.map((row, r) =>
              row.map((letter, c) => {
                const key = `${r}-${c}`;
                const isTarget = targetCells.includes(key);
                const isSelected = selectedLetters.includes(key);
                return (
                  <div
                    key={key}
                    onClick={() => handleLetterClick(key)}
                    style={{
                      width: '40px', height: '40px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      borderRadius: '8px',
                      background: isSelected ? '#c026d3' : '#fff',
                      color: isSelected ? '#fff' : '#4a044e',
                      fontWeight: 800, fontSize: '0.9rem',
                      border: '2px solid ' + (isSelected ? '#a21caf' : '#e879f9'),
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      boxShadow: isSelected ? '0 0 8px rgba(192,38,211,0.4)' : 'none'
                    }}
                  >
                    {letter}
                  </div>
                );
              })
            )}
          </div>

          {wordSearchSolved ? (
            <div style={{ animation: 'sorryStepFadeIn 0.4s ease' }}>
              <p style={{ color: '#16a34a', fontWeight: 800, fontSize: '1.1rem', marginBottom: '1rem' }}>🎉 Found it! You&apos;re a pro!</p>
              <button
                onClick={() => setStage(5)}
                style={{ background: 'linear-gradient(135deg, #c026d3, #a21caf)', color: '#fff', border: 'none', borderRadius: '999px', padding: '0.75rem 2rem', fontWeight: 800, cursor: 'pointer' }}
              >
                Sign the Friendship Contract →
              </button>
            </div>
          ) : (
            <p style={{ fontSize: '0.75rem', color: '#a21caf' }}>Tap each letter to select — find the word in row 3!</p>
          )}
        </div>
      )}

      {/* STAGE 5: Friendship Contract + Letter */}
      {stage === 5 && (
        <div>
          <h2 style={{ fontSize: '1.5rem', color: '#7e22ce', margin: '0 0 0.5rem' }}>Friendship Contract 📜</h2>
          <p style={{ color: '#a21caf', fontSize: '0.85rem', marginBottom: '1.25rem' }}>Official & Binding — for life ✨</p>

          <div style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', border: '3px solid #c026d3', marginBottom: '1.25rem', textAlign: 'left', fontFamily: 'serif', boxShadow: '4px 4px 0 #a21caf' }}>
            <p style={{ fontWeight: 800, color: '#7e22ce', marginBottom: '0.5rem', fontSize: '0.9rem', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              📜 Official Friendship Agreement
            </p>
            <p style={{ fontSize: '0.9rem', color: '#4a044e', lineHeight: 1.7 }}>
              I, <strong>{senderName}</strong>, hereby declare that <strong>{recipient}</strong> is my official best friend, ride-or-die, and partner in every adventure, catastrophe, and inside joke known to mankind.
            </p>
            <p style={{ fontSize: '0.85rem', color: '#6d28d9', fontStyle: 'italic', marginTop: '0.75rem', lineHeight: 1.6 }}>{message}</p>
            {contractSigned && (
              <div style={{ textAlign: 'right', marginTop: '1rem', animation: 'sorryStepFadeIn 0.4s ease' }}>
                <div style={{ fontFamily: 'cursive', fontSize: '1.8rem', color: '#c026d3' }}>{senderName} 💜</div>
                <p style={{ fontSize: '0.7rem', color: '#a21caf' }}>Signed {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
            )}
          </div>

          {!contractSigned ? (
            <button
              onClick={() => { setContractSigned(true); setShowConfetti(true); }}
              style={{ background: 'linear-gradient(135deg, #c026d3, #a21caf)', color: '#fff', border: 'none', borderRadius: '999px', padding: '0.75rem 2rem', fontWeight: 800, cursor: 'pointer', fontSize: '1rem' }}
            >
              ✍️ Sign the Contract!
            </button>
          ) : (
            <div style={{ animation: 'sorryStepFadeIn 0.5s ease' }}>
              <p style={{ fontSize: '1.2rem', color: '#16a34a', fontWeight: 800 }}>Contract Signed! You&apos;re official besties! 💜🎉</p>
              <ReplayAndMarketingFooter onReplay={() => { setStage(1); setSwipeIdx(0); setSwipeResults([]); setCurtainOpen(false); setWordSearchSolved(false); setSelectedLetters([]); setContractSigned(false); setShowConfetti(false); }} isPreview={isPreview} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
