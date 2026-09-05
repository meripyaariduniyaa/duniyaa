'use client';

import { useState } from 'react';
import LiveTemplatePreviewModal from '@/components/LiveTemplatePreviewModal';

/**
 * PreviewDemoButton
 * 
 * Client button component that opens the Live Interactive Template Demo Modal.
 * Works inside both Server and Client components.
 */
export default function PreviewDemoButton({
  templateId,
  className = 'btn-secondary',
  style,
  children,
}) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        type="button"
        className={className}
        style={{
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.4rem',
          ...style,
        }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShowModal(true);
        }}
      >
        {children || '👁️ Live Preview'}
      </button>

      {showModal && (
        <LiveTemplatePreviewModal
          templateId={templateId}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
