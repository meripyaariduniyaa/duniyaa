import { calculateEffectiveTierAndRate, commissionForAmount } from './creator-club.js';

function toJsDate(val) {
  if (!val) return null;
  if (typeof val.toDate === 'function') return val.toDate();
  const d = new Date(val);
  return isNaN(d.getTime()) ? null : d;
}

export function creatorSummary({ creator = {}, orders = [], clicks = [], commissions = [], payouts = [] }) {
  const paidOrders = orders.filter((order) => order.payment_status === 'paid');
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const thisMonth = paidOrders.filter((order) => {
    const paidDate = toJsDate(order.paid_at || order.created_at);
    return paidDate && paidDate >= monthStart;
  });

  const { tier, commissionRate, nextTier } = calculateEffectiveTierAndRate(creator, paidOrders.length);

  const pending = commissions
    .filter((item) => item.status === 'pending')
    .reduce((sum, item) => sum + (Number(item.commission_amount) || 0), 0);

  const paid = commissions
    .filter((item) => item.status === 'paid')
    .reduce((sum, item) => sum + (Number(item.commission_amount) || 0), 0);

  const totalRevenue = paidOrders.reduce((sum, item) => sum + (Number(item.final_amount) || 0), 0);
  const monthRevenue = thisMonth.reduce((sum, item) => sum + (Number(item.final_amount) || 0), 0);
  const monthCommission = thisMonth.reduce((sum, item) => {
    const rate = item.commission_rate !== undefined ? item.commission_rate : commissionRate;
    return sum + commissionForAmount(item.final_amount, rate);
  }, 0);

  return {
    tier,
    rate: commissionRate,
    totalOrders: paidOrders.length,
    nextTier,
    clicks: clicks.length,
    monthOrders: thisMonth.length,
    totalRevenue,
    monthRevenue,
    monthCommission,
    pending,
    paid,
    payouts,
  };
}

