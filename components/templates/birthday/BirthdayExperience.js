'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CinematicStageWrapper from '../common/CinematicStageWrapper';
import GoldBadge from '../common/GoldBadge';
import WholesomeMemeSticker from '../common/WholesomeMemeSticker';
import SparklerCanvas from '../common/SparklerCanvas';
import PolaroidStack from '../common/PolaroidStack';
import WaxSealLetter from '../common/WaxSealLetter';

/**
 * 🎂 VIRTUAL BIRTHDAY BASH (ID: birthday)
 * 8-Scene Full-Bleed VIP Cinematic Celebration
 */
export default function BirthdayExperience({ note, isPreview = false, onReachEnd }) {
  const [scene, setScene] = useState(1);
  const [countdown, setCountdown] = useState(3);
  const [unlockedSecrets, setUnlockedSecrets] = useState([true, false, false]);

  // Scene 4: Balloon popping
  const [poppedBalloons, setPoppedBalloons] = useState({});

  // Scene 7: Cake candles extinguished
  const [candlesBlown, setCandlesBlown] = useState(false);

  const recipient = note?.recipient_name || 'Birthday Star';
  const customMsg = note?.custom_message || 'Happy Birthday! May your new year of life be overflowing with joy, incredible adventures, boundless health, and all the dreams your heart has been quietly holding.';
  const specialMemory = note?.custom_details?.special_memory || 'The unforgettably hilarious times we could not stop laughing until our stomachs hurt.';
  const giftClue = note?.custom_details?.gift_clue || 'Your biggest surprise is waiting in real life!';
  const photos = note?.image_urls || [];

  useEffect(() => {
    onReachEnd?.(scene === 8, () => {
      setScene(1);
      setCountdown(3);
      setPoppedBalloons({});
      setCandlesBlown(false);
    });
  }, [scene, onReachEnd]);

  // Countdown timer for Scene 1
  useEffect(() => {
    if (scene === 1 && countdown > 0) {
      const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [scene, countdown]);

  const balloons = [
    { id: 'b1', title: 'Infinite Laughs', desc: 'Guaranteed 365 days of unhinged laughter and spontaneous fun.' },
    { id: 'b2', title: 'Wild Adventures', desc: 'Unlocking new trips, delicious food quests, and road trips.' },
    { id: 'b3', title: 'Career Breakthroughs', desc: 'Watching every single goal you set fall into place effortlessly.' },
    { id: 'b4', title: 'Unconditional Love', desc: 'Never forgetting that you are deeply loved and cherished.' },
    { id: 'b5', title: 'A Secret Surprise', desc: giftClue }
  ];

  const handlePopBalloon = (id) => {
    const updated = { ...poppedBalloons, [id]: true };
    setPoppedBalloons(updated);
    if (Object.keys(updated).length >= 3) {
      setUnlockedSecrets([true, true, unlockedSecrets[2]]);
    }
  };

  const awards = [
    { title: 'The World\'s Best Energy', category: 'Grand Trophy', icon: 'crown' },
    { title: 'Master of Spontaneous Chaos', category: 'Golden Medal', icon: 'sparkle' },
    { title: 'Always Having Our Back', category: 'Diamond Honor', icon: 'heart' },
    { title: 'Unmatched Taste & Vibe', category: 'Hall of Fame', icon: 'toast' }
  ];

  return (
    <CinematicStageWrapper
      currentStep={scene}
      totalSteps={8}
      chapterTitle={
        scene === 1
          ? 'Midnight Countdown'
          : scene === 2
          ? 'Spotlight Entrance'
          : scene === 3
          ? 'Sparkler Wish'
          : scene === 4
          ? 'Pop The Balloons'
          : scene === 5
          ? 'Birthday Awards'
          : scene === 6
          ? 'Memory Cinema'
          : scene === 7
          ? 'Blow The Candles'
          : 'VIP Keepsake'
      }
      particleMode="gold_confetti"
      theme="festive"
      unlockedSecrets={unlockedSecrets}
    >
      {/* ── SCENE 1: MIDNIGHT COUNTDOWN ── */}
      {scene === 1 && (
        <div style={{ width: '100%', maxWidth: '780px', margin: '0 auto', textAlign: 'center', padding: '2rem 1rem' }}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fbbf24', letterSpacing: '0.22em', textTransform: 'uppercase', display: 'block', marginBottom: '1.5rem' }}>
              ✦ Live Birthday Broadcast ✦
            </span>

            <div style={{ margin: '2rem 0' }}>
              <AnimatePresence mode="wait">
                {countdown > 0 ? (
                  <motion.div
                    key={countdown}
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1.2, opacity: 1 }}
                    exit={{ scale: 1.8, opacity: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    style={{
                      fontFamily: '"Playfair Display", Georgia, serif',
                      fontSize: 'clamp(5.5rem, 16vw, 10rem)',
                      fontWeight: 900,
                      color: '#fbbf24',
                      textShadow: '0 0 50px rgba(251, 191, 36, 0.7), 0 0 100px rgba(245, 158, 11, 0.4)',
                      lineHeight: 1,
                    }}
                  >
                    {countdown}
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <h1
                      style={{
                        fontFamily: 'var(--font-dancing)',
                        fontSize: 'clamp(3rem, 8vw, 5.5rem)',
                        color: '#ffffff',
                        textShadow: '0 0 35px rgba(251, 191, 36, 0.8)',
                        margin: '0 0 1.5rem',
                      }}
                    >
                      IT&apos;S YOUR BIRTHDAY!
                    </h1>
                    <p style={{ color: '#cbd5e1', fontSize: '1.2rem', maxWidth: '520px', margin: '0 auto 2.5rem' }}>
                      The universe has been waiting 365 days for this exact celebration.
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05, boxShadow: '0 0 45px rgba(245, 158, 11, 0.8)' }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setScene(2)}
                      style={{
                        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                        color: '#000000',
                        padding: '18px 46px',
                        borderRadius: '999px',
                        border: 'none',
                        fontWeight: 800,
                        fontSize: '1.15rem',
                        cursor: 'pointer',
                        boxShadow: '0 10px 30px rgba(245, 158, 11, 0.4)',
                      }}
                    >
                      Step Into The Spotlight &rarr;
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}

      {/* ── SCENE 2: SPOTLIGHT GRAND ENTRANCE ── */}
      {scene === 2 && (
        <div style={{ width: '100%', maxWidth: '820px', margin: '0 auto', textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              padding: 'clamp(2.5rem, 5vw, 4rem) clamp(1.5rem, 5vw, 3rem)',
              borderRadius: '32px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              backdropFilter: 'blur(30px)',
              boxShadow: '0 30px 80px rgba(0,0,0,0.6), 0 0 50px rgba(245, 158, 11, 0.15)',
            }}
          >
            <div style={{ display: 'inline-flex', padding: '18px', background: 'rgba(245, 158, 11, 0.15)', borderRadius: '50%', marginBottom: '1.5rem' }}>
              <GoldBadge name="crown" size={60} />
            </div>

            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#fbbf24', letterSpacing: '0.2em', textTransform: 'uppercase', display: 'block', marginBottom: '1rem' }}>
              VIP Guest of Honor
            </span>

            <h1
              style={{
                fontFamily: 'var(--font-dancing)',
                fontSize: 'clamp(2.5rem, 6vw, 4.2rem)',
                color: '#fff',
                margin: '0 0 1.25rem',
                textShadow: '0 0 30px rgba(251, 191, 36, 0.4)',
              }}
            >
              Happy Birthday, {recipient}!
            </h1>

            <p style={{ color: '#cbd5e1', fontSize: '1.1rem', lineHeight: 1.8, maxWidth: '580px', margin: '0 auto 2.5rem' }}>
              Tonight is entirely dedicated to your laughter, your dreams, and all the brilliance you effortlessly bring into our lives.
            </p>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setScene(3)}
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: '#000000',
                padding: '16px 42px',
                borderRadius: '999px',
                border: 'none',
                fontWeight: 800,
                fontSize: '1.05rem',
                cursor: 'pointer',
                boxShadow: '0 8px 25px rgba(245, 158, 11, 0.35)',
              }}
            >
              Write Your Sky Sparkler Wish &rarr;
            </motion.button>
          </motion.div>
        </div>
      )}

      {/* ── SCENE 3: SKY SPARKLER SIGNATURE ── */}
      {scene === 3 && (
        <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ marginBottom: '2rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fbbf24', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
              Scene III: Interactive Sky Sparkler
            </span>
            <h2 style={{ fontFamily: 'var(--font-dancing)', fontSize: 'clamp(2.2rem, 5vw, 3.4rem)', color: '#fff', margin: '0.35rem 0' }}>
              Draw Your Midnight Wish
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1rem' }}>
              Drag your finger or cursor on the night sky canvas to light glowing gold sparkler trails.
            </p>
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <SparklerCanvas onDraw={() => {}} />
          </div>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setScene(4)}
            style={{
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: '#000',
              padding: '16px 40px',
              borderRadius: '999px',
              border: 'none',
              fontWeight: 800,
              fontSize: '1.05rem',
              cursor: 'pointer',
              boxShadow: '0 8px 25px rgba(245, 158, 11, 0.35)',
            }}
          >
            Pop The Mystery Balloons &rarr;
          </motion.button>
        </div>
      )}

      {/* ── SCENE 4: FLOATING MYSTERY BALLOONS ── */}
      {scene === 4 && (
        <div style={{ width: '100%', maxWidth: '960px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fbbf24', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
              Scene IV: Golden Surprises
            </span>
            <h2 style={{ fontFamily: 'var(--font-dancing)', fontSize: 'clamp(2.2rem, 5vw, 3.4rem)', color: '#fff', margin: '0.35rem 0' }}>
              Pop The 5 Mystery Balloons
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1rem' }}>
              Tap each floating golden balloon to pop it and reveal what destiny holds for you this year.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
            {balloons.map((b, idx) => {
              const isPopped = poppedBalloons[b.id];
              return (
                <motion.div
                  key={b.id}
                  whileHover={{ y: -6, scale: 1.02 }}
                  onClick={() => handlePopBalloon(b.id)}
                  style={{
                    background: isPopped ? 'rgba(245, 158, 11, 0.14)' : 'rgba(255, 255, 255, 0.03)',
                    border: isPopped ? '1px solid rgba(245, 158, 11, 0.5)' : '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '24px',
                    padding: '2rem',
                    cursor: 'pointer',
                    backdropFilter: 'blur(20px)',
                    minHeight: '200px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <GoldBadge name="sparkle" size={26} />
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, color: isPopped ? '#4ade80' : '#fbbf24', letterSpacing: '0.1em' }}>
                        {isPopped ? '💥 POPPED!' : '🎈 TAP TO POP'}
                      </span>
                    </div>
                    <h3 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 700 }}>
                      {b.title}
                    </h3>
                    <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: 1.6 }}>
                      {isPopped ? b.desc : 'Pop balloon to inspect secret wish.'}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div style={{ textAlign: 'center' }}>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setScene(5)}
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: '#000',
                padding: '16px 40px',
                borderRadius: '999px',
                border: 'none',
                fontWeight: 800,
                fontSize: '1rem',
                cursor: 'pointer',
                boxShadow: '0 8px 25px rgba(245, 158, 11, 0.35)',
              }}
            >
              Enter Official Awards &rarr;
            </motion.button>
          </div>
        </div>
      )}

      {/* ── SCENE 5: BIRTHDAY AWARDS ── */}
      {scene === 5 && (
        <div style={{ width: '100%', maxWidth: '960px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fbbf24', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
              Scene V: Official Honors
            </span>
            <h2 style={{ fontFamily: 'var(--font-dancing)', fontSize: 'clamp(2.2rem, 5vw, 3.4rem)', color: '#fff', margin: '0.35rem 0' }}>
              The Official VIP Honors
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1rem' }}>
              Unanimously voted by everyone who knows and cherishes you.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
            {awards.map((aw, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -6, scale: 1.02 }}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(245, 158, 11, 0.25)',
                  borderRadius: '24px',
                  padding: '2rem 1.5rem',
                  textAlign: 'center',
                  backdropFilter: 'blur(20px)',
                }}
              >
                <div style={{ display: 'inline-flex', padding: '16px', background: 'rgba(245, 158, 11, 0.12)', borderRadius: '50%', marginBottom: '1.25rem' }}>
                  <GoldBadge name={aw.icon} size={40} />
                </div>
                <h3 style={{ color: '#fff', fontSize: '1.2rem', margin: '0 0 0.5rem', fontWeight: 700 }}>{aw.title}</h3>
                <p style={{ color: '#fbbf24', fontSize: '0.85rem', margin: 0, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{aw.category}</p>
              </motion.div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setScene(6)}
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: '#000',
                padding: '16px 40px',
                borderRadius: '999px',
                border: 'none',
                fontWeight: 800,
                fontSize: '1rem',
                cursor: 'pointer',
                boxShadow: '0 8px 25px rgba(245, 158, 11, 0.35)',
              }}
            >
              Enter The Memory Cinema &rarr;
            </motion.button>
          </div>
        </div>
      )}

      {/* ── SCENE 6: MEMORY CINEMA ── */}
      {scene === 6 && (
        <div style={{ width: '100%', maxWidth: '880px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ marginBottom: '2.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fbbf24', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
              Scene VI: Nostalgic Reel
            </span>
            <h2 style={{ fontFamily: 'var(--font-dancing)', fontSize: 'clamp(2.2rem, 5vw, 3.4rem)', color: '#fff', margin: '0.35rem 0' }}>
              The Memory Cinema
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1rem' }}>
              Swipe through our shared scrapbook of adventures and laughter.
            </p>
          </div>

          <div style={{ marginBottom: '3rem' }}>
            <PolaroidStack photos={photos.length > 0 ? photos : ['/images/sample1.jpg', '/images/sample2.jpg']} />
          </div>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setScene(7)}
            style={{
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: '#000',
              padding: '16px 42px',
              borderRadius: '999px',
              border: 'none',
              fontWeight: 800,
              fontSize: '1.05rem',
              cursor: 'pointer',
              boxShadow: '0 8px 25px rgba(245, 158, 11, 0.35)',
            }}
          >
            Light The Birthday Cake &rarr;
          </motion.button>
        </div>
      )}

      {/* ── SCENE 7: 3D CAKE & CANDLE BLOWOUT ── */}
      {scene === 7 && (
        <div style={{ width: '100%', maxWidth: '820px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ marginBottom: '2.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fbbf24', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
              Scene VII: Make a Wish
            </span>
            <h2 style={{ fontFamily: 'var(--font-dancing)', fontSize: 'clamp(2.4rem, 6vw, 3.8rem)', color: '#fff', margin: '0.35rem 0' }}>
              Blow Out The Candles!
            </h2>
            <p style={{ color: '#fbbf24', fontSize: '1.1rem', fontWeight: 600 }}>
              Tap the glowing candles to blow them out and make your wish come true.
            </p>
          </div>

          {/* Birthday Cake */}
          <div style={{ margin: '0 auto 3rem', display: 'flex', justifyContent: 'center' }}>
            <motion.div
              whileHover={{ scale: candlesBlown ? 1 : 1.04 }}
              onClick={() => setCandlesBlown(true)}
              style={{
                width: 'min(88vw, 340px)',
                height: '240px',
                borderRadius: '32px',
                background: 'linear-gradient(145deg, #2e0854, #120422)',
                border: '2px solid rgba(245, 158, 11, 0.4)',
                boxShadow: '0 30px 70px rgba(0,0,0,0.7), inset 0 2px 10px rgba(255,255,255,0.1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                position: 'relative',
              }}
            >
              {candlesBlown ? (
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  style={{ textAlign: 'center' }}
                >
                  <span style={{ fontSize: '64px', display: 'block', marginBottom: '8px' }}>✨🎂🎉</span>
                  <p style={{ color: '#fbbf24', fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>
                    WISH GRANTED!
                  </p>
                </motion.div>
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: '64px', display: 'block', animation: 'bounce 1.5s infinite alternate' }}>🕯️🎂🕯️</span>
                  <p style={{ color: '#fbbf24', fontSize: '0.95rem', fontWeight: 800, margin: '10px 0 0', letterSpacing: '0.1em' }}>
                    TAP TO BLOW CANDLES
                  </p>
                </div>
              )}
            </motion.div>
          </div>

          {candlesBlown && (
            <motion.button
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setScene(8)}
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: '#000',
                padding: '18px 46px',
                borderRadius: '999px',
                border: 'none',
                fontWeight: 800,
                fontSize: '1.15rem',
                cursor: 'pointer',
                boxShadow: '0 10px 30px rgba(245, 158, 11, 0.45)',
              }}
            >
              Claim VIP Lifetime Birthday Pass &rarr;
            </motion.button>
          )}
        </div>
      )}

      {/* ── SCENE 8: VIP LIFETIME PASS & LETTER ── */}
      {scene === 8 && (
        <div style={{ width: '100%', maxWidth: '960px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ display: 'inline-flex', padding: '18px', background: 'rgba(245, 158, 11, 0.15)', borderRadius: '50%', marginBottom: '1.25rem' }}>
              <GoldBadge name="crown" size={56} />
            </div>
            <h1
              style={{
                fontFamily: 'var(--font-dancing)',
                fontSize: 'clamp(2.4rem, 6vw, 4rem)',
                color: '#fff',
                margin: '0 0 0.5rem',
              }}
            >
              Lifetime VIP Golden Pass
            </h1>
            <p style={{ color: '#fbbf24', fontSize: '1.15rem', fontWeight: 600 }}>
              Officially minted for {recipient}.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.75rem', marginBottom: '3rem' }}>
            {/* VIP Pass Card */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: '28px',
                padding: '2.25rem',
                backdropFilter: 'blur(20px)',
              }}
            >
              <h3 style={{ color: '#fff', fontSize: '1.3rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <GoldBadge name="crown" size={24} />
                Exclusive VIP Privileges
              </h3>
              <div style={{ background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: '14px', padding: '8px 14px', color: '#fbbf24', fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.1em', marginBottom: '1rem' }}>
                VALIDITY: FOREVER • UNLIMITED SMILES
              </div>
              <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: 1.7 }}>
                Entitles holder to guaranteed hugs, listening ears, spontaneous food outings, and lifelong unconditional support.
              </p>
            </div>

            {/* Gift Clue Card */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: '28px',
                padding: '2.25rem',
                backdropFilter: 'blur(20px)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <h3 style={{ color: '#fff', fontSize: '1.3rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <GoldBadge name="sparkle" size={24} />
                  Secret Gift Clue
                </h3>
                <p style={{ color: '#fbbf24', fontSize: '1.1rem', fontWeight: 600, margin: '0 0 1rem' }}>
                  {giftClue}
                </p>
                <p style={{ color: '#94a3b8', fontSize: '0.92rem', lineHeight: 1.7 }}>
                  May this birthday be the launchpad for the most extraordinary year of your life yet.
                </p>
              </div>

              <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                <WholesomeMemeSticker caption="Lifetime VIP Holder" />
              </div>
            </div>
          </div>

          {/* Letter / Keepsake */}
          <div style={{ marginBottom: '3rem' }}>
            <WaxSealLetter
              title={`A Birthday Letter for ${recipient}`}
              content={customMsg}
              author="With all my love & best wishes"
              date={new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            />
          </div>
        </div>
      )}
    </CinematicStageWrapper>
  );
}
