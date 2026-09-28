'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { clientBookingService } from '@/client/services/booking.service';
import { clientAdminService } from '@/client/services/admin.service';
import { DbBookingRequest, BookingStatus } from '@/shared/types/database';
import {
  CalendarDays, Search, Kanban, Table as TableIcon,
  Phone, GraduationCap, Clock, Calendar, Eye, X,
  Loader2, UserCheck, Send, CheckCircle2, XCircle,
} from 'lucide-react';

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<BookingStatus, { label: string; cls: string }> = {
  PENDING:        { label: 'En attente',      cls: 'badge-warning' },
  CONTACTED:      { label: 'Contacté',        cls: 'badge-brand' },
  VISIT_SCHEDULED:{ label: 'Visite planifiée',cls: 'badge-info' },
  APPROVED:       { label: 'Approuvé',        cls: 'badge-success' },
  REJECTED:       { label: 'Rejeté',          cls: 'badge-danger' },
  CANCELLED:      { label: 'Annulé',          cls: '' },
};

const KANBAN_COLUMNS: { status: BookingStatus; label: string }[] = [
  { status: 'PENDING',         label: 'En attente' },
  { status: 'CONTACTED',       label: 'Contacté' },
  { status: 'VISIT_SCHEDULED', label: 'Visite planifiée' },
  { status: 'APPROVED',        label: 'Approuvé' },
  { status: 'REJECTED',        label: 'Refusé / Annulé' },
];

// ── Shared input style ─────────────────────────────────────────────────────────
const inputCls = `w-full rounded-xl px-3 py-2 text-[13px] focus:outline-none transition`;
const inputStyle = {
  background: 'var(--bg-surface)',
  border: '1px solid var(--border-default)',
  color: 'var(--text-primary)',
};
const focusBorder = { '--focus-border': 'var(--brand-primary)' } as React.CSSProperties;

// ── Main content ──────────────────────────────────────────────────────────────
function AdminReservationsContent() {
  const searchParams = useSearchParams();
  const [bookings, setBookings] = useState<DbBookingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>(searchParams?.get('status') || 'all');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<DbBookingRequest | null>(null);
  const [visitDate, setVisitDate] = useState('');
  const [visitNotes, setVisitNotes] = useState('');
  const [schedulingVisit, setSchedulingVisit] = useState(false);
  const [visitError, setVisitError] = useState<string | null>(null);

  useEffect(() => {
    const s = searchParams?.get('status');
    if (s) setStatusFilter(s);
  }, [searchParams]);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await clientBookingService.getAllBookings();
      if (res.success && res.data) setBookings(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const handleStatusChange = async (id: string, newStatus: BookingStatus) => {
    setActionLoadingId(id);
    try {
      const res = await clientBookingService.updateBookingStatus(id, newStatus);
      if (res.success) {
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
        if (selectedBooking?.id === id) setSelectedBooking(prev => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (err) { console.error(err); }
    finally { setActionLoadingId(null); }
  };

  const handleScheduleVisitSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking || !visitDate) return;
    setSchedulingVisit(true);
    setVisitError(null);
    try {
      const res = await clientAdminService.scheduleVisit(selectedBooking.id, visitDate, visitNotes);
      if (res.success) {
        const updated = { ...selectedBooking, status: 'VISIT_SCHEDULED' as BookingStatus, visit_date: visitDate, visit_notes: visitNotes };
        setBookings(prev => prev.map(b => b.id === selectedBooking.id ? updated : b));
        setSelectedBooking(updated);
        setVisitDate(''); setVisitNotes('');
      } else { setVisitError(res.error?.message || 'Erreur lors de la planification.'); }
    } catch (err: any) { setVisitError(err.message || 'Erreur API.'); }
    finally { setSchedulingVisit(false); }
  };

  const filtered = bookings.filter(b => {
    const matchSearch = `${b.student_name} ${b.student_email} ${b.student_phone} ${b.university_name}`
      .toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const filterBtnBase = `px-3 py-1.5 rounded-lg text-[12.5px] font-semibold whitespace-nowrap transition-all`;

  return (
    <div className="flex flex-col gap-7 animate-fade-in">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6"
        style={{ borderBottom: '1px solid var(--border-default)' }}>
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center kpi-icon-demandes shrink-0">
              <CalendarDays className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-[22px] font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                Demandes de Réservation
              </h1>
              <p className="text-[12.5px]" style={{ color: 'var(--text-secondary)' }}>
                Pipeline des candidatures étudiantes — traitement, contacts, planification et validation.
              </p>
            </div>
          </div>
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: 'var(--bg-surface-hover)', border: '1px solid var(--border-default)' }}>
          <button onClick={() => setViewMode('table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12.5px] font-semibold transition`}
            style={viewMode === 'table'
              ? { background: 'var(--brand-primary)', color: '#fff' }
              : { color: 'var(--text-secondary)' }}>
            <TableIcon className="w-3.5 h-3.5" /> Tableau
          </button>
          <button onClick={() => setViewMode('kanban')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12.5px] font-semibold transition`}
            style={viewMode === 'kanban'
              ? { background: 'var(--brand-primary)', color: '#fff' }
              : { color: 'var(--text-secondary)' }}>
            <Kanban className="w-3.5 h-3.5" /> Kanban
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative min-w-[280px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input type="text" placeholder="Rechercher étudiant, email, téléphone…"
            value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            className={inputCls} style={{ ...inputStyle, paddingLeft: '2.25rem' }} />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 flex-wrap">
          <button onClick={() => setStatusFilter('all')} className={filterBtnBase}
            style={statusFilter === 'all'
              ? { background: 'var(--text-primary)', color: '#fff' }
              : { background: 'var(--bg-surface)', border: '1px solid var(--border-default)', color: 'var(--text-secondary)' }}>
            Tous ({bookings.length})
          </button>
          {Object.entries(STATUS_CONFIG).map(([key, val]) => (
            <button key={key} onClick={() => setStatusFilter(key)} className={`${filterBtnBase} ${statusFilter === key ? val.cls : ''}`}
              style={statusFilter !== key ? { background: 'var(--bg-surface)', border: '1px solid var(--border-default)', color: 'var(--text-secondary)' } : {}}>
              {val.label} ({bookings.filter(b => b.status === key).length})
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 rounded-2xl"
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)' }}>
          <Loader2 className="w-8 h-8 animate-spin mb-3" style={{ color: 'var(--brand-primary)' }} />
          <p className="text-[13px]" style={{ color: 'var(--text-muted)' }}>Chargement des réservations…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 rounded-2xl text-center"
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)' }}>
          <CalendarDays className="w-10 h-10 mb-3" style={{ color: 'var(--text-muted)' }} />
          <p className="text-[14px] font-semibold" style={{ color: 'var(--text-primary)' }}>Aucune demande trouvée</p>
          <p className="text-[12.5px] mt-1" style={{ color: 'var(--text-secondary)' }}>Ajustez vos filtres ou effectuez une nouvelle recherche.</p>
        </div>
      ) : viewMode === 'table' ? (

        /* TABLE */
        <div className="dash-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-default)', background: 'var(--bg-surface-hover)' }}>
                  {['Étudiant', 'Établissement', 'Emménagement', 'Durée', 'Statut', 'Date', 'Actions'].map((h, i) => (
                    <th key={h} className={`py-3 px-4 text-[11px] font-semibold uppercase tracking-wider ${i === 6 ? 'text-right' : ''}`}
                      style={{ color: 'var(--text-muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(b => {
                  const st = STATUS_CONFIG[b.status] || { label: b.status, cls: '' };
                  return (
                    <tr key={b.id} className="transition"
                      style={{ borderBottom: '1px solid var(--border-subtle)' }}
                      onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = 'var(--bg-surface-hover)'}
                      onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = ''}>
                      <td className="py-3 px-4">
                        <div className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>{b.student_name}</div>
                        <div className="text-[11.5px] flex items-center gap-2 mt-0.5" style={{ color: 'var(--text-muted)' }}>
                          <Phone className="w-3 h-3" />{b.student_phone}
                          <span>·</span>{b.student_email}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 text-[13px]" style={{ color: 'var(--text-primary)' }}>
                          <GraduationCap className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--brand-primary)' }} />
                          <span className="truncate max-w-[150px]">{b.university_name || 'Non spécifié'}</span>
                        </div>
                        <div className="text-[11.5px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{b.study_level || 'Étudiant'}</div>
                      </td>
                      <td className="py-3 px-4 text-[13px] font-mono" style={{ color: 'var(--text-secondary)' }}>
                        {b.preferred_move_in_date || 'Dès que possible'}
                      </td>
                      <td className="py-3 px-4 text-[13px]" style={{ color: 'var(--text-secondary)' }}>
                        {b.preferred_duration_months} mois
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 text-[11.5px] font-semibold rounded-lg ${st.cls}`}>{st.label}</span>
                        {b.visit_date && (
                          <div className="text-[11px] mt-1 flex items-center gap-1 font-mono" style={{ color: 'var(--info)' }}>
                            <Clock className="w-2.5 h-2.5" />
                            {new Date(b.visit_date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-[11.5px] font-mono" style={{ color: 'var(--text-muted)' }}>
                        {new Date(b.created_at || b.requested_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => setSelectedBooking(b)}
                            className="p-1.5 rounded-lg transition"
                            style={{ background: 'var(--bg-surface-hover)', border: '1px solid var(--border-default)', color: 'var(--text-secondary)' }}
                            title="Détails & planifier visite">
                            <Eye className="w-4 h-4" />
                          </button>
                          <select disabled={actionLoadingId === b.id} value={b.status}
                            onChange={e => handleStatusChange(b.id, e.target.value as BookingStatus)}
                            className="text-[12px] rounded-lg px-2 py-1 focus:outline-none disabled:opacity-50"
                            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)', color: 'var(--text-primary)' }}>
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

        /* KANBAN */
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {KANBAN_COLUMNS.map(col => {
            const colBookings = filtered.filter(b =>
              col.status === 'REJECTED' ? (b.status === 'REJECTED' || b.status === 'CANCELLED') : b.status === col.status
            );
            const st = STATUS_CONFIG[col.status];
            return (
              <div key={col.status} className="rounded-xl p-3 flex flex-col min-h-[480px]"
                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)' }}>
                <div className="flex items-center justify-between pb-2 mb-3"
                  style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <span className="text-[12px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>{col.label}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold tabular-nums ${st.cls}`}>{colBookings.length}</span>
                </div>
                <div className="space-y-2.5 flex-1 overflow-y-auto">
                  {colBookings.map(b => (
                    <div key={b.id} onClick={() => setSelectedBooking(b)}
                      className="rounded-xl p-3 cursor-pointer transition group"
                      style={{ background: 'var(--bg-surface-hover)', border: '1px solid var(--border-default)' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--brand-primary)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-default)'; }}>
                      <div className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>{b.student_name}</div>
                      <div className="text-[11.5px] flex items-center gap-1 mt-1 truncate" style={{ color: 'var(--text-muted)' }}>
                        <GraduationCap className="w-3 h-3 shrink-0" style={{ color: 'var(--brand-primary)' }} />
                        {b.university_name || 'Étudiant'}
                      </div>
                      <div className="flex items-center justify-between mt-2 pt-2 text-[11px]"
                        style={{ borderTop: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                        <span>{b.preferred_duration_months} mois</span>
                        {b.visit_date ? (
                          <span className="flex items-center gap-0.5 font-mono" style={{ color: 'var(--info)' }}>
                            <Clock className="w-2.5 h-2.5" />
                            {new Date(b.visit_date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                          </span>
                        ) : <span>{b.preferred_move_in_date || 'Dès que possible'}</span>}
                      </div>
                    </div>
                  ))}
                  {colBookings.length === 0 && (
                    <div className="h-20 flex items-center justify-center rounded-xl text-[12px]"
                      style={{ border: '1px dashed var(--border-default)', color: 'var(--text-muted)' }}>
                      Vide
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DETAIL MODAL */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm animate-fade-in">
          <div className="rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)' }}>

            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4"
              style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center kpi-icon-demandes shrink-0">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-[15px] font-semibold" style={{ color: 'var(--text-primary)' }}>{selectedBooking.student_name}</h3>
                  <p className="text-[11.5px]" style={{ color: 'var(--text-muted)' }}>Détails & planification de visite</p>
                </div>
              </div>
              <button onClick={() => setSelectedBooking(null)} className="p-1.5 rounded-lg transition"
                style={{ color: 'var(--text-muted)' }}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">

              {/* Contact info */}
              <div className="grid grid-cols-2 gap-3 p-4 rounded-xl text-[13px]"
                style={{ background: 'var(--bg-surface-hover)', border: '1px solid var(--border-subtle)' }}>
                {[
                  { label: 'Téléphone', value: selectedBooking.student_phone, href: `tel:${selectedBooking.student_phone}` },
                  { label: 'Email', value: selectedBooking.student_email, href: `mailto:${selectedBooking.student_email}` },
                  { label: 'Université', value: selectedBooking.university_name || 'Non spécifié' },
                  { label: "Niveau d'études", value: selectedBooking.study_level || 'Étudiant' },
                ].map(item => (
                  <div key={item.label}>
                    <span className="text-[10.5px] font-semibold uppercase block mb-0.5" style={{ color: 'var(--text-muted)' }}>{item.label}</span>
                    {item.href ? (
                      <a href={item.href} className="font-semibold hover:underline" style={{ color: 'var(--brand-primary)' }}>{item.value}</a>
                    ) : (
                      <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{item.value}</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Specs */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Emménagement souhaité', value: selectedBooking.preferred_move_in_date || 'Immédiat' },
                  { label: 'Durée prévue', value: `${selectedBooking.preferred_duration_months} mois` },
                ].map(item => (
                  <div key={item.label} className="p-3 rounded-xl"
                    style={{ background: 'var(--bg-surface-hover)', border: '1px solid var(--border-subtle)' }}>
                    <span className="text-[10.5px] block mb-0.5" style={{ color: 'var(--text-muted)' }}>{item.label}</span>
                    <span className="text-[13px] font-bold" style={{ color: 'var(--text-primary)' }}>{item.value}</span>
                  </div>
                ))}
              </div>

              {/* Message */}
              {selectedBooking.message && (
                <div className="p-4 rounded-xl text-[13px]"
                  style={{ background: 'var(--bg-surface-hover)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
                  <span className="text-[10.5px] font-semibold uppercase block mb-1" style={{ color: 'var(--text-muted)' }}>Message :</span>
                  &ldquo;{selectedBooking.message}&rdquo;
                </div>
              )}

              {/* Visit scheduling */}
              <div className="p-4 rounded-xl space-y-4"
                style={{ background: 'var(--brand-bg)', border: '1px solid rgba(14,165,198,0.2)' }}>
                <div className="flex items-center gap-2 text-[13px] font-bold" style={{ color: 'var(--brand-primary)' }}>
                  <Calendar className="w-4 h-4" />
                  Planification de visite physique
                </div>

                {selectedBooking.visit_date && (
                  <div className="p-3 rounded-lg text-[12.5px]" style={{ background: 'var(--info-bg)', border: '1px solid rgba(59,130,246,0.2)', color: 'var(--info)' }}>
                    <span className="font-semibold block text-[11px] mb-0.5">Visite actuellement programmée :</span>
                    {new Date(selectedBooking.visit_date).toLocaleString('fr-FR', { dateStyle: 'full', timeStyle: 'short' })}
                    {selectedBooking.visit_notes && <p className="mt-1 text-[11.5px]">Note : {selectedBooking.visit_notes}</p>}
                  </div>
                )}

                <form onSubmit={handleScheduleVisitSubmit} className="space-y-3">
                  {visitError && <p className="text-[12px]" style={{ color: 'var(--danger)' }}>{visitError}</p>}
                  <div>
                    <label className="block text-[11.5px] font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Date & Heure du rendez-vous</label>
                    <input type="datetime-local" required value={visitDate} onChange={e => setVisitDate(e.target.value)}
                      className={`${inputCls}`} style={inputStyle} />
                  </div>
                  <div>
                    <label className="block text-[11.5px] font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Notes de visite</label>
                    <input type="text" placeholder="Ex: Rencontre devant la faculté, agent Youssef" value={visitNotes}
                      onChange={e => setVisitNotes(e.target.value)} className={inputCls} style={inputStyle} />
                  </div>
                  <button type="submit" disabled={schedulingVisit}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-semibold text-white transition disabled:opacity-60"
                    style={{ background: 'var(--brand-primary)' }}>
                    {schedulingVisit ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    Enregistrer la visite
                  </button>
                </form>
              </div>

              {/* Status actions */}
              <div className="pt-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                <span className="text-[11.5px] font-semibold block mb-3" style={{ color: 'var(--text-muted)' }}>Changer de statut :</span>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => handleStatusChange(selectedBooking.id, 'CONTACTED')}
                    className="px-3 py-1.5 rounded-lg text-[12.5px] font-semibold transition badge-brand">Marquer Contacté</button>
                  <button onClick={() => handleStatusChange(selectedBooking.id, 'APPROVED')}
                    className="px-3 py-1.5 rounded-lg text-[12.5px] font-semibold transition badge-success">Approuver</button>
                  <button onClick={() => handleStatusChange(selectedBooking.id, 'REJECTED')}
                    className="px-3 py-1.5 rounded-lg text-[12.5px] font-semibold transition badge-danger">Refuser</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminReservationsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-7 h-7 animate-spin" style={{ color: 'var(--brand-primary)' }} />
      </div>
    }>
      <AdminReservationsContent />
    </Suspense>
  );
}
