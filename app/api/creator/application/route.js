import { NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { getAdminDb } from '@/lib/firebase-admin';
import { requireUser } from '@/lib/creator-auth';
import { normalizeSlug } from '@/lib/creator-club';

export async function POST(request) {
  try {
    const user = await requireUser(request);
    const body = await request.json();
    const name = String(body.name || user.name || '').trim();
    const slug = normalizeSlug(body.slug || name);
    if (!name || slug.length < 3) return NextResponse.json({ error: 'Name and a 3-character creator URL are required.' }, { status: 400 });
    const db = getAdminDb();
    const slugMatch = await db.collection('creators').where('slug', '==', slug).limit(1).get();
    if (!slugMatch.empty && slugMatch.docs[0].id !== user.uid) return NextResponse.json({ error: 'That creator URL is already in use.' }, { status: 409 });
    const ref = db.collection('creators').doc(user.uid);
    const existing = await ref.get();
    if (existing.exists && ['active', 'approved'].includes(existing.data().status)) return NextResponse.json({ error: 'Your Creator Club account is already active.' }, { status: 409 });
    await ref.set({
      user_id: user.uid, name, email: user.email || '', slug, phone: String(body.phone || '').trim(), bio: String(body.bio || '').trim(),
      instagram_url: String(body.instagram_url || '').trim(), youtube_url: String(body.youtube_url || '').trim(), profile_image: body.profile_image || user.picture || null,
      status: 'pending', tier: 'starter', joined_at: existing.exists ? existing.data().joined_at : FieldValue.serverTimestamp(), updated_at: FieldValue.serverTimestamp(),
    }, { merge: true });
    return NextResponse.json({ ok: true, status: 'pending' });
  } catch (error) { return NextResponse.json({ error: error.message || 'Could not submit application.' }, { status: 401 }); }
}
