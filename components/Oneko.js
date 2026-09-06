'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Oneko() {
  const pathname = usePathname();

  useEffect(() => {
    // Don't spawn duplicate oneko cats
    if (document.getElementById('oneko')) return;

    // Optional: avoid rendering over private interactive reveal pages if needed
    if (pathname?.startsWith('/p/')) return;

    const script = document.createElement('script');
    script.src = '/oneko/oneko.js';
    script.async = true;
    script.dataset.cat = '/oneko/oneko.gif';
    document.body.appendChild(script);

    return () => {
      const el = document.getElementById('oneko');
      if (el) el.remove();
      if (script.parentNode) script.parentNode.removeChild(script);
    };
  }, [pathname]);

  return null;
}
