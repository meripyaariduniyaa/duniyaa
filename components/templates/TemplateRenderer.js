'use client';

import React, { useState, useEffect, useRef } from 'react';

export default function TemplateRenderer({ note, isPreview = false }) {
  if (!note) return null;

  const templateId = note.template || 'default';

  switch (templateId) {
    case 'sorry':
    case 'apology':
    case 'cute-apology':
      return <InteractiveApologyFlowTemplate note={note} isPreview={isPreview} />;
    case 'birthday-surprise':
      return <BirthdaySurpriseTemplate note={note} isPreview={isPreview} />;
    case 'love-letter':
      return <LoveLetterTemplate note={note} isPreview={isPreview} />;
    case 'letter-for-mom':
      return <LetterForMomTemplate note={note} isPreview={isPreview} />;
    case 'be-my-valentine':
      return <BeMyValentineTemplate note={note} isPreview={isPreview} />;
    case 'wedding-invitation':
      return <WeddingInvitationTemplate note={note} isPreview={isPreview} />;
    case 'surprise-reveal-box':
      return <SurpriseRevealBoxTemplate note={note} isPreview={isPreview} />;
    case 'a-rose-for-someone-special':
      return <RoseSpecialTemplate note={note} isPreview={isPreview} />;
    default:
      return <InteractiveApologyFlowTemplate note={note} isPreview={isPreview} />;
  }
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
    "I promise to always listen and never let anger win.",
    "I promise to give you extra hugs and make your smile my #1 priority.",
    "I promise to cherish you every single day and never take you for granted."
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
      <ReplayAndMarketingFooter onReplay={() => { setStep(1); setForgiven(false); setShowConfetti(false); setVibe('cute'); }} isPreview={isPreview} />
    </div>
  );
}

/* ==========================================================================
   2. CINEMATIC BIRTHDAY SURPRISE TEMPLATE (ID: birthday-surprise)
   ========================================================================== */
function BirthdaySurpriseTemplate({ note, isPreview = false }) {
  const [theme, setTheme] = useState('royal'); // 'royal', 'rainbow', 'bollywood'
  const [curtainsOpen, setCurtainsOpen] = useState(false);
  const [candlesBlown, setCandlesBlown] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const recipient = note?.recipient_name || 'Birthday Star';
  const customMsg = note?.custom_message || "Wishing you a year filled with endless laughter, boundless happiness, and all your heart's desires. Happy Birthday!";

  const handleBlowCandles = () => {
    setCandlesBlown(true);
    setShowConfetti(true);
  };

  return (
    <div className={`birthday-stage theme-${theme}`}>
      <ConfettiCannon active={showConfetti} duration={4000} />

      <div style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#ffe4e6' }}>
        🎂 CINEMATIC BIRTHDAY SURPRISE
      </div>
      <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', color: '#fff', margin: '0.5rem 0 1rem' }}>
        Happy Birthday {recipient}! 🎉
      </h1>

      {/* Theme Picker */}
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
        {[
          { id: 'royal', label: '👑 Royal Red' },
          { id: 'rainbow', label: '🌈 Rainbow Party' },
          { id: 'bollywood', label: '🎬 Bollywood Marquee' }
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
            style={{
              padding: '0.4rem 0.8rem',
              borderRadius: '999px',
              border: '2px solid #ffd700',
              background: theme === t.id ? '#ffd700' : 'rgba(0,0,0,0.4)',
              color: theme === t.id ? '#3b0f1b' : '#fff',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Theatrical Curtain Stage */}
      <div className={`curtain-wrapper ${curtainsOpen ? 'curtain-open' : ''}`}>
        <div className="curtain-left">🎭</div>
        <div className="curtain-right">✨</div>

        <div style={{ padding: '2rem 1rem', textAlign: 'center', position: 'relative', zIndex: 2 }}>
          {!candlesBlown ? (
            <div>
              <div className="birthday-cake-container" onClick={handleBlowCandles} title="Tap cake to blow out candles!">
                <div className="candle-flames">
                  <span className="flame pulse-flame">🔥</span>
                  <span className="flame pulse-flame" style={{ animationDelay: '0.2s' }}>🔥</span>
                  <span className="flame pulse-flame" style={{ animationDelay: '0.4s' }}>🔥</span>
                </div>
                <div className="cake-3d-model">🎂</div>
              </div>
              <p className="tap-cake-prompt">
                ✨ Tap the cake to blow out your birthday candles & make a wish! ✨
              </p>
            </div>
          ) : (
            <div style={{ animation: 'zoomIn 0.5s ease' }}>
              <div style={{ fontSize: '4.5rem', animation: 'spin 1s ease' }}>🥳🎈🎉</div>
              <h2 style={{ color: '#ffd700', fontSize: '1.75rem', marginTop: '0.5rem', textShadow: '0 0 10px rgba(255, 215, 0, 0.8)' }}>
                Wish Granted! 🎉
              </h2>
              <p style={{ color: '#fff', fontSize: '0.95rem' }}>Your year ahead is blessed with magical moments.</p>
            </div>
          )}
        </div>
      </div>

      {!curtainsOpen ? (
        <button
          onClick={() => setCurtainsOpen(true)}
          className="btn-primary"
          style={{ background: '#ffd700', color: '#3b0f1b', border: '3px solid #3b0f1b', fontWeight: 800, fontSize: '1.05rem', padding: '0.85rem 2rem', cursor: 'pointer' }}
        >
          🎪 Tap to Rise Curtains & Read Card
        </button>
      ) : (
        <div className="birthday-card-reveal">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🎈</span>
            <h3 style={{ color: '#ff4b2b', fontSize: '1.3rem', margin: 0 }}>Dearest {recipient},</h3>
            <span style={{ fontSize: '1.5rem' }}>⭐</span>
          </div>

          <p style={{ fontSize: '1.05rem', lineHeight: 1.8, whiteSpace: 'pre-wrap', color: '#2c0c14' }}>
            {customMsg}
          </p>

          {note.image_urls?.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', marginTop: '1.5rem' }}>
              {note.image_urls.map((url, i) => (
                <div key={i} className="birthday-photo-frame">
                  <img src={url} alt="Birthday Memory" />
                </div>
              ))}
            </div>
          )}

          <div className="cursive" style={{ marginTop: '2rem', textAlign: 'right', fontSize: '2rem', color: '#ff416c' }}>
            Sending grand hugs & sweetness ❤️
          </div>
        </div>
      )}
      <ReplayAndMarketingFooter onReplay={() => { setCurtainsOpen(false); setCandlesBlown(false); setShowConfetti(false); }} isPreview={isPreview} />
    </div>
  );
}

/* ==========================================================================
   3. HANDWRITTEN LOVE LETTER TEMPLATE (ID: love-letter)
   ========================================================================== */
function LoveLetterTemplate({ note, isPreview = false }) {
  const [stationery, setStationery] = useState('classic'); // 'classic', 'floral', 'midnight', 'vintage'
  const [unsealed, setUnsealed] = useState(false);
  const [typedLines, setTypedLines] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  const recipient = note?.recipient_name || 'My Love';
  const customMsg = note?.custom_message || "I cherish every single moment with you. You bring warmth, beauty, and joy to my world. Thank you for being you.";

  // Pen-on-paper typing effect
  useEffect(() => {
    if (unsealed) {
      setTypedLines('');
      let index = 0;
      const typeTimer = setInterval(() => {
        if (index < customMsg.length) {
          setTypedLines((prev) => prev + customMsg.charAt(index));
          index++;
        } else {
          clearInterval(typeTimer);
        }
      }, 40);
      return () => clearInterval(typeTimer);
    }
  }, [unsealed, customMsg]);

  const handleUnseal = () => {
    setUnsealed(true);
    setShowConfetti(true);
  };

  return (
    <div className={`love-letter-paper style-${stationery}`}>
      <ConfettiCannon active={showConfetti} heartOnly={true} />

      {/* Floating Petals background effect */}
      <div className="floating-petals-container">
        <span className="petal p1">🌸</span>
        <span className="petal p2">🌺</span>
        <span className="petal p3">🌸</span>
        <span className="petal p4">✨</span>
      </div>

      {/* Stationery Theme Switcher */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '2px dashed currentColor', paddingBottom: '0.75rem' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
          💌 CONFIDENTIAL LOVE LETTER
        </span>
        <div style={{ display: 'flex', gap: '0.35rem' }}>
          {[
            { id: 'classic', label: '📜 Classic' },
            { id: 'floral', label: '🌸 Floral' },
            { id: 'midnight', label: '🌙 Midnight' },
            { id: 'vintage', label: '🕯️ Vintage' }
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => setStationery(s.id)}
              className={`stationery-chip ${stationery === s.id ? 'active' : ''}`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {!unsealed ? (
        <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
          <div className="envelope-graphic">
            <div className="envelope-flap" />
            <div className="envelope-body">
              <p style={{ margin: '0.5rem 0 0', fontWeight: 700, fontSize: '1.1rem' }}>To {recipient}</p>
            </div>
          </div>

          <h2 style={{ fontSize: '1.5rem', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
            A letter written for {recipient}
          </h2>
          <p style={{ fontSize: '0.95rem', marginBottom: '1.5rem', opacity: 0.85 }}>
            Sealed with custom crimson wax. Tap below to unseal & open.
          </p>

          <button className="wax-seal-btn" onClick={handleUnseal} title="Tap Wax Seal to Unseal">
            💌
          </button>
          <p style={{ fontSize: '0.75rem', marginTop: '0.75rem', fontWeight: 700, letterSpacing: '0.1em' }}>
            TAP WAX SEAL TO UNSEAL
          </p>
        </div>
      ) : (
        <div style={{ animation: 'fadeIn 0.6s ease' }}>
          <h2 className="letter-header-name">
            Dearest {recipient},
          </h2>

          <div className="typewriter-handwriting-body">
            {typedLines}
            <span className="blinking-pen-cursor">🖋️</span>
          </div>

          {note.image_urls?.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginTop: '2rem' }}>
              {note.image_urls.map((url, i) => (
                <div key={i} className="letter-photo-polaroid">
                  <img src={url} alt="Cherished moment" />
                </div>
              ))}
            </div>
          )}

          <div className="letter-signature">
            Yours always,<br />
            <span className="cursive" style={{ fontSize: '2.2rem', color: '#b01432' }}>
              with all my heart ❤️
            </span>
          </div>
        </div>
      )}
      <ReplayAndMarketingFooter onReplay={() => { setUnsealed(false); setTypedText(''); }} isPreview={isPreview} />
    </div>
  );
}

/* ==========================================================================
   4. A LETTER FOR MOM TEMPLATE (ID: letter-for-mom)
   ========================================================================== */
function LetterForMomTemplate({ note, isPreview = false }) {
  const [secretRevealed, setSecretRevealed] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const recipient = note?.recipient_name || 'Mom';
  const customMsg = note?.custom_message || "Thank you for every meal, every warm cuddle, every sacrifice, and endless love. You are the strongest, sweetest person in my life.";

  const handleRevealSecret = () => {
    setSecretRevealed(true);
    setShowConfetti(true);
  };

  return (
    <div className="mom-card">
      <ConfettiCannon active={showConfetti} heartOnly={true} />

      <div className="floral-corner floral-top-left">🌸</div>
      <div className="floral-corner floral-bottom-right">🌺</div>

      <div className="text-center" style={{ marginBottom: '1.5rem' }}>
        <span style={{ background: '#fbcfe8', color: '#be185d', padding: '0.4rem 1.2rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          💐 TRIBUTE TO THE WORLD&apos;S BEST MOM
        </span>
        <h1 style={{ color: '#831843', fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', marginTop: '1rem' }}>
          Dearest Mom, {recipient}
        </h1>
      </div>

      <div className="mom-content-box">
        {/* Memory & Gratitude */}
        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ fontSize: '0.8rem', color: '#be185d', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
            🌸 Childhood Memory & Gratitude:
          </p>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.9, color: '#4c0519', whiteSpace: 'pre-wrap' }}>
            {customMsg}
          </p>
        </div>

        {note.image_urls?.length > 0 && (
          <div style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
            <p style={{ fontSize: '0.8rem', fontWeight: 800, color: '#be185d', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
              📸 Moments With Mom:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
              {note.image_urls.map((url, i) => (
                <img key={i} src={url} alt="Mom memory" style={{ width: '100%', height: '130px', objectFit: 'cover', borderRadius: '12px', border: '3px solid #f472b6' }} />
              ))}
            </div>
          </div>
        )}

        {/* Secret Note with Blooming Flower Animation */}
        <div className="secret-mom-note-box">
          {!secretRevealed ? (
            <button className="mom-secret-btn" onClick={handleRevealSecret}>
              🌸 Tap to reveal a secret note I never told you...
            </button>
          ) : (
            <div className="blooming-flower-reveal">
              <div className="flower-bloom-svg-anim">
                <svg viewBox="0 0 100 100" width="70" height="70">
                  <path d="M50 20 C40 5 20 20 35 35 C20 40 5 60 25 70 C30 85 50 90 50 75 C50 90 70 85 75 70 C95 60 80 40 65 35 C80 20 60 5 50 20 Z" fill="#f472b6" />
                  <circle cx="50" cy="50" r="12" fill="#ffd700" />
                </svg>
              </div>
              <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#be185d', marginTop: '0.5rem' }}>
                &ldquo;You are my hero, Ma. No matter where I go, your love is my anchor. Thank you for everything!&rdquo; ❤️
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="cursive" style={{ marginTop: '2rem', textAlign: 'center', fontSize: '2.4rem', color: '#be185d' }}>
        Thank you, Ma! ❤️
      </div>
      <ReplayAndMarketingFooter onReplay={() => { setSecretRevealed(false); setShowConfetti(false); }} isPreview={isPreview} />
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
    'No 💔',
    'Are you sure? 🥺',
    'Think again! 😜',
    'Wrong button! 🏃',
    'Cannot click me! 🙈',
    'Nice try! 😉',
    'Say YES! ❤️',
  ];

  const dodgeNoButton = () => {
    const randomTop = Math.floor(Math.random() * 140 - 70) + 'px';
    const randomLeft = Math.floor(Math.random() * 180 - 90) + 'px';
    setNoPosition({ top: randomTop, left: randomLeft });
    setNoCount((prev) => prev + 1);
  };

  const handleYes = () => {
    setAccepted(true);
    setShowConfetti(true);
  };

  return (
    <div className="valentine-card">
      <ConfettiCannon active={showConfetti} heartOnly={true} duration={5000} />

      <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>💖</div>
      <p style={{ color: '#e11d48', fontWeight: 800, fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
        VALENTINE PROPOSAL
      </p>

      {!accepted ? (
        <div>
          <h1 style={{ color: '#881337', fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', margin: '1rem 0' }}>
            {recipient}, Will You Be My Valentine? 🌹
          </h1>
          <p style={{ color: '#9f1239', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
            Choose wisely below! (Hint: The &apos;No&apos; button is shy 😉)
          </p>

          <div className="runaway-container">
            <button className="btn-yes-val" onClick={handleYes}>
              YES! Absolutely 💕
            </button>

            <button
              className="btn-no-val"
              style={{ position: 'relative', top: noPosition.top, left: noPosition.left }}
              onMouseEnter={dodgeNoButton}
              onClick={dodgeNoButton}
              onTouchStart={dodgeNoButton}
            >
              {noPhrases[noCount % noPhrases.length]}
            </button>
          </div>
        </div>
      ) : (
        <div style={{ animation: 'fadeIn 0.5s ease' }}>
          <div style={{ fontSize: '4.5rem' }}>🎉🥰💘</div>
          <h1 style={{ color: '#e11d48', fontSize: '2.2rem', margin: '0.5rem 0' }}>
            YAY! Best Decision Ever! ❤️
          </h1>
          <p style={{ color: '#9f1239', fontSize: '1rem', marginBottom: '2rem' }}>
            You just made me the happiest person in the universe!
          </p>

          <div style={{ background: '#fff', padding: '2rem', borderRadius: '20px', border: '3px solid #e11d48', textAlign: 'left', boxShadow: '4px 4px 0px #881337' }}>
            <h3 style={{ color: '#e11d48', fontSize: '1.2rem', marginBottom: '1rem' }}>For My Valentine {recipient}:</h3>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: '#4c0519', whiteSpace: 'pre-wrap' }}>
              {customMsg}
            </p>

            {note.image_urls?.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', marginTop: '1.5rem' }}>
                {note.image_urls.map((url, i) => (
                  <img key={i} src={url} alt="Valentine Memory" style={{ width: '100%', height: '130px', objectFit: 'cover', borderRadius: '12px', border: '3px solid #e11d48' }} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      <ReplayAndMarketingFooter onReplay={() => { setAccepted(false); setNoCount(0); setShowConfetti(false); }} isPreview={isPreview} />
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
        Wedding Invitation for {recipient}
      </h1>
      <p style={{ color: '#fde68a', fontSize: '0.95rem', fontStyle: 'italic', maxWidth: '550px', margin: '0 auto 1.5rem' }}>
        Together with their families, we cordially invite you to share in our sacred auspicious union.
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
            <p className="event-time">4:00 PM onwards</p>
          </div>
          <div className="event-card">
            <div className="event-icon">💃</div>
            <h4>Sangeet Sandhya</h4>
            <p className="event-time">7:30 PM onwards</p>
          </div>
          <div className="event-card">
            <div className="event-icon">🪔</div>
            <h4>Shubh Vivah</h4>
            <p className="event-time">10:00 AM auspicious muhurat</p>
          </div>
          <div className="event-card">
            <div className="event-icon">🎉</div>
            <h4>Grand Reception</h4>
            <p className="event-time">7:00 PM onwards</p>
          </div>
        </div>
      </div>

      {/* Map Location Link Button */}
      <div style={{ margin: '1.5rem 0' }}>
        <a
          href="https://maps.google.com"
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
      <ReplayAndMarketingFooter onReplay={() => { setRsvp(null); }} isPreview={isPreview} />
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
                You Are My Greatest Surprise!
              </h2>
              <p style={{ textAlign: 'center', fontSize: '1rem', color: '#8e3249' }}>
                Every layer opened, forever sealed with infinite love. ❤️
              </p>
            </div>
          )}
        </div>
      )}
      <ReplayAndMarketingFooter onReplay={() => { setStep(0); setShowConfetti(false); }} isPreview={isPreview} />
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
      <ReplayAndMarketingFooter onReplay={() => { setBloomed(false); setShowConfetti(false); }} isPreview={isPreview} />
    </div>
  );
}

/* ==========================================================================
   REPLAY ANIMATION & MARKETING CTA FOOTER
   ========================================================================== */
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
            href="/create"
            target="_blank"
            rel="noopener noreferrer"
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
