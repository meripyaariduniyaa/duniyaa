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

/* ── SCENE 1: SPLASH — tap star to throw at heart ── */
function SceneSplash({ name, onNext }) {
  const [thrown, setThrown] = useState(false);
  const [burst, setBurst] = useState(false);

  const handleThrow = () => {
    if (thrown) return;
    setThrown(true);
    setTimeout(() => { setBurst(true); setTimeout(onNext, 1000); }, 600);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.1 }}
      style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(ellipse at 50% 40%, #1a0505 0%, #080810 100%)', padding: '2rem', position: 'relative', overflow: 'hidden' }}
    >
      <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ color: '#64748b', fontSize: '0.82rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '2rem' }}>
        Tap to start the celebration
      </motion.p>

      {/* Heart target */}
      <div style={{ position: 'relative', width: 120, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
        <motion.div
          animate={burst ? { scale: [1, 2.5], opacity: [1, 0] } : { scale: [1, 1.05, 1] }}
          transition={burst ? { duration: 0.5 } : { duration: 1.5, repeat: Infinity }}
          style={{ fontSize: '5rem', cursor: 'pointer' }}
          onClick={handleThrow}
        >
          {burst ? '💥' : '❤️'}
        </motion.div>
        {burst && Array.from({ length: 12 }, (_, i) => (
          <motion.div key={i} initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ x: Math.cos(i * 30 * Math.PI / 180) * 80, y: Math.sin(i * 30 * Math.PI / 180) * 80, opacity: 0, scale: 0 }}
            transition={{ duration: 0.6 }}
            style={{ position: 'absolute', fontSize: '1.5rem' }}>
            {['💕', '✨', '🌟', '💖'][i % 4]}
          </motion.div>
        ))}
      </div>

      {/* Projectile */}
      <AnimatePresence>
        {!thrown && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 100, y: -100, rotate: -45 }}
            transition={{ exit: { duration: 0.6, ease: 'easeIn' } }}
            onClick={handleThrow}
            style={{ fontSize: '2.5rem', cursor: 'pointer', animation: 'heartFloat 2s ease-in-out infinite' }}
          >
            ⭐
          </motion.div>
        )}
      </AnimatePresence>

      <motion.p animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }} style={{ color: '#475569', fontSize: '0.85rem', marginTop: '1.5rem' }}>
        Tap ⭐ to throw at the heart!
      </motion.p>
    </motion.div>
  );
}

/* ── SCENE 2: Full-screen HBD ── */
function SceneHBD({ name, turningAge, onNext }) { return null; } // alias
function SceneHBDFull({ name, turningAge, onNext }) {
  const confetti = Array.from({ length: 60 }, (_, i) => ({
    id: i, left: `${(i * 23 + 3) % 100}%`, delay: `${(i * 0.04).toFixed(2)}s`,
    dur: `${2 + (i % 5) * 0.4}s`, color: ['#fff', '#fbbf24', '#f43f5e', '#a855f7', '#38bdf8'][i % 5],
    size: 8 + (i % 5) * 4,
  }));

  useEffect(() => { const t = setTimeout(onNext, 4000); return () => clearTimeout(t); }, [onNext]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }}
      style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#c8000a', position: 'relative', overflow: 'hidden' }}
    >
      {confetti.map((c) => (
        <div key={c.id} style={{ position: 'absolute', top: 0, left: c.left, fontSize: c.size, color: c.color, animation: `confettiFall ${c.dur} ${c.delay} ease-in infinite`, pointerEvents: 'none' }}>■</div>
      ))}
      <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, type: 'spring', stiffness: 200 }} style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 0.8, repeat: Infinity }} style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>🎂</motion.div>
        <h1 style={{ fontFamily: "'Dancing Script', cursive", fontSize: 'clamp(2.5rem, 10vw, 5rem)', color: '#fff', margin: '0', textShadow: '0 4px 20px rgba(0,0,0,0.3)', lineHeight: 1.1 }}>
          Happy Birthday
        </h1>
        <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
          style={{ fontFamily: "'Dancing Script', cursive", fontSize: 'clamp(2rem, 7vw, 3.5rem)', color: '#fde68a', margin: '0.25rem 0 0', textShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
          {name}! 🎉
        </motion.h2>
        {turningAge && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.2rem', marginTop: '1rem' }}>
            Turning {turningAge} never looked this good ✨
          </motion.p>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ── SCENE 3: Gold burst → Tree grows → Hearts bloom ── */
function SceneGoldTree({ name, onNext }) {
  const [phase, setPhase] = useState(0); // 0: burst, 1: tree, 2: leaves

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 800);
    const t2 = setTimeout(() => setPhase(2), 2200);
    const t3 = setTimeout(onNext, 4200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onNext]);

  const leaves = Array.from({ length: 20 }, (_, i) => ({
    id: i, x: 110 + Math.cos(i * 18 * Math.PI / 180) * (30 + (i % 3) * 20),
    y: 140 - Math.sin(i * 18 * Math.PI / 180) * (20 + (i % 4) * 15),
    color: ['#f43f5e', '#fbbf24', '#a855f7', '#38bdf8', '#4ade80'][i % 5],
  }));

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(ellipse at 50% 60%, #2a1a00 0%, #080810 100%)', position: 'relative', overflow: 'hidden' }}
    >
      {/* Gold burst from center */}
      {phase >= 0 && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: phase >= 1 ? 0 : [0, 3], opacity: phase >= 1 ? 0 : [0, 1, 0] }}
          transition={{ duration: 0.8 }}
          style={{ position: 'absolute', width: 100, height: 100, borderRadius: '50%', background: 'radial-gradient(circle, #fbbf24, #f59e0b, transparent)', pointerEvents: 'none' }}
        />
      )}

      {/* Tree SVG — grows upward */}
      <div style={{ position: 'relative', width: 220, height: 280 }}>
        <svg viewBox="0 0 220 280" style={{ width: '100%', height: '100%' }}>
          {/* Trunk */}
          <motion.rect x="102" y="200" width="16" height="80" rx="4" fill="#92400e"
            initial={{ scaleY: 0 }} animate={{ scaleY: phase >= 1 ? 1 : 0 }}
            style={{ transformOrigin: 'bottom center' }} transition={{ duration: 0.6, delay: 0.2 }}
          />
          {/* Main branch */}
          <motion.path d="M110 200 Q80 160 60 120 M110 200 Q140 160 160 120 M110 180 Q95 155 85 130 M110 180 Q125 155 135 130"
            stroke="#92400e" strokeWidth="6" fill="none" strokeLinecap="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: phase >= 1 ? 1 : 0 }}
            transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
          />

          {/* Hearts as leaves */}
          {phase >= 2 && leaves.map((leaf, i) => (
            <motion.text key={leaf.id} x={leaf.x} y={leaf.y} textAnchor="middle" fontSize="18" fill={leaf.color}
              initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08, type: 'spring', stiffness: 300 }}
              style={{ transformOrigin: `${leaf.x}px ${leaf.y}px` }}
            >
              ♥
            </motion.text>
          ))}
        </svg>

        {/* Falling hearts */}
        {phase >= 2 && Array.from({ length: 12 }, (_, i) => (
          <div key={i} style={{
            position: 'absolute', top: 0, left: `${(i * 41) % 100}%`,
            fontSize: 14 + (i % 3) * 6, color: ['#f43f5e', '#fbbf24', '#a855f7'][i % 3],
            animation: `leaf-fall ${2 + (i % 4) * 0.5}s ${(i * 0.2).toFixed(1)}s ease-in infinite`,
            pointerEvents: 'none',
          }}>♥</div>
        ))}
      </div>

      {phase >= 2 && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          style={{ color: '#fde68a', fontFamily: "'Dancing Script', cursive", fontSize: '1.4rem', textAlign: 'center', marginTop: '1rem' }}>
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

/* ── SCENE 5: Birthday Video Presentation (16:9 Frame on Large Screens) ── */
function SceneCake({ cakeType, name, onNext }) {
  const [videoEnded, setVideoEnded] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        if (videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current.play();
        }
      });
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{
        minHeight: '100vh',
        width: '100%',
        background: '#09090b',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem 1rem',
      }}
    >
      {/* 16:9 Video Frame Box for Large Screens */}
      <div
        style={{
          width: '100%',
          maxWidth: '960px',
          aspectRatio: '16 / 9',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(244, 63, 94, 0.25)',
          background: '#000',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <video
          ref={videoRef}
          src="/HappyBirthday.mp4"
          autoPlay
          playsInline
          onEnded={() => setVideoEnded(true)}
          style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
        />
      </div>

      {/* Centered Controls Overlay */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        style={{
          marginTop: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 60,
          padding: '0 1rem',
        }}
      >
        {videoEnded && (
          <p style={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem', textShadow: '0 2px 8px rgba(0,0,0,0.8)', margin: '0 0 0.5rem', textAlign: 'center', background: 'rgba(255,255,255,0.08)', padding: '6px 16px', borderRadius: '20px', backdropFilter: 'blur(8px)' }}>
            ✨ Hope you enjoyed the video! Now time to make a wish!
          </p>
        )}
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNext}
          style={{
            padding: '14px 38px',
            borderRadius: '50px',
            background: 'linear-gradient(135deg, #f43f5e 0%, #fbbf24 100%)',
            border: '2px solid #ffffff',
            color: '#ffffff',
            fontSize: '1.05rem',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 8px 25px rgba(244, 63, 94, 0.4), 0 4px 12px rgba(0, 0, 0, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            textShadow: '0 1px 3px rgba(0,0,0,0.3)',
          }}
        >
          <span>🎂 Make a Wish →</span>
        </motion.button>
      </motion.div>
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
