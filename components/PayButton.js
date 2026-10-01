'use client';

import Script from 'next/script';
import { useState, useEffect, useRef } from 'react';

export default function PayButton({ apologyId, onPaid, displayAmount, autoOfferRetention = true }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [feedback, setFeedback] = useState('');

  // After coupon is applied, we store the resolved order details here
  const [resolvedOrder, setResolvedOrder] = useState(null);

  // Organic customer 10% retention coupon state
  const [retentionCoupon, setRetentionCoupon] = useState(null);
  const [retentionSeconds, setRetentionSeconds] = useState(0);
  const [retentionDismissed, setRetentionDismissed] = useState(false);
  const [creatorReferral, setCreatorReferral] = useState(null);
  const timerRef = useRef(null);

  const basePrice = displayAmount || 199;

  /* ── Check & Fetch Organic Retention 10% Discount OR Auto-Apply Creator Referral ── */
  useEffect(() => {
    if (!apologyId) return;

    let mounted = true;
    async function checkRetentionOrReferral() {
      let localCode = null;
      if (typeof window !== 'undefined') {
        const urlParam = new URLSearchParams(window.location.search).get('coupon');
        const savedCode = localStorage.getItem('lc_saved_coupon');
        localCode = (urlParam || savedCode || '').trim();
      }

      try {
        const res = await fetch('/api/coupons/organic-retention', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ noteId: apologyId, action: 'get_or_create' })
        });
        const data = await res.json();
        if (!mounted) return;

        // Auto-apply creator referral coupon if user arrived via creator referral
        if (data.hasReferral && data.referralCoupon?.code) {
          setCreatorReferral(data.referralCoupon);
          if (typeof window !== 'undefined') {
            localStorage.setItem('lc_saved_coupon', data.referralCoupon.code);
          }
          applyCoupon(data.referralCoupon.code);
          return;
        }

        // Auto-apply previously saved coupon (e.g. from /create?coupon= or storefront)
        if (localCode) {
          applyCoupon(localCode);
          return;
        }

        // Otherwise offer standard organic retention discount if eligible
        if (autoOfferRetention && data.ok && data.eligible && data.coupon) {
          setRetentionCoupon(data.coupon);
          setRetentionSeconds(data.coupon.remaining_seconds || 900);
        }
      } catch (err) {
        console.error('Failed to load retention/referral offer:', err);
        if (localCode && mounted) {
          applyCoupon(localCode);
        }
      }
    }

    checkRetentionOrReferral();
    return () => { mounted = false; };
  }, [apologyId, autoOfferRetention]);

  /* ── Countdown Timer for Retention Offer ── */
  useEffect(() => {
    if (!retentionCoupon || retentionSeconds <= 0 || retentionDismissed) return;

    timerRef.current = setInterval(() => {
      setRetentionSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          // Disable coupon on backend once expired
          fetch('/api/coupons/organic-retention', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ noteId: apologyId, code: retentionCoupon.code, action: 'disable' })
          }).catch(() => {});
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [retentionCoupon, retentionSeconds, retentionDismissed, apologyId]);

  /* ── Dismiss retention offer & disable single-use code ── */
  const handleDismissRetention = async () => {
    setRetentionDismissed(true);
    if (retentionCoupon?.code) {
      try {
        await fetch('/api/coupons/organic-retention', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ noteId: apologyId, code: retentionCoupon.code, action: 'disable' })
        });
      } catch {}
    }
  };

  /* ── Step 1: Validate coupon & preview final price ── */
  async function applyCoupon(codeOverride) {
    const code = (typeof codeOverride === 'string' ? codeOverride : couponCode).trim();
    if (!code) return;
    setBusy(true);
    setError('');
    setFeedback('');
    setResolvedOrder(null);

    try {
      const res = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apologyId, couponCode: code })
      });
      const order = await res.json();

      if (!res.ok || order.invalidCoupon) {
        setError(order.error || 'Could not validate coupon.');
        return;
      }

      // Update coupon code input if override was used
      if (typeof codeOverride === 'string') {
        setCouponCode(codeOverride);
      }

      // Store the full order so Step 2 can use it
      setResolvedOrder(order);

      if (order.free) {
        setFeedback(order.message || `🎉 100% off! Your note is unlocked for free.`);
      } else {
        const discounted = (order.amount / 100).toFixed(0);
        const saved = (basePrice - discounted).toFixed(0);
        setFeedback(
          order.message ||
          (order.discountPercent
            ? `✅ Coupon applied! ${order.discountPercent}% off — you save ₹${saved}.`
            : '✅ Coupon applied!')
        );
      }
    } catch (e) {
      setError(e.message || 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  }

  /* ── Step 2: Proceed to payment with the resolved order ── */
  async function proceedToPay() {
    if (!resolvedOrder) return;
    setBusy(true);
    setError('');

    try {
      const order = resolvedOrder;

      // Free-coupon path
      if (order.free) {
        const verify = await fetch('/api/razorpay/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            apologyId,
            couponCode: couponCode.trim(),
            couponId: order.couponId || null,
            creatorId: order.creatorId || null,
            attributionSource: order.attributionSource || null,
            free: true,
            amount: 0
          })
        });
        if (!verify.ok) {
          const d = await verify.json().catch(() => ({}));
          throw new Error(d.error || 'Verification failed.');
        }
        onPaid();
        return;
      }

      // Paid path — open Razorpay
      const razorpay = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'Lovely Crafts',
        description: 'A private link',
        order_id: order.orderId,
        handler: async (response) => {
          const verify = await fetch('/api/razorpay/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              apologyId,
              couponCode: couponCode.trim(),
              couponId: order.couponId || null,
              creatorId: order.creatorId || null,
              attributionSource: order.attributionSource || null,
              discountPercent: order.discountPercent || 0,
              amountPaid: order.amount,
              ...response
            })
          });
          if (!verify.ok) {
            const d = await verify.json().catch(() => ({}));
            throw new Error(d.error || 'Payment verification failed.');
          }
          onPaid();
        }
      });

      razorpay.on('payment.failed', (r) =>
        setError(r.error?.description || 'Payment failed.')
      );
      razorpay.open();
    } catch (e) {
      setError(e.message || 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  }

  /* ── Direct pay (no coupon entered) ── */
  async function directPay() {
    setBusy(true);
    setError('');

    try {
      const res = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apologyId, couponCode: '' })
      });
      const order = await res.json();
      if (!res.ok) throw new Error(order.error || 'Could not start payment.');

      const razorpay = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'Lovely Crafts',
        description: 'A private link',
        order_id: order.orderId,
        handler: async (response) => {
          const verify = await fetch('/api/razorpay/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              apologyId,
              couponCode: '',
              discountPercent: 0,
              amountPaid: order.amount,
              ...response
            })
          });
          if (!verify.ok) {
            const d = await verify.json().catch(() => ({}));
            throw new Error(d.error || 'Payment verification failed.');
          }
          onPaid();
        }
      });

      razorpay.on('payment.failed', (r) =>
        setError(r.error?.description || 'Payment failed.')
      );
      razorpay.open();
    } catch (e) {
      setError(e.message || 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  }

  /* ── Determine what the "Pay Now" button should show ── */
  const payLabel = (() => {
    if (!resolvedOrder) return `Pay ₹${basePrice} & unlock link`;
    if (resolvedOrder.free) return 'Unlock for Free 🎉';
    const amount = (resolvedOrder.amount / 100).toFixed(0);
    return `Pay ₹${amount} & unlock link`;
  })();

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '16px' }}>

        {/* Creator Referral Active Badge */}
        {creatorReferral && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.12), rgba(225, 29, 72, 0.15))',
            border: '1px solid rgba(244, 63, 94, 0.35)',
            borderRadius: '12px',
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
            boxShadow: '0 4px 14px rgba(244, 63, 94, 0.08)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.1rem' }}>🎁</span>
              <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#f43f5e' }}>
                Creator Partner Discount: <strong style={{ color: '#fff' }}>{creatorReferral.creator_name || 'Creator'}</strong>
              </span>
            </div>
            <span style={{
              fontSize: '0.78rem',
              fontWeight: 800,
              color: '#fff',
              background: 'rgba(244, 63, 94, 0.28)',
              border: '1px solid rgba(244, 63, 94, 0.45)',
              padding: '2px 8px',
              borderRadius: '6px',
              fontFamily: 'monospace',
              letterSpacing: '0.04em',
            }}>
              {creatorReferral.code}
            </span>
          </div>
        )}

        {/* Organic Retention 10% Special Offer Banner */}
        {retentionCoupon && !resolvedOrder && !retentionDismissed && retentionSeconds > 0 && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.12), rgba(244, 63, 94, 0.15))',
            border: '1px solid rgba(244, 63, 94, 0.35)',
            borderRadius: '12px',
            padding: '10px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            boxShadow: '0 4px 14px rgba(244, 63, 94, 0.12)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '1.05rem' }}>🎁</span>
                <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#f43f5e' }}>
                  Special 10% Organic Discount Available!
                </span>
              </div>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#e11d48',
                background: 'rgba(244,63,94,0.18)',
                padding: '2px 8px',
                borderRadius: '6px',
                fontVariantNumeric: 'tabular-nums',
                letterSpacing: '0.02em',
              }}>
                ⏱️ {formatTimer(retentionSeconds)}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                Code: <strong style={{ color: '#fff', letterSpacing: '0.05em', fontFamily: 'monospace', background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: '4px' }}>{retentionCoupon.code}</strong> (Save 10% now)
              </span>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => applyCoupon(retentionCoupon.code)}
                  disabled={busy}
                  style={{
                    background: 'linear-gradient(135deg, #f43f5e, #e11d48)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '6px 14px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 2px 8px rgba(244, 63, 94, 0.3)',
                  }}
                >
                  {busy ? 'Applying…' : 'Claim 10% OFF'}
                </button>
                <button
                  type="button"
                  onClick={handleDismissRetention}
                  title="Dismiss and disable offer"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#64748b',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    padding: '2px 6px',
                  }}
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Coupon row */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            className="form-input"
            value={couponCode}
            onChange={(e) => { setCouponCode(e.target.value); setResolvedOrder(null); setFeedback(''); setError(''); }}
            placeholder="Have a coupon? Enter it here"
            style={{ fontSize: '0.95rem', flex: 1 }}
            onKeyDown={(e) => e.key === 'Enter' && couponCode.trim() && applyCoupon()}
          />
          {couponCode.trim() && !resolvedOrder && (
            <button
              className="btn-secondary"
              onClick={() => applyCoupon()}
              disabled={busy}
              style={{ whiteSpace: 'nowrap', padding: '0 1rem' }}
            >
              {busy ? '…' : 'Apply'}
            </button>
          )}
        </div>

        {/* Feedback / price preview */}
        {feedback && (
          <p style={{ color: '#166534', fontSize: '0.875rem', margin: 0 }}>{feedback}</p>
        )}

        {/* Final price summary card */}
        {resolvedOrder && !resolvedOrder.free && (
          <div style={{
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '10px',
            padding: '0.75rem 1rem',
            fontSize: '0.9rem',
            color: '#14532d',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>
              <del style={{ color: '#6b7280', marginRight: '0.4rem' }}>₹{basePrice}</del>
              After {resolvedOrder.discountPercent || ''}% discount
            </span>
            <strong style={{ fontSize: '1.1rem' }}>₹{(resolvedOrder.amount / 100).toFixed(0)}</strong>
          </div>
        )}

        {/* Pay Now button — always visible */}
        <button
          className="btn-primary w-full"
          onClick={resolvedOrder ? proceedToPay : directPay}
          disabled={busy}
        >
          {busy ? 'Processing…' : payLabel}
        </button>
      </div>

      {error && (
        <p style={{ color: '#dc2626', marginTop: '0.75rem', fontSize: '0.875rem' }}>{error}</p>
      )}
    </>
  );
}
