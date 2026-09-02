import React from 'react';
import Link from 'next/link';
import { ArrowRight, Search, Eye, Send, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HowItWorksPreview() {
  const steps = [
    {
      num: '01',
      icon: Search,
      title: 'Choisis',
      desc: 'Trouve le logement qui correspond à ton budget, ta localisation et tes besoins universitaires.',
    },
    {
      num: '02',
      icon: Eye,
      title: 'Découvre',
      desc: 'Consulte les photos HD, les équipements, la distance exacte et planifie une visite.',
    },
    {
      num: '03',
      icon: Send,
      title: 'Réserve',
      desc: 'Envoie ta demande de réservation directement en ligne en moins de 2 minutes.',
    },
    {
      num: '04',
      icon: Key,
      title: 'Installe-toi',
      desc: 'Récupère tes clés et commence ta nouvelle vie étudiante sereinement.',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-widest bg-brand-50 px-3.5 py-1 rounded-full border border-brand-100">
            Simple & Rapide
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
            Comment ça marche ?
          </h2>
          <p className="text-slate-600 text-base sm:text-lg mt-3">
            4 étapes simples pour trouver et réserver ton logement étudiant en toute confiance.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="bg-slate-50 p-8 rounded-3xl border border-slate-100 flex flex-col gap-4 relative group hover:border-brand-200 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white flex items-center justify-center font-bold shadow-soft">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-3xl font-black text-slate-300 group-hover:text-brand-400 transition-colors">
                    {s.num}
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 mt-2">{s.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{s.desc}</p>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link href="/comment-ca-marche">
            <Button variant="secondary" size="lg" className="font-bold">
              En savoir plus & FAQ complète
              <ArrowRight className="w-5 h-5 ml-1" />
            </Button>
          </Link>
        </div>

      </div>
    </section>
  );
}
