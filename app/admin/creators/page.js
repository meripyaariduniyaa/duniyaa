'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { CREATOR_TIERS } from '@/lib/creator-club';
import { templates } from '@/lib/templates';
import { exportToExcel } from '@/lib/excel-export';
import {
  CreatorsIcon,
  DownloadIcon,
  SearchIcon,
  EditIcon,
  CheckIcon,
  CloseIcon,
  ExternalLinkIcon,
  CouponsIcon,
  ShieldIcon,
  SparklesIcon
} from '@/components/admin/AdminIcons';

function initials(name) {
  return (name || '?').split(' ').map((w) => w[0]).join('').substring(0, 2).toUpperCase();
}

export default function AdminCreatorsPage() {
  const { user } = useAuth();
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedCreator, setSelectedCreator] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleExportExcel = () => {
    const formatted = filteredCreators.map((c) => ({
      'Creator Name': c.name || 'Unnamed',
      'Email': c.email || '',
      'Slug Handle': c.slug || '',
      'Public URL': `https://lovelycrafts.in/c/${c.slug}`,
      'Tier': (c.tier || 'Starter').toUpperCase(),
      'Commission Rate (%)': `${c.commission_rate || 10}%`,
      'Assigned Coupon': c.coupon_code || 'Pending',
      'Phone / WhatsApp': c.phone || '',
      'Instagram URL': c.instagram_url || '',
      'YouTube URL': c.youtube_url || '',
      'Application Status': c.status || 'active',
      'Featured Status': c.featured ? 'Yes' : 'No',
      'Joined Date': c.created_at ? new Date(c.created_at).toLocaleDateString() : '',
    }));
    exportToExcel(formatted, 'creators_registry', 'Creators');
  };

  const loadCreators = async () => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/admin/creators', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.creators) setCreators(data.creators);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCreators();
  }, [user]);

  const openEdit = (creator) => {
    setSelectedCreator(creator);
    setEditForm({
      id: creator.id,
      name: creator.name || '',
      slug: creator.slug || '',
      email: creator.email || '',
      coupon_code: creator.coupon_code || '',
      status: creator.status || 'active',
      tier: creator.tier || 'starter',
      tier_override: creator.tier_override || '',
      commission_rate_override: creator.commission_rate_override !== null && creator.commission_rate_override !== undefined ? creator.commission_rate_override : '',
      discount_rate: creator.discount_rate || 10,
      featured: Boolean(creator.featured),
      recommended_template_ids: Array.isArray(creator.recommended_template_ids) ? creator.recommended_template_ids : [],
    });
    setMessage('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/admin/creators', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...editForm,
          tier_override: editForm.tier_override ? editForm.tier_override : null,
          commission_rate_override: editForm.commission_rate_override !== '' ? Number(editForm.commission_rate_override) : null,
          discount_rate: Number(editForm.discount_rate) || 10,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update creator');

      setMessage('Creator updated successfully!');
      loadCreators();
      setTimeout(() => setSelectedCreator(null), 1200);
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleApprove = async (creator) => {
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/admin/creators', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ id: creator.id, status: 'active' })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not approve creator');
      loadCreators();

      // Automatically open email client with prefilled approval details
      setTimeout(() => {
        const siteUrl = window.location.origin;
        const coupon = creator.coupon_code || data.coupon_code || 'ACTIVE';
        const subject = `Your LovelyCrafts Creator Account is Approved! 🚀`;
        const bodyText = `🎉 Hey ${creator.name}!\n\n` +
          `Great news! Your LovelyCrafts Creator Club account has been approved and activated.\n\n` +
          `🔑 YOUR CREATOR DASHBOARD LOGIN:\n` +
          `• Portal: ${siteUrl}/creator/login\n` +
          `• Email: ${creator.email}\n\n` +
          `🛍️ YOUR AUDIENCE PERKS & COMMISSIONS:\n` +
          `• Coupon Code: ${coupon}\n` +
          `• Your Public Creator Page: ${siteUrl}/creators/${creator.slug}\n\n` +
          `Log in with your Google account (${creator.email}) or password at ${siteUrl}/creator/login to view your earnings!\n\nWelcome aboard! ✨`;

        window.location.href = `mailto:${encodeURIComponent(creator.email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
      }, 300);
    } catch (err) {
      alert(err.message);
    }
  };

  const filteredCreators = creators.filter((c) => {
    const matchFilter = filter === 'all' || c.status === filter;
    if (!matchFilter) return false;
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    const name = (c.name || '').toLowerCase();
    const email = (c.email || '').toLowerCase();
    const slug = (c.slug || '').toLowerCase();
    const coupon = (c.coupon_code || '').toLowerCase();
    return name.includes(term) || email.includes(term) || slug.includes(term) || coupon.includes(term);
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* HEADER & ACTIONS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px', letterSpacing: '-0.02em' }}>
            Creator Partners Directory
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
            Audit partner accounts, commission percentages, assigned promo codes, and storefront showcases.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportExcel}
          disabled={loading || creators.length === 0}
          style={{
            background: '#0f172a',
            color: '#ffffff',
            border: 'none',
            padding: '10px 18px',
            borderRadius: '10px',
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: loading || creators.length === 0 ? 'not-allowed' : 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 2px 6px rgba(15, 23, 42, 0.15)',
            opacity: loading || creators.length === 0 ? 0.6 : 1,
            transition: 'all 0.15s'
          }}
        >
          <DownloadIcon size={16} />
          <span>Export Excel (.xlsx)</span>
        </button>
      </div>

      {/* FILTER TABS & SEARCH */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* STATUS PILLS */}
        <div style={{ display: 'flex', gap: '4px', background: '#ffffff', padding: '4px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          {['all', 'pending', 'active', 'suspended'].map((tab) => {
            const count = tab === 'pending' ? creators.filter((c) => c.status === 'pending').length : 0;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setFilter(tab)}
                style={{
                  background: filter === tab ? '#0f172a' : 'transparent',
                  color: filter === tab ? '#ffffff' : '#64748b',
                  border: 'none',
                  padding: '7px 16px',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>{tab}</span>
                {count > 0 && (
                  <span style={{ background: '#ef4444', color: '#fff', borderRadius: '999px', padding: '1px 6px', fontSize: '0.7rem', fontWeight: 800 }}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* SEARCH INPUT */}
        <div style={{ position: 'relative', width: '320px', maxWidth: '100%' }}>
          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', display: 'flex' }}>
            <SearchIcon size={16} />
          </span>
          <input
            type="text"
            placeholder="Search creator, email, slug, code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 36px',
              borderRadius: '10px',
              border: '1px solid #e2e8f0',
              background: '#ffffff',
              fontSize: '0.82rem',
              color: '#0f172a',
              outline: 'none',
              boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
            }}
          />
        </div>

      </div>

      {/* DATA TABLE */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '3px solid #e2e8f0', borderTopColor: '#0284c7', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
          <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>Loading creators registry...</p>
        </div>
      ) : (
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '900px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '14px 20px', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Creator Partner</th>
                  <th style={{ padding: '14px 20px', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Custom URL &amp; Code</th>
                  <th style={{ padding: '14px 20px', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tier &amp; Commission</th>
                  <th style={{ padding: '14px 20px', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                  <th style={{ padding: '14px 20px', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCreators.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '60px 20px', textAlign: 'center', color: '#94a3b8' }}>
                      <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>No creator partners found</div>
                      <div style={{ fontSize: '0.8rem' }}>Try adjusting your search criteria or filter selection.</div>
                    </td>
                  </tr>
                ) : (
                  filteredCreators.map((c) => {
                    const statusColor = c.status === 'active' ? '#15803d' : c.status === 'pending' ? '#b45309' : '#b91c1c';
                    const statusBg = c.status === 'active' ? '#dcfce7' : c.status === 'pending' ? '#fef3c7' : '#fee2e2';
                    const statusBorder = c.status === 'active' ? '#bbf7d0' : c.status === 'pending' ? '#fde68a' : '#fecaca';

                    return (
                      <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.1s ease' }}>
                        
                        {/* CREATOR INFO */}
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', border: '1px solid #e2e8f0', overflow: 'hidden', flexShrink: 0 }}>
                              {c.profile_image ? (
                                <img src={c.profile_image} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              ) : (
                                initials(c.name)
                              )}
                            </div>
                            <div>
                              <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span>{c.name}</span>
                                {c.featured && (
                                  <span style={{ fontSize: '0.68rem', fontWeight: 700, background: '#fef3c7', color: '#b45309', padding: '1px 6px', borderRadius: '4px' }}>Featured</span>
                                )}
                              </div>
                              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{c.email}</div>
                              {c.phone && <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>{c.phone}</div>}
                            </div>
                          </div>
                        </td>

                        {/* STORE LINK & COUPON */}
                        <td style={{ padding: '16px 20px' }}>
                          <a
                            href={`https://lovelycrafts.in/c/${c.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.82rem', color: '#0284c7', fontFamily: 'monospace', fontWeight: 600, textDecoration: 'none' }}
                          >
                            <span>/c/{c.slug}</span>
                            <ExternalLinkIcon size={12} />
                          </a>
                          {c.coupon_code && (
                            <div style={{ marginTop: '4px' }}>
                              <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#0f172a', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem' }}>
                                {c.coupon_code}
                              </span>
                            </div>
                          )}
                        </td>

                        {/* TIER & COMMISSION */}
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0f172a', textTransform: 'capitalize' }}>
                            {c.tier_override ? `${c.tier_override} (Override)` : c.tier || 'Starter'}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                            Commission: <strong style={{ color: '#0f172a' }}>{c.commission_rate_override !== null && c.commission_rate_override !== undefined ? `${c.commission_rate_override}%` : 'Standard Tier'}</strong>
                          </div>
                        </td>

                        {/* STATUS */}
                        <td style={{ padding: '16px 20px' }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '3px 10px',
                              borderRadius: '999px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              textTransform: 'capitalize',
                              background: statusBg,
                              color: statusColor,
                              border: `1px solid ${statusBorder}`,
                            }}
                          >
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: statusColor }} />
                            <span>{c.status || 'active'}</span>
                          </span>
                        </td>

                        {/* ACTIONS */}
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            {c.status === 'pending' && (
                              <button
                                type="button"
                                onClick={() => handleApprove(c)}
                                style={{ background: '#15803d', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                              >
                                <CheckIcon size={14} />
                                <span>Approve</span>
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => openEdit(c)}
                              style={{ background: '#ffffff', color: '#0f172a', border: '1px solid #e2e8f0', padding: '6px 12px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}
                            >
                              <EditIcon size={14} />
                              <span>Configure</span>
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {selectedCreator && editForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(11, 15, 25, 0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#fff', borderRadius: '20px', padding: '32px', maxWidth: '640px', width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 60px rgba(0,0,0,0.18)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 2px', letterSpacing: '-0.01em' }}>
                  Configure Creator: {selectedCreator.name}
                </h2>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>Override tier assignments, commission rates, and featured templates.</p>
              </div>
              <button type="button" onClick={() => setSelectedCreator(null)} style={{ background: '#f1f5f9', border: 'none', padding: '6px', borderRadius: '8px', cursor: 'pointer', color: '#64748b' }}>
                <CloseIcon size={18} />
              </button>
            </div>

            {message && (
              <div style={{ padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '16px', background: message.startsWith('Error') ? '#fee2e2' : '#f0fdf4', color: message.startsWith('Error') ? '#991b1b' : '#15803d', border: message.startsWith('Error') ? '1px solid #fecaca' : '1px solid #bbf7d0' }}>
                {message}
              </div>
            )}

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.04em' }}>Account Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#0f172a', outline: 'none' }}
                  >
                    <option value="active">Active / Approved</option>
                    <option value="pending">Pending Review</option>
                    <option value="suspended">Suspended</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.04em' }}>Featured Showcase</label>
                  <select
                    value={editForm.featured ? 'yes' : 'no'}
                    onChange={(e) => setEditForm({ ...editForm, featured: e.target.value === 'yes' })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#0f172a', outline: 'none' }}
                  >
                    <option value="no">Standard Listing</option>
                    <option value="yes">Showcase in Featured Grid</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.04em' }}>Assigned Promo Code</label>
                  <input
                    type="text"
                    placeholder="e.g. MAYA10"
                    value={editForm.coupon_code}
                    onChange={(e) => setEditForm({ ...editForm, coupon_code: e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, '') })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontWeight: 700, fontFamily: 'monospace', background: '#f8fafc', color: '#0f172a', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.04em' }}>Customer Discount (%)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={editForm.discount_rate}
                    onChange={(e) => setEditForm({ ...editForm, discount_rate: Number(e.target.value) })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#0f172a', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.04em' }}>Tier Override (Optional)</label>
                  <select
                    value={editForm.tier_override}
                    onChange={(e) => setEditForm({ ...editForm, tier_override: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#0f172a', outline: 'none' }}
                  >
                    <option value="">Auto-calculated by Volume</option>
                    {CREATOR_TIERS.map((t) => (
                      <option key={t.id} value={t.id}>{t.name} ({t.commissionRate}%)</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.04em' }}>Commission % Override</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="Leave blank for tier default"
                    value={editForm.commission_rate_override}
                    onChange={(e) => setEditForm({ ...editForm, commission_rate_override: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#0f172a', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              {/* RECOMMENDED TEMPLATES */}
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.04em' }}>
                  Recommended Storefront Templates (Up to 4)
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '8px', maxHeight: '160px', overflowY: 'auto', border: '1px solid #e2e8f0', padding: '10px', borderRadius: '10px', background: '#f8fafc' }}>
                  {templates.slice(0, 14).map((t) => {
                    const isSelected = editForm.recommended_template_ids.includes(t.id);
                    return (
                      <label key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', cursor: 'pointer', background: isSelected ? '#ffffff' : 'transparent', padding: '6px 8px', borderRadius: '6px', border: isSelected ? '1px solid #0284c7' : '1px solid transparent', color: '#0f172a' }}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              if (editForm.recommended_template_ids.length >= 4) {
                                alert('You can select a maximum of 4 recommended templates.');
                                return;
                              }
                              setEditForm({ ...editForm, recommended_template_ids: [...editForm.recommended_template_ids, t.id] });
                            } else {
                              setEditForm({ ...editForm, recommended_template_ids: editForm.recommended_template_ids.filter((id) => id !== t.id) });
                            }
                          }}
                          style={{ accentColor: '#0f172a' }}
                        />
                        <span>{t.title}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setSelectedCreator(null)}
                  style={{ background: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0', padding: '10px 18px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{ background: '#0f172a', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
                >
                  {saving ? 'Saving...' : 'Save Configuration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
