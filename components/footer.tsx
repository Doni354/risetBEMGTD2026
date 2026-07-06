import Link from 'next/link';
import { MapPin, Phone, Mail } from 'lucide-react';

/**
 * Footer publik - ditampilkan di semua halaman publik.
 * Berisi informasi kontak desa dan copyright.
 */
export default function Footer() {
  return (
    <footer className="bg-[#1B4332] text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">DK</span>
              </div>
              <span className="font-bold text-lg">Desa Kwanyar</span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              Portal resmi profil desa dan marketplace produk unggulan Desa Kwanyar, Kecamatan Kwanyar, Kabupaten Bangkalan, Madura.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-sm mb-4 text-[#C9A84C]">Navigasi</h3>
            <div className="space-y-2.5">
              <Link href="/" className="block text-sm text-white/60 hover:text-white transition">Beranda</Link>
              <Link href="/products" className="block text-sm text-white/60 hover:text-white transition">Produk Desa</Link>
              <Link href="/login" className="block text-sm text-white/60 hover:text-white transition">Admin Login</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-sm mb-4 text-[#C9A84C]">Kontak</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-white/40 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-white/60">Kec. Kwanyar, Kab. Bangkalan, Madura, Jawa Timur</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-white/40 flex-shrink-0" />
                <span className="text-sm text-white/60">+62 812-3456-7890</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-white/40 flex-shrink-0" />
                <span className="text-sm text-white/60">desa.kwanyar@bangkalankab.go.id</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 text-center text-xs text-white/40">
          © {new Date().getFullYear()} Desa Kwanyar · Riset BEM GTD 2026
        </div>
      </div>
    </footer>
  );
}
