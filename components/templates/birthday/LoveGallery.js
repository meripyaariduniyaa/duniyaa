'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

const POSITIONS = [
  { top: '8%', left: '8%', rotate: -6 },
  { top: '12%', right: '10%', rotate: 8 },
  { top: '38%', left: '12%', rotate: 5 },
  { top: '42%', right: '8%', rotate: -7 },
  { top: '64%', left: '16%', rotate: -8 },
  { top: '66%', right: '14%', rotate: 6 },
];

const DEFAULT_CAPTIONS = [
  'Our memory 🥹',
  'Beautiful ✨',
  'My favourite 💕',
  'Pure joy 😊',
  'Sunshine ☀️',
  'Magical 🌸',
];

export default function LoveGallery({ photos = [], captions = [] }) {
  const [activePhoto, setActivePhoto] = useState(null);

  const photoList = photos.length > 0 ? photos : [
    'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600&auto=format&fit=crop&q=80',
  ];

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        background: '#e8e2d5',
        backgroundImage: 'radial-gradient(rgba(140,125,105,0.2) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    >
      {/* Decorative corkboard corner accents */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(circle, transparent 40%, rgba(0,0,0,0.12) 100%)' }} />

      {/* Draggable Polaroid Cards */}
      {photoList.slice(0, POSITIONS.length).map((photo, idx) => {
        const pos = POSITIONS[idx % POSITIONS.length];
        const caption = captions[idx] || DEFAULT_CAPTIONS[idx % DEFAULT_CAPTIONS.length];

        return (
          <motion.div
            key={idx}
            drag
            dragConstraints={{ top: -150, left: -150, right: 150, bottom: 150 }}
            dragElastic={0.2}
            whileHover={{ scale: 1.08, zIndex: 30 }}
            whileTap={{ scale: 1.04, cursor: 'grabbing', zIndex: 40 }}
            style={{
              position: 'absolute',
              top: pos.top,
              left: pos.left,
              right: pos.right,
              rotate: `${pos.rotate}deg`,
              zIndex: 10 + idx,
              cursor: 'grab',
              touchAction: 'none',
            }}
            onClick={() => setActivePhoto({ photo, caption })}
          >
            {/* Polaroid card */}
            <div
              style={{
                background: '#fff',
                padding: '10px 10px 14px',
                borderRadius: 8,
                boxShadow: '0 12px 28px rgba(50,40,30,0.22), 0 2px 6px rgba(0,0,0,0.1)',
                width: 140,
                position: 'relative',
                border: '1px solid rgba(0,0,0,0.06)',
              }}
            >
              {/* Red Push Pin */}
              <div
                style={{
                  position: 'absolute',
                  top: -10,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle at 35% 35%, #ff4d4d, #b91c1c)',
                  boxShadow: '0 3px 6px rgba(0,0,0,0.3)',
                  zIndex: 2,
                }}
              />

              <div style={{ width: 120, height: 120, borderRadius: 4, overflow: 'hidden', background: '#f3f4f6' }}>
                <img
                  src={photo}
                  alt={caption}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', pointerEvents: 'none' }}
                  draggable={false}
                />
              </div>

              <p
                style={{
                  fontFamily: 'var(--font-dancing), "Dancing Script", cursive',
                  fontSize: '0.95rem',
                  color: '#4b5563',
                  textAlign: 'center',
                  margin: '8px 0 0',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  pointerEvents: 'none',
                }}
              >
                {caption}
              </p>
            </div>
          </motion.div>
        );
      })}

      {/* Expanded Photo Modal */}
      {activePhoto && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setActivePhoto(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(6px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            cursor: 'pointer',
          }}
        >
          <motion.div
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#fff',
              padding: '16px 16px 20px',
              borderRadius: 16,
              maxWidth: 340,
              width: '100%',
              boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
              textAlign: 'center',
            }}
          >
            <div style={{ width: '100%', aspectRatio: '1', borderRadius: 10, overflow: 'hidden', marginBottom: 12 }}>
              <img src={activePhoto.photo} alt={activePhoto.caption} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <p style={{ fontFamily: 'var(--font-dancing), "Dancing Script", cursive', fontSize: '1.4rem', color: '#1f2937', margin: '4px 0 14px' }}>
              {activePhoto.caption}
            </p>
            <button
              onClick={() => setActivePhoto(null)}
              style={{
                border: 'none',
                padding: '8px 24px',
                borderRadius: 999,
                background: '#db2777',
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              Close ✕
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
