import React from 'react';
import Link from 'next/link';
import { Building2, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function LandlordBanner() {
  return (
    <section className="py-16 sm:py-20 bg-slate-900 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700/60 rounded-3xl p-8 sm:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl">
          
          <div className="flex flex-col gap-4 text-center lg:text-left max-w-2xl">
            <div className="inline-flex items-center justify-center lg:justify-start gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30">
                <Building2 className="w-4 h-4" />
                Espace Propriétaires
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Vous possédez un bien à Selouane ou Nador ?
            </h2>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              Confiez votre appartement à StudRoom : gestion simplifiée, locataires étudiants sélectionnés, rendement optimisé et entretien régulier.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <Link href="/proprietaires" className="w-full sm:w-auto">
              <Button variant="accent" size="lg" className="w-full justify-center text-base font-bold px-8">
                Proposer mon logement
                <ArrowRight className="w-5 h-5 ml-1" />
              </Button>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
