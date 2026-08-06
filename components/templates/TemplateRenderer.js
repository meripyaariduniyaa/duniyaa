'use client';

import React, { useState, useEffect } from 'react';

export default function TemplateRenderer({ note, isPreview = false }) {
  if (!note) return null;

  const templateId = note.template || 'default';

  switch (templateId) {
    case 'sorry':
    case 'apology':
    case 'cute-apology':
      return <InteractiveApologyFlowTemplate note={note} isPreview={isPreview} />;
    case 'memoryverse':
      return <MemoryverseTemplate note={note} isPreview={isPreview} />;
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
   0. MULTI-STEP ROMANTIC INTERACTIVE APOLOGY FLOW TEMPLATE
   ========================================================================== */
function InteractiveApologyFlowTemplate({ note }) {
  const [step, setStep] = useState(1);

  // Step 2: Cuteness Meter State
  const [cutenessCount, setCutenessCount] = useState(0);

  // Step 3: Tap Cards state
  const [revealedCards, setRevealedCards] = useState([false, false, false]);

  // Step 4: Polaroid Stack State
  const [topIndex, setTopIndex] = useState(0);

  // Step 5: Typewriter State
  const [typedText, setTypedText] = useState('');
  const [forgiven, setForgiven] = useState(false);

  // Audio Music state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioRef = React.useRef(null);

  const recipient = note?.recipient_name || 'cutiepie';
  const defaultApologyMessage = "Sorry bcha 🥺 I know mene gusse me jyada boldiyaa me galat tha. Please baat krlo I am sorry baby. Please forgive me if I hurt you or wasted even a little of your precious time. I promise I will do better. ❤️";
  const fullMessage = note?.custom_message || defaultApologyMessage;

  const defaultPhotos = [
    { url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800&auto=format&fit=crop', caption: "I'm sorry 🥺" },
    { url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=800&auto=format&fit=crop', caption: "Please forgive me 💕" },
    { url: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=800&auto=format&fit=crop', caption: "You mean everything 💖" }
  ];

  const photos = (note?.image_urls && note.image_urls.length > 0)
    ? note.image_urls.map((u, i) => ({
        url: u,
        caption: i === 0 ? "I'm sorry 🥺" : i === 1 ? "Please forgive me 💕" : "You mean everything 💖"
      }))
    : defaultPhotos;

  // Cuteness meter timer in Step 2
  useEffect(() => {
    if (step === 2) {
      setCutenessCount(0);
      const timer = setInterval(() => {
        setCutenessCount((prev) => {
          if (prev >= 120) {
            clearInterval(timer);
            return 120;
          }
          return prev + 2;
        });
      }, 35);
      return () => clearInterval(timer);
    }
  }, [step]);

  // Typewriter effect in Step 5
  useEffect(() => {
    if (step === 5) {
      setTypedText('');
      let index = 0;
      const typeTimer = setInterval(() => {
        if (index < fullMessage.length) {
          setTypedText((prev) => prev + fullMessage.charAt(index));
          index++;
        } else {
          clearInterval(typeTimer);
        }
      }, 35);
      return () => clearInterval(typeTimer);
    }
  }, [step, fullMessage]);

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

  const nextPolaroid = () => {
    setTopIndex((prev) => (prev + 1) % photos.length);
  };

  return (
    <div className="sorry-flow-container">
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

      {/* STEP 1: Landing Greeting */}
      {step === 1 && (
        <div className="sorry-flow-step">
          <div className="sorry-flow-sticker">
            <svg viewBox="0 0 120 120" width="110" height="110">
              <path d="M60 100 C20 80 10 50 25 30 C40 10 55 25 60 35 C65 25 80 10 95 30 C110 50 100 80 60 100 Z" fill="#ff4b8b" />
              <circle cx="45" cy="45" r="5" fill="#fff" />
              <circle cx="75" cy="45" r="5" fill="#fff" />
              <path d="M52 58 Q60 66 68 58" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
          <h1 className="sorry-flow-title">Hey {recipient}, cutiepie</h1>
          <p className="sorry-flow-subtitle">Do you even know how cute you are?</p>
          <button className="sorry-flow-btn-glowing" onClick={() => setStep(2)}>
            let&apos;s check 😜💖
          </button>
        </div>
      )}

      {/* STEP 2: Cuteness Meter */}
      {step === 2 && (
        <div className="sorry-flow-step">
          <h2 style={{ fontSize: '1.4rem', color: '#fbcfe8', fontWeight: 600 }}>
            Measuring your cuteness... ⏳
          </h2>
          <div className="meter-box">
            <div className="meter-counter">{cutenessCount}%</div>
            <div className="meter-bar-track">
              <div className="meter-bar-fill" style={{ width: `${Math.min(cutenessCount, 100)}%` }} />
            </div>
            {cutenessCount >= 120 && (
              <div className="cuteness-warning-badge">
                ⚠️ WARNING: TOO CUTE TO HANDLE
              </div>
            )}
          </div>
          <button className="sorry-flow-btn-glowing" onClick={() => setStep(3)}>
            Continue ➔
          </button>
        </div>
      )}

      {/* STEP 3: Tap-to-Reveal Cards */}
      {step === 3 && (
        <div className="sorry-flow-step">
          <h2 style={{ fontSize: '1.5rem', color: '#fff', fontWeight: 700, marginBottom: '0.25rem' }}>
            Tap each one to reveal 💖
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#fbcfe8', marginBottom: '1.25rem' }}>
            Tap all 3 cards to unlock my promises to you
          </p>

          <div className="tap-cards-grid">
            {[
              "I messed up... and I'm really sorry for that.",
              "I promise I'll be better for you.",
              "You mean the world to me and I hate making you sad."
            ].map((text, idx) => (
              <button
                key={idx}
                className={`tap-card-btn ${revealedCards[idx] ? 'revealed' : ''}`}
                onClick={() => toggleRevealCard(idx)}
              >
                <div className="tap-card-icon">
                  {revealedCards[idx] ? '💖' : '🔒'}
                </div>
                <div className="tap-card-text">
                  {revealedCards[idx] ? text : `Tap to reveal promise #${idx + 1}`}
                </div>
              </button>
            ))}
          </div>

          <button className="sorry-flow-btn-glowing" onClick={() => setStep(4)}>
            See more ➔
          </button>
        </div>
      )}

      {/* STEP 4: Photo Memory Deck / Swiper */}
      {step === 4 && (
        <div className="sorry-flow-step">
          <h2 style={{ fontSize: '1.5rem', color: '#fff', fontWeight: 700, margin: 0 }}>
            Some Sweet Moments
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#fbcfe8', margin: '0.25rem 0 1rem' }}>
            (Swipe or tap to switch cards)
          </p>

          <div className="polaroid-deck-container" onClick={nextPolaroid}>
            {photos.map((item, idx) => {
              const offset = (idx - topIndex + photos.length) % photos.length;
              const isTop = offset === 0;
              const rotDeg = isTop ? 0 : offset % 2 === 0 ? 6 : -6;
              const scaleVal = 1 - offset * 0.05;
              const translateYVal = offset * 10;

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

          <button className="sorry-flow-btn-glowing" onClick={() => setStep(5)}>
            Continue ➔
          </button>
        </div>
      )}

      {/* STEP 5: Typed Apology Note */}
      {step === 5 && (
        <div className="sorry-flow-step">
          <div className="sorry-flow-sticker" style={{ width: '90px', height: '90px', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '3.5rem' }}>💌</span>
          </div>
          <h2 className="sorry-flow-title" style={{ fontSize: '2.2rem' }}>
            A little note for you ✨
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
              onClick={() => setForgiven(true)}
            >
              Forgive Me 💕
            </button>
          ) : (
            <div style={{ animation: 'sorryStepFadeIn 0.5s ease-out' }}>
              <p style={{ fontSize: '1.5rem', color: '#34d399', fontWeight: 800, textShadow: '0 0 15px rgba(52, 211, 153, 0.8)' }}>
                Thank you baby! I love you so much ❤️🥰
              </p>
              <p style={{ fontSize: '0.9rem', color: '#fbcfe8', marginTop: '0.5rem' }}>
                Promise kept forever. ✨
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   1. MEMORYVERSE TEMPLATE
   ========================================================================== */
function MemoryverseTemplate({ note }) {
  const [activeMemory, setActiveMemory] = useState(null);
  const [unlocked, setUnlocked] = useState(false);
  const images = note.image_urls || [];

  return (
    <div className="memoryverse-container">
      <div className="memoryverse-stars" />
      <div className="text-center" style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>✨</div>
        <p style={{ color: '#c084fc', letterSpacing: '0.15em', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
          WELCOME TO THE MEMORYVERSE
        </p>
        <h1 style={{ color: '#fff', fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', margin: '0.5rem 0' }}>
          For {note.recipient_name}
        </h1>
        <p style={{ color: '#ddd6fe', fontSize: '0.9rem', maxWidth: '500px', margin: '0 auto 1.5rem' }}>
          A private galaxy of our moments and a secret reveal waiting for you.
        </p>

        {/* Orbiting Memory Nodes */}
        {images.length > 0 && (
          <div>
            <p style={{ fontSize: '0.8rem', color: '#a78bfa', marginBottom: '0.75rem' }}>
              ✦ Tap memory orbits to explore ✦
            </p>
            <div className="memoryverse-nodes">
              {images.map((url, idx) => (
                <button
                  key={idx}
                  className={`memoryverse-node ${activeMemory === idx ? 'active' : ''}`}
                  onClick={() => setActiveMemory(activeMemory === idx ? null : idx)}
                >
                  📸 Memory #{idx + 1}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Active Selected Memory View */}
        {activeMemory !== null && images[activeMemory] && (
          <div style={{ background: 'rgba(30, 16, 45, 0.9)', border: '2px solid #a855f7', padding: '1rem', borderRadius: '16px', margin: '1.5rem auto', maxWidth: '400px', boxShadow: '0 0 25px rgba(168, 85, 247, 0.4)' }}>
            <img src={images[activeMemory]} alt={`Memory ${activeMemory + 1}`} style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '12px', marginBottom: '0.75rem' }} />
            <p style={{ fontSize: '0.85rem', color: '#e9d5ff' }}>Captured Moment #{activeMemory + 1} with {note.recipient_name}</p>
          </div>
        )}

        {/* Reveal Central Core */}
        {!unlocked ? (
          <button
            onClick={() => setUnlocked(true)}
            style={{
              background: 'linear-gradient(135deg, #a855f7, #ec4899)',
              color: '#fff',
              border: 'none',
              padding: '1rem 2rem',
              borderRadius: '999px',
              fontWeight: 800,
              fontSize: '1rem',
              cursor: 'pointer',
              marginTop: '1.5rem',
              boxShadow: '0 0 25px rgba(236, 72, 153, 0.6)',
              transition: 'transform 0.2s',
            }}
          >
            🌌 Unlock Heartfelt Message
          </button>
        ) : (
          <div style={{ background: 'rgba(15, 7, 26, 0.95)', border: '2px solid #f0abfc', borderRadius: '20px', padding: '2rem', marginTop: '2rem', textAlign: 'left', boxShadow: '0 0 35px rgba(240, 171, 252, 0.4)' }}>
            <h3 style={{ color: '#f472b6', fontSize: '1.25rem', marginBottom: '1rem' }}>Dear {note.recipient_name},</h3>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: '#f3e8ff', whiteSpace: 'pre-wrap' }}>
              {note.custom_message}
            </p>
            <div className="cursive" style={{ marginTop: '2rem', color: '#f472b6', fontSize: '1.8rem' }}>
              ✦ In every universe, with love ✦
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ==========================================================================
   2. BIRTHDAY SURPRISE TEMPLATE
   ========================================================================== */
function BirthdaySurpriseTemplate({ note }) {
  const [curtainsOpen, setCurtainsOpen] = useState(false);
  const [candlesBlown, setCandlesBlown] = useState(false);

  return (
    <div className="birthday-stage">
      <div style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.5rem', color: '#ffe4e6' }}>
        🎂 BIRTHDAY MAGIC SURPRISE
      </div>
      <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.75rem)', color: '#fff', margin: '0.5rem 0 1.5rem' }}>
        Happy Birthday {note.recipient_name}! 🎉
      </h1>

      {/* Theatrical Curtain Box */}
      <div className={`curtain-wrapper ${curtainsOpen ? 'curtain-open' : ''}`}>
        <div className="curtain-left">🎭</div>
        <div className="curtain-right">✨</div>

        <div style={{ padding: '2rem', textAlign: 'center' }}>
          {!candlesBlown ? (
            <div>
              <div className="birthday-cake" onClick={() => setCandlesBlown(true)} title="Tap to blow out candles!">
                🎂🕯️
              </div>
              <p style={{ color: '#ffd700', fontWeight: 700, marginTop: '1rem', fontSize: '0.9rem' }}>
                👇 Tap the cake to blow out your birthday candles!
              </p>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: '4.5rem', animation: 'spin 1s ease' }}>🥳🎈🎉</div>
              <h2 style={{ color: '#ffd700', fontSize: '1.5rem', marginTop: '0.5rem' }}>Make a wish!</h2>
              <p style={{ color: '#fff', fontSize: '0.9rem' }}>Your wish is sealed with love.</p>
            </div>
          )}
        </div>
      </div>

      {!curtainsOpen ? (
        <button
          onClick={() => setCurtainsOpen(true)}
          className="btn-primary"
          style={{ background: '#ffd700', color: '#3b0f1b', border: '3px solid #3b0f1b', fontWeight: 800 }}
        >
          🎪 Open Curtains & Read Card
        </button>
      ) : (
        <div style={{ background: '#fff', color: '#3b0f1b', padding: '2rem', borderRadius: '20px', border: '4px solid #3b0f1b', boxShadow: '4px 4px 0px #3b0f1b', textAlign: 'left', marginTop: '1rem' }}>
          <h3 style={{ color: '#ff4b2b', fontSize: '1.25rem', marginBottom: '1rem' }}>Dearest {note.recipient_name},</h3>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
            {note.custom_message}
          </p>

          {note.image_urls?.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', marginTop: '1.5rem' }}>
              {note.image_urls.map((url, i) => (
                <img key={i} src={url} alt="Birthday Memory" style={{ width: '100%', height: '130px', objectFit: 'cover', borderRadius: '12px', border: '3px solid #3b0f1b' }} />
              ))}
            </div>
          )}

          <div className="cursive" style={{ marginTop: '2rem', textAlign: 'right', fontSize: '2rem', color: '#ff416c' }}>
            Sending endless hugs & sweetness ❤️
          </div>
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   3. LOVE LETTER TEMPLATE
   ========================================================================== */
function LoveLetterTemplate({ note }) {
  const [sealed, setSealed] = useState(true);

  return (
    <div className="love-letter-paper">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '2px dashed #d4af37', paddingBottom: '0.75rem' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', color: '#8b5e34', textTransform: 'uppercase' }}>
          💌 CONFIDENTIAL LOVE LETTER
        </span>
        <span style={{ fontSize: '1.2rem' }}>🌹</span>
      </div>

      {sealed ? (
        <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
          <h2 style={{ color: '#5c3a21', fontSize: '1.5rem', marginBottom: '1rem' }}>
            A letter written for {note.recipient_name}
          </h2>
          <p style={{ color: '#7f5539', fontSize: '0.95rem', marginBottom: '2rem' }}>
            This letter is sealed with crimson wax. Tap below to break the seal.
          </p>
          <button className="wax-seal-btn" onClick={() => setSealed(false)} title="Break Wax Seal">
            💌
          </button>
          <p style={{ fontSize: '0.75rem', color: '#9c6644', marginTop: '1rem', fontWeight: 600 }}>
            TAP WAX SEAL TO UNSEAL
          </p>
        </div>
      ) : (
        <div style={{ animation: 'fadeIn 0.6s ease' }}>
          <h2 style={{ color: '#5c3a21', fontSize: '1.75rem', marginBottom: '1.5rem', fontFamily: 'Georgia, serif' }}>
            My dearest {note.recipient_name},
          </h2>
          <p style={{ fontSize: '1.1rem', lineHeight: 2, color: '#3d2616', whiteSpace: 'pre-wrap', fontFamily: 'Georgia, serif' }}>
            {note.custom_message}
          </p>

          {note.image_urls?.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginTop: '2rem' }}>
              {note.image_urls.map((url, i) => (
                <img key={i} src={url} alt="Cherished moment" style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px', border: '2px solid #d4af37', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} />
              ))}
            </div>
          )}

          <div style={{ marginTop: '3rem', textAlign: 'right', fontFamily: 'Georgia, serif', fontStyle: 'italic', color: '#8b5e34', fontSize: '1.25rem' }}>
            Yours always,<br />
            <span className="cursive" style={{ fontSize: '2rem', color: '#b01432' }}>with all my heart</span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   4. LETTER FOR MOM TEMPLATE
   ========================================================================== */
function LetterForMomTemplate({ note }) {
  return (
    <div className="mom-card">
      <div className="floral-corner floral-top-left">🌸</div>
      <div className="floral-corner floral-bottom-right">🌺</div>

      <div className="text-center" style={{ marginBottom: '2rem' }}>
        <span style={{ background: '#fbcfe8', color: '#be185d', padding: '0.4rem 1rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          💐 FOR THE WORLD&apos;S BEST MOM
        </span>
        <h1 style={{ color: '#831843', fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', marginTop: '1rem' }}>
          Dearest Mom, {note.recipient_name}
        </h1>
      </div>

      <div style={{ background: '#fff', padding: '2rem', borderRadius: '20px', border: '2px solid #f472b6', boxShadow: ' inset 0 0 10px rgba(244, 114, 182, 0.1)' }}>
        <p style={{ fontSize: '1.05rem', lineHeight: 1.9, color: '#4c0519', whiteSpace: 'pre-wrap' }}>
          {note.custom_message}
        </p>

        {note.image_urls?.length > 0 && (
          <div style={{ marginTop: '2rem' }}>
            <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#be185d', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
              📸 Memories We Treasure:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
              {note.image_urls.map((url, i) => (
                <img key={i} src={url} alt="Mom memory" style={{ width: '100%', height: '130px', objectFit: 'cover', borderRadius: '12px', border: '3px solid #f472b6' }} />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="cursive" style={{ marginTop: '2rem', textAlign: 'center', fontSize: '2.2rem', color: '#be185d' }}>
        Thank you for everything, Mom! ❤️
      </div>
    </div>
  );
}

/* ==========================================================================
   5. BE MY VALENTINE TEMPLATE
   ========================================================================== */
function BeMyValentineTemplate({ note }) {
  const [accepted, setAccepted] = useState(false);
  const [noPosition, setNoPosition] = useState({ top: '0px', left: '0px' });
  const [noCount, setNoCount] = useState(0);

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
    const randomTop = Math.floor(Math.random() * 120 - 60) + 'px';
    const randomLeft = Math.floor(Math.random() * 160 - 80) + 'px';
    setNoPosition({ top: randomTop, left: randomLeft });
    setNoCount((prev) => prev + 1);
  };

  return (
    <div className="valentine-card">
      <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>💖</div>
      <p style={{ color: '#e11d48', fontWeight: 800, fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
        VALENTINE CONFESSION
      </p>

      {!accepted ? (
        <div>
          <h1 style={{ color: '#881337', fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', margin: '1rem 0' }}>
            {note.recipient_name}, Will You Be My Valentine? 🌹
          </h1>
          <p style={{ color: '#9f1239', fontSize: '0.95rem' }}>
            Choose wisely below! (Hint: There is only one right answer 😉)
          </p>

          <div className="runaway-container">
            <button className="btn-yes-val" onClick={() => setAccepted(true)}>
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
          <div style={{ fontSize: '4rem' }}>🎉🥰💘</div>
          <h1 style={{ color: '#e11d48', fontSize: '2rem', margin: '0.5rem 0' }}>
            YAY! Best Decision Ever! ❤️
          </h1>
          <p style={{ color: '#9f1239', fontSize: '0.95rem', marginBottom: '2rem' }}>
            You just made someone the happiest person on earth.
          </p>

          <div style={{ background: '#fff', padding: '2rem', borderRadius: '20px', border: '3px solid #e11d48', textAlign: 'left', boxShadow: '4px 4px 0px #881337' }}>
            <h3 style={{ color: '#e11d48', fontSize: '1.2rem', marginBottom: '1rem' }}>For My Valentine {note.recipient_name}:</h3>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: '#4c0519', whiteSpace: 'pre-wrap' }}>
              {note.custom_message}
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
    </div>
  );
}

/* ==========================================================================
   6. WEDDING INVITATION TEMPLATE
   ========================================================================== */
function WeddingInvitationTemplate({ note }) {
  const [rsvp, setRsvp] = useState(null);

  return (
    <div className="wedding-card">
      <div style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.2em', color: '#fbbf24', textTransform: 'uppercase' }}>
        💒 DIGITAL SAVE THE DATE
      </div>
      <h1 style={{ color: '#fef3c7', fontSize: 'clamp(1.75rem, 5vw, 3rem)', margin: '1rem 0 0.5rem', fontFamily: 'Georgia, serif' }}>
        Celebration for {note.recipient_name}
      </h1>
      <p style={{ color: '#fde68a', fontSize: '0.95rem', fontStyle: 'italic' }}>
        Together with their families, invite you to share in their special moment.
      </p>

      {/* Countdown timer mockup */}
      <div className="wedding-timer">
        <div className="timer-box"><div className="timer-num">14</div><div className="timer-label">Days</div></div>
        <div className="timer-box"><div className="timer-num">08</div><div className="timer-label">Hours</div></div>
        <div className="timer-box"><div className="timer-num">45</div><div className="timer-label">Mins</div></div>
        <div className="timer-box"><div className="timer-num">12</div><div className="timer-label">Secs</div></div>
      </div>

      <div style={{ background: 'rgba(255, 255, 255, 0.08)', border: '2px solid #fbbf24', padding: '2rem', borderRadius: '16px', margin: '2rem 0', textAlign: 'left' }}>
        <h3 style={{ color: '#fbbf24', fontSize: '1.25rem', marginBottom: '1rem', textTransform: 'uppercase' }}>Special Invitation Message</h3>
        <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: '#fff', whiteSpace: 'pre-wrap' }}>
          {note.custom_message}
        </p>

        {note.image_urls?.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', marginTop: '1.5rem' }}>
            {note.image_urls.map((url, i) => (
              <img key={i} src={url} alt="Save the date" style={{ width: '100%', height: '130px', objectFit: 'cover', borderRadius: '8px', border: '2px solid #fbbf24' }} />
            ))}
          </div>
        )}
      </div>

      {/* Interactive RSVP */}
      <div>
        <p style={{ fontSize: '0.85rem', color: '#fde68a', marginBottom: '1rem', fontWeight: 700 }}>
          PLEASE RESPOND (RSVP)
        </p>
        {!rsvp ? (
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => setRsvp('attending')} style={{ background: '#fbbf24', color: '#4c0519', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '999px', fontWeight: 800, cursor: 'pointer' }}>
              ✨ Joyfully Attending
            </button>
            <button onClick={() => setRsvp('regrets')} style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid #fbbf24', padding: '0.75rem 1.5rem', borderRadius: '999px', fontWeight: 700, cursor: 'pointer' }}>
              ❤️ Sending Love From Afar
            </button>
          </div>
        ) : (
          <div style={{ background: 'rgba(251, 191, 36, 0.2)', padding: '1rem', borderRadius: '12px', color: '#fbbf24', fontWeight: 700 }}>
            {rsvp === 'attending' ? '✓ Thank you! Your attendance has been recorded ✨' : '✓ Thank you for sending your heartfelt blessings ❤️'}
          </div>
        )}
      </div>
    </div>
  );
}

/* ==========================================================================
   7. MEMORY TIME CAPSULE TEMPLATE
   ========================================================================== */
function MemoryTimeCapsuleTemplate({ note }) {
  const [unlocked, setUnlocked] = useState(false);

  return (
    <div className="capsule-card">
      <div style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.2em', color: '#38bdf8', textTransform: 'uppercase' }}>
        ⏳ DIGITAL TIME CAPSULE
      </div>
      <h1 style={{ color: '#fff', fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', margin: '0.75rem 0' }}>
        Capsule for {note.recipient_name}
      </h1>
      <p style={{ color: '#93c5fd', fontSize: '0.9rem' }}>
        A vault of photos, voice memories, and words sealed for the future.
      </p>

      {!unlocked ? (
        <div>
          <div className="capsule-lock" onClick={() => setUnlocked(true)} title="Tap to unlock vault">
            🔒
          </div>
          <p style={{ color: '#38bdf8', fontWeight: 700, fontSize: '0.85rem' }}>
            👇 TAP LOCK TO UNSEAL TIME CAPSULE
          </p>
        </div>
      ) : (
        <div style={{ animation: 'fadeIn 0.6s ease', marginTop: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🔓✨</div>
          <h2 style={{ color: '#38bdf8', fontSize: '1.5rem', marginBottom: '1.5rem' }}>Time Capsule Unlocked!</h2>

          <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '2px solid #38bdf8', padding: '2rem', borderRadius: '16px', textAlign: 'left' }}>
            <h3 style={{ color: '#7dd3fc', fontSize: '1.1rem', marginBottom: '1rem' }}>Sealed Message:</h3>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: '#f0f9ff', whiteSpace: 'pre-wrap' }}>
              {note.custom_message}
            </p>

            {note.image_urls?.length > 0 && (
              <div style={{ marginTop: '1.5rem' }}>
                <p style={{ fontSize: '0.8rem', color: '#7dd3fc', fontWeight: 700, marginBottom: '0.5rem' }}>UNSEALED MEMORIES:</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
                  {note.image_urls.map((url, i) => (
                    <img key={i} src={url} alt="Capsule Memory" style={{ width: '100%', height: '130px', objectFit: 'cover', borderRadius: '10px', border: '2px solid #38bdf8' }} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   8. OPEN WHEN LETTERS TEMPLATE
   ========================================================================== */
function OpenWhenLettersTemplate({ note }) {
  const [activeEnvelope, setActiveEnvelope] = useState(null);
  const images = note.image_urls || [];

  const envelopes = [
    { id: 1, title: 'Open Right Now! 📩', icon: '✉️', hint: 'Start here first' },
    { id: 2, title: `Open when you miss me... 🥺`, icon: '💌', hint: 'For lonely moments' },
    { id: 3, title: `Open when you need to smile 😁`, icon: '💖', hint: 'Instant happiness' },
    { id: 4, title: `Open when you have a hard day 🫂`, icon: '🧸', hint: 'A warm virtual hug' },
  ];

  return (
    <div>
      <div className="text-center" style={{ marginBottom: '2rem' }}>
        <p style={{ color: '#d81e5b', fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
          📩 MOOD-BASED ENVELOPE BUNDLE
        </p>
        <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', margin: '0.5rem 0' }}>
          Open When... Letters for {note.recipient_name}
        </h1>
        <p className="text-muted" style={{ fontSize: '0.9rem' }}>
          Tap an envelope whenever the moment feels right.
        </p>
      </div>

      <div className="open-when-grid">
        {envelopes.map((env) => (
          <div
            key={env.id}
            className={`envelope-card ${activeEnvelope === env.id ? 'opened' : ''}`}
            onClick={() => setActiveEnvelope(activeEnvelope === env.id ? null : env.id)}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{env.icon}</div>
            <h3 style={{ fontSize: '1rem', color: '#3b0f1b', marginBottom: '0.25rem' }}>{env.title}</h3>
            <p style={{ fontSize: '0.75rem', color: '#8e3249' }}>{env.hint}</p>
          </div>
        ))}
      </div>

      {/* Active Opened Letter View */}
      {activeEnvelope !== null && (
        <div style={{ background: '#fff', border: '4px solid #3b0f1b', borderRadius: '24px', padding: '2rem', marginTop: '2rem', boxShadow: '6px 6px 0px #3b0f1b', animation: 'fadeIn 0.4s ease' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ color: '#d81e5b', fontSize: '1.2rem' }}>
              {envelopes.find((e) => e.id === activeEnvelope)?.title}
            </h3>
            <button onClick={() => setActiveEnvelope(null)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>✖</button>
          </div>

          <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: '#3b0f1b', whiteSpace: 'pre-wrap' }}>
            {note.custom_message}
          </p>

          {images.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', marginTop: '1.5rem' }}>
              {images.map((url, i) => (
                <img key={i} src={url} alt="Envelope memory" style={{ width: '100%', height: '130px', objectFit: 'cover', borderRadius: '12px', border: '3px solid #3b0f1b' }} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   9. DIGITAL SCRAPBOOK TEMPLATE
   ========================================================================== */
function DigitalScrapbookTemplate({ note }) {
  const [page, setPage] = useState(1);
  const images = note.image_urls || [];

  return (
    <div className="scrapbook-desk">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '2px solid #78350f', paddingBottom: '0.75rem' }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#fde68a', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          📔 MEMORY KEEPSAKE SCRAPBOOK
        </span>
        <span style={{ fontSize: '0.8rem', color: '#fef3c7' }}>Page {page} of 3</span>
      </div>

      {page === 1 && (
        <div style={{ textAlign: 'center', padding: '2rem 0' }}>
          <h1 style={{ color: '#fde68a', fontSize: 'clamp(1.75rem, 5vw, 2.75rem)', textAlign: 'center', margin: '1rem 0' }}>
            {note.recipient_name}&apos;s Memory Album
          </h1>
          <p style={{ textAlign: 'center', color: '#fef3c7', fontSize: '1rem', maxWidth: '500px', margin: '0 auto 2rem' }}>
            A flipbook of polaroids, written stories, and unforgettable moments bound into one gift.
          </p>

          {images[0] && (
            <div className="polaroid-frame" style={{ maxWidth: '280px', margin: '0 auto 2rem' }}>
              <div className="tape-strip" />
              <img src={images[0]} alt="Cover Polaroid" style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '2px' }} />
              <p style={{ marginTop: '0.5rem', fontWeight: 700, fontSize: '0.9rem' }}>Cover Photo ✨</p>
            </div>
          )}
        </div>
      )}

      {page === 2 && (
        <div>
          <h2 style={{ color: '#fde68a', fontSize: '1.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>
            📸 Cherished Polaroids
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem' }}>
            {images.length > 0 ? (
              images.map((url, idx) => (
                <div key={idx} className="polaroid-frame">
                  <div className="tape-strip" />
                  <img src={url} alt={`Scrapbook memory ${idx + 1}`} style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
                  <p style={{ marginTop: '0.5rem', fontWeight: 700, fontSize: '0.85rem' }}>Moment #{idx + 1}</p>
                </div>
              ))
            ) : (
              <p style={{ textAlign: 'center', color: '#fef3c7' }}>No photos added yet.</p>
            )}
          </div>
        </div>
      )}

      {page === 3 && (
        <div style={{ background: '#fff', color: '#1e293b', padding: '2rem', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.3)' }}>
          <h2 style={{ color: '#78350f', fontSize: '1.5rem', marginBottom: '1rem' }}>Dear {note.recipient_name},</h2>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
            {note.custom_message}
          </p>
          <div className="cursive" style={{ marginTop: '2rem', textAlign: 'right', fontSize: '2rem', color: '#78350f' }}>
            Always in my thoughts ❤️
          </div>
        </div>
      )}

      {/* Page Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          style={{ background: '#fde68a', color: '#78350f', border: 'none', padding: '0.6rem 1.25rem', borderRadius: '12px', fontWeight: 800, cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.5 : 1 }}
        >
          ← Prev Page
        </button>
        <button
          disabled={page === 3}
          onClick={() => setPage((p) => Math.min(3, p + 1))}
          style={{ background: '#fde68a', color: '#78350f', border: 'none', padding: '0.6rem 1.25rem', borderRadius: '12px', fontWeight: 800, cursor: page === 3 ? 'not-allowed' : 'pointer', opacity: page === 3 ? 0.5 : 1 }}
        >
          Next Page →
        </button>
      </div>
    </div>
  );
}

/* ==========================================================================
   10. SURPRISE REVEAL BOX TEMPLATE
   ========================================================================== */
function SurpriseRevealBoxTemplate({ note }) {
  const [step, setStep] = useState(0); // 0: ribbon tied, 1: lid opened, 2: content revealed

  return (
    <div className="text-center">
      <p style={{ color: '#d81e5b', fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
        🎁 THEATRICAL SURPRISE REVEAL
      </p>
      <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', margin: '0.5rem 0 1.5rem' }}>
        A Gift Box for {note.recipient_name}
      </h1>

      {step < 2 ? (
        <div className="gift-box-wrapper">
          <div className="gift-box-3d" onClick={() => setStep((s) => s + 1)}>
            <div className="gift-ribbon-v" />
            <div className="gift-ribbon-h" />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>
              {step === 0 ? '🎀' : '✨'}
            </div>
          </div>

          <p style={{ color: '#d81e5b', fontWeight: 800, marginTop: '1.5rem', fontSize: '0.95rem' }}>
            {step === 0 ? '👇 Tap the gift box to untie ribbon!' : '👇 Tap box once more to pop open!'}
          </p>
        </div>
      ) : (
        <div style={{ animation: 'fadeIn 0.5s ease', background: '#fff', border: '4px solid #3b0f1b', borderRadius: '24px', padding: '2.5rem', boxShadow: '6px 6px 0px #3b0f1b', textAlign: 'left' }}>
          <div style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '1rem' }}>🎉🎁✨</div>
          <h2 style={{ color: '#d81e5b', fontSize: '1.5rem', textAlign: 'center', marginBottom: '1.5rem' }}>
            Surprise Unfolded for {note.recipient_name}!
          </h2>

          <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: '#3b0f1b', whiteSpace: 'pre-wrap' }}>
            {note.custom_message}
          </p>

          {note.image_urls?.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', marginTop: '1.5rem' }}>
              {note.image_urls.map((url, i) => (
                <img key={i} src={url} alt="Gift Memory" style={{ width: '100%', height: '130px', objectFit: 'cover', borderRadius: '12px', border: '3px solid #3b0f1b' }} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   11. ROSE SPECIAL TEMPLATE
   ========================================================================== */
function RoseSpecialTemplate({ note }) {
  const [bloomed, setBloomed] = useState(false);

  return (
    <div className="rose-special-container">
      <div style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.2em', color: '#ff4d7f', textTransform: 'uppercase' }}>
        🌹 CINEMATIC ROSE PRESENTATION
      </div>

      <div className="blooming-rose-icon" onClick={() => setBloomed(!bloomed)} title="Tap to bloom rose">
        🌹
      </div>

      <h1 style={{ color: '#fff', fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', margin: '1rem 0 0.5rem' }}>
        A Rose for {note.recipient_name}
      </h1>
      <p style={{ color: '#fecdd3', fontSize: '0.9rem', marginBottom: '2rem' }}>
        A petal that never fades, crafted with honest words.
      </p>

      <div style={{ background: 'rgba(13, 0, 4, 0.85)', border: '2px solid #e11d48', padding: '2rem', borderRadius: '20px', textAlign: 'left', boxShadow: '0 0 25px rgba(225, 29, 72, 0.4)' }}>
        <p style={{ fontSize: '1.05rem', lineHeight: 1.9, color: '#ffe4e6', whiteSpace: 'pre-wrap' }}>
          {note.custom_message}
        </p>

        {note.image_urls?.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', marginTop: '1.5rem' }}>
            {note.image_urls.map((url, i) => (
              <img key={i} src={url} alt="Rose memory" style={{ width: '100%', height: '130px', objectFit: 'cover', borderRadius: '12px', border: '2px solid #e11d48' }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ==========================================================================
   12. FLOWERS GIFT TEMPLATE
   ========================================================================== */
function GiftFlowersTemplate({ note }) {
  const [pickedFlowers, setPickedFlowers] = useState([]);

  const flowers = [
    { id: 'rose', name: 'Red Rose 🌹' },
    { id: 'sunflower', name: 'Sunflower 🌻' },
    { id: 'tulip', name: 'Pink Tulip 🌷' },
    { id: 'daisy', name: 'Daisy 🌼' },
    { id: 'cherry', name: 'Cherry Blossom 🌸' },
  ];

  const toggleFlower = (id) => {
    if (pickedFlowers.includes(id)) {
      setPickedFlowers(pickedFlowers.filter((f) => f !== id));
    } else {
      setPickedFlowers([...pickedFlowers, id]);
    }
  };

  return (
    <div className="flowers-wrapper">
      <div className="text-center" style={{ marginBottom: '1.5rem' }}>
        <p style={{ color: '#15803d', fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
          💐 DIGITAL FLOWER BOUQUET
        </p>
        <h1 style={{ color: '#14532d', fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', margin: '0.5rem 0' }}>
          Bouquet for {note.recipient_name}
        </h1>
        <p style={{ color: '#166534', fontSize: '0.9rem' }}>
          Tap flowers below to assemble a personal bouquet!
        </p>

        <div className="flower-picker">
          {flowers.map((f) => (
            <button
              key={f.id}
              className={`flower-chip ${pickedFlowers.includes(f.id) ? 'picked' : ''}`}
              onClick={() => toggleFlower(f.id)}
            >
              {f.name}
            </button>
          ))}
        </div>
      </div>

      <div style={{ background: '#fff', border: '3px solid #15803d', borderRadius: '20px', padding: '2rem', boxShadow: '4px 4px 0px #14532d' }}>
        <h3 style={{ color: '#15803d', fontSize: '1.25rem', marginBottom: '1rem' }}>
          Message with {pickedFlowers.length > 0 ? `${pickedFlowers.length} Flower(s)` : 'Your Bouquet'}:
        </h3>
        <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: '#14532d', whiteSpace: 'pre-wrap' }}>
          {note.custom_message}
        </p>

        {note.image_urls?.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', marginTop: '1.5rem' }}>
            {note.image_urls.map((url, i) => (
              <img key={i} src={url} alt="Floral memory" style={{ width: '100%', height: '130px', objectFit: 'cover', borderRadius: '12px', border: '2px solid #16a34a' }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ==========================================================================
   13. PERSONALIZED SONG TEMPLATE
   ========================================================================== */
function PersonalizedSongTemplate({ note }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const coverImage = note.image_urls?.[0] || '🎵';

  return (
    <div className="song-player-card">
      <div className="text-center">
        <p style={{ color: '#e11d48', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          🎵 RETRO MUSIC PLAYER
        </p>
        <h1 style={{ color: '#fff', fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', margin: '0.5rem 0' }}>
          A Song Dedicated to {note.recipient_name}
        </h1>

        {/* Spinning Vinyl Record */}
        <div className={`vinyl-disk ${isPlaying ? 'spinning' : ''}`}>
          {typeof coverImage === 'string' && coverImage.startsWith('http') ? (
            <img src={coverImage} alt="Album Cover" style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #fff' }} />
          ) : (
            <div className="vinyl-center">🎵</div>
          )}
        </div>

        {/* Animated Equalizer */}
        <div className="waveform-bar-container">
          <div className="bar" style={{ animationPlayState: isPlaying ? 'running' : 'paused' }} />
          <div className="bar" style={{ animationPlayState: isPlaying ? 'running' : 'paused', animationDelay: '0.2s' }} />
          <div className="bar" style={{ animationPlayState: isPlaying ? 'running' : 'paused', animationDelay: '0.4s' }} />
          <div className="bar" style={{ animationPlayState: isPlaying ? 'running' : 'paused', animationDelay: '0.1s' }} />
          <div className="bar" style={{ animationPlayState: isPlaying ? 'running' : 'paused', animationDelay: '0.3s' }} />
        </div>

        <button
          onClick={() => setIsPlaying(!isPlaying)}
          style={{ background: '#e11d48', color: '#fff', border: 'none', padding: '0.85rem 2rem', borderRadius: '999px', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', boxShadow: '0 0 20px rgba(225,29,72,0.5)', marginBottom: '2rem' }}
        >
          {isPlaying ? '⏸ Pause Track' : '▶ Play Dedicated Song'}
        </button>

        {/* Lyrics & Message Display */}
        <div style={{ background: '#18181b', border: '2px solid #27272a', borderRadius: '20px', padding: '2rem', textAlign: 'left' }}>
          <p style={{ color: '#e11d48', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '0.1em' }}>
            📜 SONG LYRICS / DEDICATION:
          </p>
          <p style={{ fontSize: '1.1rem', lineHeight: 2, color: '#f4f4f5', whiteSpace: 'pre-wrap', fontStyle: 'italic' }}>
            &ldquo;{note.custom_message}&rdquo;
          </p>

          {note.image_urls?.length > 1 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '0.75rem', marginTop: '1.5rem' }}>
              {note.image_urls.slice(1).map((url, i) => (
                <img key={i} src={url} alt="Song photo" style={{ width: '100%', height: '110px', objectFit: 'cover', borderRadius: '8px' }} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   14. PERSONALIZED AI IMAGE TEMPLATE
   ========================================================================== */
function PersonalizedAiImageTemplate({ note }) {
  const [activeFilter, setActiveFilter] = useState('oil');
  const images = note.image_urls || [];

  return (
    <div className="art-gallery-card">
      <div className="text-center">
        <p style={{ color: '#f59e0b', fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
          🎨 ART GALLERY EXHIBITION
        </p>
        <h1 style={{ color: '#fff', fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', margin: '0.5rem 0 1.5rem' }}>
          Art Collection for {note.recipient_name}
        </h1>

        {/* Style Filters */}
        <div className="filter-btn-group">
          <button className={`filter-btn ${activeFilter === 'oil' ? 'active' : ''}`} onClick={() => setActiveFilter('oil')}>🎨 Oil Paint</button>
          <button className={`filter-btn ${activeFilter === 'anime' ? 'active' : ''}`} onClick={() => setActiveFilter('anime')}>🌸 Anime</button>
          <button className={`filter-btn ${activeFilter === 'watercolor' ? 'active' : ''}`} onClick={() => setActiveFilter('watercolor')}>🖌️ Watercolor</button>
          <button className={`filter-btn ${activeFilter === 'vintage' ? 'active' : ''}`} onClick={() => setActiveFilter('vintage')}>🌆 Vintage</button>
          <button className={`filter-btn ${activeFilter === 'sketch' ? 'active' : ''}`} onClick={() => setActiveFilter('sketch')}>✏️ Charcoal</button>
        </div>

        {/* Gallery Frame */}
        {images.length > 0 ? (
          <div className={`gallery-frame filter-${activeFilter}`}>
            <img src={images[0]} alt="Art portrait" style={{ width: '100%', height: '260px', objectFit: 'cover', borderRadius: '4px' }} />
          </div>
        ) : (
          <div className="gallery-frame" style={{ background: '#374151', color: '#9ca3af', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p>Upload a memory photo to see artwork style previews!</p>
          </div>
        )}

        {/* Museum Plaque */}
        <div style={{ background: '#1f2937', border: '2px solid #f59e0b', borderRadius: '16px', padding: '1.5rem', marginTop: '1.5rem', textAlign: 'left' }}>
          <p style={{ color: '#f59e0b', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            PLAQUE DEDICATION:
          </p>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: '#f3f4f6', whiteSpace: 'pre-wrap' }}>
            {note.custom_message}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   15. DEFAULT NOTE TEMPLATE
   ========================================================================== */
function DefaultNoteTemplate({ note }) {
  return (
    <div className="glass-card" style={{ padding: '2.5rem', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'var(--accent-gradient)' }} />
      <p className="text-muted" style={{ fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
        DEAR {note.recipient_name}
      </p>

      <p style={{ fontSize: '1.05rem', whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
        {note.custom_message}
      </p>

      {note.image_urls?.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', marginTop: '2rem' }}>
          {note.image_urls.map((url, i) => (
            <img key={i} src={url} alt="Shared memory" style={{ width: '100%', height: '130px', objectFit: 'cover', borderRadius: '12px', border: '3px solid rgba(59, 15, 27, 0.9)', boxShadow: '2px 2px 0px rgba(59, 15, 27, 0.9)' }} />
          ))}
        </div>
      )}

      <p className="cursive" style={{ marginTop: '3rem', textAlign: 'left', fontSize: '2rem' }}>
        — from someone who cares
      </p>
    </div>
  );
}
