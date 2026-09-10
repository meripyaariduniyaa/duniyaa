'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DEFAULT_NOTES = [
  { id: 'n1', title: '01', text: "Every butterfly escapes... except me. I've been happily stuck with you since day one. 🤍", accent: '#E17B9B', emoji: '🦋' },
  { id: 'n2', title: '02', text: "Like a butterfly finding its flower, I always find my way back to you. 🫶", accent: '#D99B43', emoji: '✨' },
  { id: 'n3', title: '03', text: "You caught my attention like a butterfly in a garden — beautiful, graceful, impossible to ignore. 😭❤️", accent: '#72B06F', emoji: '🌸' },
  { id: 'n4', title: '04', text: "You're really good at catching hearts... no wonder you caught mine so easily. ❤️", accent: '#9E72C3', emoji: '💫' },
  { id: 'n5', title: '05', text: "This butterfly landed for just a moment... my heart chose to stay with you forever. 🦋", accent: '#5B9BD5', emoji: '💌' },
];

// Pre-defined responsive floating trajectories for each of the 5 butterflies
const BUTTERFLY_PATHS = [
  {
    initial: { x: '15%', y: '20%', rotate: -8 },
    animate: {
      x: ['15%', '65%', '35%', '80%', '15%'],
      y: ['20%', '35%', '65%', '45%', '20%'],
      rotate: [-8, 12, -10, 15, -8],
    },
    duration: 16,
  },
  {
    initial: { x: '70%', y: '18%', rotate: 10 },
    animate: {
      x: ['70%', '25%', '60%', '15%', '70%'],
      y: ['18%', '50%', '25%', '60%', '18%'],
      rotate: [10, -14, 8, -12, 10],
    },
    duration: 19,
  },
  {
    initial: { x: '40%', y: '60%', rotate: -5 },
    animate: {
      x: ['40%', '75%', '20%', '50%', '40%'],
      y: ['60%', '22%', '40%', '72%', '60%'],
      rotate: [-5, 15, -12, 8, -5],
    },
    duration: 17,
  },
  {
    initial: { x: '20%', y: '72%', rotate: 12 },
    animate: {
      x: ['20%', '60%', '80%', '30%', '20%'],
      y: ['72%', '38%', '68%', '28%', '72%'],
      rotate: [12, -8, 14, -6, 12],
    },
    duration: 21,
  },
  {
    initial: { x: '75%', y: '65%', rotate: -10 },
    animate: {
      x: ['75%', '30%', '55%', '15%', '75%'],
      y: ['65%', '68%', '15%', '40%', '65%'],
      rotate: [-10, 14, -8, 10, -10],
    },
    duration: 18,
  },
];

function ButterflySVG({ accent = '#E17B9B', size = 52 }) {
  return (
    <div style={{ width: size, height: size, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg viewBox="0 0 64 64" width={size} height={size} style={{ filter: `drop-shadow(0 4px 10px ${accent}66)` }}>
        {/* Left Wing */}
        <motion.path
          d="M32 32 C24 12, 4 8, 4 24 C4 36, 20 40, 32 34 Z"
          fill={accent}
          fillOpacity={0.88}
          stroke="#fff"
          strokeWidth={1}
          animate={{ scaleX: [1, 0.25, 1], rotate: [0, -6, 0] }}
          transition={{ duration: 0.35, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '32px 32px' }}
        />
        <motion.path
          d="M32 34 C22 38, 8 42, 8 52 C8 60, 24 56, 32 38 Z"
          fill={accent}
          fillOpacity={0.72}
          stroke="#fff"
          strokeWidth={0.8}
          animate={{ scaleX: [1, 0.3, 1], rotate: [0, -4, 0] }}
          transition={{ duration: 0.35, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '32px 34px' }}
        />
        {/* Right Wing */}
        <motion.path
          d="M32 32 C40 12, 60 8, 60 24 C60 36, 44 40, 32 34 Z"
          fill={accent}
          fillOpacity={0.88}
          stroke="#fff"
          strokeWidth={1}
          animate={{ scaleX: [1, 0.25, 1], rotate: [0, 6, 0] }}
          transition={{ duration: 0.35, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '32px 32px' }}
        />
        <motion.path
          d="M32 34 C42 38, 56 42, 56 52 C56 60, 40 56, 32 38 Z"
          fill={accent}
          fillOpacity={0.72}
          stroke="#fff"
          strokeWidth={0.8}
          animate={{ scaleX: [1, 0.3, 1], rotate: [0, 4, 0] }}
          transition={{ duration: 0.35, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '32px 34px' }}
        />
        {/* Butterfly Body */}
        <ellipse cx="32" cy="33" rx="2.5" ry="12" fill="#2d1a24" />
        <circle cx="32" cy="20" r="3" fill="#2d1a24" />
        {/* Antennae */}
        <path d="M31 18 Q25 10, 22 11" stroke="#2d1a24" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        <path d="M33 18 Q39 10, 42 11" stroke="#2d1a24" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export default function FloatingNotes({ notes }) {
  const [activeNote, setActiveNote] = useState(null);
  const [openedIds, setOpenedIds] = useState(new Set());

  const list = notes && notes.length > 0 ? notes : DEFAULT_NOTES;

  const handleOpen = (note) => {
    setActiveNote(note);
    setOpenedIds(prev => new Set([...prev, note.id]));
  };

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {/* Floating butterflies */}
      {list.slice(0, 5).map((note, i) => {
        const path = BUTTERFLY_PATHS[i % BUTTERFLY_PATHS.length];
        const isDiscovered = openedIds.has(note.id);

        return (
          <motion.div
            key={note.id || i}
            initial={path.initial}
            animate={path.animate}
            transition={{
              duration: path.duration,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              position: 'absolute',
              pointerEvents: 'auto',
              cursor: 'pointer',
              zIndex: 10,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleOpen(note)}
          >
            <ButterflySVG accent={note.accent || '#E17B9B'} size={48} />
            <div
              style={{
                marginTop: -4,
                background: 'rgba(255,255,255,0.92)',
                backdropFilter: 'blur(4px)',
                borderRadius: 12,
                padding: '2px 8px',
                fontSize: '0.65rem',
                fontWeight: 700,
                color: '#831843',
                boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                border: `1px solid ${note.accent || '#E17B9B'}44`,
                display: 'flex',
                alignItems: 'center',
                gap: 3,
              }}
            >
              <span>{isDiscovered ? '✓' : '💌'}</span>
              <span>Note #{note.title || (i + 1)}</span>
            </div>
          </motion.div>
        );
      })}

      {/* Note modal dialog */}
      <AnimatePresence>
        {activeNote && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveNote(null)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(20, 10, 20, 0.72)',
              backdropFilter: 'blur(6px)',
              zIndex: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.25rem',
              pointerEvents: 'auto',
            }}
          >
            <motion.div
              initial={{ scale: 0.85, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.85, y: 20, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: '#fffaf0',
                borderRadius: 24,
                border: `2px solid ${activeNote.accent || '#db2777'}55`,
                boxShadow: '0 20px 50px rgba(0,0,0,0.35), 0 0 25px rgba(219,39,119,0.2)',
                padding: '1.75rem 1.5rem',
                maxWidth: 380,
                width: '100%',
                position: 'relative',
                textAlign: 'left',
              }}
            >
              {/* Top Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>🦋</span>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: activeNote.accent || '#be185d' }}>
                      Secret Note #{activeNote.title}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#9d174d', opacity: 0.75 }}>
                      Caught with love ✨
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setActiveNote(null)}
                  style={{
                    border: 'none',
                    background: 'rgba(0,0,0,0.06)',
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#6b7280',
                    fontSize: '1rem',
                    fontWeight: 700,
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Note Content */}
              <div
                style={{
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  fontSize: '1.05rem',
                  lineHeight: 1.7,
                  color: '#4a1525',
                  padding: '1rem',
                  background: 'rgba(255,255,255,0.7)',
                  borderRadius: 16,
                  border: '1px dashed rgba(219,39,119,0.25)',
                  marginBottom: '1.25rem',
                }}
              >
                &ldquo;{activeNote.text}&rdquo;
              </div>

              {/* Close / Action Button */}
              <button
                onClick={() => setActiveNote(null)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: 999,
                  border: 'none',
                  background: 'linear-gradient(135deg, #db2777, #be185d)',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  boxShadow: '0 6px 20px rgba(219,39,119,0.3)',
                }}
              >
                Catch More Butterflies 🌸
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
