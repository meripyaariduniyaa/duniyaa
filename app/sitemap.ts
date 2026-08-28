import type { MetadataRoute } from 'next';
import { templates } from '@/lib/templates';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://lovelycrafts.in';

// Fixed dates for static pages — avoids signalling false daily content changes on every build
const SITE_LAUNCH = new Date('2026-08-09');
const TEMPLATES_UPDATED = new Date('2026-08-28');
const LEGAL_UPDATED = new Date('2026-08-09');

const enInAlternates = (path: string) => ({
  languages: {
    'en-IN': `${SITE_URL}${path}`,
  },
});

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: SITE_LAUNCH,
      changeFrequency: 'weekly',
      priority: 1.0,
      alternates: enInAlternates('/'),
    },
    {
      url: `${SITE_URL}/templates`,
      lastModified: TEMPLATES_UPDATED,
      changeFrequency: 'weekly',
      priority: 0.9,
      alternates: enInAlternates('/templates'),
    },
    {
      url: `${SITE_URL}/create`,
      lastModified: TEMPLATES_UPDATED,
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: enInAlternates('/create'),
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: LEGAL_UPDATED,
      changeFrequency: 'yearly',
      priority: 0.3,
      alternates: enInAlternates('/privacy'),
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: LEGAL_UPDATED,
      changeFrequency: 'yearly',
      priority: 0.3,
      alternates: enInAlternates('/terms'),
    },
  ];

  const templatePages: MetadataRoute.Sitemap = templates
    .filter((template) => template.id)
    .map((template) => ({
      url: `${SITE_URL}/templates/${encodeURIComponent(template.id)}`,
      lastModified: TEMPLATES_UPDATED,
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: enInAlternates(`/templates/${encodeURIComponent(template.id)}`),
    }));

  return [...staticPages, ...templatePages];
}
