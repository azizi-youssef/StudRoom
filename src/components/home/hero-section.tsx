'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search, MapPin, GraduationCap, Coins, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DbUniversity } from '@/shared/types/database';

interface HeroSectionProps {
  universities: DbUniversity[];
}

export function HeroSection({ universities }: HeroSectionProps) {
  const router = useRouter();
  const [selectedUniversity, setSelectedUniversity] = useState('all');
  const [selectedBudget, setSelectedBudget] = useState('0');
  const [propertyCategory, setPropertyCategory] = useState<'all' | 'studio' | 'shared'>('all');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedUniversity !== 'all') params.append('university', selectedUniversity);
    if (selectedBudget !== '0') params.append('maxPrice', selectedBudget);
    if (propertyCategory === 'studio') params.append('propertyType', 'STUDIO');
    if (propertyCategory === 'shared') params.append('propertyType', 'APARTMENT');
    params.append('city', 'selouane');
    router.push(`/logements?${params.toString()}`);
  };

  return (
    <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-28 overflow-hidden bg-mesh-light dark:bg-mesh-dark">
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-brand-200/40 dark:bg-brand-900/20 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-4 w-[450px] h-[450px] bg-accent-orange/10 dark:bg-accent-orange/5 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-[350px] h-[350px] bg-emerald-100/40 dark:bg-emerald-950/20 rounded-full blur-[90px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Text & Search Widget */}
          <div className="lg:col-span-7 flex flex-col gap-6 text-center lg:text-left">
            
            {/* Top Badge */}
            <div className="inline-flex items-center justify-center lg:justify-start">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-white/90 dark:bg-slate-900/90 text-brand-700 dark:text-brand-300 border border-brand-200/80 dark:border-brand-800/80 shadow-soft backdrop-blur-sm">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-600"></span>
                </span>
                La référence étudiante · Selouane & Nador
              </span>
            </div>

            {/* Main Headline */}
            <div className="flex flex-col gap-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.12]">
                Trouve ton logement étudiant <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-accent-teal bg-clip-text text-transparent">
                  clé en main & sans stress.
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
                <button
                  type="button"
                  onClick={() => setPropertyCategory('all')}
                  className={`px-3.5 py-1.5 rounded-full transition-all ${
                    propertyCategory === 'all'
                      ? 'bg-brand-600 text-white shadow-soft'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  Tous les logements
                </button>
                <button
                  type="button"
                  onClick={() => setPropertyCategory('studio')}
                  className={`px-3.5 py-1.5 rounded-full transition-all ${
                    propertyCategory === 'studio'
                      ? 'bg-brand-600 text-white shadow-soft'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  Studios privés
                </button>
                <button
                  type="button"
                  onClick={() => setPropertyCategory('shared')}
                  className={`px-3.5 py-1.5 rounded-full transition-all ${
                    propertyCategory === 'shared'
                      ? 'bg-brand-600 text-white shadow-soft'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  Colocations meublées
                </button>
              </div>

              <form onSubmit={handleSearch} className="flex flex-col gap-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  
                  {/* Field 1: Localisation */}
                  <div className="flex flex-col gap-1 p-3 bg-slate-50/80 dark:bg-slate-800/70 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/80 transition-colors">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-400 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                      Localisation
                    </label>
                    <span className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      Selouane / Al Omrane
                    </span>
                  </div>

                  {/* Field 2: Université */}
                  <div className="flex flex-col gap-1 p-3 bg-slate-50/80 dark:bg-slate-800/70 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/80 transition-colors">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-400 flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
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

                  {/* Field 3: Budget */}
                  <div className="flex flex-col gap-1 p-3 bg-slate-50/80 dark:bg-slate-800/70 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/80 transition-colors">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-400 flex items-center gap-1.5">
                      <Coins className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                      Budget max
                    </label>
                    <select
                      value={selectedBudget}
                      onChange={(e) => setSelectedBudget(e.target.value)}
                      className="bg-transparent text-sm font-bold text-slate-900 dark:text-white focus:outline-none cursor-pointer"
                    >
                      <option value="0" className="dark:bg-slate-900">Tous les budgets</option>
                      <option value="1500" className="dark:bg-slate-900">Jusqu'à 1 500 DH/mois</option>
                      <option value="1800" className="dark:bg-slate-900">Jusqu'à 1 800 DH/mois</option>
                      <option value="2500" className="dark:bg-slate-900">Jusqu'à 2 500 DH/mois</option>
                      <option value="3500" className="dark:bg-slate-900">Jusqu'à 3 500 DH/mois</option>
                    </select>
                  </div>
                </div>

                {/* Submit CTA */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full justify-center text-sm font-black py-4 rounded-2xl shadow-glow-brand hover:scale-[1.01] transition-transform"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Rechercher mon logement idéal
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </form>
            </div>

            {/* Micro Highlights & Trust Proof */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 pt-1 text-xs font-bold text-slate-600">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                0 DH frais d'agence
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Bail étudiant officiel
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Assistance & Wi-Fi 7j/7
              </span>
            </div>
          </div>

          {/* Right Column: High Quality Visual PropTech Showcase */}
          <div className="lg:col-span-5 relative mt-4 lg:mt-0">
            {/* Ambient Background Behind Image */}
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-500 to-accent-orange rounded-4xl blur-2xl opacity-20 -rotate-2 scale-95 pointer-events-none" />

            <div className="relative rounded-4xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/3] sm:aspect-[4/4.5] lg:aspect-[4/5] group bg-slate-100">
              <Image
                src="/images/studroom_hero.jpg"
                alt="Appartement étudiant meublé StudRoom Selouane"
                fill
                priority
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
              
              {/* Floating Badge 1: Wi-Fi Fibre & Work Desk (Top Right) */}
              <div className="absolute top-5 right-5 glass-card px-3.5 py-2 rounded-2xl shadow-lg border border-white/70 flex items-center gap-2 animate-float-slow">
                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
                <div className="text-left">
                  <div className="text-[11px] font-black text-slate-900 leading-tight">⚡ Wi-Fi Fibre 100M</div>
                  <div className="text-[9px] font-semibold text-slate-500">Bureau & Chaise ergonomique</div>
                </div>
              </div>

              {/* Floating Badge 2: Campus Proximity (Top Left) */}
              <div className="absolute top-5 left-5 bg-slate-900/85 backdrop-blur-md text-white px-3 py-1.5 rounded-2xl text-[11px] font-bold flex items-center gap-1.5 border border-white/20 shadow-md">
                <GraduationCap className="w-3.5 h-3.5 text-brand-400" />
                <span>5 min à pied FPN / EST</span>
              </div>

              {/* Bottom Featured Property Capsule */}
              <div className="absolute bottom-5 left-5 right-5 glass-card p-4 rounded-3xl border border-white/80 shadow-xl flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-amber-500 text-xs">★★★★★</span>
                    <span className="text-[11px] font-black text-slate-800">4.9 / 5</span>
                    <span className="text-[10px] text-slate-500 font-medium">(+120 avis)</span>
                  </div>
                  <h4 className="text-sm font-black text-slate-900 mt-0.5">Résidence Al Omrane 01</h4>
                  <p className="text-[11px] text-slate-500 font-medium">Chambres meublées & calmes</p>
                </div>
                <div className="text-right">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Dès</span>
                  <div className="bg-brand-600 text-white font-black text-xs px-3 py-1.5 rounded-xl shadow-xs whitespace-nowrap">
                    1 500 DH<span className="text-[9px] font-normal">/m</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
