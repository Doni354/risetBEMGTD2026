import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin, getTokenFromRequest, hasAdminPrivileges, isSuperAdmin } from '@/lib/firebase/verify-admin';

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await verifyAdmin(token);

    if (!user) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const isAdmin = hasAdminPrivileges(user);
    const superAdmin = isSuperAdmin(user);

    return NextResponse.json({
      success: true,
      isAdmin,
      isSuperAdmin: superAdmin,
      user,
    });
  } catch (error) {
    console.error('Verify admin error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
