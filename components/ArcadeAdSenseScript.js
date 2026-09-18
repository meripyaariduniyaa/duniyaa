'use client';

import { usePathname } from 'next/navigation';
import Script from 'next/script';

/**
 * GoogleAdSenseScript
 * 
 * Ensures Google AdSense is loaded on public pages
 * and NEVER on admin, drive, del, create, preview, or shared recipient pages.
 */
export default function GoogleAdSenseScript() {
  const pathname = usePathname();
  const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-8921431202323090';

  // Exclude /admin, /drive, /del, /create, /preview, and shared recipient pages (/p/*, /c/*)
  const isExcludedRoute =
    !pathname ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/drive') ||
    pathname.startsWith('/del') ||
    pathname.startsWith('/create') ||
    pathname.startsWith('/preview') ||
    pathname.startsWith('/p/') ||
    pathname.startsWith('/c/');

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

export { GoogleAdSenseScript as ArcadeAdSenseScript };
