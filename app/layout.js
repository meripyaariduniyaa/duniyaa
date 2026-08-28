import './globals.css';
import { Fredoka, Caveat, Dancing_Script } from 'next/font/google';
import { AuthProvider } from '@/components/AuthProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MarketingPopup from '@/components/MarketingPopup';
import Script from 'next/script';
import { siteMetadata, SITE_URL, SITE_NAME, DEFAULT_DESCRIPTION, CONTACT_EMAIL, INSTAGRAM_URL, X_URL } from '@/lib/seo';

// ─── Google Analytics 4 ────────────────────────────────────────────────────
// TODO: Replace GA_MEASUREMENT_ID with your real ID (e.g. G-XXXXXXXXXX)
// Get it at: https://analytics.google.com → Admin → Data Streams → Web stream → Measurement ID
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-XXXXXXXXXX';

const fredoka = Fredoka({ subsets: ['latin'], weight: ['400', '600', '700'], variable: '--font-bold', display: 'swap' });
const caveat = Caveat({ subsets: ['latin'], weight: ['700'], variable: '--font-cursive', display: 'swap' });
const dancing = Dancing_Script({ subsets: ['latin'], weight: ['700'], variable: '--font-dancing', display: 'swap' });

export const metadata = siteMetadata;

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ff4d6d',
};

export default function RootLayout({ children }) {
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/templates?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/lovelycrafts-logo.png`,
    description: DEFAULT_DESCRIPTION,
    email: CONTACT_EMAIL,
    sameAs: [INSTAGRAM_URL, X_URL],
    contactPoint: {
      '@type': 'ContactPoint',
      email: CONTACT_EMAIL,
      contactType: 'customer support',
      availableLanguage: ['English', 'Hindi'],
    },
  };

  const siteNavigationSchema = {
    '@context': 'https://schema.org',
    '@type': 'SiteNavigationElement',
    '@id': `${SITE_URL}/#navigation`,
    name: [
      'Birthday Card',
      'Interactive Romantic Apology',
      'Love Letter',
      'Will You Be My Valentine?',
      'Wedding Invitation',
      'Surprise Reveal Box',
      'A Rose for Someone Special',
      'A Letter for Mom',
      'Raksha Bandhan',
    ],
    url: [
      `${SITE_URL}/templates/birthday-surprise`,
      `${SITE_URL}/templates/sorry`,
      `${SITE_URL}/templates/love-letter`,
      `${SITE_URL}/templates/be-my-valentine`,
      `${SITE_URL}/templates/wedding-invitation`,
      `${SITE_URL}/templates/surprise-reveal-box`,
      `${SITE_URL}/templates/a-rose-for-someone-special`,
      `${SITE_URL}/templates/letter-for-mom`,
      `${SITE_URL}/templates/rakshabandhan`,
    ],
  };

  return (
    <html lang="en-IN" className={`${fredoka.variable} ${caveat.variable} ${dancing.variable}`}>
      <body>
        <div style={{ background: '#fff7ed', color: '#9a2c00', borderBottom: '1px solid #fdba74', padding: '0.8rem 1rem', textAlign: 'center', fontSize: '0.95rem', fontWeight: 700 }}>
          Special launch offer: 50% off till 30 Sep 2026 • Coupon code <strong>new2026</strong>
        </div>
        <AuthProvider>
          <Header />
          <div className="page-content">{children}</div>
          <Footer />
          <MarketingPopup />
        </AuthProvider>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema).replace(/</g, '\\u003c') }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema).replace(/</g, '\\u003c') }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteNavigationSchema).replace(/</g, '\\u003c') }} />
        <Script src="/oneko/oneko.js" strategy="lazyOnload" />

        {/* Google Analytics 4 */}
        {GA_MEASUREMENT_ID && GA_MEASUREMENT_ID !== 'G-XXXXXXXXXX' && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}', { page_path: window.location.pathname });
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
