'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';

export default function AdminPayoutsPage() {
  const { user } = useAuth();
  const [payouts, setPayouts] = useState([]);
  const [creators, setCreators] = useState([]);
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Payout Form state
  const [isCreating, setIsCreating] = useState(false);
  const [selectedCreatorId, setSelectedCreatorId] = useState('');
  const [payoutMethod, setPayoutMethod] = useState('UPI');
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

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

      setMessage('✓ Payout batch recorded and commissions marked as paid!');
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

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>
            Creator Payout Batches
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
            Disburse pending commissions to creator UPI/Bank accounts and maintain reconciliation records.
          </p>
        </div>

        <button
          type="button"
          onClick={() => { setIsCreating(true); setMessage(''); }}
          style={{ background: '#059669', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(5,150,105,0.2)' }}
        >
          + Process Payout Batch
        </button>
      </div>

      {message && (
        <div style={{ padding: '12px 16px', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '20px', background: message.startsWith('✓') ? '#dcfce7' : '#fee2e2', color: message.startsWith('✓') ? '#15803d' : '#b91c1c' }}>
          {message}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Loading payouts...</div>
      ) : (
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '750px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '12px 16px', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase' }}>Date</th>
                  <th style={{ padding: '12px 16px', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase' }}>Creator</th>
                  <th style={{ padding: '12px 16px', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase' }}>Amount Disbursed</th>
                  <th style={{ padding: '12px 16px', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase' }}>Method &amp; UTR</th>
                  <th style={{ padding: '12px 16px', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase' }}>Orders Count</th>
                  <th style={{ padding: '12px 16px', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {payouts.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
                      No payout batches recorded yet.
                    </td>
                  </tr>
                ) : (
                  payouts.map((p) => {
                    const matchedCreator = creators.find((cr) => cr.id === p.creator_id);
                    return (
                      <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '14px 16px', fontSize: '0.85rem', color: '#334155' }}>
                          {p.paid_at ? new Date(p.paid_at).toLocaleDateString() : 'Recent'}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontWeight: 700, color: '#0f172a' }}>
                            {matchedCreator?.name || `ID: ${p.creator_id?.substring(0, 8)}...`}
                          </div>
                          {matchedCreator?.email && (
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{matchedCreator.email}</div>
                          )}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontWeight: 800, color: '#059669', fontSize: '1.05rem' }}>
                            ₹{((p.amount || 0) / 100).toFixed(2)}
                          </div>
                        </td>
                        <td style={{ padding: '14px 16px', fontSize: '0.85rem' }}>
                          <div style={{ fontWeight: 600, color: '#0f172a' }}>{p.method || 'UPI'}</div>
                          {p.reference && (
                            <div style={{ fontFamily: 'monospace', color: '#64748b', fontSize: '0.8rem' }}>
                              UTR: {p.reference}
                            </div>
                          )}
                        </td>
                        <td style={{ padding: '14px 16px', fontSize: '0.85rem', color: '#64748b' }}>
                          {p.commission_ids?.length || 0} commissions
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{ padding: '3px 8px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700, background: '#dcfce7', color: '#15803d' }}>
                            ✓ Paid
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

      {/* CREATE PAYOUT BATCH MODAL */}
      {isCreating && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '16px' }}>
          <div style={{ background: '#fff', borderRadius: '20px', padding: '28px', maxWidth: '520px', width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Process Creator Payout Batch
              </h2>
              <button type="button" onClick={() => setIsCreating(false)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#64748b' }}>✕</button>
            </div>

            <form onSubmit={handleCreatePayout} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Select Creator *</label>
                <select
                  required
                  value={selectedCreatorId}
                  onChange={(e) => setSelectedCreatorId(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                >
                  <option value="">Select a creator...</option>
                  {creators.map((c) => {
                    const pendingForC = commissions
                      .filter((comm) => comm.creator_id === c.id && comm.status === 'pending')
                      .reduce((sum, comm) => sum + (comm.commission_amount || 0), 0);
                    return (
                      <option key={c.id} value={c.id}>
                        {c.name} — Pending: ₹{(pendingForC / 100).toFixed(2)}
                      </option>
                    );
                  })}
                </select>
              </div>

              {selectedCreatorId && (
                <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                    Pending Commissions to Disburse: <strong>{creatorPendingCommissions.length}</strong>
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#059669', marginTop: '4px' }}>
                    Total: ₹{(totalPendingAmount / 100).toFixed(2)}
                  </div>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Payment Method</label>
                  <select
                    value={payoutMethod}
                    onChange={(e) => setPayoutMethod(e.target.value)}
                    style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  >
                    <option value="UPI">UPI Transfer</option>
                    <option value="IMPS">Bank IMPS</option>
                    <option value="NEFT">Bank NEFT</option>
                    <option value="Manual">Cash / Other</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>UTR / Reference Number</label>
                  <input
                    type="text"
                    placeholder="e.g. UPI/1234567890"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Internal Note</label>
                <input
                  type="text"
                  placeholder="Optional memo..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
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
                  disabled={submitting || totalPendingAmount <= 0}
                  style={{
                    background: '#059669',
                    color: '#fff',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    cursor: submitting || totalPendingAmount <= 0 ? 'not-allowed' : 'pointer',
                  }}
                >
                  {submitting ? 'Recording Payout...' : `Confirm & Mark ₹${(totalPendingAmount / 100).toFixed(2)} Paid`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
