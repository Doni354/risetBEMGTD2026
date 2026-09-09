'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X, ChevronRight } from 'lucide-react';

/**
 * Navbar publik - ditampilkan di semua halaman publik.
 * Sticky, responsive, dengan scroll effect dan active link indicator.
 */
export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Beranda' },
    { href: '/events', label: 'Acara' },
    { href: '/products', label: 'Produk Desa' },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-xl shadow-lg shadow-black/5 border-b border-gray-100'
          : 'bg-white/80 backdrop-blur-md border-b border-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
            <Image
              src="/logo-dlemer.jpg"
              alt="Logo Desa Dlemer"
              fill
              className="object-cover"
              sizes="40px"
            />
          </div>
          <div className="leading-tight">
            <span className="font-bold text-gray-900 text-sm block tracking-tight">Desa Dlemer</span>
            <span className="text-[10px] text-[#C9A84C] font-semibold block tracking-wider uppercase">Kwanyar · Bangkalan</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'text-[#1B4332] bg-[#1B4332]/8'
                    : 'text-gray-500 hover:text-[#1B4332] hover:bg-[#1B4332]/5'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#C9A84C] rounded-full" />
                )}
              </Link>
            );
          })}

          <Link
            href="/login"
            className="ml-2 px-4 py-2 rounded-lg text-sm font-semibold text-[#1B4332] border border-[#1B4332]/20 hover:bg-[#1B4332] hover:text-white hover:border-[#1B4332] transition-all duration-200"
          >
            Admin
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition text-gray-700"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="border-t border-gray-100 bg-white/98 backdrop-blur-xl px-4 pb-5 pt-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between py-3 text-sm font-medium border-b border-gray-50 last:border-0 transition-colors ${
                  isActive ? 'text-[#1B4332]' : 'text-gray-600 hover:text-[#1B4332]'
                }`}
              >
                <span>{link.label}</span>
                {isActive && <ChevronRight className="w-4 h-4 text-[#C9A84C]" />}
              </Link>
            );
          })}
          <Link
            href="/login"
            onClick={() => setMobileOpen(false)}
            className="mt-3 flex items-center justify-center w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-[#1B4332] transition hover:bg-[#2D6A4F]"
          >
            Admin Login
          </Link>
        </div>
      </div>
    </nav>
  );
}
