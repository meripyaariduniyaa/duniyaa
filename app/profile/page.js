'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/components/AuthProvider';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, loading, login, logout } = useAuth();
  const [notes, setNotes] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    async function initProfile() {
      if (user) {
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
          fetchUserNotes();
        }
      } else {
        // Fetch notes created on this device without requiring login
        fetchDeviceNotes();
      }
    }
    
    initProfile();
  }, [user]);

  async function fetchUserNotes() {
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
      
      data.sort((a, b) => {
        const timeA = a.created_at?.toMillis() || 0;
        const timeB = b.created_at?.toMillis() || 0;
        return timeB - timeA;
      });
      
      setNotes(data);
    } catch (e) {
      console.warn('Query by Auth UID failed, falling back to local note IDs:', e?.message);
      await fetchDeviceNotes();
    } finally {
      setFetching(false);
    }
  }

  async function fetchDeviceNotes() {
    setFetching(true);
    try {
      const storedIds = JSON.parse(localStorage.getItem('created_note_ids') || '[]');
      const deviceId = localStorage.getItem('note_device_id');
      
      const notesMap = new Map();

      // Query by device ID if available
      if (deviceId) {
        try {
          const q = query(
            collection(db, 'notes'),
            where('creator_uid', '==', deviceId)
          );
          const snap = await getDocs(q);
          snap.forEach(d => notesMap.set(d.id, { id: d.id, ...d.data() }));
        } catch (err) {
          // If Firestore query rules prevent device listing, fallback to direct document IDs
        }
      }

      // Also fetch by direct stored IDs
      for (const id of storedIds) {
        if (!notesMap.has(id)) {
          const docSnap = await getDoc(doc(db, 'notes', id));
          if (docSnap.exists()) {
            notesMap.set(id, { id: docSnap.id, ...docSnap.data() });
          }
        }
      }

      const data = Array.from(notesMap.values());
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
        <p className="text-muted">Loading your notes & reactions…</p>
      </main>
    );
  }

  return (
    <main className="shell">
      <div className="bg-glow bg-glow--top" aria-hidden="true" />

      <div className="main-content" style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', marginBottom: '0.5rem' }}>Your Notes & Reactions</h1>
            <p className="text-muted">Track recipient views, replies, and manage your moments.</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <Link href="/create" className="btn-primary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.9rem' }}>
              + Create New
            </Link>
            {user ? (
              <button className="btn-secondary" onClick={logout} style={{ padding: '0.6rem 1.25rem', fontSize: '0.9rem' }}>
                Sign Out
              </button>
            ) : (
              <button 
                className="btn-secondary" 
                onClick={login} 
                style={{ padding: '0.6rem 1.25rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <span>🔑</span> Sign in to Sync Across Devices
              </button>
            )}
          </div>
        </div>

        {fetching ? (
          <div className="center-screen" style={{ minHeight: '40vh' }}>
            <div className="spinner" />
          </div>
        ) : notes.length === 0 ? (
          <div className="glass-card text-center" style={{ padding: '4rem 2rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>No notes found on this device</h3>
            <p className="text-muted" style={{ marginBottom: '2rem' }}>
              {user 
                ? "You haven't created any notes yet with this account." 
                : "Create a note to track it here, or sign in to sync notes from other devices."}
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/create" className="btn-primary">
                Create your first note
              </Link>
              {!user && (
                <button onClick={login} className="btn-secondary">
                  Sign in with Google
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="notes-grid">
            {notes.map(note => {
              const shareSlug = note.custom_slug || note.id;
              const url = typeof window !== 'undefined' ? `${window.location.origin}/p/${shareSlug}` : '';
              
              return (
                <div key={note.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '1.15rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, margin: 0 }}>
                      To: {note.recipient_name}
                    </h3>
                    <span style={{ 
                      fontSize: '0.7rem', 
                      fontWeight: 700, 
                      padding: '0.2rem 0.6rem', 
                      borderRadius: '999px',
                      background: note.is_paid ? '#dcfce7' : '#f1f5f9',
                      color: note.is_paid ? '#166534' : '#64748b',
                      border: '1.5px solid ' + (note.is_paid ? '#166534' : '#94a3b8'),
                      marginLeft: '0.5rem',
                      flexShrink: 0,
                    }}>
                      {note.is_paid ? 'PAID & UNLOCKED' : 'DRAFT'}
                    </span>
                  </div>

                  {/* Recipient Reaction & View Indicator */}
                  {note.is_paid && (
                    <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '10px', padding: '8px 12px', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: '#be185d' }}>
                        <span>👀</span>
                        <span>{note.view_count > 0 ? `Opened ${note.view_count} time(s)` : 'Not opened yet'}</span>
                      </div>
                      {note.recipient_reaction && (
                        <div style={{ marginTop: '6px', fontSize: '12.5px', color: '#1f2937', fontWeight: 600 }}>
                          <span>💌 Replied: {note.recipient_reaction.emoji} </span>
                          <span style={{ fontStyle: 'italic' }}>&ldquo;{note.recipient_reaction.message || note.recipient_reaction.label}&rdquo;</span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {note.custom_slug && (
                    <p style={{ fontSize: '0.75rem', color: '#db2777', fontWeight: 600, marginBottom: '0.5rem', wordBreak: 'break-all' }}>
                      🔗 /p/{note.custom_slug}
                    </p>
                  )}
                  
                  <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '1.5rem', flex: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {note.custom_message}
                  </p>
                  
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <Link
                      href={`/preview?id=${note.id}`}
                      className="btn-secondary"
                      style={{ flex: 1, textAlign: 'center', fontSize: '0.85rem', textDecoration: 'none', padding: '0.5rem' }}
                    >
                      {note.is_paid ? 'View Live Tracker' : 'Finish & Pay'}
                    </Link>
                    {note.is_paid && (
                      <button 
                        className="btn-primary" 
                        style={{ flex: 1, fontSize: '0.85rem', padding: '0.5rem' }}
                        onClick={() => {
                          navigator.clipboard.writeText(url);
                          alert('Link copied to clipboard!');
                        }}
                      >
                        Copy Link
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Couple Arcade & High Score Dashboard ── */}
        <div style={{
          marginTop: '3.5rem',
          background: 'linear-gradient(135deg, #ffffff, #fff1f2)',
          borderRadius: '24px',
          border: '1.5px solid #fecdd3',
          padding: '2rem 1.5rem',
          boxShadow: '0 10px 30px rgba(0,0,0,0.03)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#be185d', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                🎮 COUPLE &amp; BESTIE ARCADE
              </span>
              <h2 style={{ fontSize: '1.5rem', color: '#1f2937', fontWeight: 800, margin: '4px 0 0' }}>
                Your Mini-Game High Scores &amp; Duels
              </h2>
            </div>
            <Link
              href="/arcade"
              className="btn-primary"
              style={{ padding: '0.6rem 1.4rem', fontSize: '0.9rem', background: 'linear-gradient(135deg, #ec4899, #be185d)' }}
            >
              🎮 Open Full Arcade ➔
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div style={{ background: '#fff5f8', padding: '1.25rem', borderRadius: '18px', border: '1px solid #fbcfe8', textAlign: 'center' }}>
              <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.25rem' }}>💖⚡</span>
              <h3 style={{ fontSize: '1rem', color: '#881337', fontWeight: 800, margin: 0 }}>Heart Rush</h3>
              <p style={{ fontSize: '0.8rem', color: '#9f1239', margin: '4px 0 10px' }}>30s Falling Sparks Catcher</p>
              <Link href="/arcade/heart-rush" className="btn-secondary" style={{ padding: '0.4rem 0.9rem', fontSize: '0.8rem', display: 'inline-block' }}>
                Play &amp; Challenge
              </Link>
            </div>

            <div style={{ background: '#f5f3ff', padding: '1.25rem', borderRadius: '18px', border: '1px solid #ddd6fe', textAlign: 'center' }}>
              <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.25rem' }}>🧩🃏</span>
              <h3 style={{ fontSize: '1rem', color: '#4c1d95', fontWeight: 800, margin: 0 }}>Memory Match</h3>
              <p style={{ fontSize: '0.8rem', color: '#6d28d9', margin: '4px 0 10px' }}>Emoji Card Flip Match</p>
              <Link href="/arcade/memory-match" className="btn-secondary" style={{ padding: '0.4rem 0.9rem', fontSize: '0.8rem', display: 'inline-block' }}>
                Play &amp; Challenge
              </Link>
            </div>

            <div style={{ background: '#fffbeb', padding: '1.25rem', borderRadius: '18px', border: '1px solid #fde68a', textAlign: 'center' }}>
              <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.25rem' }}>⚡🫂</span>
              <h3 style={{ fontSize: '1rem', color: '#78350f', fontWeight: 800, margin: 0 }}>10s Hug Frenzy</h3>
              <p style={{ fontSize: '0.8rem', color: '#92400e', margin: '4px 0 10px' }}>Speed Tap Adrenaline</p>
              <Link href="/arcade/speed-tap" className="btn-secondary" style={{ padding: '0.4rem 0.9rem', fontSize: '0.8rem', display: 'inline-block' }}>
                Play &amp; Challenge
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
