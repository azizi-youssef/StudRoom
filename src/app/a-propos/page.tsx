import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, Heart, Users, Compass, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'À propos — La Marque StudRoom',
  description: 'Découvrez la vision de StudRoom : une marque de logement étudiant moderne, confortable et proche des campus au Maroc.',
};

export default function AProposPage() {
  const pillars = [
    {
      icon: ShieldCheck,
      title: 'Confiance & Transparence',
      desc: 'Aucuns frais cachés, baux clairs et conformes à la réglementation marocaine.',
    },
    {
      icon: Heart,
      title: 'Confort Prêt à Vivre',
      desc: 'Des logements entièrement meublés, lumineux, propres et équipés pour travailler efficacement.',
    },
    {
      icon: Compass,
      title: 'Proximité Campus',
      desc: 'Emplacements stratégiques à Selouane et Nador pour réduire au maximum les temps de transport.',
    },
    {
      icon: Users,
      title: 'Esprit Communauté',
      desc: 'Des colocations et résidences favorisant l’entraide, les études et la convivialité.',
    },
  ];

  return (
    <div className="pt-28 pb-24 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-widest bg-brand-50 px-3.5 py-1 rounded-full border border-brand-100">
            Notre Mission
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mt-3">
            Redéfinir le logement étudiant au Maroc
          </h1>
          <p className="text-slate-600 text-base sm:text-xl mt-4 leading-relaxed font-medium">
            StudRoom transforme la recherche d'un logement étudiant en une expérience simple, confortable et accessible.
          </p>
        </div>

        {/* Narrative Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
          <div className="lg:col-span-6 relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/3]">
            <Image
              src="/images/studroom_hero.jpg"
              alt="Espace de vie StudRoom Selouane"
              fill
              className="object-cover"
            />
          </div>

          <div className="lg:col-span-6 flex flex-col gap-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Ni une université, ni une agence classique.
            </h2>
            <p className="text-slate-600 text-base leading-relaxed">
              StudRoom est une **marque de student living** qui sélectionne, rénove, meuble et gère des espaces de vie pensés sur mesure pour la réussite des étudiants.
            </p>
            <p className="text-slate-600 text-base leading-relaxed">
              En démarrant à **Selouane / Al Omrane, Nador**, nous répondons au besoin fondamental des milliers d'étudiants fréquentant la Faculté Pluridisciplinaire, l'EST Nador et les écoles supérieures environnantes : trouver une chambre saine, calme, bien meublée et ultra-proche des amphis.
            </p>

            <div className="flex flex-col gap-2 pt-2">
              <span className="flex items-center gap-2 text-sm font-bold text-slate-800">
                <CheckCircle2 className="w-5 h-5 text-brand-600" />
                Accompagnement humain et réactif
              </span>
              <span className="flex items-center gap-2 text-sm font-bold text-slate-800">
                <CheckCircle2 className="w-5 h-5 text-brand-600" />
                Standardisation de la qualité et du Wi-Fi
              </span>
              <span className="flex items-center gap-2 text-sm font-bold text-slate-800">
                <CheckCircle2 className="w-5 h-5 text-brand-600" />
                Vision nationale marocaine
              </span>
            </div>
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900">Les 4 Engagements StudRoom</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pillars.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-8 rounded-3xl border border-slate-200 shadow-soft flex flex-col gap-4"
                >
                  <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-600 flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900">{p.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{p.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-brand-600 text-white rounded-3xl p-10 text-center flex flex-col items-center gap-6 shadow-xl">
          <h2 className="text-2xl sm:text-4xl font-black">Prêt à trouver ton logement à Selouane ?</h2>
          <p className="text-brand-100 max-w-xl text-base">
            Découvre nos offres disponibles pour cette rentrée et réserve ta chambre en quelques clics.
          </p>
          <Link href="/logements">
            <Button variant="accent" size="lg" className="font-extrabold px-8 py-4">
              Explorer les logements
              <ArrowRight className="w-5 h-5 ml-1" />
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}
