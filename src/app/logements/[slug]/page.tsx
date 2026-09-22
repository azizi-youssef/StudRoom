import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PropertyDetail } from '@/shared/types';
import { PropertyGallery } from '@/components/properties/property-gallery';
import { PropertyAmenities } from '@/components/properties/property-amenities';
import { PropertyUniversityProximity } from '@/components/properties/property-university-proximity';
import { PropertyLocationMap } from '@/components/properties/property-location-map';
import { RoomSection } from '@/components/properties/room-section';
import { StickyBookingBar } from '@/components/properties/sticky-booking-bar';
import { Badge } from '@/components/ui/badge';
import { formatCurrencyDH, getPropertyTypeLabel, sanitizeImageUrl } from '@/lib/utils';
import { MapPin, Bed, Maximize, Check, ChevronRight, Home, Share2 } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

interface PropertyDetailPageProps {
  params: {
    slug: string;
  };
}

async function getProperty(slug: string): Promise<PropertyDetail | null> {
  try {
    const res = await fetch(`${API_URL}/properties/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? null;
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  try {
    const res = await fetch(`${API_URL}/properties`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const json = await res.json();
    return (json.data as PropertyDetail[]).map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PropertyDetailPageProps) {
  const property = await getProperty(params.slug);
  if (!property) return {};
  return {
    title: `${property.title} — Chambres Étudiantes à Selouane Nador | StudRoom`,
    description: `${property.title} à Selouane Nador. ${property.description.slice(0, 150)}...`,
  };
}

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const property = await getProperty(params.slug);

  if (!property) {
    notFound();
  }

  const availableCount = property.rooms.filter((r) => r.status === 'AVAILABLE').length;

  return (
    <>
      {/* JSON-LD Structured Data — RealEstateListing */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'RealEstateListing',
            name: property.title,
            description: property.description,
            url: `https://studroom.ma/logements/${property.slug}`,
            image: sanitizeImageUrl(property.images?.[0]?.image_url ?? property.primary_image),
            address: {
              '@type': 'PostalAddress',
              streetAddress: property.address,
              addressLocality: property.city.name,
              addressCountry: 'MA',
            },
            offers: {
              '@type': 'Offer',
              priceCurrency: 'MAD',
              price: property.min_price_dh,
              availability:
                availableCount > 0
                  ? 'https://schema.org/InStock'
                  : 'https://schema.org/OutOfStock',
            },
          }),
        }}
      />

      <div className="pt-24 pb-24 bg-slate-50 dark:bg-slate-950 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Breadcrumb */}
          <nav aria-label="Fil d'Ariane" className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500 mb-6">
            <Link href="/" className="flex items-center gap-1 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              <Home className="w-3.5 h-3.5" />
              Accueil
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-700" />
            <Link href="/logements" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              Logements
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-700" />
            <span className="text-slate-600 dark:text-slate-300 font-bold truncate max-w-[200px] sm:max-w-xs">
              {property.title}
            </span>
          </nav>

          {/* Header Title Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="primary" className="text-xs font-bold">
                {getPropertyTypeLabel(property.property_type)}
              </Badge>
              {availableCount > 0 ? (
                <Badge variant="success" className="text-xs font-bold">
                  {availableCount} chambre{availableCount > 1 ? 's' : ''} disponible{availableCount > 1 ? 's' : ''}
                </Badge>
              ) : (
                <Badge variant="outline" className="text-xs font-bold bg-slate-200 dark:bg-slate-800 dark:text-slate-300">
                  Résidence complète
                </Badge>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              {property.title}
            </h1>
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-semibold mt-1">
              <MapPin className="w-4 h-4 text-primary-600" />
              <span>{property.address}, {property.neighborhood}, {property.city.name}</span>
            </div>
          </div>

          <div className="text-left md:text-right">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">Loyer mensuel dès</span>
            <div className="text-3xl font-black text-primary-600 dark:text-primary-400">
              {formatCurrencyDH(property.min_price_dh)}
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400"> / mois</span>
            </div>
          </div>
        </div>

        {/* Main Grid: Gallery & Sticky Booking Bar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Gallery & Details */}
          <div className="lg:col-span-8 flex flex-col gap-10">
            
            {/* Photo Gallery */}
            <PropertyGallery images={property.images} title={property.title} />

            {/* Key Specs Pills */}
            <div className="grid grid-cols-3 gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-soft text-center">
              <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-slate-400 uppercase">Superficie</span>
                <div className="flex items-center gap-1 font-black text-slate-900 text-lg mt-0.5">
                  <Maximize className="w-4 h-4 text-primary-600" />
                  {property.surface_sqm} m²
                </div>
              </div>
              <div className="flex flex-col items-center border-x border-slate-100">
                <span className="text-xs font-bold text-slate-400 uppercase">Chambres</span>
                <div className="flex items-center gap-1 font-black text-slate-900 text-lg mt-0.5">
                  <Bed className="w-4 h-4 text-primary-600" />
                  {property.total_rooms} chambres
                </div>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-slate-400 uppercase">Disponibles</span>
                <div className="flex items-center gap-1 font-black text-emerald-600 text-lg mt-0.5">
                  <Check className="w-4 h-4" />
                  {availableCount} libre{availableCount > 1 ? 's' : ''}
                </div>
              </div>
            </div>

            {/* University Proximity Card */}
            <PropertyUniversityProximity proximities={property.proximities} />

            {/* Available Rooms Section */}
            <RoomSection rooms={property.rooms} property={property} />

            {/* Description */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-soft flex flex-col gap-4">
              <h3 className="text-xl font-extrabold text-slate-900">Description du logement</h3>
              <p className="text-slate-600 text-base leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {/* Amenities Grid */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-soft">
              <PropertyAmenities amenities={property.amenities} />
            </div>

            {/* Location Map */}
            <PropertyLocationMap
              address={property.address}
              neighborhood={property.neighborhood}
              city={property.city.name}
              lat={property.location_lat}
              lng={property.location_lng}
            />

          </div>

          {/* Right Column: Sticky Action Bar */}
          <div className="lg:col-span-4">
            <StickyBookingBar property={property} />
          </div>

        </div>

        </div>
      </div>
    </>
  );
}
