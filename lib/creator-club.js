export const CREATOR_TIERS = [
  { id: 'starter', name: 'Starter', minOrders: 0, commissionRate: 15, emoji: '🌱' },
  { id: 'rising', name: 'Rising', minOrders: 10, commissionRate: 15, emoji: '💚' },
  { id: 'creator', name: 'Creator', minOrders: 25, commissionRate: 16, emoji: '💙' },
  { id: 'partner', name: 'Partner', minOrders: 50, commissionRate: 17, emoji: '💜' },
  { id: 'elite', name: 'Elite', minOrders: 100, commissionRate: 18, emoji: '👑' },
];

export function normalizeCode(value) {
  return String(value || '').trim().toUpperCase().replace(/\s+/g, '');
}

export function normalizeSlug(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);
}

export function tierForOrders(orders = 0) {
  const num = Math.max(0, Number(orders) || 0);
  return [...CREATOR_TIERS].reverse().find((tier) => num >= tier.minOrders) || CREATOR_TIERS[0];
}

export function nextTierForOrders(orders = 0) {
  const num = Math.max(0, Number(orders) || 0);
  return CREATOR_TIERS.find((tier) => tier.minOrders > num) || null;
}

export function calculateEffectiveTierAndRate(creator = {}, paidOrdersCount = 0) {
  const baseTier = tierForOrders(paidOrdersCount);
  const effectiveTierId = creator.tier_override || creator.tier || baseTier.id;
  const matchedTier = CREATOR_TIERS.find((t) => t.id === effectiveTierId) || {
    id: effectiveTierId,
    name: effectiveTierId.charAt(0).toUpperCase() + effectiveTierId.slice(1),
    commissionRate: baseTier.commissionRate,
    emoji: '⭐'
  };

  const effectiveRate = Number(
    creator.commission_rate_override !== undefined && creator.commission_rate_override !== null
      ? creator.commission_rate_override
      : matchedTier.commissionRate
  );

  return {
    tier: matchedTier,
    tierId: effectiveTierId,
    commissionRate: Math.max(0, Math.min(100, effectiveRate)),
    nextTier: nextTierForOrders(paidOrdersCount)
  };
}

export function commissionForAmount(amountPaise, rate) {
  const amount = Math.max(0, Number(amountPaise) || 0);
  const percentage = Math.max(0, Number(rate) || 0) / 100;
  return Math.round(amount * percentage);
}

export function isAdminEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const allowed = String(process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
  return allowed.includes(email.trim().toLowerCase());
}


