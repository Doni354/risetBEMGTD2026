import { Metadata } from 'next';
import { adminDb } from '@/lib/firebase/admin';
import { VillageEvent, getItemImages } from '@/lib/types';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import MediaGallery from '@/components/media-gallery';
import { CalendarDays, MapPin, User, Clock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const doc = await adminDb.collection('events').doc(resolvedParams.id).get();
  if (!doc.exists) return { title: 'Acara Tidak Ditemukan' };
  const data = doc.data() as VillageEvent;
  
  return {
    title: `${data.title} | Acara Desa`,
    description: data.description,
  };
}

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  // 1. Fetch main event
  const doc = await adminDb.collection('events').doc(resolvedParams.id).get();
  if (!doc.exists) notFound();
  
  const event = doc.data() as VillageEvent;
  
  if (!event.approved) {
    // Hide unapproved events from public
    notFound();
  }

  const eventImages = getItemImages(event);
  const coverImage = eventImages[0] || event.imageUrl;

  // 2. Fetch related events
  let relatedEvents: VillageEvent[] = [];
  try {
    const relatedSnap = await adminDb.collection('events')
      .where('approved', '==', true)
      .where('category', '==', event.category)
      .limit(4)
      .get();
      
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let fetchedRelated = relatedSnap.docs.map((d: any) => d.data() as VillageEvent);
    fetchedRelated = fetchedRelated.filter((e: VillageEvent) => e.id !== event.id); // exclude current
    fetchedRelated.sort((a: VillageEvent, b: VillageEvent) => b.date - a.date);
    relatedEvents = fetchedRelated.slice(0, 3); // Take max 3
  } catch (error) {
    console.error('Error fetching related events:', error);
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Cover / Hero */}
        <div className="relative w-full h-72 md:h-96 bg-gray-900 overflow-hidden">
          {coverImage ? (
             <img 
               src={coverImage} 
               alt={event.title} 
               className="w-full h-full object-cover opacity-60" 
             />
          ) : (
            <div className="w-full h-full bg-[#1B4332] opacity-80" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          
          <div className="absolute inset-0 flex flex-col justify-end">
            <div className="max-w-4xl w-full mx-auto px-4 pb-12">
              <Link href="/events" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors text-sm font-medium">
                <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Acara
              </Link>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-[#C9A84C] text-white rounded-full text-xs flex items-center font-bold tracking-wide uppercase shadow-sm">
                  {event.category}
                </span>
                {eventImages.length > 1 && (
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white rounded-full text-xs font-semibold shadow-sm flex items-center gap-1">
                    📷 {eventImages.length} Foto
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
                {event.title}
              </h1>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="max-w-4xl mx-auto px-4 py-12 -mt-10 relative z-10">
          <div className="bg-white rounded-3xl p-6 md:p-12 shadow-xl border border-gray-100 mb-16">
            
            <div className="grid md:grid-cols-3 gap-8 mb-10 pb-10 border-b border-gray-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#1B4332]/5 flex items-center justify-center flex-shrink-0">
                  <CalendarDays className="w-6 h-6 text-[#1B4332]" />
                </div>
                <div>
                  <h4 className="text-sm text-gray-500 font-medium mb-1">Tanggal Acara</h4>
                  <p className="font-bold text-gray-900">
                    {new Date(event.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#1B4332]/5 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-[#1B4332]" />
                </div>
                <div>
                  <h4 className="text-sm text-gray-500 font-medium mb-1">Jam</h4>
                  <p className="font-bold text-gray-900">
                    {new Date(event.date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB 
                    {event.endDate ? ` - ${new Date(event.endDate).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB` : ' s.d. Selesai'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#1B4332]/5 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-[#1B4332]" />
                </div>
                <div>
                  <h4 className="text-sm text-gray-500 font-medium mb-1">Lokasi</h4>
                  <p className="font-bold text-gray-900">{event.location}</p>
                </div>
              </div>
            </div>

            <div className="prose prose-lg max-w-none prose-p:text-gray-600 prose-headings:text-gray-900">
              <h3 className="text-xl font-bold mb-4">Detail Acara</h3>
              {event.description.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4">{paragraph}</p>
              ))}
            </div>

            {/* Media Gallery / Dokumentasi & Pamflet Acara */}
            {eventImages.length > 0 && (
              <div className="mt-10 pt-10 border-t border-gray-100">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Galeri & Pamflet Acara
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Lihat foto dokumentasi, brosur, atau suasana acara
                    </p>
                  </div>
                  {eventImages.length > 1 && (
                    <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 font-semibold border border-emerald-100">
                      {eventImages.length} Foto
                    </span>
                  )}
                </div>
                <MediaGallery
                  images={eventImages}
                  title={event.title}
                  aspectRatio="video"
                />
              </div>
            )}

            <div className="mt-12 pt-8 border-t border-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6 text-gray-400" />
              </div>
              <div>
                <h4 className="text-sm text-gray-500 font-medium">Penyelenggara</h4>
                <p className="font-bold text-gray-900">{event.organizer}</p>
              </div>
            </div>
          </div>

          {/* Related Events */}
          {relatedEvents.length > 0 && (
            <div className="mb-16">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Acara Terkait Lainnya</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedEvents.map((rel) => {
                  const relImages = getItemImages(rel);
                  const relCover = relImages[0] || rel.imageUrl;
                  return (
                    <Link key={rel.id} href={`/events/${rel.id}`} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 hover:border-[#1B4332]/20 transition-all duration-300 group flex flex-col block">
                      <div className="relative h-48 overflow-hidden bg-gray-100 flex-shrink-0">
                        {relCover ? (
                          <>
                            <img src={relCover} alt={rel.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            {relImages.length > 1 && (
                              <span className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-sm">
                                📷 {relImages.length} Foto
                              </span>
                            )}
                          </>
                        ) : (
                           <div className="w-full h-full flex items-center justify-center bg-[#1B4332]/5">
                              <CalendarDays className="w-8 h-8 text-[#1B4332]/20" />
                           </div>
                        )}
                      </div>
                      <div className="p-5 flex flex-col flex-1">
                        <h4 className="font-bold text-gray-900 mb-2 group-hover:text-[#1B4332] transition-colors line-clamp-1">{rel.title}</h4>
                        <p className="text-xs text-gray-500 text-sm mb-4 leading-relaxed line-clamp-2 flex-1">{rel.description}</p>
                        <div className="pt-3 border-t border-gray-50 text-xs font-semibold text-[#1B4332]">
                          {new Date(rel.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
