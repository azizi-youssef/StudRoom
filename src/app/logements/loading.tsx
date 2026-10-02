import React from 'react';

/**
 * Loading state pour la page de listing des logements.
 * Affiché automatiquement par Next.js App Router pendant le fetch SSR.
 */
export default function LogementsLoading() {
  return (
    <div className="min-h-screen bg-surface-light dark:bg-slate-950">
      {/* Filter bar skeleton */}
      <div className="sticky top-16 z-40 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3 animate-pulse">
          <div className="h-10 w-64 rounded-xl bg-slate-200 dark:bg-slate-700" />
          <div className="h-10 w-32 rounded-xl bg-slate-200 dark:bg-slate-700" />
          <div className="h-10 w-32 rounded-xl bg-slate-200 dark:bg-slate-700" />
          <div className="h-10 w-28 rounded-xl bg-slate-200 dark:bg-slate-700" />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Results count skeleton */}
        <div className="flex items-center justify-between mb-6 animate-pulse">
          <div className="h-5 w-48 rounded-full bg-slate-200 dark:bg-slate-700" />
          <div className="h-9 w-32 rounded-xl bg-slate-200 dark:bg-slate-700" />
        </div>

        {/* Property cards grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <PropertyCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

function PropertyCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 animate-pulse">
      {/* Image */}
      <div className="h-52 bg-slate-200 dark:bg-slate-700" />
      {/* Content */}
      <div className="p-4 flex flex-col gap-3">
        <div className="h-4 w-3/4 rounded-full bg-slate-200 dark:bg-slate-700" />
        <div className="h-3 w-1/2 rounded-full bg-slate-100 dark:bg-slate-800" />
        <div className="flex gap-2 mt-1">
          <div className="h-6 w-16 rounded-full bg-slate-100 dark:bg-slate-800" />
          <div className="h-6 w-16 rounded-full bg-slate-100 dark:bg-slate-800" />
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="h-6 w-24 rounded-full bg-slate-200 dark:bg-slate-700" />
          <div className="h-9 w-28 rounded-xl bg-slate-200 dark:bg-slate-700" />
        </div>
      </div>
    </div>
  );
}
