import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { getAdminDb } from '@/lib/firebase-admin';
import { resolveCoupon } from '@/lib/coupons';
import { verifyReferral } from '@/lib/referral-crypto';

export async function POST(request) {
  try {
    const adminDb = getAdminDb();
    const { apologyId, couponCode } = await request.json();

    const snap = await adminDb.collection('notes').doc(apologyId).get();
    if (!snap.exists) return NextResponse.json({ error: 'Note not found.' }, { status: 404 });

    const raw = snap.data();
    const customLinkSurcharge = raw.custom_slug ? 2900 : 0; // ₹29 for custom links
    const baseAmount = 19900; // ₹199 base note price
    const totalAmount = baseAmount + customLinkSurcharge;
    const templateId = raw.template || null;

    // Check referral cookie from request
    const refCookie = request.cookies.get('lc_ref')?.value;
    const refData = verifyReferral(refCookie);
    let attributedCreatorId = refData?.creatorId || null;
    let attributionSource = attributedCreatorId ? 'referral_link' : null;

    let appliedCoupon = null;
    if (couponCode && String(couponCode).trim()) {
      const couponResult = await resolveCoupon(couponCode, {
        db: adminDb,
        templateId,
        orderAmountPaise: totalAmount,
        creatorUserId: raw.creator_uid,
      });

      if (!couponResult.valid) {
        return NextResponse.json({ invalidCoupon: true, error: couponResult.error }, { status: 200 });
      }

      appliedCoupon = couponResult;

      // Creator coupon takes highest precedence over referral link
      if (appliedCoupon.creator_id) {
        attributedCreatorId = appliedCoupon.creator_id;
        attributionSource = 'coupon';
      }
    }

    if (appliedCoupon) {
      const discountPercent = appliedCoupon.percent;

      if (discountPercent === 100) {
        return NextResponse.json({
          free: true,
          amount: 0,
          currency: 'INR',
          couponApplied: true,
          discountPercent: 100,
          couponCode: appliedCoupon.code,
          couponId: appliedCoupon.id || null,
          creatorId: attributedCreatorId,
          attributionSource,
          message: `${appliedCoupon.label || '100% Coupon applied'}! Entire order (including custom link) is unlocked for free.`
        });
      }

      const discountRatio = discountPercent / 100;
      const discountedAmount = Math.max(100, Math.round(totalAmount * (1 - discountRatio))); // Amount in paise
      const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
        key_secret: process.env.RAZORPAY_KEY_SECRET || 'rzp_secret_placeholder',
      });

      const order = await razorpay.orders.create({
        amount: discountedAmount,
        currency: 'INR',
        receipt: apologyId,
        notes: {
          apologyId,
          uid: raw.creator_uid || '',
          couponCode: appliedCoupon.code || '',
          couponId: appliedCoupon.id || '',
          creatorId: attributedCreatorId || '',
          attributionSource: attributionSource || 'none',
          customLinkSurcharge,
          discountPercent,
          baseAmount,
          finalAmount: discountedAmount,
        }
      });

      return NextResponse.json({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        couponApplied: true,
        couponCode: appliedCoupon.code,
        couponId: appliedCoupon.id || null,
        creatorId: attributedCreatorId,
        attributionSource,
        discountPercent,
        message: `✅ ${appliedCoupon.label || `${discountPercent}% discount applied`}! You pay ₹${(discountedAmount / 100).toFixed(0)} instead of ₹${(totalAmount / 100).toFixed(0)}.`
      });
    }

    // No coupon applied
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
      key_secret: process.env.RAZORPAY_KEY_SECRET || 'rzp_secret_placeholder',
    });

    const order = await razorpay.orders.create({
      amount: totalAmount,
      currency: 'INR',
      receipt: apologyId,
      notes: {
        apologyId,
        uid: raw.creator_uid || '',
        creatorId: attributedCreatorId || '',
        attributionSource: attributionSource || 'none',
        customLinkSurcharge,
        discountPercent: 0,
        baseAmount,
        finalAmount: totalAmount,
      }
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      couponApplied: false,
      couponCode: null,
      couponId: null,
      creatorId: attributedCreatorId,
      attributionSource,
      discountPercent: 0,
      message: 'No coupon applied.' 
    });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Unable to create order.' }, { status: 500 });
  }
}

