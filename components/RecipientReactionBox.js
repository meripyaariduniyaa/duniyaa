'use client';

import { useState } from 'react';

const REACTION_OPTIONS = [
  { emoji: '🥺', label: 'Touched & emotional' },
  { emoji: '❤️', label: 'Love you forever' },
  { emoji: '🥰', label: 'You made my day' },
  { emoji: '💍', label: 'YES, 1000x YES!' },
  { emoji: '✨', label: 'Thank you so much' },
  { emoji: '🤗', label: 'Sending a huge hug' },
];

export default function RecipientReactionBox({ noteId, recipientName }) {
  const [selectedEmoji, setSelectedEmoji] = useState('❤️');
  const [selectedLabel, setSelectedLabel] = useState('Love you forever');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSelect = (option) => {
    setSelectedEmoji(option.emoji);
    setSelectedLabel(option.label);
  };

  const handleSendReaction = async (e) => {
    e?.preventDefault();
    if (!noteId || sending || submitted) return;

    setSending(true);
    try {
      await fetch('/api/reactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          noteId,
          action: 'react',
          reactionEmoji: selectedEmoji,
          reactionLabel: selectedLabel,
          reactionMessage: message,
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
    <div className="reaction-box-container">
      <div className="reaction-box-card">
        {submitted ? (
          <div className="reaction-success-state">
            <div className="reaction-success-icon">{selectedEmoji}</div>
            <h3 className="success-heading">Your reply was sent!</h3>
            <p className="success-sub">
              The person who created this will see your heartfelt reaction on their dashboard.
            </p>
          </div>
        ) : (
          <>
            <div className="reaction-header">
              <span className="reaction-badge">♥ SEND A RESPONSE</span>
              <h3 className="reaction-title">How did this make you feel?</h3>
              <p className="reaction-desc">
                Tap a reaction or leave a sweet reply for them.
              </p>
            </div>

            <div className="reactions-pill-grid">
              {REACTION_OPTIONS.map((opt) => {
                const isActive = selectedEmoji === opt.emoji;
                return (
                  <button
                    key={opt.emoji}
                    type="button"
                    className={`reaction-pill ${isActive ? 'is-active' : ''}`}
                    onClick={() => handleSelect(opt)}
                  >
                    <span className="pill-emoji">{opt.emoji}</span>
                    <span className="pill-label">{opt.label}</span>
                  </button>
                );
              })}
            </div>

            <form onSubmit={handleSendReaction} className="reaction-form">
              <textarea
                className="reaction-textarea"
                rows={2}
                placeholder="Write a sweet reply back… (optional)"
                value={message}
                maxLength={300}
                onChange={(e) => setMessage(e.target.value)}
              />

              <button
                type="submit"
                disabled={sending}
                className="send-reaction-btn"
              >
                {sending ? 'Sending response…' : `Send Reply ${selectedEmoji}`}
              </button>
            </form>
          </>
        )}
      </div>

      <style jsx>{`
        .reaction-box-container {
          margin: 3rem auto 2rem;
          width: min(94vw, 560px);
        }

        .reaction-box-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border: 1.5px solid rgba(244, 63, 94, 0.25);
          border-radius: 24px;
          padding: 28px 22px;
          box-shadow: 0 20px 45px rgba(136, 19, 55, 0.1), 0 2px 10px rgba(0,0,0,0.04);
          text-align: center;
        }

        .reaction-badge {
          display: inline-block;
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.15em;
          color: #be185d;
          background: #ffe4e6;
          border: 1px solid rgba(244, 63, 94, 0.2);
          padding: 3px 12px;
          border-radius: 99px;
          margin-bottom: 8px;
        }

        .reaction-title {
          font-size: 1.35rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 4px;
        }

        .reaction-desc {
          font-size: 13px;
          color: #6b7280;
          margin: 0 0 18px;
        }

        .reactions-pill-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 8px;
          margin-bottom: 16px;
        }

        .reaction-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 12px;
          border: 1.5px solid #f3f4f6;
          background: #fafaf9;
          cursor: pointer;
          font-size: 12px;
          font-weight: 600;
          color: #374151;
          transition: all 0.18s ease;
          text-align: left;
        }

        .reaction-pill:hover {
          background: #fff1f2;
          border-color: #fecdd3;
          transform: translateY(-1px);
        }

        .reaction-pill.is-active {
          background: #fff1f2;
          border-color: #f43f5e;
          color: #be185d;
          box-shadow: 0 4px 12px rgba(244, 63, 94, 0.15);
        }

        .pill-emoji {
          font-size: 18px;
        }

        .pill-label {
          line-height: 1.2;
          font-size: 11.5px;
        }

        .reaction-form {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 8px;
        }

        .reaction-textarea {
          width: 100%;
          border: 1.5px solid #e5e7eb;
          border-radius: 12px;
          padding: 10px 14px;
          font-size: 13.5px;
          font-family: inherit;
          resize: none;
          outline: none;
          background: #fafaf9;
          transition: all 0.2s ease;
        }

        .reaction-textarea:focus {
          border-color: #f43f5e;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(244, 63, 94, 0.12);
        }

        .send-reaction-btn {
          padding: 12px 20px;
          border-radius: 12px;
          border: none;
          background: linear-gradient(135deg, #f43f5e, #be185d);
          color: white;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          box-shadow: 0 6px 18px rgba(190, 24, 93, 0.28);
          transition: all 0.2s ease;
        }

        .send-reaction-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(190, 24, 93, 0.38);
        }

        .reaction-success-state {
          padding: 16px 8px;
        }

        .reaction-success-icon {
          font-size: 48px;
          margin-bottom: 8px;
          animation: popSuccess 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .success-heading {
          font-size: 1.3rem;
          font-weight: 700;
          color: #be185d;
          margin: 0 0 6px;
        }

        .success-sub {
          font-size: 13px;
          color: #6b7280;
          max-width: 380px;
          margin: 0 auto;
          line-height: 1.5;
        }

        @keyframes popSuccess {
          0% { transform: scale(0.5); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
