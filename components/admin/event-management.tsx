'use client';

import { useState, useEffect } from 'react';
import { VillageEvent } from '@/lib/types';
import { Button } from '@/components/ui/button';
import EventForm from './event-form';
import EventList from './event-list';
import { Plus, CalendarDays } from 'lucide-react';

interface EventManagementProps {
  idToken: string | null;
  adminId: string;
}

export default function EventManagement({ idToken, adminId }: EventManagementProps) {
  const [events, setEvents] = useState<VillageEvent[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<VillageEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved'>('pending');

  useEffect(() => {
    if (!idToken) return;
    const fetch_ = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/events', { headers: { Authorization: `Bearer ${idToken}` } });
        if (res.ok) {
          const data = await res.json();
          setEvents(data.events || []);
        }
      } finally {
        setLoading(false);
      }
    };
    fetch_();
  }, [idToken]);

  const handleSaved = (evt: VillageEvent) => {
    setEvents((prev) => selectedEvent ? prev.map((e) => e.id === evt.id ? evt : e) : [evt, ...prev]);
    setShowForm(false);
    setSelectedEvent(null);
  };

  const handleDeleted = (id: string) => setEvents((prev) => prev.filter((e) => e.id !== id));

  const handleApproved = (evt: VillageEvent) => setEvents((prev) => prev.map((e) => e.id === evt.id ? evt : e));

  const pending = events.filter((e) => !e.approved);
  const approved = events.filter((e) => e.approved);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Manajemen Acara</h2>
          <p className="text-xs text-gray-400 mt-0.5">{events.length} acara terdaftar</p>
        </div>
        {!showForm && (
          <Button onClick={() => { setShowForm(true); setSelectedEvent(null); }} className="bg-[#1B4332] text-white hover:bg-[#1B4332]/90">
            <Plus className="w-4 h-4 mr-1.5" />
            Tambah Acara
          </Button>
        )}
      </div>

      {showForm && (
        <EventForm
          idToken={idToken}
          initialData={selectedEvent || undefined}
          onSuccess={handleSaved}
          onCancel={() => { setShowForm(false); setSelectedEvent(null); }}
        />
      )}

      {/* Stat mini */}
      {!loading && (
        <div className="flex gap-3">
          <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-2 flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-semibold text-amber-700">{pending.length}</span>
            <span className="text-xs text-amber-500">Pending</span>
          </div>
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2 flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-emerald-500" />
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
        <EventList
          events={activeTab === 'pending' ? pending : approved}
          idToken={idToken}
          adminId={adminId}
          onDelete={handleDeleted}
          onEdit={(e) => { setSelectedEvent(e); setShowForm(true); }}
          onApprove={handleApproved}
          showApprovalButton={activeTab === 'pending'}
        />
      )}
    </div>
  );
}
