'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith('/p/')) {
    return null;
  }

  return (
    <footer className="site-footer" id="site-footer">
      <div className="footer-inner">
        {/* Brand Column */}
        <div className="footer-brand">
          <div className="logo" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
            Lovely<span>Crafts</span>
          </div>
          <p className="footer-desc">
            Create romantic and personalized digital gifts in minutes for birthdays, anniversaries, long-distance surprises, and special moments across the globe.
          </p>
          <div className="footer-socials">
            <a href="#" aria-label="Instagram" className="footer-social-link">📷</a>
            <a href="#" aria-label="Twitter" className="footer-social-link">🐦</a>
            <a href="#" aria-label="Email" className="footer-social-link">✉️</a>
          </div>
        </div>

        {/* Occasions Column */}
        <div className="footer-col">
          <h4 className="footer-heading">By Occasion</h4>
          <ul className="footer-list">
            <li><Link href="/occasions/birthday">Birthday Surprises</Link></li>
            <li><Link href="/occasions/anniversary">Anniversary & Love</Link></li>
            <li><Link href="/occasions/raksha-bandhan">Raksha Bandhan</Link></li>
            <li><Link href="/occasions/apology">Apology & Making Up</Link></li>
            <li><Link href="/occasions/romantic">Romantic Confessions</Link></li>
            <li><Link href="/occasions/valentines-day">Valentine's Day</Link></li>
          </ul>
        </div>

        {/* For Someone Special Column */}
        <div className="footer-col">
          <h4 className="footer-heading">For Someone Special</h4>
          <ul className="footer-list">
            <li><Link href="/templates/be-my-valentine">Gifts for Girlfriend</Link></li>
            <li><Link href="/templates/love-letter">Gifts for Boyfriend</Link></li>
            <li><Link href="/templates/letter-for-mom">Gifts for Mom</Link></li>
            <li><Link href="/templates/a-rose-for-someone-special">A Rose for Someone Special</Link></li>
            <li><Link href="/templates/surprise-reveal-box">Surprise Reveal Box</Link></li>
            <li><Link href="/templates/rakshabandhan">Raksha Bandhan Card</Link></li>
          </ul>
        </div>

        {/* Product & Legal Column */}
        <div className="footer-col">
          <h4 className="footer-heading">Product</h4>
          <ul className="footer-list">
            <li><Link href="/templates">All Templates</Link></li>
            <li><Link href="/occasions">All Occasions</Link></li>
            <li><Link href="/create">Create a Gift</Link></li>
            <li><Link href="/profile">My Dashboard</Link></li>
          </ul>
          <h4 className="footer-heading" style={{ marginTop: '1.5rem' }}>Legal</h4>
          <ul className="footer-list">
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Lovely Crafts. All rights reserved.</p>
        <p>Made with 💛 for the people you love.</p>
      </div>
    </footer>
  );
}
