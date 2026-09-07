'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { exportToExcel } from '@/lib/excel-export';

// ─── Constants ────────────────────────────────────────────────────────────────

const PIPELINE_STAGES = [
  'Discovered', 'Shortlisted', 'Contacted',
  'Follow-up 1', 'Follow-up 2', 'Replied',
  'Interested', 'Approved', 'Free Pass Sent',
  'First Content', 'Active', 'Converted', 'Rejected',
];

const STAGE_COLORS = {
  'Discovered':    { bg: '#f1f5f9', text: '#475569' },
  'Shortlisted':   { bg: '#ede9fe', text: '#6d28d9' },
  'Contacted':     { bg: '#dbeafe', text: '#1d4ed8' },
  'Follow-up 1':   { bg: '#fef3c7', text: '#b45309' },
  'Follow-up 2':   { bg: '#fed7aa', text: '#c2410c' },
  'Replied':       { bg: '#cffafe', text: '#0e7490' },
  'Interested':    { bg: '#d1fae5', text: '#047857' },
  'Approved':      { bg: '#a7f3d0', text: '#065f46' },
  'Free Pass Sent':{ bg: '#fbcfe8', text: '#9d174d' },
  'First Content': { bg: '#fce7f3', text: '#be185d' },
  'Active':        { bg: '#dcfce7', text: '#15803d' },
  'Converted':     { bg: '#bbf7d0', text: '#166534' },
  'Rejected':      { bg: '#fee2e2', text: '#b91c1c' },
};

const PRIORITY_CONFIG = {
  A: { label: '🔥 A', bg: '#fef2f2', text: '#dc2626', border: '#fca5a5' },
  B: { label: '🟡 B', bg: '#fefce8', text: '#ca8a04', border: '#fde047' },
  C: { label: '⚪ C', bg: '#f8fafc', text: '#64748b', border: '#cbd5e1' },
};

const CREATOR_TYPES = ['Nano', 'Micro', 'Macro', 'Mega'];
const PLATFORMS = ['Instagram', 'YouTube', 'Both'];
const CONTACT_ROUTES = ['DM', 'Email', 'Manager'];
const LANGUAGES = ['Hindi', 'Gujarati', 'Marathi', 'Tamil', 'Telugu', 'Kannada', 'Bengali', 'Punjabi', 'English', 'Other'];
const INDIA_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand',
  'West Bengal', 'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Puducherry', 'Chandigarh',
];

function formatFollowers(n) {
  if (!n) return '—';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

function initials(name) {
  return (name || '?').split(' ').map((w) => w[0]).join('').substring(0, 2).toUpperCase();
}

const avatarColors = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#0ea5e9', '#10b981'];
function avatarColor(name) {
  let h = 0;
  for (const c of name || '') h = (h * 31 + c.charCodeAt(0)) & 0xffff;
  return avatarColors[h % avatarColors.length];
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function StagePill({ status }) {
  const cfg = STAGE_COLORS[status] || { bg: '#f1f5f9', text: '#475569' };
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 10px',
      borderRadius: '999px',
      fontSize: '0.72rem',
      fontWeight: 700,
      background: cfg.bg,
      color: cfg.text,
    }}>
      {status}
    </span>
  );
}

function PriorityBadge({ priority }) {
  const cfg = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG['C'];
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: '6px',
      fontSize: '0.72rem',
      fontWeight: 700,
      background: cfg.bg,
      color: cfg.text,
      border: `1px solid ${cfg.border}`,
    }}>
      {cfg.label}
    </span>
  );
}

function Avatar({ name, size = 36 }) {
  const color = avatarColor(name);
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: color, color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size < 36 ? '0.65rem' : '0.85rem', fontWeight: 800, flexShrink: 0,
    }}>
      {initials(name)}
    </div>
  );
}

// ─── FORM PANEL ───────────────────────────────────────────────────────────────

function ProspectForm({ onSave, onClose, token }) {
  const [form, setForm] = useState({
    name: '', state: '', city: '', language: 'Hindi',
    platform: 'Instagram', handle: '', followers: '',
    niche: '', creator_type: 'Micro', fit_score: '7',
    priority: 'B', contact_route: 'DM', public_email: '',
    pitch_angle: '', personalization_notes: '', status: 'Discovered',
    next_followup: '', instagram_url: '', youtube_url: '',
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setErr('');
    try {
      const res = await fetch('/api/admin/crm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, followers: Number(form.followers) || 0, fit_score: Number(form.fit_score) || 5 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      onSave();
    } catch (e) { setErr(e.message); }
    finally { setSaving(false); }
  };

  const inputStyle = {
    width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0',
    borderRadius: '8px', fontSize: '0.85rem', color: '#0f172a',
    background: '#f8fafc', outline: 'none', boxSizing: 'border-box',
  };
  const labelStyle = { fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '4px' };
  const row2 = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ background: '#fff', borderRadius: '20px', width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto', padding: '32px', boxShadow: '0 25px 60px rgba(0,0,0,0.15)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Add New Creator Prospect</h2>
          <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#94a3b8' }}>✕</button>
        </div>

        {err && <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '16px' }}>{err}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Creator Name *</label>
            <input style={inputStyle} value={form.name} onChange={set('name')} required placeholder="e.g. Ananya Sharma" />
          </div>

          <div style={row2}>
            <div>
              <label style={labelStyle}>Platform</label>
              <select style={inputStyle} value={form.platform} onChange={set('platform')}>
                {PLATFORMS.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Handle / @username</label>
              <input style={inputStyle} value={form.handle} onChange={set('handle')} placeholder="@username" />
            </div>
          </div>

          <div style={row2}>
            <div>
              <label style={labelStyle}>State</label>
              <select style={inputStyle} value={form.state} onChange={set('state')}>
                <option value="">Select State</option>
                {INDIA_STATES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>City</label>
              <input style={inputStyle} value={form.city} onChange={set('city')} placeholder="e.g. Mumbai" />
            </div>
          </div>

          <div style={row2}>
            <div>
              <label style={labelStyle}>Language</label>
              <select style={inputStyle} value={form.language} onChange={set('language')}>
                {LANGUAGES.map((l) => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Niche</label>
              <input style={inputStyle} value={form.niche} onChange={set('niche')} placeholder="e.g. Couple / Romantic" />
            </div>
          </div>

          <div style={row2}>
            <div>
              <label style={labelStyle}>Followers</label>
              <input style={inputStyle} type="number" value={form.followers} onChange={set('followers')} placeholder="e.g. 45000" />
            </div>
            <div>
              <label style={labelStyle}>Creator Type</label>
              <select style={inputStyle} value={form.creator_type} onChange={set('creator_type')}>
                {CREATOR_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div style={row2}>
            <div>
              <label style={labelStyle}>Fit Score (1–10)</label>
              <input style={inputStyle} type="number" min="1" max="10" value={form.fit_score} onChange={set('fit_score')} />
            </div>
            <div>
              <label style={labelStyle}>Priority</label>
              <select style={inputStyle} value={form.priority} onChange={set('priority')}>
                <option value="A">🔥 A — Hot Lead</option>
                <option value="B">🟡 B — Good Fit</option>
                <option value="C">⚪ C — Monitor</option>
              </select>
            </div>
          </div>

          <div style={row2}>
            <div>
              <label style={labelStyle}>Contact Route</label>
              <select style={inputStyle} value={form.contact_route} onChange={set('contact_route')}>
                {CONTACT_ROUTES.map((r) => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Public Business Email</label>
              <input style={inputStyle} type="email" value={form.public_email} onChange={set('public_email')} placeholder="creator@email.com" />
            </div>
          </div>

          <div style={row2}>
            <div>
              <label style={labelStyle}>Status</label>
              <select style={inputStyle} value={form.status} onChange={set('status')}>
                {PIPELINE_STAGES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Next Follow-up Date</label>
              <input style={inputStyle} type="date" value={form.next_followup} onChange={set('next_followup')} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Pitch Angle</label>
            <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: '64px' }} value={form.pitch_angle} onChange={set('pitch_angle')} placeholder="Why LovelyCrafts fits this creator..." />
          </div>

          <div>
            <label style={labelStyle}>Personalization Notes</label>
            <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: '48px' }} value={form.personalization_notes} onChange={set('personalization_notes')} placeholder="Message personalization ideas..." />
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button type="button" onClick={onClose} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#64748b', fontWeight: 700, cursor: 'pointer' }}>
              Cancel
            </button>
            <button type="submit" disabled={saving} style={{ flex: 2, padding: '12px', borderRadius: '10px', border: 'none', background: saving ? '#94a3b8' : '#e11d48', color: '#fff', fontWeight: 800, fontSize: '0.95rem', cursor: saving ? 'not-allowed' : 'pointer' }}>
              {saving ? 'Saving...' : '+ Add Creator Prospect'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── APPROVE MODAL ────────────────────────────────────────────────────────────

function ApproveModal({ prospect, onApproved, onClose, token }) {
  const [issuePass, setIssuePass] = useState(true);
  const [templateId, setTemplateId] = useState('proposal');
  const [discountRate, setDiscountRate] = useState(20);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [err, setErr] = useState('');

  const handleApprove = async () => {
    setLoading(true); setErr('');
    try {
      const res = await fetch(`/api/admin/crm/${prospect.id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ issue_gift_pass: issuePass, template_id: templateId, discount_rate: discountRate }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Approval failed');
      setResult(data);
      onApproved();
    } catch (e) { setErr(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ background: '#fff', borderRadius: '20px', width: '100%', maxWidth: '480px', padding: '32px', boxShadow: '0 25px 60px rgba(0,0,0,0.2)' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: '0 0 8px' }}>✅ Approve Creator</h2>
        <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0 0 24px' }}>
          This will create a Creator Club account, generate a coupon code, and activate the referral link for <strong>{prospect.name}</strong>.
        </p>

        {err && <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '16px' }}>{err}</div>}

        {result ? (
          <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
            <div style={{ fontWeight: 800, color: '#15803d', marginBottom: '12px', fontSize: '1rem' }}>🎉 Creator Approved Successfully!</div>
            <div style={{ fontSize: '0.85rem', color: '#166534', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div>🏷️ Coupon Code: <strong>{result.coupon_code}</strong></div>
              <div>🔗 Referral Link: <strong style={{ wordBreak: 'break-all' }}>{result.referral_link}</strong></div>
              {result.gift_code && <div>🎁 Gift Pass Code: <strong>{result.gift_code}</strong></div>}
            </div>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Audience Discount %</label>
                <select value={discountRate} onChange={(e) => setDiscountRate(Number(e.target.value))}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.85rem', background: '#f8fafc' }}>
                  {[10, 15, 20].map((r) => <option key={r} value={r}>{r}% off for audience</option>)}
                </select>
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '10px', background: issuePass ? '#f0fdf4' : '#f8fafc' }}>
                <input type="checkbox" checked={issuePass} onChange={(e) => setIssuePass(e.target.checked)} style={{ width: 18, height: 18 }} />
                <div>
                  <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9rem' }}>🎁 Issue Free Experience Pass</div>
                  <div style={{ color: '#64748b', fontSize: '0.8rem' }}>Send a complimentary 100% off pass so they can try the product</div>
                </div>
              </label>

              {issuePass && (
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Experience Template</label>
                  <select value={templateId} onChange={(e) => setTemplateId(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.85rem', background: '#f8fafc' }}>
                    <option value="proposal">Love Proposal</option>
                    <option value="apology">Heartfelt Apology</option>
                    <option value="birthday">Birthday Surprise</option>
                    <option value="anniversary">Anniversary Celebration</option>
                  </select>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="button" onClick={onClose} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 700, color: '#64748b', cursor: 'pointer' }}>Cancel</button>
              <button type="button" onClick={handleApprove} disabled={loading} style={{ flex: 2, padding: '12px', borderRadius: '10px', border: 'none', background: loading ? '#94a3b8' : '#16a34a', color: '#fff', fontWeight: 800, fontSize: '0.95rem', cursor: loading ? 'not-allowed' : 'pointer' }}>
                {loading ? 'Approving...' : '✅ Approve & Activate'}
              </button>
            </div>
          </>
        )}

        {result && (
          <button type="button" onClick={onClose} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: 'none', background: '#0f172a', color: '#fff', fontWeight: 700, cursor: 'pointer', marginTop: '8px' }}>
            Done
          </button>
        )}
      </div>
    </div>
  );
}

// ─── PROFILE DRAWER ───────────────────────────────────────────────────────────

function ProfileDrawer({ prospect, onClose, onUpdated, token }) {
  const [editing, setEditing] = useState({});
  const [saving, setSaving] = useState(false);
  const [outreachForm, setOutreachForm] = useState({ date: '', method: 'DM', message: '', response: '' });
  const [addingOutreach, setAddingOutreach] = useState(false);
  const [showApprove, setShowApprove] = useState(false);
  const [msg, setMsg] = useState('');

  const p = { ...prospect, ...editing };

  const patch = async (fields) => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/crm', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id: prospect.id, ...fields }),
      });
      if (!res.ok) throw new Error('Failed');
      onUpdated();
    } catch { }
    finally { setSaving(false); }
  };

  const handleStatusChange = (newStatus) => {
    setEditing((e) => ({ ...e, status: newStatus }));
    patch({ status: newStatus });
  };

  const handleSaveNextAction = () => {
    patch({ next_followup: p.next_followup });
    setMsg('✓ Saved');
    setTimeout(() => setMsg(''), 2000);
  };

  const handleAddOutreach = async () => {
    if (!outreachForm.date) return;
    await patch({ outreach_entry: outreachForm, last_contacted: outreachForm.date });
    setOutreachForm({ date: '', method: 'DM', message: '', response: '' });
    setAddingOutreach(false);
  };

  const fieldStyle = { width: '100%', padding: '7px 10px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.82rem', color: '#0f172a', background: '#f8fafc', boxSizing: 'border-box' };
  const labelStyle = { fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: '3px' };

  return (
    <>
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 900 }} onClick={onClose} />
      <div style={{
        position: 'fixed', right: 0, top: 0, bottom: 0, width: '480px', maxWidth: '100%',
        background: '#fff', zIndex: 950, overflowY: 'auto', boxShadow: '-4px 0 40px rgba(0,0,0,0.15)',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{ padding: '24px', background: '#0f172a', color: '#fff', flexShrink: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <Avatar name={p.name} size={52} />
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{p.name}</div>
                <div style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '2px' }}>{p.niche} · {p.creator_type} · {formatFollowers(p.followers)}</div>
                <div style={{ marginTop: '6px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <PriorityBadge priority={p.priority} />
                  <StagePill status={p.status} />
                </div>
              </div>
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.4rem', cursor: 'pointer' }}>✕</button>
          </div>
        </div>

        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Status & Priority */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Pipeline Status</label>
              <select style={fieldStyle} value={p.status} onChange={(e) => handleStatusChange(e.target.value)}>
                {PIPELINE_STAGES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Priority</label>
              <select style={fieldStyle} value={p.priority || 'B'}
                onChange={(e) => { setEditing((ed) => ({ ...ed, priority: e.target.value })); patch({ priority: e.target.value }); }}>
                <option value="A">🔥 A — Hot Lead</option>
                <option value="B">🟡 B — Good Fit</option>
                <option value="C">⚪ C — Monitor</option>
              </select>
            </div>
          </div>

          {/* Next Follow-up */}
          <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '14px', border: '1px solid #e2e8f0' }}>
            <label style={labelStyle}>📅 Next Follow-up Date</label>
            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
              <input type="date" style={{ ...fieldStyle, flex: 1 }}
                value={editing.next_followup !== undefined ? editing.next_followup : (p.next_followup || '')}
                onChange={(e) => setEditing((ed) => ({ ...ed, next_followup: e.target.value }))} />
              <button onClick={handleSaveNextAction} style={{ padding: '7px 14px', borderRadius: '8px', border: 'none', background: '#0f172a', color: '#fff', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>
                {saving ? '…' : msg || 'Save'}
              </button>
            </div>
            {p.last_contacted && (
              <div style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '6px' }}>Last contacted: {p.last_contacted}</div>
            )}
          </div>

          {/* Contact Details */}
          <div>
            <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.85rem', marginBottom: '10px' }}>📬 Contact</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem', color: '#475569' }}>
              {p.public_email && <div>✉️ <a href={`mailto:${p.public_email}`} style={{ color: '#0284c7' }}>{p.public_email}</a></div>}
              {p.handle && <div>🏷️ {p.platform}: <strong>@{p.handle.replace(/^@/, '')}</strong></div>}
              {p.instagram_url && <div>📸 <a href={p.instagram_url} target="_blank" rel="noopener noreferrer" style={{ color: '#e11d48' }}>{p.instagram_url}</a></div>}
              {p.youtube_url && <div>▶️ <a href={p.youtube_url} target="_blank" rel="noopener noreferrer" style={{ color: '#dc2626' }}>{p.youtube_url}</a></div>}
              <div>📞 Contact route: <strong>{p.contact_route}</strong></div>
            </div>
          </div>

          {/* Audience Details */}
          <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '14px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.85rem', marginBottom: '10px' }}>👥 Audience</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.82rem', color: '#475569' }}>
              <div>📍 {p.state}{p.city ? `, ${p.city}` : ''}</div>
              <div>🗣️ {p.language}</div>
              <div>👣 {formatFollowers(p.followers)} followers</div>
              <div>🎯 Fit Score: <strong>{p.fit_score}/10</strong></div>
            </div>
          </div>

          {/* Pitch */}
          {(p.pitch_angle || p.personalization_notes) && (
            <div>
              <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.85rem', marginBottom: '8px' }}>📝 Notes</div>
              {p.pitch_angle && <div style={{ fontSize: '0.82rem', color: '#475569', marginBottom: '6px' }}><strong>Pitch angle:</strong> {p.pitch_angle}</div>}
              {p.personalization_notes && <div style={{ fontSize: '0.82rem', color: '#475569' }}><strong>Personalization:</strong> {p.personalization_notes}</div>}
            </div>
          )}

          {/* Creator Club info if approved */}
          {p.linked_creator_id && (
            <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '12px', padding: '14px' }}>
              <div style={{ fontWeight: 700, color: '#15803d', fontSize: '0.85rem', marginBottom: '8px' }}>✅ Creator Club Member</div>
              <div style={{ fontSize: '0.82rem', color: '#166534', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div>🆔 Creator ID: <code style={{ fontSize: '0.75rem' }}>{p.linked_creator_id}</code></div>
                {p.free_pass_issued && <div>🎁 Free pass issued</div>}
              </div>
            </div>
          )}

          {/* Outreach History */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.85rem' }}>📨 Outreach History</div>
              <button onClick={() => setAddingOutreach(true)} style={{ padding: '4px 10px', borderRadius: '6px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '0.75rem', fontWeight: 700, color: '#0284c7', cursor: 'pointer' }}>
                + Add Contact
              </button>
            </div>

            {addingOutreach && (
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px', marginBottom: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div>
                    <label style={labelStyle}>Date</label>
                    <input type="date" style={fieldStyle} value={outreachForm.date} onChange={(e) => setOutreachForm((f) => ({ ...f, date: e.target.value }))} />
                  </div>
                  <div>
                    <label style={labelStyle}>Method</label>
                    <select style={fieldStyle} value={outreachForm.method} onChange={(e) => setOutreachForm((f) => ({ ...f, method: e.target.value }))}>
                      {['DM', 'Email', 'WhatsApp', 'Call'].map((m) => <option key={m}>{m}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Message / Pitch</label>
                  <textarea style={{ ...fieldStyle, resize: 'vertical', minHeight: '48px' }} value={outreachForm.message} onChange={(e) => setOutreachForm((f) => ({ ...f, message: e.target.value }))} placeholder="Pitch #1 / Follow-up..." />
                </div>
                <div>
                  <label style={labelStyle}>Response</label>
                  <input style={fieldStyle} value={outreachForm.response} onChange={(e) => setOutreachForm((f) => ({ ...f, response: e.target.value }))} placeholder="No response / Interested / etc." />
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => setAddingOutreach(false)} style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 700, color: '#64748b', cursor: 'pointer', fontSize: '0.8rem' }}>Cancel</button>
                  <button onClick={handleAddOutreach} style={{ flex: 2, padding: '8px', borderRadius: '8px', border: 'none', background: '#0f172a', color: '#fff', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>Save Contact</button>
                </div>
              </div>
            )}

            {(prospect.outreach_history || []).length === 0 && !addingOutreach ? (
              <div style={{ color: '#94a3b8', fontSize: '0.8rem', fontStyle: 'italic' }}>No outreach recorded yet.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[...(prospect.outreach_history || [])].reverse().map((entry, i) => (
                  <div key={i} style={{ borderLeft: '3px solid #e11d48', paddingLeft: '12px', fontSize: '0.8rem' }}>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{entry.date} · {entry.method}</div>
                    {entry.message && <div style={{ color: '#475569', marginTop: '2px' }}>{entry.message}</div>}
                    {entry.response && <div style={{ color: '#16a34a', marginTop: '2px', fontWeight: 600 }}>↩ {entry.response}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '8px', borderTop: '1px solid #f1f5f9' }}>
            {!p.linked_creator_id && (
              <button onClick={() => setShowApprove(true)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: 'none', background: '#16a34a', color: '#fff', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer' }}>
                ✅ Approve → Activate Creator Club
              </button>
            )}
            <button
              onClick={async () => {
                if (!confirm('Remove this prospect from the CRM?')) return;
                await fetch(`/api/admin/crm?id=${prospect.id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
                onUpdated(); onClose();
              }}
              style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #fecaca', background: '#fff', color: '#b91c1c', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>
              🗑 Remove from CRM
            </button>
          </div>
        </div>
      </div>

      {showApprove && (
        <ApproveModal
          prospect={prospect}
          token={token}
          onApproved={() => { onUpdated(); }}
          onClose={() => setShowApprove(false)}
        />
      )}
    </>
  );
}

// ─── KANBAN VIEW ──────────────────────────────────────────────────────────────

const KANBAN_STAGES = [
  'Discovered', 'Shortlisted', 'Contacted', 'Follow-up 1', 'Follow-up 2',
  'Replied', 'Interested', 'Approved', 'Active', 'Converted',
];

function KanbanView({ prospects, onSelectProspect }) {
  return (
    <div style={{ overflowX: 'auto', paddingBottom: '16px' }}>
      <div style={{ display: 'flex', gap: '12px', minWidth: 'max-content' }}>
        {KANBAN_STAGES.map((stage) => {
          const cards = prospects.filter((p) => p.status === stage);
          const cfg = STAGE_COLORS[stage];
          return (
            <div key={stage} style={{ width: '200px', flexShrink: 0 }}>
              <div style={{
                padding: '8px 12px', borderRadius: '8px 8px 0 0',
                background: cfg.bg, color: cfg.text, fontWeight: 700, fontSize: '0.78rem',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <span>{stage}</span>
                <span style={{ background: 'rgba(0,0,0,0.12)', borderRadius: '999px', padding: '1px 7px', fontSize: '0.7rem' }}>
                  {cards.length}
                </span>
              </div>
              <div style={{ background: '#f8fafc', border: `1px solid ${cfg.bg}`, borderTop: 'none', borderRadius: '0 0 10px 10px', minHeight: '80px', padding: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {cards.map((p) => {
                  const todayStr = new Date().toISOString().split('T')[0];
                  const overdue = p.next_followup && p.next_followup <= todayStr;
                  return (
                    <div key={p.id} onClick={() => onSelectProspect(p)}
                      style={{
                        background: '#fff', borderRadius: '8px', padding: '10px', cursor: 'pointer',
                        border: overdue ? '1px solid #fca5a5' : '1px solid #e2e8f0',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                        transition: 'box-shadow 0.15s',
                      }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        <Avatar name={p.name} size={24} />
                        <span style={{ fontWeight: 700, fontSize: '0.78rem', color: '#0f172a', lineHeight: 1.2 }}>{p.name}</span>
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{p.niche || '—'}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                        <PriorityBadge priority={p.priority} />
                        {overdue && <span style={{ fontSize: '0.65rem', color: '#dc2626', fontWeight: 700 }}>⏰ Due</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function AdminCRMPage() {
  const { user } = useAuth();
  const [prospects, setProspects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('list'); // 'list' | 'kanban' | 'today'
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedProspect, setSelectedProspect] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const tokenRef = useRef(null);

  const loadProspects = useCallback(async () => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      tokenRef.current = token;
      const res = await fetch('/api/admin/crm', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.prospects) setProspects(data.prospects);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [user]);

  useEffect(() => { loadProspects(); }, [loadProspects]);

  const todayStr = new Date().toISOString().split('T')[0];

  const filtered = prospects.filter((p) => {
    if (view === 'today') {
      return p.next_followup && p.next_followup <= todayStr && p.status !== 'Rejected' && p.status !== 'Converted';
    }
    const matchSearch = !search || [p.name, p.niche, p.public_email, p.handle, p.state, p.city]
      .some((v) => v && v.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchPriority = priorityFilter === 'all' || p.priority === priorityFilter;
    return matchSearch && matchStatus && matchPriority;
  });

  const dueTodayCount = prospects.filter((p) =>
    p.next_followup && p.next_followup <= todayStr && p.status !== 'Rejected' && p.status !== 'Converted'
  ).length;

  const token = tokenRef.current;

  // Pipeline summary counts
  const byStatus = {};
  prospects.forEach((p) => { byStatus[p.status] = (byStatus[p.status] || 0) + 1; });

  const handleExportExcel = () => {
    const rows = filtered.map((p) => ({
      'Creator Name': p.name || '',
      'State': p.state || '',
      'City': p.city || '',
      'Language': p.language || '',
      'Platform': p.platform || '',
      'Handle': p.handle ? `@${p.handle.replace(/^@/, '')}` : '',
      'Followers': p.followers || 0,
      'Niche': p.niche || '',
      'Creator Type': p.creator_type || '',
      'Fit Score': p.fit_score ? `${p.fit_score}/10` : '',
      'Priority': p.priority || '',
      'Contact Route': p.contact_route || '',
      'Public Email': p.public_email || '',
      'Pitch Angle': p.pitch_angle || '',
      'Status': p.status || '',
      'Last Contacted': p.last_contacted || '',
      'Next Follow-up': p.next_followup || '',
      'Response': p.response || '',
      'Free Pass Issued': p.free_pass_issued ? 'Yes' : 'No',
      'Creator Code': p.linked_creator_id ? 'Approved' : '',
      'Personalization Notes': p.personalization_notes || '',
      'Instagram URL': p.instagram_url || '',
      'YouTube URL': p.youtube_url || '',
      'Outreach Contacts': (p.outreach_history || []).length,
      'Added Date': p.created_at ? new Date(p.created_at).toLocaleDateString() : '',
    }));
    const label = view === 'today' ? 'crm_followups_today' : statusFilter !== 'all' ? `crm_${statusFilter.toLowerCase().replace(/\s+/g, '_')}` : 'crm_all_prospects';
    exportToExcel(rows, label, 'Creator CRM');
  };

  const statCards = [
    { label: 'Total in Pipeline', value: prospects.length, color: '#0f172a' },
    { label: 'Discovered', value: byStatus['Discovered'] || 0, color: '#6d28d9' },
    { label: 'Contacted', value: (byStatus['Contacted'] || 0) + (byStatus['Follow-up 1'] || 0) + (byStatus['Follow-up 2'] || 0), color: '#1d4ed8' },
    { label: 'Interested', value: byStatus['Interested'] || 0, color: '#047857' },
    { label: 'Approved / Active', value: (byStatus['Approved'] || 0) + (byStatus['Active'] || 0) + (byStatus['Free Pass Sent'] || 0) + (byStatus['First Content'] || 0), color: '#15803d' },
    { label: 'Converted', value: byStatus['Converted'] || 0, color: '#166534' },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>🎯 Creator CRM</h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
            Full acquisition pipeline from discovery to first sale.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          {dueTodayCount > 0 && (
            <button onClick={() => setView('today')}
              style={{ padding: '8px 14px', borderRadius: '10px', border: 'none', background: '#fef2f2', color: '#dc2626', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#dc2626' }} />
              🔔 {dueTodayCount} Follow-up{dueTodayCount > 1 ? 's' : ''} Due Today
            </button>
          )}
          <button
            type="button"
            onClick={handleExportExcel}
            disabled={loading || filtered.length === 0}
            style={{
              padding: '10px 18px', borderRadius: '10px', border: 'none',
              background: loading || filtered.length === 0 ? '#e2e8f0' : '#10b981',
              color: loading || filtered.length === 0 ? '#94a3b8' : '#fff',
              fontWeight: 700, fontSize: '0.85rem',
              cursor: loading || filtered.length === 0 ? 'not-allowed' : 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              boxShadow: filtered.length > 0 ? '0 2px 8px rgba(16,185,129,0.25)' : 'none',
              transition: 'all 0.15s',
            }}
          >
            <span>📥</span>
            <span>Export Excel{filtered.length > 0 ? ` (${filtered.length})` : ''}</span>
          </button>
          <button onClick={() => setShowAddForm(true)}
            style={{ padding: '10px 20px', borderRadius: '10px', border: 'none', background: '#e11d48', color: '#fff', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 2px 8px rgba(225, 29, 72, 0.3)' }}>
            ＋ Add Creator
          </button>
        </div>

      </div>

      {/* Pipeline Stat Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        {statCards.map((s) => (
          <div key={s.label} style={{ background: '#fff', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginTop: '2px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* View Toggle */}
      <div style={{ display: 'flex', gap: '4px', background: '#f1f5f9', borderRadius: '10px', padding: '4px', width: 'fit-content', marginBottom: '20px' }}>
        {[
          { key: 'list', label: '☰ List' },
          { key: 'kanban', label: '⬛ Kanban' },
          { key: 'today', label: `🔔 Today${dueTodayCount > 0 ? ` (${dueTodayCount})` : ''}` },
        ].map((v) => (
          <button key={v.key} onClick={() => setView(v.key)}
            style={{ padding: '7px 16px', borderRadius: '8px', border: 'none', background: view === v.key ? '#fff' : 'transparent', color: view === v.key ? '#0f172a' : '#64748b', fontWeight: view === v.key ? 700 : 500, fontSize: '0.85rem', cursor: 'pointer', boxShadow: view === v.key ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', transition: 'all 0.15s' }}>
            {v.label}
          </button>
        ))}
      </div>

      {/* Filters (list/today only) */}
      {view !== 'kanban' && (
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Search name, niche, email, handle..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ padding: '8px 14px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '0.85rem', minWidth: '240px', outline: 'none', flex: 1, maxWidth: '360px' }}
          />
          {view === 'list' && (
            <>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                style={{ padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '0.85rem', background: '#fff' }}>
                <option value="all">All Stages</option>
                {PIPELINE_STAGES.map((s) => <option key={s}>{s}</option>)}
              </select>
              <div style={{ display: 'flex', gap: '4px' }}>
                {['all', 'A', 'B', 'C'].map((p) => (
                  <button key={p} onClick={() => setPriorityFilter(p)}
                    style={{ padding: '7px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', background: priorityFilter === p ? '#0f172a' : '#fff', color: priorityFilter === p ? '#fff' : '#64748b', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer' }}>
                    {p === 'all' ? 'All' : PRIORITY_CONFIG[p].label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
          <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🎯</div>
          Loading creator pipeline...
        </div>
      ) : view === 'kanban' ? (
        <KanbanView prospects={prospects} onSelectProspect={setSelectedProspect} />
      ) : (
        /* LIST / TODAY TABLE */
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '900px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  {['Creator', 'Platform / Handle', 'Location', 'Niche & Type', 'Followers', 'Fit', 'Priority', 'Status', 'Next Follow-up'].map((h) => (
                    <th key={h} style={{ padding: '12px 14px', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                      {view === 'today' ? '🎉 No follow-ups due today!' : 'No creator prospects found.'}
                    </td>
                  </tr>
                ) : filtered.map((p) => {
                  const overdue = p.next_followup && p.next_followup <= todayStr;
                  return (
                    <tr key={p.id} onClick={() => setSelectedProspect(p)}
                      style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer', transition: 'background 0.1s' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Avatar name={p.name} size={30} />
                          <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.85rem' }}>{p.name}</div>
                        </div>
                      </td>
                      <td style={{ padding: '12px 14px', fontSize: '0.82rem', color: '#0284c7' }}>
                        {p.platform}<br />
                        {p.handle && <span style={{ color: '#64748b' }}>@{p.handle.replace(/^@/, '')}</span>}
                      </td>
                      <td style={{ padding: '12px 14px', fontSize: '0.82rem', color: '#475569' }}>
                        {p.state}<br />
                        <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{p.language}</span>
                      </td>
                      <td style={{ padding: '12px 14px', fontSize: '0.82rem', color: '#475569' }}>
                        {p.niche}<br />
                        <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{p.creator_type}</span>
                      </td>
                      <td style={{ padding: '12px 14px', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
                        {formatFollowers(p.followers)}
                      </td>
                      <td style={{ padding: '12px 14px', fontSize: '0.82rem', textAlign: 'center' }}>
                        <span style={{ fontWeight: 700, color: p.fit_score >= 8 ? '#16a34a' : p.fit_score >= 6 ? '#ca8a04' : '#dc2626' }}>
                          {p.fit_score}/10
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <PriorityBadge priority={p.priority} />
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <StagePill status={p.status} />
                      </td>
                      <td style={{ padding: '12px 14px', fontSize: '0.8rem' }}>
                        {p.next_followup ? (
                          <span style={{ color: overdue ? '#dc2626' : '#475569', fontWeight: overdue ? 700 : 400 }}>
                            {overdue && '⏰ '}{p.next_followup}
                          </span>
                        ) : <span style={{ color: '#94a3b8' }}>—</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Profile Drawer */}
      {selectedProspect && (
        <ProfileDrawer
          prospect={selectedProspect}
          token={token}
          onClose={() => setSelectedProspect(null)}
          onUpdated={() => {
            loadProspects();
            setSelectedProspect(null);
          }}
        />
      )}

      {/* Add Form Modal */}
      {showAddForm && (
        <ProspectForm
          token={token}
          onSave={() => { setShowAddForm(false); loadProspects(); }}
          onClose={() => setShowAddForm(false)}
        />
      )}
    </div>
  );
}
