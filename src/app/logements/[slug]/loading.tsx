import React from 'react';

/**
 * Loading state pour le détail d'un logement (/logements/[slug]).
 */
export default function LogementDetailLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-pulse">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        <div className="h-4 w-16 rounded-full bg-slate-200 dark:bg-slate-700" />
        <div className="h-4 w-4 rounded-full bg-slate-100 dark:bg-slate-800" />
        <div className="h-4 w-40 rounded-full bg-slate-200 dark:bg-slate-700" />
      </div>

      {/* Gallery skeleton */}
      <div className="grid grid-cols-4 grid-rows-2 gap-2 h-80 rounded-2xl overflow-hidden">
        <div className="col-span-2 row-span-2 bg-slate-200 dark:bg-slate-700" />
        <div className="bg-slate-200 dark:bg-slate-700" />
        <div className="bg-slate-200 dark:bg-slate-700" />
        <div className="bg-slate-200 dark:bg-slate-700" />
        <div className="bg-slate-200 dark:bg-slate-700" />
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <div className="space-y-3">
            <div className="h-8 w-3/4 rounded-lg bg-slate-200 dark:bg-slate-700" />
            <div className="h-4 w-1/2 rounded-full bg-slate-100 dark:bg-slate-800" />
          </div>
          {/* Badges */}
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-7 w-20 rounded-full bg-slate-100 dark:bg-slate-800" />
            ))}
          </div>
          {/* Description */}
          <div className="space-y-2">
            <div className="h-4 w-full rounded-full bg-slate-100 dark:bg-slate-800" />
            <div className="h-4 w-5/6 rounded-full bg-slate-100 dark:bg-slate-800" />
            <div className="h-4 w-4/6 rounded-full bg-slate-100 dark:bg-slate-800" />
          </div>
          {/* Amenities */}
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-10 rounded-xl bg-slate-100 dark:bg-slate-800" />
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
            <div className="h-6 w-32 rounded-lg bg-slate-200 dark:bg-slate-700" />
            <div className="h-12 rounded-xl bg-slate-200 dark:bg-slate-700" />
            <div className="h-10 rounded-xl bg-slate-200 dark:bg-slate-700" />
          </div>
        </div>
      </div>
    </div>
  );
}
