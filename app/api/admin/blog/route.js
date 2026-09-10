import { NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { getAdminDb } from '@/lib/firebase-admin';
import { requireAdmin } from '@/lib/creator-auth';

function slugify(text) {
  return (text || '')
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export async function GET(request) {
  try {
    await requireAdmin(request);
    const db = getAdminDb();
    const snap = await db.collection('blogs').get();

    const blogs = snap.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || (typeof data.createdAt === 'string' ? data.createdAt : null),
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || (typeof data.updatedAt === 'string' ? data.updatedAt : null),
        publishedAt: data.publishedAt?.toDate?.()?.toISOString() || (typeof data.publishedAt === 'string' ? data.publishedAt : null),
      };
    });

    blogs.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    return NextResponse.json({ blogs });
  } catch (error) {
    console.error('Error fetching admin blogs:', error);
    return NextResponse.json({ error: error.message || 'Admin access required.' }, { status: 403 });
  }
}

export async function POST(request) {
  try {
    await requireAdmin(request);
    const db = getAdminDb();
    const body = await request.json();

    const {
      title,
      slug: customSlug,
      coverImage = '',
      excerpt = '',
      author = 'LovelyCrafts Editorial',
      tags = [],
      status = 'draft',
      blocks = [],
    } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ error: 'Title is required.' }, { status: 400 });
    }

    let slug = slugify(customSlug || title);
    if (!slug) {
      slug = `post-${Date.now()}`;
    }

    // Check if slug already exists
    const existing = await db.collection('blogs').where('slug', '==', slug).limit(1).get();
    if (!existing.empty) {
      slug = `${slug}-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    const now = FieldValue.serverTimestamp();
    const docData = {
      title: title.trim(),
      slug,
      coverImage: coverImage.trim(),
      excerpt: excerpt.trim(),
      author: author.trim() || 'LovelyCrafts Editorial',
      tags: Array.isArray(tags) ? tags.map((t) => t.trim().toLowerCase()).filter(Boolean) : [],
      status: status === 'published' ? 'published' : 'draft',
      blocks: Array.isArray(blocks) ? blocks : [],
      createdAt: now,
      updatedAt: now,
      publishedAt: status === 'published' ? now : null,
    };

    const docRef = await db.collection('blogs').add(docData);

    return NextResponse.json({
      ok: true,
      id: docRef.id,
      slug,
      message: 'Blog post created successfully.',
    });
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json({ error: error.message || 'Failed to create blog post.' }, { status: 500 });
  }
}
