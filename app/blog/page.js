import Link from 'next/link';
import { getAdminDb } from '@/lib/firebase-admin';
import { SITE_URL, SITE_NAME } from '@/lib/seo';

export const revalidate = 60; // ISR revalidate every minute

export const metadata = {
  title: 'Blog & Surprises Guide — LovelyCrafts',
  description: 'Explore creative digital surprise ideas, relationship advice, birthday celebration tips, and emotional gifting guides by LovelyCrafts.',
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
  openGraph: {
    title: 'LovelyCrafts Blog — Creative Digital Surprises & Relationship Guides',
    description: 'Explore creative digital surprise ideas, relationship advice, birthday celebration tips, and emotional gifting guides by LovelyCrafts.',
    url: `${SITE_URL}/blog`,
    siteName: SITE_NAME,
    type: 'website',
  },
};

// Fallback seed posts for initial discovery & immediate visual richness if DB has no published posts yet
const SEED_POSTS = [
  {
    id: 'seed-1',
    slug: '10-creative-virtual-birthday-surprises',
    title: '10 Creative Virtual Birthday Surprises for Long-Distance Relationships',
    excerpt: 'Distance shouldn’t stop you from creating an unforgettable midnight celebration. Here is how to create interactive digital surprises they will cherish forever.',
    coverImage: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80',
    tags: ['birthday', 'long distance', 'guides'],
    author: 'LovelyCrafts Editorial',
    publishedAt: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'seed-2',
    slug: 'how-to-write-an-emotional-apology-letter',
    title: 'How to Write a Sincere Apology Letter When Words Fail You in Person',
    excerpt: 'Saying sorry is tough, but a thoughtful, private digital letter with shared memories and gentle music gives both of you space to heal.',
    coverImage: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1200&q=80',
    tags: ['apology', 'relationships', 'emotions'],
    author: 'LovelyCrafts Editorial',
    publishedAt: '2026-08-28T00:00:00.000Z',
  },
  {
    id: 'seed-3',
    slug: 'modern-proposal-ideas-interactive-story',
    title: 'The Modern Digital Proposal: How to Pop the Question Interactively',
    excerpt: 'Take your partner on a nostalgic photo-by-photo interactive journey of your relationship before revealing the ultimate question.',
    coverImage: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1200&q=80',
    tags: ['proposal', 'romance', 'guides'],
    author: 'LovelyCrafts Editorial',
    publishedAt: '2026-08-20T00:00:00.000Z',
  },
];

async function getPublishedBlogs() {
  try {
    const db = getAdminDb();
    const snap = await db
      .collection('blogs')
      .where('status', '==', 'published')
      .get();

    if (snap.empty) {
      return SEED_POSTS;
    }

    const posts = snap.docs.map((doc) => {
      const data = doc.data();
      const pubDate = data.publishedAt?.toDate?.()?.toISOString() || data.publishedAt || data.createdAt?.toDate?.()?.toISOString() || null;
      return {
        id: doc.id,
        ...data,
        publishedAt: pubDate,
      };
    });

    // Sort in memory by published date desc
    posts.sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0));

    return posts;
  } catch (err) {
    console.error('Error fetching public blogs:', err);
    return SEED_POSTS;
  }
}

export default async function BlogPage() {
  const blogs = await getPublishedBlogs();
  const featuredPost = blogs[0];
  const regularPosts = blogs.slice(1);

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #fff7ed 0%, #fff1f2 15%, #ffffff 40%)', color: '#0f172a', paddingBottom: '90px' }}>
      
      {/* HERO SECTION */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '56px 24px 32px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#ffe4e6', color: '#e11d48', padding: '6px 16px', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 800, marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <span>✨</span> The LovelyCrafts Journal
        </div>
        <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em', margin: '0 0 16px', lineHeight: 1.15 }}>
          Ideas, Stories &amp; Gifting Guides
        </h1>
        <p style={{ fontSize: '1.15rem', color: '#64748b', maxWidth: '640px', margin: '0 auto 28px', lineHeight: 1.6 }}>
          Discover creative ways to say what’s on your heart, celebrate birthdays across distances, and craft unforgettable interactive surprises.
        </p>

        {/* POPULAR TOPICS PILLS */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {['🎂 Birthday Ideas', '💍 Proposals', '💌 Apology & Healing', '💖 Long Distance', '✨ DIY Digital Gifts'].map((topic) => (
            <span
              key={topic}
              style={{
                background: '#fff',
                border: '1px solid #fecdd3',
                color: '#be185d',
                padding: '6px 14px',
                borderRadius: '999px',
                fontSize: '0.85rem',
                fontWeight: 700,
                boxShadow: '0 2px 6px rgba(244,63,94,0.06)',
              }}
            >
              {topic}
            </span>
          ))}
        </div>
      </section>

      {/* ARTICLES CONTAINER */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        
        {/* FEATURED HERO POST */}
        {featuredPost && (
          <div style={{ marginBottom: '48px' }}>
            <Link
              href={`/blog/${featuredPost.slug}`}
              style={{
                textDecoration: 'none',
                color: 'inherit',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '32px',
                background: '#fff',
                borderRadius: '24px',
                overflow: 'hidden',
                border: '1px solid #ffe4e6',
                boxShadow: '0 12px 35px rgba(244,63,94,0.08)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
            >
              {/* FEATURED COVER */}
              <div style={{ position: 'relative', minHeight: '300px', background: '#fecdd3' }}>
                <img
                  src={featuredPost.coverImage || 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80'}
                  alt={featuredPost.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
                />
              </div>

              {/* FEATURED CONTENT */}
              <div style={{ padding: '36px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap' }}>
                  <span style={{ background: '#e11d48', color: '#fff', padding: '4px 10px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase' }}>
                    Featured Article
                  </span>
                  {(featuredPost.tags || []).slice(0, 2).map((t) => (
                    <span key={t} style={{ background: '#fff1f2', color: '#be185d', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>
                      #{t}
                    </span>
                  ))}
                </div>

                <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 900, color: '#0f172a', margin: '0 0 14px', lineHeight: 1.25 }}>
                  {featuredPost.title}
                </h2>

                <p style={{ fontSize: '1.05rem', color: '#64748b', lineHeight: 1.6, margin: '0 0 20px' }}>
                  {featuredPost.excerpt}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '16px', marginTop: 'auto' }}>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>
                    By {featuredPost.author || 'LovelyCrafts'} • {featuredPost.publishedAt ? new Date(featuredPost.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently'}
                  </div>
                  <span style={{ color: '#e11d48', fontWeight: 800, fontSize: '0.95rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    Read Article →
                  </span>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* ARTICLES GRID */}
        {regularPosts.length > 0 && (
          <div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '24px' }}>
              Latest Stories &amp; Inspiration
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '28px' }}>
              {regularPosts.map((post) => (
                <Link
                  key={post.id || post.slug}
                  href={`/blog/${post.slug}`}
                  style={{
                    textDecoration: 'none',
                    color: 'inherit',
                    background: '#fff',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    border: '1px solid #f1f5f9',
                    boxShadow: '0 4px 18px rgba(0,0,0,0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  }}
                >
                  {/* CARD COVER */}
                  <div style={{ height: '200px', position: 'relative', background: '#f8fafc', overflow: 'hidden' }}>
                    <img
                      src={post.coverImage || 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80'}
                      alt={post.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      loading="lazy"
                    />
                  </div>

                  {/* CARD CONTENT */}
                  <div style={{ padding: '22px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', flexWrap: 'wrap' }}>
                      {(post.tags || []).slice(0, 2).map((t) => (
                        <span key={t} style={{ background: '#fff1f2', color: '#be185d', padding: '3px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700 }}>
                          #{t}
                        </span>
                      ))}
                    </div>

                    <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 10px', lineHeight: 1.35 }}>
                      {post.title}
                    </h4>

                    {post.excerpt && (
                      <p style={{ fontSize: '0.92rem', color: '#64748b', lineHeight: 1.55, margin: '0 0 18px', flex: 1 }}>
                        {post.excerpt}
                      </p>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f8fafc', paddingTop: '14px', marginTop: 'auto' }}>
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                        {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently'}
                      </span>
                      <span style={{ color: '#e11d48', fontWeight: 700, fontSize: '0.85rem' }}>
                        Read More →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* BOTTOM PROMO CTA */}
        <section style={{ marginTop: '64px', background: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 50%, #fdf2f8 100%)', borderRadius: '24px', border: '1.5px solid #fecdd3', padding: '48px 32px', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🎁💌</div>
          <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 900, color: '#881337', margin: '0 0 12px' }}>
            Ready to turn your feelings into a real surprise?
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#9f1239', maxWidth: '580px', margin: '0 auto 24px', lineHeight: 1.6 }}>
            Browse over 18+ interactive gift templates with photo puzzles, memory roadmaps, voice notes, and romantic animations.
          </p>
          <Link
            href="/templates"
            style={{
              background: 'linear-gradient(135deg, #e11d48, #f43f5e)',
              color: '#fff',
              padding: '12px 28px',
              borderRadius: '12px',
              fontWeight: 800,
              fontSize: '1.05rem',
              textDecoration: 'none',
              display: 'inline-block',
              boxShadow: '0 6px 20px rgba(225,29,72,0.3)',
            }}
          >
            Explore All Gift Templates ✨
          </Link>
        </section>

      </div>
    </main>
  );
}
