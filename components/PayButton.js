'use client';

import Script from 'next/script';
import { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';

export default function PayButton({ apologyId, onPaid }) {
  const { user } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function pay() {
    setBusy(true); setError('');
    try {
      const token = await user.getIdToken();
      const orderResponse = await fetch('/api/razorpay/create-order', { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ apologyId }) });
      const order = await orderResponse.json();
      if (!orderResponse.ok) throw new Error(order.error || 'Could not start payment.');
      const razorpay = new window.Razorpay({
        key: order.keyId, amount: order.amount, currency: order.currency, name: 'Note Retro', description: 'A private link', order_id: order.orderId, handler: async (response) => {
          const verify = await fetch('/api/razorpay/verify', { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ apologyId, ...response }) });
          if (!verify.ok) throw new Error('Payment verification failed.');
          onPaid();
        }
      });
      razorpay.on('payment.failed', (response) => setError(response.error?.description || 'Payment failed.'));
      razorpay.open();
    } catch (e) { setError(e.message); } finally { setBusy(false); }
  }

  return <><Script src="https://checkout.razorpay.com/v1/checkout.js" /><button className="btn-primary full" onClick={pay} disabled={busy} style={{ marginTop: '16px' }}>{busy ? 'Unlocking…' : 'Pay ₹1 & unlock link'}</button>{error && <p className="error-text">{error}</p>}</>;
}
