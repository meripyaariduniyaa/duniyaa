'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { exportToExcel } from '@/lib/excel-export';
import {
  CrmIcon,
  PlusIcon,
  DownloadIcon,
  SearchIcon,
  FilterIcon,
  BellIcon,
  GiftsIcon,
  CheckIcon,
  CloseIcon,
  TrashIcon,
  EditIcon,
  CopyIcon,
  ExternalLinkIcon,
  CouponsIcon,
  TrendingUpIcon,
  ChevronRightIcon
} from '@/components/admin/AdminIcons';

// ─── Constants ────────────────────────────────────────────────────────────────

const PIPELINE_STAGES = [
  'Discovered', 'Shortlisted', 'Contacted',
  'Follow-up 1', 'Follow-up 2', 'Replied',
  'Interested', 'Approved', 'Free Pass Sent',
  'First Content', 'Active', 'Converted', 'Rejected',
];

const STAGE_COLORS = {
  'Discovered':    { bg: '#f1f5f9', text: '#475569', border: '#e2e8f0' },
  'Shortlisted':   { bg: '#f5f3ff', text: '#6d28d9', border: '#ddd6fe' },
  'Contacted':     { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' },
  'Follow-up 1':   { bg: '#fffbeb', text: '#b45309', border: '#fde68a' },
  'Follow-up 2':   { bg: '#fff7ed', text: '#c2410c', border: '#fed7aa' },
  'Replied':       { bg: '#ecfeff', text: '#0e7490', border: '#a5f3fc' },
  'Interested':    { bg: '#ecfdf5', text: '#047857', border: '#a7f3d0' },
  'Approved':      { bg: '#d1fae5', text: '#065f46', border: '#6ee7b7' },
  'Free Pass Sent':{ bg: '#fdf2f8', text: '#9d174d', border: '#fbcfe8' },
  'First Content': { bg: '#fdf2f8', text: '#be185d', border: '#fbcfe8' },
  'Active':        { bg: '#dcfce7', text: '#15803d', border: '#86efac' },
  'Converted':     { bg: '#bbf7d0', text: '#166534', border: '#4ade80' },
  'Rejected':      { bg: '#fef2f2', text: '#991b1b', border: '#fecaca' },
};

const PRIORITY_CONFIG = {
  A: { label: 'Tier A', bg: '#fef2f2', text: '#dc2626', border: '#fca5a5', dot: '#ef4444' },
  B: { label: 'Tier B', bg: '#fffbeb', text: '#b45309', border: '#fde68a', dot: '#f59e0b' },
  C: { label: 'Tier C', bg: '#f8fafc', text: '#64748b', border: '#cbd5e1', dot: '#94a3b8' },
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

const avatarColors = ['#0284c7', '#7c3aed', '#db2777', '#ea580c', '#059669', '#4f46e5'];
function avatarColor(name) {
  let h = 0;
  for (const c of name || '') h = (h * 31 + c.charCodeAt(0)) & 0xffff;
  return avatarColors[h % avatarColors.length];
}

function generateRandomPassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$';
  let pwd = '';
  for (let i = 0; i < 10; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pwd;
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function StagePill({ status }) {
  const cfg = STAGE_COLORS[status] || { bg: '#f1f5f9', text: '#475569', border: '#e2e8f0' };
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px',
      padding: '2px 8px',
      borderRadius: '999px',
      fontSize: '0.72rem',
      fontWeight: 600,
      background: cfg.bg,
      color: cfg.text,
      border: `1px solid ${cfg.border}`,
    }}>
      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: cfg.text }} />
      {status}
    </span>
  );
}

function PriorityBadge({ priority }) {
  const cfg = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG['C'];
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      padding: '2px 8px',
      borderRadius: '6px',
      fontSize: '0.72rem',
      fontWeight: 700,
      background: cfg.bg,
      color: cfg.text,
      border: `1px solid ${cfg.border}`,
    }}>
      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: cfg.dot }} />
      {cfg.label}
    </span>
  );
}

function Avatar({ name, size = 32 }) {
  const color = avatarColor(name);
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: color, color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size < 32 ? '0.65rem' : '0.8rem', fontWeight: 800, flexShrink: 0,
    }}>
      {initials(name)}
    </div>
  );
}

// ─── ADD PROSPECT MODAL ───────────────────────────────────────────────────────

function ProspectForm({ onSave, onClose, token }) {
  const [form, setForm] = useState({
    name: '', state: '', city: '', language: 'Hindi',
    platform: 'Instagram', handle: '', followers: '',
    niche: '', creator_type: 'Micro', fit_score: '7',
    priority: 'B', contact_route: 'DM', public_email: '', phone: '',
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
    width: '100%', padding: '9px 12px', border: '1px solid #e2e8f0',
    borderRadius: '8px', fontSize: '0.85rem', color: '#0f172a',
    background: '#f8fafc', outline: 'none', boxSizing: 'border-box',
  };
  const labelStyle = { fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '4px', letterSpacing: '0.04em' };
  const row2 = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(11, 15, 25, 0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(4px)' }}>
      <div style={{ background: '#fff', borderRadius: '20px', width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto', padding: '32px', boxShadow: '0 25px 60px rgba(0,0,0,0.18)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 2px', letterSpacing: '-0.01em' }}>Add Creator Lead</h2>
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>Enter creator discovery profile to begin outreach pipeline.</p>
          </div>
          <button type="button" onClick={onClose} style={{ background: '#f1f5f9', border: 'none', padding: '6px', borderRadius: '8px', cursor: 'pointer', color: '#64748b' }}>
            <CloseIcon size={18} />
          </button>
        </div>

        {err && <div style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '16px' }}>{err}</div>}

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
              <label style={labelStyle}>Handle / Username</label>
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
              <input style={inputStyle} value={form.niche} onChange={set('niche')} placeholder="e.g. Couples, Lifestyle" />
            </div>
          </div>

          <div style={row2}>
            <div>
              <label style={labelStyle}>Followers</label>
              <input style={inputStyle} type="number" value={form.followers} onChange={set('followers')} placeholder="e.g. 45000" />
            </div>
            <div>
              <label style={labelStyle}>Creator Tier</label>
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
              <label style={labelStyle}>Priority Level</label>
              <select style={inputStyle} value={form.priority} onChange={set('priority')}>
                <option value="A">Tier A — High Impact</option>
                <option value="B">Tier B — Good Potential</option>
                <option value="C">Tier C — Normal</option>
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
              <label style={labelStyle}>Business Email</label>
              <input style={inputStyle} type="email" value={form.public_email} onChange={set('public_email')} placeholder="creator@email.com" />
            </div>
          </div>

          <div style={row2}>
            <div>
              <label style={labelStyle}>Phone / WhatsApp</label>
              <input style={inputStyle} value={form.phone} onChange={set('phone')} placeholder="+91 98765 43210" />
            </div>
            <div>
              <label style={labelStyle}>Next Follow-up Date</label>
              <input style={inputStyle} type="date" value={form.next_followup} onChange={set('next_followup')} />
            </div>
          </div>

          <div style={row2}>
            <div>
              <label style={labelStyle}>Initial Stage</label>
              <select style={inputStyle} value={form.status} onChange={set('status')}>
                {PIPELINE_STAGES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Instagram Profile URL</label>
              <input style={inputStyle} value={form.instagram_url} onChange={set('instagram_url')} placeholder="https://instagram.com/..." />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Pitch Angle / Personalization Notes</label>
            <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: '56px' }} value={form.pitch_angle} onChange={set('pitch_angle')} placeholder="Why LovelyCrafts fits this creator..." />
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
            <button type="button" onClick={onClose} style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#64748b', fontWeight: 600, cursor: 'pointer' }}>
              Cancel
            </button>
            <button type="submit" disabled={saving} style={{ flex: 2, padding: '10px', borderRadius: '10px', border: 'none', background: saving ? '#94a3b8' : '#0f172a', color: '#fff', fontWeight: 700, fontSize: '0.9rem', cursor: saving ? 'not-allowed' : 'pointer' }}>
              {saving ? 'Saving...' : 'Add Lead to Pipeline'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── EDIT PROSPECT MODAL ──────────────────────────────────────────────────────

function EditProspectModal({ prospect, onSave, onDelete, onClose, token }) {
  const [form, setForm] = useState({
    name: prospect.name || '',
    state: prospect.state || '',
    city: prospect.city || '',
    language: prospect.language || 'Hindi',
    platform: prospect.platform || 'Instagram',
    handle: prospect.handle || '',
    followers: prospect.followers || '',
    niche: prospect.niche || '',
    creator_type: prospect.creator_type || 'Micro',
    fit_score: prospect.fit_score || '7',
    priority: prospect.priority || 'B',
    contact_route: prospect.contact_route || 'DM',
    public_email: prospect.public_email || '',
    phone: prospect.phone || '',
    status: prospect.status || 'Discovered',
    next_followup: prospect.next_followup || '',
    pitch_angle: prospect.pitch_angle || '',
    personalization_notes: prospect.personalization_notes || '',
    instagram_url: prospect.instagram_url || '',
    youtube_url: prospect.youtube_url || '',
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [err, setErr] = useState('');

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true); setErr('');
    try {
      const res = await fetch(`/api/admin/crm/${prospect.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...form,
          followers: Number(form.followers) || 0,
          fit_score: Number(form.fit_score) || 5,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Update failed');
      onSave();
    } catch (e) { setErr(e.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${prospect.name}" from the CRM? This action cannot be undone.`)) return;
    setDeleting(true); setErr('');
    try {
      const res = await fetch(`/api/admin/crm/${prospect.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Delete failed');
      onDelete();
    } catch (e) { setErr(e.message); setDeleting(false); }
  };

  const inputStyle = {
    width: '100%', padding: '9px 12px', border: '1px solid #e2e8f0',
    borderRadius: '8px', fontSize: '0.85rem', color: '#0f172a',
    background: '#f8fafc', outline: 'none', boxSizing: 'border-box',
  };
  const labelStyle = { fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '4px', letterSpacing: '0.04em' };
  const row2 = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(11, 15, 25, 0.7)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(4px)' }}>
      <div style={{ background: '#fff', borderRadius: '20px', width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto', padding: '32px', boxShadow: '0 25px 60px rgba(0,0,0,0.18)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 2px', letterSpacing: '-0.01em' }}>Edit Creator Prospect</h2>
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>Modify details, contacts, reach, or pipeline status.</p>
          </div>
          <button type="button" onClick={onClose} style={{ background: '#f1f5f9', border: 'none', padding: '6px', borderRadius: '8px', cursor: 'pointer', color: '#64748b' }}>
            <CloseIcon size={18} />
          </button>
        </div>

        {err && <div style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '16px' }}>{err}</div>}

        <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Creator Name *</label>
            <input style={inputStyle} value={form.name} onChange={set('name')} required />
          </div>

          <div style={row2}>
            <div>
              <label style={labelStyle}>Pipeline Stage</label>
              <select style={inputStyle} value={form.status} onChange={set('status')}>
                {PIPELINE_STAGES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Priority Tier</label>
              <select style={inputStyle} value={form.priority} onChange={set('priority')}>
                <option value="A">Tier A — High Impact</option>
                <option value="B">Tier B — Good Potential</option>
                <option value="C">Tier C — Normal</option>
              </select>
            </div>
          </div>

          <div style={row2}>
            <div>
              <label style={labelStyle}>Platform</label>
              <select style={inputStyle} value={form.platform} onChange={set('platform')}>
                {PLATFORMS.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Handle / Username</label>
              <input style={inputStyle} value={form.handle} onChange={set('handle')} placeholder="@username" />
            </div>
          </div>

          <div style={row2}>
            <div>
              <label style={labelStyle}>Followers</label>
              <input style={inputStyle} type="number" value={form.followers} onChange={set('followers')} />
            </div>
            <div>
              <label style={labelStyle}>Creator Tier</label>
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
              <label style={labelStyle}>Next Follow-up Date</label>
              <input style={inputStyle} type="date" value={form.next_followup} onChange={set('next_followup')} />
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
              <input style={inputStyle} value={form.city} onChange={set('city')} />
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
              <input style={inputStyle} value={form.niche} onChange={set('niche')} />
            </div>
          </div>

          <div style={row2}>
            <div>
              <label style={labelStyle}>Business / Signing Email</label>
              <input style={inputStyle} type="email" value={form.public_email} onChange={set('public_email')} />
            </div>
            <div>
              <label style={labelStyle}>Phone / WhatsApp</label>
              <input style={inputStyle} value={form.phone} onChange={set('phone')} />
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
              <label style={labelStyle}>Instagram Profile URL</label>
              <input style={inputStyle} value={form.instagram_url} onChange={set('instagram_url')} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Pitch Angle / Personalization Notes</label>
            <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: '56px' }} value={form.pitch_angle} onChange={set('pitch_angle')} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              style={{ padding: '9px 14px', borderRadius: '10px', border: '1px solid #fecaca', background: '#fef2f2', color: '#dc2626', fontWeight: 600, fontSize: '0.82rem', cursor: deleting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <TrashIcon size={16} />
              <span>{deleting ? 'Deleting...' : 'Delete Lead'}</span>
            </button>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="button" onClick={onClose} style={{ padding: '9px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#64748b', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}>
                Cancel
              </button>
              <button type="submit" disabled={saving} style={{ padding: '9px 20px', borderRadius: '10px', border: 'none', background: saving ? '#94a3b8' : '#0f172a', color: '#fff', fontWeight: 700, fontSize: '0.85rem', cursor: saving ? 'not-allowed' : 'pointer' }}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── APPROVE MODAL ────────────────────────────────────────────────────────────

function ApproveModal({ prospect, onApproved, onClose, token }) {
  // Compute default values
  const defaultSlug = (prospect.handle ? prospect.handle.replace(/^@/, '') : (prospect.name || 'creator'))
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  const defaultCoupon = `${(prospect.handle ? prospect.handle.replace(/^@/, '') : (prospect.name || 'CREATOR'))
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .substring(0, 8)}10`;

  const [signingEmail, setSigningEmail] = useState(prospect.public_email || '');
  const [password, setPassword] = useState(generateRandomPassword());
  const [showPassword, setShowPassword] = useState(true);
  const [slug, setSlug] = useState(defaultSlug);
  const [couponCode, setCouponCode] = useState(defaultCoupon);
  const [commissionRate, setCommissionRate] = useState(10);
  const [discountRate, setDiscountRate] = useState(10);
  const [phone, setPhone] = useState(prospect.phone || '');
  const [issuePass, setIssuePass] = useState(true);
  const [templateId, setTemplateId] = useState('proposal');

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copiedMsg, setCopiedMsg] = useState('');
  const [err, setErr] = useState('');

  const handleApprove = async () => {
    if (!signingEmail.trim()) {
      setErr('Please provide a signing email for the creator login.');
      return;
    }
    if (!password.trim() || password.trim().length < 6) {
      setErr('Please provide an initial dashboard password (minimum 6 characters).');
      return;
    }
    if (!slug.trim()) {
      setErr('Please specify the creator page handle / slug.');
      return;
    }
    if (!couponCode.trim()) {
      setErr('Please specify an assigned audience coupon code.');
      return;
    }

    setLoading(true); setErr('');
    try {
      const res = await fetch(`/api/admin/crm/${prospect.id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          signing_email: signingEmail.trim().toLowerCase(),
          password: password.trim(),
          creator_name: prospect.name,
          phone: phone.trim(),
          slug: slug.trim().toLowerCase(),
          coupon_code: couponCode.trim().toUpperCase(),
          commission_rate: Number(commissionRate) || 10,
          discount_rate: Number(discountRate) || 10,
          issue_gift_pass: issuePass,
          template_id: templateId,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Approval failed');
      setResult(data);
      onApproved();

      // Automatically open email client pre-filled with all login & creator details
      setTimeout(() => {
        const bodyText = `🎉 Hey ${prospect.name}!\n\n` +
          `Welcome to the LovelyCrafts Creator Partner Club! Your official partner dashboard and custom creator storefront are live and ready.\n\n` +
          `🔑 YOUR CREATOR DASHBOARD LOGIN:\n` +
          `• Portal: ${data.login_url || `${window.location.origin}/creator/login`}\n` +
          `• Email: ${data.email}\n` +
          `• Temporary Password: ${password.trim()}\n` +
          `• Change Password Link: ${window.location.origin}/creator/change-password (Please update after your first login!)\n\n` +
          `🛍️ YOUR AUDIENCE PERKS & COMMISSIONS:\n` +
          `• Coupon Code: ${data.coupon_code} (${data.discount_rate}% OFF for your audience)\n` +
          `• Your Commission: ${data.commission_rate}% on all orders tracked automatically\n` +
          `• Your Public Creator Page: ${data.referral_link || `${window.location.origin}/creators/${data.slug}`}\n` +
          `• 1-Click Discount Link: ${data.partner_promo_url || `${window.location.origin}/?ref=${data.coupon_code}`}\n` +
          (data.gift_code ? `\n🎁 YOUR COMPLIMENTARY VIP TEST PASS:\n• Pass Code: ${data.gift_code} (100% Free experience to test & create content with!)\n` : '') +
          `\nLogin to your dashboard anytime to track live clicks, orders, commission payouts, and request VIP review passes.\n\nLet's make some viral magic together! ✨`;

        const subject = `Welcome to LovelyCrafts Creator Club! Your Account & Login Details 🚀`;
        window.location.href = `mailto:${encodeURIComponent(data.email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
      }, 300);
    } catch (e) { setErr(e.message); }
    finally { setLoading(false); }
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopiedMsg(`Copied ${label}!`);
    setTimeout(() => setCopiedMsg(''), 2500);
  };

  const getWelcomePitchMessage = () => {
    if (!result) return '';
    const loginUrl = result.login_url || `${window.location.origin}/creator/login`;
    const partnerPage = result.referral_link || `${window.location.origin}/creators/${result.slug}`;
    const promoLink = result.partner_promo_url || `${window.location.origin}/?ref=${result.coupon_code}`;
    const changePasswordLink = `${window.location.origin}/creator/change-password`;
    
    return `🎉 Hey ${prospect.name}!\n\n` +
      `Welcome to the LovelyCrafts Creator Partner Club! Your official partner dashboard and custom creator storefront are live and ready.\n\n` +
      `🔑 YOUR CREATOR DASHBOARD LOGIN:\n` +
      `• Portal: ${loginUrl}\n` +
      `• Email: ${result.email}\n` +
      `• Temporary Password: ${password}\n` +
      `• Change Password Link: ${changePasswordLink} (Please update after first login)\n\n` +
      `🛍️ YOUR AUDIENCE PERKS & COMMISSIONS:\n` +
      `• Coupon Code: ${result.coupon_code} (${result.discount_rate}% OFF for your audience)\n` +
      `• Your Commission: ${result.commission_rate}% on all orders tracked automatically\n` +
      `• Your Public Creator Page: ${partnerPage}\n` +
      `• 1-Click Discount Link: ${promoLink}\n` +
      (result.gift_code ? `\n🎁 YOUR COMPLIMENTARY VIP TEST PASS:\n• Pass Code: ${result.gift_code} (100% Free experience to test & create content with!)\n` : '') +
      `\nLogin to your dashboard anytime to track live clicks, orders, commission payouts, and request VIP review passes.\n\nLet's make some viral magic together! ✨`;
  };

  const inputStyle = {
    width: '100%', padding: '9px 12px', border: '1px solid #e2e8f0',
    borderRadius: '8px', fontSize: '0.85rem', color: '#0f172a',
    background: '#f8fafc', outline: 'none', boxSizing: 'border-box',
  };
  const labelStyle = { fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '4px', letterSpacing: '0.04em' };
  const row2 = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(11, 15, 25, 0.7)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(4px)' }}>
      <div style={{ background: '#fff', borderRadius: '20px', width: '100%', maxWidth: '580px', maxHeight: '90vh', overflowY: 'auto', padding: '32px', boxShadow: '0 25px 60px rgba(0,0,0,0.18)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px', letterSpacing: '-0.01em' }}>
              {result ? 'Partner Account Successfully Activated!' : 'Approve & Onboard Creator'}
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>
              {result ? `Login credentials & creator storefront generated for ${prospect.name}.` : `Configure login credentials, coupon code, and creator page URL for ${prospect.name}.`}
            </p>
          </div>
          <button type="button" onClick={onClose} style={{ background: '#f1f5f9', border: 'none', padding: '6px', borderRadius: '8px', cursor: 'pointer', color: '#64748b' }}>
            <CloseIcon size={18} />
          </button>
        </div>

        {err && <div style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '16px' }}>{err}</div>}

        {result ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            
            {/* SUCCESS BANNER */}
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '14px', padding: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, color: '#15803d', fontSize: '1rem', marginBottom: '6px' }}>
                <CheckIcon size={20} />
                <span>Creator Account is Live!</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.82rem', color: '#166534', lineHeight: 1.5 }}>
                {prospect.name} can now sign in at the Creator Portal with these credentials or with Google using their signing email.
              </p>
            </div>

            {/* CREDENTIALS CARD */}
            <div style={{ background: '#0b0f19', borderRadius: '14px', padding: '20px', color: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Creator Dashboard Credentials</div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', borderBottom: '1px solid #1e293b', paddingBottom: '8px' }}>
                <span style={{ color: '#94a3b8' }}>Login Portal:</span>
                <a href={result.login_url || '/creator/login'} target="_blank" rel="noopener noreferrer" style={{ color: '#38bdf8', fontWeight: 600, textDecoration: 'none' }}>
                  /creator/login ↗
                </a>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', borderBottom: '1px solid #1e293b', paddingBottom: '8px' }}>
                <span style={{ color: '#94a3b8' }}>Signing Email:</span>
                <span style={{ fontWeight: 700, color: '#fff' }}>{result.email}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', borderBottom: '1px solid #1e293b', paddingBottom: '8px' }}>
                <span style={{ color: '#94a3b8' }}>Initial Password:</span>
                <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#f59e0b', background: '#1e293b', padding: '2px 8px', borderRadius: '6px' }}>{password}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', borderBottom: '1px solid #1e293b', paddingBottom: '8px' }}>
                <span style={{ color: '#94a3b8' }}>Coupon Code:</span>
                <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#4ade80', background: 'rgba(34,197,94,0.15)', padding: '2px 8px', borderRadius: '6px' }}>{result.coupon_code} ({result.discount_rate}% OFF)</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', borderBottom: '1px solid #1e293b', paddingBottom: '8px' }}>
                <span style={{ color: '#94a3b8' }}>Creator Page:</span>
                <a href={result.referral_link} target="_blank" rel="noopener noreferrer" style={{ color: '#38bdf8', fontWeight: 600, textDecoration: 'none' }}>
                  /creators/{result.slug} ↗
                </a>
              </div>

              {result.gift_code && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                  <span style={{ color: '#94a3b8' }}>VIP Test Pass:</span>
                  <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#ec4899', background: 'rgba(236,72,153,0.15)', padding: '2px 8px', borderRadius: '6px' }}>{result.gift_code}</span>
                </div>
              )}
            </div>

            {copiedMsg && (
              <div style={{ background: '#e0f2fe', color: '#0369a1', padding: '8px 12px', borderRadius: '8px', fontSize: '0.82rem', textAlign: 'center', fontWeight: 600 }}>
                {copiedMsg}
              </div>
            )}

            {/* ACTION BUTTONS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                type="button"
                onClick={() => {
                  const subject = `Welcome to LovelyCrafts Creator Club! Your Account & Login Details 🚀`;
                  const bodyText = getWelcomePitchMessage();
                  window.location.href = `mailto:${encodeURIComponent(result.email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
                }}
                style={{ padding: '12px', borderRadius: '10px', border: 'none', background: '#e11d48', color: '#fff', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(225, 29, 72, 0.25)' }}>
                <span>✉️ Open Welcome Email in Mail Client</span>
              </button>

              <button
                type="button"
                onClick={() => copyToClipboard(getWelcomePitchMessage(), 'Welcome Message')}
                style={{ padding: '10px', borderRadius: '10px', border: '1px solid #0284c7', background: '#f0f9ff', color: '#0369a1', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <CopyIcon size={16} />
                <span>Copy 1-Click WhatsApp / Email Welcome Pitch</span>
              </button>

              <button
                type="button"
                onClick={() => copyToClipboard(`Login: ${result.login_url || 'https://lovelycrafts.in/creator/login'}\nEmail: ${result.email}\nPassword: ${password}\nCoupon: ${result.coupon_code}`, 'Credentials')}
                style={{ padding: '10px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#0f172a', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <CopyIcon size={15} />
                <span>Copy Login Credentials Only</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                style={{ padding: '10px', borderRadius: '10px', border: 'none', background: '#0f172a', color: '#fff', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', marginTop: '6px' }}>
                Done
              </button>
            </div>

          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); handleApprove(); }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* EMAIL */}
            <div>
              <label style={labelStyle}>Creator Login / Signing Email *</label>
              <input
                style={inputStyle}
                type="email"
                value={signingEmail}
                onChange={(e) => setSigningEmail(e.target.value)}
                required
                placeholder="creator@gmail.com"
              />
              <span style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '3px', display: 'block' }}>
                Used by creator to log in at /creator/login or via Google Auth with this email.
              </span>
            </div>

            {/* PASSWORD & SLUG */}
            <div style={row2}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <label style={{ ...labelStyle, marginBottom: 0 }}>Initial Password *</label>
                  <button
                    type="button"
                    onClick={() => setPassword(generateRandomPassword())}
                    style={{ background: 'none', border: 'none', color: '#0284c7', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer', padding: 0 }}>
                    Generate New
                  </button>
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    style={inputStyle}
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    placeholder="Min 6 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', fontSize: '0.72rem', cursor: 'pointer', fontWeight: 600 }}>
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <div>
                <label style={labelStyle}>Creator URL Slug *</label>
                <div style={{ position: 'relative' }}>
                  <input
                    style={inputStyle}
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    required
                    placeholder="e.g. ananya"
                  />
                </div>
                <span style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '3px', display: 'block' }}>
                  Public Page: /creators/{slug || '...'}
                </span>
              </div>
            </div>

            {/* COUPON CODE & COMMISSIONS */}
            <div style={row2}>
              <div>
                <label style={labelStyle}>Assigned Coupon Code *</label>
                <input
                  style={{ ...inputStyle, textTransform: 'uppercase', fontFamily: 'monospace', fontWeight: 700 }}
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                  required
                  placeholder="e.g. ANANYA10"
                />
              </div>

              <div>
                <label style={labelStyle}>Commission Rate (%)</label>
                <select
                  style={inputStyle}
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(Number(e.target.value))}>
                  <option value={10}>10% Commission (Starter / Standard)</option>
                  <option value={15}>15% Commission (Rising Tier)</option>
                  <option value={16}>16% Commission (Creator Tier)</option>
                  <option value={17}>17% Commission (Partner Tier)</option>
                  <option value={18}>18% Commission (Elite Tier)</option>
                  <option value={20}>20% Commission (Custom)</option>
                  <option value={25}>25% Commission (Exclusive)</option>
                </select>
              </div>
            </div>

            {/* DISCOUNT RATE & PHONE */}
            <div style={row2}>
              <div>
                <label style={labelStyle}>Audience Discount (%)</label>
                <select
                  style={inputStyle}
                  value={discountRate}
                  onChange={(e) => setDiscountRate(Number(e.target.value))}>
                  <option value={10}>10% Audience Discount (Standard)</option>
                  <option value={15}>15% Audience Discount</option>
                  <option value={20}>20% Audience Discount</option>
                  <option value={25}>25% Audience Discount</option>
                  <option value={30}>30% Audience Discount</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Phone / WhatsApp</label>
                <input
                  style={inputStyle}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            {/* VIP FREE EXPERIENCE PASS */}
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer', padding: '14px', border: '1px solid #e2e8f0', borderRadius: '12px', background: issuePass ? '#f0fdf4' : '#f8fafc', transition: 'all 0.15s ease' }}>
              <input type="checkbox" checked={issuePass} onChange={(e) => setIssuePass(e.target.checked)} style={{ width: 18, height: 18, marginTop: '2px', accentColor: '#0f172a' }} />
              <div>
                <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.88rem' }}>Issue 100% Free Experience Pass</div>
                <div style={{ color: '#64748b', fontSize: '0.78rem', marginTop: '2px' }}>Generate a complimentary VIP coupon so creator can test the premium template live</div>
              </div>
            </label>

            {issuePass && (
              <div>
                <label style={labelStyle}>Select Template for VIP Pass</label>
                <select value={templateId} onChange={(e) => setTemplateId(e.target.value)} style={inputStyle}>
                  <option value="proposal">Love Proposal</option>
                  <option value="apology">Heartfelt Apology</option>
                  <option value="birthday">Birthday Surprise</option>
                  <option value="anniversary">Anniversary Celebration</option>
                </select>
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
              <button type="button" onClick={onClose} style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 600, color: '#64748b', cursor: 'pointer' }}>
                Cancel
              </button>
              <button type="submit" disabled={loading} style={{ flex: 2, padding: '10px', borderRadius: '10px', border: 'none', background: loading ? '#94a3b8' : '#15803d', color: '#fff', fontWeight: 700, fontSize: '0.9rem', cursor: loading ? 'not-allowed' : 'pointer' }}>
                {loading ? 'Activating Account...' : 'Approve & Provision Account'}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}

// ─── PROFILE DRAWER ───────────────────────────────────────────────────────────

function ProfileDrawer({ prospect, onClose, onUpdated, onEdit, token }) {
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
      const res = await fetch(`/api/admin/crm/${prospect.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(fields),
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
    setMsg('Saved');
    setTimeout(() => setMsg(''), 2000);
  };

  const handleAddOutreach = async () => {
    if (!outreachForm.date) return;
    await patch({ outreach_entry: outreachForm, last_contacted: outreachForm.date });
    setOutreachForm({ date: '', method: 'DM', message: '', response: '' });
    setAddingOutreach(false);
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to remove "${prospect.name}" from the CRM pipeline?`)) return;
    try {
      await fetch(`/api/admin/crm/${prospect.id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      onUpdated();
      onClose();
    } catch (e) { console.error(e); }
  };

  const fieldStyle = { width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.82rem', color: '#0f172a', background: '#f8fafc', boxSizing: 'border-box', outline: 'none' };
  const labelStyle = { fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '4px', letterSpacing: '0.04em' };

  return (
    <>
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(11, 15, 25, 0.5)', zIndex: 900, backdropFilter: 'blur(3px)' }} onClick={onClose} />
      <div style={{
        position: 'fixed', right: 0, top: 0, bottom: 0, width: '500px', maxWidth: '100%',
        background: '#fff', zIndex: 950, overflowY: 'auto', boxShadow: '-4px 0 40px rgba(0,0,0,0.15)',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{ padding: '24px', background: '#0b0f19', color: '#fff', flexShrink: 0, borderBottom: '1px solid #1e293b' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <Avatar name={p.name} size={48} />
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.15rem', color: '#f8fafc' }}>{p.name}</div>
                <div style={{ color: '#94a3b8', fontSize: '0.78rem', marginTop: '2px' }}>{p.niche} · {p.creator_type} · {formatFollowers(p.followers)}</div>
                <div style={{ marginTop: '8px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <PriorityBadge priority={p.priority} />
                  <StagePill status={p.status} />
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                onClick={() => onEdit(prospect)}
                title="Edit Prospect Details"
                style={{ background: '#1e293b', border: '1px solid #334155', color: '#f8fafc', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                <EditIcon size={14} />
                <span>Edit</span>
              </button>
              <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}>
                <CloseIcon size={20} />
              </button>
            </div>
          </div>
        </div>

        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Status & Priority */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={labelStyle}>Pipeline Stage</label>
              <select style={fieldStyle} value={p.status} onChange={(e) => handleStatusChange(e.target.value)}>
                {PIPELINE_STAGES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Priority Level</label>
              <select style={fieldStyle} value={p.priority || 'B'}
                onChange={(e) => { setEditing((ed) => ({ ...ed, priority: e.target.value })); patch({ priority: e.target.value }); }}>
                <option value="A">Tier A — High</option>
                <option value="B">Tier B — Medium</option>
                <option value="C">Tier C — Normal</option>
              </select>
            </div>
          </div>

          {/* Next Follow-up */}
          <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '16px', border: '1px solid #e2e8f0' }}>
            <label style={labelStyle}>Next Follow-up Date</label>
            <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
              <input type="date" style={{ ...fieldStyle, flex: 1 }}
                value={editing.next_followup !== undefined ? editing.next_followup : (p.next_followup || '')}
                onChange={(e) => setEditing((ed) => ({ ...ed, next_followup: e.target.value }))} />
              <button onClick={handleSaveNextAction} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#0f172a', color: '#fff', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}>
                {saving ? '...' : msg || 'Save'}
              </button>
            </div>
            {p.last_contacted && (
              <div style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '8px' }}>Last contact date: {p.last_contacted}</div>
            )}
          </div>

          {/* Contact Details */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.85rem' }}>Contact Channels</div>
              <button onClick={() => onEdit(prospect)} style={{ background: 'none', border: 'none', color: '#0284c7', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
                Edit Details
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem', color: '#475569', background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              {p.public_email && <div>Email: <a href={`mailto:${p.public_email}`} style={{ color: '#0284c7', textDecoration: 'none', fontWeight: 600 }}>{p.public_email}</a></div>}
              {p.phone && <div>Phone: <strong style={{ color: '#0f172a' }}>{p.phone}</strong></div>}
              {p.handle && <div>{p.platform}: <strong>@{p.handle.replace(/^@/, '')}</strong></div>}
              {p.instagram_url && <div>Instagram: <a href={p.instagram_url} target="_blank" rel="noopener noreferrer" style={{ color: '#0284c7', textDecoration: 'none' }}>{p.instagram_url}</a></div>}
              {p.youtube_url && <div>YouTube: <a href={p.youtube_url} target="_blank" rel="noopener noreferrer" style={{ color: '#0284c7', textDecoration: 'none' }}>{p.youtube_url}</a></div>}
              <div>Contact Route: <strong>{p.contact_route}</strong></div>
            </div>
          </div>

          {/* Audience Details */}
          <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '16px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.85rem', marginBottom: '10px' }}>Audience &amp; Reach</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.82rem', color: '#475569' }}>
              <div>Location: <strong>{p.state || 'India'}{p.city ? `, ${p.city}` : ''}</strong></div>
              <div>Language: <strong>{p.language}</strong></div>
              <div>Followers: <strong>{formatFollowers(p.followers)}</strong></div>
              <div>Fit Score: <strong>{p.fit_score}/10</strong></div>
            </div>
          </div>

          {/* Outreach History */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.85rem' }}>Outreach History</div>
              <button onClick={() => setAddingOutreach(true)} style={{ padding: '4px 10px', borderRadius: '6px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '0.75rem', fontWeight: 600, color: '#0284c7', cursor: 'pointer' }}>
                + Record Contact
              </button>
            </div>

            {addingOutreach && (
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px', marginBottom: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={labelStyle}>Date</label>
                    <input type="date" style={fieldStyle} value={outreachForm.date} onChange={(e) => setOutreachForm((f) => ({ ...f, date: e.target.value }))} />
                  </div>
                  <div>
                    <label style={labelStyle}>Channel</label>
                    <select style={fieldStyle} value={outreachForm.method} onChange={(e) => setOutreachForm((f) => ({ ...f, method: e.target.value }))}>
                      {['DM', 'Email', 'WhatsApp', 'Call'].map((m) => <option key={m}>{m}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Message / Pitch Summary</label>
                  <textarea style={{ ...fieldStyle, resize: 'vertical', minHeight: '48px' }} value={outreachForm.message} onChange={(e) => setOutreachForm((f) => ({ ...f, message: e.target.value }))} placeholder="Pitch sent / follow-up discussion..." />
                </div>
                <div>
                  <label style={labelStyle}>Response Received</label>
                  <input style={fieldStyle} value={outreachForm.response} onChange={(e) => setOutreachForm((f) => ({ ...f, response: e.target.value }))} placeholder="Interested / positive / no reply..." />
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => setAddingOutreach(false)} style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', fontWeight: 600, color: '#64748b', cursor: 'pointer', fontSize: '0.8rem' }}>Cancel</button>
                  <button onClick={handleAddOutreach} style={{ flex: 2, padding: '8px', borderRadius: '8px', border: 'none', background: '#0f172a', color: '#fff', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}>Save Log</button>
                </div>
              </div>
            )}

            {(prospect.outreach_history || []).length === 0 && !addingOutreach ? (
              <div style={{ color: '#94a3b8', fontSize: '0.8rem', fontStyle: 'italic' }}>No outreach interactions logged yet.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[...(prospect.outreach_history || [])].reverse().map((entry, i) => (
                  <div key={i} style={{ borderLeft: '3px solid #0284c7', paddingLeft: '12px', fontSize: '0.8rem' }}>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{entry.date} · {entry.method}</div>
                    {entry.message && <div style={{ color: '#475569', marginTop: '2px' }}>{entry.message}</div>}
                    {entry.response && <div style={{ color: '#15803d', marginTop: '2px', fontWeight: 600 }}>↩ {entry.response}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
            {!p.linked_creator_id && (
              <button onClick={() => setShowApprove(true)} style={{ width: '100%', padding: '11px', borderRadius: '10px', border: 'none', background: '#15803d', color: '#fff', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <CheckIcon size={18} />
                <span>Approve &amp; Activate Partner Account</span>
              </button>
            )}

            <button
              onClick={() => onEdit(prospect)}
              style={{ width: '100%', padding: '9px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#0f172a', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <EditIcon size={15} />
              <span>Edit Lead Information</span>
            </button>

            <button
              onClick={handleDelete}
              style={{ width: '100%', padding: '9px', borderRadius: '10px', border: '1px solid #fecaca', background: '#fff', color: '#b91c1c', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <TrashIcon size={15} />
              <span>Remove Lead from CRM</span>
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

function KanbanView({ prospects, onSelectProspect, onEditProspect, onDeleteProspect }) {
  return (
    <div style={{ overflowX: 'auto', paddingBottom: '16px' }}>
      <div style={{ display: 'flex', gap: '14px', minWidth: 'max-content' }}>
        {KANBAN_STAGES.map((stage) => {
          const cards = prospects.filter((p) => p.status === stage);
          const cfg = STAGE_COLORS[stage] || { bg: '#f1f5f9', text: '#475569', border: '#e2e8f0' };
          return (
            <div key={stage} style={{ width: '240px', flexShrink: 0 }}>
              
              {/* STAGE HEADER */}
              <div style={{
                padding: '10px 14px', borderRadius: '12px 12px 0 0',
                background: cfg.bg, color: cfg.text, fontWeight: 700, fontSize: '0.8rem',
                border: `1px solid ${cfg.border}`, borderBottom: 'none',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <span style={{ letterSpacing: '-0.01em' }}>{stage}</span>
                <span style={{ background: 'rgba(0,0,0,0.08)', borderRadius: '999px', padding: '2px 8px', fontSize: '0.72rem', fontWeight: 700 }}>
                  {cards.length}
                </span>
              </div>

              {/* STAGE COLUMN */}
              <div style={{ background: '#f8fafc', border: `1px solid ${cfg.border}`, borderTop: 'none', borderRadius: '0 0 12px 12px', minHeight: '140px', padding: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {cards.map((p) => {
                  const todayStr = new Date().toISOString().split('T')[0];
                  const overdue = p.next_followup && p.next_followup <= todayStr;
                  return (
                    <div key={p.id}
                      style={{
                        background: '#fff', borderRadius: '10px', padding: '12px',
                        border: overdue ? '1px solid #fca5a5' : '1px solid #e2e8f0',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, cursor: 'pointer' }} onClick={() => onSelectProspect(p)}>
                          <Avatar name={p.name} size={28} />
                          <div style={{ minWidth: 0 }}>
                            <span style={{ fontWeight: 700, fontSize: '0.82rem', color: '#0f172a', lineHeight: 1.2, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {p.name}
                            </span>
                            <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{p.niche || 'General'}</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); onEditProspect(p); }}
                          title="Edit Lead"
                          style={{ background: '#f1f5f9', border: 'none', padding: '5px', borderRadius: '6px', color: '#64748b', cursor: 'pointer' }}>
                          <EditIcon size={14} />
                        </button>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #f1f5f9', cursor: 'pointer' }} onClick={() => onSelectProspect(p)}>
                        <PriorityBadge priority={p.priority} />
                        <span style={{ fontSize: '0.72rem', color: '#475569', fontWeight: 600 }}>{formatFollowers(p.followers)}</span>
                      </div>

                      {overdue && (
                        <div style={{ marginTop: '6px', fontSize: '0.68rem', color: '#dc2626', fontWeight: 700, background: '#fef2f2', padding: '2px 6px', borderRadius: '4px', textAlign: 'center' }}>
                          Follow-up Due
                        </div>
                      )}
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

// ─── MAIN CRM PAGE ────────────────────────────────────────────────────────────

export default function AdminCRMPage() {
  const { user } = useAuth();
  const [prospects, setProspects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('list'); // 'list' | 'kanban' | 'today'
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedProspect, setSelectedProspect] = useState(null);
  const [editingProspect, setEditingProspect] = useState(null);
  const [approvingProspect, setApprovingProspect] = useState(null);
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
      'Phone': p.phone || '',
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
    { label: 'Total in Funnel', value: prospects.length, color: '#0f172a' },
    { label: 'Discovered', value: byStatus['Discovered'] || 0, color: '#6d28d9' },
    { label: 'Contacted', value: (byStatus['Contacted'] || 0) + (byStatus['Follow-up 1'] || 0) + (byStatus['Follow-up 2'] || 0), color: '#1d4ed8' },
    { label: 'Interested', value: byStatus['Interested'] || 0, color: '#047857' },
    { label: 'Approved / Active', value: (byStatus['Approved'] || 0) + (byStatus['Active'] || 0) + (byStatus['Free Pass Sent'] || 0) + (byStatus['First Content'] || 0), color: '#15803d' },
    { label: 'Converted', value: byStatus['Converted'] || 0, color: '#166534' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* HEADER & ACTIONS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px', letterSpacing: '-0.02em' }}>
            Creator CRM Pipeline
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
            Lead generation, partner onboarding, and outreach tracking from initial discovery to active sales.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          {dueTodayCount > 0 && (
            <button onClick={() => setView('today')}
              style={{ padding: '8px 14px', borderRadius: '10px', border: '1px solid #fecaca', background: '#fef2f2', color: '#dc2626', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#dc2626' }} />
              <span>{dueTodayCount} Follow-up{dueTodayCount > 1 ? 's' : ''} Due Today</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleExportExcel}
            disabled={loading || filtered.length === 0}
            style={{
              padding: '10px 16px', borderRadius: '10px', border: '1px solid #e2e8f0',
              background: '#ffffff', color: '#0f172a',
              fontWeight: 600, fontSize: '0.85rem',
              cursor: loading || filtered.length === 0 ? 'not-allowed' : 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              opacity: loading || filtered.length === 0 ? 0.6 : 1,
              transition: 'all 0.15s',
            }}
          >
            <DownloadIcon size={16} />
            <span>Export Excel</span>
          </button>

          <button onClick={() => setShowAddForm(true)}
            style={{ padding: '10px 18px', borderRadius: '10px', border: 'none', background: '#0f172a', color: '#fff', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 2px 6px rgba(15, 23, 42, 0.15)' }}>
            <PlusIcon size={16} />
            <span>Add Creator Lead</span>
          </button>
        </div>
      </div>

      {/* PIPELINE STAT TILES */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
        {statCards.map((s) => (
          <div key={s.label} style={{ background: '#fff', padding: '18px', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: s.color, letterSpacing: '-0.02em' }}>{s.value}</div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: '4px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* VIEW TOGGLE & SEARCH */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* VIEW BUTTONS */}
        <div style={{ display: 'flex', gap: '4px', background: '#ffffff', padding: '4px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          {[
            { key: 'list', label: 'List Ledger' },
            { key: 'kanban', label: 'Kanban Board' },
            { key: 'today', label: `Today's Action${dueTodayCount > 0 ? ` (${dueTodayCount})` : ''}` },
          ].map((v) => (
            <button key={v.key} onClick={() => setView(v.key)}
              style={{ padding: '7px 16px', borderRadius: '8px', border: 'none', background: view === v.key ? '#0f172a' : 'transparent', color: view === v.key ? '#fff' : '#64748b', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', transition: 'all 0.15s' }}>
              {v.label}
            </button>
          ))}
        </div>

        {/* SEARCH & FILTERS */}
        {view !== 'kanban' && (
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', width: '280px', maxWidth: '100%' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', display: 'flex' }}>
                <SearchIcon size={16} />
              </span>
              <input
                type="text"
                placeholder="Search name, niche, email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: '100%', padding: '8px 12px 8px 36px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '0.82rem', outline: 'none', background: '#fff' }}
              />
            </div>

            {view === 'list' && (
              <>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                  style={{ padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '0.82rem', background: '#fff', color: '#0f172a', outline: 'none' }}>
                  <option value="all">All Stages</option>
                  {PIPELINE_STAGES.map((s) => <option key={s}>{s}</option>)}
                </select>

                <div style={{ display: 'flex', gap: '4px', background: '#ffffff', padding: '3px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  {['all', 'A', 'B', 'C'].map((p) => (
                    <button key={p} onClick={() => setPriorityFilter(p)}
                      style={{ padding: '5px 10px', borderRadius: '6px', border: 'none', background: priorityFilter === p ? '#0f172a' : 'transparent', color: priorityFilter === p ? '#fff' : '#64748b', fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer' }}>
                      {p === 'all' ? 'All Tiers' : `Tier ${p}`}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* CONTENT: KANBAN OR TABLE */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '3px solid #e2e8f0', borderTopColor: '#0284c7', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
          <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>Loading CRM lead records...</p>
        </div>
      ) : view === 'kanban' ? (
        <KanbanView
          prospects={prospects}
          onSelectProspect={setSelectedProspect}
          onEditProspect={setEditingProspect}
          onDeleteProspect={loadProspects}
        />
      ) : (
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '980px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  {['Creator', 'Platform / Handle', 'Location', 'Niche & Type', 'Followers', 'Fit', 'Priority', 'Status', 'Next Follow-up', 'Actions'].map((h) => (
                    <th key={h} style={{ padding: '14px 16px', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={10} style={{ padding: '60px 20px', textAlign: 'center', color: '#94a3b8' }}>
                      <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                        {view === 'today' ? 'All caught up! No follow-ups scheduled for today.' : 'No creator leads found.'}
                      </div>
                      <div style={{ fontSize: '0.8rem' }}>Try changing the search query or stage filters.</div>
                    </td>
                  </tr>
                ) : filtered.map((p) => {
                  const overdue = p.next_followup && p.next_followup <= todayStr;
                  return (
                    <tr key={p.id}
                      style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.1s ease' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                      
                      <td style={{ padding: '14px 16px', cursor: 'pointer' }} onClick={() => setSelectedProspect(p)}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <Avatar name={p.name} size={32} />
                          <div>
                            <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.85rem' }}>{p.name}</div>
                            {p.public_email && <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{p.public_email}</div>}
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: '14px 16px', fontSize: '0.82rem', color: '#0284c7', cursor: 'pointer' }} onClick={() => setSelectedProspect(p)}>
                        <div style={{ fontWeight: 600 }}>{p.platform}</div>
                        {p.handle && <div style={{ color: '#64748b', fontSize: '0.75rem' }}>@{p.handle.replace(/^@/, '')}</div>}
                      </td>

                      <td style={{ padding: '14px 16px', fontSize: '0.82rem', color: '#475569', cursor: 'pointer' }} onClick={() => setSelectedProspect(p)}>
                        <div>{p.state || 'India'}</div>
                        <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{p.language}</span>
                      </td>

                      <td style={{ padding: '14px 16px', fontSize: '0.82rem', color: '#475569', cursor: 'pointer' }} onClick={() => setSelectedProspect(p)}>
                        <div>{p.niche || 'General'}</div>
                        <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{p.creator_type}</span>
                      </td>

                      <td style={{ padding: '14px 16px', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', cursor: 'pointer' }} onClick={() => setSelectedProspect(p)}>
                        {formatFollowers(p.followers)}
                      </td>

                      <td style={{ padding: '14px 16px', fontSize: '0.82rem', cursor: 'pointer' }} onClick={() => setSelectedProspect(p)}>
                        <span style={{ fontWeight: 700, color: p.fit_score >= 8 ? '#15803d' : p.fit_score >= 6 ? '#b45309' : '#dc2626' }}>
                          {p.fit_score}/10
                        </span>
                      </td>

                      <td style={{ padding: '14px 16px', cursor: 'pointer' }} onClick={() => setSelectedProspect(p)}>
                        <PriorityBadge priority={p.priority} />
                      </td>

                      <td style={{ padding: '14px 16px', cursor: 'pointer' }} onClick={() => setSelectedProspect(p)}>
                        <StagePill status={p.status} />
                      </td>

                      <td style={{ padding: '14px 16px', fontSize: '0.8rem', cursor: 'pointer' }} onClick={() => setSelectedProspect(p)}>
                        {p.next_followup ? (
                          <span style={{ color: overdue ? '#dc2626' : '#475569', fontWeight: overdue ? 700 : 400 }}>
                            {p.next_followup}
                          </span>
                        ) : <span style={{ color: '#94a3b8' }}>—</span>}
                      </td>

                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {!p.linked_creator_id ? (
                            <button
                              type="button"
                              onClick={() => setApprovingProspect(p)}
                              title="Approve Creator"
                              style={{ padding: '5px 8px', borderRadius: '6px', border: '1px solid #bbf7d0', background: '#f0fdf4', color: '#15803d', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}>
                              <CheckIcon size={13} />
                              <span>Approve</span>
                            </button>
                          ) : (
                            <span style={{ fontSize: '0.72rem', color: '#15803d', fontWeight: 700, background: '#dcfce7', padding: '2px 6px', borderRadius: '4px' }}>
                              Partner
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() => setEditingProspect(p)}
                            title="Edit Prospect"
                            style={{ padding: '5px', borderRadius: '6px', border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', cursor: 'pointer' }}>
                            <EditIcon size={14} />
                          </button>
                        </div>
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
          onEdit={(p) => {
            setSelectedProspect(null);
            setEditingProspect(p);
          }}
          onUpdated={() => {
            loadProspects();
            setSelectedProspect(null);
          }}
        />
      )}

      {/* Edit Prospect Modal */}
      {editingProspect && (
        <EditProspectModal
          prospect={editingProspect}
          token={token}
          onSave={() => { setEditingProspect(null); loadProspects(); }}
          onDelete={() => { setEditingProspect(null); loadProspects(); }}
          onClose={() => setEditingProspect(null)}
        />
      )}

      {/* Quick Approve Modal */}
      {approvingProspect && (
        <ApproveModal
          prospect={approvingProspect}
          token={token}
          onApproved={() => { loadProspects(); }}
          onClose={() => setApprovingProspect(null)}
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
