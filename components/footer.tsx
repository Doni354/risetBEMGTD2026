import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Phone, Mail } from 'lucide-react';

/**
 * Footer publik - ditampilkan di semua halaman publik.
 * Berisi informasi kontak, navigasi, sosial media, dan copyright.
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#0D2B1D] text-white overflow-hidden">
      {/* Decorative top wave */}
      <div className="absolute top-0 left-0 right-0 overflow-hidden leading-none">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 60L60 50C120 40 240 20 360 15C480 10 600 20 720 25C840 30 960 30 1080 25C1200 20 1320 10 1380 5L1440 0V60H0Z" fill="#FAFAF8"/>
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-20 pb-10">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3 mb-5 group">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-lg border-2 border-white/10">
                <Image
                  src="/logo-dlemer.jpg"
                  alt="Logo Desa Dlemer"
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>
              <div>
                <span className="font-bold text-lg block text-white">Desa Dlemer</span>
                <span className="text-[11px] text-[#C9A84C] font-semibold tracking-widest uppercase block">Kwanyar · Bangkalan · Madura</span>
              </div>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed max-w-sm">
              Portal resmi profil desa dan marketplace produk unggulan Desa Dlemer, Kecamatan Kwanyar, Kabupaten Bangkalan, Madura — membangun desa lewat digitalisasi.
            </p>

            {/* Social Media */}
            <div className="flex gap-3 mt-6">
              <a
                href="https://instagram.com/desa_dlemer"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram Desa Dlemer"
                className="w-9 h-9 rounded-lg bg-white/8 hover:bg-[#C9A84C] flex items-center justify-center transition-all duration-200 hover:scale-110"
              >
                {/* Instagram icon */}
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://facebook.com/desa.dlemer"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook Desa Dlemer"
                className="w-9 h-9 rounded-lg bg-white/8 hover:bg-[#C9A84C] flex items-center justify-center transition-all duration-200 hover:scale-110"
              >
                {/* Facebook icon */}
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp Desa Dlemer"
                className="w-9 h-9 rounded-lg bg-white/8 hover:bg-[#C9A84C] flex items-center justify-center transition-all duration-200 hover:scale-110"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-sm mb-5 text-[#C9A84C] tracking-wider uppercase">Navigasi</h3>
            <div className="space-y-3">
              <Link href="/" className="block text-sm text-white/50 hover:text-white hover:translate-x-1 transition-all duration-200">Beranda</Link>
              <Link href="/events" className="block text-sm text-white/50 hover:text-white hover:translate-x-1 transition-all duration-200">Acara & Kegiatan</Link>
              <Link href="/products" className="block text-sm text-white/50 hover:text-white hover:translate-x-1 transition-all duration-200">Produk Desa</Link>
              <Link href="/login" className="block text-sm text-white/50 hover:text-white hover:translate-x-1 transition-all duration-200">Admin Login</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-sm mb-5 text-[#C9A84C] tracking-wider uppercase">Kontak</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C9A84C] mt-0.5 flex-shrink-0" />
                <span className="text-sm text-white/50 leading-relaxed">Desa Dlemer, Kec. Kwanyar, Kab. Bangkalan, Madura, Jawa Timur</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C9A84C] flex-shrink-0" />
                <span className="text-sm text-white/50">+62 812-3456-7890</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C9A84C] flex-shrink-0" />
                <span className="text-sm text-white/50 break-all">desa.dlemer@bangkalankab.go.id</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/8 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/30 text-center md:text-left">
            © {currentYear} Desa Dlemer, Kwanyar, Bangkalan · Riset BEM GTD 2026
          </p>
          <p className="text-xs text-white/20 text-center">
            Portal Resmi Pemerintahan Desa Dlemer
          </p>
        </div>
      </div>
    </footer>
  );
}
