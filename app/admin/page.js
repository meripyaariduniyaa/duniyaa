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
  RefreshIcon
} from '@/components/admin/AdminIcons';

const QUICK_ACTIONS = [
  { label: 'View Orders', href: '/admin/orders', icon: OrdersIcon, color: '#0284c7', bg: '#e0f2fe' },
  { label: 'Manage Creators', href: '/admin/creators', icon: CreatorsIcon, color: '#7c3aed', bg: '#ede9fe' },
  { label: 'Finance Hub', href: '/admin/finance', icon: FinanceIcon, color: '#059669', bg: '#d1fae5' },
  { label: 'CRM Pipeline', href: '/admin/crm', icon: CrmIcon, color: '#dc2626', bg: '#fee2e2' },
  { label: 'Payouts', href: '/admin/payouts', icon: PayoutsIcon, color: '#d97706', bg: '#fef3c7' },
  { label: 'Coupons', href: '/admin/coupons', icon: CouponsIcon, color: '#ec4899', bg: '#fce7f3' },
  { label: 'Commissions', href: '/admin/commissions', icon: CommissionsIcon, color: '#0f172a', bg: '#f1f5f9' },
  { label: 'VIP Gifts', href: '/admin/creator-gifts', icon: GiftsIcon, color: '#8b5cf6', bg: '#ede9fe' },
];

const GENIUS_POWERS = [
  {
    id: 'growth',
    title: '⚡ 7-Day Growth Surge',
    desc: 'Generate immediate high-impact tactics to scale order volume this week.',
    prompt: 'Analyze our current order volume and suggest a high-impact 7-day marketing and conversion sprint for LovelyCrafts in India.',
  },
  {
    id: 'creators',
    title: '👑 Creator Recruitment & Scale',
    desc: 'Draft viral Instagram DM scripts and outreach hooks for top creators.',
    prompt: 'Write an irresistible, high-converting outreach DM and email sequence to recruit relationship/gift niche creators in India.',
  },
  {
    id: 'finance',
    title: '💰 Profit & Margin Optimizer',
    desc: 'Audit transaction fees, coupon discounts, and calculate net take-home margin.',
    prompt: 'Calculate and analyze our net profit margins after Razorpay fees and discounts, and suggest margin optimization rules.',
  },
  {
    id: 'promos',
    title: '🎟️ Festive Campaign Playbook',
    desc: 'Plan high-converting festive coupons & referral incentive structures.',
    prompt: 'Design a high-converting seasonal campaign with coupon codes, creator incentives, and WhatsApp viral sharing hooks.',
  },
];

function formatAiText(text = '') {
  const lines = text.split('\n');
  return lines.map((line, idx) => {
    let formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(/`([^`]+)`/g, '<code style="background:#f1f5f9;color:#0f172a;padding:2px 6px;border-radius:4px;font-size:0.85em;font-family:monospace;">$1</code>');

    if (/^[-*•]\s+/.test(line)) {
      const content = formatted.replace(/^[-*•]\s+/, '');
      return (
        <li
          key={idx}
          style={{ marginLeft: '18px', marginBottom: '4px', lineHeight: 1.6 }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      );
    }

    if (/^\d+\.\s+/.test(line)) {
      const content = formatted.replace(/^\d+\.\s+/, '');
      return (
        <li
          key={idx}
          style={{ marginLeft: '18px', marginBottom: '4px', lineHeight: 1.6, listStyleType: 'decimal' }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      );
    }

    if (!line.trim()) {
      return <div key={idx} style={{ height: '8px' }} />;
    }

    return (
      <p
        key={idx}
        style={{ margin: '0 0 6px', lineHeight: 1.6 }}
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
        border: '1.5px solid #f1f5f9',
        padding: '22px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        fontFamily: "var(--font-bold), 'Fredoka', cursive, sans-serif",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.07)';
        e.currentTarget.style.borderColor = '#e2e8f0';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.03)';
        e.currentTarget.style.borderColor = '#f1f5f9';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {label}
        </span>
        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: bg, color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={20} />
        </div>
      </div>
      <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
        {sub}
      </div>
    </div>
  );
}

export default function AdminHomePage() {
  const { user } = useAuth();
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  // Genius AI state
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "🧠 **Welcome to LovelyCrafts Genius AI Command Center.**\nI have full operational awareness of your live orders, revenue, creators, payouts, and CRM leads. What strategic or operational objective would you like to tackle right now?",
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
          context: `Gross Revenue: ₹${((overview?.revenue || 0) / 100).toFixed(2)}, Net Revenue: ₹${((overview?.netRevenue || 0) / 100).toFixed(2)}, Total Orders: ${overview?.totalOrders || 0}, Active Creators: ${overview?.activeCreators || 0}, Pending Payouts: ₹${((overview?.pending || 0) / 100).toFixed(2)}, Due CRM Leads: ${overview?.dueTodayCount || 0}`,
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
  const pendingPayoutsRupees = overview?.pending ? Math.round(overview.pending / 100) : 0;
  const pendingCRMCount = overview?.dueTodayCount || 0;
  const totalOrders = overview?.totalOrders || 0;
  const activeCreators = overview?.activeCreators || 0;
  const crmTotal = overview?.crmTotal || 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', fontFamily: "var(--font-bold), 'Fredoka', cursive, sans-serif" }}>

      {/* HERO HEADER — HIGH CONTRAST & CARTOONY INDIGO GRADIENT */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 45%, #1e3a8a 100%)',
          borderRadius: '24px',
          padding: '34px 36px',
          color: '#ffffff',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 15px 35px rgba(30, 27, 75, 0.3)',
        }}
      >
        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '240px', height: '240px', borderRadius: '50%', background: 'rgba(236,72,153,0.2)', filter: 'blur(35px)' }} />
        <div style={{ position: 'absolute', bottom: '-40px', left: '25%', width: '180px', height: '180px', borderRadius: '50%', background: 'rgba(56,189,248,0.18)', filter: 'blur(35px)' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 12px #4ade80' }} />
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              LovelyCrafts Command Center
            </span>
          </div>

          <h1
            style={{
              fontSize: '2.1rem',
              fontWeight: 800,
              margin: '0 0 8px',
              letterSpacing: '-0.02em',
              color: '#ffffff !important',
              textShadow: '0 2px 10px rgba(0,0,0,0.3)',
            }}
          >
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'} 👋
          </h1>

          <p style={{ color: '#e0e7ff', margin: '0 0 20px', fontSize: '0.98rem', fontWeight: 500, lineHeight: 1.5 }}>
            {loading ? 'Compiling store intelligence...' : `${totalOrders} orders completed · ₹${revenueRupees.toLocaleString('en-IN')} gross volume · ${activeCreators} active creators`}
          </p>

          {/* Quick Alert & Action Pills */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            {pendingPayoutsRupees > 0 && (
              <Link
                href="/admin/payouts"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(251,191,36,0.2)',
                  border: '1.5px solid rgba(251,191,36,0.45)',
                  color: '#fef08a',
                  padding: '7px 16px',
                  borderRadius: '9999px',
                  fontSize: '0.84rem',
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
                  background: 'rgba(56,189,248,0.2)',
                  border: '1.5px solid rgba(56,189,248,0.45)',
                  color: '#bae6fd',
                  padding: '7px 16px',
                  borderRadius: '9999px',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                📅 {pendingCRMCount} CRM Leads Due Today →
              </Link>
            )}

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255,255,255,0.12)',
                border: '1.5px solid rgba(255,255,255,0.2)',
                color: '#ffffff',
                padding: '7px 16px',
                borderRadius: '9999px',
                fontSize: '0.82rem',
                fontWeight: 600,
                marginLeft: 'auto',
              }}
            >
              <SparklesIcon size={16} />
              Genius AI Active · Mistral 7B
            </div>
          </div>
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <MetricCard label="Total Revenue" value={`₹${revenueRupees.toLocaleString('en-IN')}`} sub="Lifetime gross volume" icon={RupeeIcon} color="#059669" bg="#d1fae5" />
        <MetricCard label="Total Orders" value={totalOrders} sub="Completed purchases" icon={OrdersIcon} color="#0284c7" bg="#e0f2fe" />
        <MetricCard label="Creator Partners" value={activeCreators} sub="Active partner creators" icon={CreatorsIcon} color="#7c3aed" bg="#ede9fe" />
        <MetricCard label="Pending Payouts" value={`₹${pendingPayoutsRupees.toLocaleString('en-IN')}`} sub="Awaiting bank transfer" icon={PayoutsIcon} color="#d97706" bg="#fef3c7" />
        <MetricCard label="CRM Pipeline" value={crmTotal} sub={`${pendingCRMCount} follow-ups due`} icon={CrmIcon} color="#dc2626" bg="#fee2e2" />
      </div>

      {/* GENIUS AI COMMAND STUDIO — FULL POWERFUL INTERFACE ON HOMEPAGE */}
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
        {/* TOP BAR */}
        <div
          style={{
            padding: '18px 24px',
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
                width: '42px',
                height: '42px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                boxShadow: '0 4px 15px rgba(99, 102, 241, 0.45)',
              }}
            >
              <SparklesIcon size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.01em' }}>
                  LovelyCrafts Genius AI Studio
                </h2>
                <span style={{ fontSize: '0.7rem', background: 'rgba(34, 197, 94, 0.25)', color: '#4ade80', border: '1px solid rgba(34, 197, 94, 0.4)', padding: '2px 8px', borderRadius: '6px', fontWeight: 700 }}>
                  ● LIVE COPILOT
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#94a3b8' }}>
                Context-aware strategic business analyst powered by HuggingFace Mistral 7B
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              setMessages([
                {
                  role: 'assistant',
                  content: "🧠 **Studio refreshed.** How can I assist your business growth and store operations?",
                  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                },
              ])
            }
            style={{
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.18)',
              color: '#e2e8f0',
              padding: '6px 14px',
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

        {/* 4 GENIUS ACTION POWERS */}
        <div
          style={{
            padding: '16px 24px',
            background: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '12px',
          }}
        >
          {GENIUS_POWERS.map((power) => (
            <div
              key={power.id}
              onClick={() => sendAiMessage(power.prompt)}
              style={{
                background: '#ffffff',
                border: '1.5px solid #e2e8f0',
                borderRadius: '14px',
                padding: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '8px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#818cf8';
                e.currentTarget.style.background = '#f5f3ff';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(99, 102, 241, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div>
                <h3 style={{ margin: '0 0 4px', fontSize: '0.88rem', fontWeight: 800, color: '#1e1b4b' }}>
                  {power.title}
                </h3>
                <p style={{ margin: 0, fontSize: '0.76rem', color: '#64748b', lineHeight: 1.4 }}>
                  {power.desc}
                </p>
              </div>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#4f46e5', display: 'flex', alignItems: 'center', gap: '4px' }}>
                Run Strategy →
              </span>
            </div>
          ))}
        </div>

        {/* CHAT MESSAGES THREAD */}
        <div
          style={{
            minHeight: '340px',
            maxHeight: '520px',
            overflowY: 'auto',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            background: '#ffffff',
          }}
        >
          {messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
                gap: '4px',
              }}
            >
              <div
                style={{
                  maxWidth: '85%',
                  padding: msg.role === 'user' ? '12px 18px' : '18px 22px',
                  borderRadius: msg.role === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                  background: msg.role === 'user' ? 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)' : '#f8fafc',
                  color: msg.role === 'user' ? '#ffffff' : '#1e293b',
                  border: msg.role === 'user' ? 'none' : '1.5px solid #e2e8f0',
                  boxShadow: msg.role === 'user' ? '0 4px 15px rgba(30, 27, 75, 0.25)' : '0 2px 8px rgba(0,0,0,0.03)',
                  fontSize: '0.9rem',
                  position: 'relative',
                  wordBreak: 'break-word',
                  lineHeight: 1.6,
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
                      right: '12px',
                      background: '#ffffff',
                      border: '1px solid #cbd5e1',
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

              <span style={{ fontSize: '0.7rem', color: '#94a3b8', padding: '0 6px' }}>
                {msg.time}
              </span>
            </div>
          ))}

          {aiLoading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 20px', background: '#f8fafc', borderRadius: '18px', border: '1.5px solid #e2e8f0', width: 'fit-content' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#6366f1', animation: 'bounce 0.6s infinite alternate' }} />
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#8b5cf6', animation: 'bounce 0.6s infinite alternate 0.2s' }} />
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ec4899', animation: 'bounce 0.6s infinite alternate 0.4s' }} />
              <span style={{ fontSize: '0.84rem', color: '#64748b', fontWeight: 600 }}>Formulating genius operational intelligence...</span>
            </div>
          )}

          <div ref={chatScrollRef} />
        </div>

        {/* PROMPT CHIPS */}
        <div
          style={{
            padding: '10px 24px',
            background: '#f8fafc',
            borderTop: '1px solid #f1f5f9',
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            whiteSpace: 'nowrap',
          }}
        >
          {[
            '⚡ How to increase average order value?',
            '👑 Strategy to retain top creator partners',
            '💸 Optimize Razorpay transaction costs',
            '📈 30-day scaling roadmap for LovelyCrafts',
          ].map((promptText, i) => (
            <button
              key={i}
              type="button"
              onClick={() => sendAiMessage(promptText)}
              disabled={aiLoading}
              style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                padding: '6px 14px',
                borderRadius: '9999px',
                fontSize: '0.78rem',
                color: '#334155',
                fontWeight: 600,
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#6366f1';
                e.currentTarget.style.background = '#eef2ff';
                e.currentTarget.style.color = '#4338ca';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#cbd5e1';
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.color = '#334155';
              }}
            >
              {promptText}
            </button>
          ))}
        </div>

        {/* INPUT COMPOSER */}
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
            placeholder="Ask Genius AI anything about your store, creators, revenue, or marketing..."
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
              fontFamily: "var(--font-bold), 'Fredoka', cursive, sans-serif",
              transition: 'border 0.2s',
            }}
            onFocus={(e) => (e.target.style.borderColor = '#6366f1')}
            onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
          />

          <button
            type="submit"
            disabled={!input.trim() || aiLoading}
            style={{
              padding: '12px 22px',
              borderRadius: '14px',
              background: input.trim() && !aiLoading ? 'linear-gradient(135deg, #1e1b4b 0%, #4338ca 100%)' : '#e2e8f0',
              color: input.trim() && !aiLoading ? '#ffffff' : '#94a3b8',
              border: 'none',
              fontWeight: 800,
              fontSize: '0.88rem',
              cursor: input.trim() && !aiLoading ? 'pointer' : 'default',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: "var(--font-bold), 'Fredoka', cursive, sans-serif",
              transition: 'all 0.2s',
            }}
          >
            Ask Genius AI ↑
          </button>
        </form>
      </div>

      {/* OPERATIONS NAVIGATION GRID */}
      <div>
        <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '14px' }}>
          Operations & Hub Navigation
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '14px' }}>
          {QUICK_ACTIONS.map((a) => {
            const ActionIcon = a.icon;
            return (
              <Link
                key={a.href}
                href={a.href}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  padding: '22px 16px',
                  borderRadius: '18px',
                  background: '#ffffff',
                  border: '1.5px solid #e2e8f0',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.08)';
                  e.currentTarget.style.borderColor = '#cbd5e1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.02)';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }}
              >
                <div style={{ width: '46px', height: '46px', borderRadius: '14px', background: a.bg, color: a.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ActionIcon size={24} />
                </div>
                <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#1e293b', textAlign: 'center' }}>
                  {a.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

    </div>
  );
}
