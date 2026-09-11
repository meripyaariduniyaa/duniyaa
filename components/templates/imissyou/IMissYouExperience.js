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
 * 7-Chapter Long Distance Celestial Odyssey
 * Chapter 1: The Distance Radar & Flight Path
 * Chapter 2: The Last Time We Were Together
 * Chapter 3: 5 "Open When..." Virtual Envelopes
 * Chapter 4: The Shared Lo-Fi Cassette Player
 * Chapter 5: The 10,000 km Virtual Hug (Hold to Charge)
 * Chapter 6: The Star Constellation Connector
 * Chapter 7: The Unsent Letter & Reunion Countdown
 */
export default function IMissYouExperience({ note, isPreview = false, onReachEnd }) {
  const [chapter, setChapter] = useState(1);
  const [unlockedSecrets, setUnlockedSecrets] = useState([true, false, false]);

  useEffect(() => {
    onReachEnd?.(chapter === 7, () => {
      setChapter(1);
      setConnectedStars({});
      setHugProgress(0);
      setHugComplete(false);
    });
  }, [chapter, onReachEnd]);

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
  const distanceKm = note?.custom_details?.distance_km || '1,450';
  const songTitle = note?.custom_details?.song_title || 'Our Late Night Playlist';
  const reunionDate = note?.custom_details?.reunion_date || 'Soon';
  const photos = note?.image_urls || [];

  // Hug timer handler
  React.useEffect(() => {
    let interval = null;
    if (isHoldingHug && hugProgress < 100) {
      interval = setInterval(() => {
        setHugProgress((prev) => {
          if (prev >= 100) {
            setHugComplete(true);
            setUnlockedSecrets([true, true, unlockedSecrets[2]]);
            return 100;
          }
          return prev + 4;
        });
      }, 80);
    } else if (!isHoldingHug && hugProgress < 100) {
      setHugProgress(0);
    }
    return () => clearInterval(interval);
  }, [isHoldingHug, hugProgress, unlockedSecrets]);

  const handleStarClick = (idx) => {
    const updated = { ...connectedStars, [idx]: true };
    setConnectedStars(updated);
    if (Object.keys(updated).length >= 4) {
      setUnlockedSecrets([true, true, true]);
    }
  };

  const stars = [
    { id: 1, x: 20, y: 30, title: 'Your Voice' },
    { id: 2, x: 45, y: 20, title: 'Our Inside Jokes' },
    { id: 3, x: 75, y: 35, title: 'The Warmth' },
    { id: 4, x: 35, y: 70, title: 'Next Reunion' },
    { id: 5, x: 65, y: 75, title: 'Forever Home' },
  ];

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
        <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card"
            style={{
              padding: '3.5rem 2rem',
              borderRadius: '28px',
              border: '2px solid rgba(56, 189, 248, 0.4)',
              boxShadow: '0 25px 60px rgba(0,0,0,0.6), 0 0 35px rgba(56, 189, 248, 0.25)',
              maxWidth: '580px',
              margin: '0 auto',
            }}
          >
            <div style={{ display: 'inline-flex', padding: '16px', background: 'rgba(56, 189, 248, 0.15)', borderRadius: '50%', marginBottom: '1.25rem' }}>
              <GoldBadge name="compass" size={54} />
            </div>

            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.2em', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
              Long Distance Satellite Portal
            </span>

            <h1
              style={{
                fontFamily: 'var(--font-dancing)',
                fontSize: 'clamp(2.2rem, 5.5vw, 3.4rem)',
                color: '#fff',
                margin: '0 0 1.5rem',
              }}
            >
              Across {distanceKm} Kilometers
            </h1>

            {/* Glowing Distance Arc */}
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.7)',
                padding: '1.5rem',
                borderRadius: '20px',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '2rem',
                position: 'relative',
              }}
            >
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Origin</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>{cityA}</div>
              </div>

              <div style={{ flex: 1, margin: '0 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <motion.div
                  animate={{ x: [-20, 20, -20] }}
                  transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                  style={{ color: '#38bdf8' }}
                >
                  &harr;
                </motion.div>
                <div style={{ height: '2px', width: '100%', background: 'linear-gradient(90deg, #38bdf8, #818cf8)' }} />
                <span style={{ fontSize: '0.75rem', color: '#38bdf8', marginTop: '4px' }}>Connected Under One Sky</span>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Destination</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>{cityB}</div>
              </div>
            </div>

            <p style={{ color: '#cbd5e1', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>
              No matter how many miles separate us tonight, my heart resides right next to yours.
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setChapter(2)}
              style={{
                background: 'linear-gradient(135deg, #38bdf8, #6366f1)',
                color: '#fff',
                padding: '14px 36px',
                borderRadius: '50px',
                border: 'none',
                fontWeight: 800,
                fontSize: '1.05rem',
                cursor: 'pointer',
              }}
            >
              Step Into The Memory &rarr;
            </motion.button>
          </motion.div>
        </div>
      )}

      {/* ── CHAPTER 2: THE LAST TIME WE WERE TOGETHER ── */}
      {chapter === 2 && (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#38bdf8', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              Chapter II: That Lingering Warmth
            </span>
            <h2 style={{ fontFamily: 'var(--font-dancing)', fontSize: '2.5rem', color: '#fff', margin: '0.25rem 0' }}>
              The Last Time Together
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
              The scent of that final hug that kept me going through every lonely week.
            </p>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              borderRadius: '24px',
              padding: '2rem',
              marginBottom: '2rem',
              textAlign: 'center',
            }}
          >
            <GoldBadge name="heart" size={48} />
            <p style={{ color: '#e2e8f0', fontSize: '1.05rem', lineHeight: 1.7, marginTop: '1rem' }}>
              I still remember every single detail of the last moment we spent side by side: the warmth of your hand, the way you looked back, and that quiet promise that we would be together again soon.
            </p>
          </div>

          {photos.length > 0 && (
            <div style={{ marginBottom: '2.5rem' }}>
              <PolaroidStack photos={photos} />
            </div>
          )}

          <div style={{ textAlign: 'center' }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setChapter(3)}
              style={{
                background: 'linear-gradient(135deg, #38bdf8, #6366f1)',
                color: '#fff',
                padding: '14px 34px',
                borderRadius: '50px',
                border: 'none',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Open Your Virtual Envelopes &rarr;
            </motion.button>
          </div>
        </div>
      )}

      {/* ── CHAPTER 3: 5 OPEN WHEN ENVELOPES ── */}
      {chapter === 3 && (
        <div>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#38bdf8', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              Chapter III: Emergency Care Package
            </span>
            <h2 style={{ fontFamily: 'var(--font-dancing)', fontSize: '2.5rem', color: '#fff', margin: '0.25rem 0' }}>
              Open When... Letters
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
              Tap each envelope whenever your heart feels heavy.
            </p>
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <OpenWhenEnvelopes />
          </div>

          <div style={{ textAlign: 'center' }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setChapter(4)}
              style={{
                background: 'linear-gradient(135deg, #38bdf8, #6366f1)',
                color: '#fff',
                padding: '14px 34px',
                borderRadius: '50px',
                border: 'none',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Play Shared Cassette &rarr;
            </motion.button>
          </div>
        </div>
      )}

      {/* ── CHAPTER 4: SHARED CASSETTE PLAYER ── */}
      {chapter === 4 && (
        <div style={{ maxWidth: '560px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ marginBottom: '2rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#38bdf8', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              Chapter IV: Lo-Fi Mixtape
            </span>
            <h2 style={{ fontFamily: 'var(--font-dancing)', fontSize: '2.5rem', color: '#fff', margin: '0.25rem 0' }}>
              The Late Night Tape
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
              Songs that make the distance disappear.
            </p>
          </div>

          {/* Retro Cassette Widget */}
          <div
            style={{
              background: 'radial-gradient(circle, rgba(30,41,59,0.9) 0%, rgba(15,23,42,0.98) 100%)',
              border: '2px solid rgba(56, 189, 248, 0.4)',
              borderRadius: '24px',
              padding: '2.5rem 2rem',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
              marginBottom: '2rem',
            }}
          >
            <div style={{ display: 'inline-flex', padding: '16px', background: 'rgba(56, 189, 248, 0.15)', borderRadius: '50%', marginBottom: '1.25rem' }}>
              <GoldBadge name="cassette" size={54} />
            </div>

            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
              {songTitle}
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              SIDE A: For When You Stare At The Ceiling Thinking Of Me
            </p>

            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsPlayingMusic(!isPlayingMusic)}
              style={{
                background: isPlayingMusic ? 'rgba(56, 189, 248, 0.2)' : 'linear-gradient(135deg, #38bdf8, #6366f1)',
                color: '#fff',
                padding: '12px 28px',
                borderRadius: '50px',
                border: '1px solid rgba(56, 189, 248, 0.5)',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {isPlayingMusic ? '❚❚ TAPE PLAYING...' : '► PLAY DEDICATED TRACK'}
            </motion.button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
            <WholesomeMemeSticker type="talk3am" size={80} caption="3 AM calls > Distance" />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setChapter(5)}
            style={{
              background: 'linear-gradient(135deg, #38bdf8, #6366f1)',
              color: '#fff',
              padding: '14px 34px',
              borderRadius: '50px',
              border: 'none',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Charge 10,000 km Virtual Hug &rarr;
          </motion.button>
        </div>
      )}

      {/* ── CHAPTER 5: 10,000 KM VIRTUAL HUG ── */}
      {chapter === 5 && (
        <div style={{ maxWidth: '560px', margin: '0 auto', textAlign: 'center', padding: '2rem 1rem' }}>
          <div style={{ marginBottom: '2rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#38bdf8', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              Chapter V: Tactile Connection
            </span>
            <h2 style={{ fontFamily: 'var(--font-dancing)', fontSize: '2.5rem', color: '#fff', margin: '0.25rem 0' }}>
              The Long Distance Hug
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
              Press and hold the button below to charge and beam a warm, tight virtual hug.
            </p>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              borderRadius: '28px',
              padding: '3rem 2rem',
              position: 'relative',
              overflow: 'hidden',
              marginBottom: '2rem',
            }}
          >
            {/* Charging Progress Bar */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '6px',
                width: `${hugProgress}%`,
                background: 'linear-gradient(90deg, #38bdf8, #ec4899)',
                transition: 'width 0.1s linear',
              }}
            />

            <motion.div
              animate={{
                scale: isHoldingHug ? [1, 1.2, 1] : 1,
              }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              style={{ display: 'inline-flex', marginBottom: '1.5rem' }}
            >
              <GoldBadge name="heart" size={68} />
            </motion.div>

            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#38bdf8', marginBottom: '0.5rem' }}>
              {hugProgress}% Charged
            </div>

            <p style={{ color: '#cbd5e1', fontSize: '0.95rem', marginBottom: '2rem' }}>
              {hugComplete ? 'Hug delivered across the ocean with 100% warmth!' : 'Hold firmly without releasing...'}
            </p>

            <button
              onMouseDown={() => setIsHoldingHug(true)}
              onMouseUp={() => setIsHoldingHug(false)}
              onTouchStart={() => setIsHoldingHug(true)}
              onTouchEnd={() => setIsHoldingHug(false)}
              style={{
                background: hugComplete ? '#10b981' : 'linear-gradient(135deg, #38bdf8, #818cf8)',
                color: '#fff',
                padding: '16px 40px',
                borderRadius: '50px',
                border: 'none',
                fontSize: '1.1rem',
                fontWeight: 800,
                cursor: 'pointer',
                userSelect: 'none',
                boxShadow: '0 0 30px rgba(56, 189, 248, 0.5)',
              }}
            >
              {hugComplete ? '✓ Hug Received Warmly!' : 'HOLD TO HUG ❤️'}
            </button>
          </div>

          {hugComplete && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setChapter(6)}
              style={{
                background: 'linear-gradient(135deg, #38bdf8, #6366f1)',
                color: '#fff',
                padding: '14px 34px',
                borderRadius: '50px',
                border: 'none',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Connect Constellation Stars &rarr;
            </motion.button>
          )}
        </div>
      )}

      {/* ── CHAPTER 6: STAR CONSTELLATION CONNECTOR ── */}
      {chapter === 6 && (
        <div>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#38bdf8', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              Chapter VI: Night Sky Secrets
            </span>
            <h2 style={{ fontFamily: 'var(--font-dancing)', fontSize: '2.5rem', color: '#fff', margin: '0.25rem 0' }}>
              Our Star Constellation
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
              Tap each glowing star to weave our path across the night sky.
            </p>
          </div>

          {/* Interactive Sky Box */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '600px',
              height: '320px',
              margin: '0 auto 2.5rem',
              background: 'radial-gradient(circle, rgba(15,23,42,0.95) 0%, rgba(3,7,18,0.98) 100%)',
              border: '2px solid rgba(56, 189, 248, 0.4)',
              borderRadius: '24px',
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
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: isConnected ? '#38bdf8' : 'rgba(255, 255, 255, 0.4)',
                      boxShadow: isConnected ? '0 0 20px #38bdf8' : 'none',
                      margin: '0 auto 4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <GoldBadge name="sparkle" size={14} />
                  </div>
                  <span style={{ fontSize: '0.72rem', color: isConnected ? '#38bdf8' : '#94a3b8', fontWeight: 600 }}>
                    {s.title}
                  </span>
                </motion.div>
              );
            })}
          </div>

          <div style={{ textAlign: 'center' }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setChapter(7)}
              style={{
                background: 'linear-gradient(135deg, #38bdf8, #6366f1)',
                color: '#fff',
                padding: '14px 34px',
                borderRadius: '50px',
                border: 'none',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Read Final Letter & Reunion Date &rarr;
            </motion.button>
          </div>
        </div>
      )}

      {/* ── CHAPTER 7: UNSENT LETTER & REUNION COUNTDOWN ── */}
      {chapter === 7 && (
        <div>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ display: 'inline-flex', padding: '16px', background: 'rgba(56, 189, 248, 0.2)', borderRadius: '50%', marginBottom: '1rem' }}>
              <GoldBadge name="compass" size={54} />
            </div>
            <h1
              style={{
                fontFamily: 'var(--font-dancing)',
                fontSize: 'clamp(2.4rem, 6vw, 3.8rem)',
                color: '#fff',
                margin: '0 0 0.5rem',
              }}
            >
              Until We Meet Again, {recipient}
            </h1>
            <p style={{ color: '#38bdf8', fontSize: '1.1rem', fontWeight: 600 }}>
              Expected Reunion: {reunionDate}
            </p>
          </div>

          {/* Letter */}
          <div style={{ marginBottom: '2.5rem' }}>
            <WaxSealLetter
              title={`To ${recipient}, Across The Distance`}
              content={customMsg}
              author="Waiting Patiently For You"
              date={new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <WholesomeMemeSticker type="bearHug" size={80} caption="Next reunion incoming!" />
          </div>
        </div>
      )}
    </CinematicStageWrapper>
  );
}
