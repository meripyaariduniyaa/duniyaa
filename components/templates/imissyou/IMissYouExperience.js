'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CinematicStageWrapper from '../common/CinematicStageWrapper';
import GoldBadge from '../common/GoldBadge';
import WholesomeMemeSticker from '../common/WholesomeMemeSticker';
import OpenWhenEnvelopes from '../common/OpenWhenEnvelopes';
import WaxSealLetter from '../common/WaxSealLetter';
import PolaroidStack from '../common/PolaroidStack';

/**
 * 🌌 I MISS YOU (ID: i-miss-you)
 * 7-Chapter Full-Bleed Celestial Odyssey
 */
export default function IMissYouExperience({ note, isPreview = false, onReachEnd }) {
  const [chapter, setChapter] = useState(1);
  const [unlockedSecrets, setUnlockedSecrets] = useState([true, false, false]);

  // Chapter 5: Virtual Hug progress
  const [hugProgress, setHugProgress] = useState(0);
  const [isHoldingHug, setIsHoldingHug] = useState(false);
  const [hugComplete, setHugComplete] = useState(false);

  // Chapter 4: Cassette Player
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

  // Chapter 6: Constellation Stars Connected
  const [connectedStars, setConnectedStars] = useState({});

  const recipient = note?.recipient_name || 'My Missing Half';
  const customMsg = note?.custom_message || 'Even across all these miles, time zones, and silent evenings, not a single day passes where you are not the first and last thought on my mind. Distance is just a test of how far love can travel.';
  const cityA = note?.custom_details?.sender_city || 'My City';
  const cityB = note?.custom_details?.recipient_city || 'Your City';
  const distanceKm = note?.custom_details?.distance_km || '1,420';
  const reunionDate = note?.custom_details?.reunion_date || 'Very Soon';
  const photos = note?.image_urls || [];

  useEffect(() => {
    onReachEnd?.(chapter === 7, () => {
      setChapter(1);
      setConnectedStars({});
      setHugProgress(0);
      setHugComplete(false);
    });
  }, [chapter, onReachEnd]);

  // Virtual Hug Hold Handler
  useEffect(() => {
    let interval;
    if (isHoldingHug && hugProgress < 100) {
      interval = setInterval(() => {
        setHugProgress((prev) => {
          if (prev >= 98) {
            setHugComplete(true);
            setUnlockedSecrets([true, true, true]);
            return 100;
          }
          return prev + 3;
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isHoldingHug, hugProgress]);

  const openWhenLetters = [
    { title: 'Open when you feel alone', preview: 'Look up at the moon tonight...', body: 'We are both standing beneath the exact same sky, looking at the exact same moon. You are never, ever truly alone.' },
    { title: 'Open when you cannot sleep', preview: 'Remember that quiet night...', body: 'Close your eyes, take a deep breath, and picture my hand holding yours. Rest easy tonight.' },
    { title: 'Open when you miss my hugs', preview: 'Wrap your arms around yourself...', body: 'Squeeze as tight as you can. That warmth is every single hug I am saving up for our reunion.' },
    { title: 'Open when you doubt distance', preview: 'Distance is temporary...', body: 'Miles only test how deep feelings run. And ours run deeper than any ocean on earth.' },
    { title: 'Open on our reunion day', preview: 'The countdown ends today...', body: 'I am running toward you the second I see you, and I am never letting go.' }
  ];

  const stars = [
    { id: 's1', title: 'First Conversation', x: 20, y: 30 },
    { id: 's2', title: 'Late Night Calls', x: 50, y: 20 },
    { id: 's3', title: 'Shared Playlists', x: 80, y: 35 },
    { id: 's4', title: 'Next Reunion', x: 65, y: 75 },
    { id: 's5', title: 'Forever Home', x: 30, y: 70 },
  ];

  const handleStarClick = (id) => {
    const updated = { ...connectedStars, [id]: true };
    setConnectedStars(updated);
    if (Object.keys(updated).length >= 3) {
      setUnlockedSecrets([true, true, unlockedSecrets[2]]);
    }
  };

  return (
    <CinematicStageWrapper
      currentStep={chapter}
      totalSteps={7}
      chapterTitle={
        chapter === 1
          ? 'Distance Radar'
          : chapter === 2
          ? 'The Last Goodbye'
          : chapter === 3
          ? 'Open When Letters'
          : chapter === 4
          ? 'Shared Cassette'
          : chapter === 5
          ? 'Virtual Hug'
          : chapter === 6
          ? 'Star Constellation'
          : 'Reunion & Letter'
      }
      particleMode="stardust"
      theme="celestial"
      unlockedSecrets={unlockedSecrets}
    >
      {/* ── CHAPTER 1: DISTANCE RADAR & FLIGHT PATH ── */}
      {chapter === 1 && (
        <div style={{ width: '100%', maxWidth: '820px', margin: '0 auto', textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              padding: 'clamp(2.5rem, 5vw, 4.5rem) clamp(1.5rem, 5vw, 3.5rem)',
              borderRadius: '32px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              backdropFilter: 'blur(30px)',
              boxShadow: '0 30px 80px rgba(0,0,0,0.6), 0 0 50px rgba(56, 189, 248, 0.15)',
            }}
          >
            <div style={{ display: 'inline-flex', padding: '18px', background: 'rgba(56, 189, 248, 0.12)', borderRadius: '50%', marginBottom: '1.5rem', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
              <GoldBadge name="compass" size={60} />
            </div>

            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#7dd3fc', letterSpacing: '0.22em', textTransform: 'uppercase', display: 'block', marginBottom: '1rem' }}>
              ✦ Transcontinental Radar ✦
            </span>

            <h1
              style={{
                fontFamily: 'var(--font-dancing)',
                fontSize: 'clamp(2.4rem, 6vw, 4.2rem)',
                color: '#fff',
                margin: '0 0 1.25rem',
                textShadow: '0 0 30px rgba(56, 189, 248, 0.4)',
              }}
            >
              Missing You, {recipient}
            </h1>

            {/* Glowing Distance Arc */}
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.6)',
                padding: '1.75rem 2rem',
                borderRadius: '24px',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '2.5rem',
                backdropFilter: 'blur(16px)',
              }}
            >
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Origin</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>{cityA}</div>
              </div>

              <div style={{ flex: 1, margin: '0 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <motion.div
                  animate={{ x: [-20, 20, -20] }}
                  transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                  style={{ color: '#38bdf8', fontSize: '1.2rem' }}
                >
                  ✈
                </motion.div>
                <div style={{ height: '2px', width: '100%', background: 'linear-gradient(90deg, #38bdf8, #818cf8)' }} />
                <span style={{ fontSize: '0.78rem', color: '#38bdf8', marginTop: '6px', fontWeight: 700 }}>{distanceKm} km apart</span>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Destination</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>{cityB}</div>
              </div>
            </div>

            <p style={{ color: '#cbd5e1', fontSize: '1.1rem', lineHeight: 1.8, maxWidth: '560px', margin: '0 auto 2.5rem' }}>
              No matter how many miles separate us tonight, my heart resides right next to yours.
            </p>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setChapter(2)}
              style={{
                background: 'linear-gradient(135deg, #38bdf8, #6366f1)',
                color: '#fff',
                padding: '16px 42px',
                borderRadius: '999px',
                border: 'none',
                fontWeight: 800,
                fontSize: '1.05rem',
                cursor: 'pointer',
                boxShadow: '0 8px 25px rgba(56, 189, 248, 0.35)',
              }}
            >
              Step Into The Memory &rarr;
            </motion.button>
          </motion.div>
        </div>
      )}

      {/* ── CHAPTER 2: THE LAST TIME WE WERE TOGETHER ── */}
      {chapter === 2 && (
        <div style={{ width: '100%', maxWidth: '880px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ marginBottom: '2.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#7dd3fc', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
              Chapter II: That Lingering Warmth
            </span>
            <h2 style={{ fontFamily: 'var(--font-dancing)', fontSize: 'clamp(2.2rem, 5vw, 3.4rem)', color: '#fff', margin: '0.35rem 0' }}>
              The Last Time Together
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1rem' }}>
              The memory that kept me going through every lonely week.
            </p>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              borderRadius: '28px',
              padding: '2.5rem 2rem',
              marginBottom: '3rem',
              textAlign: 'center',
              backdropFilter: 'blur(20px)',
            }}
          >
            <GoldBadge name="heart" size={54} />
            <p style={{ color: '#e2e8f0', fontSize: '1.15rem', lineHeight: 1.8, maxWidth: '620px', margin: '1.25rem auto 0' }}>
              I still remember every single detail of the last moment we spent side by side: the warmth of your hand, the way you looked back, and that quiet promise that we would be together again soon.
            </p>
          </div>

          {photos.length > 0 && (
            <div style={{ marginBottom: '3rem' }}>
              <PolaroidStack photos={photos} />
            </div>
          )}

          <div style={{ textAlign: 'center' }}>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setChapter(3)}
              style={{
                background: 'linear-gradient(135deg, #38bdf8, #6366f1)',
                color: '#fff',
                padding: '16px 40px',
                borderRadius: '999px',
                border: 'none',
                fontWeight: 800,
                fontSize: '1rem',
                cursor: 'pointer',
                boxShadow: '0 8px 25px rgba(56, 189, 248, 0.35)',
              }}
            >
              Open Your Distance Envelopes &rarr;
            </motion.button>
          </div>
        </div>
      )}

      {/* ── CHAPTER 3: OPEN WHEN LETTERS ── */}
      {chapter === 3 && (
        <div style={{ width: '100%', maxWidth: '960px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#7dd3fc', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
              Chapter III: Emergency Warmth
            </span>
            <h2 style={{ fontFamily: 'var(--font-dancing)', fontSize: 'clamp(2.2rem, 5vw, 3.4rem)', color: '#fff', margin: '0.35rem 0' }}>
              5 &ldquo;Open When&hellip;&rdquo; Letters
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1rem' }}>
              Curated notes for every mood when miles feel heavy.
            </p>
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <OpenWhenEnvelopes letters={openWhenLetters} />
          </div>

          <div style={{ textAlign: 'center' }}>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setChapter(4)}
              style={{
                background: 'linear-gradient(135deg, #38bdf8, #6366f1)',
                color: '#fff',
                padding: '16px 40px',
                borderRadius: '999px',
                border: 'none',
                fontWeight: 800,
                fontSize: '1rem',
                cursor: 'pointer',
                boxShadow: '0 8px 25px rgba(56, 189, 248, 0.35)',
              }}
            >
              Play Our Shared Tape &rarr;
            </motion.button>
          </div>
        </div>
      )}

      {/* ── CHAPTER 4: SHARED CASSETTE PLAYER ── */}
      {chapter === 4 && (
        <div style={{ width: '100%', maxWidth: '820px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ marginBottom: '2.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#7dd3fc', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
              Chapter IV: Lo-Fi Mixtape
            </span>
            <h2 style={{ fontFamily: 'var(--font-dancing)', fontSize: 'clamp(2.2rem, 5vw, 3.4rem)', color: '#fff', margin: '0.35rem 0' }}>
              Shared Midnight Tape
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1rem' }}>
              The songs and late-night frequency that connect our time zones.
            </p>
          </div>

          {/* Vintage Cassette */}
          <div style={{ margin: '0 auto 3rem', display: 'flex', justifyContent: 'center' }}>
            <motion.div
              whileHover={{ scale: 1.03 }}
              onClick={() => setIsPlayingMusic(!isPlayingMusic)}
              style={{
                width: 'min(90vw, 360px)',
                height: '220px',
                borderRadius: '24px',
                background: 'linear-gradient(145deg, #0f172a, #020617)',
                border: '2px solid rgba(56, 189, 248, 0.4)',
                boxShadow: '0 25px 60px rgba(0,0,0,0.7), inset 0 2px 10px rgba(255,255,255,0.08)',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 800, letterSpacing: '0.15em' }}>SIDE A • OUR SONG</span>
                <span style={{ fontSize: '0.72rem', color: isPlayingMusic ? '#4ade80' : '#94a3b8' }}>{isPlayingMusic ? '● PLAYING' : '○ PAUSED'}</span>
              </div>

              {/* Tape Spools */}
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '40px' }}>
                <motion.div
                  animate={{ rotate: isPlayingMusic ? 360 : 0 }}
                  transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                  style={{ width: '56px', height: '56px', borderRadius: '50%', border: '3px dashed #38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#38bdf8' }} />
                </motion.div>
                <motion.div
                  animate={{ rotate: isPlayingMusic ? 360 : 0 }}
                  transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                  style={{ width: '56px', height: '56px', borderRadius: '50%', border: '3px dashed #38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#38bdf8' }} />
                </motion.div>
              </div>

              <p style={{ color: '#cbd5e1', fontSize: '0.85rem', margin: 0 }}>
                Tap tape to spin frequency
              </p>
            </motion.div>
          </div>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setChapter(5)}
            style={{
              background: 'linear-gradient(135deg, #38bdf8, #6366f1)',
              color: '#fff',
              padding: '16px 40px',
              borderRadius: '999px',
              border: 'none',
              fontWeight: 800,
              fontSize: '1rem',
              cursor: 'pointer',
              boxShadow: '0 8px 25px rgba(56, 189, 248, 0.35)',
            }}
          >
            Send 10,000 km Virtual Hug &rarr;
          </motion.button>
        </div>
      )}

      {/* ── CHAPTER 5: 10,000 KM VIRTUAL HUG ── */}
      {chapter === 5 && (
        <div style={{ width: '100%', maxWidth: '820px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ marginBottom: '2.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#7dd3fc', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
              Chapter V: Radiant Warmth
            </span>
            <h2 style={{ fontFamily: 'var(--font-dancing)', fontSize: 'clamp(2.4rem, 6vw, 3.8rem)', color: '#fff', margin: '0.35rem 0' }}>
              Hold To Send Hug
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1rem' }}>
              Press and hold the glowing heart to charge a 10,000 km virtual embrace across the distance.
            </p>
          </div>

          <div style={{ margin: '0 auto 3rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              onMouseDown={() => setIsHoldingHug(true)}
              onMouseUp={() => setIsHoldingHug(false)}
              onTouchStart={() => setIsHoldingHug(true)}
              onTouchEnd={() => setIsHoldingHug(false)}
              style={{
                width: '180px',
                height: '180px',
                borderRadius: '50%',
                background: `radial-gradient(circle, rgba(56, 189, 248, ${hugProgress / 100}) 0%, rgba(15, 23, 42, 0.8) 100%)`,
                border: '3px solid #38bdf8',
                boxShadow: `0 0 ${hugProgress * 0.5}px #38bdf8`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                userSelect: 'none',
              }}
            >
              <span style={{ fontSize: '48px' }}>🫂</span>
            </motion.div>

            <div style={{ marginTop: '1.5rem', width: '260px', height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '99px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${hugProgress}%`, background: 'linear-gradient(90deg, #38bdf8, #818cf8)' }} />
            </div>
            <span style={{ fontSize: '0.85rem', color: '#7dd3fc', marginTop: '8px', fontWeight: 700 }}>
              {hugComplete ? '✓ HUG DELIVERED WITH INFINITE LOVE!' : `Charging... ${hugProgress}%`}
            </span>
          </div>

          {hugComplete && (
            <motion.button
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setChapter(6)}
              style={{
                background: 'linear-gradient(135deg, #38bdf8, #6366f1)',
                color: '#fff',
                padding: '16px 42px',
                borderRadius: '999px',
                border: 'none',
                fontWeight: 800,
                fontSize: '1.05rem',
                cursor: 'pointer',
                boxShadow: '0 8px 25px rgba(56, 189, 248, 0.4)',
              }}
            >
              Connect Star Constellation &rarr;
            </motion.button>
          )}
        </div>
      )}

      {/* ── CHAPTER 6: STAR CONSTELLATION ── */}
      {chapter === 6 && (
        <div style={{ width: '100%', maxWidth: '880px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ marginBottom: '2.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#7dd3fc', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
              Chapter VI: Celestial Map
            </span>
            <h2 style={{ fontFamily: 'var(--font-dancing)', fontSize: 'clamp(2.4rem, 6vw, 3.8rem)', color: '#fff', margin: '0.35rem 0' }}>
              Connect Our Constellation
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1rem' }}>
              Tap the stars to draw the cosmic line connecting our shared memories.
            </p>
          </div>

          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '680px',
              height: '340px',
              margin: '0 auto 3rem',
              background: 'radial-gradient(circle, rgba(15,23,42,0.95) 0%, rgba(3,7,18,0.98) 100%)',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              borderRadius: '28px',
              overflow: 'hidden',
            }}
          >
            {stars.map((s) => {
              const isConnected = connectedStars[s.id];
              return (
                <motion.div
                  key={s.id}
                  whileHover={{ scale: 1.2 }}
                  onClick={() => handleStarClick(s.id)}
                  style={{
                    position: 'absolute',
                    left: `${s.x}%`,
                    top: `${s.y}%`,
                    transform: 'translate(-50%, -50%)',
                    cursor: 'pointer',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      background: isConnected ? '#38bdf8' : 'rgba(255, 255, 255, 0.3)',
                      boxShadow: isConnected ? '0 0 25px #38bdf8' : 'none',
                      margin: '0 auto 4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <GoldBadge name="sparkle" size={14} />
                  </div>
                  <span style={{ fontSize: '0.75rem', color: isConnected ? '#38bdf8' : '#94a3b8', fontWeight: 600 }}>
                    {s.title}
                  </span>
                </motion.div>
              );
            })}
          </div>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setChapter(7)}
            style={{
              background: 'linear-gradient(135deg, #38bdf8, #6366f1)',
              color: '#fff',
              padding: '16px 42px',
              borderRadius: '999px',
              border: 'none',
              fontWeight: 800,
              fontSize: '1.05rem',
              cursor: 'pointer',
              boxShadow: '0 8px 25px rgba(56, 189, 248, 0.35)',
            }}
          >
            Read Unsent Letter & Reunion Date &rarr;
          </motion.button>
        </div>
      )}

      {/* ── CHAPTER 7: UNSENT LETTER & REUNION COUNTDOWN ── */}
      {chapter === 7 && (
        <div style={{ width: '100%', maxWidth: '960px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ display: 'inline-flex', padding: '18px', background: 'rgba(56, 189, 248, 0.15)', borderRadius: '50%', marginBottom: '1.25rem' }}>
              <GoldBadge name="compass" size={56} />
            </div>
            <h1
              style={{
                fontFamily: 'var(--font-dancing)',
                fontSize: 'clamp(2.4rem, 6vw, 4rem)',
                color: '#fff',
                margin: '0 0 0.5rem',
              }}
            >
              Until We Meet Again, {recipient}
            </h1>
            <p style={{ color: '#38bdf8', fontSize: '1.15rem', fontWeight: 600 }}>
              Expected Reunion: {reunionDate}
            </p>
          </div>

          {/* Letter */}
          <div style={{ marginBottom: '3rem' }}>
            <WaxSealLetter
              title={`To ${recipient}, Across The Distance`}
              content={customMsg}
              author="Waiting Patiently For You"
              date={new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <WholesomeMemeSticker caption="Next reunion incoming" />
          </div>
        </div>
      )}
    </CinematicStageWrapper>
  );
}
