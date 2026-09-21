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

function IconChevronRight({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m9 18 6-6-6-6" />
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
      <div className="min-h-screen bg-[#070b14] flex flex-col items-center justify-center gap-4 text-slate-200">
        <div className="w-10 h-10 border-3 border-slate-800 border-t-rose-500 rounded-full animate-spin" />
        <p className="text-sm font-semibold tracking-wide text-slate-400">Verifying Expiration Engine Authorization...</p>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col selection:bg-rose-500 selection:text-white font-sans antialiased">
      {/* 1. TOP COMMAND BAR */}
      <header className="sticky top-0 z-30 bg-[#0c1220]/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700/60 transition-colors"
          >
            <span>←</span>
            <span>Admin</span>
          </Link>

          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 via-rose-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-rose-900/30">
            <IconTrash size={20} />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-white flex items-center gap-2">
                Data Expiration Engine
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Active Protection
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Continuous Storage Audit & Targeted Lifecycle Purge (<code className="text-rose-300">/del</code>)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/drive"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700/60 transition-all shadow-sm"
          >
            <IconCloud size={15} className="text-pink-400" />
            <span>Cloud Drive</span>
          </Link>

          <button
            type="button"
            onClick={() => performScan(retentionDays)}
            disabled={scanning}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700/60 transition-all shadow-sm disabled:opacity-50"
          >
            <IconRefresh size={15} className={scanning ? 'animate-spin text-sky-400' : 'text-slate-400'} />
            <span>{scanning ? 'Scanning...' : 'Re-scan'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setPurgeConfirmText('');
              setIsPurgeModalOpen(true);
            }}
            disabled={scanning || purging || (firestoreDocs.length === 0 && cloudinaryResources.length === 0)}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs font-bold shadow-md shadow-rose-950/50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <IconTrash size={15} />
            <span>PURGE EXPIRED ({retentionDays}D+)</span>
          </button>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 space-y-6">
        {/* DATA INTEGRITY GUARANTEE BANNER */}
        <div className="rounded-xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/30 via-slate-900/60 to-slate-900/40 p-4 sm:p-5 flex items-start sm:items-center gap-4 text-xs sm:text-sm text-emerald-200 shadow-sm backdrop-blur-sm">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
            <IconShield size={22} />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <strong className="text-emerald-300 font-bold uppercase tracking-wider text-xs">
                Zero Data Loss Scope Guard:
              </strong>
              <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded text-[11px] font-mono">
                Referrals & Ledgers 100% Immutable
              </span>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed">
              Only customer-created shareable notes (<code>/p/[slug]</code>) and temporary customer uploads (<code>user-uploads/</code>) older than <strong className="text-white">{retentionDays} days</strong> are targeted. Referral links (<code>/c/[slug]</code>), creator profiles, clicks, payouts, and the permanent <code>admin_payment_ledger</code> vault are strictly preserved and untouchable.
            </p>
          </div>
        </div>

        {/* STATS OVERVIEW CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* CARD 1: EXPIRED NOTES */}
          <div className="rounded-xl bg-[#0e1526]/80 border border-slate-800/80 p-5 flex flex-col justify-between hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Expired Notes
              </span>
              <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <IconFile size={18} />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-2xl sm:text-3xl font-extrabold text-white flex items-baseline gap-2">
                {scanning && !scanResult ? '...' : firestoreDocs.length}
                <span className="text-xs font-medium text-slate-400">records</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Firestore notes older than {retentionDays}d
              </p>
            </div>
          </div>

          {/* CARD 2: EXPIRED MEDIA */}
          <div className="rounded-xl bg-[#0e1526]/80 border border-slate-800/80 p-5 flex flex-col justify-between hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Expired Media
              </span>
              <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400 border border-pink-500/20">
                <IconCloud size={18} />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-2xl sm:text-3xl font-extrabold text-pink-400 flex items-baseline gap-2">
                {scanning && !scanResult ? '...' : cloudinaryResources.length}
                <span className="text-xs font-medium text-slate-400">files</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Reclaimable: <strong className="text-pink-300">{formatBytes(totalReclaimedBytes)}</strong>
              </p>
            </div>
          </div>

          {/* CARD 3: CUTOFF DATE */}
          <div className="rounded-xl bg-[#0e1526]/80 border border-slate-800/80 p-5 flex flex-col justify-between hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Cutoff Threshold
              </span>
              <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <IconClock size={18} />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-base sm:text-lg font-bold text-sky-300">
                {scanResult?.cutoffDate
                  ? new Date(scanResult.cutoffDate).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })
                  : `${retentionDays} Days Ago`}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Data created before this cutoff will be pruned
              </p>
            </div>
          </div>

          {/* CARD 4: VAULT STATUS */}
          <div className="rounded-xl bg-[#0e1526]/80 border border-slate-800/80 p-5 flex flex-col justify-between hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Safety Vault
              </span>
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <IconCheck size={18} />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-base font-bold text-emerald-400 flex items-center gap-1.5">
                <span>100% Protected</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Creator hubs & transactions excluded
              </p>
            </div>
          </div>
        </div>

        {/* 3. RETENTION WINDOW CONTROLS & TIMELINE */}
        <div className="rounded-xl bg-[#0c1220] border border-slate-800/80 p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Retention Window:
              </span>
              <span className="text-xs font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                {retentionDays} Days
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {[
                { label: '90 Days (Standard)', days: 90 },
                { label: '60 Days', days: 60 },
                { label: '30 Days', days: 30 },
                { label: '14 Days', days: 14 },
                { label: '7 Days', days: 7 },
                { label: '1 Day (Test)', days: 1 },
              ].map((preset) => (
                <button
                  key={preset.days}
                  type="button"
                  onClick={() => handleSelectDays(preset.days)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    retentionDays === preset.days && !showCustomInput
                      ? 'bg-rose-600 text-white border-rose-500 shadow-sm shadow-rose-950/40'
                      : 'bg-slate-800/70 hover:bg-slate-700/70 text-slate-300 border-slate-700/60'
                  }`}
                >
                  {preset.label}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setShowCustomInput(!showCustomInput)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  showCustomInput
                    ? 'bg-sky-600 text-white border-sky-500'
                    : 'bg-slate-800/70 hover:bg-slate-700/70 text-slate-300 border-slate-700/60'
                }`}
              >
                Custom Days...
              </button>
            </div>
          </div>

          {/* CUSTOM DAYS FORM */}
          {showCustomInput && (
            <form onSubmit={handleApplyCustomDays} className="flex items-center gap-3 p-3 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-xs text-slate-300">Set custom retention threshold:</span>
              <input
                type="number"
                min="1"
                max="3650"
                placeholder="e.g. 45"
                value={customDaysInput}
                onChange={(e) => setCustomDaysInput(e.target.value)}
                className="w-24 bg-[#070b14] border border-slate-700 rounded-md px-2.5 py-1 text-xs text-white outline-none focus:border-sky-500"
                autoFocus
              />
              <span className="text-xs text-slate-400">days</span>
              <button
                type="submit"
                className="px-3 py-1 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-md shadow-sm transition-colors"
              >
                Apply & Scan
              </button>
            </form>
          )}

          {/* VISUAL TIMELINE */}
          <div className="pt-2">
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
              <div className="bg-gradient-to-r from-rose-600 to-rose-400 h-full w-1/3" title="Expired Data Area" />
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-full w-2/3" title="Active Protected Data" />
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 mt-1.5">
              <span className="text-rose-400 font-semibold">◄ Expired (Older than {retentionDays}d)</span>
              <span className="text-slate-300 font-mono">
                Cutoff: {scanResult?.cutoffDate ? new Date(scanResult.cutoffDate).toLocaleDateString() : `${retentionDays}d ago`}
              </span>
              <span className="text-emerald-400 font-semibold">Active & Retained (0 to {retentionDays}d) ►</span>
            </div>
          </div>
        </div>

        {/* ERROR BANNER */}
        {scanError && (
          <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/80 text-red-200 text-xs flex items-center gap-3">
            <IconAlert size={18} className="text-red-400 shrink-0" />
            <span>Scan Error: {scanError}</span>
          </div>
        )}

        {/* 4. DATA AUDIT EXPLORER (TABS, SEARCH, SORT) */}
        <div className="rounded-xl bg-[#0c1220] border border-slate-800/80 overflow-hidden shadow-lg">
          {/* TAB BAR & FILTER RIBBON */}
          <div className="border-b border-slate-800/80 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('firestore')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'firestore'
                    ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <IconFile size={15} />
                <span>Expired Firestore Docs ({firestoreDocs.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('cloudinary')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'cloudinary'
                    ? 'bg-pink-500/15 text-pink-300 border border-pink-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <IconCloud size={15} />
                <span>Expired Cloudinary Files ({cloudinaryResources.length})</span>
              </button>
            </div>

            {/* SEARCH & SORT TOOLBAR */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <IconSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Filter records..."
                  value={tableSearch}
                  onChange={(e) => setTableSearch(e.target.value)}
                  className="w-full bg-[#070b14] border border-slate-700/70 rounded-lg pl-8 pr-7 py-1.5 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-rose-500"
                />
                {tableSearch && (
                  <button
                    type="button"
                    onClick={() => setTableSearch('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    <IconClose size={14} />
                  </button>
                )}
              </div>

              <select
                value={tableSort}
                onChange={(e) => setTableSort(e.target.value)}
                className="bg-[#070b14] border border-slate-700/70 rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-rose-500"
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
            <div className="overflow-x-auto">
              {filteredFirestoreDocs.length === 0 ? (
                <div className="p-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto">
                    <IconCheck size={24} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-200">
                    {firestoreDocs.length === 0
                      ? `No Firestore notes older than ${retentionDays} days found`
                      : 'No notes match your filter'}
                  </h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    {firestoreDocs.length === 0
                      ? `Your Firestore database is clean under the ${retentionDays}-day retention policy.`
                      : 'Try clearing your search query to see all scanned expired records.'}
                  </p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-900/70 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                      <th className="py-3 px-4">Doc ID</th>
                      <th className="py-3 px-4">Collection</th>
                      <th className="py-3 px-4">Title / Note Identifier</th>
                      <th className="py-3 px-4">Created Date</th>
                      <th className="py-3 px-4">Age</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-xs">
                    {filteredFirestoreDocs.map((doc) => (
                      <tr key={`${doc.collection}-${doc.id}`} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3 px-4 font-mono text-rose-300 flex items-center gap-2">
                          <span>{doc.id}</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(doc.id, 'Doc ID')}
                            className="text-slate-500 hover:text-slate-300 p-0.5 rounded"
                            title="Copy ID"
                          >
                            <IconCopy size={12} />
                          </button>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono border border-slate-700/60">
                            {doc.collection}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-200 max-w-xs truncate">
                          {doc.title || 'Untitled note'}
                        </td>
                        <td className="py-3 px-4 text-slate-400">
                          {doc.createdAt
                            ? new Date(doc.createdAt).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })
                            : '—'}
                        </td>
                        <td className="py-3 px-4 text-rose-400 font-semibold">
                          {doc.ageDays} days old
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleCopy(doc.id, 'Document ID')}
                            className="px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-[11px] font-medium border border-slate-700/50 inline-flex items-center gap-1"
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
            <div className="overflow-x-auto">
              {filteredCloudinaryResources.length === 0 ? (
                <div className="p-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto">
                    <IconCheck size={24} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-200">
                    {cloudinaryResources.length === 0
                      ? `No Cloudinary assets older than ${retentionDays} days found`
                      : 'No media files match your filter'}
                  </h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    {cloudinaryResources.length === 0
                      ? `Your Cloudinary storage is clean under the ${retentionDays}-day retention policy.`
                      : 'Try clearing your search query to see all scanned expired media.'}
                  </p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-900/70 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                      <th className="py-3 px-4">Public ID</th>
                      <th className="py-3 px-4">Format</th>
                      <th className="py-3 px-4">File Size</th>
                      <th className="py-3 px-4">Created Date</th>
                      <th className="py-3 px-4">Age</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-xs">
                    {filteredCloudinaryResources.map((item) => (
                      <tr key={item.public_id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3 px-4 font-mono text-pink-300 flex items-center gap-2 max-w-sm truncate">
                          <span className="truncate">{item.public_id}</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(item.public_id, 'Public ID')}
                            className="text-slate-500 hover:text-slate-300 p-0.5 rounded shrink-0"
                            title="Copy Public ID"
                          >
                            <IconCopy size={12} />
                          </button>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-pink-300 text-[10px] font-bold uppercase border border-slate-700/60">
                            {item.format || item.resource_type}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-300 font-medium">
                          {formatBytes(item.bytes)}
                        </td>
                        <td className="py-3 px-4 text-slate-400">
                          {item.created_at
                            ? new Date(item.created_at).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })
                            : '—'}
                        </td>
                        <td className="py-3 px-4 text-rose-400 font-semibold">
                          {item.ageDays} days old
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setPreviewMedia(item)}
                              className="px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-[11px] font-medium border border-slate-700/50 inline-flex items-center gap-1"
                            >
                              <IconEye size={12} />
                              <span>Preview</span>
                            </button>
                            <a
                              href={item.secure_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-pink-300 text-[11px] font-medium border border-slate-700/50 inline-flex items-center gap-1"
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
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setPreviewMedia(null)}>
          <div className="bg-[#0e1526] border border-slate-700 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
              <div className="truncate pr-4">
                <h4 className="text-xs font-bold text-white truncate">{previewMedia.public_id}</h4>
                <p className="text-[11px] text-slate-400">{formatBytes(previewMedia.bytes)} • {previewMedia.ageDays} days old</p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewMedia(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <IconClose size={18} />
              </button>
            </div>

            <div className="p-6 bg-[#070b14] flex items-center justify-center min-h-[260px] max-h-[60vh] overflow-auto">
              {previewMedia.format === 'webm' || previewMedia.format === 'mp3' || previewMedia.format === 'wav' ? (
                <div className="w-full max-w-md p-4 bg-slate-900 rounded-xl border border-slate-800 text-center space-y-3">
                  <p className="text-xs font-semibold text-pink-400 uppercase tracking-wider">Audio / Voice Note</p>
                  <audio src={previewMedia.secure_url} controls className="w-full" />
                </div>
              ) : previewMedia.resource_type === 'video' || previewMedia.format === 'mp4' ? (
                <video src={previewMedia.secure_url} controls autoPlay className="max-h-[50vh] rounded-lg" />
              ) : (
                <img
                  src={previewMedia.secure_url}
                  alt={previewMedia.public_id}
                  className="max-h-[50vh] max-w-full rounded-lg object-contain"
                />
              )}
            </div>

            <div className="px-5 py-3.5 border-t border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleCopy(previewMedia.secure_url, 'Direct URL')}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 inline-flex items-center gap-1.5"
              >
                <IconCopy size={13} />
                <span>Copy URL</span>
              </button>
              <a
                href={previewMedia.secure_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold inline-flex items-center gap-1.5"
              >
                <span>Open in New Tab ↗</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 6. MODAL: TWO-STEP FAIL-SAFE PURGE CONFIRMATION */}
      {isPurgeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#101828] border border-red-900/60 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20">
                <IconAlert size={24} />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">
                  Confirm Data Purge ({retentionDays}D+)
                </h3>
                <p className="text-xs text-red-400 font-semibold">Irreversible Administrative Deletion</p>
              </div>
            </div>

            <div className="rounded-xl bg-[#070b14] border border-slate-800 p-3.5 space-y-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Expired Notes to delete:</span>
                <strong className="text-rose-400">{firestoreDocs.length}</strong>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Expired Cloudinary Files to delete:</span>
                <strong className="text-pink-400">{cloudinaryResources.length}</strong>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Storage to reclaim:</span>
                <strong className="text-pink-300">{formatBytes(totalReclaimedBytes)}</strong>
              </div>
              <div className="flex justify-between text-slate-300 border-t border-slate-800/80 pt-2">
                <span>Cutoff Threshold:</span>
                <strong className="text-sky-300 font-mono">
                  Prior to {scanResult?.cutoffDate ? new Date(scanResult.cutoffDate).toLocaleDateString() : `${retentionDays}d ago`}
                </strong>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300">
              <strong>Guaranteed Retention:</strong> All records created within the last <strong>{retentionDays} days</strong> remain active and 100% untouched.
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">
                Type <span className="font-mono text-rose-400 font-bold">PURGE</span> to unlock confirmation:
              </label>
              <input
                type="text"
                placeholder="Type PURGE here"
                value={purgeConfirmText}
                onChange={(e) => setPurgeConfirmText(e.target.value)}
                className="w-full bg-[#070b14] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white uppercase font-mono tracking-widest outline-none focus:border-red-500"
                autoFocus
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsPurgeModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={executePurge}
                disabled={purging || purgeConfirmText.trim().toUpperCase() !== 'PURGE'}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-extrabold shadow-lg shadow-red-950/60 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {purging && <IconRefresh size={14} className="animate-spin" />}
                <span>{purging ? 'Purging Expired Data...' : `Permanently Purge Data`}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. TOAST SYSTEM */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-2xl text-xs font-bold text-white flex items-center gap-2.5 transition-all border ${
            toast.type === 'error'
              ? 'bg-red-900/90 border-red-700'
              : 'bg-emerald-900/90 border-emerald-700'
          }`}
        >
          {toast.type === 'error' ? <IconAlert size={16} /> : <IconCheck size={16} />}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
