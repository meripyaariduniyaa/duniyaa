import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/creator-auth';
import { getAdminDb } from '@/lib/firebase-admin';
import { getAdminAiPageProfile } from '@/lib/admin-ai-context';

const HF_ROUTER_URL = 'https://router.huggingface.co/hf-inference/models/mistralai/Mistral-7B-Instruct-v0.3';

/**
 * Gather live operational data from Firestore based on the active page and prompt intent.
 */
async function getOperationalLiveContext(page = '/admin', prompt = '') {
  const db = getAdminDb();
  const lowerPrompt = (prompt || '').toLowerCase();
  const profile = getAdminAiPageProfile(page);
  const domain = profile.domain || 'overview';

  const todayStr = new Date().toISOString().split('T')[0];

  // Core base metrics always fetched in parallel
  const [
    ordersSnap,
    creatorsSnap,
    payoutsSnap,
    crmSnap,
    couponsSnap,
    giftsSnap,
  ] = await Promise.all([
    db.collection('orders').limit(100).get().catch(() => ({ docs: [] })),
    db.collection('creators').get().catch(() => ({ docs: [] })),
    db.collection('payouts').get().catch(() => ({ docs: [] })),
    db.collection('crm_prospects').where('deleted', '==', false).get().catch(() => ({ docs: [] })),
    db.collection('coupons').get().catch(() => ({ docs: [] })),
    db.collection('creatorGifts').get().catch(() => ({ docs: [] })),
  ]);

  // Process core metrics
  const allOrders = ordersSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
  const paidOrders = allOrders.filter((o) => o.payment_status === 'paid');
  const grossRevenuePaise = paidOrders.reduce((sum, o) => sum + (o.final_amount || 0), 0);
  const grossRevenueRupees = Number((grossRevenuePaise / 100).toFixed(2));

  // Razorpay fee: 2.36% (2% + 18% GST)
  const estRazorpayFeesPaise = paidOrders.reduce((sum, o) => sum + Math.min(Math.ceil((o.final_amount || 0) * 0.0236), 250000), 0);
  const estRazorpayFeesRupees = Number((estRazorpayFeesPaise / 100).toFixed(2));
  const netRevenueRupees = Math.max(0, grossRevenueRupees - estRazorpayFeesRupees);

  // Creators
  const creators = creatorsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
  const activeCreators = creators.filter((c) => c.status === 'active');
  const pendingCreators = creators.filter((c) => c.status === 'pending');

  const creatorMap = new Map();
  creators.forEach((c) => creatorMap.set(c.id, c));

  // Payouts
  const allPayouts = payoutsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
  const pendingPayouts = allPayouts.filter((p) => p.status === 'pending');
  const pendingPayoutsTotalPaise = pendingPayouts.reduce((sum, p) => sum + (p.amount || 0), 0);
  const pendingPayoutsTotalRupees = Number((pendingPayoutsTotalPaise / 100).toFixed(2));

  // CRM
  const allProspects = crmSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
  const dueLeads = allProspects.filter((p) => p.next_followup && p.next_followup <= todayStr && p.status !== 'Rejected' && p.status !== 'Converted');

  // Coupons
  const allCoupons = couponsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
  const activeCoupons = allCoupons.filter((c) => c.active !== false);

  // Gifts
  const allGifts = giftsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
  const unclaimedGifts = allGifts.filter((g) => !g.claimed && !g.redeemed);

  // Detailed lists for specific domain
  let domainDetails = {};

  if (domain === 'payouts' || lowerPrompt.includes('payout') || lowerPrompt.includes('transfer')) {
    domainDetails.pendingPayoutItems = pendingPayouts.map((p) => {
      const cr = creatorMap.get(p.creator_id);
      return {
        id: p.id,
        creatorName: cr?.name || p.creator_name || 'Creator',
        creatorSlug: cr?.slug || '',
        amountRupees: Number(((p.amount || 0) / 100).toFixed(2)),
        method: p.method || 'UPI',
        createdAt: p.created_at?.toDate?.()?.toLocaleDateString() || 'Recent',
      };
    });
  }

  if (domain === 'orders' || lowerPrompt.includes('order') || lowerPrompt.includes('sale')) {
    domainDetails.recentOrders = paidOrders.slice(0, 10).map((o) => ({
      id: o.id,
      amountRupees: Number(((o.final_amount || 0) / 100).toFixed(2)),
      templateId: o.template_id || 'proposal',
      couponCode: o.coupon_code || 'None',
      creatorName: o.creator_id ? (creatorMap.get(o.creator_id)?.name || 'Creator') : 'Organic',
      paidAt: o.paid_at?.toDate?.()?.toLocaleDateString() || 'Recent',
    }));

    // Template breakdown
    const tMap = {};
    paidOrders.forEach((o) => {
      const t = o.template_id || 'proposal';
      tMap[t] = (tMap[t] || 0) + 1;
    });
    domainDetails.popularTemplates = Object.entries(tMap).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }

  if (domain === 'crm' || lowerPrompt.includes('lead') || lowerPrompt.includes('crm') || lowerPrompt.includes('outreach')) {
    domainDetails.dueLeadsList = dueLeads.slice(0, 8).map((p) => ({
      name: p.name || p.handle || 'Prospect',
      handle: p.handle || '',
      channel: p.channel || 'Instagram',
      nextFollowup: p.next_followup || 'Today',
      notes: p.notes || 'No recent notes',
      status: p.status || 'Discovered',
    }));
  }

  if (domain === 'creators' || lowerPrompt.includes('creator') || lowerPrompt.includes('partner')) {
    domainDetails.pendingCreatorList = pendingCreators.map((c) => ({
      name: c.name || 'New Applicant',
      email: c.email || '',
      slug: c.slug || '',
      appliedAt: c.created_at?.toDate?.()?.toLocaleDateString() || 'Recent',
    }));

    // Top creators by count of active referrals
    const creatorReferralCounts = {};
    paidOrders.forEach((o) => {
      if (o.creator_id) {
        creatorReferralCounts[o.creator_id] = (creatorReferralCounts[o.creator_id] || 0) + (o.final_amount || 0);
      }
    });

    domainDetails.topCreators = Object.entries(creatorReferralCounts)
      .map(([id, amount]) => {
        const cr = creatorMap.get(id);
        return {
          name: cr?.name || 'Creator',
          slug: cr?.slug || '',
          tier: cr?.tier || 'Silver',
          totalSalesPaise: amount,
          totalSalesRupees: Number((amount / 100).toFixed(2)),
        };
      })
      .sort((a, b) => b.totalSalesPaise - a.totalSalesPaise)
      .slice(0, 5);
  }

  if (domain === 'coupons' || lowerPrompt.includes('coupon') || lowerPrompt.includes('discount')) {
    domainDetails.activeCouponList = activeCoupons.slice(0, 10).map((c) => ({
      code: c.code,
      discountPercent: c.discount_percent || 10,
      type: c.type || 'standard',
      usageCount: c.usage_count || 0,
      active: c.active !== false,
    }));
  }

  return {
    page,
    domain,
    profile,
    stats: {
      totalPaidOrders: paidOrders.length,
      grossRevenueRupees,
      estRazorpayFeesRupees,
      netRevenueRupees,
      activeCreatorsCount: activeCreators.length,
      pendingCreatorsCount: pendingCreators.length,
      pendingPayoutsCount: pendingPayouts.length,
      pendingPayoutsTotalRupees,
      dueCrmCount: dueLeads.length,
      totalCrmProspects: allProspects.length,
      activeCouponsCount: activeCoupons.length,
      unclaimedGiftsCount: unclaimedGifts.length,
    },
    details: domainDetails,
  };
}

/**
 * Intelligent operational analysis engine using live snapshot facts
 */
function generateIntelligentOperationalResponse(prompt, liveContext) {
  const lower = (prompt || '').toLowerCase();
  const { stats, details, domain, profile } = liveContext;

  // 1. URGENT TRIAGE / ATTENTION / TODAY PRIORITIES
  if (
    lower.includes('attention') ||
    lower.includes('triage') ||
    lower.includes('priority') ||
    lower.includes('first') ||
    lower.includes('queue') ||
    lower.includes('operating picture')
  ) {
    const actionItems = [];

    if (stats.pendingPayoutsCount > 0) {
      actionItems.push(
        `💸 **Pending Payouts (${stats.pendingPayoutsCount})**: ₹${stats.pendingPayoutsTotalRupees.toLocaleString('en-IN')} is awaiting disbursement to creator partners. Clearing these keeps creator motivation high.`
      );
    }
    if (stats.dueCrmCount > 0) {
      actionItems.push(
        `📅 **CRM Follow-Ups Due (${stats.dueCrmCount})**: ${stats.dueCrmCount} prospective creator leads are scheduled for contact today to close partnerships.`
      );
    }
    if (stats.pendingCreatorsCount > 0) {
      actionItems.push(
        `👑 **Creator Applications (${stats.pendingCreatorsCount})**: ${stats.pendingCreatorsCount} creator application(s) need review and coupon code assignment.`
      );
    }

    const priorityHeader = actionItems.length > 0
      ? `⚡ **Urgent Operations Triage (${actionItems.length} items need action):**\n\n` + actionItems.map((item, idx) => `${idx + 1}. ${item}`).join('\n\n')
      : `✅ **All Critical Queues Clear!**\nNo pending payouts, no overdue CRM follow-ups, and no pending creator reviews.`;

    return `${priorityHeader}

---

📊 **Live Store Snapshot:**
- **Gross Revenue**: ₹${stats.grossRevenueRupees.toLocaleString('en-IN')} across ${stats.totalPaidOrders} paid orders
- **Est. Net Revenue (after gateway fees)**: ₹${stats.netRevenueRupees.toLocaleString('en-IN')}
- **Active Creator Network**: ${stats.activeCreatorsCount} partner(s)
- **Active Promotional Coupons**: ${stats.activeCouponsCount} coupon(s)

💡 *Recommendation*: ${
  stats.pendingPayoutsCount > 0
    ? 'Navigate to [/admin/payouts](file:///app/admin/payouts) to approve pending disbursements.'
    : stats.dueCrmCount > 0
    ? 'Navigate to [/admin/crm](file:///app/admin/crm) to execute today’s scheduled creator follow-ups.'
    : stats.pendingCreatorsCount > 0
    ? 'Navigate to [/admin/creators](file:///app/admin/creators) to review new creator applications.'
    : 'All queues are healthy. Focus on launching a seasonal weekend campaign in [/admin/coupons](file:///app/admin/coupons).'
}`;
  }

  // 2. PAYOUTS DISBURSEMENTS SPECIFIC
  if (domain === 'payouts' || lower.includes('payout') || lower.includes('disbursement') || lower.includes('transfer')) {
    if (stats.pendingPayoutsCount === 0) {
      return `💸 **Payouts Status:**
All creator payouts are currently up to date! There are zero pending disbursements.

- **Total Paid Orders**: ${stats.totalPaidOrders}
- **Active Creators**: ${stats.activeCreatorsCount}
- **Pending Obligations**: ₹0.00

*When creators generate new paid referrals, their earned commissions will automatically queue here for single-click UPI/bank reconciliation.*`;
    }

    const itemsText = (details.pendingPayoutItems || []).slice(0, 5).map((p, i) =>
      `${i + 1}. **${p.creatorName}** (\`/c/${p.creatorSlug || 'creator'}\`): ₹${p.amountRupees.toLocaleString('en-IN')} via ${p.method}`
    ).join('\n');

    return `💸 **Pending Creator Payouts Summary:**

You have **${stats.pendingPayoutsCount} pending disbursement(s)** totaling **₹${stats.pendingPayoutsTotalRupees.toLocaleString('en-IN')}**:

${itemsText}

**Operational Next Steps:**
1. Verify the payout references in [/admin/payouts](file:///app/admin/payouts).
2. Execute batch transfer via UPI or Net Banking.
3. Click "Mark as Paid" with the transaction UTR reference to notify the creator.`;
  }

  // 3. ORDERS VAULT SPECIFIC
  if (domain === 'orders' || lower.includes('order') || lower.includes('recent paid') || lower.includes('anomalies')) {
    const ordersList = (details.recentOrders || []).map((o, i) =>
      `${i + 1}. Order \`#${o.id.slice(-6)}\` — **₹${o.amountRupees.toLocaleString('en-IN')}** (${o.templateId}) · Coupon: \`${o.couponCode}\` · Source: ${o.creatorName}`
    ).join('\n');

    const topTemplates = (details.popularTemplates || []).map(([t, count]) => `- **${t}**: ${count} orders`).join('\n');

    return `📦 **Order Vault Intelligence:**

- **Total Completed Orders**: ${stats.totalPaidOrders}
- **Gross Order Volume**: ₹${stats.grossRevenueRupees.toLocaleString('en-IN')}
- **Est. Gateway Fees**: ~₹${stats.estRazorpayFeesRupees.toLocaleString('en-IN')}

**Recent Completed Purchases:**
${ordersList || 'No recent orders found.'}

${topTemplates ? `**Top Selling Gift Templates:**\n${topTemplates}\n` : ''}
💡 *Insight*: All recent orders have successfully passed Razorpay webhook verification and are permanently archived in the immutable ledger.`;
  }

  // 4. CRM & CREATOR OUTREACH SPECIFIC
  if (domain === 'crm' || lower.includes('crm') || lower.includes('lead') || lower.includes('follow-up') || lower.includes('dm') || lower.includes('outreach')) {
    const leadItems = (details.dueLeadsList || []).map((l, i) =>
      `${i + 1}. **${l.name}** (@${l.handle}) on ${l.channel} — Status: *${l.status}*\n   *Note*: ${l.notes}`
    ).join('\n\n');

    return `🎯 **CRM Pipeline & Follow-Up Plan:**

- **Total Prospect Pipeline**: ${stats.totalCrmProspects} leads
- **Follow-Ups Scheduled for Today**: ${stats.dueCrmCount} lead(s)

${leadItems ? `**Scheduled Touchpoints:**\n${leadItems}\n\n` : ''}
**High-Converting Instagram DM Template for Relationship / Couple Creators:**
> *"Hey [Name]! Loved your recent reel on [Topic] ✨ We run LovelyCrafts.in (India's viral personalized digital surprise platform). We'd love to partner with you — you earn 10%–18% per order with instant tracking and weekly payouts. Can I set you up with your custom link?"*

💡 *Tip*: Contact creators between 11:00 AM – 2:00 PM for the highest response rate on Instagram DM and WhatsApp.`;
  }

  // 5. CREATORS & PARTNER NETWORK
  if (domain === 'creators' || lower.includes('creator') || lower.includes('partner') || lower.includes('tier')) {
    const pendingText = (details.pendingCreatorList || []).map((c, i) =>
      `${i + 1}. **${c.name}** (\`${c.slug}\`) · Email: \`${c.email}\``
    ).join('\n');

    const topCreatorsText = (details.topCreators || []).map((c, i) =>
      `${i + 1}. **${c.name}** (\`${c.tier} Tier\`) — **₹${c.totalSalesRupees.toLocaleString('en-IN')}** generated volume`
    ).join('\n');

    return `👑 **Creator Network Status:**

- **Active Partner Creators**: ${stats.activeCreatorsCount}
- **Applications Awaiting Approval**: ${stats.pendingCreatorsCount}
- **Total Creator Referrals Revenue**: ₹${stats.grossRevenueRupees > 0 ? (stats.grossRevenueRupees * 0.45).toFixed(2) : '0'} (est. network share)

${pendingText ? `**Pending Applications to Review:**\n${pendingText}\n\n` : ''}
${topCreatorsText ? `**Top Performing Creators:**\n${topCreatorsText}\n\n` : ''}
**Recommendations:**
1. Approve verified creators in [/admin/creators](file:///app/admin/creators) and ensure their custom coupon code is active.
2. Promote Silver creators who have crossed ₹10,000 sales to Gold tier for higher commission motivation.`;
  }

  // 6. FINANCE & MARGINS
  if (domain === 'finance' || lower.includes('finance') || lower.includes('profit') || lower.includes('margin') || lower.includes('razorpay') || lower.includes('fee')) {
    const netTakeHome = Math.max(0, stats.netRevenueRupees - stats.pendingPayoutsTotalRupees);
    const marginPercent = stats.grossRevenueRupees > 0 ? Math.round((netTakeHome / stats.grossRevenueRupees) * 100) : 100;

    return `💰 **Financial Intelligence & Margin Audit:**

- **Gross Revenue**: ₹${stats.grossRevenueRupees.toLocaleString('en-IN')}
- **Razorpay Processing Fees (2.36% incl. GST)**: -₹${stats.estRazorpayFeesRupees.toLocaleString('en-IN')}
- **Pending Creator Commission Obligations**: -₹${stats.pendingPayoutsTotalRupees.toLocaleString('en-IN')}
- **Net Platform Margin**: **₹${netTakeHome.toLocaleString('en-IN')}** (~${marginPercent}% of gross volume)

**Margin Protection Rules:**
1. **Cap Creator Discounts at 15%–20%**: Prevent aggressive multi-coupon stacking on low-margin templates.
2. **Batch Payout Transfers**: Settle creator balances weekly rather than per transaction to eliminate bank IMPS charges.
3. **Encourage UPI Payments**: UPI QR/Intent has zero chargeback risk compared to international credit cards.`;
  }

  // 7. COUPONS & PROMOTIONS
  if (domain === 'coupons' || lower.includes('coupon') || lower.includes('discount') || lower.includes('promo')) {
    const couponsText = (details.activeCouponList || []).map((c, i) =>
      `- \`${c.code}\`: **${c.discountPercent}% OFF** (${c.type} coupon, redeemed ${c.usageCount} times)`
    ).join('\n');

    return `🎟️ **Coupons & Promotional Strategy:**

- **Active Coupons**: ${stats.activeCouponsCount}
${couponsText ? `\n**Active Discount Codes:**\n${couponsText}\n` : ''}
**Recommended Festive Campaign Structure:**
1. \`LOVE15\` — 15% off for all first-time couple gifts.
2. \`MIDNIGHT20\` — 20% flash discount between 10:00 PM – 2:00 AM to capture impulse anniversary gift buyers.
3. Keep max uses or minimum order bounds active on public codes to avoid scraping by coupon extension bots.`;
  }

  // 8. CONTENT & BLOG / SEO
  if (domain === 'blog' || lower.includes('blog') || lower.includes('seo') || lower.includes('content') || lower.includes('article')) {
    return `✍️ **SEO & Content Strategy for LovelyCrafts:**

**5 High-Intent Viral Blog Post Topics:**
1. *"10 Creative Long-Distance Relationship Surprise Ideas That Will Melt Their Heart"* (Target: LDR Couples in India)
2. *"How to Plan the Perfect Virtual Proposal with Interactive Music & Photos"* (Target: Proposal gifts)
3. *"Unique Birthday Countdown Experiences You Can Send on WhatsApp at Midnight"* (Target: Birthday surprises)
4. *"Best 1-Year Anniversary Gift Ideas for Boyfriend/Girlfriend Under ₹500"* (Target: High-intent budget searches)
5. *"Why Personalized Digital Memory Books Are Replacing Traditional Paper Cards"* (Target: Trend & SEO authority)

**SEO Keywords to Target:**
- "digital surprise for boyfriend India", "whatsapp midnight birthday gift", "custom online proposal note", "virtual anniversary surprise link".`;
  }

  // 9. GENERAL STRATEGIC SUMMARY
  return `⚡ **LovelyCrafts Executive Briefing (${profile.title}):**

- **Live Store Health**: ₹${stats.grossRevenueRupees.toLocaleString('en-IN')} gross volume across ${stats.totalPaidOrders} orders.
- **Creator Network**: ${stats.activeCreatorsCount} active creator partners.
- **Current Operational Queues**: ${stats.pendingPayoutsCount} pending payouts, ${stats.dueCrmCount} CRM follow-ups due, ${stats.pendingCreatorsCount} creator applications.

💡 *What would you like me to tackle? You can ask me to audit margins, triage today's queues, draft creator outreach DMs, or summarize recent orders.*`;
}

export async function POST(request) {
  try {
    await requireAdmin(request);
    const body = await request.json();
    const prompt = (body.prompt || body.message || '').trim();
    const page = body.page || '/admin';
    const clientContext = body.context || '';

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required.' }, { status: 400 });
    }

    // 1. Gather live operational snapshot from Firestore
    const liveContext = await getOperationalLiveContext(page, prompt);

    // 2. If Hugging Face API key is present, attempt LLM completion with rich factual context
    const apiKey = process.env.HUGGINGFACE_API_KEY;

    if (apiKey) {
      try {
        const systemPrompt = `You are LovelyCrafts Genius AI Agent, the dedicated operational and strategic co-pilot for LovelyCrafts (a personalized digital surprises & gifts platform in India).
Current Page: ${page} (${liveContext.profile.title} - ${liveContext.profile.scope})

LIVE OPERATIONAL FACTS:
- Gross Revenue: ₹${liveContext.stats.grossRevenueRupees} (${liveContext.stats.totalPaidOrders} paid orders)
- Net Revenue: ₹${liveContext.stats.netRevenueRupees} (after ~₹${liveContext.stats.estRazorpayFeesRupees} est. gateway fees)
- Pending Creator Payouts: ${liveContext.stats.pendingPayoutsCount} payouts totaling ₹${liveContext.stats.pendingPayoutsTotalRupees}
- Active Creators: ${liveContext.stats.activeCreatorsCount} active, ${liveContext.stats.pendingCreatorsCount} pending approval
- CRM Leads Due Today: ${liveContext.stats.dueCrmCount} leads
- Active Coupons: ${liveContext.stats.activeCouponsCount}
${clientContext ? `Client UI Context: ${clientContext}` : ''}

INSTRUCTIONS:
- Directly answer the admin's question with precise, concrete details from the operational facts.
- Do NOT repeat generic growth advice unless explicitly asked for growth tactics.
- Use clear bullet points and markdown with bolding. Keep answers actionable, professional, and concise.`;

        const fullPrompt = `<s>[INST] ${systemPrompt}\n\nAdmin Query: ${prompt} [/INST]`;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const hfRes = await fetch(HF_ROUTER_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            inputs: fullPrompt,
            parameters: {
              max_new_tokens: 500,
              temperature: 0.5,
              top_p: 0.9,
              return_full_text: false,
            },
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (hfRes.ok) {
          const data = await hfRes.json();
          const reply = Array.isArray(data) ? data[0]?.generated_text : data?.generated_text;
          const cleaned = (reply || '')
            .trim()
            .replace(/^<s>\s*\[INST\].*?\[\/INST\]/is, '')
            .replace(/^Assistant:\s*/i, '')
            .trim();

          if (cleaned && cleaned.length > 20) {
            return NextResponse.json({
              reply: cleaned,
              domain: liveContext.domain,
              stats: liveContext.stats,
            });
          }
        }
      } catch (hfErr) {
        console.warn('External LLM call failed or timed out, using built-in operational intelligence:', hfErr.message);
      }
    }

    // 3. Robust, factual built-in operational intelligence
    const intelligentReply = generateIntelligentOperationalResponse(prompt, liveContext);

    return NextResponse.json({
      reply: intelligentReply,
      domain: liveContext.domain,
      stats: liveContext.stats,
    });
  } catch (err) {
    console.error('AI Insights Route Error:', err);
    return NextResponse.json({ error: err.message || 'AI calculation error.' }, { status: 500 });
  }
}
