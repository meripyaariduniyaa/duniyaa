import { NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { getAdminDb } from '@/lib/firebase-admin';
import { requireAdmin } from '@/lib/creator-auth';

export async function GET(request) {
  try {
    await requireAdmin(request);
    const db = getAdminDb();
    const snap = await db.collection('commissions').orderBy('created_at', 'desc').limit(300).get();

    const commissions = snap.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        created_at: data.created_at?.toDate?.()?.toISOString() || (typeof data.created_at === 'string' ? data.created_at : null),
        updated_at: data.updated_at?.toDate?.()?.toISOString() || (typeof data.updated_at === 'string' ? data.updated_at : null),
        paid_at: data.paid_at?.toDate?.()?.toISOString() || (typeof data.paid_at === 'string' ? data.paid_at : null),
      };
    });

    return NextResponse.json({ commissions });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Admin access required.' }, { status: 403 });
  }
}

export async function POST(request) {
  try {
    await requireAdmin(request);
    const db = getAdminDb();

    // 1. Fetch all paid orders, existing commissions, coupons, creators, and payouts
    const [ordersSnap, commissionsSnap, couponsSnap, creatorsSnap, payoutsSnap] = await Promise.all([
      db.collection('orders').where('payment_status', '==', 'paid').get(),
      db.collection('commissions').get(),
      db.collection('coupons').get(),
      db.collection('creators').get(),
      db.collection('payouts').get(),
    ]);

    const existingCommOrderIds = new Set();
    const existingCommNoteIds = new Set();
    const commissionsMap = new Map();

    commissionsSnap.docs.forEach((doc) => {
      const data = doc.data();
      commissionsMap.set(doc.id, { id: doc.id, ref: doc.ref, ...data });
      if (data.order_id) existingCommOrderIds.add(data.order_id);
      if (data.note_id) existingCommNoteIds.add(data.note_id);
    });

    const couponsMap = new Map(); // normalizedCode -> couponData
    couponsSnap.docs.forEach((doc) => {
      const c = doc.data();
      if (c.code) couponsMap.set(c.code.toUpperCase().trim(), { id: doc.id, ...c });
    });

    const creatorsMap = new Map(); // creatorId -> creatorData
    creatorsSnap.docs.forEach((doc) => {
      creatorsMap.set(doc.id, { id: doc.id, ...doc.data() });
    });

    let syncedCount = 0;

    // A. Create commissions for orders that didn't have one
    for (const orderDoc of ordersSnap.docs) {
      const order = orderDoc.data();
      const orderId = orderDoc.id;
      const noteId = order.note_id;

      if (existingCommOrderIds.has(orderId) || (noteId && existingCommNoteIds.has(noteId))) {
        continue;
      }

      let creatorId = order.creator_id;
      if (!creatorId && order.coupon_code) {
        const coupon = couponsMap.get(order.coupon_code.toUpperCase().trim());
        if (coupon?.creator_id) {
          creatorId = coupon.creator_id;
          await orderDoc.ref.update({
            creator_id: creatorId,
            coupon_id: coupon.id,
            updated_at: FieldValue.serverTimestamp(),
          });
        }
      }

      if (creatorId && creatorsMap.has(creatorId)) {
        const creatorData = creatorsMap.get(creatorId);
        const amountPaid = order.final_amount || 0;

        if (amountPaid > 0) {
          const { calculateEffectiveTierAndRate, commissionForAmount } = await import('@/lib/creator-club');
          const { commissionRate } = calculateEffectiveTierAndRate(creatorData, 1);
          const commissionAmount = commissionForAmount(amountPaid, commissionRate);

          if (commissionAmount > 0) {
            const commRef = db.collection('commissions').doc();
            const newCommData = {
              order_id: orderId,
              note_id: noteId || null,
              creator_id: creatorId,
              commission_rate: commissionRate,
              order_amount: amountPaid,
              commission_amount: commissionAmount,
              status: 'pending',
              created_at: order.paid_at || order.created_at || FieldValue.serverTimestamp(),
              updated_at: FieldValue.serverTimestamp(),
            };
            await commRef.set(newCommData);
            commissionsMap.set(commRef.id, { id: commRef.id, ref: commRef, ...newCommData });
            syncedCount++;
          }
        }
      }
    }

    // B. Reconcile past payouts with commissions
    let reconciledCount = 0;
    const batch = db.batch();
    let hasBatchOps = false;

    for (const payoutDoc of payoutsSnap.docs) {
      const payout = payoutDoc.data();
      const payoutId = payoutDoc.id;
      if (payout.status !== 'paid') continue;

      const payoutTime = payout.paid_at || payout.created_at || FieldValue.serverTimestamp();
      const commissionIds = Array.isArray(payout.commission_ids) ? payout.commission_ids : [];

      // 1. Explicit commission_ids linked in payout
      if (commissionIds.length > 0) {
        for (const commId of commissionIds) {
          const comm = commissionsMap.get(commId);
          if (comm && (comm.status !== 'paid' || !comm.payout_id)) {
            batch.update(db.collection('commissions').doc(commId), {
              status: 'paid',
              payout_id: payoutId,
              paid_at: payoutTime,
              updated_at: FieldValue.serverTimestamp(),
            });
            comm.status = 'paid';
            comm.payout_id = payoutId;
            reconciledCount++;
            hasBatchOps = true;
          }
        }
      } else if (payout.creator_id) {
        // 2. Payout recorded for a creator without explicit commission_ids:
        // Automatically reconcile pending commissions for this creator created on or before the payout
        const creatorComms = Array.from(commissionsMap.values()).filter(
          (c) => c.creator_id === payout.creator_id && c.status === 'pending'
        );

        for (const comm of creatorComms) {
          batch.update(db.collection('commissions').doc(comm.id), {
            status: 'paid',
            payout_id: payoutId,
            paid_at: payoutTime,
            updated_at: FieldValue.serverTimestamp(),
          });
          comm.status = 'paid';
          comm.payout_id = payoutId;
          reconciledCount++;
          hasBatchOps = true;
        }
      }
    }

    if (hasBatchOps) {
      await batch.commit();
    }

    return NextResponse.json({ ok: true, syncedCount, reconciledCount });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to sync and reconcile commissions.' }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    await requireAdmin(request);
    const { id, status, notes } = await request.json();
    if (!id) return NextResponse.json({ error: 'Commission ID is required.' }, { status: 400 });

    const db = getAdminDb();
    const ref = db.collection('commissions').doc(id);
    const snap = await ref.get();
    if (!snap.exists) return NextResponse.json({ error: 'Commission not found.' }, { status: 404 });

    const update = { updated_at: FieldValue.serverTimestamp() };
    if (status) {
      update.status = status;
      if (status === 'paid') {
        update.paid_at = FieldValue.serverTimestamp();
      } else if (status === 'pending') {
        update.paid_at = null;
        update.payout_id = null;
      }
    }
    if (notes !== undefined) update.notes = notes;

    await ref.update(update);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Could not update commission.' }, { status: 403 });
  }
}
