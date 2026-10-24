'use client';

import { useState } from 'react';
import { VillageEvent, EventCategory } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import MultiImageUpload from './multi-image-upload';

interface EventFormProps {
  idToken: string | null;
  initialData?: VillageEvent;
  onSuccess: (event: VillageEvent) => void;
  onCancel: () => void;
}

const CATEGORIES: EventCategory[] = ['Keagamaan', 'Olahraga', 'Kebudayaan', 'Pendidikan', 'Sosial', 'Pemerintahan', 'Lainnya'];

export default function EventForm({ idToken, initialData, onSuccess, onCancel }: EventFormProps) {
  const toDatetimeLocal = (ts?: number) => {
    if (!ts) return '';
    const d = new Date(ts);
    return d.toISOString().slice(0, 16);
  };

  const initialImages: string[] = initialData?.images?.length
    ? initialData.images
    : (initialData?.imageUrl ? [initialData.imageUrl] : []);

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    location: initialData?.location || '',
    organizer: initialData?.organizer || '',
    category: (initialData?.category || 'Lainnya') as EventCategory,
    date: toDatetimeLocal(initialData?.date),
    endDate: toDatetimeLocal(initialData?.endDate),
    imageUrl: initialData?.imageUrl || '',
    images: initialImages,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idToken) { setError('Autentikasi diperlukan'); return; }
    if (!formData.title || !formData.description || !formData.location || !formData.date || !formData.organizer) {
      setError('Harap isi semua field yang wajib diisi (*)');
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
        date: new Date(formData.date).getTime(),
        endDate: formData.endDate ? new Date(formData.endDate).getTime() : undefined,
      };

      const method = initialData ? 'PATCH' : 'POST';
      const url = initialData ? `/api/events/${initialData.id}` : '/api/events';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Gagal menyimpan acara');
      }

      const result = await res.json();
      setSuccess(true);
      setTimeout(() => {
        if (!initialData && result.event) {
          onSuccess(result.event);
        } else if (initialData) {
          onSuccess({ ...initialData, ...payload } as VillageEvent);
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
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
        <h3 className="font-semibold text-gray-900">{initialData ? 'Edit Acara' : 'Tambah Acara Baru'}</h3>
        <p className="text-xs text-gray-500 mt-0.5">Field bertanda * wajib diisi</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">⚠ {error}</div>}
        {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">✓ Acara berhasil disimpan!</div>}

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
          label="Foto & Pamflet / Dokumentasi Acara"
          description="Bisa upload lebih dari 1 foto (pamflet, rundown, foto lokasi, atau dokumentasi). Foto pertama menjadi cover utama."
        />

        <div className="grid md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className={labelClass}>Nama Acara *</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required className={inputClass} placeholder="Contoh: Pentas Seni Desa 2026" />
          </div>
          <div>
            <label className={labelClass}>Kategori *</label>
            <select name="category" value={formData.category} onChange={handleChange} className={inputClass}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Penyelenggara *</label>
            <input type="text" name="organizer" value={formData.organizer} onChange={handleChange} required className={inputClass} placeholder="Karang Taruna / RT 03 / ..." />
          </div>
          <div>
            <label className={labelClass}>Tanggal & Waktu Mulai *</label>
            <input type="datetime-local" name="date" value={formData.date} onChange={handleChange} required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Tanggal & Waktu Selesai</label>
            <input type="datetime-local" name="endDate" value={formData.endDate} onChange={handleChange} className={inputClass} />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Lokasi *</label>
            <input type="text" name="location" value={formData.location} onChange={handleChange} required className={inputClass} placeholder="Balai Desa / Lapangan / ..." />
          </div>
        </div>

        <div>
          <label className={labelClass}>Deskripsi *</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required rows={4} className={inputClass} placeholder="Ceritakan lebih lanjut tentang acara ini..." />
        </div>

        <div className="flex gap-3 justify-end pt-2 border-t border-gray-100">
          <Button type="button" variant="outline" onClick={onCancel} className="px-5">Batal</Button>
          <Button type="submit" disabled={loading || success} className="bg-[#1B4332] hover:bg-[#1B4332]/90 text-white px-6">
            {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Menyimpan...</> : success ? '✓ Tersimpan!' : initialData ? 'Simpan Perubahan' : 'Tambah Acara'}
          </Button>
        </div>
      </form>
    </div>
  );
}
