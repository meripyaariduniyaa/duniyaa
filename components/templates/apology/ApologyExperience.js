'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CinematicStageWrapper from '../common/CinematicStageWrapper';
import GoldBadge from '../common/GoldBadge';
import WholesomeMemeSticker from '../common/WholesomeMemeSticker';
import OrigamiCrane from '../common/OrigamiCrane';
import WaxSealLetter from '../common/WaxSealLetter';
import PolaroidStack from '../common/PolaroidStack';

/**
 * 🌧️ I'M SORRY (ID: emotional-apology)
 * 7-Chapter Vulnerable Apology & Healing Journey
 * Chapter 1: The Rainy Window Reflection
 * Chapter 2: The "What I Did" Accountable Card
 * Chapter 3: The 3 Regret Envelopes
 * Chapter 4: The Sacred Memory
 * Chapter 5: The Origami Promise Crane (Interactive 3D Fold)
 * Chapter 6: The Zero-Pressure Respect Choice
 * Chapter 7: The Sincere Letter & Sanctuary
 */
export default function ApologyExperience({ note, isPreview = false, onReachEnd }) {
  const [chapter, setChapter] = useState(1);
  const [unlockedSecrets, setUnlockedSecrets] = useState([true, false, false]);

  useEffect(() => {
    onReachEnd?.(chapter === 7, () => {
      setChapter(1);
      setIsWindowCleared(false);
    });
  }, [chapter, onReachEnd]);

  // Chapter 1: Window wiping
  const [isWindowCleared, setIsWindowCleared] = useState(false);

  // Chapter 3: Regret envelopes
  const [openedRegrets, setOpenedRegrets] = useState({});

  // Chapter 6: Choice chosen
  const [selectedResponse, setSelectedResponse] = useState(null);

  const recipient = note?.recipient_name || 'My Dear Friend';
  const customMsg = note?.custom_message || 'I am deeply sorry for how I acted and the hurt I caused. You mean far too much to me for me to let my mistakes go unaddressed. I take full responsibility and promise to do better.';
  const whatHappened = note?.custom_details?.what_happened || 'I let my impatience get the better of me and failed to listen to your feelings when you needed me most.';
  const specialMemory = note?.custom_details?.special_memory || 'The laughter and effortless comfort we have always shared. I never want to jeopardize that.';
  const photos = note?.image_urls || [];

  const regrets = [
    { id: 'r1', title: 'The Words I Regret', desc: 'Speaking before understanding the weight my words carry on your heart.', icon: 'candle' },
    { id: 'r2', title: 'The Moment I Realized', desc: 'Seeing the disappointment in your eyes and knowing I let down the person I respect most.', icon: 'heart' },
    { id: 'r3', title: 'What You Truly Mean To Me', desc: 'Our bond is a sanctuary I will never take for granted ever again.', icon: 'crane' },
  ];

  const handleOpenRegret = (id) => {
    const updated = { ...openedRegrets, [id]: true };
    setOpenedRegrets(updated);
    if (Object.keys(updated).length >= 2) {
      setUnlockedSecrets([true, true, unlockedSecrets[2]]);
    }
  };

  const handleResponseSelect = (option) => {
    setSelectedResponse(option);
    setUnlockedSecrets([true, true, true]);
    setTimeout(() => {
      setChapter(7);
    }, 1200);
  };

  return (
    <CinematicStageWrapper
      currentStep={chapter}
      totalSteps={7}
      chapterTitle={
        chapter === 1
          ? 'Quiet Reflection'
          : chapter === 2
          ? 'Taking Responsibility'
          : chapter === 3
          ? 'Unspoken Regrets'
          : chapter === 4
          ? 'Sacred Memory'
          : chapter === 5
          ? 'Origami Promise Crane'
          : chapter === 6
          ? 'Your Choice, Zero Pressure'
          : 'Sincere Letter'
      }
      particleMode="rain"
      theme="somber"
      unlockedSecrets={unlockedSecrets}
    >
      {/* ── CHAPTER 1: RAINY WINDOW REFLECTION ── */}
      {chapter === 1 && (
        <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card"
            style={{
              padding: '3.5rem 2rem',
              borderRadius: '28px',
              border: '2px solid rgba(148, 163, 184, 0.3)',
              boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
              maxWidth: '560px',
              margin: '0 auto',
              background: 'radial-gradient(circle, rgba(30,41,59,0.85) 0%, rgba(15,23,42,0.95) 100%)',
            }}
          >
            <div style={{ display: 'inline-flex', padding: '16px', background: 'rgba(148, 163, 184, 0.15)', borderRadius: '50%', marginBottom: '1.25rem' }}>
              <GoldBadge name="crane" size={54} />
            </div>

            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.2em', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
              A Vulnerable & Sincere Apology
            </span>

            <h1
              style={{
                fontFamily: 'var(--font-dancing)',
                fontSize: 'clamp(2.2rem, 5.5vw, 3.4rem)',
                color: '#fff',
                margin: '0 0 1.5rem',
              }}
            >
              For {recipient}
            </h1>

            <p style={{ color: '#cbd5e1', fontSize: '1rem', lineHeight: 1.7, marginBottom: '2.5rem' }}>
              I know I hurt you. There are no excuses, no deflections, and no shortcuts. I just want to speak to you with complete honesty from the bottom of my heart.
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setChapter(2)}
              style={{
                background: 'linear-gradient(135deg, #64748b, #475569)',
                color: '#fff',
                padding: '14px 36px',
                borderRadius: '50px',
                border: '1px solid rgba(255,255,255,0.2)',
                fontWeight: 700,
                fontSize: '1.05rem',
                cursor: 'pointer',
              }}
            >
              Listen With Me &rarr;
            </motion.button>
          </motion.div>
        </div>
      )}

      {/* ── CHAPTER 2: ACCOUNTABILITY CARD ── */}
      {chapter === 2 && (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              Chapter II: Accountability
            </span>
            <h2 style={{ fontFamily: 'var(--font-dancing)', fontSize: '2.5rem', color: '#fff', margin: '0.25rem 0' }}>
              What I Did & Why I Was Wrong
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
              Owning my mistake completely.
            </p>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(148, 163, 184, 0.3)',
              borderRadius: '24px',
              padding: '2.5rem 2rem',
              marginBottom: '2rem',
            }}
          >
            <div style={{ marginBottom: '1.5rem' }}>
              <span style={{ color: '#f87171', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
                Where I Failed You
              </span>
              <p style={{ color: '#e2e8f0', fontSize: '1rem', lineHeight: 1.7, margin: 0 }}>
                {whatHappened}
              </p>
            </div>

            <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.1)', margin: '1.5rem 0' }} />

            <div>
              <span style={{ color: '#38bdf8', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
                What I Have Realized
              </span>
              <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>
                Your feelings are valid. You deserved calmness, understanding, and care, not frustration or thoughtlessness.
              </p>
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setChapter(3)}
              style={{
                background: 'linear-gradient(135deg, #64748b, #475569)',
                color: '#fff',
                padding: '14px 34px',
                borderRadius: '50px',
                border: '1px solid rgba(255,255,255,0.2)',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Open Unspoken Regrets &rarr;
            </motion.button>
          </div>
        </div>
      )}

      {/* ── CHAPTER 3: 3 REGRET ENVELOPES ── */}
      {chapter === 3 && (
        <div>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              Chapter III: Deep Reflection
            </span>
            <h2 style={{ fontFamily: 'var(--font-dancing)', fontSize: '2.5rem', color: '#fff', margin: '0.25rem 0' }}>
              Three Unspoken Regrets
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
              Tap each note to read the reflections I carry.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
            {regrets.map((r) => {
              const isOpen = openedRegrets[r.id];
              return (
                <motion.div
                  key={r.id}
                  whileHover={{ y: -5 }}
                  onClick={() => handleOpenRegret(r.id)}
                  style={{
                    background: isOpen ? 'rgba(148, 163, 184, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                    border: isOpen ? '2px solid #94a3b8' : '1px dashed rgba(255, 255, 255, 0.2)',
                    borderRadius: '20px',
                    padding: '1.75rem 1.25rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <div style={{ display: 'inline-flex', padding: '12px', background: 'rgba(148, 163, 184, 0.1)', borderRadius: '50%', marginBottom: '1rem' }}>
                    <GoldBadge name={r.icon} size={32} />
                  </div>
                  <h3 style={{ color: '#fff', fontSize: '1.05rem', margin: '0 0 0.5rem' }}>{r.title}</h3>
                  {isOpen ? (
                    <p style={{ color: '#cbd5e1', fontSize: '0.88rem', lineHeight: 1.5, margin: 0 }}>
                      {r.desc}
                    </p>
                  ) : (
                    <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 700 }}>
                      Tap to Unfold
                    </span>
                  )}
                </motion.div>
              );
            })}
          </div>

          <div style={{ textAlign: 'center' }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setChapter(4)}
              style={{
                background: 'linear-gradient(135deg, #64748b, #475569)',
                color: '#fff',
                padding: '14px 34px',
                borderRadius: '50px',
                border: '1px solid rgba(255,255,255,0.2)',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              The Sacred Memory &rarr;
            </motion.button>
          </div>
        </div>
      )}

      {/* ── CHAPTER 4: THE SACRED MEMORY ── */}
      {chapter === 4 && (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              Chapter IV: What Matters Most
            </span>
            <h2 style={{ fontFamily: 'var(--font-dancing)', fontSize: '2.5rem', color: '#fff', margin: '0.25rem 0' }}>
              A Bond Worth Preserving
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
              Remembering who we are when things are good.
            </p>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(148, 163, 184, 0.3)',
              borderRadius: '24px',
              padding: '2.5rem 2rem',
              marginBottom: '2rem',
              textAlign: 'center',
            }}
          >
            <GoldBadge name="heart" size={48} />
            <p style={{ color: '#e2e8f0', fontSize: '1.05rem', lineHeight: 1.7, marginTop: '1rem' }}>
              {specialMemory}
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
              onClick={() => setChapter(5)}
              style={{
                background: 'linear-gradient(135deg, #64748b, #475569)',
                color: '#fff',
                padding: '14px 34px',
                borderRadius: '50px',
                border: '1px solid rgba(255,255,255,0.2)',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Fold Origami Promise Crane &rarr;
            </motion.button>
          </div>
        </div>
      )}

      {/* ── CHAPTER 5: ORIGAMI PROMISE CRANE ── */}
      {chapter === 5 && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              Chapter V: Concrete Commitments
            </span>
            <h2 style={{ fontFamily: 'var(--font-dancing)', fontSize: '2.5rem', color: '#fff', margin: '0.25rem 0' }}>
              The Origami Promise Crane
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
              Tap each wing to fold a permanent commitment to do better.
            </p>
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <OrigamiCrane onComplete={() => setUnlockedSecrets([true, true, true])} />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setChapter(6)}
            style={{
              background: 'linear-gradient(135deg, #64748b, #475569)',
              color: '#fff',
              padding: '14px 36px',
              borderRadius: '50px',
              border: '1px solid rgba(255,255,255,0.2)',
              fontWeight: 700,
              fontSize: '1.05rem',
              cursor: 'pointer',
            }}
          >
            Your Space & Pace &rarr;
          </motion.button>
        </div>
      )}

      {/* ── CHAPTER 6: ZERO-PRESSURE CHOICE ── */}
      {chapter === 6 && (
        <div style={{ maxWidth: '580px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ marginBottom: '2rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              Chapter VI: No Obligations
            </span>
            <h2 style={{ fontFamily: 'var(--font-dancing)', fontSize: '2.5rem', color: '#fff', margin: '0.25rem 0' }}>
              How Would You Like To Proceed?
            </h2>
            <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: 1.6 }}>
              There is zero expectation for an instant response. Choose whatever option feels right for your heart.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
            {[
              { id: 'time', text: 'I need some time and space to process this.', icon: 'candle' },
              { id: 'talk', text: 'Let us have a calm conversation when ready.', icon: 'sparkle' },
              { id: 'forgive', text: 'I appreciate your honesty. Let us move forward together.', icon: 'heart' },
            ].map((opt) => (
              <motion.button
                key={opt.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleResponseSelect(opt.text)}
                style={{
                  background: selectedResponse === opt.text ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                  border: selectedResponse === opt.text ? '2px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '16px',
                  padding: '1.25rem',
                  color: '#fff',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  textAlign: 'left',
                }}
              >
                <GoldBadge name={opt.icon} size={20} />
                <span>{opt.text}</span>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* ── CHAPTER 7: SINCERE LETTER & SANCTUARY ── */}
      {chapter === 7 && (
        <div>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ display: 'inline-flex', padding: '16px', background: 'rgba(148, 163, 184, 0.2)', borderRadius: '50%', marginBottom: '1rem' }}>
              <GoldBadge name="crane" size={54} />
            </div>
            <h1
              style={{
                fontFamily: 'var(--font-dancing)',
                fontSize: 'clamp(2.4rem, 6vw, 3.8rem)',
                color: '#fff',
                margin: '0 0 0.5rem',
              }}
            >
              With Sincerity & Respect
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '1.1rem', fontWeight: 600 }}>
              Whatever you decide, I value and respect you completely.
            </p>
          </div>

          {/* Letter */}
          <div style={{ marginBottom: '2.5rem' }}>
            <WaxSealLetter
              title={`A Letter of Sincere Apology to ${recipient}`}
              content={customMsg}
              author="With deep respect and regret"
              date={new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <WholesomeMemeSticker type="bearHug" size={80} caption="Always here for you." />
          </div>
        </div>
      )}
    </CinematicStageWrapper>
  );
}
