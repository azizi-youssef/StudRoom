'use client';

import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/context/auth-context';
import { loginSchema, registerSchema, LoginValues, RegisterValues } from '@/shared/validation/auth.schema';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  LogIn,
  UserPlus,
  Mail,
  Lock,
  User,
  Phone,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  GraduationCap,
  Building2,
} from 'lucide-react';
import { GoogleButton } from '@/components/auth/google-button';

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, authModalTab, login, register } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(authModalTab);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  React.useEffect(() => {
    setActiveTab(authModalTab);
    setErrorMessage('');
  }, [authModalTab, isAuthModalOpen]);

  // Login form
  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  // Register form
  const registerForm = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      password: '',
      role: 'student',
    },
  });

  const onLoginSubmit: SubmitHandler<LoginValues> = async (data) => {
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const res = await login(data);
      if (!res.success) {
        setErrorMessage(res.message || 'Identifiants invalides. Veuillez vérifier vos informations.');
      }
    } catch (err) {
      setErrorMessage('Une erreur est survenue lors de la connexion.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onRegisterSubmit: SubmitHandler<RegisterValues> = async (data) => {
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const res = await register(data);
      if (!res.success) {
        setErrorMessage(res.message || 'Erreur lors de l’inscription. Veuillez réessayer.');
      }
    } catch (err) {
      setErrorMessage('Une erreur est survenue lors de la création de compte.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog isOpen={isAuthModalOpen} onClose={closeAuthModal} maxWidth="md">
      <div className="flex flex-col gap-4 text-slate-900 dark:text-white">
        
        {/* Header */}
        <div className="text-center pb-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto mb-2.5 border border-brand-100 dark:border-brand-800/80 shadow-xs">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Espace Membre StudRoom
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
            Connectez-vous pour suivre vos réservations ou proposer un bien à Selouane.
          </p>
        </div>

        {/* Tabs switcher */}
        <div className="flex bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl border border-slate-200/80 dark:border-slate-700">
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setErrorMessage('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'login'
                ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-soft'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            Se connecter
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('register');
              setErrorMessage('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'register'
                ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-soft'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            Créer un compte
          </button>
        </div>

        {/* Error Banner */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs font-medium flex items-start gap-2.5 animate-fade-in shadow-2xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Google OAuth Button */}
        <div className="pt-1">
          <GoogleButton
            label={activeTab === 'login' ? 'Continuer avec Google' : "S'inscrire avec Google"}
            onError={(msg) => setErrorMessage(msg)}
          />
        </div>

        {/* Divider */}
        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
          <span className="shrink-0 mx-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            ou par email
          </span>
          <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
        </div>

        {/* LOGIN FORM */}
        {activeTab === 'login' && (
          <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Adresse Email *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <Input
                  {...loginForm.register('email')}
                  type="email"
                  placeholder="exemple@etudiant.ma"
                  className="pl-10 h-10.5 text-xs sm:text-sm rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-brand-500/20"
                />
              </div>
              {loginForm.formState.errors.email && (
                <p className="text-xs text-rose-500 font-semibold mt-1">
                  {loginForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Mot de passe *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <Input
                  {...loginForm.register('password')}
                  type={showLoginPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="pl-10 pr-10 h-10.5 text-xs sm:text-sm rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-brand-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
                  title={showLoginPassword ? 'Masquer' : 'Afficher'}
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {loginForm.formState.errors.password && (
                <p className="text-xs text-rose-500 font-semibold mt-1">
                  {loginForm.formState.errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full font-bold h-11 text-xs sm:text-sm rounded-xl shadow-md shadow-brand-600/20 hover:shadow-lg hover:shadow-brand-600/30 hover:-translate-y-0.5 transition-all mt-1"
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
        )}

        {/* REGISTER FORM */}
        {activeTab === 'register' && (
          <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="flex flex-col gap-3.5">
            
            {/* Role Switcher */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Vous êtes : *
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => registerForm.setValue('role', 'student')}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all flex items-center justify-center gap-1.5 ${
                    registerForm.watch('role') === 'student'
                      ? 'border-brand-600 bg-brand-50 dark:bg-brand-950/70 text-brand-700 dark:text-brand-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Étudiant</span>
                </button>
                <button
                  type="button"
                  onClick={() => registerForm.setValue('role', 'landlord')}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all flex items-center justify-center gap-1.5 ${
                    registerForm.watch('role') === 'landlord'
                      ? 'border-brand-600 bg-brand-50 dark:bg-brand-950/70 text-brand-700 dark:text-brand-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Propriétaire</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Nom Complet *</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <Input
                  {...registerForm.register('fullName')}
                  type="text"
                  placeholder="Karim El Amrani"
                  className="pl-10 h-10 text-xs sm:text-sm rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder:text-slate-400"
                />
              </div>
              {registerForm.formState.errors.fullName && (
                <p className="text-xs text-rose-500 font-semibold mt-1">
                  {registerForm.formState.errors.fullName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Adresse Email *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <Input
                  {...registerForm.register('email')}
                  type="email"
                  placeholder="exemple@etudiant.ma"
                  className="pl-10 h-10 text-xs sm:text-sm rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder:text-slate-400"
                />
              </div>
              {registerForm.formState.errors.email && (
                <p className="text-xs text-rose-500 font-semibold mt-1">
                  {registerForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Numéro Téléphone / WhatsApp *</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <Input
                  {...registerForm.register('phone')}
                  type="tel"
                  placeholder="+212 634 536 286"
                  className="pl-10 h-10 text-xs sm:text-sm rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder:text-slate-400"
                />
              </div>
              {registerForm.formState.errors.phone && (
                <p className="text-xs text-rose-500 font-semibold mt-1">
                  {registerForm.formState.errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Mot de passe * (min. 8 caractères)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <Input
                  {...registerForm.register('password')}
                  type={showRegisterPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="pl-10 pr-10 h-10 text-xs sm:text-sm rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
                  title={showRegisterPassword ? 'Masquer' : 'Afficher'}
                >
                  {showRegisterPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {registerForm.formState.errors.password && (
                <p className="text-xs text-rose-500 font-semibold mt-1">
                  {registerForm.formState.errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full font-bold h-11 text-xs sm:text-sm rounded-xl shadow-md shadow-brand-600/20 hover:shadow-lg hover:shadow-brand-600/30 hover:-translate-y-0.5 transition-all mt-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  <span>Création du compte...</span>
                </>
              ) : (
                <>
                  <span>Créer mon compte</span>
                  <UserPlus className="w-4 h-4 ml-1.5" />
                </>
              )}
            </Button>
          </form>
        )}
      </div>
    </Dialog>
  );
}
