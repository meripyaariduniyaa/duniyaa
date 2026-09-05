import './globals.css';
import { Fredoka, Caveat, Dancing_Script } from 'next/font/google';
import { AuthProvider } from '@/components/AuthProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MarketingPopup from '@/components/MarketingPopup';
import StickyCtaBar from '@/components/StickyCtaBar';
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
      'Virtual Birthday Bash',
      'The Perfect Proposal',
      'Anniversary Special',
      'A Letter for Mom',
      'A Letter to Dad',
      'Warm Hug & Get Well Soon',
      'Wedding Invitation',
      'Raksha Bandhan',
      'Surprise Reveal Box',
      'I Miss You',
      'Just Because',
      'Things I Never Said',
      'Open When…',
      'Emotional Apology',
      "You're My Person",
      'Photo Puzzle Reveal',
      'Friendship Day',
      'A Rose for Someone Special',
    ],
    url: [
      `${SITE_URL}/templates/birthday`,
      `${SITE_URL}/templates/proposal`,
      `${SITE_URL}/templates/anniversary`,
      `${SITE_URL}/templates/mothers-day`,
      `${SITE_URL}/templates/fathers-day`,
      `${SITE_URL}/templates/get-well-soon`,
      `${SITE_URL}/templates/wedding-invitation`,
      `${SITE_URL}/templates/rakshabandhan`,
      `${SITE_URL}/templates/surprise-reveal-box`,
      `${SITE_URL}/templates/i-miss-you`,
      `${SITE_URL}/templates/just-because`,
      `${SITE_URL}/templates/things-i-never-said`,
      `${SITE_URL}/templates/open-when`,
      `${SITE_URL}/templates/emotional-apology`,
      `${SITE_URL}/templates/youre-my-person`,
      `${SITE_URL}/templates/puzzle`,
      `${SITE_URL}/templates/friendship`,
      `${SITE_URL}/templates/a-rose-for-someone-special`,
    ],
  };

  return (
    <html lang="en-IN" className={`${fredoka.variable} ${caveat.variable} ${dancing.variable}`}>
      <head>
        {/* Google AdSense Site Verification & Auto Ads Script (Plain head script avoids data-nscript warning) */}
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-8921431202323090'}`}
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <AuthProvider>
          <Header />
          <div className="page-content">{children}</div>
          <Footer />
          <MarketingPopup />
          <StickyCtaBar />
        </AuthProvider>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema).replace(/</g, '\\u003c') }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema).replace(/</g, '\\u003c') }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteNavigationSchema).replace(/</g, '\\u003c') }} />

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
