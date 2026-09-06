'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';

export default function AdminOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    user.getIdToken().then((token) => {
      fetch('/api/admin/orders', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.orders) setOrders(data.orders);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    });
  }, [user]);

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>
          Customer Orders &amp; Attribution Snapshots
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
          Immutable ledger of paid and refunded orders with coupon code snapshots and creator tracking.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Loading orders...</div>
      ) : (
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '12px 16px', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase' }}>Date &amp; Order ID</th>
                  <th style={{ padding: '12px 16px', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase' }}>Template</th>
                  <th style={{ padding: '12px 16px', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase' }}>Amount Paid</th>
                  <th style={{ padding: '12px 16px', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase' }}>Coupon Snapshot</th>
                  <th style={{ padding: '12px 16px', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase' }}>Attributed Creator</th>
                  <th style={{ padding: '12px 16px', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
                      No attributed orders recorded yet.
                    </td>
                  </tr>
                ) : (
                  orders.map((o) => (
                    <tr key={o.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>
                          {o.paid_at ? new Date(o.paid_at).toLocaleDateString() : 'Recent'}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontFamily: 'monospace' }}>
                          Note: {o.note_id}
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>
                        {o.template_id || 'Proposal'}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem' }}>
                          ₹{((o.final_amount || 0) / 100).toFixed(2)}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          via {o.payment_method || 'razorpay'}
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        {o.coupon_code ? (
                          <div>
                            <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#be123c', background: '#ffe4e6', padding: '2px 6px', borderRadius: '4px', fontSize: '0.8rem' }}>
                              {o.coupon_code}
                            </span>
                            <div style={{ fontSize: '0.75rem', color: '#e11d48', marginTop: '2px' }}>
                              -{o.discount_percent}% off
                            </div>
                          </div>
                        ) : (
                          <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>None</span>
                        )}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        {o.creator_id ? (
                          <div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#7c3aed' }}>
                              ID: {o.creator_id.substring(0, 8)}...
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                              Source: {o.attribution_source || 'cookie'}
                            </div>
                          </div>
                        ) : (
                          <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Direct customer</span>
                        )}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span
                          style={{
                            padding: '3px 8px',
                            borderRadius: '999px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            background: o.payment_status === 'paid' ? '#dcfce7' : '#fee2e2',
                            color: o.payment_status === 'paid' ? '#15803d' : '#b91c1c',
                          }}
                        >
                          {o.payment_status || 'paid'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
