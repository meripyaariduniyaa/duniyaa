import { NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { getAdminDb } from '@/lib/firebase-admin';
import { requireAdmin } from '@/lib/creator-auth';
import { normalizeCode, normalizeSlug } from '@/lib/creator-club';

async function generateUniqueCreatorCoupon(db, creatorId, baseCode, discountPercent) {
  let candidate = normalizeCode(baseCode || 'CREATOR20');
  if (candidate.length < 3) candidate = `CREATOR${candidate}20`;

  let existing = await db.collection('coupons').where('code', '==', candidate).limit(1).get();
  if (!existing.empty && existing.docs[0].data().creator_id !== creatorId) {
    const randomSuffix = Math.floor(10 + Math.random() * 90);
    candidate = `${candidate}${randomSuffix}`;
  }

  const couponRef = db.collection('coupons').doc();
  const couponData = {
    code: candidate,
    creator_id: creatorId,
    type: 'creator',
    discount_percent: Math.min(100, Math.max(1, Number(discountPercent) || 20)),
    label: `${discountPercent || 20}% Creator Discount`,
    active: true,
    expires_at: null,
    max_uses: null,
    usage_count: 0,
    minimum_amount: 0,
    applicable_template_ids: [],
    created_at: FieldValue.serverTimestamp(),
    updated_at: FieldValue.serverTimestamp(),
  };

  await couponRef.set(couponData);
  return { id: couponRef.id, code: candidate };
}

export async function GET(request) {
  try {
    await requireAdmin(request);
    const snap = await getAdminDb().collection('creators').orderBy('updated_at', 'desc').get();
    const creators = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
      joined_at: d.data().joined_at?.toDate?.()?.toISOString() || null,
      updated_at: d.data().updated_at?.toDate?.()?.toISOString() || null,
      created_at: d.data().created_at?.toDate?.()?.toISOString() || null,
    }));
    return NextResponse.json({ creators });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Admin access required.' }, { status: 403 });
  }
}

export async function POST(request) {
  try {
    await requireAdmin(request);
    const body = await request.json();
    const db = getAdminDb();
    const id = body.user_id || db.collection('creators').doc().id;
    const name = String(body.name || '').trim();
    const slug = normalizeSlug(body.slug || name);
    const discountRate = Number(body.discount_rate) || 20;

    if (!name || !slug) {
      return NextResponse.json({ error: 'Name and a valid URL slug are required.' }, { status: 400 });
    }

    const existingSlug = await db.collection('creators').where('slug', '==', slug).limit(1).get();
    if (!existingSlug.empty && existingSlug.docs[0].id !== id) {
      return NextResponse.json({ error: `The creator URL "${slug}" is already taken.` }, { status: 409 });
    }

    let couponId = body.coupon_id || null;
    let couponCode = body.coupon_code ? normalizeCode(body.coupon_code) : null;

    // Auto-create coupon if active and doesn't exist
    if ((body.status === 'active' || body.status === 'approved') && !couponId) {
      const baseCode = couponCode || `${slug.replace(/-/g, '').toUpperCase()}${discountRate}`;
      const generated = await generateUniqueCreatorCoupon(db, id, baseCode, discountRate);
      couponId = generated.id;
      couponCode = generated.code;
    }

    const creatorRecord = {
      user_id: body.user_id || null,
      name,
      slug,
      email: body.email || '',
      phone: body.phone || '',
      bio: body.bio || '',
      instagram_url: body.instagram_url || '',
      youtube_url: body.youtube_url || '',
      profile_image: body.profile_image || null,
      status: body.status || 'active',
      tier: body.tier || 'starter',
      tier_override: body.tier_override || null,
      commission_rate_override: body.commission_rate_override !== undefined && body.commission_rate_override !== null ? Number(body.commission_rate_override) : null,
      discount_rate: discountRate,
      coupon_id: couponId,
      coupon_code: couponCode,
      featured: Boolean(body.featured),
      recommended_template_ids: Array.isArray(body.recommended_template_ids) ? body.recommended_template_ids.slice(0, 4) : [],
      created_at: FieldValue.serverTimestamp(),
      joined_at: FieldValue.serverTimestamp(),
      updated_at: FieldValue.serverTimestamp(),
    };

    await db.collection('creators').doc(id).set(creatorRecord, { merge: true });
    return NextResponse.json({ ok: true, id, coupon_code: couponCode });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Could not save creator.' }, { status: 403 });
  }
}

export async function PATCH(request) {
  try {
    await requireAdmin(request);
    const { id, ...body } = await request.json();
    if (!id) return NextResponse.json({ error: 'Creator ID required.' }, { status: 400 });

    const db = getAdminDb();
    const creatorRef = db.collection('creators').doc(id);
    const creatorSnap = await creatorRef.get();
    if (!creatorSnap.exists) return NextResponse.json({ error: 'Creator not found.' }, { status: 404 });

    const currentData = creatorSnap.data();
    const allowed = [
      'name', 'slug', 'email', 'phone', 'status', 'tier', 'tier_override',
      'commission_rate_override', 'discount_rate', 'featured', 'bio',
      'instagram_url', 'youtube_url', 'profile_image', 'recommended_template_ids',
      'coupon_id', 'coupon_code'
    ];

    const update = {};
    allowed.forEach((key) => {
      if (body[key] !== undefined) {
        if (key === 'recommended_template_ids') {
          update[key] = Array.isArray(body[key]) ? body[key].slice(0, 4) : [];
        } else if (key === 'slug') {
          update[key] = normalizeSlug(body[key]);
        } else if (key === 'coupon_code') {
          update[key] = body[key] ? normalizeCode(body[key]) : null;
        } else if (key === 'commission_rate_override') {
          update[key] = body[key] === null || body[key] === '' ? null : Number(body[key]);
        } else if (key === 'tier_override') {
          update[key] = body[key] === null || body[key] === '' ? null : body[key];
        } else {
          update[key] = body[key];
        }
      }
    });

    const nextStatus = update.status || currentData.status;
    const discountRate = Number(update.discount_rate || currentData.discount_rate || 20);

    // If creator is being approved or is active without a coupon, auto-create one
    if ((nextStatus === 'active' || nextStatus === 'approved') && !currentData.coupon_id && !update.coupon_id) {
      const baseCode = update.coupon_code || `${(update.slug || currentData.slug || currentData.name).replace(/[^a-zA-Z0-9]/g, '').toUpperCase()}${discountRate}`;
      const generated = await generateUniqueCreatorCoupon(db, id, baseCode, discountRate);
      update.coupon_id = generated.id;
      update.coupon_code = generated.code;
    }

    // If admin explicitly modified coupon_code or discount_rate on an existing coupon
    if (currentData.coupon_id && (update.coupon_code || update.discount_rate !== undefined)) {
      const couponRef = db.collection('coupons').doc(currentData.coupon_id);
      const cSnap = await couponRef.get();
      if (cSnap.exists) {
        const cUpdate = { updated_at: FieldValue.serverTimestamp() };
        if (update.coupon_code) cUpdate.code = update.coupon_code;
        if (update.discount_rate) {
          cUpdate.discount_percent = discountRate;
          cUpdate.label = `${discountRate}% Creator Discount`;
        }
        await couponRef.update(cUpdate);
      }
    }

    update.updated_at = FieldValue.serverTimestamp();
    await creatorRef.update(update);
    return NextResponse.json({ ok: true, coupon_code: update.coupon_code || currentData.coupon_code });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Could not update creator.' }, { status: 403 });
  }
}


