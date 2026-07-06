import { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, Phone, Mail, Users, Home, Ruler } from 'lucide-react';
import { getDocument } from '@/lib/firebase/utils';
import { VillageProfile } from '@/lib/types';
import { MOCK_VILLAGE_PROFILE, MOCK_PRODUCTS } from '@/lib/firebase/mock-data';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

import { adminDb } from '@/lib/firebase/admin';

export const revalidate = 3600;

/**
 * Homepage Desa Kwanyar
 * Sections: Hero, Tentang, Statistik, Potensi Unggulan, Produk Preview
 * Menggunakan ISR (revalidate 1 jam) untuk efisiensi Firestore reads.
 */
async function HomePage() {
  let profile = MOCK_VILLAGE_PROFILE;
  try {
    const docSnap = await adminDb.collection('village_profile').doc('main-village').get();
    if (docSnap.exists) {
      profile = docSnap.data() as VillageProfile;
    }
  } catch (error) {
    console.error('Error fetching village profile on server:', error);
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
          <section className="py-20 px-4 bg-white">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <span className="text-[#C9A84C] font-semibold text-sm tracking-wider uppercase">Potensi Unggulan</span>
                <h2 className="text-3xl font-bold text-gray-900 mt-2">Kekayaan Desa Kami</h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {profile.highlights.map((h, i) => (
                  <div
                    key={i}
                    className="group bg-gradient-to-b from-[#FAFAF8] to-white rounded-2xl p-6 border border-gray-100 hover:border-[#1B4332]/20 hover:shadow-lg transition-all"
                  >
                    <span className="text-4xl block mb-4">{h.icon}</span>
                    <h3 className="font-bold text-gray-900 mb-2">{h.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{h.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Produk Desa Preview ── */}
        <section className="py-20 px-4 bg-[#1B4332]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-[#C9A84C] font-semibold text-sm tracking-wider uppercase">Marketplace</span>
              <h2 className="text-3xl font-bold text-white mt-2">Produk Unggulan Desa</h2>
              <p className="text-white/60 mt-2 text-sm">Dukung ekonomi lokal dengan membeli produk langsung dari warga desa</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(MOCK_PRODUCTS.slice(0, 3)).map((product) => (
                <div key={product.id} className="bg-white/10 backdrop-blur rounded-2xl overflow-hidden border border-white/10 hover:border-white/30 transition group">
                  {product.imageUrl && (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="font-bold text-white mb-1">{product.name}</h3>
                    <p className="text-white/50 text-sm line-clamp-2 mb-3">{product.description}</p>
                    <p className="text-[#C9A84C] font-bold text-lg">
                      Rp {product.price.toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-[#C9A84C] text-white font-semibold hover:bg-[#b8943e] transition text-sm"
              >
                Lihat Semua Produk →
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
