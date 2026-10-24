'use client';

import { useState } from 'react';
import { VillageEvent } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Trash2, Edit2, Loader2, ShieldOff, CalendarDays, MapPin } from 'lucide-react';

interface EventListProps {
  events: VillageEvent[];
  idToken: string | null;
  adminId: string;
  isSuperAdmin?: boolean;
  onDelete: (id: string) => void;
  onEdit: (event: VillageEvent) => void;
  onApprove?: (event: VillageEvent) => void;
  showApprovalButton?: boolean;
}

export default function EventList({
  events, idToken, adminId, isSuperAdmin, onDelete, onEdit, onApprove, showApprovalButton,
}: EventListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ id: string; type: 'success' | 'error'; msg: string } | null>(null);

  const showFeedback = (id: string, type: 'success' | 'error', msg: string) => {
    setFeedback({ id, type, msg });
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleDelete = async (event: VillageEvent) => {
    if (!confirm(`Hapus acara "${event.title}"?`)) return;
    if (!idToken) return;
    try {
      setDeletingId(event.id);
      const res = await fetch(`/api/events/${event.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${idToken}` },
      });
      if (res.ok) {
        showFeedback(event.id, 'success', 'Acara dihapus');
        setTimeout(() => onDelete(event.id), 800);
      } else {
        showFeedback(event.id, 'error', 'Gagal menghapus');
      }
    } catch {
      showFeedback(event.id, 'error', 'Terjadi kesalahan');
    } finally {
      setDeletingId(null);
    }
  };

  const handleApprove = async (event: VillageEvent) => {
    if (!idToken) return;
    try {
      setApprovingId(event.id);
      const res = await fetch(`/api/events/${event.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` },
        body: JSON.stringify({ approved: true }),
      });
      if (res.ok) {
        showFeedback(event.id, 'success', 'Acara disetujui!');
        onApprove?.({ ...event, approved: true, approvedAt: Date.now() });
      } else {
        showFeedback(event.id, 'error', 'Gagal menyetujui');
      }
    } catch {
      showFeedback(event.id, 'error', 'Terjadi kesalahan');
    } finally {
      setApprovingId(null);
    }
  };

  const formatDate = (ts: number) =>
    new Date(ts).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  const isOwned = (e: VillageEvent) => isSuperAdmin || e.createdBy === adminId;

  if (events.length === 0) {
    return <div className="text-center py-12 text-gray-400 text-sm">Tidak ada acara</div>;
  }

  return (
    <div className="space-y-3">
      {events.map((event) => {
        const fb = feedback?.id === event.id ? feedback : null;
        const owned = isOwned(event);

        return (
          <div key={event.id} className="bg-white border border-gray-100 rounded-2xl p-4 flex items-start gap-4 hover:shadow-sm transition-shadow">
            {/* Image / Icon */}
            <div className="flex-shrink-0">
              {event.imageUrl ? (
                <img src={event.imageUrl} alt={event.title} className="w-16 h-16 rounded-xl object-cover" />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-purple-50 flex items-center justify-center">
                  <CalendarDays className="w-7 h-7 text-purple-300" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-2 flex-wrap">
                <h3 className="font-semibold text-gray-900 text-sm">{event.title}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${owned ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'}`}>
                  {owned ? '👤 Admin' : '🏘️ Warga'}
                </span>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{event.category}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                <CalendarDays className="w-3 h-3" />
                <span>{formatDate(event.date)}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                <MapPin className="w-3 h-3" />
                <span className="truncate">{event.location}</span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">Oleh: {event.organizer}</p>

              {fb && (
                <div className={`mt-2 text-xs px-2 py-1 rounded-lg ${fb.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                  {fb.msg}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 flex-shrink-0">
              {showApprovalButton && !event.approved && (
                <Button size="sm" variant="outline" onClick={() => handleApprove(event)} disabled={approvingId === event.id} className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 text-xs h-8">
                  {approvingId === event.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3 mr-1" />}
                  Setujui
                </Button>
              )}
              <Button size="sm" variant="outline" onClick={() => onEdit(event)} disabled={!owned} title={owned ? 'Edit acara' : 'Tidak bisa edit data warga'} className={`text-xs h-8 ${!owned ? 'opacity-40 cursor-not-allowed' : ''}`}>
                {owned ? <Edit2 className="w-3 h-3 mr-1" /> : <ShieldOff className="w-3 h-3 mr-1" />}
                Edit
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleDelete(event)} disabled={deletingId === event.id} className="text-red-500 border-red-200 hover:bg-red-50 text-xs h-8">
                {deletingId === event.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3 mr-1" />}
                Hapus
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
