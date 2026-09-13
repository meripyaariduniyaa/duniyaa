import { NextResponse } from 'next/server';

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

function basicAuth() {
  return 'Basic ' + Buffer.from(`${API_KEY}:${API_SECRET}`).toString('base64');
}

export async function POST(request) {
  if (!API_KEY || !API_SECRET) {
    return NextResponse.json({ error: 'Cloudinary API credentials not configured' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { resource_type = 'image' } = body;

    let targetIds = [];
    if (Array.isArray(body.public_ids)) {
      targetIds = body.public_ids.filter(Boolean);
    } else if (body.public_id) {
      targetIds = [body.public_id];
    }

    if (targetIds.length === 0) {
      return NextResponse.json({ error: 'At least one public_id is required' }, { status: 400 });
    }

    // Process in batches of 100 (Cloudinary limit per request)
    const BATCH_SIZE = 100;
    const allDeleted = {};

    for (let i = 0; i < targetIds.length; i += BATCH_SIZE) {
      const batch = targetIds.slice(i, i + BATCH_SIZE);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/${resource_type}/upload`,
        {
          method: 'DELETE',
          headers: {
            Authorization: basicAuth(),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ public_ids: batch }),
        }
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        return NextResponse.json({ error: err.error?.message || 'Delete failed' }, { status: res.status });
      }

      const data = await res.json();
      if (data.deleted) {
        Object.assign(allDeleted, data.deleted);
      }
    }

    return NextResponse.json({ success: true, deleted: allDeleted, count: Object.keys(allDeleted).length });
  } catch (err) {
    return NextResponse.json({ error: 'Server error: ' + err.message }, { status: 500 });
  }
}
