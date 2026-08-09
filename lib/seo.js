export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://lovelycrafts.in';
export const SITE_NAME = 'LovelyCrafts';
export const DEFAULT_DESCRIPTION = 'Create beautiful interactive digital surprises, wishes, apologies and memorable moments for the people you love.';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

export const siteMetadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: `${SITE_NAME} — Create Beautiful Digital Surprises`,
    template: `%s | ${SITE_NAME}`,
  },

  description: DEFAULT_DESCRIPTION,

  applicationName: SITE_NAME,

  keywords: [
    'digital surprise',
    'online surprise',
    'digital gift',
    'interactive wishes',
    'birthday surprise',
    'romantic surprise',
    'anniversary surprise',
    'apology website',
    'Raksha Bandhan surprise',
    'personalized digital gift',
  ],

  authors: [
    {
      name: SITE_NAME,
      url: SITE_URL,
    },
  ],

  creator: SITE_NAME,
  publisher: SITE_NAME,

  alternates: {
    canonical: '/',
  },

  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Create Beautiful Digital Surprises`,
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — Digital Surprises`,
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — Create Beautiful Digital Surprises`,
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
};
