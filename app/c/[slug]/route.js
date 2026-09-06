import { NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { getAdminDb } from '@/lib/firebase-admin';
import { normalizeSlug } from '@/lib/creator-club';
import { signReferral } from '@/lib/referral-crypto';

export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    const normalized = normalizeSlug(slug);
    const origin = new URL(request.url).origin;

    if (!normalized) {
      return NextResponse.redirect(new URL('/creators', origin));
    }

    const db = getAdminDb();
    const snap = await db.collection('creators').where('slug', '==', normalized).limit(1).get();

    if (snap.empty) {
      return NextResponse.redirect(new URL('/creators', origin));
    }

    const creatorDoc = snap.docs[0];
    const creatorId = creatorDoc.id;

    // Record click asynchronously
    try {
      const userAgent = request.headers.get('user-agent') || '';
      const referer = request.headers.get('referer') || '';
      const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || '';

      await db.collection('referralClicks').add({
        creator_id: creatorId,
        slug: normalized,
        user_agent: userAgent,
        referer,
        ip,
        created_at: FieldValue.serverTimestamp(),
      });
    } catch (clickErr) {
      console.error('Error logging referral click:', clickErr);
    }

    // Set 30-day last click referral cookie
    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
    const expiresAt = Date.now() + thirtyDaysMs;
    const signedValue = signReferral(creatorId, expiresAt);

    const destination = new URL(`/creators/${normalized}`, origin);
    const response = NextResponse.redirect(destination);

    response.cookies.set('lc_ref', signedValue, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60,
      sameSite: 'lax',
    });

    return response;
  } catch (err) {
    console.error('Referral redirect error:', err);
    return NextResponse.redirect(new URL('/creators', request.url));
  }
}
