'use client';

/**
 * BirthdayCurtain
 * ─────────────────────────────────────────────────────────────────
 * Cinema-marquee countdown that locks the birthday experience until
 * the target date arrives. At zero, velvet curtains part with a GSAP
 * animation and the real content fades in behind them.
 *
 * Ported from the purchased birthday template (Curtain.tsx → JS).
 * Adapted for LovelyCrafts: accepts a plain ISO date string from
 * Firestore instead of a Date object.
 *
 * Usage:
 *   <BirthdayCurtain
 *     targetDate="2026-12-25T00:00:00+05:30"
 *     recipientName="Priya"
 *     songSrc="/birthday-song.mp3"
 *   >
 *     <YourBirthdayExperience />
 *   </BirthdayCurtain>
 *
 * If targetDate is null / in the past, curtain is skipped entirely.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export default function BirthdayCurtain({
  targetDate,           // ISO string OR Date object — when to open
  tickerText,           // scrolling ticker
  marqueeTitle = 'NOW SHOWING',
  marqueeSub,           // script-font subtitle
  doorsText,
  songSrc = '/birthday-song.mp3',
  songVolume = 0.55,
  children,
  showPreviewButton = false,
  allowSkip = true,     // allows users to skip countdown and open curtains immediately
}) {
  const [mounted, setMounted]   = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
  });

  const rootRef        = useRef(null);
  const chromeRef      = useRef(null);
  const flickerRef     = useRef(null);
  const curtainLRef    = useRef(null);
  const curtainRRef    = useRef(null);
  const lockContentRef = useRef(null);
  const bulbTopRef     = useRef(null);
  const bulbBottomRef  = useRef(null);
  const audioRef       = useRef(null);

  const unlockedRef   = useRef(false);
  const intervalRef   = useRef(null);
  const reduceMotionRef = useRef(false);

  // Parse the target timestamp once
  const targetMs = useRef(0);
  useEffect(() => {
    if (!targetDate) { targetMs.current = 0; return; }
    const d = targetDate instanceof Date ? targetDate : new Date(targetDate);
    targetMs.current = isNaN(d.getTime()) ? 0 : d.getTime();
  }, [targetDate]);

  useEffect(() => {
    reduceMotionRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setIsClient(true);
  }, []);

  // Skip curtain if no valid future date
  const skipCurtain = !targetDate || (targetMs.current > 0 && targetMs.current <= Date.now());

  // Body scroll lock while curtain is up
  useEffect(() => {
    if (revealed || skipCurtain) return;
    const orig = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = orig; };
  }, [revealed, skipCurtain]);

  // Build bulb rail dots
  useEffect(() => {
    if (revealed || !isClient || skipCurtain) return;
    const build = (el, count) => {
      if (!el) return;
      el.innerHTML = '';
      for (let i = 0; i < count; i++) {
        const dot = document.createElement('span');
        dot.className = 'bc-bulb-dot';
        el.appendChild(dot);
      }
    };
    build(bulbTopRef.current, 22);
    build(bulbBottomRef.current, 22);
  }, [revealed, isClient, skipCurtain]);

  // Ambient motion: bulb pulse + projector flicker
  useEffect(() => {
    if (revealed || !isClient || reduceMotionRef.current || skipCurtain) return;
    let gsap;
    let bulbTween = null;
    let cancelled = false;

    import('gsap').then(m => {
      gsap = m.default || m.gsap || m;
      if (cancelled) return;

      const dots = rootRef.current?.querySelectorAll('.bc-bulb-dot');
      if (dots?.length) {
        bulbTween = gsap.to(dots, {
          opacity: 1, scale: 1.5, duration: 0.5, ease: 'power1.inOut',
          stagger: { each: 0.045, repeat: -1, yoyo: true },
        });
      }

      function flickerLoop() {
        if (cancelled || !flickerRef.current) return;
        gsap.to(flickerRef.current, {
          opacity: () => Math.random() * 0.045,
          duration: () => 0.06 + Math.random() * 0.18,
          ease: 'power1.inOut',
          onComplete: flickerLoop,
        });
      }
      flickerLoop();
    });

    return () => {
      cancelled = true;
      if (bulbTween) bulbTween.kill?.();
    };
  }, [revealed, isClient, skipCurtain]);

  // Audio
  useEffect(() => {
    if (revealed || !songSrc || !isClient || skipCurtain) return;
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = songVolume;
    const tryPlay = () => audio.play().catch(() => {});
    tryPlay();
    window.addEventListener('pointerdown', tryPlay, { once: true });
    return () => {
      window.removeEventListener('pointerdown', tryPlay);
      audio.pause();
      audio.currentTime = 0;
    };
  }, [revealed, songSrc, songVolume, isClient, skipCurtain]);

  // Reveal: curtain opens → lock screen fades
  const triggerUnlock = useCallback(() => {
    if (unlockedRef.current) return;
    unlockedRef.current = true;

    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }

    const finish = () => {
      setMounted(true);
      requestAnimationFrame(() => {
        if (reduceMotionRef.current) { setRevealed(true); return; }
        import('gsap').then(m => {
          const gsap = m.default || m.gsap || m;
          gsap.to(rootRef.current, {
            opacity: 0, duration: 0.6, delay: 0.15, ease: 'power2.out',
            onComplete: () => setRevealed(true),
          });
        });
      });
    };

    const curtainL = curtainLRef.current;
    const curtainR = curtainRRef.current;

    if (reduceMotionRef.current || !curtainL || !curtainR) { finish(); return; }

    import('gsap').then(m => {
      const gsap = m.default || m.gsap || m;
      if (audioRef.current && !audioRef.current.paused) {
        gsap.to(audioRef.current, { volume: 0, duration: 1.1, ease: 'power1.in' });
      }
      const tl = gsap.timeline({ onComplete: finish });
      tl.to(lockContentRef.current, { opacity: 0, y: -10, duration: 0.35, ease: 'power2.inOut' })
        .addLabel('open', '+=0.05')
        .to(curtainL, { xPercent: -100, duration: 1.0, ease: 'power3.inOut', force3D: true }, 'open')
        .to(curtainR, { xPercent: 100, duration: 1.0, ease: 'power3.inOut', force3D: true }, 'open')
        .to(chromeRef.current, { opacity: 0, duration: 0.6, ease: 'power2.out' }, 'open');
    });
  }, []);

  // Countdown tick
  useEffect(() => {
    if (revealed || !isClient || skipCurtain) return;

    function paint() {
      const now = Date.now();
      const diff = targetMs.current - now;
      if (diff <= 0) { triggerUnlock(); return; }
      const total = Math.floor(diff / 1000);
      const days    = Math.floor(total / 86400);
      const hours   = Math.floor((total % 86400) / 3600);
      const minutes = Math.floor((total % 3600) / 60);
      const seconds = total % 60;
      setTimeLeft({
        days: String(Math.min(days, 99)).padStart(2, '0'),
        hours: String(hours).padStart(2, '0'),
        minutes: String(minutes).padStart(2, '0'),
        seconds: String(seconds).padStart(2, '0'),
      });
    }
    paint();
    intervalRef.current = setInterval(paint, 1000);
    return () => { if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; } };
  }, [revealed, isClient, skipCurtain, triggerUnlock]);

  // Skip curtain entirely
  if (skipCurtain) return <>{children}</>;

  const overlay = (
    <div className="bc-root" ref={rootRef}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Anton&family=Bebas+Neue&family=Caveat:wght@500;600&family=JetBrains+Mono:wght@500;700&display=swap" />

      {songSrc && <audio ref={audioRef} src={songSrc} loop preload="auto" />}

      <div ref={chromeRef}>
        <div className="bc-rail bc-rail-left" />
        <div className="bc-rail bc-rail-right" />
        <div className="bc-flicker" ref={flickerRef} />
        <div className="bc-vignette" />
        <div className="bc-spotlight" />
        <div className="bc-grain" />
      </div>

      {allowSkip && (
        <button
          type="button"
          className="bc-skip-top-btn"
          onClick={triggerUnlock}
          aria-label="Skip countdown and open birthday curtains"
        >
          <span>Skip Wait ⏩</span>
        </button>
      )}

      {showPreviewButton && (
        <button type="button" className="bc-preview-btn" onClick={triggerUnlock}>
          Preview
        </button>
      )}

      <div className="bc-lock">
        <div className="bc-curtain-l" ref={curtainLRef} />
        <div className="bc-curtain-r" ref={curtainRRef} />

        <div className="bc-screen">
          <span className="bc-corner bc-corner-tl" aria-hidden="true">✦</span>
          <span className="bc-corner bc-corner-tr" aria-hidden="true">✦</span>
          <span className="bc-corner bc-corner-bl" aria-hidden="true">✦</span>
          <span className="bc-corner bc-corner-br" aria-hidden="true">✦</span>

          <div className="bc-lock-content" ref={lockContentRef}>
            <div className="bc-bulb-rail bc-bulb-top" ref={bulbTopRef} />

            <div className="bc-ticker">
              <div className="bc-ticker-track">
                <span>{tickerText || 'HAPPY BIRTHDAY · SPECIAL DAY ·'}</span>
                <span>{tickerText || 'HAPPY BIRTHDAY · SPECIAL DAY ·'}</span>
                <span>{tickerText || 'HAPPY BIRTHDAY · SPECIAL DAY ·'}</span>
                <span>{tickerText || 'HAPPY BIRTHDAY · SPECIAL DAY ·'}</span>
              </div>
            </div>

            <div className="bc-bulb-rail bc-bulb-bottom" ref={bulbBottomRef} />

            <h1 className="bc-marquee-title">
              <span className="bc-marquee-star" aria-hidden="true">✦</span>
              {marqueeTitle}
              <span className="bc-marquee-star" aria-hidden="true">✦</span>
            </h1>
            <p className="bc-marquee-sub">{marqueeSub || 'a birthday surprise, just for you'}</p>

            <div className="bc-hero-days">
              <div className="bc-od-number">
                <span className="bc-od-col"><span className="bc-od-digit">{timeLeft.days[0]}</span></span>
                <span className="bc-od-col"><span className="bc-od-digit">{timeLeft.days[1]}</span></span>
              </div>
              <div className="bc-hero-caption">days to go</div>
            </div>

            <div className="bc-rest-row">
              <div className="bc-bulb-tile">
                <div className="bc-od-number">
                  <span className="bc-od-col"><span className="bc-od-digit">{timeLeft.hours[0]}</span></span>
                  <span className="bc-od-col"><span className="bc-od-digit">{timeLeft.hours[1]}</span></span>
                </div>
                <span className="bc-bulb-label">hrs</span>
              </div>
              <div className="bc-bulb-tile">
                <div className="bc-od-number">
                  <span className="bc-od-col"><span className="bc-od-digit">{timeLeft.minutes[0]}</span></span>
                  <span className="bc-od-col"><span className="bc-od-digit">{timeLeft.minutes[1]}</span></span>
                </div>
                <span className="bc-bulb-label">min</span>
              </div>
              <div className="bc-bulb-tile">
                <div className="bc-od-number">
                  <span className="bc-od-col"><span className="bc-od-digit">{timeLeft.seconds[0]}</span></span>
                  <span className="bc-od-col"><span className="bc-od-digit">{timeLeft.seconds[1]}</span></span>
                </div>
                <span className="bc-bulb-label">sec</span>
              </div>
            </div>

            <div className="bc-perforation" aria-hidden="true" />
            <p className="bc-lock-foot">{doorsText || 'unlocks at midnight on the special day'}</p>

            {allowSkip && (
              <button
                type="button"
                className="bc-open-now-btn"
                onClick={triggerUnlock}
              >
                <span className="bc-open-now-glow" />
                <span className="bc-open-now-icon">✨</span>
                <span className="bc-open-now-text">Open Surprise Now</span>
                <span className="bc-open-now-sub">Tap to open the curtains 🎭</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .bc-root {
          --bc-bg: #120d0a;
          --bc-bg2: #1b140d;
          --bc-cream: #f3e6cf;
          --bc-amber: #f0a83c;
          --bc-amber-glow: rgba(240,168,60,0.55);
          --bc-maroon: #6e1f24;
          --bc-maroon2: #8c2a30;
          --bc-muted: #a8957a;
          --bc-film: #241a10;
          --bc-gold: #d4af6a;
          --bc-rail: 26px;
          position: fixed; inset: 0; width: 100vw; height: 100vh; height: 100dvh;
          z-index: 9999; background: radial-gradient(120% 90% at 50% 40%, var(--bc-bg2) 0%, var(--bc-bg) 70%);
          color: var(--bc-cream); font-family: 'JetBrains Mono', monospace;
          -webkit-font-smoothing: antialiased; overflow: hidden; isolation: isolate;
        }
        .bc-root * { box-sizing: border-box; }

        .bc-rail { position: absolute; top: 0; bottom: 0; width: var(--bc-rail); z-index: 3;
          background-color: var(--bc-film);
          background-image: radial-gradient(circle, var(--bc-bg) 5px, transparent 5.6px);
          background-size: 100% 30px; background-position: center; }
        .bc-rail-left { left: 0; }
        .bc-rail-right { right: 0; }

        .bc-flicker { position: absolute; inset: 0; z-index: 2; background: #fff; opacity: 0;
          pointer-events: none; mix-blend-mode: overlay; }
        .bc-vignette { position: absolute; inset: 0; z-index: 4; pointer-events: none;
          background: radial-gradient(120% 85% at 50% 42%, transparent 45%, rgba(0,0,0,0.55) 100%); }
        .bc-spotlight { position: absolute; top: -20%; left: -30%; width: 60%; height: 140%;
          z-index: 4; pointer-events: none;
          background: linear-gradient(100deg, transparent 0%, rgba(240,168,60,0.05) 45%, rgba(240,168,60,0.09) 50%, rgba(240,168,60,0.05) 55%, transparent 100%);
          animation: bc-sweep 9s ease-in-out infinite; mix-blend-mode: screen; }
        @keyframes bc-sweep { 0% { transform: translateX(0); } 50% { transform: translateX(220%); } 100% { transform: translateX(0); } }
        .bc-grain { position: absolute; inset: 0; z-index: 5; pointer-events: none; opacity: 0.05;
          mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
          background-size: 160px 160px; }

        .bc-preview-btn { position: absolute; top: max(14px, env(safe-area-inset-top));
          right: max(14px, env(safe-area-inset-right)); z-index: 1000;
          font-family: 'Bebas Neue', sans-serif; font-size: 12px; letter-spacing: 0.14em;
          text-transform: uppercase; color: var(--bc-gold);
          background: rgba(18,13,10,0.55); border: 1px solid rgba(212,175,106,0.4);
          border-radius: 999px; padding: 6px 14px; cursor: pointer;
          backdrop-filter: blur(2px); transition: background 0.2s ease; }
        .bc-preview-btn:hover { background: rgba(212,175,106,0.16); }

        .bc-skip-top-btn { position: absolute; top: max(14px, env(safe-area-inset-top));
          right: max(14px, env(safe-area-inset-right)); z-index: 1000;
          font-family: 'Bebas Neue', sans-serif; font-size: 13px; letter-spacing: 0.16em;
          text-transform: uppercase; color: var(--bc-amber);
          background: rgba(18,13,10,0.75); border: 1.5px solid var(--bc-amber);
          box-shadow: 0 0 14px var(--bc-amber-glow);
          border-radius: 999px; padding: 7px 18px; cursor: pointer;
          backdrop-filter: blur(8px); transition: all 0.25s ease; }
        .bc-skip-top-btn:hover { background: var(--bc-amber); color: #120d0a; transform: translateY(-1px) scale(1.04); }
        .bc-skip-top-btn:active { transform: scale(0.96); }

        .bc-open-now-btn { position: relative; margin-top: 1.8cqh; z-index: 20;
          display: inline-flex; flex-direction: column; align-items: center; justify-content: center;
          background: linear-gradient(135deg, rgba(240,168,60,0.18) 0%, rgba(212,175,106,0.28) 50%, rgba(240,168,60,0.18) 100%);
          border: 1.5px solid var(--bc-gold); border-radius: 999px;
          padding: 8px 22px 7px; cursor: pointer; color: var(--bc-cream);
          box-shadow: 0 4px 20px rgba(0,0,0,0.4), 0 0 16px var(--bc-amber-glow), inset 0 1px 0 rgba(255,255,255,0.25);
          backdrop-filter: blur(6px); transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          text-decoration: none; overflow: hidden; }
        .bc-open-now-btn:hover {
          background: linear-gradient(135deg, rgba(240,168,60,0.35) 0%, rgba(212,175,106,0.5) 50%, rgba(240,168,60,0.35) 100%);
          border-color: var(--bc-amber); transform: translateY(-2px) scale(1.04);
          box-shadow: 0 6px 28px rgba(0,0,0,0.5), 0 0 24px var(--bc-amber-glow);
        }
        .bc-open-now-btn:active { transform: scale(0.97); }
        .bc-open-now-text { font-family: 'Bebas Neue', sans-serif; font-size: clamp(14px, 3.2cqw, 18px);
          letter-spacing: 0.16em; text-transform: uppercase; color: #fff;
          text-shadow: 0 0 8px var(--bc-amber-glow); }
        .bc-open-now-sub { font-family: 'Caveat', cursive; font-size: clamp(11px, 2.2cqw, 14px);
          color: var(--bc-gold); opacity: 0.95; margin-top: -2px; }

        .bc-lock { position: absolute; inset: 0; display: flex; align-items: center;
          justify-content: center; overflow: hidden; padding: calc(var(--bc-rail) + 10px); }

        .bc-screen { position: relative; z-index: 10; width: 100%; height: 100%;
          display: flex; align-items: center; justify-content: center; container-type: size;
          box-shadow: inset 0 0 0 1px rgba(212,175,106,0.16), inset 0 0 40px rgba(0,0,0,0.4); }

        .bc-corner { position: absolute; z-index: 15; font-size: clamp(10px,1.8cqw,14px);
          color: var(--bc-gold); opacity: 0.55; text-shadow: 0 0 6px var(--bc-amber-glow);
          pointer-events: none; }
        .bc-corner-tl { top: 10px; left: 12px; }
        .bc-corner-tr { top: 10px; right: 12px; }
        .bc-corner-bl { bottom: 10px; left: 12px; }
        .bc-corner-br { bottom: 10px; right: 12px; }

        .bc-curtain-l, .bc-curtain-r { position: absolute; top: 0; bottom: 0; width: 52%;
          z-index: 1; will-change: transform; transform: translateZ(0);
          backface-visibility: hidden;
          background-image:
            radial-gradient(140% 55% at 50% -8%, rgba(255,255,255,0.1), transparent 60%),
            linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0) 12%, rgba(0,0,0,0) 88%, rgba(0,0,0,0.3) 100%),
            repeating-linear-gradient(90deg, var(--bc-maroon) 0, var(--bc-maroon) 26px, var(--bc-maroon2) 34px, var(--bc-maroon2) 60px, var(--bc-maroon) 68px);
          box-shadow: 0 0 60px rgba(0,0,0,0.6) inset; }
        .bc-curtain-l { left: 0; transform-origin: left; }
        .bc-curtain-r { right: 0; transform-origin: right; }

        .bc-lock-content { position: relative; z-index: 10; width: 100%; height: 100%;
          padding: 24px 0 3cqh; display: flex; flex-direction: column;
          align-items: center; justify-content: flex-start; text-align: center; }

        .bc-bulb-rail { display: flex; justify-content: space-between; padding: 0 4px; width: 100%; }
        .bc-bulb-top { margin-bottom: 7px; }
        .bc-bulb-bottom { margin-top: 7px; margin-bottom: 24px; }
        .bc-bulb-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--bc-amber);
          opacity: 0.25; box-shadow: 0 0 4px var(--bc-amber-glow); }

        .bc-ticker { width: 100%; overflow: hidden; border-top: 1px solid var(--bc-amber-glow);
          border-bottom: 1px solid var(--bc-amber-glow); padding: 1.4cqh 0;
          -webkit-mask-image: linear-gradient(90deg, transparent 0%, #000 8%, #000 92%, transparent 100%);
          mask-image: linear-gradient(90deg, transparent 0%, #000 8%, #000 92%, transparent 100%); }
        .bc-ticker-track { display: flex; white-space: nowrap; animation: bc-scroll 16s linear infinite; }
        .bc-ticker-track span { font-family: 'Bebas Neue', sans-serif; font-size: clamp(11px,2.4cqw,15px);
          letter-spacing: 0.22em; color: var(--bc-amber); padding-right: 2.4em; }
        @keyframes bc-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }

        .bc-marquee-title { font-family: 'Anton','Bebas Neue',sans-serif; font-weight: 400;
          font-size: clamp(2.1rem,9.4cqw,4.8rem); letter-spacing: 0.01em; color: var(--bc-cream);
          line-height: 0.9; text-shadow: 0 1px 0 rgba(0,0,0,0.5), 0 2px 0 rgba(0,0,0,0.35), 0 0 22px var(--bc-amber-glow);
          margin-top: 2.6cqh; display: inline-flex; align-items: center; gap: 0.4em;
          animation: bc-title-in 1.1s cubic-bezier(0.16,1,0.3,1) both; }
        .bc-marquee-star { font-size: 0.32em; color: var(--bc-amber); opacity: 0.8;
          animation: bc-twinkle 2.4s ease-in-out infinite; }
        .bc-marquee-star:last-child { animation-delay: 1.1s; }
        @keyframes bc-title-in { from { opacity: 0; transform: translateY(10px) scale(0.97); } to { opacity: 1; transform: none; } }
        @keyframes bc-twinkle { 0%,100% { opacity: 0.35; transform: scale(0.85); } 50% { opacity: 1; transform: scale(1.1); } }
        .bc-marquee-sub { font-family: 'Caveat', cursive; font-size: clamp(1rem,3cqw,1.4rem);
          color: var(--bc-gold); margin: 1cqh 0 0; text-shadow: 0 0 14px rgba(212,175,106,0.3); }

        .bc-hero-days { position: relative; margin: 2.2cqh 0 0.6cqh; }
        .bc-hero-days::before { content: ''; position: absolute; inset: -14% -10%; z-index: -1;
          background: radial-gradient(50% 60% at 50% 45%, rgba(240,168,60,0.16) 0%, transparent 75%);
          filter: blur(2px); }
        .bc-hero-days .bc-od-col { width: clamp(44px, 10cqw, 72px); height: clamp(60px, 13cqw, 88px);
          background: linear-gradient(180deg, #1f1610 0%, #0d0906 100%);
          border-radius: 8px; box-shadow: inset 0 0 0 1.5px rgba(212,175,106,0.28), 0 8px 24px rgba(0,0,0,0.6);
          display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }
        .bc-hero-days .bc-od-col::after { content: ''; position: absolute; top: 50%; left: 0; right: 0; height: 1.5px;
          background: rgba(0,0,0,0.75); z-index: 2; box-shadow: 0 1px 0 rgba(212,175,106,0.14); }
        .bc-hero-days .bc-od-digit { font-family: 'JetBrains Mono', 'Bebas Neue', monospace; font-weight: 700;
          font-size: clamp(2.4rem, 8.5cqw, 4.4rem); color: var(--bc-amber);
          text-shadow: 0 0 16px var(--bc-amber-glow), 0 2px 4px rgba(0,0,0,0.8);
          display: flex; align-items: center; justify-content: center; line-height: 1; z-index: 1; }
        .bc-hero-days .bc-od-number { display: inline-flex; gap: 4px; justify-content: center; align-items: center; }
        .bc-hero-caption { font-family: 'Bebas Neue', sans-serif; font-size: clamp(11px, 2.2cqw, 14px);
          letter-spacing: 0.3em; color: var(--bc-muted); margin-top: 4px; text-transform: uppercase; }

        .bc-rest-row { display: flex; gap: 1.4cqw; margin-top: 2.2cqh; flex-wrap: wrap; justify-content: center; }
        .bc-bulb-tile { position: relative; background: linear-gradient(180deg, var(--bc-bg2) 0%, rgba(18,13,10,0.9) 100%);
          border: 1px solid rgba(243,230,207,0.14); border-radius: 8px;
          padding: 1.2cqh 1.2cqw 0.8cqh; display: flex; flex-direction: column; align-items: center;
          gap: 0.5cqh; box-shadow: 0 14px 30px -14px rgba(0,0,0,0.7), inset 0 1px 0 rgba(243,230,207,0.06); overflow: hidden; }
        .bc-bulb-tile::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, var(--bc-amber), transparent); opacity: 0.65; }
        .bc-bulb-tile .bc-od-number { display: flex; gap: 2px; justify-content: center; align-items: center; }
        .bc-bulb-tile .bc-od-col { width: clamp(22px, 5cqw, 32px); height: clamp(32px, 7.5cqw, 42px);
          background: linear-gradient(180deg, #1a130d 0%, #0d0906 100%);
          border-radius: 4px; box-shadow: inset 0 0 0 1px rgba(212,175,106,0.18), 0 4px 10px rgba(0,0,0,0.5);
          display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }
        .bc-bulb-tile .bc-od-col::after { content: ''; position: absolute; top: 50%; left: 0; right: 0; height: 1px;
          background: rgba(0,0,0,0.7); z-index: 2; box-shadow: 0 1px 0 rgba(212,175,106,0.1); }
        .bc-bulb-tile .bc-od-digit { font-family: 'JetBrains Mono', 'Bebas Neue', monospace; font-weight: 700;
          font-size: clamp(1.2rem, 3.6cqw, 1.8rem); color: var(--bc-amber); text-shadow: 0 0 10px var(--bc-amber-glow);
          display: flex; align-items: center; justify-content: center; line-height: 1; z-index: 1; }
        .bc-bulb-label { font-family: 'Bebas Neue', sans-serif; font-size: clamp(9px,1.6cqw,10.5px);
          letter-spacing: 0.24em; color: var(--bc-muted); text-transform: uppercase; }

        .bc-perforation { width: min(220px,60%); height: 1px; margin-top: 2.4cqh;
          background-image: radial-gradient(circle, rgba(212,175,106,0.5) 1.1px, transparent 1.2px);
          background-size: 9px 1px; background-repeat: repeat-x; opacity: 0.7; }
        .bc-lock-foot { margin-top: 1.1cqh; font-size: clamp(9px,1.6cqw,10.5px); letter-spacing: 0.16em;
          color: var(--bc-gold); text-transform: uppercase; }

        @media (max-width: 560px) { .bc-root { --bc-rail: 12px; } }
        @media (max-height: 480px), (max-width: 380px) {
          .bc-bulb-top, .bc-ticker, .bc-corner { display: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .bc-ticker-track, .bc-spotlight, .bc-marquee-title, .bc-marquee-star { animation: none !important; }
        }
      `}</style>
    </div>
  );

  return (
    <>
      {children}
      {!revealed && isClient && createPortal(overlay, document.body)}
    </>
  );
}
