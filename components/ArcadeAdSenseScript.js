'use client';

import { usePathname } from 'next/navigation';
import Script from 'next/script';

/**
 * ArcadeAdSenseScript / GoogleAdSenseScript
 * 
 * Ensures Google AdSense is loaded on public pages
 * and NEVER on private preview, create, or shared recipient pages.
 */
export default function ArcadeAdSenseScript() {
  const pathname = usePathname();
  const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  // Exclude /create, /preview, and /p/* (shared recipient experience)
  const isExcludedRoute =
    !pathname ||
    pathname.startsWith('/create') ||
    pathname.startsWith('/preview') ||
    pathname.startsWith('/p/');

  if (isExcludedRoute || !adsenseClientId) {
    return null;
  }

  return (
    <Script
      id="google-adsense-script"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
