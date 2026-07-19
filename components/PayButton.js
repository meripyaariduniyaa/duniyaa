'use client';

import Script from 'next/script';
import { useState } from 'react';

export default function PayButton({ apologyId, onPaid }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function pay() {
    setBusy(true);
    setError('');
    try {
      const orderResponse = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apologyId })
      });
      const order = await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error(order.error || 'Could not start payment.');
      }

      const razorpay = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'Note Retro',
        description: 'A private link',
        order_id: order.orderId,
        handler: async (response) => {
          const verify = await fetch('/api/razorpay/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ apologyId, ...response })
          });

          if (!verify.ok) throw new Error('Payment verification failed.');
          onPaid();
        }
      });

      razorpay.on('payment.failed', (response) => setError(response.error?.description || 'Payment failed.'));
      razorpay.open();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <button className="btn-primary w-full" onClick={pay} disabled={busy} style={{ marginTop: '16px' }}>
        {busy ? 'Unlocking…' : 'Pay ₹99 & unlock link'}
      </button>
      {error && <p style={{ color: 'red', marginTop: '1rem', fontSize: '0.875rem' }}>{error}</p>}
    </>
  );
}
