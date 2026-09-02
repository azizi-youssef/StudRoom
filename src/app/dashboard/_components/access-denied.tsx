'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldX, ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AccessDeniedProps {
  reason?: 'unauthenticated' | 'forbidden';
}

export function AccessDenied({ reason = 'forbidden' }: AccessDeniedProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="w-20 h-20 rounded-3xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-6">
          <ShieldX className="w-10 h-10" />
        </div>

        {/* Badge */}
        <span className="inline-block text-xs font-bold text-rose-600 uppercase tracking-widest bg-rose-50 px-3.5 py-1 rounded-full border border-rose-100 mb-4">
          {reason === 'unauthenticated' ? '401 — Non authentifié' : '403 — Accès refusé'}
        </span>

        {/* Title */}
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-3">
          {reason === 'unauthenticated'
            ? 'Connexion requise'
            : 'Zone administrateur'}
        </h1>

        {/* Description */}
        <p className="text-slate-500 text-sm leading-relaxed mb-8">
          {reason === 'unauthenticated'
            ? 'Vous devez être connecté pour accéder à cette page. Veuillez vous identifier.'
            : "Cette section est réservée aux administrateurs StudRoom. Votre compte n'est pas autorisé à accéder au tableau de bord."}
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/">
            <Button variant="outline" size="md" className="font-bold border-slate-200">
              <Home className="w-4 h-4 mr-2" />
              Accueil
            </Button>
          </Link>
          {reason === 'unauthenticated' && (
            <Link href="/connexion">
              <Button variant="primary" size="md" className="font-bold shadow-soft">
                Se connecter
              </Button>
            </Link>
          )}
          {reason === 'forbidden' && (
            <Link href="/logements">
              <Button variant="primary" size="md" className="font-bold shadow-soft">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voir les logements
              </Button>
            </Link>
          )}
        </div>

        {/* Branding */}
        <p className="mt-10 text-xs text-slate-400">
          StudRoom — Logement étudiant Selouane / Nador
        </p>
      </div>
    </div>
  );
}
