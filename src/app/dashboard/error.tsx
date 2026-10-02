'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, RefreshCw, LayoutDashboard } from 'lucide-react';

/**
 * Error boundary pour le dashboard admin.
 */
export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="p-6 xl:p-8 flex items-center justify-center min-h-[60vh]">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-8 h-8 text-red-600 dark:text-red-400" />
        </div>

        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Erreur du tableau de bord
        </h1>

        <p className="leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>
          Impossible de charger les données du tableau de bord. 
          Vérifiez votre connexion au serveur backend.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-semibold transition-colors"
            style={{ backgroundColor: 'var(--brand-primary)' }}
          >
            <RefreshCw className="w-4 h-4" />
            Réessayer
          </button>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-colors"
            style={{
              border: '1px solid var(--border-default)',
              color: 'var(--text-secondary)',
            }}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <p className="mt-6 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
            {error.message}
            {error.digest && ` · Digest: ${error.digest}`}
          </p>
        )}
      </div>
    </div>
  );
}
