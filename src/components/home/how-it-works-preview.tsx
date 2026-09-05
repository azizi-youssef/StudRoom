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
    <section className="py-24 sm:py-32 bg-slate-50/70 border-t border-slate-200/60 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 uppercase tracking-wider bg-brand-50 px-4 py-1.5 rounded-full border border-brand-200/80 shadow-xs">
            Simple & 100% En Ligne
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mt-3">
            Comment trouver ton logement ?
          </h2>
          <p className="text-slate-600 text-base sm:text-lg mt-3 leading-relaxed">
            Un processus fluide et transparent en 4 étapes pour emménager en toute sérénité.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 relative">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="bg-white p-7 sm:p-8 rounded-3xl border border-slate-200/90 shadow-soft hover:shadow-card hover:-translate-y-1.5 flex flex-col gap-4 relative group transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white flex items-center justify-center font-bold shadow-soft group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-3xl font-black text-slate-200 group-hover:text-brand-400/80 transition-colors">
                    {s.num}
                  </span>
                </div>
                <h3 className="text-xl font-black text-slate-900 mt-2">{s.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{s.desc}</p>

                {/* Micro accent line at bottom */}
                <div className="w-10 h-1 bg-brand-500 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left mt-auto" />
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-14 text-center">
          <Link href="/comment-ca-marche">
            <Button variant="secondary" size="lg" className="rounded-full font-bold text-xs shadow-xs px-8 py-3.5 border-brand-200 hover:border-brand-300 hover:shadow-soft transition-all">
              Découvrir la FAQ & tous les détails
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
        </div>

      </div>
    </section>
  );
}
