import crypto from 'node:crypto';
import { NextResponse } from 'next/server';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { getAdminDb } from '@/lib/firebase-admin';
import { calculateEffectiveTierAndRate, commissionForAmount, normalizeCode } from '@/lib/creator-club';

export async function POST(request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-razorpay-signature');
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    // Validate webhook signature if secret is configured
    if (webhookSecret && signature) {
      const expected = crypto.createHmac('sha256', webhookSecret).update(rawBody).digest('hex');
      if (expected !== signature) {
        return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
      }
    }

    let payload;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }

    const event = payload.event;
    const adminDb = getAdminDb();

    // 1. Payment Captured / Order Paid Event (Idempotent)
    if (event === 'payment.captured' || event === 'order.paid') {
      const payment = payload.payload?.payment?.entity || {};
      const notes = payment.notes || payload.payload?.order?.entity?.notes || {};
      const apologyId = notes.apologyId || payment.receipt;
      const razorpay_order_id = payment.order_id || payload.payload?.order?.entity?.id;
      const razorpay_payment_id = payment.id;
      const amountPaid = payment.amount || payload.payload?.order?.entity?.amount || 0;
      const couponCode = notes.couponCode ? normalizeCode(notes.couponCode) : null;
      const couponId = notes.couponId || null;
      const creatorId = notes.creatorId || null;
      const attributionSource = notes.attributionSource || null;
      const discountPercent = Number(notes.discountPercent) || 0;

      if (!apologyId) {
        return NextResponse.json({ status: 'ignored', message: 'No apologyId in notes' });
      }

      // Check if note is already marked paid
      const noteRef = adminDb.collection('notes').doc(apologyId);
      const noteSnap = await noteRef.get();
      if (!noteSnap.exists) {
        return NextResponse.json({ status: 'ignored', message: 'Note not found' });
      }

      // Check if order already recorded in 'orders' collection
      let orderSnap = await adminDb.collection('orders').where('note_id', '==', apologyId).limit(1).get();
      if (orderSnap.empty && razorpay_payment_id) {
        orderSnap = await adminDb.collection('orders').where('razorpay_payment_id', '==', razorpay_payment_id).limit(1).get();
      }

      const noteData = noteSnap.data();
      const created = noteData.created_at?.toDate?.() || new Date();

      if (!noteData.is_paid) {
        await noteRef.update({
          is_paid: true,
          expires_at: Timestamp.fromDate(new Date(created.getTime() + 90 * 24 * 60 * 60 * 1000)),
          razorpay_order_id: razorpay_order_id || null,
          razorpay_payment_id: razorpay_payment_id || null,
          coupon_code: couponCode,
          discount_percent: discountPercent,
          amount_paid: amountPaid,
          payment_method: 'razorpay',
          paid_at: FieldValue.serverTimestamp(),
        });
      }

      let orderId = null;
      if (orderSnap.empty) {
        const newOrderRef = adminDb.collection('orders').doc();
        orderId = newOrderRef.id;

        await newOrderRef.set({
          note_id: apologyId,
          customer_uid: noteData.creator_uid || null,
          template_id: noteData.template || 'proposal',
          creator_id: creatorId || null,
          coupon_code: couponCode,
          coupon_id: couponId,
          discount_percent: discountPercent,
          final_amount: amountPaid,
          payment_method: 'razorpay',
          payment_status: 'paid',
          razorpay_order_id: razorpay_order_id || null,
          razorpay_payment_id: razorpay_payment_id || null,
          attribution_source: attributionSource || (creatorId ? (couponCode ? 'coupon' : 'referral_link') : null),
          created_at: FieldValue.serverTimestamp(),
          paid_at: FieldValue.serverTimestamp(),
        });

        // Increment coupon usage
        if (couponId) {
          try {
            await adminDb.collection('coupons').doc(couponId).update({
              usage_count: FieldValue.increment(1),
              updated_at: FieldValue.serverTimestamp(),
            });
          } catch {}
        } else if (couponCode) {
          try {
            const cSnap = await adminDb.collection('coupons').where('code', '==', couponCode).limit(1).get();
            if (!cSnap.empty) {
              await cSnap.docs[0].ref.update({
                usage_count: FieldValue.increment(1),
                updated_at: FieldValue.serverTimestamp(),
              });
            }
          } catch {}
        }

        // Creator attribution
        if (creatorId && amountPaid > 0) {
          const creatorRef = adminDb.collection('creators').doc(creatorId);
          const creatorSnap = await creatorRef.get();
          if (creatorSnap.exists) {
            const creatorData = creatorSnap.data();
            const allPaidOrdersSnap = await adminDb.collection('orders')
              .where('creator_id', '==', creatorId)
              .where('payment_status', '==', 'paid')
              .get();
            const totalPaidOrders = allPaidOrdersSnap.size;

            const { tier, commissionRate } = calculateEffectiveTierAndRate(creatorData, totalPaidOrders);
            const commissionAmount = commissionForAmount(amountPaid, commissionRate);

            if (commissionAmount > 0) {
              const commRef = adminDb.collection('commissions').doc();
              await commRef.set({
                order_id: orderId,
                note_id: apologyId,
                creator_id: creatorId,
                commission_rate: commissionRate,
                order_amount: amountPaid,
                commission_amount: commissionAmount,
                status: 'pending',
                created_at: FieldValue.serverTimestamp(),
                updated_at: FieldValue.serverTimestamp(),
              });
            }

            if (!creatorData.tier_override && creatorData.tier !== tier.id) {
              await creatorRef.update({
                tier: tier.id,
                updated_at: FieldValue.serverTimestamp(),
              });
            }
          }
        }
      }

      return NextResponse.json({ status: 'ok', handled: true, event });
    }

    // 2. Refund Event (Reverse pending commissions)
    if (event === 'refund.processed' || event === 'payment.refunded') {
      const payment = payload.payload?.payment?.entity || {};
      const razorpay_payment_id = payment.id;
      const razorpay_order_id = payment.order_id;

      let orderQuery = null;
      if (razorpay_payment_id) {
        orderQuery = await adminDb.collection('orders').where('razorpay_payment_id', '==', razorpay_payment_id).limit(1).get();
      }
      if ((!orderQuery || orderQuery.empty) && razorpay_order_id) {
        orderQuery = await adminDb.collection('orders').where('razorpay_order_id', '==', razorpay_order_id).limit(1).get();
      }

      if (orderQuery && !orderQuery.empty) {
        const orderDoc = orderQuery.docs[0];
        await orderDoc.ref.update({
          payment_status: 'refunded',
          refunded_at: FieldValue.serverTimestamp(),
          updated_at: FieldValue.serverTimestamp(),
        });

        // Find pending commissions associated with this order and reverse them
        const commSnap = await adminDb.collection('commissions')
          .where('order_id', '==', orderDoc.id)
          .where('status', '==', 'pending')
          .get();

        const batch = adminDb.batch();
        commSnap.docs.forEach((commDoc) => {
          batch.update(commDoc.ref, {
            status: 'reversed',
            reversed_reason: 'order_refunded',
            updated_at: FieldValue.serverTimestamp(),
          });
        });

        await batch.commit();
      }

      return NextResponse.json({ status: 'ok', handled: true, event });
    }

    return NextResponse.json({ status: 'ok', ignored: true, event });
  } catch (error) {
    console.error('Razorpay Webhook Error:', error);
    return NextResponse.json({ error: error.message || 'Webhook processing failed' }, { status: 500 });
  }
}
