import './globals.css';
import { Fredoka, Caveat, Dancing_Script } from 'next/font/google';
import { AuthProvider } from '@/components/AuthProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Script from 'next/script';

const fredoka = Fredoka({ subsets: ['latin'], weight: ['400', '600', '700'], variable: '--font-bold', display: 'swap' });
const caveat = Caveat({ subsets: ['latin'], weight: ['700'], variable: '--font-cursive', display: 'swap' });
const dancing = Dancing_Script({ subsets: ['latin'], weight: ['700'], variable: '--font-dancing', display: 'swap' });

const siteName = 'Lovely Crafts';
const siteDescription = 'Create heartfelt, private notes that feel personal, beautiful, and unforgettable.';
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lovelycrafts.in';

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
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${baseUrl}/#website`,
        name: siteName,
        url: baseUrl,
        description: siteDescription,
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${baseUrl}/templates?q={search_term_string}`
          },
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'SiteNavigationElement',
        '@id': `${baseUrl}/#navigation`,
        name: [
          'Birthday Card',
          'Interactive Romantic Apology',
          'Love Letter',
          'Will You Be My Valentine?',
          'Wedding Invitation',
          'Surprise Reveal Box',
          'A Rose for Someone Special',
          'A Letter for Mom',
          'Raksha Bandhan'
        ],
        url: [
          `${baseUrl}/templates/birthday-surprise`,
          `${baseUrl}/templates/sorry`,
          `${baseUrl}/templates/love-letter`,
          `${baseUrl}/templates/be-my-valentine`,
          `${baseUrl}/templates/wedding-invitation`,
          `${baseUrl}/templates/surprise-reveal-box`,
          `${baseUrl}/templates/a-rose-for-someone-special`,
          `${baseUrl}/templates/letter-for-mom`,
          `${baseUrl}/templates/rakshabandhan`
        ]
      }
    ]
  };

  return (
    <html lang="en" className={`${fredoka.variable} ${caveat.variable} ${dancing.variable}`}>
      <body>
        <div style={{ background: '#fff7ed', color: '#9a2c00', borderBottom: '1px solid #fdba74', padding: '0.8rem 1rem', textAlign: 'center', fontSize: '0.95rem', fontWeight: 700 }}>
          Special launch offer: 50% off till 30 Sep 2026 • Coupon code <strong>new2026</strong>
        </div>
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
