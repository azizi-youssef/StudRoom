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
    <section className="py-16 sm:py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 uppercase tracking-widest bg-brand-100/80 px-3.5 py-1 rounded-full border border-brand-200">
              <Sparkles className="w-3.5 h-3.5" />
              Sélection Selouane / Nador
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
              Découvre ton prochain chez-toi
            </h2>
            <p className="text-slate-600 text-base mt-2 max-w-xl">
              Des résidences et appartements meublés prêts à vivre à proximité des campus universitaires de Selouane.
            </p>
          </div>

          <Link href="/logements">
            <Button variant="outline" size="md" className="hidden md:inline-flex">
              Voir tous les logements ({properties.length})
              <ArrowRight className="w-4 h-4 ml-1" />
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
        <div className="mt-10 text-center md:hidden">
          <Link href="/logements">
            <Button variant="primary" size="lg" className="w-full justify-center">
              Voir tous les logements →
            </Button>
          </Link>
        </div>

      </div>
    </section>
  );
}
