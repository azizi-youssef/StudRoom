import React from 'react';
import { LandlordForm } from '@/components/forms/landlord-form';
import { ShieldCheck, TrendingUp, Sparkles, Building2, Wrench, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Espace Propriétaires — Confiez votre bien à StudRoom',
  description: 'Confiez votre appartement ou studio à Selouane et Nador à StudRoom. Gestion simplifiée, loyers garantis et étudiants vérifiés.',
};

export default function ProprietairesPage() {
  const benefits = [
    {
      icon: TrendingUp,
      title: 'Occupation optimisée',
      desc: 'Taux d’occupation maximal grâce à la forte demande étudiante des facultés FSP et EST Nador.',
    },
    {
      icon: ShieldCheck,
      title: 'Gestion simplifiée',
      desc: 'StudRoom s’occupe de tout : sélection des candidats, état des lieux, rédaction des contrats et gestion quotidienne.',
    },
    {
      icon: Wrench,
      title: 'Logement entretenu',
      desc: 'Entretien régulier et prise en charge des menues réparations par notre équipe technique locale.',
    },
    {
      icon: Sparkles,
      title: 'Accompagnement dédié',
      desc: 'Un interlocuteur unique StudRoom pour un partenariat en toute confiance et transparence.',
    },
  ];

  return (
    <div className="pt-28 pb-24 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Banner */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-brand-950 text-white rounded-3xl p-8 sm:p-14 shadow-2xl mb-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl relative z-10 flex flex-col gap-4">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30 w-fit">
              <Building2 className="w-4 h-4" />
              Partenariat Propriétaire StudRoom
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Votre logement mérite plus qu'un simple locataire.
            </h1>
            <p className="text-slate-300 text-base sm:text-xl font-normal leading-relaxed">
              Confiez votre appartement ou studio à une marque spécialisée dans le logement étudiant à Selouane et Nador.
            </p>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Pourquoi nous confier votre bien ?
            </h2>
            <p className="text-slate-500 text-sm mt-2">
              Transformez votre bien immobilier en un investissement serein et rentable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((b, idx) => {
              const Icon = b.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-8 rounded-3xl border border-slate-200 shadow-soft hover:shadow-hover transition-all duration-300 flex flex-col gap-4"
                >
                  <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-600 flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900">{b.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{b.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Section */}
        <div id="form-proposer" className="max-w-4xl mx-auto">
          <LandlordForm />
        </div>

      </div>
    </div>
  );
}
