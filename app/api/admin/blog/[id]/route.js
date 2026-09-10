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

export async function GET(request, { params }) {
  try {
    await requireAdmin(request);
    const { id } = await params;
    if (!id) return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });

    const db = getAdminDb();
    const doc = await db.collection('blogs').doc(id).get();

    if (!doc.exists) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    const data = doc.data();
    return NextResponse.json({
      post: {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || (typeof data.createdAt === 'string' ? data.createdAt : null),
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || (typeof data.updatedAt === 'string' ? data.updatedAt : null),
        publishedAt: data.publishedAt?.toDate?.()?.toISOString() || (typeof data.publishedAt === 'string' ? data.publishedAt : null),
      },
    });
  } catch (error) {
    console.error('Error getting blog post:', error);
    return NextResponse.json({ error: error.message || 'Admin access required.' }, { status: 403 });
  }
}

export async function PUT(request, { params }) {
  try {
    await requireAdmin(request);
    const { id } = await params;
    if (!id) return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });

    const db = getAdminDb();
    const docRef = db.collection('blogs').doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    const existingData = docSnap.data();
    const body = await request.json();

    const updateData = {
      updatedAt: FieldValue.serverTimestamp(),
    };

    if (body.title !== undefined) updateData.title = body.title.trim();
    if (body.slug !== undefined) {
      const cleanSlug = slugify(body.slug || body.title || existingData.title);
      // Check if another post uses this slug
      if (cleanSlug !== existingData.slug) {
        const slugCheck = await db.collection('blogs').where('slug', '==', cleanSlug).limit(1).get();
        if (!slugCheck.empty && slugCheck.docs[0].id !== id) {
          updateData.slug = `${cleanSlug}-${Math.floor(1000 + Math.random() * 9000)}`;
        } else {
          updateData.slug = cleanSlug;
        }
      }
    }
    if (body.coverImage !== undefined) updateData.coverImage = body.coverImage.trim();
    if (body.excerpt !== undefined) updateData.excerpt = body.excerpt.trim();
    if (body.author !== undefined) updateData.author = body.author.trim();
    if (body.tags !== undefined) {
      updateData.tags = Array.isArray(body.tags)
        ? body.tags.map((t) => t.trim().toLowerCase()).filter(Boolean)
        : [];
    }
    if (body.blocks !== undefined) {
      updateData.blocks = Array.isArray(body.blocks) ? body.blocks : [];
    }
    if (body.status !== undefined) {
      updateData.status = body.status === 'published' ? 'published' : 'draft';
      if (body.status === 'published' && !existingData.publishedAt) {
        updateData.publishedAt = FieldValue.serverTimestamp();
      }
    }

    await docRef.update(updateData);

    return NextResponse.json({ ok: true, message: 'Blog post updated successfully.' });
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json({ error: error.message || 'Failed to update blog post.' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await requireAdmin(request);
    const { id } = await params;
    if (!id) return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });

    const db = getAdminDb();
    const docRef = db.collection('blogs').doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    await docRef.delete();

    return NextResponse.json({ ok: true, message: 'Blog post deleted permanently.' });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete blog post.' }, { status: 500 });
  }
}
