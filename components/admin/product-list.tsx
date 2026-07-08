'use client';

import { useState } from 'react';
import { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Trash2, Edit2, Loader2, ShieldOff } from 'lucide-react';

interface ProductListProps {
  products: Product[];
  idToken: string | null;
  adminId: string; // uid of the logged-in admin
  onDelete: (productId: string) => void;
  onEdit: (product: Product) => void;
  onApprove?: (product: Product) => void;
  showApprovalButton?: boolean;
}

export default function ProductList({
  products, idToken, adminId, onDelete, onEdit, onApprove, showApprovalButton,
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

  const isOwnedByAdmin = (product: Product) => product.createdBy === adminId;

  if (products.length === 0) {
    return <div className="text-center py-12 text-gray-400 text-sm">Tidak ada produk</div>;
  }

  return (
    <div className="space-y-3">
      {products.map((product) => {
        const fb = feedback?.id === product.id ? feedback : null;
        const owned = isOwnedByAdmin(product);

        return (
          <div key={product.id} className="bg-white border border-gray-100 rounded-2xl p-4 flex items-start gap-4 hover:shadow-sm transition-shadow">
            {/* Image */}
            <div className="flex-shrink-0">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} className="w-16 h-16 rounded-xl object-cover" />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center text-2xl">🛍️</div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-2 flex-wrap">
                <h3 className="font-semibold text-gray-900 text-sm truncate">{product.name}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${owned ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'}`}>
                  {owned ? '👤 Admin' : '🏘️ Warga'}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">{product.category}</p>
              <p className="text-sm font-semibold text-gray-800 mt-1">Rp {product.price.toLocaleString('id-ID')}</p>
              <p className="text-xs text-gray-400">Stok: {product.stock}</p>

              {/* Feedback */}
              {fb && (
                <div className={`mt-2 text-xs px-2 py-1 rounded-lg ${fb.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                  {fb.msg}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 flex-shrink-0">
              {showApprovalButton && !product.approved && (
                <Button size="sm" variant="outline" onClick={() => handleApprove(product)} disabled={approvingId === product.id} className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 text-xs h-8">
                  {approvingId === product.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3 mr-1" />}
                  Setujui
                </Button>
              )}

              <Button
                size="sm"
                variant="outline"
                onClick={() => onEdit(product)}
                disabled={!owned}
                title={owned ? 'Edit produk' : 'Tidak bisa edit data warga'}
                className={`text-xs h-8 ${!owned ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                {owned ? <Edit2 className="w-3 h-3 mr-1" /> : <ShieldOff className="w-3 h-3 mr-1" />}
                Edit
              </Button>

              <Button size="sm" variant="outline" onClick={() => handleDelete(product)} disabled={deletingId === product.id} className="text-red-500 border-red-200 hover:bg-red-50 text-xs h-8">
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
