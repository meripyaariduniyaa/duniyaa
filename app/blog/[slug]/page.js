import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAdminDb } from '@/lib/firebase-admin';
import { SITE_URL, SITE_NAME } from '@/lib/seo';
import BlogBlocks from '@/components/BlogBlocks';
import BlogShareButtons from '@/components/BlogShareButtons';

export const revalidate = 60; // ISR

const SEED_POSTS = {
  '10-creative-virtual-birthday-surprises': {
    id: 'seed-1',
    slug: '10-creative-virtual-birthday-surprises',
    title: '10 Creative Virtual Birthday Surprises for Long-Distance Relationships',
    excerpt: 'Distance shouldn’t stop you from creating an unforgettable midnight celebration. Here is how to create interactive digital surprises they will cherish forever.',
    coverImage: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80',
    tags: ['birthday', 'long distance', 'guides'],
    author: 'LovelyCrafts Editorial',
    publishedAt: '2026-09-01T00:00:00.000Z',
    blocks: [
      {
        type: 'paragraph',
        content: 'Being in a long-distance relationship during birthdays can feel bittersweet. You want to wrap them in a giant hug, sing at the top of your lungs at midnight, and watch their eyes light up when they unwrap a gift. But even across different cities or time zones, modern digital surprises can create moments that feel deeply personal and magical.',
      },
      {
        type: 'heading',
        level: 2,
        content: '1. The Midnight Interactive Countdown Experience',
      },
      {
        type: 'paragraph',
        content: 'Instead of sending a standard plain text message on WhatsApp, send an interactive link that locks until the exact stroke of midnight. When they tap the link, it begins a celebratory animation with confetti, floating polaroid memories of the two of you, and an audio note recorded with your voice.',
      },
      {
        type: 'callout',
        calloutType: 'tip',
        title: 'Pro Tip for Midnight Surprises',
        content: 'Pair your interactive note with their favorite background song. Music connects directly to memory and nostalgia, instantly bridging the physical distance.',
      },
      {
        type: 'heading',
        level: 2,
        content: '2. The Digital Photo Puzzle Challenge',
      },
      {
        type: 'paragraph',
        content: 'Turn your favorite goofy selfie or travel memory into an interactive jigsaw puzzle. They must slide the pieces together on their phone screen to unlock your heartfelt hidden message.',
      },
      {
        type: 'quote',
        content: 'The distance is only physical. The effort you put into a digital experience proves how close you truly are.',
        attribution: 'LovelyCrafts Stories',
      },
      {
        type: 'heading',
        level: 2,
        content: '3. An "Open When..." Digital Vault',
      },
      {
        type: 'paragraph',
        content: 'Gift them an interactive collection of virtual envelopes they can open on different occasions throughout their birthday week:\n\n• Open when you miss my hugs\n• Open when you need a laugh\n• Open when you want to remember our first date',
      },
      {
        type: 'cta',
        title: 'Create Your Birthday Surprise in 2 Minutes',
        content: 'Choose from 18+ interactive templates with photo puzzles, memory roadmaps, and custom music.',
        link: '/templates/birthday',
        buttonText: 'Craft Virtual Birthday Surprise →',
      },
    ],
  },
  'how-to-write-an-emotional-apology-letter': {
    id: 'seed-2',
    slug: 'how-to-write-an-emotional-apology-letter',
    title: 'How to Write a Sincere Apology Letter When Words Fail You in Person',
    excerpt: 'Saying sorry is tough, but a thoughtful, private digital letter with shared memories and gentle music gives both of you space to heal.',
    coverImage: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1200&q=80',
    tags: ['apology', 'relationships', 'emotions'],
    author: 'LovelyCrafts Editorial',
    publishedAt: '2026-08-28T00:00:00.000Z',
    blocks: [
      {
        type: 'paragraph',
        content: 'In the heat of a conflict or misunderstanding, emotions run high and words often come out wrong. Giving each other breathing room is essential, but silence can also cause unnecessary anxiety. A thoughtful, written apology allows you to articulate exactly what went wrong without defensive interruptions.',
      },
      {
        type: 'heading',
        level: 2,
        content: 'The 4 Pillars of a Real Apology',
      },
      {
        type: 'list',
        ordered: true,
        items: [
          'Acknowledge the specific mistake without saying "if" or "but".',
          'Validate their emotional experience and hurt feelings.',
          'State clearly how you plan to avoid repeating the mistake.',
          'Offer space and patience for them to process without demanding immediate forgiveness.',
        ],
      },
      {
        type: 'callout',
        calloutType: 'heart',
        title: 'Why a Digital Letter Works',
        content: 'Unlike a rushed instant message, a crafted digital letter gives the reader privacy to absorb your thoughts at their own pace with soft ambient music.',
      },
      {
        type: 'cta',
        title: 'Craft a Gentle Apology Experience',
        content: 'Send a quiet, private page with your words, a heartfelt audio note, and shared moments.',
        link: '/templates/emotional-apology',
        buttonText: 'Craft Apology Card →',
      },
    ],
  },
  'modern-proposal-ideas-interactive-story': {
    id: 'seed-3',
    slug: 'modern-proposal-ideas-interactive-story',
    title: 'The Modern Digital Proposal: How to Pop the Question Interactively',
    excerpt: 'Take your partner on a nostalgic photo-by-photo interactive journey of your relationship before revealing the ultimate question.',
    coverImage: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1200&q=80',
    tags: ['proposal', 'romance', 'guides'],
    author: 'LovelyCrafts Editorial',
    publishedAt: '2026-08-20T00:00:00.000Z',
    blocks: [
      {
        type: 'paragraph',
        content: 'Proposals don’t always require a stadium jumbotron or an elaborate flash mob. In fact, some of the most moving proposals happen in intimate, private moments that honor the quiet journey of two people falling in love.',
      },
      {
        type: 'heading',
        level: 2,
        content: 'A Walk Down Memory Lane',
      },
      {
        type: 'paragraph',
        content: 'By presenting your partner with a customized digital scrapbook that unfolds chapter by chapter — the cafe where you first met, your first spontaneous road trip, the inside jokes only the two of you understand — you build emotional anticipation leading up to the big question.',
      },
      {
        type: 'cta',
        title: 'Craft Your Proposal Experience',
        content: 'Set up an interactive question reveal with "Yes" confetti fireworks and custom romantic melodies.',
        link: '/templates/proposal',
        buttonText: 'Craft Proposal Surprise →',
      },
    ],
  },
};

async function getPostBySlug(slug) {
  try {
    const db = getAdminDb();
    const snap = await db.collection('blogs').where('slug', '==', slug).limit(1).get();

    if (!snap.empty) {
      const doc = snap.docs[0];
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        publishedAt: data.publishedAt?.toDate?.()?.toISOString() || data.publishedAt || data.createdAt?.toDate?.()?.toISOString() || null,
      };
    }
  } catch (err) {
    console.error('Error fetching blog post by slug:', err);
  }

  // Check fallback seed posts
  if (SEED_POSTS[slug]) {
    return SEED_POSTS[slug];
  }

  return null;
}

async function getRelatedPosts(currentSlug, tags = []) {
  try {
    const db = getAdminDb();
    const snap = await db.collection('blogs').where('status', '==', 'published').limit(6).get();
    if (!snap.empty) {
      return snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter((p) => p.slug !== currentSlug)
        .slice(0, 3);
    }
  } catch (err) {
    // fallback
  }

  return Object.values(SEED_POSTS)
    .filter((p) => p.slug !== currentSlug)
    .slice(0, 3);
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found — LovelyCrafts',
    };
  }

  const title = `${post.title} — LovelyCrafts`;
  const description = post.excerpt || 'Read this inspiring article on digital surprises, gift ideas, and emotional connections on LovelyCrafts.';
  const cover = post.coverImage || `${SITE_URL}/og-banner.jpg`;
  const postUrl = `${SITE_URL}/blog/${post.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      title: post.title,
      description,
      url: postUrl,
      siteName: SITE_NAME,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author || 'LovelyCrafts Editorial'],
      images: [
        {
          url: cover,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: [cover],
    },
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(slug, post.tags || []);
  const postUrl = `${SITE_URL}/blog/${post.slug}`;

  // JSON-LD Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage || `${SITE_URL}/og-banner.jpg`,
    author: {
      '@type': 'Organization',
      name: post.author || 'LovelyCrafts Editorial',
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/icon.png`,
      },
    },
    datePublished: post.publishedAt || new Date().toISOString(),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
  };

  return (
    <main style={{ minHeight: '100vh', background: '#ffffff', color: '#0f172a', paddingBottom: '100px' }}>
      
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* BREADCRUMB & ARTICLE HEADER */}
      <article style={{ maxWidth: '840px', margin: '0 auto', padding: '40px 24px 0' }}>
        
        {/* BREADCRUMB */}
        <nav aria-label="Breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#64748b', marginBottom: '24px' }}>
          <Link href="/" style={{ color: '#64748b', textDecoration: 'none' }}>Home</Link>
          <span>/</span>
          <Link href="/blog" style={{ color: '#64748b', textDecoration: 'none' }}>Blog</Link>
          <span>/</span>
          <span style={{ color: '#0f172a', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '300px' }}>
            {post.title}
          </span>
        </nav>

        {/* TAGS */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
          {(post.tags || []).map((tag) => (
            <span
              key={tag}
              style={{
                background: '#ffe4e6',
                color: '#e11d48',
                padding: '4px 12px',
                borderRadius: '999px',
                fontSize: '0.78rem',
                fontWeight: 700,
                textTransform: 'uppercase',
              }}
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* TITLE */}
        <h1 style={{ fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.025em', lineHeight: 1.18, margin: '0 0 20px' }}>
          {post.title}
        </h1>

        {/* EXCERPT SUBTITLE */}
        {post.excerpt && (
          <p style={{ fontSize: '1.25rem', color: '#475569', lineHeight: 1.6, margin: '0 0 28px' }}>
            {post.excerpt}
          </p>
        )}

        {/* AUTHOR & SHARE BAR */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', padding: '18px 0', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9', marginBottom: '36px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg, #f43f5e, #fb7185)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem' }}>
              ❤️
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a' }}>
                {post.author || 'LovelyCrafts Editorial'}
              </div>
              <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Recently'} • 4 min read
              </div>
            </div>
          </div>

          <BlogShareButtons title={post.title} url={postUrl} />
        </div>

        {/* FEATURED COVER IMAGE */}
        {post.coverImage && (
          <div style={{ borderRadius: '20px', overflow: 'hidden', marginBottom: '40px', boxShadow: '0 12px 35px rgba(0,0,0,0.08)', background: '#f8fafc' }}>
            <img
              src={post.coverImage}
              alt={post.title}
              style={{ width: '100%', maxHeight: '520px', objectFit: 'cover', display: 'block' }}
            />
          </div>
        )}

        {/* ARTICLE BLOCKS */}
        <div style={{ margin: '0 0 56px' }}>
          <BlogBlocks blocks={post.blocks} />
        </div>

        {/* FOOTER SHARE & AUTHOR BOX */}
        <div style={{ background: '#f8fafc', padding: '32px', borderRadius: '20px', border: '1px solid #e2e8f0', marginBottom: '60px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px', borderBottom: '1px solid #e2e8f0', paddingBottom: '20px' }}>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0f172a' }}>
              Enjoyed this guide? Share it with someone special:
            </div>
            <BlogShareButtons title={post.title} url={postUrl} />
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'linear-gradient(135deg, #e11d48, #f43f5e)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.4rem', flexShrink: 0 }}>
              ✨
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a', marginBottom: '4px' }}>
                About LovelyCrafts
              </div>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6 }}>
                LovelyCrafts is India’s favorite platform for crafting heartfelt, private digital surprises. From midnight birthday count-downs and romantic proposals to apology letters and long-distance gifts, we make your emotions unforgettable.
              </p>
            </div>
          </div>
        </div>

      </article>

      {/* RELATED ARTICLES CAROUSEL / GRID */}
      {relatedPosts.length > 0 && (
        <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
          <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '24px', textAlign: 'center' }}>
            More Guides &amp; Inspiration
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {relatedPosts.map((rPost) => (
              <Link
                key={rPost.id || rPost.slug}
                href={`/blog/${rPost.slug}`}
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  background: '#fff',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: '1px solid #f1f5f9',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {rPost.coverImage && (
                  <div style={{ height: '160px', overflow: 'hidden' }}>
                    <img
                      src={rPost.coverImage}
                      alt={rPost.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      loading="lazy"
                    />
                  </div>
                )}
                <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: '0 0 8px', lineHeight: 1.3 }}>
                    {rPost.title}
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5, margin: '0 0 12px', flex: 1 }}>
                    {rPost.excerpt}
                  </p>
                  <span style={{ color: '#e11d48', fontWeight: 700, fontSize: '0.82rem', marginTop: 'auto' }}>
                    Read Guide →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

    </main>
  );
}
