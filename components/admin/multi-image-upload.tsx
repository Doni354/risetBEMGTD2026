'use client';

import { useState, useRef } from 'react';
import {
  Loader2,
  Upload,
  X,
  Image as ImageIcon,
  Star,
  ArrowLeft,
  ArrowRight,
  Plus,
  Link as LinkIcon,
  Maximize2,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

interface MultiImageUploadProps {
  idToken: string | null;
  value?: string[];
  onChange: (urls: string[]) => void;
  label?: string;
  maxImages?: number;
  description?: string;
}

export default function MultiImageUpload({
  idToken,
  value = [],
  onChange,
  label = 'Galeri Foto',
  maxImages = 10,
  description = 'Mendukung upload banyak foto sekaligus (Maksimal 5MB per foto)',
}: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [previewModalImg, setPreviewModalImg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const images = Array.isArray(value) ? value.filter(Boolean) : [];

  const handleUploadFiles = async (files: FileList | File[]) => {
    if (!idToken) {
      setError('Token autentikasi tidak ditemukan. Harap login ulang.');
      return;
    }

    const fileList = Array.from(files);
    if (fileList.length === 0) return;

    if (images.length + fileList.length > maxImages) {
      setError(`Maksimal hanya dapat mengupload ${maxImages} gambar (saat ini ${images.length} gambar).`);
      return;
    }

    // Validate files
    for (const file of fileList) {
      if (!file.type.startsWith('image/')) {
        setError(`File "${file.name}" bukan format gambar yang valid.`);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError(`File "${file.name}" melebihi ukuran maksimal 5MB.`);
        return;
      }
    }

    setError(null);
    setUploading(true);
    setUploadProgress({ current: 0, total: fileList.length });

    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        setUploadProgress({ current: i + 1, total: fileList.length });

        const form = new FormData();
        form.append('file', file);

        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { Authorization: `Bearer ${idToken}` },
          body: form,
        });

        if (!res.ok) {
          const d = await res.json();
          throw new Error(d.error || `Gagal mengupload ${file.name}`);
        }

        const { url } = await res.json();
        if (url) {
          uploadedUrls.push(url);
        }
      }

      onChange([...images, ...uploadedUrls]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat upload gambar');
      if (uploadedUrls.length > 0) {
        onChange([...images, ...uploadedUrls]);
      }
    } finally {
      setUploading(false);
      setUploadProgress(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUploadFiles(e.dataTransfer.files);
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const updated = images.filter((_, i) => i !== indexToRemove);
    onChange(updated);
  };

  const handleSetCover = (indexToCover: number) => {
    if (indexToCover === 0) return;
    const target = images[indexToCover];
    const rest = images.filter((_, i) => i !== indexToCover);
    onChange([target, ...rest]);
  };

  const handleMove = (fromIndex: number, direction: 'left' | 'right') => {
    const toIndex = direction === 'left' ? fromIndex - 1 : fromIndex + 1;
    if (toIndex < 0 || toIndex >= images.length) return;
    const copy = [...images];
    const temp = copy[fromIndex];
    copy[fromIndex] = copy[toIndex];
    copy[toIndex] = temp;
    onChange(copy);
  };

  const handleAddUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    if (images.length >= maxImages) {
      setError(`Maksimal ${maxImages} gambar telah tercapai.`);
      return;
    }
    onChange([...images, urlInput.trim()]);
    setUrlInput('');
    setShowUrlInput(false);
    setError(null);
  };

  return (
    <div className="space-y-3">
      {/* Label and Meta Info */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <label className="block text-sm font-semibold text-gray-800">{label}</label>
          <p className="text-xs text-gray-500 mt-0.5">{description}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100">
            {images.length} / {maxImages} Foto
          </span>
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="text-xs text-[#1B4332] font-semibold hover:underline flex items-center gap-1"
          >
            <LinkIcon className="w-3.5 h-3.5" />
            {showUrlInput ? 'Tutup URL' : '+ Link URL'}
          </button>
        </div>
      </div>

      {/* URL Input Bar */}
      {showUrlInput && (
        <form onSubmit={handleAddUrl} className="flex gap-2 p-2 bg-gray-50 border border-gray-200 rounded-xl">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://contoh-domain.com/foto.jpg"
            className="flex-1 px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1B4332]"
          />
          <button
            type="submit"
            className="px-3 py-1.5 bg-[#1B4332] text-white text-xs font-semibold rounded-lg hover:bg-[#1B4332]/90 transition"
          >
            Tambah
          </button>
        </form>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Upload Progress Banner */}
      {uploading && uploadProgress && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-3 rounded-xl text-xs flex items-center gap-3">
          <Loader2 className="w-5 h-5 text-emerald-700 animate-spin flex-shrink-0" />
          <div className="flex-1">
            <div className="font-semibold">
              Mengupload foto ({uploadProgress.current} dari {uploadProgress.total})...
            </div>
            <div className="w-full bg-emerald-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div
                className="bg-emerald-600 h-full transition-all duration-300"
                style={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Image Thumbnails Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((url, idx) => (
            <div
              key={`${url}-${idx}`}
              className={`group relative rounded-2xl overflow-hidden border transition-all shadow-sm aspect-square bg-gray-900 ${
                idx === 0
                  ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              {/* Blurred Backing */}
              <div
                className="absolute inset-0 bg-cover bg-center blur-md opacity-35 scale-110 pointer-events-none"
                style={{ backgroundImage: `url(${url})` }}
              />

              {/* Main Image View */}
              <img
                src={url}
                alt={`Gambar ${idx + 1}`}
                className="w-full h-full object-contain p-1 relative z-0"
              />

              {/* Cover Badge */}
              {idx === 0 && (
                <div className="absolute top-2 left-2 z-10 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" />
                  Cover Utama
                </div>
              )}

              {/* Action Overlays */}
              <div className="absolute inset-0 z-10 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                {/* Top Controls */}
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setPreviewModalImg(url)}
                    className="p-1.5 rounded-lg bg-white/20 hover:bg-white/40 text-white transition backdrop-blur-sm"
                    title="Perbesar"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="p-1.5 rounded-lg bg-red-600/80 hover:bg-red-600 text-white transition shadow"
                    title="Hapus foto ini"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Bottom Controls */}
                <div className="space-y-1">
                  {idx !== 0 && (
                    <button
                      type="button"
                      onClick={() => handleSetCover(idx)}
                      className="w-full py-1 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition flex items-center justify-center gap-1 shadow"
                    >
                      <Star className="w-3 h-3" /> Jadikan Cover
                    </button>
                  )}
                  <div className="flex items-center justify-between gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMove(idx, 'left')}
                      className="p-1 rounded-lg bg-white/20 hover:bg-white/40 disabled:opacity-30 text-white transition flex-1 flex justify-center"
                      title="Geser ke kiri"
                    >
                      <ArrowLeft className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === images.length - 1}
                      onClick={() => handleMove(idx, 'right')}
                      className="p-1 rounded-lg bg-white/20 hover:bg-white/40 disabled:opacity-30 text-white transition flex-1 flex justify-center"
                      title="Geser ke kanan"
                    >
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* "+ Tambah Foto" card inside grid */}
          {images.length < maxImages && (
            <div
              onClick={() => !uploading && fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`
                aspect-square border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-1.5
                cursor-pointer transition-all p-3 text-center
                ${dragOver ? 'border-[#1B4332] bg-[#1B4332]/5' : 'border-gray-200 hover:border-[#1B4332]/50 hover:bg-gray-50'}
              `}
            >
              <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500">
                <Plus className="w-5 h-5 text-[#1B4332]" />
              </div>
              <span className="text-xs font-semibold text-gray-700">Tambah Foto</span>
              <span className="text-[10px] text-gray-400">Bisa pilih banyak</span>
            </div>
          )}
        </div>
      )}

      {/* Large Dropzone if zero images */}
      {images.length === 0 && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={`
            w-full h-40 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-2
            cursor-pointer transition-all p-4 text-center
            ${dragOver ? 'border-[#1B4332] bg-[#1B4332]/5' : 'border-gray-200 hover:border-[#1B4332]/50 hover:bg-gray-50/70'}
          `}
        >
          {uploading ? (
            <>
              <Loader2 className="w-8 h-8 text-[#1B4332] animate-spin" />
              <p className="text-sm font-semibold text-gray-700">Mengupload gambar...</p>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
                {dragOver ? <Upload className="w-6 h-6 text-[#1B4332]" /> : <ImageIcon className="w-6 h-6 text-gray-400" />}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">
                  <span className="text-[#1B4332] font-bold hover:underline">Klik untuk pilih gambar</span> atau seret file ke sini
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Bisa pilih lebih dari 1 file sekaligus (PNG, JPG, WEBP maks 5MB)
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Hidden File Input with 'multiple' attribute */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleUploadFiles(e.target.files);
          }
        }}
      />

      {/* Quick Hints */}
      {images.length > 0 && (
        <p className="text-[11px] text-gray-400 italic">
          💡 Tips: Foto urutan pertama otomatis menjadi Cover utama. Arahkan mouse ke foto untuk mengubah urutan atau menjadikannya cover.
        </p>
      )}

      {/* Modal Zoom Preview */}
      {previewModalImg && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreviewModalImg(null)}
        >
          <div className="relative max-w-3xl max-h-[85vh] bg-gray-900 rounded-2xl overflow-hidden shadow-2xl p-2 border border-white/10" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setPreviewModalImg(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 hover:bg-red-600 text-white transition shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={previewModalImg}
              alt="Preview Zoom"
              className="max-w-full max-h-[80vh] object-contain rounded-xl mx-auto"
            />
          </div>
        </div>
      )}
    </div>
  );
}
