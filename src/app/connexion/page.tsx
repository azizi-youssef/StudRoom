'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/context/auth-context';
import { loginSchema, LoginValues } from '@/shared/validation/auth.schema';
import { Button } from '@/components/ui/button';
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
  Building2,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  MapPin,
  KeyRound,
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
    setValue,
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

  const handleFillDemo = (email: string, pass: string) => {
    setValue('email', email, { shouldValidate: true });
    setValue('password', pass, { shouldValidate: true });
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
        className="pointer-events-none absolute bottom-12 right-12 w-[350px] h-[350px] rounded-full blur-3xl opacity-15 -z-10"
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
          {/* Left Column: Connection Form */}
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
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Espace Sécurisé StudRoom
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                  Bon retour parmi nous 👋
                </h1>
                <p className="text-xs sm:text-sm mt-1.5" style={{ color: 'var(--text-secondary)' }}>
                  Accédez à vos réservations, vos demandes de visite et vos hébergements à Selouane.
                </p>
              </div>

              {/* Demo Account Fill Pills */}
              <div
                className="mb-5 p-3 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                style={{
                  backgroundColor: 'var(--bg-subtle)',
                  borderColor: 'var(--border-subtle)',
                }}
              >
                <div className="flex items-center gap-1.5 text-[11px] font-semibold" style={{ color: 'var(--text-secondary)' }}>
                  <KeyRound className="w-3.5 h-3.5" style={{ color: 'var(--brand-primary)' }} />
                  <span>Comptes de test rapide :</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleFillDemo('admin@studroom.ma', 'Admin123!')}
                    className="dash-card px-2.5 py-1 text-[11px] font-semibold rounded-lg hover:border-cyan-500 transition-all"
                    style={{ color: 'var(--brand-primary)' }}
                  >
                    🛡️ Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFillDemo('etudiant@studroom.ma', 'Etudiant123!')}
                    className="dash-card px-2.5 py-1 text-[11px] font-semibold rounded-lg hover:border-cyan-500 transition-all"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    🎓 Étudiant
                  </button>
                </div>
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
                  label="Continuer avec Google"
                  onError={(msg) => setErrorMessage(msg)}
                />

                <div className="relative flex py-4 items-center">
                  <div className="flex-grow border-t" style={{ borderColor: 'var(--border-subtle)' }}></div>
                  <span
                    className="shrink-0 mx-3 text-[11px] font-semibold uppercase tracking-wider"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    ou par identifiant
                  </span>
                  <div className="flex-grow border-t" style={{ borderColor: 'var(--border-subtle)' }}></div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3.5">
                {/* Email Field */}
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>
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
                      placeholder="votre.email@etudiant.ma"
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

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                      Mot de passe <span style={{ color: 'var(--error-fg)' }}>*</span>
                    </label>
                    <span
                      className="text-[11px] font-medium hover:underline cursor-pointer"
                      style={{ color: 'var(--brand-primary)' }}
                    >
                      Mot de passe oublié ?
                    </span>
                  </div>
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
                      <span>Connexion en cours...</span>
                    </>
                  ) : (
                    <>
                      <span>Se connecter</span>
                      <LogIn className="w-4 h-4" />
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
              <span>Vous n'avez pas encore de compte ?</span>
              <Link
                href="/inscription"
                className="font-bold hover:underline inline-flex items-center gap-1"
                style={{ color: 'var(--brand-primary)' }}
              >
                <span>Créer un compte</span>
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
                Votre logement étudiant idéal,{' '}
                <span style={{ color: '#38BDF8' }}>
                  sans stress.
                </span>
              </h2>
              <p className="text-xs leading-relaxed mb-6 text-slate-300">
                Rejoignez des centaines d'étudiants installés dans des résidences calmes, meublées et ultra-proches des facultés.
              </p>

              {/* Feature Points */}
              <div className="flex flex-col gap-2.5">
                <div className="flex items-start gap-3 bg-white/5 border border-white/10 p-3 rounded-2xl backdrop-blur-xs">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">À 3 min à pied des Facultés</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">FSAN, FEGN, FSJPN, FLLAN, EST Nador & campus Al Omrane.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white/5 border border-white/10 p-3 rounded-2xl backdrop-blur-xs">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Bail conforme & Légal</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">Contrat direct valable pour bourse et carte de séjour.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white/5 border border-white/10 p-3 rounded-2xl backdrop-blur-xs">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Support Local Réactif</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">Équipe sur place à Selouane et assistance WhatsApp 6j/7.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom mini-card quote */}
            <div className="relative z-10 pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                Secteur Al Omrane, Selouane
              </span>
              <span className="font-semibold text-emerald-400">
                100% Vérifié
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
