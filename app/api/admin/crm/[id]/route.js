import { NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { getAdminDb } from '@/lib/firebase-admin';
import { requireAdmin } from '@/lib/creator-auth';

function serializeProspect(doc) {
  const data = doc.data();
  const obj = { id: doc.id, ...data };
  for (const [k, v] of Object.entries(obj)) {
    if (v && typeof v.toDate === 'function') {
      obj[k] = v.toDate().toISOString();
    }
  }
  return obj;
}

export async function GET(request, { params }) {
  try {
    await requireAdmin(request);
    const { id } = await params;
    const db = getAdminDb();
    const snap = await db.collection('crm_prospects').doc(id).get();
    if (!snap.exists) {
      return NextResponse.json({ error: 'Prospect not found.' }, { status: 404 });
    }
    return NextResponse.json({ prospect: serializeProspect(snap) });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Error fetching prospect' }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    await requireAdmin(request);
    const { id } = await params;
    const body = await request.json();
    const db = getAdminDb();
    const ref = db.collection('crm_prospects').doc(id);
    const snap = await ref.get();

    if (!snap.exists) {
      return NextResponse.json({ error: 'Prospect not found.' }, { status: 404 });
    }

    const allowed = [
      'name', 'state', 'city', 'language', 'platform', 'handle',
      'followers', 'niche', 'creator_type', 'fit_score', 'priority',
      'contact_route', 'public_email', 'phone', 'pitch_angle', 'personalization_notes',
      'instagram_url', 'youtube_url', 'profile_image',
      'status', 'last_contacted', 'next_followup', 'response',
      'free_pass_issued', 'linked_creator_id', 'signing_email', 'deleted',
    ];

    const update = { updated_at: FieldValue.serverTimestamp() };
    allowed.forEach((key) => {
      if (body[key] !== undefined) update[key] = body[key];
    });

    if (body.outreach_entry && body.outreach_entry.date) {
      const existing = snap.data().outreach_history || [];
      update.outreach_history = [
        ...existing,
        {
          date: body.outreach_entry.date,
          method: body.outreach_entry.method || 'DM',
          message: body.outreach_entry.message || '',
          response: body.outreach_entry.response || '',
        },
      ];
      if (!update.last_contacted) {
        update.last_contacted = body.outreach_entry.date;
      }
    }

    await ref.update(update);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Error updating prospect' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await requireAdmin(request);
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const permanent = searchParams.get('permanent') === '1';
    const db = getAdminDb();
    const ref = db.collection('crm_prospects').doc(id);

    if (permanent) {
      await ref.delete();
    } else {
      await ref.update({
        deleted: true,
        updated_at: FieldValue.serverTimestamp(),
      });
    }

    return NextResponse.json({ ok: true, deleted_id: id });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Error deleting prospect' }, { status: 500 });
  }
}
