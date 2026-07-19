import crypto from 'node:crypto';
import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';

export async function POST(request) {
  try {
    const adminDb = getAdminDb();
    const { apologyId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json();
    
    const expected = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');
      
    if (expected !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid payment signature.' }, { status: 400 });
    }
    
    const ref = adminDb.collection('apologies').doc(apologyId);
    const snap = await ref.get();
    
    if (!snap.exists) {
      return NextResponse.json({ error: 'Apology not found.' }, { status: 404 });
    }
    
    const created = snap.data().created_at?.toDate?.() || new Date();
    
    await ref.update({
      is_paid: true,
      expires_at: Timestamp.fromDate(new Date(created.getTime() + 15 * 24 * 60 * 60 * 1000)),
      razorpay_order_id,
      razorpay_payment_id,
      paid_at: FieldValue.serverTimestamp()
    });
    
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Unable to verify payment.' }, { status: 500 });
  }
}
