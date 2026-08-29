'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';

const GAMES = [
  {
    id: 'heart-rush',
    title: 'Heart Rush!',
    icon: '💖⚡',
    tagline: '30s Falling Sparks Catcher',
    description: 'Catch falling hearts, letters, and roses while dodging heartbreak bombs. High reflex couple duel!',
    badge: '🔥 MOST POPULAR',
    color: '#ec4899',
    bg: 'linear-gradient(135deg, #fdf2f8, #fce7f3)'
  },
  {
    id: 'memory-match',
    title: 'Memory Match',
    icon: '🧩🃏',
    tagline: 'Couple Emoji Card Flip',
    description: 'Flip and match 8 cute couple pairs in the fewest moves and fastest time possible.',
    badge: '✨ BRAIN DUEL',
    color: '#8b5cf6',
    bg: 'linear-gradient(135deg, #f5f3ff, #ede9fe)'
  },
  {
    id: 'speed-tap',
    title: '10s Hug Frenzy',
    icon: '⚡🫂',
    tagline: '10-Second Speed Tap Duel',
    description: 'Tap the beating heart as fast as you can in 10 seconds. Who has the highest hug power?',
    badge: '⚡ SPEED TEST',
    color: '#f59e0b',
    bg: 'linear-gradient(135deg, #fffbeb, #fef3c7)'
  },
  {
    id: 'love-quiz',
    title: 'Couple Chemistry Quiz',
    icon: '🧠❓',
    tagline: '6 Romance Questions in 30s',
    description: 'Answer rapid-fire romantic questions as a couple. Speed bonuses and streaks boost your chemistry score!',
    badge: '🧪 NEW GAME',
    color: '#059669',
    bg: 'linear-gradient(135deg, #ecfdf5, #d1fae5)'
  },
  {
    id: 'word-scramble',
    title: 'Love Word Scramble',
    icon: '🔡💌',
    tagline: '6 Romantic Words in 60s',
    description: 'Unscramble secret love words before the clock runs out. How many can you and your partner solve?',
    badge: '🔡 WORD GAME',
    color: '#7c3aed',
    bg: 'linear-gradient(135deg, #f5f3ff, #ede9fe)'
  }
];

export default function ArcadeLobby() {
  const { user, login } = useAuth();
  const [highScores, setHighScores] = useState({});

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('arcade_high_scores') || '{}');
      setHighScores(saved);
    } catch {}
  }, []);

  return (
    <main className="shell" style={{ padding: '2.5rem 1rem' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        
        {/* Arcade Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span style={{
            background: 'linear-gradient(135deg, #ec4899, #be185d)',
            color: '#ffffff',
            padding: '0.4rem 1.2rem',
            borderRadius: '999px',
            fontSize: '0.75rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            boxShadow: '0 4px 12px rgba(190, 24, 93, 0.2)'
          }}>
            🎮 COUPLES &amp; BESTIES ARCADE
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginTop: '0.85rem', marginBottom: '0.5rem', color: '#1f2937', fontWeight: 800 }}>
            Play, Compete &amp; Challenge!
          </h1>
          <p style={{ color: '#6b7280', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
            Set a new high score in our romantic &amp; fun mini-games, then send a 1-click WhatsApp challenge link to your partner to see who wins!
          </p>

          {!user && (
            <div style={{
              background: '#fff1f2',
              border: '1px solid #fecdd3',
              borderRadius: '16px',
              padding: '0.85rem 1.25rem',
              maxWidth: '460px',
              margin: '1.25rem auto 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem'
            }}>
              <span style={{ fontSize: '0.85rem', color: '#9f1239', fontWeight: 600, textAlign: 'left' }}>
                💡 Sign in with Google to save your high scores permanently across devices!
              </span>
              <button
                type="button"
                onClick={login}
                style={{
                  background: '#be185d',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '999px',
                  padding: '0.4rem 0.9rem',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                Sign In
              </button>
            </div>
          )}
        </div>

        {/* Games Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          {GAMES.map((game) => {
            const best = highScores[game.id] || 0;
            return (
              <div
                key={game.id}
                style={{
                  background: '#ffffff',
                  borderRadius: '24px',
                  border: '1px solid rgba(0,0,0,0.06)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
              >
                {/* Top Badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: game.color, background: game.bg, padding: '0.25rem 0.65rem', borderRadius: '999px' }}>
                    {game.badge}
                  </span>
                  {best > 0 && (
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#16a34a', background: '#dcfce7', padding: '0.2rem 0.55rem', borderRadius: '999px' }}>
                      🏆 Best: {best} pts
                    </span>
                  )}
                </div>

                <div>
                  <div style={{ fontSize: '3.2rem', marginBottom: '0.75rem' }}>{game.icon}</div>
                  <h3 style={{ fontSize: '1.35rem', color: '#1f2937', fontWeight: 800, margin: '0 0 0.25rem' }}>
                    {game.title}
                  </h3>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: game.color, display: 'block', marginBottom: '0.75rem' }}>
                    {game.tagline}
                  </span>
                  <p style={{ fontSize: '0.9rem', color: '#6b7280', lineHeight: 1.6, margin: '0 0 1.5rem' }}>
                    {game.description}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <Link
                    href={`/arcade/${game.id}`}
                    className="btn-primary"
                    style={{
                      flex: 1,
                      textAlign: 'center',
                      padding: '0.75rem',
                      fontSize: '0.95rem',
                      background: `linear-gradient(135deg, ${game.color}, #be185d)`
                    }}
                  >
                    🎮 Play &amp; Duel ➔
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* How Duels Work Card */}
        <div style={{
          background: 'linear-gradient(135deg, #fff1f2, #fdf4ff)',
          borderRadius: '24px',
          border: '1.5px dashed #f43f5e',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.5rem' }}>⚔️💌</span>
          <h2 style={{ fontSize: '1.5rem', color: '#881337', fontWeight: 800, margin: '0 0 0.5rem' }}>
            How Partner Duels Work
          </h2>
          <p style={{ color: '#9f1239', fontSize: '0.95rem', maxWidth: '520px', margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
            1. Play any 30s game to set your high score.<br />
            2. Click &ldquo;Challenge Your Partner&rdquo; to create a custom WhatsApp link.<br />
            3. Your partner taps the link, plays to beat your score, and the winner takes the crown! 👑
          </p>
          <Link
            href="/arcade/heart-rush"
            className="btn-primary"
            style={{ padding: '0.8rem 2rem', fontSize: '1rem', background: 'linear-gradient(135deg, #ec4899, #be185d)' }}
          >
            🔥 Start a Quick Game
          </Link>
        </div>

      </div>
    </main>
  );
}
