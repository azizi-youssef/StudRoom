import React from 'react';
import { Home, MapPin, Wifi, Key } from 'lucide-react';

export function BenefitsSection() {
  const benefits = [
    {
      icon: Home,
      title: '🏠 Meublé',
      description: 'Tout ce dont tu as besoin pour t\'installer rapidement : lit orthopédique, bureau de travail et cuisine équipée.',
    },
    {
      icon: MapPin,
      title: '📍 Proche',
      description: 'Des logements rigoureusement sélectionnés à proximité immédiate de la Faculté (FSP), l\'EST et l\'ISTA Selouane.',
    },
    {
      icon: Wifi,
      title: '📶 Confort',
      description: 'Wi-Fi haut débit fibre optique, espaces de travail silencieux et équipements essentiels inclus.',
    },
    {
      icon: Key,
      title: '🔑 Simple',
      description: 'Une expérience de location 100% pensée pour les étudiants, sans démarches complexes ni mauvaise surprise.',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-widest bg-brand-50 px-3 py-1 rounded-full border border-brand-100">
            L'Expérience StudRoom
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
            Pourquoi choisir StudRoom ?
          </h2>
          <p className="text-slate-600 text-base sm:text-lg mt-3 leading-relaxed">
            Nous ne sommes pas une simple agence immobilière. StudRoom est une marque créée pour simplifier la vie des étudiants au Maroc.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div
                key={idx}
                className="bg-slate-50 hover:bg-white p-8 rounded-3xl border border-slate-100 hover:border-brand-200 shadow-soft hover:shadow-hover transition-all duration-300 flex flex-col gap-4 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-brand-100 text-brand-600 flex items-center justify-center group-hover:bg-brand-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  {b.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {b.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
