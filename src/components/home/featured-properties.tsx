import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { PropertyDetail } from '@/shared/types';
import { PropertyCard } from '@/components/properties/property-card';
import { Button } from '@/components/ui/button';

interface FeaturedPropertiesProps {
  properties: PropertyDetail[];
}

export function FeaturedProperties({ properties }: FeaturedPropertiesProps) {
  return (
    <section className="py-20 sm:py-28 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-700 dark:text-primary-300 uppercase tracking-wider bg-primary-50 dark:bg-primary-950/60 px-3.5 py-1.5 rounded-full border border-primary-200/70 dark:border-primary-800/60 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
              Sélection Coup de Cœur · Selouane & Nador
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight mt-3">
              Découvre ton prochain chez-toi
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-base mt-2.5 leading-relaxed">
              Des résidences étudiantes modernes et des appartements meublés prêts à vivre à moins de 10 minutes des amphis.
            </p>
          </div>

          <Link href="/logements">
            <Button variant="outline" size="md" className="hidden md:inline-flex rounded-full border-slate-200/90 hover:border-primary-300 font-bold text-xs shadow-xs hover:bg-white dark:hover:bg-slate-800 px-5">
              Explorer tous les logements
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
        </div>

        {/* Properties Grid */}
        {properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.slice(0, 6).map((property, i) => (
              <div key={property.id} className={`sr-fade-up [&>*]:h-full ${i % 3 === 1 ? 'sr-delay-1' : i % 3 === 2 ? 'sr-delay-2' : ''}`}>
                <PropertyCard property={property} />
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 bg-white/60 dark:bg-slate-900/60 px-6 py-14 text-center">
            <p className="text-lg font-bold text-slate-900 dark:text-white">Les logements arrivent bientôt</p>
            <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300">
              Notre sélection est en cours de mise à jour. Consultez le catalogue complet ou contactez-nous.
            </p>
            <Link href="/logements" className="inline-block mt-5">
              <Button variant="primary" size="md" className="rounded-full font-bold">Voir le catalogue</Button>
            </Link>
          </div>
        )}

        {/* Mobile View All CTA */}
        <div className="mt-12 text-center md:hidden">
          <Link href="/logements">
            <Button variant="primary" size="lg" className="w-full justify-center rounded-2xl font-bold shadow-soft">
              Explorer tous les logements →
            </Button>
          </Link>
        </div>

      </div>
    </section>
  );
}
