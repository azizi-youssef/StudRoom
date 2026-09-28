import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PropertyDetail } from '@/shared/types';
import { PROPERTIES_DATA } from '@/data/properties';
import dynamic from 'next/dynamic';
import { PropertyGallery } from '@/components/properties/property-gallery';
import { PropertyAmenities } from '@/components/properties/property-amenities';
import { PropertyUniversityProximity } from '@/components/properties/property-university-proximity';
import { RoomSection } from '@/components/properties/room-section';
import { StickyBookingBar } from '@/components/properties/sticky-booking-bar';
import { Badge } from '@/components/ui/badge';
import { formatCurrencyDH, getPropertyTypeLabel, sanitizeImageUrl } from '@/lib/utils';

const PropertyLocationMap = dynamic(
  () => import('@/components/properties/property-location-map').then((mod) => mod.PropertyLocationMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-[320px] rounded-3xl bg-slate-100 dark:bg-slate-800 animate-pulse flex items-center justify-center text-xs text-slate-400 font-bold">
        Chargement de la carte...
      </div>
    ),
  }
);
import {
  MapPin,
  Bed,
  Maximize,
  Check,
  ChevronRight,
  Home,
  ShieldCheck,
  UserCheck,
  CheckCircle2,
  CalendarCheck,
  Star,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

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
    if (res.ok) {
      const json = await res.json();
      if (json.data) return json.data;
    }
  } catch {
    // Fallback transparent
  }

  // Fallback sur dataset enrichi local
  const found = PROPERTIES_DATA.find((p) => p.slug === slug);
  return found || null;
}

export async function generateStaticParams() {
  try {
    const res = await fetch(`${API_URL}/properties`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json.data?.properties)) {
        return json.data.properties.map((p: any) => ({ slug: p.slug }));
      }
    }
  } catch {
    // Fallback
  }
  return PROPERTIES_DATA.map((p) => ({ slug: p.slug }));
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

  const availableCount = property.available_rooms ?? property.rooms.filter((r) => r.status === 'AVAILABLE').length;
  const isAvailableNow = property.availability_type === 'AVAILABLE_NOW' || (availableCount > 0 && property.availability_type !== 'AVAILABLE_OCTOBER');
  const isAvailableOctober = property.availability_type === 'AVAILABLE_OCTOBER';
  const isFullyBooked = property.availability_type === 'FULLY_BOOKED' || (!isAvailableNow && !isAvailableOctober);
  const closestProximity = property.proximities[0];

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
          <nav
            aria-label="Fil d'Ariane"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500 mb-6"
          >
            <Link href="/" className="flex items-center gap-1 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              <Home className="w-3.5 h-3.5" />
              Accueil
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-700" />
            <Link href="/logements" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              Logements Selouane / Nador
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-700" />
            <span className="text-slate-600 dark:text-slate-300 font-bold truncate max-w-[200px] sm:max-w-xs">
              {property.title}
            </span>
          </nav>

          {/* Header Title Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge variant="primary" className="text-xs font-bold">
                  {getPropertyTypeLabel(property.property_type)}
                </Badge>

                {/* 🟠 Priorité 4 — Disponibilité */}
                {isAvailableNow && (
                  <Badge variant="success" className="text-xs font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    🟢 Disponible immédiatement ({availableCount} libre{availableCount > 1 ? 's' : ''})
                  </Badge>
                )}

                {isAvailableOctober && (
                  <Badge variant="primary" className="bg-amber-500 text-white border-none text-xs font-bold flex items-center gap-1.5">
                    <CalendarCheck className="w-3.5 h-3.5" />
                    🟡 Disponible le 1er Octobre 2026
                  </Badge>
                )}

                {isFullyBooked && (
                  <Badge variant="outline" className="text-xs font-bold bg-slate-200 dark:bg-slate-800 dark:text-slate-300">
                    🔴 Complet pour ce semestre
                  </Badge>
                )}

                {/* 🟠 Priorité 3 — Badge Vérification */}
                {property.is_verified && (
                  <span className="inline-flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 px-2.5 py-0.5 rounded-full text-xs font-black">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    ✓ Logement vérifié sur place
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                {property.title}
              </h1>

              <div className="flex flex-wrap items-center gap-3 text-slate-500 dark:text-slate-400 text-sm font-semibold mt-1.5">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-primary-600" />
                  <span>{property.address}, {property.neighborhood}, {property.city.name}</span>
                </div>

                {property.rating && (
                  <div className="flex items-center gap-1 text-amber-600 font-bold bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-lg border border-amber-200/60 dark:border-amber-800/40">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{property.rating.toFixed(1)} / 5</span>
                    <span className="text-xs text-amber-700 font-normal">
                      ({property.review_count} avis étudiants)
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="text-left md:text-right">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                Loyer mensuel dès
              </span>
              <div className="text-3xl font-black text-primary-600 dark:text-primary-400">
                {formatCurrencyDH(property.min_price_dh)}
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400"> / mois</span>
              </div>
              <span className="text-xs text-emerald-600 font-bold block mt-0.5">
                Sans frais d'agence · Wi-Fi inclus
              </span>
            </div>
          </div>

          {/* Main Grid: Gallery & Sticky Booking Bar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column: Gallery & Details */}
            <div className="lg:col-span-8 flex flex-col gap-10">
              {/* Photo Gallery */}
              <PropertyGallery images={property.images} title={property.title} />

              {/* 🟠 Priorité 3 — Carte de Confiance Commerciale */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-soft p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                        Garantie Vérification StudRoom
                      </h3>
                      <p className="text-xs text-slate-500">Sécurité et conformité attestées pour les étudiants</p>
                    </div>
                  </div>

                  {property.verified_at && (
                    <span className="text-[11px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
                      Dernière vérification : {property.verified_at}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-extrabold text-xs text-slate-900 dark:text-slate-100">
                        Logement inspecté
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Conformité électrique, plomberie et serrures contrôlées sur place.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40">
                    <UserCheck className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-extrabold text-xs text-slate-900 dark:text-slate-100">
                        Bailleur identifié
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {property.landlord_name || 'Propriétaire certifié'} ({property.landlord_response_time || '< 1h'}).
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40">
                    <Sparkles className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-extrabold text-xs text-slate-900 dark:text-slate-100">
                        Photos certifiées 100%
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Prises sans grand angle trompeur, conformité visuelle garantie.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Specs Pills */}
              <div className="grid grid-cols-3 gap-4 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-soft text-center">
                <div className="flex flex-col items-center">
                  <span className="text-xs font-bold text-slate-400 uppercase">Superficie</span>
                  <div className="flex items-center gap-1 font-black text-slate-900 dark:text-slate-100 text-lg mt-0.5">
                    <Maximize className="w-4 h-4 text-primary-600" />
                    {property.surface_sqm} m²
                  </div>
                </div>
                <div className="flex flex-col items-center border-x border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-bold text-slate-400 uppercase">Chambres</span>
                  <div className="flex items-center gap-1 font-black text-slate-900 dark:text-slate-100 text-lg mt-0.5">
                    <Bed className="w-4 h-4 text-primary-600" />
                    {property.total_rooms} {property.total_rooms > 1 ? 'chambres' : 'studio'}
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xs font-bold text-slate-400 uppercase">Disponibilité</span>
                  <div className="flex items-center gap-1 font-black text-emerald-600 text-lg mt-0.5">
                    <Check className="w-4 h-4" />
                    {isAvailableNow
                      ? `${availableCount} libre${availableCount > 1 ? 's' : ''}`
                      : isAvailableOctober
                      ? '1er Octobre'
                      : 'Complet'}
                  </div>
                </div>
              </div>

              {/* University Proximity Card */}
              <PropertyUniversityProximity proximities={property.proximities} />

              {/* Available Rooms Section */}
              <RoomSection rooms={property.rooms} property={property} />

              {/* Description */}
              <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-soft flex flex-col gap-4">
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                  Description du logement
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>
              </div>

              {/* Amenities Grid */}
              <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-soft">
                <PropertyAmenities amenities={property.amenities} />
              </div>

              {/* 🟠 Priorité 3 — Avis Étudiants Certifiés */}
              {property.reviews && property.reviews.length > 0 && (
                <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-soft space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-amber-500" />
                      Avis des étudiants résidents
                    </h3>
                    <div className="flex items-center gap-1.5 font-black text-slate-900 dark:text-slate-100 text-sm">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      {property.rating?.toFixed(1)} / 5 ({property.reviews.length} avis certifiés)
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {property.reviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-extrabold text-sm text-slate-900 dark:text-slate-100 block">
                              {rev.student_name}
                            </span>
                            <span className="text-[11px] text-purple-700 dark:text-purple-400 font-bold">
                              Étudiant {rev.university_short}
                            </span>
                          </div>
                          <div className="flex items-center gap-0.5 text-amber-400">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${
                                  i < Math.floor(rev.rating)
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-slate-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed">
                          « {rev.comment} »
                        </p>

                        <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400 font-medium">
                          <span>{rev.date}</span>
                          <span className="text-emerald-600 font-bold flex items-center gap-1">
                            ✓ Résident vérifié
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 🟡 Priorité 5 — Interactive Location Map */}
              <PropertyLocationMap
                address={property.address}
                neighborhood={property.neighborhood}
                city={property.city.name}
                lat={property.location_lat}
                lng={property.location_lng}
                universityName={closestProximity?.university?.short_name}
                walkingMinutes={closestProximity?.walking_time_min}
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
