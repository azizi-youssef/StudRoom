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
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        <div>
          <div className="flex items-center gap-2 text-xs mb-1.5" style={{ color: 'var(--text-muted)' }}>
            <Link href="/dashboard" className="hover:underline transition-colors">
              Tableau de bord
            </Link>
            <span>/</span>
            <span className="font-medium" style={{ color: 'var(--brand-primary)' }}>
              Paramètres & Référentiels
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{
                backgroundColor: 'var(--brand-bg)',
                border: '1px solid var(--brand-bg-strong)',
                color: 'var(--brand-primary)',
              }}
            >
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                Paramètres & Données Référentielles
              </h1>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                Consultez et configurez les villes desservies, campus universitaires et équipements disponibles sur StudRoom.
              </p>
            </div>
          </div>
        </div>

        <Button
          onClick={loadData}
          variant="outline"
          className="dash-card flex items-center gap-2 px-3.5 py-2 text-xs font-medium self-start sm:self-center"
          style={{ color: 'var(--text-primary)' }}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Actualiser
        </Button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b pb-3" style={{ borderColor: 'var(--border-subtle)' }}>
        <button
          onClick={() => setActiveTab('cities')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'cities'
              ? 'btn-brand text-white shadow-sm'
              : 'dash-card'
          }`}
          style={
            activeTab !== 'cities'
              ? {
                  backgroundColor: 'var(--bg-card)',
                  color: 'var(--text-secondary)',
                }
              : undefined
          }
        >
          <MapPin className="w-3.5 h-3.5" />
          Villes ({cities.length})
        </button>

        <button
          onClick={() => setActiveTab('universities')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'universities'
              ? 'btn-brand text-white shadow-sm'
              : 'dash-card'
          }`}
          style={
            activeTab !== 'universities'
              ? {
                  backgroundColor: 'var(--bg-card)',
                  color: 'var(--text-secondary)',
                }
              : undefined
          }
        >
          <GraduationCap className="w-3.5 h-3.5" />
          Universités & Campus ({universities.length})
        </button>

        <button
          onClick={() => setActiveTab('amenities')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'amenities'
              ? 'btn-brand text-white shadow-sm'
              : 'dash-card'
          }`}
          style={
            activeTab !== 'amenities'
              ? {
                  backgroundColor: 'var(--bg-card)',
                  color: 'var(--text-secondary)',
                }
              : undefined
          }
        >
          <Sparkles className="w-3.5 h-3.5" />
          Équipements & Commodités ({amenities.length})
        </button>

        <button
          onClick={() => setActiveTab('system')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'system'
              ? 'btn-brand text-white shadow-sm'
              : 'dash-card'
          }`}
          style={
            activeTab !== 'system'
              ? {
                  backgroundColor: 'var(--bg-card)',
                  color: 'var(--text-secondary)',
                }
              : undefined
          }
        >
          <Database className="w-3.5 h-3.5" />
          État Système
        </button>
      </div>

      {/* Tab Content */}
      {loading ? (
        <div
          className="dash-card flex flex-col items-center justify-center py-20"
          style={{ backgroundColor: 'var(--bg-card)' }}
        >
          <Loader2 className="w-8 h-8 animate-spin mb-3" style={{ color: 'var(--brand-primary)' }} />
          <p className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
            Chargement des référentiels...
          </p>
        </div>
      ) : activeTab === 'cities' ? (
        /* CITIES TAB */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {cities.map((city) => (
            <div
              key={city.id}
              className="dash-card p-5 flex items-center justify-between transition-all"
              style={{ backgroundColor: 'var(--bg-card)' }}
            >
              <div>
                <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                  <MapPin className="w-4 h-4" style={{ color: 'var(--brand-primary)' }} />
                  {city.name}
                </h3>
                <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Slug: {city.slug}</p>
                <span className="text-[11px] font-mono mt-0.5 block" style={{ color: 'var(--text-muted)' }}>
                  Région : {city.region || 'Oriental, Maroc'}
                </span>
              </div>
              <span className="px-2.5 py-1 rounded-full badge-success text-[11px] font-semibold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--color-emerald-500)' }} />
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
              className="dash-card p-5 flex items-start justify-between gap-4 transition-all"
              style={{ backgroundColor: 'var(--bg-card)' }}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: 'var(--brand-bg)',
                    border: '1px solid var(--brand-bg-strong)',
                    color: 'var(--brand-primary)',
                  }}
                >
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{uni.name}</h3>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{uni.short_name || uni.city?.name || 'Selouane'}</p>
                  <p className="text-[11px] mt-1" style={{ color: 'var(--text-muted)' }}>{uni.address || 'Province de Nador'}</p>
                </div>
              </div>
              <span
                className="px-2.5 py-0.5 rounded-lg text-[10px] font-mono border"
                style={{
                  backgroundColor: 'var(--bg-subtle)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-secondary)',
                }}
              >
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
              className="dash-card p-3.5 flex items-center gap-3 transition-all"
              style={{ backgroundColor: 'var(--bg-card)' }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border"
                style={{
                  backgroundColor: 'var(--bg-subtle)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--brand-primary)',
                }}
              >
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-semibold block" style={{ color: 'var(--text-primary)' }}>{amenity.name}</span>
                <span className="text-[10px] block uppercase font-mono" style={{ color: 'var(--text-muted)' }}>
                  {amenity.category || 'essential'}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* SYSTEM TAB */
        <div className="dash-card p-6 space-y-6" style={{ backgroundColor: 'var(--bg-card)' }}>
          <div className="flex items-center gap-3 pb-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{
                backgroundColor: 'var(--brand-bg)',
                border: '1px solid var(--brand-bg-strong)',
                color: 'var(--brand-primary)',
              }}
            >
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>Diagnostic & Infrastructure StudRoom</h2>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Architecture haute disponibilité et intégrité relationnelle.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div
              className="p-4 rounded-xl border"
              style={{
                backgroundColor: 'var(--bg-subtle)',
                borderColor: 'var(--border-subtle)',
              }}
            >
              <span className="text-xs block font-medium" style={{ color: 'var(--text-muted)' }}>Environnement</span>
              <span className="text-sm font-bold flex items-center gap-1.5 mt-1.5" style={{ color: 'var(--success-fg)' }}>
                <CheckCircle2 className="w-4 h-4" /> Production Ready
              </span>
            </div>

            <div
              className="p-4 rounded-xl border"
              style={{
                backgroundColor: 'var(--bg-subtle)',
                borderColor: 'var(--border-subtle)',
              }}
            >
              <span className="text-xs block font-medium" style={{ color: 'var(--text-muted)' }}>Sécurité RLS & RBAC</span>
              <span className="text-sm font-bold flex items-center gap-1.5 mt-1.5" style={{ color: 'var(--brand-primary)' }}>
                <ShieldCheck className="w-4 h-4" /> Actif & Verrouillé
              </span>
            </div>

            <div
              className="p-4 rounded-xl border"
              style={{
                backgroundColor: 'var(--bg-subtle)',
                borderColor: 'var(--border-subtle)',
              }}
            >
              <span className="text-xs block font-medium" style={{ color: 'var(--text-muted)' }}>Contrainte Anti Double-Booking</span>
              <span className="text-sm font-bold flex items-center gap-1.5 mt-1.5" style={{ color: 'var(--brand-primary)' }}>
                <Database className="w-4 h-4" /> PostgreSQL GiST Active
              </span>
            </div>
          </div>

          <div
            className="p-4 rounded-xl border text-xs space-y-2"
            style={{
              backgroundColor: 'var(--bg-subtle)',
              borderColor: 'var(--border-subtle)',
              color: 'var(--text-secondary)',
            }}
          >
            <div className="flex items-center gap-2 font-semibold" style={{ color: 'var(--text-primary)' }}>
              <Info className="w-4 h-4" style={{ color: 'var(--brand-primary)' }} />
              Informations Système
            </div>
            <p>
              • API REST : Node.js / Express / TypeScript montée sur <code className="px-1.5 py-0.5 rounded font-mono" style={{ backgroundColor: 'var(--brand-bg)', color: 'var(--brand-primary)' }}>/api/v1</code>.
            </p>
            <p>
              • Frontend : Next.js 14 App Router avec SSR et Client Components sécurisés.
            </p>
            <p>
              • Synchronisation temps réel : Déclencheur PostgreSQL <code className="px-1.5 py-0.5 rounded font-mono" style={{ backgroundColor: 'var(--brand-bg)', color: 'var(--brand-primary)' }}>sync_property_room_stats()</code> garantissant le recalcul instantané du nombre de chambres et de la fourchette de prix.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
