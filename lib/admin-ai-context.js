const PAGE_PROFILES = {
  '/admin': {
    title: 'Command Center',
    badge: 'Executive Briefing',
    scope: 'store health, urgent triage queues, revenue velocity, and next operational priorities',
    domain: 'overview',
    prompts: [
      '⚡ What needs my attention first today?',
      '📊 Executive briefing on revenue, orders & creators',
      '🚨 Triage pending payouts, CRM leads & approvals',
      '💡 Suggest highest impact operational action right now',
    ],
    quickActions: ['Triage Queues', 'Executive Briefing', 'Margin Audit'],
  },
  '/admin/dashboard': {
    title: 'Overview Analytics',
    badge: 'Store Intelligence',
    scope: 'recent sales velocity, order momentum, template popularity, and creator performance',
    domain: 'overview',
    prompts: [
      '📈 Analyze 7-day sales velocity and momentum',
      '🤝 Compare organic vs creator-referred revenue',
      '🎨 Which gift template is driving highest conversions?',
      '⭐ Identify creators ready for tier upgrade',
    ],
    quickActions: ['Sales Velocity', 'Creator vs Organic', 'Template Breakdown'],
  },
  '/admin/orders': {
    title: 'Orders Vault',
    badge: 'Order Tracking',
    scope: 'recent paid orders, payment methods, coupon redemptions, template choices, and order exceptions',
    domain: 'orders',
    prompts: [
      '📦 Summarize recent paid orders and top templates',
      '🎟️ Which discount coupons were used in recent orders?',
      '🔍 Check for payment anomalies or abnormal discount spikes',
      '💌 Outline a post-delivery review & referral sequence',
    ],
    quickActions: ['Summarize Orders', 'Coupon Redemptions', 'Order Anomalies'],
  },
  '/admin/payouts': {
    title: 'Payout Disbursements',
    badge: 'Disbursement Queue',
    scope: 'pending creator transfers, payout amounts, UPI/bank verification, and disbursement readiness',
    domain: 'payouts',
    prompts: [
      '💸 What payouts are pending transfer and who is owed?',
      '📝 Generate batch payout transfer notes for UPI/IMPS',
      '✅ Verify payout reconciliation and total pending obligations',
      '⏱️ Which creator payout has been pending longest?',
    ],
    quickActions: ['Pending Payouts', 'Batch Transfer Note', 'Reconcile Balance'],
  },
  '/admin/creators': {
    title: 'Creator Partners',
    badge: 'Partner Network',
    scope: 'partner activity, pending applications, tier progression, referral sales, and creator retention',
    domain: 'creators',
    prompts: [
      '👑 Who are our top revenue-generating creator partners?',
      '📋 Are there creator applications awaiting review?',
      '🌱 Who is eligible for a Tier Commission promotion?',
      '📣 Draft an inspiring weekly creator performance update',
    ],
    quickActions: ['Top Creators', 'Pending Applications', 'Draft Announcement'],
  },
  '/admin/crm': {
    title: 'CRM Lead Pipeline',
    badge: 'Creator Outreach',
    scope: 'creator prospect leads, follow-ups due, pipeline conversion rates, and outreach scripts',
    domain: 'crm',
    prompts: [
      '📅 Which creator leads need follow-up today?',
      '✉️ Draft an irresistible DM outreach script for Instagram creators',
      '🎯 Suggest follow-up message for cold/unresponsive leads',
      '🚀 Onboarding checklist for newly converted creators',
    ],
    quickActions: ['Leads Due Today', 'Draft Instagram DM', 'Follow-up Script'],
  },
  '/admin/finance': {
    title: 'Finance & Invoices Hub',
    badge: 'Finance Intelligence',
    scope: 'gross revenue, Razorpay gateway fees, creator commissions, net margin, and expense health',
    domain: 'finance',
    prompts: [
      '💰 Calculate net take-home profit after Razorpay fees & payouts',
      '📊 Audit estimated payment gateway fees and commission costs',
      '🧾 Recommend festive pricing and discount margin guards',
      '📋 Summary of income vs payout obligations',
    ],
    quickActions: ['Net Profit Breakdown', 'Fee Audit', 'Margin Guardrails'],
  },
  '/admin/coupons': {
    title: 'Coupons & Promotions',
    badge: 'Discounts Strategy',
    scope: 'active coupons, redemption patterns, discount margins, expiration risks, and fraud guardrails',
    domain: 'coupons',
    prompts: [
      '🎟️ Review active coupons and redemption usage counts',
      '🛡️ How to prevent coupon stacking and protect profit margins?',
      '🏷️ Design a high-converting festive campaign coupon plan',
      '📊 Compare creator coupon performance vs organic promos',
    ],
    quickActions: ['Active Coupons', 'Margin Protection', 'Festive Campaign Plan'],
  },
  '/admin/commissions': {
    title: 'Commission Ledger',
    badge: 'Affiliate Accounting',
    scope: 'earned commissions, pending balances, creator payout eligibility, and ledger reconciliation',
    domain: 'commissions',
    prompts: [
      '📊 Total pending commission balance across all creators',
      '⚖️ Verify commission calculation accuracy for recent orders',
      '💸 Recommend optimal creator payout schedule',
      '🔍 Identify creators with highest accrued balances',
    ],
    quickActions: ['Pending Commissions', 'Ledger Audit', 'Top Balances'],
  },
  '/admin/creator-gifts': {
    title: 'Creator VIP Gifts',
    badge: 'VIP Gifting Passes',
    scope: 'issued gift passes, claim status, redemption activity, and creator appreciation moments',
    domain: 'creator-gifts',
    prompts: [
      '🎁 Which VIP gift passes are still unclaimed?',
      '✨ Suggest milestone gift reward ideas for Gold creators',
      '📈 How to use gift passes to re-engage inactive creators?',
    ],
    quickActions: ['Unclaimed Passes', 'VIP Gift Strategy', 'Re-engage Partners'],
  },
  '/admin/reports': {
    title: 'Reports & Reconciliation',
    badge: 'Data Export & Audit',
    scope: 'cross-module data exports, financial reconciliation, audit logs, and performance metrics',
    domain: 'reports',
    prompts: [
      '📊 Summarize data readiness for monthly financial export',
      '🔍 Reconcile orders against payment gateway & commission ledger',
      '📈 Key metric variances between this month and last month',
    ],
    quickActions: ['Export Readiness', 'Reconciliation Audit', 'Variance Check'],
  },
};

const CONTENT_PROFILE = {
  title: 'Content & SEO Engine',
  badge: 'SEO & Editorial',
  scope: 'published blog articles, keyword rankings, relationship surprise guides, and editorial calendar',
  domain: 'blog',
  prompts: [
    '✍️ Generate 5 viral blog post topics for relationship gifts in India',
    '🔍 High-intent SEO keywords for digital greeting cards & proposals',
    '📖 Outline a comprehensive guide for anniversary surprise ideas',
  ],
  quickActions: ['Viral Blog Ideas', 'SEO Keyword Plan', 'Editorial Outline'],
};

const DEFAULT_PROFILE = {
  title: 'Admin Operations',
  badge: 'LovelyCrafts Copilot',
  scope: 'store health, operational workflows, and the next safe action',
  domain: 'overview',
  prompts: [
    '⚡ What needs operational attention right now?',
    '📊 Summarize current workspace and metrics',
    '🔍 Suggest the next priority action for the store',
  ],
  quickActions: ['Triage Queues', 'Operational Summary', 'Action Priorities'],
};

export function getAdminAiPageProfile(pathname = '/admin') {
  if (PAGE_PROFILES[pathname]) return PAGE_PROFILES[pathname];
  if (pathname.startsWith('/admin/blog')) return CONTENT_PROFILE;
  return DEFAULT_PROFILE;
}

export { PAGE_PROFILES };
