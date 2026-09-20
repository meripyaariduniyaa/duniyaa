import { NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { getAdminDb } from '@/lib/firebase-admin';
import { requireCreator } from '@/lib/creator-auth';

export async function GET(request) {
  try {
    const { user, creator } = await requireCreator(request);
    const db = getAdminDb();

    // Fetch pending change requests for this creator
    const changeSnap = await db
      .collection('creator_change_requests')
      .where('creator_id', '==', creator.id)
      .orderBy('created_at', 'desc')
      .limit(20)
      .get();

    const changeRequests = changeSnap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
      created_at: d.data().created_at?.toDate?.()?.toISOString() || null,
      resolved_at: d.data().resolved_at?.toDate?.()?.toISOString() || null,
    }));

    return NextResponse.json({
      creator: {
        id: creator.id,
        name: creator.name,
        email: creator.email,
        phone: creator.phone || '',
        dob: creator.dob || '',
        address: creator.address || '',
        state: creator.state || '',
        language: creator.language || '',
        platform: creator.platform || '',
        instagram_url: creator.instagram_url || '',
        youtube_url: creator.youtube_url || '',
        bio: creator.bio || '',
        profile_image: creator.profile_image || '',
        slug: creator.slug || '',
        tier: creator.tier || 'starter',
        commission_rate: creator.commission_rate || 10,
        coupon_code: creator.coupon_code || '',
        // Bank details (sensitive)
        bank_account_number: creator.bank_account_number || '',
        bank_ifsc: creator.bank_ifsc || '',
        bank_account_holder: creator.bank_account_holder || '',
        upi_id: creator.upi_id || '',
        // Onboarding flags
        joining_form_completed: creator.joining_form_completed || false,
        agreement_accepted_at: creator.agreement_accepted_at?.toDate?.()?.toISOString() || null,
        created_at: creator.created_at?.toDate?.()?.toISOString() || null,
      },
      changeRequests,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message || 'Creator access required.' }, { status: 403 });
  }
}

export async function PATCH(request) {
  try {
    const { user, creator } = await requireCreator(request);
    const db = getAdminDb();
    const body = await request.json();

    const { action } = body;

    if (action === 'complete_onboarding') {
      // Multi-step onboarding form submission
      const { personalInfo, bankInfo, agreementAccepted } = body;

      if (!agreementAccepted) {
        return NextResponse.json({ error: 'Agreement must be accepted.' }, { status: 400 });
      }

      const updateData = {
        joining_form_completed: true,
        agreement_accepted_at: FieldValue.serverTimestamp(),
        updated_at: FieldValue.serverTimestamp(),
      };

      if (personalInfo) {
        if (personalInfo.phone) updateData.phone = personalInfo.phone;
        if (personalInfo.dob) updateData.dob = personalInfo.dob;
        if (personalInfo.address) updateData.address = personalInfo.address;
        if (personalInfo.state) updateData.state = personalInfo.state;
        if (personalInfo.language) updateData.language = personalInfo.language;
      }

      if (bankInfo) {
        if (bankInfo.bank_account_number) updateData.bank_account_number = bankInfo.bank_account_number;
        if (bankInfo.bank_ifsc) updateData.bank_ifsc = bankInfo.bank_ifsc;
        if (bankInfo.bank_account_holder) updateData.bank_account_holder = bankInfo.bank_account_holder;
        if (bankInfo.upi_id) updateData.upi_id = bankInfo.upi_id;
      }

      await db.collection('creators').doc(creator.id).update(updateData);
      return NextResponse.json({ ok: true, message: 'Onboarding complete!' });
    }

    if (action === 'change_request') {
      // Submit a change request for admin approval
      const { field, newValue } = body;
      if (!field || !newValue) {
        return NextResponse.json({ error: 'Field and new value are required.' }, { status: 400 });
      }

      // Check for existing pending request for same field
      const existingSnap = await db
        .collection('creator_change_requests')
        .where('creator_id', '==', creator.id)
        .where('field', '==', field)
        .where('status', '==', 'pending')
        .limit(1)
        .get();

      if (!existingSnap.empty) {
        return NextResponse.json({ error: 'A pending request for this field already exists.' }, { status: 409 });
      }

      await db.collection('creator_change_requests').add({
        creator_id: creator.id,
        creator_name: creator.name,
        creator_email: creator.email,
        field,
        old_value: creator[field] || '',
        new_value: newValue,
        status: 'pending',
        created_at: FieldValue.serverTimestamp(),
        resolved_at: null,
        resolved_by: null,
      });

      return NextResponse.json({ ok: true, message: 'Change request submitted for admin review.' });
    }

    return NextResponse.json({ error: 'Unknown action.' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: err.message || 'Creator access required.' }, { status: 403 });
  }
}
