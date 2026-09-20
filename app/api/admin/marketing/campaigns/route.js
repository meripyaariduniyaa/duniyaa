import { NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { getAdminDb } from '@/lib/firebase-admin';
import { requireAdmin } from '@/lib/creator-auth';

export async function GET(request) {
  try {
    await requireAdmin(request);
    const db = getAdminDb();
    const snap = await db.collection('marketing_campaigns').orderBy('created_at', 'desc').get().catch(() => ({ docs: [] }));

    const campaigns = snap.docs.map((doc) => {
      const d = doc.data();
      return {
        id: doc.id,
        ...d,
        created_at: d.created_at?.toDate?.()?.toISOString?.() || (typeof d.created_at === 'string' ? d.created_at : new Date().toISOString()),
      };
    });

    return NextResponse.json({ campaigns });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Admin access required.' }, { status: 403 });
  }
}

export async function POST(request) {
  try {
    await requireAdmin(request);
    const body = await request.json().catch(() => ({}));
    const {
      name,
      objective = 'Sales Volume',
      channels = ['Instagram', 'WhatsApp'],
      budget = 0,
      startDate = '',
      endDate = '',
      targetTemplate = 'All Templates',
      couponCode = '',
      planSteps = [],
    } = body;

    if (!name?.trim()) {
      return NextResponse.json({ error: 'Campaign name is required.' }, { status: 400 });
    }

    const db = getAdminDb();
    const docRef = await db.collection('marketing_campaigns').add({
      name: name.trim(),
      objective,
      channels: Array.isArray(channels) ? channels : [channels],
      budget: Number(budget) || 0,
      startDate: startDate || null,
      endDate: endDate || null,
      targetTemplate,
      couponCode: (couponCode || '').trim().toUpperCase(),
      planSteps: Array.isArray(planSteps) ? planSteps : [],
      status: 'Planning', // Planning, Asset Prep, Active, Paused, Concluded
      created_at: FieldValue.serverTimestamp(),
      updated_at: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true, id: docRef.id });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to create campaign.' }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    await requireAdmin(request);
    const body = await request.json().catch(() => ({}));
    const { id, ...updates } = body;

    if (!id) return NextResponse.json({ error: 'Campaign ID is required.' }, { status: 400 });

    const db = getAdminDb();
    await db.collection('marketing_campaigns').doc(id).update({
      ...updates,
      updated_at: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to update campaign.' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    await requireAdmin(request);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'Campaign ID is required.' }, { status: 400 });

    const db = getAdminDb();
    await db.collection('marketing_campaigns').doc(id).delete();

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to delete campaign.' }, { status: 500 });
  }
}
