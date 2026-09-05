'use client';

import { useState, useRef, useEffect } from 'react';

export default function VoiceNoteRecorder({ onVoiceRecorded, onVoiceRemoved, existingUrl = '' }) {
  const [recording, setRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [audioUrl, setAudioUrl] = useState(existingUrl);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const fileInputRef = useRef(null);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'vkcgnlm1';
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'apology_images';

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startRecording = async () => {
    setError('');

    if (typeof window === 'undefined' || !navigator?.mediaDevices?.getUserMedia) {
      setError('Live microphone is restricted in this browser window. Please use the "Upload Audio" option below.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        // Stop all audio track streams
        stream.getTracks().forEach((track) => track.stop());

        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const localPreviewUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(localPreviewUrl);

        // Upload recorded voice note audio to Cloudinary
        await uploadAudio(audioBlob);
      };

      mediaRecorder.start();
      setRecording(true);
      setTimeLeft(30);

      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            stopRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError('Microphone permission blocked. You can allow it via the 🔒 icon in the address bar, or use "Upload Audio" below.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setError('No microphone found. Please use "Upload Audio" to attach an audio file.');
      } else {
        setError('Microphone is restricted in this window. Please use "Upload Audio" to select your voice note.');
      }
    }
  };

  const stopRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setRecording(false);
  };

  const uploadAudio = async (blobOrFile) => {
    setUploading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', blobOrFile, 'voicenote.webm');
      formData.append('upload_preset', uploadPreset);
      formData.append('resource_type', 'video'); // Cloudinary handles audio as video resource_type

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/video/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data?.secure_url) {
        onVoiceRecorded(data.secure_url);
      } else {
        setError('Could not upload audio note. Please try again.');
      }
    } catch (err) {
      console.error('Cloudinary audio upload failed:', err);
      setError('Failed to save audio note. Check internet connection.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('audio/') && !file.name.match(/\.(mp3|wav|m4a|aac|ogg|webm)$/i)) {
      setError('Please select a valid audio file (.mp3, .m4a, .wav, .aac, or .webm).');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setError('Audio file is too large (max 15MB).');
      return;
    }

    setError('');
    const localUrl = URL.createObjectURL(file);
    setAudioUrl(localUrl);
    await uploadAudio(file);
  };

  const removeVoiceNote = () => {
    setAudioUrl('');
    setTimeLeft(30);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (onVoiceRemoved) onVoiceRemoved();
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #faf5ff, #f3e8ff)',
      border: '1px solid #e9d5ff',
      borderRadius: '16px',
      padding: '1rem 1.25rem',
      marginTop: '0.75rem',
    }}>
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*,.mp3,.m4a,.wav,.aac,.ogg,.webm"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.2rem' }}>🎙️</span>
          <strong style={{ fontSize: '0.92rem', color: '#581c87' }}>Personal Voice Note / Audio</strong>
        </div>
        {recording && (
          <span style={{
            background: '#ef4444',
            color: '#fff',
            fontSize: '0.75rem',
            fontWeight: 800,
            padding: '0.2rem 0.6rem',
            borderRadius: '99px',
            animation: 'pulse 1.5s infinite',
          }}>
            🔴 REC {timeLeft}s
          </span>
        )}
      </div>

      <p style={{ fontSize: '0.82rem', color: '#6b21a8', margin: '0 0 0.75rem 0', lineHeight: 1.4 }}>
        Speak from the heart! Record up to 30 seconds of your voice or upload a voice memo to play inside the surprise.
      </p>

      {!audioUrl && !recording && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={startRecording}
            disabled={uploading}
            style={{
              padding: '0.75rem 0.75rem',
              background: 'linear-gradient(135deg, #a855f7, #7e22ce)',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '0.86rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              boxShadow: '0 4px 12px rgba(168, 85, 247, 0.25)',
            }}
          >
            <span>🎙️ Record (30s)</span>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            style={{
              padding: '0.75rem 0.75rem',
              background: '#ffffff',
              color: '#7e22ce',
              border: '1.5px solid #d8b4fe',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '0.86rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}
          >
            <span>📁 Upload Audio</span>
          </button>
        </div>
      )}

      {recording && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
          <div style={{
            width: '100%',
            height: '6px',
            background: '#e9d5ff',
            borderRadius: '99px',
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${((30 - timeLeft) / 30) * 100}%`,
              background: 'linear-gradient(90deg, #ec4899, #a855f7)',
              transition: 'width 1s linear',
            }} />
          </div>
          <button
            type="button"
            onClick={stopRecording}
            style={{
              padding: '0.6rem 1.5rem',
              background: '#ef4444',
              color: '#fff',
              border: 'none',
              borderRadius: '99px',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            ⏹ Stop Recording
          </button>
        </div>
      )}

      {audioUrl && !recording && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '0.25rem' }}>
          <audio src={audioUrl} controls style={{ width: '100%', height: '40px', borderRadius: '8px' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {uploading ? (
              <span style={{ fontSize: '0.8rem', color: '#a855f7', fontWeight: 600 }}>
                ⏳ Saving voice note to cloud...
              </span>
            ) : (
              <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 700 }}>
                ✅ Voice Note Attached!
              </span>
            )}
            <button
              type="button"
              onClick={removeVoiceNote}
              style={{
                background: 'none',
                border: 'none',
                color: '#ef4444',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              🗑️ Re-record / Delete
            </button>
          </div>
        </div>
      )}

      {error && (
        <p style={{ color: '#ef4444', fontSize: '0.82rem', marginTop: '0.5rem', marginBottom: 0, fontWeight: 600 }}>
          ⚠️ {error}
        </p>
      )}
    </div>
  );
}
