# Implementation Plan - Voice Note Recording, 2-Option Photo Upload, and AI Claims Cleanup

We will implement a 30-second voice note recording & sharing feature, replace the multi-source Cloudinary upload widget with a custom 2-option photo upload UI (Camera & Gallery), and clean up inaccurate AI image/music marketing copy.

## User Review Required

> [!IMPORTANT]
> **Voice Note Storage & Permission**: Microphone access (`navigator.mediaDevices.getUserMedia`) requires HTTPS or `localhost` in modern browsers. The voice note audio file (webm/mp3) will be recorded client-side (up to 30 seconds) and uploaded to Cloudinary/Firebase as an audio asset, attached directly to the note.

> [!IMPORTANT]
> **Photo Upload Overhaul**: We will replace the Cloudinary CldUploadWidget pop-up (which displayed extraneous tabs like Unsplash, Instagram, Facebook, etc.) with a native 2-option picker in [`components/CloudinaryUpload.js`](file:///c:/Users/Anchan/Pictures/data/retronote/components/CloudinaryUpload.js):
> 1. 📸 **Click Photo (Camera)** - triggers device camera (`capture="environment"`)
> 2. 🖼️ **Choose from Gallery** - opens device photo library (`accept="image/*"`)
> Images will upload directly via Cloudinary REST API.

## Proposed Changes

---

### 1. Photo Upload Component

#### [MODIFY] [components/CloudinaryUpload.js](file:///c:/Users/Anchan/Pictures/data/retronote/components/CloudinaryUpload.js)
- Replace `next-cloudinary` widget wrapper with direct REST upload UI.
- Provide 2 clean buttons:
  - 📸 **Camera / Click Photo** (`<input type="file" accept="image/*" capture="environment">`)
  - 🖼️ **Upload from Gallery** (`<input type="file" accept="image/*" multiple>`)
- Handle file upload progress, errors, and call `onUpload(secure_url)`.

---

### 2. Voice Note Recorder & Playback

#### [NEW] [components/VoiceNoteRecorder.js](file:///c:/Users/Anchan/Pictures/data/retronote/components/VoiceNoteRecorder.js)
- Build a custom audio recorder component using `MediaRecorder` API.
- Maximum duration limit: 30 seconds with automatic timer cutoff.
- Live countdown (30s -> 0s) and wave animation while recording.
- Re-record & audio preview controls.
- Direct upload to Cloudinary/storage on completion and callback `onAudioRecorded(url)`.

#### [MODIFY] [components/EmotionalCreator.js](file:///c:/Users/Anchan/Pictures/data/retronote/components/EmotionalCreator.js)
#### [MODIFY] [components/LegacyCreator.js](file:///c:/Users/Anchan/Pictures/data/retronote/components/LegacyCreator.js)
#### [MODIFY] [app/create/page.js](file:///c:/Users/Anchan/Pictures/data/retronote/app/create/page.js)
- Add the `VoiceNoteRecorder` section to the note creation form.
- Save `voice_note_url` to note data object stored in Firestore.

#### [MODIFY] [components/RecipientExperienceWrapper.js](file:///c:/Users/Anchan/Pictures/data/retronote/components/RecipientExperienceWrapper.js)
#### [MODIFY] [components/templates/TemplateRenderer.js](file:///c:/Users/Anchan/Pictures/data/retronote/components/TemplateRenderer.js)
- Render an audio voice note player when `apology.voice_note_url` is present on the note.
- Include play/pause, waveform visualizer, and 30s playback timer.

---

### 3. AI Marketing Claims & Copy Cleanup

#### [MODIFY] [app/page.js](file:///c:/Users/Anchan/Pictures/data/retronote/app/page.js)
#### [MODIFY] [app/terms/page.js](file:///c:/Users/Anchan/Pictures/data/retronote/app/terms/page.js)
- Clarify FAQ and marketing copy: specify that AI powers our **AI Writer assistant** (for message text generation), while users upload their own photos & record voice notes, removing any implication of AI-generated custom images or AI music.

---

## Verification Plan

### Automated Verification
- Run Next.js production build (`npm run build`) to ensure no compilation errors or missing dependencies.

### Manual Verification
- **Photo Upload**: Test both **Camera** and **Gallery** upload buttons on desktop and mobile view; verify Cloudinary URLs are returned and thumbnails display.
- **Voice Recording**: Record a voice note (test auto-stop at 30 seconds), play back preview, re-record, and submit note.
- **Recipient View**: Open recipient preview link, verify voice note audio player appears and plays clearly.
