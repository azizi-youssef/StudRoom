'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { clientAdminService } from '@/client/services/admin.service';
import { PropertyDetail } from '@/shared/types';
import { DbPropertyImage } from '@/shared/types/database';
import {
  Image as ImageIcon,
  ArrowLeft,
  Plus,
  Trash2,
  Star,
  Check,
  X,
  ExternalLink,
  RefreshCw,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Info,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ImageSourcePicker } from '@/components/admin/image-source-picker';


export default function AdminLogementPhotosPage() {
  const params = useParams();
  const propertyId = params.id as string;

  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Add photo form modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [altText, setAltText] = useState('');
  const [isPrimary, setIsPrimary] = useState(false);
  const [displayOrder, setDisplayOrder] = useState(1);
  const [submittingPhoto, setSubmittingPhoto] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [previewZoomUrl, setPreviewZoomUrl] = useState<string | null>(null);

  const loadProperty = useCallback(async () => {
    setLoading(true);
    try {
      const res = await clientAdminService.getProperty(propertyId);
      if (res.success && res.data) {
        setProperty(res.data);
      }
    } catch (err) {
      console.error('[Photos] Error loading property:', err);
    } finally {
      setLoading(false);
    }
  }, [propertyId]);

  useEffect(() => {
    loadProperty();
  }, [loadProperty]);

  const handleSetPrimary = async (imageId: string) => {
    setActionLoadingId(imageId);
    try {
      const res = await clientAdminService.setPrimaryImage(propertyId, imageId);
      if (res.success) {
        setProperty((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            images: prev.images.map((img) => ({
              ...img,
              is_primary: img.id === imageId,
            })),
          };
        });
      }
    } catch (err) {
      console.error('[Photos] Set primary error:', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeletePhoto = async (imageId: string) => {
    if (!window.confirm('Supprimer cette photo de la galerie ?')) return;
    setActionLoadingId(imageId);
    try {
      const res = await clientAdminService.deleteImage(imageId);
      if (res.success) {
        setProperty((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            images: prev.images.filter((img) => img.id !== imageId),
          };
        });
      }
    } catch (err) {
      console.error('[Photos] Delete photo error:', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleAddPhotoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim()) {
      setErrorMsg("L'URL ou chemin de l'image est obligatoire.");
      return;
    }

    setSubmittingPhoto(true);
    setErrorMsg(null);
    try {
      const res = await clientAdminService.addImage(
        propertyId,
        imageUrl.trim(),
        altText.trim() || property?.title || 'Photo logement',
        isPrimary,
        displayOrder
      );

      if (res.success && res.data) {
        const newImg = res.data;
        setProperty((prev) => {
          if (!prev) return null;
          const updatedImages = isPrimary
            ? prev.images.map((img) => ({ ...img, is_primary: false }))
            : [...prev.images];
          return {
            ...prev,
            images: [...updatedImages, newImg].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)),
          };
        });

        // Reset form
        setImageUrl('');
        setAltText('');
        setIsPrimary(false);
        setShowAddModal(false);
      } else {
        setErrorMsg(res.error?.message || "Erreur lors de l'ajout de l'image.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Erreur inattendue.');
    } finally {
      setSubmittingPhoto(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-1">
            <Link
              href="/dashboard/logements"
              className="hover:text-primary-400 transition-colors flex items-center gap-1 text-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Inventaire Logements
            </Link>
            <span>/</span>
            <span className="text-slate-200 font-medium truncate max-w-[200px] sm:max-w-xs">
              {property?.title || 'Chargement...'}
            </span>
            <span>/</span>
            <span className="text-primary-400 font-medium">Médiathèque Photos</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-950/80 border border-primary-800/80 flex items-center justify-center text-primary-400">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Gestion des Photos & Médias</h1>
              <p className="text-xs text-slate-400">
                Gérez la galerie visuelle HD, définissez la photo principale et organisez les clichés pour les étudiants.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {property && (
            <Link
              href={`/dashboard/logements/${property.id}/chambres`}
              className="px-3 py-2 text-xs font-semibold rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition border border-slate-700"
            >
              Voir les Chambres
            </Link>
          )}
          <Button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-900/30 transition border border-primary-500/30"
          >
            <Plus className="w-4 h-4" />
            Ajouter une Photo
          </Button>
        </div>
      </div>

      {/* Property Fast Summary Header Card */}
      {property && (
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-white">{property.title}</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {property.city?.name || 'Selouane'} • {property.neighborhood}
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-primary-950/80 text-primary-300 border border-primary-800/80 font-mono">
              {property.images.length} photo{property.images.length > 1 ? 's' : ''}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {property.slug && (
              <a
                href={`/logements/${property.slug}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-primary-400 hover:underline flex items-center gap-1"
              >
                Voir sur le site public <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      )}

      {/* Gallery Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 bg-slate-900/40 rounded-2xl border border-slate-800/60">
          <RefreshCw className="w-8 h-8 text-primary-400 animate-spin mb-3" />
          <p className="text-sm text-slate-400">Chargement des médias...</p>
        </div>
      ) : !property || property.images.length === 0 ? (
        <div className="text-center py-16 px-4 bg-slate-900/40 border border-slate-800/60 rounded-2xl">
          <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-slate-500 mx-auto mb-4">
            <ImageIcon className="w-8 h-8" />
          </div>
          <h3 className="text-base font-semibold text-slate-200 mb-1">Aucune photo pour ce logement</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
            Les photos HD augmentent le taux de réservation de plus de 70%. Ajoutez la façade, les chambres et parties communes.
          </p>
          <Button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 text-xs font-semibold bg-primary-600 hover:bg-primary-500 text-white rounded-xl shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter la première photo
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {property.images.map((img) => (
            <div
              key={img.id}
              className={`group relative bg-slate-900/80 border rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-xl hover:shadow-black/40 flex flex-col ${
                img.is_primary
                  ? 'border-amber-500/80 ring-2 ring-amber-500/20'
                  : 'border-slate-800/80 hover:border-slate-700'
              }`}
            >
              {/* Image Preview Box */}
              <div
                className="relative w-full aspect-[4/3] bg-slate-950 cursor-pointer overflow-hidden"
                onClick={() => setPreviewZoomUrl(img.image_url)}
              >
                <img
                  src={img.image_url}
                  alt={img.alt_text || 'Logement StudRoom'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    // Fallback visual
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&auto=format&fit=crop&q=80';
                  }}
                />

                {/* Badges Over Image */}
                <div className="absolute top-2 left-2 flex items-center gap-1.5">
                  {img.is_primary ? (
                    <span className="px-2.5 py-1 rounded-lg bg-amber-500/90 text-slate-950 font-bold text-[11px] shadow-md flex items-center gap-1 backdrop-blur-xs">
                      <Star className="w-3 h-3 fill-slate-950" />
                      Principale
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-md bg-black/60 text-slate-300 text-[10px] backdrop-blur-xs">
                      Ordre #{img.display_order}
                    </span>
                  )}
                </div>

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-xs text-white bg-black/70 px-3 py-1.5 rounded-xl border border-white/20 backdrop-blur-md">
                    Cliquer pour agrandir
                  </span>
                </div>
              </div>

              {/* Photo Information & Actions */}
              <div className="p-3.5 flex-1 flex flex-col justify-between bg-slate-900/90 border-t border-slate-800">
                <div className="mb-3">
                  <p className="text-xs font-medium text-slate-200 truncate" title={img.alt_text || 'Sans description'}>
                    {img.alt_text || 'Photo sans libellé'}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate font-mono mt-0.5" title={img.image_url}>
                    {img.image_url}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
                  {!img.is_primary ? (
                    <button
                      disabled={actionLoadingId === img.id}
                      onClick={() => handleSetPrimary(img.id)}
                      className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-slate-800 text-slate-300 hover:bg-amber-500/20 hover:text-amber-400 hover:border-amber-500/40 border border-slate-700 transition flex items-center gap-1 disabled:opacity-50"
                    >
                      {actionLoadingId === img.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Star className="w-3 h-3" />
                      )}
                      Définir principale
                    </button>
                  ) : (
                    <span className="text-[11px] text-amber-400/90 font-medium flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Photo de couverture
                    </span>
                  )}

                  <button
                    disabled={actionLoadingId === img.id}
                    onClick={() => handleDeletePhoto(img.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition border border-transparent hover:border-rose-900/50 disabled:opacity-50"
                    title="Supprimer la photo"
                  >
                    {actionLoadingId === img.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADD PHOTO MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary-950 text-primary-400 border border-primary-800/80 flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white">Ajouter une Photo</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddPhotoSubmit} className="p-5 space-y-4">
              {errorMsg && (
                <div className="p-3 text-xs bg-rose-950/60 border border-rose-800/80 text-rose-300 rounded-xl">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Source de la photo (Fichier local PC, Bibliothèque locale ou URL Web) *
                </label>
                <ImageSourcePicker
                  onImageSelected={(url, name) => {
                    setImageUrl(url);
                    if (name && !altText) setAltText(name);
                  }}
                />
              </div>

              {imageUrl && (
                <div className="w-full h-36 bg-slate-950 rounded-xl overflow-hidden border border-slate-800 relative">
                  <img
                    src={imageUrl}
                    alt="Aperçu"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-black/80 text-[10px] text-emerald-400 border border-emerald-800/80">
                      ✓ Image prête à être enregistrée
                    </span>
                    <span className="px-2 py-0.5 rounded bg-black/80 text-[10px] text-slate-400 font-mono truncate max-w-[180px]">
                      {imageUrl.startsWith('data:') ? 'Fichier local importé' : imageUrl}
                    </span>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Texte alternatif / Titre de la photo
                </label>
                <input
                  type="text"
                  placeholder="Ex: Salon lumineux avec espace bureau"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Ordre d'affichage</label>
                  <input
                    type="number"
                    min={0}
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div className="flex items-center gap-3 pt-6">
                  <input
                    type="checkbox"
                    id="primaryCheck"
                    checked={isPrimary}
                    onChange={(e) => setIsPrimary(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="primaryCheck" className="text-xs text-slate-300 select-none cursor-pointer">
                    Définir comme photo principale
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddModal(false)}
                  className="text-xs border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={submittingPhoto}
                  className="text-xs bg-primary-600 hover:bg-primary-500 text-white font-semibold flex items-center gap-1.5"
                >
                  {submittingPhoto ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  Enregistrer la photo
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ZOOM LIGHTBOX MODAL */}
      {previewZoomUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in cursor-zoom-out"
          onClick={() => setPreviewZoomUrl(null)}
        >
          <div className="relative max-w-4xl max-h-[85vh] overflow-hidden rounded-2xl border border-slate-700 shadow-2xl">
            <button
              onClick={() => setPreviewZoomUrl(null)}
              className="absolute top-3 right-3 p-2 rounded-xl bg-black/70 text-white hover:bg-black transition z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <img src={previewZoomUrl} alt="Agrandissement" className="w-full h-full object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}
