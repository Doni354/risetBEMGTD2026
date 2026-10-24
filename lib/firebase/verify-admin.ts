import { adminAuth, adminDb } from './admin';
import { AdminUser, UserRole } from '@/lib/types';

export const SUPER_ADMIN_EMAIL = 'doni.smpn1@gmail.com';

/**
 * Verify user from ID Token and sync their data in Firestore `admin_users` collection.
 * Default role for newly logged-in accounts is 'user', except for doni.smpn1@gmail.com which is 'superadmin'.
 */
export async function verifyAdmin(token: string): Promise<AdminUser | null> {
  try {
    if (!adminAuth || !adminDb) {
      console.warn('[Verify Admin] Firebase Admin not initialized.');
      return null;
    }

    // Verify the ID token
    const decodedToken = await adminAuth.verifyIdToken(token);
    const uid = decodedToken.uid;
    const email = (decodedToken.email || '').toLowerCase().trim();
    const isSuperAdminEmail = email === SUPER_ADMIN_EMAIL.toLowerCase();

    // Check if user is in admin_users collection
    const userDoc = await adminDb.collection('admin_users').doc(uid).get();

    if (userDoc.exists) {
      const existingData = userDoc.data() as AdminUser;
      let role: UserRole = existingData.role || 'user';

      // Always guarantee doni.smpn1@gmail.com is superadmin
      if (isSuperAdminEmail) {
        role = 'superadmin';
      }

      const updatedUser: AdminUser = {
        id: uid,
        email: email || existingData.email,
        displayName: decodedToken.name || existingData.displayName || email,
        photoURL: decodedToken.picture || existingData.photoURL || '',
        role,
        createdAt: existingData.createdAt || Date.now(),
        lastLogin: Date.now(),
      };

      await adminDb.collection('admin_users').doc(uid).set(updatedUser, { merge: true });
      return updatedUser;
    }

    // If user does not exist in DB yet:
    const newUser: AdminUser = {
      id: uid,
      email: email,
      displayName: decodedToken.name || (isSuperAdminEmail ? 'Doni (Super Admin)' : email),
      role: isSuperAdminEmail ? 'superadmin' : 'user',
      createdAt: Date.now(),
      lastLogin: Date.now(),
      photoURL: decodedToken.picture || '',
    };

    await adminDb.collection('admin_users').doc(uid).set(newUser);
    return newUser;
  } catch (error) {
    console.error('[Verify Admin] Error:', error);
    return null;
  }
}

/** Check if user has admin dashboard privileges (moderator, admin, or superadmin) */
export function hasAdminPrivileges(user: AdminUser | null): boolean {
  if (!user) return false;
  return user.role === 'admin' || user.role === 'superadmin' || user.role === 'moderator';
}

/** Check if user is the Super Admin (doni.smpn1@gmail.com or role superadmin) */
export function isSuperAdmin(user: AdminUser | null): boolean {
  if (!user) return false;
  return user.role === 'superadmin' || user.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();
}

/**
 * Get auth token from request headers (Bearer token)
 */
export function getTokenFromRequest(request: Request): string | null {
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }
  return null;
}
