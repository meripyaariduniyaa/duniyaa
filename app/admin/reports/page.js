'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { exportToExcel, exportMultiSheetExcel } from '@/lib/excel-export';
import {
  ReportsIcon,
  DownloadIcon,
  OrdersIcon,
  CreatorsIcon,
  CommissionsIcon,
  PayoutsIcon,
  CouponsIcon,
  RefreshIcon
} from '@/components/admin/AdminIcons';

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
        { sheetName: 'Payout Batches', data: getFormattedPayouts() },
        { sheetName: 'Coupons & Promo', data: getFormattedCoupons() },
      ];
      exportMultiSheetExcel(sheets, `lovelycrafts_master_report_${dateFilter}`);
    } catch (e) {
      console.error(e);
      alert('Export failed: ' + e.message);
    } finally {
      setExporting(false);
    }
  };

  const exportSingle = (name, getter, defaultSheet = 'Sheet1') => {
    const data = getter();
    exportToExcel(data, `${name}_${dateFilter}`, defaultSheet);
  };

  const currentFilteredOrders = filterByDate(orders, 'paid_at');
  const currentFilteredCommissions = filterByDate(commissions, 'created_at');
  const currentFilteredPayouts = filterByDate(payouts, 'paid_at');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* HEADER & MASTER EXPORT */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px', letterSpacing: '-0.02em' }}>
            Excel Analytics &amp; Reports Hub
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
            Generate multi-sheet XLSX spreadsheets and individual audit ledgers for offline reconciliation.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={fetchAllData}
            title="Refresh Data"
            style={{
              padding: '10px',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              color: '#475569',
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
            }}
          >
            <RefreshIcon size={18} />
          </button>

          <button
            type="button"
            onClick={handleExportMaster}
            disabled={loading || exporting}
            style={{
              background: '#0f172a',
              color: '#ffffff',
              border: 'none',
              padding: '10px 18px',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: loading || exporting ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 2px 6px rgba(15, 23, 42, 0.15)',
              opacity: loading || exporting ? 0.6 : 1,
            }}
          >
            <DownloadIcon size={16} />
            <span>{exporting ? 'Generating Excel...' : 'Export Master Workbook (.xlsx)'}</span>
          </button>
        </div>
      </div>

      {/* DATE RANGE FILTER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', background: '#ffffff', padding: '16px 20px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
        <div>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>Date Range Scope:</span>
          <span style={{ fontSize: '0.8rem', color: '#64748b', marginLeft: '8px' }}>Applies to Orders, Commissions, and Payouts datasets</span>
        </div>

        <div style={{ display: 'flex', gap: '4px', background: '#f8fafc', padding: '4px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
          {[
            { id: 'all', label: 'All-Time' },
            { id: 'month', label: 'This Month' },
            { id: '30', label: 'Past 30 Days' },
            { id: '90', label: 'Past 90 Days' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setDateFilter(tab.id)}
              style={{
                background: dateFilter === tab.id ? '#0f172a' : 'transparent',
                color: dateFilter === tab.id ? '#ffffff' : '#64748b',
                border: 'none',
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* INDIVIDUAL DATASET CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        
        {/* Orders */}
        <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#f0fdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <OrdersIcon size={18} />
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>{currentFilteredOrders.length} records</span>
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 6px', color: '#0f172a' }}>Orders Ledger</h3>
            <p style={{ color: '#64748b', fontSize: '0.82rem', margin: 0, lineHeight: 1.5 }}>
              Includes date, customer note ID, sales channel (organic/creator), gross amounts, and coupons.
            </p>
          </div>

          <button
            type="button"
            onClick={() => exportSingle('orders_ledger', getFormattedOrders, 'Orders')}
            disabled={loading || currentFilteredOrders.length === 0}
            style={{
              marginTop: '20px',
              padding: '9px 14px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              background: '#f8fafc',
              color: '#0f172a',
              fontWeight: 600,
              fontSize: '0.82rem',
              cursor: loading || currentFilteredOrders.length === 0 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <DownloadIcon size={14} />
            <span>Download Orders (.xlsx)</span>
          </button>
        </div>

        {/* Creators */}
        <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#f5f3ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CreatorsIcon size={18} />
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>{creators.length} partners</span>
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 6px', color: '#0f172a' }}>Creators Directory</h3>
            <p style={{ color: '#64748b', fontSize: '0.82rem', margin: 0, lineHeight: 1.5 }}>
              Partner database with tier standings, custom vanity URLs, phone/email, and lifetime order counts.
            </p>
          </div>

          <button
            type="button"
            onClick={() => exportSingle('creators_registry', getFormattedCreators, 'Creators')}
            disabled={loading || creators.length === 0}
            style={{
              marginTop: '20px',
              padding: '9px 14px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              background: '#f8fafc',
              color: '#0f172a',
              fontWeight: 600,
              fontSize: '0.82rem',
              cursor: loading || creators.length === 0 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <DownloadIcon size={14} />
            <span>Download Creators (.xlsx)</span>
          </button>
        </div>

        {/* Commissions */}
        <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#ecfeff', color: '#0891b2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CommissionsIcon size={18} />
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>{currentFilteredCommissions.length} records</span>
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 6px', color: '#0f172a' }}>Commissions Ledger</h3>
            <p style={{ color: '#64748b', fontSize: '0.82rem', margin: 0, lineHeight: 1.5 }}>
              Line-by-line affiliate commission earnings, order references, rates, and reconciliation statuses.
            </p>
          </div>

          <button
            type="button"
            onClick={() => exportSingle('commissions_ledger', getFormattedCommissions, 'Commissions')}
            disabled={loading || currentFilteredCommissions.length === 0}
            style={{
              marginTop: '20px',
              padding: '9px 14px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              background: '#f8fafc',
              color: '#0f172a',
              fontWeight: 600,
              fontSize: '0.82rem',
              cursor: loading || currentFilteredCommissions.length === 0 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <DownloadIcon size={14} />
            <span>Download Commissions (.xlsx)</span>
          </button>
        </div>

        {/* Payouts */}
        <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#fff1f2', color: '#e11d48', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PayoutsIcon size={18} />
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>{currentFilteredPayouts.length} batches</span>
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 6px', color: '#0f172a' }}>Payout Batches</h3>
            <p style={{ color: '#64748b', fontSize: '0.82rem', margin: 0, lineHeight: 1.5 }}>
              Banking audit trail with UTR numbers, transfer methods, disbursed amounts, and timestamps.
            </p>
          </div>

          <button
            type="button"
            onClick={() => exportSingle('payouts_history', getFormattedPayouts, 'Payouts')}
            disabled={loading || currentFilteredPayouts.length === 0}
            style={{
              marginTop: '20px',
              padding: '9px 14px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              background: '#f8fafc',
              color: '#0f172a',
              fontWeight: 600,
              fontSize: '0.82rem',
              cursor: loading || currentFilteredPayouts.length === 0 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <DownloadIcon size={14} />
            <span>Download Payouts (.xlsx)</span>
          </button>
        </div>

        {/* Coupons */}
        <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#f0f9ff', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CouponsIcon size={18} />
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>{coupons.length} codes</span>
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 6px', color: '#0f172a' }}>Coupons &amp; Promo Codes</h3>
            <p style={{ color: '#64748b', fontSize: '0.82rem', margin: 0, lineHeight: 1.5 }}>
              Active and legacy promo codes with discount rates, redemption counts, and creator associations.
            </p>
          </div>

          <button
            type="button"
            onClick={() => exportSingle('coupons_registry', getFormattedCoupons, 'Coupons')}
            disabled={loading || coupons.length === 0}
            style={{
              marginTop: '20px',
              padding: '9px 14px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              background: '#f8fafc',
              color: '#0f172a',
              fontWeight: 600,
              fontSize: '0.82rem',
              cursor: loading || coupons.length === 0 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <DownloadIcon size={14} />
            <span>Download Coupons (.xlsx)</span>
          </button>
        </div>

      </div>

    </div>
  );
}
