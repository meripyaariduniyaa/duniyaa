import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { getAdminDb } from '@/lib/firebase-admin';

const couponRules = {
  ...(process.env.COUPON_FULL_DISCOUNT
    ? { [String(process.env.COUPON_FULL_DISCOUNT).trim().toLowerCase()]: { percent: 100, label: 'Full discount' } }
    : {}),
  ...(process.env.COUPON_HALF_DISCOUNT
    ? { [String(process.env.COUPON_HALF_DISCOUNT).trim().toLowerCase()]: { percent: 50, label: '50% discount' } }
    : {}),
  new2026: { percent: 50, label: 'Launch 50% off' }
};

export async function POST(request) {
  try {
    const adminDb = getAdminDb();
    const { apologyId, couponCode } = await request.json();

    const snap = await adminDb.collection('notes').doc(apologyId).get();
    if (!snap.exists) return NextResponse.json({ error: 'Note not found.' }, { status: 404 });

    const raw = snap.data();
    const normalizedCode = (couponCode || '').trim().toLowerCase();
    const selectedCoupon = normalizedCode ? couponRules[normalizedCode] : null;
    const customLinkSurcharge = raw.custom_slug ? 2900 : 0; // ₹29 for custom links
    const baseAmount = 19900; // ₹199 base note price
    const totalAmount = baseAmount + customLinkSurcharge;

    if (selectedCoupon?.percent === 100) {
      return NextResponse.json({
        free: true,
        amount: 0,
        currency: 'INR',
        couponApplied: true,
        discountPercent: 100,
        message: '100% Coupon applied! Entire order (including custom link) is unlocked for free.'
      });
    }

    if (selectedCoupon?.percent === 50) {
      const discountedAmount = Math.round(totalAmount * 0.5);
      const razorpay = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
      const order = await razorpay.orders.create({
        amount: discountedAmount,
        currency: 'INR',
        receipt: apologyId,
        notes: { apologyId, uid: raw.creator_uid, couponCode: normalizedCode, customLinkSurcharge }
      });

      return NextResponse.json({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        couponApplied: true,
        discountPercent: 50,
        message: `50% coupon applied! You pay ₹${discountedAmount / 100} instead of ₹${totalAmount / 100}.`
      });
    }

    if (normalizedCode) {
      return NextResponse.json({ invalidCoupon: true, error: 'Invalid coupon code. Please check and try again.' }, { status: 200 });
    }

    const razorpay = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
    const order = await razorpay.orders.create({
      amount: totalAmount,
      currency: 'INR',
      receipt: apologyId,
      notes: { apologyId, uid: raw.creator_uid, customLinkSurcharge }
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
