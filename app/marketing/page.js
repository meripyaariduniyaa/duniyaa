'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import {
  SparklesIcon,
  MegaphoneIcon,
  InstagramIcon,
  WhatsAppIcon,
  TargetIcon,
  LightbulbIcon,
  CalendarIcon,
  ImageIcon,
  RefreshIcon,
  OrdersIcon,
  RupeeIcon,
  CloseIcon,
  DashboardIcon,
  DriveIcon,
  TrashIcon
} from '@/components/admin/AdminIcons';

const TABS = [
  { id: 'ideas', label: '💡 Ideas Vault', icon: LightbulbIcon },
  { id: 'instagram', label: '📸 Instagram Station', icon: InstagramIcon },
  { id: 'whatsapp', label: '💬 WhatsApp AI Agent', icon: WhatsAppIcon },
  { id: 'creative', label: '🎨 AI Creative Studio', icon: ImageIcon },
  { id: 'goals', label: '🎯 Goals & KPIs', icon: TargetIcon },
  { id: 'campaigns', label: '🗓️ Campaign Planner', icon: CalendarIcon },
];

export default function MarketingSuitePage() {
  const { user } = useAuth();
  const pathname = usePathname();
  const isEmbeddedInAdmin = pathname?.startsWith('/admin');
  const [activeTab, setActiveTab] = useState('ideas');
  const [loading, setLoading] = useState(true);

  // Data states
  const [ideas, setIdeas] = useState([]);
  const [goals, setGoals] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [instaPosts, setInstaPosts] = useState([]);
  const [waContacts, setWaContacts] = useState([]);

  // AI Generator state
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiOutput, setAiOutput] = useState('');
  const [generatedImg, setGeneratedImg] = useState('');
  const [copiedText, setCopiedText] = useState(false);

  // Forms / Modals state
  const [ideaForm, setIdeaForm] = useState({ title: '', channel: 'Instagram', category: 'Viral Growth', priority: 'High', description: '' });
  const [goalForm, setGoalForm] = useState({ title: '', metric: 'Revenue', current: 0, target: 100000, unit: '₹', deadline: '', strategy: '' });
  const [campaignForm, setCampaignForm] = useState({ name: '', objective: 'Sales Volume', budget: 5000, targetTemplate: 'Proposal Experience', couponCode: 'LOVE15', channels: ['Instagram', 'WhatsApp'] });
  const [instaPrompt, setInstaPrompt] = useState({ format: 'Reel', tone: 'Emotional Romance', template: 'Proposal Experience', customIdea: '' });
  const [waTemplateType, setWaTemplateType] = useState('order_delivery');
  const [imagePrompt, setImagePrompt] = useState('Aesthetic romantic digital gift card glowing with floating hearts, neon pink and gold lighting, elegant minimalist packaging');

  const fetchAllData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const token = await user.getIdToken();
      const headers = { Authorization: `Bearer ${token}` };

      const [ideasRes, goalsRes, campRes, instaRes, waRes] = await Promise.all([
        fetch('/api/admin/marketing/ideas', { headers }),
        fetch('/api/admin/marketing/goals', { headers }),
        fetch('/api/admin/marketing/campaigns', { headers }),
        fetch('/api/admin/marketing/instagram', { headers }),
        fetch('/api/admin/marketing/whatsapp', { headers }),
      ]);

      if (ideasRes.ok) setIdeas((await ideasRes.json()).ideas || []);
      if (goalsRes.ok) setGoals((await goalsRes.json()).goals || []);
      if (campRes.ok) setCampaigns((await campRes.json()).campaigns || []);
      if (instaRes.ok) setInstaPosts((await instaRes.json()).posts || []);
      if (waRes.ok) setWaContacts((await waRes.json()).contacts || []);
    } catch (e) {
      console.error('Failed to load marketing data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [user]);

  // AI Text Generator
  const runAiGeneration = async (prompt, mode = 'general', context = '') => {
    if (!user || aiGenerating) return;
    setAiGenerating(true);
    setAiOutput('');

    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/admin/marketing/ai-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ prompt, mode, context, type: 'text' }),
      });
      const data = await res.json();
      if (data.reply) {
        setAiOutput(data.reply);
      } else {
        setAiOutput('⚠️ Could not generate marketing copy.');
      }
    } catch (err) {
      setAiOutput(`⚠️ Error: ${err.message}`);
    } finally {
      setAiGenerating(false);
    }
  };

  // AI Image Generator
  const runAiImageGeneration = async () => {
    if (!user || aiGenerating) return;
    setAiGenerating(true);
    setGeneratedImg('');

    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/admin/marketing/ai-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ prompt: imagePrompt, type: 'image' }),
      });
      const data = await res.json();
      if (data.imageUrl) {
        setGeneratedImg(data.imageUrl);
      } else {
        alert(data.error || 'Failed to generate image');
      }
    } catch (err) {
      alert(`Image Generation error: ${err.message}`);
    } finally {
      setAiGenerating(false);
    }
  };

  // Save idea handler
  const handleSaveIdea = async (customIdea) => {
    if (!user) return;
    const item = customIdea || ideaForm;
    if (!item.title?.trim()) return;

    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/admin/marketing/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(item),
      });
      if (res.ok) {
        setIdeaForm({ title: '', channel: 'Instagram', category: 'Viral Growth', priority: 'High', description: '' });
        fetchAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Save goal handler
  const handleSaveGoal = async () => {
    if (!user || !goalForm.title.trim()) return;
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/admin/marketing/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(goalForm),
      });
      if (res.ok) {
        setGoalForm({ title: '', metric: 'Revenue', current: 0, target: 100000, unit: '₹', deadline: '', strategy: '' });
        fetchAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Save campaign handler
  const handleSaveCampaign = async () => {
    if (!user || !campaignForm.name.trim()) return;
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/admin/marketing/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(campaignForm),
      });
      if (res.ok) {
        setCampaignForm({ name: '', objective: 'Sales Volume', budget: 5000, targetTemplate: 'Proposal Experience', couponCode: 'LOVE15', channels: ['Instagram', 'WhatsApp'] });
        fetchAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Save Instagram Post to Queue
  const handleSaveInstaPost = async () => {
    if (!user || !aiOutput) return;
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/admin/marketing/instagram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          title: `${instaPrompt.format}: ${instaPrompt.template}`,
          format: instaPrompt.format,
          caption: aiOutput,
          imageUrl: generatedImg || null,
        }),
      });
      if (res.ok) {
        alert('✅ Post saved to Instagram Publishing Queue!');
        fetchAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // WhatsApp Message Formatter for specific contact
  const formatWaMessage = (contact) => {
    if (waTemplateType === 'order_delivery') {
      return `✨ Hey ${contact.name || 'there'}! LovelyCrafts AI here with your personalized digital surprise for ${contact.template || 'Special Experience'}. 💌\n\nYour experience link is ready to view and share with your loved one!\n\n🎟️ Special Upgrade Coupon: LOVE15 (15% OFF next order)\n\nLet us know if you loved it! ❤️`;
    }
    if (waTemplateType === 'creator_invite') {
      return `Hey ${contact.name || 'there'}! ✨ We run LovelyCrafts.in (India's viral digital surprise platform). We'd love to partner with you — you earn 10%–18% commission per order with instant automated tracking and bank payouts. Can we activate your creator partner link today? 🎁`;
    }
    if (waTemplateType === 'crm_followup') {
      return `Hi ${contact.name || 'there'}! Following up on our LovelyCrafts creator partnership invitation. We have a campaign launching this weekend with bonus creator rewards. Let me know if you'd like to get started! 🚀`;
    }
    return `Special announcement from LovelyCrafts! 💖 Enjoy 20% off all interactive surprise templates with code MIDNIGHT20. Check out lovelycrafts.in to surprise your special someone today!`;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div
      style={{
        minHeight: isEmbeddedInAdmin ? 'auto' : '100vh',
        background: isEmbeddedInAdmin ? 'transparent' : '#0b0f19',
        color: '#f8fafc',
        fontFamily: "var(--font-bold), 'Fredoka', cursive, sans-serif",
        padding: isEmbeddedInAdmin ? '0 0 40px' : '20px 28px 60px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
      }}
    >
      {/* STANDALONE TOP NAVIGATION BAR (LIKE /DRIVE & /DEL) */}
      {!isEmbeddedInAdmin && (
        <header
        style={{
          background: '#111827',
          border: '1px solid #1e293b',
          borderRadius: '16px',
          padding: '14px 22px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Link
            href="/admin"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: '#94a3b8',
              textDecoration: 'none',
              fontSize: '0.84rem',
              fontWeight: 700,
              padding: '6px 12px',
              borderRadius: '8px',
              background: '#1e293b',
              transition: 'all 0.15s ease',
            }}
          >
            <DashboardIcon size={15} />
            <span>Admin</span>
          </Link>
          <div style={{ width: '1px', height: '20px', background: '#334155' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                boxShadow: '0 0 12px rgba(236,72,153,0.4)',
              }}
            >
              <MegaphoneIcon size={18} />
            </div>
            <div>
              <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#f8fafc', display: 'block' }}>
                Marketing AI Suite
              </span>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>
                /marketing standalone studio
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div
            style={{
              background: 'rgba(56, 189, 248, 0.1)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              borderRadius: '999px',
              padding: '4px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.76rem',
              fontWeight: 700,
              color: '#38bdf8',
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#38bdf8', boxShadow: '0 0 8px #38bdf8' }} />
            HF Serverless + Cloudinary
          </div>

          <Link
            href="/drive"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: '#cbd5e1',
              textDecoration: 'none',
              fontSize: '0.82rem',
              fontWeight: 700,
              padding: '7px 12px',
              borderRadius: '10px',
              background: '#1e293b',
              border: '1px solid #334155',
            }}
          >
            <DriveIcon size={15} />
            <span>Drive</span>
          </Link>

          <Link
            href="/del"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: '#cbd5e1',
              textDecoration: 'none',
              fontSize: '0.82rem',
              fontWeight: 700,
              padding: '7px 12px',
              borderRadius: '10px',
              background: '#1e293b',
              border: '1px solid #334155',
            }}
          >
            <TrashIcon size={15} />
            <span>Cleanup</span>
          </Link>

          <button
            type="button"
            onClick={fetchAllData}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: '#cbd5e1',
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '10px',
              padding: '7px 12px',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <RefreshIcon size={15} />
            <span>Refresh</span>
          </button>
        </div>
      </header>
      )}

      {/* SUITE HERO HEADER */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 45%, #701a75 100%)',
          borderRadius: '24px',
          padding: '32px',
          color: '#ffffff',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 15px 35px rgba(30, 27, 75, 0.3)',
        }}
      >
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '220px', height: '220px', borderRadius: '50%', background: 'rgba(236,72,153,0.22)', filter: 'blur(30px)' }} />
        <div style={{ position: 'absolute', bottom: '-40px', left: '30%', width: '180px', height: '180px', borderRadius: '50%', background: 'rgba(56,189,248,0.2)', filter: 'blur(30px)' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ec4899', boxShadow: '0 0 12px #ec4899' }} />
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#fbcfe8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              LovelyCrafts Marketing AI Engine
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1 style={{ fontSize: '2.1rem', fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.02em', color: '#ffffff !important' }}>
                AI Digital Marketing Suite 🚀
              </h1>
              <p style={{ color: '#fdf2f8', margin: 0, fontSize: '0.95rem', fontWeight: 500, lineHeight: 1.5 }}>
                Multi-model AI generation for viral Instagram Reels, WhatsApp outreach agents, campaign planning, and growth goals.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('ideas');
                  runAiGeneration('Brainstorm 3 viral growth hacks and promotional campaign angles for LovelyCrafts relationship surprises in India.', 'marketing_strategy');
                }}
                style={{
                  background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
                  color: '#fff',
                  border: 'none',
                  padding: '10px 18px',
                  borderRadius: '14px',
                  fontWeight: 800,
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(236,72,153,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <SparklesIcon size={18} />
                Generate Growth Strategy
              </button>
            </div>
          </div>

          {/* METRIC BADGES */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '20px', flexWrap: 'wrap' }}>
            <div style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', padding: '6px 14px', borderRadius: '12px', fontSize: '0.82rem', fontWeight: 600 }}>
              💡 {ideas.length} Ideas Stored
            </div>
            <div style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', padding: '6px 14px', borderRadius: '12px', fontSize: '0.82rem', fontWeight: 600 }}>
              📸 {instaPosts.length} Instagram Posts Queued
            </div>
            <div style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', padding: '6px 14px', borderRadius: '12px', fontSize: '0.82rem', fontWeight: 600 }}>
              💬 {waContacts.length} WhatsApp Contacts
            </div>
            <div style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', padding: '6px 14px', borderRadius: '12px', fontSize: '0.82rem', fontWeight: 600 }}>
              🎯 {goals.length} Strategic Goals
            </div>
            <div style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', padding: '6px 14px', borderRadius: '12px', fontSize: '0.82rem', fontWeight: 600 }}>
              🗓️ {campaigns.length} Active Campaigns
            </div>
          </div>
        </div>
      </div>

      {/* NAVIGATION TABS RIBBON */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          background: '#ffffff',
          padding: '8px',
          borderRadius: '18px',
          border: '1.5px solid #e2e8f0',
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
        }}
      >
        {TABS.map((tab) => {
          const TabIcon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '12px',
                border: 'none',
                background: isActive ? 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)' : 'transparent',
                color: isActive ? '#ffffff' : '#475569',
                fontWeight: 800,
                fontSize: '0.88rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <TabIcon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 1: IDEAS VAULT & STRATEGY BANK */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'ideas' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          
          {/* AI IDEA GENERATOR & CREATION */}
          <div style={{ background: '#ffffff', borderRadius: '20px', border: '1.5px solid #e2e8f0', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <LightbulbIcon size={20} />
              </div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                AI Marketing Idea Brainstormer
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Target Channel:</label>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {['Instagram Reels', 'WhatsApp Viral', 'Creator Blitz', 'SEO / Blog', 'Festive Promo'].map((ch) => (
                  <button
                    key={ch}
                    type="button"
                    onClick={() => setIdeaForm({ ...ideaForm, channel: ch })}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      border: ideaForm.channel === ch ? '1.5px solid #6366f1' : '1px solid #e2e8f0',
                      background: ideaForm.channel === ch ? '#eef2ff' : '#f8fafc',
                      color: ideaForm.channel === ch ? '#4338ca' : '#475569',
                      cursor: 'pointer',
                    }}
                  >
                    {ch}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Idea Title / Theme:</label>
              <input
                type="text"
                value={ideaForm.title}
                onChange={(e) => setIdeaForm({ ...ideaForm, title: e.target.value })}
                placeholder="e.g. Midnight 12AM Surprise Viral Reel Series"
                style={{ padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '0.88rem', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() =>
                  runAiGeneration(
                    `Generate 3 distinct creative marketing campaign angles for: ${ideaForm.title || ideaForm.channel}. Include target audience, viral hook, and step-by-step execution.`,
                    'marketing_strategy'
                  )
                }
                disabled={aiGenerating}
                style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #1e1b4b 0%, #4338ca 100%)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <SparklesIcon size={16} /> {aiGenerating ? 'Brainstorming...' : 'AI Brainstorm Concept'}
              </button>

              <button
                type="button"
                onClick={() => handleSaveIdea()}
                style={{
                  background: '#059669',
                  color: '#fff',
                  border: 'none',
                  padding: '12px 18px',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                }}
              >
                + Save Idea
              </button>
            </div>

            {aiOutput && (
              <div style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '14px', padding: '16px', marginTop: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.82rem', color: '#1e1b4b' }}>💡 AI Concept Result:</span>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={() => handleSaveIdea({ title: ideaForm.title || 'AI Generated Campaign', description: aiOutput, channel: ideaForm.channel, category: 'AI Generated', priority: 'High' })}
                      style={{ background: '#eef2ff', border: '1px solid #818cf8', color: '#4338ca', padding: '3px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}
                    >
                      Save as Idea
                    </button>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(aiOutput)}
                      style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '3px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}
                    >
                      {copiedText ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
                <div style={{ fontSize: '0.84rem', color: '#334155', lineHeight: 1.5, whiteSpace: 'pre-line' }}>
                  {aiOutput}
                </div>
              </div>
            )}
          </div>

          {/* STORED IDEAS LIST */}
          <div style={{ background: '#ffffff', borderRadius: '20px', border: '1.5px solid #e2e8f0', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Stored Marketing Ideas ({ideas.length})
              </h2>
              <span style={{ fontSize: '0.74rem', color: '#64748b' }}>Status Kanban Ready</span>
            </div>

            {ideas.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}>
                <LightbulbIcon size={32} />
                <p style={{ marginTop: '10px', fontSize: '0.88rem' }}>No marketing ideas saved yet. Use the AI brainstormer above to generate ideas!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '550px', overflowY: 'auto' }}>
                {ideas.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      background: '#f8fafc',
                      border: '1.5px solid #e2e8f0',
                      borderRadius: '14px',
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h3 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 800, color: '#1e1b4b' }}>
                        {item.title}
                      </h3>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '6px',
                          background: item.priority === 'High' ? '#fee2e2' : '#fef3c7',
                          color: item.priority === 'High' ? '#dc2626' : '#d97706',
                        }}
                      >
                        {item.priority}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.72rem', background: '#e0f2fe', color: '#0284c7', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
                        {item.channel}
                      </span>
                      <span style={{ fontSize: '0.72rem', background: '#f1f5f9', color: '#475569', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
                        {item.status || 'Draft'}
                      </span>
                    </div>

                    {item.description && (
                      <p style={{ margin: 0, fontSize: '0.8rem', color: '#475569', lineHeight: 1.4, whiteSpace: 'pre-line' }}>
                        {item.description.slice(0, 180)}...
                      </p>
                    )}

                    <div style={{ display: 'flex', gap: '8px', marginTop: '6px', justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('instagram');
                          runAiGeneration(`Write a complete Instagram Reel script based on this idea: ${item.title} - ${item.description}`, 'reel_script');
                        }}
                        style={{ background: '#eef2ff', border: '1px solid #818cf8', color: '#4338ca', padding: '4px 10px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}
                      >
                        Create Reel Script →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 2: INSTAGRAM STRATEGY & POST STATION */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'instagram' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          
          {/* REEL SCRIPT & CAPTION CREATOR */}
          <div style={{ background: '#ffffff', borderRadius: '20px', border: '1.5px solid #e2e8f0', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#fce7f3', color: '#ec4899', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <InstagramIcon size={20} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Instagram Reel & Caption Studio
                </h2>
                <p style={{ margin: 0, fontSize: '0.76rem', color: '#64748b' }}>
                  AI viral hook generator with trending hashtag recommendations
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              {['Reel', 'Carousel Post', 'Story Hack'].map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setInstaPrompt({ ...instaPrompt, format: fmt })}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    border: instaPrompt.format === fmt ? '1.5px solid #ec4899' : '1px solid #e2e8f0',
                    background: instaPrompt.format === fmt ? '#fdf2f8' : '#f8fafc',
                    color: instaPrompt.format === fmt ? '#be185d' : '#475569',
                    cursor: 'pointer',
                  }}
                >
                  {fmt}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Template to Feature:</label>
              <select
                value={instaPrompt.template}
                onChange={(e) => setInstaPrompt({ ...instaPrompt, template: e.target.value })}
                style={{ padding: '10px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '0.88rem', outline: 'none' }}
              >
                <option value="Proposal Experience">The Perfect Proposal Experience</option>
                <option value="Birthday Experience">Virtual Birthday Surprise</option>
                <option value="Anniversary Romance">Anniversary Special romance</option>
                <option value="Apology Letter">Heartfelt Apology Letter</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Angle / Hook Concept:</label>
              <input
                type="text"
                value={instaPrompt.customIdea}
                onChange={(e) => setInstaPrompt({ ...instaPrompt, customIdea: e.target.value })}
                placeholder="e.g. He cried at 12:00 AM when this opened..."
                style={{ padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '0.88rem', outline: 'none' }}
              />
            </div>

            <button
              type="button"
              onClick={() =>
                runAiGeneration(
                  `Create a viral Instagram ${instaPrompt.format} script and caption for LovelyCrafts featuring "${instaPrompt.template}". Hook angle: ${instaPrompt.customIdea || 'Midnight relationship surprise reaction'}. Include on-screen text, audio suggestion, caption, and 15 hashtags.`,
                  instaPrompt.format === 'Reel' ? 'reel_script' : 'instagram_caption'
                )
              }
              disabled={aiGenerating}
              style={{
                background: 'linear-gradient(135deg, #ec4899 0%, #7c3aed 100%)',
                color: '#ffffff',
                border: 'none',
                padding: '12px',
                borderRadius: '12px',
                fontWeight: 800,
                fontSize: '0.88rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <SparklesIcon size={18} /> {aiGenerating ? 'Generating Script...' : `Generate Viral ${instaPrompt.format} Script`}
            </button>

            {aiOutput && (
              <div style={{ background: '#fdf2f8', border: '1.5px solid #fbcfe8', borderRadius: '14px', padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.84rem', color: '#831843' }}>📸 Generated Instagram Content:</span>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={handleSaveInstaPost}
                      style={{ background: '#059669', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '6px', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer' }}
                    >
                      + Save to Queue
                    </button>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(aiOutput)}
                      style={{ background: '#ffffff', border: '1px solid #cbd5e1', padding: '4px 8px', borderRadius: '6px', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer' }}
                    >
                      {copiedText ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
                <div style={{ fontSize: '0.84rem', color: '#1e293b', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                  {aiOutput}
                </div>
              </div>
            )}
          </div>

          {/* INSTAGRAM QUEUE & CALENDAR */}
          <div style={{ background: '#ffffff', borderRadius: '20px', border: '1.5px solid #e2e8f0', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Instagram Publishing Queue ({instaPosts.length})
            </h2>

            {instaPosts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}>
                <InstagramIcon size={32} />
                <p style={{ marginTop: '10px', fontSize: '0.88rem' }}>No posts queued yet. Generate a Reel script and click "+ Save to Queue"!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '550px', overflowY: 'auto' }}>
                {instaPosts.map((post) => (
                  <div
                    key={post.id}
                    style={{
                      background: '#f8fafc',
                      border: '1.5px solid #e2e8f0',
                      borderRadius: '14px',
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.88rem', color: '#1e1b4b' }}>
                        {post.title}
                      </span>
                      <span style={{ fontSize: '0.7rem', background: '#fdf2f8', color: '#be185d', padding: '2px 8px', borderRadius: '6px', fontWeight: 700 }}>
                        {post.format || 'Reel'}
                      </span>
                    </div>

                    <p style={{ margin: 0, fontSize: '0.78rem', color: '#475569', lineHeight: 1.4, whiteSpace: 'pre-line' }}>
                      {post.caption.slice(0, 160)}...
                    </p>

                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '4px' }}>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(post.caption)}
                        style={{ background: '#ffffff', border: '1px solid #cbd5e1', padding: '4px 10px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}
                      >
                        Copy Caption
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 3: WHATSAPP AI AGENT & CONTACT BROADCAST */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'whatsapp' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* TEMPLATE PICKER */}
          <div style={{ background: '#ffffff', borderRadius: '20px', border: '1.5px solid #e2e8f0', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <WhatsAppIcon size={20} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  LovelyCrafts WhatsApp AI Outreach Agent
                </h2>
                <p style={{ margin: 0, fontSize: '0.76rem', color: '#64748b' }}>
                  1-Click direct WhatsApp launch (`wa.me`) with personalized dynamic placeholders
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[
                { id: 'order_delivery', label: '💌 Order Delivery & Gift Link' },
                { id: 'creator_invite', label: '🎁 VIP Creator Partnership Invite' },
                { id: 'crm_followup', label: '⏰ CRM Lead Follow-up' },
                { id: 'festive_discount', label: '🎟️ Flash Sale / Coupon Promo' },
              ].map((tmpl) => (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => setWaTemplateType(tmpl.id)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '10px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    border: waTemplateType === tmpl.id ? '1.5px solid #16a34a' : '1px solid #e2e8f0',
                    background: waTemplateType === tmpl.id ? '#f0fdf4' : '#f8fafc',
                    color: waTemplateType === tmpl.id ? '#15803d' : '#475569',
                    cursor: 'pointer',
                  }}
                >
                  {tmpl.label}
                </button>
              ))}
            </div>

            {/* PREVIEW OF ACTIVE TEMPLATE */}
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '14px', fontSize: '0.84rem', color: '#166534', lineHeight: 1.5, whiteSpace: 'pre-line' }}>
              <strong>Preview Template:</strong>
              <div style={{ marginTop: '4px' }}>{formatWaMessage({ name: 'Rahul', template: 'Proposal Experience' })}</div>
            </div>
          </div>

          {/* CONTACTS TABLE WITH DIRECT 1-CLICK WA.ME DISPATCH */}
          <div style={{ background: '#ffffff', borderRadius: '20px', border: '1.5px solid #e2e8f0', padding: '24px' }}>
            <h3 style={{ margin: '0 0 14px', fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
              Synced Outreach Contacts ({waContacts.length})
            </h3>

            {waContacts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}>
                <WhatsAppIcon size={32} />
                <p style={{ marginTop: '10px', fontSize: '0.88rem' }}>No contacts found in Orders or CRM leads yet.</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1.5px solid #e2e8f0', color: '#64748b' }}>
                      <th style={{ padding: '10px 12px' }}>Name</th>
                      <th style={{ padding: '10px 12px' }}>Phone Number</th>
                      <th style={{ padding: '10px 12px' }}>Source</th>
                      <th style={{ padding: '10px 12px', textAlign: 'right' }}>WhatsApp Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {waContacts.map((c, i) => {
                      const msg = formatWaMessage(c);
                      const waUrl = `https://wa.me/${c.phone.startsWith('91') ? c.phone : `91${c.phone}`}?text=${encodeURIComponent(msg)}`;
                      return (
                        <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '12px', fontWeight: 700, color: '#1e293b' }}>{c.name}</td>
                          <td style={{ padding: '12px', color: '#475569' }}>+{c.phone}</td>
                          <td style={{ padding: '12px' }}>
                            <span style={{ fontSize: '0.72rem', background: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '6px', fontWeight: 600 }}>
                              {c.source}
                            </span>
                          </td>
                          <td style={{ padding: '12px', textAlign: 'right' }}>
                            <a
                              href={waUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                background: '#16a34a',
                                color: '#ffffff',
                                padding: '6px 14px',
                                borderRadius: '8px',
                                textDecoration: 'none',
                                fontWeight: 700,
                                fontSize: '0.78rem',
                                boxShadow: '0 2px 8px rgba(22, 163, 74, 0.3)',
                              }}
                            >
                              <WhatsAppIcon size={14} /> Send WhatsApp →
                            </a>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 4: AI MULTI-MODEL CREATIVE STUDIO (IMAGE + TEXT) */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'creative' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          
          {/* FLUX / SDXL IMAGE GENERATOR */}
          <div style={{ background: '#ffffff', borderRadius: '20px', border: '1.5px solid #e2e8f0', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#ede9fe', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ImageIcon size={20} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  AI Social Media Graphic Generator
                </h2>
                <p style={{ margin: 0, fontSize: '0.76rem', color: '#64748b' }}>
                  Powered by FLUX.1 & Stable Diffusion XL via Hugging Face
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Image Visual Prompt:</label>
              <textarea
                rows={3}
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                placeholder="Describe the Instagram post visual or promotional banner..."
                style={{ padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '0.86rem', outline: 'none', resize: 'vertical' }}
              />
            </div>

            <button
              type="button"
              onClick={runAiImageGeneration}
              disabled={aiGenerating}
              style={{
                background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
                color: '#ffffff',
                border: 'none',
                padding: '12px',
                borderRadius: '12px',
                fontWeight: 800,
                fontSize: '0.88rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <SparklesIcon size={18} /> {aiGenerating ? 'Generating Image with FLUX...' : 'Generate High-Res Social Visual'}
            </button>

            {generatedImg && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', background: '#f8fafc', padding: '16px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                <img
                  src={generatedImg}
                  alt="AI Generated Social Visual"
                  style={{ width: '100%', maxHeight: '350px', objectFit: 'contain', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
                />
                <a
                  href={generatedImg}
                  download="lovelycrafts-ai-marketing.png"
                  style={{ background: '#059669', color: '#fff', padding: '6px 14px', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '0.78rem' }}
                >
                  Download Image (PNG)
                </a>
              </div>
            )}
          </div>

          {/* COPYWRITING PLAYBOOK */}
          <div style={{ background: '#ffffff', borderRadius: '20px', border: '1.5px solid #e2e8f0', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              AI Multi-Channel Copywriting Workshop
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {[
                { title: 'Meta Ad Copy', prompt: 'Write 2 high-converting Meta/Facebook ad copies targeting boyfriend/girlfriend anniversary gifts in India.' },
                { title: 'Email Newsletter', prompt: 'Write a heartwarming weekly email newsletter for LovelyCrafts customers celebrating upcoming relationship milestones.' },
                { title: 'Creator Pitch DM', prompt: 'Write 3 short, punchy Instagram DMs to recruit lifestyle creators for LovelyCrafts.' },
                { title: 'Urgency Push Copy', prompt: 'Write 3 midnight urgency notification copies for last-minute digital gift buyers.' },
              ].map((btn, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => runAiGeneration(btn.prompt, 'marketing_strategy')}
                  style={{
                    background: '#f8fafc',
                    border: '1.5px solid #e2e8f0',
                    padding: '12px',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: '#334155',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  ✨ {btn.title}
                </button>
              ))}
            </div>

            {aiOutput && (
              <div style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '14px', padding: '16px', maxHeight: '350px', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.84rem', color: '#1e1b4b' }}>Generated Copy:</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(aiOutput)}
                    style={{ background: '#ffffff', border: '1px solid #cbd5e1', padding: '4px 8px', borderRadius: '6px', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    {copiedText ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
                <div style={{ fontSize: '0.84rem', color: '#334155', lineHeight: 1.5, whiteSpace: 'pre-line' }}>
                  {aiOutput}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 5: GOALS & KPIS TRACKER */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'goals' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          
          {/* CREATE GOAL FORM */}
          <div style={{ background: '#ffffff', borderRadius: '20px', border: '1.5px solid #e2e8f0', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              + Create Strategic Marketing Goal
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Goal Objective:</label>
              <input
                type="text"
                value={goalForm.title}
                onChange={(e) => setGoalForm({ ...goalForm, title: e.target.value })}
                placeholder="e.g. Achieve ₹1,00,000 Monthly Digital Surprise Revenue"
                style={{ padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '0.88rem', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Current Value:</label>
                <input
                  type="number"
                  value={goalForm.current}
                  onChange={(e) => setGoalForm({ ...goalForm, current: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '0.88rem', outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Target Target:</label>
                <input
                  type="number"
                  value={goalForm.target}
                  onChange={(e) => setGoalForm({ ...goalForm, target: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '0.88rem', outline: 'none' }}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleSaveGoal}
              style={{
                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                color: '#ffffff',
                border: 'none',
                padding: '12px',
                borderRadius: '12px',
                fontWeight: 800,
                fontSize: '0.88rem',
                cursor: 'pointer',
              }}
            >
              + Save Marketing Goal
            </button>
          </div>

          {/* ACTIVE GOALS LIST & PROGRESS BARS */}
          <div style={{ background: '#ffffff', borderRadius: '20px', border: '1.5px solid #e2e8f0', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Marketing KPI Milestones ({goals.length})
            </h2>

            {goals.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}>
                <TargetIcon size={32} />
                <p style={{ marginTop: '10px', fontSize: '0.88rem' }}>No marketing goals created yet. Set your monthly revenue and reach targets!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {goals.map((g) => {
                  const percent = Math.min(100, Math.round(((Number(g.current) || 0) / (Number(g.target) || 1)) * 100));
                  return (
                    <div
                      key={g.id}
                      style={{
                        background: '#f8fafc',
                        border: '1.5px solid #e2e8f0',
                        borderRadius: '14px',
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 800, fontSize: '0.92rem', color: '#1e1b4b' }}>{g.title}</span>
                        <span style={{ fontSize: '0.78rem', fontWeight: 800, color: percent >= 100 ? '#059669' : '#4338ca' }}>
                          {percent}%
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden' }}>
                        <div style={{ width: `${percent}%`, height: '100%', background: 'linear-gradient(90deg, #6366f1, #059669)', transition: 'width 0.3s' }} />
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: '#64748b' }}>
                        <span>Current: {g.unit || ''}{g.current}</span>
                        <span>Target: {g.unit || ''}{g.target}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 6: CAMPAIGN PLANNER & TIMELINE */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'campaigns' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          
          {/* CREATE CAMPAIGN */}
          <div style={{ background: '#ffffff', borderRadius: '20px', border: '1.5px solid #e2e8f0', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              + Launch Multi-Channel Campaign
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Campaign Name:</label>
              <input
                type="text"
                value={campaignForm.name}
                onChange={(e) => setCampaignForm({ ...campaignForm, name: e.target.value })}
                placeholder="e.g. Diwali Love & Light Viral Campaign"
                style={{ padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '0.88rem', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Coupon Code:</label>
                <input
                  type="text"
                  value={campaignForm.couponCode}
                  onChange={(e) => setCampaignForm({ ...campaignForm, couponCode: e.target.value.toUpperCase() })}
                  placeholder="LOVE15"
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '0.88rem', outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Budget (₹):</label>
                <input
                  type="number"
                  value={campaignForm.budget}
                  onChange={(e) => setCampaignForm({ ...campaignForm, budget: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '0.88rem', outline: 'none' }}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleSaveCampaign}
              style={{
                background: 'linear-gradient(135deg, #1e1b4b 0%, #4338ca 100%)',
                color: '#ffffff',
                border: 'none',
                padding: '12px',
                borderRadius: '12px',
                fontWeight: 800,
                fontSize: '0.88rem',
                cursor: 'pointer',
              }}
            >
              + Create Campaign
            </button>
          </div>

          {/* ACTIVE CAMPAIGNS */}
          <div style={{ background: '#ffffff', borderRadius: '20px', border: '1.5px solid #e2e8f0', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Planned Campaigns ({campaigns.length})
            </h2>

            {campaigns.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}>
                <CalendarIcon size={32} />
                <p style={{ marginTop: '10px', fontSize: '0.88rem' }}>No marketing campaigns planned yet.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {campaigns.map((c) => (
                  <div
                    key={c.id}
                    style={{
                      background: '#f8fafc',
                      border: '1.5px solid #e2e8f0',
                      borderRadius: '14px',
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.92rem', color: '#1e1b4b' }}>{c.name}</span>
                      <span style={{ fontSize: '0.72rem', background: '#d1fae5', color: '#065f46', padding: '2px 8px', borderRadius: '6px', fontWeight: 700 }}>
                        {c.status || 'Active'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', fontSize: '0.76rem', color: '#64748b' }}>
                      <span>🎟️ Code: <strong>{c.couponCode || 'N/A'}</strong></span>
                      <span>💰 Budget: <strong>₹{c.budget}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
