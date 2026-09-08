'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { templates } from '@/lib/templates';

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
        border: `1px solid ${copied ? '#86efac' : '#cbd5e1'}`,
        padding: '3px 8px',
        borderRadius: '6px',
        fontSize: '0.75rem',
        fontWeight: 700,
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        transition: 'all 0.15s ease',
      }}
      title="Click to copy coupon code"
    >
      <span>{copied ? '✓' : '📋'}</span>
      <span>{copied ? 'Copied!' : label}</span>
    </button>
  );
}

export default function AdminCreatorGiftsPage() {
  const { user } = useAuth();
  const [gifts, setGifts] = useState([]);
  const [creators, setCreators] = useState([]);
  const [prospects, setProspects] = useState([]);
  const [loading, setLoading] = useState(true);

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
  const [lastIssuedCode, setLastIssuedCode] = useState('');

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

      setLastIssuedCode(data.code);
      setMessage(`✓ Gift pass "${data.code}" issued successfully!`);
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

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>
            🎁 Creator VIP &amp; Prospect Gift Passes
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
            Generate 100% complimentary single-use experience passes for CRM prospects &amp; onboarded creators.
          </p>
        </div>

        <button
          type="button"
          onClick={() => { setIsCreating(true); setMessage(''); }}
          style={{
            background: '#db2777',
            color: '#fff',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '10px',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(219,39,119,0.2)',
          }}
        >
          + Issue VIP Gift Pass
        </button>
      </div>

      {/* Alert / Success Message with Copy */}
      {message && (
        <div style={{
          padding: '12px 18px',
          borderRadius: '12px',
          fontSize: '0.9rem',
          marginBottom: '20px',
          background: message.startsWith('✓') ? '#dcfce7' : '#fee2e2',
          color: message.startsWith('✓') ? '#15803d' : '#b91c1c',
          border: `1px solid ${message.startsWith('✓') ? '#86efac' : '#fca5a5'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px',
        }}>
          <span style={{ fontWeight: 600 }}>{message}</span>
          {lastIssuedCode && (
            <CopyButton text={lastIssuedCode} label={`Copy ${lastIssuedCode}`} />
          )}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Loading gift passes...</div>
      ) : (
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '820px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '12px 16px', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase' }}>Issued Date</th>
                  <th style={{ padding: '12px 16px', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase' }}>Recipient Type</th>
                  <th style={{ padding: '12px 16px', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase' }}>Creator / Prospect</th>
                  <th style={{ padding: '12px 16px', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase' }}>Gift Coupon Code (1-Click Copy)</th>
                  <th style={{ padding: '12px 16px', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase' }}>Template Scope</th>
                  <th style={{ padding: '12px 16px', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase' }}>Claim Status</th>
                </tr>
              </thead>
              <tbody>
                {gifts.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
                      No creator gift passes issued yet. Click &quot;+ Issue VIP Gift Pass&quot; to send a test pass.
                    </td>
                  </tr>
                ) : (
                  gifts.map((g) => {
                    const matchedCreator = creators.find((cr) => cr.id === g.creator_id);
                    const isProspect = g.target_type === 'prospect' || Boolean(g.crm_prospect_id && !g.creator_id);

                    return (
                      <tr key={g.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '14px 16px', fontSize: '0.85rem', color: '#334155' }}>
                          {g.created_at ? new Date(g.created_at).toLocaleDateString() : 'Recent'}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            background: isProspect ? '#eff6ff' : '#fdf2f8',
                            color: isProspect ? '#1d4ed8' : '#be185d',
                            border: `1px solid ${isProspect ? '#bfdbfe' : '#fbcfe8'}`,
                          }}>
                            {isProspect ? '🎯 CRM Lead' : '👥 Creator'}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9rem' }}>
                            {g.creator_name || matchedCreator?.name || `ID: ${g.creator_id?.substring(0, 8) || g.crm_prospect_id?.substring(0, 8)}...`}
                          </div>
                          {g.note && (
                            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                              📝 {g.note}
                            </div>
                          )}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{
                              fontFamily: 'monospace',
                              fontWeight: 800,
                              color: '#be185d',
                              background: '#fdf2f8',
                              padding: '3px 8px',
                              borderRadius: '6px',
                              fontSize: '0.9rem',
                              border: '1px solid #fbcfe8',
                            }}>
                              {g.code}
                            </span>
                            <CopyButton text={g.code} />
                          </div>
                        </td>
                        <td style={{ padding: '14px 16px', fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>
                          {g.template_id}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span
                            style={{
                              padding: '3px 8px',
                              borderRadius: '999px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              background: g.claimed ? '#e2e8f0' : '#dcfce7',
                              color: g.claimed ? '#64748b' : '#15803d',
                            }}
                          >
                            {g.claimed ? '✓ Claimed' : '● Available (100% Free)'}
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

      {/* ISSUE GIFT MODAL */}
      {isCreating && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '16px' }}>
          <div style={{ background: '#fff', borderRadius: '20px', padding: '28px', maxWidth: '540px', width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Issue VIP Complimentary Pass
              </h2>
              <button type="button" onClick={() => setIsCreating(false)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#64748b' }}>✕</button>
            </div>

            <form onSubmit={handleIssueGift} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Target Type Selector */}
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '6px', textTransform: 'uppercase' }}>
                  Target Recipient Type *
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setTargetType('prospect')}
                    style={{
                      padding: '10px',
                      borderRadius: '10px',
                      border: targetType === 'prospect' ? '2px solid #2563eb' : '1px solid #cbd5e1',
                      background: targetType === 'prospect' ? '#eff6ff' : '#fff',
                      color: targetType === 'prospect' ? '#1d4ed8' : '#64748b',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                    }}
                  >
                    🎯 CRM Pipeline Prospect
                  </button>
                  <button
                    type="button"
                    onClick={() => setTargetType('creator')}
                    style={{
                      padding: '10px',
                      borderRadius: '10px',
                      border: targetType === 'creator' ? '2px solid #db2777' : '1px solid #cbd5e1',
                      background: targetType === 'creator' ? '#fdf2f8' : '#fff',
                      color: targetType === 'creator' ? '#be185d' : '#64748b',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                    }}
                  >
                    👥 Active Creator
                  </button>
                </div>
              </div>

              {/* CRM Prospect Dropdown */}
              {targetType === 'prospect' ? (
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    Select CRM Prospect * ({prospects.length} in pipeline)
                  </label>
                  <select
                    required
                    value={selectedProspectId}
                    onChange={(e) => setSelectedProspectId(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  >
                    <option value="">Select a CRM prospect...</option>
                    {prospects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} — @{p.handle?.replace(/^@/, '') || 'lead'} ({p.status} · {p.followers || 0} followers)
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                /* Creator Dropdown */
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    Select Active Creator * ({creators.length} registered)
                  </label>
                  <select
                    required
                    value={selectedCreatorId}
                    onChange={(e) => setSelectedCreatorId(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  >
                    <option value="">Select an active creator...</option>
                    {creators.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.email || c.slug})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Template Selection */}
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Eligible Gift Experience *</label>
                <select
                  required
                  value={selectedTemplateId}
                  onChange={(e) => setSelectedTemplateId(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                >
                  {templates.map((t) => (
                    <option key={t.id} value={t.id}>{t.icon || '🎁'} {t.title} ({t.id})</option>
                  ))}
                </select>
              </div>

              {/* Custom Code */}
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Custom Gift Code (Optional)</label>
                <input
                  type="text"
                  placeholder="Leave empty for auto-generated code"
                  value={customCode}
                  onChange={(e) => setCustomCode(e.target.value.toUpperCase())}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontFamily: 'monospace' }}
                />
              </div>

              {/* Note */}
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Internal Note</label>
                <input
                  type="text"
                  placeholder="e.g. Free try pass for Instagram DM pitch"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
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
                  style={{ background: '#db2777', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer' }}
                >
                  {submitting ? 'Generating...' : 'Issue 100% Free Pass ✨'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
