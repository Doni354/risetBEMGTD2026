import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { verifyAdmin, getTokenFromRequest, isSuperAdmin, SUPER_ADMIN_EMAIL } from '@/lib/firebase/verify-admin';

/**
 * POST /api/admin/danger/delete-all
 * Menghapus semua data (produk, acara, atau semua data transaksi).
 * Khusus Super Admin: doni.smpn1@gmail.com
 */
export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const admin = await verifyAdmin(token);
    if (!admin || !isSuperAdmin(admin) || admin.email.toLowerCase() !== SUPER_ADMIN_EMAIL.toLowerCase()) {
      return NextResponse.json(
        { error: 'Akses ditolak: Fitur ini hanya dapat dieksekusi oleh doni.smpn1@gmail.com' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { target, confirmation } = body;

    // Safety confirmation: must match string 'HAPUS' or 'DELETE'
    if (confirmation !== 'HAPUS' && confirmation !== 'DELETE') {
      return NextResponse.json(
        { error: 'Konfirmasi tidak valid. Harap ketik "HAPUS" untuk melanjutkan.' },
        { status: 400 }
      );
    }

    let deletedProductsCount = 0;
    let deletedEventsCount = 0;

    // 1. Delete Products if requested
    if (target === 'products' || target === 'all') {
      const prodSnap = await adminDb.collection('products').get();
      if (!prodSnap.empty) {
        const batch = adminDb.batch();
        prodSnap.docs.forEach((doc: any) => {
          batch.delete(doc.ref);
          deletedProductsCount++;
        });
        await batch.commit();
      }
    }

    // 2. Delete Events if requested
    if (target === 'events' || target === 'all') {
      const eventSnap = await adminDb.collection('events').get();
      if (!eventSnap.empty) {
        const batch = adminDb.batch();
        eventSnap.docs.forEach((doc: any) => {
          batch.delete(doc.ref);
          deletedEventsCount++;
        });
        await batch.commit();
      }
    }

    return NextResponse.json({
      success: true,
      message: `Pembersihan data berhasil.`,
      deletedProductsCount,
      deletedEventsCount,
      target,
    });
  } catch (error) {
    console.error('[Danger API] Error deleting data:', error);
    return NextResponse.json({ error: 'Gagal melakukan pembersihan data' }, { status: 500 });
  }
}
