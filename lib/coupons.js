/**
 * Custom Coupon Registry
 * 
 * Define private coupon codes for YouTubers, influencers, and marketing campaigns.
 * These codes are NOT displayed anywhere on the website.
 * Users apply them at checkout by typing them into the coupon box.
 * 
 * How to add a new coupon:
 * Add an entry below with:
 *   '[coupon_code_in_lowercase]': { percent: [1-100], label: '[Your custom label]' }
 * 
 * Example:
 *   'tanmay30': { percent: 30, label: 'Tanmay Bhat 30% Special' },
 *   'bbkivines50': { percent: 50, label: 'BB Ki Vines 50% Off' },
 *   'vipcreator100': { percent: 100, label: 'Creator VIP Pass (Free)' },
 */

export const COUPON_REGISTRY = {
  // Format: 'code_lowercase': { percent: <1-100>, label: '<Your label>' },

  // Examples for your YouTubers:
  'Kajukatli': { percent: 30, label: 'Triggered Insaan 30% Special' },
};


/**
 * Validates and retrieves coupon details.
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
        code: normalized,
        percent: Math.min(100, Math.max(1, Number(reg.percent) || 0)),
        label: reg.label || `${reg.percent}% Discount`
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
              code: normalized,
              percent: Math.min(100, Math.max(1, percent)),
              label: (typeof val === 'object' && val?.label) ? val.label : `${percent}% Creator Discount`
            };
          }
        }
      }
    } catch { }
  }

  // 3. Fallback env vars
  if (process.env.COUPON_FULL_DISCOUNT && normalized === String(process.env.COUPON_FULL_DISCOUNT).trim().toLowerCase()) {
    return { code: normalized, percent: 100, label: '100% Full Discount' };
  }
  if (process.env.COUPON_HALF_DISCOUNT && normalized === String(process.env.COUPON_HALF_DISCOUNT).trim().toLowerCase()) {
    return { code: normalized, percent: 50, label: '50% Discount' };
  }

  return null;
}
