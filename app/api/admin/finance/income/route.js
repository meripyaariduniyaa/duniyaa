import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';
import { requireAdmin } from '@/lib/creator-auth';

function handleApiError(error, defaultMsg) {
  console.error('Income API Error:', error);
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
    const source = searchParams.get('source');
    const search = searchParams.get('search')?.toLowerCase();

    const snap = await db.collection('finance_income').get().catch(() => ({ docs: [] }));
    let income = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    income.sort((a, b) => new Date(b.date || b.createdAt || 0) - new Date(a.date || a.createdAt || 0));

    if (source && source !== 'all') {
      income = income.filter((item) => item.source === source);
    }
    if (search) {
      income = income.filter((item) =>
        (item.title && item.title.toLowerCase().includes(search)) ||
        (item.referenceId && item.referenceId.toLowerCase().includes(search)) ||
        (item.notes && item.notes.toLowerCase().includes(search))
      );
    }

    return NextResponse.json({ income });
  } catch (error) {
    return handleApiError(error, 'Failed to fetch income entries');
  }
}

export async function POST(request) {
  try {
    const adminUser = await requireAdmin(request);
    const db = getAdminDb();
    const body = await request.json();

    const {
      title,
      source = 'google_adsense',
      amount,
      currency = 'INR',
      date = new Date().toISOString().split('T')[0],
      referenceId = '',
      impressions = 0,
      clicks = 0,
      cpm = 0,
      ctr = 0,
      notes = '',
    } = body;

    if (!title || !amount || Number(amount) <= 0) {
      return NextResponse.json({ error: 'Title and valid positive amount are required' }, { status: 400 });
    }

    const newIncome = {
      title: title.trim(),
      source,
      amount: Number(Number(amount).toFixed(2)),
      currency,
      date,
      referenceId: referenceId.trim(),
      impressions: Number(impressions) || 0,
      clicks: Number(clicks) || 0,
      cpm: Number(cpm) || 0,
      ctr: Number(ctr) || 0,
      notes: notes.trim(),
      createdAt: new Date().toISOString(),
      createdBy: adminUser?.email || 'admin',
    };

    const docRef = await db.collection('finance_income').add(newIncome);
    return NextResponse.json({ success: true, id: docRef.id, income: { id: docRef.id, ...newIncome } });
  } catch (error) {
    return handleApiError(error, 'Failed to create income entry');
  }
}

export async function PUT(request) {
  try {
    await requireAdmin(request);
    const db = getAdminDb();
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'Income ID is required' }, { status: 400 });
    }

    if (updateData.amount !== undefined) {
      updateData.amount = Number(Number(updateData.amount).toFixed(2));
    }
    updateData.updatedAt = new Date().toISOString();

    await db.collection('finance_income').doc(id).update(updateData);
    return NextResponse.json({ success: true, id });
  } catch (error) {
    return handleApiError(error, 'Failed to update income entry');
  }
}

export async function DELETE(request) {
  try {
    await requireAdmin(request);
    const db = getAdminDb();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Income ID is required' }, { status: 400 });
    }

    await db.collection('finance_income').doc(id).delete();
    return NextResponse.json({ success: true, id });
  } catch (error) {
    return handleApiError(error, 'Failed to delete income entry');
  }
}
