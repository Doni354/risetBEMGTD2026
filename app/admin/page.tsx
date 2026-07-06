'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { VillageProfile } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import VillageProfileForm from '@/components/admin/village-profile-form';
import ProductManagement from '@/components/admin/product-management';
import { Loader2, LogOut, LayoutDashboard, ShoppingBag, MapPin, ShieldAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

/**
 * Admin Dashboard Page
 * Flow:
 * 1. Cek auth state via useAuth hook
 * 2. Jika belum login → redirect ke /login
 * 3. Jika sudah login → verifikasi admin status via API
 * 4. Jika bukan admin → tampilkan Access Denied
 * 5. Jika admin → tampilkan dashboard tabs
 */
export default function AdminPage() {
  const { user, loading: authLoading, idToken, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [villageProfile, setVillageProfile] = useState<VillageProfile | null>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const verifyAdmin = async () => {
      if (!idToken) return;
      try {
        const verifyRes = await fetch('/api/verify-admin', {
          headers: { 'Authorization': `Bearer ${idToken}` },
        });
        
        if (verifyRes.ok) {
          setIsAdmin(true);
          
          // Only fetch profile if user is verified admin
          const profileRes = await fetch('/api/village-profile');
          if (profileRes.ok) {
            const profile = await profileRes.json();
            setVillageProfile(profile);
          }
        }
      } catch (error) {
        console.error('Admin verification failed:', error);
      } finally {
        setLoading(false);
      }
    };

    verifyAdmin();
  }, [authLoading, isAuthenticated, idToken, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  // Loading state
  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#1B4332] animate-spin" />
          <p className="text-gray-500 text-sm">Memverifikasi akses...</p>
        </div>
      </div>
    );
  }

  // Access Denied
  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center border border-gray-100">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Akses Ditolak</h1>
          <p className="text-gray-500 text-sm mb-6">
            Akun Google Anda ({user?.email}) tidak terdaftar sebagai administrator desa.
            Hubungi admin untuk mendapatkan akses.
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={handleLogout}>Logout</Button>
            <Link href="/">
              <Button>Kembali ke Beranda</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar-style header */}
      <header className="bg-[#1B4332] text-white">
        <div className="max-w-6xl mx-auto px-4 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="w-6 h-6" />
            <div>
              <h1 className="text-lg font-bold">Admin Dashboard</h1>
              <p className="text-white/70 text-xs">{user?.displayName || user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-white/70 hover:text-white text-sm transition">
              Lihat Situs →
            </Link>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="text-white border-white/30 hover:bg-white/10 bg-transparent"
            >
              <LogOut className="w-4 h-4 mr-1" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 h-12 bg-white border border-gray-200 rounded-xl p-1">
            <TabsTrigger value="profile" className="rounded-lg data-[state=active]:bg-[#1B4332] data-[state=active]:text-white flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Profil Desa
            </TabsTrigger>
            <TabsTrigger value="products" className="rounded-lg data-[state=active]:bg-[#1B4332] data-[state=active]:text-white flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              Produk
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            {villageProfile && (
              <VillageProfileForm
                initialData={villageProfile}
                idToken={idToken}
                onSuccess={() => alert('Profil berhasil diperbarui!')}
              />
            )}
          </TabsContent>

          <TabsContent value="products" className="space-y-4">
            <ProductManagement idToken={idToken} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
