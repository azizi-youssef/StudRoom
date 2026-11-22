'use client';

import React, { useState } from 'react';
import {
  Search,
  Filter,
  RotateCcw,
  Sparkles,
  LayoutGrid,
  Map as MapIcon,
  Columns,
  ShieldCheck,
  CalendarCheck,
  CheckCircle2,
  SlidersHorizontal,
} from 'lucide-react';
import { PropertyFilterState, AvailabilityType } from '@/shared/types';
import { DbUniversity, DbCity } from '@/shared/types/database';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

interface PropertyFilterBarProps {
  filters: PropertyFilterState;
  onChange: (newFilters: PropertyFilterState) => void;
  universities: DbUniversity[];
  cities: DbCity[];
  totalResults: number;
  viewMode: 'grid' | 'map' | 'split';
  onViewModeChange: (mode: 'grid' | 'map' | 'split') => void;
}

export function PropertyFilterBar({
  filters,
  onChange,
  universities,
  cities,
  totalResults,
  viewMode,
  onViewModeChange,
}: PropertyFilterBarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filters, searchQuery: e.target.value, page: 1 });
  };

  const handleUniversityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...filters, universityId: e.target.value, page: 1 });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...filters, maxPrice: Number(e.target.value), page: 1 });
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...filters, propertyType: e.target.value, page: 1 });
  };

  const handleAvailabilityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...filters, availability: e.target.value as AvailabilityType, page: 1 });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...filters, sortBy: e.target.value as any, page: 1 });
  };

  const toggleOnlyVerified = () => {
    onChange({ ...filters, onlyVerified: !filters.onlyVerified, page: 1 });
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
      availability: 'all',
      onlyVerified: false,
      sortBy: 'featured',
      page: 1,
    });
  };

  const hasActiveFilters =
    filters.searchQuery !== '' ||
    filters.citySlug !== 'all' ||
    filters.universityId !== 'all' ||
    filters.maxPrice > 0 ||
    filters.propertyType !== 'all' ||
    filters.availability !== 'all' ||
    filters.onlyVerified ||
    filters.sortBy !== 'featured';

  const activeCount = [
    filters.universityId !== 'all',
    filters.maxPrice > 0,
    filters.propertyType !== 'all',
    filters.availability !== 'all',
    filters.onlyVerified,
  ].filter(Boolean).length;
  const collapsibleClass = mobileOpen ? 'block' : 'hidden md:block';

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 shadow-sm transition-all space-y-3.5">
      {/* Top Header: Title, Results counter & View Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary-50 dark:bg-primary-950/60 border border-primary-200/70 dark:border-primary-800/60 flex items-center justify-center text-primary-600 dark:text-primary-400 shrink-0">
            <Filter className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm tracking-tight flex items-center gap-2">
              Recherche & Filtres
              <span aria-live="polite" className="px-2.5 py-0.5 rounded-full text-xs font-black bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800">
                {totalResults} logement{totalResults > 1 ? 's' : ''}
              </span>
            </h2>
          </div>
        </div>

        {/* View Mode Switcher (Grille / Split / Carte) */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
            <button
              type="button"
              onClick={() => onViewModeChange('grid')}
              aria-label="Vue grille"
              aria-pressed={viewMode === 'grid'}
              title="Vue Grille"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-900 text-primary-600 dark:text-primary-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Grille</span>
            </button>

            <button
              type="button"
              onClick={() => onViewModeChange('split')}
              aria-label="Vue partagée liste et carte"
              aria-pressed={viewMode === 'split'}
              title="Vue Partagée Liste + Carte"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'split'
                  ? 'bg-white dark:bg-slate-900 text-primary-600 dark:text-primary-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Split Carte</span>
            </button>

            <button
              type="button"
              onClick={() => onViewModeChange('map')}
              aria-label="Vue pleine carte"
              aria-pressed={viewMode === 'map'}
              title="Vue Pleine Carte"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'map'
                  ? 'bg-white dark:bg-slate-900 text-primary-600 dark:text-primary-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Pleine Carte</span>
            </button>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:text-rose-700 flex items-center gap-1 px-2.5 py-1.5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Réinitialiser
            </button>
          )}
        </div>
      </div>

      {/* Grid des filtres principaux */}
      <div id="catalogue-filtres" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-12 gap-2.5">
        {/* 1. Recherche texte (Col 4) */}
        <div className="lg:col-span-3">
          <Input
            aria-label="Rechercher un quartier, une rue ou un nom"
            placeholder="Rechercher quartier, rue, nom..."
            value={filters.searchQuery}
            onChange={handleTextChange}
            icon={<Search className="w-4 h-4 text-primary-600 dark:text-primary-400" />}
            className="h-10 text-xs rounded-xl bg-slate-50/80 dark:bg-slate-800/80 border-slate-200/80 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-900"
          />
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-expanded={mobileOpen}
          aria-controls="catalogue-filtres"
          className="md:hidden col-span-full w-full flex items-center justify-center gap-2 min-h-[44px] rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold text-slate-700 dark:text-slate-200"
        >
          <SlidersHorizontal className="w-4 h-4" />
          {mobileOpen ? 'Masquer les filtres' : 'Filtres'}
          {activeCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs font-black bg-primary-600 text-white">{activeCount}</span>
          )}
        </button>

        {/* 2. Campus / Université (Col 3) */}
        <div className={`lg:col-span-3 ${collapsibleClass}`}>
          <Select
            aria-label="Campus cible"
            value={filters.universityId}
            onChange={handleUniversityChange}
            options={[
              { value: 'all', label: 'Tous les campus (Selouane / Nador)' },
              ...universities.map((u) => ({ value: u.id, label: u.short_name })),
            ]}
            className="h-10 text-xs rounded-xl bg-slate-50/80 dark:bg-slate-800/80 border-slate-200/80 dark:border-slate-700 font-medium"
          />
        </div>

        {/* 3. Budget Max (Col 2) */}
        <div className={`lg:col-span-2 ${collapsibleClass}`}>
          <Select
            aria-label="Budget maximum"
            value={filters.maxPrice.toString()}
            onChange={handlePriceChange}
            options={[
              { value: '0', label: 'Budget max (Tous)' },
              { value: '1300', label: 'Jusqu’à 1 300 DH' },
              { value: '1600', label: 'Jusqu’à 1 600 DH' },
              { value: '1900', label: 'Jusqu’à 1 900 DH' },
              { value: '2300', label: 'Jusqu’à 2 300 DH' },
              { value: '2600', label: 'Jusqu’à 2 600 DH' },
            ]}
            className="h-10 text-xs rounded-xl bg-slate-50/80 dark:bg-slate-800/80 border-slate-200/80 dark:border-slate-700"
          />
        </div>

        {/* 4. Type de bien (Col 2) */}
        <div className={`lg:col-span-2 ${collapsibleClass}`}>
          <Select
            aria-label="Type de bien"
            value={filters.propertyType}
            onChange={handleTypeChange}
            options={[
              { value: 'all', label: 'Type de bien (Tous)' },
              { value: 'studio', label: 'Studio individuel' },
              { value: 'apartment', label: 'Appartement / Coloc' },
              { value: 'residence', label: 'Résidence étudiante' },
            ]}
            className="h-10 text-xs rounded-xl bg-slate-50/80 dark:bg-slate-800/80 border-slate-200/80 dark:border-slate-700"
          />
        </div>

        {/* 5. Disponibilité (Priorité 4) (Col 2) */}
        <div className={`lg:col-span-2 ${collapsibleClass}`}>
          <Select
            aria-label="Disponibilité"
            value={filters.availability}
            onChange={handleAvailabilityChange}
            options={[
              { value: 'all', label: 'Disponibilité (Toutes)' },
              { value: 'now', label: 'Disponible immédiat' },
              { value: 'october', label: 'Dispo 1er Octobre' },
              { value: 'occupied', label: 'Complet' },
            ]}
            className="h-10 text-xs rounded-xl font-bold bg-slate-50/80 dark:bg-slate-800/80 border-slate-200/80 dark:border-slate-700 text-slate-800 dark:text-slate-200"
          />
        </div>
      </div>

      {/* Barre d'outils secondaire : Tri + Toggle Filtre Vérifié */}
      <div className={`flex-wrap items-center justify-between gap-2.5 pt-1 ${mobileOpen ? 'flex' : 'hidden md:flex'}`}>
        {/* Toggle Logement Vérifié (Priorité 3) */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleOnlyVerified}
            aria-pressed={filters.onlyVerified}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
              filters.onlyVerified
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-emerald-500'
            }`}
          >
            <ShieldCheck className={`w-3.5 h-3.5 ${filters.onlyVerified ? 'text-white' : 'text-emerald-500'}`} />
            Uniquement logements vérifiés
          </button>

          <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
            Audit physique et propriétaire certifié
          </span>
        </div>

        {/* Tri */}
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap">Trier par :</span>
          <Select
            aria-label="Trier les résultats"
            value={filters.sortBy}
            onChange={handleSortChange}
            options={[
              { value: 'featured', label: 'Recommandés' },
              { value: 'price_asc', label: 'Prix croissant' },
              { value: 'price_desc', label: 'Prix décroissant' },
              { value: 'rating', label: 'Mieux notés' },
              { value: 'proximity', label: 'Plus proche du campus' },
            ]}
            className="h-8.5 text-xs rounded-xl font-semibold bg-slate-50/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-primary-700 dark:text-primary-300 w-44"
          />
        </div>
      </div>
    </div>
  );
}
