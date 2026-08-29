'use client';

import { usePathname } from 'next/navigation';

export default function LaunchBanner() {
  const pathname = usePathname();
  if (pathname?.startsWith('/p/')) return null;

  return (
    <div className="launch-banner" style={{ background: '#fff7ed', color: '#9a2c00', borderBottom: '1px solid #fdba74', padding: '0.8rem 1rem', textAlign: 'center', fontSize: '0.95rem', fontWeight: 700 }}>
      Special launch offer: 50% off till 30 Sep 2026 • Coupon code <strong>new2026</strong>
    </div>
  );
}
