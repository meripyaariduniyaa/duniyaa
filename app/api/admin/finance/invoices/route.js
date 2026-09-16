import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';
import { requireAdmin } from '@/lib/creator-auth';

function handleApiError(error, defaultMsg) {
  console.error('Invoices API Error:', error);
  const msg = error?.message || defaultMsg;
  const isAuthErr = msg.includes('Sign in required') || msg.includes('Admin access required');
  const status = isAuthErr ? 403 : 500;
  return NextResponse.json({ error: msg }, { status });
}

async function generateInvoiceNumber(db) {
  const year = new Date().getFullYear();
  try {
    // Count ALL invoices ever (not just this year) so the number never resets/collides
    const snap = await db.collection('finance_invoices').count().get();
    const total = snap.data().count || 0;
    const seq = String(total + 1).padStart(4, '0');
    return `LC-INV-${year}-${seq}`;
  } catch {
    // Fallback: timestamp-based if count() is not available
    const seq = String(Date.now()).slice(-5);
    return `LC-INV-${year}-${seq}`;
  }
}

export async function GET(request) {
  try {
    await requireAdmin(request);
    const db = getAdminDb();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search')?.toLowerCase();
    const fetchPaidOrders = searchParams.get('fetchPaidOrders') === 'true';

    // Fetch invoices safely
    const snap = await db.collection('finance_invoices').get().catch(() => ({ docs: [] }));
    let invoices = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    // Sort in memory by issuedDate or createdAt descending
    invoices.sort((a, b) => new Date(b.createdAt || b.issuedDate || 0) - new Date(a.createdAt || a.issuedDate || 0));

    if (status && status !== 'all') {
      invoices = invoices.filter((inv) => inv.status === status);
    }
    if (search) {
      invoices = invoices.filter((inv) =>
        (inv.invoiceNumber && inv.invoiceNumber.toLowerCase().includes(search)) ||
        (inv.customerName && inv.customerName.toLowerCase().includes(search)) ||
        (inv.customerEmail && inv.customerEmail.toLowerCase().includes(search)) ||
        (inv.customerPhone && inv.customerPhone.includes(search)) ||
        (inv.orderId && inv.orderId.toLowerCase().includes(search))
      );
    }

    // If caller requested list of paid checkouts to create invoices from
    let paidOrders = [];
    if (fetchPaidOrders) {
      const [ordersSnap, vaultSnap] = await Promise.all([
        db.collection('orders').limit(100).get().catch(() => ({ docs: [] })),
        db.collection('admin_payment_ledger').limit(100).get().catch(() => ({ docs: [] })),
      ]);

      const orderMap = new Map();
      const processOrder = (doc) => {
        const data = doc.data();
        const id = doc.id;
        const isPaid = data.status === 'paid' || data.payment_status === 'paid' || !!data.payment_id || !!data.razorpay_payment_id;
        if (isPaid && !orderMap.has(id)) {
          const rawAmount = data.amount_in_rupees || (data.final_amount ? data.final_amount / 100 : 0) || data.amount || 0;
          const rupees = Number(rawAmount > 1000 && data.final_amount ? (data.final_amount / 100).toFixed(2) : Number(rawAmount).toFixed(2));
          orderMap.set(id, {
            id,
            note_id: data.note_id || id,
            customer_name: data.customer_name || data.user_name || data.name || 'LovelyCrafts Customer',
            customer_email: data.customer_email || data.user_email || data.email || '',
            customer_phone: data.customer_phone || data.user_phone || data.phone || '',
            template_id: data.template_id || 'LovelyCrafts Digital Experience',
            amount: rupees,
            payment_id: data.payment_id || data.razorpay_payment_id || '',
            coupon_code: data.coupon_code || '',
            discount_percent: data.discount_percent || 0,
            date: data.paid_at || data.created_at || new Date().toISOString().split('T')[0],
          });
        }
      };

      vaultSnap.docs.forEach(processOrder);
      ordersSnap.docs.forEach(processOrder);
      paidOrders = Array.from(orderMap.values());
    }

    return NextResponse.json({ invoices, paidOrders });
  } catch (error) {
    return handleApiError(error, 'Failed to fetch invoices');
  }
}

function safeTrim(val, fallback = '') {
  if (typeof val === 'string') return val.trim();
  if (val !== null && val !== undefined) return String(val).trim();
  return fallback;
}

export async function POST(request) {
  try {
    const adminUser = await requireAdmin(request);
    const db = getAdminDb();
    const body = await request.json();

    const {
      invoiceNumber,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      customerGstin,
      items = [],
      subtotal = 0,
      discount = 0,
      taxRate = 0,
      taxAmount = 0,
      totalAmount = 0,
      currency = 'INR',
      status = 'pending', // 'paid', 'pending', 'overdue', 'draft'
      issuedDate = new Date().toISOString().split('T')[0],
      dueDate = new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
      notes = 'Thank you for choosing LovelyCrafts! For any questions, reach out at support@lovelycrafts.shop',
      terms = '1. Payment due within specified due date.\n2. Goods & digital access delivered upon payment verification.',
      orderId = null,
      paymentMethod = 'UPI / Razorpay',
      paidAt = status === 'paid' ? new Date().toISOString() : null,
    } = body;

    if (!customerName || !items || items.length === 0) {
      return NextResponse.json({ error: 'Customer name and at least one item are required' }, { status: 400 });
    }

    // Recalculate accurately on server
    const sanitizedItems = items.map((it) => ({
      description: safeTrim(it.description, 'Custom Item'),
      quantity: Number(it.quantity) || 1,
      unitPrice: Number(Number(it.unitPrice).toFixed(2)) || 0,
      total: Number(((Number(it.quantity) || 1) * (Number(it.unitPrice) || 0)).toFixed(2)),
    }));

    const calculatedSubtotal = sanitizedItems.reduce((acc, it) => acc + it.total, 0);
    const calculatedDiscount = Number(discount) || 0;
    const discountedTotal = Math.max(0, calculatedSubtotal - calculatedDiscount);
    const calculatedTax = Number(((discountedTotal * (Number(taxRate) || 0)) / 100).toFixed(2));
    const calculatedFinalTotal = Number((discountedTotal + calculatedTax).toFixed(2));

    const finalInvoiceNumber = safeTrim(invoiceNumber)
      ? safeTrim(invoiceNumber) 
      : await generateInvoiceNumber(db);

    const newInvoice = {
      invoiceNumber: finalInvoiceNumber,
      customerName: safeTrim(customerName),
      customerEmail: safeTrim(customerEmail),
      customerPhone: safeTrim(customerPhone),
      customerAddress: safeTrim(customerAddress),
      customerGstin: safeTrim(customerGstin),
      items: sanitizedItems,
      subtotal: calculatedSubtotal,
      discount: calculatedDiscount,
      taxRate: Number(taxRate) || 0,
      taxAmount: calculatedTax,
      totalAmount: calculatedFinalTotal,
      currency,
      status,
      issuedDate,
      dueDate,
      notes: safeTrim(notes),
      terms: safeTrim(terms),
      orderId,
      paymentMethod,
      paidAt: status === 'paid' ? (paidAt || new Date().toISOString()) : null,
      createdAt: new Date().toISOString(),
      createdBy: adminUser?.email || 'admin',
    };

    const docRef = await db.collection('finance_invoices').add(newInvoice);
    return NextResponse.json({ success: true, id: docRef.id, invoice: { id: docRef.id, ...newInvoice } });
  } catch (error) {
    return handleApiError(error, 'Failed to create invoice');
  }
}

export async function PUT(request) {
  try {
    await requireAdmin(request);
    const db = getAdminDb();
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'Invoice ID is required' }, { status: 400 });
    }

    if (updateData.status === 'paid' && !updateData.paidAt) {
      updateData.paidAt = new Date().toISOString();
    }
    updateData.updatedAt = new Date().toISOString();

    await db.collection('finance_invoices').doc(id).update(updateData);
    return NextResponse.json({ success: true, id });
  } catch (error) {
    return handleApiError(error, 'Failed to update invoice');
  }
}

export async function DELETE(request) {
  try {
    await requireAdmin(request);
    const db = getAdminDb();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Invoice ID is required' }, { status: 400 });
    }

    await db.collection('finance_invoices').doc(id).delete();
    return NextResponse.json({ success: true, id });
  } catch (error) {
    return handleApiError(error, 'Failed to delete invoice');
  }
}
