import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';
import { requireAdmin } from '@/lib/creator-auth';
import { isAdminEmail } from '@/lib/creator-club';

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

function basicAuth() {
  return 'Basic ' + Buffer.from(`${API_KEY}:${API_SECRET}`).toString('base64');
}

function resolveTimestampMs(val) {
  if (!val) return null;
  if (typeof val.toDate === 'function') {
    try { return val.toDate().getTime(); } catch {}
  }
  if (val._seconds) return val._seconds * 1000;
  if (typeof val === 'number') return val > 100000000000 ? val : val * 1000;
  if (typeof val === 'string') {
    const ms = new Date(val).getTime();
    return isNaN(ms) ? null : ms;
  }
  return null;
}

// Protected Cloudinary folder / prefix patterns
const PROTECTED_CLOUDINARY_PREFIXES = [
  'creator-uploads',
  'creators',
  'admin-uploads',
  'admin',
  'blog',
  'blogs',
  'assets',
  'site',
  'system',
  'templates',
  'brand',
  'logo',
];

function isCloudinaryAssetProtected(item) {
  const publicId = String(item.public_id || '').toLowerCase();
  const folder = String(item.folder || item.asset_folder || '').toLowerCase();

  for (const prefix of PROTECTED_CLOUDINARY_PREFIXES) {
    if (
      publicId.startsWith(prefix + '/') ||
      publicId.startsWith(prefix + '_') ||
      publicId === prefix ||
      folder.startsWith(prefix)
    ) {
      return true;
    }
  }
  return false;
}

export async function POST(request) {
  try {
    // 1. Strict admin verification
    await requireAdmin(request);

    // 2. Parse request payload
    let body = {};
    try {
      body = await request.json();
    } catch {}
    const { action = 'scan', days = 90 } = body;
    const retentionDays = Math.max(1, parseInt(days, 10) || 90);

    const cutoffMs = Date.now() - retentionDays * 24 * 60 * 60 * 1000;
    const cutoffDate = new Date(cutoffMs);

    const adminDb = getAdminDb();

    // Fetch all Creator IDs and Emails to guarantee we NEVER delete creator-owned data
    const creatorsSnap = await adminDb.collection('creators').get().catch(() => ({ docs: [] }));
    const protectedCreatorIds = new Set();
    const protectedEmails = new Set();

    creatorsSnap.docs.forEach((d) => {
      protectedCreatorIds.add(d.id);
      const cData = d.data();
      if (cData.uid) protectedCreatorIds.add(cData.uid);
      if (cData.email) protectedEmails.add(cData.email.toLowerCase().trim());
      if (cData.slug) protectedCreatorIds.add(cData.slug.toLowerCase().trim());
    });

    // -------------------------------------------------------------
    // A. FIRESTORE EXPIRED USER SHAREABLE CREATION DATA SCAN / PURGE
    // Protected collections strictly omitted:
    // - referralClicks (referral links/clicks preserved), creators, coupons, creatorGifts, crm_prospects, payouts, blogs, orders, commissions
    // Only customer-generated shareable note items ('notes') are evaluated.
    // -------------------------------------------------------------
    const targetCollections = [
      { name: 'notes', titleField: 'recipient_name' },
    ];

    const expiredFirestoreDocs = [];
    let deletedFirestoreCount = 0;

    for (const col of targetCollections) {
      try {
        const snapshot = await adminDb.collection(col.name).get();

        for (const doc of snapshot.docs) {
          const data = doc.data();

          // GUARANTEE: Never delete admin or creator-linked records
          const authorEmail = (data.author_email || data.email || data.user_email || '').toLowerCase().trim();
          const creatorUid = data.creator_uid || data.creator_id || data.author_uid || '';

          if (
            isAdminEmail(authorEmail) ||
            data.is_admin === true ||
            data.is_creator === true ||
            data.role === 'admin' ||
            data.role === 'creator' ||
            protectedCreatorIds.has(creatorUid) ||
            protectedEmails.has(authorEmail)
          ) {
            // SKIP protected admin / creator record
            continue;
          }

          const createdAtMs =
            resolveTimestampMs(data.created_at) ||
            resolveTimestampMs(data.createdAt) ||
            resolveTimestampMs(data.timestamp) ||
            resolveTimestampMs(data.paid_at);

          if (createdAtMs && createdAtMs < cutoffMs) {
            const ageDays = Math.max(1, Math.floor((Date.now() - createdAtMs) / (1000 * 60 * 60 * 24)));
            expiredFirestoreDocs.push({
              id: doc.id,
              collection: col.name,
              createdAt: new Date(createdAtMs).toISOString(),
              ageDays,
              title: data[col.titleField] || data.title || data.id || doc.id,
            });
          }
        }
      } catch (err) {
        console.error(`Error scanning Firestore collection ${col.name}:`, err.message);
      }
    }

    if (action === 'purge' && expiredFirestoreDocs.length > 0) {
      const BATCH_SIZE = 400;
      for (let i = 0; i < expiredFirestoreDocs.length; i += BATCH_SIZE) {
        const chunk = expiredFirestoreDocs.slice(i, i + BATCH_SIZE);
        const batch = adminDb.batch();
        chunk.forEach((item) => {
          batch.delete(adminDb.collection(item.collection).doc(item.id));
        });
        await batch.commit();
        deletedFirestoreCount += chunk.length;
      }
    }

    // -------------------------------------------------------------
    // B. CLOUDINARY EXPIRED MEDIA SCAN / PURGE (CUSTOMER ONLY)
    // Strictly excludes creator-uploads/, admin-uploads/, blogs/, site assets
    // -------------------------------------------------------------
    const expiredCloudinaryResources = [];
    let deletedCloudinaryCount = 0;
    let totalBytesReclaimed = 0;
    const hasCloudinary = Boolean(CLOUD_NAME && API_KEY && API_SECRET);

    if (hasCloudinary) {
      const resourceTypes = ['image', 'video', 'raw'];

      for (const rType of resourceTypes) {
        try {
          let nextCursor = null;
          let pageCount = 0;

          do {
            const url = new URL(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/${rType}`);
            url.searchParams.set('type', 'upload');
            url.searchParams.set('max_results', '500');
            if (nextCursor) url.searchParams.set('next_cursor', nextCursor);

            const res = await fetch(url.toString(), {
              headers: { Authorization: basicAuth() },
            });

            if (!res.ok) break;

            const data = await res.json();
            const resources = data.resources || [];
            nextCursor = data.next_cursor || null;

            for (const item of resources) {
              // PROTECT ADMIN & CREATOR UPLOADS
              if (isCloudinaryAssetProtected(item)) {
                continue;
              }

              const itemCreatedMs = item.created_at ? new Date(item.created_at).getTime() : null;
              if (itemCreatedMs && itemCreatedMs < cutoffMs) {
                const ageDays = Math.max(1, Math.floor((Date.now() - itemCreatedMs) / (1000 * 60 * 60 * 24)));
                expiredCloudinaryResources.push({
                  public_id: item.public_id,
                  resource_type: rType,
                  format: item.format || '',
                  bytes: item.bytes || 0,
                  created_at: item.created_at,
                  ageDays,
                  secure_url: item.secure_url || '',
                  folder: item.folder || item.asset_folder || 'user-uploads',
                });
                totalBytesReclaimed += item.bytes || 0;
              }
            }

            pageCount++;
          } while (nextCursor && pageCount < 5);
        } catch (err) {
          console.error(`Error scanning Cloudinary ${rType}:`, err.message);
        }
      }

      if (action === 'purge' && expiredCloudinaryResources.length > 0) {
        const grouped = {};
        expiredCloudinaryResources.forEach((item) => {
          // Double check protection safety before purging
          if (!isCloudinaryAssetProtected(item)) {
            if (!grouped[item.resource_type]) grouped[item.resource_type] = [];
            grouped[item.resource_type].push(item.public_id);
          }
        });

        for (const [rType, ids] of Object.entries(grouped)) {
          const BATCH_SIZE = 100;
          for (let i = 0; i < ids.length; i += BATCH_SIZE) {
            const chunk = ids.slice(i, i + BATCH_SIZE);
            try {
              const deleteRes = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/${rType}/upload`,
                {
                  method: 'DELETE',
                  headers: {
                    Authorization: basicAuth(),
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ public_ids: chunk }),
                }
              );
              if (deleteRes.ok) deletedCloudinaryCount += chunk.length;
            } catch (err) {
              console.error(`Error purging Cloudinary ${rType} batch:`, err.message);
            }
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      action,
      retentionDays,
      cutoffDate: cutoffDate.toISOString(),
      protectedSummary: {
        creatorsProtected: protectedCreatorIds.size,
        protectedCollections: ['creators', 'referralClicks', 'coupons', 'creatorGifts', 'crm_prospects', 'payouts', 'blogs', 'orders', 'commissions'],
        protectedMediaFolders: PROTECTED_CLOUDINARY_PREFIXES,
      },
      firestore: {
        totalScanned: expiredFirestoreDocs.length,
        deleted: action === 'purge' ? deletedFirestoreCount : 0,
        docs: expiredFirestoreDocs,
        collectionsScanned: targetCollections.map((c) => c.name),
      },
      cloudinary: {
        totalScanned: expiredCloudinaryResources.length,
        deleted: action === 'purge' ? deletedCloudinaryCount : 0,
        bytesReclaimed: totalBytesReclaimed,
        resources: expiredCloudinaryResources,
        configured: hasCloudinary,
      },
    });
  } catch (err) {
    console.error('Cleanup route error:', err);
    const msg = err?.message || 'Server error';
    const isAuthErr = msg.includes('Sign in required') || msg.includes('Admin access required');
    return NextResponse.json({ error: msg }, { status: isAuthErr ? 403 : 500 });
  }
}
