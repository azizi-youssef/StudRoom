'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PropertyDetail } from '@/shared/types';
import { DbUniversity } from '@/shared/types/database';
import { formatCurrencyDH, sanitizeImageUrl } from '@/lib/utils';
import {
  MapPin,
  Navigation,
  Crosshair,
  GraduationCap,
  Home,
  Clock,
  Compass,
  ArrowRight,
  ShieldCheck,
  Star,
  Maximize2,
  Minimize2,
  Footprints,
} from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Formule de Haversine pour calcul précis de distance en km
export function calculateHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Rayon de la Terre en km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Estimation du temps de marche (vitesse moyenne piéton : 5 km/h -> 12 min/km)
export function estimateWalkingTimeMinutes(distanceKm: number): number {
  return Math.max(1, Math.round(distanceKm * 12));
}

interface PropertyMapProps {
  properties: PropertyDetail[];
  universities: DbUniversity[];
  selectedUniversityId?: string;
  onSelectUniversity?: (universityId: string) => void;
  hoveredPropertyId?: string | null;
  onSelectProperty?: (propertyId: string) => void;
  className?: string;
}

export default function PropertyMap({
  properties,
  universities,
  selectedUniversityId,
  onSelectUniversity,
  hoveredPropertyId,
  onSelectProperty,
  className = 'h-[580px]',
}: PropertyMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const userMarkerRef = useRef<any>(null);

  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<PropertyDetail | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Campus de référence actuel (soit le sélectionné, soit FSAN Selouane par défaut)
  const activeUniversity = useMemo(() => {
    if (selectedUniversityId && selectedUniversityId !== 'all') {
      return universities.find((u) => u.id === selectedUniversityId);
    }
    return universities.find((u) => u.short_name.includes('FSAN')) || universities[0];
  }, [selectedUniversityId, universities]);

  // Initialisation de la carte Leaflet
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    let L: any;
    try {
      L = require('leaflet');
    } catch (e) {
      console.error('Erreur chargement Leaflet:', e);
      return;
    }

    // Centre par défaut : Quartier Universitaire / Al Omrane Selouane
    const defaultCenter: [number, number] = [35.0765, -2.909];
    const map = L.map(mapContainerRef.current, {
      center: defaultCenter,
      zoom: 15,
      zoomControl: false,
    });

    // Tuiles OpenStreetMap CartoDB Positron élégantes et légères
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    // Contrôle de zoom en haut à droite
    L.control.zoom({ position: 'topright' }).addTo(map);

    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Mise à jour des marqueurs (Campus + Logements)
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    const L = require('leaflet');
    markersLayer.clearLayers();

    // 1. 🏫 Marqueurs des Campus Universitaires
    universities.forEach((uni) => {
      const isSelected = activeUniversity?.id === uni.id;
      const campusIcon = L.divIcon({
        className: 'campus-marker-wrapper',
        html: `
          <div class="relative group cursor-pointer transition-transform duration-300 hover:scale-110 ${
            isSelected ? 'scale-110 z-30' : 'z-20'
          }">
            <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-black text-xs shadow-lg border-2 ${
              isSelected
                ? 'bg-purple-700 text-white border-white ring-4 ring-purple-500/30'
                : 'bg-indigo-900 text-purple-100 border-purple-400/80 hover:bg-purple-800'
            }">
              <span class="text-base">🎓</span>
              <span class="tracking-tight whitespace-nowrap">${uni.short_name}</span>
            </div>
            <div class="w-2 h-2 bg-purple-700 rotate-45 mx-auto -mt-1 border-r border-b border-white"></div>
          </div>
        `,
        iconSize: [120, 36],
        iconAnchor: [60, 34],
      });

      const marker = L.marker([uni.location_lat, uni.location_lng], { icon: campusIcon });
      marker.on('click', () => {
        onSelectUniversity?.(uni.id);
        map.flyTo([uni.location_lat, uni.location_lng], 16, { duration: 0.8 });
      });
      marker.bindPopup(`
        <div class="p-2 text-slate-900 font-sans max-w-xs">
          <div class="flex items-center gap-1.5 text-purple-700 font-black text-xs uppercase mb-1">
            <span>🏫 Campus Universitaire</span>
          </div>
          <h4 class="font-extrabold text-sm mb-1">${uni.name}</h4>
          <p class="text-xs text-slate-500 mb-2">${uni.address}</p>
          <div class="text-[11px] bg-purple-50 text-purple-800 font-bold p-2 rounded-xl mb-2">
            📍 Référence pour le calcul de distance piétonne
          </div>
          <button
            onclick="window.dispatchEvent(new CustomEvent('filter-by-campus', { detail: '${uni.id}' }))"
            class="w-full text-center py-1.5 px-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            Filtrer les logements proches
          </button>
        </div>
      `);
      markersLayer.addLayer(marker);
    });

    // 2. 🏠 Marqueurs des Logements avec Pastilles Prix & Statut Disponibilité
    properties.forEach((prop) => {
      const isHovered = hoveredPropertyId === prop.id;
      const isSelected = selectedProperty?.id === prop.id;

      // Calcul de distance au campus actif
      const distKm = activeUniversity
        ? calculateHaversineDistanceKm(
            prop.location_lat,
            prop.location_lng,
            activeUniversity.location_lat,
            activeUniversity.location_lng
          )
        : null;
      const walkingMins = distKm !== null ? estimateWalkingTimeMinutes(distKm) : null;

      // Style selon la disponibilité
      const isAvailNow = prop.availability_type === 'AVAILABLE_NOW' || (prop.available_rooms > 0 && prop.availability_type !== 'AVAILABLE_OCTOBER');
      const isOctober = prop.availability_type === 'AVAILABLE_OCTOBER';
      const isFull = prop.availability_type === 'FULLY_BOOKED' || (!isAvailNow && !isOctober);

      const statusColor = isAvailNow
        ? 'bg-emerald-600 text-white border-emerald-400'
        : isOctober
        ? 'bg-amber-500 text-white border-amber-300'
        : 'bg-slate-800 text-slate-300 border-slate-600 line-through';

      const dotColor = isAvailNow ? 'bg-emerald-300' : isOctober ? 'bg-amber-300' : 'bg-rose-400';

      const propIcon = L.divIcon({
        className: 'property-marker-wrapper',
        html: `
          <div class="relative group cursor-pointer transition-all duration-300 ${
            isHovered || isSelected ? 'scale-125 z-40' : 'hover:scale-115 z-10'
          }">
            <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-full font-black text-xs shadow-md border-2 ${statusColor} ${
          isHovered || isSelected ? 'ring-4 ring-emerald-400/50 shadow-xl' : ''
        }">
              <span class="w-2 h-2 rounded-full ${dotColor} ${isAvailNow ? 'animate-pulse' : ''}"></span>
              <span>${formatCurrencyDH(prop.min_price_dh)}</span>
            </div>
            <div class="w-1.5 h-1.5 ${statusColor} rotate-45 mx-auto -mt-0.5 border-r border-b"></div>
          </div>
        `,
        iconSize: [90, 32],
        iconAnchor: [45, 30],
      });

      const marker = L.marker([prop.location_lat, prop.location_lng], { icon: propIcon });
      marker.on('click', () => {
        setSelectedProperty(prop);
        onSelectProperty?.(prop.id);
        map.panTo([prop.location_lat, prop.location_lng]);
      });

      markersLayer.addLayer(marker);
    });
  }, [properties, universities, activeUniversity, hoveredPropertyId, selectedProperty, onSelectProperty, onSelectUniversity]);

  // Écouteur global d'événement pour le popup de campus
  useEffect(() => {
    const handler = (e: any) => {
      if (e.detail && onSelectUniversity) {
        onSelectUniversity(e.detail);
      }
    };
    window.addEventListener('filter-by-campus', handler);
    return () => window.removeEventListener('filter-by-campus', handler);
  }, [onSelectUniversity]);

  // 📍 Géolocalisation ("Me localiser")
  const handleLocateMe = () => {
    setIsLocating(true);
    if (!navigator.geolocation) {
      alert('La géolocalisation n’est pas supportée par votre navigateur.');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(coords);
        setIsLocating(false);

        const map = mapInstanceRef.current;
        if (map) {
          const L = require('leaflet');
          if (userMarkerRef.current) {
            userMarkerRef.current.remove();
          }

          const userIcon = L.divIcon({
            className: 'user-pin-wrapper',
            html: `
              <div class="relative flex items-center justify-center">
                <div class="w-8 h-8 rounded-full bg-blue-500/25 animate-ping absolute"></div>
                <div class="w-5 h-5 rounded-full bg-blue-600 border-2 border-white shadow-xl flex items-center justify-center text-white text-[10px] font-black z-10">
                  📍
                </div>
              </div>
            `,
            iconSize: [32, 32],
            iconAnchor: [16, 16],
          });

          userMarkerRef.current = L.marker([coords.lat, coords.lng], { icon: userIcon })
            .addTo(map)
            .bindPopup('<b>Vous êtes ici 📍</b><br>Vos distances sont calculées en direct !')
            .openPopup();

          map.flyTo([coords.lat, coords.lng], 16, { duration: 1 });
        }
      },
      () => {
        // En cas de refus ou erreur de permission, simuler la position au rond-point universitaire Selouane
        const fallbackCoords = { lat: 35.0768, lng: -2.9102 };
        setUserLocation(fallbackCoords);
        setIsLocating(false);

        const map = mapInstanceRef.current;
        if (map) {
          const L = require('leaflet');
          if (userMarkerRef.current) userMarkerRef.current.remove();

          const userIcon = L.divIcon({
            className: 'user-pin-wrapper',
            html: `
              <div class="relative flex items-center justify-center">
                <div class="w-8 h-8 rounded-full bg-blue-500/25 animate-ping absolute"></div>
                <div class="w-5 h-5 rounded-full bg-blue-600 border-2 border-white shadow-xl flex items-center justify-center text-white text-[10px] font-black z-10">
                  📍
                </div>
              </div>
            `,
            iconSize: [32, 32],
            iconAnchor: [16, 16],
          });

          userMarkerRef.current = L.marker([fallbackCoords.lat, fallbackCoords.lng], { icon: userIcon })
            .addTo(map)
            .bindPopup('<b>Position simulée (Selouane) 📍</b><br>Calcul des distances activé.')
            .openPopup();

          map.flyTo([fallbackCoords.lat, fallbackCoords.lng], 16, { duration: 1 });
        }
      },
      { timeout: 7000 }
    );
  };

  // Recentrer la carte sur Selouane / Campus
  const handleResetView = () => {
    const map = mapInstanceRef.current;
    if (map) {
      if (activeUniversity) {
        map.flyTo([activeUniversity.location_lat, activeUniversity.location_lng], 15, { duration: 0.8 });
      } else {
        map.flyTo([35.0765, -2.909], 15, { duration: 0.8 });
      }
    }
  };

  return (
    <div
      className={`relative w-full rounded-3xl overflow-hidden border border-slate-200/90 dark:border-slate-800 shadow-soft bg-slate-100 dark:bg-slate-900 transition-all ${className} ${
        isFullscreen ? 'fixed inset-4 z-50 h-auto shadow-2xl' : ''
      }`}
    >
      {/* Conteneur DOM Leaflet */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Barre d'outils flottante supérieure */}
      <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none z-10 gap-2">
        {/* Badge campus de référence & Distance */}
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-md pointer-events-auto flex items-center gap-2 max-w-sm">
          <GraduationCap className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
          <div className="truncate text-xs">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase block leading-none">
              Campus de référence :
            </span>
            <span className="font-extrabold text-slate-800 dark:text-slate-100 truncate">
              {activeUniversity?.short_name || 'Selouane Université'}
            </span>
          </div>
        </div>

        {/* Boutons d'action carte */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          {/* Bouton Me Localiser */}
          <button
            type="button"
            onClick={handleLocateMe}
            disabled={isLocating}
            title="Me localiser / Calculer les distances"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 hover:bg-slate-100 dark:hover:bg-slate-800 text-blue-600 dark:text-blue-400 font-extrabold text-xs shadow-md border border-slate-200/80 dark:border-slate-700 transition-all"
          >
            <Crosshair className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Ma position</span>
          </button>

          {/* Bouton Recentrer */}
          <button
            type="button"
            onClick={handleResetView}
            title="Recentrer sur le campus"
            className="p-2 rounded-2xl bg-white/95 dark:bg-slate-900/95 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold shadow-md border border-slate-200/80 dark:border-slate-700 transition-all"
          >
            <Compass className="w-4 h-4 text-primary-600" />
          </button>

          {/* Plein écran */}
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'Réduire' : 'Plein écran'}
            className="p-2 rounded-2xl bg-white/95 dark:bg-slate-900/95 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold shadow-md border border-slate-200/80 dark:border-slate-700 transition-all"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Légende flottante inférieure gauche */}
      <div className="absolute bottom-3.5 left-3.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-lg z-10 hidden sm:flex items-center gap-3.5 text-[11px] font-bold text-slate-700 dark:text-slate-300 pointer-events-auto">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Disponible</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          <span>1er Octobre</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-700"></span>
          <span>Complet</span>
        </div>
        <div className="flex items-center gap-1.5 text-purple-700 dark:text-purple-400">
          <span>🎓 Campus</span>
        </div>
      </div>

      {/* Modal / Card d'aperçu d'un logement sélectionné sur la carte */}
      {selectedProperty && (
        <div className="absolute bottom-3.5 right-3.5 left-3.5 sm:left-auto sm:w-80 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-2xl p-3.5 z-20 transition-all animate-in fade-in slide-in-from-bottom-4">
          <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-2.5 bg-slate-100">
            <Image
              src={sanitizeImageUrl(selectedProperty.primary_image || selectedProperty.images?.[0]?.image_url)}
              alt={selectedProperty.title}
              fill
              className="object-cover"
            />
            <button
              type="button"
              onClick={() => setSelectedProperty(null)}
              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-slate-950/70 text-white flex items-center justify-center text-xs hover:bg-slate-950 transition-colors"
            >
              ✕
            </button>
            <div className="absolute bottom-2 left-2 bg-slate-950/80 backdrop-blur-md text-white px-2 py-0.5 rounded-lg text-[10px] font-bold">
              {selectedProperty.neighborhood}, Selouane
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-1">
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 line-clamp-1">
                {selectedProperty.title}
              </h4>
              {selectedProperty.rating && (
                <span className="flex items-center gap-0.5 text-xs font-black text-amber-500 shrink-0">
                  <Star className="w-3 h-3 fill-amber-400" />
                  {selectedProperty.rating.toFixed(1)}
                </span>
              )}
            </div>

            {/* Calcul de distance en direct */}
            {activeUniversity && (
              <div className="flex items-center gap-1.5 text-xs font-bold text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 px-2 py-1 rounded-xl">
                <Footprints className="w-3.5 h-3.5 shrink-0" />
                <span>
                  À {estimateWalkingTimeMinutes(
                    calculateHaversineDistanceKm(
                      selectedProperty.location_lat,
                      selectedProperty.location_lng,
                      activeUniversity.location_lat,
                      activeUniversity.location_lng
                    )
                  )} min à pied de {activeUniversity.short_name}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="text-base font-black text-primary-600 dark:text-primary-400">
                {formatCurrencyDH(selectedProperty.min_price_dh)}
                <span className="text-xs font-normal text-slate-500"> / mois</span>
              </div>

              <Link href={`/logements/${selectedProperty.slug}`}>
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-primary-600 text-white font-bold text-xs hover:bg-primary-700 transition-colors shadow-xs">
                  Voir
                  <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
