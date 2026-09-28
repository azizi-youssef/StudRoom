'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { clientAdminService } from '@/client/services/admin.service';
import { PropertyDetail } from '@/shared/types';
import {
  Building2, Plus, Search, Filter, RefreshCw,
  ExternalLink, Bed, CheckCircle, EyeOff, Trash2, DoorOpen,
  Image as ImageIcon, Loader2,
} from 'lucide-react';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { sanitizeImageUrl, formatCurrencyDH, getPropertyTypeLabel } from '@/lib/utils';

export default function AdminLogementsPage() {
  const [properties, setProperties] = useState<PropertyDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; propertyId: string; title: string } | null>(null);

  const loadProperties = useCallback(async () => {
    setLoading(true);
    try {
      const res = await clientAdminService.getProperties();
      if (res.success && res.data) setProperties(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadProperties(); }, [loadProperties]);

  const handleToggleAvailability = async (id: string, current: boolean) => {
    setActionLoadingId(id);
    try {
      const res = await clientAdminService.updateProperty(id, { is_available: !current, status: !current ? 'AVAILABLE' : 'UNAVAILABLE' });
      if (res.success && res.data) setProperties(prev => prev.map(p => p.id === id ? res.data! : p));
    } catch (err) { console.error(err); }
    finally { setActionLoadingId(null); }
  };

  const handleDeleteProperty = (id: string, title: string) => setConfirmDialog({ open: true, propertyId: id, title });

  const executeDelete = async () => {
    if (!confirmDialog) return;
    const { propertyId } = confirmDialog;
    setConfirmDialog(null);
    setActionLoadingId(propertyId);
    try {
      const res = await clientAdminService.deleteProperty(propertyId);
      if (res.success) setProperties(prev => prev.filter(p => p.id !== propertyId));
    } catch (err) { console.error(err); }
    finally { setActionLoadingId(null); }
  };

  const filtered = properties.filter(p => {
    const matchQuery = search.trim() === '' ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.neighborhood.toLowerCase().includes(search.toLowerCase()) ||
      p.city?.name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' ||
      (statusFilter === 'available' && p.is_available) ||
      (statusFilter === 'unavailable' && !p.is_available) ||
      p.status === statusFilter;
    return matchQuery && matchStatus;
  });

  const filterBtnBase = `px-3 py-1.5 rounded-lg text-[12.5px] font-semibold flex-shrink-0 transition-all`;

  return (
    <div className="flex flex-col gap-7 animate-fade-in">

      <ConfirmDialog
        open={confirmDialog?.open ?? false}
        title="Supprimer ce logement"
        description={`Êtes-vous sûr de vouloir supprimer définitivement « ${confirmDialog?.title} » et toutes ses chambres ? Cette action est irréversible.`}
        confirmLabel="Supprimer définitivement"
        variant="danger"
        onConfirm={executeDelete}
        onCancel={() => setConfirmDialog(null)}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6"
        style={{ borderBottom: '1px solid var(--border-default)' }}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="w-4 h-4" style={{ color: 'var(--brand-primary)' }} />
            <span className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: 'var(--brand-primary)' }}>
              Catalogue & Inventaire
            </span>
          </div>
          <h1 className="text-[24px] font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Gestion des Logements
          </h1>
          <p className="text-[13px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            {properties.length} logement{properties.length > 1 ? 's' : ''} géré{properties.length > 1 ? 's' : ''} sur la plateforme StudRoom.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={loadProperties} disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-[13px] font-medium transition disabled:opacity-50"
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)', color: 'var(--text-secondary)' }}>
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </button>
          <Link href="/dashboard/logements/nouveau">
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-semibold text-white transition"
              style={{ background: 'var(--brand-primary)' }}>
              <Plus className="w-4 h-4" />
              Nouveau Logement
            </button>
          </Link>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl"
        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)' }}>
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input type="text" placeholder="Rechercher par titre, quartier…"
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full rounded-xl pl-10 pr-4 py-2 text-[13px] focus:outline-none transition"
            style={{ background: 'var(--bg-surface-hover)', border: '1px solid var(--border-default)', color: 'var(--text-primary)' }} />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <Filter className="w-4 h-4 mr-1 shrink-0" style={{ color: 'var(--text-muted)' }} />
          {[
            { id: 'all', label: 'Tous' },
            { id: 'available', label: 'En ligne' },
            { id: 'unavailable', label: 'Hors ligne' },
            { id: 'DRAFT', label: 'Brouillons' },
          ].map(tab => (
            <button key={tab.id} onClick={() => setStatusFilter(tab.id)} className={filterBtnBase}
              style={statusFilter === tab.id
                ? { background: 'var(--brand-primary)', color: '#fff' }
                : { background: 'var(--bg-surface-hover)', border: '1px solid var(--border-default)', color: 'var(--text-secondary)' }}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="dash-card overflow-hidden animate-pulse">
              <div className="aspect-[16/10]" style={{ background: 'var(--border-subtle)' }} />
              <div className="p-5 flex flex-col gap-3">
                <div className="h-4 w-3/4 rounded-lg" style={{ background: 'var(--border-default)' }} />
                <div className="h-3 w-full rounded-lg" style={{ background: 'var(--border-subtle)' }} />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 rounded-2xl text-center"
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)' }}>
          <Building2 className="w-12 h-12 mb-3" style={{ color: 'var(--text-muted)' }} />
          <p className="text-[15px] font-semibold" style={{ color: 'var(--text-primary)' }}>Aucun logement trouvé</p>
          <p className="text-[12.5px] mt-1 max-w-sm" style={{ color: 'var(--text-secondary)' }}>
            Aucun logement ne correspond à vos filtres. Modifiez votre recherche ou ajoutez un nouveau bien.
          </p>
          <Link href="/dashboard/logements/nouveau" className="mt-4">
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-semibold text-white"
              style={{ background: 'var(--brand-primary)' }}>
              <Plus className="w-4 h-4" /> Créer un logement
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(property => {
            const primaryImg = sanitizeImageUrl(property.primary_image || property.images?.[0]?.image_url);
            const roomsCount = property.rooms?.length || property.total_rooms || 0;
            const availableRooms = property.available_rooms ??
              property.rooms?.filter(r => r.status === 'AVAILABLE').length ?? 0;

            return (
              <div key={property.id}
                className="dash-card overflow-hidden flex flex-col group">

                {/* Photo */}
                <div className="relative aspect-[16/10] overflow-hidden" style={{ background: 'var(--border-subtle)' }}>
                  <Image
                    src={primaryImg}
                    alt={property.title}
                    fill
                    unoptimized={primaryImg.startsWith('data:') || primaryImg.startsWith('blob:')}
                    sizes="(max-width:768px) 100vw,33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                      style={{ background: 'rgba(255,255,255,0.9)', color: 'var(--text-primary)' }}>
                      {getPropertyTypeLabel(property.property_type)}
                    </span>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${property.is_available ? 'badge-success' : 'badge-danger'}`}>
                      {property.is_available ? 'En ligne' : 'Hors ligne'}
                    </span>
                  </div>

                  {/* Location overlay */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-[11px] font-semibold text-white truncate">
                      {property.neighborhood}, {property.city?.name || 'Selouane'}
                    </p>
                  </div>
                </div>

                {/* Body */}
                <div className="p-4 flex flex-col gap-3 flex-1">
                  <h3 className="text-[14px] font-semibold line-clamp-1 transition"
                    style={{ color: 'var(--text-primary)' }}
                    onMouseEnter={e => (e.currentTarget as HTMLHeadingElement).style.color = 'var(--brand-primary)'}
                    onMouseLeave={e => (e.currentTarget as HTMLHeadingElement).style.color = 'var(--text-primary)'}>
                    {property.title}
                  </h3>
                  <p className="text-[12.5px] line-clamp-2 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {property.description}
                  </p>
                  <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                    <div className="flex items-center gap-1.5 text-[12.5px] font-semibold" style={{ color: 'var(--text-secondary)' }}>
                      <Bed className="w-3.5 h-3.5" style={{ color: 'var(--brand-primary)' }} />
                      {availableRooms}/{roomsCount} libres
                    </div>
                    <div className="text-[14px] font-bold" style={{ color: 'var(--brand-primary)' }}>
                      {formatCurrencyDH(property.min_price_dh)}
                    </div>
                  </div>
                </div>

                {/* Toolbar */}
                <div className="px-4 py-3 flex items-center justify-between gap-2"
                  style={{ borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-surface-hover)' }}>
                  <div className="flex items-center gap-1.5">
                    <Link href={`/dashboard/logements/${property.id}/chambres`}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] font-semibold transition"
                      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)', color: 'var(--text-secondary)' }}
                      title="Gérer les chambres">
                      <DoorOpen className="w-3.5 h-3.5" style={{ color: 'var(--brand-primary)' }} />
                      Chambres ({roomsCount})
                    </Link>
                    <Link href={`/dashboard/logements/${property.id}/photos`}
                      className="p-1.5 rounded-lg transition"
                      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)', color: 'var(--text-secondary)' }}
                      title="Gérer les photos">
                      <ImageIcon className="w-4 h-4" />
                    </Link>
                    <Link href={`/logements/${property.slug}`} target="_blank"
                      className="p-1.5 rounded-lg transition"
                      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)', color: 'var(--text-secondary)' }}
                      title="Voir sur le site public">
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>

                  <div className="flex items-center gap-1">
                    <button type="button"
                      onClick={() => handleToggleAvailability(property.id, property.is_available)}
                      disabled={actionLoadingId === property.id}
                      title={property.is_available ? 'Mettre hors ligne' : 'Publier en ligne'}
                      className="p-1.5 rounded-lg transition disabled:opacity-50"
                      style={{ color: property.is_available ? 'var(--success)' : 'var(--text-muted)' }}>
                      {property.is_available ? <CheckCircle className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button type="button"
                      onClick={() => handleDeleteProperty(property.id, property.title)}
                      disabled={actionLoadingId === property.id}
                      title="Supprimer ce logement"
                      className="p-1.5 rounded-lg transition disabled:opacity-50"
                      style={{ color: 'var(--danger)' }}>
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
