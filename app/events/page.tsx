import { Metadata } from 'next';
import Link from 'next/link';
import { adminDb } from '@/lib/firebase/admin';
import { VillageEvent, getItemImages } from '@/lib/types';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { CalendarDays, MapPin } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Acara & Agenda Desa',
  description: 'Daftar acara, agenda, dan kegiatan warga desa.',
};

export default async function EventsPage() {
  let events: VillageEvent[] = [];

  try {
    const snapshot = await adminDb.collection('events')
      .where('approved', '==', true)
      .get();
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let fetchedEvents = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }) as VillageEvent);
    fetchedEvents.sort((a: VillageEvent, b: VillageEvent) => b.date - a.date);
    events = fetchedEvents;
  } catch (error) {
    console.error('Error fetching events:', error);
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Header */}
        <div className="bg-[#1B4332] py-20 px-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#C9A84C]/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />
          
          <div className="max-w-6xl mx-auto relative z-10 text-center">
            <span className="text-[#C9A84C] font-semibold text-sm tracking-widest uppercase mb-3 block text-shadow-sm">Agenda Desa</span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Acara & Kegiatan</h1>
            <p className="text-white/70 max-w-2xl mx-auto">
              Ikuti jadwal kegiatan warga, festival, rapat terbuka, dan perlombaan yang diselenggarakan di desa kami.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.length > 0 ? events.map((event) => {
              const eventImages = getItemImages(event);
              const cover = eventImages[0] || event.imageUrl;
              return (
              <Link key={event.id} href={`/events/${event.id}`} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 hover:border-[#1B4332]/20 transition-all duration-300 group flex flex-col block">
                <div className="relative h-56 overflow-hidden bg-gray-100 flex-shrink-0">
                  {cover ? (
                    <img src={cover} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#1B4332]/5">
                      <CalendarDays className="w-12 h-12 text-[#1B4332]/20" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-[#1B4332] text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                    {new Date(event.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                  {eventImages.length > 1 && (
                    <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                      📷 {eventImages.length} Foto
                    </div>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-xs text-[#C9A84C] font-semibold mb-2 uppercase tracking-wide">
                    {event.category}
                  </div>
                  <h3 className="font-bold text-gray-900 text-xl mb-3 group-hover:text-[#1B4332] transition-colors">{event.title}</h3>
                  <p className="text-gray-500 text-sm mb-4 leading-relaxed line-clamp-3 flex-1">{event.description}</p>
                  
                  <div className="pt-4 border-t border-gray-50 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="truncate">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-gray-400 font-medium">Oleh:</span>
                      <span className="truncate">{event.organizer}</span>
                    </div>
                  </div>
                </div>
              </Link>
              );
            }) : (
              <div className="col-span-full py-16 px-4 bg-white rounded-3xl border border-gray-100 shadow-sm text-center max-w-lg mx-auto">
                <CalendarDays className="w-14 h-14 text-[#C9A84C] mx-auto mb-3" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Belum Ada Agenda Terjadwal</h3>
                <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">
                  Saat ini belum ada acara desa yang akan diselenggarakan. Warga, RT/RW, dan panitia dapat mendaftarkan acara melalui aplikasi mobile resmi.
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <Link
                    href="/app"
                    className="px-6 py-2.5 rounded-xl bg-[#1B4332] text-white font-semibold text-xs hover:bg-[#2D6A4F] transition"
                  >
                    Unduh Aplikasi Warga
                  </Link>
                  <Link
                    href="/"
                    className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold text-xs hover:bg-gray-50 transition"
                  >
                    Kembali ke Beranda
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
