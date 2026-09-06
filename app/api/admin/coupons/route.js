import { NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { getAdminDb } from '@/lib/firebase-admin';
import { requireAdmin } from '@/lib/creator-auth';
import { normalizeCode } from '@/lib/creator-club';

export async function GET(request) {
  try {
    await requireAdmin(request);
    const snap = await getAdminDb().collection('coupons').orderBy('created_at', 'desc').get();
    const coupons = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
      created_at: d.data().created_at?.toDate?.()?.toISOString() || null,
      updated_at: d.data().updated_at?.toDate?.()?.toISOString() || null,
      expires_at: d.data().expires_at?.toDate?.()?.toISOString() || (d.data().expires_at ? new Date(d.data().expires_at).toISOString() : null),
    }));
    return NextResponse.json({ coupons });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Admin access required.' }, { status: 403 });
  }
}

export async function POST(request) {
  try {
    await requireAdmin(request);
    const body = await request.json();
    const code = normalizeCode(body.code);
    const percent = Math.min(100, Math.max(1, Number(body.discount_percent) || 0));

    if (!code || !/^[A-Z0-9_-]{3,40}$/.test(code)) {
      return NextResponse.json({ error: 'Code must be 3–40 alphanumeric characters.' }, { status: 400 });
    }
    if (!percent || percent < 1 || percent > 100) {
      return NextResponse.json({ error: 'Discount percent must be between 1% and 100%.' }, { status: 400 });
    }

    const db = getAdminDb();
    const existing = await db.collection('coupons').where('code', '==', code).limit(1).get();
    if (!existing.empty) {
      return NextResponse.json({ error: `Coupon code "${code}" already exists.` }, { status: 409 });
    }

    const ref = db.collection('coupons').doc();
    const couponData = {
      code,
      creator_id: body.creator_id || null,
      type: body.type || (body.creator_id ? 'creator' : 'campaign'),
      discount_percent: percent,
      label: body.label || (body.creator_id ? `${percent}% Creator Discount` : `${percent}% Campaign Discount`),
      active: body.active !== false,
      expires_at: body.expires_at ? new Date(body.expires_at) : null,
      max_uses: body.max_uses ? Number(body.max_uses) : null,
      usage_count: 0,
      minimum_amount: body.minimum_amount ? Number(body.minimum_amount) : 0,
      applicable_template_ids: Array.isArray(body.applicable_template_ids) ? body.applicable_template_ids : [],
      created_at: FieldValue.serverTimestamp(),
      updated_at: FieldValue.serverTimestamp(),
    };

    const batch = db.batch();
    batch.set(ref, couponData);

    if (body.creator_id && body.primary_for_creator !== false) {
      batch.set(
        db.collection('creators').doc(body.creator_id),
        { coupon_id: ref.id, coupon_code: code, updated_at: FieldValue.serverTimestamp() },
        { merge: true }
      );
    }

    await batch.commit();
    return NextResponse.json({ ok: true, id: ref.id, coupon: { id: ref.id, ...couponData } });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Could not create coupon.' }, { status: 403 });
  }
}

export async function PATCH(request) {
  try {
    await requireAdmin(request);
    const body = await request.json();
    const { id, ...updates } = body;
    if (!id) return NextResponse.json({ error: 'Coupon ID is required.' }, { status: 400 });

    const db = getAdminDb();
    const ref = db.collection('coupons').doc(id);
    const couponSnap = await ref.get();
    if (!couponSnap.exists) return NextResponse.json({ error: 'Coupon not found.' }, { status: 404 });

    const allowed = ['active', 'discount_percent', 'expires_at', 'max_uses', 'minimum_amount', 'applicable_template_ids', 'label', 'type', 'creator_id'];
    const updateData = {};
    allowed.forEach((field) => {
      if (updates[field] !== undefined) {
        if (field === 'expires_at') {
          updateData.expires_at = updates.expires_at ? new Date(updates.expires_at) : null;
        } else if (field === 'discount_percent') {
          updateData.discount_percent = Math.min(100, Math.max(1, Number(updates.discount_percent) || 0));
        } else if (field === 'max_uses') {
          updateData.max_uses = updates.max_uses ? Number(updates.max_uses) : null;
        } else if (field === 'minimum_amount') {
          updateData.minimum_amount = Number(updates.minimum_amount) || 0;
        } else if (field === 'applicable_template_ids') {
          updateData.applicable_template_ids = Array.isArray(updates.applicable_template_ids) ? updates.applicable_template_ids : [];
        } else {
          updateData[field] = updates[field];
        }
      }
    });

    updateData.updated_at = FieldValue.serverTimestamp();
    await ref.update(updateData);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Could not update coupon.' }, { status: 403 });
  }
}

export async function DELETE(request) {
  try {
    await requireAdmin(request);
    const body = await request.json();
    const id = body.id || (new URL(request.url)).searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Coupon ID is required.' }, { status: 400 });

    const db = getAdminDb();
    const ref = db.collection('coupons').doc(id);
    const coupon = await ref.get();
    if (!coupon.exists) return NextResponse.json({ error: 'Coupon not found.' }, { status: 404 });

    const data = coupon.data();
    const batch = db.batch();
    batch.delete(ref);

    // Atomically clear creator primary coupon reference if linked
    if (data.creator_id) {
      batch.set(
        db.collection('creators').doc(data.creator_id),
        { coupon_id: null, coupon_code: null, updated_at: FieldValue.serverTimestamp() },
        { merge: true }
      );
    }

    await batch.commit();
    return NextResponse.json({ ok: true, deletedId: id });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Could not delete coupon.' }, { status: 403 });
  }
}

