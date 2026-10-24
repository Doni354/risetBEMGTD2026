'use client';

import { useState, useEffect } from 'react';
import { AdminUser, UserRole } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  ShieldCheck, Shield, UserCheck, Users, Search, RefreshCw,
  Loader2, Crown, CheckCircle2, AlertTriangle, Lock
} from 'lucide-react';

interface RbacManagementProps {
  idToken: string | null;
  currentUserEmail?: string;
}

const ROLE_OPTIONS: { role: UserRole; label: string; desc: string }[] = [
  { role: 'user', label: 'User (Warga)', desc: 'Hanya akses publik/pengajuan via app, tidak dapat akses admin panel' },
  { role: 'moderator', label: 'Moderator', desc: 'Dapat memoderasi & menyetujui produk dan acara warga' },
  { role: 'admin', label: 'Admin Desa', desc: 'Akses penuh kelola produk, acara, dan profil desa' },
  { role: 'superadmin', label: 'Super Admin', desc: 'Akses mutlak termasuk modul RBAC dan pembersihan data' },
];

export default function RbacManagement({ idToken, currentUserEmail }: RbacManagementProps) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const fetchUsers = async () => {
    if (!idToken) return;
    try {
      setLoading(true);
      const res = await fetch('/api/admin/users', {
        headers: { Authorization: `Bearer ${idToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      } else {
        const d = await res.json();
        setFeedback({ msg: d.error || 'Gagal memuat daftar user', type: 'error' });
      }
    } catch {
      setFeedback({ msg: 'Terjadi kesalahan jaringan', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [idToken]);

  const handleRoleChange = async (userId: string, targetEmail: string, newRole: UserRole) => {
    if (!idToken) return;

    if (targetEmail.toLowerCase() === 'doni.smpn1@gmail.com' && newRole !== 'superadmin') {
      alert('Akun Super Admin doni.smpn1@gmail.com tidak dapat diubah rolenya.');
      return;
    }

    try {
      setUpdatingId(userId);
      setFeedback(null);

      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Gagal mengubah role');
      }

      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );

      setFeedback({
        msg: `Role untuk ${targetEmail} berhasil diubah menjadi "${newRole.toUpperCase()}"!`,
        type: 'success',
      });
      setTimeout(() => setFeedback(null), 4000);
    } catch (err) {
      setFeedback({
        msg: err instanceof Error ? err.message : 'Gagal mengubah role',
        type: 'error',
      });
    } finally {
      setUpdatingId(null);
    }
  };

  // Filter & Search
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.displayName || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'superadmin':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-purple-500/20 text-purple-900 border border-purple-200">
            <Crown className="w-3.5 h-3.5 text-amber-500" />
            Super Admin
          </span>
        );
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Admin Desa
          </span>
        );
      case 'moderator':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
            <Shield className="w-3.5 h-3.5 text-blue-600" />
            Moderator
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 border border-gray-200">
            <UserCheck className="w-3.5 h-3.5 text-gray-400" />
            User (Warga)
          </span>
        );
    }
  };

  const formatDate = (ts?: number) => {
    if (!ts) return '-';
    return new Date(ts).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#1B4332] to-[#2D6A4F] text-white rounded-3xl p-6 shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/15 px-3 py-1 rounded-full text-xs font-semibold text-amber-300 mb-2">
              <Crown className="w-3.5 h-3.5" /> Khusus Akun: doni.smpn1@gmail.com
            </div>
            <h2 className="text-xl md:text-2xl font-bold">Modul Manajemen Hak Akses (RBAC)</h2>
            <p className="text-white/70 text-xs md:text-sm mt-1 max-w-xl">
              Setiap user yang login via Google otomatis memiliki hak akses awal sebagai <b>User</b>. Anda sebagai Super Admin dapat mengubah role pengguna di bawah ini menjadi <b>Admin</b>, <b>Moderator</b>, atau <b>User</b>.
            </p>
          </div>
          <Button
            onClick={fetchUsers}
            variant="outline"
            size="sm"
            disabled={loading}
            className="bg-white/10 hover:bg-white/20 text-white border-white/20 self-start md:self-auto rounded-xl"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Feedback Toast */}
      {feedback && (
        <div
          className={`px-4 py-3 rounded-2xl text-sm flex items-center gap-2 transition-all ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
          )}
          <span>{feedback.msg}</span>
        </div>
      )}

      {/* Filters & Search */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex flex-col sm:flex-row items-center gap-3 justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama atau email user..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 focus:border-[#1B4332] bg-gray-50/50"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-gray-500 font-medium">Filter Role:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 focus:border-[#1B4332] bg-white text-gray-700"
          >
            <option value="all">Semua Role ({users.length})</option>
            <option value="superadmin">Super Admin ({users.filter((u) => u.role === 'superadmin').length})</option>
            <option value="admin">Admin ({users.filter((u) => u.role === 'admin').length})</option>
            <option value="moderator">Moderator ({users.filter((u) => u.role === 'moderator').length})</option>
            <option value="user">User ({users.filter((u) => u.role === 'user').length})</option>
          </select>
        </div>
      </div>

      {/* Users List */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">
          <Users className="w-10 h-10 mx-auto text-gray-300 mb-2" />
          <p className="text-sm font-medium text-gray-600">Tidak ada user ditemukan</p>
          <p className="text-xs text-gray-400 mt-1">Coba sesuaikan kata kunci pencarian atau filter.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredUsers.map((user) => {
            const isProtected = user.email.toLowerCase() === 'doni.smpn1@gmail.com';
            const isSelf = user.email.toLowerCase() === (currentUserEmail || '').toLowerCase();
            const isUpdating = updatingId === user.id;

            return (
              <div
                key={user.id}
                className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* User Info */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-[#1B4332]/10 border border-[#1B4332]/15 flex items-center justify-center flex-shrink-0 overflow-hidden font-bold text-[#1B4332]">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
                    ) : (
                      <span>{(user.displayName || user.email || 'U')[0].toUpperCase()}</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-bold text-gray-900 text-sm truncate">
                        {user.displayName || 'Pengguna'}
                      </p>
                      {isSelf && (
                        <span className="text-[10px] font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                          Akun Anda
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    <div className="flex items-center gap-3 text-[11px] text-gray-400 mt-1">
                      <span>Terdaftar: {formatDate(user.createdAt)}</span>
                      <span>·</span>
                      <span>Login: {formatDate(user.lastLogin)}</span>
                    </div>
                  </div>
                </div>

                {/* Role Status & Selector */}
                <div className="flex items-center gap-3 self-end md:self-auto flex-wrap">
                  <div>{getRoleBadge(user.role)}</div>

                  {isProtected ? (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-xl text-xs text-gray-400 font-medium border border-gray-100">
                      <Lock className="w-3.5 h-3.5" />
                      Terkunci (Super Admin)
                    </div>
                  ) : (
                    <div className="relative">
                      <select
                        disabled={isUpdating}
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, user.email, e.target.value as UserRole)}
                        className="text-xs font-semibold px-3 py-2 border border-gray-200 rounded-xl bg-gray-50 hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 focus:border-[#1B4332] text-gray-800 transition disabled:opacity-50 cursor-pointer"
                      >
                        {ROLE_OPTIONS.map((opt) => (
                          <option key={opt.role} value={opt.role}>
                            Ubah ke: {opt.label}
                          </option>
                        ))}
                      </select>
                      {isUpdating && (
                        <div className="absolute inset-0 bg-white/70 rounded-xl flex items-center justify-center">
                          <Loader2 className="w-3.5 h-3.5 text-[#1B4332] animate-spin" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
