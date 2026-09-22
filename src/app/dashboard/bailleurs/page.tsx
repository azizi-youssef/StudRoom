'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { clientAdminService } from '@/client/services/admin.service';
import { PropertyDetail } from '@/shared/types';
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  Layers,
  Sparkles,
  CheckCircle2,
  Clock,
  Check,
  X,
  Search,
  Filter,
  ArrowRight,
  ExternalLink,
  Loader2,
  AlertCircle,
  HelpCircle,
  Eye,
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

const STATUS_CONFIG: Record<string, { label: string; badge: string; color: string }> = {
  new: { label: 'Nouveau', badge: 'bg-primary-950/80 text-primary-400 border-primary-800/80', color: 'primary' },
  contacted: { label: 'Contacté', badge: 'bg-amber-950/80 text-amber-400 border-amber-800/80', color: 'amber' },
  visited: { label: 'Visité', badge: 'bg-indigo-950/80 text-indigo-400 border-indigo-800/80', color: 'indigo' },
  approved: { label: 'Converti / Approuvé', badge: 'bg-emerald-950/80 text-emerald-400 border-emerald-800/80', color: 'emerald' },
  rejected: { label: 'Refusé', badge: 'bg-rose-950/80 text-rose-400 border-rose-800/80', color: 'rose' },
};

export default function AdminBailleursPage() {
  const [submissions, setSubmissions] = useState<LandlordSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

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
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-1">
            <Link href="/dashboard" className="hover:text-primary-400 transition-colors text-xs">
              Tableau de bord
            </Link>
            <span>/</span>
            <span className="text-primary-400 font-medium text-xs">Propositions Bailleurs</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-800/80 flex items-center justify-center text-amber-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Propositions des Bailleurs</h1>
              <p className="text-xs text-slate-400">
                Gérez les candidatures propriétaires et convertissez en 1 clic leurs appartements en logements réels avec chambres.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={fetchSubmissions}
            variant="outline"
            className="flex items-center gap-2 px-3 py-2 text-xs border-slate-800 text-slate-300 hover:bg-slate-800"
          >
            Actualiser
          </Button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {[
            { id: 'all', label: 'Tous' },
            { id: 'new', label: 'Nouveaux' },
            { id: 'contacted', label: 'Contactés' },
            { id: 'visited', label: 'Visités' },
            { id: 'approved', label: 'Convertis' },
            { id: 'rejected', label: 'Refusés' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition flex items-center gap-1.5 ${
                statusFilter === tab.id
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-900/40'
                  : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
              }`}
            >
              {tab.label}
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  statusFilter === tab.id ? 'bg-primary-800 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {countByStatus(tab.id)}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Rechercher propriétaire, ville, téléphone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-primary-500"
          />
        </div>
      </div>

      {/* Submissions List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-900/40 rounded-2xl border border-slate-800/60">
          <Loader2 className="w-8 h-8 text-primary-400 animate-spin mb-3" />
          <p className="text-xs text-slate-400">Chargement des propositions bailleurs...</p>
        </div>
      ) : filteredSubmissions.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 border border-slate-800/60 rounded-2xl">
          <Building2 className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-300">Aucune proposition trouvée</p>
          <p className="text-xs text-slate-500 mt-1">Modifiez vos critères de recherche ou vos filtres.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredSubmissions.map((sub) => {
            const statusMeta = STATUS_CONFIG[sub.status] || {
              label: sub.status,
              badge: 'bg-slate-800 text-slate-400 border-slate-700',
            };

            return (
              <div
                key={sub.id}
                className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700 transition flex flex-col justify-between backdrop-blur-sm relative group shadow-lg shadow-black/20"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-primary-300 transition">
                        {sub.first_name} {sub.last_name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-primary-400" />
                          {sub.city} • {sub.neighborhood || 'Centre'}
                        </span>
                        <span>•</span>
                        <span className="text-[11px] text-slate-500">
                          {new Date(sub.created_at).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg border ${statusMeta.badge}`}>
                      {statusMeta.label}
                    </span>
                  </div>

                  {/* Contact Info Chips */}
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <a
                      href={`tel:${sub.phone}`}
                      className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 text-xs flex items-center gap-1.5 border border-slate-700/60 transition"
                    >
                      <Phone className="w-3 h-3 text-primary-400" />
                      {sub.phone}
                    </a>
                    <a
                      href={`mailto:${sub.email}`}
                      className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 text-xs flex items-center gap-1.5 border border-slate-700/60 transition"
                    >
                      <Mail className="w-3 h-3 text-primary-400" />
                      {sub.email}
                    </a>
                  </div>

                  {/* Property specs badge row */}
                  <div className="grid grid-cols-3 gap-2.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-center mb-4">
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase font-medium">Loyer Souhaité</span>
                      <span className="text-xs font-bold text-amber-400">
                        {formatCurrencyDH(sub.expected_rent_dh)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase font-medium">Chambres</span>
                      <span className="text-xs font-bold text-white">{sub.rooms_count} pièces</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase font-medium">Superficie</span>
                      <span className="text-xs font-bold text-white">{sub.surface_sqm} m²</span>
                    </div>
                  </div>

                  {/* Landlord notes / message */}
                  {sub.message && (
                    <div className="text-xs text-slate-300 bg-slate-800/40 p-3 rounded-xl border border-slate-800/80 mb-4 line-clamp-3">
                      <span className="font-semibold text-slate-400 block text-[11px] mb-0.5">Note bailleur :</span>
                      "{sub.message}"
                    </div>
                  )}
                </div>

                {/* Actions Footer */}
                <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {sub.status !== 'contacted' && sub.status !== 'approved' && (
                      <button
                        disabled={actionLoadingId === sub.id}
                        onClick={() => handleStatusChange(sub.id, 'contacted')}
                        className="px-2.5 py-1 text-[11px] rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 transition"
                      >
                        Marquer contacté
                      </button>
                    )}
                    {sub.status !== 'visited' && sub.status !== 'approved' && (
                      <button
                        disabled={actionLoadingId === sub.id}
                        onClick={() => handleStatusChange(sub.id, 'visited')}
                        className="px-2.5 py-1 text-[11px] rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 transition"
                      >
                        Marquer visité
                      </button>
                    )}
                    {sub.status !== 'rejected' && sub.status !== 'approved' && (
                      <button
                        disabled={actionLoadingId === sub.id}
                        onClick={() => handleStatusChange(sub.id, 'rejected')}
                        className="px-2.5 py-1 text-[11px] rounded-lg text-rose-400 hover:bg-rose-950/40 border border-transparent hover:border-rose-900/50 transition"
                      >
                        Refuser
                      </button>
                    )}
                  </div>

                  {sub.status === 'approved' ? (
                    <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1 bg-emerald-950/60 px-3 py-1 rounded-lg border border-emerald-800/60">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Déjà converti
                    </span>
                  ) : (
                    <Button
                      onClick={() => openConversionModal(sub)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-gradient-to-r from-primary-600 to-teal-500 hover:from-primary-500 hover:to-teal-400 text-white shadow-md shadow-primary-900/30 flex items-center gap-1.5"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/40">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary-950 text-primary-400 border border-primary-800 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Conversion Automatisée en Logement</h3>
                  <p className="text-[11px] text-slate-400">
                    Bailleur : {selectedSubmission.first_name} {selectedSubmission.last_name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setConversionModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {conversionResult ? (
              <div className="p-6 text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-950/80 border border-emerald-800 text-emerald-400 flex items-center justify-center mx-auto shadow-xl">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-white">Logement créé avec succès !</h4>
                <p className="text-xs text-slate-300 max-w-sm mx-auto">
                  Le logement "{conversionResult.title}" a été généré avec {conversionResult.total_rooms} chambres
                  prêtes à la location.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                  <Link
                    href={`/dashboard/logements/${conversionResult.id}/chambres`}
                    className="w-full sm:w-auto px-4 py-2 text-xs font-semibold rounded-xl bg-primary-600 hover:bg-primary-500 text-white shadow-lg transition"
                  >
                    Gérer les Chambres
                  </Link>
                  <Link
                    href={`/dashboard/logements/${conversionResult.id}/photos`}
                    className="w-full sm:w-auto px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
                  >
                    Ajouter les Photos
                  </Link>
                </div>
              </div>
            ) : (
              <div className="p-5 space-y-4">
                {errorMessage && (
                  <div className="p-3 text-xs bg-rose-950/60 border border-rose-800/80 text-rose-300 rounded-xl">
                    {errorMessage}
                  </div>
                )}

                <div className="p-3 bg-primary-950/40 border border-primary-900/60 rounded-xl text-xs text-primary-200">
                  <p className="font-semibold mb-1">Processus de conversion automatique :</p>
                  <ul className="list-disc list-inside space-y-0.5 text-primary-300/80 text-[11px]">
                    <li>Crée la fiche logement dans la base de données</li>
                    <li>Génère automatiquement {overrideRooms} chambres individuelles prêtes</li>
                    <li>Lie le logement au compte propriétaire s'il existe</li>
                    <li>Passe la candidature au statut "Approuvé"</li>
                  </ul>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Titre public de la résidence
                  </label>
                  <input
                    type="text"
                    value={overrideTitle}
                    onChange={(e) => setOverrideTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Loyer (DH/mois)</label>
                    <input
                      type="number"
                      value={overrideRent}
                      onChange={(e) => setOverrideRent(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Chambres</label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={overrideRooms}
                      onChange={(e) => setOverrideRooms(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Surface (m²)</label>
                    <input
                      type="number"
                      value={overrideSurface}
                      onChange={(e) => setOverrideSurface(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setConversionModalOpen(false)}
                    className="text-xs border-slate-700 text-slate-300 hover:bg-slate-800"
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={handleConvert}
                    disabled={converting}
                    className="text-xs bg-primary-600 hover:bg-primary-500 text-white font-semibold flex items-center gap-1.5 shadow-lg shadow-primary-900/30"
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
