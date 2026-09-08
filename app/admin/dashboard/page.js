'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    user.getIdToken().then((token) => {
      fetch('/api/admin/overview', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => {
          if (!res.ok) throw new Error('Could not load metrics');
          return res.json();
        })
        .then((data) => setStats(data))
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    });
  }, [user]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
        <div style={{ fontSize: '2.5rem', animation: 'bounce 1s infinite' }}>📊</div>
        <p style={{ marginTop: '12px', fontWeight: 600 }}>Loading Store &amp; Creator Analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '20px', borderRadius: '12px', color: '#b91c1c' }}>
        Error: {error}
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>
            📊 Store &amp; Creator Executive Overview
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem', margin: 0 }}>
            Complete view of total product sales (organic direct &amp; creator-referred), revenue, and creator partnerships.
          </p>
        </div>

        <Link
          href="/admin/reports"
          style={{
            background: '#10b981',
            color: '#fff',
            textDecoration: 'none',
            padding: '10px 20px',
            borderRadius: '12px',
            fontWeight: 800,
            fontSize: '0.9rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 2px 8px rgba(16, 185, 129, 0.25)',
          }}
        >
          <span>📥</span>
          <span>Excel Reports Hub (.xlsx)</span>
        </Link>
      </div>

      {/* PRIMARY METRICS: TOTAL REVENUE & ORDERS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {/* Total Gross Revenue */}
        <div style={{ background: '#fff', padding: '22px', borderRadius: '16px', border: '2px solid #0284c7', boxShadow: '0 4px 16px rgba(2,132,199,0.08)' }}>
          <span style={{ fontSize: '0.78rem', color: '#0284c7', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            💵 Total Store Revenue (All Sales)
          </span>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', marginTop: '6px' }}>
            ₹{((stats?.revenue || 0) / 100).toFixed(2)}
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px', fontSize: '0.8rem', color: '#64748b' }}>
            <span>🍃 Organic: <strong>₹{((stats?.organicRevenue || 0) / 100).toFixed(0)}</strong></span>
            <span>•</span>
            <span>🎯 Creator: <strong>₹{((stats?.creatorRevenue || 0) / 100).toFixed(0)}</strong></span>
          </div>
        </div>

        {/* Total Orders */}
        <div style={{ background: '#fff', padding: '22px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
            🛍️ Total Paid Product Orders
          </span>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', marginTop: '6px' }}>
            {stats?.totalOrders || 0}
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px', fontSize: '0.8rem', color: '#64748b' }}>
            <span style={{ color: '#16a34a', fontWeight: 600 }}>🍃 {stats?.organicOrdersCount || 0} organic</span>
            <span>•</span>
            <span style={{ color: '#7c3aed', fontWeight: 600 }}>🎯 {stats?.creatorOrdersCount || 0} sponsored</span>
          </div>
        </div>

        {/* Total Creators */}
        <div style={{ background: '#fff', padding: '22px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
            👥 Creator Club Network
          </span>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', marginTop: '6px' }}>
            {stats?.totalCreators || 0}
          </div>
          <small style={{ color: '#16a34a', fontWeight: 700 }}>{stats?.activeCreators || 0} active creators</small>
        </div>

        {/* Pending Commissions */}
        <div style={{ background: '#fff', padding: '22px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <span style={{ fontSize: '0.78rem', color: '#e11d48', fontWeight: 700, textTransform: 'uppercase' }}>
            ⏳ Pending Commissions
          </span>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#e11d48', marginTop: '6px' }}>
            ₹{((stats?.pending || 0) / 100).toFixed(2)}
          </div>
          <small style={{ color: '#64748b' }}>Disbursed: ₹{((stats?.paidPayouts || 0) / 100).toFixed(2)}</small>
        </div>
      </div>

      {/* SALES SOURCE BREAKDOWN CARD */}
      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', marginBottom: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>
              📈 Sales Breakdown: Organic vs Creator Sponsorship
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>
              Tracking direct website customers vs creator referral conversions.
            </p>
          </div>

          <Link href="/admin/orders" style={{ padding: '8px 16px', borderRadius: '10px', background: '#0f172a', color: '#fff', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none' }}>
            View All Orders Ledger →
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          {/* Organic Sales */}
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontSize: '1.4rem' }}>🍃</span>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#166534' }}>Organic / Direct Website Users</div>
                <div style={{ fontSize: '0.75rem', color: '#15803d' }}>Customers finding LovelyCrafts directly</div>
              </div>
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#15803d' }}>
              ₹{((stats?.organicRevenue || 0) / 100).toFixed(2)}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#166534', marginTop: '4px', fontWeight: 600 }}>
              📦 {stats?.organicOrdersCount || 0} Orders ({stats?.totalOrders ? Math.round(((stats.organicOrdersCount || 0) / stats.totalOrders) * 100) : 0}% of sales)
            </div>
          </div>

          {/* Creator Referral Sales */}
          <div style={{ background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: '12px', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontSize: '1.4rem' }}>🎯</span>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#6b21a8' }}>Creator Club Referrals</div>
                <div style={{ fontSize: '0.75rem', color: '#7e22ce' }}>Referred via creator links &amp; coupons</div>
              </div>
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#7e22ce' }}>
              ₹{((stats?.creatorRevenue || 0) / 100).toFixed(2)}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#6b21a8', marginTop: '4px', fontWeight: 600 }}>
              📦 {stats?.creatorOrdersCount || 0} Orders ({stats?.totalOrders ? Math.round(((stats.creatorOrdersCount || 0) / stats.totalOrders) * 100) : 0}% of sales)
            </div>
          </div>
        </div>
      </div>

      {/* CRM PIPELINE CARD */}
      {(stats?.crmTotal > 0 || stats?.dueTodayCount > 0) && (
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', marginBottom: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>🎯 Creator CRM Pipeline</h2>
              <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>{stats.crmTotal} creator{stats.crmTotal !== 1 ? 's' : ''} in acquisition funnel</p>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              {stats?.dueTodayCount > 0 && (
                <Link href="/admin/crm?view=today"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '10px', background: '#fef2f2', color: '#dc2626', fontWeight: 800, fontSize: '0.85rem', textDecoration: 'none', border: '1px solid #fecaca' }}>
                  🔔 {stats.dueTodayCount} Follow-up{stats.dueTodayCount > 1 ? 's' : ''} Due Today
                </Link>
              )}
              <Link href="/admin/crm"
                style={{ padding: '8px 16px', borderRadius: '10px', background: '#0f172a', color: '#fff', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none' }}>
                Open CRM →
              </Link>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '8px' }}>
            {[
              { stage: 'Discovered', color: '#6d28d9' },
              { stage: 'Shortlisted', color: '#7c3aed' },
              { stage: 'Contacted', color: '#1d4ed8' },
              { stage: 'Replied', color: '#0e7490' },
              { stage: 'Interested', color: '#047857' },
              { stage: 'Approved', color: '#065f46' },
              { stage: 'Active', color: '#15803d' },
              { stage: 'Converted', color: '#166534' },
            ].map(({ stage, color }) => {
              const count = stats?.crmByStatus?.[stage] || 0;
              if (count === 0) return null;
              return (
                <div key={stage} style={{ background: '#f8fafc', borderRadius: '10px', padding: '12px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color }}>{count}</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, marginTop: '2px' }}>{stage}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* QUICK ACTIONS GRID */}
      <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>
        Quick Management Controls
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
        <Link
          href="/admin/orders"
          style={{ background: '#fff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', textDecoration: 'none', color: '#0f172a', transition: 'box-shadow 0.2s' }}
        >
          <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>📦</div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 6px' }}>Customer Orders Ledger</h3>
          <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>View all paid customer orders, filter organic vs creator referrals, and check gross revenue.</p>
        </Link>

        <Link
          href="/admin/creators"
          style={{ background: '#fff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', textDecoration: 'none', color: '#0f172a', transition: 'box-shadow 0.2s' }}
        >
          <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>👥</div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 6px' }}>Manage Creators</h3>
          <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>Review applications, override tiers, adjust commission rates, and select recommended templates.</p>
        </Link>

        <Link
          href="/admin/coupons"
          style={{ background: '#fff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', textDecoration: 'none', color: '#0f172a', transition: 'box-shadow 0.2s' }}
        >
          <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>🏷️</div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 6px' }}>Custom Coupon Manager</h3>
          <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>Create, edit, toggle, and permanently delete creator and campaign promo codes.</p>
        </Link>

        <Link
          href="/admin/payouts"
          style={{ background: '#fff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', textDecoration: 'none', color: '#0f172a', transition: 'box-shadow 0.2s' }}
        >
          <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>💳</div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 6px' }}>Process Payout Batches</h3>
          <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>Review pending commissions and record UPI/Bank transfer payouts.</p>
        </Link>

        <Link
          href="/admin/creator-gifts"
          style={{ background: '#fff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', textDecoration: 'none', color: '#0f172a', transition: 'box-shadow 0.2s' }}
        >
          <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>🎁</div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 6px' }}>Issue Creator &amp; CRM Gifts</h3>
          <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>Generate 100% complimentary VIP passes for specific creators or CRM pipeline prospects.</p>
        </Link>
      </div>
    </div>
  );
}
