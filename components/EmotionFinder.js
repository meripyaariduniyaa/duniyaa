'use client';

import { useState } from 'react';
import Link from 'next/link';
import { emotionChoices, recommendEmotionalTemplates } from '@/lib/emotionalTemplates';

export default function EmotionFinder() {
  const [emotion, setEmotion] = useState('loved');
  const recommendations = recommendEmotionalTemplates(emotion);
  return <section style={{ margin: '0 0 3rem', background: 'linear-gradient(135deg,#fff1f6,#fff)', border: '1px solid #fbcfe8', borderRadius: 28, padding: 'clamp(1.5rem,4vw,3rem)', textAlign: 'center' }}>
    <span style={{ color: '#be185d', fontSize: 12, fontWeight: 800, letterSpacing: '.13em' }}>EMOTION-FIRST GIFTS</span>
    <h2 style={{ fontSize: 'clamp(1.7rem,4vw,2.6rem)', margin: '8px 0' }}>What do you want them to feel?</h2>
    <p className="text-muted">We’ll help you find the right way to say it.</p>
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', margin: '1.5rem 0' }}>{emotionChoices.map((choice) => <button key={choice.id} onClick={() => setEmotion(choice.id)} style={{ border: '1px solid #f9a8d4', borderRadius: 999, padding: '9px 13px', background: emotion === choice.id ? '#be185d' : '#fff', color: emotion === choice.id ? '#fff' : '#9d174d', fontWeight: 700, cursor: 'pointer' }}>{choice.icon} {choice.label}</button>)}</div>
    <p style={{ fontStyle: 'italic', color: '#831843' }}>We know what you&apos;re trying to say.</p>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 12, textAlign: 'left' }}>{recommendations.map((template) => <Link key={template.id} href={`/create?template=${template.id}`} style={{ background: '#fff', color: '#3b0f1b', textDecoration: 'none', padding: 16, borderRadius: 16, border: '1px solid #fce7f3' }}><div style={{ fontSize: 24 }}>{template.icon}</div><strong>{template.title}</strong><p style={{ color: '#6b7280', fontSize: 13, marginBottom: 0 }}>{template.description}</p><span style={{ color: '#be185d', fontWeight: 800 }}>Create · ₹{template.price}</span></Link>)}</div>
    <Link href="/templates" className="btn-secondary" style={{ display: 'inline-flex', marginTop: 20 }}>Browse all templates</Link>
  </section>;
}
