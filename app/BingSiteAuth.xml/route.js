import { BING_SITE_VERIFICATION } from '@/lib/seo';

export async function GET() {
  const xml = `<?xml version="1.0"?>
<users>
\t<user>${BING_SITE_VERIFICATION}</user>
</users>
`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
