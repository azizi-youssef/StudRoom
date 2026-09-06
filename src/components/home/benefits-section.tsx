'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Armchair,
  MapPin,
  Wifi,
  ShieldCheck,
  CheckCircle2,
  Zap,
  ArrowRight,
  Clock,
  Bed,
  Laptop,
  Utensils,
  Building,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function BenefitsSection() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32 bg-gradient-to-b from-white via-slate-50/50 to-white dark:from-slate-950 dark:via-slate-900/60 dark:to-slate-950 transition-colors">
      {/* Background ambient accents */}
      <div className="pointer-events-none absolute top-1/3 left-0 w-96 h-96 bg-brand-100/40 dark:bg-brand-900/20 rounded-full blur-3xl -z-10" />
      <div className="pointer-events-none absolute bottom-10 right-0 w-[500px] h-[500px] bg-accent-orange/5 dark:bg-accent-orange/5 rounded-full blur-3xl -z-10" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-200/80 dark:border-brand-800/80 bg-brand-50 dark:bg-brand-950/60 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-brand-300 shadow-xs mb-4">
            <Sparkles className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400 animate-pulse" />
            L'Expérience Étudiante Réinventée
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
            Plus qu'un simple logement. <br />
            <span className="bg-gradient-to-r from-brand-600 via-teal-600 to-accent-orange bg-clip-text text-transparent">
              Un environnement pensé pour ta réussite.
            </span>
          </h2>

          <p className="mt-5 text-base sm:text-lg leading-relaxed text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Chaque espace StudRoom allie confort moderne, proximité stratégique avec les facultés et gestion transparente pour étudier en toute sérénité.
          </p>

          {/* Quick reassurance pills */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white dark:bg-slate-900 px-3.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
              🛋️ 100% Prêt à vivre
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white dark:bg-slate-900 px-3.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
              📍 Proche FSAN, FEGN & ESTN
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white dark:bg-slate-900 px-3.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
              ⚡ Fibre Optique très haut débit
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white dark:bg-slate-900 px-3.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
              🛡️ 0 DH de frais cachés
            </span>
          </div>
        </div>

        {/* Modern Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 lg:gap-7">

          {/* Bento Item 1: Large Card - Ready to Live (2 cols on md/lg) */}
          <div className="md:col-span-2 group relative overflow-hidden rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-gradient-to-br from-white via-slate-50/70 to-brand-50/30 dark:from-slate-900 dark:via-slate-900/90 dark:to-brand-950/30 p-8 sm:p-10 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.05)] hover:shadow-[0_20px_40px_-12px_rgba(4,108,122,0.18)] hover:border-brand-300 dark:hover:border-brand-700 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-4 mb-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-600 to-teal-500 text-white shadow-md shadow-brand-500/25 group-hover:scale-110 group-hover:rotate-1 transition-all duration-300">
                  <Armchair className="h-7 w-7" strokeWidth={2.2} />
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/80 px-3.5 py-1.5 rounded-full border border-brand-200/80 dark:border-brand-800/80 shadow-2xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                  100% Meublé & Équipé
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Prêt à vivre dès le premier jour
              </h3>
              <p className="mt-3 text-slate-600 dark:text-slate-300 text-base leading-relaxed max-w-xl">
                Pose simplement tes valises : lit confortable avec literie soignée, bureau spacieux avec chaise ergonomique pour tes révisions, rangements intégrés et kitchenette équipée pour ton autonomie complète.
              </p>
            </div>

            {/* Feature mini-cards */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-slate-200/70 dark:border-slate-800">
              <div className="flex items-center gap-2.5 bg-white/90 dark:bg-slate-800/80 backdrop-blur-sm p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-2xs group-hover:border-brand-200 dark:group-hover:border-brand-700 transition-colors">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400">
                  <Bed className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">Literie complète</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Matelas confort neuf</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 bg-white/90 dark:bg-slate-800/80 backdrop-blur-sm p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-2xs group-hover:border-brand-200 dark:group-hover:border-brand-700 transition-colors">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400">
                  <Laptop className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">Bureau de travail</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Chaise ergonomique</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 bg-white/90 dark:bg-slate-800/80 backdrop-blur-sm p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-2xs group-hover:border-brand-200 dark:group-hover:border-brand-700 transition-colors">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400">
                  <Utensils className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">Kitchenette équipée</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Frigo & plaques inclus</p>
                </div>
              </div>
            </div>

            {/* Bottom accent hover bar */}
            <div className="absolute inset-x-8 bottom-0 h-1 bg-gradient-to-r from-brand-600 to-teal-500 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
          </div>

          {/* Bento Item 2: Proximity Campus (1 col) */}
          <div className="group relative overflow-hidden rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-900/80 p-8 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.05)] hover:shadow-[0_20px_40px_-12px_rgba(249,115,22,0.18)] hover:border-orange-300 dark:hover:border-orange-500/50 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-4 mb-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/25 group-hover:scale-110 group-hover:rotate-1 transition-all duration-300">
                  <MapPin className="h-7 w-7" strokeWidth={2.2} />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-950/70 border border-orange-200/80 dark:border-orange-800/80 px-3 py-1 rounded-full shadow-2xs">
                  ≤ 5-10 min à pied
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Zéro transport inutile
              </h3>
              <p className="mt-2.5 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                Situés au cœur d'Al Omrane à Selouane, nos logements te permettent de rejoindre la FSAN, l'EST ou l'ISTA à pied. Économise du temps, de l'argent et ton énergie.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <Building className="h-3.5 w-3.5 text-orange-500 shrink-0" />
                <span>Campus FSA ·FEG · FLLA · FSJP · EST · ISTA Selouane</span>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-3 w-3" />
                Économie de taxi & bus au quotidien
              </span>
            </div>

            {/* Bottom accent hover bar */}
            <div className="absolute inset-x-8 bottom-0 h-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
          </div>

          {/* Bento Item 3: Wi-Fi Fibre & Calme (1 col) */}
          <div className="group relative overflow-hidden rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-900/80 p-8 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.05)] hover:shadow-[0_20px_40px_-12px_rgba(8,145,178,0.18)] hover:border-cyan-300 dark:hover:border-cyan-500/50 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-4 mb-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-500/25 group-hover:scale-110 group-hover:rotate-1 transition-all duration-300">
                  <Wifi className="h-7 w-7" strokeWidth={2.2} />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/70 border border-cyan-200/80 dark:border-cyan-800/80 px-3 py-1 rounded-full shadow-2xs">
                  Fibre Optique
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Wi-Fi Fibre Haut Débit
              </h3>
              <p className="mt-2.5 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                Suis tes cours à distance, télécharge tes supports d'études volumineux et assiste à tes visios sans aucune coupure grâce à notre infrastructure réseau optimisée.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-emerald-500" />
                Inclus sans surcoût
              </span>
              <span className="text-slate-400 dark:text-slate-500 font-normal text-[11px]">Débit garanti</span>
            </div>

            {/* Bottom accent hover bar */}
            <div className="absolute inset-x-8 bottom-0 h-1 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
          </div>

          {/* Bento Item 4: Transparency & Safety (2 cols on md/lg) */}
          <div className="md:col-span-2 group relative overflow-hidden rounded-3xl border border-slate-800/90 bg-gradient-to-br from-slate-950 via-slate-900 to-brand-950 text-white p-8 sm:p-10 shadow-xl hover:shadow-[0_25px_50px_-12px_rgba(4,108,122,0.3)] transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-4 mb-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/25 group-hover:scale-110 group-hover:rotate-1 transition-all duration-300">
                  <ShieldCheck className="h-7 w-7" strokeWidth={2.2} />
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-300 bg-emerald-950/80 px-3.5 py-1.5 rounded-full border border-emerald-500/40 shadow-xs">
                  0 DH frais d'agence
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Location 100% transparente & sécurisée
              </h3>
              <p className="mt-3 text-slate-300 text-base leading-relaxed max-w-xl">
                Fini les mauvaises surprises avec les intermédiaires douteux : contrat officiel clair, état des lieux d'entrée rigoureux, assistance technique réactive 7j/7 et loyers transparents sans frais cachés.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-800">
              <div className="flex flex-wrap items-center gap-6 text-xs text-slate-300 font-semibold">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Bail étudiant officiel
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Interlocuteur dédié
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-brand-400" />
                  Assistance réactive 7j/7
                </span>
              </div>

              <Link
                href="/a-propos"
                className="group/link inline-flex items-center gap-1.5 text-xs font-bold text-brand-300 hover:text-white transition-colors"
              >
                Découvrir nos engagements
                <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
              </Link>
            </div>

            {/* Bottom accent hover bar */}
            <div className="absolute inset-x-8 bottom-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
          </div>

        </div>

        {/* Bottom CTA Block */}
        <div className="mt-14 sm:mt-16 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
          <Link href="/logements">
            <Button
              variant="primary"
              size="lg"
              className="group rounded-full font-bold text-sm px-8 py-3.5 shadow-md shadow-brand-600/25 hover:shadow-lg hover:shadow-brand-600/35 hover:-translate-y-0.5 active:scale-95 transition-all gap-2"
            >
              <span>Découvrir tous les logements disponibles</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Button>
          </Link>

          <Link href="/proprietaires">
            <Button
              variant="outline"
              size="lg"
              className="rounded-full font-semibold text-sm px-7 py-3.5 border-slate-200/90 text-slate-700 hover:border-brand-300 hover:bg-slate-50 shadow-2xs hover:-translate-y-0.5 transition-all"
            >
              Vous êtes propriétaire ? Confier votre bien
            </Button>
          </Link>
        </div>

      </div>
    </section>
  );
}