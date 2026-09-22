'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { clientAdminService } from '@/client/services/admin.service';
import { clientPropertyService } from '@/client/services/property.service';
import { DbCity, DbAmenity } from '@/shared/types/database';
import {
  Building2,
  ArrowLeft,
  Check,
  Save,
  Loader2,
  MapPin,
  Sparkles,
  Info,
  Image as ImageIcon,
  Plus,
  Trash2,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ImageSourcePicker } from '@/components/admin/image-source-picker';


export default function NouveauLogementPage() {
  const router = useRouter();
  const [cities, setCities] = useState<DbCity[]>([]);
  const [amenitiesList, setAmenitiesList] = useState<DbAmenity[]>([]);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [propertyType, setPropertyType] = useState('apartment');
  const [cityId, setCityId] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [address, setAddress] = useState('');
  const [surfaceSqm, setSurfaceSqm] = useState(85);
  const [status, setStatus] = useState<'DRAFT' | 'AVAILABLE' | 'UNDER_REVIEW'>('AVAILABLE');
  const [featured, setFeatured] = useState(false);
  const [locationLat, setLocationLat] = useState('35.0750');
  const [locationLng, setLocationLng] = useState('-2.9110');
  const [selectedAmenityIds, setSelectedAmenityIds] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&auto=format&fit=crop&q=80',
  ]);
  const [newImageUrl, setNewImageUrl] = useState('');


  useEffect(() => {
    async function loadMeta() {
      try {
        const [citiesRes, amenitiesRes] = await Promise.all([
          clientAdminService.getCities(),
          clientAdminService.getAmenities(),
        ]);
        if (citiesRes.success && citiesRes.data) {
          setCities(citiesRes.data);
          if (citiesRes.data.length > 0) {
            setCityId(citiesRes.data[0].id);
          }
        }
        if (amenitiesRes.success && amenitiesRes.data) {
          setAmenitiesList(amenitiesRes.data);
        }
      } catch (err) {
        console.error('[Nouveau Logement] Meta load error:', err);
      } finally {
        setLoadingInitial(false);
      }
    }
    loadMeta();
  }, []);

  const handleToggleAmenity = (id: string) => {
    setSelectedAmenityIds((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleAddImage = (urlToAdd?: string) => {
    const targetUrl = (urlToAdd || newImageUrl).trim();
    if (targetUrl && !images.includes(targetUrl)) {
      setImages([...images, targetUrl]);
      if (!urlToAdd) setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSetPrimary = (index: number) => {
    const selected = images[index];
    const rest = images.filter((_, i) => i !== index);
    setImages([selected, ...rest]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (title.trim().length < 3) {
      setErrorMsg('Le titre doit contenir au moins 3 caractères.');
      return;
    }
    if (description.trim().length < 10) {
      setErrorMsg('La description doit contenir au moins 10 caractères.');
      return;
    }
    if (!cityId) {
      setErrorMsg('Veuillez sélectionner une ville.');
      return;
    }
    if (!neighborhood.trim()) {
      setErrorMsg('Le quartier est obligatoire.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await clientAdminService.createProperty({
        title: title.trim(),
        description: description.trim(),
        city_id: cityId,
        neighborhood: neighborhood.trim(),
        address: address.trim() || `${neighborhood.trim()}, Selouane`,
        property_type: propertyType as any,
        surface_sqm: Number(surfaceSqm) || 0,
        status: status as any,
        featured,
        is_available: status === 'AVAILABLE',
        location_lat: Number(locationLat) || 0,
        location_lng: Number(locationLng) || 0,
        amenity_ids: selectedAmenityIds,
        image_urls: images,
      });

      if (res.success && res.data) {
        // Redirect to rooms management for this new property
        router.push(`/dashboard/logements/${res.data.id}/chambres`);
      } else {
        setErrorMsg('Une erreur est survenue lors de la création du logement.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Erreur lors de la création du logement.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingInitial) {
    return (
      <div className="p-12 flex items-center justify-center text-slate-400 text-xs">
        <Loader2 className="w-6 h-6 animate-spin mr-2 text-primary-400" />
        Initialisation du formulaire…
      </div>
    );
  }

  return (
    <div className="max-w-4xl w-full mx-auto flex flex-col gap-8">
      {/* ── Breadcrumb / Back ── */}
      <div className="flex items-center gap-2">
        <Link
          href="/dashboard/logements"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux logements
        </Link>
      </div>

      {/* ── Page Header ── */}
      <div className="pb-6 border-b border-slate-800">
        <h1 className="text-3xl font-black text-white tracking-tight">
          Nouveau Logement Étudiant
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Renseignez les détails du bien immobilier. Vous pourrez ajouter les chambres et les photos à l&apos;étape suivante.
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-bold">
          {errorMsg}
        </div>
      )}

      {/* ── Main Form ── */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        {/* Section 1 : Informations Générales */}
        <div className="bg-slate-950/80 p-6 rounded-3xl border border-slate-800/80 flex flex-col gap-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Building2 className="w-4 h-4 text-primary-400" />
            <h2 className="text-sm font-black text-white uppercase tracking-wider">
              1. Informations Générales
            </h2>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-300">
              Titre de l&apos;annonce <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="ex: Résidence Universitaire Al Omrane 02"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300">
                Type de bien <span className="text-rose-400">*</span>
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-primary-500"
              >
                <option value="apartment">Appartement partagé</option>
                <option value="residence">Résidence étudiante</option>
                <option value="studio">Studio individuel</option>
                <option value="house">Maison</option>
                <option value="building">Immeuble entier</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300">
                Superficie totale (m²)
              </label>
              <input
                type="number"
                min="10"
                value={surfaceSqm}
                onChange={(e) => setSurfaceSqm(Number(e.target.value))}
                className="bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-primary-500"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-300">
              Description complète de l&apos;offre <span className="text-rose-400">*</span>
            </label>
            <textarea
              required
              rows={4}
              placeholder="Décrivez l'appartement, sa localisation par rapport aux facultés, le calme, les prestations incluses..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 leading-relaxed"
            />
          </div>
        </div>

        {/* Section 2 : Localisation */}
        <div className="bg-slate-950/80 p-6 rounded-3xl border border-slate-800/80 flex flex-col gap-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <MapPin className="w-4 h-4 text-primary-400" />
            <h2 className="text-sm font-black text-white uppercase tracking-wider">
              2. Localisation & Quartier
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300">
                Ville <span className="text-rose-400">*</span>
              </label>
              <select
                value={cityId}
                onChange={(e) => setCityId(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-primary-500"
              >
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name} ({city.region})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300">
                Quartier <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="ex: Hay Al Omrane, Selouane"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary-500"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-300">
              Adresse exacte
            </label>
            <input
              type="text"
              placeholder="ex: Boulevard Hassan II, Immeuble 5, 2ème étage"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300">Latitude GPS</label>
              <input
                type="text"
                value={locationLat}
                onChange={(e) => setLocationLat(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-white font-mono"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300">Longitude GPS</label>
              <input
                type="text"
                value={locationLng}
                onChange={(e) => setLocationLng(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* Section 3 : Équipements inclus */}
        <div className="bg-slate-950/80 p-6 rounded-3xl border border-slate-800/80 flex flex-col gap-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Sparkles className="w-4 h-4 text-primary-400" />
            <h2 className="text-sm font-black text-white uppercase tracking-wider">
              3. Équipements & Services
            </h2>
          </div>

          <p className="text-xs text-slate-400">
            Cochez tous les équipements mis à disposition des étudiants dans ce logement :
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {amenitiesList.map((amenity) => {
              const isChecked = selectedAmenityIds.includes(amenity.id);
              return (
                <button
                  key={amenity.id}
                  type="button"
                  onClick={() => handleToggleAmenity(amenity.id)}
                  className={`p-3 rounded-2xl border text-xs font-bold text-left flex items-center justify-between transition-all ${
                    isChecked
                      ? 'bg-primary-950/60 border-primary-500 text-white shadow-soft'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="truncate">{amenity.name}</span>
                  {isChecked && <Check className="w-4 h-4 text-primary-400 flex-shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 4 : Photos & Galerie Médias */}
        <div className="bg-slate-950/80 p-6 rounded-3xl border border-slate-800/80 flex flex-col gap-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <ImageIcon className="w-4 h-4 text-primary-400" />
            <h2 className="text-sm font-black text-white uppercase tracking-wider">
              4. Photos & Galerie Médias
            </h2>
          </div>

          <p className="text-xs text-slate-400">
            Ajoutez les photos du logement (façade, pièces communes, cuisine, chambres). La première photo servira de couverture principale.
          </p>

          {/* Sélecteur multi-source : Importation PC local / Bibliothèque StudRoom / URL Web */}
          <ImageSourcePicker onImageSelected={(url) => handleAddImage(url)} />


          {/* Images preview list */}
          {images.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 pt-2">
              {images.map((imgUrl, index) => {
                const isPrimary = index === 0;
                return (
                  <div
                    key={index}
                    className={`relative rounded-2xl overflow-hidden border bg-slate-900 flex flex-col group ${
                      isPrimary ? 'border-amber-500/80 ring-2 ring-amber-500/20' : 'border-slate-800'
                    }`}
                  >
                    <div className="w-full aspect-[4/3] relative bg-slate-950">
                      <img
                        src={imgUrl}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&auto=format&fit=crop&q=80';
                        }}
                      />
                      {isPrimary && (
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-[10px] flex items-center gap-1 shadow-md">
                          <Star className="w-3 h-3 fill-slate-950" />
                          Principale
                        </span>
                      )}
                    </div>

                    <div className="p-2 flex items-center justify-between bg-slate-950/80 border-t border-slate-800/80">
                      {!isPrimary ? (
                        <button
                          type="button"
                          onClick={() => handleSetPrimary(index)}
                          className="text-[10px] text-slate-400 hover:text-amber-400 flex items-center gap-1 transition"
                        >
                          <Star className="w-3 h-3" />
                          Définir principale
                        </button>
                      ) : (
                        <span className="text-[10px] text-amber-400 font-semibold">Couverture</span>
                      )}

                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="p-1 text-slate-500 hover:text-rose-400 transition"
                        title="Retirer cette photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-6 rounded-2xl border border-dashed border-slate-800 text-center text-xs text-slate-500">
              Aucune photo ajoutée pour l&apos;instant. Entrez une URL ci-dessus ou cliquez sur une suggestion.
            </div>
          )}
        </div>

        {/* Section 5 : Statut & Publication */}
        <div className="bg-slate-950/80 p-6 rounded-3xl border border-slate-800/80 flex flex-col gap-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Info className="w-4 h-4 text-primary-400" />
            <h2 className="text-sm font-black text-white uppercase tracking-wider">
              5. Statut & Publication
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300">Statut initial</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-primary-500"
              >
                <option value="AVAILABLE">En ligne (Disponible)</option>
                <option value="DRAFT">Brouillon (Non visible)</option>
                <option value="UNDER_REVIEW">En révision</option>
              </select>
            </div>

            <div className="flex items-center gap-3 pt-6">
              <input
                type="checkbox"
                id="featuredCheck"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 rounded text-primary-600 bg-slate-900 border-slate-800 focus:ring-primary-500"
              />
              <label htmlFor="featuredCheck" className="text-xs font-bold text-slate-300 cursor-pointer">
                Mettre en avant sur la page d&apos;accueil (Featured)
              </label>
            </div>
          </div>
        </div>

        {/* ── Submit Buttons ── */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Link href="/dashboard/logements">
            <Button variant="outline" size="md" type="button" className="border-slate-800 text-slate-400">
              Annuler
            </Button>
          </Link>
          <Button
            variant="primary"
            size="md"
            type="submit"
            disabled={submitting}
            className="font-bold shadow-soft min-w-[180px]"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Création en cours…
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Créer et passer aux chambres
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
