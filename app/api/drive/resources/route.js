import { NextResponse } from 'next/server';

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

function basicAuth() {
  return 'Basic ' + Buffer.from(`${API_KEY}:${API_SECRET}`).toString('base64');
}

export async function GET(request) {
  if (!API_KEY || !API_SECRET) {
    return NextResponse.json({ error: 'Cloudinary API credentials not configured' }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const folderParam = searchParams.get('folder') || searchParams.get('prefix') || '';
  const nextCursor = searchParams.get('next_cursor') || '';
  const resourceType = searchParams.get('resource_type') || 'image';

  try {
    const params = new URLSearchParams({
      type: 'upload',
      max_results: '100',
      ...(nextCursor && { next_cursor: nextCursor }),
    });

    // If folder path is specified, use trailing slash so Cloudinary matches files inside that folder
    if (folderParam) {
      const prefix = folderParam.endsWith('/') ? folderParam : `${folderParam}/`;
      params.append('prefix', prefix);
    }

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/${resourceType}?${params}`,
      { headers: { Authorization: basicAuth() } }
    );

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return NextResponse.json({ error: err.error?.message || 'Failed to fetch resources' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: 'Server error: ' + err.message }, { status: 500 });
  }
}
