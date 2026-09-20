import { NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { getAdminDb } from '@/lib/firebase-admin';
import { requireAdmin } from '@/lib/creator-auth';

export async function GET(request) {
  try {
    await requireAdmin(request);
    const db = getAdminDb();
    const snap = await db.collection('marketing_ideas').orderBy('created_at', 'desc').get().catch(() => ({ docs: [] }));

    const ideas = snap.docs.map((doc) => {
      const d = doc.data();
      return {
        id: doc.id,
        ...d,
        created_at: d.created_at?.toDate?.()?.toISOString?.() || (typeof d.created_at === 'string' ? d.created_at : new Date().toISOString()),
      };
    });

    return NextResponse.json({ ideas });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Admin access required.' }, { status: 403 });
  }
}

export async function POST(request) {
  try {
    await requireAdmin(request);
    const body = await request.json().catch(() => ({}));
    const { title, description, channel = 'Instagram', category = 'Growth', priority = 'High', tags = [] } = body;

    if (!title?.trim()) {
      return NextResponse.json({ error: 'Idea title is required.' }, { status: 400 });
    }

    const db = getAdminDb();
    const docRef = await db.collection('marketing_ideas').add({
      title: title.trim(),
      description: (description || '').trim(),
      channel,
      category,
      priority,
      status: 'Draft', // Draft, In Review, Scheduled, Active, Done
      tags: Array.isArray(tags) ? tags : [],
      created_at: FieldValue.serverTimestamp(),
      updated_at: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true, id: docRef.id });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to save idea.' }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    await requireAdmin(request);
    const body = await request.json().catch(() => ({}));
    const { id, ...updates } = body;

    if (!id) return NextResponse.json({ error: 'Idea ID is required.' }, { status: 400 });

    const db = getAdminDb();
    await db.collection('marketing_ideas').doc(id).update({
      ...updates,
      updated_at: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to update idea.' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    await requireAdmin(request);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'Idea ID is required.' }, { status: 400 });

    const db = getAdminDb();
    await db.collection('marketing_ideas').doc(id).delete();

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to delete idea.' }, { status: 500 });
  }
}
