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
    const creatorSnap = await db.collection('creators').doc(user.uid).get();

    if (!creatorSnap.exists) {
      return NextResponse.json({ creator: null, applied: false });
    }

    const creatorData = serialize(creatorSnap);

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
      db.collection('orders').where('creator_id', '==', user.uid).get(),
      db.collection('referralClicks').where('creator_id', '==', user.uid).get(),
      db.collection('commissions').where('creator_id', '==', user.uid).get(),
      db.collection('payouts').where('creator_id', '==', user.uid).get(),
      db.collection('creatorGifts').where('creator_id', '==', user.uid).get(),
      db.collection('coupons').where('creator_id', '==', user.uid).get(),
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
    const allowed = ['name', 'bio', 'instagram_url', 'youtube_url', 'profile_image', 'phone'];
    const update = {};

    allowed.forEach((key) => {
      if (typeof body[key] === 'string') {
        update[key] = body[key].trim();
      }
    });

    update.updated_at = FieldValue.serverTimestamp();
    await getAdminDb().collection('creators').doc(user.uid).update(update);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Could not update profile.' }, { status: 403 });
  }
}

