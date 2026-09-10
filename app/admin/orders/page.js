'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { exportToExcel } from '@/lib/excel-export';

export default function AdminOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all' | 'organic' | 'creator'

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

  const organicOrders = orders.filter((o) => !o.creator_id);
  const creatorOrders = orders.filter((o) => Boolean(o.creator_id));

  const filteredOrders = filter === 'organic'
    ? organicOrders
    : filter === 'creator'
    ? creatorOrders
    : orders;

  // Razorpay: 2% + 18% GST = 2.36%, capped at ₹2500 (250000 paise)
  const calcRazorpayFee = (amountPaise) => Math.min(Math.ceil((amountPaise || 0) * 0.0236), 250000);

  const totalRevenuePaise = orders.reduce((sum, o) => sum + (o.final_amount || 0), 0);
  const totalFeePaise = orders.reduce((sum, o) => sum + calcRazorpayFee(o.final_amount || 0), 0);
  const totalNetPaise = totalRevenuePaise - totalFeePaise;

  const organicRevenuePaise = organicOrders.reduce((sum, o) => sum + (o.final_amount || 0), 0);
  const creatorRevenuePaise = creatorOrders.reduce((sum, o) => sum + (o.final_amount || 0), 0);

  const handleExportExcel = () => {
    const formatted = filteredOrders.map((o) => {
      const fee = calcRazorpayFee(o.final_amount || 0);
      return {
        'Date': o.paid_at ? new Date(o.paid_at).toLocaleString() : 'Recent',
        'Order / Note ID': o.note_id || o.id,
        'Sales Channel': o.creator_id ? 'Creator Referral' : 'Organic / Direct User',
        'Template Name': o.template_id || 'Standard',
        'Gross Amount (₹)': ((o.final_amount || 0) / 100).toFixed(2),
        'Razorpay Fee (₹)': (fee / 100).toFixed(2),
        'Net Amount (₹)': (((o.final_amount || 0) - fee) / 100).toFixed(2),
        'Coupon Code': o.coupon_code || 'None',
        'Discount Applied (%)': o.discount_percent ? `${o.discount_percent}%` : '0%',
        'Attributed Creator ID': o.creator_id || 'Direct / Organic Customer',
        'Payment Method': o.payment_method || 'Razorpay',
        'Order Status': o.payment_status || 'Paid',
      };
    });
    exportToExcel(formatted, `orders_ledger_${filter}`, 'Orders');
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>
            📦 Customer Orders &amp; Sales Ledger
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
            Track all product purchases from direct organic website users and creator-sponsored campaigns.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportExcel}
          disabled={loading || filteredOrders.length === 0}
          style={{
            background: '#10b981',
            color: '#fff',
            border: 'none',
            padding: '10px 18px',
            borderRadius: '10px',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: loading || filteredOrders.length === 0 ? 'not-allowed' : 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 2px 8px rgba(16, 185, 129, 0.25)',
          }}
        >
          <span>📥</span>
          <span>Export Excel (.xlsx)</span>
        </button>
      </div>

      {/* SALES SUMMARY CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '24px' }}>
        <div style={{ background: '#fff', padding: '18px', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Total Gross Revenue</span>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a', marginTop: '4px' }}>
            ₹{(totalRevenuePaise / 100).toFixed(2)}
          </div>
          <small style={{ color: '#64748b' }}>{orders.length} total paid orders</small>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', padding: '18px', borderRadius: '14px', border: '2px solid #22c55e' }}>
          <span style={{ fontSize: '0.75rem', color: '#15803d', fontWeight: 700, textTransform: 'uppercase' }}>✅ Net Revenue (After Fees)</span>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#15803d', marginTop: '4px' }}>
            ₹{(totalNetPaise / 100).toFixed(2)}
          </div>
          <small style={{ color: '#166534', fontWeight: 600 }}>Your actual take-home</small>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #fff7ed, #ffedd5)', padding: '18px', borderRadius: '14px', border: '1px solid #fb923c' }}>
          <span style={{ fontSize: '0.75rem', color: '#c2410c', fontWeight: 700, textTransform: 'uppercase' }}>🏦 Razorpay Fees Paid</span>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#c2410c', marginTop: '4px' }}>
            −₹{(totalFeePaise / 100).toFixed(2)}
          </div>
          <small style={{ color: '#9a3412', fontWeight: 600 }}>2% + 18% GST = 2.36%</small>
        </div>

        <div style={{ background: '#f0fdf4', padding: '18px', borderRadius: '14px', border: '1px solid #bbf7d0' }}>
          <span style={{ fontSize: '0.75rem', color: '#166534', fontWeight: 700, textTransform: 'uppercase' }}>🍃 Organic Sales Revenue</span>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#15803d', marginTop: '4px' }}>
            ₹{(organicRevenuePaise / 100).toFixed(2)}
          </div>
          <small style={{ color: '#166534', fontWeight: 600 }}>{organicOrders.length} direct customer orders</small>
        </div>

        <div style={{ background: '#faf5ff', padding: '18px', borderRadius: '14px', border: '1px solid #e9d5ff' }}>
          <span style={{ fontSize: '0.75rem', color: '#6b21a8', fontWeight: 700, textTransform: 'uppercase' }}>🎯 Creator Referral Revenue</span>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#7e22ce', marginTop: '4px' }}>
            ₹{(creatorRevenuePaise / 100).toFixed(2)}
          </div>
          <small style={{ color: '#6b21a8', fontWeight: 600 }}>{creatorOrders.length} creator-sponsored orders</small>
        </div>
      </div>

      {/* FILTER TABS */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => setFilter('all')}
          style={{
            padding: '8px 16px',
            borderRadius: '10px',
            border: filter === 'all' ? '2px solid #0f172a' : '1px solid #cbd5e1',
            background: filter === 'all' ? '#0f172a' : '#fff',
            color: filter === 'all' ? '#fff' : '#475569',
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: 'pointer',
          }}
        >
          🌐 All Orders ({orders.length})
        </button>

        <button
          type="button"
          onClick={() => setFilter('organic')}
          style={{
            padding: '8px 16px',
            borderRadius: '10px',
            border: filter === 'organic' ? '2px solid #16a34a' : '1px solid #cbd5e1',
            background: filter === 'organic' ? '#f0fdf4' : '#fff',
            color: filter === 'organic' ? '#15803d' : '#475569',
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: 'pointer',
          }}
        >
          🍃 Organic / Direct Sales ({organicOrders.length})
        </button>

        <button
          type="button"
          onClick={() => setFilter('creator')}
          style={{
            padding: '8px 16px',
            borderRadius: '10px',
            border: filter === 'creator' ? '2px solid #7c3aed' : '1px solid #cbd5e1',
            background: filter === 'creator' ? '#faf5ff' : '#fff',
            color: filter === 'creator' ? '#6b21a8' : '#475569',
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: 'pointer',
          }}
        >
          🎯 Creator Referrals ({creatorOrders.length})
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Loading orders...</div>
      ) : (
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '850px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '12px 16px', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase' }}>Date &amp; Order ID</th>
                  <th style={{ padding: '12px 16px', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase' }}>Sales Channel</th>
                  <th style={{ padding: '12px 16px', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase' }}>Template</th>
                  <th style={{ padding: '12px 16px', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase' }}>Gross</th>
                  <th style={{ padding: '12px 16px', fontSize: '0.8rem', color: '#c2410c', textTransform: 'uppercase' }}>RZP Fee</th>
                  <th style={{ padding: '12px 16px', fontSize: '0.8rem', color: '#15803d', textTransform: 'uppercase' }}>Net Amount</th>
                  <th style={{ padding: '12px 16px', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase' }}>Coupon</th>
                  <th style={{ padding: '12px 16px', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '36px', textAlign: 'center', color: '#94a3b8' }}>
                      No orders found under &ldquo;{filter}&rdquo; filter.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((o) => {
                    const isOrganic = !o.creator_id;
                    const fee = calcRazorpayFee(o.final_amount || 0);
                    const net = (o.final_amount || 0) - fee;
                    return (
                      <tr key={o.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>
                            {o.paid_at ? new Date(o.paid_at).toLocaleDateString() : 'Recent'}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontFamily: 'monospace' }}>
                            Note: {o.note_id}
                          </div>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '3px 8px',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              background: isOrganic ? '#f0fdf4' : '#faf5ff',
                              color: isOrganic ? '#15803d' : '#6b21a8',
                              border: `1px solid ${isOrganic ? '#bbf7d0' : '#e9d5ff'}`,
                            }}
                          >
                            {isOrganic ? '🍃 Organic Direct' : `🎯 Creator: ${o.creator_id.substring(0, 8)}...`}
                          </span>
                          {o.attribution_source && !isOrganic && (
                            <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                              via {o.attribution_source}
                            </div>
                          )}
                        </td>
                        <td style={{ padding: '14px 16px', fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>
                          {o.template_id || 'Proposal'}
                        </td>
                        {/* Gross */}
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontWeight: 700, color: '#475569', fontSize: '0.9rem' }}>
                            ₹{((o.final_amount || 0) / 100).toFixed(2)}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                            via {o.payment_method || 'razorpay'}
                          </div>
                        </td>
                        {/* Razorpay Fee */}
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontWeight: 700, color: '#c2410c', fontSize: '0.9rem' }}>
                            −₹{(fee / 100).toFixed(2)}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#9a3412' }}>2.36%</div>
                        </td>
                        {/* Net Amount */}
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontWeight: 900, color: '#15803d', fontSize: '0.95rem' }}>
                            ₹{(net / 100).toFixed(2)}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#166534' }}>take-home</div>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          {o.coupon_code ? (
                            <div>
                              <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#be123c', background: '#ffe4e6', padding: '2px 6px', borderRadius: '4px', fontSize: '0.8rem' }}>
                                {o.coupon_code}
                              </span>
                              <div style={{ fontSize: '0.72rem', color: '#e11d48', marginTop: '2px' }}>
                                -{o.discount_percent}% off
                              </div>
                            </div>
                          ) : (
                            <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>None</span>
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
