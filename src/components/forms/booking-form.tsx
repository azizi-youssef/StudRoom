'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { bookingFormSchema, BookingFormValues } from '@/shared/validation/booking.schema';
import { clientBookingService } from '@/client/services/booking.service';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Loader2, Calendar, User, Phone, Mail, GraduationCap, Clock, Send, Bed, AlertCircle } from 'lucide-react';
import { PropertyDetail, DbRoom } from '@/shared/types';

interface BookingFormProps {
  property?: PropertyDetail;
  room?: DbRoom;
  onSuccess?: () => void;
}

export function BookingForm({ property, room, onSuccess }: BookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bookingRef, setBookingRef] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      propertySlug: property?.slug || 'studroom-al-omrane-01',
      roomId: room?.id || property?.rooms[0]?.id || '',
      roomName: room?.name || property?.rooms[0]?.name || '',
      university: 'Faculté Pluridisciplinaire de Nador (FSP Selouane)',
      studyLevel: 'Licence 1ère année',
      durationMonths: 10,
      desiredArrivalDate: new Date().toISOString().split('T')[0],
    },
  });

  const onSubmit = async (data: BookingFormValues) => {
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const resData = await clientBookingService.submitBooking({
        ...data,
        roomId: room?.id || data.roomId,
        roomName: room?.name || data.roomName,
      });

      if (resData.success) {
        setIsSubmitted(true);
        if (resData.data?.bookingId) setBookingRef(resData.data.bookingId);
        if (onSuccess) onSuccess();
      } else if (resData.error) {
        setErrorMessage(resData.error.message || 'Une erreur est survenue lors de la réservation.');
      }
    } catch (err) {
      console.error('Booking submission error:', err);
      setErrorMessage('Connexion réseau interrompue.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 text-center flex flex-col items-center gap-4 animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h3 className="text-2xl font-black text-slate-900">Demande enregistrée !</h3>
        <p className="text-slate-700 text-base max-w-md leading-relaxed font-medium">
          Merci ! Votre demande pour <strong className="text-emerald-900">{room?.name || property?.title}</strong> a bien été prise en compte. Notre équipe StudRoom vous contactera sous 24h pour organiser votre visite.
        </p>
        {bookingRef && (
          <span className="inline-block bg-white px-4 py-2 rounded-xl text-xs font-mono font-bold text-slate-700 border border-emerald-200 shadow-sm">
            Référence dossier : {bookingRef}
          </span>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h3 className="text-xl font-black text-slate-900">
          {room ? `Réserver : ${room.name}` : 'Demander ce logement'}
        </h3>
        <p className="text-xs text-slate-500">
          Remplissez ce formulaire pour bloquer prioritairement cette chambre.
        </p>
      </div>

      {/* Target Room Pill */}
      {room && (
        <div className="p-3.5 bg-brand-50 rounded-2xl border border-brand-200/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Bed className="w-4 h-4 text-brand-600 flex-shrink-0" />
            <div>
              <span className="font-bold text-brand-900 block">{room.name}</span>
              <span className="text-[10px] text-brand-600 font-medium">
                {room.surface_sqm} m² • {room.furnished ? 'Meublée' : ''}
              </span>
            </div>
          </div>
          <span className="font-black text-brand-700 text-sm whitespace-nowrap ml-2">
            {room.price_monthly} DH/mois
          </span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Name row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Prénom *"
          placeholder="ex: Youssef"
          icon={<User className="w-4 h-4" />}
          error={errors.firstName?.message}
          {...register('firstName')}
        />
        <Input
          label="Nom *"
          placeholder="ex: El Mansouri"
          icon={<User className="w-4 h-4" />}
          error={errors.lastName?.message}
          {...register('lastName')}
        />
      </div>

      {/* Contact row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          placeholder="etudiant@domaine.com"
          icon={<Mail className="w-4 h-4" />}
          error={errors.email?.message}
          {...register('email')}
        />
      </div>

      {/* Academic row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Université / Établissement *"
          icon={<GraduationCap className="w-4 h-4" />}
          error={errors.university?.message}
          options={[
            { value: 'Faculté Pluridisciplinaire de Nador (FSP Selouane)', label: 'FSP Selouane' },
            { value: 'École Supérieure de Technologie de Nador (EST Nador)', label: 'EST Nador' },
            { value: 'ISTA Selouane', label: 'ISTA Selouane' },
            { value: 'Autre établissement Nador', label: 'Autre établissement' },
          ]}
          {...register('university')}
        />

        <Select
          label="Niveau d'étude *"
          error={errors.studyLevel?.message}
          options={[
            { value: 'Licence 1ère année', label: 'Licence 1ère année' },
            { value: 'Licence 2ème année', label: 'Licence 2ème année' },
            { value: 'Licence 3ème année / LP', label: 'Licence 3ème année / LP' },
            { value: 'DUT 1ère année', label: 'DUT 1ère année' },
            { value: 'DUT 2ème année', label: 'DUT 2ème année' },
            { value: 'Master / Doctorat', label: 'Master / Doctorat' },
          ]}
          {...register('studyLevel')}
        />
      </div>

      {/* Dates & Duration row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Date d'arrivée souhaitée *"
          type="date"
          icon={<Calendar className="w-4 h-4" />}
          error={errors.desiredArrivalDate?.message}
          {...register('desiredArrivalDate')}
        />

        <Select
          label="Durée du contrat *"
          icon={<Clock className="w-4 h-4" />}
          options={[
            { value: '10', label: '10 mois (Année universitaire)' },
            { value: '12', label: '12 mois (Année complète)' },
            { value: '5', label: '1 semestre (5 mois)' },
          ]}
          {...register('durationMonths', { valueAsNumber: true })}
        />
      </div>

      {/* Message Optional */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">
          Message ou précision (Optionnel)
        </label>
        <textarea
          rows={3}
          placeholder="Précisions sur vos préférences, colocataires souhaités..."
          className="w-full bg-white border border-slate-200 rounded-xl p-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          {...register('message')}
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={isSubmitting}
        className="w-full justify-center text-base py-3.5 mt-2 font-extrabold"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Traitement en cours...
          </>
        ) : (
          <>
            <Send className="w-5 h-5 mr-2" />
            Envoyer ma demande de réservation
          </>
        )}
      </Button>
    </form>
  );
}
