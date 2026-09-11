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
 * 7-Chapter Nostalgic Love Museum & Milestone Odyssey
 * Chapter 1: The Live Relationship Time Counter
 * Chapter 2: The Milestone Map Timeline
 * Chapter 3: The 5 Vow Tablets
 * Chapter 4: The Relationship Statistics Dashboard
 * Chapter 5: The Love Museum (Draggable Polaroids)
 * Chapter 6: The Interactive Champagne Toast
 * Chapter 7: The Wax-Sealed Letter & Eternal Keepsake
 */
export default function AnniversaryExperience({ note, isPreview = false, onReachEnd }) {
  const [chapter, setChapter] = useState(1);
  const [unlockedSecrets, setUnlockedSecrets] = useState([true, false, false]);

  useEffect(() => {
    onReachEnd?.(chapter === 7, () => {
      setChapter(1);
      setRevealedVows({});
    });
  }, [chapter, onReachEnd]);

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
      title: 'Today & Forever',
      description: `Celebrating ${yearsTogether} years of magic, memories, and our growing legacy of love.`,
      icon: 'toast',
    },
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
      particleMode="embers"
      theme="golden"
      unlockedSecrets={unlockedSecrets}
    >
      {/* ── CHAPTER 1: LIVE RELATIONSHIP TIME COUNTER ── */}
      {chapter === 1 && (
        <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card"
            style={{
              padding: '3.5rem 2rem',
              borderRadius: '28px',
              border: '2px solid rgba(245, 158, 11, 0.4)',
              boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
              maxWidth: '600px',
              margin: '0 auto',
            }}
          >
            <div style={{ display: 'inline-flex', padding: '16px', background: 'rgba(245, 158, 11, 0.15)', borderRadius: '50%', marginBottom: '1.25rem' }}>
              <GoldBadge name="toast" size={54} />
            </div>

            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fbbf24', letterSpacing: '0.2em', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
              {yearsTogether} Years Anniversary Odyssey
            </span>

            <h1
              style={{
                fontFamily: 'var(--font-dancing)',
                fontSize: 'clamp(2.3rem, 5.5vw, 3.5rem)',
                color: '#fff',
                margin: '0 0 1.5rem',
              }}
            >
              Every Second With You
            </h1>

            {/* Time Ticker Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '0.75rem',
                background: 'rgba(0,0,0,0.4)',
                padding: '1.5rem 1rem',
                borderRadius: '20px',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                marginBottom: '2rem',
              }}
            >
              {[
                { label: 'Days', val: timeElapsed.days },
                { label: 'Hours', val: timeElapsed.hours },
                { label: 'Minutes', val: timeElapsed.minutes },
                { label: 'Seconds', val: timeElapsed.seconds },
              ].map((item, idx) => (
                <div key={idx} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)', fontWeight: 800, color: '#fbbf24', fontFamily: 'monospace' }}>
                    {String(item.val).padStart(2, '0')}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '4px' }}>
                    {item.label}
                  </div>
                </div>
              ))}
            </div>

            <p style={{ color: '#cbd5e1', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>
              And every single tick of the clock has made my love for you deeper and stronger.
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setChapter(2)}
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: '#000',
                padding: '14px 36px',
                borderRadius: '50px',
                border: 'none',
                fontWeight: 800,
                fontSize: '1.05rem',
                cursor: 'pointer',
              }}
            >
              Walk Our Milestone Map &rarr;
            </motion.button>
          </motion.div>
        </div>
      )}

      {/* ── CHAPTER 2: MILESTONE MAP TIMELINE ── */}
      {chapter === 2 && (
        <div>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fbbf24', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              Chapter II: The Journey
            </span>
            <h2 style={{ fontFamily: 'var(--font-dancing)', fontSize: '2.5rem', color: '#fff', margin: '0.25rem 0' }}>
              Our Milestone Map
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
              From stranger to best friend to the love of my life.
            </p>
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <MemoryTimeMachine events={timelineMilestones} />
          </div>

          <div style={{ textAlign: 'center' }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setChapter(3)}
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
              Reveal The 5 Vow Tablets
            </motion.button>
          </div>
        </div>
      )}

      {/* ── CHAPTER 3: THE 5 VOW TABLETS ── */}
      {chapter === 3 && (
        <div>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fbbf24', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              Chapter III: Sacred Promises
            </span>
            <h2 style={{ fontFamily: 'var(--font-dancing)', fontSize: '2.5rem', color: '#fff', margin: '0.25rem 0' }}>
              The 5 Illuminated Vows
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
              Tap each illuminated tablet to unseal our mutual promises.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
            {vows.map((v) => {
              const isRevealed = revealedVows[v.id];
              return (
                <motion.div
                  key={v.id}
                  whileHover={{ y: -6, scale: 1.02 }}
                  onClick={() => handleRevealVow(v.id)}
                  style={{
                    background: isRevealed ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                    border: isRevealed ? '2px solid #f59e0b' : '1px dashed rgba(245, 158, 11, 0.3)',
                    borderRadius: '22px',
                    padding: '1.75rem 1.25rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    boxShadow: isRevealed ? '0 0 25px rgba(245, 158, 11, 0.2)' : 'none',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <div style={{ display: 'inline-flex', padding: '12px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '50%', marginBottom: '1rem' }}>
                    <GoldBadge name={v.icon} size={32} />
                  </div>
                  <h3 style={{ color: '#fff', fontSize: '1.05rem', margin: '0 0 0.5rem' }}>{v.title}</h3>
                  {isRevealed ? (
                    <p style={{ color: '#cbd5e1', fontSize: '0.88rem', lineHeight: 1.5, margin: 0 }}>
                      {v.desc}
                    </p>
                  ) : (
                    <span style={{ fontSize: '0.78rem', color: '#fbbf24', fontWeight: 700 }}>
                      Tap to Unseal
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
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: '#000',
                padding: '14px 34px',
                borderRadius: '50px',
                border: 'none',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Examine Relationship Stats
            </motion.button>
          </div>
        </div>
      )}

      {/* ── CHAPTER 4: RELATIONSHIP STATISTICS ── */}
      {chapter === 4 && (
        <div>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fbbf24', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              Chapter IV: Data of Us
            </span>
            <h2 style={{ fontFamily: 'var(--font-dancing)', fontSize: '2.5rem', color: '#fff', margin: '0.25rem 0' }}>
              Relationship Infographic
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
              The numbers don’t lie: We are legendary.
            </p>
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <RelationshipStatsCard />
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
            <WholesomeMemeSticker type="talk3am" size={80} caption="3 AM Discussions Champion" />
          </div>

          <div style={{ textAlign: 'center' }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setChapter(5)}
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
              Enter The Love Museum
            </motion.button>
          </div>
        </div>
      )}

      {/* ── CHAPTER 5: THE LOVE MUSEUM ── */}
      {chapter === 5 && (
        <div>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fbbf24', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              Chapter V: Curated Memories
            </span>
            <h2 style={{ fontFamily: 'var(--font-dancing)', fontSize: '2.5rem', color: '#fff', margin: '0.25rem 0' }}>
              The Love Museum Gallery
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
              Every photo holds a chapter of our story.
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
              <GoldBadge name="heart" size={48} />
              <h3 style={{ color: '#fff', marginTop: '1rem' }}>Our Golden Archive</h3>
              <p style={{ color: '#cbd5e1', fontSize: '0.95rem' }}>
                {specialMemory}
              </p>
            </div>
          )}

          <div style={{ textAlign: 'center' }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setChapter(6);
                setUnlockedSecrets([true, true, true]);
              }}
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
              Ready For The Champagne Toast &rarr;
            </motion.button>
          </div>
        </div>
      )}

      {/* ── CHAPTER 6: CLINKING CHAMPAGNE TOAST ── */}
      {chapter === 6 && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fbbf24', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              Chapter VI: Raise A Glass
            </span>
            <h2 style={{ fontFamily: 'var(--font-dancing)', fontSize: '2.5rem', color: '#fff', margin: '0.25rem 0' }}>
              The Interactive Toast
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
              Drag or tap the glasses to clink them together in celebration.
            </p>
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <ClinkingGlasses onClinkComplete={() => {}} />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setChapter(7)}
            style={{
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: '#000',
              padding: '14px 36px',
              borderRadius: '50px',
              border: 'none',
              fontWeight: 800,
              fontSize: '1.05rem',
              cursor: 'pointer',
            }}
          >
            Read Our Anniversary Letter &rarr;
          </motion.button>
        </div>
      )}

      {/* ── CHAPTER 7: WAX SEAL LETTER & KEEPSAKE ── */}
      {chapter === 7 && (
        <div>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ display: 'inline-flex', padding: '16px', background: 'rgba(245, 158, 11, 0.2)', borderRadius: '50%', marginBottom: '1rem' }}>
              <GoldBadge name="crown" size={54} />
            </div>
            <h1
              style={{
                fontFamily: 'var(--font-dancing)',
                fontSize: 'clamp(2.4rem, 6vw, 3.8rem)',
                color: '#fff',
                margin: '0 0 0.5rem',
              }}
            >
              Happy Anniversary, {recipient}
            </h1>
            <p style={{ color: '#fbbf24', fontSize: '1.1rem', fontWeight: 600 }}>
              Cheers to all that we have built and the decades still ahead.
            </p>
          </div>

          {/* Letter */}
          <div style={{ marginBottom: '2.5rem' }}>
            <WaxSealLetter
              title={`Anniversary Letter for ${recipient}`}
              content={customMsg}
              author="Your Forever Partner"
              date={new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <WholesomeMemeSticker type="bearHug" size={80} caption="Here's to forever!" />
          </div>
        </div>
      )}
    </CinematicStageWrapper>
  );
}
