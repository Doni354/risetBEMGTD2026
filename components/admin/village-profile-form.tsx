'use client';

import { useState } from 'react';
import { VillageProfile } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, Trash2 } from 'lucide-react';

interface VillageProfileFormProps {
  initialData: VillageProfile;
  idToken: string | null;
  onSuccess: () => void;
}

/**
 * Form editor profil desa untuk Admin Dashboard.
 * Mendukung edit: info dasar, visi misi, demografi, potensi unggulan, kontak, sosmed.
 */
export default function VillageProfileForm({
  initialData,
  idToken,
  onSuccess,
}: VillageProfileFormProps) {
  const [formData, setFormData] = useState<Partial<VillageProfile>>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name.startsWith('social_')) {
      const platform = name.replace('social_', '');
      setFormData((prev) => ({
        ...prev,
        socialMedia: { ...prev.socialMedia, [platform]: value },
      }));
    } else if (name.startsWith('demo_')) {
      const field = name.replace('demo_', '');
      setFormData((prev) => ({
        ...prev,
        demographics: {
          ...prev.demographics,
          [field]: field === 'area' ? value : parseInt(value) || 0,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleHighlightChange = (
    index: number,
    field: string,
    value: string
  ) => {
    setFormData((prev) => {
      const highlights = [...(prev.highlights || [])];
      highlights[index] = { ...highlights[index], [field]: value };
      return { ...prev, highlights };
    });
  };

  const addHighlight = () => {
    setFormData((prev) => ({
      ...prev,
      highlights: [
        ...(prev.highlights || []),
        { icon: '⭐', title: '', description: '' },
      ],
    }));
  };

  const removeHighlight = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      highlights: (prev.highlights || []).filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idToken) {
      setError('Authentication required');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/village-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update profile');
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332]/30 focus:border-[#1B4332] transition bg-white';
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5';
  const sectionClass = 'bg-white rounded-2xl border border-gray-100 p-6 space-y-4 shadow-sm';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
          Profil berhasil diperbarui!
        </div>
      )}

      {/* Informasi Dasar */}
      <div className={sectionClass}>
        <h2 className="text-lg font-semibold text-gray-900">Informasi Dasar</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Nama Desa</label>
            <input type="text" name="villageName" value={formData.villageName || ''} onChange={handleChange} required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Lokasi</label>
            <input type="text" name="location" value={formData.location || ''} onChange={handleChange} required className={inputClass} />
          </div>
        </div>
        <div>
          <label className={labelClass}>Deskripsi</label>
          <textarea name="description" value={formData.description || ''} onChange={handleChange} required rows={5} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>URL Gambar Banner</label>
          <input type="url" name="imageUrl" value={formData.imageUrl || ''} onChange={handleChange} className={inputClass} placeholder="https://..." />
        </div>
      </div>

      {/* Visi & Misi */}
      <div className={sectionClass}>
        <h2 className="text-lg font-semibold text-gray-900">Visi & Misi</h2>
        <textarea name="visionMission" value={formData.visionMission || ''} onChange={handleChange} rows={6} className={inputClass} placeholder="Tuliskan visi dan misi desa..." />
      </div>

      {/* Demografi */}
      <div className={sectionClass}>
        <h2 className="text-lg font-semibold text-gray-900">Data Kependudukan</h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Jumlah Penduduk</label>
            <input type="number" name="demo_population" value={formData.demographics?.population || 0} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Jumlah KK</label>
            <input type="number" name="demo_households" value={formData.demographics?.households || 0} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Luas Wilayah</label>
            <input type="text" name="demo_area" value={formData.demographics?.area || ''} onChange={handleChange} className={inputClass} placeholder="246.70 Ha" />
          </div>
        </div>
      </div>

      {/* Potensi Unggulan */}
      <div className={sectionClass}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Potensi Unggulan</h2>
          <Button type="button" variant="outline" size="sm" onClick={addHighlight} className="text-xs">
            <Plus className="w-3 h-3 mr-1" /> Tambah
          </Button>
        </div>
        {(formData.highlights || []).map((h, i) => (
          <div key={i} className="grid grid-cols-[60px_1fr_1fr_auto] gap-3 items-start bg-gray-50/50 rounded-xl p-3 border border-gray-100">
            <div>
              <label className={labelClass}>Ikon</label>
              <input type="text" value={h.icon} onChange={(e) => handleHighlightChange(i, 'icon', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Judul</label>
              <input type="text" value={h.title} onChange={(e) => handleHighlightChange(i, 'title', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Deskripsi</label>
              <input type="text" value={h.description} onChange={(e) => handleHighlightChange(i, 'description', e.target.value)} className={inputClass} />
            </div>
            <Button type="button" variant="outline" size="sm" onClick={() => removeHighlight(i)} className="mt-6 text-red-500 border-red-200 hover:bg-red-50">
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        ))}
      </div>

      {/* Kontak */}
      <div className={sectionClass}>
        <h2 className="text-lg font-semibold text-gray-900">Kontak</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Email</label>
            <input type="email" name="contactEmail" value={formData.contactEmail || ''} onChange={handleChange} required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Telepon</label>
            <input type="tel" name="contactPhone" value={formData.contactPhone || ''} onChange={handleChange} required className={inputClass} />
          </div>
        </div>
      </div>

      {/* Sosial Media */}
      <div className={sectionClass}>
        <h2 className="text-lg font-semibold text-gray-900">Media Sosial</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Instagram</label>
            <input type="url" name="social_instagram" value={formData.socialMedia?.instagram || ''} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Facebook</label>
            <input type="url" name="social_facebook" value={formData.socialMedia?.facebook || ''} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>WhatsApp</label>
            <input type="text" name="social_whatsapp" value={formData.socialMedia?.whatsapp || ''} onChange={handleChange} className={inputClass} />
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <Button type="submit" disabled={loading} className="px-8 py-3 bg-[#1B4332] hover:bg-[#1B4332]/90 text-white rounded-xl font-semibold">
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Menyimpan...
            </>
          ) : (
            'Simpan Perubahan'
          )}
        </Button>
      </div>
    </form>
  );
}
