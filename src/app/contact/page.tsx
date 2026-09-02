import React from 'react';
import { ContactForm } from '@/components/forms/contact-form';
import { Phone, Mail, MapPin, Clock, MessageSquare, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Contact — Équipe StudRoom Selouane Nador',
  description: 'Besoin d’aide ou de renseignements sur nos logements étudiants à Selouane / Nador ? Contactez l’équipe StudRoom.',
};

export default function ContactPage() {
  return (
    <div className="pt-28 pb-24 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-widest bg-brand-50 px-3.5 py-1 rounded-full border border-brand-100">
            Assistance & Équipe
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mt-3">
            Contactez StudRoom
          </h1>
          <p className="text-slate-600 text-base sm:text-lg mt-3">
            Une question sur une réservation, une visite ou un logement ? Notre équipe locale est à votre disposition.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Direct Info Cards */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-soft flex flex-col gap-6">
              <h3 className="text-xl font-extrabold text-slate-900">Coordonnées StudRoom</h3>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Adresse Bureau</h4>
                  <p className="text-slate-600 text-xs mt-0.5 leading-relaxed">
                    Secteur 3, Résidence Al Omrane, Selouane, Nador, Maroc
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">WhatsApp Direct</h4>
                  <a
                    href="https://wa.me/212634536286"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-700 text-xs font-bold hover:underline mt-0.5 inline-block"
                  >
                    +212 634 536 286 (Réponse rapide)
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Adresse Email</h4>
                  <a href="mailto:studroom50@gmail.com" className="text-brand-600 text-xs font-bold hover:underline mt-0.5 inline-block">
                    studroom50@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Horaires d'ouverture</h4>
                  <p className="text-slate-600 text-xs mt-0.5">
                    Lundi - Samedi : 09h00 - 19h00
                  </p>
                </div>
              </div>

            </div>

            {/* Quick Location Map Banner */}
            <div className="bg-brand-600 text-white p-6 rounded-3xl shadow-lg flex flex-col gap-3">
              <h4 className="font-extrabold text-base">Visites sur place à Selouane</h4>
              <p className="text-xs text-brand-100 leading-relaxed">
                Nos agents vous accueillent directement à Selouane pour visiter les appartements témoins.
              </p>
              <a
                href="https://maps.google.com/?q=Selouane+Nador"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-white hover:underline inline-flex items-center gap-1 mt-1"
              >
                Localiser l'agence sur Google Maps →
              </a>
            </div>

          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>

        </div>

      </div>
    </div>
  );
}
