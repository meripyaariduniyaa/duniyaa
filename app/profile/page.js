'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
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
          // Note: we can optionally remove the device id or leave it, it's safer to just let it be reused
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
        collection(db, 'apologies'),
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
      <main className="shell">
        <div className="bg-glow bg-glow--top" aria-hidden="true" />
        
        <nav className="topbar">
          <Link href="/" className="logo" style={{ textDecoration: 'none' }}>
            Note<span>Retro</span>
          </Link>
          <div className="nav-links">
            <Link href="/" className="nav-link">Back Home</Link>
          </div>
        </nav>

        <div className="main-content center-screen">
          <div className="glass-card text-center" style={{ maxWidth: '400px', width: '100%' }}>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>My Dashboard</h1>
            <p className="text-muted" style={{ marginBottom: '2rem' }}>
              Sign in to view your created notes and manage your links.
            </p>
            <button className="btn-primary w-full" onClick={login}>
              Sign In with Google
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="shell">
      <div className="bg-glow bg-glow--top" aria-hidden="true" />
      
      <nav className="topbar">
        <Link href="/" className="logo" style={{ textDecoration: 'none' }}>
          Note<span>Retro</span>
        </Link>
        <div className="nav-links">
          <button className="nav-link" onClick={logout}>Sign Out</button>
        </div>
      </nav>

      <div className="main-content" style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Your Notes</h1>
            <p className="text-muted">Manage your paid and unpaid notes.</p>
          </div>
          <Link href="/create" className="btn-primary" style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}>
            + Create New
          </Link>
        </div>

        {fetching ? (
          <div className="center-screen" style={{ minHeight: '40vh' }}>
            <div className="spinner" />
          </div>
        ) : notes.length === 0 ? (
          <div className="glass-card text-center" style={{ padding: '4rem 2rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>No notes yet</h3>
            <p className="text-muted" style={{ marginBottom: '2rem' }}>You haven't created any notes. Create one to see it here.</p>
            <Link href="/create" className="btn-secondary">
              Create your first note
            </Link>
          </div>
        ) : (
          <div className="notes-grid">
            {notes.map(note => {
              const url = typeof window !== 'undefined' ? `${window.location.origin}/sorry/${note.id}` : '';
              
              return (
                <div key={note.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      To: {note.recipient_name}
                    </h3>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      fontWeight: 600, 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '999px',
                      background: note.is_paid ? '#dcfce7' : '#f1f5f9',
                      color: note.is_paid ? '#166534' : '#64748b',
                    }}>
                      {note.is_paid ? 'PAID' : 'DRAFT'}
                    </span>
                  </div>
                  
                  <p className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '1.5rem', flex: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {note.custom_message}
                  </p>
                  
                  {note.is_paid ? (
                    <div>
                      <button 
                        className="btn-secondary w-full" 
                        style={{ fontSize: '0.875rem' }}
                        onClick={() => navigator.clipboard.writeText(url)}
                      >
                        Copy Link
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Link href={`/preview?id=${note.id}`} className="btn-primary w-full" style={{ fontSize: '0.875rem', textDecoration: 'none', display: 'block', textAlign: 'center' }}>
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
