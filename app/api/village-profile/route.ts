import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { verifyAdmin, getTokenFromRequest } from '@/lib/firebase/verify-admin';
import { VillageProfile } from '@/lib/types';
import { MOCK_VILLAGE_PROFILE } from '@/lib/firebase/mock-data';

const VILLAGE_ID = 'main-village';

/**
 * GET /api/village-profile
 * Get village profile
 * Menggunakan adminDb untuk mem-bypass Firestore rules.
 */
export async function GET() {
  try {
    const docRef = adminDb.collection('village_profile').doc(VILLAGE_ID);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      // Jika kosong, kembalikan mock data
      return NextResponse.json(MOCK_VILLAGE_PROFILE);
    }

    return NextResponse.json(docSnap.data() as VillageProfile);
  } catch (error) {
    console.error('[API] Error getting village profile:', error);
    return NextResponse.json(
      { error: 'Failed to get village profile' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/village-profile
 * Update village profile (admin only)
 * Menggunakan adminDb untuk mem-bypass Firestore rules.
 */
export async function PUT(request: NextRequest) {
  try {
    // Get token from header
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify admin
    const admin = await verifyAdmin(token);
    if (!admin) {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    const data = await request.json();

    // Validate required fields
    if (!data.villageName || !data.description || !data.location) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Update profile
    await adminDb.collection('village_profile').doc(VILLAGE_ID).set({
      ...data,
      updatedAt: Date.now(),
    }, { merge: true });

    return NextResponse.json({
      message: 'Village profile updated successfully',
      id: VILLAGE_ID,
    });
  } catch (error) {
    console.error('[API] Error updating village profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
