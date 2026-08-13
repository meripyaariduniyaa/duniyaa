'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─────────────────────────────────────────────────────────────
   DESIGN TOKENS (easy to swap out)
───────────────────────────────────────────────────────────── */
const T = {
  fontHandwritten: 'var(--font-dancing), "Dancing Script", cursive',
  fontSerif: 'Georgia, "Times New Roman", serif',
  fontUI: 'var(--font-bold), "Fredoka", Inter, sans-serif',
  pink50: '#fdf2f8',
  pink100: '#fce7f3',
  pink200: '#fbcfe8',
  pink600: '#db2777',
  pink700: '#be185d',
  pink800: '#9d174d',
  pink900: '#831843',
  purpleDark: '#1a1525',
  purpleMid: '#3a2c41',
  cream: '#fffaf0',
};

/* ─────────────────────────────────────────────────────────────
   SCENE LIST
───────────────────────────────────────────────────────────── */
const SCENES = [
  'opening',
  'welcome',
  'balloons',
  'reveal',
  'candle',
  'candle-wish',
  'bouquet',
  'bouquet-messages',
  'letter-intro',
  'letter',
  'memories',
  'gift-intro',
  'final',
];

/* ─────────────────────────────────────────────────────────────
   FRAMER MOTION VARIANTS
───────────────────────────────────────────────────────────── */
const sceneVariants = {
  initial: { opacity: 0, scale: 0.97, y: 10 },
  animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
  exit:    { opacity: 0, scale: 1.02, y: -10, transition: { duration: 0.3, ease: 'easeIn' } },
};

/* ─────────────────────────────────────────────────────────────
   SHARED STYLE HELPERS
───────────────────────────────────────────────────────────── */
const sceneWrap = (extraStyle = {}) => ({
  position: 'absolute',
  inset: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '2rem 1.5rem',
  textAlign: 'center',
  overflow: 'hidden',
  ...extraStyle,
});

const primaryBtn = {
  border: 'none',
  padding: '14px 44px',
  borderRadius: '999px',
  background: 'linear-gradient(180deg, #e72b77, #c91c68)',
  color: '#fff',
  fontWeight: 700,
  fontSize: '1.05rem',
  boxShadow: '0 12px 25px rgba(200,30,100,.30)',
  cursor: 'pointer',
  fontFamily: T.fontUI,
  letterSpacing: '0.03em',
  transition: 'transform 0.15s',
};

const ghostBtn = {
  border: 'none',
  background: 'transparent',
  color: 'rgba(131,24,67,0.55)',
  cursor: 'pointer',
  fontSize: '0.8rem',
  marginTop: '1rem',
  fontFamily: T.fontUI,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
};

/* ─────────────────────────────────────────────────────────────
   FLOATING HEARTS BACKGROUND
───────────────────────────────────────────────────────────── */
function FloatingHearts() {
  const hearts = ['❤️','💕','💖','🌸','✨','💗'];
  const positions = [
    { top:'8%',  left:'12%',  delay:0,   size:22 },
    { top:'18%', right:'10%', delay:1.5, size:18 },
    { top:'55%', left:'5%',   delay:0.8, size:20 },
    { top:'70%', right:'8%',  delay:2.2, size:16 },
    { top:'38%', left:'80%',  delay:0.3, size:14 },
    { top:'82%', left:'25%',  delay:1.1, size:18 },
    { top:'30%', right:'80%', delay:1.8, size:12 },
    { top:'90%', right:'20%', delay:0.6, size:16 },
  ];
  return (
    <div style={{ position:'absolute', inset:0, pointerEvents:'none', overflow:'hidden', zIndex:0 }}>
      {positions.map((pos, i) => (
        <motion.span
          key={i}
          style={{
            position: 'absolute',
            fontSize: pos.size,
            opacity: 0.13,
            top: pos.top,
            left: pos.left,
            right: pos.right,
          }}
          animate={{ y:[0,-16,0], rotate:[0,8,0] }}
          transition={{ repeat: Infinity, duration: 5+i*0.5, delay: pos.delay, ease: 'easeInOut' }}
        >
          {hearts[i % hearts.length]}
        </motion.span>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   CONFETTI
───────────────────────────────────────────────────────────── */
function Confetti({ active }) {
  const [particles, setParticles] = useState([]);
  useEffect(() => {
    if (!active) return;
    const emojis = ['🎉','✨','💖','⭐','🎈','🍬','🌸','💕'];
    setParticles(Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      dur: 2 + Math.random() * 2,
      delay: Math.random() * 0.6,
      size: 14 + Math.random() * 14,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
    })));
    const t = setTimeout(() => setParticles([]), 5000);
    return () => clearTimeout(t);
  }, [active]);
  if (!particles.length) return null;
  return (
    <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:9999, overflow:'hidden' }}>
      {particles.map(p => (
        <motion.div
          key={p.id}
          style={{ position:'absolute', top:'-20px', left:`${p.left}%`, fontSize: p.size }}
          animate={{ y: '110vh', rotate: 360 }}
          transition={{ duration: p.dur, delay: p.delay, ease: 'easeIn' }}
        >
          {p.emoji}
        </motion.div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────── */
export default function BirthdayExperience({ note, isPreview = false }) {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [poppedBalloons, setPoppedBalloons] = useState([]);
  const [letterOpen, setLetterOpen] = useState(false);
  const [giftOpen, setGiftOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [noPos, setNoPos] = useState({ top: '60%', left: '55%' });

  const currentScene = SCENES[sceneIndex];

  // Note data fields (matching existing Firestore schema)
  const recipientName = note?.recipient_name || 'Beautiful';
  // Sender name: check custom_details first, then top-level (legacy), then fallback
  const senderName    = note?.custom_details?.sender_name || note?.sender_name || 'Me';
  const customMessage = note?.custom_message || 'Happy birthday to someone truly special. You are my safe place, and every moment with you is precious. I hope this year brings you all the happiness you deserve.';
  const photos        = (note?.image_urls && note.image_urls.length > 0) ? note.image_urls : [];

  // Balloon words — 4 individual words that pop out of each balloon
  const balloonMessages = [
    note?.custom_details?.balloon_word_1 || 'You',
    note?.custom_details?.balloon_word_2 || 'are',
    note?.custom_details?.balloon_word_3 || 'so',
    note?.custom_details?.balloon_word_4 || 'special!',
  ];

  // Bouquet floating messages — 6 short notes around the roses
  const bouquetMessages = [
    note?.custom_details?.bouquet_msg_1 || 'Forever yours 💕',
    note?.custom_details?.bouquet_msg_2 || 'You make my world beautiful',
    note?.custom_details?.bouquet_msg_3 || 'I\'m so lucky to have you',
    note?.custom_details?.bouquet_msg_4 || 'Happy Birthday! 🌸',
    note?.custom_details?.bouquet_msg_5 || 'My favourite person',
    note?.custom_details?.bouquet_msg_6 || 'Sending all my love ❤️',
  ];

  const nextScene = () => {
    if (sceneIndex < SCENES.length - 1) setSceneIndex(s => s + 1);
  };

  const moveNo = () => {
    setNoPos({
      top:  `${20 + Math.random() * 50}%`,
      left: `${5  + Math.random() * 60}%`,
    });
  };

  // ── Pink gradient (default for most scenes) ─────────────────
  const pinkBg = `linear-gradient(180deg, ${T.pink50} 0%, ${T.pink100} 52%, ${T.pink200} 100%)`;

  /* ── SCENES ─────────────────────────────────────────────── */

  // SCENE 1 — Opening
  const SceneOpening = (
    <motion.div key="opening" variants={sceneVariants} initial="initial" animate="animate" exit="exit"
      style={sceneWrap()}>
      <FloatingHearts />
      <motion.div
        animate={{ y:[0,-12,0] }} transition={{ repeat:Infinity, duration:2, ease:'easeInOut' }}
        style={{ fontSize: 52, marginBottom: 24, position:'relative', zIndex:1 }}
      >
        ❤️
      </motion.div>
      <h2 style={{ fontFamily: T.fontHandwritten, fontSize: '2rem', color: T.pink800, margin:'0 0 8px', position:'relative', zIndex:1 }}>
        Preparing your surprise...
      </h2>
      <p style={{ fontFamily: T.fontSerif, color: T.pink700, opacity: 0.8, margin:'0 0 40px', position:'relative', zIndex:1 }}>
        Almost ready...
      </p>
      <motion.button
        whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}
        onClick={nextScene}
        style={{ ...primaryBtn, position:'relative', zIndex:1 }}
      >
        Open 🎀
      </motion.button>
    </motion.div>
  );

  // SCENE 2 — Welcome + Yes/No
  const SceneWelcome = (
    <motion.div key="welcome" variants={sceneVariants} initial="initial" animate="animate" exit="exit"
      style={sceneWrap()}>
      <FloatingHearts />
      <h1 style={{ fontFamily: T.fontHandwritten, fontSize: '2.8rem', color: T.pink700, lineHeight:1.2, margin:'0 0 24px', position:'relative', zIndex:1 }}>
        Happy Birthday,<br/>{recipientName} 🎂
      </h1>
      <div style={{ fontSize: 72, marginBottom: 28, position:'relative', zIndex:1, filter:'drop-shadow(0 6px 16px rgba(219,39,119,0.25))' }}>
        🥳
      </div>
      <p style={{ fontFamily: T.fontSerif, fontSize:'1.1rem', color: T.pink900, margin:'0 0 36px', position:'relative', zIndex:1 }}>
        Are you excited for what's next?
      </p>
      {/* Yes button */}
      <motion.button
        whileHover={{ scale:1.06, translateY:-2 }} whileTap={{ scale:0.95 }}
        onClick={nextScene}
        style={{ ...primaryBtn, position:'relative', zIndex:2 }}
      >
        Yes! 🎉
      </motion.button>
      {/* Teasing No button */}
      <motion.button
        onHoverStart={moveNo}
        onTap={moveNo}
        style={{
          position:'absolute', zIndex:2,
          top: noPos.top, left: noPos.left,
          border:`1.5px solid ${T.pink200}`,
          background:'rgba(255,255,255,0.7)',
          color: T.pink700,
          padding:'8px 22px',
          borderRadius:'999px',
          cursor:'pointer',
          fontSize:'0.85rem',
          fontFamily: T.fontUI,
          transition:'top 0.25s ease, left 0.25s ease',
          backdropFilter:'blur(4px)',
        }}
      >
        No 😶
      </motion.button>
    </motion.div>
  );

  // SCENE 3 — Balloon Pop Game
  const balloonColors = ['🎈','🩵','💚','💜'];
  const SceneBalloons = (
    <motion.div key="balloons" variants={sceneVariants} initial="initial" animate="animate" exit="exit"
      style={sceneWrap()}>
      <div style={{ fontFamily: T.fontUI, fontSize:'0.75rem', letterSpacing:'0.15em', color: T.pink700, marginBottom:8, fontWeight:700, textTransform:'uppercase' }}>
        {poppedBalloons.length} / 4 POPPED
      </div>
      {/* Progress bar */}
      <div style={{ width:'60%', height:5, background:'rgba(219,39,119,0.15)', borderRadius:99, marginBottom:28, overflow:'hidden' }}>
        <motion.div style={{ height:'100%', background: T.pink600, borderRadius:99 }}
          animate={{ width: `${(poppedBalloons.length/4)*100}%` }}
          transition={{ duration:0.4 }}
        />
      </div>
      <h2 style={{ fontFamily: T.fontSerif, fontSize:'1.4rem', color: T.pink900, margin:'0 0 36px' }}>
        Pop all 4 balloons 🎈
      </h2>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'2rem', marginBottom:32 }}>
        {[1,2,3,4].map(id => (
          <div key={id} style={{ display:'flex', alignItems:'center', justifyContent:'center', width:90, height:90 }}>
            <AnimatePresence mode="wait">
              {poppedBalloons.includes(id) ? (
                <motion.span
                  key="word"
                  initial={{ scale:0, opacity:0 }} animate={{ scale:1, opacity:1 }} transition={{ type:'spring', duration:0.5 }}
                  style={{ fontFamily: T.fontHandwritten, fontSize:'2rem', color: T.pink700 }}
                >
                  {balloonMessages[id-1]}
                </motion.span>
              ) : (
                <motion.button
                  key="balloon"
                  whileHover={{ scale:1.1 }}
                  whileTap={{ scale:1.25 }}
                  onClick={() => {
                    const next = [...poppedBalloons, id];
                    setPoppedBalloons(next);
                    if (next.length === 4) setTimeout(nextScene, 1200);
                  }}
                  style={{ background:'none', border:'none', cursor:'pointer', fontSize:52, filter:'drop-shadow(0 4px 12px rgba(0,0,0,0.15))' }}
                >
                  {balloonColors[id-1]}
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </motion.div>
  );

  // SCENE 4 — Reveal message
  const SceneReveal = (
    <motion.div key="reveal" variants={sceneVariants} initial="initial" animate="animate" exit="exit"
      style={sceneWrap()}>
      <motion.h2
        initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2, duration:0.7 }}
        style={{ fontFamily: T.fontHandwritten, fontSize:'3rem', color: T.pink700, margin:'0 0 24px' }}
      >
        You are so special.
      </motion.h2>
      <motion.div
        initial={{ opacity:0, scale:0.5 }} animate={{ opacity:1, scale:1 }} transition={{ delay:0.7, duration:0.6, type:'spring' }}
        style={{ fontSize: 56, marginBottom:32 }}
      >
        ✨
      </motion.div>
      <motion.button
        initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.5 }}
        whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}
        onClick={nextScene}
        style={primaryBtn}
      >
        Continue
      </motion.button>
    </motion.div>
  );

  // SCENE 5 — Candle
  const SceneCandle = (
    <motion.div key="candle" variants={sceneVariants} initial="initial" animate="animate" exit="exit"
      style={sceneWrap({ background: `radial-gradient(circle at center, ${T.purpleMid}, ${T.purpleDark})` })}>
      <h2 style={{ fontFamily: T.fontSerif, fontSize:'1.5rem', color:'#fce7f3', marginBottom:48, textShadow:'0 0 20px rgba(255,100,180,0.4)' }}>
        Make a wish...
      </h2>
      <div style={{ position:'relative', cursor:'pointer' }} onClick={nextScene}>
        <motion.span
          animate={{ opacity:[0.8,1,0.8], scale:[1,1.08,1] }}
          transition={{ repeat:Infinity, duration:1.5, ease:'easeInOut' }}
          style={{ position:'absolute', top:-48, left:'50%', transform:'translateX(-50%)', fontSize:48, filter:'drop-shadow(0 0 18px rgba(255,200,50,0.9))' }}
        >
          🔥
        </motion.span>
        <span style={{ fontSize:80 }}>🎂</span>
      </div>
      <p style={{ fontFamily: T.fontSerif, color:'rgba(252,231,243,0.7)', fontSize:'0.9rem', marginTop:40 }}>
        Tap the candle to blow it out
      </p>
    </motion.div>
  );

  // SCENE 6 — Wish granted
  const SceneCandleWish = (
    <motion.div key="candle-wish" variants={sceneVariants} initial="initial" animate="animate" exit="exit"
      style={sceneWrap({ background:`radial-gradient(circle, ${T.purpleMid}, ${T.purpleDark})` })}>
      <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:'spring', duration:0.7 }}>
        <div style={{ fontSize:56, marginBottom:16 }}>💨</div>
      </motion.div>
      <h2 style={{ fontFamily: T.fontHandwritten, fontSize:'2.5rem', color:'#fce7f3', margin:'0 0 20px' }}>
        Wish made! ✨
      </h2>
      <p style={{ fontFamily: T.fontSerif, color:'rgba(252,231,243,0.7)', marginBottom:40 }}>
        May all your dreams come true
      </p>
      <motion.button
        whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}
        onClick={nextScene}
        style={{ ...primaryBtn, background:'linear-gradient(180deg, #9333ea, #7c3aed)' }}
      >
        Continue 🌟
      </motion.button>
    </motion.div>
  );

  // SCENE 7 — Bouquet tap
  const SceneBouquet = (
    <motion.div key="bouquet" variants={sceneVariants} initial="initial" animate="animate" exit="exit"
      style={sceneWrap()}>
      <FloatingHearts />
      <h2 style={{ fontFamily: T.fontHandwritten, fontSize:'2.4rem', color: T.pink700, margin:'0 0 36px', position:'relative', zIndex:1 }}>
        Your Rose Bouquet 🌹
      </h2>
      <motion.div
        whileHover={{ scale:1.06 }} whileTap={{ scale:0.94 }}
        onClick={nextScene}
        style={{ fontSize:88, cursor:'pointer', position:'relative', zIndex:1, filter:'drop-shadow(0 8px 24px rgba(219,39,119,0.3))' }}
      >
        💐
      </motion.div>
      <p style={{ fontFamily: T.fontSerif, color: T.pink700, opacity:0.8, marginTop:32, position:'relative', zIndex:1 }}>
        Tap the bouquet ✨
      </p>
    </motion.div>
  );

  // SCENE 8 — Bouquet messages
  const msgPos = [
    { top:'22%', left:'4%'  },
    { top:'28%', right:'4%' },
    { top:'55%', left:'2%'  },
    { top:'60%', right:'2%' },
    { top:'74%', left:'8%'  },
    { top:'76%', right:'6%' },
  ];
  const SceneBouquetMessages = (
    <motion.div key="bouquet-messages" variants={sceneVariants} initial="initial" animate="animate" exit="exit"
      style={sceneWrap({ paddingTop:'4rem', paddingBottom:'5rem' })}>
      <FloatingHearts />
      <div style={{ fontSize:80, marginTop:12, filter:'drop-shadow(0 8px 24px rgba(219,39,119,0.3))', position:'relative', zIndex:1 }}>
        💐
      </div>
      {bouquetMessages.slice(0,6).map((msg, i) => (
        <motion.div
          key={i}
          initial={{ opacity:0, scale:0.8 }}
          animate={{ opacity:1, scale:1 }}
          transition={{ delay: i * 0.25 + 0.3 }}
          style={{
            position:'absolute',
            ...msgPos[i],
            background:'rgba(255,255,255,0.92)',
            borderRadius:20,
            padding:'10px 14px',
            boxShadow:'0 8px 24px rgba(150,80,100,0.14)',
            color: T.pink900,
            fontWeight:600,
            fontSize:'0.78rem',
            fontFamily: T.fontUI,
            maxWidth:120,
            textAlign:'center',
            zIndex:2,
            backdropFilter:'blur(4px)',
          }}
        >
          {msg}
        </motion.div>
      ))}
      <motion.button
        initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:2 }}
        whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}
        onClick={nextScene}
        style={{ ...primaryBtn, position:'absolute', bottom:'2rem' }}
      >
        Next 💌
      </motion.button>
    </motion.div>
  );

  // SCENE 9 — Letter intro
  const SceneLetterIntro = (
    <motion.div key="letter-intro" variants={sceneVariants} initial="initial" animate="animate" exit="exit"
      style={sceneWrap()}>
      <FloatingHearts />
      <h2 style={{ fontFamily: T.fontSerif, fontSize:'1.5rem', color: T.pink900, margin:'0 0 40px', lineHeight:1.4, position:'relative', zIndex:1 }}>
        A Message From<br/>My Heart ❤️
      </h2>
      <motion.div
        whileHover={{ scale:1.05, rotate:[-2,2,-1,0] }}
        whileTap={{ scale:0.9 }}
        onClick={() => { setLetterOpen(true); setTimeout(nextScene, 900); }}
        style={{ fontSize:80, cursor:'pointer', position:'relative', zIndex:1,
          filter:'drop-shadow(0 8px 24px rgba(219,39,119,0.25))' }}
      >
        <AnimatePresence mode="wait">
          <motion.span key={letterOpen ? 'open' : 'closed'}
            initial={{ scale:0.8, opacity:0 }} animate={{ scale:1, opacity:1 }} exit={{ scale:0.8, opacity:0 }}>
            {letterOpen ? '📩' : '✉️'}
          </motion.span>
        </AnimatePresence>
      </motion.div>
      <p style={{ fontFamily: T.fontSerif, color: T.pink700, opacity:0.75, marginTop:32, position:'relative', zIndex:1 }}>
        Tap to open
      </p>
    </motion.div>
  );

  // SCENE 10 — Letter content
  const paragraphs = customMessage.split(/\. /).filter(Boolean);
  const SceneLetter = (
    <motion.div key="letter" variants={sceneVariants} initial="initial" animate="animate" exit="exit"
      style={sceneWrap({ justifyContent:'flex-start', paddingTop:'3.5rem', overflowY:'auto' })}>
      <div style={{
        background: T.cream,
        borderRadius: 22,
        border: '1px solid rgba(190,160,120,.3)',
        boxShadow: '0 18px 45px rgba(100,60,70,.13)',
        padding: '32px 24px 28px',
        width: '100%',
        maxWidth: 380,
        position:'relative',
        textAlign:'left',
        marginBottom: 24,
      }}>
        {/* Inner border */}
        <div style={{
          position:'absolute', inset:10,
          border:'1px solid rgba(180,150,110,.2)',
          borderRadius:14, pointerEvents:'none',
        }}/>
        <h3 style={{ fontFamily: T.fontHandwritten, fontSize:'2.2rem', color: T.pink800, marginBottom:20 }}>
          Dear {recipientName},
        </h3>
        <div style={{ fontFamily: T.fontSerif, color: T.pink900, lineHeight:1.8, fontSize:'0.97rem' }}>
          {paragraphs.map((para, i) => (
            <motion.p
              key={i}
              initial={{ opacity:0, y:6 }}
              animate={{ opacity:1, y:0 }}
              transition={{ delay: i * 0.6 + 0.3 }}
              style={{ marginBottom:14 }}
            >
              {para}{para.endsWith('.') ? '' : '.'}
            </motion.p>
          ))}
        </div>
        <motion.div
          initial={{ opacity:0 }} animate={{ opacity:1 }}
          transition={{ delay: paragraphs.length * 0.6 + 0.8 }}
          style={{ marginTop:20, textAlign:'right', fontFamily: T.fontHandwritten, fontSize:'1.6rem', color: T.pink800 }}
        >
          With love,<br/>{senderName} 💕
        </motion.div>
      </div>
      <motion.button
        initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay: paragraphs.length * 0.6 + 1.5 }}
        whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}
        onClick={nextScene}
        style={primaryBtn}
      >
        Continue ✨
      </motion.button>
    </motion.div>
  );

  // SCENE 11 — Memories / photos
  const [memIdx, setMemIdx] = useState(0);
  const hasPhotos = photos.length > 0;
  const SceneMemories = (
    <motion.div key="memories" variants={sceneVariants} initial="initial" animate="animate" exit="exit"
      style={sceneWrap({ background:'#fff5f8' })}>
      <h2 style={{ fontFamily: T.fontSerif, fontSize:'1.4rem', color: T.pink900, marginBottom:24 }}>
        Our memories ❤️
      </h2>
      <div style={{
        width:260, height:260,
        background: hasPhotos ? 'transparent' : 'rgba(253,242,248,0.8)',
        border:'1px solid rgba(219,39,119,0.15)',
        borderRadius:16,
        overflow:'hidden',
        display:'flex', alignItems:'center', justifyContent:'center',
        boxShadow:'0 12px 35px rgba(219,39,119,0.12)',
        marginBottom:20,
      }}>
        {hasPhotos
          ? <img src={photos[memIdx]} alt="Memory" style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
          : <span style={{ fontSize:56 }}>📸</span>}
      </div>
      {hasPhotos && photos.length > 1 && (
        <div style={{ display:'flex', gap:16, marginBottom:20 }}>
          <button
            onClick={() => setMemIdx(i => Math.max(0, i-1))}
            style={{ ...ghostBtn, fontSize:'1.4rem', marginTop:0 }}
          >←</button>
          <span style={{ fontFamily:T.fontUI, fontSize:'0.85rem', color:T.pink700, alignSelf:'center' }}>
            {memIdx+1} / {photos.length}
          </span>
          <button
            onClick={() => setMemIdx(i => Math.min(photos.length-1, i+1))}
            style={{ ...ghostBtn, fontSize:'1.4rem', marginTop:0 }}
          >→</button>
        </div>
      )}
      <p style={{ fontFamily: T.fontSerif, color: T.pink700, fontStyle:'italic', marginBottom:28 }}>
        "Remember this day?" 💫
      </p>
      <motion.button
        whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}
        onClick={nextScene}
        style={primaryBtn}
      >
        One more thing... 🎁
      </motion.button>
    </motion.div>
  );

  // SCENE 12 — Gift intro
  const SceneGiftIntro = (
    <motion.div key="gift-intro" variants={sceneVariants} initial="initial" animate="animate" exit="exit"
      style={sceneWrap()}>
      <FloatingHearts />
      <h2 style={{ fontFamily: T.fontHandwritten, fontSize:'2.6rem', color: T.pink700, margin:'0 0 40px', position:'relative', zIndex:1 }}>
        One Last Thing...
      </h2>
      <div style={{ position:'relative', zIndex:1 }}>
        <motion.div
          animate={!giftOpen ? { rotate:[-3,3,-3,0] } : {}}
          transition={{ repeat: Infinity, duration:1.8, repeatDelay:1.5 }}
          whileHover={{ scale:1.06 }} whileTap={{ scale:0.9 }}
          onClick={() => { setGiftOpen(true); setTimeout(nextScene, 1200); }}
          style={{ fontSize:88, cursor:'pointer', filter:'drop-shadow(0 8px 24px rgba(219,39,119,0.3))' }}
        >
          {giftOpen ? '🎊' : '🎁'}
        </motion.div>
        {!giftOpen && (
          <div style={{
            position:'absolute', top:-4, right:-8,
            background:'#ef4444', color:'#fff',
            width:22, height:22, borderRadius:'50%',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontWeight:700, fontSize:'0.75rem', fontFamily:T.fontUI,
            boxShadow:'0 2px 8px rgba(0,0,0,0.15)',
          }}>1</div>
        )}
      </div>
      <p style={{ fontFamily: T.fontSerif, color: T.pink700, opacity:0.8, marginTop:32, position:'relative', zIndex:1 }}>
        Tap the gift to unwrap it 🎀
      </p>
    </motion.div>
  );

  // SCENE 13 — Final celebration
  const SceneFinal = (
    <motion.div key="final" variants={sceneVariants} initial="initial" animate="animate" exit="exit"
      style={sceneWrap({ background:'linear-gradient(180deg, #fff0f6, #fce7f3, #fdf2f8)' })}>
      <Confetti active={true} />
      <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:'spring', duration:0.8 }}>
        <div style={{ fontSize:72, marginBottom:4 }}>🎉</div>
      </motion.div>
      <motion.h2
        initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4 }}
        style={{ fontFamily: T.fontHandwritten, fontSize:'2.8rem', color: T.pink700, margin:'16px 0 8px', lineHeight:1.2 }}
      >
        Happy Birthday,<br/>{recipientName}!
      </motion.h2>
      <motion.p
        initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.8 }}
        style={{ fontFamily: T.fontSerif, fontSize:'1.05rem', color: T.pink900, marginBottom:32 }}
      >
        Lots of love for you ❤️
      </motion.p>
      {/* Optional UPI/Gift placeholder */}
      <motion.div
        initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:1.2 }}
        style={{
          background:'#fff', borderRadius:20, padding:'24px',
          boxShadow:'0 12px 40px rgba(219,39,119,0.15)',
          border:`1px solid ${T.pink200}`,
          width:'100%', maxWidth:300,
          marginBottom:28,
        }}
      >
        <div style={{ fontSize:40, marginBottom:12 }}>🎀</div>
        <p style={{ fontFamily:T.fontUI, fontWeight:700, color:'#1f2937', marginBottom:6 }}>A little gift from me</p>
        <p style={{ fontFamily:T.fontUI, fontSize:'0.8rem', color:'#9ca3af', marginBottom:16 }}>Scan for your surprise</p>
        {/* QR placeholder — swap with real <img> later */}
        <div style={{
          aspectRatio:'1', background:'#f3f4f6',
          border:'2px dashed #d1d5db', borderRadius:12,
          display:'flex', alignItems:'center', justifyContent:'center',
          color:'#9ca3af', fontSize:'0.8rem', fontFamily:T.fontUI,
          padding:16,
        }}>
          📱 QR Code<br/>Placeholder
        </div>
      </motion.div>
      <motion.button
        initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.8 }}
        whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}
        onClick={() => { setSceneIndex(0); setPoppedBalloons([]); setLetterOpen(false); setGiftOpen(false); }}
        style={{ ...primaryBtn, background:'rgba(219,39,119,0.12)', color:T.pink700, boxShadow:'none', border:`1.5px solid ${T.pink200}` }}
      >
        ↺ Replay
      </motion.button>
    </motion.div>
  );

  const renderScene = () => {
    switch (currentScene) {
      case 'opening':          return SceneOpening;
      case 'welcome':          return SceneWelcome;
      case 'balloons':         return SceneBalloons;
      case 'reveal':           return SceneReveal;
      case 'candle':           return SceneCandle;
      case 'candle-wish':      return SceneCandleWish;
      case 'bouquet':          return SceneBouquet;
      case 'bouquet-messages': return SceneBouquetMessages;
      case 'letter-intro':     return SceneLetterIntro;
      case 'letter':           return SceneLetter;
      case 'memories':         return SceneMemories;
      case 'gift-intro':       return SceneGiftIntro;
      case 'final':            return SceneFinal;
      default:                 return SceneOpening;
    }
  };

  return (
    /* ── Outer dark stage ── */
    <div style={{
      display:'flex', alignItems:'center', justifyContent:'center',
      minHeight:'100dvh', width:'100%',
      background:'radial-gradient(circle at center, #211526, #09070c)',
      padding: '0',
    }}>
      {/* ── Phone container ── */}
      <div style={{
        position:'relative',
        width: 'min(100vw, 430px)',
        height: 'min(100dvh, 860px)',
        borderRadius: 'clamp(0px, 5vw, 38px)',
        overflow:'hidden',
        border: '2.5px solid rgba(255,190,220,.65)',
        boxShadow: '0 0 45px rgba(255,100,180,.18), inset 0 0 24px rgba(255,255,255,.12)',
        background: `linear-gradient(180deg, ${T.pink50} 0%, ${T.pink100} 52%, ${T.pink200} 100%)`,
      }}>
        {/* Notch */}
        <div style={{
          position:'absolute', top:0, left:'50%', transform:'translateX(-50%)',
          width:'32%', height:34,
          background: T.pink50,
          borderRadius:'0 0 24px 24px',
          zIndex:30,
          boxShadow:'0 2px 8px rgba(0,0,0,0.06)',
          display: 'none',  // hidden on mobile, override with media query via class
        }} className="bd-notch" />

        {/* Scene renderer */}
        <AnimatePresence mode="wait">
          {renderScene()}
        </AnimatePresence>
      </div>
    </div>
  );
}
