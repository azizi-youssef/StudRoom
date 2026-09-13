'use client';

import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Search,
  Eye,
  Send,
  Key,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Compass,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HowItWorksPreview() {
  const iconRef = useRef<HTMLDivElement>(null);
  const [connectorTop, setConnectorTop] = useState(52);

  useEffect(() => {
    const updateConnector = () => {
      if (iconRef.current) {
        const rect = iconRef.current.getBoundingClientRect();
        setConnectorTop(rect.height / 2 + 24); // 24px = p-6 top padding
      }
    };
    updateConnector();
    window.addEventListener('resize', updateConnector);
    return () => window.removeEventListener('resize', updateConnector);
  }, []);
  const steps = [
    {
      num: '01',
      icon: Search,
      badge: 'Filtres intelligents',
      title: 'Explore & Compare',
      desc: 'Filtre selon ta faculté (FSAN, FEGN, ESTN...), ton budget max, le quartier et les équipements souhaités.',
      tags: ['Proche campus', 'Prix tout inclus'],
      gradient: 'from-primary-600 to-teal-500',
      shadowColor: 'shadow-primary-500/20',
    },
    {
      num: '02',
      icon: Eye,
      badge: 'Transparence totale',
      title: 'Inspecte en détails',
      desc: 'Photos HD réelles, distance exacte à pied des amphis, équipements certifiés et planifie une visite en 1 clic.',
      tags: ['Logements vérifiés', 'Visite sur place'],
      gradient: 'from-cyan-600 to-blue-600',
      shadowColor: 'shadow-cyan-500/20',
    },
    {
      num: '03',
      icon: Send,
      badge: '0 paperasse',
      title: 'Réserve en ligne',
      desc: 'Transmets ta demande directement sur la plateforme en moins de 2 minutes, sans frais cachés ni intermédiaire.',
      tags: ['Dossier express', 'Réponse sous 24h'],
      gradient: 'from-emerald-600 to-teal-600',
      shadowColor: 'shadow-emerald-500/20',
    },
    {
      num: '04',
      icon: Key,
      badge: 'Clés en main',
      title: 'Installe-toi serein',
      desc: 'Bénéficie d’un état des lieux clair, récupère tes clés et commence tes cours l’esprit tranquille.',
      tags: ['Check-in garanti', 'Support étudiant'],
      gradient: 'from-amber-500 to-orange-500',
      shadowColor: 'shadow-orange-500/20',
    },
  ];

  return (
    <section className="relative overflow-hidden py-24 sm:py-32 bg-gradient-to-b from-slate-50/70 via-white to-slate-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-t border-slate-200/70 dark:border-slate-800/80 transition-colors">
      
      {/* Decorative background blurs */}
      <div
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-primary-100/40 via-teal-100/30 to-transparent dark:from-primary-900/20 dark:via-teal-950/20 blur-3xl opacity-70"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-0 right-0 w-96 h-96 bg-primary-50/50 dark:bg-primary-950/20 rounded-full blur-3xl opacity-60"
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 dark:bg-primary-950/60 border border-primary-200/80 dark:border-primary-800/80 shadow-xs mb-4">
            <Sparkles className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400 animate-pulse" />
            <span className="text-xs font-bold text-primary-700 dark:text-primary-300 uppercase tracking-wider">
              Parcours simple & 100% digital
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Comment trouver ton logement ?
          </h2>

          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg mt-4 leading-relaxed max-w-2xl mx-auto">
            De la première recherche jusqu’à la remise des clés : un processus transparent conçu sur mesure pour les étudiants de Nador & Selouane.
          </p>

          {/* Quick reassurance pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300 shadow-2xs">
              <Clock className="w-3.5 h-3.5 text-primary-500" />
              Réservation en 2 min
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              Logements 100% vérifiés
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300 shadow-2xs">
              <Compass className="w-3.5 h-3.5 text-cyan-500" />
              À proximité directe des amphis
            </span>
          </div>
        </div>

        {/* Steps Grid with connecting line on desktop */}
        <div className="relative">
          
          {/* Connecting line between cards for desktop — dynamically positioned */}
          <div
            className="hidden lg:block absolute left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-primary-200 via-teal-200 to-amber-200 dark:from-primary-900 dark:via-teal-900 dark:to-amber-900 -z-0 pointer-events-none transition-all"
            style={{ top: `${connectorTop}px` }}
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7 relative z-10">
            {steps.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div
                  key={idx}
                  className="group relative flex flex-col justify-between rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs p-6 sm:p-7 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-2 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-[0_20px_40px_-12px_rgba(4,108,122,0.18)]"
                >
                  {/* Top card bar with icon, step number and badge */}
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      
                      {/* Gradient icon box */}
                      <div
                        ref={idx === 0 ? iconRef : undefined}
                        className={`relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr ${s.gradient} text-white shadow-md ${s.shadowColor} transition-all duration-300 group-hover:scale-110 group-hover:rotate-2`}
                      >
                        <Icon className="h-7 w-7" strokeWidth={2.2} />
                      </div>

                      {/* Number Watermark */}
                      <span className="text-3xl sm:text-4xl font-black text-slate-200 dark:text-slate-800 transition-colors duration-300 group-hover:text-primary-500/40">
                        {s.num}
                      </span>
                    </div>

                    {/* Step category badge */}
                    <div className="mb-2.5">
                      <span className="inline-block rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 transition-colors group-hover:bg-primary-50 dark:group-hover:bg-primary-950 group-hover:text-primary-700 dark:group-hover:text-primary-300">
                        {s.badge}
                      </span>
                    </div>

                    {/* Title & Desc */}
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight transition-colors group-hover:text-primary-700 dark:group-hover:text-primary-400">
                      {s.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {s.desc}
                    </p>
                  </div>

                  {/* Micro feature tags at bottom */}
                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-1.5">
                    {s.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="inline-flex items-center gap-1 rounded-full bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 group-hover:bg-primary-50/60 dark:group-hover:bg-primary-950/60 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors"
                      >
                        <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Accent bottom hover line */}
                  <div className="absolute inset-x-7 bottom-0 h-1 bg-gradient-to-r from-primary-500 to-teal-400 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
                </div>
              );
            })}
          </div>

        </div>

        {/* Bottom CTA Block */}
        <div className="mt-14 sm:mt-16 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
          <Link href="/logements">
            <Button
              variant="primary"
              size="lg"
              className="group rounded-full font-bold text-sm px-8 py-3.5 shadow-md shadow-primary-600/25 hover:shadow-lg hover:shadow-primary-600/35 hover:-translate-y-0.5 active:scale-95 transition-all gap-2"
            >
              <span>Trouver mon logement maintenant</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Button>
          </Link>

          <Link href="/a-propos">
            <Button
              variant="outline"
              size="lg"
              className="rounded-full font-semibold text-sm px-7 py-3.5 border-slate-200/90 text-slate-700 hover:border-primary-300 hover:bg-slate-50 shadow-2xs hover:-translate-y-0.5 transition-all"
            >
              Des questions ? Découvrir StudRoom
            </Button>
          </Link>
        </div>

      </div>
    </section>
  );
}

