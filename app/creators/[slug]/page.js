'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { templates } from '@/lib/templates';

export default function PublicCreatorPage() {
  const params = useParams();
  const slug = params?.slug;

  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/creators/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error('Creator not found');
        return res.json();
      })
      .then((data) => {
        if (data.creator) {
          setCreator(data.creator);
        } else {
          setError('Creator profile not found.');
        }
      })
      .catch((err) => setError(err.message || 'Could not load creator profile.'))
      .finally(() => setLoading(false));
  }, [slug]);

  const copyCoupon = () => {
    if (!creator?.primaryCoupon?.code) return;
    navigator.clipboard.writeText(creator.primaryCoupon.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading) {
    return (
      <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#6b7280' }}>
          <div style={{ fontSize: '2.5rem', animation: 'bounce 1s infinite' }}>💖</div>
          <p style={{ marginTop: '12px', fontWeight: 600 }}>Loading creator showcase...</p>
        </div>
      </main>
    );
  }

  if (error || !creator) {
    return (
      <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ textAlign: 'center', background: '#fff', padding: '40px', borderRadius: '20px', border: '1px solid #f3f4f6', maxWidth: '460px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔍</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>Creator Profile Not Found</h1>
          <p style={{ color: '#6b7280', marginBottom: '24px' }}>This creator link might be inactive or does not exist.</p>
          <Link href="/creators" style={{ background: '#e11d48', color: '#fff', padding: '10px 20px', borderRadius: '10px', textDecoration: 'none', fontWeight: 600 }}>
            Explore LovelyCrafts Creators
          </Link>
        </div>
      </main>
    );
  }

  // Find recommended templates
  const recommendedIds = creator.recommended_template_ids || [];
  const recommendedTemplates = templates.filter((t) => recommendedIds.includes(t.id)).slice(0, 4);
  const displayTemplates = recommendedTemplates.length > 0 ? recommendedTemplates : templates.slice(0, 4);

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #fff1f2 0%, #fff 30%, #fafafa 100%)', padding: '40px 16px 80px' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>

        {/* CREATOR HERO CARD */}
        <div
          style={{
            background: '#fff',
            borderRadius: '24px',
            padding: '36px',
            border: '1px solid #ffe4e6',
            boxShadow: '0 12px 30px rgba(225,29,72,0.06)',
            textAlign: 'center',
            marginBottom: '40px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: '#ffe4e6',
              margin: '0 auto 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.5rem',
              overflow: 'hidden',
              border: '3px solid #fda4af',
              boxShadow: '0 4px 12px rgba(225,29,72,0.15)',
            }}
          >
            {creator.profile_image ? (
              <img src={creator.profile_image} alt={creator.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              '💖'
            )}
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#ecfdf5', color: '#065f46', padding: '4px 12px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '8px' }}>
            ✓ Verified LovelyCrafts Creator
          </div>

          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#111827', margin: '0 0 8px' }}>
            {creator.name}
          </h1>

          {creator.bio && (
            <p style={{ fontSize: '1.05rem', color: '#4b5563', maxWidth: '580px', margin: '0 auto 20px', lineHeight: 1.6 }}>
              {creator.bio}
            </p>
          )}

          {/* SOCIAL LINKS */}
          {(creator.instagram_url || creator.youtube_url) && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '24px' }}>
              {creator.instagram_url && (
                <a
                  href={creator.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '10px', background: '#fdf2f8', color: '#be185d', fontWeight: 600, fontSize: '0.85rem', textDecoration: 'none', border: '1px solid #fbcfe8' }}
                >
                  📷 Instagram
                </a>
              )}
              {creator.youtube_url && (
                <a
                  href={creator.youtube_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '10px', background: '#fef2f2', color: '#b91c1c', fontWeight: 600, fontSize: '0.85rem', textDecoration: 'none', border: '1px solid #fecaca' }}
                >
                  ▶️ YouTube
                </a>
              )}
            </div>
          )}

          {/* EXCLUSIVE DISCOUNT COUPON BANNER */}
          {creator.primaryCoupon && (
            <div
              style={{
                maxWidth: '480px',
                margin: '0 auto',
                background: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)',
                border: '2px dashed #fb7185',
                borderRadius: '16px',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div style={{ textAlign: 'left' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#be123c', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {creator.name}&apos;s Special Discount
                </span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#881337', fontFamily: 'monospace' }}>
                  {creator.primaryCoupon.code}
                </div>
                <small style={{ color: '#e11d48', fontWeight: 600 }}>
                  {creator.primaryCoupon.discount_percent}% OFF at Checkout
                </small>
              </div>

              <button
                type="button"
                onClick={copyCoupon}
                style={{
                  background: copied ? '#059669' : '#e11d48',
                  color: '#fff',
                  border: 'none',
                  padding: '10px 18px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                  boxShadow: '0 4px 10px rgba(225,29,72,0.2)',
                }}
              >
                {copied ? '✓ Copied!' : 'Copy Code 📋'}
              </button>
            </div>
          )}
        </div>

        {/* RECOMMENDED EXPERIENCES */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                {creator.name}&apos;s Hand-Picked Favorites
              </h2>
              <p style={{ color: '#6b7280', fontSize: '0.95rem', margin: '4px 0 0' }}>
                Personalize these emotional surprises for your special someone with {creator.name}&apos;s discount code!
              </p>
            </div>
            <Link href="/templates" style={{ color: '#e11d48', fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem' }}>
              View All 18+ Gifts →
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
            {displayTemplates.map((template) => (
              <div
                key={template.id}
                style={{
                  background: '#fff',
                  borderRadius: '20px',
                  padding: '24px',
                  border: '1px solid #f3f4f6',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
              >
                <div>
                  <div style={{ fontSize: '2.4rem', marginBottom: '12px' }}>{template.icon || '🎁'}</div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>
                    {template.title}
                  </h3>
                  <p style={{ color: '#6b7280', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '16px' }}>
                    {template.description}
                  </p>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', paddingTop: '12px', borderTop: '1px solid #f3f4f6' }}>
                    <div>
                      <span style={{ fontSize: '0.85rem', color: '#9ca3af', textDecoration: 'line-through', marginRight: '6px' }}>
                        ₹{template.basePrice || 499}
                      </span>
                      <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#111827' }}>
                        ₹{template.price || 199}
                      </span>
                    </div>
                    {creator.primaryCoupon && (
                      <span style={{ fontSize: '0.75rem', background: '#ffe4e6', color: '#e11d48', padding: '2px 8px', borderRadius: '6px', fontWeight: 700 }}>
                        -{creator.primaryCoupon.discount_percent}% with {creator.primaryCoupon.code}
                      </span>
                    )}
                  </div>

                  <Link
                    href={`/create?template=${template.id}${creator.primaryCoupon ? `&coupon=${creator.primaryCoupon.code}` : ''}`}
                    style={{
                      display: 'block',
                      textAlign: 'center',
                      background: '#e11d48',
                      color: '#fff',
                      padding: '10px 16px',
                      borderRadius: '10px',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      textDecoration: 'none',
                      boxShadow: '0 4px 12px rgba(225,29,72,0.2)',
                    }}
                  >
                    ✨ Craft This Surprise
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
