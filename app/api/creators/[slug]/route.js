import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';
import { normalizeSlug } from '@/lib/creator-club';

export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    const normalized = normalizeSlug(slug);

    if (!normalized) {
      return NextResponse.json({ error: 'Slug is required.' }, { status: 400 });
    }

    const db = getAdminDb();
    const snap = await db.collection('creators').where('slug', '==', normalized).limit(1).get();

    if (snap.empty) {
      return NextResponse.json({ error: 'Creator not found.' }, { status: 404 });
    }

    const doc = snap.docs[0];
    const data = doc.data();

    // Check status
    if (data.status !== 'active' && data.status !== 'approved') {
      return NextResponse.json({ error: 'Creator profile is unavailable.' }, { status: 404 });
    }

    // Lookup primary coupon if available
    let primaryCoupon = null;
    if (data.coupon_id) {
      const couponDoc = await db.collection('coupons').doc(data.coupon_id).get();
      if (couponDoc.exists && couponDoc.data().active !== false) {
        primaryCoupon = {
          code: couponDoc.data().code,
          discount_percent: couponDoc.data().discount_percent,
          label: couponDoc.data().label,
        };
      }
    }

    if (!primaryCoupon && data.coupon_code) {
      primaryCoupon = {
        code: data.coupon_code,
        discount_percent: data.discount_rate || 20,
        label: `${data.discount_rate || 20}% Creator Discount`,
      };
    }

    // Calculate current month tier dynamically (resets monthly)
    let activeTier = data.tier_override || data.tier || 'starter';
    if (!data.tier_override) {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const ordersSnap = await db.collection('orders')
        .where('creator_id', 'in', [doc.id, data.uid || doc.id])
        .where('payment_status', '==', 'paid')
        .get()
        .catch(() => ({ docs: [] }));

      const monthOrdersCount = ordersSnap.docs.filter((d) => {
        const paidAt = d.data().paid_at?.toDate?.() || d.data().created_at?.toDate?.();
        return paidAt && paidAt >= startOfMonth;
      }).length;

      const { tierForOrders } = await import('@/lib/creator-club');
      activeTier = tierForOrders(monthOrdersCount).id;
    }

    const creator = {
      id: doc.id,
      name: data.name,
      slug: data.slug,
      bio: data.bio || '',
      profile_image: data.profile_image || null,
      tier: activeTier,
      featured: Boolean(data.featured),
      instagram_url: data.instagram_url || null,
      youtube_url: data.youtube_url || null,
      primaryCoupon,
      recommended_template_ids: Array.isArray(data.recommended_template_ids)
        ? data.recommended_template_ids.slice(0, 4)
        : [],
    };

    return NextResponse.json({ creator });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Error fetching creator.' }, { status: 500 });
  }
}
