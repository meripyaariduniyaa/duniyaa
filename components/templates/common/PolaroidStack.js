'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * 3D Interactive Polaroid Cards with Dynamic Lighting & Tilt
 * Turns uploaded photos or curated photos into physical keepsake polaroids.
 */
export default function PolaroidStack({
  photos = [],
  caption = '',
  maxDisplay = 4,
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  const defaultPhotos = [
    { url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800&auto=format&fit=crop', caption: 'The smile that changed everything' },
    { url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=800&auto=format&fit=crop', caption: 'Our late night talks & warm chai' },
    { url: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=800&auto=format&fit=crop', caption: 'Every memory feels like home' }
  ];

  const photoList = photos.length > 0
    ? photos.map((p, idx) => (typeof p === 'string' ? { url: p, caption: `Memory #${idx + 1}` } : p))
    : defaultPhotos;

  const currentPhoto = photoList[activeIndex % photoList.length];

  const nextPhoto = () => {
    setActiveIndex((prev) => (prev + 1) % photoList.length);
  };

  const prevPhoto = () => {
    setActiveIndex((prev) => (prev - 1 + photoList.length) % photoList.length);
  };

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '360px', margin: '0 auto', perspective: '1200px' }}>
      {/* Decorative fairy light string above */}
      <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '8px', padding: '0 20px' }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <motion.div
            key={i}
            animate={{
              opacity: [0.4, 1, 0.4],
              scale: [0.9, 1.2, 0.9],
            }}
            transition={{ duration: 1.8 + i * 0.3, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#fef08a',
              boxShadow: '0 0 10px #f59e0b, 0 0 20px #fbbf24',
            }}
          />
        ))}
      </div>

      {/* Main Polaroid Frame */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, rotate: -4, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, rotate: activeIndex % 2 === 0 ? 2 : -2, scale: 1, y: 0 }}
          exit={{ opacity: 0, rotate: 6, scale: 0.9, y: -15 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          whileHover={{ scale: 1.03, rotate: 0 }}
          style={{
            background: '#ffffff',
            padding: '14px 14px 22px 14px',
            borderRadius: '16px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0,0,0,0.05)',
            position: 'relative',
            cursor: 'pointer',
            overflow: 'hidden',
          }}
          onClick={nextPhoto}
        >
          {/* Subtle tape texture at top */}
          <div
            style={{
              position: 'absolute',
              top: '-8px',
              left: '50%',
              transform: 'translateX(-50%) rotate(-2deg)',
              width: '90px',
              height: '24px',
              background: 'rgba(254, 240, 138, 0.65)',
              backdropFilter: 'blur(4px)',
              border: '1px dashed rgba(202, 138, 4, 0.3)',
              borderRadius: '2px',
              zIndex: 3,
            }}
          />

          {/* Photo Image */}
          <div
            style={{
              width: '100%',
              height: '260px',
              borderRadius: '10px',
              overflow: 'hidden',
              background: '#1f2937',
              position: 'relative',
            }}
          >
            <img
              src={currentPhoto.url}
              alt={currentPhoto.caption || 'Polaroid moment'}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
            {/* Glossy light reflection sheen */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 60%)',
                pointerEvents: 'none',
              }}
            />
          </div>

          {/* Handwritten Caption */}
          <div style={{ marginTop: '14px', textAlign: 'center' }}>
            <p
              style={{
                margin: 0,
                fontFamily: 'var(--font-caveat), "Caveat", "Dancing Script", cursive',
                fontSize: '1.45rem',
                color: '#1e293b',
                lineHeight: 1.2,
                fontWeight: 700,
              }}
            >
              {caption || currentPhoto.caption}
            </p>
            <span
              style={{
                fontSize: '0.72rem',
                color: '#94a3b8',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                display: 'block',
                marginTop: '4px',
              }}
            >
              Tap for next memory ({activeIndex + 1} of {photoList.length})
            </span>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Thumb Dots */}
      {photoList.length > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '16px' }}>
          {photoList.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIndex(i)}
              style={{
                width: activeIndex === i ? '24px' : '8px',
                height: '8px',
                borderRadius: '99px',
                background: activeIndex === i ? '#e11d48' : 'rgba(225, 29, 72, 0.25)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
              aria-label={`View photo ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
