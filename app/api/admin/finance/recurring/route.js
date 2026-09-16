import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';
import { requireAdmin } from '@/lib/creator-auth';

function handleApiError(error, defaultMsg) {
  console.error('Recurring Costs API Error:', error);
  const msg = error?.message || defaultMsg;
  const isAuthErr = msg.includes('Sign in required') || msg.includes('Admin access required');
  const status = isAuthErr ? 403 : 500;
  return NextResponse.json({ error: msg }, { status });
}

export async function GET(request) {
  try {
    await requireAdmin(request);
    const db = getAdminDb();

    const snap = await db.collection('finance_recurring').get().catch(() => ({ docs: [] }));
    let items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    items.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    return NextResponse.json({ recurring: items });
  } catch (error) {
    return handleApiError(error, 'Failed to fetch recurring costs');
  }
}

export async function POST(request) {
  try {
    const adminUser = await requireAdmin(request);
    const db = getAdminDb();
    const body = await request.json();

    const {
      title,
      category = 'hosting',
      amount,
      currency = 'INR',
      frequency = 'monthly',
      billingDay = 1,
      vendor = '',
      website = '',
      active = true,
      notes = '',
    } = body;

    if (!title || !amount || Number(amount) <= 0) {
      return NextResponse.json({ error: 'Title and valid positive amount are required' }, { status: 400 });
    }

    const newRecurring = {
      title: title.trim(),
      category,
      amount: Number(Number(amount).toFixed(2)),
      currency,
      frequency,
      billingDay: Number(billingDay) || 1,
      vendor: vendor.trim(),
      website: website.trim(),
      active: active !== false,
      notes: notes.trim(),
      createdAt: new Date().toISOString(),
      createdBy: adminUser?.email || 'admin',
    };

    const docRef = await db.collection('finance_recurring').add(newRecurring);
    return NextResponse.json({ success: true, id: docRef.id, recurring: { id: docRef.id, ...newRecurring } });
  } catch (error) {
    return handleApiError(error, 'Failed to create recurring cost item');
  }
}

export async function PUT(request) {
  try {
    await requireAdmin(request);
    const db = getAdminDb();
    const body = await request.json();
    const { id, logAsExpenseForMonth, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'Recurring item ID is required' }, { status: 400 });
    }

    // If admin clicked "Log as expense for current month"
    if (logAsExpenseForMonth) {
      const doc = await db.collection('finance_recurring').doc(id).get();
      if (!doc.exists) {
        return NextResponse.json({ error: 'Recurring item not found' }, { status: 404 });
      }
      const data = doc.data();
      const todayStr = new Date().toISOString().split('T')[0];
      const expenseDoc = await db.collection('finance_expenses').add({
        title: `${data.title} (${data.frequency === 'yearly' ? 'Annual Renewal' : 'Monthly Bill'})`,
        category: data.category || 'hosting',
        amount: data.amount,
        currency: data.currency || 'INR',
        date: todayStr,
        paymentMethod: 'Auto-Debit/Card',
        vendor: data.vendor || data.title,
        receiptUrl: '',
        notes: `Auto-logged from recurring subscription #${id}. ${data.notes || ''}`,
        recurringId: id,
        createdAt: new Date().toISOString(),
        createdBy: 'system_recurring',
      });
      return NextResponse.json({ success: true, loggedExpenseId: expenseDoc.id });
    }

    if (updateData.amount !== undefined) {
      updateData.amount = Number(Number(updateData.amount).toFixed(2));
    }
    updateData.updatedAt = new Date().toISOString();

    await db.collection('finance_recurring').doc(id).update(updateData);
    return NextResponse.json({ success: true, id });
  } catch (error) {
    return handleApiError(error, 'Failed to update recurring cost');
  }
}

export async function DELETE(request) {
  try {
    await requireAdmin(request);
    const db = getAdminDb();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Recurring ID is required' }, { status: 400 });
    }

    await db.collection('finance_recurring').doc(id).delete();
    return NextResponse.json({ success: true, id });
  } catch (error) {
    return handleApiError(error, 'Failed to delete recurring cost');
  }
}
