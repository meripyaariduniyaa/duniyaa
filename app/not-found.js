import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="shell center-screen" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="glass-card text-center" style={{ maxWidth: '520px', width: '100%', padding: '3rem 2rem' }}>
        <span style={{ fontSize: '3.5rem', display: 'block', marginBottom: '1rem' }}>🔍</span>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.75rem', color: '#111' }}>Page Not Found</h1>
        <p className="text-muted" style={{ fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
          Sorry, we couldn&apos;t find that LovelyCrafts page or template experience.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/templates" className="btn-primary" style={{ padding: '0.6rem 1.4rem' }}>
            Explore All Templates
          </Link>
          <Link href="/" className="btn-secondary" style={{ padding: '0.6rem 1.2rem' }}>
            Go to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
