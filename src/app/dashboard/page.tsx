'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { clientBookingService } from '@/client/services/booking.service';
import { clientLandlordService } from '@/client/services/landlord.service';
import { clientContactService } from '@/client/services/contact.service';
import { clientPropertyService } from '@/client/services/property.service';
import { useAuth } from '@/context/auth-context';
import { AccessDenied } from './_components/access-denied';
import {
  DbBookingRequest,
  DbLandlordSubmission,
  DbContactRequest,
  BookingStatus,
} from '@/shared/types/database';
import { PropertyDetail } from '@/shared/types';
import {
  Building2,
  Calendar,
  UserCheck,
  Mail,
  Home,
  Phone,
  Check,
  X,
  RefreshCw,
  Loader2,
  MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// ─── Status Helpers ──────────────────────────────────────────────────────────

const BOOKING_STATUS_CONFIG: Record<
  BookingStatus,
  { label: string; className: string }
> = {
  PENDING: { label: 'En attente', className: 'bg-amber-100 text-amber-800' },
  CONTACTED: { label: 'Contacté', className: 'bg-blue-100 text-blue-800' },
  VISIT_SCHEDULED: { label: 'Visite programmée', className: 'bg-brand-100 text-brand-800' },
  APPROVED: { label: 'Confirmée', className: 'bg-emerald-100 text-emerald-800' },
  REJECTED: { label: 'Refusée', className: 'bg-rose-100 text-rose-800' },
  CANCELLED: { label: 'Annulée', className: 'bg-slate-100 text-slate-600' },
};

function BookingStatusBadge({ status }: { status: string }) {
  const config = BOOKING_STATUS_CONFIG[status as BookingStatus] ?? {
    label: status,
    className: 'bg-slate-100 text-slate-600',
  };
  return (
    <span className={`px-2.5 py-1 rounded-full font-bold text-[11px] ${config.className}`}>
      {config.label}
    </span>
  );
}

function LandlordStatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string }> = {
    new: { label: 'Nouvelle', className: 'bg-amber-100 text-amber-800' },
    contacted: { label: 'Contacté', className: 'bg-brand-100 text-brand-800' },
    approved: { label: 'Approuvée', className: 'bg-emerald-100 text-emerald-800' },
    declined: { label: 'Refusée', className: 'bg-rose-100 text-rose-800' },
  };
  const config = map[status] ?? { label: status, className: 'bg-slate-100 text-slate-600' };
  return (
    <span className={`px-2.5 py-1 rounded-full font-bold text-[11px] ${config.className}`}>
      {config.label}
    </span>
  );
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────

interface KpiCardProps {
  label: string;
  value: string | number;
  sub: string;
  subClassName?: string;
  icon: React.ReactNode;
  iconBg: string;
}

function KpiCard({ label, value, sub, subClassName, icon, iconBg }: KpiCardProps) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft flex items-center justify-between">
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</p>
        <h3 className="text-3xl font-black text-slate-900 mt-1">{value}</h3>
        <p className={`text-xs font-bold mt-1 ${subClassName ?? 'text-slate-500'}`}>{sub}</p>
      </div>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${iconBg}`}>
        {icon}
      </div>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function DashboardSkeleton() {
  return (
    <div className="pt-28 pb-24 bg-slate-50 min-h-screen animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-10 bg-slate-200 rounded-2xl w-64 mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-white rounded-3xl border border-slate-200 shadow-soft" />
          ))}
        </div>
        <div className="h-12 bg-slate-200 rounded-2xl mb-8 max-w-3xl" />
        <div className="h-64 bg-white rounded-3xl border border-slate-200 shadow-soft" />
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'bookings' | 'proposals' | 'properties' | 'contacts'>('bookings');
  const [bookings, setBookings] = useState<DbBookingRequest[]>([]);
  const [proposals, setProposals] = useState<DbLandlordSubmission[]>([]);
  const [properties, setProperties] = useState<PropertyDetail[]>([]);
  const [contacts, setContacts] = useState<DbContactRequest[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // ── Auth guard ──────────────────────────────────────────────────────────────
  // Wait for auth state to be resolved before rendering
  if (authLoading) return <DashboardSkeleton />;
  if (!isAuthenticated) return <AccessDenied reason="unauthenticated" />;
  if (user?.role !== 'admin') return <AccessDenied reason="forbidden" />;

  // ── Data loading ────────────────────────────────────────────────────────────
  const loadDashboardData = async () => {
    setDataLoading(true);
    try {
      const [bookingsRes, proposalsRes, propertiesRes, contactsRes] = await Promise.all([
        clientBookingService.getAllBookings(),
        clientLandlordService.getAllProposals(),
        clientPropertyService.searchProperties(),
        clientContactService.getAllTickets(),
      ]);

      if (bookingsRes.success) setBookings((bookingsRes.data as DbBookingRequest[]) || []);
      if (proposalsRes.success) setProposals((proposalsRes.data as DbLandlordSubmission[]) || []);
      if (propertiesRes.success) setProperties((propertiesRes.data as PropertyDetail[]) || []);
      if (contactsRes.success) setContacts((contactsRes.data as DbContactRequest[]) || []);
    } catch (err) {
      console.error('[Dashboard] Error loading data:', err);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // ── Actions ─────────────────────────────────────────────────────────────────
  const handleUpdateBookingStatus = async (id: string, newStatus: BookingStatus) => {
    setActionLoadingId(id);
    try {
      const res = await clientBookingService.updateBookingStatus(id, newStatus);
      if (res.success) {
        setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b)));
      }
    } catch (err) {
      console.error('[Dashboard] Error updating booking status:', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleUpdateLandlordStatus = async (id: string, newStatus: DbLandlordSubmission['status']) => {
    setActionLoadingId(id);
    try {
      const res = await clientLandlordService.updateProposalStatus(id, newStatus);
      if (res.success) {
        setProposals((prev) => prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p)));
      }
    } catch (err) {
      console.error('[Dashboard] Error updating landlord status:', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  // ── KPI Metrics (calculated from real data) ─────────────────────────────────
  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter((b) => b.status === 'PENDING').length;
  const approvedBookings = bookings.filter((b) => b.status === 'APPROVED').length;
  const totalProposals = proposals.length;
  const totalProperties = properties.length;
  const totalRooms = properties.reduce((acc, p) => acc + (p.total_rooms || 0), 0);
  const availableRooms = properties.reduce((acc, p) => acc + (p.available_rooms || 0), 0);
  const occupancyRate = totalRooms > 0
    ? Math.round(((totalRooms - availableRooms) / totalRooms) * 100)
    : 0;

  const tabs: Array<{ id: typeof activeTab; label: string; count: number; icon: React.ReactNode }> = [
    { id: 'bookings', label: 'Réservations', count: totalBookings, icon: <Calendar className="w-4 h-4" /> },
    { id: 'proposals', label: 'Propositions Propriétaires', count: totalProposals, icon: <UserCheck className="w-4 h-4" /> },
    { id: 'properties', label: 'Logements', count: totalProperties, icon: <Building2 className="w-4 h-4" /> },
    { id: 'contacts', label: 'Support', count: contacts.length, icon: <Mail className="w-4 h-4" /> },
  ];

  return (
    <div className="pt-28 pb-24 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Dashboard Header ─────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-brand-600 uppercase tracking-widest bg-brand-50 px-3.5 py-1 rounded-full border border-brand-100">
              Administration & Gestion
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-2">
              Tableau de Bord StudRoom
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Supervision en temps réel · Connecté en tant que <strong>{user.full_name}</strong>
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={loadDashboardData}
            disabled={dataLoading}
            className="font-bold border-slate-200 shadow-soft"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${dataLoading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        </div>

        {/* ── KPI Cards ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <KpiCard
            label="Réservations"
            value={dataLoading ? '—' : totalBookings}
            sub={`${pendingBookings} en attente · ${approvedBookings} approuvées`}
            subClassName="text-amber-600"
            icon={<Calendar className="w-6 h-6" />}
            iconBg="bg-amber-100 text-amber-700"
          />
          <KpiCard
            label="Chambres Disponibles"
            value={dataLoading ? '—' : `${availableRooms} / ${totalRooms}`}
            sub={`Taux d'occupation : ${occupancyRate}%`}
            subClassName="text-emerald-600"
            icon={<Home className="w-6 h-6" />}
            iconBg="bg-emerald-100 text-emerald-700"
          />
          <KpiCard
            label="Offres Bailleurs"
            value={dataLoading ? '—' : totalProposals}
            sub={`${proposals.filter((p) => p.status === 'new').length} nouvelles`}
            subClassName="text-brand-600"
            icon={<UserCheck className="w-6 h-6" />}
            iconBg="bg-brand-100 text-brand-700"
          />
          <KpiCard
            label="Logements Gérés"
            value={dataLoading ? '—' : totalProperties}
            sub="Selouane & Nador"
            icon={<Building2 className="w-6 h-6" />}
            iconBg="bg-slate-100 text-slate-700"
          />
        </div>

        {/* ── Tab Navigation ───────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-1 bg-slate-200/70 p-1.5 rounded-2xl mb-8 border border-slate-300/60">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-max py-2.5 px-4 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-white text-brand-600 shadow-soft'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.icon}
              {tab.label} ({dataLoading ? '…' : tab.count})
            </button>
          ))}
        </div>

        {/* Loading overlay */}
        {dataLoading && (
          <div className="flex items-center justify-center py-20 gap-3 text-slate-500">
            <Loader2 className="w-6 h-6 animate-spin text-brand-600" />
            <span className="text-sm font-medium">Chargement des données…</span>
          </div>
        )}

        {/* ── TAB 1 : RÉSERVATIONS ─────────────────────────────────────── */}
        {!dataLoading && activeTab === 'bookings' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-soft overflow-hidden animate-fade-in">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Demandes de Réservation Reçues</h2>
              <span className="text-xs text-slate-500 font-medium">Gestion en direct</span>
            </div>

            {bookings.length === 0 ? (
              <div className="p-12 text-center text-slate-500 text-sm">Aucune demande de réservation.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4">Ref & Étudiant</th>
                      <th className="px-6 py-4">Université</th>
                      <th className="px-6 py-4">Chambre & Date</th>
                      <th className="px-6 py-4">Statut</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {bookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-bold text-slate-900">{booking.student_name}</p>
                          <p className="text-slate-500 font-mono text-[11px] mt-0.5">{booking.student_email}</p>
                          <p className="text-slate-500 text-[11px]">{booking.student_phone}</p>
                        </td>
                        <td className="px-6 py-4 max-w-xs">
                          <p className="font-semibold text-slate-800">{booking.university_name}</p>
                          <span className="inline-block mt-0.5 px-2 py-0.5 rounded bg-slate-100 text-[10px] text-slate-600 font-bold">
                            {booking.study_level}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-brand-600">Chambre réservée</p>
                          <p className="text-slate-500 text-[11px]">
                            Arrivée : {booking.preferred_move_in_date} ({booking.preferred_duration_months} mois)
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <BookingStatusBadge status={booking.status} />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5 flex-wrap">
                            {booking.status !== 'CONTACTED' && (
                              <button
                                onClick={() => handleUpdateBookingStatus(booking.id, 'CONTACTED')}
                                disabled={actionLoadingId === booking.id}
                                title="Marquer contacté"
                                className="p-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white transition-colors"
                              >
                                <MessageSquare className="w-4 h-4" />
                              </button>
                            )}
                            {booking.status !== 'VISIT_SCHEDULED' && (
                              <button
                                onClick={() => handleUpdateBookingStatus(booking.id, 'VISIT_SCHEDULED')}
                                disabled={actionLoadingId === booking.id}
                                title="Programmer une visite"
                                className="p-1.5 rounded-lg bg-brand-50 text-brand-700 hover:bg-brand-600 hover:text-white transition-colors"
                              >
                                <Calendar className="w-4 h-4" />
                              </button>
                            )}
                            {booking.status !== 'APPROVED' && (
                              <button
                                onClick={() => handleUpdateBookingStatus(booking.id, 'APPROVED')}
                                disabled={actionLoadingId === booking.id}
                                title="Valider la réservation"
                                className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-colors"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                            )}
                            {booking.status !== 'REJECTED' && (
                              <button
                                onClick={() => handleUpdateBookingStatus(booking.id, 'REJECTED')}
                                disabled={actionLoadingId === booking.id}
                                title="Refuser"
                                className="p-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── TAB 2 : PROPOSITIONS PROPRIÉTAIRES ───────────────────────── */}
        {!dataLoading && activeTab === 'proposals' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-soft overflow-hidden animate-fade-in">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Offres de Bailleurs à Selouane / Nador</h2>
              <span className="text-xs text-slate-500 font-medium">Gestion du parc immobilier</span>
            </div>

            {proposals.length === 0 ? (
              <div className="p-12 text-center text-slate-500 text-sm">Aucune proposition propriétaire.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4">Propriétaire</th>
                      <th className="px-6 py-4">Bien & Localisation</th>
                      <th className="px-6 py-4">Chambres & Loyer Est.</th>
                      <th className="px-6 py-4">Statut</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {proposals.map((prop) => (
                      <tr key={prop.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-bold text-slate-900">{prop.full_name}</p>
                          <p className="text-slate-500 font-mono text-[11px] mt-0.5">{prop.email}</p>
                          <p className="text-slate-500 text-[11px]">{prop.phone}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-slate-800">{prop.city} — {prop.neighborhood}</p>
                          <span className="inline-block mt-0.5 px-2 py-0.5 rounded bg-slate-100 text-[10px] text-slate-600 font-bold uppercase">
                            {prop.property_type}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-brand-600">{prop.expected_rent_dh} DH / mois</p>
                          <p className="text-slate-500 text-[11px]">{prop.rooms_count} chambres ({prop.surface_sqm || 80} m²)</p>
                        </td>
                        <td className="px-6 py-4">
                          <LandlordStatusBadge status={prop.status} />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {prop.status !== 'contacted' && (
                              <button
                                onClick={() => handleUpdateLandlordStatus(prop.id, 'contacted')}
                                disabled={actionLoadingId === prop.id}
                                title="Marquer comme contacté"
                                className="p-1.5 rounded-lg bg-brand-50 text-brand-700 hover:bg-brand-600 hover:text-white transition-colors"
                              >
                                <Phone className="w-4 h-4" />
                              </button>
                            )}
                            {prop.status !== 'approved' && (
                              <button
                                onClick={() => handleUpdateLandlordStatus(prop.id, 'approved')}
                                disabled={actionLoadingId === prop.id}
                                title="Valider la proposition"
                                className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-colors"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                            )}
                            {prop.status !== 'declined' && (
                              <button
                                onClick={() => handleUpdateLandlordStatus(prop.id, 'declined')}
                                disabled={actionLoadingId === prop.id}
                                title="Décliner"
                                className="p-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── TAB 3 : LOGEMENTS ────────────────────────────────────────── */}
        {!dataLoading && activeTab === 'properties' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {properties.length === 0 ? (
              <div className="col-span-3 p-12 text-center text-slate-500 text-sm bg-white rounded-3xl border border-slate-200">
                Aucun logement enregistré.
              </div>
            ) : (
              properties.map((property) => (
                <div key={property.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-soft flex flex-col justify-between gap-4">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                        {property.status}
                      </span>
                      <span className="text-xs font-bold text-slate-400">{property.neighborhood}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">{property.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{property.description}</p>
                  </div>
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                    <span className="text-brand-600">{property.min_price_dh} – {property.max_price_dh} DH/mois</span>
                    <span className="text-slate-700">{property.available_rooms} chambres dispo.</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── TAB 4 : SUPPORT ──────────────────────────────────────────── */}
        {!dataLoading && activeTab === 'contacts' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-soft overflow-hidden animate-fade-in">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Messages & Support Clients</h2>
              <span className="text-xs text-slate-500 font-medium">Demandes d'assistance</span>
            </div>

            {contacts.length === 0 ? (
              <div className="p-12 text-center text-slate-500 text-sm">Aucun message de contact.</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {contacts.map((ticket) => (
                  <div key={ticket.id} className="p-6 hover:bg-slate-50/80 transition-colors flex flex-col md:flex-row items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-bold text-slate-900 text-sm">{ticket.full_name}</h4>
                        <span className="text-xs font-mono text-slate-400">Ref: {ticket.id}</span>
                      </div>
                      <p className="text-xs font-semibold text-brand-600 mb-2">Sujet : {ticket.subject}</p>
                      <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100 max-w-2xl">
                        &ldquo;{ticket.message}&rdquo;
                      </p>
                    </div>
                    <div className="flex flex-col text-right text-xs text-slate-500 gap-1 flex-shrink-0">
                      <span>Email : <strong>{ticket.email}</strong></span>
                      <span>Tél : <strong>{ticket.phone}</strong></span>
                      <span className="text-[10px] text-slate-400 mt-1">
                        {new Date(ticket.created_at).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
