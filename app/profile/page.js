'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/components/AuthProvider';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, loading, login, logout } = useAuth();
  const [notes, setNotes] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [claiming, setClaiming] = useState(true);

  useEffect(() => {
    async function initProfile() {
      if (!user) {
        setClaiming(false);
        return;
      }
      
      setClaiming(true);
      try {
        // Claim anonymous notes first
        const deviceId = localStorage.getItem('note_device_id');
        if (deviceId) {
          const token = await user.getIdToken();
          await fetch('/api/claim-notes', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ deviceId })
          });
        }
      } catch (err) {
        console.error('Error claiming notes:', err);
      } finally {
        setClaiming(false);
        fetchNotes();
      }
    }
    
    initProfile();
  }, [user]);

  async function fetchNotes() {
    if (!user) return;
    setFetching(true);
    try {
      const q = query(
        collection(db, 'notes'),
        where('creator_uid', '==', user.uid)
      );
      
      const snap = await getDocs(q);
      const data = [];
      snap.forEach(doc => data.push({ id: doc.id, ...doc.data() }));
      
      // Sort in JS since we didn't add composite index for created_at yet
      data.sort((a, b) => {
        const timeA = a.created_at?.toMillis() || 0;
        const timeB = b.created_at?.toMillis() || 0;
        return timeB - timeA;
      });
      
      setNotes(data);
    } catch (e) {
      console.error(e);
    } finally {
      setFetching(false);
    }
  }

  if (loading || claiming) {
    return (
      <main className="center-screen">
        <div className="spinner" />
        <p className="text-muted">Loading your profile…</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="shell" style={{ background: 'linear-gradient(135deg, #fff5f7 0%, #ffebf0 100%)', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
        {/* Animated background elements */}
        <div style={{ position: 'absolute', top: '20%', left: '15%', fontSize: '2rem', animation: 'floatFirefly 8s infinite alternate', opacity: 0.5 }}>💝</div>
        <div style={{ position: 'absolute', top: '70%', left: '80%', fontSize: '2.5rem', animation: 'floatFirefly 12s infinite alternate-reverse', opacity: 0.4 }}>✨</div>
        <div style={{ position: 'absolute', top: '15%', right: '20%', fontSize: '1.5rem', animation: 'floatFirefly 10s infinite alternate', opacity: 0.6 }}>💌</div>
        <div style={{ position: 'absolute', bottom: '15%', left: '20%', fontSize: '2rem', animation: 'floatFirefly 9s infinite alternate', opacity: 0.4 }}>🌸</div>

        <div className="main-content center-screen" style={{ position: 'relative', zIndex: 10, minHeight: '85vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          
          <div className="glass-card" style={{ 
            textAlign: 'center', 
            maxWidth: '440px', 
            width: '100%', 
            padding: '3.5rem 2.5rem',
            background: 'rgba(255, 255, 255, 0.65)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(255, 255, 255, 0.9)',
            boxShadow: '0 25px 50px -12px rgba(225, 29, 72, 0.15)',
            borderRadius: '32px'
          }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              background: 'var(--accent-gradient)', 
              borderRadius: '24px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: '2.5rem', 
              margin: '0 auto 1.5rem',
              boxShadow: '0 10px 25px rgba(225, 29, 72, 0.3)',
              transform: 'rotate(-5deg)'
            }}>
              ✨
            </div>
            
            <h1 style={{ fontFamily: 'var(--font-bold)', fontSize: '2rem', color: '#1c1917', margin: '0 0 0.5rem 0', letterSpacing: '-0.03em' }}>
              Welcome back
            </h1>
            <p style={{ color: '#881337', fontSize: '1rem', marginBottom: '2.5rem', lineHeight: 1.6 }}>
              Sign in to manage your digital surprises and keep track of your beautiful memories.
            </p>

            <button 
              onClick={login}
              style={{
                width: '100%',
                background: '#ffffff',
                color: '#1c1917',
                border: '1px solid rgba(0,0,0,0.05)',
                borderRadius: '16px',
                padding: '1rem',
                fontSize: '1.05rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                cursor: 'pointer',
                boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                marginBottom: '2rem'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(225, 29, 72, 0.12)';
                e.currentTarget.style.borderColor = 'rgba(225, 29, 72, 0.2)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.02)';
                e.currentTarget.style.borderColor = 'rgba(0,0,0,0.05)';
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.81 15.7 17.59V20.34H19.26C21.34 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4"/>
                <path d="M12 23C14.97 23 17.46 22.02 19.26 20.34L15.7 17.59C14.73 18.24 13.48 18.64 12 18.64C9.13 18.64 6.7 16.7 5.84 14.08H2.16V16.94C3.98 20.55 7.73 23 12 23Z" fill="#34A853"/>
                <path d="M5.84 14.08C5.62 13.43 5.49 12.73 5.49 12C5.49 11.27 5.62 10.57 5.84 9.92V7.06H2.16C1.41 8.56 1 10.24 1 12C1 13.76 1.41 15.44 2.16 16.94L5.84 14.08Z" fill="#FBBC05"/>
                <path d="M12 5.38C13.62 5.38 15.06 5.93 16.2 7.02L19.34 3.88C17.45 2.12 14.97 1 12 1C7.73 1 3.98 3.45 2.16 7.06L5.84 9.92C6.7 7.3 9.13 5.38 12 5.38Z" fill="#EA4335"/>
              </svg>
              Sign in with Google
            </button>

            <p style={{ fontSize: '0.8rem', color: '#881337', lineHeight: 1.6, margin: 0, opacity: 0.8 }}>
              By continuing, you agree to our <br/>
              <Link href="/terms" style={{ color: 'var(--accent-secondary)', fontWeight: 600, textDecoration: 'none' }}>Terms of Service</Link> &middot; <Link href="/privacy" style={{ color: 'var(--accent-secondary)', fontWeight: 600, textDecoration: 'none' }}>Privacy Policy</Link>
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="shell">
      <div className="bg-glow bg-glow--top" aria-hidden="true" />

      <div className="main-content" style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', marginBottom: '0.5rem' }}>Your Notes</h1>
            <p className="text-muted">Manage your paid and unpaid notes.</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link href="/create" className="btn-primary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.9rem' }}>
              + Create New
            </Link>
            <button className="btn-secondary" onClick={logout} style={{ padding: '0.6rem 1.25rem', fontSize: '0.9rem' }}>
              Sign Out
            </button>
          </div>
        </div>

        {fetching ? (
          <div className="center-screen" style={{ minHeight: '40vh' }}>
            <div className="spinner" />
          </div>
        ) : notes.length === 0 ? (
          <div className="glass-card text-center" style={{ padding: '4rem 2rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>No notes yet</h3>
            <p className="text-muted" style={{ marginBottom: '2rem' }}>You haven&apos;t created any notes. Create one to see it here.</p>
            <Link href="/create" className="btn-secondary">
              Create your first note
            </Link>
          </div>
        ) : (
          <div className="notes-grid">
            {notes.map(note => {
              const shareSlug = note.custom_slug || note.id;
              const url = typeof window !== 'undefined' ? `${window.location.origin}/p/${shareSlug}` : '';
              
              return (
                <div key={note.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '1.1rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                      To: {note.recipient_name}
                    </h3>
                    <span style={{ 
                      fontSize: '0.7rem', 
                      fontWeight: 600, 
                      padding: '0.2rem 0.6rem', 
                      borderRadius: '999px',
                      background: note.is_paid ? '#dcfce7' : '#f1f5f9',
                      color: note.is_paid ? '#166534' : '#64748b',
                      border: '2px solid ' + (note.is_paid ? '#166534' : '#94a3b8'),
                      marginLeft: '0.5rem',
                      flexShrink: 0,
                    }}>
                      {note.is_paid ? 'PAID' : 'DRAFT'}
                    </span>
                  </div>
                  
                  {note.custom_slug && (
                    <p style={{ fontSize: '0.7rem', color: '#FF8C00', fontWeight: 600, marginBottom: '0.5rem', wordBreak: 'break-all' }}>
                      🔗 /p/{note.custom_slug}
                    </p>
                  )}
                  
                  <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '1.5rem', flex: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {note.custom_message}
                  </p>
                  
                  {note.is_paid ? (
                    <div>
                      <button 
                        className="btn-secondary w-full" 
                        style={{ fontSize: '0.85rem' }}
                        onClick={() => navigator.clipboard.writeText(url)}
                      >
                        Copy Link
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Link href={`/preview?id=${note.id}`} className="btn-primary w-full" style={{ fontSize: '0.85rem', textDecoration: 'none', display: 'block', textAlign: 'center' }}>
                        Finish & Pay
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
