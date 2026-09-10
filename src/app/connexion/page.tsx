'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/context/auth-context';
import { loginSchema, LoginValues } from '@/shared/validation/auth.schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  LogIn,
  Mail,
  Lock,
  ShieldCheck,
  AlertCircle,
  Loader2,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
  Building2,
  GraduationCap,
  MapPin,
} from 'lucide-react';
import { GoogleButton } from '@/components/auth/google-button';

export default function ConnexionPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  React.useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const onSubmit = async (data: LoginValues) => {
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const res = await login(data);
      if (res.success) {
        router.push('/');
      } else {
        setErrorMessage(res.message || 'Identifiants invalides. Veuillez vérifier votre e-mail et mot de passe.');
      }
    } catch (err) {
      setErrorMessage('Une erreur est survenue lors de la connexion au serveur.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen pt-28 pb-20 flex items-center justify-center bg-gradient-to-b from-slate-50 via-white to-slate-100/70 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-4 transition-colors">
      
      {/* Ambient background lighting */}
      <div className="pointer-events-none absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-brand-500/10 dark:bg-brand-600/15 rounded-full blur-3xl -z-10" />
      <div className="pointer-events-none absolute bottom-10 right-10 w-[400px] h-[400px] bg-emerald-500/10 dark:bg-emerald-600/10 rounded-full blur-3xl -z-10" />

      <div className="max-w-5xl w-full mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 rounded-3xl lg:rounded-4xl overflow-hidden border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl shadow-slate-200/50 dark:shadow-none">
          
          {/* Left Column: Connection Form */}
          <div className="lg:col-span-7 p-7 sm:p-10 lg:p-12 flex flex-col justify-between">
            <div>
              {/* Header Badge & Title */}
              <div className="mb-7">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200/80 dark:border-brand-800/80 mb-3">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                  Espace Sécurisé StudRoom
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                  Bon retour parmi nous 👋
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1.5 leading-relaxed">
                  Connectez-vous pour suivre vos réservations, planifier une visite ou gérer vos biens à Selouane.
                </p>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="mb-5 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs font-medium flex items-start gap-2.5 animate-fade-in shadow-2xs">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{errorMessage}</span>
                </div>
              )}

              {/* Google OAuth Button */}
              <div className="mb-5">
                <GoogleButton
                  label="Continuer avec Google"
                  onError={(msg) => setErrorMessage(msg)}
                />

                <div className="relative flex py-4 items-center">
                  <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
                  <span className="shrink-0 mx-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    ou par e-mail
                  </span>
                  <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                {/* Email Field */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Adresse Email *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <Input
                      {...registerField('email')}
                      type="email"
                      placeholder="votre.email@etudiant.ma"
                      className="pl-10 h-11 text-xs sm:text-sm rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-brand-500/20"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-rose-500 font-semibold mt-1">{errors.email.message}</p>
                  )}
                </div>

                {/* Password Field with Eye toggle */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Mot de passe *
                    </label>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors cursor-pointer">
                      Mot de passe oublié ?
                    </span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <Input
                      {...registerField('password')}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="pl-10 pr-10 h-11 text-xs sm:text-sm rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-brand-500/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
                      title={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-rose-500 font-semibold mt-1">{errors.password.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full font-bold h-12 text-sm rounded-xl shadow-md shadow-brand-600/20 hover:shadow-lg hover:shadow-brand-600/30 hover:-translate-y-0.5 transition-all mt-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      <span>Connexion en cours...</span>
                    </>
                  ) : (
                    <>
                      <span>Se connecter</span>
                      <LogIn className="w-4 h-4 ml-1.5" />
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Bottom Footer Switch */}
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 text-center sm:text-left">
              <span>Vous n'avez pas encore de compte ?</span>
              <Link
                href="/inscription"
                className="font-bold text-brand-600 dark:text-brand-400 hover:underline inline-flex items-center gap-1"
              >
                <span>Créer un compte</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Right Column: Branded Visual Showcase Panel (Desktop) */}
          <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-brand-950 via-slate-900 to-slate-950 text-white p-10 flex-col justify-between relative overflow-hidden border-l border-slate-800">
            {/* Ambient inner glow */}
            <div className="pointer-events-none absolute -top-20 -right-20 w-64 h-64 bg-brand-500/20 rounded-full blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-20 w-64 h-64 bg-teal-500/15 rounded-full blur-3xl" />

            <div className="relative z-10">
              {/* Logo / Brand badge */}
              <div className="flex items-center gap-2.5 mb-8">
                <div className="w-10 h-10 rounded-xl bg-brand-600/30 border border-brand-400/30 flex items-center justify-center shadow-xs">
                  <Building2 className="w-5 h-5 text-brand-400" />
                </div>
                <div>
                  <span className="text-base font-black tracking-tight text-white">StudRoom</span>
                  <p className="text-[10px] text-brand-300 font-semibold uppercase tracking-wider">Selouane &bull; Nador</p>
                </div>
              </div>

              {/* Catchphrase */}
              <h2 className="text-2xl font-black text-white leading-tight tracking-tight mb-3">
                Votre logement étudiant idéal,{' '}
                <span className="bg-gradient-to-r from-teal-300 to-brand-300 bg-clip-text text-transparent">
                  sans stress.
                </span>
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed mb-6">
                Rejoignez des centaines d'étudiants installés dans des résidences calmes, meublées et ultra-proches des facultés.
              </p>

              {/* Feature Points */}
              <div className="flex flex-col gap-3">
                <div className="flex items-start gap-3 bg-white/5 border border-white/10 p-3 rounded-2xl backdrop-blur-xs">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">À 3 min à pied des Facultés</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">FPN Selouane, EST Nador & campus Al Omrane.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white/5 border border-white/10 p-3 rounded-2xl backdrop-blur-xs">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Bail conforme & Légal</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">Valable pour la bourse et carte de séjour.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white/5 border border-white/10 p-3 rounded-2xl backdrop-blur-xs">
                  <div className="w-7 h-7 rounded-lg bg-brand-500/20 text-brand-300 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Support Local Réactif</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">Équipe sur place et assistance WhatsApp 6j/7.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom mini-card quote */}
            <div className="relative z-10 pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-brand-400" />
                Secteur Al Omrane, Selouane
              </span>
              <span className="font-semibold text-teal-300">
                100% Vérifié
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
