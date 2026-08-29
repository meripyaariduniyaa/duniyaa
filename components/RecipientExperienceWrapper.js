'use client';

import { useState, useEffect } from 'react';
import TemplateRenderer from '@/components/templates/TemplateRenderer';
import PasscodeLock from '@/components/PasscodeLock';
import WaxSealEnvelope from '@/components/WaxSealEnvelope';
import AudioPlayer from '@/components/AudioPlayer';
import VoiceNotePlayer from '@/components/VoiceNotePlayer';
import RecipientReactionBox from '@/components/RecipientReactionBox';

export default function RecipientExperienceWrapper({ note }) {
  const customDetails = note.custom_details || {};
  const hasPasscode = Boolean(customDetails.passcode || customDetails.secret_question);
  
  const [isUnlocked, setIsUnlocked] = useState(!hasPasscode);
  const [isEnvelopeOpened, setIsEnvelopeOpened] = useState(false);

  // Track view event once per session
  useEffect(() => {
    if (!note?.id) return;
    const viewKey = `viewed_note_${note.id}`;
    if (!sessionStorage.getItem(viewKey)) {
      sessionStorage.setItem(viewKey, '1');
      fetch('/api/reactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ noteId: note.id, action: 'view' }),
      }).catch((e) => console.warn('Could not record view', e));
    }
  }, [note?.id]);

  // If locked with passcode, show Passcode Lock first
  if (!isUnlocked) {
    return (
      <PasscodeLock
        passcode={customDetails.passcode}
        secretQuestion={customDetails.secret_question}
        recipientName={note.recipient_name}
        onUnlocked={() => setIsUnlocked(true)}
      />
    );
  }

  // If not yet unwrapped, show Wax Seal Envelope
  if (!isEnvelopeOpened) {
    return (
      <WaxSealEnvelope
        recipientName={note.recipient_name}
        senderName={customDetails.sender_name}
        onOpen={() => setIsEnvelopeOpened(true)}
      />
    );
  }

  // Full experience unlocked
  const musicPreset = customDetails.audio_preset || 'romantic-piano';

  return (
    <div className="recipient-experience-container">
      {/* Background Audio Player with smooth soundscape */}
      <AudioPlayer presetId={musicPreset} autoStart={true} />

      {/* Voice Note Player Pill if recorded */}
      {note?.voice_note_url && (
        <VoiceNotePlayer audioUrl={note.voice_note_url} recipientName={note.recipient_name} />
      )}

      {/* Main Experience Template */}
      <TemplateRenderer note={note} isPreview={false} />

      {/* Recipient Interactive Reaction & Reply Back */}
      <RecipientReactionBox noteId={note.id} recipientName={note.recipient_name} />
    </div>
  );
}
