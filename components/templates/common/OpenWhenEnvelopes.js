'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GoldBadge from './GoldBadge';

/**
 * 5 Interactive "Open When..." Virtual Envelopes
 * Categories: When you miss me, When you have a bad day, When you can't sleep, When you need a smile, When you want to hear from me
 */
export default function OpenWhenEnvelopes({ envelopes = [] }) {
  const [selectedIdx, setSelectedIdx] = useState(null);

  const defaultEnvelopes = [
    { title: 'Open when you miss me...', icon: 'heart', message: 'Close your eyes for 5 seconds and take a deep breath. I am thinking of you right now, and the distance between us is only temporary.' },
    { title: 'Open when you had a bad day...', icon: 'sparkle', message: 'Remember how resilient and extraordinary you are. One bad day does not define your story. Tomorrow is a brand new sunrise, and I am always in your corner.' },
    { title: 'Open when you can\'t sleep...', icon: 'cassette', message: 'Put on our favorite song and imagine us walking quietly under the night sky. Sleep peacefully knowing you are safe in my heart.' },
    { title: 'Open when you need a smile...', icon: 'crown', message: 'Remember the time you stole my food, laughed so hard tears came out, and swore it was just a taste? You are my greatest joy.' },
    { title: 'Open when you doubt us...', icon: 'waxSeal', message: 'Never doubt the strength of what we built. No miles, no busy days, and no obstacles can ever diminish how deeply you matter to me.' },
  ];

  const items = envelopes.length > 0 ? envelopes : defaultEnvelopes;

  return (
    <div style={{ width: '100%', maxWidth: '520px', margin: '0 auto', textAlign: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1.5rem' }}>
        {items.map((env, idx) => {
          const isOpen = selectedIdx === idx;
          return (
            <motion.div
              key={idx}
              onClick={() => setSelectedIdx(isOpen ? null : idx)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                background: isOpen
                  ? 'linear-gradient(135deg, rgba(244, 63, 94, 0.2), rgba(190, 18, 93, 0.35))'
                  : 'rgba(15, 23, 42, 0.75)',
                border: isOpen ? '2px solid #f43f5e' : '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '18px',
                padding: '16px 20px',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: isOpen ? '0 0 20px rgba(244, 63, 94, 0.35)' : 'none',
                transition: 'all 0.3s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <GoldBadge name={env.icon || 'waxSeal'} size={24} />
                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: isOpen ? '#fecdd3' : '#ffffff' }}>
                  {env.title}
                </span>
              </div>
              <span style={{ fontSize: '0.78rem', color: '#fb7185', fontWeight: 800 }}>
                {isOpen ? '▲ CLOSE' : '▼ OPEN'}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Expanded Envelope Modal / Card */}
      <AnimatePresence mode="wait">
        {selectedIdx !== null && (
          <motion.div
            key={selectedIdx}
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            style={{
              background: '#ffffff',
              borderRadius: '24px',
              padding: '2rem 1.75rem',
              color: '#1e293b',
              boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
              border: '2px solid #fbcfe8',
              textAlign: 'left',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1.5px dashed #f43f5e', paddingBottom: '10px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#be185d', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {items[selectedIdx].title}
              </span>
              <button
                type="button"
                onClick={() => setSelectedIdx(null)}
                style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#9ca3af' }}
              >
                ✕
              </button>
            </div>

            <p
              style={{
                fontFamily: 'var(--font-caveat), "Caveat", Georgia, serif',
                fontSize: '1.4rem',
                color: '#334155',
                lineHeight: 1.5,
                margin: '0 0 1rem',
              }}
            >
              {items[selectedIdx].message}
            </p>

            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#9d174d', display: 'block', textAlign: 'right' }}>
              ✦ Wrapped with unconditional love ✦
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
