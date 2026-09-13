import React from 'react';
import { GraduationCap, Footprints, Bus } from 'lucide-react';
import { UniversityProximityItem } from '@/shared/types';
import { formatDistanceKm } from '@/lib/utils';

interface PropertyUniversityProximityProps {
  proximities: UniversityProximityItem[];
}

export function PropertyUniversityProximity({ proximities }: PropertyUniversityProximityProps) {
  return (
    <div className="bg-primary-50/60 rounded-3xl p-6 border border-primary-100 flex flex-col gap-4">
      <div className="flex items-center gap-2 text-primary-700">
        <GraduationCap className="w-6 h-6 text-primary-600" />
        <h3 className="text-lg font-extrabold">Proximité des Universités</h3>
      </div>

      <div className="flex flex-col gap-3">
        {proximities.map((prox) => (
          <div
            key={prox.id}
            className="bg-white p-4 rounded-2xl border border-primary-100/80 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div>
              <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                {prox.university.name}
              </h4>
              <span className="text-xs text-slate-500 font-medium">
                Distance : {formatDistanceKm(prox.distance_km)}
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-xl border border-emerald-200">
                <Footprints className="w-4 h-4 text-emerald-600" />
                <span>{prox.walking_time_min} min à pied</span>
              </div>
              <div className="flex items-center gap-1.5 bg-primary-50 text-primary-700 px-3 py-1.5 rounded-xl border border-primary-200">
                <Bus className="w-4 h-4 text-primary-600" />
                <span>{prox.transit_time_min} min transport</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
