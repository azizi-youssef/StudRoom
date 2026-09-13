'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactFormSchema, ContactFormValues } from '@/shared/validation/contact.schema';
import { clientContactService } from '@/client/services/contact.service';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  CheckCircle2,
  Loader2,
  User,
  Phone,
  Mail,
  MessageSquare,
  Send,
  Sparkles,
  ShieldCheck,
  Clock,
  Check,
} from 'lucide-react';

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketRef, setTicketRef] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      subject: 'Demande de visite',
    },
  });

  const selectedSubject = watch('subject');

  const subjects = [
    'Demande de visite',
    'Renseignements logement',
    'Question réservation',
    'Espace propriétaire',
    'Autre sujet',
  ];

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    try {
      const resData = await clientContactService.submitContactTicket(data);
      if (resData.success) {
        setIsSubmitted(true);
        if (resData.data?.ticketId) setTicketRef(resData.data.ticketId);
      }
    } catch (err) {
      console.error('Contact form error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-gradient-to-b from-emerald-50/80 via-white to-emerald-50/30 dark:from-emerald-950/40 dark:via-slate-900 dark:to-emerald-950/20 border border-emerald-200 dark:border-emerald-800/80 rounded-3xl p-8 sm:p-12 text-center flex flex-col items-center gap-6 animate-fade-in shadow-sm">
        
        {/* Celebration Icon */}
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
            Message transmis
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Message bien envoyé !
          </h3>

          <p className="mt-2 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
            Merci ! Votre demande a été enregistrée. Notre équipe locale à Selouane vous répondra dans les plus brefs délais (souvent en moins de 2 heures).
          </p>
        </div>

        {ticketRef && (
          <div className="flex flex-col items-center gap-1 bg-white dark:bg-slate-800 px-5 py-3 rounded-2xl border border-emerald-200/80 dark:border-emerald-800/80 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Numéro de suivi
            </span>
            <span className="font-mono text-base font-black text-emerald-700 dark:text-emerald-400 tracking-wider">
              {ticketRef}
            </span>
          </div>
        )}

        <Button
          variant="outline"
          onClick={() => {
            setIsSubmitted(false);
            reset();
          }}
          className="text-xs font-bold rounded-full border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/50"
        >
          Envoyer un autre message
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white dark:bg-slate-900 p-6 sm:p-10 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-[0_10px_40px_-10px_rgba(15,23,42,0.08)] flex flex-col gap-6 relative overflow-hidden transition-colors"
    >
      {/* Decorative top accent line */}
      <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-primary-600 via-teal-500 to-accent-orange" />

      <div className="flex flex-col gap-1 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-1">
          <MessageSquare className="w-3.5 h-3.5" />
          Formulaire de contact direct
        </div>
        <h3 className="text-2xl font-black text-slate-900 dark:text-white">Écrivez-nous</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Une question sur un logement, une visite ou un partenariat ? Transmettez-nous votre message.
        </p>
      </div>

      {/* Quick WhatsApp Banner */}
      <a
        href="https://wa.me/212634536286?text=Bonjour%20StudRoom,%20je%20souhaite%20des%20informations%20sur%20les%20chambres%20%C3%A0%20Selouane"
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/25 transition-all duration-200"
      >
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 rounded-xl overflow-hidden shadow-xs shrink-0 border border-emerald-500/30">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/watsapp_icon.jpeg"
              alt="WhatsApp"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
          </div>
          <div className="text-left">
            <p className="text-xs font-bold text-emerald-950 dark:text-emerald-200 flex items-center gap-1.5">
              Besoin d'une réponse instantanée ?
              <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </p>
            <p className="text-[11px] text-emerald-800 dark:text-emerald-400 font-medium">
              Discutez directement sur WhatsApp &bull; Réponse &lt; 15 min
            </p>
          </div>
        </div>
        <span className="shrink-0 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-white/80 dark:bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800/80 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
          Ouvrir chat &rarr;
        </span>
      </a>

      {/* Quick Subject Chips */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
          Quel est le sujet de votre demande ? *
        </label>
        <div className="flex flex-wrap gap-2">
          {subjects.map((subj) => (
            <button
              key={subj}
              type="button"
              onClick={() => setValue('subject', subj, { shouldValidate: true })}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedSubject === subj
                  ? 'bg-primary-600 text-white shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {subj}
            </button>
          ))}
        </div>
        <input type="hidden" {...register('subject')} />
        {errors.subject && (
          <span className="text-xs text-red-500 font-medium">{errors.subject.message}</span>
        )}
      </div>

      {/* Inputs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Nom complet *"
          placeholder="ex: Amina Tazi"
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
      </div>

      <div>
        <Input
          label="Adresse Email *"
          type="email"
          placeholder="votre@email.com"
          icon={<Mail className="w-4 h-4" />}
          error={errors.email?.message}
          {...register('email')}
        />
      </div>

      {/* Message Area */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
          Votre message détaillé *
        </label>
        <textarea
          rows={4}
          placeholder="Dites-nous tout : le type de chambre recherché, la faculté fréquentée, vos dates souhaitées..."
          className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors focus:outline-none focus:border-primary-500 dark:focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20"
          {...register('message')}
        />
        {errors.message && (
          <span className="text-xs text-red-500 font-medium">{errors.message.message}</span>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex flex-col gap-3 pt-2">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={isSubmitting}
          className="w-full justify-center text-base py-4 font-bold shadow-md shadow-primary-600/25 hover:shadow-lg hover:shadow-primary-600/35 hover:-translate-y-0.5 active:scale-95 transition-all rounded-2xl"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              <span>Envoi de votre message...</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              <span>Envoyer mon message</span>
            </>
          )}
        </Button>

        {/* Guarantees */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400 pt-1">
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-primary-500" />
            Réponse rapide sous 2h à 24h
          </span>
          <span>•</span>
          <span className="inline-flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            100% Confidentialité
          </span>
        </div>
      </div>
    </form>
  );
}

