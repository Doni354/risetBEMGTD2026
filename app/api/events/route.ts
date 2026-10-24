import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { adminDb } from '@/lib/firebase/admin';
import { verifyAdmin, getTokenFromRequest, hasAdminPrivileges } from '@/lib/firebase/verify-admin';
import { VillageEvent } from '@/lib/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const EVENT_CATEGORIES = ['Keagamaan','Olahraga','Kebudayaan','Pendidikan','Sosial','Pemerintahan','Lainnya'];

/**
 * GET /api/events
 * Public: hanya yang approved. Admin (dengan token): semua.
 */
export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    let isAdmin = false;
    if (token) {
      const admin = await verifyAdmin(token);
      if (admin && hasAdminPrivileges(admin)) isAdmin = true;
    }

    const snapshot = await adminDb.collection('events').orderBy('date', 'asc').get();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let events: VillageEvent[] = snapshot.docs.map((doc: any) => doc.data() as VillageEvent);

    if (!isAdmin) {
      events = events.filter((e) => e.approved === true);
    }

    return NextResponse.json({ events });
  } catch (error) {
    console.error('[API] Error getting events:', error);
    return NextResponse.json({ error: 'Failed to get events' }, { status: 500 });
  }
}

/**
 * POST /api/events
 * Admin only — buat event baru
 */
export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const admin = await verifyAdmin(token);
    if (!admin || !hasAdminPrivileges(admin)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const data = await request.json();

    if (!data.title || !data.description || !data.location || !data.date || !data.organizer || !data.category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!EVENT_CATEGORIES.includes(data.category)) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
    }

    const eventId = `event_${Date.now()}`;
    const images: string[] = Array.isArray(data.images)
      ? data.images.filter((img: unknown) => typeof img === 'string' && img.trim().length > 0)
      : (data.imageUrl ? [data.imageUrl] : []);

    const event: VillageEvent = {
      id: eventId,
      title: data.title,
      description: data.description,
      location: data.location,
      date: data.date,
      endDate: data.endDate ? Number(data.endDate) : null,
      organizer: data.organizer,
      category: data.category,
      imageUrl: images[0] || data.imageUrl || '',
      images,
      approved: true, // auto-approve jika dibuat admin
      createdBy: admin.id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await adminDb.collection('events').doc(eventId).set(event);

    revalidatePath('/');
    revalidatePath('/events');

    return NextResponse.json({ message: 'Event created successfully', id: eventId, event }, { status: 201 });
  } catch (error) {
    console.error('[API] Error creating event:', error);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}
