'use client';

import React from 'react';
import { Search, Filter, X, RotateCcw } from 'lucide-react';
import { PropertyFilterState } from '@/shared/types';
import { DbUniversity, DbCity } from '@/shared/types/database';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface PropertyFilterBarProps {
  filters: PropertyFilterState;
  onChange: (newFilters: PropertyFilterState) => void;
  universities: DbUniversity[];
  cities: DbCity[];
  totalResults: number;
}

export function PropertyFilterBar({
  filters,
  onChange,
  universities,
  cities,
  totalResults,
}: PropertyFilterBarProps) {

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filters, searchQuery: e.target.value });
  };

  const handleUniversityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...filters, universityId: e.target.value });
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...filters, citySlug: e.target.value });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...filters, maxPrice: Number(e.target.value) });
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...filters, propertyType: e.target.value });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...filters, sortBy: e.target.value as any });
  };

  const resetFilters = () => {
    onChange({
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
    });
  };

  const hasActiveFilters =
    filters.searchQuery !== '' ||
    filters.citySlug !== 'all' ||
    filters.universityId !== 'all' ||
    filters.maxPrice > 0 ||
    filters.propertyType !== 'all';

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft flex flex-col gap-6">
      
      {/* Header & Reset */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-primary-600" />
          <h3 className="font-extrabold text-slate-900 text-lg">Filtres de recherche</h3>
          <span className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary-50 text-primary-700">
            {totalResults} logement{totalResults > 1 ? 's' : ''}
          </span>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={resetFilters}
            className="text-xs font-semibold text-primary-600 hover:text-primary-800 flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Réinitialiser
          </button>
        )}
      </div>

      {/* Filter Inputs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Search Query */}
        <div className="lg:col-span-2">
          <Input
            placeholder="Rechercher par nom, quartier..."
            value={filters.searchQuery}
            onChange={handleTextChange}
            icon={<Search className="w-4 h-4" />}
          />
        </div>

        {/* University Filter */}
        <div>
          <Select
            value={filters.universityId}
            onChange={handleUniversityChange}
            options={[
              { value: 'all', label: 'Toutes les universités' },
              ...universities.map(u => ({ value: u.id, label: u.short_name })),
            ]}
          />
        </div>

        {/* Max Price Filter */}
        <div>
          <Select
            value={filters.maxPrice.toString()}
            onChange={handlePriceChange}
            options={[
              { value: '0', label: 'Budget max (Tous)' },
              { value: '1500', label: 'Max 1 500 DH/mois' },
              { value: '1800', label: 'Max 1 800 DH/mois' },
              { value: '2500', label: 'Max 2 500 DH/mois' },
            ]}
          />
        </div>

        {/* Property Type Filter */}
        <div>
          <Select
            value={filters.propertyType}
            onChange={handleTypeChange}
            options={[
              { value: 'all', label: 'Type de bien (Tous)' },
              { value: 'apartment_shared', label: 'Appartement partagé' },
              { value: 'studio_private', label: 'Studio individuel' },
            ]}
          />
        </div>

      </div>

      {/* Sorting bar */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100/60 text-xs font-medium text-slate-500">
        <span>Trier par :</span>
        <div className="w-48">
          <Select
            value={filters.sortBy}
            onChange={handleSortChange}
            options={[
              { value: 'featured', label: 'Coup de cœur' },
              { value: 'price_asc', label: 'Prix : Croissant' },
              { value: 'price_desc', label: 'Prix : Décroissant' },
            ]}
            className="h-9 text-xs py-1"
          />
        </div>
      </div>

    </div>
  );
}
