'use client';

import { Suspense, useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { doc, onSnapshot } from 'firebase/firestore';
import QRCode from 'qrcode';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '@/lib/firebase';
import PayButton from '@/components/PayButton';
import TemplateRenderer from '@/components/templates/TemplateRenderer';
import { templates } from '@/lib/templates';
import { createKeepsakePoster } from '@/components/KeepsakePoster';
import { WhatsAppIcon, LinkIcon } from '@/components/AppIcons';

/* ─────────────────────────────────────────────────────────
   TEMPLATE ACCENT MAP
───────────────────────────────────────────────────────── */
const ACCENT_MAP = {
  proposal: { color: '#f43f5e', glow: 'rgba(244,63,94,0.25)', gradient: 'linear-gradient(135deg,#f43f5e,#be123c)', emoji: '💕' },
  birthday: { color: '#f59e0b', glow: 'rgba(245,158,11,0.25)', gradient: 'linear-gradient(135deg,#f59e0b,#b45309)', emoji: '🎂' },
  anniversary: { color: '#fbbf24', glow: 'rgba(251,191,36,0.25)', gradient: 'linear-gradient(135deg,#fbbf24,#92400e)', emoji: '🥂' },
  'emotional-apology': { color: '#94a3b8', glow: 'rgba(148,163,184,0.25)', gradient: 'linear-gradient(135deg,#94a3b8,#475569)', emoji: '🥺' },
};

/* ─────────────────────────────────────────────────────────
   PAGE ENTRY
───────────────────────────────────────────────────────── */
export default function PreviewPage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#080810', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', border: '2px solid #f43f5e', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); }}`}</style>
          <p style={{ color: '#475569', fontSize: '0.9rem' }}>Preparing your preview...</p>
        </div>
      }
    >
      <PreviewContent />
    </Suspense>
  );
}

/* ─────────────────────────────────────────────────────────
   MAIN PREVIEW CONTENT
───────────────────────────────────────────────────────── */
function PreviewContent() {
  const params = useSearchParams();
  const id = params.get('id');
  const router = useRouter();

  const [note, setNote] = useState(null);
  const [paid, setPaid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [downloadingQr, setDownloadingQr] = useState(false);
  const [downloadingKeepsake, setDownloadingKeepsake] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showPleaseModal, setShowPleaseModal] = useState(false);

  // Listen to Firestore
  useEffect(() => {
    if (!id) return;
    return onSnapshot(doc(db, 'notes', id), (snap) => {
      if (snap.exists()) {
        const raw = snap.data();
        setNote({
          id: snap.id,
          recipient_name: raw.recipient_name || '',
          custom_message: raw.custom_message || '',
          image_urls: Array.isArray(raw.image_urls) ? raw.image_urls : [],
          custom_details: raw.custom_details || null,
          template: raw.template || 'proposal',
          custom_slug: raw.custom_slug || null,
          is_paid: raw.is_paid || false,
          view_count: raw.view_count || 0,
          last_viewed_at: raw.last_viewed_at || null,
          recipient_reaction: raw.recipient_reaction || null,
          voice_note_url: raw.voice_note_url || null,
        });
        setPaid(raw.is_paid || false);
      }
      setLoading(false);
    });
  }, [id]);

  // Generate QR
  useEffect(() => {
    if (!note) return;
    QRCode.toDataURL(getShareUrl(note), { width: 360, margin: 2, errorCorrectionLevel: 'H', color: { dark: '#881337', light: '#fffdfd' } })
      .then(setQrCodeUrl)
      .catch(() => setQrCodeUrl(''));
  }, [note]);

  // Please Modal on visibility change (unpaid)
  useEffect(() => {
    if (paid) return;
    const handleVisibilityChange = () => {
      if (document.hidden) setShowPleaseModal(true);
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [paid]);

  const getShareUrl = useCallback((n = note) => {
    if (!n) return '';
    const slug = n?.custom_slug || n?.id;
    if (typeof window !== 'undefined') return `${window.location.origin}/p/${slug}`;
    return `/p/${slug}`;
  }, [note]);

  const getWhatsAppUrl = () => {
    const link = getShareUrl();
    const name = note?.recipient_name || 'you';
    const text = `Hey ${name}! 🎁 Someone crafted a beautiful private interactive experience just for you...\n\nTap here to unwrap your moment: ${link}\n\n✨ Made with love on LovelyCrafts`;
    return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(getShareUrl());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const downloadQrCode = async () => {
    if (!qrCodeUrl) return;
    setDownloadingQr(true);
    try {
      const branded = await createBrandedQrImage(qrCodeUrl);
      const a = document.createElement('a');
      a.href = branded;
      a.download = `lovelycrafts-qr-${note?.recipient_name || 'special'}.png`;
      a.click();
    } finally { setDownloadingQr(false); }
  };

  const downloadKeepsake = async () => {
    setDownloadingKeepsake(true);
    try {
      const posterUrl = await createKeepsakePoster(note, qrCodeUrl);
      const a = document.createElement('a');
      a.href = posterUrl;
      a.download = `lovelycrafts-keepsake-${(note?.recipient_name || 'moment').toLowerCase().replace(/\s+/g, '-')}.png`;
      a.click();
    } catch (e) { console.error('Keepsake error:', e); }
    finally { setDownloadingKeepsake(false); }
  };

  const accent = ACCENT_MAP[note?.template] || ACCENT_MAP.proposal;
  const selectedTemplate = templates.find((t) => t.id === note?.template);
  const totalAmount = selectedTemplate?.price || 219;

  // ── LOADING ──
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#080810', flexDirection: 'column', gap: '1rem' }}>
        <style>{`@keyframes spin { to { transform: rotate(360deg); }}`}</style>
        <div style={{ width: 36, height: 36, borderRadius: '50%', border: `2px solid ${accent.color}`, borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ color: '#475569', fontSize: '0.9rem', fontFamily: 'Inter, sans-serif' }}>Preparing your private preview...</p>
      </div>
    );
  }

  // ── NOT FOUND ──
  if (!note) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#080810', flexDirection: 'column', gap: '1.5rem', padding: '2rem', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ fontSize: '3rem' }}>💔</div>
        <h1 style={{ color: '#fff', fontSize: '1.5rem', textAlign: 'center', margin: 0 }}>Experience Not Found</h1>
        <p style={{ color: '#475569', textAlign: 'center', margin: 0 }}>This experience may have expired or the link is incorrect.</p>
        <Link href="/create" style={{ background: '#f43f5e', color: '#fff', padding: '12px 28px', borderRadius: '50px', textDecoration: 'none', fontWeight: 700 }}>
          Create a New Experience
        </Link>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: `radial-gradient(ellipse at 50% 0%, #15152a 0%, #080810 100%)`,
        color: '#f8fafc',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Dancing+Script:wght@700&display=swap');`}</style>

      {/* ── STICKY TOP BAR ── */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          background: 'rgba(8,8,16,0.9)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          padding: '0.75rem 1.25rem',
        }}
      >
        <div
          style={{
            maxWidth: '480px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Link
            href="/create"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '50px',
              padding: '6px 12px',
              color: '#94a3b8',
              textDecoration: 'none',
              fontSize: '0.82rem',
              fontWeight: 600,
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
            </svg>
            Edit
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.1rem' }}>{accent.emoji}</span>
            <span style={{ fontWeight: 800, fontSize: '0.88rem', color: '#fff' }}>LovelyCrafts</span>
          </div>

          <div
            style={{
              background: `${accent.color}18`,
              border: `1px solid ${accent.color}44`,
              borderRadius: '50px',
              padding: '4px 10px',
              fontSize: '0.7rem',
              fontWeight: 800,
              color: accent.color,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            Preview
          </div>
        </div>
      </header>

      {/* ── BODY ── */}
      <main style={{ maxWidth: '480px', margin: '0 auto', padding: '1.5rem 1.25rem 6rem' }}>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ marginBottom: '1.25rem' }}
        >
          <span style={{ fontSize: '0.7rem', fontWeight: 800, color: accent.color, letterSpacing: '0.15em', textTransform: 'uppercase', display: 'block', marginBottom: '0.3rem' }}>
            Private Preview
          </span>
          <h1 style={{ fontFamily: "'Dancing Script', cursive", fontSize: 'clamp(1.8rem, 7vw, 2.6rem)', color: '#fff', margin: '0 0 0.25rem', lineHeight: 1.15 }}>
            {note.recipient_name ? `For ${note.recipient_name}` : 'Your Experience'}
          </h1>
          <p style={{ color: '#475569', fontSize: '0.85rem', margin: 0 }}>
            This is exactly what they&apos;ll see. Review it, then unlock the shareable link.
          </p>
        </motion.div>

        {/* ── EXPERIENCE PANEL ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            borderRadius: '24px',
            overflow: 'hidden',
            border: `1px solid ${accent.color}22`,
            boxShadow: `0 24px 60px rgba(0,0,0,0.6), 0 0 40px ${accent.glow}`,
            marginBottom: '2rem',
          }}
        >
          <TemplateRenderer note={note} isPreview={true} />
        </motion.div>

        {/* ── UNLOCK / SHARE PANEL ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <AnimatePresence mode="wait">
            {paid ? (
              <UnlockedPanel
                key="unlocked"
                note={note}
                accent={accent}
                getShareUrl={getShareUrl}
                getWhatsAppUrl={getWhatsAppUrl}
                copyLink={copyLink}
                copied={copied}
                qrCodeUrl={qrCodeUrl}
                downloadQrCode={downloadQrCode}
                downloadingQr={downloadingQr}
                downloadKeepsake={downloadKeepsake}
                downloadingKeepsake={downloadingKeepsake}
              />
            ) : (
              <LockedPanel
                key="locked"
                note={note}
                accent={accent}
                totalAmount={totalAmount}
                selectedTemplate={selectedTemplate}
                onPaid={() => setPaid(true)}
              />
            )}
          </AnimatePresence>
        </motion.div>
      </main>

      {/* ── PLEASE MODAL (Exit Intent) ── */}
      <AnimatePresence>
        {showPleaseModal && !paid && (
          <PleaseModal
            note={note}
            accent={accent}
            totalAmount={totalAmount}
            onClose={() => setShowPleaseModal(false)}
            onPaid={() => { setPaid(true); setShowPleaseModal(false); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   LOCKED PANEL
───────────────────────────────────────────────────────── */
function LockedPanel({ note, accent, totalAmount, selectedTemplate, onPaid }) {
  const features = [
    'Private shareable link & QR code',
    'WhatsApp 1-click sender',
    'Forever keepsake poster download',
    'Live read receipts & reactions',
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '24px',
        padding: '1.75rem',
      }}
    >
      {/* Lock Icon + Headline */}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ display: 'inline-flex', padding: '14px', background: 'rgba(255,255,255,0.06)', borderRadius: '50%', marginBottom: '0.75rem' }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </motion.div>
        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#fbbf24', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
          Ready to Send?
        </div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', margin: '0 0 0.4rem' }}>Unlock Your Moment</h2>
        <p style={{ color: '#475569', fontSize: '0.85rem', margin: 0, lineHeight: 1.6 }}>
          Once unlocked, you get a private shareable link to send to {note.recipient_name || 'them'} whenever you're ready.
        </p>
      </div>

      {/* Price summary */}
      <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '1.1rem', marginBottom: '1.25rem' }}>
        <div style={{ fontWeight: 700, fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.7rem' }}>Order Summary</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#e2e8f0', fontSize: '0.9rem', marginBottom: '0.6rem' }}>
          <span>{selectedTemplate?.title || 'Experience'}</span>
          <span style={{ fontWeight: 700 }}>₹{selectedTemplate?.price || 219}</span>
        </div>
        <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '0.5rem 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fff', fontWeight: 800, fontSize: '1.05rem' }}>
          <span>Total</span>
          <span>₹{totalAmount}</span>
        </div>
        <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {features.map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: accent.color, flexShrink: 0 }} />
              <span style={{ color: '#64748b', fontSize: '0.8rem' }}>{f}</span>
            </div>
          ))}
        </div>
      </div>

      <PayButton apologyId={note.id} onPaid={onPaid} displayAmount={totalAmount} />

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center', marginTop: '1rem' }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round">
          <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <span style={{ color: '#475569', fontSize: '0.78rem' }}>Secure payment via Razorpay</span>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────
   UNLOCKED PANEL
───────────────────────────────────────────────────────── */
function UnlockedPanel({ note, accent, getShareUrl, getWhatsAppUrl, copyLink, copied, qrCodeUrl, downloadQrCode, downloadingQr, downloadKeepsake, downloadingKeepsake }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0 }}
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid ${accent.color}44`,
        borderRadius: '24px',
        padding: '1.75rem',
        boxShadow: `0 0 40px ${accent.glow}`,
      }}
    >
      {/* Success Header */}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 18 }}
          style={{ display: 'inline-flex', padding: '14px', background: 'rgba(74,222,128,0.12)', borderRadius: '50%', marginBottom: '0.75rem' }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </motion.div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', margin: '0 0 0.3rem' }}>Link Unlocked! 🎉</h2>
        <p style={{ color: '#475569', fontSize: '0.85rem', margin: 0 }}>
          Your experience is live. Share it with {note.recipient_name || 'them'} whenever you&apos;re ready.
        </p>
      </div>

      {/* Read receipt */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '0.85rem 1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: note.view_count > 0 ? '#4ade80' : '#475569', boxShadow: note.view_count > 0 ? '0 0 8px #4ade80' : 'none', flexShrink: 0 }} />
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: note.view_count > 0 ? '#4ade80' : '#64748b' }}>
          {note.view_count > 0 ? `Opened ${note.view_count} time${note.view_count > 1 ? 's' : ''}` : 'Not opened yet'}
        </span>
      </div>

      {/* Share URL */}
      <div style={{ background: 'rgba(0,0,0,0.25)', border: `1px solid ${accent.color}33`, borderRadius: '12px', padding: '10px 13px', fontSize: '0.83rem', color: '#94a3b8', wordBreak: 'break-all', fontWeight: 600, marginBottom: '1.1rem' }}>
        {getShareUrl()}
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        <motion.a
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          href={getWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            background: 'linear-gradient(135deg,#25D366,#128C7E)',
            color: '#fff', padding: '14px', borderRadius: '14px', textDecoration: 'none',
            fontWeight: 700, fontSize: '0.98rem',
          }}
        >
          <WhatsAppIcon size={20} color="#fff" />
          Send on WhatsApp
        </motion.a>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={copyLink}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            background: copied ? 'rgba(74,222,128,0.12)' : 'rgba(255,255,255,0.06)',
            border: copied ? '1px solid rgba(74,222,128,0.4)' : '1px solid rgba(255,255,255,0.12)',
            color: copied ? '#4ade80' : '#fff', padding: '13px', borderRadius: '14px',
            fontWeight: 600, fontSize: '0.92rem', cursor: 'pointer', transition: 'all 0.2s',
          }}
        >
          <LinkIcon size={16} />
          {copied ? '✓ Copied!' : 'Copy Private Link'}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={downloadKeepsake}
          disabled={downloadingKeepsake}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)',
            color: '#fbbf24', padding: '13px', borderRadius: '14px',
            fontWeight: 600, fontSize: '0.88rem', cursor: downloadingKeepsake ? 'not-allowed' : 'pointer',
          }}
        >
          ✨ {downloadingKeepsake ? 'Generating...' : 'Download Keepsake Poster'}
        </motion.button>

        {qrCodeUrl && (
          <div style={{ textAlign: 'center', paddingTop: '0.75rem' }}>
            <p style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              QR Code to Share
            </p>
            <img
              src={qrCodeUrl}
              alt="QR Code"
              style={{ width: '130px', height: '130px', borderRadius: '14px', border: `1.5px solid ${accent.color}44`, display: 'block', margin: '0 auto 0.75rem' }}
            />
            <button
              onClick={downloadQrCode}
              disabled={downloadingQr}
              style={{
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8',
                padding: '10px 20px', borderRadius: '12px', fontWeight: 600, fontSize: '0.83rem', cursor: downloadingQr ? 'not-allowed' : 'pointer',
              }}
            >
              {downloadingQr ? 'Preparing...' : 'Download QR Card'}
            </button>
          </div>
        )}

        <p style={{ textAlign: 'center', color: '#475569', fontSize: '0.78rem', marginTop: '0.25rem' }}>
          Revisit anytime from your{' '}
          <Link href="/profile" style={{ color: accent.color, textDecoration: 'underline' }}>profile</Link>.
        </p>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────
   PLEASE MODAL (Exit Intent — unpaid)
───────────────────────────────────────────────────────── */
function PleaseModal({ note, accent, totalAmount, onClose, onPaid }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        padding: '0 0 0',
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 280, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '480px',
          background: 'linear-gradient(180deg, #12121f 0%, #0a0a18 100%)',
          borderRadius: '28px 28px 0 0',
          border: '1px solid rgba(255,255,255,0.1)',
          borderBottom: 'none',
          padding: '2rem 1.75rem 3rem',
          boxShadow: '0 -20px 60px rgba(0,0,0,0.8)',
        }}
      >
        {/* Drag handle */}
        <div style={{ width: 40, height: 4, borderRadius: 4, background: 'rgba(255,255,255,0.12)', margin: '0 auto 1.5rem' }} />

        {/* Emotional header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <motion.div
            animate={{ rotate: [0, -15, 10, -5, 0] }}
            transition={{ duration: 1.5, delay: 0.5, repeat: Infinity, repeatDelay: 3 }}
            style={{ fontSize: '3.5rem', marginBottom: '0.75rem', display: 'inline-block' }}
          >
            🥺
          </motion.div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#fff', margin: '0 0 0.6rem', lineHeight: 1.25 }}>
            Wait... don't leave yet
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.65, margin: 0 }}>
            You put so much love into crafting this for{' '}
            <strong style={{ color: '#e2e8f0' }}>{note.recipient_name || 'them'}</strong>.
            Don't let it go unsent. They deserve to feel this. 💕
          </p>
        </div>

        {/* Price reminder */}
        <div
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            padding: '1rem 1.25rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '0.2rem' }}>Unlock the full experience for</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>₹{totalAmount} <span style={{ fontSize: '0.85rem', fontWeight: 400, color: '#475569', textDecoration: 'line-through' }}>₹499</span></div>
          </div>
          <div style={{ fontSize: '2rem' }}>{accent.emoji}</div>
        </div>

        {/* CTA */}
        <PayButton apologyId={note.id} onPaid={onPaid} displayAmount={totalAmount} />

        {/* Dismiss */}
        <button
          onClick={onClose}
          style={{
            width: '100%',
            marginTop: '0.75rem',
            padding: '12px',
            borderRadius: '14px',
            background: 'transparent',
            border: 'none',
            color: '#475569',
            fontSize: '0.88rem',
            cursor: 'pointer',
          }}
        >
          Maybe later
        </button>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────
   BRANDED QR HELPER
───────────────────────────────────────────────────────── */
function createBrandedQrImage(qrDataUrl) {
  return new Promise((resolve, reject) => {
    const qr = new Image();
    qr.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 900; canvas.height = 1080;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas error'));

      ctx.fillStyle = '#07070f';
      ctx.fillRect(0, 0, 900, 1080);

      const glow = ctx.createRadialGradient(450, 500, 80, 450, 500, 520);
      glow.addColorStop(0, 'rgba(244,63,94,0.2)');
      glow.addColorStop(1, 'rgba(7,7,15,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, 900, 1080);

      ctx.textAlign = 'center';
      ctx.fillStyle = '#fda4af';
      ctx.font = '700 32px Arial, sans-serif';
      ctx.fillText('LOVELYCRAFTS', 450, 90);

      roundedRect(ctx, 155, 130, 590, 590, 32);
      ctx.fillStyle = '#0f0f1e';
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#f43f5e';
      ctx.stroke();
      ctx.drawImage(qr, 185, 160, 530, 530);

      ctx.fillStyle = '#f43f5e';
      ctx.font = '700 30px Arial, sans-serif';
      ctx.fillText('Scan to open', 450, 820);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '400 24px Arial, sans-serif';
      ctx.fillText('a private moment made just for them', 450, 860);
      ctx.fillStyle = '#64748b';
      ctx.font = '400 20px Arial, sans-serif';
      ctx.fillText('lovelycrafts.in', 450, 950);

      resolve(canvas.toDataURL('image/png'));
    };
    qr.onerror = () => reject(new Error('QR load error'));
    qr.src = qrDataUrl;
  });
}

function roundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
