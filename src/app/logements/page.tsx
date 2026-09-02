'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PropertyDetail, PropertyFilterState } from '@/shared/types';
import { DbUniversity, DbCity } from '@/shared/types/database';
import { clientPropertyService } from '@/client/services/property.service';
import { PropertyFilterBar } from '@/components/properties/property-filter-bar';
import { PropertyCard } from '@/components/properties/property-card';
import { SearchX, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

function LogementsContent() {
  const searchParams = useSearchParams();

  const [universities, setUniversities] = useState<DbUniversity[]>([]);
  const [cities, setCities] = useState<DbCity[]>([]);
  const [properties, setProperties] = useState<PropertyDetail[]>([]);
  const [loading, setLoading] = useState(true);

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
      if (res.success) {
        setProperties(res.data);
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
      <div className="mb-8">
        <PropertyFilterBar
          filters={filters}
          onChange={setFilters}
          universities={universities}
          cities={cities}
          totalResults={properties.length}
        />
      </div>

      {/* Results Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-96 bg-white rounded-3xl animate-pulse border border-slate-200" />
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
    </>
  );
}

export default function LogementsPage() {
  return (
    <div className="pt-28 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title */}
        <div className="mb-8">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-widest bg-brand-50 px-3 py-1 rounded-full border border-brand-100">
            Catalogue Offres
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-2">
            Logements Étudiants à Selouane / Nador
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Trouve ton studio ou appartement meublé idéal à proximité immédiate des campus universitaires.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
            </div>
          }
        >
          <LogementsContent />
        </Suspense>

      </div>
    </div>
  );
}
