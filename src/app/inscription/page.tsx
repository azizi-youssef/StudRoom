'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/context/auth-context';
import { registerSchema, RegisterValues } from '@/shared/validation/auth.schema';
import { Button } from '@/components/ui/button';
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
  ArrowLeft,
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
    <div
      className="relative min-h-screen pt-24 pb-16 flex items-center justify-center px-4 transition-colors"
      style={{ backgroundColor: 'var(--bg-page)' }}
    >
      {/* Ambient background lighting */}
      <div
        className="pointer-events-none absolute top-12 left-1/2 -translate-x-1/2 w-[650px] h-[320px] rounded-full blur-3xl opacity-20 -z-10"
        style={{ backgroundColor: 'var(--brand-primary)' }}
      />
      <div
        className="pointer-events-none absolute bottom-12 left-12 w-[350px] h-[350px] rounded-full blur-3xl opacity-15 -z-10"
        style={{ backgroundColor: 'var(--color-emerald-500)' }}
      />

      <div className="max-w-5xl w-full mx-auto animate-fade-in">
        {/* Top Back Link */}
        <div className="mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold hover:underline transition-colors"
            style={{ color: 'var(--text-secondary)' }}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Retour à l'accueil
          </Link>
        </div>

        <div
          className="grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden border shadow-xl"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-subtle)',
          }}
        >
          {/* Left Column: Register Form */}
          <div className="lg:col-span-7 p-7 sm:p-10 lg:p-11 flex flex-col justify-between">
            <div>
              {/* Header Badge & Title */}
              <div className="mb-6">
                <div
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-3 border"
                  style={{
                    backgroundColor: 'var(--brand-bg)',
                    borderColor: 'var(--brand-bg-strong)',
                    color: 'var(--brand-primary)',
                  }}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  Inscription Rapide & Gratuite
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                  Rejoignez StudRoom 🚀
                </h1>
                <p className="text-xs sm:text-sm mt-1.5" style={{ color: 'var(--text-secondary)' }}>
                  Créez votre compte pour réserver votre chambre ou proposer votre logement à Selouane.
                </p>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div
                  className="mb-5 p-4 rounded-xl border text-xs font-semibold flex items-start gap-2.5 animate-fade-in"
                  style={{
                    backgroundColor: 'var(--error-bg)',
                    borderColor: 'var(--error-border)',
                    color: 'var(--error-fg)',
                  }}
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{errorMessage}</span>
                </div>
              )}

              {/* Google OAuth Button */}
              <div className="mb-4">
                <GoogleButton
                  label="S'inscrire avec Google"
                  onError={(msg) => setErrorMessage(msg)}
                />

                <div className="relative flex py-4 items-center">
                  <div className="flex-grow border-t" style={{ borderColor: 'var(--border-subtle)' }}></div>
                  <span
                    className="shrink-0 mx-3 text-[11px] font-semibold uppercase tracking-wider"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    ou remplir vos informations
                  </span>
                  <div className="flex-grow border-t" style={{ borderColor: 'var(--border-subtle)' }}></div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3.5">
                {/* Role Switcher */}
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>
                    Vous êtes : <span style={{ color: 'var(--error-fg)' }}>*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setValue('role', 'student')}
                      className="py-2.5 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2"
                      style={{
                        backgroundColor: selectedRole === 'student' ? 'var(--brand-bg)' : 'var(--bg-subtle)',
                        borderColor: selectedRole === 'student' ? 'var(--brand-primary)' : 'var(--border-subtle)',
                        color: selectedRole === 'student' ? 'var(--brand-primary)' : 'var(--text-secondary)',
                      }}
                    >
                      <GraduationCap className="w-4 h-4" />
                      <span>Étudiant / Étudiante</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setValue('role', 'landlord')}
                      className="py-2.5 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2"
                      style={{
                        backgroundColor: selectedRole === 'landlord' ? 'var(--brand-bg)' : 'var(--bg-subtle)',
                        borderColor: selectedRole === 'landlord' ? 'var(--brand-primary)' : 'var(--border-subtle)',
                        color: selectedRole === 'landlord' ? 'var(--brand-primary)' : 'var(--text-secondary)',
                      }}
                    >
                      <Building2 className="w-4 h-4" />
                      <span>Propriétaire Bailleur</span>
                    </button>
                  </div>
                </div>

                {/* Full Name Field */}
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                    Nom Complet <span style={{ color: 'var(--error-fg)' }}>*</span>
                  </label>
                  <div className="relative">
                    <User
                      className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                      style={{ color: 'var(--text-muted)' }}
                    />
                    <input
                      {...registerField('fullName')}
                      type="text"
                      placeholder="ex: Amina Tazi"
                      className="w-full rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm focus:outline-none transition-all"
                      style={{
                        backgroundColor: 'var(--bg-subtle)',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--text-primary)',
                      }}
                    />
                  </div>
                  {errors.fullName && (
                    <p className="text-xs font-semibold mt-1" style={{ color: 'var(--error-fg)' }}>
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                    Adresse Email <span style={{ color: 'var(--error-fg)' }}>*</span>
                  </label>
                  <div className="relative">
                    <Mail
                      className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                      style={{ color: 'var(--text-muted)' }}
                    />
                    <input
                      {...registerField('email')}
                      type="email"
                      placeholder="exemple@etudiant.ma"
                      className="w-full rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm focus:outline-none transition-all"
                      style={{
                        backgroundColor: 'var(--bg-subtle)',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--text-primary)',
                      }}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs font-semibold mt-1" style={{ color: 'var(--error-fg)' }}>
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Phone Field */}
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                    Numéro de Téléphone / WhatsApp <span style={{ color: 'var(--error-fg)' }}>*</span>
                  </label>
                  <div className="relative">
                    <Phone
                      className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                      style={{ color: 'var(--text-muted)' }}
                    />
                    <input
                      {...registerField('phone')}
                      type="tel"
                      placeholder="06 12 34 56 78"
                      className="w-full rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm focus:outline-none transition-all"
                      style={{
                        backgroundColor: 'var(--bg-subtle)',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--text-primary)',
                      }}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-xs font-semibold mt-1" style={{ color: 'var(--error-fg)' }}>
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                    Mot de passe <span style={{ color: 'var(--error-fg)' }}>*</span> (min. 8 caractères)
                  </label>
                  <div className="relative">
                    <Lock
                      className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                      style={{ color: 'var(--text-muted)' }}
                    />
                    <input
                      {...registerField('password')}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="w-full rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm focus:outline-none transition-all"
                      style={{
                        backgroundColor: 'var(--bg-subtle)',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--text-primary)',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors p-1"
                      style={{ color: 'var(--text-muted)' }}
                      title={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs font-semibold mt-1" style={{ color: 'var(--error-fg)' }}>
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="btn-brand w-full font-bold h-11 text-xs sm:text-sm rounded-xl text-white shadow-md flex items-center justify-center gap-2 mt-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Création de votre compte...</span>
                    </>
                  ) : (
                    <>
                      <span>Créer mon compte StudRoom</span>
                      <UserPlus className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Bottom Footer Switch */}
            <div
              className="mt-6 pt-5 border-t flex flex-col sm:flex-row items-center justify-between gap-2 text-xs"
              style={{
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-secondary)',
              }}
            >
              <span>Vous avez déjà un compte ?</span>
              <Link
                href="/connexion"
                className="font-bold hover:underline inline-flex items-center gap-1"
                style={{ color: 'var(--brand-primary)' }}
              >
                <span>Se connecter</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Right Column: Branded Visual Showcase Panel (Desktop) */}
          <div
            className="hidden lg:flex lg:col-span-5 p-10 flex-col justify-between relative overflow-hidden border-l text-white"
            style={{
              backgroundColor: '#0F172A',
              borderColor: 'var(--border-subtle)',
            }}
          >
            {/* Ambient inner glow */}
            <div
              className="pointer-events-none absolute -top-16 -right-16 w-56 h-56 rounded-full blur-3xl opacity-30"
              style={{ backgroundColor: 'var(--brand-primary)' }}
            />
            <div
              className="pointer-events-none absolute -bottom-16 -left-16 w-56 h-56 rounded-full blur-3xl opacity-20"
              style={{ backgroundColor: 'var(--color-emerald-500)' }}
            />

            <div className="relative z-10">
              {/* Logo / Brand badge */}
              <div className="flex items-center gap-2.5 mb-7">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center border shadow-sm"
                  style={{
                    backgroundColor: 'rgba(14, 165, 198, 0.15)',
                    borderColor: 'rgba(14, 165, 198, 0.35)',
                    color: '#38BDF8',
                  }}
                >
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-base font-bold tracking-tight text-white">StudRoom</span>
                  <p className="text-[10px] text-cyan-300 font-semibold uppercase tracking-wider">Selouane • Nador</p>
                </div>
              </div>

              {/* Catchphrase */}
              <h2 className="text-2xl font-black leading-tight tracking-tight mb-2.5 text-white">
                Trouvez ou louez un logement,{' '}
                <span style={{ color: '#38BDF8' }}>
                  en toute simplicité.
                </span>
              </h2>
              <p className="text-xs leading-relaxed mb-6 text-slate-300">
                La plateforme de référence pour les étudiants de la Faculté Polydisciplinaire et de l'EST à Selouane.
              </p>

              {/* Feature Points */}
              <div className="flex flex-col gap-2.5">
                <div className="flex items-start gap-3 bg-white/5 border border-white/10 p-3 rounded-2xl backdrop-blur-xs">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Réservation Directe & Sans Frais Cachés</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">Prix transparents en Dirhams marocains avec caution claire.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white/5 border border-white/10 p-3 rounded-2xl backdrop-blur-xs">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Visites Guidées sur Place</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">Planifiez une visite physique accompagnée avant de signer.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white/5 border border-white/10 p-3 rounded-2xl backdrop-blur-xs">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Communauté Vérifiée</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">Propriétaires de confiance et étudiants rigoureusement identifiés.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom mini-card quote */}
            <div className="relative z-10 pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                Campus Universitaire Selouane
              </span>
              <span className="font-semibold text-emerald-400">
                Certifié StudRoom
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
