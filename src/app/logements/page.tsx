'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PropertyDetail, PropertyFilterState } from '@/shared/types';
import { DbUniversity, DbCity } from '@/shared/types/database';
import { clientPropertyService } from '@/client/services/property.service';
import { PropertyFilterBar } from '@/components/properties/property-filter-bar';
import { PropertyCard } from '@/components/properties/property-card';
import { PropertyCardSkeleton } from '@/components/properties/property-card-skeleton';
import { SearchX, Loader2, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

function LogementsContent() {
  const searchParams = useSearchParams();

  const [universities, setUniversities] = useState<DbUniversity[]>([]);
  const [cities, setCities] = useState<DbCity[]>([]);
  const [properties, setProperties] = useState<PropertyDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });

  const [filters, setFilters] = useState<PropertyFilterState>({
    searchQuery: searchParams.get('q') || '',
    citySlug: searchParams.get('city') || 'all',
    neighborhood: 'all',
    universityId: searchParams.get('university') || 'all',
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : 0,
    minPrice: 0,
    propertyType: 'all',
    roomType: searchParams.get('roomType') || 'all',
    roomCount: 'all',
    amenities: [],
    sortBy: 'featured',
  });

  // Fetch reference data (cities, universities) once
  useEffect(() => {
    async function fetchMeta() {
      try {
        const [citiesRes, uniRes] = await Promise.all([
          fetch(`${API_URL}/cities`).then((r) => r.json()),
          fetch(`${API_URL}/universities`).then((r) => r.json()),
        ]);
        if (citiesRes.success) setCities(citiesRes.data);
        if (uniRes.success) setUniversities(uniRes.data);
      } catch (err) {
        console.error('Error loading meta data:', err);
      }
    }
    fetchMeta();
  }, []);

  // Fetch properties from backend whenever filters change
  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const res = await clientPropertyService.searchProperties(filters);
      if (res.success && res.data) {
        setProperties(res.data.properties ?? []);
        if (res.data.meta) {
          setPagination({
            total:      res.data.meta.total,
            page:       res.data.meta.page,
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

  return (
    <>
      {/* Filter Bar */}
      <div className="mb-6">
        <PropertyFilterBar
          filters={filters}
          onChange={setFilters}
          universities={universities}
          cities={cities}
          totalResults={properties.length}
        />
      </div>

      {/* Quick University Filter Pills */}
      {universities.length > 0 && (
        <div className="mb-8 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap flex items-center gap-1.5 mr-1">
            <GraduationCap className="w-4 h-4 text-primary-600" />
            Campus :
          </span>
          <button
            type="button"
            onClick={() => setFilters((prev) => ({ ...prev, universityId: 'all' }))}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              filters.universityId === 'all'
                ? 'bg-primary-600 text-white shadow-soft font-bold'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80 shadow-xs'
            }`}
          >
            Toutes les universités
          </button>
          {universities.map((uni) => (
            <button
              key={uni.id}
              type="button"
              onClick={() => setFilters((prev) => ({ ...prev, universityId: uni.id }))}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                filters.universityId === uni.id
                  ? 'bg-primary-600 text-white shadow-soft font-bold'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80 shadow-xs'
              }`}
            >
              {uni.short_name}
            </button>
          ))}
        </div>
      )}

      {/* Results Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <PropertyCardSkeleton key={i} />
          ))}
        </div>
      ) : properties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center flex flex-col items-center gap-4 my-8">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
            <SearchX className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Aucun logement ne correspond à vos critères</h3>
          <p className="text-sm text-slate-500 max-w-md">
            Essayez de réinitialiser les filtres ou d&apos;élargir votre plage de budget.
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
                sortBy: 'featured',
              })
            }
          >
            Réinitialiser tous les filtres
          </Button>
        </div>
      )}

      {/* Pagination */}
      {!loading && pagination.totalPages > 1 && (
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
    <div className="pt-32 pb-24 bg-mesh-light min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title */}
        <div className="mb-10 max-w-3xl">
          <span className="inline-flex items-center gap-2 text-xs font-black text-primary-700 uppercase tracking-wider bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full border border-primary-200/80 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Catalogue Logements · Rentrée Universitaire
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mt-3">
            Trouve ton logement étudiant à{' '}
            <span className="bg-gradient-to-r from-primary-600 to-accent-teal bg-clip-text text-transparent">
              Selouane / Nador
            </span>
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
            Studios indépendants et colocations meublées, avec Wi-Fi inclus et situés à moins de 10 minutes à pied de la FPN, de l'EST et de l'ISTA.
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
