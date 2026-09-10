'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { templates } from '@/lib/templates';
import {
  GiftsIcon,
  PlusIcon,
  CopyIcon,
  CheckIcon,
  CloseIcon,
  ExternalLinkIcon,
  SearchIcon
} from '@/components/admin/AdminIcons';

function CopyButton({ text, label = 'Copy' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      style={{
        background: copied ? '#dcfce7' : '#f1f5f9',
        color: copied ? '#15803d' : '#475569',
        border: `1px solid ${copied ? '#bbf7d0' : '#e2e8f0'}`,
        padding: '3px 8px',
        borderRadius: '6px',
        fontSize: '0.72rem',
        fontWeight: 600,
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        transition: 'all 0.15s ease',
      }}
      title="Click to copy coupon code"
    >
      {copied ? <CheckIcon size={12} /> : <CopyIcon size={12} />}
      <span>{copied ? 'Copied' : label}</span>
    </button>
  );
}

export default function AdminCreatorGiftsPage() {
  const { user } = useAuth();
  const [gifts, setGifts] = useState([]);
  const [creators, setCreators] = useState([]);
  const [prospects, setProspects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal state
  const [isCreating, setIsCreating] = useState(false);
  const [targetType, setTargetType] = useState('prospect'); // 'prospect' | 'creator'
  const [selectedCreatorId, setSelectedCreatorId] = useState('');
  const [selectedProspectId, setSelectedProspectId] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState(templates[0]?.id || 'proposal');
  const [customCode, setCustomCode] = useState('');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const loadData = useCallback(async () => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      const [gRes, crRes, pRes] = await Promise.all([
        fetch('/api/admin/creator-gifts', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/creators', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/crm', { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const gData = await gRes.json();
      const crData = await crRes.json();
      const pData = await pRes.json();

      if (gData.gifts) setGifts(gData.gifts);
      if (crData.creators) setCreators(crData.creators);
      if (pData.prospects) setProspects(pData.prospects);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleIssueGift = async (e) => {
    e.preventDefault();
    if (targetType === 'creator' && !selectedCreatorId) {
      alert('Please select a creator.');
      return;
    }
    if (targetType === 'prospect' && !selectedProspectId) {
      alert('Please select a CRM prospect.');
      return;
    }
    if (!selectedTemplateId) {
      alert('Please select an experience template.');
      return;
    }

    setSubmitting(true);
    setMessage('');

    try {
      const token = await user.getIdToken();
      const payload = {
        target_type: targetType,
        creator_id: targetType === 'creator' ? selectedCreatorId : undefined,
        crm_prospect_id: targetType === 'prospect' ? selectedProspectId : undefined,
        template_id: selectedTemplateId,
        custom_code: customCode || undefined,
        note,
      };

      const res = await fetch('/api/admin/creator-gifts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to issue gift pass');

      setMessage(`VIP Pass "${data.code}" issued successfully!`);
      setIsCreating(false);
      setSelectedCreatorId('');
      setSelectedProspectId('');
      setCustomCode('');
      setNote('');
      loadData();
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredGifts = gifts.filter((g) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    const code = (g.code || '').toLowerCase();
    const creator = (creators.find((c) => c.id === g.creator_id)?.name || '').toLowerCase();
    const prospect = (prospects.find((p) => p.id === g.crm_prospect_id)?.name || '').toLowerCase();
    return code.includes(term) || creator.includes(term) || prospect.includes(term);
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* HEADER & ACTIONS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px', letterSpacing: '-0.02em' }}>
            VIP Experience Gift Passes
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
            Generate 100% complimentary VIP passes for creators or prospective partners to experience premium templates.
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
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 2px 6px rgba(15, 23, 42, 0.15)'
          }}
        >
          <PlusIcon size={16} />
          <span>Issue New VIP Pass</span>
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
          placeholder="Search pass code or recipient..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: '100%', padding: '8px 12px 8px 36px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '0.82rem', outline: 'none', background: '#fff' }}
        />
      </div>

      {/* TABLE */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '3px solid #e2e8f0', borderTopColor: '#0284c7', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
          <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>Loading issued VIP passes...</p>
        </div>
      ) : (
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '850px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '14px 20px', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>VIP Pass Code</th>
                  <th style={{ padding: '14px 20px', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recipient</th>
                  <th style={{ padding: '14px 20px', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Template</th>
                  <th style={{ padding: '14px 20px', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Issued Date</th>
                  <th style={{ padding: '14px 20px', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredGifts.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '60px 20px', textAlign: 'center', color: '#94a3b8' }}>
                      <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>No gift passes found</div>
                      <div style={{ fontSize: '0.8rem' }}>Issue a 100% complimentary pass for creator outreach.</div>
                    </td>
                  </tr>
                ) : (
                  filteredGifts.map((g) => {
                    const creator = creators.find((c) => c.id === g.creator_id);
                    const prospect = prospects.find((p) => p.id === g.crm_prospect_id);
                    const recipientName = creator?.name || prospect?.name || g.recipient_name || 'Prospect';
                    const isRedeemed = g.used || g.used_count > 0;

                    return (
                      <tr key={g.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.1s ease' }}>
                        
                        {/* PASS CODE */}
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '0.95rem', color: '#0f172a', background: '#f1f5f9', padding: '3px 8px', borderRadius: '6px' }}>
                              {g.code}
                            </span>
                            <CopyButton text={g.code} />
                          </div>
                          {g.note && <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px' }}>{g.note}</div>}
                        </td>

                        {/* RECIPIENT */}
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.88rem' }}>
                            {recipientName}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                            {creator ? 'Creator Partner' : 'CRM Lead'}
                          </div>
                        </td>

                        {/* TEMPLATE */}
                        <td style={{ padding: '16px 20px', fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>
                          <span style={{ textTransform: 'capitalize' }}>{g.template_id || 'All Templates'}</span>
                        </td>

                        {/* DATE */}
                        <td style={{ padding: '16px 20px', fontSize: '0.82rem', color: '#64748b' }}>
                          {g.created_at ? new Date(g.created_at).toLocaleDateString([], { dateStyle: 'medium' }) : 'Recent'}
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
                              background: isRedeemed ? '#f1f5f9' : '#dcfce7',
                              color: isRedeemed ? '#64748b' : '#15803d',
                              border: `1px solid ${isRedeemed ? '#e2e8f0' : '#bbf7d0'}`,
                            }}
                          >
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: isRedeemed ? '#94a3b8' : '#22c55e' }} />
                            <span>{isRedeemed ? 'Redeemed' : 'Ready / Active'}</span>
                          </span>
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

      {/* ISSUE MODAL */}
      {isCreating && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(11, 15, 25, 0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#fff', borderRadius: '20px', padding: '32px', maxWidth: '580px', width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 60px rgba(0,0,0,0.18)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 2px', letterSpacing: '-0.01em' }}>
                  Issue Complimentary VIP Pass
                </h2>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>Generate 100% discount pass for prospective creators.</p>
              </div>
              <button type="button" onClick={() => setIsCreating(false)} style={{ background: '#f1f5f9', border: 'none', padding: '6px', borderRadius: '8px', cursor: 'pointer', color: '#64748b' }}>
                <CloseIcon size={18} />
              </button>
            </div>

            <form onSubmit={handleIssueGift} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* TARGET TYPE */}
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.04em' }}>Recipient Source</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setTargetType('prospect')}
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      border: targetType === 'prospect' ? '2px solid #0f172a' : '1px solid #e2e8f0',
                      background: targetType === 'prospect' ? '#f8fafc' : '#ffffff',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      color: '#0f172a'
                    }}
                  >
                    CRM Pipeline Lead
                  </button>
                  <button
                    type="button"
                    onClick={() => setTargetType('creator')}
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      border: targetType === 'creator' ? '2px solid #0f172a' : '1px solid #e2e8f0',
                      background: targetType === 'creator' ? '#f8fafc' : '#ffffff',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      color: '#0f172a'
                    }}
                  >
                    Existing Creator
                  </button>
                </div>
              </div>

              {targetType === 'prospect' ? (
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.04em' }}>Select CRM Lead *</label>
                  <select
                    required
                    value={selectedProspectId}
                    onChange={(e) => setSelectedProspectId(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#0f172a', outline: 'none' }}
                  >
                    <option value="">Select lead from pipeline</option>
                    {prospects.map((p) => (
                      <option key={p.id} value={p.id}>{p.name} ({p.niche} · {p.platform})</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.04em' }}>Select Creator *</label>
                  <select
                    required
                    value={selectedCreatorId}
                    onChange={(e) => setSelectedCreatorId(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#0f172a', outline: 'none' }}
                  >
                    <option value="">Select creator partner</option>
                    {creators.map((c) => (
                      <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.04em' }}>Experience Template *</label>
                <select
                  value={selectedTemplateId}
                  onChange={(e) => setSelectedTemplateId(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#0f172a', outline: 'none' }}
                >
                  <option value="proposal">Love Proposal</option>
                  <option value="apology">Heartfelt Apology</option>
                  <option value="birthday">Birthday Surprise</option>
                  <option value="anniversary">Anniversary Celebration</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.04em' }}>Custom Pass Code (Optional)</label>
                <input
                  type="text"
                  placeholder="Auto-generated if left blank"
                  value={customCode}
                  onChange={(e) => setCustomCode(e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, ''))}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#0f172a', outline: 'none', boxSizing: 'border-box', fontFamily: 'monospace' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.04em' }}>Campaign / Notes (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Outreach campaign wave 1"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#0f172a', outline: 'none', boxSizing: 'border-box' }}
                />
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
                  {submitting ? 'Generating...' : 'Issue VIP Pass'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
