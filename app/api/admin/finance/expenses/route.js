import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';
import { requireAdmin } from '@/lib/creator-auth';

function handleApiError(error, defaultMsg) {
  console.error('Expenses API Error:', error);
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
    const category = searchParams.get('category');
    const search = searchParams.get('search')?.toLowerCase();

    const snap = await db.collection('finance_expenses').get().catch(() => ({ docs: [] }));
    let expenses = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    expenses.sort((a, b) => new Date(b.date || b.createdAt || 0) - new Date(a.date || a.createdAt || 0));

    if (category && category !== 'all') {
      expenses = expenses.filter((e) => e.category === category);
    }
    if (search) {
      expenses = expenses.filter((e) =>
        (e.title && e.title.toLowerCase().includes(search)) ||
        (e.vendor && e.vendor.toLowerCase().includes(search)) ||
        (e.notes && e.notes.toLowerCase().includes(search))
      );
    }

    return NextResponse.json({ expenses });
  } catch (error) {
    return handleApiError(error, 'Failed to fetch expenses');
  }
}

export async function POST(request) {
  try {
    const adminUser = await requireAdmin(request);
    const db = getAdminDb();
    const body = await request.json();

    const {
      title,
      category = 'misc',
      amount,
      currency = 'INR',
      date = new Date().toISOString().split('T')[0],
      paymentMethod = 'UPI',
      vendor = '',
      receiptUrl = '',
      notes = '',
      recurringId = null
    } = body;

    if (!title || !amount || Number(amount) <= 0) {
      return NextResponse.json({ error: 'Title and valid positive amount are required' }, { status: 400 });
    }

    const newExpense = {
      title: title.trim(),
      category,
      amount: Number(Number(amount).toFixed(2)),
      currency,
      date,
      paymentMethod,
      vendor: vendor.trim(),
      receiptUrl: receiptUrl.trim(),
      notes: notes.trim(),
      recurringId,
      createdAt: new Date().toISOString(),
      createdBy: adminUser?.email || 'admin',
    };

    const docRef = await db.collection('finance_expenses').add(newExpense);
    return NextResponse.json({ success: true, id: docRef.id, expense: { id: docRef.id, ...newExpense } });
  } catch (error) {
    return handleApiError(error, 'Failed to create expense');
  }
}

export async function PUT(request) {
  try {
    await requireAdmin(request);
    const db = getAdminDb();
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'Expense ID is required' }, { status: 400 });
    }

    if (updateData.amount !== undefined) {
      updateData.amount = Number(Number(updateData.amount).toFixed(2));
    }
    updateData.updatedAt = new Date().toISOString();

    await db.collection('finance_expenses').doc(id).update(updateData);
    return NextResponse.json({ success: true, id });
  } catch (error) {
    return handleApiError(error, 'Failed to update expense');
  }
}

export async function DELETE(request) {
  try {
    await requireAdmin(request);
    const db = getAdminDb();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Expense ID is required' }, { status: 400 });
    }

    await db.collection('finance_expenses').doc(id).delete();
    return NextResponse.json({ success: true, id });
  } catch (error) {
    return handleApiError(error, 'Failed to delete expense');
  }
}
