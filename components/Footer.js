import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="site-footer" id="site-footer">
      <div className="footer-inner">
        {/* Brand Column */}
        <div className="footer-brand">
          <div className="logo" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
            Note<span>Retro</span>
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
          <h4 className="footer-heading">Occasions</h4>
          <ul className="footer-list">
            <li><Link href="/create?template=birthday-surprise">Birthday Gifts</Link></li>
            <li><Link href="/create?template=love-letter">Anniversary Gifts</Link></li>
            <li><Link href="/create?template=letter-for-mom">Mother&apos;s Day Gifts</Link></li>
            <li><Link href="/create?template=be-my-valentine">Valentine&apos;s Day Gifts</Link></li>
            <li><Link href="/create?template=wedding-invitation">Wedding Gifts</Link></li>
            <li><Link href="/create?template=memoryverse">Long-Distance Gifts</Link></li>
          </ul>
        </div>

        {/* For Someone Special Column */}
        <div className="footer-col">
          <h4 className="footer-heading">For Someone Special</h4>
          <ul className="footer-list">
            <li><Link href="/create?template=be-my-valentine">Gifts for Girlfriend</Link></li>
            <li><Link href="/create?template=love-letter">Gifts for Boyfriend</Link></li>
            <li><Link href="/create?template=letter-for-mom">Gifts for Mom</Link></li>
            <li><Link href="/create?template=a-rose-for-someone-special">Romantic Gifts</Link></li>
            <li><Link href="/create?template=open-when-letters">Personalized Emotional Gifts</Link></li>
          </ul>
        </div>

        {/* Product & Legal Column */}
        <div className="footer-col">
          <h4 className="footer-heading">Product</h4>
          <ul className="footer-list">
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
        <p>© {new Date().getFullYear()} NoteRetro. All rights reserved.</p>
        <p>Made with 💛 for the people you love.</p>
      </div>
    </footer>
  );
}
