'use client';

import React from 'react';
import { motion } from 'framer-motion';

/**
 * Luxury Gold Emblem & Insignia
 * Replaces cartoon stickers with high-end, 24K gold foil luxury crests and romantic seals.
 */
export default function WholesomeMemeSticker({
  type = 'crest',
  title = '',
  caption = '',
  subtitle = '',
  size = 80,
  className = '',
}) {
  const displayCaption = caption || title || subtitle || 'Handcrafted Forever';

  return (
    <motion.div
      whileHover={{ scale: 1.05, rotate: 1 }}
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '12px 18px',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(245, 158, 11, 0.25)',
        borderRadius: '20px',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.35)',
      }}
      className={className}
    >
      <div
        style={{
          width: size,
          height: size,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, rgba(0,0,0,0) 70%)',
        }}
      >
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="44" stroke="url(#goldGrad)" strokeWidth="1.5" strokeDasharray="3 3" />
          <circle cx="50" cy="50" r="38" stroke="url(#goldGrad)" strokeWidth="1" />
          <path
            d="M50 22 L53 38 L68 35 L57 46 L68 58 L53 55 L50 71 L47 55 L32 58 L43 46 L32 35 L47 38 Z"
            fill="url(#goldGrad)"
            opacity="0.85"
          />
          <circle cx="50" cy="46" r="3" fill="#ffffff" />
          <defs>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {displayCaption && (
        <span
          style={{
            fontFamily: 'serif',
            fontSize: '0.78rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#fbbf24',
            fontWeight: 600,
            textAlign: 'center',
          }}
        >
          ✦ {displayCaption} ✦
        </span>
      )}
    </motion.div>
  );
}
