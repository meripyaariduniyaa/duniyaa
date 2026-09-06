/**
 * Custom Coupon Registry & Server-Side Resolver
 * 
 * Defines private coupon codes and dynamically queries Firestore for
 * active creator, campaign, and gift coupons.
 */
import { normalizeCode } from './creator-club.js';

export const COUPON_REGISTRY = {
  // Format: 'code_lowercase': { percent: <1-100>, label: '<Your label>' },
  'kajukatli': { percent: 30, label: 'Triggered Insaan 30% Special' },
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
            return { valid: false, error: 'This coupon code has expired.' };
          }
        }

        if (data.max_uses && Number(data.usage_count || 0) >= Number(data.max_uses)) {
          return { valid: false, error: 'This coupon has reached its maximum usage limit.' };
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

