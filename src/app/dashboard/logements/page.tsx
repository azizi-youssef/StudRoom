'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { clientAdminService } from '@/client/services/admin.service';
import { PropertyDetail } from '@/shared/types';
import {
  Building2,
  Plus,
  Search,
  Filter,
  RefreshCw,
  ExternalLink,
  Bed,
  CheckCircle,
  EyeOff,
  Trash2,
  DoorOpen,
  Image as ImageIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { sanitizeImageUrl, formatCurrencyDH, getPropertyTypeLabel } from '@/lib/utils';

export default function AdminLogementsPage() {
  const [properties, setProperties] = useState<PropertyDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    propertyId: string;
    title: string;
  } | null>(null);

  const loadProperties = useCallback(async () => {
    setLoading(true);
    try {
      const res = await clientAdminService.getProperties();
      if (res.success && res.data) {
        setProperties(res.data);
      }
    } catch (err) {
      console.error('[Admin Properties] Load error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProperties();
  }, [loadProperties]);

  const handleToggleAvailability = async (id: string, currentAvailability: boolean) => {
    setActionLoadingId(id);
    try {
      const res = await clientAdminService.updateProperty(id, {
        is_available: !currentAvailability,
        status: !currentAvailability ? 'AVAILABLE' : 'UNAVAILABLE',
      });
      if (res.success && res.data) {
        setProperties((prev) => prev.map((p) => (p.id === id ? res.data! : p)));
      }
    } catch (err) {
      console.error('[Admin Properties] Toggle error:', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteProperty = async (id: string, title: string) => {
    setConfirmDialog({ open: true, propertyId: id, title });
  };

  const executeDelete = async () => {
    if (!confirmDialog) return;
    const { propertyId } = confirmDialog;
    setConfirmDialog(null);
    setActionLoadingId(propertyId);
    try {
      const res = await clientAdminService.deleteProperty(propertyId);
      if (res.success) {
        setProperties((prev) => prev.filter((p) => p.id !== propertyId));
      }
    } catch (err) {
      console.error('[Admin Properties] Delete error:', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const filtered = properties.filter((p) => {
    const matchQuery =
      search.trim() === '' ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.neighborhood.toLowerCase().includes(search.toLowerCase()) ||
      p.city?.name?.toLowerCase().includes(search.toLowerCase());

    const matchStatus =
      statusFilter === 'all' ||
      (statusFilter === 'available' && p.is_available) ||
      (statusFilter === 'unavailable' && !p.is_available) ||
      p.status === statusFilter;

    return matchQuery && matchStatus;
  });

  return (
    <div className="flex flex-col gap-8">
      {/* ConfirmDialog — Suppression logement */}
      <ConfirmDialog
        open={confirmDialog?.open ?? false}
        title="Supprimer ce logement"
        description={`Êtes-vous sûr de vouloir supprimer définitivement « ${confirmDialog?.title} » et toutes ses chambres ? Cette action est irréversible.`}
        confirmLabel="Supprimer définitivement"
        variant="danger"
        onConfirm={executeDelete}
        onCancel={() => setConfirmDialog(null)}
      />

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="w-4 h-4 text-primary-400" />
            <span className="text-[11px] font-extrabold text-primary-400 uppercase tracking-widest">
              Catalogue & Inventaire
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Gestion des Logements
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {properties.length} logement{properties.length > 1 ? 's' : ''} géré{properties.length > 1 ? 's' : ''} sur la plateforme StudRoom.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={loadProperties}
            disabled={loading}
            className="font-bold border-slate-700 bg-slate-900 text-slate-300 hover:text-white"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
          <Link href="/dashboard/logements/nouveau">
            <Button variant="primary" size="sm" className="font-bold shadow-soft">
              <Plus className="w-4 h-4 mr-1.5" />
              Nouveau Logement
            </Button>
          </Link>
        </div>
      </div>

      {/* ── Search & Filter Controls ── */}
      <div className="bg-slate-950/80 p-4 rounded-3xl border border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par titre, quartier..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <Filter className="w-4 h-4 text-slate-400 mr-1" />
          {[
            { id: 'all', label: 'Tous' },
            { id: 'available', label: 'En ligne' },
            { id: 'unavailable', label: 'Hors ligne' },
            { id: 'DRAFT', label: 'Brouillons' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${
                statusFilter === tab.id
                  ? 'bg-primary-600 text-white shadow-soft'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Properties Grid ── */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-slate-950/90 rounded-3xl border border-slate-800/90 overflow-hidden animate-pulse">
              <div className="aspect-[16/10] bg-slate-800" />
              <div className="p-5 flex flex-col gap-3">
                <div className="h-4 w-3/4 bg-slate-800 rounded-lg" />
                <div className="h-3 w-full bg-slate-800/60 rounded-lg" />
                <div className="h-3 w-2/3 bg-slate-800/60 rounded-lg" />
                <div className="pt-3 border-t border-slate-800/80 flex justify-between">
                  <div className="h-3 w-20 bg-slate-800 rounded" />
                  <div className="h-3 w-16 bg-slate-800 rounded" />
                </div>
              </div>
              <div className="p-4 bg-slate-900/60 border-t border-slate-800/80 flex justify-between gap-2">
                <div className="h-7 w-28 bg-slate-800 rounded-xl" />
                <div className="h-7 w-16 bg-slate-800 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-slate-950/60 p-16 rounded-3xl border border-slate-800/80 text-center flex flex-col items-center gap-4">
          <Building2 className="w-12 h-12 text-slate-600" />
          <p className="text-base font-bold text-white">Aucun logement trouvé</p>
          <p className="text-xs text-slate-500 max-w-sm">
            Aucun logement ne correspond à vos filtres actuels. Modifiez votre recherche ou ajoutez un nouveau bien.
          </p>
          <Link href="/dashboard/logements/nouveau">
            <Button variant="primary" size="sm" className="font-bold">
              <Plus className="w-4 h-4 mr-1.5" />
              Créer un logement
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((property) => {
            const primaryImg = sanitizeImageUrl(property.primary_image || property.images?.[0]?.image_url);
            const roomsCount = property.rooms?.length || property.total_rooms || 0;
            const availableRooms = property.available_rooms ?? property.rooms?.filter((r) => r.status === 'AVAILABLE').length ?? 0;

            return (
              <div
                key={property.id}
                className="bg-slate-950/90 rounded-3xl border border-slate-800/90 overflow-hidden flex flex-col justify-between shadow-soft hover:border-slate-700 transition-all group"
              >
                <div>
                  {/* Photo Header */}
                  <div className="relative aspect-[16/10] bg-slate-900 overflow-hidden">
                    <Image
                      src={primaryImg}
                      alt={property.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-950/80 backdrop-blur-md text-primary-400 border border-slate-700/60">
                        {getPropertyTypeLabel(property.property_type)}
                      </span>
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider uppercase border ${
                          property.is_available
                            ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800/80'
                            : 'bg-rose-950/80 text-rose-400 border-rose-800/80'
                        }`}
                      >
                        {property.is_available ? 'En ligne' : 'Hors ligne'}
                      </span>
                    </div>

                    {/* Bottom Info in Image */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="text-[11px] font-bold text-slate-300 truncate">
                        {property.neighborhood}, {property.city?.name || 'Selouane'}
                      </p>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex flex-col gap-3">
                    <h3 className="text-base font-black text-white tracking-tight line-clamp-1 group-hover:text-primary-400 transition-colors">
                      {property.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {property.description}
                    </p>

                    <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-800/80 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-300 font-bold">
                        <Bed className="w-3.5 h-3.5 text-primary-400" />
                        <span>{availableRooms} / {roomsCount} libres</span>
                      </div>
                      <div className="text-right font-black text-primary-400">
                        {formatCurrencyDH(property.min_price_dh)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action Toolbar */}
                <div className="p-4 bg-slate-900/60 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {/* Chambres Manager Button */}
                    <Link
                      href={`/dashboard/logements/${property.id}/chambres`}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                      title="Gérer les chambres"
                    >
                      <DoorOpen className="w-3.5 h-3.5 text-primary-400" />
                      <span>Chambres ({roomsCount})</span>
                    </Link>

                    {/* Photos Manager Button */}
                    <Link
                      href={`/dashboard/logements/${property.id}/photos`}
                      className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      title="Gérer les photos"
                    >
                      <ImageIcon className="w-4 h-4" />
                    </Link>

                    {/* Preview on Public Site */}
                    <Link
                      href={`/logements/${property.slug}`}
                      target="_blank"
                      className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      title="Voir sur le site public"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Toggle Online / Offline */}
                    <button
                      type="button"
                      onClick={() => handleToggleAvailability(property.id, property.is_available)}
                      disabled={actionLoadingId === property.id}
                      title={property.is_available ? 'Mettre hors ligne' : 'Publier en ligne'}
                      className={`p-1.5 rounded-xl transition-colors ${
                        property.is_available
                          ? 'text-emerald-400 hover:bg-emerald-950/60'
                          : 'text-slate-500 hover:bg-slate-800'
                      }`}
                    >
                      {property.is_available ? <CheckCircle className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>

                    {/* Delete Property */}
                    <button
                      type="button"
                      onClick={() => handleDeleteProperty(property.id, property.title)}
                      disabled={actionLoadingId === property.id}
                      title="Supprimer ce logement"
                      className="p-1.5 rounded-xl text-rose-400 hover:bg-rose-950/60 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
