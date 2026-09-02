'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { landlordFormSchema, LandlordFormValues } from '@/shared/validation/landlord.schema';
import { clientLandlordService } from '@/client/services/landlord.service';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Loader2, User, Phone, Mail, MapPin, Home, Key } from 'lucide-react';

export function LandlordForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [proposalRef, setProposalRef] = useState('');

  const {
    register,
    handleSubmit,
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
      <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 text-center flex flex-col items-center gap-4 animate-fade-in my-6">
        <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h3 className="text-2xl font-black text-slate-900">Proposition bien reçue !</h3>
        <p className="text-slate-700 text-base max-w-md leading-relaxed font-medium">
          Merci ! Notre équipe dédiée aux propriétaires prendra contact avec vous sous 24h pour étudier votre bien et programmer une visite d'expertise.
        </p>
        {proposalRef && (
          <span className="inline-block bg-white px-4 py-2 rounded-xl text-xs font-mono font-bold text-slate-700 border border-emerald-200 shadow-sm">
            Référence dossier : {proposalRef}
          </span>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl flex flex-col gap-6">
      <div className="flex flex-col gap-1 border-b border-slate-100 pb-4">
        <h3 className="text-2xl font-black text-slate-900">Proposer mon logement</h3>
        <p className="text-xs text-slate-500">
          Remplissez les détails de votre bien immobilier pour être recontacté par l'équipe StudRoom.
        </p>
      </div>

      {/* Owner Info */}
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

      {/* Location info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Ville *"
          icon={<MapPin className="w-4 h-4" />}
          error={errors.city?.message}
          options={[
            { value: 'Selouane', label: 'Selouane' },
            { value: 'Nador Ville', label: 'Nador Ville' },
            { value: 'Oujda', label: 'Oujda' },
            { value: 'Tanger', label: 'Tanger' },
          ]}
          {...register('city')}
        />

        <Input
          label="Quartier / Secteur *"
          placeholder="ex: Al Omrane, Secteur 3"
          icon={<MapPin className="w-4 h-4" />}
          error={errors.neighborhood?.message}
          {...register('neighborhood')}
        />
      </div>

      {/* Property specs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Select
          label="Type de logement *"
          icon={<Home className="w-4 h-4" />}
          error={errors.propertyType?.message}
          options={[
            { value: 'apartment_shared', label: 'Appartement pour colocation' },
            { value: 'studio_private', label: 'Studio individuel' },
            { value: 'residence_suite', label: 'Immeuble / Résidence' },
          ]}
          {...register('propertyType')}
        />

        <Input
          label="Nombre de chambres *"
          type="number"
          error={errors.roomsCount?.message}
          {...register('roomsCount', { valueAsNumber: true })}
        />

        <Input
          label="Superficie estimée (m²) *"
          type="number"
          placeholder="ex: 90"
          error={errors.surfaceSqm?.message}
          {...register('surfaceSqm', { valueAsNumber: true })}
        />
      </div>

      {/* Financials & Availability */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Loyer mensuel souhaité (DH/chambre ou total) *"
          type="number"
          placeholder="ex: 1500"
          error={errors.expectedRentDh?.message}
          {...register('expectedRentDh', { valueAsNumber: true })}
        />

        <Input
          label="Date de disponibilité *"
          type="date"
          error={errors.availabilityDate?.message}
          {...register('availabilityDate')}
        />
      </div>

      {/* Message */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">
          Commentaires ou caractéristiques du bien (Optionnel)
        </label>
        <textarea
          rows={3}
          placeholder="Récemment rénové, présence de balcon, Wi-Fi déjà installé..."
          className="w-full bg-white border border-slate-200 rounded-xl p-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          {...register('message')}
        />
      </div>

      <Button
        type="submit"
        variant="accent"
        size="lg"
        disabled={isSubmitting}
        className="w-full justify-center text-base py-4 font-bold"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Transmissions en cours...
          </>
        ) : (
          <>
            <Key className="w-5 h-5 mr-2" />
            Proposer mon logement
          </>
        )}
      </Button>
    </form>
  );
}
