'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/components/AuthProvider';
import Link from 'next/link';
import {
  RupeeIcon,
  OrdersIcon,
  CreatorsIcon,
  PayoutsIcon,
  CrmIcon,
  CouponsIcon,
  CommissionsIcon,
  GiftsIcon,
  FinanceIcon,
  SparklesIcon,
  RefreshIcon,
} from '@/components/admin/AdminIcons';

const QUICK_NAV = [
  { label: 'View Orders', href: '/admin/orders', icon: OrdersIcon, color: '#0284c7', bg: '#e0f2fe', desc: 'Track & audit paid orders' },
  { label: 'Manage Creators', href: '/admin/creators', icon: CreatorsIcon, color: '#7c3aed', bg: '#ede9fe', desc: 'Partners, tiers & approvals' },
  { label: 'Finance Hub', href: '/admin/finance', icon: FinanceIcon, color: '#059669', bg: '#d1fae5', desc: 'Invoices & net margins' },
  { label: 'CRM Pipeline', href: '/admin/crm', icon: CrmIcon, color: '#dc2626', bg: '#fee2e2', desc: 'Outreach & follow-ups' },
  { label: 'Disbursements', href: '/admin/payouts', icon: PayoutsIcon, color: '#d97706', bg: '#fef3c7', desc: 'Creator bank / UPI transfers' },
  { label: 'Coupons & Promos', href: '/admin/coupons', icon: CouponsIcon, color: '#ec4899', bg: '#fce7f3', desc: 'Discount codes & campaigns' },
  { label: 'Commissions', href: '/admin/commissions', icon: CommissionsIcon, color: '#0f172a', bg: '#f1f5f9', desc: 'Affiliate ledger audit' },
  { label: 'VIP Gifts', href: '/admin/creator-gifts', icon: GiftsIcon, color: '#8b5cf6', bg: '#ede9fe', desc: 'Relationship passes' },
];

const AGENT_MODES = [
  {
    id: 'triage',
    label: '🛡️ Operations & Triage',
    tagline: 'Audit live queues, pending disbursements, due CRM leads & anomalies',
    powers: [
      {
        id: 'triage-1',
        title: '⚡ Today’s Urgent Queues',
        desc: 'Identify what needs immediate action across payouts, CRM and creators.',
        prompt: 'What needs my attention first today? Triage pending payouts, CRM leads, and creator approvals.',
      },
      {
        id: 'triage-2',
        title: '💸 Audit Pending Disbursements',
        desc: 'Review creator payout obligations and summarize batch transfer requirements.',
        prompt: 'Audit all pending creator payouts, total amount owed, and what to verify before transfer.',
      },
      {
        id: 'triage-3',
        title: '📦 Recent Orders & Health',
        desc: 'Analyze recent purchase volume, template split, and webhook verification.',
        prompt: 'Summarize recent paid orders, popular templates, and check for any order anomalies.',
      },
      {
        id: 'triage-4',
        title: '📅 CRM Follow-Up Agenda',
        desc: 'List leads scheduled for touchpoints today and recommend outreach sequence.',
        prompt: 'Which creator prospect leads are due for follow-up today in the CRM and what should I send them?',
      },
    ],
  },
  {
    id: 'growth',
    label: '📈 Growth & Marketing',
    tagline: 'Drive conversion sprints, viral WhatsApp loops, and seasonal promotions',
    powers: [
      {
        id: 'growth-1',
        title: '🚀 7-Day Revenue Sprint',
        desc: 'High-impact conversion tactics to scale order volume this week.',
        prompt: 'Suggest a high-impact 7-day marketing and conversion sprint for LovelyCrafts in India.',
      },
      {
        id: 'growth-2',
        title: '📲 WhatsApp Viral Loop',
        desc: 'Optimize post-delivery sharing hooks to drive organic peer referrals.',
        prompt: 'How can we optimize our post-order WhatsApp sharing flow to get couples to share their surprise page?',
      },
      {
        id: 'growth-3',
        title: '🎟️ High-Converting Festive Promo',
        desc: 'Plan holiday flash discounts and midnight surprise coupon structures.',
        prompt: 'Design a high-converting seasonal campaign with coupon codes and creator incentives for relationship gifts.',
      },
      {
        id: 'growth-4',
        title: '✍️ Viral Blog & SEO Strategy',
        desc: 'Top high-intent keyword topics for organic search ranking.',
        prompt: 'Suggest 5 viral blog post topics and high-intent SEO keywords for digital anniversary surprises.',
      },
    ],
  },
  {
    id: 'creators',
    label: '👑 Creator Partnerships',
    tagline: 'Recruit top creators, manage tiers, and draft high-converting outreach scripts',
    powers: [
      {
        id: 'creator-1',
        title: '✉️ Irresistible Instagram DM Script',
        desc: 'High-converting direct message sequence for relationship creators.',
        prompt: 'Write an irresistible, high-converting outreach DM and follow-up script to recruit couple/relationship creators in India.',
      },
      {
        id: 'creator-2',
        title: '⭐ Creator Tier & Incentive Plan',
        desc: 'Promote top performers and design bonus rewards for Gold partners.',
        prompt: 'How should we structure creator tier promotions (Silver to Gold) and what bonuses motivate frequent posting?',
      },
      {
        id: 'creator-3',
        title: '📣 Weekly Partner Broadcast',
        desc: 'Draft an engaging announcement to keep creators posting consistently.',
        prompt: 'Draft an inspiring weekly creator newsletter announcement highlighting top earning tips and new templates.',
      },
      {
        id: 'creator-4',
        title: '🎁 Milestone VIP Gifting',
        desc: 'Engage VIP creators with complimentary customizable gift passes.',
        prompt: 'How can we use VIP gift passes in /admin/creator-gifts to re-engage inactive creators?',
      },
    ],
  },
  {
    id: 'finance',
    label: '💰 Finance & Margins',
    tagline: 'Audit Razorpay processing fees, creator commission liabilities & take-home margin',
    powers: [
      {
        id: 'fin-1',
        title: '📊 Net Platform Margin Audit',
        desc: 'Calculate take-home revenue after 2.36% gateway fees and commissions.',
        prompt: 'Calculate and analyze our net profit margins after Razorpay fees and creator payouts, and suggest margin guardrails.',
      },
      {
        id: 'fin-2',
        title: '🛡️ Coupon Margin Guardrails',
        desc: 'Audit discount rates to prevent margin erosion and stacking.',
        prompt: 'How can we structure coupon limits and minimum spend rules to protect our net take-home margin?',
      },
      {
        id: 'fin-3',
        title: '🧾 Payout Reconciliation Routine',
        desc: 'Verify ledger balance accuracy against bank transfers.',
        prompt: 'What is the best weekly payout reconciliation procedure for UPI and IMPS creator payments?',
      },
      {
        id: 'fin-4',
        title: '💳 Payment Gateway Optimization',
        desc: 'Strategies to maximize UPI share and eliminate unnecessary fees.',
        prompt: 'How can we encourage direct UPI payments to minimize Razorpay gateway processing fees?',
      },
    ],
  },
];

function formatAiText(text = '') {
  const lines = text.split('\n');
  return lines.map((line, idx) => {
    let formatted = line;

    // Bold formatting
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Inline code
    formatted = formatted.replace(
      /`([^`]+)`/g,
      '<code style="background:#f1f5f9;color:#0f172a;padding:2px 6px;border-radius:4px;font-size:0.85em;font-family:monospace;">$1</code>'
    );

    // Blockquote
    if (/^>\s+/.test(line)) {
      const content = formatted.replace(/^>\s+/, '');
      return (
        <blockquote
          key={idx}
          style={{
            margin: '8px 0',
            padding: '8px 14px',
            background: '#f8fafc',
            borderLeft: '4px solid #6366f1',
            borderRadius: '0 8px 8px 0',
            fontStyle: 'italic',
            fontSize: '0.88rem',
            color: '#334155',
          }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      );
    }

    // Bullet points
    if (/^[-*•]\s+/.test(line)) {
      const content = formatted.replace(/^[-*•]\s+/, '');
      return (
        <li
          key={idx}
          style={{ marginLeft: '20px', marginBottom: '6px', lineHeight: 1.6, fontSize: '0.88rem' }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      );
    }

    // Numbered list
    if (/^\d+\.\s+/.test(line)) {
      const content = formatted.replace(/^\d+\.\s+/, '');
      return (
        <li
          key={idx}
          style={{ marginLeft: '20px', marginBottom: '6px', lineHeight: 1.6, listStyleType: 'decimal', fontSize: '0.88rem' }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      );
    }

    // Horizontal Rule
    if (/^---+$/.test(line.trim())) {
      return <hr key={idx} style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '12px 0' }} />;
    }

    if (!line.trim()) {
      return <div key={idx} style={{ height: '8px' }} />;
    }

    return (
      <p
        key={idx}
        style={{ margin: '0 0 8px', lineHeight: 1.6, fontSize: '0.88rem' }}
        dangerouslySetInnerHTML={{ __html: formatted }}
      />
    );
  });
}

function MetricCard({ label, value, sub, icon: Icon, color, bg }) {
  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: '20px',
        border: '1.5px solid #e2e8f0',
        padding: '20px 22px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        fontFamily: "var(--font-bold), 'Fredoka', cursive, sans-serif",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.07)';
        e.currentTarget.style.borderColor = '#cbd5e1';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.03)';
        e.currentTarget.style.borderColor = '#e2e8f0';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {label}
        </span>
        <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: bg, color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={19} />
        </div>
      </div>
      <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
        {sub}
      </div>
    </div>
  );
}

export default function AdminHomePage() {
  const { user } = useAuth();
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeModeId, setActiveModeId] = useState('triage');

  // Genius AI state
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        '🧠 **LovelyCrafts Operational AI Agent Online.**\nI have full, real-time awareness of your live orders, revenue, creator network, pending disbursements, and CRM lead pipeline. What operational objective or question would you like to tackle?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const chatScrollRef = useRef(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const token = await user.getIdToken();
        const res = await fetch('/api/admin/overview', { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) setOverview(await res.json());
      } catch {}
      setLoading(false);
    })();
  }, [user]);

  useEffect(() => {
    chatScrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, aiLoading]);

  const sendAiMessage = async (customText) => {
    const text = (customText || input).trim();
    if (!text || aiLoading || !user) return;

    setInput('');
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const updated = [...messages, { role: 'user', content: text, time: timeStr }];
    setMessages(updated);
    setAiLoading(true);

    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/admin/ai-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          prompt: text,
          page: '/admin',
          context: `Admin Home Command Center. Mode: ${activeModeId}. Gross Revenue: ₹${((overview?.revenue || 0) / 100).toFixed(2)}, Net Revenue: ₹${((overview?.netRevenue || 0) / 100).toFixed(2)}, Total Orders: ${overview?.totalOrders || 0}, Active Creators: ${overview?.activeCreators || 0}, Pending Payouts: ₹${((overview?.pending || 0) / 100).toFixed(2)}, Due CRM Leads: ${overview?.dueTodayCount || 0}`,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'AI calculation error');

      setMessages([
        ...updated,
        {
          role: 'assistant',
          content: data.reply || 'Strategic analysis completed.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      setMessages([
        ...updated,
        {
          role: 'assistant',
          content: `⚠️ **AI Intelligence Notice**: ${err.message}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setAiLoading(false);
    }
  };

  const copyText = (txt, idx) => {
    navigator.clipboard.writeText(txt);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const revenueRupees = overview?.revenue ? Math.round(overview.revenue / 100) : 0;
  const netRevenueRupees = overview?.netRevenue ? Math.round(overview.netRevenue / 100) : 0;
  const pendingPayoutsRupees = overview?.pending ? Math.round(overview.pending / 100) : 0;
  const pendingCRMCount = overview?.dueTodayCount || 0;
  const totalOrders = overview?.totalOrders || 0;
  const activeCreators = overview?.activeCreators || 0;
  const crmTotal = overview?.crmTotal || 0;

  const currentMode = AGENT_MODES.find((m) => m.id === activeModeId) || AGENT_MODES[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', fontFamily: "var(--font-bold), 'Fredoka', cursive, sans-serif" }}>
      {/* HERO COMMAND BANNER */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0b0f19 0%, #1e1b4b 50%, #1e3a8a 100%)',
          borderRadius: '24px',
          padding: '32px 36px',
          color: '#ffffff',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 15px 35px rgba(15, 23, 42, 0.4), 0 0 30px rgba(99, 102, 241, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
        }}
      >
        <div style={{ position: 'absolute', top: '-60px', right: '-40px', width: '260px', height: '260px', borderRadius: '50%', background: 'rgba(236,72,153,0.22)', filter: 'blur(45px)' }} />
        <div style={{ position: 'absolute', bottom: '-50px', left: '20%', width: '220px', height: '220px', borderRadius: '50%', background: 'rgba(56,189,248,0.18)', filter: 'blur(45px)' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 12px #4ade80' }} />
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              LovelyCrafts Operations Control
            </span>
          </div>

          <h1
            style={{
              fontSize: '2.15rem',
              fontWeight: 800,
              margin: '0 0 8px',
              letterSpacing: '-0.02em',
              color: '#ffffff',
              textShadow: '0 2px 10px rgba(0,0,0,0.3)',
            }}
          >
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'} Admin 👋
          </h1>

          <p style={{ color: '#e0e7ff', margin: '0 0 20px', fontSize: '0.98rem', fontWeight: 500, lineHeight: 1.5 }}>
            {loading ? 'Compiling store intelligence...' : `${totalOrders} orders completed · ₹${revenueRupees.toLocaleString('en-IN')} gross volume · ${activeCreators} active creator partners`}
          </p>

          {/* Quick Alert & Action Pills */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
            {pendingPayoutsRupees > 0 && (
              <Link
                href="/admin/payouts"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(251,191,36,0.22)',
                  border: '1.5px solid rgba(251,191,36,0.5)',
                  color: '#fef08a',
                  padding: '7px 16px',
                  borderRadius: '9999px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                }}
              >
                ⚠️ ₹{pendingPayoutsRupees.toLocaleString('en-IN')} Pending Payouts →
              </Link>
            )}

            {pendingCRMCount > 0 && (
              <Link
                href="/admin/crm"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(56,189,248,0.22)',
                  border: '1.5px solid rgba(56,189,248,0.5)',
                  color: '#bae6fd',
                  padding: '7px 16px',
                  borderRadius: '9999px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                📅 {pendingCRMCount} CRM Leads Due Today →
              </Link>
            )}

            <button
              type="button"
              onClick={() => sendAiMessage('What needs my attention first today? Triage pending payouts, CRM leads, and creator approvals.')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                border: 'none',
                color: '#ffffff',
                padding: '7px 18px',
                borderRadius: '9999px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
                transition: 'all 0.2s',
              }}
            >
              <SparklesIcon size={16} /> ⚡ Triage Now with AI
            </button>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(255,255,255,0.12)',
                border: '1.5px solid rgba(255,255,255,0.2)',
                color: '#ffffff',
                padding: '7px 16px',
                borderRadius: '9999px',
                fontSize: '0.8rem',
                fontWeight: 600,
                marginLeft: 'auto',
              }}
            >
              <span>● Operational AI Live</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <MetricCard label="Total Revenue" value={`₹${revenueRupees.toLocaleString('en-IN')}`} sub="Lifetime gross volume" icon={RupeeIcon} color="#059669" bg="#d1fae5" />
        <MetricCard label="Net Revenue" value={`₹${netRevenueRupees.toLocaleString('en-IN')}`} sub="After 2.36% gateway fees" icon={FinanceIcon} color="#0284c7" bg="#e0f2fe" />
        <MetricCard label="Total Orders" value={totalOrders} sub="Completed purchases" icon={OrdersIcon} color="#7c3aed" bg="#ede9fe" />
        <MetricCard label="Creator Partners" value={activeCreators} sub="Active partner network" icon={CreatorsIcon} color="#ec4899" bg="#fce7f3" />
        <MetricCard label="Pending Payouts" value={`₹${pendingPayoutsRupees.toLocaleString('en-IN')}`} sub="Awaiting bank transfer" icon={PayoutsIcon} color="#d97706" bg="#fef3c7" />
      </div>

      {/* AI COMMAND STUDIO */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '24px',
          border: '1.5px solid #e2e8f0',
          overflow: 'hidden',
          boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* STUDIO TOP HEADER */}
        <div
          style={{
            padding: '20px 24px',
            background: 'linear-gradient(135deg, #0b0f19 0%, #1e1b4b 60%, #1e293b 100%)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                boxShadow: '0 4px 15px rgba(99, 102, 241, 0.45)',
              }}
            >
              <SparklesIcon size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.01em' }}>
                  LovelyCrafts AI Command Studio
                </h2>
                <span style={{ fontSize: '0.7rem', background: 'rgba(34, 197, 94, 0.25)', color: '#4ade80', border: '1px solid rgba(34, 197, 94, 0.4)', padding: '2px 8px', borderRadius: '6px', fontWeight: 700 }}>
                  ● LIVE COPILOT
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#cbd5e1' }}>
                Real-time operational business analyst with live store context
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              setMessages([
                {
                  role: 'assistant',
                  content: '🧠 **Studio refreshed.** How can I assist your business growth and store operations?',
                  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                },
              ])
            }
            style={{
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.18)',
              color: '#e2e8f0',
              padding: '7px 15px',
              borderRadius: '10px',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <RefreshIcon size={14} /> Clear Studio
          </button>
        </div>

        {/* AGENT MODE SELECTOR TABS */}
        <div
          style={{
            padding: '12px 24px',
            background: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            overflowX: 'auto',
          }}
        >
          {AGENT_MODES.map((mode) => {
            const isSelected = activeModeId === mode.id;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => setActiveModeId(mode.id)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '12px',
                  border: isSelected ? '1.5px solid #6366f1' : '1px solid #e2e8f0',
                  background: isSelected ? '#ede9fe' : '#ffffff',
                  color: isSelected ? '#4338ca' : '#475569',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s',
                }}
              >
                {mode.label}
              </button>
            );
          })}
        </div>

        {/* 4 ACTION TRIGGER CARDS FOR THE ACTIVE MODE */}
        <div
          style={{
            padding: '18px 24px',
            background: '#ffffff',
            borderBottom: '1px solid #e2e8f0',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '14px',
          }}
        >
          {currentMode.powers.map((p) => (
            <div
              key={p.id}
              onClick={() => sendAiMessage(p.prompt)}
              style={{
                background: '#f8fafc',
                borderRadius: '16px',
                border: '1.5px solid #f1f5f9',
                padding: '16px',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.borderColor = '#c7d2fe';
                e.currentTarget.style.background = '#eef2ff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = '#f1f5f9';
                e.currentTarget.style.background = '#f8fafc';
              }}
            >
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1e1b4b' }}>{p.title}</div>
              <div style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.4 }}>{p.desc}</div>
              <div style={{ marginTop: 'auto', paddingTop: '8px', fontSize: '0.74rem', color: '#4f46e5', fontWeight: 700 }}>
                Execute Agent Query →
              </div>
            </div>
          ))}
        </div>

        {/* CHAT THREAD CONVERSATION BODY */}
        <div
          style={{
            height: '420px',
            padding: '24px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            background: '#fafafa',
          }}
        >
          {messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
                gap: '6px',
              }}
            >
              <div
                style={{
                  maxWidth: '85%',
                  padding: msg.role === 'user' ? '12px 18px' : '18px 22px',
                  borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  background: msg.role === 'user' ? 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)' : '#ffffff',
                  color: msg.role === 'user' ? '#ffffff' : '#0f172a',
                  border: msg.role === 'user' ? 'none' : '1.5px solid #e2e8f0',
                  boxShadow: msg.role === 'user' ? '0 4px 15px rgba(30, 27, 75, 0.25)' : '0 2px 10px rgba(0,0,0,0.03)',
                  position: 'relative',
                  wordBreak: 'break-word',
                }}
              >
                {msg.role === 'assistant' ? formatAiText(msg.content) : msg.content}

                {msg.role === 'assistant' && (
                  <button
                    type="button"
                    onClick={() => copyText(msg.content, idx)}
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: '#f1f5f9',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: '3px 8px',
                      fontSize: '0.7rem',
                      color: copiedIdx === idx ? '#059669' : '#64748b',
                      cursor: 'pointer',
                      fontWeight: 700,
                    }}
                  >
                    {copiedIdx === idx ? '✓ Copied' : 'Copy'}
                  </button>
                )}
              </div>

              <span style={{ fontSize: '0.7rem', color: '#94a3b8', padding: '0 6px' }}>{msg.time}</span>
            </div>
          ))}

          {aiLoading && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '14px 20px',
                background: '#ffffff',
                borderRadius: '16px',
                border: '1.5px solid #e2e8f0',
                width: 'fit-content',
              }}
            >
              <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#6366f1', animation: 'bounce 0.6s infinite alternate' }} />
              <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#8b5cf6', animation: 'bounce 0.6s infinite alternate 0.2s' }} />
              <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#ec4899', animation: 'bounce 0.6s infinite alternate 0.4s' }} />
              <span style={{ fontSize: '0.84rem', color: '#64748b', marginLeft: '6px', fontWeight: 600 }}>
                Agent analyzing live operations...
              </span>
            </div>
          )}

          <div ref={chatScrollRef} />
        </div>

        {/* INPUT BAR */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendAiMessage();
          }}
          style={{
            padding: '16px 24px',
            background: '#ffffff',
            borderTop: '1.5px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your AI agent anything about orders, creators, margins, payouts or CRM..."
            disabled={aiLoading}
            style={{
              flex: 1,
              padding: '12px 18px',
              borderRadius: '14px',
              border: '1.5px solid #cbd5e1',
              fontSize: '0.9rem',
              outline: 'none',
              background: '#f8fafc',
              color: '#0f172a',
              transition: 'border 0.2s',
            }}
            onFocus={(e) => (e.target.style.borderColor = '#6366f1')}
            onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
          />

          <button
            type="submit"
            disabled={!input.trim() || aiLoading}
            style={{
              padding: '12px 24px',
              borderRadius: '14px',
              background: input.trim() && !aiLoading ? 'linear-gradient(135deg, #1e1b4b 0%, #4338ca 100%)' : '#e2e8f0',
              color: input.trim() && !aiLoading ? '#ffffff' : '#94a3b8',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: input.trim() && !aiLoading ? 'pointer' : 'default',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s',
            }}
          >
            <SparklesIcon size={16} /> Send Query ↑
          </button>
        </form>
      </div>

      {/* QUICK WORKSPACE NAVIGATION TILES */}
      <div>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '0 0 14px' }}>
          Admin Workspaces & Tools
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
          {QUICK_NAV.map((action, i) => {
            const Icon = action.icon;
            return (
              <Link
                key={i}
                href={action.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  background: '#ffffff',
                  padding: '16px 18px',
                  borderRadius: '18px',
                  border: '1.5px solid #e2e8f0',
                  textDecoration: 'none',
                  color: '#0f172a',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.06)';
                  e.currentTarget.style.borderColor = '#cbd5e1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.02)';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }}
              >
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: action.bg,
                    color: action.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={20} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.88rem', fontWeight: 700 }}>{action.label}</span>
                  <span style={{ fontSize: '0.74rem', color: '#64748b' }}>{action.desc}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
