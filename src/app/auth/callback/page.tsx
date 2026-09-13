'use client';

import React, { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { clientAuthService } from '@/client/services/auth.service';
import { useAuth } from '@/context/auth-context';
import { Loader2, CheckCircle2, AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';

function AuthCallbackContent() {
  const searchParams = useSearchParams();
  const { setSession } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [errorDetails, setErrorDetails] = useState('');
  const processedRef = useRef(false);

  useEffect(() => {
    // Check if error is present in URL query params
    const urlError = searchParams.get('error') || searchParams.get('error_code');
    const urlErrorDesc = searchParams.get('error_description');

    if (urlError || urlErrorDesc) {
      setStatus('error');
      if (urlErrorDesc?.toLowerCase().includes('rate limit') || urlError?.includes('rate_limit') || urlErrorDesc?.includes('trop de')) {
        setErrorMessage('Trop de tentatives en peu de temps.');
        setErrorDetails('Supabase a activé une sécurité temporaire anti-spam. Veuillez patienter 2 à 3 minutes avant de réessayer.');
      } else if (urlErrorDesc?.toLowerCase().includes('provider is not enabled') || urlError?.includes('provider_disabled')) {
        setErrorMessage('Le fournisseur Google n’est pas encore activé.');
        setErrorDetails('Veuillez activer Google dans votre tableau de bord Supabase (Authentication > Providers > Google).');
      } else {
        setErrorMessage(urlErrorDesc || 'Échec de l’authentification Google.');
      }
      return;
    }

    if (processedRef.current) return;

    async function syncOAuthUser() {
      try {
        const supabase = getSupabaseBrowserClient();
        
        // Retrieve current session from Supabase
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        if (session?.user) {
          await completeLogin(session.user, session.access_token);
          return;
        }

        // If session not ready yet, wait for onAuthStateChange
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
          if (currentSession?.user && !processedRef.current) {
            subscription.unsubscribe();
            await completeLogin(currentSession.user, currentSession.access_token);
          }
        });

        // Timeout safety
        setTimeout(() => {
          if (!processedRef.current && status === 'loading') {
            setStatus('error');
            setErrorMessage('Délai d’attente dépassé.');
            setErrorDetails('Impossible de récupérer la session utilisateur Google. Veuillez réessayer.');
          }
        }, 7000);
      } catch (err: any) {
        console.error('OAuth Callback Error:', err);
        setStatus('error');
        const msg = err.message || '';
        if (msg.toLowerCase().includes('rate limit') || msg.toLowerCase().includes('trop de')) {
          setErrorMessage('Trop de requêtes envoyées.');
          setErrorDetails('Veuillez patienter 2 à 3 minutes avant de retenter la connexion.');
        } else {
          setErrorMessage(msg || 'Une erreur est survenue lors de la connexion Google.');
        }
      }
    }

    async function completeLogin(user: any, accessToken?: string) {
      if (processedRef.current) return;
      processedRef.current = true;

      const email = user.email;
      const fullName = user.user_metadata?.full_name || user.user_metadata?.name || email?.split('@')[0] || 'Utilisateur Google';
      const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture;

      if (!email) {
        throw new Error('Aucune adresse email trouvée.');
      }

      // Synchronize with StudRoom Express backend with cryptographically secure token
      const res = await clientAuthService.oauthLogin({
        accessToken,
        email,
        fullName,
        avatarUrl,
      });

      if (res.success && res.data) {
        setSession(res.data.user as any);
        setStatus('success');
        
        // Full page reload redirect to guarantee fresh state everywhere
        setTimeout(() => {
          window.location.href = '/';
        }, 500);
      } else {
        throw new Error(res.error?.message || 'Erreur de synchronisation avec le serveur StudRoom.');
      }
    }

    syncOAuthUser();
  }, [searchParams, setSession, status]);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100/70 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4 transition-colors">
      
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary-500/10 dark:bg-primary-600/15 rounded-full blur-3xl -z-10" />

      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-10 border border-slate-200/90 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none text-center relative z-10">
        {status === 'loading' && (
          <div className="flex flex-col items-center py-6">
            <div className="w-16 h-16 rounded-2xl bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 flex items-center justify-center mb-4 border border-primary-100 dark:border-primary-800/80 shadow-xs">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Connexion Google en cours...
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-2">
              Nous synchronisons votre profil StudRoom en toute sécurité.
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center py-6 animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 border border-emerald-100 dark:border-emerald-800/80 shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Connexion réussie !
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-2">
              Bienvenue sur StudRoom. Redirection vers l'accueil...
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center py-4 animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4 border border-rose-100 dark:border-rose-800/80 shadow-xs">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Échec de la connexion
            </h2>
            <p className="text-rose-600 dark:text-rose-400 text-sm mt-2 font-bold">
              {errorMessage}
            </p>
            {errorDetails && (
              <p className="text-slate-600 dark:text-slate-300 text-xs mt-2 leading-relaxed bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-700 text-left">
                💡 {errorDetails}
              </p>
            )}
            <div className="mt-6 flex flex-col sm:flex-row gap-2.5 w-full justify-center">
              <Link
                href="/connexion"
                className="px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Retour à la connexion
              </Link>
              <button
                type="button"
                onClick={() => {
                  window.location.reload();
                }}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Réessayer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100/70 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-2xl text-center">
            <div className="flex flex-col items-center py-6">
              <div className="w-16 h-16 rounded-2xl bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 flex items-center justify-center mb-4 border border-primary-100 dark:border-primary-800/80 shadow-xs">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                Chargement...
              </h2>
            </div>
          </div>
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
