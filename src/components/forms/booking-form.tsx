'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { bookingFormSchema, BookingFormValues } from '@/shared/validation/booking.schema';
import { clientBookingService } from '@/client/services/booking.service';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Loader2, Calendar, User, Phone, Mail, GraduationCap, Clock, Send } from 'lucide-react';
import { PropertyDetail } from '@/shared/types';
import { DbRoom } from '@/shared/types/database';

interface BookingFormProps {
  property?: PropertyDetail;
  room?: DbRoom;
  onSuccess?: () => void;
}

export function BookingForm({ property, room, onSuccess }: BookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bookingRef, setBookingRef] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      propertySlug: property?.slug || 'studroom-al-omrane-01',
      roomId: room?.id,
      roomName: room?.name,
      university: 'Faculté Pluridisciplinaire de Nador (FPN Nador)',
      studyLevel: 'Licence 1ère année',
      durationMonths: 10,
      desiredArrivalDate: new Date().toISOString().split('T')[0],
    },
  });

  const onSubmit = async (data: BookingFormValues) => {
    setIsSubmitting(true);
    try {
      const payload: BookingFormValues = {
        ...data,
        ...(room ? { roomId: room.id, roomName: room.name } : {}),
      };
      const resData = await clientBookingService.submitBooking(payload);
      if (resData.success) {
        setIsSubmitted(true);
        if (resData.data?.bookingId) setBookingRef(resData.data.bookingId);
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      console.error('Booking submission error:', err);
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
        <h3 className="text-2xl font-black text-slate-900">Demande envoyée !</h3>
        <p className="text-slate-700 text-base max-w-md leading-relaxed font-medium">
          Merci ! Notre équipe StudRoom vous contactera très prochainement par téléphone ou WhatsApp pour finaliser votre dossier.
        </p>
        {bookingRef && (
          <span className="inline-block bg-white px-4 py-2 rounded-xl text-xs font-mono font-bold text-slate-700 border border-emerald-200 shadow-sm">
            Référence : {bookingRef}
          </span>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h3 className="text-xl font-black text-slate-900">Demander ce logement</h3>
        <p className="text-xs text-slate-500">
          Remplis ce formulaire pour être recontacté prioritairement par notre équipe.
        </p>
      </div>

      {property && (
        <div className="p-3 bg-primary-50 rounded-2xl border border-primary-200/80 flex items-center justify-between text-xs">
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-primary-900 truncate">{property.title}</span>
            {room && (
              <span className="text-[11px] text-primary-700 font-medium truncate">
                🛏️ {room.name} ({room.room_type})
              </span>
            )}
          </div>
          <span className="font-extrabold text-primary-600 whitespace-nowrap ml-2">
            {room ? room.price_monthly : property.min_price_dh} DH/mois
          </span>
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
            { value: 'Faculté Pluridisciplinaire de Nador (FPN Selouane)', label: 'FPN Selouane' },
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
          className="w-full bg-white border border-slate-200 rounded-xl p-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
          {...register('message')}
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={isSubmitting}
        className="w-full justify-center text-base py-3.5 mt-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Envoi en cours...
          </>
        ) : (
          <>
            <Send className="w-5 h-5 mr-2" />
            Envoyer ma demande
          </>
        )}
      </Button>
    </form>
  );
}
