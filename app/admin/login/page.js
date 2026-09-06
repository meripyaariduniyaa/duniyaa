'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { auth, signInWithGoogle } from '@/lib/firebase';
import { useAuth } from '@/components/AuthProvider';

function AdminLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState(
    searchParams?.get('error') === 'unauthorized'
      ? 'Access Denied: Your Google account is not in the ADMIN_EMAILS allowlist.'
      : ''
  );

  useEffect(() => {
    if (user) {
      user.getIdToken().then((token) => {
        fetch('/api/admin/overview', {
          headers: { Authorization: `Bearer ${token}` }
        }).then((res) => {
          if (res.ok) {
            router.push('/admin/dashboard');
          } else {
            setError('Access Denied: Your Google account is not in the ADMIN_EMAILS allowlist.');
          }
        });
      });
    }
  }, [user, router]);

  const handleSignIn = async () => {
    setSigningIn(true);
    setError('');
    const { user: signedUser, error: authErr } = await signInWithGoogle();
    if (authErr) {
      setError(authErr);
      setSigningIn(false);
      return;
    }
    if (signedUser) {
      try {
        const token = await signedUser.getIdToken();
        const res = await fetch('/api/admin/overview', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          router.push('/admin/dashboard');
        } else {
          setError('Access Denied: Your Google account is not in the ADMIN_EMAILS allowlist.');
        }
      } catch (err) {
        setError(err.message || 'Failed to verify admin status.');
      } finally {
        setSigningIn(false);
      }
    } else {
      setSigningIn(false);
    }
  };

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', padding: '24px' }}>
      <div
        style={{
          background: '#1e293b',
          maxWidth: '420px',
          width: '100%',
          padding: '40px',
          borderRadius: '24px',
          border: '1px solid #334155',
          boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
          textAlign: 'center',
          color: '#fff',
        }}
      >
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🛡️</div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 8px' }}>
          Admin Authentication
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: '0 0 28px', lineHeight: 1.5 }}>
          Sign in with an allowlisted Google account to access Creator Club administration.
        </p>

        {error && (
          <div style={{ color: '#f87171', background: '#450a0a', border: '1px solid #7f1d1d', padding: '12px 16px', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '20px', textAlign: 'left' }}>
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={handleSignIn}
          disabled={signingIn || loading}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            background: '#fff',
            color: '#0f172a',
            border: 'none',
            padding: '12px 20px',
            borderRadius: '12px',
            fontWeight: 700,
            fontSize: '0.95rem',
            cursor: signingIn ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          {signingIn ? 'Authenticating...' : 'Sign in as Admin'}
        </button>
      </div>
    </main>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#0f172a' }} />}>
      <AdminLoginContent />
    </Suspense>
  );
}

