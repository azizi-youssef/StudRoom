'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { clientAdminService } from '@/client/services/admin.service';
import {
  LifeBuoy, Search, MessageSquare, Eye, X,
  Loader2, Send, Phone, Mail,
} from 'lucide-react';

export interface ContactRequest {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'new' | 'in_progress' | 'resolved' | 'closed';
  created_at: string;
  read_at?: string;
}

const STATUS_CONFIG: Record<string, { label: string; cls: string }> = {
  new:         { label: 'Nouveau',  cls: 'badge-danger' },
  in_progress: { label: 'En cours', cls: 'badge-warning' },
  resolved:    { label: 'Résolu',   cls: 'badge-success' },
  closed:      { label: 'Fermé',    cls: '' },
};

const inputCls = `w-full rounded-xl px-3 py-2 text-[13px] focus:outline-none transition`;
const inputStyle = { background: 'var(--bg-surface)', border: '1px solid var(--border-default)', color: 'var(--text-primary)' };

function AdminSupportContent() {
  const searchParams = useSearchParams();
  const [contacts, setContacts] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>(searchParams?.get('status') || 'all');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<ContactRequest | null>(null);

  useEffect(() => {
    const s = searchParams?.get('status');
    if (s) setStatusFilter(s);
  }, [searchParams]);

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await clientAdminService.getContactRequests();
      if (res.success && res.data) setContacts(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchContacts(); }, [fetchContacts]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setActionLoadingId(id);
    try {
      const res = await clientAdminService.updateContactRequestStatus(id, newStatus);
      if (res.success) {
        setContacts(prev => prev.map(c => c.id === id ? { ...c, status: newStatus as any } : c));
        if (selectedTicket?.id === id) setSelectedTicket(prev => prev ? { ...prev, status: newStatus as any } : null);
      }
    } catch (err) { console.error(err); }
    finally { setActionLoadingId(null); }
  };

  const filtered = contacts.filter(c => {
    const term = searchTerm.toLowerCase();
    const matchSearch = `${c.full_name} ${c.email} ${c.subject} ${c.message} ${c.phone || ''}`.toLowerCase().includes(term);
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const filterBtnBase = `px-3 py-1.5 rounded-lg text-[12.5px] font-semibold whitespace-nowrap transition-all`;

  return (
    <div className="flex flex-col gap-7 animate-fade-in">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6"
        style={{ borderBottom: '1px solid var(--border-default)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center kpi-icon-support shrink-0">
            <LifeBuoy className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-[22px] font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Tickets Support & Messages
            </h1>
            <p className="text-[12.5px]" style={{ color: 'var(--text-secondary)' }}>
              Demandes d&apos;aide, interrogations des étudiants et sollicitations reçues sur le site public.
            </p>
          </div>
        </div>
        <button onClick={fetchContacts} disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium transition self-start"
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)', color: 'var(--text-secondary)' }}>
          Actualiser
        </button>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative min-w-[280px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input type="text" placeholder="Rechercher nom, sujet, email, message…"
            value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            className={inputCls} style={{ ...inputStyle, paddingLeft: '2.25rem' }} />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 flex-wrap">
          {['all', 'new', 'in_progress', 'resolved', 'closed'].map(key => {
            const cfg = STATUS_CONFIG[key];
            const active = statusFilter === key;
            return (
              <button key={key} onClick={() => setStatusFilter(key)}
                className={`${filterBtnBase} ${active && key !== 'all' ? cfg?.cls || '' : ''}`}
                style={active && key === 'all'
                  ? { background: 'var(--text-primary)', color: '#fff' }
                  : !active
                  ? { background: 'var(--bg-surface)', border: '1px solid var(--border-default)', color: 'var(--text-secondary)' }
                  : {}}>
                {key === 'all' ? 'Tous' : cfg?.label || key} ({contacts.filter(c => key === 'all' ? true : c.status === key).length})
              </button>
            );
          })}
        </div>
      </div>

      {/* Tickets */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 rounded-2xl"
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)' }}>
          <Loader2 className="w-8 h-8 animate-spin mb-3" style={{ color: 'var(--brand-primary)' }} />
          <p className="text-[13px]" style={{ color: 'var(--text-muted)' }}>Chargement des messages support…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 rounded-2xl text-center"
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)' }}>
          <MessageSquare className="w-10 h-10 mb-3" style={{ color: 'var(--text-muted)' }} />
          <p className="text-[14px] font-semibold" style={{ color: 'var(--text-primary)' }}>Aucun message pour ces critères</p>
          <p className="text-[12.5px] mt-1" style={{ color: 'var(--text-secondary)' }}>Tous les tickets ont été traités avec succès.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(c => {
            const st = STATUS_CONFIG[c.status] || { label: c.status, cls: '' };
            return (
              <div key={c.id} className="dash-card p-5 flex flex-col justify-between gap-4">
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="text-[14px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {c.subject || 'Demande de renseignement'}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5 text-[12px]" style={{ color: 'var(--text-muted)' }}>
                        <span>{c.full_name}</span>
                        <span>·</span>
                        <span className="font-mono">
                          {new Date(c.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                    <span className={`px-2.5 py-0.5 text-[11.5px] font-semibold rounded-lg shrink-0 ${st.cls}`}>
                      {st.label}
                    </span>
                  </div>

                  {/* Preview */}
                  <div className="p-3 rounded-xl text-[12.5px] line-clamp-2"
                    style={{ background: 'var(--bg-surface-hover)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
                    &ldquo;{c.message}&rdquo;
                  </div>

                  {/* Contact chips */}
                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    <a href={`mailto:${c.email}`}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[12px] transition"
                      style={{ background: 'var(--bg-surface-hover)', border: '1px solid var(--border-default)', color: 'var(--text-secondary)' }}>
                      <Mail className="w-3 h-3" style={{ color: 'var(--brand-primary)' }} />
                      {c.email}
                    </a>
                    {c.phone && (
                      <a href={`tel:${c.phone}`}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[12px] transition"
                        style={{ background: 'var(--bg-surface-hover)', border: '1px solid var(--border-default)', color: 'var(--text-secondary)' }}>
                        <Phone className="w-3 h-3" style={{ color: 'var(--brand-primary)' }} />
                        {c.phone}
                      </a>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3"
                  style={{ borderTop: '1px solid var(--border-subtle)' }}>
                  <button onClick={() => setSelectedTicket(c)}
                    className="flex items-center gap-1.5 text-[12.5px] font-semibold transition"
                    style={{ color: 'var(--brand-primary)' }}>
                    <Eye className="w-3.5 h-3.5" /> Lire le message
                  </button>
                  <div className="flex items-center gap-2">
                    {c.status !== 'in_progress' && c.status !== 'resolved' && (
                      <button disabled={actionLoadingId === c.id}
                        onClick={() => handleStatusChange(c.id, 'in_progress')}
                        className="px-2.5 py-1 text-[12px] rounded-lg transition badge-warning">
                        En cours
                      </button>
                    )}
                    {c.status !== 'resolved' && (
                      <button disabled={actionLoadingId === c.id}
                        onClick={() => handleStatusChange(c.id, 'resolved')}
                        className="px-2.5 py-1 text-[12px] rounded-lg transition badge-success">
                        Résolu
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DETAIL MODAL */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm animate-fade-in">
          <div className="rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)' }}>

            <div className="flex items-center justify-between px-6 py-4"
              style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center kpi-icon-support shrink-0">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-[15px] font-semibold" style={{ color: 'var(--text-primary)' }}>{selectedTicket.subject}</h3>
                  <p className="text-[11.5px]" style={{ color: 'var(--text-muted)' }}>De {selectedTicket.full_name}</p>
                </div>
              </div>
              <button onClick={() => setSelectedTicket(null)} className="p-1.5 rounded-lg" style={{ color: 'var(--text-muted)' }}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Sender info */}
              <div className="p-4 rounded-xl space-y-2.5"
                style={{ background: 'var(--bg-surface-hover)', border: '1px solid var(--border-subtle)' }}>
                {[
                  { label: 'Expéditeur', value: selectedTicket.full_name },
                  { label: 'Email', value: selectedTicket.email, href: `mailto:${selectedTicket.email}` },
                  ...(selectedTicket.phone ? [{ label: 'Téléphone', value: selectedTicket.phone, href: `tel:${selectedTicket.phone}` }] : []),
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between text-[13px]">
                    <span className="font-semibold" style={{ color: 'var(--text-muted)' }}>{item.label} :</span>
                    {item.href ? (
                      <a href={item.href} className="hover:underline font-semibold" style={{ color: 'var(--brand-primary)' }}>{item.value}</a>
                    ) : (
                      <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{item.value}</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Message */}
              <div>
                <span className="text-[12px] font-semibold block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Contenu du message :</span>
                <div className="p-4 rounded-xl text-[13px] leading-relaxed whitespace-pre-wrap"
                  style={{ background: 'var(--bg-surface-hover)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}>
                  {selectedTicket.message}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleStatusChange(selectedTicket.id, 'resolved')}
                    className="px-3.5 py-2 rounded-lg text-[13px] font-semibold transition badge-success">
                    Marquer Résolu
                  </button>
                  <button onClick={() => handleStatusChange(selectedTicket.id, 'closed')}
                    className="px-3.5 py-2 rounded-lg text-[13px] font-semibold transition"
                    style={{ background: 'var(--bg-surface-hover)', border: '1px solid var(--border-default)', color: 'var(--text-secondary)' }}>
                    Fermer le ticket
                  </button>
                </div>
                <a href={`mailto:${selectedTicket.email}?subject=RE: ${encodeURIComponent(selectedTicket.subject)}`}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[13px] font-semibold text-white transition"
                  style={{ background: 'var(--brand-primary)' }}>
                  <Send className="w-3.5 h-3.5" />
                  Répondre
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminSupportPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-7 h-7 animate-spin" style={{ color: 'var(--brand-primary)' }} />
      </div>
    }>
      <AdminSupportContent />
    </Suspense>
  );
}
