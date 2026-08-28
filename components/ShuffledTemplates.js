'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { templates } from '@/lib/templates';

const shuffleArray = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

export function HeroPills() {
  const [displayTemplates, setDisplayTemplates] = useState(templates);

  useEffect(() => {
    setDisplayTemplates(shuffleArray(templates));
  }, []);

  return (
    <div className="hero-pills">
      {displayTemplates.slice(0, 7).map((t) => (
        <Link key={t.id} href={`/create?template=${t.id}`} className="hero-pill-item">
          <span>{t.icon}</span>
          <span>{t.title}</span>
        </Link>
      ))}
    </div>
  );
}

export function BentoGrid() {
  const [displayTemplates, setDisplayTemplates] = useState(templates);

  useEffect(() => {
    setDisplayTemplates(shuffleArray(templates));
  }, []);

  return (
    <div className="bento-grid">
      {displayTemplates.map((t) => (
        <Link key={t.id} href={`/create?template=${t.id}`} className="bento-card">
          <div>
            <div className="bento-card-header">
              <span className="bento-emoji">{t.icon}</span>
              <h3 className="bento-card-title">{t.title}</h3>
            </div>
            <p className="bento-card-desc">{t.description}</p>
          </div>

          <div className="bento-card-footer">
            <div className="bento-price-tag">
              <del>₹499</del>
              <span>₹199</span>
            </div>
            <span className="bento-cta">
              Create Now →
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
