import crypto from 'node:crypto';
import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { calculateEffectiveTierAndRate, commissionForAmount, normalizeCode } from '@/lib/creator-club';

export async function POST(request) {
  try {
    const adminDb = getAdminDb();
    const {
      apologyId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      couponCode,
      couponId,
      creatorId,
      attributionSource,
      discountPercent,
      amountPaid,
      free,
    } = await request.json();

    const noteRef = adminDb.collection('notes').doc(apologyId);
    const noteSnap = await noteRef.get();

    if (!noteSnap.exists) {
      return NextResponse.json({ error: 'Note not found.' }, { status: 404 });
    }

    const noteData = noteSnap.data();
    const created = noteData.created_at?.toDate?.() || new Date();
    const normalizedCode = couponCode ? normalizeCode(couponCode) : null;
    const finalDiscountPercent = free === true ? 100 : Number(discountPercent) || 0;
    const finalAmountPaid = free === true ? 0 : Number(amountPaid) || 0;
    const method = free === true ? 'coupon' : 'razorpay';

    if (free !== true) {
      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return NextResponse.json({ error: 'Missing Razorpay payment data.' }, { status: 400 });
      }

      const secret = process.env.RAZORPAY_KEY_SECRET || 'rzp_secret_placeholder';
      const expected = crypto.createHmac('sha256', secret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      if (expected !== razorpay_signature) {
        return NextResponse.json({ error: 'Invalid payment signature.' }, { status: 400 });
      }
    }

    // 1. Update Note record
    await noteRef.update({
      is_paid: true,
      expires_at: Timestamp.fromDate(new Date(created.getTime() + 90 * 24 * 60 * 60 * 1000)),
      razorpay_order_id: razorpay_order_id || null,
      razorpay_payment_id: razorpay_payment_id || null,
      coupon_code: normalizedCode,
      discount_percent: finalDiscountPercent,
      amount_paid: finalAmountPaid,
      payment_method: method,
      paid_at: FieldValue.serverTimestamp(),
    });

    // 2. Create Immutable Order Snapshot
    const orderRef = adminDb.collection('orders').doc();
    const orderSnapshot = {
      note_id: apologyId,
      customer_uid: noteData.creator_uid || null,
      template_id: noteData.template || 'proposal',
      creator_id: creatorId || null,
      coupon_code: normalizedCode,
      coupon_id: couponId || null,
      discount_percent: finalDiscountPercent,
      final_amount: finalAmountPaid,
      payment_method: method,
      payment_status: 'paid',
      razorpay_order_id: razorpay_order_id || null,
      razorpay_payment_id: razorpay_payment_id || null,
      attribution_source: attributionSource || (creatorId ? (normalizedCode ? 'coupon' : 'referral_link') : null),
      created_at: FieldValue.serverTimestamp(),
      paid_at: FieldValue.serverTimestamp(),
    };

    await orderRef.set(orderSnapshot);

    // 3. Atomically increment coupon usage if coupon document ID is known or found
    let resolvedCouponDoc = null;
    if (couponId) {
      const cRef = adminDb.collection('coupons').doc(couponId);
      const cSnap = await cRef.get();
      if (cSnap.exists) {
        resolvedCouponDoc = { id: cSnap.id, ...cSnap.data() };
        await cRef.update({
          usage_count: FieldValue.increment(1),
          updated_at: FieldValue.serverTimestamp(),
        });
      }
    } else if (normalizedCode) {
      const cSnap = await adminDb.collection('coupons').where('code', '==', normalizedCode).limit(1).get();
      if (!cSnap.empty) {
        resolvedCouponDoc = { id: cSnap.docs[0].id, ...cSnap.docs[0].data() };
        await cSnap.docs[0].ref.update({
          usage_count: FieldValue.increment(1),
          updated_at: FieldValue.serverTimestamp(),
        });
      }
    }

    // 4. Mark Creator Gift claimed if coupon was a gift pass
    if (resolvedCouponDoc && resolvedCouponDoc.type === 'gift') {
      const giftSnap = await adminDb.collection('creatorGifts').where('coupon_id', '==', resolvedCouponDoc.id).limit(1).get();
      if (!giftSnap.empty) {
        await giftSnap.docs[0].ref.update({
          claimed: true,
          claimed_note_id: apologyId,
          claimed_at: FieldValue.serverTimestamp(),
        });
      }
    }

    // 5. Creator Attribution & Commission Snapshot
    if (creatorId) {
      const creatorRef = adminDb.collection('creators').doc(creatorId);
      const creatorSnap = await creatorRef.get();

      if (creatorSnap.exists) {
        const creatorData = creatorSnap.data();

        // Count total paid orders for this creator
        const allPaidOrdersSnap = await adminDb.collection('orders')
          .where('creator_id', '==', creatorId)
          .where('payment_status', '==', 'paid')
          .get();
        const totalPaidOrders = allPaidOrdersSnap.size;

        const { tier, commissionRate } = calculateEffectiveTierAndRate(creatorData, totalPaidOrders);
        const commissionAmount = commissionForAmount(finalAmountPaid, commissionRate);

        // Record pending commission only if there was a customer-paid amount > 0
        if (commissionAmount > 0) {
          const commRef = adminDb.collection('commissions').doc();
          await commRef.set({
            order_id: orderRef.id,
            note_id: apologyId,
            creator_id: creatorId,
            commission_rate: commissionRate,
            order_amount: finalAmountPaid,
            commission_amount: commissionAmount,
            status: 'pending',
            created_at: FieldValue.serverTimestamp(),
            updated_at: FieldValue.serverTimestamp(),
          });
        }

        // Recalculate and update creator's auto-tier (if not overridden by admin)
        if (!creatorData.tier_override && creatorData.tier !== tier.id) {
          await creatorRef.update({
            tier: tier.id,
            updated_at: FieldValue.serverTimestamp(),
          });
        }
      }
    }

    return NextResponse.json({ ok: true, orderId: orderRef.id });
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json({ error: error.message || 'Unable to verify payment.' }, { status: 500 });
  }
}

