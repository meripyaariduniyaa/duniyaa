import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';
import { requireAdmin } from '@/lib/creator-auth';

function handleApiError(error, defaultMsg) {
  console.error('Finance Overview API Error:', error);
  const msg = error?.message || defaultMsg;
  const isAuthErr = msg.includes('Sign in required') || msg.includes('Admin access required');
  const status = isAuthErr ? 403 : 500;
  return NextResponse.json({ error: msg }, { status });
}

export async function GET(request) {
  try {
    await requireAdmin(request);
    const db = getAdminDb();

    // Fetch all relevant collections in parallel
    const [
      ordersSnap,
      vaultSnap,
      expensesSnap,
      incomeSnap,
      recurringSnap,
      invoicesSnap
    ] = await Promise.all([
      db.collection('orders').get().catch(() => ({ docs: [] })),
      db.collection('admin_payment_ledger').get().catch(() => ({ docs: [] })),
      db.collection('finance_expenses').get().catch(() => ({ docs: [] })),
      db.collection('finance_income').get().catch(() => ({ docs: [] })),
      db.collection('finance_recurring').get().catch(() => ({ docs: [] })),
      db.collection('finance_invoices').get().catch(() => ({ docs: [] }))
    ]);

    // 1. Calculate store sales (deduping orders & vault)
    const orderMap = new Map();
    vaultSnap.docs.forEach((d) => orderMap.set(d.id, d.data()));
    ordersSnap.docs.forEach((d) => {
      if (!orderMap.has(d.id)) orderMap.set(d.id, d.data());
    });

    let totalStoreSales = 0;
    let totalPaidOrdersCount = 0;
    orderMap.forEach((order) => {
      const isPaid = order.status === 'paid' || order.payment_status === 'paid' || !!order.payment_id || !!order.razorpay_payment_id;
      if (isPaid) {
        totalPaidOrdersCount++;
        const amount = Number(order.amount_in_rupees || (order.final_amount ? order.final_amount / 100 : 0) || order.amount || 0);
        totalStoreSales += amount;
      }
    });

    // 2. Multi-source income entries
    let totalAdSenseIncome = 0;
    let totalOtherIncome = 0;
    let totalAdImpressions = 0;
    const incomeList = [];

    incomeSnap.docs.forEach((d) => {
      const data = d.data();
      const amount = Number(data.amount || 0);
      incomeList.push({ id: d.id, ...data, amount });
      if (data.source === 'google_adsense') {
        totalAdSenseIncome += amount;
        totalAdImpressions += Number(data.impressions || 0);
      } else {
        totalOtherIncome += amount;
      }
    });

    const grossRevenue = totalStoreSales + totalAdSenseIncome + totalOtherIncome;

    // 3. Operating expenses breakdown (from finance_expenses ledger)
    let totalLoggedExpenses = 0;
    const categoryTotals = {
      hosting: 0,
      database: 0,
      storage: 0,
      gateway: 0,
      marketing: 0,
      domains: 0,
      software: 0,
      creator_payouts: 0,
      freelance: 0,
      misc: 0,
    };
    const expensesList = [];

    expensesSnap.docs.forEach((d) => {
      const data = d.data();
      const amount = Number(data.amount || 0);
      const cat = data.category || 'misc';
      totalLoggedExpenses += amount;
      categoryTotals[cat] = (categoryTotals[cat] || 0) + amount;
      expensesList.push({ id: d.id, ...data, amount });
    });

    const totalExpenses = totalLoggedExpenses;
    const totalPayoutsAmount = categoryTotals.creator_payouts || 0;

    // 4. Monthly Recurring Subscriptions (Burn Rate)
    let monthlyBurnRate = 0;
    const recurringList = [];
    recurringSnap.docs.forEach((d) => {
      const data = d.data();
      recurringList.push({ id: d.id, ...data });
      if (data.active !== false) {
        const amt = Number(data.amount || 0);
        if (data.frequency === 'yearly') {
          monthlyBurnRate += amt / 12;
        } else {
          monthlyBurnRate += amt;
        }
      }
    });

    // 5. Invoicing Overview
    let totalInvoicedAmount = 0;
    let pendingInvoicesAmount = 0;
    let paidInvoicesAmount = 0;
    const invoicesList = [];
    invoicesSnap.docs.forEach((d) => {
      const data = d.data();
      const total = Number(data.totalAmount || data.amount || 0);
      invoicesList.push({ id: d.id, ...data, totalAmount: total });
      totalInvoicedAmount += total;
      if (data.status === 'paid') {
        paidInvoicesAmount += total;
      } else if (data.status === 'pending' || data.status === 'overdue') {
        pendingInvoicesAmount += total;
      }
    });

    // 6. Net Profit & Margin
    const netProfit = grossRevenue - totalExpenses;
    const netMarginPercent = grossRevenue > 0 ? Number(((netProfit / grossRevenue) * 100).toFixed(1)) : 0;
    const projectedAnnualRunRate = monthlyBurnRate * 12;

    return NextResponse.json({
      summary: {
        grossRevenue: Number(grossRevenue.toFixed(2)),
        totalStoreSales: Number(totalStoreSales.toFixed(2)),
        totalPaidOrdersCount,
        totalAdSenseIncome: Number(totalAdSenseIncome.toFixed(2)),
        totalAdImpressions,
        totalOtherIncome: Number(totalOtherIncome.toFixed(2)),
        totalExpenses: Number(totalExpenses.toFixed(2)),
        totalLoggedExpenses: Number(totalLoggedExpenses.toFixed(2)),
        totalPayoutsAmount: Number((categoryTotals.creator_payouts || 0).toFixed(2)),
        netProfit: Number(netProfit.toFixed(2)),
        netMarginPercent,
        monthlyBurnRate: Number(monthlyBurnRate.toFixed(2)),
        projectedAnnualRunRate: Number(projectedAnnualRunRate.toFixed(2)),
        invoices: {
          totalCount: invoicesList.length,
          totalAmount: Number(totalInvoicedAmount.toFixed(2)),
          pendingAmount: Number(pendingInvoicesAmount.toFixed(2)),
          paidAmount: Number(paidInvoicesAmount.toFixed(2)),
        }
      },
      categoryTotals,
      recentExpenses: expensesList.sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt)).slice(0, 10),
      recentIncome: incomeList.sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt)).slice(0, 10),
    });
  } catch (error) {
    return handleApiError(error, 'Failed to fetch finance overview');
  }
}
