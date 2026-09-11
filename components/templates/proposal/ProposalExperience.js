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
 * 7-Chapter Interactive Romantic Odyssey
 * Chapter 1: The Mysterious Royal Invitation
 * Chapter 2: The Evidence Room (Draggable crime/love files & Memes)
 * Chapter 3: The Couple Compatibility Quiz
 * Chapter 4: The Memory Time Machine
 * Chapter 5: The "Almost" Proposal (Cinematic Blackout & Heartbeat)
 * Chapter 6: The Velvet Ring Box & Dodging "NO" 2.0
 * Chapter 7: The Future Card & Wax-Sealed Certificate
 */
export default function ProposalExperience({ note, isPreview = false, onReachEnd }) {
  const [chapter, setChapter] = useState(1);
  const [unlockedSecrets, setUnlockedSecrets] = useState([true, false, false]);

  useEffect(() => {
    onReachEnd?.(chapter === 7, () => {
      setChapter(1);
      setBoxOpened(false);
      setDodgeCount(0);
      setNoPosition({ x: 0, y: 0 });
    });
  }, [chapter, onReachEnd]);
  
  // Chapter 2: Evidence files inspected
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
    'Wait, try again!',
    'Nice try, too fast!',
    'Are you sure about that?',
    'Error 404: NO unavailable!',
    'Your fingers slipped!',
    'Universe says YES! ✨',
    'No escape from destiny! 💍'
  ];

  const dodgeNoButton = () => {
    const randomX = Math.floor(Math.random() * 260 - 130);
    const randomY = Math.floor(Math.random() * 180 - 90);
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
      options: ['You obviously', 'Me without a doubt', 'It was mutual love at first sight!'],
      correct: 1,
    },
    {
      id: 'q2',
      question: 'What happens when we are hungry and confused?',
      options: ['We order pizza & argue for 30 mins', 'We get hangry together', 'Someone steals fries!'],
      correct: 2,
    },
    {
      id: 'q3',
      question: 'Who is the ultimate troublemaker in this relationship?',
      options: ['100% You', 'Both of us equally', 'Our late-night impulse shopping'],
      correct: 1,
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

  const handleSayYes = () => {
    setChapter(7);
  };

  const timelineEvents = [
    {
      date: 'Day One',
      title: 'The Spark',
      description: 'The first conversation that started everything. Hours felt like minutes.',
      icon: 'sparkle'
    },
    {
      date: 'Chapter Two',
      title: 'Unstoppable Laughter',
      description: 'When we realized our sense of humor is identically chaotic and sweet.',
      icon: 'heart'
    },
    {
      date: 'The Breakthrough',
      title: 'Safe Haven',
      description: 'Realizing that no matter how rough the world gets, your voice is home.',
      icon: 'compass'
    },
    {
      date: 'Today & Beyond',
      title: 'Forever In The Making',
      description: 'The moment we turn all our dreams into an everlasting promise.',
      icon: 'ring'
    }
  ];

  return (
    <CinematicStageWrapper
      currentStep={chapter}
      totalSteps={7}
      chapterTitle={
        chapter === 1
          ? 'Royal Invitation'
          : chapter === 2
          ? 'The Evidence Room'
          : chapter === 3
          ? 'Compatibility Check'
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
        <div style={{ textAlign: 'center' }}>
          <motion.div
            initial={{ scale: 0.88, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="glass-card"
            style={{
              padding: '3.5rem 2rem',
              borderRadius: '28px',
              border: '2px solid rgba(251, 113, 133, 0.4)',
              boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 0 40px rgba(244, 63, 94, 0.25)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ display: 'inline-flex', padding: '16px', background: 'rgba(244, 63, 94, 0.15)', borderRadius: '50%', marginBottom: '1.5rem' }}>
              <GoldBadge name="crown" size={56} />
            </div>

            <span style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#fb7185', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              Confidential & For Your Eyes Only
            </span>

            <h1
              style={{
                fontFamily: 'var(--font-dancing), "Dancing Script", cursive',
                fontSize: 'clamp(2.2rem, 5.5vw, 3.4rem)',
                color: '#fff1f2',
                margin: '0 0 1.25rem',
                textShadow: '0 2px 20px rgba(244, 63, 94, 0.5)',
              }}
            >
              An Exclusive Invitation for {recipient}
            </h1>

            <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: 1.7, maxWidth: '480px', margin: '0 auto 2.5rem' }}>
              You have been summoned to a private cinematic journey. Behind these doors lie our greatest moments, unwritten memories, and one life-changing secret.
            </p>

            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 35px rgba(244, 63, 94, 0.7)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setChapter(2)}
              className="gold-button"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '16px 36px',
                fontSize: '1.1rem',
                fontWeight: 700,
                borderRadius: '50px',
                background: 'linear-gradient(135deg, #f43f5e, #be123c)',
                color: '#ffffff',
                border: '1px solid rgba(255,255,255,0.3)',
                cursor: 'pointer',
              }}
            >
              <GoldBadge name="sparkle" size={20} />
              Open Royal Portal
            </motion.button>
          </motion.div>
        </div>
      )}

      {/* ── CHAPTER 2: THE EVIDENCE ROOM ── */}
      {chapter === 2 && (
        <div>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fb7185', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              Chapter II: Undeniable Proof
            </span>
            <h2 style={{ fontFamily: 'var(--font-dancing)', fontSize: '2.5rem', color: '#fff', margin: '0.25rem 0' }}>
              The Evidence Room
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
              Tap each classified file to examine why we belong together.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
            {[
              { title: 'Exhibit A: The Smile', desc: 'The undeniable warmth that completely ruined any chance of staying just friends.', meme: 'bearHug' },
              { title: 'Exhibit B: Shared Chaos', desc: 'Our late night 3:00 AM conversations and stealing food off each others plates.', meme: 'stolenFries' },
              { title: 'Exhibit C: The Realization', desc: specialMemory || 'That every future without you is simply out of the question.', meme: 'talk3am' },
            ].map((card, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -6, scale: 1.02 }}
                onClick={() => handleCardInspect(idx)}
                style={{
                  background: inspectedCards[idx] ? 'rgba(244, 63, 94, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                  border: inspectedCards[idx] ? '2px solid #f43f5e' : '1px dashed rgba(255, 255, 255, 0.2)',
                  borderRadius: '20px',
                  padding: '1.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textAlign: 'center',
                }}
              >
                <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
                  <WholesomeMemeSticker type={card.meme} size={70} caption={card.title} />
                </div>
                <h3 style={{ fontSize: '1.1rem', color: '#fda4af', margin: '0 0 0.5rem' }}>{card.title}</h3>
                <p style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: 1.5, margin: 0 }}>
                  {card.desc}
                </p>
                <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: inspectedCards[idx] ? '#4ade80' : '#94a3b8', fontWeight: 700 }}>
                  {inspectedCards[idx] ? '✓ Verified by Heart' : 'Tap to Examine'}
                </div>
              </motion.div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setChapter(3)}
              style={{
                background: 'linear-gradient(135deg, #f43f5e, #be123c)',
                color: '#fff',
                padding: '14px 32px',
                borderRadius: '50px',
                border: 'none',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              Continue to Compatibility Test
              <GoldBadge name="sparkle" size={16} />
            </motion.button>
          </div>
        </div>
      )}

      {/* ── CHAPTER 3: COUPLE COMPATIBILITY QUIZ ── */}
      {chapter === 3 && (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fb7185', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              Chapter III: Relationship Verification
            </span>
            <h2 style={{ fontFamily: 'var(--font-dancing)', fontSize: '2.5rem', color: '#fff', margin: '0.25rem 0' }}>
              The Ultimate Chemistry Test
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
              Answer these high-stakes relationship questions.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
            {quizQuestions.map((q, qIdx) => (
              <div
                key={q.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '18px',
                  padding: '1.25rem',
                }}
              >
                <div style={{ fontWeight: 700, color: '#fda4af', marginBottom: '0.75rem', fontSize: '1rem' }}>
                  {qIdx + 1}. {q.question}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {q.options.map((opt, optIdx) => {
                    const isSelected = quizAnswers[qIdx] === optIdx;
                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleQuizAnswer(qIdx, optIdx)}
                        style={{
                          textAlign: 'left',
                          padding: '10px 16px',
                          borderRadius: '12px',
                          border: isSelected ? '2px solid #f43f5e' : '1px solid rgba(255, 255, 255, 0.1)',
                          background: isSelected ? 'rgba(244, 63, 94, 0.25)' : 'rgba(255, 255, 255, 0.02)',
                          color: isSelected ? '#fff' : '#cbd5e1',
                          fontWeight: isSelected ? 700 : 400,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <span>{opt}</span>
                        {isSelected && <GoldBadge name="heart" size={16} />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {quizScore && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{
                textAlign: 'center',
                padding: '1.5rem',
                background: 'rgba(244, 63, 94, 0.15)',
                border: '1px solid rgba(244, 63, 94, 0.4)',
                borderRadius: '20px',
                marginBottom: '1.5rem',
              }}
            >
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginBottom: '0.25rem' }}>
                Compatibility Score: 1000% Perfect Match!
              </div>
              <p style={{ color: '#cbd5e1', fontSize: '0.9rem', margin: '0 0 1rem' }}>
                The algorithm confirms: Our chaos completes each other seamlessly.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setChapter(4)}
                style={{
                  background: 'linear-gradient(135deg, #f43f5e, #be123c)',
                  color: '#fff',
                  padding: '12px 28px',
                  borderRadius: '50px',
                  border: 'none',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Step Into The Time Machine
              </motion.button>
            </motion.div>
          )}
        </div>
      )}

      {/* ── CHAPTER 4: MEMORY TIME MACHINE ── */}
      {chapter === 4 && (
        <div>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fb7185', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              Chapter IV: The Story So Far
            </span>
            <h2 style={{ fontFamily: 'var(--font-dancing)', fontSize: '2.5rem', color: '#fff', margin: '0.25rem 0' }}>
              The Memory Time Machine
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
              Every step, every laugh, every quiet evening leading to right now.
            </p>
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <MemoryTimeMachine events={timelineEvents} />
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
                background: 'linear-gradient(135deg, #f43f5e, #be123c)',
                color: '#fff',
                padding: '14px 34px',
                borderRadius: '50px',
                border: 'none',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              The Next Step
              <GoldBadge name="sparkle" size={16} />
            </motion.button>
          </div>
        </div>
      )}

      {/* ── CHAPTER 5: THE ALMOST PROPOSAL (BLACKOUT & HEARTBEAT) ── */}
      {chapter === 5 && (
        <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
            style={{
              background: 'radial-gradient(circle, rgba(20,20,30,0.9) 0%, rgba(5,5,10,0.98) 100%)',
              padding: '4rem 2rem',
              borderRadius: '32px',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              boxShadow: '0 0 50px rgba(0,0,0,0.8)',
            }}
          >
            <motion.div
              animate={{
                scale: [1, 1.25, 1, 1.35, 1],
              }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{ display: 'inline-flex', marginBottom: '2rem' }}
            >
              <GoldBadge name="heart" size={64} />
            </motion.div>

            <h2
              style={{
                fontFamily: 'var(--font-dancing)',
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                color: '#fff',
                marginBottom: '1rem',
              }}
            >
              Take a deep breath...
            </h2>

            <p
              style={{
                color: '#cbd5e1',
                fontSize: '1.1rem',
                lineHeight: 1.8,
                maxWidth: '520px',
                margin: '0 auto 2.5rem',
              }}
            >
              All the evidence has been examined. The time machine has traveled through all our sweetest memories. There is only one question left in the entire world.
            </p>

            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setChapter(6)}
              style={{
                background: 'linear-gradient(135deg, #fb7185, #e11d48)',
                color: '#fff',
                padding: '16px 40px',
                borderRadius: '50px',
                border: 'none',
                fontSize: '1.1rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 0 30px rgba(244, 63, 94, 0.6)',
              }}
            >
              I Am Ready
            </motion.button>
          </motion.div>
        </div>
      )}

      {/* ── CHAPTER 6: THE VELVET RING BOX & DODGING NO 2.0 ── */}
      {chapter === 6 && (
        <div style={{ textAlign: 'center' }}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card"
            style={{
              padding: '3rem 2rem',
              borderRadius: '28px',
              border: '2px solid rgba(251, 113, 133, 0.4)',
              boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
              position: 'relative',
              minHeight: '440px',
            }}
          >
            {!boxOpened ? (
              <div style={{ padding: '2rem 0' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fb7185', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                  The Moment Has Arrived
                </span>
                <h2 style={{ fontFamily: 'var(--font-dancing)', fontSize: '2.8rem', color: '#fff', margin: '0.5rem 0 1.5rem' }}>
                  Open The Royal Vault
                </h2>

                <motion.div
                  whileHover={{ scale: 1.1, rotate: [0, -3, 3, 0] }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setBoxOpened(true)}
                  style={{
                    display: 'inline-flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    cursor: 'pointer',
                    padding: '2.5rem',
                    background: 'radial-gradient(circle, rgba(190, 18, 60, 0.4) 0%, rgba(0,0,0,0.6) 80%)',
                    borderRadius: '24px',
                    border: '2px solid #fb7185',
                    boxShadow: '0 0 30px rgba(244, 63, 94, 0.4)',
                  }}
                >
                  <GoldBadge name="ring" size={72} />
                  <span style={{ color: '#fff1f2', fontWeight: 700, marginTop: '1rem', fontSize: '1.05rem' }}>
                    Tap Velvet Box To Unlock
                  </span>
                </motion.div>
              </div>
            ) : (
              <div>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  <div style={{ display: 'inline-flex', padding: '16px', background: 'rgba(244, 63, 94, 0.2)', borderRadius: '50%', marginBottom: '1rem' }}>
                    <GoldBadge name="ring" size={54} />
                  </div>

                  <h1
                    style={{
                      fontFamily: 'var(--font-dancing)',
                      fontSize: 'clamp(2.2rem, 5vw, 3.2rem)',
                      color: '#fff',
                      margin: '0 0 1rem',
                    }}
                  >
                    Will You Marry Me, {recipient}?
                  </h1>

                  <p
                    style={{
                      color: '#cbd5e1',
                      fontSize: '1.05rem',
                      lineHeight: 1.7,
                      maxWidth: '520px',
                      margin: '0 auto 2.5rem',
                      fontStyle: 'italic',
                    }}
                  >
                    "{customMsg}"
                  </p>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '1.5rem',
                      position: 'relative',
                      minHeight: '80px',
                    }}
                  >
                    <motion.button
                      whileHover={{ scale: 1.1, boxShadow: '0 0 40px rgba(244, 63, 94, 0.8)' }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSayYes}
                      style={{
                        background: 'linear-gradient(135deg, #f43f5e, #be123c)',
                        color: '#fff',
                        padding: '16px 40px',
                        borderRadius: '50px',
                        border: 'none',
                        fontSize: '1.2rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        zIndex: 10,
                      }}
                    >
                      YES! A Million Times YES!
                    </motion.button>

                    <motion.button
                      animate={{ x: noPosition.x, y: noPosition.y }}
                      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                      onMouseEnter={dodgeNoButton}
                      onTouchStart={dodgeNoButton}
                      onClick={dodgeNoButton}
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        color: '#94a3b8',
                        padding: '14px 28px',
                        borderRadius: '50px',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        fontSize: '1rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      {dodgeCount > 0
                        ? funnyDialogue[dodgeCount % funnyDialogue.length]
                        : 'No...'}
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* ── CHAPTER 7: THE FUTURE CARD & WAX SEAL CERTIFICATE ── */}
      {chapter === 7 && (
        <div>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ display: 'inline-flex', padding: '16px', background: 'rgba(244, 63, 94, 0.2)', borderRadius: '50%', marginBottom: '1rem' }}>
              <GoldBadge name="crown" size={54} />
            </div>
            <h1
              style={{
                fontFamily: 'var(--font-dancing)',
                fontSize: 'clamp(2.4rem, 6vw, 3.6rem)',
                color: '#fff1f2',
                margin: '0 0 0.5rem',
              }}
            >
              Officially Forever
            </h1>
            <p style={{ color: '#fda4af', fontSize: '1.1rem', fontWeight: 600 }}>
              The promise has been sealed in the stars.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
            {/* Our 5 Future Promises */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(251, 113, 133, 0.3)',
                borderRadius: '24px',
                padding: '2rem',
              }}
            >
              <h3 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <GoldBadge name="sparkle" size={20} />
                Our Lifetime Vows
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {[
                  'Never going to sleep angry without making peace.',
                  'Always sharing the last slice of dessert (or at least 50%).',
                  'Building a cozy sanctuary filled with warmth, travel, and laughter.',
                  'Backing each others dreams with unwavering belief.',
                  'Choosing each other every single day, forever.'
                ].map((vow, i) => (
                  <li key={i} style={{ color: '#cbd5e1', fontSize: '0.92rem', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <GoldBadge name="heart" size={14} style={{ marginTop: '3px', flexShrink: 0 }} />
                    <span>{vow}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Date Idea & Special Keepsake */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(251, 113, 133, 0.3)',
                borderRadius: '24px',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <h3 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <GoldBadge name="toast" size={20} />
                  Our Inaugural Date
                </h3>
                <p style={{ color: '#fda4af', fontSize: '1.05rem', fontWeight: 600, margin: '0 0 1rem' }}>
                  {dateIdea}
                </p>
                <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.6 }}>
                  This ticket represents our first official celebration together as partners for life.
                </p>
              </div>

              <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                <WholesomeMemeSticker type="bearHug" size={80} caption="Best decision ever!" />
              </div>
            </div>
          </div>

          {/* Letter / Wax Seal Keepsake */}
          <div style={{ marginBottom: '2.5rem' }}>
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
