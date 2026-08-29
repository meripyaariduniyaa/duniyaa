'use client';

import { useState, useRef, useEffect } from 'react';

export default function VoiceNotePlayer({ audioUrl, recipientName = 'you' }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration || 0);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((e) => console.error('Voice note playback error:', e));
    }
  };

  const formatTime = (secs) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!audioUrl) return null;

  return (
    <div style={{
      maxWidth: '480px',
      margin: '1.25rem auto',
      padding: '0.85rem 1.25rem',
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(253, 242, 248, 0.95))',
      backdropFilter: 'blur(12px)',
      border: '1.5px solid #fbcfe8',
      borderRadius: '20px',
      boxShadow: '0 10px 25px rgba(236, 72, 153, 0.12)',
      position: 'relative',
      zIndex: 20,
    }}>
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        {/* Play/Pause Button */}
        <button
          type="button"
          onClick={togglePlay}
          style={{
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #ec4899, #be185d)',
            border: 'none',
            color: '#fff',
            fontSize: '1.1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(236, 72, 153, 0.4)',
            flexShrink: 0,
            transition: 'transform 0.15s ease',
          }}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>

        {/* Info & Progress */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#881337', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span>🎙️</span> Personal Voice Note
            </span>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9d174d' }}>
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          {/* Progress Bar */}
          <div
            onClick={(e) => {
              if (!audioRef.current || !duration) return;
              const rect = e.currentTarget.getBoundingClientRect();
              const pos = (e.clientX - rect.left) / rect.width;
              audioRef.current.currentTime = pos * duration;
            }}
            style={{
              width: '100%',
              height: '6px',
              background: '#fce7f3',
              borderRadius: '99px',
              cursor: 'pointer',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${duration ? (currentTime / duration) * 100 : 0}%`,
                background: 'linear-gradient(90deg, #f43f5e, #ec4899)',
                borderRadius: '99px',
                transition: isPlaying ? 'width 0.1s linear' : 'none',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
