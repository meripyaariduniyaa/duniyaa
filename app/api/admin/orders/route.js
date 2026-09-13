import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';
import { requireAdmin } from '@/lib/creator-auth';

export async function GET(request) {
  try {
    await requireAdmin(request);
    const db = getAdminDb();
    const [ordersSnap, vaultSnap] = await Promise.all([
      db.collection('orders').orderBy('created_at', 'desc').limit(200).get().catch(() => ({ docs: [] })),
      db.collection('admin_payment_ledger').orderBy('created_at', 'desc').limit(200).get().catch(() => ({ docs: [] })),
    ]);

    const orderMap = new Map();

    const processDoc = (doc) => {
      const data = doc.data();
      const id = doc.id;
      if (!orderMap.has(id)) {
        orderMap.set(id, {
          id,
          ...data,
          created_at: data.created_at?.toDate?.()?.toISOString?.() || (typeof data.created_at === 'string' ? data.created_at : null),
          paid_at: data.paid_at?.toDate?.()?.toISOString?.() || (typeof data.paid_at === 'string' ? data.paid_at : null),
        });
      }
    };

    vaultSnap.docs.forEach(processDoc);
    ordersSnap.docs.forEach(processDoc);

    const orders = Array.from(orderMap.values()).sort((a, b) => {
      const timeA = new Date(a.created_at || a.paid_at || 0).getTime();
      const timeB = new Date(b.created_at || b.paid_at || 0).getTime();
      return timeB - timeA;
    });

    return NextResponse.json({ orders });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Admin access required.' }, { status: 403 });
  }
}
