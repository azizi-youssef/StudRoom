'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { clientAdminService } from '@/client/services/admin.service';
import { DbAuditLog } from '@/shared/types/database';
import {
  FileText,
  Search,
  Clock,
  UserCheck,
  Building2,
  DoorOpen,
  Image as ImageIcon,
  Calendar,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Loader2,
  Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<DbAuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [entityFilter, setEntityFilter] = useState<string>('all');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await clientAdminService.getAuditLogs(100, 0);
      if (res.success && res.data) {
        setLogs(res.data);
      }
    } catch (err) {
      console.error('[Audit] Error loading logs:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const filteredLogs = logs.filter((log) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      `${log.action} ${log.entity_type} ${log.entity_id || ''} ${log.actor_user_id || ''}`
        .toLowerCase()
        .includes(term);
    const matchesEntity = entityFilter === 'all' || log.entity_type === entityFilter;
    return matchesSearch && matchesEntity;
  });

  const getEntityIcon = (entityType: string) => {
    switch (entityType) {
      case 'property':
        return <Building2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />;
      case 'room':
        return <DoorOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />;
      case 'property_image':
        return <ImageIcon className="w-4 h-4 text-teal-600 dark:text-teal-400" />;
      case 'user':
        return <UserCheck className="w-4 h-4 text-rose-600 dark:text-rose-400" />;
      case 'booking_request':
        return <Calendar className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      default:
        return <FileText className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
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
              Traçabilité & Sécurité
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
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                Journal d'Audit Système
              </h1>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                Traçabilité immuable de toutes les actions d'administration sensibles (créations, modifications, suspensions, conversions).
              </p>
            </div>
          </div>
        </div>

        <Button
          onClick={fetchLogs}
          variant="outline"
          className="dash-card flex items-center gap-2 px-3.5 py-2 text-xs font-medium self-start sm:self-center"
          style={{ color: 'var(--text-primary)' }}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Actualiser
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative min-w-[280px] flex-1 max-w-md">
          <Search
            className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: 'var(--text-muted)' }}
          />
          <input
            type="text"
            placeholder="Rechercher action, entité, ID acteur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl pl-9 pr-4 py-2.5 text-xs focus:outline-none transition-all"
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
            }}
          />
        </div>

        {/* Entity Selector */}
        <select
          value={entityFilter}
          onChange={(e) => setEntityFilter(e.target.value)}
          className="rounded-xl px-3 py-2.5 text-xs font-medium focus:outline-none transition-all cursor-pointer"
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-primary)',
          }}
        >
          <option value="all">Toutes les entités ({logs.length})</option>
          <option value="property">Logements (property)</option>
          <option value="room">Chambres (room)</option>
          <option value="property_image">Photos (image)</option>
          <option value="user">Utilisateurs (user)</option>
          <option value="landlord_submission">Bailleurs (submission)</option>
          <option value="booking_request">Réservations (booking)</option>
          <option value="contact_request">Support (contact)</option>
        </select>
      </div>

      {/* Logs Timeline / Table */}
      {loading ? (
        <div
          className="dash-card flex flex-col items-center justify-center py-20"
          style={{ backgroundColor: 'var(--bg-card)' }}
        >
          <Loader2 className="w-8 h-8 animate-spin mb-3" style={{ color: 'var(--brand-primary)' }} />
          <p className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
            Chargement des journaux d'audit...
          </p>
        </div>
      ) : filteredLogs.length === 0 ? (
        <div
          className="dash-card text-center py-16"
          style={{ backgroundColor: 'var(--bg-card)' }}
        >
          <FileText className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
          <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            Aucun journal d'audit correspondant
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
            Les actions effectuées apparaîtront automatiquement ici.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredLogs.map((log) => {
            const isExpanded = expandedLogId === log.id;

            return (
              <div
                key={log.id}
                className="dash-card p-4 transition-all duration-150"
                style={{ backgroundColor: 'var(--bg-card)' }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start sm:items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 sm:mt-0"
                      style={{
                        backgroundColor: 'var(--bg-subtle)',
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      {getEntityIcon(log.entity_type)}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-xs font-mono" style={{ color: 'var(--text-primary)' }}>
                          {log.action}
                        </span>
                        <span
                          className="text-[10px] px-2 py-0.5 rounded font-mono font-medium"
                          style={{
                            backgroundColor: 'var(--bg-subtle)',
                            color: 'var(--text-secondary)',
                            border: '1px solid var(--border-subtle)',
                          }}
                        >
                          {log.entity_type}
                        </span>
                        {log.entity_id && (
                          <span
                            className="text-[10px] font-mono truncate max-w-[140px]"
                            style={{ color: 'var(--text-muted)' }}
                          >
                            ID: {log.entity_id}
                          </span>
                        )}
                      </div>
                      <div
                        className="text-[11px] flex flex-wrap items-center gap-2 mt-1"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                          {new Date(log.created_at).toLocaleString('fr-FR', {
                            dateStyle: 'short',
                            timeStyle: 'medium',
                          })}
                        </span>
                        <span>•</span>
                        <span>Acteur: {log.actor_user_id ? log.actor_user_id.slice(0, 8) + '...' : 'Système'}</span>
                        {log.ip_address && (
                          <>
                            <span>•</span>
                            <span className="font-mono text-[10px]">IP: {log.ip_address}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {(log.old_value || log.new_value) && (
                    <button
                      onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                      className="dash-card px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 text-[11px] font-medium self-start sm:self-auto shrink-0"
                      style={{
                        backgroundColor: 'var(--bg-subtle)',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="w-3.5 h-3.5" /> Masquer détails
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-3.5 h-3.5" /> Inspecter modifications
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Diff Viewer if expanded */}
                {isExpanded && (
                  <div
                    className="mt-4 pt-3.5 border-t grid grid-cols-1 md:grid-cols-2 gap-3 text-xs"
                    style={{ borderColor: 'var(--border-subtle)' }}
                  >
                    {log.old_value && (
                      <div>
                        <span
                          className="text-[11px] uppercase font-bold block mb-1.5"
                          style={{ color: 'var(--error-fg)' }}
                        >
                          Ancienne Valeur :
                        </span>
                        <pre
                          className="p-3 rounded-xl font-mono text-[11px] overflow-x-auto max-h-48 border"
                          style={{
                            backgroundColor: 'var(--bg-subtle)',
                            borderColor: 'var(--border-subtle)',
                            color: 'var(--text-primary)',
                          }}
                        >
                          {JSON.stringify(log.old_value, null, 2)}
                        </pre>
                      </div>
                    )}
                    {log.new_value && (
                      <div>
                        <span
                          className="text-[11px] uppercase font-bold block mb-1.5"
                          style={{ color: 'var(--success-fg)' }}
                        >
                          Nouvelle Valeur :
                        </span>
                        <pre
                          className="p-3 rounded-xl font-mono text-[11px] overflow-x-auto max-h-48 border"
                          style={{
                            backgroundColor: 'var(--bg-subtle)',
                            borderColor: 'var(--border-subtle)',
                            color: 'var(--text-primary)',
                          }}
                        >
                          {JSON.stringify(log.new_value, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
