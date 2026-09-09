'use client';

import Link from 'next/link';

import { useEffect, useState } from 'react';
import { Product } from '@/lib/types';
import { MessageCircle, ShoppingBag } from 'lucide-react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

interface ProductsResponse {
  products: Product[];
  page: number;
  hasMore: boolean;
  pageSize: number;
}

/**
 * Marketplace Produk Desa
 * Menampilkan katalog produk yang di-approve admin.
 * Mendukung filter kategori dan pagination.
 */
export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/products?page=${page}`);
        const data: ProductsResponse = await response.json();

        if (page === 1) {
          setProducts(data.products);
        } else {
          setProducts((prev) => [...prev, ...data.products]);
        }
        setHasMore(data.hasMore);

        const uniqueCategories = Array.from(
          new Set(data.products.map((p) => p.category))
        );
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page]);

  const filteredProducts =
    selectedCategory === 'all'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Header */}
        <section className="bg-[#1B4332] text-white py-16 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <span className="text-[#C9A84C] font-semibold text-sm tracking-wider uppercase">Marketplace</span>
            <h1 className="text-3xl md:text-4xl font-bold mt-2">Produk Desa Dlemer</h1>
            <p className="text-white/60 mt-3 max-w-lg mx-auto text-sm">
              Dukung ekonomi warga dengan membeli produk lokal berkualitas langsung dari desa
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            {/* Category Filter */}
            {categories.length > 0 && (
              <div className="mb-8 flex flex-wrap gap-2">
                <button
                  onClick={() => { setSelectedCategory('all'); setPage(1); }}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                    selectedCategory === 'all'
                      ? 'bg-[#1B4332] text-white'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-[#1B4332]/30'
                  }`}
                >
                  Semua Produk
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setSelectedCategory(cat); setPage(1); }}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                      selectedCategory === cat
                        ? 'bg-[#1B4332] text-white'
                        : 'bg-white text-gray-600 border border-gray-200 hover:border-[#1B4332]/30'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            {/* Products Grid */}
            {loading && products.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-8 h-8 border-2 border-[#1B4332] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-gray-500 mt-4 text-sm">Memuat produk...</p>
              </div>
            ) : filteredProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {filteredProducts.map((product) => (
                    <Link
                      href={`/products/${product.id}`}
                      key={product.id}
                      className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-all group relative block"
                    >
                      {product.imageUrl && (
                        <div className="h-52 overflow-hidden">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <div className="p-5">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-bold text-gray-900 group-hover:text-[#1B4332] transition-colors">{product.name}</h3>
                            <span className="text-xs text-[#1B4332] bg-[#1B4332]/5 px-2 py-0.5 rounded-full font-medium inline-block mt-1">
                              {product.category}
                            </span>
                          </div>
                          {product.stock === 0 && (
                            <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded-lg">
                              Habis
                            </span>
                          )}
                        </div>
                        <p className="text-gray-500 text-sm line-clamp-2 my-3">{product.description}</p>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xl font-bold text-[#1B4332]">
                              Rp {product.price.toLocaleString('id-ID')}
                            </p>
                            {product.stock > 0 && (
                              <p className="text-xs text-gray-400">Stok: {product.stock}</p>
                            )}
                          </div>
                          <button
                            onClick={(e) => { 
                              e.preventDefault(); 
                              e.stopPropagation();
                              if (product.stock > 0) window.open(product.whatsappLink, '_blank'); 
                            }}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition z-10 relative ${
                              product.stock > 0
                                ? 'bg-green-600 text-white hover:bg-green-700'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                          >
                            <MessageCircle className="w-4 h-4" />
                            Pesan
                          </button>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {hasMore && (
                  <div className="flex justify-center">
                    <button
                      onClick={() => setPage((prev) => prev + 1)}
                      disabled={loading}
                      className="px-8 py-3 bg-[#1B4332] text-white rounded-xl font-semibold hover:bg-[#1B4332]/90 transition disabled:opacity-50 text-sm"
                    >
                      {loading ? 'Memuat...' : 'Muat Lebih Banyak'}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Belum Ada Produk</h3>
                <p className="text-gray-500 text-sm">
                  Belum ada produk tersedia dalam kategori ini. Cek kembali nanti!
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
