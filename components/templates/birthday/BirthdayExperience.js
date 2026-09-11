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
 * 8-Scene VIP Cinematic Celebration
 * Scene 1: The Midnight 3-2-1 Countdown
 * Scene 2: The Spotlight Grand Entrance
 * Scene 3: The Sky Sparkler Signature (Interactive Canvas)
 * Scene 4: The 5 Floating Mystery Balloons
 * Scene 5: The Birthday Awards Ceremony
 * Scene 6: The Memory Cinema (Vintage Polaroids)
 * Scene 7: The Candle Blowout & Fireworks
 * Scene 8: The Finale Letter & VIP Lifetime Pass
 */
export default function BirthdayExperience({ note, isPreview = false, onReachEnd }) {
  const [scene, setScene] = useState(1);
  const [countdown, setCountdown] = useState(3);
  const [unlockedSecrets, setUnlockedSecrets] = useState([true, false, false]);

  useEffect(() => {
    onReachEnd?.(scene === 8, () => {
      setScene(1);
      setCountdown(3);
      setPoppedBalloons({});
      setCandlesBlown(false);
    });
  }, [scene, onReachEnd]);

  // Scene 4: Balloon popping
  const [poppedBalloons, setPoppedBalloons] = useState({});

  // Scene 7: Cake candles extinguished
  const [candlesBlown, setCandlesBlown] = useState(false);

  const recipient = note?.recipient_name || 'Birthday Star';
  const customMsg = note?.custom_message || 'Happy Birthday! May your new year of life be overflowing with joy, incredible adventures, boundless health, and all the dreams your heart has been quietly holding.';
  const specialMemory = note?.custom_details?.special_memory || 'The unforgettably hilarious times we could not stop laughing until our stomachs hurt.';
  const giftClue = note?.custom_details?.gift_clue || 'Your biggest surprise is waiting in real life!';
  const photos = note?.image_urls || [];

  const balloons = [
    { id: 'b1', title: 'A Secret Compliment', text: 'Your positive energy lights up every single room you step into.', color: '#f59e0b' },
    { id: 'b2', title: 'The Unfiltered Truth', text: 'You are genuinely one of the most reliable and caring humans on Earth.', color: '#ec4899' },
    { id: 'b3', title: 'An Inside Joke', text: specialMemory, color: '#8b5cf6' },
    { id: 'b4', title: 'A Year Wish', text: 'May this year bring massive breakthroughs and unmatched peace.', color: '#3b82f6' },
    { id: 'b5', title: 'Gift Clue', text: giftClue, color: '#10b981' },
  ];

  const handlePopBalloon = (id) => {
    const updated = { ...poppedBalloons, [id]: true };
    setPoppedBalloons(updated);
    if (Object.keys(updated).length >= 3) {
      setUnlockedSecrets([true, true, unlockedSecrets[2]]);
    }
  };

  const handleBlowCandles = () => {
    setCandlesBlown(true);
    setUnlockedSecrets([true, true, true]);
    setTimeout(() => {
      setScene(8);
    }, 2400);
  };

  const awards = [
    { title: 'The Golden Human Award', category: 'Best Energy & Kindness', icon: 'crown' },
    { title: 'Chief Food Connoisseur', category: 'Master of Snacking & Good Taste', icon: 'toast' },
    { title: 'Supreme Laugh Inducer', category: 'Turn Any Dull Moment Chaotic', icon: 'sparkle' },
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
      particleMode={candlesBlown || scene === 8 ? 'confetti' : 'stardust'}
      theme="festive"
      unlockedSecrets={unlockedSecrets}
    >
      {/* ── SCENE 1: MIDNIGHT COUNTDOWN ── */}
      {scene === 1 && (
        <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card"
            style={{
              padding: '3.5rem 2rem',
              borderRadius: '28px',
              border: '2px solid rgba(245, 158, 11, 0.4)',
              boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 0 35px rgba(245, 158, 11, 0.25)',
              maxWidth: '520px',
              margin: '0 auto',
            }}
          >
            <div style={{ display: 'inline-flex', padding: '16px', background: 'rgba(245, 158, 11, 0.15)', borderRadius: '50%', marginBottom: '1.5rem' }}>
              <GoldBadge name="sparkle" size={54} />
            </div>

            <span style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#fbbf24', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              VIP Birthday Premiere
            </span>

            <h1
              style={{
                fontFamily: 'var(--font-dancing)',
                fontSize: 'clamp(2.2rem, 5.5vw, 3.4rem)',
                color: '#fff',
                margin: '0 0 1.25rem',
              }}
            >
              Ready For The Show, {recipient}?
            </h1>

            <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '2.5rem' }}>
              The theater lights are dimming. A personalized multi-stage celebration has been crafted exclusively for your special day.
            </p>

            <motion.button
              whileHover={{ scale: 1.06, boxShadow: '0 0 35px rgba(245, 158, 11, 0.7)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setScene(2)}
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: '#000',
                padding: '16px 40px',
                borderRadius: '50px',
                border: 'none',
                fontSize: '1.15rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <GoldBadge name="crown" size={20} />
              Start The Celebration
            </motion.button>
          </motion.div>
        </div>
      )}

      {/* ── SCENE 2: SPOTLIGHT GRAND ENTRANCE ── */}
      {scene === 2 && (
        <div style={{ textAlign: 'center' }}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="glass-card"
            style={{
              padding: '3.5rem 2rem',
              borderRadius: '28px',
              border: '2px solid rgba(245, 158, 11, 0.4)',
              background: 'radial-gradient(circle at 50% 20%, rgba(245, 158, 11, 0.15) 0%, rgba(0,0,0,0.7) 100%)',
            }}
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              style={{ display: 'inline-flex', marginBottom: '1.5rem' }}
            >
              <GoldBadge name="crown" size={68} />
            </motion.div>

            <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#f59e0b', letterSpacing: '0.25em', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
              All Eyes On The Star
            </span>

            <h1
              style={{
                fontFamily: 'var(--font-dancing)',
                fontSize: 'clamp(2.6rem, 6vw, 3.8rem)',
                color: '#fff',
                margin: '0 0 1rem',
                textShadow: '0 0 25px rgba(245, 158, 11, 0.6)',
              }}
            >
              Happy Birthday, {recipient}!
            </h1>

            <p style={{ color: '#cbd5e1', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
              Today is the one day every year dedicated completely to celebrating your existence and the joy you bring to everyone.
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setScene(3)}
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: '#000',
                padding: '14px 34px',
                borderRadius: '50px',
                border: 'none',
                fontSize: '1.05rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Ignite Birthday Sparkler
            </motion.button>
          </motion.div>
        </div>
      )}

      {/* ── SCENE 3: SKY SPARKLER SIGNATURE ── */}
      {scene === 3 && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fbbf24', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              Scene III: Make A Wish
            </span>
            <h2 style={{ fontFamily: 'var(--font-dancing)', fontSize: '2.5rem', color: '#fff', margin: '0.25rem 0' }}>
              Golden Sparkler Canvas
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
              Drag or touch across the dark sky to write your birthday wish in shimmering sparks.
            </p>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <SparklerCanvas />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setScene(4)}
            style={{
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: '#000',
              padding: '14px 34px',
              borderRadius: '50px',
              border: 'none',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Wish Recorded &rarr; Pop Balloons
          </motion.button>
        </div>
      )}

      {/* ── SCENE 4: 5 FLOATING MYSTERY BALLOONS ── */}
      {scene === 4 && (
        <div>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fbbf24', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              Scene IV: Interactive Revelations
            </span>
            <h2 style={{ fontFamily: 'var(--font-dancing)', fontSize: '2.5rem', color: '#fff', margin: '0.25rem 0' }}>
              Pop The Celebration Balloons
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
              Tap each floating balloon to pop it and reveal secret birthday messages.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
            {balloons.map((b) => {
              const isPopped = poppedBalloons[b.id];
              return (
                <motion.div
                  key={b.id}
                  whileHover={!isPopped ? { scale: 1.06, y: -6 } : {}}
                  onClick={() => handlePopBalloon(b.id)}
                  style={{
                    background: isPopped ? 'rgba(255, 255, 255, 0.06)' : `radial-gradient(circle at 30% 30%, ${b.color}88 0%, rgba(20,20,20,0.8) 100%)`,
                    border: isPopped ? '1px solid rgba(255, 255, 255, 0.15)' : `2px solid ${b.color}`,
                    borderRadius: '24px',
                    padding: '1.5rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    minHeight: '160px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    boxShadow: isPopped ? 'none' : `0 10px 25px ${b.color}33`,
                    transition: 'all 0.3s ease',
                  }}
                >
                  {!isPopped ? (
                    <>
                      <div style={{ width: '44px', height: '54px', background: b.color, borderRadius: '50% 50% 50% 50% / 40% 40% 60% 60%', margin: '0 auto 0.75rem', boxShadow: 'inset -5px -5px 10px rgba(0,0,0,0.3)' }} />
                      <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>{b.title}</div>
                      <span style={{ fontSize: '0.75rem', color: '#fbbf24', marginTop: '4px' }}>Tap to Pop!</span>
                    </>
                  ) : (
                    <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#fbbf24', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                        {b.title}
                      </div>
                      <p style={{ color: '#fff', fontSize: '0.9rem', lineHeight: 1.4, margin: 0 }}>
                        {b.text}
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>

          <div style={{ textAlign: 'center' }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setScene(5)}
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: '#000',
                padding: '14px 34px',
                borderRadius: '50px',
                border: 'none',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Proceed to Awards Ceremony
            </motion.button>
          </div>
        </div>
      )}

      {/* ── SCENE 5: BIRTHDAY AWARDS ── */}
      {scene === 5 && (
        <div>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fbbf24', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              Scene V: Official Honors
            </span>
            <h2 style={{ fontFamily: 'var(--font-dancing)', fontSize: '2.5rem', color: '#fff', margin: '0.25rem 0' }}>
              The 2026 Birthday Honors
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
              Unanimously voted by everyone who knows and loves you.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
            {awards.map((aw, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -6, scale: 1.02 }}
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  borderRadius: '20px',
                  padding: '1.75rem 1.25rem',
                  textAlign: 'center',
                }}
              >
                <div style={{ display: 'inline-flex', padding: '14px', background: 'rgba(245, 158, 11, 0.15)', borderRadius: '50%', marginBottom: '1rem' }}>
                  <GoldBadge name={aw.icon} size={36} />
                </div>
                <h3 style={{ color: '#fff', fontSize: '1.15rem', margin: '0 0 0.5rem' }}>{aw.title}</h3>
                <p style={{ color: '#fbbf24', fontSize: '0.85rem', margin: 0, fontWeight: 600 }}>{aw.category}</p>
              </motion.div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
            <WholesomeMemeSticker type="stolenFries" size={80} caption="Officially certified VIP!" />
          </div>

          <div style={{ textAlign: 'center' }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setScene(6)}
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: '#000',
                padding: '14px 34px',
                borderRadius: '50px',
                border: 'none',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Enter The Memory Cinema
            </motion.button>
          </div>
        </div>
      )}

      {/* ── SCENE 6: MEMORY CINEMA ── */}
      {scene === 6 && (
        <div>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fbbf24', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              Scene VI: Nostalgic Reel
            </span>
            <h2 style={{ fontFamily: 'var(--font-dancing)', fontSize: '2.5rem', color: '#fff', margin: '0.25rem 0' }}>
              The Memory Cinema
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
              Framed moments of pure happiness, laughs, and friendship.
            </p>
          </div>

          {photos.length > 0 ? (
            <div style={{ marginBottom: '2.5rem' }}>
              <PolaroidStack photos={photos} />
            </div>
          ) : (
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px dashed rgba(245, 158, 11, 0.3)',
                borderRadius: '24px',
                padding: '3rem 2rem',
                textAlign: 'center',
                maxWidth: '480px',
                margin: '0 auto 2.5rem',
              }}
            >
              <GoldBadge name="sparkle" size={48} />
              <h3 style={{ color: '#fff', marginTop: '1rem' }}>Pure Golden Moments</h3>
              <p style={{ color: '#cbd5e1', fontSize: '0.95rem' }}>
                Every single second spent with you is a memory worth treasuring for a lifetime.
              </p>
            </div>
          )}

          <div style={{ textAlign: 'center' }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setScene(7)}
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: '#000',
                padding: '14px 34px',
                borderRadius: '50px',
                border: 'none',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Ready For The Birthday Cake &rarr;
            </motion.button>
          </div>
        </div>
      )}

      {/* ── SCENE 7: CAKE BLOWOUT & FIREWORKS ── */}
      {scene === 7 && (
        <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
          <motion.div
            initial={{ scale: 0.88, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card"
            style={{
              padding: '3.5rem 2rem',
              borderRadius: '28px',
              border: '2px solid rgba(245, 158, 11, 0.4)',
              boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
              maxWidth: '540px',
              margin: '0 auto',
            }}
          >
            <motion.div
              animate={{
                scale: candlesBlown ? [1, 1.2, 1] : [1, 1.04, 1],
              }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              style={{ display: 'inline-flex', marginBottom: '1.5rem' }}
            >
              <GoldBadge name="cake" size={76} />
            </motion.div>

            <h1
              style={{
                fontFamily: 'var(--font-dancing)',
                fontSize: 'clamp(2.4rem, 6vw, 3.4rem)',
                color: '#fff',
                margin: '0 0 1rem',
              }}
            >
              {candlesBlown ? 'WISH GRANTED!' : 'Make Your Secret Wish'}
            </h1>

            <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>
              {candlesBlown
                ? 'The universe has received your wish! Confetti and fireworks are bursting across the sky!'
                : 'Close your eyes, think of the one thing you want most this year, and blow out the candles!'}
            </p>

            {!candlesBlown && (
              <motion.button
                whileHover={{ scale: 1.08, boxShadow: '0 0 35px rgba(245, 158, 11, 0.8)' }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBlowCandles}
                style={{
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: '#000',
                  padding: '16px 42px',
                  borderRadius: '50px',
                  border: 'none',
                  fontSize: '1.2rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <GoldBadge name="candle" size={22} />
                Blow Out The Candles!
              </motion.button>
            )}
          </motion.div>
        </div>
      )}

      {/* ── SCENE 8: THE FINALE LETTER & VIP PASS ── */}
      {scene === 8 && (
        <div>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ display: 'inline-flex', padding: '16px', background: 'rgba(245, 158, 11, 0.2)', borderRadius: '50%', marginBottom: '1rem' }}>
              <GoldBadge name="crown" size={54} />
            </div>
            <h1
              style={{
                fontFamily: 'var(--font-dancing)',
                fontSize: 'clamp(2.5rem, 6vw, 3.8rem)',
                color: '#fff',
                margin: '0 0 0.5rem',
              }}
            >
              The Grand Finale
            </h1>
            <p style={{ color: '#fbbf24', fontSize: '1.1rem', fontWeight: 600 }}>
              Your lifetime VIP birthday card & personal tribute.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
            {/* VIP Pass */}
            <div
              style={{
                background: 'radial-gradient(circle at 10% 20%, rgba(245, 158, 11, 0.2) 0%, rgba(0,0,0,0.85) 100%)',
                border: '2px solid #f59e0b',
                borderRadius: '24px',
                padding: '2rem',
                boxShadow: '0 0 35px rgba(245, 158, 11, 0.25)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#fbbf24', letterSpacing: '0.2em' }}>VIP ALL-ACCESS PASS</span>
                  <GoldBadge name="crown" size={24} />
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
                  {recipient}
                </div>
                <div style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                  VALIDITY: FOREVER • UNLIMITED SMILES & FAVOR
                </div>
                <p style={{ color: '#cbd5e1', fontSize: '0.92rem', lineHeight: 1.6 }}>
                  Entitles holder to guaranteed hugs, listening ears, spontaneous food outings, and lifelong unconditional support.
                </p>
              </div>

              <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                <WholesomeMemeSticker type="bearHug" size={75} caption="Lifetime VIP holder" />
              </div>
            </div>

            {/* Gift Clue Card */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: '24px',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <h3 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <GoldBadge name="sparkle" size={20} />
                  Secret Gift Clue
                </h3>
                <p style={{ color: '#fbbf24', fontSize: '1.05rem', fontWeight: 600, margin: '0 0 1rem' }}>
                  {giftClue}
                </p>
                <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.6 }}>
                  May this birthday be the launchpad for the most extraordinary year of your life yet.
                </p>
              </div>

              <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                <GoldBadge name="toast" size={48} />
              </div>
            </div>
          </div>

          {/* Letter / Keepsake */}
          <div style={{ marginBottom: '2.5rem' }}>
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
