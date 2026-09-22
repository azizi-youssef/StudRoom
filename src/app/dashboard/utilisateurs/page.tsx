'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { clientAdminService } from '@/client/services/admin.service';
import { DbUser, UserRole, UserStatus } from '@/shared/types/database';
import {
  Users,
  Shield,
  ShieldAlert,
  Search,
  Filter,
  CheckCircle2,
  Ban,
  Clock,
  Mail,
  Phone,
  UserCheck,
  AlertTriangle,
  Loader2,
  Lock,
  Unlock,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

const ROLE_BADGES: Record<UserRole, { label: string; badge: string }> = {
  admin: { label: 'Administrateur', badge: 'bg-rose-950/80 text-rose-400 border-rose-800/80' },
  landlord: { label: 'Propriétaire / Bailleur', badge: 'bg-amber-950/80 text-amber-400 border-amber-800/80' },
  student: { label: 'Étudiant', badge: 'bg-primary-950/80 text-primary-400 border-primary-800/80' },
};

const STATUS_BADGES: Record<UserStatus, { label: string; badge: string }> = {
  ACTIVE: { label: 'Actif', badge: 'bg-emerald-950/80 text-emerald-400 border-emerald-800/80' },
  SUSPENDED: { label: 'Suspendu', badge: 'bg-amber-950/80 text-amber-400 border-amber-800/80' },
  BLOCKED: { label: 'Bloqué', badge: 'bg-rose-950/80 text-rose-400 border-rose-800/80' },
};

const PAGE_SIZE = 20;

export default function AdminUtilisateursPage() {
  const [users, setUsers] = useState<DbUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [roleConfirm, setRoleConfirm] = useState<{ userId: string; newRole: UserRole; label: string } | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await clientAdminService.getUsers(
        roleFilter === 'all' ? undefined : roleFilter,
        statusFilter === 'all' ? undefined : statusFilter
      );
      if (res.success && res.data) {
        setUsers(res.data);
      }
    } catch (err) {
      console.error('[Utilisateurs] Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  }, [roleFilter, statusFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleStatusUpdate = async (userId: string, newStatus: UserStatus) => {
    setActionLoadingId(userId);
    setFeedbackMsg(null);
    try {
      const res = await clientAdminService.updateUserStatus(userId, newStatus);
      if (res.success && res.data) {
        setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u)));
        setFeedbackMsg({ type: 'success', message: `Statut mis à jour vers ${newStatus}.` });
      } else {
        setFeedbackMsg({ type: 'error', message: res.error?.message || 'Action non autorisée.' });
      }
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', message: err.message || 'Erreur serveur.' });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRoleUpdate = async (userId: string, newRole: UserRole) => {
    const roleLabel = newRole === 'admin' ? 'Administrateur' : newRole === 'landlord' ? 'Bailleur' : 'Étudiant';
    setRoleConfirm({ userId, newRole, label: roleLabel });
  };

  const executeRoleUpdate = async () => {
    if (!roleConfirm) return;
    const { userId, newRole } = roleConfirm;
    setRoleConfirm(null);
    setActionLoadingId(userId);
    setFeedbackMsg(null);
    try {
      const res = await clientAdminService.updateUserRole(userId, newRole);
      if (res.success && res.data) {
        setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
        setFeedbackMsg({ type: 'success', message: `Rôle mis à jour vers ${newRole}.` });
      } else {
        setFeedbackMsg({ type: 'error', message: res.error?.message || 'Impossible de changer le rôle.' });
      }
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', message: err.message || 'Erreur serveur.' });
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      `${u.full_name || ''} ${u.email || ''} ${u.phone || ''}`.toLowerCase().includes(term);
    return matchesSearch;
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // Reset to page 1 when filters change
  const handleSearchChange = (v: string) => { setSearchTerm(v); setCurrentPage(1); };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* ConfirmDialog — Changement de rôle */}
      <ConfirmDialog
        open={!!roleConfirm}
        title="Changer le rôle utilisateur"
        description={`Confirmer le changement de rôle vers « ${roleConfirm?.label} » ? Cette action modifie immédiatement les permissions de l'utilisateur.`}
        confirmLabel="Confirmer le changement"
        variant="warning"
        onConfirm={executeRoleUpdate}
        onCancel={() => setRoleConfirm(null)}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-1">
            <Link href="/dashboard" className="hover:text-primary-400 transition-colors text-xs">
              Tableau de bord
            </Link>
            <span>/</span>
            <span className="text-primary-400 font-medium text-xs">Utilisateurs & Droits</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-950/80 border border-primary-800/80 flex items-center justify-center text-primary-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Gestion des Utilisateurs</h1>
              <p className="text-xs text-slate-400">
                Administration des comptes (étudiants, bailleurs, administrateurs), contrôle RBAC et suspension de sécurité.
              </p>
            </div>
          </div>
        </div>

        <Button
          onClick={fetchUsers}
          variant="outline"
          className="flex items-center gap-2 px-3 py-2 text-xs border-slate-800 text-slate-300 hover:bg-slate-800"
        >
          Actualiser
        </Button>
      </div>

      {feedbackMsg && (
        <div
          className={`p-3 text-xs rounded-xl border flex items-center justify-between ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-950/70 border-emerald-800 text-emerald-300'
              : 'bg-rose-950/70 border-rose-800 text-rose-300'
          }`}
        >
          <span>{feedbackMsg.message}</span>
          <button onClick={() => setFeedbackMsg(null)} className="p-1 hover:opacity-75">
            ✕
          </button>
        </div>
      )}

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative min-w-[280px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Rechercher par nom, email, téléphone..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-primary-500"
          />
        </div>

        {/* Filter dropdowns */}
        <div className="flex items-center gap-3">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-primary-500"
          >
            <option value="all">Tous les rôles</option>
            <option value="student">Étudiants</option>
            <option value="landlord">Bailleurs</option>
            <option value="admin">Administrateurs</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-primary-500"
          >
            <option value="all">Tous les statuts</option>
            <option value="ACTIVE">Actifs</option>
            <option value="SUSPENDED">Suspendus</option>
            <option value="BLOCKED">Bloqués</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Utilisateur</th>
                <th className="py-3.5 px-4">Rôle</th>
                <th className="py-3.5 px-4">Statut</th>
                <th className="py-3.5 px-4">Inscrit le</th>
                <th className="py-3.5 px-4 text-right">Actions de Sécurité</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-800" />
                      <div className="flex flex-col gap-1.5">
                        <div className="h-3 w-28 bg-slate-800 rounded" />
                        <div className="h-2 w-40 bg-slate-800/60 rounded" />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4"><div className="h-5 w-20 bg-slate-800 rounded-lg" /></td>
                  <td className="py-3 px-4"><div className="h-5 w-16 bg-slate-800 rounded-lg" /></td>
                  <td className="py-3 px-4"><div className="h-3 w-24 bg-slate-800/60 rounded" /></td>
                  <td className="py-3 px-4"><div className="h-7 w-32 bg-slate-800 rounded-xl ml-auto" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 border border-slate-800/60 rounded-2xl">
          <Users className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-300">Aucun utilisateur trouvé</p>
          <p className="text-xs text-slate-500 mt-1">Ajustez vos filtres de recherche.</p>
        </div>
      ) : (
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">Utilisateur</th>
                  <th className="py-3.5 px-4">Rôle</th>
                  <th className="py-3.5 px-4">Statut</th>
                  <th className="py-3.5 px-4">Inscrit le</th>
                  <th className="py-3.5 px-4 text-right">Actions de Sécurité</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {paginatedUsers.map((u) => {
                  const roleMeta = ROLE_BADGES[u.role] || { label: u.role, badge: 'bg-slate-800 text-slate-400' };
                  const statusMeta =
                    STATUS_BADGES[u.status as UserStatus] || { label: u.status, badge: 'bg-slate-800 text-slate-400' };

                  return (
                    <tr key={u.id} className="hover:bg-slate-800/30 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-200">
                            {u.full_name?.[0] || 'U'}
                          </div>
                          <div>
                            <div className="font-semibold text-white">
                              {u.full_name || 'Utilisateur sans nom'}
                            </div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                              <span>{u.email}</span>
                              {u.phone && <span>• {u.phone}</span>}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg border ${roleMeta.badge}`}>
                          {roleMeta.label}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg border ${statusMeta.badge}`}>
                          {statusMeta.label}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                        {new Date(u.created_at).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Status toggle */}
                          {u.status === 'ACTIVE' ? (
                            <button
                              disabled={actionLoadingId === u.id}
                              onClick={() => handleStatusUpdate(u.id, 'SUSPENDED')}
                              className="px-2 py-1 text-[11px] font-medium rounded-lg bg-amber-950/40 text-amber-400 border border-amber-800/60 hover:bg-amber-900/50 transition flex items-center gap-1 disabled:opacity-50"
                              title="Suspendre le compte"
                            >
                              <Lock className="w-3 h-3" />
                              Suspendre
                            </button>
                          ) : (
                            <button
                              disabled={actionLoadingId === u.id}
                              onClick={() => handleStatusUpdate(u.id, 'ACTIVE')}
                              className="px-2 py-1 text-[11px] font-medium rounded-lg bg-emerald-950/40 text-emerald-400 border border-emerald-800/60 hover:bg-emerald-900/50 transition flex items-center gap-1 disabled:opacity-50"
                              title="Réactiver le compte"
                            >
                              <Unlock className="w-3 h-3" />
                              Réactiver
                            </button>
                          )}

                          {/* Role Selector */}
                          <select
                            disabled={actionLoadingId === u.id}
                            value={u.role}
                            onChange={(e) => handleRoleUpdate(u.id, e.target.value as UserRole)}
                            className="bg-slate-950 border border-slate-700 text-slate-300 text-[11px] rounded-lg px-2 py-1 focus:outline-none focus:border-primary-500 disabled:opacity-50"
                          >
                            <option value="student">Étudiant</option>
                            <option value="landlord">Bailleur</option>
                            <option value="admin">Admin</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-slate-800/60 bg-slate-950/40">
              <span className="text-[11px] text-slate-400">
                {filteredUsers.length} utilisateur{filteredUsers.length > 1 ? 's' : ''} • Page {currentPage}/{totalPages}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Page précédente"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                  .reduce<(number | '...')[]>((acc, p, idx, arr) => {
                    if (idx > 0 && (p as number) - (arr[idx - 1] as number) > 1) acc.push('...');
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, i) =>
                    p === '...' ? (
                      <span key={`ellipsis-${i}`} className="px-1.5 text-slate-500 text-[11px]">…</span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setCurrentPage(p as number)}
                        className={`w-7 h-7 rounded-lg text-[11px] font-semibold transition-colors ${
                          currentPage === p
                            ? 'bg-[var(--action-primary)] text-white'
                            : 'border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600'
                        }`}
                      >
                        {p}
                      </button>
                    )
                  )}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Page suivante"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
