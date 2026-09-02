import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Wifi, Laptop, Home, ArrowRight, Bed, Clock } from 'lucide-react';
import { PropertyDetail } from '@/shared/types';
import { formatCurrencyDH, getPropertyTypeLabel } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface PropertyCardProps {
  property: PropertyDetail;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const closestProximity = property.proximities[0];
  const availableRoomsCount = property.available_rooms ?? property.rooms.filter(r => r.status === 'AVAILABLE').length;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft hover:shadow-hover transition-all duration-300 overflow-hidden flex flex-col group">
      
      {/* Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <Image
          src={property.primary_image}
          alt={property.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
          <Badge variant="primary" className="bg-white/95 backdrop-blur-md text-brand-700 shadow-sm border-white font-bold">
            {getPropertyTypeLabel(property.property_type)}
          </Badge>
          
          {availableRoomsCount > 0 ? (
            <Badge variant="success" className="bg-emerald-600 text-white font-bold border-none shadow-sm">
              {availableRoomsCount} chambre{availableRoomsCount > 1 ? 's' : ''} dispo
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-slate-900/80 text-white border-none font-bold">
              Complet
            </Badge>
          )}
        </div>

        {/* Proximity Pill */}
        {closestProximity && (
          <div className="absolute bottom-3 left-4 bg-slate-900/80 backdrop-blur-md text-white px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-white/20">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>À {closestProximity.walking_time_min} min à pied de {closestProximity.university.short_name}</span>
          </div>
        )}
      </div>

      {/* Content Body */}
      <div className="p-6 flex flex-col flex-grow gap-4">
        
        {/* Title & Location */}
        <div>
          <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold mb-1">
            <MapPin className="w-3.5 h-3.5 text-brand-500" />
            <span>{property.neighborhood}, {property.city.name}</span>
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-1">
            {property.title}
          </h3>
        </div>

        {/* Features Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700">
            <Home className="w-3.5 h-3.5 text-slate-500" />
            Meublé
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700">
            <Wifi className="w-3.5 h-3.5 text-slate-500" />
            Wi-Fi
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700">
            <Laptop className="w-3.5 h-3.5 text-slate-500" />
            Bureau
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700">
            <Bed className="w-3.5 h-3.5 text-slate-500" />
            {property.total_rooms} chambres
          </span>
        </div>

        {/* Price & CTA Footer */}
        <div className="pt-4 border-t border-slate-100 mt-auto flex items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Loyer mensuel
            </span>
            <div className="text-lg font-black text-brand-600">
              À partir de {formatCurrencyDH(property.min_price_dh)}
              <span className="text-xs font-semibold text-slate-500"> / mois</span>
            </div>
          </div>

          <Link href={`/logements/${property.slug}`}>
            <Button variant="primary" size="sm" className="font-semibold gap-1">
              Voir les chambres
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

      </div>

    </div>
  );
}
