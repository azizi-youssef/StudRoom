import React from 'react';

export function PropertyCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden flex flex-col animate-pulse">
      {/* Image Skeleton */}
      <div className="relative aspect-[16/10] bg-slate-200 flex flex-col justify-between p-4">
        <div className="flex items-center justify-between">
          <div className="h-6 w-24 bg-white/70 backdrop-blur-sm rounded-full" />
          <div className="h-6 w-28 bg-emerald-200/60 rounded-full" />
        </div>
        <div className="h-6 w-48 bg-slate-800/30 backdrop-blur-sm rounded-xl" />
      </div>

      {/* Body Skeleton */}
      <div className="p-6 flex flex-col flex-grow gap-4 justify-between">
        <div className="flex flex-col gap-2.5">
          {/* Location line */}
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-full bg-slate-200" />
            <div className="h-3.5 w-32 bg-slate-200 rounded-md" />
          </div>

          {/* Title */}
          <div className="h-6 w-4/5 bg-slate-300 rounded-lg" />

          {/* Features pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <div className="h-6 w-16 bg-slate-100 rounded-lg" />
            <div className="h-6 w-14 bg-slate-100 rounded-lg" />
            <div className="h-6 w-16 bg-slate-100 rounded-lg" />
            <div className="h-6 w-20 bg-slate-100 rounded-lg" />
          </div>
        </div>

        {/* Price & CTA Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-2">
          <div className="flex flex-col gap-1.5">
            <div className="h-3 w-16 bg-slate-200 rounded" />
            <div className="h-6 w-28 bg-slate-300 rounded-lg" />
          </div>
          <div className="h-10 w-28 bg-brand-100 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
