'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * GoogleAdSenseScript
 * 
 * Injects Google AdSense cleanly into document.head on public consumer pages
 * without Next.js data-nscript attribute to avoid the AdSense head tag warning.
 * Excludes admin, drive, del, create, preview, and shared recipient pages.
 */
export default function GoogleAdSenseScript() {
  const pathname = usePathname();
  const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-8921431202323090';

  useEffect(() => {
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
      return;
    }

    // Prevent duplicate injection
    if (document.querySelector('script[src*="adsbygoogle.js"]')) {
      return;
    }

    // Direct DOM injection without Next.js data-nscript attribute
    const script = document.createElement('script');
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`;
    script.async = true;
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);
  }, [pathname, adsenseClientId]);

  return null;
}

export { GoogleAdSenseScript as ArcadeAdSenseScript };
