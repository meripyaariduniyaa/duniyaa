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

function parseSafeIsoDate(val) {
  if (!val) return null;
  try {
    if (typeof val?.toDate === 'function') {
      const d = val.toDate();
      return isNaN(d.getTime()) ? null : d.toISOString();
    }
    if (val instanceof Date) {
      return isNaN(val.getTime()) ? null : val.toISOString();
    }
    if (typeof val === 'object') {
      if (typeof val._seconds === 'number') {
        const d = new Date(val._seconds * 1000);
        return isNaN(d.getTime()) ? null : d.toISOString();
      }
      if (typeof val.seconds === 'number') {
        const d = new Date(val.seconds * 1000);
        return isNaN(d.getTime()) ? null : d.toISOString();
      }
    }
    if (typeof val === 'number') {
      const ms = val < 1e11 ? val * 1000 : val;
      const d = new Date(ms);
      return isNaN(d.getTime()) ? null : d.toISOString();
    }
    if (typeof val === 'string') {
      const d = new Date(val);
      return isNaN(d.getTime()) ? null : d.toISOString();
    }
  } catch {
    return null;
  }
  return null;
}

function parseSafeTime(val) {
  const iso = parseSafeIsoDate(val);
  return iso ? new Date(iso).getTime() : 0;
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

    // 1. Revenue trend (last 7 days)
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayStr = d.toISOString().split('T')[0];
      const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' });
      last7Days.push({ date: dayStr, label: dayLabel, revenue: 0, count: 0 });
    }
    const dayMap = new Map(last7Days.map((d) => [d.date, d]));

    // 2. Template breakdown & creator ranking
    const templateMap = {};
    const creatorSalesMap = {};

    orderData.forEach((ord) => {
      // Trend calculation
      const iso = parseSafeIsoDate(ord.paid_at || ord.created_at);
      const orderDate = iso ? iso.split('T')[0] : null;
      if (orderDate && dayMap.has(orderDate)) {
        const dObj = dayMap.get(orderDate);
        dObj.revenue += (ord.final_amount || 0);
        dObj.count += 1;
      }

      // Template breakdown
      const tId = ord.template_id || 'proposal';
      if (!templateMap[tId]) {
        templateMap[tId] = { template_id: tId, count: 0, revenue: 0 };
      }
      templateMap[tId].count += 1;
      templateMap[tId].revenue += (ord.final_amount || 0);

      // Creator ranking
      if (ord.creator_id) {
        if (!creatorSalesMap[ord.creator_id]) {
          creatorSalesMap[ord.creator_id] = { creator_id: ord.creator_id, sales_count: 0, total_volume: 0 };
        }
        creatorSalesMap[ord.creator_id].sales_count += 1;
        creatorSalesMap[ord.creator_id].total_volume += (ord.final_amount || 0);
      }
    });

    const templateBreakdown = Object.values(templateMap).sort((a, b) => b.revenue - a.revenue);

    // Join creator details
    const creatorLookup = new Map();
    creators.docs.forEach((doc) => {
      creatorLookup.set(doc.id, { id: doc.id, ...doc.data() });
    });

    const topCreators = Object.values(creatorSalesMap)
      .map((item) => {
        const cr = creatorLookup.get(item.creator_id);
        return {
          ...item,
          name: cr?.name || 'Creator',
          slug: cr?.slug || '',
          tier: cr?.tier || 'Silver',
          profile_image: cr?.profile_image || null,
        };
      })
      .sort((a, b) => b.total_volume - a.total_volume)
      .slice(0, 5);

    // Recent 6 orders
    const recentOrders = [...orderData]
      .sort((a, b) => parseSafeTime(b.paid_at || b.created_at) - parseSafeTime(a.paid_at || a.created_at))
      .slice(0, 6)
      .map((ord) => ({
        id: ord.id,
        note_id: ord.note_id || ord.id,
        template_id: ord.template_id || 'proposal',
        final_amount: ord.final_amount || 0,
        amount_in_rupees: Number(((ord.final_amount || 0) / 100).toFixed(2)),
        creator_id: ord.creator_id || null,
        creator_name: ord.creator_id ? (creatorLookup.get(ord.creator_id)?.name || 'Creator') : null,
        coupon_code: ord.coupon_code || null,
        paid_at: parseSafeIsoDate(ord.paid_at || ord.created_at),
        payment_method: ord.payment_method || 'razorpay',
      }));

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
      revenueTrend: last7Days,
      templateBreakdown,
      topCreators,
      recentOrders,
    });
  } catch (error) {
    return handleApiError(error, 'Admin access required.');
  }
}
