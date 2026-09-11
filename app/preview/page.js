'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { doc, onSnapshot } from 'firebase/firestore';
import QRCode from 'qrcode';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '@/lib/firebase';
import PayButton from '@/components/PayButton';
import TemplateRenderer from '@/components/templates/TemplateRenderer';
import VoiceNotePlayer from '@/components/VoiceNotePlayer';
import { templates } from '@/lib/templates';
import { createKeepsakePoster } from '@/components/KeepsakePoster';
import { WhatsAppIcon, LinkIcon } from '@/components/AppIcons';
import GoldBadge from '@/components/templates/common/GoldBadge';

export default function PreviewPage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a12', flexDirection: 'column', gap: '1rem' }}>
          <div className="spinner" />
          <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>Preparing your private preview...</p>
        </div>
      }
    >
      <PreviewContent />
    </Suspense>
  );
}

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
  const [showShare, setShowShare] = useState(false);

  useEffect(() => {
    if (!id) return;
    return onSnapshot(doc(db, 'notes', id), (snap) => {
      if (snap.exists()) {
        const raw = snap.data();
        const data = {
          id: snap.id,
          recipient_name: raw.recipient_name || '',
          custom_message: raw.custom_message || '',
          image_urls: Array.isArray(raw.image_urls) ? raw.image_urls : [],
          shagun_qr_url: raw.shagun_qr_url || null,
          custom_details: raw.custom_details || null,
          template: raw.template || 'default',
          custom_slug: raw.custom_slug || null,
          is_paid: raw.is_paid || false,
          view_count: raw.view_count || 0,
          last_viewed_at: raw.last_viewed_at || null,
          recipient_reaction: raw.recipient_reaction || null,
          voice_note_url: raw.voice_note_url || null,
        };
        setNote(data);
        setPaid(raw.is_paid || false);
      }
      setLoading(false);
    });
  }, [id]);

  useEffect(() => {
    if (!note) return;
    const shareUrl = getShareUrl(note);
    QRCode.toDataURL(shareUrl, {
      width: 360,
      margin: 2,
      errorCorrectionLevel: 'H',
      color: { dark: '#881337', light: '#fffdfd' },
    })
      .then((url) => setQrCodeUrl(url))
      .catch(() => setQrCodeUrl(''));
  }, [note]);

  const getShareUrl = (n = note) => {
    const slug = n?.custom_slug || n?.id;
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/p/${slug}`;
    }
    return `/p/${slug}`;
  };

  const getWhatsAppShareUrl = () => {
    const link = getShareUrl();
    const name = note?.recipient_name || 'you';
    const text = `Hey ${name}! Someone created an unforgettable private interactive experience for you...\n\nTap here to unwrap your moment: ${link}\n\n(Made with love on LovelyCrafts)`;
    return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  };

  async function downloadQrCode() {
    if (!qrCodeUrl) return;
    setDownloadingQr(true);
    try {
      const brandedQrUrl = await createBrandedQrImage(qrCodeUrl);
      const link = document.createElement('a');
      link.href = brandedQrUrl;
      link.download = `lovelycrafts-scan-${note?.recipient_name || 'special'}.png`;
      link.click();
    } finally {
      setDownloadingQr(false);
    }
  }

  async function downloadKeepsake() {
    setDownloadingKeepsake(true);
    try {
      const posterDataUrl = await createKeepsakePoster(note, qrCodeUrl);
      const link = document.createElement('a');
      link.href = posterDataUrl;
      link.download = `lovelycrafts-keepsake-${(note?.recipient_name || 'moment').toLowerCase().replace(/\s+/g, '-')}.png`;
      link.click();
    } catch (e) {
      console.error('Keepsake error:', e);
    } finally {
      setDownloadingKeepsake(false);
    }
  }

  const copyLink = async () => {
    await navigator.clipboard.writeText(getShareUrl());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const selectedTemplate = templates.find((t) => t.id === note?.template);
  const hasCustomSlug = Boolean(note?.custom_slug);
  const basePrice = selectedTemplate?.price || 219;
  const customLinkFee = hasCustomSlug ? 29 : 0;
  const totalAmount = basePrice + customLinkFee;

  // Template accent color mapping
  const accentMap = {
    proposal: '#f43f5e',
    birthday: '#f59e0b',
    anniversary: '#fbbf24',
    'i-miss-you': '#38bdf8',
    'emotional-apology': '#94a3b8',
  };
  const accent = accentMap[note?.template] || '#f43f5e';
  const glowColor = `${accent}30`;

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a12', flexDirection: 'column', gap: '1rem' }}>
        <div className="spinner" />
        <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>Preparing your private preview...</p>
      </div>
    );
  }

  if (!note) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a12', flexDirection: 'column', gap: '1.5rem', padding: '2rem' }}>
        <GoldBadge name="sparkle" size={56} />
        <h1 style={{ color: '#fff', fontSize: '1.5rem', textAlign: 'center' }}>Experience Not Found</h1>
        <p style={{ color: '#94a3b8', textAlign: 'center' }}>This experience may have been removed or the link is incorrect.</p>
        <Link href="/create" style={{ background: '#f43f5e', color: '#fff', padding: '12px 28px', borderRadius: '50px', textDecoration: 'none', fontWeight: 700 }}>
          Create a New Experience
        </Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(ellipse at 50% 0%, #151528 0%, #080810 100%)', color: '#f8fafc' }}>

      {/* ── STICKY TOP NAV ── */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          background: 'rgba(8, 8, 16, 0.88)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
          padding: '0.85rem 1.25rem',
        }}
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <Link
            href="/create"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '50px',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#cbd5e1',
              textDecoration: 'none',
              fontSize: '0.88rem',
              fontWeight: 600,
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Edit Experience
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fbbf24', letterSpacing: '0.1em', textTransform: 'uppercase', background: 'rgba(251, 191, 36, 0.12)', padding: '4px 10px', borderRadius: '50px' }}>
              Private Preview
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <GoldBadge name="sparkle" size={18} />
              <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#fff' }}>LovelyCrafts</span>
            </div>
          </div>
        </div>
      </header>

      {/* ── PAGE BODY ── */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 520px), 1fr))', gap: '2rem', alignItems: 'start' }}>

        {/* ── LEFT: CINEMATIC PREVIEW PANEL ── */}
        <div>
          <div style={{ marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: accent, letterSpacing: '0.15em', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
              Your Private Preview
            </span>
            <h1 style={{ fontFamily: 'var(--font-dancing)', fontSize: 'clamp(1.8rem, 4.5vw, 2.8rem)', color: '#fff', margin: '0 0 0.35rem' }}>
              {note.recipient_name ? `For ${note.recipient_name}` : 'Your Cinematic Experience'}
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
              This is exactly what {note.recipient_name || 'they'} will see. Review, then unlock the shareable link.
            </p>
          </div>

          {note.voice_note_url && (
            <div style={{ marginBottom: '1.5rem' }}>
              <VoiceNotePlayer audioUrl={note.voice_note_url} recipientName={note.recipient_name} />
            </div>
          )}

          {/* Template Experience */}
          <div style={{ borderRadius: '24px', overflow: 'hidden', border: `1px solid ${accent}22`, boxShadow: `0 20px 50px rgba(0,0,0,0.5), 0 0 35px ${glowColor}` }}>
            <TemplateRenderer note={note} isPreview={true} />
          </div>
        </div>

        {/* ── RIGHT: UNLOCK & SHARE PANEL ── */}
        <div style={{ position: 'sticky', top: '80px' }}>
          <AnimatePresence mode="wait">
            {paid ? (
              <motion.div
                key="unlocked"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: `1px solid ${accent}44`,
                  borderRadius: '28px',
                  padding: '2rem',
                  boxShadow: `0 0 40px ${glowColor}`,
                }}
              >
                {/* Success Banner */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                  <div style={{ display: 'inline-flex', padding: '14px', background: 'rgba(74, 222, 128, 0.15)', borderRadius: '50%', marginBottom: '1rem' }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', margin: '0 0 0.4rem' }}>
                    Link Unlocked!
                  </h2>
                  <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>
                    Share this private link with {note.recipient_name} whenever you are ready.
                  </p>
                </div>

                {/* Live Read Receipt */}
                <div style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '16px', padding: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: note.recipient_reaction ? '0.75rem' : 0 }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: note.view_count > 0 ? '#4ade80' : '#94a3b8', boxShadow: note.view_count > 0 ? '0 0 8px #4ade80' : 'none' }} />
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: note.view_count > 0 ? '#4ade80' : '#94a3b8' }}>
                      {note.view_count > 0 ? `Opened ${note.view_count} time${note.view_count > 1 ? 's' : ''}` : 'Awaiting first open'}
                    </span>
                  </div>
                  {note.recipient_reaction && (
                    <div style={{ background: 'rgba(255, 255, 255, 0.04)', borderRadius: '10px', padding: '10px 12px', border: `1px solid ${accent}33` }}>
                      <p style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 700, margin: '0 0 4px', textTransform: 'uppercase' }}>
                        {note.recipient_name} responded:
                      </p>
                      <p style={{ fontSize: '1rem', color: '#fff', margin: 0, fontWeight: 600 }}>
                        {note.recipient_reaction.emoji} &ldquo;{note.recipient_reaction.message || note.recipient_reaction.label}&rdquo;
                      </p>
                    </div>
                  )}
                </div>

                {/* Share URL */}
                <div
                  style={{
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: `1px solid ${accent}44`,
                    borderRadius: '12px',
                    padding: '10px 14px',
                    fontSize: '0.85rem',
                    color: '#e2e8f0',
                    wordBreak: 'break-all',
                    fontWeight: 600,
                    marginBottom: '1.25rem',
                  }}
                >
                  {getShareUrl()}
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                  <a
                    href={getWhatsAppShareUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      background: 'linear-gradient(135deg, #25D366, #128C7E)',
                      color: '#fff',
                      padding: '14px',
                      borderRadius: '14px',
                      textDecoration: 'none',
                      fontWeight: 700,
                      fontSize: '1rem',
                    }}
                  >
                    <WhatsAppIcon size={20} color="#fff" />
                    Send on WhatsApp
                  </a>

                  <button
                    onClick={copyLink}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#fff',
                      padding: '13px',
                      borderRadius: '14px',
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      cursor: 'pointer',
                    }}
                  >
                    <LinkIcon size={16} />
                    {copied ? '✓ Link Copied!' : 'Copy Private Link'}
                  </button>

                  <button
                    onClick={downloadKeepsake}
                    disabled={downloadingKeepsake}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      background: 'rgba(245, 158, 11, 0.1)',
                      border: '1px solid rgba(245, 158, 11, 0.4)',
                      color: '#fbbf24',
                      padding: '13px',
                      borderRadius: '14px',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      cursor: downloadingKeepsake ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <GoldBadge name="sparkle" size={16} />
                    {downloadingKeepsake ? 'Generating Poster...' : 'Download Forever Keepsake Poster'}
                  </button>

                  {qrCodeUrl && (
                    <>
                      <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                        <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.75rem', fontWeight: 600 }}>QR CODE TO SCAN & SHARE</p>
                        <img
                          src={qrCodeUrl}
                          alt="QR Code"
                          style={{ width: '140px', height: '140px', borderRadius: '16px', border: `2px solid ${accent}44`, display: 'block', margin: '0 auto 0.75rem' }}
                        />
                      </div>

                      <button
                        onClick={downloadQrCode}
                        disabled={downloadingQr}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          background: 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          color: '#cbd5e1',
                          padding: '12px',
                          borderRadius: '14px',
                          fontWeight: 600,
                          fontSize: '0.9rem',
                          cursor: downloadingQr ? 'not-allowed' : 'pointer',
                        }}
                      >
                        {downloadingQr ? 'Preparing QR Image...' : 'Download Branded QR Card'}
                      </button>
                    </>
                  )}

                  <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.82rem', marginTop: '0.5rem' }}>
                    Revisit this anytime from your{' '}
                    <Link href="/profile" style={{ color: accent, textDecoration: 'underline' }}>
                      profile dashboard
                    </Link>.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="locked"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '28px',
                  padding: '2rem',
                }}
              >
                {/* Lock Icon */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                  <div style={{ display: 'inline-flex', padding: '16px', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '50%', marginBottom: '1rem' }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#fbbf24', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
                    Ready to Send?
                  </span>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', margin: '0 0 0.5rem' }}>
                    Unlock Your Moment
                  </h2>
                  <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0, lineHeight: 1.5 }}>
                    This experience stays private until unlocked. Once live, you get a shareable link, WhatsApp sender, and forever keepsake poster.
                  </p>
                </div>

                {/* Order Summary */}
                <div
                  style={{
                    background: 'rgba(0, 0, 0, 0.25)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '16px',
                    padding: '1.25rem',
                    marginBottom: '1.5rem',
                  }}
                >
                  <p style={{ fontWeight: 700, fontSize: '0.85rem', color: '#cbd5e1', margin: '0 0 0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Order Summary
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#e2e8f0', fontSize: '0.9rem' }}>
                      <span>{selectedTemplate?.title || 'Cinematic Experience'}</span>
                      <span style={{ fontWeight: 700 }}>&#8377;{basePrice}</span>
                    </div>
                    {hasCustomSlug && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#e2e8f0', fontSize: '0.9rem' }}>
                        <span>Custom Link ({note.custom_slug})</span>
                        <span style={{ fontWeight: 700 }}>+&#8377;{customLinkFee}</span>
                      </div>
                    )}
                    <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.08)', margin: '0.25rem 0' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fff', fontSize: '1rem', fontWeight: 800 }}>
                      <span>Total</span>
                      <span>&#8377;{totalAmount}</span>
                    </div>
                  </div>

                  {/* Includes List */}
                  <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {[
                      'Private shareable link & QR code',
                      'WhatsApp 1-click instant sender',
                      'Forever keepsake poster download',
                      'Live read receipts & reactions',
                    ].map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <GoldBadge name="sparkle" size={12} />
                        <span style={{ color: '#94a3b8', fontSize: '0.82rem' }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <PayButton apologyId={note.id} onPaid={() => setPaid(true)} displayAmount={totalAmount} />

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center', marginTop: '1.25rem' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <span style={{ color: '#64748b', fontSize: '0.8rem' }}>Secure payment via Razorpay</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function createBrandedQrImage(qrDataUrl) {
  return new Promise((resolve, reject) => {
    const qr = new Image();
    qr.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 900;
      canvas.height = 1080;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas error'));

      ctx.fillStyle = '#07070f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const glow = ctx.createRadialGradient(450, 500, 80, 450, 500, 520);
      glow.addColorStop(0, 'rgba(244, 63, 94, 0.25)');
      glow.addColorStop(1, 'rgba(7, 7, 15, 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

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
