'use client';

import { useState } from 'react';
import { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

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

export default function ProductForm({
  idToken,
  initialData,
  onSuccess,
  onCancel,
}: ProductFormProps) {
  const [formData, setFormData] = useState<Partial<Product>>(
    initialData || {
      name: '',
      description: '',
      price: 0,
      category: 'Other',
      stock: 0,
      whatsappLink: '',
      imageUrl: '',
    }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!idToken) {
      setError('Authentication required');
      return;
    }

    // Validate required fields
    if (
      !formData.name ||
      !formData.description ||
      !formData.price ||
      !formData.category ||
      !formData.whatsappLink
    ) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const method = initialData ? 'PATCH' : 'POST';
      const url = initialData
        ? `/api/products/${initialData.id}`
        : '/api/products';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save product');
      }

      const result = await response.json();

      // If creating new product, include the returned product data
      if (!initialData && result.product) {
        onSuccess(result.product);
      } else if (initialData) {
        onSuccess({
          ...initialData,
          ...formData,
        } as Product);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-border p-6 space-y-4">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Product Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name || ''}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Product name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Category *
          </label>
          <select
            name="category"
            value={formData.category || 'Other'}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Price (Rp) *
          </label>
          <input
            type="number"
            name="price"
            value={formData.price || 0}
            onChange={handleChange}
            min="0"
            required
            className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Stock
          </label>
          <input
            type="number"
            name="stock"
            value={formData.stock || 0}
            onChange={handleChange}
            min="0"
            className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="0"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Description *
        </label>
        <textarea
          name="description"
          value={formData.description || ''}
          onChange={handleChange}
          required
          rows={4}
          className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Product description"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          WhatsApp Link *
        </label>
        <input
          type="url"
          name="whatsappLink"
          value={formData.whatsappLink || ''}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="https://wa.me/62..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Image URL
        </label>
        <input
          type="url"
          name="imageUrl"
          value={formData.imageUrl || ''}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="https://example.com/product.jpg"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3 justify-end pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            initialData ? 'Update Product' : 'Add Product'
          )}
        </Button>
      </div>
    </form>
  );
}
