'use client';

import { useEffect, useState } from 'react';
import { Product, VillageEvent } from '@/lib/types';
import { ShoppingBag, CalendarDays, Clock, CheckCircle2, Users, TrendingUp } from 'lucide-react';

interface DashboardStatsProps {
  idToken: string | null;
}

interface Stats {
  totalProducts: number;
  pendingProducts: number;
  approvedProducts: number;
  totalEvents: number;
  pendingEvents: number;
  approvedEvents: number;
}

export default function DashboardStats({ idToken }: DashboardStatsProps) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [pendingProducts, setPendingProducts] = useState<Product[]>([]);
  const [pendingEvents, setPendingEvents] = useState<VillageEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!idToken) return;
    const fetchData = async () => {
      try {
        const [prodRes, evtRes] = await Promise.all([
          fetch('/api/products?page=1&limit=100', { headers: { Authorization: `Bearer ${idToken}` } }),
          fetch('/api/events', { headers: { Authorization: `Bearer ${idToken}` } }),
        ]);
        const prodData = prodRes.ok ? await prodRes.json() : { products: [] };
        const evtData = evtRes.ok ? await evtRes.json() : { events: [] };

        const products: Product[] = prodData.products || [];
        const events: VillageEvent[] = evtData.events || [];

        const pendingP = products.filter((p) => !p.approved);
        const pendingE = events.filter((e) => !e.approved);

        setStats({
          totalProducts: products.length,
          pendingProducts: pendingP.length,
          approvedProducts: products.filter((p) => p.approved).length,
          totalEvents: events.length,
          pendingEvents: pendingE.length,
          approvedEvents: events.filter((e) => e.approved).length,
        });
        setPendingProducts(pendingP.slice(0, 5));
        setPendingEvents(pendingE.slice(0, 5));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [idToken]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 animate-pulse">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-28 bg-gray-100 rounded-2xl" />
        ))}
      </div>
    );
  }

  const cards = [
    { label: 'Total Produk', value: stats?.totalProducts ?? 0, icon: ShoppingBag, color: 'bg-emerald-50 text-emerald-600', accent: 'border-emerald-100' },
    { label: 'Produk Pending', value: stats?.pendingProducts ?? 0, icon: Clock, color: 'bg-amber-50 text-amber-600', accent: 'border-amber-100' },
    { label: 'Produk Disetujui', value: stats?.approvedProducts ?? 0, icon: CheckCircle2, color: 'bg-blue-50 text-blue-600', accent: 'border-blue-100' },
    { label: 'Total Acara', value: stats?.totalEvents ?? 0, icon: CalendarDays, color: 'bg-purple-50 text-purple-600', accent: 'border-purple-100' },
    { label: 'Acara Pending', value: stats?.pendingEvents ?? 0, icon: TrendingUp, color: 'bg-rose-50 text-rose-600', accent: 'border-rose-100' },
    { label: 'Acara Disetujui', value: stats?.approvedEvents ?? 0, icon: Users, color: 'bg-teal-50 text-teal-600', accent: 'border-teal-100' },
  ];

  return (
    <div className="space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className={`bg-white border ${card.accent} rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{card.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{card.value}</p>
                </div>
                <div className={`${card.color} p-2.5 rounded-xl`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pending Tables */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Pending Products */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-semibold text-gray-800">Produk Menunggu Persetujuan</h3>
            {(stats?.pendingProducts ?? 0) > 0 && (
              <span className="ml-auto bg-amber-100 text-amber-700 text-xs font-medium px-2 py-0.5 rounded-full">
                {stats?.pendingProducts}
              </span>
            )}
          </div>
          <div className="divide-y divide-gray-50">
            {pendingProducts.length === 0 ? (
              <p className="px-5 py-6 text-sm text-gray-400 text-center">Tidak ada produk pending ✓</p>
            ) : (
              pendingProducts.map((p) => {
                const cover = (Array.isArray(p.images) && p.images[0]) || p.imageUrl;
                return (
                <div key={p.id} className="px-5 py-3 flex items-center gap-3">
                  {cover ? (
                    <img src={cover} alt={p.name} className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <ShoppingBag className="w-4 h-4 text-gray-300" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-800 truncate">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.category} · Rp {p.price.toLocaleString('id-ID')}</p>
                  </div>
                  <span className="text-xs bg-amber-50 text-amber-600 px-2 py-1 rounded-lg flex-shrink-0">Pending</span>
                </div>
                );
              })
            )}
          </div>
        </div>

        {/* Pending Events */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-purple-500" />
            <h3 className="text-sm font-semibold text-gray-800">Acara Menunggu Persetujuan</h3>
            {(stats?.pendingEvents ?? 0) > 0 && (
              <span className="ml-auto bg-purple-100 text-purple-700 text-xs font-medium px-2 py-0.5 rounded-full">
                {stats?.pendingEvents}
              </span>
            )}
          </div>
          <div className="divide-y divide-gray-50">
            {pendingEvents.length === 0 ? (
              <p className="px-5 py-6 text-sm text-gray-400 text-center">Tidak ada acara pending ✓</p>
            ) : (
              pendingEvents.map((e) => {
                const cover = (Array.isArray(e.images) && e.images[0]) || e.imageUrl;
                return (
                <div key={e.id} className="px-5 py-3 flex items-center gap-3">
                  {cover ? (
                    <img src={cover} alt={e.title} className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                      <CalendarDays className="w-4 h-4 text-purple-400" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-800 truncate">{e.title}</p>
                    <p className="text-xs text-gray-400">{e.category} · {e.organizer}</p>
                  </div>
                  <span className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded-lg flex-shrink-0">Pending</span>
                </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
