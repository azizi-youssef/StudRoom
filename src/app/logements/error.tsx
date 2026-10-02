'use client';

import React from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

/**
 * Error boundary pour la page /logements.
 * Affiché automatiquement par Next.js en cas d'erreur durant le rendu.
 */
export default function LogementsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-amber-600 dark:text-amber-400" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          Impossible de charger les logements
        </h1>

        {/* Description */}
        <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
          Une erreur est survenue lors du chargement des logements. 
          Veuillez réessayer ou revenir à l'accueil.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Réessayer
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold transition-colors"
          >
            <Home className="w-4 h-4" />
            Accueil
          </Link>
        </div>

        {/* Digest (development only) */}
        {process.env.NODE_ENV === 'development' && error.digest && (
          <p className="mt-6 text-xs text-slate-400 font-mono">
            Digest: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
