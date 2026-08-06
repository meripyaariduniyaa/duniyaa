'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';

export default function Header() {
  const pathname = usePathname();
  const { user } = useAuth();

  if (pathname?.startsWith('/p/') || pathname?.startsWith('/sorry/')) {
    return null;
  }

  return (
    <nav className="topbar" id="site-header">
      <Link href="/" className="logo" style={{ textDecoration: 'none' }}>
        Lovely<span>Crafts</span>
      </Link>
      <div className="nav-links">
        <Link href="/create" className="nav-link">Create</Link>
        {user ? (
          <Link href="/profile" className="nav-link">My Dashboard</Link>
        ) : (
          <Link href="/profile" className="nav-link">Sign In</Link>
        )}
      </div>
    </nav>
  );
}
