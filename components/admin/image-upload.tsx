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

      {/* Preview */}
      {value && (
        <div className="relative w-full h-48 rounded-xl overflow-hidden border border-gray-200 bg-gray-900 group flex items-center justify-center">
          {/* Blurred Background */}
          <div
            className="absolute inset-0 bg-cover bg-center blur-md opacity-40 scale-110 pointer-events-none"
            style={{ backgroundImage: `url(${value})` }}
          />
          {/* Main Image */}
          <img src={value} alt="Preview" className="relative z-10 w-full h-full object-contain drop-shadow-lg" />
          
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 z-20 bg-black/60 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition hover:bg-black/90 shadow-sm"
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
            w-full h-36 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2
            cursor-pointer transition-all
            ${dragOver ? 'border-[#1B4332] bg-[#1B4332]/5' : 'border-gray-200 hover:border-[#1B4332]/50 hover:bg-gray-50'}
          `}
        >
          {uploading ? (
            <>
              <Loader2 className="w-7 h-7 text-[#1B4332] animate-spin" />
              <p className="text-sm text-gray-500">Mengupload...</p>
            </>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                {dragOver ? <Upload className="w-5 h-5 text-[#1B4332]" /> : <ImageIcon className="w-5 h-5 text-gray-400" />}
              </div>
              <p className="text-sm text-gray-500">
                <span className="text-[#1B4332] font-medium">Klik untuk upload</span> atau drag & drop
              </p>
              <p className="text-xs text-gray-400">PNG, JPG, WEBP maks. 5MB</p>
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

      {error && <p className="text-xs text-red-500">{error}</p>}

      {/* Replace button if already has image */}
      {value && !uploading && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="text-xs text-[#1B4332] underline"
        >
          Ganti gambar
        </button>
      )}
    </div>
  );
}
