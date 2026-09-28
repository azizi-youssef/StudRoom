import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  BookingSuccessContent,
  buildBookingWhatsAppMessage,
  formatDateFr,
} from '@/components/forms/booking-success-modal';

describe('BookingSuccessModal & Content', () => {
  const mockBookingData = {
    firstName: 'Youssef',
    lastName: 'El Mansouri',
    phone: '0612345678',
    email: 'youssef@studroom.ma',
    desiredArrivalDate: '2026-10-01',
    durationMonths: 10,
  };

  const mockProperty = {
    id: 'p-1',
    title: 'Résidence Al Omrane',
    slug: 'residence-al-omrane-01',
    min_price_dh: 1200,
  } as any;

  const mockRoom = {
    id: 'r-1',
    name: 'Chambre Simple A',
    room_type: 'room_private',
    price_monthly: 1400,
  } as any;

  describe('Visual Hierarchy & Rendering', () => {
    it('renders the complete required hierarchy', () => {
      const handleClose = jest.fn();

      render(
        <BookingSuccessContent
          bookingRef="BR-2026-TEST"
          property={mockProperty}
          room={mockRoom}
          bookingData={mockBookingData}
          onClose={handleClose}
        />
      );

      // 1. Success heading
      expect(
        screen.getByRole('heading', { name: /Votre demande a bien été envoyée !/i })
      ).toBeInTheDocument();

      // 2. Concise confirmation message
      expect(
        screen.getByText(/Notre équipe traite votre dossier en priorité/i)
      ).toBeInTheDocument();

      // 3. Dynamic booking summary
      expect(screen.getByText('Récapitulatif de la demande')).toBeInTheDocument();
      expect(screen.getByText('Résidence Al Omrane')).toBeInTheDocument();
      expect(screen.getByText(/Chambre Simple A/i)).toBeInTheDocument();
      expect(screen.getByText(/1.*400.*DH/i)).toBeInTheDocument();

      // 4. Booking reference & Copy button
      expect(screen.getByText('BR-2026-TEST')).toBeInTheDocument();
      const copyBtn = screen.getByRole('button', { name: /Copier la référence/i });
      expect(copyBtn).toBeInTheDocument();

      // 5. Primary CTA WhatsApp
      const whatsappBtn = screen.getByRole('link', { name: /Continuer sur WhatsApp/i });
      expect(whatsappBtn).toBeInTheDocument();
      expect(whatsappBtn).toHaveAttribute('href');
      expect(whatsappBtn.getAttribute('href')).toContain('https://wa.me/212634536286');
      expect(whatsappBtn.getAttribute('href')).toContain('BR-2026-TEST');

      // 6. Secondary CTA Fermer
      const closeBtn = screen.getByRole('button', { name: 'Fermer' });
      expect(closeBtn).toBeInTheDocument();
      fireEvent.click(closeBtn);
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('renders dynamic summary only for provided fields without inventing data', () => {
      render(
        <BookingSuccessContent
          bookingRef="BR-MINIMAL"
          property={{ title: 'Studio Centre Selouane' } as any}
        />
      );

      // Logement is present
      expect(screen.getByText('Studio Centre Selouane')).toBeInTheDocument();

      // Room and Date should NOT be in the summary
      expect(screen.queryByText(/Chambre/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Arrivée souhaitée/i)).not.toBeInTheDocument();
    });

    it('handles clipboard copy with Copié ✓ feedback', async () => {
      // Mock clipboard
      Object.assign(navigator, {
        clipboard: {
          writeText: jest.fn().mockImplementation(() => Promise.resolve()),
        },
      });

      render(
        <BookingSuccessContent
          bookingRef="BR-COPY-123"
          onClose={() => {}}
        />
      );

      const copyBtn = screen.getByRole('button', { name: /Copier la référence/i });
      fireEvent.click(copyBtn);

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('BR-COPY-123');
      expect(await screen.findByText('Copié ✓')).toBeInTheDocument();
    });
  });

  describe('buildBookingWhatsAppMessage', () => {
    it('generates accurate prefilled message with real booking details', () => {
      const msg = buildBookingWhatsAppMessage({
        bookingRef: 'BR-999',
        propertyTitle: 'Résidence Al Omrane',
        roomName: 'Chambre 101',
        roomType: 'room_private',
        price: 1300,
        arrivalDate: '2026-10-01',
        durationMonths: 10,
        studentName: 'Youssef El Mansouri',
      });

      expect(msg).toContain('Réf : BR-999');
      expect(msg).toContain('• Logement : Résidence Al Omrane');
      expect(msg).toContain('• Chambre : Chambre 101');
      expect(msg).toContain('• Loyer : 1300 DH/mois');
      expect(msg).toContain('• Arrivée souhaitée : 1 octobre 2026 (10 mois)');
      expect(msg).toContain('• Étudiant(e) : Youssef El Mansouri');
    });

    it('does not invent data when parameters are missing', () => {
      const msg = buildBookingWhatsAppMessage({
        bookingRef: 'BR-SIMPLE',
      });

      expect(msg).toContain('Réf : BR-SIMPLE');
      expect(msg).not.toContain('Logement :');
      expect(msg).not.toContain('Chambre :');
      expect(msg).not.toContain('Loyer :');
      expect(msg).not.toContain('Étudiant :');
    });
  });

  describe('formatDateFr', () => {
    it('formats YYYY-MM-DD properly into French long date', () => {
      expect(formatDateFr('2026-10-01')).toBe('1 octobre 2026');
      expect(formatDateFr('2026-09-15')).toBe('15 septembre 2026');
      expect(formatDateFr('')).toBe('');
    });
  });
});
