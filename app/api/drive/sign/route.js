import { NextResponse } from 'next/server';
import crypto from 'crypto';

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

export async function POST(request) {
  if (!API_KEY || !API_SECRET) {
    return NextResponse.json({ error: 'Cloudinary API credentials not configured' }, { status: 500 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const timestamp = Math.floor(Date.now() / 1000);

    const paramsToSign = {
      timestamp: timestamp,
    };

    if (body.folder && typeof body.folder === 'string' && body.folder.trim()) {
      paramsToSign.folder = body.folder.trim();
    }

    if (body.public_id && typeof body.public_id === 'string' && body.public_id.trim()) {
      paramsToSign.public_id = body.public_id.trim();
    }

    // Sort keys alphabetically
    const sortedKeys = Object.keys(paramsToSign).sort();
    const toSignString = sortedKeys.map(key => `${key}=${paramsToSign[key]}`).join('&') + API_SECRET;

    const signature = crypto.createHash('sha1').update(toSignString).digest('hex');

    return NextResponse.json({
      signature,
      timestamp,
      api_key: API_KEY,
      cloud_name: CLOUD_NAME,
      folder: paramsToSign.folder || '',
      public_id: paramsToSign.public_id || '',
    });
  } catch (err) {
    return NextResponse.json({ error: 'Server error: ' + err.message }, { status: 500 });
  }
}
