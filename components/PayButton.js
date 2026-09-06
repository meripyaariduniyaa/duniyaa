'use client';

import Script from 'next/script';
import { useState } from 'react';

export default function PayButton({ apologyId, onPaid, displayAmount }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [feedback, setFeedback] = useState('');

  // After coupon is applied, we store the resolved order details here
  const [resolvedOrder, setResolvedOrder] = useState(null);

  const basePrice = displayAmount || 199;

  /* ── Step 1: Validate coupon & preview final price ── */
  async function applyCoupon() {
    if (!couponCode.trim()) return;
    setBusy(true);
    setError('');
    setFeedback('');
    setResolvedOrder(null);

    try {
      const res = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apologyId, couponCode: couponCode.trim() })
      });
      const order = await res.json();

      if (!res.ok || order.invalidCoupon) {
        setError(order.error || 'Could not validate coupon.');
        return;
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

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '16px' }}>

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
              onClick={applyCoupon}
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
