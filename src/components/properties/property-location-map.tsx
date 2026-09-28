'use client';

import React, { useEffect, useRef } from 'react';
import { MapPin, Navigation, Compass, Footprints } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

interface PropertyLocationMapProps {
  address: string;
  neighborhood: string;
  city: string;
  lat: number;
  lng: number;
  universityName?: string;
  walkingMinutes?: number;
}

export function PropertyLocationMap({
  address,
  neighborhood,
  city,
  lat,
  lng,
  universityName,
  walkingMinutes,
}: PropertyLocationMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    let L: any;
    try {
      L = require('leaflet');
    } catch {
      return;
    }

    const map = L.map(mapContainerRef.current, {
      center: [lat, lng],
      zoom: 16,
      zoomControl: false,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      maxZoom: 19,
    }).addTo(map);

    L.control.zoom({ position: 'topright' }).addTo(map);

    // Pin stylisé pour le logement
    const pinIcon = L.divIcon({
      className: 'property-pin-detail',
      html: `
        <div class="relative flex items-center justify-center">
          <div class="w-10 h-10 rounded-full bg-emerald-500/20 animate-ping absolute"></div>
          <div class="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center shadow-xl border-2 border-white text-sm font-black">
            🏠
          </div>
          <div class="w-2 h-2 bg-primary-600 rotate-45 mx-auto -mt-1 border-r border-b border-white"></div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 36],
    });

    L.marker([lat, lng], { icon: pinIcon })
      .addTo(map)
      .bindPopup(`<b>${address}</b><br>${neighborhood}, ${city}`)
      .openPopup();

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [lat, lng, address, neighborhood, city]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          Localisation & Environnement
        </h3>

        {walkingMinutes && universityName && (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800">
            <Footprints className="w-3.5 h-3.5" />
            À {walkingMinutes} min à pied de {universityName}
          </span>
        )}
      </div>

      <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-soft h-[320px] bg-slate-100">
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Overlay d'information en bas */}
        <div className="absolute bottom-3 left-3 right-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-white/80 dark:border-slate-800 flex items-center justify-between gap-3 z-10">
          <div>
            <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
              {address}
            </h4>
            <p className="text-[11px] text-slate-500 font-medium">
              Quartier {neighborhood}, {city} • Proche campus
            </p>
          </div>

          <a
            href={`https://maps.google.com/?q=${lat},${lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-primary-50 text-primary-700 dark:text-primary-400 font-bold text-xs shrink-0 transition-colors"
          >
            <Compass className="w-3.5 h-3.5" />
            Google Maps ↗
          </a>
        </div>
      </div>
    </div>
  );
}
