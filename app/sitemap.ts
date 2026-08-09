import type { MetadataRoute } from 'next';
import { templates } from '@/lib/templates';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://lovelycrafts.in';



export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/templates`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },

    {
      url: `${SITE_URL}/create`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  const templatePages: MetadataRoute.Sitemap = templates
    .filter((template) => template.id)
    .map((template) => ({
      url: `${SITE_URL}/templates/${encodeURIComponent(template.id)}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    }));

  return [...staticPages, ...templatePages];
}
