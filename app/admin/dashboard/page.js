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

const TEMPLATE_NAMES = {
  proposal: 'Proposal Experience',
  birthday: 'Birthday Experience',
  anniversary: 'Anniversary Romance',
  'emotional-apology': 'Apology Letter',
};

const TEMPLATE_COLORS = {
  proposal: { bar: '#ec4899', bg: '#fdf2f8' },
  birthday: { bar: '#f59e0b', bg: '#fef3c7' },
  anniversary: { bar: '#8b5cf6', bg: '#f5f3ff' },
  'emotional-apology': { bar: '#06b6d4', bg: '#ecfeff' },
};

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeBar, setActiveBar] = useState(null);

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
        <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '3px solid #e2e8f0', borderTopColor: '#0284c7', animation: 'spin 0.8s linear infinite' }} />
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
  const avgOrderValue = totalOrders > 0 ? Number(((stats?.revenue || 0) / (totalOrders * 100)).toFixed(2)) : 0;

  // Chart metrics
  const trend = stats?.revenueTrend || [];
  const maxTrendRevenue = Math.max(...trend.map((t) => t.revenue || 0), 1000);

  // Template breakdown totals
  const templates = stats?.templateBreakdown || [];
  const maxTemplateRevenue = Math.max(...templates.map((t) => t.revenue || 0), 1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* PAGE HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#ec4899', background: '#fdf2f8', padding: '2px 8px', borderRadius: '4px' }}>
              LovelyCrafts Operations
            </span>
            <span style={{ color: '#cbd5e1' }}>•</span>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
              Updated {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
            Executive Performance Dashboard
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={fetchMetrics}
            title="Refresh Data"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              color: '#475569',
              fontWeight: 600,
              fontSize: '0.8rem',
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
            }}
          >
            <RefreshIcon size={14} />
            <span>Sync</span>
          </button>

          <Link
            href="/admin/reports"
            style={{
              background: '#0f172a',
              color: '#ffffff',
              textDecoration: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.82rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 6px rgba(15, 23, 42, 0.15)',
            }}
          >
            <ReportsIcon size={14} />
            <span>Reports Hub</span>
          </Link>
        </div>
      </div>

      {/* TOP KPI CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
        
        {/* Gross Revenue */}
        <div style={{ background: '#ffffff', padding: '16px 18px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#64748b' }}>
              Gross Volume
            </span>
            <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#fdf2f8', color: '#ec4899', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <RupeeIcon size={15} />
            </div>
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            ₹{((stats?.revenue || 0) / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '10px', paddingTop: '8px', borderTop: '1px solid #f1f5f9', fontSize: '0.72rem', color: '#64748b' }}>
            <span>Direct: <strong>₹{((stats?.organicRevenue || 0) / 100).toFixed(0)}</strong></span>
            <span style={{ color: '#cbd5e1' }}>•</span>
            <span>Ref: <strong>₹{((stats?.creatorRevenue || 0) / 100).toFixed(0)}</strong></span>
          </div>
        </div>

        {/* Net Take-Home */}
        <div style={{ background: '#ffffff', padding: '16px 18px', borderRadius: '12px', border: '1px solid #bbf7d0', boxShadow: '0 1px 3px rgba(34,197,94,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#15803d' }}>
              Net Profit
            </span>
            <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUpIcon size={15} />
            </div>
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#15803d', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            ₹{((stats?.netRevenue || 0) / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px', paddingTop: '8px', borderTop: '1px solid #f0fdf4', fontSize: '0.72rem', color: '#166534' }}>
            <span>After gateway fee</span>
            <span style={{ fontWeight: 700, background: '#dcfce7', padding: '2px 6px', borderRadius: '4px', fontSize: '0.65rem' }}>Net Take-Home</span>
          </div>
        </div>

        {/* Paid Orders */}
        <div style={{ background: '#ffffff', padding: '16px 18px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#64748b' }}>
              Completed Orders
            </span>
            <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#f1f5f9', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <OrdersIcon size={15} />
            </div>
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            {totalOrders}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '10px', paddingTop: '8px', borderTop: '1px solid #f1f5f9', fontSize: '0.72rem', color: '#64748b' }}>
            <span>AOV: <strong>₹{avgOrderValue}</strong></span>
            <span style={{ color: '#cbd5e1' }}>•</span>
            <span>{creatorPercent}% creator split</span>
          </div>
        </div>

        {/* Creators Active */}
        <div style={{ background: '#ffffff', padding: '16px 18px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#64748b' }}>
              Creator Network
            </span>
            <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#f5f3ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CreatorsIcon size={15} />
            </div>
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            {stats?.totalCreators || 0}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px', paddingTop: '8px', borderTop: '1px solid #f1f5f9', fontSize: '0.72rem' }}>
            <span style={{ color: '#16a34a', fontWeight: 700 }}>{stats?.activeCreators || 0} Active</span>
            <Link href="/admin/creators" style={{ color: '#0284c7', fontWeight: 700, textDecoration: 'none' }}>Manage →</Link>
          </div>
        </div>

        {/* Pending Commissions */}
        <div style={{ background: '#ffffff', padding: '16px 18px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#e11d48' }}>
              Unpaid Commissions
            </span>
            <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#fff1f2', color: '#e11d48', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PayoutsIcon size={15} />
            </div>
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#e11d48', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            ₹{((stats?.pending || 0) / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px', paddingTop: '8px', borderTop: '1px solid #f1f5f9', fontSize: '0.72rem', color: '#64748b' }}>
            <span>Paid: ₹{((stats?.paidPayouts || 0) / 100).toFixed(0)}</span>
            <Link href="/admin/payouts" style={{ color: '#e11d48', fontWeight: 700, textDecoration: 'none' }}>Disburse →</Link>
          </div>
        </div>

      </div>

      {/* REVENUE TREND CHART & SALES CHANNEL ATTRIBUTION */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        
        {/* REVENUE TREND (LAST 7 DAYS) */}
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h2 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 2px' }}>
                7-Day Revenue Velocity
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.75rem', margin: 0 }}>
                Daily gross turnover tracked from customer purchases
              </p>
            </div>
            {activeBar && (
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0284c7', background: '#eff6ff', padding: '3px 8px', borderRadius: '6px' }}>
                {activeBar.label}: ₹{(activeBar.revenue / 100).toFixed(0)} ({activeBar.count} orders)
              </span>
            )}
          </div>

          {/* SVG BAR CHART */}
          <div style={{ height: '160px', display: 'flex', alignItems: 'flex-end', gap: '12px', paddingBottom: '24px', position: 'relative' }}>
            {trend.map((day, idx) => {
              const heightPct = Math.max(8, Math.round((day.revenue / maxTrendRevenue) * 100));
              const isHovered = activeBar?.date === day.date;
              return (
                <div
                  key={idx}
                  onMouseEnter={() => setActiveBar(day)}
                  onMouseLeave={() => setActiveBar(null)}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    height: '100%',
                    justifyContent: 'flex-end',
                    cursor: 'pointer',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      maxWidth: '38px',
                      height: `${heightPct}%`,
                      background: isHovered ? '#db2777' : day.revenue > 0 ? '#ec4899' : '#e2e8f0',
                      borderRadius: '6px 6px 0 0',
                      transition: 'all 0.2s ease',
                      boxShadow: isHovered ? '0 4px 12px rgba(236, 72, 153, 0.4)' : 'none',
                    }}
                  />
                  <span style={{
                    position: 'absolute',
                    bottom: '0',
                    fontSize: '0.68rem',
                    color: isHovered ? '#0f172a' : '#94a3b8',
                    fontWeight: isHovered ? 800 : 600,
                    whiteSpace: 'nowrap',
                  }}>
                    {day.label.split(',')[0]}
                  </span>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748b', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
            <span>Peak Day: ₹{(maxTrendRevenue / 100).toFixed(0)}</span>
            <span>Total 7d Orders: {trend.reduce((s, d) => s + d.count, 0)}</span>
          </div>
        </div>

        {/* SALES CHANNEL ATTRIBUTION */}
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <h2 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 2px' }}>
                  Channel Attribution
                </h2>
                <p style={{ color: '#64748b', fontSize: '0.75rem', margin: 0 }}>
                  Direct Organic vs Creator Partner Referrals
                </p>
              </div>
              <Link href="/admin/orders" style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0284c7', textDecoration: 'none' }}>
                Orders Ledger →
              </Link>
            </div>

            {/* Split Bar */}
            <div style={{ height: '10px', width: '100%', borderRadius: '999px', overflow: 'hidden', display: 'flex', background: '#f1f5f9', marginBottom: '14px' }}>
              <div style={{ width: `${organicPercent}%`, background: '#10b981' }} />
              <div style={{ width: `${creatorPercent}%`, background: '#8b5cf6' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {/* Organic Direct */}
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 800, color: '#15803d' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#16a34a' }} />
                  <span>Direct Organic</span>
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a', marginTop: '6px' }}>
                  ₹{((stats?.organicRevenue || 0) / 100).toFixed(0)}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#166534', marginTop: '4px' }}>
                  {organicOrders} orders ({organicPercent}%)
                </div>
              </div>

              {/* Creator Referral */}
              <div style={{ background: '#f5f3ff', border: '1px solid #ddd6fe', borderRadius: '10px', padding: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 800, color: '#7c3aed' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#8b5cf6' }} />
                  <span>Creator Network</span>
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a', marginTop: '6px' }}>
                  ₹{((stats?.creatorRevenue || 0) / 100).toFixed(0)}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#6d28d9', marginTop: '4px' }}>
                  {creatorOrders} orders ({creatorPercent}%)
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b' }}>
            <span>Gateway processing fee deduction:</span>
            <strong style={{ color: '#c2410c' }}>−₹{((stats?.razorpayFeeTotal || 0) / 100).toFixed(2)}</strong>
          </div>
        </div>

      </div>

      {/* TEMPLATES POPULARITY & CREATOR LEADERBOARD */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        
        {/* TEMPLATE POPULARITY */}
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h2 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 2px' }}>
                Template Performance
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.75rem', margin: 0 }}>
                Breakdown of note orders by interactive template
              </p>
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>
              {templates.length} Experiences
            </span>
          </div>

          {templates.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px', color: '#94a3b8', fontSize: '0.85rem' }}>
              No template sales recorded yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {templates.map((t) => {
                const widthPct = Math.round((t.revenue / maxTemplateRevenue) * 100);
                const title = TEMPLATE_NAMES[t.template_id] || t.template_id;
                const colors = TEMPLATE_COLORS[t.template_id] || { bar: '#0284c7', bg: '#f0f9ff' };
                return (
                  <div key={t.template_id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', marginBottom: '6px' }}>
                      <span style={{ fontWeight: 700, color: '#0f172a' }}>{title}</span>
                      <span style={{ fontWeight: 800, color: '#0f172a' }}>
                        ₹{((t.revenue || 0) / 100).toFixed(0)}{' '}
                        <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 500 }}>({t.count} orders)</span>
                      </span>
                    </div>
                    <div style={{ height: '8px', width: '100%', borderRadius: '999px', background: '#f1f5f9', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${widthPct}%`, background: colors.bar, borderRadius: '999px', transition: 'width 0.3s ease' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* TOP CREATORS LEADERBOARD */}
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h2 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 2px' }}>
                Creator Leaderboard
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.75rem', margin: 0 }}>
                Top performing creator partners by attributed sales volume
              </p>
            </div>
            <Link href="/admin/creators" style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0284c7', textDecoration: 'none' }}>
              Directory →
            </Link>
          </div>

          {(!stats?.topCreators || stats.topCreators.length === 0) ? (
            <div style={{ textAlign: 'center', padding: '30px', color: '#94a3b8', fontSize: '0.85rem' }}>
              No creator referral sales registered yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {stats.topCreators.map((cr, idx) => (
                <div key={cr.creator_id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: idx === 0 ? '#fef3c7' : '#f1f5f9',
                      color: idx === 0 ? '#b45309' : '#64748b',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      #{idx + 1}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0f172a' }}>{cr.name}</div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                        {cr.tier} Tier • {cr.sales_count} orders
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#15803d' }}>
                      ₹{((cr.total_volume || 0) / 100).toFixed(0)}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>volume</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* LIVE RECENT TRANSACTIONS FEED */}
      {stats?.recentOrders && stats.recentOrders.length > 0 && (
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div>
              <h2 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 2px' }}>
                Recent Order Activity
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.75rem', margin: 0 }}>
                Live feed of verified customer note purchases
              </p>
            </div>
            <Link href="/admin/orders" style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0284c7', textDecoration: 'none' }}>
              View All Orders →
            </Link>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#64748b', fontSize: '0.72rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '8px 12px' }}>Note / Order ID</th>
                  <th style={{ padding: '8px 12px' }}>Experience</th>
                  <th style={{ padding: '8px 12px' }}>Attribution</th>
                  <th style={{ padding: '8px 12px' }}>Amount</th>
                  <th style={{ padding: '8px 12px' }}>Time</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((ord) => (
                  <tr key={ord.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '10px 12px', fontFamily: 'monospace', fontWeight: 700, color: '#0f172a' }}>
                      {ord.note_id?.substring(0, 14)}
                    </td>
                    <td style={{ padding: '10px 12px', fontWeight: 600, color: '#334155' }}>
                      {TEMPLATE_NAMES[ord.template_id] || ord.template_id}
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      {ord.creator_name ? (
                        <span style={{ color: '#7c3aed', background: '#f5f3ff', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700 }}>
                          Ref: {ord.creator_name}
                        </span>
                      ) : (
                        <span style={{ color: '#15803d', background: '#f0fdf4', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700 }}>
                          Direct Organic
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '10px 12px', fontWeight: 800, color: '#0f172a' }}>
                      ₹{ord.amount_in_rupees}
                    </td>
                    <td style={{ padding: '10px 12px', color: '#94a3b8' }}>
                      {ord.paid_at ? new Date(ord.paid_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'Recent'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* QUICK MANAGEMENT SHORTCUTS */}
      <div>
        <h2 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>
          Operations &amp; Admin Hubs
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          
          <Link
            href="/admin/orders"
            style={{ background: '#ffffff', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', textDecoration: 'none', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}
          >
            <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: '#f1f5f9', color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <OrdersIcon size={16} />
            </div>
            <div>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 700, margin: 0 }}>Customer Orders</h3>
              <p style={{ color: '#64748b', fontSize: '0.72rem', margin: '2px 0 0' }}>Transactions &amp; invoices</p>
            </div>
          </Link>

          <Link
            href="/admin/creators"
            style={{ background: '#ffffff', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', textDecoration: 'none', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}
          >
            <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: '#f5f3ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <CreatorsIcon size={16} />
            </div>
            <div>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 700, margin: 0 }}>Creator Partners</h3>
              <p style={{ color: '#64748b', fontSize: '0.72rem', margin: '2px 0 0' }}>HRMS, bank &amp; tiers</p>
            </div>
          </Link>

          <Link
            href="/admin/finance"
            style={{ background: '#ffffff', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', textDecoration: 'none', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}
          >
            <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: '#fdf2f8', color: '#ec4899', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <BuildingBankIcon size={16} />
            </div>
            <div>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 700, margin: 0 }}>Finance &amp; Invoices</h3>
              <p style={{ color: '#64748b', fontSize: '0.72rem', margin: '2px 0 0' }}>Billing, GST &amp; expenses</p>
            </div>
          </Link>

          <Link
            href="/admin/payouts"
            style={{ background: '#ffffff', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', textDecoration: 'none', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}
          >
            <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: '#fff1f2', color: '#e11d48', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <PayoutsIcon size={16} />
            </div>
            <div>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 700, margin: 0 }}>Payout Batches</h3>
              <p style={{ color: '#64748b', fontSize: '0.72rem', margin: '2px 0 0' }}>Disburse &amp; reconcile</p>
            </div>
          </Link>

          <Link
            href="/admin/crm"
            style={{ background: '#ffffff', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', textDecoration: 'none', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}
          >
            <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: '#eff6ff', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <CrmIcon size={16} />
            </div>
            <div>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 700, margin: 0 }}>Creator CRM</h3>
              <p style={{ color: '#64748b', fontSize: '0.72rem', margin: '2px 0 0' }}>Outreach &amp; discovery</p>
            </div>
          </Link>

          <Link
            href="/admin/coupons"
            style={{ background: '#ffffff', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', textDecoration: 'none', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}
          >
            <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <CouponsIcon size={16} />
            </div>
            <div>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 700, margin: 0 }}>Coupons &amp; Passes</h3>
              <p style={{ color: '#64748b', fontSize: '0.72rem', margin: '2px 0 0' }}>Promos &amp; redemptions</p>
            </div>
          </Link>

        </div>
      </div>

    </div>
  );
}
