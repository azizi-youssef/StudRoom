'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { clientAdminService } from '@/client/services/admin.service';
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
  Trash2,
  Star,
  Home,
  Layers,
  ArrowRight,
  Eye,
  CheckCircle2,
  Compass,
  Wifi,
  ShieldCheck,
  Zap,
  BedDouble,
  Wallet,
  Coins,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ImageSourcePicker } from '@/components/admin/image-source-picker';

const PROPERTY_TYPES = [
  {
    id: 'apartment',
    label: 'Appartement partagé',
    desc: 'Colocation étudiante avec chambres individuelles',
    icon: Home,
  },
  {
    id: 'residence',
    label: 'Résidence étudiante',
    desc: 'Résidence universitaire ou foyer étudiant',
    icon: Building2,
  },
  {
    id: 'studio',
    label: 'Studio individuel',
    desc: 'Logement indépendant pour 1 étudiant',
    icon: Zap,
  },
  {
    id: 'house',
    label: 'Maison complète',
    desc: 'Maison partagée avec plusieurs chambres',
    icon: Layers,
  },
];

const GPS_PRESETS = [
  {
    name: 'Faculté des Sciences Appliquees de Nador (FSAN)',
    lat: '35.0785',
    lng: '-2.9152',
    zone: 'Campus Selouane',
  },
  {
    name: 'École Supérieure de Technologie (EST)',
    lat: '35.0742',
    lng: '-2.9115',
    zone: 'Campus Selouane',
  },
  {
    name: 'Centre-ville Selouane',
    lat: '35.0715',
    lng: '-2.9130',
    zone: 'Selouane',
  },
  {
    name: 'Nador Centre',
    lat: '35.1688',
    lng: '-2.9287',
    zone: 'Nador Ville',
  },
];

export default function NouveauLogementPage() {
  const router = useRouter();
  const [cities, setCities] = useState<DbCity[]>([]);
  const [amenitiesList, setAmenitiesList] = useState<DbAmenity[]>([]);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Active step (1 to 5) or 'all' for single page view
  const [activeStep, setActiveStep] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'stepper' | 'full'>('stepper');

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [propertyType, setPropertyType] = useState('apartment');
  const [cityId, setCityId] = useState('');
  const [neighborhood, setNeighborhood] = useState('Hay Al Omrane');
  const [address, setAddress] = useState('');
  const [surfaceSqm, setSurfaceSqm] = useState(85);
  const [status, setStatus] = useState<'DRAFT' | 'AVAILABLE' | 'UNDER_REVIEW'>('AVAILABLE');
  const [featured, setFeatured] = useState(false);
  const [locationLat, setLocationLat] = useState('35.0785');
  const [locationLng, setLocationLng] = useState('-2.9152');
  const [selectedAmenityIds, setSelectedAmenityIds] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&auto=format&fit=crop&q=80',
  ]);
  const [newImageUrl, setNewImageUrl] = useState('');

  // ── Rooms & Pricing State ──
  const [totalRooms, setTotalRooms] = useState<number>(3);
  const [availableRooms, setAvailableRooms] = useState<number>(3);
  const [priceMonthly, setPriceMonthly] = useState<number>(1800);
  const [depositDh, setDepositDh] = useState<number>(1800);
  const [roomTypeDefault, setRoomTypeDefault] = useState<'PRIVATE' | 'SHARED' | 'STUDIO'>('PRIVATE');
  const [waterElecIncluded, setWaterElecIncluded] = useState<boolean>(true);
  const [autoCreateRooms, setAutoCreateRooms] = useState<boolean>(true);

  const handleSelectPropertyType = (typeId: string) => {
    setPropertyType(typeId);
    if (typeId === 'studio') {
      setTotalRooms(1);
      setAvailableRooms(1);
      setRoomTypeDefault('STUDIO');
      setSurfaceSqm((prev) => (prev > 50 ? 32 : prev));
    } else if (typeId === 'apartment' && totalRooms === 1) {
      setTotalRooms(3);
      setAvailableRooms(3);
      setRoomTypeDefault('PRIVATE');
      setSurfaceSqm((prev) => (prev < 60 ? 85 : prev));
    }
  };

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
          // Pre-select some common amenities
          const common = amenitiesRes.data.slice(0, 4).map((a) => a.id);
          setSelectedAmenityIds(common);
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

  const handleSelectAllAmenities = () => {
    if (selectedAmenityIds.length === amenitiesList.length) {
      setSelectedAmenityIds([]);
    } else {
      setSelectedAmenityIds(amenitiesList.map((a) => a.id));
    }
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

  const handleApplyPreset = (preset: typeof GPS_PRESETS[0]) => {
    setLocationLat(preset.lat);
    setLocationLng(preset.lng);
    if (!neighborhood || neighborhood === 'Hay Al Omrane') {
      setNeighborhood(preset.zone);
    }
  };

  // Completeness score calculator
  const completeness = useMemo(() => {
    let score = 0;
    if (title.trim().length >= 5) score += 15;
    if (description.trim().length >= 20) score += 15;
    if (cityId && neighborhood.trim()) score += 15;
    if (priceMonthly > 0 && totalRooms > 0) score += 20;
    if (selectedAmenityIds.length >= 2) score += 15;
    if (images.length >= 1) score += 20;
    return Math.min(100, score);
  }, [title, description, cityId, neighborhood, priceMonthly, totalRooms, selectedAmenityIds, images]);

  const selectedCityName = useMemo(() => {
    return cities.find((c) => c.id === cityId)?.name || 'Selouane';
  }, [cities, cityId]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg(null);

    if (title.trim().length < 3) {
      setErrorMsg('Le titre doit contenir au moins 3 caractères.');
      setActiveStep(1);
      return;
    }
    if (description.trim().length < 10) {
      setErrorMsg('La description doit contenir au moins 10 caractères.');
      setActiveStep(1);
      return;
    }
    if (priceMonthly <= 0) {
      setErrorMsg('Veuillez spécifier un loyer mensuel positif.');
      setActiveStep(2);
      return;
    }
    if (totalRooms <= 0) {
      setErrorMsg('Le logement doit comporter au moins 1 chambre.');
      setActiveStep(2);
      return;
    }
    if (availableRooms > totalRooms) {
      setErrorMsg('Le nombre de chambres disponibles ne peut pas dépasser le nombre total.');
      setActiveStep(2);
      return;
    }
    if (!cityId) {
      setErrorMsg('Veuillez sélectionner une ville.');
      setActiveStep(3);
      return;
    }
    if (!neighborhood.trim()) {
      setErrorMsg('Le quartier est obligatoire.');
      setActiveStep(3);
      return;
    }

    setSubmitting(true);
    try {
      const res = await clientAdminService.createProperty({
        title: title.trim(),
        description: description.trim(),
        city_id: cityId,
        neighborhood: neighborhood.trim(),
        address: address.trim() || `${neighborhood.trim()}, ${selectedCityName}`,
        property_type: propertyType as any,
        surface_sqm: Number(surfaceSqm) || 0,
        min_price_dh: Number(priceMonthly) || 0,
        max_price_dh: Number(priceMonthly) || 0,
        total_rooms: Number(totalRooms) || 1,
        available_rooms: Number(availableRooms) || 1,
        status: status as any,
        featured,
        is_available: status === 'AVAILABLE',
        location_lat: Number(locationLat) || 0,
        location_lng: Number(locationLng) || 0,
        amenity_ids: selectedAmenityIds,
        image_urls: images,
      });

      if (res.success && res.data) {
        const propId = res.data.id;

        // Auto-create rooms if enabled
        if (autoCreateRooms && totalRooms > 0) {
          const roomPromises = [];
          const approxSurface = Math.max(9, Math.round(((surfaceSqm || 80) - 20) / totalRooms));
          for (let i = 1; i <= totalRooms; i++) {
            const isAvail = i <= availableRooms;
            const rName = propertyType === 'studio' ? 'Studio Principal' : `Chambre ${i}`;
            roomPromises.push(
              clientAdminService.createRoom(propId, {
                name: rName,
                room_type: roomTypeDefault,
                price_monthly: priceMonthly,
                deposit_dh: depositDh,
                surface_sqm: approxSurface,
                furnished: true,
                floor: 1,
                status: isAvail ? 'AVAILABLE' : 'OCCUPIED',
                images: images.length > 0 ? images.slice(0, 2) : [],
                features: waterElecIncluded
                  ? ['Eau & Électricité incluses', 'WiFi Haut Débit', 'Entièrement Meublé']
                  : ['WiFi Haut Débit', 'Entièrement Meublé'],
              })
            );
          }
          await Promise.allSettled(roomPromises);
        }

        router.push(`/dashboard/logements/${propId}/chambres`);
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
      <div className="dash-card p-16 flex items-center justify-center text-xs" style={{ color: 'var(--text-muted)' }}>
        <Loader2 className="w-6 h-6 animate-spin mr-2" style={{ color: 'var(--brand-primary)' }} />
        Chargement des paramètres de création…
      </div>
    );
  }

  const stepsList = [
    { num: 1, label: 'Général', sub: 'Titre & Type' },
    { num: 2, label: 'Chambres & Prix', sub: `${totalRooms} ch. · ${priceMonthly} DH` },
    { num: 3, label: 'Localisation', sub: 'Quartier & GPS' },
    { num: 4, label: 'Équipements', sub: `${selectedAmenityIds.length} inclus` },
    { num: 5, label: 'Photos', sub: `${images.length} photo${images.length > 1 ? 's' : ''}` },
    { num: 6, label: 'Publication', sub: status === 'AVAILABLE' ? 'En ligne' : 'Brouillon' },
  ];

  return (
    <div className="max-w-7xl w-full mx-auto flex flex-col gap-6 animate-fade-in pb-12">
      {/* ── Top Bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/logements"
            className="w-9 h-9 rounded-xl dash-card flex items-center justify-center transition-colors"
            style={{ color: 'var(--text-secondary)' }}
            title="Retour à l'inventaire"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
              <span>Logements</span>
              <span>/</span>
              <span className="font-medium" style={{ color: 'var(--brand-primary)' }}>Nouveau bien</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Ajouter un Logement Étudiant
            </h1>
          </div>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-2">
          <div
            className="flex items-center p-1 rounded-xl border text-xs"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
          >
            <button
              type="button"
              onClick={() => setViewMode('stepper')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${viewMode === 'stepper' ? 'btn-brand text-white shadow-sm' : ''
                }`}
              style={viewMode !== 'stepper' ? { color: 'var(--text-secondary)' } : undefined}
            >
              Mode Étapes
            </button>
            <button
              type="button"
              onClick={() => setViewMode('full')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${viewMode === 'full' ? 'btn-brand text-white shadow-sm' : ''
                }`}
              style={viewMode !== 'full' ? { color: 'var(--text-secondary)' } : undefined}
            >
              Vue Complète
            </button>
          </div>
        </div>
      </div>

      {/* ── Stepper Navigation ── */}
      {viewMode === 'stepper' && (
        <div
          className="dash-card p-3 rounded-2xl grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 border"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
        >
          {stepsList.map((step) => {
            const isCurrent = activeStep === step.num;
            const isCompleted = activeStep > step.num;

            return (
              <button
                key={step.num}
                type="button"
                onClick={() => setActiveStep(step.num)}
                className={`p-2.5 rounded-xl text-left transition-all flex items-center gap-3 border ${isCurrent
                    ? 'border-cyan-500 shadow-sm'
                    : isCompleted
                      ? 'border-emerald-500/40'
                      : 'border-transparent hover:bg-[var(--bg-subtle)]'
                  }`}
                style={{
                  backgroundColor: isCurrent ? 'var(--brand-bg)' : isCompleted ? 'var(--bg-subtle)' : 'transparent',
                }}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${isCurrent
                      ? 'btn-brand text-white'
                      : isCompleted
                        ? 'bg-emerald-500 text-white'
                        : 'dash-card text-muted'
                    }`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5" /> : step.num}
                </div>
                <div className="overflow-hidden">
                  <div
                    className="text-xs font-bold truncate"
                    style={{ color: isCurrent ? 'var(--brand-primary)' : 'var(--text-primary)' }}
                  >
                    {step.label}
                  </div>
                  <div className="text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>
                    {step.sub}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* ── Main Layout: Form (Left) + Live Student Preview (Right) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form Column (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {errorMsg && (
            <div
              className="p-4 rounded-xl border text-xs font-semibold flex items-center gap-2"
              style={{
                backgroundColor: 'var(--error-bg)',
                borderColor: 'var(--error-border)',
                color: 'var(--error-fg)',
              }}
            >
              <Info className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* ══════════ SECTION 1 : INFORMATIONS GÉNÉRALES ══════════ */}
          {(viewMode === 'full' || activeStep === 1) && (
            <div className="dash-card p-6 flex flex-col gap-5" style={{ backgroundColor: 'var(--bg-card)' }}>
              <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: 'var(--brand-bg)', color: 'var(--brand-primary)' }}
                  >
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
                      1. Identité & Caractéristiques du Bien
                    </h2>
                    <p className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                      Définissez le type de résidence et le nom affiché aux étudiants.
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-lg badge-primary">
                  Étape 1/6
                </span>
              </div>

              {/* Property Type Grid Cards */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Type d'hébergement <span style={{ color: 'var(--error-fg)' }}>*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PROPERTY_TYPES.map((pt) => {
                    const Icon = pt.icon;
                    const isSelected = propertyType === pt.id;

                    return (
                      <button
                        key={pt.id}
                        type="button"
                        onClick={() => handleSelectPropertyType(pt.id)}
                        className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${isSelected ? 'shadow-sm' : 'hover:bg-[var(--bg-subtle)]'
                          }`}
                        style={{
                          backgroundColor: isSelected ? 'var(--brand-bg)' : 'var(--bg-subtle)',
                          borderColor: isSelected ? 'var(--brand-primary)' : 'var(--border-subtle)',
                        }}
                      >
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                          style={{
                            backgroundColor: isSelected ? 'var(--brand-primary)' : 'var(--bg-card)',
                            color: isSelected ? '#FFFFFF' : 'var(--brand-primary)',
                          }}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                            {pt.label}
                          </div>
                          <div className="text-[11px] mt-0.5 leading-tight" style={{ color: 'var(--text-secondary)' }}>
                            {pt.desc}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title Input */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Titre public de l'annonce <span style={{ color: 'var(--error-fg)' }}>*</span>
                  </label>
                  <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
                    {title.length}/100 caractères
                  </span>
                </div>
                <input
                  type="text"
                  required
                  maxLength={100}
                  placeholder="ex: Résidence Selouane Campus — Chambres Confort Proche Faculté"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="rounded-xl px-4 py-2.5 text-xs focus:outline-none transition-all"
                  style={{
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>

              {/* Surface Input */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Superficie totale du logement (m²)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="10"
                      max="1000"
                      value={surfaceSqm}
                      onChange={(e) => setSurfaceSqm(Number(e.target.value))}
                      className="w-full rounded-xl px-4 py-2.5 text-xs focus:outline-none transition-all pr-12 font-bold"
                      style={{
                        backgroundColor: 'var(--bg-subtle)',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--text-primary)',
                      }}
                    />
                    <span
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      m²
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Suggestion de titre rapide
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setTitle(`Résidence Universitaire ${neighborhood || 'Al Omrane'} — ${selectedCityName}`)
                    }
                    className="dash-card px-3 py-2.5 rounded-xl text-left text-xs font-medium truncate transition-all hover:border-cyan-500"
                    style={{ color: 'var(--brand-primary)', backgroundColor: 'var(--bg-subtle)' }}
                  >
                    ✨ Utiliser : Résidence {neighborhood || 'Al Omrane'} ({selectedCityName})
                  </button>
                </div>
              </div>

              {/* Description Input */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Description détaillée <span style={{ color: 'var(--error-fg)' }}>*</span>
                  </label>
                  <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
                    {description.length} caractères (min. 10)
                  </span>
                </div>
                <textarea
                  required
                  rows={4}
                  placeholder="Décrivez l'appartement, sa proximité avec la Faculté Polydisciplinaire de Selouane ou l'EST, le calme propice aux révisions, les parties communes et les charges incluses..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="rounded-xl p-3 text-xs leading-relaxed focus:outline-none transition-all"
                  style={{
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>

              {viewMode === 'stepper' && (
                <div className="flex justify-end pt-2">
                  <Button
                    type="button"
                    onClick={() => setActiveStep(2)}
                    className="btn-brand text-xs font-semibold text-white shadow-sm flex items-center gap-1.5"
                  >
                    Continuer vers Chambres & Prix <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* ══════════ SECTION 2 : CONFIGURATION DES CHAMBRES & TARIFS ══════════ */}
          {(viewMode === 'full' || activeStep === 2) && (
            <div className="dash-card p-6 flex flex-col gap-5" style={{ backgroundColor: 'var(--bg-card)' }}>
              <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: 'var(--brand-bg)', color: 'var(--brand-primary)' }}
                  >
                    <BedDouble className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
                      2. Nombre de Chambres & Tarification
                    </h2>
                    <p className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                      Fixez le nombre de pièces, le loyer mensuel et les conditions de caution.
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-lg badge-primary">
                  Étape 2/6
                </span>
              </div>

              {/* Loyer et Caution */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Loyer Mensuel */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold flex items-center gap-1.5" style={{ color: 'var(--text-primary)' }}>
                      <Coins className="w-3.5 h-3.5" style={{ color: 'var(--brand-primary)' }} />
                      Loyer mensuel par chambre <span style={{ color: 'var(--error-fg)' }}>*</span>
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      min="100"
                      step="50"
                      required
                      value={priceMonthly}
                      onChange={(e) => setPriceMonthly(Number(e.target.value))}
                      className="w-full rounded-xl px-4 py-2.5 text-xs focus:outline-none transition-all pr-24 font-bold text-sm"
                      style={{
                        backgroundColor: 'var(--bg-subtle)',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--text-primary)',
                      }}
                    />
                    <span
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold px-2 py-0.5 rounded-md"
                      style={{ backgroundColor: 'var(--brand-bg)', color: 'var(--brand-primary)' }}
                    >
                      DH / mois
                    </span>
                  </div>

                  {/* Quick price presets */}
                  <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                    <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Suggestions :</span>
                    {[1200, 1500, 1800, 2200].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => {
                          setPriceMonthly(p);
                          if (depositDh === priceMonthly) setDepositDh(p);
                        }}
                        className="text-[10px] px-2 py-0.5 rounded-md border font-medium transition-all hover:border-cyan-500"
                        style={{
                          backgroundColor: priceMonthly === p ? 'var(--brand-bg)' : 'var(--bg-subtle)',
                          borderColor: priceMonthly === p ? 'var(--brand-primary)' : 'var(--border-subtle)',
                          color: priceMonthly === p ? 'var(--brand-primary)' : 'var(--text-secondary)',
                        }}
                      >
                        {p.toLocaleString('fr-FR')} DH
                      </button>
                    ))}
                  </div>
                </div>

                {/* Caution */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold flex items-center gap-1.5" style={{ color: 'var(--text-primary)' }}>
                      <Wallet className="w-3.5 h-3.5" style={{ color: 'var(--brand-primary)' }} />
                      Dépôt de garantie / Caution
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      step="50"
                      value={depositDh}
                      onChange={(e) => setDepositDh(Number(e.target.value))}
                      className="w-full rounded-xl px-4 py-2.5 text-xs focus:outline-none transition-all pr-14 font-bold text-sm"
                      style={{
                        backgroundColor: 'var(--bg-subtle)',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--text-primary)',
                      }}
                    />
                    <span
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      DH
                    </span>
                  </div>

                  {/* Quick deposit shortcuts */}
                  <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                    <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Raccourci :</span>
                    <button
                      type="button"
                      onClick={() => setDepositDh(priceMonthly)}
                      className="text-[10px] px-2 py-0.5 rounded-md border font-medium transition-all hover:border-cyan-500"
                      style={{
                        backgroundColor: depositDh === priceMonthly ? 'var(--brand-bg)' : 'var(--bg-subtle)',
                        borderColor: depositDh === priceMonthly ? 'var(--brand-primary)' : 'var(--border-subtle)',
                        color: depositDh === priceMonthly ? 'var(--brand-primary)' : 'var(--text-secondary)',
                      }}
                    >
                      1 mois ({priceMonthly.toLocaleString('fr-FR')} DH)
                    </button>
                    <button
                      type="button"
                      onClick={() => setDepositDh(0)}
                      className="text-[10px] px-2 py-0.5 rounded-md border font-medium transition-all hover:border-cyan-500"
                      style={{
                        backgroundColor: depositDh === 0 ? 'var(--brand-bg)' : 'var(--bg-subtle)',
                        borderColor: depositDh === 0 ? 'var(--brand-primary)' : 'var(--border-subtle)',
                        color: depositDh === 0 ? 'var(--brand-primary)' : 'var(--text-secondary)',
                      }}
                    >
                      Sans caution
                    </button>
                  </div>
                </div>
              </div>

              {/* Nombre de Chambres & Disponibilités */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                {/* Total Chambres */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Nombre total de chambres dans le bien <span style={{ color: 'var(--error-fg)' }}>*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => {
                          setTotalRooms(num);
                          if (availableRooms > num) setAvailableRooms(num);
                        }}
                        className="flex-1 py-2 rounded-xl text-xs font-bold border transition-all"
                        style={{
                          backgroundColor: totalRooms === num ? 'var(--brand-bg)' : 'var(--bg-subtle)',
                          borderColor: totalRooms === num ? 'var(--brand-primary)' : 'var(--border-subtle)',
                          color: totalRooms === num ? 'var(--brand-primary)' : 'var(--text-secondary)',
                        }}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Chambres Disponibles */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Chambres actuellement disponibles à la réservation
                  </label>
                  <select
                    value={availableRooms}
                    onChange={(e) => setAvailableRooms(Number(e.target.value))}
                    className="rounded-xl px-4 py-2.5 text-xs focus:outline-none transition-all cursor-pointer font-bold"
                    style={{
                      backgroundColor: 'var(--bg-subtle)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    {Array.from({ length: totalRooms + 1 }, (_, i) => i).map((n) => (
                      <option key={n} value={n}>
                        {n} chambre{n > 1 ? 's' : ''} disponible{n > 1 ? 's' : ''} sur {totalRooms} {n === 0 ? '(Complet)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Type de chambre par défaut et charges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Type de chambre standard
                  </label>
                  <select
                    value={roomTypeDefault}
                    onChange={(e) => setRoomTypeDefault(e.target.value as any)}
                    className="rounded-xl px-4 py-2.5 text-xs focus:outline-none transition-all cursor-pointer font-medium"
                    style={{
                      backgroundColor: 'var(--bg-subtle)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    <option value="PRIVATE">Chambre individuelle privée</option>
                    <option value="SHARED">Chambre partagée (lits séparés)</option>
                    <option value="STUDIO">Studio complet indépendant</option>
                  </select>
                </div>

                <div className="flex flex-col justify-center gap-2 pt-2 sm:pt-4">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                    <input
                      type="checkbox"
                      checked={waterElecIncluded}
                      onChange={(e) => setWaterElecIncluded(e.target.checked)}
                      className="w-4 h-4 rounded cursor-pointer"
                      style={{ accentColor: 'var(--brand-primary)' }}
                    />
                    <span>Charges comprises (Eau, Électricité & WiFi inclus)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                    <input
                      type="checkbox"
                      checked={autoCreateRooms}
                      onChange={(e) => setAutoCreateRooms(e.target.checked)}
                      className="w-4 h-4 rounded cursor-pointer"
                      style={{ accentColor: 'var(--brand-primary)' }}
                    />
                    <span>Générer automatiquement les {totalRooms} chambres individuelles</span>
                  </label>
                </div>
              </div>

              {/* Auto Creation Helper Summary Box */}
              {autoCreateRooms && totalRooms > 0 && (
                <div
                  className="p-3.5 rounded-xl border text-xs flex items-start gap-3"
                  style={{
                    backgroundColor: 'var(--brand-bg)',
                    borderColor: 'var(--brand-bg-strong)',
                    color: 'var(--text-primary)',
                  }}
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'var(--brand-primary)' }} />
                  <div className="text-[11px] leading-relaxed">
                    <span className="font-bold block" style={{ color: 'var(--brand-primary)' }}>
                      Génération automatique prête :
                    </span>
                    À la création du logement, <span className="font-bold">{totalRooms} chambre{totalRooms > 1 ? 's' : ''}</span> ({availableRooms} libre{availableRooms > 1 ? 's' : ''}) à <span className="font-bold">{priceMonthly.toLocaleString('fr-FR')} DH/mois</span> seront instantanément créées et rattachées à cette adresse. Vous pourrez modifier le détail de chaque pièce sur la page suivante.
                  </div>
                </div>
              )}

              {viewMode === 'stepper' && (
                <div className="flex items-center justify-between pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActiveStep(1)}
                    className="dash-card text-xs font-medium"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    ← Retour
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setActiveStep(3)}
                    className="btn-brand text-xs font-semibold text-white shadow-sm flex items-center gap-1.5"
                  >
                    Continuer vers Localisation <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* ══════════ SECTION 3 : LOCALISATION & GPS ══════════ */}
          {(viewMode === 'full' || activeStep === 3) && (
            <div className="dash-card p-6 flex flex-col gap-5" style={{ backgroundColor: 'var(--bg-card)' }}>
              <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: 'var(--brand-bg)', color: 'var(--brand-primary)' }}
                  >
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
                      3. Emplacement & Proximité Campus
                    </h2>
                    <p className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                      Assurez un repérage précis sur la carte pour les étudiants venant d'autres villes.
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-lg badge-primary">
                  Étape 3/6
                </span>
              </div>

              {/* City and Neighborhood */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Ville desservie <span style={{ color: 'var(--error-fg)' }}>*</span>
                  </label>
                  <select
                    value={cityId}
                    onChange={(e) => setCityId(e.target.value)}
                    className="rounded-xl px-4 py-2.5 text-xs focus:outline-none transition-all cursor-pointer font-medium"
                    style={{
                      backgroundColor: 'var(--bg-subtle)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    {cities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name} ({city.region || 'Maroc'})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Quartier / Secteur <span style={{ color: 'var(--error-fg)' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Hay Al Omrane, Près Faculté"
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    className="rounded-xl px-4 py-2.5 text-xs focus:outline-none transition-all font-medium"
                    style={{
                      backgroundColor: 'var(--bg-subtle)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                    }}
                  />
                </div>
              </div>

              {/* Address */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Adresse exacte ou repère public
                </label>
                <input
                  type="text"
                  placeholder="ex: Boulevard Hassan II, Immeuble 5, à 300m de l'entrée FSN"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="rounded-xl px-4 py-2.5 text-xs focus:outline-none transition-all"
                  style={{
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>

              {/* Quick Presets for University Zones */}
              <div className="flex flex-col gap-2 pt-2">
                <label className="text-xs font-semibold flex items-center gap-1.5" style={{ color: 'var(--text-primary)' }}>
                  <Compass className="w-3.5 h-3.5" style={{ color: 'var(--brand-primary)' }} />
                  Repères Universitaires Rapides (Selouane / Nador) :
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {GPS_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleApplyPreset(preset)}
                      className="dash-card p-2.5 rounded-xl text-left flex items-center justify-between text-xs transition-all hover:border-cyan-500"
                      style={{ backgroundColor: 'var(--bg-subtle)' }}
                    >
                      <div>
                        <div className="font-bold text-[11px]" style={{ color: 'var(--text-primary)' }}>
                          {preset.name}
                        </div>
                        <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                          {preset.zone} · {preset.lat}, {preset.lng}
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold" style={{ color: 'var(--brand-primary)' }}>
                        Appliquer
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* GPS Coordinates */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Latitude GPS</label>
                  <input
                    type="text"
                    value={locationLat}
                    onChange={(e) => setLocationLat(e.target.value)}
                    className="rounded-xl px-4 py-2 text-xs font-mono focus:outline-none"
                    style={{
                      backgroundColor: 'var(--bg-subtle)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                    }}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Longitude GPS</label>
                  <input
                    type="text"
                    value={locationLng}
                    onChange={(e) => setLocationLng(e.target.value)}
                    className="rounded-xl px-4 py-2 text-xs font-mono focus:outline-none"
                    style={{
                      backgroundColor: 'var(--bg-subtle)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                    }}
                  />
                </div>
              </div>

              {viewMode === 'stepper' && (
                <div className="flex items-center justify-between pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActiveStep(2)}
                    className="dash-card text-xs font-medium"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    ← Retour
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setActiveStep(4)}
                    className="btn-brand text-xs font-semibold text-white shadow-sm flex items-center gap-1.5"
                  >
                    Continuer vers Équipements <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* ══════════ SECTION 4 : ÉQUIPEMENTS & SERVICES ══════════ */}
          {(viewMode === 'full' || activeStep === 4) && (
            <div className="dash-card p-6 flex flex-col gap-5" style={{ backgroundColor: 'var(--bg-card)' }}>
              <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: 'var(--brand-bg)', color: 'var(--brand-primary)' }}
                  >
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
                      4. Équipements & Commodités Inclus
                    </h2>
                    <p className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                      Les commodités (WiFi haut débit, bureau, cuisine équipée) sont les critères n°1 des étudiants.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSelectAllAmenities}
                    className="text-[11px] font-semibold underline"
                    style={{ color: 'var(--brand-primary)' }}
                  >
                    {selectedAmenityIds.length === amenitiesList.length ? 'Tout désélectionner' : 'Tout sélectionner'}
                  </button>
                  <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-lg badge-primary">
                    Étape 4/6
                  </span>
                </div>
              </div>

              {/* Amenities Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {amenitiesList.map((amenity) => {
                  const isChecked = selectedAmenityIds.includes(amenity.id);

                  return (
                    <button
                      key={amenity.id}
                      type="button"
                      onClick={() => handleToggleAmenity(amenity.id)}
                      className="p-3 rounded-xl border text-xs font-semibold text-left flex items-center justify-between transition-all"
                      style={{
                        backgroundColor: isChecked ? 'var(--brand-bg)' : 'var(--bg-subtle)',
                        borderColor: isChecked ? 'var(--brand-primary)' : 'var(--border-subtle)',
                        color: isChecked ? 'var(--brand-primary)' : 'var(--text-secondary)',
                      }}
                    >
                      <span className="truncate">{amenity.name}</span>
                      {isChecked && (
                        <Check className="w-4 h-4 shrink-0 ml-1.5" style={{ color: 'var(--brand-primary)' }} />
                      )}
                    </button>
                  );
                })}
              </div>

              {viewMode === 'stepper' && (
                <div className="flex items-center justify-between pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActiveStep(3)}
                    className="dash-card text-xs font-medium"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    ← Retour
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setActiveStep(5)}
                    className="btn-brand text-xs font-semibold text-white shadow-sm flex items-center gap-1.5"
                  >
                    Continuer vers Photos <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* ══════════ SECTION 5 : PHOTOS & GALERIE ══════════ */}
          {(viewMode === 'full' || activeStep === 5) && (
            <div className="dash-card p-6 flex flex-col gap-5" style={{ backgroundColor: 'var(--bg-card)' }}>
              <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: 'var(--brand-bg)', color: 'var(--brand-primary)' }}
                  >
                    <ImageIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
                      5. Galerie Photos Haute Définition
                    </h2>
                    <p className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                      Importez vos visuels locaux, choisissez depuis le catalogue StudRoom ou collez une URL.
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-lg badge-primary">
                  Étape 5/6
                </span>
              </div>

              {/* Image Picker */}
              <ImageSourcePicker onImageSelected={(url) => handleAddImage(url)} />

              {/* Gallery Grid */}
              {images.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
                  {images.map((imgUrl, index) => {
                    const isPrimary = index === 0;

                    return (
                      <div
                        key={index}
                        className="relative rounded-xl overflow-hidden border flex flex-col group transition-all"
                        style={{
                          borderColor: isPrimary ? 'var(--brand-primary)' : 'var(--border-subtle)',
                          backgroundColor: 'var(--bg-subtle)',
                          boxShadow: isPrimary ? '0 0 0 1px var(--brand-primary)' : undefined,
                        }}
                      >
                        <div className="w-full aspect-[4/3] relative">
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
                            <span
                              className="absolute top-2 left-2 px-2 py-0.5 rounded-lg text-white font-bold text-[10px] flex items-center gap-1 shadow-sm"
                              style={{ backgroundColor: 'var(--brand-primary)' }}
                            >
                              <Star className="w-3 h-3 fill-white" />
                              Couverture
                            </span>
                          )}
                        </div>

                        <div
                          className="p-2 flex items-center justify-between border-t"
                          style={{
                            borderColor: 'var(--border-subtle)',
                            backgroundColor: 'var(--bg-card)',
                          }}
                        >
                          {!isPrimary ? (
                            <button
                              type="button"
                              onClick={() => handleSetPrimary(index)}
                              className="text-[10px] font-medium flex items-center gap-1 transition"
                              style={{ color: 'var(--text-secondary)' }}
                            >
                              <Star className="w-3 h-3" />
                              Mettre en 1ère
                            </button>
                          ) : (
                            <span className="text-[10px] font-bold" style={{ color: 'var(--brand-primary)' }}>
                              Principale
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="p-1 transition text-slate-400 hover:text-rose-500"
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
                <div
                  className="p-6 rounded-xl border border-dashed text-center text-xs"
                  style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}
                >
                  Aucune photo configurée. Ajoutez au moins une photo pour le catalogue étudiant.
                </div>
              )}

              {viewMode === 'stepper' && (
                <div className="flex items-center justify-between pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActiveStep(4)}
                    className="dash-card text-xs font-medium"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    ← Retour
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setActiveStep(6)}
                    className="btn-brand text-xs font-semibold text-white shadow-sm flex items-center gap-1.5"
                  >
                    Continuer vers Publication <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* ══════════ SECTION 6 : STATUT & PUBLICATION ══════════ */}
          {(viewMode === 'full' || activeStep === 6) && (
            <div className="dash-card p-6 flex flex-col gap-5" style={{ backgroundColor: 'var(--bg-card)' }}>
              <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: 'var(--brand-bg)', color: 'var(--brand-primary)' }}
                  >
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
                      6. Visibilité & Lancement
                    </h2>
                    <p className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                      Choisissez quand rendre le logement visible aux étudiants.
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-lg badge-primary">
                  Étape 6/6
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Statut de publication</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="rounded-xl px-4 py-2.5 text-xs focus:outline-none transition-all cursor-pointer font-medium"
                    style={{
                      backgroundColor: 'var(--bg-subtle)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    <option value="AVAILABLE">En ligne — Visible et réservable</option>
                    <option value="DRAFT">Brouillon — Masqué des étudiants</option>
                    <option value="UNDER_REVIEW">En révision interne</option>
                  </select>
                </div>

                <div className="flex items-center gap-3 pt-6">
                  <input
                    type="checkbox"
                    id="featuredCheck"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-4 h-4 rounded cursor-pointer"
                    style={{ accentColor: 'var(--brand-primary)' }}
                  />
                  <label
                    htmlFor="featuredCheck"
                    className="text-xs font-semibold cursor-pointer"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    Mettre en avant sur la page d'accueil (Badge "Coup de Cœur")
                  </label>
                </div>
              </div>

              {/* Next step hint */}
              <div
                className="p-3.5 rounded-xl border text-xs flex items-start gap-3"
                style={{
                  backgroundColor: 'var(--brand-bg)',
                  borderColor: 'var(--brand-bg-strong)',
                  color: 'var(--text-primary)',
                }}
              >
                <Zap className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'var(--brand-primary)' }} />
                <div className="text-[11px] leading-relaxed">
                  <span className="font-bold block" style={{ color: 'var(--brand-primary)' }}>
                    Création complète avec chambres :
                  </span>
                  Le logement sera enregistré avec son loyer indicatif de <span className="font-bold">{priceMonthly.toLocaleString('fr-FR')} DH</span> et ses <span className="font-bold">{totalRooms} chambres</span> ({availableRooms} disponibles). Vous pourrez ensuite affiner les équipements spécifiques de chaque chambre si nécessaire.
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                {viewMode === 'stepper' ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActiveStep(5)}
                    className="dash-card text-xs font-medium"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    ← Retour
                  </Button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-2">
                  <Link href="/dashboard/logements">
                    <Button
                      variant="outline"
                      type="button"
                      className="dash-card text-xs font-medium"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      Annuler
                    </Button>
                  </Link>
                  <Button
                    type="button"
                    onClick={() => handleSubmit()}
                    disabled={submitting}
                    className="btn-brand font-semibold text-white shadow-md text-xs min-w-[200px] flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Création du logement…
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Créer le logement & les chambres
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Live Student Preview Column (4 Cols Sticky) ── */}
        <div className="lg:col-span-4 sticky top-24 flex flex-col gap-4">
          <div
            className="dash-card p-4 rounded-2xl border"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
          >
            <div className="flex items-center justify-between pb-3 border-b mb-3" style={{ borderColor: 'var(--border-subtle)' }}>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" style={{ color: 'var(--brand-primary)' }} />
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
                  Aperçu Étudiant en Direct
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full badge-success font-semibold">
                Temps Réel
              </span>
            </div>

            {/* Quality Score Meter */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span style={{ color: 'var(--text-secondary)' }}>Qualité de la fiche :</span>
                <span className="font-bold font-mono" style={{ color: 'var(--brand-primary)' }}>
                  {completeness}%
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-subtle)' }}>
                <div
                  className="h-full transition-all duration-300"
                  style={{
                    width: `${completeness}%`,
                    backgroundColor: completeness >= 80 ? 'var(--color-emerald-500)' : 'var(--brand-primary)',
                  }}
                />
              </div>
            </div>

            {/* Simulated Marketplace Card */}
            <div
              className="rounded-2xl overflow-hidden border transition-all shadow-sm"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-subtle)',
              }}
            >
              {/* Card Photo Cover */}
              <div className="relative w-full aspect-[16/10] overflow-hidden" style={{ backgroundColor: 'var(--bg-subtle)' }}>
                <img
                  src={images[0] || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800'}
                  alt="Aperçu"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span
                    className="px-2 py-0.5 rounded-lg text-[10px] font-bold text-white shadow-sm"
                    style={{ backgroundColor: status === 'AVAILABLE' ? 'var(--color-emerald-500)' : '#64748B' }}
                  >
                    {status === 'AVAILABLE' ? 'Disponible' : 'Brouillon'}
                  </span>
                  {featured && (
                    <span
                      className="px-2 py-0.5 rounded-lg text-[10px] font-bold text-white shadow-sm flex items-center gap-1"
                      style={{ backgroundColor: 'var(--brand-primary)' }}
                    >
                      <Star className="w-2.5 h-2.5 fill-white" /> Coup de cœur
                    </span>
                  )}
                </div>

                <div className="absolute bottom-2.5 right-2.5">
                  <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-black/75 text-white backdrop-blur-sm">
                    {surfaceSqm} m²
                  </span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-3.5 flex flex-col gap-2">
                <div className="flex items-center gap-1.5 text-[11px]" style={{ color: 'var(--brand-primary)' }}>
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span className="font-semibold truncate">
                    {neighborhood || 'Quartier non renseigné'}, {selectedCityName}
                  </span>
                </div>

                <h3 className="text-sm font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                  {title || 'Titre du logement en cours...'}
                </h3>

                <p className="text-[11px] line-clamp-2 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {description || 'La description apparaîtra ici telle que les étudiants la liront sur le portail...'}
                </p>

                {/* Pricing & Rooms Badge Preview */}
                <div
                  className="pt-2.5 pb-1 border-t flex items-baseline justify-between"
                  style={{ borderColor: 'var(--border-subtle)' }}
                >
                  <div>
                    <span className="text-base font-bold" style={{ color: 'var(--brand-primary)' }}>
                      {priceMonthly > 0 ? `${priceMonthly.toLocaleString('fr-FR')} DH` : 'Prix à fixer'}
                    </span>
                    <span className="text-[10px] ml-1 font-medium" style={{ color: 'var(--text-muted)' }}>
                      / mois
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold" style={{ color: 'var(--text-secondary)' }}>
                    <BedDouble className="w-3.5 h-3.5" style={{ color: 'var(--brand-primary)' }} />
                    <span>
                      {availableRooms}/{totalRooms} libre{totalRooms > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                {/* Additional Pricing Badges */}
                <div className="flex items-center gap-2 text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>
                  <span>Caution : {depositDh > 0 ? `${depositDh.toLocaleString('fr-FR')} DH` : 'Sans caution'}</span>
                  {waterElecIncluded && (
                    <>
                      <span>•</span>
                      <span className="text-emerald-600 font-semibold">Charges incluses</span>
                    </>
                  )}
                </div>

                {/* Amenities Badges Preview */}
                <div className="pt-2 border-t flex flex-wrap items-center gap-1.5" style={{ borderColor: 'var(--border-subtle)' }}>
                  {selectedAmenityIds.slice(0, 3).map((id) => {
                    const am = amenitiesList.find((a) => a.id === id);
                    if (!am) return null;
                    return (
                      <span
                        key={id}
                        className="text-[10px] px-2 py-0.5 rounded-md font-medium"
                        style={{
                          backgroundColor: 'var(--bg-subtle)',
                          color: 'var(--text-secondary)',
                          border: '1px solid var(--border-subtle)',
                        }}
                      >
                        {am.name}
                      </span>
                    );
                  })}
                  {selectedAmenityIds.length > 3 && (
                    <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                      +{selectedAmenityIds.length - 3} autres
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="mt-4 pt-3 border-t text-[11px] space-y-1.5" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}>
              <div className="flex items-center gap-1.5 font-bold" style={{ color: 'var(--brand-primary)' }}>
                <CheckCircle2 className="w-3.5 h-3.5" />
                Conseils StudRoom :
              </div>
              <p>• Mentionnez le temps de marche jusqu'à la FSN ou l'EST.</p>
              <p>• Les logements avec au moins 3 photos reçoivent 3x plus de réservations.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
