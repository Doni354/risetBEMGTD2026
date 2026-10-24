'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { VillageProfile, AdminUser } from '@/lib/types';
import { Button } from '@/components/ui/button';
import VillageProfileForm from '@/components/admin/village-profile-form';
import ProductManagement from '@/components/admin/product-management';
import EventManagement from '@/components/admin/event-management';
import DashboardStats from '@/components/admin/dashboard-stats';
import RbacManagement from '@/components/admin/rbac-management';
import DangerZone from '@/components/admin/danger-zone';
import {
  Loader2, LogOut, LayoutDashboard, ShoppingBag, MapPin, ShieldAlert,
  CalendarDays, ChevronRight, Menu, X, ShieldCheck, Crown, ExternalLink,
  Smartphone
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Module = 'dashboard' | 'products' | 'events' | 'profile' | 'rbac';

interface NavItem {
  id: Module;
  label: string;
  icon: React.FC<{ className?: string }>;
  superAdminOnly?: boolean;
}

const ALL_NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'products', label: 'Produk UMKM', icon: ShoppingBag },
  { id: 'events', label: 'Acara Desa', icon: CalendarDays },
  { id: 'profile', label: 'Profil Desa', icon: MapPin },
  { id: 'rbac', label: 'Manajemen Role (RBAC)', icon: ShieldCheck, superAdminOnly: true },
];

export default function AdminPage() {
  const { user, loading: authLoading, idToken, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [userData, setUserData] = useState<AdminUser | null>(null);
  const [adminId, setAdminId] = useState('');
  const [villageProfile, setVillageProfile] = useState<VillageProfile | null>(null);
  const [activeModule, setActiveModule] = useState<Module>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) { router.push('/login'); return; }

    const verifyAccess = async () => {
      if (!idToken) return;
      try {
        const verifyRes = await fetch('/api/verify-admin', {
          headers: { Authorization: `Bearer ${idToken}` },
        });

        if (verifyRes.ok) {
          const data = await verifyRes.json();
          setIsAdmin(data.isAdmin || false);
          setIsSuperAdmin(data.isSuperAdmin || false);
          setUserData(data.user || null);
          setAdminId(data.user?.id || user?.uid || '');

          if (data.isAdmin) {
            const profileRes = await fetch('/api/village-profile');
            if (profileRes.ok) setVillageProfile(await profileRes.json());
          }
        }
      } catch (error) {
        console.error('Admin verification failed:', error);
      } finally {
        setLoading(false);
      }
    };

    verifyAccess();
  }, [authLoading, isAuthenticated, idToken, router, user]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const visibleNavItems = ALL_NAV_ITEMS.filter((item) => {
    if (item.superAdminOnly) {
      return isSuperAdmin;
    }
    return true;
  });

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-9 h-9 text-[#1B4332] animate-spin" />
          <p className="text-gray-500 text-sm font-medium">Memverifikasi hak akses...</p>
        </div>
      </div>
    );
  }

  // If user is logged in but has role 'user' (not yet approved as admin/moderator)
  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 px-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-lg w-full text-center border border-gray-100 space-y-6">
          <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto border border-amber-200">
            <ShieldAlert className="w-8 h-8 text-amber-600" />
          </div>

          <div>
            <span className="text-xs font-bold px-3 py-1 bg-amber-100 text-amber-800 rounded-full">
              Role: Pengguna (User)
            </span>
            <h1 className="text-2xl font-bold text-gray-900 mt-3">Akses Panel Admin Dibatasi</h1>
            <p className="text-gray-600 text-sm mt-2 leading-relaxed">
              Halo, <span className="font-semibold text-gray-900">{user?.displayName || user?.email}</span>. Akun Anda berhasil terdaftar di sistem Desa Dlemer. Sesuai kebijakan keamanan, setiap akun baru memiliki role awal sebagai <b>User</b>.
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 text-xs text-gray-500 text-left border border-gray-100 space-y-1.5">
            <p className="font-semibold text-gray-700">Ingin Mengelola Konten Desa?</p>
            <p>
              Silakan hubungi Super Administrator (<b>doni.smpn1@gmail.com</b>) agar akun Anda dapat dipromosikan menjadi <b>Admin</b> melalui Modul RBAC.
            </p>
            <p className="text-gray-400 pt-1">
              Untuk pengajuan produk UMKM & acara oleh warga biasa, silakan gunakan aplikasi mobile resmi Desa Dlemer.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Button variant="outline" onClick={handleLogout} className="rounded-xl">
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
            <Link href="/">
              <Button className="w-full sm:w-auto bg-[#1B4332] hover:bg-[#1B4332]/90 rounded-xl">
                Kembali ke Beranda Desa
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const activeNav = ALL_NAV_ITEMS.find((n) => n.id === activeModule);

  return (
    <div className="min-h-screen bg-gray-50/70 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full z-50 w-64 bg-[#1B4332] flex flex-col transition-transform duration-300 shadow-xl
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:z-auto
      `}>
        {/* Logo / Brand */}
        <div className="px-5 py-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center font-black text-amber-400 border border-white/10">
                DD
              </div>
              <div>
                <h1 className="text-white font-bold text-sm leading-tight">Admin Desa Dlemer</h1>
                <p className="text-white/50 text-xs">Kwanyar · Bangkalan</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white/60 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* User Card */}
        <div className="px-4 py-3 border-b border-white/10 bg-black/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold text-white overflow-hidden">
              {userData?.photoURL ? (
                <img src={userData.photoURL} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span>{(user?.displayName || user?.email || 'A')[0].toUpperCase()}</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white text-xs font-semibold truncate">{user?.displayName || user?.email}</p>
              {isSuperAdmin ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-300">
                  <Crown className="w-3 h-3 text-amber-300" /> Super Admin
                </span>
              ) : (
                <span className="text-[10px] text-white/50 font-medium">Administrator</span>
              )}
            </div>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {visibleNavItems.map(({ id, label, icon: Icon, superAdminOnly }) => {
            const isActive = activeModule === id;
            return (
              <button
                key={id}
                onClick={() => { setActiveModule(id); setSidebarOpen(false); }}
                className={`
                  w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all text-left
                  ${isActive
                    ? 'bg-white/20 text-white font-semibold shadow-sm'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }
                `}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${superAdminOnly ? 'text-amber-300' : ''}`} />
                <span className="flex-1 truncate">{label}</span>
                {superAdminOnly && (
                  <span className="text-[10px] bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded font-bold">
                    Super
                  </span>
                )}
                {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-60" />}
              </button>
            );
          })}
        </nav>

        {/* Footer shortcuts */}
        <div className="px-3 py-3 border-t border-white/10 space-y-1">
          <Link
            href="/app"
            target="_blank"
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-white/60 hover:bg-white/10 hover:text-white text-xs transition-all"
          >
            <Smartphone className="w-3.5 h-3.5 text-[#C9A84C]" /> Unduh App Warga
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-red-300 hover:bg-red-500/20 text-xs font-semibold transition-all"
          >
            <LogOut className="w-4 h-4" /> Keluar (Logout)
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Bar - sticky with high z-index to avoid preview overflow */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200/80 px-4 lg:px-8 py-3.5 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-1.5 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Admin</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-900 font-semibold">{activeNav?.label}</span>
          </div>

          <div className="ml-auto flex items-center gap-3">
            {isSuperAdmin && (
              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/15 to-purple-500/15 text-purple-900 border border-purple-200/60">
                <Crown className="w-3.5 h-3.5 text-amber-500" /> Super Admin
              </span>
            )}
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-[#1B4332] px-3 py-1.5 rounded-xl hover:bg-gray-100 transition"
            >
              Lihat Portal Publik <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 max-w-6xl w-full mx-auto space-y-6">
          {activeModule === 'dashboard' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Dashboard Utama</h2>
                <p className="text-sm text-gray-500 mt-0.5">Ringkasan aktivitas dan permohonan data desa</p>
              </div>

              {/* Statistics */}
              <DashboardStats idToken={idToken} key={refreshKey} />

              {/* Danger Zone: Delete All Data (Only for Super Admin) */}
              {isSuperAdmin && (
                <div className="pt-4">
                  <DangerZone
                    idToken={idToken}
                    onDataCleared={() => setRefreshKey((k) => k + 1)}
                  />
                </div>
              )}
            </div>
          )}

          {activeModule === 'products' && (
            <ProductManagement
              idToken={idToken}
              adminId={adminId}
              isSuperAdmin={isSuperAdmin}
            />
          )}

          {activeModule === 'events' && (
            <EventManagement
              idToken={idToken}
              adminId={adminId}
              isSuperAdmin={isSuperAdmin}
            />
          )}

          {activeModule === 'profile' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Profil & Potensi Desa</h2>
                <p className="text-sm text-gray-500 mt-0.5">Informasi profil yang ditampilkan di halaman beranda</p>
              </div>
              {villageProfile ? (
                <VillageProfileForm
                  initialData={villageProfile}
                  idToken={idToken}
                  onSuccess={() => {}}
                />
              ) : (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">
                  <p className="text-sm">Data profil desa sedang dimuat atau belum tersedia.</p>
                </div>
              )}
            </div>
          )}

          {activeModule === 'rbac' && isSuperAdmin && (
            <RbacManagement
              idToken={idToken}
              currentUserEmail={user?.email || ''}
            />
          )}
        </main>
      </div>
    </div>
  );
}
