import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { MOCK_VILLAGE_PROFILE, MOCK_PRODUCTS } from '@/lib/firebase/mock-data';

export async function GET(request: NextRequest) {
  // Only allow seeding in development mode
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Forbidden - Development only' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const adminUid = searchParams.get('uid');

    if (!adminUid) {
      return NextResponse.json({
        error: 'Missing uid parameter. Please use /api/seed?uid=YOUR_GOOGLE_UID to register yourself as admin.',
      }, { status: 400 });
    }

    // 1. Seed Village Profile
    await adminDb.collection('village_profile').doc('main-village').set({
      ...MOCK_VILLAGE_PROFILE,
      updatedAt: Date.now(),
      createdAt: Date.now(),
    });

    // 2. Seed Products
    for (const product of MOCK_PRODUCTS) {
      await adminDb.collection('products').doc(product.id).set({
        ...product,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }

    // 3. Seed Admin User
    await adminDb.collection('admin_users').doc(adminUid).set({
      id: adminUid,
      email: 'admin@example.com', // Will be registered with details on next log-in
      displayName: 'Default Admin',
      role: 'admin',
      createdAt: Date.now(),
      lastLogin: null,
    });

    return NextResponse.json({
      message: 'Database seeded successfully!',
      seededVillageProfile: MOCK_VILLAGE_PROFILE.villageName,
      seededProductsCount: MOCK_PRODUCTS.length,
      registeredAdminUid: adminUid,
    });
  } catch (error: any) {
    console.error('Seeding failed:', error);
    return NextResponse.json({
      error: 'Seeding failed. Make sure you have set up your Firebase Admin SDK service account credentials in .env.local.',
      details: error.message,
    }, { status: 500 });
  }
}
