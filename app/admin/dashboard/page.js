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
        <p style={{ marginTop: '12px', fontWeight: 600 }}>Loading Creator Club Analytics...</p>
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
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>
          Creator Club Executive Overview
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.95rem', margin: 0 }}>
          Real-time snapshot of creator partnerships, revenue, and commission liabilities.
        </p>
      </div>

      {/* METRIC CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '36px' }}>
        <div style={{ background: '#fff', padding: '22px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>👥 Total Creators</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', marginTop: '6px' }}>
            {stats?.totalCreators || 0}
          </div>
          <small style={{ color: '#16a34a', fontWeight: 600 }}>{stats?.activeCreators || 0} active</small>
        </div>

        <div style={{ background: '#fff', padding: '22px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>🛍️ Attributed Paid Orders</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', marginTop: '6px' }}>
            {stats?.totalOrders || 0}
          </div>
          <small style={{ color: '#64748b' }}>Delivered gifts</small>
        </div>

        <div style={{ background: '#fff', padding: '22px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>💵 Attributed Revenue</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0284c7', marginTop: '6px' }}>
            ₹{((stats?.revenue || 0) / 100).toFixed(2)}
          </div>
          <small style={{ color: '#64748b' }}>Net customer payments</small>
        </div>

        <div style={{ background: '#fff', padding: '22px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>⏳ Pending Commissions</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#e11d48', marginTop: '6px' }}>
            ₹{((stats?.pending || 0) / 100).toFixed(2)}
          </div>
          <small style={{ color: '#e11d48', fontWeight: 600 }}>Awaiting payout batch</small>
        </div>

        <div style={{ background: '#fff', padding: '22px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>💰 Disbursed Payouts</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#16a34a', marginTop: '6px' }}>
            ₹{((stats?.paidPayouts || 0) / 100).toFixed(2)}
          </div>
          <small style={{ color: '#16a34a', fontWeight: 600 }}>Total paid to creators</small>
        </div>
      </div>

      {/* QUICK ACTIONS GRID */}
      <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>
        Quick Management Controls
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
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
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 6px' }}>Issue Creator Gifts</h3>
          <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>Generate 100% complimentary VIP passes for specific creators and experiences.</p>
        </Link>
      </div>
    </div>
  );
}
