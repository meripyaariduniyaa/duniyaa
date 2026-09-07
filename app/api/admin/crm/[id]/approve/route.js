import { NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { getAdminDb } from '@/lib/firebase-admin';
import { requireAdmin } from '@/lib/creator-auth';
import { normalizeCode, normalizeSlug } from '@/lib/creator-club';

export async function POST(request, { params }) {
  try {
    const admin = await requireAdmin(request);
    const { id } = await params;
    const body = await request.json();
    const { issue_gift_pass = false, template_id = 'proposal', discount_rate = 20 } = body;

    const db = getAdminDb();
    const prospectRef = db.collection('crm_prospects').doc(id);
    const prospectSnap = await prospectRef.get();

    if (!prospectSnap.exists) {
      return NextResponse.json({ error: 'Prospect not found.' }, { status: 404 });
    }

    const prospect = prospectSnap.data();

    if (prospect.linked_creator_id) {
      return NextResponse.json({
        error: 'This prospect is already approved.',
        creator_id: prospect.linked_creator_id,
      }, { status: 409 });
    }

    // Build creator slug from name/handle
    const rawSlug = prospect.handle
      ? prospect.handle.replace(/^@/, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
      : prospect.name;
    let slug = normalizeSlug(rawSlug);

    // Ensure slug is unique
    const existingSlug = await db.collection('creators').where('slug', '==', slug).limit(1).get();
    if (!existingSlug.empty) {
      const randomSuffix = Math.floor(10 + Math.random() * 90);
      slug = `${slug}${randomSuffix}`;
    }

    // Generate coupon code
    const baseCode = `${slug.replace(/-/g, '').toUpperCase().substring(0, 10)}${discount_rate}`;
    let couponCode = normalizeCode(baseCode);

    const existingCoupon = await db.collection('coupons').where('code', '==', couponCode).limit(1).get();
    if (!existingCoupon.empty) {
      couponCode = `${couponCode}${Math.floor(10 + Math.random() * 90)}`;
    }

    const batch = db.batch();

    // 1. Create the creator doc
    const creatorRef = db.collection('creators').doc();
    const creatorId = creatorRef.id;

    const couponRef = db.collection('coupons').doc();
    const couponId = couponRef.id;

    batch.set(creatorRef, {
      name: prospect.name,
      email: prospect.public_email || '',
      phone: '',
      bio: prospect.pitch_angle || '',
      instagram_url: prospect.instagram_url || prospect.handle ? `https://instagram.com/${(prospect.handle || '').replace(/^@/, '')}` : '',
      youtube_url: prospect.youtube_url || '',
      profile_image: prospect.profile_image || null,
      slug,
      status: 'active',
      tier: 'starter',
      tier_override: null,
      commission_rate_override: null,
      discount_rate: Number(discount_rate),
      coupon_id: couponId,
      coupon_code: couponCode,
      featured: false,
      recommended_template_ids: [],
      crm_prospect_id: id,
      created_at: FieldValue.serverTimestamp(),
      joined_at: FieldValue.serverTimestamp(),
      updated_at: FieldValue.serverTimestamp(),
    });

    // 2. Create the coupon
    batch.set(couponRef, {
      code: couponCode,
      creator_id: creatorId,
      type: 'creator',
      discount_percent: Number(discount_rate),
      label: `${discount_rate}% Creator Discount`,
      active: true,
      expires_at: null,
      max_uses: null,
      usage_count: 0,
      minimum_amount: 0,
      applicable_template_ids: [],
      created_at: FieldValue.serverTimestamp(),
      updated_at: FieldValue.serverTimestamp(),
    });

    // 3. Optionally issue a free gift pass
    let giftCode = null;
    let giftCouponId = null;
    if (issue_gift_pass && template_id) {
      const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
      giftCode = normalizeCode(`GIFT-${template_id.substring(0, 4).toUpperCase()}-${randomSuffix}`);

      const giftCouponRef = db.collection('coupons').doc();
      giftCouponId = giftCouponRef.id;
      const giftRef = db.collection('creatorGifts').doc();

      batch.set(giftCouponRef, {
        code: giftCode,
        creator_id: creatorId,
        type: 'gift',
        discount_percent: 100,
        label: `VIP Gift Pass for ${prospect.name} (${template_id})`,
        active: true,
        expires_at: null,
        max_uses: 1,
        usage_count: 0,
        minimum_amount: 0,
        applicable_template_ids: [template_id],
        created_at: FieldValue.serverTimestamp(),
        updated_at: FieldValue.serverTimestamp(),
      });

      batch.set(giftRef, {
        creator_id: creatorId,
        creator_name: prospect.name,
        template_id,
        coupon_id: giftCouponId,
        code: giftCode,
        note: `Auto-issued on approval from CRM by ${admin.email}`,
        claimed: false,
        claimed_note_id: null,
        created_at: FieldValue.serverTimestamp(),
        claimed_at: null,
      });
    }

    // 4. Update CRM prospect
    batch.update(prospectRef, {
      status: 'Approved',
      linked_creator_id: creatorId,
      free_pass_issued: issue_gift_pass,
      updated_at: FieldValue.serverTimestamp(),
    });

    await batch.commit();

    const referral_link = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://lovelycrafts.in'}/c/${slug}`;

    return NextResponse.json({
      ok: true,
      creator_id: creatorId,
      coupon_code: couponCode,
      referral_link,
      gift_code: giftCode,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Approval failed.' }, { status: 500 });
  }
}
