'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  Check,
  Copy,
  ArrowRight,
  X,
  Home,
  Calendar,
  Banknote,
  Bed,
} from 'lucide-react';
import { cn, formatCurrencyDH, getPropertyTypeLabel } from '@/lib/utils';
import { PropertyDetail } from '@/shared/types';
import { DbRoom } from '@/shared/types/database';
import { BookingFormValues } from '@/shared/validation/booking.schema';

export interface BookingSuccessData {
  bookingRef?: string;
  property?: PropertyDetail | { title?: string; slug?: string; min_price_dh?: number };
  room?: DbRoom | { id?: string; name?: string; room_type?: string; price_monthly?: number };
  bookingData?: Partial<BookingFormValues> | null;
}

export interface BookingSuccessProps extends BookingSuccessData {
  onClose?: () => void;
  className?: string;
}

export interface BookingSuccessModalProps extends BookingSuccessProps {
  isOpen: boolean;
}

/** Formate une date YYYY-MM-DD en français lisible (ex: 1 octobre 2026) */
export function formatDateFr(dateStr?: string): string {
  if (!dateStr) return '';
  try {
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const d = new Date(year, month, day);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

/** Construit le message WhatsApp pré-rempli sans inventer aucune donnée */
export function buildBookingWhatsAppMessage(params: {
  bookingRef?: string;
  propertyTitle?: string;
  roomName?: string;
  roomType?: string;
  price?: number;
  arrivalDate?: string;
  durationMonths?: number | string;
  studentName?: string;
}): string {
  const lines: string[] = ['Bonjour StudRoom ! 👋'];

  if (params.bookingRef) {
    lines.push(`Je viens de soumettre ma demande de réservation (Réf : ${params.bookingRef}).`);
  } else {
    lines.push("Je viens de soumettre ma demande de réservation sur StudRoom.");
  }

  const details: string[] = [];
  if (params.propertyTitle) {
    details.push(`• Logement : ${params.propertyTitle}`);
  }
  if (params.roomName) {
    const typeLabel = params.roomType ? ` (${getPropertyTypeLabel(params.roomType)})` : '';
    details.push(`• Chambre : ${params.roomName}${typeLabel}`);
  }
  if (params.price && params.price > 0) {
    details.push(`• Loyer : ${params.price} DH/mois`);
  }
  if (params.arrivalDate) {
    const formattedDate = formatDateFr(params.arrivalDate);
    const durStr = params.durationMonths ? ` (${params.durationMonths} mois)` : '';
    details.push(`• Arrivée souhaitée : ${formattedDate}${durStr}`);
  }
  if (params.studentName) {
    details.push(`• Étudiant(e) : ${params.studentName}`);
  }

  if (details.length > 0) {
    lines.push('', 'Récapitulatif de ma demande :', ...details);
  }

  lines.push('', 'Je souhaite finaliser mon dossier de réservation avec un conseiller.');
  return lines.join('\n');
}

/**
 * Contenu visuel structuré selon la hiérarchie stricte demandée :
 * ✓ Success icon
 * → “Votre demande a bien été envoyée !”
 * → concise confirmation message
 * → dynamic booking summary (room, date, price only if available)
 * → booking reference with copy button
 * → primary CTA: “Continuer sur WhatsApp →”
 * → secondary CTA: “Fermer”
 */
export function BookingSuccessContent({
  bookingRef,
  property,
  room,
  bookingData,
  onClose,
  className,
}: BookingSuccessProps) {
  const [copied, setCopied] = useState(false);
  const copyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    };
  }, []);

  const handleCopy = useCallback(async () => {
    if (!bookingRef) return;
    try {
      await navigator.clipboard.writeText(bookingRef);
      setCopied(true);
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }, [bookingRef]);

  // Extraction stricte des données disponibles (aucune donnée inventée)
  const propertyTitle = property?.title?.trim();
  const roomName = room?.name?.trim();
  const roomType = room?.room_type?.trim();
  const price = room?.price_monthly ?? property?.min_price_dh;
  const arrivalDate = bookingData?.desiredArrivalDate?.trim();
  const durationMonths = bookingData?.durationMonths;
  const studentName = [bookingData?.firstName, bookingData?.lastName]
    .filter(Boolean)
    .join(' ')
    .trim();

  const hasRoomOrProperty = Boolean(roomName || propertyTitle);
  const hasDateOrDuration = Boolean(arrivalDate || durationMonths);
  const hasPrice = typeof price === 'number' && price > 0;
  const hasSummary = hasRoomOrProperty || hasDateOrDuration || hasPrice;

  // Numéro WhatsApp officiel StudRoom
  const whatsappNumber = '212634536286';
  const prefilledText = buildBookingWhatsAppMessage({
    bookingRef,
    propertyTitle,
    roomName,
    roomType,
    price: hasPrice ? price : undefined,
    arrivalDate,
    durationMonths,
    studentName: studentName || undefined,
  });
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(prefilledText)}`;

  return (
    <div
      className={cn(
        'w-full flex flex-col items-center text-center animate-fade-in transition-all',
        className
      )}
    >
      {/* 1. ✓ Success icon */}
      <div className="relative mb-3 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-md animate-pulse" />
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border-2 border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-lg shadow-emerald-500/15">
          <Check className="w-8 h-8 sm:w-10 sm:h-10 stroke-[3]" />
        </div>
      </div>

      {/* 2. → “Votre demande a bien été envoyée !” */}
      <h2
        id="booking-success-title"
        className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-snug"
      >
        Votre demande a bien été envoyée !
      </h2>

      {/* 3. → concise confirmation message */}
      <p
        id="booking-success-desc"
        className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-sm mt-1.5 mb-5"
      >
        Notre équipe traite votre dossier en priorité. Un conseiller StudRoom
        vous contactera très prochainement pour finaliser votre réservation.
      </p>

      {/* 4. → dynamic booking summary (room, date, price only if available) */}
      {hasSummary && (
        <div className="w-full bg-slate-50/90 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-4 text-xs space-y-2.5 mb-4 text-left shadow-2xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-700/60">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-400">
              Récapitulatif de la demande
            </span>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-900/40 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Transmise
            </span>
          </div>

          {/* Logement */}
          {propertyTitle && (
            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5 shrink-0">
                <Home className="w-3.5 h-3.5 text-[#046C7A] dark:text-[#0891B2]" />
                Logement
              </span>
              <span className="font-bold text-slate-900 dark:text-slate-100 text-right truncate max-w-[210px] sm:max-w-[260px]">
                {propertyTitle}
              </span>
            </div>
          )}

          {/* Chambre */}
          {roomName && (
            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5 shrink-0">
                <Bed className="w-3.5 h-3.5 text-[#046C7A] dark:text-[#0891B2]" />
                Chambre
              </span>
              <span className="font-bold text-slate-900 dark:text-slate-100 text-right truncate max-w-[210px] sm:max-w-[260px]">
                {roomName}
                {roomType && (
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 ml-1">
                    ({getPropertyTypeLabel(roomType)})
                  </span>
                )}
              </span>
            </div>
          )}

          {/* Date d'arrivée & Durée */}
          {hasDateOrDuration && (
            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5 shrink-0">
                <Calendar className="w-3.5 h-3.5 text-[#046C7A] dark:text-[#0891B2]" />
                Arrivée souhaitée
              </span>
              <span className="font-bold text-slate-900 dark:text-slate-100 text-right">
                {arrivalDate ? formatDateFr(arrivalDate) : ''}
                {durationMonths ? (
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 ml-1">
                    • {durationMonths} mois
                  </span>
                ) : null}
              </span>
            </div>
          )}

          {/* Loyer */}
          {hasPrice && (
            <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
              <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5 shrink-0">
                <Banknote className="w-3.5 h-3.5 text-[#046C7A] dark:text-[#0891B2]" />
                Loyer
              </span>
              <span className="font-black text-[#046C7A] dark:text-[#22D3EE] text-sm">
                {formatCurrencyDH(price)}
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  {' '}/ mois
                </span>
              </span>
            </div>
          )}
        </div>
      )}

      {/* 5. → booking reference with copy button */}
      {bookingRef && (
        <div className="w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-2xl bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/80 mb-5">
          <div className="flex flex-col min-w-0 text-left">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-400">
              Référence dossier
            </span>
            <span className="font-mono text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100 tracking-wide truncate">
              {bookingRef}
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className={cn(
              'px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#0891B2]/50 cursor-pointer shadow-2xs',
              copied
                ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-500'
                : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600'
            )}
            aria-label={copied ? 'Référence copiée' : 'Copier la référence de réservation'}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Copié ✓</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                <span>Copier</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* 6. → primary CTA: “Continuer sur WhatsApp →” & 7. → secondary CTA: “Fermer” */}
      <div className="w-full flex flex-col gap-2.5">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#046C7A] to-[#0891B2] hover:from-[#035864] hover:to-[#077e9b] text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:shadow-primary-900/20 active:scale-[0.99] transition-all focus:outline-none focus:ring-4 focus:ring-[#0891B2]/30 group cursor-pointer"
        >
          {/* WhatsApp icon svg */}
          <svg
            className="w-5 h-5 fill-current shrink-0"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.073-2.072-.5-1.763-.733-2.887-2.529-2.975-2.646-.087-.116-.708-.941-.708-1.796 0-.855.449-1.277.609-1.45.16-.173.348-.217.464-.217.116 0 .232.001.333.006.106.005.249-.04.39.299.144.348.491 1.199.536 1.288.045.088.073.191.013.306-.058.116-.087.188-.173.289-.086.1-.182.224-.26.301-.086.086-.176.18-.076.353.1.173.444.733.953 1.187.656.584 1.21.765 1.383.852.173.087.275.073.376-.044.101-.116.433-.505.549-.679.116-.173.232-.144.39-.087s1.011.477 1.184.564.289.13.333.203c.044.072.044.419-.1 1.024z" />
          </svg>
          <span>Continuer sur WhatsApp</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </a>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-xs sm:text-sm transition-colors text-center focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-600 cursor-pointer"
          >
            Fermer
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Standalone accessible Modal Dialog with:
 * - subtle fade/scale animation
 * - dark blurred backdrop
 * - responsive mobile layout
 * - keyboard accessibility (Tab focus trap & Escape-to-close)
 * - WCAG AA contrast
 * - createPortal for rendering cleanly over the DOM
 */
export function BookingSuccessModal({
  isOpen,
  onClose,
  bookingRef,
  property,
  room,
  bookingData,
}: BookingSuccessModalProps) {
  const [mounted, setMounted] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Keyboard accessibility: Escape-to-close + Focus trap + Body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    // Save previous active element to restore upon close
    previouslyFocusedElementRef.current = document.activeElement as HTMLElement | null;

    // Lock body scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus first focusable interactive element inside the modal
    const timer = setTimeout(() => {
      if (!dialogRef.current) return;
      const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length > 0) {
        // Focus the primary action (WhatsApp button if found) or first element
        const primaryAction = dialogRef.current.querySelector<HTMLElement>('a[href^="https://wa.me"]');
        if (primaryAction) {
          primaryAction.focus();
        } else {
          focusableElements[0].focus();
        }
      }
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape to close
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose?.();
        return;
      }

      // Focus trap on Tab key
      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const firstEl = focusable[0];
        const lastEl = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstEl) {
            e.preventDefault();
            lastEl.focus();
          }
        } else {
          if (document.activeElement === lastEl) {
            e.preventDefault();
            firstEl.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
      previouslyFocusedElementRef.current?.focus?.();
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const modalNode = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-success-title"
      aria-describedby="booking-success-desc"
    >
      {/* Dark blurred backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal card with subtle fade/scale animation */}
      <div
        ref={dialogRef}
        className="relative z-10 w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xl p-6 sm:p-8 flex flex-col items-center transform transition-all duration-300 ease-out animate-in fade-in zoom-in-95 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button X in top right */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0891B2]/40 cursor-pointer"
            aria-label="Fermer la modal"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Content */}
        <BookingSuccessContent
          bookingRef={bookingRef}
          property={property}
          room={room}
          bookingData={bookingData}
          onClose={onClose}
        />
      </div>
    </div>
  );

  return createPortal(modalNode, document.body);
}
