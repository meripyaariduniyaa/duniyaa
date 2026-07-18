import { NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { getAdminDb } from '@/lib/firebase-admin';

export async function POST(request) {
  if (process.env.NODE_ENV === 'production' || process.env.ENABLE_MOCK_PAYMENT !== 'true') {
    return NextResponse.json({ error: 'Mock payments are disabled.' }, { status: 404 });
  }
  try {
    const bearer = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!bearer) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });
    const adminDb = getAdminDb();
    const decoded = await getAuth().verifyIdToken(bearer);
    const { apologyId } = await request.json();
    const ref = adminDb.collection('apologies').doc(apologyId);
    const snap = await ref.get();
    if (!snap.exists || snap.data().creator_uid !== decoded.uid) return NextResponse.json({ error: 'Apology not found.' }, { status: 404 });
    const created = snap.data().created_at?.toDate?.() || new Date();
    await ref.update({ is_paid: true, expires_at: Timestamp.fromDate(new Date(created.getTime() + 15 * 24 * 60 * 60 * 1000)), paid_at: FieldValue.serverTimestamp(), payment_mode: 'local_mock' });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Mock payment failed.' }, { status: 500 });
  }
}
