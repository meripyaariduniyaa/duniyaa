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
  const folder = searchParams.get('folder') || '';

  try {
    const endpoint = folder
      ? `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/folders/${encodeURIComponent(folder)}`
      : `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/folders`;

    const res = await fetch(endpoint, {
      headers: { Authorization: basicAuth() },
    });

    if (!res.ok) {
      const err = await res.json();
      return NextResponse.json({ error: err.error?.message || 'Failed to fetch folders' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: 'Server error: ' + err.message }, { status: 500 });
  }
}
