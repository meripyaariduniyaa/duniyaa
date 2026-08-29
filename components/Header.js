'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';

export default function Header() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  if (pathname?.startsWith('/p/')) {
    return null;
  }

  return (
    <>
      <nav className="topbar" id="site-header">
        <Link href="/" className="logo" style={{ textDecoration: 'none' }}>
          <span>❤</span> Lovely<span>Crafts</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="nav-links desktop-nav">
          <Link href="/#feelings" className="nav-link">By feeling</Link>
          <Link href="/templates" className="nav-link">All gifts</Link>
          <Link href="/arcade" className="nav-link">🎮 Arcade</Link>
          {user ? (
            <Link href="/profile" className="nav-link">Dashboard</Link>
          ) : (
            <Link href="/profile" className="nav-link">Sign In</Link>
          )}
          <Link href="/#feelings" className="btn-primary header-create-button">
            Create a moment
          </Link>
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <button
          type="button"
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-label={mobileMenuOpen ? 'Close mobile menu' : 'Open mobile menu'}
          aria-expanded={mobileMenuOpen}
        >
          <span className={`burger-bar ${mobileMenuOpen ? 'open' : ''}`} />
          <span className={`burger-bar ${mobileMenuOpen ? 'open' : ''}`} />
          <span className={`burger-bar ${mobileMenuOpen ? 'open' : ''}`} />
        </button>
      </nav>

      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="mobile-backdrop"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Navigation Drawer */}
      <div className={`mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-drawer-header">
          <Link href="/" className="logo" onClick={() => setMobileMenuOpen(false)}>
            <span>❤</span> Lovely<span>Crafts</span>
          </Link>
          <button
            type="button"
            className="mobile-drawer-close"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <div className="mobile-drawer-links">
          <Link
            href="/#feelings"
            className="mobile-nav-item"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="mobile-nav-icon">💖</span>
            <div>
              <strong>Find by Feeling</strong>
              <small>Browse gifts based on your emotion</small>
            </div>
          </Link>

          <Link
            href="/templates"
            className="mobile-nav-item"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="mobile-nav-icon">🎁</span>
            <div>
              <strong>All Gift Experiences</strong>
              <small>Explore all 18 interactive templates</small>
            </div>
          </Link>

          <Link
            href="/arcade"
            className="mobile-nav-item"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="mobile-nav-icon">🎮</span>
            <div>
              <strong>Couple &amp; Bestie Arcade</strong>
              <small>Play 30s mini-games &amp; send duels</small>
            </div>
          </Link>

          <Link
            href="/profile"
            className="mobile-nav-item"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="mobile-nav-icon">👤</span>
            <div>
              <strong>{user ? 'My Dashboard' : 'Sign In / Dashboard'}</strong>
              <small>{user ? 'Track your created notes & reactions' : 'Save your notes & high scores'}</small>
            </div>
          </Link>
        </div>

        <div className="mobile-drawer-footer">
          <Link
            href="/create?template=birthday"
            className="btn-primary mobile-cta-button"
            onClick={() => setMobileMenuOpen(false)}
          >
            ✨ Craft a Surprise Now
          </Link>
          <p className="mobile-drawer-subtext">Made for the people who matter most ❤️</p>
        </div>
      </div>
    </>
  );
}
