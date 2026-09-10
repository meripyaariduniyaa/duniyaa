'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { templates } from '@/lib/templates';
import {
  CouponsIcon,
  PlusIcon,
  TrashIcon,
  CheckIcon,
  CloseIcon,
  SearchIcon,
  CreatorsIcon
} from '@/components/admin/AdminIcons';

export default function AdminCouponsPage() {
  const { user } = useAuth();
  const [coupons, setCoupons] = useState([]);
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Modal / Form state
  const [isCreating, setIsCreating] = useState(false);
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

      setMessage('Coupon created successfully!');
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

  const filteredCoupons = coupons.filter((c) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    const code = (c.code || '').toLowerCase();
    const creator = (creators.find((cr) => cr.id === c.creator_id)?.name || '').toLowerCase();
    return code.includes(term) || creator.includes(term);
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* HEADER & ACTIONS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px', letterSpacing: '-0.02em' }}>
            Coupons &amp; Promo Codes
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
            Manage creator promo codes, campaign discounts, and gift passes with redemption rules.
          </p>
        </div>

        <button
          type="button"
          onClick={() => { setIsCreating(true); setMessage(''); }}
          style={{
            background: '#0f172a',
            color: '#fff',
            border: 'none',
            padding: '10px 18px',
            borderRadius: '10px',
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(15, 23, 42, 0.15)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <PlusIcon size={16} />
          <span>Create Custom Coupon</span>
        </button>
      </div>

      {message && (
        <div style={{ padding: '12px 16px', borderRadius: '10px', fontSize: '0.85rem', background: message.startsWith('Error') ? '#fee2e2' : '#f0fdf4', color: message.startsWith('Error') ? '#991b1b' : '#15803d', border: message.startsWith('Error') ? '1px solid #fecaca' : '1px solid #bbf7d0' }}>
          {message}
        </div>
      )}

      {/* SEARCH BAR */}
      <div style={{ position: 'relative', width: '320px', maxWidth: '100%' }}>
        <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', display: 'flex' }}>
          <SearchIcon size={16} />
        </span>
        <input
          type="text"
          placeholder="Search code or creator name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: '100%', padding: '8px 12px 8px 36px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '0.82rem', outline: 'none', background: '#fff' }}
        />
      </div>

      {/* COUPONS TABLE */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '3px solid #e2e8f0', borderTopColor: '#0284c7', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
          <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>Loading active promo codes...</p>
        </div>
      ) : (
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '900px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '14px 20px', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Coupon Code</th>
                  <th style={{ padding: '14px 20px', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Type &amp; Attribution</th>
                  <th style={{ padding: '14px 20px', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Discount</th>
                  <th style={{ padding: '14px 20px', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Redemptions</th>
                  <th style={{ padding: '14px 20px', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                  <th style={{ padding: '14px 20px', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCoupons.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '60px 20px', textAlign: 'center', color: '#94a3b8' }}>
                      <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>No coupons found</div>
                      <div style={{ fontSize: '0.8rem' }}>Create a custom coupon code or adjust search.</div>
                    </td>
                  </tr>
                ) : (
                  filteredCoupons.map((c) => {
                    const matchedCreator = creators.find((cr) => cr.id === c.creator_id);
                    return (
                      <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.1s ease' }}>
                        
                        {/* CODE */}
                        <td style={{ padding: '16px 20px' }}>
                          <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '0.95rem', color: '#0f172a', background: '#f1f5f9', padding: '3px 8px', borderRadius: '6px' }}>
                            {c.code}
                          </span>
                        </td>

                        {/* TYPE & CREATOR */}
                        <td style={{ padding: '16px 20px' }}>
                          <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 700, color: c.type === 'creator' ? '#7c3aed' : c.type === 'gift' ? '#ea580c' : '#0284c7', background: c.type === 'creator' ? '#f5f3ff' : c.type === 'gift' ? '#fff7ed' : '#f0f9ff', padding: '2px 6px', borderRadius: '4px' }}>
                            {c.type || 'campaign'}
                          </span>
                          {matchedCreator && (
                            <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#0f172a', marginTop: '4px' }}>
                              {matchedCreator.name}
                            </div>
                          )}
                        </td>

                        {/* DISCOUNT */}
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#15803d' }}>
                            {c.discount_percent}% OFF
                          </div>
                          {c.max_uses && <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Limit: {c.max_uses} uses</div>}
                        </td>

                        {/* USAGE */}
                        <td style={{ padding: '16px 20px', fontSize: '0.85rem', color: '#475569' }}>
                          <strong>{c.used_count || 0}</strong> uses
                        </td>

                        {/* STATUS */}
                        <td style={{ padding: '16px 20px' }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              padding: '2px 8px',
                              borderRadius: '999px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              background: c.active ? '#dcfce7' : '#f1f5f9',
                              color: c.active ? '#15803d' : '#64748b',
                              border: `1px solid ${c.active ? '#bbf7d0' : '#e2e8f0'}`,
                            }}
                          >
                            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: c.active ? '#22c55e' : '#94a3b8' }} />
                            <span>{c.active ? 'Active' : 'Disabled'}</span>
                          </span>
                        </td>

                        {/* ACTIONS */}
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <button
                              type="button"
                              onClick={() => handleToggleActive(c)}
                              style={{
                                background: '#ffffff',
                                border: '1px solid #e2e8f0',
                                color: c.active ? '#ea580c' : '#15803d',
                                padding: '6px 10px',
                                borderRadius: '6px',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                cursor: 'pointer'
                              }}
                            >
                              {c.active ? 'Disable' : 'Enable'}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeletePermanent(c)}
                              style={{
                                background: '#ffffff',
                                border: '1px solid #fecaca',
                                color: '#b91c1c',
                                padding: '6px 8px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center'
                              }}
                              title="Delete permanently"
                            >
                              <TrashIcon size={14} />
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

      {/* CREATE MODAL */}
      {isCreating && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(11, 15, 25, 0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#fff', borderRadius: '20px', padding: '32px', maxWidth: '580px', width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 60px rgba(0,0,0,0.18)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 2px', letterSpacing: '-0.01em' }}>
                  Create Custom Promo Code
                </h2>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>Configure promo code rules, discount rate, and creator assignment.</p>
              </div>
              <button type="button" onClick={() => setIsCreating(false)} style={{ background: '#f1f5f9', border: 'none', padding: '6px', borderRadius: '8px', cursor: 'pointer', color: '#64748b' }}>
                <CloseIcon size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.04em' }}>Coupon Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FESTIVE20"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, '') })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontWeight: 700, fontFamily: 'monospace', background: '#f8fafc', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.04em' }}>Discount % *</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={formData.discount_percent}
                    onChange={(e) => setFormData({ ...formData, discount_percent: Number(e.target.value) })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.04em' }}>Coupon Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', outline: 'none' }}
                  >
                    <option value="creator">Creator Referral Code</option>
                    <option value="campaign">General Marketing Campaign</option>
                    <option value="gift">VIP Gift Pass (100% Off)</option>
                  </select>
                </div>
              </div>

              {formData.type === 'creator' && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.04em' }}>Assign to Creator</label>
                  <select
                    value={formData.creator_id}
                    onChange={(e) => setFormData({ ...formData, creator_id: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', outline: 'none' }}
                  >
                    <option value="">Select Creator</option>
                    {creators.map((c) => (
                      <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
                    ))}
                  </select>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.04em' }}>Max Redemptions</label>
                  <input
                    type="number"
                    placeholder="Unlimited if empty"
                    value={formData.max_uses}
                    onChange={(e) => setFormData({ ...formData, max_uses: e.target.value ? Number(e.target.value) : '' })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.04em' }}>Expiration Date</label>
                  <input
                    type="date"
                    value={formData.expires_at}
                    onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  style={{ background: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0', padding: '10px 18px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{ background: '#0f172a', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
                >
                  {submitting ? 'Creating...' : 'Create Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
