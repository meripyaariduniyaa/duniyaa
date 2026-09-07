import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';
import { requireAdmin } from '@/lib/creator-auth';

export async function GET(request) {
  try {
    await requireAdmin(request);
    const db = getAdminDb();
    const [creators, orders, commissions, payouts, prospects] = await Promise.all([
      db.collection('creators').get(),
      db.collection('orders').get(),
      db.collection('commissions').get(),
      db.collection('payouts').get(),
      db.collection('crm_prospects').where('deleted', '==', false).get(),
    ]);

    const orderData = orders.docs.map((d) => d.data()).filter((item) => item.payment_status === 'paid');
    const commissionData = commissions.docs.map((d) => d.data());

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
      revenue: orderData.reduce((sum, item) => sum + (item.final_amount || 0), 0),
      commissions: commissionData.reduce((sum, item) => sum + (item.commission_amount || 0), 0),
      pending: commissionData.filter((item) => item.status === 'pending').reduce((sum, item) => sum + (item.commission_amount || 0), 0),
      paidPayouts: payouts.docs.filter((d) => d.data().status === 'paid').reduce((sum, d) => sum + (d.data().amount || 0), 0),
      crmTotal: prospects.size,
      crmByStatus,
      dueTodayCount,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Admin access required.' }, { status: 403 });
  }
}

