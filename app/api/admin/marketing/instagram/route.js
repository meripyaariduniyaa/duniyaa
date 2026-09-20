import { NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { getAdminDb } from '@/lib/firebase-admin';
import { requireAdmin } from '@/lib/creator-auth';

export async function GET(request) {
  try {
    await requireAdmin(request);
    const db = getAdminDb();
    const snap = await db.collection('marketing_instagram_posts').orderBy('created_at', 'desc').limit(100).get().catch(() => ({ docs: [] }));

    const posts = snap.docs.map((doc) => {
      const d = doc.data();
      return {
        id: doc.id,
        ...d,
        created_at: d.created_at?.toDate?.()?.toISOString?.() || (typeof d.created_at === 'string' ? d.created_at : new Date().toISOString()),
      };
    });

    return NextResponse.json({ posts });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Admin access required.' }, { status: 403 });
  }
}

export async function POST(request) {
  try {
    await requireAdmin(request);
    const body = await request.json().catch(() => ({}));
    const { title, format = 'Reel', caption = '', hashtags = [], scheduledDate = '', imageUrl = '', sound = '' } = body;

    if (!caption?.trim() && !title?.trim()) {
      return NextResponse.json({ error: 'Post title or caption is required.' }, { status: 400 });
    }

    const db = getAdminDb();
    const docRef = await db.collection('marketing_instagram_posts').add({
      title: (title || caption.slice(0, 40) || 'Instagram Post').trim(),
      format, // Reel, Carousel, Story, Static Post
      caption: (caption || '').trim(),
      hashtags: Array.isArray(hashtags) ? hashtags : [],
      scheduledDate: scheduledDate || null,
      imageUrl: imageUrl || null,
      sound: sound || 'Trending Aesthetic Audio',
      status: 'Ready to Post', // Draft, Ready to Post, Scheduled, Published
      created_at: FieldValue.serverTimestamp(),
      updated_at: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true, id: docRef.id });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to save Instagram post.' }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    await requireAdmin(request);
    const body = await request.json().catch(() => ({}));
    const { id, ...updates } = body;

    if (!id) return NextResponse.json({ error: 'Post ID is required.' }, { status: 400 });

    const db = getAdminDb();
    await db.collection('marketing_instagram_posts').doc(id).update({
      ...updates,
      updated_at: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to update post.' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    await requireAdmin(request);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'Post ID is required.' }, { status: 400 });

    const db = getAdminDb();
    await db.collection('marketing_instagram_posts').doc(id).delete();

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to delete post.' }, { status: 500 });
  }
}
