import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { getAdminDb } from '@/lib/firebase-admin';
import { getAuth } from 'firebase-admin/auth';

export async function POST(request) {
    try {
        const adminDb = getAdminDb();
        const { apologyId } = await request.json();

        const snap = await adminDb.collection('apologies').doc(apologyId).get();
        if (!snap.exists) return NextResponse.json({ error: 'Apology not found.' }, { status: 404 });

        const razorpay = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });

        const order = await razorpay.orders.create({
            amount: 9900, // 99 INR
            currency: 'INR',
            receipt: apologyId,
            notes: { apologyId, uid: snap.data().creator_uid }
        });

        return NextResponse.json({ orderId: order.id, amount: order.amount, currency: order.currency, keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID });

    } catch (error) {
        return NextResponse.json({ error: error.message || 'Unable to create order.' }, { status: 500 });
    }
}
