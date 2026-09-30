'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { SparklesIcon, CloseIcon, RefreshIcon } from '@/components/admin/AdminIcons';
import { getAdminAiPageProfile } from '@/lib/admin-ai-context';

function formatMarkdown(text = '') {
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
            margin: '6px 0',
            padding: '6px 12px',
            background: '#f8fafc',
            borderLeft: '3px solid #6366f1',
            borderRadius: '0 8px 8px 0',
            fontStyle: 'italic',
            fontSize: '0.85rem',
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
          style={{ marginLeft: '16px', marginBottom: '4px', lineHeight: 1.5, fontSize: '0.84rem' }}
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
          style={{ marginLeft: '16px', marginBottom: '4px', lineHeight: 1.5, listStyleType: 'decimal', fontSize: '0.84rem' }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      );
    }

    // Horizontal Rule
    if (/^---+$/.test(line.trim())) {
      return <hr key={idx} style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '8px 0' }} />;
    }

    if (!line.trim()) {
      return <div key={idx} style={{ height: '6px' }} />;
    }

    return (
      <p
        key={idx}
        style={{ margin: '0 0 6px', lineHeight: 1.55, fontSize: '0.84rem' }}
        dangerouslySetInnerHTML={{ __html: formatted }}
      />
    );
  });
}

export default function AdminAiCopilot() {
  const { user } = useAuth();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const activeProfile = getAdminAiPageProfile(pathname);

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `👋 **LovelyCrafts AI Copilot Ready.**\nI have real-time operational context for **${activeProfile.title}**. What would you like to inspect or execute?`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatBottomRef = useRef(null);
  const inputRef = useRef(null);

  // When pathname changes, keep assistant aligned with current page
  useEffect(() => {
    if (pathname === '/admin') return;
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages((prev) => [
      ...prev,
      {
        role: 'assistant',
        content: `📍 Switched focus to **${activeProfile.title}** (${activeProfile.badge}). Scope: *${activeProfile.scope}*.\nAsk me to audit this page or summarize current status.`,
        time: timeStr,
      },
    ]);
  }, [pathname]);

  // Auto-scroll when new messages arrive
  useEffect(() => {
    if (isOpen && !isMinimized) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized]);

  // Focus input on open
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, isMinimized]);

  // Keyboard shortcut Ctrl+Space or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        setIsMinimized(false);
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSend = async (customPrompt) => {
    const text = (customPrompt || input).trim();
    if (!text || loading || !user) return;

    setInput('');
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const nextMessages = [...messages, { role: 'user', content: text, time: timeStr }];
    setMessages(nextMessages);
    setLoading(true);

    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/admin/ai-insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          prompt: text,
          page: pathname,
          context: `Admin is currently on screen: ${activeProfile.title} (${pathname}). Focus: ${activeProfile.scope}.`,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to get AI response');

      setMessages([
        ...nextMessages,
        {
          role: 'assistant',
          content: data.reply || 'Operational analysis completed.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      setMessages([
        ...nextMessages,
        {
          role: 'assistant',
          content: `⚠️ **AI Intelligence Notice**: ${err.message}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleResetChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: `🔄 Conversation refreshed. I'm ready to assist with **${activeProfile.title}** or anything across LovelyCrafts!`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  // Do not render floating bubble on /admin because /admin has the full AI Command Center Studio embedded
  if (pathname === '/admin') {
    return null;
  }

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999, fontFamily: "var(--font-bold), 'Fredoka', cursive, sans-serif" }}>
      {/* FLOATING TRIGGER PILL */}
      {(!isOpen || isMinimized) && (
        <button
          type="button"
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          aria-label="Open AI Copilot"
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '11px 18px',
            borderRadius: '9999px',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)',
            color: '#ffffff',
            border: '1.5px solid rgba(255, 255, 255, 0.22)',
            boxShadow: '0 12px 30px rgba(15, 23, 42, 0.45), 0 0 20px rgba(99, 102, 241, 0.35)',
            cursor: 'pointer',
            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            outline: 'none',
          }}
          className="admin-copilot-trigger"
        >
          {/* Subtle Glow Ring */}
          <div
            style={{
              position: 'absolute',
              inset: '-2px',
              borderRadius: '9999px',
              background: 'linear-gradient(135deg, #6366f1, #ec4899, #38bdf8)',
              zIndex: -1,
              opacity: 0.8,
              filter: 'blur(5px)',
              animation: 'copilotPulse 3s ease-in-out infinite',
            }}
          />

          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              boxShadow: '0 2px 8px rgba(236, 72, 153, 0.5)',
            }}
          >
            <SparklesIcon size={16} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '-0.01em', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px' }}>
              AI Copilot
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px #22c55e' }} />
            </span>
            <span style={{ fontSize: '0.68rem', color: '#cbd5e1', fontWeight: 500 }}>
              ⌘K · {activeProfile.badge}
            </span>
          </div>
        </button>
      )}

      {/* EXPANDED COPILOT PANEL */}
      {isOpen && !isMinimized && (
        <div
          style={{
            width: '430px',
            maxWidth: 'calc(100vw - 32px)',
            height: '630px',
            maxHeight: 'calc(100vh - 100px)',
            background: '#ffffff',
            borderRadius: '24px',
            border: '1.5px solid #e2e8f0',
            boxShadow: '0 25px 60px -15px rgba(15, 23, 42, 0.35), 0 0 1px 1px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            animation: 'copilotSlideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* HEADER */}
          <div
            style={{
              padding: '16px 20px',
              background: 'linear-gradient(135deg, #0b0f19 0%, #1e1b4b 60%, #1e293b 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
                }}
              >
                <SparklesIcon size={18} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ margin: 0, fontSize: '0.96rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.01em' }}>
                    LovelyCrafts AI Agent
                  </h3>
                  <span
                    style={{
                      fontSize: '0.65rem',
                      background: 'rgba(34, 197, 94, 0.2)',
                      color: '#4ade80',
                      border: '1px solid rgba(34, 197, 94, 0.4)',
                      padding: '1px 6px',
                      borderRadius: '6px',
                      fontWeight: 700,
                    }}
                  >
                    ● LIVE CONTEXT
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '0.72rem', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>📍 {activeProfile.title}</span>
                </p>
              </div>
            </div>

            {/* ACTION CONTROLS */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                type="button"
                onClick={handleResetChat}
                title="Clear conversation"
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  color: '#cbd5e1',
                  width: '28px',
                  height: '28px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                <RefreshIcon size={14} />
              </button>
              <button
                type="button"
                onClick={() => setIsMinimized(true)}
                title="Minimize bubble"
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  color: '#cbd5e1',
                  width: '28px',
                  height: '28px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  lineHeight: 1,
                }}
              >
                –
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Close AI Copilot"
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  color: '#cbd5e1',
                  width: '28px',
                  height: '28px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <CloseIcon size={14} />
              </button>
            </div>
          </div>

          {/* SCREEN CONTEXT & QUICK ACTION PILLS */}
          <div
            style={{
              padding: '10px 16px',
              background: '#f8fafc',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.74rem', color: '#475569' }}>
              <span>
                Active Scope: <strong style={{ color: '#0f172a' }}>{activeProfile.badge}</strong>
              </span>
              <span style={{ color: '#6366f1', fontWeight: 600 }}>Page-Aware</span>
            </div>
            {activeProfile.quickActions && (
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {activeProfile.quickActions.map((qa, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSend(qa)}
                    disabled={loading}
                    style={{
                      background: '#ede9fe',
                      border: '1px solid #ddd6fe',
                      color: '#6d28d9',
                      padding: '3px 9px',
                      borderRadius: '9999px',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#ddd6fe';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#ede9fe';
                    }}
                  >
                    ⚡ {qa}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* CHAT MESSAGES BODY */}
          <div
            style={{
              flex: 1,
              padding: '16px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              background: '#f8fafc',
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
                    maxWidth: '90%',
                    padding: msg.role === 'user' ? '10px 14px' : '14px 16px',
                    borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    background: msg.role === 'user' ? 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)' : '#ffffff',
                    color: msg.role === 'user' ? '#ffffff' : '#1e293b',
                    border: msg.role === 'user' ? 'none' : '1px solid #e2e8f0',
                    boxShadow: msg.role === 'user' ? '0 4px 12px rgba(30, 27, 75, 0.25)' : '0 2px 8px rgba(0,0,0,0.03)',
                    fontSize: '0.84rem',
                    position: 'relative',
                    wordBreak: 'break-word',
                  }}
                >
                  {msg.role === 'assistant' ? formatMarkdown(msg.content) : msg.content}

                  {msg.role === 'assistant' && (
                    <button
                      type="button"
                      onClick={() => copyToClipboard(msg.content, idx)}
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        background: '#f1f5f9',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        padding: '2px 6px',
                        fontSize: '0.65rem',
                        color: copiedIndex === idx ? '#059669' : '#64748b',
                        cursor: 'pointer',
                        fontWeight: 600,
                      }}
                    >
                      {copiedIndex === idx ? '✓ Copied' : 'Copy'}
                    </button>
                  )}
                </div>

                <span style={{ fontSize: '0.65rem', color: '#94a3b8', padding: '0 4px' }}>
                  {msg.time}
                </span>
              </div>
            ))}

            {loading && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 16px',
                  background: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                  width: 'fit-content',
                }}
              >
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#6366f1', animation: 'bounce 0.6s infinite alternate' }} />
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#8b5cf6', animation: 'bounce 0.6s infinite alternate 0.2s' }} />
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ec4899', animation: 'bounce 0.6s infinite alternate 0.4s' }} />
                <span style={{ fontSize: '0.78rem', color: '#64748b', marginLeft: '4px', fontWeight: 500 }}>
                  Analyzing {activeProfile.title}...
                </span>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* DYNAMIC CONTEXTUAL PROMPT SUGGESTIONS */}
          <div
            style={{
              padding: '8px 14px',
              background: '#ffffff',
              borderTop: '1px solid #f1f5f9',
              display: 'flex',
              gap: '6px',
              overflowX: 'auto',
              whiteSpace: 'nowrap',
              scrollbarWidth: 'none',
            }}
          >
            {(activeProfile.prompts || []).map((p, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSend(p)}
                disabled={loading}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  padding: '6px 11px',
                  borderRadius: '12px',
                  fontSize: '0.72rem',
                  color: '#334155',
                  fontWeight: 600,
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#93c5fd';
                  e.currentTarget.style.background = '#eff6ff';
                  e.currentTarget.style.color = '#1d4ed8';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.background = '#f8fafc';
                  e.currentTarget.style.color = '#334155';
                }}
              >
                {p}
              </button>
            ))}
          </div>

          {/* INPUT FORM */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            style={{
              padding: '12px 16px',
              background: '#ffffff',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask about ${activeProfile.badge}... (Press Enter)`}
              disabled={loading}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: '12px',
                border: '1.5px solid #cbd5e1',
                fontSize: '0.84rem',
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
              disabled={!input.trim() || loading}
              style={{
                padding: '10px 16px',
                borderRadius: '12px',
                background: input.trim() && !loading ? 'linear-gradient(135deg, #1e1b4b 0%, #4338ca 100%)' : '#e2e8f0',
                color: input.trim() && !loading ? '#ffffff' : '#94a3b8',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: input.trim() && !loading ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'all 0.2s',
              }}
            >
              Send ↑
            </button>
          </form>
        </div>
      )}

      <style jsx global>{`
        @keyframes copilotPulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 0.95; transform: scale(1.05); }
        }
        @keyframes copilotSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes bounce {
          from { transform: translateY(0); }
          to { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}
