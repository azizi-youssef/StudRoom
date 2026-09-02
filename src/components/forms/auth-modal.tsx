'use client';

import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/context/auth-context';
import { loginSchema, registerSchema, LoginValues, RegisterValues } from '@/shared/validation/auth.schema';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LogIn, UserPlus, Mail, Lock, User, Phone, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { GoogleButton } from '@/components/auth/google-button';

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, authModalTab, login, register } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(authModalTab);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        setErrorMessage(res.message || 'Identifiants invalides.');
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
        setErrorMessage(res.message || 'Erreur lors de l’inscription.');
      }
    } catch (err) {
      setErrorMessage('Une erreur est survenue lors de la création de compte.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog isOpen={isAuthModalOpen} onClose={closeAuthModal} maxWidth="md">
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="text-center pb-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-2 border border-brand-100">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Espace Membre StudRoom
          </h2>
          <p className="text-slate-500 text-xs mt-1">
            Connectez-vous pour suivre vos réservations ou proposer un bien.
          </p>
        </div>

        {/* Tabs switcher */}
        <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200/80">
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setErrorMessage('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'login'
                ? 'bg-white text-brand-600 shadow-soft'
                : 'text-slate-500 hover:text-slate-900'
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
                ? 'bg-white text-brand-600 shadow-soft'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            Créer un compte
          </button>
        </div>

        {/* Error Banner */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
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
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink mx-3 text-[11px] font-medium text-slate-400">
            ou par email
          </span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        {/* LOGIN FORM */}
        {activeTab === 'login' && (
          <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Adresse Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <Input
                  {...loginForm.register('email')}
                  type="email"
                  placeholder="exemple@etudiant.ma"
                  className="pl-10"
                />
              </div>
              {loginForm.formState.errors.email && (
                <p className="text-xs text-rose-500 mt-1 font-medium">
                  {loginForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Mot de passe</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <Input
                  {...loginForm.register('password')}
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                />
              </div>
              {loginForm.formState.errors.password && (
                <p className="text-xs text-rose-500 mt-1 font-medium">
                  {loginForm.formState.errors.password.message}
                </p>
              )}
            </div>

            <Button type="submit" variant="primary" size="lg" className="w-full font-bold mt-2" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Connexion en cours...
                </>
              ) : (
                <>
                  Se connecter
                  <LogIn className="w-4 h-4 ml-1.5" />
                </>
              )}
            </Button>
          </form>
        )}

        {/* REGISTER FORM */}
        {activeTab === 'register' && (
          <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="flex flex-col gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nom Complet</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <Input
                  {...registerForm.register('fullName')}
                  type="text"
                  placeholder="Karim El Amrani"
                  className="pl-10"
                />
              </div>
              {registerForm.formState.errors.fullName && (
                <p className="text-xs text-rose-500 mt-1 font-medium">
                  {registerForm.formState.errors.fullName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Adresse Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <Input
                  {...registerForm.register('email')}
                  type="email"
                  placeholder="exemple@etudiant.ma"
                  className="pl-10"
                />
              </div>
              {registerForm.formState.errors.email && (
                <p className="text-xs text-rose-500 mt-1 font-medium">
                  {registerForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Numéro Téléphone / WhatsApp</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <Input
                  {...registerForm.register('phone')}
                  type="tel"
                  placeholder="+212 634 536 286"
                  className="pl-10"
                />
              </div>
              {registerForm.formState.errors.phone && (
                <p className="text-xs text-rose-500 mt-1 font-medium">
                  {registerForm.formState.errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Mot de passe</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <Input
                  {...registerForm.register('password')}
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                />
              </div>
              {registerForm.formState.errors.password && (
                <p className="text-xs text-rose-500 mt-1 font-medium">
                  {registerForm.formState.errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Je suis un :</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => registerForm.setValue('role', 'student')}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                    registerForm.watch('role') === 'student'
                      ? 'border-brand-600 bg-brand-50 text-brand-700'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  🎓 Étudiant
                </button>
                <button
                  type="button"
                  onClick={() => registerForm.setValue('role', 'landlord')}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                    registerForm.watch('role') === 'landlord'
                      ? 'border-brand-600 bg-brand-50 text-brand-700'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  🏠 Propriétaire
                </button>
              </div>
            </div>

            <Button type="submit" variant="primary" size="lg" className="w-full font-bold mt-2" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Création du compte...
                </>
              ) : (
                <>
                  Créer mon compte
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
