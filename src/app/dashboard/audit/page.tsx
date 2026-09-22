'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { clientAdminService } from '@/client/services/admin.service';
import { DbAuditLog } from '@/shared/types/database';
import {
  FileText,
  Search,
  Filter,
  Clock,
  ShieldAlert,
  UserCheck,
  Building2,
  DoorOpen,
  Image as ImageIcon,
  CheckCircle2,
  Calendar,
  Layers,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Loader2,
  Eye,
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
        return <Building2 className="w-4 h-4 text-primary-400" />;
      case 'room':
        return <DoorOpen className="w-4 h-4 text-indigo-400" />;
      case 'property_image':
        return <ImageIcon className="w-4 h-4 text-teal-400" />;
      case 'user':
        return <UserCheck className="w-4 h-4 text-rose-400" />;
      case 'booking_request':
        return <Calendar className="w-4 h-4 text-amber-400" />;
      default:
        return <FileText className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-1">
            <Link href="/dashboard" className="hover:text-primary-400 transition-colors text-xs">
              Tableau de bord
            </Link>
            <span>/</span>
            <span className="text-primary-400 font-medium text-xs">Traçabilité & Sécurité</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-950/80 border border-primary-800/80 flex items-center justify-center text-primary-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Journal d'Audit Système</h1>
              <p className="text-xs text-slate-400">
                Traçabilité immuable de toutes les actions d'administration sensibles (créations, modifications, suspensions, conversions).
              </p>
            </div>
          </div>
        </div>

        <Button
          onClick={fetchLogs}
          variant="outline"
          className="flex items-center gap-2 px-3 py-2 text-xs border-slate-800 text-slate-300 hover:bg-slate-800"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Actualiser
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative min-w-[280px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Rechercher action, entité, ID acteur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-primary-500"
          />
        </div>

        {/* Entity Selector */}
        <select
          value={entityFilter}
          onChange={(e) => setEntityFilter(e.target.value)}
          className="bg-slate-900 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-primary-500"
        >
          <option value="all">Toutes les entités</option>
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
        <div className="flex flex-col items-center justify-center py-20 bg-slate-900/40 rounded-2xl border border-slate-800/60">
          <Loader2 className="w-8 h-8 text-primary-400 animate-spin mb-3" />
          <p className="text-xs text-slate-400">Chargement des journaux d'audit...</p>
        </div>
      ) : filteredLogs.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 border border-slate-800/60 rounded-2xl">
          <FileText className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-300">Aucun journal d'audit correspondant</p>
          <p className="text-xs text-slate-500 mt-1">Les actions effectuées apparaîtront automatiquement ici.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredLogs.map((log) => {
            const isExpanded = expandedLogId === log.id;

            return (
              <div
                key={log.id}
                className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 hover:border-slate-700 transition backdrop-blur-sm"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                      {getEntityIcon(log.entity_type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-white font-mono">{log.action}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                          {log.entity_type}
                        </span>
                        {log.entity_id && (
                          <span className="text-[10px] text-slate-500 font-mono truncate max-w-[120px]">
                            ID: {log.entity_id}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" />
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
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition flex items-center gap-1 text-[11px]"
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
                  <div className="mt-4 pt-3 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    {log.old_value && (
                      <div>
                        <span className="text-[10px] text-rose-400 uppercase font-semibold block mb-1">
                          Ancienne Valeur :
                        </span>
                        <pre className="p-3 rounded-xl bg-slate-950 border border-rose-950/60 text-slate-300 font-mono text-[11px] overflow-x-auto max-h-48">
                          {JSON.stringify(log.old_value, null, 2)}
                        </pre>
                      </div>
                    )}
                    {log.new_value && (
                      <div>
                        <span className="text-[10px] text-emerald-400 uppercase font-semibold block mb-1">
                          Nouvelle Valeur :
                        </span>
                        <pre className="p-3 rounded-xl bg-slate-950 border border-emerald-950/60 text-slate-300 font-mono text-[11px] overflow-x-auto max-h-48">
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
