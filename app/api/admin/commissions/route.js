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
