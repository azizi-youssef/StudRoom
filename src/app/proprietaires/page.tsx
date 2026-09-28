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
  Zap,
  Check,
  Calendar,
  Camera,
  BadgeCheck,
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
      gradient: 'from-primary-600 to-teal-500',
      shadowColor: 'shadow-primary-500/20',
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
      stepBadge: 'Étape 1 • 24 à 48h',
      icon: Compass,
      title: 'Évaluation sur place & Estimation offerte',
      desc: 'Remplissez le formulaire en 2 minutes. Notre responsable local se déplace directement à votre bien à Selouane pour analyser son potentiel, vérifier les équipements et estimer le loyer optimal.',
      tags: ['Visite gratuite sans engagement', 'Étude comparative du marché Selouane'],
      gradient: 'from-cyan-500 to-teal-500',
      accentColor: 'text-cyan-400',
      bgGlow: 'from-cyan-500/15 via-cyan-500/5 to-transparent',
      borderColor: 'border-cyan-500/30 hover:border-cyan-400',
      badgeBg: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
      iconBg: 'bg-gradient-to-tr from-cyan-600 to-teal-500 text-white shadow-cyan-500/30',
      numberColor: 'text-cyan-400/30 group-hover:text-cyan-400/50',
    },
    {
      num: '02',
      stepBadge: 'Étape 2 • 3 à 5 jours',
      icon: Camera,
      title: 'Shooting professionnel & Sélection des dossiers',
      desc: 'Nous réalisons un shooting photo HD de votre logement, diffusons l’annonce en priorité auprès des facultés (FSAN, FSJPN, FEGN, FLLAN, EST et ISTA ) et sélectionnons des étudiants sérieux avec garants solvables.',
      tags: ['Photos HD & Visite immersive', 'Vérification stricte des garants'],
      gradient: 'from-primary-500 to-blue-500',
      accentColor: 'text-primary-300',
      bgGlow: 'from-primary-500/15 via-primary-500/5 to-transparent',
      borderColor: 'border-primary-500/30 hover:border-primary-400',
      badgeBg: 'bg-primary-500/15 text-primary-300 border-primary-500/30',
      iconBg: 'bg-gradient-to-tr from-primary-600 to-blue-600 text-white shadow-primary-500/30',
      numberColor: 'text-primary-400/30 group-hover:text-primary-400/50',
    },
    {
      num: '03',
      stepBadge: 'Étape 3 • Clé en main',
      icon: Key,
      title: 'Bail officiel, Remise des clés & Revenus garantis',
      desc: 'Rédaction du bail conforme à la législation marocaine, état des lieux d’entrée contradictoire et remise des clés. Vos loyers sont ensuite virés directement sur votre compte chaque début de mois.',
      tags: ['Bail officiel légalisé', 'Loyers virés dès le 5 du mois'],
      gradient: 'from-emerald-500 to-teal-500',
      accentColor: 'text-emerald-400',
      bgGlow: 'from-emerald-500/15 via-emerald-500/5 to-transparent',
      borderColor: 'border-emerald-500/30 hover:border-emerald-400',
      badgeBg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      iconBg: 'bg-gradient-to-tr from-emerald-600 to-teal-600 text-white shadow-emerald-500/30',
      numberColor: 'text-emerald-400/30 group-hover:text-emerald-400/50',
    },
  ];

  return (
    <div className="relative overflow-hidden pt-28 pb-24 bg-gradient-to-b from-slate-50/80 via-white to-slate-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 min-h-screen transition-colors">

      {/* Background ambient accents */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-primary-100/40 dark:bg-primary-900/20 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-4xl bg-gradient-to-br from-slate-950 via-slate-900 to-primary-950 text-white p-8 sm:p-14 lg:p-16 shadow-2xl mb-20 border border-slate-800/80">

          {/* Glowing ambient light */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-primary-500/20 blur-[100px]" />
          <div className="pointer-events-none absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-accent-orange/15 blur-[90px]" />

          <div className="relative z-10 max-w-3xl flex flex-col gap-5">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-primary-500/20 text-primary-300 border border-primary-500/30 w-fit shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              Service Dédié aux Bailleurs & Investisseurs • Nador & Selouane
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              Louez votre bien à des étudiants sérieux, <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-teal-400 via-primary-400 to-amber-400 bg-clip-text text-transparent">
                sans vacance locative ni imprévu.
              </span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl font-normal">
              StudRoom prend en charge la mise en valeur, la sélection rigoureuse des locataires étudiants de la FSAN, FEGN et EST, la gestion des visites et le suivi quotidien de vos loyers.
            </p>

            {/* Quick KPI stats in Hero */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800">
              <div className="bg-white/5 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10">
                <p className="text-2xl font-black text-primary-400">100%</p>
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
            <div className="inline-flex items-center gap-2 rounded-full border border-primary-200/80 dark:border-primary-800/80 bg-primary-50 dark:bg-primary-950/60 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary-700 dark:text-primary-300 shadow-xs mb-4">
              <Sparkles className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400 animate-pulse" />
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
                  className="group relative flex flex-col justify-between rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs p-7 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-2 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-[0_20px_40px_-12px_rgba(4,108,122,0.18)]"
                >
                  <div>
                    {/* Icon Box */}
                    <div className="flex items-center justify-between mb-6">
                      <div
                        className={`relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr ${b.gradient} text-white shadow-md ${b.shadowColor} transition-all duration-300 group-hover:scale-110 group-hover:rotate-1`}
                      >
                        <Icon className="h-7 w-7" strokeWidth={2.2} />
                      </div>

                      <span className="text-xs font-mono font-bold text-slate-300 dark:text-slate-700 group-hover:text-primary-400/70 transition-colors">
                        0{idx + 1}
                      </span>
                    </div>

                    {/* Category Badge */}
                    <div className="mb-2.5">
                      <span className="inline-block rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 transition-colors group-hover:bg-primary-50 dark:group-hover:bg-primary-950 group-hover:text-primary-700 dark:group-hover:text-primary-300">
                        {b.badge}
                      </span>
                    </div>

                    {/* Title & Desc */}
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight transition-colors group-hover:text-primary-700 dark:group-hover:text-primary-400">
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
                        className="inline-flex items-center gap-1 rounded-full bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1 text-[11px] font-medium text-slate-600 dark:text-slate-400 group-hover:bg-primary-50/70 dark:group-hover:bg-primary-950/70 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors"
                      >
                        <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Accent bottom hover line */}
                  <div className="absolute inset-x-8 bottom-0 h-1 bg-gradient-to-r from-primary-500 to-teal-400 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
                </div>
              );
            })}
          </div>
        </div>

        {/* 🌟 3 Steps Section: Comment se passe la prise en charge ? */}
        <div className="mb-24 rounded-4xl bg-gradient-to-br from-slate-950 via-slate-900 to-primary-950 text-white p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-2xl border border-slate-800/80">

          {/* Ambient lighting effects */}
          <div className="pointer-events-none absolute -top-24 left-1/4 h-80 w-80 rounded-full bg-cyan-500/15 blur-[100px]" />
          <div className="pointer-events-none absolute top-1/2 right-10 h-96 w-96 rounded-full bg-primary-500/15 blur-[120px]" />
          <div className="pointer-events-none absolute -bottom-20 left-10 h-72 w-72 rounded-full bg-emerald-500/15 blur-[90px]" />

          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-white/10 text-teal-300 border border-white/15 mb-4 shadow-2xs backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
              Parcours Clé en Main • 100% Serein
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Comment se passe la{' '}
              <span className="bg-gradient-to-r from-teal-300 via-primary-200 to-emerald-300 bg-clip-text text-transparent">
                prise en charge ?
              </span>
            </h2>

            <p className="text-slate-300 text-sm sm:text-base mt-3.5 max-w-2xl mx-auto leading-relaxed">
              De l'estimation initiale jusqu'au versement mensuel ponctuel de vos loyers, notre équipe locale à Selouane s'occupe de tout sans aucun effort de votre part.
            </p>
          </div>

          {/* Connected Steps Grid */}
          <div className="relative z-10">
            {/* Desktop connecting progress line */}
            <div className="hidden lg:block absolute top-[52px] left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-cyan-500/40 via-primary-400/50 to-emerald-500/40 -z-0" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {steps.map((s, idx) => {
                const StepIcon = s.icon;
                return (
                  <div
                    key={idx}
                    className={`group relative rounded-3xl p-7 sm:p-8 bg-gradient-to-b ${s.bgGlow} bg-slate-900/80 backdrop-blur-md border ${s.borderColor} shadow-[0_4px_24px_-4px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_40px_-4px_rgba(0,0,0,0.5)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between`}
                  >
                    <div>
                      {/* Step Header: Badge & Number */}
                      <div className="flex items-center justify-between gap-2 mb-6">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-extrabold px-3 py-1 rounded-full border ${s.badgeBg}`}>
                          <Clock className="w-3 h-3" />
                          {s.stepBadge}
                        </span>

                        <span className={`font-mono text-3xl sm:text-4xl font-black tracking-tighter ${s.numberColor} transition-colors select-none`}>
                          {s.num}
                        </span>
                      </div>

                      {/* Icon */}
                      <div className="mb-5">
                        <div className={`w-14 h-14 rounded-2xl ${s.iconBg} flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300`}>
                          <StepIcon className="w-7 h-7" />
                        </div>
                      </div>

                      {/* Title & Description */}
                      <h3 className="text-lg sm:text-xl font-black text-white mb-3 tracking-tight leading-snug group-hover:text-teal-200 transition-colors">
                        {s.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {s.desc}
                      </p>

                      {/* Feature Tags / Points Clés */}
                      <div className="mt-5 flex flex-col gap-2 pt-4 border-t border-white/10">
                        {s.tags.map((tag, tIdx) => (
                          <div key={tIdx} className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                            <BadgeCheck className={`w-4 h-4 ${s.accentColor} shrink-0`} />
                            <span>{tag}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Step Footer Status */}
                    <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold text-slate-300">
                      <span className="flex items-center gap-1.5 text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                        Prise en charge intégrale
                      </span>
                      <span className={`${s.accentColor} group-hover:translate-x-1 transition-transform`}>
                        &rarr;
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Reassurance & CTA Row */}
          <div className="mt-14 pt-10 border-t border-white/10 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 bg-white/5 rounded-3xl p-6 sm:p-8 backdrop-blur-xs border border-white/10">
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 sm:gap-10 text-center lg:text-left">
              <div>
                <p className="font-mono text-2xl sm:text-3xl font-black text-emerald-400">98.4%</p>
                <p className="text-xs text-slate-400 mt-0.5">Taux d'occupation annuel</p>
              </div>
              <div className="hidden sm:block w-px h-10 bg-white/10" />
              <div>
                <p className="font-mono text-2xl sm:text-3xl font-black text-cyan-400">Le 5</p>
                <p className="text-xs text-slate-400 mt-0.5">Du mois : loyers virés</p>
              </div>
              <div className="hidden sm:block w-px h-10 bg-white/10" />
              <div>
                <p className="font-mono text-2xl sm:text-3xl font-black text-amber-400">0 DH</p>
                <p className="text-xs text-slate-400 mt-0.5">Frais d'évaluation du bien</p>
              </div>
            </div>

            <a
              href="#form-proposer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-primary-500 to-teal-500 hover:from-primary-600 hover:to-teal-600 text-white text-xs sm:text-sm font-bold shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:-translate-y-0.5 transition-all w-full sm:w-auto text-center"
            >
              <span>Estimer mon bien gratuitement</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

        </div>

        {/* Form Section */}
        <div id="form-proposer" className="max-w-4xl mx-auto mb-10">
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary-200/80 bg-primary-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary-700 shadow-xs mb-3">
              <FileCheck className="w-3.5 h-3.5 text-primary-600" />
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

