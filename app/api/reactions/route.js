import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(request) {
  try {
    const { noteId, action, reactionEmoji, reactionLabel, reactionMessage } = await request.json();

    if (!noteId) {
      return NextResponse.json({ error: 'Note ID is required.' }, { status: 400 });
    }

    const adminDb = getAdminDb();
    const noteRef = adminDb.collection('notes').doc(noteId);
    const snap = await noteRef.get();

    if (!snap.exists) {
      return NextResponse.json({ error: 'Note not found.' }, { status: 404 });
    }

    if (action === 'view') {
      await noteRef.update({
        view_count: FieldValue.increment(1),
        last_viewed_at: new Date(),
      });
      return NextResponse.json({ ok: true });
    }

    if (action === 'react') {
      const reactionData = {
        emoji: reactionEmoji || '❤️',
        label: reactionLabel || 'Loved it',
        message: (reactionMessage || '').trim().slice(0, 500),
        timestamp: new Date(),
      };

      await noteRef.update({
        recipient_reaction: reactionData,
        reactions_history: FieldValue.arrayUnion(reactionData),
      });

      return NextResponse.json({ ok: true, reaction: reactionData });
    }

    return NextResponse.json({ error: 'Invalid action.' }, { status: 400 });
  } catch (error) {
    console.error('Error recording reaction:', error);
    return NextResponse.json({ error: error.message || 'Failed to record reaction.' }, { status: 500 });
  }
}
