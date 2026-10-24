'use client';

import { useState, useRef } from 'react';
import { Loader2, Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  idToken: string | null;
  value?: string; // current image URL
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageUpload({ idToken, value, onChange, label = 'Gambar' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!idToken) { setError('Token tidak valid'); return; }
    if (!file.type.startsWith('image/')) { setError('File harus berupa gambar'); return; }
    if (file.size > 5 * 1024 * 1024) { setError('Ukuran gambar maksimal 5MB'); return; }

    setError(null);
    setUploading(true);

    try {
      const form = new FormData();
      form.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${idToken}` },
        body: form,
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Upload gagal');
      }

      const { url } = await res.json();
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload gagal');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      {/* Preview Container - isolate stacking context so it never leaks or overlays sticky headers */}
      {value && (
        <div className="relative isolate w-full h-48 rounded-2xl overflow-hidden border border-gray-200 bg-gray-900 group flex items-center justify-center shadow-inner">
          {/* Blurred Background */}
          <div
            className="absolute inset-0 bg-cover bg-center blur-md opacity-35 scale-110 pointer-events-none -z-10"
            style={{ backgroundImage: `url(${value})` }}
          />
          {/* Main Image */}
          <img
            src={value}
            alt="Preview"
            className="max-h-full max-w-full object-contain drop-shadow-md p-2 z-0"
          />
          
          {/* Delete Button */}
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-3 right-3 z-10 bg-black/70 hover:bg-red-600 text-white rounded-full p-1.5 transition-all shadow-md group-hover:scale-105"
            title="Hapus gambar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Drop Zone */}
      {!value && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !uploading && inputRef.current?.click()}
          className={`
            w-full h-36 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-2
            cursor-pointer transition-all
            ${dragOver ? 'border-[#1B4332] bg-[#1B4332]/5' : 'border-gray-200 hover:border-[#1B4332]/50 hover:bg-gray-50/70'}
          `}
        >
          {uploading ? (
            <>
              <Loader2 className="w-7 h-7 text-[#1B4332] animate-spin" />
              <p className="text-sm font-medium text-gray-600">Mengupload gambar...</p>
            </>
          ) : (
            <>
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                {dragOver ? <Upload className="w-5 h-5 text-[#1B4332]" /> : <ImageIcon className="w-5 h-5 text-gray-400" />}
              </div>
              <p className="text-sm text-gray-600">
                <span className="text-[#1B4332] font-semibold hover:underline">Klik untuk upload</span> atau seret file ke sini
              </p>
              <p className="text-xs text-gray-400">Format PNG, JPG, WEBP (Maksimal 5MB)</p>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
      />

      {error && <p className="text-xs text-red-500 font-medium">⚠ {error}</p>}

      {/* Replace button if already has image */}
      {value && !uploading && (
        <div className="flex items-center gap-3 pt-1">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="text-xs text-[#1B4332] font-semibold hover:underline flex items-center gap-1"
          >
            <Upload className="w-3.5 h-3.5" /> Ganti Gambar
          </button>
        </div>
      )}
    </div>
  );
}
