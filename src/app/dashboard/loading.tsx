import React from 'react';

/**
 * Loading state pour le dashboard admin.
 * Affiché pendant le chargement initial et les navigations.
 */
export default function DashboardLoading() {
  return (
    <div className="p-6 xl:p-8 space-y-8 animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="h-7 w-64 rounded-lg bg-slate-200 dark:bg-slate-700" />
          <div className="h-4 w-48 rounded-full bg-slate-100 dark:bg-slate-800" />
        </div>
        <div className="h-9 w-32 rounded-xl bg-slate-200 dark:bg-slate-700" />
      </div>

      {/* KPI cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div className="h-3 w-28 rounded-full bg-slate-200 dark:bg-slate-700" />
              <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700" />
            </div>
            <div className="h-8 w-20 rounded-lg bg-slate-200 dark:bg-slate-700" />
            <div className="h-3 w-40 rounded-full bg-slate-100 dark:bg-slate-800" />
          </div>
        ))}
      </div>

      {/* Quick actions skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-700 shrink-0" />
            <div className="space-y-1.5 flex-1">
              <div className="h-3 w-20 rounded-full bg-slate-200 dark:bg-slate-700" />
              <div className="h-3 w-12 rounded-full bg-slate-100 dark:bg-slate-800" />
            </div>
          </div>
        ))}
      </div>

      {/* Domain panels skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="h-4 w-40 rounded-full bg-slate-200 dark:bg-slate-700" />
              <div className="h-3 w-20 rounded-full bg-slate-100 dark:bg-slate-800" />
            </div>
            {Array.from({ length: 4 }).map((_, j) => (
              <div key={j} className="flex items-center justify-between py-1">
                <div className="h-3 w-32 rounded-full bg-slate-100 dark:bg-slate-800" />
                <div className="h-3 w-16 rounded-full bg-slate-200 dark:bg-slate-700" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
