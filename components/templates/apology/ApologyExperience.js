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
 * 7-Chapter Full-Bleed Sincere Healing Journey
 */
export default function ApologyExperience({ note, isPreview = false, onReachEnd }) {
  const [chapter, setChapter] = useState(1);
  const [unlockedSecrets, setUnlockedSecrets] = useState([true, false, false]);

  // Chapter 1: Window wiping
  const [isWindowCleared, setIsWindowCleared] = useState(false);

  // Chapter 3: Regret envelopes
  const [openedRegrets, setOpenedRegrets] = useState({});

  // Chapter 6: User choice
  const [forgiveChoice, setForgiveChoice] = useState(null);

  const recipient = note?.recipient_name || 'Someone I Hurt';
  const customMsg = note?.custom_message || 'I am deeply sorry for how my actions affected you. You mean more to me than words can say, and I want to take full responsibility, listen without defending myself, and make things right in your own time.';
  const whatHappened = note?.custom_details?.what_happened || 'I allowed frustration and poor communication to cloud my judgment, and in doing so, I made you feel unheard and hurt.';
  const specialMemory = note?.custom_details?.special_memory || 'The quiet evenings where we used to sit and talk with complete peace and trust.';
  const photos = note?.image_urls || [];

  useEffect(() => {
    onReachEnd?.(chapter === 7, () => {
      setChapter(1);
      setIsWindowCleared(false);
    });
  }, [chapter, onReachEnd]);

  const regrets = [
    { id: 'r1', title: 'Not Listening Deeply', desc: 'I was too caught up in my own reaction instead of understanding how you felt.' },
    { id: 'r2', title: 'Taking You For Granted', desc: 'You always bring so much grace and patience to us, and I failed to match it.' },
    { id: 'r3', title: 'Breaking Your Peace', desc: 'The last thing I ever want to be in your life is a source of stress or pain.' },
  ];

  const handleOpenRegret = (id) => {
    const updated = { ...openedRegrets, [id]: true };
    setOpenedRegrets(updated);
    if (Object.keys(updated).length >= 2) {
      setUnlockedSecrets([true, true, unlockedSecrets[2]]);
    }
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
        <div style={{ width: '100%', maxWidth: '820px', margin: '0 auto', textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              padding: 'clamp(2.5rem, 5vw, 4.5rem) clamp(1.5rem, 5vw, 3.5rem)',
              borderRadius: '32px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(45, 212, 191, 0.25)',
              backdropFilter: 'blur(30px)',
              boxShadow: '0 30px 80px rgba(0,0,0,0.6), 0 0 50px rgba(45, 212, 191, 0.12)',
            }}
          >
            <div style={{ display: 'inline-flex', padding: '18px', background: 'rgba(45, 212, 191, 0.12)', borderRadius: '50%', marginBottom: '1.5rem', border: '1px solid rgba(45, 212, 191, 0.3)' }}>
              <GoldBadge name="heart" size={60} />
            </div>

            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#5eead4', letterSpacing: '0.22em', textTransform: 'uppercase', display: 'block', marginBottom: '1rem' }}>
              ✦ Sincere Apology ✦
            </span>

            <h1
              style={{
                fontFamily: 'var(--font-dancing)',
                fontSize: 'clamp(2.4rem, 6vw, 4.2rem)',
                color: '#fff',
                margin: '0 0 1.25rem',
                textShadow: '0 0 30px rgba(45, 212, 191, 0.35)',
              }}
            >
              I Am Truly Sorry, {recipient}
            </h1>

            <p style={{ color: '#cbd5e1', fontSize: '1.15rem', lineHeight: 1.8, maxWidth: '580px', margin: '0 auto 2.5rem' }}>
              I know I hurt you, and I am not here to make excuses. I built this quiet sanctuary because what we share matters too much to leave unaddressed.
            </p>

            {/* Interactive Fogged Glass */}
            <div
              onClick={() => setIsWindowCleared(true)}
              style={{
                maxWidth: '480px',
                margin: '0 auto 2.5rem',
                padding: '1.5rem',
                borderRadius: '24px',
                background: isWindowCleared ? 'rgba(45, 212, 191, 0.15)' : 'rgba(15, 23, 42, 0.6)',
                border: isWindowCleared ? '1px solid #2dd4bf' : '1px dashed rgba(255,255,255,0.2)',
                cursor: 'pointer',
                transition: 'all 0.4s ease',
              }}
            >
              <p style={{ color: isWindowCleared ? '#5eead4' : '#94a3b8', fontSize: '0.95rem', margin: 0, fontWeight: 600 }}>
                {isWindowCleared ? '✓ Mist cleared. My heart is open.' : '🌧️ Tap to wipe the rainy condensation away…'}
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setChapter(2)}
              style={{
                background: 'linear-gradient(135deg, #2dd4bf, #0d9488)',
                color: '#000',
                padding: '16px 42px',
                borderRadius: '999px',
                border: 'none',
                fontWeight: 800,
                fontSize: '1.05rem',
                cursor: 'pointer',
                boxShadow: '0 8px 25px rgba(45, 212, 191, 0.35)',
              }}
            >
              Take Responsibility &rarr;
            </motion.button>
          </motion.div>
        </div>
      )}

      {/* ── CHAPTER 2: ACCOUNTABILITY CARD ── */}
      {chapter === 2 && (
        <div style={{ width: '100%', maxWidth: '820px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#5eead4', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
              Chapter II: Accountability
            </span>
            <h2 style={{ fontFamily: 'var(--font-dancing)', fontSize: 'clamp(2.2rem, 5vw, 3.4rem)', color: '#fff', margin: '0.35rem 0' }}>
              What I Did &amp; Why I Was Wrong
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1rem' }}>
              Owning my mistake completely without defense.
            </p>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(45, 212, 191, 0.25)',
              borderRadius: '28px',
              padding: '2.5rem 2rem',
              marginBottom: '2.5rem',
              backdropFilter: 'blur(20px)',
            }}
          >
            <div style={{ marginBottom: '1.5rem' }}>
              <span style={{ color: '#f87171', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.5rem' }}>
                Where I Failed You
              </span>
              <p style={{ color: '#e2e8f0', fontSize: '1.1rem', lineHeight: 1.8, margin: 0 }}>
                {whatHappened}
              </p>
            </div>

            <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.1)', margin: '1.5rem 0' }} />

            <div>
              <span style={{ color: '#5eead4', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.5rem' }}>
                What I Have Realized
              </span>
              <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: 1.8, margin: 0 }}>
                Your feelings are valid. You deserved calmness, understanding, and care, not frustration or thoughtlessness.
              </p>
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setChapter(3)}
              style={{
                background: 'linear-gradient(135deg, #2dd4bf, #0d9488)',
                color: '#000',
                padding: '16px 40px',
                borderRadius: '999px',
                border: 'none',
                fontWeight: 800,
                fontSize: '1rem',
                cursor: 'pointer',
                boxShadow: '0 8px 25px rgba(45, 212, 191, 0.35)',
              }}
            >
              Open Unspoken Regrets &rarr;
            </motion.button>
          </div>
        </div>
      )}

      {/* ── CHAPTER 3: 3 REGRET ENVELOPES ── */}
      {chapter === 3 && (
        <div style={{ width: '100%', maxWidth: '960px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#5eead4', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
              Chapter III: Deep Reflection
            </span>
            <h2 style={{ fontFamily: 'var(--font-dancing)', fontSize: 'clamp(2.2rem, 5vw, 3.4rem)', color: '#fff', margin: '0.35rem 0' }}>
              Three Unspoken Regrets
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1rem' }}>
              Tap each tablet to read the reflections I carry.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
            {regrets.map((r) => {
              const isOpen = openedRegrets[r.id];
              return (
                <motion.div
                  key={r.id}
                  whileHover={{ y: -6, scale: 1.02 }}
                  onClick={() => handleOpenRegret(r.id)}
                  style={{
                    background: isOpen ? 'rgba(45, 212, 191, 0.14)' : 'rgba(255, 255, 255, 0.03)',
                    border: isOpen ? '1px solid rgba(45, 212, 191, 0.5)' : '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '24px',
                    padding: '2rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    backdropFilter: 'blur(20px)',
                    minHeight: '200px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'inline-flex', padding: '14px', background: 'rgba(45, 212, 191, 0.12)', borderRadius: '50%', marginBottom: '1rem' }}>
                      <GoldBadge name="heart" size={30} />
                    </div>
                    <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '0.5rem', fontWeight: 700 }}>
                      {r.title}
                    </h3>
                    <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: 1.6 }}>
                      {isOpen ? r.desc : 'Tap to reveal thought.'}
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
              onClick={() => setChapter(4)}
              style={{
                background: 'linear-gradient(135deg, #2dd4bf, #0d9488)',
                color: '#000',
                padding: '16px 40px',
                borderRadius: '999px',
                border: 'none',
                fontWeight: 800,
                fontSize: '1rem',
                cursor: 'pointer',
                boxShadow: '0 8px 25px rgba(45, 212, 191, 0.35)',
              }}
            >
              Inspect Sacred Memory &rarr;
            </motion.button>
          </div>
        </div>
      )}

      {/* ── CHAPTER 4: SACRED MEMORY ── */}
      {chapter === 4 && (
        <div style={{ width: '100%', maxWidth: '880px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ marginBottom: '2.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#5eead4', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
              Chapter IV: What Matters Most
            </span>
            <h2 style={{ fontFamily: 'var(--font-dancing)', fontSize: 'clamp(2.2rem, 5vw, 3.4rem)', color: '#fff', margin: '0.35rem 0' }}>
              The Bond We Built
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1rem' }}>
              A reminder of why you are irreplaceable to me.
            </p>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(45, 212, 191, 0.25)',
              borderRadius: '28px',
              padding: '2.5rem 2rem',
              marginBottom: '3rem',
              backdropFilter: 'blur(20px)',
            }}
          >
            <p style={{ color: '#e2e8f0', fontSize: '1.15rem', lineHeight: 1.8, maxWidth: '620px', margin: '0 auto' }}>
              {specialMemory}
            </p>
          </div>

          {photos.length > 0 && (
            <div style={{ marginBottom: '3rem' }}>
              <PolaroidStack photos={photos} />
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setChapter(5)}
            style={{
              background: 'linear-gradient(135deg, #2dd4bf, #0d9488)',
              color: '#000',
              padding: '16px 42px',
              borderRadius: '999px',
              border: 'none',
              fontWeight: 800,
              fontSize: '1.05rem',
              cursor: 'pointer',
              boxShadow: '0 8px 25px rgba(45, 212, 191, 0.35)',
            }}
          >
            Fold The Promise Crane &rarr;
          </motion.button>
        </div>
      )}

      {/* ── CHAPTER 5: 3D ORIGAMI PROMISE CRANE ── */}
      {chapter === 5 && (
        <div style={{ width: '100%', maxWidth: '820px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ marginBottom: '2.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#5eead4', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
              Chapter V: Golden Peace
            </span>
            <h2 style={{ fontFamily: 'var(--font-dancing)', fontSize: 'clamp(2.4rem, 6vw, 3.8rem)', color: '#fff', margin: '0.35rem 0' }}>
              The Origami Promise Crane
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1rem' }}>
              An ancient symbol of healing, patience, and lifelong respect.
            </p>
          </div>

          <div style={{ marginBottom: '3rem' }}>
            <OrigamiCrane onFoldComplete={() => {}} />
          </div>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setChapter(6)}
            style={{
              background: 'linear-gradient(135deg, #2dd4bf, #0d9488)',
              color: '#000',
              padding: '16px 42px',
              borderRadius: '999px',
              border: 'none',
              fontWeight: 800,
              fontSize: '1.05rem',
              cursor: 'pointer',
              boxShadow: '0 8px 25px rgba(45, 212, 191, 0.35)',
            }}
          >
            Your Space, Your Pace &rarr;
          </motion.button>
        </div>
      )}

      {/* ── CHAPTER 6: ZERO-PRESSURE CHOICE ── */}
      {chapter === 6 && (
        <div style={{ width: '100%', maxWidth: '820px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ marginBottom: '2.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#5eead4', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
              Chapter VI: Absolute Freedom
            </span>
            <h2 style={{ fontFamily: 'var(--font-dancing)', fontSize: 'clamp(2.4rem, 6vw, 3.8rem)', color: '#fff', margin: '0.35rem 0' }}>
              Zero Pressure, Only Respect
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1rem' }}>
              Whatever you feel right now, I honor and respect your boundaries unconditionally.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
            {[
              { id: 'c1', label: 'I accept your apology & let\'s talk', icon: 'heart', sub: 'I\'m ready to reconnect.' },
              { id: 'c2', label: 'I need a little more time & space', icon: 'compass', sub: 'Thank you for acknowledging it.' },
              { id: 'c3', label: 'I appreciate you making this effort', icon: 'sparkle', sub: 'Let\'s take it one step at a time.' },
            ].map((opt) => (
              <motion.button
                key={opt.id}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setForgiveChoice(opt.id)}
                style={{
                  background: forgiveChoice === opt.id ? 'rgba(45, 212, 191, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                  border: forgiveChoice === opt.id ? '1.5px solid #2dd4bf' : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '24px',
                  padding: '2rem',
                  cursor: 'pointer',
                  textAlign: 'center',
                  backdropFilter: 'blur(20px)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <div style={{ display: 'inline-flex', padding: '12px', background: 'rgba(45, 212, 191, 0.12)', borderRadius: '50%', marginBottom: '1rem' }}>
                  <GoldBadge name={opt.icon} size={28} />
                </div>
                <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '0.5rem', fontWeight: 700 }}>
                  {opt.label}
                </h4>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0 }}>
                  {opt.sub}
                </p>
              </motion.button>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setChapter(7)}
            style={{
              background: 'linear-gradient(135deg, #2dd4bf, #0d9488)',
              color: '#000',
              padding: '16px 42px',
              borderRadius: '999px',
              border: 'none',
              fontWeight: 800,
              fontSize: '1.05rem',
              cursor: 'pointer',
              boxShadow: '0 8px 25px rgba(45, 212, 191, 0.35)',
            }}
          >
            Read Final Sincere Letter &rarr;
          </motion.button>
        </div>
      )}

      {/* ── CHAPTER 7: SINCERE LETTER & SANCTUARY ── */}
      {chapter === 7 && (
        <div style={{ width: '100%', maxWidth: '960px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ display: 'inline-flex', padding: '18px', background: 'rgba(45, 212, 191, 0.15)', borderRadius: '50%', marginBottom: '1.25rem' }}>
              <GoldBadge name="heart" size={56} />
            </div>
            <h1
              style={{
                fontFamily: 'var(--font-dancing)',
                fontSize: 'clamp(2.4rem, 6vw, 4rem)',
                color: '#fff',
                margin: '0 0 0.5rem',
              }}
            >
              With Sincere Regret, {recipient}
            </h1>
            <p style={{ color: '#5eead4', fontSize: '1.15rem', fontWeight: 600 }}>
              Whatever you decide, I value and respect you completely.
            </p>
          </div>

          {/* Letter */}
          <div style={{ marginBottom: '3rem' }}>
            <WaxSealLetter
              title={`A Letter of Sincere Apology to ${recipient}`}
              content={customMsg}
              author="With deep respect and regret"
              date={new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <WholesomeMemeSticker caption="Always here for you in sincerity" />
          </div>
        </div>
      )}
    </CinematicStageWrapper>
  );
}
