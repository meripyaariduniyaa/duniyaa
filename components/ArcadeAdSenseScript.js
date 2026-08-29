'use client';

import { usePathname } from 'next/navigation';
import Script from 'next/script';

/**
 * ArcadeAdSenseScript
 * 
 * Ensures Google AdSense is loaded ONLY on /arcade routes
 * and never on private preview/share/checkout pages.
 */
export default function ArcadeAdSenseScript() {
  const pathname = usePathname();
  const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  // Only load on arcade routes if client ID is set
  const isArcadeRoute = pathname?.startsWith('/arcade');

  if (!isArcadeRoute || !adsenseClientId) {
    return null;
  }

  return (
    <Script
      id="google-adsense-arcade"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
