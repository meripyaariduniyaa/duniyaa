'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

/**
 * ArcadeAdBanner Component
 * 
 * Supports:
 * 1. Google AdSense (when NEXT_PUBLIC_ADSENSE_CLIENT_ID env is configured)
 * 2. High-converting internal House Ads / Premium Template Promos (when AdSense is loading/disabled/dev mode)
 */
export default function ArcadeAdBanner({ slot = 'banner', format = 'auto', className = '' }) {
  const [adSenseLoaded, setAdSenseLoaded] = useState(false);
  const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  useEffect(() => {
    if (adsenseClientId && typeof window !== 'undefined') {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        setAdSenseLoaded(true);
      } catch (err) {
        console.warn('AdSense push error:', err);
      }
    }
  }, [adsenseClientId]);

  // If real Google AdSense ID is set, render the AdSense <ins> tag
  if (adsenseClientId && adSenseLoaded) {
    return (
      <div className={`arcade-ad-wrapper ${className}`} style={{ margin: '1.25rem 0', textAlign: 'center' }}>
        <span style={{ fontSize: '0.65rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '4px' }}>
          ADVERTISEMENT
        </span>
        <ins
          className="adsbygoogle"
          style={{ display: 'block', minHeight: '90px' }}
          data-ad-client={adsenseClientId}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  // Internal Monetization House Ad / Premium Offer Showcase
  return (
    <div
      className={`arcade-ad-wrapper ${className}`}
      style={{
        margin: '1.25rem 0',
        background: 'linear-gradient(135deg, #fff1f2 0%, #fef2f2 100%)',
        border: '1px solid #fecdd3',
        borderRadius: '16px',
        padding: '0.85rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        flexWrap: 'wrap',
        boxShadow: '0 4px 14px rgba(244, 63, 94, 0.05)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left' }}>
        <span style={{
          fontSize: '0.65rem',
          fontWeight: 800,
          background: '#be185d',
          color: '#ffffff',
          padding: '0.15rem 0.45rem',
          borderRadius: '4px',
          letterSpacing: '0.05em'
        }}>
          SPONSORED
        </span>
        <div>
          <strong style={{ fontSize: '0.88rem', color: '#881337', display: 'block' }}>
            ✨ Unlock Full Customized Experiences for ₹199
          </strong>
          <span style={{ fontSize: '0.78rem', color: '#9f1239' }}>
            Personal music, photos, wax seal, and 1-click WhatsApp delivery.
          </span>
        </div>
      </div>

      <Link
        href="/templates"
        style={{
          background: 'linear-gradient(135deg, #f43f5e, #be185d)',
          color: '#ffffff',
          padding: '0.45rem 1rem',
          borderRadius: '999px',
          fontSize: '0.8rem',
          fontWeight: 800,
          textDecoration: 'none',
          whiteSpace: 'nowrap',
          boxShadow: '0 4px 12px rgba(244, 63, 94, 0.25)'
        }}
      >
        🎁 Create Surprise →
      </Link>
    </div>
  );
}
