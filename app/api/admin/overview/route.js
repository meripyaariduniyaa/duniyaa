import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';
import { requireAdmin } from '@/lib/creator-auth';

function handleApiError(error, defaultMsg) {
  console.error('Overview API Error:', error);
  const msg = error?.message || defaultMsg;
  const isAuthErr = msg.includes('Sign in required') || msg.includes('Admin access required');
  const status = isAuthErr ? 403 : 500;
  return NextResponse.json({ error: msg }, { status });
}

export async function GET(request) {
  try {
    await requireAdmin(request);
    const db = getAdminDb();
    const [creators, ordersSnap, vaultSnap, commissions, payouts, prospects] = await Promise.all([
      db.collection('creators').get(),
      db.collection('orders').get(),
      db.collection('admin_payment_ledger').get().catch(() => ({ docs: [] })),
      db.collection('commissions').get(),
      db.collection('payouts').get(),
      db.collection('crm_prospects').where('deleted', '==', false).get(),
    ]);

    // Map and merge orders from primary orders collection and permanent admin_payment_ledger vault
    const orderMap = new Map();

    // 1. Ingest vault records first
    vaultSnap.docs.forEach((d) => {
      const data = d.data();
      orderMap.set(d.id, { id: d.id, ...data });
    });

    // 2. Ingest / merge primary orders collection records
    const unvaultedOrders = [];
    ordersSnap.docs.forEach((d) => {
      const data = d.data();
      if (!orderMap.has(d.id)) {
        orderMap.set(d.id, { id: d.id, ...data });
        unvaultedOrders.push({ id: d.id, data });
      }
    });

    // Asynchronously backfill unvaulted orders to permanent vault
    if (unvaultedOrders.length > 0) {
      (async () => {
        try {
          const batch = db.batch();
          unvaultedOrders.forEach(({ id, data }) => {
            const vaultRef = db.collection('admin_payment_ledger').doc(id);
            batch.set(vaultRef, {
              ...data,
              order_id: id,
              amount_in_rupees: Number(((data.final_amount || 0) / 100).toFixed(2)),
              vault_recorded_at: new Date(),
              immutable_permanent_lock: true,
            }, { merge: true });
          });
          await batch.commit();
        } catch (e) {
          console.error('Auto-vault backfill error:', e);
        }
      })();
    }

    const allOrdersList = Array.from(orderMap.values());
    const orderData = allOrdersList.filter((item) => item.payment_status === 'paid');
    const commissionData = commissions.docs.map((d) => d.data());

    // Separate Organic Sales vs Creator Sponsored Referrals
    const creatorOrders = orderData.filter((item) => Boolean(item.creator_id));
    const organicOrders = orderData.filter((item) => !item.creator_id);

    const totalRevenue = orderData.reduce((sum, item) => sum + (item.final_amount || 0), 0);
    const creatorRevenue = creatorOrders.reduce((sum, item) => sum + (item.final_amount || 0), 0);
    const organicRevenue = organicOrders.reduce((sum, item) => sum + (item.final_amount || 0), 0);

    // Razorpay fee: 2% + 18% GST on fee = 2.36% per transaction, capped at ₹2500 (250000 paise)
    const calcRazorpayFee = (amountPaise) => Math.min(Math.ceil((amountPaise || 0) * 0.0236), 250000);
    const razorpayFeeTotal = orderData.reduce((sum, item) => sum + calcRazorpayFee(item.final_amount || 0), 0);
    const razorpayFeeOrganic = organicOrders.reduce((sum, item) => sum + calcRazorpayFee(item.final_amount || 0), 0);
    const razorpayFeeCreator = creatorOrders.reduce((sum, item) => sum + calcRazorpayFee(item.final_amount || 0), 0);
    const netRevenue = totalRevenue - razorpayFeeTotal;
    const netOrganicRevenue = organicRevenue - razorpayFeeOrganic;
    const netCreatorRevenue = creatorRevenue - razorpayFeeCreator;

    // CRM pipeline stats
    const todayStr = new Date().toISOString().split('T')[0];
    const crmByStatus = {};
    let dueTodayCount = 0;
    prospects.docs.forEach((d) => {
      const p = d.data();
      const s = p.status || 'Discovered';
      crmByStatus[s] = (crmByStatus[s] || 0) + 1;
      if (p.next_followup && p.next_followup <= todayStr && s !== 'Rejected' && s !== 'Converted') {
        dueTodayCount++;
      }
    });

    return NextResponse.json({
      totalCreators: creators.size,
      activeCreators: creators.docs.filter((d) => d.data().status === 'active').length,
      totalOrders: orderData.length,
      revenue: totalRevenue,
      organicOrdersCount: organicOrders.length,
      organicRevenue,
      creatorOrdersCount: creatorOrders.length,
      creatorRevenue,
      razorpayFeeTotal,
      razorpayFeeOrganic,
      razorpayFeeCreator,
      netRevenue,
      netOrganicRevenue,
      netCreatorRevenue,
      commissions: commissionData.reduce((sum, item) => sum + (item.commission_amount || 0), 0),
      pending: commissionData.filter((item) => item.status === 'pending').reduce((sum, item) => sum + (item.commission_amount || 0), 0),
      paidPayouts: payouts.docs.filter((d) => d.data().status === 'paid').reduce((sum, d) => sum + (d.data().amount || 0), 0),
      crmTotal: prospects.size,
      crmByStatus,
      dueTodayCount,
    });
  } catch (error) {
    return handleApiError(error, 'Admin access required.');
  }
}
