'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';

// ==========================================
// CLEAN SVG ICONS (NO EMOJIS)
// ==========================================
function IconTrash({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      <line x1="10" x2="10" y1="11" y2="17" />
      <line x1="14" x2="14" y1="11" y2="17" />
    </svg>
  );
}

function IconCloud({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
    </svg>
  );
}

function IconRefresh({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M16 21h5v-5" />
    </svg>
  );
}

function IconShield({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    </svg>
  );
}

function IconFile({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    </svg>
  );
}

function IconClock({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function IconCalendar({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </svg>
  );
}

function IconCheck({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconClose({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="18" x2="6" y1="6" y2="18" />
      <line x1="6" x2="18" y1="6" y2="18" />
    </svg>
  );
}

function IconAlert({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <line x1="12" x2="12" y1="9" y2="13" />
      <line x1="12" x2="12.01" y1="17" y2="17" />
    </svg>
  );
}

export default function ExpirationCleanupPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  // Auth & Permissions
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Settings & Scan State
  const [retentionDays, setRetentionDays] = useState(90);
  const [activeTab, setActiveTab] = useState('firestore'); // 'firestore' | 'cloudinary'

  // Scan Results
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [scanError, setScanError] = useState(null);

  // Purge State
  const [isPurgeModalOpen, setIsPurgeModalOpen] = useState(false);
  const [purging, setPurging] = useState(false);

  // Toast System
  const [toast, setToast] = useState(null);

  const initialScanDoneRef = useRef(false);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // 1. Verify Admin Auth
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/admin/login?redirect=/del');
      return;
    }

    if (user) {
      user.getIdToken().then((token) => {
        fetch('/api/admin/overview', {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => {
            if (res.ok) {
              setIsAdmin(true);
            } else {
              setIsAdmin(false);
              router.push('/admin/login?error=unauthorized');
            }
          })
          .catch(() => {
            setIsAdmin(false);
            router.push('/admin/login?error=failed');
          })
          .finally(() => setCheckingAuth(false));
      });
    }
  }, [user, authLoading, router]);

  // 2. Perform Scan
  const performScan = async (daysToScan) => {
    if (!user) return;
    const days = typeof daysToScan === 'number' ? daysToScan : retentionDays;
    setScanning(true);
    setScanError(null);

    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/admin/cleanup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action: 'scan', days }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to scan expired data');
      }

      setScanResult(data);
      showToast(
        `Scan complete! Found ${data.firestore?.totalScanned || 0} Firestore docs & ${data.cloudinary?.totalScanned || 0} Cloudinary files older than ${days} days.`
      );
    } catch (err) {
      console.error('Scan error:', err);
      setScanError(err.message);
      showToast(err.message, 'error');
    } finally {
      setScanning(false);
    }
  };

  // Trigger initial scan once when admin auth is confirmed
  useEffect(() => {
    if (isAdmin && !initialScanDoneRef.current) {
      initialScanDoneRef.current = true;
      performScan(90);
    }
  }, [isAdmin]);

  // 3. Change Retention Window & Re-scan
  const handleSelectDays = (days) => {
    setRetentionDays(days);
    performScan(days);
  };

  // 4. Execute Purge
  const executePurge = async () => {
    if (!user) return;

    setPurging(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/admin/cleanup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action: 'purge', days: retentionDays }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to purge expired data');

      showToast(
        `Purge complete! Deleted ${data.firestore?.deleted || 0} Firestore docs & ${data.cloudinary?.deleted || 0} Cloudinary files.`
      );
      setIsPurgeModalOpen(false);
      performScan(retentionDays);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setPurging(false);
    }
  };

  // Format Bytes helper
  const formatBytes = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (authLoading || checkingAuth) {
    return (
      <div style={styles.loadingScreen}>
        <div style={styles.spinner} />
        <p style={{ color: '#94a3b8', fontWeight: 600 }}>Verifying Expiration Center Credentials...</p>
      </div>
    );
  }

  if (!isAdmin) return null;

  const firestoreDocs = scanResult?.firestore?.docs || [];
  const cloudinaryResources = scanResult?.cloudinary?.resources || [];
  const totalReclaimedBytes = scanResult?.cloudinary?.bytesReclaimed || 0;

  return (
    <div style={styles.container}>
      {/* HEADER BAR */}
      <header style={styles.header}>
        <div style={styles.brandGroup}>
          <Link href="/admin/dashboard" style={styles.backLink} title="Back to Admin Dashboard">
            ← Admin
          </Link>
          <div style={styles.logoBadge}>
            <IconTrash size={20} />
          </div>
          <div>
            <h1 style={styles.title}>Data Expiration & Cleanup Engine</h1>
            <p style={styles.subtitle}>Automatic 90-Day Retention Policy & Storage Purge (`/del`)</p>
          </div>
        </div>

        <div style={styles.headerActions}>
          <Link href="/drive" style={styles.secondaryBtn}>
            <IconCloud size={16} />
            <span>Cloud Drive</span>
          </Link>
          <button
            type="button"
            onClick={() => performScan(retentionDays)}
            disabled={scanning}
            style={styles.secondaryBtn}
          >
            <IconRefresh size={16} />
            <span>{scanning ? 'Scanning...' : 'Re-scan'}</span>
          </button>
          <button
            type="button"
            onClick={() => setIsPurgeModalOpen(true)}
            disabled={scanning || purging || (firestoreDocs.length === 0 && cloudinaryResources.length === 0)}
            style={{
              ...styles.dangerBtn,
              opacity: firestoreDocs.length === 0 && cloudinaryResources.length === 0 ? 0.5 : 1,
              cursor: firestoreDocs.length === 0 && cloudinaryResources.length === 0 ? 'not-allowed' : 'pointer',
            }}
          >
            <IconTrash size={16} />
            <span>PURGE DATA ({retentionDays}D+)</span>
          </button>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main style={styles.content}>
        {/* DATA PROTECTION SHIELD BANNER */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '12px',
          padding: '12px 18px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '0.82rem',
          color: '#6ee7b7',
        }}>
          <span style={{ display: 'flex', alignItems: 'center', color: '#10b981' }}>
            <IconShield size={22} />
          </span>
          <div>
            <strong>Strict Scope:</strong> Only customer-created shareable notes (<code>/p/[slug]</code>) and customer uploads (<code>user-uploads/</code>) older than {retentionDays} days are eligible for cleanup. <strong>Referral links (<code>/c/[slug]</code>), referral clicks, creator accounts, and financial orders are permanently preserved and safe.</strong>
          </div>
        </div>

        {/* STATS OVERVIEW CARDS */}
        <div style={styles.statsGrid}>
          {/* CARD 1: FIRESTORE EXPIRED DOCS */}
          <div style={styles.statCard}>
            <div style={styles.statIconBadge}>
              <IconFile size={22} />
            </div>
            <div>
              <span style={styles.statLabel}>Expired Shareable Notes</span>
              <div style={styles.statValue}>
                {scanning && !scanResult ? '...' : firestoreDocs.length}{' '}
                <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>notes</span>
              </div>
              <p style={styles.statSubText}>
                Customer notes created for shareable links older than {retentionDays} days (referral links excluded)
              </p>
            </div>
          </div>

          {/* CARD 2: CLOUDINARY EXPIRED MEDIA */}
          <div style={styles.statCard}>
            <div style={{ ...styles.statIconBadge, background: 'rgba(236, 72, 153, 0.15)', color: '#ec4899' }}>
              <IconCloud size={22} />
            </div>
            <div>
              <span style={styles.statLabel}>Expired Customer Media</span>
              <div style={styles.statValue}>
                {scanning && !scanResult ? '...' : cloudinaryResources.length}{' '}
                <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>files</span>
              </div>
              <p style={styles.statSubText}>
                Customer uploads (<code>user-uploads/</code>). Reclaimable: <strong style={{ color: '#f472b6' }}>{formatBytes(totalReclaimedBytes)}</strong>
              </p>
            </div>
          </div>

          {/* CARD 3: RETENTION CUTOFF DATE */}
          <div style={styles.statCard}>
            <div style={{ ...styles.statIconBadge, background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}>
              <IconClock size={22} />
            </div>
            <div>
              <span style={styles.statLabel}>Expiration Cutoff Threshold</span>
              <div style={{ ...styles.statValue, fontSize: '1.05rem', color: '#38bdf8' }}>
                {scanResult?.cutoffDate
                  ? new Date(scanResult.cutoffDate).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })
                  : `${retentionDays} Days Ago`}
              </div>
              <p style={styles.statSubText}>Customer data created prior to this date will be targeted</p>
            </div>
          </div>
        </div>

        {/* RETENTION PERIOD CONTROLS */}
        <div style={styles.filterRibbon}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              Select Retention Window:
            </span>
            <button
              type="button"
              onClick={() => handleSelectDays(90)}
              style={{
                ...styles.chipBtn,
                ...(retentionDays === 90 ? styles.activeChipBtn : {}),
              }}
            >
              <IconCalendar size={13} />
              <span>90 Days (Standard)</span>
            </button>
            <button
              type="button"
              onClick={() => handleSelectDays(60)}
              style={{
                ...styles.chipBtn,
                ...(retentionDays === 60 ? styles.activeChipBtn : {}),
              }}
            >
              <IconCalendar size={13} />
              <span>60 Days</span>
            </button>
            <button
              type="button"
              onClick={() => handleSelectDays(30)}
              style={{
                ...styles.chipBtn,
                ...(retentionDays === 30 ? styles.activeChipBtn : {}),
              }}
            >
              <IconClock size={13} />
              <span>30 Days</span>
            </button>
            <button
              type="button"
              onClick={() => handleSelectDays(7)}
              style={{
                ...styles.chipBtn,
                ...(retentionDays === 7 ? styles.activeChipBtn : {}),
              }}
            >
              <IconClock size={13} />
              <span>7 Days</span>
            </button>
            <button
              type="button"
              onClick={() => handleSelectDays(1)}
              style={{
                ...styles.chipBtn,
                ...(retentionDays === 1 ? styles.activeChipBtn : {}),
              }}
            >
              <IconClock size={13} />
              <span>1 Day (Test Scan)</span>
            </button>
          </div>

          <span style={{ fontSize: '0.78rem', color: scanning ? '#38bdf8' : '#94a3b8' }}>
            {scanning ? 'Scanning in progress...' : scanResult ? 'Scan Completed' : 'Pending Scan'}
          </span>
        </div>

        {/* ERROR NOTIFICATION BANNER IF SCAN FAILED */}
        {scanError && (
          <div style={styles.errorBanner}>
            <IconAlert size={16} />
            <span>Scan Error: {scanError}</span>
          </div>
        )}

        {/* DATA AUDIT TABS */}
        <div style={styles.tabContainer}>
          <div style={styles.tabList}>
            <button
              type="button"
              onClick={() => setActiveTab('firestore')}
              style={{
                ...styles.tabBtn,
                ...(activeTab === 'firestore' ? styles.activeTabBtn : {}),
              }}
            >
              <IconFile size={15} />
              <span>Expired Firestore Docs ({firestoreDocs.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('cloudinary')}
              style={{
                ...styles.tabBtn,
                ...(activeTab === 'cloudinary' ? styles.activeTabBtn : {}),
              }}
            >
              <IconCloud size={15} />
              <span>Expired Cloudinary Files ({cloudinaryResources.length})</span>
            </button>
          </div>

          {/* TAB 1: FIRESTORE EXPIRED DOCS TABLE */}
          {activeTab === 'firestore' && (
            <div style={styles.tableCard}>
              {firestoreDocs.length === 0 ? (
                <div style={styles.emptyBox}>
                  <div style={{ color: '#10b981', display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
                    <IconCheck size={36} />
                  </div>
                  <p style={{ color: '#cbd5e1', fontWeight: 700, fontSize: '1rem', marginTop: '4px', marginBottom: '4px' }}>
                    No Firestore documents older than {retentionDays} days found!
                  </p>
                  <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>
                    Your Firestore database is clean under the {retentionDays}-day retention policy.
                  </p>
                  {retentionDays > 7 && (
                    <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '8px' }}>
                      Tip: Click <strong>&quot;7 Days&quot;</strong> or <strong>&quot;1 Day (Test Scan)&quot;</strong> above to scan more recent test records.
                    </p>
                  )}
                </div>
              ) : (
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Doc ID</th>
                      <th style={styles.th}>Collection</th>
                      <th style={styles.th}>Title / Reference</th>
                      <th style={styles.th}>Created Date</th>
                      <th style={styles.th}>Age</th>
                    </tr>
                  </thead>
                  <tbody>
                    {firestoreDocs.map((doc) => (
                      <tr key={`${doc.collection}-${doc.id}`} style={styles.tr}>
                        <td style={{ ...styles.td, fontFamily: 'monospace', color: '#f472b6' }}>
                          {doc.id}
                        </td>
                        <td style={styles.td}>
                          <span style={styles.colBadge}>{doc.collection}</span>
                        </td>
                        <td style={{ ...styles.td, fontWeight: 600, color: '#f8fafc' }}>
                          {doc.title}
                        </td>
                        <td style={styles.td}>
                          {new Date(doc.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </td>
                        <td style={{ ...styles.td, color: '#ef4444', fontWeight: 700 }}>
                          {doc.ageDays} days old
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* TAB 2: CLOUDINARY EXPIRED MEDIA TABLE */}
          {activeTab === 'cloudinary' && (
            <div style={styles.tableCard}>
              {cloudinaryResources.length === 0 ? (
                <div style={styles.emptyBox}>
                  <div style={{ color: '#10b981', display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
                    <IconCheck size={36} />
                  </div>
                  <p style={{ color: '#cbd5e1', fontWeight: 700, fontSize: '1rem', marginTop: '4px', marginBottom: '4px' }}>
                    No Cloudinary assets older than {retentionDays} days found!
                  </p>
                  <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>
                    Your Cloudinary storage is clean under the {retentionDays}-day retention policy.
                  </p>
                  {retentionDays > 7 && (
                    <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '8px' }}>
                      Tip: Click <strong>&quot;7 Days&quot;</strong> or <strong>&quot;1 Day (Test Scan)&quot;</strong> above to scan more recent uploads.
                    </p>
                  )}
                </div>
              ) : (
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Public ID</th>
                      <th style={styles.th}>Type / Format</th>
                      <th style={styles.th}>Size</th>
                      <th style={styles.th}>Created Date</th>
                      <th style={styles.th}>Age</th>
                      <th style={{ ...styles.th, textAlign: 'right' }}>Preview</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cloudinaryResources.map((item) => (
                      <tr key={item.public_id} style={styles.tr}>
                        <td style={{ ...styles.td, fontFamily: 'monospace', color: '#38bdf8' }}>
                          {item.public_id}
                        </td>
                        <td style={styles.td}>
                          <span style={styles.colBadge}>{item.format || item.resource_type}</span>
                        </td>
                        <td style={styles.td}>{formatBytes(item.bytes)}</td>
                        <td style={styles.td}>
                          {item.created_at
                            ? new Date(item.created_at).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })
                            : '—'}
                        </td>
                        <td style={{ ...styles.td, color: '#ef4444', fontWeight: 700 }}>
                          {item.ageDays} days old
                        </td>
                        <td style={{ ...styles.td, textAlign: 'right' }}>
                          <a
                            href={item.secure_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={styles.tableLink}
                          >
                            Open File ↗
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </main>

      {/* MODAL: PURGE CONFIRMATION */}
      {isPurgeModalOpen && (
        <div style={styles.modalBackdrop}>
          <div style={styles.modalCard}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#ef4444' }}>
              <IconAlert size={20} />
              <h3 style={{ ...styles.modalTitle, color: '#ef4444' }}>
                Confirm Permanent Purge ({retentionDays}D+)
              </h3>
            </div>
            <p style={{ color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '12px' }}>
              You are about to permanently delete all Firestore records and Cloudinary media created more than{' '}
              <strong>{retentionDays} days ago</strong>.
            </p>

            <div style={styles.purgeSummaryBox}>
              <div>• Expired Notes to Delete: <strong>{firestoreDocs.length}</strong></div>
              <div>• Expired Cloudinary Files to Delete: <strong>{cloudinaryResources.length}</strong></div>
              <div>• Storage Space to Reclaim: <strong>{formatBytes(totalReclaimedBytes)}</strong></div>
              <div>• Cutoff Threshold: <strong>Prior to {scanResult?.cutoffDate ? new Date(scanResult.cutoffDate).toLocaleDateString() : `${retentionDays} days ago`}</strong></div>
            </div>

            <div style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              borderRadius: '8px',
              padding: '10px 14px',
              fontSize: '0.78rem',
              color: '#6ee7b7',
              marginBottom: '16px',
            }}>
              <strong>Active Data Retained:</strong> All notes and uploads created within the last <strong>{retentionDays} days</strong> will remain active and completely untouched.
            </div>

            <p style={{ color: '#ef4444', fontSize: '0.78rem', fontWeight: 700, marginBottom: '20px' }}>
              WARNING: This action is irreversible. Expired data created before the cutoff cannot be recovered.
            </p>

            <div style={styles.modalActions}>
              <button
                type="button"
                onClick={() => setIsPurgeModalOpen(false)}
                style={styles.secondaryBtn}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={executePurge}
                disabled={purging}
                style={styles.dangerBtn}
              >
                {purging ? 'Purging Expired Data...' : `Permanently Purge Data (> ${retentionDays}D)`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {toast && (
        <div
          style={{
            ...styles.toast,
            background: toast.type === 'error' ? '#991b1b' : '#059669',
          }}
        >
          {toast.type === 'error' ? <IconClose size={16} /> : <IconCheck size={16} />}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}

// ==========================================
// INLINE STYLES (DARK EXPIRATION DASHBOARD)
// ==========================================
const styles = {
  container: {
    height: '100vh',
    maxHeight: '100vh',
    background: '#0b0f19',
    color: '#f8fafc',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  loadingScreen: {
    minHeight: '100vh',
    background: '#0b0f19',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
  },
  spinner: {
    width: '36px',
    height: '36px',
    borderWidth: '3px',
    borderStyle: 'solid',
    borderColor: '#1e293b',
    borderTopColor: '#ef4444',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  header: {
    background: '#111827',
    borderBottom: '1px solid #1e293b',
    padding: '16px 28px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px',
    flexShrink: 0,
    zIndex: 10,
  },
  brandGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  backLink: {
    color: '#94a3b8',
    textDecoration: 'none',
    fontSize: '0.85rem',
    fontWeight: 600,
    padding: '6px 12px',
    background: '#1e293b',
    borderRadius: '8px',
  },
  logoBadge: {
    width: '38px',
    height: '38px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #ef4444 0%, #991b1b 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
  },
  title: {
    margin: 0,
    fontSize: '1.2rem',
    fontWeight: 800,
    letterSpacing: '-0.02em',
    color: '#f8fafc',
  },
  subtitle: {
    margin: 0,
    fontSize: '0.75rem',
    color: '#94a3b8',
  },
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  secondaryBtn: {
    background: '#1e293b',
    color: '#f8fafc',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#334155',
    padding: '8px 14px',
    borderRadius: '8px',
    fontWeight: 600,
    fontSize: '0.85rem',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
  },
  dangerBtn: {
    background: '#dc2626',
    color: '#fff',
    borderWidth: 0,
    borderStyle: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    fontWeight: 700,
    fontSize: '0.85rem',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    boxShadow: '0 2px 10px rgba(220, 38, 38, 0.3)',
  },
  content: {
    flex: 1,
    padding: '24px 32px',
    overflowY: 'auto',
    minHeight: 0,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '16px',
    marginBottom: '24px',
  },
  statCard: {
    background: '#111827',
    border: '1px solid #1e293b',
    borderRadius: '14px',
    padding: '20px',
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-start',
  },
  statIconBadge: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    background: 'rgba(239, 68, 68, 0.15)',
    color: '#ef4444',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  statLabel: {
    fontSize: '0.78rem',
    fontWeight: 700,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  statValue: {
    fontSize: '1.4rem',
    fontWeight: 800,
    color: '#f8fafc',
    margin: '4px 0',
  },
  statSubText: {
    margin: 0,
    fontSize: '0.75rem',
    color: '#94a3b8',
  },
  filterRibbon: {
    background: '#111827',
    border: '1px solid #1e293b',
    borderRadius: '12px',
    padding: '12px 20px',
    marginBottom: '24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px',
  },
  chipBtn: {
    background: '#1e293b',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#334155',
    color: '#94a3b8',
    padding: '5px 12px',
    borderRadius: '6px',
    fontSize: '0.8rem',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
  },
  activeChipBtn: {
    background: 'rgba(239, 68, 68, 0.15)',
    color: '#f87171',
    borderColor: '#ef4444',
  },
  errorBanner: {
    background: '#991b1b',
    color: '#fecaca',
    padding: '12px 16px',
    borderRadius: '10px',
    fontSize: '0.85rem',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '16px',
  },
  tabContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  tabList: {
    display: 'flex',
    gap: '8px',
    borderBottom: '1px solid #1e293b',
    paddingBottom: '8px',
  },
  tabBtn: {
    background: 'transparent',
    borderWidth: 0,
    borderStyle: 'none',
    color: '#64748b',
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '0.85rem',
    fontWeight: 700,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
  },
  activeTabBtn: {
    background: '#1e293b',
    color: '#f87171',
  },
  tableCard: {
    background: '#111827',
    borderRadius: '14px',
    border: '1px solid #1e293b',
    overflow: 'hidden',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
  },
  th: {
    padding: '12px 16px',
    fontSize: '0.75rem',
    fontWeight: 700,
    color: '#64748b',
    borderBottom: '1px solid #1e293b',
    textTransform: 'uppercase',
  },
  tr: {
    borderBottom: '1px solid #1e293b',
  },
  td: {
    padding: '12px 16px',
    fontSize: '0.82rem',
    color: '#cbd5e1',
  },
  colBadge: {
    background: '#1e293b',
    color: '#f472b6',
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '0.7rem',
    fontWeight: 700,
  },
  tableLink: {
    color: '#38bdf8',
    textDecoration: 'none',
    fontSize: '0.78rem',
    fontWeight: 600,
  },
  emptyBox: {
    textAlign: 'center',
    padding: '60px 20px',
  },
  modalBackdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.75)',
    backdropFilter: 'blur(4px)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  modalCard: {
    background: '#111827',
    border: '1px solid #1e293b',
    borderRadius: '16px',
    padding: '24px',
    width: '100%',
    maxWidth: '460px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
  },
  modalTitle: {
    margin: 0,
    fontSize: '1.1rem',
    fontWeight: 800,
  },
  purgeSummaryBox: {
    background: '#090d16',
    padding: '12px 16px',
    borderRadius: '10px',
    border: '1px solid #334155',
    fontSize: '0.82rem',
    color: '#cbd5e1',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    marginBottom: '16px',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
  },
  toast: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    padding: '12px 20px',
    borderRadius: '10px',
    color: '#fff',
    fontWeight: 700,
    fontSize: '0.88rem',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
    zIndex: 1100,
  },
};
