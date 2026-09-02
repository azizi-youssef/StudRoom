'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/context/auth-context';
import { registerSchema, RegisterValues } from '@/shared/validation/auth.schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserPlus, Mail, Lock, User, Phone, ShieldCheck, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { GoogleButton } from '@/components/auth/google-button';

export default function InscriptionPage() {
  const router = useRouter();
  const { register: registerAuth, isAuthenticated } = useAuth();
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        setErrorMessage(res.message || 'Erreur lors de l’inscription.');
      }
    } catch (err) {
      setErrorMessage('Une erreur est survenue lors de la création du compte.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-28 pb-24 bg-slate-50 min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full px-4">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-2xl">
          <div className="text-center pb-6">
            <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-3 border border-brand-100 shadow-soft">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Créer un compte StudRoom
            </h1>
            <p className="text-slate-500 text-xs mt-1">
              Rejoignez la communauté étudiante & bailleur à Selouane / Nador.
            </p>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="mb-5">
            <GoogleButton label="S'inscrire avec Google" onError={(msg) => setErrorMessage(msg)} />
            
            <div className="relative flex py-3 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-3 text-[11px] font-medium text-slate-400">
                ou remplir le formulaire
              </span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nom Complet</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <Input
                  {...registerField('fullName')}
                  type="text"
                  placeholder="Karim El Amrani"
                  className="pl-10"
                />
              </div>
              {errors.fullName && (
                <p className="text-xs text-rose-500 mt-1 font-medium">{errors.fullName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Adresse Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <Input
                  {...registerField('email')}
                  type="email"
                  placeholder="exemple@etudiant.ma"
                  className="pl-10"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-rose-500 mt-1 font-medium">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Numéro Téléphone / WhatsApp</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <Input
                  {...registerField('phone')}
                  type="tel"
                  placeholder="+212 634 536 286"
                  className="pl-10"
                />
              </div>
              {errors.phone && (
                <p className="text-xs text-rose-500 mt-1 font-medium">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Mot de passe</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <Input
                  {...registerField('password')}
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                />
              </div>
              {errors.password && (
                <p className="text-xs text-rose-500 mt-1 font-medium">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Je suis un :</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setValue('role', 'student')}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                    selectedRole === 'student'
                      ? 'border-brand-600 bg-brand-50 text-brand-700'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  🎓 Étudiant
                </button>
                <button
                  type="button"
                  onClick={() => setValue('role', 'landlord')}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                    selectedRole === 'landlord'
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
                  Création...
                </>
              ) : (
                <>
                  Créer mon compte
                  <UserPlus className="w-4 h-4 ml-1.5" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center text-xs text-slate-500">
            Vous avez déjà un compte ?{' '}
            <Link href="/connexion" className="font-bold text-brand-600 hover:underline">
              Se connecter <ArrowRight className="w-3 h-3 inline" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
