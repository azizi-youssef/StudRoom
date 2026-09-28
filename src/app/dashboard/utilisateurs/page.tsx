'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { clientAdminService } from '@/client/services/admin.service';
import { DbUser, UserRole, UserStatus } from '@/shared/types/database';
import {
  Users,
  Search,
  Lock,
  Unlock,
  ChevronLeft,
  ChevronRight,
  Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

const ROLE_BADGES: Record<UserRole, { label: string; badgeClass: string }> = {
  admin: { label: 'Administrateur', badgeClass: 'badge-danger' },
  landlord: { label: 'Propriétaire / Bailleur', badgeClass: 'badge-warning' },
  student: { label: 'Étudiant', badgeClass: 'badge-primary' },
};

const STATUS_BADGES: Record<UserStatus, { label: string; badgeClass: string }> = {
  ACTIVE: { label: 'Actif', badgeClass: 'badge-success' },
  SUSPENDED: { label: 'Suspendu', badgeClass: 'badge-warning' },
  BLOCKED: { label: 'Bloqué', badgeClass: 'badge-danger' },
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

  const handleSearchChange = (v: string) => {
    setSearchTerm(v);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ConfirmDialog — Changement de rôle */}
      <ConfirmDialog
        open={!!roleConfirm}
        title="Changer le rôle utilisateur"
        description={`Confirmer le changement de rôle vers « ${roleConfirm?.label} » ? Cette action modifie immédiatement les permissions de l'utilisateur.`}
        confirmLabel="Confirmer le changement"
        variant="warning"
        onConfirm={executeRoleUpdate}
        onCancel={() => setRoleConfirm(null)}
      />

      {/* Header */}
      <div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        <div>
          <div className="flex items-center gap-2 text-xs mb-1.5" style={{ color: 'var(--text-muted)' }}>
            <Link href="/dashboard" className="hover:underline transition-colors">
              Tableau de bord
            </Link>
            <span>/</span>
            <span className="font-medium" style={{ color: 'var(--brand-primary)' }}>
              Utilisateurs & Droits
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{
                backgroundColor: 'var(--brand-bg)',
                border: '1px solid var(--brand-bg-strong)',
                color: 'var(--brand-primary)',
              }}
            >
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                Gestion des Utilisateurs
              </h1>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                Administration des comptes (étudiants, bailleurs, administrateurs), contrôle RBAC et suspension de sécurité.
              </p>
            </div>
          </div>
        </div>

        <Button
          onClick={fetchUsers}
          variant="outline"
          className="dash-card flex items-center gap-2 px-3.5 py-2 text-xs font-medium self-start sm:self-center"
          style={{ color: 'var(--text-primary)' }}
        >
          Actualiser
        </Button>
      </div>

      {feedbackMsg && (
        <div
          className="p-3 text-xs rounded-xl border flex items-center justify-between"
          style={{
            backgroundColor: feedbackMsg.type === 'success' ? 'var(--success-bg)' : 'var(--error-bg)',
            borderColor: feedbackMsg.type === 'success' ? 'var(--success-border)' : 'var(--error-border)',
            color: feedbackMsg.type === 'success' ? 'var(--success-fg)' : 'var(--error-fg)',
          }}
        >
          <span>{feedbackMsg.message}</span>
          <button onClick={() => setFeedbackMsg(null)} className="p-1 hover:opacity-75">
            ✕
          </button>
        </div>
      )}

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative min-w-[280px] flex-1 max-w-md">
          <Search
            className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: 'var(--text-muted)' }}
          />
          <input
            type="text"
            placeholder="Rechercher par nom, email, téléphone..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none transition-all"
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
            }}
          />
        </div>

        {/* Filter dropdowns */}
        <div className="flex items-center gap-2.5">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-xl px-3 py-2 text-xs font-medium focus:outline-none transition-all cursor-pointer"
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
            }}
          >
            <option value="all">Tous les rôles</option>
            <option value="student">Étudiants</option>
            <option value="landlord">Bailleurs</option>
            <option value="admin">Administrateurs</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl px-3 py-2 text-xs font-medium focus:outline-none transition-all cursor-pointer"
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
            }}
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
        <div className="dash-card overflow-hidden" style={{ backgroundColor: 'var(--bg-card)' }}>
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr
                className="border-b text-[11px] font-semibold uppercase tracking-wider"
                style={{
                  borderColor: 'var(--border-subtle)',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-muted)',
                }}
              >
                <th className="py-3.5 px-4">Utilisateur</th>
                <th className="py-3.5 px-4">Rôle</th>
                <th className="py-3.5 px-4">Statut</th>
                <th className="py-3.5 px-4">Inscrit le</th>
                <th className="py-3.5 px-4 text-right">Actions de Sécurité</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="animate-pulse border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full" style={{ backgroundColor: 'var(--bg-subtle)' }} />
                      <div className="flex flex-col gap-1.5">
                        <div className="h-3 w-28 rounded" style={{ backgroundColor: 'var(--bg-subtle)' }} />
                        <div className="h-2 w-40 rounded" style={{ backgroundColor: 'var(--bg-subtle)' }} />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4"><div className="h-5 w-20 rounded-lg" style={{ backgroundColor: 'var(--bg-subtle)' }} /></td>
                  <td className="py-3 px-4"><div className="h-5 w-16 rounded-lg" style={{ backgroundColor: 'var(--bg-subtle)' }} /></td>
                  <td className="py-3 px-4"><div className="h-3 w-24 rounded" style={{ backgroundColor: 'var(--bg-subtle)' }} /></td>
                  <td className="py-3 px-4"><div className="h-7 w-32 rounded-xl ml-auto" style={{ backgroundColor: 'var(--bg-subtle)' }} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div
          className="dash-card text-center py-16"
          style={{ backgroundColor: 'var(--bg-card)' }}
        >
          <Users className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
          <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            Aucun utilisateur trouvé
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
            Ajustez vos filtres de recherche.
          </p>
        </div>
      ) : (
        <div className="dash-card overflow-hidden shadow-sm" style={{ backgroundColor: 'var(--bg-card)' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr
                  className="border-b text-[11px] font-semibold uppercase tracking-wider"
                  style={{
                    borderColor: 'var(--border-subtle)',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-muted)',
                  }}
                >
                  <th className="py-3.5 px-4">Utilisateur</th>
                  <th className="py-3.5 px-4">Rôle</th>
                  <th className="py-3.5 px-4">Statut</th>
                  <th className="py-3.5 px-4">Inscrit le</th>
                  <th className="py-3.5 px-4 text-right">Actions de Sécurité</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
                {paginatedUsers.map((u) => {
                  const roleMeta = ROLE_BADGES[u.role] || { label: u.role, badgeClass: 'badge-neutral' };
                  const statusMeta =
                    STATUS_BADGES[u.status as UserStatus] || { label: u.status, badgeClass: 'badge-neutral' };

                  return (
                    <tr
                      key={u.id}
                      className="transition-colors hover:bg-[var(--bg-subtle)]"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs uppercase"
                            style={{
                              backgroundColor: 'var(--brand-bg)',
                              color: 'var(--brand-primary)',
                              border: '1px solid var(--brand-bg-strong)',
                            }}
                          >
                            {u.full_name?.[0] || 'U'}
                          </div>
                          <div>
                            <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                              {u.full_name || 'Utilisateur sans nom'}
                            </div>
                            <div className="text-[11px] flex items-center gap-2 mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                              <span>{u.email}</span>
                              {u.phone && <span>• {u.phone}</span>}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg ${roleMeta.badgeClass}`}>
                          {roleMeta.label}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg ${statusMeta.badgeClass}`}>
                          {statusMeta.label}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono text-[11px]" style={{ color: 'var(--text-muted)' }}>
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
                              className="px-2 py-1 text-[11px] font-medium rounded-lg transition flex items-center gap-1 disabled:opacity-50"
                              style={{
                                backgroundColor: 'var(--warning-bg)',
                                color: 'var(--warning-fg)',
                                border: '1px solid var(--warning-border)',
                              }}
                              title="Suspendre le compte"
                            >
                              <Lock className="w-3 h-3" />
                              Suspendre
                            </button>
                          ) : (
                            <button
                              disabled={actionLoadingId === u.id}
                              onClick={() => handleStatusUpdate(u.id, 'ACTIVE')}
                              className="px-2 py-1 text-[11px] font-medium rounded-lg transition flex items-center gap-1 disabled:opacity-50"
                              style={{
                                backgroundColor: 'var(--success-bg)',
                                color: 'var(--success-fg)',
                                border: '1px solid var(--success-border)',
                              }}
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
                            className="rounded-lg px-2 py-1 text-[11px] font-medium focus:outline-none transition cursor-pointer disabled:opacity-50"
                            style={{
                              backgroundColor: 'var(--bg-subtle)',
                              borderColor: 'var(--border-subtle)',
                              color: 'var(--text-primary)',
                              border: '1px solid var(--border-subtle)',
                            }}
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
            <div
              className="flex items-center justify-between px-5 py-3 border-t"
              style={{
                borderColor: 'var(--border-subtle)',
                backgroundColor: 'var(--bg-subtle)',
              }}
            >
              <span className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                {filteredUsers.length} utilisateur{filteredUsers.length > 1 ? 's' : ''} • Page {currentPage}/{totalPages}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--text-secondary)',
                    backgroundColor: 'var(--bg-card)',
                  }}
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
                      <span key={`ellipsis-${i}`} className="px-1.5 text-[11px]" style={{ color: 'var(--text-muted)' }}>
                        …
                      </span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setCurrentPage(p as number)}
                        className={`w-7 h-7 rounded-lg text-[11px] font-semibold transition-colors ${
                          currentPage === p ? 'btn-brand text-white' : 'border'
                        }`}
                        style={
                          currentPage !== p
                            ? {
                                borderColor: 'var(--border-subtle)',
                                color: 'var(--text-secondary)',
                                backgroundColor: 'var(--bg-card)',
                              }
                            : undefined
                        }
                      >
                        {p}
                      </button>
                    )
                  )}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg border transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--text-secondary)',
                    backgroundColor: 'var(--bg-card)',
                  }}
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
