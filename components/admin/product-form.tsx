'use client';

import { useState } from 'react';
import { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import ImageUpload from './image-upload';

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

export default function ProductForm({ idToken, initialData, onSuccess, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState<Partial<Product>>(
    initialData || { name: '', description: '', price: 0, category: 'Lainnya', stock: 0, whatsappLink: '', imageUrl: '' }
  );
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idToken) { setError('Autentikasi diperlukan'); return; }
    if (!formData.name || !formData.description || !formData.price || !formData.category || !formData.whatsappLink) {
      setError('Harap isi semua field yang wajib diisi (*)');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const method = initialData ? 'PATCH' : 'POST';
      const url = initialData ? `/api/products/${initialData.id}` : '/api/products';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` },
        body: JSON.stringify(formData),
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
          onSuccess({ ...initialData, ...formData } as Product);
        }
      }, 700);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 focus:border-[#1B4332] transition bg-white';
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5';

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Form Header */}
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
        <h3 className="font-semibold text-gray-900">{initialData ? 'Edit Produk' : 'Tambah Produk Baru'}</h3>
        <p className="text-xs text-gray-500 mt-0.5">Field bertanda * wajib diisi</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-start gap-2">
            <span className="mt-0.5">⚠</span> {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
            <span>✓</span> Produk berhasil disimpan!
          </div>
        )}

        {/* Image Upload */}
        <ImageUpload
          idToken={idToken}
          value={formData.imageUrl}
          onChange={(url) => setFormData((prev) => ({ ...prev, imageUrl: url }))}
          label="Foto Produk"
        />

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Nama Produk *</label>
            <input type="text" name="name" value={formData.name || ''} onChange={handleChange} required className={inputClass} placeholder="Contoh: Batik Tulis Madura" />
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
            <label className={labelClass}>Stok</label>
            <input type="number" name="stock" value={formData.stock || 0} onChange={handleChange} min="0" className={inputClass} placeholder="0" />
          </div>
        </div>

        <div>
          <label className={labelClass}>Deskripsi *</label>
          <textarea name="description" value={formData.description || ''} onChange={handleChange} required rows={4} className={inputClass} placeholder="Deskripsikan produk Anda..." />
        </div>

        <div>
          <label className={labelClass}>Link WhatsApp *</label>
          <input type="url" name="whatsappLink" value={formData.whatsappLink || ''} onChange={handleChange} required className={inputClass} placeholder="https://wa.me/62..." />
          <p className="text-xs text-gray-400 mt-1">Format: https://wa.me/628xxxxxxxxxx</p>
        </div>

        <div className="flex gap-3 justify-end pt-2 border-t border-gray-100">
          <Button type="button" variant="outline" onClick={onCancel} className="px-5">Batal</Button>
          <Button type="submit" disabled={loading || success} className="bg-[#1B4332] hover:bg-[#1B4332]/90 text-white px-6">
            {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Menyimpan...</> : success ? '✓ Tersimpan!' : initialData ? 'Simpan Perubahan' : 'Tambah Produk'}
          </Button>
        </div>
      </form>
    </div>
  );
}
