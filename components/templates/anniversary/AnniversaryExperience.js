'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CinematicStageWrapper from '../common/CinematicStageWrapper';
import GoldBadge from '../common/GoldBadge';
import WholesomeMemeSticker from '../common/WholesomeMemeSticker';
import MemoryTimeMachine from '../common/MemoryTimeMachine';
import RelationshipStatsCard from '../common/RelationshipStatsCard';
import ClinkingGlasses from '../common/ClinkingGlasses';
import PolaroidStack from '../common/PolaroidStack';
import WaxSealLetter from '../common/WaxSealLetter';

/**
 * 🥂 ANNIVERSARY SPECIAL (ID: anniversary)
 * 7-Chapter Full-Bleed Haute-Couture Love Museum
 */
export default function AnniversaryExperience({ note, isPreview = false, onReachEnd }) {
  const [chapter, setChapter] = useState(1);
  const [unlockedSecrets, setUnlockedSecrets] = useState([true, false, false]);

  // Live seconds elapsed
  const [timeElapsed, setTimeElapsed] = useState({ days: 730, hours: 14, minutes: 22, seconds: 45 });

  // Vow Tablets revealed
  const [revealedVows, setRevealedVows] = useState({});

  const recipient = note?.recipient_name || 'My Dearest Partner';
  const customMsg = note?.custom_message || 'Happy Anniversary! Every single day by your side has been an adventure I never want to end. Thank you for filling our world with unconditional kindness, warmth, and laughter.';
  const yearsTogether = note?.custom_details?.years_together || '2';
  const specialMemory = note?.custom_details?.special_memory || 'The unforgettable evening we sat under the stars and talked about our future until sunrise.';
  const photos = note?.image_urls || [];

  useEffect(() => {
    onReachEnd?.(chapter === 7, () => {
      setChapter(1);
      setRevealedVows({});
    });
  }, [chapter, onReachEnd]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed((prev) => {
        let sec = prev.seconds + 1;
        let min = prev.minutes;
        let hr = prev.hours;
        let dy = prev.days;
        if (sec >= 60) {
          sec = 0;
          min += 1;
        }
        if (min >= 60) {
          min = 0;
          hr += 1;
        }
        if (hr >= 24) {
          hr = 0;
          dy += 1;
        }
        return { days: dy, hours: hr, minutes: min, seconds: sec };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const vows = [
    { id: 'v1', title: 'The Vow of Laughter', desc: 'To never let a difficult week pass without finding a reason to smile together.', icon: 'sparkle' },
    { id: 'v2', title: 'The Vow of Patience', desc: 'To listen with an open heart even when we disagree.', icon: 'heart' },
    { id: 'v3', title: 'The Vow of Safe Harbor', desc: 'To be the one place in this universe where you can always be your unfiltered self.', icon: 'compass' },
    { id: 'v4', title: 'The Vow of Shared Adventure', desc: 'To keep exploring new cities, cozy cafes, and midnight recipes side by side.', icon: 'toast' },
    { id: 'v5', title: 'The Vow of Forever', desc: 'To choose you today, tomorrow, and every day that follows.', icon: 'ring' },
  ];

  const handleRevealVow = (id) => {
    const updated = { ...revealedVows, [id]: true };
    setRevealedVows(updated);
    if (Object.keys(updated).length >= 3) {
      setUnlockedSecrets([true, true, unlockedSecrets[2]]);
    }
  };

  const timelineMilestones = [
    {
      date: 'Chapter I',
      title: 'When Our Paths Crossed',
      description: 'The moment two worlds aligned and a simple hello turned into hours of endless conversation.',
      icon: 'sparkle',
    },
    {
      date: 'Chapter II',
      title: 'Our First Adventure',
      description: 'Navigating new roads, sharing playlists, and learning how effortlessly our rhythms match.',
      icon: 'compass',
    },
    {
      date: 'Chapter III',
      title: 'Weathering Every Storm',
      description: 'Discovering that whatever storms the world throws at us, holding hands makes us bulletproof.',
      icon: 'heart',
    },
    {
      date: 'Chapter IV',
      title: 'Building Our Safe Haven',
      description: 'Creating a private little universe filled with our own jokes, comfort foods, and quiet peace.',
      icon: 'toast',
    },
    {
      date: 'Chapter V',
      title: 'Decades Still Ahead',
      description: specialMemory || 'Looking into each other\'s eyes and knowing that the best is still yet to come.',
      icon: 'crown',
    }
  ];

  return (
    <CinematicStageWrapper
      currentStep={chapter}
      totalSteps={7}
      chapterTitle={
        chapter === 1
          ? 'Relationship Time Counter'
          : chapter === 2
          ? 'Milestone Timeline'
          : chapter === 3
          ? 'The 5 Eternal Vows'
          : chapter === 4
          ? 'Relationship Statistics'
          : chapter === 5
          ? 'Love Museum'
          : chapter === 6
          ? 'Champagne Toast'
          : 'Eternal Keepsake'
      }
      particleMode="bubbles"
      theme="golden"
      unlockedSecrets={unlockedSecrets}
    >
      {/* ── CHAPTER 1: LIVE TIME COUNTER ── */}
      {chapter === 1 && (
        <div style={{ width: '100%', maxWidth: '820px', margin: '0 auto', textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              padding: 'clamp(2.5rem, 5vw, 4.5rem) clamp(1.5rem, 5vw, 3.5rem)',
              borderRadius: '32px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              backdropFilter: 'blur(30px)',
              boxShadow: '0 30px 80px rgba(0,0,0,0.6), 0 0 50px rgba(212, 175, 55, 0.15)',
            }}
          >
            <div style={{ display: 'inline-flex', padding: '18px', background: 'rgba(212, 175, 55, 0.12)', borderRadius: '50%', marginBottom: '1.5rem', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
              <GoldBadge name="crown" size={60} />
            </div>

            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#fde047', letterSpacing: '0.22em', textTransform: 'uppercase', display: 'block', marginBottom: '1rem' }}>
              ✦ Live Relationship Chronometer ✦
            </span>

            <h1
              style={{
                fontFamily: 'var(--font-dancing)',
                fontSize: 'clamp(2.4rem, 6vw, 4.2rem)',
                color: '#fff',
                margin: '0 0 1rem',
                textShadow: '0 0 30px rgba(212, 175, 55, 0.4)',
              }}
            >
              Happy {yearsTogether} Year Anniversary, {recipient}
            </h1>

            <p style={{ color: '#cbd5e1', fontSize: '1.1rem', maxWidth: '560px', margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
              Every single second by your side has been an adventure. Here is the exact measure of our journey together:
            </p>

            {/* Time Counter Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', maxWidth: '580px', margin: '0 auto 2.5rem' }}>
              {[
                { val: timeElapsed.days, label: 'DAYS' },
                { val: timeElapsed.hours, label: 'HOURS' },
                { val: timeElapsed.minutes, label: 'MINS' },
                { val: timeElapsed.seconds, label: 'SECS' }
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(212, 175, 55, 0.08)',
                    border: '1px solid rgba(212, 175, 55, 0.25)',
                    borderRadius: '20px',
                    padding: '1.25rem 0.5rem',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 800, color: '#fbbf24', fontFamily: 'monospace' }}>
                    {item.val}
                  </div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#fef08a', letterSpacing: '0.14em', marginTop: '4px' }}>
                    {item.label}
                  </div>
                </div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setChapter(2)}
              style={{
                background: 'linear-gradient(135deg, #d4af37, #b45309)',
                color: '#000',
                padding: '16px 42px',
                borderRadius: '999px',
                border: 'none',
                fontWeight: 800,
                fontSize: '1.05rem',
                cursor: 'pointer',
                boxShadow: '0 8px 25px rgba(212, 175, 55, 0.35)',
              }}
            >
              Walk Our Milestone Map &rarr;
            </motion.button>
          </motion.div>
        </div>
      )}

      {/* ── CHAPTER 2: MILESTONE TIMELINE ── */}
      {chapter === 2 && (
        <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fde047', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
              Chapter II: The Odyssey
            </span>
            <h2 style={{ fontFamily: 'var(--font-dancing)', fontSize: 'clamp(2.2rem, 5vw, 3.4rem)', color: '#fff', margin: '0.35rem 0' }}>
              Our Milestone Map
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1rem' }}>
              From strangers to best friends to partners for life.
            </p>
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <MemoryTimeMachine events={timelineMilestones} />
          </div>

          <div style={{ textAlign: 'center' }}>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setChapter(3)}
              style={{
                background: 'linear-gradient(135deg, #d4af37, #b45309)',
                color: '#000',
                padding: '16px 40px',
                borderRadius: '999px',
                border: 'none',
                fontWeight: 800,
                fontSize: '1rem',
                cursor: 'pointer',
                boxShadow: '0 8px 25px rgba(212, 175, 55, 0.35)',
              }}
            >
              Reveal The 5 Vow Tablets &rarr;
            </motion.button>
          </div>
        </div>
      )}

      {/* ── CHAPTER 3: 5 VOW TABLETS ── */}
      {chapter === 3 && (
        <div style={{ width: '100%', maxWidth: '960px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fde047', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
              Chapter III: Sacred Promises
            </span>
            <h2 style={{ fontFamily: 'var(--font-dancing)', fontSize: 'clamp(2.2rem, 5vw, 3.4rem)', color: '#fff', margin: '0.35rem 0' }}>
              The 5 Illuminated Vows
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1rem' }}>
              Tap each illuminated tablet to unseal our mutual promises.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
            {vows.map((v) => {
              const isRevealed = revealedVows[v.id];
              return (
                <motion.div
                  key={v.id}
                  whileHover={{ y: -6, scale: 1.02 }}
                  onClick={() => handleRevealVow(v.id)}
                  style={{
                    background: isRevealed ? 'rgba(212, 175, 55, 0.14)' : 'rgba(255, 255, 255, 0.03)',
                    border: isRevealed ? '1px solid rgba(212, 175, 55, 0.5)' : '1px solid rgba(255, 255, 255, 0.08)',
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
                    <div style={{ display: 'inline-flex', padding: '14px', background: 'rgba(212, 175, 55, 0.12)', borderRadius: '50%', marginBottom: '1rem' }}>
                      <GoldBadge name={v.icon} size={32} />
                    </div>
                    <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '0.5rem', fontWeight: 700 }}>
                      {v.title}
                    </h3>
                    <p style={{ color: '#cbd5e1', fontSize: '0.92rem', lineHeight: 1.6 }}>
                      {isRevealed ? v.desc : 'Tap to reveal vow.'}
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
                background: 'linear-gradient(135deg, #d4af37, #b45309)',
                color: '#000',
                padding: '16px 40px',
                borderRadius: '999px',
                border: 'none',
                fontWeight: 800,
                fontSize: '1rem',
                cursor: 'pointer',
                boxShadow: '0 8px 25px rgba(212, 175, 55, 0.35)',
              }}
            >
              Inspect Relationship Statistics &rarr;
            </motion.button>
          </div>
        </div>
      )}

      {/* ── CHAPTER 4: RELATIONSHIP STATISTICS ── */}
      {chapter === 4 && (
        <div style={{ width: '100%', maxWidth: '880px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fde047', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
              Chapter IV: Quantitative Love
            </span>
            <h2 style={{ fontFamily: 'var(--font-dancing)', fontSize: 'clamp(2.2rem, 5vw, 3.4rem)', color: '#fff', margin: '0.35rem 0' }}>
              Our Love Statistics
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1rem' }}>
              The empirical data proving we are unstoppable together.
            </p>
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <RelationshipStatsCard years={yearsTogether} />
          </div>

          <div style={{ textAlign: 'center' }}>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setChapter(5)}
              style={{
                background: 'linear-gradient(135deg, #d4af37, #b45309)',
                color: '#000',
                padding: '16px 40px',
                borderRadius: '999px',
                border: 'none',
                fontWeight: 800,
                fontSize: '1rem',
                cursor: 'pointer',
                boxShadow: '0 8px 25px rgba(212, 175, 55, 0.35)',
              }}
            >
              Enter The Love Museum &rarr;
            </motion.button>
          </div>
        </div>
      )}

      {/* ── CHAPTER 5: THE LOVE MUSEUM ── */}
      {chapter === 5 && (
        <div style={{ width: '100%', maxWidth: '880px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ marginBottom: '2.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fde047', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
              Chapter V: The Gallery
            </span>
            <h2 style={{ fontFamily: 'var(--font-dancing)', fontSize: 'clamp(2.2rem, 5vw, 3.4rem)', color: '#fff', margin: '0.35rem 0' }}>
              The Love Museum
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1rem' }}>
              Every photo in this gallery is a milestone in our forever story.
            </p>
          </div>

          <div style={{ marginBottom: '3rem' }}>
            <PolaroidStack photos={photos.length > 0 ? photos : ['/images/sample1.jpg', '/images/sample2.jpg']} />
          </div>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setChapter(6)}
            style={{
              background: 'linear-gradient(135deg, #d4af37, #b45309)',
              color: '#000',
              padding: '16px 42px',
              borderRadius: '999px',
              border: 'none',
              fontWeight: 800,
              fontSize: '1.05rem',
              cursor: 'pointer',
              boxShadow: '0 8px 25px rgba(212, 175, 55, 0.35)',
            }}
          >
            Toast To Our Future &rarr;
          </motion.button>
        </div>
      )}

      {/* ── CHAPTER 6: CHAMPAGNE TOAST ── */}
      {chapter === 6 && (
        <div style={{ width: '100%', maxWidth: '820px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ marginBottom: '2.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fde047', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
              Chapter VI: Celebration
            </span>
            <h2 style={{ fontFamily: 'var(--font-dancing)', fontSize: 'clamp(2.4rem, 6vw, 3.8rem)', color: '#fff', margin: '0.35rem 0' }}>
              The Champagne Toast
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1rem' }}>
              Tap or drag the glasses to clink them together in celebration.
            </p>
          </div>

          <div style={{ marginBottom: '3rem' }}>
            <ClinkingGlasses onClinkComplete={() => {}} />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setChapter(7)}
            style={{
              background: 'linear-gradient(135deg, #d4af37, #b45309)',
              color: '#000',
              padding: '18px 44px',
              borderRadius: '999px',
              border: 'none',
              fontWeight: 800,
              fontSize: '1.1rem',
              cursor: 'pointer',
              boxShadow: '0 10px 30px rgba(212, 175, 55, 0.4)',
            }}
          >
            Read Our Anniversary Letter &rarr;
          </motion.button>
        </div>
      )}

      {/* ── CHAPTER 7: WAX SEAL LETTER & KEEPSAKE ── */}
      {chapter === 7 && (
        <div style={{ width: '100%', maxWidth: '960px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ display: 'inline-flex', padding: '18px', background: 'rgba(212, 175, 55, 0.15)', borderRadius: '50%', marginBottom: '1.25rem' }}>
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
              Happy Anniversary, {recipient}
            </h1>
            <p style={{ color: '#fbbf24', fontSize: '1.15rem', fontWeight: 600 }}>
              Cheers to all that we have built and the decades still ahead.
            </p>
          </div>

          {/* Letter */}
          <div style={{ marginBottom: '3rem' }}>
            <WaxSealLetter
              title={`Anniversary Letter for ${recipient}`}
              content={customMsg}
              author="Your Forever Partner"
              date={new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <WholesomeMemeSticker caption="Here's to forever together" />
          </div>
        </div>
      )}
    </CinematicStageWrapper>
  );
}
