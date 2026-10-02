'use client';

import React from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowUpRight,
  ChevronRight,
} from 'lucide-react';

// ── Types communs ─────────────────────────────────────────────────────────────

export function pluralize(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 || count === -1 ? singular : plural}`;
}

export function formatTimeAgo(seconds: number): string {
  if (seconds < 10) return "à l'instant";
  if (seconds < 60) return `il y a ${seconds}s`;
  const m = Math.floor(seconds / 60);
  return `il y a ${m} min`;
}

// ── Skeletons ─────────────────────────────────────────────────────────────────

export function KpiSkeleton() {
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

export function RowSkeleton() {
  return (
    <div
      className="py-3 flex items-center justify-between gap-4 animate-pulse"
      style={{ borderBottom: '1px solid var(--border-subtle)' }}
    >
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

export function KpiCard({
  label, value, sub, icon, iconClass, href, trend, trendLabel, isNeutralZero = false
}: KpiCardProps) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'var(--success)' : trend === 'down' ? 'var(--danger)' : 'var(--text-muted)';

  const inner = (
    <div className="dash-card p-6 flex flex-col gap-4 h-full group">
      <div className="flex items-start justify-between">
        <p className="text-[11.5px] font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
          {label}
        </p>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-150 group-hover:scale-105 ${iconClass}`}>
          {icon}
        </div>
      </div>
      <div>
        <div
          className="text-[34px] font-bold tracking-tight leading-none mb-1"
          style={{ color: isNeutralZero ? 'var(--text-muted)' : 'var(--text-primary)' }}
        >
          {value}
        </div>
        <div className="text-[12.5px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {sub}
        </div>
      </div>
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
      <Link
        href={href}
        className="block h-full focus-visible:outline-none focus-visible:ring-2 rounded-[12px]"
        style={{ '--tw-ring-color': 'var(--brand-primary)' } as React.CSSProperties}
      >
        {inner}
      </Link>
    );
  }
  return inner;
}

// ── Status Badge ──────────────────────────────────────────────────────────────

export function StatusBadge({
  value, colorClass, neutral
}: { value: number; colorClass: string; neutral?: boolean }) {
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

export function ActionCard({ href, icon, iconBgClass, title, count, label, urgent }: ActionCardProps) {
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
          <p
            className="text-[11.5px] mt-0.5"
            style={{ color: count > 0 && urgent ? 'var(--warning)' : 'var(--text-muted)' }}
          >
            {count > 0 ? (
              <span className="font-semibold">{pluralize(count, label, label + 's')}</span>
            ) : (
              'À jour'
            )}
          </p>
        </div>
      </div>
      <ChevronRight
        className="w-4 h-4 shrink-0 transition-transform duration-150 group-hover:translate-x-0.5"
        style={{ color: 'var(--text-muted)' }}
      />
    </Link>
  );
}

// ── Domain Panel ──────────────────────────────────────────────────────────────

export function DomainPanel({
  title, icon, href, linkLabel, children, footer,
}: {
  title: string;
  icon: React.ReactNode;
  href: string;
  linkLabel: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="dash-card p-6 flex flex-col gap-0">
      <div
        className="flex items-center justify-between mb-4 pb-4"
        style={{ borderBottom: '1px solid var(--border-subtle)' }}
      >
        <span className="text-[14px] font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <span className="text-[var(--brand-primary)]">{icon}</span>
          {title}
        </span>
        <Link
          href={href}
          className="text-[12px] font-semibold flex items-center gap-1 transition-colors hover:opacity-70"
          style={{ color: 'var(--brand-primary)' }}
        >
          {linkLabel}
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
      <div className="flex flex-col divide-y" style={{ '--tw-divide-opacity': 1 } as React.CSSProperties}>
        {children}
      </div>
      {footer && (
        <div
          className="mt-4 pt-3 flex items-center justify-between text-[11.5px]"
          style={{ borderTop: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}
        >
          {footer}
        </div>
      )}
    </div>
  );
}

export function DomainRow({ label, value, valueClass }: { label: string; value: React.ReactNode; valueClass?: string }) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <span className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>{label}</span>
      <span className={`text-[13px] font-semibold tabular-nums ${valueClass ?? ''}`}>{value}</span>
    </div>
  );
}
