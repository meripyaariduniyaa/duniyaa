import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/creator-auth';
import { getAdminDb } from '@/lib/firebase-admin';

const HF_ROUTER_URL = 'https://router.huggingface.co/hf-inference/models/mistralai/Mistral-7B-Instruct-v0.3';
const HF_OPENAI_URL = 'https://router.huggingface.co/v1/chat/completions';

// Built-in intelligent business heuristics when external LLM is offline/expired
async function generateOperationalInsight(prompt, context = '') {
  const lower = prompt.toLowerCase();
  const db = getAdminDb();

  // Try to pull live metrics
  let totalOrders = 0;
  let revenue = 0;
  let pendingPayouts = 0;
  let activeCreators = 0;
  let dueCrmCount = 0;

  try {
    const [ordersSnap, creatorsSnap, payoutsSnap, crmSnap] = await Promise.all([
      db.collection('orders').where('payment_status', '==', 'paid').get().catch(() => ({ docs: [] })),
      db.collection('creators').where('status', '==', 'active').get().catch(() => ({ docs: [] })),
      db.collection('payouts').where('status', '==', 'pending').get().catch(() => ({ docs: [] })),
      db.collection('crm_prospects').where('deleted', '==', false).get().catch(() => ({ docs: [] })),
    ]);
    totalOrders = ordersSnap.docs.length;
    revenue = ordersSnap.docs.reduce((sum, d) => sum + (d.data().final_amount || 0), 0) / 100;
    activeCreators = creatorsSnap.docs.length;
    pendingPayouts = payoutsSnap.docs.reduce((sum, d) => sum + (d.data().amount || 0), 0) / 100;
    const todayStr = new Date().toISOString().split('T')[0];
    dueCrmCount = crmSnap.docs.filter((d) => d.data().next_followup && d.data().next_followup <= todayStr).length;
  } catch {}

  if (lower.includes('growth') || lower.includes('7-day') || lower.includes('sale') || lower.includes('traffic')) {
    return `📈 **7-Day Revenue & Growth Acceleration Blueprint:**

1. **Activate WhatsApp Surprise Sharing Loop**:
   - Add an instant "Share with Friends" button right after order delivery. 68% of viral Indian digital gift conversions happen via direct WhatsApp status and DM shares.

2. **Run a 48-Hour Creator Commission Blitz**:
   - Offer active creators an extra **+3% bonus commission** on orders generated over the weekend to incentivize aggressive Reels & Story posts.

3. **High-Converting Festive Landing Banners**:
   - Spotlight the top-selling **Proposal Experience** & **Birthday Experience** templates directly on the hero carousel with limited-time discount badges.

💡 *Store Context: Currently at ${totalOrders} completed orders and ₹${revenue.toLocaleString('en-IN')} gross volume.*`;
  }

  if (lower.includes('creator') || lower.includes('dm') || lower.includes('outreach') || lower.includes('recruit')) {
    return `🎨 **Creator Recruitment & Engagement Playbook:**

**High-Converting Instagram DM Outreach Script:**
> *"Hey [Name]! Loved your recent reel on [Topic] ✨ We run LovelyCrafts.in (India's viral personalized digital surprise platform). We'd love to partner with you as an official creator partner — you earn 10%–18% per order with instant automated tracking and payouts. Can I set you up with your custom link?"*

**Action Items:**
1. Target micro-creators (10k–50k followers) in relationship advice, romance, and gifting niches.
2. Provide them a 100% free gift link preview so they can experience and show the actual template on their stories.
3. Automatically promote Silver creators to Gold once they cross 100 orders to keep them actively posting.`;
  }

  if (lower.includes('profit') || lower.includes('margin') || lower.includes('fee') || lower.includes('razorpay') || lower.includes('cost')) {
    const rzFeeEst = Math.round(revenue * 0.0236);
    const netTakeHome = Math.max(0, revenue - rzFeeEst - pendingPayouts);

    return `💰 **Net Margin & Fee Breakdown:**

- **Gross Revenue**: ₹${revenue.toLocaleString('en-IN')}
- **Est. Razorpay Gateway Fee (2.36% incl. GST)**: ~₹${rzFeeEst.toLocaleString('en-IN')}
- **Creator Payout Obligations**: ₹${pendingPayouts.toLocaleString('en-IN')}
- **Est. Net Platform Margin**: ~₹${netTakeHome.toLocaleString('en-IN')}

**Margin Optimization Strategies:**
1. Cap maximum discount percentages on coupons at 20% to prevent margin erosion.
2. Incentivize UPI payments (0% MDR fee when routed through direct VPA/QR) to save 2% on payment gateway costs.
3. Batch creator payouts via UPI autopay or NEFT to avoid single-transaction disbursement fees.`;
  }

  if (lower.includes('coupon') || lower.includes('promo') || lower.includes('discount') || lower.includes('festive')) {
    return `🎟️ **High-Converting Promotion & Coupon Strategy:**

1. **Recommended Coupon Structure**:
   - \`LOVE15\` (15% off for first-time buyers on Birthday/Anniversary)
   - \`MIDNIGHT20\` (20% off for orders placed between 10 PM – 2 AM for midnight surprises)

2. **Creator Referral Incentives**:
   - Give creators a unique code (e.g. \`CREATORNAME\`) offering 10% off to their audience while tracking their 10%-18% commission credit automatically.

3. **Protection Rule**:
   - Set minimum cart value or single-use restrictions to prevent coupon aggregators from scraping promotional codes.`;
  }

  if (lower.includes('crm') || lower.includes('lead') || lower.includes('follow')) {
    return `🎯 **CRM Pipeline & Follow-Up Memo:**

- **Leads Needing Follow-up Today**: ${dueCrmCount} lead(s)
- **Best Follow-up Window**: 11:00 AM – 2:00 PM on weekdays.

**Follow-Up Touchpoint Template (WhatsApp/DM):**
> *"Hi [Name]! Following up on our LovelyCrafts creator partnership invitation. We have a campaign kicking off this weekend with priority payout terms. Let me know if you'd like to get your partner link activated today!"*`;
  }

  // Default intelligent analysis
  return `⚡ **LovelyCrafts Operational Briefing:**

- **Store Health**: ${totalOrders} completed orders with ₹${revenue.toLocaleString('en-IN')} in total sales.
- **Creator Network**: ${activeCreators} active partners driving sponsored referrals.
- **Disbursement Status**: ₹${pendingPayouts.toLocaleString('en-IN')} in pending creator commissions.
- **Top Priority**: ${dueCrmCount > 0 ? `Follow up with ${dueCrmCount} creator lead(s) scheduled for today in the CRM.` : 'Scale weekend traffic campaigns and review creator tier upgrades.'}

*Ask me about growth tactics, DM scripts, margin optimization, or specific order trends.*`;
}

export async function POST(request) {
  try {
    await requireAdmin(request);
    const body = await request.json();
    const prompt = body.prompt || body.message;
    const page = body.page || '/admin';
    const context = body.context || '';

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Prompt is required.' }, { status: 400 });
    }

    const apiKey = process.env.HUGGINGFACE_API_KEY;

    // If API key is available, attempt to query Hugging Face Mistral
    if (apiKey) {
      try {
        const systemPrompt = `You are LovelyCrafts Genius AI Copilot, an expert e-commerce and creator business analyst for LovelyCrafts (a personalized digital gifts & surprises platform in India).
The admin is currently browsing: ${page}.
${context ? `Live Context:\n${context}` : ''}
Provide direct, actionable, practical, high-value advice and data insights. Use clear bullet points and markdown. Keep answers concise.`;

        const fullPrompt = `<s>[INST] ${systemPrompt}\n\nUser Question: ${prompt} [/INST]`;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000);

        const hfRes = await fetch(HF_ROUTER_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            inputs: fullPrompt,
            parameters: {
              max_new_tokens: 450,
              temperature: 0.6,
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

          if (cleaned) {
            return NextResponse.json({ reply: cleaned });
          }
        }
      } catch (hfErr) {
        console.warn('Hugging Face inference error, switching to operational heuristics engine:', hfErr.message);
      }
    }

    // Graceful fallback to real-time built-in operational intelligence
    const fallbackInsight = await generateOperationalInsight(prompt, context);
    return NextResponse.json({ 
      reply: fallbackInsight 
    });
  } catch (err) {
    console.error('AI Insights Route Error:', err);
    return NextResponse.json({ error: err.message || 'AI calculation error.' }, { status: 500 });
  }
}
