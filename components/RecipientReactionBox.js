'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const REACTION_OPTIONS = [
  { emoji: '🥺', label: 'Touched & emotional' },
  { emoji: '❤️', label: 'Love you forever' },
  { emoji: '🥰', label: 'Made my whole day' },
  { emoji: '💍', label: 'YES, 1000x YES!' },
  { emoji: '✨', label: 'Thank you so much' },
  { emoji: '🤗', label: 'Sending a huge hug' },
  { emoji: '😭', label: 'Crying happy tears' },
  { emoji: '💌', label: 'Write my own reply' },
];

export default function RecipientReactionBox({ noteId, recipientName }) {
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!noteId || sending || submitted || !selected) return;
    setSending(true);
    try {
      await fetch('/api/reactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          noteId,
          action: 'react',
          reactionEmoji: selected.emoji,
          reactionLabel: selected.label,
          reactionMessage: message.trim(),
        }),
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Could not send reaction', err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ width: 'min(94vw, 520px)', margin: '2.5rem auto 3rem', fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        @keyframes popIn {
          0%   { transform: scale(0.4) rotate(-10deg); opacity: 0; }
          60%  { transform: scale(1.15) rotate(3deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes floatUp {
          0%   { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(-60px); opacity: 0; }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .rrb-pill {
          display: flex; align-items: center; gap: 9px;
          padding: 10px 14px; border-radius: 14px;
          border: 1.5px solid rgba(255,255,255,0.09);
          background: rgba(255,255,255,0.05);
          cursor: pointer; font-size: 13px; font-weight: 600;
          color: #94a3b8; transition: all 0.2s; text-align: left;
          font-family: 'Inter', sans-serif;
        }
        .rrb-pill:hover {
          background: rgba(244,63,94,0.1);
          border-color: rgba(244,63,94,0.35);
          color: #fff; transform: translateY(-1px);
        }
        .rrb-pill.active {
          background: rgba(244,63,94,0.15);
          border-color: #f43f5e;
          color: #fff;
          box-shadow: 0 4px 16px rgba(244,63,94,0.25);
        }
        .rrb-pill.active .rrb-emoji { animation: popIn 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        .rrb-emoji { font-size: 20px; flex-shrink: 0; }
        .rrb-textarea {
          width: 100%; border: 1.5px solid rgba(255,255,255,0.1);
          border-radius: 14px; padding: 12px 16px;
          font-size: 14px; font-family: 'Inter', sans-serif;
          resize: none; outline: none;
          background: rgba(255,255,255,0.05); color: #e2e8f0;
          transition: all 0.2s; box-sizing: border-box;
        }
        .rrb-textarea::placeholder { color: #475569; }
        .rrb-textarea:focus {
          border-color: #f43f5e;
          background: rgba(255,255,255,0.07);
          box-shadow: 0 0 0 3px rgba(244,63,94,0.12);
        }
        .rrb-send {
          width: 100%; padding: 14px;
          border-radius: 16px; border: none;
          background: linear-gradient(135deg, #f43f5e, #be185d);
          color: white; font-weight: 800; font-size: 15px;
          cursor: pointer; font-family: 'Inter', sans-serif;
          box-shadow: 0 8px 24px rgba(190,24,93,0.35);
          transition: all 0.2s; letter-spacing: -0.01em;
        }
        .rrb-send:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 12px 30px rgba(190,24,93,0.5); }
        .rrb-send:disabled { opacity: 0.6; cursor: not-allowed; }
      `}</style>

      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            style={{
              background: 'linear-gradient(160deg, #13131f 0%, #0d0d1a 100%)',
              border: '1px solid rgba(244,63,94,0.3)',
              borderRadius: '28px',
              padding: '2.5rem 2rem',
              textAlign: 'center',
              boxShadow: '0 24px 60px rgba(0,0,0,0.6), 0 0 60px rgba(244,63,94,0.12)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Glow ring */}
            <div style={{
              position: 'absolute', top: -60, left: '50%', transform: 'translateX(-50%)',
              width: 240, height: 240, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(244,63,94,0.2) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />

            <motion.div
              initial={{ scale: 0.3, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 16, delay: 0.1 }}
              style={{ fontSize: '4rem', marginBottom: '1rem', display: 'inline-block' }}
            >
              {selected?.emoji}
            </motion.div>

            <motion.h3
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', margin: '0 0 0.5rem' }}
            >
              Your reply was sent! 💕
            </motion.h3>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6, margin: '0 auto', maxWidth: '320px' }}
            >
              {recipientName ? (
                <>The person who made this for <strong style={{ color: '#94a3b8' }}>{recipientName}</strong> will see your reaction on their dashboard.</>
              ) : (
                'The person who created this will see your heartfelt reaction on their dashboard.'
              )}
            </motion.p>

            {message && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                style={{
                  marginTop: '1.25rem', padding: '0.9rem 1.25rem',
                  background: 'rgba(244,63,94,0.08)',
                  border: '1px solid rgba(244,63,94,0.2)',
                  borderRadius: '14px', fontSize: '0.88rem',
                  color: '#e2e8f0', fontStyle: 'italic', lineHeight: 1.55,
                }}
              >
                &ldquo;{message}&rdquo;
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              background: 'linear-gradient(160deg, #13131f 0%, #0d0d1a 100%)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '28px',
              padding: '2rem 1.75rem',
              boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
            }}
          >
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <span style={{
                display: 'inline-block', fontSize: '0.68rem', fontWeight: 800,
                color: '#f43f5e', letterSpacing: '0.15em', textTransform: 'uppercase',
                background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.25)',
                padding: '4px 12px', borderRadius: '999px', marginBottom: '0.75rem',
              }}>
                ♥ Send your reaction
              </span>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff', margin: '0 0 0.35rem', lineHeight: 1.25 }}>
                {recipientName ? `How did this make you feel, ${recipientName}?` : 'How did this make you feel?'}
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
                Tap a reaction — it goes straight to their heart 💌
              </p>
            </div>

            {/* Emoji pill grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '1.25rem' }}>
              {REACTION_OPTIONS.map((opt) => (
                <button
                  key={opt.emoji}
                  type="button"
                  className={`rrb-pill${selected?.emoji === opt.emoji ? ' active' : ''}`}
                  onClick={() => setSelected(opt)}
                >
                  <span className="rrb-emoji">{opt.emoji}</span>
                  <span style={{ lineHeight: 1.2, fontSize: '12.5px' }}>{opt.label}</span>
                </button>
              ))}
            </div>

            {/* Optional text reply */}
            <AnimatePresence>
              {selected && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  style={{ overflow: 'hidden', marginBottom: '1rem' }}
                >
                  <textarea
                    className="rrb-textarea"
                    rows={2}
                    placeholder={`Write a sweet reply… (optional)`}
                    value={message}
                    maxLength={300}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <div style={{ textAlign: 'right', fontSize: '11px', color: '#475569', marginTop: '4px' }}>
                    {message.length}/300
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="button"
              className="rrb-send"
              disabled={!selected || sending}
              onClick={handleSend}
            >
              {sending ? 'Sending…' : selected ? `Send Reaction ${selected.emoji}` : 'Pick a reaction above'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
