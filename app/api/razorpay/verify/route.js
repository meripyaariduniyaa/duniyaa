import crypto from 'node:crypto';
import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';

export async function POST(request) {
  try {
    const adminDb = getAdminDb();
    const { apologyId, razorpay_order_id, razorpay_payment_id, razorpay_signature, couponCode, discountPercent, amountPaid, free } = await request.json();

    const ref = adminDb.collection('notes').doc(apologyId);
    const snap = await ref.get();

    if (!snap.exists) {
      return NextResponse.json({ error: 'Note not found.' }, { status: 404 });
    }

    const created = snap.data().created_at?.toDate?.() || new Date();

    if (free === true) {
      await ref.update({
        is_paid: true,
        expires_at: Timestamp.fromDate(new Date(created.getTime() + 15 * 24 * 60 * 60 * 1000)),
        coupon_code: couponCode || null,
        discount_percent: 100,
        payment_method: 'coupon',
        paid_at: FieldValue.serverTimestamp()
      });

      return NextResponse.json({ ok: true });
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing Razorpay payment data.' }, { status: 400 });
    }

    const expected = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expected !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid payment signature.' }, { status: 400 });
    }

    await ref.update({
      is_paid: true,
      expires_at: Timestamp.fromDate(new Date(created.getTime() + 15 * 24 * 60 * 60 * 1000)),
      razorpay_order_id,
      razorpay_payment_id,
      coupon_code: couponCode || null,
      discount_percent: Number(discountPercent) || 0,
      amount_paid: Number(amountPaid) || 0,
      payment_method: 'razorpay',
      paid_at: FieldValue.serverTimestamp()
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Unable to verify payment.' }, { status: 500 });
  }
}
