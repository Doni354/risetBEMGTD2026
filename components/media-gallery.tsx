'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Image as ImageIcon,
  Sparkles,
} from 'lucide-react';

interface MediaGalleryProps {
  images?: string[];
  title?: string;
  aspectRatio?: 'square' | 'video' | 'wide' | 'auto';
  className?: string;
}

export default function MediaGallery({
  images = [],
  title = 'Foto',
  aspectRatio = 'square',
  className = '',
}: MediaGalleryProps) {
  const cleanImages = (Array.isArray(images) ? images : []).filter(
    (img): img is string => typeof img === 'string' && img.trim().length > 0
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const total = cleanImages.length;
  const currentImage = cleanImages[currentIndex];

  const handlePrev = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
  }, [total]);

  const handleNext = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
  }, [total]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape') setIsLightboxOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, handlePrev, handleNext]);

  // Mobile touch swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    setTouchStart(null);
  };

  if (total === 0) {
    return (
      <div
        className={`w-full rounded-3xl bg-gray-100 border border-gray-200/80 flex flex-col items-center justify-center p-8 text-gray-400 ${
          aspectRatio === 'square' ? 'aspect-square' : 'aspect-video'
        } ${className}`}
      >
        <ImageIcon className="w-14 h-14 mb-2 opacity-30 text-[#1B4332]" />
        <p className="text-sm font-medium">Belum ada foto</p>
      </div>
    );
  }

  const aspectClass =
    aspectRatio === 'square'
      ? 'aspect-square'
      : aspectRatio === 'video'
      ? 'aspect-[16/10]'
      : aspectRatio === 'wide'
      ? 'aspect-[16/9]'
      : 'min-h-[320px]';

  return (
    <div className={`space-y-4 select-none ${className}`}>
      {/* ── Main Active View ── */}
      <div
        className={`relative w-full rounded-3xl overflow-hidden bg-gray-950 border border-gray-100 shadow-md group ${aspectClass}`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Ambient Blurred Background for depth */}
        <div
          className="absolute inset-0 bg-cover bg-center blur-2xl opacity-40 scale-125 transition-all duration-700 pointer-events-none"
          style={{ backgroundImage: `url(${currentImage})` }}
        />

        {/* Crisp Main Photo */}
        <div
          className="relative w-full h-full flex items-center justify-center cursor-zoom-in p-2"
          onClick={() => setIsLightboxOpen(true)}
        >
          <img
            key={currentImage}
            src={currentImage}
            alt={`${title} - Foto ${currentIndex + 1}`}
            className="max-h-full max-w-full object-contain rounded-2xl drop-shadow-lg transition-all duration-500 ease-out animate-in fade-in zoom-in-95"
          />
        </div>

        {/* Counter & Status Badge */}
        {total > 1 && (
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-semibold tracking-wide border border-white/10 shadow-lg">
              {currentIndex + 1} / {total} Foto
            </span>
          </div>
        )}

        {/* Fullscreen Trigger Button */}
        <button
          type="button"
          onClick={() => setIsLightboxOpen(true)}
          className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition-all duration-200 border border-white/10 shadow-lg opacity-80 hover:opacity-100 group-hover:scale-105"
          title="Lihat ukuran penuh (Fullscreen)"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Navigation Arrows */}
        {total > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/40 hover:bg-black/80 text-white backdrop-blur-md flex items-center justify-center transition-all duration-200 border border-white/15 opacity-0 group-hover:opacity-100 hover:scale-110 shadow-lg"
              aria-label="Foto Sebelumnya"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/40 hover:bg-black/80 text-white backdrop-blur-md flex items-center justify-center transition-all duration-200 border border-white/15 opacity-0 group-hover:opacity-100 hover:scale-110 shadow-lg"
              aria-label="Foto Berikutnya"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Indicator dots for mobile */}
        {total > 1 && (
          <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5 z-10 md:hidden pointer-events-none">
            {cleanImages.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentIndex ? 'w-5 bg-white' : 'w-1.5 bg-white/40'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Thumbnail Strip (Multiple Photos) ── */}
      {total > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 scrollbar-thin scrollbar-thumb-gray-200">
          {cleanImages.map((url, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={`${url}-${idx}`}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-gray-900 transition-all duration-200 ${
                  isActive
                    ? 'ring-3 ring-[#1B4332] scale-105 shadow-md border-transparent'
                    : 'opacity-65 hover:opacity-100 border border-gray-200'
                }`}
                title={`Pilih foto ${idx + 1}`}
              >
                <img
                  src={url}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
                {isActive && (
                  <div className="absolute inset-0 bg-[#1B4332]/10 pointer-events-none" />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* ── Fullscreen Lightbox Modal ── */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex flex-col justify-between animate-in fade-in duration-200 p-4 sm:p-6"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Top Bar */}
          <div
            className="flex items-center justify-between z-20 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <span className="font-semibold text-sm sm:text-base tracking-wide truncate max-w-xs sm:max-w-md">
                {title}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-white/10 text-xs font-medium border border-white/10">
                {currentIndex + 1} dari {total}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all hover:scale-105"
              title="Tutup (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Stage */}
          <div
            className="relative flex-1 flex items-center justify-center my-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Arrows */}
            {total > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-2 sm:left-6 z-20 p-3 rounded-full bg-white/10 hover:bg-white/30 text-white backdrop-blur-md transition-all hover:scale-110 shadow-xl"
                  title="Sebelumnya (Panah Kiri)"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-2 sm:right-6 z-20 p-3 rounded-full bg-white/10 hover:bg-white/30 text-white backdrop-blur-md transition-all hover:scale-110 shadow-xl"
                  title="Berikutnya (Panah Kanan)"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            <img
              src={currentImage}
              alt={`${title} - Layar Penuh`}
              className="max-h-[75vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200"
            />
          </div>

          {/* Bottom Thumbnails Strip */}
          {total > 1 && (
            <div
              className="flex items-center justify-center gap-2 overflow-x-auto py-2 z-20"
              onClick={(e) => e.stopPropagation()}
            >
              {cleanImages.map((url, idx) => (
                <button
                  key={`lightbox-${url}-${idx}`}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden flex-shrink-0 transition-all ${
                    idx === currentIndex
                      ? 'ring-2 ring-emerald-400 scale-105 opacity-100'
                      : 'opacity-40 hover:opacity-80'
                  }`}
                >
                  <img
                    src={url}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
