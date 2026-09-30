import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';
import { verifyReferral } from '@/lib/referral-crypto';
import { generateOrganicRetentionCoupon, disableOrganicRetentionCoupon } from '@/lib/coupons';

export async function POST(request) {
  try {
    const adminDb = getAdminDb();
    const body = await request.json().catch(() => ({}));
    const { noteId, action = 'get_or_create', code, couponId } = body;

    // Check referral cookie — prioritize creator attribution if present
    const refCookie = request.cookies.get('lc_ref')?.value;
    const refData = verifyReferral(refCookie);
    const hasCreatorReferral = Boolean(refData?.creatorId);

    if (action === 'disable') {
      const disableResult = await disableOrganicRetentionCoupon(adminDb, { code, couponId, noteId });
      return NextResponse.json({ ok: true, disabled: true, ...disableResult });
    }

    // If customer already has creator referral link, mark creator prioritized
    if (hasCreatorReferral) {
      return NextResponse.json({
        ok: true,
        eligible: false,
        reason: 'creator_referral_active',
        creatorId: refData.creatorId,
      });
    }

    const couponResult = await generateOrganicRetentionCoupon(adminDb, {
      noteId: noteId || null,
      durationMinutes: 15,
    });

    return NextResponse.json({
      ok: true,
      eligible: true,
      coupon: couponResult,
    });
  } catch (error) {
    console.error('Error in organic-retention coupon API:', error);
    return NextResponse.json(
      { ok: false, error: error.message || 'Failed to process organic retention coupon' },
      { status: 500 }
    );
  }
}
