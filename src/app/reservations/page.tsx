'use client';

import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const STATUS_CONFIG: Record<BookingStatus, { label: string; icon: React.ReactNode; className: string }> = {
  APPROVED: {
    label: 'Confirmée',
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    className: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  },
  VISIT_SCHEDULED: {
    label: 'Visite programmée',
    icon: <Calendar className="w-3.5 h-3.5" />,
    className: 'bg-brand-100 text-brand-700 border-brand-200',
  },
  CONTACTED: {
    label: 'Contacté',
    icon: <MessageSquare className="w-3.5 h-3.5" />,
    className: 'bg-blue-100 text-blue-700 border-blue-200',
  },
  REJECTED: {
    label: 'Non retenue',
    icon: <AlertCircle className="w-3.5 h-3.5" />,
    className: 'bg-rose-100 text-rose-700 border-rose-200',
  },
  CANCELLED: {
    label: 'Annulée',
    icon: <AlertCircle className="w-3.5 h-3.5" />,
    className: 'bg-slate-100 text-slate-600 border-slate-200',
  },
  PENDING: {
    label: "En cours d'étude",
    icon: <Clock className="w-3.5 h-3.5" />,
    className: 'bg-amber-100 text-amber-800 border-amber-200',
  },
};

function StatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status as BookingStatus] ?? STATUS_CONFIG.PENDING;
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold border inline-flex items-center gap-1 ${config.className}`}>
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

  const fetchBookings = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const res = await clientBookingService.getAllBookings();
      if (res.success) {
        // For non-admin users, filter to show only their own bookings by email
        const allBookings = (res.data as DbBookingRequest[]) || [];
        const myBookings = user?.role === 'admin'
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

  // Wait for auth to resolve
  if (authLoading) {
    return (
      <div className="pt-28 pb-24 bg-slate-50 min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Not authenticated — show prompt
  if (!isAuthenticated) {
    return (
      <div className="pt-28 pb-24 bg-slate-50 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center bg-white rounded-3xl border border-slate-200 shadow-soft p-10">
          <div className="w-16 h-16 rounded-2xl bg-brand-100 text-brand-600 flex items-center justify-center mx-auto mb-6">
            <Calendar className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-3">Connexion requise</h2>
          <p className="text-slate-500 text-sm mb-6">
            Connectez-vous pour suivre vos demandes de réservation et accéder à votre espace personnel.
          </p>
          <Button
            variant="primary"
            size="md"
            className="font-bold shadow-soft w-full"
            onClick={() => openAuthModal('login')}
          >
            <LogIn className="w-4 h-4 mr-2" />
            Se connecter
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-12">
          <div>
            <span className="text-xs font-bold text-brand-600 uppercase tracking-widest bg-brand-50 px-3.5 py-1 rounded-full border border-brand-100">
              Espace Réservation
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-2">
              Vos Demandes de Réservation
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Suivez le statut de votre dossier de réservation à Selouane / Nador.
            </p>
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={() => setShowForm(!showForm)}
            className="font-bold shadow-soft"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            {showForm ? 'Masquer le formulaire' : 'Nouvelle Demande'}
          </Button>
        </div>

        {/* Booking Form Toggle */}
        {showForm && (
          <div className="mb-12 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl animate-fade-in">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Effectuer une réservation</h2>
            <BookingForm
              onSuccess={() => {
                setShowForm(false);
                fetchBookings();
              }}
            />
          </div>
        )}

        {/* Bookings List */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
              <Calendar className="w-8 h-8 text-brand-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Aucune demande de réservation</h3>
            <p className="text-sm text-slate-500 max-w-md">
              Vous n&apos;avez pas encore soumis de demande. Cliquez sur &ldquo;Nouvelle Demande&rdquo; pour réserver votre logement étudiant à Selouane.
            </p>
            <Button variant="primary" onClick={() => setShowForm(true)}>
              Réserver une chambre
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-soft hover:shadow-card transition-all flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-mono font-bold text-slate-400">
                      Ref: {booking.id.slice(0, 12)}…
                    </span>
                    <StatusBadge status={booking.status} />
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 leading-snug mb-1">
                    Chambre Étudiante
                  </h3>
                  <p className="text-xs font-semibold text-brand-600 mb-4 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5" />
                    StudRoom Selouane
                  </p>

                  <div className="space-y-2 text-xs text-slate-600 pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="font-semibold text-slate-800">{booking.student_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <University className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span>{booking.university_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span>{booking.student_phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span>
                        Arrivée prévue : <strong>{booking.preferred_move_in_date}</strong>{' '}
                        ({booking.preferred_duration_months} mois)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Demandé le : {new Date(booking.created_at).toLocaleDateString('fr-FR')}</span>
                  <span className="font-bold text-brand-600">StudRoom Nador</span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
