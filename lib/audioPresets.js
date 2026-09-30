// Audio presets using Web Audio API for zero-latency, royalty-free, instant ambient soundtracks
// Supports both synthesized generative soundtracks and audio track loops

export const AUDIO_PRESETS = [
  {
    id: 'romantic-piano',
    name: 'Romantic Piano & Strings',
    icon: '🎹',
    description: 'Warm, emotional piano chords with lush strings',
    type: 'synth',
    style: 'romantic',
    bpm: 68,
    fileSrc: '/sounds/romantic-piano.mp3',
  },
  {
    id: 'lofi-sunset',
    name: 'Lo-Fi Sunset Dreams',
    icon: '☕',
    description: 'Chill, mellow beats with vinyl warmth',
    type: 'synth',
    style: 'lofi',
    bpm: 76,
    fileSrc: '/sounds/lofi-sunset.mp3',
  },
  {
    id: 'celestial-ambient',
    name: 'Celestial Stardust & Waves',
    icon: '✨',
    description: 'Dreamy space ambiance & distant warm frequencies',
    type: 'synth',
    style: 'celestial',
    bpm: 60,
    fileSrc: '/sounds/celestial-ambient.mp3',
  },
  {
    id: 'birthday-joy',
    name: 'Birthday Fanfare & Bells',
    icon: '🎉',
    description: 'Sparkling music-box chime with cheerful melody',
    type: 'synth',
    style: 'birthday',
    bpm: 110,
    fileSrc: '/sounds/birthday-joy.mp3',
  },
  {
    id: 'sincere-acoustic',
    name: 'Acoustic Heartstrings',
    icon: '🎸',
    description: 'Gentle acoustic guitar arpeggios & warm pads',
    type: 'synth',
    style: 'acoustic',
    bpm: 72,
    fileSrc: '/sounds/sincere-acoustic.mp3',
  },
  {
    id: 'none',
    name: 'No Background Music',
    icon: '🔇',
    description: 'Quiet, peaceful experience',
    type: 'none',
  }
];

class AmbientSynthesizer {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.gainNode = null;
    this.intervalId = null;
    this.activeNodes = [];
    this.volume = 0.45;
    this.audioElement = null;
  }

  init() {
    if (typeof window === 'undefined') return false;
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return false;
      this.ctx = new AudioContext();
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.gainNode.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return true;
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
    if (this.audioElement) {
      this.audioElement.volume = this.volume;
    }
  }

  play(presetId = 'romantic-piano') {
    if (presetId === 'none') {
      this.stop();
      return;
    }

    this.stop();
    this.isPlaying = true;

    const preset = AUDIO_PRESETS.find((p) => p.id === presetId) || AUDIO_PRESETS[0];

    // Try playing real audio track file if configured and available
    if (preset.fileSrc && typeof window !== 'undefined') {
      try {
        const audio = new Audio(preset.fileSrc);
        audio.loop = true;
        audio.volume = this.volume;
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              this.audioElement = audio;
            })
            .catch(() => {
              // Audio file missing or unplayable -> gracefully fall back to synth
              this.startSynthesizer(preset);
            });
          return;
        }
      } catch (err) {
        // Fall back to synth below
      }
    }

    this.startSynthesizer(preset);
  }

  startSynthesizer(preset) {
    if (!this.init()) return;

    // Chords and notes (MIDI notes converted to frequencies)
    const midiToFreq = (m) => 440 * Math.pow(2, (m - 69) / 12);

    let chordProgression = [];
    let noteDuration = 2.4;

    if (preset.style === 'romantic') {
      // Db major / Ab / Bbm / Gb progression (lush, tear-jerking)
      chordProgression = [
        [49, 56, 61, 65, 68], // Db
        [44, 51, 56, 60, 63], // Ab
        [46, 53, 58, 61, 65], // Bbm
        [42, 49, 54, 58, 61], // Gb
      ];
      noteDuration = 3.2;
    } else if (preset.style === 'lofi') {
      // Neo-soul major 9th & minor 9th chords
      chordProgression = [
        [48, 55, 59, 62, 65], // Cmaj9
        [45, 52, 57, 60, 64], // Am9
        [41, 48, 53, 57, 60], // Fmaj7
        [43, 50, 55, 59, 62], // G9
      ];
      noteDuration = 2.8;
    } else if (preset.style === 'celestial') {
      // Deep space ambient chords (Ebmaj9, Gm7, Abmaj7, Bb9)
      chordProgression = [
        [51, 58, 62, 65, 70], // Ebmaj9
        [43, 50, 55, 58, 62], // Gm7
        [44, 51, 55, 60, 63], // Abmaj7
        [46, 53, 58, 62, 65], // Bb
      ];
      noteDuration = 3.6;
    } else if (preset.style === 'birthday') {
      // Cheerful C / G / Am / F music box
      chordProgression = [
        [60, 64, 67, 72], // C
        [59, 62, 67, 71], // G/B
        [57, 60, 64, 69], // Am
        [53, 57, 60, 65], // F
      ];
      noteDuration = 1.8;
    } else {
      // Acoustic Heartstrings (D / A / Bm / G)
      chordProgression = [
        [50, 57, 62, 66, 69], // D
        [45, 52, 57, 61, 64], // A
        [47, 54, 59, 62, 66], // Bm
        [43, 50, 55, 59, 62], // G
      ];
      noteDuration = 2.6;
    }

    let step = 0;

    const playChordStep = () => {
      if (!this.isPlaying || !this.ctx) return;
      const now = this.ctx.currentTime;
      const currentChord = chordProgression[step % chordProgression.length];
      step++;

      // Arpeggiate chord notes softly
      currentChord.forEach((midi, i) => {
        const osc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        const delay = i * 0.12;
        const startTime = now + delay;
        const endTime = startTime + noteDuration;

        osc.type = preset.style === 'lofi' || preset.style === 'celestial' ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(midiToFreq(midi), startTime);

        // Lowpass filter for warm, cozy feel
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(preset.style === 'lofi' ? 900 : preset.style === 'celestial' ? 1200 : 1800, startTime);

        // Smooth attack & long release
        noteGain.gain.setValueAtTime(0, startTime);
        noteGain.gain.linearRampToValueAtTime(0.18 / (i + 1), startTime + 0.15);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, endTime);

        osc.connect(filter);
        filter.connect(noteGain);
        noteGain.connect(this.gainNode);

        osc.start(startTime);
        osc.stop(endTime);

        this.activeNodes.push(osc);
      });
    };

    // Play first chord immediately
    playChordStep();
    this.intervalId = setInterval(playChordStep, noteDuration * 1000);
  }

  stop() {
    this.isPlaying = false;
    if (this.audioElement) {
      try {
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
      } catch {}
      this.audioElement = null;
    }
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.activeNodes.forEach((node) => {
      try { node.stop(); } catch {}
    });
    this.activeNodes = [];
  }
}

export const ambientSynth = new AmbientSynthesizer();

