/**
 * Lightweight Zero-Latency Sound Effects Engine
 * Plays real audio files from /sounds/*.mp3 when available,
 * with instant Web Audio API synthesis fallback so it works immediately.
 */

class SoundEffectsEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.audioCache = {};
  }

  init() {
    if (typeof window === 'undefined') return false;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return false;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return true;
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  setMuted(val) {
    this.muted = Boolean(val);
  }

  play(sfxName) {
    if (this.muted || typeof window === 'undefined') return;

    // Try HTML5 Audio file first if user uploaded to /sounds/
    const soundPath = `/sounds/${sfxName}.mp3`;
    const audio = new Audio(soundPath);
    audio.volume = 0.65;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // File not present or autoplay blocked; fall back to Web Audio synthesis
        this.synthesizeSfx(sfxName);
      });
    }
  }

  synthesizeSfx(name) {
    if (!this.init() || !this.ctx) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    switch (name) {
      case 'pop': {
        // High to low frequency drop pop
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(650, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.08);

        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.08);
        break;
      }

      case 'sparkle':
      case 'chime': {
        // Delicate pentatonic chime
        const freqs = [1046, 1318, 1567, 2093];
        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const noteStart = now + idx * 0.06;
          const noteEnd = noteStart + 0.45;

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, noteStart);

          gain.gain.setValueAtTime(0, noteStart);
          gain.gain.linearRampToValueAtTime(0.18, noteStart + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, noteEnd);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(noteStart);
          osc.stop(noteEnd);
        });
        break;
      }

      case 'candleBlow':
      case 'whoosh': {
        // Soft breath / whoosh filter
        const bufferSize = ctx.sampleRate * 0.25;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(600, now);
        filter.frequency.exponentialRampToValueAtTime(200, now + 0.25);
        filter.Q.setValueAtTime(3, now);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        whiteNoise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        whiteNoise.start(now);
        whiteNoise.stop(now + 0.25);
        break;
      }

      case 'waxSeal':
      case 'crack': {
        // Tactile snap
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(60, now + 0.05);

        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.05);
        break;
      }

      case 'cheers':
      case 'glass': {
        // Resonant high crystal ring
        [2400, 3100].forEach((freq) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);

          gain.gain.setValueAtTime(0.2, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.7);
        });
        break;
      }

      case 'typewriter': {
        // Crisp keystroke click
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.02);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.02);
        break;
      }

      case 'cassetteClick': {
        // Dual mechanical latch click
        [0, 0.04].forEach((offset) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(220, now + offset);
          osc.frequency.exponentialRampToValueAtTime(40, now + offset + 0.03);

          gain.gain.setValueAtTime(0.35, now + offset);
          gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.03);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + offset);
          osc.stop(now + offset + 0.03);
        });
        break;
      }

      case 'hugPulse': {
        // Low heartbeat thump
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(85, now);
        osc.frequency.exponentialRampToValueAtTime(45, now + 0.25);

        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.25);
        break;
      }

      default:
        break;
    }
  }
}

export const sfx = typeof window !== 'undefined' ? new SoundEffectsEngine() : { play: () => {}, toggleMute: () => false, setMuted: () => {} };
export const playSfx = (name) => sfx.play(name);
