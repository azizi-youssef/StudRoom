'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactFormSchema, ContactFormValues } from '@/shared/validation/contact.schema';
import { clientContactService } from '@/client/services/contact.service';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Loader2, User, Phone, Mail, MessageSquare, Send } from 'lucide-react';

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketRef, setTicketRef] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
  });

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
      <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 text-center flex flex-col items-center gap-4 animate-fade-in my-6">
        <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h3 className="text-2xl font-black text-slate-900">Message envoyé !</h3>
        <p className="text-slate-700 text-base max-w-md leading-relaxed font-medium">
          Merci ! Votre message a bien été transmis à l'équipe StudRoom Selouane. Nous vous répondrons dans les plus brefs délais.
        </p>
        {ticketRef && (
          <span className="inline-block bg-white px-4 py-2 rounded-xl text-xs font-mono font-bold text-slate-700 border border-emerald-200 shadow-sm">
            Numéro de ticket : {ticketRef}
          </span>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl flex flex-col gap-6">
      <div className="flex flex-col gap-1 border-b border-slate-100 pb-4">
        <h3 className="text-2xl font-black text-slate-900">Contactez l'équipe StudRoom</h3>
        <p className="text-xs text-slate-500">
          Une question sur un logement, une visite ou un partenariat ? Écrivez-nous.
        </p>
      </div>

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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Adresse Email *"
          type="email"
          placeholder="votre@email.com"
          icon={<Mail className="w-4 h-4" />}
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Sujet de votre message *"
          placeholder="ex: Renseignement visite"
          icon={<MessageSquare className="w-4 h-4" />}
          error={errors.subject?.message}
          {...register('subject')}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">
          Votre message *
        </label>
        <textarea
          rows={4}
          placeholder="Posez-nous vos questions ici..."
          className="w-full bg-white border border-slate-200 rounded-xl p-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          {...register('message')}
        />
        {errors.message && (
          <span className="text-xs text-red-500 font-medium">{errors.message.message}</span>
        )}
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={isSubmitting}
        className="w-full justify-center text-base py-3.5 font-bold"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Envoi du message...
          </>
        ) : (
          <>
            <Send className="w-5 h-5 mr-2" />
            Envoyer mon message
          </>
        )}
      </Button>
    </form>
  );
}
