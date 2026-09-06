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
    logo: '/logos/FSAN.jpg',
    location: 'Nador',
  },
  {
    name: 'FEGN',
    fullName: "Faculté d'Économie et de Gestion de Nador",
    logo: '/logos/FEGN.jpg',
    location: 'Nador',
  },
  {
    name: 'ESTN',
    fullName: 'École Supérieure de Technologie de Nador',
    logo: '/logos/ESTN.jpg',
    location: 'Nador',
  },
  {
    name: 'FSJPN',
    fullName: 'Faculté des Sciences Juridiques et Politiques de Nador',
    logo: '/logos/FSJPN.jpg',
    location: 'Nador',
  },
  {
    name: 'FLLAN',
    fullName: 'Faculté des Langues, Lettres et Arts de Nador',
    logo: '/logos/FLLAN.jpg',
    location: 'Nador',
  },
];

export function SupportedUniversitiesBanner() {
  // Répétition suffisante pour assurer une boucle continue.
  const marqueeItems = [...institutions, ...institutions];

  return (
    <section
      aria-labelledby="supported-universities-title"
      className="relative overflow-hidden border-y border-slate-200/70 dark:border-slate-800/80 bg-white dark:bg-slate-950 transition-colors"
    >
      {/* Subtle background */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-50/80 via-white to-slate-50/30 dark:from-slate-950/80 dark:via-slate-900/90 dark:to-slate-950/30" />

      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          <div className="flex items-start gap-3.5">

            {/* Icon */}
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-brand-100 dark:border-brand-800/60 bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 shadow-sm">
              <GraduationCap className="h-5.5 w-5.5" strokeWidth={2} />
            </div>

            {/* Text */}
            <div className="min-w-0">

              <div className="mb-1.5 flex flex-wrap items-center gap-2">

                <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-brand-600 dark:text-brand-400">
                  Campus partenaires
                </span>

                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200/70 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">
                  <CheckCircle2 className="h-2.5 w-2.5" />
                  Couverture active
                </span>

              </div>

              <h2
                id="supported-universities-title"
                className="max-w-2xl text-base font-bold leading-snug text-slate-900 dark:text-white sm:text-lg"
              >
                Des logements vérifiés à proximité de votre campus
              </h2>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                Trouvez facilement un logement proche de votre établissement.
              </p>

            </div>
          </div>

          {/* CTA */}
          <Link
            href="/logements"
            className="group inline-flex w-fit items-center gap-2 rounded-xl border border-brand-200 dark:border-brand-800/80 bg-brand-50/70 dark:bg-brand-950/60 px-4 py-2.5 text-sm font-semibold text-brand-700 dark:text-brand-300 transition-all duration-200 hover:border-brand-300 hover:bg-brand-100 dark:hover:bg-brand-900/60 hover:shadow-sm"
          >
            Voir les logements
            <ArrowRight
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>

        </div>

        {/* Marquee */}
        <div className="relative -mx-4 overflow-hidden px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">

          {/* Left fade */}
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white dark:from-slate-950 via-white/90 dark:via-slate-950/90 to-transparent sm:w-24"
            aria-hidden="true"
          />

          {/* Right fade */}
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white dark:from-slate-950 via-white/90 dark:via-slate-950/90 to-transparent sm:w-24"
            aria-hidden="true"
          />

          <div
            className="flex w-max gap-4 py-2 animate-marquee hover:[animation-play-state:paused] motion-reduce:animate-none"
            aria-label="Établissements partenaires"
          >
            {marqueeItems.map((institution, index) => (
              <article
                key={`${institution.name}-${index}`}
                className="
                  group
                  flex
                  w-[440px]
                  shrink-0
                  items-center
                  gap-4
                  rounded-2xl
                  border
                  border-slate-200/80
                  dark:border-slate-800
                  bg-white
                  dark:bg-slate-900
                  p-3.5
                  shadow-[0_2px_12px_rgba(15,23,42,0.05)]
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:border-brand-200
                  dark:hover:border-brand-700/60
                  hover:shadow-[0_8px_24px_rgba(15,23,42,0.09)]
                  sm:w-[440px]
                "
              >
                {/* Logo - Taille maximisée pour une visibilité optimale */}
                <div
                  className="
                    relative
                    flex
                    h-20
                    w-20
                    shrink-0
                    items-center
                    justify-center
                    overflow-hidden
                    rounded-xl
                    border
                    border-slate-200/70
                    dark:border-slate-700
                    bg-white
                    p-1.5
                    shadow-xs
                    transition-transform
                    duration-300
                    group-hover:scale-105
                    sm:h-24
                    sm:w-24
                  "
                >
                  <Image
                    src={institution.logo}
                    alt={`Logo ${institution.name}`}
                    width={98}
                    height={98}
                    className="h-full w-full object-contain"
                  />
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">

                  <div className="flex items-center justify-between gap-2">

                    <span className="truncate text-base font-bold text-slate-900 dark:text-white">
                      {institution.name}
                    </span>

                    <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:text-slate-300">
                      <MapPin className="h-3 w-3 text-slate-400 dark:text-slate-400" />
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

                {/* Verified indicator */}
                <CheckCircle2
                  className="h-4 w-4 shrink-0 text-emerald-500 opacity-70 transition-opacity group-hover:opacity-100"
                  aria-label="Établissement couvert"
                />

              </article>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex flex-col items-center justify-center gap-1 text-center sm:flex-row sm:gap-2">

          <span className="text-[11px] font-medium text-slate-400">
            5 établissements actuellement couverts
          </span>

          <span
            className="hidden text-slate-300 sm:inline"
            aria-hidden="true"
          >
            •
          </span>

          <span className="text-[11px] text-slate-400">
            Selouane & Nador
          </span>

          <span
            className="hidden text-slate-300 sm:inline"
            aria-hidden="true"
          >
            •
          </span>

          <span className="text-[11px] text-slate-400">
            D'autres établissements arrivent bientôt
          </span>

        </div>

      </div>
    </section>
  );
}
