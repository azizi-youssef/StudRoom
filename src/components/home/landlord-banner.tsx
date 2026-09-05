import React from 'react';
import Link from 'next/link';
import {
  Building2,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function LandlordBanner() {
  const benefits = [
    'Gestion locative simplifiée & baux conformes',
    'Sélection rigoureuse des locataires étudiants',
    'Entretien technique & état des lieux soigné',
  ];

  return (
    <section className="py-20 sm:py-28 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div
          className="
            relative overflow-hidden
            rounded-4xl
            bg-gradient-to-br from-slate-950 via-slate-900 to-brand-950
            border border-slate-800/80
            px-7 py-12
            sm:px-12 sm:py-16
            lg:px-16 lg:py-16
            shadow-2xl
          "
        >

          {/* Background ambient lighting */}
          <div
            className="
              pointer-events-none
              absolute -right-20 -top-20
              h-96 w-96
              rounded-full
              bg-brand-500/20
              blur-[100px]
            "
          />
          <div
            className="
              pointer-events-none
              absolute -left-20 -bottom-20
              h-80 w-80
              rounded-full
              bg-accent-orange/15
              blur-[90px]
            "
          />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-12">

            {/* Content */}
            <div className="max-w-2xl">

              {/* Label */}
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-400/30 bg-brand-500/10 px-4 py-1.5 backdrop-blur-sm">
                <Building2 className="h-4 w-4 text-brand-400" />
                <span className="text-xs font-black uppercase tracking-wider text-brand-300">
                  Espace Propriétaires & Bailleurs
                </span>
              </div>

              {/* Title */}
              <h2 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                Votre bien immobilier à Selouane mérite{' '}
                <span className="bg-gradient-to-r from-brand-400 to-accent-teal bg-clip-text text-transparent">
                  un rendement serein.
                </span>
              </h2>

              {/* Description */}
              <p className="mt-5 max-w-xl text-base sm:text-lg leading-relaxed text-slate-300 font-normal">
                Vous possédez un studio ou un appartement à Selouane ou Nador ? Confiez-le à StudRoom : nous sélectionnons les locataires, entretenons votre bien et maximisons votre taux d'occupation toute l'année universitaire.
              </p>

              {/* Trust Key Stats */}
              <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-800">
                <div>
                  <div className="text-2xl font-black text-white">+98%</div>
                  <div className="text-xs text-slate-400 mt-0.5">Taux d'occupation</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-brand-400">0 DH</div>
                  <div className="text-xs text-slate-400 mt-0.5">Frais d'adhésion</div>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <div className="text-2xl font-black text-emerald-400">100%</div>
                  <div className="text-xs text-slate-400 mt-0.5">Baux certifiés</div>
                </div>
              </div>

              {/* Benefits checklist */}
              <div className="mt-7 flex flex-col gap-2.5">
                {benefits.map((benefit) => (
                  <div
                    key={benefit}
                    className="flex items-center gap-2.5 text-sm text-slate-300"
                  >
                    <CheckCircle2 className="h-4 w-4 text-brand-400 flex-shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Box */}
            <div className="shrink-0 flex flex-col items-center lg:items-end">
              <div className="p-6 sm:p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col items-center text-center gap-4 w-full sm:w-80 shadow-card">
                <span className="text-xs font-black uppercase tracking-wider text-brand-300">
                  Estimation gratuite
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Découvrez combien votre bien peut rapporter chaque mois avec StudRoom.
                </p>
                <Link href="/proprietaires" className="w-full">
                  <Button
                    variant="accent"
                    size="lg"
                    className="
                      w-full
                      justify-center
                      font-black
                      text-sm
                      rounded-2xl
                      shadow-glow-accent
                      py-4
                    "
                  >
                    Proposer mon bien
                    <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Button>
                </Link>

                <p className="text-[11px] text-slate-400">
                  Réponse sous 24h · Sans engagement
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}