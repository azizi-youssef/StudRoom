'use client';

import React, { useState } from 'react';
import { PropertyDetail } from '@/shared/types';
import { formatCurrencyDH } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { BookingForm } from '@/components/forms/booking-form';
import { ShieldCheck, PhoneCall, Sparkles } from 'lucide-react';

interface StickyBookingBarProps {
  property: PropertyDetail;
}

export function StickyBookingBar({ property }: StickyBookingBarProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar Action Card */}
      <div className="hidden lg:flex flex-col gap-6 p-6 rounded-3xl bg-white border border-slate-200 shadow-xl sticky top-28">
        
        <div className="flex items-baseline justify-between pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">À partir de</span>
            <div className="text-3xl font-black text-primary-600">
              {formatCurrencyDH(property.min_price_dh)}
              <span className="text-xs font-semibold text-slate-500"> / mois</span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800">
            {property.available_rooms} chambre{property.available_rooms > 1 ? 's' : ''} dispo
          </span>
        </div>

        <div className="flex flex-col gap-3 text-xs font-semibold text-slate-600">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Aucuns frais de dossier cachés</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary-500" />
            <span>Bail étudiant direct StudRoom</span>
          </div>
          <div className="flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-primary-500" />
            <span>Assistance & maintenance 7j/7</span>
          </div>
        </div>

        <Button
          variant="primary"
          size="lg"
          onClick={() => setModalOpen(true)}
          className="w-full justify-center font-extrabold py-4 text-base shadow-hover"
        >
          Demander ce logement →
        </Button>

        <a
          href="https://wa.me/212600000000"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full text-center text-xs font-bold text-slate-600 hover:text-primary-600 transition-colors"
        >
          Pose tes questions sur WhatsApp →
        </a>
      </div>

      {/* Mobile Sticky Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-4 shadow-2xl flex items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase">Loyer dès</span>
          <div className="text-lg font-black text-primary-600 leading-tight">
            {formatCurrencyDH(property.min_price_dh)}
            <span className="text-[10px] font-semibold text-slate-500"> /mois</span>
          </div>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setModalOpen(true)}
          className="font-bold text-sm px-6 shadow-soft"
        >
          Demander ce logement
        </Button>
      </div>

      {/* Modal Dialog for Form */}
      <Dialog isOpen={modalOpen} onClose={() => setModalOpen(false)} maxWidth="lg">
        <BookingForm property={property} onSuccess={() => {}} />
      </Dialog>
    </>
  );
}
