import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin, getTokenFromRequest } from '@/lib/firebase/verify-admin';

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const admin = await verifyAdmin(token);

    if (!admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      user: admin,
    });
  } catch (error) {
    console.error('Verify admin error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
