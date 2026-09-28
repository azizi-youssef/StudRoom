'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { bookingFormSchema, BookingFormValues } from '@/shared/validation/booking.schema';
import { clientBookingService } from '@/client/services/booking.service';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Loader2, Calendar, User, Phone, Mail, GraduationCap, Clock, Send } from 'lucide-react';
import { PropertyDetail } from '@/shared/types';
import { DbRoom } from '@/shared/types/database';
import { BookingSuccessContent } from './booking-success-modal';

interface BookingFormProps {
  property?: PropertyDetail;
  room?: DbRoom;
  onSuccess?: () => void;
  onClose?: () => void;
}

export const UNIVERSITY_OPTIONS = [
  {
    value: 'FSAN Nador (Faculté des Sciences Appliquées)',
    label: 'FSAN Nador — Sciences Appliquées',
  },
  {
    value: "FEGN Nador (Faculté d'Économie et de Gestion)",
    label: 'FEGN Nador — Économie & Gestion',
  },
  {
    value: 'ESTN Nador (École Supérieure de Technologie)',
    label: 'ESTN Nador — École Supérieure de Technologie',
  },
  {
    value: 'FSJPN Nador (Faculté des Sciences Juridiques et Politiques)',
    label: 'FSJPN Nador — Droit & Sciences Politiques',
  },
  {
    value: 'FLLAN Nador (Faculté des Langues, Lettres et Arts)',
    label: 'FLLAN Nador — Langues, Lettres & Arts',
  },
  {
    value: 'ISTA Selouane (OFPPT)',
    label: 'ISTA Selouane — Institut Spécialisé (OFPPT)',
  },
  {
    value: 'Autre établissement',
    label: 'Autre établissement (préciser ci-dessous)',
  },
];

export const STUDY_LEVEL_OPTIONS = [
  { value: 'Licence 1ère année', label: 'Licence 1ère année (L1)' },
  { value: 'Licence 2ème année', label: 'Licence 2ème année (L2)' },
  { value: 'Licence 3ème année / LP', label: 'Licence 3ème année / LP (L3)' },
  { value: 'DUT 1ère année', label: 'DUT 1ère année (EST)' },
  { value: 'DUT 2ème année', label: 'DUT 2ème année (EST)' },
  { value: 'Technicien Spécialisé 1ère année', label: 'TS 1ère année (ISTA / OFPPT)' },
  { value: 'Technicien Spécialisé 2ème année', label: 'TS 2ème année (ISTA / OFPPT)' },
  { value: "Cycle d'Ingénieur", label: "Cycle d'Ingénieur" },
  { value: 'Master 1ère / 2ème année', label: 'Master (M1 / M2)' },
  { value: 'Doctorat', label: 'Doctorat' },
  { value: 'Autre cursus', label: 'Autre cursus' },
];

export function BookingForm({ property, room, onSuccess, onClose }: BookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bookingRef, setBookingRef] = useState('');
  const [submittedData, setSubmittedData] = useState<BookingFormValues | null>(null);
  const [customUniversity, setCustomUniversity] = useState('');
  const [customUniversityError, setCustomUniversityError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      propertySlug: property?.slug || 'studroom-al-omrane-01',
      roomId: room?.id,
      roomName: room?.name,
      university: UNIVERSITY_OPTIONS[0].value,
      studyLevel: STUDY_LEVEL_OPTIONS[0].value,
      durationMonths: 10,
      desiredArrivalDate: new Date().toISOString().split('T')[0],
    },
  });

  const selectedUniversity = watch('university');

  useEffect(() => {
    if (selectedUniversity !== 'Autre établissement') {
      setCustomUniversityError('');
    }
  }, [selectedUniversity]);

  const onSubmit = async (data: BookingFormValues) => {
    if (data.university === 'Autre établissement' && !customUniversity.trim()) {
      setCustomUniversityError('Veuillez préciser votre établissement ou école');
      return;
    }

    setIsSubmitting(true);
    try {
      const finalUniversity =
        data.university === 'Autre établissement' && customUniversity.trim()
          ? customUniversity.trim()
          : data.university;

      const payload: BookingFormValues = {
        ...data,
        university: finalUniversity,
        ...(room ? { roomId: room.id, roomName: room.name } : {}),
      };
      const resData = await clientBookingService.submitBooking(payload);
      if (resData.success) {
        setSubmittedData(payload);
        if (resData.data?.bookingId) setBookingRef(resData.data.bookingId);
        setIsSubmitted(true);
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
      <BookingSuccessContent
        bookingRef={bookingRef}
        property={property}
        room={room}
        bookingData={submittedData}
        onClose={() => {
          setIsSubmitted(false);
          if (onClose) onClose();
        }}
      />
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
          options={UNIVERSITY_OPTIONS}
          {...register('university')}
        />

        <Select
          label="Niveau d'étude *"
          error={errors.studyLevel?.message}
          options={STUDY_LEVEL_OPTIONS}
          {...register('studyLevel')}
        />

        {selectedUniversity === 'Autre établissement' && (
          <div className="sm:col-span-2">
            <Input
              label="Précisez votre établissement ou école *"
              placeholder="ex: IFMIA Nador, CPGE, BTS, Faculté de Médecine..."
              icon={<GraduationCap className="w-4 h-4" />}
              value={customUniversity}
              onChange={(e) => {
                setCustomUniversity(e.target.value);
                if (customUniversityError) setCustomUniversityError('');
              }}
              error={customUniversityError}
              required
            />
          </div>
        )}
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
