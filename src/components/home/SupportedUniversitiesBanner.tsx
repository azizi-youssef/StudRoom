'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  MapPin,
} from 'lucide-react';

const institutions = [
  {
    name: 'FSAN',
    fullName: 'Faculté des Sciences Appliquées de Nador',
    logo: '/logos/FSAN.png',
    location: 'Nador',
  },
  {
    name: 'FEGN',
    fullName: "Faculté d'Économie et de Gestion de Nador",
    logo: '/logos/FEGN.png',
    location: 'Nador',
  },
  {
    name: 'ESTN',
    fullName: 'École Supérieure de Technologie de Nador',
    logo: '/logos/ESTN.png',
    location: 'Nador',
  },
  {
    name: 'FSJPN',
    fullName: 'Faculté des Sciences Juridiques et Politiques de Nador',
    logo: '/logos/FSJPN.png',
    location: 'Nador',
  },
  {
    name: 'FLLAN',
    fullName: 'Faculté des Langues, Lettres et Arts de Nador',
    logo: '/logos/FLLAN.png',
    location: 'Nador',
  },
];

export function SupportedUniversitiesBanner() {
  // Répétition pour un défilement infini et parfaitement fluide
  const marqueeItems = [...institutions, ...institutions, ...institutions];

  return (
    <section
      aria-labelledby="supported-universities-title"
      className="relative overflow-hidden border-y border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-950 transition-colors"
    >
      {/* Subtle ambient background */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-50/70 via-white to-slate-50/30 dark:from-slate-950/80 dark:via-slate-900/90 dark:to-slate-950/30" />

      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">

        {/* Header Section */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3.5 sm:gap-4">
            {/* Icon */}
            <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl border border-brand-100 dark:border-brand-800/80 bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 shadow-2xs">
              <GraduationCap className="h-5.5 w-5.5 sm:h-6 sm:w-6" strokeWidth={2.2} />
            </div>

            {/* Text Hierarchy */}
            <div className="min-w-0">
              <div className="mb-1.5 flex flex-wrap items-center gap-2 sm:gap-2.5">
                <span className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-brand-600 dark:text-brand-400">
                  Campus partenaires
                </span>

                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/80 dark:border-emerald-800/80 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 text-[10px] sm:text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                  <CheckCircle2 className="h-3 w-3" />
                  Couverture active
                </span>
              </div>

              <h2
                id="supported-universities-title"
                className="text-base sm:text-xl lg:text-2xl font-black tracking-tight text-slate-900 dark:text-white leading-snug"
              >
                Des logements vérifiés à proximité de votre campus
              </h2>

              <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">
                Trouvez facilement un logement étudiant à quelques minutes à pied de votre établissement.
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <Link
            href="/logements"
            className="group inline-flex shrink-0 items-center justify-center gap-2 self-start sm:self-auto rounded-xl border border-brand-200/90 dark:border-brand-800/90 bg-brand-50/80 dark:bg-brand-950/60 px-4.5 py-2.5 text-xs sm:text-sm font-bold text-brand-700 dark:text-brand-300 shadow-2xs transition-all duration-200 hover:border-brand-300 hover:bg-brand-100 dark:hover:bg-brand-900/60 hover:-translate-y-0.5"
          >
            <span>Voir les logements</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Carousel Container */}
        <div className="relative -mx-4 overflow-hidden px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">

          {/* Ultra-subtle edge fades (max 24px - 32px) - guarantees lateral cards remain 100% visible & readable */}
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-6 sm:w-8 bg-gradient-to-r from-white/70 dark:from-slate-950/70 to-transparent"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-6 sm:w-8 bg-gradient-to-l from-white/70 dark:from-slate-950/70 to-transparent"
            aria-hidden="true"
          />

          {/* Carousel Track */}
          <div
            className="flex w-max gap-4 sm:gap-5 py-2.5 animate-marquee hover:[animation-play-state:paused] motion-reduce:animate-none"
            aria-label="Établissements partenaires"
          >
            {marqueeItems.map((institution, index) => (
              <article
                key={`${institution.name}-${index}`}
                className="
                  group
                  relative
                  flex
                  w-[300px]
                  sm:w-[360px]
                  lg:w-[385px]
                  shrink-0
                  items-center
                  gap-3.5
                  sm:gap-4
                  rounded-2xl
                  border
                  border-slate-200/80
                  dark:border-slate-800
                  bg-white
                  dark:bg-slate-900/90
                  p-3.5
                  sm:p-4
                  shadow-[0_2px_10px_-2px_rgba(15,23,42,0.05)]
                  dark:shadow-none
                  transition-all
                  duration-250
                  ease-out
                  hover:-translate-y-1
                  hover:border-brand-300
                  dark:hover:border-brand-600/70
                  hover:shadow-[0_10px_25px_-4px_rgba(4,108,122,0.12)]
                "
              >
                {/* Logo Uniforme & Net */}
                <div
                  className="
                    relative
                    flex
                    h-16
                    w-16
                    sm:h-[72px]
                    sm:w-[72px]
                    shrink-0
                    items-center
                    justify-center
                    overflow-hidden
                    rounded-xl
                    border
                    border-slate-100
                    dark:border-slate-700/80
                    bg-slate-50/80
                    dark:bg-slate-800
                    p-2
                    shadow-2xs
                    transition-transform
                    duration-250
                    group-hover:scale-103
                  "
                >
                  <Image
                    src={institution.logo}
                    alt={`Logo ${institution.name}`}
                    width={72}
                    height={72}
                    className="h-full w-full object-contain"
                  />
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="truncate text-sm sm:text-base font-bold tracking-tight text-slate-900 dark:text-white">
                      {institution.name}
                    </h3>

                    <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:text-slate-300">
                      <MapPin className="h-3 w-3 text-slate-400" />
                      {institution.location}
                    </span>
                  </div>

                  <p
                    className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400"
                    title={institution.fullName}
                  >
                    {institution.fullName}
                  </p>
                </div>

                {/* Icône de validation discrète */}
                <div className="shrink-0 flex items-center justify-center">
                  <CheckCircle2
                    className="h-4 w-4 text-emerald-500/80 transition-colors duration-200 group-hover:text-emerald-600"
                    aria-label="Établissement couvert"
                  />
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Footer / Informations en bas */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-center text-xs font-medium text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            5 établissements actuellement couverts
          </span>

          <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">
            •
          </span>

          <span>Selouane & Nador</span>

          <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">
            •
          </span>

          <span className="text-slate-400 dark:text-slate-500">
            D'autres établissements arrivent bientôt
          </span>
        </div>

      </div>
    </section>
  );
}
