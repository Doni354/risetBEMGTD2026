import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { verifyAdmin, getTokenFromRequest, isSuperAdmin, SUPER_ADMIN_EMAIL } from '@/lib/firebase/verify-admin';
import { UserRole } from '@/lib/types';

type RouteParams = { params: Promise<{ id: string }> };

const VALID_ROLES: UserRole[] = ['superadmin', 'admin', 'moderator', 'user'];

/**
 * PATCH /api/admin/users/[id]
 * Mengubah role user (Khusus Super Admin: doni.smpn1@gmail.com).
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const admin = await verifyAdmin(token);
    if (!admin || !isSuperAdmin(admin)) {
      return NextResponse.json({ error: 'Forbidden: Khusus Super Admin' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const newRole: UserRole = body.role;

    if (!newRole || !VALID_ROLES.includes(newRole)) {
      return NextResponse.json({ error: 'Role tidak valid' }, { status: 400 });
    }

    const userDoc = await adminDb.collection('admin_users').doc(id).get();
    if (!userDoc.exists) {
      return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 });
    }

    const userData = userDoc.data();
    const targetEmail = (userData?.email || '').toLowerCase().trim();

    // Prevent demoting primary superadmin
    if (targetEmail === SUPER_ADMIN_EMAIL.toLowerCase() && newRole !== 'superadmin') {
      return NextResponse.json(
        { error: 'Akun Super Admin utama tidak dapat diubah rolenya' },
        { status: 400 }
      );
    }

    await adminDb.collection('admin_users').doc(id).update({
      role: newRole,
      updatedAt: Date.now(),
      roleUpdatedBy: admin.email,
    });

    return NextResponse.json({
      success: true,
      message: `Role berhasil diubah menjadi ${newRole}`,
      id,
      role: newRole,
    });
  } catch (error) {
    console.error('[RBAC API] Error updating user role:', error);
    return NextResponse.json({ error: 'Gagal mengubah role user' }, { status: 500 });
  }
}
