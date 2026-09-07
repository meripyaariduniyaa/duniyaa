import { SITE_NAME, SITE_URL } from '@/lib/seo';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug || '';
  const formattedName = slug
    ? slug
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    : 'Creator';

  return {
    title: `${formattedName} × LovelyCrafts | Exclusive Creator Gifts`,
    description: `Discover ${formattedName}'s favorite LovelyCrafts surprises and get an exclusive discount.`,
    alternates: {
      canonical: `${SITE_URL}/creators/${slug}`,
    },
    openGraph: {
      title: `${formattedName} × LovelyCrafts | Exclusive Creator Gifts`,
      description: `Discover ${formattedName}'s favorite LovelyCrafts surprises and get an exclusive discount.`,
      url: `${SITE_URL}/creators/${slug}`,
      siteName: SITE_NAME,
      type: 'profile',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${formattedName} × LovelyCrafts | Exclusive Creator Gifts`,
      description: `Discover ${formattedName}'s favorite LovelyCrafts surprises and get an exclusive discount.`,
    },
  };
}

export default function CreatorSlugLayout({ children }) {
  return children;
}
