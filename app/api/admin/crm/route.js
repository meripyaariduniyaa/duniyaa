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

function handleApiError(error, defaultMsg) {
  console.error('CRM API Error:', error);
  const msg = error?.message || defaultMsg;
  const isAuthErr = msg.includes('Sign in required') || msg.includes('Admin access required');
  const status = isAuthErr ? 403 : 500;
  return NextResponse.json({ error: msg }, { status });
}

export async function GET(request) {
  try {
    await requireAdmin(request);
    const db = getAdminDb();
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get('status');
    const dueToday = searchParams.get('due_today') === '1';

    // Fetch without complex compound queries to avoid composite index requirements
    const snap = await db.collection('crm_prospects').where('deleted', '==', false).get();
    let prospects = snap.docs.map(serializeProspect);

    // Sort in JS memory by updated_at descending
    prospects.sort((a, b) => {
      const dateA = a.updated_at ? new Date(a.updated_at).getTime() : 0;
      const dateB = b.updated_at ? new Date(b.updated_at).getTime() : 0;
      return dateB - dateA;
    });

    if (statusFilter) {
      prospects = prospects.filter((p) => p.status === statusFilter);
    }

    if (dueToday) {
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      const todayStr = today.toISOString().split('T')[0];
      prospects = prospects.filter((p) => p.next_followup && p.next_followup <= todayStr);
    }

    return NextResponse.json({ prospects: prospects.slice(0, 500) });
  } catch (error) {
    return handleApiError(error, 'Admin access required.');
  }
}

export async function POST(request) {
  try {
    await requireAdmin(request);
    const body = await request.json();
    const db = getAdminDb();

    const {
      name, state, city, language, platform, handle,
      followers, niche, creator_type, fit_score, priority,
      contact_route, public_email, pitch_angle, status,
      last_contacted, next_followup, response, personalization_notes,
      instagram_url, youtube_url, profile_image,
    } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Creator name is required.' }, { status: 400 });
    }

    const ref = db.collection('crm_prospects').doc();
    const data = {
      name: name.trim(),
      state: state || '',
      city: city || '',
      language: language || '',
      platform: platform || 'Instagram',
      handle: handle || '',
      followers: Number(followers) || 0,
      niche: niche || '',
      creator_type: creator_type || 'Micro',
      fit_score: Number(fit_score) || 5,
      priority: priority || 'B',
      contact_route: contact_route || 'DM',
      public_email: public_email || '',
      pitch_angle: pitch_angle || '',
      personalization_notes: personalization_notes || '',
      instagram_url: instagram_url || '',
      youtube_url: youtube_url || '',
      profile_image: profile_image || null,
      status: status || 'Discovered',
      last_contacted: last_contacted || null,
      next_followup: next_followup || null,
      response: response || '',
      free_pass_issued: false,
      outreach_history: [],
      linked_creator_id: null,
      deleted: false,
      created_at: FieldValue.serverTimestamp(),
      updated_at: FieldValue.serverTimestamp(),
    };

    await ref.set(data);
    return NextResponse.json({ ok: true, id: ref.id });
  } catch (error) {
    return handleApiError(error, 'Could not create prospect.');
  }
}

export async function PATCH(request) {
  try {
    await requireAdmin(request);
    const body = await request.json();
    const { id, outreach_entry, ...fields } = body;

    if (!id) return NextResponse.json({ error: 'Prospect ID required.' }, { status: 400 });

    const db = getAdminDb();
    const ref = db.collection('crm_prospects').doc(id);
    const snap = await ref.get();
    if (!snap.exists) return NextResponse.json({ error: 'Prospect not found.' }, { status: 404 });

    const allowed = [
      'name', 'state', 'city', 'language', 'platform', 'handle',
      'followers', 'niche', 'creator_type', 'fit_score', 'priority',
      'contact_route', 'public_email', 'pitch_angle', 'personalization_notes',
      'instagram_url', 'youtube_url', 'profile_image',
      'status', 'last_contacted', 'next_followup', 'response',
      'free_pass_issued', 'linked_creator_id', 'deleted',
    ];

    const update = { updated_at: FieldValue.serverTimestamp() };
    allowed.forEach((key) => {
      if (fields[key] !== undefined) update[key] = fields[key];
    });

    // Append outreach history entry if provided
    if (outreach_entry && outreach_entry.date) {
      const existing = snap.data().outreach_history || [];
      update.outreach_history = [
        ...existing,
        {
          date: outreach_entry.date,
          method: outreach_entry.method || 'DM',
          message: outreach_entry.message || '',
          response: outreach_entry.response || '',
        },
      ];
      // Auto-update last_contacted
      if (!update.last_contacted) {
        update.last_contacted = outreach_entry.date;
      }
    }

    await ref.update(update);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleApiError(error, 'Could not update prospect.');
  }
}

export async function DELETE(request) {
  try {
    await requireAdmin(request);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Prospect ID required.' }, { status: 400 });

    const db = getAdminDb();
    await db.collection('crm_prospects').doc(id).update({
      deleted: true,
      updated_at: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleApiError(error, 'Could not delete prospect.');
  }
}
