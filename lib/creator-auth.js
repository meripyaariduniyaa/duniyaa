import { getAdminAuth, getAdminDb } from '@/lib/firebase-admin';
import { isAdminEmail } from '@/lib/creator-club';

export async function requireUser(request) {
  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (!token) throw new Error('Sign in required.');
  return getAdminAuth().verifyIdToken(token);
}

export async function requireAdmin(request) {
  const user = await requireUser(request);
  if (!isAdminEmail(user.email)) throw new Error('Admin access required.');
  return user;
}

export async function requireCreator(request, options = {}) {
  const user = await requireUser(request);
  const creator = await getAdminDb().collection('creators').doc(user.uid).get();
  if (!creator.exists || !['active', 'approved'].includes(creator.data().status)) throw new Error('Creator access required.');
  if (options.requireAdmin && !isAdminEmail(user.email)) throw new Error('Admin access required.');
  return { user, creator: { id: creator.id, ...creator.data() } };
}
