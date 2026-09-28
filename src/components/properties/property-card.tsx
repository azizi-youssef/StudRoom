'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  MapPin,
  Wifi,
  Laptop,
  Home,
  ArrowRight,
  Bed,
  Clock,
  ShieldCheck,
  Star,
  CheckCircle2,
  CalendarCheck,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import { PropertyDetail } from '@/shared/types';
import { formatCurrencyDH, getPropertyTypeLabel, sanitizeImageUrl } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface PropertyCardProps {
  property: PropertyDetail;
  selectedUniversityId?: string;
  onHover?: (id: string | null) => void;
  isHighlighted?: boolean;
}

export function PropertyCard({
  property,
  selectedUniversityId,
  onHover,
  isHighlighted = false,
}: PropertyCardProps) {
  // Proximité : si un campus est sélectionné, trouver la proximité vers celui-ci, sinon prendre la plus proche
  const matchedProximity = selectedUniversityId && selectedUniversityId !== 'all'
    ? property.proximities.find((p) => p.university_id === selectedUniversityId)
    : property.proximities[0];

  const closestProximity = matchedProximity || property.proximities[0];
  const availableRoomsCount = property.available_rooms ?? property.rooms.filter((r) => r.status === 'AVAILABLE').length;
  const imageSrc = sanitizeImageUrl(property.primary_image || property.images?.[0]?.image_url);

  // Détermination du statut de disponibilité
  const isAvailableNow = property.availability_type === 'AVAILABLE_NOW' || (availableRoomsCount > 0 && property.availability_type !== 'AVAILABLE_OCTOBER');
  const isAvailableOctober = property.availability_type === 'AVAILABLE_OCTOBER';
  const isFullyBooked = property.availability_type === 'FULLY_BOOKED' || (!isAvailableNow && !isAvailableOctober);

  return (
    <div
      onMouseEnter={() => onHover?.(property.id)}
      onMouseLeave={() => onHover?.(null)}
      className={`bg-white dark:bg-slate-900 rounded-3xl border transition-all duration-300 overflow-hidden flex flex-col group ${
        isHighlighted
          ? 'border-primary-500 ring-2 ring-primary-500/30 shadow-xl -translate-y-2'
          : 'border-slate-200/90 dark:border-slate-800/80 shadow-soft hover:shadow-card hover:-translate-y-1.5'
      }`}
    >
      {/* 🔴 Priorité 2 — Image Container avec Badges & Confiance */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
        <Image
          src={imageSrc}
          alt={property.title}
          fill
          unoptimized={imageSrc.startsWith('data:') || imageSrc.startsWith('blob:')}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

        {/* Top Badges Header */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2 pointer-events-none z-10">
          {/* Type de logement */}
          <Badge
            variant="primary"
            className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md text-primary-700 dark:text-primary-300 shadow-sm border-white/80 dark:border-slate-700 font-extrabold text-[11px] px-3 py-1 rounded-full"
          >
            {getPropertyTypeLabel(property.property_type)}
          </Badge>

          {/* 🟠 Priorité 4 — Badge Disponibilité */}
          {isAvailableNow && (
            <Badge
              variant="success"
              className="bg-emerald-600/95 backdrop-blur-md text-white font-bold text-[11px] border-none shadow-sm px-3 py-1 rounded-full flex items-center gap-1.5"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
              🟢 {availableRoomsCount > 0 ? `${availableRoomsCount} ch. libre${availableRoomsCount > 1 ? 's' : ''}` : 'Disponible'}
            </Badge>
          )}

          {isAvailableOctober && (
            <Badge
              variant="primary"
              className="bg-amber-500/95 backdrop-blur-md text-white font-bold text-[11px] border-none shadow-sm px-3 py-1 rounded-full flex items-center gap-1.5"
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              🟡 Dispo 1er Octobre
            </Badge>
          )}

          {isFullyBooked && (
            <Badge
              variant="outline"
              className="bg-rose-900/90 backdrop-blur-md text-white border-none font-bold text-[11px] px-3 py-1 rounded-full flex items-center gap-1"
            >
              🔴 Complet
            </Badge>
          )}
        </div>

        {/* 🟠 Priorité 3 — Badge Vérification StudRoom sur la photo */}
        {property.is_verified && (
          <div className="absolute top-12 left-3.5 bg-emerald-950/85 backdrop-blur-md border border-emerald-500/40 text-emerald-300 px-2.5 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-1.5 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>✓ Logement vérifié</span>
          </div>
        )}

        {/* 🔴 Priorité 2 & 🟡 Priorité 5 — Proximité Campus Pill */}
        {closestProximity && (
          <div className="absolute bottom-3 left-3.5 right-3.5 bg-slate-950/85 backdrop-blur-md text-white px-3.5 py-2 rounded-2xl text-xs font-bold flex items-center justify-between border border-white/15 dark:border-white/10 shadow-lg">
            <div className="flex items-center gap-2 truncate">
              <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">
                À {closestProximity.walking_time_min} min à pied de {closestProximity.university.short_name}
              </span>
            </div>
            <span className="text-[11px] text-emerald-400 font-extrabold shrink-0 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/30">
              {closestProximity.distance_km < 1
                ? `${Math.round(closestProximity.distance_km * 1000)} m`
                : `${closestProximity.distance_km.toFixed(1)} km`}
            </span>
          </div>
        )}
      </div>

      {/* Content Body */}
      <div className="p-5 flex flex-col flex-grow gap-3.5">
        {/* Title & Location */}
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs font-semibold">
              <MapPin className="w-3.5 h-3.5 text-primary-500 shrink-0" />
              <span className="truncate">{property.neighborhood}, {property.city.name}</span>
            </div>

            {/* Note & Avis Étudiants (Priorité 3) */}
            {property.rating && (
              <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-lg text-xs font-black border border-amber-200/60 dark:border-amber-800/40 shrink-0">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>{property.rating.toFixed(1)}</span>
                {property.review_count && (
                  <span className="text-[10px] text-amber-700/80 dark:text-amber-400/80 font-medium">
                    ({property.review_count})
                  </span>
                )}
              </div>
            )}
          </div>

          <Link href={`/logements/${property.slug}`}>
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-1">
              {property.title}
            </h3>
          </Link>
        </div>

        {/* 🟠 Priorité 3 — Ligne de Confiance (Propriétaire & Audit) */}
        <div className="flex items-center flex-wrap gap-2 text-[11px] text-slate-500 dark:text-slate-400 py-1 border-y border-slate-100 dark:border-slate-800/80">
          {property.landlord_verified && (
            <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200/60 dark:border-emerald-800/50">
              <UserCheck className="w-3 h-3" />
              Bailleur vérifié
            </span>
          )}
          {property.photos_verified && (
            <span className="inline-flex items-center gap-1 text-blue-700 dark:text-blue-400 font-semibold">
              <CheckCircle2 className="w-3 h-3 text-blue-500" />
              Photos réelles
            </span>
          )}
          {property.verified_at && (
            <span className="text-[10px] text-slate-400 dark:text-slate-500 ml-auto">
              Vérifié le {property.verified_at}
            </span>
          )}
        </div>

        {/* 🔴 Priorité 2 — Équipements clés */}
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
            {property.total_rooms} {property.total_rooms > 1 ? 'chambres' : 'studio'}
          </span>
        </div>

        {/* 🔴 Priorité 2 — Prix & CTA Footer */}
        <div className="pt-3.5 border-t border-slate-100 dark:border-slate-800/80 mt-auto flex items-center justify-between gap-3">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Dès
              </span>
              <span className="text-xl font-black text-primary-600 dark:text-primary-400 tracking-tight">
                {formatCurrencyDH(property.min_price_dh)}
              </span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">/ mois</span>
            </div>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block">
              Sans frais d’agence · Wi-Fi inclus
            </span>
          </div>

          <Link href={`/logements/${property.slug}`}>
            <Button
              variant="primary"
              size="md"
              className="font-extrabold text-sm gap-2 rounded-full px-6 py-2.5 shadow-md group-hover:shadow-glow-primary group-hover:scale-105 transition-all"
            >
              Voir l'offre
              <ArrowRight className="w-4.5 h-4.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
