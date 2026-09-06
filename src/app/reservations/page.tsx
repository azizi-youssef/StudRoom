'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { BookingForm } from '@/components/forms/booking-form';
import { clientBookingService } from '@/client/services/booking.service';
import { useAuth } from '@/context/auth-context';
import { DbBookingRequest, BookingStatus } from '@/shared/types/database';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building2,
  User,
  Phone,
  University,
  PlusCircle,
  LogIn,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  ArrowRight,
  MapPin,
  X,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const STATUS_CONFIG: Record<
  BookingStatus,
  { label: string; icon: React.ReactNode; className: string; description: string }
> = {
  APPROVED: {
    label: 'Confirmée',
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200/80 shadow-2xs',
    description: 'Félicitations ! Votre réservation a été validée par l’équipe StudRoom.',
  },
  VISIT_SCHEDULED: {
    label: 'Visite programmée',
    icon: <Calendar className="w-3.5 h-3.5" />,
    className: 'bg-brand-50 text-brand-700 border-brand-200/80 shadow-2xs',
    description: 'Une visite a été convenue avec le propriétaire ou notre conseiller local.',
  },
  CONTACTED: {
    label: 'Contacté',
    icon: <MessageSquare className="w-3.5 h-3.5" />,
    className: 'bg-blue-50 text-blue-700 border-blue-200/80 shadow-2xs',
    description: 'Un conseiller StudRoom a pris contact pour affiner votre dossier.',
  },
  REJECTED: {
    label: 'Non retenue',
    icon: <AlertCircle className="w-3.5 h-3.5" />,
    className: 'bg-rose-50 text-rose-700 border-rose-200/80 shadow-2xs',
    description: 'Le logement n’est plus disponible pour les dates demandées.',
  },
  CANCELLED: {
    label: 'Annulée',
    icon: <AlertCircle className="w-3.5 h-3.5" />,
    className: 'bg-slate-100 text-slate-600 border-slate-200 shadow-2xs',
    description: 'La demande a été annulée à votre initiative ou expirée.',
  },
  PENDING: {
    label: "En cours d'étude",
    icon: <Clock className="w-3.5 h-3.5" />,
    className: 'bg-amber-50 text-amber-800 border-amber-200/80 shadow-2xs',
    description: 'Dossier en cours d’examen (délai moyen de réponse : moins de 24h).',
  },
};

function StatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status as BookingStatus] ?? STATUS_CONFIG.PENDING;
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-bold border inline-flex items-center gap-1.5 ${config.className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
      {config.icon}
      {config.label}
    </span>
  );
}

export default function ReservationsPage() {
  const { user, isAuthenticated, isLoading: authLoading, openAuthModal } = useAuth();

  const [showForm, setShowForm] = useState(false);
  const [bookings, setBookings] = useState<DbBookingRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'ALL' | BookingStatus>('ALL');

  const fetchBookings = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const res = await clientBookingService.getAllBookings();
      if (res.success) {
        const allBookings = (res.data as DbBookingRequest[]) || [];
        const myBookings =
          user?.role === 'admin'
            ? allBookings
            : allBookings.filter((b) => b.student_email === user?.email);
        setBookings(myBookings);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchBookings();
    }
  }, [isAuthenticated]);

  // Statistics calculation
  const stats = useMemo(() => {
    const total = bookings.length;
    const pending = bookings.filter((b) => b.status === 'PENDING').length;
    const approved = bookings.filter((b) => b.status === 'APPROVED' || b.status === 'VISIT_SCHEDULED').length;
    return { total, pending, approved };
  }, [bookings]);

  // Filtered list
  const filteredBookings = useMemo(() => {
    if (statusFilter === 'ALL') return bookings;
    return bookings.filter((b) => b.status === statusFilter);
  }, [bookings, statusFilter]);

  // Wait for auth to resolve
  if (authLoading) {
    return (
      <div className="pt-28 pb-24 bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 min-h-screen flex items-center justify-center transition-colors">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Chargement de votre espace...</p>
        </div>
      </div>
    );
  }

  // Not authenticated — show rich prompt
  if (!isAuthenticated) {
    return (
      <div className="relative overflow-hidden pt-32 pb-24 bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 min-h-screen flex items-center justify-center px-4 transition-colors">
        {/* Background ambient orbs */}
        <div className="pointer-events-none absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-100/40 dark:bg-brand-900/20 rounded-full blur-3xl -z-10" />

        <div className="max-w-lg w-full text-center bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-[0_10px_35px_-5px_rgba(15,23,42,0.08)] p-8 sm:p-10 relative">
          
          {/* Header icon */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-teal-500 text-white flex items-center justify-center mx-auto mb-6 shadow-md shadow-brand-500/25">
            <Calendar className="w-8 h-8" strokeWidth={2.2} />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200/80 dark:border-brand-800/80 text-xs font-bold text-brand-700 dark:text-brand-300 uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            Espace Candidature
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">
            Connectez-vous pour voir vos réservations
          </h2>

          <p className="text-slate-600 dark:text-slate-300 text-sm mb-6 leading-relaxed">
            Suivez en direct l'avancement de vos dossiers, l'état des visites et recevez vos confirmations pour vos logements à Selouane & Nador.
          </p>

          {/* Student perks */}
          <div className="mb-8 text-left bg-slate-50/80 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200/70 dark:border-slate-700 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Suivi en temps réel de votre statut de réservation</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Coordination directe des visites sur place</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Accès prioritaire aux nouvelles disponibilités</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="primary"
              size="lg"
              className="group font-bold shadow-md shadow-brand-600/25 flex-1 justify-center rounded-xl"
              onClick={() => openAuthModal('login')}
            >
              <LogIn className="w-4 h-4 mr-2" />
              Se connecter
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="font-semibold flex-1 justify-center rounded-xl border-slate-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-brand-300"
              onClick={() => openAuthModal('register')}
            >
              Créer un compte
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden pt-28 pb-24 bg-gradient-to-b from-slate-50/80 via-white to-slate-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 min-h-screen transition-colors">
      
      {/* Background ambient orbs */}
      <div className="pointer-events-none absolute top-0 left-1/4 w-96 h-96 bg-brand-100/30 dark:bg-brand-900/20 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200/80 dark:border-brand-800/80 text-xs font-bold text-brand-700 dark:text-brand-300 uppercase tracking-wider shadow-2xs mb-2">
              <Sparkles className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400 animate-pulse" />
              Espace Réservation • Suivi en direct
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Vos Demandes de Réservation
            </h1>

            <p className="text-slate-600 dark:text-slate-300 text-sm mt-1.5 leading-relaxed max-w-2xl">
              Consultez l'avancement de votre dossier, les créneaux de visite et vos confirmations pour vos logements proches de votre faculté.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchBookings}
              title="Actualiser la liste"
              className="rounded-xl border-slate-200 text-slate-600 hover:text-brand-600 hover:border-brand-300 px-3 py-2 shadow-2xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </Button>

            <Button
              variant="primary"
              size="md"
              onClick={() => setShowForm(!showForm)}
              className="group font-bold rounded-xl shadow-md shadow-brand-600/20 hover:shadow-lg hover:shadow-brand-600/35 hover:-translate-y-0.5 active:scale-95 transition-all gap-2"
            >
              {showForm ? (
                <>
                  <X className="w-4 h-4" />
                  <span>Fermer le formulaire</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4" />
                  <span>Nouvelle Réservation</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Metric KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Demandes</p>
              <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">{stats.total}</p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Dossiers déposés</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">En cours d'étude</p>
              <p className="text-2xl sm:text-3xl font-black text-amber-700 dark:text-amber-400 mt-1">{stats.pending}</p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Réponse sous 24h</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/80 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Confirmées / Visites</p>
              <p className="text-2xl sm:text-3xl font-black text-emerald-700 dark:text-emerald-400 mt-1">{stats.approved}</p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Prêtes pour emménagement</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/80 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Booking Form Toggle Panel */}
        {showForm && (
          <div className="mb-12 bg-white dark:bg-slate-900 p-6 sm:p-9 rounded-3xl border border-brand-200 dark:border-brand-800 shadow-xl animate-fade-in relative overflow-hidden">
            <div className="flex items-center justify-between gap-4 pb-5 mb-6 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider mb-1">
                  <PlusCircle className="w-3.5 h-3.5" />
                  Formulaire Rapide
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  Réserver un logement étudiant
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <BookingForm
              onSuccess={() => {
                setShowForm(false);
                fetchBookings();
              }}
            />
          </div>
        )}

        {/* Filter Pills */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-6 pb-2">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => setStatusFilter('ALL')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === 'ALL'
                  ? 'bg-slate-900 text-white shadow-xs dark:bg-brand-600'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/90 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              Toutes ({bookings.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('PENDING')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === 'PENDING'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/90 dark:border-slate-800 hover:bg-amber-50/50 dark:hover:bg-amber-950/40'
              }`}
            >
              En cours d'étude
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('APPROVED')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === 'APPROVED'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/90 dark:border-slate-800 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/40'
              }`}
            >
              Confirmées
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('VISIT_SCHEDULED')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === 'VISIT_SCHEDULED'
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/90 dark:border-slate-800 hover:bg-brand-50/50 dark:hover:bg-brand-950/40'
              }`}
            >
              Visites programmées
            </button>
          </div>

          <span className="text-xs text-slate-400">
            {filteredBookings.length} résultat{filteredBookings.length > 1 ? 's' : ''}
          </span>
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-2xs">
            <div className="w-9 h-9 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Chargement de vos demandes...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-12 text-center flex flex-col items-center gap-4 shadow-2xs">
            <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 border border-brand-100 dark:border-brand-800 flex items-center justify-center shadow-xs">
              <Calendar className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {statusFilter === 'ALL'
                ? 'Aucune demande de réservation trouvée'
                : 'Aucune demande avec ce statut'}
            </h3>

            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
              {statusFilter === 'ALL'
                ? 'Vous n’avez pas encore soumis de demande de réservation. Remplissez le formulaire en ligne pour réserver votre logement étudiant à Selouane & Nador.'
                : 'Sélectionnez un autre filtre ou cliquez sur "Toutes" pour voir l’ensemble de vos dossiers.'}
            </p>

            <div className="flex flex-wrap gap-3 mt-2">
              <Button
                variant="primary"
                onClick={() => setShowForm(true)}
                className="font-bold shadow-md shadow-brand-600/20"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Faire une demande de réservation
              </Button>

              <Link href="/logements">
                <Button
                  variant="outline"
                  className="font-semibold border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
                >
                  Explorer les logements disponibles
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBookings.map((booking) => {
              const statusInfo = STATUS_CONFIG[booking.status as BookingStatus] ?? STATUS_CONFIG.PENDING;
              return (
                <div
                  key={booking.id}
                  className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.05)] hover:shadow-[0_16px_32px_-8px_rgba(4,108,122,0.15)] hover:border-brand-300 dark:hover:border-brand-700 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between gap-5"
                >
                  <div>
                    {/* Header: Reference + Status Badge */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                        #{booking.id.slice(0, 8)}
                      </span>
                      <StatusBadge status={booking.status} />
                    </div>

                    {/* Room Title */}
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug group-hover:text-brand-700 dark:group-hover:text-brand-400 transition-colors">
                      Chambre Étudiante {booking.study_level ? `• ${booking.study_level}` : 'Confort'}
                    </h3>

                    <p className="text-xs font-semibold text-brand-600 dark:text-brand-400 mt-1 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 shrink-0" />
                      <span>StudRoom Selouane • Al Omrane</span>
                    </p>

                    {/* Status insight banner */}
                    <div className="mt-3.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed flex items-start gap-2">
                      <div className="mt-0.5 shrink-0 text-brand-600 dark:text-brand-400">
                        <ShieldCheck className="w-3.5 h-3.5" />
                      </div>
                      <span>{statusInfo.description}</span>
                    </div>

                    {/* Details list */}
                    <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2.5">
                        <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{booking.student_name}</span>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <University className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                        <span className="truncate">{booking.university_name || 'Campus Selouane / Nador'}</span>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{booking.student_phone}</span>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>
                          Arrivée : <strong>{booking.preferred_move_in_date}</strong>{' '}
                          <span className="text-slate-400 dark:text-slate-500">({booking.preferred_duration_months} mois)</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card footer */}
                  <div className="pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
                    <span>
                      Déposé le {new Date(booking.created_at).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>

                    <span className="font-semibold text-brand-600 dark:text-brand-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-brand-500" />
                      Selouane
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}

