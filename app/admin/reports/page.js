'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { exportToExcel, exportMultiSheetExcel } from '@/lib/excel-export';

export default function AdminReportsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  // Raw dataset states
  const [orders, setOrders] = useState([]);
  const [creators, setCreators] = useState([]);
  const [commissions, setCommissions] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [overview, setOverview] = useState(null);

  // Date range filter
  const [dateFilter, setDateFilter] = useState('all'); // 'all' | '30' | '90' | 'month'

  useEffect(() => {
    if (!user) return;
    fetchAllData();
  }, [user]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const token = await user.getIdToken();
      const headers = { Authorization: `Bearer ${token}` };

      const [ordersRes, creatorsRes, commissionsRes, payoutsRes, couponsRes, overviewRes] = await Promise.all([
        fetch('/api/admin/orders', { headers }).then((r) => r.json()).catch(() => ({ orders: [] })),
        fetch('/api/admin/creators', { headers }).then((r) => r.json()).catch(() => ({ creators: [] })),
        fetch('/api/admin/commissions', { headers }).then((r) => r.json()).catch(() => ({ commissions: [] })),
        fetch('/api/admin/payouts', { headers }).then((r) => r.json()).catch(() => ({ payouts: [] })),
        fetch('/api/admin/coupons', { headers }).then((r) => r.json()).catch(() => ({ coupons: [] })),
        fetch('/api/admin/overview', { headers }).then((r) => r.json()).catch(() => ({ metrics: null })),
      ]);

      setOrders(ordersRes.orders || []);
      setCreators(creatorsRes.creators || []);
      setCommissions(commissionsRes.commissions || []);
      setPayouts(payoutsRes.payouts || []);
      setCoupons(couponsRes.coupons || []);
      setOverview(overviewRes.metrics || null);
    } catch (err) {
      console.error('Failed to fetch admin data for reports:', err);
    } finally {
      setLoading(false);
    }
  };

  // Helper to filter items by selected date range
  const filterByDate = (items, dateKey = 'created_at') => {
    if (dateFilter === 'all') return items;
    const now = new Date();
    let cutoff = new Date();

    if (dateFilter === '30') {
      cutoff.setDate(now.getDate() - 30);
    } else if (dateFilter === '90') {
      cutoff.setDate(now.getDate() - 90);
    } else if (dateFilter === 'month') {
      cutoff = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    return items.filter((item) => {
      const itemDate = item[dateKey] || item.paid_at || item.created_at || item.timestamp;
      if (!itemDate) return true;
      const d = new Date(itemDate);
      return d >= cutoff;
    });
  };

  /* ── Formatted Data Builders for Excel ── */

  const getFormattedOrders = () => {
    return filterByDate(orders, 'paid_at').map((o) => ({
      'Date': o.paid_at ? new Date(o.paid_at).toLocaleString() : 'Recent',
      'Order / Note ID': o.note_id || o.id,
      'Template Name': o.template_id || 'Standard',
      'Gross Amount (₹)': ((o.final_amount || 0) / 100).toFixed(2),
      'Coupon Code': o.coupon_code || 'None',
      'Discount Applied (%)': o.discount_percent ? `${o.discount_percent}%` : '0%',
      'Attributed Creator ID': o.creator_id || 'Direct / Organic',
      'Payment Method': o.payment_method || 'Razorpay',
      'Order Status': o.payment_status || 'Paid',
    }));
  };

  const getFormattedCreators = () => {
    return creators.map((c) => ({
      'Creator Name': c.name || 'Unnamed',
      'Email': c.email || '',
      'Slug Handle': c.slug || '',
      'Public URL': `https://lovelycrafts.in/c/${c.slug}`,
      'Tier': (c.tier || 'Starter').toUpperCase(),
      'Commission Rate (%)': `${c.commission_rate || 10}%`,
      'Assigned Coupon': c.coupon_code || 'Pending',
      'Phone / WhatsApp': c.phone || '',
      'Instagram URL': c.instagram_url || '',
      'YouTube URL': c.youtube_url || '',
      'Lifetime Attributed Orders': c.stats?.total_orders || 0,
      'Pending Commission (₹)': ((c.stats?.pending_commission || 0) / 100).toFixed(2),
      'Paid Out Commission (₹)': ((c.stats?.paid_commission || 0) / 100).toFixed(2),
      'Application Status': c.status || 'active',
      'Joined Date': c.created_at ? new Date(c.created_at).toLocaleDateString() : '',
    }));
  };

  const getFormattedCommissions = () => {
    return filterByDate(commissions, 'created_at').map((comm) => ({
      'Commission ID': comm.id,
      'Order Reference': comm.order_id || comm.note_id || '',
      'Creator ID': comm.creator_id || '',
      'Order Value (₹)': ((comm.order_amount || 0) / 100).toFixed(2),
      'Commission Rate (%)': `${comm.rate || 0}%`,
      'Earned Commission (₹)': ((comm.commission_amount || 0) / 100).toFixed(2),
      'Payout Status': comm.status || 'pending',
      'Created Date': comm.created_at ? new Date(comm.created_at).toLocaleString() : '',
      'Paid Out Date': comm.paid_at ? new Date(comm.paid_at).toLocaleString() : 'Unpaid',
    }));
  };

  const getFormattedPayouts = () => {
    return filterByDate(payouts, 'paid_at').map((p) => ({
      'Payout Batch ID': p.id,
      'Creator Name / ID': p.creator_name || p.creator_id,
      'Amount Paid (₹)': ((p.amount || 0) / 100).toFixed(2),
      'Payment Method': p.method || 'UPI',
      'UTR / Bank Reference': p.reference || '',
      'Processed By': p.admin_email || 'Admin',
      'Processed Date': p.paid_at ? new Date(p.paid_at).toLocaleString() : '',
      'Status': p.status || 'Completed',
    }));
  };

  const getFormattedCoupons = () => {
    return coupons.map((cp) => ({
      'Coupon Code': cp.code,
      'Discount (%)': `${cp.discount_percent}%`,
      'Type': cp.type || 'creator',
      'Assigned Creator ID': cp.creator_id || 'Global',
      'Times Used': cp.usage_count || 0,
      'Max Uses Allowed': cp.max_uses || 'Unlimited',
      'Status': cp.active ? 'Active' : 'Disabled',
      'Expiry Date': cp.expires_at ? new Date(cp.expires_at).toLocaleDateString() : 'Never',
    }));
  };

  /* ── Export Handlers ── */

  const handleExportMaster = () => {
    setExporting(true);
    try {
      const sheets = [
        { sheetName: 'Orders Ledger', data: getFormattedOrders() },
        { sheetName: 'Creators Registry', data: getFormattedCreators() },
        { sheetName: 'Commissions', data: getFormattedCommissions() },
        { sheetName: 'Payouts History', data: getFormattedPayouts() },
        { sheetName: 'Coupons Registry', data: getFormattedCoupons() },
      ];
      exportMultiSheetExcel(sheets, `lovelycrafts_business_master_${dateFilter}`);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>
            📊 Excel Reports &amp; Data Export Hub
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
            Generate structured, audit-ready .xlsx Excel spreadsheets for financial bookkeeping, tax filings, and creator payouts.
          </p>
        </div>

        {/* Date Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fff', padding: '6px 12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>📅 Filter Range:</span>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            style={{ border: 'none', background: 'transparent', fontSize: '0.85rem', fontWeight: 600, color: '#0f172a', outline: 'none', cursor: 'pointer' }}
          >
            <option value="all">All Time Records</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
            <option value="month">Current Month</option>
          </select>
        </div>
      </div>

      {/* MASTER WORKBOOK BANNER */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          color: '#fff',
          borderRadius: '20px',
          padding: '32px',
          marginBottom: '32px',
          boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px',
        }}
      >
        <div>
          <span style={{ background: '#0284c7', color: '#fff', fontSize: '0.75rem', fontWeight: 800, padding: '3px 10px', borderRadius: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Full Business Workbook (.xlsx)
          </span>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '8px 0 6px' }}>
            Complete Business Master Excel Report
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '580px', margin: 0, lineHeight: 1.5 }}>
            Includes 5 tabbed worksheets: <strong>Orders Ledger</strong>, <strong>Creators Registry</strong>, <strong>Commissions</strong>, <strong>Payouts History</strong>, and <strong>Coupons Performance</strong>.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportMaster}
          disabled={loading || exporting}
          style={{
            background: '#10b981',
            color: '#fff',
            border: 'none',
            padding: '14px 28px',
            borderRadius: '12px',
            fontSize: '1rem',
            fontWeight: 800,
            cursor: loading || exporting ? 'not-allowed' : 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
            transition: 'transform 0.1s',
          }}
        >
          <span>📥</span>
          <span>{exporting ? 'Generating Excel...' : 'Download Master Report (.xlsx)'}</span>
        </button>
      </div>

      {/* INDIVIDUAL REPORTS GRID */}
      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b', marginBottom: '16px' }}>
        Single-Sheet Dedicated Reports
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        
        {/* 1. Orders Report */}
        <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📦</div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', margin: '0 0 6px' }}>
              Customer Orders Ledger
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.4, margin: '0 0 16px' }}>
              Detailed transaction list with amounts, coupon deductions, Razorpay references, and creator attribution.
            </p>
            <div style={{ fontSize: '0.8rem', color: '#0284c7', fontWeight: 700, marginBottom: '16px' }}>
              {orders.length} total recorded orders
            </div>
          </div>
          <button
            type="button"
            onClick={() => exportToExcel(getFormattedOrders(), 'orders_ledger', 'Orders')}
            disabled={loading || orders.length === 0}
            style={{ background: '#f8fafc', color: '#0f172a', border: '1px solid #cbd5e1', padding: '10px', borderRadius: '10px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
          >
            📥 Export Orders (.xlsx)
          </button>
        </div>

        {/* 2. Creators Report */}
        <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>👥</div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', margin: '0 0 6px' }}>
              Creators Performance Registry
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.4, margin: '0 0 16px' }}>
              Creator roster with handles, tiers, commission rates, lifetime orders, contact info, and pending balances.
            </p>
            <div style={{ fontSize: '0.8rem', color: '#0284c7', fontWeight: 700, marginBottom: '16px' }}>
              {creators.length} registered creators
            </div>
          </div>
          <button
            type="button"
            onClick={() => exportToExcel(getFormattedCreators(), 'creators_registry', 'Creators')}
            disabled={loading || creators.length === 0}
            style={{ background: '#f8fafc', color: '#0f172a', border: '1px solid #cbd5e1', padding: '10px', borderRadius: '10px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
          >
            📥 Export Creators (.xlsx)
          </button>
        </div>

        {/* 3. Commissions Report */}
        <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>💸</div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', margin: '0 0 6px' }}>
              Commissions Audit Trail
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.4, margin: '0 0 16px' }}>
              Granular log of every earned commission with order amounts, commission rates, and payment statuses.
            </p>
            <div style={{ fontSize: '0.8rem', color: '#0284c7', fontWeight: 700, marginBottom: '16px' }}>
              {commissions.length} commission entries
            </div>
          </div>
          <button
            type="button"
            onClick={() => exportToExcel(getFormattedCommissions(), 'commissions_report', 'Commissions')}
            disabled={loading || commissions.length === 0}
            style={{ background: '#f8fafc', color: '#0f172a', border: '1px solid #cbd5e1', padding: '10px', borderRadius: '10px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
          >
            📥 Export Commissions (.xlsx)
          </button>
        </div>

        {/* 4. Payouts Report */}
        <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>💳</div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', margin: '0 0 6px' }}>
              Disbursed Payouts History
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.4, margin: '0 0 16px' }}>
              Log of all bank &amp; UPI payouts disbursed to creators, including UTR reference numbers and dates.
            </p>
            <div style={{ fontSize: '0.8rem', color: '#0284c7', fontWeight: 700, marginBottom: '16px' }}>
              {payouts.length} payout transactions
            </div>
          </div>
          <button
            type="button"
            onClick={() => exportToExcel(getFormattedPayouts(), 'payouts_history', 'Payouts')}
            disabled={loading || payouts.length === 0}
            style={{ background: '#f8fafc', color: '#0f172a', border: '1px solid #cbd5e1', padding: '10px', borderRadius: '10px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
          >
            📥 Export Payouts (.xlsx)
          </button>
        </div>

        {/* 5. Coupons Report */}
        <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🏷️</div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', margin: '0 0 6px' }}>
              Coupons &amp; Campaign Stats
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.4, margin: '0 0 16px' }}>
              Registry of all active &amp; historical coupon codes with discount percentages, usage counters, and limits.
            </p>
            <div style={{ fontSize: '0.8rem', color: '#0284c7', fontWeight: 700, marginBottom: '16px' }}>
              {coupons.length} coupon codes
            </div>
          </div>
          <button
            type="button"
            onClick={() => exportToExcel(getFormattedCoupons(), 'coupons_performance', 'Coupons')}
            disabled={loading || coupons.length === 0}
            style={{ background: '#f8fafc', color: '#0f172a', border: '1px solid #cbd5e1', padding: '10px', borderRadius: '10px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
          >
            📥 Export Coupons (.xlsx)
          </button>
        </div>

      </div>
    </div>
  );
}
