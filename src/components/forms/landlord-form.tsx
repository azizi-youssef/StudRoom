'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { landlordFormSchema, LandlordFormValues } from '@/shared/validation/landlord.schema';
import { clientLandlordService } from '@/client/services/landlord.service';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  CheckCircle2,
  Loader2,
  User,
  Phone,
  Mail,
  MapPin,
  Home,
  Key,
  ShieldCheck,
  Calendar,
  DollarSign,
  Layers,
  FileText,
  Sparkles,
  Check,
  Clock,
} from 'lucide-react';

export function LandlordForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [proposalRef, setProposalRef] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LandlordFormValues>({
    resolver: zodResolver(landlordFormSchema),
    defaultValues: {
      city: 'Selouane',
      neighborhood: 'Al Omrane',
      propertyType: 'apartment_shared',
      roomsCount: 3,
      surfaceSqm: 100,
      expectedRentDh: 1500,
      availabilityDate: new Date().toISOString().split('T')[0],
    },
  });

  const onSubmit = async (data: LandlordFormValues) => {
    setIsSubmitting(true);
    try {
      const resData = await clientLandlordService.submitPropertyProposal(data);
      if (resData.success) {
        setIsSubmitted(true);
        if (resData.data?.proposalId) setProposalRef(resData.data.proposalId);
      }
    } catch (err) {
      console.error('Landlord form error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-gradient-to-b from-emerald-50/80 via-white to-emerald-50/30 dark:from-emerald-950/40 dark:via-slate-900 dark:to-emerald-950/20 border border-emerald-200 dark:border-emerald-800/80 rounded-3xl p-8 sm:p-12 text-center flex flex-col items-center gap-6 animate-fade-in my-6 shadow-sm">
        
        {/* Animated Celebration Icon */}
        <div className="relative">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <CheckCircle2 className="w-10 h-10" strokeWidth={2.2} />
          </div>
          <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-white dark:bg-slate-800 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          </span>
        </div>

        <div className="max-w-md">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Check className="w-3.5 h-3.5" />
            Proposition transmise
          </div>
          
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Proposition bien reçue !
          </h3>
          
          <p className="mt-2 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
            Merci pour votre confiance. Notre responsable des partenariats propriétaires à Selouane & Nador prendra contact avec vous sous 24h pour étudier votre bien.
          </p>
        </div>

        {proposalRef && (
          <div className="flex flex-col items-center gap-1 bg-white dark:bg-slate-800 px-5 py-3 rounded-2xl border border-emerald-200/80 dark:border-emerald-800/80 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Référence du dossier
            </span>
            <span className="font-mono font-black text-sm text-slate-800 dark:text-slate-200 tracking-wide">
              {proposalRef}
            </span>
          </div>
        )}

        {/* What happens next */}
        <div className="w-full max-w-lg bg-white/90 dark:bg-slate-800/90 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700 text-left space-y-3">
          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            Prochaines étapes :
          </p>

          <div className="flex items-start gap-3 text-xs text-slate-600 dark:text-slate-300">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-50 dark:bg-brand-950 text-[10px] font-bold text-brand-700 dark:text-brand-300">1</span>
            <span>Appel téléphonique de notre conseiller pour préciser vos attentes et caractéristiques du logement.</span>
          </div>

          <div className="flex items-start gap-3 text-xs text-slate-600 dark:text-slate-300">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-50 dark:bg-brand-950 text-[10px] font-bold text-brand-700 dark:text-brand-300">2</span>
            <span>Visite d'expertise gratuite sur place à Selouane / Nador pour estimer le loyer optimal.</span>
          </div>

          <div className="flex items-start gap-3 text-xs text-slate-600 dark:text-slate-300">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-50 dark:bg-brand-950 text-[10px] font-bold text-brand-700 dark:text-brand-300">3</span>
            <span>Signature du mandat de gestion et mise en ligne auprès de nos étudiants qualifiés.</span>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={() => {
            setIsSubmitted(false);
            reset();
          }}
          className="rounded-full text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border-slate-200 dark:border-slate-700 px-6 py-2.5 mt-2"
        >
          Proposer un autre bien
        </Button>

      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white dark:bg-slate-900 p-6 sm:p-10 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-[0_10px_40px_-10px_rgba(15,23,42,0.08)] flex flex-col gap-8 relative overflow-hidden transition-colors"
    >
      {/* Decorative top accent line */}
      <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-brand-600 via-teal-500 to-accent-orange" />

      {/* Block 1: Coordonnées du propriétaire */}
      <div>
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 text-xs font-black">
            1
          </span>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Vos Coordonnées Personnelles
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Nom complet *"
            placeholder="ex: Mohamed Alami"
            icon={<User className="w-4 h-4" />}
            error={errors.fullName?.message}
            {...register('fullName')}
          />
          <Input
            label="Téléphone (+212) *"
            placeholder="06 12 34 56 78"
            icon={<Phone className="w-4 h-4" />}
            error={errors.phone?.message}
            {...register('phone')}
          />
          <Input
            label="Adresse Email *"
            type="email"
            placeholder="proprio@domaine.com"
            icon={<Mail className="w-4 h-4" />}
            error={errors.email?.message}
            {...register('email')}
          />
        </div>
      </div>

      {/* Block 2: Localisation & Typologie du bien */}
      <div>
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 text-xs font-black">
            2
          </span>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Localisation & Type de Logement
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select
            label="Ville *"
            icon={<MapPin className="w-4 h-4" />}
            error={errors.city?.message}
            options={[
              { value: 'Selouane', label: 'Selouane (Campus)' },
              { value: 'Nador Ville', label: 'Nador Ville' },
              { value: 'Al Aroui', label: 'Al Aroui' },
              { value: 'Zaio', label: 'Zaïo' },
              { value: 'Autre', label: 'Autre dans la région' },
            ]}
            {...register('city')}
          />

          <Input
            label="Quartier / Secteur *"
            placeholder="ex: Al Omrane, Secteur 3, etc."
            icon={<MapPin className="w-4 h-4" />}
            error={errors.neighborhood?.message}
            {...register('neighborhood')}
          />

          <Select
            label="Type de logement *"
            icon={<Home className="w-4 h-4" />}
            error={errors.propertyType?.message}
            options={[
              { value: 'apartment_shared', label: 'Appartement pour colocation' },
              { value: 'studio_private', label: 'Studio individuel' },
              { value: 'residence_suite', label: 'Immeuble / Résidence entière' },
            ]}
            {...register('propertyType')}
          />
        </div>
      </div>

      {/* Block 3: Caractéristiques & Conditions */}
      <div>
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 text-xs font-black">
            3
          </span>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Caractéristiques & Modalités
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Input
            label="Nombre de chambres *"
            type="number"
            icon={<Layers className="w-4 h-4" />}
            error={errors.roomsCount?.message}
            {...register('roomsCount', { valueAsNumber: true })}
          />

          <Input
            label="Superficie (m²) *"
            type="number"
            placeholder="ex: 90"
            error={errors.surfaceSqm?.message}
            {...register('surfaceSqm', { valueAsNumber: true })}
          />

          <Input
            label="Loyer souhaité (DH/mois) *"
            type="number"
            placeholder="ex: 1500"
            icon={<DollarSign className="w-4 h-4" />}
            error={errors.expectedRentDh?.message}
            {...register('expectedRentDh', { valueAsNumber: true })}
          />

          <Input
            label="Date de disponibilité *"
            type="date"
            icon={<Calendar className="w-4 h-4" />}
            error={errors.availabilityDate?.message}
            {...register('availabilityDate')}
          />
        </div>
      </div>

      {/* Block 4: Précisions & Commentaires */}
      <div>
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 text-xs font-black">
            4
          </span>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Précisions sur les équipements (Optionnel)
          </h4>
        </div>

        <div className="flex flex-col gap-2">
          <textarea
            rows={3}
            placeholder="Récemment rénové, meublé, présence de balcon, Wi-Fi déjà installé, chauffe-eau neuf, etc."
            className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors focus:outline-none focus:border-brand-500 dark:focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
            {...register('message')}
          />
          <p className="text-[11px] text-slate-400 dark:text-slate-500">
            Indiquez tout équipement qui pourrait valoriser votre bien auprès des étudiants (lits, bureaux, cuisine...).
          </p>
        </div>
      </div>

      {/* Submit CTA & Reassurance */}
      <div className="pt-2 flex flex-col gap-4">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={isSubmitting}
          className="w-full justify-center text-base py-4 font-bold shadow-md shadow-brand-600/25 hover:shadow-lg hover:shadow-brand-600/35 hover:-translate-y-0.5 active:scale-95 transition-all rounded-2xl"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              <span>Transmission de votre dossier...</span>
            </>
          ) : (
            <>
              <Key className="w-5 h-5 mr-2" />
              <span>Envoyer ma proposition de logement</span>
            </>
          )}
        </Button>

        {/* Security & Reassurance guarantees */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-2">
          <span className="inline-flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            100% Gratuit & Sans engagement
          </span>
          <span>•</span>
          <span className="inline-flex items-center gap-1.5 font-medium">
            <Clock className="w-4 h-4 text-brand-500" />
            Contact sous 24h par notre équipe locale
          </span>
          <span>•</span>
          <span className="inline-flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="w-4 h-4 text-cyan-500" />
            Données strictement confidentielles
          </span>
        </div>
      </div>

    </form>
  );
}

