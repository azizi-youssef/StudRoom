import React from 'react';
import { MapPin, Navigation, Compass } from 'lucide-react';

interface PropertyLocationMapProps {
  address: string;
  neighborhood: string;
  city: string;
  lat: number;
  lng: number;
}

export function PropertyLocationMap({ address, neighborhood, city, lat, lng }: PropertyLocationMapProps) {
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=MOCK_KEY&q=${lat},${lng}`;

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
        <MapPin className="w-5 h-5 text-primary-600" />
        Localisation du logement
      </h3>

      <div className="bg-slate-100 rounded-3xl overflow-hidden border border-slate-200 shadow-inner relative aspect-[16/9] sm:aspect-[21/9] flex items-center justify-center p-6 text-center">
        
        {/* Decorative Map Pattern Graphic */}
        <div className="absolute inset-0 bg-gradient-to-tr from-primary-900/10 to-slate-900/20 pointer-events-none" />

        <div className="relative z-10 bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-xl max-w-md border border-white flex flex-col gap-3 items-center">
          <div className="w-12 h-12 rounded-full bg-primary-600 text-white flex items-center justify-center shadow-lg">
            <Navigation className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 text-base">{address}</h4>
            <p className="text-xs text-slate-500 font-semibold mt-1">
              Quartier {neighborhood}, {city} • Selouane
            </p>
          </div>
          <a
            href={`https://maps.google.com/?q=${lat},${lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-600 hover:text-primary-800 underline mt-1"
          >
            <Compass className="w-4 h-4" />
            Ouvrir dans Google Maps →
          </a>
        </div>
      </div>
    </div>
  );
}
