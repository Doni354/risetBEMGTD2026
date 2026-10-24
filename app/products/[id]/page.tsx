import { Metadata } from 'next';
import { adminDb } from '@/lib/firebase/admin';
import { Product } from '@/lib/types';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { ShoppingBag, ArrowLeft, MessageCircle, PackageOpen } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const doc = await adminDb.collection('products').doc(resolvedParams.id).get();
  if (!doc.exists) return { title: 'Produk Tidak Ditemukan' };
  const data = doc.data() as Product;
  
  return {
    title: `${data.name} | Produk Desa`,
    description: data.description,
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  // 1. Fetch main product
  const doc = await adminDb.collection('products').doc(resolvedParams.id).get();
  if (!doc.exists) notFound();
  
  const product = doc.data() as Product;
  
  if (!product.approved) {
    // Hide unapproved products from public
    notFound();
  }

  // 2. Fetch related products
  let relatedProducts: Product[] = [];
  try {
    const relatedSnap = await adminDb.collection('products')
      .where('approved', '==', true)
      .where('category', '==', product.category)
      .limit(4)
      .get();
      
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let fetchedRelated = relatedSnap.docs.map((d: any) => d.data() as Product);
    fetchedRelated = fetchedRelated.filter((p: Product) => p.id !== product.id); // exclude current
    
    // Sort in code (or use created timestamp if available, here we just show what we got)
    relatedProducts = fetchedRelated.slice(0, 3);
  } catch (error) {
    console.error('Error fetching related products:', error);
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Cover / Hero */}
        <div className="bg-[#1B4332] py-16 px-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="max-w-6xl mx-auto relative z-10 text-center">
            <Link href="/products" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors text-sm font-medium">
              <ArrowLeft className="w-4 h-4" /> Katalog Produk
            </Link>
          </div>
        </div>

        {/* Content Area */}
        <div className="max-w-6xl mx-auto px-4 -mt-8 relative z-10">
          <div className="bg-white rounded-3xl p-6 md:p-10 shadow-lg border border-gray-100 mb-16 flex flex-col md:flex-row gap-10">
            
            {/* Left: Image */}
            <div className="w-full md:w-1/2 flex-shrink-0">
               <div className="rounded-2xl overflow-hidden bg-gray-100 border border-gray-100 aspect-square relative">
                 {product.imageUrl ? (
                   <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center bg-[#1B4332]/5">
                     <ShoppingBag className="w-16 h-16 text-[#1B4332]/20" />
                   </div>
                 )}
               </div>
            </div>

            {/* Right: Info */}
            <div className="w-full md:w-1/2 flex flex-col">
               <div className="mb-6">
                 <span className="px-3 py-1 bg-[#1B4332]/10 text-[#1B4332] rounded-full text-xs font-bold tracking-wide uppercase inline-block mb-4">
                   {product.category}
                 </span>
                 <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
                 <p className="text-3xl font-extrabold text-[#C9A84C] mb-6">
                   Rp {product.price.toLocaleString('id-ID')}
                 </p>
                 
                 <div className="flex items-center gap-4 py-4 border-y border-gray-100 mb-6">
                   <div className="flex items-center gap-2 text-sm text-gray-600">
                     <PackageOpen className="w-5 h-5 text-gray-400" />
                     Sisa Stok: <span className="font-bold text-gray-900">{product.stock} pcs</span>
                   </div>
                 </div>
                 
                 <div className="prose prose-sm text-gray-600">
                   <h3 className="font-bold text-gray-900 text-lg mb-2">Deskripsi Produk</h3>
                   <p className="leading-relaxed whitespace-pre-wrap">{product.description}</p>
                 </div>
               </div>

               <div className="mt-auto pt-8">
                 {product.stock > 0 ? (
                   <a
                     href={product.whatsappLink}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="w-full flex items-center justify-center gap-2 py-4 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition shadow-md hover:shadow-lg"
                   >
                     <MessageCircle className="w-5 h-5" />
                     Beli via WhatsApp
                   </a>
                 ) : (
                   <button disabled className="w-full py-4 bg-gray-200 text-gray-500 rounded-xl font-bold cursor-not-allowed">
                     Stok Habis
                   </button>
                 )}
               </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mb-16">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Produk Pilihan Lainnya</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedProducts.map((rel) => (
                  <Link
                    href={`/products/${rel.id}`}
                    key={rel.id}
                    className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-all group relative block"
                  >
                    {rel.imageUrl && (
                      <div className="h-52 overflow-hidden">
                        <img
                          src={rel.imageUrl}
                          alt={rel.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-gray-900 group-hover:text-[#1B4332] transition-colors">{rel.name}</h3>
                      </div>
                      <p className="text-xl font-bold text-[#1B4332] mt-4">
                        Rp {rel.price.toLocaleString('id-ID')}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
