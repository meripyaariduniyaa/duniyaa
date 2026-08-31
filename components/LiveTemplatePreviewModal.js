'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import TemplateRenderer from '@/components/templates/TemplateRenderer';
import { getMockPreviewNote } from '@/lib/mockPreviewNotes';
import { templates } from '@/lib/templates';
import { emotionalTemplates } from '@/lib/emotionalTemplates';

export default function LiveTemplatePreviewModal({ templateId, onClose }) {
  // Lock body scroll when modal is active
  useEffect(() => {
    if (templateId) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [templateId]);

  if (!templateId) return null;

  const allTemplates = [...templates, ...emotionalTemplates];
  const templateInfo = allTemplates.find((t) => t.id === templateId) || {
    id: templateId,
    title: 'Live Interactive Preview',
    icon: '✨',
  };

  const mockNote = getMockPreviewNote(templateId);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'rgba(15, 12, 25, 0.92)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        overflow: 'hidden',
      }}
    >
      {/* Top Floating Control Bar */}
      <div
        style={{
          width: '100%',
          background: 'rgba(30, 24, 45, 0.95)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
          padding: '0.75rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          zIndex: 100000,
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '1.75rem' }}>{templateInfo.icon}</span>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h3 style={{ color: '#fff', fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>
                {templateInfo.title}
              </h3>
              <span
                style={{
                  background: 'linear-gradient(135deg, #f43f5e, #be185d)',
                  color: '#fff',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  padding: '0.15rem 0.5rem',
                  borderRadius: '999px',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}
              >
                LIVE DEMO PREVIEW
              </span>
            </div>
            <p style={{ color: '#9ca3af', fontSize: '0.78rem', margin: 0 }}>
              Sample interactive demo • Experience what your recipient will receive
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <Link
            href={`/create?template=${templateId}`}
            className="btn-primary"
            style={{
              padding: '0.55rem 1.25rem',
              fontSize: '0.85rem',
              fontWeight: 800,
              borderRadius: '999px',
              background: 'linear-gradient(135deg, #f43f5e, #be185d)',
              boxShadow: '0 4px 14px rgba(244,63,94,0.4)',
              textDecoration: 'none',
            }}
          >
            ✨ Customize This (₹199)
          </Link>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#fff',
              padding: '0.55rem 1rem',
              borderRadius: '999px',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            ✕ Close
          </button>
        </div>
      </div>

      {/* Main Interactive Screen Container */}
      <div
        style={{
          width: '100%',
          flex: 1,
          position: 'relative',
          overflowY: 'auto',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'stretch',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '680px',
            position: 'relative',
            background: '#000',
            minHeight: '100%',
            boxShadow: '0 0 50px rgba(0,0,0,0.5)',
          }}
        >
          <TemplateRenderer note={mockNote} isPreview={true} />
        </div>
      </div>
    </div>
  );
}
