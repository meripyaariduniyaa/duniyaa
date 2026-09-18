'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';



/* ─────────────────────────────────────────────────────────
   BIRTHDAY EXPERIENCE
   Scenes:
   1. Splash — throw item at heart → burst
   2. Full-screen Happy Birthday (red bg)
   3. Gold burst → tree grows → heart leaves bloom
   4. Falling heart leaves + name reveal
   5. Cake scene — candle blow + cut
   6. Make a wish (shooting star)
   7. Balloon pop reveals
   8. Memory photos
   9. Envelope + handwritten letter
  10. Final happy birthday again
───────────────────────────────────────────────────────── */
export default function BirthdayExperience({ note, isPreview = false, onReachEnd }) {
  const [scene, setScene] = useState(1);


  const name = note?.recipient_name || 'Birthday Star';
  const senderName = note?.custom_details?.sender_name || '';
  const turningAge = note?.custom_details?.turning_age || '';
  const cakeType = note?.custom_details?.cake_type || 'chocolate';
  const balloonMessages = note?.custom_details?.balloon_messages || ['Happy Birthday! 🎂', 'You are amazing!', 'So proud of you!'];
  const letter = note?.custom_details?.letter || note?.custom_message || '';
  const photos = note?.image_urls || [];

  const finalSceneIndex = photos.length > 0 ? 11 : 10;

  useEffect(() => {
    if (scene === finalSceneIndex) {
      onReachEnd?.(true, () => setScene(1));
    }
  }, [scene, finalSceneIndex, onReachEnd]);



  const goNext = () => setScene((s) => s + 1);

  return (
    <div style={{ background: '#080810', minHeight: '100vh', fontFamily: "'Inter', sans-serif", overflow: 'hidden', position: 'relative' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&family=Dancing+Script:wght@600;700&family=Caveat:wght@500;700&display=swap');
        @keyframes confettiFall { 0%{transform:translateY(-20px) rotate(0);opacity:1} 100%{transform:translateY(110vh) rotate(720deg);opacity:0} }
        @keyframes heartFloat { 0%,100%{transform:translateY(0) rotate(-8deg);opacity:0.8} 50%{transform:translateY(-18px) rotate(8deg);opacity:1} }
        @keyframes glow-pulse { 0%,100%{box-shadow:0 0 20px rgba(251,191,36,0.3)} 50%{box-shadow:0 0 50px rgba(251,191,36,0.7)} }
        @keyframes shoot { 0%{transform:translate(0,0) rotate(-45deg);opacity:1} 100%{transform:translate(200px,-200px) rotate(-45deg);opacity:0} }
        @keyframes typewriter-cursor { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes leaf-fall { 0%{transform:translateY(-20px) rotate(0) scale(0.5);opacity:0} 20%{opacity:1} 100%{transform:translateY(100vh) rotate(360deg) scale(0.8);opacity:0} }
      `}</style>



      <AnimatePresence mode="wait">
        {scene === 1 && <SceneSplash key="s1" name={name} onNext={goNext} />}
        {scene === 2 && <SceneHBDFull key="s2" name={name} turningAge={turningAge} onNext={goNext} />}
        {scene === 3 && <SceneGoldTree key="s3" name={name} onNext={goNext} />}
        {scene === 4 && <SceneNameReveal key="s4" name={name} turningAge={turningAge} onNext={goNext} />}
        {scene === 5 && <SceneCake key="s5" cakeType={cakeType} name={name} onNext={goNext} />}
        {scene === 6 && <SceneWish key="s6" name={name} onNext={goNext} />}
        {scene === 7 && <SceneBalloons key="s7" messages={balloonMessages} onNext={goNext} />}
        {scene === 8 && photos.length > 0 && <SceneMemories key="s8" photos={photos} onNext={goNext} />}
        {scene === 8 && photos.length === 0 && <SceneEnvelope key="s8b" onOpen={goNext} />}
        {scene === 9 && photos.length > 0 && <SceneEnvelope key="s9" onOpen={goNext} />}
        {scene === 9 && photos.length === 0 && <SceneLetter key="s9b" letter={letter} senderName={senderName} name={name} onNext={goNext} />}
        {scene === 10 && photos.length > 0 && <SceneLetter key="s10" letter={letter} senderName={senderName} name={name} onNext={goNext} />}
        {scene === 10 && photos.length === 0 && <SceneFinal key="s10b" name={name} turningAge={turningAge} onEnd={() => onReachEnd?.(true, () => setScene(1))} />}
        {scene === 11 && <SceneFinal key="s11" name={name} turningAge={turningAge} onEnd={() => onReachEnd?.(true, () => setScene(1))} />}
      </AnimatePresence>
    </div>
  );
}

/* ── SCENE 1: Interactive SVG Splash — Magic Wand & Glowing Heart ── */
function SceneSplash({ name, onNext }) {
  const [thrown, setThrown] = useState(false);
  const [burst, setBurst] = useState(false);

  const handleThrow = () => {
    if (thrown) return;
    setThrown(true);
    setTimeout(() => {
      setBurst(true);
      setTimeout(onNext, 1200);
    }, 600);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at 50% 40%, #1e0915 0%, #080309 70%, #000000 100%)',
        padding: '2rem 1rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background SVG Bokeh Dots */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.4 }}>
        <defs>
          <radialGradient id="bokehGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="20%" cy="25%" r="120" fill="url(#bokehGlow)" />
        <circle cx="80%" cy="70%" r="160" fill="url(#bokehGlow)" />
        <circle cx="50%" cy="85%" r="90" fill="url(#bokehGlow)" />
      </svg>

      <motion.p
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{
          color: '#fb7185',
          fontSize: '0.85rem',
          fontWeight: 700,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          marginBottom: '2.5rem',
          textShadow: '0 0 12px rgba(244, 63, 94, 0.4)',
        }}
      >
        ✨ Tap to Start Celebration ✨
      </motion.p>

      {/* Target SVG Heart Box */}
      <div style={{ position: 'relative', width: 160, height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '3rem' }}>
        {/* Pulsing Aura Rings */}
        <motion.div
          animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            width: 140,
            height: 140,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(244,63,94,0.3) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <motion.div
          animate={burst ? { scale: [1, 2.8, 0], opacity: [1, 1, 0], rotate: [0, 45, 90] } : { scale: [1, 1.08, 1], y: [0, -6, 0] }}
          transition={burst ? { duration: 0.6, ease: 'easeOut' } : { duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ cursor: 'pointer', zIndex: 10 }}
          onClick={handleThrow}
        >
          {/* Main SVG Heart Icon */}
          <svg width="100" height="100" viewBox="0 0 24 24" fill="none">
            <defs>
              <linearGradient id="heartGrad" x1="0" y1="0" x2="24" y2="24">
                <stop offset="0%" stopColor="#ff4d6d" />
                <stop offset="50%" stopColor="#f43f5e" />
                <stop offset="100%" stopColor="#be185d" />
              </linearGradient>
              <filter id="heartGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#f43f5e" floodOpacity="0.6" />
              </filter>
            </defs>
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              fill="url(#heartGrad)"
              filter="url(#heartGlow)"
              stroke="#ffffff"
              strokeWidth="0.5"
            />
          </svg>
        </motion.div>

        {/* Burst SVG Sparkles when Hit */}
        {burst &&
          Array.from({ length: 16 }, (_, i) => {
            const angle = (i * 22.5 * Math.PI) / 180;
            const distance = 90 + (i % 3) * 30;
            return (
              <motion.div
                key={i}
                initial={{ x: 0, y: 0, opacity: 1, scale: 0.5 }}
                animate={{
                  x: Math.cos(angle) * distance,
                  y: Math.sin(angle) * distance,
                  opacity: [1, 0.8, 0],
                  scale: [1, 1.4, 0],
                  rotate: i * 45,
                }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                style={{ position: 'absolute', pointerEvents: 'none' }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24">
                  {i % 2 === 0 ? (
                    <path
                      d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
                      fill={['#fbbf24', '#f43f5e', '#a855f7', '#38bdf8'][i % 4]}
                    />
                  ) : (
                    <path
                      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                      fill={['#f43f5e', '#fbbf24', '#f472b6', '#38bdf8'][i % 4]}
                    />
                  )}
                </svg>
              </motion.div>
            );
          })}
      </div>

      {/* Projectile — Interactive Magic Wand Star */}
      <AnimatePresence>
        {!thrown && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: 120, y: -160, rotate: -720, scale: 0.4 }}
            transition={{ exit: { duration: 0.6, ease: 'easeInOut' } }}
            onClick={handleThrow}
            whileHover={{ scale: 1.15, rotate: 12 }}
            whileTap={{ scale: 0.9 }}
            style={{
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              zIndex: 20,
            }}
          >
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
              <defs>
                <linearGradient id="starGrad" x1="0" y1="0" x2="24" y2="24">
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
                <filter id="starGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#fbbf24" floodOpacity="0.8" />
                </filter>
              </defs>
              <path
                d="M12 2L14.85 8.76L22 9.27L16.54 13.97L18.18 21L12 17.27L5.82 21L7.46 13.97L2 9.27L9.15 8.76L12 2Z"
                fill="url(#starGrad)"
                filter="url(#starGlow)"
                stroke="#ffffff"
                strokeWidth="0.6"
              />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.p
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          color: '#cbd5e1',
          fontSize: '0.9rem',
          fontWeight: 600,
          marginTop: '1.75rem',
          letterSpacing: '0.05em',
        }}
      >
        Tap the Gold Star to launch the spell ⭐
      </motion.p>
    </motion.div>
  );
}

/* ── SCENE 2: Full-Screen SVG Animated HBD Celebration ── */
function SceneHBD({ name, turningAge, onNext }) { return null; } // alias
function SceneHBDFull({ name, turningAge, onNext }) {
  useEffect(() => {
    const t = setTimeout(onNext, 4200);
    return () => clearTimeout(t);
  }, [onNext]);

  // Generate SVG vector confetti items
  const confettiItems = Array.from({ length: 45 }, (_, i) => ({
    id: i,
    left: `${(i * 2.2 + 2) % 96}%`,
    delay: (i * 0.05).toFixed(2),
    duration: 2.2 + (i % 4) * 0.4,
    color: ['#ffffff', '#fbbf24', '#f43f5e', '#a855f7', '#38bdf8', '#4ade80'][i % 6],
    type: i % 3, // 0: star, 1: circle, 2: heart
    size: 14 + (i % 4) * 5,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #b91c1c 0%, #991b1b 40%, #7f1d1d 100%)',
        position: 'relative',
        overflow: 'hidden',
        padding: '2rem 1rem',
      }}
    >
      {/* SVG Animated Confetti Shower */}
      {confettiItems.map((c) => (
        <div
          key={c.id}
          style={{
            position: 'absolute',
            top: '-30px',
            left: c.left,
            animation: `confettiFall ${c.duration}s ${c.delay}s ease-in infinite`,
            pointerEvents: 'none',
            zIndex: 1,
          }}
        >
          <svg width={c.size} height={c.size} viewBox="0 0 24 24">
            {c.type === 0 && (
              <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill={c.color} />
            )}
            {c.type === 1 && <circle cx="12" cy="12" r="8" fill={c.color} />}
            {c.type === 2 && (
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                fill={c.color}
              />
            )}
          </svg>
        </div>
      ))}

      {/* Main Content Box */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 180, damping: 15 }}
        style={{ textAlign: 'center', position: 'relative', zIndex: 10 }}
      >
        {/* Vector SVG Birthday Cake with Flickering Flame */}
        <motion.div
          animate={{ scale: [1, 1.06, 1], y: [0, -4, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ width: 110, height: 110, margin: '0 auto 1.25rem', position: 'relative' }}
        >
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
            <defs>
              <linearGradient id="cakeBase" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fde68a" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
              <linearGradient id="cakeIcing" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#fecdd3" />
              </linearGradient>
              <filter id="flameGlow">
                <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#fbbf24" floodOpacity="0.9" />
              </filter>
            </defs>

            {/* Cake Stand */}
            <path d="M20 85 L80 85 L75 92 L25 92 Z" fill="#e2e8f0" />

            {/* Bottom Layer */}
            <rect x="22" y="58" width="56" height="27" rx="5" fill="url(#cakeBase)" />
            {/* Bottom Icing */}
            <path d="M22 58 Q 36 66 50 58 Q 64 66 78 58 L78 63 L22 63 Z" fill="url(#cakeIcing)" />

            {/* Top Layer */}
            <rect x="30" y="38" width="40" height="22" rx="4" fill="url(#cakeBase)" />
            {/* Top Icing */}
            <path d="M30 38 Q 40 44 50 38 Q 60 44 70 38 L70 42 L30 42 Z" fill="url(#cakeIcing)" />

            {/* Candle */}
            <rect x="47" y="22" width="6" height="17" rx="2" fill="#38bdf8" />

            {/* Animated Candle Flame */}
            <motion.path
              d="M50 8 C 55 15, 52 20, 50 22 C 48 20, 45 15, 50 8 Z"
              fill="#fbbf24"
              filter="url(#flameGlow)"
              animate={{
                d: [
                  "M50 8 C 55 15, 52 20, 50 22 C 48 20, 45 15, 50 8 Z",
                  "M50 6 C 56 14, 53 19, 50 22 C 47 19, 44 14, 50 6 Z",
                  "M50 8 C 55 15, 52 20, 50 22 C 48 20, 45 15, 50 8 Z",
                ],
                scale: [1, 1.15, 1],
              }}
              transition={{ duration: 0.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </svg>
        </motion.div>

        <h1
          style={{
            fontFamily: "'Dancing Script', cursive",
            fontSize: 'clamp(2.8rem, 11vw, 5.5rem)',
            color: '#ffffff',
            margin: 0,
            textShadow: '0 6px 25px rgba(0,0,0,0.4)',
            lineHeight: 1.05,
            fontWeight: 700,
          }}
        >
          Happy Birthday
        </h1>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          style={{
            fontFamily: "'Dancing Script', cursive",
            fontSize: 'clamp(2.2rem, 8vw, 4rem)',
            color: '#fde68a',
            margin: '0.4rem 0 0',
            textShadow: '0 4px 20px rgba(0,0,0,0.5)',
            fontWeight: 700,
          }}
        >
          {name}! 🎉
        </motion.h2>

        {turningAge && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            style={{
              color: 'rgba(255, 255, 255, 0.88)',
              fontSize: '1.25rem',
              fontWeight: 600,
              marginTop: '1.25rem',
              textShadow: '0 2px 10px rgba(0,0,0,0.3)',
            }}
          >
            Turning {turningAge} never looked this good ✨
          </motion.p>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ── SCENE 3: SVG Golden Burst → Magic Tree Grows → Heart Leaves Bloom ── */
function SceneGoldTree({ name, onNext }) {
  const [phase, setPhase] = useState(0); // 0: burst, 1: tree growth, 2: leaves bloom

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 700);
    const t2 = setTimeout(() => setPhase(2), 2100);
    const t3 = setTimeout(onNext, 4600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onNext]);

  // Leaf positions on tree crown
  const leaves = Array.from({ length: 24 }, (_, i) => {
    const angle = (i * 15 * Math.PI) / 180;
    const radius = 35 + (i % 4) * 18;
    return {
      id: i,
      x: 110 + Math.cos(angle) * radius,
      y: 120 - Math.sin(angle) * (radius * 0.7),
      color: ['#f43f5e', '#fbbf24', '#a855f7', '#38bdf8', '#4ade80', '#f472b6'][i % 6],
      scale: 0.8 + (i % 3) * 0.3,
    };
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse at 50% 60%, #291802 0%, #0d0701 60%, #000000 100%)',
        position: 'relative',
        overflow: 'hidden',
        padding: '2rem 1rem',
      }}
    >
      {/* Central Golden Burst Aura */}
      {phase >= 0 && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: phase >= 1 ? 0.8 : [0, 3], opacity: phase >= 1 ? 0.2 : [0, 1, 0] }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            width: 140,
            height: 140,
            borderRadius: '50%',
            background: 'radial-gradient(circle, #fbbf24 0%, #f59e0b 50%, transparent 100%)',
            filter: 'blur(20px)',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* SVG Magic Tree Canvas */}
      <div style={{ position: 'relative', width: 280, height: 340 }}>
        <svg viewBox="0 0 220 280" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
          <defs>
            <linearGradient id="goldTrunkGrad" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#78350f" />
              <stop offset="50%" stopColor="#b45309" />
              <stop offset="100%" stopColor="#fbbf24" />
            </linearGradient>

            <linearGradient id="branchGrad" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="#b45309" />
              <stop offset="100%" stopColor="#fde68a" />
            </linearGradient>

            <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#fbbf24" floodOpacity="0.8" />
            </filter>
          </defs>

          {/* Tree Trunk Base */}
          <motion.path
            d="M 104 260 L 106 180 Q 106 160 110 150 Q 114 160 114 180 L 116 260 Z"
            fill="url(#goldTrunkGrad)"
            filter="url(#goldGlow)"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: phase >= 1 ? 1 : 0 }}
            style={{ transformOrigin: 'bottom center' }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          />

          {/* Dynamic SVG Animated Branches */}
          <motion.path
            d="M 110 170 Q 80 140 50 100 M 110 170 Q 140 140 170 100 M 110 150 Q 90 120 75 80 M 110 150 Q 130 120 145 80 M 110 185 Q 70 160 40 130 M 110 185 Q 150 160 180 130"
            stroke="url(#branchGrad)"
            strokeWidth="4.5"
            fill="none"
            strokeLinecap="round"
            filter="url(#goldGlow)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: phase >= 1 ? 1 : 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
          />

          {/* Blooming SVG Heart Leaves */}
          {phase >= 2 &&
            leaves.map((leaf, i) => (
              <motion.g
                key={leaf.id}
                transform={`translate(${leaf.x}, ${leaf.y}) scale(${leaf.scale})`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: leaf.scale }}
                transition={{ delay: i * 0.05, type: 'spring', stiffness: 260, damping: 14 }}
              >
                <path
                  d="M0 6 C-3 0, -8 0, -8 4 C-8 8, 0 13, 0 15 C0 13, 8 8, 8 4 C8 0, 3 0, 0 6 Z"
                  fill={leaf.color}
                  stroke="#ffffff"
                  strokeWidth="0.4"
                  filter="url(#goldGlow)"
                />
              </motion.g>
            ))}
        </svg>

        {/* Falling SVG Hearts */}
        {phase >= 2 &&
          Array.from({ length: 14 }, (_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: 0,
                left: `${(i * 29 + 5) % 90}%`,
                animation: `leaf-fall ${2.5 + (i % 4) * 0.4}s ${(i * 0.18).toFixed(2)}s ease-in infinite`,
                pointerEvents: 'none',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  fill={['#f43f5e', '#fbbf24', '#a855f7', '#f472b6'][i % 4]}
                />
              </svg>
            </div>
          ))}
      </div>

      {phase >= 2 && (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{
            color: '#fde68a',
            fontFamily: "'Dancing Script', cursive",
            fontSize: '1.75rem',
            textAlign: 'center',
            marginTop: '1.25rem',
            textShadow: '0 0 15px rgba(251, 191, 36, 0.6)',
            fontWeight: 700,
          }}
        >
          Blooming with love for you 🌸
        </motion.p>
      )}
    </motion.div>
  );
}

/* ── SCENE 4: Name Reveal ── */
function SceneNameReveal({ name, turningAge, onNext }) {
  useEffect(() => { const t = setTimeout(onNext, 3500); return () => clearTimeout(t); }, [onNext]);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(ellipse at 50% 50%, #1a1000 0%, #080810 100%)', padding: '2rem' }}
    >
      <div style={{ textAlign: 'center' }}>
        {/* Falling hearts decoration */}
        {Array.from({ length: 15 }, (_, i) => (
          <div key={i} style={{ position: 'fixed', top: 0, left: `${(i * 37) % 100}%`, fontSize: 14 + (i % 4) * 6, color: ['#f43f5e', '#fbbf24', '#a855f7', '#f9a8d4'][i % 4], animation: `leaf-fall ${2 + (i % 4)}s ${(i * 0.15).toFixed(1)}s ease-in infinite`, pointerEvents: 'none' }}>♥</div>
        ))}

        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.2 }} style={{ fontSize: '3rem', marginBottom: '1rem' }}>✨</motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          style={{ fontFamily: "'Dancing Script', cursive", fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', color: '#fff', margin: '0 0 0.5rem', lineHeight: 1.15 }}
        >
          Happy Birthday,
        </motion.h1>
        <motion.h2
          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8, type: 'spring', stiffness: 200 }}
          style={{ fontFamily: "'Dancing Script', cursive", fontSize: 'clamp(2.5rem, 9vw, 5rem)', background: 'linear-gradient(135deg,#f59e0b,#fbbf24,#fde68a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: '0', lineHeight: 1.1 }}
        >
          {name}! 🎂
        </motion.h2>
        {turningAge && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }} style={{ color: '#94a3b8', fontSize: '1.1rem', marginTop: '1rem' }}>
            You're turning {turningAge} and you're absolutely glowing ✨
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}

/* ── SCENE 5: Birthday Video Presentation (Full Screen Mobile & Phone Mockup Desktop) ── */
function SceneCake({ cakeType, name, onNext }) {
  const [videoEnded, setVideoEnded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setIsMuted(videoRef.current.muted);
          })
          .catch((err) => {
            console.log('Unmuted autoplay blocked, retrying muted autoplay:', err);
            if (videoRef.current) {
              videoRef.current.muted = true;
              setIsMuted(true);
              videoRef.current.play().then(() => {
                setIsPlaying(true);
              }).catch(e => console.error('Muted autoplay failed:', e));
            }
          });
      }
    }
  }, []);

  const toggleMute = (e) => {
    if (e) e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const handleVideoTap = () => {
    if (videoRef.current) {
      if (videoRef.current.muted) {
        videoRef.current.muted = false;
        setIsMuted(false);
      } else if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="scene-cake-root"
      onClick={handleVideoTap}
    >
      <style jsx>{`
        .scene-cake-root {
          min-height: 100vh;
          min-height: 100dvh;
          width: 100%;
          background: #000000;
          overflow: hidden;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }

        .video-wrapper {
          position: relative;
          width: 100%;
          max-width: 420px;
          height: 80vh;
          max-height: 740px;
          aspect-ratio: 9 / 16;
          border-radius: 28px;
          overflow: hidden;
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.9), 0 0 35px rgba(244, 63, 94, 0.35);
          background: #000;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: 2px solid rgba(255, 255, 255, 0.15);
        }

        .video-element {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .sound-toggle-btn {
          position: absolute;
          top: 18px;
          right: 18px;
          z-index: 80;
          background: rgba(0, 0, 0, 0.65);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: #ffffff;
          font-size: 0.82rem;
          font-weight: 700;
          padding: 8px 16px;
          border-radius: 30px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
          transition: transform 0.2s ease, background 0.2s ease;
        }

        .sound-toggle-btn:hover {
          transform: scale(1.05);
          background: rgba(0, 0, 0, 0.85);
        }

        .controls-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 90;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          padding: 2.5rem 1.25rem 1.75rem 1.25rem;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.92) 0%, rgba(0, 0, 0, 0.5) 65%, transparent 100%);
          pointer-events: auto;
        }

        .video-ended-msg {
          color: #ffffff;
          font-weight: 700;
          font-size: 0.88rem;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8);
          margin: 0 0 0.75rem;
          text-align: center;
          background: rgba(255, 255, 255, 0.15);
          padding: 6px 18px;
          border-radius: 20px;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .make-wish-btn {
          padding: 14px 38px;
          border-radius: 50px;
          background: linear-gradient(135deg, #f43f5e 0%, #fbbf24 100%);
          border: 2px solid #ffffff;
          color: #ffffff;
          font-size: 1.05rem;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 8px 25px rgba(244, 63, 94, 0.5), 0 4px 12px rgba(0, 0, 0, 0.4);
          display: flex;
          align-items: center;
          gap: 8px;
          text-shadow: 0 1px 3px rgba(0,0,0,0.3);
          pointer-events: auto;
          position: relative;
          z-index: 100;
        }

        @media (max-width: 768px) {
          .scene-cake-root {
            position: fixed !important;
            inset: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            height: 100dvh !important;
            padding: 0 !important;
            margin: 0 !important;
            z-index: 99999 !important;
            background: #000000 !important;
          }

          .video-wrapper {
            position: absolute !important;
            inset: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            height: 100dvh !important;
            max-width: none !important;
            max-height: none !important;
            aspect-ratio: auto !important;
            border-radius: 0 !important;
            border: none !important;
            box-shadow: none !important;
          }

          .video-element {
            object-fit: cover !important;
          }

          .sound-toggle-btn {
            top: max(16px, env(safe-area-inset-top, 16px)) !important;
            right: 16px !important;
          }

          .controls-overlay {
            padding-bottom: max(32px, env(safe-area-inset-bottom, 32px)) !important;
          }
        }
      `}</style>

      {/* Video Container Box */}
      <div className="video-wrapper">
        <video
          ref={videoRef}
          src="https://res.cloudinary.com/vkcgnlm1/video/upload/v1789756064/Site_Assets/bmonvulpkw3gezai1iwk.mp4"
          autoPlay
          playsInline
          webkit-playsinline="true"
          onEnded={() => setVideoEnded(true)}
          className="video-element"
        />

        {/* Floating Sound Button */}
        <button
          type="button"
          className="sound-toggle-btn"
          onClick={toggleMute}
          title={isMuted ? "Click to unmute" : "Click to mute"}
        >
          <span>{isMuted ? '🔇 Tap for Sound' : '🔊 Sound On'}</span>
        </button>

        {/* Centered Controls Overlay inside video wrapper */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="controls-overlay"
          onClick={(e) => e.stopPropagation()}
        >
          {videoEnded && (
            <p className="video-ended-msg">
              ✨ Hope you enjoyed the video! Now time to make a wish!
            </p>
          )}
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNext}
            className="make-wish-btn"
          >
            <span>🎂 Make a Wish →</span>
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ── SCENE 6: Make a Wish ── */
function SceneWish({ name, onNext }) {
  const [wished, setWished] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(ellipse at 50% 30%, #05051a 0%, #080810 100%)', padding: '2rem', position: 'relative', overflow: 'hidden' }}
    >
      {/* Stars */}
      {Array.from({ length: 30 }, (_, i) => (
        <div key={i} style={{ position: 'absolute', left: `${(i * 37) % 100}%`, top: `${(i * 61) % 100}%`, width: 2 + (i % 3), height: 2 + (i % 3), borderRadius: '50%', background: '#fff', opacity: 0.3 + (i % 5) * 0.1 }} />
      ))}

      {/* Shooting star */}
      {wished && (
        <motion.div
          initial={{ x: -100, y: 100, opacity: 0 }}
          animate={{ x: 300, y: -150, opacity: [0, 1, 1, 0] }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          style={{ position: 'fixed', fontSize: '1.5rem', zIndex: 10 }}
        >
          ⭐
        </motion.div>
      )}

      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🌠</div>
        <h2 style={{ fontFamily: "'Dancing Script', cursive", fontSize: 'clamp(1.8rem, 6vw, 2.8rem)', color: '#fff', margin: '0 0 0.5rem' }}>
          Close your eyes, {name}...
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '2rem', lineHeight: 1.6 }}>
          Make a wish on this shooting star. Whatever you wish for — it's coming true. ✨
        </p>

        {!wished ? (
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(251,191,36,0.5)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { setWished(true); setTimeout(onNext, 2200); }}
            style={{ padding: '16px 40px', borderRadius: '50px', background: 'linear-gradient(135deg,#fbbf24,#f59e0b)', border: 'none', color: '#fff', fontSize: '1.05rem', fontWeight: 700, cursor: 'pointer' }}
          >
            🌟 Make a Wish!
          </motion.button>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center' }}>
            <p style={{ color: '#fde68a', fontSize: '1.1rem', fontFamily: "'Dancing Script', cursive" }}>Wish sent to the universe! ✨</p>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ── SCENE 7: Balloon Pop ── */
function SceneBalloons({ messages, onNext }) {
  const [popped, setPopped] = useState(new Set());
  const colors = ['#f43f5e', '#f59e0b', '#a855f7', '#38bdf8', '#4ade80'];
  const validMessages = messages.filter(Boolean);
  const allPopped = popped.size >= validMessages.length;

  const handlePop = (i) => {
    setPopped((prev) => new Set([...prev, i]));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(ellipse at 50% 40%, #0d051a 0%, #080810 100%)', padding: '2rem' }}
    >
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: '#94a3b8', fontSize: '0.82rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
        🎈 Pop the Balloons!
      </motion.p>
      <p style={{ color: '#475569', fontSize: '0.85rem', marginBottom: '2rem' }}>Each balloon has a hidden message inside</p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', justifyContent: 'center', maxWidth: '360px', marginBottom: '2rem' }}>
        {validMessages.map((msg, i) => (
          <div key={i} style={{ textAlign: 'center', width: '100px' }}>
            <AnimatePresence mode="wait">
              {!popped.has(i) ? (
                <motion.button
                  key="balloon"
                  whileHover={{ y: -8, scale: 1.08 }}
                  whileTap={{ scale: 1.3 }}
                  onClick={() => handlePop(i)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '3.5rem', display: 'block', margin: '0 auto', filter: `drop-shadow(0 4px 12px ${colors[i % 5]}66)` }}
                >
                  🎈
                </motion.button>
              ) : (
                <motion.div
                  key="message"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                  style={{ background: `${colors[i % 5]}20`, border: `1.5px solid ${colors[i % 5]}55`, borderRadius: '12px', padding: '10px 8px', fontSize: '0.78rem', color: '#fff', fontWeight: 600, lineHeight: 1.4 }}
                >
                  {msg}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {allPopped && (
          <motion.button
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            onClick={onNext}
            style={{ padding: '15px 36px', borderRadius: '50px', background: 'linear-gradient(135deg,#a855f7,#7c3aed)', border: 'none', color: '#fff', fontSize: '1rem', fontWeight: 700, cursor: 'pointer' }}
          >
            📸 See our memories →
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── SCENE 8: Memories ── */
function SceneMemories({ photos, onNext }) {
  const [current, setCurrent] = useState(0);
  if (!photos || photos.length === 0) { onNext(); return null; }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#080810', padding: '2rem' }}
    >
      <p style={{ color: '#64748b', fontSize: '0.8rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>📸 Our Memories</p>

      <AnimatePresence mode="wait">
        <motion.div key={current} initial={{ opacity: 0, x: 60, rotate: 3 }} animate={{ opacity: 1, x: 0, rotate: 0 }} exit={{ opacity: 0, x: -60 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          style={{ width: 260, background: '#fff', padding: '10px 10px 36px', borderRadius: '3px', boxShadow: '0 12px 40px rgba(0,0,0,0.6)' }}>
          <div style={{ width: '100%', height: 240, background: `url(${photos[current]}) center/cover`, borderRadius: '1px' }} />
          <p style={{ textAlign: 'center', fontFamily: "'Caveat', cursive", color: '#92400e', fontSize: '0.9rem', margin: '8px 0 0' }}>{current + 1} / {photos.length}</p>
        </motion.div>
      </AnimatePresence>

      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
        {current > 0 && <button onClick={() => setCurrent((c) => c - 1)} style={{ padding: '10px 20px', borderRadius: '50px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', cursor: 'pointer' }}>←</button>}
        {current < photos.length - 1
          ? <button onClick={() => setCurrent((c) => c + 1)} style={{ padding: '10px 24px', borderRadius: '50px', background: 'linear-gradient(135deg,#f59e0b,#b45309)', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 700 }}>Next →</button>
          : <button onClick={onNext} style={{ padding: '10px 24px', borderRadius: '50px', background: 'linear-gradient(135deg,#f43f5e,#be123c)', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 700 }}>💌 Open Letter</button>
        }
      </div>
    </motion.div>
  );
}

/* ── SCENE 9: Envelope ── */
function SceneEnvelope({ onOpen }) {
  const [opening, setOpening] = useState(false);
  const handleOpen = () => { setOpening(true); setTimeout(onOpen, 1200); };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(ellipse at 50% 50%, #1a0a00 0%, #080810 100%)', padding: '2rem' }}>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} style={{ color: '#94a3b8', fontSize: '0.85rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
        A special letter for you 💌
      </motion.p>
      <div style={{ cursor: 'pointer', textAlign: 'center' }} onClick={!opening ? handleOpen : undefined}>
        <motion.div animate={opening ? { scale: [1, 1.2, 0.8], opacity: [1, 1, 0] } : { y: [0, -6, 0] }} transition={opening ? { duration: 0.8 } : { duration: 2, repeat: Infinity, ease: 'easeInOut' }} style={{ fontSize: '7rem', display: 'inline-block' }}>
          {opening ? '💌' : '✉️'}
        </motion.div>
        {!opening && (
          <motion.p animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '1rem' }}>
            Tap to open your letter ↑
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}

/* ── SCENE 10: Letter ── */
function SceneLetter({ letter, senderName, name, onNext }) {
  const lines = letter ? letter.split('\n').filter(Boolean) : [`Happy Birthday ${name}! 🎂`];
  const [visibleLines, setVisibleLines] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (visibleLines < lines.length) {
      const t = setTimeout(() => setVisibleLines((v) => v + 1), 850);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setDone(true), 500);
      return () => clearTimeout(t);
    }
  }, [visibleLines, lines.length]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#080810', padding: '2rem' }}>
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} style={{ maxWidth: '400px', width: '100%' }}>
        <div style={{ background: 'linear-gradient(180deg,#fef9f0,#fdf6e8)', borderRadius: '4px', padding: '1.75rem', boxShadow: '0 8px 40px rgba(0,0,0,0.5)', minHeight: '260px', position: 'relative' }}>
          {Array.from({ length: 12 }, (_, i) => <div key={i} style={{ position: 'absolute', left: '1.75rem', right: '1.75rem', top: `${3 + i * 1.8}rem`, height: 1, background: 'rgba(120,80,40,0.1)' }} />)}
          <p style={{ fontFamily: "'Caveat', cursive", fontSize: '0.9rem', color: '#92400e', margin: '0 0 0.75rem', position: 'relative' }}>Happy Birthday, {name}!</p>
          <div style={{ position: 'relative' }}>
            {lines.slice(0, visibleLines).map((line, i) => (
              <motion.p key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}
                style={{ fontFamily: "'Caveat', cursive", fontSize: '1.05rem', color: '#3b1f0a', lineHeight: 1.8, margin: '0 0 0.2rem' }}>{line}</motion.p>
            ))}
            {!done && <span style={{ display: 'inline-block', width: 2, height: '1.2em', background: '#92400e', animation: 'typewriter-cursor 0.8s infinite', verticalAlign: 'text-bottom', marginLeft: 2 }} />}
          </div>
          {done && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} style={{ fontFamily: "'Caveat', cursive", fontSize: '0.9rem', color: '#92400e', textAlign: 'right', marginTop: '1rem' }}>
              With birthday love, {senderName || 'someone who cares'} 🎂
            </motion.p>
          )}
        </div>
        {done && (
          <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={onNext}
            style={{ width: '100%', marginTop: '1.25rem', padding: '15px', borderRadius: '16px', background: 'linear-gradient(135deg,#f59e0b,#b45309)', border: 'none', color: '#fff', fontSize: '1rem', fontWeight: 700, cursor: 'pointer' }}>
            🎉 One Last Surprise →
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ── SCENE FINAL: Happy Birthday again ── */
function SceneFinal({ name, turningAge, onEnd }) {
  const confetti = Array.from({ length: 50 }, (_, i) => ({
    id: i, left: `${(i * 23 + 3) % 100}%`, delay: `${(i * 0.05).toFixed(2)}s`,
    dur: `${2 + (i % 5) * 0.4}s`, color: ['#fbbf24', '#f43f5e', '#a855f7', '#38bdf8', '#4ade80', '#fff'][i % 6],
    size: 8 + (i % 5) * 4,
  }));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(ellipse at 50% 40%, #1a1000 0%, #080810 100%)', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
      {confetti.map((c) => (
        <div key={c.id} style={{ position: 'absolute', top: 0, left: c.left, fontSize: c.size, color: c.color, animation: `confettiFall ${c.dur} ${c.delay} ease-in infinite`, pointerEvents: 'none' }}>
          {['■', '●', '★'][c.id % 3]}
        </div>
      ))}
      <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.3 }} style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎊</div>
        <h1 style={{ fontFamily: "'Dancing Script', cursive", fontSize: 'clamp(2rem, 7vw, 3.5rem)', color: '#fde68a', margin: '0 0 0.5rem', textShadow: '0 4px 20px rgba(251,191,36,0.5)' }}>
          Happy Birthday, {name}! 🎂
        </h1>
        {turningAge && (
          <p style={{ color: '#fbbf24', fontSize: '1rem', marginBottom: '2rem' }}>Cheers to {turningAge} years of being absolutely wonderful! 🥳</p>
        )}
        {/* Fun meme-style message */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
          style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '16px', padding: '1rem 1.5rem', marginBottom: '2rem', fontSize: '1rem', color: '#94a3b8' }}>
          May your WiFi be strong and your coffee be hot ☕📶
        </motion.div>
        {onEnd && (
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={onEnd}
            style={{ padding: '15px 36px', borderRadius: '50px', background: 'linear-gradient(135deg,#f59e0b,#b45309)', border: 'none', color: '#fff', fontSize: '1rem', fontWeight: 700, cursor: 'pointer' }}>
            🎂 That's a wrap! ✨
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  );
}
