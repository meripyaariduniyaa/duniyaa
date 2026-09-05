import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { getAdminDb } from '@/lib/firebase-admin';
import { getCouponRule } from '@/lib/coupons';

export async function POST(request) {
  try {
    const adminDb = getAdminDb();
    const { apologyId, couponCode } = await request.json();

    const snap = await adminDb.collection('notes').doc(apologyId).get();
    if (!snap.exists) return NextResponse.json({ error: 'Note not found.' }, { status: 404 });

    const raw = snap.data();
    const normalizedCode = (couponCode || '').trim().toLowerCase();
    const selectedCoupon = normalizedCode ? getCouponRule(normalizedCode) : null;
    const customLinkSurcharge = raw.custom_slug ? 2900 : 0; // ₹29 for custom links
    const baseAmount = 19900; // ₹199 base note price
    const totalAmount = baseAmount + customLinkSurcharge;

    if (selectedCoupon) {
      const discountPercent = Math.min(100, Math.max(1, selectedCoupon.percent));

      if (discountPercent === 100) {
        return NextResponse.json({
          free: true,
          amount: 0,
          currency: 'INR',
          couponApplied: true,
          discountPercent: 100,
          message: `${selectedCoupon.label || '100% Coupon applied'}! Entire order (including custom link) is unlocked for free.`
        });
      }

      const discountRatio = discountPercent / 100;
      const discountedAmount = Math.max(100, Math.round(totalAmount * (1 - discountRatio))); // Amount in paise
      const razorpay = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
      const order = await razorpay.orders.create({
        amount: discountedAmount,
        currency: 'INR',
        receipt: apologyId,
        notes: {
          apologyId,
          uid: raw.creator_uid,
          couponCode: selectedCoupon.code || normalizedCode,
          customLinkSurcharge,
          discountPercent
        }
      });

      return NextResponse.json({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        couponApplied: true,
        discountPercent,
        message: `✅ ${selectedCoupon.label || `${discountPercent}% discount applied`}! You pay ₹${(discountedAmount / 100).toFixed(0)} instead of ₹${(totalAmount / 100).toFixed(0)}.`
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
