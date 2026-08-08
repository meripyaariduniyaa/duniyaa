import Link from 'next/link';
import { notFound } from 'next/navigation';
import { templates } from '@/lib/templates';

const siteName = 'Lovely Crafts';
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lovelycrafts.in';

export async function generateStaticParams() {
  return templates.map((t) => ({
    id: t.id,
  }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const template = templates.find((t) => t.id === id);

  if (!template) {
    return {
      title: 'Template Not Found',
    };
  }

  const title = `${template.title} — Personalized Digital Gift Card & Surprise`;
  const description = `${template.description} Create a personalized ${template.title} with photo memories, custom interactive animations, and heartfelt messages.`;
  const url = `${baseUrl}/templates/${template.id}`;

  return {
    title,
    description,
    keywords: [...template.bestFor, 'digital gift', 'personalized card', 'online surprise', 'Lovely Crafts'],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${title} | ${siteName}`,
      description,
      url,
      type: 'article',
      siteName,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${siteName}`,
      description,
    },
  };
}

export default async function TemplateDetailPage({ params }) {
  const { id } = await params;
  const template = templates.find((t) => t.id === id);

  if (!template) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: template.title,
    description: template.description,
    image: `${baseUrl}/opengraph-image.png`,
    brand: {
      '@type': 'Brand',
      name: siteName,
    },
    offers: {
      '@type': 'Offer',
      price: template.price || 149,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      url: `${baseUrl}/templates/${template.id}`,
    },
  };

  const breadcrumbsLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Templates',
        item: `${baseUrl}/templates`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: template.title,
        item: `${baseUrl}/templates/${template.id}`,
      },
    ],
  };

  return (
    <main className="shell">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsLd) }}
      />

      <div className="main-content" style={{ maxWidth: '850px', margin: '0 auto' }}>
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: '#666' }}>
          <Link href="/" style={{ color: '#ec4899', textDecoration: 'none' }}>Home</Link>
          {' > '}
          <Link href="/templates" style={{ color: '#ec4899', textDecoration: 'none' }}>Templates</Link>
          {' > '}
          <span style={{ fontWeight: 600 }}>{template.title}</span>
        </nav>

        {/* Hero Section */}
        <div style={{ background: '#fff', borderRadius: '1.5rem', padding: '2.5rem 2rem', boxShadow: '0 10px 30px rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>{template.icon}</div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', marginBottom: '0.75rem', color: '#111' }}>
            {template.title}
          </h1>
          <p style={{ fontSize: '1.15rem', color: '#555', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            {template.description}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '2rem' }}>
            {template.bestFor.map((tag) => (
              <span key={tag} className="template-tag" style={{ fontSize: '0.85rem', padding: '0.3rem 0.75rem', background: '#ffe4e6', color: '#e11d48' }}>
                ✨ {tag}
              </span>
            ))}
            <span className="template-tag" style={{ fontSize: '0.85rem', padding: '0.3rem 0.75rem', background: '#f3f4f6', color: '#4b5563' }}>
              ⏱ {template.time} setup time
            </span>
            <span className="template-tag" style={{ fontSize: '0.85rem', padding: '0.3rem 0.75rem', background: '#fef3c7', color: '#b45309' }}>
              🏷️ ₹{template.price || 149} (50% Off)
            </span>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href={`/create?template=${template.id}`} className="btn-primary" style={{ padding: '0.8rem 1.8rem', fontSize: '1.05rem' }}>
              ✨ Create {template.title} Now
            </Link>
            <Link href="/templates" className="btn-secondary" style={{ padding: '0.8rem 1.5rem', fontSize: '1rem' }}>
              ← View All Templates
            </Link>
          </div>
        </div>

        {/* Details & Photo Requirements */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '1.25rem', border: '1px solid rgba(0,0,0,0.06)' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '0.75rem', color: '#e11d48' }}>📸 Photo Requirements</h2>
            <p style={{ fontSize: '0.95rem', color: '#444', marginBottom: '0.5rem' }}>
              <strong>Recommended photos:</strong> {template.photoRequirement.recommended} (Min {template.photoRequirement.min}, Max {template.photoRequirement.max})
            </p>
            <p style={{ fontSize: '0.9rem', color: '#666', fontStyle: 'italic', lineHeight: 1.5 }}>
              💡 {template.photoRequirement.tip}
            </p>
          </div>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '1.25rem', border: '1px solid rgba(0,0,0,0.06)' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '0.75rem', color: '#e11d48' }}>📝 What You&apos;ll Need</h2>
            <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.95rem', color: '#444', lineHeight: 1.7 }}>
              {template.detailsNeeded.map((detail, i) => (
                <li key={i}>{detail}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sample Prompt Ideas */}
        {template.prompts && template.prompts.length > 0 && (
          <div style={{ background: '#fff', padding: '1.8rem', borderRadius: '1.25rem', border: '1px solid rgba(0,0,0,0.06)', marginTop: '2rem' }}>
            <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: '#111' }}>💬 Sample Message Prompts & Ideas</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {template.prompts.map((prompt, i) => (
                <div key={i} style={{ background: '#fff1f2', padding: '0.9rem 1.2rem', borderRadius: '0.75rem', borderLeft: '4px solid #f43f5e', fontSize: '0.95rem', color: '#881337', fontStyle: 'italic' }}>
                  &ldquo;{prompt}&rdquo;
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tips section */}
        {template.tips && (
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '1.25rem 1.5rem', borderRadius: '1rem', marginTop: '2rem', color: '#166534', fontSize: '0.95rem' }}>
            <strong>💡 Creator Tip:</strong> {template.tips}
          </div>
        )}

        {/* Bottom CTA */}
        <div style={{ textAlign: 'center', marginTop: '3rem', marginBottom: '3rem', padding: '2.5rem', background: 'linear-gradient(135deg, #fff1f2, #ffe4e6)', borderRadius: '1.5rem' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', color: '#9f1239' }}>Ready to send a memory they&apos;ll cherish forever?</h2>
          <p style={{ color: '#be123c', marginBottom: '1.5rem' }}>Takes less than 3 minutes to customize and share securely on WhatsApp or message.</p>
          <Link href={`/create?template=${template.id}`} className="btn-primary" style={{ padding: '0.8rem 2rem', fontSize: '1.1rem' }}>
            Make {template.title} →
          </Link>
        </div>
      </div>
    </main>
  );
}
