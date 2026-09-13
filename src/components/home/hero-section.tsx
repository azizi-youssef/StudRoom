'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, MapPin, GraduationCap, Coins, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DbUniversity } from '@/shared/types/database';
import { PropertyDetail } from '@/shared/types';

// ─── Budget slider config ──────────────────────────────────────────────────
const BUDGET_MIN = 800;
const BUDGET_MAX = 4000;
const BUDGET_STEP = 100;

function formatBudget(value: number): string {
  if (value >= BUDGET_MAX) return 'Sans limite';
  return `${value.toLocaleString('fr-MA')} DH/mois`;
}

// ─── Props ────────────────────────────────────────────────────────────────
interface HeroSectionProps {
  universities: DbUniversity[];
  featuredProperty?: PropertyDetail | null;
}

export function HeroSection({ universities, featuredProperty }: HeroSectionProps) {
  const router = useRouter();
  const [selectedUniversity, setSelectedUniversity] = useState('all');
  const [budgetMax, setBudgetMax] = useState(BUDGET_MAX); // BUDGET_MAX = no limit
  const [propertyCategory, setPropertyCategory] = useState<'all' | 'studio' | 'shared'>('all');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedUniversity !== 'all') params.append('university', selectedUniversity);
    if (budgetMax < BUDGET_MAX) params.append('maxPrice', String(budgetMax));
    if (propertyCategory === 'studio') params.append('propertyType', 'STUDIO');
    if (propertyCategory === 'shared') params.append('propertyType', 'APARTMENT');
    params.append('city', 'selouane');
    router.push(`/logements?${params.toString()}`);
  };

  // ─── Derived data for floating property card ─────────────────────────────
  const cardTitle = featuredProperty?.title ?? 'Résidence Al Omrane 01';
  const cardPrice = featuredProperty?.min_price_dh ?? 1500;
  const cardRooms = featuredProperty
    ? `${featuredProperty.available_rooms} chambre${featuredProperty.available_rooms > 1 ? 's' : ''} disponible${featuredProperty.available_rooms > 1 ? 's' : ''}`
    : 'Chambres meublées & calmes';
  const cardSlug = featuredProperty?.slug ?? null;

  // Proximity label from first proximity entry
  const proximityLabel = featuredProperty?.proximities?.[0]
    ? `${featuredProperty.proximities[0].walking_time_min} min à pied · ${featuredProperty.proximities[0].university?.short_name ?? 'Campus'}`
    : '5 min à pied FPN / EST';

  return (
    <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-28 overflow-hidden bg-mesh-light dark:bg-mesh-dark">
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary-200/40 dark:bg-primary-900/20 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-4 w-[450px] h-[450px] bg-accent-orange/10 dark:bg-accent-orange/5 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-[350px] h-[350px] bg-emerald-100/40 dark:bg-emerald-950/20 rounded-full blur-[90px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* Left Column: Text & Search Widget */}
          <div className="lg:col-span-7 flex flex-col gap-6 text-center lg:text-left">

            {/* Top Badge */}
            <div className="inline-flex items-center justify-center lg:justify-start">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-white/90 dark:bg-slate-900/90 text-primary-700 dark:text-primary-300 border border-primary-200/80 dark:border-primary-800/80 shadow-soft backdrop-blur-sm">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping motion-reduce:animate-none absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-600"></span>
                </span>
                La référence étudiante · Selouane &amp; Nador
              </span>
            </div>

            {/* Main Headline */}
            <div className="flex flex-col gap-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.12]">
                Trouve ton logement étudiant <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-primary-600 via-primary-500 to-accent-teal bg-clip-text text-transparent">
                  clé en main &amp; sans stress.
                </span>
              </h1>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl mx-auto lg:mx-0 font-normal">
                Studios et appartements meublés, ultra-connectés avec Wi-Fi Fibre, situés à quelques minutes à pied de la FPN, EST et ISTA.
              </p>
            </div>

            {/* Modern Search Capsule */}
            <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-3 sm:p-5 rounded-4xl shadow-premium border border-slate-200/80 dark:border-slate-800 mt-2">

              {/* Type Category Tabs */}
              <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-100/90 dark:border-slate-800 text-xs font-bold">
                {(['all', 'studio', 'shared'] as const).map((cat) => {
                  const labels = { all: 'Tous les logements', studio: 'Studios privés', shared: 'Colocations meublées' };
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setPropertyCategory(cat)}
                      className={`px-3.5 py-1.5 rounded-full transition-all ${
                        propertyCategory === cat
                          ? 'bg-primary-600 text-white shadow-soft'
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {labels[cat]}
                    </button>
                  );
                })}
              </div>

              <form onSubmit={handleSearch} className="flex flex-col gap-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">

                  {/* Field 1: Localisation (static) */}
                  <div className="flex flex-col gap-1 p-3 bg-slate-50/80 dark:bg-slate-800/70 rounded-2xl border border-slate-100 dark:border-slate-700/80">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-400 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
                      Localisation
                    </label>
                    <span className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      Selouane / Al Omrane
                    </span>
                  </div>

                  {/* Field 2: Université */}
                  <div className="flex flex-col gap-1 p-3 bg-slate-50/80 dark:bg-slate-800/70 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/80 transition-colors">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-400 flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
                      Campus cible
                    </label>
                    <select
                      value={selectedUniversity}
                      onChange={(e) => setSelectedUniversity(e.target.value)}
                      className="bg-transparent text-sm font-bold text-slate-900 dark:text-white focus:outline-none cursor-pointer truncate"
                    >
                      <option value="all" className="dark:bg-slate-900">Tous les campus</option>
                      {universities.map((u) => (
                        <option key={u.id} value={u.id} className="dark:bg-slate-900">
                          {u.short_name} — {u.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Field 3: Budget — Range Slider */}
                  <div className="flex flex-col gap-1.5 p-3 bg-slate-50/80 dark:bg-slate-800/70 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/80 transition-colors">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-400 flex items-center gap-1.5">
                        <Coins className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
                        Budget max
                      </label>
                      <span className="text-[10px] font-black text-primary-600 dark:text-primary-400 tabular-nums">
                        {formatBudget(budgetMax)}
                      </span>
                    </div>
                    {/* Slider */}
                    <input
                      type="range"
                      min={BUDGET_MIN}
                      max={BUDGET_MAX}
                      step={BUDGET_STEP}
                      value={budgetMax}
                      onChange={(e) => setBudgetMax(Number(e.target.value))}
                      style={{
                        ['--range-fill' as string]: `${((budgetMax - BUDGET_MIN) / (BUDGET_MAX - BUDGET_MIN)) * 100}%`,
                      }}
                      className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                      aria-label="Budget maximum mensuel"
                    />
                    {/* Ticks labels */}
                    <div className="flex justify-between text-[9px] text-slate-400 font-semibold px-0.5">
                      <span>800</span>
                      <span>2 000</span>
                      <span>4 000+</span>
                    </div>
                  </div>
                </div>

                {/* Submit CTA */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full justify-center text-sm font-black py-4 rounded-2xl shadow-glow-primary hover:scale-[1.01] transition-transform"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Rechercher mon logement idéal
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </form>
            </div>

            {/* Micro Highlights & Trust Proof */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 pt-1 text-xs font-bold text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                0 DH frais d&apos;agence
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Bail étudiant officiel
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Assistance &amp; Wi-Fi 7j/7
              </span>
            </div>
          </div>

          {/* Right Column: Visual PropTech Showcase */}
          <div className="lg:col-span-5 relative mt-4 lg:mt-0">
            {/* Ambient Background Behind Image */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary-500 to-accent-orange rounded-4xl blur-2xl opacity-20 -rotate-2 scale-95 pointer-events-none" />

            <div className="relative rounded-4xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/3] sm:aspect-[4/4.5] lg:aspect-[4/5] group bg-slate-100">
              <Image
                src="/images/studroom_facultaire.jpg"
                alt="Appartement étudiant meublé StudRoom Selouane"
                fill
                priority
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

              {/* Floating Badge 1: Wi-Fi Fibre & Work Desk (Top Right) */}
              <div className="absolute top-5 right-5 glass-card px-3.5 py-2 rounded-2xl shadow-lg border border-white/70 flex items-center gap-2 animate-float-slow motion-reduce:animate-none">
                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping motion-reduce:animate-none" />
                <div className="text-left">
                  <div className="text-[11px] font-black text-slate-900 leading-tight">⚡ Wi-Fi Fibre 100M</div>
                  <div className="text-[9px] font-semibold text-slate-500">Bureau &amp; Chaise ergonomique</div>
                </div>
              </div>

              {/* Floating Badge 2: Campus Proximity (Top Left) — dynamic */}
              <div className="absolute top-5 left-5 bg-slate-900/85 backdrop-blur-md text-white px-3 py-1.5 rounded-2xl text-[11px] font-bold flex items-center gap-1.5 border border-white/20 shadow-md">
                <GraduationCap className="w-3.5 h-3.5 text-primary-400" />
                <span>{proximityLabel}</span>
              </div>

              {/* Bottom Featured Property Capsule — dynamic data */}
              {cardSlug ? (
                <Link
                  href={`/logements/${cardSlug}`}
                  className="absolute bottom-5 left-5 right-5 glass-card p-4 rounded-3xl border border-white/80 shadow-xl flex items-center justify-between gap-3 hover:border-primary-300 transition-colors group/card"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-amber-500 text-xs">★★★★★</span>
                      <span className="text-[11px] font-black text-slate-800">Certifié StudRoom</span>
                    </div>
                    <h4 className="text-sm font-black text-slate-900 mt-0.5 truncate">{cardTitle}</h4>
                    <p className="text-[11px] text-slate-500 font-medium">{cardRooms}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Dès</span>
                    <div className="bg-primary-600 text-white font-black text-xs px-3 py-1.5 rounded-xl shadow-xs whitespace-nowrap">
                      {cardPrice.toLocaleString('fr-MA')} DH<span className="text-[9px] font-normal">/m</span>
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="absolute bottom-5 left-5 right-5 glass-card p-4 rounded-3xl border border-white/80 shadow-xl flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-amber-500 text-xs">★★★★★</span>
                      <span className="text-[11px] font-black text-slate-800">Certifié StudRoom</span>
                    </div>
                    <h4 className="text-sm font-black text-slate-900 mt-0.5 truncate">{cardTitle}</h4>
                    <p className="text-[11px] text-slate-500 font-medium">{cardRooms}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Dès</span>
                    <div className="bg-primary-600 text-white font-black text-xs px-3 py-1.5 rounded-xl shadow-xs whitespace-nowrap">
                      {cardPrice.toLocaleString('fr-MA')} DH<span className="text-[9px] font-normal">/m</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
