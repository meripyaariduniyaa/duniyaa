/**
 * Custom Coupon Registry & Server-Side Resolver
 * 
 * Defines private coupon codes and dynamically queries Firestore for
 * active creator, campaign, and gift coupons.
 */
import { normalizeCode } from './creator-club.js';

export const COUPON_REGISTRY = {
  // Format: 'code_lowercase': { percent: <1-100>, label: '<Your label>' },
  // All active coupons are managed dynamically via Firestore database or env config.
};

/**
 * Validates and retrieves coupon details synchronously from memory/env.
 * Case-insensitive, trims whitespace, supports registry + env variables.
 */
export function getCouponRule(code) {
  if (!code || typeof code !== 'string') return null;
  const normalized = code.trim().toLowerCase();
  if (!normalized) return null;

  // 1. Direct registry lookup (case-insensitive key match)
  for (const [key, reg] of Object.entries(COUPON_REGISTRY)) {
    if (key.trim().toLowerCase() === normalized && reg) {
      return {
        code: normalizeCode(key),
        percent: Math.min(100, Math.max(1, Number(reg.percent) || 0)),
        label: reg.label || `${reg.percent}% Discount`,
        type: 'campaign',
        creator_id: null,
      };
    }
  }

  // 2. Dynamic JSON string in process.env.CUSTOM_COUPONS (e.g. '{"yt20": 20, "vip100": 100}')
  if (process.env.CUSTOM_COUPONS) {
    try {
      const parsed = JSON.parse(process.env.CUSTOM_COUPONS);
      if (parsed && typeof parsed === 'object') {
        for (const [key, val] of Object.entries(parsed)) {
          if (key.trim().toLowerCase() === normalized) {
            const percent = typeof val === 'number' ? val : Number(val?.percent || val);
            return {
              code: normalizeCode(key),
              percent: Math.min(100, Math.max(1, percent)),
              label: (typeof val === 'object' && val?.label) ? val.label : `${percent}% Campaign Discount`,
              type: 'campaign',
              creator_id: null,
            };
          }
        }
      }
    } catch { }
  }

  // 3. Fallback env vars
  if (process.env.COUPON_FULL_DISCOUNT && normalized === String(process.env.COUPON_FULL_DISCOUNT).trim().toLowerCase()) {
    return { code: normalizeCode(normalized), percent: 100, label: '100% Full Discount', type: 'campaign', creator_id: null };
  }
  if (process.env.COUPON_HALF_DISCOUNT && normalized === String(process.env.COUPON_HALF_DISCOUNT).trim().toLowerCase()) {
    return { code: normalizeCode(normalized), percent: 50, label: '50% Discount', type: 'campaign', creator_id: null };
  }

  return null;
}

/**
 * Server-side async resolver that checks Firestore first, then memory/env fallback.
 * Validates active status, expiry, max usage limits, minimum amounts, and template scope.
 */
export async function resolveCoupon(code, options = {}) {
  const { db, templateId, orderAmountPaise, creatorUserId } = options;
  if (!code || typeof code !== 'string') {
    return { valid: false, error: 'Please enter a coupon code.' };
  }

  const normalized = normalizeCode(code);
  if (!normalized) {
    return { valid: false, error: 'Invalid coupon code.' };
  }

  // 1. Check Firestore database coupons first (DB creator/campaign/gift coupons take precedence)
  if (db) {
    try {
      const snap = await db.collection('coupons').where('code', '==', normalized).limit(1).get();
      if (!snap.empty) {
        const doc = snap.docs[0];
        const data = doc.data();

        if (data.active === false) {
          return { valid: false, error: 'This coupon code is currently inactive.' };
        }

        if (data.expires_at) {
          const expDate = data.expires_at.toDate ? data.expires_at.toDate() : new Date(data.expires_at);
          if (expDate.getTime() < Date.now()) {
            if (data.active !== false && (data.type === 'organic_retention' || data.max_uses === 1)) {
              doc.ref?.update?.({ active: false }).catch(() => {});
            }
            return { valid: false, error: 'This coupon code has expired.' };
          }
        }

        if (data.max_uses && Number(data.usage_count || 0) >= Number(data.max_uses)) {
          const limitMsg = data.type === 'gift'
            ? 'This VIP gift pass has already been redeemed and claimed (single-use only).'
            : data.type === 'organic_retention'
            ? 'This single-use retention coupon has already been redeemed.'
            : 'This coupon has reached its maximum usage limit.';
          return { valid: false, error: limitMsg };
        }

        if (data.minimum_amount && Number(orderAmountPaise || 0) < Number(data.minimum_amount)) {
          return {
            valid: false,
            error: `This coupon requires a minimum order value of ₹${(Number(data.minimum_amount) / 100).toFixed(0)}.`
          };
        }

        if (Array.isArray(data.applicable_template_ids) && data.applicable_template_ids.length > 0) {
          if (templateId && !data.applicable_template_ids.includes(templateId)) {
            return {
              valid: false,
              error: 'This coupon is not valid for the selected gift experience.'
            };
          }
        }

        // For gift passes assigned to a specific creator
        if (data.type === 'gift' && data.creator_id && creatorUserId && data.creator_id !== creatorUserId) {
          return {
            valid: false,
            error: 'This gift pass is assigned to another creator account.'
          };
        }

        return {
          valid: true,
          id: doc.id,
          code: data.code,
          percent: Math.min(100, Math.max(1, Number(data.discount_percent) || 0)),
          type: data.type || (data.creator_id ? 'creator' : 'campaign'),
          creator_id: data.creator_id || null,
          label: data.label || (data.creator_id ? `${data.discount_percent}% Creator Discount` : `${data.discount_percent}% Discount`),
          applicable_template_ids: data.applicable_template_ids || [],
          isDatabaseCoupon: true,
        };
      }
    } catch (err) {
      console.error('Error resolving coupon from db:', err);
    }
  }

  // 2. Fallback to memory / env registry
  const legacyRule = getCouponRule(code);
  if (legacyRule) {
    return {
      valid: true,
      id: null,
      code: legacyRule.code,
      percent: legacyRule.percent,
      type: 'campaign',
      creator_id: null,
      label: legacyRule.label,
      applicable_template_ids: [],
      isDatabaseCoupon: false,
    };
  }

  return { valid: false, error: 'Invalid coupon code. Please check and try again.' };
}

/**
 * Generates an automatic, single-use 10% retention coupon for an organic consumer.
 * If an active unexpired coupon already exists for this noteId, returns that coupon.
 */
export async function generateOrganicRetentionCoupon(db, { noteId = null, durationMinutes = 15 } = {}) {
  if (!db) throw new Error('Database instance is required.');

  // Check if active non-expired coupon already exists for this note
  if (noteId) {
    try {
      const snap = await db.collection('coupons')
        .where('note_id', '==', String(noteId))
        .where('type', '==', 'organic_retention')
        .where('active', '==', true)
        .limit(1)
        .get();

      if (!snap.empty) {
        const doc = snap.docs[0];
        const data = doc.data();
        const expDate = data.expires_at?.toDate ? data.expires_at.toDate() : new Date(data.expires_at);
        const remainingMs = expDate.getTime() - Date.now();

        if (remainingMs > 0 && Number(data.usage_count || 0) < 1) {
          return {
            id: doc.id,
            code: data.code,
            discount_percent: data.discount_percent || 10,
            label: data.label || '10% Organic Retention Discount',
            expires_at: expDate.toISOString(),
            remaining_seconds: Math.max(0, Math.floor(remainingMs / 1000)),
            is_new: false,
          };
        } else if (remainingMs <= 0) {
          // Deactivate expired code
          await doc.ref.update({ active: false }).catch(() => {});
        }
      }
    } catch (err) {
      console.error('Error querying existing organic retention coupon:', err);
    }
  }

  // Generate unique coupon code (e.g. HOLD10-XXXX or SAVE10-XXXX)
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  const code = `SAVE10-${randomSuffix}`;
  const expiresAt = new Date(Date.now() + durationMinutes * 60 * 1000);

  const couponData = {
    code,
    type: 'organic_retention',
    discount_percent: 10,
    label: '10% Organic Retention Discount',
    active: true,
    max_uses: 1,
    usage_count: 0,
    note_id: noteId ? String(noteId) : null,
    expires_at: expiresAt,
    created_at: new Date(),
    updated_at: new Date(),
  };

  const ref = db.collection('coupons').doc();
  await ref.set(couponData);

  return {
    id: ref.id,
    code,
    discount_percent: 10,
    label: couponData.label,
    expires_at: expiresAt.toISOString(),
    remaining_seconds: durationMinutes * 60,
    is_new: true,
  };
}

/**
 * Disables / deactivates an organic retention coupon (e.g., when dismissed, abandoned, or unused).
 */
export async function disableOrganicRetentionCoupon(db, { code = null, couponId = null, noteId = null } = {}) {
  if (!db) throw new Error('Database instance is required.');

  try {
    if (couponId) {
      await db.collection('coupons').doc(couponId).update({
        active: false,
        updated_at: new Date(),
      });
      return { ok: true, disabledId: couponId };
    }

    if (code) {
      const normalized = normalizeCode(code);
      const snap = await db.collection('coupons').where('code', '==', normalized).limit(1).get();
      if (!snap.empty) {
        await snap.docs[0].ref.update({
          active: false,
          updated_at: new Date(),
        });
        return { ok: true, disabledId: snap.docs[0].id };
      }
    }

    if (noteId) {
      const snap = await db.collection('coupons')
        .where('note_id', '==', String(noteId))
        .where('type', '==', 'organic_retention')
        .get();

      const batch = db.batch();
      snap.docs.forEach((d) => {
        batch.update(d.ref, { active: false, updated_at: new Date() });
      });
      await batch.commit();
      return { ok: true, count: snap.size };
    }
  } catch (err) {
    console.error('Error disabling organic coupon:', err);
    return { ok: false, error: err.message };
  }

  return { ok: true };
}

