'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ParticleCanvas from './ParticleCanvas';

import SecretRevealHUD from './SecretRevealHUD';

/**
 * Cinematic Stage Wrapper
 * Controls chapter transitions, ambient lighting, progress indicator, Secret Reveal HUD, and particle atmosphere.
 */
export default function CinematicStageWrapper({
  currentStep = 1,
  totalSteps = 4,
  chapterTitle = '',
  particleMode = 'stardust',
  theme = 'romantic', // 'romantic' | 'velvet' | 'midnight' | 'celestial' | 'serene'
  unlockedSecrets = 1,
  onNext,
  onPrev,
  children,
}) {
  const themes = {
    romantic: {
      bg: 'linear-gradient(135deg, #1f020c 0%, #3b0718 50%, #150007 100%)',
      accent: '#f43f5e',
      progressFill: 'linear-gradient(90deg, #fb7185, #f43f5e, #be123c)',
      glowColor: 'rgba(244, 63, 94, 0.25)',
    },
    velvet: {
      bg: 'linear-gradient(135deg, #1e1124 0%, #3a1c43 50%, #120718 100%)',
      accent: '#ec4899',
      progressFill: 'linear-gradient(90deg, #f472b6, #ec4899, #be185d)',
      glowColor: 'rgba(236, 72, 153, 0.25)',
    },
    midnight: {
      bg: 'linear-gradient(135deg, #090d16 0%, #172554 50%, #030712 100%)',
      accent: '#38bdf8',
      progressFill: 'linear-gradient(90deg, #38bdf8, #2563eb, #1d4ed8)',
      glowColor: 'rgba(56, 189, 248, 0.25)',
    },
    celestial: {
      bg: 'linear-gradient(135deg, #0d0f1d 0%, #1e1b4b 50%, #020617 100%)',
      accent: '#a855f7',
      progressFill: 'linear-gradient(90deg, #c084fc, #a855f7, #7e22ce)',
      glowColor: 'rgba(168, 85, 247, 0.25)',
    },
    serene: {
      bg: 'linear-gradient(135deg, #061e24 0%, #0f4955 50%, #021217 100%)',
      accent: '#2dd4bf',
      progressFill: 'linear-gradient(90deg, #5eead4, #14b8a6, #0f766e)',
      glowColor: 'rgba(45, 212, 191, 0.25)',
    },
  };

  const activeTheme = themes[theme] || themes.romantic;
  const progressPercent = Math.min(100, (currentStep / totalSteps) * 100);

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        background: activeTheme.bg,
        color: '#ffffff',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem 1rem',
      }}
    >
      {/* Background Particle Engine */}
      <ParticleCanvas mode={particleMode} count={40} opacity={0.75} />

      {/* Atmospheric Radial Glow Behind Content */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(90vw, 700px)',
          height: 'min(90vw, 700px)',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${activeTheme.glowColor} 0%, rgba(0,0,0,0) 70%)`,
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Top Chapter Progress Controller */}
      <header
        style={{
          position: 'absolute',
          top: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'min(94vw, 600px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          zIndex: 10,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.7)',
              }}
            >
              Chapter {currentStep} of {totalSteps}
            </span>
            {chapterTitle && (
              <span
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: activeTheme.accent,
                  textShadow: '0 0 12px rgba(255,255,255,0.2)',
                }}
              >
                ✦ {chapterTitle} ✦
              </span>
            )}
          </div>

          <SecretRevealHUD unlockedCount={unlockedSecrets || Math.min(3, Math.ceil((currentStep / totalSteps) * 3))} />
        </div>

        {/* Progress Bar Line */}
        <div
          style={{
            width: '100%',
            height: '4px',
            background: 'rgba(255,255,255,0.15)',
            borderRadius: '99px',
            overflow: 'hidden',
          }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{
              height: '100%',
              background: activeTheme.progressFill,
              boxShadow: `0 0 10px ${activeTheme.accent}`,
            }}
          />
        </div>
      </header>

      {/* Main Stage Content with Framer Motion Animation */}
      <main
        style={{
          position: 'relative',
          zIndex: 5,
          width: '100%',
          maxWidth: '680px',
          margin: '0 auto',
          marginTop: '3.5rem',
          marginBottom: '1rem',
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
