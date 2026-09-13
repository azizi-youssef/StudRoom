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
    <section className="py-20 sm:py-28 bg-slate-50/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-700 uppercase tracking-wider bg-primary-50 px-3.5 py-1.5 rounded-full border border-primary-200/70 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-primary-600" />
              Sélection Coup de Cœur · Selouane & Nador
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mt-3">
              Découvre ton prochain chez-toi
            </h2>
            <p className="text-slate-600 text-base mt-2.5 leading-relaxed">
              Des résidences étudiantes modernes et des appartements meublés prêts à vivre à moins de 10 minutes des amphis.
            </p>
          </div>

          <Link href="/logements">
            <Button variant="outline" size="md" className="hidden md:inline-flex rounded-full border-slate-200/90 hover:border-primary-300 font-bold text-xs shadow-xs hover:bg-white px-5">
              Explorer tous les logements ({properties.length})
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.slice(0, 3).map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        {/* Mobile View All CTA */}
        <div className="mt-12 text-center md:hidden">
          <Link href="/logements">
            <Button variant="primary" size="lg" className="w-full justify-center rounded-2xl font-bold shadow-soft">
              Explorer tous les logements ({properties.length}) →
            </Button>
          </Link>
        </div>

      </div>
    </section>
  );
}
