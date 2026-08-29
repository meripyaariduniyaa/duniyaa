'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';

export default function Header() {
  const pathname = usePathname();
  const { user } = useAuth();

  if (pathname?.startsWith('/p/')) {
    return null;
  }

  return (
    <nav className="topbar" id="site-header">
      <Link href="/" className="logo" style={{ textDecoration: 'none' }}>
        <span>❤</span> Lovely<span>Crafts</span>
      </Link>
      <div className="nav-links">
        <Link href="/#feelings" className="nav-link hide-on-mobile">By feeling</Link>
        <Link href="/templates" className="nav-link hide-on-mobile">All gifts</Link>
        {user ? (
          <Link href="/profile" className="nav-link">Dashboard</Link>
        ) : (
          <Link href="/profile" className="nav-link">Sign In</Link>
        )}
        <Link href="/#feelings" className="btn-primary header-create-button">
          Create a moment
        </Link>
      </div>
    </nav>
  );
}
