import { NextResponse } from 'next/server';

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

// ponytail: 25 GB free tier limit — hardcoded since it never changes unless the plan changes
const LIMIT_BYTES = 25 * 1024 * 1024 * 1024;

export async function GET() {
  if (!API_KEY || !API_SECRET || !CLOUD_NAME) {
    return NextResponse.json({ error: 'Cloudinary not configured' }, { status: 500 });
  }

  try {
    const auth = 'Basic ' + Buffer.from(`${API_KEY}:${API_SECRET}`).toString('base64');
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/usage`, {
      headers: { Authorization: auth },
      // ponytail: no caching header — Cloudinary usage is already eventually consistent
    });

    if (!res.ok) {
      return NextResponse.json({ used_bytes: 0, limit_bytes: LIMIT_BYTES });
    }

    const data = await res.json();
    const used_bytes = data?.storage?.usage ?? 0;

    return NextResponse.json({ used_bytes, limit_bytes: LIMIT_BYTES });
  } catch {
    // fail open — don't break the drive page if usage check fails
    return NextResponse.json({ used_bytes: 0, limit_bytes: LIMIT_BYTES });
  }
}
