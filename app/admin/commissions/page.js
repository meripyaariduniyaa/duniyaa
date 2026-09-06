'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';

export default function AdminCommissionsPage() {
  const { user } = useAuth();
  const [commissions, setCommissions] = useState([]);
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const loadData = async () => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      const [cRes, crRes] = await Promise.all([
        fetch('/api/admin/commissions', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/creators', { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const cData = await cRes.json();
      const crData = await crRes.json();
      if (cData.commissions) setCommissions(cData.commissions);
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

  const handleUpdateStatus = async (commissionId, newStatus) => {
    try {
      const token = await user.getIdToken();
      await fetch('/api/admin/commissions', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ id: commissionId, status: newStatus })
      });
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const filteredCommissions = commissions.filter((item) => {
    if (filter === 'all') return true;
    return item.status === filter;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>
            Commission Ledger
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
            Track pending, paid, and reversed affiliate earnings per order.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '6px', background: '#e2e8f0', padding: '4px', borderRadius: '10px' }}>
          {['all', 'pending', 'paid', 'reversed'].map((tab) => (
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
              {tab}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Loading commissions...</div>
      ) : (
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '12px 16px', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase' }}>Date</th>
                  <th style={{ padding: '12px 16px', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase' }}>Creator</th>
                  <th style={{ padding: '12px 16px', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase' }}>Order Amount</th>
                  <th style={{ padding: '12px 16px', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase' }}>Rate &amp; Commission</th>
                  <th style={{ padding: '12px 16px', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '12px 16px', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCommissions.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
                      No commissions found matching &quot;{filter}&quot;.
                    </td>
                  </tr>
                ) : (
                  filteredCommissions.map((c) => {
                    const matchedCreator = creators.find((cr) => cr.id === c.creator_id);
                    return (
                      <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '14px 16px', fontSize: '0.85rem', color: '#334155' }}>
                          {c.created_at ? new Date(c.created_at).toLocaleDateString() : 'Recent'}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontWeight: 700, color: '#0f172a' }}>
                            {matchedCreator?.name || `ID: ${c.creator_id?.substring(0, 8)}...`}
                          </div>
                          {matchedCreator?.slug && (
                            <div style={{ fontSize: '0.75rem', color: '#0284c7' }}>
                              /c/{matchedCreator.slug}
                            </div>
                          )}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontWeight: 600, color: '#0f172a' }}>
                            ₹{((c.order_amount || 0) / 100).toFixed(2)}
                          </div>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontWeight: 800, color: '#e11d48', fontSize: '0.95rem' }}>
                            ₹{((c.commission_amount || 0) / 100).toFixed(2)}
                          </div>
                          <small style={{ color: '#64748b', fontSize: '0.75rem' }}>({c.commission_rate}% rate)</small>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span
                            style={{
                              padding: '3px 8px',
                              borderRadius: '999px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              textTransform: 'capitalize',
                              background: c.status === 'paid' ? '#dcfce7' : c.status === 'pending' ? '#fef3c7' : '#fee2e2',
                              color: c.status === 'paid' ? '#15803d' : c.status === 'pending' ? '#b45309' : '#b91c1c',
                            }}
                          >
                            {c.status}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          {c.status === 'pending' && (
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(c.id, 'cancelled')}
                              style={{ background: '#fee2e2', color: '#b91c1c', border: '1px solid #fecaca', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                            >
                              Cancel
                            </button>
                          )}
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
    </div>
  );
}
