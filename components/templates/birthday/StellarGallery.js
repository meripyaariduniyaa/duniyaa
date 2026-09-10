'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DEFAULT_PHOTOS = [
  'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=600&auto=format&fit=crop&q=80',
];

export default function StellarGallery({ photos = [], recipientName = 'You' }) {
  const canvasRef = useRef(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [rotationAngle, setRotationAngle] = useState(0);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);

  const photoList = photos.length > 0 ? photos : DEFAULT_PHOTOS;

  // Starfield background canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 360);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 640);

    const stars = Array.from({ length: 140 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.8 + 0.4,
      opacity: Math.random() * 0.8 + 0.2,
      speed: Math.random() * 0.3 + 0.1,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Deep space nebula glow
      const grad = ctx.createRadialGradient(width / 2, height / 2, 20, width / 2, height / 2, width * 0.7);
      grad.addColorStop(0, 'rgba(40, 20, 50, 0.6)');
      grad.addColorStop(1, 'rgba(10, 5, 15, 0.95)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Stars
      stars.forEach(s => {
        s.y -= s.speed;
        if (s.y < 0) s.y = height;
        ctx.fillStyle = `rgba(255, 230, 245, ${s.opacity})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Drag to rotate galaxy ring
  const handlePointerDown = (e) => {
    isDraggingRef.current = true;
    startXRef.current = e.clientX || (e.touches && e.touches[0]?.clientX) || 0;
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current) return;
    const currentX = e.clientX || (e.touches && e.touches[0]?.clientX) || 0;
    const delta = currentX - startXRef.current;
    setRotationAngle(r => r + delta * 0.4);
    startXRef.current = currentX;
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        background: '#09050d',
        color: '#fff',
        userSelect: 'none',
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      />

      {/* Header title */}
      <div style={{ position: 'absolute', top: 20, left: 0, right: 0, textAlign: 'center', zIndex: 10, pointerEvents: 'none' }}>
        <p style={{ fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#f472b6', margin: '0 0 4px', opacity: 0.9 }}>
          Galaxy of Memories
        </p>
        <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', color: '#fff', margin: 0, textShadow: '0 0 12px rgba(244,114,182,0.6)' }}>
          Moments With {recipientName} ✨
        </h3>
        <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>
          Swipe left or right to orbit • Tap to zoom
        </p>
      </div>

      {/* 3D Orbiting Photo Carousel */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          perspective: 900,
          perspectiveOrigin: '50% 48%',
        }}
      >
        <div
          style={{
            position: 'relative',
            width: 130,
            height: 170,
            transformStyle: 'preserve-3d',
            transform: `rotateY(${rotationAngle}deg)`,
            transition: isDraggingRef.current ? 'none' : 'transform 0.5s ease-out',
          }}
        >
          {photoList.map((url, i) => {
            const count = photoList.length;
            const theta = (360 / count) * i;
            const radius = 170; // 3D cylinder radius

            return (
              <div
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPhoto(url);
                }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  transform: `rotateY(${theta}deg) translateZ(${radius}px)`,
                  backfaceVisibility: 'visible',
                  cursor: 'pointer',
                  borderRadius: 12,
                  overflow: 'hidden',
                  background: '#1a1322',
                  border: '1.5px solid rgba(244,114,182,0.4)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.6), 0 0 16px rgba(244,114,182,0.2)',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
              >
                <img
                  src={url}
                  alt={`Moment ${i + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', pointerEvents: 'none' }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Zoom Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(5,2,8,0.88)',
              backdropFilter: 'blur(8px)',
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
              exit={{ scale: 0.8, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: '#1e1427',
                padding: '12px 12px 18px',
                borderRadius: 20,
                border: '1.5px solid rgba(244,114,182,0.5)',
                boxShadow: '0 25px 60px rgba(0,0,0,0.8), 0 0 30px rgba(244,114,182,0.3)',
                maxWidth: 320,
                width: '100%',
                textAlign: 'center',
              }}
            >
              <div style={{ width: '100%', aspectRatio: '1', borderRadius: 14, overflow: 'hidden', marginBottom: 14 }}>
                <img src={selectedPhoto} alt="Memory" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <button
                onClick={() => setSelectedPhoto(null)}
                style={{
                  border: 'none',
                  padding: '8px 24px',
                  borderRadius: 999,
                  background: 'linear-gradient(135deg, #db2777, #9d174d)',
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
      </AnimatePresence>
    </div>
  );
}
