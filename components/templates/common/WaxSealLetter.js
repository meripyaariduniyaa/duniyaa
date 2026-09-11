'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import GoldBadge from './GoldBadge';

/**
 * Handcrafted Parchment Letter with Interactive 3D Wax Seal Break & Typewriter Effect
 */
export default function WaxSealLetter({
  recipientName = '',
  senderName = '',
  message = '',
  date = '',
  onSealOpen,
}) {
  const [sealed, setSealed] = useState(true);
  const [typedMessage, setTypedMessage] = useState('');

  const defaultMsg = message || 'Every single moment with you has been a quiet blessing. Thank you for filling my world with light and infinite joy.';

  const handleBreakSeal = () => {
    setSealed(false);
    if (onSealOpen) onSealOpen();
  };

  useEffect(() => {
    if (!sealed) {
      setTypedMessage('');
      let index = 0;
      const timer = setInterval(() => {
        if (index < defaultMsg.length) {
          setTypedMessage((prev) => prev + defaultMsg.charAt(index));
          index++;
        } else {
          clearInterval(timer);
        }
      }, 25);
      return () => clearInterval(timer);
    }
  }, [sealed, defaultMsg]);

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '540px', margin: '0 auto', perspective: '1000px' }}>
      {sealed ? (
        /* Sealed Envelope / Letter Preview */
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.02 }}
          onClick={handleBreakSeal}
          style={{
            background: 'linear-gradient(135deg, #fffbeb, #fef3c7)',
            borderRadius: '24px',
            padding: '3rem 2rem',
            textAlign: 'center',
            cursor: 'pointer',
            border: '2px solid #fde68a',
            boxShadow: '0 25px 50px -12px rgba(180, 83, 9, 0.25), 0 0 0 1px rgba(251, 191, 36, 0.3)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Envelope flap lines */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '50%',
              borderBottom: '2px dashed rgba(217, 119, 6, 0.25)',
              pointerEvents: 'none',
            }}
          />

          <div style={{ position: 'relative', zIndex: 2 }}>
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              style={{ display: 'inline-block', marginBottom: '1rem' }}
            >
              <GoldBadge name="waxSeal" size={72} />
            </motion.div>

            <h3
              style={{
                fontFamily: 'var(--font-dancing), "Dancing Script", cursive',
                fontSize: '2rem',
                color: '#78350f',
                margin: '0 0 0.5rem',
              }}
            >
              Private Letter for {recipientName || 'You'}
            </h3>

            <p style={{ color: '#92400e', fontSize: '0.9rem', fontWeight: 600, margin: '0 0 1.25rem' }}>
              ✦ TAP WAX SEAL TO UNSEAL ✦
            </p>

            <span
              style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #b45309, #78350f)',
                color: '#ffffff',
                padding: '0.6rem 1.4rem',
                borderRadius: '99px',
                fontSize: '0.85rem',
                fontWeight: 700,
                boxShadow: '0 6px 16px rgba(180, 83, 9, 0.3)',
              }}
            >
              Break Wax Seal
            </span>
          </div>
        </motion.div>
      ) : (
        /* Unfolded Letter Content */
        <motion.div
          initial={{ opacity: 0, rotateX: -20, y: 30 }}
          animate={{ opacity: 1, rotateX: 0, y: 0 }}
          transition={{ duration: 0.6, type: 'spring', damping: 20 }}
          style={{
            background: '#ffffff',
            borderRadius: '24px',
            padding: '2.5rem 2rem',
            textAlign: 'left',
            border: '2px solid #fbcfe8',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.12), 0 0 40px rgba(244, 63, 94, 0.15)',
            position: 'relative',
          }}
        >
          {/* Header watermark crest */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1.5px solid #ffe4e6', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <GoldBadge name="crown" size={24} />
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#be185d', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Handwritten Note
              </span>
            </div>
            {date && <span style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: 600 }}>{date}</span>}
          </div>

          <h4
            style={{
              fontFamily: 'var(--font-dancing), "Dancing Script", cursive',
              fontSize: '1.8rem',
              color: '#881337',
              margin: '0 0 1rem',
            }}
          >
            Dearest {recipientName},
          </h4>

          <p
            style={{
              fontFamily: 'var(--font-caveat), "Caveat", Georgia, serif',
              fontSize: '1.35rem',
              color: '#334155',
              lineHeight: 1.6,
              minHeight: '140px',
              whiteSpace: 'pre-wrap',
            }}
          >
            {typedMessage}
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              style={{ display: 'inline-block', width: '2px', height: '1.2em', background: '#be185d', marginLeft: '3px', verticalAlign: 'text-bottom' }}
            />
          </p>

          {senderName && (
            <div style={{ marginTop: '2rem', textAlign: 'right', borderTop: '1px dashed #fce7f3', paddingTop: '1rem' }}>
              <span style={{ fontSize: '0.85rem', color: '#9d174d', display: 'block', fontWeight: 600 }}>Forever &amp; Always,</span>
              <span
                style={{
                  fontFamily: 'var(--font-dancing), "Dancing Script", cursive',
                  fontSize: '1.7rem',
                  color: '#be185d',
                  fontWeight: 700,
                }}
              >
                {senderName}
              </span>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
