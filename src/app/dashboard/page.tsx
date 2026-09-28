'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { clientAdminService, DashboardData } from '@/client/services/admin.service';
import { LineChart } from '@/components/charts/line-chart';
import { BarChart } from '@/components/charts/bar-chart';
import { WidgetConfig } from '@/components/admin/widget-config';
import { useWidgets } from '@/context/widget-context';
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
  CheckCircle2,
  ChevronRight,
  Layers,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react';

// ── Helpers ──────────────────────────────────────────────────────────────────

function pluralize(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 || count === -1 ? singular : plural}`;
}

function formatTimeAgo(seconds: number): string {
  if (seconds < 10) return "à l'instant";
  if (seconds < 60) return `il y a ${seconds}s`;
  const m = Math.floor(seconds / 60);
  return `il y a ${m} min`;
}

// ── Skeleton ─────────────────────────────────────────────────────────────────

function KpiSkeleton() {
  return (
    <div className="dash-card p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="h-3 w-28 rounded-full" style={{ background: 'var(--border-default)' }} />
        <div className="w-10 h-10 rounded-xl" style={{ background: 'var(--border-default)' }} />
      </div>
      <div className="h-8 w-20 rounded-lg mb-2" style={{ background: 'var(--border-default)' }} />
      <div className="h-3 w-40 rounded-full" style={{ background: 'var(--border-subtle)' }} />
    </div>
  );
}

function RowSkeleton() {
  return (
    <div className="py-3 flex items-center justify-between gap-4 animate-pulse"
      style={{ borderBottom: '1px solid var(--border-subtle)' }}>
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full" style={{ background: 'var(--border-default)' }} />
        <div className="h-3 w-44 rounded-full" style={{ background: 'var(--border-default)' }} />
        <div className="h-5 w-16 rounded-full" style={{ background: 'var(--border-subtle)' }} />
      </div>
      <div className="h-3 w-24 rounded-full" style={{ background: 'var(--border-subtle)' }} />
    </div>
  );
}

// ── KPI Card ─────────────────────────────────────────────────────────────────

interface KpiCardProps {
  label: string;
  value: string | number;
  sub: React.ReactNode;
  icon: React.ReactNode;
  iconClass: string;
  href?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendLabel?: string;
  isNeutralZero?: boolean;
}

function KpiCard({ label, value, sub, icon, iconClass, href, trend, trendLabel, isNeutralZero = false }: KpiCardProps) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'var(--success)' : trend === 'down' ? 'var(--danger)' : 'var(--text-muted)';

  const inner = (
    <div className="dash-card p-6 flex flex-col gap-4 h-full group">
      {/* Top row */}
      <div className="flex items-start justify-between">
        <p className="text-[11.5px] font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
          {label}
        </p>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-150 group-hover:scale-105 ${iconClass}`}>
          {icon}
        </div>
      </div>

      {/* Value */}
      <div>
        <div className="text-[34px] font-bold tracking-tight leading-none mb-1"
          style={{ color: isNeutralZero ? 'var(--text-muted)' : 'var(--text-primary)' }}>
          {value}
        </div>
        <div className="text-[12.5px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {sub}
        </div>
      </div>

      {/* Trend */}
      {trend && trendLabel && (
        <div className="flex items-center gap-1.5 mt-auto pt-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <TrendIcon className="w-3.5 h-3.5" style={{ color: trendColor }} />
          <span className="text-[11.5px] font-medium" style={{ color: trendColor }}>
            {trendLabel}
          </span>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full focus-visible:outline-none focus-visible:ring-2 rounded-[12px]"
        style={{ '--tw-ring-color': 'var(--brand-primary)' } as React.CSSProperties}>
        {inner}
      </Link>
    );
  }
  return inner;
}

// ── Status Badge ──────────────────────────────────────────────────────────────

function StatusBadge({ value, colorClass, neutral }: { value: number; colorClass: string; neutral?: boolean }) {
  if (neutral || value === 0) {
    return <span className="text-sm font-semibold tabular-nums" style={{ color: 'var(--text-muted)' }}>{value}</span>;
  }
  return <span className={`text-sm font-bold tabular-nums ${colorClass}`}>{value}</span>;
}

// ── Quick Action Card ─────────────────────────────────────────────────────────

interface ActionCardProps {
  href: string;
  icon: React.ReactNode;
  iconBgClass: string;
  title: string;
  count: number;
  label: string;
  urgent?: boolean;
}

function ActionCard({ href, icon, iconBgClass, title, count, label, urgent }: ActionCardProps) {
  return (
    <Link
      href={href}
      className="dash-card p-4 flex items-center justify-between gap-3 group transition-all duration-150"
      style={urgent && count > 0 ? { borderColor: 'rgba(245,158,11,0.3)' } : {}}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${iconBgClass}`}>
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-[13px] font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
            {title}
          </p>
          <p className="text-[11.5px] mt-0.5" style={{ color: count > 0 && urgent ? 'var(--warning)' : 'var(--text-muted)' }}>
            {count > 0 ? (
              <span className="font-semibold">{pluralize(count, label, label + 's')}</span>
            ) : (
              'À jour'
            )}
          </p>
        </div>
      </div>
      <ChevronRight className="w-4 h-4 shrink-0 transition-transform duration-150 group-hover:translate-x-0.5"
        style={{ color: 'var(--text-muted)' }} />
    </Link>
  );
}

// ── Domain Panel ──────────────────────────────────────────────────────────────

function DomainPanel({
  title, icon, href, linkLabel, children, footer,
}: {
  title: string; icon: React.ReactNode; href: string; linkLabel: string;
  children: React.ReactNode; footer?: React.ReactNode;
}) {
  return (
    <div className="dash-card p-6 flex flex-col gap-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-4"
        style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <span className="text-[14px] font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <span className="text-[var(--brand-primary)]">{icon}</span>
          {title}
        </span>
        <Link href={href}
          className="text-[12px] font-semibold flex items-center gap-1 transition-colors hover:opacity-70"
          style={{ color: 'var(--brand-primary)' }}>
          {linkLabel}
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Rows */}
      <div className="flex flex-col divide-y" style={{ '--tw-divide-opacity': 1 } as React.CSSProperties}>
        {children}
      </div>

      {/* Footer */}
      {footer && (
        <div className="mt-4 pt-3 flex items-center justify-between text-[11.5px]"
          style={{ borderTop: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
          {footer}
        </div>
      )}
    </div>
  );
}

function DomainRow({ label, value, valueClass }: { label: string; value: React.ReactNode; valueClass?: string }) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <span className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>{label}</span>
      <span className={`text-[13px] font-semibold tabular-nums ${valueClass ?? ''}`}>{value}</span>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function DashboardOverviewPage() {
  const { widgets } = useWidgets();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [secondsAgo, setSecondsAgo] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

  useEffect(() => { loadData(); }, [loadData]);

  useEffect(() => {
    intervalRef.current = setInterval(() => loadData(true), 60_000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [loadData]);

  useEffect(() => {
    tickRef.current = setInterval(() => {
      if (lastUpdated) setSecondsAgo(Math.floor((Date.now() - lastUpdated.getTime()) / 1000));
    }, 5000);
    return () => { if (tickRef.current) clearInterval(tickRef.current); };
  }, [lastUpdated]);

  const m = data?.metrics;
  const recentLogs = data?.recentActivity || [];

  const totalRooms = m?.totalRooms ?? 0;
  const availableRooms = m?.availableRooms ?? 0;
  const reservedRooms = m?.reservedRooms ?? 0;
  const occupiedRooms = m?.occupiedRooms ?? 0;
  const maintenanceRooms = m?.maintenanceRooms ?? 0;
  const exploitableRooms = Math.max(0, totalRooms - maintenanceRooms);
  const occupancyRate = exploitableRooms > 0
    ? Math.round(((occupiedRooms + reservedRooms) / exploitableRooms) * 100) : 0;

  const pendingBookings = m?.pendingBookings ?? 0;
  const newProposals = m?.newProposals ?? 0;
  const visitScheduled = m?.visitScheduledBookings ?? 0;
  const unresolvedContacts = m?.unresolvedContacts ?? 0;
  const totalUrgent = pendingBookings + newProposals + unresolvedContacts;
  const resolutionRate = m?.totalContacts
    ? Math.round((Math.max(0, m.totalContacts - unresolvedContacts) / m.totalContacts) * 100) : null;

  return (
    <div className="flex flex-col gap-8 animate-fade-in">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)]" />
            <span className="text-[11.5px] font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
              Plateforme en ligne · Selouane / Nador
            </span>
          </div>
          <h1 className="text-[26px] font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Vue d&apos;ensemble
          </h1>
          <p className="text-[13.5px] mt-1" style={{ color: 'var(--text-secondary)' }}>
            Supervision du parc immobilier, réservations et coordination quotidienne.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-stretch sm:self-auto justify-end">
          <WidgetConfig />

          <button
            type="button"
            onClick={() => loadData(false)}
            disabled={loading}
            aria-label="Actualiser"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 disabled:opacity-50"
            style={{
              color: 'var(--text-secondary)',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-default)',
            }}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[var(--brand-primary)]' : ''}`} />
            Actualiser
          </button>

          <Link href="/dashboard/logements/nouveau">
            <button
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-semibold text-white transition-all duration-150"
              style={{ background: 'var(--brand-primary)' }}
            >
              <Plus className="w-4 h-4" />
              Nouveau logement
            </button>
          </Link>
        </div>
      </div>

      {/* ── Error Banner ── */}
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl"
          style={{ background: 'var(--danger-bg)', border: '1px solid rgba(239,68,68,0.2)' }}>
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" style={{ color: 'var(--danger)' }} />
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold" style={{ color: 'var(--danger)' }}>Erreur de chargement</p>
            <p className="text-[12.5px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>{error}</p>
          </div>
          <button
            onClick={() => loadData(false)}
            className="px-3 py-1.5 rounded-lg text-[12px] font-bold transition-colors shrink-0"
            style={{ background: 'var(--danger)', color: '#fff' }}
          >
            Réessayer
          </button>
        </div>
      )}

      {/* ── KPI Cards ── */}
      {widgets.find(w => w.id === 'kpi-cards')?.visible && (
        <section aria-label="Indicateurs clés de performance">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {loading ? (
              <>{[0,1,2,3].map(i => <KpiSkeleton key={i} />)}</>
            ) : (
              <>
                {/* KPI 1 — Demandes */}
                <KpiCard
                  label="Demandes à traiter"
                  value={pendingBookings}
                  isNeutralZero={pendingBookings === 0}
                  sub={
                    <span>
                      <strong style={{ color: 'var(--text-primary)' }}>
                        {pluralize(pendingBookings, 'demande en attente', 'demandes en attente')}
                      </strong>
                      <span className="block text-[11.5px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        sur {m?.totalBookings ?? 0} au total
                      </span>
                    </span>
                  }
                  icon={<Clock className="w-5 h-5" />}
                  iconClass="kpi-icon-demandes"
                  href="/dashboard/reservations?status=PENDING"
                  trend={pendingBookings > 0 ? 'up' : 'neutral'}
                  trendLabel={pendingBookings > 0 ? 'Action requise' : 'File à jour'}
                />

                {/* KPI 2 — Occupation */}
                <KpiCard
                  label="Taux d'occupation"
                  value={totalRooms > 0 ? `${occupancyRate}%` : '—'}
                  sub={
                    totalRooms > 0 ? (
                      <span>
                        <strong style={{ color: 'var(--text-primary)' }}>
                          {occupiedRooms} occupée{occupiedRooms > 1 ? 's' : ''} + {reservedRooms} réservée{reservedRooms > 1 ? 's' : ''}
                        </strong>
                        <span className="block text-[11.5px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                          sur {exploitableRooms} exploitables{maintenanceRooms > 0 ? ` (${maintenanceRooms} en travaux)` : ''}
                        </span>
                      </span>
                    ) : <span style={{ color: 'var(--text-muted)' }}>Aucune chambre enregistrée</span>
                  }
                  icon={<Home className="w-5 h-5" />}
                  iconClass="kpi-icon-occupation"
                  href="/dashboard/logements"
                  trend={occupancyRate >= 70 ? 'up' : occupancyRate > 0 ? 'neutral' : 'down'}
                  trendLabel={`${availableRooms} chambre${availableRooms > 1 ? 's' : ''} disponible${availableRooms > 1 ? 's' : ''}`}
                />

                {/* KPI 3 — Propositions */}
                <KpiCard
                  label="Propositions propriétaires"
                  value={newProposals}
                  isNeutralZero={newProposals === 0}
                  sub={
                    <span>
                      <strong style={{ color: 'var(--text-primary)' }}>
                        {pluralize(newProposals, 'nouvelle proposition', 'nouvelles propositions')}
                      </strong>
                      <span className="block text-[11.5px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        sur {m?.totalProposals ?? 0} enregistrée{(m?.totalProposals ?? 0) > 1 ? 's' : ''} au total
                      </span>
                    </span>
                  }
                  icon={<UserCheck className="w-5 h-5" />}
                  iconClass="kpi-icon-proprietaires"
                  href="/dashboard/bailleurs?status=new"
                  trend={newProposals > 0 ? 'up' : 'neutral'}
                  trendLabel={newProposals > 0 ? 'À examiner' : 'Aucune en attente'}
                />

                {/* KPI 4 — Support */}
                <KpiCard
                  label="Support & Messages"
                  value={unresolvedContacts}
                  isNeutralZero={unresolvedContacts === 0}
                  sub={
                    <span>
                      <strong style={{ color: 'var(--text-primary)' }}>
                        {pluralize(unresolvedContacts, 'ticket à traiter', 'tickets à traiter')}
                      </strong>
                      <span className="block text-[11.5px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        sur {m?.totalContacts ?? 0} reçu{(m?.totalContacts ?? 0) > 1 ? 's' : ''} au total
                      </span>
                    </span>
                  }
                  icon={<Mail className="w-5 h-5" />}
                  iconClass="kpi-icon-support"
                  href="/dashboard/support?status=new"
                  trend={unresolvedContacts > 0 ? 'down' : 'up'}
                  trendLabel={resolutionRate !== null ? `${resolutionRate}% de résolution` : 'Tous résolus'}
                />
              </>
            )}
          </div>
        </section>
      )}

      {/* ── Charts ── */}
      {widgets.find(w => w.id === 'charts')?.visible && (
        <section aria-label="Visualisations de données">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

            {/* Distribution des réservations */}
            <div className="dash-card p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-[14px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Distribution des réservations
                  </p>
                  <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-muted)' }}>Par statut de traitement</p>
                </div>
                <span className="badge-brand text-[11px] font-semibold px-2.5 py-1 rounded-full">
                  {m?.totalBookings ?? 0} total
                </span>
              </div>
              {loading ? (
                <div className="h-52 rounded-xl animate-pulse" style={{ background: 'var(--border-subtle)' }} />
              ) : (
                <BarChart
                  data={[
                    m?.pendingBookings ?? 0,
                    m?.contactedBookings ?? 0,
                    m?.visitScheduledBookings ?? 0,
                    m?.approvedBookings ?? 0,
                    m?.rejectedBookings ?? 0,
                  ]}
                  labels={['En attente', 'Contacté', 'Visite', 'Approuvé', 'Refusé']}
                  color="#0EA5C6"
                  height={208}
                />
              )}
            </div>

            {/* État des chambres */}
            <div className="dash-card p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-[14px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                    État des chambres
                  </p>
                  <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-muted)' }}>Répartition du parc immobilier</p>
                </div>
                <span className="badge-brand text-[11px] font-semibold px-2.5 py-1 rounded-full">
                  {totalRooms} chambre{totalRooms > 1 ? 's' : ''}
                </span>
              </div>
              {loading ? (
                <div className="h-52 rounded-xl animate-pulse" style={{ background: 'var(--border-subtle)' }} />
              ) : (
                <LineChart
                  data={[availableRooms, reservedRooms, occupiedRooms, maintenanceRooms]}
                  labels={['Disponible', 'Réservée', 'Occupée', 'Maintenance']}
                  color="#0EA5C6"
                  height={208}
                />
              )}
              {/* Legend */}
              {!loading && (
                <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5">
                  {[
                    { label: 'Disponible', value: availableRooms, color: 'var(--success)' },
                    { label: 'Réservée', value: reservedRooms, color: 'var(--brand-primary)' },
                    { label: 'Occupée', value: occupiedRooms, color: 'var(--text-secondary)' },
                    { label: 'Maintenance', value: maintenanceRooms, color: 'var(--danger)' },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
                      <span className="text-[11.5px]" style={{ color: 'var(--text-secondary)' }}>
                        {label}: <strong style={{ color: 'var(--text-primary)' }}>{value}</strong>
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── Quick Actions ── */}
      {widgets.find(w => w.id === 'priority-actions')?.visible && (
        <section aria-labelledby="actions-title">
          <div className="flex items-center gap-2 mb-4">
            <span className={`w-2 h-2 rounded-full ${totalUrgent > 0 ? 'bg-[var(--warning)] animate-pulse' : 'bg-[var(--success)]'}`} />
            <h2 id="actions-title" className="text-[14px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
              Actions prioritaires
            </h2>
            <span className="text-[12.5px] ml-1" style={{ color: 'var(--text-secondary)' }}>
              {totalUrgent > 0
                ? `${pluralize(totalUrgent, 'tâche nécessite', 'tâches nécessitent')} votre attention`
                : '· File de traitement à jour'}
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
              {[0,1,2,3].map(i => (
                <div key={i} className="h-20 rounded-xl" style={{ background: 'var(--border-subtle)' }} />
              ))}
            </div>
          ) : totalUrgent === 0 && visitScheduled === 0 ? (
            <div className="flex items-center gap-4 p-5 rounded-xl"
              style={{ background: 'var(--success-bg)', border: '1px solid rgba(34,197,94,0.2)' }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: 'rgba(34,197,94,0.15)', color: 'var(--success)' }}>
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[13.5px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Toutes les actions sont à jour
                </p>
                <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                  Aucune demande, proposition ou ticket en attente de traitement.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <ActionCard
                href="/dashboard/reservations?status=PENDING"
                icon={<Clock className="w-4 h-4" />}
                iconBgClass="kpi-icon-demandes"
                title="Demandes de réservation"
                count={pendingBookings}
                label="en attente"
                urgent
              />
              <ActionCard
                href="/dashboard/bailleurs?status=new"
                icon={<UserCheck className="w-4 h-4" />}
                iconBgClass="kpi-icon-proprietaires"
                title="Propositions propriétaires"
                count={newProposals}
                label="à examiner"
                urgent
              />
              <ActionCard
                href="/dashboard/visites"
                icon={<Calendar className="w-4 h-4" />}
                iconBgClass="kpi-icon-occupation"
                title="Visites programmées"
                count={visitScheduled}
                label="visite à venir"
              />
              <ActionCard
                href="/dashboard/support?status=new"
                icon={<Mail className="w-4 h-4" />}
                iconBgClass="kpi-icon-support"
                title="Tickets support"
                count={unresolvedContacts}
                label="sans réponse"
                urgent
              />
            </div>
          )}
        </section>
      )}

      {/* ── Domain Panels (2×2) ── */}
      {widgets.find(w => w.id === 'property-overview')?.visible && (
        <section aria-label="Domaines de gestion opérationnelle">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Réservations */}
            <DomainPanel
              title="Suivi des réservations"
              icon={<Calendar className="w-4 h-4" />}
              href="/dashboard/reservations"
              linkLabel="Voir les réservations"
              footer={
                <>
                  <span>Total historique</span>
                  <span className="font-semibold tabular-nums" style={{ color: 'var(--text-primary)' }}>
                    {m?.totalBookings ?? 0} demandes
                  </span>
                </>
              }
            >
              <DomainRow label="En attente de traitement" value={pendingBookings}
                valueClass={pendingBookings > 0 ? 'text-[var(--warning)]' : 'text-[var(--text-muted)]'} />
              <DomainRow label="Étudiants contactés" value={m?.contactedBookings ?? 0}
                valueClass={(m?.contactedBookings ?? 0) > 0 ? 'text-[var(--brand-primary)]' : 'text-[var(--text-muted)]'} />
              <DomainRow label="Visites planifiées" value={m?.visitScheduledBookings ?? 0}
                valueClass={(m?.visitScheduledBookings ?? 0) > 0 ? 'text-[var(--info)]' : 'text-[var(--text-muted)]'} />
              <DomainRow label="Réservations confirmées" value={m?.approvedBookings ?? 0}
                valueClass={(m?.approvedBookings ?? 0) > 0 ? 'text-[var(--success)]' : 'text-[var(--text-muted)]'} />
            </DomainPanel>

            {/* Parc */}
            <DomainPanel
              title="État du parc & des chambres"
              icon={<Building2 className="w-4 h-4" />}
              href="/dashboard/logements"
              linkLabel="Consulter le parc"
              footer={
                <>
                  <span>{m?.totalProperties ?? 0} logement{(m?.totalProperties ?? 0) > 1 ? 's' : ''} enregistré{(m?.totalProperties ?? 0) > 1 ? 's' : ''}</span>
                  <span className="italic" style={{ color: 'var(--text-muted)' }}>
                    Réservée = avant emménagement
                  </span>
                </>
              }
            >
              <DomainRow label="Chambres disponibles immédiatement" value={availableRooms}
                valueClass={availableRooms > 0 ? 'text-[var(--success)]' : 'text-[var(--text-muted)]'} />
              <DomainRow label="Chambres réservées" value={reservedRooms}
                valueClass={reservedRooms > 0 ? 'text-[var(--brand-primary)]' : 'text-[var(--text-muted)]'} />
              <DomainRow label="Chambres occupées" value={occupiedRooms}
                valueClass="text-[var(--text-primary)]" />
              <DomainRow label="En maintenance / travaux" value={maintenanceRooms}
                valueClass={maintenanceRooms > 0 ? 'text-[var(--danger)]' : 'text-[var(--text-muted)]'} />
            </DomainPanel>

            {/* Propriétaires */}
            <DomainPanel
              title="Propositions de propriétaires"
              icon={<UserCheck className="w-4 h-4" />}
              href="/dashboard/bailleurs"
              linkLabel="Voir les propositions"
              footer={
                <>
                  <span>Expansion territoriale active</span>
                  <span className="font-semibold" style={{ color: 'var(--brand-primary)' }}>StudRoom Partners</span>
                </>
              }
            >
              <DomainRow label="Nouvelles propositions à examiner" value={newProposals}
                valueClass={newProposals > 0 ? 'text-[var(--warning)]' : 'text-[var(--text-muted)]'} />
              <DomainRow label="Propositions contactées ou converties"
                value={Math.max(0, (m?.totalProposals ?? 0) - newProposals)}
                valueClass="text-[var(--text-primary)]" />
              <DomainRow label="Total des propositions enregistrées" value={m?.totalProposals ?? 0}
                valueClass="text-[var(--text-primary)]" />
              <DomainRow label="Logements actifs dans le parc"
                value={m?.totalProperties && m.totalProperties > 0
                  ? `${m.totalProperties} logement${m.totalProperties > 1 ? 's' : ''}`
                  : '—'}
                valueClass="text-[var(--success)]" />
            </DomainPanel>

            {/* Support */}
            <DomainPanel
              title="Support & Assistance étudiants"
              icon={<Mail className="w-4 h-4" />}
              href="/dashboard/support"
              linkLabel="Voir les tickets"
              footer={
                <>
                  <span>Permanence assistance</span>
                  <span className="flex items-center gap-1.5 font-medium" style={{ color: 'var(--success)' }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)]" />
                    Opérationnel
                  </span>
                </>
              }
            >
              <DomainRow label="Tickets ouverts sans réponse" value={unresolvedContacts}
                valueClass={unresolvedContacts > 0 ? 'text-[var(--warning)]' : 'text-[var(--text-muted)]'} />
              <DomainRow label="Tickets traités / résolus"
                value={Math.max(0, (m?.totalContacts ?? 0) - unresolvedContacts)}
                valueClass="text-[var(--success)]" />
              <DomainRow label="Total des messages reçus" value={m?.totalContacts ?? 0}
                valueClass="text-[var(--text-primary)]" />
              <DomainRow
                label="Taux de résolution"
                value={resolutionRate !== null ? `${resolutionRate}%` : '—'}
                valueClass={resolutionRate !== null && resolutionRate >= 80 ? 'text-[var(--success)]' : 'text-[var(--brand-primary)]'}
              />
            </DomainPanel>
          </div>
        </section>
      )}

      {/* ── Recent Activity ── */}
      {widgets.find(w => w.id === 'recent-activity')?.visible && (
        <section aria-labelledby="audit-title">
          <div className="dash-card p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-5 pb-4"
              style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 kpi-icon-support">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <h2 id="audit-title" className="text-[14px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Historique des opérations administratives
                  </h2>
                  <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    Journal chronologique et audit des événements système
                  </p>
                </div>
              </div>
              <Link
                href="/dashboard/audit"
                className="text-[12px] font-semibold flex items-center gap-1 transition-opacity hover:opacity-70"
                style={{ color: 'var(--brand-primary)' }}
              >
                Voir l&apos;historique complet
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Rows */}
            {loading ? (
              <div className="flex flex-col">
                {[0,1,2,3,4].map(i => <RowSkeleton key={i} />)}
              </div>
            ) : recentLogs.length === 0 ? (
              <div className="py-12 flex flex-col items-center text-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'var(--border-subtle)', color: 'var(--text-muted)' }}>
                  <Activity className="w-5 h-5" />
                </div>
                <p className="text-[13.5px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Aucune opération administrative récente.
                </p>
                <p className="text-[12.5px] max-w-sm" style={{ color: 'var(--text-secondary)' }}>
                  Les actions administratives apparaîtront automatiquement dans ce flux d&apos;activité.
                </p>
              </div>
            ) : (
              <div className="flex flex-col">
                {recentLogs.map((log) => (
                  <div
                    key={log.id}
                    className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 -mx-2 px-2 rounded-lg transition-colors"
                    style={{ borderBottom: '1px solid var(--border-subtle)' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'var(--bg-surface-hover)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = ''; }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: 'var(--brand-primary)' }} />
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[12px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
                          {log.action}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-mono"
                          style={{
                            background: 'var(--border-subtle)',
                            color: 'var(--text-secondary)',
                            border: '1px solid var(--border-default)',
                          }}>
                          {log.entity_type}
                        </span>
                        <span className="text-[11px] font-mono" style={{ color: 'var(--text-muted)' }}>
                          {log.entity_id ? log.entity_id.slice(0, 8) : '—'}
                        </span>
                      </div>
                    </div>
                    <span className="text-[11.5px] font-mono shrink-0 sm:text-right" style={{ color: 'var(--text-muted)' }}>
                      {new Date(log.created_at).toLocaleString('fr-FR', {
                        day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
                      })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Last Updated ── */}
      {lastUpdated && (
        <div className="flex items-center justify-end gap-1.5 text-[11.5px]" style={{ color: 'var(--text-muted)' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] opacity-70" />
          <span>{formatTimeAgo(secondsAgo)}</span>
          <span style={{ opacity: 0.5 }}>· Actualisation auto 60s</span>
        </div>
      )}
    </div>
  );
}
