'use client';

import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';

export default function Header() {
  const { user } = useAuth();

  return (
    <nav className="topbar" id="site-header">
      <Link href="/" className="logo" style={{ textDecoration: 'none' }}>
        Note<span>Retro</span>
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
