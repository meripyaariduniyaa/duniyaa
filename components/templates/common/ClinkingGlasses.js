'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import GoldBadge from './GoldBadge';

/**
 * Clinking Champagne Glasses
 * Drag or tap to make the glasses clink with toast sparkles & sound.
 */
export default function ClinkingGlasses({ onClink, recipientName = 'You' }) {
  const [clinked, setClinked] = useState(false);

  const handleClink = () => {
    setClinked(true);
    if (onClink) onClink();
  };

  return (
    <div style={{ textAlign: 'center', margin: '2rem auto', maxWidth: '420px' }}>
      <div
        onClick={handleClink}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: clinked ? '0px' : '40px',
          background: 'rgba(255,255,255,0.07)',
          padding: '2.5rem 3rem',
          borderRadius: '30px',
          border: '2px solid rgba(251, 191, 36, 0.4)',
          boxShadow: clinked ? '0 0 50px rgba(245, 158, 11, 0.5)' : '0 15px 35px rgba(0,0,0,0.3)',
          cursor: 'pointer',
          transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        {/* Left Glass */}
        <motion.div
          animate={{
            rotate: clinked ? [0, 18, 0] : 0,
            x: clinked ? 15 : 0,
          }}
          transition={{ duration: 0.5 }}
        >
          <GoldBadge name="toast" size={72} />
        </motion.div>

        {/* Right Glass */}
        <motion.div
          animate={{
            rotate: clinked ? [0, -18, 0] : 0,
            x: clinked ? -15 : 0,
          }}
          transition={{ duration: 0.5 }}
        >
          <GoldBadge name="toast" size={72} />
        </motion.div>
      </div>

      <div style={{ marginTop: '1.25rem' }}>
        <span
          style={{
            display: 'block',
            fontFamily: 'var(--font-dancing), cursive',
            fontSize: '1.8rem',
            color: '#fef08a',
            fontWeight: 700,
          }}
        >
          {clinked ? '✦ CLINK! To Us & Forever! ✦' : 'Tap glasses to toast together'}
        </span>
        <p style={{ color: '#cbd5e1', fontSize: '0.85rem', margin: '4px 0 0' }}>
          {clinked ? '“To everything we’ve been, and everything we’re still going to become.”' : `Raise a celebratory toast with ${recipientName}`}
        </p>
      </div>
    </div>
  );
}
