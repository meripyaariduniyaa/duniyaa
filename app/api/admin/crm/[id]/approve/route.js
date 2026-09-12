import { NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { getAdminAuth, getAdminDb } from '@/lib/firebase-admin';
import { requireAdmin } from '@/lib/creator-auth';
import { normalizeCode, normalizeSlug } from '@/lib/creator-club';

export async function POST(request, { params }) {
  try {
    const admin = await requireAdmin(request);
    const { id } = await params;
    const body = await request.json();

    const {
      signing_email,
      password,
      creator_name,
      phone,
      slug: customSlug,
      coupon_code: customCouponCode,
      commission_rate = 10,
      discount_rate = 10,
      issue_gift_pass = false,
      template_id = 'proposal',
    } = body;

    const db = getAdminDb();
    const auth = getAdminAuth();
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

    // 1. Determine and validate email
    const finalEmail = (signing_email || prospect.public_email || '').toLowerCase().trim();
    if (!finalEmail) {
      return NextResponse.json({ error: 'A signing email is required to approve the creator.' }, { status: 400 });
    }

    // 2. Determine and validate slug
    let rawSlug = customSlug || (prospect.handle ? prospect.handle.replace(/^@/, '') : prospect.name);
    let finalSlug = normalizeSlug(rawSlug);
    if (!finalSlug) {
      finalSlug = normalizeSlug(prospect.name || 'creator');
    }

    // Check slug uniqueness
    const existingSlugSnap = await db.collection('creators').where('slug', '==', finalSlug).limit(1).get();
    if (!existingSlugSnap.empty) {
      // If the existing slug doesn't belong to this prospect
      const existingCreator = existingSlugSnap.docs[0].data();
      if (existingCreator.crm_prospect_id !== id) {
        finalSlug = `${finalSlug}-${Math.floor(10 + Math.random() * 90)}`;
      }
    }

    // 3. Determine and validate coupon code
    let finalCouponCode = normalizeCode(customCouponCode || `${finalSlug.replace(/-/g, '').toUpperCase().substring(0, 10)}${discount_rate}`);
    if (!finalCouponCode) {
      finalCouponCode = normalizeCode(`PROMO${discount_rate}`);
    }

    const existingCouponSnap = await db.collection('coupons').where('code', '==', finalCouponCode).limit(1).get();
    if (!existingCouponSnap.empty) {
      finalCouponCode = `${finalCouponCode}${Math.floor(10 + Math.random() * 90)}`;
    }

    // 4. Create or link Firebase Auth User
    let authUid = null;
    let authCreated = false;
    try {
      const existingAuthUser = await auth.getUserByEmail(finalEmail);
      authUid = existingAuthUser.uid;
      if (password && password.trim().length >= 6) {
        await auth.updateUser(authUid, {
          password: password.trim(),
          displayName: creator_name || prospect.name || 'Creator',
        });
      }
    } catch (authErr) {
      if (authErr.code === 'auth/user-not-found') {
        const genPassword = password && password.trim().length >= 6 ? password.trim() : `${finalSlug.replace(/-/g, '')}#2026`;
        const newUser = await auth.createUser({
          email: finalEmail,
          password: genPassword,
          displayName: creator_name || prospect.name || 'Creator',
        });
        authUid = newUser.uid;
        authCreated = true;
      } else {
        console.warn('Firebase Auth lookup notice:', authErr);
      }
    }

    const batch = db.batch();

    // 5. Create the Creator Document
    const creatorRef = authUid ? db.collection('creators').doc(authUid) : db.collection('creators').doc();
    const creatorId = creatorRef.id;

    const couponRef = db.collection('coupons').doc();
    const couponId = couponRef.id;

    batch.set(creatorRef, {
      name: (creator_name || prospect.name || '').trim(),
      email: finalEmail,
      phone: (phone || prospect.phone || '').trim(),
      bio: prospect.pitch_angle || `Exclusive partner on LovelyCrafts`,
      instagram_url: prospect.instagram_url || (prospect.handle ? `https://instagram.com/${prospect.handle.replace(/^@/, '')}` : ''),
      youtube_url: prospect.youtube_url || '',
      profile_image: prospect.profile_image || null,
      slug: finalSlug,
      status: 'active',
      tier: 'starter',
      tier_override: null,
      commission_rate: Number(commission_rate) || 10,
      commission_rate_override: Number(commission_rate) || 10,
      discount_rate: Number(discount_rate) || 10,
      coupon_id: couponId,
      coupon_code: finalCouponCode,
      featured: false,
      recommended_template_ids: [],
      crm_prospect_id: id,
      created_at: FieldValue.serverTimestamp(),
      joined_at: FieldValue.serverTimestamp(),
      updated_at: FieldValue.serverTimestamp(),
    }, { merge: true });

    // 6. Create the Discount Coupon Document
    batch.set(couponRef, {
      code: finalCouponCode,
      creator_id: creatorId,
      type: 'creator',
      discount_percent: Number(discount_rate) || 10,
      label: `${discount_rate}% Off with ${creator_name || prospect.name}`,
      active: true,
      expires_at: null,
      max_uses: null,
      usage_count: 0,
      minimum_amount: 0,
      applicable_template_ids: [],
      created_at: FieldValue.serverTimestamp(),
      updated_at: FieldValue.serverTimestamp(),
    });

    // 7. Optionally issue a free VIP test pass
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
        label: `VIP Free Test Pass for ${creator_name || prospect.name} (${template_id})`,
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
        creator_name: creator_name || prospect.name,
        template_id,
        coupon_id: giftCouponId,
        code: giftCode,
        note: `Auto-issued on CRM approval by ${admin.email}`,
        claimed: false,
        claimed_note_id: null,
        created_at: FieldValue.serverTimestamp(),
        claimed_at: null,
      });
    }

    // 8. Update CRM Prospect status
    batch.update(prospectRef, {
      status: 'Approved',
      linked_creator_id: creatorId,
      signing_email: finalEmail,
      free_pass_issued: Boolean(issue_gift_pass),
      updated_at: FieldValue.serverTimestamp(),
    });

    await batch.commit();

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lovelycrafts.in';

    return NextResponse.json({
      ok: true,
      creator_id: creatorId,
      slug: finalSlug,
      email: finalEmail,
      coupon_code: finalCouponCode,
      commission_rate: Number(commission_rate) || 10,
      discount_rate: Number(discount_rate) || 10,
      referral_link: `${siteUrl}/creators/${finalSlug}`,
      partner_promo_url: `${siteUrl}/?ref=${finalCouponCode}`,
      login_url: `${siteUrl}/creator/login`,
      gift_code: giftCode,
      auth_created: authCreated,
    });
  } catch (error) {
    console.error('Creator Approval Error:', error);
    return NextResponse.json({ error: error.message || 'Could not approve creator.' }, { status: 500 });
  }
}
