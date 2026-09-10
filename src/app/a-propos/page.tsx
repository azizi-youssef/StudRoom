'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShieldCheck,
  Heart,
  Users,
  Compass,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Building2,
  GraduationCap,
  MapPin,
  Wifi,
  Clock,
  Award,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AProposPage() {
  const stats = [
    { value: '+500', label: 'Étudiants accompagnés', desc: 'Depuis notre lancement' },
    { value: '5 campus', label: 'Facultés couvertes', desc: 'FSAN, FEGN, ESTN, etc.' },
    { value: '100%', label: 'Fibre & Équipements', desc: 'Wi-Fi haut débit garanti' },
    { value: '0 DH', label: 'Frais d’agence cachés', desc: 'Contrat direct & transparent' },
  ];

  const pillars = [
    {
      num: '01',
      icon: ShieldCheck,
      badge: 'Transparence',
      title: 'Confiance & Légalité',
      desc: 'Aucun intermédiaire douteux, zéro frais cachés. Baux officiels en bonne et due forme conformes à la réglementation marocaine.',
      tags: ['Bail officiel légalisé', 'Sécurité juridique'],
      gradient: 'from-emerald-600 to-teal-600',
      shadowColor: 'shadow-emerald-500/20',
    },
    {
      num: '02',
      icon: Heart,
      badge: 'Qualité de vie',
      title: 'Confort Prêt à Vivre',
      desc: 'Des logements entièrement meublés, lumineux, propres et dotés d’un bureau ergonomique pour réviser dans les meilleures conditions.',
      tags: ['Literie neuve', 'Kitchenette équipée'],
      gradient: 'from-brand-600 to-teal-500',
      shadowColor: 'shadow-brand-500/20',
    },
    {
      num: '03',
      icon: Compass,
      badge: 'Stratégie',
      title: 'Proximité Immédiate Campus',
      desc: 'Emplacements ciblés à Selouane (Al Omrane) et Nador pour rejoindre vos amphis à pied et supprimer les coûts de transport.',
      tags: ['≤ 5-10 min à pied', 'Zéro taxi quotidien'],
      gradient: 'from-orange-500 to-amber-500',
      shadowColor: 'shadow-orange-500/20',
    },
    {
      num: '04',
      icon: Users,
      badge: 'Communauté',
      title: 'Esprit d’Entraide & Sérénité',
      desc: 'Des colocations et résidences saines créant un climat propice aux études, au partage et à la réussite de votre parcours universitaire.',
      tags: ['Ambiance calme', 'Support réactif 7j/7'],
      gradient: 'from-cyan-600 to-blue-600',
      shadowColor: 'shadow-cyan-500/20',
    },
  ];

  return (
    <div className="relative overflow-hidden pt-28 pb-24 bg-gradient-to-b from-slate-50/80 via-white to-slate-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 min-h-screen transition-colors">

      {/* Ambient background lighting */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-brand-100/40 dark:bg-brand-900/20 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200/80 dark:border-brand-800/80 text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-brand-300 shadow-xs mb-4">
            <Sparkles className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400 animate-pulse" />
            La Marque StudRoom • Student Living au Maroc
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Redéfinir le logement étudiant au Maroc.
          </h1>

          <p className="mt-5 text-slate-600 dark:text-slate-300 text-base sm:text-xl font-normal leading-relaxed max-w-2xl mx-auto">
            StudRoom transforme la galère de la recherche de logement en une expérience fluide, humaine, moderne et 100% sécurisée.
          </p>

          {/* Quick Metrics KPI Bar */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-200/80 dark:border-slate-800">
            {stats.map((item, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs text-center">
                <p className="text-2xl sm:text-3xl font-black text-brand-600 dark:text-brand-400">{item.value}</p>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">{item.label}</p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Narrative Box with Image Collage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-28">

          {/* Images Section */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 aspect-[4/3]">
              <Image
                src="/images/hero.jpeg"
                alt="Espace de vie StudRoom Selouane"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold">
                  <MapPin className="w-3.5 h-3.5 text-brand-300" />
                  Selouane • Al Omrane
                </span>
                <p className="text-sm font-bold mt-1">Résidences étudiantes haute qualité</p>
              </div>
            </div>

            {/* Floating secondary badge */}
            <div className="hidden sm:flex absolute -bottom-6 -right-6 bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-xl border border-slate-200/90 dark:border-slate-800 items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Campus de Nador</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Proche FSAN, FEGN & ESTN</p>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 text-xs font-bold uppercase tracking-wider w-fit border border-brand-200/60 dark:border-brand-800/80">
              <Award className="w-3.5 h-3.5" />
              Notre Philosophie
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              Ni une université, ni une agence classique.
            </h2>

            <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
              StudRoom est une <strong>marque marocaine de student living</strong> qui sélectionne, rénove, équipe et gère des espaces de vie pensés sur mesure pour l’épanouissement et la réussite académique des étudiants.
            </p>

            <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
              En démarrant à <strong>Selouane / Al Omrane, Nador</strong>, nous répondons au besoin fondamental des milliers d'étudiants fréquentant la Faculté des Sciences Appliquées (FSAN), la Faculté d'Économie et de Gestion (FEGN), l'EST Nador et les écoles environnantes : trouver une chambre saine, calme, bien meublée et ultra-proche des amphis.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Accompagnement humain & réactif</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Standardisation du Wi-Fi Fibre</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Baux légalisés sans intermédiaire</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Vision nationale marocaine</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Pillars Section */}
        <div className="mb-28">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-200/80 dark:border-brand-800/80 bg-brand-50 dark:bg-brand-950/60 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-brand-300 shadow-xs mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
              Nos Valeurs
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              Les 4 Engagements StudRoom
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base mt-2">
              Chaque décision que nous prenons est guidée par le respect de l'étudiant et de sa famille.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7">
            {pillars.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div
                  key={idx}
                  className="group relative flex flex-col justify-between rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs p-7 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-2 hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-[0_20px_40px_-12px_rgba(4,108,122,0.18)]"
                >
                  <div>
                    {/* Icon & Num */}
                    <div className="flex items-center justify-between mb-6">
                      <div
                        className={`relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr ${p.gradient} text-white shadow-md ${p.shadowColor} transition-all duration-300 group-hover:scale-110 group-hover:rotate-1`}
                      >
                        <Icon className="h-7 w-7" strokeWidth={2.2} />
                      </div>

                      <span className="text-xs font-mono font-bold text-slate-300 dark:text-slate-700 group-hover:text-brand-400/70 transition-colors">
                        {p.num}
                      </span>
                    </div>

                    {/* Category Badge */}
                    <div className="mb-2.5">
                      <span className="inline-block rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 transition-colors group-hover:bg-brand-50 dark:group-hover:bg-brand-950 group-hover:text-brand-700 dark:group-hover:text-brand-300">
                        {p.badge}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight transition-colors group-hover:text-brand-700 dark:group-hover:text-brand-400">
                      {p.title}
                    </h3>

                    <p className="mt-2.5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {p.desc}
                    </p>
                  </div>

                  {/* Micro tags */}
                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-1.5">
                    {p.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="inline-flex items-center gap-1 rounded-full bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1 text-[11px] font-medium text-slate-600 dark:text-slate-400 group-hover:bg-brand-50/70 dark:group-hover:bg-brand-950/70 group-hover:text-brand-700 dark:group-hover:text-brand-300 transition-colors"
                      >
                        <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Accent bottom line */}
                  <div className="absolute inset-x-8 bottom-0 h-1 bg-gradient-to-r from-brand-500 to-teal-400 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Local Anchor Showcase: Selouane & Nador */}
        <div className="mb-24 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-brand-950 text-white p-8 sm:p-12 lg:p-14 relative overflow-hidden shadow-2xl border border-slate-800">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30 mb-3">
                <MapPin className="w-3.5 h-3.5" />
                Ancrage Territorial
              </span>
              <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Pourquoi avoir commencé à Selouane & Nador ?
              </h3>
              <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed max-w-2xl">
                La zone universitaire de Selouane accueille chaque année plus de 15 000 étudiants venus de tout le Maroc oriental et du Royaume. L'offre locale de logement était dispersée et souvent peu adaptée aux besoins réels d'études. StudRoom est né pour combler ce manque avec un standard hôtelier accessible.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3">
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                <p className="text-xs font-semibold text-brand-300">Hub Universitaire</p>
                <p className="text-base font-bold text-white mt-0.5">Selouane - Al Omrane</p>
                <p className="text-xs text-slate-400 mt-1">À proximité directe de 5 facultés</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                <p className="text-xs font-semibold text-emerald-300">Engagement Qualité</p>
                <p className="text-base font-bold text-white mt-0.5">Visites & Support 7j/7</p>
                <p className="text-xs text-slate-400 mt-1">Présence continue sur le terrain</p>
              </div>
            </div>
          </div>
        </div>

        {/* Big Bottom CTA Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-brand-600 via-brand-600 to-teal-600 text-white p-8 sm:p-12 lg:p-14 text-center flex flex-col items-center gap-6 shadow-xl relative overflow-hidden">
          <div className="pointer-events-none absolute -right-20 -top-20 w-80 h-80 rounded-full bg-white/10 blur-2xl" />

          <h2 className="text-2xl sm:text-4xl font-black tracking-tight max-w-xl">
            Prêt à vivre l'expérience StudRoom à Selouane ?
          </h2>

          <p className="text-brand-100 max-w-xl text-sm sm:text-base leading-relaxed">
            Trouvez une chambre confortable, vérifiée et réservable en 2 minutes pour réussir votre année universitaire.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <Link href="/logements">
              <Button
                variant="accent"
                size="lg"
                className="group font-extrabold px-8 py-4 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/35 hover:-translate-y-0.5 active:scale-95 transition-all gap-2"
              >
                <span>Explorer les logements</span>
                <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
              </Button>
            </Link>

            <Link href="/proprietaires">
              <Button
                variant="outline"
                size="lg"
                className="font-bold px-7 py-4 bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-white/30 backdrop-blur-sm"
              >
                Vous êtes propriétaire ?
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

