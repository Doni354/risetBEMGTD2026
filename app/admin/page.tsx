'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { VillageProfile } from '@/lib/types';
import { Button } from '@/components/ui/button';
import VillageProfileForm from '@/components/admin/village-profile-form';
import ProductManagement from '@/components/admin/product-management';
import EventManagement from '@/components/admin/event-management';
import DashboardStats from '@/components/admin/dashboard-stats';
import {
  Loader2, LogOut, LayoutDashboard, ShoppingBag, MapPin, ShieldAlert,
  CalendarDays, ChevronRight, Menu, X
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Module = 'dashboard' | 'products' | 'events' | 'profile';

const NAV_ITEMS: { id: Module; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'products', label: 'Produk', icon: ShoppingBag },
  { id: 'events', label: 'Acara', icon: CalendarDays },
  { id: 'profile', label: 'Profil Desa', icon: MapPin },
];

export default function AdminPage() {
  const { user, loading: authLoading, idToken, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminId, setAdminId] = useState('');
  const [villageProfile, setVillageProfile] = useState<VillageProfile | null>(null);
  const [activeModule, setActiveModule] = useState<Module>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) { router.push('/login'); return; }

    const verifyAdmin = async () => {
      if (!idToken) return;
      try {
        const verifyRes = await fetch('/api/verify-admin', {
          headers: { Authorization: `Bearer ${idToken}` },
        });
        if (verifyRes.ok) {
          const adminData = await verifyRes.json();
          setIsAdmin(true);
          setAdminId(adminData.uid || user?.uid || '');

          const profileRes = await fetch('/api/village-profile');
          if (profileRes.ok) setVillageProfile(await profileRes.json());
        }
      } catch (error) {
        console.error('Admin verification failed:', error);
      } finally {
        setLoading(false);
      }
    };
    verifyAdmin();
  }, [authLoading, isAuthenticated, idToken, router, user]);

  const handleLogout = async () => { await logout(); router.push('/'); };

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
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={handleLogout}>Logout</Button>
            <Link href="/"><Button>Kembali ke Beranda</Button></Link>
          </div>
        </div>
      </div>
    );
  }

  const activeNav = NAV_ITEMS.find((n) => n.id === activeModule);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full z-30 w-64 bg-[#1B4332] flex flex-col transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        {/* Logo / Brand */}
        <div className="px-5 py-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-white font-bold text-base leading-tight">Admin Panel</h1>
              <p className="text-white/50 text-xs mt-0.5">CMS Desa</p>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/60 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => { setActiveModule(id); setSidebarOpen(false); }}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left
                ${activeModule === id
                  ? 'bg-white/15 text-white'
                  : 'text-white/60 hover:bg-white/10 hover:text-white'
                }
              `}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
              {activeModule === id && <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-60" />}
            </button>
          ))}
        </nav>

        {/* User + Logout */}
        <div className="px-3 py-4 border-t border-white/10">
          <div className="px-3 py-2 mb-2">
            <p className="text-white text-sm font-medium truncate">{user?.displayName || user?.email}</p>
            <p className="text-white/40 text-xs truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-white/60 hover:bg-white/10 hover:text-white text-sm transition-all"
          >
            <LogOut className="w-4 h-4" />Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Bar */}
        <header className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 lg:px-8 py-4 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500 hover:text-gray-700">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Admin</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-900 font-medium">{activeNav?.label}</span>
          </div>
          <div className="ml-auto">
            <Link href="/" className="text-sm text-gray-400 hover:text-gray-700 transition">
              Lihat Situs →
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 max-w-5xl w-full mx-auto">
          {activeModule === 'dashboard' && (
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-gray-900">Dashboard</h2>
              <p className="text-sm text-gray-500 mb-6">Ringkasan aktivitas CMS Desa</p>
              <DashboardStats idToken={idToken} />
            </div>
          )}

          {activeModule === 'products' && (
            <ProductManagement idToken={idToken} adminId={adminId} />
          )}

          {activeModule === 'events' && (
            <EventManagement idToken={idToken} adminId={adminId} />
          )}

          {activeModule === 'profile' && (
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-gray-900">Profil Desa</h2>
              <p className="text-sm text-gray-500 mb-6">Informasi desa yang ditampilkan ke publik</p>
              {villageProfile ? (
                <VillageProfileForm
                  initialData={villageProfile}
                  idToken={idToken}
                  onSuccess={() => {}}
                />
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <p className="text-sm">Data profil desa tidak tersedia.</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
