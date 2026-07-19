import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';
import { getAuth } from 'firebase-admin/auth';

export async function POST(request) {
  try {
    const bearer = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!bearer) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });

    const decoded = await getAuth().verifyIdToken(bearer);
    const { deviceId } = await request.json();

    if (!deviceId) return NextResponse.json({ ok: true, message: 'No device ID provided' });

    const adminDb = getAdminDb();
    
    // Find all apologies created by this deviceId
    const snapshot = await adminDb.collection('apologies').where('creator_uid', '==', deviceId).get();
    
    if (snapshot.empty) {
      return NextResponse.json({ ok: true, message: 'No notes to claim' });
    }

    const batch = adminDb.batch();
    
    snapshot.forEach(doc => {
      batch.update(doc.ref, { creator_uid: decoded.uid });
    });

    await batch.commit();

    return NextResponse.json({ ok: true, count: snapshot.size });
  } catch (error) {
    console.error('Error claiming notes:', error);
    return NextResponse.json({ error: error.message || 'Unable to claim notes.' }, { status: 500 });
  }
}
