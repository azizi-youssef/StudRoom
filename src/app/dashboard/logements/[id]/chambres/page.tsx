'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { clientAdminService } from '@/client/services/admin.service';
import { PropertyDetail } from '@/shared/types';
import { RoomStatus } from '@/shared/types/database';
import {
  DoorOpen,
  ArrowLeft,
  Plus,
  Trash2,
  X,
  Bed,
  Loader2,
  Image as ImageIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrencyDH } from '@/lib/utils';
import { ImageSourcePicker } from '@/components/admin/image-source-picker';

const ROOM_STATUS_LABELS: Record<RoomStatus, { label: string; badgeClass: string }> = {
  AVAILABLE: { label: 'Disponible', badgeClass: 'badge-success' },
  RESERVED: { label: 'Réservée', badgeClass: 'badge-primary' },
  OCCUPIED: { label: 'Occupée', badgeClass: 'badge-neutral' },
  MAINTENANCE: { label: 'Maintenance', badgeClass: 'badge-danger' },
  UNAVAILABLE: { label: 'Indisponible', badgeClass: 'badge-neutral' },
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
      <div className="dash-card p-16 flex items-center justify-center text-xs" style={{ color: 'var(--text-muted)' }}>
        <Loader2 className="w-6 h-6 animate-spin mr-2" style={{ color: 'var(--brand-primary)' }} />
        Chargement des chambres du logement…
      </div>
    );
  }

  if (!property) {
    return (
      <div className="dash-card p-16 text-center text-xs" style={{ color: 'var(--text-muted)' }}>
        Logement introuvable.{' '}
        <Link href="/dashboard/logements" className="underline ml-1" style={{ color: 'var(--brand-primary)' }}>
          Retour à la liste
        </Link>
      </div>
    );
  }

  const rooms = property.rooms || [];

  return (
    <div className="max-w-6xl w-full mx-auto flex flex-col gap-6 animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/logements"
          className="inline-flex items-center gap-1.5 text-xs font-semibold hover:underline transition-colors"
          style={{ color: 'var(--text-secondary)' }}
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux logements
        </Link>
        <Link
          href={`/dashboard/logements/${property.id}/photos`}
          className="text-xs font-semibold hover:underline"
          style={{ color: 'var(--brand-primary)' }}
        >
          Gérer les photos de ce logement →
        </Link>
      </div>

      {/* Header */}
      <div
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <DoorOpen className="w-4 h-4" style={{ color: 'var(--brand-primary)' }} />
            <span
              className="text-[11px] font-bold uppercase tracking-wider"
              style={{ color: 'var(--brand-primary)' }}
            >
              Découpage en Chambres
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Chambres — {property.title}
          </h1>
          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
            {rooms.length} chambre{rooms.length > 1 ? 's' : ''} configurée{rooms.length > 1 ? 's' : ''} · Quartier {property.neighborhood} ({property.city?.name})
          </p>
        </div>

        <Button
          onClick={() => setShowAddModal(true)}
          className="btn-brand font-semibold text-xs text-white shadow-sm flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Ajouter une chambre
        </Button>
      </div>

      {/* Rooms Table / List */}
      {rooms.length === 0 ? (
        <div
          className="dash-card p-16 text-center flex flex-col items-center gap-3"
          style={{ backgroundColor: 'var(--bg-card)' }}
        >
          <DoorOpen className="w-12 h-12" style={{ color: 'var(--text-muted)' }} />
          <p className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>Aucune chambre configurée</p>
          <p className="text-xs max-w-sm" style={{ color: 'var(--text-secondary)' }}>
            Ce logement n&apos;a pas encore de chambres. Ajoutez les chambres pour permettre aux étudiants de réserver.
          </p>
          <Button onClick={() => setShowAddModal(true)} className="btn-brand text-xs font-semibold text-white shadow-sm mt-2">
            <Plus className="w-4 h-4 mr-1.5" />
            Ajouter la première chambre
          </Button>
        </div>
      ) : (
        <div className="dash-card overflow-hidden shadow-sm" style={{ backgroundColor: 'var(--bg-card)' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr
                  className="border-b text-[11px] font-semibold uppercase tracking-wider"
                  style={{
                    borderColor: 'var(--border-subtle)',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-muted)',
                  }}
                >
                  <th className="px-5 py-3.5">Nom de la chambre</th>
                  <th className="px-5 py-3.5">Type</th>
                  <th className="px-5 py-3.5">Loyer mensuel</th>
                  <th className="px-5 py-3.5">Caution</th>
                  <th className="px-5 py-3.5">Superficie</th>
                  <th className="px-5 py-3.5">Statut</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
                {rooms.map((room) => {
                  const statusConfig = ROOM_STATUS_LABELS[room.status] || {
                    label: room.status,
                    badgeClass: 'badge-neutral',
                  };

                  return (
                    <tr
                      key={room.id}
                      className="hover:bg-[var(--bg-subtle)] transition-colors"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      <td className="px-5 py-3.5 font-semibold">
                        <div className="flex items-center gap-3">
                          {room.images && room.images.length > 0 ? (
                            <img
                              src={room.images[0]}
                              alt={room.name}
                              className="w-10 h-10 rounded-xl object-cover border shrink-0"
                              style={{ borderColor: 'var(--border-subtle)' }}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400';
                              }}
                            />
                          ) : (
                            <div
                              className="w-10 h-10 rounded-xl border flex items-center justify-center shrink-0"
                              style={{
                                backgroundColor: 'var(--brand-bg)',
                                borderColor: 'var(--brand-bg-strong)',
                                color: 'var(--brand-primary)',
                              }}
                            >
                              <Bed className="w-4 h-4" />
                            </div>
                          )}
                          <div>
                            <div className="flex items-center gap-2">
                              <span>{room.name}</span>
                              {room.images && room.images.length > 0 && (
                                <span
                                  className="text-[10px] px-1.5 py-0.2 rounded font-mono font-medium"
                                  style={{
                                    backgroundColor: 'var(--brand-bg)',
                                    color: 'var(--brand-primary)',
                                    border: '1px solid var(--brand-bg-strong)',
                                  }}
                                >
                                  {room.images.length} photo{room.images.length > 1 ? 's' : ''}
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] font-mono block mt-0.5" style={{ color: 'var(--text-muted)' }}>
                              Étage {room.floor} · {room.furnished ? 'Meublée' : 'Non meublée'}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-3.5">
                        <span
                          className="px-2 py-0.5 rounded-md font-medium border text-[11px]"
                          style={{
                            backgroundColor: 'var(--bg-subtle)',
                            borderColor: 'var(--border-subtle)',
                            color: 'var(--text-secondary)',
                          }}
                        >
                          {room.room_type}
                        </span>
                      </td>

                      <td className="px-5 py-3.5 font-bold" style={{ color: 'var(--brand-primary)' }}>
                        {formatCurrencyDH(room.price_monthly)}
                      </td>

                      <td className="px-5 py-3.5" style={{ color: 'var(--text-secondary)' }}>
                        {formatCurrencyDH(room.deposit_dh)}
                      </td>

                      <td className="px-5 py-3.5" style={{ color: 'var(--text-secondary)' }}>
                        {room.surface_sqm} m²
                      </td>

                      <td className="px-5 py-3.5">
                        <select
                          value={room.status}
                          disabled={actionLoadingId === room.id}
                          onChange={(e) => handleStatusChange(room.id, e.target.value as RoomStatus)}
                          className={`text-[11px] font-semibold px-2.5 py-1 rounded-xl focus:outline-none cursor-pointer ${statusConfig.badgeClass}`}
                        >
                          <option value="AVAILABLE">Disponible</option>
                          <option value="RESERVED">Réservée</option>
                          <option value="OCCUPIED">Occupée</option>
                          <option value="MAINTENANCE">Maintenance</option>
                          <option value="UNAVAILABLE">Indisponible</option>
                        </select>
                      </td>

                      <td className="px-5 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => handleDeleteRoom(room.id, room.name)}
                          disabled={actionLoadingId === room.id}
                          title="Supprimer cette chambre"
                          className="p-1.5 rounded-lg transition-colors"
                          style={{ color: 'var(--error-fg)' }}
                        >
                          <Trash2 className="w-4 h-4 hover:opacity-75" />
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

      {/* Modal : Ajouter une chambre */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div
            className="dash-card border rounded-2xl p-6 sm:p-7 max-w-lg w-full shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-strong)',
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
              <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>Ajouter une chambre</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg"
                style={{ color: 'var(--text-muted)' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div
                className="p-3 rounded-xl border text-xs font-semibold"
                style={{
                  backgroundColor: 'var(--error-bg)',
                  borderColor: 'var(--error-border)',
                  color: 'var(--error-fg)',
                }}
              >
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleAddRoom} className="flex flex-col gap-3.5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Nom de la chambre</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Chambre A — Balcon privatif"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  className="rounded-xl px-3 py-2 text-xs focus:outline-none transition-all"
                  style={{
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Type</label>
                  <select
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value)}
                    className="rounded-xl px-3 py-2 text-xs focus:outline-none cursor-pointer"
                    style={{
                      backgroundColor: 'var(--bg-subtle)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    <option value="PRIVATE">Chambre Privée</option>
                    <option value="STUDIO">Studio</option>
                    <option value="MASTER">Master Suite</option>
                    <option value="SHARED">Partagée (Coloc)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Superficie (m²)</label>
                  <input
                    type="number"
                    min="5"
                    value={surfaceSqm}
                    onChange={(e) => setSurfaceSqm(Number(e.target.value))}
                    className="rounded-xl px-3 py-2 text-xs focus:outline-none"
                    style={{
                      backgroundColor: 'var(--bg-subtle)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Loyer mensuel (DH)</label>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={priceMonthly}
                    onChange={(e) => setPriceMonthly(Number(e.target.value))}
                    className="rounded-xl px-3 py-2 text-xs font-bold focus:outline-none"
                    style={{
                      backgroundColor: 'var(--bg-subtle)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--brand-primary)',
                    }}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Caution (DH)</label>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={depositDh}
                    onChange={(e) => setDepositDh(Number(e.target.value))}
                    className="rounded-xl px-3 py-2 text-xs focus:outline-none"
                    style={{
                      backgroundColor: 'var(--bg-subtle)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Étage</label>
                  <input
                    type="number"
                    value={floor}
                    onChange={(e) => setFloor(Number(e.target.value))}
                    className="rounded-xl px-3 py-2 text-xs focus:outline-none"
                    style={{
                      backgroundColor: 'var(--bg-subtle)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                    }}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Statut initial</label>
                  <select
                    value={initialStatus}
                    onChange={(e) => setInitialStatus(e.target.value as RoomStatus)}
                    className="rounded-xl px-3 py-2 text-xs focus:outline-none cursor-pointer"
                    style={{
                      backgroundColor: 'var(--bg-subtle)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    <option value="AVAILABLE">Disponible</option>
                    <option value="OCCUPIED">Occupée</option>
                    <option value="MAINTENANCE">Maintenance</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="furnCheck"
                  checked={furnished}
                  onChange={(e) => setFurnished(e.target.checked)}
                  className="w-4 h-4 rounded cursor-pointer"
                  style={{ accentColor: 'var(--brand-primary)' }}
                />
                <label htmlFor="furnCheck" className="text-xs font-semibold cursor-pointer" style={{ color: 'var(--text-primary)' }}>
                  Chambre entièrement meublée (Lit, bureau, armoire)
                </label>
              </div>

              {/* Room Photos */}
              <div className="flex flex-col gap-2 pt-3 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold flex items-center gap-1.5" style={{ color: 'var(--text-primary)' }}>
                    <ImageIcon className="w-3.5 h-3.5" style={{ color: 'var(--brand-primary)' }} />
                    Photos de la chambre ({roomImages.length})
                  </label>
                </div>

                <ImageSourcePicker
                  onImageSelected={(url) => {
                    handleAddRoomImage(url);
                  }}
                />

                {roomImages.length > 0 && (
                  <div className="mt-1">
                    <div className="grid grid-cols-3 gap-2">
                      {roomImages.map((url, idx) => (
                        <div
                          key={idx}
                          className="relative aspect-[4/3] rounded-xl overflow-hidden border group"
                          style={{
                            borderColor: 'var(--border-subtle)',
                            backgroundColor: 'var(--bg-subtle)',
                          }}
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
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-end justify-between p-1.5">
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-black/80 text-white">
                              #{idx + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveRoomImage(idx)}
                              className="p-1 rounded-lg bg-red-600 text-white hover:bg-red-500 transition"
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

              <div className="flex items-center justify-end gap-2 pt-3 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddModal(false)}
                  className="dash-card text-xs font-medium"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={submittingRoom}
                  className="btn-brand text-xs font-semibold text-white shadow-sm"
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
