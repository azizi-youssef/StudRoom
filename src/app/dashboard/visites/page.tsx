'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { clientBookingService } from '@/client/services/booking.service';
import { clientAdminService } from '@/client/services/admin.service';
import { DbBookingRequest } from '@/shared/types/database';
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  UserCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  CalendarDays,
  Plus,
  ArrowRight,
  Filter,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminVisitesPage() {
  const [bookings, setBookings] = useState<DbBookingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterMode, setFilterMode] = useState<'upcoming' | 'all' | 'past'>('upcoming');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchVisits = useCallback(async () => {
    setLoading(true);
    try {
      const res = await clientBookingService.getAllBookings();
      if (res.success && res.data) {
        // Filter bookings that have visit scheduled or visit_date set
        setBookings(res.data.filter((b) => b.status === 'VISIT_SCHEDULED' || b.visit_date));
      }
    } catch (err) {
      console.error('[Visites] Error loading visits:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVisits();
  }, [fetchVisits]);

  const handleMarkVisited = async (id: string) => {
    setActionLoadingId(id);
    try {
      const res = await clientBookingService.updateBookingStatus(id, 'APPROVED');
      if (res.success) {
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status: 'APPROVED' } : b))
        );
      }
    } catch (err) {
      console.error('[Visites] Error updating status:', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCancelVisit = async (id: string) => {
    if (!window.confirm('Annuler ce rendez-vous de visite ?')) return;
    setActionLoadingId(id);
    try {
      const res = await clientBookingService.updateBookingStatus(id, 'CANCELLED');
      if (res.success) {
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status: 'CANCELLED' } : b))
        );
      }
    } catch (err) {
      console.error('[Visites] Error cancelling visit:', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const now = new Date();

  const filteredVisits = bookings.filter((b) => {
    if (!b.visit_date) return filterMode === 'all';
    const visitTime = new Date(b.visit_date);
    if (filterMode === 'upcoming') {
      return visitTime >= now && b.status === 'VISIT_SCHEDULED';
    }
    if (filterMode === 'past') {
      return visitTime < now || b.status !== 'VISIT_SCHEDULED';
    }
    return true;
  });

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
            <span className="text-primary-400 font-medium text-xs">Agenda Visites</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-950/80 border border-indigo-800/80 flex items-center justify-center text-indigo-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Visites des Logements</h1>
              <p className="text-xs text-slate-400">
                Planification des visites physiques et accompagnement des étudiants sur le campus et les résidences.
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/dashboard/reservations"
          className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-primary-600 hover:bg-primary-500 text-white shadow-lg transition flex items-center gap-1.5"
        >
          <CalendarDays className="w-4 h-4" />
          Toutes les réservations
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
        <button
          onClick={() => setFilterMode('upcoming')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
            filterMode === 'upcoming'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
          }`}
        >
          À venir (Actives)
        </button>
        <button
          onClick={() => setFilterMode('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
            filterMode === 'all'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
          }`}
        >
          Toutes l'historique ({bookings.length})
        </button>
        <button
          onClick={() => setFilterMode('past')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
            filterMode === 'past'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
          }`}
        >
          Passées / Terminées
        </button>
      </div>

      {/* Visits List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-900/40 rounded-2xl border border-slate-800/60">
          <Loader2 className="w-8 h-8 text-indigo-400 animate-spin mb-3" />
          <p className="text-xs text-slate-400">Chargement des visites planifiées...</p>
        </div>
      ) : filteredVisits.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 border border-slate-800/60 rounded-2xl">
          <Calendar className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-300">Aucune visite programmée</p>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Rendez-vous dans la section "Réservations" pour planifier des visites avec les candidats étudiants.
          </p>
          <Link
            href="/dashboard/reservations"
            className="inline-flex items-center gap-1.5 mt-4 px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
          >
            Voir les réservations <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredVisits.map((v) => {
            const isUpcoming = v.visit_date && new Date(v.visit_date) >= now;

            return (
              <div
                key={v.id}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition flex flex-col justify-between shadow-lg"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-indigo-950/80 border border-indigo-800/80 flex items-center justify-center text-indigo-400 shrink-0">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">{v.student_name}</h3>
                        <p className="text-xs text-slate-400">{v.university_name || 'Étudiant'}</p>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                        isUpcoming
                          ? 'bg-indigo-950/80 text-indigo-400 border-indigo-800/80'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {isUpcoming ? 'À venir' : 'Passée'}
                    </span>
                  </div>

                  {/* Scheduled Date Box */}
                  <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl mb-3 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-semibold block">Date & Heure :</span>
                      <span className="text-xs font-mono font-bold text-white">
                        {v.visit_date
                          ? new Date(v.visit_date).toLocaleString('fr-FR', {
                              dateStyle: 'full',
                              timeStyle: 'short',
                            })
                          : 'Non renseignée'}
                      </span>
                    </div>
                  </div>

                  {/* Notes if any */}
                  {v.visit_notes && (
                    <div className="text-xs text-slate-300 bg-slate-800/30 p-2.5 rounded-xl border border-slate-800 mb-3">
                      <span className="font-semibold text-slate-400 block text-[10px]">Consignes de visite :</span>
                      {v.visit_notes}
                    </div>
                  )}

                  {/* Contact info */}
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <a
                      href={`tel:${v.student_phone}`}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs flex items-center gap-1 hover:bg-slate-700 transition border border-slate-700/60"
                    >
                      <Phone className="w-3 h-3 text-primary-400" />
                      {v.student_phone}
                    </a>
                    <a
                      href={`mailto:${v.student_email}`}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs flex items-center gap-1 hover:bg-slate-700 transition border border-slate-700/60"
                    >
                      <Mail className="w-3 h-3 text-primary-400" />
                      {v.student_email}
                    </a>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-mono">
                    Statut: <span className="text-slate-300 font-semibold">{v.status}</span>
                  </span>

                  <div className="flex items-center gap-2">
                    {v.status !== 'APPROVED' && (
                      <Button
                        size="sm"
                        disabled={actionLoadingId === v.id}
                        onClick={() => handleMarkVisited(v.id)}
                        className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Visite effectuée & Approuver
                      </Button>
                    )}

                    {v.status === 'VISIT_SCHEDULED' && (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={actionLoadingId === v.id}
                        onClick={() => handleCancelVisit(v.id)}
                        className="text-xs border-rose-900/60 text-rose-400 hover:bg-rose-950/40"
                      >
                        Annuler
                      </Button>
                    )}
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
