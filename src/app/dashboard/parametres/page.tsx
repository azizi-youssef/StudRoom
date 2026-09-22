'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { clientAdminService } from '@/client/services/admin.service';
import {
  Settings,
  MapPin,
  GraduationCap,
  Sparkles,
  Database,
  CheckCircle2,
  Server,
  Layers,
  ShieldCheck,
  Loader2,
  RefreshCw,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminParametresPage() {
  const [activeTab, setActiveTab] = useState<'cities' | 'universities' | 'amenities' | 'system'>('cities');
  const [cities, setCities] = useState<any[]>([]);
  const [universities, setUniversities] = useState<any[]>([]);
  const [amenities, setAmenities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [citiesRes, unisRes, amenRes] = await Promise.all([
        clientAdminService.getCities(),
        clientAdminService.getUniversities(),
        clientAdminService.getAmenities(),
      ]);
      if (citiesRes.success && citiesRes.data) setCities(citiesRes.data);
      if (unisRes.success && unisRes.data) setUniversities(unisRes.data);
      if (amenRes.success && amenRes.data) setAmenities(amenRes.data);
    } catch (err) {
      console.error('[Paramètres] Error loading referential data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-1">
            <Link href="/dashboard" className="hover:text-primary-400 transition-colors text-xs">
              Tableau de bord
            </Link>
            <span>/</span>
            <span className="text-primary-400 font-medium text-xs">Paramètres & Référentiels</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-950/80 border border-primary-800/80 flex items-center justify-center text-primary-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Paramètres & Données Référentielles</h1>
              <p className="text-xs text-slate-400">
                Consultez et configurez les villes desservies, campus universitaires et équipements disponibles sur StudRoom.
              </p>
            </div>
          </div>
        </div>

        <Button
          onClick={loadData}
          variant="outline"
          className="flex items-center gap-2 px-3 py-2 text-xs border-slate-800 text-slate-300 hover:bg-slate-800"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Actualiser
        </Button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('cities')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
            activeTab === 'cities'
              ? 'bg-primary-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
          }`}
        >
          <MapPin className="w-4 h-4" />
          Villes ({cities.length})
        </button>

        <button
          onClick={() => setActiveTab('universities')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
            activeTab === 'universities'
              ? 'bg-primary-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          Universités & Campus ({universities.length})
        </button>

        <button
          onClick={() => setActiveTab('amenities')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
            activeTab === 'amenities'
              ? 'bg-primary-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Équipements & Commodités ({amenities.length})
        </button>

        <button
          onClick={() => setActiveTab('system')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
            activeTab === 'system'
              ? 'bg-primary-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
          }`}
        >
          <Database className="w-4 h-4" />
          État Système
        </button>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-900/40 rounded-2xl border border-slate-800/60">
          <Loader2 className="w-8 h-8 text-primary-400 animate-spin mb-3" />
          <p className="text-xs text-slate-400">Chargement des référentiels...</p>
        </div>
      ) : activeTab === 'cities' ? (
        /* CITIES TAB */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {cities.map((city) => (
            <div
              key={city.id}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between"
            >
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary-400" />
                  {city.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1">Slug: {city.slug}</p>
                <span className="text-[11px] text-slate-500 font-mono mt-0.5 block">
                  Région : {city.region || 'Oriental, Maroc'}
                </span>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 text-[11px] font-semibold">
                Active
              </span>
            </div>
          ))}
        </div>
      ) : activeTab === 'universities' ? (
        /* UNIVERSITIES TAB */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {universities.map((uni) => (
            <div
              key={uni.id}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-start justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-950 border border-primary-800 text-primary-400 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{uni.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{uni.short_name || uni.city?.name || 'Selouane'}</p>
                  <p className="text-[11px] text-slate-500 mt-1">{uni.address || 'Province de Nador'}</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono">
                {uni.slug || 'campus'}
              </span>
            </div>
          ))}
        </div>
      ) : activeTab === 'amenities' ? (
        /* AMENITIES TAB */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {amenities.map((amenity) => (
            <div
              key={amenity.id}
              className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-primary-400 shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-semibold text-white block">{amenity.name}</span>
                <span className="text-[10px] text-slate-500 block uppercase font-mono">
                  {amenity.category || 'essential'}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* SYSTEM TAB */
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
            <Server className="w-6 h-6 text-primary-400" />
            <div>
              <h2 className="text-base font-bold text-white">Diagnostic & Infrastructure StudRoom</h2>
              <p className="text-xs text-slate-400">Architecture haute disponibilité et intégrité relationnelle.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-xs text-slate-500 block font-medium">Environnement</span>
              <span className="text-sm font-bold text-emerald-400 flex items-center gap-1.5 mt-1">
                <CheckCircle2 className="w-4 h-4" /> Production Ready
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-xs text-slate-500 block font-medium">Sécurité RLS & RBAC</span>
              <span className="text-sm font-bold text-primary-400 flex items-center gap-1.5 mt-1">
                <ShieldCheck className="w-4 h-4" /> Actif & Verrouillé
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-xs text-slate-500 block font-medium">Contrainte Anti Double-Booking</span>
              <span className="text-sm font-bold text-indigo-400 flex items-center gap-1.5 mt-1">
                <Database className="w-4 h-4" /> PostgreSQL GiST Active
              </span>
            </div>
          </div>

          <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800/80 text-xs text-slate-400 space-y-2">
            <div className="flex items-center gap-2 text-white font-semibold">
              <Info className="w-4 h-4 text-primary-400" />
              Informations Système
            </div>
            <p>
              • API REST : Node.js / Express / TypeScript montée sur <code className="text-primary-400">/api/v1</code>.
            </p>
            <p>
              • Frontend : Next.js 14 App Router avec SSR et Client Components sécurisés.
            </p>
            <p>
              • Synchronisation temps réel : Déclencheur PostgreSQL <code className="text-primary-400">sync_property_room_stats()</code> garantissant le recalcul instantané du nombre de chambres et de la fourchette de prix.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
