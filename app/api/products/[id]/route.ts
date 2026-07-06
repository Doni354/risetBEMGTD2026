import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin, getTokenFromRequest } from '@/lib/firebase/verify-admin';
import { adminDb } from '@/lib/firebase/admin';
import { Product } from '@/lib/types';

/**
 * GET /api/products/[id]
 * Get product by ID (public)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const docSnap = await adminDb.collection('products').doc(params.id).get();

    if (!docSnap.exists) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const product = docSnap.data() as Product;

    // Only return if approved
    if (!product.approved) {
      return NextResponse.json({ error: 'Product not available' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('[API] Error getting product:', error);
    return NextResponse.json({ error: 'Failed to get product' }, { status: 500 });
  }
}

/**
 * PATCH /api/products/[id]
 * Update product (admin only)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const admin = await verifyAdmin(token);
    if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const data = await request.json();

    await adminDb.collection('products').doc(params.id).update({
      ...data,
      updatedAt: Date.now(),
      approvedBy: admin.id,
      approvedAt: data.approved ? Date.now() : null,
    });

    return NextResponse.json({ message: 'Product updated successfully', id: params.id });
  } catch (error) {
    console.error('[API] Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

/**
 * DELETE /api/products/[id]
 * Delete product (admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const admin = await verifyAdmin(token);
    if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    await adminDb.collection('products').doc(params.id).delete();

    return NextResponse.json({ message: 'Product deleted successfully', id: params.id });
  } catch (error) {
    console.error('[API] Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
