import { NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { getAdminDb } from '@/lib/firebase-admin';
import { requireAdmin } from '@/lib/creator-auth';

export async function GET(request) {
  try {
    await requireAdmin(request);
    const db = getAdminDb();

    const [ordersSnap, crmSnap, customSnap] = await Promise.all([
      db.collection('orders').orderBy('created_at', 'desc').limit(100).get().catch(() => ({ docs: [] })),
      db.collection('crm_prospects').where('deleted', '==', false).limit(100).get().catch(() => ({ docs: [] })),
      db.collection('marketing_whatsapp_contacts').orderBy('created_at', 'desc').limit(100).get().catch(() => ({ docs: [] })),
    ]);

    const contactsMap = new Map();

    // Ingest custom contacts
    customSnap.docs.forEach((d) => {
      const data = d.data();
      contactsMap.set(d.id, { id: d.id, ...data, source: 'Custom' });
    });

    // Ingest order customers
    ordersSnap.docs.forEach((d) => {
      const data = d.data();
      const phone = data.customer_phone || data.user_phone || data.phone;
      if (phone) {
        const cleanPhone = String(phone).replace(/[^0-9]/g, '');
        if (cleanPhone.length >= 10 && !contactsMap.has(cleanPhone)) {
          contactsMap.set(cleanPhone, {
            id: d.id,
            name: data.customer_name || data.user_name || data.name || 'LovelyCrafts Customer',
            phone: cleanPhone,
            template: data.template_id || 'Proposal Experience',
            source: 'Paid Order',
            last_order_id: d.id,
          });
        }
      }
    });

    // Ingest CRM prospects
    crmSnap.docs.forEach((d) => {
      const data = d.data();
      const phone = data.phone || data.whatsapp;
      if (phone) {
        const cleanPhone = String(phone).replace(/[^0-9]/g, '');
        if (cleanPhone.length >= 10 && !contactsMap.has(cleanPhone)) {
          contactsMap.set(cleanPhone, {
            id: d.id,
            name: data.name || data.handle || 'Creator Partner',
            phone: cleanPhone,
            source: 'CRM Lead',
            handle: data.handle || '',
          });
        }
      }
    });

    const contacts = Array.from(contactsMap.values());

    return NextResponse.json({ contacts });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Admin access required.' }, { status: 403 });
  }
}

export async function POST(request) {
  try {
    await requireAdmin(request);
    const body = await request.json().catch(() => ({}));
    const { name, phone, notes = '' } = body;

    if (!name?.trim() || !phone?.trim()) {
      return NextResponse.json({ error: 'Name and phone number are required.' }, { status: 400 });
    }

    const cleanPhone = String(phone).replace(/[^0-9]/g, '');
    const db = getAdminDb();
    const docRef = await db.collection('marketing_whatsapp_contacts').add({
      name: name.trim(),
      phone: cleanPhone,
      notes: notes.trim(),
      source: 'Manual Upload',
      created_at: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true, id: docRef.id });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to save contact.' }, { status: 500 });
  }
}
