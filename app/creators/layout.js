import { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE } from '@/lib/seo';
import Script from 'next/script';

export const metadata = {
  title: 'LovelyCrafts Creator Club | Earn With LovelyCrafts',
  description:
    'Join the LovelyCrafts Creator Club. Give your audience 10% OFF personalized digital surprises and earn 10% to 18% commission on successful referrals.',
  alternates: {
    canonical: `${SITE_URL}/creators`,
  },
  openGraph: {
    title: 'LovelyCrafts Creator Club | Earn With LovelyCrafts',
    description:
      'Give your audience 10% OFF interactive digital surprises and earn 10% to 18% commission on successful referrals.',
    url: `${SITE_URL}/creators`,
    siteName: SITE_NAME,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'LovelyCrafts Creator Club',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LovelyCrafts Creator Club | Earn With LovelyCrafts',
    description:
      'Give your audience 10% OFF interactive digital surprises and earn 10% to 18% commission.',
  },
};

export default function CreatorsLayout({ children }) {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Is joining the LovelyCrafts Creator Club free?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, joining the Creator Club is 100% free with no upfront costs or minimum follower requirements.',
        },
      },
      {
        '@type': 'Question',
        name: 'How much commission can I earn?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Creators earn between 10% and 18% commission on every qualifying paid referral, increasing automatically as your referral volume grows.',
        },
      },
      {
        '@type': 'Question',
        name: 'What discount does my audience receive?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Depending on your creator coupon, your followers receive 10% OFF across all personalized LovelyCrafts digital experiences.',
        },
      },
      {
        '@type': 'Question',
        name: 'How long are referrals tracked?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'All clicks on your personal /c/yourname creator link are tracked via secure cookies for 30 full days.',
        },
      },
    ],
  };

  return (
    <>
      <Script
        id="creators-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </>
  );
}
