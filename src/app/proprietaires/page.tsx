'use client';

import React from 'react';
import Link from 'next/link';
import { LandlordForm } from '@/components/forms/landlord-form';
import {
  ShieldCheck,
  TrendingUp,
  Sparkles,
  Building2,
  Wrench,
  CheckCircle2,
  Clock,
  ArrowRight,
  Phone,
  FileCheck,
  Key,
  Users,
  Compass,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ProprietairesPage() {
  const benefits = [
    {
      icon: TrendingUp,
      badge: 'Rentabilité Maximale',
      title: 'Revenus locatifs réguliers',
      desc: 'Bénéficiez de la demande continue de milliers d’étudiants des facultés de Selouane (FSAN, FEGN, ESTN) pour un taux d’occupation supérieur à 95%.',
      tags: ['Demande étudiante forte', 'Paiement à date fixe'],
      gradient: 'from-brand-600 to-teal-500',
      shadowColor: 'shadow-brand-500/20',
    },
    {
      icon: ShieldCheck,
      badge: 'Zéro Tracas',
      title: 'Gestion intégrale & Baux légaux',
      desc: 'StudRoom prend tout en charge : sélection rigoureuse des dossiers étudiants, rédaction des baux officiels et réalisation des états des lieux d’entrée/sortie.',
      tags: ['Bail officiel légalisé', 'Sélection exigeante'],
      gradient: 'from-emerald-600 to-teal-600',
      shadowColor: 'shadow-emerald-500/20',
    },
    {
      icon: Wrench,
      badge: 'Entretien & Préservation',
      title: 'Patrimoine entretenu et valorisé',
      desc: 'Visites de contrôle régulières et prise en charge rapide des menues réparations par notre équipe technique locale pour préserver la valeur de votre bien.',
      tags: ['Artisans qualifiés', 'Intervention rapide'],
      gradient: 'from-orange-500 to-amber-500',
      shadowColor: 'shadow-orange-500/20',
    },
    {
      icon: Sparkles,
      badge: 'Proximité & Transparence',
      title: 'Interlocuteur unique & dédié',
      desc: 'Un conseiller StudRoom local dédié disponible pour répondre à vos questions, avec un suivi transparent et des bilans clairs.',
      tags: ['Conseiller personnel', 'Disponibilité 7j/7'],
      gradient: 'from-cyan-600 to-blue-600',
      shadowColor: 'shadow-cyan-500/20',
    },
  ];

  const steps = [
    {
      num: '01',
      icon: Compass,
      title: 'Évaluation & Visite gratuite',
      desc: 'Remplissez le formulaire en 2 minutes. Notre responsable local visite votre bien et vous conseille sur le loyer optimal.',
    },
    {
      num: '02',
      icon: Users,
      title: 'Mise en valeur & Sélection',
      desc: 'Photos de qualité, annonce ciblée sur nos canaux universitaires et sélection des dossiers étudiants sérieux.',
    },
    {
      num: '03',
      icon: Key,
      title: 'Signature & Revenus garantis',
      desc: 'Signature du bail officiel, remise des clés et perception sereine de vos revenus locatifs chaque mois.',
    },
  ];

  return (
    <div className="relative overflow-hidden pt-28 pb-24 bg-gradient-to-b from-slate-50/80 via-white to-slate-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 min-h-screen transition-colors">
      
      {/* Background ambient accents */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-brand-100/40 dark:bg-brand-900/20 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-4xl bg-gradient-to-br from-slate-950 via-slate-900 to-brand-950 text-white p-8 sm:p-14 lg:p-16 shadow-2xl mb-20 border border-slate-800/80">
          
          {/* Glowing ambient light */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-brand-500/20 blur-[100px]" />
          <div className="pointer-events-none absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-accent-orange/15 blur-[90px]" />

          <div className="relative z-10 max-w-3xl flex flex-col gap-5">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30 w-fit shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              Service Dédié aux Bailleurs & Investisseurs • Nador & Selouane
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              Louez votre bien à des étudiants sérieux, <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-teal-400 via-brand-400 to-amber-400 bg-clip-text text-transparent">
                sans vacance locative ni imprévu.
              </span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl font-normal">
              StudRoom prend en charge la mise en valeur, la sélection rigoureuse des locataires étudiants de la FSAN, FEGN et EST, la gestion des visites et le suivi quotidien de vos loyers.
            </p>

            {/* Quick KPI stats in Hero */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800">
              <div className="bg-white/5 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10">
                <p className="text-2xl font-black text-brand-400">100%</p>
                <p className="text-xs text-slate-300 font-medium">Baux étudiant légalisés</p>
              </div>
              <div className="bg-white/5 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10">
                <p className="text-2xl font-black text-emerald-400">98%</p>
                <p className="text-xs text-slate-300 font-medium">Taux d'occupation moyen</p>
              </div>
              <div className="bg-white/5 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10">
                <p className="text-2xl font-black text-amber-400">0 DH</p>
                <p className="text-xs text-slate-300 font-medium">Frais d'estimation de bien</p>
              </div>
              <div className="bg-white/5 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10">
                <p className="text-2xl font-black text-cyan-400">48h</p>
                <p className="text-xs text-slate-300 font-medium">Délai moyen de relocation</p>
              </div>
            </div>

            {/* CTA actions */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a href="#proposer-logement">
                <Button
                  size="lg"
                  variant="accent"
                  className="group rounded-full font-bold px-8 py-4 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/35 hover:-translate-y-0.5 active:scale-95 transition-all gap-2"
                >
                  <span>Proposer mon bien gratuitement</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Button>
              </a>

              <a
                href="https://wa.me/212634536286?text=Bonjour%20StudRoom,%20je%20souhaite%20des%20informations%20pour%20confier%20mon%20bien%20immobilier"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full font-semibold px-6 py-4 bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-white/30 backdrop-blur-sm gap-2"
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>Échanger sur WhatsApp</span>
                </Button>
              </a>
            </div>

            {/* Reassurance micro-badges */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-300 pt-1">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Gestion locale directe à Selouane
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Garantie de solvabilité des garants
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Sans engagement • Étude personnalisée
              </span>
            </div>
          </div>
        </div>

        {/* Benefits Grid ("Pourquoi nous confier votre bien ?") */}
        <div className="mb-24">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-200/80 dark:border-brand-800/80 bg-brand-50 dark:bg-brand-950/60 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-brand-300 shadow-xs mb-4">
              <Sparkles className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400 animate-pulse" />
              Sécurité • Rentabilité • Zéro Tracas
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              Pourquoi nous confier votre bien ?
            </h2>

            <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg mt-4 leading-relaxed max-w-2xl mx-auto">
              Transformez votre investissement immobilier à Selouane & Nador en une source de revenus sereine, stable et valorisante.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7">
            {benefits.map((b, idx) => {
              const Icon = b.icon;
              return (
                <div
                  key={idx}
                  className="group relative flex flex-col justify-between rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs p-7 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-2 hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-[0_20px_40px_-12px_rgba(4,108,122,0.18)]"
                >
                  <div>
                    {/* Icon Box */}
                    <div className="flex items-center justify-between mb-6">
                      <div
                        className={`relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr ${b.gradient} text-white shadow-md ${b.shadowColor} transition-all duration-300 group-hover:scale-110 group-hover:rotate-1`}
                      >
                        <Icon className="h-7 w-7" strokeWidth={2.2} />
                      </div>

                      <span className="text-xs font-mono font-bold text-slate-300 dark:text-slate-700 group-hover:text-brand-400/70 transition-colors">
                        0{idx + 1}
                      </span>
                    </div>

                    {/* Category Badge */}
                    <div className="mb-2.5">
                      <span className="inline-block rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 transition-colors group-hover:bg-brand-50 dark:group-hover:bg-brand-950 group-hover:text-brand-700 dark:group-hover:text-brand-300">
                        {b.badge}
                      </span>
                    </div>

                    {/* Title & Desc */}
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight transition-colors group-hover:text-brand-700 dark:group-hover:text-brand-400">
                      {b.title}
                    </h3>
                    <p className="mt-2.5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {b.desc}
                    </p>
                  </div>

                  {/* Micro feature tags */}
                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-1.5">
                    {b.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="inline-flex items-center gap-1 rounded-full bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1 text-[11px] font-medium text-slate-600 dark:text-slate-400 group-hover:bg-brand-50/70 dark:group-hover:bg-brand-950/70 group-hover:text-brand-700 dark:group-hover:text-brand-300 transition-colors"
                      >
                        <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Accent bottom hover line */}
                  <div className="absolute inset-x-8 bottom-0 h-1 bg-gradient-to-r from-brand-500 to-teal-400 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
                </div>
              );
            })}
          </div>
        </div>

        {/* 3 Steps Section: Comment se passe la prise en charge ? */}
        <div className="mb-24 bg-gradient-to-br from-brand-900 via-brand-950 to-slate-950 text-white rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-xl">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-brand-200 border border-white/15 mb-3">
              Processus Transparent
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Comment se passe la prise en charge ?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base mt-2">
              Un parcours fluide en 3 étapes pour commencer à louer sans aucun effort.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {steps.map((s, idx) => {
              const StepIcon = s.icon;
              return (
                <div
                  key={idx}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl p-7 border border-white/10 hover:border-brand-400/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-brand-500/20 text-brand-300 flex items-center justify-center border border-brand-400/30">
                        <StepIcon className="w-6 h-6" />
                      </div>
                      <span className="text-3xl font-black text-white/20">
                        {s.num}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-2">
                      {s.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {s.desc}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-white/10 flex items-center gap-1.5 text-xs text-brand-300 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Prise en charge intégrale</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Section */}
        <div id="form-proposer" className="max-w-4xl mx-auto mb-10">
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-200/80 bg-brand-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-700 shadow-xs mb-3">
              <FileCheck className="w-3.5 h-3.5 text-brand-600" />
              Estimation Gratuite & Sans Engagement
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Proposez votre logement à l’équipe StudRoom
            </h2>
            <p className="text-slate-600 text-sm mt-1.5 max-w-xl mx-auto">
              Renseignez les détails de votre bien ci-dessous. Notre conseiller dédié vous recontactera sous 24h pour organiser une visite d’évaluation.
            </p>
          </div>

          <LandlordForm />
        </div>

      </div>
    </div>
  );
}

