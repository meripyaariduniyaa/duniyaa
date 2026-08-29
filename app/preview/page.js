'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { doc, onSnapshot } from 'firebase/firestore';
import QRCode from 'qrcode';
import { db } from '@/lib/firebase';
import PayButton from '@/components/PayButton';
import Link from 'next/link';
import TemplateRenderer from '@/components/templates/TemplateRenderer';
import VoiceNotePlayer from '@/components/VoiceNotePlayer';
import { templates } from '@/lib/templates';
import { createKeepsakePoster } from '@/components/KeepsakePoster';

export default function PreviewPage() {
  return (
    <Suspense
      fallback={
        <main className="center-screen">
          <div className="spinner" />
          <p className="text-muted">Preparing your private preview…</p>
        </main>
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
  const [apology, setApology] = useState(null);
  const [paid, setPaid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [downloadingQr, setDownloadingQr] = useState(false);
  const [downloadingKeepsake, setDownloadingKeepsake] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;

    return onSnapshot(doc(db, 'notes', id), (snap) => {
      if (snap.exists()) {
        const raw = snap.data();
        // Only pick plain serializable fields — strip Firestore Timestamps
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
        };
        setApology(data);
        setPaid(raw.is_paid || false);
      }
      setLoading(false);
    });
  }, [id]);

  useEffect(() => {
    if (!apology) return;

    const shareUrl = getShareUrl(apology);
    QRCode.toDataURL(shareUrl, {
      width: 360,
      margin: 2,
      errorCorrectionLevel: 'H',
      color: { dark: '#881337', light: '#fffdfd' }
    })
      .then((url) => setQrCodeUrl(url))
      .catch(() => setQrCodeUrl(''));
  }, [apology]);

  const hasCustomSlug = Boolean(apology?.custom_slug);
  const selectedTemplate = templates.find((template) => template.id === apology?.template);
  const basePrice = selectedTemplate?.price || 199;
  const customLinkFee = hasCustomSlug ? 29 : 0;
  const totalBeforeCoupon = basePrice + customLinkFee;

  if (loading || !apology) {
    return (
      <main className="center-screen">
        <div className="spinner" />
        <p className="text-muted">Preparing your private preview…</p>
      </main>
    );
  }

  // Determine the share URL: use custom slug if available, fallback to ID
  const getShareUrl = (note = apology) => {
    const slug = note?.custom_slug || note?.id;
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/p/${slug}`;
    }
    return `/p/${slug}`;
  };

  const getWhatsAppShareUrl = () => {
    const link = getShareUrl();
    const name = apology.recipient_name || 'you';
    const text = `✨ Hey ${name}! Someone made an unforgettable private interactive surprise for you... 🎁\n\nTap here to unwrap your moment: ${link}\n\n(Made with ♥ on LovelyCrafts)`;
    return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  };

  async function downloadQrCode() {
    if (!qrCodeUrl) return;
    setDownloadingQr(true);

    try {
      const brandedQrUrl = await createBrandedQrImage(qrCodeUrl);
      const link = document.createElement('a');
      link.href = brandedQrUrl;
      link.download = `lovelycrafts-scan-${apology.recipient_name || 'special'}.png`;
      link.click();
    } finally {
      setDownloadingQr(false);
    }
  }

  async function downloadKeepsake() {
    setDownloadingKeepsake(true);
    try {
      const posterDataUrl = await createKeepsakePoster(apology, qrCodeUrl);
      const link = document.createElement('a');
      link.href = posterDataUrl;
      link.download = `lovelycrafts-keepsake-${(apology.recipient_name || 'moment').toLowerCase().replace(/\s+/g, '-')}.png`;
      link.click();
    } catch (e) {
      console.error('Error generating keepsake poster:', e);
      alert('Could not download keepsake image right now. Please try again.');
    } finally {
      setDownloadingKeepsake(false);
    }
  }

  const copyLink = async () => {
    await navigator.clipboard.writeText(getShareUrl());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <main className="shell">
      <div className="bg-glow bg-glow--top" aria-hidden="true" />
      <div className="bg-glow bg-glow--bottom" aria-hidden="true" />

      <div className="main-content" style={{ marginTop: '2rem' }}>
        <div className="grid-2">
          {/* Left Column: Preview */}
          <div>
            <div style={{ marginBottom: '2rem' }}>
              <p className="text-muted" style={{ fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>✦ YOUR PRIVATE PREVIEW</p>
              <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', marginTop: '0.5rem', marginBottom: '0.5rem' }}>It feels like you.</h1>
              <p className="text-muted" style={{ fontSize: '1rem' }}>
                Take a look, then unlock a shareable link when it feels right.
              </p>
            </div>
            
            {apology.voice_note_url && (
              <VoiceNotePlayer audioUrl={apology.voice_note_url} recipientName={apology.recipient_name} />
            )}
            <TemplateRenderer note={apology} isPreview={true} />
          </div>

          {/* Right Column: Payment & Link */}
          <div>
            <aside className="glass-card" style={{ position: 'sticky', top: '120px' }}>
              {paid ? (
                <div className="text-center">
                  <div style={{ width: '48px', height: '48px', background: '#d81e5b', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', margin: '0 auto 1.25rem', border: '3px solid rgba(59, 15, 27, 0.9)', boxShadow: '2px 2px 0px rgba(59, 15, 27, 0.9)' }}>✓</div>
                  <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Your link is ready!</h2>
                  <p className="text-muted" style={{ marginBottom: '1.5rem', fontSize: '0.92rem' }}>
                    Send this private link to {apology.recipient_name}. It is unlocked and safe.
                  </p>

                  {/* Recipient Reaction & Read Receipt Status */}
                  <div style={{ background: '#fff1f2', border: '1.5px solid #fecdd3', borderRadius: '14px', padding: '14px', marginBottom: '1.5rem', textAlign: 'left' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '16px' }}>👀</span>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#be185d' }}>
                        {apology.view_count > 0 ? `Opened ${apology.view_count} time(s)` : 'Awaiting first open'}
                      </span>
                    </div>
                    {apology.recipient_reaction ? (
                      <div style={{ marginTop: '8px', background: '#ffffff', borderRadius: '10px', padding: '10px 12px', border: '1px solid #fbcfe8' }}>
                        <p style={{ fontSize: '12px', color: '#9d174d', fontWeight: 700, margin: '0 0 2px' }}>
                          💌 {apology.recipient_name} responded:
                        </p>
                        <p style={{ fontSize: '13px', color: '#1f2937', margin: 0, fontWeight: 600 }}>
                          {apology.recipient_reaction.emoji} &ldquo;{apology.recipient_reaction.message || apology.recipient_reaction.label}&rdquo;
                        </p>
                      </div>
                    ) : (
                      <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                        When {apology.recipient_name} opens and reacts to your note, their reply will show up here live!
                      </p>
                    )}
                  </div>
                  
                  <div style={{ background: '#fff4f8', padding: '0.85rem', borderRadius: '12px', wordBreak: 'break-all', marginBottom: '1.25rem', border: '2px solid rgba(244, 63, 94, 0.25)', fontSize: '0.85rem', fontWeight: 600, color: '#881337' }}>
                    {getShareUrl()}
                  </div>

                  {/* 1-Click WhatsApp Direct Button */}
                  <a
                    href={getWhatsAppShareUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary w-full"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      background: 'linear-gradient(135deg, #25D366, #128C7E)',
                      borderColor: '#128C7E',
                      color: 'white',
                      marginBottom: '0.75rem',
                      textDecoration: 'none',
                      fontSize: '15px'
                    }}
                  >
                    <span>💬 Send on WhatsApp</span>
                  </a>

                  {/* Copy Link Button */}
                  <button
                    className="btn-secondary w-full"
                    onClick={copyLink}
                    style={{ marginBottom: '0.75rem' }}
                  >
                    {copied ? '✓ Link Copied!' : '📋 Copy Private Link'}
                  </button>

                  {/* Download Forever Keepsake Poster */}
                  <button
                    className="btn-secondary w-full"
                    onClick={downloadKeepsake}
                    disabled={downloadingKeepsake}
                    style={{
                      marginBottom: '0.75rem',
                      background: '#fffdfa',
                      border: '1.5px solid #f59e0b',
                      color: '#b45309',
                      fontWeight: 600
                    }}
                  >
                    {downloadingKeepsake ? 'Generating Keepsake Poster…' : '📜 Download "Forever Keepsake" Poster'}
                  </button>

                  {qrCodeUrl && (
                    <div className="branded-qr" style={{ margin: '1.25rem 0' }}>
                      <div className="branded-qr__heading"><span>♥</span> LovelyCrafts</div>
                      <div className="branded-qr__frame">
                        <span className="branded-qr__heart">♥</span>
                        <span className="branded-qr__arrow">↘</span>
                        <img src={qrCodeUrl} alt="Scan this QR code to open the private LovelyCrafts experience" />
                      </div>
                      <p><strong>Scan to open</strong><br />a moment made just for them</p>
                    </div>
                  )}

                  <button
                    className="btn-secondary w-full"
                    onClick={downloadQrCode}
                    disabled={downloadingQr || !qrCodeUrl}
                  >
                    {downloadingQr ? 'Preparing image…' : '🖼️ Download Branded QR Card'}
                  </button>

                  <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: '1.5rem' }}>
                    You can revisit this anytime in your <Link href="/profile" style={{ textDecoration: 'underline', color: 'var(--accent-primary)' }}>Dashboard</Link>.
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-muted" style={{ fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>READY TO SEND?</p>
                  <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Give it a little courage.</h2>
                  <p className="text-muted" style={{ marginBottom: '2rem' }}>
                    Your page stays private until you unlock it. Once unlocked, you&apos;ll get a shareable link, WhatsApp instant sender, and forever keepsake poster.
                  </p>

                  <div style={{ background: '#fff7ed', border: '1px solid #fdba74', borderRadius: '14px', padding: '1rem', marginBottom: '1.25rem' }}>
                    <p style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem' }}>Order summary</p>
                    <div style={{ display: 'grid', gap: '0.5rem', fontSize: '0.95rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>{selectedTemplate?.title || 'Interactive Greeting Note'}</span>
                        <span>₹{basePrice}</span>
                      </div>
                      {hasCustomSlug && (
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>Custom Link ({apology.custom_slug})</span>
                          <span>+₹{customLinkFee}</span>
                        </div>
                      )}
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, marginTop: '0.5rem', borderTop: '1px dashed #fdba74', paddingTop: '0.5rem' }}>
                        <span>Total amount</span>
                        <span>₹{totalBeforeCoupon}</span>
                      </div>
                    </div>
                    <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: '0.9rem' }}>
                      ✨ Includes Background Music, Wax Seal Reveal, and Forever Keepsake Poster!
                    </p>
                  </div>

                  <PayButton apologyId={apology.id} onPaid={() => setPaid(true)} displayAmount={totalBeforeCoupon} />
                  
                  <div style={{ marginTop: '1.5rem', borderTop: '2px dashed rgba(216, 30, 91, 0.25)', paddingTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                    <span style={{ fontSize: '1.2rem' }}>🔒</span>
                    <span className="text-muted" style={{ fontSize: '0.875rem' }}>Secure payment via Razorpay</span>
                  </div>
                </>
              )}
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}

function createBrandedQrImage(qrDataUrl) {
  return new Promise((resolve, reject) => {
    const qr = new Image();
    qr.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 900;
      canvas.height = 1080;
      const context = canvas.getContext('2d');
      if (!context) return reject(new Error('Could not prepare QR image.'));

      const rose = '#be185d';
      const deepRose = '#881337';
      const hotPink = '#f43f5e';
      context.fillStyle = '#fffdfd';
      context.fillRect(0, 0, canvas.width, canvas.height);

      // Soft rosy glow behind the card.
      const glow = context.createRadialGradient(450, 500, 100, 450, 500, 520);
      glow.addColorStop(0, 'rgba(251, 207, 232, .7)');
      glow.addColorStop(1, 'rgba(255, 253, 253, 0)');
      context.fillStyle = glow;
      context.fillRect(0, 0, canvas.width, canvas.height);

      context.textAlign = 'center';
      context.fillStyle = deepRose;
      context.font = '700 34px Arial, sans-serif';
      context.fillText('♥  LOVELYCRAFTS', 450, 94);

      // Rounded outer scan frame.
      roundedRect(context, 155, 150, 590, 590, 44);
      context.fillStyle = '#fff7fa';
      context.fill();
      context.lineWidth = 5;
      context.strokeStyle = hotPink;
      context.stroke();
      roundedRect(context, 177, 172, 546, 546, 28);
      context.lineWidth = 8;
      context.strokeStyle = '#fce7f3';
      context.stroke();

      // Directional corner marks + heart seal.
      context.strokeStyle = hotPink;
      context.lineWidth = 7;
      context.beginPath(); context.moveTo(145, 236); context.lineTo(145, 170); context.lineTo(211, 170); context.stroke();
      context.beginPath(); context.moveTo(755, 655); context.lineTo(755, 721); context.lineTo(689, 721); context.stroke();
      context.fillStyle = hotPink;
      context.beginPath(); context.arc(748, 162, 39, 0, Math.PI * 2); context.fill();
      context.fillStyle = '#fff'; context.font = '700 31px Arial, sans-serif'; context.fillText('♥', 748, 173);
      context.font = '700 54px Arial, sans-serif'; context.fillStyle = hotPink; context.fillText('↘', 155, 703);

      context.drawImage(qr, 205, 200, 490, 490);
      context.fillStyle = rose;
      context.font = '700 34px Arial, sans-serif';
      context.fillText('Scan to open', 450, 838);
      context.font = '400 28px Arial, sans-serif';
      context.fillStyle = '#9d174d';
      context.fillText('a moment made just for them', 450, 883);
      context.font = '400 22px Arial, sans-serif';
      context.fillStyle = '#be185d';
      context.fillText('lovelycrafts.in', 450, 970);
      resolve(canvas.toDataURL('image/png'));
    };
    qr.onerror = () => reject(new Error('Could not load QR image.'));
    qr.src = qrDataUrl;
  });
}

function roundedRect(context, x, y, width, height, radius) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.arcTo(x + width, y, x + width, y + height, radius);
  context.arcTo(x + width, y + height, x, y + height, radius);
  context.arcTo(x, y + height, x, y, radius);
  context.arcTo(x, y, x + width, y, radius);
  context.closePath();
}
