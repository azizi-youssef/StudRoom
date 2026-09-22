'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { clientBookingService } from '@/client/services/booking.service';
import { clientAdminService } from '@/client/services/admin.service';
import { DbBookingRequest, BookingStatus } from '@/shared/types/database';
import {
  CalendarDays,
  Search,
  Filter,
  Kanban,
  Table as TableIcon,
  Phone,
  Mail,
  GraduationCap,
  Clock,
  CheckCircle2,
  XCircle,
  Calendar,
  Eye,
  X,
  AlertCircle,
  ArrowRight,
  Loader2,
  UserCheck,
  Send,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const STATUS_CONFIG: Record<BookingStatus, { label: string; badge: string; border: string }> = {
  PENDING: { label: 'En attente', badge: 'bg-amber-950/80 text-amber-400', border: 'border-amber-800/80' },
  CONTACTED: { label: 'Contacté', badge: 'bg-primary-950/80 text-primary-400', border: 'border-primary-800/80' },
  VISIT_SCHEDULED: { label: 'Visite planifiée', badge: 'bg-indigo-950/80 text-indigo-400', border: 'border-indigo-800/80' },
  APPROVED: { label: 'Approuvé', badge: 'bg-emerald-950/80 text-emerald-400', border: 'border-emerald-800/80' },
  REJECTED: { label: 'Rejeté', badge: 'bg-rose-950/80 text-rose-400', border: 'border-rose-800/80' },
  CANCELLED: { label: 'Annulé', badge: 'bg-slate-800 text-slate-400', border: 'border-slate-700' },
};

const KANBAN_COLUMNS: { status: BookingStatus; label: string }[] = [
  { status: 'PENDING', label: 'En attente' },
  { status: 'CONTACTED', label: 'Contacté' },
  { status: 'VISIT_SCHEDULED', label: 'Visite planifiée' },
  { status: 'APPROVED', label: 'Approuvé' },
  { status: 'REJECTED', label: 'Refusé / Annulé' },
];

export default function AdminReservationsPage() {
  const [bookings, setBookings] = useState<DbBookingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Detail / Visit scheduling modal
  const [selectedBooking, setSelectedBooking] = useState<DbBookingRequest | null>(null);
  const [visitDate, setVisitDate] = useState('');
  const [visitNotes, setVisitNotes] = useState('');
  const [schedulingVisit, setSchedulingVisit] = useState(false);
  const [visitError, setVisitError] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await clientBookingService.getAllBookings();
      if (res.success && res.data) {
        setBookings(res.data);
      }
    } catch (err) {
      console.error('[Reservations] Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleStatusChange = async (id: string, newStatus: BookingStatus) => {
    setActionLoadingId(id);
    try {
      const res = await clientBookingService.updateBookingStatus(id, newStatus);
      if (res.success) {
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
        );
        if (selectedBooking && selectedBooking.id === id) {
          setSelectedBooking((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
      }
    } catch (err) {
      console.error('[Reservations] Status change error:', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleScheduleVisitSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking || !visitDate) return;

    setSchedulingVisit(true);
    setVisitError(null);
    try {
      const res = await clientAdminService.scheduleVisit(selectedBooking.id, visitDate, visitNotes);
      if (res.success) {
        setBookings((prev) =>
          prev.map((b) =>
            b.id === selectedBooking.id
              ? { ...b, status: 'VISIT_SCHEDULED', visit_date: visitDate, visit_notes: visitNotes }
              : b
          )
        );
        setSelectedBooking((prev) =>
          prev ? { ...prev, status: 'VISIT_SCHEDULED', visit_date: visitDate, visit_notes: visitNotes } : null
        );
        setVisitDate('');
        setVisitNotes('');
      } else {
        setVisitError(res.error?.message || 'Erreur lors de la planification de la visite.');
      }
    } catch (err: any) {
      setVisitError(err.message || 'Erreur de communication API.');
    } finally {
      setSchedulingVisit(false);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      `${b.student_name} ${b.student_email} ${b.student_phone} ${b.university_name}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
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
            <span className="text-primary-400 font-medium text-xs">Gestion Réservations</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-950/80 border border-primary-800/80 flex items-center justify-center text-primary-400">
              <CalendarDays className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Demandes de Réservation</h1>
              <p className="text-xs text-slate-400">
                Pipeline des candidatures étudiantes : traitement, contacts téléphoniques, planification des visites et validation des baux.
              </p>
            </div>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setViewMode('table')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              viewMode === 'table' ? 'bg-primary-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <TableIcon className="w-3.5 h-3.5" />
            Tableau
          </button>
          <button
            onClick={() => setViewMode('kanban')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              viewMode === 'kanban' ? 'bg-primary-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Kanban className="w-3.5 h-3.5" />
            Kanban
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative min-w-[280px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Rechercher étudiant, email, téléphone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-primary-500"
          />
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              statusFilter === 'all'
                ? 'bg-slate-700 text-white'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            Tous ({bookings.length})
          </button>
          {Object.entries(STATUS_CONFIG).map(([key, val]) => (
            <button
              key={key}
              onClick={() => setStatusFilter(key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
                statusFilter === key
                  ? `${val.badge} ${val.border}`
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {val.label} ({bookings.filter((b) => b.status === key).length})
            </button>
          ))}
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-900/40 rounded-2xl border border-slate-800/60">
          <Loader2 className="w-8 h-8 text-primary-400 animate-spin mb-3" />
          <p className="text-xs text-slate-400">Chargement des réservations...</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 border border-slate-800/60 rounded-2xl">
          <CalendarDays className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-300">Aucune demande de réservation trouvée</p>
          <p className="text-xs text-slate-500 mt-1">Ajustez vos filtres ou effectuez une nouvelle recherche.</p>
        </div>
      ) : viewMode === 'table' ? (
        /* TABLE VIEW */
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">Étudiant</th>
                  <th className="py-3.5 px-4">Établissement</th>
                  <th className="py-3.5 px-4">Emménagement</th>
                  <th className="py-3.5 px-4">Durée</th>
                  <th className="py-3.5 px-4">Statut</th>
                  <th className="py-3.5 px-4">Date Demande</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredBookings.map((b) => {
                  const statusMeta = STATUS_CONFIG[b.status] || {
                    label: b.status,
                    badge: 'bg-slate-800 text-slate-400',
                    border: 'border-slate-700',
                  };

                  return (
                    <tr key={b.id} className="hover:bg-slate-800/30 transition">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-white">{b.student_name}</div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-500" />
                            {b.student_phone}
                          </span>
                          <span>•</span>
                          <span>{b.student_email}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 text-slate-200">
                          <GraduationCap className="w-3.5 h-3.5 text-primary-400 shrink-0" />
                          <span className="truncate max-w-[160px]" title={b.university_name}>
                            {b.university_name || 'Non spécifié'}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500">{b.study_level || 'Licence / Master'}</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-200">
                        {b.preferred_move_in_date || 'Dès que possible'}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-300">
                        {b.preferred_duration_months} mois
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg border ${statusMeta.badge} ${statusMeta.border}`}
                        >
                          {statusMeta.label}
                        </span>
                        {b.visit_date && (
                          <div className="text-[10px] text-indigo-400 mt-1 flex items-center gap-1 font-mono">
                            <Clock className="w-2.5 h-2.5" />
                            {new Date(b.visit_date).toLocaleDateString('fr-FR', {
                              day: '2-digit',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                        {new Date(b.created_at || b.requested_at).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: 'short',
                        })}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedBooking(b)}
                            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
                            title="Détails & Planifier visite"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <select
                            disabled={actionLoadingId === b.id}
                            value={b.status}
                            onChange={(e) => handleStatusChange(b.id, e.target.value as BookingStatus)}
                            className="bg-slate-950 border border-slate-700 text-slate-300 text-[11px] rounded-lg px-2 py-1 focus:outline-none focus:border-primary-500 disabled:opacity-50"
                          >
                            <option value="PENDING">En attente</option>
                            <option value="CONTACTED">Contacté</option>
                            <option value="VISIT_SCHEDULED">Visite planifiée</option>
                            <option value="APPROVED">Approuvé</option>
                            <option value="REJECTED">Rejeté</option>
                            <option value="CANCELLED">Annulé</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* KANBAN VIEW */
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
          {KANBAN_COLUMNS.map((col) => {
            const colBookings = filteredBookings.filter((b) =>
              col.status === 'REJECTED'
                ? b.status === 'REJECTED' || b.status === 'CANCELLED'
                : b.status === col.status
            );

            return (
              <div
                key={col.status}
                className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3 flex flex-col min-h-[500px]"
              >
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">{col.label}</span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
                    {colBookings.length}
                  </span>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto">
                  {colBookings.map((b) => (
                    <div
                      key={b.id}
                      onClick={() => setSelectedBooking(b)}
                      className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 hover:border-primary-500/60 cursor-pointer transition shadow-md group"
                    >
                      <div className="font-semibold text-xs text-white group-hover:text-primary-300">
                        {b.student_name}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-1 truncate">
                        <GraduationCap className="w-3 h-3 text-primary-400 shrink-0" />
                        <span className="truncate">{b.university_name || 'Étudiant'}</span>
                      </div>

                      <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-slate-800/60 text-[10px] text-slate-500">
                        <span>{b.preferred_duration_months} mois</span>
                        {b.visit_date ? (
                          <span className="text-indigo-400 flex items-center gap-0.5 font-mono">
                            <Clock className="w-2.5 h-2.5" />
                            {new Date(b.visit_date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                          </span>
                        ) : (
                          <span>{b.preferred_move_in_date || 'Dès que possible'}</span>
                        )}
                      </div>
                    </div>
                  ))}

                  {colBookings.length === 0 && (
                    <div className="h-24 flex items-center justify-center border border-dashed border-slate-800/60 rounded-xl text-[11px] text-slate-600">
                      Vide
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DETAIL / SCHEDULE VISIT MODAL */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary-950 text-primary-400 border border-primary-800 flex items-center justify-center">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{selectedBooking.student_name}</h3>
                  <p className="text-[11px] text-slate-400">Détails de la demande & planification de visite</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Contact info */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-950/60 border border-slate-800 rounded-xl text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-medium block">Téléphone</span>
                  <a href={`tel:${selectedBooking.student_phone}`} className="text-primary-400 font-semibold hover:underline">
                    {selectedBooking.student_phone}
                  </a>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-medium block">Email</span>
                  <a href={`mailto:${selectedBooking.student_email}`} className="text-primary-400 font-semibold hover:underline">
                    {selectedBooking.student_email}
                  </a>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-medium block">Université</span>
                  <span className="text-slate-200 font-medium">{selectedBooking.university_name || 'Non spécifié'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-medium block">Niveau d'études</span>
                  <span className="text-slate-200 font-medium">{selectedBooking.study_level || 'Étudiant'}</span>
                </div>
              </div>

              {/* Booking specifications */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-800/40 border border-slate-800 rounded-xl">
                  <span className="text-[10px] text-slate-500 block">Emménagement souhaité</span>
                  <span className="text-white font-bold">{selectedBooking.preferred_move_in_date || 'Immédiat'}</span>
                </div>
                <div className="p-3 bg-slate-800/40 border border-slate-800 rounded-xl">
                  <span className="text-[10px] text-slate-500 block">Durée prévue</span>
                  <span className="text-white font-bold">{selectedBooking.preferred_duration_months} mois</span>
                </div>
              </div>

              {/* Message from student */}
              {selectedBooking.message && (
                <div className="p-3 bg-slate-800/30 border border-slate-800 rounded-xl text-xs text-slate-300">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block mb-1">Message de l'étudiant :</span>
                  "{selectedBooking.message}"
                </div>
              )}

              {/* Visit section */}
              <div className="p-4 bg-primary-950/20 border border-primary-900/40 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-primary-400">
                  <Calendar className="w-4 h-4" />
                  Planification de Visite Physique
                </div>

                {selectedBooking.visit_date && (
                  <div className="p-2.5 rounded-lg bg-indigo-950/60 border border-indigo-800/60 text-xs text-indigo-200">
                    <span className="font-semibold block text-[11px]">Visite actuellement programmée :</span>
                    {new Date(selectedBooking.visit_date).toLocaleString('fr-FR', {
                      dateStyle: 'full',
                      timeStyle: 'short',
                    })}
                    {selectedBooking.visit_notes && <p className="text-[11px] text-indigo-300 mt-1">Note : {selectedBooking.visit_notes}</p>}
                  </div>
                )}

                <form onSubmit={handleScheduleVisitSubmit} className="space-y-3 pt-1">
                  {visitError && <div className="text-xs text-rose-400">{visitError}</div>}
                  <div>
                    <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                      Date & Heure du rendez-vous
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={visitDate}
                      onChange={(e) => setVisitDate(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                      Notes de visite (agent, consignes, lieu exact)
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Rencontre devant la faculté, agent Youssef"
                      value={visitNotes}
                      onChange={(e) => setVisitNotes(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary-500"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={schedulingVisit}
                    className="w-full text-xs bg-primary-600 hover:bg-primary-500 text-white font-semibold flex items-center justify-center gap-1.5 py-2 shadow-md"
                  >
                    {schedulingVisit ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    Enregistrer / Mettre à jour la visite
                  </Button>
                </form>
              </div>

              {/* Status Update Buttons */}
              <div className="pt-2 border-t border-slate-800">
                <span className="text-[11px] text-slate-400 block mb-2 font-medium">Changer de statut :</span>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStatusChange(selectedBooking.id, 'CONTACTED')}
                    className="text-xs border-slate-700 text-slate-300 hover:bg-slate-800"
                  >
                    Marquer Contacté
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleStatusChange(selectedBooking.id, 'APPROVED')}
                    className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white"
                  >
                    Approuver la demande
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStatusChange(selectedBooking.id, 'REJECTED')}
                    className="text-xs border-rose-900/60 text-rose-400 hover:bg-rose-950/40"
                  >
                    Refuser
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
