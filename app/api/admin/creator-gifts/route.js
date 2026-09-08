import { NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { getAdminDb } from '@/lib/firebase-admin';
import { requireAdmin } from '@/lib/creator-auth';
import { normalizeCode } from '@/lib/creator-club';

function handleApiError(error, defaultMsg) {
  console.error('Creator Gifts API Error:', error);
  const msg = error?.message || defaultMsg;
  const isAuthErr = msg.includes('Sign in required') || msg.includes('Admin access required');
  const status = isAuthErr ? 403 : 500;
  return NextResponse.json({ error: msg }, { status });
}

export async function GET(request) {
  try {
    await requireAdmin(request);
    const db = getAdminDb();
    
    // Fetch creator gifts safely
    const snap = await db.collection('creatorGifts').get();

    const gifts = snap.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        created_at: data.created_at?.toDate?.()?.toISOString() || null,
        claimed_at: data.claimed_at?.toDate?.()?.toISOString() || null,
      };
    });

    // Sort in memory by created_at descending
    gifts.sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return dateB - dateA;
    });

    return NextResponse.json({ gifts: gifts.slice(0, 200) });
  } catch (error) {
    return handleApiError(error, 'Admin access required.');
  }
}

export async function POST(request) {
  try {
    await requireAdmin(request);
    const body = await request.json();
    const { creator_id, crm_prospect_id, target_type = 'creator', template_id, custom_code, note } = body;

    if ((!creator_id && !crm_prospect_id) || !template_id) {
      return NextResponse.json({ error: 'A creator or prospect and a template are required.' }, { status: 400 });
    }

    const db = getAdminDb();
    let targetName = 'Creator';
    let targetId = creator_id || null;
    let prospectId = crm_prospect_id || null;

    if (target_type === 'prospect' || (!creator_id && crm_prospect_id)) {
      const prospectDoc = await db.collection('crm_prospects').doc(crm_prospect_id).get();
      if (!prospectDoc.exists) {
        return NextResponse.json({ error: 'CRM Prospect not found.' }, { status: 404 });
      }
      targetName = prospectDoc.data().name || 'CRM Prospect';
      prospectId = crm_prospect_id;
      targetId = null;
    } else {
      const creatorDoc = await db.collection('creators').doc(creator_id).get();
      if (!creatorDoc.exists) {
        return NextResponse.json({ error: 'Creator not found.' }, { status: 404 });
      }
      targetName = creatorDoc.data().name || 'Creator';
      targetId = creator_id;
      prospectId = creatorDoc.data().crm_prospect_id || null;
    }

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

    // 1. Create 100% 1-use coupon restricted to this experience
    batch.set(couponRef, {
      code,
      creator_id: targetId,
      crm_prospect_id: prospectId,
      type: 'gift',
      discount_percent: 100,
      label: `VIP Free Pass for ${targetName} (${template_id})`,
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
      creator_id: targetId,
      crm_prospect_id: prospectId,
      creator_name: targetName,
      target_type: target_type || (prospectId && !targetId ? 'prospect' : 'creator'),
      template_id,
      coupon_id: couponRef.id,
      code,
      note: note || '',
      claimed: false,
      claimed_note_id: null,
      created_at: FieldValue.serverTimestamp(),
      claimed_at: null,
    });

    // 3. If tied to a CRM prospect, mark free_pass_issued: true
    if (prospectId) {
      const prospectRef = db.collection('crm_prospects').doc(prospectId);
      batch.update(prospectRef, {
        free_pass_issued: true,
        updated_at: FieldValue.serverTimestamp(),
      });
    }

    await batch.commit();
    return NextResponse.json({ ok: true, id: giftRef.id, code, coupon_id: couponRef.id });
  } catch (error) {
    return handleApiError(error, 'Could not issue gift pass.');
  }
}
