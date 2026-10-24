'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, AlertTriangle, ShieldAlert, Loader2, CheckCircle2, X } from 'lucide-react';

interface DangerZoneProps {
  idToken: string | null;
  onDataCleared?: () => void;
}

type DeleteTarget = 'products' | 'events' | 'all';

export default function DangerZone({ idToken, onDataCleared }: DangerZoneProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [target, setTarget] = useState<DeleteTarget>('products');
  const [confirmationInput, setConfirmationInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const openDeleteModal = (t: DeleteTarget) => {
    setTarget(t);
    setConfirmationInput('');
    setFeedback(null);
    setModalOpen(true);
  };

  const getTargetTitle = () => {
    switch (target) {
      case 'products': return 'Semua Data Produk';
      case 'events': return 'Semua Data Acara';
      case 'all': return 'SELURUH DATA (Produk & Acara)';
    }
  };

  const executeDelete = async () => {
    if (confirmationInput !== 'HAPUS') return;
    if (!idToken) return;

    try {
      setLoading(true);
      setFeedback(null);

      const res = await fetch('/api/admin/danger/delete-all', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          target,
          confirmation: 'HAPUS',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal menghapus data');
      }

      setFeedback({
        msg: `Sukses! Berhasil menghapus ${data.deletedProductsCount || 0} produk dan ${data.deletedEventsCount || 0} acara. Database bersih untuk siap produksi!`,
        type: 'success',
      });
      setModalOpen(false);
      onDataCleared?.();
    } catch (err) {
      setFeedback({
        msg: err instanceof Error ? err.message : 'Terjadi kesalahan saat menghapus data',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-red-50/50 border border-red-200 rounded-3xl p-6 shadow-sm space-y-4">
      <div className="flex items-start gap-3">
        <div className="p-2.5 bg-red-100 rounded-2xl text-red-600 flex-shrink-0">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-red-900">Zona Bahaya (Danger Zone)</h3>
            <span className="text-[10px] font-bold bg-red-200/70 text-red-800 px-2 py-0.5 rounded-full">
              Khusus Akun doni.smpn1@gmail.com
            </span>
          </div>
          <p className="text-xs text-red-700/80 mt-1 leading-relaxed">
            Fitur ini digunakan menjelang produksi (live launch) untuk membersihkan seluruh data dummy / pengujian dari database Firestore secara permanen.
          </p>
        </div>
      </div>

      {feedback && (
        <div
          className={`px-4 py-3 rounded-2xl text-xs font-medium flex items-center gap-2 ${
            feedback.type === 'success'
              ? 'bg-emerald-100/70 border border-emerald-300 text-emerald-900'
              : 'bg-red-100 border border-red-300 text-red-800'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
          )}
          <span>{feedback.msg}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="grid sm:grid-cols-3 gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => openDeleteModal('products')}
          className="border-red-300 text-red-700 hover:bg-red-100/60 rounded-xl text-xs h-10 font-semibold"
        >
          <Trash2 className="w-3.5 h-3.5 mr-1.5" />
          Hapus Semua Produk
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => openDeleteModal('events')}
          className="border-red-300 text-red-700 hover:bg-red-100/60 rounded-xl text-xs h-10 font-semibold"
        >
          <Trash2 className="w-3.5 h-3.5 mr-1.5" />
          Hapus Semua Acara
        </Button>

        <Button
          type="button"
          onClick={() => openDeleteModal('all')}
          className="bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs h-10 font-bold shadow-sm"
        >
          <Trash2 className="w-3.5 h-3.5 mr-1.5" />
          Hapus Seluruh Data Dummy
        </Button>
      </div>

      {/* Confirmation Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-red-600 font-bold text-base">
                <AlertTriangle className="w-5 h-5" />
                Konfirmasi Penghapusan Permanen
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 rounded-lg p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-xs text-red-800 leading-relaxed">
              <p className="font-semibold mb-1">
                Anda akan menghapus: <span className="underline">{getTargetTitle()}</span>
              </p>
              Tindakan ini tidak dapat dibatalkan (irreversible). Semua dokumen yang dipilih akan dihapus secara permanen dari server Firestore Desa Dlemer.
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Ketik kata <span className="text-red-600 font-extrabold">&quot;HAPUS&quot;</span> untuk mengonfirmasi:
              </label>
              <input
                type="text"
                value={confirmationInput}
                onChange={(e) => setConfirmationInput(e.target.value)}
                placeholder="HAPUS"
                className="w-full px-3.5 py-2.5 border border-red-300 rounded-xl text-sm font-bold tracking-wider focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setModalOpen(false)}
                className="rounded-xl text-xs h-10 px-4"
              >
                Batal
              </Button>
              <Button
                disabled={confirmationInput !== 'HAPUS' || loading}
                onClick={executeDelete}
                className="bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs h-10 px-5 font-bold disabled:opacity-40"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menghapus...
                  </>
                ) : (
                  'Ya, Hapus Sekarang'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
