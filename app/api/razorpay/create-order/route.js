import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { getAdminDb } from '@/lib/firebase-admin';

const couponRules = {
  [process.env.COUPON_FULL_DISCOUNT || '']: { percent: 100, label: 'Full discount' },
  [process.env.COUPON_HALF_DISCOUNT || '']: { percent: 50, label: '50% discount' }
};

export async function POST(request) {
  try {
    const adminDb = getAdminDb();
    const { apologyId, couponCode } = await request.json();

    const snap = await adminDb.collection('apologies').doc(apologyId).get();
    if (!snap.exists) return NextResponse.json({ error: 'Apology not found.' }, { status: 404 });

    const normalizedCode = (couponCode || '').trim();
    const selectedCoupon = normalizedCode ? couponRules[normalizedCode] : null;
    const baseAmount = 9900;

    if (selectedCoupon?.percent === 100) {
      return NextResponse.json({
        free: true,
        amount: 0,
        currency: 'INR',
        couponApplied: true,
        discountPercent: 100,
        message: 'Coupon applied. Your note is unlocked for free.'
      });
    }

    if (selectedCoupon?.percent === 50) {
      const discountedAmount = Math.round(baseAmount * 0.5);
      const razorpay = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
      const order = await razorpay.orders.create({
        amount: discountedAmount,
        currency: 'INR',
        receipt: apologyId,
        notes: { apologyId, uid: snap.data().creator_uid, couponCode: normalizedCode }
      });

      return NextResponse.json({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        couponApplied: true,
        discountPercent: 50,
        message: '50% coupon applied.'
      });
    }

    if (normalizedCode) {
      return NextResponse.json({ error: 'Invalid coupon code.' }, { status: 400 });
    }

    const razorpay = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
    const order = await razorpay.orders.create({
      amount: baseAmount,
      currency: 'INR',
      receipt: apologyId,
      notes: { apologyId, uid: snap.data().creator_uid }
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      couponApplied: false,
      discountPercent: 0,
      message: 'No coupon applied.' 
    });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Unable to create order.' }, { status: 500 });
  }
}
