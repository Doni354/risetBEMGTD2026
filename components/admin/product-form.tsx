'use client';

import { useState } from 'react';
import { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Loader2, Phone, Sparkles } from 'lucide-react';
import MultiImageUpload from './multi-image-upload';

interface ProductFormProps {
  idToken: string | null;
  initialData?: Product;
  onSuccess: (product: Product) => void;
  onCancel: () => void;
}

const CATEGORIES = [
  'Makanan & Minuman',
  'Kerajinan Tangan',
  'Pertanian',
  'Perikanan',
  'Fashion & Tekstil',
  'Lainnya',
];

/** Extract phone number from wa.me link for clean UI display */
function extractPhoneFromWaLink(link?: string): string {
  if (!link) return '';
  const match = link.match(/(?:wa\.me\/|phone=)(\+?[0-9]+)/);
  if (match) {
    let num = match[1].replace(/^\+/, '');
    if (num.startsWith('62')) {
      num = '0' + num.slice(2);
    }
    return num;
  }
  return link.replace(/[^0-9+]/g, '');
}

/** Convert regular phone number to wa.me link */
function formatPhoneToWaLink(phone: string): string {
  let clean = phone.replace(/[^0-9]/g, '');
  if (clean.startsWith('0')) {
    clean = '62' + clean.slice(1);
  } else if (clean.startsWith('8')) {
    clean = '62' + clean;
  }
  return `https://wa.me/${clean}`;
}

export default function ProductForm({ idToken, initialData, onSuccess, onCancel }: ProductFormProps) {
  const initialImages: string[] = initialData?.images?.length
    ? initialData.images
    : (initialData?.imageUrl ? [initialData.imageUrl] : []);

  const [formData, setFormData] = useState<Partial<Product> & { images?: string[] }>(
    initialData
      ? { ...initialData, images: initialImages }
      : { name: '', description: '', price: 0, category: 'Lainnya', stock: 0, whatsappLink: '', imageUrl: '', images: [] }
  );
  const [waPhone, setWaPhone] = useState(extractPhoneFromWaLink(initialData?.whatsappLink) || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? parseFloat(value) || 0 : value,
    }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    // Allow digits, plus, hyphens, spaces
    const clean = raw.replace(/[^0-9+\-\s]/g, '');
    setWaPhone(clean);
  };

  const generatedWaLink = waPhone.trim() ? formatPhoneToWaLink(waPhone) : '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idToken) { setError('Autentikasi diperlukan'); return; }

    const finalWaLink = generatedWaLink;

    if (!formData.name || !formData.description || !formData.price || !formData.category || !finalWaLink) {
      setError('Harap isi semua field yang wajib diisi (*), termasuk nomor WhatsApp.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const images = formData.images || [];
      const payload = {
        ...formData,
        imageUrl: images[0] || formData.imageUrl || '',
        images,
        whatsappLink: finalWaLink,
      };

      const method = initialData ? 'PATCH' : 'POST';
      const url = initialData ? `/api/products/${initialData.id}` : '/api/products';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Gagal menyimpan produk');
      }

      const result = await response.json();
      setSuccess(true);
      setTimeout(() => {
        if (!initialData && result.product) {
          onSuccess(result.product);
        } else if (initialData) {
          onSuccess({ ...initialData, ...payload } as Product);
        }
      }, 700);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 focus:border-[#1B4332] transition bg-white';
  const labelClass = 'block text-sm font-semibold text-gray-700 mb-1.5';

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Form Header */}
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-gray-900 text-base">{initialData ? 'Edit Produk UMKM' : 'Tambah Produk UMKM Baru'}</h3>
          <p className="text-xs text-gray-500 mt-0.5">Kelola informasi katalog produk desa</p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#1B4332]/10 text-[#1B4332]">
          Katalog Desa
        </span>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-start gap-2">
            <span className="mt-0.5 font-bold">⚠</span> {error}
          </div>
        )}
        {success && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" /> Produk berhasil disimpan!
          </div>
        )}

        {/* Multi-Image Upload */}
        <MultiImageUpload
          idToken={idToken}
          value={formData.images || (formData.imageUrl ? [formData.imageUrl] : [])}
          onChange={(urls) =>
            setFormData((prev) => ({
              ...prev,
              images: urls,
              imageUrl: urls[0] || '',
            }))
          }
          label="Foto Produk"
          description="Bisa upload lebih dari 1 foto produk. Foto pertama akan otomatis menjadi foto utama (cover)."
        />

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Nama Produk *</label>
            <input type="text" name="name" value={formData.name || ''} onChange={handleChange} required className={inputClass} placeholder="Contoh: Kerupuk Udang Super" />
          </div>
          <div>
            <label className={labelClass}>Kategori *</label>
            <select name="category" value={formData.category || 'Lainnya'} onChange={handleChange} className={inputClass}>
              {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Harga (Rp) *</label>
            <input type="number" name="price" value={formData.price || 0} onChange={handleChange} min="0" required className={inputClass} placeholder="0" />
          </div>
          <div>
            <label className={labelClass}>Stok Unit</label>
            <input type="number" name="stock" value={formData.stock || 0} onChange={handleChange} min="0" className={inputClass} placeholder="0" />
          </div>
        </div>

        <div>
          <label className={labelClass}>Deskripsi Produk *</label>
          <textarea name="description" value={formData.description || ''} onChange={handleChange} required rows={3} className={inputClass} placeholder="Ceritakan keunggulan, bahan, atau varian produk ini..." />
        </div>

        {/* Improved Phone/WA Input */}
        <div className="bg-emerald-50/40 border border-emerald-100 rounded-2xl p-4 space-y-2">
          <label className={labelClass}>
            Nomor WhatsApp Penjual / Pemilik UMKM *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Phone className="w-4 h-4 text-[#1B4332]" />
            </div>
            <input
              type="tel"
              value={waPhone}
              onChange={handlePhoneChange}
              required
              className={`${inputClass} pl-10 font-medium`}
              placeholder="081234567890 atau 6281234567890"
            />
          </div>
          <div className="flex flex-wrap items-center justify-between text-xs text-gray-500 pt-1">
            <span>Cukup ketikkan nomor telepon biasa (contoh: 081234567890).</span>
            {generatedWaLink && (
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                ✓ Otomatis terhubung ke: <code className="bg-emerald-100/70 px-1.5 py-0.5 rounded text-[11px] text-emerald-900">{generatedWaLink}</code>
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-3 justify-end pt-3 border-t border-gray-100">
          <Button type="button" variant="outline" onClick={onCancel} className="px-5 rounded-xl">Batal</Button>
          <Button type="submit" disabled={loading || success} className="bg-[#1B4332] hover:bg-[#1B4332]/90 text-white px-6 rounded-xl font-medium shadow-sm">
            {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Menyimpan...</> : success ? '✓ Tersimpan!' : initialData ? 'Simpan Perubahan' : 'Tambah Produk'}
          </Button>
        </div>
      </form>
    </div>
  );
}
