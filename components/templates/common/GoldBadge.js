'use client';

import React from 'react';

/**
 * Luxury Gold & Rose Gold Vector Icons & Badges
 * Eliminates cheap raw unicode emojis in favor of crisp SVG assets.
 */
export default function GoldBadge({ name, size = 28, className = '', glow = true }) {
  const glowStyle = glow
    ? { filter: 'drop-shadow(0 2px 8px rgba(245, 158, 11, 0.45))' }
    : {};

  const icons = {
    // Ring / Proposal
    ring: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={glowStyle} className={className}>
        <circle cx="12" cy="14" r="7" stroke="url(#goldGrad)" strokeWidth="2.5" />
        <polygon points="12,2 16,6 12,9 8,6" fill="url(#sparkleGrad)" stroke="#fef08a" strokeWidth="1" />
        <path d="M10 5L14 5" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
        <defs>
          <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>
          <linearGradient id="sparkleGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#e0e7ff" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
        </defs>
      </svg>
    ),

    // Crown / VIP
    crown: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={glowStyle} className={className}>
        <path
          d="M3 18h18l-2-10-4.5 4L12 4l-2.5 8L5 8l-2 10z"
          fill="url(#goldGrad)"
          stroke="#fef08a"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="4" r="1.5" fill="#ffffff" />
        <circle cx="3" cy="8" r="1.5" fill="#ffffff" />
        <circle cx="21" cy="8" r="1.5" fill="#ffffff" />
        <defs>
          <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>
        </defs>
      </svg>
    ),

    // Champagne Flutes / Toast
    toast: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={glowStyle} className={className}>
        <path d="M7 4l4 7v6h2v-6l4-7H7z" fill="url(#goldGrad)" stroke="#fef08a" strokeWidth="1.2" />
        <line x1="9" y1="21" x2="15" y2="21" stroke="url(#goldGrad)" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="10" cy="7" r="1" fill="#ffffff" />
        <circle cx="14" cy="6" r="1.2" fill="#ffffff" />
        <circle cx="12" cy="9" r="0.8" fill="#ffffff" />
        <defs>
          <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>
        </defs>
      </svg>
    ),

    // Birthday Cake
    cake: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={glowStyle} className={className}>
        <rect x="4" y="12" width="16" height="8" rx="2" fill="url(#pinkRoseGrad)" stroke="#fda4af" strokeWidth="1.5" />
        <rect x="6" y="8" width="12" height="4" rx="1.5" fill="url(#goldGrad)" stroke="#fef08a" strokeWidth="1.2" />
        <line x1="12" y1="8" x2="12" y2="4" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="12" cy="3" r="1.5" fill="#f43f5e" />
        <path d="M4 14c1.5 1 2.5-1 4 0s2.5-1 4 0 2.5-1 4 0 2.5-1 4 0" stroke="#ffffff" strokeWidth="1.5" fill="none" />
        <defs>
          <linearGradient id="pinkRoseGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fb7185" />
            <stop offset="100%" stopColor="#be123c" />
          </linearGradient>
          <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>
        </defs>
      </svg>
    ),

    // Wax Seal
    waxSeal: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={glowStyle} className={className}>
        <circle cx="12" cy="12" r="9" fill="url(#rubyGrad)" stroke="#fecdd3" strokeWidth="1.5" />
        <path d="M12 7.5C10.5 5.5 7.5 6.5 7.5 9c0 3 4.5 5.5 4.5 5.5s4.5-2.5 4.5-5.5c0-2.5-3-3.5-4.5-1.5z" fill="#ffffff" opacity="0.9" />
        <defs>
          <linearGradient id="rubyGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#e11d48" />
            <stop offset="50%" stopColor="#9f1239" />
            <stop offset="100%" stopColor="#4c0519" />
          </linearGradient>
        </defs>
      </svg>
    ),

    // Star Sparkle
    sparkle: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={glowStyle} className={className}>
        <path
          d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
          fill="url(#sparkleGoldGrad)"
          stroke="#ffffff"
          strokeWidth="0.8"
        />
        <defs>
          <linearGradient id="sparkleGoldGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="40%" stopColor="#fef08a" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </defs>
      </svg>
    ),

    // Glowing Heart
    heart: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={glowStyle} className={className}>
        <path
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          fill="url(#heartRoseGrad)"
          stroke="#fff1f2"
          strokeWidth="1.2"
        />
        <defs>
          <linearGradient id="heartRoseGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fb7185" />
            <stop offset="60%" stopColor="#e11d48" />
            <stop offset="100%" stopColor="#9f1239" />
          </linearGradient>
        </defs>
      </svg>
    ),

    // Distance Compass / Radar
    compass: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={glowStyle} className={className}>
        <circle cx="12" cy="12" r="9" stroke="url(#cyanGrad)" strokeWidth="2" />
        <polygon points="12,6 15,12 12,11 9,12" fill="#38bdf8" />
        <polygon points="12,18 15,12 12,13 9,12" fill="#0284c7" />
        <circle cx="12" cy="12" r="1.5" fill="#ffffff" />
        <defs>
          <linearGradient id="cyanGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7dd3fc" />
            <stop offset="100%" stopColor="#0369a1" />
          </linearGradient>
        </defs>
      </svg>
    ),

    // Origami Crane (Apology / Healing)
    crane: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={glowStyle} className={className}>
        <path d="M2 14L8 8L12 18L16 6L22 12L12 14L2 14Z" fill="url(#craneGrad)" stroke="#ffffff" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M8 8L12 14L16 6" stroke="#fbcfe8" strokeWidth="1.2" />
        <defs>
          <linearGradient id="craneGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fbcfe8" />
            <stop offset="50%" stopColor="#f472b6" />
            <stop offset="100%" stopColor="#db2777" />
          </linearGradient>
        </defs>
      </svg>
    ),

    // Cassette Tape (Memory / I Miss You)
    cassette: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={glowStyle} className={className}>
        <rect x="2" y="5" width="20" height="14" rx="2" fill="#1e1b4b" stroke="#818cf8" strokeWidth="1.5" />
        <rect x="5" y="8" width="14" height="6" rx="1" fill="#312e81" />
        <circle cx="8.5" cy="11" r="2" stroke="#c7d2fe" strokeWidth="1.5" />
        <circle cx="15.5" cy="11" r="2" stroke="#c7d2fe" strokeWidth="1.5" />
        <line x1="8.5" y1="11" x2="15.5" y2="11" stroke="#818cf8" strokeWidth="1" strokeDasharray="1 1" />
      </svg>
    ),

    // Candle Flame
    candle: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={glowStyle} className={className}>
        <rect x="8" y="10" width="8" height="11" rx="1.5" fill="url(#candleBody)" stroke="#fef08a" strokeWidth="1.2" />
        <line x1="12" y1="10" x2="12" y2="7" stroke="#78350f" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M12 2C10.5 4 10 5.5 12 7C14 5.5 13.5 4 12 2Z" fill="url(#flameGrad)" />
        <defs>
          <linearGradient id="candleBody" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fffbeb" />
            <stop offset="100%" stopColor="#fde68a" />
          </linearGradient>
          <linearGradient id="flameGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
        </defs>
      </svg>
    ),
  };

  return icons[name] || icons.sparkle;
}
