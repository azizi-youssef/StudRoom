'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { clientAdminService } from '@/client/services/admin.service';
import { PropertyDetail } from '@/shared/types';
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Search,
  Sparkles,
  Loader2,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrencyDH } from '@/lib/utils';

export interface LandlordSubmission {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  city: string;
  neighborhood: string;
  property_type: string;
  rooms_count: number;
  surface_sqm: number;
  expected_rent_dh: number;
  availability_date: string;
  message?: string;
  status: 'new' | 'contacted' | 'visited' | 'approved' | 'rejected';
  created_at: string;
}

const STATUS_CONFIG: Record<string, { label: string; badgeClass: string }> = {
  new: { label: 'Nouveau', badgeClass: 'badge-primary' },
  contacted: { label: 'Contacté', badgeClass: 'badge-warning' },
  visited: { label: 'Visité', badgeClass: 'badge-info' },
  approved: { label: 'Converti / Approuvé', badgeClass: 'badge-success' },
  rejected: { label: 'Refusé', badgeClass: 'badge-danger' },
};

function AdminBailleursContent() {
  const searchParams = useSearchParams();
  const [submissions, setSubmissions] = useState<LandlordSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>(searchParams?.get('status') || 'all');

  useEffect(() => {
    const s = searchParams?.get('status');
    if (s) {
      setStatusFilter(s);
    }
  }, [searchParams]);

  // Conversion modal
  const [selectedSubmission, setSelectedSubmission] = useState<LandlordSubmission | null>(null);
  const [conversionModalOpen, setConversionModalOpen] = useState(false);
  const [overrideTitle, setOverrideTitle] = useState('');
  const [overrideRent, setOverrideRent] = useState(2000);
  const [overrideRooms, setOverrideRooms] = useState(3);
  const [overrideSurface, setOverrideSurface] = useState(80);
  const [converting, setConverting] = useState(false);
  const [conversionResult, setConversionResult] = useState<PropertyDetail | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await clientAdminService.getLandlordSubmissions();
      if (res.success && res.data) {
        setSubmissions(res.data);
      }
    } catch (err) {
      console.error('[Bailleurs] Error loading submissions:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setActionLoadingId(id);
    try {
      const res = await clientAdminService.updateLandlordSubmissionStatus(id, newStatus);
      if (res.success) {
        setSubmissions((prev) =>
          prev.map((sub) => (sub.id === id ? { ...sub, status: newStatus as any } : sub))
        );
      }
    } catch (err) {
      console.error('[Bailleurs] Status update error:', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const openConversionModal = (sub: LandlordSubmission) => {
    setSelectedSubmission(sub);
    setOverrideTitle(`Résidence ${sub.neighborhood || sub.city} - ${sub.first_name} ${sub.last_name}`);
    setOverrideRent(sub.expected_rent_dh || 2000);
    setOverrideRooms(sub.rooms_count || 3);
    setOverrideSurface(sub.surface_sqm || 75);
    setConversionResult(null);
    setErrorMessage(null);
    setConversionModalOpen(true);
  };

  const handleConvert = async () => {
    if (!selectedSubmission) return;
    setConverting(true);
    setErrorMessage(null);

    try {
      const res = await clientAdminService.convertLandlordSubmission(selectedSubmission.id, {
        title: overrideTitle,
        monthly_price_dh: Number(overrideRent),
        rooms_count: Number(overrideRooms),
        surface_sqm: Number(overrideSurface),
      });

      if (res.success && res.data) {
        setConversionResult(res.data);
        setSubmissions((prev) =>
          prev.map((s) => (s.id === selectedSubmission.id ? { ...s, status: 'approved' } : s))
        );
      } else {
        setErrorMessage(res.error?.message || 'Échec de la conversion du bien.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Erreur inattendue.');
    } finally {
      setConverting(false);
    }
  };

  const filteredSubmissions = submissions.filter((sub) => {
    const matchesSearch =
      `${sub.first_name} ${sub.last_name} ${sub.email} ${sub.phone} ${sub.city} ${sub.neighborhood}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const countByStatus = (status: string) =>
    submissions.filter((s) => (status === 'all' ? true : s.status === status)).length;

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
              Propositions Bailleurs
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{
                backgroundColor: 'var(--warning-bg)',
                border: '1px solid var(--warning-border)',
                color: 'var(--warning-fg)',
              }}
            >
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                Propositions des Bailleurs
              </h1>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                Gérez les candidatures propriétaires et convertissez en 1 clic leurs appartements en logements réels avec chambres.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={fetchSubmissions}
            variant="outline"
            className="dash-card flex items-center gap-2 px-3.5 py-2 text-xs font-medium"
            style={{ color: 'var(--text-primary)' }}
          >
            Actualiser
          </Button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {[
            { id: 'all', label: 'Tous' },
            { id: 'new', label: 'Nouveaux' },
            { id: 'contacted', label: 'Contactés' },
            { id: 'visited', label: 'Visités' },
            { id: 'approved', label: 'Convertis' },
            { id: 'rejected', label: 'Refusés' },
          ].map((tab) => {
            const isActive = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isActive ? 'btn-brand text-white shadow-sm' : 'dash-card'
                }`}
                style={
                  !isActive
                    ? {
                        backgroundColor: 'var(--bg-card)',
                        color: 'var(--text-secondary)',
                      }
                    : undefined
                }
              >
                {tab.label}
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold"
                  style={{
                    backgroundColor: isActive ? 'rgba(255, 255, 255, 0.25)' : 'var(--bg-subtle)',
                    color: isActive ? '#FFFFFF' : 'var(--text-muted)',
                  }}
                >
                  {countByStatus(tab.id)}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <Search
            className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: 'var(--text-muted)' }}
          />
          <input
            type="text"
            placeholder="Rechercher propriétaire, ville..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none transition-all"
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
            }}
          />
        </div>
      </div>

      {/* Submissions List */}
      {loading ? (
        <div
          className="dash-card flex flex-col items-center justify-center py-20"
          style={{ backgroundColor: 'var(--bg-card)' }}
        >
          <Loader2 className="w-8 h-8 animate-spin mb-3" style={{ color: 'var(--brand-primary)' }} />
          <p className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
            Chargement des propositions bailleurs...
          </p>
        </div>
      ) : filteredSubmissions.length === 0 ? (
        <div
          className="dash-card text-center py-16"
          style={{ backgroundColor: 'var(--bg-card)' }}
        >
          <Building2 className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
          <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            Aucune proposition trouvée
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
            Modifiez vos critères de recherche ou vos filtres.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSubmissions.map((sub) => {
            const statusMeta = STATUS_CONFIG[sub.status] || {
              label: sub.status,
              badgeClass: 'badge-neutral',
            };

            return (
              <div
                key={sub.id}
                className="dash-card p-5 flex flex-col justify-between transition-all relative group"
                style={{ backgroundColor: 'var(--bg-card)' }}
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="text-base font-bold transition-colors" style={{ color: 'var(--text-primary)' }}>
                        {sub.first_name} {sub.last_name}
                      </h3>
                      <div
                        className="flex items-center gap-2 mt-1 text-xs"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" style={{ color: 'var(--brand-primary)' }} />
                          {sub.city} • {sub.neighborhood || 'Centre'}
                        </span>
                        <span>•</span>
                        <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                          {new Date(sub.created_at).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg ${statusMeta.badgeClass}`}>
                      {statusMeta.label}
                    </span>
                  </div>

                  {/* Contact Info Chips */}
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <a
                      href={`tel:${sub.phone}`}
                      className="px-2.5 py-1 rounded-lg text-xs flex items-center gap-1.5 transition-all"
                      style={{
                        backgroundColor: 'var(--bg-subtle)',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <Phone className="w-3 h-3" style={{ color: 'var(--brand-primary)' }} />
                      {sub.phone}
                    </a>
                    <a
                      href={`mailto:${sub.email}`}
                      className="px-2.5 py-1 rounded-lg text-xs flex items-center gap-1.5 transition-all"
                      style={{
                        backgroundColor: 'var(--bg-subtle)',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <Mail className="w-3 h-3" style={{ color: 'var(--brand-primary)' }} />
                      {sub.email}
                    </a>
                  </div>

                  {/* Property specs badge row */}
                  <div
                    className="grid grid-cols-3 gap-2.5 p-3 rounded-xl text-center mb-4 border"
                    style={{
                      backgroundColor: 'var(--bg-subtle)',
                      borderColor: 'var(--border-subtle)',
                    }}
                  >
                    <div>
                      <span className="text-[10px] block uppercase font-medium" style={{ color: 'var(--text-muted)' }}>
                        Loyer Souhaité
                      </span>
                      <span className="text-xs font-bold" style={{ color: 'var(--brand-primary)' }}>
                        {formatCurrencyDH(sub.expected_rent_dh)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] block uppercase font-medium" style={{ color: 'var(--text-muted)' }}>
                        Chambres
                      </span>
                      <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                        {sub.rooms_count} pièces
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] block uppercase font-medium" style={{ color: 'var(--text-muted)' }}>
                        Superficie
                      </span>
                      <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                        {sub.surface_sqm} m²
                      </span>
                    </div>
                  </div>

                  {/* Landlord notes / message */}
                  {sub.message && (
                    <div
                      className="text-xs p-3 rounded-xl mb-4 line-clamp-3 border"
                      style={{
                        backgroundColor: 'var(--bg-subtle)',
                        borderColor: 'var(--border-subtle)',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      <span className="font-semibold block text-[11px] mb-0.5" style={{ color: 'var(--text-primary)' }}>
                        Note bailleur :
                      </span>
                      "{sub.message}"
                    </div>
                  )}
                </div>

                {/* Actions Footer */}
                <div
                  className="pt-3 border-t flex flex-wrap items-center justify-between gap-2"
                  style={{ borderColor: 'var(--border-subtle)' }}
                >
                  <div className="flex items-center gap-1.5">
                    {sub.status !== 'contacted' && sub.status !== 'approved' && (
                      <button
                        disabled={actionLoadingId === sub.id}
                        onClick={() => handleStatusChange(sub.id, 'contacted')}
                        className="px-2.5 py-1 text-[11px] rounded-lg transition-all font-medium border"
                        style={{
                          backgroundColor: 'var(--bg-subtle)',
                          borderColor: 'var(--border-subtle)',
                          color: 'var(--text-secondary)',
                        }}
                      >
                        Marquer contacté
                      </button>
                    )}
                    {sub.status !== 'visited' && sub.status !== 'approved' && (
                      <button
                        disabled={actionLoadingId === sub.id}
                        onClick={() => handleStatusChange(sub.id, 'visited')}
                        className="px-2.5 py-1 text-[11px] rounded-lg transition-all font-medium border"
                        style={{
                          backgroundColor: 'var(--bg-subtle)',
                          borderColor: 'var(--border-subtle)',
                          color: 'var(--text-secondary)',
                        }}
                      >
                        Marquer visité
                      </button>
                    )}
                    {sub.status !== 'rejected' && sub.status !== 'approved' && (
                      <button
                        disabled={actionLoadingId === sub.id}
                        onClick={() => handleStatusChange(sub.id, 'rejected')}
                        className="px-2.5 py-1 text-[11px] rounded-lg transition-all font-medium"
                        style={{
                          color: 'var(--error-fg)',
                          backgroundColor: 'var(--error-bg)',
                        }}
                      >
                        Refuser
                      </button>
                    )}
                  </div>

                  {sub.status === 'approved' ? (
                    <span className="text-xs font-semibold flex items-center gap-1 px-3 py-1 rounded-lg badge-success">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Déjà converti
                    </span>
                  ) : (
                    <Button
                      onClick={() => openConversionModal(sub)}
                      className="btn-brand px-3 py-1.5 text-xs font-semibold rounded-xl text-white shadow-sm flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Convertir en Logement
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CONVERSION MODAL */}
      {conversionModalOpen && selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div
            className="dash-card rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-strong)',
            }}
          >
            <div
              className="flex items-center justify-between p-5 border-b"
              style={{
                borderColor: 'var(--border-subtle)',
                backgroundColor: 'var(--bg-subtle)',
              }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{
                    backgroundColor: 'var(--brand-bg)',
                    color: 'var(--brand-primary)',
                    border: '1px solid var(--brand-bg-strong)',
                  }}
                >
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                    Conversion Automatisée en Logement
                  </h3>
                  <p className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                    Bailleur : {selectedSubmission.first_name} {selectedSubmission.last_name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setConversionModalOpen(false)}
                className="p-1 rounded-lg transition-colors"
                style={{ color: 'var(--text-muted)' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {conversionResult ? (
              <div className="p-6 text-center space-y-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto shadow-md"
                  style={{
                    backgroundColor: 'var(--success-bg)',
                    color: 'var(--success-fg)',
                    border: '1px solid var(--success-border)',
                  }}
                >
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                  Logement créé avec succès !
                </h4>
                <p className="text-xs max-w-sm mx-auto" style={{ color: 'var(--text-secondary)' }}>
                  Le logement "{conversionResult.title}" a été généré avec {conversionResult.total_rooms} chambres
                  prêtes à la location.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                  <Link
                    href={`/dashboard/logements/${conversionResult.id}/chambres`}
                    className="btn-brand w-full sm:w-auto px-4 py-2 text-xs font-semibold rounded-xl text-white shadow-md transition"
                  >
                    Gérer les Chambres
                  </Link>
                  <Link
                    href={`/dashboard/logements/${conversionResult.id}/photos`}
                    className="dash-card w-full sm:w-auto px-4 py-2 text-xs font-semibold rounded-xl transition"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    Ajouter les Photos
                  </Link>
                </div>
              </div>
            ) : (
              <div className="p-5 space-y-4">
                {errorMessage && (
                  <div
                    className="p-3 text-xs rounded-xl border"
                    style={{
                      backgroundColor: 'var(--error-bg)',
                      borderColor: 'var(--error-border)',
                      color: 'var(--error-fg)',
                    }}
                  >
                    {errorMessage}
                  </div>
                )}

                <div
                  className="p-3.5 rounded-xl text-xs border"
                  style={{
                    backgroundColor: 'var(--brand-bg)',
                    borderColor: 'var(--brand-bg-strong)',
                    color: 'var(--text-primary)',
                  }}
                >
                  <p className="font-semibold mb-1" style={{ color: 'var(--brand-primary)' }}>
                    Processus de conversion automatique :
                  </p>
                  <ul className="list-disc list-inside space-y-0.5 text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                    <li>Crée la fiche logement dans la base de données</li>
                    <li>Génère automatiquement {overrideRooms} chambres individuelles prêtes</li>
                    <li>Lie le logement au compte propriétaire s'il existe</li>
                    <li>Passe la candidature au statut "Approuvé"</li>
                  </ul>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>
                    Titre public de la résidence
                  </label>
                  <input
                    type="text"
                    value={overrideTitle}
                    onChange={(e) => setOverrideTitle(e.target.value)}
                    className="w-full rounded-xl px-3 py-2 text-xs focus:outline-none transition-all"
                    style={{
                      backgroundColor: 'var(--bg-subtle)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                    }}
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>
                      Loyer (DH/mois)
                    </label>
                    <input
                      type="number"
                      value={overrideRent}
                      onChange={(e) => setOverrideRent(Number(e.target.value))}
                      className="w-full rounded-xl px-3 py-2 text-xs focus:outline-none transition-all"
                      style={{
                        backgroundColor: 'var(--bg-subtle)',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--text-primary)',
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>
                      Chambres
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={overrideRooms}
                      onChange={(e) => setOverrideRooms(Number(e.target.value))}
                      className="w-full rounded-xl px-3 py-2 text-xs focus:outline-none transition-all"
                      style={{
                        backgroundColor: 'var(--bg-subtle)',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--text-primary)',
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>
                      Surface (m²)
                    </label>
                    <input
                      type="number"
                      value={overrideSurface}
                      onChange={(e) => setOverrideSurface(Number(e.target.value))}
                      className="w-full rounded-xl px-3 py-2 text-xs focus:outline-none transition-all"
                      style={{
                        backgroundColor: 'var(--bg-subtle)',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--text-primary)',
                      }}
                    />
                  </div>
                </div>

                <div
                  className="flex items-center justify-end gap-3 pt-4 border-t"
                  style={{ borderColor: 'var(--border-subtle)' }}
                >
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setConversionModalOpen(false)}
                    className="dash-card text-xs font-medium"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={handleConvert}
                    disabled={converting}
                    className="btn-brand text-xs font-semibold flex items-center gap-1.5 text-white shadow-md"
                  >
                    {converting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                    Confirmer la conversion
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminBailleursPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center" style={{ color: 'var(--text-muted)' }}>Chargement des propositions de propriétaires...</div>}>
      <AdminBailleursContent />
    </Suspense>
  );
}
