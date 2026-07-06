'use client';

import { useState } from 'react';
import { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Trash2, Edit2, Loader2 } from 'lucide-react';

interface ProductListProps {
  products: Product[];
  idToken: string | null;
  onDelete: (productId: string) => void;
  onEdit: (product: Product) => void;
  showApprovalButton?: boolean;
}

export default function ProductList({
  products,
  idToken,
  onDelete,
  onEdit,
  showApprovalButton,
}: ProductListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [approvingId, setApprovingId] = useState<string | null>(null);

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    if (!idToken) return;

    try {
      setDeletingId(productId);
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${idToken}`,
        },
      });

      if (response.ok) {
        onDelete(productId);
      } else {
        alert('Failed to delete product');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('An error occurred while deleting');
    } finally {
      setDeletingId(null);
    }
  };

  const handleApprove = async (product: Product) => {
    if (!idToken) return;

    try {
      setApprovingId(product.id);
      const response = await fetch(`/api/products/${product.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          approved: true,
        }),
      });

      if (response.ok) {
        // Update local state
        onEdit({
          ...product,
          approved: true,
          approvedAt: Date.now(),
        });
      } else {
        alert('Failed to approve product');
      }
    } catch (error) {
      console.error('Approve error:', error);
      alert('An error occurred while approving');
    } finally {
      setApprovingId(null);
    }
  };

  return (
    <div className="space-y-3">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white border border-border rounded-lg p-4 flex items-start justify-between hover:shadow-sm transition"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-3">
              {product.imageUrl && (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-16 h-16 rounded object-cover flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate">
                  {product.name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {product.category}
                </p>
                <p className="text-sm text-foreground font-medium mt-1">
                  Rp {product.price.toLocaleString('id-ID')}
                </p>
                <div className="text-xs text-muted-foreground mt-1">
                  Stock: {product.stock}
                </div>
                {!product.approved && (
                  <span className="inline-block mt-2 text-xs bg-yellow-50 text-yellow-700 px-2 py-1 rounded">
                    Pending Approval
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 ml-4 flex-shrink-0">
            {showApprovalButton && !product.approved && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleApprove(product)}
                disabled={approvingId === product.id}
                className="text-green-600 border-green-200 hover:bg-green-50"
              >
                {approvingId === product.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                <span className="ml-1">Approve</span>
              </Button>
            )}

            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(product)}
            >
              <Edit2 className="w-4 h-4" />
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => handleDelete(product.id)}
              disabled={deletingId === product.id}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              {deletingId === product.id ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
