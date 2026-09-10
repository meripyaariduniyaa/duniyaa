'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { exportToExcel } from '@/lib/excel-export';
import {
  CommissionsIcon,
  DownloadIcon,
  RefreshIcon,
  SearchIcon,
  RupeeIcon,
  CheckIcon
} from '@/components/admin/AdminIcons';

export default function AdminCommissionsPage() {
  const { user } = useAuth();
  const [commissions, setCommissions] = useState([]);
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');

  const handleExportExcel = () => {
    const formatted = filteredCommissions.map((comm) => {
      const creator = creators.find((c) => c.id === comm.creator_id);
      return {
        'Commission ID': comm.id,
        'Order Reference': comm.order_id || comm.note_id || '',
        'Creator Name': creator?.name || comm.creator_id,
        'Creator Slug': creator?.slug || '',
        'Order Value (₹)': ((comm.order_amount || 0) / 100).toFixed(2),
        'Commission Rate (%)': `${comm.rate || 0}%`,
        'Earned Commission (₹)': ((comm.commission_amount || 0) / 100).toFixed(2),
        'Payout Status': comm.status || 'pending',
        'Created Date': comm.created_at ? new Date(comm.created_at).toLocaleString() : '',
        'Paid Out Date': comm.paid_at ? new Date(comm.paid_at).toLocaleString() : 'Unpaid',
      };
    });
    exportToExcel(formatted, 'commissions_ledger', 'Commissions');
  };

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

  const handleSyncCommissions = async () => {
    setSyncing(true);
    setSyncMessage('');
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/admin/commissions', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Sync failed');
      const parts = [];
      if ((data.syncedCount || 0) > 0) parts.push(`${data.syncedCount} new order(s) credited`);
      if ((data.reconciledCount || 0) > 0) parts.push(`${data.reconciledCount} paid commission(s) reconciled`);
      setSyncMessage(parts.length > 0 ? `${parts.join(' · ')}` : 'All commissions are up to date!');
      loadData();
      setTimeout(() => setSyncMessage(''), 6000);
    } catch (err) {
      setSyncMessage(`Error: ${err.message}`);
    } finally {
      setSyncing(false);
    }
  };

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
    const matchFilter = filter === 'all' || item.status === filter;
    if (!matchFilter) return false;
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    const creator = (creators.find((c) => c.id === item.creator_id)?.name || '').toLowerCase();
    const orderId = (item.order_id || item.note_id || '').toLowerCase();
    return creator.includes(term) || orderId.includes(term);
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* HEADER & ACTIONS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px', letterSpacing: '-0.02em' }}>
            Commission Ledger
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
            Audit pending, paid, and reversed affiliate earnings per referred customer purchase.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleExportExcel}
            disabled={loading || filteredCommissions.length === 0}
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              color: '#0f172a',
              padding: '10px 16px',
              borderRadius: '10px',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: loading || filteredCommissions.length === 0 ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              opacity: loading || filteredCommissions.length === 0 ? 0.6 : 1,
            }}
          >
            <DownloadIcon size={16} />
            <span>Export Excel</span>
          </button>

          <button
            type="button"
            onClick={handleSyncCommissions}
            disabled={syncing}
            style={{
              background: '#0f172a',
              color: '#fff',
              border: 'none',
              padding: '10px 18px',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: syncing ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 6px rgba(15, 23, 42, 0.15)'
            }}
          >
            <RefreshIcon size={16} />
            <span>{syncing ? 'Syncing...' : 'Sync Orders'}</span>
          </button>
        </div>
      </div>

      {syncMessage && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: '10px',
            fontSize: '0.85rem',
            background: syncMessage.startsWith('Error') ? '#fee2e2' : '#f0fdf4',
            color: syncMessage.startsWith('Error') ? '#991b1b' : '#15803d',
            border: `1px solid ${syncMessage.startsWith('Error') ? '#fecaca' : '#bbf7d0'}`,
          }}
        >
          {syncMessage}
        </div>
      )}

      {/* FILTER TABS & SEARCH */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* STATUS PILLS */}
        <div style={{ display: 'flex', gap: '4px', background: '#ffffff', padding: '4px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          {['all', 'pending', 'paid', 'reversed'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              style={{
                background: filter === tab ? '#0f172a' : 'transparent',
                color: filter === tab ? '#ffffff' : '#64748b',
                border: 'none',
                padding: '7px 16px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                textTransform: 'capitalize',
                transition: 'all 0.15s ease',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* SEARCH BAR */}
        <div style={{ position: 'relative', width: '320px', maxWidth: '100%' }}>
          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', display: 'flex' }}>
            <SearchIcon size={16} />
          </span>
          <input
            type="text"
            placeholder="Search creator or order reference..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', padding: '8px 12px 8px 36px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '0.82rem', outline: 'none', background: '#fff' }}
          />
        </div>

      </div>

      {/* TABLE */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '3px solid #e2e8f0', borderTopColor: '#0284c7', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
          <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>Loading commissions ledger...</p>
        </div>
      ) : (
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '850px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '14px 20px', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Creator Partner</th>
                  <th style={{ padding: '14px 20px', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Order Reference</th>
                  <th style={{ padding: '14px 20px', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Order Value</th>
                  <th style={{ padding: '14px 20px', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Commission Earned</th>
                  <th style={{ padding: '14px 20px', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                  <th style={{ padding: '14px 20px', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCommissions.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '60px 20px', textAlign: 'center', color: '#94a3b8' }}>
                      <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>No commission records found</div>
                      <div style={{ fontSize: '0.8rem' }}>Sync orders or adjust your search filter.</div>
                    </td>
                  </tr>
                ) : (
                  filteredCommissions.map((comm) => {
                    const creator = creators.find((c) => c.id === comm.creator_id);
                    const statusColor = comm.status === 'paid' ? '#15803d' : comm.status === 'pending' ? '#b45309' : '#b91c1c';
                    const statusBg = comm.status === 'paid' ? '#dcfce7' : comm.status === 'pending' ? '#fef3c7' : '#fee2e2';
                    const statusBorder = comm.status === 'paid' ? '#bbf7d0' : comm.status === 'pending' ? '#fde68a' : '#fecaca';

                    return (
                      <tr key={comm.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.1s ease' }}>
                        
                        {/* CREATOR */}
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.88rem' }}>
                            {creator?.name || 'Creator'}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', fontFamily: 'monospace' }}>
                            {comm.creator_id?.substring(0, 14)}...
                          </div>
                        </td>

                        {/* ORDER REF */}
                        <td style={{ padding: '16px 20px' }}>
                          <span style={{ fontFamily: 'monospace', fontSize: '0.82rem', fontWeight: 700, color: '#0f172a', background: '#f1f5f9', padding: '2px 8px', borderRadius: '6px' }}>
                            {comm.order_id || comm.note_id || 'Direct'}
                          </span>
                          <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px' }}>
                            {comm.created_at ? new Date(comm.created_at).toLocaleDateString([], { dateStyle: 'medium' }) : ''}
                          </div>
                        </td>

                        {/* ORDER VALUE */}
                        <td style={{ padding: '16px 20px', fontSize: '0.88rem', fontWeight: 600, color: '#475569' }}>
                          ₹{((comm.order_amount || 0) / 100).toFixed(2)}
                        </td>

                        {/* COMMISSION */}
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a' }}>
                            ₹{((comm.commission_amount || 0) / 100).toFixed(2)}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#0284c7', fontWeight: 600 }}>
                            {comm.rate || 0}% rate
                          </div>
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
                              textTransform: 'capitalize',
                              background: statusBg,
                              color: statusColor,
                              border: `1px solid ${statusBorder}`,
                            }}
                          >
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: statusColor }} />
                            <span>{comm.status || 'pending'}</span>
                          </span>
                        </td>

                        {/* ACTIONS */}
                        <td style={{ padding: '16px 20px' }}>
                          {comm.status === 'pending' && (
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(comm.id, 'paid')}
                              style={{
                                background: '#15803d',
                                color: '#fff',
                                border: 'none',
                                padding: '6px 12px',
                                borderRadius: '8px',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                              }}
                            >
                              Mark Paid
                            </button>
                          )}
                          {comm.status === 'paid' && (
                            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Reconciled</span>
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
