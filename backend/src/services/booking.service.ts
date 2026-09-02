import { bookingRepository } from '../repositories/booking.repository';
import { propertyRepository } from '../repositories/property.repository';
import { bookingFormSchema, BookingFormValues } from '../shared/schemas/booking.schema';
import { landlordFormSchema, LandlordFormValues } from '../shared/schemas/landlord.schema';
import { contactFormSchema, ContactFormValues } from '../shared/schemas/contact.schema';
import { AppError } from '../lib/response';
import { DbBookingRequest, DbLandlordSubmission, DbContactRequest, BookingStatus } from '../shared/types/database';

// Valid booking status transitions
const VALID_BOOKING_STATUSES: BookingStatus[] = [
  'PENDING', 'CONTACTED', 'VISIT_SCHEDULED', 'APPROVED', 'REJECTED', 'CANCELLED',
];

const VALID_LANDLORD_STATUSES = ['new', 'contacted', 'approved', 'declined'] as const;
type LandlordStatus = typeof VALID_LANDLORD_STATUSES[number];

export class BookingService {
  /**
   * Process a new booking request with full server-side validation:
   * 1. Validate payload schema (Zod)
   * 2. Check room exists
   * 3. Check room is AVAILABLE
   * 4. Save to DB
   */
  async processBooking(rawPayload: unknown): Promise<{ bookingId: string; data: DbBookingRequest }> {
    const validatedData: BookingFormValues = bookingFormSchema.parse(rawPayload);

    // Server-side room availability check — never trust the frontend
    if (validatedData.roomId) {
      const room = await propertyRepository.findRoomById(validatedData.roomId);
      if (!room) {
        throw new AppError(404, 'NOT_FOUND', 'La chambre demandée est introuvable.');
      }
      if (room.status !== 'AVAILABLE') {
        throw new AppError(
          409,
          'ROOM_NOT_AVAILABLE',
          "Cette chambre n'est plus disponible à la réservation."
        );
      }
    }

    const bookingId = 'SR-BOOK-' + Math.floor(100000 + Math.random() * 900000);
    const result = await bookingRepository.saveBooking(validatedData, bookingId);
    return { bookingId, data: result };
  }

  async getAllBookings(): Promise<DbBookingRequest[]> {
    return bookingRepository.findAllBookings();
  }

  /**
   * Update booking status with strict validation.
   * Only allows transitions to valid BookingStatus values.
   */
  async updateBookingStatus(id: string, status: string): Promise<DbBookingRequest> {
    if (!VALID_BOOKING_STATUSES.includes(status as BookingStatus)) {
      throw new AppError(
        400,
        'VALIDATION_ERROR',
        `Statut invalide : "${status}". Valeurs acceptées : ${VALID_BOOKING_STATUSES.join(', ')}.`
      );
    }

    const updated = await bookingRepository.updateBookingStatus(id, status as BookingStatus);
    if (!updated) {
      throw new AppError(404, 'NOT_FOUND', 'Demande de réservation introuvable.');
    }
    return updated;
  }

  async processLandlordSubmission(
    rawPayload: unknown
  ): Promise<{ proposalId: string; data: DbLandlordSubmission }> {
    const validatedData: LandlordFormValues = landlordFormSchema.parse(rawPayload);
    const proposalId = 'SR-PROP-' + Math.floor(100000 + Math.random() * 900000);
    const result = await bookingRepository.saveLandlordSubmission(validatedData, proposalId);
    return { proposalId, data: result };
  }

  async getAllLandlordSubmissions(): Promise<DbLandlordSubmission[]> {
    return bookingRepository.findAllLandlordSubmissions();
  }

  async updateLandlordSubmissionStatus(id: string, status: string): Promise<DbLandlordSubmission> {
    if (!VALID_LANDLORD_STATUSES.includes(status as LandlordStatus)) {
      throw new AppError(
        400,
        'VALIDATION_ERROR',
        `Statut invalide : "${status}". Valeurs acceptées : ${VALID_LANDLORD_STATUSES.join(', ')}.`
      );
    }

    const updated = await bookingRepository.updateLandlordSubmissionStatus(id, status);
    if (!updated) {
      throw new AppError(404, 'NOT_FOUND', 'Proposition de logement introuvable.');
    }
    return updated;
  }

  async processContactRequest(
    rawPayload: unknown
  ): Promise<{ ticketId: string; data: DbContactRequest }> {
    const validatedData: ContactFormValues = contactFormSchema.parse(rawPayload);
    const ticketId = 'SR-TKT-' + Math.floor(100000 + Math.random() * 900000);
    const result = await bookingRepository.saveContactRequest(validatedData, ticketId);
    return { ticketId, data: result };
  }

  async getAllContactRequests(): Promise<DbContactRequest[]> {
    return bookingRepository.findAllContactRequests();
  }
}

export const bookingService = new BookingService();
