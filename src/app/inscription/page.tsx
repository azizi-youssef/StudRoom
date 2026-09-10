'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/context/auth-context';
import { registerSchema, RegisterValues } from '@/shared/validation/auth.schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  UserPlus,
  Mail,
  Lock,
  User,
  Phone,
  ShieldCheck,
  AlertCircle,
  Loader2,
  ArrowRight,
  Eye,
  EyeOff,
  Building2,
  CheckCircle2,
  GraduationCap,
  Sparkles,
  MapPin,
} from 'lucide-react';
import { GoogleButton } from '@/components/auth/google-button';

export default function InscriptionPage() {
  const router = useRouter();
  const { register: registerAuth, isAuthenticated } = useAuth();
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register: registerField,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      password: '',
      role: 'student',
    },
  });

  const selectedRole = watch('role');

  React.useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const onSubmit = async (data: RegisterValues) => {
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const res = await registerAuth(data);
      if (res.success) {
        router.push('/');
      } else {
        setErrorMessage(res.message || 'Erreur lors de la création de compte. Veuillez réessayer.');
      }
    } catch (err) {
      setErrorMessage('Une erreur est survenue lors de la création du compte.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen pt-28 pb-20 flex items-center justify-center bg-gradient-to-b from-slate-50 via-white to-slate-100/70 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-4 transition-colors">
      
      {/* Ambient background lighting */}
      <div className="pointer-events-none absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-brand-500/10 dark:bg-brand-600/15 rounded-full blur-3xl -z-10" />
      <div className="pointer-events-none absolute bottom-10 left-10 w-[400px] h-[400px] bg-teal-500/10 dark:bg-teal-600/10 rounded-full blur-3xl -z-10" />

      <div className="max-w-5xl w-full mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 rounded-3xl lg:rounded-4xl overflow-hidden border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl shadow-slate-200/50 dark:shadow-none">
          
          {/* Left Column: Register Form */}
          <div className="lg:col-span-7 p-7 sm:p-10 lg:p-12 flex flex-col justify-between">
            <div>
              {/* Header Badge & Title */}
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200/80 dark:border-brand-800/80 mb-3">
                  <UserPlus className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                  Inscription Rapide & Gratuite
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                  Rejoignez StudRoom 🚀
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1.5 leading-relaxed">
                  Créez votre compte pour réserver votre chambre ou proposer votre logement à Selouane.
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
                  label="S'inscrire avec Google"
                  onError={(msg) => setErrorMessage(msg)}
                />

                <div className="relative flex py-4 items-center">
                  <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
                  <span className="shrink-0 mx-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    ou remplir vos informations
                  </span>
                  <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3.5">
                
                {/* Role Switcher */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Vous êtes : *
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setValue('role', 'student')}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 ${
                        selectedRole === 'student'
                          ? 'border-brand-600 bg-brand-50 dark:bg-brand-950/70 text-brand-700 dark:text-brand-300 shadow-xs'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <GraduationCap className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                      <span>Étudiant / Étudiante</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setValue('role', 'landlord')}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 ${
                        selectedRole === 'landlord'
                          ? 'border-brand-600 bg-brand-50 dark:bg-brand-950/70 text-brand-700 dark:text-brand-300 shadow-xs'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Building2 className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                      <span>Propriétaire Bailleur</span>
                    </button>
                  </div>
                </div>

                {/* Full Name Field */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nom Complet *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <Input
                      {...registerField('fullName')}
                      type="text"
                      placeholder="ex: Amina Tazi"
                      className="pl-10 h-10.5 text-xs sm:text-sm rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-brand-500/20"
                    />
                  </div>
                  {errors.fullName && (
                    <p className="text-xs text-rose-500 font-semibold mt-1">{errors.fullName.message}</p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Adresse Email *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <Input
                      {...registerField('email')}
                      type="email"
                      placeholder="exemple@etudiant.ma"
                      className="pl-10 h-10.5 text-xs sm:text-sm rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-brand-500/20"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-rose-500 font-semibold mt-1">{errors.email.message}</p>
                  )}
                </div>

                {/* Phone Field */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Numéro de Téléphone / WhatsApp *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <Input
                      {...registerField('phone')}
                      type="tel"
                      placeholder="06 12 34 56 78"
                      className="pl-10 h-10.5 text-xs sm:text-sm rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-brand-500/20"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-xs text-rose-500 font-semibold mt-1">{errors.phone.message}</p>
                  )}
                </div>

                {/* Password Field with Eye toggle */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Mot de passe * (min. 8 caractères avec lettres & chiffres)
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <Input
                      {...registerField('password')}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="pl-10 pr-10 h-10.5 text-xs sm:text-sm rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-brand-500/20"
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
                  className="w-full font-bold h-12 text-sm rounded-xl shadow-md shadow-brand-600/20 hover:shadow-lg hover:shadow-brand-600/30 hover:-translate-y-0.5 transition-all mt-3"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      <span>Création de votre compte...</span>
                    </>
                  ) : (
                    <>
                      <span>Créer mon compte StudRoom</span>
                      <ArrowRight className="w-4 h-4 ml-1.5" />
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Bottom Footer Switch */}
            <div className="mt-7 pt-5 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 text-center sm:text-left">
              <span>Vous avez déjà un compte ?</span>
              <Link
                href="/connexion"
                className="font-bold text-brand-600 dark:text-brand-400 hover:underline inline-flex items-center gap-1"
              >
                <span>Se connecter</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Right Column: Branded Visual Showcase Panel (Desktop) */}
          <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-brand-950 via-slate-900 to-slate-950 text-white p-10 flex-col justify-between relative overflow-hidden border-l border-slate-800">
            {/* Ambient inner glow */}
            <div className="pointer-events-none absolute -top-20 -right-20 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-20 w-64 h-64 bg-brand-500/15 rounded-full blur-3xl" />

            <div className="relative z-10">
              {/* Logo / Brand badge */}
              <div className="flex items-center gap-2.5 mb-8">
                <div className="w-10 h-10 rounded-xl bg-brand-600/30 border border-brand-400/30 flex items-center justify-center shadow-xs">
                  <GraduationCap className="w-5 h-5 text-brand-400" />
                </div>
                <div>
                  <span className="text-base font-black tracking-tight text-white">StudRoom</span>
                  <p className="text-[10px] text-brand-300 font-semibold uppercase tracking-wider">Campus Selouane</p>
                </div>
              </div>

              {/* Catchphrase */}
              <h2 className="text-2xl font-black text-white leading-tight tracking-tight mb-3">
                Tout votre cursus universitaire{' '}
                <span className="bg-gradient-to-r from-teal-300 to-emerald-300 bg-clip-text text-transparent">
                  en toute tranquillité.
                </span>
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed mb-6">
                Créez votre profil en 1 minute et profitez d'une prise en charge sur mesure par notre équipe locale.
              </p>

              {/* Benefits */}
              <div className="flex flex-col gap-3">
                <div className="flex items-start gap-3 bg-white/5 border border-white/10 p-3 rounded-2xl backdrop-blur-xs">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Réservation Sans Déplacement</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">Visite vidéo WhatsApp et contrat de bail en ligne.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white/5 border border-white/10 p-3 rounded-2xl backdrop-blur-xs">
                  <div className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Chambres Meublées & Prêtes</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">Literie, bureau, Wi-Fi et cuisine équipée.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white/5 border border-white/10 p-3 rounded-2xl backdrop-blur-xs">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Bail Légal pour la Bourse</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">Légalisé pour Minhaty et carte de séjour.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom mini-card quote */}
            <div className="relative z-10 pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-brand-400" />
                Selouane &bull; Nador
              </span>
              <span className="font-semibold text-emerald-300">
                Support 6j/7
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
