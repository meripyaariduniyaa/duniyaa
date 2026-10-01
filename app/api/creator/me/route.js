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

    const [orders, clicks, commissions, payouts, gifts, coupons, invitedCreatorsSnap] = await Promise.all([
      db.collection('orders').where('creator_id', 'in', [creatorId, user.uid]).get().catch(() => db.collection('orders').where('creator_id', '==', creatorId).get()),
      db.collection('referralClicks').where('creator_id', 'in', [creatorId, user.uid]).get().catch(() => db.collection('referralClicks').where('creator_id', '==', creatorId).get()),
      db.collection('commissions').where('creator_id', 'in', [creatorId, user.uid]).get().catch(() => db.collection('commissions').where('creator_id', '==', creatorId).get()),
      db.collection('payouts').where('creator_id', 'in', [creatorId, user.uid]).get().catch(() => db.collection('payouts').where('creator_id', '==', creatorId).get()),
      db.collection('creatorGifts').where('creator_id', 'in', [creatorId, user.uid]).get().catch(() => db.collection('creatorGifts').where('creator_id', '==', creatorId).get()),
      db.collection('coupons').where('creator_id', 'in', [creatorId, user.uid]).get().catch(() => db.collection('coupons').where('creator_id', '==', creatorId).get()),
      db.collection('creators').where('referred_by_creator_id', 'in', [creatorId, user.uid]).get().catch(() => db.collection('creators').where('referred_by_creator_id', '==', creatorId).get()),
    ]);

    const orderList = orders.docs.map(serialize);
    const clickList = clicks.docs.map(serialize);
    const commissionList = commissions.docs.map(serialize);
    const payoutList = payouts.docs.map(serialize);
    const giftList = gifts.docs.map(serialize);
    const couponList = coupons.docs.map(serialize);
    const invitedList = invitedCreatorsSnap.docs.map((doc) => {
      const d = doc.data();
      return {
        id: doc.id,
        name: d.name || 'Creator',
        slug: d.slug,
        status: d.status,
        joined_at: d.joined_at?.toDate ? d.joined_at.toDate().toISOString() : null,
        referral_bounty_awarded: Boolean(d.referral_bounty_awarded),
        referral_bounty_awarded_at: d.referral_bounty_awarded_at?.toDate ? d.referral_bounty_awarded_at.toDate().toISOString() : null,
      };
    });

    const summary = creatorSummary({
      creator: creatorData,
      orders: orderList,
      clicks: clickList,
      commissions: commissionList,
      payouts: payoutList,
    });

    // Tier resets every calendar month — reflect dynamic monthly tier unless overridden by admin
    if (!creatorData.tier_override && summary.tier) {
      creatorData.tier = summary.tier.id;
    }

    return NextResponse.json({
      creator: creatorData,
      applied: true,
      summary,
      coupons: couponList,
      gifts: giftList,
      commissions: commissionList,
      invitedCreators: invitedList,
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

    // Handle payout / bank details update request
    if (body.payout_details && typeof body.payout_details === 'object') {
      const {
        account_holder_name = '',
        bank_name = '',
        account_number = '',
        ifsc_code = '',
        upi_id = '',
        pan_number = '',
        document_url = '',
        request_note = '',
      } = body.payout_details;

      const payoutData = {
        account_holder_name: String(account_holder_name).trim(),
        bank_name: String(bank_name).trim(),
        account_number: String(account_number).trim(),
        ifsc_code: String(ifsc_code).trim().toUpperCase(),
        upi_id: String(upi_id).trim(),
        pan_number: String(pan_number).trim().toUpperCase(),
        document_url: String(document_url).trim(),
        request_note: String(request_note).trim(),
        verification_status: 'pending_verification',
        updated_at: FieldValue.serverTimestamp(),
      };

      update.payout_details = payoutData;

      // Log change request for admin review
      try {
        const creatorDocId = creatorSnap.exists ? creatorSnap.id : user.uid;
        await db.collection('creatorUpdateRequests').add({
          creator_id: creatorDocId,
          creator_name: body.name || (creatorSnap.exists ? creatorSnap.data().name : '') || 'Creator',
          creator_email: user.email || '',
          type: 'payout_details_update',
          payout_details: payoutData,
          status: 'pending',
          created_at: FieldValue.serverTimestamp(),
        });
      } catch (logErr) {
        console.error('Error logging creator update request:', logErr);
      }
    }

    update.updated_at = FieldValue.serverTimestamp();
    await targetDocRef.update(update);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Could not update profile.' }, { status: 403 });
  }
}
