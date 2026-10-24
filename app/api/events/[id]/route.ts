import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { verifyAdmin, getTokenFromRequest, hasAdminPrivileges, isSuperAdmin } from '@/lib/firebase/verify-admin';
import { adminDb } from '@/lib/firebase/admin';
import { VillageEvent } from '@/lib/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type RouteParams = { params: Promise<{ id: string }> };

/**
 * GET /api/events/[id]
 * Public — hanya kalau approved
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const docSnap = await adminDb.collection('events').doc(id).get();

    if (!docSnap.exists) return NextResponse.json({ error: 'Event not found' }, { status: 404 });

    const event = docSnap.data() as VillageEvent;
    if (!event.approved) return NextResponse.json({ error: 'Event not available' }, { status: 404 });

    return NextResponse.json(event);
  } catch (error) {
    console.error('[API] Error getting event:', error);
    return NextResponse.json({ error: 'Failed to get event' }, { status: 500 });
  }
}

/**
 * PATCH /api/events/[id]
 * Admin only.
 * - Jika createdBy === admin.id atau Super Admin: bisa edit semua field
 * - Jika bukan: hanya bisa update field 'approved'
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const admin = await verifyAdmin(token);
    if (!admin || !hasAdminPrivileges(admin)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { id } = await params;
    const docSnap = await adminDb.collection('events').doc(id).get();
    if (!docSnap.exists) return NextResponse.json({ error: 'Event not found' }, { status: 404 });

    const existing = docSnap.data() as VillageEvent;
    const data = await request.json();

    let updateData: Partial<VillageEvent> & { updatedAt: number; approvedBy?: string; approvedAt?: number };

    if (existing.createdBy === admin.id || isSuperAdmin(admin)) {
      // Full edit — event milik admin ini sendiri atau Super Admin
      const updatedFields = { ...data };
      if (Array.isArray(updatedFields.images)) {
        updatedFields.images = updatedFields.images.filter((img: unknown) => typeof img === 'string' && img.trim().length > 0);
        updatedFields.imageUrl = updatedFields.images[0] || updatedFields.imageUrl || '';
      } else if (updatedFields.imageUrl && !updatedFields.images) {
        updatedFields.images = [updatedFields.imageUrl];
      }
      if ('endDate' in data) {
        updatedFields.endDate = data.endDate ? Number(data.endDate) : null;
      }
      updateData = { ...updatedFields, updatedAt: Date.now() };
    } else {
      // Restricted — hanya boleh approve/reject
      updateData = {
        approved: data.approved,
        approvedBy: admin.id,
        approvedAt: data.approved ? Date.now() : undefined,
        updatedAt: Date.now(),
      };
    }

    await adminDb.collection('events').doc(id).update(updateData);
    revalidatePath('/');
    revalidatePath('/events');
    revalidatePath(`/events/${id}`);
    return NextResponse.json({ message: 'Event updated successfully', id });
  } catch (error) {
    console.error('[API] Error updating event:', error);
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
  }
}

/**
 * DELETE /api/events/[id]
 * Admin always allowed to delete
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const admin = await verifyAdmin(token);
    if (!admin || !hasAdminPrivileges(admin)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { id } = await params;
    await adminDb.collection('events').doc(id).delete();
    revalidatePath('/');
    revalidatePath('/events');
    revalidatePath(`/events/${id}`);

    return NextResponse.json({ message: 'Event deleted successfully', id });
  } catch (error) {
    console.error('[API] Error deleting event:', error);
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}
