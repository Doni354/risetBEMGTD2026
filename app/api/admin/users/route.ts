import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase/admin';
import { verifyAdmin, getTokenFromRequest, isSuperAdmin, SUPER_ADMIN_EMAIL } from '@/lib/firebase/verify-admin';
import { AdminUser, UserRole } from '@/lib/types';

/**
 * GET /api/admin/users
 * Mengambil semua user yang terdaftar di sistem.
 * Khusus Super Admin (doni.smpn1@gmail.com).
 */
export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const admin = await verifyAdmin(token);
    if (!admin || !isSuperAdmin(admin)) {
      return NextResponse.json({ error: 'Forbidden: Khusus Super Admin' }, { status: 403 });
    }

    const usersMap = new Map<string, AdminUser>();

    // 1. Ambil dari Firestore `admin_users`
    try {
      const snap = await adminDb.collection('admin_users').get();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      snap.docs.forEach((doc: any) => {
        const d = doc.data() as AdminUser;
        const email = (d.email || '').toLowerCase().trim();
        usersMap.set(doc.id, {
          ...d,
          id: doc.id,
          role: email === SUPER_ADMIN_EMAIL.toLowerCase() ? 'superadmin' : (d.role || 'user'),
        });
      });
    } catch (err) {
      console.warn('[RBAC API] Could not fetch Firestore users:', err);
    }

    // 2. Sync dengan Firebase Auth jika adminAuth tersedia
    if (adminAuth) {
      try {
        const authList = await adminAuth.listUsers(1000);
        for (const userRecord of authList.users) {
          const email = (userRecord.email || '').toLowerCase().trim();
          if (!usersMap.has(userRecord.uid)) {
            const isSuper = email === SUPER_ADMIN_EMAIL.toLowerCase();
            const newUser: AdminUser = {
              id: userRecord.uid,
              email: email || userRecord.uid,
              displayName: userRecord.displayName || (isSuper ? 'Doni (Super Admin)' : email),
              role: isSuper ? 'superadmin' : 'user',
              photoURL: userRecord.photoURL || '',
              createdAt: userRecord.metadata.creationTime
                ? new Date(userRecord.metadata.creationTime).getTime()
                : Date.now(),
              lastLogin: userRecord.metadata.lastSignInTime
                ? new Date(userRecord.metadata.lastSignInTime).getTime()
                : undefined,
            };
            // Save to Firestore so it is permanently tracked
            await adminDb.collection('admin_users').doc(userRecord.uid).set(newUser, { merge: true });
            usersMap.set(userRecord.uid, newUser);
          }
        }
      } catch (err) {
        console.warn('[RBAC API] Could not list users from adminAuth:', err);
      }
    }

    const users = Array.from(usersMap.values()).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

    return NextResponse.json({ users });
  } catch (error) {
    console.error('[RBAC API] Error listing users:', error);
    return NextResponse.json({ error: 'Gagal memuat daftar user' }, { status: 500 });
  }
}
