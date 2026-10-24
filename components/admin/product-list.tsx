'use client';

import { useState } from 'react';
import { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Trash2, Edit2, Loader2, ShieldOff, MessageCircle } from 'lucide-react';

interface ProductListProps {
  products: Product[];
  idToken: string | null;
  adminId: string; // uid of the logged-in admin
  isSuperAdmin?: boolean;
  onDelete: (productId: string) => void;
  onEdit: (product: Product) => void;
  onApprove?: (product: Product) => void;
  showApprovalButton?: boolean;
}

function cleanDisplayPhone(link?: string): string {
  if (!link) return '';
  const match = link.match(/(?:wa\.me\/|phone=)(\+?[0-9]+)/);
  if (match) {
    let num = match[1].replace(/^\+/, '');
    if (num.startsWith('62')) {
      num = '0' + num.slice(2);
    }
    return num;
  }
  return link.replace(/^https?:\/\/(?:www\.)?wa\.me\//, '');
}

export default function ProductList({
  products, idToken, adminId, isSuperAdmin, onDelete, onEdit, onApprove, showApprovalButton,
}: ProductListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ id: string; type: 'success' | 'error'; msg: string } | null>(null);

  const showFeedback = (id: string, type: 'success' | 'error', msg: string) => {
    setFeedback({ id, type, msg });
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleDelete = async (product: Product) => {
    if (!confirm(`Hapus "${product.name}"? Tindakan ini tidak dapat dibatalkan.`)) return;
    if (!idToken) return;
    try {
      setDeletingId(product.id);
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${idToken}` },
      });
      if (res.ok) {
        showFeedback(product.id, 'success', 'Produk dihapus');
        setTimeout(() => onDelete(product.id), 800);
      } else {
        showFeedback(product.id, 'error', 'Gagal menghapus');
      }
    } catch {
      showFeedback(product.id, 'error', 'Terjadi kesalahan');
    } finally {
      setDeletingId(null);
    }
  };

  const handleApprove = async (product: Product) => {
    if (!idToken) return;
    try {
      setApprovingId(product.id);
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` },
        body: JSON.stringify({ approved: true }),
      });
      if (res.ok) {
        showFeedback(product.id, 'success', 'Produk disetujui!');
        onApprove?.({ ...product, approved: true, approvedAt: Date.now() });
      } else {
        showFeedback(product.id, 'error', 'Gagal menyetujui');
      }
    } catch {
      showFeedback(product.id, 'error', 'Terjadi kesalahan');
    } finally {
      setApprovingId(null);
    }
  };

  const isEditable = (product: Product) => isSuperAdmin || product.createdBy === adminId;

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">
        <p className="text-base font-semibold text-gray-700">Belum ada produk</p>
        <p className="text-xs text-gray-400 mt-1">Produk yang ditambahkan akan muncul di sini.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {products.map((product) => {
        const fb = feedback?.id === product.id ? feedback : null;
        const canEdit = isEditable(product);
        const ownedByCurrent = product.createdBy === adminId;
        const phoneDisplay = cleanDisplayPhone(product.whatsappLink);

        return (
          <div key={product.id} className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col sm:flex-row items-start gap-4 hover:shadow-md transition-all">
            {/* Image */}
            <div className="flex-shrink-0">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} className="w-20 h-20 rounded-xl object-cover border border-gray-100" />
              ) : (
                <div className="w-20 h-20 rounded-xl bg-gray-100 flex items-center justify-center text-2xl">🛍️</div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-gray-900 text-sm truncate">{product.name}</h3>
                <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold flex-shrink-0 ${ownedByCurrent ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'}`}>
                  {ownedByCurrent ? '👤 Admin' : '🏘️ Warga'}
                </span>
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${product.approved ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                  {product.approved ? '✓ Tayang' : '⏳ Menunggu Persetujuan'}
                </span>
              </div>

              <p className="text-xs text-gray-500 mt-0.5">{product.category}</p>
              
              <div className="flex items-center gap-4 mt-1.5 flex-wrap">
                <p className="text-sm font-bold text-emerald-800">Rp {product.price.toLocaleString('id-ID')}</p>
                <p className="text-xs text-gray-400">Stok: {product.stock} unit</p>
                
                {product.whatsappLink && (
                  <a
                    href={product.whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-md font-medium transition"
                    title="Buka WhatsApp"
                  >
                    <MessageCircle className="w-3 h-3" />
                    <span>WA: {phoneDisplay || 'Hubungi'}</span>
                  </a>
                )}
              </div>

              {/* Feedback */}
              {fb && (
                <div className={`mt-2 text-xs px-2.5 py-1 rounded-lg ${fb.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                  {fb.msg}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex sm:flex-col gap-2 flex-shrink-0 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
              {showApprovalButton && !product.approved && (
                <Button size="sm" variant="outline" onClick={() => handleApprove(product)} disabled={approvingId === product.id} className="text-emerald-700 border-emerald-200 hover:bg-emerald-50 text-xs h-8">
                  {approvingId === product.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3 mr-1" />}
                  Setujui
                </Button>
              )}

              <Button
                size="sm"
                variant="outline"
                onClick={() => onEdit(product)}
                disabled={!canEdit}
                title={canEdit ? 'Edit produk' : 'Hanya pemilik atau Super Admin yang bisa edit'}
                className={`text-xs h-8 ${!canEdit ? 'opacity-40 cursor-not-allowed' : 'hover:border-gray-300'}`}
              >
                {canEdit ? <Edit2 className="w-3 h-3 mr-1" /> : <ShieldOff className="w-3 h-3 mr-1" />}
                Edit
              </Button>

              <Button size="sm" variant="outline" onClick={() => handleDelete(product)} disabled={deletingId === product.id} className="text-red-600 border-red-200 hover:bg-red-50 text-xs h-8">
                {deletingId === product.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3 mr-1" />}
                Hapus
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
