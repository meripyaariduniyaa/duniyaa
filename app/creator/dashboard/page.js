'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';

export default function CreatorDashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Profile editing state
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: '',
    bio: '',
    phone: '',
    instagram_url: '',
    youtube_url: '',
    profile_image: '',
  });
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCoupon, setCopiedCoupon] = useState(false);

  const loadDashboard = async () => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/creator/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Could not load dashboard');

      setData(result);
      if (result.creator) {
        setProfileForm({
          name: result.creator.name || '',
          bio: result.creator.bio || '',
          phone: result.creator.phone || '',
          instagram_url: result.creator.instagram_url || '',
          youtube_url: result.creator.youtube_url || '',
          profile_image: result.creator.profile_image || '',
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/creator/login');
      return;
    }
    if (user) {
      loadDashboard();
    }
  }, [user, authLoading, router]);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setAvatarError('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setAvatarError('Image must be under 10MB.');
      return;
    }

    setUploadingAvatar(true);
    setAvatarError('');
    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'vkcgnlm1';
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'apology_images';

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });
      const uploadData = await res.json();
      if (uploadData.secure_url) {
        setProfileForm((prev) => ({ ...prev, profile_image: uploadData.secure_url }));
      } else {
        setAvatarError(uploadData?.error?.message || 'Failed to upload photo.');
      }
    } catch (err) {
      setAvatarError('Upload failed. Please check your internet connection.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/creator/me', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileForm),
      });
      if (!res.ok) throw new Error('Failed to update profile');
      setEditingProfile(false);
      loadDashboard();
    } catch (err) {
      alert(err.message);
    } finally {
      setSavingProfile(false);
    }
  };

  if (authLoading || loading) {
    return (
      <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#6b7280' }}>
          <div style={{ fontSize: '2.5rem', animation: 'bounce 1s infinite' }}>👑</div>
          <p style={{ marginTop: '12px', fontWeight: 600 }}>Loading Creator Dashboard...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ textAlign: 'center', background: '#fff', padding: '36px', borderRadius: '20px', border: '1px solid #fecaca', maxWidth: '460px' }}>
          <div style={{ fontSize: '2.5rem', color: '#dc2626', marginBottom: '12px' }}>⚠️</div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>Access Error</h2>
          <p style={{ color: '#6b7280', marginBottom: '20px' }}>{error}</p>
          <Link href="/creators" style={{ background: '#e11d48', color: '#fff', padding: '10px 20px', borderRadius: '10px', textDecoration: 'none', fontWeight: 600 }}>
            Join Creator Club
          </Link>
        </div>
      </main>
    );
  }

  if (!data?.creator || !data.applied) {
    return (
      <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ textAlign: 'center', background: '#fff', padding: '40px', borderRadius: '24px', border: '1px solid #fecdd3', maxWidth: '480px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>✨</div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#111827', marginBottom: '8px' }}>Join the Creator Club</h2>
          <p style={{ color: '#6b7280', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '24px' }}>
            You haven&apos;t applied to the Creator Club yet. Apply now to get your exclusive coupon code, custom referral link, and earn up to 18% commission.
          </p>
          <Link href="/creators#apply" style={{ background: '#e11d48', color: '#fff', padding: '12px 24px', borderRadius: '12px', fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 14px rgba(225,29,72,0.2)' }}>
            Start Creator Application 🚀
          </Link>
        </div>
      </main>
    );
  }

  const { creator, summary, coupons = [], gifts = [] } = data;

  if (creator.status === 'pending') {
    return (
      <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ textAlign: 'center', background: '#fff', padding: '40px', borderRadius: '24px', border: '1px solid #fde68a', maxWidth: '520px', boxShadow: '0 8px 24px rgba(217,119,6,0.08)' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '16px' }}>⏳</div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#92400e', marginBottom: '8px' }}>Application Under Review</h2>
          <p style={{ color: '#b45309', fontSize: '1rem', lineHeight: 1.6, marginBottom: '24px' }}>
            Hey <strong>{creator.name}</strong>! Your application for <code>lovelycrafts.in/c/{creator.slug}</code> has been received and is currently under review by our admin team.
          </p>
          <div style={{ background: '#fffbeb', padding: '16px', borderRadius: '12px', textAlign: 'left', fontSize: '0.85rem', color: '#78350f', border: '1px dashed #fcd34d' }}>
            <div>📌 Status: <strong>Pending Admin Approval</strong></div>
            <div>📬 Email: <strong>{creator.email}</strong></div>
            <div>🔗 Requested URL: <strong>lovelycrafts.in/c/{creator.slug}</strong></div>
          </div>
        </div>
      </main>
    );
  }

  const referralUrl = typeof window !== 'undefined' ? `${window.location.origin}/c/${creator.slug}` : `https://lovelycrafts.in/c/${creator.slug}`;
  const primaryCouponCode = creator.coupon_code || coupons[0]?.code;

  return (
    <main style={{ minHeight: '100vh', background: '#fafafa', padding: '0 0 80px' }}>
      
      {/* CREATOR PORTAL TOPBAR */}
      <nav style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '12px 24px', position: 'sticky', top: 0, zIndex: 40, marginBottom: '32px' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '1.1rem', fontWeight: 800, color: '#111827' }}>
              <span style={{ fontSize: '1.3rem' }}>❤️</span> Lovely<span style={{ color: '#e11d48' }}>Crafts</span>
            </Link>
            <span style={{ background: '#ffe4e6', color: '#be123c', padding: '2px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
              Creator Portal
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>
              {user?.email}
            </span>
            <Link href="/" style={{ fontSize: '0.85rem', color: '#4b5563', textDecoration: 'none', fontWeight: 600 }}>
              🏠 Main Site
            </Link>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '0 16px' }}>

        {/* PROFILE HEADER CARD */}
        <div style={{ background: '#fff', borderRadius: '20px', padding: '28px', border: '1px solid #f3f4f6', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '68px', height: '68px', borderRadius: '50%', background: '#ffe4e6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', border: '2px solid #fda4af', overflow: 'hidden' }}>
              {creator.profile_image ? <img src={creator.profile_image} alt={creator.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '💖'}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                  {creator.name}
                </h1>
                <span style={{ background: '#ecfdf5', color: '#065f46', fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: '999px' }}>
                  ✓ Active Creator
                </span>
              </div>
              <p style={{ color: '#6b7280', fontSize: '0.9rem', margin: '4px 0 0' }}>
                Tier: <strong style={{ color: '#e11d48', textTransform: 'capitalize' }}>{summary?.tier?.emoji} {summary?.tier?.name}</strong> • Commission Rate: <strong>{summary?.rate}%</strong>
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <Link href={`/creators/${creator.slug}`} target="_blank" style={{ background: '#f3f4f6', color: '#374151', padding: '10px 16px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>
              👁️ View Public Page
            </Link>
            <button
              type="button"
              onClick={() => setEditingProfile(!editingProfile)}
              style={{ background: '#ffe4e6', color: '#e11d48', border: 'none', padding: '10px 16px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}
            >
              ✏️ Edit Profile
            </button>
          </div>
        </div>

        {/* EDIT PROFILE MODAL / DRAWER */}
        {editingProfile && (
          <div style={{ background: '#fff', borderRadius: '20px', padding: '28px', border: '1px solid #fecdd3', marginBottom: '24px', boxShadow: '0 8px 24px rgba(225,29,72,0.06)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#111827', marginBottom: '16px' }}>
              Edit Public Profile Details
            </h3>
            <form onSubmit={handleSaveProfile} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              {/* Profile Photo Uploader */}
              <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '16px', background: '#fff5f7', padding: '14px 18px', borderRadius: '14px', border: '1px dashed #f472b6' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#ffe4e6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', border: '2px solid #f43f5e', overflow: 'hidden', flexShrink: 0 }}>
                  {profileForm.profile_image ? (
                    <img src={profileForm.profile_image} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    '📸'
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>
                    Profile Picture
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <label style={{ background: '#e11d48', color: '#fff', padding: '6px 14px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700, cursor: uploadingAvatar ? 'not-allowed' : 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={uploadingAvatar}
                        onChange={handleAvatarUpload}
                        style={{ display: 'none' }}
                      />
                      {uploadingAvatar ? '⏳ Uploading...' : profileForm.profile_image ? '🔄 Change Photo' : '📤 Upload Photo'}
                    </label>
                    {profileForm.profile_image && (
                      <button
                        type="button"
                        onClick={() => setProfileForm((prev) => ({ ...prev, profile_image: '' }))}
                        style={{ background: '#f3f4f6', color: '#6b7280', border: 'none', padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  {avatarError && (
                    <div style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '4px', fontWeight: 600 }}>
                      ⚠️ {avatarError}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '4px' }}>Public Creator Name</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '4px' }}>Phone / WhatsApp</label>
                <input
                  type="tel"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '4px' }}>Instagram URL</label>
                <input
                  type="url"
                  value={profileForm.instagram_url}
                  onChange={(e) => setProfileForm({ ...profileForm, instagram_url: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '4px' }}>YouTube URL</label>
                <input
                  type="url"
                  value={profileForm.youtube_url}
                  onChange={(e) => setProfileForm({ ...profileForm, youtube_url: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '4px' }}>Bio Description</label>
                <textarea
                  rows={2}
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.9rem', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', gridColumn: '1 / -1' }}>
                <button
                  type="submit"
                  disabled={savingProfile}
                  style={{ background: '#e11d48', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
                >
                  {savingProfile ? 'Saving...' : 'Save Profile'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingProfile(false)}
                  style={{ background: '#f3f4f6', color: '#4b5563', border: 'none', padding: '8px 14px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* METRICS OVERVIEW */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', border: '1px solid #f3f4f6', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
            <span style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: 600 }}>⏳ Pending Commission</span>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#e11d48', marginTop: '4px' }}>
              ₹{((summary?.pending || 0) / 100).toFixed(2)}
            </div>
            <small style={{ color: '#9ca3af', fontSize: '0.75rem' }}>Paid out in next batch</small>
          </div>

          <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', border: '1px solid #f3f4f6', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
            <span style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: 600 }}>💰 Paid Earnings</span>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#059669', marginTop: '4px' }}>
              ₹{((summary?.paid || 0) / 100).toFixed(2)}
            </div>
            <small style={{ color: '#9ca3af', fontSize: '0.75rem' }}>Lifetime payouts</small>
          </div>

          <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', border: '1px solid #f3f4f6', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
            <span style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: 600 }}>🎁 Attributed Orders</span>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#111827', marginTop: '4px' }}>
              {summary?.totalOrders || 0}
            </div>
            <small style={{ color: '#9ca3af', fontSize: '0.75rem' }}>{summary?.monthOrders || 0} this month</small>
          </div>

          <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', border: '1px solid #f3f4f6', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
            <span style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: 600 }}>🔗 Referral Clicks</span>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#111827', marginTop: '4px' }}>
              {summary?.clicks || 0}
            </div>
            <small style={{ color: '#9ca3af', fontSize: '0.75rem' }}>Unique 30-day link hits</small>
          </div>
        </div>

        {/* SHARING TOOLKIT */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          
          {/* REFERRAL LINK CARD */}
          <div style={{ background: '#fff', borderRadius: '20px', padding: '24px', border: '1px solid #f3f4f6', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span style={{ fontSize: '1.4rem' }}>🔗</span>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111827', margin: 0 }}>Your 30-Day Referral Link</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '14px', lineHeight: 1.4 }}>
              Share this link in your YouTube/Instagram bio. Anyone clicking it gets tagged to you for 30 days.
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                readOnly
                value={referralUrl}
                style={{ flex: 1, padding: '10px 12px', borderRadius: '10px', border: '1px solid #e5e7eb', background: '#f9fafb', fontSize: '0.85rem', color: '#111827' }}
              />
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(referralUrl);
                  setCopiedLink(true);
                  setTimeout(() => setCopiedLink(false), 2000);
                }}
                style={{ background: copiedLink ? '#059669' : '#e11d48', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '10px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', whiteSpace: 'nowrap' }}
              >
                {copiedLink ? '✓ Copied' : 'Copy Link'}
              </button>
            </div>
          </div>

          {/* CREATOR COUPON CARD */}
          <div style={{ background: '#fff', borderRadius: '20px', padding: '24px', border: '1px solid #f3f4f6', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span style={{ fontSize: '1.4rem' }}>🏷️</span>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111827', margin: 0 }}>Your Creator Discount Code</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '14px', lineHeight: 1.4 }}>
              Followers can enter this code during checkout for a discount and direct creator attribution.
            </p>
            {primaryCouponCode ? (
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  readOnly
                  value={primaryCouponCode}
                  style={{ flex: 1, padding: '10px 12px', borderRadius: '10px', border: '1px solid #e5e7eb', background: '#fff1f2', fontSize: '0.95rem', fontWeight: 800, color: '#e11d48', fontFamily: 'monospace' }}
                />
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(primaryCouponCode);
                    setCopiedCoupon(true);
                    setTimeout(() => setCopiedCoupon(false), 2000);
                  }}
                  style={{ background: copiedCoupon ? '#059669' : '#e11d48', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '10px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', whiteSpace: 'nowrap' }}
                >
                  {copiedCoupon ? '✓ Copied' : 'Copy Code'}
                </button>
              </div>
            ) : (
              <div style={{ color: '#9ca3af', fontSize: '0.85rem', padding: '10px', background: '#f9fafb', borderRadius: '10px' }}>
                Admin will assign your custom coupon code shortly.
              </div>
            )}
          </div>
        </div>

        {/* CREATOR GIFTS SECTION */}
        {gifts.length > 0 && (
          <div style={{ background: '#fff', borderRadius: '20px', padding: '24px', border: '1px solid #f3f4f6', marginBottom: '32px', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#111827', marginBottom: '16px' }}>
              🎁 Complimentary VIP Gift Passes
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
              {gifts.map((gift) => (
                <div key={gift.id} style={{ background: '#fdf2f8', border: '1px dashed #f472b6', borderRadius: '14px', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#be185d', textTransform: 'uppercase' }}>
                      {gift.template_id}
                    </span>
                    <span style={{ fontSize: '0.75rem', background: gift.claimed ? '#e5e7eb' : '#dcfce7', color: gift.claimed ? '#6b7280' : '#15803d', padding: '2px 8px', borderRadius: '6px', fontWeight: 700 }}>
                      {gift.claimed ? 'Claimed' : 'Active 100% Free'}
                    </span>
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: 'monospace', color: '#831843', marginBottom: '10px' }}>
                    {gift.code}
                  </div>
                  {!gift.claimed && (
                    <Link
                      href={`/create?template=${gift.template_id}&coupon=${gift.code}`}
                      style={{ display: 'block', textAlign: 'center', background: '#db2777', color: '#fff', padding: '8px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none' }}
                    >
                      Redeem &amp; Craft Free Gift ✨
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PAYOUT HISTORY */}
        <div style={{ background: '#fff', borderRadius: '20px', padding: '24px', border: '1px solid #f3f4f6', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#111827', marginBottom: '16px' }}>
            💳 Payout Batches &amp; History
          </h3>
          {data.summary?.payouts?.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '500px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #f3f4f6' }}>
                    <th style={{ padding: '10px 14px', fontSize: '0.85rem', color: '#6b7280' }}>Date</th>
                    <th style={{ padding: '10px 14px', fontSize: '0.85rem', color: '#6b7280' }}>Amount</th>
                    <th style={{ padding: '10px 14px', fontSize: '0.85rem', color: '#6b7280' }}>Method</th>
                    <th style={{ padding: '10px 14px', fontSize: '0.85rem', color: '#6b7280' }}>UTR / Reference</th>
                    <th style={{ padding: '10px 14px', fontSize: '0.85rem', color: '#6b7280' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.summary.payouts.map((p) => (
                    <tr key={p.id} style={{ borderBottom: '1px solid #f9fafb' }}>
                      <td style={{ padding: '12px 14px', fontSize: '0.85rem', color: '#374151' }}>
                        {p.paid_at ? new Date(p.paid_at).toLocaleDateString() : 'Recent'}
                      </td>
                      <td style={{ padding: '12px 14px', fontWeight: 700, color: '#059669', fontSize: '0.95rem' }}>
                        ₹{((p.amount || 0) / 100).toFixed(2)}
                      </td>
                      <td style={{ padding: '12px 14px', fontSize: '0.85rem', color: '#4b5563' }}>{p.method || 'UPI'}</td>
                      <td style={{ padding: '12px 14px', fontSize: '0.85rem', color: '#6b7280', fontFamily: 'monospace' }}>{p.reference || '—'}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{ background: '#ecfdf5', color: '#065f46', fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: '6px' }}>
                          ✓ Paid
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{ color: '#9ca3af', fontSize: '0.9rem', textAlign: 'center', margin: '20px 0' }}>
              No payout batches processed yet. Pending commissions are batched and paid to your UPI/Bank.
            </p>
          )}
        </div>

      </div>
    </main>
  );
}
