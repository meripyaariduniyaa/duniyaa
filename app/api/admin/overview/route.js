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
    const [creators, orders, commissions, payouts, prospects] = await Promise.all([
      db.collection('creators').get(),
      db.collection('orders').get(),
      db.collection('commissions').get(),
      db.collection('payouts').get(),
      db.collection('crm_prospects').where('deleted', '==', false).get(),
    ]);

    const orderData = orders.docs.map((d) => d.data()).filter((item) => item.payment_status === 'paid');
    const commissionData = commissions.docs.map((d) => d.data());

    // Separate Organic Sales vs Creator Sponsored Referrals
    const creatorOrders = orderData.filter((item) => Boolean(item.creator_id));
    const organicOrders = orderData.filter((item) => !item.creator_id);

    const totalRevenue = orderData.reduce((sum, item) => sum + (item.final_amount || 0), 0);
    const creatorRevenue = creatorOrders.reduce((sum, item) => sum + (item.final_amount || 0), 0);
    const organicRevenue = organicOrders.reduce((sum, item) => sum + (item.final_amount || 0), 0);

    // Razorpay fee: 2% + 18% GST on fee = 2.36% per transaction, capped at ₹2500 (250000 paise)
    const calcRazorpayFee = (amountPaise) => Math.min(Math.ceil(amountPaise * 0.0236), 250000);
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
