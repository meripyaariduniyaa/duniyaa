'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
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

function IconSearch({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function IconCopy({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}

function IconEye({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
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
  const [customDaysInput, setCustomDaysInput] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [activeTab, setActiveTab] = useState('firestore'); // 'firestore' | 'cloudinary'

  // Scan Results
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [scanError, setScanError] = useState(null);

  // Search & Filter State
  const [tableSearch, setTableSearch] = useState('');
  const [tableSort, setTableSort] = useState('age-desc'); // 'age-desc' | 'age-asc' | 'size-desc' | 'name-asc'

  // Preview Lightbox for Cloudinary media
  const [previewMedia, setPreviewMedia] = useState(null);

  // Purge State & Safety Check
  const [isPurgeModalOpen, setIsPurgeModalOpen] = useState(false);
  const [purgeConfirmText, setPurgeConfirmText] = useState('');
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
    setShowCustomInput(false);
    setRetentionDays(days);
    performScan(days);
  };

  const handleApplyCustomDays = (e) => {
    e.preventDefault();
    const days = parseInt(customDaysInput, 10);
    if (!days || days < 1) {
      showToast('Please enter a valid number of days (≥ 1)', 'error');
      return;
    }
    setRetentionDays(days);
    performScan(days);
  };

  // 4. Execute Purge
  const executePurge = async () => {
    if (!user || purgeConfirmText.trim().toUpperCase() !== 'PURGE') return;

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
      setPurgeConfirmText('');
      performScan(retentionDays);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setPurging(false);
    }
  };

  // Helper: Format Bytes
  const formatBytes = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Helper: Copy Text
  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    showToast(`${label} copied to clipboard!`);
  };

  const firestoreDocs = scanResult?.firestore?.docs || [];
  const cloudinaryResources = scanResult?.cloudinary?.resources || [];
  const totalReclaimedBytes = scanResult?.cloudinary?.bytesReclaimed || 0;

  // Filtered & Sorted Firestore Docs
  const filteredFirestoreDocs = useMemo(() => {
    let list = [...firestoreDocs];
    if (tableSearch.trim()) {
      const q = tableSearch.toLowerCase().trim();
      list = list.filter(
        (d) =>
          (d.id && d.id.toLowerCase().includes(q)) ||
          (d.title && d.title.toLowerCase().includes(q)) ||
          (d.collection && d.collection.toLowerCase().includes(q))
      );
    }
    if (tableSort === 'age-desc') {
      list.sort((a, b) => (b.ageDays || 0) - (a.ageDays || 0));
    } else if (tableSort === 'age-asc') {
      list.sort((a, b) => (a.ageDays || 0) - (b.ageDays || 0));
    } else if (tableSort === 'name-asc') {
      list.sort((a, b) => (a.title || a.id || '').localeCompare(b.title || b.id || ''));
    }
    return list;
  }, [firestoreDocs, tableSearch, tableSort]);

  // Filtered & Sorted Cloudinary Resources
  const filteredCloudinaryResources = useMemo(() => {
    let list = [...cloudinaryResources];
    if (tableSearch.trim()) {
      const q = tableSearch.toLowerCase().trim();
      list = list.filter(
        (item) =>
          (item.public_id && item.public_id.toLowerCase().includes(q)) ||
          (item.format && item.format.toLowerCase().includes(q))
      );
    }
    if (tableSort === 'age-desc') {
      list.sort((a, b) => (b.ageDays || 0) - (a.ageDays || 0));
    } else if (tableSort === 'age-asc') {
      list.sort((a, b) => (a.ageDays || 0) - (b.ageDays || 0));
    } else if (tableSort === 'size-desc') {
      list.sort((a, b) => (b.bytes || 0) - (a.bytes || 0));
    } else if (tableSort === 'name-asc') {
      list.sort((a, b) => (a.public_id || '').localeCompare(b.public_id || ''));
    }
    return list;
  }, [cloudinaryResources, tableSearch, tableSort]);

  if (authLoading || checkingAuth) {
    return (
      <div style={{ minHeight: '100vh', background: '#070b14', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', color: '#f1f5f9', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #1e293b', borderTopColor: '#f43f5e', borderRadius: '50%', animation: 'del-spin 0.8s linear infinite' }} />
        <p style={{ fontSize: '0.88rem', fontWeight: 600, color: '#94a3b8' }}>Verifying Expiration Engine Authorization...</p>
        <style>{`@keyframes del-spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div style={delStyles.pageContainer}>
      <style>{delCSS}</style>

      {/* 1. TOP COMMAND BAR */}
      <header style={delStyles.header}>
        <div style={delStyles.brandGroup}>
          <Link href="/admin/dashboard" style={delStyles.backBtn}>
            ← Admin
          </Link>

          <div style={delStyles.logoBadge}>
            <IconTrash size={20} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h1 style={delStyles.title}>Data Expiration Engine</h1>
              <span style={delStyles.activeBadge}>
                <span style={delStyles.pulseDot} />
                Active Protection
              </span>
            </div>
            <p style={delStyles.subtitle}>
              Continuous Storage Audit &amp; Targeted Lifecycle Purge (<code style={{ color: '#fda4af' }}>/del</code>)
            </p>
          </div>
        </div>

        <div style={delStyles.headerActions}>
          <Link href="/drive" style={delStyles.secondaryBtn}>
            <IconCloud size={15} style={{ color: '#f472b6' }} />
            <span>Cloud Drive</span>
          </Link>

          <button
            type="button"
            onClick={() => performScan(retentionDays)}
            disabled={scanning}
            style={delStyles.secondaryBtn}
          >
            <IconRefresh size={15} className={scanning ? 'del-spin' : ''} style={{ color: scanning ? '#38bdf8' : '#94a3b8' }} />
            <span>{scanning ? 'Scanning...' : 'Re-scan'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setPurgeConfirmText('');
              setIsPurgeModalOpen(true);
            }}
            disabled={scanning || purging || (firestoreDocs.length === 0 && cloudinaryResources.length === 0)}
            style={{
              ...delStyles.dangerBtn,
              opacity: firestoreDocs.length === 0 && cloudinaryResources.length === 0 ? 0.4 : 1,
              cursor: firestoreDocs.length === 0 && cloudinaryResources.length === 0 ? 'not-allowed' : 'pointer',
            }}
          >
            <IconTrash size={15} />
            <span>PURGE EXPIRED ({retentionDays}D+)</span>
          </button>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE */}
      <main style={delStyles.mainContent}>
        {/* DATA INTEGRITY GUARANTEE BANNER */}
        <div style={delStyles.shieldBanner}>
          <div style={delStyles.shieldIconBox}>
            <IconShield size={22} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <strong style={{ color: '#6ee7b7', fontSize: '0.78rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Zero Data Loss Scope Guard:
              </strong>
              <span style={delStyles.immutableBadge}>
                Referrals &amp; Ledgers 100% Immutable
              </span>
            </div>
            <p style={{ margin: 0, color: '#cbd5e1', fontSize: '0.82rem', lineHeight: 1.5 }}>
              Only customer-created shareable notes (<code style={delStyles.codeTag}>/p/[slug]</code>) and temporary customer uploads (<code style={delStyles.codeTag}>user-uploads/</code>) older than <strong style={{ color: '#fff' }}>{retentionDays} days</strong> are targeted. Referral links (<code style={delStyles.codeTag}>/c/[slug]</code>), creator profiles, clicks, payouts, and the permanent <code style={delStyles.codeTag}>admin_payment_ledger</code> vault are strictly preserved and untouchable.
            </p>
          </div>
        </div>

        {/* STATS OVERVIEW CARDS */}
        <div style={delStyles.statsGrid}>
          {/* CARD 1: EXPIRED NOTES */}
          <div style={delStyles.statCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={delStyles.statLabel}>Expired Notes</span>
              <div style={{ ...delStyles.statIconBadge, background: 'rgba(244, 63, 94, 0.12)', color: '#fb7185', borderColor: 'rgba(244, 63, 94, 0.25)' }}>
                <IconFile size={18} />
              </div>
            </div>
            <div style={{ marginTop: '16px' }}>
              <div style={delStyles.statValue}>
                {scanning && !scanResult ? '...' : firestoreDocs.length}
                <span style={delStyles.statUnit}>records</span>
              </div>
              <p style={delStyles.statSubText}>Firestore notes older than {retentionDays}d</p>
            </div>
          </div>

          {/* CARD 2: EXPIRED MEDIA */}
          <div style={delStyles.statCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={delStyles.statLabel}>Expired Media</span>
              <div style={{ ...delStyles.statIconBadge, background: 'rgba(236, 72, 153, 0.12)', color: '#f472b6', borderColor: 'rgba(236, 72, 153, 0.25)' }}>
                <IconCloud size={18} />
              </div>
            </div>
            <div style={{ marginTop: '16px' }}>
              <div style={{ ...delStyles.statValue, color: '#f472b6' }}>
                {scanning && !scanResult ? '...' : cloudinaryResources.length}
                <span style={delStyles.statUnit}>files</span>
              </div>
              <p style={delStyles.statSubText}>
                Reclaimable: <strong style={{ color: '#fbcfe8' }}>{formatBytes(totalReclaimedBytes)}</strong>
              </p>
            </div>
          </div>

          {/* CARD 3: CUTOFF THRESHOLD */}
          <div style={delStyles.statCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={delStyles.statLabel}>Cutoff Threshold</span>
              <div style={{ ...delStyles.statIconBadge, background: 'rgba(56, 189, 248, 0.12)', color: '#38bdf8', borderColor: 'rgba(56, 189, 248, 0.25)' }}>
                <IconClock size={18} />
              </div>
            </div>
            <div style={{ marginTop: '16px' }}>
              <div style={{ ...delStyles.statValue, fontSize: '1.15rem', color: '#7dd3fc' }}>
                {scanResult?.cutoffDate
                  ? new Date(scanResult.cutoffDate).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })
                  : `${retentionDays} Days Ago`}
              </div>
              <p style={delStyles.statSubText}>Data created before this cutoff will be pruned</p>
            </div>
          </div>

          {/* CARD 4: VAULT STATUS */}
          <div style={delStyles.statCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={delStyles.statLabel}>Safety Vault</span>
              <div style={{ ...delStyles.statIconBadge, background: 'rgba(16, 185, 129, 0.12)', color: '#34d399', borderColor: 'rgba(16, 185, 129, 0.25)' }}>
                <IconCheck size={18} />
              </div>
            </div>
            <div style={{ marginTop: '16px' }}>
              <div style={{ ...delStyles.statValue, fontSize: '1.15rem', color: '#34d399' }}>
                100% Protected
              </div>
              <p style={delStyles.statSubText}>Creator hubs &amp; transactions excluded</p>
            </div>
          </div>
        </div>

        {/* 3. RETENTION WINDOW CONTROLLER & TIMELINE */}
        <div style={delStyles.sectionCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#94a3b8' }}>
                Retention Window:
              </span>
              <span style={delStyles.retentionPill}>
                {retentionDays} Days
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {[
                { label: '90 Days (Standard)', days: 90 },
                { label: '60 Days', days: 60 },
                { label: '30 Days', days: 30 },
                { label: '14 Days', days: 14 },
                { label: '7 Days', days: 7 },
                { label: '1 Day (Test)', days: 1 },
              ].map((preset) => {
                const isActive = retentionDays === preset.days && !showCustomInput;
                return (
                  <button
                    key={preset.days}
                    type="button"
                    onClick={() => handleSelectDays(preset.days)}
                    style={{
                      ...delStyles.chipBtn,
                      ...(isActive ? delStyles.activeChipBtn : {}),
                    }}
                  >
                    {preset.label}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => setShowCustomInput(!showCustomInput)}
                style={{
                  ...delStyles.chipBtn,
                  ...(showCustomInput ? { background: '#0284c7', color: '#fff', borderColor: '#38bdf8' } : {}),
                }}
              >
                Custom Days...
              </button>
            </div>
          </div>

          {/* CUSTOM DAYS FORM */}
          {showCustomInput && (
            <form onSubmit={handleApplyCustomDays} style={delStyles.customDaysBox}>
              <span style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Set custom retention threshold:</span>
              <input
                type="number"
                min="1"
                max="3650"
                placeholder="e.g. 45"
                value={customDaysInput}
                onChange={(e) => setCustomDaysInput(e.target.value)}
                style={delStyles.customInput}
                autoFocus
              />
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>days</span>
              <button type="submit" style={delStyles.applyBtn}>
                Apply &amp; Scan
              </button>
            </form>
          )}

          {/* VISUAL TIMELINE BAR */}
          <div style={{ marginTop: '16px' }}>
            <div style={delStyles.timelineTrack}>
              <div style={{ ...delStyles.timelineExpired, width: '33%' }} title="Expired Data Area" />
              <div style={{ ...delStyles.timelineActive, width: '67%' }} title="Active Protected Data" />
            </div>
            <div style={delStyles.timelineLabels}>
              <span style={{ color: '#fb7185', fontWeight: 600 }}>◄ Expired (Older than {retentionDays}d)</span>
              <span style={{ color: '#cbd5e1', fontFamily: 'monospace' }}>
                Cutoff: {scanResult?.cutoffDate ? new Date(scanResult.cutoffDate).toLocaleDateString() : `${retentionDays}d ago`}
              </span>
              <span style={{ color: '#34d399', fontWeight: 600 }}>Active &amp; Retained (0 to {retentionDays}d) ►</span>
            </div>
          </div>
        </div>

        {/* ERROR BANNER */}
        {scanError && (
          <div style={delStyles.errorBanner}>
            <IconAlert size={18} style={{ color: '#f87171', flexShrink: 0 }} />
            <span>Scan Error: {scanError}</span>
          </div>
        )}

        {/* 4. DATA AUDIT EXPLORER (TABS, SEARCH, SORT) */}
        <div style={delStyles.tableContainer}>
          {/* TAB BAR & FILTER RIBBON */}
          <div style={delStyles.tableToolbar}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setActiveTab('firestore')}
                style={{
                  ...delStyles.tabBtn,
                  ...(activeTab === 'firestore' ? delStyles.activeTabFirestore : {}),
                }}
              >
                <IconFile size={15} />
                <span>Expired Firestore Docs ({firestoreDocs.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('cloudinary')}
                style={{
                  ...delStyles.tabBtn,
                  ...(activeTab === 'cloudinary' ? delStyles.activeTabCloudinary : {}),
                }}
              >
                <IconCloud size={15} />
                <span>Expired Cloudinary Files ({cloudinaryResources.length})</span>
              </button>
            </div>

            {/* SEARCH & SORT TOOLBAR */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <div style={delStyles.searchBox}>
                <IconSearch size={14} style={{ color: '#64748b' }} />
                <input
                  type="text"
                  placeholder="Filter records..."
                  value={tableSearch}
                  onChange={(e) => setTableSearch(e.target.value)}
                  style={delStyles.searchInput}
                />
                {tableSearch && (
                  <button
                    type="button"
                    onClick={() => setTableSearch('')}
                    style={delStyles.clearBtn}
                  >
                    <IconClose size={13} />
                  </button>
                )}
              </div>

              <select
                value={tableSort}
                onChange={(e) => setTableSort(e.target.value)}
                style={delStyles.sortSelect}
              >
                <option value="age-desc">Age: Oldest First</option>
                <option value="age-asc">Age: Newest First</option>
                <option value="size-desc">Size: Largest First</option>
                <option value="name-asc">Name: A to Z</option>
              </select>
            </div>
          </div>

          {/* TAB 1: FIRESTORE EXPIRED DOCS */}
          {activeTab === 'firestore' && (
            <div style={{ overflowX: 'auto' }}>
              {filteredFirestoreDocs.length === 0 ? (
                <div style={delStyles.emptyState}>
                  <div style={delStyles.emptyIconBox}>
                    <IconCheck size={24} />
                  </div>
                  <h3 style={{ margin: '0 0 4px', fontSize: '0.95rem', fontWeight: 700, color: '#f1f5f9' }}>
                    {firestoreDocs.length === 0
                      ? `No Firestore notes older than ${retentionDays} days found`
                      : 'No notes match your filter'}
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: '#94a3b8', maxWidth: '380px' }}>
                    {firestoreDocs.length === 0
                      ? `Your Firestore database is clean under the ${retentionDays}-day retention policy.`
                      : 'Try clearing your search query to see all scanned expired records.'}
                  </p>
                </div>
              ) : (
                <table style={delStyles.table}>
                  <thead>
                    <tr style={delStyles.thRow}>
                      <th style={delStyles.th}>Doc ID</th>
                      <th style={delStyles.th}>Collection</th>
                      <th style={delStyles.th}>Title / Note Identifier</th>
                      <th style={delStyles.th}>Created Date</th>
                      <th style={delStyles.th}>Age</th>
                      <th style={{ ...delStyles.th, textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFirestoreDocs.map((doc) => (
                      <tr key={`${doc.collection}-${doc.id}`} style={delStyles.tr}>
                        <td style={{ ...delStyles.td, fontFamily: 'monospace', color: '#fda4af' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span>{doc.id}</span>
                            <button
                              type="button"
                              onClick={() => handleCopy(doc.id, 'Doc ID')}
                              style={delStyles.miniCopyBtn}
                              title="Copy ID"
                            >
                              <IconCopy size={12} />
                            </button>
                          </div>
                        </td>
                        <td style={delStyles.td}>
                          <span style={delStyles.colBadge}>{doc.collection}</span>
                        </td>
                        <td style={{ ...delStyles.td, fontWeight: 600, color: '#f8fafc', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {doc.title || 'Untitled note'}
                        </td>
                        <td style={{ ...delStyles.td, color: '#94a3b8' }}>
                          {doc.createdAt
                            ? new Date(doc.createdAt).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })
                            : '—'}
                        </td>
                        <td style={{ ...delStyles.td, color: '#fb7185', fontWeight: 700 }}>
                          {doc.ageDays} days old
                        </td>
                        <td style={{ ...delStyles.td, textAlign: 'right' }}>
                          <button
                            type="button"
                            onClick={() => handleCopy(doc.id, 'Document ID')}
                            style={delStyles.tableActionBtn}
                          >
                            <IconCopy size={11} />
                            <span>Copy ID</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* TAB 2: CLOUDINARY EXPIRED FILES */}
          {activeTab === 'cloudinary' && (
            <div style={{ overflowX: 'auto' }}>
              {filteredCloudinaryResources.length === 0 ? (
                <div style={delStyles.emptyState}>
                  <div style={delStyles.emptyIconBox}>
                    <IconCheck size={24} />
                  </div>
                  <h3 style={{ margin: '0 0 4px', fontSize: '0.95rem', fontWeight: 700, color: '#f1f5f9' }}>
                    {cloudinaryResources.length === 0
                      ? `No Cloudinary assets older than ${retentionDays} days found`
                      : 'No media files match your filter'}
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: '#94a3b8', maxWidth: '380px' }}>
                    {cloudinaryResources.length === 0
                      ? `Your Cloudinary storage is clean under the ${retentionDays}-day retention policy.`
                      : 'Try clearing your search query to see all scanned expired media.'}
                  </p>
                </div>
              ) : (
                <table style={delStyles.table}>
                  <thead>
                    <tr style={delStyles.thRow}>
                      <th style={delStyles.th}>Public ID</th>
                      <th style={delStyles.th}>Format</th>
                      <th style={delStyles.th}>File Size</th>
                      <th style={delStyles.th}>Created Date</th>
                      <th style={delStyles.th}>Age</th>
                      <th style={{ ...delStyles.th, textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCloudinaryResources.map((item) => (
                      <tr key={item.public_id} style={delStyles.tr}>
                        <td style={{ ...delStyles.td, fontFamily: 'monospace', color: '#f472b6', maxWidth: '320px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.public_id}</span>
                            <button
                              type="button"
                              onClick={() => handleCopy(item.public_id, 'Public ID')}
                              style={delStyles.miniCopyBtn}
                              title="Copy Public ID"
                            >
                              <IconCopy size={12} />
                            </button>
                          </div>
                        </td>
                        <td style={delStyles.td}>
                          <span style={delStyles.formatBadge}>{item.format || item.resource_type}</span>
                        </td>
                        <td style={{ ...delStyles.td, color: '#e2e8f0', fontWeight: 600 }}>{formatBytes(item.bytes)}</td>
                        <td style={{ ...delStyles.td, color: '#94a3b8' }}>
                          {item.created_at
                            ? new Date(item.created_at).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })
                            : '—'}
                        </td>
                        <td style={{ ...delStyles.td, color: '#fb7185', fontWeight: 700 }}>
                          {item.ageDays} days old
                        </td>
                        <td style={{ ...delStyles.td, textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <button
                              type="button"
                              onClick={() => setPreviewMedia(item)}
                              style={delStyles.tableActionBtn}
                            >
                              <IconEye size={12} />
                              <span>Preview</span>
                            </button>
                            <a
                              href={item.secure_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ ...delStyles.tableActionBtn, color: '#f472b6', borderColor: 'rgba(236, 72, 153, 0.4)' }}
                            >
                              <span>Open ↗</span>
                            </a>
                          </div>
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

      {/* 5. MODAL: MEDIA PREVIEW LIGHTBOX */}
      {previewMedia && (
        <div style={delStyles.modalBackdrop} onClick={() => setPreviewMedia(null)}>
          <div style={delStyles.previewModalCard} onClick={(e) => e.stopPropagation()}>
            <div style={delStyles.previewModalHeader}>
              <div style={{ overflow: 'hidden', paddingRight: '12px' }}>
                <h4 style={{ margin: '0 0 2px', fontSize: '0.88rem', fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {previewMedia.public_id}
                </h4>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>
                  {formatBytes(previewMedia.bytes)} • {previewMedia.ageDays} days old
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewMedia(null)}
                style={delStyles.closeModalBtn}
              >
                <IconClose size={18} />
              </button>
            </div>

            <div style={delStyles.previewModalBody}>
              {previewMedia.format === 'webm' || previewMedia.format === 'mp3' || previewMedia.format === 'wav' ? (
                <div style={{ width: '100%', maxWidth: '400px', padding: '24px', background: '#0f172a', borderRadius: '16px', border: '1px solid #1e293b', textAlign: 'center' }}>
                  <p style={{ margin: '0 0 12px', fontSize: '0.75rem', fontWeight: 700, color: '#f472b6', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Audio / Voice Note ({previewMedia.format})
                  </p>
                  <audio src={previewMedia.secure_url} controls style={{ width: '100%' }} />
                </div>
              ) : previewMedia.resource_type === 'video' || previewMedia.format === 'mp4' ? (
                <video src={previewMedia.secure_url} controls autoPlay style={{ maxHeight: '50vh', maxWidth: '100%', borderRadius: '10px' }} />
              ) : (
                <img
                  src={previewMedia.secure_url}
                  alt={previewMedia.public_id}
                  style={{ maxHeight: '50vh', maxWidth: '100%', borderRadius: '10px', objectFit: 'contain' }}
                />
              )}
            </div>

            <div style={delStyles.previewModalFooter}>
              <button
                type="button"
                onClick={() => handleCopy(previewMedia.secure_url, 'Direct URL')}
                style={delStyles.secondaryBtn}
              >
                <IconCopy size={13} />
                <span>Copy URL</span>
              </button>
              <a
                href={previewMedia.secure_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ ...delStyles.primaryBtn, background: 'linear-gradient(135deg, #ec4899 0%, #be123c 100%)' }}
              >
                <span>Open in New Tab ↗</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 6. MODAL: TWO-STEP FAIL-SAFE PURGE CONFIRMATION */}
      {isPurgeModalOpen && (
        <div style={delStyles.modalBackdrop}>
          <div style={delStyles.purgeModalCard}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#f87171' }}>
              <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.25)' }}>
                <IconAlert size={24} />
              </div>
              <div>
                <h3 style={{ margin: '0 0 2px', fontSize: '1.05rem', fontWeight: 800, color: '#fff' }}>
                  Confirm Data Purge ({retentionDays}D+)
                </h3>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#f87171', fontWeight: 600 }}>
                  Irreversible Administrative Deletion
                </p>
              </div>
            </div>

            <div style={delStyles.purgeSummaryBox}>
              <div style={delStyles.summaryRow}>
                <span>Expired Notes to delete:</span>
                <strong style={{ color: '#fb7185' }}>{firestoreDocs.length}</strong>
              </div>
              <div style={delStyles.summaryRow}>
                <span>Expired Cloudinary Files to delete:</span>
                <strong style={{ color: '#f472b6' }}>{cloudinaryResources.length}</strong>
              </div>
              <div style={delStyles.summaryRow}>
                <span>Storage space to reclaim:</span>
                <strong style={{ color: '#fbcfe8' }}>{formatBytes(totalReclaimedBytes)}</strong>
              </div>
              <div style={{ ...delStyles.summaryRow, borderTop: '1px solid #1e293b', paddingTop: '8px', marginTop: '4px' }}>
                <span>Cutoff Threshold:</span>
                <strong style={{ color: '#7dd3fc', fontFamily: 'monospace' }}>
                  Prior to {scanResult?.cutoffDate ? new Date(scanResult.cutoffDate).toLocaleDateString() : `${retentionDays}d ago`}
                </strong>
              </div>
            </div>

            <div style={delStyles.safeNoticeBox}>
              <strong>Guaranteed Retention:</strong> All records created within the last <strong>{retentionDays} days</strong> remain active and 100% untouched.
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#cbd5e1' }}>
                Type <span style={{ color: '#fb7185', fontFamily: 'monospace', fontWeight: 800 }}>PURGE</span> to unlock execution:
              </label>
              <input
                type="text"
                placeholder="Type PURGE here"
                value={purgeConfirmText}
                onChange={(e) => setPurgeConfirmText(e.target.value)}
                style={delStyles.purgeConfirmInput}
                autoFocus
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
              <button
                type="button"
                onClick={() => setIsPurgeModalOpen(false)}
                style={delStyles.secondaryBtn}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={executePurge}
                disabled={purging || purgeConfirmText.trim().toUpperCase() !== 'PURGE'}
                style={{
                  ...delStyles.dangerBtn,
                  opacity: purging || purgeConfirmText.trim().toUpperCase() !== 'PURGE' ? 0.4 : 1,
                  cursor: purging || purgeConfirmText.trim().toUpperCase() !== 'PURGE' ? 'not-allowed' : 'pointer',
                }}
              >
                {purging && <IconRefresh size={14} className="del-spin" />}
                <span>{purging ? 'Purging Expired Data...' : 'Permanently Purge Data'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. TOAST NOTIFICATION */}
      {toast && (
        <div style={{ ...delStyles.toastBox, background: toast.type === 'error' ? '#991b1b' : '#065f46', borderColor: toast.type === 'error' ? '#dc2626' : '#059669' }}>
          {toast.type === 'error' ? <IconAlert size={16} /> : <IconCheck size={16} />}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}

// ==========================================
// CSS STYLESHEET (CLEAN, SELF-CONTAINED & ROBUST)
// ==========================================
const delCSS = `
  @keyframes del-spin {
    to { transform: rotate(360deg); }
  }
  .del-spin {
    animation: del-spin 0.8s linear infinite;
  }
`;

const delStyles = {
  pageContainer: {
    minHeight: '100vh',
    background: '#070b14',
    color: '#f1f5f9',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
  },
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 30,
    background: 'rgba(12, 18, 32, 0.95)',
    backdropFilter: 'blur(8px)',
    borderBottom: '1px solid rgba(30, 41, 59, 0.8)',
    padding: '12px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px',
  },
  brandGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  backBtn: {
    padding: '6px 12px',
    borderRadius: '8px',
    background: 'rgba(30, 41, 59, 0.8)',
    color: '#cbd5e1',
    textDecoration: 'none',
    fontSize: '0.78rem',
    fontWeight: 600,
    border: '1px solid rgba(51, 65, 85, 0.6)',
  },
  logoBadge: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    boxShadow: '0 4px 12px rgba(225, 29, 72, 0.3)',
  },
  title: {
    margin: 0,
    fontSize: '1.05rem',
    fontWeight: 800,
    letterSpacing: '-0.02em',
    color: '#fff',
  },
  activeBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    padding: '2px 8px',
    borderRadius: '999px',
    fontSize: '0.68rem',
    fontWeight: 700,
    background: 'rgba(16, 185, 129, 0.12)',
    color: '#34d399',
    border: '1px solid rgba(16, 185, 129, 0.3)',
  },
  pulseDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#34d399',
  },
  subtitle: {
    margin: 0,
    fontSize: '0.72rem',
    color: '#94a3b8',
  },
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  secondaryBtn: {
    padding: '7px 14px',
    borderRadius: '8px',
    background: '#1e293b',
    color: '#e2e8f0',
    fontSize: '0.78rem',
    fontWeight: 600,
    border: '1px solid #334155',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    textDecoration: 'none',
  },
  primaryBtn: {
    padding: '7px 16px',
    borderRadius: '8px',
    background: '#0284c7',
    color: '#fff',
    fontSize: '0.78rem',
    fontWeight: 700,
    border: 'none',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    textDecoration: 'none',
  },
  dangerBtn: {
    padding: '7px 16px',
    borderRadius: '8px',
    background: 'linear-gradient(135deg, #e11d48 0%, #b91c1c 100%)',
    color: '#fff',
    fontSize: '0.78rem',
    fontWeight: 700,
    border: 'none',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    boxShadow: '0 2px 10px rgba(225, 29, 72, 0.35)',
  },
  mainContent: {
    flex: 1,
    maxWidth: '1280px',
    width: '100%',
    margin: '0 auto',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    boxSizing: 'border-box',
  },
  shieldBanner: {
    background: 'linear-gradient(135deg, rgba(6, 78, 59, 0.35) 0%, rgba(15, 23, 42, 0.6) 100%)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    borderRadius: '14px',
    padding: '16px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  shieldIconBox: {
    padding: '10px',
    borderRadius: '10px',
    background: 'rgba(16, 185, 129, 0.12)',
    color: '#34d399',
    border: '1px solid rgba(16, 185, 129, 0.25)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  immutableBadge: {
    background: 'rgba(16, 185, 129, 0.18)',
    color: '#6ee7b7',
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '0.72rem',
    fontFamily: 'monospace',
    fontWeight: 700,
  },
  codeTag: {
    background: 'rgba(30, 41, 59, 0.8)',
    padding: '2px 6px',
    borderRadius: '4px',
    fontFamily: 'monospace',
    fontSize: '0.75rem',
    color: '#fbcfe8',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '16px',
  },
  statCard: {
    background: '#0e1526',
    border: '1px solid rgba(30, 41, 59, 0.8)',
    borderRadius: '14px',
    padding: '18px 20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  statLabel: {
    fontSize: '0.72rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: '#94a3b8',
  },
  statIconBadge: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid',
  },
  statValue: {
    fontSize: '1.75rem',
    fontWeight: 800,
    color: '#fff',
    display: 'flex',
    alignItems: 'baseline',
    gap: '6px',
    letterSpacing: '-0.02em',
  },
  statUnit: {
    fontSize: '0.78rem',
    fontWeight: 500,
    color: '#94a3b8',
  },
  statSubText: {
    margin: '4px 0 0',
    fontSize: '0.72rem',
    color: '#94a3b8',
  },
  sectionCard: {
    background: '#0c1220',
    border: '1px solid rgba(30, 41, 59, 0.8)',
    borderRadius: '14px',
    padding: '18px 20px',
  },
  retentionPill: {
    background: 'rgba(244, 63, 94, 0.12)',
    color: '#fb7185',
    padding: '2px 8px',
    borderRadius: '6px',
    fontSize: '0.75rem',
    fontWeight: 700,
    border: '1px solid rgba(244, 63, 94, 0.25)',
  },
  chipBtn: {
    background: '#1e293b',
    border: '1px solid #334155',
    color: '#cbd5e1',
    padding: '6px 12px',
    borderRadius: '8px',
    fontSize: '0.75rem',
    fontWeight: 600,
    cursor: 'pointer',
  },
  activeChipBtn: {
    background: '#e11d48',
    color: '#fff',
    borderColor: '#f43f5e',
    boxShadow: '0 2px 8px rgba(225, 29, 72, 0.3)',
  },
  customDaysBox: {
    marginTop: '12px',
    padding: '10px 14px',
    borderRadius: '8px',
    background: '#070b14',
    border: '1px solid #1e293b',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  customInput: {
    width: '90px',
    background: '#090e1a',
    border: '1px solid #334155',
    borderRadius: '6px',
    padding: '5px 10px',
    color: '#fff',
    fontSize: '0.78rem',
    outline: 'none',
  },
  applyBtn: {
    padding: '5px 12px',
    background: '#0284c7',
    border: 'none',
    borderRadius: '6px',
    color: '#fff',
    fontSize: '0.75rem',
    fontWeight: 700,
    cursor: 'pointer',
  },
  timelineTrack: {
    height: '8px',
    width: '100%',
    background: '#1e293b',
    borderRadius: '999px',
    overflow: 'hidden',
    display: 'flex',
  },
  timelineExpired: {
    background: 'linear-gradient(90deg, #e11d48, #fb7185)',
    height: '100%',
  },
  timelineActive: {
    background: 'linear-gradient(90deg, #10b981, #34d399)',
    height: '100%',
  },
  timelineLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.72rem',
    color: '#94a3b8',
    marginTop: '6px',
  },
  errorBanner: {
    background: 'rgba(153, 27, 27, 0.3)',
    border: '1px solid #b91c1c',
    borderRadius: '10px',
    padding: '12px 16px',
    color: '#fca5a5',
    fontSize: '0.8rem',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  tableContainer: {
    background: '#0c1220',
    border: '1px solid rgba(30, 41, 59, 0.8)',
    borderRadius: '14px',
    overflow: 'hidden',
  },
  tableToolbar: {
    padding: '14px 20px',
    borderBottom: '1px solid rgba(30, 41, 59, 0.8)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px',
  },
  tabBtn: {
    background: 'transparent',
    border: 'none',
    color: '#94a3b8',
    padding: '8px 14px',
    borderRadius: '8px',
    fontSize: '0.78rem',
    fontWeight: 700,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
  },
  activeTabFirestore: {
    background: 'rgba(244, 63, 94, 0.15)',
    color: '#fda4af',
    border: '1px solid rgba(244, 63, 94, 0.3)',
  },
  activeTabCloudinary: {
    background: 'rgba(236, 72, 153, 0.15)',
    color: '#f472b6',
    border: '1px solid rgba(236, 72, 153, 0.3)',
  },
  searchBox: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: '#070b14',
    border: '1px solid #334155',
    borderRadius: '8px',
    padding: '6px 12px',
  },
  searchInput: {
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: '#f8fafc',
    fontSize: '0.78rem',
    width: '180px',
  },
  clearBtn: {
    background: 'transparent',
    border: 'none',
    color: '#64748b',
    cursor: 'pointer',
    padding: 0,
    display: 'flex',
  },
  sortSelect: {
    background: '#070b14',
    border: '1px solid #334155',
    borderRadius: '8px',
    padding: '6px 12px',
    color: '#cbd5e1',
    fontSize: '0.78rem',
    outline: 'none',
    cursor: 'pointer',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
    fontSize: '0.78rem',
  },
  thRow: {
    background: '#090e1a',
    borderBottom: '1px solid #1e293b',
  },
  th: {
    padding: '12px 18px',
    fontSize: '0.72rem',
    fontWeight: 700,
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  tr: {
    borderBottom: '1px solid rgba(30, 41, 59, 0.6)',
  },
  td: {
    padding: '12px 18px',
    color: '#cbd5e1',
  },
  colBadge: {
    background: '#1e293b',
    color: '#cbd5e1',
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '0.7rem',
    fontFamily: 'monospace',
    border: '1px solid #334155',
  },
  formatBadge: {
    background: 'rgba(236, 72, 153, 0.15)',
    color: '#f472b6',
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '0.7rem',
    fontWeight: 700,
    fontFamily: 'monospace',
    textTransform: 'uppercase',
    border: '1px solid rgba(236, 72, 153, 0.3)',
  },
  miniCopyBtn: {
    background: 'transparent',
    border: 'none',
    color: '#64748b',
    cursor: 'pointer',
    padding: '2px',
    display: 'flex',
  },
  tableActionBtn: {
    padding: '4px 10px',
    borderRadius: '6px',
    background: '#1e293b',
    border: '1px solid #334155',
    color: '#cbd5e1',
    fontSize: '0.72rem',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    textDecoration: 'none',
  },
  emptyState: {
    padding: '60px 20px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  emptyIconBox: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    background: 'rgba(16, 185, 129, 0.12)',
    color: '#34d399',
    border: '1px solid rgba(16, 185, 129, 0.25)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '12px',
  },
  modalBackdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.8)',
    backdropFilter: 'blur(6px)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  previewModalCard: {
    background: '#0e1526',
    border: '1px solid #334155',
    borderRadius: '16px',
    maxWidth: '680px',
    width: '100%',
    overflow: 'hidden',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
  },
  previewModalHeader: {
    padding: '14px 20px',
    borderBottom: '1px solid #1e293b',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  closeModalBtn: {
    background: 'transparent',
    border: 'none',
    color: '#94a3b8',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
  },
  previewModalBody: {
    padding: '24px',
    background: '#070b14',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '260px',
    maxHeight: '60vh',
    overflow: 'auto',
  },
  previewModalFooter: {
    padding: '14px 20px',
    borderTop: '1px solid #1e293b',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
  },
  purgeModalCard: {
    background: '#0f172a',
    border: '1px solid #7f1d1d',
    borderRadius: '16px',
    maxWidth: '460px',
    width: '100%',
    padding: '24px',
    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  purgeSummaryBox: {
    background: '#070b14',
    border: '1px solid #1e293b',
    borderRadius: '10px',
    padding: '12px 16px',
    fontSize: '0.78rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    color: '#cbd5e1',
  },
  safeNoticeBox: {
    padding: '10px 14px',
    borderRadius: '8px',
    background: 'rgba(16, 185, 129, 0.12)',
    border: '1px solid rgba(16, 185, 129, 0.25)',
    color: '#6ee7b7',
    fontSize: '0.75rem',
  },
  purgeConfirmInput: {
    width: '100%',
    background: '#070b14',
    border: '1px solid #475569',
    borderRadius: '8px',
    padding: '8px 12px',
    color: '#fff',
    fontSize: '0.85rem',
    fontFamily: 'monospace',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    outline: 'none',
    boxSizing: 'border-box',
  },
  toastBox: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    zIndex: 1100,
    padding: '12px 20px',
    borderRadius: '10px',
    color: '#fff',
    fontWeight: 700,
    fontSize: '0.82rem',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
    border: '1px solid',
  },
};
