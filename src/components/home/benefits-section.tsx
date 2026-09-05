import React from 'react';
import { Sparkles, Armchair, MapPin, Wifi, ShieldCheck, CheckCircle2, Zap, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export function BenefitsSection() {
  return (
    <section className="py-24 sm:py-32 bg-white relative overflow-hidden">
      {/* Background ambient accents */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-brand-50 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-orange/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 sm:mb-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-200/80 bg-brand-50/90 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-700 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            L'Expérience StudRoom
          </span>

          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Plus qu'un simple logement. <br />
            <span className="bg-gradient-to-r from-brand-600 to-accent-teal bg-clip-text text-transparent">
              Un environnement pensé pour ta réussite.
            </span>
          </h2>

          <p className="mt-5 text-base sm:text-lg leading-relaxed text-slate-600 max-w-2xl mx-auto">
            Chaque espace StudRoom allie confort moderne, proximité stratégique avec les facultés et gestion transparente pour étudier en toute sérénité.
          </p>
        </div>

        {/* Modern Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">

          {/* Bento Item 1: Large Card - Ready to Live (2 cols on md/lg) */}
          <div className="md:col-span-2 group relative overflow-hidden rounded-3xl border border-slate-200/90 bg-gradient-to-br from-slate-50 via-white to-brand-50/30 p-8 sm:p-10 shadow-soft hover:shadow-card-hover transition-all duration-300">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-soft group-hover:scale-105 transition-transform">
                <Armchair className="h-7 w-7" />
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-brand-700 bg-brand-100/90 px-3.5 py-1.5 rounded-full border border-brand-200/80">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-600" />
                100% Meublé & Équipé
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Prêt à vivre dès le premier jour
            </h3>
            <p className="mt-3 text-slate-600 text-base leading-relaxed max-w-xl">
              Pose simplement tes valises : lit confortable avec literie soignée, bureau spacieux avec chaise ergonomique pour tes révisions, rangements intégrés et kitchenette équipée pour ton autonomie.
            </p>

            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3 pt-6 border-t border-slate-200/70">
              <div className="bg-white/80 backdrop-blur-sm p-3 rounded-xl border border-slate-100 text-xs font-bold text-slate-800">
                🛌 Lit & Literie complète
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-3 rounded-xl border border-slate-100 text-xs font-bold text-slate-800">
                💻 Grand Bureau d'études
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-3 rounded-xl border border-slate-100 text-xs font-bold text-slate-800 col-span-2 sm:col-span-1">
                🍳 Cuisine équipée
              </div>
            </div>
          </div>

          {/* Bento Item 2: Proximity Campus (1 col) */}
          <div className="group relative overflow-hidden rounded-3xl border border-slate-200/90 bg-gradient-to-br from-white to-slate-50 p-8 shadow-soft hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-4 mb-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-orange text-white shadow-soft group-hover:scale-105 transition-transform">
                  <MapPin className="h-7 w-7" />
                </div>
                <span className="text-xs font-black uppercase tracking-wider text-orange-700 bg-orange-100 px-3 py-1 rounded-full">
                  ≤ 5-10 min à pied
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Zéro transport inutile
              </h3>
              <p className="mt-2.5 text-slate-600 text-sm leading-relaxed">
                Situés au cœur d'Al Omrane à Selouane, nos logements te permettent d'aller à la FPN, à l'EST ou à l'ISTA à pied. Économise du temps et de l'énergie au quotidien.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-brand-700">
              <span>Campus FPN · EST · ISTA Nador</span>
            </div>
          </div>

          {/* Bento Item 3: Wi-Fi Fibre & Espace Calme (1 col) */}
          <div className="group relative overflow-hidden rounded-3xl border border-slate-200/90 bg-gradient-to-br from-white to-slate-50 p-8 shadow-soft hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-4 mb-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500 text-white shadow-soft group-hover:scale-105 transition-transform">
                  <Wifi className="h-7 w-7" />
                </div>
                <span className="text-xs font-black uppercase tracking-wider text-brand-700 bg-brand-100 px-3 py-1 rounded-full">
                  Fibre Optique
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Wi-Fi Fibre Haut Débit
              </h3>
              <p className="mt-2.5 text-slate-600 text-sm leading-relaxed">
                Suis tes cours à distance, télécharge tes supports d'études et assiste à tes réunions de projet sans aucune coupure grâce à notre connexion optimisée.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-emerald-600">
              <Zap className="w-4 h-4 text-emerald-500" />
              <span>Inclus sans surcoût</span>
            </div>
          </div>

          {/* Bento Item 4: Transparency & Safety (2 cols on md/lg) */}
          <div className="md:col-span-2 group relative overflow-hidden rounded-3xl border border-slate-200/90 bg-gradient-to-br from-slate-900 via-slate-800 to-brand-950 text-white p-8 sm:p-10 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500 text-white shadow-soft group-hover:scale-105 transition-transform">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-emerald-300 bg-emerald-950/80 px-3.5 py-1.5 rounded-full border border-emerald-500/40">
                0 DH frais d'agence
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Location 100% transparente & sécurisée
            </h3>
            <p className="mt-3 text-slate-300 text-base leading-relaxed max-w-xl">
              Fini les mauvaises surprises avec les intermédiaires douteux : contrat officiel clair, état des lieux d'entrée rigoureux, assistance technique réactive 7j/7 et loyers tout compris sans frais cachés.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-700/80">
              <div className="flex items-center gap-6 text-xs text-slate-300 font-semibold">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-400" />
                  Bail étudiant officiel
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-400" />
                  Interlocuteur direct dédié
                </span>
              </div>

              <Link
                href="/comment-ca-marche"
                className="inline-flex items-center gap-1 text-xs font-bold text-brand-300 hover:text-white transition-colors"
              >
                Découvrir le fonctionnement
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}