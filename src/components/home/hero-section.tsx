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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedUniversity !== 'all') params.append('university', selectedUniversity);
    if (selectedBudget !== '0') params.append('maxPrice', selectedBudget);
    params.append('city', 'selouane');
    router.push(`/logements?${params.toString()}`);
  };

  return (
    <section className="relative pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden bg-slate-50">
      {/* Subtle Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-accent-orange/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Text & Search */}
          <div className="lg:col-span-7 flex flex-col gap-6 text-center lg:text-left">
            <div className="inline-flex items-center justify-center lg:justify-start gap-2">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-brand-100 text-brand-700 border border-brand-200 shadow-sm">
                <ShieldCheck className="w-4 h-4 text-brand-600" />
                Plateforme officielle à Selouane / Nador
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
                Ton logement étudiant.
                <span className="block text-brand-600 mt-1">Simple. Meublé. Proche.</span>
              </h1>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0 mt-2">
                Des logements sélectionnés et meublés pour les étudiants, situés à quelques minutes de votre université et prêts à vivre.
              </p>
            </div>

            {/* Search Bar Container */}
            <form
              onSubmit={handleSearch}
              className="bg-white p-3 sm:p-4 rounded-3xl shadow-card border border-slate-200/80 flex flex-col gap-3 mt-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                
                {/* Field 1: Localisation */}
                <div className="flex flex-col gap-1 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-brand-500" />
                    Localisation
                  </label>
                  <span className="text-sm font-semibold text-slate-900 truncate">
                    Selouane, Nador
                  </span>
                </div>

                {/* Field 2: Université */}
                <div className="flex flex-col gap-1 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-brand-500" />
                    Université
                  </label>
                  <select
                    value={selectedUniversity}
                    onChange={(e) => setSelectedUniversity(e.target.value)}
                    className="bg-transparent text-sm font-semibold text-slate-900 focus:outline-none cursor-pointer truncate"
                  >
                    <option value="all">Toutes les universités</option>
                    {universities.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.short_name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Field 3: Budget */}
                <div className="flex flex-col gap-1 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Coins className="w-3.5 h-3.5 text-brand-500" />
                    Budget mensuel
                  </label>
                  <select
                    value={selectedBudget}
                    onChange={(e) => setSelectedBudget(e.target.value)}
                    className="bg-transparent text-sm font-semibold text-slate-900 focus:outline-none cursor-pointer"
                  >
                    <option value="0">Tous les budgets</option>
                    <option value="1500">Jusqu'à 1 500 DH/mois</option>
                    <option value="1800">Jusqu'à 1 800 DH/mois</option>
                    <option value="2500">Jusqu'à 2 500 DH/mois</option>
                  </select>
                </div>

              </div>

              {/* Submit CTA */}
              <Button type="submit" variant="primary" size="lg" className="w-full justify-center text-base py-3.5">
                <Search className="w-5 h-5 mr-2" />
                Trouver mon logement
                <ArrowRight className="w-5 h-5 ml-1" />
              </Button>
            </form>

            {/* Micro Highlights */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 text-xs font-semibold text-slate-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Sans frais d'agence cachés
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Bail étudiant flexible
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Accompagnement 7j/7
              </span>
            </div>
          </div>

          {/* Right Column: High Quality Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/3] lg:aspect-[4/5] group">
              <Image
                src="/images/studroom_hero.jpg"
                alt="Appartement étudiant meublé StudRoom Selouane"
                fill
                priority
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
              
              {/* Floating Badge */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-white/50 shadow-lg flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">StudRoom Al Omrane 01</h4>
                  <p className="text-xs text-slate-500">À 5 min à pied de FSP Selouane</p>
                </div>
                <div className="bg-brand-600 text-white font-extrabold text-xs px-3 py-1.5 rounded-xl">
                  À partir de 1 500 DH/mois
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
