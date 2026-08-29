import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';
import { nanoid } from 'nanoid';

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      action, // 'create' or 'submit_partner_score'
      challengeId,
      gameId,
      creatorName,
      creatorScore,
      creatorUid,
      partnerName,
      partnerScore
    } = body;

    const adminDb = getAdminDb();

    // 1. Create a new challenge
    if (action === 'create') {
      const id = challengeId || nanoid(12);
      const challengeData = {
        id,
        gameId: gameId || 'heart-rush',
        creatorName: (creatorName || 'A Secret Challenger').trim().slice(0, 50),
        creatorScore: Number(creatorScore) || 0,
        creatorUid: creatorUid || null,
        partnerName: null,
        partnerScore: null,
        status: 'pending',
        winner: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (adminDb) {
        await adminDb.collection('game_challenges').doc(id).set(challengeData);
      }

      return NextResponse.json({ success: true, challenge: challengeData });
    }

    // 2. Partner submits their score to complete the duel
    if (action === 'submit_partner_score') {
      if (!challengeId) {
        return NextResponse.json({ error: 'challengeId is required' }, { status: 400 });
      }

      let challengeData = null;
      if (adminDb) {
        const docRef = adminDb.collection('game_challenges').doc(challengeId);
        const docSnap = await docRef.get();
        if (docSnap.exists) {
          challengeData = docSnap.data();
        }
      }

      const pScore = Number(partnerScore) || 0;
      const pName = (partnerName || 'Partner').trim().slice(0, 50);
      const cScore = challengeData ? challengeData.creatorScore : 0;

      let winner = 'tie';
      if (pScore > cScore) winner = 'partner';
      else if (pScore < cScore) winner = 'creator';

      const updateData = {
        partnerName: pName,
        partnerScore: pScore,
        status: 'completed',
        winner,
        updatedAt: new Date().toISOString()
      };

      if (adminDb) {
        await adminDb.collection('game_challenges').doc(challengeId).set(updateData, { merge: true });
      }

      return NextResponse.json({
        success: true,
        challenge: {
          ...(challengeData || {}),
          ...updateData,
          id: challengeId
        }
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err) {
    console.error('Challenge API error:', err);
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing id param' }, { status: 400 });
    }

    const adminDb = getAdminDb();
    if (!adminDb) {
      return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });
    }

    const docSnap = await adminDb.collection('game_challenges').doc(id).get();
    if (!docSnap.exists) {
      return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, challenge: docSnap.data() });
  } catch (err) {
    console.error('Challenge fetch error:', err);
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}
