import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import {
  Download, Smartphone, ShoppingBag, Calendar, CheckCircle2,
  ShieldCheck, HelpCircle, ArrowRight, Sparkles, ExternalLink,
  ChevronDown
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Unduh Aplikasi Mobile Desa Dlemer — Aplikasi Warga',
  description:
    'Unduh aplikasi resmi Desa Dlemer untuk Android. Lakukan pengajuan produk UMKM lokal, pendaftaran acara warga, dan nikmati kemudahan digitalisasi desa langsung dari smartphone Anda.',
};

const APK_DOWNLOAD_URL =
  'https://github.com/RNames/BemAndroid/releases/latest/download/Desa-Dlemer.apk';

export default function AppDownloadPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* ── Hero Section ── */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#1B4332] via-[#143427] to-[#0D2B1D] text-white pt-20 pb-28 px-4">
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]" />
          
          {/* Radial Glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#C9A84C]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-5xl mx-auto relative z-10 text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/15 text-xs font-semibold text-[#C9A84C] mb-6 shadow-inner">
              <Sparkles className="w-4 h-4 text-[#C9A84C]" />
              <span>Aplikasi Resmi Android Warga Desa Dlemer</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight text-white max-w-3xl mx-auto">
              Semua Layanan Warga,<br />
              <span className="text-[#C9A84C]">Kini dalam Satu Genggaman</span>
            </h1>

            <p className="text-white/70 text-base md:text-lg mt-6 max-w-2xl mx-auto leading-relaxed">
              Pengajuan produk UMKM desa ke marketplace resmi dan pendaftaran kegiatan warga kini dapat dilakukan secara cepat dan mudah via aplikasi mobile resmi <b>Desa Dlemer</b>.
            </p>

            {/* Primary Download CTAs */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={APK_DOWNLOAD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-[#C9A84C] text-[#1B4332] font-extrabold text-base hover:bg-[#FFE599] transition-all duration-300 hover:scale-105 shadow-xl shadow-[#C9A84C]/20 group"
              >
                <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                <span>Unduh Desa-Dlemer.apk</span>
              </a>

              <a
                href="#panduan"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm border border-white/15 backdrop-blur transition"
              >
                <ChevronDown className="w-4 h-4" />
                <span>Lihat Panduan Instalasi</span>
              </a>
            </div>

            <div className="flex items-center justify-center gap-4 text-xs text-white/50 mt-5">
              <span>Versi Terbaru (Rilis Resmi)</span>
              <span>•</span>
              <span>Format: Android APK</span>
              <span>•</span>
              <span>Gratis untuk Seluruh Warga</span>
            </div>
          </div>
        </section>

        {/* ── Feature Highlights ── */}
        <section className="py-20 px-4 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-[#C9A84C] uppercase tracking-widest bg-[#C9A84C]/10 px-3.5 py-1.5 rounded-full">
              Fitur Utama Aplikasi
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mt-3">
              Mengapa Warga Perlu Mengunduh Aplikasi?
            </h2>
            <p className="text-gray-500 text-sm md:text-base mt-2 max-w-xl mx-auto">
              Aplikasi ini dikembangkan untuk memudahkan warga terhubung dengan pemerintahan desa dan memperluas pemasaran produk UMKM lokal.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1: Pengajuan Produk */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-6">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Pengajuan Produk UMKM</h3>
              <p className="text-gray-500 text-sm leading-relaxed flex-1">
                Punya usaha kerupuk, petis, batik, atau hasil laut? Foto produk langsung lewat HP, isi detail dan harga, lalu ajukan ke etalase desa tanpa perantara.
              </p>
              <div className="mt-6 pt-4 border-t border-gray-100 text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Langsung Tayang di Website Resmi
              </div>
            </div>

            {/* Card 2: Pengajuan Acara */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
              <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center mb-6">
                <Calendar className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Pendaftaran Acara Warga</h3>
              <p className="text-gray-500 text-sm leading-relaxed flex-1">
                Adakan pengajian akbar, turnamen olahraga antar RT, perayaan hari besar, atau kerja bakti? Daftarkan kegiatannya agar masuk agenda resmi desa.
              </p>
              <div className="mt-6 pt-4 border-t border-gray-100 text-xs font-semibold text-purple-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-purple-600" />
                Terhubung ke Kalender Desa
              </div>
            </div>

            {/* Card 3: Keamanan & Akun Google */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center mb-6">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Login Cepat dengan Google</h3>
              <p className="text-gray-500 text-sm leading-relaxed flex-1">
                Tidak perlu menghafal banyak password. Warga cukup masuk sekali menggunakan akun Google yang sudah terpasang di smartphone Android Anda.
              </p>
              <div className="mt-6 pt-4 border-t border-gray-100 text-xs font-semibold text-blue-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                Aman, Terenkripsi, & Praktis
              </div>
            </div>
          </div>
        </section>

        {/* ── Panduan Instalasi (Step by Step) ── */}
        <section id="panduan" className="py-20 px-4 bg-gray-100/60 scroll-mt-20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-14">
              <span className="text-xs font-bold text-[#1B4332] uppercase tracking-widest bg-[#1B4332]/10 px-3.5 py-1.5 rounded-full">
                Langkah Mudah
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mt-3">
                Cara Memasang Aplikasi di HP Android
              </h2>
              <p className="text-gray-500 text-sm mt-2 max-w-lg mx-auto">
                Ikuti langkah sederhana berikut untuk mengunduh dan menginstal file APK Desa Dlemer:
              </p>
            </div>

            <div className="space-y-4">
              {/* Step 1 */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200/70 shadow-sm flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#1B4332] text-white flex items-center justify-center font-bold text-base flex-shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-base">Unduh File APK</h4>
                  <p className="text-gray-600 text-sm mt-1">
                    Klik tombol <b>&quot;Unduh Desa-Dlemer.apk&quot;</b> di halaman ini. Tunggu hingga proses unduhan selesai melalui browser HP Anda (Google Chrome).
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200/70 shadow-sm flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#1B4332] text-white flex items-center justify-center font-bold text-base flex-shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-base">Buka File yang Selesai Diunduh</h4>
                  <p className="text-gray-600 text-sm mt-1">
                    Buka notifikasi di bilah atas layar HP Anda, atau buka aplikasi <b>File Saya / Pengelola File</b> lalu masuk ke folder <b>Download</b> dan klik file <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-semibold">Desa-Dlemer.apk</code>.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200/70 shadow-sm flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#1B4332] text-white flex items-center justify-center font-bold text-base flex-shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-base">Izinkan Pemasangan dari Sumber Ini (Jika Muncul)</h4>
                  <p className="text-gray-600 text-sm mt-1">
                    Jika Android memunculkan peringatan <i>&quot;Demi keamanan, ponsel Anda tidak diizinkan memasang aplikasi dari sumber ini&quot;</i>, pilih <b>Setelan / Pengaturan</b> lalu aktifkan opsi <b>&quot;Izinkan dari sumber ini&quot;</b>.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200/70 shadow-sm flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#1B4332] text-white flex items-center justify-center font-bold text-base flex-shrink-0">
                  4
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-base">Tekan &quot;Install&quot; dan Buka Aplikasi</h4>
                  <p className="text-gray-600 text-sm mt-1">
                    Tekan tombol <b>Install / Pasang</b>. Setelah selesai, buka aplikasi <b>Desa Dlemer</b> dan masuk menggunakan akun Google Anda. Anda siap mengajukan produk dan acara!
                  </p>
                </div>
              </div>
            </div>

            {/* Direct CTA under guide */}
            <div className="text-center mt-10">
              <a
                href={APK_DOWNLOAD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#1B4332] text-white font-bold text-sm hover:bg-[#2D6A4F] transition shadow-md"
              >
                <Download className="w-4 h-4" /> Unduh Sekarang (Desa-Dlemer.apk)
              </a>
            </div>
          </div>
        </section>

        {/* ── FAQ Section ── */}
        <section className="py-20 px-4 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="font-display text-2xl md:text-3xl font-bold text-gray-900">
              Pertanyaan yang Sering Diajukan (FAQ)
            </h3>
            <p className="text-gray-500 text-sm mt-1">Informasi penting seputar aplikasi mobile warga</p>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#C9A84C]" /> Apakah aplikasi Desa Dlemer ini aman?
              </h4>
              <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                Ya, 100% aman. Aplikasi ini adalah aplikasi resmi yang dikembangkan dalam rangka riset digitalisasi BEM GTD 2026 bersama Pemerintah Desa Dlemer, Kwanyar, Bangkalan. File APK diambil langsung dari repositori resmi di GitHub.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#C9A84C]" /> Mengapa pengajuan produk harus lewat aplikasi, bukan website?
              </h4>
              <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                Melalui aplikasi di smartphone, warga dapat langsung memotret produk dengan kamera HP, mengisi nomor WhatsApp kontak dagang, dan memantau status persetujuan dari mana saja secara praktis.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#C9A84C]" /> Apakah ada biaya untuk mendaftarkan produk atau mengunduh aplikasi?
              </h4>
              <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                Tidak ada biaya sama sekali (gratis). Seluruh warga Desa Dlemer berhak mempromosikan produk lokalnya demi kemajuan ekonomi desa.
              </p>
            </div>
          </div>
        </section>

        {/* ── Bottom Callout Banner ── */}
        <section className="bg-gradient-to-r from-[#1B4332] to-[#0D2B1D] text-white py-16 px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="font-display text-3xl md:text-4xl font-bold">
              Siap Memajukan UMKM & Kegiatan Desa Anda?
            </h2>
            <p className="text-white/70 text-sm md:text-base max-w-xl mx-auto">
              Unduh aplikasinya sekarang dan jadilah bagian dari transformasi digital Desa Dlemer, Kwanyar, Bangkalan.
            </p>
            <div>
              <a
                href={APK_DOWNLOAD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-[#C9A84C] text-[#1B4332] font-extrabold text-base hover:bg-[#FFE599] transition hover:scale-105 shadow-xl"
              >
                <Download className="w-5 h-5" />
                <span>Unduh Aplikasi Warga (Desa-Dlemer.apk)</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
