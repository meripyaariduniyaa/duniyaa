import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'NoteRetro — create private, heartfelt notes';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #f59e0b 100%)',
          padding: 48,
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 64, fontWeight: 700, color: '#111827', marginBottom: 20 }}>
          NoteRetro
        </div>
        <div style={{ fontSize: 34, color: '#374151', textAlign: 'center' }}>
          Create private, beautiful notes for someone special
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
