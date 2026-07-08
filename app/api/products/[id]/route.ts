import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin, getTokenFromRequest } from '@/lib/firebase/verify-admin';
import { adminDb } from '@/lib/firebase/admin';
import { Product } from '@/lib/types';

type RouteParams = { params: Promise<{ id: string }> };

/**
 * GET /api/products/[id]
 * Get product by ID (public)
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const docSnap = await adminDb.collection('products').doc(id).get();

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
  { params }: RouteParams
) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const admin = await verifyAdmin(token);
    if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { id } = await params;
    const data = await request.json();

    await adminDb.collection('products').doc(id).update({
      ...data,
      updatedAt: Date.now(),
      approvedBy: admin.id,
      approvedAt: data.approved ? Date.now() : null,
    });

    return NextResponse.json({ message: 'Product updated successfully', id });
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
  { params }: RouteParams
) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const admin = await verifyAdmin(token);
    if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { id } = await params;
    await adminDb.collection('products').doc(id).delete();

    return NextResponse.json({ message: 'Product deleted successfully', id });
  } catch (error) {
    console.error('[API] Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
