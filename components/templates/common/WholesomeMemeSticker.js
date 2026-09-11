'use client';

import React from 'react';
import { motion } from 'framer-motion';

/**
 * Wholesome Curated Couple/Friendship Animated Meme Stickers
 * Adds comedic, highly engaging emotional touchpoints to the experience.
 */
export default function WholesomeMemeSticker({
  type = 'food_steal',
  title = '',
  subtitle = '',
  size = 140,
  className = '',
  interactive = true,
}) {
  const stickers = {
    // Stealing Food / Fries meme
    food_steal: {
      svg: (
        <svg width={size} height={size} viewBox="0 0 160 160" fill="none">
          <circle cx="80" cy="80" r="72" fill="#fff1f2" stroke="#f43f5e" strokeWidth="4" />
          {/* French fries bag */}
          <polygon points="50,60 110,60 100,125 60,125" fill="#f43f5e" />
          <path d="M70,60 L70,30 M80,60 L80,20 M90,60 L90,25 M60,60 L55,35 M100,60 L105,35" stroke="#fbbf24" strokeWidth="6" strokeLinecap="round" />
          {/* Sneaky cat/bear paw */}
          <path d="M25,85 Q50,75 75,70" stroke="#fda4af" strokeWidth="12" strokeLinecap="round" />
          <circle cx="75" cy="70" r="8" fill="#fda4af" />
          <circle cx="70" cy="62" r="4" fill="#fda4af" />
          <circle cx="80" cy="64" r="4" fill="#fda4af" />
          {/* Meme text */}
          <rect x="25" y="115" width="110" height="28" rx="8" fill="#1e1b4b" />
          <text x="80" y="134" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="800" fontFamily="sans-serif">
            "JUST 1 BITE" 🍟
          </text>
        </svg>
      ),
      tagline: 'Exhibit A: When you say you aren\'t hungry',
    },

    // 3AM Sleepy Calls / Drama
    sleepy_call: {
      svg: (
        <svg width={size} height={size} viewBox="0 0 160 160" fill="none">
          <circle cx="80" cy="80" r="72" fill="#f5f3ff" stroke="#8b5cf6" strokeWidth="4" />
          {/* Moon and clouds */}
          <path d="M100,35 A30,30 0 0,0 80,75 A35,35 0 0,1 100,35" fill="#fef08a" />
          {/* Snoozing phone */}
          <rect x="55" y="55" width="50" height="75" rx="8" fill="#1e1b4b" stroke="#c4b5fd" strokeWidth="3" />
          <circle cx="80" cy="90" r="14" fill="#ec4899" />
          <path d="M75,90 Q80,95 85,90" stroke="#ffffff" strokeWidth="2" fill="none" strokeLinecap="round" />
          <text x="75" y="86" fill="#ffffff" fontSize="8">😴</text>
          {/* Zzz */}
          <text x="112" y="55" fill="#8b5cf6" fontSize="16" fontWeight="bold" fontFamily="cursive">Z</text>
          <text x="122" y="42" fill="#8b5cf6" fontSize="12" fontWeight="bold" fontFamily="cursive">z</text>
          {/* Banner */}
          <rect x="20" y="125" width="120" height="26" rx="6" fill="#4c1d95" />
          <text x="80" y="142" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="800" fontFamily="sans-serif">
            "NO YOU HANG UP FIRST"
          </text>
        </svg>
      ),
      tagline: 'Exhibit B: Our 3:00 AM sleepy philosophy talks',
    },

    // Panicked Dodging NO button meme
    dodge_panic: {
      svg: (
        <svg width={size} height={size} viewBox="0 0 160 160" fill="none">
          <circle cx="80" cy="80" r="72" fill="#fef2f2" stroke="#ef4444" strokeWidth="4" />
          {/* Sweating crying face */}
          <circle cx="80" cy="80" r="42" fill="#fef08a" stroke="#ca8a04" strokeWidth="3" />
          <ellipse cx="68" cy="72" rx="5" ry="7" fill="#1f2937" />
          <ellipse cx="92" cy="72" rx="5" ry="7" fill="#1f2937" />
          {/* Sweat drop */}
          <path d="M108,60 C108,60 116,70 116,74 C116,78 112,82 108,82 C104,82 100,78 100,74 C100,70 108,60 108,60 Z" fill="#38bdf8" />
          {/* Wavy mouth */}
          <path d="M66,95 Q73,90 80,95 Q87,100 94,95" stroke="#713f12" strokeWidth="3" fill="none" strokeLinecap="round" />
          {/* Banner */}
          <rect x="20" y="125" width="120" height="26" rx="6" fill="#991b1b" />
          <text x="80" y="142" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="800" fontFamily="sans-serif">
            "ERROR 404: NO NOT FOUND"
          </text>
        </svg>
      ),
      tagline: 'Warning: NO button has fled the chat',
    },

    // Big Hug / Squeeze meme
    bear_hug: {
      svg: (
        <svg width={size} height={size} viewBox="0 0 160 160" fill="none">
          <circle cx="80" cy="80" r="72" fill="#eff6ff" stroke="#3b82f6" strokeWidth="4" />
          {/* Two hugging soft spheres */}
          <circle cx="68" cy="82" r="32" fill="#fed7aa" stroke="#ea580c" strokeWidth="3" />
          <circle cx="92" cy="80" r="30" fill="#fbcfe8" stroke="#db2777" strokeWidth="3" />
          {/* Closed happy eyes */}
          <path d="M58,78 Q64,74 70,78" stroke="#7c2d12" strokeWidth="2.5" fill="none" />
          <path d="M88,76 Q94,72 100,76" stroke="#831843" strokeWidth="2.5" fill="none" />
          {/* Hug arms wrapping */}
          <path d="M42,88 Q70,105 100,88" stroke="#ea580c" strokeWidth="6" strokeLinecap="round" fill="none" />
          <path d="M118,85 Q90,105 60,86" stroke="#db2777" strokeWidth="6" strokeLinecap="round" fill="none" />
          {/* Floating tiny sparkles */}
          <polygon points="80,45 83,52 90,55 83,58 80,65 77,58 70,55 77,52" fill="#fbbf24" />
          {/* Banner */}
          <rect x="25" y="125" width="110" height="26" rx="6" fill="#1d4ed8" />
          <text x="80" y="142" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="800" fontFamily="sans-serif">
            "AGGRESSIVE WARM HUG"
          </text>
        </svg>
      ),
      tagline: 'Incoming 10,000 Joules of Virtual Hug Energy',
    },
  };

  const active = stickers[type] || stickers.food_steal;

  return (
    <motion.div
      className={`wholesome-meme-card ${className}`}
      whileHover={interactive ? { scale: 1.05, rotate: [-1, 2, 0] } : {}}
      whileTap={interactive ? { scale: 0.95 } : {}}
      transition={{ type: 'spring', stiffness: 350, damping: 20 }}
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '14px',
        borderRadius: '24px',
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(16px)',
        border: '1.5px solid rgba(255, 255, 255, 0.6)',
        boxShadow: '0 16px 36px rgba(0,0,0,0.08), 0 0 20px rgba(251, 113, 133, 0.15)',
        cursor: interactive ? 'pointer' : 'default',
        maxWidth: '220px',
        textAlign: 'center',
      }}
    >
      <div style={{ filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.08))' }}>
        {active.svg}
      </div>

      {(title || active.tagline) && (
        <span
          style={{
            marginTop: '10px',
            fontSize: '0.82rem',
            fontWeight: 700,
            color: '#374151',
            lineHeight: 1.4,
          }}
        >
          {title || active.tagline}
        </span>
      )}

      {subtitle && (
        <span
          style={{
            marginTop: '4px',
            fontSize: '0.72rem',
            color: '#6b7280',
            fontWeight: 500,
          }}
        >
          {subtitle}
        </span>
      )}
    </motion.div>
  );
}
