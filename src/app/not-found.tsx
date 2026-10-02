'use client';

import React from 'react';
import Link from 'next/link';
import { Home, Search, ArrowLeft } from 'lucide-react';

/**
 * Page 404 globale.
 * Affichée par Next.js App Router pour toute route non trouvée.
 */
export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* Large 404 */}
        <div className="mb-6">
          <span
            className="text-[120px] font-black leading-none"
            style={{
              background: 'linear-gradient(135deg, var(--brand-primary, #6366f1), var(--brand-accent, #8b5cf6))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            404
          </span>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">
          Page introuvable
        </h1>

        {/* Description */}
        <p className="text-slate-500 dark:text-slate-400 mb-10 leading-relaxed">
          La page que vous recherchez n'existe pas ou a été déplacée.
          <br />
          Essayez de rechercher un logement ou revenez à l'accueil.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-colors"
          >
            <Home className="w-4 h-4" />
            Accueil
          </Link>
          <Link
            href="/logements"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold transition-colors"
          >
            <Search className="w-4 h-4" />
            Voir les logements
          </Link>
        </div>

        {/* Back link */}
        <button
          onClick={() => typeof window !== 'undefined' && window.history.back()}
          className="mt-6 inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à la page précédente
        </button>
      </div>
    </div>
  );
}
