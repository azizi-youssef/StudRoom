'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { clientAdminService, DashboardData } from '@/client/services/admin.service';
import {
  Calendar,
  Building2,
  Home,
  UserCheck,
  Mail,
  RefreshCw,
  Clock,
  Plus,
  ArrowUpRight,
  ShieldAlert,
  Activity,
  AlertCircle,
} from 'lucide-react';

// ── Skeleton Components ────────────────────────────────────────────────────────

function KpiSkeleton() {
  return (
    <div className="bg-[var(--bg-surface)] p-6 rounded-[20px] border border-[var(--border-default)] flex flex-col justify-between h-full animate-pulse">
      <div className="flex items-start justify-between gap-3">
        <div className="h-2.5 w-28 bg-[var(--border-strong)] rounded-full" />
        <div className="w-10 h-10 rounded-xl bg-[var(--border-strong)]" />
      </div>
      <div className="mt-4">
        <div className="h-9 w-20 bg-[var(--border-strong)] rounded-lg mb-3" />
        <div className="h-2.5 w-36 bg-[var(--border-subtle)] rounded-full" />
      </div>
    </div>
  );
}

function DataRowSkeleton() {
  return (
    <div className="py-3.5 border-b border-[var(--border-subtle)] last:border-b-0 flex items-center justify-between gap-4 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-[var(--border-strong)]" />
        <div className="h-2.5 w-48 bg-[var(--border-strong)] rounded-full" />
        <div className="h-4 w-16 bg-[var(--border-subtle)] rounded-full" />
      </div>
      <div className="h-2.5 w-24 bg-[var(--border-subtle)] rounded-full" />
    </div>
  );
}

// ── KpiCard ────────────────────────────────────────────────────────────────────

interface KpiCardProps {
  label: string;
  value: string | number;
  sub: string;
  subHighlight?: string;
  icon: React.ReactNode;
  iconContainerClass: string;
  href?: string;
}

function KpiCard({
  label,
  value,
  sub,
  subHighlight,
  icon,
  iconContainerClass,
  href,
}: KpiCardProps) {
  const content = (
    <div className="bg-[var(--bg-surface)] p-6 rounded-[20px] border border-[var(--border-default)] hover:border-[var(--border-strong)] transition-all duration-150 flex flex-col justify-between h-full group">
      <div className="flex items-start justify-between gap-3">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
          {label}
        </span>
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-150 group-hover:scale-105 ${iconContainerClass}`}
        >
          {icon}
        </div>
      </div>
      <div>
        <div className="text-3xl sm:text-[34px] font-bold text-white tracking-tight my-2">
          {value}
        </div>
        <p className="text-xs text-[var(--text-secondary)] flex items-center gap-1.5 flex-wrap">
          {subHighlight && (
            <span className="font-semibold text-white">{subHighlight}</span>
          )}
          <span>{sub}</span>
        </p>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--action-primary)] rounded-[20px]">
        {content}
      </Link>
    );
  }
  return content;
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function DashboardOverviewPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [secondsAgo, setSecondsAgo] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fetch data — silent=true means no loading spinner (background refresh)
  const loadData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const res = await clientAdminService.getDashboardData();
      if (res.success && res.data) {
        setData(res.data);
        setLastUpdated(new Date());
        setSecondsAgo(0);
      } else {
        setError(res.error?.message || 'Impossible de charger les métriques.');
      }
    } catch (err: any) {
      setError(err?.message || 'Erreur réseau. Vérifiez votre connexion au backend.');
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Auto-refresh every 60s (silent)
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      loadData(true);
    }, 60_000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [loadData]);

  // Seconds-ago ticker
  useEffect(() => {
    tickRef.current = setInterval(() => {
      if (lastUpdated) {
        setSecondsAgo(Math.floor((Date.now() - lastUpdated.getTime()) / 1000));
      }
    }, 5000);
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [lastUpdated]);

  const metrics = data?.metrics;
  const recentLogs = data?.recentActivity || [];

  return (
    <div className="flex flex-col gap-8">
      {/* ── Page Header & Quick Controls ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border-subtle)]">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 text-[11px] font-semibold tracking-wider uppercase mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] animate-pulse" />
            <span>Plateforme en ligne · Selouane / Nador</span>
          </div>
          <h1 className="text-3xl sm:text-[32px] font-bold text-white tracking-tight">
            Vue d&apos;ensemble
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Indicateurs clés de performance et supervision des activités locatives.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => loadData(false)}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[var(--border-strong)] bg-transparent text-xs font-semibold text-[#CBD5E1] hover:text-white hover:border-[#3d4a66] transition-all duration-150 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Actualiser</span>
          </button>

          <Link href="/dashboard/logements/nouveau">
            <button
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--action-primary)] hover:bg-[var(--action-hover)] text-xs font-semibold text-white shadow-[0_0_20px_rgba(109,74,255,0.20)] transition-all duration-150"
            >
              <Plus className="w-4 h-4" />
              <span>Nouveau logement</span>
            </button>
          </Link>
        </div>
      </div>

      {/* ── Error Banner ── */}
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-rose-950/50 border border-rose-800/60 text-rose-300">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-rose-400" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-rose-200">Erreur de chargement</p>
            <p className="text-xs mt-0.5 text-rose-300/80">{error}</p>
          </div>
          <button
            onClick={() => loadData(false)}
            className="px-3 py-1.5 rounded-lg bg-rose-900/60 hover:bg-rose-800/60 text-xs font-bold text-rose-200 transition-colors shrink-0"
          >
            Réessayer
          </button>
        </div>
      )}

      {/* ── Main KPI Cards Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {loading ? (
          <>
            <KpiSkeleton />
            <KpiSkeleton />
            <KpiSkeleton />
            <KpiSkeleton />
          </>
        ) : (
          <>
            {/* KPI 1 : Demandes en attente (Orange) */}
            <KpiCard
              label="Demandes en attente"
              value={metrics?.pendingBookings ?? 0}
              sub={`${metrics?.totalBookings ?? 0} demandes au total`}
              icon={<Clock className="w-5 h-5" />}
              iconContainerClass="bg-[var(--warning)]/10 border border-[var(--warning)]/20 text-[var(--warning)]"
              href="/dashboard/reservations"
            />

            {/* KPI 2 : Taux d'occupation (Green) */}
            <KpiCard
              label="Taux d'occupation"
              value={`${metrics?.occupancyRate ?? 0}%`}
              sub={`${metrics?.availableRooms ?? 0} chambres libres / ${metrics?.totalRooms ?? 0}`}
              icon={<Home className="w-5 h-5" />}
              iconContainerClass="bg-[var(--success)]/10 border border-[var(--success)]/20 text-[var(--success)]"
              href="/dashboard/logements"
            />

            {/* KPI 3 : Offres Bailleurs (Purple) */}
            <KpiCard
              label="Offres Bailleurs"
              value={metrics?.newProposals ?? 0}
              sub={`${metrics?.totalProposals ?? 0} propositions enregistrées`}
              icon={<UserCheck className="w-5 h-5" />}
              iconContainerClass="bg-[var(--action-primary)]/10 border border-[var(--action-primary)]/20 text-[var(--action-hover)]"
              href="/dashboard/bailleurs"
            />

            {/* KPI 4 : Messages Support (Cyan) */}
            <KpiCard
              label="Messages Support"
              value={metrics?.unresolvedContacts ?? 0}
              sub={`${metrics?.totalContacts ?? 0} messages reçus`}
              icon={<Mail className="w-5 h-5" />}
              iconContainerClass="bg-[var(--brand-light)]/10 border border-[var(--brand-light)]/20 text-[var(--brand-light)]"
              href="/dashboard/support"
            />
          </>
        )}
      </div>

      {/* ── Data Panels ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1 : Pipeline Réservations */}
        <div className="bg-[var(--bg-surface)] p-6 rounded-[20px] border border-[var(--border-default)] hover:border-[var(--border-strong)] transition-all duration-150 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-[var(--border-subtle)]">
              <span className="text-[13px] font-semibold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[var(--action-hover)]" />
                Pipeline Réservations
              </span>
              <Link
                href="/dashboard/reservations"
                className="text-xs font-medium text-[var(--brand-light)] hover:text-white flex items-center gap-1 transition-colors"
              >
                <span>Gérer</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center justify-between text-xs py-2.5 border-b border-[var(--border-subtle)]">
                <span className="text-[var(--text-secondary)]">En attente de traitement</span>
                <span className="font-semibold text-[var(--warning)]">{metrics?.pendingBookings ?? 0}</span>
              </div>
              <div className="flex items-center justify-between text-xs py-2.5 border-b border-[var(--border-subtle)]">
                <span className="text-[var(--text-secondary)]">Étudiants contactés</span>
                <span className="font-semibold text-[var(--info)]">{metrics?.contactedBookings ?? 0}</span>
              </div>
              <div className="flex items-center justify-between text-xs py-2.5 border-b border-[var(--border-subtle)]">
                <span className="text-[var(--text-secondary)]">Visites programmées</span>
                <span className="font-semibold text-[var(--action-hover)]">{metrics?.visitScheduledBookings ?? 0}</span>
              </div>
              <div className="flex items-center justify-between text-xs py-2.5">
                <span className="text-[var(--text-secondary)]">Réservations confirmées</span>
                <span className="font-semibold text-[var(--success)]">{metrics?.approvedBookings ?? 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2 : État des Chambres */}
        <div className="bg-[var(--bg-surface)] p-6 rounded-[20px] border border-[var(--border-default)] hover:border-[var(--border-strong)] transition-all duration-150 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-[var(--border-subtle)]">
              <span className="text-[13px] font-semibold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[var(--brand-light)]" />
                État des Chambres
              </span>
              <Link
                href="/dashboard/logements"
                className="text-xs font-medium text-[var(--brand-light)] hover:text-white flex items-center gap-1 transition-colors"
              >
                <span>Parc</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center justify-between text-xs py-2.5 border-b border-[var(--border-subtle)]">
                <span className="text-[var(--text-secondary)]">Disponibles immédiatement</span>
                <span className="font-semibold text-[var(--success)]">{metrics?.availableRooms ?? 0}</span>
              </div>
              <div className="flex items-center justify-between text-xs py-2.5 border-b border-[var(--border-subtle)]">
                <span className="text-[var(--text-secondary)]">Réservées (en cours de bail)</span>
                <span className="font-semibold text-[var(--brand-light)]">{metrics?.reservedRooms ?? 0}</span>
              </div>
              <div className="flex items-center justify-between text-xs py-2.5 border-b border-[var(--border-subtle)]">
                <span className="text-[var(--text-secondary)]">Occupées (locataires en place)</span>
                <span className="font-semibold text-[var(--text-secondary)]">{metrics?.occupiedRooms ?? 0}</span>
              </div>
              <div className="flex items-center justify-between text-xs py-2.5">
                <span className="text-[var(--text-secondary)]">En maintenance / travaux</span>
                <span className="font-semibold text-[var(--danger)]">{metrics?.maintenanceRooms ?? 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3 : Bailleurs & Logements */}
        <div className="bg-[var(--bg-surface)] p-6 rounded-[20px] border border-[var(--border-default)] hover:border-[var(--border-strong)] transition-all duration-150 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-[var(--border-subtle)]">
              <span className="text-[13px] font-semibold text-white flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-[var(--action-hover)]" />
                Bailleurs &amp; Logements
              </span>
              <Link
                href="/dashboard/bailleurs"
                className="text-xs font-medium text-[var(--brand-light)] hover:text-white flex items-center gap-1 transition-colors"
              >
                <span>Offres</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center justify-between text-xs py-2.5 border-b border-[var(--border-subtle)]">
                <span className="text-[var(--text-secondary)]">Logements en catalogue</span>
                <span className="font-semibold text-white">{metrics?.totalProperties ?? 0}</span>
              </div>
              <div className="flex items-center justify-between text-xs py-2.5 border-b border-[var(--border-subtle)]">
                <span className="text-[var(--text-secondary)]">Nouvelles offres bailleurs</span>
                <span className="font-semibold text-[var(--warning)]">{metrics?.newProposals ?? 0}</span>
              </div>
              <div className="flex items-center justify-between text-xs py-2.5 border-b border-[var(--border-subtle)]">
                <span className="text-[var(--text-secondary)]">Tickets support ouverts</span>
                <span className="font-semibold text-[var(--info)]">{metrics?.unresolvedContacts ?? 0}</span>
              </div>
              <div className="flex items-center justify-between text-xs py-2.5">
                <span className="text-[var(--text-secondary)]">Couverture géographique</span>
                <span className="font-semibold text-[var(--success)]">Selouane &amp; Nador</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Activité Récente (Journal d'Audit) ── */}
      <div className="bg-[var(--bg-surface)] rounded-[20px] border border-[var(--border-default)] p-6">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--action-primary)]/10 border border-[var(--action-primary)]/20 text-[var(--action-hover)] flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Activité Récente (Journal d&apos;Audit)</h3>
              <p className="text-xs text-[var(--text-muted)]">Traçabilité immuable des opérations administratives</p>
            </div>
          </div>
          <Link
            href="/dashboard/audit"
            className="text-xs font-medium text-[var(--brand-light)] hover:text-white flex items-center gap-1 transition-colors"
          >
            <span>Voir l&apos;historique complet</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col">
            {Array.from({ length: 5 }).map((_, i) => (
              <DataRowSkeleton key={i} />
            ))}
          </div>
        ) : recentLogs.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-[var(--border-subtle)] border border-[var(--border-default)] flex items-center justify-center text-[var(--text-muted)]">
              <Activity className="w-5 h-5" />
            </div>
            <p className="text-sm font-semibold text-white">Aucune activité administrative récente.</p>
            <p className="text-xs text-[var(--text-muted)] max-w-sm">
              Les actions administratives (création de logement, mise à jour de statut, visites) apparaîtront automatiquement dans ce flux d&apos;activité.
            </p>
          </div>
        ) : (
          <div className="flex flex-col">
            {recentLogs.map((log) => (
              <div
                key={log.id}
                className="py-3.5 border-b border-[var(--border-subtle)] last:border-b-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs group hover:bg-[var(--bg-surface-hover)]/40 -mx-3 px-3 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-[var(--action-primary)] shrink-0" />
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-white uppercase tracking-wider text-[11px]">
                      {log.action}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[var(--border-subtle)] text-[var(--text-muted)] border border-[var(--border-default)]">
                      {log.entity_type}
                    </span>
                    <span className="text-[var(--text-muted)] font-mono text-[11px]">
                      {log.entity_id ? log.entity_id.slice(0, 8) : '—'}
                    </span>
                  </div>
                </div>

                <div className="text-[var(--text-muted)] font-mono text-[11px] shrink-0 sm:text-right">
                  {new Date(log.created_at).toLocaleString('fr-FR', {
                    day: '2-digit',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Last Updated Indicator ── */}
      {lastUpdated && (
        <div className="flex items-center justify-end gap-1.5 text-[11px] text-[var(--text-muted)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] opacity-70" />
          <span>
            {secondsAgo < 10
              ? 'Mis à jour à l\'instant'
              : `Mis à jour il y a ${secondsAgo}s`}
          </span>
          <span className="opacity-40">· Refresh auto 60s</span>
        </div>
      )}
    </div>
  );
}
