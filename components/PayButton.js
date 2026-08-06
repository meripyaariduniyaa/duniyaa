'use client';

import Script from 'next/script';
import { useState } from 'react';

export default function PayButton({ apologyId, onPaid }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [feedback, setFeedback] = useState('');

  async function pay() {
    setBusy(true);
    setError('');
    setFeedback('');

    try {
      const orderResponse = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apologyId, couponCode: couponCode.trim() })
      });
      const order = await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error(order.error || 'Could not start payment.');
      }

      if (order.free) {
        const verify = await fetch('/api/razorpay/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ apologyId, couponCode: couponCode.trim(), free: true, amount: order.amount })
        });

        if (!verify.ok) {
          const verifyData = await verify.json().catch(() => ({}));
          throw new Error(verifyData.error || 'Coupon verification failed.');
        }

        setFeedback(order.message || 'Coupon applied. Your link is unlocked.');
        onPaid();
        return;
      }

      setFeedback(order.message || 'Coupon applied.');

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
              discountPercent: order.discountPercent || 0,
              amountPaid: order.amount,
              ...response
            })
          });

          if (!verify.ok) {
            const verifyData = await verify.json().catch(() => ({}));
            throw new Error(verifyData.error || 'Payment verification failed.');
          }

          onPaid();
        }
      });

      razorpay.on('payment.failed', (response) => setError(response.error?.description || 'Payment failed.'));
      razorpay.open();
    } catch (e) {
      setError(e.message || 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '16px' }}>
        <input
          className="form-input"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          placeholder="Enter coupon code"
          style={{ fontSize: '0.95rem' }}
        />
        <button className="btn-primary w-full" onClick={pay} disabled={busy}>
          {busy ? 'Unlocking…' : couponCode.trim() ? 'Apply coupon & unlock' : 'Pay ₹99 & unlock link'}
        </button>
      </div>
      {feedback && <p style={{ color: '#166534', marginTop: '0.75rem', fontSize: '0.875rem' }}>{feedback}</p>}
      {error && <p style={{ color: 'red', marginTop: '0.75rem', fontSize: '0.875rem' }}>{error}</p>}
    </>
  );
}
