'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { clientAdminService } from '@/client/services/admin.service';
import { PropertyDetail } from '@/shared/types';
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
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        <div>
          <div className="flex items-center gap-2 text-xs mb-1.5" style={{ color: 'var(--text-muted)' }}>
            <Link
              href="/dashboard/logements"
              className="hover:underline transition-colors flex items-center gap-1 text-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Inventaire Logements
            </Link>
            <span>/</span>
            <span className="truncate max-w-[200px] sm:max-w-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
              {property?.title || 'Chargement...'}
            </span>
            <span>/</span>
            <span className="font-medium" style={{ color: 'var(--brand-primary)' }}>
              Médiathèque Photos
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
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                Gestion des Photos & Médias
              </h1>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                Gérez la galerie visuelle HD, définissez la photo principale et organisez les clichés pour les étudiants.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {property && (
            <Link
              href={`/dashboard/logements/${property.id}/chambres`}
              className="dash-card px-3 py-2 text-xs font-medium rounded-xl transition"
              style={{ color: 'var(--text-primary)' }}
            >
              Voir les Chambres
            </Link>
          )}
          <Button
            onClick={() => setShowAddModal(true)}
            className="btn-brand flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl text-white shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Ajouter une Photo
          </Button>
        </div>
      </div>

      {/* Property Fast Summary Header Card */}
      {property && (
        <div
          className="dash-card p-4 flex flex-wrap items-center justify-between gap-4"
          style={{ backgroundColor: 'var(--bg-card)' }}
        >
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{property.title}</span>
            <span
              className="text-xs px-2.5 py-0.5 rounded-full border font-medium"
              style={{
                backgroundColor: 'var(--bg-subtle)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-secondary)',
              }}
            >
              {property.city?.name || 'Selouane'} • {property.neighborhood}
            </span>
            <span
              className="text-xs px-2 py-0.5 rounded font-mono font-medium"
              style={{
                backgroundColor: 'var(--brand-bg)',
                color: 'var(--brand-primary)',
                border: '1px solid var(--brand-bg-strong)',
              }}
            >
              {property.images.length} photo{property.images.length > 1 ? 's' : ''}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {property.slug && (
              <a
                href={`/logements/${property.slug}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-medium hover:underline flex items-center gap-1"
                style={{ color: 'var(--brand-primary)' }}
              >
                Voir sur le site public <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      )}

      {/* Gallery Grid */}
      {loading ? (
        <div
          className="dash-card flex flex-col items-center justify-center py-24"
          style={{ backgroundColor: 'var(--bg-card)' }}
        >
          <RefreshCw className="w-8 h-8 animate-spin mb-3" style={{ color: 'var(--brand-primary)' }} />
          <p className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Chargement des médias...</p>
        </div>
      ) : !property || property.images.length === 0 ? (
        <div
          className="dash-card text-center py-16 px-4"
          style={{ backgroundColor: 'var(--bg-card)' }}
        >
          <div
            className="w-16 h-16 rounded-2xl border flex items-center justify-center mx-auto mb-3"
            style={{
              backgroundColor: 'var(--bg-subtle)',
              borderColor: 'var(--border-subtle)',
              color: 'var(--text-muted)',
            }}
          >
            <ImageIcon className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Aucune photo pour ce logement</h3>
          <p className="text-xs max-w-sm mx-auto mb-5" style={{ color: 'var(--text-secondary)' }}>
            Les photos HD augmentent le taux de réservation. Ajoutez la façade, les chambres et parties communes.
          </p>
          <Button
            onClick={() => setShowAddModal(true)}
            className="btn-brand px-4 py-2 text-xs font-semibold text-white rounded-xl shadow-sm"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Ajouter la première photo
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {property.images.map((img) => (
            <div
              key={img.id}
              className="dash-card group relative rounded-2xl overflow-hidden transition-all flex flex-col"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: img.is_primary ? 'var(--brand-primary)' : 'var(--border-subtle)',
                boxShadow: img.is_primary ? '0 0 0 1px var(--brand-primary)' : undefined,
              }}
            >
              {/* Image Preview Box */}
              <div
                className="relative w-full aspect-[4/3] cursor-pointer overflow-hidden"
                style={{ backgroundColor: 'var(--bg-subtle)' }}
                onClick={() => setPreviewZoomUrl(img.image_url)}
              >
                <img
                  src={img.image_url}
                  alt={img.alt_text || 'Logement StudRoom'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&auto=format&fit=crop&q=80';
                  }}
                />

                {/* Badges Over Image */}
                <div className="absolute top-2 left-2 flex items-center gap-1.5">
                  {img.is_primary ? (
                    <span
                      className="px-2.5 py-1 rounded-lg text-white font-bold text-[11px] shadow-sm flex items-center gap-1"
                      style={{ backgroundColor: 'var(--brand-primary)' }}
                    >
                      <Star className="w-3 h-3 fill-white" />
                      Principale
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px] backdrop-blur-sm">
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
              <div
                className="p-3.5 flex-1 flex flex-col justify-between border-t"
                style={{
                  borderColor: 'var(--border-subtle)',
                  backgroundColor: 'var(--bg-card)',
                }}
              >
                <div className="mb-3">
                  <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }} title={img.alt_text || 'Sans description'}>
                    {img.alt_text || 'Photo sans libellé'}
                  </p>
                  <p className="text-[11px] truncate font-mono mt-0.5" style={{ color: 'var(--text-muted)' }} title={img.image_url}>
                    {img.image_url}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-2 pt-2 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                  {!img.is_primary ? (
                    <button
                      disabled={actionLoadingId === img.id}
                      onClick={() => handleSetPrimary(img.id)}
                      className="dash-card px-2.5 py-1 text-[11px] font-medium rounded-lg transition flex items-center gap-1 disabled:opacity-50"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {actionLoadingId === img.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Star className="w-3 h-3" />
                      )}
                      Définir principale
                    </button>
                  ) : (
                    <span className="text-[11px] font-semibold flex items-center gap-1" style={{ color: 'var(--brand-primary)' }}>
                      <Check className="w-3.5 h-3.5" /> Couverture
                    </span>
                  )}

                  <button
                    disabled={actionLoadingId === img.id}
                    onClick={() => handleDeletePhoto(img.id)}
                    className="p-1.5 rounded-lg transition disabled:opacity-50"
                    style={{ color: 'var(--error-fg)' }}
                    title="Supprimer la photo"
                  >
                    {actionLoadingId === img.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5 hover:opacity-75" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div
            className="dash-card border rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-strong)',
            }}
          >
            <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{
                    backgroundColor: 'var(--brand-bg)',
                    border: '1px solid var(--brand-bg-strong)',
                    color: 'var(--brand-primary)',
                  }}
                >
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>Ajouter une Photo</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg transition"
                style={{ color: 'var(--text-muted)' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddPhotoSubmit} className="p-5 space-y-4">
              {errorMsg && (
                <div
                  className="p-3 text-xs rounded-xl border font-semibold"
                  style={{
                    backgroundColor: 'var(--error-bg)',
                    borderColor: 'var(--error-border)',
                    color: 'var(--error-fg)',
                  }}
                >
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>
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
                <div
                  className="w-full h-36 rounded-xl overflow-hidden border relative"
                  style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-subtle)' }}
                >
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
                    <span className="px-2 py-0.5 rounded bg-black/80 text-[10px] text-white flex items-center gap-1">
                      ✓ Image sélectionnée
                    </span>
                    <span className="px-2 py-0.5 rounded bg-black/80 text-[10px] text-slate-300 font-mono truncate max-w-[180px]">
                      {imageUrl.startsWith('data:') ? 'Fichier importé' : imageUrl}
                    </span>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>
                  Texte alternatif / Titre de la photo
                </label>
                <input
                  type="text"
                  placeholder="Ex: Salon lumineux avec espace bureau"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  className="w-full rounded-xl px-3 py-2 text-xs focus:outline-none transition-all"
                  style={{
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>Ordre d'affichage</label>
                  <input
                    type="number"
                    min={0}
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(Number(e.target.value))}
                    className="w-full rounded-xl px-3 py-2 text-xs focus:outline-none"
                    style={{
                      backgroundColor: 'var(--bg-subtle)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                    }}
                  />
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="primaryCheck"
                    checked={isPrimary}
                    onChange={(e) => setIsPrimary(e.target.checked)}
                    className="w-4 h-4 rounded cursor-pointer"
                    style={{ accentColor: 'var(--brand-primary)' }}
                  />
                  <label htmlFor="primaryCheck" className="text-xs font-semibold cursor-pointer" style={{ color: 'var(--text-primary)' }}>
                    Définir comme photo principale
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddModal(false)}
                  className="dash-card text-xs font-medium"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={submittingPhoto}
                  className="btn-brand text-xs font-semibold text-white shadow-sm flex items-center gap-1.5"
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
          <div className="relative max-w-4xl max-h-[85vh] overflow-hidden rounded-2xl border shadow-2xl" style={{ borderColor: 'var(--border-strong)' }}>
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
