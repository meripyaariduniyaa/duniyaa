import { NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { getAdminDb } from '@/lib/firebase-admin';
import { requireAdmin } from '@/lib/creator-auth';

export async function GET(request) {
  try {
    await requireAdmin(request);
    const db = getAdminDb();
    const snap = await db.collection('payouts').orderBy('created_at', 'desc').limit(100).get();

    const payouts = snap.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        created_at: data.created_at?.toDate?.()?.toISOString() || null,
        paid_at: data.paid_at?.toDate?.()?.toISOString() || null,
      };
    });

    return NextResponse.json({ payouts });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Admin access required.' }, { status: 403 });
  }
}

export async function POST(request) {
  try {
    const admin = await requireAdmin(request);
    const body = await request.json();
    const { creator_id, amount, method, reference, notes, commission_ids } = body;

    if (!creator_id || !amount || Number(amount) <= 0) {
      return NextResponse.json({ error: 'Creator ID and a valid positive amount are required.' }, { status: 400 });
    }

    const db = getAdminDb();
    const payoutRef = db.collection('payouts').doc();
    const batch = db.batch();

    const payoutData = {
      creator_id,
      amount: Number(amount),
      method: method || 'UPI',
      reference: reference || '',
      notes: notes || '',
      commission_ids: Array.isArray(commission_ids) ? commission_ids : [],
      status: 'paid',
      created_by: admin.email,
      created_at: FieldValue.serverTimestamp(),
      paid_at: FieldValue.serverTimestamp(),
    };

    batch.set(payoutRef, payoutData);

    // If commission IDs provided, update their status to paid and link payout_id
    if (Array.isArray(commission_ids) && commission_ids.length > 0) {
      for (const commId of commission_ids) {
        batch.update(db.collection('commissions').doc(commId), {
          status: 'paid',
          payout_id: payoutRef.id,
          updated_at: FieldValue.serverTimestamp(),
        });
      }
    }

    await batch.commit();
    return NextResponse.json({ ok: true, id: payoutRef.id });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Could not record payout.' }, { status: 403 });
  }
}
