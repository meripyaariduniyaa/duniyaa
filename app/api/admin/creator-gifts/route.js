import { NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { getAdminDb } from '@/lib/firebase-admin';
import { requireAdmin } from '@/lib/creator-auth';
import { normalizeCode } from '@/lib/creator-club';

export async function GET(request) {
  try {
    await requireAdmin(request);
    const db = getAdminDb();
    const snap = await db.collection('creatorGifts').orderBy('created_at', 'desc').limit(100).get();

    const gifts = snap.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        created_at: data.created_at?.toDate?.()?.toISOString() || null,
        claimed_at: data.claimed_at?.toDate?.()?.toISOString() || null,
      };
    });

    return NextResponse.json({ gifts });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Admin access required.' }, { status: 403 });
  }
}

export async function POST(request) {
  try {
    await requireAdmin(request);
    const body = await request.json();
    const { creator_id, template_id, custom_code, note } = body;

    if (!creator_id || !template_id) {
      return NextResponse.json({ error: 'Creator ID and template ID are required.' }, { status: 400 });
    }

    const db = getAdminDb();
    const creatorDoc = await db.collection('creators').doc(creator_id).get();
    if (!creatorDoc.exists) {
      return NextResponse.json({ error: 'Creator not found.' }, { status: 404 });
    }

    const creatorName = creatorDoc.data().name || 'Creator';
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const code = normalizeCode(custom_code || `GIFT-${template_id.substring(0, 4).toUpperCase()}-${randomSuffix}`);

    // Check if code already exists
    const existing = await db.collection('coupons').where('code', '==', code).limit(1).get();
    if (!existing.empty) {
      return NextResponse.json({ error: `Coupon code "${code}" already exists.` }, { status: 409 });
    }

    const couponRef = db.collection('coupons').doc();
    const giftRef = db.collection('creatorGifts').doc();
    const batch = db.batch();

    // 1. Create 100% 1-use coupon restricted to this creator and template
    batch.set(couponRef, {
      code,
      creator_id,
      type: 'gift',
      discount_percent: 100,
      label: `VIP Gift Pass for ${creatorName} (${template_id})`,
      active: true,
      expires_at: null,
      max_uses: 1,
      usage_count: 0,
      minimum_amount: 0,
      applicable_template_ids: [template_id],
      created_at: FieldValue.serverTimestamp(),
      updated_at: FieldValue.serverTimestamp(),
    });

    // 2. Create record in creatorGifts
    batch.set(giftRef, {
      creator_id,
      creator_name: creatorName,
      template_id,
      coupon_id: couponRef.id,
      code,
      note: note || '',
      claimed: false,
      claimed_note_id: null,
      created_at: FieldValue.serverTimestamp(),
      claimed_at: null,
    });

    await batch.commit();
    return NextResponse.json({ ok: true, id: giftRef.id, code, coupon_id: couponRef.id });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Could not issue gift pass.' }, { status: 403 });
  }
}
