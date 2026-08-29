'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

const ITEMS = [
  { type: 'heart', emoji: '💖', pts: 10, speed: 2.2, label: 'Love' },
  { type: 'sparkle', emoji: '✨', pts: 15, speed: 2.6, label: 'Sparkle' },
  { type: 'letter', emoji: '💌', pts: 25, speed: 3.0, label: 'Love Letter' },
  { type: 'rose', emoji: '🌹', pts: 20, speed: 2.4, label: 'Rose' },
  { type: 'bomb', emoji: '💔', pts: -20, speed: 2.8, label: 'Heartbreak' },
];

export default function HeartRushGame({ onGameOver, challengeTargetScore = null, challengerName = null }) {
  const [gameState, setGameState] = useState('ready'); // 'ready', 'playing', 'gameover'
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [combo, setCombo] = useState(1);
  const [fallingItems, setFallingItems] = useState([]);
  const [popups, setPopups] = useState([]);
  const gameAreaRef = useRef(null);
  const nextIdRef = useRef(1);

  // Play audio blip via Web Audio
  const playSound = useCallback((type) => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'catch') {
        osc.frequency.setValueAtTime(520, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
      } else if (type === 'bomb') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(80, ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      }
    } catch {}
  }, []);

  // Spawn items during game
  useEffect(() => {
    if (gameState !== 'playing') return;

    const spawnInterval = setInterval(() => {
      const itemConfig = ITEMS[Math.floor(Math.random() * ITEMS.length)];
      const randomX = Math.floor(Math.random() * 85) + 5; // 5% to 90%

      const newItem = {
        id: nextIdRef.current++,
        ...itemConfig,
        x: randomX,
        y: -10,
        createdAt: Date.now()
      };

      setFallingItems((prev) => [...prev.slice(-15), newItem]);
    }, 450);

    return () => clearInterval(spawnInterval);
  }, [gameState]);

  // Timer loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameState('gameover');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  // End game notification
  useEffect(() => {
    if (gameState === 'gameover') {
      onGameOver?.(score);
    }
  }, [gameState, score, onGameOver]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setCombo(1);
    setFallingItems([]);
    setPopups([]);
    setGameState('playing');
  };

  const handleCatch = (item, e) => {
    if (gameState !== 'playing') return;
    e.stopPropagation();

    // Remove caught item
    setFallingItems((prev) => prev.filter((i) => i.id !== item.id));

    if (item.type === 'bomb') {
      playSound('bomb');
      setCombo(1);
      setScore((prev) => Math.max(0, prev + item.pts));
      addPopup('-20 💔', item.x, item.y, '#ef4444');
    } else {
      playSound('catch');
      const addedScore = item.pts * combo;
      setScore((prev) => prev + addedScore);
      setCombo((prev) => Math.min(prev + 1, 5));
      addPopup(`+${addedScore} ✨`, item.x, item.y, '#ec4899');
    }
  };

  const addPopup = (text, x, y, color) => {
    const id = Date.now() + Math.random();
    setPopups((prev) => [...prev, { id, text, x, y, color }]);
    setTimeout(() => {
      setPopups((prev) => prev.filter((p) => p.id !== id));
    }, 700);
  };

  return (
    <div style={{ width: '100%', maxWidth: '780px', margin: '0 auto', textAlign: 'center', userSelect: 'none' }}>
      
      {/* Top Header & HUD */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#ffffff',
        padding: 'clamp(0.6rem, 2vw, 1rem) clamp(0.85rem, 3vw, 1.5rem)',
        borderRadius: '20px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
        border: '1px solid #fecdd3',
        marginBottom: '1rem'
      }}>
        <div style={{ textAlign: 'left' }}>
          <span style={{ fontSize: 'clamp(0.7rem, 1.8vw, 0.8rem)', fontWeight: 800, color: '#be185d', textTransform: 'uppercase' }}>
            Score
          </span>
          <div style={{ fontSize: 'clamp(1.4rem, 4vw, 1.9rem)', fontWeight: 900, color: '#1f2937', lineHeight: 1 }}>
            {score}
          </div>
        </div>

        {combo > 1 && (
          <div style={{
            background: 'linear-gradient(135deg, #ec4899, #f43f5e)',
            color: '#fff',
            padding: '0.35rem 0.9rem',
            borderRadius: '999px',
            fontSize: 'clamp(0.75rem, 2vw, 0.9rem)',
            fontWeight: 800,
            animation: 'heartPulse 0.8s infinite'
          }}>
            🔥 {combo}x Multiplier!
          </div>
        )}

        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: 'clamp(0.7rem, 1.8vw, 0.8rem)', fontWeight: 800, color: timeLeft <= 5 ? '#ef4444' : '#be185d', textTransform: 'uppercase' }}>
            Time
          </span>
          <div style={{ fontSize: 'clamp(1.4rem, 4vw, 1.9rem)', fontWeight: 900, color: timeLeft <= 5 ? '#ef4444' : '#1f2937', lineHeight: 1 }}>
            {timeLeft}s
          </div>
        </div>
      </div>

      {/* Target to Beat Banner (If in Challenge Mode) */}
      {challengeTargetScore !== null && (
        <div style={{
          background: 'linear-gradient(135deg, #fdf2f8, #fce7f3)',
          border: '1.5px dashed #f43f5e',
          borderRadius: '16px',
          padding: '0.6rem 1rem',
          marginBottom: '1rem',
          fontSize: '0.85rem',
          fontWeight: 700,
          color: '#9f1239',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>⚔️ Target to Beat ({challengerName || 'Partner'}):</span>
          <span style={{ background: '#f43f5e', color: '#fff', padding: '0.2rem 0.6rem', borderRadius: '999px', fontWeight: 900 }}>
            {challengeTargetScore} pts
          </span>
        </div>
      )}

      {/* Main Auto-Adjusting Playfield */}
      <div
        ref={gameAreaRef}
        style={{
          position: 'relative',
          width: '100%',
          height: 'clamp(460px, 64vh, 680px)',
          background: 'radial-gradient(circle at center, #fff1f2 0%, #fdf2f8 100%)',
          borderRadius: '24px',
          border: '2px solid #fbcfe8',
          overflow: 'hidden',
          boxShadow: 'inset 0 2px 12px rgba(0,0,0,0.04)',
          touchAction: 'none',
          cursor: gameState === 'playing' ? 'crosshair' : 'default'
        }}
      >
        {gameState === 'ready' && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'rgba(255, 255, 255, 0.92)', backdropFilter: 'blur(4px)' }}>
            <span style={{ fontSize: 'clamp(3rem, 8vw, 4.2rem)', marginBottom: '0.5rem' }}>💖⚡</span>
            <h2 style={{ fontSize: 'clamp(1.5rem, 4.5vw, 2.2rem)', color: '#881337', fontWeight: 800, margin: '0 0 0.5rem' }}>
              Heart Rush!
            </h2>
            <p style={{ fontSize: 'clamp(0.9rem, 2.2vw, 1.05rem)', color: '#6b7280', maxWidth: '380px', margin: '0 0 1.75rem', lineHeight: 1.6 }}>
              Tap falling hearts, letters, and roses before they hit the ground. Avoid 💔 heartbreak bombs!
            </p>
            <button
              className="btn-primary"
              onClick={startGame}
              style={{ padding: '0.9rem 2.6rem', fontSize: '1.1rem', background: 'linear-gradient(135deg, #ec4899, #be185d)' }}
            >
              🚀 Start Game (30s)
            </button>
          </div>
        )}

        {gameState === 'playing' && (
          <>
            {fallingItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={(e) => handleCatch(item, e)}
                style={{
                  position: 'absolute',
                  left: `${item.x}%`,
                  top: '0%',
                  fontSize: 'clamp(32px, 6.5vw, 44px)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '10px',
                  animation: `fallAnimation ${item.speed}s linear forwards`,
                  filter: item.type === 'bomb' ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.25))' : 'drop-shadow(0 4px 12px rgba(244,63,94,0.4))',
                  transform: 'translateX(-50%)',
                  touchAction: 'none'
                }}
                aria-label={item.label}
              >
                {item.emoji}
              </button>
            ))}

            {/* Score Float Popups */}
            {popups.map((p) => (
              <div
                key={p.id}
                style={{
                  position: 'absolute',
                  left: `${p.x}%`,
                  top: '40%',
                  color: p.color,
                  fontWeight: 900,
                  fontSize: 'clamp(1.1rem, 3vw, 1.4rem)',
                  animation: 'floatUpAndFade 0.7s ease-out forwards',
                  pointerEvents: 'none',
                  textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                {p.text}
              </div>
            ))}
          </>
        )}

        {gameState === 'gameover' && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(4px)' }}>
            <span style={{ fontSize: 'clamp(2.8rem, 7vw, 3.8rem)', marginBottom: '0.5rem' }}>🏁</span>
            <h2 style={{ fontSize: 'clamp(1.6rem, 4.5vw, 2.2rem)', color: '#1f2937', fontWeight: 900, margin: '0 0 0.25rem' }}>
              Time&apos;s Up!
            </h2>
            <p style={{ fontSize: '1.1rem', color: '#4b5563', margin: '0 0 1.25rem' }}>
              You scored <strong style={{ color: '#be185d', fontSize: '1.8rem' }}>{score}</strong> pts!
            </p>
            <button
              className="btn-primary"
              onClick={startGame}
              style={{ padding: '0.8rem 2.2rem', fontSize: '1.05rem', background: 'linear-gradient(135deg, #ec4899, #be185d)' }}
            >
              🔄 Play Again
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fallAnimation {
          0% { top: -10%; opacity: 1; transform: translateX(-50%) rotate(0deg); }
          80% { opacity: 1; }
          100% { top: 105%; opacity: 0; transform: translateX(-50%) rotate(25deg); }
        }
        @keyframes floatUpAndFade {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-45px) scale(1.2); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
