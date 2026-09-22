'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { clientAdminService } from '@/client/services/admin.service';
import {
  LifeBuoy,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Mail,
  Phone,
  MessageSquare,
  Eye,
  X,
  AlertCircle,
  Loader2,
  Check,
  Send,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

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

const STATUS_CONFIG: Record<string, { label: string; badge: string }> = {
  new: { label: 'Nouveau', badge: 'bg-rose-950/80 text-rose-400 border-rose-800/80' },
  in_progress: { label: 'En cours', badge: 'bg-amber-950/80 text-amber-400 border-amber-800/80' },
  resolved: { label: 'Résolu', badge: 'bg-emerald-950/80 text-emerald-400 border-emerald-800/80' },
  closed: { label: 'Fermé', badge: 'bg-slate-800 text-slate-400 border-slate-700' },
};

export default function AdminSupportPage() {
  const [contacts, setContacts] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const [selectedTicket, setSelectedTicket] = useState<ContactRequest | null>(null);

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await clientAdminService.getContactRequests();
      if (res.success && res.data) {
        setContacts(res.data);
      }
    } catch (err) {
      console.error('[Support] Error loading contact requests:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setActionLoadingId(id);
    try {
      const res = await clientAdminService.updateContactRequestStatus(id, newStatus);
      if (res.success) {
        setContacts((prev) =>
          prev.map((c) => (c.id === id ? { ...c, status: newStatus as any } : c))
        );
        if (selectedTicket && selectedTicket.id === id) {
          setSelectedTicket((prev) => (prev ? { ...prev, status: newStatus as any } : null));
        }
      }
    } catch (err) {
      console.error('[Support] Error updating status:', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredContacts = contacts.filter((c) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      `${c.full_name} ${c.email} ${c.subject} ${c.message} ${c.phone || ''}`
        .toLowerCase()
        .includes(term);
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
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
            <span className="text-primary-400 font-medium text-xs">Support & Assistance</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-950/80 border border-primary-800/80 flex items-center justify-center text-primary-400">
              <LifeBuoy className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Tickets Support & Messages</h1>
              <p className="text-xs text-slate-400">
                Suivi des demandes d'aide, interrogations des étudiants et sollicitations reçues sur le site public.
              </p>
            </div>
          </div>
        </div>

        <Button
          onClick={fetchContacts}
          variant="outline"
          className="flex items-center gap-2 px-3 py-2 text-xs border-slate-800 text-slate-300 hover:bg-slate-800"
        >
          Actualiser
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative min-w-[280px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Rechercher nom, sujet, email, message..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-primary-500"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {['all', 'new', 'in_progress', 'resolved', 'closed'].map((key) => (
            <button
              key={key}
              onClick={() => setStatusFilter(key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                statusFilter === key
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {key === 'all' ? 'Tous' : STATUS_CONFIG[key]?.label || key} (
              {contacts.filter((c) => (key === 'all' ? true : c.status === key)).length})
            </button>
          ))}
        </div>
      </div>

      {/* Tickets List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-900/40 rounded-2xl border border-slate-800/60">
          <Loader2 className="w-8 h-8 text-primary-400 animate-spin mb-3" />
          <p className="text-xs text-slate-400">Chargement des messages de support...</p>
        </div>
      ) : filteredContacts.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 border border-slate-800/60 rounded-2xl">
          <MessageSquare className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-300">Aucun message pour ces critères</p>
          <p className="text-xs text-slate-500 mt-1">Tous les tickets ont été traités avec succès.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredContacts.map((c) => {
            const statusMeta = STATUS_CONFIG[c.status] || {
              label: c.status,
              badge: 'bg-slate-800 text-slate-400 border-slate-700',
            };

            return (
              <div
                key={c.id}
                className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700 transition flex flex-col justify-between shadow-lg shadow-black/20 group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-primary-300 transition">
                        {c.subject || 'Demande de renseignement'}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                        <span>{c.full_name}</span>
                        <span>•</span>
                        <span className="text-[11px] text-slate-500">
                          {new Date(c.created_at).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>

                    <span className={`px-2.5 py-0.5 text-[11px] font-semibold rounded-lg border ${statusMeta.badge}`}>
                      {statusMeta.label}
                    </span>
                  </div>

                  {/* Message body snippet */}
                  <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-300 mb-3 line-clamp-3">
                    "{c.message}"
                  </div>

                  {/* Contact tags */}
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <a
                      href={`mailto:${c.email}`}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs flex items-center gap-1.5 hover:bg-slate-700 transition border border-slate-700/60"
                    >
                      <Mail className="w-3 h-3 text-primary-400" />
                      {c.email}
                    </a>
                    {c.phone && (
                      <a
                        href={`tel:${c.phone}`}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs flex items-center gap-1.5 hover:bg-slate-700 transition border border-slate-700/60"
                      >
                        <Phone className="w-3 h-3 text-primary-400" />
                        {c.phone}
                      </a>
                    )}
                  </div>
                </div>

                {/* Footer status buttons */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedTicket(c)}
                    className="text-xs text-primary-400 hover:text-primary-300 font-semibold flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Lire le message
                  </button>

                  <div className="flex items-center gap-1.5">
                    {c.status !== 'in_progress' && c.status !== 'resolved' && (
                      <button
                        disabled={actionLoadingId === c.id}
                        onClick={() => handleStatusChange(c.id, 'in_progress')}
                        className="px-2 py-1 text-[11px] rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 transition"
                      >
                        En cours
                      </button>
                    )}
                    {c.status !== 'resolved' && (
                      <button
                        disabled={actionLoadingId === c.id}
                        onClick={() => handleStatusChange(c.id, 'resolved')}
                        className="px-2 py-1 text-[11px] rounded-lg bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 hover:bg-emerald-900/60 transition"
                      >
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary-950 text-primary-400 border border-primary-800 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{selectedTicket.subject}</h3>
                  <p className="text-[11px] text-slate-400">De {selectedTicket.full_name}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-semibold">Expéditeur :</span>
                  <span className="text-white font-bold">{selectedTicket.full_name}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-semibold">Email :</span>
                  <a href={`mailto:${selectedTicket.email}`} className="text-primary-400 hover:underline">
                    {selectedTicket.email}
                  </a>
                </div>
                {selectedTicket.phone && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-semibold">Téléphone :</span>
                    <a href={`tel:${selectedTicket.phone}`} className="text-primary-400 hover:underline">
                      {selectedTicket.phone}
                    </a>
                  </div>
                )}
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-300 block mb-1.5">Contenu du message :</span>
                <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {selectedTicket.message}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleStatusChange(selectedTicket.id, 'resolved')}
                    className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white"
                  >
                    Marquer Résolu
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStatusChange(selectedTicket.id, 'closed')}
                    className="text-xs border-slate-700 text-slate-300 hover:bg-slate-800"
                  >
                    Fermer le ticket
                  </Button>
                </div>

                <a
                  href={`mailto:${selectedTicket.email}?subject=RE: ${encodeURIComponent(selectedTicket.subject)}`}
                  className="px-3 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  Répondre par Email
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
