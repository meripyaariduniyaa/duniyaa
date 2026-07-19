'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <main className="shell">
      {/* Background decorations */}
      <div className="bg-glow bg-glow--top" aria-hidden="true" />
      <div className="bg-glow bg-glow--bottom" aria-hidden="true" />

      {/* Topbar */}
      <nav className="topbar">
        <div className="logo">
          Note<span>Retro</span>
        </div>
        <div className="nav-links">
          {user ? (
            <Link href="/profile" className="nav-link">My Dashboard</Link>
          ) : (
            <Link href="/profile" className="nav-link">Sign In</Link>
          )}
        </div>
      </nav>

      <div className="main-content">
        <section className="text-center mt-8 mb-8" style={{ maxWidth: '800px', margin: '4rem auto' }}>
          <h1 style={{ fontSize: '4rem', lineHeight: '1.1', marginBottom: '1.5rem' }}>
            Some moments deserve <br/>
            <span className="text-gradient cursive" style={{ fontSize: '1.5em' }}>more than a text.</span>
          </h1>
          <p className="text-muted" style={{ fontSize: '1.25rem', marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
            Create a beautiful, private space for the person you want to reach — photos, words, and memories.
            It disappears safely after 15 days.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link href="/create" className="btn-primary">
              ✨ Create a Note
            </Link>
            <Link href="/profile" className="btn-secondary">
              View Profile
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="grid-2 mt-8" style={{ marginTop: '6rem' }}>
          <div className="glass-card">
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔒</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Private by design</h3>
            <p className="text-muted">Your notes stay strictly between you and the recipient. No indexing, no public access.</p>
          </div>
          <div className="glass-card">
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Expires Safely</h3>
            <p className="text-muted">The link automatically expires after 15 days. It's a moment in time, not a permanent record.</p>
          </div>
          <div className="glass-card">
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📸</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Add Memories</h3>
            <p className="text-muted">Upload photos that capture your shared moments to make your note truly personal.</p>
          </div>
          <div className="glass-card">
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📱</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Opens Anywhere</h3>
            <p className="text-muted">No app required. Just send the secure link via WhatsApp, SMS, or email.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
