'use client';

import { useState } from 'react';
import { VillageProfile } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, Trash2, Edit2, Eye, MapPin, Phone, Mail, Users, Maximize2 } from 'lucide-react';

interface VillageProfileFormProps {
  initialData: VillageProfile;
  idToken: string | null;
  onSuccess: () => void;
}

export default function VillageProfileForm({ initialData, idToken, onSuccess }: VillageProfileFormProps) {
  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const [formData, setFormData] = useState<Partial<VillageProfile>>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('social_')) {
      const platform = name.replace('social_', '');
      setFormData((prev) => ({ ...prev, socialMedia: { ...prev.socialMedia, [platform]: value } }));
    } else if (name.startsWith('demo_')) {
      const field = name.replace('demo_', '');
      setFormData((prev) => ({
        ...prev,
        demographics: { ...prev.demographics, [field]: field === 'area' ? value : parseInt(value) || 0 },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleHighlightChange = (index: number, field: string, value: string) => {
    setFormData((prev) => {
      const highlights = [...(prev.highlights || [])];
      highlights[index] = { ...highlights[index], [field]: value };
      return { ...prev, highlights };
    });
  };

  const addHighlight = () =>
    setFormData((prev) => ({ ...prev, highlights: [...(prev.highlights || []), { icon: '⭐', title: '', description: '' }] }));

  const removeHighlight = (index: number) =>
    setFormData((prev) => ({ ...prev, highlights: (prev.highlights || []).filter((_, i) => i !== index) }));

  const handleCancel = () => {
    setFormData(initialData);
    setError(null);
    setMode('view');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idToken) { setError('Autentikasi diperlukan'); return; }
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/village-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Gagal memperbarui profil');
      }
      setSuccess(true);
      setTimeout(() => { setSuccess(false); setMode('view'); onSuccess(); }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 focus:border-[#1B4332] transition bg-white';
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5';
  const sectionClass = 'bg-white rounded-2xl border border-gray-100 p-6 space-y-4 shadow-sm';

  // ---- VIEW MODE ----
  if (mode === 'view') {
    return (
      <div className="space-y-6">
        {/* Hero Banner */}
        {initialData.imageUrl && (
          <div className="relative h-48 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
            <img src={initialData.imageUrl} alt="Banner Desa" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-4 left-5 text-white">
              <h1 className="text-xl font-bold">{initialData.villageName}</h1>
              <p className="text-white/80 text-sm flex items-center gap-1"><MapPin className="w-3 h-3" />{initialData.location}</p>
            </div>
          </div>
        )}

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Penduduk</p>
            <p className="text-2xl font-bold text-gray-900">{initialData.demographics?.population?.toLocaleString('id-ID') || '—'}</p>
            <p className="text-xs text-gray-400">jiwa</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Kepala Keluarga</p>
            <p className="text-2xl font-bold text-gray-900">{initialData.demographics?.households?.toLocaleString('id-ID') || '—'}</p>
            <p className="text-xs text-gray-400">KK</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Luas Wilayah</p>
            <p className="text-2xl font-bold text-gray-900">{initialData.demographics?.area || '—'}</p>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-2">Deskripsi</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{initialData.description || '—'}</p>
        </div>

        {initialData.visionMission && (
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-2">Visi & Misi</h3>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{initialData.visionMission}</p>
          </div>
        )}

        {(initialData.highlights || []).length > 0 && (
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-3">Potensi Unggulan</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {(initialData.highlights || []).map((h, i) => (
                <div key={i} className="flex items-start gap-3 bg-gray-50 rounded-xl p-3">
                  <span className="text-2xl">{h.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{h.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{h.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-3">Kontak</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600"><Mail className="w-4 h-4 text-gray-400" />{initialData.contactEmail || '—'}</div>
            <div className="flex items-center gap-2 text-sm text-gray-600"><Phone className="w-4 h-4 text-gray-400" />{initialData.contactPhone || '—'}</div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={() => setMode('edit')} className="bg-[#1B4332] text-white hover:bg-[#1B4332]/90">
            <Edit2 className="w-4 h-4 mr-2" />Edit Profil
          </Button>
        </div>
      </div>
    );
  }

  // ---- EDIT MODE ----
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Edit Profil Desa</h2>
          <p className="text-xs text-gray-400 mt-0.5">Perubahan akan langsung tampil di situs publik</p>
        </div>
        <Button type="button" variant="outline" onClick={handleCancel} size="sm">
          <Eye className="w-4 h-4 mr-1" /> Batal Edit
        </Button>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">⚠ {error}</div>}
      {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">✓ Profil berhasil disimpan!</div>}

      <div className={sectionClass}>
        <h3 className="text-base font-semibold text-gray-900">Informasi Dasar</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div><label className={labelClass}>Nama Desa</label><input type="text" name="villageName" value={formData.villageName || ''} onChange={handleChange} required className={inputClass} /></div>
          <div><label className={labelClass}>Lokasi</label><input type="text" name="location" value={formData.location || ''} onChange={handleChange} required className={inputClass} /></div>
        </div>
        <div><label className={labelClass}>Deskripsi</label><textarea name="description" value={formData.description || ''} onChange={handleChange} required rows={5} className={inputClass} /></div>
        <div><label className={labelClass}>URL Gambar Banner</label><input type="url" name="imageUrl" value={formData.imageUrl || ''} onChange={handleChange} className={inputClass} placeholder="https://..." /></div>
      </div>

      <div className={sectionClass}>
        <h3 className="text-base font-semibold text-gray-900">Visi & Misi</h3>
        <textarea name="visionMission" value={formData.visionMission || ''} onChange={handleChange} rows={6} className={inputClass} placeholder="Tuliskan visi dan misi desa..." />
      </div>

      <div className={sectionClass}>
        <h3 className="text-base font-semibold text-gray-900">Data Kependudukan</h3>
        <div className="grid grid-cols-3 gap-4">
          <div><label className={labelClass}>Jumlah Penduduk</label><input type="number" name="demo_population" value={formData.demographics?.population || 0} onChange={handleChange} className={inputClass} /></div>
          <div><label className={labelClass}>Jumlah KK</label><input type="number" name="demo_households" value={formData.demographics?.households || 0} onChange={handleChange} className={inputClass} /></div>
          <div><label className={labelClass}>Luas Wilayah</label><input type="text" name="demo_area" value={formData.demographics?.area || ''} onChange={handleChange} className={inputClass} placeholder="246.70 Ha" /></div>
        </div>
      </div>

      <div className={sectionClass}>
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900">Potensi Unggulan</h3>
          <Button type="button" variant="outline" size="sm" onClick={addHighlight} className="text-xs"><Plus className="w-3 h-3 mr-1" />Tambah</Button>
        </div>
        {(formData.highlights || []).map((h, i) => (
          <div key={i} className="grid grid-cols-[60px_1fr_1fr_auto] gap-3 items-start bg-gray-50/50 rounded-xl p-3 border border-gray-100">
            <div><label className={labelClass}>Ikon</label><input type="text" value={h.icon} onChange={(e) => handleHighlightChange(i, 'icon', e.target.value)} className={inputClass} /></div>
            <div><label className={labelClass}>Judul</label><input type="text" value={h.title} onChange={(e) => handleHighlightChange(i, 'title', e.target.value)} className={inputClass} /></div>
            <div><label className={labelClass}>Deskripsi</label><input type="text" value={h.description} onChange={(e) => handleHighlightChange(i, 'description', e.target.value)} className={inputClass} /></div>
            <Button type="button" variant="outline" size="sm" onClick={() => removeHighlight(i)} className="mt-6 text-red-500 border-red-200 hover:bg-red-50"><Trash2 className="w-3 h-3" /></Button>
          </div>
        ))}
      </div>

      <div className={sectionClass}>
        <h3 className="text-base font-semibold text-gray-900">Kontak</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div><label className={labelClass}>Email</label><input type="email" name="contactEmail" value={formData.contactEmail || ''} onChange={handleChange} required className={inputClass} /></div>
          <div><label className={labelClass}>Telepon</label><input type="tel" name="contactPhone" value={formData.contactPhone || ''} onChange={handleChange} required className={inputClass} /></div>
        </div>
      </div>

      <div className={sectionClass}>
        <h3 className="text-base font-semibold text-gray-900">Media Sosial</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div><label className={labelClass}>Instagram</label><input type="url" name="social_instagram" value={formData.socialMedia?.instagram || ''} onChange={handleChange} className={inputClass} /></div>
          <div><label className={labelClass}>Facebook</label><input type="url" name="social_facebook" value={formData.socialMedia?.facebook || ''} onChange={handleChange} className={inputClass} /></div>
          <div><label className={labelClass}>WhatsApp</label><input type="text" name="social_whatsapp" value={formData.socialMedia?.whatsapp || ''} onChange={handleChange} className={inputClass} /></div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={handleCancel}>Batal</Button>
        <Button type="submit" disabled={loading || success} className="px-8 bg-[#1B4332] hover:bg-[#1B4332]/90 text-white rounded-xl font-semibold">
          {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Menyimpan...</> : success ? '✓ Tersimpan!' : 'Simpan Perubahan'}
        </Button>
      </div>
    </form>
  );
}
