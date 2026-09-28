'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { PropertyDetail, PropertyFilterState } from '@/shared/types';
import { DbUniversity, DbCity } from '@/shared/types/database';
import { UNIVERSITIES_DATA } from '@/data/universities';
import { CITIES_DATA } from '@/data/cities';
import { clientPropertyService } from '@/client/services/property.service';
import { PropertyFilterBar } from '@/components/properties/property-filter-bar';
import { PropertyCard } from '@/components/properties/property-card';
import { PropertyCardSkeleton } from '@/components/properties/property-card-skeleton';
import {
  SearchX,
  Loader2,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  X,
  Sparkles,
  MapPin,
  CalendarCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Chargement dynamique du composant Carte Leaflet sans SSR
const PropertyMap = dynamic(() => import('@/components/properties/property-map'), {
  ssr: false,
  loading: () => (
    <div className="h-[520px] w-full bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse flex flex-col items-center justify-center gap-3">
      <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
      <span className="text-xs font-bold text-slate-500">Chargement de la carte interactive Selouane / Nador...</span>
    </div>
  ),
});

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

function LogementsContent() {
  const searchParams = useSearchParams();

  const [universities, setUniversities] = useState<DbUniversity[]>(UNIVERSITIES_DATA);
  const [cities, setCities] = useState<DbCity[]>(CITIES_DATA);
  const [properties, setProperties] = useState<PropertyDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [viewMode, setViewMode] = useState<'grid' | 'split' | 'map'>('grid');
  const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(null);

  const [filters, setFilters] = useState<PropertyFilterState>({
    searchQuery: searchParams.get('q') || '',
    citySlug: searchParams.get('city') || 'all',
    neighborhood: 'all',
    universityId: searchParams.get('university') || 'all',
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : 0,
    minPrice: 0,
    propertyType: searchParams.get('type') || 'all',
    roomType: searchParams.get('roomType') || 'all',
    roomCount: 'all',
    amenities: [],
    availability: 'all',
    onlyVerified: false,
    sortBy: 'featured',
  });

  // Chargement des données de référence (avec fallback instantané)
  useEffect(() => {
    async function fetchMeta() {
      try {
        const [citiesRes, uniRes] = await Promise.allSettled([
          fetch(`${API_URL}/cities`).then((r) => r.json()),
          fetch(`${API_URL}/universities`).then((r) => r.json()),
        ]);
        if (citiesRes.status === 'fulfilled' && citiesRes.value?.success) {
          setCities(citiesRes.value.data);
        }
        if (uniRes.status === 'fulfilled' && uniRes.value?.success) {
          setUniversities(uniRes.value.data);
        }
      } catch (err) {
        console.error('Error loading meta data:', err);
      }
    }
    fetchMeta();
  }, []);

  // Chargement des logements filtrés
  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const res = await clientPropertyService.searchProperties(filters);
      if (res.success && res.data) {
        setProperties(res.data.properties ?? []);
        if (res.data.meta) {
          setPagination({
            total: res.data.meta.total,
            page: res.data.meta.page,
            totalPages: res.data.meta.totalPages,
          });
        }
      }
    } catch (err) {
      console.error('Error loading properties:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const selectedUni = universities.find((u) => u.id === filters.universityId);

  return (
    <>
      {/* 🔴 Priorité 1 — Barre de recherche & filtres avancés */}
      <div className="mb-4">
        <PropertyFilterBar
          filters={filters}
          onChange={setFilters}
          universities={universities}
          cities={cities}
          totalResults={properties.length}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      </div>

      {/* Quick University Filter Pills */}
      {universities.length > 0 && (
        <div className="mb-4 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider whitespace-nowrap flex items-center gap-1.5 mr-1">
            <GraduationCap className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            Campus :
          </span>
          <button
            type="button"
            onClick={() => setFilters((prev) => ({ ...prev, universityId: 'all' }))}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              filters.universityId === 'all'
                ? 'bg-purple-700 text-white shadow-xs font-extrabold ring-2 ring-purple-500/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/90 dark:border-slate-800'
            }`}
          >
            Tous les campus ({properties.length})
          </button>
          {universities.map((uni) => {
            const count = properties.filter((p) =>
              p.proximities.some((prox) => prox.university_id === uni.id)
            ).length;

            return (
              <button
                key={uni.id}
                type="button"
                onClick={() => setFilters((prev) => ({ ...prev, universityId: uni.id }))}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  filters.universityId === uni.id
                    ? 'bg-purple-700 text-white shadow-xs font-extrabold ring-2 ring-purple-500/20'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/90 dark:border-slate-800'
                }`}
              >
                <span>{uni.short_name}</span>
                {count > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                      filters.universityId === uni.id ? 'bg-purple-900/60 text-purple-200' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* 🟠 Priorité 3 — Bannière Confiance & Sceau de Garantie Commerciale */}
      <div className="mb-6 bg-gradient-to-r from-emerald-500/10 via-primary-500/10 to-teal-500/10 border border-emerald-500/20 dark:border-emerald-500/30 rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
              Engagement Confiance StudRoom
              <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                100% Vérifié
              </span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Chaque logement affiché a été inspecté sur place à Selouane. Photos certifiées conformes, propriétaires identifiés et zéro frais d’agence.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-bold text-emerald-700 dark:text-emerald-400 shrink-0">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            Bailleurs vérifiés
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            Visite physique
          </span>
        </div>
      </div>

      {/* Chips de filtres actifs */}
      {(filters.universityId !== 'all' ||
        filters.maxPrice > 0 ||
        filters.propertyType !== 'all' ||
        filters.availability !== 'all' ||
        filters.onlyVerified ||
        filters.searchQuery) && (
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400">Filtres actifs :</span>

          {filters.searchQuery && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              « {filters.searchQuery} »
              <button
                type="button"
                onClick={() => setFilters((prev) => ({ ...prev, searchQuery: '' }))}
                className="hover:text-rose-500"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.universityId !== 'all' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
              🎓 {selectedUni?.short_name || 'Campus'}
              <button
                type="button"
                onClick={() => setFilters((prev) => ({ ...prev, universityId: 'all' }))}
                className="hover:text-rose-500"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.maxPrice > 0 && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              💰 Max {filters.maxPrice} DH
              <button
                type="button"
                onClick={() => setFilters((prev) => ({ ...prev, maxPrice: 0 }))}
                className="hover:text-rose-500"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.propertyType !== 'all' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              🏠 {filters.propertyType}
              <button
                type="button"
                onClick={() => setFilters((prev) => ({ ...prev, propertyType: 'all' }))}
                className="hover:text-rose-500"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.availability !== 'all' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              📅 {filters.availability === 'now' ? '🟢 Immédiat' : filters.availability === 'october' ? '🟡 1er Octobre' : '🔴 Complet'}
              <button
                type="button"
                onClick={() => setFilters((prev) => ({ ...prev, availability: 'all' }))}
                className="hover:text-rose-500"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.onlyVerified && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-xs">
              ✓ Logements vérifiés
              <button
                type="button"
                onClick={() => setFilters((prev) => ({ ...prev, onlyVerified: false }))}
                className="hover:text-emerald-200"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Affichage conditionnel selon le View Mode (Grille / Split / Carte) */}
      {viewMode === 'map' ? (
        /* 🟡 Priorité 5 — Pleine Carte */
        <div className="space-y-4">
          <PropertyMap
            properties={properties}
            universities={universities}
            selectedUniversityId={filters.universityId}
            onSelectUniversity={(id) => setFilters((prev) => ({ ...prev, universityId: id }))}
            hoveredPropertyId={hoveredPropertyId}
            onSelectProperty={(id) => setHoveredPropertyId(id)}
            className="h-[680px]"
          />
        </div>
      ) : viewMode === 'split' ? (
        /* 🔴 Priorité 1 & 🟡 Priorité 5 — Vue Partagée (Liste + Carte) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Colonne Cartes (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <PropertyCardSkeleton key={i} />
                ))}
              </div>
            ) : properties.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {properties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    selectedUniversityId={filters.universityId}
                    onHover={setHoveredPropertyId}
                    isHighlighted={hoveredPropertyId === property.id}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 text-center flex flex-col items-center gap-3">
                <SearchX className="w-8 h-8 text-slate-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Aucun résultat</h3>
                <p className="text-xs text-slate-500">Ajustez vos filtres pour voir d'autres logements.</p>
              </div>
            )}
          </div>

          {/* Colonne Carte Sticky (6 cols) */}
          <div className="lg:col-span-6 sticky top-28">
            <PropertyMap
              properties={properties}
              universities={universities}
              selectedUniversityId={filters.universityId}
              onSelectUniversity={(id) => setFilters((prev) => ({ ...prev, universityId: id }))}
              hoveredPropertyId={hoveredPropertyId}
              onSelectProperty={(id) => setHoveredPropertyId(id)}
              className="h-[calc(100vh-140px)] min-h-[500px]"
            />
          </div>
        </div>
      ) : (
        /* 🔴 Priorité 2 — Vue Grille Pleine Largeur (Cards standard) */
        <>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <PropertyCardSkeleton key={i} />
              ))}
            </div>
          ) : properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  selectedUniversityId={filters.universityId}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-10 text-center flex flex-col items-center gap-4 my-6">
              <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center">
                <SearchX className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Aucun logement ne correspond à vos critères
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md">
                Essayez d'élargir votre budget ou de désactiver certains filtres.
              </p>
              <Button
                variant="outline"
                onClick={() =>
                  setFilters({
                    searchQuery: '',
                    citySlug: 'all',
                    neighborhood: 'all',
                    universityId: 'all',
                    maxPrice: 0,
                    minPrice: 0,
                    propertyType: 'all',
                    roomType: 'all',
                    roomCount: 'all',
                    amenities: [],
                    availability: 'all',
                    onlyVerified: false,
                    sortBy: 'featured',
                  })
                }
                className="rounded-full text-xs font-bold"
              >
                Réinitialiser tous les filtres
              </Button>
            </div>
          )}
        </>
      )}

      {/* Pagination */}
      {!loading && pagination.totalPages > 1 && viewMode !== 'map' && (
        <div className="flex items-center justify-center gap-3 mt-10">
          <button
            type="button"
            disabled={pagination.page <= 1}
            onClick={() => setFilters((prev) => ({ ...prev, page: (prev.page ?? 1) - 1 }))}
            className="px-5 py-2.5 rounded-full text-sm font-bold border border-slate-200 bg-white shadow-xs hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            ← Précédent
          </button>
          <span className="text-sm font-semibold text-slate-500">
            Page {pagination.page} / {pagination.totalPages}
            <span className="ml-2 text-xs text-slate-400">({pagination.total} logements)</span>
          </span>
          <button
            type="button"
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => setFilters((prev) => ({ ...prev, page: (prev.page ?? 1) + 1 }))}
            className="px-5 py-2.5 rounded-full text-sm font-bold border border-slate-200 bg-white shadow-xs hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            Suivant →
          </button>
        </div>
      )}
    </>
  );
}

export default function LogementsPage() {
  return (
    <div className="pt-24 pb-16 bg-mesh-light min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Hero Section */}
        <div className="mb-6 max-w-3xl">
          <div className="inline-flex items-center gap-2 text-[11px] font-extrabold text-primary-700 dark:text-primary-300 uppercase tracking-wider bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm px-3.5 py-1 rounded-full border border-primary-200/80 dark:border-primary-800/80 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Catalogue Logements Étudiants Certifiés · Selouane & Nador
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight mt-2.5">
            Trouve ton logement idéal à{' '}
            <span className="bg-gradient-to-r from-primary-600 to-accent-teal bg-clip-text text-transparent">
              Selouane / Nador
            </span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed">
            Recherche par proximité aux facultés (FSAN, FEGN, FSJPN, FLLAN, EST, ISTA). Logements 100% vérifiés, disponibilité en direct et calcul de distance piétonne.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
            </div>
          }
        >
          <LogementsContent />
        </Suspense>
      </div>
    </div>
  );
}
