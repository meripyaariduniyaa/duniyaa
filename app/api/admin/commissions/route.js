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
        created_at: data.created_at?.toDate?.()?.toISOString() || null,
        updated_at: data.updated_at?.toDate?.()?.toISOString() || null,
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

    // 1. Fetch all paid orders and existing commissions
    const [ordersSnap, commissionsSnap, couponsSnap, creatorsSnap] = await Promise.all([
      db.collection('orders').where('payment_status', '==', 'paid').get(),
      db.collection('commissions').get(),
      db.collection('coupons').get(),
      db.collection('creators').get(),
    ]);

    const existingCommOrderIds = new Set();
    const existingCommNoteIds = new Set();
    commissionsSnap.docs.forEach((doc) => {
      const data = doc.data();
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
            await commRef.set({
              order_id: orderId,
              note_id: noteId || null,
              creator_id: creatorId,
              commission_rate: commissionRate,
              order_amount: amountPaid,
              commission_amount: commissionAmount,
              status: 'pending',
              created_at: order.paid_at || order.created_at || FieldValue.serverTimestamp(),
              updated_at: FieldValue.serverTimestamp(),
            });
            syncedCount++;
          }
        }
      }
    }

    return NextResponse.json({ ok: true, syncedCount });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to sync commissions.' }, { status: 500 });
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
    if (status) update.status = status;
    if (notes !== undefined) update.notes = notes;

    await ref.update(update);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Could not update commission.' }, { status: 403 });
  }
}
