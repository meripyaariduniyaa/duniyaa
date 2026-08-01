import './globals.css';
import { Fredoka, Caveat, Dancing_Script } from 'next/font/google';
import { AuthProvider } from '@/components/AuthProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Script from 'next/script';

const fredoka = Fredoka({ subsets: ['latin'], weight: ['400', '600', '700'], variable: '--font-bold', display: 'swap' });
const caveat = Caveat({ subsets: ['latin'], weight: ['700'], variable: '--font-cursive', display: 'swap' });
const dancing = Dancing_Script({ subsets: ['latin'], weight: ['700'], variable: '--font-dancing', display: 'swap' });

const siteName = 'NoteRetro';
const siteDescription = 'Create heartfelt, private notes that feel personal, beautiful, and unforgettable.';
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://noteretro.vercel.app';

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: `${siteName} — Private, heartfelt notes that feel personal`,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: ['private notes', 'heartfelt messages', 'memory gift', 'digital note', 'personal letter', 'special message'],
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1,
  },
  openGraph: {
    title: `${siteName} — Private, heartfelt notes that feel personal`,
    description: siteDescription,
    url: baseUrl,
    siteName,
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteName} — Private, heartfelt notes that feel personal`,
    description: siteDescription,
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ff4d6d',
};

export default function RootLayout({ children }) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: baseUrl,
    description: siteDescription,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseUrl}/create`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang="en" className={`${fredoka.variable} ${caveat.variable} ${dancing.variable}`}>
      <body>
        <AuthProvider>
          <Header />
          <div className="page-content">{children}</div>
          <Footer />
        </AuthProvider>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <Script src="/oneko/oneko.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}
