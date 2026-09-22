import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Wifi, Laptop, Home, ArrowRight, Bed, Clock } from 'lucide-react';
import { PropertyDetail } from '@/shared/types';
import { formatCurrencyDH, getPropertyTypeLabel, sanitizeImageUrl } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface PropertyCardProps {
  property: PropertyDetail;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const closestProximity = property.proximities[0];
  const availableRoomsCount = property.available_rooms ?? property.rooms.filter(r => r.status === 'AVAILABLE').length;
  const imageSrc = sanitizeImageUrl(property.primary_image || property.images?.[0]?.image_url);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800/80 shadow-soft hover:shadow-card hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col group">
      
      {/* Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <Image
          src={imageSrc}
          alt={property.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
          <Badge variant="primary" className="bg-white/95 backdrop-blur-md text-primary-700 shadow-sm border-white/80 font-black text-[11px] px-3 py-1 rounded-full">
            {getPropertyTypeLabel(property.property_type)}
          </Badge>
          
          {availableRoomsCount > 0 ? (
            <Badge variant="success" className="bg-emerald-600/95 backdrop-blur-md text-white font-bold text-[11px] border-none shadow-sm px-3 py-1 rounded-full flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-ping" />
              {availableRoomsCount} chambre{availableRoomsCount > 1 ? 's' : ''} libre{availableRoomsCount > 1 ? 's' : ''}
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-slate-900/90 backdrop-blur-md text-white border-none font-bold text-[11px] px-3 py-1 rounded-full">
              Complet
            </Badge>
          )}
        </div>

        {/* Proximity Pill */}
        {closestProximity && (
          <div className="absolute bottom-3 left-3.5 right-3.5 bg-slate-950/80 dark:bg-slate-950/90 backdrop-blur-md text-white px-3 py-1.5 rounded-2xl text-xs font-bold flex items-center gap-2 border border-white/15 dark:border-white/10">
            <Clock className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span className="truncate">À {closestProximity.walking_time_min} min à pied de {closestProximity.university.short_name}</span>
          </div>
        )}
      </div>

      {/* Content Body */}
      <div className="p-5 sm:p-6 flex flex-col flex-grow gap-4">
        
        {/* Title & Location */}
        <div>
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs font-bold mb-1.5">
            <MapPin className="w-3.5 h-3.5 text-primary-500 flex-shrink-0" />
            <span className="truncate">{property.neighborhood}, {property.city.name}</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100 group-hover:text-primary-400 dark:group-hover:text-primary-400 transition-colors line-clamp-1">
            {property.title}
          </h3>
        </div>

        {/* Features Badges */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold bg-slate-100/90 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300">
            <Home className="w-3 h-3 text-primary-600 dark:text-primary-400" />
            Meublé
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold bg-slate-100/90 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300">
            <Wifi className="w-3 h-3 text-primary-600 dark:text-primary-400" />
            Fibre
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold bg-slate-100/90 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300">
            <Laptop className="w-3 h-3 text-primary-600 dark:text-primary-400" />
            Bureau
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold bg-slate-100/90 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300">
            <Bed className="w-3 h-3 text-primary-600 dark:text-primary-400" />
            {property.total_rooms} chambres
          </span>
        </div>

        {/* Price & CTA Footer */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 mt-auto flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              Dès
            </span>
            <div className="text-lg font-black text-primary-600 dark:text-primary-400 leading-tight">
              {formatCurrencyDH(property.min_price_dh)}
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400"> / mois</span>
            </div>
          </div>

          <Link href={`/logements/${property.slug}`}>
            <Button variant="primary" size="sm" className="font-bold text-xs gap-1.5 rounded-full px-4 shadow-soft group-hover:shadow-glow-primary">
              Voir l'offre
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

      </div>

    </div>
  );
}

