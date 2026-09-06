'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { CREATOR_TIERS } from '@/lib/creator-club';
import { templates } from '@/lib/templates';

export default function AdminCreatorsPage() {
  const { user } = useAuth();
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedCreator, setSelectedCreator] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

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
      discount_rate: creator.discount_rate || 20,
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
          discount_rate: Number(editForm.discount_rate) || 20,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update creator');

      setMessage('✓ Creator updated successfully!');
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
      await fetch('/api/admin/creators', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ id: creator.id, status: 'active' })
      });
      loadCreators();
    } catch (err) {
      alert(err.message);
    }
  };

  const filteredCreators = creators.filter((c) => {
    if (filter === 'all') return true;
    return c.status === filter;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>
            Creator Management
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
            Approve applications, adjust commission rates, and select recommended templates.
          </p>
        </div>

        {/* STATUS FILTER PILLS */}
        <div style={{ display: 'flex', gap: '6px', background: '#e2e8f0', padding: '4px', borderRadius: '10px' }}>
          {['all', 'pending', 'active', 'suspended'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              style={{
                background: filter === tab ? '#fff' : 'transparent',
                color: filter === tab ? '#0f172a' : '#64748b',
                border: 'none',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: filter === tab ? 700 : 500,
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {tab} {tab === 'pending' && creators.filter((c) => c.status === 'pending').length > 0 && `(${creators.filter((c) => c.status === 'pending').length})`}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Loading creators...</div>
      ) : (
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '12px 16px', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase' }}>Creator</th>
                  <th style={{ padding: '12px 16px', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase' }}>URL / Coupon</th>
                  <th style={{ padding: '12px 16px', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase' }}>Tier &amp; Rate</th>
                  <th style={{ padding: '12px 16px', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '12px 16px', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCreators.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
                      No creators found matching &quot;{filter}&quot;.
                    </td>
                  </tr>
                ) : (
                  filteredCreators.map((c) => (
                    <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#ffe4e6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', border: '1px solid #fecdd3', overflow: 'hidden', flexShrink: 0 }}>
                            {c.profile_image ? (
                              <img src={c.profile_image} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              '💖'
                            )}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: '#0f172a' }}>{c.name}</div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{c.email}</div>
                            {c.phone && <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>📱 {c.phone}</div>}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontSize: '0.85rem', color: '#0284c7', fontFamily: 'monospace' }}>
                          /c/{c.slug}
                        </div>
                        {c.coupon_code && (
                          <div style={{ fontSize: '0.75rem', color: '#e11d48', fontWeight: 700, marginTop: '2px' }}>
                            Code: {c.coupon_code}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 600, fontSize: '0.85rem', textTransform: 'capitalize' }}>
                          {c.tier_override ? `👑 ${c.tier_override} (Override)` : c.tier}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          Commission: {c.commission_rate_override !== null && c.commission_rate_override !== undefined ? `${c.commission_rate_override}% (Override)` : 'Auto'}
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '3px 10px',
                            borderRadius: '999px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            textTransform: 'capitalize',
                            background: c.status === 'active' ? '#dcfce7' : c.status === 'pending' ? '#fef3c7' : '#fee2e2',
                            color: c.status === 'active' ? '#15803d' : c.status === 'pending' ? '#b45309' : '#b91c1c',
                          }}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {c.status === 'pending' && (
                            <button
                              type="button"
                              onClick={() => handleApprove(c)}
                              style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                            >
                              ✓ Approve
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => openEdit(c)}
                            style={{ background: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                          >
                            ⚙️ Edit / Override
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* EDIT MODAL / DRAWER */}
      {selectedCreator && editForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '16px' }}>
          <div style={{ background: '#fff', borderRadius: '20px', padding: '28px', maxWidth: '640px', width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Configure Creator: {selectedCreator.name}
              </h2>
              <button type="button" onClick={() => setSelectedCreator(null)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#64748b' }}>✕</button>
            </div>

            {message && (
              <div style={{ padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '16px', background: message.startsWith('✓') ? '#dcfce7' : '#fee2e2', color: message.startsWith('✓') ? '#15803d' : '#b91c1c' }}>
                {message}
              </div>
            )}

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  >
                    <option value="active">Active / Approved</option>
                    <option value="pending">Pending Review</option>
                    <option value="suspended">Suspended</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Featured on Landing Page?</label>
                  <select
                    value={editForm.featured ? 'yes' : 'no'}
                    onChange={(e) => setEditForm({ ...editForm, featured: e.target.value === 'yes' })}
                    style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes (Show in featured grid)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Assigned Coupon Code</label>
                  <input
                    type="text"
                    placeholder="e.g. MAYA20 (Auto-created if empty)"
                    value={editForm.coupon_code}
                    onChange={(e) => setEditForm({ ...editForm, coupon_code: e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, '') })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: 700, fontFamily: 'monospace' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Customer Discount % (1–100%)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={editForm.discount_rate}
                    onChange={(e) => setEditForm({ ...editForm, discount_rate: Number(e.target.value) })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Tier Override (Optional)</label>
                  <select
                    value={editForm.tier_override}
                    onChange={(e) => setEditForm({ ...editForm, tier_override: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  >
                    <option value="">No Override (Auto-calculated)</option>
                    {CREATOR_TIERS.map((t) => (
                      <option key={t.id} value={t.id}>{t.emoji} {t.name} ({t.commissionRate}%)</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Commission % Override</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="e.g. 20 (leave blank for tier default)"
                    value={editForm.commission_rate_override}
                    onChange={(e) => setEditForm({ ...editForm, commission_rate_override: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
              </div>

              {/* RECOMMENDED TEMPLATES (SELECT UP TO 4) */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  Recommended Experiences (Select up to 4 for creator page)
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '8px', maxHeight: '160px', overflowY: 'auto', border: '1px solid #e2e8f0', padding: '8px', borderRadius: '8px' }}>
                  {templates.slice(0, 14).map((t) => {
                    const isSelected = editForm.recommended_template_ids.includes(t.id);
                    return (
                      <label key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', cursor: 'pointer', background: isSelected ? '#fdf2f8' : '#fff', padding: '4px 6px', borderRadius: '4px', border: isSelected ? '1px solid #f472b6' : '1px solid #f1f5f9' }}>
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
                  onClick={() => setSelectedCreator(null)}
                  style={{ background: '#f1f5f9', color: '#475569', border: 'none', padding: '10px 18px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
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
