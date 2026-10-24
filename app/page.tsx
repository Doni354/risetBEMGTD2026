import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Phone, Mail, Users, Home, Ruler, ArrowRight, Calendar, ExternalLink, ShoppingBag } from 'lucide-react';
import { VillageEvent, Product, getItemImages } from '@/lib/types';
import { MOCK_VILLAGE_PROFILE } from '@/lib/firebase/mock-data';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { adminDb } from '@/lib/firebase/admin';
import { siteUrl } from '@/lib/utils';

export const revalidate = 3600;

/**
 * Homepage Desa Dlemer
 * Sections: Hero, Tentang, Statistik, Potensi Unggulan, Acara, Produk Preview, Kontak
 * Menggunakan ISR (revalidate 1 jam) untuk efisiensi Firestore reads.
 */
async function HomePage() {
  let profile = MOCK_VILLAGE_PROFILE;
  let events: VillageEvent[] = [];
  let products: Product[] = [];

  try {
    const docSnap = await adminDb.collection('village_profile').doc('main-village').get();
    if (docSnap.exists) {
      profile = docSnap.data() as typeof MOCK_VILLAGE_PROFILE;
    }

    const eventsSnap = await adminDb.collection('events')
      .where('approved', '==', true)
      .get();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let fetchedEvents = eventsSnap.docs.map((doc: any) => doc.data() as VillageEvent);
    fetchedEvents.sort((a: VillageEvent, b: VillageEvent) => b.date - a.date);
    events = fetchedEvents.slice(0, 3);

    const productsSnap = await adminDb.collection('products')
      .where('approved', '==', true)
      .get();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let fetchedProducts = productsSnap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }) as Product);
    fetchedProducts.sort((a: Product, b: Product) => (b.createdAt || 0) - (a.createdAt || 0));
    products = fetchedProducts.slice(0, 3);
  } catch (error) {
    console.error('Error fetching data on server:', error);
  }

  const descParagraphs = profile.description?.split('\n\n') || [];

  return (
    <>
      <Navbar />
      <main>

        {/* ── Hero Section ── */}
        <section className="relative h-[92vh] min-h-[560px] flex items-end overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src={profile.imageUrl || '/dlemer_hero.jpg'}
              alt={`Pemandangan ${profile.villageName}`}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          </div>

          {/* Multi-layer gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />

          {/* Decorative orb */}
          <div className="absolute top-1/4 right-10 w-96 h-96 bg-[#C9A84C]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Content */}
          <div className="relative z-10 max-w-6xl mx-auto px-4 pb-16 w-full">
            {/* Location badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6 animate-fade-in">
              <MapPin className="w-3.5 h-3.5 text-[#C9A84C]" />
              <span className="text-white/90 text-xs font-medium tracking-wide">{profile.location}</span>
            </div>

            {/* Village name */}
            <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-4 leading-tight tracking-tight animate-fade-in-up delay-100">
              {profile.villageName}
            </h1>

            {/* Tagline */}
            <p className="text-white/75 text-lg md:text-xl max-w-2xl leading-relaxed mb-8 animate-fade-in-up delay-200">
              {descParagraphs[0]?.slice(0, 180)}...
            </p>

            {/* Stats pills */}
            <div className="flex flex-wrap gap-3 mb-8 animate-fade-in-up delay-300">
              {profile.demographics && (
                <>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white/90 text-sm">
                    <Users className="w-3.5 h-3.5 text-[#C9A84C]" />
                    <span className="font-medium">{profile.demographics.population?.toLocaleString('id-ID')} Jiwa</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white/90 text-sm">
                    <Home className="w-3.5 h-3.5 text-[#C9A84C]" />
                    <span className="font-medium">{profile.demographics.households?.toLocaleString('id-ID')} KK</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white/90 text-sm">
                    <Ruler className="w-3.5 h-3.5 text-[#C9A84C]" />
                    <span className="font-medium">{profile.demographics.area}</span>
                  </div>
                </>
              )}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3 animate-fade-in-up delay-400">
              <Link
                href="/products"
                className="group inline-flex items-center gap-2 px-7 py-3.5 bg-[#C9A84C] text-[#1B4332] rounded-full font-bold hover:bg-[#FFE599] transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#C9A84C]/30 text-sm"
              >
                Jelajahi Produk Desa
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#tentang"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/10 text-white backdrop-blur rounded-full font-semibold hover:bg-white/20 transition-all duration-300 text-sm border border-white/20"
              >
                Tentang Kami
              </a>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40 animate-float">
            <span className="text-xs tracking-widest uppercase">Scroll</span>
            <div className="w-px h-10 bg-gradient-to-b from-white/40 to-transparent" />
          </div>
        </section>

        {/* ── Tentang Desa ── */}
        <section id="tentang" className="py-24 px-4 bg-white relative overflow-hidden">
          {/* Background decorative */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#1B4332]/3 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#C9A84C]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />

          <div className="max-w-6xl mx-auto relative z-10">
            <div className="text-center mb-14">
              <span className="inline-flex items-center gap-2 text-[#C9A84C] font-bold text-xs tracking-widest uppercase bg-[#C9A84C]/10 px-4 py-2 rounded-full">
                <span className="w-1.5 h-1.5 bg-[#C9A84C] rounded-full" />
                Tentang Desa
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mt-4 leading-tight">
                Mengenal <span className="gradient-text">{profile.villageName}</span>
              </h2>
              <p className="text-gray-500 mt-4 max-w-xl mx-auto leading-relaxed">
                Sebuah desa yang kaya budaya, kearifan lokal, dan potensi yang terus berkembang di jantung Madura.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-14 items-start">
              {/* Description */}
              <div className="space-y-5">
                {descParagraphs.map((p, i) => (
                  <p key={i} className="text-gray-600 leading-relaxed text-base">
                    {p}
                  </p>
                ))}

                {/* Quick info */}
                <div className="grid grid-cols-2 gap-4 mt-8">
                  {[
                    { label: 'Kecamatan', value: 'Kwanyar' },
                    { label: 'Kabupaten', value: 'Bangkalan' },
                    { label: 'Provinsi', value: 'Jawa Timur' },
                    { label: 'Pulau', value: 'Madura' },
                  ].map((item) => (
                    <div key={item.label} className="bg-[#FAFAF8] rounded-xl p-4 border border-gray-100">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-1">{item.label}</p>
                      <p className="text-gray-900 font-bold text-sm">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vision Mission */}
              {profile.visionMission && (
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-br from-[#1B4332]/10 to-[#C9A84C]/10 rounded-3xl blur-sm" />
                  <div className="relative bg-white rounded-2xl p-8 border border-[#1B4332]/10 shadow-sm">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-[#1B4332] rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-lg">🌿</span>
                      </div>
                      <h3 className="font-display font-bold text-[#1B4332] text-xl">Visi & Misi</h3>
                    </div>

                    <div className="space-y-3">
                      {profile.visionMission.split('\n').map((line, i) => {
                        const isVisi = line.startsWith('Visi:');
                        const isMisi = line.startsWith('Misi:');
                        const isNumbered = /^\d+\./.test(line.trim());
                        if (!line.trim()) return null;
                        return (
                          <p
                            key={i}
                            className={`text-sm leading-relaxed ${
                              isVisi || isMisi
                                ? 'font-bold text-[#1B4332] text-base'
                                : isNumbered
                                ? 'text-gray-600 pl-4 border-l-2 border-[#C9A84C]/30'
                                : 'text-gray-600'
                            }`}
                          >
                            {line}
                          </p>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── Statistik Kependudukan ── */}
        {profile.demographics && (
          <section className="py-20 px-4 bg-[#1B4332] relative overflow-hidden">
            {/* Background decoratives */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9A84C]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-5xl mx-auto relative z-10">
              <div className="text-center mb-12">
                <span className="inline-flex items-center gap-2 text-[#C9A84C] font-bold text-xs tracking-widest uppercase bg-[#C9A84C]/15 px-4 py-2 rounded-full">
                  <span className="w-1.5 h-1.5 bg-[#C9A84C] rounded-full" />
                  Data Resmi
                </span>
                <h2 className="font-display text-4xl font-bold text-white mt-4">Statistik Kependudukan</h2>
                <p className="text-white/50 mt-3 text-sm">Data terkini profil kependudukan Desa Dlemer</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    icon: Users,
                    label: 'Total Penduduk',
                    value: profile.demographics.population?.toLocaleString('id-ID') || '-',
                    suffix: 'Jiwa',
                    description: 'Warga terdaftar',
                    color: 'from-blue-400/20 to-blue-600/10',
                  },
                  {
                    icon: Home,
                    label: 'Kepala Keluarga',
                    value: profile.demographics.households?.toLocaleString('id-ID') || '-',
                    suffix: 'KK',
                    description: 'Unit keluarga',
                    color: 'from-emerald-400/20 to-emerald-600/10',
                  },
                  {
                    icon: Ruler,
                    label: 'Luas Wilayah',
                    value: profile.demographics.area || '-',
                    suffix: '',
                    description: 'Total area desa',
                    color: 'from-amber-400/20 to-amber-600/10',
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="group relative bg-white/8 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:bg-white/15 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 text-center overflow-hidden"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl`} />
                    <div className="relative z-10">
                      <div className="w-14 h-14 bg-[#C9A84C]/15 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300">
                        <stat.icon className="w-7 h-7 text-[#C9A84C]" />
                      </div>
                      <p className="text-4xl font-extrabold text-white mb-1">
                        {stat.value}
                      </p>
                      {stat.suffix && (
                        <p className="text-[#C9A84C] font-semibold text-sm mb-2">{stat.suffix}</p>
                      )}
                      <p className="text-white font-semibold text-base mb-1">{stat.label}</p>
                      <p className="text-white/40 text-xs">{stat.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Potensi Unggulan ── */}
        {profile.highlights && profile.highlights.length > 0 && (
          <section className="py-24 px-4 bg-[#FAFAF8] relative overflow-hidden">
            <div className="absolute inset-0 batik-pattern" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1B433208_1px,transparent_1px),linear-gradient(to_bottom,#1B433208_1px,transparent_1px)] bg-[size:28px_28px]" />

            <div className="max-w-6xl mx-auto relative z-10">
              <div className="text-center mb-16">
                <span className="inline-flex items-center gap-2 text-[#C9A84C] font-bold text-xs tracking-widest uppercase bg-[#C9A84C]/10 px-4 py-2 rounded-full">
                  <span className="w-1.5 h-1.5 bg-[#C9A84C] rounded-full" />
                  Potensi Unggulan
                </span>
                <h2 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mt-4">
                  Kekayaan <span className="gradient-text">Desa Kami</span>
                </h2>
                <p className="text-gray-500 mt-4 max-w-lg mx-auto leading-relaxed">
                  Berbagai sektor unggulan yang menjadi fondasi perekonomian dan kebudayaan Desa Dlemer.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {profile.highlights.map((h, i) => (
                  <div
                    key={i}
                    className="group bg-white rounded-3xl p-7 shadow-sm hover:shadow-2xl border border-gray-100 hover:border-[#1B4332]/15 transition-all duration-500 transform hover:-translate-y-2 relative overflow-hidden"
                  >
                    {/* Corner decoration */}
                    <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-[#1B4332]/5 to-transparent rounded-bl-3xl -z-10 group-hover:from-[#C9A84C]/10 transition-all duration-500" />
                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-[#C9A84C]/5 to-transparent rounded-tr-2xl -z-10" />

                    {/* Icon */}
                    <div className="w-14 h-14 bg-gradient-to-br from-[#1B4332]/8 to-[#C9A84C]/8 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                      <span className="text-3xl">{h.icon}</span>
                    </div>

                    {/* Number badge */}
                    <div className="absolute top-6 right-6 w-7 h-7 rounded-full bg-[#FAFAF8] border border-gray-100 flex items-center justify-center">
                      <span className="text-[10px] text-gray-400 font-bold">0{i + 1}</span>
                    </div>

                    <h3 className="font-bold text-gray-900 mb-2 text-lg group-hover:text-[#1B4332] transition-colors">{h.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{h.description}</p>

                    {/* Bottom accent */}
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#C9A84C]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Acara Desa ── */}
        <section className="py-24 px-4 bg-white relative overflow-hidden">
          <div className="absolute right-0 top-0 w-[600px] h-[600px] bg-[#FAFAF8] rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none" />

          <div className="max-w-6xl mx-auto relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
              <div>
                <span className="inline-flex items-center gap-2 text-[#C9A84C] font-bold text-xs tracking-widest uppercase bg-[#C9A84C]/10 px-4 py-2 rounded-full">
                  <Calendar className="w-3 h-3" />
                  Agenda
                </span>
                <h2 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mt-4">
                  Acara & Kegiatan<br />
                  <span className="gradient-text">Desa</span>
                </h2>
                <p className="text-gray-500 mt-4 text-base max-w-md leading-relaxed">
                  Ikuti berbagai kegiatan seru dan bermanfaat di lingkungan desa kami.
                </p>
              </div>
              <Link
                href="/events"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border-2 border-[#1B4332]/15 text-[#1B4332] font-semibold hover:bg-[#1B4332] hover:text-white hover:border-[#1B4332] transition-all duration-300 text-sm group whitespace-nowrap shadow-sm"
              >
                Lihat Semua Acara
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.length > 0 ? events.map((event) => {
                const eventImages = getItemImages(event);
                const cover = eventImages[0] || event.imageUrl;
                return (
                  <Link
                    key={event.id}
                    href={`/events/${event.id}`}
                    className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl border border-gray-100 hover:border-[#1B4332]/15 transition-all duration-500 group block hover:-translate-y-1"
                  >
                    <div className="relative h-52 overflow-hidden bg-gradient-to-br from-[#1B4332]/10 to-[#C9A84C]/10">
                      {cover ? (
                        <Image
                          src={cover}
                          alt={event.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-5xl opacity-30">📅</span>
                        </div>
                      )}
                      {/* Date badge */}
                      <div className="absolute top-4 left-4 bg-white text-[#1B4332] text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                        {new Date(event.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                      {/* Category & Photo count badge */}
                      <div className="absolute top-4 right-4 flex items-center gap-1.5">
                        {eventImages.length > 1 && (
                          <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                            📷 {eventImages.length}
                          </span>
                        )}
                        <span className="bg-[#1B4332] text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                          {event.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-[#1B4332] transition-colors leading-snug">
                        {event.title}
                      </h3>
                      <p className="text-gray-500 text-sm line-clamp-2 mb-4 leading-relaxed">{event.description}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">{event.location}</span>
                      </div>
                    </div>
                  </Link>
                );
              }) : (
                <div className="col-span-full">
                  <div className="text-center py-16 bg-[#FAFAF8] rounded-3xl border-2 border-dashed border-gray-200">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-8 h-8 text-gray-300" />
                    </div>
                    <p className="text-gray-400 font-medium">Belum ada kegiatan/acara dalam waktu dekat.</p>
                    <p className="text-gray-300 text-sm mt-2">Pantau terus untuk informasi terbaru!</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── Produk Desa Preview ── */}
        <section className="py-24 px-4 bg-[#0D2B1D] relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#C9A84C]/5 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#1B4332]/50 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]" />

          <div className="max-w-6xl mx-auto relative z-10">
            <div className="text-center mb-16">
              <span className="inline-flex items-center gap-2 text-[#C9A84C] font-bold text-xs tracking-widest uppercase bg-[#C9A84C]/15 px-4 py-2 rounded-full">
                <span className="w-1.5 h-1.5 bg-[#C9A84C] rounded-full animate-pulse" />
                Marketplace
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-white mt-4">
                Produk Unggulan<br />
                <span className="text-[#C9A84C]">Desa Dlemer</span>
              </h2>
              <p className="text-white/50 mt-4 text-base max-w-2xl mx-auto leading-relaxed">
                Dukung ekonomi lokal dengan membeli produk karya warga kami. Kualitas terbaik langsung dari tangan pengrajin.
              </p>
            </div>

            {products.length === 0 ? (
              <div className="bg-white/5 border border-white/10 rounded-3xl p-10 md:p-14 text-center max-w-xl mx-auto backdrop-blur-md">
                <div className="w-16 h-16 rounded-2xl bg-[#C9A84C]/15 border border-[#C9A84C]/30 flex items-center justify-center mx-auto mb-4 text-[#C9A84C]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white">Katalog Produk UMKM Segera Hadir</h3>
                <p className="text-white/60 text-sm mt-2 leading-relaxed">
                  Warga Desa Dlemer yang memiliki produk lokal (kuliner, kerajinan, batik, dll.) dapat mengajukan produk untuk dipromosikan di sini melalui aplikasi resmi.
                </p>
                <div className="mt-8 flex flex-wrap gap-3 justify-center">
                  <Link
                    href="/app"
                    className="px-6 py-3 rounded-full bg-[#C9A84C] text-[#1B4332] font-bold text-sm hover:bg-[#FFE599] transition hover:scale-105"
                  >
                    Unduh Aplikasi Warga
                  </Link>
                  <Link
                    href="/products"
                    className="px-6 py-3 rounded-full bg-white/10 text-white font-semibold text-sm hover:bg-white/20 transition border border-white/10"
                  >
                    Katalog Lengkap
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => {
                  const productImages = getItemImages(product);
                  const cover = productImages[0] || product.imageUrl;
                  return (
                    <Link
                      key={product.id}
                      href={`/products/${product.id}`}
                      className="group bg-white/5 backdrop-blur-md rounded-3xl overflow-hidden border border-white/8 hover:border-[#C9A84C]/40 hover:bg-white/10 transition-all duration-500 shadow-xl block hover:-translate-y-1"
                    >
                      {cover ? (
                        <div className="h-52 overflow-hidden relative">
                          <Image
                            src={cover}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                          <div className="absolute bottom-3 left-3 text-[10px] font-bold text-white bg-black/40 backdrop-blur px-2.5 py-1 rounded-full">
                            {product.category}
                          </div>
                          {productImages.length > 1 && (
                            <div className="absolute bottom-3 right-3 text-[10px] font-semibold text-white bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                              📷 {productImages.length} Foto
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="h-52 bg-white/10 flex items-center justify-center text-4xl">
                          🛍️
                        </div>
                      )}
                      <div className="p-6">
                        <h3 className="font-bold text-white text-base mb-2 group-hover:text-[#C9A84C] transition-colors">{product.name}</h3>
                        <p className="text-white/40 text-sm line-clamp-2 mb-5 leading-relaxed">{product.description}</p>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-[10px] text-white/30 mb-0.5">Mulai dari</p>
                            <p className="text-[#C9A84C] font-extrabold text-xl">
                              Rp {product.price.toLocaleString('id-ID')}
                            </p>
                          </div>
                          <div className="w-10 h-10 rounded-full bg-white/8 flex items-center justify-center text-white group-hover:bg-[#C9A84C] group-hover:text-[#1B4332] transition-all duration-300 group-hover:scale-110">
                            <ExternalLink className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            <div className="text-center mt-14">
              <Link
                href="/products"
                className="group inline-flex items-center gap-3 px-10 py-4 rounded-full bg-[#C9A84C] text-[#1B4332] font-extrabold hover:bg-[#FFE599] transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#C9A84C]/30 text-base tracking-wide"
              >
                Jelajahi Toko Lengkap
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── Kontak ── */}
        <section className="py-24 px-4 bg-[#FAFAF8] relative overflow-hidden">
          <div className="absolute inset-0 batik-pattern" />

          <div className="max-w-5xl mx-auto relative z-10">
            <div className="text-center mb-14">
              <span className="inline-flex items-center gap-2 text-[#C9A84C] font-bold text-xs tracking-widest uppercase bg-[#C9A84C]/10 px-4 py-2 rounded-full">
                <span className="w-1.5 h-1.5 bg-[#C9A84C] rounded-full" />
                Hubungi Kami
              </span>
              <h2 className="font-display text-4xl font-bold text-gray-900 mt-4">Informasi Kontak</h2>
              <p className="text-gray-500 mt-3 max-w-md mx-auto leading-relaxed">
                Punya pertanyaan atau ingin berkolaborasi? Jangan ragu untuk menghubungi kami.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-10">
              {[
                {
                  icon: MapPin,
                  label: 'Alamat',
                  value: profile.location,
                  color: 'bg-blue-50 text-blue-600',
                  iconBg: 'bg-blue-100',
                },
                {
                  icon: Phone,
                  label: 'Telepon',
                  value: profile.contactPhone,
                  color: 'bg-emerald-50 text-emerald-600',
                  iconBg: 'bg-emerald-100',
                },
                {
                  icon: Mail,
                  label: 'Email',
                  value: profile.contactEmail,
                  color: 'bg-amber-50 text-amber-600',
                  iconBg: 'bg-amber-100',
                },
              ].map((c) => (
                <div
                  key={c.label}
                  className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center group"
                >
                  <div className={`w-14 h-14 ${c.iconBg} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <c.icon className={`w-6 h-6 ${c.color.split(' ')[1]}`} />
                  </div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{c.label}</p>
                  <p className="text-gray-800 font-medium text-sm leading-relaxed">{c.value}</p>
                </div>
              ))}
            </div>

            {/* WhatsApp CTA */}
            <div className="bg-[#1B4332] rounded-3xl p-8 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:20px_20px]" />
              <div className="relative z-10">
                <div className="w-14 h-14 bg-[#C9A84C]/15 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💬</span>
                </div>
                <h3 className="font-display font-bold text-white text-2xl mb-2">Chat Langsung via WhatsApp</h3>
                <p className="text-white/50 text-sm mb-6">Respons cepat dalam jam kerja. Kami siap membantu Anda!</p>
                <a
                  href={profile.socialMedia?.whatsapp || 'https://wa.me/6281234567890'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-3.5 bg-[#C9A84C] text-[#1B4332] rounded-full font-bold hover:bg-[#FFE599] transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#C9A84C]/30"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  Hubungi via WhatsApp
                </a>
              </div>
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
      profile = docSnap.data() as typeof MOCK_VILLAGE_PROFILE;
    }
  } catch (error) {
    console.error('Error fetching village profile for metadata:', error);
  }

  const title = `${profile.villageName} — Portal Resmi & Marketplace`;
  const description = profile.description?.slice(0, 160) || 'Portal resmi Desa Dlemer, Kecamatan Kwanyar, Kabupaten Bangkalan, Madura.';

  return {
    title,
    description,
    alternates: {
      canonical: siteUrl,
    },
    openGraph: {
      title,
      description,
      url: siteUrl,
      siteName: profile.villageName,
      locale: 'id_ID',
      type: 'website',
      images: profile.imageUrl
        ? [{ url: profile.imageUrl, width: 1200, height: 630, alt: `Pemandangan ${profile.villageName}` }]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: profile.imageUrl ? [profile.imageUrl] : [],
    },
    keywords: [
      profile.villageName,
      'Kwanyar',
      'Bangkalan',
      'Madura',
      'profil desa',
      'marketplace produk desa',
      'wisata Bangkalan',
    ],
  };
}
