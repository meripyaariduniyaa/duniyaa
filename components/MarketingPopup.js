'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const BEST_SELLERS = [
  {
    id: 'birthday',
    title: 'Virtual Birthday Bash',
    icon: '🎂🎈',
    tag: '🔥 #1 BESTSELLER',
    desc: 'Cake cutting, candles, confetti & song',
    color: '#f43f5e',
    href: '/templates/birthday'
  },
  {
    id: 'proposal',
    title: 'The Perfect Proposal',
    icon: '💍💖',
    tag: '👑 FOR COUPLES',
    desc: 'Interactive question & romantic heart reveal',
    color: '#ec4899',
    href: '/templates/proposal'
  },
  {
    id: 'surprise-reveal-box',
    title: 'Surprise Reveal Box',
    icon: '🎁✨',
    tag: '✨ VIRAL HIT',
    desc: 'Tap-to-unbox interactive gift animation',
    color: '#8b5cf6',
    href: '/templates/surprise-reveal-box'
  },
  {
    id: 'things-i-never-said',
    title: 'Things I Never Said',
    icon: '💌🕊️',
    tag: '❤️ EMOTIONAL',
    desc: 'Heartfelt wax-sealed letter & memories',
    color: '#059669',
    href: '/templates/things-i-never-said'
  }
];

export default function MarketingPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Do not show popup on shared/preview or arcade pages
    if (pathname?.startsWith('/p/') || pathname?.startsWith('/preview') || pathname?.startsWith('/share') || pathname?.startsWith('/arcade')) {
      return;
    }

    // Check if the popup has already been shown in this session
    const hasSeenPopup = sessionStorage.getItem('hasSeenMarketingPopup');
    
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsVisible(true);
        sessionStorage.setItem('hasSeenMarketingPopup', 'true');
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [pathname]);

  const handleCopyCode = () => {
    try {
      navigator.clipboard.writeText('NEW2026');
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {}
  };

  if (!isVisible) return null;

  return (
    <div className="marketing-popup-overlay" style={{ zIndex: 10000 }}>
      <div
        className="marketing-popup-content glass-card"
        style={{
          maxWidth: '460px',
          padding: '1.75rem 1.25rem',
          borderRadius: '28px',
          boxShadow: '0 25px 60px -15px rgba(225, 29, 72, 0.35)',
          background: 'linear-gradient(180deg, #ffffff 0%, #fffbfb 100%)',
          border: '1px solid rgba(254, 205, 211, 0.8)'
        }}
      >
        <button 
          className="marketing-popup-close" 
          onClick={() => setIsVisible(false)}
          aria-label="Close"
          style={{ top: '0.85rem', right: '0.85rem' }}
        >
          ✕
        </button>
        
        {/* Top Header Badge */}
        <div style={{ textAlign: 'center', marginBottom: '0.75rem' }}>
          <span style={{
            background: 'linear-gradient(135deg, #f43f5e, #be185d)',
            color: '#ffffff',
            fontSize: '0.72rem',
            fontWeight: 800,
            padding: '0.3rem 0.85rem',
            borderRadius: '999px',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            display: 'inline-block',
            boxShadow: '0 4px 12px rgba(244,63,94,0.25)'
          }}>
            🔥 Trending Best Sellers
          </span>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1f2937', marginTop: '0.5rem', marginBottom: '0.25rem' }}>
            Unforgettable Digital Surprises ✨
          </h3>
          <p style={{ color: '#6b7280', fontSize: '0.85rem', margin: 0 }}>
            Pick a bestseller &amp; personalize with your photos in 2 minutes!
          </p>
        </div>

        {/* Best Sellers Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', margin: '1rem 0' }}>
          {BEST_SELLERS.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => setIsVisible(false)}
              style={{
                background: '#ffffff',
                border: '1px solid rgba(254, 205, 211, 0.7)',
                borderRadius: '16px',
                padding: '0.75rem 0.6rem',
                textDecoration: 'none',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.borderColor = item.color;
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(244,63,94,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(254, 205, 211, 0.7)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.03)';
              }}
            >
              <div>
                <span style={{ fontSize: '0.62rem', fontWeight: 800, color: item.color, display: 'block', marginBottom: '2px' }}>
                  {item.tag}
                </span>
                <div style={{ fontSize: '1.4rem', marginBottom: '2px' }}>{item.icon}</div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1f2937', margin: '0 0 2px', lineHeight: 1.2 }}>
                  {item.title}
                </h4>
              </div>
              <span style={{ fontSize: '0.7rem', color: '#be185d', fontWeight: 700, marginTop: '4px' }}>
                Craft Now ➔
              </span>
            </Link>
          ))}
        </div>
        
        {/* Discount Box with 1-Click Copy */}
        <div style={{
          background: 'linear-gradient(135deg, #fff1f2, #ffe4e6)',
          border: '1.5px dashed #f43f5e',
          borderRadius: '16px',
          padding: '0.75rem 1rem',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.5rem'
        }}>
          <div style={{ textAlign: 'left' }}>
            <p style={{ margin: 0, fontWeight: 800, color: '#9f1239', fontSize: '0.85rem' }}>
              🎁 Extra 50% OFF Code
            </p>
            <p style={{ margin: '2px 0 0', color: '#881337', fontSize: '0.75rem' }}>
              Instant delivery on WhatsApp
            </p>
          </div>

          <button
            type="button"
            onClick={handleCopyCode}
            style={{
              background: '#be185d',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '0.4rem 0.85rem',
              fontWeight: 800,
              fontSize: '0.8rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'background 0.2s ease'
            }}
          >
            {copied ? '✓ COPIED!' : '🏷️ NEW2026 (Copy)'}
          </button>
        </div>

        {/* Action Button */}
        <Link 
          href="/templates" 
          className="btn-primary w-full"
          style={{
            padding: '0.8rem',
            fontSize: '0.98rem',
            fontWeight: 800,
            borderRadius: '999px',
            background: 'linear-gradient(135deg, #f43f5e, #be185d)',
            boxShadow: '0 6px 20px rgba(244,63,94,0.3)'
          }}
          onClick={() => setIsVisible(false)}
        >
          ✨ Explore All 18+ Experiences →
        </Link>

        {/* Social Proof Subtext */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '0.75rem', fontSize: '0.75rem', color: '#6b7280', fontWeight: 600 }}>
          <span>⭐ 4.9/5 Rating</span>
          <span>•</span>
          <span>🔒 100% Private Links</span>
          <span>•</span>
          <span>⚡ Live in 2 Mins</span>
        </div>
      </div>
    </div>
  );
}

