'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { exportToExcel } from '@/lib/excel-export';
import {
  PayoutsIcon,
  PlusIcon,
  DownloadIcon,
  RupeeIcon,
  BuildingBankIcon,
  CheckIcon,
  CloseIcon,
  SearchIcon,
  CreatorsIcon
} from '@/components/admin/AdminIcons';

export default function AdminPayoutsPage() {
  const { user } = useAuth();
  const [payouts, setPayouts] = useState([]);
  const [creators, setCreators] = useState([]);
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // New Payout Form state
  const [isCreating, setIsCreating] = useState(false);
  const [selectedCreatorId, setSelectedCreatorId] = useState('');
  const [payoutMethod, setPayoutMethod] = useState('UPI');
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleExportExcel = () => {
    const formatted = payouts.map((p) => {
      const matchedCreator = creators.find((cr) => cr.id === p.creator_id);
      return {
        'Payout Batch ID': p.id,
        'Creator Name': matchedCreator?.name || p.creator_id,
        'Creator Slug': matchedCreator?.slug || '',
        'Amount Paid (₹)': ((p.amount || 0) / 100).toFixed(2),
        'Payment Method': p.method || 'UPI',
        'UTR / Bank Reference': p.reference || '—',
        'Orders Count': p.order_ids?.length || p.commissions_count || 0,
        'Processed Date': p.paid_at ? new Date(p.paid_at).toLocaleString() : '',
        'Admin Notes': p.notes || '',
        'Status': p.status || 'Paid',
      };
    });
    exportToExcel(formatted, 'payouts_history', 'Payouts');
  };

  const loadData = async () => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      const [pRes, crRes, commRes] = await Promise.all([
        fetch('/api/admin/payouts', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/creators', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/commissions', { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const pData = await pRes.json();
      const crData = await crRes.json();
      const commData = await commRes.json();
      if (pData.payouts) setPayouts(pData.payouts);
      if (crData.creators) setCreators(crData.creators);
      if (commData.commissions) setCommissions(commData.commissions);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  // Compute pending commissions for selected creator
  const creatorPendingCommissions = commissions.filter(
    (c) => c.creator_id === selectedCreatorId && c.status === 'pending'
  );
  const totalPendingAmount = creatorPendingCommissions.reduce(
    (sum, c) => sum + (c.commission_amount || 0),
    0
  );

  const handleCreatePayout = async (e) => {
    e.preventDefault();
    if (!selectedCreatorId || totalPendingAmount <= 0) {
      alert('Selected creator has no pending commissions to disburse.');
      return;
    }

    setSubmitting(true);
    setMessage('');

    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/admin/payouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          creator_id: selectedCreatorId,
          amount: totalPendingAmount,
          method: payoutMethod,
          reference,
          notes,
          commission_ids: creatorPendingCommissions.map((c) => c.id),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create payout batch');

      setMessage('Payout batch recorded and commissions marked as paid!');
      setIsCreating(false);
      setSelectedCreatorId('');
      setReference('');
      setNotes('');
      loadData();
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredPayouts = payouts.filter((p) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    const creator = (creators.find((cr) => cr.id === p.creator_id)?.name || '').toLowerCase();
    const ref = (p.reference || '').toLowerCase();
    return creator.includes(term) || ref.includes(term);
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* HEADER & ACTIONS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px', letterSpacing: '-0.02em' }}>
            Creator Payout Batches
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
            Disburse pending commissions to creator accounts and maintain bank reconciliation logs.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleExportExcel}
            disabled={loading || payouts.length === 0}
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              color: '#0f172a',
              padding: '10px 16px',
              borderRadius: '10px',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: loading || payouts.length === 0 ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              opacity: loading || payouts.length === 0 ? 0.6 : 1,
            }}
          >
            <DownloadIcon size={16} />
            <span>Export Excel</span>
          </button>

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
            <span>Record New Payout</span>
          </button>
        </div>
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
          placeholder="Search creator name or UTR reference..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: '100%', padding: '8px 12px 8px 36px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '0.82rem', outline: 'none', background: '#fff' }}
        />
      </div>

      {/* PAYOUTS TABLE */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '3px solid #e2e8f0', borderTopColor: '#0284c7', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
          <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>Loading payouts history...</p>
        </div>
      ) : (
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '850px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '14px 20px', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Creator Partner</th>
                  <th style={{ padding: '14px 20px', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Disbursed Amount</th>
                  <th style={{ padding: '14px 20px', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Transfer Method</th>
                  <th style={{ padding: '14px 20px', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>UTR / Reference</th>
                  <th style={{ padding: '14px 20px', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date Processed</th>
                  <th style={{ padding: '14px 20px', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayouts.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '60px 20px', textAlign: 'center', color: '#94a3b8' }}>
                      <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>No payout records found</div>
                      <div style={{ fontSize: '0.8rem' }}>Record a new payout batch once creators accrue pending commissions.</div>
                    </td>
                  </tr>
                ) : (
                  filteredPayouts.map((p) => {
                    const matchedCreator = creators.find((cr) => cr.id === p.creator_id);
                    return (
                      <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.1s ease' }}>
                        
                        {/* CREATOR */}
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.88rem' }}>
                            {matchedCreator?.name || p.creator_id}
                          </div>
                          {matchedCreator?.email && (
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{matchedCreator.email}</div>
                          )}
                        </td>

                        {/* AMOUNT */}
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#15803d' }}>
                            ₹{((p.amount || 0) / 100).toFixed(2)}
                          </div>
                        </td>

                        {/* METHOD */}
                        <td style={{ padding: '16px 20px' }}>
                          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0f172a', background: '#f1f5f9', padding: '3px 8px', borderRadius: '6px' }}>
                            {p.method || 'UPI'}
                          </span>
                        </td>

                        {/* UTR REF */}
                        <td style={{ padding: '16px 20px' }}>
                          <span style={{ fontFamily: 'monospace', fontSize: '0.82rem', color: '#475569' }}>
                            {p.reference || '—'}
                          </span>
                          {p.notes && <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>{p.notes}</div>}
                        </td>

                        {/* DATE */}
                        <td style={{ padding: '16px 20px', fontSize: '0.82rem', color: '#64748b' }}>
                          {p.paid_at ? new Date(p.paid_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'Recent'}
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
                              background: '#dcfce7',
                              color: '#15803d',
                              border: '1px solid #bbf7d0',
                            }}
                          >
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e' }} />
                            <span>Paid</span>
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

      {/* RECORD PAYOUT MODAL */}
      {isCreating && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(11, 15, 25, 0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#fff', borderRadius: '20px', padding: '32px', maxWidth: '580px', width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 60px rgba(0,0,0,0.18)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 2px', letterSpacing: '-0.01em' }}>
                  Record Creator Payout Batch
                </h2>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>Disburse accrued pending commissions to partner bank/UPI account.</p>
              </div>
              <button type="button" onClick={() => setIsCreating(false)} style={{ background: '#f1f5f9', border: 'none', padding: '6px', borderRadius: '8px', cursor: 'pointer', color: '#64748b' }}>
                <CloseIcon size={18} />
              </button>
            </div>

            <form onSubmit={handleCreatePayout} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.04em' }}>Select Creator *</label>
                <select
                  required
                  value={selectedCreatorId}
                  onChange={(e) => setSelectedCreatorId(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#0f172a', outline: 'none' }}
                >
                  <option value="">Select a creator with pending commissions</option>
                  {creators.map((c) => {
                    const pendings = commissions.filter((comm) => comm.creator_id === c.id && comm.status === 'pending');
                    const amt = pendings.reduce((sum, comm) => sum + (comm.commission_amount || 0), 0);
                    return (
                      <option key={c.id} value={c.id}>
                        {c.name} — ₹{(amt / 100).toFixed(2)} Pending ({pendings.length} orders)
                      </option>
                    );
                  })}
                </select>
              </div>

              {selectedCreatorId && (
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '16px', borderRadius: '12px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#166534', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Calculated Total to Disburse</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#15803d', marginTop: '2px' }}>
                    ₹{(totalPendingAmount / 100).toFixed(2)}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#166534', marginTop: '4px' }}>
                    Clears {creatorPendingCommissions.length} pending commission record(s)
                  </div>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.04em' }}>Payment Method</label>
                  <select
                    value={payoutMethod}
                    onChange={(e) => setPayoutMethod(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#0f172a', outline: 'none' }}
                  >
                    <option value="UPI">UPI / VPA</option>
                    <option value="IMPS">Bank Transfer (IMPS)</option>
                    <option value="NEFT">Bank Transfer (NEFT)</option>
                    <option value="Manual">Cash / Other</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.04em' }}>UTR / Reference Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 423985720394"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#0f172a', outline: 'none', boxSizing: 'border-box', fontFamily: 'monospace' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.04em' }}>Admin Notes (Optional)</label>
                <textarea
                  placeholder="e.g. Cleared via HDFC Corporate Banking"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#0f172a', outline: 'none', boxSizing: 'border-box', resize: 'vertical', minHeight: '56px' }}
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
                  disabled={submitting || totalPendingAmount <= 0}
                  style={{ background: '#0f172a', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 700, cursor: submitting || totalPendingAmount <= 0 ? 'not-allowed' : 'pointer', opacity: submitting || totalPendingAmount <= 0 ? 0.6 : 1 }}
                >
                  {submitting ? 'Recording...' : 'Confirm & Disburse'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
