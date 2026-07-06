import { adminAuth, adminDb } from './admin';
import { AdminUser } from '@/lib/types';

/**
 * Verify if a user is an admin
 * Used in API routes to protect admin endpoints
 */
export async function verifyAdmin(token: string): Promise<AdminUser | null> {
  try {
    // Verify the ID token
    const decodedToken = await adminAuth.verifyIdToken(token);
    const uid = decodedToken.uid;

    // Check if user is in admin_users collection
    const adminDoc = await adminDb.collection('admin_users').doc(uid).get();

    if (adminDoc.exists) {
      const adminData = adminDoc.data() as AdminUser;
      // Update last login
      await adminDb.collection('admin_users').doc(uid).update({
        lastLogin: Date.now(),
      });
      return adminData;
    }

    return null;
  } catch (error) {
    console.error('[Verify Admin] Error:', error);
    return null;
  }
}

/**
 * Get auth token from request cookies
 */
export function getTokenFromRequest(request: Request): string | null {
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }
  return null;
}
