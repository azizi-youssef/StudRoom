'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { clientAdminService } from '@/client/services/admin.service';
import { PropertyDetail, RoomDetail } from '@/shared/types';
import { RoomStatus } from '@/shared/types/database';
import {
  DoorOpen,
  ArrowLeft,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  RefreshCw,
  Bed,
  ShieldCheck,
  Sparkles,
  Loader2,
  Calendar,
  Image as ImageIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrencyDH } from '@/lib/utils';
import { ImageSourcePicker } from '@/components/admin/image-source-picker';

const ROOM_STATUS_LABELS: Record<RoomStatus, { label: string; badgeClass: string }> = {
  AVAILABLE: { label: 'Disponible', badgeClass: 'bg-emerald-950/80 text-emerald-400 border-emerald-800/80' },
  RESERVED: { label: 'Réservée', badgeClass: 'bg-primary-950/80 text-primary-400 border-primary-800/80' },
  OCCUPIED: { label: 'Occupée', badgeClass: 'bg-slate-900 text-slate-400 border-slate-700/80' },
  MAINTENANCE: { label: 'Maintenance', badgeClass: 'bg-rose-950/80 text-rose-400 border-rose-800/80' },
  UNAVAILABLE: { label: 'Indisponible', badgeClass: 'bg-slate-900 text-slate-500 border-slate-800' },
};

export default function AdminLogementChambresPage() {
  const params = useParams();
  const propertyId = params.id as string;

  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // New room form state
  const [showAddModal, setShowAddModal] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [roomType, setRoomType] = useState('PRIVATE');
  const [priceMonthly, setPriceMonthly] = useState(1900);
  const [depositDh, setDepositDh] = useState(1900);
  const [surfaceSqm, setSurfaceSqm] = useState(14);
  const [floor, setFloor] = useState(1);
  const [furnished, setFurnished] = useState(true);
  const [initialStatus, setInitialStatus] = useState<RoomStatus>('AVAILABLE');
  const [roomImages, setRoomImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&auto=format&fit=crop&q=80',
  ]);
  const [newRoomImageUrl, setNewRoomImageUrl] = useState('');
  const [submittingRoom, setSubmittingRoom] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAddRoomImage = (urlToAdd?: string) => {
    const target = (urlToAdd || newRoomImageUrl).trim();
    if (target && !roomImages.includes(target)) {
      setRoomImages([...roomImages, target]);
      if (!urlToAdd) setNewRoomImageUrl('');
    }
  };

  const handleRemoveRoomImage = (index: number) => {
    setRoomImages(roomImages.filter((_, i) => i !== index));
  };

  const loadProperty = useCallback(async () => {
    setLoading(true);
    try {
      const res = await clientAdminService.getProperty(propertyId);
      if (res.success && res.data) {
        setProperty(res.data);
      }
    } catch (err) {
      console.error('[Chambres] Error loading property:', err);
    } finally {
      setLoading(false);
    }
  }, [propertyId]);

  useEffect(() => {
    loadProperty();
  }, [loadProperty]);

  const handleStatusChange = async (roomId: string, newStatus: RoomStatus) => {
    setActionLoadingId(roomId);
    try {
      const res = await clientAdminService.updateRoomStatus(roomId, newStatus);
      if (res.success) {
        setProperty((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            rooms: prev.rooms.map((r) => (r.id === roomId ? { ...r, status: newStatus } : r)),
          };
        });
      }
    } catch (err) {
      console.error('[Chambres] Status update error:', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteRoom = async (roomId: string, name: string) => {
    if (!window.confirm(`Supprimer définitivement la chambre "${name}" ?`)) return;
    setActionLoadingId(roomId);
    try {
      const res = await clientAdminService.deleteRoom(roomId);
      if (res.success) {
        setProperty((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            rooms: prev.rooms.filter((r) => r.id !== roomId),
          };
        });
      }
    } catch (err) {
      console.error('[Chambres] Delete room error:', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleAddRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!roomName.trim()) {
      setErrorMsg('Le nom de la chambre est requis.');
      return;
    }

    setSubmittingRoom(true);
    try {
      const res = await clientAdminService.createRoom(propertyId, {
        name: roomName.trim(),
        room_type: roomType as any,
        price_monthly: Number(priceMonthly),
        deposit_dh: Number(depositDh),
        surface_sqm: Number(surfaceSqm),
        floor: Number(floor),
        furnished,
        status: initialStatus,
        images: roomImages,
        features: [],
      });

      if (res.success && res.data) {
        setShowAddModal(false);
        setRoomName('');
        setRoomImages([
          'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&auto=format&fit=crop&q=80',
        ]);
        setNewRoomImageUrl('');
        await loadProperty();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Erreur lors de la création de la chambre.');
    } finally {
      setSubmittingRoom(false);
    }
  };

  if (loading) {
    return (
      <div className="p-16 flex items-center justify-center text-slate-400 text-xs">
        <Loader2 className="w-6 h-6 animate-spin mr-2 text-primary-400" />
        Chargement des chambres du logement…
      </div>
    );
  }

  if (!property) {
    return (
      <div className="p-16 text-center text-slate-400 text-xs">
        Logement introuvable.{' '}
        <Link href="/dashboard/logements" className="text-primary-400 underline ml-1">
          Retour à la liste
        </Link>
      </div>
    );
  }

  const rooms = property.rooms || [];

  return (
    <div className="max-w-6xl w-full mx-auto flex flex-col gap-8">
      {/* ── Breadcrumb ── */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/logements"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux logements
        </Link>
        <Link
          href={`/dashboard/logements/${property.id}/photos`}
          className="text-xs font-bold text-primary-400 hover:underline"
        >
          Gérer les photos de ce logement $\rightarrow$
        </Link>
      </div>

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <DoorOpen className="w-4 h-4 text-primary-400" />
            <span className="text-[11px] font-extrabold text-primary-400 uppercase tracking-widest">
              Découpage en Chambres
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Chambres — {property.title}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {rooms.length} chambre{rooms.length > 1 ? 's' : ''} configurée{rooms.length > 1 ? 's' : ''} · Quartier {property.neighborhood} ({property.city?.name})
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setShowAddModal(true)}
          className="font-bold shadow-soft"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Ajouter une chambre
        </Button>
      </div>

      {/* ── Rooms Table / List ── */}
      {rooms.length === 0 ? (
        <div className="bg-slate-950/60 p-16 rounded-3xl border border-slate-800/80 text-center flex flex-col items-center gap-4">
          <DoorOpen className="w-12 h-12 text-slate-600" />
          <p className="text-base font-bold text-white">Aucune chambre configurée</p>
          <p className="text-xs text-slate-500 max-w-sm">
            Ce logement n&apos;a pas encore de chambres. Ajoutez les chambres pour permettre aux étudiants de réserver.
          </p>
          <Button variant="primary" size="sm" onClick={() => setShowAddModal(true)} className="font-bold">
            <Plus className="w-4 h-4 mr-1.5" />
            Ajouter la première chambre
          </Button>
        </div>
      ) : (
        <div className="bg-slate-950/80 rounded-3xl border border-slate-800/80 overflow-hidden shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 text-slate-400 font-extrabold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Nom de la chambre</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Loyer mensuel</th>
                  <th className="px-6 py-4">Caution</th>
                  <th className="px-6 py-4">Superficie</th>
                  <th className="px-6 py-4">Statut</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {rooms.map((room) => {
                  const statusConfig = ROOM_STATUS_LABELS[room.status] || {
                    label: room.status,
                    badgeClass: 'bg-slate-800 text-slate-300',
                  };

                  return (
                    <tr key={room.id} className="hover:bg-slate-900/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-white">
                        <div className="flex items-center gap-3">
                          {room.images && room.images.length > 0 ? (
                            <img
                              src={room.images[0]}
                              alt={room.name}
                              className="w-10 h-10 rounded-xl object-cover border border-slate-700 shrink-0"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400';
                              }}
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-primary-400 shrink-0">
                              <Bed className="w-4 h-4" />
                            </div>
                          )}
                          <div>
                            <div className="flex items-center gap-2">
                              <span>{room.name}</span>
                              {room.images && room.images.length > 0 && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-primary-950 text-primary-400 border border-primary-800/60 font-mono">
                                  {room.images.length} photo{room.images.length > 1 ? 's' : ''}
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                              Étage {room.floor} · {room.furnished ? 'Meublée' : 'Non meublée'}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 rounded-md bg-slate-900 text-slate-300 font-bold border border-slate-800">
                          {room.room_type}
                        </span>
                      </td>

                      <td className="px-6 py-4 font-black text-primary-400">
                        {formatCurrencyDH(room.price_monthly)}
                      </td>

                      <td className="px-6 py-4 text-slate-300">
                        {formatCurrencyDH(room.deposit_dh)}
                      </td>

                      <td className="px-6 py-4 text-slate-300">
                        {room.surface_sqm} m²
                      </td>

                      <td className="px-6 py-4">
                        <select
                          value={room.status}
                          disabled={actionLoadingId === room.id}
                          onChange={(e) => handleStatusChange(room.id, e.target.value as RoomStatus)}
                          className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-xl border focus:outline-none cursor-pointer ${statusConfig.badgeClass}`}
                        >
                          <option value="AVAILABLE">Disponible</option>
                          <option value="RESERVED">Réservée</option>
                          <option value="OCCUPIED">Occupée</option>
                          <option value="MAINTENANCE">Maintenance</option>
                          <option value="UNAVAILABLE">Indisponible</option>
                        </select>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleDeleteRoom(room.id, room.name)}
                          disabled={actionLoadingId === room.id}
                          title="Supprimer cette chambre"
                          className="p-1.5 rounded-xl text-rose-400 hover:bg-rose-950/60 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Modal : Ajouter une chambre ── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl flex flex-col gap-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-black text-white">Ajouter une chambre</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-bold">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleAddRoom} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-300">Nom de la chambre</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Chambre A — Balcon privatif"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2 text-xs text-white focus:outline-none focus:border-primary-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-300">Type</label>
                  <select
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-2xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary-500"
                  >
                    <option value="PRIVATE">Chambre Privée</option>
                    <option value="STUDIO">Studio</option>
                    <option value="MASTER">Master Suite</option>
                    <option value="SHARED">Partagée (Coloc)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-300">Superficie (m²)</label>
                  <input
                    type="number"
                    min="5"
                    value={surfaceSqm}
                    onChange={(e) => setSurfaceSqm(Number(e.target.value))}
                    className="bg-slate-950 border border-slate-800 rounded-2xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-300">Loyer mensuel (DH)</label>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={priceMonthly}
                    onChange={(e) => setPriceMonthly(Number(e.target.value))}
                    className="bg-slate-950 border border-slate-800 rounded-2xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary-500 font-bold text-primary-400"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-300">Caution (DH)</label>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={depositDh}
                    onChange={(e) => setDepositDh(Number(e.target.value))}
                    className="bg-slate-950 border border-slate-800 rounded-2xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-300">Étage</label>
                  <input
                    type="number"
                    value={floor}
                    onChange={(e) => setFloor(Number(e.target.value))}
                    className="bg-slate-950 border border-slate-800 rounded-2xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-300">Statut initial</label>
                  <select
                    value={initialStatus}
                    onChange={(e) => setInitialStatus(e.target.value as RoomStatus)}
                    className="bg-slate-950 border border-slate-800 rounded-2xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary-500"
                  >
                    <option value="AVAILABLE">Disponible</option>
                    <option value="OCCUPIED">Occupée</option>
                    <option value="MAINTENANCE">Maintenance</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="furnCheck"
                  checked={furnished}
                  onChange={(e) => setFurnished(e.target.checked)}
                  className="w-4 h-4 rounded text-primary-600 bg-slate-950 border-slate-800"
                />
                <label htmlFor="furnCheck" className="text-xs font-bold text-slate-300 cursor-pointer">
                  Chambre entièrement meublée (Lit, bureau, armoire)
                </label>
              </div>

              {/* Room Photos */}
              <div className="flex flex-col gap-2.5 pt-3 border-t border-slate-800/80">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-primary-400" />
                    Photos de la chambre ({roomImages.length})
                  </label>
                  <span className="text-[11px] text-slate-500">Local PC, Bibliothèque ou URL</span>
                </div>

                <ImageSourcePicker
                  onImageSelected={(url) => {
                    handleAddRoomImage(url);
                  }}
                />

                {/* Previews & remove */}
                {roomImages.length > 0 && (
                  <div className="mt-1">
                    <p className="text-[11px] font-semibold text-slate-400 mb-2">
                      Photos configurées pour cette chambre :
                    </p>
                    <div className="grid grid-cols-3 gap-2.5">
                      {roomImages.map((url, idx) => (
                        <div
                          key={idx}
                          className="relative aspect-[4/3] rounded-xl overflow-hidden border border-slate-800 bg-slate-950 group shadow-soft"
                        >
                          <img
                            src={url}
                            alt={`Chambre ${idx + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&auto=format&fit=crop&q=80';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition flex items-end justify-between p-1.5">
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-black/80 text-slate-300">
                              #{idx + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveRoomImage(idx)}
                              className="p-1 rounded-lg bg-rose-600/90 text-white hover:bg-rose-500 transition"
                              title="Supprimer photo"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>


              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddModal(false)}
                  className="border-slate-800 text-slate-400"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={submittingRoom}
                  className="font-bold"
                >
                  {submittingRoom ? 'Création…' : 'Ajouter la chambre'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
