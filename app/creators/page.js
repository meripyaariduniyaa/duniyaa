'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { signInWithGoogle } from '@/lib/firebase';
import { useAuth } from '@/components/AuthProvider';
import { CREATOR_TIERS } from '@/lib/creator-club';

export default function CreatorsLandingPage() {
  const { user } = useAuth();
  const [creators, setCreators] = useState([]);
  const [loadingCreators, setLoadingCreators] = useState(true);

  // Application form state
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    phone: '',
    bio: '',
    instagram_url: '',
    youtube_url: '',
    profile_image: '',
  });
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [appStatus, setAppStatus] = useState(null); // null | 'pending' | 'active' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Load public creators
  useEffect(() => {
    fetch('/api/creators/public')
      .then((res) => res.json())
      .then((data) => {
        if (data.creators) setCreators(data.creators);
      })
      .catch((err) => console.error('Failed to load creators:', err))
      .finally(() => setLoadingCreators(false));
  }, []);

  // Pre-fill form from user data
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || user.displayName || '',
        slug: prev.slug || (user.displayName || '').toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30),
        profile_image: prev.profile_image || user.photoURL || '',
      }));

      // Check current application status
      user.getIdToken().then((token) => {
        fetch('/api/creator/me', {
          headers: { Authorization: `Bearer ${token}` }
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.creator) {
              setAppStatus(data.creator.status);
            }
          })
          .catch(() => {});
      });
    }
  }, [user]);

  const handleGoogleSignIn = async () => {
    setAuthLoading(true);
    setErrorMessage('');
    const { error: authErr } = await signInWithGoogle();
    if (authErr) {
      setErrorMessage(authErr);
    }
    setAuthLoading(false);
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('Profile image must be under 10MB.');
      return;
    }

    setUploadingAvatar(true);
    setErrorMessage('');
    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'vkcgnlm1';
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'apology_images';

      const data = new FormData();
      data.append('file', file);
      data.append('upload_preset', uploadPreset);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: data,
      });
      const uploadResult = await res.json();
      if (uploadResult.secure_url) {
        setFormData((prev) => ({ ...prev, profile_image: uploadResult.secure_url }));
      } else {
        setErrorMessage(uploadResult?.error?.message || 'Failed to upload photo.');
      }
    } catch (err) {
      setErrorMessage('Upload failed. Please check your internet connection.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!user) {
      setErrorMessage('Please sign in with Google first.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/creator/application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit application.');
      }

      setAppStatus('pending');
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main style={{ minHeight: '100vh', background: 'radial-gradient(circle at 50% 0%, #ffe4e6 0%, #fff1f2 40%, #fafafa 100%)', padding: '40px 16px 80px' }}>
      <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
        
        {/* HERO SECTION */}
        <section style={{ textAlign: 'center', padding: '40px 0 60px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', background: '#ffe4e6', borderRadius: '999px', color: '#e11d48', fontWeight: 600, fontSize: '0.85rem', marginBottom: '20px', border: '1px solid #fecdd3' }}>
            ✨ LovelyCrafts Creator Club
          </div>
          <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.4rem)', fontWeight: 800, color: '#1f2937', lineHeight: 1.2, margin: '0 auto 16px', maxWidth: '800px' }}>
            Turn Your Romantic &amp; Aesthetic Content Into <span style={{ color: '#e11d48', background: 'linear-gradient(135deg, #e11d48, #be123c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Passive Income</span>
          </h1>
          <p style={{ fontSize: '1.15rem', color: '#4b5563', maxWidth: '650px', margin: '0 auto 32px', lineHeight: 1.6 }}>
            Share personalized digital experiences with your followers. Get your own creator discount code, earn up to <strong>18% recurring commission</strong>, and receive complimentary VIP gift passes.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <a href="#apply" style={{ background: '#e11d48', color: '#fff', padding: '14px 28px', borderRadius: '12px', fontWeight: 700, textDecoration: 'none', boxShadow: '0 8px 20px rgba(225,29,72,0.25)', transition: 'all 0.2s' }}>
              🚀 Join Creator Club
            </a>
            <Link href="/creator/login" style={{ background: '#fff', color: '#374151', padding: '14px 24px', borderRadius: '12px', fontWeight: 600, textDecoration: 'none', border: '1px solid #e5e7eb', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              🔑 Creator Dashboard Login
            </Link>
          </div>
        </section>

        {/* PERKS GRID */}
        <section style={{ marginBottom: '60px' }}>
          <h2 style={{ textAlign: 'center', fontSize: '1.8rem', fontWeight: 700, color: '#1f2937', marginBottom: '32px' }}>
            Why Top Creators Love Partnering With Us
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #f3f4f6', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🏷️</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>Custom Discount Code</h3>
              <p style={{ color: '#6b7280', fontSize: '0.95rem', lineHeight: 1.5 }}>
                Offer your followers 20%–30% exclusive discounts on all personalized digital gifts with your branded coupon.
              </p>
            </div>
            <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #f3f4f6', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🔗</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>30-Day Referral Tracking</h3>
              <p style={{ color: '#6b7280', fontSize: '0.95rem', lineHeight: 1.5 }}>
                Share your short link (<code style={{ color: '#e11d48' }}>/c/yourname</code>). Any customer purchase made within 30 days is automatically attributed to you.
              </p>
            </div>
            <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #f3f4f6', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '12px' }}>💸</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>Generous Tiered Commissions</h3>
              <p style={{ color: '#6b7280', fontSize: '0.95rem', lineHeight: 1.5 }}>
                Earn 15% to 18% commission on net customer payments with transparent real-time analytics and fast UPI/bank payouts.
              </p>
            </div>
            <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #f3f4f6', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🎁</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>Free Creator Gift Passes</h3>
              <p style={{ color: '#6b7280', fontSize: '0.95rem', lineHeight: 1.5 }}>
                Get complimentary 100% discount codes to create personalized gifts for your partner, best friends, or family.
              </p>
            </div>
          </div>
        </section>

        {/* TIER BREAKDOWN TABLE */}
        <section style={{ marginBottom: '60px', background: '#fff', borderRadius: '20px', padding: '32px', border: '1px solid #f3f4f6', boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#1f2937', marginBottom: '8px', textAlign: 'center' }}>
            Creator Club Tiers &amp; Commission Scale
          </h2>
          <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '28px' }}>
            As your referrals grow, your tier and commission rate increase automatically.
          </p>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '500px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f3f4f6' }}>
                  <th style={{ padding: '12px 16px', color: '#4b5563', fontSize: '0.9rem' }}>Tier</th>
                  <th style={{ padding: '12px 16px', color: '#4b5563', fontSize: '0.9rem' }}>Requirement</th>
                  <th style={{ padding: '12px 16px', color: '#4b5563', fontSize: '0.9rem' }}>Commission Rate</th>
                  <th style={{ padding: '12px 16px', color: '#4b5563', fontSize: '0.9rem' }}>Perks</th>
                </tr>
              </thead>
              <tbody>
                {CREATOR_TIERS.map((tier) => (
                  <tr key={tier.id} style={{ borderBottom: '1px solid #f9fafb' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 700, color: '#111827' }}>
                      <span style={{ marginRight: '8px' }}>{tier.emoji}</span>
                      {tier.name}
                    </td>
                    <td style={{ padding: '14px 16px', color: '#4b5563' }}>
                      {tier.minOrders === 0 ? 'Starting level' : `${tier.minOrders}+ delivered gifts`}
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: 700, color: '#e11d48' }}>
                      {tier.commissionRate}%
                    </td>
                    <td style={{ padding: '14px 16px', color: '#6b7280', fontSize: '0.9rem' }}>
                      {tier.id === 'elite' ? '👑 VIP support + Custom perks' : tier.id === 'partner' ? '💜 Dedicated gifts + Priority payouts' : '✨ Custom Coupon & Live Dashboard'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* FEATURED CREATORS */}
        {creators.length > 0 && (
          <section style={{ marginBottom: '60px' }}>
            <h2 style={{ textAlign: 'center', fontSize: '1.6rem', fontWeight: 700, color: '#1f2937', marginBottom: '24px' }}>
              Meet Our Featured Creators
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
              {creators.map((c) => (
                <Link
                  key={c.id}
                  href={`/creators/${c.slug}`}
                  style={{
                    background: '#fff',
                    borderRadius: '16px',
                    padding: '20px',
                    textAlign: 'center',
                    textDecoration: 'none',
                    border: '1px solid #f3f4f6',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                    transition: 'transform 0.2s',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      width: '72px',
                      height: '72px',
                      borderRadius: '50%',
                      background: '#ffe4e6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.8rem',
                      marginBottom: '12px',
                      overflow: 'hidden',
                      border: '2px solid #fda4af',
                    }}
                  >
                    {c.profile_image ? (
                      <img src={c.profile_image} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      '💖'
                    )}
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>{c.name}</h3>
                  <span style={{ fontSize: '0.8rem', color: '#e11d48', fontWeight: 600, textTransform: 'capitalize' }}>
                    {c.tier} Creator
                  </span>
                  {c.bio && (
                    <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: '8px 0 0', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {c.bio}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* APPLICATION SECTION */}
        <section id="apply" style={{ background: '#fff', borderRadius: '24px', padding: '36px', border: '1px solid #fecdd3', boxShadow: '0 12px 32px rgba(225,29,72,0.06)' }}>
          <div style={{ maxWidth: '560px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#111827', textAlign: 'center', marginBottom: '8px' }}>
              Apply to the Creator Club
            </h2>
            <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '28px' }}>
              Free to join. Applications are reviewed within 24 hours.
            </p>

            {appStatus === 'pending' ? (
              <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '16px', padding: '28px', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>⏳</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#92400e', marginBottom: '8px' }}>Application Under Review</h3>
                <p style={{ color: '#b45309', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '20px' }}>
                  Thank you for applying! Our admin team is reviewing your profile. You will receive access to your Creator Dashboard as soon as you are approved.
                </p>
                <Link href="/creator/dashboard" style={{ background: '#d97706', color: '#fff', padding: '10px 20px', borderRadius: '10px', fontWeight: 600, textDecoration: 'none' }}>
                  Check Dashboard Status
                </Link>
              </div>
            ) : appStatus === 'active' || appStatus === 'approved' ? (
              <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '16px', padding: '28px', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🎉</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#065f46', marginBottom: '8px' }}>You are an Active Creator!</h3>
                <p style={{ color: '#047857', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '20px' }}>
                  Your account is fully approved. Visit your dashboard to view your referral links, coupons, and earnings.
                </p>
                <Link href="/creator/dashboard" style={{ background: '#059669', color: '#fff', padding: '12px 24px', borderRadius: '10px', fontWeight: 700, textDecoration: 'none' }}>
                  Go to Creator Dashboard 🚀
                </Link>
              </div>
            ) : (
              <div>
                {!user ? (
                  <div style={{ textAlign: 'center', padding: '20px', background: '#fff1f2', borderRadius: '16px', border: '1px dashed #fda4af' }}>
                    <p style={{ color: '#be123c', fontWeight: 600, marginBottom: '16px' }}>
                      Step 1: Sign in with your Google account to start your creator application
                    </p>
                    <button
                      type="button"
                      onClick={handleGoogleSignIn}
                      disabled={authLoading}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '10px',
                        background: '#fff',
                        color: '#374151',
                        border: '1px solid #d1d5db',
                        padding: '12px 24px',
                        borderRadius: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                      </svg>
                      {authLoading ? 'Signing in...' : 'Sign in with Google'}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApply} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ background: '#f9fafb', padding: '10px 14px', borderRadius: '10px', fontSize: '0.85rem', color: '#4b5563', border: '1px solid #f3f4f6' }}>
                      Signed in as: <strong>{user.email}</strong>
                    </div>

                    {/* Profile Picture Uploader */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', background: '#fff1f2', padding: '12px 16px', borderRadius: '12px', border: '1px dashed #f472b6' }}>
                      <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#ffe4e6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', border: '2px solid #f43f5e', overflow: 'hidden', flexShrink: 0 }}>
                        {formData.profile_image ? (
                          <img src={formData.profile_image} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          '📸'
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                          Profile Photo (Optional)
                        </div>
                        <label style={{ background: '#e11d48', color: '#fff', padding: '5px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, cursor: uploadingAvatar ? 'not-allowed' : 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <input
                            type="file"
                            accept="image/*"
                            disabled={uploadingAvatar}
                            onChange={handleAvatarUpload}
                            style={{ display: 'none' }}
                          />
                          {uploadingAvatar ? '⏳ Uploading...' : formData.profile_image ? '🔄 Change Photo' : '📤 Upload Photo'}
                        </label>
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                        Creator / Channel Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Maya &amp; Arjun"
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #d1d5db', fontSize: '0.95rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                        Desired Creator URL * (lovelycrafts.in/c/yourname)
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                        placeholder="e.g. mayavlogs"
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #d1d5db', fontSize: '0.95rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                        WhatsApp / Phone Number (for payout notifications)
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 9876543210"
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #d1d5db', fontSize: '0.95rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                        Instagram Profile Link
                      </label>
                      <input
                        type="url"
                        value={formData.instagram_url}
                        onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
                        placeholder="https://instagram.com/yourhandle"
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #d1d5db', fontSize: '0.95rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                        YouTube / TikTok Profile Link
                      </label>
                      <input
                        type="url"
                        value={formData.youtube_url}
                        onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
                        placeholder="https://youtube.com/@yourchannel"
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #d1d5db', fontSize: '0.95rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                        Short Bio (What content do you create?)
                      </label>
                      <textarea
                        rows={3}
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        placeholder="Tell us a little about your audience and vibe..."
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #d1d5db', fontSize: '0.95rem', resize: 'vertical' }}
                      />
                    </div>

                    {errorMessage && (
                      <div style={{ color: '#b91c1c', background: '#fef2f2', padding: '10px', borderRadius: '8px', fontSize: '0.85rem' }}>
                        {errorMessage}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={submitting}
                      style={{
                        background: '#e11d48',
                        color: '#fff',
                        border: 'none',
                        padding: '14px',
                        borderRadius: '12px',
                        fontWeight: 700,
                        fontSize: '1rem',
                        cursor: submitting ? 'not-allowed' : 'pointer',
                        marginTop: '8px',
                        boxShadow: '0 4px 14px rgba(225,29,72,0.2)',
                      }}
                    >
                      {submitting ? 'Submitting Application...' : 'Submit Creator Application ✨'}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </section>

      </div>
    </main>
  );
}
