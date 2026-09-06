import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';

export async function GET() {
  try {
    const snap = await getAdminDb().collection('creators').where('status', '==', 'active').get();
    const creators = snap.docs.map((doc) => {
      const data = doc.data(); return { id: doc.id, name: data.name, slug: data.slug, bio: data.bio || '', profile_image: data.profile_image || null, tier: data.tier || 'starter', featured: Boolean(data.featured) };
    }).sort((a, b) => Number(b.featured) - Number(a.featured));
    return NextResponse.json({ creators });
  } catch { return NextResponse.json({ creators: [] }); }
}
