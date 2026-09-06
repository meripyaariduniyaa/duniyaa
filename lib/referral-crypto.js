import crypto from 'crypto';

export function getReferralSecret() {
  return process.env.REFERRAL_COOKIE_SECRET || 'lovelycrafts-referral-secret-key-32chars';
}

export function signReferral(creatorId, expiresAt) {
  const payload = `${creatorId}.${expiresAt}`;
  const secret = getReferralSecret();
  const signature = crypto.createHmac('sha256', secret).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

export function verifyReferral(value) {
  try {
    const parts = String(value || '').split('.');
    if (parts.length < 3) return null;
    const [creatorId, expiry, signature] = parts;
    if (!creatorId || !expiry || !signature) return null;
    if (Number(expiry) < Date.now()) return null;

    const expectedSignature = signReferral(creatorId, expiry).split('.').pop();
    const sigBuf = Buffer.from(signature);
    const expBuf = Buffer.from(expectedSignature);
    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
      return null;
    }
    return { creatorId, expiresAt: Number(expiry) };
  } catch {
    return null;
  }
}
