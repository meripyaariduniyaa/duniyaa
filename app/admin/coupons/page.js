'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { templates } from '@/lib/templates';

export default function AdminCouponsPage() {
  const { user } = useAuth();
  const [coupons, setCoupons] = useState([]);
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal / Form state
  const [isCreating, setIsCreating] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    creator_id: '',
    type: 'creator',
    discount_percent: 20,
    expires_at: '',
    max_uses: '',
    minimum_amount: '',
    applicable_template_ids: [],
    active: true,
    primary_for_creator: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const loadData = async () => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      const [cRes, crRes] = await Promise.all([
        fetch('/api/admin/coupons', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/creators', { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const cData = await cRes.json();
      const crData = await crRes.json();
      if (cData.coupons) setCoupons(cData.coupons);
      if (crData.creators) setCreators(crData.creators);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create coupon');

      setMessage('✓ Coupon created successfully!');
      setIsCreating(false);
      setFormData({
        code: '',
        creator_id: '',
        type: 'creator',
        discount_percent: 20,
        expires_at: '',
        max_uses: '',
        minimum_amount: '',
        applicable_template_ids: [],
        active: true,
        primary_for_creator: true,
      });
      loadData();
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (coupon) => {
    try {
      const token = await user.getIdToken();
      await fetch('/api/admin/coupons', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ id: coupon.id, active: !coupon.active })
      });
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeletePermanent = async (coupon) => {
    if (!confirm(`Are you sure you want to PERMANENTLY delete coupon "${coupon.code}"?\n\nThis will remove the code from the system and unlink it from any creator. Historical orders and commissions will retain immutable snapshots.`)) {
      return;
    }

    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/admin/coupons', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ id: coupon.id })
      });
      if (!res.ok) throw new Error('Failed to delete coupon');
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>
            Custom Coupon Manager
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
            Create and manage creator promo codes, campaign discounts, and gift passes with permanent deletion controls.
          </p>
        </div>

        <button
          type="button"
          onClick={() => { setIsCreating(true); setMessage(''); }}
          style={{ background: '#e11d48', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(225,29,72,0.2)' }}
        >
          + Create Custom Coupon
        </button>
      </div>

      {message && (
        <div style={{ padding: '12px 16px', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '20px', background: message.startsWith('✓') ? '#dcfce7' : '#fee2e2', color: message.startsWith('✓') ? '#15803d' : '#b91c1c' }}>
          {message}
        </div>
      )}

      {/* COUPONS TABLE */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Loading coupons...</div>
      ) : (
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '850px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '12px 16px', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase' }}>Coupon Code</th>
                  <th style={{ padding: '12px 16px', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase' }}>Type &amp; Creator</th>
                  <th style={{ padding: '12px 16px', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase' }}>Discount</th>
                  <th style={{ padding: '12px 16px', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase' }}>Scope &amp; Limits</th>
                  <th style={{ padding: '12px 16px', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase' }}>Redemptions</th>
                  <th style={{ padding: '12px 16px', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '12px 16px', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
                      No custom database coupons created yet.
                    </td>
                  </tr>
                ) : (
                  coupons.map((c) => {
                    const matchedCreator = creators.find((cr) => cr.id === c.creator_id);
                    return (
                      <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '1rem', color: '#881337', background: '#ffe4e6', padding: '2px 8px', borderRadius: '6px' }}>
                            {c.code}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, color: c.type === 'creator' ? '#7c3aed' : c.type === 'gift' ? '#db2777' : '#0284c7' }}>
                            {c.type || 'campaign'}
                          </span>
                          {matchedCreator && (
                            <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#0f172a' }}>
                              {matchedCreator.name}
                            </div>
                          )}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontWeight: 800, color: '#e11d48', fontSize: '0.95rem' }}>
                            {c.discount_percent}% OFF
                          </div>
                        </td>
                        <td style={{ padding: '14px 16px', fontSize: '0.8rem', color: '#64748b' }}>
                          <div>
                            Templates: {c.applicable_template_ids?.length > 0 ? `${c.applicable_template_ids.length} specific` : 'All 18+'}
                          </div>
                          {c.expires_at && <div>Exp: {new Date(c.expires_at).toLocaleDateString()}</div>}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontWeight: 700, color: '#0f172a' }}>
                            {c.usage_count || 0} {c.max_uses ? `/ ${c.max_uses}` : 'uses'}
                          </div>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <button
                            type="button"
                            onClick={() => handleToggleActive(c)}
                            style={{
                              border: 'none',
                              padding: '4px 10px',
                              borderRadius: '999px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              background: c.active ? '#dcfce7' : '#fee2e2',
                              color: c.active ? '#15803d' : '#b91c1c',
                            }}
                          >
                            {c.active ? '● Active' : '○ Inactive'}
                          </button>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              type="button"
                              onClick={() => handleDeletePermanent(c)}
                              title="Permanently delete coupon record"
                              style={{ background: '#fff1f2', color: '#be123c', border: '1px solid #fecdd3', padding: '6px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                            >
                              🗑️ Delete
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

      {/* CREATE COUPON MODAL */}
      {isCreating && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '16px' }}>
          <div style={{ background: '#fff', borderRadius: '20px', padding: '28px', maxWidth: '580px', width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Create Custom Coupon
              </h2>
              <button type="button" onClick={() => setIsCreating(false)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#64748b' }}>✕</button>
            </div>

            <form onSubmit={handleCreateCoupon} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Coupon Code * (Uppercase)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MAYA30"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, '') })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: 700, fontFamily: 'monospace' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Discount Percent (1–100%) *</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={formData.discount_percent}
                    onChange={(e) => setFormData({ ...formData, discount_percent: Number(e.target.value) })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Coupon Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  >
                    <option value="creator">Creator Attribution Coupon</option>
                    <option value="campaign">General Campaign Coupon</option>
                    <option value="gift">1-Use VIP Gift Pass</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Link to Creator (Optional)</label>
                  <select
                    value={formData.creator_id}
                    onChange={(e) => setFormData({ ...formData, creator_id: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  >
                    <option value="">None (Platform Coupon)</option>
                    {creators.map((c) => (
                      <option key={c.id} value={c.id}>{c.name} (/c/{c.slug})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Expiry Date (Optional)</label>
                  <input
                    type="date"
                    value={formData.expires_at}
                    onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Max Usages (Optional)</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="Unlimited if empty"
                    value={formData.max_uses}
                    onChange={(e) => setFormData({ ...formData, max_uses: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
              </div>

              {/* TEMPLATE SCOPE */}
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  Template Scope (Leave unselected for all templates)
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '6px', maxHeight: '130px', overflowY: 'auto', border: '1px solid #e2e8f0', padding: '8px', borderRadius: '8px' }}>
                  {templates.slice(0, 14).map((t) => {
                    const isSelected = formData.applicable_template_ids.includes(t.id);
                    return (
                      <label key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({ ...formData, applicable_template_ids: [...formData.applicable_template_ids, t.id] });
                            } else {
                              setFormData({ ...formData, applicable_template_ids: formData.applicable_template_ids.filter((id) => id !== t.id) });
                            }
                          }}
                        />
                        <span>{t.icon || '🎁'} {t.title}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  style={{ background: '#f1f5f9', color: '#475569', border: 'none', padding: '10px 18px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{ background: '#e11d48', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
                >
                  {submitting ? 'Creating...' : 'Create Coupon ✨'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
