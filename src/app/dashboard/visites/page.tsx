'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { clientBookingService } from '@/client/services/booking.service';
import { DbBookingRequest } from '@/shared/types/database';
import {
  Calendar,
  Clock,
  Phone,
  Mail,
  CheckCircle2,
  Loader2,
  CalendarDays,
  ArrowRight,
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
              Agenda Visites
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
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                Visites des Logements
              </h1>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                Planification des visites physiques et accompagnement des étudiants sur le campus et les résidences.
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/dashboard/reservations"
          className="btn-brand self-start sm:self-center px-4 py-2 text-xs font-semibold rounded-xl text-white shadow-sm transition-all flex items-center gap-2"
          style={{
            backgroundColor: 'var(--brand-primary, #0EA5C6)',
            color: '#FFFFFF',
          }}
        >
          <CalendarDays className="w-4 h-4 text-white" />
          <span>Toutes les réservations</span>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b pb-3" style={{ borderColor: 'var(--border-subtle)' }}>
        <button
          onClick={() => setFilterMode('upcoming')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            filterMode === 'upcoming'
              ? 'btn-brand text-white shadow-sm'
              : 'dash-card'
          }`}
          style={
            filterMode === 'upcoming'
              ? {
                  backgroundColor: 'var(--brand-primary, #0EA5C6)',
                  color: '#FFFFFF',
                }
              : {
                  backgroundColor: 'var(--bg-card, #FFFFFF)',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border-default)',
                }
          }
        >
          À venir (Actives)
        </button>
        <button
          onClick={() => setFilterMode('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            filterMode === 'all'
              ? 'btn-brand text-white shadow-sm'
              : 'dash-card'
          }`}
          style={
            filterMode === 'all'
              ? {
                  backgroundColor: 'var(--brand-primary, #0EA5C6)',
                  color: '#FFFFFF',
                }
              : {
                  backgroundColor: 'var(--bg-card, #FFFFFF)',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border-default)',
                }
          }
        >
          Tout l'historique ({bookings.length})
        </button>
        <button
          onClick={() => setFilterMode('past')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            filterMode === 'past'
              ? 'btn-brand text-white shadow-sm'
              : 'dash-card'
          }`}
          style={
            filterMode === 'past'
              ? {
                  backgroundColor: 'var(--brand-primary, #0EA5C6)',
                  color: '#FFFFFF',
                }
              : {
                  backgroundColor: 'var(--bg-card, #FFFFFF)',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border-default)',
                }
          }
        >
          Passées / Terminées
        </button>
      </div>

      {/* Visits List */}
      {loading ? (
        <div
          className="dash-card flex flex-col items-center justify-center py-20"
          style={{ backgroundColor: 'var(--bg-card)' }}
        >
          <Loader2 className="w-8 h-8 animate-spin mb-3" style={{ color: 'var(--brand-primary)' }} />
          <p className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
            Chargement des visites planifiées...
          </p>
        </div>
      ) : filteredVisits.length === 0 ? (
        <div
          className="dash-card text-center py-16"
          style={{ backgroundColor: 'var(--bg-card)' }}
        >
          <Calendar className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
          <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            Aucune visite programmée
          </p>
          <p className="text-xs mt-1 max-w-sm mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Rendez-vous dans la section "Réservations" pour planifier des visites avec les candidats étudiants.
          </p>
          <Link
            href="/dashboard/reservations"
            className="inline-flex items-center gap-1.5 mt-4 px-3.5 py-1.5 text-xs font-semibold rounded-xl dash-card transition"
            style={{ color: 'var(--text-primary)' }}
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
                className="dash-card p-5 flex flex-col justify-between transition-all"
                style={{ backgroundColor: 'var(--bg-card)' }}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor: 'var(--brand-bg)',
                          color: 'var(--brand-primary)',
                          border: '1px solid var(--brand-bg-strong)',
                        }}
                      >
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                          {v.student_name}
                        </h3>
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                          {v.university_name || 'Étudiant'}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        isUpcoming ? 'badge-primary' : 'badge-neutral'
                      }`}
                    >
                      {isUpcoming ? 'À venir' : 'Passée'}
                    </span>
                  </div>

                  {/* Scheduled Date Box */}
                  <div
                    className="p-3 rounded-xl mb-3 flex items-center justify-between border"
                    style={{
                      backgroundColor: 'var(--bg-subtle)',
                      borderColor: 'var(--border-subtle)',
                    }}
                  >
                    <div>
                      <span className="text-[10px] uppercase font-semibold block" style={{ color: 'var(--text-muted)' }}>
                        Date & Heure :
                      </span>
                      <span className="text-xs font-mono font-bold" style={{ color: 'var(--text-primary)' }}>
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
                    <div
                      className="text-xs p-2.5 rounded-xl border mb-3"
                      style={{
                        backgroundColor: 'var(--bg-subtle)',
                        borderColor: 'var(--border-subtle)',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      <span className="font-semibold block text-[10px] mb-0.5" style={{ color: 'var(--text-primary)' }}>
                        Consignes de visite :
                      </span>
                      {v.visit_notes}
                    </div>
                  )}

                  {/* Contact info */}
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <a
                      href={`tel:${v.student_phone}`}
                      className="px-2.5 py-1 rounded-lg text-xs flex items-center gap-1.5 transition-all border"
                      style={{
                        backgroundColor: 'var(--bg-subtle)',
                        borderColor: 'var(--border-subtle)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <Phone className="w-3 h-3" style={{ color: 'var(--brand-primary)' }} />
                      {v.student_phone}
                    </a>
                    <a
                      href={`mailto:${v.student_email}`}
                      className="px-2.5 py-1 rounded-lg text-xs flex items-center gap-1.5 transition-all border"
                      style={{
                        backgroundColor: 'var(--bg-subtle)',
                        borderColor: 'var(--border-subtle)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <Mail className="w-3 h-3" style={{ color: 'var(--brand-primary)' }} />
                      {v.student_email}
                    </a>
                  </div>
                </div>

                {/* Actions */}
                <div
                  className="pt-3 border-t flex items-center justify-between"
                  style={{ borderColor: 'var(--border-subtle)' }}
                >
                  <span className="text-[11px] font-mono" style={{ color: 'var(--text-muted)' }}>
                    Statut: <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{v.status}</span>
                  </span>

                  <div className="flex items-center gap-2">
                    {v.status !== 'APPROVED' && (
                      <Button
                        size="sm"
                        disabled={actionLoadingId === v.id}
                        onClick={() => handleMarkVisited(v.id)}
                        className="text-xs font-semibold flex items-center gap-1 text-white shadow-sm"
                        style={{ backgroundColor: 'var(--color-emerald-500)' }}
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
                        className="text-xs font-medium"
                        style={{
                          color: 'var(--error-fg)',
                          borderColor: 'var(--error-border)',
                          backgroundColor: 'var(--error-bg)',
                        }}
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
