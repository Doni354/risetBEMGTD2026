import { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, Phone, Mail, Users, Home, Ruler } from 'lucide-react';
import { getDocument } from '@/lib/firebase/utils';
import { VillageProfile, VillageEvent } from '@/lib/types';
import { MOCK_VILLAGE_PROFILE, MOCK_PRODUCTS } from '@/lib/firebase/mock-data';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

import { adminDb } from '@/lib/firebase/admin';

export const revalidate = 3600;

/**
 * Homepage Desa Kwanyar
 * Sections: Hero, Tentang, Statistik, Potensi Unggulan, Acara, Produk Preview
 * Menggunakan ISR (revalidate 1 jam) untuk efisiensi Firestore reads.
 */
async function HomePage() {
  let profile = MOCK_VILLAGE_PROFILE;
  let events: VillageEvent[] = [];

  try {
    const docSnap = await adminDb.collection('village_profile').doc('main-village').get();
    if (docSnap.exists) {
      profile = docSnap.data() as VillageProfile;
    }

    const eventsSnap = await adminDb.collection('events')
      .where('approved', '==', true)
      .get();
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let fetchedEvents = eventsSnap.docs.map((doc: any) => doc.data() as VillageEvent);
    // Sort in memory to avoid Firebase Composite Index requirement error
    fetchedEvents.sort((a: VillageEvent, b: VillageEvent) => b.date - a.date);
    events = fetchedEvents.slice(0, 3);
  } catch (error) {
    console.error('Error fetching data on server:', error);
  }

  const descParagraphs = profile.description?.split('\n\n') || [];

  return (
    <>
      <Navbar />
      <main>
        {/* ── Hero Section ── */}
        <section className="relative h-[70vh] min-h-[480px] flex items-end overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${profile.imageUrl || '/kwanyar_hero.png'})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="relative z-10 max-w-6xl mx-auto px-4 pb-14 w-full">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-[#C9A84C]" />
              <span className="text-white/80 text-sm">{profile.location}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-3 tracking-tight">
              {profile.villageName}
            </h1>
            <p className="text-white/80 text-lg max-w-2xl leading-relaxed">
              {descParagraphs[0]?.slice(0, 200)}...
            </p>
            <div className="flex gap-3 mt-6">
              <Link
                href="/products"
                className="px-6 py-3 bg-[#C9A84C] text-white rounded-xl font-semibold hover:bg-[#b8943e] transition text-sm"
              >
                Jelajahi Produk Desa
              </Link>
              <a
                href="#tentang"
                className="px-6 py-3 bg-white/10 text-white backdrop-blur rounded-xl font-semibold hover:bg-white/20 transition text-sm border border-white/20"
              >
                Tentang Kami
              </a>
            </div>
          </div>
        </section>

        {/* ── Tentang Desa ── */}
        <section id="tentang" className="py-20 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-[#C9A84C] font-semibold text-sm tracking-wider uppercase">Tentang Desa</span>
              <h2 className="text-3xl font-bold text-gray-900 mt-2">Mengenal {profile.villageName}</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div className="space-y-4">
                {descParagraphs.map((p, i) => (
                  <p key={i} className="text-gray-600 leading-relaxed">{p}</p>
                ))}
              </div>
              {profile.visionMission && (
                <div className="bg-[#1B4332]/5 rounded-2xl p-8 border border-[#1B4332]/10">
                  <h3 className="font-bold text-[#1B4332] mb-4 text-lg">Visi & Misi</h3>
                  {profile.visionMission.split('\n').map((line, i) => (
                    <p key={i} className="text-gray-600 text-sm leading-relaxed mb-1">
                      {line}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── Statistik Kependudukan ── */}
        {profile.demographics && (
          <section className="py-16 px-4 bg-[#FAFAF8]">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-10">
                <span className="text-[#C9A84C] font-semibold text-sm tracking-wider uppercase">Data Desa</span>
                <h2 className="text-3xl font-bold text-gray-900 mt-2">Statistik Kependudukan</h2>
              </div>
              <div className="grid grid-cols-3 gap-6">
                {[
                  { icon: Users, label: 'Penduduk', value: profile.demographics.population?.toLocaleString('id-ID') || '-', suffix: 'jiwa' },
                  { icon: Home, label: 'Kepala Keluarga', value: profile.demographics.households?.toLocaleString('id-ID') || '-', suffix: 'KK' },
                  { icon: Ruler, label: 'Luas Wilayah', value: profile.demographics.area || '-', suffix: '' },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-sm hover:shadow-md transition"
                  >
                    <div className="w-12 h-12 bg-[#1B4332]/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <stat.icon className="w-6 h-6 text-[#1B4332]" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value} <span className="text-sm font-normal text-gray-500">{stat.suffix}</span>
                    </p>
                    <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Potensi Unggulan ── */}
        {profile.highlights && profile.highlights.length > 0 && (
          <section className="py-24 px-4 bg-white relative">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
            <div className="max-w-6xl mx-auto relative z-10">
              <div className="text-center mb-16">
                <span className="text-[#C9A84C] font-semibold text-sm tracking-widest uppercase">Potensi Unggulan</span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3">Kekayaan Desa Kami</h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {profile.highlights.map((h, i) => (
                  <div
                    key={i}
                    className="group bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl border border-gray-100 hover:border-[#1B4332]/20 transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#1B4332]/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform" />
                    <span className="text-5xl block mb-6 drop-shadow-sm">{h.icon}</span>
                    <h3 className="font-bold text-gray-900 mb-3 text-lg">{h.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{h.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Acara Desa ── */}
        <section className="py-24 px-4 bg-[#FAFAF8]">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div>
                <span className="text-[#C9A84C] font-semibold text-sm tracking-widest uppercase">Agenda</span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3">Acara & Kegiatan Desa</h2>
                <p className="text-gray-500 mt-3 text-base">Ikuti berbagai kegiatan seru dan bermanfaat di lingkungan desa kami.</p>
              </div>
              <Link
                href="/events"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-[#1B4332]/20 text-[#1B4332] font-semibold hover:bg-[#1B4332] hover:text-white transition-all text-sm group shadow-sm"
              >
                Lihat Semua Acara 
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.length > 0 ? events.map((event) => (
                <div key={event.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 hover:border-[#1B4332]/20 transition-all duration-300 group">
                  <div className="relative h-56 overflow-hidden bg-gray-100">
                    {event.imageUrl ? (
                      <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#1B4332]/5">
                        <span className="text-4xl">📅</span>
                      </div>
                    )}
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-[#1B4332] text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                      {new Date(event.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-xs text-[#C9A84C] font-semibold mb-2 uppercase tracking-wide">
                      {event.category}
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-1 group-hover:text-[#1B4332] transition-colors">{event.title}</h3>
                    <p className="text-gray-500 text-sm line-clamp-2 mb-4 leading-relaxed">{event.description}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span className="truncate w-full">📍 {event.location}</span>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="col-span-full text-center py-12 bg-white rounded-3xl border border-dashed border-gray-200">
                  <span className="text-4xl mb-3 block">🗓️</span>
                  <p className="text-gray-500">Belum ada kegiatan/acara dalam waktu dekat.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── Produk Desa Preview ── */}
        <section className="py-24 px-4 bg-[#1B4332] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#C9A84C]/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />
          
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="text-center mb-16">
              <span className="text-[#C9A84C] font-semibold text-sm tracking-widest uppercase text-shadow-sm">Marketplace</span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mt-3">Produk Unggulan Desa</h2>
              <p className="text-white/70 mt-4 text-base max-w-2xl mx-auto">Dukung ekonomi lokal dengan membeli produk karya warga kami. Kualitas terbaik langsung dari tangan pengrajin.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(MOCK_PRODUCTS.slice(0, 3)).map((product) => (
                <div key={product.id} className="bg-white/10 backdrop-blur-md rounded-3xl overflow-hidden border border-white/10 hover:border-white/30 hover:bg-white/20 transition-all duration-300 group shadow-xl">
                  {product.imageUrl && (
                    <div className="h-56 overflow-hidden">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="font-bold text-white text-lg mb-2">{product.name}</h3>
                    <p className="text-white/60 text-sm line-clamp-2 mb-4 leading-relaxed">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-[#C9A84C] font-bold text-xl">
                        Rp {product.price.toLocaleString('id-ID')}
                      </p>
                      <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#C9A84C]">
                        →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#C9A84C] text-[#1B4332] font-extrabold hover:bg-[#FFE599] transition-all hover:scale-105 duration-300 shadow-lg text-sm tracking-wide"
              >
                Jelajahi Toko Lengkap
              </Link>
            </div>
          </div>
        </section>

        {/* ── Kontak ── */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-[#C9A84C] font-semibold text-sm tracking-wider uppercase">Hubungi Kami</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-8">Informasi Kontak</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: MapPin, label: 'Alamat', value: profile.location },
                { icon: Phone, label: 'Telepon', value: profile.contactPhone },
                { icon: Mail, label: 'Email', value: profile.contactEmail },
              ].map((c) => (
                <div key={c.label} className="bg-[#FAFAF8] rounded-2xl p-6 border border-gray-100">
                  <c.icon className="w-6 h-6 text-[#1B4332] mx-auto mb-3" />
                  <p className="text-sm font-semibold text-gray-900 mb-1">{c.label}</p>
                  <p className="text-xs text-gray-500">{c.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default HomePage;

export async function generateMetadata(): Promise<Metadata> {
  let profile = MOCK_VILLAGE_PROFILE;
  try {
    const docSnap = await adminDb.collection('village_profile').doc('main-village').get();
    if (docSnap.exists) {
      profile = docSnap.data() as VillageProfile;
    }
  } catch (error) {
    console.error('Error fetching village profile for metadata:', error);
  }

  return {
    title: profile.villageName,
    description: profile.description?.slice(0, 160),
    openGraph: {
      title: profile.villageName,
      description: profile.description?.slice(0, 160),
      images: profile.imageUrl ? [{ url: profile.imageUrl }] : [],
    },
  };
}
