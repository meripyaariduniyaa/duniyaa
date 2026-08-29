import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from '@/lib/seo';

export const metadata = {
  title: 'Couple & Friends Mini-Game Arcade — Play & Duel | LovelyCrafts',
  description: 'Play fun 30-second romantic reflex and memory mini-games with your partner or bestie! Set high scores and send a 1-click WhatsApp challenge link to see who wins.',
  keywords: [
    'couples games online',
    'partner challenge games',
    'romantic mini games online India',
    'couple duel games WhatsApp',
    'fun games for long distance relationships',
    'LovelyCrafts arcade',
  ],
  alternates: { canonical: `${SITE_URL}/arcade` },
  openGraph: {
    title: 'Couples & Besties Mini-Game Arcade | LovelyCrafts',
    description: 'Play fun 30s mini-games, set high scores, and send 1-click WhatsApp challenge duels to your partner!',
    url: `${SITE_URL}/arcade`,
    type: 'website',
    siteName: SITE_NAME,
    locale: 'en_IN',
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: 'LovelyCrafts Arcade' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@lovelycraftsin',
    creator: '@lovelycraftsin',
    title: 'Couples & Besties Mini-Game Arcade | LovelyCrafts',
    description: 'Play 30s games, set high scores, and challenge your partner on WhatsApp!',
    images: [DEFAULT_OG_IMAGE],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
};

export default function ArcadeLayout({ children }) {
  return children;
}
