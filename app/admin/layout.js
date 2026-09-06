'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

const ADMIN_TABS = [
  { href: '/admin/dashboard', label: '📊 Overview' },
  { href: '/admin/creators', label: '👥 Creators' },
  { href: '/admin/coupons', label: '🏷️ Coupons' },
  { href: '/admin/orders', label: '📦 Orders' },
  { href: '/admin/commissions', label: '💸 Commissions' },
  { href: '/admin/payouts', label: '💳 Payouts' },
  { href: '/admin/creator-gifts', label: '🎁 Creator Gifts' },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (pathname === '/admin/login') {
      setChecking(false);
      return;
    }

    if (!loading && !user) {
      router.push('/admin/login');
      return;
    }

    if (user) {
      user.getIdToken().then((token) => {
        fetch('/api/admin/overview', {
          headers: { Authorization: `Bearer ${token}` }
        })
          .then((res) => {
            if (res.ok) {
              setIsAdmin(true);
            } else {
              setIsAdmin(false);
              router.push('/admin/login?error=unauthorized');
            }
          })
          .catch(() => {
            setIsAdmin(false);
            router.push('/admin/login?error=failed');
          })
          .finally(() => setChecking(false));
      });
    }
  }, [user, loading, pathname, router]);

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (loading || checking) {
    return (
      <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#6b7280' }}>
          <div style={{ fontSize: '2.5rem', animation: 'bounce 1s infinite' }}>🛡️</div>
          <p style={{ marginTop: '12px', fontWeight: 600 }}>Verifying Admin Credentials...</p>
        </div>
      </main>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#0f172a' }}>
      
      {/* ADMIN TOPBAR */}
      <header style={{ background: '#1e293b', color: '#fff', borderBottom: '1px solid #334155', padding: '0 24px', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link href="/admin/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: '#fff', fontWeight: 800, fontSize: '1.1rem' }}>
              <span style={{ fontSize: '1.4rem' }}>🛡️</span>
              <span>Lovely<span style={{ color: '#fb7185' }}>Admin</span></span>
            </Link>
            <span style={{ background: '#0284c7', color: '#fff', fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>
              Creator Club Admin
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              {user?.email}
            </span>
            <button
              type="button"
              onClick={() => signOut(auth).then(() => router.push('/admin/login'))}
              style={{ background: '#334155', color: '#cbd5e1', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '4px', overflowX: 'auto', paddingBottom: '4px' }}>
          {ADMIN_TABS.map((tab) => {
            const active = pathname === tab.href || (tab.href === '/admin/dashboard' && pathname === '/admin');
            return (
              <Link
                key={tab.href}
                href={tab.href}
                style={{
                  padding: '8px 16px',
                  fontSize: '0.85rem',
                  fontWeight: active ? 700 : 500,
                  color: active ? '#fff' : '#94a3b8',
                  textDecoration: 'none',
                  borderBottom: active ? '3px solid #f43f5e' : '3px solid transparent',
                  whiteSpace: 'nowrap',
                }}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
      </header>

      {/* ADMIN CONTENT */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px 80px' }}>
        {children}
      </main>
    </div>
  );
}
