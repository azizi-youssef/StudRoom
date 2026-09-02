import React from 'react';
import { 
  Wifi, Laptop, Bed, Folder, Utensils, Shirt, Wind, Flame, Sun, ShieldCheck, Sparkles, Car, Check
} from 'lucide-react';
import { DbAmenity } from '@/shared/types/database';

interface PropertyAmenitiesProps {
  amenities: DbAmenity[];
}

const ICON_MAP: Record<string, any> = {
  Wifi,
  Laptop,
  Bed,
  Folder,
  Utensils,
  Shirt,
  Wind,
  Flame,
  Sun,
  ShieldCheck,
  Sparkles,
  Car,
};

export function PropertyAmenities({ amenities }: PropertyAmenitiesProps) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-xl font-extrabold text-slate-900">Équipements & Confort inclus</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {amenities.map((amenity) => {
          const IconComponent = ICON_MAP[amenity.icon_name] || Check;
          return (
            <div
              key={amenity.id}
              className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-100/80"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center flex-shrink-0">
                <IconComponent className="w-5 h-5" />
              </div>
              <span className="text-sm font-semibold text-slate-800 leading-tight">
                {amenity.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
