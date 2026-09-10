'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { exportToExcel } from '@/lib/excel-export';
import {
  RupeeIcon,
  TrendingUpIcon,
  BuildingBankIcon,
  OrdersIcon,
  CreatorsIcon,
  DownloadIcon,
  SearchIcon,
  CopyIcon,
  CheckIcon,
  FilterIcon
} from '@/components/admin/AdminIcons';

export default function AdminOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all' | 'organic' | 'creator'
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState(null);

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

  const filteredByChannel = filter === 'organic'
    ? organicOrders
    : filter === 'creator'
    ? creatorOrders
    : orders;

  const filteredOrders = filteredByChannel.filter((o) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const noteId = (o.note_id || o.id || '').toLowerCase();
    const creatorId = (o.creator_id || '').toLowerCase();
    const coupon = (o.coupon_code || '').toLowerCase();
    const template = (o.template_id || '').toLowerCase();
    return noteId.includes(term) || creatorId.includes(term) || coupon.includes(term) || template.includes(term);
  });

  // Razorpay: 2% + 18% GST = 2.36%, capped at ₹2500 (250000 paise)
  const calcRazorpayFee = (amountPaise) => Math.min(Math.ceil((amountPaise || 0) * 0.0236), 250000);

  const totalRevenuePaise = orders.reduce((sum, o) => sum + (o.final_amount || 0), 0);
  const totalFeePaise = orders.reduce((sum, o) => sum + calcRazorpayFee(o.final_amount || 0), 0);
  const totalNetPaise = totalRevenuePaise - totalFeePaise;

  const organicRevenuePaise = organicOrders.reduce((sum, o) => sum + (o.final_amount || 0), 0);
  const creatorRevenuePaise = creatorOrders.reduce((sum, o) => sum + (o.final_amount || 0), 0);

  const handleCopy = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* HEADER & EXPORT */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px', letterSpacing: '-0.02em' }}>
            Customer Orders &amp; Sales Ledger
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
            Real-time transaction log for direct organic website users and creator-sponsored campaigns.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportExcel}
          disabled={loading || filteredOrders.length === 0}
          style={{
            background: '#0f172a',
            color: '#ffffff',
            border: 'none',
            padding: '10px 18px',
            borderRadius: '10px',
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: loading || filteredOrders.length === 0 ? 'not-allowed' : 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 2px 6px rgba(15, 23, 42, 0.15)',
            opacity: loading || filteredOrders.length === 0 ? 0.6 : 1,
            transition: 'all 0.15s ease'
          }}
        >
          <DownloadIcon size={16} />
          <span>Export Excel (.xlsx)</span>
        </button>
      </div>

      {/* REVENUE METRIC TILES */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        
        {/* Gross Revenue */}
        <div style={{ background: '#ffffff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Gross Sales</span>
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#f1f5f9', color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <RupeeIcon size={14} />
            </div>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
            ₹{(totalRevenuePaise / 100).toFixed(2)}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '6px' }}>{orders.length} total orders</div>
        </div>

        {/* Net Take-home */}
        <div style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)', padding: '20px', borderRadius: '16px', border: '1px solid #bbf7d0', boxShadow: '0 2px 6px rgba(34,197,94,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.72rem', color: '#15803d', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Net Margin</span>
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUpIcon size={14} />
            </div>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#15803d', letterSpacing: '-0.02em' }}>
            ₹{(totalNetPaise / 100).toFixed(2)}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#166534', marginTop: '6px', fontWeight: 600 }}>Actual take-home profit</div>
        </div>

        {/* Gateway Charges */}
        <div style={{ background: '#ffffff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.72rem', color: '#c2410c', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>RZP Fees</span>
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#fff7ed', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BuildingBankIcon size={14} />
            </div>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#c2410c', letterSpacing: '-0.02em' }}>
            −₹{(totalFeePaise / 100).toFixed(2)}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#9a3412', marginTop: '6px' }}>2.36% (incl. 18% GST)</div>
        </div>

        {/* Organic Split */}
        <div style={{ background: '#ffffff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.72rem', color: '#0f172a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Organic Sales</span>
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#f0fdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <OrdersIcon size={14} />
            </div>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
            ₹{(organicRevenuePaise / 100).toFixed(2)}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '6px' }}>{organicOrders.length} direct orders</div>
        </div>

        {/* Creator Referral Split */}
        <div style={{ background: '#ffffff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.72rem', color: '#7c3aed', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Creator Sales</span>
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#f5f3ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CreatorsIcon size={14} />
            </div>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#7c3aed', letterSpacing: '-0.02em' }}>
            ₹{(creatorRevenuePaise / 100).toFixed(2)}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6b21a8', marginTop: '6px' }}>{creatorOrders.length} sponsored orders</div>
        </div>

      </div>

      {/* FILTER TABS & SEARCH BAR */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* CHANNEL PILLS */}
        <div style={{ display: 'flex', gap: '6px', background: '#ffffff', padding: '4px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <button
            type="button"
            onClick={() => setFilter('all')}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: 'none',
              background: filter === 'all' ? '#0f172a' : 'transparent',
              color: filter === 'all' ? '#ffffff' : '#64748b',
              fontWeight: 600,
              fontSize: '0.82rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            All ({orders.length})
          </button>

          <button
            type="button"
            onClick={() => setFilter('organic')}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: 'none',
              background: filter === 'organic' ? '#0f172a' : 'transparent',
              color: filter === 'organic' ? '#ffffff' : '#64748b',
              fontWeight: 600,
              fontSize: '0.82rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            Organic ({organicOrders.length})
          </button>

          <button
            type="button"
            onClick={() => setFilter('creator')}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: 'none',
              background: filter === 'creator' ? '#0f172a' : 'transparent',
              color: filter === 'creator' ? '#ffffff' : '#64748b',
              fontWeight: 600,
              fontSize: '0.82rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            Creator Referred ({creatorOrders.length})
          </button>
        </div>

        {/* SEARCH INPUT */}
        <div style={{ position: 'relative', width: '320px', maxWidth: '100%' }}>
          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', display: 'flex' }}>
            <SearchIcon size={16} />
          </span>
          <input
            type="text"
            placeholder="Search by Note ID, Coupon, Creator..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 36px',
              borderRadius: '10px',
              border: '1px solid #e2e8f0',
              background: '#ffffff',
              fontSize: '0.82rem',
              color: '#0f172a',
              outline: 'none',
              boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
            }}
          />
        </div>

      </div>

      {/* ORDERS DATA TABLE */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '3px solid #e2e8f0', borderTopColor: '#0284c7', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
          <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>Loading transactions ledger...</p>
        </div>
      ) : (
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '950px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '14px 20px', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Order / Note ID</th>
                  <th style={{ padding: '14px 20px', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sales Channel</th>
                  <th style={{ padding: '14px 20px', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Template</th>
                  <th style={{ padding: '14px 20px', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Gross (Paise)</th>
                  <th style={{ padding: '14px 20px', fontSize: '0.75rem', fontWeight: 700, color: '#c2410c', textTransform: 'uppercase', letterSpacing: '0.05em' }}>RZP Fee (2.36%)</th>
                  <th style={{ padding: '14px 20px', fontSize: '0.75rem', fontWeight: 700, color: '#15803d', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Net Take-Home</th>
                  <th style={{ padding: '14px 20px', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Coupon</th>
                  <th style={{ padding: '14px 20px', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ padding: '60px 20px', textAlign: 'center', color: '#94a3b8' }}>
                      <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>No matching orders found</div>
                      <div style={{ fontSize: '0.8rem' }}>Try adjusting your search query or filter selection.</div>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((o) => {
                    const isOrganic = !o.creator_id;
                    const fee = calcRazorpayFee(o.final_amount || 0);
                    const net = (o.final_amount || 0) - fee;
                    const noteId = o.note_id || o.id;

                    return (
                      <tr key={o.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.1s ease' }}>
                        
                        {/* ORDER & NOTE ID */}
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '0.82rem', fontFamily: 'monospace', fontWeight: 700, color: '#0f172a', background: '#f1f5f9', padding: '2px 8px', borderRadius: '6px' }}>
                              {noteId?.substring(0, 16)}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopy(noteId)}
                              title="Copy Note ID"
                              style={{ background: 'transparent', border: 'none', color: copiedId === noteId ? '#16a34a' : '#94a3b8', cursor: 'pointer', padding: '2px', display: 'flex' }}
                            >
                              {copiedId === noteId ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
                            </button>
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px' }}>
                            {o.paid_at ? new Date(o.paid_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'Recent'}
                          </div>
                        </td>

                        {/* CHANNEL */}
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
                              background: isOrganic ? '#f0fdf4' : '#f5f3ff',
                              color: isOrganic ? '#15803d' : '#7c3aed',
                              border: `1px solid ${isOrganic ? '#bbf7d0' : '#ddd6fe'}`,
                            }}
                          >
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: isOrganic ? '#22c55e' : '#8b5cf6' }} />
                            {isOrganic ? 'Organic Direct' : `Creator: ${o.creator_id.substring(0, 8)}...`}
                          </span>
                        </td>

                        {/* TEMPLATE */}
                        <td style={{ padding: '16px 20px', fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>
                          <span style={{ textTransform: 'capitalize' }}>{o.template_id || 'Proposal'}</span>
                        </td>

                        {/* GROSS */}
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9rem' }}>
                            ₹{((o.final_amount || 0) / 100).toFixed(2)}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                            {o.payment_method || 'razorpay'}
                          </div>
                        </td>

                        {/* RZP FEE */}
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ fontWeight: 700, color: '#c2410c', fontSize: '0.9rem' }}>
                            −₹{(fee / 100).toFixed(2)}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#ea580c' }}>2.36%</div>
                        </td>

                        {/* NET AMOUNT */}
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ fontWeight: 800, color: '#15803d', fontSize: '0.95rem' }}>
                            ₹{(net / 100).toFixed(2)}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#16a34a' }}>net take-home</div>
                        </td>

                        {/* COUPON */}
                        <td style={{ padding: '16px 20px' }}>
                          {o.coupon_code ? (
                            <div>
                              <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#0284c7', background: '#e0f2fe', padding: '3px 8px', borderRadius: '6px', fontSize: '0.78rem' }}>
                                {o.coupon_code}
                              </span>
                              <div style={{ fontSize: '0.72rem', color: '#0369a1', marginTop: '3px' }}>
                                -{o.discount_percent}% off
                              </div>
                            </div>
                          ) : (
                            <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>—</span>
                          )}
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
                              background: o.payment_status === 'paid' ? '#dcfce7' : '#fee2e2',
                              color: o.payment_status === 'paid' ? '#15803d' : '#b91c1c',
                            }}
                          >
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: o.payment_status === 'paid' ? '#22c55e' : '#ef4444' }} />
                            <span style={{ textTransform: 'capitalize' }}>{o.payment_status || 'paid'}</span>
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
