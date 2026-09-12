'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CinematicStageWrapper from '../common/CinematicStageWrapper';
import GoldBadge from '../common/GoldBadge';
import WholesomeMemeSticker from '../common/WholesomeMemeSticker';
import PolaroidStack from '../common/PolaroidStack';
import WaxSealLetter from '../common/WaxSealLetter';
import MemoryTimeMachine from '../common/MemoryTimeMachine';

/**
 * 💍 THE PERFECT PROPOSAL (ID: proposal)
 * 7-Chapter Full-Bleed Luxury Romantic Odyssey
 */
export default function ProposalExperience({ note, isPreview = false, onReachEnd }) {
  const [chapter, setChapter] = useState(1);
  const [unlockedSecrets, setUnlockedSecrets] = useState([true, false, false]);
  
  // Chapter 2: Sacred archives inspected
  const [inspectedCards, setInspectedCards] = useState([false, false, false]);

  // Chapter 3: Quiz state
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizScore, setQuizScore] = useState(null);

  // Chapter 5: Almost proposal state
  const [heartbeatActive, setHeartbeatActive] = useState(false);

  // Chapter 6: Ring Box & Dodge State
  const [boxOpened, setBoxOpened] = useState(false);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [dodgeCount, setDodgeCount] = useState(0);

  const recipient = note?.recipient_name || 'My Love';
  const customMsg = note?.custom_message || 'From our late night conversations to every little adventure we share, every single moment with you feels like home. Will you marry me and be my forever partner?';
  const dateIdea = note?.custom_details?.date_idea || 'A private candle-lit dinner under the starlit sky';
  const specialMemory = note?.custom_details?.special_memory || 'The exact moment your eyes met mine and time stood still.';
  const photos = note?.image_urls || [];

  const funnyDialogue = [
    'Wait, reconsider! ✨',
    'Are you completely sure?',
    'Destiny says YES 💍',
    'Error: Only YES is permitted! ❤️',
    'Your fingers slipped! 🥂',
    '1000x YES in every universe! ✨'
  ];

  const dodgeNoButton = () => {
    const randomX = Math.floor(Math.random() * 260 - 130);
    const randomY = Math.floor(Math.random() * 160 - 80);
    setNoPosition({ x: randomX, y: randomY });
    setDodgeCount((prev) => prev + 1);
  };

  const handleCardInspect = (idx) => {
    const updated = [...inspectedCards];
    updated[idx] = true;
    setInspectedCards(updated);
    if (updated.filter(Boolean).length >= 2) {
      setUnlockedSecrets([true, true, unlockedSecrets[2]]);
    }
  };

  const quizQuestions = [
    {
      id: 'q1',
      question: 'Who fell in love first?',
      options: ['You, unconditionally', 'Me, without a doubt', 'It was written in the stars at first sight'],
      correct: 2,
    },
    {
      id: 'q2',
      question: 'What defines our happiest moments?',
      options: ['The quiet comfort of just being together', 'Spontaneous midnight conversations', 'All the laughter that fills our days'],
      correct: 0,
    },
    {
      id: 'q3',
      question: 'Where is our favorite place to be?',
      options: ['Anywhere as long as we are side by side', 'Exploring new roads together', 'Cozy at home sharing quiet moments'],
      correct: 0,
    }
  ];

  const handleQuizAnswer = (qIdx, optIdx) => {
    const newAnswers = { ...quizAnswers, [qIdx]: optIdx };
    setQuizAnswers(newAnswers);
    if (Object.keys(newAnswers).length === quizQuestions.length) {
      setQuizScore(100);
      setUnlockedSecrets([true, true, true]);
    }
  };

  useEffect(() => {
    onReachEnd?.(chapter === 7, () => {
      setChapter(1);
      setBoxOpened(false);
      setDodgeCount(0);
      setNoPosition({ x: 0, y: 0 });
    });
  }, [chapter, onReachEnd]);

  return (
    <CinematicStageWrapper
      currentStep={chapter}
      totalSteps={7}
      chapterTitle={
        chapter === 1
          ? 'Royal Invitation'
          : chapter === 2
          ? 'Sacred Archives'
          : chapter === 3
          ? 'Soul Alignment'
          : chapter === 4
          ? 'Memory Time Machine'
          : chapter === 5
          ? 'A Quiet Moment'
          : chapter === 6
          ? 'The Question'
          : 'Forever Sealed'
      }
      particleMode="petals"
      theme="romantic"
      unlockedSecrets={unlockedSecrets}
    >
      {/* ── CHAPTER 1: THE MYSTERIOUS ROYAL INVITATION ── */}
      {chapter === 1 && (
        <div style={{ width: '100%', maxWidth: '820px', margin: '0 auto', textAlign: 'center' }}>
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 25 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{
              padding: 'clamp(2.5rem, 6vw, 4.5rem) clamp(1.5rem, 5vw, 3.5rem)',
              borderRadius: '32px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(244, 63, 94, 0.25)',
              backdropFilter: 'blur(30px)',
              boxShadow: '0 30px 80px rgba(0,0,0,0.6), 0 0 50px rgba(244, 63, 94, 0.15)',
            }}
          >
            <div style={{ display: 'inline-flex', padding: '18px', background: 'rgba(244, 63, 94, 0.12)', borderRadius: '50%', marginBottom: '1.5rem', border: '1px solid rgba(244, 63, 94, 0.3)' }}>
              <GoldBadge name="crown" size={60} />
            </div>

            <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#fb7185', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: '1rem' }}>
              Confidential &amp; For Your Eyes Only
            </span>

            <h1
              style={{
                fontFamily: 'var(--font-dancing), "Playfair Display", serif',
                fontSize: 'clamp(2.4rem, 6vw, 4rem)',
                color: '#fff1f2',
                margin: '0 0 1.25rem',
                lineHeight: 1.15,
                textShadow: '0 4px 25px rgba(244, 63, 94, 0.4)',
              }}
            >
              An Exclusive Invitation for {recipient}
            </h1>

            <p style={{ color: '#cbd5e1', fontSize: 'clamp(1rem, 2.5vw, 1.15rem)', lineHeight: 1.8, maxWidth: '560px', margin: '0 auto 2.5rem' }}>
              You have been summoned to a private cinematic journey. Behind these doors lie our greatest moments, unwritten memories, and one life-changing secret.
            </p>

            <motion.button
              whileHover={{ scale: 1.04, boxShadow: '0 0 40px rgba(244, 63, 94, 0.6)' }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setChapter(2)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                padding: '18px 44px',
                fontSize: '1.1rem',
                fontWeight: 700,
                borderRadius: '999px',
                background: 'linear-gradient(135deg, #f43f5e, #be123c)',
                color: '#ffffff',
                border: '1px solid rgba(255,255,255,0.3)',
                cursor: 'pointer',
                boxShadow: '0 10px 30px rgba(190, 18, 60, 0.4)',
              }}
            >
              <GoldBadge name="sparkle" size={22} />
              Open Royal Portal &rarr;
            </motion.button>
          </motion.div>
        </div>
      )}

      {/* ── CHAPTER 2: SACRED ARCHIVES ── */}
      {chapter === 2 && (
        <div style={{ width: '100%', maxWidth: '960px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fb7185', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
              Chapter II: Undeniable Proof
            </span>
            <h2 style={{ fontFamily: 'var(--font-dancing)', fontSize: 'clamp(2.2rem, 5vw, 3.2rem)', color: '#fff', margin: '0.35rem 0' }}>
              The Sacred Archives
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1rem', maxWidth: '520px', margin: '0 auto' }}>
              Tap each sealed file to reveal the truths that brought us to this moment.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
            {[
              { title: 'The Light You Bring', desc: 'The undeniable warmth and comfort that makes every day feel like home.', icon: 'sparkle' },
              { title: 'The Quiet Harmony', desc: 'How effortlessly our worlds align, from endless midnight conversations to shared dreams.', icon: 'heart' },
              { title: 'The Certainty', desc: specialMemory || 'That every beautiful tomorrow is only complete with you by my side.', icon: 'ring' },
            ].map((card, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -6, scale: 1.02 }}
                onClick={() => handleCardInspect(idx)}
                style={{
                  background: inspectedCards[idx] ? 'rgba(244, 63, 94, 0.14)' : 'rgba(255, 255, 255, 0.03)',
                  border: inspectedCards[idx] ? '1px solid rgba(244, 63, 94, 0.5)' : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '24px',
                  padding: '2rem',
                  cursor: 'pointer',
                  backdropFilter: 'blur(20px)',
                  boxShadow: inspectedCards[idx] ? '0 15px 40px rgba(244, 63, 94, 0.2)' : '0 10px 30px rgba(0,0,0,0.3)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '220px',
                  transition: 'all 0.3s ease',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <GoldBadge name={card.icon} size={28} />
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: inspectedCards[idx] ? '#4ade80' : '#fda4af', letterSpacing: '0.1em' }}>
                      {inspectedCards[idx] ? '✓ VERIFIED' : 'TAP TO EXAMINE'}
                    </span>
                  </div>
                  <h3 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '0.75rem', fontWeight: 700 }}>
                    {card.title}
                  </h3>
                  <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: 1.6 }}>
                    {inspectedCards[idx] ? card.desc : 'Tap to break the wax seal and inspect this sacred memory.'}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setChapter(3)}
              style={{
                background: 'linear-gradient(135deg, #f43f5e, #be123c)',
                color: '#fff',
                padding: '16px 40px',
                borderRadius: '999px',
                border: 'none',
                fontWeight: 700,
                fontSize: '1rem',
                cursor: 'pointer',
                boxShadow: '0 8px 25px rgba(244, 63, 94, 0.4)',
              }}
            >
              Proceed to Soul Alignment &rarr;
            </motion.button>
          </div>
        </div>
      )}

      {/* ── CHAPTER 3: SOUL ALIGNMENT QUIZ ── */}
      {chapter === 3 && (
        <div style={{ width: '100%', maxWidth: '780px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fb7185', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
              Chapter III: Harmony Test
            </span>
            <h2 style={{ fontFamily: 'var(--font-dancing)', fontSize: 'clamp(2.2rem, 5vw, 3.2rem)', color: '#fff', margin: '0.35rem 0' }}>
              Soul Alignment Check
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1rem' }}>
              Confirm what our hearts already know to unlock the memory capsule.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem' }}>
            {quizQuestions.map((q, qIdx) => (
              <div
                key={q.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '24px',
                  padding: '2rem',
                  backdropFilter: 'blur(20px)',
                }}
              >
                <h4 style={{ color: '#fff', fontSize: '1.15rem', marginBottom: '1.25rem', fontWeight: 600 }}>
                  {qIdx + 1}. {q.question}
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {q.options.map((opt, optIdx) => {
                    const isSelected = quizAnswers[qIdx] === optIdx;
                    return (
                      <motion.button
                        key={optIdx}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => handleQuizAnswer(qIdx, optIdx)}
                        style={{
                          textAlign: 'left',
                          padding: '14px 20px',
                          borderRadius: '16px',
                          border: isSelected ? '1.5px solid #f43f5e' : '1px solid rgba(255, 255, 255, 0.1)',
                          background: isSelected ? 'rgba(244, 63, 94, 0.2)' : 'rgba(255, 255, 255, 0.02)',
                          color: isSelected ? '#fff' : '#cbd5e1',
                          fontWeight: isSelected ? 700 : 500,
                          fontSize: '0.95rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <span>{opt}</span>
                        {isSelected && <span style={{ color: '#f43f5e', fontSize: '1.2rem' }}>♥</span>}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              disabled={Object.keys(quizAnswers).length < quizQuestions.length}
              onClick={() => setChapter(4)}
              style={{
                background: Object.keys(quizAnswers).length === quizQuestions.length ? 'linear-gradient(135deg, #f43f5e, #be123c)' : 'rgba(255,255,255,0.1)',
                color: '#fff',
                padding: '16px 40px',
                borderRadius: '999px',
                border: 'none',
                fontWeight: 700,
                fontSize: '1rem',
                cursor: Object.keys(quizAnswers).length === quizQuestions.length ? 'pointer' : 'not-allowed',
                boxShadow: Object.keys(quizAnswers).length === quizQuestions.length ? '0 8px 25px rgba(244, 63, 94, 0.4)' : 'none',
              }}
            >
              Enter Memory Time Machine &rarr;
            </motion.button>
          </div>
        </div>
      )}

      {/* ── CHAPTER 4: THE MEMORY TIME MACHINE ── */}
      {chapter === 4 && (
        <div style={{ width: '100%', maxWidth: '880px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ marginBottom: '2.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fb7185', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
              Chapter IV: Nostalgia
            </span>
            <h2 style={{ fontFamily: 'var(--font-dancing)', fontSize: 'clamp(2.2rem, 5vw, 3.4rem)', color: '#fff', margin: '0.35rem 0' }}>
              The Memory Time Machine
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1rem' }}>
              Every photo holds a universe of emotions we built together.
            </p>
          </div>

          <div style={{ marginBottom: '3rem' }}>
            <PolaroidStack photos={photos.length > 0 ? photos : ['/images/sample1.jpg', '/images/sample2.jpg']} />
          </div>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setChapter(5)}
            style={{
              background: 'linear-gradient(135deg, #f43f5e, #be123c)',
              color: '#fff',
              padding: '16px 42px',
              borderRadius: '999px',
              border: 'none',
              fontWeight: 700,
              fontSize: '1.05rem',
              cursor: 'pointer',
              boxShadow: '0 8px 25px rgba(244, 63, 94, 0.4)',
            }}
          >
            A Quiet Moment Ahead &rarr;
          </motion.button>
        </div>
      )}

      {/* ── CHAPTER 5: CINEMATIC BLACKOUT & HEARTBEAT ── */}
      {chapter === 5 && (
        <div style={{ width: '100%', maxWidth: '720px', margin: '0 auto', textAlign: 'center', padding: '3rem 1rem' }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
          >
            <div style={{ marginBottom: '2rem' }}>
              <motion.div
                animate={{ scale: [1, 1.15, 1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
                style={{
                  display: 'inline-flex',
                  padding: '24px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(244, 63, 94, 0.3) 0%, rgba(0,0,0,0) 70%)',
                }}
              >
                <GoldBadge name="heart" size={64} />
              </motion.div>
            </div>

            <h2
              style={{
                fontFamily: 'var(--font-dancing)',
                fontSize: 'clamp(2.4rem, 6vw, 3.8rem)',
                color: '#fff1f2',
                margin: '0 0 1.5rem',
                lineHeight: 1.2,
              }}
            >
              Take a Deep Breath…
            </h2>

            <p style={{ color: '#cbd5e1', fontSize: '1.15rem', lineHeight: 1.9, maxWidth: '540px', margin: '0 auto 3rem' }}>
              Out of 8 billion people on this planet, finding you was the most miraculous thing that ever happened to me. There is one question my heart has been waiting to ask you.
            </p>

            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 45px rgba(244, 63, 94, 0.7)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setChapter(6)}
              style={{
                background: 'linear-gradient(135deg, #f43f5e, #be123c)',
                color: '#fff',
                padding: '18px 46px',
                borderRadius: '999px',
                border: '1px solid rgba(255,255,255,0.3)',
                fontWeight: 800,
                fontSize: '1.1rem',
                cursor: 'pointer',
              }}
            >
              Reveal The Secret &rarr;
            </motion.button>
          </motion.div>
        </div>
      )}

      {/* ── CHAPTER 6: VELVET RING BOX & THE PROPOSAL ── */}
      {chapter === 6 && (
        <div style={{ width: '100%', maxWidth: '820px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ marginBottom: '2.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fb7185', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
              Chapter VI: The Question of a Lifetime
            </span>
            <h2 style={{ fontFamily: 'var(--font-dancing)', fontSize: 'clamp(2.4rem, 6vw, 4rem)', color: '#fff', margin: '0.35rem 0' }}>
              Will You Marry Me?
            </h2>
            <p style={{ color: '#fda4af', fontSize: '1.1rem', fontWeight: 600 }}>
              {recipient}, tap the velvet box to reveal what is inside.
            </p>
          </div>

          {/* Velvet Ring Box */}
          <div style={{ margin: '0 auto 3rem', display: 'flex', justifyContent: 'center' }}>
            <motion.div
              whileHover={{ scale: boxOpened ? 1 : 1.05 }}
              onClick={() => setBoxOpened(true)}
              style={{
                width: 'min(86vw, 320px)',
                height: '240px',
                borderRadius: '28px',
                background: 'linear-gradient(145deg, #4c0519, #1f020a)',
                border: '2px solid rgba(244, 63, 94, 0.4)',
                boxShadow: '0 25px 60px rgba(0,0,0,0.7), inset 0 2px 10px rgba(255,255,255,0.1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {boxOpened ? (
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', damping: 12 }}
                  style={{ textAlign: 'center' }}
                >
                  <div style={{ filter: 'drop-shadow(0 0 25px #ffd700)' }}>
                    <GoldBadge name="ring" size={80} />
                  </div>
                  <span style={{ display: 'block', marginTop: '12px', color: '#fbbf24', fontSize: '0.88rem', fontWeight: 800, letterSpacing: '0.1em' }}>
                    ✦ ETERNAL DIAMOND ✦
                  </span>
                </motion.div>
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <GoldBadge name="crown" size={48} />
                  <p style={{ color: '#fda4af', fontSize: '0.95rem', fontWeight: 700, margin: '10px 0 0' }}>
                    TAP TO UNLOCK
                  </p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Yes / No Interactive Buttons */}
          {boxOpened && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', position: 'relative', minHeight: '80px', flexWrap: 'wrap' }}>
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setChapter(7)}
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: '#fff',
                  padding: '16px 48px',
                  borderRadius: '999px',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                  boxShadow: '0 10px 30px rgba(16, 185, 129, 0.4)',
                }}
              >
                💍 YES, A THOUSAND TIMES YES!
              </motion.button>

              <motion.button
                animate={{ x: noPosition.x, y: noPosition.y }}
                onMouseEnter={dodgeNoButton}
                onClick={dodgeNoButton}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: '#94a3b8',
                  padding: '14px 28px',
                  borderRadius: '999px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                }}
              >
                {dodgeCount > 0 ? funnyDialogue[dodgeCount % funnyDialogue.length] : 'No...'}
              </motion.button>
            </div>
          )}
        </div>
      )}

      {/* ── CHAPTER 7: ETERNAL KEESAKE & CERTIFICATE ── */}
      {chapter === 7 && (
        <div style={{ width: '100%', maxWidth: '960px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ display: 'inline-flex', padding: '18px', background: 'rgba(244, 63, 94, 0.15)', borderRadius: '50%', marginBottom: '1.25rem' }}>
              <GoldBadge name="crown" size={56} />
            </div>
            <h1
              style={{
                fontFamily: 'var(--font-dancing)',
                fontSize: 'clamp(2.4rem, 6vw, 4rem)',
                color: '#fff1f2',
                margin: '0 0 0.5rem',
              }}
            >
              Officially Forever
            </h1>
            <p style={{ color: '#fda4af', fontSize: '1.15rem', fontWeight: 600 }}>
              The promise has been sealed in the stars.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.75rem', marginBottom: '3rem' }}>
            {/* Our Lifetime Vows */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(244, 63, 94, 0.25)',
                borderRadius: '28px',
                padding: '2.25rem',
                backdropFilter: 'blur(20px)',
              }}
            >
              <h3 style={{ color: '#fff', fontSize: '1.3rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <GoldBadge name="sparkle" size={22} />
                Our Lifetime Vows
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  'Never going to sleep angry without making peace.',
                  'Always sharing the last slice of dessert (or at least 50%).',
                  'Building a cozy sanctuary filled with warmth, travel, and laughter.',
                  'Backing each other\'s dreams with unwavering belief.',
                  'Choosing each other every single day, forever.'
                ].map((vow, i) => (
                  <li key={i} style={{ color: '#cbd5e1', fontSize: '0.95rem', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <GoldBadge name="heart" size={14} style={{ marginTop: '4px', flexShrink: 0 }} />
                    <span>{vow}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Inaugural Date Ticket */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(244, 63, 94, 0.25)',
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
                  <GoldBadge name="toast" size={22} />
                  Our Inaugural Celebration
                </h3>
                <p style={{ color: '#fda4af', fontSize: '1.1rem', fontWeight: 600, margin: '0 0 1rem' }}>
                  {dateIdea}
                </p>
                <p style={{ color: '#94a3b8', fontSize: '0.92rem', lineHeight: 1.7 }}>
                  This ticket represents our first official celebration together as partners for life.
                </p>
              </div>

              <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                <WholesomeMemeSticker caption="Best decision ever written in the stars" />
              </div>
            </div>
          </div>

          {/* Letter / Wax Seal Keepsake */}
          <div style={{ marginBottom: '3rem' }}>
            <WaxSealLetter
              title={`A Permanent Letter for ${recipient}`}
              content={customMsg}
              author="Your Forever Partner"
              date={new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            />
          </div>
        </div>
      )}
    </CinematicStageWrapper>
  );
}
