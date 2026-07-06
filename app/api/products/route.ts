import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { verifyAdmin, getTokenFromRequest } from '@/lib/firebase/verify-admin';
import { Product } from '@/lib/types';
import { MOCK_PRODUCTS } from '@/lib/firebase/mock-data';

/**
 * GET /api/products
 * Get approved products (public)
 * Menggunakan adminDb untuk mem-bypass Firestore rules.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('limit') || '12');

    // Admin passes limit=100 to get all products in dashboard.
    // Wait, if it's a public request, it should only get approved products.
    // If it's admin (token provided), it should get ALL products.
    const token = getTokenFromRequest(request);
    let isAdmin = false;
    
    if (token) {
      const admin = await verifyAdmin(token);
      if (admin) isAdmin = true;
    }

    const snapshot = await adminDb.collection('products').orderBy('createdAt', 'desc').get();
    
    let products = snapshot.docs.map((doc: any) => doc.data() as Product);

    // Only filter approved if NOT admin (IN-MEMORY to avoid composite index errors)
    if (!isAdmin) {
      products = products.filter((p: Product) => p.approved === true);
    }

    // Fallback to mock products if database is empty/offline
    if (products.length === 0) {
      products = MOCK_PRODUCTS;
    }

    // Manual basic pagination for array
    const startIndex = (page - 1) * pageSize;
    const paginatedProducts = products.slice(startIndex, startIndex + pageSize);
    const hasMore = startIndex + pageSize < products.length;

    return NextResponse.json({
      products: paginatedProducts,
      page,
      hasMore,
      pageSize,
    });
  } catch (error) {
    console.error('[API] Error getting products:', error);
    return NextResponse.json(
      { error: 'Failed to get products' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/products
 * Create new product (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const admin = await verifyAdmin(token);
    if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const data = await request.json();

    if (!data.name || !data.description || !data.price || !data.category || !data.whatsappLink) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const productId = `product_${Date.now()}`;
    const product: Product = {
      id: productId,
      name: data.name,
      description: data.description,
      price: parseFloat(data.price),
      imageUrl: data.imageUrl || '',
      category: data.category,
      stock: parseInt(data.stock) || 0,
      whatsappLink: data.whatsappLink,
      approved: true, // Auto-approve since created by admin
      createdBy: admin.id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await adminDb.collection('products').doc(productId).set(product);

    return NextResponse.json({ message: 'Product created successfully', id: productId, product }, { status: 201 });
  } catch (error) {
    console.error('[API] Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
