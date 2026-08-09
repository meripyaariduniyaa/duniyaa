'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function MarketingPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Do not show popup on shared/preview pages
    if (pathname?.startsWith('/p/') || pathname?.startsWith('/preview') || pathname?.startsWith('/share')) {
      return;
    }

    // Check if the popup has already been shown in this session
    const hasSeenPopup = sessionStorage.getItem('hasSeenMarketingPopup');
    
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsVisible(true);
        sessionStorage.setItem('hasSeenMarketingPopup', 'true');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [pathname]);

  if (!isVisible) return null;

  return (
    <div className="marketing-popup-overlay">
      <div className="marketing-popup-content glass-card">
        <button 
          className="marketing-popup-close" 
          onClick={() => setIsVisible(false)}
          aria-label="Close"
        >
          ✕
        </button>
        
        <div className="marketing-popup-header">
          <span style={{ fontSize: '2.5rem' }}>🪢</span>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#be185d', marginTop: '0.5rem', marginBottom: '0.5rem' }}>
            Raksha Bandhan Special!
          </h3>
        </div>
        
        <p style={{ color: '#1c1917', fontSize: '1.05rem', marginBottom: '1rem', lineHeight: 1.5 }}>
          Celebrate the sibling bond with our exclusive interactive Rakhi template.
        </p>
        
        <div style={{ background: '#fff0f2', border: '1px dashed #fda4af', borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem' }}>
          <p style={{ margin: 0, fontWeight: 600, color: '#e11d48', fontSize: '0.95rem' }}>
            🎉 Flat 70% OFF!
          </p>
          <p style={{ margin: '0.25rem 0 0 0', color: '#881337', fontSize: '0.9rem' }}>
            + Get an <strong>EXTRA 50% OFF</strong> using code:
          </p>
          <div style={{ background: '#be185d', color: 'white', display: 'inline-block', padding: '0.35rem 1rem', borderRadius: '6px', fontWeight: 'bold', letterSpacing: '2px', marginTop: '0.5rem' }}>
            NEW2026
          </div>
        </div>

        <Link 
          href="/templates/rakshabandhan" 
          className="btn-primary w-full"
          style={{ padding: '0.85rem', fontSize: '1.05rem' }}
          onClick={() => setIsVisible(false)}
        >
          Craft Rakhi Surprise →
        </Link>
      </div>
    </div>
  );
}
