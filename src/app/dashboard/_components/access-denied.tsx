'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldX, ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFocusTrap } from '@/lib/focus-trap';

interface AccessDeniedProps {
  reason?: 'unauthenticated' | 'forbidden';
}

export function AccessDenied({ reason = 'forbidden' }: AccessDeniedProps) {
  const containerRef = useFocusTrap(true);

  return (
    <div
      ref={containerRef}
      className="min-h-screen flex items-center justify-center p-6"
      style={{ backgroundColor: 'var(--bg-page)' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="access-denied-title"
    >
      <div
        className="max-w-md w-full text-center dash-card p-8 rounded-3xl"
        style={{ backgroundColor: 'var(--bg-card)' }}
      >
        {/* Icon */}
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 border"
          style={{
            backgroundColor: 'var(--error-bg)',
            borderColor: 'var(--error-border)',
            color: 'var(--error-fg)',
          }}
        >
          <ShieldX className="w-8 h-8" />
        </div>

        {/* Badge */}
        <span className="inline-block text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full badge-danger mb-4">
          {reason === 'unauthenticated' ? '401 — Non authentifié' : '403 — Accès refusé'}
        </span>

        {/* Title */}
        <h1
          id="access-denied-title"
          className="text-2xl font-bold tracking-tight mb-2"
          style={{ color: 'var(--text-primary)' }}
        >
          {reason === 'unauthenticated' ? 'Connexion requise' : 'Zone administrateur'}
        </h1>

        {/* Description */}
        <p className="text-xs leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>
          {reason === 'unauthenticated'
            ? 'Vous devez être connecté pour accéder à cette page. Veuillez vous identifier.'
            : "Cette section est réservée aux administrateurs StudRoom. Votre compte n'est pas autorisé à accéder au tableau de bord."}
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/">
            <Button variant="outline" size="md" className="dash-card font-semibold text-xs" style={{ color: 'var(--text-secondary)' }}>
              <Home className="w-4 h-4 mr-2" />
              Accueil
            </Button>
          </Link>
          {reason === 'unauthenticated' && (
            <Link href="/connexion">
              <Button variant="primary" size="md" className="btn-brand font-semibold text-xs text-white shadow-sm">
                Se connecter
              </Button>
            </Link>
          )}
          {reason === 'forbidden' && (
            <Link href="/logements">
              <Button variant="primary" size="md" className="btn-brand font-semibold text-xs text-white shadow-sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voir les logements
              </Button>
            </Link>
          )}
        </div>

        {/* Branding */}
        <p className="mt-8 text-[11px]" style={{ color: 'var(--text-muted)' }}>
          StudRoom — Logement étudiant Selouane / Nador
        </p>
      </div>
    </div>
  );
}
