'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import {
  DashboardIcon,
  OrdersIcon,
  CrmIcon,
  CreatorsIcon,
  CouponsIcon,
  CommissionsIcon,
  PayoutsIcon,
  GiftsIcon,
  ReportsIcon,
  BlogIcon,
  DriveIcon,
  TrashIcon,
  ShieldIcon,
  LogOutIcon,
  MenuIcon,
  CloseIcon,
  ExternalLinkIcon
} from '@/components/admin/AdminIcons';

const NAV_ITEMS = [
  { href: '/admin/dashboard', label: 'Executive Overview', icon: DashboardIcon, exact: true },
  { href: '/admin/orders', label: 'Orders Ledger', icon: OrdersIcon },
  { href: '/admin/crm', label: 'Creator CRM', icon: CrmIcon },
  { href: '/admin/creators', label: 'Creators', icon: CreatorsIcon },
  { href: '/admin/coupons', label: 'Coupons & Promo', icon: CouponsIcon },
  { href: '/admin/commissions', label: 'Commissions', icon: CommissionsIcon },
  { href: '/admin/payouts', label: 'Payout Batches', icon: PayoutsIcon },
  { href: '/admin/creator-gifts', label: 'VIP Gift Passes', icon: GiftsIcon },
  { href: '/admin/blog', label: 'Blog CMS', icon: BlogIcon },
  { href: '/admin/reports', label: 'Excel Reports Hub', icon: ReportsIcon },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (loading || checking) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0b0f19', color: '#94a3b8' }}>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
            <ShieldIcon size={26} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <p style={{ fontWeight: 700, fontSize: '1.05rem', color: '#f8fafc', margin: 0 }}>Verifying Credentials</p>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>Authenticating administrative privileges...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const userInitial = (user?.email || 'A').charAt(0).toUpperCase();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc', color: '#0f172a', fontFamily: 'inherit' }}>

      {/* FIXED TOPBAR (PERMANENTLY AT TOP) */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        zIndex: 100,
        background: '#0b0f19',
        borderBottom: '1px solid #1e293b',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.35)',
      }}>

        {/* ROW 1: BRAND LOGO + USER CONTROLS */}
        <div style={{
          maxWidth: '1920px',
          margin: '0 auto',
          padding: '0 24px',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>

          {/* BRAND & STORE LINK */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Link href="/admin/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
              <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 2px 8px rgba(2, 132, 199, 0.3)' }}>
                <ShieldIcon size={18} />
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.01em' }}>
                  Lovely<span style={{ color: '#38bdf8' }}>Crafts</span>
                </span>
                <span style={{ background: '#1e293b', color: '#38bdf8', fontSize: '0.65rem', fontWeight: 800, padding: '2px 8px', borderRadius: '6px', textTransform: 'uppercase', letterSpacing: '0.06em', border: '1px solid #334155' }}>
                  Admin Suite
                </span>
              </div>
            </Link>

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: '8px',
                background: '#131c2e',
                border: '1px solid #1e293b',
                color: '#94a3b8',
                fontSize: '0.75rem',
                fontWeight: 600,
                textDecoration: 'none',
              }}
              className="hidden md:inline-flex"
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e' }} />
              <span>Live Storefront</span>
              <ExternalLinkIcon size={12} />
            </a>

            <Link
              href="/drive"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(190, 18, 60, 0.15) 100%)',
                border: '1px solid rgba(236, 72, 153, 0.35)',
                color: '#f472b6',
                fontSize: '0.75rem',
                fontWeight: 700,
                textDecoration: 'none',
                transition: 'all 0.15s ease',
              }}
              className="hidden md:inline-flex"
              title="Open Cloudinary Drive Manager"
            >
              <DriveIcon size={14} />
              <span>Cloud Drive</span>
            </Link>

            <Link
              href="/del"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(185, 28, 28, 0.15) 100%)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                color: '#f87171',
                fontSize: '0.75rem',
                fontWeight: 700,
                textDecoration: 'none',
                transition: 'all 0.15s ease',
              }}
              className="hidden md:inline-flex"
              title="Open Expiration & Cleanup Manager"
            >
              <TrashIcon size={14} />
              <span>Cleanup</span>
            </Link>
          </div>

          {/* RIGHT: SYSTEM STATUS, USER PROFILE & LOGOUT */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>

            {/* LIVE STATUS */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '999px',
              background: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid rgba(34, 197, 94, 0.25)',
              fontSize: '0.72rem',
              fontWeight: 600,
              color: '#4ade80'
            }} className="hidden sm:flex">
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e' }} />
              <span>Production Live</span>
            </div>

            {/* USER PROFILE CHIP */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '3px 4px 3px 10px', background: '#131c2e', border: '1px solid #1e293b', borderRadius: '999px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'right' }} className="hidden md:flex">
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#f8fafc', lineHeight: 1.2 }}>
                  {user?.displayName || 'Administrator'}
                </span>
                <span style={{ fontSize: '0.68rem', color: '#94a3b8', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.email}
                </span>
              </div>

              <div style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
                color: '#fff',
                fontSize: '0.8rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {userInitial}
              </div>
            </div>

            {/* LOGOUT */}
            <button
              type="button"
              onClick={() => signOut(auth).then(() => router.push('/admin/login'))}
              title="Sign Out"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: '#1e293b',
                border: '1px solid #334155',
                color: '#cbd5e1',
                padding: '7px 12px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <LogOutIcon size={15} />
              <span className="hidden sm:inline">Sign Out</span>
            </button>

            {/* MOBILE MENU TOGGLE */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                display: 'none',
                background: '#1e293b',
                border: '1px solid #334155',
                color: '#f8fafc',
                padding: '7px',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
              className="admin-mobile-toggle"
            >
              {mobileMenuOpen ? <CloseIcon size={18} /> : <MenuIcon size={18} />}
            </button>

          </div>
        </div>

        {/* ROW 2: DESKTOP NAVIGATION TABS RIBBON */}
        <div style={{
          borderTop: '1px solid #1e293b',
          background: '#080c14',
          overflowX: 'auto',
          scrollbarWidth: 'none',
        }} className="admin-nav-ribbon">
          <div style={{
            maxWidth: '1920px',
            margin: '0 auto',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            height: '46px',
            minWidth: 'max-content',
          }}>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = item.exact
                ? (pathname === item.href || pathname === '/admin')
                : (pathname === item.href || pathname.startsWith(item.href + '/'));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: active ? 700 : 500,
                    textDecoration: 'none',
                    color: active ? '#ffffff' : '#94a3b8',
                    background: active ? 'linear-gradient(135deg, rgba(2, 132, 199, 0.25) 0%, rgba(2, 132, 199, 0.1) 100%)' : 'transparent',
                    border: active ? '1px solid rgba(56, 189, 248, 0.35)' : '1px solid transparent',
                    transition: 'all 0.15s ease',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <span style={{ color: active ? '#38bdf8' : '#64748b', display: 'flex', alignItems: 'center' }}>
                    <Icon size={16} />
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* MOBILE MENU ACCORDION */}
        {mobileMenuOpen && (
          <div style={{
            background: '#090d16',
            borderTop: '1px solid #1e293b',
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            maxHeight: '70vh',
            overflowY: 'auto'
          }}>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = item.exact
                ? (pathname === item.href || pathname === '/admin')
                : (pathname === item.href || pathname.startsWith(item.href + '/'));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    fontWeight: active ? 700 : 500,
                    textDecoration: 'none',
                    color: active ? '#ffffff' : '#94a3b8',
                    background: active ? '#1e293b' : 'transparent',
                    borderLeft: active ? '3px solid #38bdf8' : '3px solid transparent',
                  }}
                >
                  <Icon size={18} className={active ? 'text-sky-400' : 'text-slate-500'} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        )}

      </header>

      {/* FULL VIEWPORT WORKSPACE (SCROLLS UNDER FIXED HEADER) */}
      <main style={{
        flex: 1,
        width: '100%',
        maxWidth: '1920px',
        margin: '0 auto',
        paddingTop: '138px',
        paddingBottom: '80px',
        paddingLeft: '32px',
        paddingRight: '32px',
        boxSizing: 'border-box',
      }} className="admin-content-area">
        {children}
      </main>

      <style jsx global>{`
        @media (max-width: 1024px) {
          .admin-mobile-toggle {
            display: flex !important;
          }
          .admin-nav-ribbon {
            display: flex !important;
          }
          .admin-content-area {
            padding-top: 130px !important;
            padding-left: 16px !important;
            padding-right: 16px !important;
            padding-bottom: 60px !important;
          }
        }
      `}</style>
    </div>
  );
}
