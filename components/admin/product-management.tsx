'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductForm from './product-form';
import ProductList from './product-list';
import { Plus } from 'lucide-react';

interface ProductManagementProps {
  idToken: string | null;
}

export default function ProductManagement({ idToken }: ProductManagementProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch products for admin (both approved and pending)
  useEffect(() => {
    const fetchProducts = async () => {
      if (!idToken) return;

      try {
        setLoading(true);
        const response = await fetch('/api/products?page=1&limit=100', {
          headers: {
            'Authorization': `Bearer ${idToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProducts(data.products);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [idToken]);

  const handleProductSaved = (newProduct: Product) => {
    if (selectedProduct) {
      setProducts(products.map((p) => (p.id === newProduct.id ? newProduct : p)));
    } else {
      setProducts([newProduct, ...products]);
    }
    setShowForm(false);
    setSelectedProduct(null);
  };

  const handleProductDeleted = (productId: string) => {
    setProducts(products.filter((p) => p.id !== productId));
  };

  const approvedProducts = products.filter((p) => p.approved);
  const pendingProducts = products.filter((p) => !p.approved);

  return (
    <div className="space-y-6">
      {/* Header and Add Product Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Manajemen Produk</h2>
        {!showForm && (
          <Button
            onClick={() => {
              setShowForm(true);
              setSelectedProduct(null);
            }}
            className="bg-[#1B4332] text-white hover:bg-[#1B4332]/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            + Tambah Produk
          </Button>
        )}
      </div>

      {/* Product Form */}
      {showForm && (
        <ProductForm
          idToken={idToken}
          initialData={selectedProduct || undefined}
          onSuccess={handleProductSaved}
          onCancel={() => {
            setShowForm(false);
            setSelectedProduct(null);
          }}
        />
      )}

      {/* Product Lists */}
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-xl h-12 mb-6">
          <TabsTrigger value="pending" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Menunggu Persetujuan ({pendingProducts.length})
          </TabsTrigger>
          <TabsTrigger value="approved" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Disetujui ({approvedProducts.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingProducts.length > 0 ? (
            <ProductList
              products={pendingProducts}
              idToken={idToken}
              onDelete={handleProductDeleted}
              onEdit={(product) => {
                setSelectedProduct(product);
                setShowForm(true);
              }}
              showApprovalButton
            />
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No pending products
            </div>
          )}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          {approvedProducts.length > 0 ? (
            <ProductList
              products={approvedProducts}
              idToken={idToken}
              onDelete={handleProductDeleted}
              onEdit={(product) => {
                setSelectedProduct(product);
                setShowForm(true);
              }}
            />
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No approved products
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
