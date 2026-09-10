'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import {
  RupeeIcon,
  TrendingUpIcon,
  OrdersIcon,
  CreatorsIcon,
  BuildingBankIcon,
  ReportsIcon,
  CrmIcon,
  CouponsIcon,
  PayoutsIcon,
  GiftsIcon,
  ChevronRightIcon,
  RefreshIcon
} from '@/components/admin/AdminIcons';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMetrics = () => {
    if (!user) return;
    setLoading(true);
    setError('');
    user.getIdToken().then((token) => {
      fetch('/api/admin/overview', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => {
          if (!res.ok) throw new Error('Could not load executive metrics');
          return res.json();
        })
        .then((data) => setStats(data))
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    });
  };

  useEffect(() => {
    fetchMetrics();
  }, [user]);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', gap: '12px', color: '#64748b' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '3px solid #e2e8f0', borderTopColor: '#0284c7', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ fontWeight: 600, fontSize: '0.85rem', color: '#64748b', margin: 0 }}>Compiling store analytics...</p>
        <style jsx>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '16px 20px', borderRadius: '10px', color: '#991b1b', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ margin: '0 0 2px', fontWeight: 700, fontSize: '0.9rem' }}>Failed to Load Dashboard Metrics</h3>
          <p style={{ margin: 0, fontSize: '0.8rem', color: '#b91c1c' }}>{error}</p>
        </div>
        <button
          type="button"
          onClick={fetchMetrics}
          style={{ background: '#b91c1c', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}
        >
          Retry
        </button>
      </div>
    );
  }

  const totalOrders = stats?.totalOrders || 0;
  const organicOrders = stats?.organicOrdersCount || 0;
  const creatorOrders = stats?.creatorOrdersCount || 0;
  const organicPercent = totalOrders ? Math.round((organicOrders / totalOrders) * 100) : 0;
  const creatorPercent = totalOrders ? Math.round((creatorOrders / totalOrders) * 100) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* PAGE HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#0284c7' }}>
              Executive Metrics
            </span>
            <span style={{ color: '#cbd5e1' }}>•</span>
            <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
              Real-time sync {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
            Store &amp; Creator Executive Overview
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={fetchMetrics}
            title="Refresh Data"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '7px 10px',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              color: '#475569',
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
            }}
          >
            <RefreshIcon size={15} />
          </button>

          <Link
            href="/admin/reports"
            style={{
              background: '#0f172a',
              color: '#ffffff',
              textDecoration: 'none',
              padding: '7px 14px',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.8rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 1px 3px rgba(15, 23, 42, 0.1)',
            }}
          >
            <ReportsIcon size={14} />
            <span>Excel Reports Hub</span>
          </Link>
        </div>
      </div>

      {/* FORMAL COMPACT METRICS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '10px' }}>
        
        {/* Total Gross Revenue */}
        <div style={{ background: '#ffffff', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#64748b' }}>
                Gross Revenue
              </span>
              <div style={{ width: '22px', height: '22px', borderRadius: '4px', background: '#f0f9ff', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <RupeeIcon size={12} />
              </div>
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
              ₹{((stats?.revenue || 0) / 100).toFixed(2)}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', paddingTop: '6px', borderTop: '1px solid #f1f5f9', fontSize: '0.68rem', color: '#64748b' }}>
            <span>Org: <strong>₹{((stats?.organicRevenue || 0) / 100).toFixed(0)}</strong></span>
            <span style={{ color: '#cbd5e1' }}>•</span>
            <span>Ref: <strong>₹{((stats?.creatorRevenue || 0) / 100).toFixed(0)}</strong></span>
          </div>
        </div>

        {/* Net Margin */}
        <div style={{ background: '#ffffff', padding: '10px 14px', borderRadius: '8px', border: '1px solid #bbf7d0', boxShadow: '0 1px 2px rgba(34,197,94,0.03)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#15803d' }}>
                Net Margin
              </span>
              <div style={{ width: '22px', height: '22px', borderRadius: '4px', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TrendingUpIcon size={12} />
              </div>
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#15803d', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
              ₹{((stats?.netRevenue || 0) / 100).toFixed(2)}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px', paddingTop: '6px', borderTop: '1px solid #f0fdf4', fontSize: '0.68rem', color: '#166534' }}>
            <span>After gateway cut</span>
            <span style={{ fontWeight: 700, background: '#dcfce7', padding: '1px 5px', borderRadius: '3px', fontSize: '0.62rem' }}>Net</span>
          </div>
        </div>

        {/* Gateway Processing Fees */}
        <div style={{ background: '#ffffff', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#c2410c' }}>
                Gateway Charges
              </span>
              <div style={{ width: '22px', height: '22px', borderRadius: '4px', background: '#fff7ed', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BuildingBankIcon size={12} />
              </div>
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#c2410c', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
              −₹{((stats?.razorpayFeeTotal || 0) / 100).toFixed(2)}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px', paddingTop: '6px', borderTop: '1px solid #f1f5f9', fontSize: '0.68rem', color: '#9a3412' }}>
            <span>2.36% (inc. GST)</span>
            <span>{stats?.totalOrders || 0} txns</span>
          </div>
        </div>

        {/* Paid Orders */}
        <div style={{ background: '#ffffff', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#64748b' }}>
                Paid Orders
              </span>
              <div style={{ width: '22px', height: '22px', borderRadius: '4px', background: '#f1f5f9', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <OrdersIcon size={12} />
              </div>
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
              {totalOrders}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', paddingTop: '6px', borderTop: '1px solid #f1f5f9', fontSize: '0.68rem', color: '#64748b' }}>
            <span>Direct: <strong>{organicOrders}</strong></span>
            <span style={{ color: '#cbd5e1' }}>•</span>
            <span>Ref: <strong>{creatorOrders}</strong></span>
          </div>
        </div>

        {/* Creator Partners */}
        <div style={{ background: '#ffffff', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#64748b' }}>
                Creators
              </span>
              <div style={{ width: '22px', height: '22px', borderRadius: '4px', background: '#f5f3ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CreatorsIcon size={12} />
              </div>
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
              {stats?.totalCreators || 0}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px', paddingTop: '6px', borderTop: '1px solid #f1f5f9', fontSize: '0.68rem' }}>
            <span style={{ color: '#16a34a', fontWeight: 600 }}>{stats?.activeCreators || 0} active</span>
            <Link href="/admin/creators" style={{ color: '#0284c7', fontWeight: 600, textDecoration: 'none' }}>Directory →</Link>
          </div>
        </div>

        {/* Pending Commissions */}
        <div style={{ background: '#ffffff', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#e11d48' }}>
                Pending Payouts
              </span>
              <div style={{ width: '22px', height: '22px', borderRadius: '4px', background: '#fff1f2', color: '#e11d48', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PayoutsIcon size={12} />
              </div>
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#e11d48', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
              ₹{((stats?.pending || 0) / 100).toFixed(2)}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px', paddingTop: '6px', borderTop: '1px solid #f1f5f9', fontSize: '0.68rem', color: '#64748b' }}>
            <span>Paid: ₹{((stats?.paidPayouts || 0) / 100).toFixed(0)}</span>
            <Link href="/admin/payouts" style={{ color: '#e11d48', fontWeight: 600, textDecoration: 'none' }}>Process →</Link>
          </div>
        </div>

      </div>

      {/* SALES CHANNEL ATTRIBUTION */}
      <div style={{ background: '#ffffff', borderRadius: '10px', border: '1px solid #e2e8f0', padding: '14px 16px', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h2 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', margin: '0 0 2px' }}>
              Sales Channel Attribution
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.72rem', margin: 0 }}>
              Performance breakdown between direct organic customers and creator referrals.
            </p>
          </div>

          <Link
            href="/admin/orders"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '5px 10px',
              borderRadius: '6px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              color: '#0f172a',
              fontWeight: 600,
              fontSize: '0.72rem',
              textDecoration: 'none',
            }}
          >
            <span>Orders Ledger</span>
            <ChevronRightIcon size={11} />
          </Link>
        </div>

        {/* VISUAL SHARE BAR */}
        {totalOrders > 0 && (
          <div style={{ marginBottom: '12px' }}>
            <div style={{ height: '6px', width: '100%', borderRadius: '999px', overflow: 'hidden', display: 'flex', background: '#f1f5f9' }}>
              <div style={{ width: `${organicPercent}%`, background: '#10b981' }} title={`Organic: ${organicPercent}%`} />
              <div style={{ width: `${creatorPercent}%`, background: '#8b5cf6' }} title={`Creator: ${creatorPercent}%`} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '0.68rem', color: '#64748b' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#10b981' }} />
                Organic Direct ({organicPercent}%)
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#8b5cf6' }} />
                Creator Referrals ({creatorPercent}%)
              </span>
            </div>
          </div>
        )}

        {/* COMPARISON CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
          
          {/* Organic Sales */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <div style={{ width: '20px', height: '20px', borderRadius: '4px', background: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TrendingUpIcon size={11} />
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f172a' }}>Organic Direct Customers</div>
            </div>

            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
              ₹{((stats?.organicRevenue || 0) / 100).toFixed(2)}
              <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 500, marginLeft: '4px' }}>gross</span>
            </div>
            <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#15803d', marginTop: '2px' }}>
              Net: ₹{((stats?.netOrganicRevenue || 0) / 100).toFixed(2)}
              <span style={{ fontSize: '0.65rem', color: '#c2410c', marginLeft: '4px' }}>−₹{((stats?.razorpayFeeOrganic || 0) / 100).toFixed(2)} fees</span>
            </div>
            <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '4px', paddingTop: '4px', borderTop: '1px solid #e2e8f0' }}>
              {organicOrders} Orders ({organicPercent}% share)
            </div>
          </div>

          {/* Creator Sales */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <div style={{ width: '20px', height: '20px', borderRadius: '4px', background: '#ede9fe', color: '#6d28d9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CreatorsIcon size={11} />
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f172a' }}>Creator Referrals</div>
            </div>

            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
              ₹{((stats?.creatorRevenue || 0) / 100).toFixed(2)}
              <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 500, marginLeft: '4px' }}>gross</span>
            </div>
            <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#6d28d9', marginTop: '2px' }}>
              Net: ₹{((stats?.netCreatorRevenue || 0) / 100).toFixed(2)}
              <span style={{ fontSize: '0.65rem', color: '#c2410c', marginLeft: '4px' }}>−₹{((stats?.razorpayFeeCreator || 0) / 100).toFixed(2)} fees</span>
            </div>
            <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '4px', paddingTop: '4px', borderTop: '1px solid #e2e8f0' }}>
              {creatorOrders} Orders ({creatorPercent}% share)
            </div>
          </div>

        </div>
      </div>

      {/* CRM PIPELINE STATUS */}
      {(stats?.crmTotal > 0 || stats?.dueTodayCount > 0) && (
        <div style={{ background: '#ffffff', borderRadius: '10px', border: '1px solid #e2e8f0', padding: '14px 16px', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <h2 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', margin: '0 0 2px' }}>
                Creator CRM Pipeline
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.72rem', margin: 0 }}>
                {stats.crmTotal} creator{stats.crmTotal !== 1 ? 's' : ''} actively tracked
              </p>
            </div>

            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              {stats?.dueTodayCount > 0 && (
                <Link
                  href="/admin/crm?view=today"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 8px',
                    borderRadius: '5px',
                    background: '#fef2f2',
                    color: '#dc2626',
                    fontWeight: 700,
                    fontSize: '0.7rem',
                    textDecoration: 'none',
                    border: '1px solid #fecaca'
                  }}
                >
                  <span>{stats.dueTodayCount} Due Today</span>
                </Link>
              )}
              
              <Link
                href="/admin/crm"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '5px 10px',
                  borderRadius: '6px',
                  background: '#0f172a',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '0.72rem',
                  textDecoration: 'none'
                }}
              >
                <span>Open CRM</span>
                <ChevronRightIcon size={11} />
              </Link>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(85px, 1fr))', gap: '6px' }}>
            {[
              { stage: 'Discovered', color: '#64748b', bg: '#f1f5f9' },
              { stage: 'Shortlisted', color: '#7c3aed', bg: '#f5f3ff' },
              { stage: 'Contacted', color: '#2563eb', bg: '#eff6ff' },
              { stage: 'Replied', color: '#0891b2', bg: '#ecfeff' },
              { stage: 'Interested', color: '#059669', bg: '#ecfdf5' },
              { stage: 'Approved', color: '#047857', bg: '#d1fae5' },
              { stage: 'Active', color: '#16a34a', bg: '#dcfce7' },
              { stage: 'Converted', color: '#15803d', bg: '#bbf7d0' },
            ].map(({ stage, color, bg }) => {
              const count = stats?.crmByStatus?.[stage] || 0;
              if (count === 0) return null;
              return (
                <div key={stage} style={{ background: bg, borderRadius: '6px', padding: '6px 4px', textAlign: 'center', border: '1px solid rgba(0,0,0,0.03)' }}>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color, lineHeight: 1.1 }}>{count}</div>
                  <div style={{ fontSize: '0.62rem', color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.02em', marginTop: '2px' }}>{stage}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* QUICK MANAGEMENT GRID */}
      <div>
        <h2 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', marginBottom: '10px' }}>
          Management Shortcuts
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
          
          <Link
            href="/admin/orders"
            style={{ background: '#ffffff', padding: '12px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', textDecoration: 'none', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '10px' }}
          >
            <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#f1f5f9', color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <OrdersIcon size={14} />
            </div>
            <div>
              <h3 style={{ fontSize: '0.82rem', fontWeight: 700, margin: 0 }}>Customer Orders</h3>
              <p style={{ color: '#64748b', fontSize: '0.7rem', margin: '2px 0 0' }}>Audit orders &amp; margins</p>
            </div>
          </Link>

          <Link
            href="/admin/creators"
            style={{ background: '#ffffff', padding: '12px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', textDecoration: 'none', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '10px' }}
          >
            <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#f5f3ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <CreatorsIcon size={14} />
            </div>
            <div>
              <h3 style={{ fontSize: '0.82rem', fontWeight: 700, margin: 0 }}>Creator Partners</h3>
              <p style={{ color: '#64748b', fontSize: '0.7rem', margin: '2px 0 0' }}>Tiers, rates &amp; links</p>
            </div>
          </Link>

          <Link
            href="/admin/coupons"
            style={{ background: '#ffffff', padding: '12px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', textDecoration: 'none', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '10px' }}
          >
            <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <CouponsIcon size={14} />
            </div>
            <div>
              <h3 style={{ fontSize: '0.82rem', fontWeight: 700, margin: 0 }}>Promo Coupons</h3>
              <p style={{ color: '#64748b', fontSize: '0.7rem', margin: '2px 0 0' }}>Discount codes &amp; status</p>
            </div>
          </Link>

          <Link
            href="/admin/payouts"
            style={{ background: '#ffffff', padding: '12px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', textDecoration: 'none', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '10px' }}
          >
            <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#fff1f2', color: '#e11d48', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <PayoutsIcon size={14} />
            </div>
            <div>
              <h3 style={{ fontSize: '0.82rem', fontWeight: 700, margin: 0 }}>Payout Batches</h3>
              <p style={{ color: '#64748b', fontSize: '0.7rem', margin: '2px 0 0' }}>Reconcile &amp; clear payout</p>
            </div>
          </Link>

          <Link
            href="/admin/creator-gifts"
            style={{ background: '#ffffff', padding: '12px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', textDecoration: 'none', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '10px' }}
          >
            <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#fff7ed', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <GiftsIcon size={14} />
            </div>
            <div>
              <h3 style={{ fontSize: '0.82rem', fontWeight: 700, margin: 0 }}>VIP Gift Passes</h3>
              <p style={{ color: '#64748b', fontSize: '0.7rem', margin: '2px 0 0' }}>Generate free gift passes</p>
            </div>
          </Link>

        </div>
      </div>

    </div>
  );
}
