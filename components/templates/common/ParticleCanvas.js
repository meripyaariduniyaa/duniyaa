'use client';

import React, { useEffect, useRef } from 'react';

/**
 * 60 FPS lightweight canvas particle engine
 * Modes: 'stardust' | 'embers' | 'petals' | 'bubbles' | 'rain' | 'hearts' | 'gold_confetti'
 */
export default function ParticleCanvas({ mode = 'stardust', count = 35, opacity = 0.8 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle pool definition
    const particles = [];
    const colors = {
      stardust: ['#fbbf24', '#fef08a', '#f59e0b', '#ffffff', '#e0e7ff'],
      embers: ['#f43f5e', '#fb7185', '#fda4af', '#fbbf24', '#f59e0b'],
      petals: ['#f43f5e', '#fb7185', '#f472b6', '#fda4af', '#fff1f2'],
      bubbles: ['#ffffff', '#fbcfe8', '#fef08a', '#e0f2fe', '#fdf2f8'],
      rain: ['rgba(224, 242, 254, 0.7)', 'rgba(186, 230, 253, 0.5)', 'rgba(255, 255, 255, 0.6)'],
      hearts: ['#f43f5e', '#ec4899', '#fb7185', '#fda4af'],
      gold_confetti: ['#fbbf24', '#f59e0b', '#d97706', '#fef08a', '#fffbeb']
    };

    const activeColors = colors[mode] || colors.stardust;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: mode === 'rain' ? Math.random() * 20 + 10 : Math.random() * 4 + 1.5,
        speedX: (Math.random() - 0.5) * (mode === 'rain' ? 0.5 : 1.2),
        speedY: mode === 'rain' ? Math.random() * 12 + 8 : mode === 'bubbles' ? -(Math.random() * 1.5 + 0.5) : (Math.random() - 0.5) * 0.8,
        color: activeColors[Math.floor(Math.random() * activeColors.length)],
        alpha: Math.random() * 0.7 + 0.3,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.04,
        pulse: Math.random() * 0.05 + 0.02,
        pulseDir: 1
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        ctx.save();
        p.alpha += p.pulse * p.pulseDir;
        if (p.alpha > 0.9) p.pulseDir = -1;
        if (p.alpha < 0.2) p.pulseDir = 1;

        ctx.globalAlpha = p.alpha * opacity;

        if (mode === 'rain') {
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.speedX * 2, p.y + p.size);
          ctx.stroke();

          p.y += p.speedY;
          p.x += p.speedX;
          if (p.y > height) {
            p.y = -p.size;
            p.x = Math.random() * width;
          }
        } else if (mode === 'petals') {
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 2, p.size, 0, 0, Math.PI * 2);
          ctx.fill();

          p.rotation += p.rotSpeed;
          p.y += Math.abs(p.speedY) + 0.6;
          p.x += Math.sin(p.rotation) * 0.8;
          if (p.y > height + 20) {
            p.y = -20;
            p.x = Math.random() * width;
          }
        } else if (mode === 'gold_confetti') {
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size, -p.size * 1.5, p.size * 2, p.size * 3);

          p.rotation += p.rotSpeed * 2;
          p.y += Math.abs(p.speedY) + 1.2;
          p.x += Math.cos(p.rotation) * 1.2;
          if (p.y > height + 20) {
            p.y = -20;
            p.x = Math.random() * width;
          }
        } else {
          // Stardust / Embers / Bubbles
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 8;
          ctx.shadowColor = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();

          p.x += p.speedX;
          p.y += p.speedY;

          if (p.x < -10) p.x = width + 10;
          if (p.x > width + 10) p.x = -10;
          if (p.y < -10) p.y = height + 10;
          if (p.y > height + 10) p.y = -10;
        }

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mode, count, opacity]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 1,
        width: '100%',
        height: '100%'
      }}
    />
  );
}
