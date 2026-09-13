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
    const { from_public_id, to_public_id, resource_type = 'image' } = await request.json();

    if (!from_public_id || !to_public_id) {
      return NextResponse.json({ error: 'from_public_id and to_public_id are required' }, { status: 400 });
    }

    const formData = new URLSearchParams();
    formData.append('from_public_id', from_public_id);
    formData.append('to_public_id', to_public_id);
    formData.append('overwrite', 'false');

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/${resource_type}/upload/rename`,
      {
        method: 'POST',
        headers: {
          Authorization: basicAuth(),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      }
    );

    if (!res.ok) {
      const err = await res.json();
      return NextResponse.json({ error: err.error?.message || 'Rename failed' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ success: true, asset: data });
  } catch (err) {
    return NextResponse.json({ error: 'Server error: ' + err.message }, { status: 500 });
  }
}
