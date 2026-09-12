import { NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { getAdminDb } from '@/lib/firebase-admin';
import { requireUser } from '@/lib/creator-auth';
import { creatorSummary } from '@/lib/creator-metrics';

function serialize(doc) {
  const data = doc.data();
  const obj = { id: doc.id, ...data };
  for (const [k, v] of Object.entries(obj)) {
    if (v && typeof v.toDate === 'function') {
      obj[k] = v.toDate().toISOString();
    }
  }
  return obj;
}

export async function GET(request) {
  try {
    const user = await requireUser(request);
    const db = getAdminDb();
    
    // 1. Try lookup by uid
    let creatorSnap = await db.collection('creators').doc(user.uid).get();

    // 2. Fallback lookup by email
    if (!creatorSnap.exists && user.email) {
      const byEmail = await db.collection('creators').where('email', '==', user.email.toLowerCase().trim()).limit(1).get();
      if (!byEmail.empty) {
        creatorSnap = byEmail.docs[0];
      }
    }

    if (!creatorSnap || !creatorSnap.exists) {
      return NextResponse.json({ creator: null, applied: false });
    }

    const creatorData = serialize(creatorSnap);
    const creatorId = creatorData.id;

    if (creatorData.status === 'pending' || creatorData.status === 'suspended' || creatorData.status === 'rejected') {
      return NextResponse.json({
        creator: creatorData,
        applied: true,
        summary: null,
        coupons: [],
        gifts: [],
      });
    }

    const [orders, clicks, commissions, payouts, gifts, coupons] = await Promise.all([
      db.collection('orders').where('creator_id', 'in', [creatorId, user.uid]).get().catch(() => db.collection('orders').where('creator_id', '==', creatorId).get()),
      db.collection('referralClicks').where('creator_id', 'in', [creatorId, user.uid]).get().catch(() => db.collection('referralClicks').where('creator_id', '==', creatorId).get()),
      db.collection('commissions').where('creator_id', 'in', [creatorId, user.uid]).get().catch(() => db.collection('commissions').where('creator_id', '==', creatorId).get()),
      db.collection('payouts').where('creator_id', 'in', [creatorId, user.uid]).get().catch(() => db.collection('payouts').where('creator_id', '==', creatorId).get()),
      db.collection('creatorGifts').where('creator_id', 'in', [creatorId, user.uid]).get().catch(() => db.collection('creatorGifts').where('creator_id', '==', creatorId).get()),
      db.collection('coupons').where('creator_id', 'in', [creatorId, user.uid]).get().catch(() => db.collection('coupons').where('creator_id', '==', creatorId).get()),
    ]);

    const orderList = orders.docs.map(serialize);
    const clickList = clicks.docs.map(serialize);
    const commissionList = commissions.docs.map(serialize);
    const payoutList = payouts.docs.map(serialize);
    const giftList = gifts.docs.map(serialize);
    const couponList = coupons.docs.map(serialize);

    return NextResponse.json({
      creator: creatorData,
      applied: true,
      summary: creatorSummary({
        creator: creatorData,
        orders: orderList,
        clicks: clickList,
        commissions: commissionList,
        payouts: payoutList,
      }),
      coupons: couponList,
      gifts: giftList,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Could not load creator data.' }, { status: 401 });
  }
}

export async function PATCH(request) {
  try {
    const user = await requireUser(request);
    const body = await request.json();
    const db = getAdminDb();
    
    let creatorSnap = await db.collection('creators').doc(user.uid).get();
    let targetDocRef = db.collection('creators').doc(user.uid);
    if (!creatorSnap.exists && user.email) {
      const byEmail = await db.collection('creators').where('email', '==', user.email.toLowerCase().trim()).limit(1).get();
      if (!byEmail.empty) {
        targetDocRef = byEmail.docs[0].ref;
      }
    }

    const allowed = ['name', 'bio', 'instagram_url', 'youtube_url', 'profile_image', 'phone', 'terms_accepted_at', 'terms_version'];
    const update = {};

    allowed.forEach((key) => {
      if (typeof body[key] === 'string') {
        update[key] = body[key].trim();
      }
    });

    update.updated_at = FieldValue.serverTimestamp();
    await targetDocRef.update(update);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Could not update profile.' }, { status: 403 });
  }
}
