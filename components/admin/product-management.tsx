'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import ProductForm from './product-form';
import ProductList from './product-list';
import { Plus, ShoppingBag } from 'lucide-react';

interface ProductManagementProps {
  idToken: string | null;
  adminId: string;
  isSuperAdmin?: boolean;
}

export default function ProductManagement({ idToken, adminId, isSuperAdmin }: ProductManagementProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved'>('pending');

  useEffect(() => {
    if (!idToken) return;
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/products?page=1&limit=100', {
          headers: { Authorization: `Bearer ${idToken}` },
        });
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products || []);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [idToken]);

  const handleSaved = (p: Product) => {
    setProducts((prev) => selectedProduct ? prev.map((x) => x.id === p.id ? p : x) : [p, ...prev]);
    setShowForm(false);
    setSelectedProduct(null);
  };

  const handleDeleted = (id: string) => setProducts((prev) => prev.filter((p) => p.id !== id));
  const handleApproved = (p: Product) => setProducts((prev) => prev.map((x) => x.id === p.id ? p : x));

  const pending = products.filter((p) => !p.approved);
  const approved = products.filter((p) => p.approved);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Manajemen Produk</h2>
          <p className="text-xs text-gray-400 mt-0.5">{products.length} produk terdaftar</p>
        </div>
        {!showForm && (
          <Button onClick={() => { setShowForm(true); setSelectedProduct(null); }} className="bg-[#1B4332] text-white hover:bg-[#1B4332]/90">
            <Plus className="w-4 h-4 mr-1.5" />
            Tambah Produk
          </Button>
        )}
      </div>

      {showForm && (
        <ProductForm
          idToken={idToken}
          initialData={selectedProduct || undefined}
          onSuccess={handleSaved}
          onCancel={() => { setShowForm(false); setSelectedProduct(null); }}
        />
      )}

      {/* Stat mini */}
      {!loading && (
        <div className="flex gap-3">
          <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-2 flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-semibold text-amber-700">{pending.length}</span>
            <span className="text-xs text-amber-500">Pending</span>
          </div>
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2 flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-semibold text-emerald-700">{approved.length}</span>
            <span className="text-xs text-emerald-500">Disetujui</span>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {(['pending', 'approved'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {tab === 'pending' ? `Menunggu (${pending.length})` : `Disetujui (${approved.length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[...Array(3)].map((_, i) => <div key={i} className="h-24 bg-gray-100 rounded-2xl" />)}
        </div>
      ) : (
        <ProductList
          products={activeTab === 'pending' ? pending : approved}
          idToken={idToken}
          adminId={adminId}
          isSuperAdmin={isSuperAdmin}
          onDelete={handleDeleted}
          onEdit={(p) => { setSelectedProduct(p); setShowForm(true); }}
          onApprove={handleApproved}
          showApprovalButton={activeTab === 'pending'}
        />
      )}
    </div>
  );
}
